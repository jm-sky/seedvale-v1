// @vitest-environment jsdom
import { Scene, Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SavedSpawnPointState } from './AnimalSpawner'
import type { PersistentOccupantSnapshot } from './persistentOccupants'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { createFauna, type Fauna, type FaunaHabitatGroupInput } from './createFauna'

vi.mock('../assets/loadGltf', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../assets/loadGltf')>()
  return { ...actual, loadGltfAsset: () => Promise.reject(new Error('no GLB in tests')) }
})
vi.mock('../settlement/props', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../settlement/props')>()
  return { ...actual, loadPropTemplates: () => Promise.resolve([]) }
})

const NEIGHBOUR: FaunaHabitatGroupInput = {
  groupId: 'north-hamlet',
  center: { x: 900, z: 0 },
  footprintRadius: 40,
  denRing: [70, 130],
}

vi.spyOn(console, 'warn').mockImplementation(() => {})

async function build(
  spawnerState?: ReadonlyMap<string, SavedSpawnPointState>,
  occupants?: PersistentOccupantSnapshot,
): Promise<Fauna> {
  return createFauna(
    new Scene(),
    () => 5,
    () => 0.6,
    0,
    () => DRY_WATER_SAMPLE,
    () => [],
    56,
    new Vector3(0, 0, 0),
    'home',
    415424794,
    30,
    [],
    undefined,
    undefined,
    undefined,
    spawnerState,
    undefined, undefined, undefined, undefined, undefined, undefined,
    occupants,
  )
}

const settle = (fauna: Fauna, worldDays = 0) =>
  fauna.update(0.016, new Vector3(0, 5, 0), 0.5, worldDays, [], [], [])

const spawnerMap = (fauna: Fauna) =>
  new Map(fauna.snapshotSpawnPoints().map(({ id, ...state }) => [id, state as SavedSpawnPointState]))

const idsOf = (fauna: Fauna) => fauna.getAgents().map((a) => a.animalId).sort()

afterEach(() => vi.unstubAllGlobals())

describe('durable wild records (fauna-050 C2)', () => {
  it('gives home animals durable ids and records them on save', async () => {
    const fauna = await build()
    const ids = idsOf(fauna)
    expect(ids.length).toBeGreaterThan(0)
    expect(ids.every((id) => /^home:.+:(r|b)\d+$/.test(id) || id.startsWith('persistent:'))).toBe(true)
    const wild = fauna.snapshotPersistentOccupants().wild!
    expect(wild.groups.map((g) => g.id)).toContain('home')
    expect(wild.records.map((r) => r.animalId).sort()).toEqual(ids.filter((id) => !id.startsWith('persistent:')))
    fauna.dispose()
  })

  it('save/reload restores the same individuals without replaying the initial population', async () => {
    const a = await build()
    settle(a)
    const victim = a.getAgents()[0]
    victim.takeDamage(1e6, 'player')
    const before = a.getAgents().filter((x) => !x.isDead()).length
    const occupants = a.snapshotPersistentOccupants()
    const state = spawnerMap(a)
    const ids = idsOf(a)
    a.dispose()

    const b = await build(state, JSON.parse(JSON.stringify(occupants)))
    expect(idsOf(b)).toEqual(ids)
    expect(b.getAgents().find((x) => x.animalId === victim.animalId)?.isDead()).toBe(true)
    expect(b.getAgents().filter((x) => !x.isDead()).length).toBe(before)
    b.dispose()
  })

  it('a removed record is not resurrected by reload', async () => {
    const a = await build()
    const gone = a.getAgents().find((x) => x.animalId.includes(':ring:'))!
    const occupants = a.snapshotPersistentOccupants()
    a.dispose()
    const trimmed: PersistentOccupantSnapshot = {
      ...occupants,
      wild: { ...occupants.wild!, records: occupants.wild!.records.filter((r) => r.animalId !== gone.animalId) },
    }
    const b = await build(undefined, trimmed)
    expect(idsOf(b)).not.toContain(gone.animalId)
    b.dispose()
  })

  it('demote -> promote is lossless (id, sex, HP, juvenile link) and keeps one agent per record', async () => {
    const fauna = await build()
    fauna.materializeGroup(NEIGHBOUR, 0)
    settle(fauna)
    const members = fauna.getAgents().filter((a) => a.animalId.startsWith('north-hamlet:'))
    expect(members.length).toBeGreaterThan(0)
    const target = members[0]
    target.takeDamage(1, 'player')
    const expected = new Map(members.map((a) => [a.animalId, {
      sex: a.sex,
      hp: a.snapshot().health.current,
      dead: a.isDead(),
      stage: a.snapshot().lifeStage,
      mother: a.snapshot().motherId,
    }]))
    expect(fauna.dematerializeGroup('north-hamlet', 1)).toBe('done')
    expect(fauna.getAgents().some((a) => a.animalId.startsWith('north-hamlet:'))).toBe(false)

    fauna.materializeGroup(NEIGHBOUR, 1)
    const again = fauna.getAgents().filter((a) => a.animalId.startsWith('north-hamlet:'))
    const promotedIds = again.map((a) => a.animalId)
    expect(new Set(promotedIds).size).toBe(promotedIds.length)
    for (const [id, want] of expected) {
      const a = again.find((x) => x.animalId === id)
      expect(a, id).toBeDefined()
      expect({
        sex: a!.sex,
        hp: a!.snapshot().health.current,
        dead: a!.isDead(),
        stage: a!.snapshot().lifeStage,
        mother: a!.snapshot().motherId,
      }).toEqual(want)
    }
    fauna.dispose()
  })

  it('a rebuild carry (snapshot -> new instance) equals save/load', async () => {
    const a = await build()
    a.materializeGroup(NEIGHBOUR, 0)
    settle(a)
    a.dematerializeGroup('north-hamlet', 0)
    const occupants = a.snapshotPersistentOccupants()
    const state = spawnerMap(a)
    a.dispose()
    const b = await build(state, occupants)
    b.materializeGroup(NEIGHBOUR, 0)
    expect(b.getAgents().filter((x) => x.animalId.startsWith('north-hamlet:')).length)
      .toBe(occupants.wild!.records.filter((r) => r.animalId.startsWith('north-hamlet:')).length)
    b.dispose()
  })

  it('home placement stays bit-identical between a first build and a records restore', async () => {
    const a = await build()
    const view = (f: Fauna) => f.getAgents()
      .map((x) => [x.animalId, x.def.kind, x.snapshot().x, x.snapshot().z] as const)
      .sort((p, q) => (p[0] < q[0] ? -1 : 1))
    const positions = view(a)
    const occupants = a.snapshotPersistentOccupants()
    const state = spawnerMap(a)
    a.dispose()
    const b = await build(state, occupants)
    expect(view(b)).toEqual(positions)
    b.dispose()
  })

  it('legacy save without wildFauna rebuilds the initial population once, then becomes durable', async () => {
    const a = await build()
    const idsFirst = idsOf(a)
    a.dispose()
    const legacy = await build(undefined, { entries: [], removedSlots: [] })
    expect(idsOf(legacy)).toEqual(idsFirst)
    expect(legacy.snapshotPersistentOccupants().wild?.groups.map((g) => g.id)).toContain('home')
    legacy.dispose()
  })
})
