# Implementation notes: fauna-046 stamina-aware animal water crossing risk

**Plan:** `docs/plans/archive/fauna-046-stamina-aware-animal-water-crossing-risk.md`  
**Baseline:** current `main`, after fauna-015/fauna-029 and the current AnimalAgent cadence/navigation work.

## Current code contracts to preserve

- `src/fauna/waterTraversal.ts` is already the single fauna water-policy owner. It contains physical classification (`classifyWaterTraversal`), swim exertion, autonomous destination acceptance and `preferDry` A* cell cost. Put stamina-budget math and route-water evaluation here (or a tiny pure helper colocated with it), not in `AnimalLife.ts` and not in shared navigation.
- `AnimalLifeState.stamina` plus `AnimalDef.metabolism` are authoritative. Actual swimming drains `staminaDrainRate * swimStaminaExertion(def.water)` in `tickAnimalLife()`. Prediction must use exactly that rate; otherwise planner and drowning runtime will drift. `staminaRegenRate` should not be credited while a continuous segment is classified `swimming`.
- `AnimalAgent.isWalkable()` is physical ability and is shared with mounted movement. Do not make low stamina return false there. Mounted movement must remain outside autonomous risk rejection.
- `navigation.ts::findPath()` is shared bounded A*. `NavigationQuery.cellCost` is already the fauna-029 extension seam; NPC callers omit it. Avoid fauna/stamina imports or a fauna-specific result type in this module.
- Current path simplification deliberately refuses LOS shortcuts through cells with `cellCost > 1`. Preserve that: it is what forces `preferDry` routes to retain water-avoidance geometry.

## Important AnimalAgent integration details

The current ordinary movement pipeline already has a dedicated `moveNav` `NavRescue` for wander/trip/needs/attraction, separate from `chaseNav` and `fleeNav`. `stepNavRescue(..., intent)` can trigger immediate A* when direct LOS contains dispreferred swimming, and `attemptNavRepath()` injects `waterRouteCellCostAt` only for `preferDry`.

Do not bolt the new check onto target selection only. The useful seam is **after a concrete route exists and before that route becomes committed/executed**. Evaluate the actual polyline from current position through returned waypoints to destination, sampling each leg at the same bounded spatial scale used by navigation (prefer `DEFAULT_CELL_SIZE` or a derived <= cell-size step). Include the current→first-waypoint and final leg; otherwise simplified routes undercount water.

A pure route evaluator should return enough data for policy/debug without storing copied water state, e.g. total swim distance, maximum continuous swim distance, estimated stamina at the next safe exit, and a `safe | risky | unsafe` result/reason. Reset the continuous segment only on `dry` or `wading`; both are valid recovery/exit surfaces under the existing traversal contract.

### Cost model

Use time, not an arbitrary per-meter stamina constant:

`swimSeconds = swimDistance / movementSpeed`  
`staminaCost = swimSeconds * metabolism.staminaDrainRate * swimStaminaExertion(def.water)`

Compare against `life.stamina.current - reserve`, where reserve is one shared water-policy tuning constant expressed against `metabolism.staminaCapacity`. Guard zero/near-zero speed explicitly; do not let it produce Infinity/NaN paths.

Use the speed actually passed for that autonomous movement intent. Do not introduce a new per-species swim-speed field in this plan. This means gait/speed modifiers already affecting movement also affect predicted exposure time.

## Choosing an alternative after unsafe A*

A simple “find path → reject unsafe → call the same findPath again” will deterministically return the same crossing. Prefer a **fauna-owned bounded retry** rather than changing global bounds.

Lowest-risk implementation:
1. run the existing `preferDry` query;
2. evaluate the returned route;
3. if unsafe, retry once with a query-local callback that makes swimming beyond the animal's current safe budget effectively unavailable for this search, while leaving `AnimalAgent.isWalkable()` unchanged;
4. evaluate the retry too; accept only a safe ordinary route.

If a shared navigation extension is necessary, keep it generic (for example an optional query predicate/cost over candidate traversal), with no water/stamina concepts. Do not increase `DEFAULT_BOUNDS_PADDING` or `DEFAULT_MAX_NODES`.

