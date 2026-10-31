import { type HouseholdYardPlan, houseLocalToWorld, worldToYardLocal } from './householdYard'

/**
 * @domain settlements-npcs
 *
 * Blacksmith household-yard workplace geometry (plan settlements-npcs-024,
 * relocated by Q41 / Q34 plan §2.10) — pure geometry only, no Three.js or
 * runtime state. The compact anvil + grind-workbench + NPC access-anchor
 * arrangement lives inside the yard's unconditional `profession` rectangle
 * (`householdYard.ts`, 3.0 × 2.0 m at the far edge), so the side lanes and
 * the gate gap stay free for fences (Q35). The anchor sits on the gate side.
 */

/** Anvil offset from the profession-rectangle centre (yard-local `u`),
 *  mirrored away from the gate so the anchor side has room. */
const ANVIL_U = 0.2
/** Anvil → grind-workbench offset (yard-local), the original arrangement
 *  (plan settlements-npcs-002: center-to-center distance ≈1.08 m). */
const WORKBENCH_OFFSET = { u: 1.0, v: 0.4 }
/** Anvil → NPC-access-anchor offset (yard-local `u`), toward the gate and
 *  opposite the workbench, so the approach never crosses either prop. */
const ANCHOR_U = 1.1

export type BlacksmithYardGeometry = {
  anvil: { x: number, z: number }
  workbench: { x: number, z: number }
  /** NPC work/access point — reachable free space beside the equipment. */
  anchor: { x: number, z: number }
}

/**
 * One household's blacksmith workplace geometry, derived from its yard plan.
 * Deterministic — same yard always produces the same output.
 */
export function blacksmithYardGeometry(yard: HouseholdYardPlan): BlacksmithYardGeometry {
  const gateSide = worldToYardLocal(yard, yard.slots.gate.x, yard.slots.gate.z).u >= 0 ? 1 : -1
  const origin = yard.slots.profession
  // Yard-local (u across, v back→far) offsets rotate by the house yaw
  // exactly like house-local (x, z).
  const at = (du: number, dv: number): { x: number, z: number } => {
    const o = houseLocalToWorld(0, 0, yard.yaw, du * gateSide, dv)
    return { x: origin.x + o.x, z: origin.z + o.z }
  }
  return {
    anvil: at(-ANVIL_U, 0),
    workbench: at(-ANVIL_U - WORKBENCH_OFFSET.u, WORKBENCH_OFFSET.v),
    anchor: at(-ANVIL_U + ANCHOR_U, 0),
  }
}
