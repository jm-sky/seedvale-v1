import type { RawSampleParams } from './chunkHeightmap'
import { RIVER_CELL_STEP } from './riverNetwork'
import { computeWorldHydrology, sampleRawFloorRows } from './worldHydrology'
import { worldHydrologyOptionsFor } from './worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

/** Square window of the hydrology grid, in cells of `RIVER_CELL_STEP`. */
export type HydrologyTestWindow = { originX: number; originZ: number; cells: number }

/** 1.28 km window around the origin (river tiles −2..1 on both axes): cheap, still yields real chains. */
export const DEFAULT_HYDROLOGY_TEST_WINDOW: HydrologyTestWindow = { originX: -640, originZ: -640, cells: 161 }

/**
 * Test helper: computes the global hydrology of a small window of the real raw floor, installs it under a
 * window-specific id and returns `params` with that `hydrologyId`. Chains are clipped at the window edge, so tests
 * should assert invariants, not totals. Production code never uses it (the game always installs a world-sized one).
 */
export function withWindowHydrology(
  params: RawSampleParams,
  window: HydrologyTestWindow = DEFAULT_HYDROLOGY_TEST_WINDOW,
): RawSampleParams {
  const raw = { ...params, hydrologyId: UNCONDITIONED_HYDROLOGY_ID }
  const grid = { size: window.cells, cellStep: RIVER_CELL_STEP, originX: window.originX, originZ: window.originZ }
  const floor = sampleRawFloorRows(raw, grid, 0, window.cells)
  const hydrology = computeWorldHydrology({ ...grid, floor }, worldHydrologyOptionsFor(raw))
  const hydrologyId = `test-window-${params.seed}-${window.originX}-${window.originZ}-${window.cells}`
  installWorldHydrology(hydrologyId, hydrology)
  return { ...params, hydrologyId }
}
