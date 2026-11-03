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
 * A tile is a cheap clip of the installed global chains (plan world-terrain-058 H3), so `retain` computes on the
 * main thread; just-released tiles wait in a small bounded *unreferenced* store so back-and-forth travel skips it.
 */
export type RiverTileCache = {
  /** Returns a retained tile's chains: referenced entry, then stored result, otherwise a compute. */
  retain(tile: RiverTileCoord, sampleParams: RawSampleParams): RiverChain[]
  /** Releases one reference; an unreferenced tile moves to the bounded store. */
  release(tile: RiverTileCoord): void
  disposeAll(): void
  readonly stats: RiverTileCacheStats
}

export type RiverTileCacheStats = {
  /** `retain` calls that had to compute on the main thread. */
  syncComputes: number
  /** `retain` calls satisfied by a stored result. */
  storeHits: number
  /** Main-thread wall time of `syncComputes` (benchmark structural evidence). */
  syncMsTotal: number
  syncMsMax: number
}

export type RiverTileCacheOptions = {
  /** Max unreferenced tiles kept, insertion-order eviction. */
  maxStored?: number
}

const DEFAULT_MAX_STORED = 12

type CacheEntry = { chains: RiverChain[]; refCount: number }

export function createRiverTileCache(options: RiverTileCacheOptions = {}): RiverTileCache {
  const { maxStored = DEFAULT_MAX_STORED } = options
  const entries = new Map<string, CacheEntry>()
  const stored = new Map<string, RiverChain[]>()
  const stats: RiverTileCacheStats = { syncComputes: 0, storeHits: 0, syncMsTotal: 0, syncMsMax: 0 }

  function store(key: string, chains: RiverChain[]): void {
    stored.delete(key)
    stored.set(key, chains)
    while (stored.size > maxStored) stored.delete(stored.keys().next().value as string)
  }

  return {
    retain(tile, sampleParams) {
      const key = riverTileKey(tile)
      let entry = entries.get(key)
      if (!entry) {
        const ready = stored.get(key)
        stored.delete(key)
        let chains = ready
        if (chains) {
          stats.storeHits++
        } else {
          const started = performance.now()
          chains = computeRiverTile(tile, sampleParams)
          const ms = performance.now() - started
          stats.syncComputes++
          stats.syncMsTotal += ms
          if (ms > stats.syncMsMax) stats.syncMsMax = ms
        }
        entry = { chains, refCount: 0 }
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
    disposeAll() {
      entries.clear()
      stored.clear()
    },
    stats,
  }
}

/** Counter delta between two {@link RiverTileCacheStats} snapshots. `syncMsMax`
 *  is taken from `after` — the caller resets it at window start
 *  (`ChunkManager.riverTileStats(true)`), so it is the window's max. */
export function riverTileStatsDelta(before: RiverTileCacheStats, after: RiverTileCacheStats): RiverTileCacheStats {
  const syncComputes = after.syncComputes - before.syncComputes
  return {
    syncComputes,
    storeHits: after.storeHits - before.storeHits,
    syncMsTotal: after.syncMsTotal - before.syncMsTotal,
    syncMsMax: after.syncMsMax,
  }
}
