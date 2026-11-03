import type { RiverChain, RiverPoint, WorldRect } from './riverNetwork'

/**
 * Global river chains as per-tile views (plan world-terrain-058 H3, decision 8): `clipChainsToRect` returns the parts
 * of the chains inside a rect with interpolated boundary points — the "truncated at the core boundary" semantics the
 * per-tile extraction had, so every river-tile consumer keeps its API. `RiverChainIndex` buckets chains by the
 * 256 m river tile their bounding box touches, so one tile query does not scan every chain of the world.
 *
 * @domain world-terrain
 * @subdomain hydrology
 */

/** Clips segment `a→b` to `rect`; returns the parameter interval `[t0, t1]` inside it, or `null`. */
function clipSegment(a: RiverPoint, b: RiverPoint, rect: WorldRect): [number, number] | null {
  let t0 = 0
  let t1 = 1
  const dx = b.x - a.x
  const dz = b.z - a.z
  const edges: Array<[number, number]> = [
    [-dx, a.x - rect.minX],
    [dx, rect.maxX - a.x],
    [-dz, a.z - rect.minZ],
    [dz, rect.maxZ - a.z],
  ]
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return null
    } else {
      const r = q / p
      if (p < 0) {
        if (r > t1) return null
        if (r > t0) t0 = r
      } else {
        if (r < t0) return null
        if (r < t1) t1 = r
      }
    }
  }
  return t0 <= t1 ? [t0, t1] : null
}

function lerpPoint(a: RiverPoint, b: RiverPoint, t: number): RiverPoint {
  if (t <= 0) return { ...a }
  if (t >= 1) return { ...b }
  return {
    x: a.x + (b.x - a.x) * t,
    z: a.z + (b.z - a.z) * t,
    elevation: a.elevation + (b.elevation - a.elevation) * t,
    accumulation: a.accumulation + (b.accumulation - a.accumulation) * t,
  }
}

/** Parts of `chain` inside `rect`; a chain that leaves and re-enters yields several pieces (≥ 2 points each). */
export function clipChainToRect(chain: RiverChain, rect: WorldRect): RiverChain[] {
  const out: RiverChain[] = []
  let current: RiverPoint[] = []
  const flush = (): void => {
    if (current.length >= 2) out.push({ points: current })
    current = []
  }
  const pts = chain.points
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i]!
    const b = pts[i + 1]!
    const span = clipSegment(a, b, rect)
    if (!span) {
      flush()
      continue
    }
    const [t0, t1] = span
    if (t1 - t0 <= 1e-9) {
      flush()
      continue
    }
    if (t0 > 0) flush()
    if (current.length === 0) current.push(lerpPoint(a, b, t0))
    current.push(lerpPoint(a, b, t1))
    if (t1 < 1) flush()
  }
  flush()
  return out
}

export function clipChainsToRect(chains: readonly RiverChain[], rect: WorldRect): RiverChain[] {
  return chains.flatMap((c) => clipChainToRect(c, rect))
}

/** Chains bucketed by the tiles (size `tileSize`) their bounding box overlaps. */
export class RiverChainIndex {
  private readonly buckets = new Map<string, RiverChain[]>()

  constructor(chains: readonly RiverChain[], tileSize: number) {
    for (const chain of chains) {
      if (chain.points.length < 2) continue
      let minX = Infinity
      let maxX = -Infinity
      let minZ = Infinity
      let maxZ = -Infinity
      for (const p of chain.points) {
        if (p.x < minX) minX = p.x
        if (p.x > maxX) maxX = p.x
        if (p.z < minZ) minZ = p.z
        if (p.z > maxZ) maxZ = p.z
      }
      for (let tx = Math.floor(minX / tileSize); tx <= Math.floor(maxX / tileSize); tx++) {
        for (let tz = Math.floor(minZ / tileSize); tz <= Math.floor(maxZ / tileSize); tz++) {
          const key = `${tx},${tz}`
          const list = this.buckets.get(key)
          if (list) list.push(chain)
          else this.buckets.set(key, [chain])
        }
      }
    }
  }

  /** Chains whose bounding box touches tile `(tx, tz)`, in the order of the source array. */
  candidates(tx: number, tz: number): readonly RiverChain[] {
    return this.buckets.get(`${tx},${tz}`) ?? []
  }
}
