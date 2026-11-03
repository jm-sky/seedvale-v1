import { writeFileSync } from 'node:fs'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { cemeteryPlotDistanceToPoint, cemeteryPlotDistanceToSegment } from '../../src/settlement/cemeteryLayout'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import {
  clearCemeteryCaches,
  makeSettlementRefPeek,
  resolveCemeteryTopologyForSettlement,
  settlementRefFromDef,
} from '../../src/terrain/cemeteryAssignment'
import {
  clearCemeteryPlacementCaches,
  resolveAbandonedCemeteryForChunk,
  type ResolvedCemeteryPlacement,
  resolvePlacementForTopology,
} from '../../src/terrain/cemeteryPlacement'
import { worldToChunk } from '../../src/terrain/chunkGrid'
import { createWorldTerrainSampler } from '../../src/terrain/chunkHeightmap'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import {
  chunkParamsForWorldKnowledgeScan,
  worldKnowledgeRoadContext,
  type WorldKnowledgeTerrainSnapshot,
} from '../../src/terrain/worldKnowledgeScan'
// Usage: pnpm worldgen:cemeteries:census [--seeds=42,415424794] [--rings=5] [--abandonedChunks=30] [--json=path]
// Queue Q47 (Q39 plan §3 step 7): diagnostic census of cemetery placement on generated worlds (no runtime, no
// Three.js scene). For every settlement in the window it resolves the assignment topology + placement exactly
// as chunk generation does (`resolvePlacementForTopology`), then reports placed / split / none per size,
// plot–clearing and plot–road overlaps, and the mean centre distance to the served settlement. Abandoned
// (wilderness) cemeteries are scanned over a chunk window. `--json` writes per-assignment statuses so a
// before/after run can be diffed (every assignment placed before must still resolve). Diagnostic only.
import { censusHydrologyId } from './censusHydrology'

/** `HOME_RADIUS` in `src/app/worldBundle.ts` (not imported: that module pulls in the whole runtime). */
const HOME_RADIUS = 56

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '5'))
const abandonedChunks = Number(arg('abandonedChunks', '30'))
const jsonPath = arg('json', '')

function terrainSnapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS, hydrologyId: censusHydrologyId(seed),
  }
}

type Row = { assignments: number, placed: number, split: number, none: number, clearingOverlap: number, roadOverlap: number, dist: number[] }
const blank = (): Row => ({ assignments: 0, placed: 0, split: 0, none: 0, clearingOverlap: 0, roadOverlap: 0, dist: [] })


function census(seed: number, statuses: Record<string, string>): { rows: Record<string, Row>, abandoned: number } {
  clearSettlementDefCache()
  clearCemeteryCaches()
  clearCemeteryPlacementCaches()
  const snap = terrainSnapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  const refs = defs.map(settlementRefFromDef)
  const peek = makeSettlementRefPeek(refs)
  const rows: Record<string, Row> = {}
  const seen = new Set<string>()
  for (const def of defs) {
    const ref = settlementRefFromDef(def)
    const topology = resolveCemeteryTopologyForSettlement(ref.id, peek)
    if (!topology || seen.has(topology.assignmentId)) continue
    seen.add(topology.assignmentId)
    const coord = worldToChunk(ref.x, ref.z, snap.chunkSize)
    const params = chunkParamsForWorldKnowledgeScan(coord, snap, ctx)
    const terrainFn = createWorldTerrainSampler(params)
    const record = (key: string, placement: ResolvedCemeteryPlacement | null, topo = topology) => {
      const row = (rows[key] ??= blank())
      row.assignments++
      if (!placement) { row.none++; statuses[topo.assignmentId] = 'none'; return }
      row.placed++
      statuses[topo.assignmentId] = 'placed'
      const plot = { x: placement.x, z: placement.z, rotationY: placement.rotationY, size: placement.size, scale: placement.scale }
      for (const c of params.cemeteryClearings ?? params.clearings) {
        if (cemeteryPlotDistanceToPoint(plot, c.x, c.z) < c.radius) row.clearingOverlap++
      }
      for (const s of params.cemeteryRoadSegments ?? params.roadSegments) {
        if (cemeteryPlotDistanceToSegment(plot, s.ax, s.az, s.bx, s.bz) < s.halfWidth) row.roadOverlap++
      }
      const d = Math.min(...topo.settlements.map((s) => Math.hypot(placement.x - s.x, placement.z - s.z)))
      row.dist.push(d)
    }
    const placed = resolvePlacementForTopology(topology, params, terrainFn)
    if (placed) { record(`${placed.size} (${placed.size})`, placed); continue }
    record(`dedicated:${ref.size}`, null)
  }
  let abandoned = 0
  for (let cx = -abandonedChunks; cx <= abandonedChunks; cx++) {
    for (let cz = -abandonedChunks; cz <= abandonedChunks; cz++) {
      const params = chunkParamsForWorldKnowledgeScan({ cx, cz }, snap, ctx)
      const terrainFn = createWorldTerrainSampler(params)
      if (resolveAbandonedCemeteryForChunk({ cx, cz }, params, terrainFn)) abandoned++
    }
  }
  return { rows, abandoned }
}

const mean = (xs: number[]): number => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length)
const all: Record<string, Record<string, string>> = {}
console.log(`Window: settlement rings <= ${rings}, abandoned scan ±${abandonedChunks} chunks.`)
console.log('')
console.log('| seed | group | assignments | placed | split | none | plot∩clearing | plot∩road | mean centre→settlement (m) |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const statuses: Record<string, string> = {}
  const { rows, abandoned } = census(seed, statuses)
  all[seed] = statuses
  for (const key of Object.keys(rows).sort()) {
    const r = rows[key]!
    console.log(`| ${seed} | ${key} | ${r.assignments} | ${r.placed} | ${r.split} | ${r.none} | ${r.clearingOverlap} | ${r.roadOverlap} | ${mean(r.dist).toFixed(1)} |`)
  }
  console.log(`| ${seed} | abandoned (±${abandonedChunks} chunks) | ${abandoned} | | | | | | |`)
}
if (jsonPath) writeFileSync(jsonPath, JSON.stringify(all, null, 1))
