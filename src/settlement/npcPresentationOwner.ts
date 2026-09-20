import type { MerchantJourneyState } from './merchantJourney'

/**
 * One deterministic seam deciding which settlement, if any, currently owns a
 * given `NpcId`'s live/corpse presentation (plan settlements-021). Replaces
 * two previously-separate rules — `createSettlement.ts`'s home-suppression
 * check (`isNpcAwayOnMerchantJourney`) and `SettlementsManager.
 * resolveTravellingVisitors()`'s own destination check — with one policy both
 * call sites consult, so they cannot drift apart.
 *
 * Persistent source of truth stays in existing authoritative state
 * (`FoundedSettlementRegistry` residency + `NpcAuthoritativeState.
 * merchantJourney`); this module holds no state of its own and performs no
 * lookups — every input is already resolved by the caller.
 *
 * @domain settlements-npcs
 * @system npc-presentation-owner
 * @role Pure policy resolving which settlement (if any) may materialize a live/corpse `NpcAgent` presentation for a given `NpcId` right now.
 */

/** Inputs the policy needs — never re-derived internally, always resolved by
 *  the caller from its own already-in-scope registries. */
export type NpcPresentationOwnershipInput = {
  /** This `NpcId`'s procedural-origin settlement (`SettlementDef.id` the
   *  identity was generated from) — the fallback owner absent any override
   *  or active merchant journey. */
  sourceSettlementId: string
  /** Explicit current-residency override (`FoundedSettlementRegistry.
   *  residencyOf(npcId)`) — `undefined`/`null` means this npc keeps its
   *  ordinary procedural source-settlement interpretation. */
  residencyOverride?: string | null
  /** Current Travelling Merchant journey, if any — always wins over
   *  `residencyOverride` while active (a founder cannot simultaneously be a
   *  merchant journey, but the precedence is explicit regardless). */
  merchantJourney: MerchantJourneyState | null | undefined
}

export type NpcPresentationOwner =
  | { kind: 'settlement', settlementId: string }
  | { kind: 'none' }

/**
 * Resolve the current presentation owner for one `NpcId` (plan
 * settlements-021 Stage A). Pure — no registry/world access, safe to call
 * every time a caller is about to materialize a live/corpse presentation.
 *
 * Policy:
 * - merchant `visiting` → destination settlement;
 * - merchant `outbound`/`returning` → none (away, not yet/no longer present
 *   anywhere live);
 * - otherwise explicit residency override → that settlement;
 * - otherwise → source settlement (ordinary procedural resident).
 *
 * @domain settlements-npcs
 */
export function resolveNpcPresentationOwner(input: NpcPresentationOwnershipInput): NpcPresentationOwner {
  const journey = input.merchantJourney
  if (journey) {
    return journey.phase === 'visiting'
      ? { kind: 'settlement', settlementId: journey.destinationSettlementId }
      : { kind: 'none' }
  }
  const settlementId = input.residencyOverride ?? input.sourceSettlementId
  return { kind: 'settlement', settlementId }
}

/** `true` when `owner` grants `settlementId` the right to materialize this
 *  NPC's live/corpse presentation right now — the gate every call site
 *  applies before constructing a presentation, never after. */
export function shouldMaterializeNpcAt(owner: NpcPresentationOwner, settlementId: string): boolean {
  return owner.kind === 'settlement' && owner.settlementId === settlementId
}
