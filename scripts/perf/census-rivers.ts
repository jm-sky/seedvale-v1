import type { RoadNetworkContext } from '../../src/settlement/roadNetwork'
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
// Usage: pnpm worldgen:rivers:census [--seeds=42,415424794] [--tiles=8] [--rings=5] [--json]
//
// Q67 hydrology-continuity census (read-only, diagnostic). Walks every river
// tile in a (2*tiles)^2 square around the origin with the production
// `computeRiverTileDiagnostics` and classifies how visible chains end:
//   - water: last cell is a water-backed terminal (sea/lake),
//   - seam-ok: core exit continued by a rendered chain of the neighbour tile,
//   - seam-break: core exit with no rendered continuation (river stops at the
//     tile seam) — broken down by what the neighbour did with that cell,
//   - rejected continuations (whole downstream fragment dropped),
// plus isolated stream sources inside / next to settlement footprints.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { sampleHeightAt } from '../../src/terrain/chunkHeightmap'
import {
  computeRiverTileDiagnostics,
  RIVER_CELL_STEP,
  RIVER_TILE_SIZE,
  type RiverChain,
  type RiverChainDiagnostic,
  riverTileKey,
} from '../../src/terrain/riverNetwork'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const tilesHalf = Number(arg('tiles', '8'))
const rings = Number(arg('rings', '5'))
const asJson = process.argv.includes('--json')

type P = { x: number, z: number }
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.z - b.z)

function sampleParamsFor(seed: number): RawSampleParams {
  const t = defaultTerrainConfig(65)
  return {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
  } as RawSampleParams
}

function snapshotFor(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56,
  }
}

type TileData = { tx: number, tz: number, chains: RiverChain[], diags: RiverChainDiagnostic[], rendered: RiverChainDiagnostic[] }
type Ending = {
  seed: number
  kind: string
  x: number
  z: number
  visibleCells: number
  maxAcc: number
  detail: string
}

function measure(seed: number) {
  const params = sampleParamsFor(seed)
  const tiles = new Map<string, TileData>()
  const t0 = performance.now()
  // One ring of extra tiles so every inner tile's neighbours exist.
  for (let tz = -tilesHalf - 1; tz < tilesHalf + 1; tz++) {
    for (let tx = -tilesHalf - 1; tx < tilesHalf + 1; tx++) {
      const { chains, diagnostics } = computeRiverTileDiagnostics({ tx, tz }, params)
      tiles.set(riverTileKey({ tx, tz }), {
        tx, tz, chains, diags: diagnostics, rendered: diagnostics.filter((d) => d.rejected === null),
      })
    }
  }
  const computeMs = performance.now() - t0

  clearSettlementDefCache()
  setSettlementRiverQuery(createRiverQuery(params))
  const ctx: RoadNetworkContext = worldKnowledgeRoadContext(snapshotFor(seed))
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  const R = (d: SettlementDef) => villageSizeConfig(d.size).footprintRadius

  const tileOf = (x: number, z: number) => tiles.get(riverTileKey({ tx: Math.floor(x / RIVER_TILE_SIZE), tz: Math.floor(z / RIVER_TILE_SIZE) }))
  const adj = RIVER_CELL_STEP * 1.5 + 0.01
  const counts: Record<string, number> = {}
  const bump = (k: string) => { counts[k] = (counts[k] ?? 0) + 1 }
  const endings: Ending[] = []
  const sourcesNearSettlement: Ending[] = []
  let renderedChains = 0
  let totalVisibleKm = 0
  let underwaterKm = 0
  let lostDrySinkLong = 0
  let lostDrySinkContinuationLong = 0

  for (const tile of tiles.values()) {
    const inner = tile.tx >= -tilesHalf && tile.tx < tilesHalf && tile.tz >= -tilesHalf && tile.tz < tilesHalf
    if (!inner) continue
    for (const d of tile.diags) {
      if (d.rejected === 'invalid-receiver' && d.cellCount >= 8) {
        lostDrySinkLong++
        if (d.continuation) lostDrySinkContinuationLong++
      }
      if (d.rejected !== null) {
        bump(`rejected:${d.rejected}:${d.continuation ? 'continuation' : 'isolated'}:${d.terminal}`)
      }
    }
    tile.rendered.forEach((d, i) => {
      renderedChains++
      const chain = tile.chains[i]!
      const pts = chain.points
      for (let k = 0; k < pts.length - 1; k++) {
        const len = dist(pts[k]!, pts[k + 1]!) / 1000
        totalVisibleKm += len
        if (sampleHeightAt(pts[k]!.x, pts[k]!.z, params) <= params.waterLevel + 1e-4) underwaterKm += len
      }
      const tail = pts[pts.length - 1]!
      const head = pts[0]!
      const maxAcc = Math.max(...pts.map((p) => p.accumulation))
      bump(`terminal:${d.terminal}`)

      if (!d.continuation) {
        for (const s of defs) {
          const r = R(s)
          const dd = dist(s, head)
          if (dd < r + 40) {
            sourcesNearSettlement.push({
              seed, kind: dd < r ? 'source-inside-footprint' : 'source-near-footprint', x: head.x, z: head.z,
              visibleCells: d.cellCount, maxAcc, detail: `${s.id} d=${dd.toFixed(0)} R=${r}`,
            })
          }
        }
      }

      if (d.terminal !== 'core-exit') return
      // Downstream neighbour tile: the next cell lies just past the tail across the seam.
      const candidates = [-1, 0, 1].flatMap((ox) => [-1, 0, 1].map((oz) => ({ x: tail.x + ox * RIVER_CELL_STEP, z: tail.z + oz * RIVER_CELL_STEP })))
      const neighbourTiles = new Set<TileData>()
      for (const c of candidates) {
        const nt = tileOf(c.x, c.z)
        if (nt && nt !== tile) neighbourTiles.add(nt)
      }
      let continued = false
      let reason = 'no-head-no-chain'
      for (const nt of neighbourTiles) {
        if (nt.chains.some((ch) => ch.points.some((p) => dist(p, tail) <= adj * 1.6))) { continued = true; break }
        const rejectedHead = nt.diags.find((nd) => nd.rejected !== null && Math.hypot(nd.headX - tail.x, nd.headZ - tail.z) <= adj)
        if (rejectedHead) reason = `neighbour-rejected:${rejectedHead.rejected}:${rejectedHead.terminal}:probe=${rejectedHead.downstream.outcome}`
      }
      if (continued) { bump('seam-ok'); return }
      const ground = sampleHeightAt(tail.x, tail.z, params)
      const onLand = ground > params.waterLevel + 1e-4
      bump(`seam-break:${onLand ? 'land' : 'underwater'}:${reason}`)
      endings.push({
        seed, kind: `seam-break:${onLand ? 'land' : 'underwater'}:${reason}`, x: tail.x, z: tail.z, visibleCells: d.cellCount, maxAcc,
        detail: `ground-water=${(ground - params.waterLevel).toFixed(1)}m tile=${tile.tx},${tile.tz}`,
      })
    })
  }

  const home = defs.find((d) => d.isHome)
  const homeEndings = home ? endings.filter((e) => dist(e, home) < 600) : []
  return { seed, computeMs, tiles: (2 * tilesHalf) ** 2, renderedChains, totalVisibleKm, underwaterKm, lostDrySinkLong, lostDrySinkContinuationLong, counts, endings, sourcesNearSettlement, home: home ? { id: home.id, x: home.x, z: home.z, R: R(home) } : null, homeEndings, settlements: defs.length }
}

