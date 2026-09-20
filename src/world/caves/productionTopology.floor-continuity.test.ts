/** Floor-ramp continuity: topology stations and the gameplay heightfield
 *  floor between passage / widening / chamber / branch must stay within
 *  player walk grade. Mouth surface↔carve↔interior is covered separately
 *  with a hybrid outdoor/cave floor sampler (world-terrain-034). */

import { describe, expect, it } from 'vitest'
import type { LargeCaveSite } from '../largeCaves'
import type { CaveTopologyPoint } from './caveTopology'
import { createBenchmarkWorldConfig } from '../../config/worldConfig'
import { measureSlope } from '../../fauna/createFauna'
import { type RawSampleParams, sampleHeightAt } from '../../terrain/chunkHeightmap'
import { SLOPE_MAX_WALKABLE_DEG } from '../../terrain/slopeConstraint'
import { queryHeightfieldGround } from './caveHeightfieldQuery'
import {
  buildCaveHeightfieldRepresentation,
  type CaveHeightfieldRepresentation,
  ENTRANCE_INWARD,
} from './caveHeightfieldRepresentation'
import { openingDirection } from './caveOrientation'
import {
  CAVE_APPROACH_OFFSET,
  CAVE_APPROACH_RADIUS,
  mouthCarveDepth,
} from './mouthCarve'
import {
  buildProductionCaveTopology,
  MAX_TRAVERSABLE_FLOOR_GRADE,
  maxCenterlineFloorGrade,
} from './productionTopology'

/** Rim blend / floor detail noise can steepen the floor vs topology; still
 *  must stay under walk-max. */
const FLOOR_GRADE_LIMIT = Math.tan((SLOPE_MAX_WALKABLE_DEG * Math.PI) / 180)

function densify(centerline: readonly CaveTopologyPoint[], step: number): CaveTopologyPoint[] {
  const out: CaveTopologyPoint[] = []
  for (let i = 0; i < centerline.length - 1; i++) {
    const a = centerline[i]!
    const b = centerline[i + 1]!
    const dist = Math.hypot(b.x - a.x, b.z - a.z)
    const n = Math.max(1, Math.ceil(dist / step))
    for (let s = 0; s < n; s++) {
      const t = s / n
      out.push({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        z: a.z + (b.z - a.z) * t,
      })
    }
  }
  out.push(centerline[centerline.length - 1]!)
  return out
}

function gameplayFloorProfile(
  field: CaveHeightfieldRepresentation,
  surfaceHeightAt: (x: number, z: number) => number,
  centerline: readonly CaveTopologyPoint[],
): { maxGrade: number, maxStep: number } {
  const samples = densify(centerline, 0.4)
  let y = samples[0]!.y + 0.25
  let prev: { x: number, z: number, floor: number } | null = null
  let maxGrade = 0
  let maxStep = 0
  for (const p of samples) {
    const hit = queryHeightfieldGround(field, surfaceHeightAt, p.x, y, p.z)
    expect(hit, `cave ground at ${p.x.toFixed(2)},${p.z.toFixed(2)}`).not.toBeNull()
    const floor = hit!.floorY
    if (prev) {
      const dist = Math.hypot(p.x - prev.x, p.z - prev.z)
      if (dist > 1e-6) {
        maxGrade = Math.max(maxGrade, Math.abs(floor - prev.floor) / dist)
        maxStep = Math.max(maxStep, Math.abs(floor - prev.floor))
      }
    }
    prev = { x: p.x, z: p.z, floor }
    y = floor + 0.2
  }
  return { maxGrade, maxStep }
}

/**
 * Final gameplay floor along a path that may leave cave columns: prefer
 * `queryHeightfieldGround` (player in-cave), else carved walk surface
 * (outdoor feet on the mouth trench).
 */
function hybridGameplayFloorProfile(
  field: CaveHeightfieldRepresentation,
  walkSurfaceAt: (x: number, z: number) => number,
  points: readonly { x: number, z: number }[],
  startY: number,
): { maxGrade: number, maxStep: number } {
  let y = startY
  let prev: { x: number, z: number, floor: number } | null = null
  let maxGrade = 0
  let maxStep = 0
  for (const p of points) {
    const hit = queryHeightfieldGround(field, walkSurfaceAt, p.x, y, p.z)
    const floor = hit?.floorY ?? walkSurfaceAt(p.x, p.z)
    if (prev) {
      const dist = Math.hypot(p.x - prev.x, p.z - prev.z)
      if (dist > 1e-6) {
        maxGrade = Math.max(maxGrade, Math.abs(floor - prev.floor) / dist)
        maxStep = Math.max(maxStep, Math.abs(floor - prev.floor))
      }
    }
    prev = { x: p.x, z: p.z, floor }
    y = floor + 0.2
  }
  return { maxGrade, maxStep }
}

