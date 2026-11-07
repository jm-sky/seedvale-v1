import { describe, expect, it } from 'vitest'
import { CORPSE_REMOVE_DAYS } from './animalCorpse'
import {
  defaultSpawnPointScenarioFields,
  type PreySpawner,
  RECOVERY_DAYS,
  tickSpawnPointRecovery,
  updateDepletedSpawnerRecovery,
  updateSpawners,
} from './AnimalSpawner'
import { JUVENILE_MATURITY_SECONDS } from './herdCohesion'
import { birthAnimalId, type WildFaunaRecord } from './wildFaunaRecords'
import {
  advanceWildHabitat,
  type AdvanceWildHabitatInput,
  advanceWildRecords,
  freshWildAnimalState,
  OFFSCREEN_NEED_CEILING,
  planWildCreation,
} from './wildHabitatAdvance'

const SEED = 415424794
const DAY_SEC = 720

function makeSpawner(overrides: Partial<PreySpawner> = {}): PreySpawner {
  return {
    id: 'g:thicket',
    x: 0,
    z: 0,
    type: 'thicket',
    kind: 'deer',
    respawnIntervalDays: 2,
    maxPreyCount: 4,
    daysSinceLastRespawn: 0,
    state: 'active',
    deathsThisCycle: 0,
    disabledAtDay: null,
    depletedRecoveryDays: 0,
    ...defaultSpawnPointScenarioFields('thicket'),
    ...overrides,
  }
}

function makeRecord(spawner: PreySpawner, seq: number, over: Partial<WildFaunaRecord> = {}): WildFaunaRecord {
  const state = freshWildAnimalState({ kind: spawner.kind, x: 1, z: 1, yaw: 0, lifeOffset: 0.5 })
  // Durable ids are never reused: the birth cursor is always past every existing record.
  spawner.nextBirthSeq = Math.max(spawner.nextBirthSeq ?? 0, seq + 1)
  return {
    habitatId: spawner.id,
    occupantKey: `b${seq}`,
    animalId: birthAnimalId(spawner.id, seq),
    kind: spawner.kind,
    origin: 'fill',
    sex: 'male',
    state,
    advancedAtDays: 0,
    ...over,
  }
}

const createRecord: AdvanceWildHabitatInput['createRecord'] = ({ spawner, seq, origin, atDays, sex, mother, rng }) => ({
  habitatId: spawner.id,
  occupantKey: `b${seq}`,
  animalId: birthAnimalId(spawner.id, seq),
  kind: spawner.kind,
  origin,
  sex,
  state: freshWildAnimalState({
    kind: spawner.kind,
    x: mother?.state.x ?? spawner.x,
    z: mother?.state.z ?? spawner.z,
    yaw: rng(),
    lifeOffset: 0.1,
    juvenileOf: mother?.animalId,
  }),
  advancedAtDays: atDays,
})

function run(
  spawner: PreySpawner,
  records: WildFaunaRecord[],
  from: number,
  to: number,
  extra: Partial<AdvanceWildHabitatInput> = {},
) {
  return advanceWildHabitat({
    spawner,
    records,
    fromDays: from,
    toDays: to,
    seed: SEED,
    dayLengthSec: DAY_SEC,
    countKindNear: () => 0,
    createRecord,
    ...extra,
  })
}

const view = (spawner: PreySpawner, records: WildFaunaRecord[]) => ({
  spawner: {
    state: spawner.state,
    deaths: spawner.deathsThisCycle,
    seq: spawner.nextBirthSeq ?? 0,
    disabledAtDay: spawner.disabledAtDay,
  },
  records: [...records]
    .sort((a, b) => (a.animalId < b.animalId ? -1 : 1))
    .map((r) => ({
      id: r.animalId,
      sex: r.sex,
      origin: r.origin,
      dead: r.state.health.dead,
      stage: r.state.lifeStage ?? 'adult',
      mother: r.state.motherId ?? null,
    })),
})

