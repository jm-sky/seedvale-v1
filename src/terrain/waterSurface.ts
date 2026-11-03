/**
 * @domain terrain
 * @system water
 * @role Single owner of the "is this point wet" rule after plan world-terrain-058 L1: the clamped surface height `h`
 *   (`max(floorH, waterH)`, `waterH` = sea level or a lake's level) lies above the floor. Leaf module (no imports) so
 *   terrain, placement and gameplay code share one predicate instead of comparing a height against `waterLevel`,
 *   which only ever described the sea.
 */

/** `h - floorH` above this (m) means water covers the point. Samples are bilinear, so a texel row with a wet corner leaks a fraction of its depth into neighbouring dry points; 2 cm keeps that leak from reading as water. */
export const WET_EPS = 0.02

/** Two water surfaces closer than this (m) are the same body level. */
export const LAKE_SURFACE_EPS = 1e-3

/** True when water (sea, lake) covers a point: surface above the floor. Rivers are separate (`riverWaterSampleAt`). */
export function isWetFloor(clampedHeight: number, floorHeight: number, eps: number = WET_EPS): boolean {
  return clampedHeight - floorHeight > eps
}

/** Legacy sea semantics kept for texels whose floor equals the sea level exactly: `h <= waterLevel` is also "water". */
export function isWetTexel(clampedHeight: number, floorHeight: number, waterLevel: number): boolean {
  return clampedHeight <= waterLevel + WET_EPS || isWetFloor(clampedHeight, floorHeight)
}

/**
 * Placement/shore test: water-covered (sea or lake) or within `margin` above the sea level. Lake banks get no extra
 * margin (the margin is relative to `waterLevel`); a wet cell is always rejected.
 */
export function isWaterOrShore(
  clampedHeight: number,
  floorHeight: number,
  waterLevel: number,
  margin: number,
): boolean {
  return isWetFloor(clampedHeight, floorHeight) || clampedHeight <= waterLevel + margin
}
