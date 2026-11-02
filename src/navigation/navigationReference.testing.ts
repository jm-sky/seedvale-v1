/**
 * Test-only oracle: the pre-2026-11-02 `findPath` (linear open-list scan,
 * string keys, no walkability memo), kept verbatim so
 * `navigation.equivalence.test.ts` can prove the optimised search returns
 * byte-identical routes. Not imported by runtime code.
 */
import type { AgentProfile, NavigationQuery, PathfindOptions, PathPoint, PathResult } from './navigation'
import { sampleSlope, SLOPE_MAX_WALKABLE_DEG } from '../terrain/slopeConstraint'

const DEFAULT_CELL_SIZE = 1.5
const DEFAULT_BOUNDS_PADDING = 6
const DEFAULT_MAX_NODES = 1500
const GOAL_SEARCH_RINGS = 3

const NEIGHBORS: readonly (readonly [number, number])[] = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]

function cellCostAt(x: number, z: number, cellCost: ((x: number, z: number) => number) | undefined): number {
  return cellCost ? Math.max(1, cellCost(x, z)) : 1
}

function segmentWalkable(
  a: PathPoint,
  b: PathPoint,
  step: number,
  walkable: (x: number, z: number) => boolean,
  cellCost?: (x: number, z: number) => number,
): boolean {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const dist = Math.hypot(dx, dz)
  const sample = (x: number, z: number): boolean => walkable(x, z) && cellCostAt(x, z, cellCost) <= 1
  if (dist < 1e-6) return sample(b.x, b.z)
  const steps = Math.max(1, Math.ceil(dist / step))
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    if (!sample(a.x + dx * t, a.z + dz * t)) return false
  }
  return true
}

/** Greedy string-pulling: keeps a route point only where the direct line
 *  from the last kept anchor stops being traversable, so consecutive nodes
 *  that don't need an obstacle detour collapse into one straight leg while
 *  every required detour is preserved. `points[0]` is `start`; the returned
 *  array excludes it. */
function simplifyPath(
  points: readonly PathPoint[],
  sampleStep: number,
  walkable: (x: number, z: number) => boolean,
  cellCost?: (x: number, z: number) => number,
): PathPoint[] {
  if (points.length <= 1) return []
  if (points.length === 2) return [points[1]!]
  const result: PathPoint[] = []
  let anchor = 0
  for (let i = 1; i < points.length - 1; i++) {
    if (!segmentWalkable(points[anchor]!, points[i + 1]!, sampleStep, walkable, cellCost)) {
      result.push(points[i]!)
      anchor = i
    }
  }
  result.push(points[points.length - 1]!)
  return result
}

