// Usage: pnpm worldgen:lakes:census
// Q106 (review 030 F2): world-location catalog lakes vs real water. Read-only. Samples every coarse catalog cell
// (LOCATION_SCAN_STEP) of the ±6144 m continent once and flood-fills 4-connected non-ocean wet cells (≥ MIN_LAKE_CELLS),
// the way `worldLocationCatalog` builds `lake` locations:
// - old = the catalog's current rule (floor below sea level, continentalness not ocean);
// - new = map rule `classifyMapTexel` (below sea **or** lake surface above the floor), still continentalness-gated.
// seaAdj = components touching an ocean cell that is below sea level (coastal sea, not a lake); withLakeCells =
// components containing an above-sea hydrology lake cell; pureInland = components not touching the sea.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { type RawSampleParams, sampleRawTexelAt } from '../../src/terrain/chunkHeightmap'
import { isFloorBelowSea, isOceanMix } from '../../src/terrain/terrainClassification'
import { isWetFloor } from '../../src/terrain/waterSurface'
import { LOCATION_SCAN_STEP, MIN_LAKE_CELLS } from '../../src/world/locations/locationConfig'
import { censusHydrologyId } from './censusHydrology'

for (const seed of [42, 415424794]) {
  const t = defaultTerrainConfig(65)
  const params = { seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId: censusHydrologyId(seed) } as RawSampleParams
  const N = Math.ceil(6144 / LOCATION_SCAN_STEP)
  const W = 2 * N
  const oceanG = new Uint8Array(W * W)
  const seaG = new Uint8Array(W * W)
  const lakeG = new Uint8Array(W * W)
  const oldW = new Uint8Array(W * W)
  const newW = new Uint8Array(W * W)
  for (let gz = -N; gz < N; gz++) for (let gx = -N; gx < N; gx++) {
    const s = sampleRawTexelAt((gx + 0.5) * LOCATION_SCAN_STEP, (gz + 0.5) * LOCATION_SCAN_STEP, params)
    const ocean = isOceanMix(s.continentalness, t.region.oceanThreshold, t.region.coastThreshold)
    const i = (gz + N) * W + gx + N
    if (ocean) oceanG[i] = 1
    if (isFloorBelowSea(s.floorH, t.waterLevel)) seaG[i] = 1
    if (!isFloorBelowSea(s.floorH, t.waterLevel) && isWetFloor(s.h, s.floorH)) lakeG[i] = 1
    if (isFloorBelowSea(s.floorH, t.waterLevel) && !ocean) oldW[i] = 1
    if ((isFloorBelowSea(s.floorH, t.waterLevel) || isWetFloor(s.h, s.floorH)) && !ocean) newW[i] = 1
  }
  const comps = (g: Uint8Array) => {
    const seen = new Uint8Array(W * W); const out: { n: number, x: number, z: number, sea: boolean, lake: number }[] = []
    for (let i = 0; i < W * W; i++) {
      if (!g[i] || seen[i]) continue
      const st = [i]; seen[i] = 1; let n = 0; let sx = 0; let sz = 0; let sea = false; let lake = 0
      while (st.length) { const k = st.pop()!; n++; const x = k % W; const z = (k - x) / W; sx += x; sz += z; if (lakeG[k]) lake++
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx; const nz = z + dz; if (nx < 0 || nz < 0 || nx >= W || nz >= W) continue; const j = nz * W + nx; if (oceanG[j] && seaG[j]) sea = true; if (g[j] && !seen[j]) { seen[j] = 1; st.push(j) } } }
      if (n >= MIN_LAKE_CELLS) out.push({ sea, lake, n, x: Math.round(((sx / n) - N + 0.5) * LOCATION_SCAN_STEP), z: Math.round(((sz / n) - N + 0.5) * LOCATION_SCAN_STEP) })
    }
    return out
  }
  const a = comps(oldW); const b = comps(newW)
  const st2 = (l: { sea: boolean, lake: number }[]) => `seaAdj ${l.filter((c) => c.sea).length} withLakeCells ${l.filter((c) => c.lake > 0).length} pureInland ${l.filter((c) => !c.sea).length}`
  console.log(seed, 'old', st2(a), '| new', st2(b))
  if (seed === 415424794) console.log('old near home', a.filter((p) => Math.hypot(p.x - 60, p.z + 5) < 1500).sort((p, q) => Math.hypot(p.x - 60, p.z + 5) - Math.hypot(q.x - 60, q.z + 5)).slice(0, 6).map((c) => `(${c.x},${c.z}) n${c.n} sea${c.sea ? 1 : 0}`).join(' '), '| new pure-inland near home', b.filter((p) => !p.sea && Math.hypot(p.x - 60, p.z + 5) < 1500).map((c) => `(${c.x},${c.z}) n${c.n}`).join(' '))
  const near = (l: { x: number, z: number }[]) => l.filter((p) => Math.hypot(p.x - 60, p.z + 5) < 1500).length
  console.log(`seed ${seed}: inland wet cells old ${oldW.reduce((s, v) => s + v, 0)} new ${newW.reduce((s, v) => s + v, 0)}; lake locations old ${a.length} new ${b.length}; within 1.5 km of home old ${near(a)} new ${near(b)}; sizes new ${b.map((c) => c.n).sort((x, y) => y - x).slice(0, 25).join(',')}`)
}
