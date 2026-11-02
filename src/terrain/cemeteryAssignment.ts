import type { VillageSize } from '../settlement/families'
import type { CemeterySize } from '../settlement/props'
import { cemeterySizeForServedSizes } from '../settlement/cemeteryLayout'
import { CEMETERY_PLOT_ID, type CemeteryReservationPose } from '../settlement/cemeteryReservation'
import {
  cellFromId,
  cellSeed,
  cellsWithinRadius,
  SETTLEMENT_GRID_STEP,
  type SettlementCell,
  type SettlementDef,
  worldToCell,
} from '../settlement/settlementGenerator'

/** Lightweight settlement view for worker-safe cemetery assignment/placement. */
export type CemeterySettlementRef = {
  id: string
  gx: number
  gz: number
  x: number
  z: number
  size: VillageSize
  /** True for the home settlement — it never shares a cemetery (Q58). */
  isHome?: boolean
  /** Planner-reserved own-cemetery pose (Q58) — dedicated placement reads it first. Absent when the
   *  settlement does not reserve one or nothing fit; the terrain search then runs as before. */
  reservation?: CemeteryReservationPose
}

export type CemeteryAssignmentIntent = 'dedicated'

/** Topology-level cemetery assignment before terrain placement is resolved. */
export type CemeteryTopologyIntent = {
  assignmentId: string
  servedSettlementIds: readonly string[]
  settlements: readonly CemeterySettlementRef[]
  intent: CemeteryAssignmentIntent
}

export type CemeteryAssignment = CemeteryTopologyIntent & {
  size: CemeterySize
}

export type PeekSettlementDef = (cell: SettlementCell) => SettlementDef | null
export type PeekSettlementRef = (cell: SettlementCell) => CemeterySettlementRef | null

export function makeSettlementRefPeek(refs: readonly CemeterySettlementRef[]): PeekSettlementRef {
  const map = new Map(refs.map((r) => [`${r.gx}_${r.gz}`, r]))
  return (cell) => map.get(`${cell.gx}_${cell.gz}`) ?? null
}

/** Grid radius around a chunk center when gathering settlement refs for placement. */
export const CEMETERY_SETTLEMENT_GATHER_RADIUS = 2
/** Wilderness abandoned cemeteries must stay at least this far from live settlements. */
export const ABANDONED_SETTLEMENT_MIN_DISTANCE = SETTLEMENT_GRID_STEP * 0.75

const topologyCache = new Map<string, CemeteryTopologyIntent>()

/** Drop runtime cemetery caches on world rebuild — same lifetime as road/settlement caches. */
export function clearCemeteryCaches(): void {
  topologyCache.clear()
}

function reservationOfPlan(def: SettlementDef): CemeteryReservationPose | null {
  const plot = def.plan?.plots.find((p) => p.id === CEMETERY_PLOT_ID)
  if (!plot?.cemetery) return null
  return { x: plot.x, z: plot.z, rotationY: plot.rotation, size: plot.cemetery.size, scale: plot.cemetery.scale }
}

export function settlementRefFromDef(def: SettlementDef): CemeterySettlementRef {
  const reservation = reservationOfPlan(def)
  return {
    id: def.id, gx: def.gx, gz: def.gz, x: def.x, z: def.z, size: def.size,
    ...(def.isHome ? { isHome: true } : {}),
    ...(reservation ? { reservation } : {}),
  }
}

