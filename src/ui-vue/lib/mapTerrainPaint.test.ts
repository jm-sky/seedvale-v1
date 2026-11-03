import { describe, expect, it } from 'vitest'
import { createBenchmarkWorldConfig } from '../../config/worldConfig'
import { UNCONDITIONED_HYDROLOGY_ID } from '../../terrain/worldHydrologyStore'
import { rawSampleParamsFromWorld } from '../../world/map/mapProjection'
import { buildMapTile, MAP_TILE_SIDE, MapRasterClass } from '../../world/map/mapRasterTile'
import { paintMapTilePixels } from './mapTerrainPaint'

describe('paintMapTilePixels on real terrain', () => {
  it('shades steep V1 detail without blackening it', () => {
    const params = { ...rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed: 1234, terrainResolution: 65, loadRadius: 2 })), hydrologyId: UNCONDITIONED_HYDROLOGY_ID }
    let land = 0
    let dark = 0
    let min = 255
    let max = 0
    for (let tx = -2; tx < 2; tx++) {
      for (let tz = -2; tz < 2; tz++) {
        const tile = buildMapTile({ step: 2, tx, tz, params, coverage: [[Math.floor(tx / 2), Math.floor(tz / 2)]] })
        const px = new Uint8ClampedArray(MAP_TILE_SIDE * MAP_TILE_SIDE * 4)
        paintMapTilePixels(tile, params, px)
        for (let k = 0; k < tile.classes.length; k++) {
          const cls = tile.classes[k]
          if (cls === MapRasterClass.None || cls === MapRasterClass.Ocean || cls === MapRasterClass.InlandWater) continue
          const luminance = Math.max(px[k * 4]!, px[k * 4 + 1]!, px[k * 4 + 2]!)
          land++
          if (luminance < 40) dark++
          min = Math.min(min, luminance)
          max = Math.max(max, luminance)
        }
      }
    }
    expect(land).toBeGreaterThan(1000)
    expect(dark).toBe(0)
    // Relief still visible: shading spreads luminance across a real range.
    expect(max - min).toBeGreaterThan(40)
  })
})
