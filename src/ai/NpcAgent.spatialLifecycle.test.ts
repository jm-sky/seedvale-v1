// @vitest-environment jsdom
/**
 * npc-064 Stage 0B — lifecycle / checkpoint / reification characterization.
 * Mesh authority baseline before spatial seam migration. No runtime changes.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'
import type { NpcAuthoritativeState } from '../settlement/npcState'
import type { Place } from '../settlement/places'
import type { SettlementLandmarks } from '../settlement/props'
import type { NeedState } from './Needs'
import type { NpcPlannedAction } from './npcAction'
import type { NpcRouteExecution } from './npcMovementRoute'
import type { NpcWorldMovementQueries } from './npcMovementTarget'
import { createLiquidContainerInstance, fillLiquidContainer } from '../items/liquidContainer'
import {
  createActiveNpcPostDeath,
  createLegacyTerminalNpcPostDeath,
} from '../settlement/npcPostDeath'
import { proceduralResidentAnchorsFromLandmarks, residentAnchorsForHome } from '../settlement/npcResidentAnchors'
import { createNpcAuthoritativeState, createNpcStateRegistry } from '../settlement/npcState'
import { vec3 } from '../simulation/types'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE } from '../world/spatialContext'
import { NpcAgent } from './NpcAgent'
import {
  beginOffscreenNpcTravel,
  reifyNpcTravel,
  stampNpcTravelCheckpoint,
} from './npcTravel'
import { resolveNpcTravelCheckpoint } from './npcTravelCheckpoint'

const CAVE_ID = 'cave-spatial-0b'
const CAVE_FLOOR = -12

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

type LifecycleInternals = {
  npcState: NpcAuthoritativeState
  worldNowDays: number
  needs: NeedState
  pendingAction: NpcPlannedAction | null
  phase: string
  routeExecution: NpcRouteExecution
  startAction: (action: NpcPlannedAction) => void
}

function internals(npc: NpcAgent): LifecycleInternals {
  return npc as unknown as LifecycleInternals
}

type CreateLifecycleOpts = {
  sampleHeight?: (x: number, z: number) => number
  npcWorldMovement?: NpcWorldMovementQueries
  npcId?: string
  npcState?: NpcAuthoritativeState
  waterLevel?: number
}

async function createLifecycleNpc(opts: CreateLifecycleOpts = {}): Promise<NpcAgent> {
  const home = homePlace()
  const landmarks = makeLandmarks()
  return NpcAgent.create({
    sampleHeight: opts.sampleHeight ?? (() => 0),
    waterLevel: opts.waterLevel ?? -1,
    collidersNear: () => [],
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
      name: 'Lifecycle',
      lastName: 'Baseline',
      relation: 'single',
      scale: 1,
      age: 40,
      character: {
        name: 'Lifecycle',
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
    npcId: opts.npcId ?? 'npc-spatial-0b',
    npcState: opts.npcState,
  })
}

function diskCaveQueries(overrides: Partial<NpcWorldMovementQueries> = {}): NpcWorldMovementQueries {
  return {
    spatialContextAt: (_x, y) => (y < 0 ? caveSpatialContext(CAVE_ID) : WORLD_SPATIAL_CONTEXT_SURFACE),
    resolveHabitat: () => null,
    resolveRouteBetweenPoints: () => null,
    queryGroundIn: (caveId, x, _y, z) => {
      if (caveId !== CAVE_ID) return null
      if (Math.hypot(x, z) > 8) return null
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

/** Production-sequence probe matching SettlementsManager snapshot/unload NPC loops. */
function createManagerWiringProbe(opts: {
  npcs: NpcAgent[]
  npcStates: ReturnType<typeof createNpcStateRegistry>
}) {
  const dispose = vi.fn()
  const settlement = { npcs: opts.npcs, dispose }
  return {
    settlement,
    snapshotNpcStates: () => {
      for (const npc of settlement.npcs) npc.syncAccompanyTravelCheckpoint()
      return opts.npcStates.serialize()
    },
    unload: (nowDays: number, dayLengthSec: number, playerX: number, playerZ: number) => {
      for (const npc of settlement.npcs) {
        npc.beginOffscreenTravelHandoff(playerX, playerZ, nowDays, dayLengthSec)
      }
      settlement.dispose()
    },
  }
}

function managerSource(): string {
  return readFileSync(join(process.cwd(), 'src/settlement/SettlementsManager.ts'), 'utf8')
}

