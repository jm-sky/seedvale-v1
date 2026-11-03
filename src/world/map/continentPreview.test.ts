import { describe, expect, it, vi } from 'vitest'
import { createBenchmarkWorldConfig } from '../../config/worldConfig'
import { withWindowHydrology } from '../../terrain/testWindowHydrology'
import { UNCONDITIONED_HYDROLOGY_ID } from '../../terrain/worldHydrologyStore'
import {
  collectContinentTiles,
  ContinentPreviewAbortedError,
  type ContinentTileRequester,
  continentTileRequests,
} from './continentPreview'
import { MAP_EXTENT_HALF } from './mapConfig'
import { rawSampleParamsFromWorld } from './mapProjection'
import { buildMapTile, MapRasterClass, mapTileBounds, mapTileKey } from './mapRasterTile'

const params = {
  ...rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed: 415424794, terrainResolution: 65, loadRadius: 2 })),
  hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
}

describe('continentTileRequests', () => {
  const requests = continentTileRequests(params, 'all')

  it('covers the whole extent with 12 × 12 tiles, negative and positive', () => {
    expect(requests).toHaveLength(144)
    const bounds = requests.map(mapTileBounds)
    expect(Math.min(...bounds.map((b) => b.minX))).toBe(-MAP_EXTENT_HALF)
    expect(Math.max(...bounds.map((b) => b.maxX))).toBe(MAP_EXTENT_HALF)
    expect(Math.min(...bounds.map((b) => b.minZ))).toBe(-MAP_EXTENT_HALF)
    expect(Math.max(...bounds.map((b) => b.maxZ))).toBe(MAP_EXTENT_HALF)
    expect(new Set(requests.map(mapTileKey)).size).toBe(144)
  })

  it('supplies coverage for every 256 m block of each tile (incl. negatives)', () => {
    const corner = requests.find((r) => r.tx === -6 && r.tz === -6)!
    expect(corner.coverage).toContainEqual([-24, -24])
    expect(corner.coverage.length).toBeGreaterThanOrEqual(16)
  })

  it('samples every texel of a tile although no discovery exists', () => {
    const tile = buildMapTile(requests.find((r) => r.tx === 0 && r.tz === 0)!)
    expect(tile.classes.every((c) => c !== MapRasterClass.None)).toBe(true)
  })
})

describe('river detail', () => {
  it('"all" keeps at least as many river points as "standard"', () => {
    const rp = withWindowHydrology(params)
    const base = continentTileRequests(rp, 'standard').filter((r) => r.tx >= -1 && r.tx <= 0 && r.tz >= -1 && r.tz <= 0)
    const count = (detail: 'standard' | 'all') => base
      .map((r) => buildMapTile({ ...r, riverDetail: detail }).riverPoints.length)
      .reduce((a, b) => a + b, 0)
    expect(count('all')).toBeGreaterThanOrEqual(count('standard'))
  })
})

describe('collectContinentTiles', () => {
  const requests = continentTileRequests(params, 'standard').slice(0, 10)
  const fake = (req: (key: string, i: number) => Promise<ReturnType<typeof buildMapTile>>): ContinentTileRequester => {
    let i = 0
    return { request: (key) => req(key, i++), cancel: vi.fn() }
  }

  it('returns all tiles in request order and reports progress', async () => {
    const progress: number[] = []
    const tiles = await collectContinentTiles({
      requests,
      requester: { request: (_k, r) => Promise.resolve(buildMapTile({ ...r, coverage: [] })), cancel: () => {} },
      onProgress: (d) => progress.push(d),
    })
    expect(tiles.map(mapTileKey)).toEqual(requests.map(mapTileKey))
    expect(progress.at(-1)).toBe(10)
  })

  it('rejects (no partial result) when one tile fails, and cancels the rest', async () => {
    const requester = fake((_k, i) => (i === 3 ? Promise.reject(new Error('boom')) : new Promise(() => {})))
    await expect(collectContinentTiles({ requests, requester, concurrency: 4 })).rejects.toThrow('boom')
    expect(requester.cancel).toHaveBeenCalled()
  })

  it('rejects with an abort error on cancellation', async () => {
    const controller = new AbortController()
    const requester = fake(() => new Promise(() => {}))
    const pending = collectContinentTiles({ requests, requester, signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toBeInstanceOf(ContinentPreviewAbortedError)
    expect(requester.cancel).toHaveBeenCalled()
  })
})
