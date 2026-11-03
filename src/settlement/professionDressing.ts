import type { Role } from '../ai/characters'
import type { HouseDefinition, HouseLampMount, HouseOpening, HouseWallSide } from '../assets/houseDefinitionExampleConfig'
import type { FamilyDef } from './families'
import { HOUSE_MODULE_M } from '../assets/houseDefinitionExampleConfig'
import { createSeededRandom } from '../world/parseSeed'
import { type HouseholdYardPlan, houseLocalToWorld } from './householdYard'
import { representativeProfession } from './professionFamilySurnames'
import { isAdultAge } from './professionStaffing'
import { LANTERN_WALL_MAX } from './propSpecs'

/**
 * @domain settlements-npcs
 *
 * Profession-signature home dressing (queue Q48 / Q42 plan §2.1) — pure,
 * Three.js-free deterministic projection of a household's generated
 * professions onto small wall pieces (house-local) and one freestanding
 * piece inside the yard's reserved profession rectangle. Not persisted and
 * not cached: it is derived at settlement build time from `def.families`
 * and the planned plots, like the blacksmith workplace.
 */

export type DressingKit =
  | 'antlers' | 'hidesFrame' | 'shield' | 'banner' | 'netOnWall' | 'dryingRack'
  | 'stumpWithAxe' | 'sacks' | 'handCart' | 'herbBed'

type WallKitSpec = {
  /** Half width along the wall, m. */
  halfAlong: number
  /** Half depth out of the wall, m. */
  halfOut: number
  /** Height of the GLB node origin above ground, m (placement). */
  mountY: number
  /** Lowest / highest point of the piece above ground, m (opening-overlap test in Y), measured from the pack. */
  bottomY: number
  topY: number
  /** Node-origin offset out of the wall face, m (V3 `mat4(0, y, z)`). */
  outZ: number
  /** Uniform model scale about the node origin (default 1); the extents above already include it. */
  scale?: number
}
type SlotKitSpec = { halfU: number, halfV: number }

/** Distance of the exterior wall face from the footprint line, per side. The MegaKit plaster module is
 *  asymmetric about its origin (z -0.314..+0.093) and `wallLocalTransform` rotates it so the thick side faces
 *  outward on front/back (0.314) but inward on left/right (exterior only 0.093) — measured from the GLB. */
export const WALL_FACE_OFFSET_M: Record<HouseWallSide, number> = { front: 0.314, back: 0.314, left: 0.093, right: 0.093 }
/** Fallback order for entrance kits when no preferred spot exists (shield: widest free gap on the door wall; banner: blank wall): nearest-to-door first. */
const NEAR_DOOR_KITS: ReadonlySet<keyof typeof WALL_KITS> = new Set(['banner', 'shield'])
/** Door/window opening extents used for the overlap test. */
/** Real cut-out half widths measured from the GLBs (door_flat 0.65, window_wide_flat 0.60) + a hair of clearance. */
const DOOR_HALF_SPAN_M = 0.67
const WINDOW_HALF_SPAN_M = 0.62
const DOOR_TOP_Y = 2.4
const WINDOW_BOTTOM_Y = 0.9
const WINDOW_TOP_Y = 2.3
/** Hard cap of wall pieces per house (plan §2.1 step 3). */
export const MAX_WALL_PIECES_PER_HOUSE = 3

