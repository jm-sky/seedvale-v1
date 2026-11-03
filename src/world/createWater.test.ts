import { describe, expect, it } from 'vitest'
import { lakeLevelsInChunk, maskHeightsForLakeLevel } from './createWater'

const SEA = 0

describe('lakeLevelsInChunk', () => {
  it('returns nothing for dry land and sea-level water', () => {
    const heights = Float32Array.from([5, 5, 0, 0])
    const floors = Float32Array.from([5, 5, -3, -3])
    expect(lakeLevelsInChunk(heights, floors, SEA)).toEqual([])
  })

  it('lists each distinct lake surface once, ascending', () => {
    const heights = Float32Array.from([40, 40.004, 55, 55, 70])
    const floors = Float32Array.from([38, 38, 53, 50, 70])
    const levels = lakeLevelsInChunk(heights, floors, SEA)
    expect(levels).toHaveLength(2)
    expect(levels[0]).toBeCloseTo(40.004, 3)
    expect(levels[1]).toBeCloseTo(55, 3)
  })
})

describe('maskHeightsForLakeLevel', () => {
  it('keeps the lake texels, soft dry banks, and lifts everything else out of the cover band', () => {
    // wet@40, bank@40.2, low dry ground@30, wet@55 (other lake)
    const heights = Float32Array.from([40, 40.2, 30, 55])
    const floors = Float32Array.from([38, 40.2, 30, 53])
    const out = maskHeightsForLakeLevel(heights, floors, 40)
    expect(out[0]).toBe(40)
    expect(out[1]).toBeCloseTo(40.2, 5)
    expect(out[2]).toBeGreaterThan(40.35)
    expect(out[3]).toBeGreaterThan(40.35)
  })
})
