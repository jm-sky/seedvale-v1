import type { MapTileData, MapTileRequest } from '../world/map/mapRasterTile'
import type { ChunkTileParams, RawSampleParams } from './chunkHeightmap'
import type {
  ChunkTileResult,
  ChunkWorkerJobRequest,
  ChunkWorkerRequest,
  ChunkWorkerResponse,
  GrassRequestParams,
} from './chunkHeightmapProtocol'
import type { ChunkMeshData, ChunkMeshDataParams } from './chunkMeshData'
import type { FarTileData, FarTileRequest } from './farTile'
import type { GrassChunkData } from './grassPlacement'
import type { WorldHydrology } from './worldHydrology'
import type { WorldKnowledgeScanResult, WorldKnowledgeWorkerParams } from './worldKnowledgeScan'
import { getMonitor } from '../perf/active'

export class HeightmapGenerationCancelledError extends Error {
  constructor() {
    super('Heightmap generation superseded by a newer request')
    this.name = 'HeightmapGenerationCancelledError'
  }
}

export function isChunkWorkerCancelledError(error: unknown): boolean {
  return error instanceof HeightmapGenerationCancelledError
}

/** Test seam — production uses a real module Worker. */
export type ChunkWorkerLike = {
  postMessage(message: ChunkWorkerRequest): void
  terminate(): void
  onmessage: ((event: MessageEvent<ChunkWorkerResponse>) => void) | null
  onerror: ((event: { message?: string; filename?: string; lineno?: number; colno?: number }) => void) | null
}

export type ChunkWorkerPoolOptions = {
  createWorker?: () => ChunkWorkerLike
}

// Chunk tiles are small and are constantly requested-then-abandoned as the player
// moves. Terminating and respawning an OS worker thread per abandoned chunk would
// be wasteful and adds latency spikes, so this pool keeps its workers alive for
// its whole lifetime and cancels by discarding the eventual result instead.

export type ChunkWorkerPool = {
  requestTile(key: string, params: ChunkTileParams): Promise<ChunkTileResult>
  cancelTile(key: string): void
  /** Grass placement (plan 086) — a lower-priority job kind on the same pool.
   *  Terrain tiles are what the player stands on; grass is decorative and
   *  must never starve tile generation (see `pump()`). */
  requestGrass(key: string, params: GrassRequestParams): Promise<GrassChunkData>
  cancelGrass(key: string): void
  /** Chunk render mesh data (plan world-terrain-004) — same priority as
   *  `tile`: a chunk isn't visually ready until its mesh attaches, so this
   *  must not be starved by grass. */
  requestMesh(key: string, params: ChunkMeshDataParams): Promise<ChunkMeshData>
  cancelMesh(key: string): void
  /**
   * Bounded static-world knowledge scan (plan quests-progression-047).
   * Below tile/mesh, above grass; shares background headroom so research
   * never consumes every worker while terrain is waiting.
   * @domain world-terrain
   */
  requestWorldKnowledge(key: string, params: WorldKnowledgeWorkerParams): Promise<WorldKnowledgeScanResult>
  cancelWorldKnowledge(key: string): void
  /**
   * Map raster tile (plan ui-input-046). Background kind below world
   * knowledge, above grass — the map is UI, never what the player stands on.
   * @domain ui-input
   */
  requestMapTile(key: string, params: MapTileRequest): Promise<MapTileData>
  cancelMapTile(key: string): void
  /**
   * Far-terrain tile (plan world-terrain-066 F1). Background kind alongside map tiles — it is presentation beyond the
   * streamed ring, never what the player stands on.
   * @domain world-terrain
   */
  requestFarTile(key: string, params: FarTileRequest): Promise<FarTileData>
  cancelFarTile(key: string): void
  /**
   * Installs global hydrology in every worker, now and in any worker created later (plan world-terrain-058 H2). A
   * worker handles messages in order, so every job posted after this call sees the data. Replace semantics (review 030
   * F3): installing an id drops every other id from the pool's record and, worker-side, from each worker's store, so
   * only the current world's hydrology is retained and a replacement worker receives just that one.
   * @domain world-terrain
   */
  installHydrology(hydrologyId: string, data: WorldHydrology): void
  /**
   * Raw floor rows `[rowStart, rowEnd)` of the hydrology grid, for boot-time strip sampling. Foreground priority
   * (boot waits for it), never cancelled by a newer request of another key.
   * @domain world-terrain
   */
  requestHydrologyRows(key: string, params: RawSampleParams, rowStart: number, rowEnd: number): Promise<Float32Array>
  dispose(): void
  readonly pendingCount: number
  readonly busyCount: number
}

