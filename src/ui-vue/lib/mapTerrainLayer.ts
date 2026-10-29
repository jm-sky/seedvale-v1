import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import type { MapFogGrid } from '../../world/map/mapFogGrid'
import { getMonitor } from '../../perf/active'
import { cancelChunkMapTile, isChunkWorkerCancelledError, requestChunkMapTile } from '../../terrain/chunkWorkerPool'
import {
  MAP_RASTER_STEPS,
  MAP_TILE_SAMPLES,
  MAP_TILE_SIDE,
  type MapRasterStep,
  type MapRect,
  mapTileBounds,
  type MapTileCoord,
  type MapTileData,
  mapTileKey,
  type MapTileRequest,
  mapTilesInRect,
  mapTileWorldSize,
} from '../../world/map/mapRasterTile'
import { MAP_RIVER_STROKE } from './mapColors'
import { paintMapTilePixels } from './mapTerrainPaint'

/** Byte budget of painted tile canvases (+ river paths, estimated). */
const CACHE_BUDGET_BYTES = 16 * 1024 * 1024
/** Map jobs in flight at once; the pool additionally caps background work. */
const MAX_INFLIGHT = 3
/** Tiles drawn within this many `draw` calls are never evicted. */
const PIN_DRAWS = 4
/** Rivers never thinner than this on screen (CSS px). */
const RIVER_MIN_PX = 1.2

export type MapTileRequester = {
  request(key: string, request: MapTileRequest): Promise<MapTileData>
  cancel(key: string): void
}

export type MapCanvasLike = HTMLCanvasElement | OffscreenCanvas

export type MapTerrainLayerOptions = {
  params: RawSampleParams
  fog: MapFogGrid
  requester?: MapTileRequester
  createCanvas?: (width: number, height: number) => MapCanvasLike
}

type RiverStroke = { path: Path2D, width: number }

type TileEntry = {
  key: string
  coord: MapTileCoord
  bounds: MapRect
  canvas: MapCanvasLike
  rivers: RiverStroke[]
  /** Discovered coverage blocks the tile was built from. */
  coverage: number
  bytes: number
  lastDraw: number
}

type WantedTile = {
  key: string
  coord: MapTileCoord
  coverage: [number, number][]
  priority: number
}

export type MapTerrainStats = {
  tiles: number
  bytes: number
  inflight: number
  wanted: number
}

export type MapTerrainLayer = {
  /** World identity changed (rebuild/new seed): drop every tile and job. */
  setParams(params: RawSampleParams): void
  /**
   * Draws terrain + rivers covering `rect` at raster `step` into `ctx`, whose
   * current transform maps world units (x, z) to the canvas. Registers the
   * tiles this `consumer` wants generated next.
   */
  draw(ctx: CanvasRenderingContext2D, consumer: string, rect: MapRect, step: MapRasterStep, pxPerUnit: number): void
  /** Forget what `consumer` wanted (its view closed) so its pending tiles are cancelled. */
  clearConsumer(consumer: string): void
  /** Bumped whenever a tile becomes drawable. */
  readonly revision: number
  onTileReady(listener: () => void): () => void
  stats(): MapTerrainStats
  dispose(): void
}

const defaultRequester: MapTileRequester = {
  request: requestChunkMapTile,
  cancel: cancelChunkMapTile,
}

