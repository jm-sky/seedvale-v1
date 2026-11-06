import { describe, expect, it } from 'vitest'
import { rumourBearing, rumourOutcomeLine, rumourSuccessLine, rumourTravelTime } from './rumourLines'

describe('rumourLines', () => {
  it('formats travel time per the approved convention', () => {
    expect(rumourTravelTime(0.4)).toBe("less than an hour's walk")
    expect(rumourTravelTime(1.2)).toBe("about an hour's walk")
    expect(rumourTravelTime(6.2)).toBe("about six hours' walk")
    expect(rumourTravelTime(24.6)).toBe("about 25 hours' walk")
  })
  it('uses world north = -z, east = +x', () => {
    expect(rumourBearing(0, -10)).toBe('north')
    expect(rumourBearing(10, 0)).toBe('east')
    expect(rumourBearing(-10, 10)).toBe('south-west')
    expect(rumourBearing(0, 0)).toBeNull()
  })
  it('fills slots, picks the specialist line and leaves no braces', () => {
    const guard = rumourSuccessLine('cave', 'guard', 'north', "about three hours' walk", 0)
    expect(guard).toBe("There may be a cave to the north, about three hours' walk from here. I can give you the direction, but not the entrance.")
    for (const seed of [0, 1, 2, 3]) {
      expect(rumourSuccessLine('lake', 'adult', 'east', "about an hour's walk", seed)).not.toMatch(/[{}]/)
    }
  })
  it('has outcome lines for every speaker', () => {
    for (const o of ['trust', 'cap', 'none', 'daily'] as const) {
      for (const s of ['adult', 'guard', 'hunter'] as const) expect(rumourOutcomeLine(o, s, 1).length).toBeGreaterThan(0)
    }
  })
})
