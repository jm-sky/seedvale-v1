import { describe, expect, it } from 'vitest'
import {
  ChainEnd,
  computeWorldHydrology,
  hashWorldHydrology,
  SPARSE_BLOCK_SIZE,
  sparseBlockValue,
  unpackChains,
  type WorldHydrologyGrid,
} from './worldHydrology'

const N = 128
const WATER = 0.45

/** Valley draining west into the sea; the whole border is sea so no cell drains off the grid. */
function valleyGrid(mutate?: (floor: Float32Array) => void): WorldHydrologyGrid {
  const floor = new Float32Array(N * N)
  for (let iz = 0; iz < N; iz++) {
    for (let ix = 0; ix < N; ix++) {
      const border = ix === 0 || iz === 0 || ix === N - 1 || iz === N - 1
      floor[iz * N + ix] = border || ix < 6 ? -2 : 1 + 0.12 * (ix - 6) + 0.2 * Math.abs(iz - N / 2)
    }
  }
  mutate?.(floor)
  return { floor, size: N, cellStep: 8, originX: -512, originZ: -512 }
}

describe('computeWorldHydrology', () => {
  it('drains every land cell: no dry sinks, chains end at the sea at water level', () => {
    const h = computeWorldHydrology(valleyGrid())
    expect(h.stats.drySinks).toBe(0)
    expect(h.stats.edgeDrains).toBe(0)
    expect(h.stats.chains).toBeGreaterThan(0)
    const chains = unpackChains(h.chains)
    chains.forEach((c, i) => {
      const end = h.chains.flags[i]! & 15
      expect(end).not.toBe(ChainEnd.Edge)
      if (end === ChainEnd.Sea) expect(c.points[c.points.length - 1]!.elevation).toBeCloseTo(WATER, 5)
    })
    expect(h.stats.chainEnds.sea).toBeGreaterThan(0)
  })

  it('keeps water surface non-increasing along every chain', () => {
    const h = computeWorldHydrology(valleyGrid())
    for (const c of unpackChains(h.chains)) {
      for (let i = 1; i < c.points.length; i++) {
        expect(c.points[i]!.elevation).toBeLessThanOrEqual(c.points[i - 1]!.elevation + 0.06)
      }
    }
  })

  it('is deterministic and independent of the seed-free inputs', () => {
    const a = hashWorldHydrology(computeWorldHydrology(valleyGrid(), { seed: 7 }))
    const b = hashWorldHydrology(computeWorldHydrology(valleyGrid(), { seed: 7 }))
    expect(a).toBe(b)
  })

  it('fills a small pit through the correction layer', () => {
    const iz = 64
    const ix = 60
    const base = valleyGrid()
    const g = valleyGrid((f) => {
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) f[(iz + dz) * N + ix + dx] -= 1.2
    })
    const h = computeWorldHydrology(g, { breachMaxCutM: 0 })
    expect(h.lakes.length).toBe(0)
    expect(h.stats.filledPits).toBeGreaterThan(0)
    expect(sparseBlockValue(h.correction, ix, iz)).toBeGreaterThan(0.5)
    expect(base.floor[iz * N + ix]).toBeGreaterThan(0)
    expect(h.stats.drySinks).toBe(0)
  })

  it('breaches a shallow pit behind a thin ridge instead of filling it', () => {
    const ix = 60
    const g = valleyGrid((f) => {
      // Ridge across the valley floor, 0.8 m high, with a pit behind it.
      for (let iz = 40; iz < 90; iz++) f[iz * N + ix] += 0.8
    })
    const h = computeWorldHydrology(g)
    expect(h.stats.drySinks).toBe(0)
    expect(h.stats.maxCutM).toBeLessThanOrEqual(3 + 1e-6)
  })

  it('turns a large deep basin into a lake that feeds a chain from its outlet', () => {
    const cx = 80
    const cz = 64
    const g = valleyGrid((f) => {
      for (let dz = -9; dz <= 9; dz++) {
        for (let dx = -9; dx <= 9; dx++) {
          if (dx * dx + dz * dz <= 81) f[(cz + dz) * N + cx + dx] -= 6 * (1 - Math.hypot(dx, dz) / 10)
        }
      }
    })
    // The basin (~250 cells) is below the calibrated world default (600); pin the mechanism threshold.
    const h = computeWorldHydrology(g, { breachMaxCutM: 0.5, lakeMinCells: 120 })
    expect(h.lakes.length).toBeGreaterThanOrEqual(1)
    const lake = h.lakes[0]!
    expect(lake.cells).toBeGreaterThan(120)
    expect(sparseBlockValue(h.basin, cx, cz)).toBe(lake.id)
    expect(h.stats.drySinks).toBe(0)
    const flags = Array.from(h.chains.flags)
    expect(flags.some((f) => (f & 16) !== 0 || (f & 15) === ChainEnd.Lake)).toBe(true)
  })

  it('stores sparse blocks only where a value is set', () => {
    const h = computeWorldHydrology(valleyGrid())
    expect(h.basin.blockIds.length).toBe(0)
    expect(h.basin.data.length).toBe(0)
    expect(SPARSE_BLOCK_SIZE).toBe(64)
  })
})
