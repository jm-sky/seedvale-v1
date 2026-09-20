import type { VillagePlan } from './villagePlan'
import {
  communalFenceFallbackStructureId,
  householdFenceStructureId,
  loggingWagonStructureId,
  residentialFoundationStructureId,
} from './villagePlan'

/**
 * Authored starter repair-target presentation input (plan
 * quests-progression-073) — resolved once at home-settlement materialization
 * from live `SettlementStructureStateRegistry` state, and passed into
 * `buildSettlementProps` so presentation stays a pure projection of
 * authoritative repair state; no separate `isBrokenVisual` is ever stored.
 *
 * @domain settlements
 */
export type AuthoredRepairPresentationInput = {
  householdFenceDamaged: boolean
  foundationDamaged: boolean
  loggingWagonDamaged: boolean
  communalFenceDamaged: boolean
  /** `true` when `communalFenceStructureId` is a real
   *  `VillagePastureFenceSegment.id` (a pasture exists); `false` for the
   *  deterministic SM/no-pasture fallback fence. */
  communalFenceUsesPastureSegment: boolean
  communalFenceStructureId: string
}

export type CommunalFenceTarget = {
  structureId: string
  usesPastureSegment: boolean
}

/**
 * Resolves the authored communal-fence repair target's stable identity (plan
 * quests-progression-073) — the real `pasture-fence-a` segment's id when the
 * home settlement has a pasture, otherwise the deterministic fallback id.
 * Never assumes `plan.pasture` exists (implementation notes §8) and never
 * forces a settlement size just to satisfy this quest.
 *
 * @domain settlements
 */
export function resolveCommunalFenceTarget(plan: VillagePlan | undefined): CommunalFenceTarget {
  const segment = plan?.pasture?.fenceSegments.find((candidate) => candidate.id === 'pasture-fence-a')
    ?? plan?.pasture?.fenceSegments[0]
  if (segment) return { structureId: segment.id, usesPastureSegment: true }
  return { structureId: communalFenceFallbackStructureId(), usesPastureSegment: false }
}

/**
 * Every authored starter repair-target structureId for the home settlement
 * (plan quests-progression-073), keyed by target — the single place both the
 * idempotent seeding bootstrap (`SettlementsManager`) and NPC/presentation
 * wiring (`createSettlement.ts`) resolve these ids from, so they can never
 * drift apart.
 *
 * @domain settlements
 */
export type AuthoredRepairStructureIds = {
  householdFence: string
  foundation: string
  loggingWagon: string
  communalFence: CommunalFenceTarget
}

/** Family index 0 is always Piotr/Anna's `family-reserved-0` on the home
 *  settlement (see `families.ts`'s `reservedHomeFamilies`) — the only
 *  settlement these ids are ever resolved for. */
export function resolveAuthoredRepairStructureIds(plan: VillagePlan | undefined): AuthoredRepairStructureIds {
  return {
    householdFence: householdFenceStructureId(0),
    foundation: residentialFoundationStructureId(0),
    loggingWagon: loggingWagonStructureId(0),
    communalFence: resolveCommunalFenceTarget(plan),
  }
}
