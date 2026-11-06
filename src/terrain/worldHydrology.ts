import { createNoise2D } from 'simplex-noise'
import { projectOntoSegment } from '../math/segment'
import { createSeededRandom } from '../world/parseSeed'
import { type RawSampleParams, sampleRawFloorUncorrected } from './chunkHeightmap'
import { WORLD_HALF_EXTENT } from './continentMask'
import {
  DEFAULT_RIVER_THRESHOLDS,
  MEANDER_NOISE_SEED_XOR,
  meanderChainPointsWith,
  RIVER_CELL_STEP,
  RIVER_MEANDER_TAPER_DISTANCE,
  type RiverPoint,
  smoothChainPoints,
} from './riverNetwork'
import { SPARSE_BLOCK_SIZE, unpackChains } from './worldHydrologyStore'

/**
 * Global hydrology over a finite grid (plan world-terrain-058, slice H1). Pure: no Three.js, no registry, no
 * settlements/roads/player (decision 3) — worker-safe. One pass over the whole continent replaces the per-tile window:
 * sea mask → priority flood with an ε gradient (Barnes 2014) → pit policy (breach first, fill small, lake large) →
 * D8 flow and accumulation on the flooded surface → confluence-aware global chains with mouth ramps → sparse
 * correction layer (breach cuts, filled pits) and lake basins.
 *
 * Input is the RAW floor (`sampleFloorAt`, no correction). Determinism: heap ordered by `(height, index)`, no
 * `Math.random`, floats summed in a fixed order; the result depends only on `(floor, options, seed)`.
 * Donor: V3 `world/gen/hydrology.ts` (pit policy) and `world/rivers/riverChains.ts` (chains); cut depths recalibrated
 * for V1's 18 m relief (`DEFAULT_WORLD_HYDROLOGY_OPTIONS`, calibration recorded in the 058 implementation notes).
 *
 * @domain world-terrain
 * @subdomain hydrology
 */

/**
 * Bump when the algorithm or its defaults change (feeds `hydrologyId` in H2) — i.e. whenever the output for the same
 * input changes. The golden-hash test in `worldHydrology.test.ts` fails then; after bumping, re-export the worldgen
 * fixtures and update the hashes (stale IndexedDB records and fixtures are dropped by the id).
 */
export const WORLD_HYDROLOGY_VERSION = 8

export type WorldHydrologyOptions = {
  /** Sea / lake-free water plane (m). */
  waterLevel: number
  /** A cell is part of a pit when `filled - height` exceeds this (m). */
  pitEpsM: number
  /** Gradient added per flood step so flats drain deterministically (m). */
  floodEpsM: number
  /** Max cut (m) of a breach path below the original ground. */
  breachMaxCutM: number
  /** Max breach path length (cells). */
  breachMaxLenCells: number
  /** Max rise per metre of the breach valley flanks. */
  breachSideSlope: number
  /** Max flank radius (cells). */
  breachMaxRadCells: number
  /** A pit floor must lie this far above the water for a breach to be tried (m). */
  breachMinFloorM: number
  /** Pits with at least this many cells and `lakeMinDepthM` depth stay lakes; smaller ones are breached or filled. */
  lakeMinCells: number
  lakeMinDepthM: number
  /** Inland below-sea components with at least this many cells stay sea-level lakes; smaller ones are raised. */
  terminalMinCells: number
  /** Flow accumulation (cells) that makes a stream. */
  streamAccumulation: number
  /** Isolated chains shorter than this many cells are dropped (threshold noise). */
  minChainCells: number
  /** Length (m) of the water-surface ramp to the receiver level at a chain end. */
  mouthRampM: number
  /** Seeds the meander noise. */
  seed: number
}

export const DEFAULT_WORLD_HYDROLOGY_OPTIONS: WorldHydrologyOptions = {
  waterLevel: 0.45,
  pitEpsM: 0.05,
  floodEpsM: 2e-4,
  breachMaxCutM: 3,
  breachMaxLenCells: 48,
  breachSideSlope: 0.5,
  breachMaxRadCells: 4,
  breachMinFloorM: 0,
  // Q96 (author 2026-11-03): 600 cells (~3.8 ha) — 20 lakes on seed 415424794, 16 on 42 (was 80 → ~260 ponds).
  lakeMinCells: 600,
  lakeMinDepthM: 0.3,
  terminalMinCells: 120,
  streamAccumulation: DEFAULT_RIVER_THRESHOLDS.stream,
  minChainCells: 8,
  mouthRampM: 24,
  seed: 0,
}

/** The one hydrology grid: the whole finite world at `RIVER_CELL_STEP` (1537² cells for ±6144 m). */
export const WORLD_HYDROLOGY_GRID = {
  size: Math.round((2 * WORLD_HALF_EXTENT) / RIVER_CELL_STEP) + 1,
  cellStep: RIVER_CELL_STEP,
  originX: -WORLD_HALF_EXTENT,
  originZ: -WORLD_HALF_EXTENT,
} as const