describe('npc-064 Stage 0B — constructor spatial precedence', () => {
  it('places an ordinary resident at home with sampled Y and no travel', async () => {
    const samples: Array<{ x: number, z: number }> = []
    const sampleHeight = vi.fn((x: number, z: number) => {
      samples.push({ x, z })
      return 3 + 0.01 * x
    })
    const npc = await createLifecycleNpc({ sampleHeight, npcId: 'npc-home-0b' })
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBe(0)
    expect(npc.mesh.position.y).toBe(3)
    expect(samples.some((s) => s.x === 0 && s.z === 0)).toBe(true)
    expect(internals(npc).npcState.travel).toBeNull()
    expect(npc.health.dead).toBe(false)
  })

  it('reifies living travel XZ and resamples Y without resetting to home', async () => {
    const samples: Array<{ x: number, z: number }> = []
    const sampleHeight = vi.fn((x: number, z: number) => {
      samples.push({ x, z })
      return 5 + 0.02 * x
    })
    const state = createNpcAuthoritativeState('npc-travel-reify-0b', 0)
    state.travel = {
      destination: { x: 200, z: 0 },
      lastPosition: { x: 40, z: 12 },
      purpose: { kind: 'expedition', assignmentId: 'exp-0b' },
    }
    const npc = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-travel-reify-0b',
      npcState: state,
    })
    expect(npc.mesh.position.x).toBe(40)
    expect(npc.mesh.position.z).toBe(12)
    expect(npc.mesh.position.y).toBe(5 + 0.02 * 40)
    expect(npc.mesh.position.x).not.toBe(0)
    expect(samples.some((s) => s.x === 40 && s.z === 12)).toBe(true)
    expect(internals(npc).npcState.travel?.purpose).toEqual({ kind: 'expedition', assignmentId: 'exp-0b' })
    expect(internals(npc).npcState.travel?.execution).toBeUndefined()
  })

  it('active corpse pose/yaw wins over travel and samples corpse Y', async () => {
    const samples: Array<{ x: number, z: number }> = []
    const sampleHeight = vi.fn((x: number, z: number) => {
      samples.push({ x, z })
      return 7
    })
    const state = createNpcAuthoritativeState('npc-corpse-0b', 0)
    state.health.dead = true
    state.health.currentHp = 0
    state.travel = {
      destination: { x: 90, z: 90 },
      lastPosition: { x: 90, z: 90 },
      purpose: { kind: 'expedition', assignmentId: 'exp-dead' },
    }
    state.postDeath = createActiveNpcPostDeath({
      x: 15,
      z: -8,
      yaw: 1.25,
      deathAtDays: 2,
      loot: { counts: {}, instances: [] },
    })
    const npc = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-corpse-0b',
      npcState: state,
    })
    expect(npc.health.dead).toBe(true)
    expect(npc.mesh.position.x).toBe(15)
    expect(npc.mesh.position.z).toBe(-8)
    expect(npc.mesh.position.y).toBe(7)
    expect(npc.mesh.rotation.y).toBe(1.25)
    expect(samples.some((s) => s.x === 15 && s.z === -8)).toBe(true)
    expect(npc.mesh.position.x).not.toBe(90)
  })

  it('legacy/terminal dead stays dead without corpse teleport from postDeath coords', async () => {
    const sampleHeight = vi.fn((x: number, _z: number) => 2 + x)
    const state = createNpcAuthoritativeState('npc-terminal-0b', 0)
    state.health.dead = true
    state.health.currentHp = 0
    state.postDeath = createLegacyTerminalNpcPostDeath()
    const npc = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-terminal-0b',
      npcState: state,
    })
    expect(npc.health.dead).toBe(true)
    // Terminal corpse is not active — constructor keeps home placement + die(true).
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBe(0)
    expect(npc.mesh.position.y).toBe(2)
  })
})

