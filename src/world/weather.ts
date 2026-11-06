/** Plan 040 — deterministic seasons + weather, layered on the existing world
 *  clock (`dayNight.ts`). Season and weather are both **pure functions** of
 *  `elapsedDays` (weather also takes the world `seed`) — no runtime history
 *  to replay, so time-skip and save/load both just call these again instead
 *  of needing persisted weather state (plan §7/§19: "Generator powinien
 *  umożliwiać bezpośrednie wyznaczenie pogody dla dowolnego momentu świata"). */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'fog' | 'snow' | 'storm'

const SEASON_ORDER: readonly Season[] = ['spring', 'summer', 'autumn', 'winter']
const WEATHER_TYPES: readonly WeatherType[] = ['clear', 'cloudy', 'rain', 'fog', 'snow', 'storm']

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Wiosna',
  summer: 'Lato',
  autumn: 'Jesień',
  winter: 'Zima',
}

export const WEATHER_LABELS: Record<WeatherType, string> = {
  clear: 'Bezchmurnie',
  cloudy: 'Pochmurno',
  rain: 'Deszcz',
  fog: 'Mgła',
  snow: 'Śnieg',
  storm: 'Burza',
}

/** Canonical calendar (plan fauna-004): 12 world-days per season, 48-day year.
 *  Season is a pure function of `elapsedDays` — no separate season counter. */
export const DAYS_PER_SEASON = 12
export const DAYS_PER_YEAR = DAYS_PER_SEASON * 4

export function getSeason(elapsedDays: number): Season {
  const idx = Math.floor(elapsedDays / DAYS_PER_SEASON)
  return SEASON_ORDER[((idx % 4) + 4) % 4]
}

/** 0..1 progress through the current season. */
export function getSeasonProgress(elapsedDays: number): number {
  const idx = elapsedDays / DAYS_PER_SEASON
  return idx - Math.floor(idx)
}

/** Weighted odds per plan §8 ("wagi, a nie twarde reguły") — a weight of 0
 *  means "never in this season" (no snow in summer). */
const SEASON_WEATHER_WEIGHTS: Record<Season, Record<WeatherType, number>> = {
  spring: { clear: 3, cloudy: 4, rain: 3.5, fog: 3, snow: 0, storm: 0.9 },
  summer: { clear: 5.5, cloudy: 3, rain: 1.6, fog: 0.5, snow: 0, storm: 1.4 },
  autumn: { clear: 2, cloudy: 4, rain: 3.7, fog: 3, snow: 0.5, storm: 0.5 },
  winter: { clear: 2, cloudy: 3.5, rain: 0.4, fog: 1.5, snow: 4, storm: 0.1 },
}

/** Informational baseline °C per season (plan §9); weather nudges it further. */
const SEASON_BASE_TEMPERATURE: Record<Season, number> = {
  spring: 12,
  summer: 23,
  autumn: 9,
  winter: -3,
}

const WEATHER_TEMPERATURE_DELTA: Record<WeatherType, number> = {
  clear: 2,
  cloudy: -1,
  rain: -2,
  fog: -1,
  snow: -4,
  storm: -3,
}

/** Precipitation that wets the ground, fills gardens, and plays as rain.
 *  @domain world */
export function isRainWeather(type: WeatherType): type is 'rain' | 'storm' {
  return type === 'rain' || type === 'storm'
}

export function temperatureFor(season: Season, type: WeatherType): number {
  return SEASON_BASE_TEMPERATURE[season] + WEATHER_TEMPERATURE_DELTA[type]
}

/** Fixed-length weather "cycle" (in `elapsedDays`) — the bucket
 *  `computeWeather` hashes on, so any moment's weather can be derived
 *  directly (plan §7) instead of simulating/replaying intermediate
 *  transitions. ~3.6 real minutes at the default `dayLengthSec = 720`. */
export const WEATHER_CYCLE_DAYS = 0.3

/** Deterministic per-(seed, cycle, salt) hash → [0,1) — same Wang-style
 *  integer mix as `terrain/worleyNoise.ts`'s private `hash01`, reimplemented
 *  here rather than imported since that module's helper isn't exported and
 *  is conceptually terrain-noise-specific. No allocation, no RNG object. */
