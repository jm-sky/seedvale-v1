# Implementation notes — world-terrain-061 (macroclimate + hydrology)

## C1 — macroClimate module + preview layers (Sonnet, 2026-11-05, queue Q120)

**Implemented / technically verified (no browser, no consumers, no worldgen output change, no cache bump):**

- `src/terrain/macroClimate.ts`: `createMacroClimate(params)` -> `{ at, maritimeAt, sampleAt }`. Reads only the unconditioned floor + moisture-region noise (new additive wrapper `sampleRawTexelUncorrectedAt` in `chunkHeightmap.ts`) and its own coarse sea mask; no hydrology, biome, settlement or weather input (acyclic). Immutable after build -> query-order independent, identical on rebuild (worker parity by construction; tests build twice).
- Terms (all first guesses, calibrate in C2): latitude `T` 3 C (north, -Z) -> 17 C (south); lapse 0.09 C/m above water level (80 m summit about -7 C); precipitation = clamp01(0.12 + 0.62*moistureRegion + 0.22*maritime - 0.1*lat); maritime = exp(-coastDist/1200 m) from a 64 m chamfer coast-distance grid (192^2 cells, 144 KiB, budget 0.6 MB). Sea = unconditioned floor below `waterLevel` (inland sea basins of the analytic floor count as coast; hydrology lakes do not).
- Cost: grid build = 36 864 uncorrected texel evaluations (preview whole run ~8 s incl. map tiles); `at()` takes an already-sampled floor + moisture so hydrology can reuse its grid samples (no second pass).
- `continent-preview-png.ts --climate`: T / P / maritime / runoff previews (runoff = P x warmth proxy, preview-only). Seed 42 / 415424794: T 1.9..14.3 / 2.2..14.8 C, P 0.31..0.83 / 0.30..0.82 on land. Exports in `docs/research/v1-revival/continent-previews/`.
- Tests: `macroClimate.test.ts` (latitude, lapse, bounds, determinism/order independence, memory, maritime).

