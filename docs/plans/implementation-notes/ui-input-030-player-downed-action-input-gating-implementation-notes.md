# Implementation Notes: Player downed action and input gating

**Plan:** `ui-input-030-player-downed-action-input-gating.md`  
**Reviewed:** 2026-09-21  
**Baseline:** current `main`

## Recommended seam

Do **not** put `player.isDowned()` into `isActionBlocked()` or `isChannelBusy()`.

Those helpers are action-module policy with intentionally different historical semantics. `isChannelBusy()` explicitly preserves the narrower busy/time-skip contract, and `isActionBlocked()` is also used by modules whose callbacks can be invoked from UI/dialog flows. Broadening either would silently change more than the non-modal incapacitation bug.

Gate downed state in `src/app/gameLoop.ts`, at the existing **non-modal input/interaction boundary**: the `else` branch after `activeModal(...)`. This is already the central place that:
- drains edge-triggered gameplay input;
- selects/dispatches gaze interactions;
- starts targeted-skill actions;
- handles drop/jump/combat-mode;
- cancels melee/ranged while a modal blocks input.

Use the same shape for downed rather than scattering guards through `src/app/actions/*`.

## Concrete runtime behavior

When `player.isDowned()` in the non-modal branch:

1. Drain gameplay edges every frame so nothing survives recovery:
   - `consumeInteract()`
   - `consumeInteractRelease()`
   - `consumeAltInteract()`
   - `consumeInspect()`
   - `consumeDrop()`
   - `consumeRotateLeft()`
   - `consumeJump()`
   - `consumeCombatMode()`
   - `consumeCycleTarget()`
   - terrain-preparation adjustment edges (`plus/minus/comma/period`) if their preview tick would otherwise retain them.

2. Cancel any live player attack using the **same reset sequence already used by the modal branch**:
   - melee: `playerMelee.reset()`, `player.endMeleeAttack()`, `player.setMeleeSwing(null)`, clear `attackYaw`;
   - ranged draw: `playerRanged.reset()`, `player.endRangedDraw()`, clear `rangedTargetId`, stop bow draw sound, clear aiming HUD.

   Prefer extracting this duplicated sequence to one local helper in `gameLoop.ts` if it keeps the diff smaller/clearer.

3. Do not run target mutation dispatch, targeted-skill execution, placement/preparation confirmation, item drop, jump or combat-mode toggle while downed.

4. Clear gameplay targeting affordances while downed (`setHighlight(null)`, cycle/inspect availability false). Avoid presenting actionable world prompts for actions that cannot execute.

## UI controls that should remain available

The current non-modal tail independently consumes:
`questLog`, `inventory`, `skills`, `character`, `quickActions`, and `minimap`.

Do not classify all of these as world mutation input. Preserve ordinary read/navigation UI unless a specific screen starts gameplay actions. The important distinction is **opening UI vs executing world mutations from it**.

Pause/Esc is handled outside this dispatch and should remain unaffected.

If Quick Actions contains callbacks that directly start world actions without returning through the non-modal dispatch, verify those callbacks during implementation. Gate the action-start callback at the existing shared action entry seam rather than disabling the whole Quick Actions UI solely because the player is downed.

## Downed lifecycle ordering

`PlayerController` remains authoritative:
- `enterDowned()` sets the flag and clears controller melee/ranged/jump/sneak state;
- `tickDowned(worldDt)` owns recovery timing;
- `applyDownedRecovery()` runs after the timer completes.

Do not early-return from the whole game tick. Simulation, `tickDowned()`, HUD, camera/world updates and recovery must continue.

A press on the exact recovery frame must not leak through. Determine `downedAtInputBoundary` before interaction dispatch / drain edges while downed; do not allow a previously latched edge merely because `tickDowned()` clears the flag later in that same frame.

## Existing special cases

Keep `mountActions.tryMount()` and `leadActions.tryLead()` explicit downed guards as defense-in-depth. They are not the primary fix.

Note that `leadActions.hitchLedToCart()` / `unhitchCart()` do not have their own downed guard today; the central dispatch gate is therefore materially important.

## Tests / regression focus

Prefer focused tests around the input boundary rather than adding `isDowned()` assertions to every action module.

Cover at least:
- `E` / `R` pressed while downed is consumed and does not execute after recovery;
- targeted-skill confirmation cannot start while downed;
- drop cannot mutate Inventory/world while downed;
- melee/ranged lifecycle is cancelled;
- UI navigation keys intended to remain available are not swallowed by the gameplay gate;
- recovery restores normal dispatch on a fresh post-recovery press.

No new persisted/UI downed state and no interaction-target identity changes. `ui-input-028` remains the owner of target/cycle lifecycle concerns.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
