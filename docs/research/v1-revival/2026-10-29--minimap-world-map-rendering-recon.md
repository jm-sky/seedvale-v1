# Minimap and World Map Rendering Revival — Recon and Author Direction

**Created:** 2026-10-29  
**Status:** Source recon complete; author scope clarified; architecture and stages proposed  
**Implementation:** None. No formal plan created.  
**Evidence baseline:** V1 `fe5ff141d3a151032697b8d0e963469e8095ce6b`; V3 `47733d6ba0fe96d4607be22c470c7331c76c2c5c`. These are the inspected snapshots, not a claim about later HEAD.  
**Method:** GitHub connector source inspection; no runtime, screenshots or benchmarks executed.

## 1. Author decisions — 2026-10-29

- Improve **both minimap and full world map**. Terrain and Fog of War quality are the objective, not Vue chrome.
- Use a shared terrain raster/cache and fog presentation mechanism, with view-specific transforms and controls. Full-map delivery is part of this scope, not an optional follow-up.
- Minimap does not need continuous zoom: prefer one fixed scale; at most one additional zoom step is acceptable. The final fixed scale and whether the extra step exists remain to be selected.
- Full world map **requires zoom** and must remain attractive across its zoom range.
- **Runtime performance takes priority over shorter implementation.** Accept additional implementation work for bounded memory, smooth exploration and inexpensive redraws. This does not authorize sacrificing either map's intended visual quality.
- Initial map accuracy may omit terrain modifications. Start with base V1 geography and canonical rivers; do not make settlement flattening, player edits or other post-generation terrain modifications a prerequisite.
- Preserve V1 world generation, simulation, discovery and knowledge ownership. No whole-system V3 transplant.

These decisions supersede the initial report's assumption that the existing continuous minimap zoom should be preserved and that full-map work could be treated as optional later adoption. They do not approve exact tile sizes, sampling resolutions, worker design, implementation scheduling or a D4 freeze exception. See [Strategic Brief](./STRATEGIC-BRIEF.md).

## 2. Source-confirmed diagnosis

| Concern | V1 | V3 |
| --- | --- | --- |
| Sampling | One classified sample per 8-unit cell | Default 32-unit sample; optional 16 |
| Height | Used for classification, then discarded from map cells | Float32 height retained; central-difference hillshade |
| Colour | Flat categorical fills | Biome RGB multiplied by hillshade and height tint |
| Raster | Individual polygons/rectangles | Cached terrain canvas, smoothed 3x enlargement |
| Rivers | Raw projection omits canonical river channels | Simplified canonical river polylines over terrain |
| Fog | Draw discovered cells only; hard cell edges | Separate binary alpha mask, interpolated when drawn |
| Movement/rotation | Transform and redraw individual cells | Transform cached terrain and fog canvases |
| Cache | Unbounded Map of cell objects | Whole-window raster and canvases; terrain painted at initialization |

**V3 does not have denser default samples.** At 200 CSS px and zoom 1, V1 shows approximately 100 world units across, V3 800. V1's 8-unit cell occupies 16 px; V3's 32-unit cell occupies 8 px. V3's stronger appearance comes from presentation, relief and view scale, not simply higher data resolution. Copying its 32-unit sampling into V1's close view would lose detail.

V3 height queries combine interpolated terrain and supported modifications; biome lookup remains nearest-cell. Canvas smoothing does not create new geographic information or exact coastlines.

V1 additional findings:
- `queryCells()` computes projection before discovery filtering, including hidden cells.
- Several raw field accessors each invoke `sampleRawTexel()` for the same point; avoid duplicating this work in a denser sampler.
- World-map LOD skips cells then stretches a selected cell over the skipped area. This is not proper aggregation; one cell's discovery status can visually stand in for unknown or discovered neighbours.
- V1 already handles device pixel ratio; its blockiness is not simply missing DPR support.
- Base sampling is independent of loaded 3D meshes, but does not include the full later terrain-modifier pipeline.

V3 fog is still permanent binary discovery, not continuous visibility or animated fog. Its grid/radius are 32/96 versus V1's 8/48. `useWorldMap.updatePose()` repaints the entire fog mask after a reveal. Neither those gameplay parameters nor whole-mask rebuilding should be copied automatically.

