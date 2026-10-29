import { describe, expect, it } from 'vitest'
import { DENSE_FOREST_MAX_RADIUS, type DenseForestProbe, forestWindowScore, seekDenseForest } from './denseForestScenario'

/** Forest factor 1 inside a disc, 0 elsewhere; flat dry land. */
function discProbe(cx: number, cz: number, radius: number, overrides: Partial<DenseForestProbe> = {}): DenseForestProbe {
  return {
    sampleForestFactor: (x, z) => (Math.hypot(x - cx, z - cz) <= radius ? 1 : 0),
    sampleHeight: () => 10,
    waterLevel: 0,
    ...overrides,
  }
}

describe('seekDenseForest', () => {
  it('prefers the inside of a large forest over a single high sample near home', () => {
    // A tiny 1-sample spike at the origin vs a big forest 640 m east.
    const forest = discProbe(640, 0, 200)
    const probe: DenseForestProbe = {
      ...forest,
      sampleForestFactor: (x, z) => (x === 0 && z === 0 ? 1 : forest.sampleForestFactor(x, z)),
    }
    const anchor = seekDenseForest(probe, 0, 0)
    expect(Math.hypot(anchor.x - 640, anchor.z)).toBeLessThan(110)
    expect(anchor.score).toBe(1)
  })

  it('skips wet candidates', () => {
    const probe = discProbe(640, 0, 200, { sampleHeight: (x) => (x > 300 ? -5 : 10) })
    const anchor = seekDenseForest(probe, 0, 0)
    expect(anchor.x).toBeLessThanOrEqual(300)
  })

  it('is deterministic and stays inside the search radius', () => {
    const probe = discProbe(-900, 700, 300)
    const a = seekDenseForest(probe, 0, 0)
    expect(seekDenseForest(probe, 0, 0)).toEqual(a)
    expect(Math.hypot(a.x, a.z)).toBeLessThanOrEqual(DENSE_FOREST_MAX_RADIUS + 1e-6)
    expect(a.score).toBe(forestWindowScore(probe, a.x, a.z))
  })

  it('falls back to the origin when nothing scores higher', () => {
    expect(seekDenseForest(discProbe(0, 0, 0), 5, 7)).toEqual({ x: 5, z: 7, score: 0 })
  })
})
