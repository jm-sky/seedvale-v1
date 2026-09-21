import type { SettlementCell, SettlementDef } from '../settlement/settlementGenerator'
import type { WaterQuality } from './WaterSource'
import { isNearSettlement } from '../settlement/settlementProximity'
import { RIVER_CELL_STEP, type RiverHydrologyContext } from '../terrain/riverNetwork'
import { applyRiverWaterQualityModifiers, classifyBaseRiverWaterQuality } from './riverWaterQuality'

/**
 * World-scoped lazy resolver + cache composing river hydrology context and
 * settlement proximity into a final river `WaterQuality` (plan world-017 §6).
 *
 * `resolveFromContext` takes an already-resolved hydrology context (plan
 * world-terrain-046) rather than a coordinate to look up itself — the caller
 * (`app/interactables.ts`'s shoreline resolver, via the shared
 * `terrain/waterBodyKind.ts::resolveWaterShore` seam) already found the
 * winning nearest river candidate resolving *which* body this point belongs
 * to, so this resolver never repeats that nearest-river search just to find
 * its own cache key. Takes its settlement-def dependency as a plain function
 * rather than a full `SettlementsManager` reference, so it stays trivially
 * testable and has no import-cycle risk with it.
 *
 * Create one instance per `WorldBundle`, once `SettlementsManager` exists —
 * the cache below is intentionally not persisted (no `SaveData` entry) and
 * must not survive a world rebuild or seed change, so a fresh instance per
 * bundle *is* that lifecycle contract; nothing explicitly clears it.
 *
 * @domain world
 * @system river-water-quality
 * @role Owns the only river-water-quality cache; composes an
 *  already-resolved river hydrology context and a settlement-def lookup
 *  through the pure classifier in `riverWaterQuality.ts`.
 */
export type RiverWaterQualityResolver = {
  /** Lazy, cached river water quality from a hydrology context the caller
   *  already resolved as a river shoreline — no river rediscovery. */
  resolveFromContext: (context: Pick<RiverHydrologyContext, 'x' | 'z' | 'elevation' | 'accumulation'>) => WaterQuality
}

export function createRiverWaterQualityResolver(
  /** `SettlementsManager.peekDef` in production. */
  peekSettlementDef: (cell: SettlementCell) => SettlementDef | null,
): RiverWaterQualityResolver {
  const cache = new Map<string, WaterQuality>()

  return {
    resolveFromContext(context) {
      const cellX = Math.floor(context.x / RIVER_CELL_STEP)
      const cellZ = Math.floor(context.z / RIVER_CELL_STEP)
      const key = `${cellX},${cellZ}`
      const cached = cache.get(key)
      if (cached !== undefined) return cached

      const base = classifyBaseRiverWaterQuality(context)
      const nearSettlement = isNearSettlement(peekSettlementDef, context.x, context.z)
      const quality = applyRiverWaterQualityModifiers(base, { nearSettlement })
      cache.set(key, quality)
      return quality
    },
  }
}
