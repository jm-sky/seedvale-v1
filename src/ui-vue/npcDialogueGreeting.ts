import type { Personality } from '../ai/dialogue'
import type { RelationLevel } from '../quests/quests'
import { stableVariant } from '../ai/dialogueTemplates'
import { type NpcVoiceResolveInput, resolveNpcVoiceLine } from '../ai/npcVoiceLines'

/**
 * Opening greeting presentation (plan ui-input-047 §A): one resolved
 * text + optional clip, chosen once per explicit dialogue open.
 *
 * @domain ui-input
 */
export type NpcGreetingPresentation = {
  /** Polish history line — always present. */
  text: string
  /** Paired clip URL; `undefined` means text-only (no playback). */
  url: string | undefined
}

type GreetingContext = 'any' | 'morning' | 'notNight'

type GreetingTranscript = {
  /** Faithful Polish rendering of the English catalog transcript
   *  (`docs/design/npc-voices/CATALOG.md`). Audio itself stays English. */
  text: string
  context: GreetingContext
}

/** Registered V1 manifest greeting clips with verified catalog transcripts.
 *  `merchant_female_greeting_03` has no catalog entry → intentionally absent
 *  (text-only fallback instead of a guessed translation). */
const GREETING_TRANSCRIPTS: Readonly<Record<string, GreetingTranscript>> = {
  'guard_male_greeting_01.mp3': { text: 'Dzień dobry. W jakiej sprawie?', context: 'notNight' },
  'guard_male_greeting_02.mp3': { text: 'Poranek, wędrowcze. W osadzie trzymaj broń w pochwie.', context: 'morning' },
  'hunter_male_greeting_01.mp3': { text: 'Poranek. Idziesz do lasu?', context: 'morning' },
  'hunter_male_greeting_02.mp3': { text: 'Miło cię widzieć. Szmat drogi za tobą?', context: 'any' },
  'merchant_female_greeting_01.mp3': { text: 'Witaj, wędrowcze. Szukasz dziś czegoś przydatnego?', context: 'any' },
  'merchant_female_greeting_02.mp3': { text: 'A, klient. Chodź, rzuć okiem.', context: 'any' },
}

const FALLBACK_GREETINGS: Readonly<Record<Personality, { day: readonly string[], night: readonly string[], familiar: readonly string[] }>> = {
  cheerful: {
    day: ['Witaj! Miło cię widzieć.', 'O, cześć! Dobrze, że wpadłeś.'],
    night: ['O, ktoś jeszcze nie śpi! Witaj.'],
    familiar: ['Znowu ty! Cieszę się, że cię widzę.'],
  },
  calm: {
    day: ['Witaj.', 'Dzień dobry.'],
    night: ['Dobry wieczór.'],
    familiar: ['Witaj ponownie.'],
  },
  grumpy: {
    day: ['No? Czego chcesz?', 'Hm. Słucham.'],
    night: ['Po ciemku się włóczysz? No, słucham.'],
    familiar: ['A, to ty. Mów.'],
  },
  curious: {
    day: ['Witaj! Co cię sprowadza?', 'O, cześć. Co słychać?'],
    night: ['O tej porze? Ciekawe, co cię sprowadza.'],
    familiar: ['Znów się widzimy. Co nowego?'],
  },
}

function isNight(timeOfDay: number): boolean {
  return timeOfDay < 0.2 || timeOfDay >= 0.85
}

function isMorning(timeOfDay: number): boolean {
  return timeOfDay >= 0.2 && timeOfDay < 0.5
}

function contextAllows(context: GreetingContext, timeOfDay: number): boolean {
  if (context === 'morning') return isMorning(timeOfDay)
  if (context === 'notNight') return !isNight(timeOfDay)
  return true
}

function urlFilename(url: string): string {
  return url.slice(url.lastIndexOf('/') + 1)
}

/**
 * Resolve one greeting (text + clip) for an explicit dialogue open. The clip
 * is picked once via `resolveNpcVoiceLine`; its transcript is looked up and
 * validated against time of day. Unknown/incompatible clips yield an authored
 * text-only greeting and no playback.
 *
 * @domain ui-input
 */
export function resolveNpcGreetingPresentation(
  npc: NpcVoiceResolveInput,
  archetype: Personality,
  timeOfDay: number,
  relationLevel: RelationLevel,
  resolveUrl: (npc: NpcVoiceResolveInput) => string | undefined = (n) => resolveNpcVoiceLine(n, 'greeting'),
): NpcGreetingPresentation {
  const url = resolveUrl(npc)
  const transcript = url ? GREETING_TRANSCRIPTS[urlFilename(url)] : undefined
  if (url && transcript && contextAllows(transcript.context, timeOfDay)) {
    return { text: transcript.text, url }
  }
  const pool = FALLBACK_GREETINGS[archetype]
  const familiar = relationLevel === 'friendly' || relationLevel === 'trusted'
  const lines = isNight(timeOfDay) ? pool.night : familiar ? pool.familiar : pool.day
  return { text: stableVariant(lines, `${npc.id}|greeting`), url: undefined }
}
