/**
 * Appearance → public URL paths under `/assets/characters/`.
 */
import type {
  CharacterAppearance,
  CharacterGarment,
  CharacterOutfit,
  CharacterSex,
  HairNode,
  HeadVariant,
} from './characterTypes'

const DIR = '/assets/characters/'

export const ANIMS_URL = `${DIR}anims.glb`

function variantSuffix(head: HeadVariant): string {
  return head === 'Base' ? '' : `_${head}`
}

export function bodyUrl(sex: CharacterSex, outfit: CharacterOutfit): string {
  return `${DIR}${sex}_${outfit}.glb`
}

export function headUrl(sex: CharacterSex, head: HeadVariant): string {
  return `${DIR}${sex}_Head${variantSuffix(head)}.glb`
}

export function hairUrl(head: HeadVariant): string {
  return `${DIR}hair${variantSuffix(head)}.glb`
}

export function eqUrl(sex: CharacterSex): string {
  return `${DIR}eq/${sex}.glb`
}

export function hairNodeName(node: HairNode): string {
  return `HAIR_${node}`
}

export function eqNodeName(garment: CharacterGarment): string {
  return `EQ_${garment}`
}

/** Every file an appearance loads (body, head, optional hair/eq, anims). */
export function characterUrls(a: CharacterAppearance): string[] {
  const files = [bodyUrl(a.sex, a.outfit), headUrl(a.sex, a.head)]
  if (a.hair !== null || a.beard) files.push(hairUrl(a.head))
  if (a.garments.length > 0) files.push(eqUrl(a.sex))
  files.push(ANIMS_URL)
  return files
}
