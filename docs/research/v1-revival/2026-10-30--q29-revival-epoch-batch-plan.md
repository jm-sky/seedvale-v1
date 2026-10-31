# Q29 — Revival worldgen epoch batch: recon and ordered plan

**Created:** 2026-10-30 by Claude Opus 5.5 (queue Q29)  
**Status:** batch plan — per-feature slices are queued as Q32–Q39; each slice writes its own short plan in its notes before implementing (or a formal `docs/plans/` file where marked).  
**Authority:** scope = [brief §1 "Revival worldgen epoch scope"](./STRATEGIC-BRIEF.md); epoch mechanism = [`persistence-008`](../../plans/persistence-008-save-format-vs-worldgen-epoch.md) (`src/persistence/worldgenEpoch.ts`). Source facts below were verified against `main` at `3dec0a69` (code sweep, file:line); code is authoritative.

## 1. Current owners (✅ verified)

| Concern | Owner | Fact that matters for the batch |
| --- | --- | --- |
| World placement | `settlement/settlementGenerator.ts` | `SETTLEMENT_GRID_STEP = 280` (:71), centre jitter `OFFSET_FRACTION = 0.3` (:75); settlement id = cell key `${gx}_${gz}` (:129); no pairwise min-distance check. Size rolled at cell centre before site search (:366–376). |
| Site search | `settlement/findSettlementSite.ts` | 80 candidates within ±24 (:50/:52), river clearance 8, flatness, dry ratio ≥ 0.4. |
| Size tiers | `settlement/families.ts` `VILLAGE_SIZE_CONFIG` (:65) | `footprintRadius` 22/40/48/56/72, `houseSpacing` 10/12/14/16/18, `houseRingMax`. |
| Layout | `settlement/villagePlanner.ts` `planVillageLayout` (:924) | **One sequential placer** `pickPlot` (:650): plaza well → houses (by family index) → household wells → stockpiles → gardens → campfire → market → notice board → food/work/livestock → sale plots → paths/entrances, pasture, paddock. Soft disc clearance; `HOUSE_PLOT_RADIUS = 4.5` (:76); last-resort fallback can overlap (:889–898). |
| Props | `settlement/props.ts` `buildSettlementProps` (:798) | House yaw faces plaza (:1342–1353); yard props per house along core→house axis (`houseYardPlacements` :1586), index-aligned with `landmarks.houses`. |
| Yards | `settlement/householdYard.ts` | Clearance contract only (barrel/trough/wood/storage offsets); **no yard plot, no fence**. Fenced areas exist only for pasture/paddock. Megakit wood fences exist (`public/models/settlement/megakit/fence_wood_*.glb`). |
| Settlement storage | `economy/settlementEconomy.ts` (contents), `props.ts:1107–1118` (crate next to stockpile → `landmarks.settlementStorage`), `storageDestinations.ts`, `storageVisuals.ts`, `storageRepair.ts` | **No storehouse building**; storage is an abstract stock + one crate prop. |
| Roads | `settlement/roadNetwork.ts` | 8 ring-1 neighbours nearest-first until `maxNeighborRoads = 3` succeed (`roadRoutesForSettlement` :790); A* 9 m grid, water hard reject, ford/bridge pricing; endpoints = best-facing `VillagePlan.entrances`. Edge exists when either endpoint picks it. |
| Cemeteries | `terrain/cemeteryAssignment.ts`, `terrain/cemeteryPlacement.ts`, `settlement/decorProps.ts` | SM pairs share within STEP×1.15; abandoned ≥ STEP×0.75 from settlements; layouts SM 1×3×3, MD 2×3×3, LG 3×4×3 (`CEMETERY_LAYOUTS` :837); grave slot indices reused by `hiddenFinds.ts:151`, `treasureSites.ts:382`, `lostTreasureChronicleSearch.ts:184`, `treasureMapBearCave.ts:110`. NPC burials are at corpse position (`grave:<npcId>`), not cemetery slots — unchanged by this batch. |
| Caches | `settlement-definitions` v4, `road-routes` v1, `abandoned-cemeteries` v2, `chunk-tiles` v5, `caves-v2` | Fixture namespaces: `persistence/worldgenFixtureNamespaces.ts:18` (tools-020 fixtures must be re-exported). |

**Identity:** households, houses, structures, NPCs, home places are keyed by **family index**; other plots by kind ordinal; `ownedLandPlots` by `${settlementId}:${plotId}`. Moving geometry keeps IDs but invalidates saved positions; changing the grid step re-identifies settlements. All of it is inside epoch 1 — no compatibility work per slice.

## 2. Batch rules

