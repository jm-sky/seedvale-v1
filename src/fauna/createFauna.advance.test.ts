// @vitest-environment jsdom
import { Scene, Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SavedSpawnPointState } from './AnimalSpawner'
import type { PersistentOccupantSnapshot } from './persistentOccupants'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { createFauna, type Fauna, type FaunaHabitatGroupInput } from './createFauna'
import { OFFSCREEN_NEED_CEILING } from './wildHabitatAdvance'

vi.mock('../assets/loadGltf', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../assets/loadGltf')>()
  return { ...actual, loadGltfAsset: () => Promise.reject(new Error('no GLB in tests')) }
})
vi.mock('../settlement/props', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../settlement/props')>()
  return { ...actual, loadPropTemplates: () => Promise.resolve([]) }
})
vi.spyOn(console, 'warn').mockImplementation(() => {})
afterEach(() => vi.unstubAllGlobals())

const SEED = 415424794
const DAY_SEC = 720
const NORTH: FaunaHabitatGroupInput = { groupId: 'north-hamlet', center: { x: 900, z: 0 }, footprintRadius: 40, denRing: [70, 130] }

async function build(
  spawnerState?: ReadonlyMap<string, SavedSpawnPointState>,
  occupants?: PersistentOccupantSnapshot,
): Promise<Fauna> {
  return createFauna(
    new Scene(), () => 5, () => 0.6, 0, () => DRY_WATER_SAMPLE, () => [], 56,
    new Vector3(0, 0, 0), 'home', SEED, 30, [], undefined, undefined, undefined, spawnerState,
    undefined, undefined, undefined, undefined, undefined, undefined, occupants,
  )
}

const frame = (f: Fauna, dtDays: number, worldDays: number) =>
  f.update(dtDays * DAY_SEC, new Vector3(0, 5, 0), 0.5, worldDays, [], [], [])

/** Loaded play: `steps` equal frames from `t0` to `t0 + days`. */
function runLoaded(f: Fauna, t0: number, days: number, steps: number): number {
  for (let i = 1; i <= steps; i++) frame(f, days / steps, t0 + (days * i) / steps)
  return t0 + days
}

/** Kill the first `n` animals of a group's `spawnerSuffix` habitat by id. */
function killFrom(f: Fauna, habitat: string, n: number): string[] {
  const victims = f.getAgents()
    .filter((a) => a.animalId.startsWith(`${habitat}:b`) && !a.isDead())
    .map((a) => a.animalId)
    .sort()
    .slice(0, n)
  for (const a of f.getAgents()) if (victims.includes(a.animalId)) a.takeDamage(1e6, 'player')
  return victims
}

/** Contract tolerance table: identity, sex, origin, mother links, alive/dead, lifecycle stage and
 *  counts are exact; positions, needs and HP are not compared here. */
function exactView(f: Fauna) {
  const wild = f.snapshotPersistentOccupants().wild
  const records = (wild?.records ?? [])
    .filter((r) => r.habitatId.startsWith('north-hamlet'))
    .map((r) => ({
      id: r.animalId,
      sex: r.sex,
      origin: r.origin,
      dead: r.state.health.dead,
      stage: r.state.lifeStage ?? 'adult',
      mother: r.state.motherId ?? null,
    }))
    .sort((a, b) => (a.id < b.id ? -1 : 1))
  const spawners = f.snapshotSpawnPoints()
    .filter((s) => s.id.startsWith('north-hamlet'))
    .map((s) => ({ id: s.id, state: s.state, deaths: s.deathsThisCycle, seq: s.nextBirthSeq ?? 0 }))
    .sort((a, b) => (a.id < b.id ? -1 : 1))
  return { records, spawners }
}

const spawnerMap = (f: Fauna) =>
  new Map(f.snapshotSpawnPoints().map(({ id, ...state }) => [id, state as SavedSpawnPointState]))

