// Usage: pnpm worldgen:vegetation:census [--seeds=42,415424794] [--span=24] [--step=1]
// Queue Q165 (062 B3): per-chunk vegetation instance census over a square of chunks around the origin (no runtime, no
// Three.js). Reports totals per kind, per-chunk percentiles, and the densest chunk / densest 3x3 block. Rivers are not
// passed (riverSegments empty) — counts are comparable before/after a change, not absolute in-game numbers.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { type ChunkTileParams, computeChunkTile } from '../../src/terrain/chunkHeightmap'
import { computeChunkVegetation } from '../../src/terrain/chunkVegetation'
import { censusHydrologyId } from './censusHydrology'

const arg = (n: string, d: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const span = Number(arg('span', '24'))
const step = Number(arg('step', '1'))

for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const hydrologyId = censusHydrologyId(seed)
  const kinds = new Map<string, number>()
  const perChunk = new Map<string, number>()
  for (let cz = -span; cz <= span; cz += step) {
    for (let cx = -span; cx <= span; cx += step) {
      const params: ChunkTileParams = {
        cx, cz, chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale,
        waterLevel: t.waterLevel, noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude,
        hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm,
        biome: t.biome, region: t.region, hydrologyId, isHomeChunk: cx === 0 && cz === 0,
        vegetationSpeciesCount: { tree: 9, bush: 5, cactus: 2, reed: 1, fern: 1, lily: 1, seaweed: 1 },
        roadSegments: [], clearings: [], regional: [], riverSegments: [],
      }
      const tile = computeChunkTile(params)
      const veg = computeChunkVegetation({ cx, cz }, tile, params)
      perChunk.set(`${cx},${cz}`, veg.length)
      for (const v of veg) kinds.set(v.kind, (kinds.get(v.kind) ?? 0) + 1)
    }
  }
  const counts = [...perChunk.values()].sort((a, b) => a - b)
  const pct = (p: number) => counts[Math.min(counts.length - 1, Math.floor(p * counts.length))]
  let best = { key: '', sum: 0 }
  for (let cz = -span; cz <= span; cz += step) {
    for (let cx = -span; cx <= span; cx += step) {
      let sum = 0
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) sum += perChunk.get(`${cx + dx * step},${cz + dz * step}`) ?? 0
      if (sum > best.sum) best = { key: `${cx},${cz}`, sum }
    }
  }
  const total = counts.reduce((a, b) => a + b, 0)
  const maxKey = [...perChunk.entries()].sort((a, b) => b[1] - a[1])[0]
  console.log(`seed ${seed}: ${perChunk.size} chunks, total ${total}`)
  console.log(`  kinds: ${[...kinds.entries()].sort().map(([k, n]) => `${k}=${n}`).join(' ')}`)
  console.log(`  per chunk: p50 ${pct(0.5)} p90 ${pct(0.9)} p99 ${pct(0.99)} max ${maxKey[1]} @${maxKey[0]}; densest 3x3 ${best.sum} centred @${best.key}`)
}
