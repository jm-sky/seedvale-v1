/**
 * Item contract: equipment (weapons, ammo, shields, armour) and goods (tools, food, herbs, medical, resources, books, misc). Pure data types, no engine imports (data layer).
 * Units: weight kg, reach/range m, time s, price copper coins (100c = 1s, 100s = 1g).
 * Merged from v1 (`items/itemCatalog.ts`, `equipment.ts`) and v2 (`game/data/items.ts`); see docs/comparison/items-equipment.md.
 * @domain items
 */
import type { SkillId } from '../character/types'

export type DamageType = 'blunt' | 'cut' | 'pierce'

export type SizeClass = 'LG' | 'MD' | 'SM' | 'XL' | 'XS' | 'XXS'

/** Equipment (`ammo`, `armor`, `shield`, `weapon`) and goods (the rest, D-ITM-19). */
export type ItemCategory = 'ammo' | 'armor' | 'book' | 'food' | 'herb' | 'medical' | 'misc' | 'resource' | 'shield' | 'tool' | 'weapon'

export type ItemMaterial = 'bone' | 'cloth' | 'damascus' | 'iron' | 'leather' | 'mineral' | 'mixed' | 'obsidian' | 'organic' | 'paper' | 'steel' | 'wood'

/** `masterwork` and `legendary` are hand-made pieces above the best normal quality: rare finds, never crafted or restocked. Every legendary definition is unique. */
export type ItemTier = 'common' | 'legendary' | 'masterwork'

/**
 * `active` must be obtainable in the game; `future` is catalogue-only (not in stores, loot or recipes yet);
 * `quest-only` is an authored quest reward; `unique` is a single deliberate instance (mandatory for legendary entries).
 */
export type ItemAvailability = 'active' | 'future' | 'quest-only' | 'unique'

/** Where the entry comes from, for curation and save bridging. */
export type ItemOrigin = 'merged' | 'new' | 'v1' | 'v2'

export interface LegacyIds {
  v1?: string
  v2?: string
}

export interface ItemBase {
  id: string
  name: string
  /** Player-facing, one or two sentences. */
  description: string
  category: ItemCategory
  material: ItemMaterial
  tier: ItemTier
  weight: number
  size: SizeClass
  price: number
  /** Hit points of the item before it breaks (at average quality). */
  durability: number
  availability: ItemAvailability
  origin: ItemOrigin
  legacyIds?: LegacyIds
  /** One-line history of a masterwork / legendary piece. */
  lore?: string
}

// --- Weapons -----------------------------------------------------------------------------------------------

export type MeleeClass = 'axe' | 'dagger' | 'hammer' | 'mace' | 'polearm' | 'spear' | 'staff' | 'sword'
export type RangedClass = 'bow' | 'crossbow' | 'sling'
export type WeaponClass = MeleeClass | RangedClass

export type Grip = 'one-handed' | 'two-handed'

export type AmmoKind = 'arrow' | 'bolt' | 'stone'

/** Tool capability a weapon also provides (an axe chops, a knife cuts). */
export type WeaponCapability = 'chop' | 'cut'

interface WeaponBase extends ItemBase {
  category: 'weapon'
  grip: Grip
  /** Damage per hit at average quality. */
  damage: number
  damageType: DamageType
  /** Seconds between swings or shots (gameplay seconds). */
  cooldown: number
  /** Stamina spent per swing or shot. */
  stamina: number
  capabilities?: WeaponCapability[]
}

export interface MeleeWeapon extends WeaponBase {
  kind: 'melee'
  weaponClass: MeleeClass
  /** Reach in metres. */
  reach: number
  /** 0-1: how well the edge keeps cutting; 0 for blunt weapons. */
  sharpness: number
}

export interface RangedWeapon extends WeaponBase {
  kind: 'ranged'
  weaponClass: RangedClass
  /** Effective range in metres. */
  range: number
  ammo: AmmoKind
  /** Seconds to a full draw / sling swing. */
  drawTime: number
  /** Projectile speed, m/s. */
  projectileSpeed: number
}

export type WeaponItem = MeleeWeapon | RangedWeapon

export interface AmmoItem extends ItemBase {
  category: 'ammo'
  ammoKind: AmmoKind
  /** Added to the weapon's damage. */
  damageBonus: number
  damageType: DamageType
}

// --- Shields -----------------------------------------------------------------------------------------------

export type ShieldClass = 'buckler' | 'heater' | 'round'

