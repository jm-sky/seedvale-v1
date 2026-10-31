// Usage: pnpm worldgen:yards:census [--seeds=42,415424794] [--rings=5]
// Queue Q34 / Q29 plan §3: diagnostic census of house + household-yard overlaps on generated settlement
// plans (no runtime, no Three.js). Real house footprints come from `pickHouseDefinition` (same call as
// `props.ts`) and `houseFootprintRadius`; yard reach mirrors `props.ts`'s `houseYardPlacements` (storage is
// the outermost slot, on the settlement-core → house axis). Discs are a conservative approximation of the
// rectangular house footprint. Diagnostic only — prints a markdown table; not part of `pnpm test`.
import { pickHouseDefinition } from '../../src/assets/houseDefinitionExample'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { houseFootprintRadius } from '../../src/settlement/houseBuilder'
import { HOUSEHOLD_YARD_PROP_OFFSETS } from '../../src/settlement/householdYard'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { HOUSE_PLOT_RADIUS } from '../../src/settlement/villagePlanner'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

/** `HOME_RADIUS` in `src/app/worldBundle.ts` (not imported: that module pulls in the whole runtime). */
const HOME_RADIUS = 56
/** Half-extent of the household storage crate beyond its slot point (crate ≈ 1 m). */
const YARD_PROP_HALF = 0.5

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '5'))

function terrainSnapshot(seed: number): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS,
  }
}

type Tally = {
  settlements: number
  houses: number
  footprintOverPlot: number
  houseWallOverlap: number
  housePlotOverlap: number
  yardIntoHouse: number
  yardIntoPlot: number
  yardOutsideBoundary: number
  yawJittered: number
  settlementsWithAny: number
}

function census(seed: number): Record<string, Tally> {
  clearSettlementDefCache()
  const snap = terrainSnapshot(seed)
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const out: Record<string, Tally> = {}
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def: SettlementDef | null = settlementDefFor(cell, ctx)
    if (!def) continue
    const t = (out[def.size] ??= {
      settlements: 0, houses: 0, footprintOverPlot: 0, houseWallOverlap: 0, housePlotOverlap: 0,
      yardIntoHouse: 0, yardIntoPlot: 0, yardOutsideBoundary: 0, yawJittered: 0, settlementsWithAny: 0,
    })
    t.settlements++
    const cfg = villageSizeConfig(def.size)
    const plots = def.plan.plots
    const houses = plots.filter((p) => p.role === 'house').sort((a, b) => a.familyIndex! - b.familyIndex!)
    const others = plots.filter((p) => p.role !== 'house')
    const r = houses.map((_, i) => houseFootprintRadius(pickHouseDefinition(def.size, i, seed)))
    const cx = def.x
    const cz = def.z
    let any = false
    houses.forEach((h, i) => {
      t.houses++
      const ri = r[i]!
      if (ri > HOUSE_PLOT_RADIUS) t.footprintOverPlot++
      const angle = Math.atan2(h.z - cz, h.x - cx)
      if (Math.hypot(h.x - cx, h.z - cz) > cfg.houseRingMax * 0.85 * 0.75) t.yawJittered++
      const yardDist = ri + HOUSEHOLD_YARD_PROP_OFFSETS.storage
      const yx = h.x + Math.cos(angle) * yardDist
      const yz = h.z + Math.sin(angle) * yardDist
      let wall = false
      let plotHit = false
      let yardHouse = false
      let yardPlot = false
      houses.forEach((o, j) => {
        if (j === i) return
        const d = Math.hypot(h.x - o.x, h.z - o.z)
        if (j > i && d < ri + r[j]!) wall = true
        if (j > i && d < h.radius + o.radius) plotHit = true
        if (Math.hypot(yx - o.x, yz - o.z) < r[j]! + YARD_PROP_HALF) yardHouse = true
      })
      for (const o of others) {
        if (Math.hypot(h.x - o.x, h.z - o.z) < ri + o.radius) plotHit = true
        if (Math.hypot(yx - o.x, yz - o.z) < o.radius + YARD_PROP_HALF) yardPlot = true
      }
      if (Math.hypot(yx - cx, yz - cz) > cfg.footprintRadius) t.yardOutsideBoundary++
      if (wall) t.houseWallOverlap++
      if (plotHit) t.housePlotOverlap++
      if (yardHouse) t.yardIntoHouse++
      if (yardPlot) t.yardIntoPlot++
      if (wall || plotHit || yardHouse || yardPlot) any = true
    })
    if (any) t.settlementsWithAny++
  }
  return out
}

console.log(`Window: rings <= ${rings}. Discs: real footprint radius (pickHouseDefinition) vs plot radius ${HOUSE_PLOT_RADIUS}.`)
console.log('')
console.log('| seed | size | settl. | houses | footprint > plot r | house walls overlap | house footprint ∩ other plot | yard crate ∩ other house | yard crate ∩ other plot | yard crate outside footprintRadius | yaw jittered | settl. with any |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const res = census(seed)
  for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL']) {
    const t = res[size]
    if (!t) continue
    console.log(`| ${seed} | ${size} | ${t.settlements} | ${t.houses} | ${t.footprintOverPlot} | ${t.houseWallOverlap} | ${t.housePlotOverlap} | ${t.yardIntoHouse} | ${t.yardIntoPlot} | ${t.yardOutsideBoundary} | ${t.yawJittered} | ${t.settlementsWithAny} |`)
  }
}
