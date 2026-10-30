import { describe, expect, it } from 'vitest'
import type { OpportunityNpc } from './worldQuestOpportunityTypes'
import { findPreferredHunter, huntersAuthoredFirst } from './preferredHunter'

const npc = (id: string, role: OpportunityNpc['role'], characterKey?: OpportunityNpc['characterKey']): OpportunityNpc => ({
  id: `home:npc:${id}`,
  name: id,
  role,
  child: false,
  ...(characterKey ? { characterKey } : {}),
})

describe('preferred hunter', () => {
  const pool = [npc('1', 'farmer'), npc('2', 'hunter'), npc('3', 'hunter', 'jakub')]

  it('prefers Jakub over earlier generated hunters', () => {
    expect(findPreferredHunter(pool)?.name).toBe('3')
    expect(huntersAuthoredFirst(pool).map((h) => h.name)).toEqual(['3', '2'])
  })

  it('falls back to the first generated hunter', () => {
    expect(findPreferredHunter(pool.slice(0, 2))?.name).toBe('2')
    expect(findPreferredHunter([npc('1', 'farmer')])).toBeUndefined()
  })
})
