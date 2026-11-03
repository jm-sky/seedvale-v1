import { afterEach, describe, expect, it } from 'vitest'
import type { WorldHydrology } from './worldHydrology'
import { createBenchmarkWorldConfig } from '../config/worldConfig'
import { rawSampleParamsFromWorld } from '../world/map/mapProjection'
import { sampleLandHeightAt, sampleRawTexelAt } from './chunkHeightmap'
import { detectWaterBodies } from './waterBodies'
import { sampleLocalWater } from './waterSample'
import { isWaterOrShore, isWetFloor, isWetTexel } from './waterSurface'
import { clearWorldHydrology, installWorldHydrology } from './worldHydrologyRegistry'
import { hydrologyLakeLevelAt, SPARSE_BLOCK_SIZE } from './worldHydrologyStore'

const SEA = 10

describe('wetness rule (plan 058 L1)', () => {
  it('water ⇔ surface above floor; sea-level texels stay wet', () => {
    expect(isWetFloor(30, 27)).toBe(true)
    expect(isWetFloor(30, 30)).toBe(false)
    expect(isWetFloor(30, 29.99)).toBe(false) // inside the bilinear-leak epsilon
    expect(isWetTexel(SEA, SEA, SEA)).toBe(true)
    expect(isWetTexel(40, 40, SEA)).toBe(false)
  })

  it('placement test rejects lake cells and sea shore, accepts dry land', () => {
    expect(isWaterOrShore(30, 27, SEA, 0.5)).toBe(true) // lake
    expect(isWaterOrShore(SEA + 0.2, SEA + 0.2, SEA, 0.5)).toBe(true) // sea shore margin
    expect(isWaterOrShore(30, 30, SEA, 0.5)).toBe(false) // dry bank
  })

  it('sampleLocalWater: a lake point is water at the lake surface, a dry point next to it is not', () => {
    const lake = sampleLocalWater(30, 27, SEA, [], 0, 0)
    expect(lake).toEqual({ present: true, waterSurfaceHeight: 30, floorHeight: 27, depth: 3 })
    expect(sampleLocalWater(30.4, 30.4, SEA, [], 1, 0).present).toBe(false)
  })

  it('detectWaterBodies keeps a lake and the sea at another level apart', () => {
    const n = 4
    // row 0: sea cells, row 3: lake cells at level 30 (floor 27), middle rows dry land
    const heights = new Float32Array(n * n).fill(35)
    const floors = new Float32Array(n * n).fill(35)
    for (let x = 0; x < n; x++) {
      heights[x] = SEA
      floors[x] = 5
      heights[3 * n + x] = 30
      floors[3 * n + x] = 27
    }
    const det = detectWaterBodies(heights, floors, n, SEA, 1)
    expect(det.bodies).toHaveLength(2)
    expect(det.bodyId[0]).not.toBe(det.bodyId[3 * n])
    expect(det.bodyId[n]).toBe(-1)
  })
})

describe('lake level in the raw sample', () => {
  const config = createBenchmarkWorldConfig({ seed: 42, terrainResolution: 65, loadRadius: 2 })
  const base = { ...rawSampleParamsFromWorld(config), hydrologyId: 'unconditioned' }
  afterEach(() => clearWorldHydrology())

  /** One lake (id 1, level = floor + 5 at the probe) covering hydrology cell (ix, iz) only. */
  function installLake(probeX: number, probeZ: number, level: number): string {
    const size = 64
    const cellStep = 8
    const originX = probeX - 32 * cellStep
    const originZ = probeZ - 32 * cellStep
    const data = new Uint16Array(SPARSE_BLOCK_SIZE * SPARSE_BLOCK_SIZE)
    data[32 * SPARSE_BLOCK_SIZE + 32] = 1
    const hydro = {
      version: 1,
      size,
      cellStep,
      originX,
      originZ,
      chains: { points: new Float32Array(), offsets: new Uint32Array([0]), flags: new Uint8Array() },
      correction: { blocksPerRow: 1, blockIds: new Uint32Array(), data: new Float32Array() },
      basin: { blocksPerRow: 1, blockIds: new Uint32Array([0]), data },
      lakes: [{ id: 1, level, cells: 1, areaM2: 64, outletX: 0, outletZ: 0 }],
    } as unknown as WorldHydrology
    const id = `lake-test-${probeX}-${probeZ}`
    installWorldHydrology(id, hydro)
    return id
  }

  it('lifts the surface to the lake level where the floor is lower, and leaves dry floor alone', () => {
    const x = 1234
    const z = -567
    const raw = sampleRawTexelAt(x, z, base) // unconditioned: no lakes
    expect(raw.waterH).toBe(base.waterLevel)
    const level = raw.floorH + 5
    const id = installLake(x, z, level)
    const params = { ...base, hydrologyId: id }
    const wet = sampleRawTexelAt(x, z, params)
    expect(hydrologyLakeLevelAt(id, x, z)).toBeCloseTo(level, 4)
    expect(wet.waterH).toBeCloseTo(level, 4)
    expect(wet.h).toBeCloseTo(level, 4)
    expect(isWetFloor(wet.h, wet.floorH)).toBe(true)
    expect(sampleLandHeightAt(x, z, params)).toBe(base.waterLevel) // placement sees water
    // A lake level below the floor does not flood the point.
    const dryId = installLake(x + 1, z, raw.floorH - 5)
    const dry = sampleRawTexelAt(x + 1, z, { ...base, hydrologyId: dryId })
    expect(isWetFloor(dry.h, dry.floorH)).toBe(false)
    // Outside the basin there is no lake.
    expect(hydrologyLakeLevelAt(id, x + 400, z)).toBe(-Infinity)
  })
})

describe('withLandHeightView (plan 058 L1)', () => {
  it('swaps sampleHeight for the land view and keeps live getters', async () => {
    const { withLandHeightView } = await import('../world/worldContext')
    let level = 1
    const ctx = {
      sampleHeight: () => 5,
      sampleLandHeight: () => 1,
      get waterLevel() { return level },
    } as unknown as import('../world/worldContext').WorldContext
    const view = withLandHeightView(ctx)
    expect(view.sampleHeight(0, 0)).toBe(1)
    expect(ctx.sampleHeight(0, 0)).toBe(5)
    level = 2
    expect(view.waterLevel).toBe(2)
  })
})
