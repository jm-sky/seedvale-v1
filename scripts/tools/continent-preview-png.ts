import { writeFileSync } from 'node:fs'
/**
 * Headless counterpart of the Continent Preview page (plan tools-023): same
 * canonical tile builder, painter and hydrology, single-threaded, no browser.
 *
 *   pnpm tsx scripts/tools/continent-preview-png.ts <seed> <out.png> [all|standard] [--hillshade] [--slope] [--settlements] [--routes] [--landforms] [--stream-m2=480,960,1920]
 *
 * tools-026 D4 layers (all optional, default output unchanged): `--hillshade` multiplies the terrain by a NW-lit shade, `--slope`
 * tints land by slope class (<5 / 5-10 / 10-20 / 20-30 / >=30 deg, ~8 m pixel gradients: a coarse map-scale estimate),
 * `--settlements` marks sites (size-scaled dots, home ringed), `--routes` draws road-route polylines over the terrain,
 * `--stream-m2=` writes one extra image per initiation area (uniform runoff, preview only, `<out>-streams-<m2>.png`) on a hillshade.
 * The mountain gate is not exposed by the generator, so no gate layer (see censusRelief.ts proxy).
 *
 * @domain tools
 */
import { deflateSync } from 'node:zlib'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { createBenchmarkWorldConfig } from '../../src/config/worldConfig'
import { clearRoadNetworkCaches, roadRoutesForSettlement } from '../../src/settlement/roadNetwork'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor, settlementLayoutFor } from '../../src/settlement/settlementPlanCache'
import { clearCemeteryCaches } from '../../src/terrain/cemeteryAssignment'
import { landformDescriptorsFor } from '../../src/terrain/landformDescriptors'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { computeWorldHydrology, sampleRawFloorRows, unpackChains, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { ensureWorldHydrology, sampleRowsOnThisThread } from '../../src/terrain/worldHydrologyRuntime'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { paintMapTilePixels } from '../../src/ui-vue/lib/mapTerrainPaint'
import { continentTileRequests } from '../../src/world/map/continentPreview'
import { MAP_EXTENT_HALF } from '../../src/world/map/mapConfig'
import { rawSampleParamsFromWorld } from '../../src/world/map/mapProjection'
import { buildMapTile, MAP_TILE_SAMPLES, MAP_TILE_SIDE, mapTileBounds, mapTileWorldSize } from '../../src/world/map/mapRasterTile'

const PX = 1536
const MIN_RIVER_PX = 1.5
const RIVER_RGB = [0x4a, 0x82, 0xbc]

const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
const flag = (n: string) => flags.includes(`--${n}`)
const streamM2s = (flags.find((f) => f.startsWith('--stream-m2='))?.slice(12) ?? '').split(',').filter(Boolean).map(Number)
const [seedArg, out, detailArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const seed = Number(seedArg)
if (!Number.isInteger(seed) || !out) throw new Error('usage: <seed> <out.png> [all|standard]')
const detail = detailArg === 'standard' ? 'standard' : 'all'

const params = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
const t0 = performance.now()
const install = await ensureWorldHydrology(params, { sampleRows: sampleRowsOnThisThread, cache: { read: async () => null, write: async () => {} }, installInWorkers: () => {} })
console.log(`hydrology ${install.source} ${install.hash} ${(install.totalMs / 1000).toFixed(1)}s`)

const rgba = new Uint8Array(PX * PX * 4)
const hgt = new Float32Array(PX * PX)
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
      hgt[py * PX + px] = tile.heights[j * MAP_TILE_SIDE + i]!
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


const pxMetres = (MAP_EXTENT_HALF * 2) / PX
const gradDeg = (x: number, y: number): { deg: number, shade: number } => {
  const at = (xx: number, yy: number) => hgt[Math.min(PX - 1, Math.max(0, yy)) * PX + Math.min(PX - 1, Math.max(0, xx))]!
  const dzdx = (at(x + 1, y) - at(x - 1, y)) / (2 * pxMetres)
  const dzdy = (at(x, y + 1) - at(x, y - 1)) / (2 * pxMetres)
  const deg = (Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI
  // Light from NW (x-, z-): shade = n . l with z down the image.
  const nl = (-dzdx * -0.7071 + -dzdy * -0.7071 + 1) / Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1)
  return { deg, shade: nl }
}
const SLOPE_RGB = [[0, 0, 0, 0], [255, 235, 120, 90], [255, 170, 60, 130], [235, 80, 40, 170], [150, 20, 150, 200]] as const
function applyRelief(target: Uint8Array, mode: { hillshade: boolean, slope: boolean }): void {
  for (let y = 0; y < PX; y++) for (let x = 0; x < PX; x++) {
    const o = (y * PX + x) * 4
    if (hgt[y * PX + x]! <= params.waterLevel + 0.01) continue // open water stays flat
    const { deg, shade } = gradDeg(x, y)
    if (mode.hillshade) {
      const f = Math.min(1.35, Math.max(0.55, 0.45 + 0.9 * shade))
      for (let c = 0; c < 3; c++) target[o + c] = Math.min(255, Math.round(target[o + c]! * f))
    }
    if (mode.slope) {
      const cls = deg < 5 ? 0 : deg < 10 ? 1 : deg < 20 ? 2 : deg < 30 ? 3 : 4
      const [r, g, b, a] = SLOPE_RGB[cls]!
      for (const [c, v] of [r, g, b].entries()) target[o + c] = Math.round((target[o + c]! * (255 - a) + v * a) / 255)
    }
  }
}
function line(target: Uint8Array, ax: number, ay: number, bx: number, by: number, rgb: readonly number[], r = 0.75): void {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) * 2))
  for (let t = 0; t <= n; t++) {
    const cx = ax + ((bx - ax) * t) / n, cy = ay + ((by - ay) * t) / n
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if (x < 0 || y < 0 || x >= PX || y >= PX || (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 > r * r) continue
      const o = (y * PX + x) * 4
      target[o] = rgb[0]!; target[o + 1] = rgb[1]!; target[o + 2] = rgb[2]!
    }
  }
}
function disc(target: Uint8Array, cx: number, cy: number, r: number, rgb: readonly number[], ring = false): void {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy)
    if (x < 0 || y < 0 || x >= PX || y >= PX || d > r || (ring && d < r - 1.2)) continue
    const o = (y * PX + x) * 4
    target[o] = rgb[0]!; target[o + 1] = rgb[1]!; target[o + 2] = rgb[2]!
  }
}

