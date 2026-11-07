import { describe, expect, it } from 'vitest'
import { beginOffscreenNpcTravel, cloneNpcTravel } from '../ai/npcTravel'
import { type OffscreenTravelThreats, resolveNpcTravelCheckpoint } from '../ai/npcTravelCheckpoint'
import { createLiquidContainerInstance, fillLiquidContainer } from '../items/liquidContainer'
import { createNpcAuthoritativeState } from '../settlement/npcState'
import { faunaEventRandom } from './faunaEventRandom'
import {
  ENCOUNTER_MAX_ROUNDS,
  resolveOffscreenTravelEncounter,
  THREAT_STEP_DAYS,
  threatEncounterChance,
  threatStepIndices,
} from './offscreenTravelThreats'

const DAY = 720

describe('threatStepIndices', () => {
  it('visits every step exactly once for any partition of the interval', () => {
    const whole = threatStepIndices(0.013, 3.37)
    for (const cuts of [[0.013, 1, 3.37], [0.013, 0.5, 0.5 + THREAT_STEP_DAYS, 2.99999, 3.37], [0.013, 0.014, 0.015, 3.37]]) {
      const parts = cuts.slice(1).flatMap((to, i) => threatStepIndices(cuts[i], to))
      expect(parts).toEqual(whole)
    }
    expect(whole.length).toBe(Math.floor(3.37 / THREAT_STEP_DAYS) - Math.floor(0.013 / THREAT_STEP_DAYS))
  })

  it('is empty for a non-positive interval and excludes the lower bound', () => {
    expect(threatStepIndices(2, 2)).toEqual([])
    expect(threatStepIndices(3, 2)).toEqual([])
    expect(threatStepIndices(THREAT_STEP_DAYS * 4, THREAT_STEP_DAYS * 5)).toEqual([5])
  })
})

describe('resolveOffscreenTravelEncounter', () => {
  const wolves = [
    { id: 'w1', hp: 50, biteDamage: 12 },
    { id: 'w2', hp: 50, biteDamage: 12 },
  ]

  it('is a pure function of its inputs and the rng stream', () => {
    const run = () =>
      resolveOffscreenTravelEncounter({ hp: 80, meleeDamage: 20, partySize: 1 }, wolves, faunaEventRandom(7, 'threat:npc:1'))
    expect(run()).toEqual(run())
  })

  it('kills a weak party and stops; a strong armed party kills the predators', () => {
    const weak = resolveOffscreenTravelEncounter({ hp: 5, meleeDamage: 1, partySize: 1 }, wolves, () => 0)
    expect(weak.partyDied).toBe(true)
    expect(weak.partyDamage).toBe(5)
    const strong = resolveOffscreenTravelEncounter({ hp: 5000, meleeDamage: 60, partySize: 1 }, wolves, () => 0)
    expect(strong.partyDied).toBe(false)
    expect(strong.predators.every((p) => p.dead)).toBe(true)
  })

  it('disengages after the round cap', () => {
    const out = resolveOffscreenTravelEncounter({ hp: 1e9, meleeDamage: 0.001, partySize: 1 }, wolves, () => 0)
    expect(out.partyDamage).toBeLessThanOrEqual(ENCOUNTER_MAX_ROUNDS * 2 * 12)
    expect(out.predators.every((p) => !p.dead)).toBe(true)
  })

  it('encounter chance scales with danger and is capped', () => {
    expect(threatEncounterChance([0.45])).toBeCloseTo(0.225)
    expect(threatEncounterChance([5, 5])).toBe(0.9)
  })
})

/** Port stub standing on the pure pieces: one fixed predator at the path point. */
function stubPort(calls: { n: number }): OffscreenTravelThreats {
  return {
    resolve(q) {
      calls.n++
      let hp = q.party.hp
      let damage = 0
      for (const k of threatStepIndices(q.fromDays, q.toDays)) {
        const rng = faunaEventRandom(1, `threat:${q.npcId}:${k}`)
        if (rng() >= 0.85) continue
        const out = resolveOffscreenTravelEncounter(
          { hp, meleeDamage: q.party.meleeDamage, partySize: 1 },
          [{ id: 'w', hp: 30, biteDamage: 6 }],
          rng,
        )
        hp -= out.partyDamage
        damage += out.partyDamage
        if (out.partyDied) return { partyDamage: damage, settledAtDays: k * THREAT_STEP_DAYS, diedAtDays: k * THREAT_STEP_DAYS }
      }
      return { partyDamage: damage, settledAtDays: q.toDays }
    },
  }
}

