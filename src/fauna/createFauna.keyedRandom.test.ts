// @vitest-environment jsdom
import { Scene, Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SavedSpawnPointState } from './AnimalSpawner'
import type { PersistentOccupantSnapshot } from './persistentOccupants'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { createFauna, type Fauna, type FaunaHabitatGroupInput } from './createFauna'
import { faunaEventRandom } from './faunaEventRandom'

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

const NORTH: FaunaHabitatGroupInput = { groupId: 'north-hamlet', center: { x: 900, z: 0 }, footprintRadius: 40, denRing: [70, 130] }
const SOUTH: FaunaHabitatGroupInput = { groupId: 'south-farm', center: { x: -900, z: 400 }, footprintRadius: 40, denRing: [70, 130] }

async function build(
  seed: number,
  spawnerState?: ReadonlyMap<string, SavedSpawnPointState>,
  occupants?: PersistentOccupantSnapshot,
): Promise<Fauna> {
  return createFauna(
    new Scene(), () => 5, () => 0.6, 0, () => DRY_WATER_SAMPLE, () => [], 56,
    new Vector3(0, 0, 0), 'home', seed, 30, [], undefined, undefined, undefined, spawnerState,
    undefined, undefined, undefined, undefined, undefined, undefined, occupants,
  )
}

const frame = (f: Fauna, dt: number, worldDays: number) =>
  f.update(dt, new Vector3(0, 5, 0), 0.5, worldDays, [], [], [])

/** Advance world `totalDays` from `t0` in `steps` equal frames (same total real time per partition). */
function run(f: Fauna, t0: number, totalDays: number, steps: number): number {
  const dt = (totalDays * 600) / steps
  for (let i = 1; i <= steps; i++) frame(f, dt, t0 + (totalDays * i) / steps)
  return t0 + totalDays
}

/** Authoritative view: ids, sex, HP, needs, lifecycle, counts. Never trajectories. */
function authoritative(f: Fauna) {
  const animals = f.getAgents().map((a) => {
    const s = a.snapshot()
    return {
      id: a.animalId, kind: a.def.kind, sex: a.sex, dead: a.isDead(),
      hp: s.health.current, stage: s.lifeStage ?? 'adult', mother: s.motherId ?? null,
      hunger: s.life.hunger, thirst: s.life.thirst,
    }
  }).sort((p, q) => (p.id < q.id ? -1 : 1))
  const spawners = f.snapshotSpawnPoints()
    .map((s) => ({ id: s.id, state: s.state, deaths: s.deathsThisCycle, seq: s.nextBirthSeq ?? 0 }))
    .sort((p, q) => (p.id < q.id ? -1 : 1))
  return { animals, spawners }
}

/** Same, without needs and HP: when the wander trajectory differs (other frame partition, or a
 *  wander cursor that is deliberately not persisted across save/load), who meets whom and who forages
 *  differs, so combat HP and needs may differ (stated tolerance, fauna-050 C1.6). Identity, sex,
 *  alive/dead, lifecycle and counts must not. */
const identityView = (f: Fauna) => {
  const v = authoritative(f)
  return {
    spawners: v.spawners,
    animals: v.animals.map(({ hunger: _h, thirst: _t, hp: _hp, ...rest }) => rest),
  }
}

const spawnerMap = (f: Fauna) =>
  new Map(f.snapshotSpawnPoints().map(({ id, ...state }) => [id, state as SavedSpawnPointState]))

/** Kill a fixed set of animals by id so spawners respawn/birth post-build. */
function killSome(f: Fauna, n: number): void {
  const victims = f.getAgents().filter((a) => !a.isDead()).map((a) => a.animalId).sort().slice(0, n)
  for (const a of f.getAgents()) if (victims.includes(a.animalId)) a.takeDamage(1e6, 'player')
}

describe.each([42, 415424794])('keyed fauna randomness (fauna-050 C4), seed %i', (seed) => {
  it('faunaEventRandom is a pure function of (seed, key)', () => {
    expect(faunaEventRandom(seed, 'life:x')()).toBe(faunaEventRandom(seed, 'life:x')())
    expect(faunaEventRandom(seed, 'life:x')()).not.toBe(faunaEventRandom(seed, 'life:y')())
  })

  it('does not depend on group materialization order', async () => {
    const run1 = async (order: FaunaHabitatGroupInput[]) => {
      const f = await build(seed)
      for (const g of order) f.materializeGroup(g, 0)
      const seqBefore = authoritative(f).spawners.reduce((n, x) => n + x.seq, 0)
      killSome(f, 3)
      run(f, 0, 8, 320)
      const view = authoritative(f)
      // Guard: the run must actually exercise post-build keyed births.
      expect(view.spawners.reduce((n, x) => n + x.seq, 0)).toBeGreaterThan(seqBefore)
      f.dispose()
      return view
    }
    const ab = await run1([NORTH, SOUTH])
    const ba = await run1([SOUTH, NORTH])
    expect(ba.spawners).toEqual(ab.spawners)
    expect(ba.animals).toEqual(ab.animals)
  })

  it('does not depend on the frame partition (ids, sex, alive, lifecycle, counts)', async () => {
    const run1 = async (steps: number) => {
      const f = await build(seed)
      f.materializeGroup(NORTH, 0)
      killSome(f, 3)
      run(f, 0, 8, steps)
      const view = identityView(f)
      f.dispose()
      return view
    }
    expect(await run1(160)).toEqual(await run1(640))
  })

  it('is unchanged by a save/load inserted mid-run (ids, sex, alive, lifecycle, counts)', async () => {
    const straight = await build(seed)
    killSome(straight, 3)
    run(straight, 0, 8, 320)
    const want = identityView(straight)
    straight.dispose()

    const first = await build(seed)
    killSome(first, 3)
    const mid = run(first, 0, 4, 160)
    const occupants = JSON.parse(JSON.stringify(first.snapshotPersistentOccupants())) as PersistentOccupantSnapshot
    const state = spawnerMap(first)
    first.dispose()
    const second = await build(seed, state, occupants)
    run(second, mid, 4, 160)
    const got = identityView(second)
    second.dispose()
    expect(got).toEqual(want)
  })
})
