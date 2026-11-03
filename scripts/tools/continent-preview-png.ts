import { writeFileSync } from 'node:fs'
/**
 * Headless counterpart of the Continent Preview page (plan tools-023): same
 * canonical tile builder, painter and hydrology, single-threaded, no browser.
 *
 *   pnpm tsx scripts/tools/continent-preview-png.ts <seed> <out.png> [all|standard]
 *
 * @domain tools
 */
import { deflateSync } from 'node:zlib'
import { createBenchmarkWorldConfig } from '../../src/config/worldConfig'
import { ensureWorldHydrology, sampleRowsOnThisThread } from '../../src/terrain/worldHydrologyRuntime'
import { paintMapTilePixels } from '../../src/ui-vue/lib/mapTerrainPaint'
import { continentTileRequests } from '../../src/world/map/continentPreview'
import { MAP_EXTENT_HALF } from '../../src/world/map/mapConfig'
import { rawSampleParamsFromWorld } from '../../src/world/map/mapProjection'
import { buildMapTile, MAP_TILE_SAMPLES, MAP_TILE_SIDE, mapTileBounds, mapTileWorldSize } from '../../src/world/map/mapRasterTile'

const PX = 1536
const MIN_RIVER_PX = 1.5
const RIVER_RGB = [0x4a, 0x82, 0xbc]

const [seedArg, out, detailArg] = process.argv.slice(2)
const seed = Number(seedArg)
if (!Number.isInteger(seed) || !out) throw new Error('usage: <seed> <out.png> [all|standard]')
const detail = detailArg === 'standard' ? 'standard' : 'all'

const params = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
const t0 = performance.now()
const install = await ensureWorldHydrology(params, { sampleRows: sampleRowsOnThisThread, cache: { read: async () => null, write: async () => {} }, installInWorkers: () => {} })
console.log(`hydrology ${install.source} ${install.hash} ${(install.totalMs / 1000).toFixed(1)}s`)

const rgba = new Uint8Array(PX * PX * 4)
const scale = PX / (MAP_EXTENT_HALF * 2)
const toPx = (w: number) => (w + MAP_EXTENT_HALF) * scale
const pixels = new Uint8ClampedArray(MAP_TILE_SIDE * MAP_TILE_SIDE * 4)
const requests = continentTileRequests(params, detail)
const riverSegments: { x: number, z: number, w: number }[][] = []

for (const [n, request] of requests.entries()) {
  const tile = buildMapTile(request)
  paintMapTilePixels(tile, params, pixels)
  const b = mapTileBounds(tile)
  const size = mapTileWorldSize(tile.step)
  const x0 = Math.round(toPx(b.minX)), x1 = Math.round(toPx(b.maxX))
  const z0 = Math.round(toPx(b.minZ)), z1 = Math.round(toPx(b.maxZ))
  for (let py = z0; py < z1; py++) {
    for (let px = x0; px < x1; px++) {
      const i = Math.min(MAP_TILE_SAMPLES - 1, Math.floor(((px + 0.5) / scale - MAP_EXTENT_HALF - b.minX) / tile.step)) + 1
      const j = Math.min(MAP_TILE_SAMPLES - 1, Math.floor(((py + 0.5) / scale - MAP_EXTENT_HALF - b.minZ) / tile.step)) + 1
      const s = (j * MAP_TILE_SIDE + i) * 4
      const o = (py * PX + px) * 4
      rgba[o] = pixels[s]!; rgba[o + 1] = pixels[s + 1]!; rgba[o + 2] = pixels[s + 2]!; rgba[o + 3] = 255
    }
  }
  void size
  let offset = 0
  for (const count of tile.riverRuns) {
    const run: { x: number, z: number, w: number }[] = []
    for (let p = 0; p < count; p++) {
      const k = (offset + p) * 3
      run.push({ x: tile.riverPoints[k]!, z: tile.riverPoints[k + 1]!, w: tile.riverPoints[k + 2]! })
    }
    riverSegments.push(run)
    offset += count
  }
  if ((n + 1) % 24 === 0) console.log(`tiles ${n + 1}/${requests.length}`)
}

function dot(cx: number, cy: number, r: number): void {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if (x < 0 || y < 0 || x >= PX || y >= PX || (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 > r * r) continue
      const o = (y * PX + x) * 4
      rgba[o] = RIVER_RGB[0]!; rgba[o + 1] = RIVER_RGB[1]!; rgba[o + 2] = RIVER_RGB[2]!
    }
  }
}
for (const run of riverSegments) {
  for (let p = 0; p + 1 < run.length; p++) {
    const a = run[p]!, c = run[p + 1]!
    const ax = toPx(a.x), ay = toPx(a.z), cx = toPx(c.x), cy = toPx(c.z)
    const r = Math.max(MIN_RIVER_PX, ((a.w + c.w) / 2) * scale) / 2
    const n = Math.max(1, Math.ceil(Math.hypot(cx - ax, cy - ay) * 2))
    for (let t = 0; t <= n; t++) dot(ax + ((cx - ax) * t) / n, ay + ((cy - ay) * t) / n, r)
  }
}

// Minimal PNG encoder (RGBA8).
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc = (buf: Buffer) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255]! ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
const chunk = (type: string, data: Buffer) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(body))
  return Buffer.concat([len, body, c])
}
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(PX, 0); ihdr.writeUInt32BE(PX, 4); ihdr[8] = 8; ihdr[9] = 6
const raw = Buffer.alloc((PX * 4 + 1) * PX)
for (let y = 0; y < PX; y++) Buffer.from(rgba.buffer, y * PX * 4, PX * 4).copy(raw, y * (PX * 4 + 1) + 1)
writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]))
console.log(`wrote ${out} (${((performance.now() - t0) / 1000).toFixed(1)}s)`)
