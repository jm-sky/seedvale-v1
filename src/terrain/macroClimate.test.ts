import { describe, expect, it } from 'vitest'
import { createBenchmarkWorldConfig } from '../config/worldConfig'
import { rawSampleParamsFromWorld } from '../world/map/mapProjection'
import { createMacroClimate, latitude01, MACRO_CLIMATE_CELL_M, macroClimateFrom, runoffFrom, runoffGrid, temperatureAt } from './macroClimate'
import { sampleRawFloorRows } from './worldHydrology'
import { UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

const params = (seed: number) => rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))

describe('macroClimate (061 C1)', () => {
  it('latitude: north (−Z) is colder than south at the same height and moisture', () => {
    const north = macroClimateFrom(-5000, 2, 0, 0.5, 0.3)
    const south = macroClimateFrom(5000, 2, 0, 0.5, 0.3)
    expect(north.temperature).toBeLessThan(south.temperature)
    expect(latitude01(-6144)).toBe(0)
    expect(latitude01(6144)).toBe(1)
  })

  it('lapse: higher ground is colder; below water level adds no warming', () => {
    const low = macroClimateFrom(0, 2, 0, 0.5, 0)
    const high = macroClimateFrom(0, 70, 0, 0.5, 0)
    expect(high.temperature).toBeLessThan(low.temperature - 5)
    expect(macroClimateFrom(0, -10, 0, 0.5, 0).temperature).toBe(macroClimateFrom(0, 0, 0, 0.5, 0).temperature)
  })

  it('precipitation stays in 0..1 and rises with moisture noise and coast', () => {
    for (const m of [0, 0.5, 1]) for (const c of [0, 1]) {
      const p = macroClimateFrom(0, 5, 0, m, c).precipitation
      expect(p).toBeGreaterThanOrEqual(0)
      expect(p).toBeLessThanOrEqual(1)
    }
    expect(macroClimateFrom(0, 5, 0, 0.9, 0).precipitation).toBeGreaterThan(macroClimateFrom(0, 5, 0, 0.1, 0).precipitation)
    expect(macroClimateFrom(0, 5, 0, 0.5, 1).precipitation).toBeGreaterThan(macroClimateFrom(0, 5, 0, 0.5, 0).precipitation)
  })

  it('is deterministic, query-order independent and within the memory budget', () => {
    const p = params(42)
    const a = createMacroClimate(p)
    const b = createMacroClimate(p)
    const pts: [number, number][] = [[0, 0], [1500, -900], [-2200, 3100], [100, 100], [4000, 4000]]
    const forward = pts.map(([x, z]) => a.sampleAt(x, z))
    const backward = [...pts].reverse().map(([x, z]) => b.sampleAt(x, z)).reverse()
    expect(backward).toEqual(forward)
    expect(a.gridBytes).toBeLessThanOrEqual(0.6 * 1024 * 1024)
    expect(a.seaMaskCells).toBeGreaterThan(0)
  })

  it('maritime influence is 1 far outside the world edge and lower deep inland', () => {
    const c = createMacroClimate(params(415424794))
    expect(c.maritimeAt(-6144 - 500, 0)).toBe(1)
    expect(c.maritimeAt(0, 0)).toBeLessThan(0.99)
    expect(MACRO_CLIMATE_CELL_M).toBe(64)
  })

  it('runoff (061 H1): bounded, wetter with precipitation, lower where warm', () => {
    for (const t of [-5, 2, 9, 16, 25]) for (const p of [0, 0.3, 0.6, 1]) {
      const r = runoffFrom(t, p)
      expect(r).toBeGreaterThanOrEqual(0.15)
      expect(r).toBeLessThanOrEqual(2)
    }
    expect(runoffFrom(8, 0.8)).toBeGreaterThan(runoffFrom(8, 0.4))
    expect(runoffFrom(3, 0.6)).toBeGreaterThan(runoffFrom(15, 0.6))
  })

  it('runoffGrid matches the per-point climate path and is deterministic', () => {
    const p = params(415424794)
    const climate = createMacroClimate(p)
    const grid = { size: 33, cellStep: 8, originX: 1200, originZ: -800 }
    const floor = sampleRawFloorRows({ ...p, hydrologyId: UNCONDITIONED_HYDROLOGY_ID }, grid, 0, grid.size)
    const a = runoffGrid(climate, floor, grid, p.waterLevel)
    expect(runoffGrid(createMacroClimate(p), floor, grid, p.waterLevel)).toEqual(a)
    for (const [ix, iz] of [[0, 0], [7, 19], [32, 32], [16, 3]] as const) {
      const k = iz * grid.size + ix, x = grid.originX + ix * 8, z = grid.originZ + iz * 8
      const expected = runoffFrom(temperatureAt(z, floor[k]!, p.waterLevel), climate.precipitationAt(x, z))
      expect(a[k]!).toBeCloseTo(expected, 5)
    }
  })
})