describe('npc-064 Stage 0B — detailed checkpoint serialize/reify', () => {
  it('round-trips accompany intent, travel XZ, provisions and cargo through registry restore', async () => {
    const registry = createNpcStateRegistry()
    const state = registry.getOrCreate('npc-checkpoint-0b', 0)
    const sampleHeight = (x: number, z: number) => 1 + 0.05 * x + 0.01 * z
    const live = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-checkpoint-0b',
      npcState: state,
    })

    live.mesh.position.set(22, sampleHeight(22, 9), 9)
    live.mesh.rotation.y = 0.4
    expect(live.startAccompany({ kind: 'voluntary' }, 'follow')).toBe(true)
    live.personalInventory.add('bread', 4)
    const skin = fillLiquidContainer(createLiquidContainerInstance('waterskin_small'), 'water')!
    live.personalInventory.addInstance(skin)
    live.transportCargo.add('carrot', 2)

    live.syncAccompanyTravelCheckpoint()
    expect(internals(live).npcState.travel?.lastPosition).toEqual({ x: 22, z: 9 })
    expect(internals(live).npcState.travel?.execution).toBeUndefined()

    const snapshot = registry.serialize()
    const restoredRegistry = createNpcStateRegistry(snapshot)
    const restoredState = restoredRegistry.getOrCreate('npc-checkpoint-0b', 0)
    expect(restoredState.accompanyCommitment?.mode).toBe('follow')
    expect(restoredState.travel?.lastPosition).toEqual({ x: 22, z: 9 })
    expect(restoredState.travel?.execution).toBeUndefined()
    expect(restoredState.personalInventory.count('bread')).toBe(4)
    expect(restoredState.transportCargo.count('carrot')).toBe(2)

    const rebuilt = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-checkpoint-0b',
      npcState: restoredState,
    })
    expect(rebuilt.id).toBe('npc-checkpoint-0b')
    expect(rebuilt.mesh.position.x).toBe(22)
    expect(rebuilt.mesh.position.z).toBe(9)
    expect(rebuilt.mesh.position.y).toBe(sampleHeight(22, 9))
    expect(rebuilt.mesh.position.x).not.toBe(0)
    expect(internals(rebuilt).npcState.accompanyCommitment?.mode).toBe('follow')
    expect(rebuilt.personalInventory.count('bread')).toBe(4)
    expect(rebuilt.transportCargo.count('carrot')).toBe(2)
  })

  it('ordinary resident snapshot has no travel pose and no universal position field', async () => {
    const registry = createNpcStateRegistry()
    const state = registry.getOrCreate('npc-resident-0b', 0)
    const npc = await createLifecycleNpc({ npcId: 'npc-resident-0b', npcState: state })
    npc.mesh.position.set(11, 0, 5)
    const snap = registry.serialize()['npc-resident-0b']
    expect(snap).toBeDefined()
    expect(snap!.travel ?? null).toBeNull()
    expect(snap!.accompanyCommitment ?? null).toBeNull()
    expect(Object.keys(snap!)).not.toContain('position')
    expect(Object.keys(snap!)).not.toContain('x')
    expect(Object.keys(snap!)).not.toContain('z')
    expect(Object.keys(snap!)).not.toContain('yaw')
  })
})

