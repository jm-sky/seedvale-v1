import { describe, expect, it } from 'vitest'
import { DEFAULT_FAR_TERRAIN_RADIUS, parseFarTerrainFlag } from './farTerrainFlag'

describe('parseFarTerrainFlag', () => {
  it('is off when absent or explicitly disabled', () => {
    expect(parseFarTerrainFlag(null, false)).toBeNull()
    for (const v of ['0', 'false', 'no', 'off']) expect(parseFarTerrainFlag(v, true)).toBeNull()
  })

  it('uses the default radius for bare / truthy values', () => {
    expect(parseFarTerrainFlag(null, true)).toBe(DEFAULT_FAR_TERRAIN_RADIUS)
    expect(parseFarTerrainFlag('', true)).toBe(DEFAULT_FAR_TERRAIN_RADIUS)
    expect(parseFarTerrainFlag('1', true)).toBe(DEFAULT_FAR_TERRAIN_RADIUS)
    expect(parseFarTerrainFlag('true', true)).toBe(DEFAULT_FAR_TERRAIN_RADIUS)
  })

  it('accepts a radius and clamps it to 400–1000 m', () => {
    expect(parseFarTerrainFlag('600', true)).toBe(600)
    expect(parseFarTerrainFlag('1000', true)).toBe(1000)
    expect(parseFarTerrainFlag('5000', true)).toBe(1000)
    expect(parseFarTerrainFlag('100', true)).toBe(400)
    expect(parseFarTerrainFlag('abc', true)).toBeNull()
  })
})
