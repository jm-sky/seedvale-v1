import type { RawSampleParams } from './chunkHeightmap'
import { computeRiverTile, type RiverChain, type RiverTileCoord, riverTileKey } from './riverNetwork'

/**
 * Bounded, reference-counted cache of computed river tiles — the "on-demand
 * hydrology analysis region... kept in a bounded cache" the plan 181
 * implementation notes call for. A tile is computed once, the first time any
 * loaded chunk needs it, and shared by every other chunk overlapping it;
 * dropped from the referenced set the moment no loaded chunk still references
 * it. Membership is exactly reference-counted, same idea as
 * `vegetationRegionBatcher.ts`'s per-chunk membership, applied to tiles
 * instead of chunk-groups.
 *
 * Q22: `retain` stays synchronous (it computes on the main thread when it has
 * to), but `prefetch` can have a worker compute the tile ahead of time. Ready
 * and just-released tiles wait in a small bounded *unreferenced* store, so
 * `retain` after `prefetch` — or back-and-forth travel — skips the compute.
 */
export type RiverTileCache = {
  /** Returns a retained tile's chains: referenced entry, then prefetched/stored
   *  result, otherwise a synchronous compute (identical output either way). */
  retain(tile: RiverTileCoord, sampleParams: RawSampleParams): RiverChain[]
  /** Releases one reference; an unreferenced tile moves to the bounded store. */
  release(tile: RiverTileCoord): void
  /** Starts a worker compute for a tile nothing has computed yet. No-op without
   *  a `requestTile` option or when the tile is known/in flight. */
  prefetch(tile: RiverTileCoord, sampleParams: RawSampleParams): void
  disposeAll(): void
  readonly stats: RiverTileCacheStats
}

export type RiverTileCacheStats = {
  /** `retain` calls that had to compute on the main thread. */
  syncComputes: number
  /** `retain` calls satisfied by a prefetched or stored result. */
  storeHits: number
  /** Worker results accepted into the store. */
  prefetched: number
}

export type RiverTileCacheOptions = {
  /** Worker compute for one tile; absent → `prefetch` is a no-op. */
  requestTile?: (key: string, tile: RiverTileCoord, sampleParams: RawSampleParams) => Promise<RiverChain[]>
  cancelTile?: (key: string) => void
  /** Max unreferenced tiles kept, insertion-order eviction. */
  maxStored?: number
}

const DEFAULT_MAX_STORED = 12

type CacheEntry = { chains: RiverChain[]; refCount: number }

export function createRiverTileCache(options: RiverTileCacheOptions = {}): RiverTileCache {
  const { requestTile, cancelTile, maxStored = DEFAULT_MAX_STORED } = options
  const entries = new Map<string, CacheEntry>()
  const stored = new Map<string, RiverChain[]>()
  const inflight = new Map<string, symbol>()
  const stats: RiverTileCacheStats = { syncComputes: 0, storeHits: 0, prefetched: 0 }

  function store(key: string, chains: RiverChain[]): void {
    stored.delete(key)
    stored.set(key, chains)
    while (stored.size > maxStored) stored.delete(stored.keys().next().value as string)
  }

  function dropInflight(key: string): void {
    if (inflight.delete(key)) cancelTile?.(key)
  }

  return {
    retain(tile, sampleParams) {
      const key = riverTileKey(tile)
      let entry = entries.get(key)
      if (!entry) {
        const ready = stored.get(key)
        stored.delete(key)
        dropInflight(key)
        if (ready) stats.storeHits++
        else stats.syncComputes++
        entry = { chains: ready ?? computeRiverTile(tile, sampleParams), refCount: 0 }
        entries.set(key, entry)
      }
      entry.refCount++
      return entry.chains
    },
    release(tile) {
      const key = riverTileKey(tile)
      const entry = entries.get(key)
      if (!entry) return
      entry.refCount--
      if (entry.refCount <= 0) {
        entries.delete(key)
        store(key, entry.chains)
      }
    },
    prefetch(tile, sampleParams) {
      if (!requestTile) return
      const key = riverTileKey(tile)
      if (entries.has(key) || stored.has(key) || inflight.has(key)) return
      const token = Symbol(key)
      inflight.set(key, token)
      let request: Promise<RiverChain[]>
      try {
        request = requestTile(key, tile, sampleParams)
      } catch {
        // No worker available (e.g. tests): `retain` keeps its sync fallback.
        inflight.delete(key)
        return
      }
      request.then(
        (chains) => {
          // Stale: cancelled, disposed, or `retain` already computed it.
          if (inflight.get(key) !== token) return
          inflight.delete(key)
          if (entries.has(key)) return
          stats.prefetched++
          store(key, chains)
        },
        () => {
          if (inflight.get(key) === token) inflight.delete(key)
        },
      )
    },
    disposeAll() {
      for (const key of [...inflight.keys()]) dropInflight(key)
      entries.clear()
      stored.clear()
    },
    stats,
  }
}
