// Usage: pnpm worldgen:continent:census [--seeds=42,415424794] [--rings=21] [--nomask] [--json]
// World-terrain-058 slice W1: finite-continent census (read-only, diagnostic).
//  - land fraction within R = 2.5 km of the origin (floor above sea level),
//  - sea at every border cell (perimeter of the ±6144 m box),
//  - coast radius per compass direction (first sea sample walking outward),
//  - settlements along each of 8 compass rays from home (centre within ±150 m = half
//    the grid pitch of the ray, before the coast — the villages a walk in that
//    direction passes; a ±300 m band double-counts the adjacent grid row). W1 target
//    (Q71 author decision 2026-11-02): per seed median 4–6 and ≥ 5 rays with 3–7,
//  - total settlements on the continent (informative, ~120–180 expected),
//  - home settlement centre (compare with `--nomask` for "home unchanged").
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { type RawSampleParams, sampleRawTexelAt } from '../../src/terrain/chunkHeightmap'
import { WORLD_HALF_EXTENT } from '../../src/terrain/continentMask'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '21'))
const noMask = process.argv.includes('--nomask')
const asJson = process.argv.includes('--json')
const LAND_R = 2500
const RAY_BAND = 150

function snapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  const region = noMask ? { ...t.region, continentMask: undefined } : t.region
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56,
  }
}

function measure(seed: number): Record<string, unknown> {
  const snap = snapshot(seed)
  const params = snap as unknown as RawSampleParams
  const isLand = (x: number, z: number) => sampleRawTexelAt(x, z, params).floorH > snap.waterLevel

  let land = 0
  let total = 0
  for (let x = -LAND_R; x <= LAND_R; x += 50) {
    for (let z = -LAND_R; z <= LAND_R; z += 50) {
      if (Math.hypot(x, z) > LAND_R) continue
      total++
      if (isLand(x, z)) land++
    }
  }

  let borderLand = 0
  let borderCells = 0
  for (let t = -WORLD_HALF_EXTENT; t <= WORLD_HALF_EXTENT; t += 64) {
    for (const [x, z] of [[t, -WORLD_HALF_EXTENT], [t, WORLD_HALF_EXTENT], [-WORLD_HALF_EXTENT, t], [WORLD_HALF_EXTENT, t]] as const) {
      borderCells++
      if (isLand(x, z)) borderLand++
    }
  }

  // Coast radius per direction: last land sample walking outward from the origin.
  const dirs = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)
  const coast = dirs.map((a) => {
    let last = 0
    for (let r = 0; r <= WORLD_HALF_EXTENT; r += 25) {
      if (isLand(Math.cos(a) * r, Math.sin(a) * r)) last = r
    }
    return last
  })

  clearSettlementDefCache()
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  const rayCounts = dirs.map((a, i) => {
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    let n = 0
    for (const d of defs) {
      const along = d.x * dx + d.z * dz
      const across = Math.abs(d.x * -dz + d.z * dx)
      if (along > 50 && across <= RAY_BAND && along <= coast[i]! + 100) n++
    }
    return n
  })
  const home = defs.find((d) => d.id === '0_0')
  return {
    seed,
    landWithin2500: `${((land / total) * 100).toFixed(1)} %`,
    borderLandCells: `${borderLand}/${borderCells}`,
    coastRadiusPerRay: coast.join(' '),
    settlementsPerRay: rayCounts.join(' '),
    rayMedian: [...rayCounts].sort((a, b) => a - b).slice(3, 5).reduce((a, b) => a + b, 0) / 2,
    raysWith3to7: rayCounts.filter((n) => n >= 3 && n <= 7).length,
    settlementsTotal: defs.length,
    home: home ? `${home.x.toFixed(1)},${home.z.toFixed(1)}` : 'none',
  }
}

const rows = seeds.map(measure)
if (asJson) console.log(JSON.stringify(rows, null, 2))
else for (const r of rows) console.log(Object.entries(r).map(([k, v]) => `${k}: ${v}`).join('\n'), '\n')
