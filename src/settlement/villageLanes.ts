import type { HeightSampler } from '../player/PlayerController'
import type { VillagePathPlan, VillagePlot } from './villagePlan'
import { cemeteryLocalToWorld, cemeteryPlotExtents } from './cemeteryLayout'
import { CEMETERY_PLOT_ID } from './cemeteryReservation'
import { houseLocalToWorld, pointInYard, yardDisc } from './householdYard'
import { pathIsDry } from './pathDryness'

/**
 * Obstacle-aware village lane network (Q57 / Q44 R1, "reserve first,
 * connect second"). Pure and Three.js-free: given the already placed plots,
 * it builds a deterministic tree of lanes — trunk lanes entrance→plaza, then
 * every destination attached to the nearest obstacle-free point of the
 * existing network via its access point (door / bay / plot edge).
 *
 * Replaces the old straight spoke fan from the plaza centre. Output is plain
 * `VillagePathPlan` polylines, so terrain / palisade / pasture consumers are
 * unchanged.
 *
 * @domain settlements
 */


type Pt = { x: number, z: number }

/** Lane may not come closer than this fraction of a plot radius to its centre. */
const PLOT_CLEARANCE_FACTOR = 0.9
/** Q93: extra metres between a lane's edge and a house/storehouse footprint disc (on top of the lane half width). */
const BUILDING_LANE_MARGIN = 0.3
/** Household wells keep the whole corridor (radius + lane half width, road 2.4) off the well. */
const SMALL_PLOT_LANE_CLEARANCE = 1.7
/** Extra clearance for road-width (entrance) lanes around those small plots. */
const ROAD_LANE_EXTRA_CLEARANCE = 1.0
/** Metres kept clear between a lane's *edge* (centreline + half width) and a household yard rectangle. */
const YARD_LANE_CLEARANCE = 0.8
/** Lanes root this far inside the plaza rim so the corridor overlaps the paved square (no grass seam). */
const PLAZA_ROOT_INSET = 2.5
/** Tangent detour clearance beyond an obstacle radius. */
const DETOUR_CLEARANCE = 1.0
/** Longest straight polyline segment (terrain follows relief per vertex). */
const MAX_SEGMENT_LENGTH = 14
/** Attach candidates tried per destination before the unresolved fallback. */
const MAX_ATTACH_CANDIDATES = 10
/** Nearest-point candidates this close to a spur's access end are skipped. */
const SPUR_END_NO_ATTACH = 3
/** Extra metres between a lane's edge and the cemetery's circumscribed circle. */
const CEMETERY_LANE_MARGIN = 1
const CEMETERY_OBSTACLE_ID = CEMETERY_PLOT_ID
/** Distance in front of the cemetery gate where its lane ends (lane half width 1.5 + terrain margin 0.25 + slack). */
const CEMETERY_GATE_LANE_STOP = 2
/** Sampling step for rectangle obstacles. */
const YARD_SAMPLE_STEP = 1
/** Shorter lanes are not worth a corridor. */
const MIN_LANE_LENGTH = 1.5
const MAX_DETOUR_DEPTH = 3
/** Root points around the plaza rim lanes may attach to. */
const PLAZA_RIM_ROOTS = 16

type DiscObstacle = {
  kind: 'disc'
  id: string
  x: number
  z: number
  r: number
  small: boolean
  /** Q93: corridor padding already inside `r` (lane half width + margin). Point-in-footprint tests use `r - pad`. */
  pad?: number
}
type YardObstacle = {
  kind: 'yard'
  id: string
  yard: NonNullable<VillagePlot['yard']>
  x: number
  z: number
  /** Bounding-disc radius including the lane margin. */
  r: number
  /** Centreline clearance: lane half width + `YARD_LANE_CLEARANCE`. */
  margin: number
}
type Obstacle = DiscObstacle | YardObstacle

export type LaneDestination = {
  /** Lane id (`path-…`), kept stable for existing consumers/tests. */
  id: string
  /** Where the lane ends (door, bay apron, plot edge, zone centre). */
  access: Pt
  /** Plot whose own disc must not block this lane (null for zones). */
  ownPlotId: string | null
  /** Plot centre + radius: the access point may rotate around it when blocked. */
  around?: { x: number, z: number, r: number }
  /** Abstract target (zone centre): skipped, never forced, when it cannot be attached cleanly. */
  optional?: boolean
}

/** Angular nudges (rad) tried when the preferred access point is inside another obstacle. */
const ACCESS_NUDGES = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, 1.4, -1.4, 1.9, -1.9, Math.PI]

