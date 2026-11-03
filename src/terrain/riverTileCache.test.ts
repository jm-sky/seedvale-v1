import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawSampleParams } from './chunkHeightmap'
import type { RiverChain } from './riverNetwork'
import { createRiverTileCache, riverTileStatsDelta } from './riverTileCache'

const computeRiverTile = vi.hoisted(() => vi.fn())
vi.mock('./riverNetwork', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./riverNetwork')>()),
  computeRiverTile,
}))

const params = { seed: 1 } as RawSampleParams
const chainsFor = (tx: number, tz: number): RiverChain[] => [{ points: [{ x: tx, z: tz }] as never }]

describe('riverTileCache', () => {
  beforeEach(() => {
    computeRiverTile.mockReset()
    computeRiverTile.mockImplementation((tile: { tx: number, tz: number }) => chainsFor(tile.tx, tile.tz))
  })

  it('computes synchronously and shares one entry by refcount', () => {
    const cache = createRiverTileCache()
    const a = cache.retain({ tx: 0, tz: 0 }, params)
    const b = cache.retain({ tx: 0, tz: 0 }, params)
    expect(a).toBe(b)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
    expect(cache.stats.syncComputes).toBe(1)
  })

  it('release → re-retain reuses the tile', () => {
    const cache = createRiverTileCache()
    const first = cache.retain({ tx: 3, tz: 3 }, params)
    cache.release({ tx: 3, tz: 3 })
    expect(cache.retain({ tx: 3, tz: 3 }, params)).toBe(first)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
    expect(cache.stats.storeHits).toBe(1)
  })

  it('bounds the unreferenced store, evicting the oldest', () => {
    const cache = createRiverTileCache({ maxStored: 2 })
    for (const tx of [0, 1, 2]) {
      cache.retain({ tx, tz: 0 }, params)
      cache.release({ tx, tz: 0 })
    }
    computeRiverTile.mockClear()
    cache.retain({ tx: 2, tz: 0 }, params)
    cache.retain({ tx: 1, tz: 0 }, params)
    expect(computeRiverTile).not.toHaveBeenCalled()
    cache.retain({ tx: 0, tz: 0 }, params)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
  })

  it('disposeAll clears the store', () => {
    const cache = createRiverTileCache()
    cache.retain({ tx: 0, tz: 0 }, params)
    cache.release({ tx: 0, tz: 0 })
    cache.disposeAll()
    computeRiverTile.mockClear()
    cache.retain({ tx: 0, tz: 0 }, params)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
  })
})

describe('riverTileStatsDelta', () => {
  it('reports window counters, max taken from the (window-reset) after snapshot', () => {
    const before = { syncComputes: 2, storeHits: 1, syncMsTotal: 40, syncMsMax: 0 }
    expect(riverTileStatsDelta(before, { ...before, storeHits: 4 }))
      .toEqual({ syncComputes: 0, storeHits: 3, syncMsTotal: 0, syncMsMax: 0 })
    expect(riverTileStatsDelta(before, { ...before, syncComputes: 3, syncMsTotal: 52, syncMsMax: 12 }))
      .toMatchObject({ syncComputes: 1, syncMsTotal: 12, syncMsMax: 12 })
  })
})
