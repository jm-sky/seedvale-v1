# Plan: Whole-continent raster and hydrology preview

**Created:** 2026-11-03
**Status:** `implemented` ✅ (browser run of the page itself pending — see implementation notes)
**Type:** infrastructure
**Priority:** medium · **Effort:** M
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `development` `diagnostics`
**Tags:** `worldgen` `hydrology` `map` `visualization`
**Model:** Sonnet, Composer

## Goal

Provide an author-facing, developer-only preview of the **entire generated V1 continent**, initially for seed `415424794`, as a downloadable PNG. Show terrain relief/biomes, coast, lakes and the **complete canonical river network**, including tributaries and confluences. Make it easy to inspect water distribution before considering hydrology tuning, without launching NPC/fauna/settlement simulation or exploring the world in-game.

This is a diagnostic view, **not** a change to the player world map or its discovery rules.

## Verified starting point

- `src/world/map/mapRasterTile.ts`: `buildMapTile` already samples canonical `sampleRawTexelAt` + `classifyMapTexel`, outputs height/floor/class grids and river polylines from `computeRiverTile`. Raster LOD: 1/2/4/8/16 m; 64 samples per tile; generation currently requires discovered `coverage` blocks.
- `src/ui-vue/lib/mapTerrainPaint.ts` and `mapTerrainLayer.ts`: shared terrain painting and river strokes; the existing layer explicitly skips tiles without discovery, via `MapFogGrid`.
- `src/world/map/mapConfig.ts`: map extent is ±6144 m; `mapTilesInRect(16, fullExtent)` is 12 × 12 = 144 coarse tiles (1024 m per tile).
- `src/terrain/worldHydrologyRuntime.ts`: `ensureWorldHydrology` installs canonical hydrology into the registry and workers before samplers and river tile queries run. The result is keyed by `hydrologyId`.
- `src/terrain/riverNetwork.ts`: river chains and widths use the global conditioned hydrology. At coarse raster steps `buildTileRivers` filters very narrow river segments (`step * 0.15`), so the diagnostic must explicitly address visibility of small tributaries.
- Related implemented plan: [ui-input-046](./ui-input-046-minimap-and-world-map-raster-terrain-and-fog.md) (`verification needed`). The broad [World Observatory](./tools-006--world-observatory.md) is a different, simulation-oriented draft; do not expand it.

## Scope and design

1. **Independent preview entry point** for development (dedicated tool/page or small dev harness, not a production map mode). Accept a seed, defaulting to `415424794`, and use normal default terrain settings. No full `WorldBundle`, actors, settlements, roads or player exploration.
2. **Canonical world preparation.** Construct `RawSampleParams` using established world-config/projection helpers; call the existing global hydrology installation path and wait for completion before any conditioned sampling. Respect the hydrology id / cache identity. Do not create a second river or lake generator.
3. **Whole-world, ungated raster generation.** Reuse `buildMapTile` and its classes/river outputs. Supply explicit complete `coverage` for every requested tile (or a clearly isolated diagnostic bypass in the shared tile builder); never mutate `MapDiscovery` or mark terrain discovered in gameplay. Keep any mode-specific behavior opt-in.
4. **Single overview PNG.** Compose north-up full-extent terrain at a coarse LOD (initially step 16, 144 tiles) and export a deterministic-dimension PNG, e.g. 1536 × 1536 pixels. Respect world aspect ratio and keep coastline, lake water and land/biome colouring. A download action is sufficient; no permanent storage.
5. **Water readability.** Render canonical river polylines over land and lakes; include junctions and downstream continuity. For this diagnostics-only overview allow a visual minimum stroke width so the network is legible at continent scale. Clearly distinguish **visual exaggeration** from simulation/physical river width. Prefer an optional `all streams / major waterways` visibility selector if the existing minimum-width filter hides informative tributaries; do not change world hydrology thresholds or the gameplay map's defaults.
6. **Bounded work and failure reporting.** Sequential/batched tile generation, progress indication, errors/retry, cancellation on seed change, no unbounded canvas/tile cache growth. Export only once all expected tiles and hydrology are ready; never silently export a partial map.

## Constraints and non-goals

- No hydrology calibration, worldgen algorithm changes, cache/worldgen epoch changes, save changes, or altered `MapDiscovery`/Fog of War rules.
- Do not change the production minimap/world-map visual policy to reveal undiscovered terrain.
- No Three.js fly camera, full 3D landscape, animals, settlements, road/bridge overlay, NPC simulation or World Observatory integration.
- No new hand-painted geography or invented waterways; the preview must be derived from the same `seed + terrain params + hydrologyId` as the game.
- No high-resolution export or multi-seed batch tool in this first slice; add only if the coarse overview proves insufficient.
- Add JSDoc with `@domain tools` to important new public functions/classes as useful for AI preflight.

## Verification

- Automated: exact tile count and complete world bounds for step 16; coverage includes both negative and positive coordinates; all 144 tiles are sampled despite zero `MapDiscovery`; coastline and inland lakes use canonical classes; river runs survive tile stitching; changing seed/id invalidates prior results; failures/cancellation cannot emit partial PNG.
- Compare preview raster/river segments for selected known coordinates against `buildMapTile` outputs and installed global chains; no separate hydrology authority.
- Manual browser inspection for seeds `415424794` and `42`: whole island/sea visible, lakes distinct, rivers/confluences readable, no seams or missing blocks, PNG downloadable and legible at overview size.
- Run targeted `vitest`, type-check and build. Record generation time and peak memory in a browser run rather than asserting a performance gain from static inspection.

## Implementation handoff

See [implementation notes](./implementation-notes/tools-023-whole-continent-raster-hydrology-preview-implementation-notes.md) for source ownership and integration hazards. Keep the tool independent and reversible; produce the overview before pursuing hydrology tuning.
