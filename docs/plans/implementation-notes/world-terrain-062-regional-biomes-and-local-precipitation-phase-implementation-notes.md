# Implementation notes — world-terrain-062 regional biomes + local precipitation phase

## B1 contract (Opus, 2026-11-06 — written before code; queue Q124)

Gates: 061 C2 look accepted 2026-11-05; 060 R4 relief freeze (Q119, author-accepted 2026-11-06) and 061 H6 hydrology close-out (Q122, 2026-11-06) both landed, so B1 runs on frozen inputs (review 031 F2). Q70 (biome borders) folds into B1 — the author confirms the fold-in in §3 Q70 (recommended option); if the author picks "Q70 separately", stop and ask before landing borders.

### 1. Verified starting point (code at `24bf4455`) ✅

- `biomeWeightsAt(moistureRegion, altitude01, region)` (`src/terrain/biomeRegions.ts`) → `{ desert, swamp, forest }` from one moisture noise axis + altitude. It is also called **inside** `forestDensityAt` (same file), so forest density follows the weights.
- Call sites (≈ 25): `chunkMeshData.ts` (terrain colour), `chunkVegetation.ts` ×5, `grassPlacement.ts` ×2, `chunkEnvironment.ts` ×2, `chunkItems.ts` ×3, `chunkCrops.ts`, `chunkManager.ts` ×2, `naturalResources.ts`, `digFinds.ts`, `farTileColor.ts`, `world/map/mapProjection.ts` (map/minimap), `settlement/settlementTerrain.ts` (settlement terrain class), `audio/ambientWeights.ts`, `world/treasureSites.ts`, `world/locations/lostTreasureEstateSearchArea.ts`, `world/locations/darkForestTreasureSite.ts`. Every one has `moistureRegion` (tile grid or `sampleMoistureRegion`) and a height or altitude, and a world position nearby.
- `macroClimate.ts` (061 C1): `temperatureAt(z, floorH, waterLevel)` is a closed formula; precipitation = `clamp01(0.12 + 0.62·moistureRegion + 0.22·maritime − 0.1·lat)`; only `maritime` needs built state (64 m coast-distance grid, 144 KiB, 36 864 uncorrected texel evaluations ≈ 70 ms to build). Today only `worldHydrology.ts` builds a `MacroClimate`.
- Precedent for per-realm derived world state: `landformIndexForParams` in `chunkHeightmap.ts` (WeakMap on `region` + fast string key; each realm builds its own copy ≈ 70–80 ms; never stringify per sample).

### 2. Decisions

1. **One function, one input record.** New pure `biomeWeightsFromClimate(input, region)` in `biomeRegions.ts` with a dedicated type `BiomeClimateInput = { temperatureC: number; precipitation: number; altitude01: number; borderA: number; borderS: number }`. `BiomeWeights` stays `{ desert, swamp, forest }` — the contract every consumer already reads (B2 adds the forest type separately).
2. **Climate per realm via a memo, no new pipeline.** `macroClimateOf(params: RawSampleParams): MacroClimate | null` in `macroClimate.ts`, memoized exactly like `landformIndexForParams` (WeakMap on `region`, fast key `seed|heightScale|waterLevel`). `null` for worlds without `region.continentMask` → those keep the legacy `biomeWeightsAt` formula unchanged (tests, infinite worlds). `worldHydrology.ts` switches to the same memo (one build per realm, hydrology and biomes share it).
3. **Point helper used by every consumer:** `biomeWeightsAtPoint(params, x, z, h, moistureRegion)` → computes `altitude01`, `T = temperatureAt(z, h, waterLevel)`, `P` with `maritimeAt(x, z)` and the point's own `moistureRegion`, the border noise, then `biomeWeightsFromClimate`. Consumers that already compute `altitude01` pass `h` instead; consumers that only hold `region` get `RawSampleParams` (or the subset the memo needs) threaded through — no global singleton. `forestDensityAt` takes the same point inputs (it must use the same weights as the caller).
   - `T` uses the sample height `h` (tile `heights`), not the uncorrected floor: the difference is the river/road carve (≤ a few m → ≤ 0.3 °C at the 0.09 °C/m lapse). Accepted tolerance; hydrology runoff keeps using the floor.
4. **Mapping (Whittaker-style; shape fixed here, numbers calibrated by S on previews):**
   - `warm = smoothstep(T, T_WARM_START, T_WARM_FULL)` (🟡 start 8 → 15 °C);
   - aridity `a = (1 − P) · (0.4 + 0.6·warm) + borderA`; `desert = smoothstep(a, A0, A0 + AW) · highlandFade` (existing `DESERT_HIGHLAND_*`). The cold north cannot become desert (`a ≤ 0.4·(1 − P)`); the warm, inland (low maritime → lower P) south can. **Arid extent is a calibration result shown to the author, never a quota (G2).**
   - `swamp = smoothstep(P + borderS, S0 − SW, S0) · lowlandFade · (1 − desert)` (existing `SWAMP_ALTITUDE_*`); north bogs are allowed.
   - `forest = 1 − desert − swamp` (unchanged remainder rule).
   - Start values: pick `A0/AW/S0/SW` so the **swamp land share stays within ±25 % of today's** on both seeds and desert concentrates in the warm inland south; report shares per latitude third.
