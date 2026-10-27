// @vitest-environment jsdom
/**
 * npc-064 Stage 0A — real-agent motion / facing characterization.
 * Mesh authority baseline before spatial seam migration. No runtime changes.
 */
import * as THREE from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CombatIntent } from '../combat/combatIntent'
import type { RuntimeGroundSampler } from '../player/PlayerController'
import type { Place } from '../settlement/places'
import type { SettlementLandmarks } from '../settlement/props'
import type { CaveHeightfieldRepresentation, SurfaceSampler } from '../world/caves/caveHeightfieldRepresentation'
import type { CaveTopology } from '../world/caves/caveTopology'
import type { LargeCaveSite } from '../world/largeCaves'
import type { NpcPlannedAction } from './npcAction'
import type { NpcComposedRoute, NpcRouteExecution } from './npcMovementRoute'
import type { NpcWorldMovementQueries } from './npcMovementTarget'
import { yawToward } from '../combat/meleeAttack'
import * as projectileMod from '../combat/projectile'
import { rangedAccuracy, rangedDeviationRoll, resolveRangedDirection } from '../combat/rangedAttack'
import { createWeaponInstance } from '../items/weaponMaintenance'
import { proceduralResidentAnchorsFromLandmarks, residentAnchorsForHome } from '../settlement/npcResidentAnchors'
import { createInteractionQueue } from '../simulation/interactionQueue'
import { vec3 } from '../simulation/types'
import { resolveCaveRouteBetweenPoints, resolveCaveTraversal } from '../world/caves/caveHabitat'
import {
  heightfieldGroundColumn,
  heightfieldOccupancyAt,
  heightfieldStandingClearance,
  queryHeightfieldGround,
  resolveHeightfieldHorizontal,
} from '../world/caves/caveHeightfieldQuery'
import { buildCaveHeightfieldRepresentation } from '../world/caves/caveHeightfieldRepresentation'
import { mouthCarveDepth } from '../world/caves/mouthCarve'
import { buildNaturalCaveTopology } from '../world/caves/productionTopology'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE } from '../world/spatialContext'
import { NPC_HEIGHT, NpcAgent } from './NpcAgent'
import { composeNpcMovementRoute, INITIAL_NPC_ROUTE_EXECUTION } from './npcMovementRoute'

const WALK_SPEED = 2.4
const ARRIVE = 0.55
const CAVE_ID = 'cave-spatial-0a'
const CAVE_FLOOR = -11.5

function makeLandmarks(): SettlementLandmarks {
  const garden = new THREE.Vector3(3, 0, 3)
  return {
    well: new THREE.Vector3(1, 0, 1),
    stockpile: new THREE.Vector3(2, 0, 2),
    garden,
    gardens: [garden],
    cultivationAnchors: [],
    haySpots: [],
    market: new THREE.Vector3(4, 0, 4),
    markets: [],
    blacksmithWorkplaces: [],
    homes: [],
    houses: [],
    trees: [],
    dockRoute: [],
    landPlots: [],
    householdStorages: [],
    householdWoodStorages: [],
    settlementStorage: new THREE.Vector3(5, 0, 5),
    noticeBoard: new THREE.Vector3(7, 0, 7),
  }
}

function homePlace(): Place {
  return { id: 's1:home:0', type: 'home', position: new THREE.Vector3(0, 0, 0) }
}

function socialPlace(): Place {
  return { id: 's1:social', type: 'social', position: new THREE.Vector3(4, 0, 4) }
}

