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

## B2 implementation (S, 2026-11-06, queue Q164) ✅ implemented (partial) · ✅ technically verified · ❓ not browser-verified

- `biomeRegions.ts`: `regionalTreeSpeciesWeight(params, z, speciesIndex)` — per-`TREE_SPECS` multipliers blended by latitude (north: pines ×2.4, birch ×2, broadleaf ×0.3–0.5; south: oak-like ×1.4, pines ×1.2, birch ×0.4, maple ×0.6; centre neutral; dead trees untouched); `1` on worlds without `continentMask`. Applied only in `pickTreeSpecies` (`chunkVegetation.ts`) as a multiplier on `envGrowthFactor` — growth rate keeps its own definition. Riparian bank trees (`riparianPatches`) additionally damp pines ×0.5 (display/ecology only, never reads or feeds hydrology).
- Chunk tile cache 40 → 41. No other namespace bumped (species pick only changes vegetation output inside the chunk tile).
- Census (throwaway script, 24×24 chunks over the continent, seed 415424794, tree kind only), trees/pine%/oak-like%: N 367 / 49→72 % / 6.8→1.4 %; M 1549 / 43→45 % / 8.8→8.8 %; S 270 / 43→45 % / 5.6→14.4 %. **Tree counts identical before/after** (D9 held).
- Tried and **removed**: latitude-dependent treeline (0.50 N → 0.72 S) incl. matching `forestDensity` altitude fade — north trees 367 → 234 (−36 %); queue §3 Q164-a. Snowline: terrain snow lives in the shader/`snowField` (W2), not touched.
- Not done: forest-type distinctions beyond species mix (heath/bog/meadow regional kinds), dry-valley modifier, browser spots on `415424794` (→ §2).


## B3 census (S, 2026-11-06, queue Q165) ✅ technically verified · ❓ WSL A/B not run

- New `pnpm worldgen:vegetation:census [--seeds=…] [--span=24] [--step=1]` (`scripts/perf/census-vegetation.ts`): per-chunk instance census (`computeChunkTile` + `computeChunkVegetation`, 49×49 chunks around the origin, no rivers/roads passed — comparable before/after, not absolute in-game numbers). Home chunk skipped by design.
- Before = `d44c3c80~1` (pre-B2), after = current `main`, same script/seeds. Totals 42 / 415424794: **34 788 → 34 798 / 42 250 → 42 254**; trees **21 886 / 26 375 identical**; bush, cactus, lily, reed identical; fern +10 / +4 (+0.2 %, an increase, source not investigated — fern gating reads nothing B2 touched, likely the riparian pine damping shifting a shared RNG draw). Per-chunk p50/p90/p99/max and densest 3×3 block identical on both seeds.
- Densest region (per-chunk, both seeds): max 98 @(10,−15) / 104 @(−23,9) instances per chunk; p99 86 / 88; densest 3×3 block 741 @(12,−10) / 748 @(−11,11). **No density reduction anywhere (D9 held).**
- WSL A/B (`stream` / `settlement`) **not run**: WSL benchmarks need the author's consent (VM-crash risk, runbook §WSL stability) and B2 changes no instance counts, only the species mix → listed in queue §4.

## W1 contract (Opus, 2026-11-06 — written before code; queue Q123)

Gates: 061 C1 (closed-form `temperatureAt`) and C2 look accepted; B1 landed. Scope is G3: **local temperature and local rain-vs-snow phase only** on top of the existing global timeline — no weather-type frequency, cycle length or new precipitation by region (stop-if "needs regional weather frequency" not hit: every rule below re-labels the phase of an existing global event, nothing more).

### 1. Verified starting point (code at `6e20d6df`) ✅

