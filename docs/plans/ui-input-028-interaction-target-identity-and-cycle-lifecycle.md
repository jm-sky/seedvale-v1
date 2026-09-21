# Plan: Interaction target identity and cycle lifecycle

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** ~~ui-input-015~~, ~~ui-input-020~~, world-033  
**Domain:** `ui-input`  
**Type:** `fix`  
**Roadmap:** -
**Model:** Sonnet, Composer

## Problem

The normal interaction adapter is rebuilt every frame, but active non-combat Tab selection is stored as `cycleIndex` into the newly ranked array.

If candidates disappear, appear or reorder while cycling stays active, the retained index can silently select a different object without another Tab press. The same state survives `WorldBundle` rebuild because `gameLoop.forgetHighlight()` clears only the highlighted runtime object.

The selected-target projection also has two owners: prompt/dispatch use `target`, while agent highlight can come from a second agent-only `pickInGaze()`. When cycling to a well/world prop among NPCs, the prompt can belong to the world object while an NPC is independently highlighted.

## Goal

Make one semantic interaction target identity authoritative for active non-combat cycling and its projection, with explicit invalidation/reset across candidate churn and world rebuild.

Do not create a persistent target registry or a second interaction manager.

## Current ownership

- `src/app/interactables.ts::buildInteractables()` — ephemeral current-frame candidates.
- `src/interaction/findInteractionTarget.ts` — deterministic ranking/gaze selection.
- `src/interaction/interactionView.ts::interactableStableKey()` — semantic candidate identity.
- `src/app/gameLoop.ts` — runtime cycle commitment, selected target, prompt/highlight projection and dispatch.
- `src/app/createApp.ts::rebuildWorld()` — WorldBundle rebuild lifecycle.
- `world-033` — broader rebuild transaction/lifecycle work; this plan should use its seam, not duplicate it.

## Implementation

### 1. Replace active cycle index ownership with stable target identity

In `src/app/gameLoop.ts`:

- keep the current ranked `cycleCandidates` order as the order Tab advances through;
- store the active cycled target as a stable semantic key (using `interactableStableKey()`) rather than treating an array index as the committed identity;
- on each frame, resolve that key against the current candidate set;
- if the committed candidate disappeared or is no longer eligible, clear the cycle commitment instead of automatically binding to whichever candidate inherited the old index;
- on Tab, advance from the currently committed key's current position when it still exists; otherwise start deterministically from the ranked list;
- derive the displayed cycle position from the current resolved candidate rather than a stale index.

Do not persist this state.

### 2. Add an explicit interaction-targeting reset seam

Extend the long-lived `GameLoop` API with a narrowly named reset/forget method that clears all runtime selection state tied to the current world:

- active non-combat cycle key;
- cycle display position/index if any helper index remains;
- `gazeStableTargetKey`;
- highlighted target reference/class as appropriate;
- combat world-cycle commitment only if it can otherwise survive the same rebuild and bind to new-world candidates.

Call it from `createApp.ts::rebuildWorld()` before old runtime objects are disposed.

Coordinate with `world-033`: if that plan introduces a generalized pre-rebuild invalidation hook, register the interaction reset there rather than adding a parallel rebuild mechanism.

### 3. Make selected target the sole highlight owner

Remove the second agent-only semantic target pick used only for highlight fallback.

Projection rule:

- if the selected `target` maps to a `Highlightable` agent/corpse, highlight that exact entity;
- if the selected target is a non-agent world object, do not independently highlight a different nearby NPC/animal;
- targeted-skill mode keeps its existing rule that highlight requires a valid skill action.

This must not change candidate ranking or add render raycasts.

### 4. Preserve existing shared mechanisms

Do not change:

- `Interactable` as the per-frame adapter;
- `rankInGaze()` centeredness/actionability/distance/stable-key ordering;
- candidate-specific `interactRange`;
- spatial-context isolation;
- mounted-state `target = null` gate;
- combat living-target soft-lock semantics except the narrow world-cycle rebuild invalidation above;
- domain action validation/mutation ownership.

## Tests

Add focused automated regressions around extracted/pure targeting state where practical:

1. active cycle on candidate B; candidate A disappears/reorders list → B remains selected if B still exists;
2. active cycled candidate disappears → cycle commitment clears/falls back to normal deterministic gaze, never silently selects the old numeric slot;
3. candidate enters ahead of selected target in sort order → stable target remains selected;
4. rebuild reset clears cycle/hysteresis/world-cycle targeting state;
5. mixed NPC + well target: cycle to well → prompt/dispatch target is well and NPC is not independently highlighted;
6. existing deterministic cycling order and gaze hysteresis tests remain green.

## Verification

Automated:

- relevant `findInteractionTarget` / interaction-view / game-loop targeting tests;
- typecheck/build as required by repository workflow.

Manual browser verification is performed by the User, not the AI agent.

Suggested browser cases for the User:

- several NPCs around a well, Tab through targets, let an NPC move away while staying on the well;
- pick up/remove a cycled item and verify selection does not jump to a different object;
- rebuild/new game/config rebuild while cycling was active;
- cycle to a world prop beside an NPC and confirm highlight/prompt refer to one owner.

## Guardrails

- No new global interaction registry.
- No persistence for transient target selection.
- No raycast-only parallel target mechanism.
- No special-case well/corpse cycling path.
- Reuse `interactableStableKey()`.
- Preserve the same selected target for prompt and dispatch.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
