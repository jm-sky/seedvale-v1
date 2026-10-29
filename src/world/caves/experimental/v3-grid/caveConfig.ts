/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/config/world.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Extracted CAVE, cave placement constants and SEA_LEVEL; values unchanged.
 * Inactive: do not import from production code. See README.md.
 */
/** Heights below this are sea. */
export const SEA_LEVEL = 0

/**
 * Caves (WORLD-05). All metres. `cell` is the cave grid resolution; `block` the terrain-hole granularity
 * (= the LOD-0 terrain quad). Tunnel/chamber heights leave room for the third-person camera (target +1.6 m).
 * Copied verbatim from SeedVales v2 config/calibration.ts (CAVE block, lines 389-409).
 */
export const CAVE = {
  cell: 1,
  block: 2,
  tunnelRadius: 2,
  chamberRadius: [5, 7] as const,
  tunnelHeight: 3.8,
  chamberHeight: 5.6,
  /** Rock that must stay above a roofed cell; shallower cells are open to the sky (the entrance cutting). */
  minCover: 1.2,
  /** Floor descent per metre of tunnel while it is still below the first {@link maxDepth} metres. */
  rampSlope: 0.24,
  maxDepth: 7,
  /** Safety margin: the generator assumes the surface is this much lower than the grid says (micro-detail). D-M2-22: stays 0.8; roof cover is validated against the runtime surface (caveIsValid). */
  surfaceMargin: 0.8,
  /** Longest cutting (tunnel length that may still be open to the sky). */
  maxCuttingM: 26,
  /** Steepest floor step (m) the player may climb between neighbouring cells; also the mouth tolerance. */
  stepM: 0.8,
  /** Render streaming distance (m). */
  showM: 260,
  /** Large caves (D-M2-22): the main corridor's tunnel radius is the tunnel radius times a value drawn from this range. */
  mainRadiusScale: [1.4, 1.6] as const,
  /** Large caves (D-M2-22): radius range (m) of the main corridor's chambers. */
  mainChamberRadius: [7, 9] as const,
  /** Ceiling height (m) of a large cave's chamber of radius 7 m and more (D-M2-22); `clearanceFor` grows linearly from `chamberHeight` at r 5 to here at r 7. */
  bigChamberHeight: 8,
  /** Large caves (D-M2-22): dead-end side branches, one per junction, on the main corridor. */
  junctionCount: 2,
  /** Large caves (D-M2-22): side chambers at the end of each side branch. */
  branchChambers: 1,
} as const

/** Sandbox caves (S3): minimum distance between two cave entrances (m); v2 uses 450 m for the whole continent. */
export const SANDBOX_CAVE_MIN_SPACING_M = 150
/** Sandbox caves (S3): no spine point may come closer than this to the scene window edge (m). */
export const SANDBOX_CAVE_EDGE_MARGIN_M = 48

/** Continent (M2 S1): minimum distance between two cave entrances (m); v2 uses 450 m. Scene windows keep the sandbox value. */
export const CAVE_MIN_SPACING_M = 450
/** Continent (M2 S1): number of caves placed on the whole continent (🟡 decision, tune from shots). */
export const CONTINENT_CAVE_COUNT = 12
