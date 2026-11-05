import { describe, expect, it } from 'vitest'
import {
  defaultSpawnPointScenarioFields,
  MIN_RECOVERY_POPULATION,
  type PreySpawner,
  RECOVERY_DAYS,
  type SpawnerType,
  tickSpawnPointRecovery,
  updateDepletedSpawnerRecovery,
  updateSpawners,
} from './AnimalSpawner'
import {
  CarriedSpawnerStore,
  catchUpSpawnerLifecycle,
  isGroupEngaged,
  materializedPopulation,
} from './faunaGroupLifecycle'

function makeSpawner(overrides: Partial<PreySpawner> = {}): PreySpawner {
  const type: SpawnerType = overrides.type ?? 'thicket'
  return {
    id: 'g:thicket',
    x: 0,
    z: 0,
    type,
    kind: 'deer',
    respawnIntervalDays: 2,
    maxPreyCount: 4,
    daysSinceLastRespawn: 0,
    state: 'active',
    deathsThisCycle: 0,
    disabledAtDay: null,
    depletedRecoveryDays: 0,
    ...defaultSpawnPointScenarioFields(type),
    ...overrides,
  }
}

/** Reference: "continuous ticking" with a virtual bound count in small frame-sized steps,
 *  in the same order as `createFauna.update()`. */
function continuousTick(spawner: PreySpawner, bound0: number, startDays: number, endDays: number, frame: number): number {
  let bound = bound0
  const onRespawn = (): boolean => {
    bound++
    return true
  }
  let lastCheckDay = Math.floor(startDays)
  let t = startDays
  while (t < endDays - 1e-9) {
    const step = Math.min(frame, endDays - t)
    t += step
    updateSpawners([spawner], step, () => bound, onRespawn)
    updateDepletedSpawnerRecovery([spawner], step, () => bound, onRespawn)
    if (Math.floor(t) !== lastCheckDay) {
      lastCheckDay = Math.floor(t)
      if (spawner.state === 'disabled' || spawner.state === 'recovering') tickSpawnPointRecovery(spawner, t, bound)
    }
  }
  return bound
}

describe('CarriedSpawnerStore', () => {
  it('snapshot returns the union of live and carried states, live first, carried sorted by id', () => {
    const store = new CarriedSpawnerStore(new Map([
      ['a:thicket', { state: 'depleted', deathsThisCycle: 2, disabledAtDay: null }],
      ['b:thicket', { state: 'disabled', deathsThisCycle: 3, disabledAtDay: 2 }],
    ]))
    const live = makeSpawner({ id: 'home:cave', state: 'depleted', deathsThisCycle: 4 })
    const rows = store.snapshot([live])
    expect(rows.map((r) => r.id)).toEqual(['home:cave', 'a:thicket', 'b:thicket'])
    expect(rows[2]).toMatchObject({ state: 'disabled', disabledAtDay: 2 })
  })

  it('take() removes the entry so a live spawner is never duplicated by a stale carried row', () => {
    const store = new CarriedSpawnerStore(new Map([['g:thicket', { state: 'disabled', deathsThisCycle: 1, disabledAtDay: 0 }]]))
    expect(store.take('g:thicket')?.saved.state).toBe('disabled')
    const rows = store.snapshot([makeSpawner({ state: 'disabled' })])
    expect(rows.filter((r) => r.id === 'g:thicket')).toHaveLength(1)
    expect(store.has('g:thicket')).toBe(false)
  })

  it('carry() keeps runtime data out of the persisted rows', () => {
    const store = new CarriedSpawnerStore()
    store.carry(makeSpawner({ daysSinceLastRespawn: 1.5 }), 3, 10)
    const [row] = store.snapshot([])
    expect(Object.keys(row).sort()).not.toContain('boundCount')
    expect(Object.keys(row)).not.toContain('daysSinceLastRespawn')
    expect(store.take('g:thicket')?.runtime).toEqual({ atDays: 10, boundCount: 3, daysSinceLastRespawn: 1.5 })
  })
})

