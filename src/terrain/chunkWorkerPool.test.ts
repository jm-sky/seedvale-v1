import { describe, expect, it } from 'vitest'
import type { ChunkTileParams, RawSampleParams } from './chunkHeightmap'
import type { ChunkWorkerJobRequest, ChunkWorkerRequest, ChunkWorkerResponse, GrassRequestParams } from './chunkHeightmapProtocol'
import type { ChunkMeshDataParams } from './chunkMeshData'
import type { WorldHydrology } from './worldHydrology'
import type { WorldKnowledgeWorkerParams } from './worldKnowledgeScan'
import {
  type ChunkWorkerLike,
  createChunkWorkerPool,
  HeightmapGenerationCancelledError,
} from './chunkWorkerPool'
import { UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

type ControllableWorker = ChunkWorkerLike & {
  /** Last job request (install messages are only in `posted`). */
  last: ChunkWorkerJobRequest | null
  terminated: boolean
  completeOk(): void
  completeError(error: string): void
  /** Fires the worker `error` event (a dead worker, e.g. an aborted module-graph load). */
  die(): void
}

type Posted = { worker: ControllableWorker, request: ChunkWorkerRequest }

function createControllableWorker(posted: Posted[]): ControllableWorker {
  const worker: ControllableWorker = {
    onmessage: null,
    onerror: null,
    terminated: false,
    last: null,
    postMessage(message) {
      if (message.kind !== 'installHydrology') worker.last = message
      posted.push({ worker, request: message })
    },
    terminate() {
      worker.terminated = true
    },
    completeOk() {
      const request = worker.last
      if (!request || !worker.onmessage) return
      const response = (
        request.kind === 'hydrologyRows'
          ? { kind: 'hydrologyRows', id: request.id, ok: true, rows: new Float32Array([request.rowStart]) }
          : request.kind === 'worldKnowledge'
          ? { kind: 'worldKnowledge', id: request.id, ok: true, result: { hits: [], elapsedMs: 0 } }
          : request.kind === 'grass'
            ? { kind: 'grass', id: request.id, ok: true, grass: {} as never }
            : request.kind === 'mesh'
              ? {
                  kind: 'mesh',
                  id: request.id,
                  ok: true,
                  positionY: new Float32Array(),
                  normal: new Float32Array(),
                  color: new Float32Array(),
                  bareGround: new Float32Array(),
                }
              : {
                  kind: 'tile',
                  id: request.id,
                  ok: true,
                  heights: new Float32Array(),
                  floorHeights: new Float32Array(),
                  biomes: new Uint8Array(),
                  bodyScale: new Float32Array(),
                  continentalness: new Float32Array(),
                  mountainRidge: new Float32Array(),
                  moistureRegion: new Float32Array(),
                  roadTint: new Float32Array(),
                  vegetation: [],
                  items: [],
                  environment: [],
                  crops: [],
                }
      ) as ChunkWorkerResponse
      worker.onmessage({ data: response } as MessageEvent<ChunkWorkerResponse>)
    },
    die() {
      worker.onerror?.({})
    },
    completeError(error) {
      const request = worker.last
      if (!request || !worker.onmessage) return
      worker.onmessage({
        data: { kind: request.kind, id: request.id, ok: false, error },
      } as MessageEvent<ChunkWorkerResponse>)
    },
  }
  return worker
}

const dummyTile = {} as ChunkTileParams
const dummyGrass = {} as GrassRequestParams
const dummyMesh = {} as ChunkMeshDataParams
const dummyKnowledge = {
  queryKind: 'nearest-landmark',
  landmarkKinds: ['monolith'],
  originX: 0,
  originZ: 0,
  maxChunkRadius: 1,
  terrain: {
    hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
    chunkSize: 64,
    resolution: 17,
    seed: 1,
    heightScale: 18,
    waterLevel: 0.45,
    noiseScale: 120,
    detailAmplitude: 0.55,
    hillsScale: 420,
    hillsAmplitude: 0.28,
    hillsFbm: { octaves: 1, persistence: 0.5, lacunarity: 2, exponentiation: 1 },
    fbm: { octaves: 1, persistence: 0.5, lacunarity: 2, exponentiation: 1 },
    biome: { noiseScale: 96, fbm: { octaves: 1, persistence: 0.5, lacunarity: 2, exponentiation: 1 } },
    region: {} as WorldKnowledgeWorkerParams['terrain']['region'],
    vegetationSpeciesCount: { tree: 1, bush: 1, cactus: 1, reed: 1, fern: 1, lily: 1, seaweed: 1 },
    homeChunks: [],
    localSearchRadius: 56,
  },
} satisfies WorldKnowledgeWorkerParams

describe('chunkWorkerPool world-knowledge scheduling (plan quests-progression-047)', () => {
  it('lets a queued tile outrank queued world-knowledge after a background job completes', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const knowledge = pool.requestWorldKnowledge('a', dummyKnowledge)
    const tile = pool.requestTile('t', dummyTile)
    const laterKnowledge = pool.requestWorldKnowledge('b', dummyKnowledge)
    expect(posted).toHaveLength(1)
    expect(posted[0]?.request.kind).toBe('worldKnowledge')
    posted[0]!.worker.completeOk()
    await knowledge
    expect(posted[1]?.request.kind).toBe('tile')
    posted[1]!.worker.completeOk()
    await tile
    posted[2]!.worker.completeOk()
    await laterKnowledge
    pool.dispose()
  })

  it('starts world knowledge before grass when both are queued', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const blocker = pool.requestTile('t', dummyTile)
    const grass = pool.requestGrass('g', dummyGrass)
    const knowledge = pool.requestWorldKnowledge('k', dummyKnowledge)
    posted[0]!.worker.completeOk()
    await blocker
    expect(posted[1]?.request.kind).toBe('worldKnowledge')
    posted[1]!.worker.completeOk()
    await knowledge
    posted[2]!.worker.completeOk()
    await grass
    pool.dispose()
  })

  it('keeps a worker free for terrain while background research is queued', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(2, { createWorker: () => createControllableWorker(posted) })
    const first = pool.requestWorldKnowledge('a', dummyKnowledge)
    const second = pool.requestWorldKnowledge('b', dummyKnowledge)
    expect(posted).toHaveLength(1)
    expect(pool.busyCount).toBe(1)
    expect(pool.pendingCount).toBe(1)
    const tile = pool.requestTile('t', dummyTile)
    expect(posted).toHaveLength(2)
    expect(posted[1]?.request.kind).toBe('tile')
    pool.dispose()
    await Promise.allSettled([first, second, tile])
  })

  it('rejects cancelled and disposed world-knowledge jobs', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const pending = pool.requestWorldKnowledge('queued', dummyKnowledge)
    const queued = pool.requestWorldKnowledge('later', dummyKnowledge)
    pool.cancelWorldKnowledge('later')
    await expect(queued).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
    const disposing = pool.requestWorldKnowledge('die', dummyKnowledge)
    pool.dispose()
    await expect(pending).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
    await expect(disposing).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
  })

  it('discards a stale in-flight result after cancel', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const first = pool.requestWorldKnowledge('same', dummyKnowledge)
    pool.cancelWorldKnowledge('same')
    await expect(first).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
    posted[0]!.worker.completeOk()
    expect(pool.busyCount).toBe(0)
    pool.dispose()
  })

  it('keeps a cancelled running background job counted until its worker answers (Q176)', async () => {
    const posted: Posted[] = []
    // 3 workers → background headroom 2, one worker always left for terrain.
    const pool = createChunkWorkerPool(3, { createWorker: () => createControllableWorker(posted) })
    const g1 = pool.requestGrass('g1', dummyGrass)
    const g2 = pool.requestGrass('g2', dummyGrass)
    expect(posted).toHaveLength(2)
    const orphanWorker = posted[0]!.worker
    pool.cancelGrass('g1')
    await expect(g1).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
    // The cancelled job still occupies its worker: physical occupancy, no phantom background slot.
    expect(pool.busyCount).toBe(2)
    const g3 = pool.requestGrass('g3', dummyGrass)
    expect(posted).toHaveLength(2)
    expect(pool.pendingCount).toBe(1)
    // Foreground work still gets the reserved worker.
    const tile = pool.requestTile('t', dummyTile)
    expect(posted).toHaveLength(3)
    expect(posted[2]?.request.kind).toBe('tile')
    // The cancelled worker's late response is discarded and releases the slot → queued grass starts.
    orphanWorker.completeOk()
    expect(pool.busyCount).toBe(3)
    expect(posted).toHaveLength(4)
    expect(posted[3]?.request.kind).toBe('grass')
    pool.dispose()
    await Promise.allSettled([g2, g3, tile])
  })

  it('starts a queued mesh before queued world-knowledge after a tile completes', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const blocker = pool.requestTile('t', dummyTile)
    const knowledge = pool.requestWorldKnowledge('k', dummyKnowledge)
    const mesh = pool.requestMesh('m', dummyMesh)
    posted[0]!.worker.completeOk()
    await blocker
    expect(posted[1]?.request.kind).toBe('mesh')
    posted[1]!.worker.completeOk()
    await mesh
    posted[2]!.worker.completeOk()
    await knowledge
    pool.dispose()
  })

  it('serializes a worldKnowledge protocol request, not a tile job', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => createControllableWorker(posted) })
    const pending = pool.requestWorldKnowledge('scan', dummyKnowledge)
    expect(posted[0]?.request).toMatchObject({
      kind: 'worldKnowledge',
      params: { queryKind: 'nearest-landmark', maxChunkRadius: 1 },
    })
    pool.dispose()
    await expect(pending).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
  })

  it('posts installHydrology to every worker and runs hydrology strips before queued tiles', async () => {
    const posted: Posted[] = []
    const pool = createChunkWorkerPool(2, { createWorker: () => createControllableWorker(posted) })
    const data = { version: 1 } as WorldHydrology
    pool.installHydrology('h-test', data)
    const installs = posted.filter((p) => p.request.kind === 'installHydrology')
    expect(installs).toHaveLength(2)
    expect(new Set(installs.map((p) => p.worker)).size).toBe(2)
    // Same data again is a no-op (no second structured clone per worker).
    pool.installHydrology('h-test', data)
    expect(posted.filter((p) => p.request.kind === 'installHydrology')).toHaveLength(2)

    const first = pool.requestTile('t1', dummyTile)
    const second = pool.requestTile('t2', dummyTile)
    const third = pool.requestTile('t3', dummyTile)
    const rows = pool.requestHydrologyRows('r', {} as RawSampleParams, 3, 5)
    // Both workers took tiles; the strip waits, then outranks the third tile.
    posted.filter((p) => p.request.kind === 'tile')[0]!.worker.completeOk()
    await first
    const job = posted.filter((p) => p.request.kind !== 'installHydrology').at(-1)!
    expect(job.request).toMatchObject({ kind: 'hydrologyRows', rowStart: 3, rowEnd: 5 })
    job.worker.completeOk()
    await expect(rows).resolves.toEqual(new Float32Array([3]))
    pool.dispose()
    await expect(second).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
    await expect(third).rejects.toBeInstanceOf(HeightmapGenerationCancelledError)
  })

  it('retains only the current hydrology: a replacement worker after install A then B receives only B (review 030 F3)', () => {
    const posted: Posted[] = []
    const created: ControllableWorker[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => { const w = createControllableWorker(posted); created.push(w); return w } })
    const a = { version: 1 } as WorldHydrology
    const b = { version: 2 } as WorldHydrology
    pool.installHydrology('h-a', a)
    pool.installHydrology('h-b', b)
    created[0]!.die()
    expect(created).toHaveLength(2)
    const installs = posted.filter((p) => p.worker === created[1] && p.request.kind === 'installHydrology')
    expect(installs.map((p) => (p.request as { hydrologyId: string }).hydrologyId)).toEqual(['h-b'])
    // Installing A again re-posts it (it was dropped), and drops B in turn.
    pool.installHydrology('h-a', a)
    created[1]!.die()
    const fresh = posted.filter((p) => p.worker === created[2] && p.request.kind === 'installHydrology')
    expect(fresh.map((p) => (p.request as { hydrologyId: string }).hydrologyId)).toEqual(['h-a'])
    pool.dispose()
  })

  it('replaces a dead worker and retries its job once on the fresh worker (Q80)', async () => {
    const posted: Posted[] = []
    const created: ControllableWorker[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => { const w = createControllableWorker(posted); created.push(w); return w } })
    const data = { version: 1 } as WorldHydrology
    pool.installHydrology('h-test', data)
    const rows = pool.requestHydrologyRows('r', {} as RawSampleParams, 0, 4)
    created[0]!.die()
    expect(created[0]!.terminated).toBe(true)
    expect(created).toHaveLength(2)
    // The replacement got the installed hydrology before the retried strip.
    const toFresh = posted.filter((p) => p.worker === created[1]).map((p) => p.request.kind)
    expect(toFresh).toEqual(['installHydrology', 'hydrologyRows'])
    created[1]!.completeOk()
    await expect(rows).resolves.toEqual(new Float32Array([0]))
    pool.dispose()
  })

  it('rejects a job whose retry also dies, and stops respawning after the budget', async () => {
    const posted: Posted[] = []
    const created: ControllableWorker[] = []
    const pool = createChunkWorkerPool(1, { createWorker: () => { const w = createControllableWorker(posted); created.push(w); return w } })
    const tile = pool.requestTile('t', dummyTile)
    created[0]!.die()
    created[1]!.die()
    await expect(tile).rejects.toThrow('chunk worker error')
    created[2]!.die()
    // Budget (2 × size) spent: no live worker left, queued work is rejected instead of hanging.
    expect(created).toHaveLength(3)
    await expect(pool.requestTile('t2', dummyTile)).rejects.toThrow('no live workers')
    expect(pool.pendingCount).toBe(0)
    pool.dispose()
  })
})