Sources:
- V1 [projection](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/world/map/mapProjection.ts), [map data](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/world/map/mapData.ts), [discovery](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/world/map/mapDiscovery.ts), [configuration](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/world/map/mapConfig.ts).
- V1 [minimap](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/ui-vue/lib/drawMinimap.ts), [full map](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/ui-vue/lib/drawMap.ts), [terrain sampling](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/terrain/chunkHeightmap.ts).
- V3 [raster](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/world/map/mapRaster.ts), [raster painter](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/ui/map/paintMapRaster.ts), [fog painter](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/ui/map/paintFogMask.ts), [map lifecycle](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/ui/map/useWorldMap.ts), [configuration](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/config/map.ts).

## 3. Alternatives and memory

V1's current map extent is 8192 x 8192 world units; this is a map presentation boundary, not a hard boundary of its procedural world.

| Alternative | Advantages | Limitations |
| --- | --- | --- |
| Global raster | Simple shared image; no tile seams; cheap steady redraw | Whole-range generation; high memory at close-view detail; rebuild costs |
| Moving local window | Bounded memory; good minimap prototype | Travel rebuilds; insufficient alone for full-map pan/zoom; likely duplicate work |
| Shared tiles with LOD and bounded cache | Generate needed regions; reuse across both views; local invalidation; bounded memory | Scheduler, seams, cache lifecycle and LOD transitions require more implementation |

Arithmetic estimates: six bytes per sample (height, biome, shade) plus RGBA canvas:

| Sampling step | Raster | Data + 1x canvas | Data + V3-style 3x canvas |
| --- | --- | --- | --- |
| 8 | 1024² | 10 MiB | 42 MiB |
| 4 | 2048² | 40 MiB | 168 MiB |
| 2 | 4096² | 160 MiB | 672 MiB |

Excludes fog, temporary buffers, browser/GPU copies and cache metadata. Not measured memory. A global 8-unit raster remains a valid comparator; a global high-detail raster with unconditional 3x enlargement is not recommended.

## 4. Recommended architecture — proposal

**Shared bounded terrain tile cache with zoom-dependent LOD; separate fog derived from unchanged MapDiscovery.** A coarse overview level can be tiled or a small global image if measurements justify it. Neither a global overview nor a worker is mandatory by assumption.

