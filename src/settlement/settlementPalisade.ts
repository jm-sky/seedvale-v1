import * as THREE from 'three'
import type { RoadCorridorSegment } from '../terrain/chunkHeightmap'
import type { Collider } from '../world/collision'
import type { SettlementSite } from './findSettlementSite'
import type { VillageEntrance, VillagePlan } from './villagePlan'
import { pointHitsCorridor } from '../math/segment'
import { buildInstancedProps, type PropPlacement } from '../render/instancedProps'
import { type CoastalSamplers, isCoastalPlacement } from '../terrain/coastPlacement'
import { type VillageSize, villageSizeConfig } from './families'
import { WALL_URL } from './propSpecs'
import { loadPropOrFallback } from './propUtils'
import { yawToward } from './roadNetwork'

export { pointHitsCorridor }

const WALL_TARGET_HEIGHT = 1.85
/** Approximate world half-width of a wall segment after `prepareProp` height fit. */
export const WALL_HALF_LENGTH = 2.2
/** Gate gap half-angle (radians) left open for the road/path. */
export const PALISADE_GATE_HALF_ANGLE = 0.38
/** Approximate collider half-thickness of a palisade wall segment (plan
 *  settlements-015) — a settlement wall segment is much thinner than a house
 *  wall (`houseBuilder.ts`'s `WALL_HALF_DEPTH`); kept small so the collider
 *  doesn't visibly protrude past the mesh and the gate/corridor/coastal gaps
 *  this module leaves open stay physically open too.
 *  @domain settlements */
export const PALISADE_WALL_HALF_DEPTH = 0.3
/** How many wall segments on each side of the gate (small villages stay modest). */
const PALISADE_SEGMENTS_PER_SIDE: Record<VillageSize, number> = {
  OUTPOST: 1,
  SM: 2,
  MD: 3,
  LG: 3,
  XL: 4,
}

/** Extra short landward sections away from every entrance (author Q66,
 *  2026-11-02: "a few fences in a few places", no full ring) and how many wall
 *  segments each holds. */
const PALISADE_EXTRA_SECTIONS: Record<VillageSize, { sections: number; segments: number }> = {
  OUTPOST: { sections: 1, segments: 1 },
  SM: { sections: 2, segments: 2 },
  MD: { sections: 2, segments: 2 },
  LG: { sections: 2, segments: 3 },
  XL: { sections: 2, segments: 3 },
}

/** Fallback palisade stake if `wall.glb` fails to load. */
function createPalisadeStake(): THREE.Group {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x5c4030, flatShading: true })
  const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 1.8, 5), mat)
  stake.position.y = 0.9
  stake.castShadow = true
  g.add(stake)
  return g
}

/** A finished, placement-constraint-passing settlement palisade segment — the
 *  single plain-data source both presentation (`plantEntrancePalisade`) and
 *  collision (`settlementPalisadeColliders`) consume. Never reconstruct this
 *  from settlement center/radius/entrance angle in a second place; resolve it
 *  once with `resolveEntrancePalisadePlacements` and share the result.
 *  @domain settlements */
export type SettlementPalisadePlacement = PropPlacement

/**
 * One planned village-torch post at a road entrance (plan settlements-010).
 * Presentation (`props.ts`) materializes these; identity is the semantic
 * `slot`, never mesh order.
 * @domain settlements
 */
export type SettlementEntranceTorchPlacement = {
  slot: string
  x: number
  z: number
  rotationY: number
}

function palisadeRadius(plan: VillagePlan | undefined, size: VillageSize): number {
  return plan?.boundary.radius ?? villageSizeConfig(size).footprintRadius * 0.72
}

function maxCorridorHalfWidth(corridors: readonly RoadCorridorSegment[]): number {
  let maxCorridorHalf = 5
  for (const seg of corridors) {
    if (seg.halfWidth > maxCorridorHalf) maxCorridorHalf = seg.halfWidth
  }
  return maxCorridorHalf
}

function palisadeGateHalf(
  radius: number,
  corridors: readonly RoadCorridorSegment[],
): number {
  return Math.max(
    PALISADE_GATE_HALF_ANGLE,
    Math.atan2(maxCorridorHalfWidth(corridors) + WALL_HALF_LENGTH, Math.max(radius, 1)),
  )
}

function palisadeStep(radius: number): number {
  return (WALL_HALF_LENGTH * 2) / Math.max(radius, 1)
}

