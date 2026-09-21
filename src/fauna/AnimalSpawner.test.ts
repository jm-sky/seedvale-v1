import { describe, expect, it } from 'vitest'
import {
  canUseDepletedNaturalRecovery,
  DEPLETED_NATURAL_RECOVERY_DAYS,
  DEPLETED_RECOLONIZATION_DAYS,
  depletedRecoveryIntervalDays,
  depletionThreshold,
  EMPTY_HABITAT_RESPAWN_MULTIPLIER,
  MIN_RECOVERY_POPULATION,
  type PreySpawner,
  RECOVERY_DAYS,
  respawnIntervalDaysFor,
  restoreSpawnPointState,
  shouldDeplete,
  snapshotSpawnPointState,
  tickSpawnPointRecovery,
  updateDepletedSpawnerRecovery,
  updateSpawners,
} from './AnimalSpawner'

function spawner(overrides: Partial<PreySpawner> = {}): PreySpawner {
  return {
    id: 'settlement-a:cave',
    x: 0,
    z: 0,
    type: 'rockDen',
    kind: 'deer',
    respawnIntervalDays: 1,
    maxPreyCount: 3,
    daysSinceLastRespawn: 0,
    state: 'active',
    deathsThisCycle: 0,
    disabledAtDay: null,
    pressure: 0,
    humanTaste: false,
    canRecover: true,
    lastSettlementTripOpportunityDay: null,
    depletedRecoveryDays: 0,
    ...overrides,
  }
}

function bound(kind: PreySpawner['kind'], spawnPointId: string) {
  return { kind, spawnPointId }
}

function respawnCounter() {
  let respawned = 0
  return {
    tick: () => {
      respawned++
      return true
    },
    get count() {
      return respawned
    },
  }
}

describe('depletionThreshold / shouldDeplete', () => {
  it('is the smallest integer strictly greater than half the limit', () => {
    expect(depletionThreshold(2)).toBe(2)
    expect(depletionThreshold(3)).toBe(2)
    expect(depletionThreshold(4)).toBe(3)
    expect(depletionThreshold(6)).toBe(4)
  })

  it('does not deplete below the threshold, does at/above it', () => {
    expect(shouldDeplete(1, 3)).toBe(false)
    expect(shouldDeplete(2, 3)).toBe(true)
    expect(shouldDeplete(3, 3)).toBe(true)
  })
})

describe('respawnIntervalDaysFor', () => {
  it('doubles the wait when the habitat is empty', () => {
    expect(respawnIntervalDaysFor(1, 0)).toBe(EMPTY_HABITAT_RESPAWN_MULTIPLIER)
    expect(respawnIntervalDaysFor(1, 1)).toBe(1)
    expect(respawnIntervalDaysFor(2, 0)).toBe(4)
  })
})

