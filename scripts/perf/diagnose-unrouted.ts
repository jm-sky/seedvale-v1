import type { SettlementDef } from '../../src/settlement/settlementGenerator'
// Usage: pnpm exec tsx scripts/perf/diagnose-unrouted.ts [--seeds=42,415424794] [--target=N --spacing=M]
// world-terrain-063 Q127 diagnostic: why does a layout-adjacent settlement pair have no road? For every unrouted pair
// re-runs the router A* (`findRoute`, default box) between the same entrances with (1) the real river segments and
// (2) rivers removed (land-only). Classifies: `riverReject` (a land path exists, every way across needs a crossing the
// evaluator rejects), `waterBlocked` (no dry path inside the default box even without rivers — sea inlet, lake, island;
// the router's wider-box retry decides those), `routerFindsItNow` (default box succeeds in isolation). River crossings
// on the straight entrance chord are listed with reject reasons. Diagnostic only; changes nothing.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, entranceToward, findRoute, neighborsFor, type RoadNetworkContext, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { evaluateRoadRiverCrossing, riverHitsOnEdge } from '../../src/settlement/roadRiverCrossing'
import { setSettlementLayoutOverrides } from '../../src/settlement/settlementLayout'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor, settlementLayoutFor, worldRiverQuery } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { censusHydrologyId } from './censusHydrology'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const t0 = arg('target', '')
const s0 = arg('spacing', '')
if (t0 || s0) setSettlementLayoutOverrides({ ...(t0 ? { target: Number(t0) } : {}), ...(s0 ? { startSpacing: Number(s0) } : {}) })

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

for (const seed of seeds) {
  clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
  const snap = snapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const layout = settlementLayoutFor(ctx)
  const defs = layout.sites.map((s) => settlementDefFor(s.cell, ctx)).filter((d): d is SettlementDef => !!d)
  const byId = new Map(defs.map((d) => [d.id, d]))
  const routedPairs = new Set<string>()
  const pk = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)
  const nearest = (p: { x: number, z: number }) => defs.reduce((b, o) => (Math.hypot(o.x - p.x, o.z - p.z) < Math.hypot(b.x - p.x, b.z - p.z) ? o : b))
  for (const d of defs) for (const r of roadRoutesForSettlement(d, ctx)) {
    if (r.kind !== 'road') continue
    const a = nearest(r.points[0]!); const b = nearest(r.points[r.points.length - 1]!)
    if (a !== b) routedPairs.add(pk(a.id, b.id))
  }
  const pairs = new Set<string>()
  for (const d of defs) for (const n of neighborsFor({ gx: d.gx, gz: d.gz }, ctx)) pairs.add(pk(d.id, n.id))
  const query = worldRiverQuery()!
  const opts = (a: { x: number, z: number }, b: { x: number, z: number }, rivers: boolean) => {
    const margin = 9 * 5
    const size = Math.max(Math.abs(a.x - b.x), Math.abs(a.z - b.z)) + margin * 2 + 64
    return {
      gridStep: 9, elevationWeight: 6, smoothingWindow: ctx.region.roadNetwork.smoothingWindow,
      meanderAmplitude: ctx.region.roadNetwork.meanderAmplitude, meanderScale: ctx.region.roadNetwork.meanderScale, seed: ctx.seed,
      sampleHeight: ctx.sampleHeight, sampleMountainRidge: ctx.terrainSamplers.sampleMountainRidge, waterLevel: ctx.waterLevel,
      riverSegments: rivers ? query.segmentsNear((a.x + b.x) / 2, (a.z + b.z) / 2, size) : [], routeKind: 'road' as const, routeId: 'diag',
    }
  }
  const tally: Record<string, number> = {}
  const rows: string[] = []
  for (const key of [...pairs].sort()) {
    if (routedPairs.has(key)) continue
    const [aId, bId] = key.split('|') as [string, string]
    const A = byId.get(aId)!; const B = byId.get(bId)!
    const from = entranceToward(A, B); const to = entranceToward(B, A)
    const withRivers = findRoute(from, to, opts(from, to, true))
    const dry = findRoute(from, to, opts(from, to, false))
    let cause: string
    if (withRivers) cause = 'routerFindsItNow'
    else if (!dry) cause = 'waterBlocked'
    else cause = 'riverReject'
    // Rejected crossings on the straight entrance chord, by reason.
    const segs = opts(from, to, true).riverSegments
    const reasons: string[] = []
    for (const hit of riverHitsOnEdge(from.x, from.z, to.x, to.z, segs)) {
      const f = hit.facts
      const v = evaluateRoadRiverCrossing(f, 'road')
      reasons.push(v.kind === 'reject' ? `REJECT(w${f.waterWidth.toFixed(1)} span${f.span.toFixed(1)} sin${f.crossSin.toFixed(2)})` : v.kind)
    }
    tally[cause] = (tally[cause] ?? 0) + 1
    rows.push(`  ${aId}–${bId} ${Math.round(Math.hypot(A.x - B.x, A.z - B.z))} m: ${cause}; chord crossings: ${reasons.join(', ') || 'none'}`)
  }
  console.log(`seed ${seed}: ${pairs.size} layout pairs, ${routedPairs.size} routed`, JSON.stringify(tally))
  for (const r of rows) console.log(r)
}