function entranceOutward(entrance: VillageEntrance, site: SettlementSite): number {
  return Math.atan2(entrance.z - site.z, entrance.x - site.x)
}

function shortestAngleDelta(a: number, b: number): number {
  let delta = (a - b) % (Math.PI * 2)
  if (delta > Math.PI) delta -= Math.PI * 2
  if (delta < -Math.PI) delta += Math.PI * 2
  return Math.abs(delta)
}

function inlandEntrancesOf(
  plan: VillagePlan | undefined,
  coastEnv: CoastalSamplers,
): VillageEntrance[] {
  return (plan?.entrances ?? []).filter((entrance) => !isCoastalPlacement(entrance.x, entrance.z, coastEnv))
}

function primaryEntrance(inland: readonly VillageEntrance[]): VillageEntrance | undefined {
  return inland.find((entrance) => entrance.kind === 'road') ?? inland[0]
}

function segmentPlacement(
  site: SettlementSite,
  radius: number,
  ang: number,
  sampleHeight: (x: number, z: number) => number,
): SettlementPalisadePlacement {
  const x = site.x + Math.cos(ang) * radius
  const z = site.z + Math.sin(ang) * radius
  const tangent = ang + Math.PI / 2
  return {
    speciesIndex: 0,
    x,
    z,
    groundY: sampleHeight(x, z),
    rotationY: yawToward(Math.cos(tangent), Math.sin(tangent)),
    scale: 1,
  }
}

function rejectSegment(
  x: number,
  z: number,
  coastEnv: CoastalSamplers,
  corridors: readonly RoadCorridorSegment[],
): boolean {
  if (isCoastalPlacement(x, z, coastEnv)) return true
  return pointHitsCorridor(x, z, corridors, WALL_HALF_LENGTH + 0.4)
}

function twoPi(a: number): number {
  const m = a % (Math.PI * 2)
  return m < 0 ? m + Math.PI * 2 : m
}

/** Wall-segment angles of the extra landward sections: the widest angular gaps
 *  between the gates (ties → lower start angle, deterministic), each centred
 *  in its gap and only used when the gap fits gates + the section. */
function landwardSectionAngles(
  gateAngles: readonly number[],
  gateHalf: number,
  step: number,
  config: { sections: number; segments: number },
): number[] {
  const sorted = gateAngles.map(twoPi).sort((a, b) => a - b)
  const gaps: { start: number; width: number }[] = []
  if (sorted.length === 0) gaps.push({ start: 0, width: Math.PI * 2 })
  else {
    for (let i = 0; i < sorted.length; i++) {
      const start = sorted[i]!
      const next = i + 1 < sorted.length ? sorted[i + 1]! : sorted[0]! + Math.PI * 2
      gaps.push({ start, width: next - start })
    }
  }
  gaps.sort((a, b) => b.width - a.width || a.start - b.start)
  const need = (sorted.length === 0 ? 0 : 2 * gateHalf) + config.segments * step
  const angles: number[] = []
  for (const gap of gaps.slice(0, config.sections)) {
    if (gap.width < need) continue
    const mid = gap.start + gap.width / 2
    for (let j = 0; j < config.segments; j++) {
      angles.push(mid + (j - (config.segments - 1) / 2) * step)
    }
  }
  return angles
}

/**
 * Resolves the final settlement entrance palisade segment placements.
 * `default` keeps short palisade wings beside **every** inland road/path
 * entrance plus a few short landward sections in the widest gaps between
 * entrances (never a full ring; Q66). Coastal candidates are rejected one by
 * one, so a village whose entrances are all coastal still gets its landward
 * sections.
 * `closed` fills substantially more of the same ring, leaving a gate gap at
 * every planned inland road/path entrance and still rejecting coast/corridor
 * hits. Not a second palisade implementation.
 *
 * This is the one place gate/coastal/corridor rejection happens. Presentation
 * (`plantEntrancePalisade`) and collision (`settlementPalisadeColliders`)
 * must consume this exact result rather than re-deriving it.
 * @domain settlements
 */
