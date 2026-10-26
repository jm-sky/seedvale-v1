/**
 * World-anchored snow reveal field (plan world-terrain-053 / VIS-07): monotone
 * threshold coverage `smoothstep(n ± EDGE, s * GAIN + bias - ONSET)` so patches
 * appear, grow and merge as `snowAmount` rises and retreat as it melts. Adapted
 * from V3 `render/snowField.ts` for V1 presentation only — consumes existing
 * `computeSurfaceWeather().snowAmount`, no second weather state. Camera-independent
 * (`detail` always 1; no litter/worn biases). GLSL text and TypeScript twins live
 * here so terrain and grass share one spatial logic.
 * @domain world-terrain
 * @subdomain terrain
 */

/** Gain of the snow amount in the threshold test. */
export const SNOW_GAIN = 1.25
/** Offset subtracted before the test: small amounts show only easy (high-bias) spots. */
export const SNOW_ONSET = 0.15
/** Half width of the smoothstep edge in threshold units. */
export const SNOW_EDGE = 0.06
/** Terrain bias terms (flat gains, steep sheds, altitude gains). */
export const SNOW_BIAS = { flat: 0.12, steep: 0.6, altitude: 0.15 } as const
/** Altitude ramp (metres, absolute world Y) of the altitude bias. */
export const SNOW_ALT_M = [60, 140] as const
/** Grass cover bias before the altitude term (terrain flat bias does not apply to blades). */
export const GRASS_SNOW_BIAS = 0.1
/** Share of snow colour on tips of a covered blade (before the height ramp). */
export const GRASS_SNOW_FROST = 0.55
/** Bury amount where a covered instance is discarded. */
export const GRASS_SNOW_DITHER_AT = 0.97
/** Cool snow albedo used by terrain and grass presentation. */
export const SNOW_COL = { r: 0.9, g: 0.94, b: 0.98 } as const

const f = (v: number): string => v.toFixed(2)

/** Integer lattice hash — identical TS/GLSL twins (from V3 ground-patch lattice). */
const mix32 = (x: number): number => {
  x ^= x >>> 16
  x = Math.imul(x, 0x7feb352d)
  x ^= x >>> 15
  x = Math.imul(x, 0x846ca68b)
  x ^= x >>> 16
  return x >>> 0
}

/** Lattice hash to [0, 1); identical to `gpHash` in GLSL. */
export function snowLatticeHash(ix: number, iy: number): number {
  return (mix32((Math.imul(ix >>> 0, 0x27d4eb2d) ^ mix32((iy + 0x165667b1) >>> 0)) >>> 0) >>> 8) / 16777216
}

const INTEGER_LATTICE_GLSL = `
#ifndef SV_INTEGER_LATTICE_GLSL
#define SV_INTEGER_LATTICE_GLSL
highp uint gpMix(highp uint x) { x ^= x >> 16u; x *= 0x7feb352du; x ^= x >> 15u; x *= 0x846ca68bu; x ^= x >> 16u; return x; }
highp float gpHash(highp ivec2 i) { return float(gpMix((uint(i.x) * 0x27d4eb2du) ^ gpMix(uint(i.y) + 0x165667b1u)) >> 8u) / 16777216.0; }
#endif
`

/** Quintic value noise on the shared lattice, GLSL (inject into terrain/grass shaders). */
export const SNOW_FIELD_GLSL = `
${INTEGER_LATTICE_GLSL}
#ifndef SV_SNOW_GLSL
#define SV_SNOW_GLSL
float svSnowN( vec2 p ) {
  vec2 fl = floor( p );
  ivec2 i = ivec2( fl );
  vec2 f = p - fl;
  f = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 );
  return mix( mix( gpHash( i ), gpHash( i + ivec2( 1, 0 ) ), f.x ), mix( gpHash( i + ivec2( 0, 1 ) ), gpHash( i + ivec2( 1, 1 ) ), f.x ), f.y );
}
float svSnowThreshold( vec2 xz, float detail ) {
  vec2 q = xz + ( svSnowN( xz / 48.0 + 5.1 ) - 0.5 ) * vec2( 18.0, -11.0 );
  float fine = 0.6 * svSnowN( q / 3.3 + 1.3 ) + 0.4 * svSnowN( q / 1.2 + 7.9 );
  return 0.6 * svSnowN( q / 11.0 ) + 0.4 * mix( 0.5, fine, detail );
}
float svSnowCover( float n, float s, float bias ) {
  return smoothstep( n - ${f(SNOW_EDGE)}, n + ${f(SNOW_EDGE)}, s * ${f(SNOW_GAIN)} + bias - ${f(SNOW_ONSET)} );
}
#endif
`

