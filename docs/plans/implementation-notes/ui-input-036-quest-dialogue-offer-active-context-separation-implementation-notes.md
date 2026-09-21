# Implementation Notes: ui-input-036 quest dialogue offer / active context separation

**Reviewed:** 2026-09-21  
**Plan:** `ui-input-036-quest-dialogue-offer-active-context-separation.md`  
**Codebase baseline:** `main`

## Verified current seams

### `QuestManager`

The split already has a usable semantic source of truth:

- `previewNpcDialogue(npcId)` returns one `QuestDialoguePreviewEntry` per relevant context.
- `classifyNpcDialoguePreview()` classifies with the exact UI-facing kinds `report | required-action | offer | active`.
- `QuestDialoguePreviewEntry.resolve()` routes back through `resolveNpcQuestContribution(def, npcId)`, so selecting a preview entry re-reads live quest state.
- `resolveNpcQuestContribution()` is the existing per-definition resolver for actionable dialogue, world-knowledge talk, giver offer and giver reminder.
- generic abandon is already `topicScoped: true`; do not rebuild it in Vue.

The bug is specifically that `openNpcDialogueMenu()` wires `resolveQuestHelp` to the broad `QuestManager.onInteract()`, whose contract intentionally aggregates every quest context for that NPC after offer admission.

### Offer admission

`selectableOfferIds(npcId)` is pure/read-only and already owns exposure, urgency/story exceptions, ranking and giver-cap constraints.

`admitOffersForGiver(npcId)` is the mutation boundary that promotes selected `not_offered` definitions to `offered` and journals the offer.

Preserve the current timing:

```text
open NPC menu        -> no admission
read preview         -> no admission
Aktywne zadania      -> no admission
Może w czymś pomóc?  -> admission is allowed
```

Do not move `admitOffersForGiver()` into preview or menu-open code.

## Recommended QuestManager change

Prefer a narrow public method dedicated to the deliberate offer branch, e.g. semantically:

```ts
resolveNpcQuestOffers(npcId: NpcId): QuestDialogOverride | null
```

A generic public `scope: 'offers' | 'active'` API is unnecessary unless implementation naturally needs it. The active branch already has a better contract: `previewNpcDialogue()` + per-entry live `resolve()`.

Offer-only resolver should:

1. call `admitOffersForGiver(npcId)`,
2. inspect only definitions whose giver is `npcId`,
3. keep only definitions that are now actually `offered` and accept-capable,
4. resolve them through the existing `handleGiverOffer(def)` / equivalent existing contribution path,
5. preserve definition/ranking order already established by the quest layer,
6. return:
   - `null` when no offer exists,
   - the direct offer payload for one offer,
   - a titled `QuestDialogTopic[]` picker for multiple offers.

Do not call broad `resolveNpcQuestContribution()` across every definition and then filter its result; that resolver intentionally includes active reminders/actions and would recreate the leakage this plan fixes.

### Aggregation helper

`onInteract()` currently contains the generic multi-context aggregation logic. Extract a helper only if the new offer resolver genuinely needs the same shape.

For offer-only contexts there are no immediate non-topic actions before selecting a quest; a very small offer picker helper may be simpler and safer than generalizing the whole `onInteract()` reducer.

Avoid a broad refactor of `onInteract()` for this S-sized fix.

## UI/store wiring

### `src/ui-vue/store.ts`

Current line:

```ts
state.resolveQuestHelp = () => questManager.onInteract(npc.id)
```

is the key integration point to change.

Keep the existing `NpcDialogueMenuState.resolveQuestHelp` seam if practical; only change what it resolves to. This avoids touching the rest of the component/store contract.

`getNpcDialogueQuestPreview()` remains the read-only source for the active-task list and root shortcuts.

`resolveNpcDialogueHelp()` should continue falling back to `npc.getDialogueLine()` when the offer resolver returns `null`. That means an NPC with no current offers still gives the normal generic response rather than an empty panel.

### `src/ui-vue/NpcDialogueMenu.vue`

Current derived lists are:

```ts
reportShortcuts
requiredActionShortcuts
activeMatters // currently only kind === 'active'
```

Change only the active list semantics:

```text
active task = active | required-action | report
```

Keep root `report` / `required-action` shortcuts unchanged.

Renaming `activeMatters` / `activeMattersOrigin` to task-oriented names is optional. If renaming, keep it local and complete; do not turn this fix into a navigation refactor.

## Back-navigation caveat

Current offer rendering has a special branch:

```text
topic === 'help' && hasOffer
  -> Przyjmij
  -> Odmów
```

There is no `Wróć` button there. `Odmów` closes the menu and invokes `offer.onDecline` through `closeNpcDialogueMenu()`.

Therefore the plan's idealized “offer -> Wróć -> picker/group” is not currently supported by the offer UX.

For this implementation:

- do not silently repurpose `Odmów` as back,
- do not call `onDecline` when merely navigating back,
- if adding `Wróć` for a drilled multi-offer topic, it must leave the offer standing and return to the offer picker without closing the menu,
- single-offer behaviour may remain the existing accept/decline flow unless a clean navigation origin is already available.

