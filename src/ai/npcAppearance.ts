import type { NpcGender, Role } from './characters'
import {
  companionAnimationUrl,
  PLAYER_UBC_PEASANT_URL,
  PLAYER_UBC_RANGER_URL,
  PLAYER_UBC_WIZARD_URL,
} from '../player/playerVisualPreset'
import { isAdultAge } from '../settlement/professionStaffing'
import { createSeededRandom } from '../world/parseSeed'

const UBC_DIR = '/models/characters/ubc'
const NPC_VARIANT_DIR = `${UBC_DIR}/npc`

export const NPC_UBC_FEMALE_PEASANT_URL = `${UBC_DIR}/female_peasant.glb`
export const NPC_UBC_FEMALE_WIZARD_URL = `${UBC_DIR}/female_wizard.glb`
export const NPC_UBC_FEMALE_RANGER_URL = `${UBC_DIR}/female_ranger.glb`
export const NPC_UBC_FEMALE_KNIGHT_URL = `${UBC_DIR}/female_knight.glb`
/** Adult male guard singleton — Knight with Armet stripped + Hair_SimpleParted. */
export const NPC_UBC_MALE_KNIGHT_UNHELMETED_URL = `${UBC_DIR}/male_knight_unhelmeted.glb`
/** Adult male blacksmith — authored profession GLB (tools-017); no outfit sidecar tint. */
export const NPC_UBC_MALE_BLACKSMITH_URL = `${NPC_VARIANT_DIR}/male_blacksmith.glb`
/** Adult male woodcutter — authored profession GLB (tools-017); no outfit sidecar tint. */
export const NPC_UBC_MALE_WOODCUTTER_URL = `${NPC_VARIANT_DIR}/male_woodcutter.glb`
/** Farmer sidecar — `T_Peasant_3` (sapphire vest), not the player's olive default. */
export const NPC_UBC_PEASANT_TINT_URL = `${UBC_DIR}/npc_peasant.webp`
/** Woodcutter sidecar — `T_Peasant_2` (earth brown), distinct from farmer sapphire. */
export const NPC_UBC_WOODCUTTER_TINT_URL = `${UBC_DIR}/npc_woodcutter.webp`
/** Trader sidecar — `T_Wizard_3` (crimson + silver), not the player's default Wizard. */
export const NPC_UBC_WIZARD_TINT_URL = `${UBC_DIR}/npc_wizard.webp`
/** Hunter sidecar — `T_Ranger_2` (dark violet), not the player's green default or brown tint. */
export const NPC_UBC_RANGER_TINT_URL = `${UBC_DIR}/npc_ranger.webp`
/** Guard sidecar — `T_Knight_3`, not the player's default Knight or brown `T_Knight_2`. */
export const NPC_UBC_KNIGHT_TINT_URL = `${UBC_DIR}/npc_knight.webp`
export const NPC_UBC_HAIR_1_URL = `${UBC_DIR}/hair_1.webp`
export const NPC_UBC_HAIR_2_URL = `${UBC_DIR}/hair_2.webp`

export type NpcOutfitId = 'peasant' | 'wizard' | 'ranger' | 'knight'
export type NpcUbcOutfitId = NpcOutfitId
export type NpcHairKind = 'simple' | 'long' | 'buzzed' | 'buns'
export type NpcClothingHueId = 'identity' | 'warm' | 'cool' | 'muted'
export type NpcHairColorId = 'black' | 'brown' | 'redhead' | 'blond' | 'grey'

/** Multiply on cloned `MI_Peasant` / `MI_Wizard` / `MI_Ranger` / `MI_Knight` after the role sidecar. */
export const NPC_CLOTHING_HUE: Record<NpcClothingHueId, number> = {
  identity: 0xffffff,
  warm: 0xfff4e8,
  cool: 0xf2f6ff,
  muted: 0xe5ddd2,
}

/** Multiply on cloned `MI_Hair_*` (grey albedo). Not `#000000` — that kills shading. */
export const NPC_HAIR_COLOR: Record<NpcHairColorId, number> = {
  black: 0x1c1614,
  brown: 0x6b3d22,
  redhead: 0xb44a28,
  blond: 0xd8b56a,
  grey: 0xc5c0b8,
}

