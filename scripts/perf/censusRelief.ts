import { mkdirSync, writeFileSync } from 'node:fs'
import { type RawSampleParams, sampleRawTexelAt } from '../../src/terrain/chunkHeightmap'
import { WORLD_HALF_EXTENT } from '../../src/terrain/continentMask'

/**
 * tools-026 D2 (Q112): relief statistics on a regular grid (`STEP` m) over the whole continent box. Diagnostic only.
 * The generator does not expose its mountain gate, so "gated ridge land" uses `mountainRidge` (ridge × gate × land)
 * above `GATED_RIDGE_MIN` — a labelled proxy, not the gate itself.
 */
const STEP = 16
const GATED_RIDGE_MIN = 0.05
export const SLOPE_CLASS_EDGES_DEG = [5, 10, 20, 30] as const
const N = Math.round((2 * WORLD_HALF_EXTENT) / STEP) + 1

export type ReliefGrid = { n: number, step: number, floor: Float32Array, ridge: Float32Array, waterLevel: number }

export function sampleReliefGrid(params: RawSampleParams & { waterLevel: number }): ReliefGrid {
  const floor = new Float32Array(N * N)
  const ridge = new Float32Array(N * N)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const s = sampleRawTexelAt(-WORLD_HALF_EXTENT + i * STEP, -WORLD_HALF_EXTENT + j * STEP, params)
    floor[j * N + i] = s.floorH
    ridge[j * N + i] = s.mountainRidge
  }
  return { n: N, step: STEP, floor, ridge, waterLevel: params.waterLevel }
}

/** Slope in degrees at a world position (central differences on the grid). */
export function slopeDegAt(g: ReliefGrid, x: number, z: number): number {
  const fi = (x + WORLD_HALF_EXTENT) / g.step
  const fj = (z + WORLD_HALF_EXTENT) / g.step
  const i = Math.min(g.n - 2, Math.max(1, Math.round(fi)))
  const j = Math.min(g.n - 2, Math.max(1, Math.round(fj)))
  const dx = (g.floor[j * g.n + i + 1]! - g.floor[j * g.n + i - 1]!) / (2 * g.step)
  const dz = (g.floor[(j + 1) * g.n + i]! - g.floor[(j - 1) * g.n + i]!) / (2 * g.step)
  return (Math.atan(Math.hypot(dx, dz)) * 180) / Math.PI
}

export function slopeClassOf(deg: number): number {
  let c = 0
  while (c < SLOPE_CLASS_EDGES_DEG.length && deg >= SLOPE_CLASS_EDGES_DEG[c]!) c++
  return c
}
export const SLOPE_CLASS_LABELS = ['<5°', '5–10°', '10–20°', '20–30°', '≥30°']

/** Peaks with topographic prominence via a high→low union-find sweep (land cells only, 8-neighbourhood). */
function peaks(g: ReliefGrid, top: number) {
  const { n, floor, waterLevel } = g
  const order: number[] = []
  for (let k = 0; k < n * n; k++) if (floor[k]! > waterLevel) order.push(k)
  order.sort((a, b) => floor[b]! - floor[a]! || a - b)
  const parent = new Int32Array(n * n).fill(-1)
  const summit = new Int32Array(n * n)
  const find = (a: number): number => { while (parent[a] !== a) { parent[a] = parent[parent[a]!]!; a = parent[a]! } return a }
  const prom = new Map<number, number>()
  for (const k of order) {
    parent[k] = k
    summit[k] = k
    const i = k % n
    const j = (k / n) | 0
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue
      const ii = i + di
      const jj = j + dj
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const q = jj * n + ii
      if (parent[q]! < 0) continue
      const a = find(k)
      const b = find(q)
      if (a === b) continue
      const sa = summit[a]!
      const sb = summit[b]!
      const lowerS = floor[sa]! < floor[sb]! || (floor[sa] === floor[sb] && sa > sb) ? sa : sb
      prom.set(lowerS, floor[lowerS]! - floor[k]!)
      parent[a] = b
      summit[b] = lowerS === sa ? sb : sa
    }
  }
  const root = order[0]
  if (root !== undefined) prom.set(summit[find(root)]!, floor[summit[find(root)]!]! - waterLevel)
  const list = [...prom.entries()].sort((a, b) => floor[b[0]]! - floor[a[0]]!).filter(([, p]) => p >= 5).slice(0, top)
  return list.map(([k, p]) => {
    const i = k % n
    const j = (k / n) | 0
    let iso = Infinity
    for (let q = 0; q < n * n; q++) {
      if (floor[q]! <= floor[k]! || q === k) continue
      const d = Math.hypot(((q % n) - i) * g.step, (((q / n) | 0) - j) * g.step)
      if (d < iso) iso = d
    }
    return { x: -WORLD_HALF_EXTENT + i * g.step, z: -WORLD_HALF_EXTENT + j * g.step, heightM: +floor[k]!.toFixed(1), prominenceM: +p.toFixed(1), isolationM: Number.isFinite(iso) ? Math.round(iso) : null }
  })
}

