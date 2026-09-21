# Implementation Notes: npc-059 need action result revalidation and atomic relief

## Current code facts

- `NpcAgent.beginNeed()` still treats strategy checks as previews, which is correct. The commit bug is in completion callbacks:
  - `householdWater`: `household.water.remove(WATER_DRINK_FROM_STOCK_AMOUNT)` is followed by unconditional `relieveNeed(..., 'water')`.
  - `householdFood`: `household.takeFood(...)` is followed by unconditional hunger relief and `progressActivePlan('secureFood', 1)`.
  - `personalFood`: `takeOneFoodItem(...)` result is ignored before relief.
  - `personalWater`: the instance update/drink result can fail, but relief is unconditional.
  - wood `chopDeposit`: failed `harvestWorldTreeFully()` leaves `harvestedYields` empty, yet the deposit leg relieves the wood duty before checking harvested units.
- `beginRealFoodGathering()` already has the desired source-side pattern: `foodSources.harvest(target)` must succeed before relief. Keep that shape.
- `npcLogistics.ts::satisfyHouseholdResourceNeed()` also ignores the nullable result of `Household.takeFood()`. Its current exchange callers deliver and consume synchronously, so the race window is effectively absent, but make the helper obey the same invariant rather than keeping an exception.
- `settlements-npcs-034` is already implemented: wood harvest now carries exact `branch`/`beam` batches in `harvestedYields`. Do not restore scalar wood semantics.

## Implementation decisions

### WaterReserve contract

Change `WaterReserve.remove(amount)` in `src/settlement/household.ts` to return the **actual removed amount**.

Recommended semantics:

- `removed = min(current, max(0, amount))`;
- decrement by exactly `removed`;
- return `removed`.

This preserves the existing clamping behavior for all callers while exposing an authoritative result. Existing callers may ignore the return value.

For NPC household drinking, relieve thirst only when returned amount equals `WATER_DRINK_FROM_STOCK_AMOUNT`. Do not compensate partial removal with relief.

Review the existing callers when changing the type:
- `src/fauna/animalForaging.ts` currently does `has(TROUGH_DRINK_AMOUNT)` immediately before `remove()`; it may keep ignoring the return, or preferably use the returned amount to preserve the same atomic invariant without adding new state.
- `src/ai/npcPersonalProvisions.ts` removes household water while filling provisions; keep the same owner and avoid a parallel `tryRemove` API.
- tests that intentionally over-remove in `src/settlement/household.test.ts` should assert both final reserve state and returned amount.

### Food completion

Use the existing return values, not an extra pre-check:

- `householdFood`: `const consumed = household.takeFood(...)`; only on non-null result call hunger relief and `progressActivePlan('secureFood', 1)`.
- `personalFood`: only relieve when `takeOneFoodItem(...)` returns an item.
- `satisfyHouseholdResourceNeed(..., 'food')`: only relieve after successful `takeFood()`.

Do not add reservations around `Household.items`; the completion-time transaction is the arbitration point.

For `personalWater`, use the result of the existing instance mutation path. The callback must not silently turn “container disappeared/changed/no longer drinkable” into success. Keep `personalInventory` as the owner; no new personal-water state.

### Wood duty

In the existing chop→deposit chain, compute harvested units from `harvestedYields` before semantic success.

If the total is zero:
- do not call `relieveNeed(..., 'wood')`;
- do not call `progressActivePlan('obtainWood', ...)`;
- `depositWoodHarvest(..., [])` may remain as the existing no-op, or be skipped locally.

If the total is positive:
1. deposit the exact harvested batches through `depositWoodHarvest()`;
2. relieve the wood duty;
3. progress the active plan using the existing branch-equivalent calculation.

Do not change `harvestWorldTreeFully()` or add target reservations. A raced tree simply completes physically with no semantic success, then the next `choose()` re-arbitrates.

## Tests

Prefer focused tests around existing pure owners/helpers rather than booting Three.js assets.

Cover:
- `WaterReserve.remove()`: full removal, insufficient reserve/partial removal, over-remove clamp + returned amount.
- two sequential consumers of one unit of household food: first `takeFood()` succeeds, second fails; only the successful completion path may relieve/progress.
- stale household water completion: reserve is drained after strategy selection but before completion; no thirst relief.
- stale personal food/water completion: no relief when the item/container changed or disappeared.
- wood: empty `harvestedYields` gives no relief/plan progress; non-empty yields preserve exact deposit + existing branch-equivalent progress.
- keep `npcLogistics.test.ts` exchange behavior intact after making `satisfyHouseholdResourceNeed()` conditional.

A tiny extracted completion helper is acceptable only if it reduces test setup and is reused by real call sites; do not introduce a new result/FSM abstraction for this fix.

## Boundaries

- `npc-058` owns time-skip parity. Do not modify `resolveTimeSkip`/off-screen survival here.
- Do not change strategy ordering, pressure scoring, `NpcPlan` lifecycle, action persistence, or retry state.
- Diagnostics may record a failure reason only through the existing trace buffer; no persisted failure/retry flag.

## What was actually implemented

`npc-058` already routed household/personal food and water completions through `tryConsume*` / `consumeOnePersonal*` (atomic `tryRemove` for household drinks). This plan kept that path and added the remaining commit-time gaps:

- `WaterReserve.remove(amount)` now returns the actual removed amount; over-remove still clamps to zero. NPC household drinking continues to use `tryRemove` so a partial reserve is not drained as a failed drink. Animal trough relief uses the returned amount after the existing `has()` re-check.
- `satisfyHouseholdResourceNeed(..., 'food')` relieves hunger only when `takeFood()` returns an item.
- `completeWoodHarvestDuty()` is the chop→deposit semantic commit used by `NpcAgent`: empty `harvestedYields` skip deposit, wood-duty relief, and Plan progress; non-empty yields keep exact `branch`/`beam` deposit plus branch-equivalent progress.
- No reservation manager, no new action FSM, no time-skip changes, no new trace event (physical action still completes; next `choose()` re-plans).
