import type { VillagePlot } from '../../src/settlement/villagePlan'
// Usage: pnpm worldgen:roads:census [--seeds=42,415424794] [--rings=5] [--json]
// Q44 roads/paths rebuild plan, stage R0: diagnostic baseline of road + village-path quality.
// Read-only — never changes generator output. Prints a markdown table (or JSON for before/after diffs).
//
// Inter-settlement roads (`roadRoutesForSettlement`, kind 'road'), counted once per pair:
// - foreign: route passes within 0.9 × footprintRadius of a settlement that is not one of its endpoints;
// - ownBack: route re-enters its own endpoint settlement's footprint (> 1 waypoint inside 0.85 × R after leaving);
// - plotHits: route waypoints/segments inside any plot disc (houses, storehouse, infra…) or any yard rectangle;
// - entranceMis: endpoint entrance faces > 90° away from the neighbour (road has to swing around the village);
// - crossings: proper intersections between two different roads away from settlements (no junction exists);
// - parallel: metres of road running within 2 × roadHalfWidth of another road, away from settlements;
// - sinuosity p50/p90 (length / chord) and sharp turns (> 50° between consecutive segments) per km.
// - bridges (Q97): declared bridge decks (`bridgeSpecOf`); bridgeOff = decks whose axis drifts > 1 m from the
//   road centreline anywhere along the deck; bridgeOffMax = worst lateral offset (m); bridgeTurnMax = worst angle
//   (°) between the deck axis and the road heading at a deck end.
//   Q193: bridgeStepMax = worst |approach road profile - deck end height| over both deck ends (m);
//   bridgeGradeMax = steepest deck slope (%, end-to-end rise over span). `--bridges` prints the worst deck.
// Village paths (`def.plan.paths`):
// - pathPlot: paths crossing a non-plaza plot disc that is not the path's own endpoint (per-class breakdown incl. plaza);
// - pathYard: path segments crossing a house yard rectangle (Q35 fences).
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { pointInYard } from '../../src/settlement/householdYard'
import { bridgeSpecOf, clearRoadNetworkCaches, type RoadNetworkContext, type RoadRoute, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { censusHydrologyId } from './censusHydrology'

const HOME_RADIUS = 56

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '5'))
const asJson = process.argv.includes('--json')

function terrainSnapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS, hydrologyId: censusHydrologyId(seed),
  }
}

type P = { x: number, z: number }
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.z - b.z)
function segPointDist(p: P, a: P, b: P): number {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const l2 = dx * dx + dz * dz
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / l2)) : 0
  return Math.hypot(a.x + dx * t - p.x, a.z + dz * t - p.z)
}
function segIntersect(a: P, b: P, c: P, d: P): boolean {
  const o = (p: P, q: P, r: P) => (q.x - p.x) * (r.z - p.z) - (q.z - p.z) * (r.x - p.x)
  const d1 = o(c, d, a)
  const d2 = o(c, d, b)
  const d3 = o(a, b, c)
  const d4 = o(a, b, d)
  return d1 * d2 < 0 && d3 * d4 < 0
}
/** Densify a polyline to ~step metres so disc/rectangle tests catch thin crossings. */
function densify(points: readonly P[], step = 1.5): P[] {
  const out: P[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const n = Math.max(1, Math.ceil(dist(a, b) / step))
    for (let k = 0; k < n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n })
  }
  out.push(points[points.length - 1]!)
  return out
}
/** Coarse plot class for the breakdown; plaza furniture (market/campfire/notice/well) is grouped. */
function roleOf(plot: VillagePlot): string {
  if (plot.role === 'house') return 'house'
  if (plot.id.includes('storehouse')) return 'storehouse'
  if (plot.id.includes('garden')) return 'garden'
  if (/market|campfire|notice|plot-infra-well$/.test(plot.id)) return 'plaza'
  if (plot.id.includes('well')) return 'hhWell'
  if (plot.id.includes('stockpile')) return 'stockpile'
  return plot.role
}
const fmt = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')
const pct = (v: number[], p: number) => {
  const s = [...v].sort((a, b) => a - b)
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : NaN
}

type Row = Record<string, number | string>

