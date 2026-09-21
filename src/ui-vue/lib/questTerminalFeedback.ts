import type { QuestListEntry, QuestTerminalPresentation } from '../../quests/QuestManager'
import { ITEM_DEFS } from '../../items/items'

const TERMINAL_STATE_LABEL = {
  complete: 'zakończony',
  failed: 'nieudany',
} as const

/**
 * Shared toast copy for a newly committed complete/failed quest outcome.
 * Title, terminal state, resolved result text, and shown reward only.
 *
 * @domain quests-progression
 */
export function formatQuestTerminalToast(presentation: QuestTerminalPresentation): string {
  const lines = [`${presentation.title} — ${TERMINAL_STATE_LABEL[presentation.state]}`]
  const result = presentation.resultText.trim()
  if (result) lines.push(result)
  const items = presentation.shownReward?.items ?? []
  if (items.length > 0) {
    lines.push(
      `Nagroda: ${items.map((item) => `${item.count}× ${ITEM_DEFS[item.kind].label}`).join(', ')}`,
    )
  }
  return lines.join('\n')
}

/**
 * Quest Log details result copy. Active/offered entries never expose a
 * terminal result; empty `resultText` does not open a result section.
 *
 * @domain quests-progression
 */
export function questLogTerminalResultText(entry: QuestListEntry): string | null {
  if (entry.state !== 'complete' && entry.state !== 'failed' && entry.state !== 'abandoned') {
    return null
  }
  const text = entry.resultText?.trim()
  return text ? text : null
}
