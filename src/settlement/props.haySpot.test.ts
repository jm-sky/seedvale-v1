import { describe, expect, it } from 'vitest'
import { dryHaySpot } from './props'

const WATER = 0.45

describe('dryHaySpot (Q96)', () => {
  it('keeps the rolled spot when its whole footprint is dry', () => {
    const spot = dryHaySpot(0, 0, 0, 5, () => 4, WATER)
    expect(spot.x).toBeCloseTo(5)
    expect(spot.z).toBeCloseTo(0)
  })

  it('moves off a shore (water on +x) to a dry angle around the garden', () => {
    const shore = (x: number) => (x > 3 ? WATER : 3)
    const spot = dryHaySpot(0, 0, 0, 5, shore, WATER)
    expect(spot.x + 1.6).toBeLessThanOrEqual(3)
  })

  it('falls back to the highest candidate when no angle is dry (the lodging hay must exist)', () => {
    const spot = dryHaySpot(0, 0, 0, 5, (x) => WATER + 0.1 + Math.max(0, -x) * 0.01, WATER)
    expect(spot.x).toBeLessThan(0)
  })
})
