/**
 * Surface-world water vs the space the player currently occupies.
 *
 * `ChunkManager.waterLevel` is a single ocean/river plane. A cave chamber
 * below that plane is not flooded: rock separates the void from the sea.
 * The swim path snaps feet to `waterLevel` / outdoor `sampleFloor`, so it
 * must not own vertical motion while cave ground still resolves a closed
 * interval — even if strict occupancy is briefly false (floor grace /
 * quantization / a centimetre below the floor).
 *
 * Open-sky mouth/approach pits still see world water (a flooded entrance).
 * True underground water needs its own occupancy later — this helper is the
 * seam, not a permanent "no swimming in caves" ban.
 *
 * @domain items-player
 */

export const MAX_SWIM_DEPTH = 1.2

export type WorldWaterOccupancy = {
  openSky?: boolean
} | null

export type WorldWaterEligibilityInput = {
  /** Strict cave occupancy at the player's Y. May be `null` on a floor boundary. */
  occupancy: WorldWaterOccupancy
  /**
   * Rock ceiling from the resolved cave ground query (`source` cave/hysteresis).
   * `null` means outdoor or an open-sky pit (the gameplay adapter strips
   * openSky ceilings). A real number means overburden between the player
   * and the outdoor surface.
   */
  caveCeiling: number | null
}

/**
 * Whether the global water plane may own vertical motion at this sample.
 *
 * Closed cave *ground* wins over occupancy: if queryGround still owns the
 * column with a rock ceiling, outdoor water is on the other side of that
 * roof. Occupancy-only false must not reopen surface swim.
 */
export function worldWaterAppliesInCurrentSpace(input: WorldWaterEligibilityInput): boolean {
  if (input.caveCeiling != null) return false
  if (input.occupancy && input.occupancy.openSky !== true) return false
  return true
}

/** Feet Y while the swim path owns vertical motion (deep water caps at `MAX_SWIM_DEPTH`). */
export function swimFeetY(waterLevel: number, terrainFloorY: number): number {
  const depth = Math.min(waterLevel - terrainFloorY, MAX_SWIM_DEPTH)
  return waterLevel - depth
}

/**
 * Water depth (surface − bed) at which the player starts swimming (IMP-003).
 * Shallower water — streams, fords, lake/sea margins — is waded: normal
 * grounded locomotion with feet on the bed. Distinct from `MAX_SWIM_DEPTH`,
 * which only caps how deep a swimmer visually sinks.
 */
export const SWIM_ENTER_DEPTH = 1.2

/**
 * Depth below which a swimmer stands up again. 0.2 m under the entry depth:
 * larger than per-frame bed/bank noise at sprint speed, so lap sound and
 * swim/walk animation cannot flicker on the threshold, yet small enough that
 * leaving deep water does not feel sticky.
 */
export const SWIM_EXIT_DEPTH = SWIM_ENTER_DEPTH - 0.2

/** Swim/wade classification with hysteresis. `wasSwimming` is the previous
 *  *swimming* state (not mere water presence). */
export function nextSwimming(wasSwimming: boolean, depth: number): boolean {
  return depth >= (wasSwimming ? SWIM_EXIT_DEPTH : SWIM_ENTER_DEPTH)
}

/**
 * Feet Y while wading (water owns the column but depth is below swim depth).
 * Lake/ocean terrain heights are clamped to the water plane, so a clamped
 * ground (`>= surface`) is replaced by the true bed; river channels are
 * carved into the ground itself, which stays authoritative.
 */
export function wadeFeetY(groundHeight: number, waterSurfaceHeight: number, floorHeight: number): number {
  return groundHeight >= waterSurfaceHeight ? floorHeight : groundHeight
}
