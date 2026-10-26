/**
 * Stage D D9 fixtures — Character / Skills presentation only.
 * No WorldBundle / save / live Inventory.
 * @domain ui
 */
import type { BadgeDef, SettlementBadgeDef } from '../../../badges/badges'
import type { CharacterPresentation } from '../../../player/characterPresentation'
import type { CharacterReputationView } from '../../store'
import { SKILL_IDS, type SkillId } from '../../../player/PlayerSkills'

export type SkillsActionCardInput = {
  id: SkillId
  value: number
  xp: number
}

export type DemoViewId = 'character-critical' | 'character-healthy' | 'skills-sneak-off' | 'skills-sneak-on'

export type DemoScenario = {
  id: DemoViewId
  label: string
  kind: 'character' | 'skills'
}

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  { id: 'character-critical', label: 'Postać · krytyczne + warunki', kind: 'character' },
  { id: 'character-healthy', label: 'Postać · pełne', kind: 'character' },
  { id: 'skills-sneak-off', label: 'Umiejętności · sneak off', kind: 'skills' },
  { id: 'skills-sneak-on', label: 'Umiejętności · sneak on + med', kind: 'skills' },
]

const EMPTY_SLOTS = [
  { slot: 'head' as const, itemLabel: null, qualityLabel: null },
  { slot: 'body' as const, itemLabel: null, qualityLabel: null },
  { slot: 'arms' as const, itemLabel: null, qualityLabel: null },
  { slot: 'hands' as const, itemLabel: null, qualityLabel: null },
  { slot: 'legs' as const, itemLabel: null, qualityLabel: null },
  { slot: 'feet' as const, itemLabel: null, qualityLabel: null },
]

function skillViews(overrides: Partial<Record<SkillId, { value: number, xp: number }>> = {}): CharacterPresentation['skills'] {
  return SKILL_IDS.map((id) => ({
    id,
    value: overrides[id]?.value ?? Math.round((0.15 + SKILL_IDS.indexOf(id) * 0.08) * 100),
    xp: overrides[id]?.xp ?? 40 + SKILL_IDS.indexOf(id) * 25,
  }))
}

const SETTLEMENT_BADGE: SettlementBadgeDef = {
  id: 'caretaker',
  icon: '🧹',
  label: 'Opiekun',
  description: 'Posprzątałeś okolice osady.',
}

export const DEMO_BADGES: readonly BadgeDef[] = [
  {
    id: 'treasure_hunter',
    icon: '💰',
    label: 'Poszukiwacz skarbów',
    description: 'Znalazłeś 5 ukrytych znalezisk.',
  },
]

export function characterCriticalFixture(): {
  hp: { current: number, max: number }
  stamina: { current: number, max: number }
  vigor: { current: number, max: number }
  hunger: { current: number, max: number }
  thirst: { current: number, max: number }
  presentation: CharacterPresentation
  reputation: CharacterReputationView
  badges: readonly BadgeDef[]
} {
  return {
    hp: { current: 18, max: 100 },
    stamina: { current: 40, max: 100 },
    vigor: { current: 55, max: 100 },
    hunger: { current: 12, max: 100 },
    thirst: { current: 70, max: 100 },
    presentation: {
      attributes: [
        {
          id: 'strength',
          base: 55,
          effective: 48,
          modifiers: [{ category: 'injury', delta: -7 }],
        },
        {
          id: 'perception',
          base: 60,
          effective: 60,
          modifiers: [],
        },
        {
          id: 'endurance',
          base: 50,
          effective: 42,
          modifiers: [
            { category: 'fatigue', delta: -5 },
            { category: 'illness', delta: -3 },
          ],
        },
        {
          id: 'agility',
          base: 58,
          effective: 58,
          modifiers: [],
        },
      ],
      skills: skillViews({ sneak: { value: 34, xp: 120 }, medicine: { value: 22, xp: 55 } }),
      conditions: [
        {
          sourceId: 'sprain',
          category: 'injury',
          label: 'Skręcenie',
          severityLabel: 'umiarkowane',
          effects: [{ id: 'strength', delta: -7 }],
        },
        {
          sourceId: 'tired',
          category: 'fatigue',
          label: 'Zmęczenie',
          effects: [{ id: 'endurance', delta: -5 }],
        },
        {
          sourceId: 'cold',
          category: 'illness',
          label: 'Przeziębienie',
          severityLabel: 'łagodne',
          effects: [{ id: 'endurance', delta: -3 }],
        },
      ],
      equipment: {
        damageReduction: 0.12,
        attackStaminaDelta: 0.05,
        meleeRecoveryDelta: -0.04,
        movementSpeedDelta: -0.08,
        sprintStaminaDelta: 0.1,
        slots: [
          { slot: 'head', itemLabel: null, qualityLabel: null },
          { slot: 'body', itemLabel: 'Kaftan skórzany', qualityLabel: 'dobry' },
          { slot: 'arms', itemLabel: null, qualityLabel: null },
          { slot: 'hands', itemLabel: 'Rękawice', qualityLabel: 'zwykłe' },
          { slot: 'legs', itemLabel: 'Spodnie', qualityLabel: 'zwykłe' },
          { slot: 'feet', itemLabel: 'Buty', qualityLabel: 'dobry' },
        ],
      },
    },
    reputation: {
      settlements: [
        { settlementId: 's1', settlementName: 'Brzozówka' },
        { settlementId: 's2', settlementName: 'Młyńsk' },
      ],
      selectedSettlementId: 's1',
      selected: {
        settlementId: 's1',
        settlementName: 'Brzozówka',
        reputation: {
          trust: 35,
          competence: 12,
          benevolence: -8,
          courage: 40,
          integrity: 22,
        },
        renown: 18,
        settlementBadges: [SETTLEMENT_BADGE],
      },
    },
    badges: DEMO_BADGES,
  }
}

export function characterHealthyFixture(): ReturnType<typeof characterCriticalFixture> {
  const base = characterCriticalFixture()
  return {
    ...base,
    hp: { current: 100, max: 100 },
    stamina: { current: 100, max: 100 },
    vigor: { current: 100, max: 100 },
    hunger: { current: 85, max: 100 },
    thirst: { current: 90, max: 100 },
    presentation: {
      ...base.presentation,
      attributes: [
        { id: 'strength', base: 55, effective: 55, modifiers: [] },
        { id: 'perception', base: 60, effective: 60, modifiers: [] },
        { id: 'endurance', base: 50, effective: 50, modifiers: [] },
        { id: 'agility', base: 58, effective: 58, modifiers: [] },
      ],
      conditions: [],
      equipment: {
        damageReduction: 0,
        attackStaminaDelta: 0,
        meleeRecoveryDelta: 0,
        movementSpeedDelta: 0,
        sprintStaminaDelta: 0,
        slots: EMPTY_SLOTS,
      },
    },
  }
}

export function skillsFixture(mode: 'off' | 'on'): {
  skills: SkillsActionCardInput[]
  sneakActive: boolean
  selectedSkill: SkillId | null
} {
  const skills: SkillsActionCardInput[] = [
    { id: 'sneak', value: 0.34, xp: 120 },
    { id: 'traps', value: 0.28, xp: 80 },
    { id: 'medicine', value: 0.22, xp: 55 },
    { id: 'repair', value: 0.18, xp: 40 },
  ]
  return {
    skills,
    sneakActive: mode === 'on',
    selectedSkill: mode === 'on' ? 'medicine' : null,
  }
}
