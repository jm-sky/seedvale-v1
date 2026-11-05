import { type RawSampleParams, sampleRawTexelUncorrectedAt } from './chunkHeightmap'
import { WORLD_HALF_EXTENT } from './continentMask'

/**
 * Static macroclimate (plan world-terrain-061, slice C1) — a pure, seeded field of annual-mean temperature,
 * precipitation and maritime influence. **No consumers yet** (previews only until C2/H1).
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

export type MacroClimate = {
  /** Climate at a point; `floorH` = unconditioned floor height there (callers that sampled it already pass it in). */
  at: (x: number, z: number, floorH: number, moistureRegion: number) => MacroClimateSample
  /** Maritime term only (bilinear coast-distance grid) — no terrain evaluation. */
  maritimeAt: (x: number, z: number) => number
  /** Self-contained query: evaluates the unconditioned texel itself (one `sampleRawTexelUncorrectedAt`). */
  sampleAt: (x: number, z: number) => MacroClimateSample
  readonly seaMaskCells: number
  readonly gridBytes: number
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

/** 0 = north edge … 1 = south edge. */
export function latitude01(z: number): number {
  return clamp01((z + WORLD_HALF_EXTENT) / WORLD_SPAN_M)
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
  const sea = T_NORTH_C + (T_SOUTH_C - T_NORTH_C) * lat
  const temperature = sea - LAPSE_C_PER_M * Math.max(0, floorH - waterLevel)
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
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const wx = -WORLD_HALF_EXTENT + (i + 0.5) * MACRO_CLIMATE_CELL_M
    const wz = -WORLD_HALF_EXTENT + (j + 0.5) * MACRO_CLIMATE_CELL_M
    sea[j * n + i] = sampleRawTexelUncorrectedAt(wx, wz, params).floorH < params.waterLevel ? 1 : 0
  }
  let seaCells = 0
  for (const v of sea) seaCells += v
  const maritimeGrid = seaDistanceCells(sea)
  for (let k = 0; k < maritimeGrid.length; k++) {
    maritimeGrid[k] = Math.exp(-(maritimeGrid[k]! * MACRO_CLIMATE_CELL_M) / MARITIME_SCALE_M)
  }
  const maritimeAt = (x: number, z: number): number => {
    const gx = (x + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
    const gz = (z + WORLD_HALF_EXTENT) / MACRO_CLIMATE_CELL_M - 0.5
    const i0 = Math.floor(gx), j0 = Math.floor(gz)
    const fx = gx - i0, fz = gz - j0
    const at = (i: number, j: number): number =>
      i < 0 || j < 0 || i >= n || j >= n ? 1 : maritimeGrid[j * n + i]!
    const top = at(i0, j0) * (1 - fx) + at(i0 + 1, j0) * fx
    const bot = at(i0, j0 + 1) * (1 - fx) + at(i0 + 1, j0 + 1) * fx
    return top * (1 - fz) + bot * fz
  }
  const at: MacroClimate['at'] = (x, z, floorH, moistureRegion) =>
    macroClimateFrom(z, floorH, params.waterLevel, moistureRegion, maritimeAt(x, z))
  return {
    at,
    maritimeAt,
    sampleAt: (x, z) => {
      const t = sampleRawTexelUncorrectedAt(x, z, params)
      return at(x, z, t.floorH, t.moistureRegion)
    },
    seaMaskCells: seaCells,
    gridBytes: maritimeGrid.byteLength,
  }
}
