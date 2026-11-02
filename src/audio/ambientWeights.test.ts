import { describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import { type AmbientSamplers, ambientWeightsAt } from './ambientWeights'

// Only the fields read by `ambientWeightsAt` and `biomeWeightsAt` are populated;
// values match `config/worldConfig.ts` defaults (see `biomeRegions.test.ts`).
const REGION = {
  oceanThreshold: 0.32,
  coastThreshold: 0.45,
  desertThreshold: 0.35,
  desertThresholdWidth: 0.12,
  swampThreshold: 0.72,
  swampThresholdWidth: 0.15,
} as RegionParams

const WATER_LEVEL = 0
const HEIGHT_SCALE = 100
/** Inland, grassy continentalness: ocean weight is 0. */
const INLAND = 0.8
/** Mid moisture: forest-dominant biome. */
const MOISTURE = 0.5

function samplersAt(altitude01: number, ridge: number, continentalness = INLAND): AmbientSamplers {
  return {
    sampleFloor: () => WATER_LEVEL + altitude01 * HEIGHT_SCALE,
    sampleHeight: () => WATER_LEVEL + altitude01 * HEIGHT_SCALE,
    sampleContinentalness: () => continentalness,
    sampleMountainRidge: () => ridge,
    sampleMoistureRegion: () => MOISTURE,
    waterLevel: WATER_LEVEL,
    heightScale: HEIGHT_SCALE,
    region: REGION,
  }
}

function mountainAt(altitude01: number, ridge: number): number {
  return ambientWeightsAt(0, 0, samplersAt(altitude01, ridge)).mountain
}

describe('ambientWeightsAt — mountain wind', () => {
  it('is silent on low grassy terrain without ridge', () => {
    expect(mountainAt(0.1, 0)).toBe(0)
  })

  it('is silent on an elevated grassy hill without ridge', () => {
    expect(mountainAt(0.6, 0)).toBe(0)
  })

  it('is silent at high altitude without ridge (altitude alone is not mountain)', () => {
    expect(mountainAt(0.95, 0)).toBe(0)
  })

  it('is partial when entering a mountain region (weak ridge)', () => {
    const m = mountainAt(0.2, 0.15)
    expect(m).toBeGreaterThan(0)
    expect(m).toBeLessThan(0.5)
  })

  it('is active on a genuine mountain slope', () => {
    const m = mountainAt(0.3, 0.5)
    expect(m).toBeGreaterThan(0.4)
    expect(m).toBeLessThanOrEqual(0.5)
  })

  it('is strong on a high ridge/peak', () => {
    expect(mountainAt(0.9, 0.9)).toBeGreaterThan(0.95)
  })

  it('stays within [0, 1] and decreases smoothly as the ridge fades', () => {
    let prev = Number.POSITIVE_INFINITY
    for (let ridge = 1; ridge >= 0; ridge -= 0.01) {
      const m = mountainAt(0.6, ridge)
      expect(m).toBeGreaterThanOrEqual(0)
      expect(m).toBeLessThanOrEqual(1)
      expect(m).toBeLessThanOrEqual(prev + 1e-9)
      prev = m
    }
    expect(prev).toBe(0)
  })

  it('does not change ocean weight', () => {
    const deep = 0.1
    expect(ambientWeightsAt(0, 0, samplersAt(0.1, 0, deep)).ocean).toBe(1)
    expect(ambientWeightsAt(0, 0, samplersAt(0.1, 0.9, deep)).ocean).toBe(1)
    expect(ambientWeightsAt(0, 0, samplersAt(0.1, 0, INLAND)).ocean).toBe(0)
    expect(ambientWeightsAt(0, 0, samplersAt(0.1, 0.9, INLAND)).ocean).toBe(0)
  })

  it('reduces forest weight in proportion to mountain weight', () => {
    const flat = ambientWeightsAt(0, 0, samplersAt(0.2, 0))
    const mountain = ambientWeightsAt(0, 0, samplersAt(0.9, 0.9))
    expect(flat.forest).toBeGreaterThan(0)
    expect(mountain.forest).toBeCloseTo(flat.forest * (1 - mountain.mountain), 6)
  })
})
