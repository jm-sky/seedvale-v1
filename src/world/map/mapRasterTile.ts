import type { MapTexelClass } from './mapProjection'
import { type RawSampleParams, sampleRawTexelAt } from '../../terrain/chunkHeightmap'
import {
  computeRiverTile,
  overlappingRiverTiles,
  RIVER_TILE_SIZE,
  type RiverChain,
  riverTileKey,
  widthFromAccumulation,
} from '../../terrain/riverNetwork'
import { MAP_EXTENT_HALF } from './mapConfig'
import { classifyMapTexel } from './mapProjection'

/** Samples along one tile edge (core, without apron). */
export const MAP_TILE_SAMPLES = 64
/** One extra sample on every side so hillshade/filtering are seamless. */
export const MAP_TILE_SIDE = MAP_TILE_SAMPLES + 2

/** World units per raster sample, finest → coarsest. */
export type MapRasterStep = 1 | 2 | 4 | 8 | 16
export const MAP_RASTER_STEPS: readonly MapRasterStep[] = [1, 2, 4, 8, 16]

/** Coverage granularity for generation gating — equal to (and aligned with)
 *  the river tile grid, so "block discovered" also means "river tile needed". */
export const MAP_COVERAGE_BLOCK = RIVER_TILE_SIZE

/** Colour class per raster sample. `None` = not sampled (outside coverage). */
export const MapRasterClass = {
  None: 0,
  Ocean: 1,
  InlandWater: 2,
  Shore: 3,
  Mountain: 4,
  Meadow: 5,
  Forest: 6,
  Desert: 7,
  Swamp: 8,
} as const
export type MapRasterClassCode = (typeof MapRasterClass)[keyof typeof MapRasterClass]

export type MapTileCoord = { step: MapRasterStep, tx: number, tz: number }

/** River visibility: `standard` drops hairline streams per LOD (gameplay map);
 *  `all` keeps every canonical chain segment (author diagnostics only). */
export type MapRiverDetail = 'standard' | 'all'

export type MapTileRequest = MapTileCoord & {
  params: RawSampleParams
  /** Discovered coverage blocks (`[bx, bz]`) overlapping this tile. */
  coverage: readonly (readonly [number, number])[]
  /** Opt-in river visibility; omitted = `standard` (unchanged gameplay behaviour). */
  riverDetail?: MapRiverDetail
}

export type MapTileData = {
  /** Surface height (water surface over wet floor), `MAP_TILE_SIDE²`, row-major z-then-x. */
  heights: Float32Array
  /** Terrain floor height — water depth = surface − floor. */
  floors: Float32Array
  classes: Uint8Array
  /** River polylines: `(x, z, width)` triples, split into runs by `riverRuns` (point counts). */
  riverPoints: Float32Array
  riverRuns: Uint32Array
  elapsedMs: number
} & MapTileCoord

export function mapTileWorldSize(step: MapRasterStep): number {
  return MAP_TILE_SAMPLES * step
}

export function mapTileKey({ step, tx, tz }: MapTileCoord): string {
  return `${step}:${tx},${tz}`
}

export type MapRect = { minX: number, maxX: number, minZ: number, maxZ: number }

export function mapTileBounds({ step, tx, tz }: MapTileCoord): MapRect {
  const size = mapTileWorldSize(step)
  return { minX: tx * size, maxX: (tx + 1) * size, minZ: tz * size, maxZ: (tz + 1) * size }
}

