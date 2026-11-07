import { describe, expect, it } from 'vitest'
import { Inventory } from '../items/Inventory'
import { isInstanceBackedKind } from '../items/itemInstances'
import { MERCHANT_PRICES, MERCHANT_STOCK } from '../items/tradeCatalog'
import {
  generateMerchantAssortment,
  isPremiumMerchantGood,
  merchantStockQuantity,
  resolveMerchantProfiles,
  seedMerchantStockIfNeeded,
  specializationAffinity,
  STAGE4_AMMO_KINDS,
  STAGE4_ORDINARY_WEAPON_KINDS,
} from './merchantTrade'

const SPECS = ['general', 'weapons-tools', 'food-materials', 'imports-luxury', 'horses'] as const
const REFERENCE_SEED = 415424794
const ALL = [...STAGE4_ORDINARY_WEAPON_KINDS, ...STAGE4_AMMO_KINDS]

describe('items-player-064 O1/O2 Trader sources', () => {
  it('registers every kind in the stock pool with a price', () => {
    for (const kind of ALL) {
      expect(MERCHANT_STOCK).toContain(kind)
      expect(MERCHANT_PRICES[kind]).toBeGreaterThan(0)
    }
  })

  it('gates affinity: weapons-tools only, plus sling_stone for general', () => {
    for (const kind of ALL) {
      for (const spec of SPECS) {
        const expected = spec === 'weapons-tools' ? 2 : spec === 'general' && kind === 'sling_stone' ? 1 : 0
        expect(specializationAffinity(kind, spec)).toBe(expected)
      }
    }
  })

  it('never stocks them outside the allowed specializations and is deterministic', () => {
    let seenWeapon = 0
    let seenAmmo = 0
    for (const terrain of ['ocean', 'forest', 'swamp', 'mountain', 'desert'] as const) {
      const profiles = resolveMerchantProfiles(['m0', 'm1', 'm2', 'm3', 'm4'], terrain)
      for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
        for (let offset = 0; offset < 30; offset++) {
          const context = { terrain, size, seed: REFERENCE_SEED + offset }
          const first = generateMerchantAssortment(context, profiles)
          const second = generateMerchantAssortment(context, profiles)
          expect([...first.entries()]).toEqual([...second.entries()])
          for (const profile of profiles) {
            const goods = first.get(profile.npcId)!
            for (const kind of ALL) {
              const qty = goods[kind] ?? 0
              if (qty === 0) continue
              expect(specializationAffinity(kind, profile.specialization)).toBeGreaterThan(0)
              if (STAGE4_ORDINARY_WEAPON_KINDS.includes(kind)) {
                seenWeapon++
                expect(qty).toBeLessThanOrEqual(2)
              } else seenAmmo++
            }
          }
        }
      }
    }
    expect(seenWeapon).toBeGreaterThan(0)
    expect(seenAmmo).toBeGreaterThan(0)
  })

  it('seeds finite stock once; sold-out stays sold-out after reload-equivalent reseed', () => {
    const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    const latch = { merchantStockInitialized: false }
    seedMerchantStockIfNeeded(stock, latch, { halberd: 2, club: 1, sling_stone: 5, bolt_heavy: 2 })
    for (const kind of ['halberd', 'club', 'sling_stone', 'bolt_heavy'] as const) {
      expect(merchantStockQuantity(stock, kind)).toBeGreaterThan(0)
    }
    expect(isInstanceBackedKind('halberd')).toBe(true)
    while (merchantStockQuantity(stock, 'halberd') > 0) {
      const inst = stock.getInstances('halberd')[0]!
      stock.removeInstance(inst.id)
    }
    seedMerchantStockIfNeeded(stock, latch, { halberd: 2 })
    expect(merchantStockQuantity(stock, 'halberd')).toBe(0)
  })
})

describe('items-player-064 O3 masterwork Trader sources', () => {
  const O3 = ['ashgrove_dagger', 'millbrook_shortsword', 'fenmoor_sword', 'stonebridge_longsword', 'marlow_longbow'] as const

  it('are priced premium stock candidates', () => {
    for (const kind of O3) {
      expect(MERCHANT_STOCK).toContain(kind)
      expect(isPremiumMerchantGood(kind)).toBe(true)
      expect(MERCHANT_PRICES[kind]).toBeGreaterThan(0)
    }
  })

  it('appear only as the single premium unit, scarcely, and reach multiple settlements', () => {
    const seen = new Map<string, number>()
    let settlements = 0
    for (const terrain of ['forest', 'mountain', 'swamp'] as const) {
      const profiles = resolveMerchantProfiles(['m0', 'm1', 'm2', 'm3'], terrain)
      for (let offset = 0; offset < 200; offset++) {
        settlements++
        const stock = generateMerchantAssortment({ terrain, size: 'XL', seed: REFERENCE_SEED + offset }, profiles)
        let o3InSettlement = 0
        for (const goods of stock.values()) {
          for (const kind of O3) {
            const qty = goods[kind] ?? 0
            expect(qty).toBeLessThanOrEqual(1)
            if (qty > 0) { o3InSettlement++; seen.set(kind, (seen.get(kind) ?? 0) + 1) }
          }
        }
        expect(o3InSettlement).toBeLessThanOrEqual(1)
      }
    }
    for (const kind of O3) expect(seen.get(kind) ?? 0).toBeGreaterThan(0)
    expect([...seen.values()].reduce((a, b) => a + b, 0)).toBeLessThan(settlements)
  })

  it('seeds as durable instances (maintenance weapons / bow) once', () => {
    const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    const latch = { merchantStockInitialized: false }
    seedMerchantStockIfNeeded(stock, latch, { ashgrove_dagger: 1, marlow_longbow: 1 })
    expect(merchantStockQuantity(stock, 'ashgrove_dagger')).toBe(1)
    expect(merchantStockQuantity(stock, 'marlow_longbow')).toBe(1)
    expect(isInstanceBackedKind('ashgrove_dagger')).toBe(true)
  })
})
