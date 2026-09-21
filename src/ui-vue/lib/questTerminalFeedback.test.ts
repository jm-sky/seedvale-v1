import { describe, expect, it } from 'vitest'
import type { QuestListEntry } from '../../quests/QuestManager'
import type { QuestState } from '../../quests/quests'
import { formatQuestTerminalToast, questLogTerminalResultText } from './questTerminalFeedback'

function entry(state: QuestState, resultText?: string): QuestListEntry {
  return {
    id: 'q',
    title: 'Tytuł',
    description: '',
    giverName: 'Giver',
    giverNpcId: 'home:npc:0',
    state,
    stageIndex: 0,
    totalStages: 1,
    currentObjective: null,
    promisedReward: null,
    notes: [],
    ...(resultText !== undefined ? { resultText } : {}),
  }
}

describe('formatQuestTerminalToast', () => {
  it('joins title, state, result text and shown reward', () => {
    expect(formatQuestTerminalToast({
      title: 'Stare kości',
      state: 'complete',
      resultText: 'Sygnet wrócił do pierwszego spadkobiercy.',
      shownReward: { items: [{ kind: 'coin', count: 5 }] },
    })).toBe(
      'Stare kości — zakończony\nSygnet wrócił do pierwszego spadkobiercy.\nNagroda: 5× moneta',
    )
  })

  it('omits hidden-unspecified reward and empty result text', () => {
    expect(formatQuestTerminalToast({
      title: 'Wilki',
      state: 'failed',
      resultText: '   ',
    })).toBe('Wilki — nieudany')
  })
})

describe('questLogTerminalResultText', () => {
  it('renders complete/failed/abandoned copy and hides the rest', () => {
    expect(questLogTerminalResultText(entry('complete', 'Sygnet wrócił.'))).toBe('Sygnet wrócił.')
    expect(questLogTerminalResultText(entry('failed', 'Nie zdążyłeś.'))).toBe('Nie zdążyłeś.')
    expect(questLogTerminalResultText(entry('abandoned', 'Zrezygnowałeś z tego zadania.')))
      .toBe('Zrezygnowałeś z tego zadania.')
    expect(questLogTerminalResultText(entry('active', 'should stay hidden'))).toBeNull()
    expect(questLogTerminalResultText(entry('complete'))).toBeNull()
    expect(questLogTerminalResultText(entry('complete', '  '))).toBeNull()
    expect(questLogTerminalResultText(entry('invalidated', 'nie zmyślać'))).toBeNull()
  })
})
