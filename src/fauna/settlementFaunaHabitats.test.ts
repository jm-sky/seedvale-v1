import { describe, expect, it } from 'vitest'
import type { VillageSize } from '../settlement/families'
import { createSeededRandom } from '../world/parseSeed'
import { isDeerEdgeHabitat } from './createFauna'
import { HERD_CLUSTER_RADIUS, HERD_SPECIES, JUVENILE_SPAWN_CHANCE } from './herdCohesion'
import {
  CAVE_MIN_SLOPE_DROP,
  CAVE_SLOPE_SAMPLE_RADIUS,
  habitatSpawnerRingAttempts,
  HOME_SAFETY_BELT_WIDTH,
  isPredatorDenSpec,
  measureSlope,
  MIN_PREDATOR_DEN_SEPARATION,
  MIN_SPAWN_SEPARATION,
  planSettlementFaunaHabitats,
  PREDATOR_DEN_RING_OFFSET,
  predatorDenRingForBelt,
  safetyBeltWidth,
  type SettlementFaunaPlanInput,
  settlementFaunaSiteRandom,
  SPAWN_RING_OFFSET,
  SPAWN_RIVER_CLEARANCE,
  SPAWNER_RIVER_CLEARANCE,
  SPAWNER_SPECS,
  spawnerId,
  type SpawnProfile,
  SPAWNS,
} from './settlementFaunaHabitats'

const REFERENCE_SEED = 415424794
const HOME_RADIUS = 56
const CENTER = { x: 120, z: -80 }

/** Synthetic, deterministic terrain whose rock-den carving mutates height (like `modifyTerrain`). */
function makeWorld(seed: number) {
  const carved: { x: number, z: number }[] = []
  const phase = (seed % 1000) / 37
  const sampleHeight = (x: number, z: number): number => {
    let h = 4 * Math.sin(x * 0.021 + phase) * Math.cos(z * 0.017 - phase) + 0.03 * x
    for (const c of carved) {
      if (Math.hypot(x - c.x, z - c.z) < 7) h -= 0.15
    }
    return h
  }
  const sampleForestFactor = (x: number, z: number): number =>
    0.5 + 0.5 * Math.sin(x * 0.013 + phase * 2) * Math.cos(z * 0.011 + phase)
  const isDry = (x: number, z: number, clearance: number): boolean => {
    // A "river" stripe plus a lake blob.
    const river = Math.abs(z - (CENTER.z + 30 + 20 * Math.sin(x * 0.02))) - 4
    const lake = Math.hypot(x - (CENTER.x - 120), z - (CENTER.z + 50)) - 25
    return river >= clearance && lake > 0
  }
  const onRoad = (x: number, z: number): boolean => Math.abs(x - (CENTER.x + 40 + 0.2 * z)) < 3
  const spawnerSiteOk = (x: number, z: number): boolean =>
    isDry(x, z, SPAWNER_RIVER_CLEARANCE) && !onRoad(x, z) && sampleHeight(x, z) > -3.2
  const nearWater = (x: number, z: number): boolean =>
    [[5, 0], [-5, 0], [0, 5], [0, -5]].some(([dx, dz]) => !isDry(x + dx, z + dz, 0))
  const ringHabitatFilter = (profile: SpawnProfile) => {
    switch (profile) {
      case 'edge': return (x: number, z: number) => isDeerEdgeHabitat(sampleForestFactor(x, z))
      case 'forest': return (x: number, z: number) => sampleForestFactor(x, z) > 0.45
      case 'meadow': return (x: number, z: number) => sampleForestFactor(x, z) < 0.35
      case 'water': return nearWater
      default: return undefined
    }
  }
  return { carved, sampleHeight, sampleForestFactor, isDry, onRoad, spawnerSiteOk, ringHabitatFilter }
}

type Snapshot = {
  ring: { kind: string, x: number, z: number, herdId?: string, lifeStage?: string, motherIndex?: number }[]
  spawners: { id: string, x: number, z: number, groundY: number, slope: { yaw: number, drop: number } | null, propRandoms: number[] }[]
  nextRandom: number
}

