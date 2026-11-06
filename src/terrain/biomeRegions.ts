import { createNoise2D, type NoiseFunction2D } from 'simplex-noise'
import { MathUtils } from 'three'
import type { RawSampleParams, RegionParams } from './chunkHeightmap'
import { createSeededRandom } from '../world/parseSeed'
import { latitude01, macroClimateOf, temperatureAt } from './macroClimate'

export type BiomeWeights = {
  desert: number
  swamp: number
  forest: number
}

/** Altitude fraction (of `heightScale` above `waterLevel`) above which desert
 *  fades out — deserts stay low/mid-elevation, highlands read as bare
 *  rock/snow via `applyMountainRock` regardless of moisture. */
const DESERT_HIGHLAND_START = 0.55
const DESERT_HIGHLAND_END = 0.7

/** Swamp is gated to low, near-`waterLevel` altitude — it's a lowland/coastal
 *  feature, not a wet hillside. */
const SWAMP_ALTITUDE_START = 0.12
const SWAMP_ALTITUDE_END = 0.22

/**
 * Classifies a land texel into soft desert/swamp/forest weights from the
 * macro `moistureRegion` axis (`chunkHeightmap.ts`) + altitude. Mirrors the
 * continentalness/mountainRidge pattern: independent noise axis, smoothstep
 * bands, no hard edges. `forest` is the default/remainder — visually
 * unchanged from today's humid/arid blend where `desert`/`swamp` are ~0.
 */
export function biomeWeightsAt(
  moistureRegion: number,
  altitude01: number,
  region: RegionParams,
): BiomeWeights {
  const highlandFade = 1 - MathUtils.smoothstep(altitude01, DESERT_HIGHLAND_START, DESERT_HIGHLAND_END)
  const desertRaw =
    (1 -
      MathUtils.smoothstep(
        moistureRegion,
        region.desertThreshold,
        region.desertThreshold + region.desertThresholdWidth,
      )) *
    highlandFade

  const lowlandFade = 1 - MathUtils.smoothstep(altitude01, SWAMP_ALTITUDE_START, SWAMP_ALTITUDE_END)
  const swampRaw =
    MathUtils.smoothstep(
      moistureRegion,
      region.swampThreshold - region.swampThresholdWidth,
      region.swampThreshold,
    ) * lowlandFade

  const desert = Math.min(1, Math.max(0, desertRaw))
  const swamp = Math.min(1, Math.max(0, swampRaw)) * (1 - desert)
  const forest = Math.max(0, 1 - desert - swamp)

  return { desert, swamp, forest }
}

/**
 * Climate-driven biome input (plan world-terrain-062 B1): annual-mean temperature (°C, elevation-adjusted), relative
 * precipitation 0..1, altitude fraction and the two seeded border offsets. `BiomeWeights` stays the consumer contract.
 */
export type BiomeClimateInput = {
  temperatureC: number
  precipitation: number
  altitude01: number
  /** Offset on the aridity index (irregular desert border). */
  borderA: number
  /** Offset on the wetness index (irregular swamp border). */
  borderS: number
}

/** Warm factor: 0 at/below `T_WARM_START` °C, 1 at/above `T_WARM_FULL` °C. 🟡 calibrated on previews. */
export const T_WARM_START = 6
export const T_WARM_FULL = 13
/** Aridity index `a` above which desert starts and its blend width. 🟡 calibrated on previews. */
export const ARID_START = 0.42
export const ARID_WIDTH = 0.10
/** Wetness index (precipitation + border) at which swamp is fully on, and its blend width. 🟡 calibrated. */
export const SWAMP_WET_FULL = 0.74
export const SWAMP_WET_WIDTH = 0.14

/**
 * Whittaker-style biome weights from climate (B1): desert needs warm *and* dry (the cold north cannot become desert),
 * swamp needs wet low ground, forest is the remainder. Pure, bounded, sums to 1.
 */
