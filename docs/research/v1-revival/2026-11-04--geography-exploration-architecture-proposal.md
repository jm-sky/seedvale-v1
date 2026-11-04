# SeedVale V1 — Geography & Exploration Revival: Architecture Proposal

**Date:** 2026-11-04
**Author:** Claude Opus 5.5 (decision-preparation session)
**Status:** **Proposal for author review.** Nothing here is an approved decision, plan or numeric target. No runtime code, formal plans or plan statuses were changed.
**Input:** [Astra architecture recon](./2026-11-04--geography-exploration-revival-architecture-recon.md) (research starting point), author preliminary directions A–E (2026-11-04), [Strategic Brief](./STRATEGIC-BRIEF.md), [queue](./AUTONOMOUS-SESSION-QUEUE.md), plans [058](../../plans/world-terrain-058-finite-continent-and-global-hydrology.md), [059](../../plans/world-terrain-059-world-scale-travel-time-and-sparse-settlements.md), [Q44](./2026-11-02--q44-roads-paths-rebuild-plan.md), queue rows Q70 and Q92.
**Evidence used here:** V1 `main` at `0619bf51`; the committed whole-continent previews [`continent-415424794-all-streams.png`](./continent-previews/continent-415424794-all-streams.png) and [`continent-42-all-streams.png`](./continent-previews/continent-42-all-streams.png); V2 `src/game/sim/rumours.ts` at `9ba54815`. No new census, benchmark or browser run was performed in this session; every number below is either quoted from a named source, arithmetic from named constants, or explicitly marked as a target range to be validated.

Evidence labels: ✅ verified in code/committed artifact this session · 📏 published measurement (dated, quoted) · 🟡 inference/hypothesis · 🎯 proposed target (needs validation).

---

## 1. Executive recommendations

1. **One acyclic geography pipeline, extended in place — no new world generator.** Add two small, bounded inputs to the existing V1 owners: a **static macroclimate field** and a **sparse landform descriptor set**. Both are computed from the *unconditioned* relief, before global hydrology. Everything downstream (hydrology, biomes, settlements, roads, landmarks, catalog, weather modulation) consumes them; nothing downstream feeds back.
2. **Rivers: fix the cause, not the map.** The dominant cause is a tiny, uniform channel-initiation threshold (✅ every land cell contributes `1`, a stream starts at `15` cells ≈ 960 m²). Replace it with **area-based thresholds × climate-weighted runoff**, and split drainage into **perennial channels (water)** and **dry drainage lines (terrain only)**. Keep priority-flood, global chains, lakes and canonical carving. 🎯 Order-of-magnitude goal: the perennial network becomes roughly a third to a half of today's visible network, concentrated in humid/upland-fed basins, with clearly dry interfluves.
3. **Climate becomes a shared world property.** A pure, position-based `T/P/maritime` sample (north colder, lapse with altitude, maritime moderation, bounded regional noise) drives biomes, vegetation, runoff and — in a first, small step — the local precipitation phase (rain vs snow) and temperature offset on top of the existing global seasonal weather. No atmospheric simulation.
4. **Settlements: measure on routes, then let geography cluster them.** Current median neighbour journeys already sit near the *top* of the 059 band (🟡 arithmetic below). Uniform compression cannot shorten journeys much without either many more settlements or wilderness loss. Prefer **climate/terrain-suitability-driven inhabited regions** plus moderately shorter selection spacing and a slightly higher count (🎯 24–28), validated by route-weighted census.
5. **Landmarks: few, geological, before hydrology.** First package = terrain-only landforms (isolated rocky hill/crag, crater/caldera lake, distinctive lake with island) and *derived* waterfalls. Structures (castle ruin, large ruin complex) follow as a second package on top of those landforms, reusing the environment/adventure placement paths with modular instanced geometry.
6. **Discovery reuses `LocationKnowledge`.** V2's rumour mechanism maps almost 1:1 onto V1's `estimated` confidence + `WorldLocationArea`; adopt its *policy* (opinion gate, open-lead cap, off-centre vague area, no proper name until visited), not its store. Fix Q106 (lakes invisible to the catalog) first — it is independent and cheap.
7. **Epoch:** `WORLDGEN_EPOCH = 1` is still the open Revival batch (✅ constant is `1`; Q37 and Q38/Q62–Q64 still in progress; the author has not closed the batch). Recommend including the geography foundation in epoch 1 and moving the Q64 road close-out census + fixture re-export after the settlement recalibration — **author decision G1**.

