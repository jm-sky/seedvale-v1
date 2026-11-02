# Implementation notes — world-terrain-058 finite continent and global hydrology

Recon by Opus 2026-11-02 (queue Q69) at `21e5de82`. Verify against current code before each slice; record discrepancies here.

## Entry points per slice

### W1 — continent mask

- `sampleRawTexel` (`src/terrain/chunkHeightmap.ts` ~L492): apply the mask to `c` **right after** `const c = fbm01(...)`, before `continentBiasSpline.get(c)` and `landWeight`; return the masked value as `continentalness` so map/biome/coast classifiers (`terrainClassification.ts`, `biomeRegions.ts`, `mapProjection.ts` `classifyMapTexel`) agree without changes.
- Mask noise: reuse the `continent` handle at a much lower frequency on the angle/radius (no new noise handle needed; if one is added, extend `NoiseHandles` + `noiseHandlesFor` with a fresh XOR salt). Mask parameters belong in `worldConfig.terrain.region` (new `continentMask` block: `innerRadius`, `coastRadiusMin/Max`, `edgeBand`, `centreJitter`); `region` is merged by a shallow spread in `src/config/worldConfig.ts` (~L451–L480) with nested defaults captured first (`continentFbm`, `roadNetwork`, `village`, …) — add the same capture for the nested `continentMask` block so a partial persisted config keeps its defaults, and update both config tests (`worldConfig.test.ts`, `persistConfig.test.ts` literal region objects).
- `RawSampleParams` already carries `region`, so every fingerprint that hashes params changes automatically; still bump the algorithm versions (`CHUNK_TILE_CACHE_VERSION` 17, `SETTLEMENT_DEFINITION_CACHE_VERSION` 15, `ROAD_ROUTE_CACHE_VERSION` 5, `LOCATIONS_COARSE_VERSION` 2, `CAVES_V2_VERSION` 3, `ABANDONED_CEMETERY_VERSION` 5 — only those whose output changes on the census).
- Bounded settlement grid: cells come from `cellsWithinRadius` (`src/settlement/settlementGenerator.ts` L174) and lookups through `settlementDefFor` (`src/settlement/settlementPlanCache.ts` L481). Return `null` for a cell whose centre is outside `±(4096 − SETTLEMENT_GRID_STEP)` before any sampling; route building then has no neighbours there.
- Census tool pattern: `scripts/perf/census-rivers.ts` (tsx script, `pnpm worldgen:*:census` entry in `package.json`). Rays: for each of 8 directions count settlements whose centre lies within ±150 m (half the pitch) of the ray, up to the coast — ±300 m double-counts the adjacent grid row (Q71).

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

## H1 results (Q73, 2026-11-02)

Landed: `src/terrain/worldHydrology.ts` (pure; `computeWorldHydrology`, `sampleRawFloorRows`, sparse blocks, `unpackChains`, `hashWorldHydrology`), `src/terrain/worldHydrology.test.ts` (synthetic grids), census `pnpm worldgen:rivers:census --model=global [--check-strips=4] [--verbose]`. Shared helpers exported from `riverNetwork.ts`: `smoothChainPoints`, `meanderChainPointsWith(points, noise, taperAt)` (the tile version now delegates to it), `MEANDER_NOISE_SEED_XOR`, `RIVER_MEANDER_TAPER_DISTANCE`. Grid is 1537² (±6144, step 8 m), raw floor from `sampleFloorAt` (no registry exists yet).

Differences from the plan text, all deliberate:

