import { beforeAll, describe, expect, it } from 'vitest'
import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import { createMapFogGrid } from '../../world/map/mapFogGrid'
import {
  MAP_TILE_SIDE,
  MapRasterClass,
  type MapTileData,
  type MapTileRequest,
} from '../../world/map/mapRasterTile'
import { createMapTerrainLayer, type MapCanvasLike, type MapTileRequester } from './mapTerrainLayer'
import { paintMapTilePixels } from './mapTerrainPaint'

beforeAll(() => {
  if (typeof globalThis.Path2D === 'undefined') {
    globalThis.Path2D = class {
      moveTo() {}
      lineTo() {}
    } as unknown as typeof Path2D
  }
})

const params = { waterLevel: 0.45, heightScale: 18 } as RawSampleParams

function tileData(request: MapTileRequest): MapTileData {
  const n = MAP_TILE_SIDE * MAP_TILE_SIDE
  return {
    step: request.step,
    tx: request.tx,
    tz: request.tz,
    heights: new Float32Array(n).fill(5),
    floors: new Float32Array(n).fill(5),
    classes: new Uint8Array(n).fill(MapRasterClass.Meadow),
    riverPoints: new Float32Array(0),
    riverRuns: new Uint32Array(0),
    elapsedMs: 0,
  }
}

function fakeRequester() {
  const pending = new Map<string, { request: MapTileRequest, resolve: (d: MapTileData) => void }>()
  const cancelled: string[] = []
  const requester: MapTileRequester = {
    request: (key, request) => new Promise((resolve) => pending.set(key, { request, resolve })),
    cancel: (key) => {
      cancelled.push(key)
      pending.delete(key)
    },
  }
  const complete = async (key: string) => {
    const job = pending.get(key)!
    pending.delete(key)
    job.resolve(tileData(job.request))
    await new Promise((r) => setTimeout(r, 0))
  }
  return { requester, pending, cancelled, complete }
}

const fakeCanvas = (): MapCanvasLike => ({
  getContext: () => ({
    createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    putImageData: () => {},
  }),
}) as unknown as MapCanvasLike

function fakeCtx() {
  const drawn: number[] = []
  const ctx = {
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low',
    drawImage: (..._args: unknown[]) => drawn.push(1),
    stroke: () => {},
  } as unknown as CanvasRenderingContext2D
  return { ctx, drawn }
}

describe('map terrain layer scheduling', () => {
  it('requests only tiles over discovered ground and draws them once ready', async () => {
    const fog = createMapFogGrid()
    fog.add(1, 1)
    const { requester, pending, complete } = fakeRequester()
    const layer = createMapTerrainLayer({ params, fog, requester, createCanvas: fakeCanvas })
    const { ctx, drawn } = fakeCtx()
    const rect = { minX: -200, maxX: 200, minZ: -200, maxZ: 200 }

    layer.draw(ctx, 'minimap', rect, 2, 1)
    expect([...pending.keys()]).toEqual(['2:0,0'])
    expect(pending.get('2:0,0')!.request.coverage).toEqual([[0, 0]])
    expect(drawn).toHaveLength(0)

    await complete('2:0,0')
    expect(layer.revision).toBe(1)
    layer.draw(ctx, 'minimap', rect, 2, 1)
    expect(drawn).toHaveLength(1)
    expect(pending.size).toBe(0)
  })

  it('uses a cached coarser tile while the finer one is pending', async () => {
    const fog = createMapFogGrid()
    fog.add(1, 1)
    const { requester, complete } = fakeRequester()
    const layer = createMapTerrainLayer({ params, fog, requester, createCanvas: fakeCanvas })
    const { ctx, drawn } = fakeCtx()
    const rect = { minX: 0, maxX: 100, minZ: 0, maxZ: 100 }
    layer.draw(ctx, 'worldMap', rect, 8, 0.3)
    await complete('8:0,0')
    layer.draw(ctx, 'worldMap', rect, 2, 1)
    expect(drawn).toHaveLength(1)
  })

  it('drops results from a previous world and cancels jobs nobody wants', async () => {
    const fog = createMapFogGrid()
    fog.add(1, 1)
    const { requester, pending, cancelled } = fakeRequester()
    const layer = createMapTerrainLayer({ params, fog, requester, createCanvas: fakeCanvas })
    const { ctx } = fakeCtx()
    layer.draw(ctx, 'worldMap', { minX: 0, maxX: 64, minZ: 0, maxZ: 64 }, 2, 1)
    const stale = pending.get('2:0,0')!
    layer.setParams({ ...params })
    expect(cancelled).toContain('2:0,0')
    stale.resolve(tileData(stale.request))
    await new Promise((r) => setTimeout(r, 0))
    expect(layer.stats().tiles).toBe(0)

    layer.draw(ctx, 'worldMap', { minX: 0, maxX: 64, minZ: 0, maxZ: 64 }, 2, 1)
    layer.clearConsumer('worldMap')
    expect(cancelled.filter((k) => k === '2:0,0')).toHaveLength(2)
  })

  it('rebuilds a tile when discovery reaches a new coverage block inside it', async () => {
    const fog = createMapFogGrid()
    fog.add(1, 1)
    const { requester, pending, complete } = fakeRequester()
    const layer = createMapTerrainLayer({ params, fog, requester, createCanvas: fakeCanvas })
    const { ctx } = fakeCtx()
    const rect = { minX: 0, maxX: 1024, minZ: 0, maxZ: 1024 }
    layer.draw(ctx, 'worldMap', rect, 16, 0.1)
    await complete('16:0,0')
    layer.draw(ctx, 'worldMap', rect, 16, 0.1)
    expect(pending.size).toBe(0)
    fog.add(40, 1) // second 256-unit block of the same step-16 tile
    layer.draw(ctx, 'worldMap', rect, 16, 0.1)
    expect(pending.get('16:0,0')!.request.coverage).toHaveLength(2)
  })
})

describe('paintMapTilePixels', () => {
  it('shades slopes facing the north-west light brighter and leaves unsampled pixels transparent', () => {
    const n = MAP_TILE_SIDE * MAP_TILE_SIDE
    const heights = new Float32Array(n)
    // Height rises towards +x/+z, i.e. slopes face the north-west light.
    for (let j = 0; j < MAP_TILE_SIDE; j++) for (let i = 0; i < MAP_TILE_SIDE; i++) heights[j * MAP_TILE_SIDE + i] = (i + j) * 0.2
    const classes = new Uint8Array(n).fill(MapRasterClass.Meadow)
    classes[0] = MapRasterClass.None
    const out = new Uint8ClampedArray(n * 4)
    paintMapTilePixels({ step: 2, heights, floors: heights, classes }, params, out)

    const flat = new Uint8ClampedArray(n * 4)
    const flatHeights = new Float32Array(n).fill(heights[33 * MAP_TILE_SIDE + 33]!)
    paintMapTilePixels({ step: 2, heights: flatHeights, floors: flatHeights, classes }, params, flat)

    const k = (33 * MAP_TILE_SIDE + 33) * 4
    expect(out[k + 1]!).toBeGreaterThan(flat[k + 1]!)
    expect(out[3]).toBe(0)
    expect(out[k + 3]).toBe(255)
  })
})
