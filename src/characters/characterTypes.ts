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
  | 'Farmer'
  | 'Woodcutter'

/**
 * Outfits shipped with a Female body. Every other outfit is male-only: Farmer/Woodcutter were exported from the
 * male Blender master only (2026-10-28); Female Blacksmith, Knight (all variants), Ranger (all variants) and Wizard are never used by the live
 * cast (author, 2026-11-02) and are neither generated as body-build derivatives nor listed in tools.
 * Single source of truth — `scripts/assets/build-body-preview.mjs` imports it.
 */
export type FemaleOutfit = Extract<CharacterOutfit, 'Peasant' | 'Peasant_Boots' | 'Herbalist'>

/** Body build of a live character (`muscular` = original Character Pack body, author: "base"). */
export type BodyBuild = 'muscular' | 'heavy' | 'slim'

/** Female work skirt, one `eq/Female.glb` node per dye (same mesh). Replaced PeasantSkirt 2026-10-28. */
export type WorkSkirtGarment = 'WorkSkirt' | 'WorkSkirtRed' | 'WorkSkirtBlue'

/** Base garment from `eq/<Sex>.glb` (render--013). Not inventory. */
export type CharacterGarment = WorkSkirtGarment | 'NobleBodice'

export type CharacterAppearance = {
  sex: CharacterSex
  outfit: CharacterOutfit
  head: HeadVariant
  hair: HairStyle | null
  beard: boolean
  /** Multiply on cloth materials; null keeps authored colours. */
  clothTint: number | null
  garments: readonly CharacterGarment[]
  /** Body build; absent = `muscular` (original body files, no build morph). */
  build?: BodyBuild
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
  'Farmer',
  'Woodcutter',
]

export const FEMALE_OUTFITS: readonly FemaleOutfit[] = ['Peasant', 'Peasant_Boots', 'Herbalist']

const FEMALE_OUTFIT_SET: ReadonlySet<CharacterOutfit> = new Set(FEMALE_OUTFITS)

/** Whether a body file exists for this sex/outfit pair (every outfit for Male, `FEMALE_OUTFITS` for Female). */
export function hasOutfitBody(sex: CharacterSex, outfit: CharacterOutfit): boolean {
  return sex === 'Male' || FEMALE_OUTFIT_SET.has(outfit)
}

export const CHARACTER_SEXES: readonly CharacterSex[] = ['Male', 'Female']

export const HEAD_VARIANTS: readonly HeadVariant[] = ['Base', 'Lean', 'Round', 'Warm']

export const HAIR_STYLES: readonly HairStyle[] = ['Buzzed', 'BuzzedFemale', 'Parted', 'Long', 'Buns']

/** Undyed wool, faded madder, woad. */
export const WORK_SKIRTS: readonly WorkSkirtGarment[] = ['WorkSkirt', 'WorkSkirtRed', 'WorkSkirtBlue']

/** Live female outfits that always wear a work skirt (currently every Female outfit). */
export const SKIRTED_FEMALE_OUTFITS: ReadonlySet<CharacterOutfit> = new Set<FemaleOutfit>([
  'Herbalist',
  'Peasant',
  'Peasant_Boots',
])
