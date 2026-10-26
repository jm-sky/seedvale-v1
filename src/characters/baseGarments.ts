import type { CharacterGarment, CharacterOutfit, CharacterSex } from './characterTypes'
import { SKIRTED_FEMALE_OUTFITS } from './characterTypes'

/** V3 render--013 rule: skirted live female outfits always get PeasantSkirt. */
export function baseGarments(
  sex: CharacterSex,
  outfit: CharacterOutfit,
): readonly CharacterGarment[] {
  return sex === 'Female' && SKIRTED_FEMALE_OUTFITS.has(outfit) ? ['PeasantSkirt'] : []
}