function hash01(a: number, b: number, salt: number): number {
  let h = (a * 374761393 + b * 668265263 + salt * 2246822519) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967296
}

function pickWeightedWeather(season: Season, roll01: number): WeatherType {
  const weights = SEASON_WEATHER_WEIGHTS[season]
  const total = WEATHER_TYPES.reduce((sum, type) => sum + weights[type], 0)
  let roll = roll01 * total
  for (const type of WEATHER_TYPES) {
    roll -= weights[type]
    if (roll <= 0) return type
  }
  return 'clear'
}

export type WeatherState = {
  type: WeatherType
  /** 0..1 — strength of the current weather (rain heaviness, fog thickness…). 0 for `clear`. */
  intensity: number
  /** Informational °C, season + weather derived. */
  temperature: number
  /** `elapsedDays` when this weather cycle began. */
  startedAt: number
  /** `elapsedDays` when this weather cycle ends and the next is due. */
  endsAt: number
}

/** Pure — same `(seed, elapsedDays, season)` always yields the same result,
 *  no matter how far `elapsedDays` jumped since the last call (time-skip,
 *  save/load restore). */
export function computeWeather(seed: number, elapsedDays: number, season: Season): WeatherState {
  const cycleIndex = Math.floor(elapsedDays / WEATHER_CYCLE_DAYS)
  const typeRoll = hash01(seed, cycleIndex, 0x9e3779b1)
  const intensityRoll = hash01(seed, cycleIndex, 0x517cc1b7)
  const type = pickWeightedWeather(season, typeRoll)
  return {
    type,
    intensity: type === 'clear' ? 0 : 0.4 + intensityRoll * 0.6,
    temperature: temperatureFor(season, type),
    startedAt: cycleIndex * WEATHER_CYCLE_DAYS,
    endsAt: (cycleIndex + 1) * WEATHER_CYCLE_DAYS,
  }
}

/** Precipitation phase of a weather cycle at one site. */
export type PrecipitationPhase = 'none' | 'rain' | 'snow'

/** `WeatherState` re-labelled for one site: `type` rain↔snow by local phase, `temperature` = local °C. */
export type LocalWeather = WeatherState & { offsetC: number; phase: PrecipitationPhase }

/** Minimum |offset| (°C) from the reference site before a global event changes phase. */
export const PHASE_GATE_C = 2
/** Local temperature (°C) at or below which re-labelled precipitation falls as snow. */
export const PHASE_T_C = 1

/**
 * Pure. Re-labels the phase of a global weather event for a site `offsetC` °C away from the
 * reference (world-terrain-062 W1). Reference-anchored: with offset 0 the result equals the
 * global weather. Storms stay `storm` (thunder is global) but carry the local phase.
 * @domain world
 */
