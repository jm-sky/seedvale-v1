import type { RoadRiverCrossing } from './roadRiverCrossing'

/**
 * Q194 (Q44 R6): shared trunks + junctions. A pure pass over *raw* per-pair road routes (the persisted
 * `road-routes` record stays the only A* output). Two roads that share an endpoint settlement braid through
 * the same valley corridor; the lower-`pairKey` road is the *primary* and the higher-key road (the
 * *secondary*) is snapped onto the primary's exact points wherever the two run together:
 *
 * - a run is a stretch of the secondary within `NEAR_M` of the primary (short excursions bridged), at least
 *   `MIN_RUN_M` long and monotone along the primary;
 * - the run is replaced by the primary's own vertices (same `h`/`hs`), joined at junction points `J` that lie
 *   on the primary's polyline; the secondary's profile is blended to `J`'s height over `BLEND_M`;
 * - crossings inside the run are replaced by the primary's records (same ids), so a shared bridge/ford is one
 *   record, not two;
 * - a transverse crossing of a primary away from any run gets a junction vertex inserted on the secondary.
 *
 * Output depends only on the secondary's raw route and the *set* of partner raw routes (partners are
 * processed in `key` order), never on the order roads were resolved in. Depth-1 only: partners are raw.
 *
 * @domain world-terrain
 */
export type TrunkPoint = { x: number, z: number, h: number, hs: number }
export type TrunkRoute = { points: TrunkPoint[], crossings: RoadRiverCrossing[] }
export type TrunkPartner = { key: string, route: TrunkRoute }
export type TrunkEnv = {
  /** True when the straight connector a→b is dry and hits no river water. */
  connectorIsClear: (a: { x: number, z: number }, b: { x: number, z: number }) => boolean
}

/** Max distance (m) from the primary for a secondary point to count as running along it. */
const NEAR_M = 15
/** Shortest run (m of secondary arc) worth snapping. */
const MIN_RUN_M = 40
/** Shortest shared stretch (m) of primary between the two junctions. */
const MIN_TRUNK_M = 30
/** Excursion budget (m of arc, max distance) bridged inside one run. */
const GAP_ARC_M = 25
const GAP_DIST_M = 30
/** Longest connector (m) from the secondary to a junction. */
const MAX_CONNECTOR_M = 22
/** Arc (m) over which the secondary profile blends to the junction height. */
const BLEND_M = 30
/** Analysis sample spacing (m) along the secondary. */
const SAMPLE_M = 4
/** Direction tolerance (m): the projection may step back this far before the run counts as doubling back. */
const BACKTRACK_M = 6
/** Boundary search window (samples) when a run end must move off a crossing or an unclear connector. */
const BOUNDARY_SEARCH = 20
/** Clearance (m) kept between a run boundary and a crossing record (on top of half its span). */
const CROSSING_MARGIN_M = 8
/** Distance (m) under which two points are treated as the same point. */
const EPS = 0.05

type WP = TrunkPoint & { frozen: boolean }
type XZ = { x: number, z: number }

type Sample = XZ & { s: number, seg: number, t: number, frozen: boolean }
type Proj = { d: number, u: number }

function arcsOf(points: readonly XZ[]): number[] {
  const arc = [0]
  for (let i = 1; i < points.length; i++) {
    arc.push(arc[i - 1]! + Math.hypot(points[i]!.x - points[i - 1]!.x, points[i]!.z - points[i - 1]!.z))
  }
  return arc
}

/** Nearest point of a polyline to `(x, z)`: distance, arc position and segment/param. */
function project(points: readonly XZ[], arc: readonly number[], x: number, z: number): Proj & { seg: number, t: number } {
  let best = Infinity
  let bu = 0
  let bs = 0
  let bt = 0
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const dx = b.x - a.x
    const dz = b.z - a.z
    const l2 = dx * dx + dz * dz
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2)) : 0
    const ex = a.x + dx * t - x
    const ez = a.z + dz * t - z
    const d2 = ex * ex + ez * ez
    if (d2 < best) {
      best = d2
      bs = i
      bt = t
      bu = arc[i]! + (arc[i + 1]! - arc[i]!) * t
    }
  }
  return { d: Math.sqrt(best), u: bu, seg: bs, t: bt }
}

function lerpPoint(a: TrunkPoint, b: TrunkPoint, t: number): TrunkPoint {
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, h: a.h + (b.h - a.h) * t, hs: a.hs + (b.hs - a.hs) * t }
}

