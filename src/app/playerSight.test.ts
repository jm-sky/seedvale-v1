// @vitest-environment jsdom
import * as THREE from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { NpcAgent } from '../ai/NpcAgent'
import type { Settlement } from '../settlement/createSettlement'
import type { SightWorld } from '../world/sight/querySight'
import { TEST_HOUSE_02 } from '../assets/houseDefinitionExample'
import { AnimalAgent, type AnimalAgentDeps, type AnimalUpdateContext } from '../fauna/AnimalAgent'
import { ANIMAL_DEFS } from '../fauna/animalDefs'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { buildHouseSightBlockersWorld } from '../world/sight/houseSightBlockers'
import { createSightBlockerRegistry, type SightBlockerRegistry, type SightPanel } from '../world/sight/sightBlockers'
import {
  caveSpatialContext,
  WORLD_SPATIAL_CONTEXT_SURFACE,
  type WorldSpatialContext,
} from '../world/spatialContext'
import { AGENT_RENDER_LAYER, SIGHT_CONCEALED_LAYER } from '../world/waterMirror'
import {
  createPlayerSight,
  PLAYER_SIGHT_EVAL_RANGE_M,
  type PlayerSight,
  type PlayerSightUpdateInput,
} from './playerSight'


type FakeAgent = {
  mesh: THREE.Object3D
  concealed: boolean
  setSightConcealed: (c: boolean) => void
  reapplySightConcealment: () => void
  isSightConcealed: () => boolean
  sightBodyHeight: () => number
  isDead: () => boolean
  dead: boolean
  animalId: string
  id: string
  def: { kind: string }
  health: { dead: boolean }
}

function fakeAgent(id: string, x: number, z: number, y = 0): FakeAgent {
  const a: FakeAgent = {
    mesh: new THREE.Object3D(),
    concealed: false,
    setSightConcealed: (c) => { a.concealed = c },
    reapplySightConcealment: () => {},
    isSightConcealed: () => a.concealed,
    sightBodyHeight: () => 1.2,
    isDead: () => a.dead,
    dead: false,
    animalId: id,
    id,
    def: { kind: 'deer' },
    health: { get dead() { return a.dead } } as { dead: boolean },
  }
  a.mesh.position.set(x, y, z)
  return a
}

const asAnimal = (a: FakeAgent): AnimalAgent => a as unknown as AnimalAgent
const asNpc = (a: FakeAgent): NpcAgent => a as unknown as NpcAgent

function wallAt(z: number): SightPanel {
  return { kind: 'panel', x: 0, z, halfWidth: 6, halfDepth: 0.2, rotationY: 0, minY: 0, maxY: 4 }
}

function makeWorld(
  blockers: SightBlockerRegistry = createSightBlockerRegistry(),
  extra: Partial<SightWorld> = {},
): SightWorld {
  return {
    blockers,
    sampleHeight: () => 0,
    occupancyAt: () => null,
    canPerceiveAcrossEntrance: () => false,
    ...extra,
  }
}

type Scene = {
  wild?: FakeAgent[]
  npcs?: FakeAgent[]
  livestock?: FakeAgent[]
  mounted?: string | null
  interacting?: string | null
}

function makeInput(
  nowSec: number,
  player: { x: number, y: number, z: number },
  scene: Scene,
  resolveContextAt: (x: number, y: number, z: number) => WorldSpatialContext = () => WORLD_SPATIAL_CONTEXT_SURFACE,
  playerContext: WorldSpatialContext = WORLD_SPATIAL_CONTEXT_SURFACE,
): PlayerSightUpdateInput {
  const settlement = {
    npcs: (scene.npcs ?? []).map(asNpc),
    livestock: (scene.livestock ?? []).map(asAnimal),
    rats: [],
  } as unknown as Settlement
  return {
    nowSec,
    playerPosition: player,
    playerContext,
    settlements: [settlement],
    detachedLivestock: [],
    wildFauna: (scene.wild ?? []).map(asAnimal),
    mountedAnimalId: scene.mounted ?? null,
    interactingNpcId: scene.interacting ?? null,
    resolveContextAt,
  }
}

const P0 = { x: 0, y: 0, z: 0 }