type TileJob = {
  kind: 'tile'
  id: number
  key: string
  params: ChunkTileParams
  resolve: (data: ChunkTileResult) => void
  reject: (err: Error) => void
}

type GrassJob = {
  kind: 'grass'
  id: number
  key: string
  params: GrassRequestParams
  resolve: (data: GrassChunkData) => void
  reject: (err: Error) => void
}

type MeshJob = {
  kind: 'mesh'
  id: number
  key: string
  params: ChunkMeshDataParams
  resolve: (data: ChunkMeshData) => void
  reject: (err: Error) => void
}

type WorldKnowledgeJob = {
  kind: 'worldKnowledge'
  id: number
  key: string
  params: WorldKnowledgeWorkerParams
  queuedAt: number
  startedAt?: number
  resolve: (data: WorldKnowledgeScanResult) => void
  reject: (err: Error) => void
}

type MapTileJob = {
  kind: 'mapTile'
  id: number
  key: string
  params: MapTileRequest
  resolve: (data: MapTileData) => void
  reject: (err: Error) => void
}

type FarTileJob = {
  kind: 'farTile'
  id: number
  key: string
  params: FarTileRequest
  resolve: (data: FarTileData) => void
  reject: (err: Error) => void
}

type HydrologyRowsJob = {
  kind: 'hydrologyRows'
  id: number
  key: string
  params: RawSampleParams
  rowStart: number
  rowEnd: number
  resolve: (data: Float32Array) => void
  reject: (err: Error) => void
}

type ChunkJob = TileJob | GrassJob | MeshJob | WorldKnowledgeJob | MapTileJob | FarTileJob | HydrologyRowsJob

function createChunkWorker(): ChunkWorkerLike {
  return new Worker(new URL('./chunkHeightmap.worker.ts', import.meta.url), {
    type: 'module',
  }) as ChunkWorkerLike
}

export function defaultChunkWorkerCount(): number {
  const hc = navigator.hardwareConcurrency
  return Math.min(6, Math.max(2, (hc ?? 4) - 1))
}

function recordWorldKnowledgeTimings(job: WorldKnowledgeJob, result: WorldKnowledgeScanResult): void {
  if (!getMonitor().isEnabled()) return
  const now = performance.now()
  const startedAt = job.startedAt ?? now
  const queueMs = startedAt - job.queuedAt
  const totalMs = now - job.queuedAt
  console.info(`[PERF:PROPS] debug: worldKnowledge:queue ${queueMs.toFixed(1)} ms`)
  console.info(`[PERF:PROPS] debug: worldKnowledge:worker ${result.elapsedMs.toFixed(1)} ms`)
  console.info(`[PERF:PROPS] debug: worldKnowledge:total ${totalMs.toFixed(1)} ms`)
}

function toRequest(job: ChunkJob): ChunkWorkerJobRequest {
  if (job.kind === 'hydrologyRows') return { kind: 'hydrologyRows', id: job.id, params: job.params, rowStart: job.rowStart, rowEnd: job.rowEnd }
  if (job.kind === 'tile') return { kind: 'tile', id: job.id, params: job.params }
  if (job.kind === 'mesh') return { kind: 'mesh', id: job.id, params: job.params }
  if (job.kind === 'worldKnowledge') return { kind: 'worldKnowledge', id: job.id, params: job.params }
  if (job.kind === 'mapTile') return { kind: 'mapTile', id: job.id, params: job.params }
  if (job.kind === 'farTile') return { kind: 'farTile', id: job.id, params: job.params }
  return { kind: 'grass', id: job.id, params: job.params }
}

function isBackgroundJob(job: ChunkJob): boolean {
  return job.kind === 'grass' || job.kind === 'worldKnowledge' || job.kind === 'mapTile' || job.kind === 'farTile'
}

