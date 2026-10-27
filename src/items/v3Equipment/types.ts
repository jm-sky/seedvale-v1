/**
 * Immutable V3 source definitions, not V1 ItemKinds or physical instances.
 * Field names, domains and optionality follow donor items/types.ts; see provenance.ts.
 * Numeric ranges document donor semantics, without normalizing source values.
 */
export type DamageType = 'blunt' | 'cut' | 'pierce'
export type SizeClass = 'LG' | 'MD' | 'SM' | 'XL' | 'XS' | 'XXS'
export type ItemCategory = 'ammo' | 'armor' | 'book' | 'food' | 'herb' | 'medical' | 'misc' | 'resource' | 'shield' | 'tool' | 'weapon'
export type ItemMaterial = 'bone' | 'cloth' | 'damascus' | 'iron' | 'leather' | 'mineral' | 'mixed' | 'obsidian' | 'organic' | 'paper' | 'steel' | 'wood'
/** Source tier is independent of all per-instance quality contracts. */
export type ItemTier = 'common' | 'legendary' | 'masterwork'
/** Source availability never authorizes V1 activation or acquisition. */
export type ItemAvailability = 'active' | 'future' | 'quest-only' | 'unique'
export type ItemOrigin = 'merged' | 'new' | 'v1' | 'v2'

export interface LegacyIds {
  readonly v1?: string
  readonly v2?: string
}

export interface ItemBase {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: ItemCategory
  readonly material: ItemMaterial
  readonly tier: ItemTier
  /** Kilograms, at the source definition's baseline. */
  readonly weight: number
  readonly size: SizeClass
  /** Copper coins: 100 copper = 1 silver; 100 silver = 1 gold. */
  readonly price: number
  /** Absolute item HP at average quality, not current/normalized condition. */
  readonly durability: number
  readonly availability: ItemAvailability
  readonly origin: ItemOrigin
  readonly legacyIds?: LegacyIds
  readonly lore?: string
}

export type MeleeClass = 'axe' | 'dagger' | 'hammer' | 'mace' | 'polearm' | 'spear' | 'staff' | 'sword'
export type RangedClass = 'bow' | 'crossbow' | 'sling'
export type WeaponClass = MeleeClass | RangedClass
export type Grip = 'one-handed' | 'two-handed'
export type AmmoKind = 'arrow' | 'bolt' | 'stone'
export type WeaponCapability = 'chop' | 'cut'

interface WeaponBase extends ItemBase {
  readonly category: 'weapon'
  readonly grip: Grip
  /** Damage per hit at average quality. */
  readonly damage: number
  readonly damageType: DamageType
  /** Gameplay seconds between swings/shots; not V1 combat phases. */
  readonly cooldown: number
  /** Stamina points spent per swing/shot. */
  readonly stamina: number
  readonly capabilities?: readonly WeaponCapability[]
}

export interface MeleeWeapon extends WeaponBase {
  readonly kind: 'melee'
  readonly weaponClass: MeleeClass
  /** Metres. */
  readonly reach: number
  /** Base edge capability, 0..1; 0 for blunt weapons. Not instance wear. */
  readonly sharpness: number
}

export interface RangedWeapon extends WeaponBase {
  readonly kind: 'ranged'
  readonly weaponClass: RangedClass
  /** Effective range in metres. */
  readonly range: number
  readonly ammo: AmmoKind
  /** Gameplay seconds to full draw/sling swing. */
  readonly drawTime: number
  /** Metres per second. */
  readonly projectileSpeed: number
}

export type WeaponItem = MeleeWeapon | RangedWeapon

export interface AmmoItem extends ItemBase {
  readonly category: 'ammo'
  readonly ammoKind: AmmoKind
  /** Flat addition to source weapon damage. */
  readonly damageBonus: number
  readonly damageType: DamageType
}

export type ShieldClass = 'buckler' | 'heater' | 'round'

export interface ShieldItem extends ItemBase {
  readonly category: 'shield'
  readonly shieldClass: ShieldClass
  /** Covered frontal arc in degrees. */
  readonly arcDeg: number
  /** Fraction of damage removed on a block. */
  readonly reduction: number
  /** Share of blocked damage that does not wear the shield. */
  readonly efficiency: number
  /** Gameplay seconds. */
  readonly parryWindowS: number
  readonly canParry: boolean
}

export type ArmorSlot = 'feet' | 'forearms' | 'hands' | 'head' | 'legs' | 'shoulders' | 'torso'
export type ArmorLayer = 'outer' | 'under'
export type ArmorFamily = 'leather' | 'mail' | 'padded' | 'plate' | 'studded'
/** Named damage fractions, 0..0.95. Never a positional tuple or scalar average. */
export type Resist = Readonly<Record<DamageType, number>>

export interface ArmorItem extends ItemBase {
  readonly category: 'armor'
  readonly slot: ArmorSlot
  readonly layer: ArmorLayer
  readonly family: ArmorFamily
  readonly resist: Resist
  /** Fraction of walking speed lost; negative values mean faster. */
  readonly speedPenalty: number
}

/** Exactly the five equipment variants; no goods or mutable instance state. */
export type V3EquipmentDefinition = MeleeWeapon | RangedWeapon | ArmorItem | ShieldItem | AmmoItem
