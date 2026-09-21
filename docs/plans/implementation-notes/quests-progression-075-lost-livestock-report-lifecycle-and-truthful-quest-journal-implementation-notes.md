# Implementation Notes: quests-progression-075 — Lost livestock report lifecycle and truthful quest journal

**Prepared:** 2026-09-21  
**Plan:** `quests-progression-075-lost-livestock-report-lifecycle-and-truthful-quest-journal.md`  
**Status:** `verification needed` 🔍 — implemented and automated-verified; browser/manual verification pending (user-performed).

## Current code findings

The bug is confirmed on current `main`.

- `QuestManager.pollLostLivestockSources()` directly calls `applyOutcome()` for `returned`, `corpse-inspected` and `unavailable`.
- `applyOutcome()` always appends `result` with `speakerNpcId: def.giver.npcId`, so world-driven resolution is recorded as giver speech.
- `projectNotes()` has the same issue for legacy terminal progress without a persisted result event: its synthetic fallback uses `def.giverName`.
- `materializeLostLivestockQuest()` already has the right objective, stable outcome IDs and report copy; fauna ownership/snapshot plumbing does not need redesign.

Important correction to the plan: the existing generic report path cannot be reused unchanged. `reportOverride()` returns null unless `uniqueOutcomeForState(def, 'complete')` succeeds. Lost livestock has **two complete outcomes** (`live_return`, `dead_confirmed`), so merely reaching `ready_to_report` would expose no report action.

## Recommended implementation

### Persist pending report intent, not fauna state

Add one small generic optional field to persisted quest progress, e.g. `pendingReportOutcomeId?: QuestOutcomeId`.

```text
returned         -> pendingReportOutcomeId=live_return
corpse-inspected -> pendingReportOutcomeId=dead_confirmed
                   complete recover_lost_livestock
                   -> ready_to_report
```

This is quest lifecycle intent, not a copy of fauna state. Do not persist `returned` / `corpse-inspected` snapshots in the quest.

Preserve the field through runtime/export/restore and clear it on terminal resolution/reset. Prefer an optional field without a save-version migration unless current save validation requires an explicit allowance. Do not use `resolvedOutcomeId`: its current documented contract is terminal-only.

### Complete through the normal objective/stage pipeline

For `returned` / `corpse-inspected`, `pollLostLivestockSources()` should:

1. require `active`;
2. find the unfinished `recover_lost_livestock` slot for the exact animal;
3. capture the pending report outcome;
4. call existing `completeObjectiveSlot()` / `advanceStage()`.

Do not manually set `ready_to_report`. This preserves stage hooks and journal dedupe.

The stage `progressLine` is player/world knowledge, so leave it speakerless. Repeated polling in `ready_to_report` must not overwrite the captured branch if fauna state changes later.

### Make report resolution branch-aware

Extend `reportOverride()` narrowly:

- use `pendingReportOutcomeId` when present;
- otherwise retain today's unique-complete-outcome path;
- validate the pending id against `def.outcomes`;
- callback must re-read live quest state/pending id rather than capture a stale branch.

The report action then calls the same `applyOutcome()` exact-once pipeline. Do **not** choose `live_return` vs `dead_confirmed` from the live fauna snapshot at report time.

Lost-livestock spoken reply should distinguish live return from confirmed death. Use the smallest existing outcome/report presentation seam; do not add another dialogue FSM.

### Fix journal provenance at the write boundary

Do not patch `QuestLogScreen.vue`.

`applyOutcome()` currently conflates terminal state with spoken dialogue. Add explicit result-journal provenance/speaker. A terminal transition caused by the world must be speakerless; dialogue call-sites explicitly pass the NPC who actually spoke.

At minimum:

- giver report / `talk_to_npc_choice` / explicit NPC resolution → real NPC speaker;
- `pollWorldDrivenSources()`, lost-livestock `unavailable`, unavailable world knowledge and other automatic world resolution → no `speakerNpcId`.

Avoid inferring speech from `def.giver`.

Also change `projectNotes()`'s terminal fallback without a recorded result event to `QUEST_JOURNAL_OBSERVATION_SPEAKER`; otherwise older saves can still fabricate giver speech.

Stage dialogue actions already stamp their actual NPC line as `progress` before some terminal resolutions. Avoid creating a second fake NPC result line just because `applyOutcome()` follows.

## Files / systems to reuse

- `src/quests/QuestManager.ts`: `completeObjectiveSlot()`, `advanceStage()`, `reportOverride()`, `applyOutcome()`, journal projection.
- `src/quests/quests.ts`: `QuestProgressEntry` persistence contract and `QuestJournalEvent`.
- `src/quests/opportunities/worldQuestMaterialization.ts`: keep `recover_lost_livestock` and existing outcome IDs.
- `src/quests/opportunities/settlementQuestOpportunities.ts` / `worldQuestOpportunityTypes.ts`: current typed fauna snapshot is already sufficient; change only if implementation exposes a real type-level need.
- Existing fauna stray/corpse state remains authoritative and unchanged.

Do not overload `observation`; it is currently a typed habitat-pressure observation with different semantics. Do not encode an outcome id into `stageCount` or `stageSlotProgress`.

## Persistence invariant

```text
corpse-inspected -> ready_to_report -> save -> reload -> report
```

must still resolve `dead_confirmed` even if the fauna snapshot changes before conversation. Older terminal saves remain terminal. Older non-terminal saves without pending intent must not invent a branch.

## Tests

Focus `QuestManager.test.ts` on:

- `corpse-inspected` → objective complete + `ready_to_report`, pending `dead_confirmed`, no terminal consequences/result;
- `returned` → same with pending `live_return`;
- report action exists despite two complete outcomes and resolves the captured branch exactly once;
- snapshot changing after discovery does not change the pending branch;
- export/restore between discovery and report preserves branch;
- repeated poll in `ready_to_report` does not duplicate progress or mutate branch;
- `unavailable` remains automatic failure but its result note is speakerless;
- generic world-driven automatic outcome is speakerless;
- real report / talk-choice result still records the actual NPC speaker;
- legacy terminal state without result event projects result as observation.

Update the existing lost-livestock regression test that currently expects immediate `complete`.

## Guardrails

- Keep `applyOutcome()` as the single exact-once reward/consequence terminal pipeline.
- Do not modify fauna stray/corpse lifecycle or ownership.
- Do not derive pending branch from live fauna at report time.
- Do not create a lost-livestock-specific FSM.
- Current code wins if it differs from the plan/notes.
- Do not run browser verification; User performs it manually.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
