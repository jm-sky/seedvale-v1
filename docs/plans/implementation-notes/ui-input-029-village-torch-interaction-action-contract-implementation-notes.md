# Implementation Notes: ui-input-029 Village torch interaction action contract

**Plan:** `docs/plans/ui-input-029-village-torch-interaction-action-contract.md`  
**Reviewed against:** `main`, 2026-09-21

## Current contract

- `buildInteractables()` already snapshots canonical village-torch state into `Interactable.kind === 'villageTorch'` as `lit`, plus stable `settlementId` / `torchId`. Do not add another lookup or state owner.
- `gameLoop.ts` already has the authoritative execution guard: `interactPressed && !target.lit` before `igniteVillageTorch`. Keep it even after projection is fixed.
- The defect is isolated to `buildInteractionView()`: `villageTorch` currently falls through `parseLegacyPrompt(target.promptLabel)`, so plain `Pochodnia (płonie)` becomes an enabled primary action.
- `isInteractableActionable()` is derived from `buildInteractionView()` and is used by gaze ranking. Fixing the projection therefore also fixes target actionability/tie-breaking without touching `findInteractionTarget.ts`.

## Recommended implementation

Add a small `villageTorchActions(target)` helper in `src/interaction/interactionView.ts`, parallel to `standingTorchActions()`, and add an explicit `case 'villageTorch'` in `buildInteractionView()`.

Use `target.lit` only:

- unlit → `[{ slot: 'primary', label: 'Zapal pochodnię', enabled: true, reasonLabel: '' }]`;
- lit → a disabled status primary, e.g. `Pochodnia (płonie)`.

Prefer the disabled-status shape over an empty action array. The existing `InteractionView` contract converts one disabled action into `targetLabel`, so the lit torch remains readable while exposing no enabled E/R action. This also matches the established `standingTorchActions()` pattern.

Do not derive either state from `promptLabel`; keep the existing candidate label only for compatibility with remaining legacy consumers.

## Tests

Add direct `villageTorch` fixtures to `src/interaction/interactionView.test.ts` and assert:

- unlit: primary is enabled and labelled `Zapal pochodnię`;
- lit: primary is disabled and `isInteractableActionable()` is false;
- unlit: `isInteractableActionable()` is true;
- lit view still exposes readable status through the current `targetLabel` behavior.

No `gameLoop.ts`, persistence, quest-lighting, or settlement-torch lifecycle changes are needed.
