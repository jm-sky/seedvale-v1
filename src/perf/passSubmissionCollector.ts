import {
  BufferGeometry,
  Camera,
  InstancedMesh,
  type Material,
  type Object3D,
  type Scene,
  type WebGLRenderer,
} from 'three'
import {
  classifyObject,
  classifySettlementContent,
  type SceneBucket,
  type SettlementContentKind,
} from './sceneCensus'

/**
 * Opt-in collector of *actual* WebGL draw submissions during discrete render
 * passes (mirror / shadow / main). Attributes draws via a live
 * `WebGLRenderer.renderBufferDirect` wrap — not scene-census estimates and
 * not `renderer.info` arithmetic against census.
 *
 * Disabled by default. Must be explicitly enabled for a benchmark/diag
 * window and {@link PassSubmissionCollector.disable}d / {@link PassSubmissionCollector.dispose}d
 * on end, error, rebuild, or dispose.
 *
 * @domain world-terrain
 */

export type PassKind = 'mirror' | 'shadow' | 'main'

export type SubmissionBucketKey =
  | SceneBucket
  | `settlement:${SettlementContentKind}`
  | `npcFamily:${string}`
  | `faunaFamily:${string}`

export type SubmissionBucketStats = {
  calls: number
  triangles: number
}

export type PassFrameStats = {
  calls: number
  triangles: number
  byBucket: Record<string, SubmissionBucketStats>
  residualCalls: number
  residualTriangles: number
  /** `renderer.info` delta for this pass (ground truth for totals). */
  infoCalls: number
  infoTriangles: number
}

export type PassAggregate = {
  frames: number
  callsSum: number
  trianglesSum: number
  callsAvg: number
  trianglesAvg: number
  byBucket: Record<string, { callsAvg: number; trianglesAvg: number; callsSum: number; trianglesSum: number }>
  residualCallsAvg: number
  residualTrianglesAvg: number
  infoCallsAvg: number
  infoTrianglesAvg: number
}

export type PassSubmissionReliability = 'observed' | 'unverified' | 'disabled'

export type PassSubmissionReport = {
  reliability: PassSubmissionReliability
  reliabilityReason: string | null
  frames: number
  shadowRefreshFrames: number
  shadowSkippedFrames: number
  mirror: PassAggregate | null
  shadow: PassAggregate | null
  main: PassAggregate | null
}

type RenderBufferDirect = (
  camera: Camera,
  scene: Scene,
  geometry: BufferGeometry,
  material: Material,
  object: Object3D,
  group: unknown,
) => void

type MutableRenderer = WebGLRenderer & {
  renderBufferDirect: RenderBufferDirect
}

export type PassSubmissionCollector = {
  isEnabled: () => boolean
  enable: (renderer: WebGLRenderer) => void
  disable: () => void
  dispose: () => void
  beginSession: () => void
  endSession: () => PassSubmissionReport
  /** Call once at the start of the frame's render section (after info.reset). */
  beginFrame: () => void
  /** Bracket a discrete render call (mirror or beauty). */
  withPass: <T>(kind: 'mirror' | 'main', beautyCamera: Camera | null, fn: () => T) => T
  /** Record whether this frame requested a shadow-map refresh. */
  noteShadowRefresh: (wanted: boolean) => void
  endFrame: () => void
}

const EMPTY_AGG: PassAggregate = {
  frames: 0,
  callsSum: 0,
  trianglesSum: 0,
  callsAvg: 0,
  trianglesAvg: 0,
  byBucket: {},
  residualCallsAvg: 0,
  residualTrianglesAvg: 0,
  infoCallsAvg: 0,
  infoTrianglesAvg: 0,
}

function emptyBucket(): SubmissionBucketStats {
  return { calls: 0, triangles: 0 }
}

function emptyPassFrame(): PassFrameStats {
  return {
    calls: 0,
    triangles: 0,
    byBucket: {},
    residualCalls: 0,
    residualTriangles: 0,
    infoCalls: 0,
    infoTriangles: 0,
  }
}

function classifySubmission(object: Object3D): SubmissionBucketKey {
  const bucket = classifyObject(object)
  if (bucket === 'settlement') {
    return `settlement:${classifySettlementContent(object)}`
  }
  if (bucket === 'npc' || bucket === 'fauna') {
    let node: Object3D | null = object
    while (node) {
      if (node.name === 'npc' || node.name === 'fauna') {
        const tag = bucket === 'fauna' ? node.userData.animalKind : node.userData.npcFamily
        const family = typeof tag === 'string' ? tag : 'unknown'
        return bucket === 'npc' ? `npcFamily:${family}` : `faunaFamily:${family}`
      }
      node = node.parent
    }
  }
  return bucket
}

