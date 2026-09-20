# Implementation Notes: Bidirectional cave traversal safety

**Plan:** `world-terrain-034-bidirectional-cave-traversal-safety.md`  
**Reviewed against:** `main`, 2026-09-21  
**Implemented:** 2026-09-15 (interior chamber ramps); **reopened fix:** 2026-09-21 (mouth transition)

## Why the first pass missed the mouth

Interior widening→chamber cliffs were real and fixed (lobe floor axis follows incident centerlines). Tests and notes explicitly skipped the portal:

- `expectInteriorSegmentsWalkable` did `if (seg.from === 'entrance') continue`
- `mainRouteFromMouthInterior` kept only the inward end of the entrance segment
- reverse traversal stopped at mouth interior, never `surface → mouth → interior`

So the suite never proved the gameplay path through the carved portal.

## Real causes of remaining one-way exits

1. **Mouth carve pit** (`mouthCarve.ts`): smoothstep peak grade `1.5 · depth / radius` with `depth=2.4`, `radius=1.65` ≈ 65° > `SLOPE_MAX_WALKABLE_DEG` (55°). `constrainToSlope` allows downhill enter and strips uphill exit. Final walk surface is `base − mouthCarveDepth`, soft-unioned into the heightfield at the mouth.
2. **Heightfield floor union**: soft-min of the two *lowest* floors let a wide downstream segment (still `t = 0` metres upstream of its start) dig a cliff into the transition ramp. Topology centerline grade stayed legal; gameplay floor did not.

## What shipped (2026-09-21)

### Mouth carve

`CAVE_MOUTH_RADIUS` is derived from `CAVE_MOUTH_DEPTH` and `SLOPE_MAX_WALKABLE_DEG` with a safety factor so the analytic pit (and combined mouth+approach profile) stays under walk-max. `CAVE_APPROACH_RADIUS` stays ≥ mouth radius. Depth / entrance Y semantics unchanged.

### Heightfield floor ownership

Floor Y comes from the influence with the smallest metric lateral `dist` (lowest floor on a tie). Ceiling still soft-maxes the two highest operands. Downstream fat cores no longer own upstream ramp floors.

`resolveHeightfieldHorizontal` treats standable open-sky as identity only when `gap >= minGap`; collapsed open-sky rim is pushed like ordinary fringe so a wider mouth cannot walk a capsule out of void.

### Cache

`CAVES_V2_VERSION` bumped to `2` (mouth geometry + heightfield algorithm identity).

## Invariant now enforced

Every accepted production topology under test must keep the **final gameplay floor** (hybrid `queryHeightfieldGround` / carved `walkSurfaceAt`) within `tan(SLOPE_MAX_WALKABLE_DEG)` and step `< 1 m` on:

- `surface → mouth → interior` along `openingDirection`
- `interior → mouth → surface` (reverse)
- full main-route hybrid including the entrance segment, both ways
- interior segments (unchanged chamber/widening checks)

Topology centerline grade alone is not sufficient.

## Regression coverage

- [`productionTopology.floor-continuity.test.ts`](../../src/world/caves/productionTopology.floor-continuity.test.ts) — Grota `1136726869` + seeds `[42, 99, 7, 1]`; `expectMouthTransitionWalkable` / hybrid sampler
- [`caveMouthGeometry.test.ts`](../../src/world/caves/caveMouthGeometry.test.ts) — combined carve grade ≤ walk-max; radius expectations follow derived constants

Browser verification wykonuje User.
