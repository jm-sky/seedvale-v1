import type { LocationKnowledge, LocationKnowledgeEntry } from './locationKnowledge'
import type { WorldLocationCatalog } from './worldLocationCatalog'
import type { WorldLocationKind } from './worldLocationTypes'
import { MAP_EXTENT_HALF } from '../map/mapConfig'
import { createSeededRandom } from '../parseSeed'

/**
 * Rumour leads (plan world-041 L0 §0/§2) — the uncertain-knowledge side of
 * `LocationKnowledge`. A lead is exactly one persisted entry
 * `{ state: 'estimated', source: 'npc' }`; its coarse search area is NEVER
 * persisted, it is reconstructed here as a pure function of
 * `(world seed, location id, canonical target)`.
 *
 * Only `world/map/mapData.ts` `project()` may turn an `estimated` entry into
 * player-facing geometry/labels. Every other consumer must treat `estimated`
 * as "not known" (see {@link isLocationDiscovered}).
 *
 * @domain world-locations
 */

/** Maximum concurrently open rumour leads (G7 "3–4"). */
export const RUMOUR_LEAD_CAP = 4

/** Lead circle radius range, world units (L0 §0, V2 `rumourCircle`). */
export const RUMOUR_LEAD_RADIUS_MIN = 120
export const RUMOUR_LEAD_RADIUS_MAX = 260
/** Centre offset as a fraction of the radius — always < 1 so the target stays inside. */
export const RUMOUR_LEAD_OFFSET_MIN_FRAC = 0.15
export const RUMOUR_LEAD_OFFSET_MAX_FRAC = 0.6
/** After world-bound clipping the target must stay at most this fraction of r from the centre. */
const MAX_CLIPPED_OFFSET_FRAC = 0.9

/** Guard/hunter ("expert") leads: smaller circle (author Q135 (b) / Q136-a (c)). */
export const RUMOUR_LEAD_EXPERT_RADIUS_MIN = 60
export const RUMOUR_LEAD_EXPERT_RADIUS_MAX = 120

export type RumourLeadTier = 'common' | 'expert'

export type RumourLeadArea = { x: number, z: number, radius: number }

export type RumourLeadAreaOptions = {
  radiusMin?: number
  radiusMax?: number
  /** Half-extent of the (square, origin-centred) world the circle must stay inside. */
  worldHalfExtent?: number
}

function hashLead(seed: number, locationId: string): number {
  let h = ((seed >>> 0) ^ 0x6c656164) >>> 0
  for (let i = 0; i < locationId.length; i++) {
    h ^= locationId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Deterministic off-centre search circle that always contains `target`.
 * Radius `[min,max]`, centre offset `[0.15,0.6]·r` at a hashed angle. When the
 * circle would cross the world bound the centre is clamped inward and, if that
 * pushed the target out of reach, pulled back toward the target so it stays
 * inside — containment always wins, so a target hugging the bound (edge: within
 * 0.1·r; corner: within ~0.4·r) can leave the circle grazing the bound.
 */
export function rumourLeadArea(
  seed: number,
  locationId: string,
  target: { x: number, z: number },
  options: RumourLeadAreaOptions = {},
): RumourLeadArea {
  const {
    radiusMin = RUMOUR_LEAD_RADIUS_MIN,
    radiusMax = RUMOUR_LEAD_RADIUS_MAX,
    worldHalfExtent = MAP_EXTENT_HALF,
  } = options
  const rng = createSeededRandom(hashLead(seed, locationId))
  const radius = radiusMin + rng() * (radiusMax - radiusMin)
  const offset = radius * (RUMOUR_LEAD_OFFSET_MIN_FRAC + rng() * (RUMOUR_LEAD_OFFSET_MAX_FRAC - RUMOUR_LEAD_OFFSET_MIN_FRAC))
  const angle = rng() * Math.PI * 2
  let x = target.x + Math.cos(angle) * offset
  let z = target.z + Math.sin(angle) * offset
  const limit = worldHalfExtent - radius
  if (limit > 0) {
    x = Math.max(-limit, Math.min(limit, x))
    z = Math.max(-limit, Math.min(limit, z))
  }
  const dx = x - target.x
  const dz = z - target.z
  const dist = Math.hypot(dx, dz)
  const maxDist = radius * MAX_CLIPPED_OFFSET_FRAC
  if (dist > maxDist) {
    x = target.x + (dx / dist) * maxDist
    z = target.z + (dz / dist) * maxDist
  }
  return { x, z, radius }
}

/**
 * The one lead-area calculation for a stored entry: `project()` (map labels)
 * and the spoken bearing/hours (`ai/rumourLines`) both go through it, so
 * speech never reveals more than the map. Absent tier = common.
 */
export function rumourLeadAreaForEntry(
  seed: number,
  entry: Pick<LocationKnowledgeEntry, 'id' | 'leadTier'>,
  target: { x: number, z: number },
): RumourLeadArea {
  return rumourLeadArea(seed, entry.id, target, entry.leadTier === 'expert'
    ? { radiusMin: RUMOUR_LEAD_EXPERT_RADIUS_MIN, radiusMax: RUMOUR_LEAD_EXPERT_RADIUS_MAX }
    : {})
}

const GENERIC_KIND_LABEL: Record<WorldLocationKind, string> = {
  settlement: 'Osada',
  cave: 'Jaskinia',
  cemetery: 'Cmentarz',
  lake: 'Jezioro',
  mountainPeak: 'Szczyt',
  ruins: 'Ruiny',
  abandonedMine: 'Opuszczona kopalnia',
  searchArea: 'Rejon poszukiwań',
}

/** Name-free label for an `estimated` entry. */
export function genericLocationLabel(kind: WorldLocationKind): string {
  return GENERIC_KIND_LABEL[kind]
}

/** True for an `estimated`+`npc` entry (a rumour lead). Quest search areas are revealed `discovered`, never counted. */
export function isRumourLeadEntry(entry: LocationKnowledgeEntry): boolean {
  return entry.state === 'estimated' && entry.source === 'npc'
}

/**
 * Whether the player knows `id` beyond a rumour: an `estimated` entry is "not
 * known" (no name, no exact use) for guards, quests and reputation lists.
 */
export function isLocationDiscovered(knowledge: Pick<LocationKnowledge, 'get'>, id: string): boolean {
  const entry = knowledge.get(id)
  return entry != null && entry.state !== 'estimated'
}

/**
 * Open leads = `estimated`+`npc` entries whose id still resolves in the
 * catalog. Derived, never stored: a stale target drops out automatically, so
 * the cap cannot stay full forever; duplicate rumours for one id are one entry.
 */
export function countOpenRumourLeads(
  knowledge: Pick<LocationKnowledge, 'list'>,
  catalog: Pick<WorldLocationCatalog, 'getById'>,
): number {
  let count = 0
  for (const entry of knowledge.list()) {
    if (isRumourLeadEntry(entry) && catalog.getById(entry.id) != null) count++
  }
  return count
}
