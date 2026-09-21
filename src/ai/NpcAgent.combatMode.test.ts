// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import type { CombatIntent } from '../combat/combatIntent'
import type { RangedAttackLifecycle } from '../combat/rangedLifecycle'
import type { NpcMeleeWeapon, NpcRangedWeapon } from './npcCombat'
import { createWeaponInstance } from '../items/weaponMaintenance'
import { proceduralResidentAnchorsFromLandmarks, residentAnchorsForHome } from '../settlement/npcResidentAnchors'
import { NpcAgent } from './NpcAgent'

/**
 * Plan items-player-059 §5/§7/§14 — crossbow reload interruption and the
 * improvised stone throw, exercised through the real private combat tick
 * methods (same "cast to access private state" technique
 * `NpcAgent.timeSkip.test.ts` already uses for `combatIntent`/`phase`) so
 * these regression tests run the actual `tickRangedCombat`/`tickMeleeCombat`/
 * `switchCombatMode` code, not a reimplementation of it.
 */

function makeLandmarks() {
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

async function createCombatTestNpc(npcId: string, role: 'guard' | 'shepherd'): Promise<NpcAgent> {
  const home = { id: 's1:home:0', type: 'home' as const, position: new THREE.Vector3(0, 0, 0) }
  const landmarks = makeLandmarks()
  return NpcAgent.create({
    sampleHeight: () => 0,
    waterLevel: -1,
    collidersNear: () => [],
    residentAnchors: residentAnchorsForHome(proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well'), home.position, landmarks),
    home,
    workplace: null,
    socialPlace: { id: 's1:social', type: 'social', position: new THREE.Vector3(4, 0, 4) },
    treeIndex: 0,
    needOffset: 0,
    member: {
      name: 'Test',
      lastName: 'Npc',
      relation: 'single',
      scale: 1,
      age: 40,
      character: {
        name: 'Test',
        gender: 'male',
        role,
        personality: { openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5 },
        traits: [],
      },
    },
    familyMembers: [],
    modelUrl: '/__missing_npc_model__.glb',
    npcId,
  })
}

function stubTarget(getX: () => number): CombatIntent['target'] {
  return {
    ref: { id: 'threat-1', kind: 'animal' },
    getPosition: () => ({ x: getX(), z: 0 }),
    isAlive: () => true,
    applyDamage: () => {},
  }
}

type CombatInternals = {
  combatIntent: CombatIntent | null
  combatMeleeWeapon: NpcMeleeWeapon | null
  combatRangedWeapon: NpcRangedWeapon | null
  combatRangedAttack: RangedAttackLifecycle
  combatImprovisedThrowUsed: boolean
  tickRangedCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  tickMeleeCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
}

function combatInternals(npc: NpcAgent): CombatInternals {
  return npc as unknown as CombatInternals
}

/** Drives `tickRangedCombat` in small steps until the shared lifecycle
 *  reaches `reload` (or a generous guard is exhausted) — small steps matter:
 *  a single large `dt` can cascade draw→release→recovery→reload→idle in one
 *  `update()` call (see `rangedLifecycle.ts`'s own guarded loop), which would
 *  skip past the exact state this test needs to observe. */
function tickUntilReloading(npc: NpcAgent, targetX: number): void {
  const c = combatInternals(npc)
  for (let i = 0; i < 400 && c.combatRangedAttack.state() !== 'reload'; i++) {
    c.tickRangedCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })
  }
}

