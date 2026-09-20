import type { QuestProgressEntry, QuestStageSlotProgress } from './quests'

function hasMeaningfulSlotProgress(
  slots: Record<string, QuestStageSlotProgress> | undefined,
): boolean {
  if (!slots) return false
  for (const slot of Object.values(slots)) {
    if (slot.completed) return true
    if (slot.count !== undefined && slot.count > 0) return true
  }
  return false
}

/** Whether a saved generated quest entry requires its deterministic definition
 *  to be reconstructed on the next composition boot. Pristine default
 *  `not_offered` rows exported from materialization alone do not qualify. */
export function requiresGeneratedOpportunityRetention(entry: QuestProgressEntry): boolean {
  if (entry.state !== 'not_offered') return true
  if (entry.stageIndex !== 0) return true
  if (entry.resolvedOutcomeId !== undefined) return true
  if (entry.stageCount !== undefined && entry.stageCount > 0) return true
  if (hasMeaningfulSlotProgress(entry.stageSlotProgress)) return true
  if (entry.offerSuppressedUntilDay !== undefined) return true
  if (entry.journal && entry.journal.length > 0) return true
  if (entry.worldKnowledge && Object.keys(entry.worldKnowledge).length > 0) return true
  if (entry.dialogueCooldowns && Object.keys(entry.dialogueCooldowns).length > 0) return true
  if (entry.observation !== undefined) return true
  return false
}
