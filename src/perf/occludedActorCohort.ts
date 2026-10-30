import {
  Box3,
  type Camera,
  Frustum,
  type Intersection,
  type Material,
  Matrix4,
  type Mesh,
  type Object3D,
  Quaternion,
  Raycaster,
  Vector3,
  type WebGLRenderer,
} from 'three'
import { AGENT_PRESENTATION_MID_DISTANCE_M } from '../render/agentPresentationLod'
import { classifyObject } from './sceneCensus'

/**
 * Queue Q16 (Track A) — occluded-actor cohort ceiling. Diagnostic tooling
 * only; does nothing unless `?actorCohort=census|mask` is set.
 *
 * Before any occlusion detector is worth building, this measures what a
 * perfect, zero-cost one could save in the fixed `settlement-heavy` view
 * (analysis `2026-10-30--npc-fauna-visibility-v2-analysis.md` §4.1–3):
 *
 * 1. {@link censusOccludedActors} — once, before the measured window: living
 *    NPC/fauna (livestock included) whose bounds intersect the camera frustum
 *    and whose 27 sample points (3×3×3 grid over the inflated world box) are
 *    all hidden behind opaque settlement geometry. Expensive raycasts are fine
 *    here; they never run per frame.
 * 2. {@link ActorCohortMask.renderBeauty} — per frame inside the beauty pass:
 *    in `mask` mode hides only that cohort's visible meshes for the camera
 *    passes and shows them again for `shadowMap.render` (which three runs
 *    inside the same `render` call, after main projection), restoring every
 *    flag in `finally`. Root `mesh.visible` (corpse ownership), AI, mixers,
 *    lights and shadows are untouched. `census` mode runs the same per-frame
 *    revalidation without hiding, so both A/B arms carry equal overhead.
 *
 * Revalidation is cheap and conservative: an actor that moved, died or had
 * its root hidden leaves the cohort for good; any camera movement disarms the
 * whole mask (the census only holds for the view it was taken in).
 *
 * @domain tools
 */

export type ActorCohortMode = 'off' | 'census' | 'mask'

export type CohortActorFamily = 'npc' | 'fauna'

/** Agent handle supplied by the app — stable simulation id, not a runtime object id. */
export type CohortActor = {
  id: string
  family: CohortActorFamily
  root: Object3D
  isDead: () => boolean
}

export type CohortBand = 'near' | 'far'

export type OccludedActorRow = {
  id: string
  family: CohortActorFamily
  kind: string
  /** Player distance, split at the 36 m actor shadow/presentation gate. */
  playerDistance: number
  cameraDistance: number
  band: CohortBand
  meshes: number
  skinnedMeshes: number
  castShadowMeshes: number
}

export type CohortBandKey = `${CohortActorFamily}-${CohortBand}`

export type CohortBandSummary = { actors: number, meshes: number, skinnedMeshes: number }

export type OccludedActorCensus = {
  mode: ActorCohortMode
  livingActors: number
  /** Living actors with ≥ 1 renderable mesh whose world box intersects the frustum. */
  inFrustum: number
  occluded: OccludedActorRow[]
  bands: Record<CohortBandKey, CohortBandSummary>
  blockers: number
  rays: number
  censusMs: number
}

export type ActorCohortMaskStats = {
  mode: ActorCohortMode
  cohortStart: number
  cohortEnd: number
  droppedMoved: number
  droppedDead: number
  droppedHidden: number
  /** Frame index (from arming) at which camera movement disarmed the mask, or null. */
  cameraDisarmedAtFrame: number | null
  frames: number
  /** Frames where the mask actually hid ≥ 1 mesh (always 0 in `census` mode). */
  maskedFrames: number
  hiddenMeshesAvg: number
}

export type ActorCohortMask = {
  readonly mode: ActorCohortMode
  arm: (actors: readonly CohortActor[], camera: Camera) => void
  disarm: () => ActorCohortMaskStats | null
  /** Wraps the beauty render (`postProcessing.render()`); a plain call when not armed. */
  renderBeauty: <T>(renderer: WebGLRenderer, fn: () => T) => T
}

const GRID_STEPS = 3
const BOX_INFLATE = 0.1
const HIT_EPSILON_M = 0.05
const ACTOR_MOVE_TOLERANCE_M = 0.05
const CAMERA_MOVE_TOLERANCE_M = 0.02
const CAMERA_ROTATE_TOLERANCE_DOT = 0.99999