/** First access point (door side preferred) not already inside a foreign obstacle. */
function resolveAccess(dest: LaneDestination, obstacles: readonly Obstacle[]): Pt {
  const footprints = obstacles.map(footprintOnly)
  const free = (p: Pt): boolean => firstHit(p, p, footprints, dest.ownPlotId) === null
  if (free(dest.access) || !dest.around) return dest.access
  const { x, z, r } = dest.around
  const base = Math.atan2(dest.access.z - z, dest.access.x - x)
  for (const nudge of ACCESS_NUDGES) {
    const p = { x: x + Math.cos(base + nudge) * r, z: z + Math.sin(base + nudge) * r }
    if (free(p)) return p
  }
  return dest.access
}

export type LaneEntrance = { id: string, x: number, z: number, kind: 'road' | 'path' }

export type VillageLanePlan = {
  paths: VillagePathPlan[]
  /** Destination ids that could not be attached without crossing a footprint. */
  unresolved: string[]
}

const isPlazaFurniture = (plot: VillagePlot): boolean =>
  /market|campfire|notice|plot-infra-well$/.test(plot.id)

/** Walled buildings (houses, storehouse): the lane corridor — not only its centreline — stays off the footprint. */
const isBuildingPlot = (plot: VillagePlot): boolean =>
  plot.role === 'house' || /storehouse/.test(plot.id)

function obstaclesFromPlots(plots: readonly VillagePlot[], laneHalfWidth: number): Obstacle[] {
  const out: Obstacle[] = []
  for (const plot of plots) {
    if (isPlazaFurniture(plot)) continue
    if (plot.role === 'cemetery') {
      // Q58: the reserved cemetery rectangle reaches its circumscribed radius at the corners, so the whole
      // corridor (centreline + half width + margin) stays outside that circle.
      out.push({ kind: 'disc', id: plot.id, x: plot.x, z: plot.z, small: false, r: plot.radius + laneHalfWidth + CEMETERY_LANE_MARGIN })
      continue
    }
    out.push({
      kind: 'disc',
      id: plot.id,
      x: plot.x,
      z: plot.z,
      small: plot.id.startsWith('plot-household-well-'),
      r: plot.id.startsWith('plot-household-well-')
        ? plot.radius + SMALL_PLOT_LANE_CLEARANCE
        : isBuildingPlot(plot)
          ? plot.radius * PLOT_CLEARANCE_FACTOR + laneHalfWidth + BUILDING_LANE_MARGIN
          : plot.radius * PLOT_CLEARANCE_FACTOR,
      ...(isBuildingPlot(plot) && !plot.id.startsWith('plot-household-well-') ? { pad: laneHalfWidth + BUILDING_LANE_MARGIN } : {}),
    })
    if (plot.yard) {
      const d = yardDisc(plot.yard)
      out.push({
        kind: 'yard',
        id: `${plot.id}#yard`,
        yard: plot.yard,
        x: d.x,
        z: d.z,
        r: d.radius + laneHalfWidth + YARD_LANE_CLEARANCE,
        margin: laneHalfWidth + YARD_LANE_CLEARANCE,
      })
    }
  }
  return out
}

function distToSegment(px: number, pz: number, a: Pt, b: Pt): { dist: number, t: number } {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const len2 = dx * dx + dz * dz
  const t = len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (pz - a.z) * dz) / len2))
  return { dist: Math.hypot(px - (a.x + dx * t), pz - (a.z + dz * t)), t }
}

/** Parameter `t` of the first obstacle the segment hits, or null. */
function firstHit(
  a: Pt,
  b: Pt,
  obstacles: readonly Obstacle[],
  ignoreId: string | null,
): { obstacle: Obstacle, t: number } | null {
  let best: { obstacle: Obstacle, t: number } | null = null
  const len = Math.hypot(b.x - a.x, b.z - a.z)
  for (const o of obstacles) {
    if (ignoreId !== null && (o.id === ignoreId)) continue
    const near = distToSegment(o.x, o.z, a, b)
    if (near.dist >= o.r) continue
    let t: number | null = null
    if (o.kind === 'disc') {
      t = near.t
    } else {
      const steps = Math.max(1, Math.ceil(len / YARD_SAMPLE_STEP))
      for (let i = 0; i <= steps; i++) {
        const s = i / steps
        if (pointInYard(o.yard, a.x + (b.x - a.x) * s, a.z + (b.z - a.z) * s, -o.margin)) {
          t = s
          break
        }
      }
    }
    if (t !== null && (best === null || t < best.t)) best = { obstacle: o, t }
  }
  return best
}

