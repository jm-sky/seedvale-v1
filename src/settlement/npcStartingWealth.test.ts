import { describe, expect, it } from 'vitest'
import { Inventory } from '../items/Inventory'
import { resolveNpcStartingCoins, seedNpcStartingWealthIfNeeded } from './npcStartingWealth'

describe('resolveNpcStartingCoins (plan settlements-npcs-055)', () => {
  it('uses the settlement-size baseline for an ordinary adult resident', () => {
    expect(resolveNpcStartingCoins({ size: 'OUTPOST', role: 'farmer', age: 30 })).toBe(50)
    expect(resolveNpcStartingCoins({ size: 'SM', role: 'farmer', age: 30 })).toBe(75)
    expect(resolveNpcStartingCoins({ size: 'MD', role: 'farmer', age: 30 })).toBe(100)
    expect(resolveNpcStartingCoins({ size: 'LG', role: 'farmer', age: 30 })).toBe(125)
    expect(resolveNpcStartingCoins({ size: 'XL', role: 'farmer', age: 30 })).toBe(150)
  })

  it('starts a Trader above an ordinary resident in the same settlement', () => {
    const ordinary = resolveNpcStartingCoins({ size: 'MD', role: 'farmer', age: 30 })
    const trader = resolveNpcStartingCoins({ size: 'MD', role: 'trader', age: 30 })
    expect(trader).toBeGreaterThan(ordinary)
  })

  it('starts a Blacksmith above an ordinary resident in the same settlement', () => {
    const ordinary = resolveNpcStartingCoins({ size: 'MD', role: 'farmer', age: 30 })
    const blacksmith = resolveNpcStartingCoins({ size: 'MD', role: 'blacksmith', age: 30 })
    expect(blacksmith).toBeGreaterThan(ordinary)
  })

  it('applies an elder modifier derived from life stage, not a separate flag', () => {
    const adult = resolveNpcStartingCoins({ size: 'MD', role: 'farmer', age: 30 })
    const elder = resolveNpcStartingCoins({ size: 'MD', role: 'farmer', age: 80 })
    expect(elder).toBeGreaterThan(adult)
  })

  it('clamps the final value to a narrow, bounded range', () => {
    const min = resolveNpcStartingCoins({ size: 'OUTPOST', role: 'farmer', age: 30 })
    const max = resolveNpcStartingCoins({ size: 'XL', role: 'trader', age: 80 })
    expect(min).toBeGreaterThanOrEqual(40)
    expect(max).toBeLessThanOrEqual(180)
  })

  it('is deterministic for the same inputs', () => {
    const input = { size: 'LG' as const, role: 'guard' as const, age: 50 }
    expect(resolveNpcStartingCoins(input)).toBe(resolveNpcStartingCoins(input))
  })
})

describe('seedNpcStartingWealthIfNeeded (plan settlements-npcs-055)', () => {
  it('seeds coins exactly once on genuine first creation', () => {
    const inventory = new Inventory()
    const state = { needsInitialStartingWealth: true }
    seedNpcStartingWealthIfNeeded(inventory, state, { size: 'MD', role: 'farmer', age: 30 })
    expect(inventory.count('coin')).toBe(100)
    expect(state.needsInitialStartingWealth).toBe(false)

    seedNpcStartingWealthIfNeeded(inventory, state, { size: 'XL', role: 'trader', age: 80 })
    expect(inventory.count('coin')).toBe(100)
  })

  it('never seeds coins for a restored/snapshotted state', () => {
    const inventory = new Inventory()
    const state = { needsInitialStartingWealth: false }
    seedNpcStartingWealthIfNeeded(inventory, state, { size: 'MD', role: 'farmer', age: 30 })
    expect(inventory.count('coin')).toBe(0)
  })

  it('does not refill after the NPC has spent its starting coins', () => {
    const inventory = new Inventory()
    const state = { needsInitialStartingWealth: true }
    seedNpcStartingWealthIfNeeded(inventory, state, { size: 'SM', role: 'farmer', age: 30 })
    inventory.remove('coin', inventory.count('coin'))
    expect(inventory.count('coin')).toBe(0)
    seedNpcStartingWealthIfNeeded(inventory, state, { size: 'SM', role: 'farmer', age: 30 })
    expect(inventory.count('coin')).toBe(0)
  })
})