/** Reference: the live per-frame functions with a virtual bound count (what loaded play does). */
function continuousTick(spawner: PreySpawner, bound0: number, from: number, to: number, frame: number): number {
  let bound = bound0
  const onRespawn = (): boolean => {
    bound++
    return true
  }
  let lastCheckDay = Math.floor(from)
  let t = from
  while (t < to - 1e-9) {
    const step = Math.min(frame, to - t)
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

describe('advanceWildHabitat vs loaded per-frame ticking (tolerance: one 0.01-day frame)', () => {
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
    { name: 'fractional boundaries', make: () => makeSpawner({ respawnIntervalDays: 1.3 }), bound: 0, from: 0.37, to: 11.93 },
  ]
  for (const c of cases) {
    it(c.name, () => {
      const adv = c.make()
      const records = Array.from({ length: c.bound }, (_, i) => makeRecord(adv, 100 + i, { advancedAtDays: c.from }))
      run(adv, records, c.from, c.to)
      const ref = c.make()
      const refBound = continuousTick(ref, c.bound, c.from, c.to, 0.01)
      expect(adv.state).toBe(ref.state)
      expect(records.filter((r) => !r.state.health.dead)).toHaveLength(refBound)
      expect(adv.deathsThisCycle).toBe(ref.deathsThisCycle)
      expect(adv.disabledAtDay).toBe(ref.disabledAtDay)
      expect(Math.abs(adv.daysSinceLastRespawn - ref.daysSinceLastRespawn)).toBeLessThanOrEqual(0.011)
      expect(Math.abs(adv.depletedRecoveryDays - ref.depletedRecoveryDays)).toBeLessThanOrEqual(0.011)
    })
  }

  it('wolfDen (infinite interval) never respawns', () => {
    const s = makeSpawner({ type: 'wolfDen', kind: 'wolf', respawnIntervalDays: Infinity, maxPreyCount: 2 })
    const records: WildFaunaRecord[] = []
    expect(run(s, records, 0, 50).events).toEqual([])
    expect(records).toHaveLength(0)
  })

  it('is a no-op for zero or negative elapsed time', () => {
    const s = makeSpawner()
    const records: WildFaunaRecord[] = []
    expect(run(s, records, 5, 5).events).toEqual([])
    expect(run(s, records, 5, 2).events).toEqual([])
    expect(records).toHaveLength(0)
  })
})

describe('advanceWildHabitat is split-invariant (same result for any checkpoint partition)', () => {
  const partitions: number[][] = [[0, 17.5], [0, 0.3, 17.5], [0, 2, 2.0001, 9.77, 17.5], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 17.5]]
  for (const kill of [false, true]) {
    it(`empty habitat with ${kill ? 'a dead resident and a juvenile' : 'one female'}`, () => {
      const results = partitions.map((points) => {
        const s = makeSpawner({ respawnIntervalDays: 1.9 })
        const records = [makeRecord(s, 0, { sex: 'female' })]
        if (kill) {
          records[0].state.health.dead = true
          records[0].state.health.current = 0
          records[0].state.corpse = { deathAtDays: 0.5, meatHarvested: false }
        }
        for (let i = 1; i < points.length; i++) run(s, records, points[i - 1], points[i])
        return view(s, records)
      })
      for (const r of results.slice(1)) expect(r).toEqual(results[0])
      // Guard: the run exercised several creations.
      expect(results[0].spawner.seq).toBeGreaterThanOrEqual(3)
    })
  }

  it('needs and juvenile age match across partitions (float tolerance)', () => {
    const make = () => {
      const s = makeSpawner()
      const r = makeRecord(s, 0, { sex: 'female' })
      r.state.lifeStage = 'juvenile'
      r.state.ageSec = 10
      r.state.life = { hunger: 0.1, thirst: 0.1, stamina: 0.2 }
      return { s, r }
    }
    const a = make()
    run(a.s, [a.r], 0, 0.2)
    const b = make()
    run(b.s, [b.r], 0, 0.07)
    run(b.s, [b.r], 0.07, 0.2)
    expect(a.r.state.ageSec).toBeCloseTo(b.r.state.ageSec ?? 0, 6)
    expect(a.r.state.life.hunger).toBeCloseTo(b.r.state.life.hunger, 9)
    expect(a.r.state.life.stamina).toBeCloseTo(b.r.state.life.stamina, 9)
  })

  it('does not depend on the order of the records array', () => {
    const run1 = (reverse: boolean) => {
      const s = makeSpawner({ maxPreyCount: 6 })
      const records = [0, 1, 2].map((i) => makeRecord(s, i, { sex: i === 1 ? 'female' : 'male' }))
      if (reverse) records.reverse()
      run(s, records, 0, 30)
      return view(s, records)
    }
    expect(run1(true)).toEqual(run1(false))
  })
})

