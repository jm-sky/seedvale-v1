import { describe, expect, it } from 'vitest'
import type { WorldLocation } from './worldLocationTypes'
import { createGuardLocalKnowledge, RUMOUR_TRUST_MIN } from './guardLocalKnowledge'
import { createLocationKnowledge } from './locationKnowledge'
import { RUMOUR_LEAD_CAP } from './rumourLead'

const NPC = 'settlement:home:npc:0'
const ORIGIN = { x: 0, z: 0 }

function loc(id: string, kind: WorldLocation['kind'], x: number, z: number): WorldLocation {
  return { id, kind, x, z, name: `Real ${id}`, discoveryWeight: 0.8 }
}

const CAVE = loc('cave:1', 'cave', 0, -6000)
const LAKE = loc('lake:2,2', 'lake', 5000, 0)

function setup(
  pool: WorldLocation[],
  opts: { inRange?: WorldLocation[], day?: number, seed?: number, knowledge?: ReturnType<typeof createLocationKnowledge>, asked?: { band: number[][] } } = {},
) {
  const knowledge = opts.knowledge ?? createLocationKnowledge()
  const byId = new Map(pool.map((l) => [l.id, l]))
  const guard = createGuardLocalKnowledge({
    getElapsedDays: () => opts.day ?? 3.4,
    getWorldSeed: () => opts.seed ?? 11,
    locationKnowledge: knowledge,
    getLocation: (id) => byId.get(id) ?? null,
    landmarksInRange: async (_x, _z, min, max) => {
      opts.asked?.band.push([min, max])
      return opts.inRange ?? pool
    },
    homeLocationId: () => 'settlement:home',
  })
  return { guard, knowledge }
}

describe('rumour producer (plan world-041 L3b / Q138)', () => {
  it('gives an estimated lead without a name or exact pin, expert tier for guards', async () => {
    const { guard, knowledge } = setup([CAVE])
    const line = await guard.askAboutArea(NPC, ORIGIN.x, ORIGIN.z, 'guard', 0)
    expect(line).toContain('cave')
    expect(line).not.toContain('Real')
    expect(knowledge.get(CAVE.id)).toEqual({ id: CAVE.id, state: 'estimated', source: 'npc', leadTier: 'expert' })
  })

  it('stores no tier for ordinary adults (common tier)', async () => {
    const { guard, knowledge } = setup([LAKE])
    const line = await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(line).toContain('lake')
    expect(knowledge.get(LAKE.id)).toEqual({ id: LAKE.id, state: 'estimated', source: 'npc' })
  })

  it('speaks a compass word consistent with the lead area, not the exact target', async () => {
    const { guard } = setup([CAVE])
    expect(await guard.askAboutArea(NPC, 0, 0, 'hunter', 0)).toMatch(/north/)
  })

  it('guards/hunters reach farther than ordinary adults', async () => {
    const asked = { band: [] as number[][] }
    const { guard } = setup([], { asked })
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    await guard.askAboutArea(NPC, 0, 0, 'guard', 0)
    expect(asked.band[1]![1]).toBeGreaterThan(asked.band[0]![1]!)
  })

  it('same-day re-ask and reload cannot farm a second lead', async () => {
    const { guard, knowledge } = setup([CAVE, LAKE])
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    const first = knowledge.list().length
    const again = await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(knowledge.list()).toHaveLength(first)
    expect(again).toMatch(/today/i)
  })

  it('refuses politely below the trust threshold and reveals nothing', async () => {
    const { guard, knowledge } = setup([CAVE])
    await guard.askAboutArea(NPC, 0, 0, 'adult', RUMOUR_TRUST_MIN - 1)
    expect(knowledge.list()).toHaveLength(0)
  })

  it('open-lead cap blocks a new lead', async () => {
    const full = Array.from({ length: RUMOUR_LEAD_CAP }, (_, i) => loc(`cave:full${i}`, 'cave', 100 * i, -5000))
    const known = createLocationKnowledge(full.map((l) => ({ id: l.id, state: 'estimated' as const, source: 'npc' as const })))
    const { guard, knowledge } = setup([...full, CAVE], { knowledge: known, inRange: [CAVE] })
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(knowledge.has(CAVE.id)).toBe(false)
  })

  it('stale (unresolvable) leads do not hold the cap', async () => {
    const stale = Array.from({ length: RUMOUR_LEAD_CAP }, (_, i) => ({ id: `cave:gone${i}`, state: 'estimated' as const, source: 'npc' as const }))
    const { guard, knowledge } = setup([CAVE], { knowledge: createLocationKnowledge(stale) })
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(knowledge.has(CAVE.id)).toBe(true)
  })

  it('an empty pool answers with the none line', async () => {
    const { guard } = setup([])
    const line = await guard.askAboutArea(NPC, 0, 0, 'guard', 0)
    expect(line.length).toBeGreaterThan(0)
  })

  it('ignores kinds without approved copy (settlement, abandonedMine)', async () => {
    const { guard, knowledge } = setup([loc('settlement:x', 'settlement', 0, -6000)])
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(knowledge.list()).toHaveLength(0)
  })
})
