import type { RumourSpeaker } from '../../ai/rumourLines'
import type { NpcId } from '../../settlement/npcState'
import type { LocationKnowledge } from './locationKnowledge'
import type { WorldLocation } from './worldLocationTypes'
import {
  isRumourKind,
  rumourBearing,
  rumourOutcomeLine,
  rumourSuccessLine,
  rumourTravelTime,
  rumourWaitLine,
} from '../../ai/rumourLines'
import { WORLD_KNOWLEDGE_HOUR_DAYS } from '../../quests/quests'
import { MEDIUM_RANGE_HOURS, NEAR_RANGE_HOURS, worldUnitsToHours } from './locationConfig'
import { countOpenRumourLeads, RUMOUR_LEAD_CAP, rumourLeadAreaForEntry } from './rumourLead'

/** Settlement `trust` below this refuses a rumour (🟡 proposal, plan world-041 L0 §2; neutral = 0). */
export const RUMOUR_TRUST_MIN = -10
/** Candidate band in walking hours (L0 §5): everyone `(NEAR, MEDIUM]`; guards/hunters reach farther. */
export const RUMOUR_BAND_MIN_HOURS = NEAR_RANGE_HOURS
export const RUMOUR_BAND_MAX_HOURS = MEDIUM_RANGE_HOURS
export const RUMOUR_EXPERT_BAND_MAX_HOURS = 25
/** Game-time wait between "let me think on it" and the answer (plan 047,
 *  restored by queue Q172 — author Q172-a (a)). The approved wait lines say
 *  "an hour", so this must stay one game hour. */
export const RUMOUR_RESEARCH_DELAY_DAYS = WORLD_KNOWLEDGE_HOUR_DAYS

export type SaveGuardLocalKnowledge =
  | {
      status: 'requested'
      requestedAtDays: number
      revealAtDays: number
      originX: number
      originZ: number
    }
  | {
      status: 'resolved'
      requestedAtDays: number
      revealAtDays: number
      originX: number
      originZ: number
      selectedIds: string[]
    }

/** Per-npc keyed save shape (plan npc-050 §10): one pending rumour request
 *  per asking NPC. `resolved.selectedIds` holds at most the one candidate the
 *  background research picked; it is a session cache — restore turns it back
 *  into `requested` so the pick is always recomputed by current code. */
export type SaveGuardLocalKnowledgeByNpc = Record<NpcId, SaveGuardLocalKnowledge>

/**
 * Rumour producer (plan world-041 L3b, queue Q138; deferred again by Q172):
 * "an NPC tells the player about a place". The first ask answers at once with
 * "let me think on it" and starts the candidate-pool research in the
 * background (cooperative `landmarksInRangeAsync` — a cold 25 h band costs
 * seconds of worldgen); asking again once `RUMOUR_RESEARCH_DELAY_DAYS` of game
 * time has passed delivers the result, re-checked at delivery (trust, cap,
 * already known). Every NPC only ever gives an `estimated` rumour lead (never
 * an exact pin or a name); guards and hunters give a smaller area (`expert`
 * tier, persisted on the entry) and reach farther. Owns only the per-NPC
 * pending request; the daily pick is derived from `(seed, npc, request day)`.
 *
 * @domain world-locations
 */
export type GuardLocalKnowledge = {
  /** `trust` = the asking NPC's settlement trust dimension toward the player. */
  askAboutArea(npcId: NpcId, originX: number, originZ: number, speaker: RumourSpeaker, trust: number): Promise<string>
  restore(saved: SaveGuardLocalKnowledgeByNpc | undefined): void
  serialize(): SaveGuardLocalKnowledgeByNpc | undefined
  /** New world: drop every pending request. */
  reset(): void
  /** Same world rebuilt (terrain params): keep requests, recompute their picks. */
  invalidate(): void
}

export type GuardLocalKnowledgeDeps = {
  getElapsedDays: () => number
  getWorldSeed: () => number
  locationKnowledge: LocationKnowledge
  getLocation: (id: string) => WorldLocation | null
  /** Catalog candidates in the walking-hour band `(minHours, maxHours]` of the origin. */
  landmarksInRange: (originX: number, originZ: number, minHours: number, maxHours: number) => Promise<readonly WorldLocation[]>
  homeLocationId: () => string | null
}

function hashSeed(seed: number, parts: readonly (string | number)[]): number {
  let h = (seed >>> 0) ^ 0x72756d6f
  for (const part of parts) {
    const text = String(part)
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    h = Math.imul(h ^ 0xff, 16777619)
  }
  return h >>> 0
}

type PendingRequest = Extract<SaveGuardLocalKnowledge, { status: 'requested' }>

/**
 * @domain world-locations
 */
