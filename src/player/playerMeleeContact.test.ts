import { describe, expect, it } from 'vitest'
import type { MeleeConfig } from '../items/itemCatalog'
import { COMBAT_TARGET_RANGE } from '../app/interactables'
import { MELEE_AGILITY_NEUTRAL } from '../combat/meleeAgility'
import { ITEM_CATALOG } from '../items/itemCatalog'
import { createStaminaState } from '../shared/StaminaState'
import { createVigorState } from '../shared/VigorState'
import {
  createPlayerMelee,
  MAX_LUNGE_DISTANCE,
  type MeleeHitCandidate,
  pickCombatTarget,
  resolveMeleeHits,
  yawToward,
} from './playerMelee'

/**
 * Contact-contract regressions (plan items-player-067 §A3/§A4). They model the
 * `gameLoop.ts` seam: `requestAttack` -> (collision-resolved) `gapClose` ->
 * `attackYaw` lock -> wind-up -> `resolveMeleeHits` at the `hitReady` edge
 * against candidates read at impact. Lunge behaviour itself is frozen; nothing
 * here changes it.
 */
const DAY_LENGTH_SEC = 600
const KNIFE = ITEM_CATALOG.knife.melee!
const SPEAR = ITEM_CATALOG.spear.melee!

type Point = { x: number, z: number }

/** Runs one attack from the origin toward `target0` (acquired at request time).
 *  `lungeScale` (0..1) simulates a collision-resolved lunge that only
 *  achieves part of the requested displacement. `targetAtImpact` is where the
 *  target stands when the hit window opens. */
function simulateAttack(
  config: MeleeConfig,
  target0: Point,
  targetAtImpact: Point,
  lungeScale = 1,
) {
  const melee = createPlayerMelee()
  const result = melee.requestAttack(
    config,
    createStaminaState(100),
    createVigorState(100),
    DAY_LENGTH_SEC,
    0,
    0,
    target0.x,
    target0.z,
    MELEE_AGILITY_NEUTRAL,
  )
  const player = { x: result.moveX * lungeScale, z: result.moveZ * lungeScale }
  const yaw = yawToward(player.x, player.z, target0.x, target0.z) ?? 0
  const tick = melee.update(config.windUp + 1e-6)
  const candidates: MeleeHitCandidate[] = [{ id: 'target', ...targetAtImpact, alive: true }]
  const hits = tick.hitReady && tick.config
    ? resolveMeleeHits(player.x, player.z, yaw, tick.config, candidates)
    : []
  return { result, player, yaw, hitReady: tick.hitReady, hits }
}

