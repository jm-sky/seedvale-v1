// Usage: pnpm worldgen:outcomes:census [--seeds=42,415424794] [--rings=5] [--no-intersections] [--json=<file>]
// Plan world-terrain-061 H5: (1) asserts the world-terrain-060 landform `intendedOutcome` against the hydrology
// (lake-with-island holds a lake with a dry centre; crater stays dry), (2) reports the world-terrain-064 cascade sites
// (`waterfallSitesOf`: tiers, drop, width class) and how many of today's settlement footprints, roads and bridges intersect
// their reserved footprints (rings around the origin). Nothing here changes worldgen.
import { writeFileSync } from 'node:fs'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { bridgeSpecOf, clearRoadNetworkCaches, type RoadNetworkContext, type RoadRoute, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { landformDescriptorsOf, type RawSampleParams, sampleRawFloorUncorrected } from '../../src/terrain/chunkHeightmap'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { CASCADE_MERGE_GAP_M, CASCADE_MIN_DROP_M, CASCADE_SLOPE_MIN, siteReservesPointAt, type WaterfallSite, waterfallSitesOf } from '../../src/terrain/waterfallSites'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID, worldHydrologyGridFor } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { hydrologyCorrectionAt, hydrologyLakeLevelAt, installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { censusHydrologyId } from './censusHydrology'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const jsonOut = arg('json', '')
const rings = Number(arg('rings', '5'))
const withIntersections = !process.argv.includes('--no-intersections')

type WidthClass = 'thin' | 'small' | 'medium' | 'large'
function widthClassOf(widthM: number): WidthClass {
  return widthM < 1.5 ? 'thin' : widthM < 4 ? 'small' : widthM < 8 ? 'medium' : 'large'
}

type P = { x: number, z: number }
type IntersectionReport = { settlements: number, settlementsHit: number, settlementIds: string[], plotsHit: number, roads: number, roadsHit: number, bridges: number, bridgesHit: number, bridgeIds: string[] }

/** Today's settlement footprints / plots / roads / bridges (rings around the origin) vs the 064 reserved footprints. Report only. */
function reportIntersections(seed: number, hid: string, sites: readonly WaterfallSite[]): IntersectionReport {
  clearSettlementDefCache()
  clearRoadNetworkCaches()
  clearCemeteryCaches()
  const t = defaultTerrainConfig(65)
  const snap: WorldKnowledgeTerrainSnapshot = {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56, hydrologyId: censusHydrologyId(seed),
  }
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snap)
  const reserved = (p: P) => sites.some((s) => siteReservesPointAt(s, p.x, p.z))
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  const settlementIds: string[] = []
  let plotsHit = 0
  for (const d of defs) {
    const r = villageSizeConfig(d.size).footprintRadius
    let hit = false
    for (let dx = -r; dx <= r && !hit; dx += 6) for (let dz = -r; dz <= r && !hit; dz += 6) if (Math.hypot(dx, dz) <= r && reserved({ x: d.x + dx, z: d.z + dz })) hit = true
    if (hit) settlementIds.push(d.id)
    for (const plot of d.plan.plots) if (reserved(plot)) plotsHit++
  }
  const roads = new Map<string, RoadRoute>()
  for (const d of defs) {
    for (const r of roadRoutesForSettlement(d, ctx)) {
      if (r.kind !== 'road') continue
      const a = r.points[0]!
      const b = r.points[r.points.length - 1]!
      roads.set([a.x.toFixed(0), a.z.toFixed(0), b.x.toFixed(0), b.z.toFixed(0)].sort().join('|'), r)
    }
  }
  let roadsHit = 0
  let bridges = 0
  const bridgeIds: string[] = []
  for (const route of roads.values()) {
    let hit = false
    for (let i = 0; i < route.points.length - 1 && !hit; i++) {
      const a = route.points[i]!
      const b = route.points[i + 1]!
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 2))
      for (let k = 0; k <= n && !hit; k++) if (reserved({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n })) hit = true
    }
    if (hit) roadsHit++
    for (const crossing of route.crossings) {
      if (crossing.kind !== 'bridge') continue
      bridges++
      const spec = bridgeSpecOf(crossing, route, snap.region.roadNetwork)
      let bridgeHit = false
      for (let s = -spec.span / 2; s <= spec.span / 2 && !bridgeHit; s += 1) if (reserved({ x: spec.x + spec.dirX * s, z: spec.z + spec.dirZ * s })) bridgeHit = true
      if (bridgeHit) bridgeIds.push(crossing.id)
    }
  }
  const out: IntersectionReport = { settlements: defs.length, settlementsHit: settlementIds.length, settlementIds, plotsHit, roads: roads.size, roadsHit, bridges, bridgesHit: bridgeIds.length, bridgeIds }
  console.log(`  today's output vs reserves (rings ≤ ${rings}): settlement footprints ${out.settlementsHit}/${out.settlements} (${settlementIds.join(', ') || '—'}), plots in reserve ${plotsHit}, roads ${out.roadsHit}/${out.roads}, bridges ${out.bridgesHit}/${out.bridges} (${bridgeIds.join(', ') || '—'})`)
  return out
}

