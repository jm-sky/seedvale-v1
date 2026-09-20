import { describe, expect, it } from 'vitest'
import type { CharacterDef, Role } from '../ai/characters'
import type { FamilyDef, FamilyMember } from './families'
import {
  ARTISAN_SKILL_MAX,
  ARTISAN_SKILL_MIN,
  ARTISAN_SPECIALIZATION_BONUS,
  ARTISAN_SPECIALIZATIONS,
  effectiveArtisanSkill,
  generateArtisanBaseSkill,
  resolveArtisanProfile,
  seedArtisanProfileIfNeeded,
} from './artisanProfile'

const PERSONALITY = {
  openness: 0.5,
  conscientiousness: 0.5,
  extraversion: 0.5,
  agreeableness: 0.5,
  neuroticism: 0.5,
}

function member(name: string, role: Role, age = 40): FamilyMember {
  const character: CharacterDef = {
    name,
    lastName: 'Test',
    gender: 'male',
    role,
    personality: PERSONALITY,
    traits: ['curious'],
  }
  return {
    name,
    lastName: 'Test',
    relation: 'single',
    character,
    scale: 1,
    age,
  }
}

function smithFamilies(count: number): FamilyDef[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `smith-${i}`,
    members: [member(`Kowal${i}`, 'blacksmith')],
  }))
}

describe('artisan skill generation (plan settlements-npcs-056)', () => {
  it('is deterministic for the same stable world/NPC inputs', () => {
    const input = { size: 'MD' as const, profession: 'blacksmith' as const, npcId: 's:npc:0', seed: 42 }
    expect(generateArtisanBaseSkill(input)).toBe(generateArtisanBaseSkill(input))
  })

  it('stays within 0..100', () => {
    for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
      for (let seed = 0; seed < 40; seed++) {
        const skill = generateArtisanBaseSkill({
          size,
          profession: 'blacksmith',
          npcId: `s:npc:${seed}`,
          seed: seed * 17,
        })
        expect(skill).toBeGreaterThanOrEqual(ARTISAN_SKILL_MIN)
        expect(skill).toBeLessThanOrEqual(ARTISAN_SKILL_MAX)
      }
    }
  })

  it('does not hard-lock a quality tier from settlement size', () => {
    const outpost = new Set<number>()
    const xl = new Set<number>()
    for (let i = 0; i < 80; i++) {
      outpost.add(generateArtisanBaseSkill({
        size: 'OUTPOST', profession: 'blacksmith', npcId: `o:npc:${i}`, seed: i,
      }))
      xl.add(generateArtisanBaseSkill({
        size: 'XL', profession: 'blacksmith', npcId: `x:npc:${i}`, seed: i,
      }))
    }
    expect(Math.min(...outpost)).toBeLessThan(70)
    expect(Math.max(...xl)).toBeGreaterThan(55)
    expect(Math.min(...xl)).toBeLessThan(70)
  })

  it('restore does not reroll a seeded profile', () => {
    const state = { artisanProfile: null as ReturnType<typeof resolveArtisanProfile>, artisanProfileInitialized: false }
    const input = {
      role: 'blacksmith' as const,
      npcId: 's:npc:0',
      settlementId: 's',
      seed: 9,
      size: 'MD' as const,
      families: smithFamilies(1),
    }
    seedArtisanProfileIfNeeded(state, input)
    const first = structuredClone(state.artisanProfile)
    state.artisanProfile!.baseSkill = 1
    seedArtisanProfileIfNeeded(state, input)
    expect(state.artisanProfile?.baseSkill).toBe(1)
    expect(first?.baseSkill).not.toBe(1)
  })
})

describe('artisan specialization coverage (plan settlements-npcs-056)', () => {
  it('keeps a single Blacksmith as a non-exclusive generalist', () => {
    const profile = resolveArtisanProfile({
      role: 'blacksmith',
      npcId: 's:npc:0',
      settlementId: 's',
      seed: 3,
      size: 'MD',
      families: smithFamilies(1),
    })
    expect(profile).not.toBeNull()
    expect(profile!.exclusive).toBe(false)
    expect(profile!.specializations.length).toBeLessThanOrEqual(3)
  })

  it('covers every Blacksmith category across two or more smiths', () => {
    const families = smithFamilies(2)
    const covered = new Set<string>()
    for (const [index] of families.entries()) {
      const profile = resolveArtisanProfile({
        role: 'blacksmith',
        npcId: `s:npc:${index}`,
        settlementId: 's',
        seed: 11,
        size: 'LG',
        families,
      })
      expect(profile).not.toBeNull()
      for (const spec of profile!.specializations) covered.add(spec)
    }
    expect([...ARTISAN_SPECIALIZATIONS].every((spec) => covered.has(spec))).toBe(true)
  })

  it('can assign exclusive specialists when 2+ Blacksmiths exist', () => {
    const families = smithFamilies(2)
    const profiles = families.map((_, index) => resolveArtisanProfile({
      role: 'blacksmith',
      npcId: `s:npc:${index}`,
      settlementId: 's',
      seed: 21,
      size: 'LG',
      families,
    }))
    expect(profiles.some((profile) => profile?.exclusive === true)).toBe(true)
  })

  it('returns null for a non-production role', () => {
    expect(resolveArtisanProfile({
      role: 'farmer',
      npcId: 's:npc:0',
      settlementId: 's',
      seed: 1,
      size: 'MD',
    })).toBeNull()
  })
})

describe('effective artisan skill', () => {
  it('adds the bounded specialization bonus and clamps to 0..100', () => {
    expect(effectiveArtisanSkill({ baseSkill: 70, specializations: ['swords'] }, 'swords'))
      .toBe(70 + ARTISAN_SPECIALIZATION_BONUS)
    expect(effectiveArtisanSkill({ baseSkill: 70, specializations: ['swords'] }, 'armor')).toBe(70)
    expect(effectiveArtisanSkill({ baseSkill: 95, specializations: ['swords'] }, 'swords')).toBe(100)
  })
})