/** Verbatim port of the pre-extraction inline `createFauna` placement (home build). */
function legacyHomePlan(seed: number, footprintRadius: number, denAvoid: { x: number, z: number }[]): Snapshot {
  const w = makeWorld(seed)
  const random = createSeededRandom(seed ^ 0xfa11)
  const findWalkableNear = (
    cx: number, cz: number, minDist: number, maxDist: number,
    filter?: (x: number, z: number) => boolean, maxAttempts = 24,
  ) => {
    const clampRadius = Math.max(HOME_RADIUS - 4, maxDist)
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const angle = random() * Math.PI * 2
      const dist = minDist + random() * (maxDist - minDist)
      const x = cx + Math.cos(angle) * dist
      const z = cz + Math.sin(angle) * dist
      if (Math.abs(x - cx) > clampRadius || Math.abs(z - cz) > clampRadius) continue
      if (!w.isDry(x, z, SPAWN_RIVER_CLEARANCE)) continue
      if (filter && !filter(x, z)) continue
      return { x, z }
    }
    return null
  }
  const placed: { x: number, z: number }[] = []
  const far = (x: number, z: number) => placed.every((p) => Math.hypot(p.x - x, p.z - z) >= MIN_SPAWN_SEPARATION)
  const ring: Snapshot['ring'] = []
  let nextHerdId = 0
  for (const spec of SPAWNS) {
    const [minOffset, maxOffset] = SPAWN_RING_OFFSET[spec.profile]
    const habitatFilter = w.ringHabitatFilter(spec.profile)
    const filter = (x: number, z: number) => (!habitatFilter || habitatFilter(x, z)) && far(x, z) && !w.onRoad(x, z)
    const herdTier = HERD_SPECIES[spec.kind]
    if (herdTier) {
      const anchor = findWalkableNear(CENTER.x, CENTER.z, footprintRadius + minOffset, footprintRadius + maxOffset, filter)
      if (!anchor) continue
      placed.push(anchor)
      const herdId = `${spec.kind}-herd-${nextHerdId++}`
      const [cMin, cMax] = HERD_CLUSTER_RADIUS[herdTier]
      const adults: number[] = [ring.length]
      ring.push({ kind: spec.kind, x: anchor.x, z: anchor.z, herdId, lifeStage: 'adult' })
      for (let i = 1; i < spec.count; i++) {
        const pos = findWalkableNear(anchor.x, anchor.z, cMin, cMax) ?? anchor
        adults.push(ring.length)
        ring.push({ kind: spec.kind, x: pos.x, z: pos.z, herdId, lifeStage: 'adult' })
      }
      const jc = JUVENILE_SPAWN_CHANCE[spec.kind]
      if (jc) {
        for (const chance of [jc.first, jc.second]) {
          if (random() >= chance) continue
          const motherIndex = adults[Math.floor(random() * adults.length)]
          const m = ring[motherIndex]
          const pos = findWalkableNear(m.x, m.z, cMin, cMax) ?? { x: m.x, z: m.z }
          ring.push({ kind: spec.kind, x: pos.x, z: pos.z, herdId, lifeStage: 'juvenile', motherIndex })
        }
      }
      continue
    }
    for (let i = 0; i < spec.count; i++) {
      const pos = findWalkableNear(CENTER.x, CENTER.z, footprintRadius + minOffset, footprintRadius + maxOffset, filter)
      if (!pos) continue
      placed.push(pos)
      ring.push({ kind: spec.kind, x: pos.x, z: pos.z })
    }
  }
  const denPts = [...denAvoid]
  const denSpaced = (x: number, z: number) => denPts.every((p) => Math.hypot(p.x - x, p.z - z) >= MIN_PREDATOR_DEN_SEPARATION)
  const seen = new Map<string, number>()
  const spawners: Snapshot['spawners'] = []
  for (const spec of SPAWNER_SPECS) {
    const seenOfType = seen.get(spec.type) ?? 0
    seen.set(spec.type, seenOfType + 1)
    const baseFilter = spec.type === 'thicket'
      ? (x: number, z: number) => w.spawnerSiteOk(x, z) && w.sampleForestFactor(x, z) > 0.28
      : w.spawnerSiteOk
    let pos: { x: number, z: number } | null = null
    for (const attempt of habitatSpawnerRingAttempts(spec)) {
      const filter = (x: number, z: number) => baseFilter(x, z) && far(x, z) && (!attempt.denSpacing || denSpaced(x, z))
      const sloped = (x: number, z: number) =>
        filter(x, z) && measureSlope(x, z, CAVE_SLOPE_SAMPLE_RADIUS, w.sampleHeight).drop >= CAVE_MIN_SLOPE_DROP
      const minR = footprintRadius + attempt.ring[0]
      const maxR = footprintRadius + attempt.ring[1]
      pos = (spec.type === 'rockDen' ? findWalkableNear(CENTER.x, CENTER.z, minR, maxR, sloped, 72) : null)
        ?? findWalkableNear(CENTER.x, CENTER.z, minR, maxR, filter, 72)
      if (pos) break
    }
    if (!pos) continue
    placed.push(pos)
    if (isPredatorDenSpec(spec)) denPts.push(pos)
    const groundY = w.sampleHeight(pos.x, pos.z)
    let slope: { yaw: number, drop: number } | null = null
    const propRandoms: number[] = []
    if (spec.type === 'rockDen') {
      slope = measureSlope(pos.x, pos.z, CAVE_SLOPE_SAMPLE_RADIUS, w.sampleHeight)
      w.carved.push(pos) // modifyTerrain
      propRandoms.push(random())
    } else if (spec.type === 'thicket') {
      propRandoms.push(random())
      propRandoms.push(random())
    } else if (spec.type === 'wolfDen') {
      propRandoms.push(random())
    }
    spawners.push({ id: spawnerId('home', spec.type, spec.kind, seenOfType), x: pos.x, z: pos.z, groundY, slope, propRandoms })
  }
  return { ring, spawners, nextRandom: random() }
}

