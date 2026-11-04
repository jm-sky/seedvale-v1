import type { RoadNetworkContext } from '../../src/settlement/roadNetwork'
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
// Usage: pnpm worldgen:rivers:census [--seeds=42,415424794] [--check-strips=4] [--json] [--network] [--stream-m2=480,960,1920]
// --network / --stream-m2 (tools-026 D1): network metrics; --stream-m2 recomputes chains on the same grid with other initiation areas (preview only).
//
// Global hydrology census (058 H1/H4/L1). The pre-058 per-tile census (computeRiverTileDiagnostics) was removed with
// the legacy per-tile river path (Q80).
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { sampleFloorAt, sampleHeightAt } from '../../src/terrain/chunkHeightmap'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { isWetFloor } from '../../src/terrain/waterSurface'
import { ChainEnd, computeWorldHydrology, hashWorldHydrology, sampleRawFloorRows, sparseBlockValue, unpackChains, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, streamHeadsFor, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { measureNetwork } from './censusRiverNetwork'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '5'))
const asJson = process.argv.includes('--json')
const variantAreas = arg('stream-m2', '').split(',').filter(Boolean).map(Number)
const withNetwork = process.argv.includes('--network') || variantAreas.length > 0

type P = { x: number, z: number }
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.z - b.z)

function sampleParamsFor(seed: number): RawSampleParams {
  const t = defaultTerrainConfig(65)
  const params = {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
  }
  return { ...params, hydrologyId: UNCONDITIONED_HYDROLOGY_ID }
}

function snapshotFor(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56,
  }
}