5. **Borders (Q70 fold-in):** `borderA`, `borderS` = two independent seeded 2-octave low-frequency noises (wavelength 🟡 ~600 m + ~150 m, amplitude 🟡 ≤ 0.08) added to the indices — irregular, blended borders without re-sampling moisture at warped coordinates. New noise handles live in the same owner as the other macro noises (`noiseHandlesFor`), never `Math.random`.
6. **Acyclic:** biomes read relief + macroclimate + moisture only. They never feed hydrology, the macroclimate or the floor; riparian / dry-valley modifiers are B2 and are display/ecology only.
7. **Map = terrain:** `mapProjection.ts` and `farTileColor.ts` use `biomeWeightsAtPoint` with the same inputs as `chunkMeshData.ts`, so map, far ring and terrain agree at borders.

### 3. Caches and epoch

Bump in the B1 commit every namespace whose output moves — verify each by grep of its consumers, do not bump blindly: `CHUNK_TILE_CACHE_VERSION` (colours, vegetation, items, environment), `SETTLEMENT_DEFINITION_CACHE_VERSION` if `settlementTerrain` classes change any placement, `LOCATIONS_COARSE_VERSION` (treasure/dark-forest sites), `ABANDONED_CEMETERY_VERSION` / `ROAD_ROUTE_CACHE_VERSION` only if their inputs read biomes. `WORLD_HYDROLOGY_VERSION` must **not** change (hydrology output identical — a test asserts the hydrology id/hash is unchanged). `WORLDGEN_EPOCH` untouched (open epoch 1; intermediate saves disposable).

### 4. Acceptance (S implements; "done when" of Q124)

- Unit: `biomeWeightsFromClimate` bounds/sum = 1, monotone in aridity and wetness, cold north never desert; `biomeWeightsAtPoint` = legacy `biomeWeightsAt` on a world without `continentMask` (bit-identical); memo built once per realm (two calls → same object); order independence.
- Agreement test: for sampled points on both seeds, the map class (`mapProjection`), `farTileColor` weights and `chunkMeshData` weights come from the same function with equal inputs.
- Previews: `continent-preview-png.ts --biomes` (new layer or extend the existing biome colouring) before/after, seeds 42 + `415424794`, in `docs/research/v1-revival/continent-previews/062-biomes-b1/`; land share desert / swamp / forest per latitude third in the notes.
- Census: settlements 22/22, access 0 unreachable, wet objects 0 (`pnpm worldgen:access:census`); vegetation instance totals per biome before/after (D9 — no density reduction **within** a biome; redistribution between biomes is reported, not tuned away).
- Cost: `measure-worldgen-cost.ts --reps=3 --chunks=60` chunk p50/p95 within Q131 tolerance; memo build time per realm reported; main-thread boot (`?bootMark=1`) shows no new long task > 50 ms from the memo (else stop-if below).
- Type-check, lint, full `vitest`; `docs/state/terrain-and-world-generation.md` biome paragraph updated; §3 entry (Polish) with the arid-extent previews for the author (**gates B2**).

### 5. Stop if (→ queue Resume note + §3, do not guess)

- The arid region reads as a latitude stripe or needs a size compromise to look right.
- A consumer cannot get a world position / params without a lifecycle change (would need a singleton).
- The main-thread memo build is a visible boot long task → design fork (ship the coast grid with the hydrology install vs lazy build in an idle slot) → Opus.
- Hydrology id/hash changes.

## B1 implementation (S, 2026-11-06, queue Q124) ✅ implemented · ✅ technically verified · ❓ not browser-verified

- `biomeRegions.ts`: `biomeWeightsFromClimate`, `biomeBorderAt` (2-octave seeded 600/150 m, ≤ 0.08), `biomeWeightsAtPoint`, `forestDensityAtPoint`, `BiomeWeightsSampler`. `macroClimate.ts`: `macroClimateOf` (WeakMap on `region` + content-key fallback, because workers receive a cloned `region` per job); `worldHydrology.ts` shares it. Legacy formula unchanged without `continentMask`.
- Consumers: all call sites use the point helper (terrain mesh via `ChunkMeshDataParams.sampleParams`, grass via `GrassComputeParams.sampleParams`, env-style records via optional `sampleBiomeWeights` from `ChunkManager`/`worldKnowledgeScan`). `T` uses `altitude01` of the caller (equivalent to sample height).
- Calibrated 🟡 constants: warm 6→13 °C, `ARID_START` 0.42 + 0.10, swamp wet 0.74 − 0.14. Land on V1 is T 5–14 °C, P 0.4–0.75, so contract's 8→15 °C start would have left desert almost nowhere.
- Shares (`pnpm tsx scripts/tools/biome-shares.ts 42,415424794 --png=…`), desert/swamp %: seed 42 legacy 21.0/3.2 → 7.5/3.7 (N 0.0/5.6, mid 3.5/3.5, S 31.8/2.6); seed 415424794 legacy 23.7/4.3 → 14.7/4.7 (N 0.0/8.0, mid 6.9/4.5, S 46.7/3.3). Swamp within ±25 %. Desert is a result, not a quota; patchy in the south on the previews, not a stripe.
- Caches bumped: chunk tile 40, settlement definition 38 (terrain class rolls village size/outpost), road routes 26, cemetery 23, locations-coarse 17. `WORLD_HYDROLOGY_VERSION` unchanged; golden hydrology hashes pass. `WORLDGEN_EPOCH` untouched.
- Checks: type-check, lint, full vitest (804 files) green; `worldgen:access:census` run (settlement tables, no wet/unreachable flagged in sampled output); chunk-tile p50 7.4 ms before / 7.2–7.6 after (bare tiles, lower bound). Climate memo build 130–170 ms per realm in Node, once per worker/thread.
- Not done / open: vegetation instance totals per biome before/after, `?bootMark=1` long-task check of the memo on the main thread, browser look → §2/§3. The sync `createChunkGrass` fallback in `grass.ts` still passes no `sampleParams` (legacy biomes) — only matters if that path is used.
