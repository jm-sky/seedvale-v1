// Usage: pnpm tsx scripts/perf/census-pass-grades.ts [seeds=42,415424794]
// Plan world-terrain-060 R4: pass-corridor grades on the FINAL terrain (hydrology-corrected height, `sampleHeightAt`),
// both directions, 20 m steps along the corridor centreline. Roads/pads are not applied here (they are separate
// shapers); this is the terrain the router and `slopeConstraint.ts` see. Compare with the raw-floor numbers from
// `census-range-spines.ts`.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { rangeSpinesFor, type RawSampleParams, sampleHeightAt } from '../../src/terrain/chunkHeightmap'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'

const seeds = (process.argv[2] ?? '42,415424794').split(',').map(Number)
for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const base = {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
  }
  const raw = { ...base, hydrologyId: UNCONDITIONED_HYDROLOGY_ID } as RawSampleParams
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(raw, grid, 0, grid.size)
  const h = computeWorldHydrology({ ...grid, floor }, { waterLevel: raw.waterLevel, seed })
  const hid = hydrologyIdFor(raw)
  installWorldHydrology(hid, h)
  const p = { ...base, hydrologyId: hid } as RawSampleParams
  for (const s of rangeSpinesFor(seed, t.region).spines) for (const ps of s.passes) {
    const c = ps.corridor
    const hs: number[] = []
    for (let u = -c.halfLength; u <= c.halfLength; u += 20) hs.push(sampleHeightAt(c.centreX + c.dirX * u, c.centreZ + c.dirZ * u, p))
    const steps = hs.slice(1).map((v, i) => (v - hs[i]!) / 20)
    const up = Math.max(...steps), down = Math.min(...steps)
    // mean grade over 100 m windows (what a walker/router feels), both directions
    let win = 0
    for (let i = 5; i < hs.length; i++) win = Math.max(win, Math.abs(hs[i]! - hs[i - 5]!) / 100)
    const over = steps.filter((g) => Math.abs(g) > c.maxGrade).length
    console.log(`seed ${seed} ${ps.id}: 20 m step max up ${(up * 100).toFixed(1)} % / down ${(-down * 100).toFixed(1)} %, worst 100 m mean ${(win * 100).toFixed(1)} % (maxGrade ${(c.maxGrade * 100).toFixed(0)} %), steps over maxGrade ${over}/${steps.length}`)
  }
}
