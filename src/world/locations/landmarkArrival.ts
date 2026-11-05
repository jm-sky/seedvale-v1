import type { LocationKnowledge } from './locationKnowledge'
import type { WorldLocationCatalog } from './worldLocationCatalog'
import { isWetFloor } from '../../terrain/waterSurface'
import { worldLocationKindFromId } from './worldLocationTypes'

/**
 * Physical-arrival rules for the catalog kinds that had none (plan world-041
 * L0 §4, slice L3a): lake, mountain peak, cemetery. Evaluated on the existing
 * proximity cadence over **knowledge entries that are not `confirmed`** only —
 * never a catalog scan — so a rumour lead (`estimated`) or a map-told
 * (`discovered`) place closes by walking to it. Arrival reveals
 * `confirmed`/`exploration` through the forward-only rank.
 *
 * @domain world-locations
 */

/** Cemetery: horizontal distance from its centre. */
export const CEMETERY_ARRIVAL_RADIUS = 30
/** Peak: horizontal distance from the catalog position. */
export const PEAK_ARRIVAL_RADIUS = 60
/** Peak: vertical window around the summit height. */
export const PEAK_ARRIVAL_HEIGHT_WINDOW = 10
/** Lake: margin added to the lake's extent radius for the cheap gate. */
export const LAKE_ARRIVAL_EXTENT_MARGIN = 40
/** Lake: a wet-floor hit must exist within this distance of the player (who stands on dry ground). */
export const LAKE_ARRIVAL_SHORE_RADIUS = 30

const SHORE_PROBE_DIRECTIONS = 8
const SHORE_PROBE_RINGS: readonly number[] = [LAKE_ARRIVAL_SHORE_RADIUS / 2, LAKE_ARRIVAL_SHORE_RADIUS]

export type LandmarkArrivalTexel = { h: number, floorH: number }

export type LandmarkArrivalDeps = {
  catalog: Pick<WorldLocationCatalog, 'getById' | 'lakeExtentRadius' | 'peakSummitHeight'>
  knowledge: LocationKnowledge
  /** Raw terrain sample (clamped surface height + floor height) at a world point. */
  sampleTexel: (x: number, z: number) => LandmarkArrivalTexel
}

function isDry(texel: LandmarkArrivalTexel): boolean {
  return !isWetFloor(texel.h, texel.floorH)
}

function hasWetFloorNearby(deps: LandmarkArrivalDeps, x: number, z: number): boolean {
  for (const ring of SHORE_PROBE_RINGS) {
    for (let i = 0; i < SHORE_PROBE_DIRECTIONS; i++) {
      const angle = (i / SHORE_PROBE_DIRECTIONS) * Math.PI * 2
      const texel = deps.sampleTexel(x + Math.cos(angle) * ring, z + Math.sin(angle) * ring)
      if (isWetFloor(texel.h, texel.floorH)) return true
    }
  }
  return false
}

function arrivedAt(deps: LandmarkArrivalDeps, id: string, playerX: number, playerZ: number): boolean {
  const kind = worldLocationKindFromId(id)
  if (kind !== 'lake' && kind !== 'mountainPeak' && kind !== 'cemetery') return false
  const location = deps.catalog.getById(id)
  if (!location) return false
  const dist = Math.hypot(playerX - location.x, playerZ - location.z)
  if (kind === 'cemetery') return dist <= CEMETERY_ARRIVAL_RADIUS
  if (kind === 'mountainPeak') {
    if (dist > PEAK_ARRIVAL_RADIUS) return false
    const summit = deps.catalog.peakSummitHeight(id)
    if (summit == null) return false
    return Math.abs(deps.sampleTexel(playerX, playerZ).h - summit) <= PEAK_ARRIVAL_HEIGHT_WINDOW
  }
  const extent = deps.catalog.lakeExtentRadius(id)
  if (extent == null || dist > extent + LAKE_ARRIVAL_EXTENT_MARGIN) return false
  return isDry(deps.sampleTexel(playerX, playerZ)) && hasWetFloorNearby(deps, playerX, playerZ)
}

/**
 * Confirms every not-yet-`confirmed` lake / peak / cemetery entry the player
 * has physically reached. Returns the newly confirmed `{ id, name }` pairs for
 * toast feedback.
 */
export function revealLandmarksOnArrival(
  deps: LandmarkArrivalDeps,
  playerX: number,
  playerZ: number,
): { id: string, name: string }[] {
  const revealed: { id: string, name: string }[] = []
  for (const entry of deps.knowledge.list()) {
    if (entry.state === 'confirmed') continue
    if (!arrivedAt(deps, entry.id, playerX, playerZ)) continue
    if (!deps.knowledge.reveal(entry.id, 'confirmed', 'exploration')) continue
    const location = deps.catalog.getById(entry.id)
    if (location) revealed.push({ id: location.id, name: location.name })
  }
  return revealed
}