export const WALL_KITS: Record<'antlers' | 'shield' | 'banner' | 'netOnWall', WallKitSpec> = {
  antlers: { halfAlong: 0.46, halfOut: 0.34, mountY: 1.95, bottomY: 1.95, topY: 2.69, outZ: -0.06 },
  // 1.3x the original (0.34/0.2/1.6±0.33/0.08); origin stays at the original height.
  shield: { halfAlong: 0.442, halfOut: 0.26, mountY: 1.6, bottomY: 1.171, topY: 2.029, outZ: 0.104, scale: 1.3 },
  banner: { halfAlong: 0.34, halfOut: 0.2, mountY: 2.59, bottomY: 1.15, topY: 2.59, outZ: 0.1 },
  netOnWall: { halfAlong: 1.03, halfOut: 0.11, mountY: 0, bottomY: 1.04, topY: 2.43, outZ: 0 },
}
export const SLOT_KITS: Record<'hidesFrame' | 'dryingRack' | 'stumpWithAxe' | 'sacks' | 'handCart' | 'herbBed', SlotKitSpec> = {
  hidesFrame: { halfU: 1.0, halfV: 0.4 },
  dryingRack: { halfU: 1.25, halfV: 0.27 },
  stumpWithAxe: { halfU: 0.5, halfV: 0.45 },
  sacks: { halfU: 0.55, halfV: 0.4 },
  handCart: { halfU: 1.2, halfV: 0.5 },
  herbBed: { halfU: 1.0, halfV: 0.5 },
}

type ProfessionRow = {
  wall: readonly (keyof typeof WALL_KITS)[]
  slot: keyof typeof SLOT_KITS | null
}

/** Selected professions only (author 2026-10-31); other roles stay undressed. */
const PROFESSION_TABLE: Partial<Record<Role, ProfessionRow>> = {
  hunter: { wall: ['antlers'], slot: 'hidesFrame' },
  guard: { wall: ['shield', 'banner'], slot: null },
  fisher: { wall: ['netOnWall'], slot: 'dryingRack' },
  woodcutter: { wall: [], slot: 'stumpWithAxe' },
  farmer: { wall: [], slot: 'sacks' },
  trader: { wall: [], slot: 'handCart' },
  herbalist: { wall: [], slot: 'herbBed' },
}

const DRESSING_SALT = 0x44524553

export type WallDressingPlacement = {
  id: string
  kind: 'wall'
  kit: keyof typeof WALL_KITS
  role: Role
  side: HouseWallSide
  /** House-local position of the piece centre (back on the wall face). */
  x: number
  y: number
  z: number
  /** Outward normal of the wall in house-local coordinates. */
  normal: { x: number, z: number }
}

export type SlotDressingPlacement = {
  id: string
  kind: 'slot'
  kit: keyof typeof SLOT_KITS
  role: Role
  /** World position (centre of the profession rectangle). */
  x: number
  z: number
  /** World yaw, aligned with the yard. */
  yaw: number
}

export type DressingPlacement = WallDressingPlacement | SlotDressingPlacement

const SIDE_NORMAL: Record<HouseWallSide, { x: number, z: number }> = {
  front: { x: 0, z: -1 }, back: { x: 0, z: 1 }, left: { x: -1, z: 0 }, right: { x: 1, z: 0 },
}

function sideLength(def: HouseDefinition, side: HouseWallSide): number {
  return side === 'front' || side === 'back' ? def.footprint.width : def.footprint.depth
}

/** Centre of module `index` along `side`, measured from the wall midpoint. */
function moduleCentre(def: HouseDefinition, side: HouseWallSide, index: number): number {
  return -sideLength(def, side) / 2 + HOUSE_MODULE_M / 2 + HOUSE_MODULE_M * index
}

/** Something already occupying a wall face: `along` is the centre (m from the wall midpoint),
 *  `half` its half width, `bottomY..topY` its vertical extent. Openings are handled separately. */
export type WallObstacle = { side: HouseWallSide, along: number, half: number, bottomY: number, topY: number }

/** Clearance kept around an obstacle, m. */
const OBSTACLE_MARGIN_M = 0.05
/** Authored wall-lantern extents (`lantern_wall.glb`: 0.24 wide, 0.25 above / 0.48 below the mount), at the in-game fit scale. */
const LANTERN_WALL_K = LANTERN_WALL_MAX / 0.73
const LANTERN_HALF_ALONG_M = 0.12 * LANTERN_WALL_K
const LANTERN_ABOVE_M = 0.25 * LANTERN_WALL_K
const LANTERN_BELOW_M = 0.48 * LANTERN_WALL_K