describe('updateSpawners', () => {
  it('does not spawn on a zero dayDelta (load / first frame)', () => {
    const s = spawner({ daysSinceLastRespawn: 10 })
    const counter = respawnCounter()
    updateSpawners([s], 0, [], counter.tick)
    expect(counter.count).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(10)
  })

  it('waits the empty-habitat interval before the first animal', () => {
    const s = spawner()
    const counter = respawnCounter()
    updateSpawners([s], 1, [], counter.tick)
    expect(counter.count).toBe(0)
    updateSpawners([s], 1, [], counter.tick)
    expect(counter.count).toBe(1)
  })

  it('replaces a loss after one interval when the habitat is not empty', () => {
    const s = spawner()
    const counter = respawnCounter()
    updateSpawners([s], 1, [bound('deer', s.id)], counter.tick)
    expect(counter.count).toBe(1)
  })

  it('catch-up on a large dayDelta fills up to the cap, not beyond', () => {
    const s = spawner({ maxPreyCount: 3 })
    const counter = respawnCounter()
    // empty: 2 + 1 + 1 = 4 days for 3 animals; 5 days still caps at 3
    updateSpawners([s], 5, [], counter.tick)
    expect(counter.count).toBe(3)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('does not bank time while at the bound live cap', () => {
    const s = spawner({ maxPreyCount: 1 })
    const counter = respawnCounter()
    updateSpawners([s], 10, [bound('deer', s.id)], counter.tick)
    expect(counter.count).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('never respawns a depleted/disabled/recovering spawner', () => {
    for (const state of ['depleted', 'disabled', 'recovering'] as const) {
      const s = spawner({ state, daysSinceLastRespawn: 100 })
      const counter = respawnCounter()
      updateSpawners([s], 10, [], counter.tick)
      expect(counter.count).toBe(0)
    }
  })

  it('skips Infinity intervals (wolfDen)', () => {
    const s = spawner({ respawnIntervalDays: Infinity, daysSinceLastRespawn: 100 })
    const counter = respawnCounter()
    updateSpawners([s], 10, [], counter.tick)
    expect(counter.count).toBe(0)
  })

  it('caps by same-kind animals regardless of prey/predator role', () => {
    const s = spawner({ kind: 'wolf', maxPreyCount: 1 })
    const counter = respawnCounter()
    updateSpawners([s], 10, [bound('wolf', s.id)], counter.tick)
    expect(counter.count).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('ignores other kinds when counting the live cap', () => {
    const s = spawner({ kind: 'wolf', maxPreyCount: 1 })
    const counter = respawnCounter()
    updateSpawners([s], 2, [bound('deer', s.id)], counter.tick)
    expect(counter.count).toBe(1)
  })

  it('reduces ordinary capacity by reserved persistent slots (plan fauna-018)', () => {
    const s = spawner({ maxPreyCount: 3 })
    const reserved = new Map([[s.id, 1]])
    const counter = respawnCounter()
    // empty: 2 + 1 = 3 days for 2 ordinary animals; 5 days still caps at 2
    updateSpawners([s], 5, [], counter.tick, reserved)
    expect(counter.count).toBe(2)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('does not treat an away/corpse/tombstone persistent slot as a vacancy', () => {
    const s = spawner({ maxPreyCount: 1 })
    const reserved = new Map([[s.id, 1]])
    const counter = respawnCounter()
    updateSpawners([s], 10, [], counter.tick, reserved)
    expect(counter.count).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('still replenishes remaining ordinary slots', () => {
    const s = spawner({ maxPreyCount: 3 })
    const reserved = new Map([[s.id, 1]])
    const counter = respawnCounter()
    updateSpawners([s], 1, [bound('deer', s.id)], counter.tick, reserved)
    expect(counter.count).toBe(1)
  })

  it('counts bound animals regardless of distance from the spawner (plan fauna-041)', () => {
    const s = spawner({ maxPreyCount: 1 })
    const counter = respawnCounter()
    updateSpawners([s], 10, [bound('deer', s.id)], counter.tick)
    expect(counter.count).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('isolates occupancy per spawner for same-kind habitats (plan fauna-041)', () => {
    const a = spawner({ id: 'settlement-a:thicket', maxPreyCount: 1 })
    const b = spawner({ id: 'settlement-b:thicket', maxPreyCount: 1 })
    const counter = respawnCounter()
    updateSpawners([a, b], 2, [bound('deer', a.id), bound('deer', b.id)], counter.tick)
    expect(counter.count).toBe(0)
  })

  it('opens one ordinary slot when a bound member is removed (plan fauna-041)', () => {
    const s = spawner({ maxPreyCount: 2 })
    const counter = respawnCounter()
    updateSpawners([s], 1, [bound('deer', s.id)], counter.tick)
    expect(counter.count).toBe(1)
  })

  it('does not double-count persistent reservation plus bound ordinary (plan fauna-041)', () => {
    const s = spawner({ maxPreyCount: 2 })
    const reserved = new Map([[s.id, 1]])
    const counter = respawnCounter()
    updateSpawners([s], 2, [bound('deer', s.id)], counter.tick, reserved)
    expect(counter.count).toBe(0)
  })

  it('does not treat a failed onRespawn as occupancy or burn catch-up (plan fauna-041)', () => {
    const s = spawner({ maxPreyCount: 3, daysSinceLastRespawn: 10 })
    let attempts = 0
    updateSpawners([s], 10, [], () => {
      attempts++
      return false
    })
    expect(attempts).toBe(1)
    expect(s.daysSinceLastRespawn).toBe(18)
  })

  it('retries a failed spawn on a later eligible pass (plan fauna-041)', () => {
    const s = spawner({ maxPreyCount: 1, daysSinceLastRespawn: 10 })
    let failOnce = true
    let respawned = 0
    updateSpawners([s], 10, [], () => {
      if (failOnce) {
        failOnce = false
        return false
      }
      respawned++
      return true
    })
    expect(respawned).toBe(0)
    updateSpawners([s], 2, [], () => {
      respawned++
      return true
    })
    expect(respawned).toBe(1)
  })

  it('does not query occupancy when dayDelta is 0', () => {
    const s = spawner({ daysSinceLastRespawn: 10 })
    let queries = 0
    updateSpawners([s], 0, () => { queries++; return 0 }, () => false)
    expect(queries).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(10)
  })

  it('does not query occupancy for depleted or Infinity-interval spawners', () => {
    let queries = 0
    updateSpawners(
      [
        spawner({ state: 'depleted', daysSinceLastRespawn: 100 }),
        spawner({ id: 'den', type: 'wolfDen', respawnIntervalDays: Infinity, daysSinceLastRespawn: 100 }),
      ],
      10,
      () => { queries++; return 0 },
      () => false,
    )
    expect(queries).toBe(0)
  })

  it('queries occupancy before materializing a respawn, so the sensing pass can finish first', () => {
    const events: string[] = []
    const s = spawner({ daysSinceLastRespawn: 10, maxPreyCount: 1 })
    updateSpawners(
      [s],
      1,
      () => {
        events.push('occupancy')
        return 0
      },
      () => {
        events.push('respawn')
        return true
      },
    )
    expect(events).toEqual(['occupancy', 'respawn'])
  })
})

describe('depletedRecoveryIntervalDays', () => {
  it('uses the longer recolonization delay when the habitat is empty', () => {
    expect(depletedRecoveryIntervalDays(0)).toBe(DEPLETED_RECOLONIZATION_DAYS)
    expect(depletedRecoveryIntervalDays(1)).toBe(DEPLETED_NATURAL_RECOVERY_DAYS)
  })
})

describe('canUseDepletedNaturalRecovery', () => {
  it('excludes disabled/recovering, Infinity intervals, and canRecover: false', () => {
    expect(canUseDepletedNaturalRecovery(spawner({ state: 'depleted' }))).toBe(true)
    expect(canUseDepletedNaturalRecovery(spawner({ state: 'active' }))).toBe(false)
    expect(canUseDepletedNaturalRecovery(spawner({ state: 'disabled' }))).toBe(false)
    expect(canUseDepletedNaturalRecovery(spawner({
      state: 'depleted',
      type: 'wolfDen',
      respawnIntervalDays: Infinity,
    }))).toBe(false)
    expect(canUseDepletedNaturalRecovery(spawner({ state: 'depleted', canRecover: false }))).toBe(false)
  })

  it('excludes habitats whose ordinary capacity cannot reach MIN_RECOVERY_POPULATION', () => {
    expect(canUseDepletedNaturalRecovery(spawner({ state: 'depleted', maxPreyCount: 1 }))).toBe(false)
    const reserved = new Map([['settlement-a:cave', 1]])
    expect(canUseDepletedNaturalRecovery(
      spawner({ state: 'depleted', maxPreyCount: 2 }),
      reserved,
    )).toBe(false)
  })
})

describe('updateDepletedSpawnerRecovery (plan fauna-047)', () => {
  it('does not recover before the interval elapses when one survivor remains', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 4, deathsThisCycle: 3 })
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery(
      [s],
      DEPLETED_NATURAL_RECOVERY_DAYS - 0.01,
      [bound('deer', s.id)],
      counter.tick,
    )
    expect(counter.count).toBe(0)
    expect(s.state).toBe('depleted')
  })

  it('becomes active after a successful recovery spawn reaches MIN_RECOVERY_POPULATION', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 4, deathsThisCycle: 3 })
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery(
      [s],
      DEPLETED_NATURAL_RECOVERY_DAYS,
      [bound('deer', s.id)],
      counter.tick,
    )
    expect(counter.count).toBe(1)
    expect(s.state).toBe('active')
    expect(s.deathsThisCycle).toBe(0)
    expect(s.depletedRecoveryDays).toBe(0)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('waits six days before the first colonizer when empty, then three for the second', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 4, deathsThisCycle: 3 })
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery([s], DEPLETED_RECOLONIZATION_DAYS - 0.01, [], counter.tick)
    expect(counter.count).toBe(0)
    updateDepletedSpawnerRecovery([s], 0.01, [], counter.tick)
    expect(counter.count).toBe(1)
    expect(s.state).toBe('depleted')
    updateDepletedSpawnerRecovery(
      [s],
      DEPLETED_NATURAL_RECOVERY_DAYS - 0.01,
      [bound('deer', s.id)],
      counter.tick,
    )
    expect(counter.count).toBe(1)
    updateDepletedSpawnerRecovery(
      [s],
      0.01,
      [bound('deer', s.id)],
      counter.tick,
    )
    expect(counter.count).toBe(2)
    expect(s.state).toBe('active')
  })

  it('catch-up on a large dayDelta does not exceed MIN_RECOVERY_POPULATION or ordinary cap', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 4, deathsThisCycle: 3 })
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery([s], 100, [], counter.tick)
    expect(counter.count).toBe(2)
    expect(s.state).toBe('active')
  })

  it('does not consume recovery time when materialization fails', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 4, deathsThisCycle: 3 })
    let attempts = 0
    updateDepletedSpawnerRecovery([s], DEPLETED_NATURAL_RECOVERY_DAYS, [bound('deer', s.id)], () => {
      attempts++
      return false
    })
    expect(attempts).toBe(1)
    expect(s.depletedRecoveryDays).toBe(DEPLETED_NATURAL_RECOVERY_DAYS)
    let respawned = 0
    updateDepletedSpawnerRecovery([s], 0.01, [bound('deer', s.id)], () => {
      respawned++
      return true
    })
    expect(respawned).toBe(1)
    expect(s.state).toBe('active')
  })

  it('isolates recovery per spawner for same-kind habitats', () => {
    const a = spawner({ id: 'settlement-a:thicket', state: 'depleted', maxPreyCount: 4 })
    const b = spawner({ id: 'settlement-b:thicket', state: 'depleted', maxPreyCount: 4 })
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery(
      [a, b],
      DEPLETED_NATURAL_RECOVERY_DAYS,
      [bound('deer', a.id)],
      counter.tick,
    )
    expect(counter.count).toBe(1)
    expect(a.state).toBe('active')
    expect(b.state).toBe('depleted')
  })

  it('respects reserved persistent slots during recovery', () => {
    const s = spawner({ state: 'depleted', maxPreyCount: 3, deathsThisCycle: 2 })
    const reserved = new Map([[s.id, 2]])
    const counter = respawnCounter()
    updateDepletedSpawnerRecovery([s], 100, [], counter.tick, reserved)
    expect(counter.count).toBe(0)
    expect(s.state).toBe('depleted')
  })

  it('does not run for disabled or recovering spawners', () => {
    for (const state of ['disabled', 'recovering'] as const) {
      const s = spawner({ state, depletedRecoveryDays: 10 })
      const counter = respawnCounter()
      updateDepletedSpawnerRecovery([s], 100, [], counter.tick)
      expect(counter.count).toBe(0)
      expect(s.depletedRecoveryDays).toBe(10)
    }
  })
})