function reversed(centerline: readonly CaveTopologyPoint[]): CaveTopologyPoint[] {
  return centerline.slice().reverse()
}

/** Entrance → chamber along `from` links, including the mouth portal lip. */
function mainRouteFromMouth(topology: {
  segments: readonly { from: string, to: string, centerline: readonly CaveTopologyPoint[] }[]
}): CaveTopologyPoint[] {
  const byFrom = new Map(topology.segments.map((s) => [s.from, s]))
  const pts: CaveTopologyPoint[] = []
  let id = 'entrance'
  const seen = new Set<string>()
  while (byFrom.has(id) && !seen.has(id)) {
    seen.add(id)
    const seg = byFrom.get(id)!
    if (pts.length === 0) {
      pts.push(...seg.centerline)
    } else {
      pts.push(...seg.centerline.slice(1))
    }
    if (seg.to === 'chamber') break
    id = seg.to
  }
  return pts
}

/**
 * Densified XZ path along the mouth opening axis from approach hillside
 * through the portal into the first interior metres.
 */
function mouthTransitionPath(
  entrance: { x: number, z: number, yaw: number },
): { x: number, z: number }[] {
  const out = openingDirection(entrance.yaw)
  const alongStart = CAVE_APPROACH_OFFSET + CAVE_APPROACH_RADIUS * 0.35
  const alongEnd = -ENTRANCE_INWARD
  const step = 0.35
  const points: { x: number, z: number }[] = []
  for (let along = alongStart; along >= alongEnd - 1e-9; along -= step) {
    points.push({
      x: entrance.x + out.dx * along,
      z: entrance.z + out.dz * along,
    })
  }
  return points
}