const results = seeds.map(measure)
if (asJson) {
  console.log(JSON.stringify(results, null, 2))
} else {
  for (const r of results) {
    console.log(`\n=== seed ${r.seed}: ${r.tiles} tiles (${(r.tiles * RIVER_TILE_SIZE * RIVER_TILE_SIZE / 1e6).toFixed(1)} km²), compute ${(r.computeMs / 1000).toFixed(1)} s, settlements ${r.settlements}`)
    console.log(`rendered chains ${r.renderedChains}, visible ${r.totalVisibleKm.toFixed(1)} km (overlapping tributary walks counted twice), of it underwater (seabed) ${r.underwaterKm.toFixed(1)} km`)
    console.log(`dropped at a dry sink with >= 8 cells (would otherwise render): ${r.lostDrySinkLong} (of them continuations, i.e. a river cut mid-course: ${r.lostDrySinkContinuationLong})`)
    for (const [k, v] of Object.entries(r.counts).sort((a, b) => b[1] - a[1])) console.log(`  ${v.toString().padStart(5)}  ${k}`)
    const land = r.endings.filter((e) => e.kind.includes(':land:'))
    const big = land.filter((e) => e.maxAcc >= 50).length
    console.log(`seam breaks on land: ${land.length} (river class maxAcc >= 50: ${big}); underwater (invisible): ${r.endings.length - land.length}`)
    console.log(`sources inside footprint ${r.sourcesNearSettlement.filter((s) => s.kind === 'source-inside-footprint').length}, near (<40 m) ${r.sourcesNearSettlement.filter((s) => s.kind === 'source-near-footprint').length}`)
    if (r.home) {
      console.log(`home ${r.home.id} at ${r.home.x.toFixed(0)},${r.home.z.toFixed(0)} R=${r.home.R}`)
      for (const e of r.homeEndings.filter((e) => e.kind.includes(':land:'))) console.log(`  home-area ${e.kind} @ ${e.x.toFixed(0)},${e.z.toFixed(0)} cells=${e.visibleCells} acc=${e.maxAcc} ${e.detail}`)
      for (const s of r.sourcesNearSettlement.filter((s) => s.detail.startsWith(r.home!.id + ' '))) console.log(`  home ${s.kind} @ ${s.x.toFixed(0)},${s.z.toFixed(0)} cells=${s.visibleCells} acc=${s.maxAcc} ${s.detail}`)
    }
  }
}
