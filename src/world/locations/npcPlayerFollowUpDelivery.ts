import type { NpcPlayerFollowUpHost } from '../../ai/npcPlayerFollowUp'
import { consumeNpcPlayerFollowUp } from '../../ai/npcPlayerFollowUp'
import { rumourOutcomeLine } from '../../ai/rumourLines'

/**
 * The one delivery/consume seam for `deliver_world_knowledge` follow-ups
 * (plan npc-050 §7) — both manual "ask again" dialogue and the NPC-initiated
 * proactive approach call this same operation. Since Q138 nobody arms such a
 * follow-up (rumours are answered instantly and never reveal an exact name),
 * so this only drains one armed by an older save: it is consumed WITHOUT
 * revealing anything (the old path handed out exact names/pins, which a
 * rumour must never do) and the NPC says it has nothing new. Idempotent: a
 * repeated call with an already-consumed id is a harmless no-op (`null`).
 *
 * @domain world-locations
 */
export function deliverNpcWorldKnowledgeFollowUp(
  npcState: NpcPlayerFollowUpHost,
  followUpId: string,
): string | null {
  const followUp = npcState.playerFollowUp
  if (!followUp || followUp.id !== followUpId || followUp.kind !== 'deliver_world_knowledge') return null
  const speaker = followUp.source?.kind === 'hunter' ? 'hunter' : 'guard'
  consumeNpcPlayerFollowUp(npcState, followUpId)
  return rumourOutcomeLine('none', speaker, 0)
}