This is the highest-risk UI detail in the plan because decline changes quest bookkeeping and suppression time.

## Active-task semantics

Use preview kinds directly; Vue should not inspect raw quest lifecycle.

Expected inclusion:

- `active` — ordinary giver reminder / active context,
- `required-action` — e.g. foreign `talk_to_npc` target,
- `report` — giver hand-in/report available now.

Expected exclusion:

- `offer`.

This means `Aktywne zadania` can legitimately contain a quest that also appears as a root `✓` or `?` shortcut. That duplication is intentional: shortcut = urgent access, active section = complete current-task navigation.

## World-knowledge side effects

`resolveNpcQuestContribution()` can enter `worldKnowledgeTalk()`, which may launch knowledge resolution, append a pending journal stamp, or apply an unavailable outcome.

That is acceptable only after the player deliberately selects an active quest context.

Do not use `entry.resolve()` while merely computing whether `Aktywne zadania` is visible. Visibility/listing must stay on `previewNpcDialogue()` only.

## Tests to adapt

### `src/ui-vue/npcDialogueOpen.test.ts`

Several existing tests currently encode the old broad-help behaviour and must be updated intentionally.

In particular:

- `talk_to_npc seam`: after opening Piotr, `resolveNpcDialogueHelp()` currently exposes the active foreign quest action. After this fix, that action belongs under the active-task preview path, not the offer/help path.
- `ready_to_report`: resolving help at Anna currently exposes report action. After this fix, report should be reached via preview/root/active-task entry, while help remains offer-only or generic fallback.
- `resolveNpcDialogueHelp topic picker contract`: the existing test with two active reminders expects both under help. That expectation becomes invalid; migrate it to the preview/active-task contract.
- existing tests that prove a new offer is not admitted until `resolveNpcDialogueHelp()` remain valuable and should still pass semantically.

Add a focused store-level regression fixture containing at the same NPC:

```text
1 selectable new offer
1 active abandonable giver quest
```

Assert:

- preview contains both `offer` and `active`,
- `resolveNpcDialogueHelp()` returns only the offer,
- no active quest title/action/abandon leaks into its topics/actions.

### `src/quests/QuestManager.test.ts`

Place new tests next to existing `onInteract()`, preview, offer-cap and multi-context dialogue tests.

Minimum useful coverage:

- offer-only resolver admits and returns one selectable offer;
- offer-only resolver returns a multi-offer topic picker when policy exposes multiple slots (e.g. normal + urgent/story);
- existing active giver reminder is excluded;
- existing report is excluded;
- foreign required-action context is excluded;
- calling preview before offer resolver does not mutate state;
- calling offer resolver does perform the same expected `not_offered -> offered` transition;
- generic `onInteract()` remains unchanged for any non-menu callers/tests that still rely on its broad aggregation.

## Call-site discipline

Before changing `onInteract()` itself, search all call sites. The safest implementation leaves its public behaviour intact and migrates only `openNpcDialogueMenu()` to the new offer-only method.

Do not rename/remove `onInteract()` as part of this plan.

## ui-input-035 interaction

No functional dependency on `ui-input-035`.

That plan consumes `QuestManager.labelMarker()` for NPC label icon presentation. This fix should not change marker priority or `labelMarker()`; both plans can coexist without shared state changes.

## Expected files changed

Primary:

- `src/quests/QuestManager.ts`
- `src/quests/QuestManager.test.ts`
- `src/ui-vue/store.ts`
- `src/ui-vue/npcDialogueOpen.test.ts`
- `src/ui-vue/NpcDialogueMenu.vue`

Likely unchanged:

- quest definitions in `src/quests/quests.ts`,
- `src/ai/dialogueTemplates.ts`,
- persistence,
- `QuestManager.labelMarker()`,
- NPC label code from `ui-input-035`.

## Suggested implementation order

1. Add the narrow offer-only QuestManager resolver and unit tests.
2. Change the store's `resolveQuestHelp` binding to it.
3. Update store dialogue tests that currently assume broad `onInteract()`.
4. Expand the active-task preview filter to `active | required-action | report` and rename the visible label.
5. Adjust back-navigation only where required for multi-offer drill-down; keep decline semantics separate.
6. Run focused quest/UI tests, then typecheck/lint.
7. Leave browser verification to the User.

## Guardrails

- Keep `QuestManager` authoritative for lifecycle, admission and context classification.
- No raw `QuestState` interpretation in Vue.
- No offer admission from preview, menu open or active-task browsing.
- No active/report/required-action leakage into the offer branch.
- No offer leakage into `Aktywne zadania`.
- Preserve topic-scoped abandon and live resolution.
- Preserve generic `onInteract()` unless a verified call-site migration requires otherwise.
- Preserve `labelMarker()` semantics for `ui-input-035`.
- Do not add persistence or a second dialogue router.
- Add `@domain quests-progression` JSDoc to the new public QuestManager resolver.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
