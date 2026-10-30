import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { CharacterKey } from '../../ai/characters'
import type { NpcDialogueCondition } from '../../ai/NpcAgent'
import { RESERVED_CHARACTERS } from '../../ai/characters'
import {
  type NpcPortraitDaypart,
  type NpcPortraitMood,
  npcPortraitSrcFor,
  selectNpcPortraitDaypart,
  selectNpcPortraitMood,
} from './npcPortrait'

const HEALTHY: NpcDialogueCondition = {
  hpRatio: 1,
  injurySeverity: 'none',
  exhausted: false,
  vigor: 50,
  hunger: 0.1,
  thirst: 0.1,
}

describe('selectNpcPortraitDaypart', () => {
  it('uses night while the sun is below the horizon', () => {
    expect(selectNpcPortraitDaypart(0)).toBe('night')
    expect(selectNpcPortraitDaypart(0.2)).toBe('night')
    expect(selectNpcPortraitDaypart(0.8)).toBe('night')
  })

  it('uses day between dawn and dusk', () => {
    expect(selectNpcPortraitDaypart(0.25)).toBe('day')
    expect(selectNpcPortraitDaypart(0.5)).toBe('day')
    expect(selectNpcPortraitDaypart(0.74)).toBe('day')
  })
})

describe('selectNpcPortraitMood', () => {
  it('is calm for a healthy stranger or friend', () => {
    expect(selectNpcPortraitMood(HEALTHY, 0)).toEqual({ mood: 'positive', reason: 'calm' })
    expect(selectNpcPortraitMood(HEALTHY, 10)).toEqual({ mood: 'positive', reason: 'calm' })
  })

  it('is tense when the personal relation is negative', () => {
    expect(selectNpcPortraitMood(HEALTHY, -1)).toEqual({ mood: 'negative', reason: 'disliked' })
  })

  it('lets physical condition override high sympathy', () => {
    const trusted = 10
    expect(selectNpcPortraitMood({ ...HEALTHY, injurySeverity: 'serious' }, trusted).reason).toBe('injured')
    expect(selectNpcPortraitMood({ ...HEALTHY, hpRatio: 0.4 }, trusted).reason).toBe('wounded')
    expect(selectNpcPortraitMood({ ...HEALTHY, exhausted: true }, trusted).reason).toBe('exhausted')
    expect(selectNpcPortraitMood({ ...HEALTHY, vigor: 0 }, trusted).reason).toBe('drained')
    expect(selectNpcPortraitMood({ ...HEALTHY, hunger: 0.9 }, trusted).reason).toBe('hungry')
    expect(selectNpcPortraitMood({ ...HEALTHY, thirst: 0.9 }, trusted).reason).toBe('thirsty')
  })

  it('ignores a minor injury', () => {
    expect(selectNpcPortraitMood({ ...HEALTHY, injurySeverity: 'minor' }, 0).mood).toBe('positive')
  })
})

describe('npcPortraitSrcFor', () => {
  it('returns null for procedural NPCs and unmapped characters', () => {
    expect(npcPortraitSrcFor(null, 'day', 'positive')).toBeNull()
    expect(npcPortraitSrcFor('anna_lesniewska', 'day', 'positive')).toBeNull()
  })

  it('maps every variant of a mapped character to an existing file', () => {
    const keys: CharacterKey[] = [
      ...RESERVED_CHARACTERS.map((c) => c.characterKey).filter((k): k is CharacterKey => k != null),
      'kazimierz',
      'rudolf',
      'patric_smith',
      'jakub',
      'molly_lambert',
      'archibald',
    ]
    const dayparts: NpcPortraitDaypart[] = ['day', 'night']
    const moods: NpcPortraitMood[] = ['positive', 'negative']
    let mapped = 0
    for (const key of keys) {
      for (const daypart of dayparts) {
        for (const mood of moods) {
          const src = npcPortraitSrcFor(key, daypart, mood)
          if (!src) continue
          mapped++
          expect(existsSync(resolve(process.cwd(), 'public', src.slice(1))), src).toBe(true)
        }
      }
    }
    expect(mapped).toBe(8 * 4)
  })
})
