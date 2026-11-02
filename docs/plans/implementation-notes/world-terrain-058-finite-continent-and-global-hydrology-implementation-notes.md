# Implementation notes — world-terrain-058 finite continent and global hydrology

Recon by Opus 2026-11-02 (queue Q69) at `21e5de82`. Verify against current code before each slice; record discrepancies here.

## Entry points per slice

### W1 — continent mask

- `sampleRawTexel` (`src/terrain/chunkHeightmap.ts` ~L492): apply the mask to `c` **right after** `const c = fbm01(...)`, before `continentBiasSpline.get(c)` and `landWeight`; return the masked value as `continentalness` so map/biome/coast classifiers (`terrainClassification.ts`, `biomeRegions.ts`, `mapProjection.ts` `classifyMapTexel`) agree without changes.
- Mask noise: reuse the `continent` handle at a much lower frequency on the angle/radius (no new noise handle needed; if one is added, extend `NoiseHandles` + `noiseHandlesFor` with a fresh XOR salt). Mask parameters belong in `worldConfig.terrain.region` (new `continentMask` block: `innerRadius`, `coastRadiusMin/Max`, `edgeBand`, `centreJitter`); `region` is merged by a shallow spread in `src/config/worldConfig.ts` (~L451–L480) with nested defaults captured first (`continentFbm`, `roadNetwork`, `village`, …) — add the same capture for the nested `continentMask` block so a partial persisted config keeps its defaults, and update both config tests (`worldConfig.test.ts`, `persistConfig.test.ts` literal region objects).
- `RawSampleParams` already carries `region`, so every fingerprint that hashes params changes automatically; still bump the algorithm versions (`CHUNK_TILE_CACHE_VERSION` 17, `SETTLEMENT_DEFINITION_CACHE_VERSION` 15, `ROAD_ROUTE_CACHE_VERSION` 5, `LOCATIONS_COARSE_VERSION` 2, `CAVES_V2_VERSION` 3, `ABANDONED_CEMETERY_VERSION` 5 — only those whose output changes on the census).
- Bounded settlement grid: cells come from `cellsWithinRadius` (`src/settlement/settlementGenerator.ts` L174) and lookups through `settlementDefFor` (`src/settlement/settlementPlanCache.ts` L481). Return `null` for a cell whose centre is outside `±(4096 − SETTLEMENT_GRID_STEP)` before any sampling; route building then has no neighbours there.
- Census tool pattern: `scripts/perf/census-rivers.ts` (tsx script, `pnpm worldgen:*:census` entry in `package.json`). Rays: for each of 8 directions count settlements whose centre lies within 300 m of the ray, up to the coast.

### W2 — distance-aware sizes

- Owner: `resolveSettlementProgressionPolicy` (`src/settlement/settlementProgression.ts`). Remove the early `return null` for explicit `homeSize`; the home size is taken from config when explicit, from the home probe when `auto`. `nearMinimumForHome` stays.
- Add a mid target (ring 2–3, `LG`, own order salt — must not reuse `cellSeed`, near/far salts) and change the far minimum to `XL`; skip cells already chosen. `minimumFor(cell)` keeps the API.
- Caps: the roll is applied in `generateSettlementCore` (`settlementGenerator.ts` ~L385–L395: `rollVillageSize` → home clamp → `maxRolledVillageSize(provisional, minimumSize)`). Add the ring cap there via a new `maximumFor(cell)` on the policy (`minRolledVillageSize` already exists). Cap before the minimum so a guaranteed cell can exceed the cap of its ring only when its guarantee says so (`XL` is only guaranteed in ring ≥ 3, so no conflict).
- The policy feeds the settlement-definition fingerprint (`activateSettlementDefinitionCacheForWorld`, `settlementPlanCache.ts` ~L218) — check the fingerprint includes the new targets.

### H1 — pure global hydrology

