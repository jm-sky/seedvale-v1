import { describe, expect, it } from 'vitest'
import { Inventory } from '../items/Inventory'
import { createLiquidContainerInstance, fillLiquidContainer } from '../items/liquidContainer'
import { createHousehold } from '../settlement/household'
import { createNeedState, NEED_SATISFY_AMOUNT, relieveNeed } from './Needs'
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

  it('two consumers of the last household food unit: only the successful takeFood relieves hunger (plan npc-059)', () => {
    const household = emptyHousehold()
    household.items.add('bread', 1)
    const winner = createNeedState()
    const loser = createNeedState()
    winner.hunger = 0.9
    loser.hunger = 0.9
    expect(tryConsumeHouseholdFood(household, 1)).toBe(true)
    relieveNeed(winner, 'food')
    expect(tryConsumeHouseholdFood(household, 1)).toBe(false)
    expect(household.foodCount()).toBe(0)
    expect(winner.hunger).toBeLessThan(0.9)
    expect(loser.hunger).toBe(0.9)
  })

  it('stale household food after selection leaves hunger unchanged', () => {
    const household = emptyHousehold()
    household.items.add('bread', 1)
    const needs = createNeedState()
    needs.hunger = 0.85
    household.takeFood(1)
    expect(tryConsumeHouseholdFood(household, 1)).toBe(false)
    expect(needs.hunger).toBe(0.85)
  })

  it('stale household water after selection leaves thirst unchanged', () => {
    const household = emptyHousehold(1)
    const needs = createNeedState()
    needs.thirst = 0.85
    expect(household.water.has(HOUSEHOLD_WATER_DRINK_AMOUNT)).toBe(true)
    household.water.remove(household.water.current)
    expect(tryConsumeHouseholdWater(household)).toBe(false)
    expect(needs.thirst).toBe(0.85)
  })

  it('successful household water removal still grants exactly the current relief amount', () => {
    const household = emptyHousehold(HOUSEHOLD_WATER_DRINK_AMOUNT)
    const needs = createNeedState()
    needs.thirst = 0.9
    expect(tryConsumeHouseholdWater(household)).toBe(true)
    relieveNeed(needs, 'water')
    expect(household.water.current).toBe(0)
    expect(needs.thirst).toBeCloseTo(0.9 - NEED_SATISFY_AMOUNT.water)
  })
})
