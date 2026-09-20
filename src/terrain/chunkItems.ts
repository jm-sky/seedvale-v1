import type { ItemKind } from '../items/items'
import type { ChunkCoord } from './chunkGrid'
import type { VegetationPlacement } from './chunkVegetation'
import { createSeededRandom } from '../world/parseSeed'
import { PINE_SPECIES_INDICES } from '../world/treeLifecycle'
import { biomeWeightsAt } from './biomeRegions'
import {
  apronOriginWorld,
  type ChunkTileData,
  type ChunkTileParams,
  sampleApronGrid,
} from './chunkHeightmap'
import { isShellSpawnShore, SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER } from './coastalResources'

export type ItemPlacement = {
  /** Stable, deterministic (`cx:cz:localIndex`) — not random. Lets the save file
   *  track *only* collected ids instead of full item state; see `chunkManager.ts`. */
  id: string
  x: number
  z: number
  kind: ItemKind
}

const CANDIDATES_PER_CHUNK = 3
const SLOPE_SAMPLE_STEP = 1.5
/** Reuses `chunkVegetation.ts`'s slope-reject threshold — no cliffside pickups. */
const SLOPE_REJECT = 0.9
/** Ridge strength above which a candidate counts as "in the mountains" for stone
 *  placement — lower than the terrain-shaping `mountainThreshold` so foothills
 *  qualify too, not just bare ridge crests. */
const MOUNTAIN_ITEM_MIN_RIDGE = 0.35
/** Fraction of otherwise-eligible candidates kept — these are meant to be rare
 *  finds, not litter. */
const KEEP_CHANCE = 0.3

/**
 * Functional forage pools (plan world-terrain-049) — independent RNG salts and
 * id prefixes so categories do not compete for the same slots, and so new
 * pools never collide with shell/stone (`:i`) or coin (`c<i>`) collected ids.
 *
 * @domain world-terrain
 */
/** Forest-floor forage — legacy `f<i>` prefix and salt `0x5b2e1`. */
const FOREST_FLOOR_CANDIDATES_PER_CHUNK = 5
const FOREST_FLOOR_KEEP_SCALE = 0.5
/** Medicinal / poisonous herbs — `h<i>`. */
const MEDICINAL_CANDIDATES_PER_CHUNK = 3
const MEDICINAL_KEEP_SCALE = 0.5
/** Open meadow flora — `o<i>`. */
const OPEN_FLORA_CANDIDATES_PER_CHUNK = 2
const OPEN_FLORA_KEEP_SCALE = 0.5
/** Rare heavy deadwood — `w<i>`, near-tree only. */
const RARE_WOOD_CANDIDATES_PER_CHUNK = 1
const RARE_WOOD_KEEP_SCALE = 0.5

/** Radius (world units) within which a `tree` vegetation placement in the
 *  same chunk counts as "nearby" for branch/cone preference. Same-chunk only
 *  — same approximation `chunkVegetation.ts`/this module already make for
 *  every other terrain feature (no cross-chunk lookups). */
const FLORA_TREE_PROXIMITY = 7

/** Coin pool (issue 035) — rare lost coins. Own RNG salt and `c<i>` ids. */
const COIN_CANDIDATES_PER_CHUNK = 1
const COIN_KEEP_CHANCE = 0.06

function nearTree(vegetation: readonly VegetationPlacement[], x: number, z: number): boolean {
  for (const v of vegetation) {
    if (v.kind === 'tree' && Math.hypot(v.x - x, v.z - z) <= FLORA_TREE_PROXIMITY) return true
  }
  return false
}

/** Small mushroom-weight bonus near a pine (plan 140) — reuses the same
 *  chunk-local `vegetation` array `nearTree` already checks, no extra pass. */
function nearPine(vegetation: readonly VegetationPlacement[], x: number, z: number): boolean {
  for (const v of vegetation) {
    if (
      v.kind === 'tree' &&
      PINE_SPECIES_INDICES.includes(v.speciesIndex) &&
      Math.hypot(v.x - x, v.z - z) <= FLORA_TREE_PROXIMITY
    ) {
      return true
    }
  }
  return false
}

function hashChunk(cx: number, cz: number): number {
  let h = (cx * 668265263 + cz * 374761393) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  return (h ^ (h >>> 16)) >>> 0
}