/** The obstacle without its lane-corridor padding (Q93): where a door / gate / access point sits relative to the footprint. */
const footprintOnly = (o: Obstacle): Obstacle => (o.kind === 'disc' && o.pad ? { ...o, r: o.r - o.pad } : o)

/** Q93: corridor padding applied to the building discs, tried from full to none before a lane is called unresolved. */
const BUILDING_PAD_STEPS = [1, 0.5, 0] as const
/** Obstacles with the building corridor padding scaled by `k` (1 = full, 0 = footprint only). */
const withBuildingPad = (obstacles: readonly Obstacle[], k: number): readonly Obstacle[] =>
  k === 1 ? obstacles : obstacles.map((o) => (o.kind === 'disc' && o.pad ? { ...o, r: o.r - o.pad * (1 - k) } : o))

/** Obstacles that already contain `p` (the lane's own start/end) are not crossable by definition. */
function obstaclesExcludingPoint(obstacles: readonly Obstacle[], p: Pt): readonly Obstacle[] {
  const containing = obstacles.filter((o) => firstHit(p, p, [footprintOnly(o)], null) !== null)
  return containing.length === 0 ? obstacles : obstacles.filter((o) => !containing.includes(o))
}

/** The cemetery obstacle alone, shrunk just enough that the route's goal lies outside it (a gate / entrance
 *  that sits inside the safety margin must still be reachable). */
function cemeteryObstaclesFor(obstacles: readonly Obstacle[], goal: Pt): Obstacle[] {
  return obstacles
    .filter((o): o is DiscObstacle => o.kind === 'disc' && o.id === CEMETERY_OBSTACLE_ID)
    .map((o) => ({ ...o, r: Math.min(o.r, Math.hypot(goal.x - o.x, goal.z - o.z) - 0.05) }))
}

function pathLength(points: readonly Pt[]): number {
  let sum = 0
  for (let i = 0; i < points.length - 1; i++) {
    sum += Math.hypot(points[i + 1]!.x - points[i]!.x, points[i + 1]!.z - points[i]!.z)
  }
  return sum
}

/** Obstacle-free polyline a→b with at most `depth` tangent detours, or null. */
function routeAround(
  a: Pt,
  b: Pt,
  obstacles: readonly Obstacle[],
  ignoreId: string | null,
  depth: number,
): Pt[] | null {
  const hit = firstHit(a, b, obstacles, ignoreId)
  if (!hit) return [a, b]
  if (depth <= 0) return null
  const dx = b.x - a.x
  const dz = b.z - a.z
  const len = Math.hypot(dx, dz)
  if (len < 1e-6) return null
  const nx = -dz / len
  const nz = dx / len
  const o = hit.obstacle
  let best: Pt[] | null = null
  let bestLen = Infinity
  for (const side of [1, -1]) {
    const reach = o.r + DETOUR_CLEARANCE
    const w = { x: o.x + nx * side * reach, z: o.z + nz * side * reach }
    const first = routeAround(a, w, obstacles, ignoreId, depth - 1)
    if (!first) continue
    const second = routeAround(w, b, obstacles, ignoreId, depth - 1)
    if (!second) continue
    const full = [...first, ...second.slice(1)]
    const total = pathLength(full)
    if (total < bestLen) {
      best = full
      bestLen = total
    }
  }
  return best
}

function subdivide(points: readonly Pt[]): Pt[] {
  const out: Pt[] = [points[0]!]
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / MAX_SEGMENT_LENGTH))
    for (let k = 1; k <= n; k++) {
      out.push({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n })
    }
  }
  return out
}

function polylineDry(points: readonly Pt[], waterLevel: number, sampleHeight: HeightSampler): boolean {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    if (!pathIsDry(a.x, a.z, b.x, b.z, waterLevel, sampleHeight)) return false
  }
  return true
}

type Lane = { id: string, points: Pt[], isSpur: boolean }

/** Access point on the side of `plot` the lane should reach (door / bay / edge toward `center`). */
export function laneAccessPoint(plot: VillagePlot, center: Pt): Pt {
  if (plot.storehouse && plot.storehouse.baySlots.length > 0) {
    const bay = plot.storehouse.baySlots[0]!
    return { x: bay.x, z: bay.z }
  }
  if (plot.role === 'cemetery' && plot.cemetery) {
    // Gate side (+Z local faces the plaza): the lane stops just in front of the entrance, its edge clear of the plot.
    const { hd } = cemeteryPlotExtents(plot.cemetery.size, plot.cemetery.scale)
    return cemeteryLocalToWorld({ x: plot.x, z: plot.z, rotationY: plot.rotation }, 0, hd + CEMETERY_GATE_LANE_STOP)
  }
  if (plot.role === 'house' && plot.houseYaw !== undefined) {
    return houseLocalToWorld(plot.x, plot.z, plot.houseYaw, 0, -plot.radius)
  }
  const dx = center.x - plot.x
  const dz = center.z - plot.z
  const len = Math.hypot(dx, dz) || 1
  return { x: plot.x + (dx / len) * plot.radius, z: plot.z + (dz / len) * plot.radius }
}

