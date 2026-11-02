import { ROAD_ROUTE_CACHE_NAMESPACE, ROAD_ROUTE_CACHE_VERSION } from '../settlement/roadRouteWorldgenCache'
import { SETTLEMENT_DEFINITION_CACHE_NAMESPACE, SETTLEMENT_DEFINITION_CACHE_VERSION } from '../settlement/settlementWorldgenCache'
import { WORLD_HYDROLOGY_CACHE_NAMESPACE, WORLD_HYDROLOGY_CACHE_VERSION } from '../terrain/worldHydrologyCache'
import { CAVES_V2_NAMESPACE, CAVES_V2_VERSION } from '../world/caves/caveWorldgenCache'
import { ABANDONED_CEMETERY_NAMESPACE, ABANDONED_CEMETERY_VERSION } from '../world/locations/abandonedCemeteryCache'
import { LOCATIONS_COARSE_NAMESPACE, LOCATIONS_COARSE_VERSION } from '../world/locations/locationsCoarseCache'

/**
 * @domain persistence
 * @system worldgen-cache
 * @role Namespaces that may ship in a worldgen cache boot fixture (plan
 *  tools-020) with the owner's *current* version. The importer drops records
 *  of any other version (a stale-version record is never evicted by
 *  `enforceCacheCap()`), the exporter refuses namespaces not listed here, and
 *  `pnpm worldgen:fixture:check` compares `public/worldgen-fixtures/index.json`
 *  against it. `chunk-tiles` is deliberately absent (78 MB, no boot gain).
 *  A new namespace joins here deliberately, with its owner's constants.
 */
export const WORLDGEN_FIXTURE_NAMESPACES: Readonly<Record<string, number>> = {
  [WORLD_HYDROLOGY_CACHE_NAMESPACE]: WORLD_HYDROLOGY_CACHE_VERSION,
  [CAVES_V2_NAMESPACE]: CAVES_V2_VERSION,
  [SETTLEMENT_DEFINITION_CACHE_NAMESPACE]: SETTLEMENT_DEFINITION_CACHE_VERSION,
  [ROAD_ROUTE_CACHE_NAMESPACE]: ROAD_ROUTE_CACHE_VERSION,
  [LOCATIONS_COARSE_NAMESPACE]: LOCATIONS_COARSE_VERSION,
  [ABANDONED_CEMETERY_NAMESPACE]: ABANDONED_CEMETERY_VERSION,
}