export interface ShieldItem extends ItemBase {
  category: 'shield'
  shieldClass: ShieldClass
  /** Frontal arc that is covered, degrees. */
  arcDeg: number
  /** Fraction of damage removed on a block. */
  reduction: number
  /** Share of the blocked damage that does not wear the shield down. */
  efficiency: number
  parryWindowS: number
  canParry: boolean
}

// --- Armour ------------------------------------------------------------------------------------------------

export type ArmorSlot = 'feet' | 'forearms' | 'hands' | 'head' | 'legs' | 'shoulders' | 'torso'

/** An `under` piece (padding) and an `outer` piece (armour) can share a slot. */
export type ArmorLayer = 'outer' | 'under'

export type ArmorFamily = 'leather' | 'mail' | 'padded' | 'plate' | 'studded'

/** Fraction (0-0.95) of incoming damage of each type that a piece removes. */
export type Resist = Record<DamageType, number>

export interface ArmorItem extends ItemBase {
  category: 'armor'
  slot: ArmorSlot
  layer: ArmorLayer
  family: ArmorFamily
  resist: Resist
  /** Fraction of walking speed lost; negative = faster. */
  speedPenalty: number
}

// --- Goods (non-equipment) ----------------------------------------------------------------------------------
// Goods set `durability: 1` (a convention, D-ITM-19); only tools wear out among them. Units: kg, copper, calendar hours.

/** Tool capability (v2 `Capability`, same ids). */
export type ToolCapability = 'carry_water' | 'chop' | 'cook_vessel' | 'cut' | 'dig' | 'fire_start' | 'fish' | 'hammer' | 'light' | 'mine' | 'scoop' | 'sew' | 'sharpen'

export interface ToolItem extends ItemBase {
  category: 'tool'
  /** Gameplay capabilities for recipe gating. Empty = a carried or crafted object whose function is carried by its other fields (carryBonusKg, saddle, cart, waterCapacityL) or comes later with recipes, B5-2 (D-ITM-25). */
  capabilities: ToolCapability[]
  /** Waterskin, bucket. */
  waterCapacityL?: number
  /** Torch, rushlight. */
  lightRadiusM?: number
  /** Backpack, sack. */
  carryBonusKg?: number
  saddle?: { kind: 'pack' | 'riding', capacityKg?: number }
  cart?: { capacityKg: number, speedMult: number }
  /** Stacks like other goods and does not wear out (torch, rushlight; D-ITM-24). */
  consumable?: true
}

export interface FoodItem extends ItemBase {
  category: 'food'
  /** Hunger points restored (0..100 scale of vitals `eat`). */
  nutrition: number
  /** Thirst points restored (ale, milk, fruit). */
  waterPoints?: number
  /** Calendar hours to spoil; > 0. */
  spoilH: number
  raw?: boolean
  /** 0..1, eaten raw or spoiled. */
  illnessChance?: number
  buff?: { speed: number, stamina: number, hours: number }
}

export interface HerbItem extends ItemBase {
  category: 'herb'
  heal: number
  poison?: number
  cures?: boolean
  rarity: 'common' | 'medium' | 'rare'
  spoilH: number
  nutrition?: number
}

export interface MedicalItem extends ItemBase {
  category: 'medical'
  /** Hit points restored by one use. */
  heal: number
  stopsBleeding?: boolean
}

export interface ResourceItem extends ItemBase {
  category: 'resource'
}

export interface BookItem extends ItemBase {
  category: 'book'
  skill: SkillId
  /** Reading raises `skill` by `gain` per reading, only from `min` up to `cap`. */
  min: number
  cap: number
  gain: number
}

/** Keys, seals, quest objects, bars. */
export interface MiscItem extends ItemBase {
  category: 'misc'
}

export type Item = AmmoItem | ArmorItem | BookItem | FoodItem | HerbItem | MedicalItem | MiscItem | ResourceItem | ShieldItem | ToolItem | WeaponItem

// --- Quality (per instance, not per catalogue entry) ---------------------------------------------------------

export const QUALITY_NAMES = ['poor', 'average', 'good', 'exceptional'] as const
export type QualityName = (typeof QUALITY_NAMES)[number]

/** Multiplier on damage, resist and durability for an item of that quality; weight scales inversely. */
export const QUALITY_MULT: Record<QualityName, number> = {
  poor: 0.85,
  average: 1,
  good: 1.15,
  exceptional: 1.3,
}
