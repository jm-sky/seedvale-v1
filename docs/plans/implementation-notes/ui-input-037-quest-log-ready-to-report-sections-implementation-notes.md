# Implementation Notes: ui-input-037 — Quest log ready-to-report sections

## Current code seam

- Keep the existing data path unchanged: `QuestManager.list()` already emits `QuestListEntry.state`, `giverName` and `giverNpcId`; no `QuestManager` or persistence change is needed for this plan.
- `src/ui-vue/lib/questLogBuckets.ts` is the correct owner for the split. Today `QuestLogBuckets.current` mixes `ready_to_report` and `active`, sorted by `CURRENT_RANK`. Extend this projection with explicit current subsections (for example `currentReadyToReport` / `currentActive`, or a nested `currentSections`) while preserving `current` count as their sum.
- `src/ui-vue/screens/QuestLogScreen.vue` currently renders one `visibleEntries` loop for every tab. Special-case only the `current` presentation to render the two projected subsections; keep `offers` and `history` on the existing path. Do not duplicate state filtering in the component.

## Rendering details

- The current row already has a non-color-only state label (`do zgłoszenia`) and visual ring. For the ready section, replace/augment that with the plan's explicit `DO ODDANIA` badge and `Wróć do: {{ entry.giverName }}`. `giverName` is already presentation-ready; do not add an NPC lookup.
- Keep `entry.currentObjective` for `active` rows. `QuestListEntry.currentObjective` is documented as null outside `active`, so do not attempt to derive a ready-to-report objective in Vue.
- Preserve row click → `openDetails(entry)`, stable `entry.id` keys, details view, overlay/Esc lifecycle and filter reset behavior.
- Empty-state logic needs to be based on the total current count, not on either subsection independently. Omit an empty subsection heading; show the existing “Brak zadań…” only when both are empty.

## Tests

Update `src/ui-vue/lib/questLogBuckets.test.ts` at the projection boundary. The important regression is that subsection membership is exclusive and deterministic while `counts.current` remains the combined count. Keep the existing coverage for hidden `not_offered`, offers and all terminal history states.

No component-level test infrastructure is needed solely for this polish; pure projection tests plus typecheck/build are sufficient automated coverage. Browser verification remains with the User.

## Pitfalls

- Do not remove the existing top-level `current` semantics if doing so complicates tab counts/selection; this plan is a presentation refinement of ui-input-017, not a new Quest Log model.
- Do not infer “ready” from objective text, stage index, journal notes or quest id. Only `QuestListEntry.state === 'ready_to_report'` decides subsection membership.
- ui-input-021 has already added the list/details flow and journal notes to this screen. Keep that work intact; the plan text predates none of it, but implementation should treat the current component as authoritative.
