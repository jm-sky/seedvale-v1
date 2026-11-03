// Usage: pnpm worldgen:access:census [--seeds=42,415424794] [--rings=8] [--hydrology=raw]
// Queue Q37 (a): can an NPC/player body walk from the plaza to every household yard gate, into every yard
// (storage slot) and to every storehouse loading-bay slot of generated settlement plans? Builds the static
// collider set the runtime registers in `createSettlement.registerSettlementColliders` from pure plan data:
// house + storehouse shells (`buildHouseCollidersWorld`, doors closed), wells / wood stockpile / campfire,
// pasture, paddock and household-yard fences. Left out (need GLB packs or road corridors): entrance palisade
// wings at the settlement rim, profession dressing (inside the yard profession rectangle). Routes use the
// shared bounded A* (`findPath`) on a fine grid with body clearance (`PLAYER_COLLISION_RADIUS` from every
// collider) — stricter than the NPC's point walkability. Terrain/water/slope are ignored (pads are flattened;
// wet pads are census-rivers' job). Diagnostic only — prints a markdown table; not part of `pnpm test`.
import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
import type { Collider } from '../../src/world/collision'
import { houseDefinitionById, STOREHOUSE_DEFINITION } from '../../src/assets/houseDefinitionExample'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { findPath, type PathPoint } from '../../src/navigation/navigation'
import { PLAYER_COLLISION_RADIUS } from '../../src/player/playerDimensions'
import { buildHouseCollidersWorld } from '../../src/settlement/houseBuilder'
import { householdYardFenceSegments } from '../../src/settlement/householdYard'
import { VILLAGE_CAMPFIRE_COLLISION_RADIUS, VILLAGE_MASONRY_FIREPIT_COLLISION_RADIUS, WOOD_PILE_COLLISION_RADIUS } from '../../src/settlement/propSpecs'
import { cellsWithinRadius, type SettlementDef } from '../../src/settlement/settlementGenerator'
import { fencePlacementColliders } from '../../src/settlement/settlementPalisade'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from '../../src/settlement/settlementPlanCache'
import { fenceSegmentPlacements } from '../../src/settlement/villagePasture'
import { plannedCampfireBodyKind } from '../../src/settlement/villagePlan'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { colliderSignedDistance } from '../../src/world/collision'

/** `HOME_RADIUS` in `src/app/worldBundle.ts` (not imported: that module pulls in the whole runtime). */
const HOME_RADIUS = 56
/** `WELL_COLLISION_RADIUS` in `createSettlement.ts` (module-private there). */
const WELL_COLLISION_RADIUS = 0.9
const CELL = 0.5
const BODY = PLAYER_COLLISION_RADIUS

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const rings = Number(arg('rings', '8'))
const conditioned = arg('hydrology', 'conditioned') !== 'raw'
const debug = !!process.env.CENSUS_DEBUG

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

/** Static colliders of one planned settlement (see header for what is left out). */
type Tagged = Collider & { tag: string }

function planColliders(def: SettlementDef): Tagged[] {
  const plan = def.plan
  const flat = () => 0
  const out: Tagged[] = []
  const add = (tag: string, cs: readonly Collider[]) => { for (const c of cs) out.push({ ...c, tag }) }
  for (const plot of plan.plots) {
    if (plot.role === 'house' && plot.houseDefinitionId) {
      const hd = houseDefinitionById(plot.houseDefinitionId)
      if (hd) add(plot.id, buildHouseCollidersWorld(hd, plot.x, plot.z, plot.houseYaw ?? 0, hd.openings.map(() => true)))
    }
    if (plot.storehouse) {
      const sd = STOREHOUSE_DEFINITION
      add(`${plot.id} shell`, buildHouseCollidersWorld(sd, plot.x, plot.z, plot.houseYaw ?? 0, sd.openings.map(() => true)))
    }
  }
  for (const lm of plan.landmarks) {
    if (lm.kind === 'well') add(lm.id, [{ type: 'circle', x: lm.x, z: lm.z, radius: WELL_COLLISION_RADIUS }])
    else if (lm.kind === 'stockpile') add(lm.id, [{ type: 'circle', x: lm.x, z: lm.z, radius: WOOD_PILE_COLLISION_RADIUS }])
    else if (lm.kind === 'campfire') {
      const r = plannedCampfireBodyKind(def.size) === 'masonry' ? VILLAGE_MASONRY_FIREPIT_COLLISION_RADIUS : VILLAGE_CAMPFIRE_COLLISION_RADIUS
      add(lm.id, [{ type: 'circle', x: lm.x, z: lm.z, radius: r }])
    }
  }
  if (plan.pasture) add('pasture fence', fencePlacementColliders(fenceSegmentPlacements(plan.pasture.fenceSegments, flat)))
  if (plan.paddock) add('paddock fence', fencePlacementColliders(fenceSegmentPlacements(plan.paddock.fenceSegments, flat)))
  const houses = plan.plots.filter((p) => p.role === 'house')
  for (const [i, p] of houses.entries()) {
    if (p.yard) add(`${p.id} yard fence`, fencePlacementColliders(fenceSegmentPlacements(householdYardFenceSegments(p.yard, p.familyIndex ?? i), flat)))
  }
  return out
}

