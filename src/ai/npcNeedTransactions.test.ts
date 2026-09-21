import { describe, expect, it } from 'vitest'
import { Inventory } from '../items/Inventory'
import { createLiquidContainerInstance, fillLiquidContainer } from '../items/liquidContainer'
import { createHousehold } from '../settlement/household'
import { createNeedState, relieveNeed } from './Needs'
import {
  applyTimeSkipNeedCatchUp,
  HOUSEHOLD_WATER_DRINK_AMOUNT,
  tryConsumeFoodForNeed,
  tryConsumeHouseholdFood,
  tryConsumeHouseholdWater,
  tryConsumeWaterForNeed,
} from './npcNeedTransactions'

function emptyHousehold(water = 0) {
  return createHousehold('hh-skip', 's1', 'home:0', {
    water,
    items: { counts: {}, instances: [] },
    agriculture: { starterSeedsGranted: true },
  })
}

describe('npcNeedTransactions (plan npc-058)', () => {
  it('relieves hunger only when household food actually decreases', () => {
    const household = emptyHousehold()
    household.items.add('bread', 2)
    const needs = createNeedState()
    needs.hunger = 0.9
    expect(tryConsumeHouseholdFood(household, 1)).toBe(true)
    relieveNeed(needs, 'food')
    expect(household.items.count('bread')).toBe(1)
    expect(needs.hunger).toBeLessThan(0.9)
  })

  it('leaves hunger unchanged when the household has no food', () => {
    const household = emptyHousehold()
    const needs = createNeedState()
    needs.hunger = 0.9
    expect(tryConsumeHouseholdFood(household, 1)).toBe(false)
    expect(household.foodCount()).toBe(0)
    expect(needs.hunger).toBe(0.9)
  })

  it('relieves thirst only when household water actually decreases', () => {
    const household = emptyHousehold(3)
    const needs = createNeedState()
    needs.thirst = 0.9
    expect(tryConsumeHouseholdWater(household)).toBe(true)
    relieveNeed(needs, 'water')
    expect(household.water.current).toBe(3 - HOUSEHOLD_WATER_DRINK_AMOUNT)
    expect(needs.thirst).toBeLessThan(0.9)
  })

  it('does not clamp-to-zero and still report success when water is insufficient', () => {
    const household = emptyHousehold(0)
    const needs = createNeedState()
    needs.thirst = 0.9
    expect(tryConsumeHouseholdWater(household)).toBe(false)
    expect(household.water.current).toBe(0)
    expect(needs.thirst).toBe(0.9)
  })

  it('does not mint waterDuty or relieve wood without a real transaction', () => {
    const household = emptyHousehold(1)
    expect(applyTimeSkipNeedCatchUp({ need: 'waterDuty', household })).toBe(false)
    expect(applyTimeSkipNeedCatchUp({ need: 'wood', household })).toBe(false)
    expect(household.water.current).toBe(1)
  })

  it('falls back to personal food when the household is empty', () => {
    const household = emptyHousehold()
    const personal = new Inventory()
    personal.add('bread', 1)
    expect(tryConsumeFoodForNeed({ household, personalInventory: personal, nowDays: 1 })).toBe(true)
    expect(personal.count('bread')).toBe(0)
    expect(household.foodCount()).toBe(0)
  })

  it('falls back to a personal drink when household water is empty', () => {
    const household = emptyHousehold(0)
    const personal = new Inventory()
    const filled = fillLiquidContainer(createLiquidContainerInstance('waterskin_small'), 'water')!
    personal.addInstance(filled)
    expect(tryConsumeWaterForNeed({ household, personalInventory: personal })).toBe(true)
    expect(household.water.current).toBe(0)
  })
})
