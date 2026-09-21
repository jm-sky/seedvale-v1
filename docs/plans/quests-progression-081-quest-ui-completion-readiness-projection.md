# Plan: Quest/UI — Completion Readiness Projection

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~quests-progression-075~~, ~~ui-input-037~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `quest-ui` `journal` `ready-to-report` `dialogue`
**Roadmap:** -
**Model:** Composer, Sonnet

## Goal

Make Quest Log's **Do oddania** classification mean the same thing as the quest layer's existing giver `✓` / dialogue `report` classification:

> the quest's giver has a real completion / hand-in / report action available **now**.

Keep `QuestState` as lifecycle authority. Completion readiness is a derived read-model property, not another persisted state.

## Confirmed problem

Current code already has one authoritative read-only predicate:

`QuestManager.hasGiverCompletionActionNow(def, npcId)`

It returns true for the giver when any of these is currently actionable:

1. lifecycle state is `ready_to_report`;
2. an active `gather_item` slot has the required inventory and a valid completion path;
3. an authored repair gather can use the existing `already_repaired` completion action because the canonical world structure is already intact.

The same predicate already drives:

- `QuestManager.labelMarker()` → `QUEST_MARKER_READY` (`✓`);
- `QuestManager.classifyNpcDialoguePreview()` → `QuestDialoguePreviewKind = 'report'`;
- therefore root dialogue shortcuts / **Aktywne zadania** use the same semantics.

But `QuestManager.list()` exposes only lifecycle `state`, and `projectQuestLog()` currently puts only `state === 'ready_to_report'` in **Do oddania**.

Result:

```
active gather + player owns required items
→ giver marker ✓
→ dialogue preview kind = report
→ real hand-in action exists
→ Quest Log still shows Aktywne
```

The same mismatch exists for the authored `already_repaired` path.

## Architecture decision

### Lifecycle state stays unchanged

Do **not** promote active gather/repair quests to `ready_to_report`.

Those quests are legitimately still `active`: their current objective is resolved only when the player deliberately performs the giver action.

`ready_to_report` remains the lifecycle state used by quests whose objective sequence has already advanced to a reporting phase.

### Add one derived list/read-model property

Extend `QuestListEntry` with a required boolean:

```ts
readyToTurnIn: boolean
```

Semantics:

```
readyToTurnIn ===
  giver currently has a completion / hand-in / report action available now
```

In `QuestManager.list()`, derive it exclusively through the same quest-layer predicate already used by marker/dialogue:

```
this.hasGiverCompletionActionNow(def, def.giver.npcId)
```

Do not reimplement gather, repair or report checks inside `list()`.

Add JSDoc making explicit that:

- the field is derived and non-persisted;
- it does not replace `QuestState`;
- it is the Quest Log projection of the same giver-completion semantics used by marker/dialogue;
- callers must obtain a fresh `list()` projection when live inventory/world state may have changed.

## Quest Log projection

Update `src/ui-vue/lib/questLogBuckets.ts`.

Keep top-level bucket semantics unchanged:

- `active` and `ready_to_report` → `current`;
- `offered` → `offers`;
- terminal states → `history`;
- `not_offered` hidden.

Inside the current bucket:

```
entry.readyToTurnIn === true
→ currentReadyToReport / "Do oddania"

otherwise active
→ currentActive / "Aktywne"
```

A lifecycle `ready_to_report` entry must always be emitted by `QuestManager.list()` with `readyToTurnIn: true`; tests should protect that invariant.

The two current subsections remain exclusive and their combined count remains the `Bieżące` count.

## Quest Log presentation

`QuestLogScreen.vue` already renders **Do oddania** cards with:

- `DO ODDANIA`;
- `Wróć do: <giverName>`.

Reuse that presentation unchanged for both:

- lifecycle `ready_to_report`;
- lifecycle `active` but `readyToTurnIn === true`.

For details/header state copy, avoid showing an active-but-ready entry as merely `aktywny` while the list says `DO ODDANIA`.

Use a small presentation helper/computed rule based on `QuestListEntry.readyToTurnIn` so current ready entries display `do oddania`; do not change the underlying `entry.state`.

Do not add quest-specific checks to Vue.

## Existing mechanisms to reuse

### Quest semantics — authoritative

`src/quests/QuestManager.ts`:

- `QuestListEntry`
- `QuestManager.list()`
- `QuestManager.hasGiverCompletionActionNow()`
- `QuestManager.gatherHandInSlot()`
- `QuestManager.alreadyRepairedGatherAction()`
- `QuestManager.labelMarker()`
- `QuestManager.classifyNpcDialoguePreview()`
- `QuestManager.previewNpcDialogue()`

The implementation should not alter `hasGiverCompletionActionNow()` unless a test exposes an existing inconsistency between that predicate and the real giver action.

### UI projection

- `src/ui-vue/lib/questLogBuckets.ts::projectQuestLog()`
- `src/ui-vue/screens/QuestLogScreen.vue`

### Current refresh boundary

`src/app/createApp.ts::openQuestLog()` calls:

```
questManager.list()
→ questLog.refresh(...)
```

