import { ChainEnd, unpackChains, type WorldHydrology } from '../../src/terrain/worldHydrology'

/**
 * tools-026 D1 (Q111): river-network metrics over a computed `WorldHydrology` and its raw floor grid.
 * Diagnostic only — nothing here feeds a cache key or runtime path.
 */

type Pt = { x: number, z: number, elevation: number, accumulation: number }
type Grid = { size: number, cellStep: number, originX: number, originZ: number }

/** Ridge margin (m): the floor between two near-parallel stream lines must rise this far above both to call them separated. */
export const PARALLEL_RIDGE_MARGIN_M = 1
const PARALLEL_MAX_GAP_M = 30
const PARALLEL_MIN_RUN_M = 150
const DRY_DISTANCE_M = 300

export type NetworkMetrics = {
  streamKm: number
  streamKmPerLandKm2: number
  chains: number
  heads: number
  dryInterfluveShare: number
  payloadMiB: number
  trunkSystems: { chains: number, km: number, maxAccumulationM2: number, outlet: string, outletX: number, outletZ: number }[]
  accumulationAreaHistogram: { fromM2: number, toM2: number, points: number }[]
  parallelPairs: { maxRunM: number, total: number, valid: number, artifact: number, lengthKm: number, artifacts: { x: number, z: number, runM: number, gapM: number, bumpM: number }[] }
}

function payloadBytes(h: WorldHydrology): number {
  return h.chains.points.byteLength + h.chains.offsets.byteLength + h.chains.flags.byteLength
    + h.correction.blockIds.byteLength + h.correction.data.byteLength + h.basin.blockIds.byteLength + h.basin.data.byteLength
}

/** Share of land cells farther than `DRY_DISTANCE_M` from any stream point (two-pass chamfer on the hydrology grid). */
function dryShare(chains: { points: Pt[] }[], floor: Float32Array, grid: Grid, waterLevel: number): number {
  const { size: n, cellStep, originX, originZ } = grid
  const INF = 1e9
  const d = new Float32Array(n * n).fill(INF)
  for (const c of chains) {
    for (let k = 0; k < c.points.length; k++) {
      const a = c.points[k]!
      const b = c.points[k + 1] ?? a
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / cellStep))
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const ix = Math.round((a.x + (b.x - a.x) * t - originX) / cellStep)
        const iz = Math.round((a.z + (b.z - a.z) * t - originZ) / cellStep)
        if (ix >= 0 && iz >= 0 && ix < n && iz < n) d[iz * n + ix] = 0
      }
    }
  }
  const D = cellStep
  const DD = cellStep * Math.SQRT2
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = j * n + i
    let v = d[k]!
    if (i > 0) v = Math.min(v, d[k - 1]! + D)
    if (j > 0) {
      v = Math.min(v, d[k - n]! + D)
      if (i > 0) v = Math.min(v, d[k - n - 1]! + DD)
      if (i < n - 1) v = Math.min(v, d[k - n + 1]! + DD)
    }
    d[k] = v
  }
  for (let j = n - 1; j >= 0; j--) for (let i = n - 1; i >= 0; i--) {
    const k = j * n + i
    let v = d[k]!
    if (i < n - 1) v = Math.min(v, d[k + 1]! + D)
    if (j < n - 1) {
      v = Math.min(v, d[k + n]! + D)
      if (i < n - 1) v = Math.min(v, d[k + n + 1]! + DD)
      if (i > 0) v = Math.min(v, d[k + n - 1]! + DD)
    }
    d[k] = v
  }
  let land = 0
  let dry = 0
  for (let k = 0; k < n * n; k++) {
    if (floor[k]! <= waterLevel) continue
    land++
    if (d[k]! > DRY_DISTANCE_M) dry++
  }
  return land ? dry / land : 0
}