function expectInteriorSegmentsWalkable(
  topology: { segments: readonly { id: string, from: string, centerline: readonly CaveTopologyPoint[] }[] },
  field: CaveHeightfieldRepresentation,
  surfaceHeightAt: (x: number, z: number) => number,
  label: string,
): void {
  for (const seg of topology.segments) {
    expect(maxCenterlineFloorGrade(seg.centerline), `${label} ${seg.id} topology`).toBeLessThanOrEqual(
      MAX_TRAVERSABLE_FLOOR_GRADE + 1e-6,
    )
    // Entrance segment samples the portal lip where outdoor carve and cave
    // columns meet — covered by `expectMouthTransitionWalkable` instead.
    if (seg.from === 'entrance') continue
    const { maxGrade, maxStep } = gameplayFloorProfile(field, surfaceHeightAt, seg.centerline)
    expect(maxGrade, `${label} ${seg.id} gameplay grade ${maxGrade.toFixed(3)}`).toBeLessThanOrEqual(FLOOR_GRADE_LIMIT)
    expect(maxStep, `${label} ${seg.id} step`).toBeLessThan(1.0)
    const back = gameplayFloorProfile(field, surfaceHeightAt, reversed(seg.centerline))
    expect(back.maxGrade, `${label} ${seg.id} reverse grade ${back.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(FLOOR_GRADE_LIMIT)
    expect(back.maxStep, `${label} ${seg.id} reverse step`).toBeLessThan(1.0)
  }
}

function expectMouthTransitionWalkable(
  topology: {
    entrance: { x: number, y: number, z: number, yaw: number }
    segments: readonly { from: string, to: string, centerline: readonly CaveTopologyPoint[] }[]
  },
  field: CaveHeightfieldRepresentation,
  walkSurfaceAt: (x: number, z: number) => number,
  label: string,
): void {
  const points = mouthTransitionPath(topology.entrance)
  expect(points.length).toBeGreaterThan(4)

  const outwardStartY = walkSurfaceAt(points[0]!.x, points[0]!.z) + 0.25
  const inbound = hybridGameplayFloorProfile(field, walkSurfaceAt, points, outwardStartY)
  expect(inbound.maxGrade, `${label} surface→mouth→interior grade ${inbound.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(
    FLOOR_GRADE_LIMIT,
  )
  expect(inbound.maxStep, `${label} surface→mouth→interior step`).toBeLessThan(1.0)

  const inward = points[points.length - 1]!
  const inwardHit = queryHeightfieldGround(field, walkSurfaceAt, inward.x, topology.entrance.y + 0.5, inward.z)
  const reverseStartY = (inwardHit?.floorY ?? walkSurfaceAt(inward.x, inward.z)) + 0.25
  const outbound = hybridGameplayFloorProfile(field, walkSurfaceAt, points.slice().reverse(), reverseStartY)
  expect(outbound.maxGrade, `${label} interior→mouth→surface grade ${outbound.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(
    FLOOR_GRADE_LIMIT,
  )
  expect(outbound.maxStep, `${label} interior→mouth→surface step`).toBeLessThan(1.0)

  // Full main-route including entrance segment, both directions, hybrid floor
  // so portal lip samples that leave cave columns still use carved terrain.
  const route = mainRouteFromMouth(topology)
  expect(route.length).toBeGreaterThan(4)
  const routeIn = hybridGameplayFloorProfile(
    field,
    walkSurfaceAt,
    densify(route, 0.4).map((p) => ({ x: p.x, z: p.z })),
    walkSurfaceAt(route[0]!.x, route[0]!.z) + 0.25,
  )
  expect(routeIn.maxGrade, `${label} mouth→chamber hybrid grade ${routeIn.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(
    FLOOR_GRADE_LIMIT,
  )
  expect(routeIn.maxStep, `${label} mouth→chamber hybrid step`).toBeLessThan(1.0)
  const routeBackPts = densify(reversed(route), 0.4).map((p) => ({ x: p.x, z: p.z }))
  const chamberEnd = route[route.length - 1]!
  const chamberHit = queryHeightfieldGround(field, walkSurfaceAt, chamberEnd.x, chamberEnd.y + 0.5, chamberEnd.z)
  const routeOut = hybridGameplayFloorProfile(
    field,
    walkSurfaceAt,
    routeBackPts,
    (chamberHit?.floorY ?? chamberEnd.y) + 0.25,
  )
  expect(routeOut.maxGrade, `${label} chamber→mouth hybrid grade ${routeOut.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(
    FLOOR_GRADE_LIMIT,
  )
  expect(routeOut.maxStep, `${label} chamber→mouth hybrid step`).toBeLessThan(1.0)
}

describe('traversable floor continuity (production topology)', () => {
  it('caps consecutive centerline grade at MAX_TRAVERSABLE_FLOOR_GRADE', () => {
    expect(MAX_TRAVERSABLE_FLOOR_GRADE).toBeLessThan(Math.tan((SLOPE_MAX_WALKABLE_DEG * Math.PI) / 180))
    const site: LargeCaveSite = { x: 200, z: -140, yaw: 0.6, length: 12, variant: 0.4 }
    const intoDx = -Math.sin(site.yaw)
    const intoDz = -Math.cos(site.yaw)
    const hill = (x: number, z: number) => 130 + 0.5 * ((x - site.x) * intoDx + (z - site.z) * intoDz)
    for (const seed of [42, 99, 7, 1]) {
      const topology = buildProductionCaveTopology({
        seed,
        site,
        sampleHeight: hill,
        sampleBaseHeight: hill,
      })
      expect(topology, `seed ${seed}`).not.toBeNull()
      for (const seg of topology!.segments) {
        expect(maxCenterlineFloorGrade(seg.centerline), `${seg.id} seed ${seed}`).toBeLessThanOrEqual(
          MAX_TRAVERSABLE_FLOOR_GRADE + 1e-6,
        )
      }
    }
  })
})

describe('seed 1136726869 chamber ramp is walkable both ways', () => {
  const SEED = 1136726869
  const ENTRANCE = { x: 135.84259216988767, z: -17.813611096688362 }

  function build() {
    const config = createBenchmarkWorldConfig({ seed: SEED, terrainResolution: 193, loadRadius: 4 })
    const t = config.terrain
    const params: RawSampleParams = {
      seed: config.seed,
      heightScale: t.heightScale,
      waterLevel: t.waterLevel,
      noiseScale: t.noiseScale,
      detailAmplitude: t.detailAmplitude,
      hillsScale: t.hillsScale,
      hillsAmplitude: t.hillsAmplitude,
      hillsFbm: t.hillsFbm,
      fbm: t.fbm,
      biome: t.biome,
      region: t.region,
    }
    const sampleHeight = (x: number, z: number) => sampleHeightAt(x, z, params)
    const site: LargeCaveSite = {
      x: ENTRANCE.x,
      z: ENTRANCE.z,
      yaw: measureSlope(ENTRANCE.x, ENTRANCE.z, 4, sampleHeight).yaw,
      length: 12,
      variant: 0,
    }
    const topology = buildProductionCaveTopology({
      seed: SEED,
      site,
      sampleHeight,
      sampleBaseHeight: sampleHeight,
    })
    if (!topology) throw new Error('topology rejected')
    const walkSurfaceAt = (x: number, z: number): number => sampleHeight(x, z) - mouthCarveDepth(x, z, topology.entrance)
    const field = buildCaveHeightfieldRepresentation(topology, walkSurfaceAt).heightfield
    return { topology, field, walkSurfaceAt }
  }

  it('spreads widening→chamber floor drop instead of a single cliff (heightfield floor)', () => {
    const { topology, field, walkSurfaceAt } = build()
    const chamber = topology.nodes.find((n) => n.id === 'chamber')!
    const bend = topology.nodes.find((n) => n.id === 'widening-bend')!
    expect(bend.position.y - chamber.position.y).toBeGreaterThan(2)
    const seg = topology.segments.find((s) => s.id === 'seg-chamber')!
    expect(seg.centerline.length).toBeGreaterThan(2)
    expect(maxCenterlineFloorGrade(seg.centerline)).toBeLessThanOrEqual(MAX_TRAVERSABLE_FLOOR_GRADE + 1e-6)

    const { maxGrade, maxStep } = gameplayFloorProfile(field, walkSurfaceAt, seg.centerline)
    expect(maxGrade, `gameplay floor grade ${maxGrade.toFixed(3)}`).toBeLessThanOrEqual(FLOOR_GRADE_LIMIT)
    expect(maxStep).toBeLessThan(1.0)
  })

  it('keeps every main-route and branch segment under walk-max gameplay grade (heightfield floor)', () => {
    const { topology, field, walkSurfaceAt } = build()
    expectInteriorSegmentsWalkable(topology, field, walkSurfaceAt, 'seed 1136726869')
  })

  it('walks surface → mouth → interior and back on the hybrid gameplay floor', () => {
    const { topology, field, walkSurfaceAt } = build()
    const chamber = topology.segments.find((s) => s.id === 'seg-chamber')!
    const backChamber = gameplayFloorProfile(field, walkSurfaceAt, reversed(chamber.centerline))
    expect(backChamber.maxGrade, `reverse chamber grade ${backChamber.maxGrade.toFixed(3)}`).toBeLessThanOrEqual(FLOOR_GRADE_LIMIT)
    expect(backChamber.maxStep).toBeLessThan(1.0)

    expectMouthTransitionWalkable(topology, field, walkSurfaceAt, 'seed 1136726869')
  })
})

describe('heightfield floor grade on representative production seeds', () => {
  const site: LargeCaveSite = { x: 200, z: -140, yaw: 0.6, length: 12, variant: 0.4 }
  const intoDx = -Math.sin(site.yaw)
  const intoDz = -Math.cos(site.yaw)
  const hill = (x: number, z: number) => 130 + 0.5 * ((x - site.x) * intoDx + (z - site.z) * intoDz)

  it('keeps interior segments and mouth transition walkable both ways', () => {
    for (const seed of [42, 99, 7, 1]) {
      const topology = buildProductionCaveTopology({
        seed,
        site,
        sampleHeight: hill,
        sampleBaseHeight: hill,
      })
      expect(topology, `seed ${seed}`).not.toBeNull()
      const walkSurfaceAt = (x: number, z: number): number =>
        hill(x, z) - mouthCarveDepth(x, z, topology!.entrance)
      const field = buildCaveHeightfieldRepresentation(topology!, walkSurfaceAt).heightfield
      expectInteriorSegmentsWalkable(topology!, field, walkSurfaceAt, `seed ${seed}`)
      expectMouthTransitionWalkable(topology!, field, walkSurfaceAt, `seed ${seed}`)
    }
  })
})