type SpatialInternals = {
  phase: string
  wait: number
  pauseTimer: number
  previousPhase: string | null
  pendingAction: NpcPlannedAction | null
  composedRoute: NpcComposedRoute | null
  routeExecution: NpcRouteExecution
  combatIntent: CombatIntent | null
  combatProjectile: { dirX: number, dirZ: number, attempt: number } | null
  combatAttackAttempt: number
  combatRangedAttack: { start: (config: unknown) => boolean, state: () => string, update: (dt: number) => { fireReady: boolean, config: unknown } }
  combatRangedWeapon: { ranged: unknown } | null
  startAction: (action: NpcPlannedAction) => void
  committedMovementTarget: NpcComposedRoute['finalTarget'] | null
  stepComposedRoute: (dt: number) => 'continue' | 'arrived' | 'failed'
  steerTo: (dest: THREE.Vector3, dt: number) => boolean
  applyMovementGroundY: () => void
  attemptLocalEscape: () => void
  emergencyTeleport: () => void
  tickMeleeCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  tickRangedCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  tickRangedAttackCycle: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  die: (alreadySettled?: boolean) => void
}

function spatial(npc: NpcAgent): SpatialInternals {
  return npc as unknown as SpatialInternals
}

type CreateSpatialOpts = {
  sampleHeight?: (x: number, z: number) => number
  sampleResidentSurfaceGround?: RuntimeGroundSampler
  collidersNear?: (x: number, z: number) => Array<{ type: 'circle', x: number, z: number, radius: number }>
  npcWorldMovement?: NpcWorldMovementQueries
  queues?: Map<string, ReturnType<typeof createInteractionQueue>>
  npcId?: string
  waterLevel?: number
}

async function createSpatialNpc(opts: CreateSpatialOpts = {}): Promise<NpcAgent> {
  const home = homePlace()
  const landmarks = makeLandmarks()
  return NpcAgent.create({
    sampleHeight: opts.sampleHeight ?? (() => 0),
    waterLevel: opts.waterLevel ?? -1,
    collidersNear: opts.collidersNear ?? (() => []),
    sampleResidentSurfaceGround: opts.sampleResidentSurfaceGround,
    npcWorldMovement: opts.npcWorldMovement,
    residentAnchors: residentAnchorsForHome(
      proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well'),
      home.position,
      landmarks,
    ),
    home,
    workplace: null,
    socialPlace: socialPlace(),
    treeIndex: 0,
    needOffset: 0,
    member: {
      name: 'Spatial',
      lastName: 'Baseline',
      relation: 'single',
      scale: 1,
      age: 40,
      character: {
        name: 'Spatial',
        gender: 'male',
        role: 'guard',
        personality: {
          openness: 0.5,
          conscientiousness: 0.5,
          extraversion: 0.5,
          agreeableness: 0.5,
          neuroticism: 0.5,
        },
        traits: [],
      },
    },
    familyMembers: [],
    modelUrl: '/__missing_npc_model__.glb',
    npcId: opts.npcId ?? 'npc-spatial-0a',
    queues: opts.queues,
  })
}

function diskCaveQueries(overrides: Partial<NpcWorldMovementQueries> = {}): NpcWorldMovementQueries {
  return {
    spatialContextAt: (_x, y) => (y < 0 ? caveSpatialContext(CAVE_ID) : WORLD_SPATIAL_CONTEXT_SURFACE),
    resolveHabitat: () => null,
    resolveRouteBetweenPoints: () => null,
    queryGroundIn: (caveId, x, y, z) => {
      if (caveId !== CAVE_ID) return null
      if (Math.hypot(x, z) > 8) return null
      if (y > 0) return null
      return {
        floorY: CAVE_FLOOR,
        ceilingY: CAVE_FLOOR + 4,
        intervals: [{ floorY: CAVE_FLOOR, ceilingY: CAVE_FLOOR + 4 }],
      }
    },
    resolveHorizontalIn: (_caveId, x, z) => {
      const dist = Math.hypot(x, z)
      if (dist <= 8) return { x, z }
      const s = 7.5 / dist
      return { x: x * s, z: z * s }
    },
    ...overrides,
  }
}

function baseSite(overrides: Partial<LargeCaveSite> = {}): LargeCaveSite {
  return { x: 200, z: -140, yaw: 0.6, length: 12, variant: 0.4, ...overrides }
}

