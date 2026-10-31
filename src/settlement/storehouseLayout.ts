import { houseLocalToWorld, type YardPoint } from './householdYard'

/**
 * Pure, Three.js-free geometry of the settlement storehouse compound
 * (plan Q43 / Q36): loading-bay slots outside the shell and the free
 * interior floor rectangle. The planner stores the result on
 * `VillagePlot.storehouse`; props/NPC code only consume it.
 *
 * House-local axes as in `householdYard.ts`: the door is on local `-z`,
 * footprint width runs along `x`.
 *
 * @domain settlements
 */

/** Loading-bay slots per storehouse (NPCs pick one by a stable hash of their id). */
export const STOREHOUSE_BAY_SLOTS = 3
/** Distance of a bay slot from the wall it serves. */
export const STOREHOUSE_BAY_OFFSET = 1.0
/** Spacing between neighbouring bay slots. */
export const STOREHOUSE_BAY_SPACING = 1.6
/** Extra radius of the plot disc around the shell for bay + apron. */
export const STOREHOUSE_APRON = 1.5
/** Interior floor kept free of goods (centre of the shell), metres. */
export const STOREHOUSE_FREE_FLOOR = { width: 4, depth: 2 } as const

export type StorehouseLayout = {
  /** World-space loading-bay slots, index 0 is `landmarks.settlementStorage`. */
  baySlots: YardPoint[]
}

/**
 * Bay slots run along the shell's **right end wall** (local `+x`): the 6 m
 * long walls are the door wall and the back wall, so the 4 m end wall is the
 * longest wall that is not the door wall and faces neither the plaza nor
 * the back. Slot 0 is the middle one (nearest the door-side corner would
 * crowd the entrance).
 */
export function storehouseLayoutFor(
  footprint: { width: number, depth: number },
  x: number,
  z: number,
  yaw: number,
): StorehouseLayout {
  const lx = footprint.width / 2 + STOREHOUSE_BAY_OFFSET
  const lzs = [0, -STOREHOUSE_BAY_SPACING, STOREHOUSE_BAY_SPACING]
  return { baySlots: lzs.slice(0, STOREHOUSE_BAY_SLOTS).map((lz) => houseLocalToWorld(x, z, yaw, lx, lz)) }
}

/** Stable bay slot index for an NPC id (`hash(npcId) % slots`). */
export function storehouseBaySlotFor(npcId: string, slotCount: number): number {
  if (slotCount <= 1) return 0
  let h = 0x811c9dc5
  for (let i = 0; i < npcId.length; i++) {
    h ^= npcId.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) % slotCount
}
