// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import type { CombatIntent } from '../combat/combatIntent'
import type { PhysicalHit } from '../combat/incomingHumanHit'
import type { RangedAttackLifecycle } from '../combat/rangedLifecycle'
import type { NpcMeleeWeapon, NpcRangedWeapon } from './npcCombat'
import { ITEM_CATALOG } from '../items/itemCatalog'
import { createWeaponInstance, getSharpnessDamageModifier } from '../items/weaponMaintenance'
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
  combatAttackWeapon: NpcMeleeWeapon | null
  combatImprovisedThrowUsed: boolean
  tickRangedCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  tickMeleeCombat: (dt: number, intent: CombatIntent, targetPos: { x: number, z: number }) => void
  switchCombatMode: (mode: CombatIntent['mode']) => boolean
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

const wolfHit = (amount: number): PhysicalHit => ({ amount, damageType: 'pierce', source: 'fauna', attackerId: 'wolf:1', profile: 'low-bite', blockable: true })

describe('NpcAgent ready-weapon defense (plan npc-067 P2)', () => {
  it('does not block with a carried sword during ranged mode, then uses it after switching to melee', async () => {
    const npc = await createCombatTestNpc('guard-ready-defense', 'guard')
    npc.personalInventory.add('crossbow', 1)
    npc.personalInventory.add('bolt', 2)
    const target = stubTarget(() => 2)
    expect(npc.beginCombat({ target, mode: 'ranged' })).toBe(true)

    const rangedDefense = npc.applyIncomingCombatDamage({ hit: wolfHit(10), attackerX: 0, attackerZ: 2 })
    expect(rangedDefense.attempted).toBe(false)

    const c = combatInternals(npc)
    expect(c.switchCombatMode('melee')).toBe(true)
    const meleeDefense = npc.applyIncomingCombatDamage({ hit: wolfHit(10), attackerX: 0, attackerZ: 2 })
    expect(meleeDefense.attempted).toBe(true)
  })
})

describe('NpcAgent exact-instance melee lifecycle (plan npc-067 P4)', () => {
  it.each([30, 60, 120])('applies one hit and one weapon wear at %i Hz', async (hz) => {
    const npc = await createCombatTestNpc(`npc-wear-${hz}`, 'guard')
    const sword = npc.personalInventory.getInstances('long_sword')[0]!
    const damages: number[] = []
    const target: CombatIntent['target'] = {
      ref: { id: 'wear-target', kind: 'animal' },
      getPosition: () => ({ x: 1, z: 0 }),
      isAlive: () => true,
      applyDamage: (hit) => damages.push(hit.amount),
    }
    expect(npc.beginCombat({ target, mode: 'melee' })).toBe(true)
    const c = combatInternals(npc)
    let secondSwingDamage: number | null = null
    for (let i = 0; i < hz * 5 && secondSwingDamage == null; i++) {
      c.tickMeleeCombat(1 / hz, c.combatIntent!, { x: 1, z: 0 })
      const snapDamage = c.combatAttackWeapon?.melee.damage
      if (damages.length > 0 && snapDamage != null && snapDamage < ITEM_CATALOG.long_sword.melee!.damage) {
        secondSwingDamage = snapDamage
      }
    }
    expect(damages).toHaveLength(1)
    expect(npc.personalInventory.getInstance(sword.id)).toMatchObject({ sharpness: 0.988, durability: 0.9985 })
    expect(secondSwingDamage).toBeCloseTo(ITEM_CATALOG.long_sword.melee!.damage * getSharpnessDamageModifier(0.988))
  })

  it('cancels the swing if its exact weapon instance leaves inventory before impact', async () => {
    const npc = await createCombatTestNpc('npc-weapon-removed', 'guard')
    const sword = npc.personalInventory.getInstances('long_sword')[0]!
    const damages: number[] = []
    const target: CombatIntent['target'] = {
      ref: { id: 'removed-target', kind: 'animal' },
      getPosition: () => ({ x: 1, z: 0 }),
      isAlive: () => true,
      applyDamage: (hit) => damages.push(hit.amount),
    }
    expect(npc.beginCombat({ target, mode: 'melee' })).toBe(true)
    const c = combatInternals(npc)
    c.tickMeleeCombat(0.01, c.combatIntent!, { x: 1, z: 0 }) // start attack and snapshot weapon
    expect(c.combatAttackWeapon?.instanceId).toBe(sword.id)
    npc.personalInventory.removeInstance(sword.id)
    for (let i = 0; i < 120; i++) {
      if (!c.combatIntent) break
      c.tickMeleeCombat(1 / 60, c.combatIntent, { x: 1, z: 0 })
    }
    expect(damages).toEqual([])
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

describe('NpcAgent incoming physical hits (plan items-player-065 S3)', () => {
  it('reserves exactly one durable ordinal per accepted positive contact and none for invalid input', async () => {
    const npc = await createCombatTestNpc('incoming-ordinal', 'guard')
    const ordinal = (): number => (npc as unknown as { npcState: { incomingPhysicalHitOrdinal: number } }).npcState.incomingPhysicalHitOrdinal
    const before = ordinal()
    for (const amount of [0, -4, Number.NaN, Number.POSITIVE_INFINITY]) {
      const inert = npc.applyIncomingCombatDamage({ hit: wolfHit(amount), attackerX: 0, attackerZ: 2 })
      expect(inert).toMatchObject({ finalDamage: 0, location: null, attempted: false })
    }
    expect(ordinal()).toBe(before)
    npc.applyIncomingCombatDamage({ hit: wolfHit(0.01), attackerX: 0, attackerZ: 2 })
    npc.applyIncomingCombatDamage({ hit: wolfHit(0.01), attackerX: 0, attackerZ: 2 })
    expect(ordinal()).toBe(before + 2)
    expect(npc.health.currentHp).toBeGreaterThan(0)
  })

  it('never reserves an ordinal once dead', async () => {
    const npc = await createCombatTestNpc('incoming-dead', 'guard')
    const ordinal = (): number => (npc as unknown as { npcState: { incomingPhysicalHitOrdinal: number } }).npcState.incomingPhysicalHitOrdinal
    npc.takeDamage(npc.health.maxHp * 10)
    const before = ordinal()
    const result = npc.applyIncomingCombatDamage({ hit: wolfHit(5), attackerX: 0, attackerZ: 2 })
    expect(result.finalDamage).toBe(0)
    expect(ordinal()).toBe(before)
  })

  it('a location is sampled for an accepted unblocked contact and HP drops by exactly finalDamage', async () => {
    const npc = await createCombatTestNpc('incoming-location', 'guard')
    const hpBefore = npc.health.currentHp
    const result = npc.applyIncomingCombatDamage({ hit: wolfHit(4), attackerX: 0, attackerZ: -2 })
    expect(result.location).not.toBeNull()
    expect(hpBefore - npc.health.currentHp).toBeCloseTo(result.finalDamage, 10)
  })
})
