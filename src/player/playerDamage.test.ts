import { describe, expect, it } from 'vitest'
import type { PlayerController } from './PlayerController'
import { composeLocalResistance, type Resistance } from '../combat/damageTypes'
import { HIT_LOCATIONS, type HumanProtection } from '../combat/hitLocation'
import { type HumanHitResult, type PhysicalHit } from '../combat/incomingHumanHit'
import { fallPhysicalHit, trapPhysicalHit } from '../combat/physicalHits'
import { createHealthState } from '../shared/HealthState'
import { applyDownedRecovery, applyPlayerDamage, tickPlayerStarvationDamage } from './playerDamage'
import { createPlayerNeeds, hungerSevereDurationSec } from './PlayerNeeds'

type MockPlayer = PlayerController & { ordinal: () => number, lastHit: () => HumanHitResult | null, setDowned: (v: boolean) => void }

/** Narrow test double for the slice of `PlayerController` `applyPlayerDamage`
 *  actually reads/mutates — a real instance needs a THREE scene/rig this
 *  module doesn't otherwise depend on. */
function createMockPlayer(hp = 100, startOrdinal = 0): MockPlayer {
  let downed = false
  let attempt = startOrdinal
  let lastHit: HumanHitResult | null = null
  const health = createHealthState(hp)
  const injuryRecovery: { health: typeof health, physicalInjury: number, injuryRecoveryUpdatedAtDays?: number } = {
    health,
    physicalInjury: 0,
  }
  return {
    isDowned: () => downed,
    health,
    injuryRecovery,
    get physicalInjury() { return injuryRecovery.physicalInjury },
    registerPhysicalDamage: (actualHpLoss: number, nowDays: number) => {
      if (actualHpLoss <= 0) return
      injuryRecovery.physicalInjury += actualHpLoss
      injuryRecovery.injuryRecoveryUpdatedAtDays = nowDays
    },
    mesh: { position: { x: 0, y: 0, z: 0 } },
    nextIncomingPhysicalHitOrdinal: () => ++attempt,
    recordIncomingHit: (result: HumanHitResult) => { lastHit = result },
    enterDowned: () => { downed = true },
    skills: { defense: { xp: 0, value: 0 } },
    ordinal: () => attempt,
    lastHit: () => lastHit,
    setDowned: (value: boolean) => { downed = value },
  } as unknown as MockPlayer
}

const NONE: Resistance = { cut: 0, pierce: 0, blunt: 0 }
function protectionAt(location: (typeof HIT_LOCATIONS)[number], resist: Resistance): HumanProtection {
  return Object.fromEntries(HIT_LOCATIONS.map((l) => [l, l === location ? resist : NONE])) as HumanProtection
}
const NAKED = protectionAt('body', NONE)

function hit(amount: number, damageType: PhysicalHit['damageType'], overrides: Partial<PhysicalHit> = {}): PhysicalHit {
  return { amount, damageType, source: 'fauna', attackerId: 'animal:1', profile: 'reference', blockable: true, ...overrides }
}

function strike(player: PlayerController, physical: PhysicalHit, protection: HumanProtection, extra: { heldTool?: 'long_sword' | null, attackerX?: number, attackerZ?: number } = {}) {
  return applyPlayerDamage({
    player,
    nowDays: 3,
    damage: {
      kind: 'physical',
      hit: physical,
      protection,
      heldTool: extra.heldTool ?? null,
      defenseSkillValue: 0,
      playerYaw: 0,
      attackerX: extra.attackerX,
      attackerZ: extra.attackerZ,
    },
  })
}

