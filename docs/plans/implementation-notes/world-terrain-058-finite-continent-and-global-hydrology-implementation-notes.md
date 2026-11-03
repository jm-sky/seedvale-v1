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
- Map: `MAP_EXTENT_HALF` is 6144 (`mapConfig.ts`).
- **Landed (Q79, 2026-11-03):** `src/terrain/worldEdge.ts` (pure: `clampToWorldBox`, `isInsideWorldBox`, `worldEdgePushVelocity`; box ±`WORLD_HALF_EXTENT` 6144 per 059 W3, not 4096). Push-back band = last 300 m (Chebyshev, per axis), linear 0 → 9 m/s (> walk 6 m/s) toward the origin, applied only while `swimming`; hard clamp always (`PlayerController.applyWorldEdge`, before `updateVerticalMotion`). NPC/fauna: `isInsideWorldBox` gate in `NpcAgent.isWalkable`/`isWalkableExterior` and `AnimalAgent.isWalkable` (they are land-bound, so the sea already keeps them in; this is defensive). Tests: `worldEdge.test.ts`. Not done: teleports (`setPosition`) are not clamped; push-back is felt/browser-unverified (queue §2).

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

## H3 results (Q75, 2026-11-03)

Landed (technically verified; **not** browser-verified): the correction layer and the river-tile view.

- `sampleRawTexel` (`chunkHeightmap.ts`) = `sampleRawTexelUncorrected` + `hydrologyCorrectionAt(params.hydrologyId, x, z)` (bilinear between the 4 surrounding 8 m cells; exact at cell centres where hydrology was computed; `floorH += corr`, `h = max(floorH, waterLevel)`). `sampleRawFloorUncorrected` is the only input hydrology reads (`sampleRawFloorRows`) — no cycle.
- New leaf `worldHydrologyStore.ts` (install map, correction sampler with a direct block directory, `unpackChains`, `SPARSE_BLOCK_SIZE`; types-only imports, so `chunkHeightmap` can depend on it). `worldHydrologyRegistry.ts` re-exports the install API. Missing id **throws** in the sampler.
- `computeRiverTile` = the global chains clipped to the tile core rect (`riverChainClip.ts`: Liang–Barsky per segment, interpolated boundary points, `RiverChainIndex` buckets per 256 m tile). Signature and all five consumers unchanged. Check (seeds 42 / 415424794): tiled total length = global chain length (288.55 / 283.55 km, H1 census 288.6 / 283.6).
- **Unconditioned ids** (`UNCONDITIONED_HYDROLOGY_ID = 'unconditioned'`, and `legacy-…`): no correction, per-tile `computeTile`, no install. Used by (a) `?hydrology=legacy` for the P1 A/B (`hydrologyIdFor` reads the URL on the main thread; workers get the id in their params; own cache keys), (b) hand-built test params (replaces `'test-hydrology'`), the legacy tile census, the cave debug heightfield (synthetic terrain; nothing installs hydrology there), and a few map tests.
- Observation (not a defect yet): at ~14 % of chain points the corrected ground is > 0.6 m above the chain water surface (chain points are smoothed/meandered off the 8 m cells and carving lowers the bed in chunks) — to be judged in the browser check of the home stream.
- Payload-size options from H2 untouched (6.5 MiB per copy): workers still need chains because `riverTile` jobs run there.
- **Still open for H3 done-when:** browser check "home stream continuous to the bay" (queue §2), and Q37/Q44/Q47/Q58 census baselines must be re-taken (terrain changed under every fingerprint via `hydrologyId`).

## H4 results (Q76, 2026-11-03)

Landed (technically verified; **not** browser-verified): sites avoid visible stream heads.