type SampleFn = (grid: Float32Array, x: number, z: number) => number

/** Shared water + slope gate for forage pools. Returns null when rejected. */
function sampleForageCandidate(
  random: () => number,
  coord: ChunkCoord,
  half: number,
  chunkSize: number,
  waterLevel: number,
  sample: SampleFn,
  heights: Float32Array,
): { wx: number, wz: number, h: number } | null {
  const localX = (random() * 2 - 1) * half
  const localZ = (random() * 2 - 1) * half
  const wx = coord.cx * chunkSize + localX
  const wz = coord.cz * chunkSize + localZ

  const h = sample(heights, wx, wz)
  if (h <= waterLevel + 0.3) return null

  const d = SLOPE_SAMPLE_STEP
  const slope =
    (Math.abs(sample(heights, wx + d, wz) - sample(heights, wx - d, wz)) +
      Math.abs(sample(heights, wx, wz + d) - sample(heights, wx, wz - d))) /
    (2 * d)
  if (slope > SLOPE_REJECT) return null

  return { wx, wz, h }
}

/**
 * Deterministic, worker-safe per-chunk item placement — mirrors
 * `chunkVegetation.ts` (pure data, instantiated into meshes on the main thread
 * by `chunkManager.ts`). Independent pools:
 * - shell/stone — `cx:cz:{i}`, salt `0x17e51`
 * - forest-floor forage — `f{i}`, salt `0x5b2e1` (mushroom/branch/cone/berries/nuts)
 * - medicinal — `h{i}` (mint/yarrow/herb/poisonous_herb; plan world-terrain-049)
 * - open flora — `o{i}` (flower/flax)
 * - rare wood — `w{i}` (beam, near-tree only)
 * - coins — `c{i}`, salt `0x9c31a`
 *
 * Finite kinds are filtered by `collectedItemIds`; medicinal mint/yarrow/herb
 * use the renewable overlay (`terrain/renewableWorldItems.ts`). `vegetation` is
 * this chunk's own `computeChunkVegetation` result, used only for tree proximity.
 *
 * @domain world-terrain
 */
