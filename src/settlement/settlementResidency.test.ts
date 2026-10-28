import { describe, expect, it } from 'vitest'
import { shouldAcceptSettlementResidency } from './SettlementsManager'

const base = {
  isHome: false,
  isEagerStartup: false,
  dist: 0,
  distPlayerToHome: 0,
  playerKnown: true,
  loadRadius: 300,
  unloadRadius: 420,
}

describe('shouldAcceptSettlementResidency', () => {
  it('always accepts home', () => {
    expect(shouldAcceptSettlementResidency({ ...base, isHome: true, dist: 5000 })).toBe(true)
  })

  it('accepts inside the hysteresis band and at exactly unloadRadius', () => {
    expect(shouldAcceptSettlementResidency({ ...base, dist: 350 })).toBe(true)
    expect(shouldAcceptSettlementResidency({ ...base, dist: 420 })).toBe(true)
  })

  it('rejects a non-home build beyond unloadRadius', () => {
    expect(shouldAcceptSettlementResidency({ ...base, dist: 420.01 })).toBe(false)
  })

  it('keeps an eager neighbor while the player is near home or unknown', () => {
    const far = { ...base, isEagerStartup: true, dist: 500 }
    expect(shouldAcceptSettlementResidency({ ...far, distPlayerToHome: 10 })).toBe(true)
    expect(shouldAcceptSettlementResidency({ ...far, distPlayerToHome: 300 })).toBe(true)
    expect(shouldAcceptSettlementResidency({ ...far, playerKnown: false, distPlayerToHome: 9999 })).toBe(true)
  })

  it('rejects an eager neighbor once the player is beyond loadRadius from home', () => {
    expect(shouldAcceptSettlementResidency({
      ...base, isEagerStartup: true, dist: 500, distPlayerToHome: 300.01,
    })).toBe(false)
  })
})
