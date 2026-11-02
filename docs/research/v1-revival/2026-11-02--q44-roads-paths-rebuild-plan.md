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
- **Entrances from neighbour bearings:** bearings to the ring-1 neighbours (`probeSettlementSite`, nearest first, same order `neighborsFor` uses) replace the seeded axis for road entrances; bearings closer than ~40° merge into one entrance; count stays bounded by today's per-size count (+1 at most when a fourth distinct direction is needed — ❓ §6 D4). Remaining entrance slots (paths, waterfront inland preference) keep today's rules. Palisade gaps/torches/pasture keep consuming `plan.entrances`, unchanged contract.
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
- **Topology (❓ §6 D1):** replace "3 nearest that route" by a **relative-neighbourhood graph** on settlement sites (edge A–B kept unless some C is closer to both), computed from site positions only → order-independent, deterministic, connected (contains the MST), no triangles of parallel roads; if an RNG edge cannot route, fall back to the next nearest unconnected neighbour exactly like today so no settlement loses its last road. Keeps the route cache per pair, `RoadRoute` contract unchanged.
- **Junctions:** a pure post-pass over the routes that touch a chunk: where two roads cross or come within one road width, both get a shared junction point and the terrain corridor blend averages heights there (see §2.3). No route depends on another route's computation order (the pass is a function of the final pair routes).

### 2.3 Presentation (chunk-tiles only, visual)

- Junction blend in `applyTerrainCorridors`: overlapping road corridors blend their target heights by falloff weight instead of the winner-takes-all candidate.
- Road hierarchy: ❓ §6 D2 — main road `roadHalfWidth` 5 → ~3.5 (7 m), local road 2.4, path 1.5; ruts/micro-bumps from the diagnostic values to realistic ones (rut 0.15 → ~0.06, micro-bump 0.2 → ~0.06). Author judges in game.
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

## 6. Author decisions (also queue §3)

- **D1 — network topology (Q62):** (a) RNG graph + fallback — fewer duplicate parallel roads, real junctions, every settlement keeps ≥ 1 road (recommended); (b) keep "3 nearest" and only add junctions; (c) keep the topology as is.
- **D2 — road look (Q63):** (a) main road 10 m → ~7 m, realistic ruts/bumps (recommended); (b) keep the width, tune ruts only; (c) no change.
- **D3 — village lane style (Q57):** (a) shared lanes attached to the network, spurs to the doors (recommended — fewer paths, frees the edge band for cemeteries); (b) keep one straight path per house but route it around obstacles (more paths, Q47 still tight).
- **D4 — entrance count (Q59):** (a) keep today's per-size count, merge neighbour bearings into it (recommended); (b) allow +1 entrance when neighbours lie in a fourth distinct direction.
