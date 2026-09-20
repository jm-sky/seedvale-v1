import { describe, expect, it } from 'vitest'
import {
  isShellDigShore,
  isShellSpawnShore,
  SHELL_DIG_MAX_DEPTH_BELOW_WATER,
  SHELL_SPAWN_MAX_HEIGHT_ABOVE_WATER,
  SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER,
} from './coastalResources'

const WATER_LEVEL = 2
const OCEAN_REGION = { oceanThreshold: 0.32, coastThreshold: 0.45 }
const COASTAL_CONTINENTALNESS = 0.4
const INLAND_CONTINENTALNESS = 0.7

describe('isShellSpawnShore', () => {
  it('accepts a candidate close to the ocean shoreline', () => {
    expect(isShellSpawnShore(WATER_LEVEL + 0.5, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(true)
  })

  it('rejects a candidate too low (underwater/shoreline edge)', () => {
    const belowMin = WATER_LEVEL + SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER - 0.01
    expect(isShellSpawnShore(belowMin, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(false)
  })

  it('rejects a candidate too high/dry above the shoreline', () => {
    const aboveMax = WATER_LEVEL + SHELL_SPAWN_MAX_HEIGHT_ABOVE_WATER + 0.01
    expect(isShellSpawnShore(aboveMax, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(false)
  })

  it('never accepts inland/lake-like continentalness regardless of height', () => {
    expect(isShellSpawnShore(WATER_LEVEL + 0.5, WATER_LEVEL, INLAND_CONTINENTALNESS, OCEAN_REGION)).toBe(false)
  })
})

describe('isShellDigShore', () => {
  it('accepts dry ocean-shoreline ground', () => {
    expect(isShellDigShore(WATER_LEVEL + 0.2, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(true)
  })

  it('accepts shallow ocean water within the configured depth', () => {
    const shallow = WATER_LEVEL - SHELL_DIG_MAX_DEPTH_BELOW_WATER + 0.01
    expect(isShellDigShore(shallow, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(true)
  })

  it('rejects ocean water deeper than the configured allowance', () => {
    const tooDeep = WATER_LEVEL - SHELL_DIG_MAX_DEPTH_BELOW_WATER - 0.01
    expect(isShellDigShore(tooDeep, WATER_LEVEL, COASTAL_CONTINENTALNESS, OCEAN_REGION)).toBe(false)
  })

  it('rejects inland/lake-like shallow water at the same depth', () => {
    const shallow = WATER_LEVEL - 0.1
    expect(isShellDigShore(shallow, WATER_LEVEL, INLAND_CONTINENTALNESS, OCEAN_REGION)).toBe(false)
  })
})