function gentleHillFor(site: LargeCaveSite): SurfaceSampler {
  const intoDx = -Math.sin(site.yaw)
  const intoDz = -Math.cos(site.yaw)
  return (x, z) => 130 + 0.5 * ((x - site.x) * intoDx + (z - site.z) * intoDz)
}

function queriesFor(
  topology: CaveTopology,
  heightfield: CaveHeightfieldRepresentation,
  surfaceHeightAt: SurfaceSampler,
): NpcWorldMovementQueries {
  const minGap = heightfieldStandingClearance(NPC_HEIGHT)
  return {
    spatialContextAt: (x, y, z) => {
      const occ = heightfieldOccupancyAt(heightfield, surfaceHeightAt, x, y, z)
      if (!occ || occ.openSky) return WORLD_SPATIAL_CONTEXT_SURFACE
      return caveSpatialContext(topology.caveId)
    },
    resolveHabitat: (caveId, entityHeight) => {
      if (caveId !== topology.caveId) return null
      return resolveCaveTraversal(topology, heightfield, surfaceHeightAt, entityHeight)
    },
    resolveRouteBetweenPoints: (caveId, from, to) => {
      if (caveId !== topology.caveId) return null
      return resolveCaveRouteBetweenPoints(topology, heightfield, surfaceHeightAt, from, to)
    },
    queryGroundIn: (caveId, x, y, z) => {
      if (caveId !== topology.caveId) return null
      return queryHeightfieldGround(heightfield, surfaceHeightAt, x, y, z)
    },
    resolveHorizontalIn: (caveId, x, z, y, radius) => {
      if (caveId !== topology.caveId) return { x, z }
      return resolveHeightfieldHorizontal(heightfield, x, z, y, radius, minGap)
    },
  }
}

function naturalWorld(seed = 42) {
  const site = baseSite()
  const sampleBaseHeight = gentleHillFor(site)
  const topology = buildNaturalCaveTopology({ seed, site, sampleHeight: sampleBaseHeight, sampleBaseHeight })
  if (!topology) throw new Error('natural topology rejected')
  const walkSurfaceAt: SurfaceSampler = (x, z) => sampleBaseHeight(x, z) - mouthCarveDepth(x, z, topology.entrance)
  const { heightfield } = buildCaveHeightfieldRepresentation(topology, walkSurfaceAt)
  return {
    topology,
    heightfield,
    surfaceHeightAt: sampleBaseHeight,
    queries: queriesFor(topology, heightfield, sampleBaseHeight),
  }
}

function snap(
  heightfield: CaveHeightfieldRepresentation,
  surfaceHeightAt: SurfaceSampler,
  point: { x: number, y: number, z: number },
) {
  const column = heightfieldGroundColumn(heightfield, surfaceHeightAt, point.x, point.z)
  if (!column) return point
  return { x: point.x, y: column.floorY, z: point.z }
}

function observerAt(x: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, 0, z)
}

