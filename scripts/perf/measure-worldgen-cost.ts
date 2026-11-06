// Usage: pnpm tsx scripts/perf/measure-worldgen-cost.ts [--seeds=42,415424794] [--reps=3] [--chunks=60]
// tools-026 D7 (Q131), headless Node half: hydrology sample / compute split, installed payload, peak RSS,
// chunk-tile generation p50/p95 (bare tiles: no road/clearing/river segments, no vegetation species — a LOWER BOUND of
// the in-game worker cost), settlement layout + all-road-route time. Diagnostic only; Node (V8) numbers, never FPS,
// never comparable to browser/worker numbers or to Windows.
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor, settlementLayoutFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { type ChunkTileParams, computeChunkTile } from '../../src/terrain/chunkHeightmap'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID, type WorldHydrology, worldHydrologyGridFor } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const reps = Number(arg('reps', '3'))
const chunkCount = Number(arg('chunks', '60'))

const pct = (v: number[], p: number) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : 0 }
const r1 = (n: number) => Math.round(n * 10) / 10
const mib = (b: number) => r1(b / 1048576)

function typedBytes(o: unknown, seen = new Set<unknown>()): number {
  if (!o || typeof o !== 'object' || seen.has(o)) return 0
  seen.add(o)
  if (ArrayBuffer.isView(o)) return o.byteLength
  let sum = 0
  for (const v of Object.values(o as Record<string, unknown>)) sum += typedBytes(v, seen)
  return sum
}

function rawParams(seed: number): RawSampleParams {
  const t = defaultTerrainConfig(65)
  return {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
  }
}

function hydrologyCost(seed: number) {
  const params = rawParams(seed)
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const t0 = performance.now()
  const floor = sampleRawFloorRows(params, grid, 0, grid.size)
  const t1 = performance.now()
  const hydrology: WorldHydrology = computeWorldHydrology(worldHydrologyGridFor(params, floor), { waterLevel: params.waterLevel, seed })
  const t2 = performance.now()
  const id = hydrologyIdFor(params)
  installWorldHydrology(id, hydrology)
  const t3 = performance.now()
  return { id, sampleMs: t1 - t0, computeMs: t2 - t1, installMs: t3 - t2, payloadMiB: mib(typedBytes(hydrology)), floorMiB: mib(floor.byteLength), hydrologyId: id }
}

function chunkCost(seed: number, hydrologyId: string, n: number) {
  const t = defaultTerrainConfig(65)
  const times: number[] = []
  const side = Math.ceil(Math.sqrt(n))
  const spacing = Math.floor(12288 / side / t.chunkSize) // spread over the ±6144 m continent
  for (let i = 0; i < n; i++) {
    const cx = (i % side - side / 2) * spacing
    const cz = (Math.floor(i / side) - side / 2) * spacing
    const params: ChunkTileParams = {
      cx: Math.round(cx), cz: Math.round(cz), chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale,
      waterLevel: t.waterLevel, noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
      hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId,
      isHomeChunk: false, vegetationSpeciesCount: { tree: 4, bush: 4, cactus: 2, reed: 2, fern: 2, lily: 2, seaweed: 2 },
      roadSegments: [], clearings: [], regional: [], riverSegments: [],
    }
    const s = performance.now()
    computeChunkTile(params)
    times.push(performance.now() - s)
  }
  return { n, p50: r1(pct(times, 0.5)), p95: r1(pct(times, 0.95)), max: r1(Math.max(...times)) }
}

function layoutAndRoutes(seed: number, hydrologyId: string) {
  clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
  const t = defaultTerrainConfig(65)
  const snap: WorldKnowledgeTerrainSnapshot = {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56, hydrologyId,
  }
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const t0 = performance.now()
  const layout = settlementLayoutFor(ctx)
  const t1 = performance.now()
  const defs = layout.sites.map((s) => settlementDefFor(s.cell, ctx)).filter((d) => d != null)
  const t2 = performance.now()
  let routes = 0
  for (const d of defs) routes += roadRoutesForSettlement(d, ctx).length
  const t3 = performance.now()
  const families = defs.reduce((n, d) => n + d.families.length, 0)
  const npcs = defs.reduce((n, d) => n + d.families.reduce((m, f) => m + f.members.length, 0), 0)
  return { sites: layout.sites.length, defs: defs.length, routes, households: families, npcs, layoutMs: t1 - t0, defsMs: t2 - t1, routesMs: t3 - t2 }
}

const out: Record<string, unknown> = {}
for (const seed of seeds) {
  const rows: unknown[] = []
  for (let rep = 0; rep < reps; rep++) {
    const rss0 = process.memoryUsage().rss
    const h = hydrologyCost(seed)
    const rssAfterHydro = process.memoryUsage().rss
    const chunks = chunkCost(seed, h.id, chunkCount)
    const lr = layoutAndRoutes(seed, h.id)
    rows.push({
      rep, hydrology: { sampleMs: Math.round(h.sampleMs), computeMs: Math.round(h.computeMs), installMs: r1(h.installMs), payloadMiB: h.payloadMiB, floorMiB: h.floorMiB },
      rssMiB: { before: mib(rss0), afterHydrology: mib(rssAfterHydro), end: mib(process.memoryUsage().rss) },
      chunks, layoutAndRoutes: { ...lr, layoutMs: Math.round(lr.layoutMs), defsMs: Math.round(lr.defsMs), routesMs: Math.round(lr.routesMs) },
    })
  }
  out[String(seed)] = rows
}
console.log(JSON.stringify({ node: process.version, reps, chunkCount, results: out }, null, 1))