---

## 2. What the current world shows

From the committed continent previews (✅ artifacts; diagnostic *all-streams* mode, so stream prominence is exaggerated by design — tools-023):

- **Streams everywhere, including arid tan regions.** The network density is visually the same in dry (tan) and forested regions → consistent with uniform runoff, not only with map exaggeration.
- **Biomes are blobs without regional logic.** Tan/forest/meadow patches alternate at a 0.5–1.5 km scale across the whole island with no north–south or coast–interior tendency (✅ code: biome weights come from seeded moisture FBM + altitude; no latitude term).
- **Mountains are small isolated grey patches, not ranges.** This matters for climate: a rain-shadow model needs coherent barriers that the current relief rarely produces (🟡). Rain shadow is therefore deferred, not designed in.
- **Many sea inlets and inland water bodies fragment the land.** They lengthen routes (bays, river-enclosed sites — queue §3 Q84-a) independently of settlement spacing. Not reopened here (author-approved continent shape), but it must be in the travel census.

From code (✅): `computeClimate(seed, elapsedDays)` has no position; `biomeWeightsAt` uses moisture + normalized altitude; `worldLocationCatalog` classifies water with the sea-only `isFloorBelowSea`; settlement selection starts at `SETTLEMENT_SPACING_M = 1150`, target 22, relaxing by 100 m; `lakeMinCells 600`, `minChainCells 8`, thresholds 15/50/200.

---

## 3. Proposed architecture and generation order

### 3.1 Stages (logical order; existing owners in brackets)

| # | Stage | Inputs | Output | Owner (existing unless noted) |
| --- | --- | --- | --- | --- |
| G0 | World frame | seed | normalized coordinates, **north = −Z** (current north-up projection), home reserve | `worldConfig` |
| G1 | Base relief + **landform descriptors** | seed, continentalness/ridges/massifs | unconditioned floor `sampleRawFloorUncorrected` incl. bounded landform profiles | `chunkHeightmap.ts` + new small `landformDescriptors` module (descriptor list + spatial bucket index) |
| G2 | **Static macroclimate** | G1 floor (unconditioned), coarse coast distance | `macroClimateAt(x,z) → { temperature, precipitation, maritime }` | new small `terrain/macroClimate` (pure functions + one coarse grid) |
| G3 | Global hydrology | G1 floor, G2 runoff weight | conditioned floor, lakes, **perennial chains**, **dry drainage lines** | `worldHydrology.ts` (unchanged algorithm) |
| G4 | Environment classification | conditioned floor, G2, G3 (downstream only) | biome weights, forest type, treeline/snowline, riparian bands | `biomeRegions.ts`, `biomeColors.ts`, `chunkVegetation.ts` |
| G5 | Sites and routes | conditioned floor, G2 suitability, G3 rivers, G1 landform footprints | settlement selection → defs → roads; major structure sites; caves | `settlementLayout.ts`, `settlementPlanCache.ts`, `roadNetwork.ts`, `largeCaves.ts` |
| G6 | Derived features | G3 chains × relief | waterfalls/rapids at genuine steep reaches | post-hydrology pass (owner: river presentation) |
| G7 | Projections | everything above | chunks, props, map raster, location catalog, knowledge, **local weather modulation** | `chunkEnvironment.ts`, map, `worldLocationCatalog`, `weather.ts` consumers |

### 3.2 Acyclicity rules (the contract)

1. **Climate never reads hydrology.** G2 uses the unconditioned floor and its own coarse sea mask. River-derived wetness (riparian vegetation, marsh near lakes) is a G4 *display/ecology* modifier and never feeds G3.
2. **Landforms never read settlements or roads.** They are chosen from relief + seed only, with a fixed reserve around home. Settlements and roads avoid landform footprints; a castle site is chosen from landform prominence *before* settlements; an optional spur road to it is a G5 downstream choice.
3. **Weather never writes geography.** Current weather is `f(seed, day)` modulated by `macroClimateAt(position)`; it can wet surfaces or lay snow, but never regenerates rivers, sites or identities.
4. **Biomes may read rivers; rivers may not read biomes.** Runoff comes from climate (G2), not from the biome result (G4).

