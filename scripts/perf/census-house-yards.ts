// Usage: pnpm worldgen:yards:census [--seeds=42,415424794] [--rings=5]
// Queue Q34/Q41: diagnostic census of household compounds on generated settlement plans (no runtime, no
// Three.js). Reads the planner-owned compound (`plot.discs` = house disc + yard disc, `plot.yard.slots`,
// `plot.finalFallback`) — nothing is re-derived here. Discs approximate the rectangular footprints
// conservatively. Diagnostic only — prints a markdown table; not part of `pnpm test`.
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { yawFacing } from '../../src/settlement/householdYard'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
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
/** Q37: production terrain uses the conditioned global hydrology (058, lakes); `--hydrology=raw` reproduces the
 *  pre-058 census (unconditioned floor, no lakes). */
const conditioned = arg('hydrology', 'conditioned') !== 'raw'

/** Compute + install the seed's global hydrology the way the runtime does; returns its id. */
function productionHydrologyId(seed: number): string {
  if (!conditioned) return UNCONDITIONED_HYDROLOGY_ID
  const t = defaultTerrainConfig(65)
  const params: RawSampleParams = {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
  }
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(params, grid, 0, grid.size)
  const h = computeWorldHydrology({ ...grid, floor }, { waterLevel: params.waterLevel, seed })
  const id = hydrologyIdFor(params)
  installWorldHydrology(id, h)
  return id
}

function terrainSnapshot(seed: number, hydrologyId: string): WorldKnowledgeTerrainSnapshot {
  const t = defaultTerrainConfig(65)
  return {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS, hydrologyId,
  }
}

type Tally = {
  settlements: number
  houses: number
  compoundOverlap: number
  finalFallback: number
  outsideFootprint: number
  slotIntoOtherHouse: number
  slotIntoOtherPlot: number
  yawJittered: number
  settlementsWithAny: number
  extents: number[]
  /** Q43/Q37 storehouse checks. */
  storehouses: number
  storehouseMissingOrExtra: number
  storehouseFallback: number
  storehouseOverlap: number
  baySlotInPlot: number
}

