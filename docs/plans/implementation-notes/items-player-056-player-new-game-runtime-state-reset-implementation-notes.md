# Implementation notes: items-player-056 Player New Game runtime state reset

**Plan:** `items-player-056-player-new-game-runtime-state-reset.md`

## Current lifecycle

- Pause-menu New Game is `createApp.ts::onNewGame`: it protects the old save, calls `beginNewSave()`, changes `config.seed`, awaits `rebuildWorld(true)`, then writes the first save for the new identity with `saveNow('new-game-transition')`.
- `rebuildWorld(true)` currently resets world/progression systems and player inventory/loadout, but the only reused `PlayerController` state it resets is `resetPlayerNeeds(player.needs)`.
- Ordinary `rebuildWorld(false)` must remain state-preserving. Keep every fresh-player reset strictly behind the `resetCollectedItems` / New Game path.

## PlayerController reset seam

Add one owner-local `PlayerController.resetForNewGame(...)` (or equivalently narrow owner method) because the state that must be cleared includes private movement/combat fields which `createApp.ts` should not mutate.

Reset in-place; do not replace the existing `health`, `injuryRecovery`, `needs`, `skills`, or `temporaryConditions` objects because consumers already hold references to them.

The seam should restore construction-time semantics for:

- health/injury through the owner-local reset contract delivered by dependency `items-player-050`; that plan is still planned on reviewed `main`, so re-check the final symbol name before implementing 056;
- skills: zero XP, derived value back to `SKILL_MIN_VALUE`, all `active=false`. Prefer an explicit `resetPlayerSkills(skills)` next to `createPlayerSkills()/restorePersistedSkills()` rather than open-coding eight fields in `PlayerController`;
- temporary conditions and deterministic exposure counters: existing `restoreTemporaryConditionsState(undefined)` already empties conditions and resets both `waterDrinkEventCount` and `unsafeFoodEventCount` through its default arguments;
- downed state/timer and pose back to a normal standing state;
- movement/animation transients that survive because the controller instance survives: `verticalVelocity`, `grounded`, `jumpRequested`, `jumpPhase`, `jumpLandLockRemaining`, `moving`, `sprinting`, `meleeAttacking`, `rangedDrawing`, `sneakUseDistance`, `wasInWater`, `footstepAccum`, and the deterministic `defenseAttempt` counter;
- mounted flag only as a final invariant; the actual mount owner must be cleared first (see below), rather than making `PlayerController` silently detach an animal it does not own.

Do not reset appearance/equipment projections here; those remain owned by inventory/equipment/held-tool wiring and are already refreshed in the New Game branch.

## External runtime owners

### Mount

`createMountActions()` owns both `mount: AnimalAgent | null` and `pendingRestoreId`. Calling only `dismount()` is insufficient: when no live mount is attached, a stale `pendingRestoreId` can still reattach after the new world loads.

Add the smallest explicit lifecycle reset to `MountActions` that:
- clears any pending restore id;
- detaches a live mount while the old world object is still valid;
- clears mounted HUD/player projection and riding accumulators;
- does not create a Follow/Stay side effect intended only for a conscious player dismount.

Run this New Game cleanup before the old WorldBundle fauna/settlement objects are disposed. Do not reuse the normal `dismount('player')` semantics if that would refresh a Stay anchor or reposition the player beside the old horse.

### Lead

`LeadActions.detach()` is already owner-local and clears the animal lead flag, `ledId`, and HUD. Call it before the old world is disposed.

### Combat mode

`PlayerCombatMode.noteSheathed()` clears only `activeWeapon`; it deliberately preserves `lastActiveWeapon`. Fresh construction initializes `lastActiveWeapon = 'melee'`, so New Game needs a small `reset()` on this owner if the goal is fresh-boot equivalence. Do not rely only on `heldTool.unequip()`.

### Targeted skill

`TargetedSkillSelection.clear()` already owns the selection. New Game also must clear its UI/input projections exactly like the existing abort callback:
`vueUi.setSelectedTargetedSkill(null)` and pointer-look restoration. Prefer extracting/reusing one local `abortTargetedSkill` helper in `createApp.ts` rather than duplicating those three calls.

### Active intents

Keep `cancelActivePlayerIntent()` at rebuild entry. It currently cancels cook-meal and full-camp intents and already runs for every rebuild.

## Ordering

For `rebuildWorld(true)`, clear old-world control relations (mount/lead) and runtime-only input/combat selections before rebuilding/disposal. After the new bundle is published, perform the fresh `PlayerController`/needs reset, inventory/loadout and existing progression resets, then rebind ground and relocate to `settlementSpawnPoint(home)`.

The final `saveNow('new-game-transition')` in `onNewGame` must remain after the entire rebuild/reset transaction. The earlier save is intentionally the protective save of the old game and must not be removed as part of this plan.

## Tests

Prefer focused unit/lifecycle tests over a broad `createApp` integration fixture:

- `PlayerController.resetForNewGame`: damaged/downed/poisoned, gained skill XP + Sneak active, exposure counters, jump/swim/combat transients -> fresh state while keeping owned object identities;
- `PlayerCombatMode.reset`: active state cleared and `lastActiveWeapon` returns to fresh default;
- mount reset: clears both live mount and `pendingRestoreId`, without player-dismount Stay semantics;
- New Game orchestration: reset path runs only for `rebuildWorld(true)`; ordinary rebuild preserves player state;
- save assembly after New Game sees reset health/injury/skills/conditions/counters and no mounted relation.

Existing relocation behavior in `createApp.ts` lines around the post-rebuild `settlementSpawnPoint(home)` branch should be preserved rather than reimplemented.

## Dependency / implementation caution

`items-player-050` is not implemented on reviewed `main`; its implementation notes explicitly reserve complete New Game orchestration for 056. Implement 050 first (or in the same ordered change sequence), then consume its actual owner-local health/injury reset API here. Do not duplicate its persistence schema or invent a parallel health snapshot.
