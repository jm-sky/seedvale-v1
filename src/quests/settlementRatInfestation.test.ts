import { describe, expect, it } from 'vitest'
import {
  isSettlementRatInfestationResolved,
  settlementRatInfestationReminderLine,
  type SettlementRatInfestationSnapshot,
} from './settlementRatInfestation'

const snapshot = (
  storageDamaged: boolean,
  nestDestroyed: boolean,
  aliveRatCount: number,
  exists = true,
): SettlementRatInfestationSnapshot => ({ exists, storageDamaged, nestDestroyed, aliveRatCount })

describe('settlement rat infestation world condition (plan quests-progression-013 §11)', () => {
  it('stays unresolved when storage is still damaged even if the nest is gone', () => {
    expect(isSettlementRatInfestationResolved(snapshot(true, true, 0))).toBe(false)
  })

  it('stays unresolved when the nest is intact even if storage is repaired', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, false, 0))).toBe(false)
  })

  it('stays unresolved when more than one rat remains', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 2))).toBe(false)
  })

  it('is resolved when storage is repaired, the nest is destroyed, and at most one rat remains', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 1))).toBe(true)
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 0))).toBe(true)
  })

  it('uses distinct reminder lines for remaining work combinations', () => {
    const storageAndNest = settlementRatInfestationReminderLine(snapshot(true, false, 5))
    const nestOnly = settlementRatInfestationReminderLine(snapshot(false, false, 0))
    const ratsOnly = settlementRatInfestationReminderLine(snapshot(false, true, 3))
    const resolved = settlementRatInfestationReminderLine(snapshot(false, true, 1))
    expect(new Set([nestOnly, ratsOnly, resolved, storageAndNest]).size).toBe(4)
    expect(nestOnly).toContain('gniazdo')
    expect(ratsOnly).toContain('szczur')
    expect(resolved).toContain('plaga wygasła')
  })
})

describe('settlement rat infestation absence (plan quests-progression-078)', () => {
  it('does not treat a missing record plus 0 rats as resolved', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 0, false))).toBe(false)
  })

  it('does not treat a missing record plus 1 rat as resolved', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 1, false))).toBe(false)
  })

  it('does not claim the plague ended when the infestation record is absent', () => {
    const line = settlementRatInfestationReminderLine(snapshot(false, true, 0, false))
    expect(line).not.toContain('plaga wygasła')
  })

  it('stays unresolved after only killing rats, only repairing storage, or only destroying the nest', () => {
    expect(isSettlementRatInfestationResolved(snapshot(true, false, 0))).toBe(false)
    expect(isSettlementRatInfestationResolved(snapshot(false, false, 5))).toBe(false)
    expect(isSettlementRatInfestationResolved(snapshot(true, true, 5))).toBe(false)
  })

  it('resolves only for an existing infestation with repaired storage, destroyed nest, and at most one rat', () => {
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 1, true))).toBe(true)
    expect(isSettlementRatInfestationResolved(snapshot(false, true, 1, false))).toBe(false)
  })
})