The Quest Log is currently a snapshot refreshed on open. This plan does **not** introduce a new reactive subscription or per-frame quest-log refresh mechanism.

The fix must ensure every fresh `QuestManager.list()` reflects current inventory/world readiness.

## Implementation

### 1. Extend the quest read model

In `src/quests/QuestManager.ts`:

- add required `readyToTurnIn: boolean` to `QuestListEntry`;
- document the derived semantics;
- populate it in `list()` through `hasGiverCompletionActionNow(def, def.giver.npcId)`.

No persistence/schema changes.

### 2. Classify current Quest Log entries by readiness

In `src/ui-vue/lib/questLogBuckets.ts`:

- use `entry.readyToTurnIn` for `currentReadyToReport`;
- keep non-ready `active` entries in `currentActive`;
- do not make `questLogBucket()` aware of inventory/world details; it remains lifecycle-to-top-level-tab mapping.

Prefer renaming comments only if needed for accuracy; avoid unnecessary public type churn.

### 3. Keep visible status copy coherent

In `QuestLogScreen.vue`:

- derive the player-facing current status label from the entry;
- `readyToTurnIn` takes presentation precedence over the raw `active` label;
- terminal/offered labels continue to use lifecycle `state`.

Do not introduce another readiness heuristic.

### 4. Add focused regressions

#### QuestManager tests

In `src/quests/QuestManager.test.ts` cover:

1. normal `ready_to_report`:
   - `list().readyToTurnIn === true`;
   - marker remains `✓`;
   - preview remains `report`.

2. active gather without enough inventory:
   - state remains `active`;
   - `readyToTurnIn === false`.

3. same active gather after inventory obtains the required count:
   - state still `active`;
   - a fresh `list()` returns `readyToTurnIn === true`;
   - marker is `✓`;
   - preview kind is `report`;
   - proving no QuestState mutation is required for readiness.

4. authored repair target already intact:
   - state remains `active`;
   - `readyToTurnIn === true`;
   - marker/dialogue completion action agrees.

5. ordinary active reminder / foreign required-talk target:
   - `readyToTurnIn === false`;
   - required action at another NPC must not make the giver-facing Quest Log entry look ready to turn in.

Reuse existing test fixtures around gather marker/actionability and authored starter repairs rather than inventing a second fake semantics layer.

#### Quest Log projection tests

Update `src/ui-vue/lib/questLogBuckets.test.ts` fixtures to include `readyToTurnIn`.

Protect:

1. `active + readyToTurnIn=true` goes to `currentReadyToReport`;
2. `active + false` goes to `currentActive`;
3. `ready_to_report + true` goes to `currentReadyToReport`;
4. current subsections are exclusive;
5. current count remains their sum;
6. offers/history/not_offered behavior is unchanged.

## Relevant files

Primary:

- `src/quests/QuestManager.ts`
- `src/quests/QuestManager.test.ts`
- `src/ui-vue/lib/questLogBuckets.ts`
- `src/ui-vue/lib/questLogBuckets.test.ts`
- `src/ui-vue/screens/QuestLogScreen.vue`

Read-only / integration reference:

- `src/app/createApp.ts::openQuestLog()`
- `src/ui/createQuestLog.ts`
- `src/ui-vue/store.ts`
- `docs/plans/quests-progression-055-quest-marker-lifecycle-and-actionability-fixes.md`
- `docs/plans/ui-input-036-quest-dialogue-offer-active-context-separation.md`
- `docs/plans/ui-input-037-quest-log-ready-to-report-sections.md`

## Guardrails

- No new `QuestState`.
- Do not mutate `active -> ready_to_report` merely because gather inventory or repair world state makes a giver action available.
- No persisted readiness field and no save migration.
- No quest-id-specific UI logic.
- Vue must not call inventory, structure or quest objective predicates directly.
- Marker, dialogue preview and Quest Log must share `hasGiverCompletionActionNow()` semantics, not three implementations.
- Execution paths (`selectGatherTurnIn`, report resolution, already-repaired acknowledgement) continue to revalidate live state.
- Do not broaden into general Quest Log live-reactivity or polling.
- Do not modify offer/history lifecycle semantics.
- No unrelated QuestManager refactor.
- Browser/manual verification is User-owned.

## Verification

Automated:

- focused `QuestManager.test.ts` cases above;
- `questLogBuckets.test.ts`;
- `npx tsc --noEmit`;
- relevant test suite / `pnpm run test` according to normal implementation workflow.

Manual browser verification — User:

1. Active gather quest, insufficient items → appears under **Aktywne**.
2. Acquire enough items, reopen Quest Log → moves to **Do oddania**, while underlying lifecycle is still `active`.
3. Giver shows `✓`; entering dialogue exposes the hand-in action.
4. Authored repair completed directly in world before material hand-in → reopen Quest Log → **Do oddania** and giver `✓`.
5. Ordinary active / required-talk-at-another-NPC quests stay under **Aktywne**.
6. Standard `ready_to_report` quest still appears under **Do oddania** and behaves unchanged after report.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
