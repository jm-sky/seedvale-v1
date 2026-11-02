import { createNoise2D } from 'simplex-noise'
import { describe, expect, it } from 'vitest'
import { defaultTerrainConfig } from '../config/worldConfig'
import { createSeededRandom } from '../world/parseSeed'
import { coastRadiusAt, continentCentre, continentMaskAt, WORLD_HALF_EXTENT } from './continentMask'

const params = defaultTerrainConfig(65).region.continentMask!
const handles = (seed: number) => ({
  continent: createNoise2D(createSeededRandom(seed ^ 0xc2b2ae35)),
  warp: createNoise2D(createSeededRandom(seed ^ 0x9e3779b9)),
})

describe('continentMask', () => {
  it('is 1 at the origin and 0 well outside the coast, for several seeds', () => {
    for (const seed of [1, 42, 415424794, 987654321]) {
      const n = handles(seed)
      expect(continentMaskAt(0, 0, n, params)).toBe(1)
      for (let a = 0; a < Math.PI * 2; a += 0.2) {
        const r = params.coastRadiusMax + 700
        expect(continentMaskAt(Math.cos(a) * r, Math.sin(a) * r, n, params)).toBe(0)
      }
    }
  })

  it('is deterministic and keeps the coast radius in the configured range', () => {
    const n = handles(42)
    expect(continentMaskAt(1234, -987, n, params)).toBe(continentMaskAt(1234, -987, n, params))
    for (let a = -Math.PI; a <= Math.PI; a += 0.1) {
      const r = coastRadiusAt(a, n.continent, params)
      expect(r).toBeGreaterThanOrEqual(params.coastRadiusMin)
      expect(r).toBeLessThanOrEqual(params.coastRadiusMax)
    }
  })

  it('keeps the centre inside the inner radius and the sea inside the world box', () => {
    const c = continentCentre(handles(7).continent, params)
    expect(Math.hypot(c.x, c.z)).toBeLessThan(params.innerRadius / 2)
    expect(params.coastRadiusMax + params.edgeBand).toBeLessThan(WORLD_HALF_EXTENT)
  })
})