const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Twin of `svSnowN`. */
export function snowNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  let fx = x - ix
  let fy = y - iy
  fx = fx * fx * fx * (fx * (fx * 6 - 15) + 10)
  fy = fy * fy * fy * (fy * (fy * 6 - 15) + 10)
  const a = snowLatticeHash(ix, iy) + (snowLatticeHash(ix + 1, iy) - snowLatticeHash(ix, iy)) * fx
  const b = snowLatticeHash(ix, iy + 1) + (snowLatticeHash(ix + 1, iy + 1) - snowLatticeHash(ix, iy + 1)) * fx
  return a + (b - a) * fy
}

/**
 * Twin of `svSnowThreshold`: world-anchored threshold in about [0.1, 0.9].
 * V1 always passes `detail = 1` (full fine octaves; no camera fade).
 */
export function snowThreshold(x: number, z: number, detail: number): number {
  const w = snowNoise(x / 48 + 5.1, z / 48 + 5.1) - 0.5
  const qx = x + w * 18
  const qz = z + w * -11
  const fine = 0.6 * snowNoise(qx / 3.3 + 1.3, qz / 3.3 + 1.3) + 0.4 * snowNoise(qx / 1.2 + 7.9, qz / 1.2 + 7.9)
  return 0.6 * snowNoise(qx / 11, qz / 11) + 0.4 * (0.5 + (fine - 0.5) * detail)
}

/** Twin of `svSnowCover`: monotone non-decreasing in `s`. */
export function snowCover(n: number, s: number, bias: number): number {
  return smooth(n - SNOW_EDGE, n + SNOW_EDGE, s * SNOW_GAIN + bias - SNOW_ONSET)
}

/** Terrain bias inputs (flat / steep / altitude only — no litter/worn). */
export interface SnowTerrainBiasInput {
  /** Object-space up component of the normal (1 = flat). */
  up: number
  /** World Y (metres). */
  y: number
}

/** Twin of the terrain snow bias GLSL. */
export function snowTerrainBias(i: SnowTerrainBiasInput): number {
  return (
    SNOW_BIAS.flat * smooth(0.85, 0.97, i.up)
    - SNOW_BIAS.steep * (1 - smooth(0.55, 0.8, i.up))
    + SNOW_BIAS.altitude * smooth(SNOW_ALT_M[0], SNOW_ALT_M[1], i.y)
  )
}

/** Terrain snow cover twin (detail always 1 for V1). */
export function terrainSnowCoverAt(
  x: number,
  z: number,
  s: number,
  i: SnowTerrainBiasInput,
): number {
  return snowCover(snowThreshold(x, z, 1), s, snowTerrainBias(i))
}

/** Per-instance grass cover twin (fixed blade bias + altitude; detail = 1). */
export function grassSnowCoverAt(x: number, z: number, s: number, y: number): number {
  const altitude = SNOW_BIAS.altitude * smooth(SNOW_ALT_M[0], SNOW_ALT_M[1], y)
  return snowCover(snowThreshold(x, z, 1), s, GRASS_SNOW_BIAS + altitude)
}

/** Twin of the vertex bury curve (blade path — V1 has no separate flower bury). */
export function grassSnowBury(sc: number): number {
  return smooth(0.25, 0.9, sc)
}

/** Twin of tip frost colour share at blade height `h` (0 root .. 1 tip). */
export function grassSnowFrost(sc: number, h: number): number {
  return sc * GRASS_SNOW_FROST * smooth(0.2, 1, h)
}

/** Twin of discard visibility: 1 while buried below the threshold, 0 when fully gone. */
export function grassSnowVisible(bury: number): number {
  return 1 - smooth(GRASS_SNOW_DITHER_AT, 0.99, bury)
}

/**
 * Parses `?snow=` from a search string: finite number clamped to 0..1, else null
 * (no override). Used by the game loop for fixed A/B presentation steps.
 */
export function parseSnowParam(search?: string): number | null {
  const s = search ?? (typeof location !== 'undefined' ? location.search : '')
  const raw = new URLSearchParams(s).get('snow')
  if (raw === null || raw.trim() === '') return null
  const v = Number(raw)
  if (!Number.isFinite(v)) return null
  return v < 0 ? 0 : v > 1 ? 1 : v
}