/** No Hair_Buns on men — those GLBs are not shipped. */
const MALE_HAIR_KINDS: readonly NpcHairKind[] = ['simple', 'long', 'buzzed']
/** Women use Hair_Long / Hair_Buns only — not SimpleParted or Hair_BuzzedFemale. */
const FEMALE_HAIR_KINDS: readonly NpcHairKind[] = ['long', 'buns']
/** Ranger hood clips Hair_Buns; huntresses only roll Long. */
const FEMALE_RANGER_HAIR_KINDS: readonly NpcHairKind[] = ['long']
const CLOTHING_HUE_IDS: readonly NpcClothingHueId[] = ['identity', 'warm', 'cool', 'muted']
const NON_GREY_HAIR_COLOR_IDS: readonly NpcHairColorId[] = ['black', 'brown', 'redhead', 'blond']
const BEARD_CHANCE = 0.35
/** Below this age grey hair never rolls. */
const GREY_HAIR_MIN_AGE = 50
/** At/after this age the grey chance jumps from `GREY_HAIR_CHANCE_MIDDLE` to `GREY_HAIR_CHANCE_SENIOR`. */
const GREY_HAIR_SENIOR_AGE = 60
const GREY_HAIR_CHANCE_MIDDLE = 0.15
const GREY_HAIR_CHANCE_SENIOR = 0.75
/** Distinct from physical-profile salts (`PHYS` / SPEA streams). */
const APPEARANCE_SEED_SALT = 0x41505045

/**
 * Derived NPC look. Appearance is not persisted — reload/`WorldBundle`
 * rebuild recomputes it from gender + role + age + `npcId` (hair/beard/hue).
 *
 * @domain npc
 */
export type NpcAppearance = {
  animationUrl: string | null
  clothingHue: number
  hairColor: number
  modelUrl: string
  outfit: NpcOutfitId
  tintUrl: string | null
}

function appearanceFor(
  modelUrl: string,
  outfit: NpcOutfitId,
  tintUrl: string | null,
  hairColor: number = 0xffffff,
  clothingHue: number = NPC_CLOTHING_HUE.identity,
): NpcAppearance {
  return {
    animationUrl: companionAnimationUrl(modelUrl),
    clothingHue,
    hairColor,
    modelUrl,
    outfit,
    tintUrl,
  }
}