export function createGuardLocalKnowledge(deps: GuardLocalKnowledgeDeps): GuardLocalKnowledge {
  const byNpc = new Map<NpcId, SaveGuardLocalKnowledge>()
  /** In-flight research per NPC (session only), tagged with the epoch it started in. */
  const research = new Map<NpcId, { epoch: number, promise: Promise<string | null> }>()
  /** Day each NPC last delivered an answer (session only): a same-day re-ask
   *  answers directly (the pool is warm by then) instead of a second wait. */
  const answeredDay = new Map<NpcId, number>()
  let epoch = 0

  const bandMax = (speaker: RumourSpeaker): number => speaker === 'adult' ? RUMOUR_BAND_MAX_HOURS : RUMOUR_EXPERT_BAND_MAX_HOURS

  /** Today's top candidate for this NPC, or `null`. Ordering ignores knowledge
   *  state, so asking again / reloading the same day yields the same candidate
   *  and cannot farm extra leads. */
  const pickCandidate = async (npcId: NpcId, originX: number, originZ: number, speaker: RumourSpeaker, day: number): Promise<string | null> => {
    const seed = deps.getWorldSeed()
    const homeId = deps.homeLocationId()
    const found = await deps.landmarksInRange(originX, originZ, RUMOUR_BAND_MIN_HOURS, bandMax(speaker))
    const pool = found
      .filter((location) => isRumourKind(location.kind) && location.id !== homeId)
      .map((location) => ({ id: location.id, rank: hashSeed(seed, [npcId, day, location.id]) }))
      .sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id))
    return pool[0]?.id ?? null
  }

  /** Starts (once per NPC and epoch) the background pool research of a pending request. */
  const launch = (npcId: NpcId, request: SaveGuardLocalKnowledge, speaker: RumourSpeaker): Promise<string | null> => {
    const running = research.get(npcId)
    if (running && running.epoch === epoch) return running.promise
    const startedEpoch = epoch
    const promise = pickCandidate(npcId, request.originX, request.originZ, speaker, Math.floor(request.requestedAtDays))
    research.set(npcId, { epoch: startedEpoch, promise })
    promise.then(
      (topId) => {
        if (startedEpoch !== epoch || research.get(npcId)?.promise !== promise) return
        const current = byNpc.get(npcId)
        if (!current || current.requestedAtDays !== request.requestedAtDays) return
        byNpc.set(npcId, { ...current, status: 'resolved', selectedIds: topId ? [topId] : [] })
      },
      () => {
        // A failed query is not a diegetic "nothing found": drop it so the
        // next ask retries the research.
        if (research.get(npcId)?.promise === promise) research.delete(npcId)
      },
    )
    return promise
  }

  /** The answer for one candidate, re-validated now (cap, already known, stale id). */
  const answer = (npcId: NpcId, topId: string | null, originX: number, originZ: number, speaker: RumourSpeaker): string => {
    const seed = deps.getWorldSeed()
    const variant = hashSeed(seed, [npcId, Math.floor(deps.getElapsedDays()), 'variant'])
    const top = topId ? deps.getLocation(topId) : null
    if (!top || !isRumourKind(top.kind)) return rumourOutcomeLine('none', speaker, variant)
    if (deps.locationKnowledge.has(top.id)) return rumourOutcomeLine('daily', speaker, variant)
    if (countOpenRumourLeads(deps.locationKnowledge, { getById: deps.getLocation }) >= RUMOUR_LEAD_CAP) {
      return rumourOutcomeLine('cap', speaker, variant)
    }
    const leadTier = speaker === 'adult' ? undefined : 'expert'
    // Same projection the map uses (`mapData.project`), so speech never
    // reveals more than the marker does. Bearing/hours are from where the
    // player stands when the NPC actually answers.
    const area = rumourLeadAreaForEntry(seed, { id: top.id, leadTier }, top)
    const bearing = rumourBearing(area.x - originX, area.z - originZ)
    if (!bearing) return rumourOutcomeLine('none', speaker, variant)
    const hours = worldUnitsToHours(Math.hypot(area.x - originX, area.z - originZ))
    deps.locationKnowledge.reveal(top.id, 'estimated', 'npc', leadTier)
    return rumourSuccessLine(top.kind, speaker, bearing, rumourTravelTime(hours), variant)
  }

  return {
    async askAboutArea(npcId, originX, originZ, speaker, trust) {
      const now = deps.getElapsedDays()
      const today = Math.floor(now)
      const variant = hashSeed(deps.getWorldSeed(), [npcId, today, 'variant'])
      if (trust < RUMOUR_TRUST_MIN) return rumourOutcomeLine('trust', speaker, variant)

      const pending = byNpc.get(npcId)
      if (pending) {
        if (now < pending.revealAtDays) {
          void launch(npcId, pending, speaker)
          return rumourWaitLine('pending', speaker)
        }
        // Delay elapsed: deliver. Normally the research finished long ago;
        // after a reload it is recomputed here (cooperative, option disabled
        // in the dialogue meanwhile).
        let topId: string | null
        if (pending.status === 'resolved') {
          topId = pending.selectedIds[0] ?? null
        } else {
          const startedEpoch = epoch
          topId = await launch(npcId, pending, speaker)
          // World rebuilt mid-research: that pick belongs to the old terrain.
          if (startedEpoch !== epoch) topId = await launch(npcId, pending, speaker)
        }
        const current = byNpc.get(npcId)
        if (!current || current.requestedAtDays !== pending.requestedAtDays) {
          // Reset (new world) while waiting — nothing from the old world is delivered.
          return rumourOutcomeLine('none', speaker, variant)
        }
        byNpc.delete(npcId)
        research.delete(npcId)
        answeredDay.set(npcId, today)
        return answer(npcId, topId, originX, originZ, speaker)
      }

      if (answeredDay.get(npcId) === today) {
        return answer(npcId, await pickCandidate(npcId, originX, originZ, speaker, today), originX, originZ, speaker)
      }
      // Nothing to think over while the player still has every slot full.
      if (countOpenRumourLeads(deps.locationKnowledge, { getById: deps.getLocation }) >= RUMOUR_LEAD_CAP) {
        return rumourOutcomeLine('cap', speaker, variant)
      }
      const request: PendingRequest = {
        status: 'requested',
        requestedAtDays: now,
        revealAtDays: now + RUMOUR_RESEARCH_DELAY_DAYS,
        originX,
        originZ,
      }
      byNpc.set(npcId, request)
      void launch(npcId, request, speaker)
      return rumourWaitLine('start', speaker)
    },
    restore(saved) {
      epoch += 1
      byNpc.clear()
      research.clear()
      answeredDay.clear()
      if (!saved) return
      for (const [npcId, entry] of Object.entries(saved)) {
        const { requestedAtDays, revealAtDays, originX, originZ } = entry
        byNpc.set(npcId, { status: 'requested', requestedAtDays, revealAtDays, originX, originZ })
      }
    },
    serialize() {
      if (byNpc.size === 0) return undefined
      const out: SaveGuardLocalKnowledgeByNpc = {}
      for (const [npcId, entry] of byNpc) out[npcId] = entry.status === 'resolved' ? { ...entry, selectedIds: [...entry.selectedIds] } : { ...entry }
      return out
    },
    reset() {
      epoch += 1
      byNpc.clear()
      research.clear()
      answeredDay.clear()
    },
    invalidate() {
      epoch += 1
      research.clear()
      answeredDay.clear()
      for (const [npcId, entry] of byNpc) {
        const { requestedAtDays, revealAtDays, originX, originZ } = entry
        byNpc.set(npcId, { status: 'requested', requestedAtDays, revealAtDays, originX, originZ })
      }
    },
  }
}