describe('npc-064 Stage 0B — detailed → offscreen → reification', () => {
  it('handoff stamps live position, one executor, no double survival catch-up', async () => {
    const registry = createNpcStateRegistry()
    const state = registry.getOrCreate('npc-handoff-0b', 0)
    const npc = await createLifecycleNpc({ npcId: 'npc-handoff-0b', npcState: state })
    internals(npc).worldNowDays = 1
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    npc.personalInventory.add('bread', 6)
    const waterskin = fillLiquidContainer(createLiquidContainerInstance('waterskin_medium'), 'water')!
    npc.personalInventory.addInstance(waterskin)

    internals(npc).npcState.travel = {
      destination: { x: 600, z: 0 },
      lastPosition: { x: 0, z: 0 },
      purpose: { kind: 'expedition', assignmentId: 'exp-handoff' },
    }
    npc.mesh.position.set(35, 0, 4)

    npc.beginOffscreenTravelHandoff(100, 0, 1, 480)
    const afterHandoff = internals(npc).npcState.travel
    expect(afterHandoff?.lastPosition).toEqual({ x: 35, z: 4 })
    expect(afterHandoff?.execution?.mode).toBe('off-screen')
    expect(afterHandoff?.execution?.departedAtDays).toBe(1)
    const firstArrives = afterHandoff!.execution!.arrivesAtDays
    expect(firstArrives).toBeGreaterThan(1)

    // Second handoff while execution exists must not mint a second clock.
    npc.mesh.position.set(50, 0, 4)
    npc.beginOffscreenTravelHandoff(100, 0, 1.1, 480)
    expect(internals(npc).npcState.travel?.execution?.arrivesAtDays).toBe(firstArrives)
    expect(internals(npc).npcState.travel?.lastPosition).toEqual({ x: 35, z: 4 })

    const breadBefore = npc.personalInventory.count('bread')
    resolveNpcTravelCheckpoint(internals(npc).npcState, 1.05, 480)
    const survivalAfterFirst = internals(npc).npcState.travel?.survivalResolvedAtDays
    expect(survivalAfterFirst).toBeDefined()
    const breadAfterFirst = npc.personalInventory.count('bread')

    resolveNpcTravelCheckpoint(internals(npc).npcState, 1.05, 480)
    expect(internals(npc).npcState.travel?.survivalResolvedAtDays).toBe(survivalAfterFirst)
    expect(npc.personalInventory.count('bread')).toBe(breadAfterFirst)
    expect(breadAfterFirst).toBeLessThanOrEqual(breadBefore)

    const mid = internals(npc).npcState.travel!
    const reified = reifyNpcTravel(mid, 1.05)
    expect(reified.execution).toBeUndefined()
    expect(reified.lastPosition.x).toBeGreaterThan(35)
    expect(reified.lastPosition.x).toBeLessThan(600)

    const seed = createNpcAuthoritativeState('npc-handoff-rebuilt', 0)
    seed.travel = reified
    seed.personalInventory.add('bread', breadAfterFirst)
    const rebuiltFromReify = await createLifecycleNpc({
      npcId: 'npc-handoff-rebuilt',
      npcState: seed,
    })
    expect(rebuiltFromReify.mesh.position.x).toBe(reified.lastPosition.x)
    expect(rebuiltFromReify.mesh.position.z).toBe(reified.lastPosition.z)
    expect(internals(rebuiltFromReify).npcState.travel?.purpose).toEqual({
      kind: 'expedition',
      assignmentId: 'exp-handoff',
    })
    expect(internals(rebuiltFromReify).npcState.travel?.execution).toBeUndefined()
    void registry
  })

  it('detailed checkpoint stamp does not invent offscreen execution', async () => {
    const npc = await createLifecycleNpc({ npcId: 'npc-detailed-stamp-0b' })
    internals(npc).npcState.travel = stampNpcTravelCheckpoint(
      {
        destination: { x: 80, z: 0 },
        lastPosition: { x: 0, z: 0 },
        purpose: { kind: 'transport', orderId: 'order-0b' },
      },
      { x: 12, z: 3 },
      { x: 80, z: 0 },
    )
    npc.mesh.position.set(18, 0, 3)
    npc.syncAccompanyTravelCheckpoint()
    expect(internals(npc).npcState.travel?.lastPosition).toEqual({ x: 18, z: 3 })
    expect(internals(npc).npcState.travel?.execution).toBeUndefined()
    expect(internals(npc).npcState.travel?.purpose).toEqual({ kind: 'transport', orderId: 'order-0b' })
  })
})

