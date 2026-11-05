import type {
  ChunkWorkerRequest,
  ChunkWorkerResponse,
} from './chunkHeightmapProtocol'
import { buildMapTile } from '../world/map/mapRasterTile'
import { computeChunkCrops } from './chunkCrops'
import { clearCemeteryPlots, clearVegetationAroundOldTrees, computeChunkEnvironment } from './chunkEnvironment'
import { computeChunkTile } from './chunkHeightmap'
import { computeChunkItems } from './chunkItems'
import { computeChunkMeshData } from './chunkMeshData'
import { computeChunkVegetation } from './chunkVegetation'
import { computeFarTile } from './farTile'
import { computeChunkGrass, GRASS_SPECIES_ORDER, type GrassChunkData } from './grassPlacement'
import { sampleRawFloorRows, WORLD_HYDROLOGY_GRID } from './worldHydrology'
import { installWorldHydrology, retainOnlyWorldHydrology } from './worldHydrologyRegistry'
import { scanWorldKnowledge } from './worldKnowledgeScan'

// `self` is cast rather than adding the `webworker` TS lib, which can't coexist
// with the main thread's `dom` lib in this project's single tsconfig.
const ctx = self as unknown as {
  postMessage: (message: ChunkWorkerResponse, transfer: Transferable[]) => void
  onmessage: ((event: MessageEvent<ChunkWorkerRequest>) => void) | null
}

/** Every bucket's typed arrays, zero-copy transferred back to the main
 *  thread — the request's tile grids ride as structured-clone copies
 *  instead (see `ChunkWorkerPool`'s `requestChunkGrass`), since the main
 *  thread needs to keep its own `tile.heights` etc. */
function grassTransferList(grass: GrassChunkData): Transferable[] {
  const transfer: Transferable[] = []
  for (const id of GRASS_SPECIES_ORDER) {
    const bucket = grass[id]
    if (!bucket) continue
    transfer.push(
      bucket.matrices.buffer,
      bucket.phases.buffer,
      bucket.baseColors.buffer,
      bucket.tipColors.buffer,
      bucket.windFactors.buffer,
    )
  }
  return transfer
}

ctx.onmessage = ({ data }) => {
  if (data.kind === 'installHydrology') {
    try {
      // Replace semantics (review 030 F3): a worker holds the hydrology of the current world only.
      installWorldHydrology(data.hydrologyId, data.data)
      retainOnlyWorldHydrology(data.hydrologyId)
    } catch (err) {
      console.error('[chunkHeightmap.worker] hydrology install failed', err)
    }
    return
  }
  const { id, kind } = data
  try {
    if (kind === 'tile') {
      const { params } = data
      const tile = computeChunkTile(params)
      const {
        heights,
        floorHeights,
        biomes,
        bodyScale,
        continentalness,
        mountainRidge,
        moistureRegion,
        roadTint,
      } = tile
      const vegetation = computeChunkVegetation({ cx: params.cx, cz: params.cz }, tile, params)
      const items = computeChunkItems({ cx: params.cx, cz: params.cz }, tile, params, vegetation)
      const environment = computeChunkEnvironment({ cx: params.cx, cz: params.cz }, tile, params, vegetation)
      const treeCleared = clearVegetationAroundOldTrees(vegetation, environment)
      const { vegetation: clearedVegetation, environment: clearedEnvironment } = clearCemeteryPlots(treeCleared, environment)
      const crops = computeChunkCrops({ cx: params.cx, cz: params.cz }, tile, params)
      ctx.postMessage(
        {
          kind: 'tile',
          id,
          ok: true,
          heights,
          floorHeights,
          biomes,
          bodyScale,
          continentalness,
          mountainRidge,
          moistureRegion,
          roadTint,
          vegetation: clearedVegetation,
          items,
          environment: clearedEnvironment,
          crops,
        },
        [
          heights.buffer,
          floorHeights.buffer,
          biomes.buffer,
          bodyScale.buffer,
          continentalness.buffer,
          mountainRidge.buffer,
          moistureRegion.buffer,
          roadTint.buffer,
        ],
      )
    } else if (kind === 'grass') {
      const { params } = data
      const grass = computeChunkGrass(params, params.grids)
      ctx.postMessage({ kind: 'grass', id, ok: true, grass }, grassTransferList(grass))
    } else if (kind === 'worldKnowledge') {
      const result = scanWorldKnowledge(data.params)
      ctx.postMessage({ kind: 'worldKnowledge', id, ok: true, result }, [])
    } else if (kind === 'hydrologyRows') {
      const rows = sampleRawFloorRows(data.params, WORLD_HYDROLOGY_GRID, data.rowStart, data.rowEnd)
      ctx.postMessage({ kind: 'hydrologyRows', id, ok: true, rows }, [rows.buffer])
    } else if (kind === 'mapTile') {
      const tile = buildMapTile(data.params)
      ctx.postMessage(
        { kind: 'mapTile', id, ok: true, tile },
        [tile.heights.buffer, tile.floors.buffer, tile.classes.buffer, tile.riverPoints.buffer, tile.riverRuns.buffer],
      )
    } else if (kind === 'farTile') {
      const tile = computeFarTile(data.params)
      ctx.postMessage({ kind: 'farTile', id, ok: true, tile }, [tile.y.buffer, tile.normal.buffer, tile.color.buffer, tile.canopy.buffer])
    } else {
      const { params } = data
      const meshData = computeChunkMeshData(params)
      ctx.postMessage(
        { kind: 'mesh', id, ok: true, ...meshData },
        [
          meshData.positionY.buffer,
          meshData.normal.buffer,
          meshData.color.buffer,
          meshData.bareGround.buffer,
        ],
      )
    }
  } catch (err) {
    ctx.postMessage(
      { kind, id, ok: false, error: err instanceof Error ? err.message : String(err) },
      [],
    )
  }
}