function plannedHomeSnapshot(seed: number, footprintRadius: number, denAvoid: { x: number, z: number }[]): Snapshot {
  const w = makeWorld(seed)
  const random = createSeededRandom(seed ^ 0xfa11)
  const input: SettlementFaunaPlanInput = {
    settlementId: 'home',
    center: CENTER,
    footprintRadius,
    homeRadius: HOME_RADIUS,
    random,
    ringSpecs: SPAWNS,
    spawnerSpecs: SPAWNER_SPECS,
    isDry: w.isDry,
    onRoad: w.onRoad,
    spawnerSiteOk: w.spawnerSiteOk,
    ringHabitatFilter: w.ringHabitatFilter,
    sampleHeight: w.sampleHeight,
    sampleForestFactor: w.sampleForestFactor,
    denAvoidPoints: denAvoid,
    onSpawnerPlaced: (s) => {
      if (s.spec.type === 'rockDen') w.carved.push({ x: s.x, z: s.z })
    },
  }
  const plan = planSettlementFaunaHabitats(input)
  return {
    ring: plan.ring.map((r) => ({ ...r })),
    spawners: plan.spawners.map((s) => ({ id: s.id, x: s.x, z: s.z, groundY: s.groundY, slope: s.slope, propRandoms: s.propRandoms })),
    nextRandom: random(),
  }
}

