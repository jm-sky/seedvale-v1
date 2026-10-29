import { describe, expect, it } from 'vitest'
import type { MapCanvasLike } from './mapTerrainLayer'
import { createMapDiscovery } from '../../world/map/mapDiscovery'
import { MAP_FOG_EDGE_ALPHA, MAP_FOG_SIDE } from '../../world/map/mapFogGrid'
import { MAP_FOG_RGB } from './mapColors'
import { createMapFogLayer } from './mapFogLayer'

type Put = { data: Uint8ClampedArray, w: number, h: number, x: number, y: number }

function recordingCanvas(puts: Put[]) {
  return (): MapCanvasLike => ({
    getContext: () => ({
      createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
      putImageData: (image: { data: Uint8ClampedArray, width: number, height: number }, x: number, y: number) =>
        puts.push({ data: image.data, w: image.width, h: image.height, x, y }),
    }),
  }) as unknown as MapCanvasLike
}

const ctx = { imageSmoothingEnabled: false, drawImage: () => {} } as unknown as CanvasRenderingContext2D
const anywhere = { minX: -100, maxX: 100, minZ: -100, maxZ: 100 }

function alphaAt(put: Put, ix: number, iz: number): number {
  return put.data[((iz - put.y) * put.w + (ix - put.x)) * 4 + 3]!
}

describe('map fog layer', () => {
  it('paints the whole mask once, then only the dirty rect around new reveals', () => {
    const discovery = createMapDiscovery()
    const puts: Put[] = []
    const fog = createMapFogLayer(discovery, recordingCanvas(puts))
    fog.draw(ctx, anywhere)
    expect(puts).toHaveLength(1)
    expect(puts[0]!.w).toBe(MAP_FOG_SIDE)
    expect(Array.from(puts[0]!.data.slice(0, 4))).toEqual([...MAP_FOG_RGB, 255])

    discovery.update(4, 4)
    fog.draw(ctx, anywhere)
    expect(puts).toHaveLength(2)
    const delta = puts[1]!
    expect(delta.w).toBeLessThan(20)
    const centre = MAP_FOG_SIDE / 2
    expect(alphaAt(delta, centre, centre)).toBe(0)
    expect(alphaAt(delta, centre + 6, centre)).toBe(MAP_FOG_EDGE_ALPHA)
    expect(alphaAt(delta, centre + 7, centre)).toBe(255)

    fog.draw(ctx, anywhere)
    expect(puts).toHaveLength(2)
  })

  it('repaints fully on clear even though the change is a reset, not a reveal', () => {
    const discovery = createMapDiscovery()
    const puts: Put[] = []
    const fog = createMapFogLayer(discovery, recordingCanvas(puts))
    discovery.update(0, 0)
    fog.draw(ctx, anywhere)
    const revision = fog.revision
    discovery.clear()
    fog.draw(ctx, anywhere)
    expect(fog.revision).toBe(revision + 1)
    const last = puts.at(-1)!
    expect(last.w).toBe(MAP_FOG_SIDE)
    expect(fog.grid.isDiscovered(0, 0)).toBe(false)
  })
})