function hashNpcId(npcId: string): number {
  let h = 2166136261
  for (let i = 0; i < npcId.length; i++) {
    h ^= npcId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function hairKindsFor(gender: NpcGender, outfit: NpcUbcOutfitId): readonly NpcHairKind[] {
  if (gender === 'male') return MALE_HAIR_KINDS
  if (outfit === 'ranger') return FEMALE_RANGER_HAIR_KINDS
  return FEMALE_HAIR_KINDS
}

function pickIndex(random: () => number, length: number): number {
  return Math.min(length - 1, Math.floor(random() * length))
}

function defaultUbcUrl(gender: NpcGender, outfit: NpcUbcOutfitId): string {
  if (outfit === 'peasant') {
    return gender === 'female' ? NPC_UBC_FEMALE_PEASANT_URL : PLAYER_UBC_PEASANT_URL
  }
  if (outfit === 'ranger') {
    return gender === 'female' ? NPC_UBC_FEMALE_RANGER_URL : PLAYER_UBC_RANGER_URL
  }
  if (outfit === 'knight') {
    return gender === 'female' ? NPC_UBC_FEMALE_KNIGHT_URL : NPC_UBC_MALE_KNIGHT_UNHELMETED_URL
  }
  return gender === 'female' ? NPC_UBC_FEMALE_WIZARD_URL : PLAYER_UBC_WIZARD_URL
}

function isPlayerDefaultCombo(
  gender: NpcGender,
  outfit: NpcUbcOutfitId,
  hair: NpcHairKind,
  beard: boolean,
): boolean {
  if (beard) return false
  // Male guard pins the unhelmeted stem — never the helmeted player Knight.
  if (outfit === 'knight' && gender === 'male') return false
  // Female Knight stem is Hair_Long on `female_knight.glb`.
  if (outfit === 'knight' && gender === 'female' && hair === 'long') return true
  if (gender === 'male' && hair === 'simple') return true
  // Female Peasant stem is Hair_Long. Wizard/Ranger stems were SimpleParted —
  // long hair lives in npc/female_*_long.glb.
  if (gender === 'female' && outfit === 'peasant' && hair === 'long') return true
  return false
}

/**
 * Baked hair/beard variant, or the shared player/default GLB for the
 * npc-039 / hunter-default combos.
 *
 * @domain npc
 */
export function ubcVariantModelUrl(
  gender: NpcGender,
  outfit: NpcUbcOutfitId,
  hair: NpcHairKind,
  beard: boolean,
): string {
  if (isPlayerDefaultCombo(gender, outfit, hair, beard)) {
    return defaultUbcUrl(gender, outfit)
  }
  const beardSuffix = beard ? '_beard' : ''
  return `${NPC_VARIANT_DIR}/${gender}_${outfit}_${hair}${beardSuffix}.glb`
}

function greyHairChanceForAge(age: number): number {
  if (age >= GREY_HAIR_SENIOR_AGE) return GREY_HAIR_CHANCE_SENIOR
  if (age >= GREY_HAIR_MIN_AGE) return GREY_HAIR_CHANCE_MIDDLE
  return 0
}

/** Grey only ever rolls at 50+ (~15%), rising to ~75% at 60+; never below 50. */
function rollHairColor(random: () => number, age: number): NpcHairColorId {
  if (random() < greyHairChanceForAge(age)) return 'grey'
  return NON_GREY_HAIR_COLOR_IDS[pickIndex(random, NON_GREY_HAIR_COLOR_IDS.length)]!
}

function rollUbcVariant(npcId: string, gender: NpcGender, outfit: NpcUbcOutfitId, age: number): {
  clothingHue: number
  hairColor: number
  modelUrl: string
} {
  const random = createSeededRandom(hashNpcId(npcId) ^ APPEARANCE_SEED_SALT)
  const hairs = hairKindsFor(gender, outfit)
  const hair = hairs[pickIndex(random, hairs.length)]!
  const beard = gender === 'male' && random() < BEARD_CHANCE
  const hairColorId = rollHairColor(random, age)
  const hueId = CLOTHING_HUE_IDS[pickIndex(random, CLOTHING_HUE_IDS.length)]!
  return {
    clothingHue: NPC_CLOTHING_HUE[hueId],
    hairColor: NPC_HAIR_COLOR[hairColorId],
    modelUrl: ubcVariantModelUrl(gender, outfit, hair, beard),
  }
}

/**
 * Per-role UBC family + tint. Optional `modelUrl` pins an adult-male custom
 * profession stem; females and children keep the outfit family path + tint.
 */
type UbcRoleLook = {
  outfit: NpcUbcOutfitId
  tintUrl: string
  modelUrl?: string
}

const UBC_ROLE_LOOK: Record<Role, UbcRoleLook> = {
  farmer: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
  woodcutter: {
    outfit: 'peasant',
    tintUrl: NPC_UBC_WOODCUTTER_TINT_URL,
    modelUrl: NPC_UBC_MALE_WOODCUTTER_URL,
  },
  trader: { outfit: 'wizard', tintUrl: NPC_UBC_WIZARD_TINT_URL },
  hunter: { outfit: 'ranger', tintUrl: NPC_UBC_RANGER_TINT_URL },
  guard: { outfit: 'knight', tintUrl: NPC_UBC_KNIGHT_TINT_URL },
  miner: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
  fisher: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
  blacksmith: {
    outfit: 'peasant',
    tintUrl: NPC_UBC_PEASANT_TINT_URL,
    modelUrl: NPC_UBC_MALE_BLACKSMITH_URL,
  },
  shepherd: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
  textile_worker: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
  herbalist: { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL },
}

/**
 * Every adult role maps to a UBC outfit family (npc-055). Children also use
 * Peasant UBC regardless of role and keep age-driven `member.scale` outside
 * this resolver. Female guards use Knight. Adult male blacksmith/woodcutter
 * use authored custom GLBs (`UBC_ROLE_LOOK.modelUrl`) with no outfit sidecar
 * tint and identity clothing hue so authored materials stay intact; hair
 * color still rolls from `npcId`. Hair/beard/hue come from `npcId` on the
 * family path; hair color also greys with `age`. Men never roll Hair_Buns.
 * Peasant/Wizard/Knight women roll Hair_Long / Hair_Buns; Ranger women only
 * Hair_Long.
 *
 * @domain npc
 */
export function resolveNpcAppearance(opts: {
  age: number
  gender: NpcGender
  npcId: string
  role: Role
  treeIndex: number
}): NpcAppearance {
  // Children: Peasant UBC stand-in (npc-055). Scale stays on NpcAgent via member.scale.
  const look: UbcRoleLook = isAdultAge(opts.age)
    ? UBC_ROLE_LOOK[opts.role]
    : { outfit: 'peasant', tintUrl: NPC_UBC_PEASANT_TINT_URL }

  if (look.outfit === 'knight' && opts.gender === 'male') {
    const style = rollUbcVariant(opts.npcId, opts.gender, look.outfit, opts.age)
    return appearanceFor(
      NPC_UBC_MALE_KNIGHT_UNHELMETED_URL,
      look.outfit,
      look.tintUrl,
      style.hairColor,
      style.clothingHue,
    )
  }

  // Custom adult-male profession stems: keep authored outfit materials (no
  // Peasant/Ranger sidecar overwrite) and skip clothing-hue multiply.
  if (look.modelUrl && opts.gender === 'male') {
    const style = rollUbcVariant(opts.npcId, opts.gender, look.outfit, opts.age)
    return appearanceFor(
      look.modelUrl,
      look.outfit,
      null,
      style.hairColor,
      NPC_CLOTHING_HUE.identity,
    )
  }

  const variant = rollUbcVariant(opts.npcId, opts.gender, look.outfit, opts.age)
  return appearanceFor(
    variant.modelUrl,
    look.outfit,
    look.tintUrl,
    variant.hairColor,
    variant.clothingHue,
  )
}
