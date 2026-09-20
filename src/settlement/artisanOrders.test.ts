import { describe, expect, it } from 'vitest'
import type { ArtisanProfile } from './artisanProfile'
import { BLACKSMITH_KNIFE_PRODUCTION, BLACKSMITH_MASTERWORK_SWORD_PRODUCTION } from '../economy/production'
import { createSettlementEconomy } from '../economy/settlementEconomy'
import { Inventory } from '../items/Inventory'
import { isWeaponItemInstance } from '../items/itemInstances'
import {
  acceptArtisanOrder,
  completeArtisanOrder,
  listArtisanOrderCatalog,
  pickupArtisanOrder,
} from './artisanOrders'
import { createHousehold } from './household'
import { createNpcAuthoritativeState } from './npcState'

const DEMANDS = [
  { kind: 'wood' as const, target: 0 },
  { kind: 'food' as const, target: 0 },
  { kind: 'water' as const, target: 0 },
]

function smithProfile(overrides: Partial<ArtisanProfile> = {}): ArtisanProfile {
  return {
    baseSkill: 80,
    experience: 0,
    specializations: ['swords'],
    exclusive: false,
    ...overrides,
  }
}

function economyWith(iron: number, coal: number) {
  const economy = createSettlementEconomy('s', {}, DEMANDS)
  if (iron > 0) economy.add('iron', iron, 0)
  if (coal > 0) economy.add('coal', coal, 0)
  return economy
}

describe('artisan orders (plan settlements-npcs-056)', () => {
  it('omits recipes the artisan cannot craft from canOrder', () => {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = smithProfile({ baseSkill: 20 })
    const catalog = listArtisanOrderCatalog({
      state,
      economy: economyWith(20, 20),
      household: createHousehold('h', 's', 'home'),
    })
    expect(catalog).not.toBeNull()
    const knife = catalog!.entries.find((entry) => entry.productionId === BLACKSMITH_KNIFE_PRODUCTION.id)
    const masterwork = catalog!.entries.find((entry) => entry.productionId === BLACKSMITH_MASTERWORK_SWORD_PRODUCTION.id)
    expect(knife?.canOrder).toBe(true)
    expect(masterwork?.canOrder).toBe(false)
  })

  it('rejects missing materials with no partial mutation', () => {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = smithProfile()
    const household = createHousehold('h', 's', 'home')
    const player = new Inventory({ coin: 100 })
    const economy = economyWith(0, 0)
    const result = acceptArtisanOrder({
      state,
      economy,
      household,
      playerInventory: player,
      productionId: BLACKSMITH_KNIFE_PRODUCTION.id,
      simTime: 1,
    })
    expect(result).toMatchObject({ ok: false, reason: 'missing-materials' })
    expect(player.count('coin')).toBe(100)
    expect(state.artisanOrders).toEqual([])
    expect(economy.query('iron')).toBe(0)
  })

  it('charges exactly the material-value deposit and does not spawn output at acceptance', () => {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = smithProfile()
    const household = createHousehold('h', 's', 'home')
    const player = new Inventory({ coin: 40 })
    const economy = economyWith(4, 2)
    const result = acceptArtisanOrder({
      state,
      economy,
      household,
      playerInventory: player,
      productionId: BLACKSMITH_KNIFE_PRODUCTION.id,
      simTime: 2,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.order.paidMaterialCost).toBe(10)
    expect(result.order.status).toBe('accepted')
    expect(result.order.outputInstanceId).toBeUndefined()
    expect(player.count('coin')).toBe(30)
    expect(state.personalInventory.count('coin')).toBe(10)
    expect(household.items.countInstances('knife')).toBe(0)
    expect(economy.query('iron')).toBe(4)
  })

  it('completes through shared production and pickups the exact instance once', () => {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = smithProfile()
    const household = createHousehold('h', 's', 'home')
    const player = new Inventory({ coin: 40 })
    const economy = economyWith(4, 2)
    const accepted = acceptArtisanOrder({
      state,
      economy,
      household,
      playerInventory: player,
      productionId: BLACKSMITH_KNIFE_PRODUCTION.id,
      simTime: 3,
    })
    expect(accepted.ok).toBe(true)
    if (!accepted.ok) return

    const completed = completeArtisanOrder({
      state,
      economy,
      household,
      orderId: accepted.order.id,
      simTime: 4,
    })
    expect(completed.ok).toBe(true)
    if (!completed.ok) return
    expect(completed.order.status).toBe('ready')
    expect(completed.order.outputInstanceId).toBe(`${accepted.order.id}:output`)
    expect(household.items.getInstance(completed.order.outputInstanceId!)?.kind).toBe('knife')
    expect(isWeaponItemInstance(household.items.getInstance(completed.order.outputInstanceId!)!)).toBe(true)
    expect(economy.query('iron')).toBe(3)
    expect(economy.query('coal')).toBe(1)
    expect(state.artisanProfile.experience).toBeGreaterThan(0)

    const first = pickupArtisanOrder({
      state,
      household,
      playerInventory: player,
      orderId: accepted.order.id,
    })
    expect(first.ok).toBe(true)
    if (!first.ok) return
    expect(first.order.status).toBe('collected')
    expect(player.getInstance(completed.order.outputInstanceId!)?.kind).toBe('knife')
    expect(household.items.getInstance(completed.order.outputInstanceId!)).toBeNull()

    const second = pickupArtisanOrder({
      state,
      household,
      playerInventory: player,
      orderId: accepted.order.id,
    })
    expect(second.ok).toBe(false)
    expect(player.countInstances('knife')).toBe(1)
  })

  it('rejects an unavailable recipe without charging', () => {
    const state = createNpcAuthoritativeState('npc:smith', 0)
    state.artisanProfile = smithProfile({ baseSkill: 20 })
    const player = new Inventory({ coin: 80 })
    const result = acceptArtisanOrder({
      state,
      economy: economyWith(10, 10),
      household: createHousehold('h', 's', 'home'),
      playerInventory: player,
      productionId: BLACKSMITH_MASTERWORK_SWORD_PRODUCTION.id,
      simTime: 1,
    })
    expect(result).toEqual({ ok: false, reason: 'insufficient-skill' })
    expect(player.count('coin')).toBe(80)
  })
})
