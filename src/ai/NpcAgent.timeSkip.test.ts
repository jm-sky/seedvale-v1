// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'
import type { CombatIntent } from '../combat/combatIntent'
import type { NpcResidentAnchors } from '../settlement/npcResidentAnchors'
import type { Place } from '../settlement/places'
import type { SettlementLandmarks } from '../settlement/props'
import type { ActionLifecycle } from '../simulation/types'
import type { NeedState } from './Needs'
import type { NpcPlannedAction } from './npcAction'
import { createLiquidContainerInstance, fillLiquidContainer } from '../items/liquidContainer'
import { createHousehold } from '../settlement/household'
import { proceduralResidentAnchorsFromLandmarks, residentAnchorsForHome } from '../settlement/npcResidentAnchors'
import { type NpcAuthoritativeState } from '../settlement/npcState'
import { createInteractionQueue } from '../simulation/interactionQueue'
import { vec3 } from '../simulation/types'
import { NpcAgent } from './NpcAgent'
import { beginOffscreenNpcTravel } from './npcTravel'

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
  return {
    id: 's1:home:0',
    type: 'home',
    position: new THREE.Vector3(0, 0, 0),
  }
}

function socialPlace(): Place {
  return {
    id: 's1:social',
    type: 'social',
    position: new THREE.Vector3(4, 0, 4),
  }
}

