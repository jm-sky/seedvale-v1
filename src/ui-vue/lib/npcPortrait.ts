import type { NpcAgent } from '../../ai/NpcAgent'

/**
 * Portrait image URL for the NPC dialogue window, or null for none.
 * No NPC portraits are mapped yet — return a `/images/npc/...` path here once art exists
 * (the dialogue window already renders it when set).
 */
export function resolveNpcPortraitSrc(_npc: NpcAgent): string | null {
  return null
}
