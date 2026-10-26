/**
 * Quaternius CharacterKit appearance types (V3 → V1 cutover).
 * Pure types/constants — no three, no DOM.
 */

export type CharacterSex = 'Male' | 'Female'

export type HeadVariant = 'Base' | 'Lean' | 'Round' | 'Warm'

export type HairStyle = 'Buzzed' | 'BuzzedFemale' | 'Parted' | 'Long' | 'Buns'

/** Node key inside `hair.glb`: style or beard. */
export type HairNode = HairStyle | 'Beard'

export type CharacterOutfit =
  | 'Peasant'
  | 'Peasant_Boots'
  | 'Ranger'
  | 'Ranger_NoHood'
  | 'Knight'
  | 'Knight_Cloth'
  | 'Knight_Helm'
  | 'Wizard'
  | 'Blacksmith'
  | 'Herbalist'

/** Base garment from `eq/<Sex>.glb` (render--013). Not inventory. */
export type CharacterGarment = 'PeasantSkirt'

export type CharacterAppearance = {
  sex: CharacterSex
  outfit: CharacterOutfit
  head: HeadVariant
  hair: HairStyle | null
  beard: boolean
  /** Multiply on cloth materials; null keeps authored colours. */
  clothTint: number | null
  garments: readonly CharacterGarment[]
}

export const CHARACTER_OUTFITS: readonly CharacterOutfit[] = [
  'Peasant',
  'Peasant_Boots',
  'Ranger',
  'Ranger_NoHood',
  'Knight',
  'Knight_Cloth',
  'Knight_Helm',
  'Wizard',
  'Blacksmith',
  'Herbalist',
]

export const CHARACTER_SEXES: readonly CharacterSex[] = ['Male', 'Female']

export const HEAD_VARIANTS: readonly HeadVariant[] = ['Base', 'Lean', 'Round', 'Warm']

export const HAIR_STYLES: readonly HairStyle[] = ['Buzzed', 'BuzzedFemale', 'Parted', 'Long', 'Buns']

/** Live female outfits that always wear PeasantSkirt. */
export const SKIRTED_FEMALE_OUTFITS: ReadonlySet<CharacterOutfit> = new Set([
  'Herbalist',
  'Peasant',
  'Peasant_Boots',
  'Wizard',
])
