# Plan: Village torch interaction action contract

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** low · **Effort:** S  
**Depends on:** ~~ui-input-015~~  
**Domain:** `ui-input`  
**Type:** `fix`  
**Roadmap:** -

## Problem

`buildInteractables()` emits a settlement `villageTorch` candidate with live `lit` state:

- unlit: `[E] Zapal pochodnię`;
- lit: `Pochodnia (płonie)`.

The structured interaction view has no state-specific `villageTorch` action projection. The plain lit label therefore falls through legacy prompt parsing and is treated as an enabled primary action.

The dispatcher correctly performs ignition only when `!target.lit`, so projection/actionability and execution disagree for an already-lit village torch.

## Goal

Make `villageTorch` structured action projection use the same explicit `lit` state that dispatch already trusts.

## Relevant code

- `src/app/interactables.ts` — village torch candidate construction.
- `src/interaction/Interactable.ts` — `villageTorch` payload with `lit`.
- `src/interaction/interactionView.ts` — structured action projection and `isInteractableActionable()`.
- `src/app/gameLoop.ts` — authoritative dispatch to `igniteVillageTorch`.
- `src/interaction/interactionView.test.ts` — focused projection/actionability tests.

## Implementation

In `interactionView.ts`, add a narrow state-derived action builder for `villageTorch` (or equivalent explicit branch):

- unlit → enabled primary `Zapal pochodnię`;
- lit → no enabled primary action; status text may remain presentation-only;
- do not infer actionability from matching Polish prompt text;
- keep `gameLoop.ts`'s `!target.lit` execution guard as the final authoritative safety check.

The candidate can keep its existing `promptLabel` for display compatibility, but action existence must come from `target.lit`.

## Tests

Add focused `interactionView.test.ts` coverage:

1. unlit village torch exposes one enabled primary action;
2. lit village torch exposes no enabled primary action;
3. `isInteractableActionable()` is true for unlit and false for lit;
4. the action label remains aligned with the existing ignition dispatch semantics.

No browser verification by the AI agent.

## Guardrails

- Do not change village-torch persistence or quest logic.
- Do not add a torch-specific input path.
- Do not broaden legacy status regexes as the primary fix when explicit `lit` state already exists.
- Reuse the structured interaction-view mechanism from `ui-input-015`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