- `streamHeadsFor(hydrologyId)` (`worldHydrologyStore.ts`): first point of every global chain whose `flags` bit 4 (lake outlet) is **not** set; cached per installed hydrology, `[]` for unconditioned/legacy ids. `RiverQuery.headsNear(x, z, size)` exposes it to placement code (clipped tile chains lose the true head, so the query reads the global list, not tiles).
- `findSettlementSite(…, streamHeads)`: a candidate with a head within `footprintRadius + SITE_STREAM_HEAD_CLEARANCE (24 m)` is held back; the best such candidate is returned flagged `nearStreamHead` only when nothing else passes. `chooseSettlementSite`: home keeps widening (72 / 120 m) past a flagged site and falls back to the first flagged site; non-home takes the flagged site (decision 10: keep current behaviour when no candidate passes). `SettlementGenContext.streamHeads` is resolved once beside `riverSegments`.
- `SETTLEMENT_DEFINITION_CACHE_VERSION` 19 → 20 (site search changed; hydrology/terrain caches untouched).
- Census (`pnpm worldgen:rivers:census --model=global`, new "stream heads (H4)" line; installs the computed hydrology under its real id, rings = 5 grid cells): seed 42 — 3 settlements, heads inside 0, within 24 m 0; seed 415424794 — 5 settlements, inside **0** (home included: before the home widening it was a head 35 m from the home centre), within 24 m **1** (`0_4`, 62 m from centre, fallback), i.e. ≤ 2. Settlement count unchanged (the head rule only moves or flags a site, never drops it). **Caveat:** this census still enumerates the grid cells (`cellsWithinRadius`), not the 059 W4 global selection; re-run it after Q80.
- Home river-enclosed road-less settlement (§3 Q84-a): not re-checked here — needs the road census/browser.

## L1 results (Q77, 2026-11-03)

Landed (technically verified; **not** browser-verified; **partial** — see "Open"): lakes exist in terrain data and the main water/placement sites understand them.

