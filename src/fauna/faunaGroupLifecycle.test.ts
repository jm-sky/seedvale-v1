import { describe, expect, it } from 'vitest'
import { defaultSpawnPointScenarioFields, type PreySpawner, type SpawnerType } from './AnimalSpawner'
import {
  CarriedSpawnerStore,
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

  it('carry() persists the respawn timer and the dormant lifecycle cursor (C1.7, C3)', () => {
    const store = new CarriedSpawnerStore()
    store.carry(makeSpawner({ daysSinceLastRespawn: 1.5, nextBirthSeq: 3 }), 10)
    const [row] = store.snapshot([])
    expect(row).toMatchObject({ daysSinceLastRespawn: 1.5, nextBirthSeq: 3, advancedAtDays: 10 })
    expect(store.take('g:thicket')?.saved.advancedAtDays).toBe(10)
  })
})

describe('materializedPopulation', () => {
  it('uses the full capacity for a fresh/loaded active spawner and none for a non-active one', () => {
    expect(materializedPopulation(makeSpawner())).toBe(4)
    expect(materializedPopulation(makeSpawner({ state: 'depleted' }))).toBe(0)
    expect(materializedPopulation(makeSpawner({ state: 'disabled' }))).toBe(0)
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