function measureGlobal(seed: number) {
  const params = sampleParamsFor(seed)
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const { size, cellStep } = grid
  const t0 = performance.now()
  const floor = sampleRawFloorRows(params, grid, 0, size)
  const sampleMs = performance.now() - t0
  const h = computeWorldHydrology({ ...grid, floor }, { waterLevel: params.waterLevel, seed })
  const hash = hashWorldHydrology(h)
  const strips = Number(arg('check-strips', '0'))
  let stripsHash: string | null = null
  if (strips > 1) {
    const parts: Float32Array[] = []
    for (let s = 0; s < strips; s++) parts.push(sampleRawFloorRows(params, grid, Math.floor((s * size) / strips), Math.floor(((s + 1) * size) / strips)))
    const joined = new Float32Array(size * size)
    let o = 0
    for (const p of parts) { joined.set(p, o); o += p.length }
    stripsHash = hashWorldHydrology(computeWorldHydrology({ ...grid, floor: joined }, { waterLevel: params.waterLevel, seed }))
  }
  const chains = unpackChains(h.chains)
  let seabedKm = 0
  const seabedByEnd: Record<number, number> = {}
  const seabedWhere: Record<string, number> = {}
  let totalKm = 0
  let mouthMax = 0
  let mouthN = 0
  let monotoneBreaks = 0
  chains.forEach((c, i) => {
    const pts = c.points
    const flags = h.chains.flags[i]!
    for (let k = 0; k < pts.length - 1; k++) {
      const len = dist(pts[k]!, pts[k + 1]!) / 1000
      totalKm += len
      const mx = (pts[k]!.x + pts[k + 1]!.x) / 2
      const mz = (pts[k]!.z + pts[k + 1]!.z) / 2
      // Raw height plus the correction layer (raised below-sea basins and filled pits are ground, not seabed).
      const cx = Math.round((mx - grid.originX) / cellStep)
      const cz = Math.round((mz - grid.originZ) / cellStep)
      const corr = sparseBlockValue(h.correction, cx, cz)
      // Grid-level ground (the model the hydrology reasons about): raw cell floor + correction.
      if (floor[cz * size + cx]! + corr <= params.waterLevel + 1e-4) {
        seabedKm += len
        seabedByEnd[flags & 15] = (seabedByEnd[flags & 15] ?? 0) + len
        const fromEnd = pts.length - 1 - k
        const bucket = k === 0 ? 'head' : fromEnd <= 2 ? 'last-2' : fromEnd <= 8 ? 'near-end' : 'mid'
        seabedWhere[bucket] = (seabedWhere[bucket] ?? 0) + len
      }
      if (pts[k + 1]!.elevation > pts[k]!.elevation + 0.06) {
        monotoneBreaks++
        if (process.argv.includes('--verbose')) console.log(`  rise ${(pts[k + 1]!.elevation - pts[k]!.elevation).toFixed(2)} m at ${pts[k]!.x.toFixed(0)},${pts[k]!.z.toFixed(0)} chain ${i} pt ${k}/${pts.length} end ${flags & 15}`)
      }
    }
    if ((flags & 15) === ChainEnd.Sea) {
      mouthMax = Math.max(mouthMax, Math.abs(pts[pts.length - 1]!.elevation - params.waterLevel))
      mouthN++
    }
  })
  const lakeHa = h.lakes.map((l) => l.areaM2 / 1e4).sort((a, b) => a - b)
  const landKm2 = (h.stats.landCells * cellStep * cellStep) / 1e6
  const filledPct = (100 * h.stats.filledCells) / Math.max(1, h.stats.landCells)
  // Home stream: nearest chain point to the home settlement (default world home), and how that chain ends.
  // 058 H4: install the computed hydrology under its real id so settlement generation sees the stream heads, then
  // count visible heads inside / within 24 m of every footprint (rings around the origin) and site fallbacks.
  const hid = hydrologyIdFor(params)
  installWorldHydrology(hid, h)
  const condParams: RawSampleParams = { ...params, hydrologyId: hid }
  clearSettlementDefCache()
  setSettlementRiverQuery(createRiverQuery(condParams))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext({ ...snapshotFor(seed), hydrologyId: hid })
  const heads = streamHeadsFor(hid)
  const siteDefs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const d = settlementDefFor(cell, ctx)
    if (d) siteDefs.push(d)
  }
  let headsInside = 0
  let headsNear24 = 0
  let headFallbacks = 0
  for (const d of siteDefs) {
    const r = villageSizeConfig(d.size).footprintRadius
    let near = false
    for (const hd of heads) {
      const dd = dist(d, hd)
      if (dd < r) { headsInside++; near = true } else if (dd < r + 24) { headsNear24++; near = true }
      if ((dd < r + 24) && process.argv.includes('--verbose')) console.log(`  head ${hd.x.toFixed(0)},${hd.z.toFixed(0)} d=${dd.toFixed(0)} R=${r} ${d.id}${d.isHome ? ' (home)' : ''}`)
    }
    // A settlement still within footprint + 24 m of a head is a site-search fallback (nothing else passed).
    if (near) headFallbacks++
  }
  // 058 L1 (Q77): settlement centres and clearing pads (core/houses/yards/storehouse/gardens) must not stand in a
  // lake (production wet rule, conditioned hydrology installed above). Sea-level wet counts too.
  const wetAt = (x: number, z: number) => isWetFloor(sampleHeightAt(x, z, condParams), sampleFloorAt(x, z, condParams))
  let lakeCenters = 0
  let lakePads = 0
  let padsChecked = 0
  for (const d of siteDefs) {
    if (wetAt(d.x, d.z)) { lakeCenters++; console.log(`  LAKE centre ${d.id} @ ${d.x.toFixed(0)},${d.z.toFixed(0)}`) }
    const c = d.clearings
    const named: [string, readonly { x: number, z: number, radius: number }[]][] = [['core', [c.core]], ['house', c.houses], ['yard', c.yards], ['storehouse', c.storehouses], ['garden', c.gardens]]
    for (const [kind, pads] of named) for (const pad of pads) {
      padsChecked++
      if (wetAt(pad.x, pad.z)) {
        lakePads++
        // Q37: name the owning plot (nearest plot or compound disc) and whether pickPlot fell back unconditionally.
        let owner = d.plan.plots[0]
        let ownerD = Infinity
        for (const p of d.plan.plots) {
          for (const disc of p.discs ?? [{ x: p.x, z: p.z, radius: p.radius }]) {
            const dd = Math.hypot(disc.x - pad.x, disc.z - pad.z)
            if (dd < ownerD) { ownerD = dd; owner = p }
          }
        }
        console.log(`  LAKE ${kind} ${d.id} (${d.size}) @ ${pad.x.toFixed(0)},${pad.z.toFixed(0)} r=${pad.radius.toFixed(1)} centre ${d.x.toFixed(0)},${d.z.toFixed(0)} · plot ${owner?.id} ${owner?.finalFallback ? 'FINAL-FALLBACK' : 'placed'} @ ${owner?.x.toFixed(0)},${owner?.z.toFixed(0)} wet=${owner ? wetAt(owner.x, owner.z) : '?'}`)
      }
    }
  }
  // Q37: planner health under the production (conditioned) hydrology — houses and unconditional last-resort plots.
  const houses = siteDefs.reduce((n, d) => n + d.plan.plots.filter((p) => p.role === 'house').length, 0)
  const finalFallbacks = siteDefs.reduce((n, d) => n + d.plan.plots.filter((p) => p.finalFallback).length, 0)
  const lakeCensus = { settlements: siteDefs.length, houses, finalFallbacks, padsChecked, lakeCenters, lakePads }
  const headCensus = { settlements: siteDefs.length, heads: heads.length, headsInside, headsNear24, headFallbacks }
  const home = siteDefs.find((d) => d.isHome)
  let homeStream = 'n/a'
  if (home) {
    let best = Infinity
    let bi = -1
    chains.forEach((c, i) => c.points.forEach((p) => { const d = dist(p, home); if (d < best) { best = d; bi = i } }))
    const f = bi >= 0 ? h.chains.flags[bi]! : 0
    homeStream = bi < 0 ? 'no chain' : `nearest chain ${best.toFixed(0)} m from home, ends ${['sea', 'lake', 'join', 'edge'][f & 15]}${f & 16 ? ' (lake-fed)' : ''}`
  }
  return {
    network: withNetwork ? measureNetwork(h, floor, grid, params.waterLevel, landKm2) : undefined,
    variants: variantAreas.map((m2) => {
      const cells = Math.max(1, Math.round(m2 / (cellStep * cellStep)))
      const hv = computeWorldHydrology({ ...grid, floor }, { waterLevel: params.waterLevel, seed, streamAccumulation: cells })
      return { streamM2: m2, streamCells: cells, ...measureNetwork(hv, floor, grid, params.waterLevel, landKm2) }
    }),
    seed, size, sampleMs, computeMs: h.stats.computeMs, hash, stripsHash, stats: h.stats, landKm2, filledPct,
    chains: chains.length, totalKm, seabedKm, mouthMax, mouthN, monotoneBreaks,
    lakes: h.lakes.length, lakeHa: { min: lakeHa[0] ?? 0, median: lakeHa[Math.floor(lakeHa.length / 2)] ?? 0, max: lakeHa[lakeHa.length - 1] ?? 0 },
    homeStream, seabedByEnd, seabedWhere, headCensus, lakeCensus,
  }
}

