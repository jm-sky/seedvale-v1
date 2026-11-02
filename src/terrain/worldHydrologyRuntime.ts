import type { RawSampleParams } from './chunkHeightmap'
import type { WorldHydrology } from './worldHydrology'
import { installChunkWorkerHydrology, requestChunkHydrologyRows } from './chunkWorkerPool'
import { computeWorldHydrology, hashWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID } from './worldHydrology'
import { readCachedWorldHydrology, writeCachedWorldHydrology } from './worldHydrologyCache'
import { hasWorldHydrology, installWorldHydrology, worldHydrologyFor, worldHydrologyOptionsFor } from './worldHydrologyRegistry'

/**
 * Boot-time install of the global hydrology (plan world-terrain-058 H2): registry → persistent cache (or boot
 * fixture, which lands in the same IndexedDB namespace) → compute once from strips sampled across the worker pool.
 * The result is installed in the main-thread registry and in every chunk worker. Runs before the chunk manager exists,
 * so nothing samples terrain for this seed earlier.
 *
 * @domain world-terrain
 * @subdomain hydrology
 */

export type WorldHydrologyInstallSource = 'registry' | 'cache' | 'computed'

export type WorldHydrologyInstallResult = {
  hydrologyId: string
  source: WorldHydrologyInstallSource
  /** `hashWorldHydrology` — logged at boot; identical across cold/warm boots and strip counts. */
  hash: string
  /** Wall time of the whole install (ms). */
  totalMs: number
  /** Strip sampling wall time (ms), computed only. */
  sampleMs: number
  /** Pure compute time (ms), computed only. */
  computeMs: number
}

export type WorldHydrologyFloorSampler = (params: RawSampleParams, rowStart: number, rowEnd: number) => Promise<Float32Array>

/** Strips sampled in parallel — more than the worker count keeps every worker busy despite uneven rows. */
export const WORLD_HYDROLOGY_STRIPS = 12

/**
 * Samples the raw floor of the whole grid as `strips` row ranges through `sampleRows` and concatenates them in row
 * order. The result is independent of the strip count and of which realm sampled each strip.
 */
export async function sampleWorldHydrologyFloor(
  params: RawSampleParams,
  sampleRows: WorldHydrologyFloorSampler,
  strips = WORLD_HYDROLOGY_STRIPS,
): Promise<Float32Array> {
  const { size } = WORLD_HYDROLOGY_GRID
  const count = Math.max(1, Math.min(strips, size))
  const bounds = Array.from({ length: count + 1 }, (_, s) => Math.floor((s * size) / count))
  const parts = await Promise.all(Array.from({ length: count }, (_, s) => sampleRows(params, bounds[s]!, bounds[s + 1]!)))
  const floor = new Float32Array(size * size)
  let offset = 0
  for (const part of parts) {
    floor.set(part, offset)
    offset += part.length
  }
  return floor
}

/** Computes the hydrology of `params` from a floor sampler. Pure given the sampler; no registry, cache or pool. */
export async function computeWorldHydrologyFor(
  params: RawSampleParams,
  sampleRows: WorldHydrologyFloorSampler,
  strips = WORLD_HYDROLOGY_STRIPS,
): Promise<{ hydrology: WorldHydrology, sampleMs: number, computeMs: number }> {
  const t0 = performance.now()
  const floor = await sampleWorldHydrologyFloor(params, sampleRows, strips)
  const sampleMs = performance.now() - t0
  const t1 = performance.now()
  const hydrology = computeWorldHydrology({ ...WORLD_HYDROLOGY_GRID, floor }, worldHydrologyOptionsFor(params))
  return { hydrology, sampleMs, computeMs: performance.now() - t1 }
}

export type EnsureWorldHydrologyOptions = {
  /** Test seam; default: strips across the chunk worker pool. */
  sampleRows?: WorldHydrologyFloorSampler
  /** Test seam; default: the IndexedDB cache. */
  cache?: {
    read: (seed: number, hydrologyId: string) => Promise<WorldHydrology | null>
    write: (seed: number, hydrologyId: string, data: WorldHydrology) => Promise<void>
  }
  /** Test seam; default: the module chunk worker pool. */
  installInWorkers?: (hydrologyId: string, data: WorldHydrology) => void
}

const pending = new Map<string, Promise<WorldHydrologyInstallResult>>()

/**
 * Makes the hydrology of `params` available in this realm and in every chunk worker. Idempotent and de-duplicated:
 * concurrent calls for one id share the work; a later call for an installed id only re-installs it in a worker pool
 * that was recreated meanwhile (a no-op for the current pool).
 */
export function ensureWorldHydrology(params: RawSampleParams, options: EnsureWorldHydrologyOptions = {}): Promise<WorldHydrologyInstallResult> {
  const id = params.hydrologyId
  const running = pending.get(id)
  if (running) return running
  const job = install(params, options).finally(() => pending.delete(id))
  pending.set(id, job)
  return job
}

async function install(params: RawSampleParams, options: EnsureWorldHydrologyOptions): Promise<WorldHydrologyInstallResult> {
  const t0 = performance.now()
  const id = params.hydrologyId
  const installInWorkers = options.installInWorkers ?? installChunkWorkerHydrology
  const cache = options.cache ?? { read: readCachedWorldHydrology, write: writeCachedWorldHydrology }
  const sampleRows = options.sampleRows ?? ((p, a, b) => requestChunkHydrologyRows(`${id}:${a}`, p, a, b))

  if (hasWorldHydrology(id)) {
    const data = worldHydrologyFor(id)
    installInWorkers(id, data)
    return { hydrologyId: id, source: 'registry', hash: hashWorldHydrology(data), totalMs: performance.now() - t0, sampleMs: 0, computeMs: 0 }
  }

  const cached = await cache.read(params.seed, id)
  if (cached) {
    installWorldHydrology(id, cached)
    installInWorkers(id, cached)
    return { hydrologyId: id, source: 'cache', hash: hashWorldHydrology(cached), totalMs: performance.now() - t0, sampleMs: 0, computeMs: 0 }
  }

  const { hydrology, sampleMs, computeMs } = await computeWorldHydrologyFor(params, sampleRows)
  installWorldHydrology(id, hydrology)
  installInWorkers(id, hydrology)
  void cache.write(params.seed, id, hydrology)
  return { hydrologyId: id, source: 'computed', hash: hashWorldHydrology(hydrology), totalMs: performance.now() - t0, sampleMs, computeMs }
}

/** Single-thread sampler used by tools and tests that have no worker pool. */
export const sampleRowsOnThisThread: WorldHydrologyFloorSampler = (params, a, b) =>
  Promise.resolve(sampleRawFloorRows(params, WORLD_HYDROLOGY_GRID, a, b))
