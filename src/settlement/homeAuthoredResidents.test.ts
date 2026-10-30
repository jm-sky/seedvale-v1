import { describe, expect, it } from 'vitest'
import type { NpcGender, Role } from '../ai/characters'
import type { FamilyDef, FamilyMember } from './families'
import {
  applyHomeAuthoredIdentities,
  createHomeElderFamily,
  HOME_REEVE_FALLBACK_FAMILY_ID,
  HOME_SHEPHERD_FALLBACK_FAMILY_ID,
  isHomeElderFamily,
} from './homeAuthoredResidents'

const PERSONALITY = { openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5 }

function member(name: string, role: Role, age: number, gender: NpcGender, relation: FamilyMember['relation'] = 'single'): FamilyMember {
  const lastName = 'Kowalski'
  return {
    name,
    lastName,
    relation,
    character: { name, lastName, gender, role, personality: PERSONALITY, traits: [] },
    scale: 1,
    age,
  }
}

function roster(): FamilyDef[] {
  return [
    { id: 'family-reserved-0', members: [member('Piotr', 'woodcutter', 70, 'male', 'husband')] },
    { id: 'family-2', members: [member('Ewa', 'shepherd', 30, 'female', 'wife'), member('Tomek', 'farmer', 33, 'male', 'husband')] },
    { id: 'family-5', members: [member('Adam', 'blacksmith', 35, 'male')] },
    { id: 'family-3', members: [member('Olek', 'hunter', 40, 'male'), member('Kuba', 'farmer', 10, 'male', 'child')] },
    { id: 'family-4', members: [member('Bogdan', 'farmer', 61, 'male')] },
    createHomeElderFamily(1, 'polish'),
  ]
}

const byKey = (families: readonly FamilyDef[]) => new Map(
  families.flatMap((f) => f.members).filter((m) => m.character.characterKey).map((m) => [m.character.characterKey!, m]),
)

describe('home authored residents', () => {
  it('creates Kazimierz as a single 74-year-old widower household', () => {
    const elder = createHomeElderFamily(1, 'polish')
    expect(isHomeElderFamily(elder)).toBe(true)
    expect(elder.members).toHaveLength(1)
    expect(elder.members[0]).toMatchObject({ name: 'Kazimierz', lastName: 'Nowak', age: 74, relation: 'single' })
    expect(elder.members[0]!.character.characterKey).toBe('kazimierz')
  })

  it('overlays profession identities and picks Rudolf as the oldest free man', () => {
    const result = applyHomeAuthoredIdentities(roster(), 1, 'polish')
    const keyed = byKey(result)
    expect(keyed.get('molly_lambert')).toMatchObject({ name: 'Molly', lastName: 'Lambert' })
    expect(keyed.get('patric_smith')).toMatchObject({ name: 'Patric', lastName: 'Smith' })
    expect(keyed.get('jakub')?.name).toBe('Jakub')
    // Reserved Piotr (70) and authored Kazimierz (74) are never candidates.
    expect(keyed.get('rudolf')).toMatchObject({ name: 'Rudolf', age: 61 })
    expect(keyed.get('rudolf')!.character.office).toBe('reeve')
    expect(keyed.get('piotr_lesniewski')).toBeUndefined()
    // Household surname follows the authored one; member count unchanged.
    expect(result.flatMap((f) => f.members)).toHaveLength(roster().flatMap((f) => f.members).length)
    expect(result[1]!.members.map((m) => m.lastName)).toEqual(['Lambert', 'Lambert'])
  })

  it('never puts two surname-bearing identities in one household', () => {
    const families: FamilyDef[] = [
      { id: 'family-2', members: [member('Ewa', 'shepherd', 30, 'female', 'wife'), member('Adam', 'blacksmith', 33, 'male', 'husband')] },
    ]
    const keyed = byKey(applyHomeAuthoredIdentities(families, 1, 'polish'))
    expect(keyed.get('molly_lambert')?.lastName).toBe('Lambert')
    expect(keyed.get('patric_smith')).toBeUndefined()
  })

  it('appends a fallback Molly shepherdess household when no woman shepherd exists', () => {
    const families: FamilyDef[] = [
      { id: 'family-2', members: [member('Bogdan', 'farmer', 50, 'male')] },
      createHomeElderFamily(1, 'polish'),
    ]
    const result = applyHomeAuthoredIdentities(families, 1, 'polish')
    expect(result.map((f) => f.id)).toEqual(['family-2', 'family-story-home-elder', HOME_SHEPHERD_FALLBACK_FAMILY_ID])
    expect(result.at(-1)!.members[0]).toMatchObject({ name: 'Molly', lastName: 'Lambert' })
    expect(result.at(-1)!.members[0]!.character.role).toBe('shepherd')
  })

  it('is deterministic', () => {
    expect(applyHomeAuthoredIdentities(roster(), 1, 'polish')).toEqual(applyHomeAuthoredIdentities(roster(), 1, 'polish'))
  })

  it('appends a fallback Rudolf household when no free man exists', () => {
    const families: FamilyDef[] = [
      { id: 'family-2', members: [member('Ewa', 'shepherd', 30, 'female')] },
      createHomeElderFamily(1, 'polish'),
    ]
    const result = applyHomeAuthoredIdentities(families, 1, 'polish')
    expect(result).toHaveLength(families.length + 1)
    expect(result.at(-1)!.id).toBe(HOME_REEVE_FALLBACK_FAMILY_ID)
    expect(result.at(-1)!.members[0]!.character).toMatchObject({ name: 'Rudolf', characterKey: 'rudolf', office: 'reeve' })
  })
})