describe('createPlayerSight (unit)', () => {
  let sight: PlayerSight | null = null
  afterEach(() => {
    sight?.dispose()
    sight = null
  })

  it('conceals an actor behind a wall only after the 0.2 s grace, reveals instantly when the wall goes', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    const parent = new THREE.Object3D()
    sight = createPlayerSight(makeWorld(reg), parent, { enabled: true })
    const deer = fakeAgent('d1', 0, 10)
    const scene = { wild: [deer] }
    // Starts clear for a frame (no wall yet) is not required: first sighting is blocked, hasClear false.
    sight.update(makeInput(0, P0, scene))
    sight.update(makeInput(0.1, P0, scene))
    // Within grace after first blocked observation (contacts may conceal immediately if never seen) - check final state.
    sight.update(makeInput(0.3, P0, scene))
    sight.update(makeInput(0.4, P0, scene))
    expect(deer.concealed).toBe(true)
    expect(sight.isAnimalDisclosed('d1')).toBe(false)
    reg.clearBlockers('wall')
    sight.update(makeInput(0.41, P0, scene))
    expect(deer.concealed).toBe(false)
    expect(sight.isAnimalDisclosed('d1')).toBe(true)
  })

  it('an actor first clear then blocked stays shown during the grace period', () => {
    const reg = createSightBlockerRegistry()
    const parent = new THREE.Object3D()
    sight = createPlayerSight(makeWorld(reg), parent, { enabled: true })
    const deer = fakeAgent('d1', 0, 10)
    sight.update(makeInput(0, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(false)
    reg.setBlockers('wall', [wallAt(5)])
    sight.update(makeInput(0.05, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(false)
    sight.update(makeInput(0.1, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(false)
    sight.update(makeInput(0.3, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(true)
  })

  it('NPC disclosure follows concealment', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const npc = fakeAgent('n1', 2, 12)
    const scene = { npcs: [npc] }
    for (let t = 0; t <= 0.6; t += 0.1) sight.update(makeInput(t, P0, scene))
    expect(npc.concealed).toBe(true)
    expect(sight.isNpcDisclosed('n1')).toBe(false)
    expect(sight.isNpcDisclosed('other')).toBe(true)
  })

  it('exempt mount id and interacting NPC are never concealed', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const horse = fakeAgent('h1', 0, 8)
    const npc = fakeAgent('n1', 1, 8)
    const scene = { wild: [horse], npcs: [npc], mounted: 'h1', interacting: 'n1' }
    for (let t = 0; t <= 1; t += 0.1) sight.update(makeInput(t, P0, scene))
    expect(horse.concealed).toBe(false)
    expect(npc.concealed).toBe(false)
    expect(sight.isAnimalDisclosed('h1')).toBe(true)
  })

  it('a dead actor is revealed and forgotten', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const deer = fakeAgent('d1', 0, 10)
    for (let t = 0; t <= 0.6; t += 0.1) sight.update(makeInput(t, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(true)
    deer.dead = true
    sight.update(makeInput(0.7, P0, { wild: [deer] }))
    expect(deer.concealed).toBe(false)
    expect(sight.isAnimalDisclosed('d1')).toBe(true)
    expect(sight.stats().billboards).toBe(0)
  })

  it('enabled:false never conceals and discloses everything', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: false })
    const deer = fakeAgent('d1', 0, 10)
    for (let t = 0; t <= 1; t += 0.1) sight.update(makeInput(t, P0, { wild: [deer] }))
    expect(sight.enabled()).toBe(false)
    expect(deer.concealed).toBe(false)
    expect(sight.isAnimalDisclosed('d1')).toBe(true)
    expect(sight.isNpcDisclosed('d1')).toBe(true)
  })

  it('actors beyond the evaluation range are not concealed', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const far = fakeAround(PLAYER_SIGHT_EVAL_RANGE_M + 5)
    for (let t = 0; t <= 1; t += 0.1) sight.update(makeInput(t, P0, { wild: [far] }))
    expect(far.concealed).toBe(false)
    expect(sight.stats().evaluated).toBe(0)
  })

  it('creates a billboard at the last clear position (frozen) and drops it when the player approaches', () => {
    const reg = createSightBlockerRegistry()
    const parent = new THREE.Object3D()
    sight = createPlayerSight(makeWorld(reg), parent, { enabled: true })
    const deer = fakeAgent('d1', 0, 10)
    sight.update(makeInput(0, P0, { wild: [deer] }))
    expect(sight.stats().billboards).toBe(0)
    reg.setBlockers('wall', [wallAt(5)])
    let t = 0
    for (let i = 0; i < 10; i++) { t += 0.1; sight.update(makeInput(t, P0, { wild: [deer] })) }
    expect(deer.concealed).toBe(true)
    expect(sight.stats().billboards).toBe(1)
    expect(parent.children.length).toBeGreaterThan(0)
    // Actor moves while concealed; billboard stays at the last clear pose.
    deer.mesh.position.set(3, 0, 14)
    for (let i = 0; i < 10; i++) { t += 0.1; sight.update(makeInput(t, P0, { wild: [deer] })) }
    expect(deer.concealed).toBe(true)
    expect(sight.stats().billboards).toBe(1)
    const found: THREE.Object3D[] = []
    parent.traverse((o) => {
      if (Math.abs(o.position.z - 10) < 0.5 && o.visible && o !== parent) found.push(o)
    })
    expect(found.length).toBeGreaterThan(0)
    // Player approaches within 3 m of the last-known spot.
    const near = { x: 0, y: 0, z: 8 }
    t += 0.1
    sight.update(makeInput(t, near, { wild: [deer] }))
    expect(sight.stats().billboards).toBe(0)
  })

  it('dispose reveals everything', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const a = fakeAgent('a', 0, 10)
    const n = fakeAgent('n', 1, 10)
    for (let t = 0; t <= 0.6; t += 0.1) sight.update(makeInput(t, P0, { wild: [a], npcs: [n] }))
    expect(a.concealed && n.concealed).toBe(true)
    sight.dispose()
    expect(a.concealed).toBe(false)
    expect(n.concealed).toBe(false)
    expect(sight.isAnimalDisclosed('a')).toBe(true)
  })

  it('a static scene hits the cache on repeated frames', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const a = fakeAgent('a', 0, 10)
    const b = fakeAgent('b', 4, 3)
    sight.update(makeInput(0, P0, { wild: [a, b] }))
    expect(sight.stats().queries).toBe(2)
    expect(sight.stats().cacheHits).toBe(0)
    sight.update(makeInput(0.016, P0, { wild: [a, b] }))
    expect(sight.stats().queries).toBe(0)
    expect(sight.stats().cacheHits).toBe(2)
  })
})