export function biomeWeightsFromClimate(input: BiomeClimateInput): BiomeWeights {
  const { temperatureC, precipitation, altitude01, borderA, borderS } = input
  const warm = MathUtils.smoothstep(temperatureC, T_WARM_START, T_WARM_FULL)
  const aridity = (1 - precipitation) * (0.4 + 0.6 * warm) + borderA
  const highlandFade = 1 - MathUtils.smoothstep(altitude01, DESERT_HIGHLAND_START, DESERT_HIGHLAND_END)
  const desert = clamp01(MathUtils.smoothstep(aridity, ARID_START, ARID_START + ARID_WIDTH) * highlandFade)

  const lowlandFade = 1 - MathUtils.smoothstep(altitude01, SWAMP_ALTITUDE_START, SWAMP_ALTITUDE_END)
  const swamp =
    clamp01(MathUtils.smoothstep(precipitation + borderS, SWAMP_WET_FULL - SWAMP_WET_WIDTH, SWAMP_WET_FULL) * lowlandFade) *
    (1 - desert)
  return { desert, swamp, forest: Math.max(0, 1 - desert - swamp) }
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Border noise (Q70 fold-in): two independent low-frequency seeded fields, ~600 m + ~150 m, amplitude ≤ BORDER_AMPLITUDE. */
const BORDER_AMPLITUDE = 0.08
const BORDER_COARSE_M = 600
const BORDER_FINE_M = 150
const borderNoiseCache = new Map<number, { a: NoiseFunction2D, s: NoiseFunction2D }>()
function borderNoiseFor(seed: number): { a: NoiseFunction2D, s: NoiseFunction2D } {
  let h = borderNoiseCache.get(seed)
  if (!h) {
    h = {
      a: createNoise2D(createSeededRandom(seed ^ 0x3c6ef372)),
      s: createNoise2D(createSeededRandom(seed ^ 0xa54ff53a)),
    }
    borderNoiseCache.set(seed, h)
  }
  return h
}

/** Border offsets at a world point — pure in (seed, x, z). */
export function biomeBorderAt(seed: number, x: number, z: number): { borderA: number, borderS: number } {
  const n = borderNoiseFor(seed)
  const f = (noise: NoiseFunction2D): number =>
    BORDER_AMPLITUDE * (0.65 * noise(x / BORDER_COARSE_M, z / BORDER_COARSE_M) + 0.35 * noise(x / BORDER_FINE_M, z / BORDER_FINE_M))
  return { borderA: f(n.a), borderS: f(n.s) }
}

/**
 * Biome weights at a world point — the one entry every consumer uses (map, far ring, terrain colour, vegetation,
 * settlements, audio). Worlds without `region.continentMask` keep the legacy moisture formula bit-identically.
 * `altitude01` is the caller's own altitude fraction (height above `waterLevel` / `heightScale`).
 */
export function biomeWeightsAtPoint(
  params: RawSampleParams,
  x: number,
  z: number,
  altitude01: number,
  moistureRegion: number,
): BiomeWeights {
  const climate = macroClimateOf(params)
  if (!climate) return biomeWeightsAt(moistureRegion, altitude01, params.region)
  const lat = latitude01(z)
  const precipitation = clamp01(0.12 + 0.62 * moistureRegion + 0.22 * climate.maritimeAt(x, z) - 0.1 * lat)
  const temperatureC = temperatureAt(z, params.waterLevel + altitude01 * params.heightScale, params.waterLevel)
  const { borderA, borderS } = biomeBorderAt(params.seed, x, z)
  return biomeWeightsFromClimate({ temperatureC, precipitation, altitude01, borderA, borderS })
}

/** Biome weights at (x, z, altitude01, moistureRegion) — what env/sampler records carry instead of full terrain params. */
export type BiomeWeightsSampler = (x: number, z: number, altitude01: number, moistureRegion: number) => BiomeWeights

/** Binds {@link biomeWeightsAtPoint} to one world's terrain params. */
export function biomeWeightsSamplerFor(params: RawSampleParams): BiomeWeightsSampler {
  return (x, z, altitude01, moistureRegion) => biomeWeightsAtPoint(params, x, z, altitude01, moistureRegion)
}

/** Forest density at a world point using {@link biomeWeightsAtPoint} (same weights as the caller's colour / placement). */
export function forestDensityAtPoint(
  params: RawSampleParams,
  x: number,
  z: number,
  moistureRegion: number,
  altitude01: number,
  continentalness: number,
  mountainRidge: number,
): number {
  if (altitude01 <= 0) return 0
  return forestDensityFrom(biomeWeightsAtPoint(params, x, z, altitude01, moistureRegion).forest, moistureRegion, altitude01, continentalness, mountainRidge, params.region)
}

/** Per-`TREE_SPECS`-index regional weight multipliers (062 B2 🟡): north = conifer/birch, south = oak-like/pine woodland. */
const TREE_REGION_NORTH: readonly number[] = [0.5, 0.5, 0.5, 2.0, 0.3, 1, 2.4, 2.4, 2.4, 1, 1, 1, 1]
const TREE_REGION_SOUTH: readonly number[] = [1.4, 1.4, 1.4, 0.4, 0.6, 1, 1.2, 1.2, 1.2, 1, 1, 1, 1]

/**
 * Regional multiplier for tree species `speciesIndex` at world `z` (1 = neutral, centre of the continent = mixed forest).
 * Multiplies the habitat weight in species picking only — growth keeps using `envGrowthFactor` alone.
 * Worlds without `region.continentMask` return 1.
 */
export function regionalTreeSpeciesWeight(params: RawSampleParams, z: number, speciesIndex: number): number {
  if (!params.region.continentMask) return 1
  const lat = latitude01(z)
  const north = 1 - MathUtils.smoothstep(lat, 0.15, 0.45)
  const south = MathUtils.smoothstep(lat, 0.55, 0.85)
  const n = TREE_REGION_NORTH[speciesIndex] ?? 1
  const so = TREE_REGION_SOUTH[speciesIndex] ?? 1
  return 1 + north * (n - 1) + south * (so - 1)
}

/** Moisture band where temperate land builds closed canopy (plan 063).
 *  Below → open / scattered trees; inside → dense forest; above → swamp gate
 *  via `biomeWeightsAt` already zeroes the forest remainder. */
const FOREST_CANOPY_START = 0.42
const FOREST_CANOPY_FULL = 0.54
const FOREST_CANOPY_END_START = 0.60
const FOREST_CANOPY_END = 0.72

/** Baseline canopy contribution on forest-capable land so open temperate
 *  terrain still supports isolated trees / weak habitat — never "no trees". */
const FOREST_OPEN_BASELINE = 0.10

/** Altitude suitability fade (fraction of heightScale above water). End
 *  raised (world-terrain-006, was 0.55) closer to the placement treeline
 *  (`chunkVegetation.ts`'s `TREELINE_ALTITUDE`, 0.66) — the old, tighter fade
 *  reached exactly 0 well below the hard treeline cutoff, leaving a band of
 *  upper-mountain slope where only `OPEN_TREE_BASELINE` scattered trees grew
 *  instead of a continuously thinning forest. Ridge-crest rejection
 *  (`FOREST_RIDGE_FADE_*` below, `MOUNTAIN_RIDGE_REJECT`) is unchanged — bare
 *  rock/snow ridges still stay bare regardless of this altitude band. */
const FOREST_ALTITUDE_FADE_START = 0.32
const FOREST_ALTITUDE_FADE_END = 0.62

/** Mountain-ridge suitability fade — placement still hard-rejects strong
 *  crests; this softens habitat/density approaching them. */
const FOREST_RIDGE_FADE_START = 0.08
const FOREST_RIDGE_FADE_END = 0.32

/**
 * Continuous forest density / habitat suitability in `[0, 1]`.
 *
 * `0` ≈ open / poor forest habitat · `1` ≈ strong dense-forest environment.
 *
 * Built on existing macro axes (`moistureRegion` → `biomeWeightsAt`,
 * continentalness, altitude, mountainRidge). This is a suitability mapping for
 * vegetation density and fauna habitat (plan 063) — not a second biome system
 * and not a transferred grid.
 *
 * Slope, roads and clearings stay as placement constraints in
 * `computeChunkVegetation` rather than being baked into every sample.
 *
 * `forestDensity = 0` does **not** mean trees are forbidden; callers should
 * retain a baseline chance for isolated trees outside strong forest regions.
 */
export function forestDensityAt(
  moistureRegion: number,
  altitude01: number,
  continentalness: number,
  mountainRidge: number,
  region: RegionParams,
): number {
  if (altitude01 <= 0) return 0
  return forestDensityFrom(biomeWeightsAt(moistureRegion, altitude01, region).forest, moistureRegion, altitude01, continentalness, mountainRidge, region)
}

function forestDensityFrom(
  forestBiome: number,
  moistureRegion: number,
  altitude01: number,
  continentalness: number,
  mountainRidge: number,
  region: RegionParams,
): number {
  if (altitude01 <= 0) return 0
  const land = MathUtils.smoothstep(continentalness, region.oceanThreshold, region.coastThreshold)
  if (land <= 0 || forestBiome <= 0) return 0

  // Peaked moisture curve inside temperate land: open low-moisture temperate
  // stays sparse, humid mid-band builds closed canopy, then swamp/desert
  // weights (via `forestBiome`) gate the extremes.
  const canopyCore =
    MathUtils.smoothstep(moistureRegion, FOREST_CANOPY_START, FOREST_CANOPY_FULL) *
    (1 - MathUtils.smoothstep(moistureRegion, FOREST_CANOPY_END_START, FOREST_CANOPY_END))

  const macroTendency = forestBiome * (FOREST_OPEN_BASELINE + (1 - FOREST_OPEN_BASELINE) * canopyCore)
  const altitudeSuit = 1 - MathUtils.smoothstep(altitude01, FOREST_ALTITUDE_FADE_START, FOREST_ALTITUDE_FADE_END)
  const ridgeSuit = 1 - MathUtils.smoothstep(mountainRidge, FOREST_RIDGE_FADE_START, FOREST_RIDGE_FADE_END)

  return MathUtils.clamp(macroTendency * land * altitudeSuit * ridgeSuit, 0, 1)
}

/** Explicit forest-density classification (plan 182) — a discrete label other
 *  systems (quests, fauna, environment tuning) can query without re-deriving
 *  thresholds from `forestDensityAt()` themselves. Purely a read of the
 *  existing continuous signal: no parallel noise field, no per-chunk state. */
export type ForestBiome = 'open' | 'forest' | 'deepForest'

/** Below this `forestDensityAt()` value, land reads as open/scattered trees. */
const FOREST_BIOME_OPEN_MAX = 0.35
/** At/above this value, land reads as Deep Forest — chosen from the value
 *  distribution around `forestDensityAt()`'s canopy-core plateau (moisture
 *  ≈0.53–0.58 at ideal lowland/no-ridge conditions reaches 1.0; ≈0.72 keeps
 *  the deepForest band narrower than the full `forest` band so it forms a
 *  core inside ordinary forest rather than swallowing it). */
const FOREST_BIOME_DEEP_MIN = 0.72

/**
 * Classifies a continuous `forestDensityAt()` reading into the discrete
 * `open`/`forest`/`deepForest` biome (plan 182). Deterministic and pure —
 * same `forestDensity` always yields the same label, independent of chunk
 * coordinates or load order, since it depends only on the world-position
 * value already produced by `forestDensityAt()`.
 */
export function forestBiomeAt(forestDensity: number): ForestBiome {
  const fd = MathUtils.clamp(forestDensity, 0, 1)
  if (fd >= FOREST_BIOME_DEEP_MIN) return 'deepForest'
  if (fd >= FOREST_BIOME_OPEN_MAX) return 'forest'
  return 'open'
}
