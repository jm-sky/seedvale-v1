# Q34–Q35 — Author decisions: household yards, house spacing and fences

**Date:** 2026-10-31
**Status:** author requirements recorded; design and implementation not approved
**Scope:** SeedVale V1 Revival, Q34–Q35; related Q29 worldgen batch
**References:** [Q29 batch](2026-10-30--q29-revival-epoch-batch-plan.md), V1 `src/settlement/villagePlanner.ts`, `src/settlement/householdYard.ts`; V3 `docs/reviews/2026-10-17--160--pt03-yard-layout-access.md`.

## Confirmed author requirements

1. **NPC navigation is critical.** Changes to yards/fences must not impair access to houses, activity/work points or village paths. Navigation reliability takes precedence over enclosing a plot.
2. **Prefer two yard entrances.** Two usable entrances are the preferred layout, not an unconditional rule when geometry cannot support them. Each entrance must actually be reachable via the yard.
3. **No inaccessible residual spaces.** Adjacent plots and fences must not form strange geometry, sealed pockets or disconnected strips without access.
4. **Enough usable yard space.** The plot must fit profession-specific and household props (e.g. blacksmith anvil) while preserving walking access around them.
5. **Fences are optional.** Not every house requires a fence. Houses close to the settlement centre/plaza may remain unfenced.
6. **Visual verification required.** Inspect the appearance of house spacing, fences, yard shapes, entrances and terrain fit. Do not consider purely geometric/test compliance sufficient.
7. **Can be postponed.** Q34–Q35 visual/layout refinements may be deferred rather than blocking other Revival work.
8. **Prefer level yard ground.** Yard areas should be relatively even, not just the house foundation.

## Technical implications — proposals for verification, not approved decisions

- Validate door-to-gate and door-to-prop **connected** paths with the NPC navigation model and collision geometry; a visible fence gap alone is not proof of access. Check entrances in both directions and path connectivity to public roads/plaza.
- Test neighbouring polygons/fence runs together for overlaps and enclosed inaccessible pockets; do not validate each household independently only.
- Reserve circulation clearance for the chosen props before accepting plot/fence geometry, especially workplace props.
- Evaluate selectively unfenced plots near the centre, rather than assuming every house gets Q35 fencing.
- Sample terrain height/slope across the entire yard footprint and entrances; assess terrain flattening implications and visual transitions.
- Measure draw/geometry and navigation costs, and visually review representative seeds/sizes before proceeding.

## Still open

- Exact shape/size distributions for yards and profession-based variation.
- Detailed rule for when a house has no fence and when only one entrance is acceptable.
- Quantitative clearance, slope and performance budgets.
- How/when this work is scheduled relative to Q36–Q38.

**Boundary:** Q29's rectangular yard and plaza-facing single gate are *unapproved proposals*, not final requirements. No plan or implementation is authorized by this note.
