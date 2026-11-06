// @vitest-environment jsdom
import { Scene, Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SavedSpawnPointState } from './AnimalSpawner'
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

const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

async function build(
  initial?: ReadonlyMap<string, SavedSpawnPointState>,
): Promise<{ fauna: Fauna, scene: Scene }> {
  const scene = new Scene()
  const fauna = await createFauna(
    scene,
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
    initial,
  )
  return { fauna, scene }
}

const homeIds = (fauna: Fauna) => fauna.getSpawners().filter((s) => s.id.startsWith('home:')).map((s) => s.id)
const groupSpawners = (fauna: Fauna) => fauna.getSpawners().filter((s) => s.id.startsWith('north-hamlet:'))

/** One far-observer frame so freshly spawned agents leave their initial `immediate` cadence class. */
const settle = (fauna: Fauna, worldDays = 0) =>
  fauna.update(0.016, new Vector3(0, 5, 0), 0.5, worldDays, [], [], [])

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createFauna habitat groups (plan fauna-050 F2)', () => {
  it('materialize -> dematerialize -> materialize gives identical sites and leaves home untouched', async () => {
    const { fauna } = await build()
    const homeBefore = fauna.getSpawners().map((s) => ({ id: s.id, x: s.x, z: s.z }))
    const homeAgents = fauna.getAgents().length
    expect(fauna.getMaterializedGroupIds()).toEqual(['home'])

    expect(fauna.materializeGroup(NEIGHBOUR, 0)).toBe(true)
    const first = groupSpawners(fauna).map((s) => ({ id: s.id, x: s.x, z: s.z }))
    expect(first.length).toBeGreaterThan(0)
    const groupAgentCount = fauna.getAgents().length - homeAgents
    expect(groupAgentCount).toBeGreaterThan(0)

    settle(fauna)
    expect(fauna.dematerializeGroup('north-hamlet', 0)).toBe('done')
    expect(groupSpawners(fauna)).toHaveLength(0)
    expect(fauna.getAgents()).toHaveLength(homeAgents)

    expect(fauna.materializeGroup(NEIGHBOUR, 0)).toBe(true)
    expect(groupSpawners(fauna).map((s) => ({ id: s.id, x: s.x, z: s.z }))).toEqual(first)
    expect(fauna.getAgents().length - homeAgents).toBe(groupAgentCount)
    expect(fauna.getSpawners().filter((s) => s.id.startsWith('home:')).map((s) => ({ id: s.id, x: s.x, z: s.z })))
      .toEqual(homeBefore)
    fauna.dispose()
  })

  it('home stays materialized and cannot be dematerialized', async () => {
    const { fauna } = await build()
    expect(fauna.dematerializeGroup('home', 0)).toBe('pinned')
    expect(fauna.materializeGroup({ ...NEIGHBOUR, groupId: 'home' }, 0)).toBe(false)
    expect(homeIds(fauna)).toContain('home:cave')
    fauna.dispose()
  })

  it('home spawner ids and positions do not depend on whether a group was ever materialized', async () => {
    const a = await build()
    const b = await build()
    b.fauna.materializeGroup(NEIGHBOUR, 0)
    expect(b.fauna.getSpawners().filter((s) => s.id.startsWith('home:')).map((s) => [s.id, s.x, s.z]))
      .toEqual(a.fauna.getSpawners().map((s) => [s.id, s.x, s.z]))
    a.fauna.dispose()
    b.fauna.dispose()
  })

  it('saves an unmaterialized depleted/disabled spawner and reloads it (round-trip)', async () => {
    const { fauna } = await build()
    fauna.materializeGroup(NEIGHBOUR, 0)
    const [den] = groupSpawners(fauna)
    den.state = 'disabled'
    den.disabledAtDay = 3
    den.deathsThisCycle = 4
    settle(fauna)
    fauna.dematerializeGroup('north-hamlet', 4)

    // getSpawners() = live only; the save union still carries the group's state.
    expect(groupSpawners(fauna)).toHaveLength(0)
    const rows = fauna.snapshotSpawnPoints()
    const saved = rows.find((r) => r.id === den.id)
    expect(saved).toMatchObject({ state: 'disabled', disabledAtDay: 3, deathsThisCycle: 4 })
    const stateMap = new Map(rows.map(({ id, ...state }) => [id, state as SavedSpawnPointState]))
    fauna.dispose()

    // A reloaded world (group still not materialized) must keep writing the row...
    const reloaded = await build(stateMap)
    expect(reloaded.fauna.snapshotSpawnPoints().find((r) => r.id === den.id)).toMatchObject({ state: 'disabled' })
    // ...and applies it when the group materializes (save-loaded: no catch-up, no backlog).
    reloaded.fauna.materializeGroup(NEIGHBOUR, 4)
    const restored = groupSpawners(reloaded.fauna).find((s) => s.id === den.id)
    expect(restored).toMatchObject({ state: 'disabled', disabledAtDay: 3, deathsThisCycle: 4 })
    expect(reloaded.fauna.getAgents().some((a) => a.spawnPointId === den.id)).toBe(false)
    reloaded.fauna.dispose()
  })

  it('lazy catch-up on re-materialization recovers a depleted spawner like continuous ticking would', async () => {
    const { fauna } = await build()
    fauna.materializeGroup(NEIGHBOUR, 0)
    const target = groupSpawners(fauna).find((s) => s.type === 'thicket')!
    // Real deaths (three of four deer) so depletion goes through the production accounting.
    const members = fauna.getAgents().filter((x) => x.spawnPointId === target.id)
    expect(members).toHaveLength(4)
    for (const victim of members.slice(0, 3)) victim.takeDamage(1e6, 'player')
    expect(target.state).toBe('depleted')
    settle(fauna)
    expect(fauna.dematerializeGroup('north-hamlet', 1)).toBe('done')
    expect(fauna.snapshotSpawnPoints().find((r) => r.id === target.id)?.state).toBe('depleted')

    fauna.materializeGroup(NEIGHBOUR, 40)
    const after = groupSpawners(fauna).find((s) => s.id === target.id)!
    expect(after.state).toBe('active')
    expect(after.deathsThisCycle).toBe(0)
    const bound = fauna.getAgents().filter((a) => a.spawnPointId === target.id && !a.isDead()).length
    expect(bound).toBeGreaterThanOrEqual(2)
    fauna.dispose()
  })

  it('delays dematerialization while an agent is engaged, then completes on disengage or timeout', async () => {
    const { fauna } = await build()
    fauna.materializeGroup(NEIGHBOUR, 0)
    const member = fauna.getAgents().find((a) => a.spawnPointId?.startsWith('north-hamlet:'))!
    const spy = vi.spyOn(member, 'getDebugInfo').mockReturnValue({ updateImportance: 'immediate' } as never)
    expect(fauna.dematerializeGroup('north-hamlet', 1)).toBe('deferred')
    expect(fauna.isGroupMaterialized('north-hamlet')).toBe(true)

    const tick = (dt: number) =>
      fauna.update(dt, new Vector3(0, 5, 0), 0.5, 1, [], [], [])
    tick(1)
    expect(fauna.isGroupMaterialized('north-hamlet')).toBe(true)
    tick(100)
    expect(fauna.isGroupMaterialized('north-hamlet')).toBe(false)
    expect(groupSpawners(fauna)).toHaveLength(0)
    spy.mockRestore()
    fauna.dispose()
  })

  it('re-materializing a pending group cancels the deferred dematerialization', async () => {
    const { fauna } = await build()
    fauna.materializeGroup(NEIGHBOUR, 0)
    const member = fauna.getAgents().find((a) => a.spawnPointId?.startsWith('north-hamlet:'))!
    vi.spyOn(member, 'getDebugInfo').mockReturnValue({ updateImportance: 'immediate' } as never)
    expect(fauna.dematerializeGroup('north-hamlet', 1)).toBe('deferred')
    expect(fauna.materializeGroup(NEIGHBOUR, 1)).toBe(true)
    fauna.update(100, new Vector3(0, 5, 0), 0.5, 1, [], [], [])
    expect(fauna.isGroupMaterialized('north-hamlet')).toBe(true)
    fauna.dispose()
  })

  it('leaves no orphaned agents, props or labels after dematerialize and dispose', async () => {
    const { fauna, scene } = await build()
    const baselineChildren = scene.children.length
    fauna.materializeGroup(NEIGHBOUR, 0)
    expect(scene.children.length).toBeGreaterThan(baselineChildren)
    settle(fauna)
    fauna.dematerializeGroup('north-hamlet', 0)
    expect(scene.children.length).toBe(baselineChildren)
    fauna.materializeGroup(NEIGHBOUR, 0)
    fauna.dispose()
    expect(scene.children).toHaveLength(0)
    expect(fauna.getAgents()).toHaveLength(0)
    expect(fauna.getMaterializedGroupIds()).toEqual([])
  })

  it('the worldFaunaHabitats toggle disables non-home groups only', async () => {
    vi.stubGlobal('window', { location: { search: '?debugDisableSystems=worldFaunaHabitats' } })
    const { fauna } = await build()
    expect(fauna.materializeGroup(NEIGHBOUR, 0)).toBe(false)
    expect(fauna.isGroupMaterialized('north-hamlet')).toBe(false)
    expect(homeIds(fauna).length).toBeGreaterThan(0)
    fauna.dispose()
  })
})

