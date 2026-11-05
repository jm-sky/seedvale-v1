import type { CombatTargetHandle } from '../combat/combatIntent'
import type { DamageType } from '../combat/damageTypes'
import type { HitProfile } from '../combat/hitLocation'
import type { PhysicalHit } from '../combat/incomingHumanHit'
import type { ToolKind } from '../items/HeldTool'
import type { AnimalAgent, AnimalKind } from './AnimalAgent'
import { ITEM_CATALOG } from '../items/itemCatalog'

export type { HealthState } from '../shared/HealthState'
export { createHealthState } from '../shared/HealthState'

export const MAX_HP: Record<AnimalKind, number> = {
  wolf: 50,
  fox: 25,
  deer: 30,
  stag: 40,
  rabbit: 10,
  duck: 8,
  boar: 35,
  bear: 150,
  horse: 80,
  donkey: 55,
  cow: 70,
  sheep: 22,
  chicken: 6,
  rooster: 7,
  dog: 40,
  rat: 6,
}

/** Predator kind -> prey kind -> damage per attack. */
const DAMAGE_TABLE: Partial<Record<AnimalKind, Partial<Record<AnimalKind, number>>>> = {
  wolf: { deer: 15, stag: 12, boar: 10, sheep: 14, donkey: 14, chicken: 20, rooster: 20 },
  fox: { deer: 10, stag: 6, rabbit: 20, duck: 18, chicken: 20, rooster: 20 },
  // Large omnivorous predator — hits harder than wolf across the board (plan 188).
  bear: { deer: 26, stag: 22, boar: 20, sheep: 24, donkey: 22, cow: 20, chicken: 28, rooster: 28 },
  // Household dogs hunt settlement rats physically (plan quests-progression-013 §13).
  dog: { rat: 2 },
}

const DEFAULT_DAMAGE = 8

/** Flat predator → human damage (plan 056). Not keyed by prey kind — humans
 *  are not `AnimalKind`. Keep local until shared combat (045) replaces it. */
const HUMAN_DAMAGE: Partial<Record<AnimalKind, number>> = {
  wolf: 12,
  fox: 6,
  bear: 22,
}

/** Explicit species → human-hit profile/type map (proposal §4.1). Exhaustive over `AnimalKind`
 *  so a new species fails type-check until classified; no model-height inference.
 *  Only wolf/fox/bear currently bite humans (`HUMAN_DAMAGE`); the rest keep the small-biter
 *  default so a future attacker still resolves deterministically (future kick/ram = blunt,
 *  gore = pierce are not enabled here). */
export const HUMAN_ATTACK_PROFILE: Readonly<Record<AnimalKind, { profile: HitProfile, damageType: DamageType }>> = {
  wolf: { profile: 'low-bite', damageType: 'pierce' },
  fox: { profile: 'low-bite', damageType: 'pierce' },
  dog: { profile: 'low-bite', damageType: 'pierce' },
  rat: { profile: 'low-bite', damageType: 'pierce' },
  rabbit: { profile: 'low-bite', damageType: 'pierce' },
  duck: { profile: 'low-bite', damageType: 'pierce' },
  chicken: { profile: 'low-bite', damageType: 'pierce' },
  rooster: { profile: 'low-bite', damageType: 'pierce' },
  deer: { profile: 'low-bite', damageType: 'pierce' },
  stag: { profile: 'low-bite', damageType: 'pierce' },
  boar: { profile: 'low-bite', damageType: 'pierce' },
  sheep: { profile: 'low-bite', damageType: 'pierce' },
  cow: { profile: 'low-bite', damageType: 'pierce' },
  horse: { profile: 'low-bite', damageType: 'pierce' },
  donkey: { profile: 'low-bite', damageType: 'pierce' },
  bear: { profile: 'large-maul', damageType: 'cut' },
}

/** Typed physical hit for one animal attack on a human; `animalId` is the stable attacker identity. */
export function faunaPhysicalHit(species: AnimalKind, amount: number, animalId: string): PhysicalHit {
  const { profile, damageType } = HUMAN_ATTACK_PROFILE[species]
  return { amount, damageType, source: 'fauna', attackerId: animalId, profile, blockable: true }
}

/** Held tools that can hit an animal on `[E]` (sword > axe > pitchfork > knife = sickle > shovel).
 *  Roadmap: branch melee + item durability — see
 *  `docs/items/CATALOG.md` / `items/itemCatalog.ts` (`ITEM_SYSTEM_ROADMAP`). */
export type MeleeToolKind = Extract<
  ToolKind,
  | 'long_sword'
  | 'spear'
  | 'short_sword'
  | 'axe'
  | 'pitchfork'
  | 'knife'
  | 'sickle'
  | 'shovel'
  | 'damascus_knife'
  | 'damascus_short_sword'
  | 'damascus_long_sword'
  | 'obsidian_sword'
  | 'battle_axe'
  | 'masterwork_sword'
  | 'obsidian_knife'
  | 'halberd'
  | 'mace'
  | 'obsidian_dagger'
  | 'club'
  | 'war_hammer'
  | 'staff'
  | 'ashgrove_dagger'
  | 'millbrook_shortsword'
  | 'fenmoor_sword'
  | 'stonebridge_longsword'
  | 'pinewatch_longsword'
  | 'kestrel_dagger'
  | 'harrow_shortsword'
  | 'ironvale_sword'
  | 'greywatch_longsword'
  | 'sword'
>

/** `ITEM_CATALOG[kind].melee` is the single source of truth for which tools
 *  are melee-capable and their damage/timing (plan 123) — this is a thin type
 *  guard over that, not a parallel list. */
export function isMeleeTool(kind: ToolKind | null | undefined): kind is MeleeToolKind {
  return kind != null && ITEM_CATALOG[kind]?.melee != null
}

export function damageFor(predator: AnimalKind, prey: AnimalKind): number {
  return DAMAGE_TABLE[predator]?.[prey] ?? DEFAULT_DAMAGE
}

export function damageVsHuman(predator: AnimalKind): number {
  return HUMAN_DAMAGE[predator] ?? DEFAULT_DAMAGE
}

/** `CombatTargetHandle` for an `AnimalAgent` (plan 177 §5/§14) — the NPC
 *  Combat's own target seam over the existing animal HealthState/death path,
 *  not a second animal-combat system. `AnimalAgent.takeDamage`'s
 *  `source: 'npc'` reuses its existing player-attack provocation reaction. */
export function combatTargetForAnimal(animal: AnimalAgent): CombatTargetHandle {
  return {
    ref: { id: animal.animalId, kind: 'animal' },
    getPosition: () => (animal.isDead() ? null : { x: animal.mesh.position.x, z: animal.mesh.position.z }),
    isAlive: () => !animal.isDead(),
    applyDamage: (hit) => animal.takeDamage(hit.amount, 'npc', hit.attackerId),
  }
}