const report: Record<string, unknown> = {}
let failures = 0

for (const seed of seeds) {
  const base = { ...defaultTerrainConfig(65), seed, hydrologyId: UNCONDITIONED_HYDROLOGY_ID } as unknown as RawSampleParams
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(base, grid, 0, grid.size)
  const h = computeWorldHydrology(worldHydrologyGridFor(base, floor), { waterLevel: base.waterLevel, seed })
  const hid = hydrologyIdFor(base)
  installWorldHydrology(hid, h)

  console.log(`seed ${seed}:`)
  const outcomes: string[] = []
  for (const d of landformDescriptorsOf(base)) {
    const ground = sampleRawFloorUncorrected(d.centreX, d.centreZ, base)
    const lake = hydrologyLakeLevelAt(hid, d.centreX, d.centreZ)
    const correction = hydrologyCorrectionAt(hid, d.centreX, d.centreZ)
    let ok: boolean
    let detail: string
    if (d.kind === 'lakeIsland') {
      // A lake basin must surround the centre; the centre itself (the island) must stay above the water.
      const ring = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return hydrologyLakeLevelAt(hid, d.centreX + Math.cos(a) * d.radius * 0.6, d.centreZ + Math.sin(a) * d.radius * 0.6)
      })
      const wetRing = ring.filter((l) => Number.isFinite(l)).length
      ok = wetRing >= 6 && (!Number.isFinite(lake) || ground + correction >= lake)
      const filled = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return hydrologyCorrectionAt(hid, d.centreX + Math.cos(a) * d.radius * 0.6, d.centreZ + Math.sin(a) * d.radius * 0.6)
      })
      detail = `rim corrections ${filled.map((c) => c.toFixed(1)).join('/')}; lake rim samples ${wetRing}/8, centre ${(ground + correction).toFixed(1)} m vs level ${Number.isFinite(lake) ? lake.toFixed(1) : 'none'}`
    } else if (d.kind === 'crater') {
      // The raw hydrology may fill/breach the pit; the sampler ignores that correction inside the crater
      // (`landformCorrectionBypassAt`), so the contract is "no lake registered over the bowl".
      ok = !Number.isFinite(lake)
      detail = `centre lake ${Number.isFinite(lake) ? lake.toFixed(1) : 'none'} (raw correction ${correction.toFixed(2)} m is bypassed at runtime)`
    } else {
      ok = true
      detail = 'no hydrology outcome asserted'
    }
    // A lake island whose basin simply did not fill is a worldgen finding (reported as MISS), not a script failure.
    const verdict = ok ? 'OK' : d.kind === 'lakeIsland' ? 'MISS' : 'FAIL'
    if (verdict === 'FAIL') failures++
    outcomes.push(`${d.id}: ${verdict} — ${detail}`)
    console.log(`  ${verdict.padEnd(4)} ${d.id} (${d.kind}) at (${d.centreX.toFixed(0)}, ${d.centreZ.toFixed(0)}): ${detail}`)
  }

  const sites = waterfallSitesOf(hid)
  const minor = sites.filter((s) => s.tier === 'minor')
  const landmarks = sites.filter((s) => s.tier === 'landmark')
  const byClass = sites.reduce<Record<string, number>>((m, c) => ({ ...m, [widthClassOf(c.widthM)]: (m[widthClassOf(c.widthM)] ?? 0) + 1 }), {})
  console.log(`  cascade sites (064 W1; steep ≥ ${CASCADE_SLOPE_MIN}, drop ≥ ${CASCADE_MIN_DROP_M} m, merge gap < ${CASCADE_MERGE_GAP_M} m): ${sites.length} (landmark ${landmarks.length}, minor ${minor.length})`, byClass)
  for (const c of [...sites].sort((a, b) => b.dropM - a.dropM).slice(0, 5)) console.log(`    ${c.id} [${c.tier}] chain ${c.chainIndex}+${Math.round(c.offsetTopM)} m: drop ${c.dropM.toFixed(1)} m over ${Math.round(c.lengthM)} m, ${widthClassOf(c.widthM)} (${c.widthM.toFixed(1)} m) at (${Math.round(c.top.x)}, ${Math.round(c.top.z)})`)
  const waterfallSites = sites.map((c) => ({
    id: c.id, tier: c.tier, sourceChain: c.chainIndex, offsetTopM: Math.round(c.offsetTopM),
    top: { x: Math.round(c.top.x), z: Math.round(c.top.z), elevation: Math.round(c.top.water * 100) / 100 },
    bottom: { x: Math.round(c.bottom.x), z: Math.round(c.bottom.z), elevation: Math.round(c.bottom.water * 100) / 100 },
    dropM: Math.round(c.dropM * 100) / 100, lengthM: Math.round(c.lengthM), widthM: Math.round(c.widthM * 100) / 100, widthClass: widthClassOf(c.widthM),
  }))
  const intersections = withIntersections ? reportIntersections(seed, hid, sites) : undefined
  report[String(seed)] = { outcomes, waterfallSites, ...(intersections ? { intersections } : {}) }
}

if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 1))
if (failures > 0) {
  console.error(`${failures} landform outcome assertion(s) failed`)
  process.exitCode = 1
}