/** Mount used by the house builder when a definition has no lamp (single source for `props.ts`). */
export function houseLampMountFor(def: HouseDefinition): HouseLampMount {
  return def.lamp?.mount ?? { x: def.footprint.width * 0.25, y: 1.85, z: -def.footprint.depth / 2 - 0.12 }
}

/** The exterior wall lantern as a wall obstacle (`null` for a standing/floor lamp). Pure + deterministic. */
export function lampWallObstacle(def: HouseDefinition): WallObstacle | null {
  if ((def.lamp?.style ?? 'wall') !== 'wall') return null
  const m = houseLampMountFor(def)
  const nx = Math.abs(m.x) / (def.footprint.width / 2)
  const nz = Math.abs(m.z) / (def.footprint.depth / 2)
  const side: HouseWallSide = nz >= nx ? (m.z < 0 ? 'front' : 'back') : (m.x < 0 ? 'left' : 'right')
  return {
    side,
    along: nz >= nx ? m.x : m.z,
    half: LANTERN_HALF_ALONG_M,
    bottomY: m.y - LANTERN_BELOW_M,
    topY: m.y + LANTERN_ABOVE_M,
  }
}

function overlapsObstacle(side: HouseWallSide, along: number, kit: WallKitSpec, o: WallObstacle): boolean {
  return o.side === side
    && Math.abs(along - o.along) < o.half + kit.halfAlong + OBSTACLE_MARGIN_M
    && kit.bottomY < o.topY + OBSTACLE_MARGIN_M
    && kit.topY > o.bottomY - OBSTACLE_MARGIN_M
}

/** Does a kit centred at `along` (metres from wall midpoint) clear all openings (and `obstacles`) on `side`? */
export function wallKitFits(
  def: HouseDefinition,
  side: HouseWallSide,
  along: number,
  kit: WallKitSpec,
  obstacles: readonly WallObstacle[] = [],
): boolean {
  const half = sideLength(def, side) / 2
  if (Math.abs(along) + kit.halfAlong > half - 0.15) return false
  if (obstacles.some((o) => overlapsObstacle(side, along, kit, o))) return false
  for (const opening of def.openings as readonly HouseOpening[]) {
    if (opening.side !== side || opening.moduleIndex == null) continue
    const centre = moduleCentre(def, side, opening.moduleIndex)
    const overlapsX = Math.abs(along - centre) < (opening.type === 'door' ? DOOR_HALF_SPAN_M : WINDOW_HALF_SPAN_M) + kit.halfAlong
    if (!overlapsX) continue
    const bottom = opening.type === 'door' ? 0 : WINDOW_BOTTOM_Y
    const top = opening.type === 'door' ? DOOR_TOP_Y : WINDOW_TOP_Y
    if (kit.bottomY < top && kit.topY > bottom) return false
  }
  return true
}

function wallPose(def: HouseDefinition, side: HouseWallSide, along: number, kit: WallKitSpec) {
  const n = SIDE_NORMAL[side]
  const off = (side === 'front' || side === 'back' ? def.footprint.depth : def.footprint.width) / 2
    + WALL_FACE_OFFSET_M[side]
  // tangent along the wall in house-local axes
  const t = side === 'front' || side === 'back' ? { x: 1, z: 0 } : { x: 0, z: 1 }
  return { x: n.x * off + t.x * along, y: kit.mountY, z: n.z * off + t.z * along }
}

const SIDE_ORDER: readonly HouseWallSide[] = ['front', 'left', 'right', 'back']

/** Profession ranking among adults, strongest first, deduplicated. */
function dressedProfessions(family: FamilyDef): Role[] {
  const primary = representativeProfession(family)
  if (primary === null) return []
  const roles: Role[] = [primary]
  for (const member of family.members) {
    if (!isAdultAge(member.age)) continue
    const role = member.character.role
    if (!roles.includes(role) && PROFESSION_TABLE[role]) roles.push(role)
  }
  return roles
}

/**
 * Dressing for one household. `hasBlacksmith` keeps the yard slot for the
 * blacksmith workplace, so only wall pieces are produced for such homes.
 * Deterministic: equal input → equal output, own seed stream.
 */
