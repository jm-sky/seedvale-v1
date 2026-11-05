// Usage: pnpm tsx scripts/tools/far-terrain-recon.ts [--seed=415424794] [--areas=home,range] [--radius=6]
// world-terrain-066 F0 (queue Q146), headless and diagnostic only: compares the canonical raw sampler (what
// `buildMapTile` rasterizes) with fully shaped streamed chunk tiles (roads, village clearings/regional smoothing,
// river carving, fords, bridges) and evaluates candidate far-mesh height rules against the near terrain:
//   dry points: poke = farH − nearFloor > 0 → far mesh shows through the near mesh; gap = nearFloor − farH → height
//   step at the near/far hand-off. Wet points (sea/lake surface over the floor): only far above the surface shows.
//   River ribbons are not modelled (carved beds count as dry), so river-chunk pokes are an upper bound.
// Also times `buildMapTile` at steps 4/8/16. Node (V8) numbers, never FPS.
import { createBenchmarkWorldConfig } from '../../src/config/worldConfig'
import { bridgesNear, clearRoadNetworkCaches, fordsNear } from '../../src/settlement/roadNetwork'
import { clearSettlementDefCache, setSettlementRiverQuery } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { type ChunkTileParams, computeChunkTile, type RawSampleParams, sampleRawTexelAt } from '../../src/terrain/chunkHeightmap'
import { computeRiverTile, overlappingRiverTiles, riverChannelSegmentsNear } from '../../src/terrain/riverNetwork'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { ensureWorldHydrology, sampleRowsOnThisThread } from '../../src/terrain/worldHydrologyRuntime'
import { chunkParamsForWorldKnowledgeScan, worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { coverageBlocksFor } from '../../src/world/map/continentPreview'
import { rawSampleParamsFromWorld } from '../../src/world/map/mapProjection'
import { buildMapTile, type MapRasterStep, mapTileBounds } from '../../src/world/map/mapRasterTile'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seed = Number(arg('seed', '415424794'))
const radius = Number(arg('radius', '6'))
/** Area centres in world metres; `range` = Q118 summit of seed 415424794. */
const AREAS: Record<string, [number, number]> = { home: [0, 0], range: [-2340, -680] }
const areas = arg('areas', 'home,range').split(',')

const world = createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 3 })
const t = world.terrain
const hydro = await ensureWorldHydrology(
  rawSampleParamsFromWorld(world),
  { sampleRows: sampleRowsOnThisThread, cache: { read: async () => null, write: async () => {} }, installInWorkers: () => {} },
)
const hydrologyId = hydro.hydrologyId
clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
const snap: WorldKnowledgeTerrainSnapshot = {
  chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
  noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
  hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
  vegetationSpeciesCount: { tree: 4, bush: 4, cactus: 2, reed: 2, fern: 2, lily: 2, seaweed: 2 },
  homeChunks: [], localSearchRadius: 56, hydrologyId,
}
const raw: RawSampleParams = {
  seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude,
  hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId,
}
setSettlementRiverQuery(createRiverQuery(raw))
const roadCtx = worldKnowledgeRoadContext(snap)
const cs = t.chunkSize

const rawCache = new Map<string, number>()
const rawFloor = (x: number, z: number): number => {
  const k = `${x},${z}`
  let v = rawCache.get(k)
  if (v === undefined) { v = sampleRawTexelAt(x, z, raw).floorH; rawCache.set(k, v) }
  return v
}

/** Candidate far-vertex height rules; `step` = far grid spacing. */
type Rule = { name: string, step: number, vertex: (x: number, z: number) => number }
const minOf9 = (r: number, drop: number) => (x: number, z: number) => {
  let m = Infinity
  for (const dz of [-r, 0, r]) for (const dx of [-r, 0, r]) m = Math.min(m, rawFloor(x + dx, z + dz))
  return m - drop
}
const RULES: Rule[] = [
  { name: 'raw s4', step: 4, vertex: (x, z) => rawFloor(x, z) },
  { name: 'raw s8', step: 8, vertex: (x, z) => rawFloor(x, z) },
  { name: 'raw s16', step: 16, vertex: (x, z) => rawFloor(x, z) },
  { name: 'min9±16−1.5 s8 (V3)', step: 8, vertex: minOf9(16, 1.5) },
  { name: 'min9±8−1.5 s8', step: 8, vertex: minOf9(8, 1.5) },
  { name: 'min9±4−1.0 s4', step: 4, vertex: minOf9(4, 1.0) },
  { name: 'min9±8−1.5 s4', step: 4, vertex: minOf9(8, 1.5) },
]

const pct = (v: Float64Array | number[], p: number) => { const s = Float64Array.from(v).sort(); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : NaN }
const r2 = (n: number) => Math.round(n * 100) / 100
const max = (v: number[]) => v.reduce((m, x) => (x > m ? x : m), -Infinity)
const min = (v: number[]) => v.reduce((m, x) => (x < m ? x : m), Infinity)

type Acc = { pokes: number[], gaps: number[], n: number, wet: number, wetPokes: number }
const newAcc = (): Acc => ({ pokes: [], gaps: [], n: 0, wet: 0, wetPokes: 0 })