/** One scenario, three transitions over the same world time. */
async function scenario(days: number, mode: 'loaded' | 'unloaded' | 'skip' | 'save') {
  const f = await build()
  f.materializeGroup(NORTH, 0)
  frame(f, 0.001, 0.001)
  const killed = [...killFrom(f, 'north-hamlet:cave', 2), ...killFrom(f, 'north-hamlet:thicket', 2)]
  expect(killed.length).toBeGreaterThan(0)
  let result: Fauna = f
  if (mode === 'loaded') {
    runLoaded(f, 0.001, days, Math.round(days * 20))
  } else if (mode === 'skip') {
    f.resolveTimeSkip(days * 24, DAY_SEC)
    frame(f, 0.001, 0.001 + days)
  } else if (mode === 'unloaded') {
    expect(f.dematerializeGroup(NORTH.groupId, 0.001)).toBe('done')
    runLoaded(f, 0.001, days, Math.max(1, Math.round(days)))
    f.materializeGroup(NORTH, 0.001 + days)
    frame(f, 0.001, 0.002 + days)
  } else {
    const occupants = JSON.parse(JSON.stringify(f.snapshotPersistentOccupants())) as PersistentOccupantSnapshot
    const state = spawnerMap(f)
    f.dispose()
    result = await build(state, occupants)
    result.materializeGroup(NORTH, 0.001)
    frame(result, 0.001, 0.001)
    result.resolveTimeSkip(days * 24, DAY_SEC)
    frame(result, 0.001, 0.001 + days)
  }
  const view = exactView(result)
  result.dispose()
  return view
}

describe('wild habitat world-time transition: loaded vs unloaded vs skip (fauna-050 C3)', () => {
  for (const days of [3.4, 9.55, 150.3]) {
    it(`${days} days: dormant and skip meet the exact-field tolerance of the loaded run`, async () => {
      const loaded = await scenario(days, 'loaded')
      const unloaded = await scenario(days, 'unloaded')
      const skip = await scenario(days, 'skip')
      // Guard: births/immigration actually happened.
      expect(loaded.spawners.reduce((n, s) => n + s.seq, 0)).toBeGreaterThan(0)
      expect(unloaded.spawners).toEqual(loaded.spawners)
      expect(skip.spawners).toEqual(loaded.spawners)
      expect(unloaded.records).toEqual(loaded.records)
      expect(skip.records).toEqual(loaded.records)
    }, 120000)
  }

  it('dormant needs stay at or under the resting ceiling and nothing starves', async () => {
    const f = await build()
    f.materializeGroup(NORTH, 0)
    frame(f, 0.001, 0.001)
    f.dematerializeGroup(NORTH.groupId, 0.001)
    f.materializeGroup(NORTH, 400)
    const records = f.snapshotPersistentOccupants().wild!.records.filter((r) => r.habitatId.startsWith('north-hamlet'))
    expect(records.length).toBeGreaterThan(0)
    for (const r of records) {
      if (r.state.health.dead) continue
      expect(r.state.life.hunger).toBeLessThanOrEqual(OFFSCREEN_NEED_CEILING + 1e-9)
      expect(r.state.life.thirst).toBeLessThanOrEqual(OFFSCREEN_NEED_CEILING + 1e-9)
    }
    f.dispose()
  })

  it('a save/load inserted before the skip is the same transition', async () => {
    const skip = await scenario(9.55, 'skip')
    const saved = await scenario(9.55, 'save')
    expect(saved).toEqual(skip)
  }, 120000)

  it('the dormant lifecycle cursor is not left on a live spawner', async () => {
    const f = await build()
    f.materializeGroup(NORTH, 0)
    frame(f, 0.001, 0.001)
    expect(f.dematerializeGroup(NORTH.groupId, 1)).toBe('done')
    const rows = f.snapshotSpawnPoints().filter((s) => s.id.startsWith('north-hamlet'))
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.map((s) => s.advancedAtDays)).toEqual(rows.map(() => 1))
    f.materializeGroup(NORTH, 5)
    expect(f.getSpawners().filter((s) => s.id.startsWith('north-hamlet')).every((s) => s.advancedAtDays === undefined)).toBe(true)
    f.dispose()
  })
})
