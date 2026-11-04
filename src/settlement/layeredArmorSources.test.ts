import { describe, expect, it } from 'vitest'
import type { ItemKind } from '../items/items'
import { npcTradeQuantityAvailable } from '../ai/npcTradeAvailability'
import {
  BLACKSMITH_IRON_HELM_PRODUCTION,
  BLACKSMITH_ORDER_PRODUCTIONS,
  BLACKSMITH_STEEL_BRACERS_PRODUCTION,
  productionDefById,
} from '../economy/production'
import { createSettlementEconomy } from '../economy/settlementEconomy'
import { Inventory } from '../items/Inventory'
import { ARMOR_KIND_LIST, type ArmorKind, isArmorItemInstance } from '../items/itemInstances'
import { MERCHANT_STOCK } from '../items/tradeCatalog'
import { acceptArtisanOrder, completeArtisanOrder, listArtisanOrderCatalog, pickupArtisanOrder } from './artisanOrders'
import { createHousehold, createHouseholdRegistry, type HouseholdStartingContext, type HouseholdTradeStockContext } from './household'
import { resolveProfessionStarterGrants } from './householdProfessionStock'
import {
  generateMerchantAssortment,
  resolveMerchantProfiles,
  resolvePremiumMerchantAssignment,
  seedMerchantStockIfNeeded,
} from './merchantTrade'
import { createNpcAuthoritativeState } from './npcState'

const SIZES = ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const
const TERRAINS = ['ocean', 'forest', 'swamp', 'mountain', 'desert'] as const
const NEW_KINDS = ['padded_cap', 'padded_jacket', 'padded_hose', 'iron_helm', 'leather_gloves', 'leather_trousers', 'leather_boots'] as const satisfies readonly ArmorKind[]

function stock(overrides: Partial<HouseholdTradeStockContext> = {}): HouseholdTradeStockContext {
  return { size: 'SM', terrain: 'swamp', dominantResource: null, isHome: false, seed: 1, ...overrides }
}

function grantKinds(starting: HouseholdStartingContext, id = 'h'): ItemKind[] {
  return resolveProfessionStarterGrants(starting, id).map((grant) => grant.kind)
}

/** Kinds some ordinary merchant can stock across a deterministic sweep (regular or premium roll). */
function merchantKinds(): Set<ItemKind> {
  const found = new Set<ItemKind>()
  for (const terrain of TERRAINS) {
    const profiles = resolveMerchantProfiles(['m0', 'm1', 'm2', 'm3'], terrain)
    for (const size of SIZES) {
      for (let offset = 0; offset < 40; offset++) {
        const context = { terrain, size, seed: 415424794 + offset, isHome: offset % 2 === 0 }
        for (const goods of generateMerchantAssortment(context, profiles).values()) {
          for (const [kind, count] of Object.entries(goods)) if (count && count > 0) found.add(kind as ItemKind)
        }
      }
    }
  }
  return found
}