for (const area of areas) {
  const [ax, az] = AREAS[area]!
  const ccx = Math.round(ax / cs)
  const ccz = Math.round(az / cs)
  // per category → per rule
  const acc = new Map<string, Map<string, Acc>>()
  const modDelta: Record<string, number[]> = { river: [], road: [], plain: [] }
  const counts: Record<string, number> = { river: 0, road: 0, plain: 0 }
  const tileMs: number[] = []
  let shown = 0
  for (let cz = ccz - radius; cz <= ccz + radius; cz++) {
    for (let cx = ccx - radius; cx <= ccx + radius; cx++) {
      const coord = { cx, cz }
      const base = chunkParamsForWorldKnowledgeScan(coord, snap, roadCtx, { includeCorridors: true, includeCemetery: false })
      const wx = cx * cs
      const wz = cz * cs
      const rect = { minX: wx - cs / 2, maxX: wx + cs / 2, minZ: wz - cs / 2, maxZ: wz + cs / 2 }
      const chains = overlappingRiverTiles(rect).flatMap((tile) => computeRiverTile(tile, raw))
      const riverSegments = riverChannelSegmentsNear(chains, wx, wz, cs)
      const params: ChunkTileParams = {
        ...base, riverSegments,
        fordProjections: fordsNear(wx, wz, cs, roadCtx),
        bridgeProjections: bridgesNear(wx, wz, cs, roadCtx),
      }
      const s = performance.now()
      const tile = computeChunkTile(params)
      tileMs.push(performance.now() - s)
      const cat = riverSegments.length > 0 ? 'river' : (params.roadSegments.length + params.clearings.length + params.regional.length > 0 ? 'road' : 'plain')
      counts[cat]!++
      if (!acc.has(cat)) acc.set(cat, new Map(RULES.map((r) => [r.name, newAcc()])))
      const res = t.resolution
      const apron = res + 2
      const step = cs / (res - 1)
      const ox = wx - cs / 2
      const oz = wz - cs / 2
      for (let iz = 0; iz < res; iz += 2) {
        for (let ix = 0; ix < res; ix += 2) {
          const x = ox + ix * step
          const z = oz + iz * step
          const k = (iz + 1) * apron + (ix + 1)
          const floor = tile.floorHeights[k]!
          const top = tile.heights[k]! // floor, or water surface where wet
          modDelta[cat]!.push(floor - rawFloor(x, z))
          for (const rule of RULES) {
            const g = rule.step
            const x0 = Math.floor(x / g) * g
            const z0 = Math.floor(z / g) * g
            const fx = (x - x0) / g
            const fz = (z - z0) / g
            const h = (rule.vertex(x0, z0) * (1 - fx) + rule.vertex(x0 + g, z0) * fx) * (1 - fz)
              + (rule.vertex(x0, z0 + g) * (1 - fx) + rule.vertex(x0 + g, z0 + g) * fx) * fz
            const a = acc.get(cat)!.get(rule.name)!
            a.n++
            if (top > floor + 1e-4) {
              // Wet (sea/lake surface over the floor): only a far surface above the water would show.
              a.wet++
              if (h > top) a.wetPokes++
              continue
            }
            const poke = h - floor
            if (poke > 0) a.pokes.push(poke)
            a.gaps.push(floor - h)
          }
        }
      }
      if (++shown % 50 === 0) process.stderr.write(`${area}: ${shown} chunks\n`)
    }
  }
  console.log(`\n## ${area} (${ax}, ${az}) — ${(2 * radius + 1) ** 2} chunks: river ${counts.river}, road/village ${counts.road}, plain ${counts.plain}; chunk tile p50 ${r2(pct(tileMs, 0.5))} ms`)
  console.log('modifier delta (shaped floor − raw floor) p01/p50/p99 m:')
  for (const [cat, v] of Object.entries(modDelta)) if (v.length) console.log(`  ${cat}: ${r2(pct(v, 0.01))} / ${r2(pct(v, 0.5))} / ${r2(pct(v, 0.99))}  min ${r2(min(v))} max ${r2(max(v))}`)
  console.log('| category | rule | dry poke>0 % | poke>0.25 m % | poke max m | gap p50 | gap p95 | gap p99 | wet % | wet poke % |')
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
  for (const [cat, rules] of acc) {
    for (const [name, a] of rules) {
      const over = a.pokes.filter((p) => p > 0.25).length
      const dry = a.n - a.wet
      console.log(`| ${cat} | ${name} | ${r2(100 * a.pokes.length / dry)} | ${r2(100 * over / dry)} | ${r2(a.pokes.length ? max(a.pokes) : 0)} | ${r2(pct(a.gaps, 0.5))} | ${r2(pct(a.gaps, 0.95))} | ${r2(pct(a.gaps, 0.99))} | ${r2(100 * a.wet / a.n)} | ${r2(a.wet ? 100 * a.wetPokes / a.wet : 0)} |`)
    }
  }
}

console.log('\n## buildMapTile cost (full coverage, standard rivers), 3 tiles per step around home')
for (const step of [4, 8, 16] as MapRasterStep[]) {
  const times: number[] = []
  for (const tx of [-1, 0, 1]) {
    const coord = { step, tx, tz: 0 }
    const tile = buildMapTile({ ...coord, params: raw, coverage: coverageBlocksFor(mapTileBounds(coord), step) })
    times.push(tile.elapsedMs)
  }
  console.log(`step ${step} (${64 * step} m tile): ${times.map((v) => Math.round(v)).join(' / ')} ms`)
}
console.log(`\nseed ${seed}, hydrology ${hydrologyId}`)
