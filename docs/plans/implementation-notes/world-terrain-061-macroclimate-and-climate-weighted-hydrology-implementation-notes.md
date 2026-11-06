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

## H1 — runoff-weighted accumulation + perennial threshold (Opus, 2026-11-06, queue Q121)

**Implemented / technically verified (headless census both seeds; no browser look yet).** H2's dry-drainage class is **not** implemented: streams below the perennial threshold are simply not chains, so the H2 contract (no dry reach may become wet) holds trivially. Whether dry valleys need a visible projection at all → author §3 Q121-a.

### Mechanism

- `macroClimate.ts`: coarse precipitation grid (64 m cell centres, sampled with the coast grid — still 192² texel evaluations), `precipitationAt`, `temperatureAt`, `runoffFrom(T, P) = clamp(P·(1 − 0.5·warm(T)) / 0.42, 0.15, 2)` with `warm` = 0 at 2 °C … 1 at 16 °C, and `runoffGrid(climate, floor, grid, waterLevel)` (inlined bilinear; reuses the hydrology grid's own floor samples for the lapse term — no second terrain pass). Land mean ≈ 1.00 / 0.97 (seeds 42 / 415424794), range 0.54–1.66 / 0.43–1.61. 🟡 Direction change vs the C1 *provisional* runoff preview (which multiplied P by warmth): runoff now falls with warmth (evaporation) — cold north sheds more water, warm south less, consistent with G2 "warmer/drier south". `--climate` preview's runoff layer now shows this weight.
- `worldHydrology.ts`: `WorldHydrologyGrid.runoff?` — each land cell contributes its weight instead of `1`; `accumulation` is therefore in **effective cells** (runoff-weighted area / 64 m²). Raw catchment m² is not stored (not needed by any consumer yet; H5/064 can add it). `worldHydrologyGridFor(params, floor, grid?)` is the single builder used by boot (`worldHydrologyRuntime`), `testWindowHydrology` and every census/preview script — synthetic tests without `runoff` keep uniform 1 (golden hashes changed only through the threshold).
- `riverNetwork.ts` `DEFAULT_RIVER_THRESHOLDS`: `stream` 15 → **96** effective cells (6144 m²) = chain initiation *and* the zero of `flowFactor`, so a spring still starts at `MIN_RIVER_WIDTH` 0.4 m (no abrupt 3.5 m head, which keeping the old zero would give). `majorRiver` 200 unchanged → width saturation (11 m) at the same effective area as before; mid-size reaches (≈ 100–800 effective cells) become somewhat narrower (e.g. 300 cells: 7.1 → 4.3 m). `river` (drinkable-small-stream bound, `riverWaterQuality`) 50 → 192 (2 × stream). Exposed bank / submerged depth follow `flowFactor`, so the cross-section stays consistent.
- Cache bumps (all output moved): `WORLD_HYDROLOGY_VERSION` 13, chunk tiles 39, settlement defs 37, road routes 25, caves 19, cemeteries 22, locations-coarse 16. No `WORLDGEN_EPOCH` bump (epoch-1 test saves disposable). Boot fixtures were already stale before this change (re-export at the batch close, Q80 rule).

### Calibration (headless, `scratch` sweep then census; before = `6593120b`)

| Metric | S0 (2026-11-04) | before (6593120b) | H1 | target |
| --- | --- | --- | --- | --- |
| stream km per land km², seed 42 / 415424794 | 12.2 / 11.6 | 12.46 / 11.90 | **6.18 / 5.78** (−49 % / −50 % vs S0) | −40…−60 % (Q116-b) ✅ |
| chains (heads) | — | 2375 / 2375 | 902 / 886 | reported |
| largest systems (chains / km) | — | 31/5.4 · 22/5.2 · 24/5.1 ; 43/8.3 · 37/8.3 · 30/6.7 | 14/4.8 · 9/3.4 · 10/3.3 ; 15/4.9 · 14/4.5 · 15/4.2 | ≥ 3 with hierarchy ✅ |
| longest flow path of the 8 largest outlets (ratio to before) | — | 1.00 | 42: 0.83–1.00 (rivers ≥ 1 km: 0.92–0.96); 415: 0.89–1.00, one 0.26 km system 0.52 | main rivers ≤ ~15 % cut ✅ |
| artifact-class parallel pairs | 0 / 1 | 0 / 4 | **1 / 0** (42: (1730, −1309), run 158 m, gap 18 m) | 0 → H4 (Q122) |
| dry interfluve > 300 m | ≤ 0.9 % | 0.3 / 0.2 % | 0.9 / 0.6 % | reported (needs regional dryness) |
| payload | 6.63 / 6.79 MiB | 6.65 / 6.82 MiB | 5.09 / 5.23 MiB | reported |

Threshold sweep (runoff-weighted, effective cells → km/km² 42 / 415): 45 → 8.48 / 8.02 · 60 → 7.64 / 7.16 · 75 → 7.02 / 6.51 · 90 → 6.45 / 6.05 · **96 → 6.18 / 5.78** · 105 → 5.98 / 5.58 · 120 → 5.61 / 5.17.

### Downstream re-census (before → H1)

- **Home on seed 415424794 moved** (60, −5) → (17, 24): the stream that ran 17 m from home (168 raw cells at its mouth) drops out (its stretch above 96 effective cells is < `minChainCells` before the sea), and the home site search picks a new spot. Threshold 70 (−43 %) keeps that stream but home still moves (to (−16, 23)), so it is not a single-stream effect. Seed 42: nearest chain to home 24 → 34 m.
- **Road connectivity on 415424794:** routed edges 21 → 20, routed components 1 → 2 (16 + 6): the home ↔ `4_-1` (east) road no longer routes. No river crossing is rejected on that search (instrumented, reverted) — it fails on walkability/obstacles/search window; left for the road close-out (Q61–Q64 after 063), not patched here. Seed 42: 19 → 18 routed, components 4 → 5. Wilderness > 5 h: 11 / 13.8 → 11 / 14.1 %.
- Settlement access (`worldgen:access:census`): unreachable yard gates / storage / bay slots 0 on both seeds; wet object discs 0. Settlement mix on 415424794: one LG → OUTPOST (LG 2 → 1, OUTPOST 1 → 2), totals unchanged.
- Caves: identical. Cemeteries: all placed, 0 plot∩clearing/road. Catalog lakes: identical (lakes do not depend on runoff).
- Stream heads inside settlements: 3 / 2 → 0 / 1.
- Cost (WSL, headless, `measure-worldgen-cost` + direct timing): climate build ≈ 70 ms + `runoffGrid` ≈ 60 ms, added once to a cold (uncached) hydrology install of ≈ 4–5 s sampling + 0.8–1.0 s compute (≈ +2–3 %, within the D7 tolerance); compute itself unchanged within noise; payload 6.7 → 5.1 MiB per copy; RSS after hydrology 319 → 251 MiB (one noisy run each).
- Previews (hillshade + routes, `standard` gameplay and `all` diagnostic, before/after, both seeds; runoff weight layer for 415424794): `docs/research/v1-revival/continent-previews/061-hydrology-h1/`.

### Not done / next

- H2 dry drainage (class, projections, contract tests) — **not wanted for now** (author Q121-a (a), 2026-11-06: "wygląda dobrze"); may return as option (b) — subtle dry-valley strip — after 062 biomes.
- Home shift on 415424794: site search treats rivers only as obstacles (plaza in channel rejected, 24 m stream-head clearance; `findSettlementSite.ts`), so removing the home stream freed a better-scoring spot ≈ 52 m away. Author 2026-11-06: negligible, leave it. Home ↔ `4_-1` road: waits for the road close-out (Q61–Q64), no hurry.
- H3–H6 (Q122): map hierarchy, the one artifact pair on seed 42 (H4), outcome assertions + waterfall data (H5), fixtures/close-out (H6).
- Browser/3D: 3 catchments on 415424794 and the new home site → §2.
- ❓ Unverified observation while debugging: after `clearRoadNetworkCaches()` mid-run, `-4_-2` resolved 1 instead of 2 routes — may be an artefact of the debug sequence (defs cached, routes not); not investigated.

## H3–H6 — close-out (Sonnet, 2026-11-06, queue Q122)

**Technically verified (headless census, type-check, 719 terrain/map tests); no browser look.**

- **H3 map hierarchy:** nothing to build. The gameplay map already groups chains into width buckets (`mapRiverStrokes.ts`) and drops hairlines per LOD (`RIVER_MIN_WIDTH_PER_STEP`); `riverDetail: 'all'` is the diagnostic mode. With no dry class (H2 not wanted, Q121-a) there is no extra tier to draw; H1 already thinned the network, so the hierarchy follows from the width mapping.
- **H4 parallel artifacts:** the detector (`pnpm worldgen:rivers:census --network`) still reports exactly one pair, seed 42 at (1730, −1309): run 158 m (min 150), gap 18 m, ridge between them 0.44 m (< 1 m margin). Seed 415424794: 0. Not fixed: the planned fix (gradient away from higher cells on filled flats) changes flat resolution of the whole flood and would move every chain, forcing a re-calibration of the −50 % target for 0.16 km of one seed → author §3 Q122-a.
- **H5 outcome assertions + waterfall data:** new `pnpm worldgen:outcomes:census [--seeds] [--min-drop=2] [--json=file]` (`scripts/perf/census-hydrology-outcomes.ts`). Landform results (installed hydrology, both seeds): craters hold no lake (the raw hydrology correction 7–9 m over the pit is bypassed at runtime by `landformCorrectionBypassAt`, so that is by design); lake island on 415424794 OK (8/8 rim samples wet, island dry); **lake island on seed 42 at (−56, 2448) is a MISS — no lake forms** (rim corrections ≈ 0, the basin is not a closed pit under hydrology; lakes do not depend on runoff, so this predates H1). Left to world-terrain-060 follow-up (author question §3 Q122-b). Waterfall candidates (data only, for world-terrain-064): steep reaches = consecutive chain points with slope ≥ 0.25 and total drop ≥ 2 m on the shipped (smoothed) chain elevation; seed 42: 40 (thin 11 / small 15 / medium 1 / large 13), seed 415424794: 49 (14 / 17 / 10 / 8); each with source-chain index + offset along the chain (not a tile ordinal), top/bottom, drop, length, width class. File: `docs/research/v1-revival/2026-11-06-waterfall-candidates.json`. 🟡 Chain index is stable only for a given hydrology revision (it is the pack order); 064 should re-run the script instead of trusting old indices.
- **Home stream:** seed 42 present (nearest chain 34 m); seed 415424794 the old home stream is gone and home moved — accepted by the author (Q121-b).
- **H6:** no new output change since H1, so no further cache bumps; the downstream re-census (settlements, roads, access, caves, cemeteries, catalog lakes) and cost numbers are the H1 section above. Boot fixtures stay stale until the batch close (Q80 rule). Done-when still open: 3 catchments in 3D → queue §2.
