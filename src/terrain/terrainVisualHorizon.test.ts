import { describe, expect, it } from 'vitest'
import { farRingBaseFog, terrainVisualHorizon } from './terrainVisualHorizon'

describe('terrainVisualHorizon', () => {
  it('keeps fadeStart strictly before opaqueAt for the default config', () => {
    const horizon = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3 })
    expect(horizon.fadeStart).toBeGreaterThan(0)
    expect(horizon.fadeStart).toBeLessThan(horizon.opaqueAt)
  })

  it('places opaqueAt inside the guaranteed loadRadius * chunkSize coverage', () => {
    const chunkSize = 64
    const loadRadius = 3
    const horizon = terrainVisualHorizon({ chunkSize, loadRadius })
    expect(horizon.opaqueAt).toBeLessThan(loadRadius * chunkSize)
    expect(horizon.opaqueAt).toBeGreaterThan(0)
  })

  it('scales predictably when chunkSize doubles', () => {
    const base = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3 })
    const doubled = terrainVisualHorizon({ chunkSize: 128, loadRadius: 3 })
    expect(doubled.opaqueAt).toBeGreaterThan(base.opaqueAt)
    expect(doubled.fadeStart).toBeGreaterThan(base.fadeStart)
  })

  it('expands the horizon when loadRadius increases', () => {
    const small = terrainVisualHorizon({ chunkSize: 64, loadRadius: 2 })
    const large = terrainVisualHorizon({ chunkSize: 64, loadRadius: 5 })
    expect(large.opaqueAt).toBeGreaterThan(small.opaqueAt)
    expect(large.fadeStart).toBeGreaterThan(small.fadeStart)
  })

  it('is not affected by an unloadRadius-shaped extra input', () => {
    const horizon = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3 })
    // @ts-expect-error — unloadRadius is intentionally not part of the contract
    const withUnload = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3, unloadRadius: 999 })
    expect(withUnload).toEqual(horizon)
  })

  it('still produces a valid positive transition for a very small loadRadius', () => {
    const horizon = terrainVisualHorizon({ chunkSize: 64, loadRadius: 1 })
    expect(horizon.fadeStart).toBeGreaterThan(0)
    expect(horizon.opaqueAt).toBeGreaterThan(horizon.fadeStart)
  })
})

describe('far ring (world-terrain-066)', () => {
  it('is unchanged without farRadius (flag off)', () => {
    const off = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3 })
    expect(terrainVisualHorizon({ chunkSize: 64, loadRadius: 3, farRadius: null })).toEqual(off)
    expect(off.farRadius).toBeUndefined()
  })

  it('makes fog opaque at farRadius with a fade band before it', () => {
    const horizon = terrainVisualHorizon({ chunkSize: 64, loadRadius: 3, farRadius: 800 })
    expect(horizon.opaqueAt).toBe(800)
    expect(horizon.farRadius).toBe(800)
    expect(horizon.fadeStart).toBeGreaterThan(0)
    expect(horizon.fadeStart).toBeLessThan(800)
  })

  it('widens base day fog to farRadius by dayFactor and leaves night untouched', () => {
    const noon = { fogNear: 130, fogFar: 250 }
    const night = { fogNear: 50, fogFar: 150 }
    expect(farRingBaseFog(noon, 1, 800)).toEqual({ fogNear: 360, fogFar: 800 })
    expect(farRingBaseFog(night, 0, 800)).toEqual(night)
    const dusk = farRingBaseFog({ fogNear: 90, fogFar: 200 }, 0.5, 800)
    expect(dusk.fogFar).toBeGreaterThan(200)
    expect(dusk.fogFar).toBeLessThan(800)
  })

  it('never narrows fog already wider than the ring', () => {
    expect(farRingBaseFog({ fogNear: 500, fogFar: 2000 }, 1, 800)).toEqual({ fogNear: 500, fogFar: 2000 })
  })
})
