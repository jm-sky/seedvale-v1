import type {
  BodyBuild,
  CharacterAppearance,
  CharacterOutfit,
  CharacterSex,
  HairStyle,
  HeadVariant,
} from '../characters/characterTypes'
import type { CharacterKey, NpcGender, Role } from './characters'
import { baseGarments } from '../characters/baseGarments'
import { pickBodyBuild } from '../characters/bodyBuild'
import { ANIMS_URL, bodyUrl } from '../characters/characterFiles'
import { hasOutfitBody, HEAD_VARIANTS, WORK_SKIRTS } from '../characters/characterTypes'
import { isAdultAge } from '../settlement/professionStaffing'
import { createSeededRandom } from '../world/parseSeed'

export type NpcOutfitId = CharacterOutfit
export type NpcHairKind = HairStyle | 'bald'
export type NpcResolvedHair = NpcHairKind
export type NpcClothingHueId = 'identity' | 'warm' | 'cool' | 'muted'
/** `copper` is reserved for named presets (Kasia); the procedural pool never rolls it. */
export type NpcHairColorId = 'black' | 'brown' | 'redhead' | 'blond' | 'grey' | 'copper'

/** Multiply on cloned cloth materials after kit assemble. */
export const NPC_CLOTHING_HUE: Record<NpcClothingHueId, number> = {
  identity: 0xffffff,
  warm: 0xfff4e8,
  cool: 0xf2f6ff,
  muted: 0xe5ddd2,
}

/** Multiply on hair materials (grey albedo). Not `#000000`. */
export const NPC_HAIR_COLOR: Record<NpcHairColorId, number> = {
  black: 0x1c1614,
  brown: 0x6b3d22,
  redhead: 0xb44a28,
  blond: 0xd8b56a,
  grey: 0xc5c0b8,
  copper: 0x8c4a2a,
}

/** Woodcutter tint on the Peasant body worn by adult female woodcutters (adult men wear `Woodcutter`). */
export const NPC_WOODCUTTER_CLOTH_TINT = 0xc4a574

const MALE_HAIR: readonly (HairStyle | null)[] = ['Parted', 'Buzzed', 'Parted', null]
/** Live female cast: long styles only (no BuzzedFemale — reads as short hair). */
const FEMALE_HAIR: readonly HairStyle[] = ['Long', 'Long', 'Buns']
const BLACKSMITH_HAIR: readonly (HairStyle | null)[] = [null, 'Parted']
const WOODCUTTER_HAIR: readonly HairStyle[] = ['Parted', 'Long']
const CLOTHING_HUE_IDS: readonly NpcClothingHueId[] = ['identity', 'warm', 'cool', 'muted']
const NON_GREY_HAIR_COLOR_IDS: readonly NpcHairColorId[] = ['black', 'brown', 'redhead', 'blond']
const BEARD_CHANCE = 0.35
const GREY_HAIR_MIN_AGE = 50
const GREY_HAIR_SENIOR_AGE = 60
const GREY_HAIR_CHANCE_MIDDLE = 0.15
const GREY_HAIR_CHANCE_SENIOR = 0.75
const APPEARANCE_SEED_SALT = 0x41505045
/** Separate stream so the build roll never shifts the existing hair/hue/beard draws. */
const BUILD_SEED_SALT = 0x4255494c

/**
 * Fixed look of a named recurring NPC (`docs/v3-donor/characters/NAMED-NPC-APPEARANCE.md`), keyed by stable
 * `CharacterKey`. Only fields the kit supports today; outfit still follows the role (it already matches the doc).
 * Unsupported doc fields and their stand-ins: height (not modelled), moustache/stubble (boolean beard only),
 * braid/updo (→ `Long`), "short" hair (→ `Buzzed`), 4-build `superhero` (→ `muscular`, the original body).
 */
export type NamedNpcLook = {
  beard: boolean
  build: BodyBuild
  hair: HairStyle | null
  hairColor: NpcHairColorId
  head: HeadVariant
}

/**
 * Casimir (V3 E01) is deliberately absent: the doc keeps him distinct from V1 `kazimierz` (no binding approved).
 *
 * @domain npc
 */
