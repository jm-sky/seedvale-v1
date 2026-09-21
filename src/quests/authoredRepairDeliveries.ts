import { isStructureRepairProblem, type SettlementStructureState, structureRepairPolicy } from '../settlement/structureCondition'

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

/**
 * Pure intact-check for one authored starter repair target (plan
 * quests-progression-077) — `storedState` must be the manager's raw stored
 * record (`SettlementsManager.getStoredStructureState`), never a `resolve()`d
 * pristine-fallback snapshot: a missing record means the starter damage
 * hasn't been proven repaired (possibly not even seeded yet), not that the
 * target is intact. Used by `createApp.ts`'s `QuestLifecycleHooks.
 * isAuthoredRepairTargetIntact` to select the `already_repaired` dialogue
 * only for a target genuinely above its repair threshold.
 *
 * @domain quests-progression
 */
export function isAuthoredRepairTargetIntact(
  target: AuthoredRepairDeliveryTarget,
  storedState: SettlementStructureState | undefined,
  nowDays: number,
): boolean {
  if (!storedState) return false
  const policy = structureRepairPolicy(target.structureIdKind)
  if (!policy) return false
  return !isStructureRepairProblem(policy, storedState, nowDays)
}
