import { describe, expect, it } from 'vitest'
import { formatCoins } from './formatCoins'

describe('formatCoins', () => {
  it('formats non-positive as 0c', () => {
    expect(formatCoins(0)).toBe('0c')
    expect(formatCoins(-5)).toBe('0c')
  })

  it('omits zero tiers', () => {
    expect(formatCoins(12)).toBe('12c')
    expect(formatCoins(240)).toBe('2s 40c')
    expect(formatCoins(100)).toBe('1s')
    expect(formatCoins(10000)).toBe('1g')
  })

  it('splits gold silver copper', () => {
    expect(formatCoins(12345)).toBe('1g 23s 45c')
  })
})
