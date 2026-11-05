import { describe, expect, it } from 'vitest'
import { createBenchmarkWorldConfig } from '../config/worldConfig'
import { rawSampleParamsFromWorld } from '../world/map/mapProjection'
import { sampleRawTexelAt } from './chunkHeightmap'
import { FAR_FINE_RADIUS, wantedFarTiles } from './farTerrain'
import {
  buildFarTileIndices,
  computeFarTile,
  FAR_TILE_CELLS_COARSE,
  FAR_TILE_CELLS_FINE,
  FAR_TILE_SIZE,
  farGridVertexCount,
  farTileVertexCount,
  skirtSourceIndex,
} from './farTile'
import { UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

describe('wantedFarTiles', () => {
  it('is nearest-first, covers the ring and splits levels at the fine radius', () => {
    const list = wantedFarTiles(100, -40, 800)
    expect(list.length).toBeGreaterThan(30)
    expect(list.length).toBeLessThan(90)
    for (let i = 1; i < list.length; i++) expect(list[i]!.dist).toBeGreaterThanOrEqual(list[i - 1]!.dist)
    for (const w of list) {
      expect(w.cells).toBe(w.dist <= FAR_FINE_RADIUS ? FAR_TILE_CELLS_FINE : FAR_TILE_CELLS_COARSE)
    }
    // The tile under the player is always wanted, at the fine level.
    const own = list.find((w) => w.tx === 0 && w.tz === -1)
    expect(own?.cells).toBe(FAR_TILE_CELLS_FINE)
  })

  it('leaves no tile edge inside the opaque radius', () => {
    const px = -3017.5
    const pz = 812.25
    const list = new Set(wantedFarTiles(px, pz, 800).map((w) => `${w.tx},${w.tz}`))
    for (let a = 0; a < 360; a += 5) {
      const x = px + Math.cos((a * Math.PI) / 180) * 800
      const z = pz + Math.sin((a * Math.PI) / 180) * 800
      expect(list.has(`${Math.floor(x / FAR_TILE_SIZE)},${Math.floor(z / FAR_TILE_SIZE)}`)).toBe(true)
    }
  })
})

describe('far tile topology', () => {
  for (const cells of [FAR_TILE_CELLS_FINE, FAR_TILE_CELLS_COARSE]) {
    it(`builds in-range indices and a closed skirt ring for ${cells} cells`, () => {
      const indices = buildFarTileIndices(cells)
      const count = farTileVertexCount(cells)
      expect(indices.length).toBe((cells * cells * 2 + 4 * cells * 2) * 3)
      expect(Math.max(...indices)).toBeLessThan(count)
      const edge = new Set<number>()
      for (let k = 0; k < 4 * cells; k++) edge.add(skirtSourceIndex(cells, k))
      expect(edge.size).toBe(4 * cells) // every border vertex exactly once
      for (const g of edge) {
        const x = g % (cells + 1)
        const z = Math.floor(g / (cells + 1))
        expect(x === 0 || z === 0 || x === cells || z === cells).toBe(true)
      }
    })
  }
})

describe('computeFarTile', () => {
  const world = createBenchmarkWorldConfig({ seed: 415424794, terrainResolution: 65, loadRadius: 3 })
  // No global hydrology (analytic field only): keeps the test free of the 1537² hydrology compute.
  const params = { ...rawSampleParamsFromWorld(world), hydrologyId: UNCONDITIONED_HYDROLOGY_ID }

  it('is deterministic and shares border heights with its neighbour (no cracks)', () => {
    const cells = FAR_TILE_CELLS_COARSE
    const a = computeFarTile({ params, tx: 0, tz: 0, cells })
    const again = computeFarTile({ params, tx: 0, tz: 0, cells })
    expect(Array.from(again.y)).toEqual(Array.from(a.y))
    const b = computeFarTile({ params, tx: 1, tz: 0, cells })
    const side = cells + 1
    for (let j = 0; j < side; j++) {
      expect(a.y[j * side + cells]).toBeCloseTo(b.y[j * side]!, 5) // east edge of A == west edge of B
    }
  })

  it('sits under the raw surface by the seam drop and sinks the skirt', () => {
    const cells = FAR_TILE_CELLS_FINE
    const tile = computeFarTile({ params, tx: 2, tz: -1, cells })
    const side = cells + 1
    const i = 7
    const j = 11
    const texel = sampleRawTexelAt(2 * FAR_TILE_SIZE + i * (FAR_TILE_SIZE / cells), -FAR_TILE_SIZE + j * (FAR_TILE_SIZE / cells), params)
    const expected = (texel.h - texel.floorH > 0.02 ? texel.h : texel.floorH) - 0.3
    expect(tile.y[j * side + i]).toBeCloseTo(expected, 4)
    expect(tile.y.length).toBe(farTileVertexCount(cells))
    const grid = farGridVertexCount(cells)
    expect(tile.y[grid]!).toBeLessThan(tile.y[skirtSourceIndex(cells, 0)]! - 5)
    for (const v of tile.color) expect(v).toBeGreaterThanOrEqual(0)
    for (const v of tile.color) expect(v).toBeLessThanOrEqual(1)
  })
})
