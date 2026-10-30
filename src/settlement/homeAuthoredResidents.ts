import type { CharacterKey, NpcGender, NpcOffice, Role } from '../ai/characters'
import type { NameCulture } from '../ai/nameCultures'
import type { FamilyDef, FamilyMember } from './families'
import { AUTHORED_GIVEN_NAMES, characterForSeed } from '../ai/characters'
import { formatPolishSurnameForGender, generateFamilySurname, surnameForGender } from '../ai/nameCultures'
import { HOME_ELDER_FAMILY_ID } from './families'
import { isWorldgenFamilyId } from './professionFamilySurnames'
import { isAdultAge } from './professionStaffing'

/** Authored home elder household (Kazimierz). `family-story-*` keeps it out
 *  of elder promotion and profession-surname rerolls; staffing skips it. */
export { HOME_ELDER_FAMILY_ID }
export const HOME_ELDER_LAST_NAME = 'Nowak'
export const HOME_ELDER_AGE = 74

/** Fallback single-reeve household, appended only when the home has no free
 *  adult man to carry the Rudolf identity. */
export const HOME_REEVE_FALLBACK_FAMILY_ID = 'family-story-home-reeve'
const HOME_REEVE_FALLBACK_AGE = 58
/** A younger free man is not credible as reeve — use the fallback instead. */
const HOME_REEVE_MIN_AGE = 35

/** Fallback hunter household, appended only when home staffing had no free
 *  man to make the guaranteed hunter. */
export const HOME_HUNTER_FALLBACK_FAMILY_ID = 'family-story-home-hunter'
const HOME_HUNTER_FALLBACK_AGE = 31

/** Fallback shepherdess household, appended only when home staffing had no
 *  free woman to make the guaranteed shepherd (small homes). */
export const HOME_SHEPHERD_FALLBACK_FAMILY_ID = 'family-story-home-shepherd'
const HOME_SHEPHERD_FALLBACK_AGE = 34

/**
 * Whether this family is the authored home elder household.
 *
 * @domain settlements-npcs
 */
export function isHomeElderFamily(family: Pick<FamilyDef, 'id'>): boolean {
  return family.id === HOME_ELDER_FAMILY_ID
}

/**
 * Kazimierz — the home settlement's mandatory elder: single widower, age 74,
 * farmer baseline (staffing may reassign). Appended after generated families
 * so their flattened `NpcId`s stay stable. Deterministic for the cell seed.
 *
 * @domain settlements-npcs
 */
export function createHomeElderFamily(seedForCell: number, nameCulture: NameCulture): FamilyDef {
  const name = AUTHORED_GIVEN_NAMES.kazimierz
  const lastName = surnameForGender(HOME_ELDER_LAST_NAME, nameCulture, 'male')
  const character = characterForSeed(seedForCell ^ 0x6b617a, 'male')
  return {
    id: HOME_ELDER_FAMILY_ID,
    members: [{
      name,
      lastName,
      relation: 'single',
      character: { ...character, name, lastName, characterKey: 'kazimierz', gender: 'male', role: 'farmer' },
      scale: 1,
      age: HOME_ELDER_AGE,
    }],
  }
}

type ProfessionIdentity = {
  key: CharacterKey
  role: Role
  gender: NpcGender
  name: string
  /** When set, the whole household takes this surname (gender-agreed). */
  familyLastName?: string
  /** Guaranteed by home staffing; a single household is appended when no
   *  matching staffed adult exists. */
  fallback?: { familyId: string, age: number, seedSalt: number }
}

/** Named home residents overlaid on generated staff by profession. Molly
 *  (shepherdess) and Jakub (hunter) are guaranteed — home staffing reserves
 *  their role for a woman / a man, with a fallback household otherwise.
 *  Patric Smith belongs to the nearest larger settlement (not yet bound). */
const HOME_PROFESSION_IDENTITIES: readonly ProfessionIdentity[] = [
  {
    key: 'molly_lambert',
    role: 'shepherd',
    gender: 'female',
    name: AUTHORED_GIVEN_NAMES.molly_lambert,
    familyLastName: 'Lambert',
    fallback: { familyId: HOME_SHEPHERD_FALLBACK_FAMILY_ID, age: HOME_SHEPHERD_FALLBACK_AGE, seedSalt: 0x6d6f6c6c },
  },
  {
    key: 'jakub',
    role: 'hunter',
    gender: 'male',
    name: AUTHORED_GIVEN_NAMES.jakub,
    fallback: { familyId: HOME_HUNTER_FALLBACK_FAMILY_ID, age: HOME_HUNTER_FALLBACK_AGE, seedSalt: 0x6a616b75 },
  },
]

type MemberSlot = { familyIndex: number, memberIndex: number }

/** Generated, non-reserved adult not yet carrying an authored identity. */
function isFreeAdult(family: FamilyDef, member: FamilyMember): boolean {
  return isWorldgenFamilyId(family.id)
    && !family.id.startsWith('family-reserved-')
    && member.relation !== 'child'
    && isAdultAge(member.age)
    && member.character.characterKey == null
}

function hasAuthoredMember(family: FamilyDef): boolean {
  return family.members.some((member) => member.character.characterKey != null)
}

