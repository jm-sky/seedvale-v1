import { describe, expect, it } from 'vitest'
import type { HumanProtection } from './hitLocation'
import type { HumanHitContext, PhysicalHit } from './incomingHumanHit'
import { AMMO_DAMAGE_TYPE, ARROW_DAMAGE_BONUS, ITEM_CATALOG, rangedConfigFromThrowable } from '../items/itemCatalog'
import { composeLocalResistance, scaleArmorResistance } from './damageTypes'
import { defenseBlockRoll } from './defenseResolver'
import { expectedProtection, HIT_LOCATION_PROFILES, HIT_LOCATIONS, hitLocationRoll, sampleHitLocation } from './hitLocation'
import { resolveIncomingHumanHit } from './incomingHumanHit'

const zero = { cut: 0, pierce: 0, blunt: 0 }
const mail = { cut: .65, pierce: .45, blunt: .15 }
const padding = { cut: .20, pierce: .10, blunt: .25 }
function protection(body = zero): HumanProtection {
  return { head: zero, body, shoulders: zero, forearms: zero, hands: zero, legs: zero, feet: zero }
}
const hit: PhysicalHit = { amount: 20, damageType: 'cut', source: 'melee', attackerId: 'wolf:42', profile: 'reference', forcedLocation: 'body', blockable: true }
const ctx: HumanHitContext = { defenderId: 'player', incomingOrdinal: 1, defense: null, defenseSkill: 0, inArc: true, protection: protection() }

describe('pure anatomical incoming hit', () => {
  it('matches the proposal golden damage fixtures without cross-slot protection', () => {
    const leather = { cut: .35, pierce: .22, blunt: .18 }
    expect(resolveIncomingHumanHit(hit, { ...ctx, protection: protection(leather) }).finalDamage).toBeCloseTo(13)
    expect(resolveIncomingHumanHit({ ...hit, forcedLocation: 'head' }, { ...ctx, protection: protection(leather) }).finalDamage).toBe(20)
    const layered = { ...ctx, protection: protection(composeLocalResistance(padding, mail)) }
    expect(resolveIncomingHumanHit({ ...hit, damageType: 'pierce' }, layered).finalDamage).toBeCloseTo(9.9)
    expect(resolveIncomingHumanHit({ ...hit, damageType: 'blunt' }, layered).finalDamage).toBeCloseTo(12.75)
    const defense = { canBlock: true, baseBlockChance: 0, partialReduction: .55 }
    const ordinal = Array.from({ length: 100 }, (_, i) => i).find(i => defenseBlockRoll(ctx.defenderId, hit.attackerId, i) < .5)!
    const result = resolveIncomingHumanHit({ ...hit, damageType: 'pierce' }, { ...layered, defense, incomingOrdinal: ordinal })
    expect(result.outcome).toBe('partial')
    expect(result.postDefenseDamage).toBeCloseTo(9)
    expect(result.finalDamage).toBeCloseTo(4.455)
    expect(result.armorPrevented + result.finalDamage).toBeCloseTo(result.postDefenseDamage)
  })

  it('full block has no sampled location or armor prevention; unblockable and rear contacts bypass defense', () => {
    const defense = { canBlock: true, baseBlockChance: .95, partialReduction: .55 }
    const ordinal = Array.from({ length: 100 }, (_, i) => i).find(i => defenseBlockRoll(ctx.defenderId, hit.attackerId, i) < .95)!
    const blocking = { ...ctx, defense, incomingOrdinal: ordinal }
    expect(resolveIncomingHumanHit(hit, blocking)).toMatchObject({ outcome: 'full', finalDamage: 0, armorPrevented: 0, location: null })
    expect(resolveIncomingHumanHit({ ...hit, blockable: false }, blocking)).toMatchObject({ attempted: false, finalDamage: 20 })
    expect(resolveIncomingHumanHit(hit, { ...blocking, inArc: false })).toMatchObject({ attempted: false, finalDamage: 20 })
  })

  it('scales quality per channel, caps pieces at .85 and composes layers multiplicatively', () => {
    expect(scaleArmorResistance(mail, 1.2)).toEqual({ cut: .78, pierce: .54, blunt: .18 })
    expect(scaleArmorResistance({ cut: 1, pierce: -1, blunt: 0 }, 1.2)).toEqual({ cut: .85, pierce: 0, blunt: 0 })
    for (const type of ['cut', 'pierce', 'blunt'] as const) expect(composeLocalResistance(zero, mail)[type]).toBeCloseTo(mail[type])
    expect(expectedProtection(protection(mail)).pierce).toBeCloseTo(.1575)
  })

  it('rejects invalid damage; zero does not sample a location', () => {
    for (const amount of [NaN, Infinity, -1]) expect(() => resolveIncomingHumanHit({ ...hit, amount }, ctx)).toThrow(RangeError)
    expect(resolveIncomingHumanHit({ ...hit, amount: 0 }, ctx)).toMatchObject({ attempted: false, location: null, finalDamage: 0 })
  })
})

describe('location determinism', () => {
  it('all profiles sum to 100 and every boundary follows the canonical order', () => {
    for (const profile of ['reference', 'low-bite', 'large-maul', 'fall'] as const) {
      let cumulative = 0
      expect(Object.values(HIT_LOCATION_PROFILES[profile]).reduce((a, b) => a + b, 0)).toBe(100)
      for (const location of HIT_LOCATIONS) {
        const weight = HIT_LOCATION_PROFILES[profile][location]
        if (weight === 0) continue
        expect(sampleHitLocation(profile, cumulative / 100)).toBe(location)
        expect(sampleHitLocation(profile, (cumulative + weight - .00001) / 100)).toBe(location)
        cumulative += weight
      }
    }
    for (const roll of [-1, 1, NaN, Infinity]) expect(() => sampleHitLocation('reference', roll)).toThrow(RangeError)
  })

  it('pins salted framed hash vectors and isolates defense rolls', () => {
    expect(hitLocationRoll('player', 'wolf:42', 1)).toBe(0.8373765363357961)
    expect(hitLocationRoll('npc:17', 'bear:9', 42)).toBe(0.6329844468273222)
    expect(hitLocationRoll('ab', 'c', 1)).not.toBe(hitLocationRoll('a', 'bc', 1))
    expect(hitLocationRoll('player', 'wolf:42', 1)).not.toBe(defenseBlockRoll('player', 'wolf:42', 1))
    const sampled = { ...hit, forcedLocation: undefined }
    expect(resolveIncomingHumanHit(sampled, ctx)).toEqual(resolveIncomingHumanHit(sampled, { ...ctx }))
  })
})

describe('catalog physical classification', () => {
  it('every active melee, ranged, throwable and compatible ammo has an explicit channel', () => {
    for (const entry of Object.values(ITEM_CATALOG)) {
      for (const config of [entry.melee, entry.ranged, entry.throwable]) {
        if (config) expect(['cut', 'pierce', 'blunt'], entry.kind).toContain(config.damageType)
      }
      for (const kind of entry.ranged?.ammoKinds ?? []) expect(['cut', 'pierce', 'blunt'], kind).toContain(AMMO_DAMAGE_TYPE[kind])
    }
    expect(AMMO_DAMAGE_TYPE).toMatchObject({ arrow: 'pierce', broadhead_arrow: 'cut', war_arrow: 'pierce', bolt: 'pierce', stone: 'blunt' })
    expect(ARROW_DAMAGE_BONUS).toEqual({ broadhead_arrow: 4, war_arrow: 8, sling_stone: 2, bolt_heavy: 6 })
    expect(rangedConfigFromThrowable('stone')?.damageType).toBe('blunt')
  })
})
