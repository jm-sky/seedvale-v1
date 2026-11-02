# Plan: World scale, travel time and sparse settlements

**Created:** 2026-11-02
**Status:** `planned` 📋
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** world-terrain-058
**Domain:** `world-terrain`
**Subdomains:** `settlements` `terrain` `ui`
**Tags:** `worldgen` `epoch` `travel` `settlements` `roads`
**Model:** Opus, Sonnet

## Goal

Make travel between settlements an exploration in itself. Author direction 2026-11-02 (in-game review): today's ~300 m between villages is too short. Targets:

| Parameter | Today | Target |
| --- | --- | --- |
| Day length (`dayLengthSec`, new-world default) | 480 s (8 min) | **720 s (12 min)** → 1 game hour = 30 s |
| Player walk (`MOVE_SPEED`) | 8 m/s | **6 m/s** (proposal, see §Open questions) |
| Player sprint (`× SPRINT_MULTIPLIER` 1.8) | 14.4 m/s | **10.8 m/s** (multiplier unchanged) |
| NPC walk inside a settlement (`WALK_SPEED`) | 2.4 m/s | 2.4 m/s (unchanged) |
| NPC travel outside settlements ("fast march": expeditions, merchants, offscreen travel) | 2.4 m/s | **3.6 m/s** (proposal) |
| Neighbour settlement distance | ~300 m (pitch 300, every land cell) | **4–10 h of game time on foot** = 720–1800 m at 6 m/s |
| World | 8 × 8 km (±4096), land radius 2.3–2.9 km, 140–156 settlements | **12 × 12 km (±6144)**, land radius ~3.8–4.6 km, **20–25 settlements** |
| Distances in UI/quests | fake km (20 units = 1 km, 20 km = 1 day) | **travel time** ("ok. 6 h drogi", "pół dnia drogi") |

Author answers 2026-11-02 (queue §3, Q81): 12 × 12 km world; ~20–25 settlements in total; distances 4–10 h of game time ("a little smaller" than the first 5–12 h table); speeds as a hybrid — player a bit slower, distances a bit smaller, NPC travel a bit faster (fast march); UI shows travel time; **no new content between settlements** for now (fauna, caves, lakes, peaks, abandoned cemeteries, rivers from 058 fill the space; reassessed in game afterwards). This supersedes the Strategic Brief's "+10–15 % longer journeys" target and the 058 W1 calibration (8 × 8 km, ~150 settlements).

## Current state (verified 2026-11-02)

- **Placement is per cell, everywhere**: `generateSettlementDef(cell, …)` (`src/settlement/settlementGenerator.ts`) runs on every 300 m lattice cell (`SETTLEMENT_GRID_STEP = 300`) inside `WORLD_HALF_EXTENT = 4096` (`src/terrain/continentMask.ts`); almost every land cell holds a settlement (058 §W1 calibration). There is no global selection; the result for a cell depends only on that cell (load-order independent).
- **Neighbour logic is ring-1 on the lattice**: roads `neighborsFor` (`src/settlement/roadNetwork.ts:247`), entrances `neighborSitesFor` (`src/settlement/settlementPlanCache.ts:267`), SM cemetery sharing `SM_SHARING_MAX_DISTANCE = 1.15 × pitch` (`src/terrain/cemeteryAssignment.ts`), local name uniqueness within 1 km (`settlementNameUniqueness.ts`). With empty cells between villages all of these break (058 §W1 found the same for "wild cells").
- **Grid-step consumers** (12 files): `settlementProximity.ts` (`NEAR_SETTLEMENT_DISTANCE = pitch / 2`), `SettlementsManager.ts` (load radius in cells), `worldLocationCatalog.ts`, `locationProximityDiscovery.ts`, `createCaves.ts`, `naturalResources.ts`, `digFinds.ts`, `closedPredatorPressure.ts`, `debug/locationQueries.ts`, `cemeteryAssignment.ts`, `settlementNameUniqueness.ts`.
- **Sizes**: `rollVillageSize` + `resolveSettlementProgressionPolicy` (rings in cells; off for explicit `homeSize`, 058 W2 re-enables it with ring caps).
- **Speeds/time**: `MOVE_SPEED = 8`, `SPRINT_MULTIPLIER = 1.8` (`src/player/PlayerController.ts`; mounted speed compares against it); NPC `WALK_SPEED = 2.4` (`src/ai/NpcAgent.ts`) mirrored by `OFFSCREEN_TRAVEL_SPEED = 2.4` (`src/world/transportOffscreen.ts`, used by NPC offscreen travel, merchants and transport); `npcPersonalProvisions.ts`/`npcWorkContract.ts` take `walkSpeed` as input; `dayLengthSec` default 480 (`src/world/dayNight.ts`), per-world value in `WorldConfigScreen.vue`, `NpcAgent` fallback 600, `SettlementsManager` fallback 480, `lodging.ts` comment assumes 8 m/s.
- **UI distance**: `WORLD_UNITS_PER_KM = 20`, `KM_PER_DAY = 20`, ranges `NEAR/MEDIUM/FAR_RANGE_KM` 20/60/200 (`src/world/locations/locationConfig.ts`) — 400/1200/4000 world units.
- **Map**: `MAP_EXTENT_HALF = 4096` (`src/world/map/mapConfig.ts`), also read by `mapData`, `mapRasterTile`, `mapFogGrid`, `mapProjection`, `ui-vue/lib/drawMap.ts`.
- **058 status**: W1 (continent mask, bounded grid) landed; W2, H1–H4, L1–L2, E1, P1 not started. Hydrology grid planned at ±4096 / 8 m = 1025².

