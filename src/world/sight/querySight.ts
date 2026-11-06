import type { WorldSpatialContext } from '../spatialContext'
import type { SightBlocker, SightBlockerRegistry } from './sightBlockers'
import { spatialContextsEqual } from '../spatialContext'
import { segmentBlockedBy } from './sightSegment'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — the one sight query every visibility consumer
 *  uses: observer eye → semantic target samples → `clear / blocked /
 *  unknown`. Pure and deterministic; reads only world-owned geometry
 *  (terrain heights, cave occupancy, registered sight blockers), never
 *  rendered meshes or scene raycasts.
 */

type Xyz = { x: number, y: number, z: number }

/** World-owned geometry the query reads. Built once per `WorldBundle`. */
export type SightWorld = {
  blockers: SightBlockerRegistry
  /** Surface terrain height (edits included). */
  sampleHeight: (x: number, z: number) => number
  /** Strict cave void at a point (`null` = rock or outside every cave). */
  occupancyAt: (x: number, y: number, z: number) => unknown
  /** Stage 0 seam on `Caves` — mouth corridor between surface and `caveId`. */
  canPerceiveAcrossEntrance: (caveId: string, a: Xyz, b: Xyz) => boolean
  /** False when the producers for `(x, z)` have not streamed in yet. */
  isAreaReady?: (x: number, z: number) => boolean
}

export type SightObserver = Xyz & { context: WorldSpatialContext }

export type SightResult = 'clear' | 'blocked' | 'unknown'

export type SightReason =
  | 'clear'
  | 'context'
  | 'range'
  | 'unloaded'
  | 'noSamples'
  | 'terrain'
  | 'cave'
  | 'blocker'

/** Mutable result written by `querySight` (callers keep one per consumer —
 *  no per-query allocation). */
export type SightQueryOut = {
  result: SightResult
  /** Bit i set when sample i is clear. The query stops at the first clear
   *  sample, so at most one bit is set on `clear`. */
  clearMask: number
  /** Why the result was produced; for `blocked`, the last sample's blocker. */
  reason: SightReason
}

export function createSightQueryOut(): SightQueryOut {
  return { result: 'unknown', clearMask: 0, reason: 'noSamples' }
}

/** Max samples per target (bitmask width headroom). */
export const SIGHT_MAX_SAMPLES = 16
/** Terrain march step (m) and step-count bounds. */
export const SIGHT_TERRAIN_STEP_M = 1
const TERRAIN_MIN_STEPS = 4
const TERRAIN_MAX_STEPS = 64
/** Cave occupancy march step (m) — tunnels are narrower than hills. */
export const SIGHT_CAVE_STEP_M = 0.75
const CAVE_MAX_STEPS = 80
/** Ignore this much of each segment end in the terrain/cave marches — the
 *  low body sample and the eye sit close to their own floor. */
export const SIGHT_ENDPOINT_SKIP_M = 0.35
/** A march point counts as underground only this far below the surface. */
export const SIGHT_TERRAIN_TOLERANCE_M = 0.1

const _a = { x: 0, y: 0, z: 0 }
const _b = { x: 0, y: 0, z: 0 }
const _candidates: SightBlocker[] = []
let _collectCount = 0
const collectVisitor = (blocker: SightBlocker): boolean => {
  _candidates[_collectCount++] = blocker
  return false
}

/**
 * Sight from `observer` (character eye — never the camera) to a target made
 * of `sampleCount` points packed in `samples` as `x, y, z` triples.
 *
 * Order (cheapest first, early-out): spatial-context gate (Stage 0 corridor
 * semantics) → range → streaming readiness → per sample, stop at the first
 * clear one: blocker primitives, then terrain march (surface↔surface) or
 * cave-occupancy march (same cave). Cross-context pairs that pass the
 * mouth corridor skip the marches (the corridor is the approximation).
 */
