import type { HeightSampler } from '../player/PlayerController'
import type { SettlementTerrain } from '../shared/SettlementName'
import type { RegionalSmoothingSegment, VillageClearingParams } from '../terrain/chunkHeightmap'
import type { FamilyDef, VillageSize } from './families'
import type { VillagePlan } from './villagePlan'
import { createSeededRandom } from '../world/parseSeed'
import { gardenClearingRadius, type GardenScale } from './gardenScale'
import { pathIsDry, SETTLEMENT_WATER_MARGIN } from './pathDryness'
import { plazaRadiusForSize } from './villagePlan'

export type ClearingArea = {
  x: number
  z: number
  radius: number
  /** Pre-computed flat target height, sampled once via the ambient
   *  (clearing-agnostic) `sampleHeight` — see `ChunkTileParams.clearings`'
   *  doc comment (`terrain/chunkHeightmap.ts`) for why that ordering matters. */
  targetH: number
}

export type ClearingLayout = {
  /** Shared area at the settlement's site center — well/stockpile
   *  (+extras for bigger villages, see `settlement/props.ts`). */
  core: ClearingArea
  /** One per family — its house sits here. Same order as `SettlementDef.families`. */
  houses: readonly ClearingArea[]
  /** One per family, index-aligned with `houses` — the household yard behind
   *  the house (Q41) so terrain flattening/vegetation clearing covers it.
   *  Kept separate from `houses` so consumers of house pads are unchanged. */
  yards: readonly ClearingArea[]
  /** Garden pads (plan 077 / 100) — tree/grass reject + house-level flatten. */
  gardens: readonly ClearingArea[]
  /** Broad, weak smoothing pass covering the whole village footprint (core +
   *  house ring), pulling outlier clearings toward a shared average height —
   *  see `RegionalSmoothingSegment`'s doc comment for why it's a separate,
   *  earlier-applied pass rather than another `ClearingArea`. */
  regional: RegionalSmoothingSegment
}

/** A handful of samples around a clearing's center, averaged — same idea as
 *  `findSettlementSite`'s 4-direction flatness probe, just used to pick a
 *  representative height instead of rejecting uneven spots. */
function averageHeight(cx: number, cz: number, r: number, sampleHeight: HeightSampler): number {
  const offsets: readonly [number, number][] = [
    [0, 0],
    [r * 0.6, 0],
    [-r * 0.6, 0],
    [0, r * 0.6],
    [0, -r * 0.6],
  ]
  let sum = 0
  for (const [dx, dz] of offsets) sum += sampleHeight(cx + dx, cz + dz)
  return sum / offsets.length
}

function dryClearingHeight(h: number, waterLevel: number): number {
  return Math.max(h, waterLevel + SETTLEMENT_WATER_MARGIN)
}

/** Size-scaled plaza disk — delegates to {@link plazaRadiusForSize} (plan settlements-011). */
export function plazaCoreRadius(size: VillageSize, baseCoreRadius: number): number {
  return plazaRadiusForSize(size, baseCoreRadius)
}

/**
 * Plan → terrain modifiers (plan 047 §9.10). House/core positions come from
 * `VillagePlan` plots/landmarks — this no longer chooses layout independently.
 */