export type WorldHydrologyGrid = {
  /** Raw floor heights, row-major (`iz * size + ix`), `size * size` long. Not modified. */
  floor: Float32Array
  size: number
  cellStep: number
  /** World position of cell (0, 0). */
  originX: number
  originZ: number
}

export { SPARSE_BLOCK_SIZE, unpackChains }

/** Non-empty `SPARSE_BLOCK_SIZE`² blocks of a dense grid, sorted by block id (`bz * blocksPerRow + bx`). */
export type SparseBlocks<T extends Float32Array | Uint16Array> = {
  blocksPerRow: number
  blockIds: Uint32Array
  /** `blockIds.length * SPARSE_BLOCK_SIZE²` values. */
  data: T
}

/** What a chain ends in. */
export const ChainEnd = { Sea: 0, Lake: 1, Join: 2, Edge: 3 } as const
export type ChainEndKind = (typeof ChainEnd)[keyof typeof ChainEnd]

export type PackedChains = {
  /** `(x, z, elevation, accumulation)` per point. */
  points: Float32Array
  /** Point index ranges: chain `i` is points `[offsets[i], offsets[i + 1])`. */
  offsets: Uint32Array
  /** Low nibble `ChainEndKind`; bit 4 set when the chain starts at a lake outlet. */
  flags: Uint8Array
}

export type HydrologyLake = {
  /** 1-based id (`basin` stores it). */
  id: number
  /** Water surface (m). */
  level: number
  /** Cells that hold water (flooded cells, not the dilated rim). */
  cells: number
  areaM2: number
  /** Spill (saddle) cell centre. */
  outletX: number
  outletZ: number
}

export type WorldHydrologyStats = {
  landCells: number
  pits: number
  breachTried: number
  breached: number
  /** Cells lowered by breach paths and flanks. */
  cutCells: number
  /** Largest cut below the original floor over all cells (m, positive). */
  maxCutM: number
  /** Largest raise of a filled pit (m). */
  maxFillM: number
  /** Why breach attempts failed. */
  breachFails: Record<'shallow' | 'noPass' | 'tooLong' | 'noExit' | 'tooDeep', number>
  filledPits: number
  filledCells: number
  lakes: number
  lakeCells: number
  terminalLakes: number
  terminalCells: number
  raisedCells: number
  /** Land cells that drain nowhere (must be 0). */
  drySinks: number
  /** Land border cells (drain off the grid). */
  edgeDrains: number
  chains: number
  chainEnds: Record<'sea' | 'lake' | 'join' | 'edge', number>
  computeMs: number
}

export type WorldHydrology = {
  version: number
  cellStep: number
  size: number
  originX: number
  originZ: number
  /** `height - floor` where non-zero (breach cuts negative, filled pits positive). */
  correction: SparseBlocks<Float32Array>
  /** Lake id (1-based) per cell: flooded cells dilated by one cell. */
  basin: SparseBlocks<Uint16Array>
  lakes: HydrologyLake[]
  chains: PackedChains
  stats: WorldHydrologyStats
}

// ---- grid sampling -------------------------------------------------------------------------------------------------

/**
 * Raw floor rows `[rowStart, rowEnd)` of the hydrology grid (no correction, no registry). H2 splits the rows across the
 * worker pool; the concatenation equals one call over all rows.
 */
export function sampleRawFloorRows(
  params: RawSampleParams,
  grid: Pick<WorldHydrologyGrid, 'size' | 'cellStep' | 'originX' | 'originZ'>,
  rowStart: number,
  rowEnd: number,
): Float32Array {
  const { size, cellStep, originX, originZ } = grid
  const out = new Float32Array((rowEnd - rowStart) * size)
  let o = 0
  for (let iz = rowStart; iz < rowEnd; iz++) {
    const z = originZ + iz * cellStep
    for (let ix = 0; ix < size; ix++) out[o++] = sampleRawFloorUncorrected(originX + ix * cellStep, z, params)
  }
  return out
}

// ---- helpers -------------------------------------------------------------------------------------------------------

const DI = [1, -1, 0, 0, 1, 1, -1, -1]
const DJ = [0, 0, 1, -1, 1, -1, 1, -1]
const DIST = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2]

/** Min-heap on `(key, index)` — the index tie-break makes the pop order deterministic. */
class CellHeap {
  private keys: Float32Array
  private ids: Int32Array
  size = 0
  constructor(capacity: number) {
    this.keys = new Float32Array(capacity)
    this.ids = new Int32Array(capacity)
  }
  private less(ka: number, ia: number, kb: number, ib: number): boolean {
    return ka < kb || (ka === kb && ia < ib)
  }
  push(key: number, id: number): void {
    let i = this.size++
    while (i > 0) {
      const p = (i - 1) >> 1
      if (!this.less(key, id, this.keys[p]!, this.ids[p]!)) break
      this.keys[i] = this.keys[p]!
      this.ids[i] = this.ids[p]!
      i = p
    }
    this.keys[i] = key
    this.ids[i] = id
  }
  pop(): number {
    const top = this.ids[0]!
    const n = --this.size
    if (n > 0) {
      const key = this.keys[n]!
      const id = this.ids[n]!
      let i = 0
      for (;;) {
        let c = 2 * i + 1
        if (c >= n) break
        if (c + 1 < n && this.less(this.keys[c + 1]!, this.ids[c + 1]!, this.keys[c]!, this.ids[c]!)) c++
        if (!this.less(this.keys[c]!, this.ids[c]!, key, id)) break
        this.keys[i] = this.keys[c]!
        this.ids[i] = this.ids[c]!
        i = c
      }
      this.keys[i] = key
      this.ids[i] = id
    }
    return top
  }
}