describe('advanceWildHabitat has no 120-day cap and is bounded by capacity', () => {
  it('refills an emptied habitat across 400 days, then stops creating', () => {
    const s = makeSpawner({ respawnIntervalDays: 7, maxPreyCount: 5 })
    const records: WildFaunaRecord[] = []
    const { events } = run(s, records, 0, 400)
    expect(records.filter((r) => !r.state.health.dead)).toHaveLength(5)
    expect(events.filter((e) => e.kind === 'birth' || e.kind === 'immigration')).toHaveLength(5)
    // Empty habitat colonizes at 2x interval, then 7 d per slot; the 5th arrives well past day 40.
    const last = events[events.length - 1]
    expect(last.atDays).toBeLessThan(60)
    expect(s.daysSinceLastRespawn).toBe(0)
  })

  it('a depleted habitat recovers after more than 120 days dormant exactly like after 30', () => {
    const base = () => makeSpawner({ state: 'depleted', deathsThisCycle: 3 })
    const a = base()
    const ra: WildFaunaRecord[] = []
    run(a, ra, 0, 30)
    const b = base()
    const rb: WildFaunaRecord[] = []
    run(b, rb, 0, 300)
    expect(b.state).toBe('active')
    expect(rb.length).toBeGreaterThanOrEqual(a.maxPreyCount === 4 ? 4 : 0)
    expect(view(a, ra).spawner.state).toBe('active')
  })
})

describe('birth vs immigration (Q160-a (b))', () => {
  it('births a juvenile next to an alive adult female', () => {
    const s = makeSpawner()
    const mother = makeRecord(s, 0, { sex: 'female' })
    mother.state.x = 3
    const records = [mother]
    const { events } = run(s, records, 0, 2.5)
    const birth = events.find((e) => e.kind === 'birth')
    expect(birth).toBeDefined()
    if (birth?.kind !== 'birth') return
    expect(birth.record.state.lifeStage).toBe('juvenile')
    expect(birth.record.state.motherId).toBe(mother.animalId)
    expect(birth.record.state.x).toBe(3)
    expect(birth.atDays).toBeCloseTo(2, 9)
  })

  it('immigrates an adult when only males remain, and when the habitat is empty', () => {
    const s1 = makeSpawner()
    const r1 = [makeRecord(s1, 0, { sex: 'male' })]
    const e1 = run(s1, r1, 0, 2.5).events.find((e) => e.kind === 'immigration' || e.kind === 'birth')
    expect(e1?.kind).toBe('immigration')
    if (e1?.kind === 'immigration') expect(e1.record.state.lifeStage).toBeUndefined()
    const s2 = makeSpawner()
    const e2 = run(s2, [], 0, 4.5).events[0]
    // Empty habitat colonizes at the doubled interval.
    expect(e2.kind).toBe('immigration')
    expect(e2.atDays).toBeCloseTo(4, 9)
  })

  it('a dead or juvenile female is not a mother; the pick is keyed and order independent', () => {
    const s = makeSpawner()
    const dead = makeRecord(s, 0, { sex: 'female' })
    dead.state.health.dead = true
    const juvenile = makeRecord(s, 1, { sex: 'female' })
    juvenile.state.lifeStage = 'juvenile'
    const members = (rs: WildFaunaRecord[]) =>
      rs.map((r) => ({
        animalId: r.animalId,
        kind: r.kind,
        sex: r.sex,
        alive: !r.state.health.dead,
        juvenile: r.state.lifeStage === 'juvenile',
      }))
    expect(planWildCreation(s, 0, members([dead, juvenile]), SEED).origin).toBe('immigrant')
    const f1 = makeRecord(s, 2, { sex: 'female' })
    const f2 = makeRecord(s, 3, { sex: 'female' })
    const p1 = planWildCreation(s, 4, members([f1, f2]), SEED)
    const p2 = planWildCreation(s, 4, members([f2, f1]), SEED)
    expect(p1.origin).toBe('birth')
    expect(p1.origin === 'birth' && p2.origin === 'birth' && p1.mother.animalId === p2.mother.animalId).toBe(true)
  })

  it('a juvenile that matures during the span can mother a later birth', () => {
    const s = makeSpawner({ respawnIntervalDays: 5 })
    const girl = makeRecord(s, 0, { sex: 'female' })
    girl.state.lifeStage = 'juvenile'
    girl.state.ageSec = 0
    girl.state.motherId = 'gone'
    const { events } = run(s, [girl], 0, 5.5)
    expect(events.some((e) => e.kind === 'matured')).toBe(true)
    expect(events.find((e) => e.kind === 'birth' || e.kind === 'immigration')?.kind).toBe('birth')
  })
})

