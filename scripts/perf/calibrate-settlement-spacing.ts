// Usage: pnpm worldgen:spacing:calibrate [--pitches=280,300,310,320] [--seeds=42,415424794,1,2,3] [--rings=5]
// Queue Q32 / Q29 plan §3: measures settlement spacing candidates WITHOUT changing the generator output
// (the pitch is injected via `setSettlementGridStepOverride`, default stays `SETTLEMENT_GRID_STEP`).
// Diagnostic only — prints a markdown table; not part of `pnpm test`. Derived cemetery distances keep the constant.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, type RoadNetworkContext, type RoadRoute, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import {
  cellsWithinRadius,
  setSettlementGridStepOverride,
  SETTLEMENT_GRID_STEP,
  type SettlementDef,
} from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

/** `HOME_RADIUS` in `src/app/worldBundle.ts` (not imported: that module pulls in the whole runtime). */
const HOME_RADIUS = 56

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const pitches = arg('pitches', `${SETTLEMENT_GRID_STEP},300,310,320`).split(',').map(Number)
const seeds = arg('seeds', '42,415424794,1,2,3').split(',').map(Number)
const rings = Number(arg('rings', '5'))

function terrainSnapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize,
    resolution: t.resolution,
    seed,
    heightScale: t.heightScale,
    waterLevel: t.waterLevel,
    noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude,
    hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm,
    fbm: t.fbm,
    biome: t.biome,
    region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [],
    localSearchRadius: HOME_RADIUS,
  }
}

function pct(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!
}
const f = (n: number) => (Number.isFinite(n) ? n.toFixed(0) : '–')
const p3 = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b)
  return `${f(pct(s, 0.1))}/${f(pct(s, 0.5))}/${f(pct(s, 0.9))}`
}

type Row = {
  pitch: number
  seed: number
  accepted: number
  nullCells: number
  sizes: string
  nn: string
  edges: number
  edgeLen: string
  medianEdge: number
  noRoad: number
  routeDeficit: number
  components: number
  fords: number
  bridges: number
}

function measure(pitch: number, seed: number): Row {
  setSettlementGridStepOverride(pitch)
  clearSettlementDefCache()
  clearRoadNetworkCaches()
  clearCemeteryCaches()
  const snap = terrainSnapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const defs: SettlementDef[] = []
  let nullCells = 0
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
    else nullCells++
  }
  const sizes: Record<string, number> = {}
  for (const d of defs) sizes[d.size] = (sizes[d.size] ?? 0) + 1
  const nn = defs.map((a) => Math.min(...defs.filter((b) => b !== a).map((b) => Math.hypot(a.x - b.x, a.z - b.z))))

  const parent = new Map(defs.map((d) => [d.id, d.id]))
  const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!))
  const edges = new Map<string, number>()
  let noRoad = 0
  let routeDeficit = 0
  let fords = 0
  let bridges = 0
  const maxRoads = snap.region.roadNetwork.maxNeighborRoads
  for (const d of defs) {
    const roads: RoadRoute[] = roadRoutesForSettlement(d, ctx).filter((r) => r.kind === 'road')
    if (roads.length === 0) noRoad++
    routeDeficit += Math.max(0, Math.min(maxRoads, defs.length - 1) - roads.length)
    for (const r of roads) {
      const a = r.segments[0]!.a
      const b = r.segments[r.segments.length - 1]!.b
      // Identify the pair by the settlement nearest each end (pair key stays symmetric).
      const near = (p: { x: number, z: number }) => defs.reduce((best, o) => (Math.hypot(o.x - p.x, o.z - p.z) < Math.hypot(best.x - p.x, best.z - p.z) ? o : best))
      const ia = near(a).id
      const ib = near(b).id
      if (ia === ib) continue
      const key = ia < ib ? `${ia}|${ib}` : `${ib}|${ia}`
      if (edges.has(key)) continue
      edges.set(key, r.segments.reduce((sum, s) => sum + Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), 0))
      for (const c of r.crossings) {
        if (c.kind === 'ford') fords++
        else if (c.kind === 'bridge') bridges++
      }
      parent.set(find(ia), find(ib))
    }
  }
  const lens = [...edges.values()]
  const sortedLens = [...lens].sort((a, b) => a - b)
  return {
    pitch,
    seed,
    accepted: defs.length,
    nullCells,
    sizes: Object.entries(sizes).map(([k, v]) => `${k}${v}`).join(' '),
    nn: p3(nn),
    edges: edges.size,
    edgeLen: p3(lens),
    medianEdge: pct(sortedLens, 0.5),
    noRoad,
    routeDeficit,
    components: new Set(defs.map((d) => find(d.id))).size,
    fords,
    bridges,
  }
}

const rows: Row[] = []
for (const seed of seeds) {
  for (const pitch of pitches) {
    rows.push(measure(pitch, seed))
    console.error(`seed ${seed} pitch ${pitch} done`)
  }
}
setSettlementGridStepOverride(null)

console.log(`Window: rings <= ${rings} (${(2 * rings + 1) ** 2} cells), pitches ${pitches.join('/')}, p10/p50/p90 in metres.\n`)
console.log('| seed | pitch | accepted | null | sizes | nearest-nbr | road edges | edge len | no-road | route deficit | components | fords | bridges | median vs 280 |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const r of rows) {
  const base = rows.find((b) => b.seed === r.seed && b.pitch === SETTLEMENT_GRID_STEP)
  const rel = base && Number.isFinite(base.medianEdge) ? `${(((r.medianEdge / base.medianEdge) - 1) * 100).toFixed(1)} %` : '–'
  console.log(`| ${r.seed} | ${r.pitch} | ${r.accepted} | ${r.nullCells} | ${r.sizes} | ${r.nn} | ${r.edges} | ${r.edgeLen} | ${r.noRoad} | ${r.routeDeficit} | ${r.components} | ${r.fords} | ${r.bridges} | ${rel} |`)
}