### 3.3 Data shape and cost (conceptual)

- **Macroclimate** — analytic per sample: latitude term, lapse from unconditioned height, bounded low-frequency regional noise (reuse the existing moisture-region noise as the regional precipitation term), plus a maritime term from a **coarse coast-distance grid** (🟡 32–64 m cells over ±6144 m ≈ 192²–384² floats, ≤ 0.6 MB; computed once from the unconditioned sea mask with a two-pass distance transform). Install it alongside the hydrology payload under the same `hydrologyId` lifetime (worker copies already exist for hydrology), version it with the hydrology namespace because runoff depends on it.
- **Landform descriptors** — 3–8 records per world (`id`, `kind`, centre, radius, params, `intendedOutcome`), stored in a 512 m bucket index so `sampleRawFloorUncorrected` does an O(1) lookup and evaluates at most 1–2 analytic profiles per sample. Stable IDs from the chosen candidate cell key (`lf:<kind>:<cellKey>`), not from list ordinals, so adding/removing a lower-ranked candidate does not re-identify others.
- **Hydrology** — one per-cell multiply for runoff weight; thresholds expressed in m² and converted by cell area (V3 pattern). Fewer chains should *shrink* the 6.63/6.79 MiB payload (📏 058 notes) and the number of river tiles/meshes — expected, **not claimed**; measure.

---

## 4. Recommendations A–E

### A. Settlement distances and density

**Problem / cause.** Author reports settlements hard to encounter. 🟡 Arithmetic from current constants: player 6 m/s with a 12-min day → 180 m per game hour (queue §3 Q81-a). 📏 Median straight edge 1,490/1,474 m (059 W4) × median route ratio 1.22/1.18 (Q61) ≈ 1.75–1.8 km ≈ **9.7–10 game hours** — the top of the 059 4–10 h band, before access legs and slopes. Second factor: with distance fog far ≈ 160 m (Q54 note), a settlement is only perceived within a few hundred metres; spacing alone cannot fix encounterability. Third: selected ≠ materialized ≠ road-connected (📏 22/20 materialized; 18/19 roads, 1/2 roadless in the Q61 window).

**Preferred direction.**
1. **Measure first (route-weighted census)**: per graph edge — straight distance, entrance-to-entrance polyline, access legs, ratio, game hours (player 6 m/s and NPC 3.6 m/s), failed edges, connected components; per world — selected vs defined vs road-connected counts, land area, share of land within N road-hours of a settlement, and a **wilderness share** (land > X h from any settlement). Extend `worldgen:roads:census` / `worldgen:spacing:census`; whole world, not only `--rings`.
2. **Then calibrate with geography rather than uniform compression.** Add macroclimate/terrain suitability to the existing candidate ranking (temperate, moderately moist lowland, near perennial water or coast, outside landform footprints). This produces inhabited corridors and natural wilderness (cold uplands, dry interior, rugged massifs) without an explicit "cluster" mechanism. Combine with moderately lower start spacing and a slightly higher target.

🎯 **Candidate target ranges (to validate, not chosen):** neighbour route median **5–7 game h** (~0.9–1.25 km route), p90 ≤ 9 h, no edge > 11 h; settlements **24–28**; 1 road component, 0 roadless settlements; wilderness share **≥ 20 %** of land beyond ~5 h from any settlement; ≥ 1 neighbour within 6 h for every settlement. Start-spacing experiments around 900–1,050 m with the relax floor actually reachable (fix the 1150→…→750→650 trap: either make 720 a tested step or lower the floor explicitly).

**Alternatives.** Uniform spacing reduction with 22 settlements (cheap, but 🟡 on ~35–45 km² of land the average area per settlement forces ~1.3 km spacing — a 5–7 h median needs either clustering or ~40+ settlements); only fixing route failures (keeps identities but not the core feel); a separate density map (new parallel mechanism — rejected).

**Dependencies.** After C (river count changes crossings, roadless cases, H4 heads) and after landform footprints (D-T1). Before Q64 road close-out census. Settlement-size growth from home (MD→LG→XL within ~1.5 km, Brief) must remain satisfied — census check.

**Risks.** Clustering creates an empty half of the island (guard with coverage and wilderness-share bounds both ways); progression host guarantees; NPC transport/trade distances change (verify expeditions and provisioning); settlement-def cache bump.