export function measureRelief(g: ReliefGrid, seed: number, transectDir: string | undefined) {
  const { n, floor, ridge, waterLevel } = g
  const heights: number[] = []
  const slopeCls = new Array(SLOPE_CLASS_LABELS.length).fill(0) as number[]
  let land = 0
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) {
    const k = j * n + i
    if (floor[k]! <= waterLevel) continue
    land++
    heights.push(floor[k]!)
    const dx = (floor[k + 1]! - floor[k - 1]!) / (2 * g.step)
    const dz = (floor[k + n]! - floor[k - n]!) / (2 * g.step)
    slopeCls[slopeClassOf((Math.atan(Math.hypot(dx, dz)) * 180) / Math.PI)]!++
  }
  heights.sort((a, b) => a - b)
  const q = (p: number) => +heights[Math.min(heights.length - 1, Math.floor(p * heights.length))]!.toFixed(1)
  const max = heights[heights.length - 1] ?? 0
  const binW = Math.max(5, Math.ceil(max / 12 / 5) * 5)
  const hist: { fromM: number, toM: number, sharePct: number }[] = []
  for (let b = 0; b * binW <= max; b++) {
    const c = heights.filter((h) => h >= b * binW && h < (b + 1) * binW).length
    hist.push({ fromM: b * binW, toM: (b + 1) * binW, sharePct: +((100 * c) / Math.max(1, land)).toFixed(2) })
  }
  // Gated ridge land components (8-neighbour flood fill).
  const gated = new Uint8Array(n * n)
  for (let k = 0; k < n * n; k++) if (floor[k]! > waterLevel && ridge[k]! >= GATED_RIDGE_MIN) gated[k] = 1
  const seen = new Uint8Array(n * n)
  const comps: { km2: number, extentKm: number }[] = []
  let gatedCells = 0
  for (let s = 0; s < n * n; s++) {
    if (!gated[s] || seen[s]) continue
    const stack = [s]
    seen[s] = 1
    let cells = 0
    let minI = n, maxI = 0, minJ = n, maxJ = 0
    while (stack.length) {
      const k = stack.pop()!
      cells++
      const i = k % n
      const j = (k / n) | 0
      minI = Math.min(minI, i); maxI = Math.max(maxI, i); minJ = Math.min(minJ, j); maxJ = Math.max(maxJ, j)
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ii = i + di
        const jj = j + dj
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        const kk = jj * n + ii
        if (gated[kk] && !seen[kk]) { seen[kk] = 1; stack.push(kk) }
      }
    }
    gatedCells += cells
    comps.push({ km2: +((cells * g.step * g.step) / 1e6).toFixed(3), extentKm: +((Math.hypot(maxI - minI, maxJ - minJ) * g.step) / 1000).toFixed(2) })
  }
  comps.sort((a, b) => b.km2 - a.km2)
  if (transectDir) {
    mkdirSync(transectDir, { recursive: true })
    const H = WORLD_HALF_EXTENT
    const lines: [string, number, number, number, number][] = [['west-east', -H, 0, H, 0], ['north-south', 0, -H, 0, H], ['diagonal', -H, -H, H, H]]
    for (const [name, x0, z0, x1, z1] of lines) {
      const len = Math.hypot(x1 - x0, z1 - z0)
      const steps = Math.round(len / g.step)
      const rows = ['dist_m,x,z,floor_m']
      for (let s = 0; s <= steps; s++) {
        const x = x0 + ((x1 - x0) * s) / steps
        const z = z0 + ((z1 - z0) * s) / steps
        const i = Math.min(n - 1, Math.max(0, Math.round((x + H) / g.step)))
        const j = Math.min(n - 1, Math.max(0, Math.round((z + H) / g.step)))
        rows.push(`${Math.round((len * s) / steps)},${Math.round(x)},${Math.round(z)},${floor[j * n + i]!.toFixed(2)}`)
      }
      writeFileSync(`${transectDir}/relief-transect-${seed}-${name}.csv`, `${rows.join('\n')}\n`)
    }
  }
  return {
    gridStepM: g.step, landKm2: +((land * g.step * g.step) / 1e6).toFixed(1),
    heightQuantilesM: { p10: q(0.1), p50: q(0.5), p90: q(0.9), p99: q(0.99), max: +max.toFixed(1) },
    heightHistogram: hist,
    slopeClassSharePct: Object.fromEntries(SLOPE_CLASS_LABELS.map((l, i) => [l, +((100 * slopeCls[i]!) / Math.max(1, land)).toFixed(2)])),
    gatedRidgeLand: { definition: `mountainRidge ≥ ${GATED_RIDGE_MIN} (proxy)`, sharePct: +((100 * gatedCells) / Math.max(1, land)).toFixed(2), components: comps.length, top: comps.slice(0, 6) },
    peaks: peaks(g, 20),
    transects: transectDir ? `${transectDir}/relief-transect-${seed}-*.csv` : 'not exported (--transects=<dir>)',
  }
}