- One world-to-map sampling contract, reusing V1 generator functions. Keep height, biome/terrain and water information separately from exploration.
- Reuse V3 hillshade, raster painting and canvas transforms; adapt palette and elevation gain to V1.
- Sample each point's base fields together where feasible; do not introduce a second terrain algorithm.
- Adapt [V1 RiverQuery](https://github.com/jm-sky/seedvale-v1/blob/fe5ff141/src/terrain/riverQuery.ts) / canonical river segments. Query per required region, not per raster pixel. Do not copy V3's 24-unit river simplification or fixed maximum-width styling without checking close-view fidelity.
- Use world-aligned tile coordinates and a sampling apron for seamless hillshade/filtering. Keep river clipping continuous across boundaries.
- Select raster resolution by screen scale: fixed minimap scale and full-map zoom. Steps 2/4/8 are candidates for visual/performance comparison, not approved constants.
- Build only requested visible regions plus a bounded margin. Avoid generating hidden world regions solely because a user pans over fog; include only required sampling/filter margins.
- Schedule generation in bounded batches with cancellation and deduplication. Prioritize the current visible view; reuse coarser cached imagery while detail arrives. No full-world synchronous sampling on map open.
- Keep cache memory, pending work and retained sample buffers bounded. Cache key/invalidation includes world identity, terrain parameters, resolution and visual style version.
- Terrain and fog invalidate independently. Consume discovery deltas; reset correctly on restore/clear even when discovered-cell counts match.
- Preserve 8-unit discovery cells, 48-unit radius, persistence and independent LocationKnowledge/NavigationTargets. A renderer never discovers cells or locations.
- Prefer fog feathering inward into explored terrain so filtering cannot disclose unknown terrain. The exact edge appearance needs visual acceptance. Do not aggregate fog by stretching one sampled cell.
- Minimap rotation and movement within cached coverage only transform images. Full-map pan/zoom chooses LOD and composes the same resources; markers/hit tests remain V1.
- Tie resources to existing `createApp.ts` map initialization, rebuild/load/new-game and dispose paths. Do not import V3 `useWorldMap`, simulation/save ownership or its terrain generator.
- No persistent raster assets in saves. Workers are conditional on measured generation latency; if needed, use the same deterministic sampling contract with bounded requests and stale-result rejection.

This is a performance-oriented architecture recommendation, not a measured superiority claim. Fixed minimap scale simplifies it, but does not eliminate the full map's need for LOD.

## 5. Preliminary delivery stages — both views required

Basic scheduling and memory bounds belong in the foundation, not in a late optional optimization pass.

| Stage | Scope / main files | Effort / dependencies | Verification / independent visual benefit |
| --- | --- | --- | --- |
| 0. Shared comparison fixture | Isolated views using V1 sampling; compare resolution, shading, fog and full-map zoom; minimal generation/redraw instrumentation. `mapProjection.ts`, terrain sampling seam, fixture | S; none | Same forest, coast, slope and river; fixed minimap plus near/far full map. No live-game benefit |
| 1. Shared raster foundation + terrain in both views | Tile sampling, hillshade, palette, canonical rivers, basic LOD/cache/budgeting; wire `drawMinimap.ts` and `drawMap.ts`. `src/world/map/`, `mapColors.ts`, `createApp.ts`, screen draw hooks | L; stage 0 | Cross-view geography agreement; rotation, pan/zoom, seams, cold-cache behavior. Strong terrain improvement in both views; may be split into reviewed sub-slices, but neither view is optional |
| 2. Shared fog presentation | Mask adapter, incremental updates and reset handling; `mapDiscovery.ts`, `gameLoop.ts`, fog painter, both draw helpers | M; stage 1 | Same discovery/save semantics; no unknown-terrain disclosure across LOD; reload/clear/negative coordinates. Strong fog improvement in both views |
| 3. Performance tuning and full acceptance | Tune LOD, memory limits, generation budget and prefetch; worker only if warranted; fixed minimap controls and full-map zoom polish | M–L; measured stages 1–2 | Cold/warm travel, prolonged exploration, full-map open/pan/zoom, simultaneous consumers, load/new seed, hidden maps, DPR/touch. Smoothness and consistency; completion requires both views |

Overall estimate: **L–XL**, with uncertainty concentrated in cold generation, canonical river sampling and seamless LOD. No calendar estimate without a prototype. Acceptance should record frame-time spikes, map generation/redraw time, cache memory and outstanding work, not FPS alone. Retain existing navigation/label/heading tests and add focused discovery-boundary, cache-lifecycle and cross-tile consistency coverage. No automatic broad benchmark suite after each sub-slice.

## 6. Existing plans and remaining decisions

- [089](../../plans/archive/2026-08-12--089--better-minimap-and-world-map.md) and its [notes](../../plans/archive/2026-08-12--089--better-minimap-and-world-map-implementation-notes.md) are archived as `verification needed`; the projection/discovery foundation already exists. Historical XL is not an estimate of this remaining work.
- [world-012](../../plans/archive/world-012-world-locations-discovery-and-map-navigation.md) is done and supersedes old statements that world knowledge is wholly deferred.
- Preserve later label fixes [ui-input-026](../../plans/archive/ui-input-026-world-and-map-label-visibility-and-collision-fixes.md) and player heading [ui-input-033](../../plans/archive/ui-input-033-world-map-player-heading-arrow.md).
- [world-022](../../plans/archive/world-022-world-location-discovery-hitch-and-progress.md) concerns location-discovery scans, not a ready-made terrain raster scheduler.
- [UI migration research](./2026-10-26--ui-migration-research.md) identifies map adaptation but does not supply this dedicated rendering implementation plan.
- No dedicated active V3 map-rendering port plan was found in the inspected baseline.

**Resolved by the author:** both maps in scope, shared mechanism, full-map zoom, fixed/minimal minimap zoom, performance over implementation brevity, initial omission of terrain modifications.

**Still open:** acceptance of the proposed architecture after the bounded comparison; fixed minimap range and optional extra zoom step; visual palette/shading/fog acceptance; numerical performance and memory budgets; subsequent implementation scheduling under D4. Exact technical constants can be selected from evidence within the accepted direction. No new gameplay discovery radius or save format is proposed.

This document records conclusions and preliminary stages only. It creates no formal `docs/plans/` plan and authorizes no runtime changes.
