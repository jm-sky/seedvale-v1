// Usage: pnpm worldgen:travel:census [--seeds=42,415424794] [--json] [--routes-out=<dir>]
// tools-026 D3 (Q113): whole-continent route-weighted travel census. Diagnostic only.
//  - per layout edge: straight distance, entrance-to-entrance polyline length, access legs (centre→entrance), route
//    ratio, hours as "distance ÷ speed ESTIMATE" for player (6 m/s) and NPC travel (3.6 m/s), grades, river crossings;
//  - unrouted edges (layout-adjacent pair with no road in roadRoutesForSettlement of either end — failed route OR beyond
//    the per-settlement road cap; the census cannot tell which);
//  - connectivity over ROUTED edges (true route connectivity) next to the layout-adjacency component count;
//  - selected / defined / road-connected settlement counts;
//  - land coverage by straight-line hours from the nearest settlement (2/5/8 h, wilderness > 5 h), per quadrant of home;
//  - share of route length per grade class (the D2 "slope along road polylines" figure);
//  - author route: home edge leaving WEST (−x) on the north-up map (seed 415424794), candidates listed, never inferred.
import { mkdirSync, writeFileSync } from 'node:fs'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, type RoadNetworkContext, type RoadRoute, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { cellKey, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { setSettlementLayoutOverrides } from '../../src/settlement/settlementLayout'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor, settlementLayoutFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { WORLD_HALF_EXTENT } from '../../src/terrain/continentMask'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { DEFAULT_GAME_HOUR_REAL_SEC, NPC_TRAVEL_SPEED, PLAYER_WALK_SPEED, TRAVEL_HOUR_M } from '../../src/world/travelUnits'
import { censusHydrologyId } from './censusHydrology'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const asJson = process.argv.includes('--json')
const routesOut = arg('routes-out', '')
// world-terrain-063 V0: layout overrides (tooling only). Run each variant in a fresh process (see settlement-variants.ts).
const overrideTarget = arg('target', '')
const overrideSpacing = arg('spacing', '')
if (overrideTarget || overrideSpacing) {
  setSettlementLayoutOverrides({
    ...(overrideTarget ? { target: Number(overrideTarget) } : {}),
    ...(overrideSpacing ? { startSpacing: Number(overrideSpacing) } : {}),
  })
}
const NPC_HOUR_M = NPC_TRAVEL_SPEED * DEFAULT_GAME_HOUR_REAL_SEC
const GRADE_EDGES_DEG = [5, 10, 20, 30]
const GRADE_LABELS = ['<5°', '5–10°', '10–20°', '20–30°', '≥30°']
const AUTHOR_SEED = 415424794

type P = { x: number, z: number }
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.z - b.z)
const r1 = (n: number) => Math.round(n * 10) / 10
const r2 = (n: number) => Math.round(n * 100) / 100
const pct = (v: number[], p: number) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : 0 }

function snapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56, hydrologyId: censusHydrologyId(seed),
  }
}

/** Grades (deg) along a polyline at ~`step` m, in the travel direction. */
function gradesAlong(points: readonly P[], h: (x: number, z: number) => number, step = 20): { grades: number[], lengths: number[] } {
  const grades: number[] = []
  const lengths: number[] = []
  let prev = points[0]!
  let prevH = h(prev.x, prev.z)
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const n = Math.max(1, Math.ceil(dist(a, b) / step))
    for (let k = 1; k <= n; k++) {
      const p = { x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n }
      const acc = dist(prev, p)
      if (acc >= step || (i === points.length - 2 && k === n)) {
        const ph = h(p.x, p.z)
        grades.push((Math.atan2(ph - prevH, acc) * 180) / Math.PI)
        lengths.push(acc)
        prev = p; prevH = ph
      }
    }
  }
  return { grades, lengths }
}
const classOf = (deg: number) => { const a = Math.abs(deg); let c = 0; while (c < GRADE_EDGES_DEG.length && a >= GRADE_EDGES_DEG[c]!) c++; return c }