export function layoutClearingsFromPlan(
  plan: VillagePlan,
  sampleHeight: HeightSampler,
  params: VillageClearingParams,
  waterLevel: number,
): ClearingLayout {
  const coreRadius = plan.plaza.radius
  const houseRadius = params.houseRadius
  const core: ClearingArea = {
    x: plan.plaza.x,
    z: plan.plaza.z,
    radius: coreRadius,
    targetH: dryClearingHeight(
      averageHeight(plan.plaza.x, plan.plaza.z, coreRadius, sampleHeight),
      waterLevel,
    ),
  }

  const housePlots = plan.plots
    .filter((p) => p.role === 'house')
    .slice()
    .sort((a, b) => (a.familyIndex ?? 0) - (b.familyIndex ?? 0))

  const houses: ClearingArea[] = housePlots.map((plot) => ({
    x: plot.x,
    z: plot.z,
    radius: Math.max(houseRadius, plot.radius * 0.85),
    targetH: dryClearingHeight(
      averageHeight(plot.x, plot.z, houseRadius, sampleHeight),
      waterLevel,
    ),
  }))

  const yards: ClearingArea[] = housePlots.map((plot) => {
    const yard = plot.yard
    if (!yard) return { x: plot.x, z: plot.z, radius: 0, targetH: dryClearingHeight(plot.y, waterLevel) }
    // Disc covering the yard rectangle's usable core (circumscribed would
    // spill past the side lanes).
    const radius = Math.hypot(yard.halfWidth, yard.halfDepth) * 0.85
    return {
      x: yard.cx,
      z: yard.cz,
      radius,
      targetH: dryClearingHeight(averageHeight(yard.cx, yard.cz, radius, sampleHeight), waterLevel),
    }
  })

  const gardenLandmarks = plan.landmarks
    .filter((l) => l.kind === 'garden')
    .slice()
    .sort((a, b) => a.index - b.index)

  const gardens: ClearingArea[] = gardenLandmarks.map((lm) => {
    const scale = (lm.gardenScale ?? 'S') as GardenScale
    const radius = gardenClearingRadius(scale)
    return {
      x: lm.x,
      z: lm.z,
      radius,
      targetH: dryClearingHeight(averageHeight(lm.x, lm.z, radius, sampleHeight), waterLevel),
    }
  })

  const allTargets = [
    core.targetH,
    ...houses.map((h) => h.targetH),
    ...yards.filter((y) => y.radius > 0).map((y) => y.targetH),
    ...gardens.map((g) => g.targetH),
  ]
  const regional: RegionalSmoothingSegment = {
    x: plan.boundary.x,
    z: plan.boundary.z,
    radius: Math.max(plan.boundary.radius, params.houseRadius * 2),
    targetH: allTargets.reduce((a, b) => a + b, 0) / Math.max(1, allTargets.length),
    heightStrength:
      plan.identity.terrain === 'mountain'
        ? params.regionalHeightStrengthMountain
        : params.regionalHeightStrengthFlat,
  }

  return { core, houses, yards, gardens, regional }
}

/**
 * @deprecated Prefer `layoutClearingsFromPlan`. Kept for unit tests that exercise
 *  the historical ring placement without a full `VillagePlan`.
 */
export function layoutClearings(
  site: { x: number, z: number, y: number },
  families: readonly FamilyDef[],
  terrain: SettlementTerrain,
  seed: number,
  sampleHeight: HeightSampler,
  waterLevel: number,
  params: VillageClearingParams,
): ClearingLayout {
  const core: ClearingArea = {
    x: site.x,
    z: site.z,
    radius: params.coreRadius,
    targetH: averageHeight(site.x, site.z, params.coreRadius, sampleHeight),
  }

  const random = createSeededRandom(seed ^ 0x2b9e17)
  const ringMin = params.coreRadius + params.houseRadius * 1.6
  const ringMax = ringMin + params.houseRadius * 3.2
  const fallbackDist = params.coreRadius + params.houseRadius * 1.1
  const HOUSE_SITE_ATTEMPTS = 4

  const houses: ClearingArea[] = families.map((_, i) => {
    const baseAngle = (i / Math.max(1, families.length)) * Math.PI * 2

    for (let attempt = 0; attempt < HOUSE_SITE_ATTEMPTS; attempt++) {
      const angle = baseAngle + random() * 0.6
      const dist = ringMin + random() * (ringMax - ringMin)
      const cx = site.x + Math.cos(angle) * dist
      const cz = site.z + Math.sin(angle) * dist
      if (!pathIsDry(site.x, site.z, cx, cz, waterLevel, sampleHeight)) continue
      return { x: cx, z: cz, radius: params.houseRadius, targetH: averageHeight(cx, cz, params.houseRadius, sampleHeight) }
    }

    const fx = site.x + Math.cos(baseAngle) * fallbackDist
    const fz = site.z + Math.sin(baseAngle) * fallbackDist
    return { x: fx, z: fz, radius: params.houseRadius, targetH: averageHeight(fx, fz, params.houseRadius, sampleHeight) }
  })

  const allTargets = [core.targetH, ...houses.map((h) => h.targetH)]
  const regional: RegionalSmoothingSegment = {
    x: site.x,
    z: site.z,
    radius: ringMax + params.houseRadius * 2,
    targetH: allTargets.reduce((a, b) => a + b, 0) / allTargets.length,
    heightStrength:
      terrain === 'mountain' ? params.regionalHeightStrengthMountain : params.regionalHeightStrengthFlat,
  }

  return { core, houses, yards: [], gardens: [], regional }
}
