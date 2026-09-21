# Implementation notes: quests-progression-079 lost treasure expedition external sponsor flow

**Reviewed:** 2026-09-21  
**Plan:** `docs/plans/quests-progression-079-lost-treasure-expedition-external-sponsor-flow.md`  
**Baseline:** current `main` recon on 2026-09-21

## Current-code discrepancies that matter

- `selectLostTreasureExpeditionNpcs()` currently does the opposite of the new story contract: sponsor is selected from **home** adults (trader → miner → first adult), while the stakeholder may spill into a neighboring settlement. Reverse those ownership rules rather than patching dialogue around them.
- Stage 0 currently talks to that sponsor and immediately reveals/navigates to the dungeon. The new flow needs sponsor → local stakeholder → reveal; the physical four-container sequence can remain unchanged after that.
- `worldBundle.ts` already computes the exact bounded definition pool needed here via `nearbyRpgSettlementDefs(homeDef, peekDef)`, but currently flattens it to `Map<settlementId, NPC[]>` before resolving this binding. Preserve/pass the neighboring `SettlementDef` metadata needed for size/name/x/z instead of adding another lookup.
- `createApp.ts` independently reconstructs the same `neighborDefs` for quest materialization. Use the binding's explicit sponsor-settlement identity to select presentation metadata there; do not infer sponsor settlement from a live/streamed NPC.

## Binding shape and selection

Extend `LostTreasureExpeditionBinding` with explicit sponsor-settlement identity. The useful minimum is `sponsorSettlementId`; name/x/z can be looked up from the same deterministic definition pool at materialization time. Keep `settlementId` as the story/home settlement.

Change the resolver input from the NPC-only neighbor map to definition-backed candidates (or a small quest-owned ref containing `id/name/x/z/size/npcs`). Reuse:
- `nearbyRpgSettlementDefs()` for the bounded, stream-independent pool;
- `settlementOpportunityNpcsFromDef()` for stable NPC + household identity;
- the canonical village-size ordering from `settlement/families.ts` rather than comparing strings. `rolledVillageSizeRank()` exists for normal sizes; handle `OUTPOST` explicitly as below-normal rather than casting it to `RolledVillageSize`.

Sponsor ordering should be deterministic: external settlements only; first consider trader-bearing settlements larger than home, then trader-bearing external settlements, then external adults. Within each tier keep nearby-def order (already distance + id deterministic) and stable NPC order/id as tie-breaker. Do not fall back to a home sponsor: if the bounded pool contains no external adult, the quest should be unavailable rather than violating the external-sponsor premise.

For the local stakeholder, exclude Kasia's **household**, not her surname and not the sponsor household. Home generation has a stable reserved roster: Kasia is the third flattened home member (`settlementNpcId(homeDef.id, 2)`) in reserved family #1. Resolve that stable id against `settlementOpportunityNpcsFromDef(homeDef)`, take its `householdId`, then choose another adult home resident outside it. If the reserved identity is unexpectedly absent, fall back deterministically to an adult from a different household and keep relationship-neutral copy. Do not identify Kasia by display name.

## Quest-id compatibility is the main persistence trap

Current `lostTreasureExpeditionQuestId()` embeds the selected sponsor and optional stakeholder ids. Simply switching to the new external sponsor changes the quest id and strands accepted/completed save progress.

Preserve the existing id contract deliberately. Before replacing the selector, isolate the old home-sponsor/home-first-stakeholder selection as a legacy **identity-only** calculation and continue composing `questId` from those legacy ids + the unchanged home settlement/cave identity. The runtime binding may then carry the new external `sponsorNpcId` / local `stakeholderNpcId` while retaining the old quest id. Do not persist the new binding just to solve this.

Add a regression fixture proving that the same world/home NPC/cave inputs produce the pre-079 quest id while the operational sponsor is external. This is safer than changing save schema or trying to discover old progress inside `WorldBundle`, which currently resolves the binding before `createApp.ts` materializes `initialSave.quests`.

Keep persisted outcome ids unchanged, especially `journal_to_family`; only rename local constants/types or player-facing wording.

## Direction and discoverability

There is already a shared 8-way helper: `src/quests/cardinalDirection.ts::cardinalSector()` / `cardinalDirectionPhrase()`. Do not add another compass utility. For the requested compact `(NE)` objective form, use `cardinalSector(sponsor.x - home.x, sponsor.z - home.z)`; for prose use `cardinalDirectionPhrase()`.

Do not reveal the dungeon in the sponsor conversation. The local stakeholder stage owns the existing `reveal_location` + `setNavigation: true` effect. The sponsor travel objective must include sponsor name + real settlement name + derived direction before the player leaves home. Existing settlement knowledge/navigation should only be invoked if the current quest API already has a suitable effect; do not add quest-owned coordinates/markers merely for this fix. Name + direction is sufficient discoverability under this plan.

## Quest-definition flow

Keep `buildLostTreasureExpeditionQuest()` contextual and pure. Pass it sponsor settlement presentation data (or a small resolved presentation ref) from `createApp.ts`; it already has `homeDef`, `neighborDefs`, and `cardinalDirection` helpers available.

Recommended stage prefix:
1. external-sponsor lead/objective text that names sponsor + settlement + sector;
2. `talk_to_npc` external sponsor — commission/background, then explicitly sends player back/to the local stakeholder;
3. `talk_to_npc` local stakeholder — genuinely new local clue and the existing dungeon `reveal_location` effect;
4. existing camp → journal pack → evidence → final treasure stages unchanged;
5. existing terminal `await_quest_outcome` and exact-journal actions unchanged.

The quest offer itself is currently attached to `QuestDef.giver`; ensure the giver is the local introduction/stakeholder (or another home-local entry point already supported by `QuestDef`), not the external sponsor, otherwise the discoverability fix is self-defeating. Avoid an extra stage if the offer line itself can carry step 1 cleanly.

Replace `Krewny`, `familyWarmth` and player-facing family/kinship copy with stakeholder/contact wording. The terminal physical outcome constant may retain its legacy `...FAMILY...` name/value for compatibility.

## Lifecycle / transfer guardrail

The terminal journal transfer in `createApp.ts::physicalOutcomeResolver` resolves recipients through `settlementsManager.getNpcState(npcId)`. Verify during implementation that an external sponsor has authoritative NPC state even while their settlement is unloaded; if `getNpcState` only resolves loaded residents, use the existing definition/state-registry materialization seam rather than weakening the terminal check or requiring the settlement to be streamed. Do not move inventory mutation into the quest definition.

Cave claims, generated containers, journal instance id, dungeon selection and pre-loot catch-up are unrelated and should remain untouched.

## Focused verification

Prioritize tests for:
- external larger-trader → external trader fallback → external-adult fallback ordering;
- no external adult => no binding;
- Kasia-household exclusion by stable identity;
- legacy quest-id equality despite new role ids;
- sponsor objective contains real settlement name + `cardinalSector`;
- reveal/navigation effect moved to stakeholder conversation;
- no unsupported kinship wording;
- terminal legacy outcome ids and exact journal transfer still work with the external sponsor id.

The existing 027 tests around cave claims/container ordering should not be rewritten except where binding fixtures need the new settlement metadata.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
