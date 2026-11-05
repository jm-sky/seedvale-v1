import type { WorldBundle } from '../app/worldBundle'
import type { AnimalAgent } from '../fauna/AnimalAgent'
import { isDebugMode } from './debugMode'

/**
 * Frenzied-wolf runtime diagnostics registry (fauna debug tooling — see
 * `AnimalAgent.showDebug()`/`getDebugInfo()`). Mirrors `npcInspector.ts`'s
 * "never cache a live reference across calls" contract: only a bare
 * `animalId` is remembered as the selection cursor, re-resolved against
 * `bundle.fauna.getAgents()` on every call — `Fauna` stays the sole owner of
 * `AnimalAgent` instances, this module never keeps its own list. A wolf
 * dying, despawning or a world rebuild naturally invalidates the selection
 * instead of leaving a stale `AnimalAgent` reference behind.
 */

let selectedAnimalId: string | null = null

/** `[NPC COMBAT]` diagnostic line for one predator's NPC-threat decision
 *  branch (`AnimalAgent.update()`'s `npc-attack`/`npc-attack-frenzied`/
 *  `npc-flee`/`npc-ignore` cases, plan fauna-017 step 8, review P1) — the
 *  single home for what were four near-identical inline `console.log`
 *  blocks. Only ever called behind `isNpcCombatDebugMode()`. `npcThreat`'s
 *  `homeId` (not `id` twice — the bug this consolidation fixes) is what the
 *  dog-guard tier keys on. */
export function logNpcThreatBranch(opts: {
  label: string
  animalId: string
  kind: string
  frenzied: boolean
  npcThreat: { id: string, homeId?: string }
  playerActive: boolean
}): void {
  console.log(
    `[NPC COMBAT] ${opts.label}`,
    `wolf=${opts.animalId}/${opts.kind}`,
    `frenzy=${opts.frenzied}`,
    `npcThreat=${opts.npcThreat.id}/${opts.npcThreat.homeId}`,
    `playerActive=${opts.playerActive}`,
  )
}

export type FrenzyWolfCandidate = { animalId: string, frenzied: boolean, dead: boolean }

/** Pure selection-cycling rule behind `getNextFrenzyWolf()` — unit-testable
 *  without a real `WorldBundle`/`AnimalAgent`. Filters to live frenzied
 *  wolves (`wolves`' own order), then advances cyclically from `currentId`
 *  — picking the first eligible wolf when `currentId` is `null` or no longer
 *  eligible — wrapping back to the start past the end. `null` when no
 *  eligible wolf exists. */
export function pickNextFrenzyWolfId(
  wolves: readonly FrenzyWolfCandidate[],
  currentId: string | null,
): string | null {
  const eligible = wolves.filter((w) => w.frenzied && !w.dead)
  if (eligible.length === 0) return null
  const currentIndex = currentId ? eligible.findIndex((w) => w.animalId === currentId) : -1
  return eligible[(currentIndex + 1) % eligible.length]!.animalId
}

function findAgentById(bundle: WorldBundle, id: string): AnimalAgent | undefined {
  return bundle.fauna.getAgents().find((a) => a.animalId === id)
}

/** Live, frenzied, non-dead wolves — `Fauna.getAgents()`'s own stable
 *  iteration order, never scanned independently of `Fauna`'s ownership. */
export function getFrenzyWolves(bundle: WorldBundle): AnimalAgent[] {
  return bundle.fauna.getAgents().filter((a) => a.def.kind === 'wolf' && a.isFrenzied() && !a.isDead())
}

/** Currently selected wolf, or `null` if nothing is selected or the
 *  selection is no longer a live frenzied wolf (dead, cured, or despawned
 *  since it was picked). */
export function getCurrentFrenzyWolf(bundle: WorldBundle): AnimalAgent | null {
  if (!selectedAnimalId) return null
  const found = getFrenzyWolves(bundle).find((w) => w.animalId === selectedAnimalId)
  if (!found) selectedAnimalId = null
  return found ?? null
}

/** Cycles the selection to the next live frenzied wolf (`getFrenzyWolves()`'s
 *  order), clearing the previous selection's highlight and setting the new
 *  one's — reuses `AnimalAgent.setHighlighted()`, no parallel highlight
 *  state. Wraps back to the first wolf past the end; returns (and selects)
 *  `null` when no frenzied wolf is currently loaded. */
export function getNextFrenzyWolf(bundle: WorldBundle): AnimalAgent | null {
  const wolves = getFrenzyWolves(bundle)
  const previous = selectedAnimalId ? findAgentById(bundle, selectedAnimalId) : undefined
  const nextId = pickNextFrenzyWolfId(
    wolves.map((w) => ({ animalId: w.animalId, frenzied: w.isFrenzied(), dead: w.isDead() })),
    selectedAnimalId,
  )
  if (!nextId) {
    previous?.setHighlighted(false)
    selectedAnimalId = null
    return null
  }
  const next = wolves.find((w) => w.animalId === nextId) ?? null
  if (previous && previous !== next) previous.setHighlighted(false)
  next?.setHighlighted(true)
  selectedAnimalId = nextId
  return next
}

/** One animal water-traversal transition (plan Q99 drowning diagnostics) —
 *  recorded by `AnimalAgent` only while `isFaunaWaterLogEnabled()`. `enter`
 *  = dry/wading → swimming, `exhausted` = first drowning-damage tick of a
 *  swim, `exit` = swimming → dry/wading, `drowned` = death from drowning. */
export type FaunaWaterEventType = 'enter' | 'exhausted' | 'exit' | 'drowned'

export type FaunaWaterEvent = {
  type: FaunaWaterEventType
  /** `performance.now()` seconds. */
  t: number
  animalId: string
  kind: string
  /** `AnimalAgent.debugBranch` at the event tick. */
  branch: string
  intent: string | null
  /** Which `NavRescue` steered last (`move`/`chase`/`flee`/`none`). */
  nav: string
  sprinting: boolean
  staminaRatio: number
  hp: number
  depth: number
  x: number
  z: number
  /** Water-exit recovery target while active (`exhausted`/`drowned`). */
  recovery: { x: number, z: number } | null
  lastStepDistance: number
  /** `drowned`/`exhausted` only: ground height minus the animal's ground
   *  height at 2/4/8 m in 8 compass directions (N, NE, E, … NW). */
  ring: number[] | null
}

const FAUNA_WATER_LOG_CAP = 2000
const faunaWaterLog: FaunaWaterEvent[] = []
let faunaWaterLogEnabled: boolean | null = null

/** `?debug` gate for the fauna water log, resolved once per page — the
 *  recording call sites in `AnimalAgent` check this before building an
 *  event, so the log costs nothing outside debug sessions. */
export function isFaunaWaterLogEnabled(): boolean {
  if (faunaWaterLogEnabled === null) {
    faunaWaterLogEnabled = typeof window !== 'undefined' && isDebugMode()
  }
  return faunaWaterLogEnabled
}

/** Appends one event to the bounded ring (oldest dropped past the cap). */
export function recordFaunaWaterEvent(event: FaunaWaterEvent): void {
  if (faunaWaterLog.length >= FAUNA_WATER_LOG_CAP) faunaWaterLog.shift()
  faunaWaterLog.push(event)
}

/** Copy of the recorded fauna water events, oldest first. */
export function getFaunaWaterLog(): FaunaWaterEvent[] {
  return faunaWaterLog.slice()
}

export function clearFaunaWaterLog(): void {
  faunaWaterLog.length = 0
}
