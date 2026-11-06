/**
 * Biome land shares per latitude third, legacy (moisture-only) vs climate-driven (plan 062 B1).
 *
 *   pnpm tsx scripts/tools/biome-shares.ts <seed>[,<seed>...] [--png=<prefix>]
 *
 * Samples the unconditioned floor on a 64 m grid (land = floor above water). With `--png=` writes
 * `<prefix>-<seed>-{legacy,climate}.png` (desert tan / swamp teal / forest green / sea blue).
 *
 * @domain tools
 */
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { createBenchmarkWorldConfig } from '../../src/config/worldConfig'
import { biomeWeightsAt, biomeWeightsAtPoint } from '../../src/terrain/biomeRegions'
import { sampleRawTexelUncorrectedAt } from '../../src/terrain/chunkHeightmap'
import { macroClimateOf } from '../../src/terrain/macroClimate'
import { rawSampleParamsFromWorld } from '../../src/world/map/mapProjection'

const HALF = 6144
const STEP = 64
const N = (2 * HALF) / STEP
const args = process.argv.slice(2)
const seeds = (args.find((a) => !a.startsWith('--')) ?? '').split(',').map(Number)
const pngPrefix = args.find((a) => a.startsWith('--png='))?.slice(6)

function png(rgb: Uint8Array, w: number, h: number): Buffer {
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; Buffer.from(rgb.buffer, y * w * 3, w * 3).copy(raw, y * (w * 3 + 1) + 1) }
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c })
  const crc = (b: Buffer) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255]! ^ (c >>> 8); return (c ^ -1) >>> 0 }
  const chunk = (t: string, d: Buffer) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]) }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

for (const seed of seeds) {
  const params = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
  const t0 = performance.now()
  macroClimateOf(params)
  console.log(`seed ${seed}: climate memo ${(performance.now() - t0).toFixed(0)} ms`)
  for (const mode of ['legacy', 'climate'] as const) {
    const sums = [0, 1, 2].map(() => ({ land: 0, desert: 0, swamp: 0, forest: 0 }))
    const rgb = new Uint8Array(N * N * 3)
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = -HALF + (i + 0.5) * STEP
      const z = -HALF + (j + 0.5) * STEP
      const t = sampleRawTexelUncorrectedAt(x, z, params)
      const k = (j * N + i) * 3
      if (t.floorH <= params.waterLevel) { rgb[k] = 40; rgb[k + 1] = 80; rgb[k + 2] = 140; continue }
      const alt = Math.max(0, (t.floorH - params.waterLevel) / params.heightScale)
      const w = mode === 'legacy' ? biomeWeightsAt(t.moistureRegion, alt, params.region) : biomeWeightsAtPoint(params, x, z, alt, t.moistureRegion)
      const s = sums[Math.min(2, Math.floor((j / N) * 3))]!
      s.land++; s.desert += w.desert; s.swamp += w.swamp; s.forest += w.forest
      rgb[k] = Math.round(w.desert * 220 + w.swamp * 40 + w.forest * 50)
      rgb[k + 1] = Math.round(w.desert * 190 + w.swamp * 130 + w.forest * 140)
      rgb[k + 2] = Math.round(w.desert * 110 + w.swamp * 120 + w.forest * 50)
    }
    const tot = sums.reduce((a, s) => ({ land: a.land + s.land, desert: a.desert + s.desert, swamp: a.swamp + s.swamp, forest: a.forest + s.forest }), { land: 0, desert: 0, swamp: 0, forest: 0 })
    const fmt = (s: typeof tot) => `land ${s.land} | desert ${((100 * s.desert) / s.land).toFixed(1)}% swamp ${((100 * s.swamp) / s.land).toFixed(1)}% forest ${((100 * s.forest) / s.land).toFixed(1)}%`
    console.log(`  ${mode.padEnd(7)} all   : ${fmt(tot)}`)
    sums.forEach((s, i) => console.log(`  ${mode.padEnd(7)} ${['north', 'middle', 'south'][i]!.padEnd(6)}: ${fmt(s)}`))
    if (pngPrefix) writeFileSync(`${pngPrefix}-${seed}-${mode}.png`, png(rgb, N, N))
  }
}
