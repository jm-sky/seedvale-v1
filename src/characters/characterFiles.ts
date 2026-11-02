/**
 * Appearance → public URL paths under `/assets/characters/`.
 */
import type {
  BodyBuild,
  CharacterAppearance,
  CharacterGarment,
  CharacterOutfit,
  CharacterSex,
  FacialHair,
  HairNode,
  HeadVariant,
} from './characterTypes'

const DIR = '/assets/characters/'

/** Morph-carrying (`Fat`/`Slim`) derivatives of the body + eq files (`scripts/assets/build-body-preview.mjs`). */
export const BODY_BUILD_DIR = `${DIR}body-preview/`

export const ANIMS_URL = `${DIR}anims.glb`

function variantSuffix(head: HeadVariant): string {
  return head === 'Base' ? '' : `_${head}`
}

export function bodyUrl(sex: CharacterSex, outfit: CharacterOutfit): string {
  return `${DIR}${sex}_${outfit}.glb`
}

/** Derivative twin of a body/eq URL (`/assets/characters/X.glb` → `…/body-preview/X.glb`). */
export function bodyBuildVariantUrl(url: string): string {
  return url.replace(DIR, BODY_BUILD_DIR)
}

/** Body file for a build: `muscular`/absent loads the original, `heavy`/`slim` the morph-carrying derivative. */
export function bodyUrlForBuild(sex: CharacterSex, outfit: CharacterOutfit, build?: BodyBuild): string {
  const url = bodyUrl(sex, outfit)
  return build === undefined || build === 'muscular' ? url : bodyBuildVariantUrl(url)
}

/** Eq pack for a build (garments must carry the same morph to follow the body). */
export function eqUrlForBuild(sex: CharacterSex, build?: BodyBuild): string {
  const url = eqUrl(sex)
  return build === undefined || build === 'muscular' ? url : bodyBuildVariantUrl(url)
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

/** Hair-pack nodes of a facial-hair choice (none → no node). */
export function facialHairNodes(facialHair: FacialHair): HairNode[] {
  return facialHair === 'beard' ? ['Beard'] : facialHair === 'moustache' ? ['Moustache'] : []
}

export function eqNodeName(garment: CharacterGarment): string {
  return `EQ_${garment}`
}

/** Every file an appearance loads (body, head, optional hair/eq, anims). */
export function characterUrls(a: CharacterAppearance): string[] {
  const files = [bodyUrlForBuild(a.sex, a.outfit, a.build), headUrl(a.sex, a.head)]
  if (a.hair !== null || a.facialHair !== 'none') files.push(hairUrl(a.head))
  if (a.garments.length > 0) files.push(eqUrlForBuild(a.sex, a.build))
  files.push(ANIMS_URL)
  return files
}
