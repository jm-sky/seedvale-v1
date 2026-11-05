// Usage: pnpm tsx scripts/perf/census-landforms.ts [seeds=42,415424794,1,7,1234,99991,2026]
// Plan world-terrain-060 R3: P1 landform descriptors per seed (kind, centre, radius, intendedOutcome, ground height,
// distance from home) and the shortfall vs the target (1 lake island, 1 crater, 1–3 crags; no per-kind guarantee).
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { landformDescriptorsOf, type RawSampleParams, sampleRawFloorUncorrected } from '../../src/terrain/chunkHeightmap'
const seeds = (process.argv[2] ?? '42,415424794,1,7,1234,99991,2026').split(',').map(Number)
for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const p = { ...t, seed, hydrologyId: 'unconditioned' } as unknown as RawSampleParams
  const list = landformDescriptorsOf(p)
  const count = (k: string) => list.filter((d) => d.kind === k).length
  console.log(`seed ${seed}: ${list.length} landforms (lakeIsland ${count('lakeIsland')}, crater ${count('crater')}, crag ${count('crag')})`)
  for (const d of list) {
    const h = sampleRawFloorUncorrected(d.centreX, d.centreZ, p)
    console.log(`  ${d.id} at (${d.centreX.toFixed(0)}, ${d.centreZ.toFixed(0)}) r ${d.radius.toFixed(0)} m, centre floor ${h.toFixed(1)} m, ${Math.hypot(d.centreX, d.centreZ).toFixed(0)} m from home — ${d.intendedOutcome}`)
  }
}
