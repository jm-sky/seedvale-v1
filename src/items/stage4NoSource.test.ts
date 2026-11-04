import { describe, expect, it } from 'vitest'
import { generateMerchantAssortment, HOME_STARTER_MERCHANT_KINDS, PREMIUM_MERCHANT_KINDS, resolveMerchantProfiles } from '../settlement/merchantTrade'
import { ITEM_CATALOG } from './itemCatalog'
import { MERCHANT_STOCK } from './tradeCatalog'

// Extend with each 062 batch; 064 removes entries only when enabling their sources.
const unsourcedKinds = ['obsidian_knife', 'halberd', 'mace', 'sword', 'obsidian_dagger', 'club', 'war_hammer', 'staff', 'ashgrove_dagger', 'millbrook_shortsword', 'fenmoor_sword', 'stonebridge_longsword', 'pinewatch_longsword', 'kestrel_dagger', 'harrow_shortsword', 'ironvale_sword', 'greywatch_longsword', 'marlow_longbow', 'yewmaster_longbow', 'sling_stone', 'bolt_heavy', 'bolt_blunt'] as const

describe('062 registered goods remain unavailable from world sources before 064', () => {
  it('excludes each kind from catalog spawn and every merchant candidate pool', () => {
    for (const kind of unsourcedKinds) {
      expect(ITEM_CATALOG[kind].spawn).toBe('none')
      expect(MERCHANT_STOCK).not.toContain(kind)
      expect(PREMIUM_MERCHANT_KINDS).not.toContain(kind)
      expect(HOME_STARTER_MERCHANT_KINDS).not.toContain(kind)
    }
  })

  it('never generates these goods across reference-seed terrain/size/home sweeps', () => {
    for (const terrain of ['ocean', 'forest', 'swamp', 'mountain', 'desert'] as const) {
      const profiles = resolveMerchantProfiles(['m0', 'm1', 'm2', 'm3'], terrain)
      for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
        for (let offset = 0; offset < 50; offset++) {
          for (const isHome of [false, true]) {
            const stock = generateMerchantAssortment({ terrain, size, seed: 415424794 + offset, isHome }, profiles)
            for (const goods of stock.values()) {
              for (const kind of unsourcedKinds) expect(goods[kind] ?? 0).toBe(0)
            }
          }
        }
      }
    }
  })
})
