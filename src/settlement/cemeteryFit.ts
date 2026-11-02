import type { RiverChannelSegment } from '../terrain/chunkHeightmap'
import { worldToChunk } from '../terrain/chunkGrid'
import { footprintOverlapsRiver } from '../terrain/riverNetwork'
import {
  CEMETERY_PIECE_HALF_EXTENTS,
  cemeteryCryptLayout,
  cemeteryLocalToWorld,
  cemeteryPlotExtents,
  cemeteryPlotRadius,
  type CemeterySize,
} from './cemeteryLayout'

/**
 * Pure physical fit of a cemetery plot on the ground (Q47 / Q58): owner-chunk fit, slope, river, water
 * clearance, plot and crypt height spread. Shared by terrain placement (`cemeteryPlacement.ts`) and the
 * village planner's cemetery reservation (`cemeteryReservation.ts`) so both apply the same rules.
 * Roads, clearings and the settlement fringe are NOT part of it — each caller owns those.
 */

const SLOPE_SAMPLE_STEP = 1.5
const SLOPE_REJECT_LANDMARK = 0.6
/** Slack between the plot rectangle and its owner chunk's edge (rendering samples the owner tile's apron). */
export const CEMETERY_CHUNK_EDGE_MARGIN = 0.5
/** Every sampled point of the plot must stand this far above the water level. */
const CEMETERY_WATER_CLEARANCE = 0.3
/** V2: maximum height spread across the (rotated 3×3 sampled) plot. */
const CEMETERY_MAX_PLOT_HEIGHT_SPREAD = 2.5
/** Maximum height spread across one crypt's four corners (the crypt is not tilted; it must not float/bury). */
const CEMETERY_MAX_CRYPT_HEIGHT_SPREAD = 0.8

/** Gap (m) a cemetery plot keeps from every clearing disk (terrain side) / plot disc (planner reservation). */
export const CEMETERY_CLEARING_PAD = 2

/** Ground data the fit reads — a terrain sampler plus world constants (chunk size is passed as data). */
export type CemeteryGround = {
  heightAt: (x: number, z: number) => number
  waterLevel: number
  riverSegments: readonly RiverChannelSegment[]
  chunkSize: number
}

export type CemeteryPlotPose = { x: number, z: number, rotationY: number, size: CemeterySize, scale: number }

/** Axis-aligned half-extents of the plot rectangle rotated by `rotationY`. */
export function rotatedPlotHalfExtents(size: CemeterySize, scale: number, rotationY: number): { ex: number, ez: number } {
  const { hw, hd } = cemeteryPlotExtents(size, scale)
  const c = Math.abs(Math.cos(rotationY))
  const s = Math.abs(Math.sin(rotationY))
  return { ex: c * hw + s * hd, ez: s * hw + c * hd }
}

export function cemeteryFitsOwnerChunk(
  x: number,
  z: number,
  size: CemeterySize,
  scale: number,
  rotationY: number,
  chunkSize: number,
): boolean {
  const owner = worldToChunk(x, z, chunkSize)
  const half = chunkSize / 2
  const { ex, ez } = rotatedPlotHalfExtents(size, scale, rotationY)
  const localX = x - owner.cx * chunkSize
  const localZ = z - owner.cz * chunkSize
  return Math.abs(localX) <= half - CEMETERY_CHUNK_EDGE_MARGIN - ex && Math.abs(localZ) <= half - CEMETERY_CHUNK_EDGE_MARGIN - ez
}

/** Deterministically clamps a candidate into its owner chunk's valid interior for the given yaw/size/scale
 *  instead of discarding it (an LG plot leaves only a ~22 m interior square in a 64 m chunk). */
export function projectIntoOwnerChunk(
  x: number,
  z: number,
  size: CemeterySize,
  scale: number,
  rotationY: number,
  chunkSize: number,
): { x: number, z: number } {
  const owner = worldToChunk(x, z, chunkSize)
  const { ex, ez } = rotatedPlotHalfExtents(size, scale, rotationY)
  // Tiny slack so a point clamped exactly onto the limit is not flipped by floating-point rounding in the fit check.
  const limitX = Math.max(0, chunkSize / 2 - CEMETERY_CHUNK_EDGE_MARGIN - 0.01 - ex)
  const limitZ = Math.max(0, chunkSize / 2 - CEMETERY_CHUNK_EDGE_MARGIN - 0.01 - ez)
  const cx = owner.cx * chunkSize
  const cz = owner.cz * chunkSize
  return {
    x: cx + Math.max(-limitX, Math.min(limitX, x - cx)),
    z: cz + Math.max(-limitZ, Math.min(limitZ, z - cz)),
  }
}

/** The plot's rotated 3×3 sample points (corners, edge midpoints, centre) in world space. */
function plotSamplePoints(pose: CemeteryPlotPose): { x: number, z: number }[] {
  const { hw, hd } = cemeteryPlotExtents(pose.size, pose.scale)
  const out: { x: number, z: number }[] = []
  for (const sz of [-1, 0, 1]) {
    for (const sx of [-1, 0, 1]) {
      out.push(cemeteryLocalToWorld(pose, sx * hw, sz * hd))
    }
  }
  return out
}

function slopeAt(ground: CemeteryGround, wx: number, wz: number): number {
  const d = SLOPE_SAMPLE_STEP
  return (
    (Math.abs(ground.heightAt(wx + d, wz) - ground.heightAt(wx - d, wz)) +
      Math.abs(ground.heightAt(wx, wz + d) - ground.heightAt(wx, wz - d))) /
    (2 * d)
  )
}

/** Owner-chunk fit + slope + river + water + plot/crypt height spread (see file doc). */
export function cemeteryGroundFits(pose: CemeteryPlotPose, ground: CemeteryGround): boolean {
  const { x, z, rotationY, size, scale } = pose
  if (!cemeteryFitsOwnerChunk(x, z, size, scale, rotationY, ground.chunkSize)) return false
  if (slopeAt(ground, x, z) > SLOPE_REJECT_LANDMARK) return false
  // Never on a river / stream: channels are carved below the sampled surface and may not read as water.
  if (ground.riverSegments.length > 0 && footprintOverlapsRiver(ground.riverSegments, x, z, cemeteryPlotRadius(size, scale))) {
    return false
  }
  // Water + height spread over a rotated 3×3 sample of the plot.
  let lo = Infinity
  let hi = -Infinity
  for (const p of plotSamplePoints(pose)) {
    const h = ground.heightAt(p.x, p.z)
    if (h <= ground.waterLevel + CEMETERY_WATER_CLEARANCE) return false
    lo = Math.min(lo, h)
    hi = Math.max(hi, h)
  }
  if (hi - lo > CEMETERY_MAX_PLOT_HEIGHT_SPREAD) return false
  // Crypts are not tilted: the four corners of each must be near-level.
  const crypt = CEMETERY_PIECE_HALF_EXTENTS.Crypt
  for (const c of cemeteryCryptLayout(size, scale)) {
    let cLo = Infinity
    let cHi = -Infinity
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
      const w = cemeteryLocalToWorld(pose, c.x + sx * crypt.hx * c.scale * scale, c.z + sz * crypt.hz * c.scale * scale)
      const h = ground.heightAt(w.x, w.z)
      cLo = Math.min(cLo, h)
      cHi = Math.max(cHi, h)
    }
    if (cHi - cLo > CEMETERY_MAX_CRYPT_HEIGHT_SPREAD) return false
  }
  return true
}