export function querySight(
  world: SightWorld,
  observer: SightObserver,
  targetContext: WorldSpatialContext,
  samples: ArrayLike<number>,
  sampleCount: number,
  maxRange: number,
  out: SightQueryOut,
): SightQueryOut {
  out.clearMask = 0
  const count = Math.min(sampleCount, SIGHT_MAX_SAMPLES)
  if (count <= 0) {
    out.result = 'unknown'
    out.reason = 'noSamples'
    return out
  }
  // Anchor = first sample (callers put the body centre first).
  const tx = samples[0]!
  const tz = samples[2]!

  // 1. Context gate.
  const sameContext = spatialContextsEqual(observer.context, targetContext)
  if (!sameContext) {
    let joined = false
    if (observer.context.kind !== targetContext.kind) {
      const cave = observer.context.kind === 'cave' ? observer.context : targetContext
      if (cave.kind === 'cave') {
        _b.x = tx
        _b.y = samples[1]!
        _b.z = tz
        joined = world.canPerceiveAcrossEntrance(cave.caveId, _b, observer)
      }
    }
    if (!joined) {
      out.result = 'blocked'
      out.reason = 'context'
      return out
    }
  }

  // 2. Range.
  const rdx = tx - observer.x
  const rdz = tz - observer.z
  if (rdx * rdx + rdz * rdz > maxRange * maxRange) {
    out.result = 'unknown'
    out.reason = 'range'
    return out
  }

  // 3. Streaming readiness (producers not loaded → no claim either way).
  if (world.isAreaReady && (!world.isAreaReady(tx, tz) || !world.isAreaReady(observer.x, observer.z))) {
    out.result = 'unknown'
    out.reason = 'unloaded'
    return out
  }

  // Candidate blockers once for the box spanning observer + all samples.
  let minX = observer.x
  let maxX = observer.x
  let minZ = observer.z
  let maxZ = observer.z
  for (let i = 0; i < count; i++) {
    const x = samples[i * 3]!
    const z = samples[i * 3 + 2]!
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  _collectCount = 0
  world.blockers.forEachNearSegment(minX, minZ, maxX, maxZ, collectVisitor)
  const candidateCount = _collectCount

  const march: 'terrain' | 'cave' | 'none' = !sameContext
    ? 'none'
    : observer.context.kind === 'surface' ? 'terrain' : 'cave'

  let lastReason: SightReason = 'blocker'
  for (let i = 0; i < count; i++) {
    const sx = samples[i * 3]!
    const sy = samples[i * 3 + 1]!
    const sz = samples[i * 3 + 2]!
    let blocked = false
    for (let c = 0; c < candidateCount; c++) {
      if (segmentBlockedBy(_candidates[c]!, observer.x, observer.y, observer.z, sx, sy, sz)) {
        blocked = true
        lastReason = 'blocker'
        break
      }
    }
    if (!blocked && march === 'terrain' && terrainBlocks(world, observer, sx, sy, sz)) {
      blocked = true
      lastReason = 'terrain'
    }
    if (!blocked && march === 'cave' && caveBlocks(world, observer, sx, sy, sz)) {
      blocked = true
      lastReason = 'cave'
    }
    if (!blocked) {
      out.clearMask = 1 << i
      out.result = 'clear'
      out.reason = 'clear'
      _candidates.length = Math.min(_candidates.length, 256)
      return out
    }
  }
  out.result = 'blocked'
  out.reason = lastReason
  return out
}

function terrainBlocks(world: SightWorld, o: Xyz, sx: number, sy: number, sz: number): boolean {
  const dx = sx - o.x
  const dy = sy - o.y
  const dz = sz - o.z
  const dist = Math.hypot(dx, dy, dz)
  if (dist <= SIGHT_ENDPOINT_SKIP_M * 2) return false
  const steps = Math.min(TERRAIN_MAX_STEPS, Math.max(TERRAIN_MIN_STEPS, Math.ceil(dist / SIGHT_TERRAIN_STEP_M)))
  const skipT = SIGHT_ENDPOINT_SKIP_M / dist
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    if (t < skipT || t > 1 - skipT) continue
    const x = o.x + dx * t
    const z = o.z + dz * t
    const y = o.y + dy * t
    if (y < world.sampleHeight(x, z) - SIGHT_TERRAIN_TOLERANCE_M) return true
  }
  return false
}

function caveBlocks(world: SightWorld, o: Xyz, sx: number, sy: number, sz: number): boolean {
  const dx = sx - o.x
  const dy = sy - o.y
  const dz = sz - o.z
  const dist = Math.hypot(dx, dy, dz)
  if (dist <= SIGHT_ENDPOINT_SKIP_M * 2) return false
  const steps = Math.min(CAVE_MAX_STEPS, Math.max(TERRAIN_MIN_STEPS, Math.ceil(dist / SIGHT_CAVE_STEP_M)))
  const skipT = SIGHT_ENDPOINT_SKIP_M / dist
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    if (t < skipT || t > 1 - skipT) continue
    _a.x = o.x + dx * t
    _a.y = o.y + dy * t
    _a.z = o.z + dz * t
    if (world.occupancyAt(_a.x, _a.y, _a.z) == null) return true
  }
  return false
}
