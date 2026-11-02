import { beforeEach, describe, expect, it } from 'vitest'
import type { SettlementCell } from '../settlement/settlementGenerator'
import type { CemeterySettlementRef } from './cemeteryAssignment'
import {
  cemeteryAssignmentId,
  cemeteryIdForAssignment,
  cemeterySizeForServedSizes,
  clearCemeteryCaches,
  dedicatedCemeteryTopology,
  resolveCemeteryTopologyForSettlement,
  servedSettlementIdsForCemeteryId,
} from './cemeteryAssignment'

function ref(id: string, gx: number, gz: number, size: 'SM' | 'MD' | 'LG' | 'XL' = 'SM'): CemeterySettlementRef {
  return { id, gx, gz, x: gx * 280, z: gz * 280, size }
}

function peekMap(refs: CemeterySettlementRef[]) {
  const map = new Map(refs.map((r) => [`${r.gx}_${r.gz}`, r]))
  return (cell: SettlementCell) => map.get(`${cell.gx}_${cell.gz}`) ?? null
}

describe('cemeteryAssignment (world-terrain-016)', () => {
  beforeEach(() => clearCemeteryCaches())

  it('gives every settlement — SM included — its own dedicated cemetery (Q81-b, 059 W4)', () => {
    const a = ref('0_0', 0, 0, 'SM')
    const b = ref('1_0', 1, 0, 'SM')
    const peek = peekMap([a, b])
    const topoA = resolveCemeteryTopologyForSettlement('0_0', peek)!
    const topoB = resolveCemeteryTopologyForSettlement('1_0', peek)!
    expect(topoA.intent).toBe('dedicated')
    expect(topoB.intent).toBe('dedicated')
    expect(topoA.servedSettlementIds).toEqual(['0_0'])
    expect(topoB.servedSettlementIds).toEqual(['1_0'])
    expect(topoA.assignmentId).not.toBe(topoB.assignmentId)
    expect(topoA).toEqual(dedicatedCemeteryTopology(a))
  })

  it('is order-independent', () => {
    const peek = peekMap([ref('0_0', 0, 0, 'SM'), ref('1_0', 1, 0, 'MD')])
    const first = resolveCemeteryTopologyForSettlement('1_0', peek)!
    clearCemeteryCaches()
    resolveCemeteryTopologyForSettlement('0_0', peek)
    expect(resolveCemeteryTopologyForSettlement('1_0', peek)!.assignmentId).toBe(first.assignmentId)
  })

  it('derives stable cemetery ids and reverse lookup', () => {
    const assignmentId = cemeteryAssignmentId(['0_0', '1_0'])
    const cemeteryId = cemeteryIdForAssignment(assignmentId, 42)
    expect(cemeteryId.startsWith('cemetery:a:0_0+1_0:')).toBe(true)
    expect(servedSettlementIdsForCemeteryId(cemeteryId)).toEqual(['0_0', '1_0'])
    expect(servedSettlementIdsForCemeteryId('cemetery:w:1:2:0:abc')).toEqual([])
  })
})

describe('cemeterySizeForServedSizes (Q47: crypt count follows settlement size)', () => {
  it('maps OUTPOST/SM → SM, MD → MD, LG/XL → LG, shared pair → MD', () => {
    expect(cemeterySizeForServedSizes(['OUTPOST'])).toBe('SM')
    expect(cemeterySizeForServedSizes(['SM'])).toBe('SM')
    expect(cemeterySizeForServedSizes(['MD'])).toBe('MD')
    expect(cemeterySizeForServedSizes(['LG'])).toBe('LG')
    expect(cemeterySizeForServedSizes(['XL'])).toBe('LG')
    expect(cemeterySizeForServedSizes(['SM', 'SM'])).toBe('MD')
  })
})