describe('npc-064 Stage 0B — SettlementsManager wiring probe', () => {
  it('source order: snapshot sync before serialize; unload handoff before dispose', () => {
    const src = managerSource()
    // Implementation body (not the SettlementsManager type alias).
    const snapshotIdx = src.indexOf('snapshotNpcStates: () => {')
    expect(snapshotIdx).toBeGreaterThan(-1)
    const snapshotBody = src.slice(snapshotIdx, snapshotIdx + 400)
    const syncIdx = snapshotBody.indexOf('syncAccompanyTravelCheckpoint')
    const serializeIdx = snapshotBody.indexOf('npcStates.serialize()')
    expect(syncIdx).toBeGreaterThan(-1)
    expect(serializeIdx).toBeGreaterThan(-1)
    expect(syncIdx).toBeLessThan(serializeIdx)

    const unloadIdx = src.indexOf('function unload(')
    expect(unloadIdx).toBeGreaterThan(-1)
    const unloadBody = src.slice(unloadIdx, unloadIdx + 700)
    const handoffIdx = unloadBody.indexOf('beginOffscreenTravelHandoff')
    const disposeIdx = unloadBody.indexOf('entry.settlement?.dispose()')
    expect(handoffIdx).toBeGreaterThan(-1)
    expect(disposeIdx).toBeGreaterThan(-1)
    expect(handoffIdx).toBeLessThan(disposeIdx)
  })

  it('snapshotNpcStates syncs live checkpoint before serialization', async () => {
    const registry = createNpcStateRegistry()
    const state = registry.getOrCreate('npc-mgr-snap-0b', 0)
    const npc = await createLifecycleNpc({ npcId: 'npc-mgr-snap-0b', npcState: state })
    expect(npc.startAccompany({ kind: 'voluntary' }, 'follow')).toBe(true)
    // Stale checkpoint origin, then live movement without an explicit sync.
    internals(npc).npcState.travel = stampNpcTravelCheckpoint(
      internals(npc).npcState.travel,
      { x: 1, z: 1 },
      { x: 50, z: 50 },
    )
    npc.mesh.position.set(27, 0, 14)

    // Serialize without sync would keep the stale lastPosition.
    expect(registry.serialize()['npc-mgr-snap-0b']?.travel?.lastPosition).toEqual({ x: 1, z: 1 })

    const probe = createManagerWiringProbe({ npcs: [npc], npcStates: registry })
    const serialized = probe.snapshotNpcStates()
    expect(serialized['npc-mgr-snap-0b']?.travel?.lastPosition).toEqual({ x: 27, z: 14 })
    expect(serialized['npc-mgr-snap-0b']?.travel?.execution).toBeUndefined()
  })

  it('stream-out unload invokes handoff before dispose with live from-position', async () => {
    const registry = createNpcStateRegistry()
    const state = registry.getOrCreate('npc-mgr-unload-0b', 0)
    const npc = await createLifecycleNpc({ npcId: 'npc-mgr-unload-0b', npcState: state })
    expect(npc.startAccompany({ kind: 'voluntary' }, 'follow')).toBe(true)
    npc.mesh.position.set(44, 0, -3)

    const probe = createManagerWiringProbe({ npcs: [npc], npcStates: registry })
    const handoffSpy = vi.spyOn(npc, 'beginOffscreenTravelHandoff')
    const order: string[] = []
    handoffSpy.mockImplementation(function (this: NpcAgent, ...args) {
      order.push('handoff')
      return NpcAgent.prototype.beginOffscreenTravelHandoff.apply(this, args)
    })
    probe.settlement.dispose.mockImplementation(() => {
      order.push('dispose')
    })

    probe.unload(2, 480, 100, 0)
    expect(order).toEqual(['handoff', 'dispose'])
    expect(handoffSpy).toHaveBeenCalledWith(100, 0, 2, 480)
    expect(internals(npc).npcState.travel?.lastPosition).toEqual({ x: 44, z: -3 })
    expect(internals(npc).npcState.travel?.execution?.mode).toBe('off-screen')
  })
})

