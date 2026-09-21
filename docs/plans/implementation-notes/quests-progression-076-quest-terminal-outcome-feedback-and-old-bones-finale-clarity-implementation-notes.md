# Implementation Notes: Quest terminal outcome feedback and Old Bones finale clarity

**Status:** `verification needed` 🔍 — implemented and automated-verified; browser/manual verification pending (user-performed).

## Recon findings

- `QuestManager.applyOutcome()` is the correct single terminal commit seam. Keep state mutation, journal/result recording, cleanup, reward grant and social consequences there; do not emit terminal presentation from dialogue callbacks or from Vue.
- `QuestListEntry` already exposes `state`, `resolvedOutcomeId` and resolved `resultText`. `QuestLogScreen.vue` currently consumes the DTO but does not render `resultText`; add the terminal result there without any `QuestDef` lookup. `questLogBuckets.ts` needs no behavior change.
- `resultPresentation()` in `QuestManager` is already the compatibility resolver for terminal copy (outcome `resolveResultText` / `resultText`, then legacy report/fail fallback). Reuse it for both the list DTO and immediate presentation so the two surfaces cannot disagree.
- The repo already has a shared Vue toast path (`vueUi.showToast(...)`) and a legacy gameplay `toast.show(...)` path. For this scope, prefer wiring the quest lifecycle hook at the composition root to the existing Vue notification surface rather than creating a quest-specific overlay. If the payload needs multiline/title/reward structure that the current toast contract cannot express cleanly, extend the shared notification DTO/surface minimally rather than introducing a second quest UI.
- `QuestLifecycleHooks` is the existing dependency-injection boundary from quest domain to runtime presentation/audio/world actions. Add the terminal presentation callback there (or an equivalently narrow injected hook), with no Vue import in `QuestManager`.

## Recommended contract

Define a quest-owned immutable presentation DTO, e.g. `QuestTerminalPresentation`, containing only:
- quest title;
- terminal state restricted to `complete | failed`;
- resolved presentation text;
- optional shown reward summary.

Build it inside `applyOutcome()` from the already-selected `QuestOutcome` and actual terminal state. Reward visibility must be decided here from `outcome.reward.visibility`; UI must never receive hidden reward data and decide whether to suppress it.

Emit only after the outcome has actually committed. The existing early/idempotency guards around resolution must therefore remain before emission. Restore/hydration must not traverse this emission path.

Do not use `promisedReward` for terminal feedback: its semantics are pre-resolution preview and `list()` intentionally clears it for resolved quests.

## Old Bones

Keep the existing exact-instance physical outcome pipeline unchanged. `oldBonesAdventureCave.ts` only needs authored finale copy/result clarity; do not alter outcome IDs, `physicalOutcomeId`, `requireItemInstanceId`, transfer hooks or relation gating.

Update tests around all three terminal choices rather than replacing current assertions. The important regression is that claimant B's spoken reply explicitly acknowledges receiving the signet and closes the conversation; `resultText` remains system narration, not NPC speech.

## Tests / traps

- In `QuestManager.test.ts`, test the lifecycle hook directly: one emission on a newly committed complete/failed outcome, none on duplicate/stale resolution, and no emission from construction/restore of terminal progress.
- Assert the emitted reward is the reward actually attached to the resolved outcome and only when `visibility === 'shown'`; do not infer it from inventory deltas.
- Keep consequence application and presentation independent. Do not expose raw `QuestConsequences` in the terminal DTO.
- For Quest Log UI, render a result block only for terminal entries when `resultText` is non-empty. State labeling can be UI mapping from the already-present `QuestState`; outcome IDs must remain opaque.
- Existing completion sound / `playQuestVoice` behavior is orthogonal; do not move or deduplicate it as part of this fix.
- Because the work crosses quest lifecycle + composition + Vue presentation, keep the implementation focused; no notification-system refactor unless the existing shared toast contract demonstrably cannot represent the required payload.

## Implemented

- `QuestTerminalPresentation` + `QuestLifecycleHooks.onTerminalOutcome` from `applyOutcome()` after a real complete/failed commit.
- Shared Vue toast via `formatQuestTerminalToast` (multiline toast stack); no quest-specific overlay and no hidden rewards in the payload.
- Quest Log details show `resultText` for complete/failed/abandoned through `questLogTerminalResultText`.
- Old Bones A/B/keep finale copy updated; physical transfer, outcome IDs and relation gating unchanged.

## Relevant code

`src/quests/QuestManager.ts` — `QuestLifecycleHooks`, `QuestListEntry`, `resultPresentation()`, `applyOutcome()`  
`src/quests/quests.ts` — `QuestOutcome` / `QuestReward` visibility contract  
`src/quests/oldBonesAdventureCave.ts` — authored A/B/keep outcomes and finale copy  
`src/app/createApp.ts` — lifecycle hook → UI composition seam; existing toast usage  
`src/ui-vue/store.ts` — shared Vue toast API/state  
`src/ui-vue/screens/QuestLogScreen.vue` — terminal details rendering  
`src/quests/QuestManager.test.ts`, `src/quests/oldBonesAdventureCave.test.ts` — primary regression coverage
