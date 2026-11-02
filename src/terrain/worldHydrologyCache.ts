import type { WorldHydrology } from './worldHydrology'
import { cacheKey, type CacheRecord, getCacheRecord, putCacheRecords } from '../persistence/worldgenCacheDb'

/**
 * Persistent cache adapter for the global hydrology (plan world-terrain-058 H2): one record per seed, fingerprint =
 * `hydrologyId` (which already hashes `WORLD_HYDROLOGY_VERSION`, the options and every terrain input). Disposable
 * derived data: a miss, a malformed record or an IndexedDB failure falls back to computing.
 *
 * @domain world-terrain
 * @system worldgen-cache
 * @subdomain hydrology
 */

export const WORLD_HYDROLOGY_CACHE_NAMESPACE = 'hydrology'

/** Bump on any change to the cached payload shape (the algorithm itself is covered by `WORLD_HYDROLOGY_VERSION` in the id). */
export const WORLD_HYDROLOGY_CACHE_VERSION = 1

const SUB_KEY = 'world'

/** Structural check — a record that fails it is regenerated like a miss. */
export function isWorldHydrologyPayload(value: unknown): value is WorldHydrology {
  if (!value || typeof value !== 'object') return false
  const h = value as Partial<WorldHydrology>
  return (
    typeof h.version === 'number'
    && typeof h.size === 'number'
    && typeof h.cellStep === 'number'
    && !!h.correction && h.correction.blockIds instanceof Uint32Array && h.correction.data instanceof Float32Array
    && !!h.basin && h.basin.blockIds instanceof Uint32Array && h.basin.data instanceof Uint16Array
    && Array.isArray(h.lakes)
    && !!h.chains && h.chains.points instanceof Float32Array && h.chains.offsets instanceof Uint32Array && h.chains.flags instanceof Uint8Array
    && !!h.stats
  )
}

/** Reads the cached hydrology for `(seed, hydrologyId)`; `null` on miss / stale / malformed / failure. */
export async function readCachedWorldHydrology(seed: number, hydrologyId: string): Promise<WorldHydrology | null> {
  try {
    const rec = await getCacheRecord<WorldHydrology>(seed, WORLD_HYDROLOGY_CACHE_NAMESPACE, WORLD_HYDROLOGY_CACHE_VERSION, SUB_KEY)
    if (!rec || rec.fingerprint !== hydrologyId) return null
    return isWorldHydrologyPayload(rec.payload) ? rec.payload : null
  } catch {
    return null
  }
}

/** Best-effort write; never throws. */
export async function writeCachedWorldHydrology(seed: number, hydrologyId: string, data: WorldHydrology): Promise<void> {
  const record: CacheRecord<WorldHydrology> = {
    key: cacheKey(seed, WORLD_HYDROLOGY_CACHE_NAMESPACE, WORLD_HYDROLOGY_CACHE_VERSION, SUB_KEY),
    seed,
    namespace: WORLD_HYDROLOGY_CACHE_NAMESPACE,
    version: WORLD_HYDROLOGY_CACHE_VERSION,
    fingerprint: hydrologyId,
    payload: data,
    lastAccessedAt: Date.now(),
  }
  try {
    await putCacheRecords([record])
  } catch {
    // disposable cache
  }
}