function makeResidentAnchors(home: THREE.Vector3): NpcResidentAnchors {
  const landmarks = makeLandmarks()
  return residentAnchorsForHome(proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well'), home, landmarks)
}

type NpcInternals = {
  pendingAction: NpcPlannedAction | null
  phase: string
  combatIntent: CombatIntent | null
  actionLifecycle: ActionLifecycle
  activeQueueId: string | null
  conversationPartnerId: string | null
  needs: NeedState
  npcState: NpcAuthoritativeState
  worldNowDays: number
  startAction: (action: NpcPlannedAction) => void
}

function internals(npc: NpcAgent): NpcInternals {
  return npc as unknown as NpcInternals
}

async function createTestNpc(overrides: {
  household?: ReturnType<typeof createHousehold>
  queues?: Map<string, ReturnType<typeof createInteractionQueue>>
  npcId?: string
  npcState?: NpcAuthoritativeState
} = {}): Promise<NpcAgent> {
  return NpcAgent.create({
    sampleHeight: () => 0,
    waterLevel: -1,
    collidersNear: () => [],
    residentAnchors: makeResidentAnchors(homePlace().position),
    home: homePlace(),
    workplace: null,
    socialPlace: socialPlace(),
    treeIndex: 0,
    needOffset: 0,
    member: {
      name: 'Jan',
      lastName: 'Test',
      relation: 'single',
      scale: 1,
      age: 40,
      character: {
        name: 'Jan',
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
    npcId: overrides.npcId ?? 'npc-skip-1',
    household: overrides.household,
    queues: overrides.queues,
    npcState: overrides.npcState,
  })
}

function dummyCombatTarget(): CombatIntent['target'] {
  return {
    ref: { id: 'wolf-1', kind: 'animal' },
    getPosition: () => ({ x: 3, z: 0 }),
    isAlive: () => true,
    applyDamage: () => {},
  }
}

describe('NpcAgent.resolveTimeSkip (plan npc-058)', () => {
  it('cannot relieve hunger without decrementing a real food source', async () => {
    const household = createHousehold('hh-food', 's1', 'home:0', {
      water: 3,
      items: { counts: { bread: 2 }, instances: [] },
      agriculture: { starterSeedsGranted: true },
    })
    const npc = await createTestNpc({ household })
    internals(npc).needs.hunger = 0.95
    internals(npc).needs.thirst = 0
    internals(npc).needs.woodDuty = 0
    internals(npc).needs.waterDuty = 0
    npc.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(household.items.count('bread')).toBe(1)
    expect(internals(npc).needs.hunger).toBeLessThan(0.95)
  })

  it('leaves hunger unsatisfied when household food is empty', async () => {
    const household = createHousehold('hh-empty', 's1', 'home:0', {
      water: 3,
      items: { counts: {}, instances: [] },
      agriculture: { starterSeedsGranted: true },
    })
    const npc = await createTestNpc({ household })
    internals(npc).needs.hunger = 0.95
    internals(npc).needs.thirst = 0
    internals(npc).needs.woodDuty = 0
    internals(npc).needs.waterDuty = 0
    npc.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(household.foodCount()).toBe(0)
    expect(internals(npc).needs.hunger).toBeGreaterThan(0.9)
  })

  it('relieves thirst only when household water is removed', async () => {
    const household = createHousehold('hh-water', 's1', 'home:0', {
      water: 3,
      items: { counts: {}, instances: [] },
      agriculture: { starterSeedsGranted: true },
    })
    const npc = await createTestNpc({ household })
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0.95
    internals(npc).needs.woodDuty = 0
    internals(npc).needs.waterDuty = 0
    npc.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(household.water.current).toBe(2)
    expect(internals(npc).needs.thirst).toBeLessThan(0.95)
  })

  it('does not mint waterDuty water during skip', async () => {
    const household = createHousehold('hh-duty', 's1', 'home:0', {
      water: 1,
      items: { counts: {}, instances: [] },
      agriculture: { starterSeedsGranted: true },
    })
    const npc = await createTestNpc({ household })
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    internals(npc).needs.woodDuty = 0
    internals(npc).needs.waterDuty = 0.95
    npc.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(household.water.current).toBe(1)
    expect(internals(npc).needs.waterDuty).toBeGreaterThan(0.9)
  })

  it('clears queued action, conversation reservation and lifecycle', async () => {
    const queue = createInteractionQueue('s1:well', {
      anchor: vec3(1, 0, 1),
      lineDir: { x: 0, z: 1 },
      servingOffset: 0.8,
      spacing: 1.2,
      maxVisibleSlots: 4,
      servingCapacity: 1,
    })
    const queues = new Map([[queue.id, queue]])
    const queued = await createTestNpc({ queues, npcId: 'npc-skip-1' })
    queue.join('npc-skip-1')
    internals(queued).startAction({
      kind: 'drink',
      destination: vec3(1, 0, 1),
      durationSec: 1.2,
      queueId: queue.id,
      onComplete: () => {},
    })
    expect(queue.isMember('npc-skip-1')).toBe(true)
    expect(internals(queued).pendingAction?.kind).toBe('drink')
    expect(internals(queued).actionLifecycle.status).toBe('active')
    queued.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(queue.isMember('npc-skip-1')).toBe(false)
    expect(internals(queued).pendingAction).toBeNull()
    expect(internals(queued).activeQueueId).toBeNull()
    expect(internals(queued).actionLifecycle.status).toBe('failed')
    expect(internals(queued).phase).not.toBe('goTo')

    const talking = await createTestNpc({ npcId: 'npc-skip-talk' })
    const onEarlyExit = vi.fn()
    talking.beginConversation('partner-1', 2, () => {}, onEarlyExit)
    expect(internals(talking).conversationPartnerId).toBe('partner-1')
    talking.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(internals(talking).conversationPartnerId).toBeNull()
    expect(onEarlyExit).toHaveBeenCalledTimes(1)
    expect(internals(talking).pendingAction).toBeNull()
  })

  it('cancels combat through the combat owner', async () => {
    const npc = await createTestNpc()
    expect(npc.beginCombat({ target: dummyCombatTarget(), mode: 'melee' })).toBe(true)
    expect(internals(npc).phase).toBe('combat')
    expect(internals(npc).combatIntent).not.toBeNull()
    npc.resolveTimeSkip(18 / 24, 0.5, 480)
    expect(internals(npc).combatIntent).toBeNull()
    expect(internals(npc).phase).not.toBe('combat')
    expect(internals(npc).actionLifecycle.status).toBe('cancelled')
  })

  it('advances committed travel once without dropping the commitment', async () => {
    const npc = await createTestNpc({ npcId: 'npc-travel-1' })
    internals(npc).worldNowDays = 0
    internals(npc).needs.hunger = 0
    internals(npc).needs.thirst = 0
    npc.personalInventory.add('bread', 8)
    const waterskin = fillLiquidContainer(createLiquidContainerInstance('waterskin_medium'), 'water')!
    npc.personalInventory.addInstance(waterskin)
    internals(npc).npcState.travel = beginOffscreenNpcTravel(
      { x: 0, z: 0 },
      { x: 800, z: 0 },
      0,
      480,
      {
        destination: { x: 800, z: 0 },
        lastPosition: { x: 0, z: 0 },
        purpose: { kind: 'expedition', assignmentId: 'exp-1' },
      },
    )
    internals(npc).startAction({
      kind: 'eat',
      destination: vec3(2, 0, 2),
      durationSec: 1,
      onComplete: () => {},
    })
    const travel = internals(npc).npcState.travel
    expect(travel?.execution?.arrivesAtDays).toBeGreaterThan(0)
    npc.resolveTimeSkip(18 / 24, 8, 480)
    expect(internals(npc).npcState.travel?.purpose).toEqual({ kind: 'expedition', assignmentId: 'exp-1' })
    expect(internals(npc).npcState.travel?.execution).toBeUndefined()
    expect(internals(npc).npcState.travel?.blocked).not.toBe(true)
    expect(npc.mesh.position.x).toBeGreaterThan(0)
    expect(npc.mesh.position.x).toBeLessThan(800)
    expect(internals(npc).pendingAction).toBeNull()
    const xAfterFirst = npc.mesh.position.x
    npc.resolveTimeSkip(18 / 24, 8, 480)
    expect(npc.mesh.position.x).toBeGreaterThan(xAfterFirst)
    expect(internals(npc).npcState.travel?.purpose).toEqual({ kind: 'expedition', assignmentId: 'exp-1' })
    expect(internals(npc).npcState.travel?.blocked).not.toBe(true)
  })
})
