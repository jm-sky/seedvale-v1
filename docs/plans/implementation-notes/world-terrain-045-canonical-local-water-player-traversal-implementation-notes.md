# Implementation Notes: world-terrain-045 Canonical local water player traversal

**Plan:** `docs/plans/world-terrain-045-canonical-local-water-player-traversal.md`  
**Reviewed against:** `main`, 2026-09-21

## Implementation status (2026-09-21)

Implemented as designed below.

- **`ChunkManager`**: added `sampleRuntimeLocalWater` (`RuntimeLocalWaterSampler`, `PlayerController.ts`) plus a pure, unit-testable core `sampleResidentLocalWater` (`chunkManager.ts`, exported for `chunkManager.test.ts`). `ResidentChunkSnapshot` gained optional `riverGameplaySegments`/`fordProjections` alongside its existing `tile`/`bridgeSpecs`, reusing the exact same `ready && tile` residency gate `sampleResidentHeight`/`sampleResidentSurfaceGround` already use — `ensureLoaded()` always resolves river/ford data before a chunk reaches `ready`, so no separate availability check was needed for them. The new query samples `tile.heights`/`tile.floorHeights` directly (never `readField()`) and composes them through the existing pure `sampleLocalWater()` (`waterSample.ts`, unchanged). Old `sampleLocalWater` (the `readField()` hybrid) is untouched and stays the analytical-fallback convenience for fauna/rendering/off-screen callers — out of scope per plan.
- **Player**: `PlayerController` dropped its `sampleFloor`/scalar `waterLevel` constructor params entirely (only consumers were the old swim path being replaced here — confirmed no other call sites in `createApp.ts` or elsewhere) in favor of one `sampleResidentLocalWater: RuntimeLocalWaterSampler` field, threaded through `create()`/`createCapsuleFallback()`/`setGround()`. `worldWaterOwnsVertical()` now takes the sampled `LocalWaterSample` and checks `sample.present` + `ground.height <= sample.waterSurfaceHeight` (the bridge-deck-stays-dry rule) instead of the scalar `waterLevel`. `updateVerticalMotion()` gates on the sample the same way 044 gates the horizontal step: `null` (unavailable) holds — returns without touching position/velocity/grounded, retried next tick. `snapToGround()` (teleport/construction/rebuild, not per-frame) falls back to plain ground height on `null` rather than inventing rescue behavior, since the very next `updateVerticalMotion` tick re-resolves with a real sample. `swimFeetY`/`playWaterLap` now read `sample.waterSurfaceHeight`/`sample.floorHeight` instead of `this.waterLevel`/`this.sampleFloor(x, z)`.
- **`createApp.ts`**: both `PlayerController.create()` and the rebuild `player.setGround()` call now pass `bundle.chunkManager.sampleRuntimeLocalWater` instead of `bundle.chunkManager.sampleFloor` + `bundle.chunkManager.waterLevel`.
- **Out of scope, unchanged**: `worldWaterEligibility.ts` (`worldWaterAppliesInCurrentSpace`/`swimFeetY`/cave exclusion) — existing thresholds/cave arbitration didn't depend on the old global-plane assumption, so no changes were needed there; fauna/NPC water queries (still the old `sampleLocalWater`); `WaterSource`/drinkability; shoreline classification (`world-terrain-046`).
- Verification: `npx tsc --noEmit`, full `vitest run` (8174 tests), `eslint` and `vite build` all pass. Browser verification (ocean/lake, elevated river, ford, bridge, stream-in boundary) is the user's, per plan.

## Tests added

