import type { RiverChain, RiverPoint } from './riverNetwork'
import type { PackedChains, SparseBlocks, WorldHydrology } from './worldHydrology'

/**
 * Leaf module of the global hydrology (plan world-terrain-058 H2/H3): the per-realm install map, the correction-layer
 * sampler read by `sampleRawTexel`, and the packed-chain unpacker. It imports only **types** from the hydrology
 * modules, so `chunkHeightmap.ts` can depend on it without an import cycle (`worldHydrology.ts` samples the raw floor
 * through `chunkHeightmap.ts`). Public API for callers is `worldHydrologyRegistry.ts`.
 *
 * @domain world-terrain
 * @subdomain hydrology
 */

export const SPARSE_BLOCK_SIZE = 64

/** Id of "no global hydrology": tests and tools that never install one. Terrain stays uncorrected, rivers per tile. */
export const UNCONDITIONED_HYDROLOGY_ID = 'unconditioned'

/** Prefix of ids produced under `?hydrology=legacy` (the pre-058 per-tile path, kept only for the A/B until P1). */
export const LEGACY_HYDROLOGY_PREFIX = 'legacy-'

/** True when `id` selects the uncorrected terrain + per-tile river path (no hydrology data exists or is needed). */
export function isUnconditionedHydrologyId(id: string): boolean {
  return id === UNCONDITIONED_HYDROLOGY_ID || id.startsWith(LEGACY_HYDROLOGY_PREFIX)
}

const installed = new Map<string, WorldHydrology>()

/** Installs `data` under `id` (replaces an earlier install of the same id). */
export function installWorldHydrology(id: string, data: WorldHydrology): void {
  installed.set(id, data)
}

export function hasWorldHydrology(id: string): boolean {
  return installed.has(id)
}

/** The installed hydrology for `id`; throws when none is installed (a silent fallback would poison caches). */
export function worldHydrologyFor(id: string): WorldHydrology {
  const data = installed.get(id)
  if (!data) throw new Error(`world hydrology "${id}" is not installed`)
  return data
}

/** Drops installed hydrology — all of it, or one id. World rebuilds and tests. */
export function clearWorldHydrology(id?: string): void {
  if (id === undefined) installed.clear()
  else installed.delete(id)
}

// ---- correction sampling -------------------------------------------------------------------------------------------

type CorrectionSampler = {
  originX: number
  originZ: number
  cellStep: number
  size: number
  data: Float32Array
  /** Block id → block index in `data`, or -1. Direct table (the grid has ~24² blocks), no binary search. */
  directory: Int32Array
  blocksPerRow: number
}

const samplers = new WeakMap<WorldHydrology, CorrectionSampler>()

type LakeSampler = {
  originX: number
  originZ: number
  cellStep: number
  size: number
  data: Uint16Array
  directory: Int32Array
  blocksPerRow: number
  /** Level (m) per 1-based lake id; index 0 unused. */
  levels: Float32Array
}

const lakeSamplers = new WeakMap<WorldHydrology, LakeSampler>()

function lakeSamplerFor(h: WorldHydrology): LakeSampler {
  let s = lakeSamplers.get(h)
  if (!s) {
    const { blocksPerRow, blockIds, data } = h.basin
    const directory = new Int32Array(blocksPerRow * blocksPerRow).fill(-1)
    blockIds.forEach((id, i) => {
      directory[id] = i
    })
    const levels = new Float32Array(h.lakes.length + 1)
    for (const lake of h.lakes) levels[lake.id] = lake.level
    s = { originX: h.originX, originZ: h.originZ, cellStep: h.cellStep, size: h.size, data, directory, blocksPerRow, levels }
    lakeSamplers.set(h, s)
  }
  return s
}

function samplerFor(h: WorldHydrology): CorrectionSampler {
  let s = samplers.get(h)
  if (!s) {
    const { blocksPerRow, blockIds, data } = h.correction
    const directory = new Int32Array(blocksPerRow * blocksPerRow).fill(-1)
    blockIds.forEach((id, i) => {
      directory[id] = i
    })
    s = { originX: h.originX, originZ: h.originZ, cellStep: h.cellStep, size: h.size, data, directory, blocksPerRow }
    samplers.set(h, s)
  }
  return s
}

function cellCorrection(s: CorrectionSampler, ix: number, iz: number): number {
  if (ix < 0 || iz < 0 || ix >= s.size || iz >= s.size) return 0
  const B = SPARSE_BLOCK_SIZE
  const block = s.directory[Math.floor(iz / B) * s.blocksPerRow + Math.floor(ix / B)]!
  if (block < 0) return 0
  return s.data[block * B * B + (iz % B) * B + (ix % B)]!
}

