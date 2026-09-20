# Plan: Deliberate risky natural-water drinking

**Created:** 2026-09-21
**Status:** `planned` 📋
**Priority:** high · **Effort:** S
**Depends on:** none
**Domain:** `ui-input`
**Type:** `fix`
**Subdomains:** `interaction` `feedback`
**Tags:** `water` `player-needs`
**Roadmap:** -

## Problem

Natural shoreline water is represented by a synthetic `waterEdge` interactable. It participates in the same gaze/primary-action pipeline as concrete world targets, while `buildDigTarget()` and combat fallbacks are resolved separately. Near a lake or unsafe river this makes an accidental `[E]` capable of immediately committing a risky drink, including while the player is digging near shore or pursuing/engaging an animal.

The poisoning mechanic is intentional. The problem is that the risky action is too easy to commit accidentally.

## Goal

Make drinking from risky natural water a deliberate choice without weakening the existing water-quality/poisoning systems or creating special-case player water state.

A player should not become poisoned because a synthetic shoreline target happened to win one interaction frame. Safe water should remain quick to use, and fishing/filling should keep their existing behaviour.

## Current architecture to preserve

- `src/app/interactables.ts::resolveWaterBodyShore()` owns the synthetic lake/river/ocean shoreline candidate.
- `src/world/WaterSource.ts` owns the shared `WaterSource` / `WaterQuality` contract.
- River quality remains contextual through `WorldBundle.riverWaterQuality`; do not duplicate hydrology checks in UI/input code.
- `src/app/actions/survivalActions.ts::drinkFromWaterSource()` remains the authoritative mutation boundary for thirst, deterministic poisoning exposure and source-specific consumption risk.
- `src/app/gameLoop.ts` owns target selection and dispatch.
- Structured interaction actions/prompts remain derived through the existing interaction-view / FlavorDialog path.
- Fishing continues to reuse `waterEdge`; do not introduce a second shoreline detector or fishing target.

## Scope

### 1. Treat risky drinking as a deliberate action

For direct drinking from a `WaterSource` whose current quality/risk can cause a negative health consequence, do not immediately call `drinkFromWaterSource()` on the first primary interaction.

At minimum this includes:

- `quality === 'unsafe'` (lake and contextually unsafe river);
- a drink source with `consumptionRisk` (for example an uncovered player-built well), if it currently bypasses deliberate confirmation.

`safe` sources keep the existing immediate drink behaviour.

`undrinkable` sources remain rejected by the existing action boundary and must not gain a confirmation path that allows drinking.

### 2. Reuse the existing contextual dialog UI

Use the existing shared contextual `FlavorDialog`/structured action mechanism rather than adding a browser `confirm()`, a water-specific modal manager or another UI root.

The warning should clearly state the actual known risk, for example:

> Ta woda może być niebezpieczna. Czy na pewno chcesz zaryzykować?

Actions:

- **Napij się mimo ryzyka** — explicitly commits the existing `drinkFromWaterSource(source)`;
- **Anuluj** — closes/returns without mutating thirst, conditions, HP, vigor or drink-event counters.

Do not roll poisoning when opening the confirmation. The roll stays exactly where it is now: at committed consumption.

The confirmation must use/revalidate the actual source being consumed. A stale dialog must not allow a previously selected unsafe source to be consumed after world/target lifecycle invalidation.

### 3. Lower accidental shoreline capture

Confirmation is the safety boundary, but target selection should also express intent correctly.

Review the non-combat target composition in `src/app/gameLoop.ts`:

`pickInGaze(...) ?? buildDigTarget(...) ?? buildCombatTarget(...)`

and the fact that `waterEdge` is synthetic despite currently participating in the normal interactable list.

Implement the smallest coherent priority rule so a plain drinking `waterEdge` does not steal the primary interaction from a valid explicit tool/combat action:

- valid shovel/pickaxe ground work should win over a plain drink/fill shoreline candidate;
- an acquired living combat target / active combat intent should win over drinking;
- concrete interactables should retain their current priority semantics;
- fishing while holding a fishing-capable tool remains a deliberate `waterEdge` interaction and must not be demoted as ordinary drinking;
- do not globally remove `waterEdge` from gaze/cycling — the player must still be able to intentionally select water.

Prefer a small classification/priority helper over scattered `target.kind === 'waterEdge'` checks if more than one selection path needs the same rule.

### 4. Keep fill separate from drink risk

Do not automatically put `[R] Napełnij` behind the drinking confirmation. Filling is not itself consumption and the current liquid-container model intentionally has its own limitations.

Preserve the existing source-aware fill validation, including rejection of `undrinkable` ocean water.

If the current interaction UI combines drink/fill actions for the selected `waterEdge`, only the risky **drink** action opens confirmation.

## Non-goals

- No changes to poisoning probability, duration or condition effects.
- No new `WaterQuality` values.
- No new hydrology/shoreline detector.
- No hold-to-drink input mechanic in this plan.
- No broad rewrite of gaze targeting or combat targeting.
- No persistence changes.
- No player-only duplicate water state.
- No changes to animal/NPC drinking.

## Relevant files / integration points

Expected primary files:

- `src/app/gameLoop.ts` — target arbitration and primary/alternate dispatch.
- `src/app/interactables.ts` — `waterEdge`, shoreline/fishing prompt semantics and `buildDigTarget()`.
- `src/app/actions/survivalActions.ts` — keep final consumption/revalidation and poisoning mutation authoritative here.
- `src/interaction/interactionView.ts` — only if structured action metadata needs a reusable risk/confirmation affordance.
- `src/ui-vue/screens/FlavorDialog.vue` and its existing store/facade — reuse existing contextual dialog capability; extend generically only if the current contract cannot express confirmation.

Inspect existing tests around interaction ranking, `waterEdge`, dig targeting and survival actions before adding new harnesses.

## Acceptance criteria

1. Standing at a lake/unsafe river and intentionally choosing **Napij się** opens a confirmation instead of immediately drinking.
2. Cancelling causes zero gameplay mutation.
3. Confirming calls the existing consumption path exactly once; thirst relief and deterministic poisoning exposure behave exactly as before.
4. Safe water drinks immediately without confirmation.
5. Ocean remains undrinkable.
6. A risky player-built well follows the same deliberate-risk rule when its direct drink can cause a negative consequence.
7. With a shovel at a valid dig point beside water, the normal primary action resolves to digging rather than accidental drinking.
8. During active/acquired animal combat intent, shoreline drinking does not replace the intended combat action.
9. Fishing at lake/river/ocean still works through the existing shoreline interaction.
10. Filling a container remains independently accessible and keeps current source validation.
11. Normal concrete gaze targets and Tab cycling do not regress.
12. No poisoning roll/event counter increment occurs until the player explicitly confirms consumption.

## Tests

Add focused automated coverage for the extracted decision boundaries where practical:

- risky source requires confirmation;
- safe source does not;
- undrinkable source remains rejected;
- cancel is mutation-free;
- confirmation commits once;
- plain `waterEdge` loses to a valid dig/combat intent;
- fishing `waterEdge` keeps its intended priority;
- fill does not inherit drink confirmation.

Do not build a broad UI test framework solely for this plan. Keep gameplay policy testable outside Vue where possible.

## Verification

Run the relevant unit tests/typecheck/build required by the repository.

Browser verification belongs to the User. Suggested manual scenarios:

- lake: accidental `E`, cancel, explicit confirm;
- unsafe river: same;
- safe river/well: immediate drink;
- uncovered risky well: confirmation;
- ocean: rejected;
- shovel at shoreline: dig repeatedly without accidental drinking;
- chase/fight a wolf along shoreline: combat action remains selected;
- fishing rod at shoreline: fishing unchanged;
- `R` fill at lake/river/well and ocean rejection.

Add/update JSDoc for any important reusable target-priority or risky-consumption policy helper introduced by the implementation; use `@domain ui-input` where useful for preflight discovery.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