function measure(seed: number): Row {
  clearSettlementDefCache()
  clearRoadNetworkCaches()
  clearCemeteryCaches()
  const snap = terrainSnapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  const R = (d: SettlementDef) => villageSizeConfig(d.size).footprintRadius
  const nearestDef = (p: P) => defs.reduce((best, o) => (dist(o, p) < dist(best, p) ? o : best))
  const roadHalf = snap.region.roadNetwork.roadHalfWidth
  const awayFromSettlements = (p: P) => defs.every((d) => dist(d, p) > R(d) * 1.1)

  // Unique roads by endpoint pair.
  const roads = new Map<string, { route: RoadRoute, a: SettlementDef, b: SettlementDef }>()
  let noRoad = 0
  for (const d of defs) {
    const rs = roadRoutesForSettlement(d, ctx).filter((r) => r.kind === 'road')
    if (rs.length === 0) noRoad++
    for (const r of rs) {
      const a = nearestDef(r.points[0]!)
      const b = nearestDef(r.points[r.points.length - 1]!)
      if (a === b) continue
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`
      if (!roads.has(key)) roads.set(key, { route: r, a, b })
    }
  }

  const roadPlotRoles: Record<string, number> = {}
  const pathPlotRoles: Record<string, number> = {}
  let foreign = 0
  let ownBack = 0
  let plotHitRoads = 0
  let yardHitRoads = 0
  let entranceMis = 0
  const sinuosity: number[] = []
  let sharpTurns = 0
  let totalKm = 0
  const roadList = [...roads.values()]
  for (const { route, a, b } of roadList) {
    const pts = route.points
    const dense = densify(pts)
    // foreign settlement footprint
    if (defs.some((d) => d !== a && d !== b && dense.some((p) => dist(d, p) < R(d) * 0.9))) foreign++
    // re-entering own footprint after leaving it
    for (const own of [a, b]) {
      let left = false
      let back = false
      const seq = own === a ? dense : [...dense].reverse()
      for (const p of seq) {
        const inside = dist(own, p) < R(own) * 0.85
        if (!inside && dist(own, p) > R(own)) left = true
        else if (inside && left) back = true
      }
      if (back) ownBack++
    }
    // plots / yards of any settlement
    let plotHit = false
    let yardHit = false
    for (const d of defs) {
      if (dense.every((p) => dist(d, p) > R(d) + 30)) continue
      for (const plot of d.plan.plots as readonly VillagePlot[]) {
        if (dense.some((p) => dist(plot, p) < plot.radius * 0.8)) {
          plotHit = true
          roadPlotRoles[roleOf(plot)] = (roadPlotRoles[roleOf(plot)] ?? 0) + 1
          const hit = dense.find((p) => dist(plot, p) < plot.radius * 0.8)!
          console.error(`plotHit seed ${seed} ${a.id}|${b.id} plot ${plot.id} (${roleOf(plot)}) at ${hit.x.toFixed(0)},${hit.z.toFixed(0)} dEnd ${Math.min(dist(hit, dense[0]!), dist(hit, dense[dense.length - 1]!)).toFixed(0)} m`)
        }
        if (plot.yard && dense.some((p) => pointInYard(plot.yard!, p.x, p.z))) yardHit = true
      }
    }
    if (plotHit) plotHitRoads++
    if (yardHit) yardHitRoads++
    // entrance alignment: first waypoint vs neighbour bearing
    for (const [own, other, p] of [[a, b, pts[0]!], [b, a, pts[pts.length - 1]!]] as const) {
      const ex = p.x - own.x
      const ez = p.z - own.z
      const tx = other.x - own.x
      const tz = other.z - own.z
      const cos = (ex * tx + ez * tz) / ((Math.hypot(ex, ez) || 1) * (Math.hypot(tx, tz) || 1))
      if (cos < 0) entranceMis++
    }
    let len = 0
    for (let i = 0; i < pts.length - 1; i++) len += dist(pts[i]!, pts[i + 1]!)
    sinuosity.push(len / Math.max(1, dist(pts[0]!, pts[pts.length - 1]!)))
    totalKm += len / 1000
    for (let i = 1; i < pts.length - 1; i++) {
      const ux = pts[i]!.x - pts[i - 1]!.x
      const uz = pts[i]!.z - pts[i - 1]!.z
      const vx = pts[i + 1]!.x - pts[i]!.x
      const vz = pts[i + 1]!.z - pts[i]!.z
      const c = (ux * vx + uz * vz) / ((Math.hypot(ux, uz) || 1) * (Math.hypot(vx, vz) || 1))
      if (c < Math.cos((50 * Math.PI) / 180)) sharpTurns++
    }
  }

  // Q97: bridge deck axis vs road centreline
  let bridges = 0
  let bridgeOff = 0
  let bridgeOffMax = 0
  let bridgeTurnMax = 0
  let bridgeStepMax = 0
  let bridgeGradeMax = 0
  let worstStep = { step: 0, id: '' }
  let worstGrade = { grade: 0, id: '', x: 0, z: 0 }
  const polyDist = (p: P, pts: readonly P[]) => {
    let best = Infinity
    for (let i = 0; i < pts.length - 1; i++) best = Math.min(best, segPointDist(p, pts[i]!, pts[i + 1]!))
    return best
  }
  /** Road heading (unit) on the segment nearest `p`. */
  const headingNear = (p: P, pts: readonly P[]) => {
    let best = Infinity
    let k = 0
    for (let i = 0; i < pts.length - 1; i++) {
      const d = segPointDist(p, pts[i]!, pts[i + 1]!)
      if (d < best) { best = d; k = i }
    }
    const dx = pts[k + 1]!.x - pts[k]!.x
    const dz = pts[k + 1]!.z - pts[k]!.z
    const l = Math.hypot(dx, dz) || 1
    return { x: dx / l, z: dz / l }
  }
  for (const { route } of roadList) {
    for (const crossing of route.crossings) {
      if (crossing.kind !== 'bridge') continue
      bridges++
      const spec = bridgeSpecOf(crossing, route, snap.region.roadNetwork)
      const half = spec.span / 2
      let off = 0
      for (let s = -half; s <= half + 1e-6; s += 1) {
        off = Math.max(off, polyDist({ x: spec.x + spec.dirX * s, z: spec.z + spec.dirZ * s }, route.points))
      }
      let turn = 0
      for (const s of [-half, half]) {
        const h = headingNear({ x: spec.x + spec.dirX * s, z: spec.z + spec.dirZ * s }, route.points)
        const c = Math.abs(h.x * spec.dirX + h.z * spec.dirZ)
        turn = Math.max(turn, (Math.acos(Math.min(1, c)) * 180) / Math.PI)
      }
      // Q193: step between each deck end and the approach road surface (route profile `hs` interpolated
      // along the polyline), and the deck grade (end-to-end rise over span).
      const profileAt = (q: P) => {
        let best = Infinity
        let hh = 0
        for (let i = 0; i < route.points.length - 1; i++) {
          const a = route.points[i]!
          const b = route.points[i + 1]!
          const dx = b.x - a.x
          const dz = b.z - a.z
          const l2 = dx * dx + dz * dz
          const t = l2 > 0 ? Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.z - a.z) * dz) / l2)) : 0
          const d = Math.hypot(a.x + dx * t - q.x, a.z + dz * t - q.z)
          if (d < best) { best = d; hh = a.hs + (b.hs - a.hs) * t }
        }
        return hh
      }
      const step0 = Math.abs(profileAt({ x: spec.x - spec.dirX * half, z: spec.z - spec.dirZ * half }) - spec.deckY0)
      const step1 = Math.abs(profileAt({ x: spec.x + spec.dirX * half, z: spec.z + spec.dirZ * half }) - spec.deckY1)
      const step = Math.max(step0, step1)
      const grade = (Math.abs(spec.deckY1 - spec.deckY0) / spec.span) * 100
      bridgeStepMax = Math.max(bridgeStepMax, step)
      bridgeGradeMax = Math.max(bridgeGradeMax, grade)
      if (step > worstStep.step) worstStep = { step, id: crossing.id }
      if (grade > worstGrade.grade) worstGrade = { grade, id: crossing.id, x: spec.x, z: spec.z }
      if (off > 1) bridgeOff++
      bridgeOffMax = Math.max(bridgeOffMax, off)
      bridgeTurnMax = Math.max(bridgeTurnMax, turn)
      if (process.argv.includes('--bridges')) {
        console.error(`bridge seed ${seed} ${crossing.id} at ${spec.x.toFixed(0)},${spec.z.toFixed(0)} span ${spec.span.toFixed(1)} off ${off.toFixed(2)} m turn ${turn.toFixed(0)}°`)
      }
    }
  }
  if (process.argv.includes('--bridges')) {
    console.error(`Q193 seed ${seed} worst step ${worstStep.step.toFixed(2)} m (${worstStep.id}); steepest deck ${worstGrade.grade.toFixed(1)} % (${worstGrade.id} at ${worstGrade.x.toFixed(0)},${worstGrade.z.toFixed(0)})`)
  }

  // road × road crossings and parallel overlap away from settlements
  let crossings = 0
  let parallelM = 0
  for (let i = 0; i < roadList.length; i++) {
    const A = roadList[i]!.route.points
    for (let j = i + 1; j < roadList.length; j++) {
      const B = roadList[j]!.route.points
      for (let s = 0; s < A.length - 1; s++) {
        for (let t = 0; t < B.length - 1; t++) {
          if (segIntersect(A[s]!, A[s + 1]!, B[t]!, B[t + 1]!) && awayFromSettlements(A[s]!)) crossings++
        }
      }
      for (const p of densify(A, 3)) {
        if (!awayFromSettlements(p)) continue
        let near = false
        for (let t = 0; t < B.length - 1 && !near; t++) near = segPointDist(p, B[t]!, B[t + 1]!) < roadHalf * 2
        if (near) parallelM += 3
      }
    }
  }

  // village paths vs plots / yards
  let paths = 0
  let pathPlot = 0
  let pathYard = 0
  for (const d of defs) {
    const plots = d.plan.plots as readonly VillagePlot[]
    for (const path of d.plan.paths) {
      paths++
      const dense = densify(path.points)
      const ends = [path.points[0]!, path.points[path.points.length - 1]!]
      const hitPlots = plots.filter((plot) =>
        ends.every((e) => dist(e, plot) > plot.radius) && dense.some((p) => dist(plot, p) < plot.radius * 0.8))
      for (const plot of hitPlots) pathPlotRoles[roleOf(plot)] = (pathPlotRoles[roleOf(plot)] ?? 0) + 1
      const hitsPlot = hitPlots.some((plot) => roleOf(plot) !== 'plaza')
      const hitsYard = plots.some((plot) => plot.yard && dense.some((p) => pointInYard(plot.yard!, p.x, p.z)))
      if (hitsPlot) pathPlot++
      if (hitsYard) pathYard++
    }
  }

  return {
    seed,
    settlements: defs.length,
    roads: roadList.length,
    noRoad,
    foreign,
    ownBack,
    plotHit: plotHitRoads,
    yardHit: yardHitRoads,
    entranceMis,
    crossings,
    parallelM: Math.round(parallelM),
    sinuosity: `${pct(sinuosity, 0.5).toFixed(2)}/${pct(sinuosity, 0.9).toFixed(2)}`,
    sharpPerKm: (sharpTurns / Math.max(totalKm, 1e-6)).toFixed(1),
    bridges,
    bridgeOff,
    bridgeOffMax: bridgeOffMax.toFixed(1),
    bridgeTurnMax: Math.round(bridgeTurnMax),
    bridgeStepMax: bridgeStepMax.toFixed(2),
    bridgeGradeMax: `${bridgeGradeMax.toFixed(1)}%`,
    paths,
    pathPlot,
    pathYard,
    roadPlotRoles: fmt(roadPlotRoles),
    pathPlotRoles: fmt(pathPlotRoles),
  }
}

const rows = seeds.map(measure)
if (asJson) {
  console.log(JSON.stringify(rows, null, 2))
} else {
  const cols = Object.keys(rows[0]!)
  console.log(`| ${cols.join(' | ')} |`)
  console.log(`| ${cols.map(() => '---').join(' | ')} |`)
  for (const r of rows) console.log(`| ${cols.map((c) => r[c]).join(' | ')} |`)
}
