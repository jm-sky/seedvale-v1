import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import { MAP_EXTENT_HALF } from './mapConfig'
import {
  MAP_COVERAGE_BLOCK,
  type MapRasterStep,
  type MapRiverDetail,
  mapTileBounds,
  type MapTileData,
  mapTileKey,
  type MapTileRequest,
  mapTilesInRect,
} from './mapRasterTile'

/**
 * Whole-continent diagnostic preview (plan tools-023): ungated tile requests
 * and an all-or-nothing batch collector. Never touches `MapDiscovery`; the
 * tile content is the canonical `buildMapTile` output.
 *
 * @domain tools
 */

/** Overview LOD: 12 × 12 tiles of 1024 m over the ±6144 m extent. */
export const CONTINENT_PREVIEW_STEP: MapRasterStep = 16

const FULL_RECT = { minX: -MAP_EXTENT_HALF, maxX: MAP_EXTENT_HALF, minZ: -MAP_EXTENT_HALF, maxZ: MAP_EXTENT_HALF }

/** Every coverage block (`[bx, bz]`) touching `rect` grown by `margin` (the sampler's apron). */
export function coverageBlocksFor(
  rect: { minX: number, maxX: number, minZ: number, maxZ: number },
  margin: number,
): [number, number][] {
  const blocks: [number, number][] = []
  const bx0 = Math.floor((rect.minX - margin) / MAP_COVERAGE_BLOCK)
  const bx1 = Math.floor((rect.maxX + margin) / MAP_COVERAGE_BLOCK)
  const bz0 = Math.floor((rect.minZ - margin) / MAP_COVERAGE_BLOCK)
  const bz1 = Math.floor((rect.maxZ + margin) / MAP_COVERAGE_BLOCK)
  for (let bz = bz0; bz <= bz1; bz++) {
    for (let bx = bx0; bx <= bx1; bx++) blocks.push([bx, bz])
  }
  return blocks
}

/**
 * One fully-covered request per tile of the whole map extent.
 *
 * @domain tools
 */
export function continentTileRequests(
  params: RawSampleParams,
  riverDetail: MapRiverDetail,
  step: MapRasterStep = CONTINENT_PREVIEW_STEP,
): MapTileRequest[] {
  return mapTilesInRect(step, FULL_RECT).map((coord) => ({
    ...coord,
    params,
    riverDetail,
    coverage: coverageBlocksFor(mapTileBounds(coord), step),
  }))
}

export type ContinentTileRequester = {
  request(key: string, request: MapTileRequest): Promise<MapTileData>
  cancel(key: string): void
}

export class ContinentPreviewAbortedError extends Error {
  constructor() {
    super('Continent preview cancelled')
    this.name = 'ContinentPreviewAbortedError'
  }
}

export type CollectContinentTilesOptions = {
  requests: readonly MapTileRequest[]
  requester: ContinentTileRequester
  signal?: AbortSignal
  /** Tile jobs in flight at once (bounded batch). */
  concurrency?: number
  onProgress?: (done: number, total: number) => void
}

/**
 * Generates every requested tile. Resolves only when **all** tiles succeeded
 * (in request order); on any failure or abort it cancels in-flight jobs and
 * rejects, so a partial map can never be exported.
 *
 * @domain tools
 */
export async function collectContinentTiles(options: CollectContinentTilesOptions): Promise<MapTileData[]> {
  const { requests, requester, signal, onProgress } = options
  const concurrency = Math.max(1, options.concurrency ?? 4)
  const results = new Array<MapTileData>(requests.length)
  const inflight = new Set<string>()
  let next = 0
  let done = 0
  let failure: unknown = null
  // Settles on the first failure/abort so no lane waits on a cancelled job.
  let fail: (error: unknown) => void = () => {}
  const failed = new Promise<never>((_, reject) => { fail = reject })
  failed.catch(() => {})

  const cancelAll = () => {
    for (const key of inflight) requester.cancel(key)
    inflight.clear()
  }
  const onAbort = () => {
    failure ??= new ContinentPreviewAbortedError()
    cancelAll()
    fail(failure)
  }
  if (signal?.aborted) throw new ContinentPreviewAbortedError()
  signal?.addEventListener('abort', onAbort, { once: true })

  const lane = async () => {
    while (failure === null && next < requests.length) {
      const index = next++
      const request = requests[index]!
      const key = mapTileKey(request)
      inflight.add(key)
      try {
        results[index] = await Promise.race([requester.request(key, request), failed])
        done++
        onProgress?.(done, requests.length)
      } catch (error) {
        failure ??= error
        cancelAll()
        fail(failure)
      } finally {
        inflight.delete(key)
      }
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(concurrency, requests.length) }, lane))
  } finally {
    signal?.removeEventListener('abort', onAbort)
  }
  if (failure !== null) throw failure
  if (done !== requests.length) throw new Error(`Continent preview incomplete: ${done}/${requests.length} tiles`)
  return results
}
