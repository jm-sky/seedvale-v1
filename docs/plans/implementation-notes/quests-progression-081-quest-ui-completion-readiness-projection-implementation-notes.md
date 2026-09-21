# Implementation notes: quests-progression-081 — Quest/UI Completion Readiness Projection

## Recon baseline

Verified against `main` at `689652f71d89f4bce64ba03f0acdc8fe555482aa`.

The bug is a projection mismatch, not a missing quest lifecycle state.

## Authoritative quest semantics

### `src/quests/QuestManager.ts`

`QuestListEntry` currently exposes lifecycle `state` but no derived giver-completion readiness.

`QuestManager.hasGiverCompletionActionNow(def, npcId)` is already the canonical read-only predicate needed by this plan.

Current logic:

- rejects non-giver NPCs;
- returns true for `state === 'ready_to_report'`;
- returns true when `alreadyRepairedGatherAction(def)` exists;
- otherwise returns whether `gatherHandInSlot(def)` exists.

Do not copy those conditions into `list()` or Vue. Add the DTO field using:

```ts
readyToTurnIn: this.hasGiverCompletionActionNow(def, def.giver.npcId)
```

### Why lifecycle must remain `active`

`gatherHandInSlot(def)` can become true solely because Player Inventory changed. No quest transition is required.

The existing regression `shows ✓ for an active gather hand-in and outranks a simultaneous new offer` proves:

```
QuestState = active
inventory gains required items
QuestManager is not mutated by inventory.add(...)
labelMarker(giver) = ✓
```

`notifyInventoryChanged()` only marks quest presentation dirty for marker synchronization; it does not change lifecycle state.

That is exactly the semantic the Quest Log should project.

### Authored repair path

`alreadyRepairedGatherAction(def)` reads the injected:

`lifecycleHooks.isAuthoredRepairTargetIntact(def.id)`

and verifies:

- an `ALREADY_REPAIRED_OUTCOME_ID` complete outcome exists;
- quest is still `active`;
- there is an unfinished `gather_item` slot.

This is already the same real action `collectGiverActions()` exposes. Reuse it only through `hasGiverCompletionActionNow()`.

### Marker/dialogue consistency already exists

`labelMarker(npcId)` reduces quest contexts with:

`?` required action > `✓` giver completion > `!` offer > `…` active reminder.

Its `✓` path calls `hasGiverCompletionActionNow()`.

`classifyNpcDialoguePreview(def, npcId, exposable)` also calls `hasGiverCompletionActionNow()` first and emits `kind: 'report'`.

Therefore the new list field should be a projection of that predicate, not a new classification helper.

## Quest Log projection

### `src/ui-vue/lib/questLogBuckets.ts`

Current top-level `questLogBucket(state)` is correct and should stay state-only:

- `active` / `ready_to_report` => current;
- `offered` => offers;
- terminal => history;
- `not_offered` hidden.

Only the current subsection split is wrong:

```ts
if (entry.state === 'ready_to_report') currentReadyToReport.push(entry)
else if (entry.state === 'active') currentActive.push(entry)
```

Change subsection classification to the derived field.

Suggested shape:

```ts
if (bucket === 'current') {
  if (entry.readyToTurnIn) currentReadyToReport.push(entry)
  else currentActive.push(entry)
}
```

Because the top-level bucket already proves the entry is `active | ready_to_report`, this stays bounded.

Keep the existing current sorting and count semantics.

## Quest Log presentation

### `src/ui-vue/screens/QuestLogScreen.vue`

The **Do oddania** card already renders the desired presentation and does not inspect objective types.

One remaining inconsistency after bucket migration would be the details/header label:

```vue
STATE_LABEL[selectedEntry.state]
```

For an active gather/repair entry moved into **Do oddania**, this would still read `aktywny`.

Use a tiny presentation helper based on the DTO, e.g. semantically:

```ts
function entryStateLabel(entry: QuestListEntry): string {
  return entry.readyToTurnIn ? 'do oddania' : STATE_LABEL[entry.state]
}
```

Use it anywhere the Quest Log displays the user-facing state label.

Do not mutate `STATE_LABEL`, because `active` is still the real lifecycle value.

## Refresh/lifecycle boundary

### `src/app/createApp.ts::openQuestLog()`

Current flow:

```
questLog.open()
questLog.refresh(questManager.list(), relationLookup)
```

### `src/ui/createQuestLog.ts` / `src/ui-vue/store.ts`

The entries are copied into the UI store when opened/refreshed. There is no live subscription to inventory/world changes while the screen remains open.

Do not change this in 081.

A fresh open already calls a fresh `QuestManager.list()`, which is sufficient for the intended fix and avoids introducing polling/reactive quest ownership into Vue.

## Tests to extend, not reinvent

### `src/quests/QuestManager.test.ts`

Existing nearby coverage already proves most semantic pieces:

- marker reduction for normal `ready_to_report`;
- `shows ✓ for an active gather hand-in and outranks a simultaneous new offer`;
- `keeps ordinary active reminder as … when no hand-in is ready`;
- `previewNpcDialogue` test:
  - `returns report for ready_to_report and agrees with labelMarker ✓`;
  - `classifies an active gather hand-in as report while state stays active`.

Extend those scenarios with assertions against `qm.list().find(...).readyToTurnIn` rather than duplicating full fixtures.

For authored-repair readiness, reuse the existing starter-repair / `isAuthoredRepairTargetIntact` fixture if available in the same test file. The important assertion is:

```
state === active
readyToTurnIn === true
labelMarker(giver) === ✓
real giver action exists
```

Also add one negative assertion for a foreign `required-action`: a quest may produce `?` at a target NPC while its own list entry remains `readyToTurnIn === false`.

### `src/ui-vue/lib/questLogBuckets.test.ts`

The local `entry()` factory constructs `QuestListEntry` manually, so adding a required DTO field will require updating it.

Prefer:

```ts
function entry(id, state, readyToTurnIn = state === 'ready_to_report')
```

Then add one explicit `active + true` case.

This keeps legacy test intent readable while protecting the new invariant.

## Expected files changed by implementation

Primary:

- `src/quests/QuestManager.ts`
- `src/quests/QuestManager.test.ts`
- `src/ui-vue/lib/questLogBuckets.ts`
- `src/ui-vue/lib/questLogBuckets.test.ts`
- `src/ui-vue/screens/QuestLogScreen.vue`

No expected changes:

- `src/quests/quests.ts`
- persistence/save schema
- `src/app/createApp.ts`
- `src/ui-vue/store.ts`
- marker sync integration

If implementation needs one of those, re-check whether scope is drifting.

## Pitfalls

- Do not rename `ready_to_report` or reinterpret it as UI-only.
- Do not set active gather quests to `ready_to_report` just to satisfy the Quest Log.
- Do not call `previewNpcDialogue()` from `list()`; that would do unnecessary multi-context classification and couple list projection to NPC dialogue concerns.
- Do not expose `hasGiverCompletionActionNow()` publicly solely for Vue. `list()` is already the correct read-model boundary.
- Do not make `readyToTurnIn` optional: every fresh list entry can derive it deterministically.
- Do not treat `required-action` at a foreign NPC as turn-in readiness.
- Keep execution-time revalidation unchanged.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
