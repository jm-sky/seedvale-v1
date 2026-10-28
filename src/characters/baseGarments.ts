import type { CharacterGarment, CharacterOutfit, CharacterSex, WorkSkirtGarment } from './characterTypes'
import { SKIRTED_FEMALE_OUTFITS } from './characterTypes'

/** V3 render--013 rule: skirted live female outfits always get a work skirt (`skirt` picks the dye). */
export function baseGarments(
  sex: CharacterSex,
  outfit: CharacterOutfit,
  skirt: WorkSkirtGarment = 'WorkSkirt',
): readonly CharacterGarment[] {
  return sex === 'Female' && SKIRTED_FEMALE_OUTFITS.has(outfit) ? [skirt] : []
}
