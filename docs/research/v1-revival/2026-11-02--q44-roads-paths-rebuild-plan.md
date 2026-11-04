# Q44 — Roads and paths rebuild: recon and staged plan (incl. Q47 cemetery reservation, Q35 yards, Q43 storehouse)

**Created:** 2026-11-02 by Claude Opus 5.5 (queue Q44, scope widened by the author: one comprehensive plan for roads + village paths that reserves cemetery plots (Q47) and respects the landed yards (Q35) and storehouse (Q43)).  
**Status:** plan — implementation slices are queue rows **Q57–Q64**; author decisions in §6 (also queue §3).  
**Authority:** [P2 author decisions §Q38](./2026-10-31--p2-author-decisions-q38-q39-q31-q42.md) (improve shape, trajectory and look, not only connectivity; a major routing redesign is a design gate), [Q29 batch rules](./2026-10-30--q29-revival-epoch-batch-plan.md#2-batch-rules) (epoch 1, cache bump per slice), [Q39 plan §5–§7](./2026-10-31--q39-cemetery-size-placement-plan.md#5-implementation-notes) (cemetery placement loss, "reserve before roads"). Code facts verified on `main` at `d3c8bd18`; code is authoritative.

Legend: ✅ verified in code/census · 🟡 assumption to verify in the slice · ❓ author decision.

## 1. Recon — what exists today

### 1.1 Owners and data flow (✅)

| Concern | Owner | Fact that shapes the plan |
| --- | --- | --- |
| Village layout | `settlement/villagePlanner.ts` `planVillageLayout` | Sequential `pickPlot`: well → houses (+ Q41 yards, `plot.yard`) → household wells → stockpiles → **storehouse** (Q43, `preferredRing = 0.12 R`, i.e. next to the plaza) → gardens → campfire → market → notice board → food/work/livestock → sale plots → **paths + entrances** → pasture/paddock (+ their spur paths). |
| Village paths | `planLocalPathsAndEntrances` (:1753) | Every path is a **straight 3-point line from the settlement centre** to: each entrance, each non-public zone centre, each "important" plot centre (stockpile, storehouse, garden, food/work/livestock, sale) and each house centre (stride by `pathDensity`). No obstacle test except `pathIsDry`. |
| Entrances | `preferredEntranceAngles` + `pickEntranceAtAngle` | Angles come from the layout pattern / a seeded axis / downhill direction — **not from where the neighbours are**. Count 1 (OUTPOST/SM), 1–2 (MD), 2–3 (LG/XL). Fallback walks inward to 0.25 R or 0.5 R. Also consumed by palisade gaps, entrance torches, pasture/paddock, household-well spoke avoidance. |
| Inter-settlement roads | `settlement/roadNetwork.ts` `roadRoutesForSettlement` → `routeBetween` → `findRoute` | Ring-1 neighbours nearest-first until `maxNeighborRoads = 3` succeed; edge exists if either side picks it; one cached route per sorted pair (canonical orientation). Endpoints = `entranceToward` (best-facing existing entrance). A* on a **9 m 8-direction grid**, cost = distance × mountain ridge + elevation change + river crossing price; water hard reject. **No knowledge of villages** (plots, yards, footprints, cemeteries). Then crossing anchors → meander noise (±2 m) → profile smoothing. |
| Minor-location paths | `routeToLocation` (`path` kind, ford-only) | Same A*; docks also add a `dockPath` into `plan.paths` (`settlementGenerator.ts:797`). |
| Terrain projection | `segmentsNear` / `villageSegmentsNear` → `ChunkTileParams.roadSegments` → `chunkHeightmap.ts` `roadCandidate` | Roads are **terrain only**: height blend + dirt tint + wobble/potholes/ruts/micro-bumps. Overlapping corridors pick the nearest/strongest candidate (no junction blend). Road `halfWidth = 5` (10 m wide), path 1.5, local road 2.4 (cap 2.8). Rut/micro-bump values are still the "deliberately extreme diagnostic" set (`worldConfig.ts:289`). |
| Other road consumers | signposts + midpoint signposts, palisade gaps/torches, bridges/fords (`bridgesNear`/`fordsNear`), fauna spawn avoidance, cave entrance avoidance (`largeCaves.ts`, `caveWorldgenCache`), cemetery placement (`cemeteryRoadSegments`), footstep surface | All read `RoadRoute`/`RoadCorridorSegment`; none needs a new representation. |
| NPC movement | `NpcAgent.steerTo` straight-line + single-obstacle skirt, local A* only when stuck; cave legs only in `npcMovementRoute.ts` | **NPCs do not follow roads or paths** today. Paths are visual + clearance hints. The planned `world-035` itinerary will consume `RoadRoute` legs — keep that contract stable. |
| Cemeteries | `terrain/cemeteryAssignment.ts` (topology), `terrain/cemeteryPlacement.ts` (placement, lazily from chunk params) | Only `SM` pairs share; **OUTPOST/MD/LG/XL are always dedicated** (`cemeteryAssignment.ts:198`). Dedicated candidates: 10 rings × 12 bearings at 0.55–1.05 × footprint R, rejected against roads + village paths (8-chunk gather) + clearings + height + water, projected into the owner chunk. |
| Neighbour sites | `probeSettlementSite` (cached in `settlementPlanCache.ts:242`) | Site position without families/layout — cheap enough to give a village plan its neighbours' bearings (🟡 equality with the final def site to be asserted by test). |
| Caches | `settlement-definitions` v7, `road-routes` v4, `chunk-tiles` v8, `caves-v2`, `abandoned-cemeteries`, `locations-coarse`; `WORLDGEN_EPOCH = 1` (batch still open) | Every generator slice below bumps its namespaces; no epoch bump (epoch 1 batch). tools-020 fixtures go stale → browser re-export (queue §4 hook). |

### 1.2 Baseline census (✅, `pnpm worldgen:roads:census`, rings ≤ 5, pitch 300, `main` `d3c8bd18`)

New read-only tool `scripts/perf/census-roads.ts` (stage R0 of this plan; ~40 s per seed in Node).

| seed | settl. | roads | no road | through foreign village | re-enters own village | roads crossing plots | roads crossing yards | entrance faces away (of 2×roads) | road×road crossings | parallel overlap | sinuosity p50/p90 | sharp turns /km | village paths | paths crossing non-plaza plots | paths crossing yards |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 88 | 139 | 1 | 0 | 2 | 35 (25 %) | 16 | 51 (18 %) | 31 | 1254 m | 1.11/1.18 | 11.5 | 1410 | 390 (28 %) | 79 |
| 415424794 | 99 | 153 | 1 | 0 | 3 | 30 (20 %) | 20 | 52 (17 %) | 8 | 969 m | 1.12/1.22 | 13.2 | 1564 | 471 (30 %) | 97 |

Breakdown of village path hits (seed 42 / 415424794): plaza furniture 277/306, **stockpile 173/210, storehouse 120/139**, house 41/60, livestock 27/43, garden 23/29, food 21/29. Road hits: house 17/11, plaza 13/7, storehouse 7/4, sale/food/garden/stockpile a few each.

Plus the Q47 census (Q39 plan §5.5): compact plots still lose 23 % / 10 % of cemetery assignments; **every dedicated MD/LG/XL cemetery fails**, blocked mainly by the village path mesh and roads.

### 1.3 Diagnosis

1. **Village paths are a fan of straight spokes from the plaza centre.** They run through the storehouse and stockpiles (which Q43 put next to the plaza), through yards (Q35 fences now make that visible as a path into a fence) and through other houses on the same bearing; 1400–1560 spokes per window also cover the outer ring densely, which is exactly the band (0.55–1.05 R) where a dedicated cemetery must fit.
2. **Entrances ignore the network.** ~18 % of road ends start at an entrance facing away from the neighbour, so the road either crosses its own village (plots/yards hit by 20–25 % of roads) or curls around it.
3. **A\* is blind to villages.** Nothing stops a road from crossing a house, yard, storehouse or (future) reserved cemetery.
4. **No network shape.** Roads are independent pair routes: 8–31 crossings without a junction (two corridors fight for the terrain height at the crossing), ~1 km of near-parallel duplicates per window (triangles A–B, A–C, B–C).
5. **Grid look.** A 9 m 8-direction grid + ±2 m meander gives ~12 sharp (> 50°) turns per km; sinuosity is fine, the zig-zag is not.
6. **Presentation.** 10 m wide road corridor, diagnostic rut/bump values, no junction blend.

## 2. Target design

**One rule: reserve first, connect second.** Inside a settlement the planner places everything that occupies ground (houses + yards, storehouse, infrastructure, **cemetery reservation**), then builds the path network around those footprints; inter-settlement routing then treats every footprint as an obstacle and attaches to the entrances the planner made for it.

### 2.1 Planner order (settlement-definitions)

```
well → houses (+ yards) → household wells → stockpiles → storehouse → gardens → plaza furniture
→ food/work/livestock → CEMETERY RESERVATION (OUTPOST/MD/LG/XL, new) → sale plots
→ ENTRANCES (from neighbour bearings, new) → PATH NETWORK (obstacle-aware, new) → pasture/paddock (+ spurs)
```

- **Cemetery reservation** (`plot-cemetery-0`, new plot kind, not a family-aligned array): only for settlements whose assignment is always dedicated (✅ OUTPOST/MD/LG/XL); `SM` keeps today's shared/dedicated search (its census is already fine). Footprint = the Q39 compact rectangle (`cemeteryPlotExtents(size, scale)`, scale from the same assignment seed), yaw facing the centre, candidates on the existing 0.55–1.05 R band, accepted with the same physical rules as `validateCemeteryPhysical` (height spread, crypt spread, water, owner-chunk fit via the pure `projectIntoOwnerChunk`; chunk size passed in as data) plus plot-disc clearance against already placed plots. Placed **before** sale plots and paths so only optional plots can lose space, never houses. If no candidate fits: no reservation, the terrain search runs as today (counted by the census; fallback, not failure).
- **Terrain side:** `tryPlaceTopology` for a dedicated assignment first reads the reservation from the settlement def and returns that pose if it still validates (roads/paths now avoid it, so it should), else falls back to the current candidate search. Identity (`cemeteryIdForAssignment`), layout and slot order are unchanged — only the pose source changes.
- **Entrances from neighbour bearings:** bearings to the ring-1 neighbours (`probeSettlementSite`, nearest first, same order `neighborsFor` uses) replace the seeded axis for road entrances; bearings closer than ~40° merge into one entrance; count = today's per-size count, **+1 when neighbours lie in a fourth distinct direction** (✅ author D4 (b)). Remaining entrance slots (paths, waterfront inland preference) keep today's rules. Palisade gaps/torches/pasture keep consuming `plan.entrances`, unchanged contract.
- **Path network (replaces the spoke fan):** a deterministic tree built outward from the plaza rim:
  1. trunk lanes: plaza rim → each entrance (kind `road` for road entrances, as today);
  2. every destination gets an **access point** instead of its centre: house door (front of `houseYaw`, outside the footprint), storehouse loading bay apron (Q43 `storehouse` layout), cemetery entrance (gate side of the reservation), garden/stockpile/work/food/livestock edge facing the plaza;
  3. destinations are attached in a fixed order (distance from centre, then plot id) by the shortest **obstacle-free** connection to the existing network (nearest point on any existing lane, or the plaza rim); a connection that would cross a plot disc or yard rectangle gets at most two tangent detour waypoints around it, otherwise the next-nearest attachment point is tried;
  4. no lane enters a yard rectangle (Q35 gate stays on the yard side edge, reached along the 1 m side lane), the storehouse footprint, a reservation or a plaza furniture disc.

  Result: fewer, shared lanes that look like streets, door-ended spurs, no paths through buildings, and a free outer band for the cemetery. `VillagePathPlan` (polyline + `halfWidth` + `kind`) already supports this — no new type, no new consumer.

### 2.2 Inter-settlement routing (road-routes, chunk-tiles, caves-v2)

- **Village-aware A\*:** before the search, rasterise every settlement footprint inside the envelope into the 9 m grid (plot discs, yard rectangles, storehouse, cemetery reservation, plaza = hard reject; the rest of the footprint = high cost multiplier; the endpoints' own entrance lanes = free). Pure function of defs already resolved by `defFor`; built once per route search, no per-node def lookups.
- **Endpoints:** start/goal at the entrance chosen by `entranceToward` (now aligned by construction), plus the A* goal tolerance ring so a road meets the entrance lane rather than its exact point.
- **Shape:** after anchors: string-pulling (line-of-sight shortcut over the same cost constraints and grid obstacles), then corner rounding (Chaikin or centripetal Catmull-Rom, ~2 passes) and resampling at ~6 m, then the existing meander; crossing anchors and their approaches stay locked; the existing "crossing topology changed → fall back to anchored geometry" guard is kept and extended to "obstacle hit → fall back".
- **Topology (✅ author D1 (a)):** replace "3 nearest that route" by a **relative-neighbourhood graph** on settlement sites (edge A–B kept unless some C is closer to both), computed from site positions only → order-independent, deterministic, connected (contains the MST), no triangles of parallel roads; if an RNG edge cannot route, fall back to the next nearest unconnected neighbour exactly like today so no settlement loses its last road. Keeps the route cache per pair, `RoadRoute` contract unchanged.
- **Junctions:** a pure post-pass over the routes that touch a chunk: where two roads cross or come within one road width, both get a shared junction point and the terrain corridor blend averages heights there (see §2.3). No route depends on another route's computation order (the pass is a function of the final pair routes).

### 2.3 Presentation (chunk-tiles only, visual)

- Junction blend in `applyTerrainCorridors`: overlapping road corridors blend their target heights by falloff weight instead of the winner-takes-all candidate.
- Road hierarchy (✅ author D2): main road `roadHalfWidth` 5 → 3.5–4 (7–8 m), local road 2.4, path 1.5; ruts stay clearly visible — only a slight reduction (rut 0.15 → ~0.11–0.12, micro-bump 0.2 → moderately lower). Author judges in game.
- Optional later (not in this batch): road-side decoration (milestones, wayside shrines, fences at junctions) — LOOSE-ENDS.

### 2.4 Invariants kept

Determinism and order-independence (every new step is a pure function of seed + defs + route pair); `RoadRoute`/`RoadCorridorSegment`/`VillagePathPlan`/`VillageEntrance` contracts; crossing ownership (`roadRiverCrossing.ts` only); bridges/fords; family-indexed identities (houses, yards, households); storehouse id `plot-infra-storehouse-0`; cemetery assignment ids and grave-slot order; NPC behaviour (paths/roads are not navigation authority; Q35 yard reachability check stays a separate open item); no new per-frame work.

## 3. Slices (queue Q57–Q64)

Order is fixed because the planner is sequential and roads read the final plans. Every generator slice: bump the listed caches, run `pnpm worldgen:roads:census` + `pnpm worldgen:cemeteries:census` + `pnpm worldgen:yards:census` on seeds 42 and 415424794 and append the before/after rows to §5, determinism test (same seed → same defs/routes, cold vs warm cache).

| Q | Slice | Model | Depends | Changes | Caches | Done when | Stop if |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q57 | **R1 — obstacle-aware village path network** (§2.1 path network) | S (high) | — | `planLocalPathsAndEntrances` path part: access points (door / storehouse bay apron / plot edge), ordered attach-to-network, tangent detours, hard exclusion of plot discs, yards, storehouse, plaza furniture; pasture/paddock spurs keep working | settlement-definitions, chunk-tiles | census: paths crossing non-plaza plots **0**, paths crossing yards **0**; every house/storehouse/important plot has a lane ending at its access point (test); path count ≤ today; villagePlanner + palisade + pasture tests green | A destination cannot be attached without crossing a footprint (→ report count, do not drop the destination) |
| Q58 | **R2 — cemetery reservation in the plan** (§2.1, closes the Q47 placement fork) | S (high) | Q57 | `plot-cemetery-0` for OUTPOST/MD/LG/XL before sale plots + paths; pure physical check shared with `cemeteryPlacement.ts` (extract, do not duplicate); lane to the cemetery entrance; terrain placement reads the reservation first, search as fallback | settlement-definitions, chunk-tiles, abandoned-cemeteries (if counts change), locations-coarse (🟡 if it stores pose) | Q47 census: `none` ≤ the pre-V2 baseline (6 / 10) and previously placed lost ≤ 5 %; 0 plot∩road, 0 plot∩path; family/house counts unchanged; slot-consumer tests green; then Q47 can finish its own remaining steps (caches, `PROPS` timing, §2 visual entry) | Reservation pushes out a house or the storehouse (mandatory) → author |
| Q59 | **R3 — entrances from neighbour bearings** (§2.1) | S (high) | Q58 | `preferredEntranceAngles` for road entrances from `probeSettlementSite` bearings (merge < ~40°); per-size count rule per §6 D4; assert probe site = def site | settlement-definitions, road-routes, chunk-tiles | census: entrance faces away ≤ 2 % of road ends; palisade/torch/pasture tests green; no change in settlements count | Probe site ≠ def site, or probing neighbours makes def generation recursive/slow (> +10 % `settlement-definitions` build time in Node census) |
| Q37 | **Object placement pass** (existing row) | S | Q57–Q59 + Q35/Q43 open checks | Unchanged scope; now runs on final paths/entrances/reservation | — | (existing) | (existing) |
| Q60 | **R4 — village-aware A\*** (§2.2 obstacles + entrance goal ring) | S (high) | Q59 (Q37 preferred) | footprint rasterisation per route search, hard/soft costs, fallback when obstacle-free route impossible | road-routes, chunk-tiles, caves-v2 | census: roads crossing plots **0**, crossing yards **0**, re-entering own village 0, through foreign village 0, no-road count ≤ today; route build time (Node census wall time) ≤ +25 % | Connectivity drops (no-road or components rise) |
| Q61 | **R5 — route shape: string-pulling + corner rounding** (§2.2 shape) | S (high) | Q60 | post-A* geometry pass, crossing anchors locked, obstacle/crossing-topology fallback | road-routes, chunk-tiles, caves-v2 | census: sharp turns/km ≤ 3, sinuosity p50 within ±0.03 of today, crossing records unchanged in kind/count per route (test), bridges/fords tests green | Rounding changes crossing topology on > 2 % of routes even with the fallback |
| Q62 | **R6 — network topology (RNG) + junctions** (§2.2; **needs §6 D1**) | O→S | Q61 + D1 | RNG edge selection with routing fallback; junction post-pass + averaged junction heights | road-routes, chunk-tiles, caves-v2 | census: parallel overlap ≤ 25 % of today, every road×road crossing has a junction, components = 1 per window, no settlement without a road | Any settlement loses its only road, or home progression/quest hosts stop resolving |
| Q63 | **R7 — presentation: widths, ruts, junction blend** (§2.3; **needs §6 D2**) | S (medium) | Q62 (Q61 at least) | `worldConfig` road numbers, corridor junction blend | chunk-tiles (+ caves-v2 if widths change) | §2 visual entry with URLs; terrain/heightmap tests green | — (visual, author judges) |
| Q64 | **R8 — close-out: Q38 re-validation + census report** | S / X | Q63, Q47 | final census rows for seeds 42 + 415424794 (roads, cemeteries, yards), road-routes/boot time with `?bootMark=1`, tools-020 fixture re-export hook (§4), STATE/CODE_INDEX updates | — | Q38 done-when (no settlement without a road on both seeds, metrics recorded); this plan §5 complete | — |

**Model notes:** Q57–Q61 are bounded single-owner changes with numeric done-whens → Sonnet. Q62 keeps an Opus look at the topology result before Sonnet lands it (it changes which villages are connected). Q64 is a metric run → delegable.

## 4. Verification

- **Technical (every slice):** the three censuses, targeted vitest (`src/settlement`, `src/terrain`, cemetery slot consumers), `pnpm run type-check`, lint; determinism (cold vs warm cache, two orders of resolving the same settlements).
- **Browser (agent may do, record URL/flags/screenshots):** `?seed=415424794`, home settlement + one LG/XL + one waterfront: lanes end at doors/bay/cemetery gate, no lane into a fence or building, roads arrive at an entrance facing the neighbour, rounded curves, junctions without height steps.
- **Author (§2 entries):** look of the new lane network, road widths/ruts, cemetery position at the village edge.
- **Performance:** worldgen only — Node census wall time per slice and `?bootMark=1` boot (`road-routes`/`settlement-definitions` phases). No runtime per-frame work is added; draw count changes only through Q47 cemeteries (already measured there).

## 5. Census log

Append before/after rows per slice (same columns as §1.2).

### Q57 (R1 — obstacle-aware village lanes, Sonnet 2026-11-02, `main`)

Implemented in new `settlement/villageLanes.ts` (pure): trunk lanes entrance → plaza-rim root (16 rim roots), then every destination (house door, storehouse bay, other important plot's plaza-facing edge; zone centres optional) attached to the nearest obstacle-free point of the network (≤ 10 candidates, ≤ 3 tangent detours); obstacles = non-plaza plot discs (0.9 R), yard rectangles (+0.8 m), household wells (R + 1.7, +1.0 for road-width lanes). A blocked door rotates around its plot; pasture/paddock spurs reuse the same router (`createLaneRouter`). Lane ids unchanged. Caches: `settlement-definitions` 7→8, `chunk-tiles` 8→9.

| seed | paths | paths crossing non-plaza plots | paths crossing yards | plot classes still hit |
| --- | --- | --- | --- | --- |
| 42 before → after | 1410 → 1285 | 390 → **4** | 79 → **2** | storehouse 3, plaza 2, stockpile 1 |
| 415424794 before → after | 1564 → 1425 | 471 → **7** | 97 → **6** | house 6, stockpile 3, plaza 2, food 1 |

Roads (inter-settlement) unchanged by this slice (as designed): road rows identical to §1.2. **Not 0:** the residual ≈ 0.3–0.5 % of lanes are unresolved attachments (a door/gate inside another plot's clearance, e.g. a house door next to its own household well, or a gate inside a sale-plot disc) — kept as the straight fallback and reported (`planLocalPathsAndEntrances().unresolvedLanes`), never dropped (Q57 stop condition; destinations are not removed). Tests: `villageLanes.test.ts` (census rules on 48 layouts, door/bay endpoints, determinism). Cemetery census (seed 415424794): dedicated LG/MD/XL/SM still fail until Q58 reserves plots; yard census unchanged in kind. Visual/browser check of the lane look: not done (author §2 entry pending).

### Q58 (R2 — cemetery reservation in `VillagePlan`, Sonnet 2026-11-02, `main`)

**What landed.** New `settlement/cemeteryReservation.ts` (`planCemeteryReservation`, plot `plot-cemetery-0`, `role: 'cemetery'`, `VillagePlot.cemetery = { size, scale }`): placed after livestock/work/food/infrastructure and **before** sale plots, entrances and paths, for OUTPOST/MD/LG/XL **and the home settlement at any size** (author 2026-11-02; home `SM` is also excluded from SM cemetery sharing, `CemeterySettlementRef.isHome`, so it always has its own dedicated cemetery). Candidate sweep 14 rings × 24 bearings on the 0.55–1.05 R band (inner first), clearance = rectangle-to-disc ≥ disc radius + `CEMETERY_CLEARING_PAD`, household compounds measured at 0.85 (same as `layoutClearingsFromPlan`). The physical rules (owner-chunk fit + projection, slope, river, water, plot/crypt height spread) were **extracted** from `cemeteryPlacement.ts` into `settlement/cemeteryFit.ts` and are shared, not duplicated. Terrain side (`placeFromReservation`): a dedicated assignment first re-validates the reserved pose on the live terrain (road margin 0.25 m instead of 2 m — the planner already routed its lanes around it) and falls back to the old search. Identity (`cemeteryIdForAssignment`), layout and slot order unchanged; the scale comes from the reservation.

**Planner consequences.** The reservation is a lane obstacle (full circumscribed circle + corridor + 1 m) and a lane destination (`path-plot-plot-cemetery-0` stops 2 m before the gate); entrance mouths never open inside it (small settlements sweep other bearings); pasture/paddock spurs never attach to the cemetery lane, try other attach points when the nearest would clip their own fence or cross the cemetery (`planSpurPoints`), and the paddock gate apron/fence-end clearance (`GATE_FENCE_END_CLEARANCE`) keeps the gate wider than the spur. Planner test over 395 flat-terrain plans (5 sizes × 79 seeds): reservation present in every OUTPOST/MD/LG/XL/home-SM plan, 0 lanes within corridor+0.25 m of the rectangle (except the cemetery's own lane). Caches bumped: `settlement-definitions` 11 → 12 → 13 → 14, `chunk-tiles` 13 → 14 → 15 → 16 (second and third bump: SM cemetery 9 → 8 graves and LG 25 → 21 (3×7), author 2026-11-02, so no partial front row).

| seed | `none` before → after | placed before → after | previously placed, now lost |
| --- | --- | --- | --- |
| 42 | 22 → **11** (LG 5, MD 6) | 58 → 70 | 1 of 58 (the home SM pair `-1_0+0_0` no longer shares — intended, not a regression) |
| 415424794 | 19 → **10** (LG 4, MD 3, XL 3) | 76 → 85 | 1 of 76 (`active:-2_-5`) |

plot∩clearing 0, plot∩road 0 on all placed cemeteries.

**Done-when status: partly met.** Seed 415424794 meets `none ≤ 10`; seed 42 does **not** (11 vs ≤ 6). Per-assignment diagnosis (seed 42): the remaining rejections are almost all **inter-settlement main roads (half width 5.0) crossing the reserved plot** — those routes are still village-blind until Q60 (R4 village-aware A\*) — plus a few settlements where nothing fits the band (LG/MD: ground + crowded houses). So Q47's census gate needs a re-run **after Q60**; Q58 itself is landed and verified technically (type-check, lint, 8933 tests, build). Not browser-checked (look of the cemetery lane/gate: author §2).

### Q80 baseline re-take (S, 2026-11-03, `main` after P1: production global hydrology, legacy path deleted, 059 sparse settlements)

`pnpm worldgen:roads:census` (rings ≤ 5). **Not comparable with §1.2/Q57–Q60 rows:** the 059 grid has far fewer settlements in the same window (3 / 6 instead of 88 / 99) and rivers/lakes changed (H3/L1/Q96). New baseline for Q61:

| seed | settl. | roads | no road | foreign | own back | plots | yards | entrance faces away | crossings | parallel | sinuosity p50/p90 | sharp turns /km | paths | paths ∩ plots | paths ∩ yards |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1.36 / 1.36 | 14.5 | 36 | 0 | 0 |
| 415424794 | 6 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1.18 / 1.21 | 10.5 | 101 | 0 | 0 |

Sample is tiny (2 / 4 roads), so sharp turns/km are indicative only; Q61 should also report a wider window (`--rings`) before/after.

### Q61 (R5 — route shape: string-pulling + corner rounding, Sonnet 2026-11-03, `main`)

New pure `settlement/routeShape.ts`, called from `findRoute` between the crossing anchors and the meander. (1) **String-pulling:** greedy line-of-sight shortcut, taken only if the line is dry, off hard village obstacles, has **no river hit**, never skips a locked anchor, and costs ≤ the A* chain it replaces (same cost formula: distance × ridge × footprint + elevation). (2) **Corner rounding:** Chaikin ×2 per run between locked points (anchors/ends stay exact), resampled at 6 m. (3) **Fallback ladder:** rounded → string-pulled only → anchor-exact chain; each rung must be clear and keep `sameCrossingTopology` vs the planned crossings (meander still falls back to its rung's own geometry). Caches: `road-routes` 8→9, `chunk-tiles` 20→21, `caves-v2` 6→7. Tests: `routeShape.test.ts`; existing bridge/ford/crossing tests green (full suite, type-check, lint, build).

Census `--rings=12` (22 settlements, 18/19 roads), before → after:

| seed | sharp turns /km | sinuosity p50/p90 | no road | plot hits | crossings |
| --- | --- | --- | --- | --- | --- |
| 42 | 8.1 → **2.4** | 1.29/1.48 → 1.22/1.40 | 1 → 1 | 1 → 1 | 0 → 0 |
| 415424794 | 8.9 → **4.2** | 1.21/1.48 → 1.18/1.38 | 2 → 2 | 1 → 1 | 0 → 0 |

`--rings=5` (2 / 4 roads): sharp 14.5 → 3.5 / 10.5 → 4.0, sinuosity p50 1.36 → 1.28 / 1.18 → 1.12.

**Done-when status: partly met.** Sharp turns ≤ 3/km met on seed 42 only (4.2 on 415424794; remaining turns are presumably at locked anchors/route ends or obstacle detours — not analysed). Sinuosity p50 moved −0.07 / −0.03 (target ±0.03): the shortening is the point of string-pulling (A* 8-direction chains carry ~7 % overhead), so the ±0.03 band looks too tight — author/Opus call. Crossing records: topology guard + unchanged crossing counts, no per-route test comparing against the pre-shape chain was added. Not browser-checked (look of curves: author §2).

### Q97 (bridge–road alignment, Opus 2026-11-04, `main`)

**Cause (✅ census):** a bridge deck is a straight slab on `crossing.angle`, which is the heading of the one polyline edge carrying the widest water hit, centred on the traversal midpoint and `span + 2 × 3 m` long. The shaped route keeps only the anchor and its two A* neighbours locked (≈ 9 m apart, up to 45° apart in heading), so the road bends at or before the bank while the deck continues straight — the deck end sits beside the road. Before the fix 12 of 15 bridges (rings ≤ 8) drifted 1.3–7.9 m off the road centreline, with up to 90° between deck axis and road heading at a deck end.

**Fix:** `straightenBridgeRuns` (`roadNetwork.ts`, after the Q61 shape ladder, before `smoothProfile`) replaces the stretch around each bridge with one chord (`routeShape.straightChordAround`): its ends are the first route points ≥ deck half length + 4 m from the crossing centre, chord ends must be dry and every probe off village obstacles. Crossings are re-derived from the result (`crossingsForPolyline`), kept only when the topology still equals `planned` and the re-derived deck centre lies on one chord edge with deck + 4 m on both sides; retries re-centre on the re-derived crossing and widen the chord by 4 m (4 attempts), otherwise that bridge keeps the shaped geometry (fail-safe, no crossing is dropped). Caches: `road-routes` 12→13, `chunk-tiles` 25→26, `abandoned-cemeteries` 9→10. Census: `pnpm worldgen:roads:census --bridges` (new columns `bridges`, `bridgeOff` > 1 m, `bridgeOffMax`, `bridgeTurnMax`; `--bridges` lists each deck on stderr).

Census `--rings=8`, before → after:

| seed | bridges | off-axis > 1 m | max offset (m) | max end turn (°) | sharp /km | other columns |
| --- | --- | --- | --- | --- | --- | --- |
| 42 | 5 | 3 → **0** | 5.0 → 0.0 | 47 → 0 | 2.8 → 2.8 | unchanged |
| 415424794 | 10 | 9 → **1** | 7.9 → 5.2 | 90 → 48 | 2.6 → 2.1 | unchanged |

Residual: `4_-1|6_-5#3` at (1280, −747), seed 415424794 — every straight chord across that oblique reach is rejected by the crossing policy (too oblique or span > 34 m), so it keeps the old shape. Fixing it needs a deck turned toward the river normal with the road bending onto it, not a chord — left as is (1 of 15). Cemetery census unchanged on both seeds. Not browser-checked (queue §2).

Wider window `--rings=12` (after the fix): 6 of 31 decks still off-axis — seed 42: `-6_-7|-9_-4#0` (−1852, −2080) 14.4 m and `-5_3|-9_7#0` (−1506, 934) 14.5 m (no clear chord in any attempt: chord end wet/obstacle or route end inside the radius), `-12_2|-9_7#2` (−2821, 1381) 5.9 m but parallel (1°, accepted chord later displaced — cause not analysed); seed 415424794: `4_-1|6_-5#3` (above), `-12_-2|-8_-2#5` (−2821, −536) policy reject, `-10_2|-11_6#1` (−3026, 775) chord changes crossing topology. A quick attempt (route end as chord end + guard that later chords keep earlier decks straight) changed none of them and was not kept. Follow-up → queue Q110.

### Author visual feedback — bridge elevation fit and later appearance (2026-11-04)

**Correctness issue — prioritize when road/bridge work resumes after geography:** On seed `415424794`, the bridge deck visibly fails to connect naturally to the banks/road terrain. The author's leading hypothesis is **different bank elevations**; the bridge may not reconcile its deck height/grade with the terrain and the road profile at both ends. This is **not** the Q97/Q110 horizontal bridge–road alignment defect, and the cause is **not yet verified**. Inspect deck endpoint elevations, bank samples, approach-road height profile (`smoothProfile`), and the bridge geometry/placement contract before choosing a fix. Acceptance: both ends meet their respective approaches without floating, burial, abrupt vertical steps or inaccessible transitions, including asymmetric bank heights; preserve deterministic crossings, road connectivity and navigation. Recheck on the final geography/hydrology terrain, not only the old baseline.

**Deferred visual polish — separate from the correctness fix:** Improve bridge geometry, proportions, supports and surface/wood textures later. Do not fold an asset redesign into the elevation repair or treat this note as approval of implementation.

**Tracking:** Keep this feedback in Q44 for the existing post-geography road close-out; no separate queue item, schedule change or new plan is requested.

## 6. Author decisions (also queue §3)

**ANSWERED 2026-11-02 (author):** **D1 (a)** RNG graph + fallback · **D2 custom** — main road **~7–8 m** wide (`roadHalfWidth` 5 → 3.5–4), ruts must stay **clearly visible**: only a slight reduction (rut depth 0.15 → ~0.11–0.12, micro-bumps reduced moderately), tuned in game · **D3 (a)** shared lanes + spurs to doors · **D4 (b)** allow **+1 entrance** when neighbours lie in a fourth distinct direction (palisade/torches/pasture must handle the extra gap). Options below kept for the record.

- **D1 — network topology (Q62):** (a) RNG graph + fallback — fewer duplicate parallel roads, real junctions, every settlement keeps ≥ 1 road (recommended); (b) keep "3 nearest" and only add junctions; (c) keep the topology as is.
- **D2 — road look (Q63):** (a) main road 10 m → ~7 m, realistic ruts/bumps (recommended); (b) keep the width, tune ruts only; (c) no change.
- **D3 — village lane style (Q57):** (a) shared lanes attached to the network, spurs to the doors (recommended — fewer paths, frees the edge band for cemeteries); (b) keep one straight path per house but route it around obstacles (more paths, Q47 still tight).
- **D4 — entrance count (Q59):** (a) keep today's per-size count, merge neighbour bearings into it (recommended); (b) allow +1 entrance when neighbours lie in a fourth distinct direction.

**Author review of the home settlement (2026-11-02, screenshot `_temp/osada-domowa-z-gory-01.jpg`, seed `415424794`, home now `SM`):** (1) **R2/Q58 scope extended** — the home settlement always gets a reserved own cemetery (`plot-cemetery-0`), whatever its size; other `SM` keep the shared/dedicated search. (2) **R3/Q59 check** — the main road passing east of the home village must get an entrance and a link into it. Pasture (Q65), palisade fragments (Q66) and hydrology continuity (Q67, lands before R4/Q60) are tracked in the queue.