export function resolveEntrancePalisadePlacements(
  site: SettlementSite,
  size: VillageSize,
  sampleHeight: (x: number, z: number) => number,
  waterLevel: number,
  plan: VillagePlan | undefined,
  coast?: CoastalSamplers,
  corridors: readonly RoadCorridorSegment[] = [],
): SettlementPalisadePlacement[] {
  const segmentsPerSide = PALISADE_SEGMENTS_PER_SIDE[size]
  if (segmentsPerSide <= 0) return []

  const coastEnv: CoastalSamplers = coast ?? { sampleHeight, waterLevel }
  const radius = palisadeRadius(plan, size)
  const inland = inlandEntrancesOf(plan, coastEnv)

  const gateHalf = palisadeGateHalf(radius, corridors)
  const step = palisadeStep(radius)
  const closed = plan?.identity.character === 'closed'

  if (closed) {
    const gateAngles = inland.map((entrance) => entranceOutward(entrance, site))
    if (gateAngles.length === 0) {
      const outward = 0
      const gateX = site.x + Math.cos(outward) * radius
      const gateZ = site.z + Math.sin(outward) * radius
      if (isCoastalPlacement(gateX, gateZ, coastEnv)) return []
      gateAngles.push(outward)
    }

    const count = Math.max(1, Math.round((Math.PI * 2) / step))
    const placements: SettlementPalisadePlacement[] = []
    for (let i = 0; i < count; i++) {
      const ang = i * step
      if (gateAngles.some((gate) => shortestAngleDelta(ang, gate) < gateHalf)) continue
      const x = site.x + Math.cos(ang) * radius
      const z = site.z + Math.sin(ang) * radius
      if (rejectSegment(x, z, coastEnv, corridors)) continue
      placements.push(segmentPlacement(site, radius, ang, sampleHeight))
    }
    return placements
  }

  // No planned entrances at all (legacy/undefined plan): one gate at angle 0.
  const noPlan = (plan?.entrances.length ?? 0) === 0
  const gates = noPlan ? [0] : inland.map((entrance) => entranceOutward(entrance, site))
  const placements: SettlementPalisadePlacement[] = []
  const used: number[] = []
  const tryPush = (ang: number): void => {
    if (gates.some((gate) => shortestAngleDelta(ang, gate) < gateHalf)) return
    if (used.some((u) => shortestAngleDelta(ang, u) < step * 0.9)) return
    const x = site.x + Math.cos(ang) * radius
    const z = site.z + Math.sin(ang) * radius
    if (rejectSegment(x, z, coastEnv, corridors)) return
    used.push(ang)
    placements.push(segmentPlacement(site, radius, ang, sampleHeight))
  }

  for (const outward of gates) {
    for (const side of [-1, 1] as const) {
      for (let i = 0; i < segmentsPerSide; i++) {
        tryPush(outward + side * (gateHalf + step * (i + 0.5)))
      }
    }
  }
  for (const ang of landwardSectionAngles(gates, gateHalf, step, PALISADE_EXTRA_SECTIONS[size])) {
    tryPush(ang)
  }
  return placements
}

function torchPairForEntrance(
  site: SettlementSite,
  radius: number,
  outward: number,
  gateHalf: number,
  step: number,
  leftSlot: string,
  rightSlot: string,
  coastEnv: CoastalSamplers,
  corridors: readonly RoadCorridorSegment[],
): SettlementEntranceTorchPlacement[] {
  const flank = gateHalf + step * 0.55
  const pair: SettlementEntranceTorchPlacement[] = []
  for (const side of [-1, 1] as const) {
    const ang = outward + side * flank
    const x = site.x + Math.cos(ang) * radius
    const z = site.z + Math.sin(ang) * radius
    if (isCoastalPlacement(x, z, coastEnv)) continue
    if (pointHitsCorridor(x, z, corridors, 0.85)) continue
    pair.push({
      slot: side < 0 ? leftSlot : rightSlot,
      x,
      z,
      rotationY: ang + Math.PI,
    })
  }
  return pair
}

/**
 * Planned entrance-road torch pairs. `default` keeps one pair at the primary
 * inland entrance. `closed` emits exactly one pair per final inland `road`
 * entrance. Positions sit on the first palisade-wing angle so they stay
 * outside the road corridor and wall footprint.
 *
 * @domain settlements
 */