/** Tiles of `step` overlapping `rect`, clamped to the map extent. */
export function mapTilesInRect(step: MapRasterStep, rect: MapRect): MapTileCoord[] {
  const size = mapTileWorldSize(step)
  const minX = Math.max(rect.minX, -MAP_EXTENT_HALF)
  const maxX = Math.min(rect.maxX, MAP_EXTENT_HALF)
  const minZ = Math.max(rect.minZ, -MAP_EXTENT_HALF)
  const maxZ = Math.min(rect.maxZ, MAP_EXTENT_HALF)
  if (minX >= maxX || minZ >= maxZ) return []
  const tiles: MapTileCoord[] = []
  const tzMax = Math.floor((maxZ - 1e-6) / size)
  const txMax = Math.floor((maxX - 1e-6) / size)
  for (let tz = Math.floor(minZ / size); tz <= tzMax; tz++) {
    for (let tx = Math.floor(minX / size); tx <= txMax; tx++) tiles.push({ step, tx, tz })
  }
  return tiles
}

/** Coarsest step that still gives at least `minDevicePxPerSample` device px
 *  per sample at `devicePxPerUnit`, never finer than `minStep`. */
export function selectMapRasterStep(
  devicePxPerUnit: number,
  minStep: MapRasterStep = 1,
  minDevicePxPerSample = 1.5,
): MapRasterStep {
  for (const step of MAP_RASTER_STEPS) {
    if (step < minStep) continue
    if (step * devicePxPerUnit >= minDevicePxPerSample) return step
  }
  return MAP_RASTER_STEPS[MAP_RASTER_STEPS.length - 1]!
}

export function mapRasterClassOf(texel: MapTexelClass): MapRasterClassCode {
  if (texel.water) return texel.terrain === 'ocean' ? MapRasterClass.Ocean : MapRasterClass.InlandWater
  if (texel.terrain === 'mountain') return MapRasterClass.Mountain
  if (texel.terrain === 'shore') return MapRasterClass.Shore
  switch (texel.biome) {
    case 'desert': return MapRasterClass.Desert
    case 'forest': return MapRasterClass.Forest
    case 'swamp': return MapRasterClass.Swamp
    default: return MapRasterClass.Meadow
  }
}

/** Rivers narrower than this fraction of a sample are dropped at that LOD —
 *  keeps coarse zoom levels from turning into a mesh of hairline streams. */
const RIVER_MIN_WIDTH_PER_STEP = 0.15

/** Bounded per-worker river tile cache — coarse map tiles revisit the same
 *  river tiles across LOD levels. Cleared when sample params change. */
const RIVER_CACHE_LIMIT = 128
const riverCache = new Map<string, RiverChain[]>()
let riverCacheFingerprint = ''

function riverChainsFor(tx: number, tz: number, params: RawSampleParams, fingerprint: string): RiverChain[] {
  if (fingerprint !== riverCacheFingerprint) {
    riverCache.clear()
    riverCacheFingerprint = fingerprint
  }
  const key = riverTileKey({ tx, tz })
  let chains = riverCache.get(key)
  if (!chains) {
    chains = computeRiverTile({ tx, tz }, params)
    riverCache.set(key, chains)
    if (riverCache.size > RIVER_CACHE_LIMIT) {
      const oldest = riverCache.keys().next()
      if (!oldest.done) riverCache.delete(oldest.value)
    }
  }
  return chains
}

function coverageKey(bx: number, bz: number): number {
  // Map extent is ±16 blocks; offset keeps the key a small non-negative int.
  return (bz + 1024) * 4096 + (bx + 1024)
}

/**
 * Builds one raster tile from the canonical raw terrain sampler and river
 * network. Pure and deterministic in `(params, coord, coverage)`; runs in the
 * chunk worker (`mapTile` job). Samples and rivers outside discovered coverage
 * are skipped so generation cost follows explored area (plan ui-input-046).
 *
 * @domain ui-input
 */
