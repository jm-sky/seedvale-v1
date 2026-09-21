# Plan: Player downed action and input gating

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** none  
**Domain:** `ui-input`  
**Type:** `fix`  
**Roadmap:** -  
**Model:** Sonnet, Composer

## Problem

`PlayerController` defines `downed` as temporary incapacitation.

Movement and combat already honor it:

- PlayerController movement early-returns;
- jump rejects downed;
- player melee/ranged lifecycles are reset;
- mount and lead actions contain explicit downed guards.

But ordinary world interaction has no equivalent shared gate.

`actionContext.ts::isActionBlocked()` only covers busy, time skip and rest camp. The non-modal interaction loop can therefore continue selecting and dispatching ordinary world mutations while the player is downed unless an individual action happened to add its own check.

## Goal

Make downed/incapacitated player input semantics consistent at one shared boundary.

While downed:

- no ordinary world mutation/action starts;
- no melee/ranged attack continues;
- movement remains blocked as today;
- UI actions that are intentionally available while incapacitated remain explicit.

Do not redesign combat mode or interaction target identity.

## Implementation

### 1. Choose one shared gating seam

Prefer a narrow player-action eligibility helper used by the non-modal interaction dispatch, or extend the existing action-context contract if doing so does not silently change legitimate UI-only flows.

Avoid adding `player.isDowned()` independently to every action module.

The helper must distinguish:

- gameplay world actions that mutate/query targets;
- UI/menu controls that are allowed;
- the existing downed recovery timer, which must continue ticking.

### 2. Clear stale action edges on downed entry/while downed

Ensure edge-triggered interaction/action presses cannot queue during downed and fire on the first recovery frame.

Reuse existing keyboard consume/reset mechanisms rather than adding a parallel input buffer.

### 3. Preserve explicit special cases

Mount/lead existing guards may remain as defense-in-depth but should no longer be the only actions with correct incapacitation semantics.

Do not make pause/menu/save UI inaccessible unless current UI policy explicitly requires it.

### 4. Keep combat/downed ownership unchanged

`PlayerController.isDowned()` remains the authoritative state.

Do not add a Vue `downed` authority or a second combat/death state.

## Relevant files / symbols

- `src/player/PlayerController.ts::isDowned/enterDowned`
- `src/app/gameLoop.ts` non-modal input + interaction dispatch
- `src/app/actions/actionContext.ts::isActionBlocked`
- `src/input/Keyboard.ts`
- representative action modules under `src/app/actions/`
- `src/app/actions/mountActions.ts`
- `src/app/actions/leadActions.ts`

## Tests

1. downed player cannot trigger ordinary item pickup/use;
2. downed player cannot start world construction/resource actions;
3. downed player cannot start targeted-skill world action;
4. melee/ranged remain cancelled;
5. stale `[E]`/action edge pressed while downed does not fire immediately after recovery;
6. pause/menu controls intended to remain available still work;
7. after recovery, ordinary input works normally;
8. mount/lead remain rejected while downed.

## Guardrails

- no new death system;
- no interaction-target redesign;
- no duplicate `downed` state in UI/store;
- no per-action scatter of the same guard when one shared boundary is sufficient;
- no browser verification by the AI agent;
- do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
