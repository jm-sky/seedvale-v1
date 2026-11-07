import type { CardinalSector } from '../quests/cardinalDirection'
import type { WorldLocationKind } from '../world/locations/worldLocationTypes'
import { cardinalSector } from '../quests/cardinalDirection'

/**
 * Approved English rumour lines (plan world-041 L4, author-approved script
 * `docs/research/v1-revival/2026-11-06--q137-npc-rumour-line-script.md`) and
 * their pure formatter. Text only: it never sees a proper name or canonical
 * target coordinates — callers pass a kind, a bearing and rough hours derived
 * from the projected lead area (`rumourLeadAreaForEntry`).
 *
 * @domain dialogue
 */

export type RumourSpeaker = 'adult' | 'guard' | 'hunter'

/** Kinds that have approved rumour copy today (L0 §5). */
export type RumourKind = Extract<WorldLocationKind, 'cave' | 'ruins' | 'lake' | 'mountainPeak' | 'cemetery'>

export type RumourOutcome = 'trust' | 'cap' | 'none' | 'daily'

/** Deferred-research replies (script §6; restored by queue Q172): the request
 *  was accepted / is still being thought over. The "hour" in the text matches
 *  `RUMOUR_RESEARCH_DELAY_DAYS` (one game hour). */
export type RumourWaitPhase = 'start' | 'pending'

type LineSet = { adult: readonly string[], guard?: string, hunter?: string }

const SUCCESS: Record<RumourKind, LineSet> = {
  cave: {
    adult: [
      "I've heard there's a cave somewhere to the {bearing}, {travelTime} from here. I couldn't tell you just where.",
      "A cave, they say, out to the {bearing}. It's {travelTime} from here, give or take. You'll have some looking to do.",
    ],
    guard: 'There may be a cave to the {bearing}, {travelTime} from here. I can give you the direction, but not the entrance.',
    hunter: "Try the country to the {bearing}, {travelTime} from here. There's talk of a cave somewhere out that way.",
  },
  ruins: {
    adult: [
      "They say there are ruins to the {bearing}, {travelTime} from here. Whereabouts, I couldn't say.",
      "I've heard of ruins somewhere to the {bearing}, {travelTime} from here. I'd be curious to know what's left of them.",
    ],
    guard: "There are said to be ruins to the {bearing}, {travelTime} from here. That's as close as I can place them.",
    hunter: "Look out to the {bearing}, {travelTime} from here. You may find ruins in that country; I can't narrow it down further.",
  },
  lake: {
    adult: [
      "I've heard there's a lake to the {bearing}, {travelTime} from here. Somewhere in that part of the country.",
      "A lake, somewhere to the {bearing}—that's what I've heard. It's {travelTime} from here. I wish I had better directions for you.",
    ],
    guard: 'There is said to be a lake to the {bearing}, {travelTime} from here. I can point you towards the area, no closer.',
    hunter: "There's talk of a lake out to the {bearing}, {travelTime} from here. You'll have to find the shore yourself.",
  },
  mountainPeak: {
    adult: [
      "They speak of a mountain peak to the {bearing}, {travelTime} from here. I couldn't pick it out for you.",
      "I've heard of a peak somewhere to the {bearing}, {travelTime} from here. The tale is rather clearer than the directions.",
    ],
    guard: 'A mountain peak is said to lie to the {bearing}, {travelTime} from here. I can give you the area, not the way up.',
    hunter: "There's said to be a peak out to the {bearing}, {travelTime} from here. That's where I'd begin looking.",
  },
  cemetery: {
    adult: [
      "I've heard of a burial ground to the {bearing}, {travelTime} from here. I don't know the exact spot.",
      "There may be a burial ground somewhere to the {bearing}, {travelTime} from here. That's all I can tell you of it.",
    ],
    guard: 'A burial ground is said to lie to the {bearing}, {travelTime} from here. I can only point you towards that part of the country.',
    hunter: "Try looking to the {bearing}, {travelTime} from here. I've heard there's a burial ground somewhere out that way.",
  },
}