`src/terrain/chunkManager.test.ts`, `describe('sampleResidentLocalWater (plan world-terrain-045)')`: absent record → `null`; generating record (even with river data already retained) → `null`; ready record with no tile → `null`; ready + no river → authoritative dry; ready + no river, height at/below `waterLevel` → lake/ocean depth from the runtime tile; ready + elevated river above global `waterLevel` → `present: true` from river data (the plan's core fix); ford → shaped bed via `FORD_WATER_DEPTH`; unload/reload reconstructs the same value from canonical tile + retained segments. Bridge-deck/cave-arbitration/player-integration behavior is exercised only through existing pure helpers (`worldWaterEligibility.test.ts`, unchanged) and browser verification, per the plan's "prefer pure/unit tests" guidance — `PlayerController` itself has no construction-based test harness (GLB load).

## Current state

- `src/terrain/waterSample.ts::sampleLocalWater()` is already the canonical physical-water composition. River wins over lake/ocean, returns `waterSurfaceHeight` / `floorHeight` / `depth`, and already applies `FordProjection` through `fordBedHeight()`. Do not duplicate or redesign this logic.
- `ChunkManager.sampleLocalWater()` is currently a hybrid query: terrain fields come through `readField()` (analytical fallback allowed), while river/fords come from the owning runtime `ChunkRecord`. For a missing record it uses `riverGameplaySegments ?? []` and therefore can fabricate an authoritative dry/non-river answer.
- `PlayerController` still owns water from `ground.height <= waterLevel`, then computes feet Y from global `waterLevel + sampleFloor`. This is the actual player/river divergence.
- `world-terrain-044` is still planned on current `main`. Implement 045 on top of its resident-ground contract; do not create a competing residency mechanism.

## Recommended contract

Keep `LocalWaterSample` unchanged as the successful physical result and add a separate resident/runtime sampler whose availability is explicit, preferably:

```ts
type RuntimeLocalWaterSampler = (x: number, z: number) => LocalWaterSample | null
```

`null` means the owning runtime chunk cannot authoritatively answer yet. It must not mean dry.

In `ChunkManager`, implement the resident query from the same owning ready `ChunkRecord` used by world-terrain-044:

- require `record.state === 'ready'` and `record.tile`;
- sample `record.tile.heights` and `record.tile.floorHeights` directly through the existing apron-grid helper;
- pass that record's `riverGameplaySegments ?? []` and `fordProjections ?? []` into the existing pure `sampleLocalWater()`;
- do not call `readField()` or analytical terrain/hydrology fallback;
- an empty segment array on a **ready** record is valid dry/no-river state; record availability, not segment count, distinguishes unavailable from dry.

Do not mutate the existing analytical/hybrid query unless needed for compatibility. Detailed player traversal should consume the resident query; off-screen/worldgen callers may keep their existing capability.

## Player integration

Thread the runtime local-water sampler through both `PlayerController.create()` and `setGround()` from `createApp.ts`, next to the resident movement-ground sampler introduced by 044.

Replace `worldWaterOwnsVertical()` with logic based on one sampled `LocalWaterSample`:

1. unavailable sample → detailed surface movement/vertical resolution holds and retries, using the same conservative policy as 044;
2. `present: false` → normal ground/gravity;
3. `present: true` → preserve `worldWaterAppliesInCurrentSpace()`;
4. additionally require the current resolved movement ground not to sit above `waterSurfaceHeight`.

The last check is important for bridges. A river remains physically present below a bridge, but a player standing on the deck must not enter swim mode. Do **not** make `sampleLocalWater()` return dry on a bridge.

When water owns vertical motion, use:

```ts
swimFeetY(sample.waterSurfaceHeight, sample.floorHeight)
```

and use `sample.waterSurfaceHeight` for water-entry effects. After this migration, the player-specific `sampleFloor` / scalar `waterLevel` dependencies appear to be used only by the old swim path and can be removed if 044 has not introduced another use. Avoid keeping them merely as a parallel fallback.

Keep cave arbitration exactly where it is: `groundAt()` / cave occupancy decide current space; `ChunkManager` must remain cave-unaware.

## Movement availability

Do not solve missing water independently from missing ground. 044 should already prevent a detailed step into unavailable resident terrain. 045 should extend the same boundary invariant so vertical/water resolution also refuses partial data.

Avoid a state where:

- ground is resident but water silently falls back to dry, or
- water is resident while movement ground comes from analytical fallback.

For `snapToGround()` during rebuild/teleport, follow 044's established unavailable policy rather than inventing rescue/teleport behavior.

## Bridge and fauna semantics

Keep two concepts distinct:

- **physical local water**: river remains present below a bridge;
- **actor traversal policy**: an actor on the deck does not swim.

Fauna currently composes a bridge-aware wrapper that returns `DRY_WATER_SAMPLE` for movement. Do not copy that workaround into the canonical resident water query. If 044/045 cleanup makes it practical, fauna can later consume physical water plus surface authority separately, but that refactor is not required here.

Therefore plan test “player and fauna compatible” should compare the underlying physical sample away from actor-specific bridge masking, not require identical policy output in every context.

## Tests worth adding

Prefer pure helpers plus a narrow ChunkManager record-read helper if constructing a live manager is expensive.

Cover:

- ready record + elevated river above global `waterLevel` → `present: true`;
- ready record with no river → authoritative dry/lake-ocean result;
- missing/generating record → `null`, never `{ present: false }`;
- ford → same river surface, shaped floor/depth;
- bridge → physical sample still reports river, while player water ownership is false because deck ground is above water surface;
- lake/ocean → unchanged feet Y and thresholds;
- closed cave → local surface water cannot own vertical motion;
- ready → unavailable → ready transition never emits an authoritative fabricated dry state.

Do not broaden this plan into water quality, shoreline interaction, swimming feel, hydrology generation, or render-water authority.