export const NAMED_NPC_LOOKS: Readonly<Partial<Record<CharacterKey, NamedNpcLook>>> = {
  // stubble later; `none` now
  marek_hornblower: { build: 'muscular', head: 'Base', hair: 'Buzzed', hairColor: 'brown', beard: false },
  // braid / pinned-up not in kit → Long (never Buns)
  kasia_hornblower: { build: 'muscular', head: 'Base', hair: 'Long', hairColor: 'copper', beard: false },
  // `superhero` build; moustache not in kit → clean-shaven until the facial-hair extension
  piotr_lesniewski: { build: 'muscular', head: 'Base', hair: 'Buzzed', hairColor: 'brown', beard: false },
  anna_lesniewska: { build: 'slim', head: 'Lean', hair: 'Long', hairColor: 'brown', beard: false },
  molly_lambert: { build: 'slim', head: 'Warm', hair: 'Long', hairColor: 'blond', beard: false },
  // beard_and_moustache → full beard
  jakub: { build: 'muscular', head: 'Base', hair: 'Long', hairColor: 'brown', beard: true },
  rudolf: { build: 'muscular', head: 'Base', hair: 'Parted', hairColor: 'brown', beard: true },
}

/**
 * Derived NPC look. Appearance is not persisted — reload recomputes from
 * gender + role + age + `npcId`.
 *
 * @domain npc
 */
export type NpcAppearance = {
  animationUrl: string
  beard: boolean
  /** @deprecated Kit embeds hair; kept null for callers that still read it. */
  beardAttachmentUrl: string | null
  clothingHue: number
  family: string
  hair: NpcResolvedHair
  /** @deprecated Kit embeds hair; kept null for callers that still read it. */
  hairAttachmentUrl: string | null
  hairColor: number
  /** Kit with `build` always set (procedural roll or named preset). */
  kit: CharacterAppearance & { build: BodyBuild }
  modelUrl: string
  outfit: NpcOutfitId
  tintUrl: string | null
}

type RoleLook = {
  outfit: CharacterOutfit
  clothTint?: number | null
}

const ROLE_LOOK: Record<Role, RoleLook> = {
  farmer: { outfit: 'Farmer' },
  woodcutter: { outfit: 'Woodcutter' },
  trader: { outfit: 'Wizard' },
  hunter: { outfit: 'Ranger_NoHood' },
  guard: { outfit: 'Knight_Cloth' },
  miner: { outfit: 'Peasant' },
  fisher: { outfit: 'Peasant_Boots' },
  blacksmith: { outfit: 'Blacksmith' },
  shepherd: { outfit: 'Peasant' },
  textile_worker: { outfit: 'Peasant' },
  herbalist: { outfit: 'Herbalist' },
}

/**
 * Female cast wears only `FEMALE_OUTFITS`. Trader → Peasant + Noble bodice (the Wizard coat poked through the
 * work skirt, 2026-10-28); Farmer → Peasant_Boots; every other male-only outfit → Peasant (+ skirt).
 */
function coerceFemaleOutfit(outfit: CharacterOutfit): CharacterOutfit {
  if (hasOutfitBody('Female', outfit)) return outfit
  return outfit === 'Farmer' ? 'Peasant_Boots' : 'Peasant'
}

function appearanceSeed(npcId: string): () => number {
  return createSeededRandom(hashNpcId(npcId) ^ APPEARANCE_SEED_SALT)
}

