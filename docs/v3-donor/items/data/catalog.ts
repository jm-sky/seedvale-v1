/**
 * The item catalogue: every equipment entry (weapon, ammo, shield, armour) and every good, with lookup helpers.
 * @domain items
 */
import type { AmmoItem, ArmorItem, BookItem, FoodItem, HerbItem, Item, ItemCategory, MedicalItem, MeleeWeapon, MiscItem, RangedWeapon, ResourceItem, ShieldItem, ToolItem, WeaponItem } from './types'
import { ARMOR } from './armor'
import { GOODS } from './goods'
import { AMMO, MELEE_WEAPONS, RANGED_WEAPONS, SHIELDS } from './weapons'

export const WEAPONS: readonly WeaponItem[] = [...MELEE_WEAPONS, ...RANGED_WEAPONS]

export const ITEMS: readonly Item[] = [...WEAPONS, ...SHIELDS, ...ARMOR, ...AMMO, ...GOODS]

const BY_ID = new Map<string, Item>(ITEMS.map((item) => [item.id, item]))

export function findItem(id: string): Item | undefined {
  return BY_ID.get(id)
}

export function itemById(id: string): Item {
  const item = BY_ID.get(id)
  if (!item) throw new Error(`Unknown item ${id}`)
  return item
}

export function itemsOfCategory(category: ItemCategory): readonly Item[] {
  return ITEMS.filter((item) => item.category === category)
}

export const isWeapon = (item: Item): item is WeaponItem => item.category === 'weapon'
export const isMelee = (item: Item): item is MeleeWeapon => item.category === 'weapon' && item.kind === 'melee'
export const isRanged = (item: Item): item is RangedWeapon => item.category === 'weapon' && item.kind === 'ranged'
export const isArmor = (item: Item): item is ArmorItem => item.category === 'armor'
export const isShield = (item: Item): item is ShieldItem => item.category === 'shield'
export const isAmmo = (item: Item): item is AmmoItem => item.category === 'ammo'
export const isTool = (item: Item): item is ToolItem => item.category === 'tool'
export const isFood = (item: Item): item is FoodItem => item.category === 'food'
export const isHerb = (item: Item): item is HerbItem => item.category === 'herb'
export const isMedical = (item: Item): item is MedicalItem => item.category === 'medical'
export const isResource = (item: Item): item is ResourceItem => item.category === 'resource'
export const isBook = (item: Item): item is BookItem => item.category === 'book'
export const isMisc = (item: Item): item is MiscItem => item.category === 'misc'

/** Items that lose durability in use: weapons, armour, shields and tools (D-ITM-19). Every other item keeps durability 1. */
export const wearsOut = (item: Item): boolean => item.category === 'armor' || item.category === 'shield' || (item.category === 'tool' && item.consumable !== true) || item.category === 'weapon'

/** Categories whose instances merge into one stack (D-ITM-20); tools, books, misc and equipment are single pieces. */
export const STACKING_CATEGORIES: ReadonlySet<ItemCategory> = new Set<ItemCategory>(['ammo', 'food', 'herb', 'medical', 'resource'])

/** Stacking rule per entry: the stacking categories, plus consumable tools (torch, rushlight; D-ITM-24). */
export const stacks = (item: Item): boolean => STACKING_CATEGORIES.has(item.category) || (item.category === 'tool' && item.consumable === true)

/** Items that carry a quality tier: wearing items and ammo (D-ITM-21). Other goods are always average. */
export const takesQuality = (item: Item): boolean => wearsOut(item) || item.category === 'ammo'

/** Damage per second of continuous attacks (damage / cooldown); a ranged weapon also waits for the draw. */
export function weaponDps(weapon: WeaponItem): number {
  const cycle = weapon.kind === 'ranged' ? weapon.cooldown + weapon.drawTime : weapon.cooldown
  return weapon.damage / cycle
}

/** Catalogue maxima for relative UI bars (base entries, no quality/edge). */
export interface WeaponStatCeilings {
  cooldown: number
  damage: number
  dps: number
  reach: number
  sharpness: number
  stamina: number
}

function maxOf(values: number[]): number {
  return values.reduce((a, b) => (b > a ? b : a), 0)
}

function computeWeaponStatCeilings(): WeaponStatCeilings {
  const melee = WEAPONS.filter(isMelee)
  return {
    damage: maxOf(WEAPONS.map((w) => w.damage)),
    cooldown: maxOf(WEAPONS.map((w) => w.cooldown)),
    dps: maxOf(WEAPONS.map((w) => weaponDps(w))),
    stamina: maxOf(WEAPONS.map((w) => w.stamina)),
    reach: maxOf(melee.map((w) => w.reach)),
    sharpness: maxOf(melee.map((w) => w.sharpness)),
  }
}

/** Highest base value of each combat stat across {@link WEAPONS} (module-init cache). Reach/sharpness from melee only. */
export const WEAPON_STAT_CEILINGS: WeaponStatCeilings = computeWeaponStatCeilings()

/** Catalogue maxima for armour relative UI bars (base entries, no quality). */
export interface ArmorStatCeilings {
  resistBlunt: number
  resistCut: number
  resistPierce: number
  speedPenalty: number
}

function computeArmorStatCeilings(): ArmorStatCeilings {
  return {
    resistCut: maxOf(ARMOR.map((a) => a.resist.cut)),
    resistPierce: maxOf(ARMOR.map((a) => a.resist.pierce)),
    resistBlunt: maxOf(ARMOR.map((a) => a.resist.blunt)),
    speedPenalty: maxOf(ARMOR.map((a) => a.speedPenalty)),
  }
}

/** Highest base resist / speed-penalty across {@link ARMOR} (module-init cache). */
export const ARMOR_STAT_CEILINGS: ArmorStatCeilings = computeArmorStatCeilings()

/** Clamp a catalogue-relative strength to 0..1 (quality can slightly exceed a base max). */
export function weaponStatStrength(value: number, ceiling: number): number {
  if (ceiling <= 0) return 0
  return Math.min(1, Math.max(0, value / ceiling))
}

/** Alias — same clamp for any catalogue-relative bar. */
export const catalogueStatStrength = weaponStatStrength
