# Implementation notes — tools-023 whole-continent raster hydrology preview

## Verified ownership and seams (2026-11-03)

- `src/world/map/mapConfig.ts`: `MAP_EXTENT_HALF = 6144`. Full rect `{ minX: -6144, maxX: 6144, minZ: -6144, maxZ: 6144 }`.
- `src/world/map/mapRasterTile.ts`: `MAP_TILE_SAMPLES = 64`, `MAP_RASTER_STEPS = [1,2,4,8,16]`, `MAP_COVERAGE_BLOCK = RIVER_TILE_SIZE = 256`, `mapTilesInRect`, `mapTileBounds`, `buildMapTile`. `MapTileRequest.coverage` is a list of `[bx,bz]` blocks. `isCovered` gates texel samples and `buildTileRivers` gates chains by the same blocks. 16 m step => tile footprint 1024 m, 12×12 tiles over the whole world. At each 1024 m tile, expect 4×4 aligned 256 m coverage blocks. Do not confuse block coordinates with world units.
- `src/ui-vue/lib/mapTerrainPaint.ts`: `paintMapTilePixels` is canonical land-water relief/biome colour painting; reuse rather than making a different palette.
- `src/ui-vue/lib/mapTerrainLayer.ts`: `buildRiverStrokes` (currently private), tile canvas/apron draw logic and `MAP_RIVER_STROKE`. `draw` skips `!fog.anyDiscoveredIn(bounds)` and uses `fog.coveredBlocksIn(bounds)`; using the normal game layer directly will **not** reveal undiscovered terrain. Prefer extracting small shared painter helpers when justified, not manipulating gameplay discovery or duplicating all of the layer.
- `src/ui-vue/lib/mapRasterLayers.ts`: normal game binds terrain and fog to `MapDiscovery`; do not mount these gameplay layers in the preview.
- `src/world/map/mapProjection.ts`: `rawSampleParamsFromWorld(config)` gives the correct `hydrologyId`; `classifyMapTexel` is already used by raster.
- `src/terrain/worldHydrologyRuntime.ts`: `ensureWorldHydrology(params)` initializes global hydrology, cache and worker registry; must finish **before** map tile jobs. Avoid direct production calls with `UNCONDITIONED_HYDROLOGY_ID` (would suppress the river network).
- `src/terrain/chunkWorkerPool.ts`: `requestChunkMapTile` and `cancelChunkMapTile` are existing map work queue seams, but an isolated page must ensure the worker pool lifecycle functions independently of `createApp`. Verify that before choosing the entry-point wiring; `buildMapTile` is pure once hydrology is installed in its execution realm.
- `src/terrain/riverNetwork.ts`: `computeRiverTile` clips canonical global chains; `RIVER_CELL_STEP = 8`, min/major widths provided by `widthFromAccumulation`. `buildTileRivers` in the raster currently drops width below `step * 0.15` and decimates sub-step detail. For a 16 m raster that hides some narrow streams even if the stroke is enlarged later. Make diagnostic visibility an explicit opt-in argument or overlay using global chains; do not weaken production map defaults.

## Suggested narrow implementation order

1. Add isolated development entry point and seed input using the project's existing tool routing conventions (inspect `src/tools/` and the application bootstrap). Ensure it can initialize only the needed hydrology/worker services.
2. Prepare one seed's hydrology through `ensureWorldHydrology`, then enumerate all coarse raster tile coordinates and supply all their intersecting 256 m coverage blocks without touching `MapDiscovery`.
3. Reuse existing pixel painter and river line drawing to compose one north-up Canvas, retaining the tile apron handling and world coordinate transform; only export after all tile jobs succeed.
4. Add PNG export, cancellation/error handling and optional water emphasis; validate output against the production map on two seeds.

## Risks to check during implementation

- The existing `mapTerrainLayer` LRU and in-flight cap are for moving/discovered viewports, not batch export. A dedicated bounded batch may be simpler than adapting its private `pump` scheduler.
- An isolated tool that calls `buildMapTile` on the main thread will need conditioned hydrology in the main registry; worker jobs need the corresponding install. Never assume default terrain samples work before installation.
- Full-extent preview can render subtle streams too thin to see, especially with coarse LOD filtering. Distinguish map-only stroke/visibility settings from a hydrology density change.
- Avoid `MapFogGrid` initialization tricks that would mutate/persist game discovery.
- No browser, performance, or PNG quality checks were run during planning; all observations above are from source inspection.