export function createChunkWorkerPool(
  size = defaultChunkWorkerCount(),
  options: ChunkWorkerPoolOptions = {},
): ChunkWorkerPool {
  const createWorker = options.createWorker ?? createChunkWorker
  const workers: ChunkWorkerLike[] = []
  const free: ChunkWorkerLike[] = []
  // Tile/mesh outrank world knowledge; knowledge outranks grass. Background
  // kinds share headroom so they never occupy every worker (plan quests-progression-047).
  const queueHydrologyRows: HydrologyRowsJob[] = []
  const queueTile: TileJob[] = []
  const queueMesh: MeshJob[] = []
  const queueWorldKnowledge: WorldKnowledgeJob[] = []
  const queueMapTile: MapTileJob[] = []
  const queueFarTile: FarTileJob[] = []
  const queueGrass: GrassJob[] = []
  const installedHydrology = new Map<string, WorldHydrology>()
  const inflight = new Map<number, ChunkJob>()
  const keyToId = new Map<string, number>()
  const workerJob = new Map<ChunkWorkerLike, number>()
  /** Jobs already retried once after their worker died (see `worker.onerror`). */
  const retriedJobs = new Set<number>()
  /** Replacement budget for dead workers, so a worker that can never load does not respawn forever. */
  let respawnsLeft = size * 2
  let nextId = 0

  const maxInflightBackground = Math.max(1, size - 1)

  function inflightBackgroundCount(): number {
    let count = 0
    for (const job of inflight.values()) if (isBackgroundJob(job)) count++
    return count
  }

  function canStartBackground(): boolean {
    return inflightBackgroundCount() < maxInflightBackground
  }

  function pump(): void {
    if (workers.length === 0) rejectQueued(() => new Error('chunk worker pool has no live workers'))
    while (free.length > 0) {
      let job: ChunkJob | undefined
      if (queueHydrologyRows.length > 0) {
        job = queueHydrologyRows.shift()
      } else if (queueTile.length > 0) {
        job = queueTile.shift()
      } else if (queueMesh.length > 0) {
        job = queueMesh.shift()
      } else if (queueWorldKnowledge.length > 0 && canStartBackground()) {
        job = queueWorldKnowledge.shift()
      } else if (queueFarTile.length > 0 && canStartBackground()) {
        job = queueFarTile.shift()
      } else if (queueMapTile.length > 0 && canStartBackground()) {
        job = queueMapTile.shift()
      } else if (queueGrass.length > 0 && canStartBackground()) {
        job = queueGrass.shift()
      }
      if (!job) break
      const worker = free.pop()!
      inflight.set(job.id, job)
      workerJob.set(worker, job.id)
      if (job.kind === 'worldKnowledge') job.startedAt = performance.now()
      worker.postMessage(toRequest(job))
    }
  }

  function settleJob(msgId: number): ChunkJob | undefined {
    const job = inflight.get(msgId)
    inflight.delete(msgId)
    retriedJobs.delete(msgId)
    if (job) {
      const namespacedKey = `${job.kind}:${job.key}`
      if (keyToId.get(namespacedKey) === msgId) {
        keyToId.delete(namespacedKey)
      }
    }
    return job
  }

  function attach(worker: ChunkWorkerLike): void {
    worker.onmessage = (event: MessageEvent<ChunkWorkerResponse>) => {
      const msg = event.data
      const job = settleJob(msg.id)
      workerJob.delete(worker)
      free.push(worker)
      if (job) {
        if (msg.ok) {
          if (job.kind === 'tile' && msg.kind === 'tile') {
            job.resolve({
              heights: msg.heights,
              floorHeights: msg.floorHeights,
              biomes: msg.biomes,
              bodyScale: msg.bodyScale,
              continentalness: msg.continentalness,
              mountainRidge: msg.mountainRidge,
              moistureRegion: msg.moistureRegion,
              roadTint: msg.roadTint,
              vegetation: msg.vegetation,
              items: msg.items,
              environment: msg.environment,
              crops: msg.crops,
            })
          } else if (job.kind === 'grass' && msg.kind === 'grass') {
            job.resolve(msg.grass)
          } else if (job.kind === 'mesh' && msg.kind === 'mesh') {
            job.resolve({
              positionY: msg.positionY,
              normal: msg.normal,
              color: msg.color,
              bareGround: msg.bareGround,
            })
          } else if (job.kind === 'worldKnowledge' && msg.kind === 'worldKnowledge') {
            recordWorldKnowledgeTimings(job, msg.result)
            job.resolve(msg.result)
          } else if (job.kind === 'hydrologyRows' && msg.kind === 'hydrologyRows') {
            job.resolve(msg.rows)
          } else if (job.kind === 'mapTile' && msg.kind === 'mapTile') {
            job.resolve(msg.tile)
          } else if (job.kind === 'farTile' && msg.kind === 'farTile') {
            job.resolve(msg.tile)
          } else {
            job.reject(new Error(`chunk worker kind mismatch (${job.kind})`))
          }
        } else {
          job.reject(new Error(msg.error))
        }
      }
      pump()
    }
    worker.onerror = (event) => {
      // The worker's own handler catches job errors and answers `ok: false`, so an `error` event means the worker
      // is dead or unusable — e.g. under Vite dev a module worker whose ~450-module graph load is aborted fires a
      // bare `Event` (Q80). Jobs posted to it would never answer: replace it and retry its job once.
      console.error('[chunkWorkerPool] worker error — replacing worker', event.message, event.filename, event.lineno, event.colno)
      const jobId = workerJob.get(worker)
      retire(worker)
      if (respawnsLeft > 0) {
        respawnsLeft--
        spawn()
      }
      const job = jobId === undefined ? undefined : inflight.get(jobId)
      if (job) {
        if (!retriedJobs.has(job.id) && workers.length > 0) {
          retriedJobs.add(job.id)
          inflight.delete(job.id)
          requeueFront(job)
        } else {
          settleJob(job.id)?.reject(new Error(event.message || 'chunk worker error'))
        }
      }
      pump()
    }
  }

  /** Drops a dead worker from the pool; late messages from it are ignored. */
  function retire(worker: ChunkWorkerLike): void {
    worker.onmessage = null
    worker.onerror = null
    worker.terminate()
    workerJob.delete(worker)
    const index = workers.indexOf(worker)
    if (index !== -1) workers.splice(index, 1)
    const freeIndex = free.indexOf(worker)
    if (freeIndex !== -1) free.splice(freeIndex, 1)
  }

  function requeueFront(job: ChunkJob): void {
    if (job.kind === 'hydrologyRows') queueHydrologyRows.unshift(job)
    else if (job.kind === 'tile') queueTile.unshift(job)
    else if (job.kind === 'mesh') queueMesh.unshift(job)
    else if (job.kind === 'worldKnowledge') queueWorldKnowledge.unshift(job)
    else if (job.kind === 'mapTile') queueMapTile.unshift(job)
    else if (job.kind === 'farTile') queueFarTile.unshift(job)
    else queueGrass.unshift(job)
  }

  function rejectQueued(makeError: () => Error): void {
    const queues: ChunkJob[][] = [queueHydrologyRows, queueTile, queueMesh, queueWorldKnowledge, queueFarTile, queueMapTile, queueGrass]
    for (const queue of queues) {
      for (const job of queue) job.reject(makeError())
      queue.length = 0
    }
  }

  /** The one worker creation path: a worker created at any time gets the installed hydrology before any job. */
  function spawn(): void {
    const worker = createWorker()
    attach(worker)
    for (const [hydrologyId, data] of installedHydrology) worker.postMessage({ kind: 'installHydrology', hydrologyId, data })
    workers.push(worker)
    free.push(worker)
  }

  for (let i = 0; i < size; i++) spawn()

  function cancelByNamespacedKey(namespacedKey: string): void {
    const id = keyToId.get(namespacedKey)
    if (id === undefined) return
    keyToId.delete(namespacedKey)
    const hydrologyRowsIndex = queueHydrologyRows.findIndex((job) => job.id === id)
    if (hydrologyRowsIndex !== -1) {
      const [job] = queueHydrologyRows.splice(hydrologyRowsIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const tileIndex = queueTile.findIndex((job) => job.id === id)
    if (tileIndex !== -1) {
      const [job] = queueTile.splice(tileIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const grassIndex = queueGrass.findIndex((job) => job.id === id)
    if (grassIndex !== -1) {
      const [job] = queueGrass.splice(grassIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const meshIndex = queueMesh.findIndex((job) => job.id === id)
    if (meshIndex !== -1) {
      const [job] = queueMesh.splice(meshIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const knowledgeIndex = queueWorldKnowledge.findIndex((job) => job.id === id)
    if (knowledgeIndex !== -1) {
      const [job] = queueWorldKnowledge.splice(knowledgeIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const farTileIndex = queueFarTile.findIndex((job) => job.id === id)
    if (farTileIndex !== -1) {
      const [job] = queueFarTile.splice(farTileIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const mapTileIndex = queueMapTile.findIndex((job) => job.id === id)
    if (mapTileIndex !== -1) {
      const [job] = queueMapTile.splice(mapTileIndex, 1)
      job!.reject(new HeightmapGenerationCancelledError())
      return
    }
    const job = inflight.get(id)
    if (job) {
      inflight.delete(id)
      retriedJobs.delete(id)
      job.reject(new HeightmapGenerationCancelledError())
    }
  }

  function cancelTile(key: string): void {
    cancelByNamespacedKey(`tile:${key}`)
  }

  function cancelGrass(key: string): void {
    cancelByNamespacedKey(`grass:${key}`)
  }

  function cancelMesh(key: string): void {
    cancelByNamespacedKey(`mesh:${key}`)
  }

  function cancelWorldKnowledge(key: string): void {
    cancelByNamespacedKey(`worldKnowledge:${key}`)
  }

  function requestTile(key: string, params: ChunkTileParams): Promise<ChunkTileResult> {
    cancelTile(key)
    const id = nextId++
    keyToId.set(`tile:${key}`, id)
    return new Promise<ChunkTileResult>((resolve, reject) => {
      queueTile.push({ kind: 'tile', id, key, params, resolve, reject })
      pump()
    })
  }

  function requestGrass(key: string, params: GrassRequestParams): Promise<GrassChunkData> {
    cancelGrass(key)
    const id = nextId++
    keyToId.set(`grass:${key}`, id)
    return new Promise<GrassChunkData>((resolve, reject) => {
      queueGrass.push({ kind: 'grass', id, key, params, resolve, reject })
      pump()
    })
  }

  function requestMesh(key: string, params: ChunkMeshDataParams): Promise<ChunkMeshData> {
    cancelMesh(key)
    const id = nextId++
    keyToId.set(`mesh:${key}`, id)
    return new Promise<ChunkMeshData>((resolve, reject) => {
      queueMesh.push({ kind: 'mesh', id, key, params, resolve, reject })
      pump()
    })
  }

  function requestWorldKnowledge(
    key: string,
    params: WorldKnowledgeWorkerParams,
  ): Promise<WorldKnowledgeScanResult> {
    cancelWorldKnowledge(key)
    const id = nextId++
    keyToId.set(`worldKnowledge:${key}`, id)
    return new Promise<WorldKnowledgeScanResult>((resolve, reject) => {
      queueWorldKnowledge.push({
        kind: 'worldKnowledge',
        id,
        key,
        params,
        queuedAt: performance.now(),
        resolve,
        reject,
      })
      pump()
    })
  }

  function cancelMapTile(key: string): void {
    cancelByNamespacedKey(`mapTile:${key}`)
  }

  function requestMapTile(key: string, params: MapTileRequest): Promise<MapTileData> {
    cancelMapTile(key)
    const id = nextId++
    keyToId.set(`mapTile:${key}`, id)
    return new Promise<MapTileData>((resolve, reject) => {
      queueMapTile.push({ kind: 'mapTile', id, key, params, resolve, reject })
      pump()
    })
  }

  function cancelFarTile(key: string): void {
    cancelByNamespacedKey(`farTile:${key}`)
  }

  function requestFarTile(key: string, params: FarTileRequest): Promise<FarTileData> {
    cancelFarTile(key)
    const id = nextId++
    keyToId.set(`farTile:${key}`, id)
    return new Promise<FarTileData>((resolve, reject) => {
      queueFarTile.push({ kind: 'farTile', id, key, params, resolve, reject })
      pump()
    })
  }

  function installHydrology(hydrologyId: string, data: WorldHydrology): void {
    if (installedHydrology.size === 1 && installedHydrology.get(hydrologyId) === data) return
    installedHydrology.clear()
    installedHydrology.set(hydrologyId, data)
    for (const worker of workers) worker.postMessage({ kind: 'installHydrology', hydrologyId, data })
  }

  function requestHydrologyRows(key: string, params: RawSampleParams, rowStart: number, rowEnd: number): Promise<Float32Array> {
    cancelByNamespacedKey(`hydrologyRows:${key}`)
    const id = nextId++
    keyToId.set(`hydrologyRows:${key}`, id)
    return new Promise<Float32Array>((resolve, reject) => {
      queueHydrologyRows.push({ kind: 'hydrologyRows', id, key, params, rowStart, rowEnd, resolve, reject })
      pump()
    })
  }

  function dispose(): void {
    for (const job of queueHydrologyRows) job.reject(new HeightmapGenerationCancelledError())
    queueHydrologyRows.length = 0
    installedHydrology.clear()
    for (const job of queueTile) job.reject(new HeightmapGenerationCancelledError())
    queueTile.length = 0
    for (const job of queueMesh) job.reject(new HeightmapGenerationCancelledError())
    queueMesh.length = 0
    for (const job of queueWorldKnowledge) job.reject(new HeightmapGenerationCancelledError())
    queueWorldKnowledge.length = 0
    for (const job of queueMapTile) job.reject(new HeightmapGenerationCancelledError())
    queueMapTile.length = 0
    for (const job of queueFarTile) job.reject(new HeightmapGenerationCancelledError())
    queueFarTile.length = 0
    for (const job of queueGrass) job.reject(new HeightmapGenerationCancelledError())
    queueGrass.length = 0
    for (const job of inflight.values()) job.reject(new HeightmapGenerationCancelledError())
    inflight.clear()
    retriedJobs.clear()
    keyToId.clear()
    workerJob.clear()
    for (const worker of workers) worker.terminate()
    workers.length = 0
    free.length = 0
  }

  return {
    requestTile,
    cancelTile,
    requestGrass,
    cancelGrass,
    requestMesh,
    cancelMesh,
    requestWorldKnowledge,
    cancelWorldKnowledge,
    requestMapTile,
    cancelMapTile,
    requestFarTile,
    cancelFarTile,
    installHydrology,
    requestHydrologyRows,
    dispose,
    get pendingCount() {
      return queueHydrologyRows.length + queueTile.length + queueMesh.length + queueWorldKnowledge.length + queueFarTile.length + queueMapTile.length + queueGrass.length
    },
    get busyCount() {
      return inflight.size
    },
  }
}

let chunkPool: ChunkWorkerPool | null = null
function getChunkPool(): ChunkWorkerPool {
  if (!chunkPool) chunkPool = createChunkWorkerPool()
  return chunkPool
}

export function requestChunkTile(
  key: string,
  params: ChunkTileParams,
): Promise<ChunkTileResult> {
  return getChunkPool().requestTile(key, params)
}

export function cancelChunkTile(key: string): void {
  chunkPool?.cancelTile(key)
}

export function requestChunkGrass(
  key: string,
  params: GrassRequestParams,
): Promise<GrassChunkData> {
  return getChunkPool().requestGrass(key, params)
}

export function cancelChunkGrass(key: string): void {
  chunkPool?.cancelGrass(key)
}

export function requestChunkMesh(
  key: string,
  params: ChunkMeshDataParams,
): Promise<ChunkMeshData> {
  return getChunkPool().requestMesh(key, params)
}

export function cancelChunkMesh(key: string): void {
  chunkPool?.cancelMesh(key)
}

export function requestChunkWorldKnowledge(
  key: string,
  params: WorldKnowledgeWorkerParams,
): Promise<WorldKnowledgeScanResult> {
  return getChunkPool().requestWorldKnowledge(key, params)
}

export function cancelChunkWorldKnowledge(key: string): void {
  chunkPool?.cancelWorldKnowledge(key)
}

export function requestChunkMapTile(key: string, params: MapTileRequest): Promise<MapTileData> {
  return getChunkPool().requestMapTile(key, params)
}

export function cancelChunkMapTile(key: string): void {
  chunkPool?.cancelMapTile(key)
}

export function requestChunkFarTile(key: string, params: FarTileRequest): Promise<FarTileData> {
  return getChunkPool().requestFarTile(key, params)
}

export function cancelChunkFarTile(key: string): void {
  chunkPool?.cancelFarTile(key)
}

export function installChunkWorkerHydrology(hydrologyId: string, data: WorldHydrology): void {
  getChunkPool().installHydrology(hydrologyId, data)
}

export function requestChunkHydrologyRows(
  key: string,
  params: RawSampleParams,
  rowStart: number,
  rowEnd: number,
): Promise<Float32Array> {
  return getChunkPool().requestHydrologyRows(key, params, rowStart, rowEnd)
}

export function disposeChunkWorkerPool(): void {
  chunkPool?.dispose()
  chunkPool = null
}
