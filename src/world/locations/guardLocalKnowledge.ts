import type { RumourSpeaker } from '../../ai/rumourLines'
import type { NpcId } from '../../settlement/npcState'
import type { LocationKnowledge } from './locationKnowledge'
import type { WorldLocation } from './worldLocationTypes'
import { isRumourKind, rumourBearing, rumourOutcomeLine, rumourSuccessLine, rumourTravelTime } from '../../ai/rumourLines'
import { MEDIUM_RANGE_HOURS, NEAR_RANGE_HOURS, worldUnitsToHours } from './locationConfig'
import { countOpenRumourLeads, RUMOUR_LEAD_CAP, rumourLeadAreaForEntry } from './rumourLead'

/** Settlement `trust` below this refuses a rumour (🟡 proposal, plan world-041 L0 §2; neutral = 0). */
export const RUMOUR_TRUST_MIN = -10
/** Candidate band in walking hours (L0 §5): everyone `(NEAR, MEDIUM]`; guards/hunters reach farther. */
export const RUMOUR_BAND_MIN_HOURS = NEAR_RANGE_HOURS
export const RUMOUR_BAND_MAX_HOURS = MEDIUM_RANGE_HOURS
export const RUMOUR_EXPERT_BAND_MAX_HOURS = 25
/** Legacy (pre-Q138) wait line — still returned when an old armed follow-up cannot be delivered. */
export const GUARD_AREA_RESEARCH_PENDING =
  'Wciąż przeglądam meldunki i szlaki. Wróć trochę później.'

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

/** Per-npc keyed save shape (plan npc-050 §10). Since Q138 nothing writes it
 *  any more (rumours are answered instantly); an old save's entries are read
 *  for compatibility and dropped on restore. */
export type SaveGuardLocalKnowledgeByNpc = Record<NpcId, SaveGuardLocalKnowledge>

/**
 * Rumour producer (plan world-041 L3b, queue Q138): "an NPC tells the player
 * about a place". Every NPC only ever gives an `estimated` rumour lead (never
 * an exact pin or a name); guards and hunters give a smaller area (`expert`
 * tier, persisted on the entry) and reach farther. Owns no persisted state —
 * the daily limit is derived (`(seed, npc, day)`), the cap is derived from
 * `LocationKnowledge`.
 *
 * @domain world-locations
 */
export type GuardLocalKnowledge = {
  /** `trust` = the asking NPC's settlement trust dimension toward the player. */
  askAboutArea(npcId: NpcId, originX: number, originZ: number, speaker: RumourSpeaker, trust: number): Promise<string>
  /** Accepts (and drops) pre-Q138 research state. */
  restore(saved: SaveGuardLocalKnowledgeByNpc | undefined): void
  serialize(): SaveGuardLocalKnowledgeByNpc | undefined
  reset(): void
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

/**
 * @domain world-locations
 */
export function createGuardLocalKnowledge(deps: GuardLocalKnowledgeDeps): GuardLocalKnowledge {
  return {
    async askAboutArea(npcId, originX, originZ, speaker, trust) {
      const seed = deps.getWorldSeed()
      const day = Math.floor(deps.getElapsedDays())
      const variant = hashSeed(seed, [npcId, day, 'variant'])
      const expert = speaker !== 'adult'
      if (trust < RUMOUR_TRUST_MIN) return rumourOutcomeLine('trust', speaker, variant)

      const homeId = deps.homeLocationId()
      const found = await deps.landmarksInRange(
        originX,
        originZ,
        RUMOUR_BAND_MIN_HOURS,
        expert ? RUMOUR_EXPERT_BAND_MAX_HOURS : RUMOUR_BAND_MAX_HOURS,
      )
      // Ordering ignores knowledge state, so asking again / reloading the same
      // day yields the same top candidate and cannot farm extra leads.
      const pool = found
        .filter((location) => isRumourKind(location.kind) && location.id !== homeId)
        .map((location) => ({ location, rank: hashSeed(seed, [npcId, day, location.id]) }))
        .sort((a, b) => a.rank - b.rank || a.location.id.localeCompare(b.location.id))
      const top = pool[0]?.location
      if (!top || !isRumourKind(top.kind)) return rumourOutcomeLine('none', speaker, variant)
      if (deps.locationKnowledge.has(top.id)) return rumourOutcomeLine('daily', speaker, variant)
      if (countOpenRumourLeads(deps.locationKnowledge, { getById: deps.getLocation }) >= RUMOUR_LEAD_CAP) {
        return rumourOutcomeLine('cap', speaker, variant)
      }

      const leadTier = expert ? 'expert' : undefined
      // Same projection the map uses (`mapData.project`), so speech never
      // reveals more than the marker does.
      const area = rumourLeadAreaForEntry(seed, { id: top.id, leadTier }, top)
      const bearing = rumourBearing(area.x - originX, area.z - originZ)
      if (!bearing) return rumourOutcomeLine('none', speaker, variant)
      const hours = worldUnitsToHours(Math.hypot(area.x - originX, area.z - originZ))
      deps.locationKnowledge.reveal(top.id, 'estimated', 'npc', leadTier)
      return rumourSuccessLine(top.kind, speaker, bearing, rumourTravelTime(hours), variant)
    },
    restore() {},
    serialize() {
      return undefined
    },
    reset() {},
    invalidate() {},
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