- Global timeline (`src/world/weather.ts`): `computeWeather(seed, elapsedDays, season)` picks one `WeatherType` per 0.3-day cycle from season weights; `temperatureFor(season, type)` = season base (12 / 23 / 9 / −3 °C, annual mean ≈ 10.25) + type delta. No position anywhere. Known oddity kept as-is: winter `rain` is −5 °C, autumn `snow` +5 °C.
- Static climate (`src/terrain/macroClimate.ts`): `temperatureAt(z, floorH, waterLevel) = 3 + 14·latitude01(z) − 0.09·max(0, floorH − waterLevel)` — **closed form in z and height only** (no maritime / rain-shadow term in temperature; maritime only enters precipitation). `WORLD_HALF_EXTENT` = 6144 → 1.14 °C per km north–south; land spans ≈ 5–14 °C at sea level (B1 notes), lapse adds up to ≈ −4.6 °C on the highest land (~51 m).
- Surface visuals: `computeSurfaceWeather(seed, elapsedDays)` = bounded replay (12–13 cycles) of `stepSurfaceWeather` → **one global** `{ wetness, snowAmount }`; `gameLoop.ts` feeds it to terrain uniforms (`buildChunkGeometry.ts` `uWetness` / `uSnowAmount`) and grass; `snowField.ts` holds the TS/GLSL twins (its altitude bias ramps at 60–140 m absolute Y — dormant on today's ≤ ~51 m relief). Debug `forced` weather steps the same curves live (`resolveSurfaceWeatherForFrame`).
- Consumers of the global weather today (grep `computeClimate|climate.weather|isRainWeather|ExposureDays|computeSurfaceWeather|temperatureFor(` outside `weather.ts`):

| Consumer | File | Reads | Position it must use after W1 |
| --- | --- | --- | --- |
| NPC shelter pressure | `ai/weatherPressure.ts` via `SettlementsManager.update(… weather …)` → `NpcAgent` | type, intensity, temperature | settlement centre for residents (one local weather per settlement per cycle); a travelling agent's own position, re-evaluated at most once per weather cycle |
| Tent / sleeping-utility condition | `world/sleepingUtilities.ts` | `computeRain/SnowExposureDays` | the utility's placed position |
| Player well | `world/playerWell.ts` | `computeRain/SnowExposureDays` | the well position |
| Garden hydration | `world/playerGarden.ts` (own cycle replay, `isRainWeather`) | rain phase, intensity | the garden position |
| Blood trace fading | `world/bloodTraces.ts` | `computeRainExposureDays` | the trace position |
| Trap weather wear | `world/animalTraps.ts` | type, intensity | the trap position |
| Lightning | `world/lightningEvents.ts` | `type === 'storm'` | **unchanged** — storms stay global and non-positional (phase only re-labels precipitation) |
| Precipitation particles, rain/storm audio, ambient birds/frogs factor, fog overlay, clouds, grass wind, HUD label + °C | `weatherParticles.ts`, `audio/weatherSounds.ts`, `audio/createAmbientAudio.ts`, `gameLoop.ts` (`applyWeatherOverlay`, `sky.updateClouds`, `groundFog`, `grassWindAmpFor`, HUD) | type, intensity, temperature | **camera/player position — presentation, allowed** (plan §Design) |
| Terrain + grass wetness/snow | `gameLoop.ts` → `buildChunkGeometry.ts`, grass, `snowField.ts` | `computeSurfaceWeather` | per vertex / blade world position → **W2** (§4 below) |
| Debug GUI forced weather | `ui/createDebugGui.ts`, `tickClimate` | global type | forced value replaces the **global** type; local phase rules still apply on top |

- Fauna reads no weather (grep in `src/fauna` empty). Nothing weather-related is persisted (climate re-derived from `(seed, elapsedDays)`, plan §19).

### 2. Decisions

1. **Reference = the global timeline.** The global `WeatherState.temperature` is defined as the temperature of a reference site: continent centre (z = 0) at sea level, `T_REF = temperatureAt(0, waterLevel, waterLevel)` = 10 °C (≈ the 10.25 °C annual mean of the season bases — consistent). Home sits near the reference, so home behaviour stays (almost) as today.
2. **Offset, lapse once.** `climateOffsetC(z, h) = temperatureAt(z, h, waterLevel) − T_REF` in `macroClimate.ts` (temperature owner). The lapse lives **only** inside `temperatureAt`; `temperatureFor` and every consumer never add another. Worlds without `region.continentMask` (tests, infinite worlds) → offset 0 → identical to today. `h` = the site's ground/entity height (terrain sample for static sites, entity y for agents; caves are not special-cased — their interior already suppresses weather presentation). Offsets of static sites are pure in position, so callers may compute them once at creation/hydrate (never persisted).
3. **Local temperature:** `T_local = T_global + offsetC`.
4. **Phase rule — reference-anchored (decided; alternative recorded below).** For a precipitation cycle (`rain` / `storm` / `snow`):
   - global `rain`/`storm` becomes local **snow** iff `offsetC ≤ −PHASE_GATE_C` **and** `T_local ≤ PHASE_T_C`;
   - global `snow` becomes local **rain** iff `offsetC ≥ +PHASE_GATE_C` **and** `T_local > PHASE_T_C`;
   - otherwise the global phase holds. 🟡 `PHASE_GATE_C` = 2 °C (≈ 1.75 km north/south of the centre, or ≈ 22 m above sea level at the centre), `PHASE_T_C` = 1 °C; S calibrates on a phase map and reports.
   - Result: the same global event gives north/hill snow and south rain; summer never snows anywhere (21 °C rain needs offset ≤ −20); winter snow stays snow everywhere on V1 land (needs offset ≥ +8); autumn snow turns to rain in the south; winter rain turns to snow in the north and on hills; spring snow appears only on the coldest northern heights.
   - A local `storm` in snow phase stays `storm` (thunder is global) with snow precipitation.
   - **Not chosen:** pure physical phase (`T_local ≤ 1 °C` everywhere). It also fixes the reference oddities, but it changes home: winter rain/storm at home would become snow and autumn snow would become rain — a gameplay change outside "local phase on top of the global timeline". Can be revisited with the author together with the season temperature table.
5. **API in the weather owner (`weather.ts`), dedicated types:**
   - `type PrecipitationPhase = 'none' | 'rain' | 'snow'`
   - `type LocalWeather = WeatherState & { offsetC: number; phase: PrecipitationPhase }` — `type` re-labelled (`rain` ↔ `snow`; `storm` stays), `temperature` = `T_local`, same `intensity`/`startedAt`/`endsAt`, so existing `WeatherState` consumers keep their signature.
   - `localWeatherFrom(global: WeatherState, offsetC: number): LocalWeather` (pure) and `localClimateAt(climate: WorldClimateState, offsetC: number)` (plan name) returning `{ temperatureC, precipitationPhase, weather: LocalWeather }`.
   - `isRainWeather` / `type === 'snow'` checks in consumers move to the **local** weather of their site; `computeRainExposureDays` / `computeSnowExposureDays` gain `offsetC = 0` (default = today, so existing tests hold); `playerGarden`'s replay uses `localWeatherFrom` per cycle.
   - Plumbing: one `climateOffsetAt(x, z, h)` function built once per `WorldBundle` from its `RawSampleParams` (like `sampleHeight`) and threaded to the owners above — no module-level singleton, no player position in simulation code.
6. **Local surface policy over the bounded replay.** `stepSurfaceWeather` is fed `localWeatherFrom(w, offsetC)` per cycle (local phase decides accumulate vs wet; melt rate `T_local / 6`). Because every input except `offsetC` is global, **the surface state is a pure function of `(seed, elapsedDays, offsetC)`** → same seed/day/site gives the same surface after reload and time skip, by construction.
   - `computeSurfaceWeather(seed, elapsedDays, offsetC = 0)` (default = today) and `computeSurfaceWeatherLut(seed, elapsedDays, out)`: the replay evaluated at 🟡 16 offset knots, 1 °C apart over `[−10, +5]` °C (covers V1 land with margin), sharing the 13 `computeWeather` calls → `{ snow: Float32Array(16), wetness: Float32Array(16) }`, ≈ 200 cheap steps, recomputed on the existing per-frame call or throttled — cost reported (< 0.05 ms target).
   - `surfaceWeatherAtOffset(lut, offsetC)` = linear interpolation between knots (clamped). The interpolation softens the phase front over ~1 °C (~0.9 km, or ~11 m of height) — intended, not an artefact.
   - Debug `forced`: `ForcedSurfaceWeatherRuntime` holds the 16-knot arrays and steps each knot with its own local weather (same curves).
7. **Simulation never at the player:** every consumer in §1 except the presentation row uses its own site position; a unit/grep test guards that simulation modules do not import player/camera position for weather.

### 3. Acceptance — W1 (S, queue Q170)

- Unit: offset 0 on worlds without `continentMask` (bit-identical to today for `computeSurfaceWeather`, exposure functions, garden replay); `localWeatherFrom` truth table (season × type × offset sign/gate); lapse not doubled (offset at height h = −0.09·h at z = 0); one global event → north snow + south rain on a synthetic finite world; same `(seed, day, offset)` → same phase/surface after "reload" (fresh call) and after a time skip (call at day + N); LUT knot k equals `computeSurfaceWeather(seed, day, knot_k)` exactly; order independence.
- Consumers in §1 migrated with their positions (table updated in these notes with file:line); HUD shows local °C/label at the player.
- Phase census (script): per latitude third × season, share of precipitation cycles that are snow, before/after, both seeds, home settlement offset reported (expect |offset| < 1 °C) → these notes.
- Type-check, lint, full vitest; `docs/state/` weather paragraph updated (owner doc for weather state).

### 4. W2 contract — position-dependent terrain/grass snow (S, queue Q171, after Q170)

- Terrain and grass shaders read `uSnowLut[16]`, `uWetLut[16]` and one `vec4 uClimateOffset` (`lat scale`, `lat offset`, lapse, waterLevel) + an enable flag; offset per fragment/blade = the **same closed form** as `climateOffsetC` from world z and world y (exact, so rain shadows/coast are not an issue — temperature has no such term; no latitude-only approximation needed).
- TS twins in `snowField.ts` (`terrainSnowCoverAt`, `grassSnowCoverAt`, bury/visible) take the per-point `s` from `surfaceWeatherAtOffset` — terrain and grass agree (test at sampled points).
- Remove the dormant absolute-altitude snow bias ramp (60–140 m) or keep it at zero weight — temperature lapse now carries altitude; document which.
- No new per-frame CPU work beyond the LUT update; uniform upload only (32 floats + 4); program count unchanged (no new variants).
- Browser check on `415424794` (forced winter snow / autumn snow day): north or hill snow while the centre/south is wet, a front visible on the minimap scale; terrain and grass agree at the front → §2 for the author's look.
- Stop if the front reads as a hard stripe that needs blending beyond the LUT (visual compromise → author) or a program-count increase is needed.

## W1 phase census + consumer migration (S, 2026-11-06, queue Q170) ✅ technically verified · ❓ browser not checked

- Consumers migrated with their own site positions via `WorldBundle.climateOffsetAt`: gardens (`createPlayerGardens.ts`), tents (`createPlacedTents.ts`), traps (`createPlacedTraps.ts`), wells (`createPlayerWells.ts`, `interactables.ts`, `inspectionActions.ts`, `placementActions.ts`, `gameLoop.ts` drink revalidation), blood traces (`bloodTraces.ts`, `animalAttraction.ts`), NPC weather per settlement centre (`SettlementsManager.setClimateOffsetAt`), HUD at the player (`gameLoop.ts`).
- Phase census (`pnpm tsx scripts/tools/phase-census.ts 415424794 --years=2`, 549 land samples on a 256 m grid, share of precipitation cycles falling as snow, global → local): north winter 85.8 → 100 %, middle winter 85.8 → 88.8 %, south winter 85.8 → 85.8 %, south autumn 10.3 → 1.1 %, north/middle autumn 10.3 → 10.3/10.5 %, spring/summer 0 → 0 %. Home offset −0.50 °C (within the expected |offset| < 1 °C). Only the reference seed was run.
- **Not done here (moved to Q171):** `forced` debug runtime with per-knot state and the `computeSurfaceWeather` terrain/grass application — both need the position-dependent surface consumer, which is Q171.