export function professionDressingFor(
  family: FamilyDef,
  familyIndex: number,
  houseDef: HouseDefinition,
  yard: HouseholdYardPlan | undefined,
  seed: number,
): DressingPlacement[] {
  const roles = dressedProfessions(family)
  if (roles.length === 0) return []
  const hasBlacksmith = family.members.some((m) => m.character.role === 'blacksmith')
  const random = createSeededRandom(seed ^ DRESSING_SALT ^ Math.imul(familyIndex + 1, 0x9e3779b1))
  const out: DressingPlacement[] = []
  let n = 0
  const nextId = () => `dressing-${familyIndex}-${n++}`

  // Wall pieces: primary profession first, then one piece of the next different profession.
  const wallKits: { kit: keyof typeof WALL_KITS, role: Role }[] = []
  const primaryRow = PROFESSION_TABLE[roles[0]!]
  for (const kit of primaryRow?.wall ?? []) wallKits.push({ kit, role: roles[0]! })
  for (const role of roles.slice(1)) {
    const kit = PROFESSION_TABLE[role]?.wall[0]
    if (kit) { wallKits.push({ kit, role }); break }
  }
  // Occupied wall space: the exterior lantern first, then every piece placed so far.
  const used: WallObstacle[] = []
  const lamp = lampWallObstacle(houseDef)
  if (lamp) used.push(lamp)
  for (const { kit, role } of wallKits.slice(0, MAX_WALL_PIECES_PER_HOUSE)) {
    const spec = WALL_KITS[kit]
    const placed = placeWallKit(houseDef, kit, spec, used, random)
    if (!placed) continue
    used.push({ side: placed.side, along: placed.along, half: spec.halfAlong, bottomY: spec.bottomY, topY: spec.topY })
    const pose = wallPose(houseDef, placed.side, placed.along, spec)
    out.push({ id: nextId(), kind: 'wall', kit, role, side: placed.side, ...pose, normal: SIDE_NORMAL[placed.side] })
  }

  // Slot piece (not for blacksmith homes).
  if (yard && !hasBlacksmith) {
    for (const role of roles) {
      const slot = PROFESSION_TABLE[role]?.slot
      if (!slot) continue
      const spec = SLOT_KITS[slot]
      if (spec.halfU > yard.professionHalf.u || spec.halfV > yard.professionHalf.v) continue
      const c = yard.slots.profession
      out.push({ id: nextId(), kind: 'slot', kit: slot, role, x: c.x, z: c.z, yaw: yard.yaw })
      break
    }
  }
  return out
}

/** Resolution (m) of the free-gap search used for the entrance shield. */
const GAP_SCAN_STEP_M = 0.01
/** Free-scan step (m) used once no module-centred spot is free. */
const FALLBACK_SCAN_STEP_M = 0.25
/** Entrance kits scan finely: the gap between a door and the next window is only ~0.75 m for a 0.68 m shield. */
const NEAR_DOOR_SCAN_STEP_M = 0.01

/** Candidate spots, best first: jittered module centres per side (original behaviour), then a fine
 *  deterministic scan of every wall so a free stretch is found before a piece is dropped. */
function wallCandidates(
  def: HouseDefinition,
  jitter: number,
  kit: keyof typeof WALL_KITS,
): { side: HouseWallSide, along: number }[] {
  const out: { side: HouseWallSide, along: number }[] = []
  for (const side of SIDE_ORDER) {
    const modules = Math.round(sideLength(def, side) / HOUSE_MODULE_M)
    for (let i = 0; i < modules; i++) out.push({ side, along: moduleCentre(def, side, i) + jitter * 0.5 })
  }
  for (const side of SIDE_ORDER) {
    const half = sideLength(def, side) / 2
    const step = NEAR_DOOR_KITS.has(kit) ? NEAR_DOOR_SCAN_STEP_M : FALLBACK_SCAN_STEP_M
    for (let a = -half; a <= half + 1e-9; a += step) out.push({ side, along: a })
  }
  if (NEAR_DOOR_KITS.has(kit)) {
    // Entrance dressing: one list, nearest to the door first (stable sort keeps the order above on ties).
    const door = doorPoint(def)
    if (door) {
      const dist = (c: { side: HouseWallSide, along: number }) => {
        const p = wallPose(def, c.side, c.along, WALL_KITS[kit])
        return Math.hypot(p.x - door.x, p.z - door.z)
      }
      return out.map((c) => ({ c, d: dist(c) })).sort((a, b) => a.d - b.d).map((e) => e.c)
    }
  }
  return out
}