function travellerState(id: string, hp = 100) {
  const state = createNpcAuthoritativeState(id, 0)
  state.health.maxHp = hp
  state.health.currentHp = hp
  state.needs.hunger = 0
  state.needs.thirst = 0
  state.personalInventory.add('bread', 40)
  for (let i = 0; i < 3; i++) {
    state.personalInventory.addInstance(fillLiquidContainer(createLiquidContainerInstance('waterskin_medium'), 'water')!)
  }
  state.travel = beginOffscreenNpcTravel({ x: 0, z: 0 }, { x: 400, z: 0 }, 0, DAY, {
    destination: { x: 400, z: 0 },
    lastPosition: { x: 0, z: 0 },
    purpose: { kind: 'expedition', assignmentId: 'exp:1' },
  })
  return state
}

describe('travel checkpoint threat bubble (fauna-050 C3)', () => {
  it('outcome is deterministic under different checkpoint partitions', () => {
    const arrives = travellerState('npc:a').travel!.execution!.arrivesAtDays
    const run = (cuts: number[]) => {
      const state = travellerState('npc:a', 400)
      const calls = { n: 0 }
      for (const f of cuts) resolveNpcTravelCheckpoint(state, f * arrives, DAY, stubPort(calls))
      return state
    }
    const whole = run([1])
    const split = run([0.13, 0.4, 0.41, 0.77, 1])
    const fine = run(Array.from({ length: 20 }, (_, i) => (i + 1) / 20))
    // Guard: the journey produced real encounters.
    expect(whole.health.maxHp - whole.health.currentHp).toBeGreaterThan(0)
    for (const other of [split, fine]) {
      expect(other.health.dead).toBe(whole.health.dead)
      // Natural injury recovery between checkpoints may heal a little; the unhealed deficit is invariant.
      expect(other.health.maxHp - other.health.currentHp - other.physicalInjury)
        .toBeCloseTo(whole.health.maxHp - whole.health.currentHp - whole.physicalInjury, 6)
      expect(other.travel?.arrival).toBe(whole.travel?.arrival)
    }
  })

  it('a death on the road blocks the journey as cannot-progress at the death point', () => {
    const state = travellerState('npc:weak', 12)
    const arrives = state.travel!.execution!.arrivesAtDays
    const result = resolveNpcTravelCheckpoint(state, arrives, DAY, stubPort({ n: 0 }))
    expect(result.kind).toBe('cannot-progress')
    expect(state.health.dead).toBe(true)
    expect(state.travel?.blocked).toBe(true)
    expect(state.travel?.arrival).toBeUndefined()
    const x = state.travel!.lastPosition.x
    expect(x).toBeGreaterThan(0)
    expect(x).toBeLessThan(400)
    // Later checkpoints stay blocked and never re-resolve.
    const calls = { n: 0 }
    expect(resolveNpcTravelCheckpoint(state, arrives + 5, DAY, stubPort(calls)).kind).toBe('cannot-progress')
    expect(calls.n).toBe(0)
  })

  it('is idempotent through threatResolvedAtDays and survives cloning', () => {
    const state = travellerState('npc:a', 400)
    const calls = { n: 0 }
    const half = state.travel!.execution!.arrivesAtDays / 2
    resolveNpcTravelCheckpoint(state, half, DAY, stubPort(calls))
    expect(calls.n).toBe(1)
    expect(state.travel!.threatResolvedAtDays).toBeCloseTo(half, 9)
    const hp = state.health.currentHp
    resolveNpcTravelCheckpoint(state, half, DAY, stubPort(calls))
    expect(calls.n).toBe(1)
    expect(state.health.currentHp).toBe(hp)
    expect(cloneNpcTravel(state.travel)?.threatResolvedAtDays).toBeCloseTo(half, 9)
  })

  it('does nothing without a port (cursor untouched)', () => {
    const state = travellerState('npc:a')
    resolveNpcTravelCheckpoint(state, state.travel!.execution!.arrivesAtDays / 2, DAY)
    expect(state.travel!.threatResolvedAtDays).toBe(0)
    expect(state.health.currentHp).toBe(state.health.maxHp)
  })
})