function triangleCountForDraw(
  object: Object3D,
  geometry: BufferGeometry,
  group: { start?: number; count?: number } | null,
): number {
  const index = geometry.index
  const position = geometry.getAttribute('position')
  let verts: number
  if (group && typeof group.count === 'number' && group.count >= 0) {
    verts = group.count
  } else if (index) {
    verts = index.count
  } else {
    verts = position?.count ?? 0
  }
  const prims = verts / 3
  if (object instanceof InstancedMesh) {
    // Actual submissions: zero-count instances draw nothing.
    return prims * Math.max(0, object.count)
  }
  return prims
}

function accumulatePass(
  target: { frames: number; callsSum: number; trianglesSum: number; residualCallsSum: number; residualTrianglesSum: number; infoCallsSum: number; infoTrianglesSum: number; byBucket: Map<string, SubmissionBucketStats> },
  frame: PassFrameStats,
): void {
  target.frames += 1
  target.callsSum += frame.calls
  target.trianglesSum += frame.triangles
  target.residualCallsSum += frame.residualCalls
  target.residualTrianglesSum += frame.residualTriangles
  target.infoCallsSum += frame.infoCalls
  target.infoTrianglesSum += frame.infoTriangles
  for (const [key, stats] of Object.entries(frame.byBucket)) {
    const row = target.byBucket.get(key) ?? emptyBucket()
    row.calls += stats.calls
    row.triangles += stats.triangles
    target.byBucket.set(key, row)
  }
}

function finalizeAgg(acc: {
  frames: number
  callsSum: number
  trianglesSum: number
  residualCallsSum: number
  residualTrianglesSum: number
  infoCallsSum: number
  infoTrianglesSum: number
  byBucket: Map<string, SubmissionBucketStats>
} | null): PassAggregate | null {
  if (!acc || acc.frames <= 0) return null
  const n = acc.frames
  const byBucket: PassAggregate['byBucket'] = {}
  for (const [key, stats] of acc.byBucket) {
    byBucket[key] = {
      callsSum: stats.calls,
      trianglesSum: stats.triangles,
      callsAvg: Math.round(stats.calls / n),
      trianglesAvg: Math.round(stats.triangles / n),
    }
  }
  return {
    frames: n,
    callsSum: acc.callsSum,
    trianglesSum: acc.trianglesSum,
    callsAvg: Math.round(acc.callsSum / n),
    trianglesAvg: Math.round(acc.trianglesSum / n),
    byBucket,
    residualCallsAvg: Math.round(acc.residualCallsSum / n),
    residualTrianglesAvg: Math.round(acc.residualTrianglesSum / n),
    infoCallsAvg: Math.round(acc.infoCallsSum / n),
    infoTrianglesAvg: Math.round(acc.infoTrianglesSum / n),
  }
}

function newPassAcc() {
  return {
    frames: 0,
    callsSum: 0,
    trianglesSum: 0,
    residualCallsSum: 0,
    residualTrianglesSum: 0,
    infoCallsSum: 0,
    infoTrianglesSum: 0,
    byBucket: new Map<string, SubmissionBucketStats>(),
  }
}

