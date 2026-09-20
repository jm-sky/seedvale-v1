import { describe, expect, it } from 'vitest'
import type { VillagePasturePlan, VillagePlan } from './villagePlan'
import { resolveAuthoredRepairStructureIds, resolveCommunalFenceTarget } from './authoredRepairTargets'
import { PASTURE_ID } from './villagePlan'

function pastureWithSegments(): VillagePasturePlan {
  const origin = { x: 0, z: 0, y: 12 }
  return {
    id: PASTURE_ID,
    outsideCore: true,
    x: 0,
    z: 0,
    y: 12,
    radius: 11,
    well: origin,
    trough: origin,
    connection: origin,
    fenceSegments: [
      { id: 'pasture-fence-a', ax: -2, az: 0, bx: 2, bz: 0 },
      { id: 'pasture-fence-b', ax: 0, az: -2, bx: 0, bz: 2 },
    ],
  }
}

describe('resolveCommunalFenceTarget (plan quests-progression-073)', () => {
  it('binds the real pasture-fence-a segment when a pasture exists', () => {
    const plan = { pasture: pastureWithSegments() } as unknown as VillagePlan
    const target = resolveCommunalFenceTarget(plan)
    expect(target).toEqual({ structureId: 'pasture-fence-a', usesPastureSegment: true })
  })

  it('falls back to the first fence segment when pasture-fence-a is absent', () => {
    const pasture = pastureWithSegments()
    const plan = {
      pasture: { ...pasture, fenceSegments: [pasture.fenceSegments[1]!] },
    } as unknown as VillagePlan
    const target = resolveCommunalFenceTarget(plan)
    expect(target).toEqual({ structureId: 'pasture-fence-b', usesPastureSegment: true })
  })

  it('resolves the deterministic fallback id when the settlement has no pasture (SM/OUTPOST)', () => {
    expect(resolveCommunalFenceTarget(undefined)).toEqual({
      structureId: 'communal-fence-fallback',
      usesPastureSegment: false,
    })
    const plan = {} as unknown as VillagePlan
    expect(resolveCommunalFenceTarget(plan)).toEqual({
      structureId: 'communal-fence-fallback',
      usesPastureSegment: false,
    })
  })
})

describe('resolveAuthoredRepairStructureIds (plan quests-progression-073)', () => {
  it('resolves every id from family index 0, matching family-reserved-0', () => {
    const plan = { pasture: pastureWithSegments() } as unknown as VillagePlan
    const ids = resolveAuthoredRepairStructureIds(plan)
    expect(ids.householdFence).toBe('household-fence-0')
    expect(ids.foundation).toBe('building-house-0-foundation')
    expect(ids.loggingWagon).toBe('logging-wagon-0')
    expect(ids.communalFence).toEqual({ structureId: 'pasture-fence-a', usesPastureSegment: true })
  })

  it('never assumes a pasture exists', () => {
    const ids = resolveAuthoredRepairStructureIds(undefined)
    expect(ids.communalFence).toEqual({ structureId: 'communal-fence-fallback', usesPastureSegment: false })
  })
})