describe('cap-4 deer thicket depletion (plan fauna-047)', () => {
  it('stays active after two deaths and depletes after three', () => {
    const cap = 4
    const s = spawner({ type: 'thicket', maxPreyCount: cap })
    s.deathsThisCycle = 2
    expect(shouldDeplete(s.deathsThisCycle, cap)).toBe(false)
    s.deathsThisCycle = 3
    expect(shouldDeplete(s.deathsThisCycle, cap)).toBe(true)
  })

  it('supports three hunter kills: active through two deaths, depleted only on the third', () => {
    const s = spawner({ type: 'thicket', maxPreyCount: 4, state: 'active' })
    s.deathsThisCycle = 1
    expect(shouldDeplete(s.deathsThisCycle, s.maxPreyCount)).toBe(false)
    s.deathsThisCycle = 2
    expect(shouldDeplete(s.deathsThisCycle, s.maxPreyCount)).toBe(false)
    s.deathsThisCycle = 3
    if (shouldDeplete(s.deathsThisCycle, s.maxPreyCount)) s.state = 'depleted'
    expect(s.state).toBe('depleted')
  })
})

describe('tickSpawnPointRecovery', () => {
  it('stays disabled before RECOVERY_DAYS elapse, even with enough nearby population', () => {
    const s = spawner({ state: 'disabled', disabledAtDay: 10 })
    tickSpawnPointRecovery(s, 10 + RECOVERY_DAYS - 1, MIN_RECOVERY_POPULATION)
    expect(s.state).toBe('disabled')
  })

  it('moves to recovering once RECOVERY_DAYS elapse but population is short', () => {
    const s = spawner({ state: 'disabled', disabledAtDay: 10 })
    tickSpawnPointRecovery(s, 10 + RECOVERY_DAYS, MIN_RECOVERY_POPULATION - 1)
    expect(s.state).toBe('recovering')
  })

  it('becomes active and resets cycle counters once population is sufficient', () => {
    const s = spawner({ state: 'recovering', disabledAtDay: 10, deathsThisCycle: 2 })
    tickSpawnPointRecovery(s, 10 + RECOVERY_DAYS, MIN_RECOVERY_POPULATION)
    expect(s.state).toBe('active')
    expect(s.deathsThisCycle).toBe(0)
    expect(s.disabledAtDay).toBeNull()
  })

  it('never recovers when canRecover is false', () => {
    const s = spawner({ state: 'disabled', disabledAtDay: 0, canRecover: false })
    tickSpawnPointRecovery(s, 1_000_000, 99)
    expect(s.state).toBe('disabled')
  })

  it('is a no-op for active/depleted spawners', () => {
    const active = spawner({ state: 'active' })
    tickSpawnPointRecovery(active, 1_000_000, 99)
    expect(active.state).toBe('active')

    const depleted = spawner({ state: 'depleted', deathsThisCycle: 2 })
    tickSpawnPointRecovery(depleted, 1_000_000, 99)
    expect(depleted.state).toBe('depleted')
  })

  it('still requires nearby same-kind population, not spawnPointId binding (plan fauna-041)', () => {
    const s = spawner({ state: 'recovering', disabledAtDay: 0 })
    tickSpawnPointRecovery(s, RECOVERY_DAYS, MIN_RECOVERY_POPULATION - 1)
    expect(s.state).toBe('recovering')
    tickSpawnPointRecovery(s, RECOVERY_DAYS, MIN_RECOVERY_POPULATION)
    expect(s.state).toBe('active')
  })
})