describe('066 A merchant sources', () => {
  const stocked = merchantKinds()

  it('padding, gloves, boots, trousers and leather bracers reach general/hunting traders', () => {
    for (const kind of ['padded_cap', 'padded_jacket', 'padded_hose', 'leather_gloves', 'leather_boots', 'leather_trousers', 'leather_bracers'] as const) {
      expect(stocked.has(kind), kind).toBe(true)
    }
  })

  it('iron_helm and steel_bracers are premium metal goods, never regular stock', () => {
    const profiles = resolveMerchantProfiles(['m0', 'm1', 'm2'], 'mountain')
    const premiumKinds = new Set<ItemKind>()
    for (let offset = 0; offset < 400; offset++) {
      const assignment = resolvePremiumMerchantAssignment({ terrain: 'mountain', size: 'XL', seed: 7 + offset }, profiles)
      if (assignment) premiumKinds.add(assignment.kind)
    }
    expect(premiumKinds.has('iron_helm')).toBe(true)
    expect(premiumKinds.has('steel_bracers')).toBe(true)
  })

  it('keeps assortment capacity and does not append every item everywhere', () => {
    const profiles = resolveMerchantProfiles(['m0'], 'swamp')
    const budget: Record<string, number> = { OUTPOST: 8, SM: 14, MD: 20, LG: 26, XL: 32 }
    for (const size of SIZES) {
      const goods = [...generateMerchantAssortment({ terrain: 'swamp', size, seed: 99 }, profiles).values()][0]!
      const count = Object.keys(goods).length
      expect(count).toBeLessThanOrEqual(budget[size]! + 3)
      expect(NEW_KINDS.filter((kind) => (goods[kind] ?? 0) > 0).length).toBeLessThan(NEW_KINDS.length)
    }
  })

  it('seeding armor stock is deterministic and creates quality instances once', () => {
    const quantities = { padded_cap: 1, leather_boots: 2 } as const
    const make = () => {
      const inventory = new Inventory({}, Infinity, undefined, undefined, Infinity)
      const flag = { merchantStockInitialized: false }
      const context = { size: 'MD' as const, seed: 5, npcId: 'm0', specialization: 'general' as const }
      seedMerchantStockIfNeeded(inventory, flag, quantities, context)
      seedMerchantStockIfNeeded(inventory, flag, quantities, context)
      return inventory.instancesToJSON().map((row) => ({ kind: row.kind, quality: row.quality }))
    }
    const first = make()
    expect(first).toHaveLength(3)
    expect(make()).toEqual(first)
  })
})

describe('066 A household sources', () => {
  it('textile households get exactly one common padded cap, jacket and hose; non-textile get none', () => {
    const household = createHousehold('h-tex', 's', 'home', undefined, { hasTextileWorker: true, tradeStock: stock() })
    for (const kind of ['padded_cap', 'padded_jacket', 'padded_hose'] as const) {
      const instances = household.items.getInstances(kind)
      expect(instances).toHaveLength(1)
      const instance = instances[0]!
      expect(isArmorItemInstance(instance) && instance.quality).toBe('common')
      expect(npcTradeQuantityAvailable(kind, 'household', { role: 'textile_worker', household, personalInventory: new Inventory() }, [])).toBe(1)
    }
    const other = createHousehold('h-none', 's', 'home', undefined, { hasHunter: true, tradeStock: stock() })
    expect(other.items.countInstances('padded_cap')).toBe(0)
  })

  it('hunter stock gives one bracers + boots; gloves/trousers only from MD', () => {
    expect(grantKinds({ hasHunter: true, tradeStock: stock({ size: 'SM' }) })).toEqual(expect.arrayContaining(['leather_bracers', 'leather_boots']))
    const sm = grantKinds({ hasHunter: true, tradeStock: stock({ size: 'SM' }) })
    expect(sm).not.toContain('leather_gloves')
    expect(sm).not.toContain('leather_trousers')
    for (const size of ['MD', 'LG', 'XL'] as const) {
      const kinds = grantKinds({ hasHunter: true, tradeStock: stock({ size }) })
      expect(kinds.filter((kind) => kind === 'leather_bracers')).toHaveLength(1)
      expect(kinds.filter((kind) => kind === 'leather_boots')).toHaveLength(1)
      expect(kinds).toEqual(expect.arrayContaining(['leather_gloves', 'leather_trousers']))
    }
  })

  it('blacksmith stock: one steel_bracers, iron_helm from MD or armor specialization only', () => {
    const sm = grantKinds({ hasBlacksmith: true, tradeStock: stock({ size: 'SM' }) })
    expect(sm.filter((kind) => kind === 'steel_bracers')).toHaveLength(1)
    expect(sm).not.toContain('iron_helm')
    for (const size of ['MD', 'LG', 'XL'] as const) {
      const kinds = grantKinds({ hasBlacksmith: true, tradeStock: stock({ size }) })
      expect(kinds.filter((kind) => kind === 'iron_helm')).toHaveLength(1)
    }
  })

  it('stock is deterministic and never refilled when a household is reconstructed', () => {
    const starting = { hasHunter: true, hasBlacksmith: true, hasTextileWorker: true, tradeStock: stock({ size: 'LG' }) }
    const a = createHousehold('h-all', 's', 'home', undefined, starting)
    const b = createHousehold('h-all', 's', 'home', undefined, starting)
    expect(a.items.instancesToJSON().map((row) => [row.kind, row.quality])).toEqual(b.items.instancesToJSON().map((row) => [row.kind, row.quality]))
    for (const kind of ['padded_jacket', 'leather_boots', 'iron_helm', 'steel_bracers'] as const) {
      for (const instance of a.items.getInstances(kind)) a.items.removeInstance(instance.id)
    }
    const registry = createHouseholdRegistry({ 'h-all': a.snapshot() })
    const restored = registry.getOrCreate('h-all', 's', 'home', starting)
    for (const kind of ['padded_jacket', 'leather_boots', 'iron_helm', 'steel_bracers'] as const) {
      expect(restored.items.countInstances(kind)).toBe(0)
    }
  })

  it('household stock round-trips every new kind through a snapshot with ID and quality', () => {
    const household = createHousehold('h-rt', 's', 'home', undefined, { hasHunter: true, hasBlacksmith: true, hasTextileWorker: true, tradeStock: stock({ size: 'XL' }) })
    const before = household.items.instancesToJSON()
    const restored = createHouseholdRegistry({ 'h-rt': household.snapshot() }).getOrCreate('h-rt', 's', 'home')
    expect(restored.items.instancesToJSON()).toEqual(before)
    const present = new Set(before.map((row) => row.kind))
    for (const kind of NEW_KINDS) expect(present.has(kind), kind).toBe(true)
  })
})

