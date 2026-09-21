# Implementation Notes: Quest stage reconciliation for pre-existing world state

## Recon findings

- `QuestManager.catchUpActiveWorldObjectives()` already has the correct authority boundary: it queries `worldProgress`, `settlementLight` and `Inventory` through `isWorldObjectiveSatisfied()`. Do not add historical flags to quest progress.
- Catch-up currently runs on restore, quest acceptance, explicit world-progression polling, `onReadItem()`, and inventory changes for `own_item_instance`. The actual gap is stage entry: `completeObjectiveSlot() -> advanceStage()` does not reconcile the newly active stage.
- Do **not** simply call `catchUpActiveWorldObjectives()` recursively from `advanceStage()`. Catch-up itself calls `completeObjectiveSlot() -> advanceStage()`; a `toStageId` cycle could recurse before the current `seen` guard can help. Use one re-entrancy-safe reconciliation boundary (e.g. per-quest guard around an iterative reconciler, or raw transition + outer reconciler).
- The current `seen: Set<stageIndex>` guard is also too coarse for the proposed Old Bones `all` stage. After one state-backed slot is marked complete, the quest can remain on the same stage with another satisfiable slot; the current loop then stops because the stage index was already seen. Cycle detection must include progress state (for example stage index + unfinished slot ids) or use a strict bounded iteration count tied to stage/slot count.
- `advanceStage()` is the correct central seam because both linear transitions and authored `toStageId` jumps pass through it. Preserve `onStageAdvanced`, animal-target binding, effects, and existing journal behavior exactly once per cleared stage.

## Old Bones

- The remains container exists before acceptance and `createApp.ts` already defines its authoritative loot fact as absence of the exact `signetInstanceId` from that container. Player possession is independently authoritative through `inventory.getInstance(binding.signetInstanceId)`.
- Change the acquisition stage in `buildOldBonesAdventureCaveQuest()` to an `all` stage containing:
  - `loot_world_container(binding.containerId)`;
  - `own_item_instance(binding.signetInstanceId)`.
  This prevents “removed from remains” from being treated as equivalent to “Player currently carries the signet”, while reusing existing objective types and exact identity.
- This composition makes the same-stage reconciliation issue above non-optional: both already-true slots must be consumable in one reconciliation pass.
- Keep claimant B as a real later `talk_to_npc` stage. Reconciliation must stop there even if every world fact is already true.
- Final claimant actions already gate on `requireItemInstanceId`, and `createApp.ts`'s `physicalOutcomeResolver` rechecks the exact instance plus recipient capacity/death before transfer. Reuse this; do not move physical transfer logic into quest reconciliation.

## Dialogue decision

- Current `QuestDialogueReactionCondition` is intentionally social-only (relation/reputation), and `requireItemInstanceId` gates authored stage `dialogueActions`; primary `talk_to_npc` has only one static `progressLine`. Therefore the plan's “already found” claimant-A line cannot be implemented with today's reaction API without changing semantics.
- Prefer a **narrow generic primary-talk text variant keyed by exact item-instance possession**, resolved by `QuestManager` at action selection time from `Inventory`. Keep it presentation-only: selecting the talk action still completes the same `talk_to_npc` slot, then normal stage-entry reconciliation advances the acquisition stage if its facts are true.
- Avoid widening social `QuestDialogueReactionCondition` just for this case, and avoid Old Bones checks inside `QuestManager`. Also avoid using a second `dialogueAction` alongside the primary talk unless the primary action can be suppressed; otherwise the UI would expose contradictory choices simultaneously.
- Journal the line actually selected/resolved for the claimant conversation. Automatic reconciliation of the following loot/ownership stage must have no `speakerNpcId`; `progressSpeakerNpcId()` already returns an NPC only for `talk_to_npc`.

## Journal/lifecycle pitfall

`completeObjectiveSlot()` defaults `speakerNpcId` through `progressSpeakerNpcId(slot)`. State-backed slots therefore naturally journal as the observation speaker. Preserve that. Do not carry the preceding talk's speaker through reconciliation, and do not use `skipProgressJournal` globally: world-state catch-up may still record the stage's authored observation line.

## Tests worth adding

- In `QuestManager.test.ts`, cover stage-entry catch-up, two consecutive state-backed stages, an `all` stage with two already-satisfied world-backed slots, and a `toStageId` cycle/loop guard. Assert the next action-driven talk remains active.
- Add a journal assertion that the talk stage is NPC-attributed while the auto-reconciled world stage is not.
- In `oldBonesAdventureCave.test.ts`, construct the real `all` acquisition stage and verify: pre-looted + exact signet owned catches up; pre-looted without exact possession stops; ordinary in-order acquisition still works; claimant B is never auto-completed.
- For the already-found dialogue, assert the variant is chosen from live inventory at `onSelect` time, not from state captured when the menu was opened.

## Scope guard

No changes are needed to world generation, remains spawning, `WorldGeneratedContainers`, persistence shape, or the Old Bones physical outcome resolver unless tests expose a separate defect. The implementation should stay centered on `QuestManager.ts`, `quests.ts`, `oldBonesAdventureCave.ts` and their tests.
