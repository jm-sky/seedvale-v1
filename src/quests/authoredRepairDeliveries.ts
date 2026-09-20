/**
 * Authored quest id → repair-target ownership mapping (plan
 * quests-progression-073) — the only place a quest id is special-cased for
 * the gather-hand-in world-transfer bridge. `QuestManager` never sees this
 * map; the composition root (`createApp.ts`) reads it inside its
 * `QuestLifecycleHooks.deliverGatherMaterials` implementation to resolve the
 * real household/settlement material sink and release the matching starter
 * repair reservation.
 *
 * @domain quests-progression
 */
export type AuthoredRepairDeliveryTarget =
  | { owner: 'household', structureIdKind: 'householdFence' | 'residentialFoundation' | 'loggingWagon' }
  | { owner: 'settlementEconomy', structureIdKind: 'communalFence' }

export const AUTHORED_REPAIR_DELIVERIES: Readonly<Record<string, AuthoredRepairDeliveryTarget>> = {
  'drewno-na-naprawe': { owner: 'household', structureIdKind: 'householdFence' },
  'kamienie-dla-piotra': { owner: 'household', structureIdKind: 'residentialFoundation' },
  'drewno-dla-anny': { owner: 'settlementEconomy', structureIdKind: 'communalFence' },
  'drewno-dla-piotra': { owner: 'household', structureIdKind: 'loggingWagon' },
}