describe('066 A every admitted armor kind has a normal source', () => {
  it('is covered by merchant, household stock or an order recipe', () => {
    const sources = new Set<ItemKind>(merchantKinds())
    for (const terrain of TERRAINS) {
      for (const size of SIZES) {
        for (const kind of grantKinds({ hasHunter: true, hasBlacksmith: true, hasTextileWorker: true, tradeStock: stock({ size, terrain }) })) sources.add(kind)
      }
    }
    for (const def of BLACKSMITH_ORDER_PRODUCTIONS) for (const output of def.itemOutputs ?? []) sources.add(output.kind)
    for (const kind of ARMOR_KIND_LIST) expect(sources.has(kind), kind).toBe(true)
    for (const kind of NEW_KINDS) expect(MERCHANT_STOCK).toContain(kind)
  })
})

describe('066 A artisan recipes and orders', () => {
  it('registers the proposal §8.2 recipes in the orderable list and production registry', () => {
    expect(BLACKSMITH_STEEL_BRACERS_PRODUCTION).toMatchObject({
      id: 'blacksmith.steel_bracers',
      inputs: [{ kind: 'iron', amount: 1 }, { kind: 'coal', amount: 1 }],
      itemOutputs: [{ kind: 'steel_bracers', amount: 1 }],
      artisan: { difficulty: 35, minSkill: 28, specialization: 'armor' },
    })
    expect(BLACKSMITH_IRON_HELM_PRODUCTION).toMatchObject({
      id: 'blacksmith.iron_helm',
      inputs: [{ kind: 'iron', amount: 2 }, { kind: 'coal', amount: 1 }],
      itemOutputs: [{ kind: 'iron_helm', amount: 1 }],
      artisan: { difficulty: 45, minSkill: 38, specialization: 'armor' },
    })
    for (const def of [BLACKSMITH_STEEL_BRACERS_PRODUCTION, BLACKSMITH_IRON_HELM_PRODUCTION]) {
      expect(def.artisan!.exclusive).not.toBe(true)
      expect(BLACKSMITH_ORDER_PRODUCTIONS).toContain(def)
      expect(productionDefById(def.id)).toBe(def)
    }
  })

  function setup(iron: number, coal: number, coin: number, playerInventory = new Inventory({ coin })) {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = { baseSkill: 80, experience: 0, specializations: ['armor'], exclusive: false }
    const economy = createSettlementEconomy('s', {}, [{ kind: 'wood', target: 0 }, { kind: 'food', target: 0 }, { kind: 'water', target: 0 }])
    if (iron > 0) economy.add('iron', iron, 0)
    if (coal > 0) economy.add('coal', coal, 0)
    return { state, economy, household: createHousehold('h', 's', 'home'), player: playerInventory }
  }

  it.each([
    [BLACKSMITH_STEEL_BRACERS_PRODUCTION, 'steel_bracers'],
    [BLACKSMITH_IRON_HELM_PRODUCTION, 'iron_helm'],
  ] as const)('%s: order, quality-fixed completion, pickup once after reload', (def, kind) => {
    const { state, economy, household, player } = setup(4, 2, 500)
    const catalog = listArtisanOrderCatalog({ state, economy, household })!
    expect(catalog.entries.find((entry) => entry.productionId === def.id)?.canOrder).toBe(true)
    const accepted = acceptArtisanOrder({ state, economy, household, playerInventory: player, productionId: def.id, simTime: 1 })
    expect(accepted.ok).toBe(true)
    if (!accepted.ok) return
    const completed = completeArtisanOrder({ state, economy, household, orderId: accepted.order.id, simTime: 2 })
    expect(completed.ok).toBe(true)
    if (!completed.ok) return
    const output = household.items.getInstance(completed.order.outputInstanceId!)!
    expect(output.kind).toBe(kind)
    expect(isArmorItemInstance(output)).toBe(true)
    const qualityBefore = (output as unknown as { quality: string }).quality

    const reloaded = createHouseholdRegistry({ h: household.snapshot() }).getOrCreate('h', 's', 'home')
    const first = pickupArtisanOrder({ state, household: reloaded, playerInventory: player, orderId: accepted.order.id })
    expect(first.ok).toBe(true)
    expect((player.getInstance(output.id) as unknown as { quality: string }).quality).toBe(qualityBefore)
    expect(pickupArtisanOrder({ state, household: reloaded, playerInventory: player, orderId: accepted.order.id }).ok).toBe(false)
    expect(player.countInstances(kind)).toBe(1)
    expect(reloaded.items.getInstance(output.id)).toBeNull()
  })

  it('pickup into a full inventory fails atomically and the order stays collectable', () => {
    const tiny = new Inventory({ coin: 500 }, 0.001)
    const { state, economy, household, player } = setup(4, 2, 500, tiny)
    const accepted = acceptArtisanOrder({ state, economy, household, playerInventory: player, productionId: BLACKSMITH_IRON_HELM_PRODUCTION.id, simTime: 1 })
    expect(accepted.ok).toBe(true)
    if (!accepted.ok) return
    const completed = completeArtisanOrder({ state, economy, household, orderId: accepted.order.id, simTime: 2 })
    expect(completed.ok).toBe(true)
    if (!completed.ok) return
    const id = completed.order.outputInstanceId!
    const result = pickupArtisanOrder({ state, household, playerInventory: player, orderId: accepted.order.id })
    expect(result).toMatchObject({ ok: false, reason: 'full' })
    expect(household.items.getInstance(id)).not.toBeNull()
    expect(player.getInstance(id)).toBeNull()
    expect(state.artisanOrders.find((order) => order.id === accepted.order.id)?.status).toBe('ready')
  })

  it('rejects an order for a recipe the artisan lacks the skill for without charging', () => {
    const { state, economy, household, player } = setup(4, 2, 500)
    state.artisanProfile!.baseSkill = 10
    const coinBefore = player.count('coin')
    const result = acceptArtisanOrder({ state, economy, household, playerInventory: player, productionId: BLACKSMITH_IRON_HELM_PRODUCTION.id, simTime: 1 })
    expect(result.ok).toBe(false)
    expect(player.count('coin')).toBe(coinBefore)
    expect(economy.query('iron')).toBe(4)
  })
})