describe('home golden: extraction is bit-identical (plan fauna-050 F1)', () => {
  const sizes: [string, number][] = [['OUTPOST', 22], ['MD', 48], ['XL', 72]]
  for (const seed of [42, REFERENCE_SEED]) {
    for (const [label, footprint] of sizes) {
      it(`seed ${seed}, ${label}: ids, positions, prop draws and RNG consumption match the legacy build`, () => {
        const denAvoid = [{ x: CENTER.x + 150, z: CENTER.z + 20 }]
        const legacy = legacyHomePlan(seed, footprint, denAvoid)
        const planned = plannedHomeSnapshot(seed, footprint, denAvoid)
        expect(planned).toEqual(legacy)
        // Guard against a vacuous comparison.
        expect(legacy.ring.length).toBeGreaterThan(5)
        expect(legacy.spawners.length).toBeGreaterThan(0)
      })
    }
  }

  it('home spawner ids keep the pre-extraction scheme', () => {
    const planned = plannedHomeSnapshot(REFERENCE_SEED, 48, [])
    for (const s of planned.spawners) expect(s.id.startsWith('home:')).toBe(true)
    expect(spawnerId('home', 'rockDen', 'wolf', 0)).toBe('home:cave')
    expect(spawnerId('home', 'rockDen', 'bear', 1)).toBe('home:cave:bear')
    expect(spawnerId('home', 'wolfDen', 'wolf', 0)).toBe('home:wolfDen')
  })
})

describe('safetyBeltWidth', () => {
  const sizes: VillageSize[] = ['SM', 'MD', 'LG']

  it('belt(home) = 70 m and the home den ring is the pre-extraction 70-130 m band', () => {
    expect(HOME_SAFETY_BELT_WIDTH).toBe(70)
    expect(safetyBeltWidth('MD', 'default', 0.35)).toBe(70)
    expect(predatorDenRingForBelt(HOME_SAFETY_BELT_WIDTH)).toEqual([...PREDATOR_DEN_RING_OFFSET])
  })

  it('is deterministic and grows with size for 3 sizes x 2 characters', () => {
    for (const character of ['default', 'closed'] as const) {
      const widths = sizes.map((s) => safetyBeltWidth(s, character, 0.3))
      expect(widths).toEqual(sizes.map((s) => safetyBeltWidth(s, character, 0.3)))
      expect(widths[0]).toBeLessThan(widths[1])
      expect(widths[1]).toBeLessThan(widths[2])
    }
  })

  it('closed settlements are narrower than default of the same size', () => {
    for (const s of sizes) {
      expect(safetyBeltWidth(s, 'closed', 0.3)).toBeLessThan(safetyBeltWidth(s, 'default', 0.3))
    }
  })

  it('narrows with forest share and never drops below the floor', () => {
    expect(safetyBeltWidth('MD', 'default', 0.9)).toBeLessThan(safetyBeltWidth('MD', 'default', 0.35))
    expect(safetyBeltWidth('OUTPOST', 'closed', 1)).toBeGreaterThanOrEqual(30)
  })
})

describe('per-site RNG for non-home settlements', () => {
  it('is independent of the shared stream and stable per (seed, id)', () => {
    const a = settlementFaunaSiteRandom(REFERENCE_SEED, '3_4')
    const b = settlementFaunaSiteRandom(REFERENCE_SEED, '3_4')
    const c = settlementFaunaSiteRandom(REFERENCE_SEED, '3_5')
    const seqA = [a(), a(), a()]
    expect(seqA).toEqual([b(), b(), b()])
    expect(seqA).not.toEqual([c(), c(), c()])
  })

  it('a non-home plan does not depend on build order and uses its own den ring', () => {
    const run = (id: string) => {
      const w = makeWorld(REFERENCE_SEED)
      return planSettlementFaunaHabitats({
        settlementId: id,
        center: CENTER,
        footprintRadius: 40,
        homeRadius: HOME_RADIUS,
        random: settlementFaunaSiteRandom(REFERENCE_SEED, id),
        denRing: predatorDenRingForBelt(safetyBeltWidth('SM', 'closed', 0.5)),
        ringSpecs: SPAWNS,
        spawnerSpecs: SPAWNER_SPECS,
        isDry: w.isDry,
        onRoad: w.onRoad,
        spawnerSiteOk: w.spawnerSiteOk,
        ringHabitatFilter: w.ringHabitatFilter,
        sampleHeight: w.sampleHeight,
        sampleForestFactor: w.sampleForestFactor,
      })
    }
    const first = run('3_4')
    run('9_9') // another site built in between must not matter
    expect(run('3_4')).toEqual(first)
    expect(first.spawners.every((s) => s.id.startsWith('3_4:'))).toBe(true)
  })
})