function measure(seed: number) {
  clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
  const snap = snapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const layout = settlementLayoutFor(ctx)
  const defs: SettlementDef[] = []
  for (const s of layout.sites) { const d = settlementDefFor(s.cell, ctx); if (d) defs.push(d) }
  const byId = new Map(defs.map((d) => [d.id, d]))

  // Layout-adjacency edges (defined) and their component count.
  const defined = new Map<string, { a: SettlementDef, b: SettlementDef }>()
  for (const s of layout.sites) {
    const a = byId.get(cellKey(s.cell))
    if (!a) continue
    for (const n of layout.neighborsOf(s.cell)) {
      const b = byId.get(cellKey(n.cell))
      if (!b) continue
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`
      if (!defined.has(key)) defined.set(key, a.id < b.id ? { a, b } : { a: b, b: a })
    }
  }
  const nearestDef = (p: P) => defs.reduce((best, o) => (dist(o, p) < dist(best, p) ? o : best))
  // Routed edges: road routes between two settlements (either end's roadRoutesForSettlement).
  const routed = new Map<string, RoadRoute>()
  for (const d of defs) {
    for (const r of roadRoutesForSettlement(d, ctx)) {
      if (r.kind !== 'road') continue
      const a = nearestDef(r.points[0]!)
      const b = nearestDef(r.points[r.points.length - 1]!)
      if (a === b) continue
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`
      if (!routed.has(key)) routed.set(key, r)
    }
  }
  const components = (edges: Iterable<string>) => {
    const parent = new Map(defs.map((d) => [d.id, d.id]))
    const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!))
    for (const e of edges) { const [a, b] = e.split('|') as [string, string]; if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b)) }
    const sizes = new Map<string, number>()
    for (const d of defs) sizes.set(find(d.id), (sizes.get(find(d.id)) ?? 0) + 1)
    return [...sizes.values()].sort((x, y) => y - x)
  }
  const layoutComps = components(defined.keys())
  const routedComps = components(routed.keys())

  const h = (x: number, z: number) => ctx.sampleHeight(x, z)
  const edgeRows = [...routed.entries()].map(([key, route]) => {
    const [aId, bId] = key.split('|') as [string, string]
    const a = byId.get(aId)!
    const b = byId.get(bId)!
    const pts = route.points
    let len = 0
    for (let i = 0; i < pts.length - 1; i++) len += dist(pts[i]!, pts[i + 1]!)
    const straight = dist(a, b)
    const accessA = dist(a, dist(a, pts[0]!) < dist(a, pts[pts.length - 1]!) ? pts[0]! : pts[pts.length - 1]!)
    const accessB = dist(b, dist(b, pts[0]!) < dist(b, pts[pts.length - 1]!) ? pts[0]! : pts[pts.length - 1]!)
    const g = gradesAlong(pts, h)
    const cls = new Array(GRADE_LABELS.length).fill(0) as number[]
    g.grades.forEach((gr, i) => { cls[classOf(gr)]! += g.lengths[i]! })
    // Water on the straight chord (bay / lake / sea): detour cause evidence.
    let chordWaterM = 0
    const n = Math.max(2, Math.ceil(straight / 20))
    for (let k = 0; k < n; k++) if (h(a.x + ((b.x - a.x) * (k + 0.5)) / n, a.z + ((b.z - a.z) * (k + 0.5)) / n) <= snap.waterLevel + 0.01) chordWaterM += straight / n
    return {
      a: aId, b: bId, sizes: `${a.size}-${b.size}`, straightM: Math.round(straight), polylineM: Math.round(len), accessLegsM: Math.round(accessA + accessB),
      ratio: r2(len / Math.max(1, straight)), hoursPlayerEst: r2((len + accessA + accessB) / TRAVEL_HOUR_M), hoursNpcEst: r2((len + accessA + accessB) / NPC_HOUR_M),
      riverCrossings: route.crossings.length, maxGradeDeg: r1(Math.max(0, ...g.grades.map(Math.abs))),
      gradeShareOver10Pct: r1((100 * (cls[2]! + cls[3]! + cls[4]!)) / Math.max(1, len)), chordWaterM: Math.round(chordWaterM), _cls: cls, _route: route,
    }
  })
  const unrouted = [...defined.keys()].filter((k) => !routed.has(k))
  const totalLen = edgeRows.reduce((s, e) => s + e.polylineM, 0)
  const gradeShare = Object.fromEntries(GRADE_LABELS.map((l, i) => [l, r1((100 * edgeRows.reduce((s, e) => s + e._cls[i]!, 0)) / Math.max(1, totalLen))]))

  // Coverage: land cells on a 120 m grid, straight-line hours to the nearest settlement.
  const step = 120
  let land = 0
  const within = { h2: 0, h5: 0, h8: 0 }
  let wilderness = 0
  const quad: Record<string, { land: number, covered5: number }> = { NE: { land: 0, covered5: 0 }, NW: { land: 0, covered5: 0 }, SE: { land: 0, covered5: 0 }, SW: { land: 0, covered5: 0 } }
  for (let x = -WORLD_HALF_EXTENT; x <= WORLD_HALF_EXTENT; x += step) for (let z = -WORLD_HALF_EXTENT; z <= WORLD_HALF_EXTENT; z += step) {
    if (h(x, z) <= snap.waterLevel + 1) continue
    land++
    let best = Infinity
    for (const d of defs) best = Math.min(best, Math.hypot(d.x - x, d.z - z))
    const hrs = best / TRAVEL_HOUR_M
    if (hrs <= 2) within.h2++
    if (hrs <= 5) within.h5++
    if (hrs <= 8) within.h8++
    if (hrs > 5) wilderness++
    const q = quad[`${z < 0 ? 'N' : 'S'}${x >= 0 ? 'E' : 'W'}`]!
    q.land++
    if (hrs <= 5) q.covered5++
  }

  // Author route (home edge leaving west on the north-up map: x east, z south).
  let authorRoute: unknown = 'n/a (only seed 415424794)'
  const home = byId.get('0_0')
  if (seed === AUTHOR_SEED && home) {
    const cands = edgeRows.filter((e) => e.a === home.id || e.b === home.id).map((e) => {
      const route = e._route
      const pts = dist(home, route.points[0]!) <= dist(home, route.points[route.points.length - 1]!) ? route.points : [...route.points].reverse()
      const far = pts.find((p) => dist(home, p) > 120) ?? pts[pts.length - 1]!
      const bearing = (Math.atan2(far.z - home.z, far.x - home.x) * 180) / Math.PI // 0 = east, 90 = south
      const westDeg = Math.abs(((bearing - 180 + 540) % 360) - 180)
      const other = byId.get(e.a === home.id ? e.b : e.a)!
      const out = gradesAlong(pts, h)
      const back = gradesAlong([...pts].reverse(), h)
      return {
        to: other.id, toSize: other.size, toX: Math.round(other.x), toZ: Math.round(other.z), leavesBearingDeg: Math.round(bearing), degFromWest: Math.round(westDeg),
        polylineM: e.polylineM, straightM: e.straightM, ratio: e.ratio, hoursPlayerEst: e.hoursPlayerEst, riverCrossings: e.riverCrossings, chordWaterM: e.chordWaterM,
        gradeOutDeg: { max: r1(Math.max(...out.grades)), min: r1(Math.min(...out.grades)), meanAbs: r1(out.grades.reduce((s, g) => s + Math.abs(g), 0) / out.grades.length) },
        gradeBackDeg: { max: r1(Math.max(...back.grades)), min: r1(Math.min(...back.grades)) },
        gradeShareOver10Pct: e.gradeShareOver10Pct,
        sampledGradesOutDeg: out.grades.filter((_, i) => i % 5 === 0).map(r1),
      }
    }).sort((a, b) => a.degFromWest - b.degFromWest)
    authorRoute = { note: 'candidates sorted by angle from west; author confirms which one (timed in-game walk → queue §2)', ambiguous: cands.length > 1 && cands[1]!.degFromWest - cands[0]!.degFromWest < 30, candidates: cands }
  }

  if (routesOut) {
    mkdirSync(routesOut, { recursive: true })
    writeFileSync(`${routesOut}/travel-routes-${seed}.json`, JSON.stringify({
      seed, settlements: defs.map((d) => ({ id: d.id, size: d.size, x: Math.round(d.x), z: Math.round(d.z) })),
      defined: [...defined.keys()], routed: edgeRows.map((e) => ({ a: e.a, b: e.b, points: e._route.points.map((p) => [Math.round(p.x), Math.round(p.z)]) })),
    }))
  }
  const rows = edgeRows.map(({ _cls, _route, ...r }) => r)
  return {
    seed, assumptions: `hours = distance ÷ speed ESTIMATE (player ${PLAYER_WALK_SPEED} m/s = ${TRAVEL_HOUR_M} m/game-h; NPC travel ${NPC_TRAVEL_SPEED} m/s = ${Math.round(NPC_HOUR_M)} m/game-h); coverage hours are straight-line`,
    counts: { selected: layout.sites.length, defined: defs.length, definedEdges: defined.size, routedEdges: routed.size, unroutedEdges: unrouted.length, roadConnectedInLargestComponent: routedComps[0] ?? 0 },
    connectivity: { layoutAdjacencyComponents: layoutComps.length, routedComponents: routedComps.length, routedComponentSizes: routedComps.slice(0, 8) },
    unroutedEdges: unrouted.map((k) => { const [a, b] = k.split('|') as [string, string]; return { a, b, straightM: Math.round(dist(byId.get(a)!, byId.get(b)!)) } }),
    routeStats: {
      totalKm: r1(totalLen / 1000), polylineM: { p10: pct(rows.map((r) => r.polylineM), 0.1), p50: pct(rows.map((r) => r.polylineM), 0.5), p90: pct(rows.map((r) => r.polylineM), 0.9), max: Math.max(0, ...rows.map((r) => r.polylineM)) },
      ratio: { p50: pct(rows.map((r) => r.ratio), 0.5), p90: pct(rows.map((r) => r.ratio), 0.9), max: Math.max(0, ...rows.map((r) => r.ratio)) },
      hoursPlayerEst: { p50: pct(rows.map((r) => r.hoursPlayerEst), 0.5), p90: pct(rows.map((r) => r.hoursPlayerEst), 0.9), max: Math.max(0, ...rows.map((r) => r.hoursPlayerEst)) },
      hoursNpcEst: { p50: pct(rows.map((r) => r.hoursNpcEst), 0.5), p90: pct(rows.map((r) => r.hoursNpcEst), 0.9), max: Math.max(0, ...rows.map((r) => r.hoursNpcEst)) },
      riverCrossings: rows.reduce((s, r) => s + r.riverCrossings, 0), gradeSharePctOfRouteLength: gradeShare,
    },
    coverage: {
      landKm2: r1((land * step * step) / 1e6), within2hPct: r1((100 * within.h2) / land), within5hPct: r1((100 * within.h5) / land), within8hPct: r1((100 * within.h8) / land), wildernessOver5hPct: r1((100 * wilderness) / land),
      quadrantWithin5hPct: Object.fromEntries(Object.entries(quad).map(([k, v]) => [k, v.land ? r1((100 * v.covered5) / v.land) : null])),
    },
    authorRoute, edges: rows,
  }
}

const results = seeds.map(measure)
if (asJson) console.log(JSON.stringify(results, null, 2))
else for (const r of results) {
  const { edges, authorRoute, ...head } = r
  console.log(JSON.stringify(head, null, 2))
  if (r.seed === AUTHOR_SEED) console.log('authorRoute', JSON.stringify(authorRoute, null, 2))
  console.log(`(${edges.length} routed edges; use --json for the per-edge table)\n`)
}
