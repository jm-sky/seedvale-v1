import type { MapTerrainPaintParams } from './mapTerrainPaint'
import { MAP_EXTENT_HALF } from '../../world/map/mapConfig'
import {
  MAP_TILE_SAMPLES,
  MAP_TILE_SIDE,
  mapTileBounds,
  type MapTileData,
  mapTileWorldSize,
} from '../../world/map/mapRasterTile'
import { MAP_RIVER_STROKE } from './mapColors'
import { buildRiverStrokes } from './mapRiverStrokes'
import { paintMapTilePixels } from './mapTerrainPaint'

/** Output edge in pixels: 12 288 m → 1536 px = 8 m per pixel. */
export const CONTINENT_PREVIEW_PX = 1536

/**
 * Draws all `tiles` north-up into `canvas` (resized to `CONTINENT_PREVIEW_PX`²)
 * with the production tile painter, then strokes the canonical river polylines.
 * River stroke width is `max(physical width, minRiverPx)` — the pixel minimum is
 * visual exaggeration only and does not describe simulated channel width.
 *
 * @domain tools
 */
export function renderContinentCanvas(
  canvas: HTMLCanvasElement,
  tiles: readonly MapTileData[],
  params: MapTerrainPaintParams,
  minRiverPx: number,
): void {
  canvas.width = CONTINENT_PREVIEW_PX
  canvas.height = CONTINENT_PREVIEW_PX
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  const scale = CONTINENT_PREVIEW_PX / (MAP_EXTENT_HALF * 2)
  ctx.setTransform(scale, 0, 0, scale, MAP_EXTENT_HALF * scale, MAP_EXTENT_HALF * scale)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const tileCanvas = document.createElement('canvas')
  tileCanvas.width = MAP_TILE_SIDE
  tileCanvas.height = MAP_TILE_SIDE
  const tileCtx = tileCanvas.getContext('2d')
  if (!tileCtx) throw new Error('2D canvas unavailable')
  const image = tileCtx.createImageData(MAP_TILE_SIDE, MAP_TILE_SIDE)

  for (const tile of tiles) {
    paintMapTilePixels(tile, params, image.data)
    tileCtx.putImageData(image, 0, 0)
    const bounds = mapTileBounds(tile)
    const step = tile.step
    const size = mapTileWorldSize(step)
    ctx.drawImage(
      tileCanvas,
      0.5,
      0.5,
      MAP_TILE_SAMPLES + 1,
      MAP_TILE_SAMPLES + 1,
      bounds.minX - step * 0.5,
      bounds.minZ - step * 0.5,
      size + step,
      size + step,
    )
  }

  ctx.strokeStyle = MAP_RIVER_STROKE
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const minWidth = minRiverPx / scale
  for (const tile of tiles) {
    for (const river of buildRiverStrokes(tile)) {
      ctx.lineWidth = Math.max(river.width, minWidth)
      ctx.stroke(river.path)
    }
  }
}
