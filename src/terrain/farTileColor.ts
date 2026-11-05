import { Color } from 'three'
import type { RawSampleParams, RawTexelSample } from './chunkHeightmap'
import {
  applyMicroTint,
  applyMountainRock,
  applyOceanDepthTint,
  applySlopeRock,
  colorForTerrain,
  sandBandAt,
} from './biomeColors'
import { biomeWeightsAt } from './biomeRegions'
import { isFloorBelowSea } from './terrainClassification'
import { isWetFloor } from './waterSurface'

/** Flat colour of a lake surface seen from afar (deep-water tone; no shader water in the far band). */
const LAKE_WATER = new Color(0x2a5668)

/** True when a raw sample is a lake (wet, floor above the sea): the far mesh draws its surface, not its bed. */
export function isFarLake(texel: RawTexelSample, params: RawSampleParams): boolean {
  return !isFloorBelowSea(texel.floorH, params.waterLevel) && isWetFloor(texel.h, texel.floorH)
}

/**
 * Vertex colour of one far-terrain sample, from the same palette functions the streamed terrain uses
 * (`chunkMeshData.ts`; no second palette): biome × height, slope rock, mountain rock/snow, ocean depth tint, micro
 * tint. Road/scorch tints are streamed-only. `height` is the far render height (seabed for sea), `steepness` = 1 − n.y.
 *
 * @domain world-terrain
 */
export function classifyBiomeColor(
  texel: RawTexelSample,
  height: number,
  steepness: number,
  wx: number,
  wz: number,
  params: RawSampleParams,
  out: Color,
): void {
  if (isFarLake(texel, params)) {
    out.copy(LAKE_WATER)
    return
  }
  const { waterLevel, heightScale, region, seed } = params
  const altitude01 = (height - waterLevel) / Math.max(heightScale, 0.001)
  const weights = biomeWeightsAt(texel.moistureRegion, altitude01, region)
  const sandBand = sandBandAt(wx, wz, seed)
  colorForTerrain(height, texel.m, waterLevel, heightScale, weights, out, sandBand)
  applySlopeRock(out, height, waterLevel, steepness, sandBand)
  applyMountainRock(out, texel.mountainRidge, height, waterLevel, heightScale)
  applyOceanDepthTint(out, texel.continentalness, height, waterLevel)
  applyMicroTint(out, height, waterLevel, wx, wz, 0.045)
}