export function localWeatherFrom(global: WeatherState, offsetC: number): LocalWeather {
  const temperature = global.temperature + offsetC
  let phase: PrecipitationPhase =
    global.type === 'snow' ? 'snow' : isRainWeather(global.type) ? 'rain' : 'none'
  let type = global.type
  if (phase === 'rain' && offsetC <= -PHASE_GATE_C && temperature <= PHASE_T_C) {
    phase = 'snow'
    if (type === 'rain') type = 'snow'
  } else if (global.type === 'snow' && offsetC >= PHASE_GATE_C && temperature > PHASE_T_C) {
    phase = 'rain'
    type = 'rain'
  }
  if (offsetC === 0 && type === global.type) return { ...global, offsetC, phase }
  return { ...global, type, temperature, offsetC, phase }
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Plan 133 — how long damp ground takes to read fully dry again once rain
 *  (or snowmelt) stops feeding it. */
export const WETNESS_DRY_WINDOW_DAYS = 0.75
/** How long into an active rain cycle wetness takes to reach its target. */
const WETNESS_RISE_DAYS = 0.08
/** How long continuous snowfall takes to reach full visual coverage.
 *  2026-10-26: shortened from 1.1 (~30% faster accumulate for debug/play feel). */
export const SNOW_ACCUMULATE_WINDOW_DAYS = 1.1 / 1.3
/** How long snow cover takes to fully melt at a comfortably-above-freezing
 *  temperature (scales down as temperature approaches 0°C; frozen = no melt). */
export const SNOW_MELT_WINDOW_DAYS = 2.2
/** Bounded lookback for `computeSurfaceWeather`'s cycle-by-cycle simulation —
 *  covers the slowest of the windows above with margin, so a save/load or a
 *  multi-day time-skip resolves in a fixed number of steps instead of
 *  replaying every weather cycle since world start (plan 040's "any moment
 *  re-derives directly" guarantee, extended to the surface visuals). */
const SURFACE_SIM_WINDOW_DAYS = SNOW_ACCUMULATE_WINDOW_DAYS + SNOW_MELT_WINDOW_DAYS + 0.3

export type SurfaceWeatherState = {
  /** 0..1 — how wet/dark the terrain surface reads (rain, plus residual
   *  snowmelt). Global/shared, not per-chunk — see `buildChunkGeometry.ts`. */
  wetness: number
  /** 0..1 — visual snow coverage. Global/shared, not per-chunk. */
  snowAmount: number
}

/** Weather inputs consumed by one surface-weather integration step. */
export type SurfaceWeatherStepInput = {
  type: WeatherType
  intensity: number
  temperature: number
}

/**
 * One integration step of the plan-133 wetness/snow presentation curves.
 * Shared by the pure lookback replay and by lil-gui `forced` live stepping
 * so debug weather uses the same accumulate/melt windows.
 * @domain world
 */
export function stepSurfaceWeather(
  state: SurfaceWeatherState,
  weather: SurfaceWeatherStepInput,
  stepDays: number,
): void {
  if (stepDays <= 0) return

  // Rain raises wetness toward an intensity-scaled target; anything else
  // (including snow — snow feeds wetness only through melt, below) lets it
  // decay back toward dry over the drying window.
  if (isRainWeather(weather.type)) {
    const target = clamp01(0.35 + weather.intensity * 0.65)
    state.wetness = Math.max(state.wetness, target * clamp01(stepDays / WETNESS_RISE_DAYS))
  } else {
    state.wetness = Math.max(0, state.wetness * (1 - stepDays / WETNESS_DRY_WINDOW_DAYS))
  }

  // Snow accumulates while it keeps snowing; otherwise it melts at a rate
  // gated by temperature (frozen = no melt), feeding the melted amount
  // back into wetness so `snow → melting → wet ground` reads as one curve
  // instead of snow just vanishing.
  if (weather.type === 'snow') {
    state.snowAmount = state.snowAmount + (1 - state.snowAmount) * clamp01(stepDays / SNOW_ACCUMULATE_WINDOW_DAYS)
  } else if (state.snowAmount > 0) {
    const meltRate = clamp01(weather.temperature / 6)
    const melted = state.snowAmount * meltRate * clamp01(stepDays / SNOW_MELT_WINDOW_DAYS)
    state.snowAmount = Math.max(0, state.snowAmount - melted)
    if (melted > 0) state.wetness = clamp01(Math.max(state.wetness, melted * 0.6))
  }

  state.wetness = clamp01(state.wetness)
  state.snowAmount = clamp01(state.snowAmount)
}

/** Pure — same `(seed, elapsedDays)` always yields the same wetness/snow
 *  pair, independent of actual play history. Simulates forward one weather
 *  cycle at a time from a fixed-size lookback window (not from world start),
 *  so cost is O(`SURFACE_SIM_WINDOW_DAYS` / `WEATHER_CYCLE_DAYS`) regardless
 *  of how large `elapsedDays` is — cheap enough to call every frame, no
 *  per-chunk or per-particle state involved (plan 133). `wetness`/
 *  `snowAmount` are visual presentation only, not a soil/snow simulation. */
export function computeSurfaceWeather(seed: number, elapsedDays: number, offsetC = 0): SurfaceWeatherState {
  const currentCycle = Math.floor(elapsedDays / WEATHER_CYCLE_DAYS)
  const windowCycles = Math.ceil(SURFACE_SIM_WINDOW_DAYS / WEATHER_CYCLE_DAYS)
  const startCycle = Math.max(0, currentCycle - windowCycles)

  const state: SurfaceWeatherState = { wetness: 0, snowAmount: 0 }
  for (let cycle = startCycle; cycle <= currentCycle; cycle++) {
    const cycleStart = cycle * WEATHER_CYCLE_DAYS
    const cycleSeason = getSeason(cycleStart)
    const w = localWeatherFrom(computeWeather(seed, cycleStart, cycleSeason), offsetC)
    const stepDays =
      cycle === currentCycle
        ? clamp01((elapsedDays - cycleStart) / WEATHER_CYCLE_DAYS) * WEATHER_CYCLE_DAYS
        : WEATHER_CYCLE_DAYS
    stepSurfaceWeather(state, w, stepDays)
  }

  return state
}

/** Auto-mode LUT refresh step (world days ≈ a few real seconds): surface weather moves over hours, not frames. */
export const SURFACE_LUT_REFRESH_DAYS = 0.002

/**
 * Mutable presentation cache for the per-frame surface-weather LUT (world-terrain-062 W2).
 * Auto mode recomputes the pure LUT when `elapsedDays` moved by `SURFACE_LUT_REFRESH_DAYS` (or the
 * seed changed). With a lil-gui force, every knot integrates forward with `stepSurfaceWeather` using
 * the forced weather's local phase at that knot's offset (same rates as the pure lookback). Entering
 * forced seeds from the pure LUT; returning to `'auto'` resumes it. Debug-only — not persisted.
 * @domain world
 */
export type ForcedSurfaceWeatherRuntime = {
  lut: SurfaceWeatherLut
  /** `null` while following the pure `computeSurfaceWeatherLut`. */
  activeForced: WeatherType | null
  seed: number
  /** `elapsedDays` of the last pure computation (`NaN` = stale). */
  computedDays: number
}

export function createForcedSurfaceWeatherRuntime(): ForcedSurfaceWeatherRuntime {
  return { lut: createSurfaceWeatherLut(), activeForced: null, seed: Number.NaN, computedDays: Number.NaN }
}

/**
 * Resolves the presented surface-weather LUT for one frame (the returned object is the runtime's own
 * and is overwritten next call). Terrain/grass shaders read it at each point's climate offset.
 * @domain world
 */
export function resolveSurfaceWeatherForFrame(
  runtime: ForcedSurfaceWeatherRuntime,
  seed: number,
  elapsedDays: number,
  dayLengthSec: number,
  worldDtSec: number,
  forced: WeatherType | 'auto',
): SurfaceWeatherLut {
  if (forced === 'auto') {
    runtime.activeForced = null
    if (seed !== runtime.seed || !(Math.abs(elapsedDays - runtime.computedDays) < SURFACE_LUT_REFRESH_DAYS)) {
      computeSurfaceWeatherLut(seed, elapsedDays, runtime.lut)
      runtime.seed = seed
      runtime.computedDays = elapsedDays
    }
    return runtime.lut
  }

  if (runtime.activeForced === null) computeSurfaceWeatherLut(seed, elapsedDays, runtime.lut)
  runtime.activeForced = forced
  runtime.computedDays = Number.NaN

  const season = getSeason(elapsedDays)
  const global: WeatherState = {
    type: forced,
    intensity: forced === 'clear' ? 0 : 0.8,
    temperature: temperatureFor(season, forced),
    startedAt: elapsedDays,
    endsAt: elapsedDays,
  }
  const stepDays = worldDtSec / Math.max(30, dayLengthSec)
  const state: SurfaceWeatherState = { wetness: 0, snowAmount: 0 }
  for (let k = 0; k < SURFACE_LUT_KNOTS; k++) {
    state.wetness = runtime.lut.wetness[k]!
    state.snowAmount = runtime.lut.snow[k]!
    stepSurfaceWeather(state, localWeatherFrom(global, SURFACE_LUT_MIN_C + k), stepDays)
    runtime.lut.wetness[k] = state.wetness
    runtime.lut.snow[k] = state.snowAmount
  }
  return runtime.lut
}

/** Cumulative rain "intensity-days" between two `elapsedDays` timestamps —
 *  `world/bloodTraces.ts`'s weather-accelerated fading helper (plan
 *  world-009). Deliberately its own small function rather than reusing
 *  `computeSurfaceWeather`: that one replays a *fixed* bounded lookback
 *  window ending at "now" for a visual wetness/snow blend, whereas this
 *  needs the exact `[fromDays, toDays)` span of one blood trace's own life
 *  (already bounded to a few days by the trace's own lifetime, so no lookback
 *  window is needed — cost is just the number of weather cycles the span
 *  covers). Pure — same inputs always yield the same exposure, independent of
 *  when it's actually called (time-skip/save-load safe, same guarantee as
 *  `computeWeather` itself). */
export function computeRainExposureDays(seed: number, fromDays: number, toDays: number, offsetC = 0): number {
  if (toDays <= fromDays) return 0
  const startCycle = Math.floor(fromDays / WEATHER_CYCLE_DAYS)
  const endCycle = Math.floor(toDays / WEATHER_CYCLE_DAYS)
  let exposure = 0
  for (let cycle = startCycle; cycle <= endCycle; cycle++) {
    const cycleStart = cycle * WEATHER_CYCLE_DAYS
    const cycleEnd = cycleStart + WEATHER_CYCLE_DAYS
    const overlapDays = Math.min(cycleEnd, toDays) - Math.max(cycleStart, fromDays)
    if (overlapDays <= 0) continue
    const w = localWeatherFrom(computeWeather(seed, cycleStart, getSeason(cycleStart)), offsetC)
    if (isRainWeather(w.type)) exposure += overlapDays * w.intensity
  }
  return exposure
}

/** Cumulative snow "intensity-days" between two `elapsedDays` timestamps —
 *  the snow counterpart to `computeRainExposureDays`. Used by lazy tent /
 *  sleeping-utility condition (plan items-player-018), not by blood traces. */
export function computeSnowExposureDays(seed: number, fromDays: number, toDays: number, offsetC = 0): number {
  if (toDays <= fromDays) return 0
  const startCycle = Math.floor(fromDays / WEATHER_CYCLE_DAYS)
  const endCycle = Math.floor(toDays / WEATHER_CYCLE_DAYS)
  let exposure = 0
  for (let cycle = startCycle; cycle <= endCycle; cycle++) {
    const cycleStart = cycle * WEATHER_CYCLE_DAYS
    const cycleEnd = cycleStart + WEATHER_CYCLE_DAYS
    const overlapDays = Math.min(cycleEnd, toDays) - Math.max(cycleStart, fromDays)
    if (overlapDays <= 0) continue
    const w = localWeatherFrom(computeWeather(seed, cycleStart, getSeason(cycleStart)), offsetC)
    if (w.type === 'snow') exposure += overlapDays * w.intensity
  }
  return exposure
}

export type WorldClimateState = {
  season: Season
  seasonProgress: number
  weather: WeatherState
}

/** Pure — the single entry point other systems should read climate through
 *  (plan §5/§20), rather than knowing about `computeWeather`'s cycle-bucket
 *  implementation. */
export function computeClimate(seed: number, elapsedDays: number): WorldClimateState {
  const season = getSeason(elapsedDays)
  return { season, seasonProgress: getSeasonProgress(elapsedDays), weather: computeWeather(seed, elapsedDays, season) }
}

/** Local climate at a site `offsetC` °C from the reference (see `localWeatherFrom`). */
export function localClimateAt(
  climate: WorldClimateState,
  offsetC: number,
): { temperatureC: number; precipitationPhase: PrecipitationPhase; weather: LocalWeather } {
  const weather = localWeatherFrom(climate.weather, offsetC)
  return { temperatureC: weather.temperature, precipitationPhase: weather.phase, weather }
}

/** Offset knots (°C) of the surface-weather LUT used by position-dependent snow/wetness. */
export const SURFACE_LUT_MIN_C = -10
export const SURFACE_LUT_KNOTS = 16

export type SurfaceWeatherLut = { snow: Float32Array; wetness: Float32Array }

export function createSurfaceWeatherLut(): SurfaceWeatherLut {
  return { snow: new Float32Array(SURFACE_LUT_KNOTS), wetness: new Float32Array(SURFACE_LUT_KNOTS) }
}

/** Pure: `computeSurfaceWeather` at each knot (1 °C apart from `SURFACE_LUT_MIN_C`). */
export function computeSurfaceWeatherLut(
  seed: number,
  elapsedDays: number,
  out: SurfaceWeatherLut = createSurfaceWeatherLut(),
): SurfaceWeatherLut {
  for (let k = 0; k < SURFACE_LUT_KNOTS; k++) {
    const s = computeSurfaceWeather(seed, elapsedDays, SURFACE_LUT_MIN_C + k)
    out.snow[k] = s.snowAmount
    out.wetness[k] = s.wetness
  }
  return out
}

/** Linear interpolation between knots, clamped to the LUT range. */
export function surfaceWeatherAtOffset(lut: SurfaceWeatherLut, offsetC: number): SurfaceWeatherState {
  const f = Math.min(SURFACE_LUT_KNOTS - 1, Math.max(0, offsetC - SURFACE_LUT_MIN_C))
  const i = Math.min(SURFACE_LUT_KNOTS - 2, Math.floor(f))
  const t = f - i
  return {
    snowAmount: lut.snow[i]! * (1 - t) + lut.snow[i + 1]! * t,
    wetness: lut.wetness[i]! * (1 - t) + lut.wetness[i + 1]! * t,
  }
}

/** Mutable runtime cache around `computeClimate` — mirrors `dayNight.ts`'s
 *  "plain struct + pure tick fn" shape. Exists only so callers (gameLoop,
 *  debug GUI) have a stable object to read/`.listen()` on and so `weather`
 *  isn't recomputed from the hash every single frame (plan §17: "Climate
 *  state nie powinien być przeliczany co klatkę") — `tickClimate` only
 *  replaces it when `elapsedDays` crosses into a new weather cycle. Nothing
 *  here is persisted; `createClimateState`/`tickClimate` are always called
 *  with the live `(seed, elapsedDays)`, so save/load "restores" climate for
 *  free by re-deriving it (plan §19). */
export type ClimateState = {
  /** Debug-only override (lil-gui) — mirrors `DayNightState.enabled`-style
   *  fields; never persisted (plan §23: "Debug override nie powinien
   *  zmieniać deterministycznego modelu świata" — turning it back to
   *  `'auto'` simply resumes reading the deterministic function). */
  forced: WeatherType | 'auto'
  /** Internal bookkeeping — the `forced` value `tickClimate` last saw, so it
   *  can detect the auto→forced and forced→auto edges and recompute
   *  immediately instead of waiting for the next natural cycle boundary.
   *  Not meant to be read by callers. */
  lastForced: WeatherType | 'auto'
} & WorldClimateState

export function createClimateState(seed: number, elapsedDays: number): ClimateState {
  return { ...computeClimate(seed, elapsedDays), forced: 'auto', lastForced: 'auto' }
}

export function tickClimate(state: ClimateState, seed: number, elapsedDays: number): void {
  state.season = getSeason(elapsedDays)
  state.seasonProgress = getSeasonProgress(elapsedDays)
  const forcedChanged = state.forced !== state.lastForced
  state.lastForced = state.forced
  if (state.forced !== 'auto') {
    if (forcedChanged || state.weather.type !== state.forced) {
      state.weather = {
        type: state.forced,
        intensity: state.forced === 'clear' ? 0 : 0.8,
        temperature: temperatureFor(state.season, state.forced),
        startedAt: elapsedDays,
        endsAt: elapsedDays + WEATHER_CYCLE_DAYS,
      }
    } else if (state.weather.temperature !== temperatureFor(state.season, state.weather.type)) {
      state.weather = { ...state.weather, temperature: temperatureFor(state.season, state.weather.type) }
    }
    return
  }
  if (forcedChanged || elapsedDays < state.weather.startedAt || elapsedDays >= state.weather.endsAt) {
    state.weather = computeWeather(seed, elapsedDays, state.season)
  }
}