if (flag('hillshade') || flag('slope')) applyRelief(rgba, { hillshade: flag('hillshade'), slope: flag('slope') })

// plan 060 R0 debug overlay: descriptor footprints (magenta rings, cyan for spine summits). Zero descriptors → draws nothing.
if (flag('landforms')) {
  const descriptors = landformDescriptorsFor(seed)
  for (const d of descriptors) {
    disc(rgba, toPx(d.centreX), toPx(d.centreZ), Math.max(2, d.radius * scale), d.kind === 'spineSummit' ? [40, 220, 230] : [230, 40, 200], true)
  }
  console.log(`landforms drawn: ${descriptors.length}`)
}

if (flag('settlements') || flag('routes')) {
  clearSettlementDefCache(); clearRoadNetworkCaches(); clearCemeteryCaches()
  const t = defaultTerrainConfig(65)
  const snap: WorldKnowledgeTerrainSnapshot = {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56, hydrologyId: params.hydrologyId,
  }
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: params.hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const defs = settlementLayoutFor(ctx).sites.map((site) => settlementDefFor(site.cell, ctx)).filter((d) => d != null)
  if (flag('routes')) {
    const seen = new Set<string>()
    let n = 0
    for (const d of defs) for (const r of roadRoutesForSettlement(d, ctx)) {
      const key = r.points.length + ':' + r.points[0]!.x.toFixed(0) + ',' + r.points[0]!.z.toFixed(0)
      if (seen.has(key)) continue
      seen.add(key); n++
      for (let k = 0; k + 1 < r.points.length; k++) line(rgba, toPx(r.points[k]!.x), toPx(r.points[k]!.z), toPx(r.points[k + 1]!.x), toPx(r.points[k + 1]!.z), [250, 245, 235], 0.7)
    }
    console.log(`routes drawn: ${n}`)
  }
  if (flag('settlements')) {
    const radius: Record<string, number> = { SM: 3, MD: 4, LG: 5, XL: 6 }
    for (const d of defs) {
      disc(rgba, toPx(d.x), toPx(d.z), (radius[d.size] ?? 4) + 1.2, [20, 20, 20])
      disc(rgba, toPx(d.x), toPx(d.z), radius[d.size] ?? 4, d.isHome ? [255, 210, 40] : [225, 50, 50])
      if (d.isHome) disc(rgba, toPx(d.x), toPx(d.z), 9, [255, 210, 40], true)
    }
    console.log(`settlements drawn: ${defs.length}`)
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
function writePng(file: string, data: Uint8Array): void {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(PX, 0); ihdr.writeUInt32BE(PX, 4); ihdr[8] = 8; ihdr[9] = 6
  const raw = Buffer.alloc((PX * 4 + 1) * PX)
  for (let y = 0; y < PX; y++) Buffer.from(data.buffer, data.byteOffset + y * PX * 4, PX * 4).copy(raw, y * (PX * 4 + 1) + 1)
  writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]))
}
writePng(out, rgba)

// D1 threshold variants: recompute chains on the same floor grid with other initiation areas (uniform runoff, preview only).
if (streamM2s.length > 0) {
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(params, grid, 0, grid.size)
  for (const m2 of streamM2s) {
    const cells = Math.max(1, Math.round(m2 / (grid.cellStep * grid.cellStep)))
    const hv = computeWorldHydrology({ ...grid, floor }, { waterLevel: params.waterLevel, seed, streamAccumulation: cells })
    // Neutral base: land from the standard render, rivers dropped (repaint from the base-layer copy, then hillshade).
    const base = new Uint8Array(rgba.length)
    for (let y = 0; y < PX; y++) for (let x = 0; x < PX; x++) {
      const o = (y * PX + x) * 4
      const sea = hgt[y * PX + x]! <= params.waterLevel + 0.01
      const v = sea ? [60, 90, 120] : [196, 190, 170]
      base[o] = v[0]!; base[o + 1] = v[1]!; base[o + 2] = v[2]!; base[o + 3] = 255
    }
    applyRelief(base, { hillshade: true, slope: false })
    let km = 0
    for (const c of unpackChains(hv.chains)) for (let k = 0; k + 1 < c.points.length; k++) {
      const a = c.points[k]!, b = c.points[k + 1]!
      km += Math.hypot(b.x - a.x, b.z - a.z) / 1000
      line(base, toPx(a.x), toPx(a.z), toPx(b.x), toPx(b.z), RIVER_RGB, 0.9)
    }
    const file = out.replace(/\.png$/, '') + `-streams-${m2}.png`
    writePng(file, base)
    console.log(`wrote ${file} (stream ${km.toFixed(0)} km @ ${m2} m² / ${cells} cells)`)
  }
}
console.log(`wrote ${out} (${((performance.now() - t0) / 1000).toFixed(1)}s)`)