/** Point of a polyline at arc position `u` (clamped). */
function pointAtArc(points: readonly TrunkPoint[], arc: readonly number[], u: number): TrunkPoint {
  const last = points.length - 1
  if (u <= 0) return { ...points[0]! }
  if (u >= arc[last]!) return { ...points[last]! }
  let i = 0
  while (i < last - 1 && arc[i + 1]! < u) i++
  const span = arc[i + 1]! - arc[i]!
  return lerpPoint(points[i]!, points[i + 1]!, span > 0 ? (u - arc[i]!) / span : 0)
}

function sampleAlong(points: readonly WP[], arc: readonly number[]): Sample[] {
  const out: Sample[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const len = arc[i + 1]! - arc[i]!
    const n = Math.max(1, Math.ceil(len / SAMPLE_M))
    const frozen = a.frozen && b.frozen
    for (let k = 0; k < n; k++) {
      const t = k / n
      out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, s: arc[i]! + len * t, seg: i, t, frozen })
    }
  }
  const last = points.length - 1
  out.push({ x: points[last]!.x, z: points[last]!.z, s: arc[last]!, seg: last - 1, t: 1, frozen: points[last]!.frozen && points[last - 1]!.frozen })
  return out
}

/** Crossing centre's arc position along a polyline. */
function crossingArcs(crossings: readonly RoadRiverCrossing[], points: readonly XZ[], arc: readonly number[]): number[] {
  return crossings.map((c) => project(points, arc, c.x, c.z).u)
}

const crossingReach = (c: RoadRiverCrossing): number => c.span / 2 + CROSSING_MARGIN_M

type Run = { i0: number, i1: number, sgn: 1 | -1 }

/** Candidate runs of the working polyline along the partner, before boundary resolution. */
function candidateRuns(samples: readonly Sample[], proj: readonly (Proj | null)[]): Run[] {
  const n = samples.length
  const near = samples.map((sm, i) => !sm.frozen && proj[i] !== null && proj[i]!.d <= NEAR_M)
  const runs: Run[] = []
  let i = 0
  while (i < n) {
    if (!near[i]) { i++; continue }
    let end = i
    for (;;) {
      if (end + 1 < n && near[end + 1]) { end++; continue }
      // bridge a short excursion
      let k = end + 1
      let ok = k < n
      while (k < n && !near[k]) {
        const p = proj[k]
        if (samples[k]!.frozen || !p || p.d > GAP_DIST_M || samples[k]!.s - samples[end]!.s > GAP_ARC_M) { ok = false; break }
        k++
      }
      if (ok && k < n && near[k]) { end = k; continue }
      break
    }
    runs.push(...monotoneRuns(samples, proj, i, end))
    i = end + 1
  }
  return runs
}

/** Split `[i0, i1]` where the projection doubles back, keeping pieces that are long enough. */
function monotoneRuns(samples: readonly Sample[], proj: readonly (Proj | null)[], i0: number, i1: number): Run[] {
  const out: Run[] = []
  let start = i0
  while (start <= i1) {
    // direction from the first ~20 m with real progress
    let k = start
    while (k < i1 && Math.abs(proj[k]!.u - proj[start]!.u) < 12) k++
    const sgn: 1 | -1 = proj[k]!.u >= proj[start]!.u ? 1 : -1
    let top = proj[start]!.u * sgn
    let end = start
    for (let j = start + 1; j <= i1; j++) {
      const p = proj[j]
      if (!p) break
      const v = p.u * sgn
      if (v < top - BACKTRACK_M) break
      top = Math.max(top, v)
      end = j
    }
    if (samples[end]!.s - samples[start]!.s >= MIN_RUN_M && (proj[end]!.u - proj[start]!.u) * sgn >= MIN_RUN_M * 0.5) {
      out.push({ i0: start, i1: end, sgn })
    }
    start = end + 1
  }
  return out
}

type Resolved = { i0: number, i1: number, j0: number, j1: number }