- **Raw sample.** `sampleRawTexel` returns `waterH` (sea `waterLevel`, or the lake level when the corrected floor is below it) and `h = max(floorH, waterH)`; `computeChunkTexel` keeps `waterH` through the modifier stages. Lake level comes from `hydrologyLakeLevelAt(id, x, z)` (`worldHydrologyStore.ts`; nearest basin node, `-Infinity` outside basins / for unconditioned ids). Rule everywhere: **wet ⇔ `h − floorH > WET_EPS`** (`waterSurface.ts`, `WET_EPS = 0.02 m` because bilinear samples leak a fraction of a wet corner's depth into dry neighbours; `isWetTexel` keeps the legacy `h <= waterLevel` sea reading).
- **Placement view.** `sampleLandHeight` (`ChunkManager`, `sampleLandHeightAt` analytic, cemetery/landmark samplers): wet points report `waterLevel`, so legacy `height <= waterLevel + margin` tests reject lakes unchanged. Walking/physics keep `sampleHeight` (true surface). Lake banks get no extra margin (margins stay relative to sea level).
- **Audit table (grep `(<=|<|>=|>) waterLevel`, ~70 hits):**
  - (a) *is-water → wet rule / land view — done:* chunk-array sites `chunkVegetation` (7, eps 0.25 m for the riparian/bank leak), `chunkItems` (3), `chunkCrops`, `chunkEnvironment` (landmark + cemetery samplers, 6 array sites), `grassPlacement` (2, grids now carry `floorHeights`); `waterSample`, `waterBodies` (groups by surface), `mapProjection`; settlement/road/home-resolve contexts, `probeSettlementSite`, `createNaturalWaterKindAt` (→ `waterBodyKind`), item spawners, fauna (→ `animalRoaming`, `createFauna`), `evaluateGroundPlacement` callers (tent/trap/well/container/work-contract/food-source), dig + terrain-preparation env, `digFinds`, `footstepSurface`, treasure-site searches (3), cemetery fit.
  - (b) *sea semantics — kept:* `terrainClassification.isWetFloor` (floor < sea), ocean-depth tint, `oceanMixAt`, coastal resources/shells, `worldHydrology` breach floor, `hydrology.ts` legacy tiles, `waterMirror`, caves' sea-floor checks.
  - (c) *rendering — L2:* `createWater` (one level per chunk), `biomeColors` (visual mesh uses floor heights; lake beds colour as land).
  - **Resolved 2026-11-03 (second pass):** `NpcAgent.isWalkable*` already reads the land view (`SettlementsManager` receives `chunkManager.sampleLandHeight`; nothing to change). `WorldContext` gained `sampleLandHeight` + `withLandHeightView()`; `createGrassForagePatches`, `resourceById`/`buildResourceDeposits` (natural + mineable deposits) and the abandoned-mine deposit generator now use it. `ratNestPlacement`/`coastPlacement` receive the settlement land view (props) or keep sea semantics (coast). `worldKnowledgeRoadContext` (world-knowledge scan → settlement defs/census) now uses `sampleLandHeightAt` (it used the true surface, so settlement sites could land in lakes). Perf: `seekDenseForest` prefers `sampleLandHeight` when the probe has it; `seekWater` stays sea-only on purpose.
  - **Deferred (not L1):** `worldLocationCatalog.classifyCoarseCell` (sea-floor-only wet test: lakes read as land in the discovery catalog; changing it alters persisted catalog tiles — own slice), `locationQueries.qualifyingChainPoint` (debug-only; lake termini sit above sea level), `mountainMassif` (sea-floor wet count on mountain sites; lakes in massifs unlikely).
  - **Census (2026-11-03, `pnpm exec tsx scripts/perf/census-rivers.ts --model=global`, now prints `lake census (L1)`):** settlement centres and clearing pads (core/house/yard/storehouse/garden) standing in a wet cell, rings 5. Before the `worldKnowledgeRoadContext` fix: seed 42 → 1 centre + 18 pads in lakes. After: seed 42 → 0/0; seed 415424794 → 0 centres, **2 yard pads of one LG settlement (`-4_3`) still wet**. `villagePlanner.scorePlotCandidate` now rejects wet yards (`discIsDry`; settlement def cache → 22), but these two come through `pickPlot`'s unconditional final fallback → **belongs to Q37** (planner fix, not a prop fix). Trees/items/road segments were *not* censused per-object here; they rely on the unit-tested wet rule in the chunk-array sites (browser check outstanding, queue §2).
- Cache bumps: `CHUNK_TILE_CACHE_VERSION` 21, `SETTLEMENT_DEFINITION_CACHE_VERSION` 22, `ROAD_ROUTE_CACHE_VERSION` 9 (`WORLDGEN_EPOCH` already 1 in this batch). Tests: `lakeWater.test.ts` (wet rule, `sampleLocalWater`, body grouping, raw-sample lake, land view).

## L2 results (Q78, 2026-11-03)

Landed (technically verified; **not** browser-verified — queue §2).

- `createChunkWater` (`src/world/createWater.ts`) now builds one plane per distinct water level in a chunk: the sea-level plane (unchanged mask, planar mirror bound) plus one plane per lake level from `lakeLevelsInChunk` (wet texels `h − floor > WET_EPS` above `waterLevel + 0.35`, grouped at 1 cm, plane at the group's highest texel, `y = level + 0.07`). `WorldWater` gained `meshes`; `mesh` stays as the first handle; `addTo` adds all planes and `update`/`setDayNight`/`dispose` cover every material, so `chunkManager` only changed `scene.add(rec.water.mesh)` → `rec.water.addTo(scene)`.
- Lake planes use a masked height texture (`maskHeightsForLakeLevel`): own-level wet texels keep the level, dry banks at/above it keep their floor (soft shoreline/foam as at the sea), other levels and lower dry ground are lifted +10 m out of the shader's cover band. The shader is unchanged — `uWaterLevel` is the lake level, so depth shading uses `level − floor`. `bodyScale` already groups by surface (L1), so `lakeScaleFor` applies.
- No planar mirror on lake planes (`bindWaterMirror` skipped → `uReflections` stays 0: sky/fog tint + sun specular), per author option (a). Rivers and sea unchanged.
- Cost: dry chunks `null` as before; a lake chunk adds 1 draw call per extra level (typically 1). The mask array + texture are per lake chunk build (one `Float32Array` of `resolution²`).
- Tests: `src/world/createWater.test.ts` (level grouping, mask).
- **Open:** screenshots of 2–3 lakes for the author, shore/foam look, no water at a wrong level (queue §2).

## Q96 lake threshold (2026-11-03)

Author feedback (dev server, seed 415424794): since L2 the home area looks like a swamp — ~264 small ponds became visible water. Author chose **`lakeMinCells` 80 → 600** (`DEFAULT_WORLD_HYDROLOGY_OPTIONS`; the option is part of `hydrologyIdFor`, so the hydrology id and every downstream fingerprint keyed on `RawSampleParams.hydrologyId` change without a manual version bump; epoch stays 1, Q80 re-exports fixtures).

- Sweep: `pnpm exec tsx scripts/perf/census-lakes-near-home.ts --cells=80,300,600,1000 --depths=0.3,0.6,1` (distinct lakes whose basin comes within 300 / 600 / 1000 m of home). `lakeMinDepthM` 0.3–1 m makes no difference (surviving pits are deep), so it stays 0.3.

| seed | `lakeMinCells` | lakes | median ha | filled % land | ≤ 300 / 600 / 1000 m of home |
| --- | --- | --- | --- | --- | --- |
| 415424794 | 80 (was) | 264 | 0.9 | 3.5 | 3 / 13 / 27 |
| 415424794 | 300 | 45 | 3.6 | 8.3 | 0 / 1 / 6 |
| 415424794 | **600** | 20 | 6.4 | 10.0 | 0 / 1 / 2 |
| 415424794 | 1000 | 9 | 11.9 | 11.6 | 0 / 0 / 1 |
| 42 | 80 (was) | 254 | 0.9 | 3.9 | 2 / 10 / 21 |
| 42 | **600** | 16 | 5.6 | 11.1 | 1 / 1 / 3 |
| 42 | 1000 | 6 | 10.6 | 12.4 | 0 / 0 / 1 |

- `census-rivers --model=global` after: dry sinks 0, mouth error 0, seabed 0.24 / 0.32 km; chains 2301 / 2277 (more streams: filled pits now drain onward), stream heads 1602 → 2273 (415424794); **H4 heads inside a footprint 0 → 2 on both seeds** (non-home fallback sites `-4_3`, `-4_-2`, `0_4` on 415424794; home unaffected) — accepted as fallbacks, re-check after Q80 with the W4 selection. Sea-level (terminal) lakes unchanged (27 / 15; rendered before L2 already). L1 lake pads 0.
- Access census (rings ≤ 8): unreachable 0 on both seeds; settlements re-sized/moved slightly (42 LG 3 → 2; 415424794 SM 2 → 3, LG 2 → 3); wet objects 0. `-4_3` (415424794) now gets a cemetery again (the lake that took its dry candidates in Q94 is gone). The census object-overlap check now measures a cemetery as its rotated rectangle (`cemeteryPlotDistanceToPoint`, like the planner) instead of its circumscribed circle — the two "cemetery ∩ house/yard" pairs it reported were that circle (gap −0.77 / −1.59 m), 0 with the real shape.
- Road census (rings 5): identical before/after on both seeds.
- **Beach trees (Q96):** `computeChunkVegetation` main pass (trees + bushes) and the riparian shore-tree branch reject points with `h ≤ waterLevel + sandBandAt(x, z, seed)` — the same sea-relative sand band that keeps grass off the shore and colours the beach (lake banks keep the L1 wet rule; reeds/ferns at the waterline unchanged). Proxy measurement: ~10–12 % of the previously tree-eligible land (> 0.3 m above sea) lies in the sand band (island 10.7 / 10.1 %, within 1 km of home 12.5 / 7.5 % on 415424794 / 42) — that is the beach area that loses trees. `CHUNK_TILE_CACHE_VERSION` 24 → 25. Test: `chunkVegetation.test.ts` "beach (Q96)"; the plan-182 deep-forest tree/bush ratio floor 0.85 → 0.8 (coastal sample chunks; meadow flower bushes keep their own shore rule).
- **Garden hay stack (Q96):** `buildSettlementProps` placed it at a random angle around a garden without any water check. `dryHaySpot` (`props.ts`) keeps the rolled angle when the centre and four rim samples at 1.6 m are `CORE_PROP_WATER_MARGIN` (0.8 m) above water in the land view, otherwise tries 7 golden-angle steps (no extra RNG draws), else the highest candidate. Runtime prop only (no cache). Paddock haystack already used `wetOrRiver`. Other runtime props → Q95.

## Pitfalls

- Hydrology must never read the corrected terrain, settlements, roads or `waterH` (cycle). Settlement code may read hydrology, never the other way round.
- A sampler call before install must fail loudly; a silent fallback would write uncorrected terrain into the caches under a corrected fingerprint.
- Memory: one structured-clone copy per worker; keep payloads sparse (64 × 64-cell blocks) and measure in H2.
- Every slice that changes worldgen bumps its namespaces; fixtures are re-exported once in P1 (the importer filters stale versions, so stale fixtures only cost a cold boot meanwhile — note it in boot-times if measured).
- The census numbers in Q44/Q47/Q58 notes become stale after H3; do not compare across.