describe('createFauna remote groups (plan fauna-050 C0)', () => {
  const SOUTH: FaunaHabitatGroupInput = { groupId: 'south-hamlet', center: { x: -900, z: 300 }, footprintRadius: 35, denRing: [70, 130] }
  const sites = (fauna: Fauna, prefix: string) =>
    fauna.getSpawners().filter((s) => s.id.startsWith(prefix)).map((s) => [s.id, s.x, s.z])
  const agentSpots = (fauna: Fauna, prefix: string) =>
    fauna.getAgents().filter((a) => a.spawnPointId?.startsWith(prefix))
      .map((a) => [a.spawnPointId, a.mesh.position.x, a.mesh.position.z]).sort()

  it('non-home positions do not depend on group materialization order', async () => {
    const a = await build()
    a.fauna.materializeGroup(NEIGHBOUR, 0)
    a.fauna.materializeGroup(SOUTH, 0)
    const b = await build()
    b.fauna.materializeGroup(SOUTH, 0)
    b.fauna.materializeGroup(NEIGHBOUR, 0)
    for (const prefix of ['north-hamlet:', 'south-hamlet:']) {
      expect(sites(b.fauna, prefix)).toEqual(sites(a.fauna, prefix))
      expect(agentSpots(b.fauna, prefix)).toEqual(agentSpots(a.fauna, prefix))
    }
    expect(sites(a.fauna, 'north-hamlet:').length).toBeGreaterThan(0)
    a.fauna.dispose()
    b.fauna.dispose()
  })

  it("a remote group's own road excludes sites on it; the home road query is not applied to it", async () => {
    const free = await build()
    free.fauna.materializeGroup(NEIGHBOUR, 0)
    const freeSites = sites(free.fauna, 'north-hamlet:')
    expect(freeSites.length).toBeGreaterThan(0)
    const [, fx, fz] = freeSites[0] as [string, number, number]
    free.fauna.dispose()

    // A road through the first free site, given only to the neighbour group.
    const road = { ax: fx - 20, az: fz, ah: 5, bx: fx + 20, bz: fz, bh: 5, halfWidth: 3, heightStrength: 1, tintStrength: 1 }
    const roaded = await build()
    roaded.fauna.materializeGroup({ ...NEIGHBOUR, roadSegments: [road] }, 0)
    for (const [, x, z] of sites(roaded.fauna, 'north-hamlet:') as [string, number, number][]) {
      expect(Math.abs(z - fz) <= 4 && x >= fx - 20 && x <= fx + 20).toBe(false)
    }
    roaded.fauna.dispose()
  })
})

warn.mockClear()
