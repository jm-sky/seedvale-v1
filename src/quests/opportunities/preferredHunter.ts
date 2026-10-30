import type { OpportunityNpc } from './worldQuestOpportunityTypes'

/** Home hunter Jakub (author decision 2026-10-30) — home quests that want a
 *  hunter use him first; other settlements have no authored hunter. */
function isAuthoredHunter(npc: OpportunityNpc): boolean {
  return npc.characterKey === 'jakub' && npc.role === 'hunter'
}

/**
 * First hunter in `pool`, preferring the authored home hunter (Jakub) over
 * generated hunters. Keeps the caller's order otherwise.
 *
 * @domain quests-progression
 */
export function findPreferredHunter<T extends OpportunityNpc>(pool: readonly T[]): T | undefined {
  return pool.find(isAuthoredHunter) ?? pool.find((npc) => npc.role === 'hunter')
}

/**
 * Hunters of `pool` in stable id order, authored hunter (Jakub) first.
 *
 * @domain quests-progression
 */
export function huntersAuthoredFirst<T extends OpportunityNpc>(pool: readonly T[]): T[] {
  return pool
    .filter((npc) => npc.role === 'hunter')
    .sort((a, b) => Number(isAuthoredHunter(b)) - Number(isAuthoredHunter(a)) || a.id.localeCompare(b.id))
}
