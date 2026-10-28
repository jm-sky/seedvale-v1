import { describe, expect, it } from 'vitest'
import type { NpcAgent } from '../ai/NpcAgent'
import { type AcquiredSettlementResources, collectAgentBatch } from './createSettlement'

function makeOwned(): AcquiredSettlementResources {
  return {
    alive: true,
    released: false,
    group: null,
    lightsRegistered: false,
    collidersRegistered: false,
    treeIds: [],
    livestock: [],
    rats: null,
    signposts: null,
    agents: [],
    release: () => {},
  }
}

const fakeAgent = (id: string) => ({ id }) as unknown as NpcAgent

describe('collectAgentBatch', () => {
  it('collects fulfilled agents in input order and skips nulls', async () => {
    const owned = makeOwned()
    let resolveSlow!: (a: NpcAgent) => void
    const slow = new Promise<NpcAgent>((r) => { resolveSlow = r })
    const batch = collectAgentBatch(owned, [slow, Promise.resolve(null), Promise.resolve(fakeAgent('c'))])
    resolveSlow(fakeAgent('a'))
    await batch
    expect(owned.agents.map((a) => a.id)).toEqual(['a', 'c'])
  })

  it('waits for late siblings after the first rejection, then rethrows it', async () => {
    const owned = makeOwned()
    let resolveLate!: (a: NpcAgent) => void
    const late = new Promise<NpcAgent>((r) => { resolveLate = r })
    let settled = false
    const batch = collectAgentBatch(owned, [Promise.reject(new Error('boom')), late])
      .catch((err: Error) => { settled = true; return err })
    await Promise.resolve()
    await Promise.resolve()
    expect(settled).toBe(false)
    resolveLate(fakeAgent('late'))
    const err = await batch
    expect((err as Error).message).toBe('boom')
    expect(owned.agents.map((a) => a.id)).toEqual(['late'])
  })
})
