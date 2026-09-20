import { describe, expect, it } from 'vitest'
import type { MerchantJourneyState } from './merchantJourney'
import { resolveNpcPresentationOwner, shouldMaterializeNpcAt } from './npcPresentationOwner'

function journey(phase: MerchantJourneyState['phase'], destinationSettlementId = 'b'): MerchantJourneyState {
  return {
    homeSettlementId: 'home',
    destinationSettlementId,
    phase,
  }
}

describe('resolveNpcPresentationOwner', () => {
  it('procedural resident with no override materializes at its source settlement', () => {
    const owner = resolveNpcPresentationOwner({ sourceSettlementId: 'source', merchantJourney: null })
    expect(owner).toEqual({ kind: 'settlement', settlementId: 'source' })
    expect(shouldMaterializeNpcAt(owner, 'source')).toBe(true)
    expect(shouldMaterializeNpcAt(owner, 'other')).toBe(false)
  })

  it('residency override materializes at the override settlement, not the source', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'sponsor',
      residencyOverride: 'founded',
      merchantJourney: null,
    })
    expect(owner).toEqual({ kind: 'settlement', settlementId: 'founded' })
    expect(shouldMaterializeNpcAt(owner, 'sponsor')).toBe(false)
    expect(shouldMaterializeNpcAt(owner, 'founded')).toBe(true)
  })

  it('merchant outbound has no live presentation anywhere', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'home',
      merchantJourney: journey('outbound'),
    })
    expect(owner).toEqual({ kind: 'none' })
    expect(shouldMaterializeNpcAt(owner, 'home')).toBe(false)
  })

  it('merchant visiting materializes only at the destination', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'home',
      merchantJourney: journey('visiting', 'destination'),
    })
    expect(owner).toEqual({ kind: 'settlement', settlementId: 'destination' })
    expect(shouldMaterializeNpcAt(owner, 'home')).toBe(false)
    expect(shouldMaterializeNpcAt(owner, 'destination')).toBe(true)
  })

  it('merchant returning has no live presentation anywhere', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'home',
      merchantJourney: journey('returning'),
    })
    expect(owner).toEqual({ kind: 'none' })
  })

  it('an active merchant journey wins over a residency override', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'home',
      residencyOverride: 'founded',
      merchantJourney: journey('visiting', 'destination'),
    })
    expect(owner).toEqual({ kind: 'settlement', settlementId: 'destination' })
  })

  it('sponsor settlement never re-materializes a founder after residency moved elsewhere', () => {
    const owner = resolveNpcPresentationOwner({
      sourceSettlementId: 'sponsor',
      residencyOverride: 'founded',
      merchantJourney: null,
    })
    expect(shouldMaterializeNpcAt(owner, 'sponsor')).toBe(false)
  })

  /**
   * Duplicate-materialization guard (plan settlements-021 §"Stage A" /
   * verification): every call site — `createSettlement()`'s own resident
   * suppression and `SettlementsManager.resolveTravellingVisitors()` — must
   * consult this same resolver before materializing a presentation, so a
   * duplicate live `NpcAgent` for one `NpcId` is structurally impossible
   * rather than merely undetected. `resolveNpcPresentationOwner` always
   * returns a single `NpcPresentationOwner` (one `settlementId` or `none`),
   * so at most one settlement can ever satisfy `shouldMaterializeNpcAt` for
   * the same input — this asserts that invariant directly across every
   * scenario in this suite, standing in for the "debug assertion" duplicate
   * guard the plan calls out (never a second runtime ownership registry).
   */
  it('at most one settlement may materialize a given npc for any input (no duplicate live agent)', () => {
    const candidateSettlements = ['source', 'founded', 'sponsor', 'destination', 'home', 'other']
    const scenarios: Parameters<typeof resolveNpcPresentationOwner>[0][] = [
      { sourceSettlementId: 'source', merchantJourney: null },
      { sourceSettlementId: 'sponsor', residencyOverride: 'founded', merchantJourney: null },
      { sourceSettlementId: 'home', merchantJourney: journey('outbound') },
      { sourceSettlementId: 'home', merchantJourney: journey('visiting', 'destination') },
      { sourceSettlementId: 'home', merchantJourney: journey('returning') },
      { sourceSettlementId: 'home', residencyOverride: 'founded', merchantJourney: journey('visiting', 'destination') },
    ]
    for (const scenario of scenarios) {
      const owner = resolveNpcPresentationOwner(scenario)
      const materializingSettlements = candidateSettlements.filter((id) => shouldMaterializeNpcAt(owner, id))
      expect(materializingSettlements.length).toBeLessThanOrEqual(1)
    }
  })
})
