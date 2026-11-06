import { describe, expect, it } from 'vitest'
import type { NpcPlayerFollowUp } from '../../ai/npcPlayerFollowUp'
import { deliverNpcWorldKnowledgeFollowUp } from './npcPlayerFollowUpDelivery'

function host(followUp: NpcPlayerFollowUp | null) {
  return { playerFollowUp: followUp, health: { dead: false }, postDeath: null }
}

const FOLLOW_UP: NpcPlayerFollowUp = {
  kind: 'deliver_world_knowledge',
  id: 'followUp:1',
  createdAtDays: 1,
  source: { kind: 'guard' },
  selectedLocationIds: ['a', 'b'],
}

describe('deliverNpcWorldKnowledgeFollowUp (legacy drain, Q138)', () => {
  it('consumes an old armed follow-up and says nothing new', () => {
    const state = host({ ...FOLLOW_UP })
    const line = deliverNpcWorldKnowledgeFollowUp(state, FOLLOW_UP.id)
    expect(line).toBeTruthy()
    expect(state.playerFollowUp).toBeNull()
  })

  it('is idempotent — a repeated call with the consumed id is a no-op', () => {
    const state = host({ ...FOLLOW_UP })
    deliverNpcWorldKnowledgeFollowUp(state, FOLLOW_UP.id)
    expect(deliverNpcWorldKnowledgeFollowUp(state, FOLLOW_UP.id)).toBeNull()
  })

  it('rejects a stale/mismatched follow-up id without touching state', () => {
    const state = host({ ...FOLLOW_UP })
    expect(deliverNpcWorldKnowledgeFollowUp(state, 'followUp:other')).toBeNull()
    expect(state.playerFollowUp).not.toBeNull()
  })
})