function fakeAround(dist: number): FakeAgent {
  return fakeAgent('far', 0, dist)
}

// ---------------------------------------------------------------------------
// Simulation invariance
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const REFERENCE_SEED = 415424794

function makeAnimalDeps(i: number, kind: 'deer' | 'wolf' | 'rabbit'): AnimalAgentDeps {
  return {
    def: ANIMAL_DEFS[kind],
    animalId: `inv-${kind}-${i}`,
    sampleHeight: () => 0,
    waterLevel: -10,
    sampleLocalWater: () => DRY_WATER_SAMPLE,
    collidersNear: () => [],
    x: (i % 4) * 3 - 4,
    z: 10 + Math.floor(i / 4) * 3,
  }
}

type Snapshot = string

function runSimulation(mode: 'off' | 'wall' | 'wallOtherPlayer'): { snaps: Snapshot[], rootVisibleChanges: number, concealedSeen: boolean } {
  const rand = seededRandom(REFERENCE_SEED)
  const spy = vi.spyOn(Math, 'random').mockImplementation(rand)
  try {
    const kinds = ['deer', 'wolf', 'rabbit'] as const
    const animals = Array.from({ length: 6 }, (_, i) => new AnimalAgent(makeAnimalDeps(i, kinds[i % 3])))
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    const sight = mode === 'off' ? null : createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const dt = 1 / 20
    const observer = new THREE.Vector3(0, 0, 0)
    const snaps: Snapshot[] = []
    let rootVisibleChanges = 0
    let concealedSeen = false
    const initialVisible = animals.map((a) => a.mesh.visible)
    for (let step = 0; step < 300; step++) {
      const ctx: AnimalUpdateContext = {
        dt, others: animals, observerPos: observer, dayFactor: 1, forestFactor: 0, litFires: [],
      }
      for (const a of animals) a.update(ctx)
      if (sight) {
        const player = mode === 'wallOtherPlayer'
          ? { x: Math.sin(step * 0.1) * 3, y: 0, z: -2 + Math.cos(step * 0.07) }
          : P0
        const input = makeInput(step * dt, player, {})
        sight.update({ ...input, wildFauna: animals })
        if (animals.some((a) => a.isSightConcealed())) concealedSeen = true
      }
      animals.forEach((a, i) => { if (a.mesh.visible !== initialVisible[i] && !a.isDead()) rootVisibleChanges++ })
      snaps.push(JSON.stringify(animals.map((a) => [
        a.mesh.position.x, a.mesh.position.y, a.mesh.position.z, a.mesh.rotation.y,
        a.isDead(), a.mesh.visible,
      ])))
    }
    sight?.dispose()
    return { snaps, rootVisibleChanges, concealedSeen }
  } finally {
    spy.mockRestore()
  }
}

