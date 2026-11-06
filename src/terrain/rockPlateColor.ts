import { Color } from 'three'
import { rockPlateAt, rockPlateZoneOf } from './rockPlates'

/** Cool light-grey granite, clearly distinct from the warm-brown `ROCK` of the surrounding ridge colour. */
const PLATE_DARK = new Color(0x7d8086)
const PLATE_LIGHT = new Color(0xb4b7bc)
const PLATE_SNOW_MIX = new Color(0xdfe6ee)
const scratch = new Color()

/**
 * Colours bare-rock plates (plan 060 R3 correction 7): recomputes the same plate the height sampler used (pure function of
 * world position + the reported ridge) and blends the vertex colour to a light grey with per-plate/facet tone variation;
 * high plates pick up a little snow white. No-op outside the rock zone.
 */
export function applyRockPlateColor(
  color: Color,
  seed: number,
  wx: number,
  wz: number,
  mountainRidge: number,
  height: number,
  waterLevel: number,
): void {
  const zone = rockPlateZoneOf(mountainRidge)
  if (zone <= 0 || height <= waterLevel + 1.5) return
  const plate = rockPlateAt(seed, wx, wz, zone)
  if (plate.patch <= 0) return
  scratch.copy(PLATE_DARK).lerp(PLATE_LIGHT, plate.tone)
  const snow = Math.max(0, Math.min(1, (height - waterLevel - 45) / 40)) * 0.5
  if (snow > 0) scratch.lerp(PLATE_SNOW_MIX, snow)
  color.lerp(scratch, plate.patch * 0.92)
}
