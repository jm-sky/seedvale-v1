import { describe, expect, it } from 'vitest'
import type { RegionParams } from './chunkHeightmap'
import { createBenchmarkWorldConfig } from '../config/worldConfig'
import { rawSampleParamsFromWorld } from '../world/map/mapProjection'
import { projectCellAt } from '../world/map/mapProjection'
import { biomeBorderAt, type BiomeClimateInput, biomeWeightsAt, biomeWeightsAtPoint, biomeWeightsFromClimate, forestBiomeAt, forestDensityAt, forestDensityAtPoint } from './biomeRegions'
import { sampleRawTexelAt } from './chunkHeightmap'
import { macroClimateOf } from './macroClimate'
import { UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

// Same default values as `config/worldConfig.ts`'s `baseConfig` — copied
// locally so this test doesn't depend on config internals.
const REGION: RegionParams = {
  continentScale: 2200,
  continentFbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
  mountainScale: 1800,
  mountainFbm: { octaves: 2, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.2 },
  mountainThreshold: 0.62,
  mountainThresholdWidth: 0.14,
  worleyCellSize: 260,
  ridgeSharpness: 2.0,
  mountainGain: 0.88,
  oceanThreshold: 0.32,
  coastThreshold: 0.45,
  oceanDetailWeight: 0.25,
  moistureRegionScale: 2000,
  moistureRegionFbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
  desertThreshold: 0.35,
  desertThresholdWidth: 0.12,
  swampThreshold: 0.72,
  swampThresholdWidth: 0.15,
  roadNetwork: {
    roadHalfWidth: 5,
    roadHeightStrength: 0.85,
    roadTintStrength: 0.8,
    pathHalfWidth: 1.5,
    pathHeightStrength: 0.2,
    pathTintStrength: 0.4,
    smoothingWindow: 10,
    maxNeighborRoads: 3,
    dockSearchRadius: 140,
    edgeWobbleAmplitude: 0.15,
    edgeWobbleScale: 0.06,
    potholeDepth: 0.12,
    potholeThreshold: 0.72,
    meanderAmplitude: 2,
    meanderScale: 0.04,
    surfaceDetailEnabled: true,
    rutDepth: 0.05,
    rutOffsetFraction: 0.42,
    rutWidthFraction: 0.16,
    microBumpStrength: 0.025,
    microBumpScale: 0.6,
  },
  village: {
    coreRadius: 9,
    houseRadius: 4.5,
    heightStrength: 0.8,
    tintStrength: 0.75,
    regionalHeightStrengthFlat: 0.3,
    regionalHeightStrengthMountain: 0.15,
  },
}

const LAND = 0.7
const LOWLAND = 0.12
const NO_RIDGE = 0

describe('forestDensityAt', () => {
  it('stays within [0, 1]', () => {
    const samples: Array<[number, number, number, number]> = [
      [0.2, 0.1, 0.7, 0],
      [0.5, 0.15, 0.7, 0],
      [0.55, 0.2, 0.8, 0.1],
      [0.8, 0.05, 0.6, 0],
      [0.5, 0.6, 0.7, 0.4],
      [0.5, -0.1, 0.7, 0],
      [0.5, 0.15, 0.2, 0],
    ]
    for (const [m, a, c, r] of samples) {
      const d = forestDensityAt(m, a, c, r, REGION)
      expect(d).toBeGreaterThanOrEqual(0)
      expect(d).toBeLessThanOrEqual(1)
    }
  })

  it('is deterministic for identical inputs', () => {
    const a = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    const b = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    expect(a).toBe(b)
  })

  it('is zero / near-zero over water and ocean', () => {
    expect(forestDensityAt(0.55, 0, LAND, NO_RIDGE, REGION)).toBe(0)
    expect(forestDensityAt(0.55, -0.05, LAND, NO_RIDGE, REGION)).toBe(0)
    expect(forestDensityAt(0.55, LOWLAND, 0.1, NO_RIDGE, REGION)).toBe(0)
  })

  it('is high in humid temperate lowland forest conditions', () => {
    const dense = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    expect(dense).toBeGreaterThan(0.7)
  })

  it('is lower on open temperate moisture than in canopy-core moisture', () => {
    const open = forestDensityAt(0.40, LOWLAND, LAND, NO_RIDGE, REGION)
    const edge = forestDensityAt(0.48, LOWLAND, LAND, NO_RIDGE, REGION)
    const dense = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    expect(open).toBeLessThan(edge)
    expect(edge).toBeLessThan(dense)
    // Open temperate still allows weak habitat / isolated trees.
    expect(open).toBeGreaterThan(0)
    expect(open).toBeLessThan(0.35)
  })

  it('keeps some density well up-mountain instead of hitting zero before the placement treeline (world-terrain-006)', () => {
    // 0.58 sat past the old fade end (0.55) — forestDensity used to hit
    // exactly 0 there, well below the placement treeline (0.66), leaving a
    // band with only baseline scattered trees and no continuous habitat.
    const upperSlope = forestDensityAt(0.55, 0.58, LAND, NO_RIDGE, REGION)
    expect(upperSlope).toBeGreaterThan(0)
  })

  it('still fades to zero well before the placement treeline on a bare, non-ridge slope', () => {
    expect(forestDensityAt(0.55, 1.0, LAND, NO_RIDGE, REGION)).toBe(0)
  })

  it('decreases monotonically with altitude on the upper-mountain slope', () => {
    let prev = forestDensityAt(0.55, 0.3, LAND, NO_RIDGE, REGION)
    for (let alt = 0.35; alt <= 0.7; alt += 0.05) {
      const d = forestDensityAt(0.55, alt, LAND, NO_RIDGE, REGION)
      expect(d).toBeLessThanOrEqual(prev + 1e-9)
      prev = d
    }
  })

  it('is reduced on high ridges and highlands', () => {
    const valley = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    const ridge = forestDensityAt(0.55, LOWLAND, LAND, 0.35, REGION)
    const highland = forestDensityAt(0.55, 0.5, LAND, NO_RIDGE, REGION)
    expect(ridge).toBeLessThan(valley * 0.5)
    expect(highland).toBeLessThan(valley * 0.5)
  })

  it('responds continuously around thresholds (no binary cliff)', () => {
    const steps: number[] = []
    for (let i = 0; i <= 20; i++) {
      const moisture = 0.35 + (i / 20) * 0.35
      steps.push(forestDensityAt(moisture, LOWLAND, LAND, NO_RIDGE, REGION))
    }
    for (let i = 1; i < steps.length; i++) {
      expect(Math.abs(steps[i]! - steps[i - 1]!)).toBeLessThan(0.25)
    }
  })

  it('stays near zero in desert / swamp-gated conditions', () => {
    expect(forestDensityAt(0.2, LOWLAND, LAND, NO_RIDGE, REGION)).toBeLessThan(0.05)
    // High swamp moisture at lowland altitude — forest remainder collapses.
    const swampy = forestDensityAt(0.85, 0.05, LAND, NO_RIDGE, REGION)
    expect(biomeWeightsAt(0.85, 0.05, REGION).swamp).toBeGreaterThan(0.5)
    expect(swampy).toBeLessThan(0.15)
  })
})

describe('forestBiomeAt', () => {
  it('classifies open below the open threshold', () => {
    expect(forestBiomeAt(0)).toBe('open')
    expect(forestBiomeAt(0.1)).toBe('open')
    expect(forestBiomeAt(0.34)).toBe('open')
  })

  it('classifies forest in the mid band', () => {
    expect(forestBiomeAt(0.35)).toBe('forest')
    expect(forestBiomeAt(0.5)).toBe('forest')
    expect(forestBiomeAt(0.71)).toBe('forest')
  })

  it('classifies deepForest only at high density', () => {
    expect(forestBiomeAt(0.72)).toBe('deepForest')
    expect(forestBiomeAt(0.9)).toBe('deepForest')
    expect(forestBiomeAt(1)).toBe('deepForest')
  })

  it('is deterministic for identical input', () => {
    expect(forestBiomeAt(0.55)).toBe(forestBiomeAt(0.55))
  })

  it('clamps out-of-range input instead of throwing', () => {
    expect(forestBiomeAt(-0.4)).toBe('open')
    expect(forestBiomeAt(1.4)).toBe('deepForest')
  })

  it('reaches deepForest only in humid temperate lowland conditions actually produced by forestDensityAt', () => {
    const dense = forestDensityAt(0.55, LOWLAND, LAND, NO_RIDGE, REGION)
    expect(forestBiomeAt(dense)).toBe('deepForest')
  })

  it('water/desert/swamp/high-ridge conditions never classify as deepForest', () => {
    expect(forestBiomeAt(forestDensityAt(0.55, 0, LAND, NO_RIDGE, REGION))).not.toBe('deepForest')
    expect(forestBiomeAt(forestDensityAt(0.2, LOWLAND, LAND, NO_RIDGE, REGION))).not.toBe('deepForest')
    expect(forestBiomeAt(forestDensityAt(0.85, 0.05, LAND, NO_RIDGE, REGION))).not.toBe('deepForest')
    expect(forestBiomeAt(forestDensityAt(0.55, LOWLAND, LAND, 0.35, REGION))).not.toBe('deepForest')
  })

  it('has no discontinuity around its own thresholds beyond forestDensityAt\'s own continuity', () => {
    // forestBiomeAt itself is a hard classifier (by design, for a stable
    // world query), but the underlying forestDensityAt it classifies never
    // jumps — walking through both thresholds should pass through 'forest'
    // rather than skip it.
    const seen = new Set<string>()
    for (let i = 0; i <= 40; i++) {
      const moisture = 0.35 + (i / 40) * 0.35
      const fd = forestDensityAt(moisture, LOWLAND, LAND, NO_RIDGE, REGION)
      seen.add(forestBiomeAt(fd))
    }
    expect(seen.has('open')).toBe(true)
    expect(seen.has('forest')).toBe(true)
    expect(seen.has('deepForest')).toBe(true)
  })
})

describe('biomeWeightsFromClimate (062 B1)', () => {
  const base: BiomeClimateInput = { temperatureC: 12, precipitation: 0.5, altitude01: 0.1, borderA: 0, borderS: 0 }

  it('is bounded and sums to 1 over a climate grid', () => {
    for (const temperatureC of [-5, 3, 8, 13, 20]) for (const precipitation of [0, 0.3, 0.6, 1]) for (const altitude01 of [0, 0.1, 0.4, 0.8]) {
      for (const border of [-0.08, 0, 0.08]) {
        const w = biomeWeightsFromClimate({ temperatureC, precipitation, altitude01, borderA: border, borderS: -border })
        for (const v of [w.desert, w.swamp, w.forest]) {
          expect(v).toBeGreaterThanOrEqual(0)
          expect(v).toBeLessThanOrEqual(1)
        }
        expect(w.desert + w.swamp + w.forest).toBeCloseTo(1, 10)
      }
    }
  })

  it('desert grows with aridity and with warmth; swamp grows with wetness', () => {
    const dry = (precipitation: number) => biomeWeightsFromClimate({ ...base, temperatureC: 14, precipitation }).desert
    expect(dry(0.2)).toBeGreaterThanOrEqual(dry(0.4))
    expect(dry(0.4)).toBeGreaterThanOrEqual(dry(0.6))
    const warm = (temperatureC: number) => biomeWeightsFromClimate({ ...base, temperatureC, precipitation: 0.4 }).desert
    expect(warm(14)).toBeGreaterThanOrEqual(warm(10))
    expect(warm(10)).toBeGreaterThanOrEqual(warm(5))
    const wet = (precipitation: number) => biomeWeightsFromClimate({ ...base, altitude01: 0.02, precipitation }).swamp
    expect(wet(0.9)).toBeGreaterThanOrEqual(wet(0.7))
    expect(wet(0.7)).toBeGreaterThanOrEqual(wet(0.5))
  })

  it('the cold north never becomes desert, however dry', () => {
    for (const precipitation of [0, 0.1, 0.3]) {
      expect(biomeWeightsFromClimate({ ...base, temperatureC: 3, precipitation }).desert).toBe(0)
    }
  })
})

describe('biomeWeightsAtPoint (062 B1)', () => {
  const finite = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed: 42, terrainResolution: 65, loadRadius: 2 }))

  it('is bit-identical to the legacy formula on a world without continentMask', () => {
    const legacy = { ...finite, region: { ...finite.region, continentMask: undefined } }
    for (const [x, z, a, m] of [[10, 20, 0.1, 0.3], [-800, 400, 0.5, 0.6], [3000, -2000, 0.02, 0.8]] as const) {
      expect(biomeWeightsAtPoint(legacy, x, z, a, m)).toEqual(biomeWeightsAt(m, a, legacy.region))
    }
  })

  it('builds one climate per realm (same object, also for a structured clone)', () => {
    const a = macroClimateOf(finite)
    expect(a).not.toBeNull()
    expect(macroClimateOf(finite)).toBe(a)
    expect(macroClimateOf(structuredClone(finite))).toBe(a)
  })

  it('is deterministic and order independent', () => {
    const pts = [[-2000, -3000], [1500, 2500], [0, 0], [-4000, 4000]] as const
    const fwd = pts.map(([x, z]) => biomeWeightsAtPoint(finite, x, z, 0.1, 0.4))
    const rev = [...pts].reverse().map(([x, z]) => biomeWeightsAtPoint(finite, x, z, 0.1, 0.4)).reverse()
    expect(rev).toEqual(fwd)
  })

  it('forest density uses the same forest weight the colour path sees', () => {
    const [x, z, m, a] = [-1000, 2000, 0.55, 0.1] as const
    const w = biomeWeightsAtPoint(finite, x, z, a, m)
    const d = forestDensityAtPoint(finite, x, z, m, a, 0.8, 0)
    expect(w.forest <= 0 ? d === 0 : d >= 0).toBe(true)
    expect(d).toBeLessThanOrEqual(w.forest + 1e-9)
  })

  it('border noise is seeded, bounded and varies in space', () => {
    expect(biomeBorderAt(42, 100, 200)).toEqual(biomeBorderAt(42, 100, 200))
    const vals = new Set<number>()
    for (let i = 0; i < 20; i++) {
      const b = biomeBorderAt(42, i * 173, i * 91)
      expect(Math.abs(b.borderA)).toBeLessThanOrEqual(0.08)
      expect(Math.abs(b.borderS)).toBeLessThanOrEqual(0.08)
      vals.add(b.borderA)
    }
    expect(vals.size).toBeGreaterThan(10)
  })

  it('arid land sits in the warm south, not the cold north (seeds 42, 415424794)', () => {
    for (const seed of [42, 415424794]) {
      const p = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
      let north = 0
      let south = 0
      for (let i = 0; i < 40; i++) {
        north += biomeWeightsAtPoint(p, -3000 + i * 150, -5500, 0.05, 0.3).desert
        south += biomeWeightsAtPoint(p, -3000 + i * 150, 5500, 0.05, 0.3).desert
      }
      expect(north).toBe(0)
      expect(south).toBeGreaterThan(0)
    }
  })
})

describe('map = terrain agreement (062 B1)', () => {
  it('the map biome class follows the same weights biomeWeightsAtPoint gives terrain colour', () => {
    for (const seed of [42, 415424794]) {
      const p = { ...rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 })), hydrologyId: UNCONDITIONED_HYDROLOGY_ID }
      let checked = 0
      for (let i = 0; i < 900 && checked < 25; i++) {
        const x = -3000 + (i % 30) * 200
        const z = 1000 + Math.floor(i / 30) * 140
        const t = sampleRawTexelAt(x, z, p)
        const cls = projectCellAt(x, z, p)
        if (cls.water) continue
        checked++
        const alt = Math.max(0, (t.h - p.waterLevel) / Math.max(p.heightScale, 0.001))
        const w = biomeWeightsAtPoint(p, x, z, alt, t.moistureRegion)
        if (cls.biome === 'desert') expect(w.desert).toBeGreaterThan(0.5)
        if (cls.biome === 'swamp') expect(w.swamp).toBeGreaterThan(0.5)
        if (w.desert > 0.5 && w.desert >= w.forest) expect(cls.biome).toBe('desert')
      }
      expect(checked).toBeGreaterThan(0)
    }
  })
})