1. **Epoch bump once:** the first slice that changes generator output also sets `WORLDGEN_EPOCH = 1`; later slices reuse it. Saves made on `main` during the batch are dev saves.
2. **Every generator slice:** bump each affected cache namespace (table per slice), regenerate the tools-020 fixtures (`scripts/perf/export-worldgen-fixture.mjs` + check script), determinism test (same seed → same defs, cold vs warm cache).
3. **Order matters** because placement is sequential: world spacing → plot geometry (house spacing + yard footprint) → new plot kinds (storehouse) → fences on top of final plots → object placement fixes → roads re-validation → cemeteries. Each slice is reviewed on seed `415424794` and 42.
4. **Performance:** fenced yards and the storehouse add draws per settlement — instanced/batched through the existing settlement pipelines (fences like paddock fences, storehouse as a building template); record draws per settlement before/after (structural count, no FPS claim).
5. **Not in the batch:** cemetery/fence mesh-only polish keeping placement and IDs; storehouse interior; burials into cemetery slots; any change to simulation density.

## 3. Ordered slices

| Q | Slice | Model | Depends | Changes | Caches | Done when | Stop if |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q32 | **Spacing calibration tool** (no generator change) | S / X | — | Node/vitest script: for seeds 42, 415424794, 1, 2, 3 and a fixed cell window (rings ≤ 5), report accepted/null cells, size distribution, nearest-neighbour + road edge length p10/p50/p90, failed routes, components, ford/bridge counts, for pitch 280 vs 300/310/320 (pitch injected, not the constant) | — | Table in this doc's §4; recommended pitch reaching ~+10–15 % median comparable road length without losing connectivity or settlement count beyond noise | No pitch reaches the target without losing settlements/connectivity → author choice (§3 of the queue) |
| Q33 | **Settlement spacing** + epoch bump | S | Q32 | `SETTLEMENT_GRID_STEP` (+ derived cemetery distances already scale), `WORLDGEN_EPOCH = 1` | settlement-definitions, road-routes, abandoned-cemeteries, chunk-tiles, caves-v2 | Generator tests green; progression rings, Lost Treasure hosts, neighbour cast still resolve on both seeds | Home progression or quest hosts fail to resolve |
| Q34 | **House spacing + yard footprint** | O→S | Q33 | `houseSpacing`/`HOUSE_PLOT_RADIUS` grow to hold a yard rectangle (house footprint + yard depth), `footprintRadius` grows with it; yard props move into the yard rectangle; remove the overlapping last-resort fallback for houses (place fewer optional plots instead of overlapping) | settlement-definitions, road-routes, chunk-tiles | No house/yard overlaps on 30 sampled settlements (test); family count unchanged | Family count would drop (reduced density → author) |
| Q35 | **Fenced yards** | S | Q34 | Per-house fence around the yard rectangle with a gate facing the plaza path; reuse paddock fence segments/collision + megakit wood fence; fence segment ids `household-yard-fence-${familyIndex}-${n}`; NPC/player pathing through the gate | settlement-definitions (if in plan), chunk-tiles | Collision + navigation tests (NPC reaches house door and yard props); draws per settlement recorded | NPC routines can't reach yard work points |
| Q36 | **Settlement storehouse** | O→S | Q34 | New plot kind `plot-infra-storehouse-0` placed after stockpiles (MD+; SM/OUTPOST keep the crate — 🟡 proposal); `landmarks.settlementStorage` and `storageDestinations` point at the storehouse door; `storageVisuals` overflow stays outside; rat infestation / `storageRepair` target the building | settlement-definitions, chunk-tiles | Economy deliveries/withdrawals and repair work on the new target; existing storage tests updated | **Needs a building model** — none in repo (author, §3) |
| Q37 | **Settlement object placement pass** | S | Q34–Q36 | Audit remaining props for overlaps/clipping on sampled settlements (wells, stalls, campfire, notice board, gardens, torches, lanterns, wood piles) and fix placement rules in the planner, not in props; test asserting no disc overlaps among plots | settlement-definitions, chunk-tiles | Overlap test green on 30 sampled settlements per seed | A fix would drop a mandatory object |
| Q38 | **Roads re-validation** | S / X | Q33–Q37 | Re-run Q32 metrics on the final layout; fix entrance choice/route failures introduced by new footprints; ensure every settlement keeps ≥ 1 route | road-routes, caves-v2, chunk-tiles | No settlement without a road on both seeds; metrics recorded | Routing algorithm redesign needed |
| Q39 | **Cemetery size + placement** (formal plan `settlements-025-…`) | O→S | Q33 | V2-style layout per brief: graves with plaques + crypts (SM 1, MD 2, LG 3), larger footprint with placement checks; **grave slot order must stay a stable function** consumed by hiddenFinds/treasure/chronicle modules (update all four together) | abandoned-cemeteries, chunk-tiles | Hidden finds / chronicle / treasure tests resolve the same roles; per-piece collision | **Needs grave/crypt models** — V2 `graveyard.glb` not found locally (author, §3) |