export function createPassSubmissionCollector(): PassSubmissionCollector {
  let enabled = false
  let renderer: MutableRenderer | null = null
  let originalRenderBufferDirect: RenderBufferDirect | null = null

  let activePass: PassKind | null = null
  let beautyCamera: Camera | null = null
  let current: PassFrameStats | null = null
  let infoAtPassStart = { calls: 0, triangles: 0 }
  let shadowWanted = false

  let sessionActive = false
  let sessionFrames = 0
  let shadowRefreshFrames = 0
  let shadowSkippedFrames = 0
  let mirrorAcc = newPassAcc()
  let shadowAcc = newPassAcc()
  let mainAcc = newPassAcc()
  let unverifiedReason: string | null = null

  function unwrap(): void {
    if (renderer && originalRenderBufferDirect) {
      renderer.renderBufferDirect = originalRenderBufferDirect
    }
    renderer = null
    originalRenderBufferDirect = null
    activePass = null
    current = null
    beautyCamera = null
  }

  function recordDraw(
    camera: Camera,
    geometry: BufferGeometry,
    _material: Material,
    object: Object3D,
    group: unknown,
  ): void {
    if (!current || !activePass) return
    let pass = activePass
    // During beauty, Three may render shadow maps first with a different camera.
    if (pass === 'main' && beautyCamera && camera !== beautyCamera) {
      pass = 'shadow'
    }
    if (pass === 'shadow' && !shadowWanted) {
      // Unexpected shadow draw while refresh was not requested — still count
      // under shadow but flag reliability later if info reconciliation fails.
    }
    const tris = triangleCountForDraw(
      object,
      geometry,
      group && typeof group === 'object' ? (group as { start?: number; count?: number }) : null,
    )
    // Zero-instance InstancedMesh: Three may still call renderBufferDirect in
    // some paths; count a call only when something would actually rasterize.
    const draws = object instanceof InstancedMesh && object.count <= 0 ? 0 : 1
    if (draws === 0 && tris === 0) return

    const target = pass === activePass ? current : ensureShadowScratch()
    if (pass !== activePass && activePass === 'main') {
      // Attribute to shadow scratch accumulated into shadowAcc at endPass via
      // a side channel — use frame-local shadowScratch.
      shadowScratch.calls += draws
      shadowScratch.triangles += tris
      const key = classifySubmission(object)
      const row = shadowScratch.byBucket[key] ?? emptyBucket()
      row.calls += draws
      row.triangles += tris
      shadowScratch.byBucket[key] = row
      return
    }

    target.calls += draws
    target.triangles += tris
    const key = classifySubmission(object)
    const row = target.byBucket[key] ?? emptyBucket()
    row.calls += draws
    row.triangles += tris
    target.byBucket[key] = row
  }

  let shadowScratch = emptyPassFrame()

  function ensureShadowScratch(): PassFrameStats {
    return shadowScratch
  }

  function install(r: WebGLRenderer): void {
    unwrap()
    const mutable = r as MutableRenderer
    // Keep the exact previous function identity so disable/dispose can restore
    // it with `===` (important for tests and for layered wrappers).
    originalRenderBufferDirect = mutable.renderBufferDirect
    mutable.renderBufferDirect = (camera, scene, geometry, material, object, group) => {
      if (enabled && activePass && current) {
        recordDraw(camera, geometry, material, object, group)
      }
      return originalRenderBufferDirect!.call(mutable, camera, scene, geometry, material, object, group)
    }
    renderer = mutable
  }

  function closePass(): void {
    if (!current || !renderer || !activePass) {
      activePass = null
      current = null
      return
    }
    const info = renderer.info.render
    current.infoCalls = info.calls - infoAtPassStart.calls
    current.infoTriangles = info.triangles - infoAtPassStart.triangles
    // Prefer info totals as pass ground truth; classified draws explain them.
    const classifiedCalls = current.calls
    const classifiedTris = current.triangles
    current.residualCalls = current.infoCalls - classifiedCalls
    current.residualTriangles = current.infoTriangles - classifiedTris
    // Use info totals as reported pass size when available.
    if (current.infoCalls > 0 || current.infoTriangles > 0) {
      current.calls = current.infoCalls
      current.triangles = current.infoTriangles
    }
    if (
      Math.abs(current.residualCalls) > 2
      || (current.infoCalls > 0 && Math.abs(current.residualCalls) / Math.max(1, current.infoCalls) > 0.25)
    ) {
      unverifiedReason = unverifiedReason
        ?? `pass ${activePass}: classified calls (${classifiedCalls}) diverge from renderer.info (${current.infoCalls})`
    }

    if (activePass === 'mirror') accumulatePass(mirrorAcc, current)
    else if (activePass === 'main') {
      accumulatePass(mainAcc, current)
      if (shadowWanted && (shadowScratch.calls > 0 || shadowScratch.infoCalls > 0)) {
        // Shadow draws were attributed during main; info delta for shadow is
        // not separately available — mark shadow totals from classified only.
        shadowScratch.infoCalls = shadowScratch.calls
        shadowScratch.infoTriangles = shadowScratch.triangles
        shadowScratch.residualCalls = 0
        shadowScratch.residualTriangles = 0
        accumulatePass(shadowAcc, shadowScratch)
      }
    }

    activePass = null
    current = null
    beautyCamera = null
  }

  return {
    isEnabled: () => enabled,
    enable(r) {
      enabled = true
      install(r)
    },
    disable() {
      enabled = false
      unwrap()
    },
    dispose() {
      enabled = false
      unwrap()
      sessionActive = false
    },
    beginSession() {
      sessionActive = true
      sessionFrames = 0
      shadowRefreshFrames = 0
      shadowSkippedFrames = 0
      mirrorAcc = newPassAcc()
      shadowAcc = newPassAcc()
      mainAcc = newPassAcc()
      unverifiedReason = null
      shadowScratch = emptyPassFrame()
    },
    endSession() {
      closePass()
      sessionActive = false
      if (!enabled && sessionFrames === 0 && mirrorAcc.frames === 0 && mainAcc.frames === 0) {
        return {
          reliability: 'disabled',
          reliabilityReason: 'collector was not enabled',
          frames: 0,
          shadowRefreshFrames: 0,
          shadowSkippedFrames: 0,
          mirror: null,
          shadow: null,
          main: null,
        }
      }
      const reliability: PassSubmissionReliability = unverifiedReason
        ? 'unverified'
        : (mainAcc.frames > 0 || mirrorAcc.frames > 0 ? 'observed' : 'unverified')
      return {
        reliability,
        reliabilityReason: unverifiedReason
          ?? (reliability === 'unverified' ? 'no observed pass frames' : null),
        frames: sessionFrames,
        shadowRefreshFrames,
        shadowSkippedFrames,
        mirror: finalizeAgg(mirrorAcc),
        shadow: finalizeAgg(shadowAcc),
        main: finalizeAgg(mainAcc),
      }
    },
    beginFrame() {
      if (!enabled || !sessionActive) return
      shadowWanted = false
      shadowScratch = emptyPassFrame()
    },
    withPass(kind, cam, fn) {
      if (!enabled || !sessionActive || !renderer) return fn()
      closePass()
      activePass = kind
      beautyCamera = kind === 'main' ? cam : null
      current = emptyPassFrame()
      infoAtPassStart = {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      }
      try {
        return fn()
      } finally {
        closePass()
      }
    },
    noteShadowRefresh(wanted) {
      if (!enabled || !sessionActive) return
      shadowWanted = wanted
    },
    endFrame() {
      if (!enabled || !sessionActive) return
      closePass()
      sessionFrames += 1
      if (shadowWanted) shadowRefreshFrames += 1
      else shadowSkippedFrames += 1
    },
  }
}

