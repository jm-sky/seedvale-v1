import type { HeightSampler } from '../player/PlayerController'
import type { RiverChannelSegment } from '../terrain/chunkHeightmap'
import type { VillageSize } from './families'
import type { PlanDisc } from './householdYard'
import { createSeededRandom } from '../world/parseSeed'
import {
  CEMETERY_CLEARING_PAD,
  cemeteryGroundFits,
  projectIntoOwnerChunk,
} from './cemeteryFit'
import {
  cemeteryPlotDistanceToPoint,
  cemeteryPlotRadius,
  type CemeterySize,
  cemeterySizeForServedSizes,
} from './cemeteryLayout'
import { villageSizeConfig } from './families'

/**
 * Planner-side cemetery reservation (Q58 / Q44 R2): the settlement's own cemetery pose, chosen while every
 * house, yard and infrastructure plot is already placed and before sale plots and paths exist, so only
 * optional plots can ever lose space. Terrain placement (`cemeteryPlacement.ts`) reads it first and keeps the
 * old candidate search as a fallback. Pure data in/out — no Three.js, no terrain-side caches.
 * @domain settlements
 */

/** Cemetery band on the village footprint (kept equal to `CEMETERY_INNER_FRAC` / `CEMETERY_OUTER_FRAC`
 *  in `terrain/chunkEnvironment.ts`, which the terrain-side fringe rule uses). */
const BAND_INNER_FRAC = 0.55
const BAND_OUTER_FRAC = 1.05
const RINGS = 14
const BEARINGS = 24
/** Rolled scale range of every cemetery (same range as the terrain-side roll). */
const SCALE_MIN = 0.9
const SCALE_RANGE = 0.3
/** `terrain.chunkSize` default; terrain placement re-validates against the live value and falls back. */
export const DEFAULT_RESERVATION_CHUNK_SIZE = 64

/** Stable plot id of the reservation (`VillagePlot.id`). */
export const CEMETERY_PLOT_ID = 'plot-cemetery-0'

/** Lane id that serves the cemetery gate (`path-plot-<plot id>`); spurs never attach to its end. */
export const CEMETERY_LANE_ID = `path-plot-${CEMETERY_PLOT_ID}`

export type CemeteryReservationPose = {
  x: number
  z: number
  /** Three.js `rotation.y` — entrance (+Z local) faces the settlement centre. */
  rotationY: number
  size: CemeterySize
  scale: number
}

/** True for settlements that always get a reserved own cemetery: OUTPOST/MD/LG/XL (always dedicated) plus
 *  the home settlement at any size (author 2026-11-02 — its quests need the wife's grave). */
export function settlementReservesCemetery(size: VillageSize, isHome: boolean): boolean {
  return isHome || size !== 'SM'
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * First valid pose on the 0.55–1.05 R band (inner rings first), or `null` when nothing fits (the caller
 * then simply has no reservation and the terrain search runs as before). `existing` are the spacing discs
 * of every already placed plot.
 */
export function planCemeteryReservation(args: {
  size: VillageSize
  isHome: boolean
  center: { x: number, z: number }
  seedForCell: number
  existing: readonly PlanDisc[]
  sampleHeight: HeightSampler
  waterLevel: number
  riverSegments: readonly RiverChannelSegment[]
  chunkSize?: number
}): CemeteryReservationPose | null {
  const { size, isHome, center, seedForCell, existing, sampleHeight, waterLevel, riverSegments, chunkSize = DEFAULT_RESERVATION_CHUNK_SIZE } = args
  if (!settlementReservesCemetery(size, isHome)) return null
  const cemeterySize = cemeterySizeForServedSizes([size])
  const random = createSeededRandom(seedForCell ^ hashString('plot-cemetery-0'))
  const scale = SCALE_MIN + random() * SCALE_RANGE
  const baseAngle = random() * Math.PI * 2
  const plotRadius = cemeteryPlotRadius(cemeterySize, scale)
  const villageR = villageSizeConfig(size).footprintRadius
  const inner = villageR * BAND_INNER_FRAC
  const outer = villageR * BAND_OUTER_FRAC + plotRadius
  const ground = { heightAt: sampleHeight, waterLevel, riverSegments, chunkSize }

  for (let ring = 0; ring < RINGS; ring++) {
    const dist = inner + ((outer - inner) * ring) / (RINGS - 1)
    const offset = baseAngle + ring * 0.55
    for (let i = 0; i < BEARINGS; i++) {
      const angle = offset + (i / BEARINGS) * Math.PI * 2
      const rawX = center.x + Math.cos(angle) * dist
      const rawZ = center.z + Math.sin(angle) * dist
      // Same projection scheme as terrain placement: yaw from the raw point, clamp, re-yaw, clamp again.
      const yaw0 = Math.atan2(center.x - rawX, center.z - rawZ)
      const first = projectIntoOwnerChunk(rawX, rawZ, cemeterySize, scale, yaw0, chunkSize)
      const yaw = Math.atan2(center.x - first.x, center.z - first.z)
      const p = projectIntoOwnerChunk(rawX, rawZ, cemeterySize, scale, yaw, chunkSize)
      const pose: CemeteryReservationPose = { x: p.x, z: p.z, rotationY: yaw, size: cemeterySize, scale }
      const pd = Math.hypot(p.x - center.x, p.z - center.z)
      if (pd < inner || pd > outer) continue
      if (existing.some((d) => cemeteryPlotDistanceToPoint(pose, d.x, d.z) <= d.radius + CEMETERY_CLEARING_PAD)) continue
      if (!cemeteryGroundFits(pose, ground)) continue
      return pose
    }
  }
  return null
}