/**
 * Build the lane tree. Entrances attach to the centre only (their own
 * detours); destinations attach to the nearest obstacle-free point of the
 * network built so far. Order is fixed (distance from centre, then id) so the
 * result is deterministic.
 */
export function planVillageLanes(args: {
  center: Pt
  plots: readonly VillagePlot[]
  entrances: readonly LaneEntrance[]
  destinations: readonly LaneDestination[]
  /** Plaza radius: lanes root on its rim (the open square is crossed freely). */
  plazaRadius: number
  pathHalfWidth: number
  roadHalfWidth: number
  sampleHeight: HeightSampler
  waterLevel: number
}): VillageLanePlan {
  const { center, entrances, plazaRadius, pathHalfWidth, roadHalfWidth, sampleHeight, waterLevel } = args
  const obstacles = obstaclesFromPlots(args.plots, pathHalfWidth)
  const roadYardObstacles = obstaclesFromPlots(args.plots, roadHalfWidth)
  const lanes: Lane[] = []
  const paths: VillagePathPlan[] = []
  const unresolved: string[] = []

  const emit = (id: string, route: readonly Pt[], kind: 'path' | 'road', isSpur: boolean): void => {
    const points = subdivide(route)
    if (pathLength(points) < MIN_LANE_LENGTH) return
    paths.push({ id, points, halfWidth: kind === 'road' ? roadHalfWidth : pathHalfWidth, kind })
    lanes.push({ id, points, isSpur })
  }

  // Road-width lanes (entrances) keep a wider berth around small plots.
  const roadObstacles = roadYardObstacles.map((o) =>
    o.kind === 'disc' && o.small ? { ...o, r: o.r + ROAD_LANE_EXTRA_CLEARANCE } : o)
  const rootRadius = Math.max(plazaRadius * 0.5, plazaRadius - PLAZA_ROOT_INSET)
  const rim: Pt[] = Array.from({ length: PLAZA_RIM_ROOTS }, (_, i) => ({
    x: center.x + Math.cos((i / PLAZA_RIM_ROOTS) * Math.PI * 2) * rootRadius,
    z: center.z + Math.sin((i / PLAZA_RIM_ROOTS) * Math.PI * 2) * rootRadius,
  }))
  const nearestFirst = (pts: readonly Pt[], to: Pt): Pt[] =>
    [...pts].sort((p, q) => Math.hypot(p.x - to.x, p.z - to.z) - Math.hypot(q.x - to.x, q.z - to.z)
      || p.x - q.x || p.z - q.z)

  for (const entrance of entrances) {
    const from = { x: entrance.x, z: entrance.z }
    let chosen: Pt[] | null = null
    // A gate that already sits inside a plot disc cannot be helped here.
    const gateObstacles = obstaclesExcludingPoint(entrance.kind === 'road' ? roadObstacles : obstacles, from)
    for (const k of BUILDING_PAD_STEPS) {
      const padded = withBuildingPad(gateObstacles, k)
      for (const root of nearestFirst(rim, from).slice(0, MAX_ATTACH_CANDIDATES)) {
        const route = routeAround(from, root, padded, null, MAX_DETOUR_DEPTH)
        if (route && polylineDry(route, waterLevel, sampleHeight)) {
          chosen = route
          break
        }
      }
      if (chosen) break
    }
    if (chosen) {
      emit(`path-entrance-${entrance.id}`, chosen, entrance.kind, false)
    } else if (pathIsDry(from.x, from.z, center.x, center.z, waterLevel, sampleHeight)) {
      unresolved.push(`path-entrance-${entrance.id}`)
      // Q93: never a straight line through a building — try all obstacles, else cemetery-only if that is building-free.
      const full = routeAround(from, center, gateObstacles, null, MAX_DETOUR_DEPTH)
      const lite = routeAround(from, center, cemeteryObstaclesFor(obstacles, from), null, MAX_DETOUR_DEPTH) ?? [from, center]
      const buildings = gateObstacles.filter((o) => o.kind === 'disc' && o.id !== CEMETERY_OBSTACLE_ID).map(footprintOnly)
      const route = (full && polylineDry(full, waterLevel, sampleHeight) ? full : null) ?? (lite.every((q, i) => i === 0 || firstHit(lite[i - 1]!, q, buildings, null) === null) ? lite : null)
      if (route) emit(`path-entrance-${entrance.id}`, route, entrance.kind, false)
    }
  }

  const ordered = args.destinations
    .map((dest) => ({ dest, d: Math.hypot(dest.access.x - center.x, dest.access.z - center.z) }))
    .sort((p, q) => p.d - q.d || (p.dest.id < q.dest.id ? -1 : p.dest.id > q.dest.id ? 1 : 0))

  for (const { dest } of ordered) {
    const a = resolveAccess(dest, obstacles)
    const destObstacles = obstaclesExcludingPoint(obstacles, a)
    const candidates: Pt[] = [...rim]
    for (const lane of lanes) {
      const end = lane.points[lane.points.length - 1]!
      for (let i = 0; i < lane.points.length - 1; i++) {
        const seg = distToSegment(a.x, a.z, lane.points[i]!, lane.points[i + 1]!)
        const p0 = lane.points[i]!
        const p1 = lane.points[i + 1]!
        const cand = { x: p0.x + (p1.x - p0.x) * seg.t, z: p0.z + (p1.z - p0.z) * seg.t }
        if (lane.isSpur && Math.hypot(cand.x - end.x, cand.z - end.z) < SPUR_END_NO_ATTACH) continue
        candidates.push(cand)
      }
    }
    candidates.sort((p, q) =>
      Math.hypot(p.x - a.x, p.z - a.z) - Math.hypot(q.x - a.x, q.z - a.z)
      || p.x - q.x || p.z - q.z)

    let placed = false
    for (const k of BUILDING_PAD_STEPS) {
      const padded = withBuildingPad(destObstacles, k)
      let tried = 0
      for (const attach of candidates) {
        if (tried++ >= MAX_ATTACH_CANDIDATES) break
        const route = routeAround(attach, a, padded, dest.ownPlotId, MAX_DETOUR_DEPTH)
        if (!route || !polylineDry(route, waterLevel, sampleHeight)) continue
        emit(dest.id, route, 'path', true)
        placed = true
        break
      }
      if (placed) break
    }
    if (placed) continue

    if (dest.optional) continue
    // Fallback: report, but never drop the destination (Q57 stop condition).
    if (pathIsDry(center.x, center.z, a.x, a.z, waterLevel, sampleHeight)) {
      unresolved.push(dest.id)
      const straight: Pt[] = [{ x: center.x, z: center.z }, a]
      // Q93: the straight line is only a last resort when it does not cross a building.
      const full = routeAround(straight[0]!, a, destObstacles, dest.ownPlotId, MAX_DETOUR_DEPTH)
      const lite = routeAround(straight[0]!, a, cemeteryObstaclesFor(obstacles, a), dest.ownPlotId, MAX_DETOUR_DEPTH) ?? straight
      const buildings = destObstacles.filter((o) => o.kind === 'disc' && o.id !== CEMETERY_OBSTACLE_ID).map(footprintOnly)
      const route = (full && polylineDry(full, waterLevel, sampleHeight) ? full : null) ?? (lite.every((q, i) => i === 0 || firstHit(lite[i - 1]!, q, buildings, dest.ownPlotId) === null) ? lite : null)
      if (route) emit(dest.id, route, 'path', true)
    }
  }

  return { paths, unresolved }
}

/** Q93: per-segment gate for spurs routed outside the lane tree — a segment may not enter a house/storehouse corridor. */
export function createBuildingClearance(plots: readonly VillagePlot[], laneHalfWidth = 1.5): (a: Pt, b: Pt) => boolean {
  const buildings = obstaclesFromPlots(plots.filter(isBuildingPlot), laneHalfWidth).filter((o) => o.kind === 'disc')
  return (a, b) => firstHit(a, b, buildings, null) === null
}

/** Obstacle-aware connector for spurs added after the lane tree (pasture / paddock). */
export type LaneRouter = (from: Pt, to: Pt) => Pt[] | null

export function createLaneRouter(plots: readonly VillagePlot[], laneHalfWidth = 1.5): LaneRouter {
  const obstacles = obstaclesFromPlots(plots, laneHalfWidth)
  return (from, to) => {
    // Full obstacle set first; if that cannot be routed, at least keep the lane off the cemetery (Q58).
    const route = routeAround(from, to, obstacles, null, MAX_DETOUR_DEPTH)
      ?? routeAround(from, to, cemeteryObstaclesFor(obstacles, to), null, MAX_DETOUR_DEPTH)
    return route ? subdivide(route) : null
  }
}
