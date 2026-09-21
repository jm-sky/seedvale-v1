# Implementation Notes: Merchant wealth tiers and travel party profile

**Plan:** `settlements-npcs-049-merchant-wealth-tiers-and-travel-party-profile.md`  
**Reviewed:** 2026-09-21  
**Codebase:** `main`

## Current-code corrections

The plan's foundations are mostly current, but two seams need adjustment during implementation:

- `settlements-npcs-048` currently selects the highest-capacity eligible pack animal in `resolveMerchantPackAnimalCandidate()`; it has no kind preference input. Do not select an animal in 049 and bypass that owner. Extend `PackAnimalJourneyHooks.resolveCandidate(...)` / the livestock resolver with ordered preferred kinds while preserving 048 eligibility, detached-id safety, reservation and capacity ownership.
- Accompany execution is still player-specific. `NpcAccompanyTarget` only has `{ kind: 'player' }`, `startNpcAccompanyCommitment()` hardcodes it, `NpcAgent` retargets follow to `observerPos`, and `beginOffscreenTravelHandoff()` also assumes the player. NPC→NPC support therefore requires changing the full target-resolution path, not only the persisted union type.

The merchant journey commitment seam is real: `planTraderInterSettlementExport()` creates the `TransportOrder`, then `NpcAgent`'s `beginMerchantJourney` commits the pack reservation and writes `merchantJourney`. This is the correct place to make party formation transactional.

## Wealth resolver

Keep wealth derivation adjacent to `src/settlement/merchantTrade.ts`. Reconstruct the exact initial assortment from the same `MerchantAssortmentContext` + full settlement `MerchantProfile[]`; do not derive from `NpcAuthoritativeState.merchantStock`, which is mutable and seeded only once.

Use `offerValue()` from `items/tradeCatalog.ts` for the generated count map. The home starter overlay is part of the deterministic initial assortment today; calibration must deliberately include it when `context.isHome` is true rather than silently calibrating non-home contexts and producing a home-only wealth jump.

Do the calibration sweep as a test/dev fixture, then commit fixed per-size thresholds and a fixed premium promotion margin. Production resolution must remain O(merchant assortment), with no peer percentile/global scan. Record the chosen constants and sampled ranges in the test names/comments; implementation notes should not become a generated statistics dump.

Suggested API should accept already-resolved generation inputs rather than rediscovering settlement state:

```ts
resolveMerchantWealthTier({
  npcId,
  context,
  profiles,
}): MerchantWealthTier

resolveMerchantTravelProfile(...): MerchantTravelProfile
```

This avoids a second profile/specialization roll and makes deterministic tests straightforward.

## Pack-animal policy

049 should only add preference ordering to 048's existing authority. A useful shape is:

```ts
resolveCandidate(
  homeSettlementId,
  homeId,
  preferredKinds?: readonly ('donkey' | 'horse')[],
): PackAnimalCandidate | null
```

Within each preferred kind, retain 048's current deterministic capacity-desc / `animalId` tie-break. If no preferred kind is available, return `null`; the profile already encodes both supported kinds as ordered fallbacks, so silently choosing some unrelated pack-capable species would weaken the policy.

Do not change `MerchantJourneyState.packAnimalId` ownership or detached-livestock lifecycle.

## Actor-neutral accompany

Generalize the existing primitive, not Merchant code:

```ts
type NpcAccompanyTarget =
  | { kind: 'player' }
  | { kind: 'npc'; npcId: NpcId }

type NpcAccompanySourceRef =
  | { kind: 'voluntary' }
  | { kind: 'work-contract'; contractId: string }
  | { kind: 'world-party'; partyId: string }
```

`StartNpcAccompanyParams` must take an explicit target; existing player callers can pass `{ kind: 'player' }` (or a compatibility wrapper can preserve the old public call). Update clone/save validation together.

Do not put NPC lookup into the pure `npcAccompanyCommitment.ts`. Inject a narrow runtime target resolver into `NpcAgent`/resident construction, e.g. `resolveNpcPosition(npcId)`. Both detailed follow retargeting and stream-out handoff must use the same target semantics. Missing NPC target should not fall back to the player; keep/retry the commitment or end it only at an explicit lifecycle boundary.