- New module `src/terrain/worldHydrology.ts` (pure, no Three.js, worker-safe). Reuse from `hydrology.ts`: `D8_DIRECTIONS`, `StreamThresholds`/`classifyStreams` thresholds semantics, `DEFAULT_RIVER_THRESHOLDS` (`riverNetwork.ts`). Reuse from `riverNetwork.ts`: `RiverPoint`/`RiverChain` types, `smoothChainPoints`, `meanderChainPoints` (drop the core-rect taper for global chains), width/depth helpers unchanged.
- Donor: V3 `../seedvale-v3/src/game/world/gen/hydrology.ts` (`seaMask`, `flood`, `labelPits`, `tryBreach`, `generateHydrology`) and `world/rivers/riverChains.ts` (`extractRiverChains`, `lakeFeeding`, `lakeSourcePoint`, `rampToLevel`, `clipRuns`); `LAKE` constants in `src/game/config/world.ts`. V3 relief is 20–110 m — **do not copy cut depths**, V1 relief is `heightScale` 18.
- Output type (single owner, serialisable as typed arrays only): `{ version, hydrologyId, cellStep, size, originX, originZ, correction: SparseBlocks<Float32Array>, basin: SparseBlocks<Uint16Array> /* lake id + 1 */, lakes: { id, level, cells, outletX, outletZ }[], chains: packed Float32Array + offsets }`. Pack chains as one `Float32Array` of `(x, z, elevation, accumulation)` plus a `Uint32Array` of offsets, so the worker transfer and IndexedDB record stay cheap.
- Floor sampling uses `sampleFloorAt` **with the correction disabled** (raw). Expose an internal `sampleRawFloorGrid(rows, params)` used by H2 strips; it must not touch the registry.
- Determinism: priority queue ordered by `(height, index)`; no `Math.random`; floats summed in a fixed order.
- Extend `scripts/perf/census-rivers.ts` with `--model=global`: same classification of chain endings (sea / lake / join / dry), seabed length, mouth level error, lakes (count, area, level), filled area, breach cuts (max, histogram), heads near settlements (for H4).

### H2 — runtime install

- Boot: `src/app/worldBundle.ts` — insert stage `bootMark('worldHydrology')` **before** `buildChunkManager` (~L1358); nothing before it may call a terrain sampler for this seed (verify: `createApp.ts` ~L776 imports the fixture first, which is fine and must stay first so the `hydrology` record is in IndexedDB).
- Registry: `src/terrain/worldHydrologyRegistry.ts` — `installWorldHydrology(data)`, `worldHydrologyFor(id)` (throws when missing). `sampleRawTexel` reads `params.hydrologyId`; tests that build `RawSampleParams` by hand need a helper that installs a flat (no-op) hydrology — add one to the existing test param factories rather than per test.
- `hydrologyId` goes into `RawSampleParams` and is produced by `rawSampleParamsFromWorld` (`src/world/map/mapProjection.ts` L56) — the single factory; check the other places that build `ChunkTileParams` (`chunkManager.paramsFor()`).
- Worker pool (`src/terrain/chunkWorkerPool.ts`): new request kinds `installHydrology` (payload, structured clone per worker, kept by the pool and re-sent to any worker created later, e.g. after `onerror` ~L295) and `hydrologyRows` (strip sampling, transferable result). Protocol types in `chunkHeightmapProtocol.ts`; handler in `chunkHeightmap.worker.ts` (~L44 dispatch). Jobs must queue until install is acknowledged.
- Cache: new namespace `hydrology` (pattern: `chunkTileWorldgenCache.ts` header + `worldgenCacheDb.ts` `getCacheRecord`/`putCacheRecords`), one record per `hydrologyId`; register it in `WORLDGEN_FIXTURE_NAMESPACES` (`src/persistence/worldgenFixtureNamespaces.ts` L18) with its version.

### H3 — correction + view

- Correction: in `sampleRawTexel`, `floorH += correctionAt(x, z)` (bilinear on the 8 m grid, sparse block lookup; 0 outside blocks). `h` and the lake level from L1 build on the corrected floor.
- View: `computeRiverTile(tile, sampleParams)` in `riverNetwork.ts` returns `clipRuns(globalChains, riverTileCoreRect(tile))` from the registry. Consumers (`riverTileCache.ts` L86, worker `riverTile` L101, `riverQuery.ts` L53, `mapRasterTile.ts` L137, `debug/locationQueries.ts` L140/L241) stay unchanged. With the view this cheap, the worker `riverTile` job can answer on the main thread; keep the job kind until P1 deletes the legacy path.
- `riverWaterQuality.ts` derives quality from chain accumulation/elevation (method note ~L21) — global chains keep those fields, check its tests.
- `?hydrology=legacy` must change `hydrologyId` (so legacy and new never share cache records) — e.g. `legacy-<seed>`.

### H4 — sources vs settlements