export function referenceFindPath(
  query: NavigationQuery,
  profile: AgentProfile,
  start: PathPoint,
  goal: PathPoint,
  options?: PathfindOptions,
): PathResult | null {
  const cellSize = options?.cellSize ?? DEFAULT_CELL_SIZE
  const boundsPadding = options?.boundsPadding ?? DEFAULT_BOUNDS_PADDING
  const maxNodes = options?.maxNodes ?? DEFAULT_MAX_NODES
  const maxSlopeDeg = profile.maxSlopeDeg ?? SLOPE_MAX_WALKABLE_DEG

  const walkable = (x: number, z: number): boolean => {
    if (!query.isWalkable(x, z)) return false
    if (maxSlopeDeg >= 90) return true
    const slope = sampleSlope(x, z, query.sampleHeight)
    return (slope.angleRad * 180) / Math.PI <= maxSlopeDeg
  }

  if (segmentWalkable(start, goal, cellSize / 2, walkable, query.cellCost)) {
    return { waypoints: [{ x: goal.x, z: goal.z }], visitedNodes: 0 }
  }

  const cellWorld = (cx: number, cz: number): PathPoint => ({
    x: start.x + cx * cellSize,
    z: start.z + cz * cellSize,
  })
  const goalCellExact = {
    cx: Math.round((goal.x - start.x) / cellSize),
    cz: Math.round((goal.z - start.z) / cellSize),
  }

  const paddingCells = Math.ceil(boundsPadding / cellSize)
  const minCx = Math.min(0, goalCellExact.cx) - paddingCells
  const maxCx = Math.max(0, goalCellExact.cx) + paddingCells
  const minCz = Math.min(0, goalCellExact.cz) - paddingCells
  const maxCz = Math.max(0, goalCellExact.cz) + paddingCells
  const inBounds = (cx: number, cz: number): boolean => cx >= minCx && cx <= maxCx && cz >= minCz && cz <= maxCz

  const goalCell = resolveWalkableGoalCell(goalCellExact, walkable, cellWorld, inBounds)
  if (!goalCell) return null

  const key = (cx: number, cz: number): string => `${cx},${cz}`
  const startKey = key(0, 0)
  const goalKey = key(goalCell.cx, goalCell.cz)
  const goalWorld = cellWorld(goalCell.cx, goalCell.cz)
  const heuristic = (cx: number, cz: number): number => Math.hypot(
    cellWorld(cx, cz).x - goalWorld.x,
    cellWorld(cx, cz).z - goalWorld.z,
  )

  type Open = { key: string, cx: number, cz: number, f: number }
  const gScore = new Map<string, number>([[startKey, 0]])
  const cameFrom = new Map<string, string>()
  const nodeAt = new Map<string, { cx: number, cz: number }>([[startKey, { cx: 0, cz: 0 }]])
  const closed = new Set<string>()
  const open: Open[] = [{ key: startKey, cx: 0, cz: 0, f: heuristic(0, 0) }]
  let visited = 0

  while (open.length > 0) {
    let bestIdx = 0
    for (let i = 1; i < open.length; i++) {
      if (open[i]!.f < open[bestIdx]!.f) bestIdx = i
    }
    const current = open.splice(bestIdx, 1)[0]!
    if (closed.has(current.key)) continue
    closed.add(current.key)
    visited++
    if (current.key === goalKey) {
      const nodePath = reconstructPath(cameFrom, nodeAt, goalKey, start, cellWorld)
      const waypoints = simplifyPath(nodePath, cellSize / 2, walkable, query.cellCost)
      return { waypoints, visitedNodes: visited }
    }
    if (visited >= maxNodes) return null

    const curG = gScore.get(current.key) ?? 0
    for (const [dcx, dcz] of NEIGHBORS) {
      const ncx = current.cx + dcx
      const ncz = current.cz + dcz
      if (!inBounds(ncx, ncz)) continue
      const nKey = key(ncx, ncz)
      if (closed.has(nKey)) continue
      const isDiagonal = dcx !== 0 && dcz !== 0
      if (isDiagonal) {
        // Corner-cutting guard: a diagonal step is only valid if both
        // orthogonal neighbors it would clip are themselves walkable.
        const a = cellWorld(current.cx + dcx, current.cz)
        const b = cellWorld(current.cx, current.cz + dcz)
        if (!walkable(a.x, a.z) || !walkable(b.x, b.z)) continue
      }
      const world = cellWorld(ncx, ncz)
      if (!walkable(world.x, world.z)) continue
      const geometric = isDiagonal ? cellSize * Math.SQRT2 : cellSize
      const stepCost = geometric * cellCostAt(world.x, world.z, query.cellCost)
      const tentativeG = curG + stepCost
      if (tentativeG >= (gScore.get(nKey) ?? Infinity)) continue
      gScore.set(nKey, tentativeG)
      cameFrom.set(nKey, current.key)
      nodeAt.set(nKey, { cx: ncx, cz: ncz })
      open.push({ key: nKey, cx: ncx, cz: ncz, f: tentativeG + heuristic(ncx, ncz) })
    }
  }
  return null
}

function resolveWalkableGoalCell(
  goalCellExact: { cx: number, cz: number },
  walkable: (x: number, z: number) => boolean,
  cellWorld: (cx: number, cz: number) => PathPoint,
  inBounds: (cx: number, cz: number) => boolean,
): { cx: number, cz: number } | null {
  const exactWorld = cellWorld(goalCellExact.cx, goalCellExact.cz)
  if (inBounds(goalCellExact.cx, goalCellExact.cz) && walkable(exactWorld.x, exactWorld.z)) {
    return goalCellExact
  }
  for (let r = 1; r <= GOAL_SEARCH_RINGS; r++) {
    for (let dcx = -r; dcx <= r; dcx++) {
      for (let dcz = -r; dcz <= r; dcz++) {
        if (Math.max(Math.abs(dcx), Math.abs(dcz)) !== r) continue
        const cx = goalCellExact.cx + dcx
        const cz = goalCellExact.cz + dcz
        if (!inBounds(cx, cz)) continue
        const world = cellWorld(cx, cz)
        if (walkable(world.x, world.z)) return { cx, cz }
      }
    }
  }
  return null
}

function reconstructPath(
  cameFrom: ReadonlyMap<string, string>,
  nodeAt: ReadonlyMap<string, { cx: number, cz: number }>,
  goalKey: string,
  start: PathPoint,
  cellWorld: (cx: number, cz: number) => PathPoint,
): PathPoint[] {
  const keys: string[] = [goalKey]
  let cursor = goalKey
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor)!
    keys.push(cursor)
  }
  keys.reverse()
  return keys.map((k, i) => {
    if (i === 0) return { x: start.x, z: start.z }
    const node = nodeAt.get(k)!
    return cellWorld(node.cx, node.cz)
  })
}
