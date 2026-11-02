/**
 * Shared constants for the World Locations / discovery / navigation system
 * (plan world-012). Kept separate from `world/map/mapConfig.ts`, which only
 * covers map-cell/canvas rendering.
 */

import { GAME_HOURS_PER_DAY } from '../timeConversion'
import { TRAVEL_HOUR_M } from '../travelUnits'

/** World units (metres) a walking player covers in one game hour (plan
 *  world-059 decision 9). Location distances are expressed as travel time in
 *  hours; km no longer appears in player-facing text. */
export const WORLD_UNITS_PER_HOUR = TRAVEL_HOUR_M

export const HOURS_PER_DAY = GAME_HOURS_PER_DAY

export function worldUnitsToHours(worldUnits: number): number {
  return worldUnits / WORLD_UNITS_PER_HOUR
}

export function hoursToWorldUnits(hours: number): number {
  return hours * WORLD_UNITS_PER_HOUR
}

export function hoursToDays(hours: number): number {
  return hours / HOURS_PER_DAY
}

/** Range thresholds in travel hours (plan world-059 decision 9): near <= 4 h,
 *  medium <= 12 h, far = whole continent (12 km square diagonal ~48 h). */
export const NEAR_RANGE_HOURS = 4
export const MEDIUM_RANGE_HOURS = 12
export const FAR_RANGE_HOURS = 50

/** Fixed grid step (world units) used to scan for lake/mountain-peak
 *  candidates — independent of any particular search's distance bound, so a
 *  location's derived id never depends on how far the query that found it
 *  reached (notes §21 "stable id"). Coarser than `MAP_CELL_SIZE` since this
 *  drives a bounded, one-off world scan, not per-frame rendering. */
export const LOCATION_SCAN_STEP = 48

/** Radius (in `ChunkManager.findLandmarkNear` "chunk ring" units) searched
 *  around one settlement for its village-fringe cemetery. Comfortably covers
 *  `chunkEnvironment.ts`'s `CEMETERY_OUTER_FRAC` ring for every village size
 *  without overlapping the next settlement cell. */
export const CEMETERY_SEARCH_CHUNK_RADIUS = 3

/** Caps how many nearby settlements a landmark search checks for a cemetery
 *  — cemetery search is real chunk-generation work (notes §4/§22), so a
 *  "far" query (whole continent, potentially dozens of settlement cells) stays
 *  bounded rather than scanning every settlement in range. Closest
 *  settlements first, so this only ever drops the least-relevant (farthest)
 *  candidates. */
export const MAX_CEMETERY_SETTLEMENTS_SEARCHED = 12

/** Minimum coarse-grid cell run to call a flood-filled water cluster a
 *  "lake" worth naming, rather than a puddle-sized noise artifact. */
export const MIN_LAKE_CELLS = 3

/** Coarse terrain cache tile edge, in `LOCATION_SCAN_STEP` cells (plan
 *  world-013 §4) — one tile is a small `Uint8Array`/`Float32Array` pair,
 *  materialized lazily per cell, shared across every Near/Guard/Far query
 *  that touches it instead of one result cache per exact `(x, z, maxHours)`. */
export const LOCATION_TILE_CELLS = 16

/** Peak neighbourhood/near-duplicate-merge halo, in `LOCATION_SCAN_STEP`
 *  cells (plan world-013 §9) — a range-aware query's candidate window
 *  extends this far past `minHours`/`maxHours` so a peak sitting right at the
 *  query boundary is still evaluated with its full 8-neighbourhood and
 *  merge radius, the same as if the scan had reached further. */
export const PEAK_NEIGHBOR_MARGIN_CELLS = 1
export const PEAK_MERGE_RADIUS_CELLS = 2
export const PEAK_SCAN_HALO_CELLS = PEAK_NEIGHBOR_MARGIN_CELLS + PEAK_MERGE_RADIUS_CELLS

/** Defensive cap on one lake flood-fill component (plan world-013 §4 "expand
 *  only toward closing the component") — real procedurally-generated inland
 *  water bodies never approach this size; this only guards a pathological
 *  terrain-config edge case from turning boundary-closing flood-fill into an
 *  unbounded scan. */
export const LAKE_FLOOD_FILL_SAFETY_CAP = 20000

/** Guard's "Opowiedz mi coś o okolicy" — near+medium landmark pool (plan §6),
 *  top-N by `discoveryWeight` before the 1-3 reveal roll. */
export const GUARD_LANDMARK_POOL_SIZE = 5
export const GUARD_REVEAL_MIN = 1
export const GUARD_REVEAL_MAX = 3

/** Merchant Near/Far maps (plan §9) — top-N landmarks per map. */
export const MERCHANT_MAP_LANDMARK_POOL_SIZE = 10
