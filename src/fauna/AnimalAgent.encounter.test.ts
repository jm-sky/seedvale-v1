// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { AnimalAgent, type NearbyNpcCandidate } from './AnimalAgent'
import { ANIMAL_DEFS } from './animalDefs'

/** fauna-051 §B — aggressor identity, deterministic keyed rolls, transient reset. */

function makeWolf(animalId: string): AnimalAgent {
  return new AnimalAgent({
    def: ANIMAL_DEFS.wolf,
    animalId,
    sampleHeight: () => 0,
    waterLevel: -10,
    sampleLocalWater: () => DRY_WATER_SAMPLE,
    collidersNear: () => [],
    x: 0,
    z: 0,
  })
}

function tick(wolf: AnimalAgent, nearbyNpcs: readonly NearbyNpcCandidate[]): void {
  wolf.update({
    dt: 0.1,
    others: [wolf],
    observerPos: new THREE.Vector3(1000, 0, 1000), // player far away: only NPCs are threats
    dayFactor: 1,
    forestFactor: 0,
    litFires: [],
    nearbyNpcs,
  })
}

const near: NearbyNpcCandidate = { id: 'npc-bystander', x: 2, z: 0 }
const far: NearbyNpcCandidate = { id: 'npc-attacker', x: 8, z: 0 }

type Internals = { npcIntentCommitment: { aggressionRoll: number }, encounterOrdinal: number }
const internals = (a: AnimalAgent) => a as unknown as Internals

describe('aggressor identity (fauna-051 §B1)', () => {
  it('without attribution a wolf locks the nearest NPC', () => {
    const wolf = makeWolf('wolf-1')
    tick(wolf, [near, far])
    expect(wolf.npcAttackTarget?.npcId).toBe('npc-bystander')
  })

  it('a provoking NPC hit makes the wolf lock that attacker, not the nearer bystander', () => {
    const wolf = makeWolf('wolf-1')
    wolf.takeDamage(1, 'npc', 'npc-attacker')
    tick(wolf, [near, far])
    expect(wolf.npcAttackTarget?.npcId).toBe('npc-attacker')
  })

  it('the attacker overrides an already-locked bystander', () => {
    const wolf = makeWolf('wolf-1')
    tick(wolf, [near, far])
    expect(wolf.npcAttackTarget?.npcId).toBe('npc-bystander')
    wolf.takeDamage(1, 'npc', 'npc-attacker')
    tick(wolf, [near, far])
    expect(wolf.npcAttackTarget?.npcId).toBe('npc-attacker')
  })

  it('a dead/unloaded attacker (absent from nearbyNpcs) falls back to the normal pick', () => {
    const wolf = makeWolf('wolf-1')
    wolf.takeDamage(1, 'npc', 'npc-attacker')
    tick(wolf, [near, far])
    tick(wolf, [near])
    expect(wolf.npcAttackTarget?.npcId).toBe('npc-bystander')
  })
})

describe('keyed deterministic aggression roll (fauna-051 §B3)', () => {
  function rollsFor(id: string): number[] {
    const wolf = makeWolf(id)
    const rolls: number[] = []
    tick(wolf, [near])
    rolls.push(internals(wolf).npcIntentCommitment.aggressionRoll)
    wolf.takeDamage(1, 'npc', near.id) // provocation -> reroll with the next ordinal
    tick(wolf, [near])
    rolls.push(internals(wolf).npcIntentCommitment.aggressionRoll)
    return rolls
  }

  it('same animal id + target + event order yields identical rolls', () => {
    expect(rollsFor('wolf-A')).toEqual(rollsFor('wolf-A'))
  })

  it('the provocation reroll uses the next ordinal and the animal id is part of the key', () => {
    const [first, second] = rollsFor('wolf-A')
    expect(second).not.toBe(first)
    expect(rollsFor('wolf-B')).not.toEqual([first, second])
    for (const r of [first, second]) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(1)
    }
  })

  it('does not redraw while the encounter continues without provocation', () => {
    const wolf = makeWolf('wolf-A')
    tick(wolf, [near])
    const first = internals(wolf).npcIntentCommitment.aggressionRoll
    const ordinal = internals(wolf).encounterOrdinal
    tick(wolf, [near])
    tick(wolf, [near])
    expect(internals(wolf).encounterOrdinal).toBe(ordinal)
    expect(internals(wolf).npcIntentCommitment.aggressionRoll).toBe(first)
  })

  it('hydrate() resets the transient encounter state (ordinal, aggressor, lock) deterministically', () => {
    const [first] = rollsFor('wolf-A')
    const wolf = makeWolf('wolf-A')
    wolf.takeDamage(1, 'npc', 'npc-attacker')
    tick(wolf, [near, far])
    expect(internals(wolf).encounterOrdinal).toBeGreaterThan(0)
    wolf.hydrate(wolf.snapshot())
    expect(internals(wolf).encounterOrdinal).toBe(0)
    expect(wolf.npcAttackTarget).toBeNull()
    tick(wolf, [near])
    expect(internals(wolf).npcIntentCommitment.aggressionRoll).toBe(first)
  })
})