export function buildMapTile(request: MapTileRequest): MapTileData {
  const started = performance.now()
  const { step, tx, tz, params } = request
  const covered = new Set<number>()
  for (const [bx, bz] of request.coverage) covered.add(coverageKey(bx, bz))

  const isCovered = (x: number, z: number): boolean => {
    const bx0 = Math.floor((x - step) / MAP_COVERAGE_BLOCK)
    const bx1 = Math.floor((x + step) / MAP_COVERAGE_BLOCK)
    const bz0 = Math.floor((z - step) / MAP_COVERAGE_BLOCK)
    const bz1 = Math.floor((z + step) / MAP_COVERAGE_BLOCK)
    for (let bz = bz0; bz <= bz1; bz++) {
      for (let bx = bx0; bx <= bx1; bx++) if (covered.has(coverageKey(bx, bz))) return true
    }
    return false
  }

  const side = MAP_TILE_SIDE
  const heights = new Float32Array(side * side)
  const floors = new Float32Array(side * side)
  const classes = new Uint8Array(side * side)
  const bounds = mapTileBounds(request)

  for (let j = 0; j < side; j++) {
    const z = bounds.minZ + (j - 0.5) * step
    for (let i = 0; i < side; i++) {
      const x = bounds.minX + (i - 0.5) * step
      if (!isCovered(x, z)) continue
      const texel = sampleRawTexelAt(x, z, params)
      const k = j * side + i
      heights[k] = texel.h
      floors[k] = texel.floorH
      classes[k] = mapRasterClassOf(classifyMapTexel(texel, params, x, z))
    }
  }

  const { points, runs } = buildTileRivers(request, bounds, covered)
  return {
    step,
    tx,
    tz,
    heights,
    floors,
    classes,
    riverPoints: points,
    riverRuns: runs,
    elapsedMs: performance.now() - started,
  }
}

function buildTileRivers(
  request: MapTileRequest,
  bounds: MapRect,
  covered: ReadonlySet<number>,
): { points: Float32Array, runs: Uint32Array } {
  const { step, params } = request
  const minWidth = request.riverDetail === 'all' ? 0 : step * RIVER_MIN_WIDTH_PER_STEP
  const fingerprint = JSON.stringify(params)
  const out: number[] = []
  const runs: number[] = []

  const inside = (x: number, z: number) =>
    x >= bounds.minX && x < bounds.maxX && z >= bounds.minZ && z < bounds.maxZ

  for (const tile of overlappingRiverTiles(bounds)) {
    if (!covered.has(coverageKey(tile.tx, tile.tz))) continue
    for (const chain of riverChainsFor(tile.tx, tile.tz, params, fingerprint)) {
      const pts = chain.points
      let runLength = 0
      let lastX = 0
      let lastZ = 0
      // Point skipped by decimation that must still end the run.
      let pending: (typeof pts)[number] | null = null
      const closeRun = () => {
        if (pending) {
          out.push(pending.x, pending.z, widthFromAccumulation(pending.accumulation))
          runLength++
          pending = null
        }
        if (runLength >= 2) runs.push(runLength)
        else if (runLength === 1) out.length -= 3
        runLength = 0
      }
      for (let p = 0; p + 1 < pts.length; p++) {
        const a = pts[p]!
        const b = pts[p + 1]!
        const width = widthFromAccumulation(Math.max(a.accumulation, b.accumulation))
        // Each segment belongs to exactly one map tile (its midpoint's), so
        // neighbouring tiles never draw it twice and never leave a gap.
        if (width < minWidth || !inside((a.x + b.x) / 2, (a.z + b.z) / 2)) {
          closeRun()
          continue
        }
        if (runLength === 0) {
          out.push(a.x, a.z, widthFromAccumulation(a.accumulation))
          runLength = 1
          lastX = a.x
          lastZ = a.z
        }
        // Decimate at coarse LODs: keep points at least one sample apart.
        if (Math.hypot(b.x - lastX, b.z - lastZ) >= step) {
          out.push(b.x, b.z, widthFromAccumulation(b.accumulation))
          runLength++
          lastX = b.x
          lastZ = b.z
          pending = null
        } else {
          pending = b
        }
      }
      closeRun()
    }
  }
  return { points: new Float32Array(out), runs: new Uint32Array(runs) }
}