/**
 * Correction (breach cuts negative, filled pits positive) at a world point: bilinear between the four surrounding
 * hydrology cells, so it equals the stored value exactly at cell centres (where the hydrology was computed) and
 * 0 away from every correction block. Throws when `hydrologyId` has no installed data (and is not an unconditioned id).
 */
export function hydrologyCorrectionAt(hydrologyId: string, wx: number, wz: number): number {
  if (isUnconditionedHydrologyId(hydrologyId)) return 0
  const s = samplerFor(worldHydrologyFor(hydrologyId))
  const gx = (wx - s.originX) / s.cellStep
  const gz = (wz - s.originZ) / s.cellStep
  const ix = Math.floor(gx)
  const iz = Math.floor(gz)
  const fx = gx - ix
  const fz = gz - iz
  const c00 = cellCorrection(s, ix, iz)
  const c10 = cellCorrection(s, ix + 1, iz)
  const c01 = cellCorrection(s, ix, iz + 1)
  const c11 = cellCorrection(s, ix + 1, iz + 1)
  return (c00 * (1 - fx) + c10 * fx) * (1 - fz) + (c01 * (1 - fx) + c11 * fx) * fz
}

/**
 * Lake water-surface level (m) at a world point, or `-Infinity` when the point is outside every lake basin (plan
 * world-terrain-058 L1). The basin grid stores flooded cells dilated by one cell, so the nearest-node lookup covers the
 * whole wet area; whether the point is actually wet is decided by the caller (`floor < level`, the L1 rule), which also
 * trims the dilated rim. Unconditioned ids have no lakes. Throws when the id has no installed data.
 */
export function hydrologyLakeLevelAt(hydrologyId: string, wx: number, wz: number): number {
  if (isUnconditionedHydrologyId(hydrologyId)) return -Infinity
  const s = lakeSamplerFor(worldHydrologyFor(hydrologyId))
  const ix = Math.round((wx - s.originX) / s.cellStep)
  const iz = Math.round((wz - s.originZ) / s.cellStep)
  if (ix < 0 || iz < 0 || ix >= s.size || iz >= s.size) return -Infinity
  const B = SPARSE_BLOCK_SIZE
  const block = s.directory[Math.floor(iz / B) * s.blocksPerRow + Math.floor(ix / B)]!
  if (block < 0) return -Infinity
  const id = s.data[block * B * B + (iz % B) * B + (ix % B)]!
  return id === 0 ? -Infinity : s.levels[id]!
}

/** Lake-outlet flag in `PackedChains.flags` (bit 4). */
const LAKE_FED_FLAG = 16

export type StreamHead = { x: number, z: number }

const headsCache = new WeakMap<WorldHydrology, StreamHead[]>()

/**
 * Visible stream heads of a world's global chains (058 H4): the first point of every chain that does not start at a
 * lake outlet. Lake-fed heads are excluded — the lake is the source, there is no spring to protect. Empty for
 * unconditioned/legacy ids (no global chains). Throws when `hydrologyId` is not installed.
 */
export function streamHeadsFor(hydrologyId: string): readonly StreamHead[] {
  if (isUnconditionedHydrologyId(hydrologyId)) return []
  const data = worldHydrologyFor(hydrologyId)
  let heads = headsCache.get(data)
  if (!heads) {
    heads = []
    const { offsets, points, flags } = data.chains
    for (let i = 0; i + 1 < offsets.length; i++) {
      if (offsets[i + 1]! <= offsets[i]! || (flags[i]! & LAKE_FED_FLAG)) continue
      heads.push({ x: points[offsets[i]! * 4]!, z: points[offsets[i]! * 4 + 1]! })
    }
    headsCache.set(data, heads)
  }
  return heads
}

// ---- chains --------------------------------------------------------------------------------------------------------

/** Packed chains → `RiverChain[]` (the shape the existing consumers use). */
export function unpackChains(chains: PackedChains): RiverChain[] {
  const out: RiverChain[] = []
  for (let i = 0; i + 1 < chains.offsets.length; i++) {
    const pts: RiverPoint[] = []
    for (let p = chains.offsets[i]!; p < chains.offsets[i + 1]!; p++) {
      pts.push({
        x: chains.points[p * 4]!,
        z: chains.points[p * 4 + 1]!,
        elevation: chains.points[p * 4 + 2]!,
        accumulation: chains.points[p * 4 + 3]!,
      })
    }
    out.push({ points: pts })
  }
  return out
}

export type { SparseBlocks }
