import { describe, expect, it } from 'vitest'
import { playerJoinInvitationLine, stableVariant } from '../ai/dialogueTemplates'
import { resolveNpcGreetingPresentation } from './npcDialogueGreeting'

const npc = { id: 'npc-1', gender: 'male', role: 'guard', age: 40, voiceProfileId: 'guard:male' } as const

describe('resolveNpcGreetingPresentation', () => {
  it('pairs a registered clip with its own translated transcript', () => {
    const url = '/sounds/voices/hunter_male_greeting_02.mp3'
    const g = resolveNpcGreetingPresentation(npc, 'calm', 0.4, 'stranger', () => url)
    expect(g).toEqual({ text: 'Miło cię widzieć. Szmat drogi za tobą?', url })
  })

  it('falls back to text-only for a clip without a verified transcript', () => {
    const g = resolveNpcGreetingPresentation(npc, 'calm', 0.4, 'stranger', () => '/sounds/voices/merchant_female_greeting_03.mp3')
    expect(g.url).toBeUndefined()
    expect(g.text).not.toBe('')
  })

  it('does not play a "Morning" clip at night', () => {
    const g = resolveNpcGreetingPresentation(npc, 'calm', 0.95, 'stranger', () => '/sounds/voices/guard_male_greeting_02.mp3')
    expect(g.url).toBeUndefined()
  })

  it('is text-only when no clip resolves, and deterministic', () => {
    const a = resolveNpcGreetingPresentation(npc, 'cheerful', 0.4, 'stranger', () => undefined)
    const b = resolveNpcGreetingPresentation(npc, 'cheerful', 0.4, 'stranger', () => undefined)
    expect(a.url).toBeUndefined()
    expect(a).toEqual(b)
  })
})

describe('player invitation lines', () => {
  it.each([[0.5, 'na pół dnia'], [1, 'na jeden dzień'], [2, 'na dwa dni'], [3, 'na trzy dni']])('mentions %s days', (days, phrase) => {
    for (const seed of ['a', 'b', 'c', 'd', 'e']) expect(playerJoinInvitationLine(days, seed)).toContain(phrase)
  })

  it('stableVariant is stable for a seed', () => {
    expect(stableVariant(['x', 'y', 'z'], 'seed')).toBe(stableVariant(['x', 'y', 'z'], 'seed'))
  })
})
