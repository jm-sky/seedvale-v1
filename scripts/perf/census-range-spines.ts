// Usage: pnpm tsx scripts/perf/census-range-spines.ts [seeds=42,415424794,1,7,1234,99991,2026]
// Plan world-terrain-060 R1–R2: range spines per seed, top peak, crest max, pass saddle heights and pass-corridor
// grades (raw uncorrected floor — the R4 check repeats it after hydrology/roads/pads).
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { rangeSpinesFor, type RawSampleParams, sampleRawFloorUncorrected } from '../../src/terrain/chunkHeightmap'
const seeds = (process.argv[2] ?? '42,415424794,1,7,1234,99991,2026').split(',').map(Number)
for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const p = { ...t, seed, hydrologyId: 'unconditioned' } as unknown as RawSampleParams
  const set = rangeSpinesFor(seed, t.region)
  let max = -1e9, mx = 0, mz = 0
  for (let x = -4200; x <= 4200; x += 20) for (let z = -4200; z <= 4200; z += 20) {
    const h = sampleRawFloorUncorrected(x, z, p)
    if (h > max) { max = h; mx = x; mz = z }
  }
  console.log(`seed ${seed}: spines ${set.spines.length}, max ${max.toFixed(1)} m at (${mx}, ${mz})`)
  for (const s of set.spines) {
    const passH = s.passes.map((ps) => sampleRawFloorUncorrected(ps.corridor.centreX, ps.corridor.centreZ, p).toFixed(1))
    let cmax = 0
    for (let k = 0; k <= 100; k++) {
      const tt = (s.length * k) / 100
      let i = 0; while (i < s.cum.length - 2 && s.cum[i + 1]! < tt) i++
      const u = (tt - s.cum[i]!) / (s.cum[i + 1]! - s.cum[i]!)
      cmax = Math.max(cmax, sampleRawFloorUncorrected(s.xs[i]! + (s.xs[i + 1]! - s.xs[i]!) * u, s.zs[i]! + (s.zs[i + 1]! - s.zs[i]!) * u, p))
    }
    console.log(`  ${s.id} len ${s.length.toFixed(0)} from (${s.xs[0]!.toFixed(0)},${s.zs[0]!.toFixed(0)}) to (${s.xs.at(-1)!.toFixed(0)},${s.zs.at(-1)!.toFixed(0)}) crestMax ${cmax.toFixed(1)} summits ${s.summits.map((m) => m.amplitude.toFixed(0)).join('/')} passes h ${passH.join('/')}`)
  }
}
// pass corridor grades (20 m steps, raw uncorrected floor, both directions)
for (const seed of seeds) {
  const t = defaultTerrainConfig(65)
  const p = { ...t, seed, hydrologyId: 'unconditioned' } as unknown as RawSampleParams
  for (const s of rangeSpinesFor(seed, t.region).spines) for (const ps of s.passes) {
    const c = ps.corridor
    let maxG = 0, prev = sampleRawFloorUncorrected(c.centreX - c.dirX * c.halfLength, c.centreZ - c.dirZ * c.halfLength, p)
    let worstLat = 0
    for (let u = -c.halfLength + 20; u <= c.halfLength; u += 20) {
      const x = c.centreX + c.dirX * u, z = c.centreZ + c.dirZ * u
      const h = sampleRawFloorUncorrected(x, z, p)
      maxG = Math.max(maxG, Math.abs(h - prev) / 20); prev = h
      // lateral: ±width/2
      const hl = sampleRawFloorUncorrected(x - c.dirZ * c.width / 2, z + c.dirX * c.width / 2, p)
      const hr = sampleRawFloorUncorrected(x + c.dirZ * c.width / 2, z - c.dirX * c.width / 2, p)
      worstLat = Math.max(worstLat, Math.abs(hl - hr) / c.width)
    }
    console.log(`seed ${seed} ${ps.id}: max grade ${(maxG * 100).toFixed(1)} % (target ≤ ${(c.maxGrade * 100).toFixed(0)} %), cross-slope ${(worstLat * 100).toFixed(1)} %`)
  }
}
