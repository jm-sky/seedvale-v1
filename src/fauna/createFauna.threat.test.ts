// @vitest-environment jsdom
import { Scene, Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { OffscreenTravelThreatResult } from '../ai/npcTravelCheckpoint'
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
vi.spyOn(console, 'warn').mockImplementation(() => {})
afterEach(() => vi.unstubAllGlobals())

const NORTH: FaunaHabitatGroupInput = { groupId: 'north-hamlet', center: { x: 900, z: 0 }, footprintRadius: 40, denRing: [70, 130] }

async function build(): Promise<Fauna> {
  return createFauna(
    new Scene(), () => 5, () => 0.6, 0, () => DRY_WATER_SAMPLE, () => [], 56,
    new Vector3(0, 0, 0), 'home', 415424794, 30, [],
  )
}

/** A fauna with the NORTH group built, settled and demoted: every individual is a dormant record. */
async function dormantNorth(): Promise<Fauna> {
  const f = await build()
  f.materializeGroup(NORTH, 0)
  f.update(0.016, new Vector3(0, 5, 0), 0.5, 0.001, [], [], [])
  expect(f.dematerializeGroup(NORTH.groupId, 0.001)).toBe('done')
  return f
}

const wildRecords = (f: Fauna) => f.snapshotPersistentOccupants().wild!.records

function dormantWolf(f: Fauna) {
  const wolf = wildRecords(f).find((r) => r.kind === 'wolf' && r.habitatId === 'north-hamlet:wolfDen')
  expect(wolf).toBeDefined()
  return wolf!
}

const strongParty = { hp: 1e6, meleeDamage: 200, partySize: 1 }

describe('offscreen travel threat bubble over dormant records (fauna-050 C3)', () => {
  it('kills a dormant predator on the path and updates the spawner accounting', async () => {
    const f = await dormantNorth()
    const wolf = dormantWolf(f)
    const denBefore = f.snapshotSpawnPoints().find((s) => s.id === 'north-hamlet:wolfDen')!
    expect(denBefore.state).toBe('active')
    const out = f.resolveOffscreenTravelThreats({
      npcId: 'npc:traveller',
      role: undefined,
      fromDays: 0,
      toDays: 40,
      positionAt: () => ({ x: wolf.state.x, z: wolf.state.z }),
      party: strongParty,
    })
    expect(out.diedAtDays).toBeUndefined()
    expect(out.settledAtDays).toBe(40)
    const after = wildRecords(f).find((r) => r.animalId === wolf.animalId)!
    expect(after.state.health.dead).toBe(true)
    expect(after.state.corpse?.deathAtDays).toBeGreaterThan(0)
    const denAfter = f.snapshotSpawnPoints().find((s) => s.id === 'north-hamlet:wolfDen')!
    const dead = wildRecords(f).filter((r) => r.habitatId === 'north-hamlet:wolfDen' && r.state.health.dead).length
    expect(dead).toBeGreaterThan(0)
    expect(denAfter.deathsThisCycle).toBe(dead)
    f.dispose()
  })

  it('is deterministic under different checkpoint partitions', async () => {
    const run = async (cuts: number[]) => {
      const f = await dormantNorth()
      const wolf = dormantWolf(f)
      let hp = 400
      for (let i = 1; i < cuts.length; i++) {
        const r: OffscreenTravelThreatResult = f.resolveOffscreenTravelThreats({
          npcId: 'npc:traveller',
          role: undefined,
          fromDays: cuts[i - 1],
          toDays: cuts[i],
          positionAt: () => ({ x: wolf.state.x, z: wolf.state.z }),
          party: { hp, meleeDamage: 25, partySize: 1 },
        })
        hp -= r.partyDamage
        if (r.diedAtDays !== undefined) break
      }
      const view = {
        hp,
        records: wildRecords(f)
          .filter((r) => r.kind === 'wolf')
          .map((r) => ({ id: r.animalId, dead: r.state.health.dead, hp: r.state.health.current, x: r.state.x, z: r.state.z }))
          .sort((a, b) => (a.id < b.id ? -1 : 1)),
        den: f.snapshotSpawnPoints().find((s) => s.id === 'north-hamlet:wolfDen')!.deathsThisCycle,
      }
      f.dispose()
      return view
    }
    const whole = await run([0, 6])
    expect(whole.records.some((r) => r.dead || r.hp < 50)).toBe(true)
    expect(await run([0, 1.5, 1.5001, 3.3, 6])).toEqual(whole)
    expect(await run([0, 0.02, 0.5, 5.99, 6])).toEqual(whole)
  })

  it('a weak traveller dies on the path: settled at the death step, predators keep their wounds', async () => {
    const f = await dormantNorth()
    const wolf = dormantWolf(f)
    const out = f.resolveOffscreenTravelThreats({
      npcId: 'npc:weak',
      role: undefined,
      fromDays: 0,
      toDays: 40,
      positionAt: () => ({ x: wolf.state.x, z: wolf.state.z }),
      party: { hp: 4, meleeDamage: 1, partySize: 1 },
    })
    expect(out.diedAtDays).toBeDefined()
    expect(out.settledAtDays).toBe(out.diedAtDays)
    expect(out.partyDamage).toBe(4)
    f.dispose()
  })

  it('never touches loaded animals or paths far from every record', async () => {
    const f = await build()
    f.materializeGroup(NORTH, 0)
    f.update(0.016, new Vector3(0, 5, 0), 0.5, 0.001, [], [], [])
    const live = f.getAgents().find((a) => a.def.kind === 'wolf')!
    const hpBefore = live.snapshot().health.current
    const out = f.resolveOffscreenTravelThreats({
      npcId: 'npc:x',
      role: undefined,
      fromDays: 0,
      toDays: 40,
      positionAt: () => ({ x: live.mesh.position.x, z: live.mesh.position.z }),
      party: strongParty,
    })
    expect(out.partyDamage).toBe(0)
    expect(live.snapshot().health.current).toBe(hpBefore)
    expect(live.isDead()).toBe(false)
    const far = f.resolveOffscreenTravelThreats({
      npcId: 'npc:x',
      role: undefined,
      fromDays: 0,
      toDays: 40,
      positionAt: () => ({ x: 50000, z: 50000 }),
      party: strongParty,
    })
    expect(far.partyDamage).toBe(0)
    f.dispose()
  })
})
