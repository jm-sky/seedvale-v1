import type { HeightSampler } from '../player/PlayerController'
import type { RiverChannelSegment } from '../terrain/chunkHeightmap'
import type { RouteObstacles } from './routeObstacles'
import { riverHitsOnEdge } from './roadRiverCrossing'

/**
 * Post-A* route shaping (Q44 R5, plan §2.2): string-pulling then corner rounding.
 *
 * A* runs on a 9 m 8-direction grid, so its chain zig-zags (≈12 turns > 50° per km). This pure pass
 * first drops waypoints a straight line can bypass at no extra cost (line-of-sight shortcut over the
 * same constraints: dry ground, village obstacles, **no river hit**), then rounds the remaining
 * corners (Chaikin) and resamples at ~6 m. Crossing anchors and their approaches are held fixed, so
 * the road still meets the crossing it paid for; the caller keeps the topology guard.
 *
 * @domain world-terrain
 */
export type ShapePoint = { x: number, z: number, h: number }

export type RouteShapeEnv = {
  sampleHeight: HeightSampler
  sampleMountainRidge: (x: number, z: number) => number
  waterLevel: number
  waterClearance: number
  elevationWeight: number
  mountainCostWeight: number
  riverSegments: readonly RiverChannelSegment[]
  obstacles?: RouteObstacles
}

/** Probe spacing (m) for line-of-sight and cost checks. */
const PROBE_STEP = 3
/** Resample spacing (m) of the finished polyline. */
export const ROUTE_RESAMPLE_STEP = 6
const CHAIKIN_PASSES = 2

type Anchor = ReadonlySet<number>

function isClear(x: number, z: number, env: RouteShapeEnv): boolean {
  if (env.sampleHeight(x, z) <= env.waterLevel + env.waterClearance) return false
  if (env.obstacles?.isBlocked(x, z)) return false
  return true
}

/** Cost of walking the straight line a→b with the A* cost semantics (distance × ridge × footprint + elevation). */
function lineCost(a: ShapePoint, b: ShapePoint, env: RouteShapeEnv): number | null {
  if (riverHitsOnEdge(a.x, a.z, b.x, b.z, env.riverSegments).length > 0) return null
  const len = Math.hypot(b.x - a.x, b.z - a.z)
  const steps = Math.max(1, Math.ceil(len / PROBE_STEP))
  let cost = 0
  let px = a.x
  let pz = a.z
  let ph = a.h
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const x = a.x + (b.x - a.x) * t
    const z = a.z + (b.z - a.z) * t
    if (i < steps && !isClear(x, z, env)) return null
    const h = i === steps ? b.h : env.sampleHeight(x, z)
    const mx = (px + x) * 0.5
    const mz = (pz + z) * 0.5
    if (env.obstacles?.isBlocked(mx, mz)) return null
    const ridge = env.sampleMountainRidge(mx, mz)
    const foot = env.obstacles?.costMultiplier(mx, mz) ?? 1
    cost +=
      Math.hypot(x - px, z - pz) * foot * (1 + env.mountainCostWeight * ridge * ridge) +
      env.elevationWeight * Math.abs(h - ph)
    px = x
    pz = z
    ph = h
  }
  return cost
}

function chainCost(points: readonly ShapePoint[], from: number, to: number, env: RouteShapeEnv): number {
  let total = 0
  for (let i = from; i < to; i++) total += lineCost(points[i]!, points[i + 1]!, env) ?? Infinity
  return total
}

/**
 * Greedy string-pulling. A shortcut i→j is taken only when the straight line is clear and **no more
 * expensive** than the chain it replaces, and never skips a locked (anchor) waypoint. Returns the
 * kept points and the new indices of the locked ones.
 */
export function stringPull(
  points: readonly ShapePoint[],
  locked: Anchor,
  env: RouteShapeEnv,
): { points: ShapePoint[], locked: Set<number> } {
  const kept: ShapePoint[] = []
  const newLocked = new Set<number>()
  let i = 0
  kept.push(points[0]!)
  if (locked.has(0)) newLocked.add(0)
  while (i < points.length - 1) {
    // Farthest reachable j: stop before passing a locked waypoint.
    let limit = points.length - 1
    for (let k = i + 1; k < points.length - 1; k++) {
      if (locked.has(k)) { limit = k; break }
    }
    let next = i + 1
    for (let j = limit; j > i + 1; j--) {
      const direct = lineCost(points[i]!, points[j]!, env)
      if (direct === null) continue
      if (direct <= chainCost(points, i, j, env) + 1e-6) { next = j; break }
    }
    kept.push(points[next]!)
    if (locked.has(next)) newLocked.add(kept.length - 1)
    i = next
  }
  return { points: kept, locked: newLocked }
}

function chaikin(run: readonly ShapePoint[]): { x: number, z: number }[] {
  let pts: { x: number, z: number }[] = run.map((p) => ({ x: p.x, z: p.z }))
  for (let pass = 0; pass < CHAIKIN_PASSES && pts.length > 2; pass++) {
    const out: { x: number, z: number }[] = [pts[0]!]
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!
      const b = pts[i + 1]!
      if (i > 0) out.push({ x: a.x * 0.75 + b.x * 0.25, z: a.z * 0.75 + b.z * 0.25 })
      if (i < pts.length - 2) out.push({ x: a.x * 0.25 + b.x * 0.75, z: a.z * 0.25 + b.z * 0.75 })
    }
    out.push(pts[pts.length - 1]!)
    pts = out
  }
  return pts
}

