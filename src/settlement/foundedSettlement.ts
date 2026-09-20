import { Vector3 } from 'three'
import type { NpcId } from './npcState'
import type { Place } from './places'

/**
 * Manager-lifetime record of a colony bootstrapped from an arrived
 * expedition (plan settlements-003) — the persisted "this nonprocedural
 * settlement exists" fact. Deliberately narrow: economy, households, NPC
 * state, tents and site infrastructure stay owned by their existing
 * registries (`EconomyRegistry`, `HouseholdRegistry`, `NpcStateRegistry`,
 * `PlacedTents`, `siteInfrastructure.ts`) and are never duplicated here.
 *
 * @domain settlements
 */
export type FoundedSettlementRecord = {
  readonly id: string
  readonly siteId: string
  readonly x: number
  readonly z: number
  readonly sponsorSettlementId: string
  readonly residentNpcIds: readonly NpcId[]
  readonly foundedAtDays: number
}

/**
 * Deterministic founded-settlement id from a stable site identity — a
 * namespaced id, never a random/timestamp one, so bootstrap stays idempotent
 * by construction. A `siteId` that ever resolved to a different existing
 * record is a contract error, not a reason to mint a new id.
 *
 * @domain settlements
 */
export function foundedSettlementId(siteId: string): string {
  return `settlement:founded:${siteId}`
}

/** Deterministic one-founder-per-household id (plan settlements-003 §"Households"). */
export function foundedHouseholdId(settlementId: string, npcId: NpcId): string {
  return `${settlementId}:household:founder:${npcId}`
}

/** Deterministic physical-tent id for one founder's home (plan settlements-003 §"Tents"). */
export function foundedTentId(settlementId: string, npcId: NpcId): string {
  return `${settlementId}:tent:${npcId}`
}

/**
 * Stable semantic founded-home `Place.id` for one founder (plan
 * settlements-020) — distinct from both the procedural `homePlaceId`
 * namespace and the physical `foundedTentId` namespace, so
 * `homeIndexFromPlaceId()` never mistakes a founded home for a procedural
 * house index. `Household.homeId` for a founded household must use this id,
 * never the raw tent id, so a later physical-shelter change
 * (settlements-005) can happen without changing household identity.
 *
 * @domain settlements
 */
export function foundedHomePlaceId(settlementId: string, npcId: NpcId): string {
  return `${settlementId}:home:founder:${npcId}`
}

/** Minimal physical-tent lookup `resolveFoundedHomePlace` needs — narrower
 *  than `FoundedSettlementTentsDeps` (owned by `foundedSettlementBootstrap.ts`)
 *  to avoid a module cycle; any real tents-deps object already satisfies this
 *  structurally. */
export type FoundedHomeTentLookup = {
  get: (id: string) => { x: number, z: number } | null
}

/**
 * Narrow semantic-home -> physical-tent resolver (plan settlements-020) —
 * `settlements-021`/`settlements-022` should reuse this instead of
 * reinterpreting a physical tent id as household identity. Returns `null`
 * when `npcId` isn't a resident of `record`, or its stable founded tent
 * doesn't currently exist. Never caches the resolved position back onto
 * `record`/`Household` — coordinates always come from the live physical tent.
 *
 * @domain settlements
 */
export function resolveFoundedHomePlace(
  record: FoundedSettlementRecord,
  npcId: NpcId,
  placedTents: FoundedHomeTentLookup,
): Place | null {
  if (!record.residentNpcIds.includes(npcId)) return null
  const tent = placedTents.get(foundedTentId(record.id, npcId))
  if (!tent) return null
  return {
    id: foundedHomePlaceId(record.id, npcId),
    type: 'home',
    position: new Vector3(tent.x, 0, tent.z),
  }
}

/** Plain-data carry/save snapshot — same `initial*`/`serialize()` idiom as
 *  `HouseholdRegistry`/`NpcStateRegistry`. `residency` is the explicit
 *  `NpcId -> settlementId` membership override; only migrated/founded
 *  residents ever get an entry. */
export type FoundedSettlementRegistrySnapshot = {
  records: Record<string, FoundedSettlementRecord>
  residency: Record<NpcId, string>
}

/**
 * Manager-owned registry of founded (nonprocedural) settlements plus the
 * explicit NPC residency override they require. Lives on
 * `SettlementsManager` for the world's lifetime, the same "long-lived
 * registry, stock-only carry snapshot on rebuild/save" contract as
 * `HouseholdRegistry`/`NpcStateRegistry`.
 *
 * @domain settlements
 * @system founded-settlement
 * @role Owns founded-settlement records and NPC settlement-residency overrides.
 * @owns FoundedSettlementRecord
 */
export type FoundedSettlementRegistry = {
  get: (settlementId: string) => FoundedSettlementRecord | undefined
  getBySiteId: (siteId: string) => FoundedSettlementRecord | undefined
  list: () => readonly FoundedSettlementRecord[]
  /** Throws on an id collision — a stable-id conflict is a contract error
   *  (plan settlements-003), never a reason to mint a second id. Callers
   *  must check `get`/`getBySiteId` first (idempotency boundary lives in
   *  `bootstrapFoundedSettlement`, not here). */
  create: (record: FoundedSettlementRecord) => void
  /** Explicit `NpcId -> settlementId` residency override. `undefined` means
   *  this NPC keeps its ordinary procedural source-settlement
   *  interpretation. */
  residencyOf: (npcId: NpcId) => string | undefined
  setResidency: (npcId: NpcId, settlementId: string) => void
  clear: () => void
  serialize: () => FoundedSettlementRegistrySnapshot
}

export function createFoundedSettlementRegistry(
  initial?: FoundedSettlementRegistrySnapshot,
): FoundedSettlementRegistry {
  const byId = new Map<string, FoundedSettlementRecord>(
    initial?.records ? Object.entries(initial.records) : [],
  )
  const residency = new Map<NpcId, string>(
    initial?.residency ? Object.entries(initial.residency) : [],
  )
  return {
    get: (settlementId) => byId.get(settlementId),
    getBySiteId: (siteId) => byId.get(foundedSettlementId(siteId)),
    list: () => [...byId.values()],
    create(record) {
      if (byId.has(record.id)) {
        throw new Error(`[foundedSettlement] settlement id already exists: ${record.id}`)
      }
      byId.set(record.id, record)
    },
    residencyOf: (npcId) => residency.get(npcId),
    setResidency(npcId, settlementId) {
      residency.set(npcId, settlementId)
    },
    clear() {
      byId.clear()
      residency.clear()
    },
    serialize() {
      return {
        records: Object.fromEntries(byId),
        residency: Object.fromEntries(residency),
      }
    },
  }
}