type FloodResult = {
  filled: Float32Array
  /** Pop order (low to high flooded level); sea interiors are not listed. */
  order: Int32Array
  count: number
  rank: Int32Array
  parent: Int32Array
}

type Pit = {
  cells: number[]
  maxDepth: number
  floor: number
  level: number
  /** The spill (saddle) cell, outside the pit; -1 if unknown. */
  pass: number
}

/** `sea[k]`: 0 land, 1 open sea (4-connected to the border), 2 inland sea-level lake. Small inland basins are raised in `height`. */
function seaMask(height: Float32Array, n: number, opts: WorldHydrologyOptions, stats: WorldHydrologyStats): Uint8Array {
  const N = n * n
  const w = opts.waterLevel
  const sea = new Uint8Array(N)
  const stack = new Int32Array(N)
  let sp = 0
  const grow = (into: number[] | null, mark: (k: number) => boolean): void => {
    while (sp > 0) {
      const k = stack[--sp]!
      into?.push(k)
      const i = k % n
      const j = (k / n) | 0
      for (let d = 0; d < 4; d++) {
        const ii = i + DI[d]!
        const jj = j + DJ[d]!
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        const kk = jj * n + ii
        if (mark(kk)) stack[sp++] = kk
      }
    }
  }
  for (let k = 0; k < N; k++) {
    const i = k % n
    const j = (k / n) | 0
    if ((i === 0 || j === 0 || i === n - 1 || j === n - 1) && height[k]! < w && !sea[k]) {
      sea[k] = 1
      stack[sp++] = k
    }
  }
  grow(null, (kk) => {
    if (sea[kk] || height[kk]! >= w) return false
    sea[kk] = 1
    return true
  })
  const seen = new Uint8Array(N)
  for (let s0 = 0; s0 < N; s0++) {
    if (sea[s0] || seen[s0] || height[s0]! >= w) continue
    const comp: number[] = []
    seen[s0] = 1
    stack[sp++] = s0
    grow(comp, (kk) => {
      if (sea[kk] || seen[kk] || height[kk]! >= w) return false
      seen[kk] = 1
      return true
    })
    if (comp.length >= opts.terminalMinCells) {
      for (const k of comp) sea[k] = 2
      stats.terminalLakes++
      stats.terminalCells += comp.length
    } else {
      for (const k of comp) height[k] = w + 0.3
      stats.raisedCells += comp.length
    }
  }
  return sea
}

/** Priority flood with an ε gradient from the border and the water. Interior water cells are not queued. */
function flood(height: Float32Array, n: number, sea: Uint8Array, eps: number): FloodResult {
  const N = n * n
  const filled = new Float32Array(N)
  const done = new Uint8Array(N)
  const parent = new Int32Array(N).fill(-1)
  const rank = new Int32Array(N).fill(-1)
  const heap = new CellHeap(N)
  for (let k = 0; k < N; k++) {
    const i = k % n
    const j = (k / n) | 0
    const border = i === 0 || j === 0 || i === n - 1 || j === n - 1
    if (!border && !sea[k]) continue
    filled[k] = height[k]!
    done[k] = 1
    let seed = border || !sea[k]
    if (!seed) {
      for (let d = 0; d < 8; d++) {
        const ii = i + DI[d]!
        const jj = j + DJ[d]!
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        if (!sea[jj * n + ii]) {
          seed = true
          break
        }
      }
    }
    if (seed) heap.push(filled[k]!, k)
  }
  const order = new Int32Array(N)
  let oc = 0
  while (heap.size) {
    const k = heap.pop()
    rank[k] = oc
    order[oc++] = k
    const i = k % n
    const j = (k / n) | 0
    for (let d = 0; d < 8; d++) {
      const ii = i + DI[d]!
      const jj = j + DJ[d]!
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const kk = jj * n + ii
      if (done[kk]) continue
      done[kk] = 1
      parent[kk] = k
      filled[kk] = Math.max(height[kk]!, filled[k]! + eps)
      heap.push(filled[kk]!, kk)
    }
  }
  return { filled, order, count: oc, rank, parent }
}

/**
 * Pits: 8-connected components of cells with `filled - height > pitEps` whose `filled` differs by at most `pitEps`
 * between neighbours (nested basins at different levels stay separate), in ascending index of their first cell. The pass
 * (saddle) is found by walking the flood parents of the first-popped pit cell back to the first cell that was not raised.
 */
