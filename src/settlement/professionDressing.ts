import type { Role } from '../ai/characters'
import type { HouseDefinition, HouseOpening, HouseWallSide } from '../assets/houseDefinitionExampleConfig'
import type { FamilyDef } from './families'
import { HOUSE_MODULE_M } from '../assets/houseDefinitionExampleConfig'
import { createSeededRandom } from '../world/parseSeed'
import { type HouseholdYardPlan, houseLocalToWorld } from './householdYard'
import { representativeProfession } from './professionFamilySurnames'
import { isAdultAge } from './professionStaffing'

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
  /** Mount height of the piece centre above ground, m. */
  mountY: number
  /** Top of the piece, m (opening-overlap test in Y). */
  topY: number
}
type SlotKitSpec = { halfU: number, halfV: number }

/** Distance of a wall piece back from the exterior wall face (V3 `WALL_FACE_OFFSET_M`). */
export const WALL_FACE_OFFSET_M = 0.31
/** Door/window opening extents used for the overlap test. */
const OPENING_HALF_SPAN_M = 0.95
const DOOR_TOP_Y = 2.4
const WINDOW_BOTTOM_Y = 0.9
const WINDOW_TOP_Y = 2.3
/** Hard cap of wall pieces per house (plan §2.1 step 3). */
export const MAX_WALL_PIECES_PER_HOUSE = 3

export const WALL_KITS: Record<'antlers' | 'shield' | 'banner' | 'netOnWall', WallKitSpec> = {
  antlers: { halfAlong: 0.46, halfOut: 0.4, mountY: 2.9, topY: 3.64 },
  shield: { halfAlong: 0.34, halfOut: 0.2, mountY: 1.26, topY: 1.6 },
  banner: { halfAlong: 0.34, halfOut: 0.15, mountY: 1.15, topY: 1.7 },
  netOnWall: { halfAlong: 1.03, halfOut: 0.1, mountY: 0.85, topY: 1.5 },
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

/** Does a kit centred at `along` (metres from wall midpoint) clear all openings on `side`? */
export function wallKitFits(
  def: HouseDefinition,
  side: HouseWallSide,
  along: number,
  kit: WallKitSpec,
): boolean {
  const half = sideLength(def, side) / 2
  if (Math.abs(along) + kit.halfAlong > half - 0.15) return false
  for (const opening of def.openings as readonly HouseOpening[]) {
    if (opening.side !== side || opening.moduleIndex == null) continue
    const centre = moduleCentre(def, side, opening.moduleIndex)
    const overlapsX = Math.abs(along - centre) < OPENING_HALF_SPAN_M + kit.halfAlong
    if (!overlapsX) continue
    const bottom = opening.type === 'door' ? 0 : WINDOW_BOTTOM_Y
    const top = opening.type === 'door' ? DOOR_TOP_Y : WINDOW_TOP_Y
    const kitBottom = kit.mountY - (kit.topY - kit.mountY)
    if (kitBottom < top && kit.topY > bottom) return false
  }
  return true
}

function wallPose(def: HouseDefinition, side: HouseWallSide, along: number, kit: WallKitSpec) {
  const n = SIDE_NORMAL[side]
  const off = (side === 'front' || side === 'back' ? def.footprint.depth : def.footprint.width) / 2
    + WALL_FACE_OFFSET_M
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
  const used: { side: HouseWallSide, along: number, half: number }[] = []
  for (const { kit, role } of wallKits.slice(0, MAX_WALL_PIECES_PER_HOUSE)) {
    const spec = WALL_KITS[kit]
    const placed = placeWallKit(houseDef, spec, used, random)
    if (!placed) continue
    used.push({ side: placed.side, along: placed.along, half: spec.halfAlong })
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

function placeWallKit(
  def: HouseDefinition,
  spec: WallKitSpec,
  used: readonly { side: HouseWallSide, along: number, half: number }[],
  random: () => number,
): { side: HouseWallSide, along: number } | null {
  const jitter = (random() - 0.5) // seeded ±0.5 m
  for (const side of SIDE_ORDER) {
    const modules = Math.round(sideLength(def, side) / HOUSE_MODULE_M)
    for (let i = 0; i < modules; i++) {
      const along = moduleCentre(def, side, i) + jitter * 0.5
      if (!wallKitFits(def, side, along, spec)) continue
      if (used.some((u) => u.side === side && Math.abs(u.along - along) < u.half + spec.halfAlong + 0.05)) continue
      return { side, along }
    }
  }
  return null
}

/** Yard-local → world helper for tests/consumers that need footprint corners. */
export function slotKitCorners(placement: SlotDressingPlacement): { x: number, z: number }[] {
  const spec = SLOT_KITS[placement.kit]
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([su, sv]) =>
    houseLocalToWorld(placement.x, placement.z, placement.yaw, su! * spec.halfU, sv! * spec.halfV))
}