/** Group chains into trunk systems by following each Join chain's last point to the chain it merges into. */
function trunkSystems(chains: { points: Pt[] }[], flags: Uint8Array, cellStep: number) {
  const parent = chains.map((_, i) => i)
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i]!)))
  const buckets = new Map<string, number[]>()
  const key = (x: number, z: number) => `${Math.floor(x / (cellStep * 2))},${Math.floor(z / (cellStep * 2))}`
  chains.forEach((c, i) => c.points.forEach((p) => {
    const kk = key(p.x, p.z)
    const arr = buckets.get(kk)
    if (arr) arr.push(i); else buckets.set(kk, [i])
  }))
  chains.forEach((c, i) => {
    if ((flags[i]! & 15) !== ChainEnd.Join) return
    const e = c.points[c.points.length - 1]!
    let best = Infinity
    let bj = -1
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      const arr = buckets.get(key(e.x + dx * cellStep * 2, e.z + dz * cellStep * 2))
      if (!arr) continue
      for (const j of arr) {
        if (j === i) continue
        for (const p of chains[j]!.points) {
          const dd = Math.hypot(p.x - e.x, p.z - e.z)
          if (dd < best) { best = dd; bj = j }
        }
      }
    }
    if (bj >= 0 && best <= cellStep * 2) parent[find(i)] = find(bj)
  })
  const groups = new Map<number, number[]>()
  chains.forEach((_, i) => {
    const r = find(i)
    const arr = groups.get(r)
    if (arr) arr.push(i); else groups.set(r, [i])
  })
  const outletName = ['sea', 'lake', 'join', 'edge']
  return [...groups.values()].map((ids) => {
    let km = 0
    let maxAcc = 0
    let outlet = ids[0]!
    for (const i of ids) {
      const pts = chains[i]!.points
      for (let k = 0; k < pts.length - 1; k++) km += Math.hypot(pts[k + 1]!.x - pts[k]!.x, pts[k + 1]!.z - pts[k]!.z) / 1000
      const lastAcc = pts[pts.length - 1]!.accumulation
      if (lastAcc > maxAcc) { maxAcc = lastAcc; outlet = i }
    }
    const last = chains[outlet]!.points[chains[outlet]!.points.length - 1]!
    return { chains: ids.length, km, maxAccumulationM2: maxAcc * 0, outlet: outletName[flags[outlet]! & 15] ?? '?', outletX: Math.round(last.x), outletZ: Math.round(last.z), _maxAcc: maxAcc }
  }).sort((a, b) => b.km - a.km)
}