export function parseActorCohortMode(raw: string | null, present: boolean): ActorCohortMode {
  if (!present || raw === null) return 'off'
  const v = raw.trim().toLowerCase()
  if (v === 'census') return 'census'
  if (v === 'mask') return 'mask'
  return 'off'
}

function isRenderableMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh === true && object.visible
}

function isEffectivelyVisible(object: Object3D): boolean {
  for (let node: Object3D | null = object; node; node = node.parent) {
    if (!node.visible) return false
  }
  return true
}

function isOpaque(material: Material | undefined): boolean {
  if (!material || !material.visible) return false
  return !material.transparent && material.opacity >= 1 && material.alphaTest === 0
}

/** True when the hit face's material would occlude (transparent windows, alpha-tested foliage/fences do not). */
export function isOpaqueHit(hit: Intersection): boolean {
  const mesh = hit.object as Mesh
  const material = mesh.material
  if (Array.isArray(material)) return isOpaque(material[hit.face?.materialIndex ?? 0])
  return isOpaque(material)
}

/** Opaque-candidate settlement meshes (buildings, walls, props) — the only blockers §4.1 allows. */
export function collectSettlementBlockers(scene: Object3D): Mesh[] {
  const out: Mesh[] = []
  scene.traverseVisible((object) => {
    if (!isRenderableMesh(object)) return
    if (classifyObject(object) !== 'settlement') return
    out.push(object)
  })
  return out
}

/** 3×3×3 sample grid over `box` (corners, edge/face centres, centre). */
export function boxSamplePoints(box: Box3, out: Vector3[] = []): Vector3[] {
  out.length = 0
  for (let ix = 0; ix < GRID_STEPS; ix++) {
    for (let iy = 0; iy < GRID_STEPS; iy++) {
      for (let iz = 0; iz < GRID_STEPS; iz++) {
        const t = (i: number): number => i / (GRID_STEPS - 1)
        out.push(new Vector3(
          box.min.x + (box.max.x - box.min.x) * t(ix),
          box.min.y + (box.max.y - box.min.y) * t(iy),
          box.min.z + (box.max.z - box.min.z) * t(iz),
        ))
      }
    }
  }
  return out
}

type MeshCounts = { meshes: number, skinnedMeshes: number, castShadowMeshes: number }

function countActorMeshes(root: Object3D): MeshCounts {
  const counts: MeshCounts = { meshes: 0, skinnedMeshes: 0, castShadowMeshes: 0 }
  root.traverseVisible((object) => {
    if (!isRenderableMesh(object)) return
    counts.meshes += 1
    if ((object as { isSkinnedMesh?: boolean }).isSkinnedMesh) counts.skinnedMeshes += 1
    if (object.castShadow) counts.castShadowMeshes += 1
  })
  return counts
}

function actorKind(actor: CohortActor): string {
  const tag = actor.family === 'fauna' ? actor.root.userData.animalKind : actor.root.userData.npcFamily
  return typeof tag === 'string' ? tag : 'unknown'
}

function emptyBands(): OccludedActorCensus['bands'] {
  const band = (): CohortBandSummary => ({ actors: 0, meshes: 0, skinnedMeshes: 0 })
  return { 'npc-near': band(), 'npc-far': band(), 'fauna-near': band(), 'fauna-far': band() }
}

/**
 * One-shot census of living, in-frustum actors fully hidden behind opaque
 * settlement geometry (see module doc). Uses current world matrices; call it
 * between frames with the benchmark camera, never per frame.
 */
