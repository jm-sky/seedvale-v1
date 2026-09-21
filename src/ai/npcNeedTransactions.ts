import type { Inventory } from '../items/Inventory'
import type { Household } from '../settlement/household'
import type { NeedId } from './Needs'
import { consumeOnePersonalDrink, consumeOnePersonalFood } from './npcPersonalProvisions'

/**
 * Actor-neutral household/personal need transactions (plan npc-058).
 * Live `beginNeed` completions and time-skip catch-up share these success
 * conditions so relief never happens without the owner mutation.
 *
 * @domain npc
 */

/** How much stored household water one drink-at-home visit consumes. */
export const HOUSEHOLD_WATER_DRINK_AMOUNT = 1

/** Atomic household water withdrawal. False when the reserve cannot cover `amount`. */
export function tryConsumeHouseholdWater(
  household: Household | null | undefined,
  amount = HOUSEHOLD_WATER_DRINK_AMOUNT,
): boolean {
  if (!household) return false
  return household.water.tryRemove(amount)
}

/** Atomic household food withdrawal. False when `takeFood` returns null. */
export function tryConsumeHouseholdFood(
  household: Household | null | undefined,
  nowDays = 0,
): boolean {
  if (!household) return false
  return household.takeFood(nowDays) != null
}

/**
 * One food unit from household stock, then personal inventory. Relief is
 * the caller's job and must happen only when this returns true.
 */
export function tryConsumeFoodForNeed(input: {
  household?: Household | null
  personalInventory?: Inventory | null
  nowDays?: number
}): boolean {
  const nowDays = input.nowDays ?? 0
  if (tryConsumeHouseholdFood(input.household, nowDays)) return true
  if (input.personalInventory) return consumeOnePersonalFood(input.personalInventory, nowDays)
  return false
}

/**
 * One household water unit, then a personal drink portion. A positional well
 * is not proof of water and is never treated as a transaction here.
 */
export function tryConsumeWaterForNeed(input: {
  household?: Household | null
  personalInventory?: Inventory | null
}): boolean {
  if (tryConsumeHouseholdWater(input.household)) return true
  if (input.personalInventory) return consumeOnePersonalDrink(input.personalInventory)
  return false
}

/**
 * Coarse time-skip need catch-up. Food/water consume a real source then
 * report success; wood/waterDuty have no movement-free owner transaction
 * and stay unresolved.
 */
export function applyTimeSkipNeedCatchUp(input: {
  need: NeedId
  household?: Household | null
  personalInventory?: Inventory | null
  nowDays?: number
}): boolean {
  if (input.need === 'food') return tryConsumeFoodForNeed(input)
  if (input.need === 'water') return tryConsumeWaterForNeed(input)
  return false
}
