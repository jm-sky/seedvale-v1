import { describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { RiverShoreCandidate } from '../terrain/riverNetwork'
import { createNaturalWaterKindAt } from './animalNaturalWater'

const region = { oceanThreshold: 0.3, coastThreshold: 0.5 } as RegionParams

function riverCandidate(overrides: Partial<RiverShoreCandidate> = {}): RiverShoreCandidate {
  return {
    x: 0,
    z: 0,
    elevation: 10,
    accumulation: 20,
    distanceToWaterEdge: 0,
    bankX: 0,
    bankZ: 0,
    ...overrides,
  }
}

describe('createNaturalWaterKindAt (plan world-terrain-046)', () => {
  it('is null with no shore nearby', () => {
    const kindAt = createNaturalWaterKindAt({
      sampleHeight: () => 10,
      waterLevel: 0,
      sampleContinentalness: () => 1,
      region,
      riverShoreQuery: () => null,
    })
    expect(kindAt(0, 0)).toBeNull()
  })

  it('classifies an elevated river shore purely from riverShoreQuery, with terrain never dipping near waterLevel', () => {
    const kindAt = createNaturalWaterKindAt({
      sampleHeight: () => 100,
      waterLevel: 0,
      sampleContinentalness: () => 1,
      region,
      riverShoreQuery: () => riverCandidate({ distanceToWaterEdge: 0.3 }),
    })
    expect(kindAt(5, 5)).toBe('river')
  })

  it('classifies a lake shore from the flat probe when no river candidate is nearby', () => {
    const kindAt = createNaturalWaterKindAt({
      sampleHeight: () => -1,
      waterLevel: 0,
      sampleContinentalness: () => 1,
      region,
      riverShoreQuery: () => null,
    })
    expect(kindAt(0, 0)).toBe('lake')
  })

  it('calls riverShoreQuery with the same point it was asked to classify', () => {
    const calls: Array<[number, number]> = []
    const kindAt = createNaturalWaterKindAt({
      sampleHeight: () => 100,
      waterLevel: 0,
      sampleContinentalness: () => 1,
      region,
      riverShoreQuery: (x, z) => {
        calls.push([x, z])
        return null
      },
    })
    kindAt(12, -7)
    expect(calls).toEqual([[12, -7]])
  })
})
