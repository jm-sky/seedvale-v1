import { describe, expect, it } from 'vitest'
import { createBenchmarkWorldConfig } from '../../config/worldConfig'
import { sampleRawTexelAt } from '../../terrain/chunkHeightmap'
import { MAP_EXTENT_HALF } from './mapConfig'
import { classifyMapTexel, projectCellAt, rawSampleParamsFromWorld } from './mapProjection'
import {
  buildMapTile,
  MAP_TILE_SAMPLES,
  MAP_TILE_SIDE,
  MapRasterClass,
  mapTileBounds,
  mapTilesInRect,
  selectMapRasterStep,
} from './mapRasterTile'

const params = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed: 1234, terrainResolution: 65, loadRadius: 2 }))

describe('map raster LOD selection', () => {
  it('picks the coarsest step that keeps ≥1.5 device px per sample', () => {
    expect(selectMapRasterStep(1, 2)).toBe(2)
    expect(selectMapRasterStep(0.5, 2)).toBe(4)
    expect(selectMapRasterStep(8)).toBe(1)
    expect(selectMapRasterStep(0.3)).toBe(8)
    expect(selectMapRasterStep(0.01)).toBe(16)
  })
})

describe('map raster tile grid', () => {
  it('aligns tiles to the world grid and clamps to the map extent', () => {
    const tiles = mapTilesInRect(16, { minX: -1e6, maxX: 1e6, minZ: -1e6, maxZ: 1e6 })
    expect(tiles).toHaveLength(64)
    const bounds = tiles.map(mapTileBounds)
    expect(Math.min(...bounds.map((b) => b.minX))).toBe(-MAP_EXTENT_HALF)
    expect(Math.max(...bounds.map((b) => b.maxZ))).toBe(MAP_EXTENT_HALF)
    expect(mapTilesInRect(2, { minX: -10, maxX: 10, minZ: 5, maxZ: 6 })).toEqual([
      { step: 2, tx: -1, tz: 0 },
      { step: 2, tx: 0, tz: 0 },
    ])
  })
})

describe('map texel classification', () => {
  it('matches the per-cell projection for the same point', () => {
    for (const [x, z] of [[4, 4], [-300, 120], [1500, -900]] as const) {
      expect(classifyMapTexel(sampleRawTexelAt(x, z, params), params)).toEqual(projectCellAt(x, z, params))
    }
  })
})

describe('buildMapTile', () => {
  it('samples nothing outside discovered coverage', () => {
    const tile = buildMapTile({ step: 4, tx: 0, tz: 0, params, coverage: [] })
    expect(tile.classes.every((c) => c === MapRasterClass.None)).toBe(true)
    expect(tile.riverRuns).toHaveLength(0)
  })

  it('is deterministic and seamless across neighbouring tiles', () => {
    const coverage = [[0, 0]] as const
    const a = buildMapTile({ step: 2, tx: 0, tz: 0, params, coverage: [...coverage] })
    const again = buildMapTile({ step: 2, tx: 0, tz: 0, params, coverage: [...coverage] })
    expect(again.heights).toEqual(a.heights)
    expect(again.classes).toEqual(a.classes)

    const b = buildMapTile({ step: 2, tx: 1, tz: 0, params, coverage: [...coverage] })
    // a's right apron column samples the same points as b's first core column.
    for (let j = 1; j <= MAP_TILE_SAMPLES; j++) {
      expect(a.heights[j * MAP_TILE_SIDE + MAP_TILE_SIDE - 1]).toBe(b.heights[j * MAP_TILE_SIDE + 1])
      expect(b.heights[j * MAP_TILE_SIDE]).toBe(a.heights[j * MAP_TILE_SIDE + MAP_TILE_SAMPLES])
    }
    expect(a.classes.some((c) => c !== MapRasterClass.None)).toBe(true)
  })

  it('keeps every river point inside its tile once and never duplicates segments across tiles', () => {
    const coverage: [number, number][] = [[0, 0]]
    const tiles = [0, 1].flatMap((tx) => [0, 1].map((tz) => buildMapTile({ step: 2, tx, tz, params, coverage })))
    const segments = new Set<string>()
    for (const tile of tiles) {
      let offset = 0
      for (const count of tile.riverRuns) {
        expect(count).toBeGreaterThanOrEqual(2)
        for (let p = 0; p + 1 < count; p++) {
          const i = (offset + p) * 3
          const key = [tile.riverPoints[i], tile.riverPoints[i + 1], tile.riverPoints[i + 3], tile.riverPoints[i + 4]].join(',')
          expect(segments.has(key)).toBe(false)
          segments.add(key)
        }
        offset += count
      }
      expect(offset * 3).toBe(tile.riverPoints.length)
    }
  })
})