function findSlot(
  families: readonly FamilyDef[],
  match: (member: FamilyMember) => boolean,
  skipAuthoredFamilies: boolean,
): MemberSlot | null {
  for (let familyIndex = 0; familyIndex < families.length; familyIndex++) {
    const family = families[familyIndex]!
    if (skipAuthoredFamilies && hasAuthoredMember(family)) continue
    for (let memberIndex = 0; memberIndex < family.members.length; memberIndex++) {
      const member = family.members[memberIndex]!
      if (isFreeAdult(family, member) && match(member)) return { familyIndex, memberIndex }
    }
  }
  return null
}

/** Oldest free man aged `HOME_REEVE_MIN_AGE`+; ties keep family/member order. */
function findOldestFreeMan(families: readonly FamilyDef[]): MemberSlot | null {
  let best: MemberSlot | null = null
  let bestAge = -1
  families.forEach((family, familyIndex) => {
    family.members.forEach((member, memberIndex) => {
      if (!isFreeAdult(family, member) || member.character.gender !== 'male' || member.age < HOME_REEVE_MIN_AGE) return
      if (member.age > bestAge) {
        bestAge = member.age
        best = { familyIndex, memberIndex }
      }
    })
  })
  return best
}

function applyIdentity(
  families: FamilyDef[],
  slot: MemberSlot,
  identity: { key: CharacterKey, name: string, familyLastName?: string, office?: NpcOffice },
): void {
  const family = families[slot.familyIndex]!
  families[slot.familyIndex] = {
    ...family,
    members: family.members.map((member, memberIndex) => {
      const lastName = identity.familyLastName
        ? formatPolishSurnameForGender(identity.familyLastName, member.character.gender)
        : member.lastName
      if (memberIndex !== slot.memberIndex) {
        return lastName === member.lastName ? member : { ...member, lastName, character: { ...member.character, lastName } }
      }
      return {
        ...member,
        name: identity.name,
        lastName,
        character: {
          ...member.character,
          name: identity.name,
          lastName,
          characterKey: identity.key,
          ...(identity.office ? { office: identity.office } : {}),
        },
      }
    }),
  }
}

function createSingleAuthoredFamily(
  id: string,
  seed: number,
  identity: { key: CharacterKey, name: string, lastName: string, gender: NpcGender, role: Role, age: number, office?: NpcOffice },
): FamilyDef {
  const character = characterForSeed(seed, identity.gender)
  return {
    id,
    members: [{
      name: identity.name,
      lastName: identity.lastName,
      relation: 'single',
      character: {
        ...character,
        name: identity.name,
        lastName: identity.lastName,
        characterKey: identity.key,
        ...(identity.office ? { office: identity.office } : {}),
        gender: identity.gender,
        role: identity.role,
      },
      scale: 1,
      age: identity.age,
    }],
  }
}

function createReeveFallbackFamily(seed: number, nameCulture: NameCulture): FamilyDef {
  const lastName = surnameForGender(generateFamilySurname(seed ^ 0x72656576, nameCulture), nameCulture, 'male')
  return createSingleAuthoredFamily(HOME_REEVE_FALLBACK_FAMILY_ID, seed ^ 0x72756466, {
    key: 'rudolf',
    name: AUTHORED_GIVEN_NAMES.rudolf,
    lastName,
    gender: 'male',
    role: 'farmer',
    age: HOME_REEVE_FALLBACK_AGE,
    office: 'reeve',
  })
}

/**
 * Overlays authored identities on the home settlement's final roster (after
 * staffing and profession surnames): Molly Lambert (shepherd) and Jakub
 * (hunter) by profession, then Rudolf — the future
 * reeve (Sołtys) — as the oldest remaining free man aged 35+. Only names, keys
 * and the office marker change; members are added only as fallback single
 * households (Molly / Jakub without a staffed woman shepherd / man hunter,
 * Rudolf with no free man 35+),
 * appended last so existing `NpcId`s stay stable. Deterministic.
 *
 * @domain settlements-npcs
 */
export function applyHomeAuthoredIdentities(
  families: readonly FamilyDef[],
  seed: number,
  nameCulture: NameCulture,
): FamilyDef[] {
  const next = [...families]
  const appended: FamilyDef[] = []
  for (const identity of HOME_PROFESSION_IDENTITIES) {
    // A household surname override never lands in a family that already
    // carries an authored identity (two authored surnames would overwrite
    // each other).
    const slot = findSlot(
      next,
      (member) => member.character.role === identity.role && member.character.gender === identity.gender,
      identity.familyLastName != null,
    )
    if (slot) applyIdentity(next, slot, identity)
    else if (identity.fallback) {
      const lastName = identity.familyLastName
        ?? surnameForGender(generateFamilySurname(seed ^ identity.fallback.seedSalt, nameCulture), nameCulture, identity.gender)
      appended.push(createSingleAuthoredFamily(identity.fallback.familyId, seed ^ identity.fallback.seedSalt, {
        key: identity.key,
        name: identity.name,
        lastName,
        gender: identity.gender,
        role: identity.role,
        age: identity.fallback.age,
      }))
    }
  }
  const reeveSlot = findOldestFreeMan(next)
  if (reeveSlot) applyIdentity(next, reeveSlot, { key: 'rudolf', name: AUTHORED_GIVEN_NAMES.rudolf, office: 'reeve' })
  else appended.push(createReeveFallbackFamily(seed, nameCulture))
  return [...next, ...appended]
}