- `findSettlementSite` (`src/settlement/findSettlementSite.ts` L170) already receives `riverSegments` and hard-rejects plaza-in-channel. Add the head list (chain starts that are not lake-fed) from the registry for the search box, reject candidates whose footprint + 24 m contains one, and keep the best rejected candidate as fallback when none passes (count fallbacks in the census).

### L1 — lake water semantics

- Universal rule after L1: **water present ⇔ `h − floorH > 1e-4`** (`h` is the clamped height, `floorH` the corrected floor). For chunk data that is `heights[i] > floorHeights[i]` (both arrays exist in `ChunkTileData`); for analytic main-thread checks use `sampleRawTexelAt(...)` fields or add `sampleWaterSurfaceAt` next to `sampleHeightAt`/`sampleFloorAt` in `chunkHeightmap.ts` (L654–L660).
- `sampleLocalWater(clampedHeight, floorHeight, waterLevel, …)` (`waterSample.ts`): the lake/ocean branch becomes `clampedHeight > floorHeight` with `waterSurfaceHeight = clampedHeight`; drop the `waterLevel` argument or keep it only for the sea-level fallback.
- Sites comparing a height against `waterLevel` (54, grep `(<=|<|>=|>) ?…waterLevel`), most per file: `chunkEnvironment.ts` 8, `chunkVegetation.ts` 7, `settlement/props.ts` 6, `biomeColors.ts` 5, `villagePlanner.ts` 4, `waterBodyKind.ts` 3, `waterBodies.ts` 3, `chunkItems.ts` 3, then 1–2 each in `grassPlacement`, `findSettlementSite`, `createItemSpawners`, `NpcAgent`, `waterMirror`, `createWater`, `createGrassForagePatches`, `caveUndergroundPool`, `terrainClassification`, `chunkCrops`, `abandonedMineDeposits`, `villagePasture`, `villagePaddock`, `roadNetwork`, `pathDryness`, `livestock`, `createFauna`, `animalRoaming`, `locationQueries`, `perf/benchmark`. Classify each: (a) "is this water" → rule above; (b) "is this below sea" (ocean/coast semantics: coastal resources, `oceanMixAt`, shore sand) → keep `waterLevel`; (c) rendering offset → per-level. Record the table here.
- `detectWaterBodies(heights, apronRes, waterLevel, step)` (`chunkHeightmap.ts` ~L1183, `waterBodies.ts`) must group texels by surface (`heights[i]`), so a lake gets its own `lakeScaleFor` body scale.

### L2 — lake rendering

- `createChunkWater` (`src/world/createWater.ts`): mask `heights[i] <= waterLevel + 0.35` (L59) and `mesh.position.y = waterLevel + 0.07` (L85) assume one level. Call it once per distinct surface level present in the chunk (ocean and lake chunks are rare together); the material is the shared lake/ocean family (`waterMaterial.ts`). Reflection per the author's answer; for option (a) the planar mirror sample must be disabled for meshes not at `waterLevel` (uniform on the material instance).
- Chunk manager owns the per-chunk water (`chunkManager.ts`, `createChunkWater` import L63; update/day-night loops ~L1167–L1180 iterate per chunk record — they must iterate all water meshes of a record).

### E1 — world edge

- Player: `src/player/PlayerController.ts` (swim state ~L94, `verticalMotion.ts`), water eligibility `src/player/worldWaterEligibility.ts`. Push-back = horizontal velocity term while swimming/wading outside the edge radius; hard clamp of the position at ±4096 m for every movement owner (player, `NpcAgent`, fauna `animalRoaming.ts`).
- Map: `MAP_EXTENT_HALF` already 4096 (`mapConfig.ts`).

## Pitfalls

- Hydrology must never read the corrected terrain, settlements, roads or `waterH` (cycle). Settlement code may read hydrology, never the other way round.
- A sampler call before install must fail loudly; a silent fallback would write uncorrected terrain into the caches under a corrected fingerprint.
- Memory: one structured-clone copy per worker; keep payloads sparse (64 × 64-cell blocks) and measure in H2.
- Every slice that changes worldgen bumps its namespaces; fixtures are re-exported once in P1 (the importer filters stale versions, so stale fixtures only cost a cold boot meanwhile — note it in boot-times if measured).
- The census numbers in Q44/Q47/Q58 notes become stale after H3; do not compare across.
