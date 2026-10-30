import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawSampleParams } from './chunkHeightmap'
import type { RiverChain } from './riverNetwork'
import { createRiverTileCache } from './riverTileCache'

const computeRiverTile = vi.hoisted(() => vi.fn())
vi.mock('./riverNetwork', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./riverNetwork')>()),
  computeRiverTile,
}))

const params = { seed: 1 } as RawSampleParams
const chainsFor = (tx: number, tz: number): RiverChain[] => [{ points: [{ x: tx, z: tz }] as never }]

type Deferred = { resolve: (c: RiverChain[]) => void, reject: (e: Error) => void }

function setup(maxStored?: number) {
  const requests = new Map<string, Deferred>()
  const cancelled: string[] = []
  const cache = createRiverTileCache({
    maxStored,
    requestTile: (key) => new Promise<RiverChain[]>((resolve, reject) => { requests.set(key, { resolve, reject }) }),
    cancelTile: (key) => { cancelled.push(key) },
  })
  return { cache, requests, cancelled }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('riverTileCache', () => {
  beforeEach(() => {
    computeRiverTile.mockReset()
    computeRiverTile.mockImplementation((tile: { tx: number, tz: number }) => chainsFor(tile.tx, tile.tz))
  })

  it('computes synchronously without prefetch and shares one entry by refcount', () => {
    const cache = createRiverTileCache()
    const a = cache.retain({ tx: 0, tz: 0 }, params)
    const b = cache.retain({ tx: 0, tz: 0 }, params)
    expect(a).toBe(b)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
    expect(cache.stats.syncComputes).toBe(1)
  })

  it('retain after a finished prefetch does not compute', async () => {
    const { cache, requests } = setup()
    cache.prefetch({ tx: 1, tz: 2 }, params)
    const worker = chainsFor(1, 2)
    requests.get('1,2')!.resolve(worker)
    await flush()
    expect(cache.retain({ tx: 1, tz: 2 }, params)).toBe(worker)
    expect(computeRiverTile).not.toHaveBeenCalled()
    expect(cache.stats).toMatchObject({ prefetched: 1, storeHits: 1, syncComputes: 0 })
  })

  it('retain while a prefetch is in flight computes sync, cancels it and ignores the late result', async () => {
    const { cache, requests, cancelled } = setup()
    cache.prefetch({ tx: 0, tz: 0 }, params)
    const sync = cache.retain({ tx: 0, tz: 0 }, params)
    expect(computeRiverTile).toHaveBeenCalledTimes(1)
    expect(cancelled).toEqual(['0,0'])
    requests.get('0,0')!.resolve(chainsFor(9, 9))
    await flush()
    expect(cache.retain({ tx: 0, tz: 0 }, params)).toBe(sync)
    expect(cache.stats.prefetched).toBe(0)
  })

  it('does not request tiles that are retained, stored or in flight', () => {
    const requestTile = vi.fn(() => new Promise<RiverChain[]>(() => {}))
    const cache = createRiverTileCache({ requestTile })
    cache.retain({ tx: 0, tz: 0 }, params)
    cache.prefetch({ tx: 0, tz: 0 }, params)
    cache.release({ tx: 0, tz: 0 })
    cache.prefetch({ tx: 0, tz: 0 }, params)
    cache.prefetch({ tx: 5, tz: 5 }, params)
    cache.prefetch({ tx: 5, tz: 5 }, params)
    expect(requestTile).toHaveBeenCalledTimes(1)
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

  it('disposeAll clears store, cancels in-flight and drops late results', async () => {
    const { cache, requests, cancelled } = setup()
    cache.retain({ tx: 0, tz: 0 }, params)
    cache.release({ tx: 0, tz: 0 })
    cache.prefetch({ tx: 4, tz: 4 }, params)
    cache.disposeAll()
    expect(cancelled).toEqual(['4,4'])
    requests.get('4,4')!.resolve(chainsFor(4, 4))
    await flush()
    computeRiverTile.mockClear()
    cache.retain({ tx: 0, tz: 0 }, params)
    cache.retain({ tx: 4, tz: 4 }, params)
    expect(computeRiverTile).toHaveBeenCalledTimes(2)
  })

  it('falls back to sync compute when the worker request rejects or throws', async () => {
    const rejecting = createRiverTileCache({ requestTile: () => Promise.reject(new Error('x')) })
    rejecting.prefetch({ tx: 0, tz: 0 }, params)
    await flush()
    rejecting.retain({ tx: 0, tz: 0 }, params)
    const throwing = createRiverTileCache({ requestTile: () => { throw new Error('no Worker') } })
    throwing.prefetch({ tx: 1, tz: 1 }, params)
    throwing.retain({ tx: 1, tz: 1 }, params)
    expect(computeRiverTile).toHaveBeenCalledTimes(2)
  })
})