function labelPits(height: Float32Array, n: number, fl: FloodResult, pitEps: number): Pit[] {
  const { filled, rank, parent } = fl
  const N = n * n
  const seen = new Uint8Array(N)
  const pits: Pit[] = []
  for (let s = 0; s < N; s++) {
    if (seen[s] || filled[s]! - height[s]! <= pitEps) continue
    const cells = [s]
    seen[s] = 1
    let maxDepth = 0
    let floor = s
    let level = Infinity
    let first = s
    for (let c = 0; c < cells.length; c++) {
      const k = cells[c]!
      maxDepth = Math.max(maxDepth, filled[k]! - height[k]!)
      if (height[k]! < height[floor]! || (height[k] === height[floor] && k < floor)) floor = k
      level = Math.min(level, filled[k]!)
      if (rank[k]! >= 0 && (rank[first]! < 0 || rank[k]! < rank[first]!)) first = k
      const i = k % n
      const j = (k / n) | 0
      for (let d = 0; d < 8; d++) {
        const ii = i + DI[d]!
        const jj = j + DJ[d]!
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        const kk = jj * n + ii
        if (seen[kk] || filled[kk]! - height[kk]! <= pitEps || Math.abs(filled[kk]! - filled[k]!) > pitEps) continue
        seen[kk] = 1
        cells.push(kk)
      }
    }
    let pass = parent[first]!
    while (pass >= 0 && filled[pass]! > height[pass]! && parent[pass]! >= 0) pass = parent[pass]!
    pits.push({ cells, maxDepth, floor, level, pass })
  }
  return pits
}

/** D8 line (integer steps) from `a` to `b`, both included. */
function lineCells(a: number, b: number, n: number): number[] {
  const ai = a % n
  const aj = (a / n) | 0
  const bi = b % n
  const bj = (b / n) | 0
  const steps = Math.max(Math.abs(bi - ai), Math.abs(bj - aj))
  const out: number[] = []
  for (let t = 0; t <= steps; t++) {
    const f = steps === 0 ? 0 : t / steps
    out.push(Math.round(aj + (bj - aj) * f) * n + Math.round(ai + (bi - ai) * f))
  }
  return out
}

/**
 * Try to drain a pit: path = D8 line floor → pass, then steepest descent of the flooded surface from the pass to the
 * first cell at least 0.02 m below the floor (the exit). Path cells are graded linearly from the floor height to the exit
 * and lowered to that grade; flank cells within `maxRad` are lowered to at most the grade plus `distance * sideSlope`.
 * Fails (nothing changed) when the path is longer than `maxLen`, no exit is found, the floor is within 0.1 m of the water,
 * or a path cell would be lowered by more than `maxCut`. Returns the cells lowered, or 0.
 */
function tryBreach(
  height: Float32Array,
  n: number,
  fl: FloodResult,
  pit: Pit,
  opts: WorldHydrologyOptions,
  cellStep: number,
  stats: WorldHydrologyStats,
  original: Float32Array,
): number {
  const hf = height[pit.floor]!
  const minLevel = opts.waterLevel + 0.02
  if (pit.pass < 0) {
    stats.breachFails.noPass++
    return 0
  }
  if (hf < opts.waterLevel + opts.breachMinFloorM) {
    stats.breachFails.shallow++
    return 0
  }
  const maxLen = opts.breachMaxLenCells
  const path = lineCells(pit.floor, pit.pass, n)
  if (path.length > maxLen) {
    stats.breachFails.tooLong++
    return 0
  }
  let cur = pit.pass
  let exit = -1
  for (let guard = 0; guard < maxLen && path.length <= maxLen; guard++) {
    const i = cur % n
    const j = (cur / n) | 0
    let best = 0
    let bk = -1
    for (let d = 0; d < 8; d++) {
      const ii = i + DI[d]!
      const jj = j + DJ[d]!
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const kk = jj * n + ii
      const slope = (fl.filled[cur]! - fl.filled[kk]!) / DIST[d]!
      if (slope > best) {
        best = slope
        bk = kk
      }
    }
    if (bk < 0) {
      stats.breachFails.noExit++
      return 0
    }
    path.push(bk)
    cur = bk
    if (height[cur]! <= hf - 0.02) {
      exit = cur
      break
    }
  }
  if (exit < 0 || path.length > maxLen) {
    stats.breachFails[exit < 0 ? 'noExit' : 'tooLong']++
    return 0
  }
  const last = path.length - 1
  const exitTarget = Math.max(minLevel, Math.min(height[exit]!, hf - 0.02))
  const targets = path.map((_, t) => hf + (exitTarget - hf) * (t / last))
  for (let t = 0; t <= last; t++) if (original[path[t]!]! - targets[t]! > opts.breachMaxCutM) {
      stats.breachFails.tooDeep++
      return 0
    }
  let cut = 0
  for (let t = 1; t <= last; t++) {
    const k = path[t]!
    if (targets[t]! < height[k]!) {
      height[k] = targets[t]!
      cut++
    }
  }
  const kRad = Math.min(opts.breachMaxRadCells, Math.ceil(opts.breachMaxCutM / (opts.breachSideSlope * cellStep)))
  for (let t = 1; t <= last; t++) {
    const pi = path[t]! % n
    const pj = (path[t]! / n) | 0
    for (let dj = -kRad; dj <= kRad; dj++) {
      for (let di = -kRad; di <= kRad; di++) {
        const ii = pi + di
        const jj = pj + dj
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        const lvl = Math.max(minLevel, targets[t]! + Math.sqrt(di * di + dj * dj) * cellStep * opts.breachSideSlope)
        const kk = jj * n + ii
        if (lvl < height[kk]!) {
          height[kk] = lvl
          cut++
        }
      }
    }
  }
  return cut
}

