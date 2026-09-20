import type { RegionParams } from './chunkHeightmap'

/**
 * Shared ocean-shoreline classification (plan world-terrain-047) — the one
 * place shell worldgen (`chunkItems.ts`) and shallow-water shovel digging
 * (`dig.ts`) agree on "this is the shoreline", so the two features can't
 * silently drift apart. Pure; consumes only terrain signals already
 * available to both call sites (height, `waterLevel`, continentalness,
 * `RegionParams.oceanThreshold`/`coastThreshold`).
 *
 * @domain world-terrain
 */

/** Dry-band lower bound for procedural shell placement, in world units above
 *  `waterLevel` — keeps shells off ground that never gets splashed. */
export const SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER = 0.1
/** Dry-band upper bound for procedural shell placement — tight enough to
 *  read as "right at the waterline", not the old broad `+0.5..+3m` band. */
export const SHELL_SPAWN_MAX_HEIGHT_ABOVE_WATER = 1.25
/** How far below `waterLevel` a shovel may still dig coastal sand for a
 *  shell find — shallow wading depth, not the open seabed. */
export const SHELL_DIG_MAX_DEPTH_BELOW_WATER = 0.35

type CoastalContinentalnessRegion = Pick<RegionParams, 'oceanThreshold' | 'coastThreshold'>

function isOceanCoastContinentalness(continentalness: number, region: CoastalContinentalnessRegion): boolean {
  return continentalness >= region.oceanThreshold && continentalness <= region.coastThreshold
}

/** True when `(height, continentalness)` sit in the tight dry band right at
 *  the ocean shoreline that procedural shell placement targets. Never true
 *  for an inland lake/river shoreline (continentalness gate only accepts
 *  the ocean/coast band). */
export function isShellSpawnShore(
  height: number,
  waterLevel: number,
  continentalness: number,
  region: CoastalContinentalnessRegion,
): boolean {
  const above = height - waterLevel
  return (
    above >= SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER
    && above <= SHELL_SPAWN_MAX_HEIGHT_ABOVE_WATER
    && isOceanCoastContinentalness(continentalness, region)
  )
}

/** True when `(height, continentalness)` sit on ocean-shoreline dry ground or
 *  shallow water shallow enough for a shovel to still work — the shell-find
 *  eligibility band for coastal sand digging. Deeper water, lakes and rivers
 *  are never eligible. Ground-material (sand) itself is checked separately
 *  by `dig.ts`'s existing `getDigProfileAt`. */
export function isShellDigShore(
  height: number,
  waterLevel: number,
  continentalness: number,
  region: CoastalContinentalnessRegion,
): boolean {
  const above = height - waterLevel
  return above >= -SHELL_DIG_MAX_DEPTH_BELOW_WATER && isOceanCoastContinentalness(continentalness, region)
}