export function censusOccludedActors(args: {
  mode: ActorCohortMode
  actors: readonly CohortActor[]
  camera: Camera
  scene: Object3D
  player: { x: number, y: number, z: number }
}): OccludedActorCensus {
  const started = performance.now()
  const { camera } = args
  const frustum = new Frustum().setFromProjectionMatrix(
    new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
  )
  const eye = new Vector3().setFromMatrixPosition(camera.matrixWorld)
  const blockers = collectSettlementBlockers(args.scene)
  const raycaster = new Raycaster()
  raycaster.layers.enableAll()
  const box = new Box3()
  const size = new Vector3()
  const centre = new Vector3()
  const dir = new Vector3()
  const samples: Vector3[] = []
  const hits: Intersection[] = []
  const bands = emptyBands()
  const occluded: OccludedActorRow[] = []
  let living = 0
  let inFrustum = 0
  let rays = 0

  const sampleBlocked = (point: Vector3): boolean => {
    dir.subVectors(point, eye)
    const distance = dir.length()
    if (distance <= HIT_EPSILON_M) return false
    raycaster.set(eye, dir.divideScalar(distance))
    raycaster.near = 0
    raycaster.far = distance - HIT_EPSILON_M
    rays += 1
    hits.length = 0
    raycaster.intersectObjects(blockers, false, hits)
    return hits.some(isOpaqueHit)
  }

  for (const actor of args.actors) {
    if (actor.isDead() || !isEffectivelyVisible(actor.root)) continue
    living += 1
    const counts = countActorMeshes(actor.root)
    if (counts.meshes === 0) continue
    box.setFromObject(actor.root)
    if (box.isEmpty()) continue
    box.getSize(size)
    box.expandByVector(size.multiplyScalar(BOX_INFLATE / 2))
    if (!frustum.intersectsBox(box)) continue
    inFrustum += 1
    // Early-out on the first visible sample: visible actors cost ~1 ray.
    let hidden = true
    for (const point of boxSamplePoints(box, samples)) {
      if (!sampleBlocked(point)) {
        hidden = false
        break
      }
    }
    if (!hidden) continue

    box.getCenter(centre)
    const p = args.player
    const playerDistance = Math.hypot(centre.x - p.x, centre.y - p.y, centre.z - p.z)
    const band: CohortBand = playerDistance <= AGENT_PRESENTATION_MID_DISTANCE_M ? 'near' : 'far'
    occluded.push({
      id: actor.id,
      family: actor.family,
      kind: actorKind(actor),
      playerDistance,
      cameraDistance: centre.distanceTo(eye),
      band,
      ...counts,
    })
    const summary = bands[`${actor.family}-${band}`]
    summary.actors += 1
    summary.meshes += counts.meshes
    summary.skinnedMeshes += counts.skinnedMeshes
  }

  occluded.sort((a, b) => a.cameraDistance - b.cameraDistance || a.id.localeCompare(b.id))
  return {
    mode: args.mode,
    livingActors: living,
    inFrustum,
    occluded,
    bands,
    blockers: blockers.length,
    rays,
    censusMs: performance.now() - started,
  }
}

type ArmedMember = { actor: CohortActor, x: number, y: number, z: number }

/** Creates the per-frame beauty-pass mask for one `ActorCohortMode`. */
export function createActorCohortMask(mode: ActorCohortMode): ActorCohortMask {
  let members: ArmedMember[] = []
  let armed = false
  let stats: ActorCohortMaskStats | null = null
  let hiddenSum = 0
  const cameraPos = new Vector3()
  const cameraQuat = new Quaternion()
  const camPosScratch = new Vector3()
  const camQuatScratch = new Quaternion()
  const camScaleScratch = new Vector3()
  let armedCamera: Camera | null = null
  const hidden: Object3D[] = []

  const setHidden = (visible: boolean): void => {
    for (const object of hidden) object.visible = visible
  }

  const revalidate = (frame: ActorCohortMaskStats): void => {
    const cam = armedCamera!
    cam.matrixWorld.decompose(camPosScratch, camQuatScratch, camScaleScratch)
    if (
      camPosScratch.distanceTo(cameraPos) > CAMERA_MOVE_TOLERANCE_M
      || Math.abs(camQuatScratch.dot(cameraQuat)) < CAMERA_ROTATE_TOLERANCE_DOT
    ) {
      frame.cameraDisarmedAtFrame = frame.frames
      members = []
      return
    }
    members = members.filter((m) => {
      if (m.actor.isDead()) {
        frame.droppedDead += 1
        return false
      }
      if (!m.actor.root.visible) {
        frame.droppedHidden += 1
        return false
      }
      const pos = m.actor.root.position
      if (Math.hypot(pos.x - m.x, pos.y - m.y, pos.z - m.z) > ACTOR_MOVE_TOLERANCE_M) {
        frame.droppedMoved += 1
        return false
      }
      return true
    })
  }

  return {
    mode,
    arm(actors, camera) {
      camera.matrixWorld.decompose(cameraPos, cameraQuat, camScaleScratch)
      armedCamera = camera
      members = actors.map((actor) => ({ actor, x: actor.root.position.x, y: actor.root.position.y, z: actor.root.position.z }))
      stats = {
        mode,
        cohortStart: members.length,
        cohortEnd: members.length,
        droppedMoved: 0,
        droppedDead: 0,
        droppedHidden: 0,
        cameraDisarmedAtFrame: null,
        frames: 0,
        maskedFrames: 0,
        hiddenMeshesAvg: 0,
      }
      hiddenSum = 0
      armed = mode !== 'off'
    },
    disarm() {
      armed = false
      members = []
      armedCamera = null
      const out = stats
      if (out) out.hiddenMeshesAvg = out.frames > 0 ? hiddenSum / out.frames : 0
      stats = null
      return out
    },
    renderBeauty(renderer, fn) {
      if (!armed || !stats) return fn()
      if (stats.cameraDisarmedAtFrame === null) revalidate(stats)
      stats.frames += 1
      stats.cohortEnd = members.length
      if (mode !== 'mask' || members.length === 0) return fn()

      for (const m of members) {
        m.actor.root.traverseVisible((object) => {
          if (isRenderableMesh(object)) hidden.push(object)
        })
      }
      if (hidden.length === 0) return fn()
      stats.maskedFrames += 1
      hiddenSum += hidden.length
      setHidden(false)
      // Three renders the shadow map inside the same `render` call, after
      // main projection: show the cohort again for it so shadows (and their
      // skeleton updates) are exactly as without the mask.
      const shadowMap = renderer.shadowMap
      const originalShadowRender = shadowMap.render
      shadowMap.render = (...renderArgs: Parameters<typeof originalShadowRender>) => {
        setHidden(true)
        try {
          originalShadowRender.apply(shadowMap, renderArgs)
        } finally {
          setHidden(false)
        }
      }
      try {
        return fn()
      } finally {
        shadowMap.render = originalShadowRender
        setHidden(true)
        hidden.length = 0
      }
    },
  }
}

