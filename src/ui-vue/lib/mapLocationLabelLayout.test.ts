import { describe, expect, it } from 'vitest'
import type { MapKnownLocation } from '../../world/map/mapTypes'
import {
  resolveMapLocationLabelPresentations,
  suppressedCaveLocationIdsForMineBinding,
} from './mapLocationLabelLayout'

function loc(
  id: string,
  x: number,
  z: number,
  label?: string,
  state: MapKnownLocation['state'] = 'confirmed',
): MapKnownLocation {
  return {
    id,
    kind: 'landmark',
    x,
    z,
    state,
    source: 'exploration',
    label,
  }
}

describe('suppressedCaveLocationIdsForMineBinding', () => {
  const binding = { mineId: 'abandonedMine:m1', caveLocationId: 'cave:c1' }

  it('suppresses backing cave only when mine and cave are both visible', () => {
    const locations = [
      loc('abandonedMine:m1', 10, 10, 'Kopalnia'),
      loc('cave:c1', 10, 10, 'Jaskinia'),
    ]
    expect(suppressedCaveLocationIdsForMineBinding(locations, binding)).toEqual(new Set(['cave:c1']))
  })

  it('does not suppress when only cave is known', () => {
    expect(suppressedCaveLocationIdsForMineBinding([loc('cave:c1', 10, 10)], binding)).toEqual(new Set())
  })

  it('does not suppress coordinate coincidence with a different cave id', () => {
    const locations = [
      loc('abandonedMine:m1', 10, 10),
      loc('cave:other', 10, 10),
    ]
    expect(suppressedCaveLocationIdsForMineBinding(locations, binding)).toEqual(new Set())
  })
})

describe('resolveMapLocationLabelPresentations', () => {
  const identityCanvas = (location: MapKnownLocation) => ({ x: location.x, y: location.z })
  const measure = (text: string) => text.length * 6

  it('hides cave marker when mine binding pair is visible', () => {
    const binding = { mineId: 'abandonedMine:m1', caveLocationId: 'cave:c1' }
    const locations = [
      loc('abandonedMine:m1', 100, 100, 'Kopalnia'),
      loc('cave:c1', 100, 100, 'Jaskinia'),
      loc('cave:far', 500, 500, 'Daleka'),
    ]
    const result = resolveMapLocationLabelPresentations(
      locations,
      new Set(),
      binding,
      identityCanvas,
      measure,
    )
    const byId = new Map(result.map((r) => [r.location.id, r]))
    expect(byId.get('abandonedMine:m1')?.showMarker).toBe(true)
    expect(byId.has('cave:c1')).toBe(false)
    expect(byId.get('cave:far')?.showMarker).toBe(true)
  })

  it('gives active navigation target first non-colliding placement', () => {
    const locations = [
      loc('settlement:a', 0, 0, 'Alpha'),
      loc('settlement:b', 0, 0, 'Bravo'),
    ]
    const first = resolveMapLocationLabelPresentations(
      locations,
      new Set(['settlement:b']),
      null,
      identityCanvas,
      measure,
    )
    const second = resolveMapLocationLabelPresentations(
      [locations[1], locations[0]],
      new Set(['settlement:b']),
      null,
      identityCanvas,
      measure,
    )
    const bFirst = first.find((r) => r.location.id === 'settlement:b')
    const bSecond = second.find((r) => r.location.id === 'settlement:b')
    expect(bFirst?.showLabel).toBe(true)
    expect(bSecond?.showLabel).toBe(true)
    expect(bFirst?.labelOffsetX).toBe(bSecond?.labelOffsetX)
    expect(bFirst?.labelOffsetY).toBe(bSecond?.labelOffsetY)
  })

  it('hides lowest-priority label when every fixed offset is occupied', () => {
    const locations = Array.from({ length: 8 }, (_, i) =>
      loc(`settlement:${String(i).padStart(2, '0')}`, 0, 0, `Place ${i}`, i === 7 ? 'estimated' : 'confirmed'),
    )
    const result = resolveMapLocationLabelPresentations(
      locations,
      new Set(),
      null,
      identityCanvas,
      measure,
    )
    const lowest = result.find((r) => r.location.id === 'settlement:07')
    expect(lowest?.showLabel).toBe(false)
    expect(result.some((r) => r.location.id !== 'settlement:07' && r.showLabel)).toBe(true)
  })
})