export function resolveEntranceTorchPlacements(
  site: SettlementSite,
  size: VillageSize,
  plan: VillagePlan | undefined,
  coast?: CoastalSamplers,
  corridors: readonly RoadCorridorSegment[] = [],
): SettlementEntranceTorchPlacement[] {
  const sampleHeight = coast?.sampleHeight ?? ((): number => 0)
  const waterLevel = coast?.waterLevel ?? 0
  const coastEnv: CoastalSamplers = coast ?? { sampleHeight, waterLevel }
  const radius = palisadeRadius(plan, size)
  const inland = inlandEntrancesOf(plan, coastEnv)
  const entrances = plan?.entrances ?? []
  if (!inland[0] && entrances.length > 0) return []

  const gateHalf = palisadeGateHalf(radius, corridors)
  const step = palisadeStep(radius)
  const closed = plan?.identity.character === 'closed'

  if (closed) {
    const roads = inland.filter((entrance) => entrance.kind === 'road')
    const placements: SettlementEntranceTorchPlacement[] = []
    roads.forEach((entrance, index) => {
      const outward = entranceOutward(entrance, site)
      const gateX = site.x + Math.cos(outward) * radius
      const gateZ = site.z + Math.sin(outward) * radius
      if (isCoastalPlacement(gateX, gateZ, coastEnv)) return
      const primary = index === 0
      placements.push(
        ...torchPairForEntrance(
          site,
          radius,
          outward,
          gateHalf,
          step,
          primary ? 'gate:left' : `gate:${entrance.id}:left`,
          primary ? 'gate:right' : `gate:${entrance.id}:right`,
          coastEnv,
          corridors,
        ),
      )
    })
    return placements
  }

  const entrance = primaryEntrance(inland)
  if (!entrance && entrances.length > 0) return []
  const outward = entrance ? entranceOutward(entrance, site) : 0
  const gateX = site.x + Math.cos(outward) * radius
  const gateZ = site.z + Math.sin(outward) * radius
  if (isCoastalPlacement(gateX, gateZ, coastEnv)) return []
  return torchPairForEntrance(
    site,
    radius,
    outward,
    gateHalf,
    step,
    'gate:left',
    'gate:right',
    coastEnv,
    corridors,
  )
}

/**
 * Materializes the final entrance palisade placements as instanced geometry.
 * Presentation only — `placements` must be `resolveEntrancePalisadePlacements`'s
 * exact result, the same array collision projects from.
 * Uses `wall.glb` (Quaternius Fantasy RTS) with procedural stake fallback.
 * `isAlive` (optional) is evaluated after the template await; a false result
 * skips allocation/attachment and resolves `null`.
 * @domain settlements
 */
export async function plantEntrancePalisade(
  group: THREE.Group,
  placements: readonly SettlementPalisadePlacement[],
  instanceName = 'settlement-palisade',
  isAlive?: () => boolean,
): Promise<THREE.Object3D | null> {
  if (placements.length === 0) return null
  const wall = await loadPropOrFallback(WALL_URL, WALL_TARGET_HEIGHT, createPalisadeStake)
  // Late-continuation guard: the owning settlement may have been disposed
  // while the template was loading (settlements-023 D3).
  if (isAlive && !isAlive()) return null
  const instanced = buildInstancedProps([wall], placements, instanceName)
  if (!instanced) return null
  group.add(instanced.group)
  return instanced.group
}

/**
 * Shared placement → OBB projection for settlement fence / palisade wall
 * segments. Every finished visible placement gets exactly one `obb`
 * collider; omitted gaps (gate, entrance, corridor rejection) have no
 * counterpart — never fabricate a continuous ring. `x`/`z` are copied from the
 * canonical placement; the footprint is `WALL_HALF_LENGTH` ×
 * `PALISADE_WALL_HALF_DEPTH` scaled by `placement.scale` (pasture/paddock
 * fences render at 0.62).
 *
 * Yaw: `wall.glb`'s long axis is local +X and the visual uses Three.js
 * `rotation.y = θ` (+X → `(cos θ, −sin θ)`), whereas the OBB convention in
 * `world/collision.ts` rotates by `+θ`. The OBB therefore takes `−θ`.
 * @domain settlements
 */
export function fencePlacementColliders(
  placements: readonly PropPlacement[],
): Collider[] {
  return placements.map((placement) => ({
    type: 'obb' as const,
    x: placement.x,
    z: placement.z,
    halfWidth: WALL_HALF_LENGTH * placement.scale * (placement.lengthScale ?? 1),
    halfDepth: PALISADE_WALL_HALF_DEPTH * placement.scale,
    rotationY: 0 - placement.rotationY, // not `-x`: avoids -0 for yaw 0
  }))
}

/**
 * Pure placement → collision projection for the settlement entrance
 * palisade. Thin wrapper over `fencePlacementColliders` so call sites /
 * tests keep the entrance-palisade semantic name.
 * @domain settlements
 */
export function settlementPalisadeColliders(
  placements: readonly SettlementPalisadePlacement[],
): Collider[] {
  return fencePlacementColliders(placements)
}
