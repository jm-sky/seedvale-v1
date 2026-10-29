import type { MapCellKey } from './mapTypes'
import { MAP_CELL_SIZE, MAP_EXTENT_HALF } from './mapConfig'
import { parseMapCellKey } from './mapProjection'
import { MAP_COVERAGE_BLOCK, type MapRect } from './mapRasterTile'

/** Fog grid side in map cells (one byte per 8-unit cell over the map extent). */
export const MAP_FOG_SIDE = (MAP_EXTENT_HALF * 2) / MAP_CELL_SIZE
const ORIGIN_CELL = MAP_EXTENT_HALF / MAP_CELL_SIZE
const BLOCK_CELLS = MAP_COVERAGE_BLOCK / MAP_CELL_SIZE
const BLOCK_SIDE = MAP_FOG_SIDE / BLOCK_CELLS
const ORIGIN_BLOCK = MAP_EXTENT_HALF / MAP_COVERAGE_BLOCK

/** Fog opacity (0–255) of an explored cell that touches unexplored ground.
 *  Feathering *inward* keeps bilinear filtering from exposing unknown terrain. */
export const MAP_FOG_EDGE_ALPHA = 150

export type MapFogGrid = {
  /** Dense discovered bitmap, `MAP_FOG_SIDE²`, row-major z-then-x, origin at −extent. */
  readonly cells: Uint8Array
  /** Marks a discovered cell; returns grid index, or −1 when out of extent / already set. */
  add(cx: number, cz: number): number
  /** Replaces all content from keys (clear/restore). */
  reset(keys: Iterable<MapCellKey>): void
  isDiscovered(cx: number, cz: number): boolean
  /** Whether any discovered cell lies in `rect` (world units). */
  anyDiscoveredIn(rect: MapRect): boolean
  /** Discovered coverage blocks (`[bx, bz]`) overlapping `rect`. */
  coveredBlocksIn(rect: MapRect): [number, number][]
  /** Fog opacity of grid cell `(ix, iz)` — 255 unknown, edge alpha, or 0. */
  alphaAt(ix: number, iz: number): number
}

/**
 * Presentation-side bitmap mirror of `MapDiscovery` (plan ui-input-046) —
 * O(1) cell tests for fog painting and per-block counters for gating raster
 * generation. `MapDiscovery` remains the authority and the persisted form.
 *
 * @domain ui-input
 */
export function createMapFogGrid(): MapFogGrid {
  const cells = new Uint8Array(MAP_FOG_SIDE * MAP_FOG_SIDE)
  const blockCounts = new Uint32Array(BLOCK_SIDE * BLOCK_SIDE)

  const discoveredAt = (ix: number, iz: number) =>
    ix >= 0 && iz >= 0 && ix < MAP_FOG_SIDE && iz < MAP_FOG_SIDE && cells[iz * MAP_FOG_SIDE + ix] === 1

  function add(cx: number, cz: number): number {
    const ix = cx + ORIGIN_CELL
    const iz = cz + ORIGIN_CELL
    if (ix < 0 || iz < 0 || ix >= MAP_FOG_SIDE || iz >= MAP_FOG_SIDE) return -1
    const index = iz * MAP_FOG_SIDE + ix
    if (cells[index] === 1) return -1
    cells[index] = 1
    blockCounts[Math.floor(iz / BLOCK_CELLS) * BLOCK_SIDE + Math.floor(ix / BLOCK_CELLS)]!++
    return index
  }

  function blockRange(rect: MapRect) {
    const clampB = (v: number) => Math.min(BLOCK_SIDE - 1, Math.max(0, v))
    return {
      bx0: clampB(Math.floor(rect.minX / MAP_COVERAGE_BLOCK) + ORIGIN_BLOCK),
      bx1: clampB(Math.floor((rect.maxX - 1e-6) / MAP_COVERAGE_BLOCK) + ORIGIN_BLOCK),
      bz0: clampB(Math.floor(rect.minZ / MAP_COVERAGE_BLOCK) + ORIGIN_BLOCK),
      bz1: clampB(Math.floor((rect.maxZ - 1e-6) / MAP_COVERAGE_BLOCK) + ORIGIN_BLOCK),
    }
  }

  const outside = (rect: MapRect) =>
    rect.maxX <= -MAP_EXTENT_HALF || rect.minX >= MAP_EXTENT_HALF
    || rect.maxZ <= -MAP_EXTENT_HALF || rect.minZ >= MAP_EXTENT_HALF

  return {
    cells,
    add,
    reset(keys) {
      cells.fill(0)
      blockCounts.fill(0)
      for (const key of keys) {
        const cell = parseMapCellKey(key)
        if (cell) add(cell.cx, cell.cz)
      }
    },
    isDiscovered(cx, cz) {
      return discoveredAt(cx + ORIGIN_CELL, cz + ORIGIN_CELL)
    },
    anyDiscoveredIn(rect) {
      if (outside(rect)) return false
      const { bx0, bx1, bz0, bz1 } = blockRange(rect)
      let anyBlock = false
      for (let bz = bz0; bz <= bz1 && !anyBlock; bz++) {
        for (let bx = bx0; bx <= bx1; bx++) {
          if (blockCounts[bz * BLOCK_SIDE + bx]! > 0) {
            anyBlock = true
            break
          }
        }
      }
      if (!anyBlock) return false
      // Rect aligned to whole blocks: the counters are exact.
      if (rect.minX % MAP_COVERAGE_BLOCK === 0 && rect.maxX % MAP_COVERAGE_BLOCK === 0
        && rect.minZ % MAP_COVERAGE_BLOCK === 0 && rect.maxZ % MAP_COVERAGE_BLOCK === 0) return true
      const ix0 = Math.max(0, Math.floor(rect.minX / MAP_CELL_SIZE) + ORIGIN_CELL)
      const ix1 = Math.min(MAP_FOG_SIDE - 1, Math.floor((rect.maxX - 1e-6) / MAP_CELL_SIZE) + ORIGIN_CELL)
      const iz0 = Math.max(0, Math.floor(rect.minZ / MAP_CELL_SIZE) + ORIGIN_CELL)
      const iz1 = Math.min(MAP_FOG_SIDE - 1, Math.floor((rect.maxZ - 1e-6) / MAP_CELL_SIZE) + ORIGIN_CELL)
      for (let iz = iz0; iz <= iz1; iz++) {
        for (let ix = ix0; ix <= ix1; ix++) if (cells[iz * MAP_FOG_SIDE + ix] === 1) return true
      }
      return false
    },
    coveredBlocksIn(rect) {
      if (outside(rect)) return []
      const { bx0, bx1, bz0, bz1 } = blockRange(rect)
      const out: [number, number][] = []
      for (let bz = bz0; bz <= bz1; bz++) {
        for (let bx = bx0; bx <= bx1; bx++) {
          if (blockCounts[bz * BLOCK_SIDE + bx]! > 0) out.push([bx - ORIGIN_BLOCK, bz - ORIGIN_BLOCK])
        }
      }
      return out
    },
    alphaAt(ix, iz) {
      if (!discoveredAt(ix, iz)) return 255
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if ((dx !== 0 || dz !== 0) && !discoveredAt(ix + dx, iz + dz)) return MAP_FOG_EDGE_ALPHA
        }
      }
      return 0
    },
  }
}

/** World origin (min corner) of fog grid cell index 0. */
export const MAP_FOG_ORIGIN = -MAP_EXTENT_HALF