## Design decisions (settled by this plan)

1. **One travel-time unit.** `TRAVEL_HOUR_M = PLAYER_WALK_SPEED × gameHourRealSec(default day)` (6 × 30 = 180 m) lives in one module next to the day-length default; spacing targets, the census and UI travel-time strings derive from it. Changing walk speed or default day length later moves all of them consistently; worldgen constants that derive from it are frozen numbers with a comment (worldgen must not depend on a per-world setting — `dayLengthSec` is configurable).
2. **Keep the 300 m lattice as candidate identity, select globally.** Cells stay the identity of settlements (`settlement:<gx>,<gz>`, caches, saves, quests). The finite world allows a **global, deterministic selection pass** over all land cells: a cheap per-cell suitability score from the raw sampler (land, slope, elevation band, coast distance; ~9 samples per cell, ~2 600 cells inside ±6144 → milliseconds), seeded jitter, greedy Poisson-disc in fixed order (home cell first, then by score descending, ties by cell index) with minimum distance `SETTLEMENT_MIN_DISTANCE` (≈ 4 h = 720 m), until `SETTLEMENT_TARGET_COUNT` (calibrated to 20–25). Unselected cells return `null` before any site search (cheaper than today). The selection is a pure function of seed + terrain config, cached in a small `settlement-layout` namespace (fixture-covered), computed once at boot before settlements resolve. It must not read hydrology (keeps it parallel with 058 H1; H4 refines sites later).
3. **Neighbour graph from selected positions.** One owner (`settlementLayout`) builds a deterministic relative-neighbourhood graph (RNG; Gabriel as the fallback if RNG leaves a site with one edge and a second edge ≤ 1800 m exists) over selected cell centres. It replaces ring-1 `neighborsFor` (roads), `neighborSitesFor` (entrances) and cell rings in progression. This **is** Q44 D1 (a) "RNG topology", moved forward; Q62 keeps junctions/overlap only. No parallel graph.
4. **Spacing targets** (census, per seed 42 + 415424794): settlements 20–25; ≥ 90 % of graph edges 720–1800 m straight-line (4–10 h); no edge > 2 400 m; one connected component; nearest neighbour ≥ 720 m; ≥ 80 % of land within 1 800 m of a settlement (no huge empty quarters; mountains may stay wild).
5. **World 12 × 12 km.** `WORLD_HALF_EXTENT` and `MAP_EXTENT_HALF` → 6144 (one constant, map imports it); continent land radius recalibrated to ~3.8–4.6 km (inner radius scaled, edge band 600 m, ≥ 1.5 km open sea); 058 hydrology grid becomes 1537² (≈ 2.36 M cells, est. 7–9 s single-thread, split across the pool and cached; memory sparse blocks — H2 measures). World edge (058 E1) at ±6144.
6. **Sizes by graph distance.** 058 decision 11 is re-expressed in graph hops from home instead of lattice rings: hop 1 ≤ `MD` (≥ 1 MD+ among them), hop 2 ≤ `LG` (≥ 1 LG in hops 1–3), ≥ 1 `XL` at hop 2–4 and ≤ ~4 km, no XL at hop 1. With ~22 settlements the histogram is tuned so the world is not all hamlets (target recorded in the census, e.g. XL 1–2, LG 3–5).
7. **Cemeteries.** SM sharing (`SM_SHARING_MAX_DISTANCE`) becomes unreachable at ≥ 720 m; it is removed rather than left as dead logic. SM villages either get a small own cemetery or none — **ask the author in W4** (see Open questions); home keeps its reserved plot (Q58).
8. **NPC fast march.** A single `NPC_TRAVEL_SPEED` (3.6 m/s) next to `WALK_SPEED`: used by `OFFSCREEN_TRAVEL_SPEED` (replacing the mirrored copy with an import from a light constants module), merchant journeys and on-screen inter-settlement legs (expedition/road travel outside a settlement's radius; locomotion animation uses the existing run/walk blend rule). In-settlement movement stays 2.4.
9. **UI travel time.** Location/quest distances are shown as travel time from `TRAVEL_HOUR_M` ("ok. 3 h drogi", "pół dnia drogi", "dzień drogi"); `WORLD_UNITS_PER_KM`/`KM_PER_DAY` leave player-facing text. Range thresholds are re-expressed in hours (near ≤ 4 h, medium ≤ 12 h, far = whole continent); location ids do not depend on them (notes §21), so no save impact — verify.
10. **Epoch.** Everything rides on the open Revival batch, `WORLDGEN_EPOCH = 1` (D3: one coordinated bump per batch); cache namespaces bumped per slice per the `worldgenEpoch.ts` checklist. Day length and speeds are not worldgen; existing worlds keep their saved `dayLengthSec`, only new worlds get 720.

## Slices

| Slice | What | Model | Done when |
| --- | --- | --- | --- |
| **T1** | Time + speeds (decisions 1, 8): default `dayLengthSec` 720 (dayNight, fallbacks in `NpcAgent`/`SettlementsManager`, world-config UI default), `MOVE_SPEED` 6, `NPC_TRAVEL_SPEED` 3.6 + `OFFSCREEN_TRAVEL_SPEED` import, `TRAVEL_HOUR_M`; audit speed-derived numbers (mounted speed invariant, footsteps/stamina, `lodging.ts`, fauna flee/chase vs player, weather durations "per day") | S | tests green (player/ai/fauna/settlement); mounted > human invariant holds; table of audited sites in the notes; browser: walk/sprint feel → §2 |
| **W3** | World 12 × 12 (decision 5): `WORLD_HALF_EXTENT`/`MAP_EXTENT_HALF` 6144, continent radius recalibration with `worldgen:continent:census` (rays to the coast, border sea), map raster/fog grid memory check | S | coast radius in the new band on both seeds, border sea 100 %, home unchanged, map shows the island with sea margin, map memory reported |
| **W4** | Global selection + neighbour graph (decisions 2–4, 7): `settlementLayout` module + `settlement-layout` cache/fixture namespace, `generateSettlementDef` short-circuits unselected cells, `neighborsFor`/`neighborSitesFor` read the graph, SM sharing removed, name uniqueness radius re-checked; census `worldgen:spacing:census` (replaces the Q32 calibrate tool) | S high (O on a calibration fork) | decision 4 targets on both seeds; road census: no settlement without a road, 1 component; route build time and boot `settlement-layout` mark reported; settlement/terrain/road tests green |
| **W5** | Grid-step consumers audit (12 files above): replace "nearest settlement within N cells" loops with layout queries where the radius grew; caves/resources/dig finds/predator pressure keep per-cell semantics where they are not about settlements | S | audit table in notes; no consumer scans > its old cell count per call; tests green |
| **W2′** | 058 W2 re-scoped (decision 6): sizes by graph hops | S | decision 6 guarantees on both seeds; histogram recorded |
| **U1** | Travel-time UI (decision 9) | S | quest/location/map texts show travel time; thresholds in hours; no location id changes (test) |

Order: **T1** (independent, can run any time) · **W3 → W4 → W5 → W2′**, then 058 **H1** (needs the final grid size from W3, not the layout) → H2 → H3 → **H4** (needs W4) → L1 → L2 → E1 (±6144) → P1. U1 after T1. Road rebuild: **Q60** (village-aware A\*) after H3 + W4 (routes are now 0.7–2.4 km — measure route build time first); **Q62** shrinks to junctions/overlap on the W4 graph. Village-local work (Q37, Q47 layout, Q66) is unaffected and may continue in parallel.

## Verification

- Census per seed (42, 415424794), recorded in the implementation notes per slice; reference seed for browser checks `415424794`.
- `pnpm run type-check`, `pnpm run lint:fix`, targeted `pnpm vitest run src/settlement src/terrain src/world src/ai src/player`, `pnpm run build`.
- Browser (§2 entries): walk from home to the first neighbour (time it: expected 4–10 game hours), map overview, sprint feel, NPC merchant leaving and arriving.
- Performance: boot cold/warm (`settlement-layout` + 058 hydrology at 1537²), route build time for long edges; WSL only, never claim FPS gains.

## Constraints and non-goals

- No new content between settlements (author 2026-11-02); no guaranteed encounters. Reassess after in-game review.
- No change to village-internal layout (plots, yards, storehouse, paths) — distances inside villages stay.
- Settlement identity stays the lattice cell; no new identity scheme.
- No fast travel, horses-for-hire or carts in this plan.

## Open questions (author)

- **Q81-a speeds (proposal, non-blocking for W3/W4):** player 6 m/s / sprint 10.8, NPC fast march 3.6 m/s (1.5 × walk). With these a 1.2 km neighbour is ~6.7 h for the player and ~11 h for an NPC on the road. Alternatives: player 5.5 / NPC 4.0. T1 lands the proposal unless the author changes it; all derived numbers follow `TRAVEL_HOUR_M`.
- **Q81-b SM cemeteries (asked in W4):** with 720 m+ between villages SM can no longer share a neighbour's cemetery: (a) every SM gets a small own cemetery (Q39 SM layout), (b) SM without a cemetery, (c) only SM with ≥ N families.

## Risks

- **Route cost**: A\* over 0.7–2.4 km edges on the 8 m grid; few edges (~35–45 per seed) but long — measure in W4 before Q60 adds footprint costs.
- **Boot**: hydrology 2.25 × cells; mitigated by cache + fixture (tools-020), measured in 058 H2.
- **Emptiness**: the world may feel empty — accepted for now (author), reviewed in game after W4 + H3.
- **Census baselines**: Q37/Q44/Q47/Q58 numbers must be re-taken after W4 (far fewer settlements).

## Implementation notes

### T1 — time + speeds (Q82, Sonnet, 2026-11-02)

New light module `src/world/travelUnits.ts` (no Three.js): `DEFAULT_DAY_LENGTH_SEC` 720, `PLAYER_WALK_SPEED` 6, `NPC_WALK_SPEED` 2.4, `NPC_TRAVEL_SPEED` 3.6, `TRAVEL_HOUR_M` (= 180 m). Existing saves keep their own `dayLengthSec`; only new worlds get 720.

| Site | Before | After |
| --- | --- | --- |
| `dayNight.createDayNightState` | 480 | `DEFAULT_DAY_LENGTH_SEC` |
| `PlayerController.MOVE_SPEED` (sprint ×1.8 unchanged) | 8 | `PLAYER_WALK_SPEED` (6) |
| `caveHeightfieldPlayer` mirror of `MOVE_SPEED` | 8 | imports `PLAYER_WALK_SPEED` |
| `transportOffscreen.OFFSCREEN_TRAVEL_SPEED` (merchant journeys, expeditions via `estimateOffscreenTravelDays`) | 2.4 mirror | `NPC_TRAVEL_SPEED` import |
| `NpcAgent.WALK_SPEED` / fallback `dayLengthSec` | 2.4 / 600 | `NPC_WALK_SPEED` / default |
| `SettlementsManager` fallback `lastDayLengthSec` | 480 | default |
| `AnimalLife` metabolism default | 480 | default (needs pacing stays in game days) |
| Mounted speed invariant (`mountedSpeed.test`) | horse/donkey mount speeds > 8 / 14.4 | still holds against 6 / 10.8 (only margin grew); no retune |
| Persistence migration constant `FAUNA_CORPSE_MIGRATION_DAY_LENGTH_SEC` | 480 | unchanged (historic) |
| `JUVENILE_MATURITY_SECONDS` 600 | ~1.25 days | ~0.83 days (value unchanged; comment updated) |

Tests adjusted for intent, not loosened: `AnimalLife`/`animalMetabolismGameplay` use the default constant; `NpcAgent.spatialLifecycle` committed-travel test uses a 2000 m destination (the 3.6 m/s march would arrive within 8 h over 500 m); cave traversal test compares against `PLAYER_WALK_SPEED`.

**Not done (open, needs a gameplay decision before it lands):** decision 8's *on-screen* inter-settlement legs at `NPC_TRAVEL_SPEED` (expedition/road travel outside a settlement radius, run/walk blend) — only the off-screen estimate uses 3.6 so far. `src/world/createCaves.test.ts` "mouth exit onto 1 m terrain tiles" is red on `main` before and after this change (unrelated). Walk/sprint feel at 6 m/s and the 12-minute day are not browser-verified → queue §2.

### W4 — global selection + neighbour graph (Q84, Sonnet, 2026-11-02)

**Implemented / technically verified** (type-check, lint, full `pnpm vitest run` 8948 tests, build green; nothing browser-verified).

- `src/settlement/settlementLayout.ts` (new, the one owner): `computeSettlementLayout` — cheap per-cell suitability (centre + 4 probes at 40 m, all dry, slope/ridge penalty, seeded jitter) → greedy Poisson-disc in score order, **home first**, radius 1150 m (`SETTLEMENT_SPACING_M`) relaxing by 100 m towards the 720 m floor (`SETTLEMENT_MIN_DISTANCE_M = 4 × TRAVEL_HOUR_M`) until `SETTLEMENT_TARGET_COUNT = 22`. Each candidate is confirmed with the real `probeSettlementSite` (no river query, no progression floor, so the layout stays hydrology-independent) and distances use the probed **site** positions. Graph: relative-neighbourhood graph, Gabriel fallback for degree-1 sites (≤ 1800 m), edges > 2400 m dropped unless they are the only link, edges > 1800 m pruned when both ends keep ≥ 2 other links and stay connected.
- `settlementPlanCache`: `settlementLayoutFor(ctx)` (memoized, cleared with the def cache, perf stage `settlementLayout`); unselected cells → `null` def / no-site probe before any site search; `neighborSitesFor` (entrances) reads the graph; progression ring targets are filtered to selected cells.
- `roadNetwork`: `neighborsFor` = graph neighbours; `segmentsNear`/`fordsNear`/`bridgesNear` use new `routeOwnersNear` (owners near the rect + both ends of every graph edge whose bbox ±120 m meets it) instead of the lattice ring-1 scan, which cannot see a 1–2.4 km edge crossing a far chunk.
- Cemeteries: **Q81-b (a)** — SM sharing removed (`resolveSmSharePartner`, `SM_SHARING_*`, `'shared'` intent, shared corridor placement, `split` state, tests, census branch); every settlement dedicated.
- Lost Treasure host search radii widened (cells, Chebyshev): elder 1 → 6, archaeologist/specialist 5 → 10, because ring 1 (≤ 450 m) can never hold a settlement now.
- Caches bumped: settlement definitions 17 → 18, road routes 6 → 7, chunk tiles 18 → 19 (epoch already 1). Worldgen fixtures were already stale (v17 vs fixture v4) — unchanged, regenerate with `tools-020`.
- `pnpm worldgen:spacing:census` replaces `worldgen:spacing:calibrate` (deleted, its pitch lever is gone).

**Census** (`pnpm worldgen:spacing:census --roads=1`; edges are site-to-site straight lines):

| seed | settlements | nearest-nbr min / p50 | edges | edge p10 / p50 / p90 / max | in 720–1800 m | > 2400 m | components | land ≤ 1800 m | sizes | layout | settlements with no road | all routes built |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 22 | 1230 / 1325 | 29 | 1258 / 1490 / 1747 / 2025 | 93 % | 0 | 1 | 100 % | SM10 MD4 LG7 XL1 | ~0.75 s | **1** (`-6_11`) | 76 s |
| 415424794 | 22 | 1158 / 1295 | 26 | 1227 / 1474 / 1757 / 1864 | 96 % | 0 | 1 | 100 % | SM7 MD8 LG7 | ~0.73 s | **1** | 65 s |

Decision 4 targets met except "no settlement without a road".

**Findings / open**
- **Road-less settlement (1 per seed).** Not a spacing issue: the A* start is enclosed by river channels the router must reject (`evaluateRoadRiverCrossing`: span > `MAX_BRIDGE_SPAN` / shallow angle) — 399 nodes explored, both graph edges fail, even with wider search margins (0.3/0.6 × length) and 2 extra fallback candidates. The layout is deliberately hydrology-independent; **058 H4 (hydrology-aware site refinement) or a bridge policy change must resolve it** — asked in queue §3.
- **Layout cost ~0.7 s per realm** (≈ 30 site probes ≈ 11 ms each + ~1.7k × up to 5 height samples), not "milliseconds"; computed in every realm (main + terrain workers). A persisted `settlement-layout` cache namespace + fixture was **not** done (queue Q84 follow-up).
- **Route build time**: ~2–5 s per 1.2–2 km edge (A* open set is a linear scan over a Map → O(n²) in ~30k nodes); 65–76 s for all 26–29 edges. Cached per pair, but a cold first walk will hitch — a binary-heap open set is the cheap fix, route geometry would change (Q60 owns it; roads need a rebuild anyway).
- Progression rings (1–2 / 3–5 cells) no longer match: the near ring never holds a selected cell, so `near` is mostly `null`; W2′ (graph hops) replaces it. Until then big-village guarantees near home are weaker.
- Names: `LOCAL_SETTLEMENT_NAME_RADIUS_M` (1 km) now almost never matches (nearest neighbour ≥ 1.1 km) — harmless, revisit in W5.