const OUTCOME: Record<RumourOutcome, LineSet> = {
  trust: {
    adult: ["I'd rather keep what I know to myself for now.", "Forgive me, but I'm not ready to share that with you."],
    guard: "I'll keep my counsel on that for now.",
    hunter: "I don't give directions to just anyone. Nothing more to say for now.",
  },
  cap: {
    adult: [
      "You've still got places to look for. See what you make of those first.",
      "One tale at a time. You'll wear out your boots chasing them all.",
    ],
    guard: "Follow up the places you've heard of first. You've enough to be going on with.",
    hunter: "Find one of the places you're already looking for. Another rumour can wait.",
  },
  none: {
    adult: ['Nothing comes to mind that would help you.', "I don't know of a place I could point you towards."],
    guard: "I've nothing useful to tell you about the country.",
    hunter: "I can't give you a lead. I'd only be guessing.",
  },
  daily: {
    adult: ["I've nothing else to tell you today.", "I could dress it up, but I've nothing new to tell you today."],
    guard: "Nothing new today. That's all I have for you.",
    hunter: "No fresh lead today. I can't add anything to what you know.",
  },
}

const WAIT: Record<RumourWaitPhase, LineSet> = {
  start: {
    adult: ['Let me think on it. Ask me again in an hour.'],
    guard: "Give me an hour to think it over. I'd rather not send you the wrong way.",
    hunter: "Let me think. There's little use in muddled directions. Ask me again in an hour.",
  },
  pending: {
    adult: ["I haven't an answer for you yet. Give me a little longer."],
    guard: 'Not yet. I still need a little time.',
    hunter: "I'm still thinking it over. Ask me a little later.",
  },
}

const BEARING_WORD: Record<CardinalSector, string> = {
  N: 'north',
  NE: 'north-east',
  E: 'east',
  SE: 'south-east',
  S: 'south',
  SW: 'south-west',
  W: 'west',
  NW: 'north-west',
}

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
]

/** Eight-sector bearing word for `{bearing}`, or `null` when origin and centre coincide. */
export function rumourBearing(dx: number, dz: number): string | null {
  const sector = cardinalSector(dx, dz)
  return sector ? BEARING_WORD[sector] : null
}

/** `{travelTime}` noun phrase from raw walking hours (draft convention, script §2). */
export function rumourTravelTime(hours: number): string {
  if (hours < 1) return "less than an hour's walk"
  const rounded = Math.round(hours)
  if (rounded <= 1) return "about an hour's walk"
  return `about ${NUMBER_WORDS[rounded] ?? String(rounded)} hours' walk`
}

function pick(set: LineSet, speaker: RumourSpeaker, variantSeed: number): string {
  const specialist = speaker === 'guard' ? set.guard : speaker === 'hunter' ? set.hunter : undefined
  return specialist ?? set.adult[(variantSeed >>> 0) % set.adult.length]!
}

/** One successful rumour line. `variantSeed` only picks among equivalent wordings. */
export function rumourSuccessLine(
  kind: RumourKind,
  speaker: RumourSpeaker,
  bearing: string,
  travelTime: string,
  variantSeed: number,
): string {
  return pick(SUCCESS[kind], speaker, variantSeed).replace('{bearing}', bearing).replace('{travelTime}', travelTime)
}

/** One reply that carries no new lead (trust gate, cap, empty pool, daily limit). */
export function rumourOutcomeLine(outcome: RumourOutcome, speaker: RumourSpeaker, variantSeed: number): string {
  return pick(OUTCOME[outcome], speaker, variantSeed)
}

/** "Let me think on it" (`start`) or "not yet" (`pending`) — never a lead. */
export function rumourWaitLine(phase: RumourWaitPhase, speaker: RumourSpeaker): string {
  return pick(WAIT[phase], speaker, 0)
}

export function isRumourKind(kind: WorldLocationKind): kind is RumourKind {
  return kind in SUCCESS
}