describe('catchUpSpawnerLifecycle parity with continuous ticking', () => {
  const frame = 0.01
  const cases: { name: string, make: () => PreySpawner, bound: number, from: number, to: number }[] = [
    { name: 'active below cap refills', make: () => makeSpawner(), bound: 1, from: 3, to: 9 },
    { name: 'active at cap stays', make: () => makeSpawner(), bound: 4, from: 0, to: 12 },
    {
      name: 'depleted with survivors recovers to active',
      make: () => makeSpawner({ state: 'depleted', deathsThisCycle: 3 }),
      bound: 1,
      from: 5,
      to: 20,
    },
    {
      name: 'depleted without survivors recolonizes',
      make: () => makeSpawner({ state: 'depleted', deathsThisCycle: 3 }),
      bound: 0,
      from: 5,
      to: 40,
    },
    {
      name: 'disabled becomes recovering then active',
      make: () => makeSpawner({ state: 'disabled', disabledAtDay: 2, deathsThisCycle: 3 }),
      bound: 2,
      from: 2,
      to: 2 + RECOVERY_DAYS + 3,
    },
    {
      name: 'disabled without nearby animals stays recovering',
      make: () => makeSpawner({ state: 'disabled', disabledAtDay: 2, deathsThisCycle: 3 }),
      bound: 0,
      from: 2,
      to: 2 + RECOVERY_DAYS + 10,
    },
  ]
  for (const c of cases) {
    it(c.name, () => {
      const lazy = c.make()
      const lazyBound = catchUpSpawnerLifecycle(
        lazy,
        { atDays: c.from, boundCount: c.bound, daysSinceLastRespawn: 0 },
        c.to,
      )
      const ref = c.make()
      const refBound = continuousTick(ref, c.bound, c.from, c.to, frame)
      expect(lazy.state).toBe(ref.state)
      expect(lazyBound).toBe(refBound)
      expect(lazy.deathsThisCycle).toBe(ref.deathsThisCycle)
      expect(lazy.disabledAtDay).toBe(ref.disabledAtDay)
      // Residual timers may differ by at most one catch-up quantum.
      expect(Math.abs(lazy.daysSinceLastRespawn - ref.daysSinceLastRespawn)).toBeLessThanOrEqual(0.26)
      expect(Math.abs(lazy.depletedRecoveryDays - ref.depletedRecoveryDays)).toBeLessThanOrEqual(0.26)
    })
  }

  it('depleted habitat with survivors really reaches active with the minimum population', () => {
    const s = makeSpawner({ state: 'depleted', deathsThisCycle: 3 })
    const bound = catchUpSpawnerLifecycle(s, { atDays: 0, boundCount: 1, daysSinceLastRespawn: 0 }, 30)
    expect(s.state).toBe('active')
    expect(bound).toBeGreaterThanOrEqual(MIN_RECOVERY_POPULATION)
  })

  it('does nothing for zero elapsed time and ignores a negative one', () => {
    const s = makeSpawner({ state: 'depleted', deathsThisCycle: 3 })
    expect(catchUpSpawnerLifecycle(s, { atDays: 5, boundCount: 1, daysSinceLastRespawn: 0 }, 5)).toBe(1)
    expect(catchUpSpawnerLifecycle(s, { atDays: 5, boundCount: 1, daysSinceLastRespawn: 0 }, 2)).toBe(1)
    expect(s.state).toBe('depleted')
  })

  it('wolfDen (infinite respawn interval) never respawns during catch-up', () => {
    const s = makeSpawner({ type: 'wolfDen', kind: 'wolf', respawnIntervalDays: Infinity, maxPreyCount: 2 })
    expect(catchUpSpawnerLifecycle(s, { atDays: 0, boundCount: 0, daysSinceLastRespawn: 0 }, 50)).toBe(0)
  })
})

describe('materializedPopulation', () => {
  it('uses the full capacity for a fresh/loaded active spawner and none for a non-active one', () => {
    expect(materializedPopulation(makeSpawner(), undefined)).toBe(4)
    expect(materializedPopulation(makeSpawner({ state: 'depleted' }), undefined)).toBe(0)
    expect(materializedPopulation(makeSpawner({ state: 'disabled' }), undefined)).toBe(0)
  })

  it('uses the virtual bound after catch-up, capped at capacity, even for depleted survivors', () => {
    expect(materializedPopulation(makeSpawner({ state: 'depleted' }), 1)).toBe(1)
    expect(materializedPopulation(makeSpawner(), 9)).toBe(4)
  })
})

describe('isGroupEngaged', () => {
  it('ignores dead agents and reports a living engaged one', () => {
    const calm = { isDead: () => false, isEngaged: () => false }
    const deadEngaged = { isDead: () => true, isEngaged: () => true }
    const engaged = { isDead: () => false, isEngaged: () => true }
    expect(isGroupEngaged([calm, deadEngaged])).toBe(false)
    expect(isGroupEngaged([calm, engaged])).toBe(true)
    expect(isGroupEngaged([])).toBe(false)
  })
})
