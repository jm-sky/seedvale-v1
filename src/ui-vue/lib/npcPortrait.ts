import type { CharacterKey } from '../../ai/characters'
import type { NpcAgent, NpcDialogueCondition } from '../../ai/NpcAgent'
import { CRITICAL_FOOD_THRESHOLD, CRITICAL_WATER_THRESHOLD } from '../../ai/Needs'
import { VIGOR_COLLAPSE_THRESHOLD } from '../../shared/VigorState'

/** Lighting variant of a portrait — follows the world clock. */
export type NpcPortraitDaypart = 'day' | 'night'

/** Emotional variant: `positive` = friendly/calm, `negative` = tense/strained. */
export type NpcPortraitMood = 'positive' | 'negative'

/** Why `selectNpcPortraitMood` picked its mood — first matching rule wins. */
export type NpcPortraitMoodReason =
  | 'injured'
  | 'wounded'
  | 'exhausted'
  | 'drained'
  | 'hungry'
  | 'thirsty'
  | 'disliked'
  | 'calm'

export type NpcPortraitMoodResult = {
  mood: NpcPortraitMood
  reason: NpcPortraitMoodReason
}

/**
 * Portrait art base names (`public/images/npc/<base>-<daypart>-<mood>.webp`)
 * keyed by stable `CharacterKey` — never by display name. NPCs without an
 * entry render the dialogue window without a portrait.
 *
 * Art present but not yet bound to a V1 character: `casimir-eastwood`,
 * `jacob-hunter`, `molly`, `patric-smith`, `pierce`, `rudolf`.
 */
const NPC_PORTRAIT_BASES: Partial<Record<CharacterKey, string>> = {
  kasia_hornblower: 'kate-hornblower',
  marek_hornblower: 'mark-hornblower',
  piotr_lesniewski: 'peter-woodworth',
}

/** Below this HP ratio an NPC looks strained regardless of sympathy. */
const PORTRAIT_WOUNDED_HP_RATIO = 0.5

/**
 * Night while the sun is below the horizon — same elevation curve as
 * `skyParamsFromTime` (`timeOfDay` 0 = midnight, 0.25 ≈ dawn, 0.75 ≈ dusk).
 */
export function selectNpcPortraitDaypart(timeOfDay: number): NpcPortraitDaypart {
  return timeOfDay < 0.25 || timeOfDay >= 0.75 ? 'night' : 'day'
}

/**
 * Portrait mood. Physical condition overrides sympathy (an injured or
 * exhausted friend still looks strained); otherwise a negative personal
 * relation with the player reads as tense, and everything else — strangers
 * included — as calm.
 */
export function selectNpcPortraitMood(condition: NpcDialogueCondition, relation: number): NpcPortraitMoodResult {
  const negative = (reason: NpcPortraitMoodReason): NpcPortraitMoodResult => ({ mood: 'negative', reason })
  if (condition.injurySeverity === 'serious' || condition.injurySeverity === 'critical') return negative('injured')
  if (condition.hpRatio < PORTRAIT_WOUNDED_HP_RATIO) return negative('wounded')
  if (condition.exhausted) return negative('exhausted')
  if (condition.vigor < VIGOR_COLLAPSE_THRESHOLD) return negative('drained')
  if (condition.hunger >= CRITICAL_FOOD_THRESHOLD) return negative('hungry')
  if (condition.thirst >= CRITICAL_WATER_THRESHOLD) return negative('thirsty')
  if (relation < 0) return negative('disliked')
  return { mood: 'positive', reason: 'calm' }
}

/** Portrait URL for an authored character key, or null when no art is mapped. */
export function npcPortraitSrcFor(
  characterKey: CharacterKey | null,
  daypart: NpcPortraitDaypart,
  mood: NpcPortraitMood,
): string | null {
  const base = characterKey ? NPC_PORTRAIT_BASES[characterKey] : undefined
  return base ? `/images/npc/${base}-${daypart}-${mood}.webp` : null
}

/**
 * Portrait image URL for the NPC dialogue window, or null for none.
 * Resolved once when the dialogue opens, from the world clock, the NPC's
 * physical condition and the player's personal relation with them.
 */
export function resolveNpcPortraitSrc(npc: NpcAgent, timeOfDay: number, relation: number): string | null {
  if (!npc.characterKey || !NPC_PORTRAIT_BASES[npc.characterKey]) return null
  const { mood } = selectNpcPortraitMood(npc.getDialogueCondition(), relation)
  return npcPortraitSrcFor(npc.characterKey, selectNpcPortraitDaypart(timeOfDay), mood)
}