describe('applyPlayerDamage — proposal §4.2 fixtures through the real wrapper', () => {
  it('20 cut at leather body .35 deals 13 HP; uncovered head deals 20', () => {
    const leather = protectionAt('body', { cut: 0.35, pierce: 0.1, blunt: 0.05 })
    const covered = createMockPlayer()
    const r = strike(covered, hit(20, 'cut', { forcedLocation: 'body' }), leather)
    expect(r.finalDamage).toBeCloseTo(13, 10)
    expect(covered.health.currentHp).toBeCloseTo(87, 10)
    expect(r.hit?.location).toBe('body')
    const uncovered = createMockPlayer()
    expect(strike(uncovered, hit(20, 'cut', { forcedLocation: 'head' }), leather).finalDamage).toBe(20)
  })

  it('20 pierce at mail .45 + padding .10 deals 9.9; 20 blunt at .15 + .25 deals 12.75', () => {
    const pierce = protectionAt('body', composeLocalResistance({ cut: 0, pierce: 0.1, blunt: 0 }, { cut: 0, pierce: 0.45, blunt: 0 }))
    expect(strike(createMockPlayer(), hit(20, 'pierce', { forcedLocation: 'body' }), pierce).finalDamage).toBeCloseTo(9.9, 10)
    const blunt = protectionAt('body', composeLocalResistance({ cut: 0, pierce: 0, blunt: 0.25 }, { cut: 0, pierce: 0, blunt: 0.15 }))
    expect(strike(createMockPlayer(), hit(20, 'blunt', { forcedLocation: 'body' }), blunt).finalDamage).toBeCloseTo(12.75, 10)
  })

  it('block rolls happen before armor and a full block reserves the ordinal, has no location and no armor credit', () => {
    const protection = protectionAt('body', { cut: 0.5, pierce: 0.5, blunt: 0.5 })
    let found: { r: ReturnType<typeof strike>, ordinal: number } | null = null
    for (let start = 0; start < 400 && !found; start++) {
      const player = createMockPlayer(100, start)
      const r = strike(player, hit(20, 'cut'), protection, { heldTool: 'long_sword', attackerX: 0, attackerZ: -2 })
      if (r.defenseOutcome === 'full') found = { r, ordinal: player.ordinal() }
    }
    expect(found).not.toBeNull()
    expect(found!.r.finalDamage).toBe(0)
    expect(found!.r.hit?.location).toBeNull()
    expect(found!.r.hit?.armorPrevented).toBe(0)
    expect(found!.ordinal).toBeGreaterThan(0)
  })

  it('a partial block is followed by typed armor on the remaining damage', () => {
    const protection = protectionAt('body', { cut: 0.5, pierce: 0.5, blunt: 0.5 })
    let partial: ReturnType<typeof strike> | null = null
    for (let start = 0; start < 400 && !partial; start++) {
      const r = strike(createMockPlayer(100, start), hit(20, 'cut', { forcedLocation: 'body' }), protection, { heldTool: 'long_sword', attackerX: 0, attackerZ: -2 })
      if (r.defenseOutcome === 'partial') partial = r
    }
    expect(partial).not.toBeNull()
    expect(partial!.hit!.postDefenseDamage).toBeLessThan(20)
    expect(partial!.finalDamage).toBeCloseTo(partial!.hit!.postDefenseDamage * 0.5, 10)
  })

  it('exposes the committed result transiently through the player seam and in the return value', () => {
    const player = createMockPlayer()
    const r = strike(player, hit(10, 'pierce', { forcedLocation: 'legs' }), NAKED)
    expect(player.lastHit()).toBe(r.hit)
    expect(r.hit).toMatchObject({ location: 'legs', rawDamage: 10, finalDamage: 10, armorPrevented: 0, damageType: 'pierce' })
  })
})

describe('applyPlayerDamage — ordinal reservation', () => {
  it('reserves exactly one ordinal per accepted positive contact', () => {
    const player = createMockPlayer()
    strike(player, hit(5, 'cut'), NAKED)
    strike(player, hit(5, 'cut'), NAKED)
    expect(player.ordinal()).toBe(2)
  })

  it.each([0, -3, Number.NaN, Number.POSITIVE_INFINITY])('never reserves an ordinal for invalid amount %s', (amount) => {
    const player = createMockPlayer()
    const r = strike(player, hit(amount, 'cut'), NAKED)
    expect(r).toMatchObject({ finalDamage: 0, hit: null, enteredDowned: false })
    expect(player.ordinal()).toBe(0)
    expect(player.health.currentHp).toBe(100)
    expect(player.lastHit()).toBeNull()
  })

  it('never reserves an ordinal for a dead or downed player', () => {
    const downed = createMockPlayer()
    downed.setDowned(true)
    expect(strike(downed, hit(5, 'cut'), NAKED).hit).toBeNull()
    expect(downed.ordinal()).toBe(0)
    const dead = createMockPlayer()
    dead.health.dead = true
    expect(strike(dead, hit(5, 'cut'), NAKED).hit).toBeNull()
    expect(dead.ordinal()).toBe(0)
  })

  it('the same durable ordinal yields the same location and damage (restore parity)', () => {
    const protection = protectionAt('legs', { cut: 0.4, pierce: 0.4, blunt: 0.4 })
    const a = strike(createMockPlayer(100, 41), hit(20, 'cut'), protection)
    const b = strike(createMockPlayer(100, 41), hit(20, 'cut'), protection)
    expect(a.hit).toEqual(b.hit)
  })
})