{
  for (const seed of seeds) {
    const r = measureGlobal(seed)
    if (asJson) { console.log(JSON.stringify(r, null, 2)); continue }
    const st = r.stats
    console.log(`\n=== seed ${seed} (global, ${r.size}² cells): sample ${(r.sampleMs / 1000).toFixed(1)} s, compute ${(r.computeMs / 1000).toFixed(1)} s, land ${r.landKm2.toFixed(1)} km²`)
    console.log(`dry sinks ${st.drySinks} · edge drains ${st.edgeDrains} · chains ${r.chains} (${r.totalKm.toFixed(1)} km) ends sea ${st.chainEnds.sea} lake ${st.chainEnds.lake} join ${st.chainEnds.join} edge ${st.chainEnds.edge}`)
    console.log(`seabed chain length ${r.seabedKm.toFixed(3)} km · mouth level error max ${r.mouthMax.toFixed(3)} m over ${r.mouthN} sea mouths · elevation rises > 0.06 m: ${r.monotoneBreaks}`)
    console.log(`pits ${st.pits} · breach tried ${st.breachTried} ok ${st.breached} (cut cells ${st.cutCells}, max cut ${st.maxCutM.toFixed(2)} m) · filled pits ${st.filledPits} (${r.filledPct.toFixed(2)} % of land) · raised below-sea cells ${st.raisedCells}`)
    console.log(`lakes ${r.lakes} (ha min/median/max ${r.lakeHa.min.toFixed(2)}/${r.lakeHa.median.toFixed(2)}/${r.lakeHa.max.toFixed(2)}) · sea-level lakes ${st.terminalLakes} (${st.terminalCells} cells)`)
    console.log(`seabed by chain end (km) ${JSON.stringify(r.seabedByEnd)} · by position ${JSON.stringify(r.seabedWhere)}`)
    console.log(`home stream: ${r.homeStream}`)
    console.log(`stream heads (H4): ${JSON.stringify(r.headCensus)}`)
    console.log(`lake census (L1): ${JSON.stringify(r.lakeCensus)}`)
    if (r.network) {
      const nw = r.network
      console.log(`network (D1): stream ${nw.streamKm.toFixed(1)} km = ${nw.streamKmPerLandKm2.toFixed(2)} km/km² land · heads ${nw.heads} · dry interfluve (>300 m from stream) ${(100 * nw.dryInterfluveShare).toFixed(1)} % · payload ${nw.payloadMiB.toFixed(2)} MiB`)
      console.log(`  trunk systems (top): ${JSON.stringify(nw.trunkSystems.slice(0, 5))}`)
      console.log(`  accumulation area histogram (m²): ${nw.accumulationAreaHistogram.map((b) => `<${b.toM2}:${b.points}`).join(' ')}`)
      console.log(`  parallel pairs (<30 m, >150 m runs; longest near-run ${nw.parallelPairs.maxRunM} m): ${nw.parallelPairs.total} (valid ${nw.parallelPairs.valid}, artifact? ${nw.parallelPairs.artifact}, ${nw.parallelPairs.lengthKm.toFixed(2)} km) first artifacts: ${JSON.stringify(nw.parallelPairs.artifacts.slice(0, 5))}`)
    }
    for (const v of r.variants) console.log(`variant --stream-m2=${v.streamM2} (${v.streamCells} cells): stream ${v.streamKm.toFixed(1)} km = ${v.streamKmPerLandKm2.toFixed(2)} km/km² · heads ${v.heads} · dry ${(100 * v.dryInterfluveShare).toFixed(1)} % · systems ${v.trunkSystems.length}+ top ${v.trunkSystems[0]?.km.toFixed(1)} km · parallel artifact? ${v.parallelPairs.artifact}`)
    console.log(`hash ${r.hash}${r.stripsHash ? ` · strips hash ${r.stripsHash} ${r.stripsHash === r.hash ? 'MATCH' : 'MISMATCH'}` : ''}`)
  }
  process.exit(0)
}
