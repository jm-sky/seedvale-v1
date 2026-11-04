import { describe, expect, it } from 'vitest'
import type { HumanHitResult } from '../combat/incomingHumanHit'
import { formatLastHitLine } from './lastHitFeedback'

const BASE: HumanHitResult = {
  outcome: 'none',
  attempted: false,
  location: 'legs',
  damageType: 'pierce',
  rawDamage: 14,
  postDefenseDamage: 14,
  armorPrevented: 4,
  finalDamage: 10,
}

describe('formatLastHitLine', () => {
  it('names location, channel, HP lost and armor prevented separately', () => {
    expect(formatLastHitLine(BASE)).toBe('Nogi · kłucie · utracono 10 HP · pancerz powstrzymał 4')
  })

  it('omits the armor part when armor prevented nothing', () => {
    expect(formatLastHitLine({ ...BASE, armorPrevented: 0, finalDamage: 14 })).toBe('Nogi · kłucie · utracono 14 HP')
  })

  it('marks a partial block before the armor result', () => {
    expect(formatLastHitLine({ ...BASE, outcome: 'partial', attempted: true, postDefenseDamage: 9.9, finalDamage: 6.9, armorPrevented: 3 }))
      .toBe('Blok częściowy · Nogi · kłucie · utracono 6.9 HP · pancerz powstrzymał 3')
  })

  it('reports a full block without location or armor credit', () => {
    expect(formatLastHitLine({ ...BASE, outcome: 'full', attempted: true, location: null, postDefenseDamage: 0, finalDamage: 0, armorPrevented: 0 }))
      .toBe('Blok całkowity · kłucie · utracono 0 HP')
  })
})