let activeCollector: PassSubmissionCollector | null = null

export function setActivePassSubmissionCollector(collector: PassSubmissionCollector | null): void {
  activeCollector = collector
}

export function getPassSubmissionCollector(): PassSubmissionCollector | null {
  return activeCollector
}

export function formatPassSubmissionReport(report: PassSubmissionReport): string {
  const lines = [
    '[Seedvale Pass Submissions]',
    '',
    `Reliability: ${report.reliability}${report.reliabilityReason ? ` (${report.reliabilityReason})` : ''}`,
    `Frames: ${report.frames}`,
    `Shadow refresh frames: ${report.shadowRefreshFrames}`,
    `Shadow skipped frames: ${report.shadowSkippedFrames}`,
    '',
  ]
  const section = (label: string, agg: PassAggregate | null): void => {
    lines.push(`${label}:`)
    if (!agg) {
      lines.push('  (none)')
      lines.push('')
      return
    }
    lines.push(`  calls avg: ${agg.callsAvg}  tris avg: ${agg.trianglesAvg}`)
    lines.push(`  info calls avg: ${agg.infoCallsAvg}  residual calls avg: ${agg.residualCallsAvg}`)
    const keys = Object.keys(agg.byBucket).sort()
    for (const key of keys) {
      const row = agg.byBucket[key]!
      lines.push(`  ${key.padEnd(28)} calls=${row.callsAvg} tris=${row.trianglesAvg}`)
    }
    lines.push('')
  }
  section('Mirror', report.mirror)
  section('Shadow (refresh only)', report.shadow)
  section('Main', report.main)
  return lines.join('\n')
}

/** Test helper — empty aggregate placeholder. */
export function emptyPassSubmissionReport(): PassSubmissionReport {
  return {
    reliability: 'disabled',
    reliabilityReason: 'collector was not enabled',
    frames: 0,
    shadowRefreshFrames: 0,
    shadowSkippedFrames: 0,
    mirror: { ...EMPTY_AGG },
    shadow: null,
    main: null,
  }
}
