import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, type RoadNetworkContext, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { cellKey, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { SETTLEMENT_MIN_DISTANCE_M } from '../../src/settlement/settlementLayout'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor, settlementLayoutFor } from '../../src/settlement/settlementPlanCache'
import { settlementGraphHops } from '../../src/settlement/settlementProgression'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { WORLD_HALF_EXTENT } from '../../src/terrain/continentMask'
import { createRiverQuery } from '../../src/terrain/riverQuery'
// Usage: pnpm worldgen:spacing:census [--seeds=42,415424794] [--roads=1]
// 059 W4 census: global settlement selection + neighbour graph (replaces the Q32 calibrate tool).
// Reports count, nearest-neighbour, graph edge lengths (straight line, site to site), land coverage
// within 1800 m, connectivity, size histogram, layout time and (with --roads=1) road coverage/build time.
// Diagnostic only — not part of `pnpm test`.
import { UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

const HOME_RADIUS = 56
function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const withRoads = arg('roads', '0') === '1'

function snapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS, hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
  }
}
const q = (v: number[], p: number) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : NaN }
const f = (n: number) => (Number.isFinite(n) ? n.toFixed(0) : '–')

console.log('| seed | settlements | null defs | nearest min/p50 | edges | edge p10/p50/p90/max | in 720–1800 | >2400 | components | land ≤1800 m | sizes | layout ms | road: no-road | road: build s |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
  const snap = snapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const t0 = performance.now()
  const layout = settlementLayoutFor(ctx)
  const layoutMs = performance.now() - t0
  const defs: SettlementDef[] = []
  let nullDefs = 0
  for (const s of layout.sites) {
    const d = settlementDefFor(s.cell, ctx)
    if (d) defs.push(d); else nullDefs++
  }
  const nn = defs.map((a) => Math.min(...defs.filter((b) => b !== a).map((b) => Math.hypot(a.x - b.x, a.z - b.z))))
  const edges: number[] = []
  const parent = new Map(defs.map((d) => [d.id, d.id]))
  const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!))
  const byId = new Map(defs.map((d) => [d.id, d]))
  for (const s of layout.sites) {
    const a = byId.get(cellKey(s.cell))
    if (!a) continue
    for (const n of layout.neighborsOf(s.cell)) {
      const b = byId.get(cellKey(n.cell))
      if (!b || a.id > b.id) continue
      edges.push(Math.hypot(a.x - b.x, a.z - b.z))
      parent.set(find(a.id), find(b.id))
    }
  }
  const sizes: Record<string, number> = {}
  for (const d of defs) sizes[d.size] = (sizes[d.size] ?? 0) + 1
  // 059 W2′: sizes by graph hops from home (decision 6)
  const hops = settlementGraphHops(layout)
  const byHop = new Map<number, string[]>()
  for (const d of defs) {
    const h = hops.get(d.id) ?? -1
    byHop.set(h, [...(byHop.get(h) ?? []), d.size])
  }
  const hopLine = [...byHop].sort((a, b) => a[0] - b[0]).map(([h, v]) => `hop${h < 0 ? '∞' : h}: ${v.join('/')}`).join(' · ')
  const xl = defs.filter((d) => d.size === 'XL').map((d) => `hop${hops.get(d.id)} ${(Math.hypot(d.x, d.z) / 1000).toFixed(1)} km`)
  console.log(`<!-- seed ${seed} ${hopLine} · XL: ${xl.join(', ') || 'none'} -->`)
  // land coverage: dry sample points on a 120 m grid within 1800 m of a settlement
  let covered = 0, land = 0
  const step = 120
  for (let x = -WORLD_HALF_EXTENT; x <= WORLD_HALF_EXTENT; x += step) {
    for (let z = -WORLD_HALF_EXTENT; z <= WORLD_HALF_EXTENT; z += step) {
      if (ctx.sampleHeight(x, z) <= ctx.waterLevel + 1) continue
      land++
      if (defs.some((d) => Math.hypot(d.x - x, d.z - z) <= 1800)) covered++
    }
  }
  let noRoad = '–', roadSec = '–'
  if (withRoads) {
    const r0 = performance.now()
    let nr = 0
    for (const d of defs) if (roadRoutesForSettlement(d, ctx).filter((r) => r.kind === 'road').length === 0) nr++
    noRoad = String(nr); roadSec = ((performance.now() - r0) / 1000).toFixed(1)
  }
  const inBand = edges.filter((e) => e >= SETTLEMENT_MIN_DISTANCE_M && e <= 1800).length
  console.log(`| ${seed} | ${defs.length} | ${nullDefs} | ${f(Math.min(...nn))}/${f(q(nn, 0.5))} | ${edges.length} | ${f(q(edges, 0.1))}/${f(q(edges, 0.5))}/${f(q(edges, 0.9))}/${f(Math.max(...edges))} | ${((inBand / edges.length) * 100).toFixed(0)} % | ${edges.filter((e) => e > 2400).length} | ${new Set(defs.map((d) => find(d.id))).size} | ${((covered / land) * 100).toFixed(0)} % | ${Object.entries(sizes).map(([k, v]) => `${k}${v}`).join(' ')} | ${layoutMs.toFixed(0)} | ${noRoad} | ${roadSec} |`)
}
