import type { LandmarkQueryOptions, WorldLocationCatalog } from './worldLocationCatalog'
import type { DiscoveryRange, WorldLocation } from './worldLocationTypes'
import { FAR_RANGE_HOURS, hoursToDays, MEDIUM_RANGE_HOURS, NEAR_RANGE_HOURS, worldUnitsToHours } from './locationConfig'

export function classifyRange(hours: number): DiscoveryRange {
  if (hours <= NEAR_RANGE_HOURS) return 'near'
  if (hours <= MEDIUM_RANGE_HOURS) return 'medium'
  return 'far'
}

export function isWithinRange(hours: number, range: DiscoveryRange): boolean {
  if (range === 'near') return hours <= NEAR_RANGE_HOURS
  if (range === 'medium') return hours <= MEDIUM_RANGE_HOURS
  return hours <= FAR_RANGE_HOURS
}

/** "ok. 3 h drogi" / "pół dnia drogi" / "dzień drogi" (plan world-059
 *  decision 9) — player-facing travel time, never the near/medium/far bucket. */
export function formatDistance(hours: number): string {
  if (hours < 1) return 'mniej niż godzina drogi'
  if (hours < 8) return `ok. ${Math.round(hours)} h drogi`
  if (hours < 16) return 'pół dnia drogi'
  const days = hoursToDays(hours)
  if (days < 1.5) return 'dzień drogi'
  return `ok. ${Math.round(days)} dni drogi`
}

/** Highest `discoveryWeight` first, `id` as a stable tie-break so an equal-
 *  weight pool never reorders between calls on the same seed (notes §13). */
export function weightedTopN(locations: readonly WorldLocation[], n: number): WorldLocation[] {
  return [...locations]
    .sort((a, b) => b.discoveryWeight - a.discoveryWeight || a.id.localeCompare(b.id))
    .slice(0, n)
}

/** Fisher-Yates using a caller-supplied `rng` (production: `Math.random`;
 *  tests: a seeded stream) — keeps the "which locations does this
 *  conversation reveal" pick testable without hard-coding `Math.random`
 *  into the selection logic itself (notes §11/§13). */
export function pickRandomSubset<T>(pool: readonly T[], count: number, rng: () => number): T[] {
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/** Picks a random reveal count in `[min, max]` (plan §7 "1-3 lokacje"), then
 *  a random subset of that size from `pool` — both via the same `rng`. */
export function pickRandomReveal<T>(pool: readonly T[], min: number, max: number, rng: () => number): T[] {
  const count = min + Math.floor(rng() * (max - min + 1))
  return pickRandomSubset(pool, count, rng)
}

function locationDistanceHours(loc: WorldLocation, x: number, z: number): number {
  return worldUnitsToHours(Math.hypot(loc.x - x, loc.z - z))
}

/** A `(minHours, maxHours]` band, e.g. the merchant's Far Map (plan §9), which
 *  must draw only from its own `far` bucket (12-50 h) so it never repeats
 *  what the Near Map (0-4 h) already reveals. Delegates straight to
 *  `catalog.landmarksInRange` (plan world-013 §8) instead of generating
 *  `0..maxHours` and filtering afterwards, so the expensive coarse terrain scan
 *  itself is bounded to the requested band. */
export function landmarksInBand(
  catalog: WorldLocationCatalog,
  x: number,
  z: number,
  minHours: number,
  maxHours: number,
): WorldLocation[] {
  return catalog.landmarksInRange(x, z, minHours, maxHours)
}

/** Async `landmarksInBand` — same catalog pipeline, cooperative cemetery probes. */
export function landmarksInBandAsync(
  catalog: WorldLocationCatalog,
  x: number,
  z: number,
  minHours: number,
  maxHours: number,
  options?: LandmarkQueryOptions,
): Promise<WorldLocation[]> {
  return catalog.landmarksInRangeAsync(x, z, minHours, maxHours, options)
}

export function settlementsInBand(
  catalog: WorldLocationCatalog,
  x: number,
  z: number,
  minHours: number,
  maxHours: number,
): WorldLocation[] {
  return catalog.nearestSettlements(x, z, maxHours).filter((loc) => locationDistanceHours(loc, x, z) > minHours)
}
