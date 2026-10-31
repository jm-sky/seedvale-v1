import { houseDefinitionById } from '../../src/assets/houseDefinitionExample'
// Usage: pnpm worldgen:dressing:census [--seeds=42,415424794] [--rings=5]
// Queue Q48: diagnostic census of the profession-signature home dressing (pure `professionDressingFor`, no
// runtime, no Three.js) on generated settlement plans. Diagnostic only — prints a markdown table.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { professionDressingFor } from '../../src/settlement/professionDressing'
import { representativeProfession } from '../../src/settlement/professionFamilySurnames'
import { cellSeed } from '../../src/settlement/settlementGenerator'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'

/** `HOME_RADIUS` in `src/app/worldBundle.ts` (not imported: that module pulls in the whole runtime). */
const HOME_RADIUS = 56

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

type Tally = { settlements: number, houses: number, dressed: number, undressed: number, walls: number, slots: number, multi: number, noWallFit: number, perSettlementMax: number, byRole: Record<string, number> }

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
    const t = (out[def.size] ??= { settlements: 0, houses: 0, dressed: 0, undressed: 0, walls: 0, slots: 0, multi: 0, noWallFit: 0, perSettlementMax: 0, byRole: {} })
    t.settlements++
    const settlementSeed = cellSeed(seed, { gx: def.gx, gz: def.gz })
    const housePlots = def.plan.plots.filter((p) => p.role === 'house').sort((a, b) => (a.familyIndex ?? 0) - (b.familyIndex ?? 0))
    let pieces = 0
    for (const [i, plot] of housePlots.entries()) {
      t.houses++
      const fi = plot.familyIndex ?? i
      const family = def.families[fi]
      const houseDef = plot.houseDefinitionId ? houseDefinitionById(plot.houseDefinitionId) : undefined
      if (!family || !houseDef) { t.undressed++; continue }
      const placements = professionDressingFor(family, fi, houseDef, plot.yard, settlementSeed)
      const role = representativeProfession(family)
      if (placements.length === 0) { t.undressed++; continue }
      t.dressed++
      if (role) t.byRole[role] = (t.byRole[role] ?? 0) + 1
      const walls = placements.filter((p) => p.kind === 'wall').length
      t.walls += walls
      t.slots += placements.length - walls
      pieces += placements.length
      if (new Set(placements.map((p) => p.role)).size > 1) t.multi++
    }
    t.perSettlementMax = Math.max(t.perSettlementMax, pieces)
  }
  return out
}

console.log(`Window: rings <= ${rings}. Pure professionDressingFor on planned plots (settlement seed = cellSeed).`)
console.log('')
console.log('| seed | size | settl. | houses | dressed | undressed | wall pieces | slot pieces | multi-profession | max pieces / settl. | dressed by primary role |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const res = census(seed)
  for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
    const t = res[size]
    if (!t) continue
    const roles = Object.entries(t.byRole).sort().map(([r, n]) => `${r} ${n}`).join(', ')
    console.log(`| ${seed} | ${size} | ${t.settlements} | ${t.houses} | ${t.dressed} | ${t.undressed} | ${t.walls} | ${t.slots} | ${t.multi} | ${t.perSettlementMax} | ${roles} |`)
  }
}