type Tally = {
  settlements: number
  gates: number
  gateFail: number
  yards: number
  yardFail: number
  bays: number
  bayFail: number
  /** Goal point itself has no body clearance (inside/at a collider). */
  goalBlocked: number
  settlementsWithAny: number
  routeRatio: number[]
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
      settlements: 0, gates: 0, gateFail: 0, yards: 0, yardFail: 0, bays: 0, bayFail: 0, goalBlocked: 0,
      settlementsWithAny: 0, routeRatio: [],
    })
    t.settlements++
    const colliders = planColliders(def)
    const clear = (x: number, z: number): boolean => {
      for (const c of colliders) if (colliderSignedDistance(c, x, z) < BODY) return false
      return true
    }
    const query = { isWalkable: clear, sampleHeight: () => 0 }
    const plaza = def.plan.plaza
    let start: PathPoint | null = null
    for (let k = 0; k < 16 && !start; k++) {
      const a = (k / 16) * Math.PI * 2
      const p = { x: plaza.x + Math.cos(a) * plaza.radius * 0.6, z: plaza.z + Math.sin(a) * plaza.radius * 0.6 }
      if (clear(p.x, p.z)) start = p
    }
    if (!start) throw new Error(`no clear plaza start in ${def.id}`)
    let any = false
    const reach = (goal: PathPoint, label: string): boolean => {
      if (!clear(goal.x, goal.z)) {
        t.goalBlocked++
        if (debug) {
          const hits = colliders.filter((c) => colliderSignedDistance(c, goal.x, goal.z) < BODY)
            .map((c) => `${c.tag} (${colliderSignedDistance(c, goal.x, goal.z).toFixed(2)} m)`)
          console.log(`goal blocked seed ${seed} ${def.size} ${def.id} ${label}: ${hits.join(', ')}`)
        }
      }
      const res = findPath(query, { maxSlopeDeg: 90 }, start!, goal, { cellSize: CELL, boundsPadding: 24, maxNodes: 200_000 })
      const end = res?.waypoints.at(-1)
      const ok = !!end && Math.hypot(end.x - goal.x, end.z - goal.z) <= CELL * 1.5
      if (ok) {
        let len = 0
        let prev = start!
        for (const w of res!.waypoints) { len += Math.hypot(w.x - prev.x, w.z - prev.z); prev = w }
        const direct = Math.hypot(goal.x - start!.x, goal.z - start!.z)
        if (direct > 5) t.routeRatio.push(len / direct)
      } else if (debug) {
        console.log(`unreachable seed ${seed} ${def.size} ${def.id} ${label} (${goal.x.toFixed(1)}, ${goal.z.toFixed(1)})${res ? ` ended ${Math.hypot(end!.x - goal.x, end!.z - goal.z).toFixed(1)} m short` : ' no route'}`)
      }
      if (!ok) any = true
      return ok
    }
    for (const plot of def.plan.plots) {
      if (plot.role === 'house' && plot.yard) {
        t.gates++
        if (!reach(plot.yard.slots.gate, `${plot.id} gate`)) t.gateFail++
        t.yards++
        if (!reach(plot.yard.slots.storage, `${plot.id} storage`)) t.yardFail++
      }
      for (const [i, bay] of (plot.storehouse?.baySlots ?? []).entries()) {
        t.bays++
        if (!reach(bay, `${plot.id} bay ${i}`)) t.bayFail++
      }
    }
    if (any) t.settlementsWithAny++
  }
  return out
}

const p90 = (xs: number[]): number => {
  if (xs.length === 0) return 0
  const sorted = [...xs].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))]!
}

console.log(`Window: rings <= ${rings}. Hydrology: ${conditioned ? 'conditioned (production, 058)' : 'raw (pre-058)'}. Body clearance ${BODY} m, grid ${CELL} m, doors closed.`)
console.log('')
console.log('| seed | size | settl. | yard gates unreachable | yard storage slot unreachable | bay slots unreachable | goal without body clearance | settl. with any | route / straight p90 / max |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const seed of seeds) {
  const res = census(seed)
  for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as const) {
    const t = res[size]
    if (!t) continue
    console.log(`| ${seed} | ${size} | ${t.settlements} | ${t.gateFail} / ${t.gates} | ${t.yardFail} / ${t.yards} | ${t.bayFail} / ${t.bays} | ${t.goalBlocked} | ${t.settlementsWithAny} | ${p90(t.routeRatio).toFixed(2)} / ${Math.max(0, ...t.routeRatio).toFixed(2)} |`)
  }
}