export function formatOccludedActorCohortReport(
  census: OccludedActorCensus | null,
  mask: ActorCohortMaskStats | null,
): string {
  const lines = ['[Seedvale Occluded Actor Cohort]', '']
  if (!census) {
    lines.push('(not sampled — set ?actorCohort=census|mask)')
    return lines.join('\n')
  }
  lines.push(`Mode: ${census.mode}`)
  lines.push(`Living actors: ${census.livingActors}  in frustum: ${census.inFrustum}  fully occluded: ${census.occluded.length}`)
  lines.push(`Blockers: ${census.blockers}  rays: ${census.rays}  census: ${census.censusMs.toFixed(0)} ms (pre-window)`)
  for (const [key, band] of Object.entries(census.bands)) {
    lines.push(`  ${key.padEnd(11)} actors=${band.actors} meshes=${band.meshes} skinned=${band.skinnedMeshes}`)
  }
  if (mask) {
    lines.push(`Mask: cohort ${mask.cohortStart} → ${mask.cohortEnd} (moved −${mask.droppedMoved}, dead −${mask.droppedDead}, hidden −${mask.droppedHidden})`
      + `${mask.cameraDisarmedAtFrame !== null ? `, camera moved at frame ${mask.cameraDisarmedAtFrame} → disarmed` : ''}`)
    lines.push(`  frames=${mask.frames} masked frames=${mask.maskedFrames} hidden meshes avg=${mask.hiddenMeshesAvg.toFixed(1)}`)
  }
  lines.push('')
  lines.push('Cohort (camera distance asc):')
  if (census.occluded.length === 0) lines.push('  (none)')
  for (const row of census.occluded) {
    lines.push(`  ${row.family.padEnd(5)} ${row.kind.padEnd(14)} ${row.id.padEnd(28)} cam=${row.cameraDistance.toFixed(1)}m player=${row.playerDistance.toFixed(1)}m ${row.band} meshes=${row.meshes} skinned=${row.skinnedMeshes} castShadow=${row.castShadowMeshes}`)
  }
  return lines.join('\n')
}

let activeMask: ActorCohortMask | null = null

/** `?actorCohort=census|mask` — Q16 cohort tooling; null when off (default). */
export function getActorCohortMask(): ActorCohortMask | null {
  if (activeMask) return activeMask
  if (typeof window === 'undefined') return null
  let params: URLSearchParams
  try {
    params = new URLSearchParams(window.location.search)
  } catch {
    return null
  }
  const mode = parseActorCohortMode(params.get('actorCohort'), params.has('actorCohort'))
  if (mode === 'off') return null
  activeMask = createActorCohortMask(mode)
  return activeMask
}