describe('snapshotSpawnPointState / restoreSpawnPointState (persistence follow-up)', () => {
  it('snapshots only the minimal lifecycle fields', () => {
    const s = spawner({ state: 'disabled', deathsThisCycle: 2, disabledAtDay: 12.5 })
    expect(snapshotSpawnPointState(s)).toEqual({
      state: 'disabled',
      deathsThisCycle: 2,
      disabledAtDay: 12.5,
      pressure: 0,
      humanTaste: false,
      canRecover: true,
      lastSettlementTripOpportunityDay: null,
      depletedRecoveryDays: 0,
    })
  })

  it('is a no-op when nothing was saved for this spawn point', () => {
    const s = spawner({ state: 'active', deathsThisCycle: 0, disabledAtDay: null })
    restoreSpawnPointState(s, undefined)
    expect(s.state).toBe('active')
    expect(s.deathsThisCycle).toBe(0)
    expect(s.disabledAtDay).toBeNull()
  })

  it('round-trips active/depleted/disabled/recovering through snapshot + restore', () => {
    for (const state of ['active', 'depleted', 'disabled', 'recovering'] as const) {
      const original = spawner({
        state,
        deathsThisCycle: 2,
        disabledAtDay: state === 'active' ? null : 5,
        depletedRecoveryDays: state === 'depleted' ? 2.5 : 0,
      })
      const saved = snapshotSpawnPointState(original)
      // Fresh spawner as `createFauna()` would construct it on rebuild — always
      // starts `active`/0/null before the saved snapshot is applied.
      const restored = spawner({ state: 'active', deathsThisCycle: 0, disabledAtDay: null })
      restoreSpawnPointState(restored, saved)
      expect(restored.state).toBe(state)
      expect(restored.deathsThisCycle).toBe(2)
      expect(restored.disabledAtDay).toBe(state === 'active' ? null : 5)
      expect(restored.depletedRecoveryDays).toBe(state === 'depleted' ? 2.5 : 0)
    }
  })

  it('defaults depletedRecoveryDays to 0 for older saves without the field', () => {
    const restored = spawner()
    restoreSpawnPointState(restored, {
      state: 'depleted',
      deathsThisCycle: 1,
      disabledAtDay: null,
    })
    expect(restored.depletedRecoveryDays).toBe(0)
  })
})