**Delegation (`X`):** Q32 and Q38 are metric scripts with a fixed output table — good ChatGPT/Codex/Cursor candidates; review the script before trusting numbers.

## Q37 — author direction (2026-10-31)

**Status:** Author approves Opus preparing a detailed Q37 plan and performing a bounded, reversible preliminary implementation. This is **not visual acceptance**. The author must visually approve the result before it is considered finished. Keep an explicit rollback path (isolated commits, comparison against baseline, clear keep/revert criteria); do not regard collision tests alone as acceptance.

- **Scope:** Improve settlement composition, character and aesthetics, as well as placement correctness. Examine plazas, wells, campfires, markets, workshops, woodpiles, gardens and remaining props. Preserve functional NPC interactions and accessibility. Do not reduce Q37 to collision elimination.
- **River proximity:** Investigate and fix observed props placed in/over rivers. Inspect actual river channel and banks, whole prop footprints, height/terrain flattening, late placements and the unconditional final fallback in villagePlanner.pickPlot. Preserve meaningful waterfront placement while ensuring safe clearances.
- **Roadside guard point (proposal for evaluation, not approved implementation):** Consider a useful observation/standing point next to a road, potentially as part of a patrol. Check guard schedules, approach/navigation, path clearance, road entrance/palisade relation and sightlines. Avoid adding a purely decorative marker disconnected from NPC behaviour.
- **Dependencies:** Coordinate after Q34 house/yards, Q35 fences/gates and Q36 storehouse. Respect Q29 worldgen epoch, deterministic identities, cache/fixture updates and existing instancing/batching. Avoid unplanned changes to simulation workload.
- **Verification and handoff:** Opus should specify representative visual inspection cases including river-adjacent layouts, seeds 42 and 415424794, multiple settlement sizes/patterns, player/NPC access, placement/collision checks and per-settlement render submission counts. Preliminary work is allowed, but **author visual sign-off remains mandatory**. If unacceptable, revise or revert.

## Profession-signature homes — author-approved outcome (2026-10-31)

**Decision: required Revival feature, not merely a research candidate.** Houses and their immediate surroundings must visibly communicate the profession of the resident household at a glance, without opening UI. Opus owns technical assessment, scope refinement and planning; this decision does **not** pre-approve a V3 copy, specific implementation, or unverified performance claims.

- **Visual reference / preferred donor:** V3 already achieved the desired effect and reportedly uses optimized assets with the same house models as V1. Inspect actual V3 code, models, materials and placement first; choose direct reuse where compatible, selective adaptation otherwise. V1 remains authoritative.
- **Initial examples:** hunter — drying hides outside, deer antlers on/above the entrance; guard — wall shield and banner/flag; fisher — drying fishing nets. These establish the visual target, not an exhaustive profession list. Opus should assess coverage for other professions and households with multiple professions.
- **Placement and ownership:** bind dressing deterministically to the existing household/family and house identity, not a settlement-global profession singleton. Coordinate with `settlements-npcs-024` (profession workplaces), Q34 (yard footprint and access), Q35 (fences/gates), and Q37 (settlement composition). Do not block doors, household props, work anchors, paths, or NPC/player navigation.
- **Epoch boundary:** wall-mounted/small visual dressing that preserves layout, persistent identities and access can follow the worldgen batch as a reversible visual slice. If a drying rack or other required prop needs reserved yard area or changes settlement layout, Opus must include that spatial reservation in Q34 / epoch 1 **before the batch closes**. Do not assume all examples are footprint-neutral.
- **Performance:** modest additional render cost is acceptable; zero cost is not expected. Aim for a small, measured impact through compatible optimized models, instancing/batching, sensible material/texture reuse and appropriate visibility handling. Record added geometry, draw submissions and representative settlement performance, not just asset triangle counts. Avoid costly new per-house runtime systems.
- **Acceptance:** representative visuals must make professions recognizable; compare to V3, inspect multiple house orientations/yard arrangements, ensure deterministic generation and reachable NPC/player access, and verify no material performance regression. Author visual approval is required. Opus may split spatial planning from visual dressing and should keep changes reversible.

**Planning disposition:** treat as a dedicated, explicit profession-house-dressing work item coordinated with Q34/Q37, rather than silently folding it into generic collision/placement cleanup. Exact task ID and implementation order belong to Opus's queue review.

## 4. Calibration results

_Filled by Q32._

## 5. Open questions (queue §3)

1. **Storehouse model:** source? (a) Megakit/other existing pack in `LOCAL_ASSETS` (agent searches first), (b) the author generates/downloads one, (c) temporary: an existing house model re-used as storehouse.
2. **Crypt/grave models:** V2 `graveyard.glb` (`public/assets/parked/`) is not in the local V2 checkout — (a) the author provides it, (b) different pack.
3. **Roads:** besides re-validation after spacing, is there a concrete road complaint (shape, too many/few roads, bridges)? Without one, Q38 stays a validation slice.