/** Snap one secondary polyline onto one primary. Returns the (possibly unchanged) working state. */
function snapRunsOnto(
  w: WP[],
  crossings: RoadRiverCrossing[],
  q: TrunkRoute,
  env: TrunkEnv,
): { points: WP[], crossings: RoadRiverCrossing[] } {
  const qp = q.points
  if (qp.length < 2) return { points: w, crossings }
  const qArc = arcsOf(qp)
  const qCross = crossingArcs(q.crossings, qp, qArc)
  let points = w
  let cur = crossings
  for (let guard = 0; guard < 8; guard++) {
    const arc = arcsOf(points)
    const samples = sampleAlong(points, arc)
    const proj: (Proj | null)[] = samples.map((sm) => (sm.frozen ? null : project(qp, qArc, sm.x, sm.z)))
    const wCross = crossingArcs(cur, points, arc)
    let applied = false
    for (const run of candidateRuns(samples, proj)) {
      const res = resolveRun(run, samples, proj, qp, qArc, q.crossings, qCross, cur, wCross, env)
      if (!res) continue
      const next = applyRun(points, arc, samples, proj, qp, qArc, q.crossings, qCross, cur, wCross, run, res)
      points = next.points
      cur = next.crossings
      applied = true
      break
    }
    if (!applied) break
  }
  return { points, crossings: cur }
}

/** Boundary of the run on the primary (junction arc) for a sample at an end: the projection stepped along the run by its gap. */
function junctionArc(p: Proj, sgn: 1 | -1, atStart: boolean): number {
  const step = Math.min(p.d, NEAR_M)
  return atStart ? p.u + sgn * step : p.u - sgn * step
}

/**
 * Junction arc on the primary for a run end. When the plain choice would cut a primary crossing in two, the
 * junction moves to the crossing's far edge so the whole crossing stays inside the trunk (the roads often
 * part just beyond a shared ford/bridge).
 */
function fitJunction(
  p: Proj,
  sgn: 1 | -1,
  atStart: boolean,
  qLen: number,
  qCross: readonly number[],
  qRecords: readonly RoadRiverCrossing[],
  terminal: boolean,
): number | null {
  let j = junctionArc(p, sgn, atStart)
  for (let k = 0; k < 3; k++) {
    j = Math.max(0, Math.min(qLen, j))
    let hit = -1
    for (let i = 0; i < qCross.length; i++) {
      const r = crossingReach(qRecords[i]!)
      if (j > qCross[i]! - r && j < qCross[i]! + r) { hit = i; break }
    }
    if (hit < 0) return j
    const r = crossingReach(qRecords[hit]!)
    j = atStart ? qCross[hit]! - sgn * r : qCross[hit]! + sgn * r
    const x = (j - p.u) * sgn
    // a route end (settlement entrance) cannot move, so its junction may sit further back/ahead (connector length still capped)
    if (!terminal && (atStart ? x > p.d : (x < -p.d || x > 2))) return null
  }
  return null
}

function resolveRun(
  run: Run,
  samples: readonly Sample[],
  proj: readonly (Proj | null)[],
  qp: readonly TrunkPoint[],
  qArc: readonly number[],
  qCrossRecords: readonly RoadRiverCrossing[],
  qCross: readonly number[],
  wCrossRecords: readonly RoadRiverCrossing[],
  wCross: readonly number[],
  env: TrunkEnv,
): Resolved | null {
  const { sgn } = run
  const endpoint = (i: number, atStart: boolean): number | null => {
    const sm = samples[i]
    const p = proj[i]
    const terminal = i === 0 || i === samples.length - 1
    if (!sm || !p || sm.frozen || p.d > GAP_DIST_M) return null
    const j = fitJunction(p, sgn, atStart, qArc[qArc.length - 1]!, qCross, qCrossRecords, terminal)
    if (j === null || (!terminal && straddles(sm.s, wCross, wCrossRecords))) return null
    const jp = pointAtArc(qp, qArc, j)
    if (Math.hypot(jp.x - sm.x, jp.z - sm.z) > MAX_CONNECTOR_M) return null
    if (!(atStart ? env.connectorIsClear(sm, jp) : env.connectorIsClear(jp, sm))) return null
    return j
  }
  const startOk = (i: number) => endpoint(i, true)
  const endOk = (i: number) => endpoint(i, false)
  const order = (base: number, grow: 1 | -1): number[] => {
    const out = [base]
    for (let k = 1; k <= BOUNDARY_SEARCH; k++) out.push(base + grow * k)
    for (let k = 1; k <= BOUNDARY_SEARCH; k++) out.push(base - grow * k)
    return out
  }
  let i0 = -1
  let j0 = 0
  for (const i of order(run.i0, -1)) {
    const j = startOk(i)
    if (j !== null) { i0 = i; j0 = j; break }
  }
  let i1 = -1
  let j1 = 0
  for (const i of order(run.i1, 1)) {
    const j = endOk(i)
    if (j !== null) { i1 = i; j1 = j; break }
  }
  if (i0 < 0 || i1 < 0 || i1 <= i0) return null
  if (samples[i1]!.s - samples[i0]!.s < MIN_RUN_M) return null
  if ((j1 - j0) * sgn < MIN_TRUNK_M) return null
  return { i0, i1, j0, j1 }
}

