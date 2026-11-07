import { describe, expect, it } from 'vitest'
import type { WorldLocation } from './worldLocationTypes'
import { rumourWaitLine } from '../../ai/rumourLines'
import { createGuardLocalKnowledge, RUMOUR_RESEARCH_DELAY_DAYS, RUMOUR_TRUST_MIN } from './guardLocalKnowledge'
import { createLocationKnowledge } from './locationKnowledge'
import { RUMOUR_LEAD_CAP } from './rumourLead'

const NPC = 'settlement:home:npc:0'
const ORIGIN = { x: 0, z: 0 }
const START_DAY = 3.4

function loc(id: string, kind: WorldLocation['kind'], x: number, z: number): WorldLocation {
  return { id, kind, x, z, name: `Real ${id}`, discoveryWeight: 0.8 }
}

const CAVE = loc('cave:1', 'cave', 0, -6000)
const LAKE = loc('lake:2,2', 'lake', 5000, 0)

function setup(
  pool: WorldLocation[],
  opts: { inRange?: WorldLocation[], seed?: number, knowledge?: ReturnType<typeof createLocationKnowledge>, asked?: { band: number[][] } } = {},
) {
  const knowledge = opts.knowledge ?? createLocationKnowledge()
  const byId = new Map(pool.map((l) => [l.id, l]))
  const clock = { day: START_DAY }
  let queries = 0
  const guard = createGuardLocalKnowledge({
    getElapsedDays: () => clock.day,
    getWorldSeed: () => opts.seed ?? 11,
    locationKnowledge: knowledge,
    getLocation: (id) => byId.get(id) ?? null,
    landmarksInRange: async (_x, _z, min, max) => {
      queries++
      opts.asked?.band.push([min, max])
      return opts.inRange ?? pool
    },
    homeLocationId: () => 'settlement:home',
  })
  /** First ask (wait line) → one game hour → second ask (the answer). */
  const askAndWait = async (speaker: 'adult' | 'guard' | 'hunter' = 'adult', trust = 0, npc = NPC): Promise<{ start: string, answer: string }> => {
    const start = await guard.askAboutArea(npc, ORIGIN.x, ORIGIN.z, speaker, trust)
    clock.day += RUMOUR_RESEARCH_DELAY_DAYS
    const answer = await guard.askAboutArea(npc, ORIGIN.x, ORIGIN.z, speaker, trust)
    return { start, answer }
  }
  return { guard, knowledge, clock, askAndWait, queries: () => queries }
}

