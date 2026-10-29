import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import type { MapDiscovery } from '../../world/map/mapDiscovery'
import type { MapRasterStep, MapRect } from '../../world/map/mapRasterTile'
import { createMapFogLayer, type MapFogLayer } from './mapFogLayer'
import { createMapTerrainLayer, type MapTerrainLayer } from './mapTerrainLayer'

/** Shared raster presentation for the minimap and the world map (plan
 *  ui-input-046) — one terrain tile cache and one fog mask, two views. */
export type MapRasterLayers = {
  terrain: MapTerrainLayer
  fog: MapFogLayer
  /** Combined change counter (tiles arrived or discovery changed). */
  revision(): number
  dispose(): void
}

/**
 * Builds the layers over the world's `MapDiscovery`. Owned by `createApp`:
 * `terrain.setParams` on world rebuild, `dispose` on teardown.
 *
 * @domain ui-input
 */
export function createMapRasterLayers(discovery: MapDiscovery, params: RawSampleParams): MapRasterLayers {
  const fog = createMapFogLayer(discovery)
  const terrain = createMapTerrainLayer({ params, fog: fog.grid })
  return {
    terrain,
    fog,
    revision: () => terrain.revision + fog.revision,
    dispose() {
      terrain.dispose()
      fog.dispose()
    },
  }
}

let activeLayers: MapRasterLayers | null = null

/** Imperative handle for canvas drawers, like `setActiveMapData`. */
export function setActiveMapRasterLayers(layers: MapRasterLayers | null): void {
  activeLayers = layers
}

export function getActiveMapRasterLayers(): MapRasterLayers | null {
  return activeLayers
}

/**
 * Draws raster terrain, rivers and fog covering `rect` (world units). `ctx`
 * must already carry the world → canvas transform.
 *
 * @domain ui-input
 */
export function drawMapRasterLayers(
  ctx: CanvasRenderingContext2D,
  layers: MapRasterLayers,
  consumer: string,
  rect: MapRect,
  step: MapRasterStep,
  pxPerUnit: number,
): void {
  layers.terrain.draw(ctx, consumer, rect, step, pxPerUnit)
  layers.fog.draw(ctx, rect)
}