/** Also the legacy pre-npc-050 shape — one anonymous (home-guard-only)
 *  record, not yet keyed by NPC. `createApp.ts` recognises this shape at
 *  restore time and migrates it onto the stable home-guard id. */
export function isSaveGuardLocalKnowledge(value: unknown): value is SaveGuardLocalKnowledge {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const entry = value as Record<string, unknown>
  if (typeof entry.requestedAtDays !== 'number' || !Number.isFinite(entry.requestedAtDays)) return false
  if (typeof entry.revealAtDays !== 'number' || !Number.isFinite(entry.revealAtDays)) return false
  if (typeof entry.originX !== 'number' || !Number.isFinite(entry.originX)) return false
  if (typeof entry.originZ !== 'number' || !Number.isFinite(entry.originZ)) return false
  if (entry.status === 'requested') return true
  if (entry.status !== 'resolved') return false
  return Array.isArray(entry.selectedIds) && entry.selectedIds.every((id) => typeof id === 'string')
}

export function isSaveGuardLocalKnowledgeByNpc(value: unknown): value is SaveGuardLocalKnowledgeByNpc {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.values(value as Record<string, unknown>).every(isSaveGuardLocalKnowledge)
}

/**
 * Normalizes a loaded `SaveMap.guardLocalKnowledge` field onto the current
 * per-npc shape (plan npc-050 §10). A legacy pre-npc-050 save carries one
 * anonymous (home-guard-only) record — attributed onto the stable
 * `homeGuardNpcId` without losing an already-started delay or selected ids.
 * When no home guard can be resolved (e.g. no living home guard this save),
 * the legacy record has no owner to attach to and is dropped rather than
 * guessed.
 *
 * @domain world-locations
 */
export function normalizeSaveGuardLocalKnowledge(
  saved: SaveGuardLocalKnowledge | SaveGuardLocalKnowledgeByNpc | undefined,
  homeGuardNpcId: NpcId | undefined,
): SaveGuardLocalKnowledgeByNpc | undefined {
  if (!saved) return undefined
  if (isSaveGuardLocalKnowledge(saved)) {
    return homeGuardNpcId ? { [homeGuardNpcId]: saved } : undefined
  }
  return saved
}