/** Dense `T` grid → non-empty `SPARSE_BLOCK_SIZE`² blocks (`isSet` decides emptiness). */
export function packSparseBlocks<T extends Float32Array | Uint16Array>(
  dense: T,
  n: number,
  make: (length: number) => T,
  isSet: (v: number) => boolean,
): SparseBlocks<T> {
  const B = SPARSE_BLOCK_SIZE
  const perRow = Math.ceil(n / B)
  const ids: number[] = []
  for (let bz = 0; bz < perRow; bz++) {
    for (let bx = 0; bx < perRow; bx++) {
      let any = false
      const z1 = Math.min(n, (bz + 1) * B)
      const x1 = Math.min(n, (bx + 1) * B)
      for (let z = bz * B; z < z1 && !any; z++) {
        for (let x = bx * B; x < x1; x++) {
          if (isSet(dense[z * n + x]!)) {
            any = true
            break
          }
        }
      }
      if (any) ids.push(bz * perRow + bx)
    }
  }
  const data = make(ids.length * B * B)
  ids.forEach((id, b) => {
    const bx = id % perRow
    const bz = (id / perRow) | 0
    for (let z = 0; z < B; z++) {
      const gz = bz * B + z
      if (gz >= n) break
      for (let x = 0; x < B; x++) {
        const gx = bx * B + x
        if (gx >= n) break
        data[b * B * B + z * B + x] = dense[gz * n + gx]!
      }
    }
  })
  return { blocksPerRow: perRow, blockIds: Uint32Array.from(ids), data }
}

/** Value of a sparse grid at cell `(ix, iz)`; 0 outside stored blocks. */
export function sparseBlockValue<T extends Float32Array | Uint16Array>(sb: SparseBlocks<T>, ix: number, iz: number): number {
  const B = SPARSE_BLOCK_SIZE
  if (ix < 0 || iz < 0) return 0
  const id = Math.floor(iz / B) * sb.blocksPerRow + Math.floor(ix / B)
  let lo = 0
  let hi = sb.blockIds.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const v = sb.blockIds[mid]!
    if (v === id) return sb.data[mid * B * B + (iz % B) * B + (ix % B)]!
    if (v < id) lo = mid + 1
    else hi = mid - 1
  }
  return 0
}

// ---- chains --------------------------------------------------------------------------------------------------------

type RawChain = {
  /** Cell indices walked (interior points). */
  cells: number[]
  end: ChainEndKind
  /** Cell the chain ends at/in: join cell, receiving sea/lake cell. */
  endCell: number
  /** Lake id of the end (lake end) or of the source (lake-fed head); 0 otherwise. */
  lakeEnd: number
  lakeFed: number
  /** Index of the chain a join ends in (-1 otherwise); resolved after all chains are walked. */
  joinTarget: number
}

function polylineLength(pts: RiverPoint[]): number {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z)
  return s
}

/** Ramps the water surface of the last `rampM` metres to `level`; the last point lands exactly on `level`. */
function rampToLevel(pts: RiverPoint[], level: number, rampM: number): RiverPoint[] {
  const out = pts.map((p) => ({ ...p }))
  let d = 0
  out[out.length - 1]!.elevation = level
  for (let i = out.length - 2; i >= 0; i--) {
    d += Math.hypot(out[i]!.x - out[i + 1]!.x, out[i]!.z - out[i + 1]!.z)
    if (d >= rampM) break
    const f = d / rampM
    out[i]!.elevation = level + (Math.max(level, out[i]!.elevation) - level) * f
  }
  return out
}

/** Index of the polyline point nearest to `(x, z)` projected on its segments: returns the projected point. */
function projectOntoChain(pts: RiverPoint[], x: number, z: number): RiverPoint {
  let best = Infinity
  let bi = 0
  let bt = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i]!
    const b = pts[i + 1]!
    const r = projectOntoSegment(x, z, a.x, a.z, b.x, b.z)
    if (r.distSq < best) {
      best = r.distSq
      bi = i
      bt = r.t
    }
  }
  const a = pts[bi]!
  const b = pts[Math.min(bi + 1, pts.length - 1)]!
  return {
    x: a.x + (b.x - a.x) * bt,
    z: a.z + (b.z - a.z) * bt,
    elevation: a.elevation + (b.elevation - a.elevation) * bt,
    accumulation: a.accumulation + (b.accumulation - a.accumulation) * bt,
  }
}

