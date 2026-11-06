// Usage: pnpm tsx scripts/perf/census-outcrops.ts [seeds=42,415424794]
// Plan world-terrain-060 R3 correction 5: rock-outcrop density estimate. Crag outcrops are exact (descriptor-seeded);
// summit-zone outcrops are estimated from the 20 m raw-floor grid over the range spines' bounding boxes
// (expected = zone area × SUMMIT_CANDIDATES_PER_CHUNK × SUMMIT_CHANCE / chunk area). Uncorrected floor, no hydrology.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { landformDescriptorsOf, rangeSpinesFor, type RawSampleParams, sampleRawTexelUncorrectedAt } from '../../src/terrain/chunkHeightmap'
import { SUMMIT_EXPECTED_PER_M2, SUMMIT_ZONE_MIN_H_FOR_CENSUS, SUMMIT_ZONE_MIN_RIDGE_FOR_CENSUS } from '../../src/terrain/rockOutcrops'

const seeds = (process.argv[2] ?? '42,415424794').split(',').map(Number)
for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const p = { ...t, seed, hydrologyId: 'unconditioned' } as unknown as RawSampleParams
  const crags = landformDescriptorsOf(p).filter((d) => d.kind === 'crag')
  let zoneCells = 0
  let maxH = 0
  const STEP = 20
  for (const s of rangeSpinesFor(seed, t.region).spines) {
    for (let z = s.minZ - 450; z <= s.maxZ + 450; z += STEP) for (let x = s.minX - 450; x <= s.maxX + 450; x += STEP) {
      const r = sampleRawTexelUncorrectedAt(x, z, p) as { floorH: number, mountainRidge: number }
      maxH = Math.max(maxH, r.floorH)
      if (r.floorH >= SUMMIT_ZONE_MIN_H_FOR_CENSUS && r.mountainRidge >= SUMMIT_ZONE_MIN_RIDGE_FOR_CENSUS) zoneCells++
    }
  }
  const area = zoneCells * STEP * STEP
  console.log(`seed ${seed}: crags ${crags.length} (≈ ${crags.length * 7.5} outcrops), summit zone ${(area / 1e4).toFixed(1)} ha → ≈ ${(area * SUMMIT_EXPECTED_PER_M2).toFixed(0)} outcrops, max floor ${maxH.toFixed(1)} m`)
}
