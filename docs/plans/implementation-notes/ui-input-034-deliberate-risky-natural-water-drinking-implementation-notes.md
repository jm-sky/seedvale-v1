# Implementation Notes: ui-input-034 — Deliberate risky natural-water drinking

## Current code findings

- `src/app/actions/survivalActions.ts::drinkFromWaterSource()` is already the single authoritative commit point. It mutates thirst, increments `player.waterDrinkEventCount`, rolls deterministic unsafe-water poisoning, and applies optional `consumptionRisk`. Do not move any of those effects into UI/targeting code.
- Risk is broader than the plan's old warning wording suggests: `quality === 'unsafe'` now feeds the real temporary-condition poisoning path (`shared/waterPoisoningExposure.ts`), while `consumptionRisk` is the separate player-well HP/Vigor risk. A confirmation policy should therefore be a pure predicate over the current `WaterSource`: risky iff `quality === 'unsafe' || consumptionRisk != null`; `undrinkable` remains an action rejection, not a confirmable risk.
- `WaterSource` is reconstructed live. Natural river quality is already resolved in `buildInteractables()` through `bundle.riverWaterQuality`; player-well risk is reconstructed from current roof condition by `wellWaterSource`. Do not capture a `WaterSource` snapshot and trust it later when confirming.
- `FlavorDialog` already supports executable contextual actions, but the repo also now has generic `vueUi.openActionConfirm(...)` / `ActionConfirm` (ui-input-016). The plan's instruction to use FlavorDialog is stale. Reuse `openActionConfirm`; do not extend `interactionView.ts`, `FlavorDialog.vue`, or add another confirmation UI contract.

## Recommended implementation shape

### Risk policy and commit

Add a small pure helper next to the shared water-source contract (or another existing water policy module), e.g. `requiresRiskyWaterDrinkConfirmation(source)`. Keep it data-only; no UI imports.

In `gameLoop.ts`, route every **direct player drink** through one local helper instead of handling risky checks independently in `well`, `waterEdge`, and `playerWell` branches:

1. safe source -> existing `drinkFromWaterSource(source)` immediately;
2. unsafe / `consumptionRisk` -> open `openActionConfirm` with explicit risk wording and confirm label such as `Napij się mimo ryzyka`;
3. undrinkable -> call the existing action immediately so its canonical rejection/toast remains authoritative.

The confirm callback must re-resolve the source from stable world identity/context before committing:
- natural `waterEdge`: re-run the current shoreline/source resolution for the intended pickup location/current player context rather than retaining only the old `WaterSource`;
- `playerWell`: relookup the well by `wellId` and rebuild `wellWaterSource`; this matters because repair/roof condition can change risk/availability;
- generic settlement `well`: stable safe source; still keep the common helper path.

If revalidation no longer yields the intended usable source, no drink mutation should occur. Do not increment counters or roll exposure until the final `drinkFromWaterSource()` call.

Also route the `playerWell` repair-dialog `Napij się` callback through the same deliberate-drink helper; otherwise the risky well remains a bypass.

### Target arbitration

Current non-combat order is still `pickInGaze(...) ?? buildDigTarget(...) ?? buildCombatTarget(...)`, so a synthetic `waterEdge` returned by gaze prevents both fallbacks. Do **not** globally reorder gaze vs dig/combat: that would regress concrete interactables.

Apply a narrow post-gaze arbitration:
- if gaze winner is not `waterEdge`, keep it;
- if it is `waterEdge` and held tool has `fishing`, keep it;
- otherwise allow a valid `buildDigTarget()` or living `buildCombatTarget()` to replace that plain shoreline target according to intent.
- In active combat, current code already resolves living target/combat fallback before dig and does not use normal gaze water unless world-cycle is explicitly selected; preserve that behavior.

Prefer one small pure/classification helper if needed by tests. Do not remove `waterEdge` from `interactables`, `rankInGaze`, or `cycleCandidates`: explicit Tab selection must remain possible.

Be careful with `gazeStableTargetKey`: store the final arbitrated target, not the pre-arbitration shoreline candidate.

### Fill/fishing

Leave `fillWaterskin()` and container fill semantics untouched. `[R]` on ordinary water remains immediate and `undrinkable` remains rejected by the existing action.

Fishing is distinguished at dispatch time by `hasItemCapability(heldTool.held(), 'fishing')`; use that same capability for arbitration rather than introducing a second fishing state.

## Tests worth adding/updating

- Pure water-risk predicate: safe / unsafe / undrinkable / safe+`consumptionRisk`.
- Focused target-arbitration tests: plain shoreline loses to valid dig/combat; fishing shoreline does not; concrete gaze target is unchanged.
- Existing `survivalActions.test.ts` should continue proving mutation/roll semantics. Add no UI framework solely for confirmation.
- For confirmation integration, test the extracted/revalidation helper where practical: cancel/no callback => no mutation; confirm invokes commit once; stale/re-resolved source cannot consume the captured old source.

## Related work / pitfalls

- `world-terrain-046-unified-water-shore-query-and-river-hotpath` is planned and may later replace shoreline-query internals. It is not a blocker; keep revalidation behind the existing shoreline/source boundary so that plan can swap implementation without changing confirmation policy.
- `ui-input-028` changed target/cycle lifecycle and `ui-input-015` added gaze hysteresis/structured prompts. Avoid bypassing their final-target identity/cycle behavior.
- Do not change poisoning probabilities, `waterDrinkEventCount` semantics, river-quality resolution, liquid-container taint limitations, or persistence.

## Suggested implementation order

1. Add/test pure risky-drink predicate.
2. Add one deliberate direct-drink + live-source revalidation path and route all direct-drink call sites through it.
3. Add narrow `waterEdge` arbitration and focused tests.
4. Run targeted tests + `tsc`/lint/build as required. Browser verification remains with the User.
