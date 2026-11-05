import { describe, expect, it } from 'vitest'
import type { WorldLocationCatalog } from './worldLocationCatalog'
import type { WorldLocation } from './worldLocationTypes'
import {
  CEMETERY_ARRIVAL_RADIUS,
  LAKE_ARRIVAL_EXTENT_MARGIN,
  LAKE_ARRIVAL_SHORE_RADIUS,
  type LandmarkArrivalTexel,
  PEAK_ARRIVAL_HEIGHT_WINDOW,
  PEAK_ARRIVAL_RADIUS,
  revealLandmarksOnArrival,
} from './landmarkArrival'
import { createLocationKnowledge } from './locationKnowledge'

const LAKE: WorldLocation = { id: 'lake:1,1', kind: 'lake', x: 1000, z: 1000, name: 'Jezioro Cichych Wód', discoveryWeight: 0.5 }
const PEAK: WorldLocation = { id: 'mountainPeak:2,2', kind: 'mountainPeak', x: -500, z: -500, name: 'Szczyt Orla', discoveryWeight: 0.5 }
const CEMETERY: WorldLocation = { id: 'cemetery:9', kind: 'cemetery', x: 0, z: 0, name: 'Cmentarz Cichy', discoveryWeight: 0.5 }

const LAKE_EXTENT = 200
const SUMMIT_H = 120

function catalogFor(locations: readonly WorldLocation[]): Pick<WorldLocationCatalog, 'getById' | 'lakeExtentRadius' | 'peakSummitHeight'> {
  return {
    getById: (id) => locations.find((l) => l.id === id) ?? null,
    lakeExtentRadius: (id) => id === LAKE.id ? LAKE_EXTENT : null,
    peakSummitHeight: (id) => id === PEAK.id ? SUMMIT_H : null,
  }
}

const DRY: LandmarkArrivalTexel = { h: 5, floorH: 5 }
const WET: LandmarkArrivalTexel = { h: 5, floorH: 1 }

function setup(state: 'estimated' | 'discovered' | 'confirmed', id: string, sampleTexel: (x: number, z: number) => LandmarkArrivalTexel) {
  const knowledge = createLocationKnowledge([{ id, state, source: 'npc' }])
  return { knowledge, deps: { catalog: catalogFor([LAKE, PEAK, CEMETERY]), knowledge, sampleTexel } }
}

describe('revealLandmarksOnArrival', () => {
  it('cemetery: confirms within its radius, not outside', () => {
    const { knowledge, deps } = setup('estimated', CEMETERY.id, () => DRY)
    expect(revealLandmarksOnArrival(deps, CEMETERY_ARRIVAL_RADIUS + 5, 0)).toEqual([])
    expect(knowledge.get(CEMETERY.id)?.state).toBe('estimated')
    expect(revealLandmarksOnArrival(deps, CEMETERY_ARRIVAL_RADIUS - 5, 0)).toEqual([{ id: CEMETERY.id, name: CEMETERY.name }])
    expect(knowledge.get(CEMETERY.id)).toEqual({ id: CEMETERY.id, state: 'confirmed', source: 'exploration' })
  })

  it('peak: needs horizontal arrival AND the summit height window', () => {
    const lowGround = setup('discovered', PEAK.id, () => ({ h: SUMMIT_H - PEAK_ARRIVAL_HEIGHT_WINDOW - 5, floorH: 0 }))
    expect(revealLandmarksOnArrival(lowGround.deps, PEAK.x + 10, PEAK.z)).toEqual([])
    const high = setup('discovered', PEAK.id, () => ({ h: SUMMIT_H - PEAK_ARRIVAL_HEIGHT_WINDOW + 2, floorH: 0 }))
    expect(revealLandmarksOnArrival(high.deps, PEAK.x + PEAK_ARRIVAL_RADIUS + 5, PEAK.z)).toEqual([])
    expect(revealLandmarksOnArrival(high.deps, PEAK.x + PEAK_ARRIVAL_RADIUS - 5, PEAK.z)).toEqual([{ id: PEAK.id, name: PEAK.name }])
    expect(high.knowledge.get(PEAK.id)?.state).toBe('confirmed')
  })

  it('lake: shore arrival needs dry ground with wet floor nearby, within extent + margin', () => {
    // Wet only east of x = 1000 + 20 (a shoreline 20 m east of the player's spot).
    const shore = (x: number): LandmarkArrivalTexel => (x > 1020 ? WET : DRY)
    const near = setup('estimated', LAKE.id, shore)
    expect(revealLandmarksOnArrival(near.deps, 1000, 1000)).toEqual([{ id: LAKE.id, name: LAKE.name }])

    const farFromWater = setup('estimated', LAKE.id, shore)
    expect(revealLandmarksOnArrival(farFromWater.deps, 1000 - LAKE_ARRIVAL_SHORE_RADIUS * 3, 1000)).toEqual([])

    const outsideGate = setup('estimated', LAKE.id, () => WET)
    expect(revealLandmarksOnArrival(outsideGate.deps, LAKE.x + LAKE_EXTENT + LAKE_ARRIVAL_EXTENT_MARGIN + 50, LAKE.z)).toEqual([])
  })

  it('lake: standing in the water does not count (player must be on dry ground)', () => {
    const swim = setup('estimated', LAKE.id, () => WET)
    expect(revealLandmarksOnArrival(swim.deps, 1000, 1000)).toEqual([])
    expect(swim.knowledge.get(LAKE.id)?.state).toBe('estimated')
  })

  it('never touches confirmed entries, unsupported kinds, stale ids or unknown ids', () => {
    const confirmed = setup('confirmed', CEMETERY.id, () => DRY)
    expect(revealLandmarksOnArrival(confirmed.deps, 0, 0)).toEqual([])
    const cave = createLocationKnowledge([{ id: 'cave:a', state: 'estimated', source: 'npc' }])
    const caveCatalog = catalogFor([{ id: 'cave:a', kind: 'cave', x: 0, z: 0, name: 'G', discoveryWeight: 0 }])
    expect(revealLandmarksOnArrival({ catalog: caveCatalog, knowledge: cave, sampleTexel: () => DRY }, 0, 0)).toEqual([])
    const stale = createLocationKnowledge([{ id: CEMETERY.id, state: 'estimated', source: 'npc' }])
    expect(revealLandmarksOnArrival({ catalog: catalogFor([]), knowledge: stale, sampleTexel: () => DRY }, 0, 0)).toEqual([])
  })

  it('is cheap when the knowledge store has no unconfirmed lake/peak/cemetery entry', () => {
    let samples = 0
    const knowledge = createLocationKnowledge([{ id: CEMETERY.id, state: 'confirmed', source: 'exploration' }])
    revealLandmarksOnArrival({ catalog: catalogFor([CEMETERY]), knowledge, sampleTexel: () => { samples++; return DRY } }, 0, 0)
    expect(samples).toBe(0)
  })
})