**Validate before implementation.** Census on both seeds; three experiment configurations side-by-side with continent preview + settlement markers; one timed walk on the reference seed per configuration finalist (author or agent, recorded separately from geometry).

**Encounterability (cheap complement, not spacing):** road milestones/signposts showing travel time and direction near junctions (059 already wants distances as travel time) — verify whether any signpost asset/system exists before proposing it as a slice.

### B. Macroclimate and geographical regions

**Problem / cause.** ✅ No latitude/temperature axis in biome or weather owners; moisture is independent FBM; weather is global. Result: random patchwork (previews).

**Preferred direction: shared static macroclimate (Astra option 2), rain shadow deferred.**

- **Temperature** `T = T_mid − k_lat·zNorm − lapse·max(0, h − sea) + regionalNoise_T + maritime·(T_mean − T)·m`, where `zNorm` runs −1 (north, −Z) … +1 (south). Regional noise amplitude bounded to ≈ 25–35 % of the north–south span so bands bend and break but the tendency stays (🎯). Lapse scaled to V1 heights (V2/V3 coefficients are not transferable — their elevations differ).
- **Precipitation index** `P = base + regionalNoise_P (existing moisture-region noise) + coast boost (maritime) − interior penalty`, with an optional mild southern drying term if the author picks the "distinct" contrast. Orographic/rain-shadow only if landform/relief work produces real barriers.
- **Biome mapping**: a small Whittaker-style table on `(T, P)` + altitude feeding the *existing* weights (forest/desert/swamp + forest type) with continuous blending. This **subsumes queue Q70** (domain warp + borders): do Q70's border warp inside this change rather than separately, to avoid two biome-distribution bumps.
- **Grounded palette by region (🟡 proposal):** north — boreal conifer/birch, heath, bog, earlier snowline; centre — temperate mixed forest, meadows, wetlands in low basins; south — warmer, drier: open grassland, scrub, oak/pine woodland, dry riverbeds. Current inland "desert" tan becomes dry steppe/heath; sand stays on beaches/dunes (decision G2).
- **Runoff weight** for G3: `runoff = clamp(f(P, T), ~0.25 … ~1.5)` (🎯 range) — humid north/coast feeds rivers, dry south has few perennial channels.
- **Weather, phase 1 (small, deterministic):** keep `computeClimate(seed, day)` as the global season/weather state; add a pure `localClimateAt(climate, macro)` giving temperature offset and precipitation phase (rain→snow where local T is cold: north, peaks). Consumers that already use weather (snow patches/grass burial, wetness, barks) query it **at the entity/site position**, never at the player. Phase 2 (later, separate approval): regional precipitation frequency, fog, crop/garden growth and fauna habitat by climate.

**Alternatives.** Temperature-only in biome classification (cheapest; leaves runoff and weather inconsistent); full wind/rain-shadow preprocessing (not justified by current relief).

**Dependencies.** Feeds C (runoff), A (suitability), D (snow-capped crag, volcanic silhouette context), E (regional knowledge text). Snow-patch thresholds (world-terrain-053) must move to local T.

**Risks.** Stripe look if regional noise too weak; lost variety in the south if drying too strong; vegetation instance counts change by region (perf neutral on average, but must be checked in the densest region — D9: no reduced density approved); snow/weather consumers that assume one global temperature.

**Validate.** Preview layers: T, P, runoff, dominant biome (both seeds) before/after; 3–4 browser spots on the reference seed (north forest, south dry land, a peak, a coast); vegetation instance census per chunk in the densest region.

### C. Hydrology — excessive rivers

**Problem / cause (ranked).**
1. ✅ Uniform runoff + 15-cell (≈ 960 m²) initiation — essentially gullies become streams.
2. 📏 Q96 lake reduction let former ponds drain onward (chains 1,838 → 2,301 on the reference seed) — correct hydrology, more visible network.
3. ✅ Diagnostic map mode shows all tributaries with exaggerated widths; the committed previews are that mode.
4. 🟡 D8 fixed tie-breaking on conditioned flats and fine relief detail produce aligned/parallel paths; some parallels are valid separate catchments.