export function collectSettlementRefsNear(
  worldX: number,
  worldZ: number,
  radiusCells: number,
  peekDef: PeekSettlementDef,
): CemeterySettlementRef[] {
  const center = worldToCell(worldX, worldZ)
  const out: CemeterySettlementRef[] = []
  for (const cell of cellsWithinRadius(center, radiusCells)) {
    const def = peekDef(cell)
    if (!def) continue
    out.push(settlementRefFromDef(def))
  }
  out.sort((a, b) => a.id.localeCompare(b.id))
  return out
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function canonicalSettlementTuple(ids: readonly string[]): string {
  return [...ids].sort((a, b) => a.localeCompare(b)).join('+')
}

/** Stable assignment identity from served settlement ids (1 or 2). */
export function cemeteryAssignmentId(servedSettlementIds: readonly string[]): string {
  return `active:${canonicalSettlementTuple(servedSettlementIds)}`
}

/** Stable cemetery landmark id for an active assignment (plan §18). */
export function cemeteryIdForAssignment(assignmentId: string, worldSeed: number): string {
  const h = hashString(`${worldSeed}:${assignmentId}:cemetery`) >>> 0
  return `cemetery:a:${assignmentId.slice('active:'.length)}:${h.toString(36)}`
}

/** Stable cemetery landmark id for a wilderness abandoned roll in one chunk. */
export function cemeteryIdForAbandoned(cx: number, cz: number, ordinal: number, worldSeed: number): string {
  const h = hashString(`${worldSeed}:abandoned:${cx}:${cz}:${ordinal}`) >>> 0
  return `cemetery:w:${cx}:${cz}:${ordinal}:${h.toString(36)}`
}

export function isLegacyCemeteryId(id: string): boolean {
  const parts = id.split(':')
  return parts.length === 5 && parts[0] === 'cemetery' && parts[1] !== 'a' && parts[1] !== 'w'
}

export function isAbandonedCemeteryId(id: string): boolean {
  return id.startsWith('cemetery:w:')
}

/** Dedicated assignment for one settlement — also the shared-placement fallback. */
export function dedicatedCemeteryTopology(def: CemeterySettlementRef): CemeteryTopologyIntent {
  const served = [def.id]
  return {
    assignmentId: cemeteryAssignmentId(served),
    servedSettlementIds: served,
    settlements: [def],
    intent: 'dedicated',
  }
}

/**
 * Deterministic topology intent for one settlement — always dedicated since 059 W4.
 * @domain world-terrain
 */
export function resolveCemeteryTopologyForSettlement(
  settlementId: string,
  peekRef: PeekSettlementRef,
): CemeteryTopologyIntent | null {
  if (topologyCache.has(settlementId)) return topologyCache.get(settlementId)!
  const cell = cellFromId(settlementId)
  if (!cell) return null
  const self = peekRef(cell)
  if (!self || self.id !== settlementId) return null
  // 059 W4 / Q81-b (author 2026-11-02): villages are ≥ 720 m apart, so SM sharing is gone —
  // every settlement (SM included) gets its own, size-mapped cemetery.
  const intent = dedicatedCemeteryTopology(self)
  topologyCache.set(settlementId, intent)
  return intent
}

export { cemeterySizeForServedSizes }

export function cemeteryAssignmentFromTopology(
  topology: CemeteryTopologyIntent,
  _worldSeed: number,
): CemeteryAssignment {
  return {
    ...topology,
    size: cemeterySizeForServedSizes(topology.settlements.map((s) => s.size)),
  }
}

export function assignmentVariationSeed(worldSeed: number, assignmentId: string): number {
  return cellSeed(worldSeed, { gx: hashString(assignmentId) & 0xffff, gz: (hashString(assignmentId) >>> 16) & 0xffff })
}

/**
 * Canonical reverse lookup: cemetery id → served settlement ids (`[]` for abandoned).
 * @domain world-terrain
 */
export function servedSettlementIdsForCemeteryId(cemeteryId: string): readonly string[] {
  if (isAbandonedCemeteryId(cemeteryId) || isLegacyCemeteryId(cemeteryId)) return []
  if (!cemeteryId.startsWith('cemetery:a:')) return []
  const body = cemeteryId.slice('cemetery:a:'.length)
  const lastColon = body.lastIndexOf(':')
  if (lastColon < 0) return []
  const tuple = body.slice(0, lastColon)
  if (!tuple) return []
  return tuple.split('+')
}

/** All unique active topology intents touching settlements near `(worldX, worldZ)`. */
export function activeTopologyNear(
  worldX: number,
  worldZ: number,
  radiusCells: number,
  peekRef: PeekSettlementRef,
): CemeteryTopologyIntent[] {
  const refs: CemeterySettlementRef[] = []
  const center = worldToCell(worldX, worldZ)
  for (const cell of cellsWithinRadius(center, radiusCells)) {
    const ref = peekRef(cell)
    if (ref) refs.push(ref)
  }
  refs.sort((a, b) => a.id.localeCompare(b.id))
  const seen = new Set<string>()
  const out: CemeteryTopologyIntent[] = []
  for (const ref of refs) {
    const intent = resolveCemeteryTopologyForSettlement(ref.id, peekRef)
    if (!intent || seen.has(intent.assignmentId)) continue
    seen.add(intent.assignmentId)
    out.push(intent)
  }
  return out
}