describe('npc-064 Stage 0B — loaded time-skip spatial placement', () => {
  it('surface schedule placement moves a non-traveller to the schedule target', async () => {
    const sampleHeight = (x: number, _z: number) => 4 + 0.1 * x
    const npc = await createLifecycleNpc({ sampleHeight, npcId: 'npc-skip-surface-0b' })
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    internals(npc).needs.woodDuty = 0
    internals(npc).needs.waterDuty = 0
    npc.mesh.position.set(40, sampleHeight(40, 40), 40)

    // Guard: hour 8 = sleep → home. Start 7:00, skip 2h → end ~9:00 sleep.
    npc.resolveTimeSkip(7 / 24, 2, 480)
    expect(npc.getScheduledActivity(9 / 24)).toBe('sleep')
    expect(npc.mesh.position.x).toBe(0)
    expect(npc.mesh.position.z).toBe(0)
    expect(npc.mesh.position.y).toBe(sampleHeight(0, 0))
    expect(internals(npc).pendingAction).toBeNull()
  })

  it('committed travel progresses without home reset and clears in-flight action', async () => {
    const sampleHeight = (x: number, _z: number) => 2 + 0.01 * x
    const npc = await createLifecycleNpc({ sampleHeight, npcId: 'npc-skip-travel-0b' })
    internals(npc).worldNowDays = 0
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    npc.personalInventory.add('bread', 8)
    const waterskin = fillLiquidContainer(createLiquidContainerInstance('waterskin_medium'), 'water')!
    npc.personalInventory.addInstance(waterskin)
    internals(npc).npcState.travel = beginOffscreenNpcTravel(
      { x: 10, z: 0 },
      { x: 500, z: 0 },
      0,
      480,
      {
        destination: { x: 500, z: 0 },
        lastPosition: { x: 10, z: 0 },
        purpose: { kind: 'expedition', assignmentId: 'exp-skip-0b' },
      },
    )
    npc.mesh.position.set(10, sampleHeight(10, 0), 0)
    internals(npc).startAction({
      kind: 'eat',
      destination: vec3(2, 0, 2),
      durationSec: 1,
      onComplete: () => {},
    })

    npc.resolveTimeSkip(18 / 24, 8, 480)
    expect(internals(npc).npcState.travel?.purpose).toEqual({
      kind: 'expedition',
      assignmentId: 'exp-skip-0b',
    })
    expect(internals(npc).npcState.travel?.execution).toBeUndefined()
    expect(npc.mesh.position.x).toBeGreaterThan(10)
    expect(npc.mesh.position.x).toBeLessThan(500)
    expect(npc.mesh.position.y).toBe(sampleHeight(npc.mesh.position.x, npc.mesh.position.z))
    expect(internals(npc).pendingAction).toBeNull()
    expect(internals(npc).phase).not.toBe('goTo')
  })

  it('cave/mouth-crossing committed travel holds cave-valid position', async () => {
    const sampleHeight = vi.fn((_x?: number, _z?: number) => 99)
    const npc = await createLifecycleNpc({
      sampleHeight,
      npcWorldMovement: diskCaveQueries(),
      npcId: 'npc-skip-cave-0b',
    })
    internals(npc).worldNowDays = 0
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    npc.personalInventory.add('bread', 8)
    const waterskin = fillLiquidContainer(createLiquidContainerInstance('waterskin_medium'), 'water')!
    npc.personalInventory.addInstance(waterskin)
    internals(npc).npcState.travel = beginOffscreenNpcTravel(
      { x: 1, z: 1 },
      { x: 400, z: 0 },
      0,
      480,
      {
        destination: { x: 400, z: 0 },
        lastPosition: { x: 1, z: 1 },
        purpose: { kind: 'expedition', assignmentId: 'exp-cave-0b' },
      },
    )
    npc.mesh.position.set(1, CAVE_FLOOR, 1)
    internals(npc).routeExecution = { legIndex: 0, mouthPhase: 'crossing' }

    npc.resolveTimeSkip(18 / 24, 8, 480)
    expect(npc.mesh.position.x).toBe(1)
    expect(npc.mesh.position.z).toBe(1)
    expect(npc.mesh.position.y).toBe(CAVE_FLOOR)
    expect(npc.mesh.position.x).not.toBe(400)
    // Hold path must not project via surface sampleHeight for placement.
    expect(sampleHeight).not.toHaveBeenCalledWith(400, 0)
  })
})

describe('npc-064 Stage 0B — death during travel', () => {
  it('blocks purpose-backed travel at live pose and reconstructs active corpse there', async () => {
    const sampleHeight = (_x: number, z: number) => 6 + 0.01 * z
    const npc = await createLifecycleNpc({ sampleHeight, npcId: 'npc-death-travel-0b' })
    internals(npc).npcState.travel = {
      destination: { x: 300, z: 0 },
      lastPosition: { x: 0, z: 0 },
      purpose: { kind: 'expedition', assignmentId: 'exp-death-0b' },
    }
    npc.mesh.position.set(55, sampleHeight(55, 8), 8)
    npc.mesh.rotation.y = -0.75

    npc.takeDamage(10_000)
    expect(npc.health.dead).toBe(true)
    expect(internals(npc).npcState.travel?.blocked).toBe(true)
    expect(internals(npc).npcState.travel?.lastPosition).toEqual({ x: 55, z: 8 })
    expect(internals(npc).npcState.travel?.purpose).toEqual({
      kind: 'expedition',
      assignmentId: 'exp-death-0b',
    })
    expect(internals(npc).npcState.postDeath?.status).toBe('active')
    expect(internals(npc).npcState.postDeath?.x).toBe(55)
    expect(internals(npc).npcState.postDeath?.z).toBe(8)
    expect(internals(npc).npcState.postDeath?.yaw).toBe(-0.75)

    const rebuilt = await createLifecycleNpc({
      sampleHeight,
      npcId: 'npc-death-travel-0b',
      npcState: internals(npc).npcState,
    })
    expect(rebuilt.health.dead).toBe(true)
    expect(rebuilt.mesh.position.x).toBe(55)
    expect(rebuilt.mesh.position.z).toBe(8)
    expect(rebuilt.mesh.position.y).toBe(sampleHeight(55, 8))
    expect(rebuilt.mesh.rotation.y).toBe(-0.75)
  })
})
