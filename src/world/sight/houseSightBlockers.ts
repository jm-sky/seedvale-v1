import type { HouseDefinition, HouseOpening, HouseWallSide } from '../../assets/houseDefinitionExampleConfig'
import type { Collider } from '../collision'
import type { SightAperture, SightPanel } from './sightBlockers'
import {
  doorLeafColliderLocal,
  HOUSE_ASSEMBLY_SCALE,
  HOUSE_DOOR_OPENING_HALF_WIDTH_M,
  type HouseAssembly,
  matchingWallPlacement,
  transformHouseCollidersToWorld,
  WALL_HALF_DEPTH,
  WALL_HALF_WIDTH,
  wallModuleKey,
  wallModulePose,
} from '../../settlement/houseBuilder'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — sight blockers for one house (sibling of
 *  `buildHouseCollidersWorld`). Pure; reuses houseBuilder's wall/opening poses
 *  so sight geometry cannot drift from the visual/collider pose.
 */

/** Door leaf height (m, pre-scale): `door_1_flat` dimensions `[1.118, 2.1, 0.121]`
 *  (`megakitAudit.generated.json`). */
export const HOUSE_DOOR_LEAF_HEIGHT_M = 2.1

/**
 * Window cutout (module-local, centred on the wall module, pre-scale).
 * ASSUMPTION: the audit JSON only holds the window *fill* part bounds
 * (`window_wide_flat1`: x ±0.804, y 0.944–2.524; `window_thin_flat1`:
 * x ±0.405, y 0.975–2.533), not the wall cutout; the glass opening is taken
 * as those bounds shrunk by ~0.1 m of frame per side.
 */
export const HOUSE_WINDOW_WIDE_HALF_WIDTH_M = 0.7
export const HOUSE_WINDOW_THIN_HALF_WIDTH_M = 0.3
export const HOUSE_WINDOW_MIN_Y_M = 1.05
export const HOUSE_WINDOW_MAX_Y_M = 2.45

/** Roof slab (ASSUMPTION): a flat slab over the footprint standing in for the
 *  gable — `[wallTop, wallTop + HEIGHT]` with `OVERHANG` on every side. */
export const HOUSE_ROOF_SLAB_HEIGHT_M = 1.5
export const HOUSE_ROOF_SLAB_OVERHANG_M = 0.3

type LocalPanel = {
  collider: Extract<Collider, { type: 'obb' }>
  minY: number
  maxY: number
  apertures?: SightAperture[]
}

function windowHalfWidth(opening: HouseOpening): number {
  return opening.fillAssetId.includes('thin') ? HOUSE_WINDOW_THIN_HALF_WIDTH_M : HOUSE_WINDOW_WIDE_HALF_WIDTH_M
}

/**
 * Sight panels for a house in world space: one full-height panel per wall
 * module (door modules get a door aperture, window openings a window
 * aperture), a leaf panel per *closed* door, and a roof slab.
 * `worldY` is the house floor Y; `wallTopY` the local wall height (pre-scale).
 */
export function buildHouseSightBlockersWorld(
  def: HouseDefinition,
  worldX: number,
  worldY: number,
  worldZ: number,
  yaw: number,
  closedDoors: readonly boolean[],
  wallTopY: number,
  scale = HOUSE_ASSEMBLY_SCALE,
): SightPanel[] {
  const apertures = new Map<string, SightAperture[]>()
  const addAperture = (side: HouseWallSide, moduleIndex: number, a: SightAperture): void => {
    const key = wallModuleKey(side, moduleIndex)
    const list = apertures.get(key)
    if (list) list.push(a)
    else apertures.set(key, [a])
  }
  const leaves: LocalPanel[] = []
  let doorIndex = 0
  for (const opening of def.openings) {
    const wall = matchingWallPlacement(def, opening)
    if (opening.type === 'door') {
      addAperture(wall.side, wall.moduleIndex, {
        offsetX: 0,
        halfWidth: HOUSE_DOOR_OPENING_HALF_WIDTH_M,
        minY: -0.01,
        maxY: HOUSE_DOOR_LEAF_HEIGHT_M,
      })
      if (closedDoors[doorIndex]) {
        const leaf = doorLeafColliderLocal(def, opening)
        if (leaf.type === 'obb') leaves.push({ collider: leaf, minY: 0, maxY: HOUSE_DOOR_LEAF_HEIGHT_M })
      }
      doorIndex++
    } else {
      addAperture(wall.side, wall.moduleIndex, {
        offsetX: 0,
        halfWidth: windowHalfWidth(opening),
        minY: HOUSE_WINDOW_MIN_Y_M,
        maxY: HOUSE_WINDOW_MAX_Y_M,
      })
    }
  }

  const local: LocalPanel[] = []
  for (const wall of def.walls) {
    const pose = wallModulePose(def, wall)
    local.push({
      collider: {
        type: 'obb',
        x: pose.x,
        z: pose.z,
        halfWidth: WALL_HALF_WIDTH,
        halfDepth: WALL_HALF_DEPTH,
        rotationY: pose.rotationY,
      },
      minY: 0,
      maxY: wallTopY,
      apertures: apertures.get(wallModuleKey(wall.side, wall.moduleIndex)),
    })
  }
  local.push(...leaves)
  local.push({
    collider: {
      type: 'obb',
      x: 0,
      z: 0,
      halfWidth: def.footprint.width / 2 + HOUSE_ROOF_SLAB_OVERHANG_M,
      halfDepth: def.footprint.depth / 2 + HOUSE_ROOF_SLAB_OVERHANG_M,
      rotationY: 0,
    },
    minY: wallTopY,
    maxY: wallTopY + HOUSE_ROOF_SLAB_HEIGHT_M,
  })

  const world = transformHouseCollidersToWorld(local.map((p) => p.collider), worldX, worldZ, yaw, scale)
  const out: SightPanel[] = []
  for (let i = 0; i < local.length; i++) {
    const w = world[i]
    const p = local[i]!
    if (!w || w.type !== 'obb') continue
    out.push({
      kind: 'panel',
      x: w.x,
      z: w.z,
      halfWidth: w.halfWidth,
      halfDepth: w.halfDepth,
      rotationY: w.rotationY,
      minY: worldY + p.minY * scale,
      maxY: worldY + p.maxY * scale,
      ...(p.apertures
        ? {
            apertures: p.apertures.map((a) => ({
              offsetX: a.offsetX * scale,
              halfWidth: a.halfWidth * scale,
              minY: worldY + a.minY * scale,
              maxY: worldY + a.maxY * scale,
            })),
          }
        : {}),
    })
  }
  return out
}

/** Assembly convenience mirroring `buildAssemblyCollidersWorld`: live root
 *  pose and current door state (closed = leaf panel registered). */
export function buildAssemblySightBlockersWorld(assembly: HouseAssembly): SightPanel[] {
  const root = assembly.root
  return buildHouseSightBlockersWorld(
    assembly.definition,
    root.position.x,
    root.position.y,
    root.position.z,
    root.rotation.y,
    assembly.doors.map((door) => !door.isOpen()),
    assembly.wallTopY,
  )
}