describe('rumour producer (plan world-041 L3b / Q138, deferred by Q172)', () => {
  it('first ask answers at once with the wait line and reveals nothing yet', async () => {
    const { guard, knowledge } = setup([CAVE])
    expect(await guard.askAboutArea(NPC, 0, 0, 'guard', 0)).toBe(rumourWaitLine('start', 'guard'))
    expect(knowledge.list()).toHaveLength(0)
  })

  it('asking again before the hour is up says "not yet"', async () => {
    const { guard, knowledge, clock } = setup([CAVE])
    await guard.askAboutArea(NPC, 0, 0, 'hunter', 0)
    clock.day += RUMOUR_RESEARCH_DELAY_DAYS / 2
    expect(await guard.askAboutArea(NPC, 0, 0, 'hunter', 0)).toBe(rumourWaitLine('pending', 'hunter'))
    expect(knowledge.list()).toHaveLength(0)
  })

  it('after the wait gives an estimated lead without a name or exact pin, expert tier for guards', async () => {
    const { knowledge, askAndWait } = setup([CAVE])
    const { answer } = await askAndWait('guard')
    expect(answer).toContain('cave')
    expect(answer).not.toContain('Real')
    expect(knowledge.get(CAVE.id)).toEqual({ id: CAVE.id, state: 'estimated', source: 'npc', leadTier: 'expert' })
  })

  it('stores no tier for ordinary adults (common tier)', async () => {
    const { knowledge, askAndWait } = setup([LAKE])
    expect((await askAndWait('adult')).answer).toContain('lake')
    expect(knowledge.get(LAKE.id)).toEqual({ id: LAKE.id, state: 'estimated', source: 'npc' })
  })

  it('speaks a compass word consistent with the lead area, not the exact target', async () => {
    const { askAndWait } = setup([CAVE])
    expect((await askAndWait('hunter')).answer).toMatch(/north/)
  })

  it('guards/hunters reach farther than ordinary adults', async () => {
    const asked = { band: [] as number[][] }
    const { guard } = setup([], { asked })
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    await guard.askAboutArea('settlement:home:npc:1', 0, 0, 'guard', 0)
    expect(asked.band[1]![1]).toBeGreaterThan(asked.band[0]![1]!)
  })

  it('same-day re-ask after an answer cannot farm a second lead and needs no second wait', async () => {
    const { guard, knowledge, askAndWait } = setup([CAVE, LAKE])
    await askAndWait('adult')
    const first = knowledge.list().length
    const again = await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(knowledge.list()).toHaveLength(first)
    expect(again).toMatch(/today/i)
  })

  it('the pending request survives save/load and is answered after the hour', async () => {
    const a = setup([CAVE])
    await a.guard.askAboutArea(NPC, 0, 0, 'guard', 0)
    const saved = a.guard.serialize()
    expect(saved?.[NPC]?.revealAtDays).toBeCloseTo(START_DAY + RUMOUR_RESEARCH_DELAY_DAYS)

    const b = setup([CAVE])
    b.guard.restore(saved)
    b.clock.day = START_DAY + RUMOUR_RESEARCH_DELAY_DAYS
    expect(await b.guard.askAboutArea(NPC, 0, 0, 'guard', 0)).toContain('cave')
    expect(b.knowledge.get(CAVE.id)?.state).toBe('estimated')
    expect(b.guard.serialize()).toBeUndefined()
  })

  it('delivery picks the same candidate as an uninterrupted session (determinism across reload)', async () => {
    const pool = [CAVE, LAKE, loc('ruins:r', 'ruins', -5000, 0), loc('cave:9', 'cave', 3000, 3000)]
    const live = setup(pool)
    await live.askAndWait('adult')
    const reloaded = setup(pool)
    await reloaded.guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    const saved = reloaded.guard.serialize()
    const after = setup(pool)
    after.guard.restore(saved)
    after.clock.day = START_DAY + RUMOUR_RESEARCH_DELAY_DAYS
    await after.guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(after.knowledge.list().map((e) => e.id)).toEqual(live.knowledge.list().map((e) => e.id))
  })

  it('reset (new world) drops a pending request', async () => {
    const { guard, clock, knowledge } = setup([CAVE])
    await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    guard.reset()
    clock.day += RUMOUR_RESEARCH_DELAY_DAYS
    expect(await guard.askAboutArea(NPC, 0, 0, 'adult', 0)).toBe(rumourWaitLine('start', 'adult'))
    expect(knowledge.list()).toHaveLength(0)
  })

  it('refuses politely below the trust threshold, at once, and reveals nothing', async () => {
    const { guard, knowledge, queries } = setup([CAVE])
    const line = await guard.askAboutArea(NPC, 0, 0, 'adult', RUMOUR_TRUST_MIN - 1)
    expect(line).not.toBe(rumourWaitLine('start', 'adult'))
    expect(queries()).toBe(0)
    expect(knowledge.list()).toHaveLength(0)
  })

  it('open-lead cap blocks a new lead without a wait', async () => {
    const full = Array.from({ length: RUMOUR_LEAD_CAP }, (_, i) => loc(`cave:full${i}`, 'cave', 100 * i, -5000))
    const known = createLocationKnowledge(full.map((l) => ({ id: l.id, state: 'estimated' as const, source: 'npc' as const })))
    const { guard, knowledge, queries } = setup([...full, CAVE], { knowledge: known, inRange: [CAVE] })
    const line = await guard.askAboutArea(NPC, 0, 0, 'adult', 0)
    expect(line).not.toBe(rumourWaitLine('start', 'adult'))
    expect(queries()).toBe(0)
    expect(knowledge.has(CAVE.id)).toBe(false)
  })

  it('stale (unresolvable) leads do not hold the cap', async () => {
    const stale = Array.from({ length: RUMOUR_LEAD_CAP }, (_, i) => ({ id: `cave:gone${i}`, state: 'estimated' as const, source: 'npc' as const }))
    const { knowledge, askAndWait } = setup([CAVE], { knowledge: createLocationKnowledge(stale) })
    await askAndWait('adult')
    expect(knowledge.has(CAVE.id)).toBe(true)
  })

  it('an empty pool answers with the none line after the wait', async () => {
    const { askAndWait } = setup([])
    const { start, answer } = await askAndWait('guard')
    expect(start).toBe(rumourWaitLine('start', 'guard'))
    expect(answer).not.toBe(start)
    expect(answer.length).toBeGreaterThan(0)
  })

  it('ignores kinds without approved copy (settlement, abandonedMine)', async () => {
    const { knowledge, askAndWait } = setup([loc('settlement:x', 'settlement', 0, -6000)])
    await askAndWait('adult')
    expect(knowledge.list()).toHaveLength(0)
  })
})