**Preferred direction (coordinated, single calibration):**
1. **Area-based thresholds** in m² (resolution-independent) on **runoff-weighted accumulation** from B.
2. **Two drainage tiers:** *perennial channel* (water ribbon, bed carving, crossings, drinking/fishing/swimming, map blue) and *dry drainage line* (terrain only: shallow valley/gully, stony or greener strip, no water, not a road obstacle, shown at most as a faint line on the diagnostic map). Lake outlets and lake-fed chains stay perennial.
3. **Parallel-stream diagnostic** before any geometric fix: detect pairs of chain segments < ~30 m apart running parallel > ~150 m with no ridge (height bump) between them → artifact vs valid. Only if artifacts survive the threshold change: treat flats (gradient-toward-lower + away-from-higher on filled flats) or merge sub-threshold sibling paths at confluences. No new meander pass.
4. **Map hierarchy:** gameplay map draws perennial chains only, width from physical width class with hierarchical strokes; diagnostic all-streams stays a tool. The continent preview tool should export both modes so the author judges gameplay-mode images.

🎯 **Calibration metrics (targets to validate on both seeds):** perennial channel density per land km² reduced to ~⅓–½ of today's stream density; perennial heads reduced ≥ 60 %; ≥ 3 recognizable river systems with major trunk + tributary hierarchy per seed; share of land > 300 m from perennial water ≥ 35 % (dry interfluves exist); 0 suspicious parallel pairs in the artifact class; lakes/outlets/continuity checks of 058 unchanged.

**Seasonal streams.** Recommend **not** in the first stage: a visible water ribbon with seasonal swimming/crossing semantics touches movement, NPC pathing, drinking, fishing, map and save-free determinism. The dry-drainage tier already gives believable dry valleys. Keep seasonal water as a later optional mechanic (decision G4).

**Alternatives.** Threshold-only (fast but ignores regional climate; risks double calibration later); map-only filtering (rejected as sole fix by the author).

**Dependencies.** Needs B's runoff (or is calibrated twice). Changes A (crossings, roadless sites, H4 heads), roads (bridges/fords; Q97 alignment), Q92 river visual polish (should follow, now fewer/larger rivers), fixtures (re-export), `WORLD_HYDROLOGY_VERSION` + golden hash.

**Risks.** Settlements lose water access (suitability must prefer perennial water); headwater gaps make rivers start abruptly (keep V3-style headwater taper); some quests/props bound to small streams (census river-bound objects); boot time of the hydrology pass (should not grow).

**Validate.** Extended `worldgen:rivers:census` (metrics above + payload size + chain counts by class); gameplay-mode and diagnostic previews before/after; 3 matching 3D catchments on the reference seed (raw drainage vs smoothed path vs bank geometry); home stream still present and plausible.

### D. Major regional landmarks and terrain features

**Problem / cause.** ✅ V1 has many small, chunk-local landmarks (monolith, stone circle, small ruins, tower, old tree, wreck, wagon) and stable cave anchors, but no regional silhouette/rarity control; 🟡 current relief yields few memorable forms (previews: small isolated grey patches).

**Preferred direction — three categories with different owners:**

| Category | Examples | Where in pipeline | Mechanism |
| --- | --- | --- | --- |
| T — terrain landforms | isolated rocky hill/crag (inselberg), steep rocky summit, crater/caldera lake, distinctive lake with island, dormant volcanic cone | G1 (before hydrology) | landform descriptors with analytic height profiles; hydrology decides the water outcome; `intendedOutcome` asserted by census (e.g. crater must hold a lake) |
| H — hydrology-derived | waterfalls, rapids, gorges along a scarp | G6 (after chains) | detect genuine steep reaches on perennial chains; visual object + sound; creating a drop requires a T descriptor (scarp), never post-hoc carving |
| S — structures | castle ruin, large ruin complex, watchtower on a crag | G5 (before settlements/roads) | site chosen from T prominence; reserved footprint; built from a modular kit; bound to existing location catalog/adventure bindings (as `darkForestTreasureSite`) |

**Selection rules.** Candidate scoring from relief (prominence, isolation, coastal/lake context), Poisson-style minimum separation, home reserve, per-kind cap 0–2, total 🎯 3–7 major features per world; no kind guaranteed per seed, but a world with < 3 major features re-scores (deterministically) so every seed has some. Avoid regular spacing by score-driven selection rather than grids.