describe('acquisition 4-7 m + lunge -> impact (plan 067 §A3)', () => {
  it('acquisition range is 7 m and covers every start distance a lunge can bridge', () => {
    expect(COMBAT_TARGET_RANGE).toBe(7)
    expect(KNIFE.range + MAX_LUNGE_DISTANCE).toBeLessThan(COMBAT_TARGET_RANGE)
  })

  it.each([4, 4.4])('stationary target at %s m is hit by the knife after an unobstructed lunge', (d) => {
    const t = { x: 0, z: -d }
    const { hits, hitReady } = simulateAttack(KNIFE, t, t)
    expect(hitReady).toBe(true)
    expect(hits).toEqual(['target'])
  })

  it('every reachable start distance (range < d <= range + lunge - buffer) ends inside legal reach', () => {
    for (const config of [KNIFE, SPEAR, ITEM_CATALOG.long_sword.melee!]) {
      for (let d = config.range + 0.05; d <= config.range + MAX_LUNGE_DISTANCE - 0.1; d += 0.25) {
        const t = { x: 0, z: -d }
        expect(simulateAttack(config, t, t).hits).toEqual(['target'])
      }
    }
  })

  it('stationary target beyond range + lunge (up to 7 m): attack starts and whiffs (accepted, Q-C2 (a))', () => {
    for (const d of [5, 6, 7]) {
      const t = { x: 0, z: -d }
      const { result, hitReady, hits } = simulateAttack(KNIFE, t, t)
      expect(result.started).toBe(true)
      expect(hitReady).toBe(true)
      expect(hits).toEqual([])
    }
  })

  it('pickCombatTarget still acquires targets across the whole 4-7 m band (acquisition unchanged)', () => {
    for (const d of [4, 5, 6, 7]) {
      const c: MeleeHitCandidate[] = [{ id: 'a', x: 0, z: -d, alive: true }]
      expect(pickCombatTarget(c, 0, 0, 0, COMBAT_TARGET_RANGE, 0.5, [])).toBe('a')
    }
  })

  it('collision-resolved (shortened) lunge: nothing hits outside the final reach', () => {
    const t = { x: 0, z: -4 }
    expect(simulateAttack(KNIFE, t, t, 1).hits).toEqual(['target'])
    const blocked = simulateAttack(KNIFE, t, t, 0.5)
    expect(Math.hypot(t.x - blocked.player.x, t.z - blocked.player.z)).toBeGreaterThan(KNIFE.range)
    expect(blocked.hits).toEqual([])
  })

  it('collision slide sideways: yaw is locked from the post-lunge position, so the target stays in arc', () => {
    const melee = createPlayerMelee()
    const target = { x: 0, z: -4 }
    const r = melee.requestAttack(KNIFE, createStaminaState(100), createVigorState(100), DAY_LENGTH_SEC, 0, 0, target.x, target.z, MELEE_AGILITY_NEUTRAL)
    const player = { x: 0.5, z: r.moveZ }
    const yaw = yawToward(player.x, player.z, target.x, target.z)!
    expect(Math.hypot(target.x - player.x, target.z - player.z)).toBeLessThanOrEqual(KNIFE.range)
    expect(resolveMeleeHits(player.x, player.z, yaw, KNIFE, [{ id: 't', ...target, alive: true }])).toEqual(['t'])
    // A live camera yaw turned 90 degrees away would have missed: the lock matters.
    expect(resolveMeleeHits(player.x, player.z, Math.PI / 2, KNIFE, [{ id: 't', ...target, alive: true }])).toEqual([])
  })

  it('moving target that stays within final reach and locked arc is still hit', () => {
    expect(simulateAttack(KNIFE, { x: 0, z: -4 }, { x: 0.2, z: -4 }).hits).toEqual(['target'])
  })

  it('moving target leaving the locked arc during wind-up is not hit (one attack, one yaw)', () => {
    const { player, hits } = simulateAttack(KNIFE, { x: 0, z: -4 }, { x: 1.2, z: -3 })
    expect(Math.hypot(1.2 - player.x, -3 - player.z)).toBeLessThanOrEqual(KNIFE.range)
    expect(hits).toEqual([])
  })

  it('moving target retreating past range during wind-up is not hit', () => {
    expect(simulateAttack(KNIFE, { x: 0, z: -4 }, { x: 0, z: -5 }).hits).toEqual([])
  })
})

describe('hit cardinality and collateral (plan 067 §A4) — current behaviour characterised', () => {
  it('each eligible candidate id is returned exactly once per swing', () => {
    const c: MeleeHitCandidate[] = [
      { id: 'wolf', x: 0, z: -1, alive: true },
      { id: 'sheep', x: 0.2, z: -1.2, alive: true },
    ]
    const hits = resolveMeleeHits(0, 0, 0, KNIFE, c)
    expect(new Set(hits).size).toBe(hits.length)
  })

  it('collateral: an owned livestock/dog candidate in the cone is hit together with the intended target (incl. pierce weapons)', () => {
    const c: MeleeHitCandidate[] = [
      { id: 'wolf', x: 0, z: -1.2, alive: true },
      { id: 'owned-dog', x: 0.25, z: -1.0, alive: true },
    ]
    for (const config of [KNIFE, SPEAR]) {
      expect(resolveMeleeHits(0, 0, 0, config, c).sort()).toEqual(['owned-dog', 'wolf'])
    }
  })

  it('collateral candidates outside range or arc are not hit', () => {
    const c: MeleeHitCandidate[] = [
      { id: 'wolf', x: 0, z: -1.2, alive: true },
      { id: 'sheep-behind', x: 0, z: 1, alive: true },
      { id: 'sheep-far', x: 0, z: -(KNIFE.range + 0.5), alive: true },
    ]
    expect(resolveMeleeHits(0, 0, 0, KNIFE, c)).toEqual(['wolf'])
  })

  it('a dead candidate is never a hit', () => {
    expect(resolveMeleeHits(0, 0, 0, KNIFE, [{ id: 'wolf', x: 0, z: -1, alive: false }])).toEqual([])
  })
})