function resample(pts: readonly { x: number, z: number }[], step: number): { x: number, z: number }[] {
  const out: { x: number, z: number }[] = [pts[0]!]
  let carry = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!
    const b = pts[i + 1]!
    const len = Math.hypot(b.x - a.x, b.z - a.z)
    let d = step - carry
    while (d < len) {
      const t = d / len
      out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t })
      d += step
    }
    carry = len - (d - step)
  }
  out.push(pts[pts.length - 1]!)
  return out
}

/**
 * Rounds corners per run between locked waypoints (locked points and the route ends stay exactly in
 * place) and resamples at `ROUTE_RESAMPLE_STEP`. Locked indices are remapped for the meander.
 */
export function roundCorners(
  points: readonly ShapePoint[],
  locked: Anchor,
  sampleHeight: HeightSampler,
): { points: ShapePoint[], locked: Set<number> } {
  const out: ShapePoint[] = [points[0]!]
  const newLocked = new Set<number>()
  if (locked.has(0)) newLocked.add(0)
  let runStart = 0
  for (let i = 1; i < points.length; i++) {
    if (i !== points.length - 1 && !locked.has(i)) continue
    const run = points.slice(runStart, i + 1)
    const shaped = resample(chaikin(run), ROUTE_RESAMPLE_STEP)
    for (let k = 1; k < shaped.length; k++) {
      const p = shaped[k]!
      const isEnd = k === shaped.length - 1
      out.push(isEnd ? points[i]! : { x: p.x, z: p.z, h: sampleHeight(p.x, p.z) })
    }
    if (locked.has(i)) newLocked.add(out.length - 1)
    runStart = i
  }
  return { points: out, locked: newLocked }
}

/** True when every point is dry and outside hard village obstacles (route ends are exempt via the obstacle API). */
export function polylineIsClear(points: readonly ShapePoint[], env: RouteShapeEnv): boolean {
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!
    if (!isClear(p.x, p.z, env)) return false
    if (i > 0) {
      const q = points[i - 1]!
      if (env.obstacles?.isBlocked((p.x + q.x) * 0.5, (p.z + q.z) * 0.5)) return false
    }
  }
  return true
}

/**
 * Replaces the stretch of `points` around `(cx, cz)` with one straight chord whose ends are the first
 * points (walking outward along the polyline from its closest approach to the centre) at least
 * `radius` metres from it (Q97: a bridge deck is straight, so the road must be straight under and just
 * beyond it). Returns `null` when the polyline ends before reaching `radius` on either side or when the
 * chord ends are not clear (dry, off village obstacles) or a probe along the chord hits an obstacle.
 * The caller re-derives crossings and keeps its topology guard.
 *
 * @domain world-terrain
 */
export function straightChordAround(
  points: readonly ShapePoint[],
  cx: number,
  cz: number,
  radius: number,
  env: RouteShapeEnv,
): ShapePoint[] | null {
  if (points.length < 2) return null
  let k = 0
  let bestT = 0
  let best = Infinity
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const dx = b.x - a.x
    const dz = b.z - a.z
    const l2 = dx * dx + dz * dz
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((cx - a.x) * dx + (cz - a.z) * dz) / l2)) : 0
    const d = Math.hypot(a.x + dx * t - cx, a.z + dz * t - cz)
    if (d < best) { best = d; k = i; bestT = t }
  }
  if (best >= radius) return null
  const far = (p: { x: number, z: number }) => Math.hypot(p.x - cx, p.z - cz) >= radius
  /** Point on segment p→q (p inside the radius, q outside) at exactly `radius` from the centre. */
  const exitPoint = (p: ShapePoint, q: ShapePoint): ShapePoint => {
    let lo = 0
    let hi = 1
    for (let it = 0; it < 24; it++) {
      const mid = (lo + hi) * 0.5
      if (far({ x: p.x + (q.x - p.x) * mid, z: p.z + (q.z - p.z) * mid })) hi = mid
      else lo = mid
    }
    const x = p.x + (q.x - p.x) * hi
    const z = p.z + (q.z - p.z) * hi
    return { x, z, h: env.sampleHeight(x, z) }
  }
  const a0 = points[k]!
  const b0 = points[k + 1]!
  const foot: ShapePoint = { x: a0.x + (b0.x - a0.x) * bestT, z: a0.z + (b0.z - a0.z) * bestT, h: 0 }
  // Backward: last index `inIdx` kept before the chord start.
  let prev = foot
  let inIdx = k
  while (inIdx >= 0 && !far(points[inIdx]!)) { prev = points[inIdx]!; inIdx-- }
  if (inIdx < 0) return null
  const start = exitPoint(prev, points[inIdx]!)
  prev = foot
  let outIdx = k + 1
  while (outIdx < points.length && !far(points[outIdx]!)) { prev = points[outIdx]!; outIdx++ }
  if (outIdx >= points.length) return null
  const end = exitPoint(prev, points[outIdx]!)
  if (!isClear(start.x, start.z, env) || !isClear(end.x, end.z, env)) return null
  const len = Math.hypot(end.x - start.x, end.z - start.z)
  const steps = Math.max(1, Math.ceil(len / PROBE_STEP))
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    if (env.obstacles?.isBlocked(start.x + (end.x - start.x) * t, start.z + (end.z - start.z) * t)) return null
  }
  return [...points.slice(0, inIdx + 1), start, end, ...points.slice(outIdx)]
}
