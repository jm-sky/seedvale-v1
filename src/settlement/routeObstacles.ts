import type { SettlementDef } from './settlementGenerator'
import { villageSizeConfig } from './families'
import { pointInYard } from './householdYard'

/**
 * Village footprints as route-search obstacles (Q44 R4 / Q60, plan §2.2).
 *
 * Inter-settlement A* used to be blind to villages, so roads crossed houses, yards, storehouses and reserved
 * cemetery plots. This is a pure function of the already-resolved defs: plot discs, yard rectangles and the
 * plaza are **hard** (the search must go around), the rest of a foreign footprint is **soft** (expensive), and
 * the neighbourhood of the route's own endpoints is free so the road can still meet its entrance lane.
 *
 * @domain settlements
 */
export type RouteObstacles = {
  /** True when a road centreline at `(x, z)` would run through a plot, yard or plaza. */
  readonly isBlocked: (x: number, z: number) => boolean
  /** Step cost multiplier (>= 1) for ground inside a settlement footprint that is not blocked. */
  readonly costMultiplier: (x: number, z: number) => number
}

/** Extra clearance around a plot disc / yard / plaza: the road half-width plus a verge. */
export const ROUTE_OBSTACLE_PAD = 4
/** Radius around each route endpoint inside which obstacles are ignored (the entrance lane). */
export const ROUTE_ENDPOINT_FREE_RADIUS = 10
const FOREIGN_FOOTPRINT_COST = 8
const OWN_FOOTPRINT_COST = 1.5

/** Builds the obstacle query for one route search. `defs` are the settlements near the search envelope. */
export function buildRouteObstacles(
  defs: readonly SettlementDef[],
  endpoints: readonly { x: number, z: number }[],
  endpointDefIds: readonly string[],
): RouteObstacles {
  const near = (x: number, z: number): boolean =>
    endpoints.some((e) => Math.hypot(e.x - x, e.z - z) < ROUTE_ENDPOINT_FREE_RADIUS)
  const radiusOf = (def: SettlementDef): number => villageSizeConfig(def.size).footprintRadius

  const isBlocked = (x: number, z: number): boolean => {
    if (near(x, z)) return false
    for (const def of defs) {
      const reach = radiusOf(def) * 1.2
      if (Math.hypot(x - def.x, z - def.z) > reach) continue
      const { plan } = def
      if (Math.hypot(x - plan.plaza.x, z - plan.plaza.z) < plan.plaza.radius + ROUTE_OBSTACLE_PAD) return true
      for (const plot of plan.plots) {
        const discs = plot.discs ?? [{ x: plot.x, z: plot.z, radius: plot.radius }]
        for (const d of discs) {
          if (Math.hypot(x - d.x, z - d.z) < d.radius + ROUTE_OBSTACLE_PAD) return true
        }
        if (plot.yard && pointInYard(plot.yard, x, z, -ROUTE_OBSTACLE_PAD)) return true
      }
    }
    return false
  }

  const costMultiplier = (x: number, z: number): number => {
    if (near(x, z)) return 1
    let m = 1
    for (const def of defs) {
      if (Math.hypot(x - def.x, z - def.z) >= radiusOf(def)) continue
      m = Math.max(m, endpointDefIds.includes(def.id) ? OWN_FOOTPRINT_COST : FOREIGN_FOOTPRINT_COST)
    }
    return m
  }

  return { isBlocked, costMultiplier }
}