function census(seed: number): Record<string, Tally> {
  clearSettlementDefCache()
  const snap = terrainSnapshot(seed, productionHydrologyId(seed))
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const out: Record<string, Tally> = {}
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, rings)) {
    const def: SettlementDef | null = settlementDefFor(cell, ctx)
    if (!def) continue
    const t = (out[def.size] ??= {
      settlements: 0, houses: 0, compoundOverlap: 0, finalFallback: 0, outsideFootprint: 0,
      slotIntoOtherHouse: 0, slotIntoOtherPlot: 0, yawJittered: 0, settlementsWithAny: 0, extents: [],
      storehouses: 0, storehouseMissingOrExtra: 0, storehouseFallback: 0, storehouseOverlap: 0, baySlotInPlot: 0,
    })
    t.settlements++
    const cfg = villageSizeConfig(def.size)
    const plots = def.plan.plots
    const houses = plots.filter((p) => p.role === 'house')
    const discsOf = (p: (typeof plots)[number]) => p.discs ?? [{ x: p.x, z: p.z, radius: p.radius }]
    const cx = def.plan.center.x
    const cz = def.plan.center.z
    let any = false
    let extent = 0
    for (const h of houses) {
      t.houses++
      let bad = false
      if (h.finalFallback) { t.finalFallback++; bad = true }
      const inward = yawFacing(cx - h.x, cz - h.z)
      if (Math.abs(Math.atan2(Math.sin(h.houseYaw! - inward), Math.cos(h.houseYaw! - inward))) > 1e-6) t.yawJittered++
      let overlap = false
      for (const o of plots) {
        if (o === h || o.role === 'sale') continue
        for (const d of discsOf(h)) for (const e of discsOf(o)) {
          if (Math.hypot(d.x - e.x, d.z - e.z) < d.radius + e.radius) {
            overlap = true
            if (process.env.CENSUS_DEBUG) console.log(`overlap seed ${seed} ${def.size} ${def.id} ${h.id}<->${o.id} (${o.role}) gap ${(Math.hypot(d.x - e.x, d.z - e.z) - d.radius - e.radius).toFixed(2)}${o.finalFallback ? ' finalFallback' : ''}`)
          }
        }
      }
      if (overlap) { t.compoundOverlap++; bad = true }
      let reach = 0
      for (const d of discsOf(h)) reach = Math.max(reach, Math.hypot(d.x - cx, d.z - cz) + d.radius)
      extent = Math.max(extent, reach)
      if (reach > cfg.footprintRadius) { t.outsideFootprint++; bad = true }
      const s = h.yard!.slots
      let slotHouse = false
      let slotPlot = false
      for (const slot of [s.barrel, s.trough, s.wood, s.storage]) {
        for (const o of plots) {
          if (o === h || o.role === 'sale') continue
          const hit = discsOf(o).some((e) => o.role === 'house'
            ? Math.hypot(slot.x - e.x, slot.z - e.z) < e.radius + YARD_PROP_HALF && e === o.discs![0]
            : Math.hypot(slot.x - e.x, slot.z - e.z) < e.radius + YARD_PROP_HALF)
          if (hit) { if (o.role === 'house') slotHouse = true; else slotPlot = true }
        }
      }
      if (slotHouse) { t.slotIntoOtherHouse++; bad = true }
      if (slotPlot) { t.slotIntoOtherPlot++; bad = true }
      if (bad) any = true
    }
    t.extents.push(extent)
    if (any) t.settlementsWithAny++
    const stores = plots.filter((p) => p.storehouse)
    t.storehouses += stores.length
    if (stores.length !== 1) t.storehouseMissingOrExtra++
    for (const st of stores) {
      if (st.finalFallback) t.storehouseFallback++
      let overlap = false
      let bayIn = false
      for (const o of plots) {
        if (o === st || o.role === 'sale') continue
        for (const e of discsOf(o)) {
          if (Math.hypot(st.x - e.x, st.z - e.z) < st.radius + e.radius) {
            overlap = true
            if (process.env.CENSUS_DEBUG) console.log(`storehouse overlap seed ${seed} ${def.size} ${def.id} <-> ${o.id} (${o.role}) gap ${(Math.hypot(st.x - e.x, st.z - e.z) - st.radius - e.radius).toFixed(2)}`)
          }
          for (const b of st.storehouse!.baySlots) {
            if (Math.hypot(b.x - e.x, b.z - e.z) < e.radius) {
              bayIn = true
              if (process.env.CENSUS_DEBUG) console.log(`bay slot in plot seed ${seed} ${def.size} ${def.id} -> ${o.id} (${o.role})`)
            }
          }
        }
      }
      if (overlap) t.storehouseOverlap++
      if (bayIn) t.baySlotInPlot++
    }
  }
  return out
}

const p90 = (xs: number[]): number => {
  if (xs.length === 0) return 0
  const sorted = [...xs].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))]!
}

console.log(`Window: rings <= ${rings}. Hydrology: ${conditioned ? 'conditioned (production, 058)' : 'raw (pre-058)'}. Compound = planner-owned house disc + yard disc (plot.discs).`)
console.log('')
console.log('| seed | size | settl. | houses | compound overlaps | final-fallback houses | compound outside footprintRadius | slot ∩ other house | slot ∩ other plot | yaw jittered (outskirts) | settl. with any | house extent p90 / max (m) | footprintRadius (m) |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const res = census(seed)
  for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
    const t = res[size]
    if (!t) continue
    console.log(`| ${seed} | ${size} | ${t.settlements} | ${t.houses} | ${t.compoundOverlap} | ${t.finalFallback} | ${t.outsideFootprint} | ${t.slotIntoOtherHouse} | ${t.slotIntoOtherPlot} | ${t.yawJittered} | ${t.settlementsWithAny} | ${p90(t.extents).toFixed(1)} / ${Math.max(...t.extents).toFixed(1)} | ${villageSizeConfig(size).footprintRadius} |`)
  }
}

console.log('')
console.log('| seed | size | settl. | storehouses | settl. without exactly 1 | final fallback | storehouse disc ∩ other plot | bay slot inside other plot |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const res = census(seed)
  for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
    const t = res[size]
    if (!t) continue
    console.log(`| ${seed} | ${size} | ${t.settlements} | ${t.storehouses} | ${t.storehouseMissingOrExtra} | ${t.storehouseFallback} | ${t.storehouseOverlap} | ${t.baySlotInPlot} |`)
  }
}