describe('applyPlayerDamage — unblockable environmental sources', () => {
  const guarded = { heldTool: 'long_sword' as const, attackerX: 0, attackerZ: -2 }
  it('trap blade is forced to hands, cut, never blocked and keyed by the container id', () => {
    const protection = protectionAt('hands', { cut: 0.5, pierce: 0, blunt: 0 })
    for (let start = 0; start < 60; start++) {
      const player = createMockPlayer(100, start)
      const r = strike(player, trapPhysicalHit(10, 'chest:7'), protection, guarded)
      expect(r.defenseOutcome).toBe('none')
      expect(r.hit).toMatchObject({ location: 'hands', damageType: 'cut', finalDamage: 5 })
    }
  })

  it('mount fall is blunt, unblockable and armor-reduced at the sampled location', () => {
    const protection = Object.fromEntries(HIT_LOCATIONS.map((l) => [l, { cut: 0, pierce: 0, blunt: 0.5 }])) as HumanProtection
    for (let start = 0; start < 60; start++) {
      const r = strike(createMockPlayer(100, start), fallPhysicalHit(10, 'animal:9'), protection, guarded)
      expect(r.defenseOutcome).toBe('none')
      expect(r.hit!.location).toMatch(/^(head|body|legs)$/)
      expect(r.finalDamage).toBe(5)
    }
  })
})

describe('applyPlayerDamage — injuries and effects', () => {
  it('registers actual HP loss (after armor) as physical injury, once', () => {
    const player = createMockPlayer()
    strike(player, hit(20, 'cut', { forcedLocation: 'body' }), protectionAt('body', { cut: 0.5, pierce: 0, blunt: 0 }))
    expect(player.health.currentHp).toBe(90)
    expect(player.physicalInjury).toBe(10)
  })

  it('overkill cannot add more physical injury than the HP lost', () => {
    const player = createMockPlayer(8)
    const r = strike(player, hit(50, 'cut'), NAKED)
    expect(r.enteredDowned).toBe(true)
    expect(player.physicalInjury).toBe(8)
  })

  it('calls onCombatHit once when HP is lost and not for a fully absorbed contact', () => {
    let calls = 0
    const player = createMockPlayer()
    applyPlayerDamage({
      player,
      damage: { kind: 'physical', hit: hit(5, 'cut'), protection: NAKED, heldTool: null, defenseSkillValue: 0, playerYaw: 0, onCombatHit: () => { calls += 1 } },
    })
    expect(calls).toBe(1)
  })
})

describe('tickPlayerStarvationDamage — non-physical bypass (plan items-player-029)', () => {
  it('applies the full drain with no ordinal, no location, no injury', () => {
    const player = createMockPlayer()
    const needs = createPlayerNeeds()
    const dayLengthSec = 600
    needs.starvationDuration = hungerSevereDurationSec(dayLengthSec) + 1
    tickPlayerStarvationDamage(player, needs, 1, dayLengthSec, undefined, 5)
    expect(player.health.currentHp).toBeLessThan(100)
    expect(player.physicalInjury).toBe(0)
    expect(player.ordinal()).toBe(0)
    expect(player.lastHit()).toBeNull()
  })

  it('direct nonphysical damage returns no hit result and never consumes an ordinal', () => {
    const player = createMockPlayer()
    const r = applyPlayerDamage({ player, damage: { kind: 'nonphysical', amount: 7 } })
    expect(r).toMatchObject({ finalDamage: 7, hit: null })
    expect(player.ordinal()).toBe(0)
  })
})

describe('applyDownedRecovery', () => {
  it('clamps injury after generic downed recovery', () => {
    const player = createMockPlayer()
    player.health.currentHp = 0
    player.injuryRecovery.physicalInjury = 100
    applyDownedRecovery(player.health, player.injuryRecovery)
    expect(player.physicalInjury).toBe(player.health.maxHp - player.health.currentHp)
  })
})
