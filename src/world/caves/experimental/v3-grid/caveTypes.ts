/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/world/types.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Extracted WorldWindow, CaveSize, GenCaveBranch, GenCave and the Mountain biome id; definitions unchanged.
 * Inactive: do not import from production code. See README.md.
 */
/** V3 biome id read by cave placement; other biome ids are intentionally omitted. */
export const Biome = { Mountain: 8 } as const

/** A square sampling window of the world: origin, size and grid spacing, in world metres. */
export interface WorldWindow {
  x0: number
  z0: number
  sizeM: number
  cellM: number
  /** Vertices per side: sizeM / cellM + 1. */
  n: number
}

export type CaveSize = 'small' | 'medium' | 'large'

/** A dead-end side branch of a large cave (D-M2-22): leaves the main route at spine point `from`. */
export interface GenCaveBranch {
  /** Index (point index, not float offset) of the junction point in `spine`. */
  from: number
  /** Flat [x, z, r, ...] points of the branch after the junction, same layout as `spine`. */
  pts: number[]
}

/**
 * Cave (WORLD-05): a tunnel/chamber chain entered through a cutting in a mountain slope. Only this compact
 * descriptor is generated and cached; floor/ceiling grids are derived on demand (`world/caveShape.ts`).
 * Ported from SeedVales v2 world/types.ts (GenCave, lines 184-203).
 */
export interface GenCave {
  id: string
  /** English proper name, e.g. "Wolfmaw Cave". */
  name: string
  size: CaveSize
  /** Entrance (start of the spine) and the direction into the mountain (radians, atan2(dx, dz)). */
  x: number
  z: number
  yaw: number
  /** Floor height at the entrance (m); the floor descends from here along the spine. */
  y0: number
  /** Flat [x, z, radius, …] spine points ~6 m apart; a radius above the tunnel radius marks a chamber. The main route. */
  spine: number[]
  /** Dead-end side branches (D-M2-22); only large caves have them. Absent on small and medium caves. */
  branches?: GenCaveBranch[]
}