describe('player sight does not influence simulation', () => {
  it('animal state is identical with sight off / on behind a wall / on with another player pose', () => {
    const a = runSimulation('off')
    const b = runSimulation('wall')
    const c = runSimulation('wallOtherPlayer')
    expect(b.concealedSeen).toBe(true)
    expect(c.concealedSeen).toBe(true)
    // sanity: the animals actually did something
    expect(new Set(a.snaps).size).toBeGreaterThan(10)
    expect(b.snaps).toEqual(a.snaps)
    expect(c.snaps).toEqual(a.snaps)
    expect(b.rootVisibleChanges).toBe(0)
    expect(c.rootVisibleChanges).toBe(0)
  })

  it('concealment changes layers only, never root visibility', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('wall', [wallAt(5)])
    const sight = createPlayerSight(makeWorld(reg), new THREE.Object3D(), { enabled: true })
    const deer = new AnimalAgent(makeAnimalDeps(0, 'deer'))
    deer.mesh.position.set(0, 0, 10)
    for (let t = 0; t <= 0.6; t += 0.1) sight.update({ ...makeInput(t, P0, {}), wildFauna: [deer] })
    expect(deer.isSightConcealed()).toBe(true)
    expect(deer.mesh.visible).toBe(true)
    expect(deer.mesh.layers.isEnabled(SIGHT_CONCEALED_LAYER)).toBe(true)
    sight.dispose()
    expect(deer.isSightConcealed()).toBe(false)
    expect(deer.mesh.layers.isEnabled(AGENT_RENDER_LAYER)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Cost measurement (reports numbers; generous sanity bound only)
// ---------------------------------------------------------------------------

function pct(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]
}

type CostScene = {
  name: string
  world: SightWorld
  resolveContextAt: (x: number, y: number, z: number) => WorldSpatialContext
  playerContext: WorldSpatialContext
  scatter: (rand: () => number) => { x: number, z: number }
  playerY: (x: number, z: number) => number
  actorY: (x: number, z: number) => number
}

function measure(scene: CostScene): void {
  const rand = seededRandom(REFERENCE_SEED)
  const parent = new THREE.Object3D()
  const sight = createPlayerSight(scene.world, parent, { enabled: true })
  const npcs: FakeAgent[] = []
  const animals: FakeAgent[] = []
  for (let i = 0; i < 60; i++) {
    const p = scene.scatter(rand)
    npcs.push(fakeAgent(`n${i}`, p.x, p.z, scene.actorY(p.x, p.z)))
  }
  for (let i = 0; i < 20; i++) {
    const p = scene.scatter(rand)
    animals.push(fakeAgent(`a${i}`, p.x, p.z, scene.actorY(p.x, p.z)))
  }
  const cpu: number[] = []
  let queries = 0
  let hits = 0
  let concealedMax = 0
  const frames = 600
  const dt = 1 / 60
  const player = { x: -40, y: 0, z: 0 }
  for (let f = 0; f < frames; f++) {
    // Player walks along +x at 2 m/s; actors wander slowly (0.5 m/s).
    player.x += 2 * dt
    player.y = scene.playerY(player.x, player.z)
    for (const [i, a] of [...npcs, ...animals].entries()) {
      const ang = f * 0.01 + i
      a.mesh.position.x += Math.cos(ang) * 0.5 * dt
      a.mesh.position.z += Math.sin(ang) * 0.5 * dt
      a.mesh.position.y = scene.actorY(a.mesh.position.x, a.mesh.position.z)
      a.mesh.rotation.y = ang
    }
    sight.update({
      nowSec: f * dt,
      playerPosition: player,
      playerContext: scene.playerContext,
      settlements: [{ npcs: npcs.map(asNpc), livestock: [], rats: [] } as unknown as Settlement],
      detachedLivestock: [],
      wildFauna: animals.map(asAnimal),
      mountedAnimalId: null,
      interactingNpcId: null,
      resolveContextAt: scene.resolveContextAt,
    })
    const s = sight.stats()
    cpu.push(s.cpuMs)
    queries += s.queries
    hits += s.cacheHits
    concealedMax = Math.max(concealedMax, s.concealed)
  }
  sight.dispose()
  const sorted = [...cpu].sort((x, y) => x - y)
  const avg = cpu.reduce((x, y) => x + y, 0) / cpu.length
  const hitRate = hits / Math.max(1, hits + queries)
  console.info(
    `[sight-cost] ${scene.name}: p50=${pct(sorted, 0.5).toFixed(3)}ms p95=${pct(sorted, 0.95).toFixed(3)}ms `
    + `max=${sorted[sorted.length - 1].toFixed(3)}ms avg=${avg.toFixed(3)}ms queries/frame=${(queries / frames).toFixed(1)} `
    + `cacheHit=${(hitRate * 100).toFixed(1)}% maxConcealed=${concealedMax}`,
  )
  expect(avg).toBeLessThan(5)
}

describe('player sight cost (measurement)', () => {
  const surface = (): WorldSpatialContext => WORLD_SPATIAL_CONTEXT_SURFACE

  it('dense village: 40 houses, 60 NPCs, 20 animals', () => {
    const reg = createSightBlockerRegistry()
    for (let i = 0; i < 40; i++) {
      const hx = (i % 8) * 14 - 45
      const hz = Math.floor(i / 8) * 14 - 28
      reg.setBlockers(`house${i}`, buildHouseSightBlockersWorld(TEST_HOUSE_02, hx, 0, hz, (i % 4) * 0.4, [i % 2 === 0], 3.123))
    }
    measure({
      name: 'dense village',
      world: makeWorld(reg),
      resolveContextAt: surface,
      playerContext: WORLD_SPATIAL_CONTEXT_SURFACE,
      scatter: (r) => ({ x: (r() - 0.5) * 100, z: (r() - 0.5) * 70 }),
      playerY: () => 0,
      actorY: () => 0,
    })
  })

  it('open hilly terrain, no blockers', () => {
    const h = (x: number, z: number): number => Math.sin(x * 0.12) * 2.5 + Math.cos(z * 0.09) * 2
    measure({
      name: 'open hilly',
      world: makeWorld(createSightBlockerRegistry(), { sampleHeight: h }),
      resolveContextAt: surface,
      playerContext: WORLD_SPATIAL_CONTEXT_SURFACE,
      scatter: (r) => ({ x: (r() - 0.5) * 100, z: (r() - 0.5) * 100 }),
      playerY: h,
      actorY: h,
    })
  })

  it('cave tube', () => {
    const ctx = caveSpatialContext('cave-1')
    // Tube along x, radius 2.5, centred at y = 0..., z in [-2.5, 2.5], bending slightly.
    const inTube = (x: number, y: number, z: number): boolean => {
      const cz = Math.sin(x * 0.05) * 4
      return Math.hypot(z - cz, y - 1.5) < 2.5
    }
    measure({
      name: 'cave tube',
      world: makeWorld(createSightBlockerRegistry(), {
        sampleHeight: () => 30,
        occupancyAt: (x, y, z) => (inTube(x, y, z) ? { id: 1 } : null),
      }),
      resolveContextAt: () => ctx,
      playerContext: ctx,
      scatter: (r) => {
        const x = (r() - 0.5) * 100
        return { x, z: Math.sin(x * 0.05) * 4 + (r() - 0.5) * 2 }
      },
      playerY: () => 0,
      actorY: () => 0,
    })
  })
})

