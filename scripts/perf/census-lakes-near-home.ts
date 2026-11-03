// Q96 lake-threshold sweep: for each seed and each `(lakeMinCells, lakeMinDepthM)` candidate, report total lakes,
// median area, filled-pit share of land and the number of distinct lakes whose basin comes within 300 / 600 / 1000 m
// of the home settlement.
// pnpm exec tsx scripts/perf/census-lakes-near-home.ts --seeds=415424794,42 --cells=80,300,600 --depths=0.3,0.6,1
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { computeWorldHydrology, sampleRawFloorRows, sparseBlockValue, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '415424794,42').split(',').map(Number)
const cellsList = arg('cells', '80,300,600').split(',').map(Number)
const depthList = arg('depths', '0.3,0.6,1').split(',').map(Number)
/** Home settlement centres (reference seeds; see Q37 plan §4). */
const HOME: Record<number, { x: number, z: number }> = { 415424794: { x: 60, z: -5 }, 42: { x: 8, z: 23 } }
const RADII = [300, 600, 1000]

function sampleParamsFor(seed: number): RawSampleParams {
  const t = defaultTerrainConfig(65)
  return {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
  }
}

const rows: string[] = ['seed | minCells | minDepth | lakes | median ha | filled % land | ≤300 m | ≤600 m | ≤1000 m']
for (const seed of seeds) {
  const params = sampleParamsFor(seed)
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(params, grid, 0, grid.size)
  const home = HOME[seed] ?? { x: 0, z: 0 }
  for (const lakeMinCells of cellsList) {
    for (const lakeMinDepthM of depthList) {
      const h = computeWorldHydrology({ ...grid, floor }, { waterLevel: params.waterLevel, seed, lakeMinCells, lakeMinDepthM })
      const areas = h.lakes.map((l) => l.areaM2).sort((a, b) => a - b)
      const median = areas.length ? areas[areas.length >> 1]! / 1e4 : 0
      const filledPct = (100 * h.stats.filledCells) / Math.max(1, h.stats.landCells)
      const nearest = new Map<number, number>()
      const rCells = Math.ceil(RADII[RADII.length - 1]! / grid.cellStep)
      const ci = Math.round((home.x - grid.originX) / grid.cellStep)
      const cj = Math.round((home.z - grid.originZ) / grid.cellStep)
      for (let dj = -rCells; dj <= rCells; dj++) {
        for (let di = -rCells; di <= rCells; di++) {
          const id = sparseBlockValue(h.basin, ci + di, cj + dj)
          if (!id) continue
          const d = Math.hypot(di, dj) * grid.cellStep
          if (d < (nearest.get(id) ?? Infinity)) nearest.set(id, d)
        }
      }
      const within = RADII.map((r) => [...nearest.values()].filter((d) => d <= r).length)
      rows.push(`${seed} | ${lakeMinCells} | ${lakeMinDepthM} | ${h.lakes.length} | ${median.toFixed(1)} | ${filledPct.toFixed(1)} | ${within.join(' | ')}`)
      console.error(rows[rows.length - 1])
    }
  }
}
console.log(rows.join('\n'))