function defaultCreateCanvas(width: number, height: number): MapCanvasLike {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function buildRiverStrokes(tile: MapTileData): RiverStroke[] {
  // Group runs by quantised width — one stroke call per width bucket.
  const byWidth = new Map<number, Path2D>()
  let offset = 0
  for (const count of tile.riverRuns) {
    let widthSum = 0
    for (let p = 0; p < count; p++) widthSum += tile.riverPoints[(offset + p) * 3 + 2]!
    const width = Math.max(0.5, Math.round((widthSum / count) * 2) / 2)
    let path = byWidth.get(width)
    if (!path) {
      path = new Path2D()
      byWidth.set(width, path)
    }
    for (let p = 0; p < count; p++) {
      const x = tile.riverPoints[(offset + p) * 3]!
      const z = tile.riverPoints[(offset + p) * 3 + 1]!
      if (p === 0) path.moveTo(x, z)
      else path.lineTo(x, z)
    }
    offset += count
  }
  return [...byWidth].map(([width, path]) => ({ path, width }))
}

/**
 * Shared raster terrain for the minimap and the world map (plan ui-input-046):
 * a bounded LRU of painted, world-aligned LOD tiles generated off-thread on
 * demand. Only tiles overlapping discovered ground are generated; while a
 * tile is pending, a cached coarser ancestor stands in.
 *
 * @domain ui-input
 */
export function createMapTerrainLayer(options: MapTerrainLayerOptions): MapTerrainLayer {
  const { fog } = options
  const requester = options.requester ?? defaultRequester
  const createCanvas = options.createCanvas ?? defaultCreateCanvas
  let params = options.params
  let epoch = 0
  let drawCount = 0
  let revision = 0
  let bytes = 0
  let disposed = false
  /** Insertion order = LRU order (touch re-inserts). */
  const cache = new Map<string, TileEntry>()
  const inflight = new Map<string, number>()
  const failed = new Set<string>()
  const wantedByConsumer = new Map<string, WantedTile[]>()
  const listeners = new Set<() => void>()

  function touch(entry: TileEntry): void {
    entry.lastDraw = drawCount
    cache.delete(entry.key)
    cache.set(entry.key, entry)
  }

  function evict(): void {
    for (const entry of cache.values()) {
      if (bytes <= CACHE_BUDGET_BYTES) return
      if (drawCount - entry.lastDraw < PIN_DRAWS) continue
      cache.delete(entry.key)
      bytes -= entry.bytes
    }
  }

  function insert(data: MapTileData, coverage: number): void {
    const canvas = createCanvas(MAP_TILE_SIDE, MAP_TILE_SIDE)
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
    if (!ctx) return
    const image = ctx.createImageData(MAP_TILE_SIDE, MAP_TILE_SIDE)
    paintMapTilePixels(data, params, image.data)
    ctx.putImageData(image, 0, 0)
    const rivers = buildRiverStrokes(data)
    const key = mapTileKey(data)
    const previous = cache.get(key)
    if (previous) {
      cache.delete(key)
      bytes -= previous.bytes
    }
    const entry: TileEntry = {
      key,
      coord: { step: data.step, tx: data.tx, tz: data.tz },
      bounds: mapTileBounds(data),
      canvas,
      rivers,
      coverage,
      bytes: MAP_TILE_SIDE * MAP_TILE_SIDE * 4 + data.riverPoints.byteLength,
      lastDraw: drawCount,
    }
    cache.set(key, entry)
    bytes += entry.bytes
    evict()
    revision++
    for (const listener of listeners) listener()
  }

  function mergedWanted(): WantedTile[] {
    const merged = new Map<string, WantedTile>()
    for (const list of wantedByConsumer.values()) {
      for (const tile of list) {
        const existing = merged.get(tile.key)
        if (!existing || tile.priority < existing.priority) merged.set(tile.key, tile)
      }
    }
    return [...merged.values()].sort((a, b) => a.priority - b.priority)
  }

  function needsBuild(tile: WantedTile): boolean {
    if (failed.has(tile.key)) return false
    const entry = cache.get(tile.key)
    return !entry || entry.coverage < tile.coverage.length
  }

  function pump(): void {
    if (disposed) return
    const wanted = mergedWanted().filter(needsBuild)
    const wantedKeys = new Set(wanted.map((tile) => tile.key))
    for (const key of inflight.keys()) {
      if (!wantedKeys.has(key)) {
        inflight.delete(key)
        requester.cancel(key)
      }
    }
    for (const tile of wanted) {
      if (inflight.size >= MAX_INFLIGHT) break
      if (inflight.has(tile.key)) continue
      start(tile)
    }
  }

  function start(tile: WantedTile): void {
    const jobEpoch = epoch
    const queuedAt = performance.now()
    inflight.set(tile.key, jobEpoch)
    requester
      .request(tile.key, { ...tile.coord, params, coverage: tile.coverage })
      .then((data) => {
        if (disposed || jobEpoch !== epoch || inflight.get(tile.key) !== jobEpoch) return
        inflight.delete(tile.key)
        insert(data, tile.coverage.length)
        if (getMonitor().isEnabled()) {
          console.info(
            `[PERF:MAP] debug: tile ${tile.key} worker ${data.elapsedMs.toFixed(1)} ms`
            + ` total ${(performance.now() - queuedAt).toFixed(1)} ms`
            + ` cache ${cache.size} tiles ${(bytes / 1048576).toFixed(1)} MiB inflight ${inflight.size}`,
          )
        }
      })
      .catch((error: unknown) => {
        if (inflight.get(tile.key) === jobEpoch) inflight.delete(tile.key)
        if (isChunkWorkerCancelledError(error) || disposed || jobEpoch !== epoch) return
        failed.add(tile.key)
        console.error('[mapTerrainLayer] tile failed', tile.key, error)
      })
      .finally(() => pump())
  }

  function ancestorOf(coord: MapTileCoord): TileEntry | null {
    const size = mapTileWorldSize(coord.step)
    for (const step of MAP_RASTER_STEPS) {
      if (step <= coord.step) continue
      const ancestorSize = mapTileWorldSize(step)
      const entry = cache.get(mapTileKey({
        step,
        tx: Math.floor((coord.tx * size) / ancestorSize),
        tz: Math.floor((coord.tz * size) / ancestorSize),
      }))
      if (entry) return entry
    }
    return null
  }

  function drawTile(ctx: CanvasRenderingContext2D, entry: TileEntry): void {
    const step = entry.coord.step
    const size = mapTileWorldSize(step)
    // Half an apron sample of overlap hides anti-aliased seams under rotation;
    // the overlapped samples are identical in both tiles.
    ctx.drawImage(
      entry.canvas,
      0.5,
      0.5,
      MAP_TILE_SAMPLES + 1,
      MAP_TILE_SAMPLES + 1,
      entry.bounds.minX - step * 0.5,
      entry.bounds.minZ - step * 0.5,
      size + step,
      size + step,
    )
  }

  return {
    setParams(next) {
      params = next
      epoch++
      for (const key of inflight.keys()) requester.cancel(key)
      inflight.clear()
      cache.clear()
      failed.clear()
      bytes = 0
      revision++
    },
    draw(ctx, consumer, rect, step, pxPerUnit) {
      if (disposed) return
      drawCount++
      const centerX = (rect.minX + rect.maxX) / 2
      const centerZ = (rect.minZ + rect.maxZ) / 2
      const wanted: WantedTile[] = []
      const ready: TileEntry[] = []
      const fallbacks = new Map<string, TileEntry>()

      for (const coord of mapTilesInRect(step, rect)) {
        const bounds = mapTileBounds(coord)
        if (!fog.anyDiscoveredIn(bounds)) continue
        const key = mapTileKey(coord)
        const entry = cache.get(key)
        const coverage = fog.coveredBlocksIn(bounds)
        if (!entry || entry.coverage < coverage.length) {
          const priority = Math.hypot((bounds.minX + bounds.maxX) / 2 - centerX, (bounds.minZ + bounds.maxZ) / 2 - centerZ)
          wanted.push({ key, coord, coverage, priority })
        }
        if (entry) {
          ready.push(entry)
        } else {
          const ancestor = ancestorOf(coord)
          if (ancestor) fallbacks.set(ancestor.key, ancestor)
        }
      }
      wantedByConsumer.set(consumer, wanted)

      const smoothing = ctx.imageSmoothingEnabled
      const quality = ctx.imageSmoothingQuality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      // Coarse stand-ins first so finer ready tiles paint over them.
      const sortedFallbacks = [...fallbacks.values()].sort((a, b) => b.coord.step - a.coord.step)
      for (const entry of sortedFallbacks) {
        touch(entry)
        drawTile(ctx, entry)
      }
      for (const entry of ready) {
        touch(entry)
        drawTile(ctx, entry)
      }
      ctx.imageSmoothingEnabled = smoothing
      ctx.imageSmoothingQuality = quality

      ctx.strokeStyle = MAP_RIVER_STROKE
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const minWidth = RIVER_MIN_PX / Math.max(pxPerUnit, 1e-6)
      for (const entry of ready) {
        for (const river of entry.rivers) {
          ctx.lineWidth = Math.max(river.width, minWidth)
          ctx.stroke(river.path)
        }
      }

      pump()
    },
    clearConsumer(consumer) {
      if (wantedByConsumer.delete(consumer)) pump()
    },
    get revision() {
      return revision
    },
    onTileReady(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    stats() {
      return { tiles: cache.size, bytes, inflight: inflight.size, wanted: mergedWanted().length }
    },
    dispose() {
      disposed = true
      for (const key of inflight.keys()) requester.cancel(key)
      inflight.clear()
      cache.clear()
      wantedByConsumer.clear()
      listeners.clear()
      bytes = 0
    },
  }
}
