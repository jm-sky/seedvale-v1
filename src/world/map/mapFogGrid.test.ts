import { describe, expect, it } from 'vitest'
import { MAP_EXTENT_HALF } from './mapConfig'
import { createMapDiscovery } from './mapDiscovery'
import { createMapFogGrid, MAP_FOG_EDGE_ALPHA, MAP_FOG_SIDE } from './mapFogGrid'
import { mapCellKey } from './mapProjection'

const ORIGIN = MAP_FOG_SIDE / 2

describe('map fog grid', () => {
  it('tracks negative coordinates and ignores cells outside the map extent', () => {
    const grid = createMapFogGrid()
    expect(grid.add(-3, -7)).toBeGreaterThanOrEqual(0)
    expect(grid.add(-3, -7)).toBe(-1)
    expect(grid.isDiscovered(-3, -7)).toBe(true)
    expect(grid.isDiscovered(-3, -6)).toBe(false)
    expect(grid.add(MAP_FOG_SIDE, 0)).toBe(-1)
  })

  it('feathers explored edges inward and keeps unknown cells opaque', () => {
    const grid = createMapFogGrid()
    for (let cz = 0; cz < 3; cz++) for (let cx = 0; cx < 3; cx++) grid.add(cx, cz)
    expect(grid.alphaAt(ORIGIN + 1, ORIGIN + 1)).toBe(0)
    expect(grid.alphaAt(ORIGIN, ORIGIN)).toBe(MAP_FOG_EDGE_ALPHA)
    expect(grid.alphaAt(ORIGIN - 1, ORIGIN)).toBe(255)
  })

  it('answers discovery queries for small and block-aligned rects', () => {
    const grid = createMapFogGrid()
    grid.add(40, 0) // world x 320..328 → coverage block 1
    expect(grid.anyDiscoveredIn({ minX: 256, maxX: 512, minZ: 0, maxZ: 256 })).toBe(true)
    expect(grid.anyDiscoveredIn({ minX: 256, maxX: 320, minZ: 0, maxZ: 64 })).toBe(false)
    expect(grid.anyDiscoveredIn({ minX: 320, maxX: 384, minZ: 0, maxZ: 64 })).toBe(true)
    expect(grid.coveredBlocksIn({ minX: -1024, maxX: 1024, minZ: -1024, maxZ: 1024 })).toEqual([[1, 0]])
    expect(grid.anyDiscoveredIn({ minX: MAP_EXTENT_HALF, maxX: MAP_EXTENT_HALF + 100, minZ: 0, maxZ: 64 })).toBe(false)
  })

  it('reset replaces content', () => {
    const grid = createMapFogGrid()
    grid.add(1, 1)
    grid.reset([mapCellKey(5, 5)])
    expect(grid.isDiscovered(1, 1)).toBe(false)
    expect(grid.isDiscovered(5, 5)).toBe(true)
    expect(grid.coveredBlocksIn({ minX: 0, maxX: 256, minZ: 0, maxZ: 256 })).toEqual([[0, 0]])
  })
})

describe('map discovery change feed', () => {
  it('reports reveals and resets, bumping the revision even when size is unchanged', () => {
    const discovery = createMapDiscovery()
    const changes: string[] = []
    discovery.subscribe((change) => changes.push(change.kind === 'added' ? `added:${change.keys.length}` : 'reset'))
    discovery.update(0, 0)
    const size = discovery.size()
    const saved = discovery.serialize()
    const revision = discovery.revision()
    discovery.restore(saved)
    expect(discovery.size()).toBe(size)
    expect(discovery.revision()).toBe(revision + 1)
    discovery.update(0, 0) // same cell after restore resets the last-cell guard; nothing new
    discovery.clear()
    expect(changes[0]).toBe(`added:${size}`)
    expect(changes.slice(1)).toEqual(['reset', 'reset'])
  })
})
