# SeedVale V1 — Geography & Exploration Revival: Architecture Recon

**Date:** 2026-11-04  
**Audience:** Claude Opus 5.5 and the author  
**Status:** Research handoff; recommendations are not decisions or an implementation plan.  
**Scope:** Geography, macroclimate, river density, settlement travel, major landmarks and discovery. No runtime changes.

## Executive summary

1. **Keep the global hydrology architecture.** The strongest density explanation is its calibration: a stream begins at 15 contributing 8 m cells (approximately 960 m²), with uniform runoff everywhere. Global connectivity now exposes many drainage channels that the old tile-local system dropped. Q96's lake reduction also increased chain counts. This is not evidence that priority-flood itself should be replaced.
2. **Separate physical density from cartographic emphasis.** The attached overview is visibly saturated with waterways, but diagnostic rendering can deliberately show every stream and exaggerate subpixel widths. Current 3D width already varies with accumulation. Compare the same coordinates in diagnostic, gameplay-map and 3D views before deciding how many perennial channels to remove.
3. **A shared spatial macroclimate is justified.** V1 has moisture noise, altitude/ridge gates and deterministic seasonal weather, but no geographical temperature axis in the inspected biome/weather owners. Extend these owners around shared temperature and moisture inputs; do not add an independent biome generator.
4. **Calibrate settlement access using actual roads.** Selection aims at 22 sites, starting with 1,150 m separation, not the 720 m minimum. Published post-Q61 road samples have median sinuosity 1.22/1.18 and p90 1.40/1.38. A connected selection graph does not guarantee successful roads. Resolve this distinction before increasing settlement count.
5. **Major landforms need early authority; discovery already has an owner.** Terrain-shaping landmarks must influence the unconditioned floor before hydrology. Structures and small environmental landmarks should use existing placement/catalog/knowledge paths. Above-sea lakes currently expose a concrete integration gap: the map recognizes them, but the location catalog's coarse classifier still checks only sea-level water.

**Strongest recommendation:** retain one acyclic geographical authority: base terrain and rare landform descriptors → optional static climate/runoff inputs → global hydrology → conditioned terrain and resolved sites/routes → existing streamed presentation and location knowledge. This is a dependency principle, not a proposed new all-purpose manager.

## Evidence and limits