**Performance (conceptual).** Landforms: analytic terrain, zero extra draw calls beyond normal chunks; rock outcrops via existing rock instancing. Structures: modular kit pieces as `InstancedMesh` per piece type or merged per site at build time; one near LOD and one coarse silhouette LOD that only exists inside fog range (no view-distance increase — Brief §2); simplified box colliders; per-site budgets set in the structure plan (🎯 order of tens of draw calls and tens of thousands of triangles near, a handful of draw calls far). Streaming: sites belong to their chunks' lifecycle; no always-resident landmark meshes.

**Interactions.** Craters/lakes change hydrology (designed: descriptor before G3). Landform footprints exclude settlements/roads; settlements may get a mild suitability bonus *near* (not on) a castle hill. Queue Q100 (large caves ringed 130–620 m around origin) fits here: distribute caves across the continent preferring hill/massif flanks — answerable independently (§3 Q100 option a) but should use the same terrain scoring.

**Alternatives.** Promote existing peaks/lakes only (cheapest; few truly distinctive forms exist); large authored meshes (costly, poor terrain integration — rejected for landforms).

**Risks.** Landform profiles create seams or unwalkable cliffs (bounded slopes except intended crag faces); craters drain unexpectedly (assert outcome); structure geometry cost (budget + LOD before content); realism drift (no floating islands, no giant arches; volcano = dormant, eroded).

**Validate.** Preview overlay of descriptors on both seeds + 5 other seeds for variety; prominence/visibility check from nearest road (is the silhouette visible inside fog range from somewhere on the route?); hydrology census `intendedOutcome` assertions; for structures, draw-call/triangle census in a stand-alone scene before world integration.

### E. Exploration and discovery

**Existing V1 (✅):** `LocationKnowledge` (`estimated → discovered → confirmed`, forward-only), `WorldLocationArea` (bounded search area), proximity discovery, guard local knowledge (cemetery, ruins) with deferred research, NPC follow-up delivery, maps; catalog kinds `settlement | cave | cemetery | lake | mountainPeak | ruins | abandonedMine | searchArea`. **Gap:** lakes above sea level are invisible to the catalog (Q106).

**V2 donor (✅ `rumours.ts`):** opinion-gated villager rumour about the nearest unexplored place 600–4,500 m away, max 4 open, deterministic off-centre circle 120–260 m, described generically ("an old place", "a cave in the rock"), confirmed by exploring. **V1 already has the data model** (estimated + area); adopt only the *policy*.

**Preferred direction.**
1. **Q106 first** — lakes in the catalog via the shared wet-surface query (no new lake database).
2. **Landmarks enter the existing catalog**: map T/S features onto existing kinds (`mountainPeak`, `lake`, `ruins`) with a descriptor reference and subtype; add a kind only where none fits (🟡 likely `waterfall`). Major features get deterministic proper names (like settlements, locally unique) learned only on `discovered`.
3. **Leads, not pins**: NPC rumours create `estimated` knowledge with an off-centre area, opinion-gated, capped open leads, regional reach (NPCs know their region better than far places). Directions phrased geographically ("follow the river north to the big lake") generated from the route/hydrology graph — data only; **all new NPC text is drafted by Astra** (Brief, 2026-11-02).
4. **Landscape clues**: silhouettes inside fog range, rivers leading to lakes, roads/spurs leading to castle hills; maps sold or found as `discovered` for a region. A landmark is never auto-revealed by being generated.
5. **Quests**: existing quest/adventure bindings may target catalog entries; no separate exploration framework or quest marker.

**Risks.** Over-guidance kills wilderness (cap leads, vague areas); catalog version/knowledge persistence change (Q106 recon decides migration vs epoch); text volume for Astra.

**Validate.** Catalog census (kinds, counts, knowledge states) both seeds; a scripted rumour walk-through on the reference seed (ask → estimated area → walk → discovered); map shows unnamed estimated areas correctly.

---

## 5. Dependencies, risks and performance

**Cross-system dependencies.** B → C (runoff) → A (water access, crossings) → roads close-out (Q62–Q64). D-T → C (terrain before hydrology) and → A (exclusions). C → Q92 (river visuals), Q97 (bridges), Q84-a (roadless site). B → snow patches (053), weather consumers. E ← catalog (Q106) ← C/D (what exists).

**Existing queue items this proposal touches (no status changed here):**