- **Flow tie-breaking** uses steepest slope per distance (not V3's `+0.0005` diagonal bias, which with ε = 2e-4 hid the diagonal parent on flats and made breaches fail: `noExit` 1710 → 12).
- **Large pits are lakes without a breach attempt** (V3 behaviour); the plan wording "breach when a graded cut exists" would drain every shallow big basin. Revisit if lakes look wrong.
- **Chains end at the shoreline**, not at the first sea cell: the last point is interpolated between the last land cell and the water cell and sits exactly at the receiver level (sea `waterLevel`, lake level). A branch ending in a join is snapped onto the finished trunk polyline (exact topological join); the surface is non-increasing downstream (join: trunk level wins, the stretch upstream is lifted).
- **Meander** is kept, tapered to 0 over 32 m towards both ends of each chain (tile-rect taper dropped).
- Breach cut cap is checked against the **original** floor (cumulative cuts from several breaches cannot exceed it).
- `breachMinFloorM` 0 (pits whose floor is above the water can be breached towards the sea; targets are clamped to `waterLevel + 0.02`).

Calibration (defaults in `DEFAULT_WORLD_HYDROLOGY_OPTIONS`; `lakeMinCells` 120 → **80** because 80 cells = 0.51 ha is exactly the "no lake under 0.5 ha" floor):

| Seed | land km² | chains / km | ends sea · lake · join · edge | dry sinks | seabed km | mouth err | pits | breach tried / ok | max cut | filled pits (% land) | lakes (ha min · median · max) | sea-level lakes | sample / compute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 34.8 | 1806 / 288.6 | 768 · 356 · 682 · 0 | 0 | 0.32 | 0.000 m | 12262 | 11993 / 11022 | 3.00 m | 2588 (**3.93 %**) | 254 (0.51 · 0.86 · 45.3) | 15 | 4.4 s / 1.1 s |
| 415424794 | 36.4 | 1838 / 283.6 | 725 · 401 · 712 · 0 | 0 | 0.25 | 0.000 m | 12583 | 12300 / 11413 | 3.00 m | 2644 (**3.55 %**) | 264 (0.51 · 0.92 · 42.2) | 27 | 4.1 s / 0.9 s |

- Determinism: identical hash from one pass and from 4 row strips (`678da264` seed 42, `f2d77d47` seed 415424794 at `WORLD_HYDROLOGY_VERSION` 1); no `Math.random`.
- Seabed length 0.25–0.32 km (< 0.12 % of chain length) is the final shoreline segment of sea mouths seen at grid quantisation (last two segments / near-end), not chains over open sea. Mid-chain "seabed" seen earlier was a census artefact (raw sample at the midpoint vs the carved grid cell); the census now judges ground at grid level (`cell floor + correction`).
- Knob sweep on 415424794 (filled % of land): cut 3 m/len 48: 9.98 % → 6.07 % after the flow fix → 4.40 % with `lakeMinCells` 80 → 3.55 % with `breachMinFloorM` 0; cut 4 m: 3.20 % → 2.8 % (seed 42). Breach length 96 changes nothing (failures are `tooDeep`: 385 pits at 3 m, 84 at 4 m, plus 0 short-floor ones). Flank slope/radius have no measurable effect on the filled share.
- **Open fork (queue §3, Q73):** the targets "max breach cut ≤ 3 m" and "filled ≤ 3 % of land" cannot both be met; options and recommendation are recorded there. Lake density (~250–265 lakes per ~36 km², median 0.9 ha) is also a look decision.
- Fills reach 4.3–6.3 m in the deepest small pits (2.5 k cells > 2 m); they are flat-bottomed meadows by policy.
- Not done here (by slice design): runtime install, cache namespace, `hydrologyId`, correction in `sampleRawTexel`, river tiles as a view (H2/H3); heads near settlements (H4). No cache versions bumped (nothing consumes the module yet).

## H2 results (Q74, 2026-11-02)

Landed: `hydrologyId` in `RawSampleParams` (required; produced by `rawSampleParamsFromWorld` via `hydrologyIdFor`, carried by `ChunkManagerConfig` and `WorldKnowledgeTerrainSnapshot`), `src/terrain/worldHydrologyRegistry.ts` (`installWorldHydrology` / `worldHydrologyFor` — throws when missing — / `clearWorldHydrology`), `worldHydrologyCache.ts` (namespace `hydrology`, version 1, one record per seed, fingerprint = `hydrologyId`; registered in `WORLDGEN_FIXTURE_NAMESPACES`), `worldHydrologyRuntime.ts` (`ensureWorldHydrology`: registry → cache/fixture → compute from 12 row strips across the pool → install in registry + workers; de-duplicated), pool kinds `hydrologyRows` (foreground, before tiles) and `installHydrology` (no response — a worker handles messages in order, so every later job sees the data; the pool keeps installs and sends them from its single `spawn()` path, so any later-created worker gets them first), boot stage `worldHydrology` in `buildWorldSystems` before the road cache / chunk manager, boot log line `[world-hydrology] <source> id hash total [sample compute]`.

- **`hydrologyId`** = `h<WORLD_HYDROLOGY_VERSION>-<fingerprint of {hydrology options, every terrain input}>`. A knob or version change re-hashes it, so dependent fingerprints (chunk tiles, settlements, roads, locations, caves, cemeteries — everything that hashes the params) change by construction. Nothing reads the registry yet, so no cache namespace needed a version bump in H2 (they are re-keyed through the new field instead).
- **Missing id throws** is implemented by `worldHydrologyFor` (tested). `sampleRawTexel` does **not** call it yet: it only starts reading the data in H3 (correction layer), and throwing earlier would break every hand-built test param for no gain. H3 adds the lookup in `sampleRawTexel` and a test helper that installs a flat hydrology; test params currently use `hydrologyId: 'test-hydrology'`.
- **Pool does not respawn workers today** (`onerror` reuses the worker); `spawn()` is the single creation path, so a respawn added later inherits the installs. Install is re-sent to a recreated pool via `ensureWorldHydrology` (registry hit → `installChunkWorkerHydrology`, a no-op for the same data).
- **Determinism / cold vs warm** (tsx, one thread, `h2check`): seed 42 hash `678da264`, seed 415424794 `f2d77d47` — identical to H1, identical after the cache round-trip (structured clone), cold 4.3–4.4 s sampling + 1.0 s compute single-thread, warm (cache) 24–26 ms. In the browser the 12 strips run on the pool (not measured here — WSL browser boot numbers go to P1).
- **Browser-verified (WSL Chrome, Vite dev server, `?benchmark=stream` = seed 42, fresh profile, CDP console capture, 2026-11-02):** cold boot `[world-hydrology] computed … hash=678da264 total=13865ms sample=11322ms compute=2041ms` — the hash equals the single-thread tsx hash, so strips across the real worker pool + main-thread compute are byte-identical; same profile again: `cache … hash=678da264 total=668ms` (IndexedDB read of 6.5 MiB included). **The 11.3 s cold sampling is a dev-server number** (every worker first loads the unbundled module graph; tsx single-thread sampling is 4.3 s) — not a regression claim; the production-build cold/warm boot A/B belongs to P1. In that run the unrelated fixture fetch (`Failed to fetch`) and an `App.vue` dynamic import failed while the dev server was busy; the world still booted to the hydrology stage. Not checked: gameplay/visual (no consumer yet).
- **Memory (open, measured):** payload per copy **6.46 MiB (seed 42) / 6.48 MiB (415424794)** — correction 211 blocks = 3.4 MiB, basin 142–156 blocks = 1.2 MiB, chains ≈ 1.9 MiB. The plan's budget "≤ 4 MB per copy" is exceeded for correction + basin alone (4.6 MiB) and in total; × (main + up to 6 workers) ≈ 45 MiB. Options when H3 starts (not decided): `Float16`-style quantisation of the correction (cm), shrinking blocks 64 → 32, or keeping chains out of the workers (they only need correction + basin + lake table; chains are used on the main thread and in `riverTile` jobs that move to the main thread in H3).
- **Fixtures (open, for P1):** a `hydrology` record is ≈ 2.05 MiB gzip per seed, on top of today's 2.4–3.0 MB fixtures → the ≤ 3 MB cap would be exceeded after the P1 re-export. Until then the existing fixtures simply contain no `hydrology` record (cold compute once per browser profile). Decide in P1 (e.g. drop chains from the fixture record and recompute them, or raise the cap).

## Pitfalls

- Hydrology must never read the corrected terrain, settlements, roads or `waterH` (cycle). Settlement code may read hydrology, never the other way round.
- A sampler call before install must fail loudly; a silent fallback would write uncorrected terrain into the caches under a corrected fingerprint.
- Memory: one structured-clone copy per worker; keep payloads sparse (64 × 64-cell blocks) and measure in H2.
- Every slice that changes worldgen bumps its namespaces; fixtures are re-exported once in P1 (the importer filters stale versions, so stale fixtures only cost a cold boot meanwhile — note it in boot-times if measured).
- The census numbers in Q44/Q47/Q58 notes become stale after H3; do not compare across.
