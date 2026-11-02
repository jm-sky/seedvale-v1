import type { CemeterySize } from '../settlement/props'
import type { CemeteryTerrainSampler, EnvironmentPlacement, VillageDisk } from './chunkEnvironment'
import {
  CEMETERY_CHUNK_EDGE_MARGIN,
  type CemeteryGround,
  cemeteryGroundFits,
  projectIntoOwnerChunk,
  rotatedPlotHalfExtents,
} from '../settlement/cemeteryFit'
import {
  cemeteryPlotDistanceToPoint,
  cemeteryPlotExtents,
  cemeteryPlotRadius,
} from '../settlement/cemeteryLayout'
import { villageSizeConfig } from '../settlement/families'
import { cellsWithinRadius, worldToCell } from '../settlement/settlementGenerator'
import { createSeededRandom } from '../world/parseSeed'
import {
  ABANDONED_SETTLEMENT_MIN_DISTANCE,
  activeTopologyNear,
  assignmentVariationSeed,
  CEMETERY_SETTLEMENT_GATHER_RADIUS,
  cemeteryAssignmentFromTopology,
  cemeteryIdForAbandoned,
  cemeteryIdForAssignment,
  type CemeterySettlementRef,
  type CemeteryTopologyIntent,
  makeSettlementRefPeek,
  type PeekSettlementRef,
} from './cemeteryAssignment'
import {
  CEMETERY_CLEARING_PAD,
  CEMETERY_INNER_FRAC,
  CEMETERY_OUTER_FRAC,
  cemeteryFitsVillageFringe,
  cemeteryFootprintClearsRoads,
} from './chunkEnvironment'
import { type ChunkCoord, worldToChunk } from './chunkGrid'
import { type ChunkTileParams, createWorldTerrainSampler, type RoadCorridorSegment } from './chunkHeightmap'

const ROAD_TINT_REJECT = 0.15
/** Road/path clearance (beyond the corridor half width) for a planner-reserved pose — the planner already
 *  routed its own lanes around it with a wider margin, so only genuinely overlapping roads reject it. */
const RESERVED_ROAD_MARGIN = 0.25
/** Rolled scale range of every cemetery (`CEMETERY_SCALE_MIN + random() * CEMETERY_SCALE_RANGE`). */
const CEMETERY_SCALE_MIN = 0.9
const CEMETERY_SCALE_RANGE = 0.3
/** Rare deterministic wilderness roll — much lower than the old `0.28` fringe gate. */
export const ABANDONED_CEMETERY_CHANCE = 0.012

/**
 * Largest distance from a chunk center at which an abandoned cemetery
 * placement point can land (`SM` margin is smaller than `MD`, so `SM` can sit
 * closer to the edge). Catalog range-pruning must use this reach so a
 * cemetery on a chunk fringe is not dropped from a query band.
 * @domain world-terrain
 */
export function abandonedCemeteryMaxOffsetFromCenter(chunkSize: number): number {
  // Smallest possible axis-aligned half-extent of an abandoned (SM) plot over every yaw: its short half-width.
  const { hw } = cemeteryPlotExtents('SM', CEMETERY_SCALE_MIN)
  return chunkSize / 2 - CEMETERY_CHUNK_EDGE_MARGIN - hw
}

function abandonedRoll(seed: number, cx: number, cz: number): number {
  return createSeededRandom(seed ^ hashString(`${cx},${cz}:abandoned`))()
}

/**
 * Cheap deterministic gate shared by streamed chunk generation and World
 * Location catalog/probe lookup. True iff this chunk's abandoned-cemetery
 * roll succeeds (~`ABANDONED_CEMETERY_CHANCE`). Does not validate terrain
 * or settlement separation.
 * @domain world-terrain
 */
export function chunkPassesAbandonedCemeteryRoll(seed: number, cx: number, cz: number): boolean {
  return abandonedRoll(seed, cx, cz) <= ABANDONED_CEMETERY_CHANCE
}