**Observed (looked at 415424794 temp + precip only):** T falls cleanly north; precipitation shows regional blobs, not bands. **Not judged:** whether the look is right (author look is C2's gate), orographic term (only if C2 shows a need), payload hashing/installation with `hydrologyId` (belongs to C2/H1 when fields enter the payload).

## H2 — drainage contract (queue Q121, written 2026-11-05 before any code; Sonnet draft — Opus review welcome)

Status: **contract only; no code, no calibration.** H1–H2 stay gated by Q119 (060 R4 relief freeze) — runoff thresholds are calibrated on the final relief. C2 look accepted by the author 2026-11-05 (previews `continent-previews/061-climate-c1/`).

### 1. Verified starting point (code, 2026-11-05) ✅

- `RiverChain = { points: RiverPoint[] }`, `RiverPoint = { x, z, elevation, accumulation }` (`riverNetwork.ts:70`). **No class, no id, no flags.**
- The packed form already carries **one per-chain flag byte**: `PackedChains.flags` (`worldHydrology.ts:129`, filled ~`:1012`), with `LAKE_FED_FLAG = 16` (`worldHydrologyStore.ts:221`). It is read only by `streamHeadsFor` (`:238`). `unpackChains` (`:251`) **drops it** → `RiverChainIndex(unpackChains(...))` (`riverNetwork.ts:621`) sees point-only chains. So a class stored only in `flags` would be lost exactly as review 031 F1 warned.
- Clipping: `riverChainClip.clipChainToRect` (terrain) and `riverGeometry.clipChainToRect` (water ribbons, used by `createRiverWater.ts:29`) both return **several point-only pieces** per chain. 🟡 Two clippers exist — the contract must cover both (or merge them first; not done here).
- Water/wet readers: `riverChannelSegmentsNear` / `riverWaterSampleAt` (`riverNetwork.ts:198/277`) treat every segment as physical water; consumers of the wet view include `waterSurface`, `terrainClassification`, `chunkVegetation`, `grassPlacement`, `chunkEnvironment`, `chunkItems`, `chunkCrops`, `chunkHeightmap`, `chunkManager`, `mapProjection`, `farTileColor`, `waterSample`.

### 2. Decisions

1. **One dataset, class on the reach.** Extend `RiverChain` with `sourceId: number` (index of the packed chain, stable per `hydrologyId`), `reach: 'perennial' | 'dry'` per **point range**, not per chain: a chain can start dry and become perennial (headwater taper). Represent as `points[i].perennial: boolean` (a dry→perennial switch is monotone along flow within one chain; lake-fed chains are perennial from point 0). `flags` keeps `LAKE_FED_FLAG`; **a new per-point class bit is stored in the packed `points` stream** (a 5th float or packed into `accumulation`'s sign — pick the cheaper at implementation; 🟡 measure payload against D7). Bump `WORLD_HYDROLOGY_VERSION` in the slice that changes the payload.
2. **Clip keeps identity.** Both clippers copy `sourceId`, the per-point class (interpolated points inherit the class of the segment start; a segment crossing the dry→perennial switch splits at the switch point, so no interpolated "half-dry" point exists) and add `chainOffsetM` (arc length from the source chain's first point to the piece's first point). Never a clipped-tile ordinal.
3. **Two projections of the one dataset:**
   - *dry profile* (terrain only): shallow valley carve + optional stony/greener strip; consumed by `chunkHeightmap` and terrain colouring only.
   - *perennial wet view*: `riverChannelSegmentsNear` / `riverWaterSampleAt` skip dry points. Dry reaches therefore yield **no water sample, no wet floor, no ribbon**.
4. **Central adapters, not per consumer.** Dry reaches are excluded at the shared query owners — `riverNetwork` (wet view), `waterSurface.isWetFloor`, `waterSample`, road crossings (`roadRiverCrossing`), `mapProjection` (blue). Placement clearances (vegetation, items, crops, grass, buildings) read the wet view and so ignore dry reaches automatically; any consumer found reading raw chain points directly is converted in H2 (grep `chain.points` / `RiverChainIndex` outside `riverNetwork.ts`).
5. **Continuity.** Perennial reaches keep 058 behaviour (outlets, lake-fed, mouth ramps) unchanged. At a dry→perennial switch the water width tapers from 0 to the class-minimum over a fixed length (🟡 start 48–96 m; tune on previews); bed and water height stay continuous with the dry valley profile. Lake outlets and lake-fed chains are always perennial.
6. **Classification rule (input to H1, not decided here).** Perennial where runoff-weighted effective area ≥ perennial threshold (m²), dry drainage where ≥ initiation but < perennial threshold; both thresholds in m² (cell area 64 m² on the 8 m grid) and calibrated against S0 targets (−50 % total length, ≥ 3 systems, main river ≤ ~15 % cut, 0 artifact pairs). Keep **raw catchment m²** and **runoff-weighted effective m²** as two named fields in code; `riverNetwork` width/depth mappings take effective area in m² (conversion of the current cell-count mappings is part of H1).

### 3. Acceptance tests (H2, before calibration)

Synthetic dry / perennial / lake-outlet / dry→perennial chains, including ones crossing river-tile (256) and chunk (64) boundaries:
- `sourceId`, per-point class and `chainOffsetM` survive clone, worker copy, `unpackChains` and **both** clippers;
- a dry reach carves terrain but returns no `riverWaterSampleAt`, no `isWetFloor`, no ribbon, no road crossing, no map blue;
- worker path, analytic query (`riverQuery`) and resident terrain agree on the same physical result at sampled points;
- headwater taper continuous (width, bed, water height) across the switch and across tile edges; lake-fed chain perennial from point 0;
- golden-hash test updated with the version bump; the all-streams diagnostic preview keeps dry lines.
A blue-line screenshot is not evidence.

### 4. Open / for Opus or the author

- ❓ Per-point class bit: 5th float vs packed in `accumulation` — decide on measured payload (D7: 6.63 / 6.79 MiB baseline).
- ❓ Merge the two `clipChainToRect` implementations first? (Reduces the surface the contract must cover; touches `createRiverWater`.)
- ❓ Dry-valley look (carve depth, strip colour) is a visual compromise → author look on previews once H1 runs.
- 🟡 Taper length 48–96 m.
- Not evaluated: `chunkManager`, `locationQueries`, `riverTileCache` and `mapRasterTile` readers of `RiverChain` — list them in the H2 implementation pass.