| Item | Relation |
| --- | --- |
| Q70 biome borders | subsumed by B (one biome-distribution change instead of two) |
| Q92 river visual polish | after C; scope smaller and more valuable once rivers are fewer |
| Q100 caves near home | same terrain scoring as D; can be answered independently |
| Q84-a roadless settlement | re-check after C and A |
| Q62–Q64 roads | topology logic (Q62) can proceed; **Q64 close-out census + fixture re-export after A** |
| Q37 settlement composition | layout work independent; river-adjacent visual cases re-checked after C |
| Q106 lakes in catalog | independent, do first (E) |

**Determinism & persistence.** All new inputs are pure functions of seed + position or bounded deterministic lists; IDs from candidate cell keys; caches: hydrology namespace (with climate grid), biome/vegetation-dependent namespaces, settlement-def, roads, caves, environment — each bumped only when its output changes; fixtures re-exported once at the end of the geography batch. All of it is worldgen-visible → epoch 1 if still open (G1). Discovery state stays keyed to stable catalog IDs.

**Performance.** Boot: hydrology pass remains the dominant global cost; climate grid and descriptors add little (🟡), fewer chains may reduce payload/tile work (unclaimed). Runtime: no new per-frame work in A–C; D structures carry the only real rendering risk (budgeted, LOD, instanced); vegetation redistribution must be checked in the densest region. Measurements per CLAUDE.md: WSL A/B (boot, `stream`, `settlement-heavy`) to land, Windows confirmation via §4; no FPS claims.

**Top risks.** (1) Calibrating rivers twice (avoid: B before C). (2) Road work closing out on pre-geography terrain (avoid: Q64 after A). (3) Visual regressions judged only from diagnostic previews (always export gameplay mode). (4) Scope creep into climate simulation (phase 1 weather = phase + temperature offset only).

---

## 6. Suggested staged sequence (no task slices)

Different from the suggested grouping: macroclimate precedes river calibration so rivers are calibrated once, and Q106 is pulled to the front because it is independent.

| Stage | Content | Gate to next |
| --- | --- | --- |
| **S0 Diagnostics** | Extend river census (density, heads, area histogram, parallel detector, payload), route-weighted settlement census, gameplay-mode continent export, climate/biome/landform preview layers, prominence inventory of existing peaks/lakes. No generator change. | Author reviews baseline numbers + images; targets in §7 confirmed or adjusted |
| **S1 Q106** | Lakes in the location catalog (parallel to S0). | Catalog census both seeds |
| **S2 Macroclimate fields** | `macroClimateAt` + coast grid, previews only, no consumers. | Author approves regional look on preview layers |
| **S3 Hydrology recalibration** | Area thresholds × climate runoff, perennial vs dry drainage, map hierarchy; artifact fix only if parallels persist. | River targets met; 058 continuity checks green; home stream OK |
| **S4 Biomes/vegetation (+ Q70)** | `(T,P)` biome table, forest types, treeline/snowline, riparian bands. Weather phase 1 (local T, rain/snow phase) as its own small slice. | Browser spots; vegetation census in densest region |
| **S5 Landforms T (+ derived waterfalls H)** | Descriptor set, profiles, outcome assertions, waterfall detection. | Variety across 7 seeds; hydrology re-census |
| **S6 Settlement recalibration** | Suitability from climate/water/landforms, spacing/count experiments, pick finalist. Then Q64 road close-out + fixture re-export. | Route census targets; progression/home-growth guarantees |
| **S7 Discovery integration** | Landmarks in catalog, names, rumour policy, geographic directions (Astra text). | Rumour walk-through |
| **S8 Structures + polish + perf** | Castle ruin / ruin complex kit on landforms; Q92 river visuals; WSL A/B (boot, stream, settlement-heavy), Windows via §4; epoch-batch close proposal. | Author visual sign-off; perf no regression |

Each stage lands behind its own cache bumps, is revertable as a commit set, and is verified before the next starts. S2–S6 all change worldgen and belong to the same epoch batch.

---

## 7. Measurement and acceptance criteria (proposed)

