import { WORLD_HALF_EXTENT } from './continentMask'

/**
 * World edge (plan world-terrain-058, slice E1; decision 12).
 *
 * Pure helpers shared by every movement owner (player, NPC, fauna): a hard clamp to the
 * ±`WORLD_HALF_EXTENT` box and a push-back current for swimmers in the outer band.
 * Beyond the outermost coast there is only open sea, so in practice only the player can
 * reach the band; NPC/fauna owners use `isInsideWorldBox` as a defensive walkability gate.
 */

/** Width (m) of the outer band in which the push-back current acts. */
export const WORLD_EDGE_BAND = 300

/** Push-back speed (m/s) at the hard edge — above the player's swim speed (walk 6 m/s). */
export const WORLD_EDGE_MAX_PUSH_SPEED = 9

/** Distance (m, Chebyshev) from the origin where the push-back current starts. */
export const WORLD_EDGE_BAND_START = WORLD_HALF_EXTENT - WORLD_EDGE_BAND

/** True while (x, z) lies inside the world box. */
export function isInsideWorldBox(x: number, z: number): boolean {
  return Math.abs(x) <= WORLD_HALF_EXTENT && Math.abs(z) <= WORLD_HALF_EXTENT
}

/** Clamps a horizontal position to the world box. */
export function clampToWorldBox(x: number, z: number): { x: number, z: number } {
  return {
    x: Math.max(-WORLD_HALF_EXTENT, Math.min(WORLD_HALF_EXTENT, x)),
    z: Math.max(-WORLD_HALF_EXTENT, Math.min(WORLD_HALF_EXTENT, z)),
  }
}

/**
 * Push-back velocity (m/s, towards the origin per axis) at (x, z). Zero before the band
 * start, ramping linearly to `WORLD_EDGE_MAX_PUSH_SPEED` at the hard edge. Per axis, so
 * a corner is pushed along both axes.
 */
export function worldEdgePushVelocity(x: number, z: number): { x: number, z: number } {
  return { x: axisPush(x), z: axisPush(z) }
}

function axisPush(v: number): number {
  const over = Math.abs(v) - WORLD_EDGE_BAND_START
  if (over <= 0) return 0
  const t = Math.min(1, over / WORLD_EDGE_BAND)
  return -Math.sign(v) * t * WORLD_EDGE_MAX_PUSH_SPEED
}