export type ResolvedCemeteryPlacement = {
  assignmentId: string
  servedSettlementIds: readonly string[]
  size: CemeterySize
  x: number
  z: number
  scale: number
  rotationY: number
  variant: number
  id: string
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function clearingDisks(params: ChunkTileParams): VillageDisk[] {
  const source = params.cemeteryClearings ?? params.clearings
  return source.map((c) => ({ x: c.x, z: c.z, radius: c.radius }))
}

type PlotPose = { x: number, z: number, rotationY: number, size: CemeterySize, scale: number }

/** Footprint-vs-clearing: the exact rotated plot rectangle plus the pad must clear every disk. */
function rejectsClearings(plot: PlotPose, clearings: readonly VillageDisk[]): boolean {
  for (const clearing of clearings) {
    if (cemeteryPlotDistanceToPoint(plot, clearing.x, clearing.z) <= clearing.radius + CEMETERY_CLEARING_PAD) return true
  }
  return false
}

/** Entrance (+Z local) towards `(tx, tz)` — same convention as `rotateOffsetY` / `Object3D.rotation.y`. */
function yawFacing(x: number, z: number, tx: number, tz: number): number {
  return Math.atan2(tx - x, tz - z)
}

/** Yaw for a candidate: faces its (nearest served) settlement. */
function entranceYaw(x: number, z: number, settlements: readonly CemeterySettlementRef[]): number {
  let best = settlements[0]!
  let bestDist = Infinity
  for (const s of settlements) {
    const d = Math.hypot(s.x - x, s.z - z)
    if (d < bestDist) {
      bestDist = d
      best = s
    }
  }
  return yawFacing(x, z, best.x, best.z)
}

function dedicatedRegionalDisks(settlements: readonly CemeterySettlementRef[]): VillageDisk[] {
  return settlements.map((s) => ({
    x: s.x,
    z: s.z,
    radius: villageSizeConfig(s.size).footprintRadius,
  }))
}

function cemeteryRoadSegmentsOf(params: ChunkTileParams): readonly RoadCorridorSegment[] {
  return params.cemeteryRoadSegments ?? params.roadSegments
}

function assignmentTerrainSampler(params: ChunkTileParams): CemeteryTerrainSampler {
  const roads = cemeteryRoadSegmentsOf(params)
  if (roads === params.roadSegments) return createWorldTerrainSampler(params)
  return createWorldTerrainSampler({ ...params, roadSegments: [...roads] })
}

function groundOf(params: ChunkTileParams, terrain: CemeteryTerrainSampler): CemeteryGround {
  return {
    heightAt: (x, z) => terrain.heightAt(x, z),
    waterLevel: params.waterLevel,
    riverSegments: params.riverSegments,
    chunkSize: params.chunkSize,
  }
}

/** Shared physical cemetery validation for active/abandoned candidates (footprint-aware, Q47). */
export function validateCemeteryPhysical(
  x: number,
  z: number,
  size: CemeterySize,
  scale: number,
  rotationY: number,
  params: ChunkTileParams,
  terrain: CemeteryTerrainSampler,
  placementIntent: 'dedicated' | 'abandoned',
  assignmentSettlements: readonly CemeterySettlementRef[],
  /** Road/path clearance beyond the corridor half width; reserved poses use `RESERVED_ROAD_MARGIN`. */
  roadMargin?: number,
): boolean {
  if (terrain.roadTintAt(x, z) > ROAD_TINT_REJECT) return false
  const footprintR = cemeteryPlotRadius(size, scale)
  if (!cemeteryFootprintClearsRoads(x, z, size, scale, cemeteryRoadSegmentsOf(params), rotationY, roadMargin)) return false
  if (!cemeteryGroundFits({ x, z, rotationY, size, scale }, groundOf(params, terrain))) return false

  const clearings = clearingDisks(params)
  const plot: PlotPose = { x, z, rotationY, size, scale }
  if (placementIntent === 'dedicated' && assignmentSettlements.length === 1) {
    const regional = dedicatedRegionalDisks(assignmentSettlements)
    if (!cemeteryFitsVillageFringe(x, z, regional, clearings, footprintR, plot)) return false
  } else if (rejectsClearings(plot, clearings)) {
    return false
  }
  return true
}

/** Rings × bearings candidate sweep (Q47: widened from 6 × 9 — a V2-sized plot must clear every road/path and
 *  clearing, so valid spots lie further out and are rarer; the census in the Q39 plan §5 records the effect).
 *  Dedicated: rings run from the inner fringe edge outward to the outer edge of the (widened) fringe band
 *  (`1.05·villageR + plotRadius`), 12 bearings per ring; inner rings are tried first so the cemetery stays as
 *  close to its settlement as the plot allows. */
const DEDICATED_RINGS = 10
const DEDICATED_BEARINGS = 12

function* placementCandidates(
  topology: CemeteryTopologyIntent,
  worldSeed: number,
  plotRadius: number,
): Generator<{ x: number, z: number }> {
  const random = createSeededRandom(assignmentVariationSeed(worldSeed, topology.assignmentId) ^ 0x63d8a1)
  const baseAngle = random() * Math.PI * 2
  const settlement = topology.settlements[0]!
  const villageR = villageSizeConfig(settlement.size).footprintRadius
  const inner = villageR * CEMETERY_INNER_FRAC
  const outer = villageR * CEMETERY_OUTER_FRAC + plotRadius
  for (let ring = 0; ring < DEDICATED_RINGS; ring++) {
    const dist = inner + ((outer - inner) * ring) / (DEDICATED_RINGS - 1)
    const offset = baseAngle + ring * 0.55
    for (let i = 0; i < DEDICATED_BEARINGS; i++) {
      const angle = offset + (i / DEDICATED_BEARINGS) * Math.PI * 2
      yield { x: settlement.x + Math.cos(angle) * dist, z: settlement.z + Math.sin(angle) * dist }
    }
  }
}

/** Dedicated assignments first try the planner's reservation (Q58); it must still validate on the live
 *  terrain (roads, clearings, chunk size) — otherwise the candidate search below runs as before. */
function placeFromReservation(
  topology: CemeteryTopologyIntent,
  size: CemeterySize,
  params: ChunkTileParams,
  terrain: CemeteryTerrainSampler,
): CemeteryPlotPoseFull | null {
  if (topology.settlements.length !== 1) return null
  const r = topology.settlements[0]!.reservation
  if (!r || r.size !== size) return null
  if (!validateCemeteryPhysical(r.x, r.z, size, r.scale, r.rotationY, params, terrain, 'dedicated', topology.settlements, RESERVED_ROAD_MARGIN)) {
    return null
  }
  return r
}

type CemeteryPlotPoseFull = { x: number, z: number, rotationY: number, scale: number }

function tryPlaceTopology(
  topology: CemeteryTopologyIntent,
  params: ChunkTileParams,
): ResolvedCemeteryPlacement | null {
  const assignment = cemeteryAssignmentFromTopology(topology, params.seed)
  const random = createSeededRandom(assignmentVariationSeed(params.seed, topology.assignmentId) ^ 0x41c2e7)
  const scale = CEMETERY_SCALE_MIN + random() * CEMETERY_SCALE_RANGE
  random() // legacy yaw roll slot — yaw now follows the candidate (entrance towards the settlement)
  const variant = random()
  const terrain = assignmentTerrainSampler(params)
  const reserved = placeFromReservation(topology, assignment.size, params, terrain)
  if (reserved) {
    return {
      assignmentId: topology.assignmentId,
      servedSettlementIds: topology.servedSettlementIds,
      size: assignment.size,
      x: reserved.x,
      z: reserved.z,
      scale: reserved.scale,
      rotationY: reserved.rotationY,
      variant,
      id: cemeteryIdForAssignment(topology.assignmentId, params.seed),
    }
  }
  for (const raw of placementCandidates(topology, params.seed, cemeteryPlotRadius(assignment.size, scale))) {
    // Project into the owner chunk's valid interior first (a clamp, never a discard).
    // Yaw faces the settlement from the first projected point; the final point is projected with that same
    // yaw (not re-derived), so the owner-chunk fit is consistent by construction (a few degrees of entrance
    // error at most).
    const yaw0 = entranceYaw(raw.x, raw.z, topology.settlements)
    const first = projectIntoOwnerChunk(raw.x, raw.z, assignment.size, scale, yaw0, params.chunkSize)
    const yaw = entranceYaw(first.x, first.z, topology.settlements)
    const candidate = projectIntoOwnerChunk(raw.x, raw.z, assignment.size, scale, yaw, params.chunkSize)
    if (
      !validateCemeteryPhysical(
        candidate.x,
        candidate.z,
        assignment.size,
        scale,
        yaw,
        params,
        terrain,
        'dedicated',
        topology.settlements,
      )
    ) {
      continue
    }
    return {
      assignmentId: topology.assignmentId,
      servedSettlementIds: topology.servedSettlementIds,
      size: assignment.size,
      x: candidate.x,
      z: candidate.z,
      scale,
      rotationY: yaw,
      variant,
      id: cemeteryIdForAssignment(topology.assignmentId, params.seed),
    }
  }
  return null
}

type CachedAssignmentPlacement =
  | { status: 'placed', placement: ResolvedCemeteryPlacement }
  | { status: 'none' }

const resolvedPlacementByAssignment = new Map<string, CachedAssignmentPlacement>()

export function clearCemeteryPlacementCaches(): void {
  resolvedPlacementByAssignment.clear()
}

function rememberPlacement(assignmentId: string, cached: CachedAssignmentPlacement): void {
  resolvedPlacementByAssignment.set(assignmentId, cached)
}

function cachedPlacementOf(assignmentId: string): CachedAssignmentPlacement | undefined {
  return resolvedPlacementByAssignment.get(assignmentId)
}

/**
 * Resolve one assignment's winning placement — shared across chunk generation and catalog lookup.
 * @domain world-terrain
 */
export function resolvePlacementForTopology(
  topology: CemeteryTopologyIntent,
  params: ChunkTileParams,
  _terrain?: CemeteryTerrainSampler,
): ResolvedCemeteryPlacement | null {
  const cached = cachedPlacementOf(topology.assignmentId)
  if (cached?.status === 'placed') return cached.placement
  if (cached?.status === 'none') return null

  const placed = tryPlaceTopology(topology, params)
  if (placed) {
    rememberPlacement(topology.assignmentId, { status: 'placed', placement: placed })
    return placed
  }
  rememberPlacement(topology.assignmentId, { status: 'none' })
  return null
}

export function getCachedPlacementForAssignment(assignmentId: string): ResolvedCemeteryPlacement | null | undefined {
  const cached = cachedPlacementOf(assignmentId)
  if (!cached) return undefined
  if (cached.status === 'placed') return cached.placement
  return null
}

export function resolvedPlacementToEnvironment(p: ResolvedCemeteryPlacement): EnvironmentPlacement {
  return {
    x: p.x,
    z: p.z,
    kind: 'cemetery',
    scale: p.scale,
    rotationY: p.rotationY,
    variant: p.variant,
    cemeterySize: p.size,
    id: p.id,
  }
}

function isTooNearAnySettlement(x: number, z: number, peekRef: PeekSettlementRef): boolean {
  const center = worldToCell(x, z)
  for (const cell of cellsWithinRadius(center, 2)) {
    const ref = peekRef(cell)
    if (!ref) continue
    if (Math.hypot(ref.x - x, ref.z - z) < ABANDONED_SETTLEMENT_MIN_DISTANCE) return true
  }
  return false
}

/**
 * Catalog / unloaded-probe entry: skip `paramsFor` + terrain sampling when
 * the deterministic wilderness roll already rejects the chunk.
 * Streamed generation keeps calling `resolveAbandonedCemeteryForChunk`
 * with the sampler it already built.
 * @domain world-terrain
 */
export function resolveAbandonedCemeteryAfterRoll(
  coord: ChunkCoord,
  seed: number,
  materialize: () => { params: ChunkTileParams, terrain: CemeteryTerrainSampler },
): EnvironmentPlacement | null {
  if (!chunkPassesAbandonedCemeteryRoll(seed, coord.cx, coord.cz)) return null
  const { params, terrain } = materialize()
  return resolveAbandonedCemeteryForChunk(coord, params, terrain)
}

export function resolveAbandonedCemeteryForChunk(
  coord: ChunkCoord,
  params: ChunkTileParams,
  terrain: CemeteryTerrainSampler,
): EnvironmentPlacement | null {
  if (!chunkPassesAbandonedCemeteryRoll(params.seed, coord.cx, coord.cz)) return null

  const peekRef = makeSettlementRefPeek(params.cemeterySettlements ?? [])
  const { chunkSize, seed } = params
  const half = chunkSize / 2
  const random = createSeededRandom(seed ^ hashString(`abandoned:${coord.cx},${coord.cz}`))
  const size: CemeterySize = random() < 0.7 ? 'SM' : 'MD'
  const scale = CEMETERY_SCALE_MIN + random() * CEMETERY_SCALE_RANGE
  const rotationY = random() * Math.PI * 2
  const variant = random()
  const { ex, ez } = rotatedPlotHalfExtents(size, scale, rotationY)
  const rangeX = Math.max(0, half - CEMETERY_CHUNK_EDGE_MARGIN - ex)
  const rangeZ = Math.max(0, half - CEMETERY_CHUNK_EDGE_MARGIN - ez)

  for (let attempt = 0; attempt < 12; attempt++) {
    const wx = coord.cx * chunkSize + (random() * 2 - 1) * rangeX
    const wz = coord.cz * chunkSize + (random() * 2 - 1) * rangeZ
    if (
      !validateCemeteryPhysical(wx, wz, size, scale, rotationY, params, terrain, 'abandoned', []) ||
      isTooNearAnySettlement(wx, wz, peekRef)
    ) {
      continue
    }
    return {
      x: wx,
      z: wz,
      kind: 'cemetery',
      scale,
      rotationY,
      variant,
      cemeterySize: size,
      id: cemeteryIdForAbandoned(coord.cx, coord.cz, 0, seed),
    }
  }
  return null
}

/** Which chunk owns a resolved placement point. */
export function placementOwnerChunk(x: number, z: number, chunkSize: number): ChunkCoord {
  return worldToChunk(x, z, chunkSize)
}

function emitIfOwned(
  resolved: ResolvedCemeteryPlacement,
  coord: ChunkCoord,
  chunkSize: number,
  seenIds: Set<string>,
  placements: EnvironmentPlacement[],
): void {
  const owner = placementOwnerChunk(resolved.x, resolved.z, chunkSize)
  if (owner.cx !== coord.cx || owner.cz !== coord.cz) return
  if (seenIds.has(resolved.id)) return
  seenIds.add(resolved.id)
  placements.push(resolvedPlacementToEnvironment(resolved))
}

/**
 * Assignment-driven cemetery resolution for one chunk — active assignments first, then abandoned.
 * @domain world-terrain
 */
export function resolveCemeteriesForChunk(
  coord: ChunkCoord,
  params: ChunkTileParams,
  terrain: CemeteryTerrainSampler,
): EnvironmentPlacement[] {
  const peekRef = makeSettlementRefPeek(params.cemeterySettlements ?? [])
  const { x: centerX, z: centerZ } = { x: coord.cx * params.chunkSize, z: coord.cz * params.chunkSize }
  const topologies = activeTopologyNear(centerX, centerZ, CEMETERY_SETTLEMENT_GATHER_RADIUS, peekRef)
  const placements: EnvironmentPlacement[] = []
  const seenIds = new Set<string>()

  for (const topology of topologies) {
    const resolved = resolvePlacementForTopology(topology, params, terrain)
    if (resolved) {
      emitIfOwned(resolved, coord, params.chunkSize, seenIds, placements)
    }
  }

  const abandoned = resolveAbandonedCemeteryForChunk(coord, params, terrain)
  if (abandoned?.id && !seenIds.has(abandoned.id)) placements.push(abandoned)
  return placements
}

/** First cemetery placement in a chunk, if any — used by unloaded landmark lookup. */
export function resolveCemeteryPlacement(
  coord: ChunkCoord,
  params: ChunkTileParams,
  terrain: CemeteryTerrainSampler,
): EnvironmentPlacement | null {
  const all = resolveCemeteriesForChunk(coord, params, terrain)
  return all[0] ?? null
}