/** True when arc `u` falls inside a crossing's reach (it would cut the crossing in two). */
function straddles(u: number, arcs: readonly number[], records: readonly RoadRiverCrossing[]): boolean {
  for (let i = 0; i < arcs.length; i++) {
    const r = crossingReach(records[i]!)
    if (u > arcs[i]! - r && u < arcs[i]! + r) return true
  }
  return false
}

function applyRun(
  points: readonly WP[],
  arc: readonly number[],
  samples: readonly Sample[],
  _proj: readonly (Proj | null)[],
  qp: readonly TrunkPoint[],
  qArc: readonly number[],
  qCrossRecords: readonly RoadRiverCrossing[],
  qCross: readonly number[],
  wCrossRecords: readonly RoadRiverCrossing[],
  wCross: readonly number[],
  run: Run,
  res: Resolved,
): { points: WP[], crossings: RoadRiverCrossing[] } {
  const { sgn } = run
  const sA = samples[res.i0]!.s
  const sB = samples[res.i1]!.s
  const interp = (s: number): TrunkPoint => pointAtArc(points, arc, s)
  const A = interp(sA)
  const B = interp(sB)
  const J0 = pointAtArc(qp, qArc, res.j0)
  const J1 = pointAtArc(qp, qArc, res.j1)
  const dist = (a: XZ, b: XZ) => Math.hypot(a.x - b.x, a.z - b.z)

  const out: WP[] = []
  const before: WP[] = []
  for (let i = 0; i < points.length; i++) if (arc[i]! < sA - EPS) before.push(points[i]!)
  const after: WP[] = []
  for (let i = 0; i < points.length; i++) if (arc[i]! > sB + EPS) after.push(points[i]!)

  const dA = J0.hs - A.hs
  const dB = J1.hs - B.hs
  const blend = (list: WP[], listArc: number[], origin: number, delta: number) => {
    for (let i = 0; i < list.length; i++) {
      const f = 1 - Math.abs(listArc[i]! - origin) / BLEND_M
      if (f > 0 && !list[i]!.frozen) list[i] = { ...list[i]!, hs: list[i]!.hs + delta * f }
    }
  }
  const beforeArc: number[] = []
  for (let i = 0; i < points.length; i++) if (arc[i]! < sA - EPS) beforeArc.push(arc[i]!)
  const afterArc: number[] = []
  for (let i = 0; i < points.length; i++) if (arc[i]! > sB + EPS) afterArc.push(arc[i]!)
  const beforeB = before.map((p) => ({ ...p }))
  const afterB = after.map((p) => ({ ...p }))
  blend(beforeB, beforeArc, sA, dA)
  blend(afterB, afterArc, sB, dB)

  out.push(...beforeB)
  if (dist(A, J0) > EPS) out.push({ ...A, hs: A.hs + dA, frozen: false })
  out.push({ ...J0, frozen: true })
  const mids: WP[] = []
  const idx: number[] = []
  for (let i = 0; i < qp.length; i++) {
    const u = qArc[i]!
    if ((u - res.j0) * sgn > EPS && (res.j1 - u) * sgn > EPS) idx.push(i)
  }
  if (sgn < 0) idx.reverse()
  for (const i of idx) mids.push({ ...qp[i]!, frozen: true })
  out.push(...mids)
  out.push({ ...J1, frozen: true })
  if (dist(B, J1) > EPS) out.push({ ...B, hs: B.hs + dB, frozen: false })
  out.push(...afterB)

  // crossings: prefix of the secondary, the primary's inside the trunk, suffix of the secondary
  const keep: { c: RoadRiverCrossing, k: number }[] = []
  for (let i = 0; i < wCrossRecords.length; i++) {
    if (wCross[i]! < sA) keep.push({ c: wCrossRecords[i]!, k: wCross[i]! })
  }
  const trunk: { c: RoadRiverCrossing, k: number }[] = []
  for (let i = 0; i < qCrossRecords.length; i++) {
    const u = qCross[i]!
    if ((u - res.j0) * sgn >= 0 && (res.j1 - u) * sgn >= 0) trunk.push({ c: qCrossRecords[i]!, k: sgn * u })
  }
  trunk.sort((a, b) => a.k - b.k)
  const tail: { c: RoadRiverCrossing, k: number }[] = []
  for (let i = 0; i < wCrossRecords.length; i++) {
    if (wCross[i]! > sB) tail.push({ c: wCrossRecords[i]!, k: wCross[i]! })
  }
  return { points: out, crossings: [...keep.map((e) => e.c), ...trunk.map((e) => e.c), ...tail.map((e) => e.c)] }
}