describe('NpcAgent crossbow reload interruption (plan items-player-059 §5/§7)', () => {
  it('abandons reload and switches to melee once the target closes inside minReloadDistance', async () => {
    const npc = await createCombatTestNpc('guard-crossbow-switch', 'guard')
    npc.personalInventory.addInstance(createWeaponInstance('long_sword'))
    npc.personalInventory.add('crossbow', 1)
    npc.personalInventory.add('bolt', 6)

    let targetX = 10 // inside crossbow range (18), outside minReloadDistance (4.5)
    const target = stubTarget(() => targetX)
    expect(npc.beginCombat({ target, mode: 'ranged' })).toBe(true)

    tickUntilReloading(npc, targetX)
    const c = combatInternals(npc)
    expect(c.combatRangedAttack.state()).toBe('reload')
    expect(c.combatIntent?.mode).toBe('ranged')

    targetX = 3 // closes inside minReloadDistance
    c.tickRangedCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })

    expect(c.combatIntent?.mode).toBe('melee')
    expect(c.combatMeleeWeapon?.kind).toBe('long_sword')
    // Reload is aborted, not merely paused — no shot manufactured, no ammo spent.
    expect(c.combatRangedAttack.state()).toBe('idle')
  })

  it('keeps reloading through close pressure when no melee weapon is carried', async () => {
    const npc = await createCombatTestNpc('guard-crossbow-nomelee', 'guard')
    npc.personalInventory.add('crossbow', 1)
    npc.personalInventory.add('bolt', 6)
    // Construction always seeds `defaultWeaponForRole('guard')` (`long_sword`,
    // `npcLoadout.ts`) — stripped here so this test can exercise the
    // genuinely-no-melee-weapon branch of the reload-interrupt check.
    for (const instance of npc.personalInventory.getInstances('long_sword')) {
      npc.personalInventory.removeInstance(instance.id)
    }
    expect(npc.personalInventory.holdsAny('long_sword')).toBe(false)

    let targetX = 10
    const target = stubTarget(() => targetX)
    expect(npc.beginCombat({ target, mode: 'ranged' })).toBe(true)

    tickUntilReloading(npc, targetX)
    const c = combatInternals(npc)
    expect(c.combatRangedAttack.state()).toBe('reload')

    targetX = 3
    c.tickRangedCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })

    expect(c.combatIntent?.mode).toBe('ranged')
    expect(c.combatRangedAttack.state()).toBe('reload')
  })
})

describe('NpcAgent improvised stone throw (plan items-player-059 §14)', () => {
  // `farmer` carries no ranged-family loadout roll (unlike guard/shepherd),
  // so its personal inventory here is exactly what the test adds — no risk
  // of a `seedGuardCrossbowLoadout`/`seedShepherdSlingLoadout` roll quietly
  // handing this NPC a real ranged weapon.
  it('throws exactly one stone while closing melee distance with no ranged weapon', async () => {
    const npc = await createCombatTestNpc('farmer-throw', 'shepherd')
    npc.personalInventory.addInstance(createWeaponInstance('spear')) // melee.range === 3, farmer's preferred family
    npc.personalInventory.add('stone', 3)
    const stoneBefore = npc.personalInventory.count('stone')

    const targetX = 5 // outside spear range (3), inside stone throwable.range (6)
    const target = stubTarget(() => targetX)
    expect(npc.beginCombat({ target, mode: 'melee' })).toBe(true)

    const c = combatInternals(npc)
    expect(c.combatMeleeWeapon?.kind).toBe('spear')
    c.tickMeleeCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })
    expect(c.combatImprovisedThrowUsed).toBe(true)
    expect(c.combatRangedAttack.state()).not.toBe('idle')

    for (let i = 0; i < 400 && c.combatRangedAttack.state() !== 'idle'; i++) {
      c.tickMeleeCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })
    }
    expect(npc.personalInventory.count('stone')).toBe(stoneBefore - 1)

    // Still out of melee range, still no ranged weapon — but the one-throw
    // gate must hold: no second throw, no further stone consumption.
    c.tickMeleeCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })
    expect(c.combatRangedAttack.state()).toBe('idle')
    expect(npc.personalInventory.count('stone')).toBe(stoneBefore - 1)
  })

  it('never throws when a real ranged weapon is carried', async () => {
    const npc = await createCombatTestNpc('farmer-sling', 'shepherd')
    npc.personalInventory.addInstance(createWeaponInstance('spear'))
    npc.personalInventory.add('sling', 1)
    npc.personalInventory.add('stone', 3)
    const stoneBefore = npc.personalInventory.count('stone')

    const targetX = 5
    const target = stubTarget(() => targetX)
    // A farmer with a usable sling begins combat in `ranged` mode, not
    // `melee` — this test only needs `tickMeleeCombat` never to trigger a
    // throw for an NPC that does carry a real ranged weapon, so it drives
    // `tickMeleeCombat` directly (with `combatRangedWeapon` set the way
    // `beginCombat`/`switchCombatMode` would) regardless of how combat
    // actually started.
    expect(npc.beginCombat({ target, mode: 'melee' })).toBe(true)
    const c = combatInternals(npc)
    c.combatRangedWeapon = { kind: 'sling', ranged: { damage: 8, range: 11, projectileSpeed: 22, drawTime: 0.4, recovery: 0.35, staminaCost: 4, accuracy: 0.65, skillAccuracyScale: 0, ammoKinds: ['stone'] } }

    c.tickMeleeCombat(0.02, c.combatIntent!, { x: targetX, z: 0 })
    expect(c.combatImprovisedThrowUsed).toBe(false)
    expect(c.combatRangedAttack.state()).toBe('idle')
    expect(npc.personalInventory.count('stone')).toBe(stoneBefore)
  })
})
