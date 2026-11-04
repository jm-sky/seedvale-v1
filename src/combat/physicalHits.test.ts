import { describe, expect, it } from 'vitest'
import { fallPhysicalHit, trapPhysicalHit } from './physicalHits'

describe('environmental typed hits', () => {
  it('trap blade is hands/cut, unblockable and keyed by the stable container id', () => {
    const hit = trapPhysicalHit(9, 'chest:42')
    expect(hit).toMatchObject({ amount: 9, damageType: 'cut', source: 'trap', forcedLocation: 'hands', blockable: false })
    expect(hit.attackerId).toBe('trap:chest:42')
    expect(trapPhysicalHit(9, 'chest:43').attackerId).not.toBe(hit.attackerId)
  })

  it('mount fall is blunt on the fall profile, unblockable and keyed by the explicit mount id', () => {
    const hit = fallPhysicalHit(14, 'horse:3')
    expect(hit).toMatchObject({ amount: 14, damageType: 'blunt', source: 'fall', profile: 'fall', blockable: false })
    expect(hit.forcedLocation).toBeUndefined()
    expect(hit.attackerId).toBe('fall:horse:3')
  })
})