function stubTarget(getPos: () => { x: number, z: number }): CombatIntent['target'] {
  return {
    ref: { id: 'threat-spatial', kind: 'animal' },
    getPosition: getPos,
    isAlive: () => true,
    applyDamage: () => {},
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('NpcAgent.spatial Stage 0A — surface movement (npc-064)', () => {
  it('steers exact flat-ground displacement and faces atan2(dirX, dirZ)', async () => {
    const npc = await createSpatialNpc()
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    npc.mesh.rotation.y = 0
    const dt = 0.5
    const arrived = s.steerTo(new THREE.Vector3(10, 0, 0), dt)
    expect(arrived).toBe(false)
    expect(npc.mesh.position.x).toBeCloseTo(WALK_SPEED * dt, 9)
    expect(npc.mesh.position.z).toBeCloseTo(0, 9)
    expect(npc.mesh.rotation.y).toBeCloseTo(Math.atan2(1, 0), 9)
  })

  it('returns arrival and does not move when already within ARRIVE', async () => {
    const npc = await createSpatialNpc()
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    const before = npc.mesh.position.clone()
    const yawBefore = npc.mesh.rotation.y
    expect(s.steerTo(new THREE.Vector3(ARRIVE * 0.5, 0, 0), 0.5)).toBe(true)
    expect(npc.mesh.position.x).toBe(before.x)
    expect(npc.mesh.position.z).toBe(before.z)
    expect(npc.mesh.rotation.y).toBe(yawBefore)
  })

  it('holds when resident surface ground is unavailable', async () => {
    const npc = await createSpatialNpc({
      sampleResidentSurfaceGround: () => null,
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    s.steerTo(new THREE.Vector3(5, 0, 0), 0.5)
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBe(0)
  })

  it('applies sampleHeight Y after steer via applyMovementGroundY and records sample order', async () => {
    const samples: Array<{ x: number, z: number }> = []
    const npc = await createSpatialNpc({
      sampleHeight: (x, z) => {
        samples.push({ x, z })
        return 3.25
      },
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    samples.length = 0
    s.steerTo(new THREE.Vector3(4, 0, 0), 0.25)
    // steer may sample for slope/walkability; ground authority write is explicit:
    const afterSteerY = npc.mesh.position.y
    expect(afterSteerY).toBe(0)
    s.applyMovementGroundY()
    expect(npc.mesh.position.y).toBe(3.25)
    expect(samples).toEqual([
      { x: 1.2, z: 0 },
      { x: -1.2, z: 0 },
      { x: 0, z: 1.2 },
      { x: 0, z: -1.2 },
      { x: npc.mesh.position.x, z: npc.mesh.position.z },
      { x: npc.mesh.position.x, z: npc.mesh.position.z },
    ])
  })

  it.each(['x', 'z'] as const)('uses the %s-only fallback after rejecting wet candidates', async (axis) => {
    const npc = await createSpatialNpc({
      sampleHeight: (x, z) => {
        if (x > 0.05 && z > 0.05) return -2 // diagonal wet
        if (axis === 'z' && x > 0.05 && Math.abs(z) <= 0.05) return -2 // X-only wet
        return 1
      },
      waterLevel: 0,
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, 1, 0)
    s.steerTo(new THREE.Vector3(10, 0, 10), 0.5)
    const step = WALK_SPEED * 0.5 / Math.sqrt(2)
    expect(npc.mesh.position.x).toBeCloseTo(axis === 'x' ? step : 0, 9)
    expect(npc.mesh.position.z).toBeCloseTo(axis === 'z' ? step : 0, 9)
  })

  it('does not move when every surface candidate is unwalkable', async () => {
    const npc = await createSpatialNpc({
      sampleHeight: () => -2,
      waterLevel: 0,
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, 1, 0)
    s.steerTo(new THREE.Vector3(5, 0, 0), 0.5)
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBe(0)
  })
})

describe('NpcAgent.spatial Stage 0A — cave movement (npc-064)', () => {
  it('cave steer writes XZ only; applyMovementGroundY uses cave floor not sampleHeight', async () => {
    let surfaceSamples = 0
    const queries = diskCaveQueries()
    const npc = await createSpatialNpc({
      npcWorldMovement: queries,
      sampleHeight: () => {
        surfaceSamples += 1
        return 42
      },
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, CAVE_FLOOR, 0)
    expect(npc.resolveCurrentSpatialContext()).toEqual(caveSpatialContext(CAVE_ID))
    surfaceSamples = 0
    s.steerTo(new THREE.Vector3(2, CAVE_FLOOR, 0), 0.2)
    expect(npc.mesh.position.y).toBe(CAVE_FLOOR)
    const yBeforeGround = npc.mesh.position.y
    const samplesBeforeGround = surfaceSamples
    s.applyMovementGroundY()
    expect(npc.mesh.position.y).toBe(CAVE_FLOOR)
    expect(npc.mesh.position.y).toBe(yBeforeGround)
    expect(surfaceSamples).toBe(samplesBeforeGround)
    expect(npc.mesh.position.y).not.toBe(42)
  })

  it('mouth crossing keeps cave locomotion and route ground when floor probe misses', async () => {
    const queries = diskCaveQueries({
      queryGroundIn: () => null,
    })
    const npc = await createSpatialNpc({
      npcWorldMovement: queries,
      sampleHeight: () => 99,
    })
    const s = spatial(npc)
    // Surface Y so spatialContextAt reports surface; mouth crossing still activates cave id.
    npc.mesh.position.set(0, 1, 0)
    s.routeExecution = {
      ...INITIAL_NPC_ROUTE_EXECUTION,
      mouthPhase: 'crossing',
      legIndex: 0,
    }
    s.composedRoute = {
      legs: [{
        kind: 'enterCave',
        caveId: CAVE_ID,
        approach: { x: 0, y: 1, z: 0 },
        inward: { x: 1, y: CAVE_FLOOR, z: 0 },
      }],
      finalTarget: {
        position: { x: 1, y: CAVE_FLOOR, z: 0 },
        context: caveSpatialContext(CAVE_ID),
      },
    }
    const xBefore = npc.mesh.position.x
    s.steerTo(new THREE.Vector3(3, 1, 0), 0.2)
    // Cave locomotion during mouth crossing — XZ may move; Y not from sampleHeight here.
    expect(npc.mesh.position.y).toBe(1)
    s.applyMovementGroundY()
    // Missing cave floor + crossing → npcRouteGroundY uses enterCave.inward.y.
    expect(npc.mesh.position.y).toBe(CAVE_FLOOR)
    expect(npc.mesh.position.y).not.toBe(99)
    expect(npc.mesh.position.x).not.toBe(xBefore)
  })

  it('composed final cave target survives intermediate steer legs on a real agent', async () => {
    const { topology, heightfield, surfaceHeightAt, queries } = naturalWorld()
    const habitat = resolveCaveTraversal(topology, heightfield, surfaceHeightAt, NPC_HEIGHT)!
    const from = snap(heightfield, surfaceHeightAt, habitat.home)
    const to = snap(heightfield, surfaceHeightAt, habitat.routeToEntrance[1]!)
    const npc = await createSpatialNpc({
      npcWorldMovement: queries,
      sampleHeight: surfaceHeightAt,
    })
    const s = spatial(npc)
    npc.mesh.position.set(from.x, from.y, from.z)
    const route = composeNpcMovementRoute({
      currentPosition: from,
      currentContext: caveSpatialContext(topology.caveId),
      target: { position: to, context: caveSpatialContext(topology.caveId) },
      queries,
      entityHeight: NPC_HEIGHT,
    })
    expect(route).not.toBeNull()
    s.composedRoute = route
    s.committedMovementTarget = route!.finalTarget
    s.routeExecution = { ...INITIAL_NPC_ROUTE_EXECUTION }
    const finalBefore = { ...route!.finalTarget.position }
    expect(Math.hypot(to.x - from.x, to.z - from.z)).toBeGreaterThan(ARRIVE)
    for (let i = 0; i < 8; i++) {
      expect(s.stepComposedRoute(0.15)).not.toBe('failed')
      s.applyMovementGroundY()
    }
    expect(Math.hypot(npc.mesh.position.x - from.x, npc.mesh.position.z - from.z)).toBeGreaterThan(0)
    expect(s.composedRoute?.finalTarget.position).toEqual(finalBefore)
    expect(npc.resolveCurrentSpatialContext().kind).toBe('cave')
    expect(npc.mesh.position.y).not.toBeCloseTo(surfaceHeightAt(npc.mesh.position.x, npc.mesh.position.z), 0)
  })
})

describe('NpcAgent.spatial Stage 0A — separation after update (npc-064)', () => {
  it('applies immediate surface XZ after update without resampling Y', async () => {
    const npc = await createSpatialNpc({
      sampleHeight: (x, z) => 2 + 0.01 * x + 0.01 * z,
    })
    npc.mesh.position.set(0, 2, 0)
    const observer = observerAt(20, 20)
    npc.update(0.05, observer, 0, 0.5, 0, 1200)
    const yAfterUpdate = npc.mesh.position.y
    // Walkability may sample height for water checks; separation must not rewrite Y.
    npc.applySeparation(0.35, 0.2)
    expect(npc.mesh.position.x).toBeCloseTo(0.35, 9)
    expect(npc.mesh.position.z).toBeCloseTo(0.2, 9)
    expect(npc.mesh.position.y).toBe(yAfterUpdate)
    expect(npc.mesh.position.y).not.toBeCloseTo(
      2 + 0.01 * npc.mesh.position.x + 0.01 * npc.mesh.position.z,
      6,
    )
  })

  it('surface separation falls back diagonal → X → Z against water', async () => {
    const npc = await createSpatialNpc({
      sampleHeight: (x, z) => {
        if (x > 0.1 && z > 0.1) return -2
        if (x > 0.1) return -2
        return 1
      },
      waterLevel: 0,
    })
    npc.mesh.position.set(0, 1, 0)
    npc.applySeparation(0.4, 0.4)
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBeCloseTo(0.4, 9)
  })

  it('cave separation keeps both coordinates returned by the horizontal accept', async () => {
    const queries = diskCaveQueries({
      resolveHorizontalIn: (_caveId, x, z) => ({ x: x * 0.5, z: z * 0.25 }),
    })
    const npc = await createSpatialNpc({ npcWorldMovement: queries })
    npc.mesh.position.set(1, CAVE_FLOOR, 1)
    npc.applySeparation(2, 2)
    // accept(full) → resolveHorizontalIn(3,3) → (1.5,0.75), distinct from old/raw pose.
    expect(npc.mesh.position.x).toBeCloseTo(1.5, 9)
    expect(npc.mesh.position.z).toBeCloseTo(0.75, 9)
  })
})

describe('NpcAgent.spatial Stage 0A — recovery (npc-064)', () => {
  it('surface local escape writes XZ only; cave escape writes full XYZ', async () => {
    const house = { type: 'circle' as const, x: 0, z: 0, radius: 2 }
    const surfaceNpc = await createSpatialNpc({
      collidersNear: () => [house],
      sampleHeight: () => 5,
    })
    const surface = spatial(surfaceNpc)
    surfaceNpc.mesh.position.set(0.2, 5, 0.1)
    surface.attemptLocalEscape()
    expect(Math.hypot(surfaceNpc.mesh.position.x, surfaceNpc.mesh.position.z)).toBeGreaterThan(2)
    expect(surfaceNpc.mesh.position.y).toBe(5)

    const queries = diskCaveQueries()
    const caveNpc = await createSpatialNpc({
      npcWorldMovement: queries,
      sampleHeight: () => 42,
    })
    const cave = spatial(caveNpc)
    caveNpc.mesh.position.set(0, CAVE_FLOOR, 0)
    const before = caveNpc.mesh.position.clone()
    cave.attemptLocalEscape()
    expect(caveNpc.mesh.position.y).toBe(CAVE_FLOOR)
    expect(caveNpc.mesh.position.y).not.toBe(42)
    expect(
      caveNpc.mesh.position.x !== before.x
      || caveNpc.mesh.position.z !== before.z
      || caveNpc.mesh.position.y !== before.y,
    ).toBe(true)
  })

  it('emergencyTeleport snaps surface XYZ via sampleHeight and no-ops in cave', async () => {
    let draws = 0
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      draws += 1
      return 0.25
    })
    const surfaceNpc = await createSpatialNpc({
      sampleHeight: (x) => 7 + x * 0.01,
    })
    const surface = spatial(surfaceNpc)
    surfaceNpc.mesh.position.set(0, 0, 0)
    const drawsBefore = draws
    surface.emergencyTeleport()
    expect(surfaceNpc.mesh.position.y).toBeCloseTo(
      7 + surfaceNpc.mesh.position.x * 0.01,
      9,
    )
    // Emergency anchor/rim selection currently consumes no random draws.
    const surfaceDraws = draws - drawsBefore

    const caveNpc = await createSpatialNpc({
      npcWorldMovement: diskCaveQueries(),
      sampleHeight: () => 7,
    })
    const cave = spatial(caveNpc)
    caveNpc.mesh.position.set(0, CAVE_FLOOR, 0)
    const pose = caveNpc.mesh.position.clone()
    const drawsBeforeCave = draws
    cave.emergencyTeleport()
    expect(caveNpc.mesh.position.x).toBe(pose.x)
    expect(caveNpc.mesh.position.y).toBe(pose.y)
    expect(caveNpc.mesh.position.z).toBe(pose.z)
    expect(draws - drawsBeforeCave).toBe(0)
    expect(surfaceDraws).toBe(0)
    randomSpy.mockRestore()
  })
})

describe('NpcAgent.spatial Stage 0A — facing, defense, ranged fallback, death roll (npc-064)', () => {
  it('faces the well anchor while executing a drink action', async () => {
    const queue = createInteractionQueue('s1:well', {
      anchor: vec3(1, 0, 1),
      lineDir: { x: 0, z: 1 },
      servingOffset: 0,
      spacing: 1.2,
      maxVisibleSlots: 4,
      servingCapacity: 1,
    })
    const npc = await createSpatialNpc({
      queues: new Map([['s1:well', queue]]),
    })
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    npc.mesh.rotation.y = 0
    s.pendingAction = {
      kind: 'drink',
      destination: { x: 1, y: 0, z: 1 },
      durationSec: 2,
      onComplete: () => {},
      queueId: 's1:well',
    }
    s.phase = 'execute'
    s.wait = 1
    npc.update(0.05, observerAt(20, 20), 0, 0.5, 0, 1200)
    expect(npc.mesh.rotation.y).toBeCloseTo(Math.atan2(1, 1), 9)
  })

  it('lookAtPlayer faces the observer with atan2(dx, dz)', async () => {
    const npc = await createSpatialNpc()
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    s.phase = 'lookAtPlayer'
    s.pauseTimer = 1
    s.previousPhase = 'choose'
    const drawsBefore = 0
    let draws = drawsBefore
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      draws += 1
      return 0.99
    })
    npc.update(0.05, observerAt(3, 4), 0, 0.5, 0, 1200)
    expect(npc.mesh.rotation.y).toBeCloseTo(Math.atan2(3, 4), 9)
    // Direct phase entry must not consume reaction RNG.
    expect(draws).toBe(drawsBefore)
    randomSpy.mockRestore()
  })

  it('melee and ranged combat face the target while in range', async () => {
    const npc = await createSpatialNpc()
    npc.personalInventory.addInstance(createWeaponInstance('long_sword'))
    npc.personalInventory.add('crossbow', 1)
    npc.personalInventory.add('bolt', 4)
    const target = stubTarget(() => ({ x: 2, z: 0 }))
    expect(npc.beginCombat({ target, mode: 'melee' })).toBe(true)
    const s = spatial(npc)
    npc.mesh.position.set(0, 0, 0)
    npc.mesh.rotation.y = 0
    s.tickMeleeCombat(0.02, s.combatIntent!, { x: 2, z: 0 })
    expect(npc.mesh.rotation.y).toBeCloseTo(Math.atan2(2, 0), 9)

    expect(npc.beginCombat({ target, mode: 'ranged' })).toBe(true)
    npc.mesh.rotation.y = 0
    s.tickRangedCombat(0.02, s.combatIntent!, { x: 2, z: 0 })
    expect(npc.mesh.rotation.y).toBeCloseTo(Math.atan2(2, 0), 9)
  })

  it('coincident ranged aim uses rotation.y + Math.PI fallback (not raw yaw)', async () => {
    expect(yawToward(0, 0, 0, 0)).toBeNull()
    const npc = await createSpatialNpc({ npcId: 'npc-spatial-coincident' })
    npc.personalInventory.add('crossbow', 1)
    npc.personalInventory.add('bolt', 6)
    // Keep getPosition away so beginCombat/range gating stays sane; pass coincident
    // targetPos into the tick so yawToward returns null and the +PI fallback fires.
    const target = stubTarget(() => ({ x: 8, z: 0 }))
    expect(npc.beginCombat({ target, mode: 'ranged' })).toBe(true)
    const s = spatial(npc)
    expect(s.combatRangedWeapon).not.toBeNull()
    npc.mesh.position.set(0, 0, 0)
    npc.mesh.rotation.y = 0.4
    const hitSpy = vi.spyOn(projectileMod, 'sweptProjectileHit').mockReturnValue(null)
    for (let i = 0; i < 400 && !s.combatProjectile; i++) {
      if (!s.combatIntent) break
      s.tickRangedCombat(0.05, s.combatIntent, { x: 0, z: 0 })
    }
    expect(s.combatProjectile).not.toBeNull()
    const attempt = s.combatProjectile!.attempt
    const ranged = s.combatRangedWeapon!.ranged as Parameters<typeof rangedAccuracy>[0]
    const aimYaw = npc.mesh.rotation.y + Math.PI
    const expected = resolveRangedDirection(
      aimYaw,
      rangedAccuracy(ranged, 0),
      rangedDeviationRoll(npc.id, attempt),
    )
    expect(s.combatProjectile!.dirX).toBeCloseTo(expected.dirX, 9)
    expect(s.combatProjectile!.dirZ).toBeCloseTo(expected.dirZ, 9)
    const wrong = resolveRangedDirection(
      npc.mesh.rotation.y,
      rangedAccuracy(ranged, 0),
      rangedDeviationRoll(npc.id, attempt),
    )
    expect(s.combatProjectile!.dirX).not.toBeCloseTo(wrong.dirX, 5)
    hitSpy.mockRestore()
  })

  it('defense front/back uses mesh.rotation.y with npcCombat +PI conversion', async () => {
    const npc = await createSpatialNpc()
    npc.personalInventory.add('long_sword', 1)
    npc.mesh.position.set(0, 0, 0)
    npc.mesh.rotation.y = 0 // facing +Z under steerTo convention

    let frontAttempted = false
    for (let i = 0; i < 200 && !frontAttempted; i++) {
      const result = npc.applyIncomingCombatDamage({
        amount: 0.01,
        attackerX: 0,
        attackerZ: 2,
        attackerKey: `front:${i}`,
      })
      if (result.attempted) frontAttempted = true
    }
    expect(frontAttempted).toBe(true)
    expect(npc.health.dead).toBe(false)

    for (let i = 0; i < 40; i++) {
      const result = npc.applyIncomingCombatDamage({
        amount: 0.01,
        attackerX: 0,
        attackerZ: -2,
        attackerKey: `back:${i}`,
      })
      expect(result.attempted).toBe(false)
    }
    expect(npc.health.dead).toBe(false)
  })

  it('fallback death tips rotation.z to PI/2 without changing gameplay yaw', async () => {
    const npc = await createSpatialNpc()
    npc.mesh.position.set(1.5, 0, -2)
    npc.mesh.rotation.y = 1.1
    npc.mesh.rotation.z = 0
    npc.takeDamage(10_000)
    expect(npc.health.dead).toBe(true)
    expect(npc.mesh.rotation.z).toBeCloseTo(Math.PI / 2, 9)
    expect(npc.mesh.rotation.y).toBeCloseTo(1.1, 9)
  })
})
