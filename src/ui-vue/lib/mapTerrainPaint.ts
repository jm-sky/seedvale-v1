import { MAP_TILE_SIDE, MapRasterClass, type MapTileData } from '../../world/map/mapRasterTile'
import { MAP_RASTER_CLASS_RGB } from './mapColors'

/** Light from the north-west, as in V3 (`mapRaster.ts`), normalised. */
const LIGHT = (() => {
  const x = -1
  const y = 1.5
  const z = -1
  const len = Math.hypot(x, y, z)
  return { x: x / len, y: y / len, z: z / len }
})()
/** Hillshade contrast. 128 = flat ground. */
const SHADE_GAIN = 255
/** V1 terrain is low (heightScale ~18) next to V3's metre heights; exaggerate
 *  relief so slopes still read at map scale. */
const RELIEF_EXAGGERATION = 4

export type MapTerrainPaintParams = {
  waterLevel: number
  heightScale: number
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

/**
 * Colours one raster tile into `out` (RGBA, `MAP_TILE_SIDE²`): biome/terrain
 * base × central-difference hillshade × altitude tint, water darkened by
 * depth. Unsampled pixels stay transparent (fog covers them).
 *
 * @domain ui-input
 */
export function paintMapTilePixels(
  tile: Pick<MapTileData, 'step' | 'heights' | 'floors' | 'classes'>,
  params: MapTerrainPaintParams,
  out: Uint8ClampedArray,
): void {
  const side = MAP_TILE_SIDE
  const { heights, floors, classes, step } = tile
  const heightScale = Math.max(params.heightScale, 0.001)
  const relief = RELIEF_EXAGGERATION / (2 * step)

  // Neighbour height, falling back to the centre when outside or unsampled.
  const hAt = (i: number, j: number, fallback: number) => {
    if (i < 0 || j < 0 || i >= side || j >= side) return fallback
    const k = j * side + i
    return classes[k] === MapRasterClass.None ? fallback : heights[k]!
  }

  for (let j = 0; j < side; j++) {
    for (let i = 0; i < side; i++) {
      const k = j * side + i
      const o = k * 4
      const cls = classes[k]!
      if (cls === MapRasterClass.None) {
        out[o + 3] = 0
        continue
      }
      const h = heights[k]!
      const gx = (hAt(i + 1, j, h) - hAt(i - 1, j, h)) * relief
      const gz = (hAt(i, j + 1, h) - hAt(i, j - 1, h)) * relief
      const dot = (-gx * LIGHT.x + LIGHT.y - gz * LIGHT.z) / Math.hypot(gx, 1, gz)
      const shade = clamp(128 + SHADE_GAIN * (dot - LIGHT.y), 0, 255)

      let factor = shade / 128
      const isWater = cls === MapRasterClass.Ocean || cls === MapRasterClass.InlandWater
      if (isWater) {
        const depth = Math.max(0, params.waterLevel - floors[k]!) / heightScale
        factor *= clamp(1.05 - depth * 0.6, 0.6, 1.05)
      } else {
        const altitude = (h - params.waterLevel) / heightScale
        factor *= clamp(0.85 + altitude * 0.25, 0.7, 1.2)
      }

      const c = cls * 3
      out[o] = Math.min(255, MAP_RASTER_CLASS_RGB[c]! * factor)
      out[o + 1] = Math.min(255, MAP_RASTER_CLASS_RGB[c + 1]! * factor)
      out[o + 2] = Math.min(255, MAP_RASTER_CLASS_RGB[c + 2]! * factor)
      out[o + 3] = 255
    }
  }
}
