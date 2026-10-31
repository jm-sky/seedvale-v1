import { type SettlementBaseName, settlementOrdinalName } from '../shared/SettlementName'
import { cellsWithinRadius, SETTLEMENT_GRID_STEP, type SettlementCell } from './settlementGenerator'

/**
 * Two settlements whose nominal cell centers are at most this far apart never
 * share a name. Settlements sit on a 300 m grid (nearest neighbours ≈ 300 m,
 * diagonals ≈ 400 m), so 1 km covers every road/signpost neighbour plus the
 * next ring or two — about 40 cells, the area a player sees named together on
 * signposts, roads and local quests. Farther duplicates are allowed
 * (author decision 2026-10-30: local, not global, uniqueness).
 */
export const LOCAL_SETTLEMENT_NAME_RADIUS_M = 1000

const CELL_REACH = Math.ceil(LOCAL_SETTLEMENT_NAME_RADIUS_M / SETTLEMENT_GRID_STEP) + 1

function chebyshevFromHome(cell: SettlementCell): number {
  return Math.max(Math.abs(cell.gx), Math.abs(cell.gz))
}

/**
 * Stable settlement-name order: Chebyshev ring from home, then `gx`, then `gz`.
 * Independent of stream / `settlementDefFor` lookup order, and well-founded
 * (finitely many cells precede any cell), so ordinal resolution terminates.
 *
 * @domain settlements
 */
export function compareSettlementNameOrder(a: SettlementCell, b: SettlementCell): number {
  const distA = chebyshevFromHome(a)
  const distB = chebyshevFromHome(b)
  if (distA !== distB) return distA - distB
  if (a.gx !== b.gx) return a.gx - b.gx
  return a.gz - b.gz
}

/**
 * Last-resort unique name once the ordinal words are exhausted.
 *
 * @domain settlements
 */
export function fallbackSettlementName(baseName: string, cell: SettlementCell): string {
  return `${baseName} ${cell.gx}:${cell.gz}`
}

export type LocalSettlementNameDeps = {
  /** Cheap, deterministic base name of any cell (no site search). */
  baseNameFor: (cell: SettlementCell) => SettlementBaseName
  /** Nominal cell center the uniqueness radius is measured between. */
  centerOf: (cell: SettlementCell) => { x: number, z: number }
  /** Per-world memo of resolved ordinals, keyed by cell key. */
  ordinals: Map<string, number>
  cellKey: (cell: SettlementCell) => string
}

/**
 * Ordinal (1 = plain base name) of `cell` among same-base-name cells within
 * {@link LOCAL_SETTLEMENT_NAME_RADIUS_M}: the smallest ordinal not taken by an
 * earlier ({@link compareSettlementNameOrder}) same-name neighbour. Recurses
 * only through same-base-name neighbours, so the cost is the base names of the
 * cells around `cell` plus a rare short chain — never the whole map.
 *
 * Cells without a settlement take part too (checking would need a site search),
 * so a rare "X Drugi" can stand without a visible "X" nearby.
 *
 * @domain settlements
 */
export function localSettlementNameOrdinal(cell: SettlementCell, deps: LocalSettlementNameDeps): number {
  const key = deps.cellKey(cell)
  const cached = deps.ordinals.get(key)
  if (cached !== undefined) return cached
  const base = deps.baseNameFor(cell).name
  const center = deps.centerOf(cell)
  const taken = new Set<number>()
  for (const neighbor of cellsWithinRadius(cell, CELL_REACH)) {
    if (compareSettlementNameOrder(neighbor, cell) >= 0) continue
    if (deps.baseNameFor(neighbor).name !== base) continue
    const other = deps.centerOf(neighbor)
    if (Math.hypot(other.x - center.x, other.z - center.z) > LOCAL_SETTLEMENT_NAME_RADIUS_M) continue
    taken.add(localSettlementNameOrdinal(neighbor, deps))
  }
  let ordinal = 1
  while (taken.has(ordinal)) ordinal++
  deps.ordinals.set(key, ordinal)
  return ordinal
}

/**
 * Locally unique display name of `cell`: base name, base + agreeing ordinal
 * word ("Osowiec Drugi"), or the cell-identity fallback past the last ordinal.
 *
 * @domain settlements
 */
export function localSettlementName(cell: SettlementCell, deps: LocalSettlementNameDeps): string {
  const base = deps.baseNameFor(cell)
  const ordinal = localSettlementNameOrdinal(cell, deps)
  return settlementOrdinalName(base, ordinal) ?? fallbackSettlementName(base.name, cell)
}