/** House-local centre of the first door (on its wall line), or `null` when there is none. */
function doorPoint(def: HouseDefinition): { x: number, z: number } | null {
  const door = (def.openings as readonly HouseOpening[]).find((o) => o.type === 'door' && o.side != null && o.moduleIndex != null)
  if (!door?.side || door.moduleIndex == null) return null
  const p = wallPose(def, door.side, moduleCentre(def, door.side, door.moduleIndex), WALL_KITS.shield)
  return { x: p.x, z: p.z }
}

function wallHasOpenings(def: HouseDefinition, side: HouseWallSide): boolean {
  return (def.openings as readonly HouseOpening[]).some((o) => o.side === side && o.moduleIndex != null)
}

/** Centre of the longest stretch of `side` where `spec` fits (the middle of the free gap), or `null`. */
function widestGapCentre(
  def: HouseDefinition,
  side: HouseWallSide,
  spec: WallKitSpec,
  used: readonly WallObstacle[],
): number | null {
  const half = sideLength(def, side) / 2
  const steps = Math.round((2 * half) / GAP_SCAN_STEP_M)
  let best: { start: number, end: number } | null = null
  let run: { start: number, end: number } | null = null
  for (let i = 0; i <= steps; i++) {
    if (wallKitFits(def, side, -half + i * GAP_SCAN_STEP_M, spec, used)) {
      run = run ? { start: run.start, end: i } : { start: i, end: i }
      if (!best || run.end - run.start > best.end - best.start) best = run
    } else {
      run = null
    }
  }
  return best ? -half + ((best.start + best.end) / 2) * GAP_SCAN_STEP_M : null
}

function placeWallKit(
  def: HouseDefinition,
  kit: keyof typeof WALL_KITS,
  spec: WallKitSpec,
  used: readonly WallObstacle[],
  random: () => number,
): { side: HouseWallSide, along: number } | null {
  const jitter = (random() - 0.5) // seeded ±0.5 m
  if (kit === 'shield' || kit === 'antlers') {
    // Entrance kits share one spot: the centre of the widest free gap (for the shield's footprint) on the
    // door wall; antlers hang at the same spot, higher up.
    const door = (def.openings as readonly HouseOpening[]).find((o) => o.type === 'door' && o.side != null)
    const along = door?.side ? widestGapCentre(def, door.side, WALL_KITS.shield, used) : null
    if (door?.side && along !== null && wallKitFits(def, door.side, along, spec, used)) return { side: door.side, along }
  }
  if (kit === 'banner') {
    // Prefer a wall with no openings at all, hung at its middle (windows/door stay uncluttered).
    for (const side of SIDE_ORDER) {
      if (wallHasOpenings(def, side)) continue
      if (wallKitFits(def, side, 0, spec, used)) return { side, along: 0 }
    }
  }
  for (const c of wallCandidates(def, jitter, kit)) {
    if (wallKitFits(def, c.side, c.along, spec, used)) return c
  }
  return null
}

/** Yard-local → world helper for tests/consumers that need footprint corners. */
export function slotKitCorners(placement: SlotDressingPlacement): { x: number, z: number }[] {
  const spec = SLOT_KITS[placement.kit]
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([su, sv]) =>
    houseLocalToWorld(placement.x, placement.z, placement.yaw, su! * spec.halfU, sv! * spec.halfV))
}
