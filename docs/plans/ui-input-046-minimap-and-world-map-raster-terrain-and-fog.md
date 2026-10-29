# Plan: Minimap and world map — raster terrain and soft Fog of War (V3 presentation)

**Created:** 2026-10-29
**Status:** `verification needed` 🔍
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `ui-input`
**Subdomains:** `map` `presentation` `performance`
**Tags:** `v1-revival` `minimap` `world-map` `fog-of-war` `v3-donor`
**Roadmap:** -

## Context

Source recon and author direction: [minimap/world-map rendering recon](../research/v1-revival/2026-10-29--minimap-world-map-rendering-recon.md). The author authorized implementation on 2026-10-29 as a bounded D4 exception ([Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)).

V1 drew every discovered 8×8 map cell as its own flat-coloured polygon (minimap: every frame; world map: every interaction). There was no relief and no rivers, fog had hard cell edges, and the projection cache was unbounded. The target is V3's presentation in **both** views:

- hillshade × height tint × biome colour,
- canonical rivers,
- a soft fog mask,
- a round "glass lens" minimap.

V1 keeps world generation, `MapDiscovery` semantics/persistence, `LocationKnowledge`, navigation targets, markers, labels and hit tests.

## Decisions

- Minimap: two discrete scales, **1 px/unit** (≈200 units across at 200 px) and **0.5 px/unit** (≈400 units). The continuous 1–3× zoom is removed.
- World map keeps zoom 0.08–8 and chooses a raster LOD per zoom.
- No post-generation terrain modifications (settlement flattening, player edits) in the first version.
- No save or worldgen change. The raster is memory-only.

## Architecture

1. **Sampling contract.** `sampleRawTexelAt` (`src/terrain/chunkHeightmap.ts`) returns every raw field in one evaluation. `classifyMapTexel` (`src/world/map/mapProjection.ts`) is the single classification used by both `projectCellAt` and the raster.
2. **Raster tiles** (`src/world/map/mapRasterTile.ts`, pure, runs in a worker):
   - World-aligned 64×64-sample tiles plus a 1-sample apron, at LOD steps 1/2/4/8/16 units.
   - Each tile carries surface height, floor height, raster class and river polylines.
   - Generation is gated by a 256-unit **coverage mask** of discovered blocks. Undiscovered blocks are neither sampled nor scanned for rivers, so generation cost follows explored area, not tile area.
   - Rivers come from the canonical `computeRiverTile` chains. Each segment belongs to the map tile that holds its midpoint, so there are no duplicates or seams.
3. **Worker:** a `mapTile` background job kind on the existing chunk worker pool (`src/terrain/chunkWorkerPool.ts`), below world knowledge and above grass.
4. **Terrain layer** (`src/ui-vue/lib/mapTerrainLayer.ts`):
   - Bounded LRU tile cache with a byte budget; tiles used this frame are pinned.
   - Per-consumer wanted sets, priority scheduling, a cap on jobs in flight, and cancellation of unwanted jobs.
   - World epoch with stale-result rejection; coverage-change refresh.
   - Coarser-level fallback while finer tiles load.
   - Paints hillshade on the main thread from transferred typed arrays (≈4k px per tile). Rivers are cached `Path2D`s stroked in world space.
5. **Fog** (`src/world/map/mapFogGrid.ts` + `src/ui-vue/lib/mapFogLayer.ts`):
   - `MapDiscovery` gains `revision` and change listeners.
   - The fog grid is a 1024² bitmap (one byte per 8-unit cell over the map extent) with per-block counters.
   - The fog canvas is one pixel per cell with an **inward** feather: an explored cell next to an unexplored one is partly fogged, so bilinear filtering never exposes unknown terrain.
   - Updates are incremental (dirty rectangle); a full repaint happens only on clear/restore.
6. **Renderers:**
   - `drawMinimap.ts`: canvas transform (rotate by yaw) over cached images, circular `destination-in` mask, rim, V3 glass overlay, two-step zoom. Redraw is skipped when nothing changed (NPC dots are throttled).
   - `drawMap.ts`: LOD tiles, rivers and fog under north-up markers and labels; a rAF repaint when tiles arrive.
7. **Lifecycle (`createApp.ts`):**
   - Layers are created next to `createMapProjection`.
   - World rebuild calls `setParams` (epoch bump).
   - New game calls `mapDiscovery.clear()`, which triggers a fog reset through its listener.
   - Disposed next to `setActiveMapData(null)`.

## Verification

- Technical: `npx tsc --noEmit`, `pnpm run lint:fix`, focused `vitest` for `src/world/map`, the map UI libs and the worker pool, then `pnpm run build`.
- Browser/manual (author) checklist:
  - [ ] Minimap: geography matches the world map; heading-up rotation; both zoom steps; rivers; soft fog edges; cold travel into new terrain; collapse; click opens the map.
  - [ ] World map: open, pan and zoom across the full 0.08–8 range; no visible tile seams; fog never reveals unexplored terrain; markers, labels, heading and target behaviour unchanged.
  - [ ] Save/load, new game / new seed, terrain-param rebuild.
  - [ ] DPR 1/2, touch layout (130 px minimap).
- Performance: `[PERF:MAP]` debug logs (perf monitor enabled) report tile worker/queue time, cache bytes and tiles in flight. Record frame-time spikes during cold travel and world-map open/pan; no claims from incomparable builds.

## Out of scope / follow-ups

- Terrain modifications (flattening, roads, player edits) on the raster.
- Persisting rasters; animated or visibility-based fog.