| Area | Metric (both seeds unless stated) | Proposed acceptance (🎯, confirm after S0) |
| --- | --- | --- |
| Rivers | perennial km per land km²; heads; trunk systems | ⅓–½ of current stream density; heads −60 % or more; ≥ 3 systems with hierarchy |
| Rivers | dry interfluves | ≥ 35 % of land > 300 m from perennial water |
| Rivers | parallel artifacts | 0 artifact-class pairs; valid pairs listed |
| Rivers | continuity | 058 checks unchanged (outlets, lake-fed, mouth ramps) |
| Climate | N–S tendency | mean T monotonic in 5 latitude bands; regional noise visibly breaks bands |
| Biomes | coherence | dominant-biome patch size larger than today; no inland sand desert (if G2 = b) |
| Settlements | route time | median 5–7 h, p90 ≤ 9 h, max ≤ 11 h; 0 roadless; 1 component |
| Settlements | wilderness | ≥ 20 % of land beyond ~5 h from any settlement |
| Landmarks | count/variety | 3–7 major features per seed over 7 seeds; no regular spacing (nearest-neighbour CV check) |
| Landmarks | outcomes | every crater/lake descriptor meets `intendedOutcome` |
| Discovery | catalog | lakes and major features present; knowledge states round-trip in save |
| Performance | boot + runtime | hydrology boot not slower; WSL A/B no regression; structure sites within plan budgets |
| Visual | author | gameplay-mode continent maps + 3D spots signed off (queue §2) |

---

## 8. Strategic decisions requiring author approval

- **G1 — Epoch and sequencing.** (a) Geography S2–S6 go into the still-open epoch 1; Q64 road close-out and fixture re-export move after S6 [**recommended**: no real post-Revival game exists yet, so one more batch costs nothing; later it would cost a new game]. (b) Close epoch 1 after Q37/Q38 and plan geography as epoch 2. (c) Only S0/S1 now, decide later.
- **G2 — Climate contrast.** (a) Gentle temperate gradient. (b) **Distinct regions**: cold boreal north with snowy uplands, temperate centre, warm drier south with grassland/scrub; sand only on coasts [**recommended**]. (c) Strong, including a true inland desert.
- **G3 — Climate reach in the first implementation.** (a) **Geography + biomes + runoff + local temperature/rain–snow phase** [**recommended**]. (b) Geography/biomes only, weather unchanged. (c) Also regional precipitation frequency and living-world effects now.
- **G4 — Small watercourses.** (a) **Perennial channels + dry drainage valleys (no water), no seasonal mechanic** [**recommended**]. (b) Additionally seasonal streams as a player-visible mechanic. (c) Threshold change only.
- **G5 — Settlement pattern (final choice after S0 numbers).** (a) **Geography-driven inhabited regions + moderately shorter spacing, 24–28 settlements** [**recommended**]. (b) Uniform moderate reduction, keep ~22. (c) Keep placement, fix only failed/roadless routes.
- **G6 — First landmark package.** (a) **Terrain trio: isolated rocky hill/crag, crater/caldera lake, lake with island + derived waterfalls; castle ruin as the second package** [**recommended**]. (b) Start with a castle ruin on existing terrain. (c) Include a dormant volcanic cone in the first package. Plus: guarantee per seed — **≥ 3 major features of any kind, no per-kind guarantee** [recommended] vs per-kind guarantees.
- **G7 — Discovery guidance strength.** (a) **Vague leads**: opinion-gated rumours, off-centre areas, ≤ 3–4 open leads, names learned on visit [**recommended**]. (b) Stronger: named places and clear directions from NPCs. (c) Minimal: discovery mostly by own exploration.

Technical choices (coordinates, lapse scaling, threshold units, cache namespaces, descriptor indexing, LOD approach) are not author decisions; Opus resolves them in the plans.

---

## 9. Recommended first planning package after approval

1. **`tools-0xx` geography diagnostics (S0)** — census extensions (rivers, routes), gameplay-mode continent export, preview layers. Sonnet-implementable; produces the baseline for every later acceptance row.
2. **Q106 slice (S1)** — already queued as O→S; proceed as planned.
3. **`world-terrain-0xx` macroclimate + hydrology recalibration (S2–S3)** — one plan with two slice groups, because runoff and thresholds must be calibrated together; includes the G1 epoch/cache checklist and fixture handling.

Plans for S4 (biomes + weather phase 1, absorbing Q70), S5 (landforms), S6 (settlement recalibration, follow-up to 059) and S7–S8 follow after S0 results, so their targets are grounded in measured baselines rather than this proposal's ranges.
