import { Vector3 } from 'three'
import type { CultivationAnchor } from '../world/cultivationAnchor'
import type { HouseholdResourceKind } from './household'
import type { SettlementTreeLandmark } from './props'
import type { VillagePlaza } from './villagePlan'
import { type SettlementLandmarks } from './props'
import { resolveHouseholdWoodStorage, settlementStorageDestination } from './storageDestinations'

/**
 * Narrow, procedural-independent runtime inputs a live settlement resident
 * (`NpcAgent`, `npcProfessionWork.ts`, `npcLogistics.ts`) actually needs
 * (plan settlements-021 Stage B/C) — the minimum slice of a procedural
 * `SettlementLandmarks` that stops those modules from requiring the entire
 * object, so a later founded/nonprocedural resident (plan settlements-022)
 * never has to fabricate synthetic wells/markets/houses/land-plots just to
 * satisfy a type.
 *
 * Every field is absence-tolerant (empty array / `null`) — a site with no
 * matching real infrastructure supplies that, never a synthetic stand-in.
 * Built once per settlement (settlement-scope fields) or once per resident
 * (`householdWoodStorage`) at materialization time, never recomputed or
 * rescanned per frame.
 *
 * @domain settlements-npcs
 * @system npc-resident-anchors
 * @role Narrow settlement-scoped physical routing/work-anchor contract shared by the procedural adapter and (later) a founded/nonprocedural one.
 */
export type NpcResidentAnchors = {
  /** Water fetch/drink candidates (`resolveNearestWaterWellTarget`'s
   *  settlement-side input) — central + household wells, or one fallback
   *  well/queue pair. Empty when this site has no water source; drink/
   *  waterDuty strategies then have no settlement well to prefer over the
   *  household reserve/a nearby player well. */
  waterSources: readonly { position: Vector3, queueId: string | null }[]
  /** Abstract garden-gather idle/food-fallback anchor (the settlement
   *  garden) — `null` when this site has no cultivation-gather fallback. */
  fallbackFoodAnchor: Vector3 | null
  /** Settlement-level cultivation footprints for `planFarmWork`'s real
   *  harvest/plant target — `undefined`/empty when this site has none. */
  cultivationAnchors: readonly CultivationAnchor[]
  /** Woodcutter chop-target pool + plaza exclusion rule — `null` when this
   *  site has no eligible trees. */
  wood: { trees: readonly SettlementTreeLandmark[], plaza?: VillagePlaza } | null
  /** This resident's own household wood-pile deposit point — its own home
   *  when this site has no separate physical wood-pile prop. */
  householdWoodStorage: Vector3
  /** Fishing cast anchor — `null` for a site with no dock (never a well
   *  substitute; `null` here means "fisher has no fishing work today"). */
  fishingAnchor: Vector3 | null
  /** Waypoints for the idle "walk the dock" wander — empty for a site with
   *  no dock route. */
  dockRoute: readonly Vector3[]
  /** Settlement-scope wood/food delivery destinations — `null` when this
   *  site has no settlement storage (never a fake stockpile/crate). */
  settlementStorage: { food: Vector3, wood: Vector3 } | null
  /** Extra Guard patrol anchors beyond this resident's own home (which the
   *  caller always prepends) — empty degrades to a home-only/no patrol,
   *  never a synthetic well/market. */
  patrolPoints: readonly Vector3[]
  /** Settlement-owned pasture work area — passed straight through to
   *  `NpcWorkContext.pasture`. */
  pasture: { x: number, z: number, radius: number } | null
  /** Bounded local collision/rescue fallback anchors (`emergencyTeleport`'s
   *  last-resort candidates) — empty is legal; never synthesized. */
  collisionFallbackAnchors: readonly Vector3[]
}

/** Settlement-scope destination for `kind`, or `null` without real storage
 *  (never a fake stockpile/crate) — the narrow-contract equivalent of
 *  `storageDestinations.ts`'s `settlementStorageDestination`. */
export function resolveNpcSettlementStorage(
  storage: NpcResidentAnchors['settlementStorage'],
  kind: HouseholdResourceKind,
): Vector3 | null {
  return storage ? settlementStorageDestination(kind, storage.wood, storage.food) : null
}

/**
 * Builds the settlement-scope slice of `NpcResidentAnchors` once from a
 * procedural `SettlementLandmarks` — reused for every resident (and every
 * travelling visitor) of that settlement. Preserves the exact current
 * procedural targets (review requirement: procedural behavior must not
 * change).
 *
 * @domain settlements-npcs
 */
export function proceduralResidentAnchorsFromLandmarks(
  landmarks: SettlementLandmarks,
  wellQueueId: string,
): Omit<NpcResidentAnchors, 'householdWoodStorage'> {
  const waterSources = landmarks.wells && landmarks.wells.length > 0
    ? landmarks.wells.map((well) => ({ position: well.position, queueId: well.queueId }))
    : [{ position: landmarks.well, queueId: wellQueueId }]
  return {
    waterSources,
    fallbackFoodAnchor: landmarks.garden,
    cultivationAnchors: landmarks.cultivationAnchors ?? [],
    wood: { trees: landmarks.trees, plaza: landmarks.plaza },
    fishingAnchor: landmarks.dock ?? null,
    dockRoute: landmarks.dockRoute,
    settlementStorage: { food: landmarks.settlementStorage, wood: landmarks.stockpile },
    patrolPoints: [landmarks.well, landmarks.market],
    pasture: landmarks.pasture
      ? { x: landmarks.pasture.position.x, z: landmarks.pasture.position.z, radius: landmarks.pasture.radius }
      : null,
    collisionFallbackAnchors: [landmarks.well, landmarks.stockpile, landmarks.garden],
  }
}

/** Full per-resident `NpcResidentAnchors` — the settlement-scope slice above
 *  plus this resident's own household wood-pile point (`home`-dependent, so
 *  it cannot be shared across residents). */
export function residentAnchorsForHome(
  settlementAnchors: Omit<NpcResidentAnchors, 'householdWoodStorage'>,
  home: Vector3,
  landmarks: Pick<SettlementLandmarks, 'homes' | 'householdWoodStorages'>,
): NpcResidentAnchors {
  return {
    ...settlementAnchors,
    householdWoodStorage: resolveHouseholdWoodStorage(home, landmarks),
  }
}
