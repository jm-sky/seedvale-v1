import { MathUtils } from 'three'
import type { NoiseFunction2D } from 'simplex-noise'

/**
 * Finite-continent mask (plan world-terrain-058, slice W1).
 *
 * `continentMaskAt` returns a value in [0, 1] that `sampleRawTexel` applies as
 * `continentalness = min(c, mask)`, so oceans, coasts, biomes and the map all follow
 * from the existing continentalness field. 1 = untouched terrain (inside the inner
 * radius); falls through `coastThreshold`/`oceanThreshold` in the edge band to open
 * sea. The coast radius varies with angle by seeded low-frequency noise (sampled on
 * a circle, so it is continuous across ±π) and the centre carries a small seeded
 * offset; the origin is always inside the inner radius, so the home stays on land.
 *
 * Pure and worker-safe; reuses the existing `continent`/`warp` noise handles.
 */
export type ContinentMaskParams = {
  /** Radius (m) inside which terrain is unchanged. */
  innerRadius: number
  /** Per-seed coast radius range (m) — land ends near this radius. */
  coastRadiusMin: number
  coastRadiusMax: number
  /** Width (m) of the falloff towards the coast radius. */
  edgeBand: number
  /** Max seeded offset (m) of the continent centre from the origin. */
  centreJitter: number
}

/** Hard world boundary half-extent (m); nothing generates beyond it. */
export const WORLD_HALF_EXTENT = 4096

const WOBBLE_BASE_FREQ = 1.1
const WOBBLE_DETAIL_FREQ = 3.3
const WARP_FREQ = 0.0016
const WARP_AMPLITUDE = 140

/** Seeded centre offset of the continent (stable per noise handle). */
export function continentCentre(
  continent: NoiseFunction2D,
  params: ContinentMaskParams,
): { x: number, z: number } {
  return {
    x: continent(71.3, 12.9) * params.centreJitter,
    z: continent(-33.7, 58.1) * params.centreJitter,
  }
}

/** Coast radius (m) in direction `theta` (radians) for this seed. */
export function coastRadiusAt(
  theta: number,
  continent: NoiseFunction2D,
  params: ContinentMaskParams,
): number {
  const cx = Math.cos(theta)
  const sz = Math.sin(theta)
  const n =
    0.65 * continent(cx * WOBBLE_BASE_FREQ + 101.7, sz * WOBBLE_BASE_FREQ - 47.2) +
    0.35 * continent(cx * WOBBLE_DETAIL_FREQ - 19.4, sz * WOBBLE_DETAIL_FREQ + 83.6)
  const t = MathUtils.clamp(n * 0.5 + 0.5, 0, 1)
  return params.coastRadiusMin + (params.coastRadiusMax - params.coastRadiusMin) * t
}

/** Mask in [0, 1]; 1 = natural terrain, 0 = open sea. */
export function continentMaskAt(
  wx: number,
  wz: number,
  noise: { continent: NoiseFunction2D, warp: NoiseFunction2D },
  params: ContinentMaskParams,
): number {
  // Cheap early-out: the coast radius never drops below `coastRadiusMin` and the
  // centre never leaves `centreJitter`/warp range, so the core is untouched.
  const safe = params.innerRadius - params.centreJitter * 1.5 - WARP_AMPLITUDE
  if (safe > 0 && wx * wx + wz * wz < safe * safe) return 1
  const centre = continentCentre(noise.continent, params)
  const px = wx + noise.warp(wx * WARP_FREQ + 11.3, wz * WARP_FREQ - 5.9) * WARP_AMPLITUDE
  const pz = wz + noise.warp(wx * WARP_FREQ - 23.1, wz * WARP_FREQ + 37.7) * WARP_AMPLITUDE
  const dx = px - centre.x
  const dz = pz - centre.z
  const d = Math.hypot(dx, dz)
  if (d <= params.innerRadius) return 1
  const coast = coastRadiusAt(Math.atan2(dz, dx), noise.continent, params)
  const start = Math.max(params.innerRadius, coast - params.edgeBand)
  return 1 - MathUtils.smoothstep(d, start, coast)
}