Important limitation: current merchant presentation is absent during outbound/returning phases. Therefore an escort cannot reliably follow a live merchant position off-screen. 049 should persist the actor relation and use existing generic travel continuity only as far as it can do so without inventing a second merchant ETA. Do not fake detailed formation movement; `world-035` / `settlements-npcs-051` own regional party execution.

## Escort selection and ownership

Selection should be a pure bounded operation over the Merchant's home-settlement residents. Use real authoritative states and existing participation/work-contract checks; do not scan all NPC states globally. Candidate roles remain `guard`, then `hunter`, then stable `npcId`.

Reuse only the small role/suitability facts from `npc-030`; do not import paid-contract reward/social scoring into Merchant employment. Existing `npc-030` accompany semantics are useful, but Merchant escorts must use `world-party`, never a player Work Contract.

The authoritative active relation stays on each escort's `NpcAuthoritativeState.accompanyCommitment`. Prefer no `escortNpcIds` on `MerchantJourneyState` initially: matching `world-party.partyId` in the bounded home-settlement roster is sufficient for cleanup/reconciliation. Add an index only if implementation proves a lifecycle cannot be made atomic without it.

Use a stable party id derived from the one-active-journey invariant, e.g. `merchant-journey:<npcId>`. If a future journey-instance id is introduced elsewhere first, use that instead rather than creating another counter here.

## Journey transaction

The current order is created before `beginMerchantJourney`. Refactor that seam so side effects have explicit success/rollback semantics. Today `commitReservation()` returns `void`, so it cannot prove the candidate was actually detached. Change it to return success (the underlying detach operation already has meaningful success semantics) before treating the pack relation as committed.

Recommended sequence after a `TransportOrder` exists:

1. resolve profile/tier;
2. resolve optional pack candidate and escort candidates;
3. start escort `world-party` commitments;
4. commit optional pack reservation;
5. write `merchantJourney`;
6. if any required commit step fails, end only commitments created by this attempt, release/reclaim the pack relation if committed, and cancel/remove the newly-created order through its existing lifecycle API.

Optional absence of animal/escorts is not failure. A race/incompatibility discovered while committing a selected escort should simply reduce the party if policy allows it; do not leave an orphan commitment.

Return/death cleanup should be centralized around party id. On successful `resolveMerchantReturnArrival()`, end matching `world-party` commitments before residents resume normal scheduling. Merchant death needs the same cleanup from the existing death/lifecycle seam. Escort death should naturally clear that NPC's own commitment and must not trigger replacement.

## Persistence

No save field is needed for tier/profile. The new NPC target/source variants live inside already-persisted `NpcAuthoritativeState.accompanyCommitment`, so update:

- clone/snapshot logic in `npcAccompanyCommitment.ts` / `npcState.ts`;
- structural validation in `persistence/saveData.ts`;
- persistence round-trip tests.

A save-version bump is only necessary if current schema/migration conventions require it for widening the validated union; do not add a separate merchant-party save object.

## Tests worth adding

Focus on invariants rather than broad integration fixtures:

- merchant assortment sweep establishes fixed thresholds; home starter overlay included explicitly;
- mutable `merchantStock` depletion cannot affect tier;
- premium promotion remains bounded and size caps are enforced;
- 048 candidate resolution obeys donkey/horse preference while retaining eligibility/capacity/id ordering;
- NPC→Player accompany regressions unchanged; NPC→NPC clone/save/restore retains target id + `world-party`;
- missing NPC target never redirects an escort to the player;
- two selected escorts cannot exceed rich profile max and no synthetic NPC is created;
- journey-start rollback leaves no detached animal, orphan `world-party` commitment or dangling new order;
- return and Merchant death clear matching party commitments; escort death does not replace the escort.

Keep `settlements-npcs-051` threat sharing/combat cooperation and `world-035` route execution out of this implementation.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