V1 source was inspected at [935e6af9](https://github.com/jm-sky/seedvale-v1/commit/935e6af9f5803d1ffeb8e29590d6afc385ed7b3c). A final comparison against [0619bf51](https://github.com/jm-sky/seedvale-v1/commit/0619bf517fb4411ad412843830504e18f4edf90f) found inspection tooling/fly-camera and documentation changes, not changes to the generation owners discussed here. V2 donor reads use main at `9ba54815493b886eb1bdce032f5209aeb2856c37`; V3 at `47733d6ba0fe96d4607be22c470c7331c76c2c5c`.

Evidence labels below distinguish **code**, **published measurements**, **visual observation**, and **hypothesis**. No fresh census, benchmark, runtime traversal or browser validation was performed. Existing measurements are attributed and retain their sample limitations.

The author-supplied `1000066156.png` shows a full-continent overview with dense, often similarly prominent blue branches, nearby parallel stretches and repeated pale/green regions. It establishes a readability problem, not catchment validity or physical channel width. Its exact seed, settings, export mode and generating commit are not embedded in the supplied evidence. The diagnostic tool's output format is consistent with this image, but that provenance is not assumed.

Read alongside the [Strategic Brief](./STRATEGIC-BRIEF.md), [058](../../plans/world-terrain-058-finite-continent-and-global-hydrology.md), [059](../../plans/world-terrain-059-world-scale-travel-time-and-sparse-settlements.md), [Q67](./2026-11-02--q67-hydrology-continuity-recon.md), [058 implementation notes](../../plans/implementation-notes/world-terrain-058-finite-continent-and-global-hydrology-implementation-notes.md), [Review 030](../../reviews/2026-11-03--030--geography-hydrology-architecture-review.md), and the [session queue](./AUTONOMOUS-SESSION-QUEUE.md). Older plan introductions describe historical states; they are not current runtime evidence.

## Current V1 architecture

- [chunkHeightmap.ts](../../../src/terrain/chunkHeightmap.ts) combines masked continentalness, independently gated Worley mountain ridges, massif/peak hierarchy, hills and local detail. Separate moisture-region and local biome noise supply environmental signals. `sampleRawFloorUncorrected` deliberately bypasses hydrology.
- [worldHydrology.ts](../../../src/terrain/worldHydrology.ts) samples the finite ±6,144 m world at 8 m spacing (1,537² cells), conditions depressions, computes D8 drainage/accumulation and builds global confluence-aware chains. Sparse correction/basin data and packed chains are installed under `hydrologyId`.
- Conditioned raw sampling adds corrections and lake levels. Chunk generation then applies settlement regional smoothing, road/clearing corridors and canonical river carving. Map terrain classification samples conditioned raw terrain, not every final local corridor.
- [settlementLayout.ts](../../../src/settlement/settlementLayout.ts) owns selected lattice identities and their neighbour graph. [settlementPlanCache.ts](../../../src/settlement/settlementPlanCache.ts) resolves final sites/progression with river queries. [roadNetwork.ts](../../../src/settlement/roadNetwork.ts) routes between resolved entrances using terrain, crossing policy and village obstacles.
- [biomeRegions.ts](../../../src/terrain/biomeRegions.ts), [biomeColors.ts](../../../src/terrain/biomeColors.ts) and [chunkVegetation.ts](../../../src/terrain/chunkVegetation.ts) share moisture/altitude/ridge signals. [weather.ts](../../../src/world/weather.ts) separately derives season/weather from seed and elapsed days.
- Streamed environment descriptors, caves and authored adventure bindings feed existing location and knowledge systems. Worldgen caches are disposable; player/NPC/site state and discovery references must remain stable independently of streamed meshes.

## A. Settlement distances and distribution

### Existing behavior and evidence

**Code, high confidence.** The 300 m lattice remains settlement identity; it is not current settlement spacing. Selection starts at `SETTLEMENT_SPACING_M = 1150`, targets 22 sites and relaxes in 100 m steps toward a declared 720 m floor. Home is first; other candidates are ranked by terrain suitability plus seeded jitter and confirmed by site probes. Relative-neighbourhood/Gabriel logic constrains the graph, with 1,800 m band pruning and a 2,400 m edge policy.

One small calibration trap: the current decrement sequence is 1150, 1050, 950, 850, 750; the next value is 650 and fails the loop condition. Thus 720 is a declared lower bound, not an explicitly tested final selection radius.

Selection is river-query-independent, but it receives terrain samplers through its context. Do not read the “no hydrology” module comment as proof that production uses the unconditioned floor. Final site probes also add river/head/progression constraints; selected sites and successfully materialized definitions are different census populations.

**Published measurements.** 059 W4 originally reported 22 settlements on both seeds, median straight graph edges 1,490/1,474 m and 100% sampled land coverage within 1,800 m. Later Q37 notes report 22/20 materialized settlements. The [Q44 Q61 log](./2026-11-02--q44-roads-paths-rebuild-plan.md#q61-r5--route-shape-string-pulling--corner-rounding-sonnet-2026-11-03-main), using `--rings=12`, reports 18/19 roads, median sinuosity 1.22/1.18, p90 1.40/1.38, and 1/2 settlements without roads. These are dated, differently scoped samples, not a fresh whole-world count.

**Cause, medium-to-high confidence.** Nominal spacing understates journeys. Terrain/rivers/entrances constrain routing; roads already use string-pulling and corner rounding, so “add smoothing” is outdated advice. Illustratively, a 1,500 m separation with a 1.2 route ratio becomes 1,800 m: 10 default game hours at 180 m/hour rather than 8.3. This is arithmetic, not an observed journey; slopes, access legs and interruptions can extend it further.

### Options and recommendation

1. Keep count and world extent, moderately reduce selection spacing and rebalance suitability/coverage. Tradeoff: unchanged count can cluster sites and enlarge wilderness gaps elsewhere.
2. Keep settlement selection initially and improve exceptional route/access failures. This preserves identities but cannot eliminate legitimate detours around bays or mountains.
3. Use regional density: closer inhabited corridors with deliberately remote wilderness, rather than uniform compression. This needs an explicit coverage preference and risks weakening progression guarantees.

**Recommended:** first distinguish selected sites, final definitions, graph edges and usable routes in the existing census; then compare moderate spacing/distribution changes using route-weighted travel. Measure total entrance-to-entrance polyline length, centre/access legs, route ratio, failed edges and connected components. Pair each length with its own straight distance; do not multiply unrelated percentile tables. No new numeric target is selected here. More settlements is a separate lever, not the default answer.

## B. Macroclimate and biome coherence

### Existing behavior

**Code, high confidence.** `biomeWeightsAt` maps moisture-region noise and normalized altitude into desert/swamp/forest weights. Desert fades on highlands; swamp is gated to low altitude; forest density also uses continentalness and ridge suitability. Vegetation has a fixed normalized treeline. Colors use humid/arid height ramps, beach variation and mountain rock/snow treatment.

The moisture field in `sampleRawTexelUncorrected` is independent seeded FBM. It has no north/south temperature input, true coast-distance input, prevailing wind or precipitation balance. Continentalness is a terrain field, not a measured distance to the nearest coast.

`computeClimate(seed, elapsedDays)` has no position argument. Seasonal temperatures and weather odds are global; deterministic lookback handles surface wetness/snow. Consequently, current weather cannot by itself explain a colder northern biome distribution.

The map now uses `sandBandAt` and shared biome weights. Q67's fixed-beach-width observation is historical. Nevertheless it chooses discrete dominant classes, so a sharp painted boundary does not prove a sharp 3D ecological transition.

### Options and recommendation

1. Add temperature to existing biome classification, using latitude and elevation with bounded regional variation. Cheapest coherent improvement, but weather/runoff remain geographically independent.
2. Establish a small shared static macroclimate sample—temperature baseline, moisture/runoff potential, optionally maritime influence—consumed by existing biome, vegetation and climate owners. More integration work, but avoids contradictory regional interpretations.
3. Add prevailing wind and terrain rain shadow. Useful only if mountain relief and desired wet/dry contrasts justify the added preprocessing and tuning.

**Recommended: option 2, with option 3 conditional.** North is negative Z in the current north-up projection; V2/V3 use low Z as north but a different world origin. Normalize coordinates deliberately. Let latitude establish the broad tendency, elevation cool peaks, and bounded regional variation/coastal influence break stripes. Use temperature × moisture to distinguish hot aridity from cold open land; moisture alone should not imply warm desert.

Separate static climate from current weather. Static mean precipitation may weight hydrological accumulation; today's rain must not regenerate rivers, settlements or identities. Preserve deterministic time-skip and offscreen behavior if regional weather later affects gardens, fauna or NPC exposure. Local gameplay climate should be queried at an entity/site, never inferred from the player's current biome.

**Donor evidence.** [V2 biomes](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/gen/biomes.ts) and [V3 biomes](https://github.com/jm-sky/seedvale-v3/blob/47733d6ba0fe96d4607be22c470c7331c76c2c5c/src/game/world/gen/biomes.ts) implement `temp = normalizedZ - height * 0.0025`, with temperature-sensitive forest types. Reuse the dependency, not coefficients: their snow/mountain thresholds use much larger elevations. V2 additionally suppresses desert near settlements; that feedback is not recommended for V1's geographical authority.

## C. River density and naturalness

### Verified mechanisms and likely causes

**High confidence: low, uniform channel-initiation threshold.** Each non-sea contributing cell starts with accumulation 1. Stream/river/major reference thresholds are 15/50/200 cells: approximately 960/3,200/12,800 m² at 8 m. These are drainage-area proxies, not discharge or measured rainfall. Dry-looking regions receive the same per-cell contribution as humid ones.

`minChainCells = 8` removes short non-lake-fed chains; lake-fed chains are exempt. This suppresses short fragments, not dense longer tributary networks. Extraction threshold and width classification are separate controls and must be calibrated together.

**High confidence: Q96 changed drainage presentation indirectly.** The 058 notes report lake threshold 80→600, lakes approximately 260→16/20, and later 2,277/2,301 chains. On the reference seed chains grew from 1,838 to 2,301. Filling/breaching former ponds lets channels continue; fewer lakes does not imply less visible river network. Do not reverse the author's lake choice to mask river density.

**High confidence: map exaggeration.** [mapRasterTile.ts](../../../src/world/map/mapRasterTile.ts) normally filters segments narrower than `step * 0.15`; `riverDetail: 'all'` bypasses it. At step 16, standard filtering is 2.4 m. [mapRiverStrokes.ts](../../../src/ui-vue/lib/mapRiverStrokes.ts) averages widths per run and quantizes them; the gameplay painter also enforces a screen-space minimum. [tools-023](../../plans/tools-023-whole-continent-raster-hydrology-preview.md) explicitly requests all tributaries and diagnostic width exaggeration. Thin streams can therefore read almost like larger rivers at overview scale.

Physical width is already continuous: [riverNetwork.ts](../../../src/terrain/riverNetwork.ts) uses eased logarithmic accumulation, approximately 0.4–11 m. Uniform-looking blue lines are not evidence of a uniform-width 3D model.

**Medium confidence: geometric routing on conditioned flats.** D8 selects among eight directions; equal slopes resolve by fixed direction order. Flood epsilon and filled depressions create drainage over flats; terrain detail creates many local catchments. These mechanisms can produce aligned paths. Smoothing and meander already run globally, followed by confluence projection. Nearby parallel streams can be valid separate catchments, or displaced channels after smoothing; proximity alone cannot distinguish them. Review 030 also records a previous ground-versus-chain-height discrepancy at about 14% of sampled points, relevant to 3D artifacts but not a fresh measurement here.

### Options and recommendation

1. Raise perennial-channel initiation and/or require stronger headwater support, while preserving downstream connectivity. This directly reduces physical density; quantify headwater loss and crossings.
2. Use climate-weighted runoff and a distinction between drainage paths and perennial water. This creates geographic variation, but requires shared semantics for rendering, drinking, fishing, movement and map queries.
3. Adjust map scale filtering and visual hierarchy only. Useful immediately for diagnosis/readability, but does not solve streams that obstruct 3D travel.

**Recommended:** separate options 1 and 3 diagnostically, then coordinate option 2 with macroclimate if warranted. Keep priority-flood, global chains, lake outlets, receiver ramps and canonical carving. For a few representative catchments, inspect raw drainage versus smoothed paths and actual bank geometry before adding more meander or merging nearby lines.

Seasonal/intermittent channels are plausible, not a cheap visibility toggle. A hidden ribbon with active swimming/drinking/crossing semantics would be inconsistent. A first decision can simply distinguish perennial water from non-rendered drainage; dynamic seasonal water remains optional.

V3 already donated the strongest relevant mechanisms. Its [hydrology](https://github.com/jm-sky/seedvale-v3/blob/47733d6ba0fe96d4607be22c470c7331c76c2c5c/src/game/world/gen/hydrology.ts) explicitly scales accumulation thresholds with cell area. Its [river chains](https://github.com/jm-sky/seedvale-v3/blob/47733d6ba0fe96d4607be22c470c7331c76c2c5c/src/game/world/rivers/riverChains.ts) distinguish spring/lake/border sources and headwater taper. These are selective comparison points, not evidence of a superior replacement network.

## D. Major geographical landmarks

### Existing support and boundaries

V1 is not empty of landmarks. [chunkEnvironment.ts](../../../src/terrain/chunkEnvironment.ts) generates monoliths, stone circles, small ruins, towers, old trees, wrecks and roadside wagons with independent seeded rolls and placement gates. IDs derive from seed/chunk/kind/ordinal. Many footprints intentionally fit inside one chunk. Caves have their own stable topology/content anchors, and [darkForestTreasureSite.ts](../../../src/world/locations/darkForestTreasureSite.ts) demonstrates an authored procedural site with stable ruin, chest, map and wolf-den identities.

These are useful foundations, but adding larger meshes to chunk-local rolls does not create coherent regional landforms.

Distinguish three cases:

1. **Terrain shaping:** volcanic mountains, craters, isolated massifs and major scarps must affect the base floor before drainage. Their descriptors need deterministic, bounded world-space influence and consistent sampling across chunks. A crater can become a lake or be breached under current pit policy; this interaction needs a deliberate outcome.
2. **Structures/adventure locations:** castles, substantial ruins and cave-linked sites should fit authoritative terrain, with footprint reservation before any conflicting settlement/road choice where necessary. Do not invent a second quest-site registry.
3. **Non-shaping environmental landmarks:** old trees, rock formations and suitably small ruins can extend existing placement. A waterfall is conditional: decoration can use an existing genuine river drop, but creating that drop is a terrain/hydrology change.

**Cause, medium confidence:** limited regional silhouette/rarity control, rather than absence of POI code. Visibility also matters: existing fog/draw-distance constraints mean a geographically distinctive summit need not be a useful orientation cue from the road.

### Options and recommendation

Promote selected existing peaks/lakes with names and discovery; add a sparse bounded descriptor set for genuinely distinctive landforms; or introduce a few larger authored sites on suitable existing terrain. These are complementary choices with different epoch and content costs.

**Recommended:** establish sparse regional landform authority only for features that truly reshape terrain; reuse existing placement and adventure bindings for the rest. Do not approve the example catalog as a feature list. Prefer grounded geology and recognizable silhouettes; do not require greater global view distance.

[V3 heightfield](https://github.com/jm-sky/seedvale-v3/blob/47733d6ba0fe96d4607be22c470c7331c76c2c5c/src/game/world/gen/heightfield.ts) offers a concrete pattern: seeded mountain-centre and barrier/pass descriptors drive both pointwise fields and locators. Adapt that agreement, not its whole generator. [V2 landmarks](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/gen/landmarks.ts) offer finite placement budgets, same-kind separation and road/town proximity constraints. Its fixed counts, early-home bias and ordinal IDs are not automatically appropriate for V1.

## E. Exploration and discovery

**Code, high confidence.** V1 separates terrain Fog of War from [LocationKnowledge](../../../src/world/locations/locationKnowledge.ts), whose confidence advances estimated → discovered → confirmed. The catalog supports settlements, caves, cemeteries, lakes, peaks, ruins, mines and search areas. Existing range selection, maps, proximity discovery, guard knowledge and deferred worker research already provide delivery paths. Discovery weights and stable tie-breaks help choose useful results.

A verified gap deserves priority: `worldLocationCatalog.classifyCoarseCell` still identifies water through `isFloorBelowSea(floorH, waterLevel)`, without above-sea lake-level detection. This confirms Review 030 F2/Q106 at the inspected revision. The terrain map's wet-surface classifier already recognizes those lakes. Avoid creating another lake database to fix this disagreement.

**Recommended:** make a few geographically meaningful places first-class through existing catalog/knowledge contracts, then use maps, NPC information and authored quests to lead toward them. Preserve sparse wilderness and partial knowledge. Visible terrain can orient the player without automatically revealing exact map coordinates or attaching a reward.

V2's transferable lesson is selective placement near plausible routes and distinct place types, not mandatory attractions at regular intervals. Its landmark rules include marsh chapel and mountain watchtower candidates near roads/towns. This reconnaissance did not audit V2 quest execution or prove a complete donor discovery pipeline.

## Cross-system dependencies and risks

**Ordering.** Base terrain and early landform descriptors must precede global hydrology. Static climate can follow base relief and precede hydrology if it supplies runoff; otherwise biome-only climate can consume conditioned terrain downstream. Keep these roles explicit: moisture derived from completed rivers must not feed back into the same drainage solve. Rain-shadow/coastal-distance preprocessing, if chosen, must use a clearly defined pre-hydrology surface.

After hydrology, settlement selection/refinement and adventure footprints must agree on conditioned land and river exclusions. Major reserved sites cannot appear only after roads are finalized. Ordinary roadside objects can remain downstream. Waterfalls derived from river drops belong after chain resolution; waterfalls requiring new cliffs belong before it.

**Identity and epoch.** `WORLDGEN_EPOCH = 1` identifies the open Revival batch in inspected code. Include approved changes that move/remove/add save-referenced geography, settlement identities, quest hosts or resources in that coordinated batch, provided the author has not closed it. This is not blanket approval. Pure map styling or unchanged-placement visual work need not force a new epoch. Update affected namespace versions/fingerprints and fixtures; cache invalidation alone does not protect saved discoveries, depleted resources or NPC bindings.

**Performance.** Preserve one shared sampler and installed hydrology payload. Published post-Q96 payloads are 6.63/6.79 MiB per copy, with worker copies required for map/knowledge queries. Prefer bounded analytic climate or a justified coarse shared field; avoid long upwind/coast scans per terrain texel. Rare features need spatially bounded evaluation, not a full descriptor scan at every sample. No FPS or startup improvement is claimed.

Review 030's retention/version-guard findings are partly historical: inspected source/notes already include single-world retention and a golden-hash guard. Do not re-open them as unfixed defects. Check current code before following older queue text.

## Recommended next steps for Opus

1. **River diagnosis first:** reuse existing tools on reference seed plus seed 42. Compare all-stream/standard overview and a small number of matching 3D catchments. Report perennial length per land area, headwater count, drainage-area distribution, major/minor share and valid versus suspicious parallel stretches. This is a focused measurement request, not a broad benchmark.
2. **Set macroclimate scope:** choose shared static fields and whether runoff participates now. Resolve coordinate normalization, elevation scaling, consumer ownership and acyclic ordering autonomously; ask the author only about desired climatic contrast and gameplay reach.
3. **Measure travel on resolved roads:** reconcile current counts and failed routes, then compare moderate spacing/distribution options. Include slope-sensitive traversal on a few representative journeys; distinguish geometric estimates from timed play.
4. **Choose landmark architecture by category:** check whether existing prominent terrain is enough before introducing shaping descriptors. Preserve authored site guarantees and reserve conflicting footprints at the right stage.
5. **Close discovery consistency gaps:** use Q106 for lake catalog/persistence implications, then identify which selected landmarks need catalog/knowledge exposure. Only after author review should Opus prepare formal plans.

## Strategic questions for the author

- How strong should north/south contrast feel: broadly temperate variation, or clearly distinct cold-north and warm/dry-south regions?
- Should the first climate work affect regional weather and living-world behavior, or initially establish coherent geography/vegetation while preserving existing weather behavior?
- Is the preferred settlement pattern generally closer neighbours, or closer inhabited corridors separated by substantial wilderness?
- Should major landmarks be guaranteed in a few categories per seed, or may some worlds omit a type? Which small initial category set matters most?
- Should small drainage channels become mostly dry/non-perennial, or should seasonal streams be a player-visible mechanic?

The already-stated directions—north colder, meaningful wilderness, fewer excessive waterways, occasional memorable places—do not need reconfirmation. All numeric calibration and feature choices in this report remain recommendations pending discussion.
