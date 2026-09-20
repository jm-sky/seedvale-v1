# Plan: Player New Game runtime state reset

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** high · **Effort:** S  
**Model:** Sonnet, Composer  
**Depends on:** items-player-050  
**Domain:** `items-player`  
**Type:** `fix`  
**Roadmap:** -

## Problem

Pause-menu New Game creates a new save/world identity by rebuilding the world in the existing app session.

`rebuildWorld(true)` reuses the existing `PlayerController` and manually resets selected external systems. For player-owned state it currently calls `resetPlayerNeeds(player.needs)`, but does not have one complete "fresh player" lifecycle reset.

As a result, state owned by the reused player runtime can leak from the previous game into the new game and then be written immediately into the new save.

## Goal

Give the player one explicit owner-level New Game reset contract and call it from the existing New Game transaction.

A fresh in-session New Game must have the same player-owned gameplay state as a fresh boot, except for configuration intentionally chosen for the new game.

Do not reconstruct the whole app and do not create a second player-state store.

## Current ownership

Keep:

- `PlayerController` as owner of health, injury, skills, temporary conditions and movement/downed transient state;
- `PlayerNeeds` as owner of stamina/vigor/hunger/thirst;
- existing managers as owners of inventory, equipment, torch, combat mode, targeted-skill selection and mount/control state;
- `createApp.ts` only as lifecycle orchestrator.

`items-player-050` owns persistence schema for HP/injury. This plan only owns reset orchestration.

## Implementation

### 1. Add a focused fresh-player reset seam

Prefer one `PlayerController.resetForNewGame(...)` or equivalent owner-level method rather than more field mutations in `createApp.ts`.

It must reset player-owned state that is supposed to be fresh:

- health to current max;
- physical injury/recovery anchor to zero/fresh;
- all skills XP/value/active stance to fresh defaults;
- temporary conditions to empty;
- deterministic player condition/event counters such as water/raw-meat exposure counters to zero;
- downed timer/state;
- pose/movement/sprint/jump/melee/ranged transient flags;
- transient water/swimming/contact state that could affect the next movement tick.

Reuse `resetPlayerNeeds()` for needs/stamina; do not duplicate its math.

If implementation of `items-player-050` introduces a health restore/reset helper, reuse it.

### 2. Reset app-owned player control projections through their existing owners

Audit the New Game branch for session-lived player controllers that are not fields of `PlayerController`, at minimum:

- combat mode / active draw state;
- targeted-skill runtime selection;
- mount/lead relation;
- any active player intent already represented by `cancelActivePlayerIntent`.

Use their existing reset/cancel operations or add the smallest owner-local reset API. Do not directly reach into closure-private fields from `createApp.ts`.

### 3. Preserve correct existing New Game behaviour

Keep:

- inventory clear + starting loadout;
- held-tool/torch reset;
- world/quest/reputation/map resets;
- `PlayerController.setGround(...)` rebind;
- relocation to `settlementSpawnPoint(home)`;
- one save only after the reset/rebuild transaction is complete.

Do not change same-seed/config rebuild semantics: a normal rebuild must preserve player state.

### 4. Avoid persistence duplication

No new SaveData fields belong in this plan.

Persisted player fields already have their domain plans/owners. New Game should reset runtime owners before `saveNow('new-game-transition')` snapshots them.

## Relevant files / symbols

- `src/app/createApp.ts::rebuildWorld`
- pause-menu `onNewGame`
- `src/player/PlayerController.ts`
- `src/player/PlayerNeeds.ts::resetPlayerNeeds`
- `src/player/PlayerSkills.ts`
- `src/shared/temporaryConditions.ts`
- `src/player/playerCombatMode.ts`
- player targeted-skill selection owner
- `src/app/actions/mountActions.ts`
- `src/app/actions/leadActions.ts`

## Tests

Add focused automated coverage where seams allow:

1. damaged/injured player → in-session New Game → fresh HP/injury;
2. gained skill XP / active Sneak → New Game → fresh skills;
3. poisoning/temporary condition + event counters → New Game → empty/zero;
4. downed player → New Game → active standing player;
5. non-full stamina/needs → New Game → full fresh pools;
6. mounted/leading player → New Game → no stale old-world control relation;
7. same-world rebuild preserves player-owned state;
8. New Game still relocates to the new home spawn;
9. the first new-game save contains only reset player state.

## Guardrails

- no second `PlayerState` aggregate;
- no broad `createApp.ts` refactor;
- no persistence schema work beyond consuming `items-player-050`;
- no gameplay balancing;
- no browser verification by the AI agent;
- do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