The retry must remain bounded and tied to existing `NavRescue` cooldown/watchdog state. Cache only the accepted route/risk summary or rejection cooldown on the agent; do not cache sampled water as authority.

## Already swimming: separate survival branch

This cannot use ordinary “unsafe => reject movement”: stopping in deep water guarantees drowning.

Before ordinary wander/needs/trip retargeting, when the resolved current `waterMode === 'swimming'` and there is no still-safe committed exit route, enter a transient **water-exit recovery** state owned by `AnimalAgent`/its existing movement-nav state. Find a nearest reachable `dry`/`wading` point with a bounded local search and move toward it with `allowSwim`. This branch may spend the normal reserve; it is survival recovery, not an autonomous choice to enter water.

Do not teleport, suppress stamina drain, suppress `tickDrowning()`, or create a manager. Clear recovery immediately after reaching non-swimming water mode. Also clear/replace ordinary `sourceTarget`/trip movement consistently so a drink/wander target cannot immediately steer the animal back into deep water.

## Needs / natural-water target lifecycle

`animalForaging.ts::isDrinkableNaturalShorePoint()` should stay a destination-validity test: dry/shallow shore and existing natural-water rules. Route feasibility belongs to movement. For a committed water source, if the route becomes unsafe after stamina changes, use the existing source-target cancellation/search cooldown lifecycle rather than inventing drink-specific water geometry.

This matters because source validity and route validity are different: a perfectly valid shore point may be unreachable safely from the animal's current side.

## Emergency intents

Keep `fleeNav` / `chaseNav` on `allowSwim`; do not apply the ordinary reserve rejection there. Existing physical traversal and drowning remain authoritative, so emergency behaviour can still make a fatal crossing. Likewise do not route `driveMounted()` through the autonomous feasibility policy.

## Cadence / performance pitfall

Animal behaviour is adaptively throttled, but swimming/drowning is immediate/full-rate. Do not turn stamina changes into per-frame A* invalidation. Re-evaluate feasibility when a route is created/replaced and only when the remaining predicted budget crosses the safety threshold (or the committed exit becomes invalid). Quantize/hysterese that trigger enough to avoid shore oscillation.

Water sampling for route evaluation must be bounded by route length/search bounds; no flood-fill, river lookup or water-body scan.

## Tests worth extracting

Prefer pure tests over full-agent setup where possible:

- `waterTraversal.test.ts`: predicted cost/range from current stamina + capacity + drain + exertion + speed; reserve boundary; water-adapted case; zero speed.
- Route evaluator: include simplified long legs; reset continuous-swim distance on wading/dry; route ending in swimming is unsafe; several separated swim segments use the worst continuous segment for survival feasibility.
- `navigation.test.ts` only if the generic query contract changes.
- `AnimalAgent.test.ts` already exists and includes swimming/cadence coverage; add focused integration cases there for ordinary unsafe rejection and already-swimming exit recovery rather than assuming AnimalAgent has no harness.

## Main implementation order

1. Add pure stamina-budget + route-water evaluation in `waterTraversal.ts` and tests.
2. Integrate evaluation at `AnimalAgent` route creation/commit, retaining current `preferDry` cost behaviour.
3. Add one bounded alternative-route retry/cooldown path.
4. Add already-swimming exit recovery using existing nav state.
5. Wire source-target cancellation/revalidation and minimal debug fields.
6. Touch `navigation.ts` only if steps 2–4 cannot be expressed with caller-owned callbacks.

## Pitfalls

- Do not use total wet distance alone: drowning risk is dominated by the longest uninterrupted `swimming` segment before a dry/wading exit.
- Do not evaluate only A* grid nodes: `findPath()` returns simplified waypoints, so sample the segments.
- Do not classify ocean/river by type for survival. The canonical input remains `sampleLocalWater()` + `classifyWaterTraversal()`.
- Do not special-case horse/duck. Horse behaviour falls out of metabolism/current stamina; `waterAdapted` already lowers exertion.
- Preserve fauna-029's distinction between destination acceptance and route preference. This plan adds survival feasibility as a third layer, not a replacement for either.
- If current code changed since these notes, preserve the ownership invariants above rather than restoring an older fauna-029 call shape.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