function hashNpcId(npcId: string): number {
  let h = 2166136261
  for (let i = 0; i < npcId.length; i++) {
    h ^= npcId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickIndex(random: () => number, length: number): number {
  return Math.min(length - 1, Math.floor(random() * length))
}

function rollHairColor(random: () => number, age: number): NpcHairColorId {
  if (age >= GREY_HAIR_MIN_AGE) {
    const chance = age >= GREY_HAIR_SENIOR_AGE ? GREY_HAIR_CHANCE_SENIOR : GREY_HAIR_CHANCE_MIDDLE
    if (random() < chance) return 'grey'
  }
  return NON_GREY_HAIR_COLOR_IDS[pickIndex(random, NON_GREY_HAIR_COLOR_IDS.length)]!
}

function toSex(gender: NpcGender): CharacterSex {
  return gender === 'female' ? 'Female' : 'Male'
}

function hairStyleToResolved(hair: HairStyle | null): NpcResolvedHair {
  return hair === null ? 'bald' : hair
}

/** Profession-specific hair pools (kit hair styles). */
export function customProfessionHairKinds(role: Role): readonly NpcResolvedHair[] | null {
  if (role === 'blacksmith') return ['bald', 'Parted']
  if (role === 'woodcutter') return ['Parted', 'Long']
  return null
}

/**
 * Role → Quaternius outfit (+ female skirt / coercion). Children always Peasant.
 *
 * @domain npc
 */
export function resolveNpcAppearance(opts: {
  age: number
  /** Named NPC → fixed look from `NAMED_NPC_LOOKS` (overrides the procedural head/hair/beard/build). */
  characterKey?: CharacterKey | null
  gender: NpcGender
  npcId: string
  role: Role
  treeIndex: number
}): NpcAppearance {
  const adult = isAdultAge(opts.age)
  const sex = toSex(opts.gender)
  const roleLook = adult ? ROLE_LOOK[opts.role] : { outfit: 'Peasant' as const }
  let outfit = roleLook.outfit
  if (sex === 'Female') outfit = coerceFemaleOutfit(outfit)

  const h = hashNpcId(opts.npcId)
  const random = appearanceSeed(opts.npcId)
  const hairColorId = rollHairColor(random, opts.age)
  const clothingHueId = CLOTHING_HUE_IDS[pickIndex(random, CLOTHING_HUE_IDS.length)]!
  const clothingHue = NPC_CLOTHING_HUE[clothingHueId]
  let hairColor = NPC_HAIR_COLOR[hairColorId]
  let build = pickBodyBuild(createSeededRandom(hashNpcId(opts.npcId) ^ BUILD_SEED_SALT)())

  let head: HeadVariant = HEAD_VARIANTS[h % HEAD_VARIANTS.length]!
  let hair: HairStyle | null
  let beard: boolean
  let clothTint: number | null = roleLook.clothTint ?? null
  if (opts.role === 'woodcutter' && adult && outfit === 'Peasant') clothTint = NPC_WOODCUTTER_CLOTH_TINT
  let family: string = outfit

  if (opts.role === 'blacksmith' && sex === 'Male' && adult) {
    head = 'Round'
    hair = BLACKSMITH_HAIR[pickIndex(random, BLACKSMITH_HAIR.length)] ?? null
    beard = true
    clothTint = null
    family = 'blacksmith'
  } else if (opts.role === 'woodcutter' && sex === 'Male' && adult) {
    hair = WOODCUTTER_HAIR[pickIndex(random, WOODCUTTER_HAIR.length)]!
    beard = random() < BEARD_CHANCE
    family = 'woodcutter'
  } else if (sex === 'Female') {
    hair = FEMALE_HAIR[(h >>> 3) % FEMALE_HAIR.length]!
    beard = false
  } else {
    hair = adult
      ? MALE_HAIR[(h >>> 3) % (opts.age >= 50 ? MALE_HAIR.length : MALE_HAIR.length - 1)]!
      : 'Parted'
    beard = adult && (opts.age >= 50 || ((h >>> 6) & 1) === 1)
  }

  const named = opts.characterKey ? NAMED_NPC_LOOKS[opts.characterKey] : undefined
  if (named) {
    head = named.head
    hair = named.hair
    beard = named.beard
    build = named.build
    hairColor = NPC_HAIR_COLOR[named.hairColor]
  }

  const kit: NpcAppearance['kit'] = {
    sex,
    outfit,
    head,
    hair,
    beard,
    clothTint,
    garments: [
      ...(sex === 'Female' && opts.role === 'trader' && adult ? ['NobleBodice' as const] : []),
      // Dye from hash bits no other pick uses (head 0–1, hair 3+, beard 6): the random draw order is unchanged.
      ...baseGarments(sex, outfit, WORK_SKIRTS[(h >>> 11) % WORK_SKIRTS.length]),
    ],
    build,
  }

  return {
    animationUrl: ANIMS_URL,
    beard,
    beardAttachmentUrl: null,
    clothingHue,
    family,
    hair: hairStyleToResolved(hair),
    hairAttachmentUrl: null,
    hairColor,
    kit,
    modelUrl: bodyUrl(sex, outfit),
    outfit,
    tintUrl: null,
  }
}

/** @deprecated UBC variant URL helper — kit uses bodyUrl; kept for legacy imports. */
export function ubcVariantModelUrl(
  gender: NpcGender,
  outfit: NpcOutfitId,
  _hair: NpcHairKind,
  _beard: boolean,
): string {
  return bodyUrl(toSex(gender), outfit)
}