export function computeChunkItems(
  coord: ChunkCoord,
  tile: ChunkTileData,
  params: ChunkTileParams,
  vegetation: readonly VegetationPlacement[],
): ItemPlacement[] {
  if (params.isHomeChunk) return []

  const { chunkSize, waterLevel, heightScale, region } = params
  const o = apronOriginWorld(coord.cx, coord.cz, chunkSize, params.resolution)
  const random = createSeededRandom(params.seed ^ hashChunk(coord.cx, coord.cz) ^ 0x17e51)

  const sample = (grid: Float32Array, x: number, z: number) =>
    sampleApronGrid(grid, o.apronRes, o.x, o.z, o.step, x, z)

  const placements: ItemPlacement[] = []
  const half = chunkSize / 2
  const chunkHash = hashChunk(coord.cx, coord.cz)

  for (let i = 0; i < CANDIDATES_PER_CHUNK; i++) {
    const localX = (random() * 2 - 1) * half
    const localZ = (random() * 2 - 1) * half
    const wx = coord.cx * chunkSize + localX
    const wz = coord.cz * chunkSize + localZ

    const h = sample(tile.heights, wx, wz)
    if (h <= waterLevel + SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER) continue // underwater/shoreline

    const d = SLOPE_SAMPLE_STEP
    const slope =
      (Math.abs(sample(tile.heights, wx + d, wz) - sample(tile.heights, wx - d, wz)) +
        Math.abs(sample(tile.heights, wx, wz + d) - sample(tile.heights, wx, wz - d))) /
      (2 * d)
    if (slope > SLOPE_REJECT) continue // cliff/steep face

    const continentalness = sample(tile.continentalness, wx, wz)
    const ridge = sample(tile.mountainRidge, wx, wz)

    let kind: ItemKind | null = null
    if (isShellSpawnShore(h, waterLevel, continentalness, params.region)) {
      kind = 'shell'
    } else if (ridge >= MOUNTAIN_ITEM_MIN_RIDGE) {
      kind = 'stone'
    }
    if (!kind) continue
    if (random() > KEEP_CHANCE) continue

    placements.push({ id: `${coord.cx}:${coord.cz}:${i}`, x: wx, z: wz, kind })
  }

  // Forest-floor forage (legacy f-prefix / salt) — plan world-terrain-049.
  const forestRandom = createSeededRandom(params.seed ^ chunkHash ^ 0x5b2e1)
  for (let i = 0; i < FOREST_FLOOR_CANDIDATES_PER_CHUNK; i++) {
    const pos = sampleForageCandidate(
      forestRandom,
      coord,
      half,
      chunkSize,
      waterLevel,
      sample,
      tile.heights,
    )
    if (!pos) continue

    const altitude = (pos.h - waterLevel) / Math.max(heightScale, 0.001)
    const moistureRegion = sample(tile.moistureRegion, pos.wx, pos.wz)
    const biome = biomeWeightsAt(moistureRegion, altitude, region)
    const treeClose = nearTree(vegetation, pos.wx, pos.wz)
    const pineClose = nearPine(vegetation, pos.wx, pos.wz)

    const mushroomWeight =
      (biome.swamp * 0.7 + biome.forest * 0.35 + moistureRegion * 0.15) *
      (treeClose ? 1.3 : 0.8) *
      (pineClose ? 1.15 : 1)
    const branchWeight = treeClose ? 0.9 : biome.forest * 0.25
    const coneWeight = treeClose ? biome.forest * 0.85 : 0
    const berriesWeight = (biome.forest * 0.6 + biome.swamp * 0.45) * (treeClose ? 1.15 : 0.7)
    const nutsWeight = biome.forest * 0.3 * (treeClose ? 1.2 : 0.5) * (pineClose ? 1.1 : 1)

    const total = mushroomWeight + branchWeight + coneWeight + berriesWeight + nutsWeight
    if (total <= 0) continue
    if (forestRandom() > Math.min(1, total) * FOREST_FLOOR_KEEP_SCALE) continue

    const roll = forestRandom() * total
    let kind: ItemKind
    let threshold = mushroomWeight
    if (roll < threshold) kind = 'mushroom'
    else if (roll < (threshold += branchWeight)) kind = 'branch'
    else if (roll < (threshold += coneWeight)) kind = 'cone'
    else if (roll < (threshold += berriesWeight)) kind = 'berries'
    // eslint-disable-next-line no-useless-assignment
    else if (roll < (threshold += nutsWeight)) kind = 'nuts'
    else kind = 'nuts'

    placements.push({ id: `${coord.cx}:${coord.cz}:f${i}`, x: pos.wx, z: pos.wz, kind })
  }

  // Medicinal / poisonous herbs — dedicated budget so mint does not compete
  // with branch/nuts/berries (plan world-terrain-049).
  const medicinalRandom = createSeededRandom(params.seed ^ chunkHash ^ 0x7a41c)
  for (let i = 0; i < MEDICINAL_CANDIDATES_PER_CHUNK; i++) {
    const pos = sampleForageCandidate(
      medicinalRandom,
      coord,
      half,
      chunkSize,
      waterLevel,
      sample,
      tile.heights,
    )
    if (!pos) continue

    const altitude = (pos.h - waterLevel) / Math.max(heightScale, 0.001)
    const moistureRegion = sample(tile.moistureRegion, pos.wx, pos.wz)
    const biome = biomeWeightsAt(moistureRegion, altitude, region)
    const ridge = sample(tile.mountainRidge, pos.wx, pos.wz)
    const treeClose = nearTree(vegetation, pos.wx, pos.wz)

    const mintWeight =
      (moistureRegion * 0.5 + biome.swamp * 0.28 + biome.forest * 0.18) *
      (1 - biome.desert) *
      (altitude < 0.5 ? 1 : 0.35) *
      (treeClose ? 0.85 : 1.05)
    const yarrowWeight =
      (1 - biome.desert) * (1 - biome.swamp) * (1 - ridge) * (altitude < 0.5 ? 1 : 0.3) * 0.55
    const herbWeight =
      (biome.forest * 0.16 + biome.swamp * 0.06 + moistureRegion * 0.04) *
      (treeClose ? 1.15 : 0.5)
    const poisonousHerbWeight = (biome.swamp * 0.35 + biome.forest * 0.12) * (treeClose ? 1 : 0.75)

    const total = mintWeight + yarrowWeight + herbWeight + poisonousHerbWeight
    if (total <= 0) continue
    if (medicinalRandom() > Math.min(1, total) * MEDICINAL_KEEP_SCALE) continue

    const roll = medicinalRandom() * total
    let kind: ItemKind
    let threshold = mintWeight
    if (roll < threshold) kind = 'mint'
    else if (roll < (threshold += yarrowWeight)) kind = 'yarrow'
    else if (roll < (threshold += herbWeight)) kind = 'herb'
    // eslint-disable-next-line no-useless-assignment
    else if (roll < (threshold += poisonousHerbWeight)) kind = 'poisonous_herb'
    else kind = 'poisonous_herb'

    placements.push({ id: `${coord.cx}:${coord.cz}:h${i}`, x: pos.wx, z: pos.wz, kind })
  }

  // Open meadow flora — flower / flax (plan world-terrain-049).
  const openRandom = createSeededRandom(params.seed ^ chunkHash ^ 0x3e9b2)
  for (let i = 0; i < OPEN_FLORA_CANDIDATES_PER_CHUNK; i++) {
    const pos = sampleForageCandidate(
      openRandom,
      coord,
      half,
      chunkSize,
      waterLevel,
      sample,
      tile.heights,
    )
    if (!pos) continue

    const altitude = (pos.h - waterLevel) / Math.max(heightScale, 0.001)
    const moistureRegion = sample(tile.moistureRegion, pos.wx, pos.wz)
    const biome = biomeWeightsAt(moistureRegion, altitude, region)
    const ridge = sample(tile.mountainRidge, pos.wx, pos.wz)
    const treeClose = nearTree(vegetation, pos.wx, pos.wz)

    const flowerWeight =
      (1 - biome.desert) * (1 - biome.swamp) * (1 - ridge) * (altitude < 0.45 ? 1 : 0.3)
    const flaxWeight = (biome.forest * 0.22 + (1 - biome.desert) * 0.12) * (treeClose ? 0.65 : 1)

    const total = flowerWeight + flaxWeight
    if (total <= 0) continue
    if (openRandom() > Math.min(1, total) * OPEN_FLORA_KEEP_SCALE) continue

    const roll = openRandom() * total
    const kind: ItemKind = roll < flowerWeight ? 'flower' : 'flax'

    placements.push({ id: `${coord.cx}:${coord.cz}:o${i}`, x: pos.wx, z: pos.wz, kind })
  }

  // Rare heavy deadwood — beam near trees only (plan world-terrain-049).
  const rareRandom = createSeededRandom(params.seed ^ chunkHash ^ 0x1d80f)
  for (let i = 0; i < RARE_WOOD_CANDIDATES_PER_CHUNK; i++) {
    const pos = sampleForageCandidate(
      rareRandom,
      coord,
      half,
      chunkSize,
      waterLevel,
      sample,
      tile.heights,
    )
    if (!pos) continue

    const treeClose = nearTree(vegetation, pos.wx, pos.wz)
    const beamWeight = treeClose ? 0.18 : 0
    if (beamWeight <= 0) continue
    if (rareRandom() > Math.min(1, beamWeight) * RARE_WOOD_KEEP_SCALE) continue

    placements.push({ id: `${coord.cx}:${coord.cz}:w${i}`, x: pos.wx, z: pos.wz, kind: 'beam' })
  }

  const coinRandom = createSeededRandom(params.seed ^ chunkHash ^ 0x9c31a)
  for (let i = 0; i < COIN_CANDIDATES_PER_CHUNK; i++) {
    const localX = (coinRandom() * 2 - 1) * half
    const localZ = (coinRandom() * 2 - 1) * half
    const wx = coord.cx * chunkSize + localX
    const wz = coord.cz * chunkSize + localZ

    const h = sample(tile.heights, wx, wz)
    if (h <= waterLevel + 0.5) continue

    const d = SLOPE_SAMPLE_STEP
    const slope =
      (Math.abs(sample(tile.heights, wx + d, wz) - sample(tile.heights, wx - d, wz)) +
        Math.abs(sample(tile.heights, wx, wz + d) - sample(tile.heights, wx, wz - d))) /
      (2 * d)
    if (slope > SLOPE_REJECT) continue
    if (coinRandom() > COIN_KEEP_CHANCE) continue

    placements.push({ id: `${coord.cx}:${coord.cz}:c${i}`, x: wx, z: wz, kind: 'coin' })
  }

  return placements
}