/**
 * Inserts a junction vertex on the secondary wherever it crosses the primary transversely (outside runs and
 * crossing records), taking the primary's height there. Geometry is unchanged: the vertex lies on the
 * secondary's own edge, exactly on the primary's.
 */
function insertCrossingJunctions(w: WP[], crossings: readonly RoadRiverCrossing[], q: TrunkRoute): WP[] {
  const qp = q.points
  if (qp.length < 2) return w
  const qArc = arcsOf(qp)
  let points = w
  for (let guard = 0; guard < 16; guard++) {
    const arc = arcsOf(points)
    const wCross = crossingArcs(crossings, points, arc)
    const qCross = crossingArcs(q.crossings, qp, qArc)
    let hit: { i: number, t: number, p: XZ, qSeg: number, qt: number } | null = null
    search: for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]!
      const b = points[i + 1]!
      if (a.frozen && b.frozen) continue
      for (let j = 0; j < qp.length - 1; j++) {
        const c = qp[j]!
        const d = qp[j + 1]!
        const r = (b.x - a.x) * (d.z - c.z) - (b.z - a.z) * (d.x - c.x)
        if (Math.abs(r) < 1e-9) continue
        const t = ((c.x - a.x) * (d.z - c.z) - (c.z - a.z) * (d.x - c.x)) / r
        const qt = ((c.x - a.x) * (b.z - a.z) - (c.z - a.z) * (b.x - a.x)) / r
        if (t <= 0 || t >= 1 || qt <= 0 || qt >= 1) continue
        const p = { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t }
        // already a junction (a vertex of the secondary sits on the primary here)
        if (Math.hypot(p.x - a.x, p.z - a.z) < EPS || Math.hypot(p.x - b.x, p.z - b.z) < EPS) continue
        const s = arc[i]! + (arc[i + 1]! - arc[i]!) * t
        const u = qArc[j]! + (qArc[j + 1]! - qArc[j]!) * qt
        if (straddles(s, wCross, crossings) || straddles(u, qCross, q.crossings)) continue
        hit = { i, t, p, qSeg: j, qt }
        break search
      }
    }
    if (!hit) break
    const a = points[hit.i]!
    const b = points[hit.i + 1]!
    const c = qp[hit.qSeg]!
    const d = qp[hit.qSeg + 1]!
    const qh = lerpPoint(c, d, hit.qt)
    const base = lerpPoint(a, b, hit.t)
    const s = arc[hit.i]! + (arc[hit.i + 1]! - arc[hit.i]!) * hit.t
    const delta = qh.hs - base.hs
    const next: WP[] = []
    for (let i = 0; i < points.length; i++) {
      const p = points[i]!
      const f = 1 - Math.abs(arc[i]! - s) / BLEND_M
      next.push(f > 0 && !p.frozen ? { ...p, hs: p.hs + delta * f } : p)
      if (i === hit.i) next.push({ x: hit.p.x, z: hit.p.z, h: base.h, hs: qh.hs, frozen: true })
    }
    points = next
  }
  return points
}

/**
 * Snaps `route` onto the lower-key partners. `partners` may arrive in any order and may contain `key` itself;
 * the result is identical.
 */
export function snapRouteToTrunks(
  key: string,
  route: TrunkRoute,
  partners: readonly TrunkPartner[],
  env: TrunkEnv,
): TrunkRoute {
  const primaries = partners.filter((p) => p.key < key).sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
  if (primaries.length === 0) return route
  const initial: WP[] = route.points.map((p) => ({ ...p, frozen: false }))
  let points = initial
  let crossings = [...route.crossings]
  for (const partner of primaries) {
    const r = snapRunsOnto(points, crossings, partner.route, env)
    points = r.points
    crossings = r.crossings
  }
  for (const partner of primaries) points = insertCrossingJunctions(points, crossings, partner.route)
  if (points === initial) return route
  return {
    points: points.map(({ x, z, h, hs }) => ({ x, z, h, hs })),
    crossings,
  }
}
