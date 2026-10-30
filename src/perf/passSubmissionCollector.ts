import {
  BufferGeometry,
  Camera,
  InstancedMesh,
  type Material,
  type Object3D,
  type Scene,
  type Skeleton,
  type SkinnedMesh,
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

/**
 * Per-pass state-change and skinning counters (queue Q6 / A0): what an actor
 * submission costs beyond its draw call. Counted from the same
 * `renderBufferDirect` wrap — no extra renderer patching.
 *
 * - `materialSwitches` / `programSwitches`: consecutive draws in the pass
 *   whose material object / linked `WebGLProgram` differs from the previous
 *   draw (Three dedups `useProgram`, so a program switch is a real GL bind).
 * - `actor*`: the subset where the incoming draw is an NPC/fauna draw.
 * - `skinnedCalls`: draws of `SkinnedMesh`.
 * - `skeletonsFirstUsed`: distinct skeletons first drawn in this pass this
 *   frame. Three runs `Skeleton.update()` (bone palette + bone texture
 *   upload) once per skeleton per render call, so on frames where actors are
 *   drawn by a single render call this equals the per-frame update count.
 */
export type PassCostStats = {
  materialSwitches: number
  programSwitches: number
  actorCalls: number
  actorMaterialSwitches: number
  actorProgramSwitches: number
  skinnedCalls: number
  skeletonsFirstUsed: number
}

export type PassFrameStats = {
  calls: number
  triangles: number
  cost: PassCostStats
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
  /** Per-frame averages of {@link PassCostStats}, rounded to 0.1. */
  costAvg: PassCostStats
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

type MaterialProperties = { currentProgram?: unknown }

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

function emptyCost(): PassCostStats {
  return {
    materialSwitches: 0,
    programSwitches: 0,
    actorCalls: 0,
    actorMaterialSwitches: 0,
    actorProgramSwitches: 0,
    skinnedCalls: 0,
    skeletonsFirstUsed: 0,
  }
}

const COST_KEYS = Object.keys(emptyCost()) as (keyof PassCostStats)[]

function addCost(target: PassCostStats, source: PassCostStats): void {
  for (const key of COST_KEYS) target[key] += source[key]
}

const EMPTY_AGG: PassAggregate = {
  frames: 0,
  callsSum: 0,
  trianglesSum: 0,
  callsAvg: 0,
  trianglesAvg: 0,
  costAvg: emptyCost(),
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
    cost: emptyCost(),
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

type PassAcc = ReturnType<typeof newPassAcc>

function accumulatePass(target: PassAcc, frame: PassFrameStats): void {
  target.frames += 1
  addCost(target.costSum, frame.cost)
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

function finalizeAgg(acc: PassAcc | null): PassAggregate | null {
  if (!acc || acc.frames <= 0) return null
  const n = acc.frames
  const costAvg = emptyCost()
  for (const key of COST_KEYS) costAvg[key] = Math.round((acc.costSum[key] / n) * 10) / 10
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
    costAvg,
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
    costSum: emptyCost(),
    byBucket: new Map<string, SubmissionBucketStats>(),
  }
}

function isActorKey(key: SubmissionBucketKey): boolean {
  return key === 'npc' || key === 'fauna' || key.startsWith('npcFamily:') || key.startsWith('faunaFamily:')
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
  // Previous draw per pass target (main and its nested shadow map differ).
  let prevMaterial: Material | null = null
  let prevProgram: unknown = null
  let prevShadowMaterial: Material | null = null
  let prevShadowProgram: unknown = null
  /** Frame stamp per skeleton — allocation-free "first use this frame". */
  let skeletonStamp = new WeakMap<Skeleton, number>()
  let frameStamp = 0

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

  function programOf(material: Material): unknown {
    const properties = (renderer as { properties?: { get: (m: Material) => MaterialProperties } } | null)?.properties
    return properties ? properties.get(material).currentProgram ?? null : null
  }

  /** Called after the original draw so the material's program is linked. */
  function recordCost(camera: Camera, material: Material, object: Object3D): void {
    if (!current || !activePass) return
    if (object instanceof InstancedMesh && object.count <= 0) return
    const shadow = activePass === 'main' && beautyCamera !== null && camera !== beautyCamera
    const cost = shadow ? shadowScratch.cost : current.cost
    const actor = isActorKey(classifySubmission(object))
    const program = programOf(material)
    const lastMaterial = shadow ? prevShadowMaterial : prevMaterial
    const lastProgram = shadow ? prevShadowProgram : prevProgram
    const materialSwitch = lastMaterial !== null && material !== lastMaterial
    const programSwitch = program !== null && lastProgram !== null && program !== lastProgram
    if (materialSwitch) cost.materialSwitches += 1
    if (programSwitch) cost.programSwitches += 1
    if (actor) {
      cost.actorCalls += 1
      if (materialSwitch) cost.actorMaterialSwitches += 1
      if (programSwitch) cost.actorProgramSwitches += 1
    }
    const skinned = object as SkinnedMesh
    if (skinned.isSkinnedMesh) {
      cost.skinnedCalls += 1
      const skeleton = skinned.skeleton
      if (skeleton && skeletonStamp.get(skeleton) !== frameStamp) {
        skeletonStamp.set(skeleton, frameStamp)
        cost.skeletonsFirstUsed += 1
      }
    }
    if (shadow) {
      prevShadowMaterial = material
      prevShadowProgram = program
    } else {
      prevMaterial = material
      prevProgram = program
    }
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
      const recording = enabled && activePass !== null && current !== null
      if (recording) {
        recordDraw(camera, geometry, material, object, group)
      }
      const result = originalRenderBufferDirect!.call(mutable, camera, scene, geometry, material, object, group)
      if (recording) recordCost(camera, material, object)
      return result
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
    // During beauty, Three may also render the shadow map. Those draws are
    // attributed to `shadowScratch` (different camera) but still sit inside
    // this pass's `renderer.info` delta — subtract them before residual check.
    const nestedShadowCalls = activePass === 'main' ? shadowScratch.calls : 0
    const nestedShadowTris = activePass === 'main' ? shadowScratch.triangles : 0
    current.residualCalls = current.infoCalls - classifiedCalls - nestedShadowCalls
    current.residualTriangles = current.infoTriangles - classifiedTris - nestedShadowTris
    // Report main totals as beauty-only (info minus nested shadow), so A/B
    // consumers don't double-count shadow into main.
    if (activePass === 'main' && (current.infoCalls > 0 || current.infoTriangles > 0)) {
      current.calls = Math.max(0, current.infoCalls - nestedShadowCalls)
      current.triangles = Math.max(0, current.infoTriangles - nestedShadowTris)
    } else if (current.infoCalls > 0 || current.infoTriangles > 0) {
      current.calls = current.infoCalls
      current.triangles = current.infoTriangles
    }
    if (
      Math.abs(current.residualCalls) > 2
      || (current.infoCalls > 0 && Math.abs(current.residualCalls) / Math.max(1, current.infoCalls) > 0.25)
    ) {
      unverifiedReason = unverifiedReason
        ?? `pass ${activePass}: classified calls (${classifiedCalls}+shadow ${nestedShadowCalls}) diverge from renderer.info (${current.infoCalls})`
    }

    if (activePass === 'mirror') accumulatePass(mirrorAcc, current)
    else if (activePass === 'main') {
      accumulatePass(mainAcc, current)
      if (shadowWanted && (shadowScratch.calls > 0 || shadowScratch.infoCalls > 0 || nestedShadowCalls > 0)) {
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
      skeletonStamp = new WeakMap()
      frameStamp = 0
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
      frameStamp += 1
    },
    withPass(kind, cam, fn) {
      if (!enabled || !sessionActive || !renderer) return fn()
      closePass()
      activePass = kind
      beautyCamera = kind === 'main' ? cam : null
      current = emptyPassFrame()
      prevMaterial = null
      prevProgram = null
      prevShadowMaterial = null
      prevShadowProgram = null
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
    const c = agg.costAvg
    lines.push(`  switches avg: material=${c.materialSwitches} program=${c.programSwitches}  actor: calls=${c.actorCalls} material=${c.actorMaterialSwitches} program=${c.actorProgramSwitches}`)
    lines.push(`  skinning avg: skinned calls=${c.skinnedCalls} skeletons first used=${c.skeletonsFirstUsed}`)
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
