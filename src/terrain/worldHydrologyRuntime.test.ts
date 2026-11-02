import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBenchmarkWorldConfig } from '../config/worldConfig'
import { rawSampleParamsFromWorld } from '../world/map/mapProjection'
import { sampleRawFloorRows, WORLD_HYDROLOGY_GRID, type WorldHydrology } from './worldHydrology'
import { clearWorldHydrology, hasWorldHydrology, hydrologyIdFor, installWorldHydrology, worldHydrologyFor } from './worldHydrologyRegistry'
import { ensureWorldHydrology, sampleWorldHydrologyFloor } from './worldHydrologyRuntime'

const testConfig = (seed: number) => createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 })

/** A tiny fake hydrology: `ensureWorldHydrology` only moves it around, so the test never runs the 1537² compute. */
const fakeHydrology = { version: 1, size: 3, cellStep: 8, chains: { points: new Float32Array(), offsets: new Uint32Array(), flags: new Uint8Array() }, correction: { blocksPerRow: 0, blockIds: new Uint32Array(), data: new Float32Array() }, basin: { blocksPerRow: 0, blockIds: new Uint32Array(), data: new Uint16Array() }, lakes: [] } as unknown as WorldHydrology

describe('hydrologyIdFor', () => {
  const base = rawSampleParamsFromWorld(testConfig(42))

  it('is carried by rawSampleParamsFromWorld and stable', () => {
    expect(base.hydrologyId).toBe(rawSampleParamsFromWorld(testConfig(42)).hydrologyId)
    expect(base.hydrologyId).toBe(hydrologyIdFor(base))
  })

  it('changes with the seed and with any terrain input, but not with unrelated extra properties', () => {
    expect(rawSampleParamsFromWorld(testConfig(43)).hydrologyId).not.toBe(base.hydrologyId)
    expect(hydrologyIdFor({ ...base, heightScale: base.heightScale + 1 })).not.toBe(base.hydrologyId)
    expect(hydrologyIdFor({ ...base, region: { ...base.region, oceanThreshold: base.region.oceanThreshold + 0.01 } })).not.toBe(base.hydrologyId)
    expect(hydrologyIdFor({ ...base, extra: 1 } as typeof base)).toBe(base.hydrologyId)
  })
})

describe('world hydrology registry', () => {
  beforeEach(() => clearWorldHydrology())

  it('throws for an id that is not installed, answers once installed, and can be cleared', () => {
    expect(hasWorldHydrology('x')).toBe(false)
    expect(() => worldHydrologyFor('x')).toThrow(/not installed/)
    installWorldHydrology('x', fakeHydrology)
    expect(worldHydrologyFor('x')).toBe(fakeHydrology)
    clearWorldHydrology('x')
    expect(() => worldHydrologyFor('x')).toThrow()
  })
})

describe('ensureWorldHydrology', () => {
  const params = rawSampleParamsFromWorld(testConfig(42))
  beforeEach(() => clearWorldHydrology())

  it('installs a cache hit in the registry and the workers without computing', async () => {
    const installInWorkers = vi.fn()
    const sampleRows = vi.fn()
    const result = await ensureWorldHydrology(params, { cache: { read: async () => fakeHydrology, write: vi.fn() }, sampleRows, installInWorkers })
    expect(result.source).toBe('cache')
    expect(worldHydrologyFor(params.hydrologyId)).toBe(fakeHydrology)
    expect(installInWorkers).toHaveBeenCalledWith(params.hydrologyId, fakeHydrology)
    expect(sampleRows).not.toHaveBeenCalled()
  })

  it('treats an installed id as a registry hit and re-installs it in the workers only', async () => {
    installWorldHydrology(params.hydrologyId, fakeHydrology)
    const read = vi.fn()
    const installInWorkers = vi.fn()
    const result = await ensureWorldHydrology(params, { cache: { read, write: vi.fn() }, installInWorkers })
    expect(result.source).toBe('registry')
    expect(read).not.toHaveBeenCalled()
    expect(installInWorkers).toHaveBeenCalledOnce()
  })

  it('shares one in-flight install between concurrent callers', async () => {
    const read = vi.fn(async () => fakeHydrology)
    const options = { cache: { read, write: vi.fn() }, installInWorkers: vi.fn() }
    const [a, b] = await Promise.all([ensureWorldHydrology(params, options), ensureWorldHydrology(params, options)])
    expect(read).toHaveBeenCalledOnce()
    expect(a).toBe(b)
  })
})

describe('strip sampling', () => {
  // The real 1537² grid is too big for a unit test; a row range of the real grid is enough to prove that strips
  // concatenate to the same bytes as one pass.
  it('rows sampled in strips equal one pass over the same rows', () => {
    const params = rawSampleParamsFromWorld(testConfig(42))
    const grid = WORLD_HYDROLOGY_GRID
    const whole = sampleRawFloorRows(params, grid, 700, 706)
    const a = sampleRawFloorRows(params, grid, 700, 703)
    const b = sampleRawFloorRows(params, grid, 703, 706)
    expect(Array.from(whole)).toEqual([...a, ...b])
  })

  it('sampleWorldHydrologyFloor hands each strip a disjoint row range covering the grid in order', async () => {
    const ranges: Array<[number, number]> = []
    const floor = await sampleWorldHydrologyFloor(
      { hydrologyId: 'h' } as never,
      async (_p, a, b) => {
        ranges.push([a, b])
        return new Float32Array((b - a) * WORLD_HYDROLOGY_GRID.size).fill(a)
      },
      5,
    )
    ranges.sort((x, y) => x[0] - y[0])
    expect(ranges[0]![0]).toBe(0)
    expect(ranges.at(-1)![1]).toBe(WORLD_HYDROLOGY_GRID.size)
    for (let i = 1; i < ranges.length; i++) expect(ranges[i]![0]).toBe(ranges[i - 1]![1])
    expect(floor.length).toBe(WORLD_HYDROLOGY_GRID.size ** 2)
    expect(floor[0]).toBe(0)
    expect(floor[floor.length - 1]).toBe(ranges.at(-1)![0])
  })
})