describe('recovery predicate counts records within SPAWNER_RADIUS (active + dormant, R3)', () => {
  const recovering = () => makeSpawner({ state: 'recovering', disabledAtDay: 0, deathsThisCycle: 3 })

  it('own records inside the radius count; outside do not', () => {
    const near = recovering()
    const nearRecords = [0, 1].map((i) => makeRecord(near, i))
    run(near, nearRecords, 30, 32)
    expect(near.state).toBe('active')
    const far = recovering()
    const farRecords = [0, 1].map((i) => makeRecord(far, i))
    for (const r of farRecords) r.state.x = 50
    run(far, farRecords, 30, 32)
    expect(far.state).toBe('recovering')
  })

  it('a neighbouring habitat entering the radius makes the difference', () => {
    const without = recovering()
    run(without, [makeRecord(without, 0)], 30, 32, { countKindNear: () => 0 })
    expect(without.state).toBe('recovering')
    const withNeighbour = recovering()
    run(withNeighbour, [makeRecord(withNeighbour, 0)], 30, 32, { countKindNear: () => 1 })
    expect(withNeighbour.state).toBe('active')
  })

  it('daily checks sit on integer day boundaries (live convention)', () => {
    const s = makeSpawner({ state: 'disabled', disabledAtDay: 0.5, deathsThisCycle: 3 })
    const records = [0, 1].map((i) => makeRecord(s, i))
    run(s, records, 0, 21.9)
    expect(s.state).toBe('disabled')
    run(s, records, 21.9, 22.1)
    expect(s.state).toBe('active')
  })
})

describe('per-record conservation', () => {
  it('needs rest at the ceiling: no starvation death however long the dormant span', () => {
    const s = makeSpawner({ maxPreyCount: 1 })
    const r = makeRecord(s, 0)
    r.state.life = { hunger: 0.9, thirst: 0.95, stamina: 0.1 }
    advanceWildRecords([r], 500, DAY_SEC)
    expect(r.state.health.dead).toBe(false)
    expect(r.state.life.hunger).toBeLessThanOrEqual(OFFSCREEN_NEED_CEILING)
    expect(r.state.life.thirst).toBeLessThanOrEqual(OFFSCREEN_NEED_CEILING)
    expect(r.state.life.stamina).toBe(1)
  })

  it('a juvenile matures at JUVENILE_MATURITY_SECONDS of world time', () => {
    const s = makeSpawner()
    const r = makeRecord(s, 0)
    r.state.lifeStage = 'juvenile'
    r.state.ageSec = 0
    r.state.motherId = 'm'
    const just = JUVENILE_MATURITY_SECONDS / DAY_SEC
    const early = advanceWildRecords([r], just - 0.01, DAY_SEC)
    expect(early).toEqual([])
    expect(r.state.lifeStage).toBe('juvenile')
    const late = advanceWildRecords([r], just + 0.01, DAY_SEC)
    expect(late[0]).toMatchObject({ kind: 'matured' })
    expect(late[0].atDays).toBeCloseTo(just, 9)
    expect(r.state.lifeStage).toBeUndefined()
    expect(r.state.motherId).toBeUndefined()
  })

  it('a corpse is removed at deathAtDays + linger, never earlier, and harvested remains sooner', () => {
    const s = makeSpawner()
    const a = makeRecord(s, 0)
    a.state.health = { current: 0, max: 10, dead: true }
    a.state.corpse = { deathAtDays: 3, meatHarvested: false }
    const rs = [a]
    expect(advanceWildRecords(rs, 3 + CORPSE_REMOVE_DAYS - 0.001, DAY_SEC)).toEqual([])
    const ev = advanceWildRecords(rs, 3 + CORPSE_REMOVE_DAYS + 0.001, DAY_SEC)
    expect(ev).toHaveLength(1)
    expect(ev[0]).toMatchObject({ kind: 'removal', animalId: a.animalId })
    expect(rs).toHaveLength(0)
    const b = makeRecord(s, 1)
    b.state.health = { current: 0, max: 10, dead: true }
    b.state.corpse = { deathAtDays: 3, meatHarvested: true, harvestedAtDays: 3.5 }
    expect(advanceWildRecords([b], 3.5 + 0.2, DAY_SEC)).toHaveLength(1)
  })

  it('natural injury recovery resolves lazily at the target day', () => {
    const s = makeSpawner()
    const r = makeRecord(s, 0)
    r.state.health = { current: 3, max: 10, dead: false }
    r.state.physicalInjury = 7
    r.state.injuryRecoveryUpdatedAtDays = 0
    advanceWildRecords([r], 200, DAY_SEC)
    expect(r.state.health.current).toBeGreaterThan(3)
    expect(r.state.injuryRecoveryUpdatedAtDays).toBe(200)
  })

  it('stays idempotent: advancing to the same day twice changes nothing', () => {
    const s = makeSpawner()
    const r = makeRecord(s, 0)
    advanceWildRecords([r], 3, DAY_SEC)
    const first = JSON.stringify(r)
    advanceWildRecords([r], 3, DAY_SEC)
    expect(JSON.stringify(r)).toBe(first)
  })
})