function parallelPairs(chains: { points: Pt[] }[], floor: Float32Array, grid: Grid) {
  const { size: n, cellStep, originX, originZ } = grid
  const cs = PARALLEL_MAX_GAP_M
  const buckets = new Map<string, { c: number, k: number }[]>()
  const key = (x: number, z: number) => `${Math.floor(x / cs)},${Math.floor(z / cs)}`
  chains.forEach((c, ci) => c.points.forEach((p, k) => {
    const kk = key(p.x, p.z)
    const arr = buckets.get(kk)
    if (arr) arr.push({ c: ci, k }); else buckets.set(kk, [{ c: ci, k }])
  }))
  const floorAt = (x: number, z: number) => {
    const ix = Math.min(n - 1, Math.max(0, Math.round((x - originX) / cellStep)))
    const iz = Math.min(n - 1, Math.max(0, Math.round((z - originZ) / cellStep)))
    return floor[iz * n + ix]!
  }
  const stepLen = (pts: Pt[], k: number) => (k > 0 ? Math.hypot(pts[k]!.x - pts[k - 1]!.x, pts[k]!.z - pts[k - 1]!.z) : 0)
  let maxRun = 0
  const results: { x: number, z: number, runM: number, gapM: number, bumpM: number, valid: boolean }[] = []
  // A pair of chains (a < b) is "near" at a point of `a` when a point of `b` lies within the gap (confluence ends excluded).
  chains.forEach((a, ai) => {
    const near = new Map<number, { ks: number[], gaps: number[], bumps: number[] }>()
    a.points.forEach((p, k) => {
      if (k < 6 || k > a.points.length - 7) return // confluence / head fringes
      let bestD = PARALLEL_MAX_GAP_M
      let best: { c: number, k: number } | null = null
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
        const arr = buckets.get(key(p.x + dx * cs, p.z + dz * cs))
        if (!arr) continue
        for (const o of arr) {
          if (o.c <= ai) continue
          const q = chains[o.c]!.points[o.k]!
          if (o.k < 6 || o.k > chains[o.c]!.points.length - 7) continue
          const dd = Math.hypot(q.x - p.x, q.z - p.z)
          if (dd < bestD) { bestD = dd; best = o }
        }
      }
      if (!best) return
      const q = chains[best.c]!.points[best.k]!
      let top = -Infinity
      for (let s = 0; s <= 4; s++) top = Math.max(top, floorAt(p.x + ((q.x - p.x) * s) / 4, p.z + ((q.z - p.z) * s) / 4))
      const bump = top - Math.max(floorAt(p.x, p.z), floorAt(q.x, q.z))
      const e = near.get(best.c) ?? { ks: [], gaps: [], bumps: [] }
      e.ks.push(k); e.gaps.push(bestD); e.bumps.push(bump)
      near.set(best.c, e)
    })
    for (const e of near.values()) {
      let start = 0
      for (let i = 1; i <= e.ks.length; i++) {
        if (i < e.ks.length && e.ks[i] - e.ks[i - 1]! <= 2) continue
        let run = 0
        for (let j = start + 1; j < i; j++) run += stepLen(a.points, e.ks[j]!)
        maxRun = Math.max(maxRun, run)
        if (run >= PARALLEL_MIN_RUN_M) {
          const mid = e.ks[Math.floor((start + i - 1) / 2)]!
          const gap = e.gaps.slice(start, i).reduce((s, v) => s + v, 0) / (i - start)
          const bump = Math.max(...e.bumps.slice(start, i))
          results.push({ x: Math.round(a.points[mid]!.x), z: Math.round(a.points[mid]!.z), runM: Math.round(run), gapM: Math.round(gap), bumpM: Math.round(bump * 100) / 100, valid: bump >= PARALLEL_RIDGE_MARGIN_M })
        }
        start = i
      }
    }
  })
  const artifacts = results.filter((r) => !r.valid)
  return {
    maxRunM: Math.round(maxRun), total: results.length, valid: results.length - artifacts.length, artifact: artifacts.length,
    lengthKm: artifacts.reduce((s, r) => s + r.runM, 0) / 1000,
    artifacts: artifacts.slice(0, 25).map(({ valid: _v, ...r }) => r),
  }
}

export function measureNetwork(h: WorldHydrology, floor: Float32Array, grid: Grid, waterLevel: number, landKm2: number): NetworkMetrics {
  const chains = unpackChains(h.chains) as { points: Pt[] }[]
  let streamKm = 0
  for (const c of chains) for (let k = 0; k < c.points.length - 1; k++) streamKm += Math.hypot(c.points[k + 1]!.x - c.points[k]!.x, c.points[k + 1]!.z - c.points[k]!.z) / 1000
  const cellM2 = grid.cellStep * grid.cellStep
  const edges = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, Infinity].map((c) => c * 1000)
  const hist = edges.map((to, i) => ({ fromM2: i === 0 ? 0 : edges[i - 1]!, toM2: to, points: 0 }))
  for (const c of chains) for (const p of c.points) {
    const a = p.accumulation * cellM2
    const b = hist.find((e) => a < e.toM2)
    if (b) b.points++
  }
  const systems = trunkSystems(chains, h.chains.flags, grid.cellStep).slice(0, 8).map(({ _maxAcc, ...s }) => ({ ...s, maxAccumulationM2: Math.round(_maxAcc * cellM2) }))
  return {
    streamKm, streamKmPerLandKm2: streamKm / Math.max(1e-9, landKm2), chains: chains.length, heads: chains.length,
    dryInterfluveShare: dryShare(chains, floor, grid, waterLevel), payloadMiB: payloadBytes(h) / 1048576,
    trunkSystems: systems, accumulationAreaHistogram: hist, parallelPairs: parallelPairs(chains, floor, grid),
  }
}
