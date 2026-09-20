import { describe, expect, it } from 'vitest'
import type { QuestProgressEntry } from './quests'
import { requiresGeneratedOpportunityRetention } from './generatedOpportunityRetention'

const pristine: QuestProgressEntry = {
  id: 'world:rpg:old-place-secret:home:monolith:1:1:0:1',
  state: 'not_offered',
  stageIndex: 0,
}

describe('requiresGeneratedOpportunityRetention', () => {
  it('does not retain a pristine default not_offered entry', () => {
    expect(requiresGeneratedOpportunityRetention(pristine)).toBe(false)
  })

  it.each([
    'offered',
    'active',
    'ready_to_report',
    'complete',
    'failed',
    'abandoned',
    'invalidated',
  ] as const)('retains lifecycle state %s', (state) => {
    expect(requiresGeneratedOpportunityRetention({ ...pristine, state })).toBe(true)
  })

  it('retains declined suppression on not_offered', () => {
    expect(requiresGeneratedOpportunityRetention({
      ...pristine,
      offerSuppressedUntilDay: 12,
    })).toBe(true)
  })

  it.each([
    ['journal', { journal: [{ kind: 'offer' as const, atDays: 1, timeOfDay: 0.5 }] }],
    ['worldKnowledge', { worldKnowledge: { target: { requestedAtDays: 1, revealAtDays: 2, status: 'requested' as const } } }],
    ['dialogueCooldowns', { dialogueCooldowns: { Anna: { untilDay: 5, stageIndex: 0, actionIndex: 0, reactionIndex: 0 } } }],
    ['observation', {
      observation: {
        type: 'habitat_pressure' as const,
        habitatId: 'den:1',
        condition: 'healthy' as const,
        primary: null,
        observedPressures: [],
      },
    }],
  ] as const)('retains not_offered with %s metadata', (_label, extra) => {
    expect(requiresGeneratedOpportunityRetention({ ...pristine, ...extra })).toBe(true)
  })

  it.each([
    ['stageIndex', { stageIndex: 1 }],
    ['resolvedOutcomeId', { resolvedOutcomeId: 'complete' }],
    ['stageCount', { stageCount: 2 }],
    ['stageSlotProgress', { stageSlotProgress: { slot: { count: 1 } } }],
  ] as const)('retains not_offered with %s progress', (_label, extra) => {
    expect(requiresGeneratedOpportunityRetention({ ...pristine, ...extra })).toBe(true)
  })

  it('does not retain empty stage slot progress shells', () => {
    expect(requiresGeneratedOpportunityRetention({
      ...pristine,
      stageSlotProgress: { slot: {} },
    })).toBe(false)
  })
})