// ---- main ----------------------------------------------------------------------------------------------------------

/** Computes the global hydrology of `grid`. Pure and deterministic; see the module doc. */
export function computeWorldHydrology(
  grid: WorldHydrologyGrid,
  options: Partial<WorldHydrologyOptions> = {},
): WorldHydrology {
  const t0 = performance.now()
  const opts: WorldHydrologyOptions = { ...DEFAULT_WORLD_HYDROLOGY_OPTIONS, ...options }
  const { size: n, cellStep, originX, originZ } = grid
  const N = n * n
  const stats: WorldHydrologyStats = {
    landCells: 0, pits: 0, breachTried: 0, breached: 0, cutCells: 0, maxCutM: 0, maxFillM: 0, breachFails: { shallow: 0, noPass: 0, tooLong: 0, noExit: 0, tooDeep: 0 }, filledPits: 0, filledCells: 0,
    lakes: 0, lakeCells: 0, terminalLakes: 0, terminalCells: 0, raisedCells: 0, drySinks: 0, edgeDrains: 0, chains: 0,
    chainEnds: { sea: 0, lake: 0, join: 0, edge: 0 }, computeMs: 0,
  }
  const original = grid.floor
  const height = Float32Array.from(original)
  const sea = seaMask(height, n, opts, stats)

  // Pit policy: breach every pit that is not a lake by size and depth, flood again, then keep or fill what is left.
  let fl = flood(height, n, sea, opts.floodEpsM)
  const first = labelPits(height, n, fl, opts.pitEpsM)
  stats.pits = first.length
  let breachedAny = false
  for (const pit of first) {
    if (pit.cells.length >= opts.lakeMinCells && pit.maxDepth >= opts.lakeMinDepthM) continue
    stats.breachTried++
    const cut = tryBreach(height, n, fl, pit, opts, cellStep, stats, original)
    if (cut > 0) {
      stats.breached++
      stats.cutCells += cut
      breachedAny = true
    }
  }
  if (breachedAny) fl = flood(height, n, sea, opts.floodEpsM)
  const { filled, order, count: oc } = fl
  const finalPits = labelPits(height, n, fl, opts.pitEpsM)

  const lakeId = new Uint16Array(N)
  const lakes: HydrologyLake[] = []
  const cell2 = cellStep * cellStep
  for (const pit of finalPits) {
    if (pit.cells.length >= opts.lakeMinCells && pit.maxDepth >= opts.lakeMinDepthM && lakes.length < 65535) {
      const id = lakes.length + 1
      for (const k of pit.cells) lakeId[k] = id
      const pass = pit.pass >= 0 ? pit.pass : pit.floor
      lakes.push({
        id,
        level: pit.level,
        cells: pit.cells.length,
        areaM2: pit.cells.length * cell2,
        outletX: originX + (pass % n) * cellStep,
        outletZ: originZ + Math.floor(pass / n) * cellStep,
      })
      stats.lakes++
      stats.lakeCells += pit.cells.length
    } else {
      stats.filledPits++
      stats.filledCells += pit.cells.length
      for (const k of pit.cells) height[k] = filled[k]!
    }
  }
  // Basin = flooded cells dilated by one cell (8-neighbourhood), first lake by id wins.
  const basinData = new Uint16Array(N)
  for (let k = 0; k < N; k++) {
    const id = lakeId[k]!
    if (!id) continue
    basinData[k] = id
  }
  for (let k = 0; k < N; k++) {
    const id = lakeId[k]!
    if (!id) continue
    const i = k % n
    const j = (k / n) | 0
    for (let d = 0; d < 8; d++) {
      const ii = i + DI[d]!
      const jj = j + DJ[d]!
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const kk = jj * n + ii
      if (!basinData[kk] && !sea[kk]) basinData[kk] = id
    }
  }

  // Flow on the flooded surface: steepest descent, ties by direction order. Water cells are outlets.
  const down = new Int32Array(N).fill(-1)
  for (let o = 0; o < oc; o++) {
    const k = order[o]!
    if (sea[k]) continue
    stats.landCells++
    const i = k % n
    const j = (k / n) | 0
    let best = 0
    let bk = -1
    for (let d = 0; d < 8; d++) {
      const ii = i + DI[d]!
      const jj = j + DJ[d]!
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const kk = jj * n + ii
      const slope = (filled[k]! - filled[kk]!) / DIST[d]!
      if (slope > best) {
        best = slope
        bk = kk
      }
    }
    down[k] = bk
    if (bk < 0) {
      if (i === 0 || j === 0 || i === n - 1 || j === n - 1) stats.edgeDrains++
      else stats.drySinks++
    }
  }
  const acc = new Float32Array(N)
  for (let o = 0; o < oc; o++) if (!sea[order[o]!]) acc[order[o]!] = 1
  for (let o = oc - 1; o >= 0; o--) {
    const k = order[o]!
    const d = down[k]!
    if (d >= 0 && !sea[k]) acc[d] = acc[d]! + acc[k]!
  }

  // Stream cells: land, outside every basin, at or above the accumulation threshold.
  const isRiver = new Uint8Array(N)
  for (let o = 0; o < oc; o++) {
    const k = order[o]!
    if (!sea[k] && !basinData[k] && acc[k]! >= opts.streamAccumulation) isRiver[k] = 1
  }
  // Main upstream of each stream cell: the larger accumulation continues the chain at a confluence.
  const mainUp = new Int32Array(N).fill(-1)
  for (let k = 0; k < N; k++) {
    if (!isRiver[k]) continue
    const d = down[k]!
    if (d < 0 || !isRiver[d]) continue
    const m = mainUp[d]!
    if (m < 0 || acc[k]! > acc[m]! || (acc[k] === acc[m] && k < m)) mainUp[d] = k
  }

  // Walk chains from heads (stream cells without a stream upstream), in ascending cell index.
  const raw: RawChain[] = []
  const chainOfCell = new Int32Array(N).fill(-1)
  for (let h = 0; h < N; h++) {
    if (!isRiver[h]) continue
    let hasUp = false
    let lakeFed = 0
    const hi = h % n
    const hj = (h / n) | 0
    for (let d = 0; d < 8; d++) {
      const ii = hi + DI[d]!
      const jj = hj + DJ[d]!
      if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
      const u = jj * n + ii
      if (down[u] !== h) continue
      if (isRiver[u]) hasUp = true
      else if (basinData[u] && !lakeFed) lakeFed = basinData[u]!
    }
    if (hasUp) continue
    const chain: RawChain = { cells: [], end: ChainEnd.Edge, endCell: h, lakeEnd: 0, lakeFed, joinTarget: -1 }
    let cur = h
    for (;;) {
      chain.cells.push(cur)
      chainOfCell[cur] = raw.length
      const d = down[cur]!
      if (d < 0) {
        chain.end = ChainEnd.Edge
        chain.endCell = cur
        break
      }
      if (sea[d]) {
        chain.end = ChainEnd.Sea
        chain.endCell = d
        break
      }
      if (basinData[d]) {
        chain.end = ChainEnd.Lake
        chain.endCell = d
        chain.lakeEnd = basinData[d]!
        break
      }
      if (isRiver[d] && mainUp[d] === cur) {
        cur = d
        continue
      }
      chain.end = ChainEnd.Join
      chain.endCell = d
      break
    }
    raw.push(chain)
  }
  for (const c of raw) if (c.end === ChainEnd.Join) c.joinTarget = chainOfCell[c.endCell]!

  const cellPoint = (k: number): RiverPoint => ({
    x: originX + (k % n) * cellStep,
    z: originZ + Math.floor(k / n) * cellStep,
    elevation: filled[k]!,
    accumulation: acc[k]!,
  })
  const levelOf = (id: number): number => lakes[id - 1]!.level
  /** Shoreline point between land cell `k` and its water neighbour `d` at `level`. */
  const shorePoint = (k: number, d: number, level: number, toSea: boolean): RiverPoint => {
    const a = cellPoint(k)
    const b = cellPoint(d)
    let t = 0.5
    if (toSea) {
      const ha = height[k]!
      const hb = height[d]!
      t = ha > hb ? Math.min(1, Math.max(0, (ha - level) / (ha - hb))) : 0.5
    }
    return {
      x: a.x + (b.x - a.x) * t,
      z: a.z + (b.z - a.z) * t,
      elevation: level,
      accumulation: a.accumulation,
    }
  }

  const noise = createNoise2D(createSeededRandom(opts.seed ^ MEANDER_NOISE_SEED_XOR))
  const built: (RiverPoint[] | null | undefined)[] = new Array(raw.length)
  const building = new Uint8Array(raw.length)
  const build = (ci: number): RiverPoint[] | null => {
    const cached = built[ci]
    if (cached !== undefined) return cached
    if (building[ci]) return null
    building[ci] = 1
    const c = raw[ci]!
    const lastCell = c.cells[c.cells.length - 1]!
    // Threshold-noise blips: a short isolated chain is dropped (lake-fed heads are real sources).
    if (c.cells.length < opts.minChainCells && !c.lakeFed) {
      built[ci] = null
      return null
    }
    let pts: RiverPoint[] = []
    if (c.lakeFed) {
      const outlet = cellPoint(c.cells[0]!)
      // The lake rim point: between the outlet cell and its lake-side neighbour (the basin cell draining into it).
      const hi = c.cells[0]! % n
      const hj = Math.floor(c.cells[0]! / n)
      let src = -1
      for (let d = 0; d < 8 && src < 0; d++) {
        const ii = hi + DI[d]!
        const jj = hj + DJ[d]!
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue
        const u = jj * n + ii
        if (down[u] === c.cells[0] && basinData[u] === c.lakeFed) src = u
      }
      if (src >= 0) pts.push(shorePoint(c.cells[0]!, src, levelOf(c.lakeFed), false))
      else pts.push({ ...outlet })
    }
    for (const k of c.cells) pts.push(cellPoint(k))
    // Water surface never rises downstream (a lake-fed source starts at the lake level).
    for (let i = 1; i < pts.length; i++) if (pts[i]!.elevation > pts[i - 1]!.elevation) pts[i]!.elevation = pts[i - 1]!.elevation
    let receiver = pts[pts.length - 1]!.elevation
    if (c.end === ChainEnd.Sea) {
      const p = shorePoint(lastCell, c.endCell, opts.waterLevel, true)
      pts.push(p)
      receiver = opts.waterLevel
    } else if (c.end === ChainEnd.Lake) {
      const p = shorePoint(lastCell, c.endCell, levelOf(c.lakeEnd), false)
      pts.push(p)
      receiver = levelOf(c.lakeEnd)
    } else if (c.end === ChainEnd.Join) {
      const p = cellPoint(c.endCell)
      pts.push(p)
      receiver = p.elevation
    }
    if (pts.length < 2) {
      built[ci] = null
      return null
    }
    pts = rampToLevel(pts, receiver, opts.mouthRampM)
    pts = smoothChainPoints(pts)
    // Taper the meander towards both ends so mouths, sources and lake outlets stay put.
    const cum: number[] = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1]! + Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z))
    const total = cum[cum.length - 1]!
    pts = meanderChainPointsWith(pts, noise, (_p, i) =>
      Math.min(1, Math.min(cum[i]!, total - cum[i]!) / RIVER_MEANDER_TAPER_DISTANCE),
    )
    if (c.end === ChainEnd.Join) {
      const trunk = c.joinTarget >= 0 ? build(c.joinTarget) : null
      if (!trunk) {
        built[ci] = null
        return null
      }
      const last = pts[pts.length - 1]!
      const snapped = projectOntoChain(trunk, last.x, last.z)
      pts[pts.length - 1] = snapped
      // The trunk surface at the join wins; lift the stretch upstream just enough to stay non-increasing.
      for (let i = pts.length - 2; i >= 0 && pts[i]!.elevation < pts[i + 1]!.elevation; i--) pts[i]!.elevation = pts[i + 1]!.elevation
    }
    if (polylineLength(pts) <= 0) {
      built[ci] = null
      return null
    }
    built[ci] = pts
    return pts
  }

  const outChains: RiverPoint[][] = []
  const outFlags: number[] = []
  for (let ci = 0; ci < raw.length; ci++) {
    const pts = build(ci)
    if (!pts) continue
    const c = raw[ci]!
    outChains.push(pts)
    outFlags.push(c.end | (c.lakeFed ? 16 : 0))
    stats.chains++
    stats.chainEnds[c.end === ChainEnd.Sea ? 'sea' : c.end === ChainEnd.Lake ? 'lake' : c.end === ChainEnd.Join ? 'join' : 'edge']++
  }
  let total = 0
  for (const ch of outChains) total += ch.length
  const points = new Float32Array(total * 4)
  const offsets = new Uint32Array(outChains.length + 1)
  let pi = 0
  outChains.forEach((ch, i) => {
    offsets[i] = pi
    for (const p of ch) {
      points[pi * 4] = p.x
      points[pi * 4 + 1] = p.z
      points[pi * 4 + 2] = p.elevation
      points[pi * 4 + 3] = p.accumulation
      pi++
    }
  })
  offsets[outChains.length] = pi

  const corr = new Float32Array(N)
  for (let k = 0; k < N; k++) {
    const dlt = height[k]! - original[k]!
    if (Math.abs(dlt) > 1e-6) corr[k] = dlt
    if (dlt < 0 && -dlt > stats.maxCutM) stats.maxCutM = -dlt
    if (dlt > stats.maxFillM) stats.maxFillM = dlt
  }
  stats.computeMs = performance.now() - t0
  return {
    version: WORLD_HYDROLOGY_VERSION,
    cellStep,
    size: n,
    originX,
    originZ,
    correction: packSparseBlocks(corr, n, (l) => new Float32Array(l), (v) => v !== 0),
    basin: packSparseBlocks(basinData, n, (l) => new Uint16Array(l), (v) => v !== 0),
    lakes,
    chains: { points, offsets, flags: Uint8Array.from(outFlags) },
    stats,
  }
}

/** FNV-1a over the result arrays — compared across runs / worker counts and logged at boot (H2). */
export function hashWorldHydrology(h: WorldHydrology): string {
  let x = 0x811c9dc5
  const feed = (a: ArrayBufferView): void => {
    const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
    for (let i = 0; i < bytes.length; i++) {
      x ^= bytes[i]!
      x = Math.imul(x, 0x01000193)
    }
  }
  feed(h.correction.blockIds)
  feed(h.correction.data)
  feed(h.basin.blockIds)
  feed(h.basin.data)
  feed(h.chains.points)
  feed(h.chains.offsets)
  feed(h.chains.flags)
  feed(Float32Array.from(h.lakes.flatMap((l) => [l.level, l.cells, l.outletX, l.outletZ])))
  return (x >>> 0).toString(16).padStart(8, '0')
}
