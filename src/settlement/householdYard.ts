import type { VillageSize } from './families'

/**
 * Household compound geometry (queue Q41 / Q34 plan §2).
 *
 * The planner owns the whole household compound as pure deterministic plan
 * data: house yaw, a yard rectangle attached to the house **back** wall and
 * fixed yard slots (barrel / trough / wood / storage row, one unconditional
 * `profession` reservation, a `gate` marker for fences — Q35). `props.ts`
 * and the simulation landmarks consume these positions; neither re-derives
 * them. Pure geometry — no Three.js, no households, no runtime state.
 *
 * Frames: house-local axes are `x` across the facade and `z` front→back
 * (the door is on the front wall, `z = -depth / 2`, so the yard lies at
 * `z > depth / 2`). World placement uses the Three.js `rotation.y = yaw`
 * convention: local `(x, z)` → world `(x cos yaw + z sin yaw, -x sin yaw + z cos yaw)`.
 */

/** Real house footprint dimensions (`HouseDefinition.footprint`), metres. */
export type HouseYardFootprint = { width: number, depth: number }

/** Side overhang of the yard past each house corner (gate + walk-around lane). */
export const YARD_SIDE_OVERHANG = 1.0
/** Gap between the house back wall (footprint edge) and the yard rectangle. */
export const YARD_BACK_GAP = 0.3
/** Distance of the prop row from the house-side yard edge. */
export const YARD_PROP_ROW_DEPTH = 1.0
/** Spacing between neighbouring props in the row (≥ crate size + margin). */
export const YARD_PROP_SPACING = 1.3
/** Reserved profession rectangle (width × depth) at the far edge. */
export const YARD_PROFESSION_SIZE = { width: 3.0, depth: 2.0 } as const
/** Inset of the profession rectangle from the far yard edge. */
export const YARD_PROFESSION_INSET = 0.2
/** Width of the gate gap marker on a yard side edge (Q35 fences). */
export const YARD_GATE_WIDTH = 1.6

/** Yard depth (back wall → far edge) per settlement size. Calibrated on the
 *  census (`scripts/perf/census-house-yards.ts`); S may tune ±0.5 m. */
export const YARD_DEPTH: Record<VillageSize, number> = {
  OUTPOST: 4.0,
  SM: 4.5,
  MD: 5.0,
  LG: 5.0,
  XL: 5.5,
}

export type YardSlotName = 'barrel' | 'trough' | 'wood' | 'storage'
const SLOT_ORDER: readonly YardSlotName[] = ['barrel', 'trough', 'wood', 'storage']

export type YardPoint = { x: number, z: number }

/** World-space yard geometry attached to one house plot. */
export type HouseholdYardPlan = {
  /** Yard rectangle centre (world). */
  cx: number
  cz: number
  /** Yaw shared with the house (Three.js `rotation.y`). */
  yaw: number
  halfWidth: number
  halfDepth: number
  slots: {
    barrel: YardPoint
    trough: YardPoint
    wood: YardPoint
    storage: YardPoint
    /** Centre of the unconditional profession rectangle. */
    profession: YardPoint
    /** Centre of the gate gap on a yard side edge. */
    gate: YardPoint
  }
  /** Profession rectangle half extents (yard-local u / v). */
  professionHalf: { u: number, v: number }
}

/** Disc used by plan spacing checks (`VillagePlot.discs`). */
export type PlanDisc = { x: number, z: number, radius: number }

function hashBits(seed: number): number {
  let h = Math.imul((seed | 0) ^ 0x9e3779b9, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}

/** Rotate house-local `(x, z)` by `yaw` around `(ox, oz)` into world space. */
export function houseLocalToWorld(
  ox: number,
  oz: number,
  yaw: number,
  x: number,
  z: number,
): YardPoint {
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  return { x: ox + x * c + z * s, z: oz - x * s + z * c }
}

/**
 * Yaw (Three.js `rotation.y`) that points the house **front** (local `-z`,
 * the door side) along the world direction `(dx, dz)`.
 */
export function yawFacing(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz)
}

/**
 * Build the yard plan for a house at `(houseX, houseZ)` with `yaw`.
 * `variantSeed` only selects the left/right mirroring of the prop row and
 * the gate side (variety without overlap); everything else is fixed by the
 * footprint and settlement size.
 */
export function householdYardPlanFor(
  footprint: HouseYardFootprint,
  houseX: number,
  houseZ: number,
  yaw: number,
  size: VillageSize,
  variantSeed: number,
): HouseholdYardPlan {
  const bits = hashBits(variantSeed)
  const mirror = (bits & 1) === 0 ? 1 : -1
  const gateSide = (bits & 2) === 0 ? 1 : -1
  const depth = YARD_DEPTH[size]
  const halfWidth = footprint.width / 2 + YARD_SIDE_OVERHANG
  const halfDepth = depth / 2
  // House-local z of the yard's house-side edge.
  const nearZ = footprint.depth / 2 + YARD_BACK_GAP
  const at = (u: number, v: number): YardPoint => houseLocalToWorld(houseX, houseZ, yaw, u, nearZ + v)

  const rowStart = -((SLOT_ORDER.length - 1) * YARD_PROP_SPACING) / 2
  const slotPos = (name: YardSlotName): YardPoint => {
    const i = SLOT_ORDER.indexOf(name)
    return at(mirror * (rowStart + i * YARD_PROP_SPACING), YARD_PROP_ROW_DEPTH)
  }

  const professionHalf = { u: YARD_PROFESSION_SIZE.width / 2, v: YARD_PROFESSION_SIZE.depth / 2 }
  const center = at(0, halfDepth)
  return {
    cx: center.x,
    cz: center.z,
    yaw,
    halfWidth,
    halfDepth,
    slots: {
      barrel: slotPos('barrel'),
      trough: slotPos('trough'),
      wood: slotPos('wood'),
      storage: slotPos('storage'),
      profession: at(0, depth - YARD_PROFESSION_INSET - professionHalf.v),
      gate: at(gateSide * halfWidth, depth / 2),
    },
    professionHalf,
  }
}

/** Map a point to yard-local `(u, v)` (u across, v from the house-side edge). */
export function worldToYardLocal(yard: HouseholdYardPlan, x: number, z: number): { u: number, v: number } {
  const dx = x - yard.cx
  const dz = z - yard.cz
  const c = Math.cos(yard.yaw)
  const s = Math.sin(yard.yaw)
  // Inverse of houseLocalToWorld (pure rotation).
  return { u: dx * c - dz * s, v: dx * s + dz * c + yard.halfDepth }
}

/** True when `(x, z)` (grown by `margin`) lies inside the yard rectangle. */
export function pointInYard(yard: HouseholdYardPlan, x: number, z: number, margin = 0): boolean {
  const { u, v } = worldToYardLocal(yard, x, z)
  return (
    Math.abs(u) <= yard.halfWidth - margin &&
    v >= margin &&
    v <= yard.halfDepth * 2 - margin
  )
}

/** Spacing disc approximating the yard rectangle. */
export function yardDisc(yard: HouseholdYardPlan): PlanDisc {
  return { x: yard.cx, z: yard.cz, radius: Math.hypot(yard.halfWidth, yard.halfDepth) }
}
