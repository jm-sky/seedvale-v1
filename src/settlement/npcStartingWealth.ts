import type { Role } from '../ai/characters'
import type { Inventory } from '../items/Inventory'
import type { VillageSize } from './families'
import { lifeStageForAge } from './npcPhysicalProfile'

/** Settlement-size baseline (plan settlements-npcs-055) — the same shape as
 *  `VillageSize`, so a new size can't silently fall through unhandled. */
const STARTING_WEALTH_BY_SIZE: Readonly<Record<VillageSize, number>> = {
  OUTPOST: 50,
  SM: 75,
  MD: 100,
  LG: 125,
  XL: 150,
}

/** Small, bounded social-standing modifiers — not a socioeconomic hierarchy,
 *  just enough to keep a Trader/Blacksmith and an elder above an ordinary
 *  same-settlement resident. */
const ROLE_WEALTH_MODIFIER: Partial<Record<Role, number>> = {
  trader: 25,
  blacksmith: 15,
  guard: 5,
}

const ELDER_WEALTH_MODIFIER = 10
const MIN_STARTING_WEALTH = 40
const MAX_STARTING_WEALTH = 180

function isElderModifierEligible(age: number): boolean {
  const stage = lifeStageForAge(age)
  return stage === 'elderly' || stage === 'veryElderly'
}

/**
 * One-time starting coin budget for a fresh ordinary NPC's `personalInventory`
 * (plan settlements-npcs-055) — a real counterparty wallet so ordinary-NPC
 * barter can pay out a net coin balance without minting. Deterministic from
 * settlement size, role and life stage only — no randomness, no relation to
 * how many coins the NPC currently holds. Callers must seed this exactly
 * once, at genuine first `NpcAuthoritativeState` creation (see
 * `needsInitialStartingWealth` on `npcState.ts`); spending or losing coins
 * must never trigger a refill.
 *
 * @domain settlements-npcs
 */
export function resolveNpcStartingCoins(input: {
  size: VillageSize
  role: Role
  age: number
}): number {
  const base = STARTING_WEALTH_BY_SIZE[input.size]
  const roleModifier = ROLE_WEALTH_MODIFIER[input.role] ?? 0
  const elderModifier = isElderModifierEligible(input.age) ? ELDER_WEALTH_MODIFIER : 0
  return Math.min(MAX_STARTING_WEALTH, Math.max(MIN_STARTING_WEALTH, base + roleModifier + elderModifier))
}

/**
 * Seeds `personalInventory` with the one-time starting coin budget, once, at
 * genuine first NPC-state creation (plan settlements-npcs-055) — a no-op on
 * every later call (agent dispose/recreate, settlement unload/reload,
 * `WorldBundle` rebuild) via its own latch, independent of
 * `needsInitialPersonalLoadout` so a starting-wealth policy change can never
 * retroactively reseed a loadout, or vice versa.
 *
 * @domain settlements-npcs
 */
export function seedNpcStartingWealthIfNeeded(
  personalInventory: Inventory,
  state: { needsInitialStartingWealth: boolean },
  input: { size: VillageSize, role: Role, age: number },
): void {
  if (!state.needsInitialStartingWealth) return
  const coins = resolveNpcStartingCoins(input)
  if (coins > 0) personalInventory.add('coin', coins)
  state.needsInitialStartingWealth = false
}
