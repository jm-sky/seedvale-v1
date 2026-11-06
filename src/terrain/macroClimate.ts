import { type RawSampleParams, type RegionParams, sampleRawTexelUncorrectedAt } from './chunkHeightmap'
import { WORLD_HALF_EXTENT } from './continentMask'

/**
 * Static macroclimate (plan world-terrain-061, slice C1) — a pure, seeded field of annual-mean temperature,
 * precipitation and maritime influence. Consumer (H1): the hydrology runoff weight (`runoffGrid`), which scales each
 * cell's contribution to flow accumulation.
 *
 * Acyclic by contract: reads only the unconditioned floor (no hydrology correction), its own coarse sea mask and
 * the moisture-region noise — never hydrology, biomes, settlements or weather. A built `MacroClimate` is immutable,
 * so queries are order-independent and a second build from the same params is identical (worker parity).
 *
 * Coefficients are 🟡 first guesses on V1 heights (peaks 60–80 m); C2 calibrates them on the frozen relief.
 *
 * @domain world-terrain
 */

/** Coast-distance grid cell (m). 64 m over ±6144 m = 192² cells ≈ 0.14 MB. */
export const MACRO_CLIMATE_CELL_M = 64
const GRID_N = (2 * WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M
/** Cells per side of the coarse climate grids. */
export const MACRO_CLIMATE_GRID_N = GRID_N

/** Annual-mean sea-level temperature (°C) at the north / south edge of the world (north = −Z). */
const T_NORTH_C = 3
const T_SOUTH_C = 17
/** Lapse rate on V1 relief (°C per metre above water level) — scaled so an 80 m summit is ≈ 7 °C colder. */
const LAPSE_C_PER_M = 0.09
/** e-folding distance (m) of the maritime influence away from the coast. */
const MARITIME_SCALE_M = 1200
const WORLD_SPAN_M = WORLD_HALF_EXTENT * 2

export type MacroClimateSample = {
  /** Annual-mean temperature, °C, elevation-adjusted. */
  temperature: number
  /** Relative precipitation 0..1. */
  precipitation: number
  /** Coastal influence 0..1 (1 at the coast). */
  maritime: number
}

/**
 * Runoff weight bounds and evaporation strength (061 H1, Opus 2026-11-06). Runoff = precipitation minus a
 * temperature-driven evaporation share: the cold north keeps nearly all of it, the warm south loses up to
 * `RUNOFF_EVAP_MAX` — so the south (already slightly drier) sheds fewer perennial streams. Normalised by
 * `RUNOFF_REF` so a typical land cell weighs ≈ 1 (mean over land ≈ 1 on seeds 42 / 415424794), which keeps
 * accumulation in "effective cells" comparable to the old uniform count and channel widths on average unchanged.
 */
const RUNOFF_EVAP_MAX = 0.5
const RUNOFF_T_COLD_C = 2
const RUNOFF_T_WARM_C = 16
const RUNOFF_REF = 0.42
const RUNOFF_MIN = 0.15
const RUNOFF_MAX = 2

/** Normalised runoff weight (≈ 1 on a typical land cell, `RUNOFF_MIN..RUNOFF_MAX`) from temperature and precipitation. */
export function runoffFrom(temperature: number, precipitation: number): number {
  const warm = clamp01((temperature - RUNOFF_T_COLD_C) / (RUNOFF_T_WARM_C - RUNOFF_T_COLD_C))
  const r = (precipitation * (1 - RUNOFF_EVAP_MAX * warm)) / RUNOFF_REF
  return r < RUNOFF_MIN ? RUNOFF_MIN : r > RUNOFF_MAX ? RUNOFF_MAX : r
}

export type MacroClimate = {
  /** Climate at a point; `floorH` = unconditioned floor height there (callers that sampled it already pass it in). */
  at: (x: number, z: number, floorH: number, moistureRegion: number) => MacroClimateSample
  /** Maritime term only (bilinear coast-distance grid) — no terrain evaluation. */
  maritimeAt: (x: number, z: number) => number
  /**
   * Precipitation from the coarse grid (bilinear over the 64 m cell centres; moisture noise sampled once per cell) —
   * no terrain evaluation. Smoother than `at(...).precipitation`, which uses the point's own moisture noise.
   */
  precipitationAt: (x: number, z: number) => number
  /** Coarse precipitation at the `MACRO_CLIMATE_CELL_M` cell centres, row-major (`MACRO_CLIMATE_GRID_N`²). Read-only. */
  readonly precipitationGrid: Float32Array
  /** Self-contained query: evaluates the unconditioned texel itself (one `sampleRawTexelUncorrectedAt`). */
  sampleAt: (x: number, z: number) => MacroClimateSample
  readonly seaMaskCells: number
  readonly gridBytes: number
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Bilinear over cell centres; outside the grid → `outside`, or the nearest edge cell when `outside` is omitted. */
function bilinear(grid: Float32Array, n: number, x: number, z: number, outside?: number): number {
  const gx = (x + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
  const gz = (z + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
  const i0 = Math.floor(gx), j0 = Math.floor(gz)
  const fx = gx - i0, fz = gz - j0
  const at = (i: number, j: number): number => {
    if (i >= 0 && j >= 0 && i < n && j < n) return grid[j * n + i]!
    if (outside !== undefined) return outside
    return grid[Math.min(n - 1, Math.max(0, j)) * n + Math.min(n - 1, Math.max(0, i))]!
  }
  const top = at(i0, j0) * (1 - fx) + at(i0 + 1, j0) * fx
  const bot = at(i0, j0 + 1) * (1 - fx) + at(i0 + 1, j0 + 1) * fx
  return top * (1 - fz) + bot * fz
}

/** 0 = north edge … 1 = south edge. */
export function latitude01(z: number): number {
  return clamp01((z + WORLD_HALF_EXTENT) / WORLD_SPAN_M)
}

/** Annual-mean, elevation-adjusted temperature (°C): latitude + lapse above `waterLevel`. */
export function temperatureAt(z: number, floorH: number, waterLevel: number): number {
  return T_NORTH_C + (T_SOUTH_C - T_NORTH_C) * latitude01(z) - LAPSE_C_PER_M * Math.max(0, floorH - waterLevel)
}

/** Reference site of the global weather timeline: continent centre (z = 0) at sea level. */
export function referenceTemperatureC(waterLevel: number): number {
  return temperatureAt(0, waterLevel, waterLevel)
}

/**
 * Local deviation (°C) from the global weather timeline's reference site (world-terrain-062 W1).
 * The lapse lives only inside `temperatureAt`; consumers add `climateOffsetC` to the global
 * temperature and never apply a second lapse. Pure in `(z, floorH)`.
 * @domain world
 */
export function climateOffsetC(z: number, floorH: number, waterLevel: number): number {
  return temperatureAt(z, floorH, waterLevel) - referenceTemperatureC(waterLevel)
}

/**
 * Closed-form parameters of `climateOffsetC` for shaders (world-terrain-062 W2):
 * `offset = a + b * clamp(z + WORLD_HALF_EXTENT, 0, span) - lapse * max(0, y - waterLevel)`.
 * Exact twin of `climateOffsetC`; worlds without a finite continent use `SURFACE_CLIMATE_OFF`.
 */
export type SurfaceClimateParams = { a: number; b: number; lapse: number; waterLevel: number }

export const SURFACE_CLIMATE_OFF: SurfaceClimateParams = { a: 0, b: 0, lapse: 0, waterLevel: 0 }

export function surfaceClimateParams(waterLevel: number): SurfaceClimateParams {
  return {
    a: T_NORTH_C - referenceTemperatureC(waterLevel),
    b: (T_SOUTH_C - T_NORTH_C) / WORLD_SPAN_M,
    lapse: LAPSE_C_PER_M,
    waterLevel,
  }
}

/** CPU twin of the GLSL `svClimateOffset`. */
export function climateOffsetFromParams(p: SurfaceClimateParams, z: number, y: number): number {
  const along = Math.min(WORLD_SPAN_M, Math.max(0, z + WORLD_HALF_EXTENT))
  return p.a + p.b * along - p.lapse * Math.max(0, y - p.waterLevel)
}

/** Pure climate formula from already-known terms (shared by the grid path and tests). */
export function macroClimateFrom(
  z: number,
  floorH: number,
  waterLevel: number,
  moistureRegion: number,
  maritime: number,
): MacroClimateSample {
  const lat = latitude01(z)
  const temperature = temperatureAt(z, floorH, waterLevel)
  // Regional noise dominates; coast wets it, the south dries it slightly.
  const precipitation = clamp01(0.12 + 0.62 * moistureRegion + 0.22 * maritime - 0.1 * lat)
  return { temperature, precipitation, maritime }
}

/** Two-pass chamfer distance (cells) from every cell to the nearest sea cell. */
function seaDistanceCells(sea: Uint8Array): Float32Array {
  const n = GRID_N
  const d = new Float32Array(n * n)
  const INF = 1e9
  const D1 = 1, D2 = Math.SQRT2
  for (let i = 0; i < n * n; i++) d[i] = sea[i] ? 0 : INF
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const k = y * n + x
    let v = d[k]!
    if (x > 0) v = Math.min(v, d[k - 1]! + D1)
    if (y > 0) {
      v = Math.min(v, d[k - n]! + D1)
      if (x > 0) v = Math.min(v, d[k - n - 1]! + D2)
      if (x < n - 1) v = Math.min(v, d[k - n + 1]! + D2)
    }
    d[k] = v
  }
  for (let y = n - 1; y >= 0; y--) for (let x = n - 1; x >= 0; x--) {
    const k = y * n + x
    let v = d[k]!
    if (x < n - 1) v = Math.min(v, d[k + 1]! + D1)
    if (y < n - 1) {
      v = Math.min(v, d[k + n]! + D1)
      if (x < n - 1) v = Math.min(v, d[k + n + 1]! + D2)
      if (x > 0) v = Math.min(v, d[k + n - 1]! + D2)
    }
    d[k] = v
  }
  return d
}

/**
 * Builds the climate for one world: samples the unconditioned floor once per coast-grid cell (192² evaluations),
 * derives a sea mask (floor below `waterLevel`), and a chamfer coast distance. Outside the world counts as sea.
 */
export function createMacroClimate(params: RawSampleParams): MacroClimate {
  const n = GRID_N
  const sea = new Uint8Array(n * n)
  const moisture = new Float32Array(n * n)
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const wx = -WORLD_HALF_EXTENT + (i + 0.5) * MACRO_CLIMATE_CELL_M
    const wz = -WORLD_HALF_EXTENT + (j + 0.5) * MACRO_CLIMATE_CELL_M
    const t = sampleRawTexelUncorrectedAt(wx, wz, params)
    sea[j * n + i] = t.floorH < params.waterLevel ? 1 : 0
    moisture[j * n + i] = t.moistureRegion
  }
  let seaCells = 0
  for (const v of sea) seaCells += v
  const maritimeGrid = seaDistanceCells(sea)
  for (let k = 0; k < maritimeGrid.length; k++) {
    maritimeGrid[k] = Math.exp(-(maritimeGrid[k]! * MACRO_CLIMATE_CELL_M) / MARITIME_SCALE_M)
  }
  const maritimeAt = (x: number, z: number): number => bilinear(maritimeGrid, n, x, z, 1)
  // Precipitation per cell centre (the floor height does not enter precipitation).
  const precipGrid = moisture
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = j * n + i
    const wz = -WORLD_HALF_EXTENT + (j + 0.5) * MACRO_CLIMATE_CELL_M
    precipGrid[k] = macroClimateFrom(wz, 0, 0, moisture[k]!, maritimeGrid[k]!).precipitation
  }
  const precipitationAt = (x: number, z: number): number => bilinear(precipGrid, n, x, z)
  const at: MacroClimate['at'] = (x, z, floorH, moistureRegion) =>
    macroClimateFrom(z, floorH, params.waterLevel, moistureRegion, maritimeAt(x, z))
  return {
    at,
    maritimeAt,
    precipitationAt,
    precipitationGrid: precipGrid,
    sampleAt: (x, z) => {
      const t = sampleRawTexelUncorrectedAt(x, z, params)
      return at(x, z, t.floorH, t.moistureRegion)
    },
    seaMaskCells: seaCells,
    gridBytes: maritimeGrid.byteLength + precipGrid.byteLength,
  }
}

/**
 * Per-cell runoff weights for a hydrology grid (061 H1): temperature from latitude + lapse on the grid's own floor
 * samples (no second terrain pass), precipitation from the coarse climate grid. Row-major like `floor`.
 */
export function runoffGrid(
  climate: Pick<MacroClimate, 'precipitationGrid'>,
  floor: Float32Array,
  grid: { size: number, cellStep: number, originX: number, originZ: number },
  waterLevel: number,
): Float32Array {
  const { size, cellStep, originX, originZ } = grid
  const pg = climate.precipitationGrid
  const n = GRID_N
  const out = new Float32Array(size * size)
  // Inlined edge-clamped bilinear (same result as `precipitationAt`): ~2.4 M cells per world.
  const ci = (i: number): number => (i < 0 ? 0 : i >= n ? n - 1 : i)
  for (let iz = 0; iz < size; iz++) {
    const z = originZ + iz * cellStep
    const gz = (z + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
    const j0 = Math.floor(gz)
    const fz = gz - j0
    const r0 = ci(j0) * n
    const r1 = ci(j0 + 1) * n
    for (let ix = 0; ix < size; ix++) {
      const k = iz * size + ix
      const gx = (originX + ix * cellStep + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
      const i0 = Math.floor(gx)
      const fx = gx - i0
      const a = ci(i0)
      const b = ci(i0 + 1)
      const top = pg[r0 + a]! * (1 - fx) + pg[r0 + b]! * fx
      const bot = pg[r1 + a]! * (1 - fx) + pg[r1 + b]! * fx
      out[k] = runoffFrom(temperatureAt(z, floor[k]!, waterLevel), top * (1 - fz) + bot * fz)
    }
  }
  return out
}

/** Per-realm climate memo (plan 062 B1): one build per `region` object + seed/scale/water key, shared by hydrology and biomes. */
const climateByRegion = new WeakMap<RegionParams, Map<string, MacroClimate>>()
/** Workers receive a structured clone of `region` per job (fresh object), so the first lookup per object falls back to content. */
const climateByContent = new Map<string, MacroClimate>()
let lastClimateBuildMs = 0

/** Duration (ms) of the most recent memo build on this thread — for cost / boot reports. */
export function lastMacroClimateBuildMs(): number {
  return lastClimateBuildMs
}

/**
 * Memoized {@link createMacroClimate}. `null` for worlds without `region.continentMask` (infinite / test worlds keep the
 * legacy moisture-only biome formula). Never stringifies per call — this sits on the per-sample biome path.
 */
export function macroClimateOf(params: RawSampleParams): MacroClimate | null {
  const region = params.region as RegionParams | undefined
  if (!region?.continentMask) return null
  const key = `${params.seed}|${params.heightScale}|${params.waterLevel}`
  let perRegion = climateByRegion.get(region)
  const hit = perRegion?.get(key)
  if (hit) return hit
  const contentKey = `${key}|${JSON.stringify(region)}`
  let built = climateByContent.get(contentKey)
  if (!built) {
    const t0 = performance.now()
    built = createMacroClimate(params)
    lastClimateBuildMs = performance.now() - t0
    climateByContent.set(contentKey, built)
  }
  if (!perRegion) {
    perRegion = new Map()
    climateByRegion.set(region, perRegion)
  }
  perRegion.set(key, built)
  return built
}

/** Site → local-climate offset (°C) lookup, built once per `WorldBundle`. */
export type ClimateOffsetAt = (x: number, z: number) => number

/**
 * Builds the per-world offset function (world-terrain-062 W1). Worlds without a finite continent
 * (tests, infinite worlds) get a constant 0, so every consumer behaves exactly as before.
 * `sampleHeight` supplies the ground height of the site; no player or camera position is involved.
 * @domain world
 */
export function createClimateOffsetAt(
  hasContinent: boolean,
  waterLevel: number,
  sampleHeight: (x: number, z: number) => number,
): ClimateOffsetAt {
  if (!hasContinent) return () => 0
  return (x, z) => climateOffsetC(z, sampleHeight(x, z), waterLevel)
}
