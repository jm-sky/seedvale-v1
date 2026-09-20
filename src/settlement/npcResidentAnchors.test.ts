import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import type { SettlementLandmarks } from './props'
import {
  proceduralResidentAnchorsFromLandmarks,
  residentAnchorsForHome,
  resolveNpcSettlementStorage,
} from './npcResidentAnchors'

function makeLandmarks(overrides: Partial<SettlementLandmarks> = {}): SettlementLandmarks {
  const garden = new Vector3(3, 0, 3)
  const home0 = new Vector3(0, 0, 0)
  return {
    well: new Vector3(1, 0, 1),
    stockpile: new Vector3(2, 0, 2),
    garden,
    gardens: [garden],
    cultivationAnchors: [],
    haySpots: [],
    market: new Vector3(4, 0, 4),
    markets: [],
    blacksmithWorkplaces: [],
    homes: [home0],
    houses: [],
    trees: [],
    dockRoute: [],
    landPlots: [],
    householdStorages: [],
    householdWoodStorages: [new Vector3(0.5, 0, 0.5)],
    settlementStorage: new Vector3(5, 0, 5),
    noticeBoard: new Vector3(7, 0, 7),
    ...overrides,
  }
}

describe('proceduralResidentAnchorsFromLandmarks', () => {
  it('reproduces the exact current procedural targets', () => {
    const landmarks = makeLandmarks()
    const anchors = proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well')

    expect(anchors.waterSources).toEqual([{ position: landmarks.well, queueId: 's1:well' }])
    expect(anchors.fallbackFoodAnchor).toBe(landmarks.garden)
    expect(anchors.wood).toEqual({ trees: landmarks.trees, plaza: undefined })
    expect(anchors.fishingAnchor).toBeNull()
    expect(anchors.dockRoute).toBe(landmarks.dockRoute)
    expect(anchors.settlementStorage).toEqual({ food: landmarks.settlementStorage, wood: landmarks.stockpile })
    expect(anchors.patrolPoints).toEqual([landmarks.well, landmarks.market])
    expect(anchors.pasture).toBeNull()
    expect(anchors.collisionFallbackAnchors).toEqual([landmarks.well, landmarks.stockpile, landmarks.garden])
  })

  it('prefers real per-well entries (with their own queue id) over the single-well fallback', () => {
    const wellAPos = new Vector3(10, 0, 10)
    const wellBPos = new Vector3(20, 0, 20)
    const landmarks = makeLandmarks({
      wells: [
        { id: 'well:a', position: wellAPos, queueId: 'well-a', familyIndex: null, isCentral: true },
        { id: 'well:b', position: wellBPos, queueId: 'well-b', familyIndex: 0, isCentral: false },
      ],
    })
    const anchors = proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well')
    expect(anchors.waterSources).toEqual([
      { position: wellAPos, queueId: 'well-a' },
      { position: wellBPos, queueId: 'well-b' },
    ])
  })

  it('projects a real pasture into the narrow x/z/radius shape', () => {
    const landmarks = makeLandmarks({
      pasture: {
        position: new Vector3(30, 0, 30),
        radius: 12,
        trough: new Vector3(31, 0, 31),
        well: new Vector3(29, 0, 29),
      },
    })
    const anchors = proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well')
    expect(anchors.pasture).toEqual({ x: 30, z: 30, radius: 12 })
  })
})

describe('residentAnchorsForHome', () => {
  it('resolves this resident\'s own household wood-pile point by matching home position', () => {
    const landmarks = makeLandmarks()
    const settlementAnchors = proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well')
    const anchors = residentAnchorsForHome(settlementAnchors, landmarks.homes[0]!, landmarks)
    expect(anchors.householdWoodStorage).toBe(landmarks.householdWoodStorages[0])
  })

  it('falls back to the resident\'s own home when no household wood-pile matches (e.g. a travelling visitor)', () => {
    const landmarks = makeLandmarks()
    const settlementAnchors = proceduralResidentAnchorsFromLandmarks(landmarks, 's1:well')
    const visitorHome = new Vector3(99, 0, 99)
    const anchors = residentAnchorsForHome(settlementAnchors, visitorHome, landmarks)
    expect(anchors.householdWoodStorage).toBe(visitorHome)
  })
})

describe('resolveNpcSettlementStorage', () => {
  it('picks food/wood from the narrow settlement-storage pair', () => {
    const storage = { food: new Vector3(1, 0, 1), wood: new Vector3(2, 0, 2) }
    expect(resolveNpcSettlementStorage(storage, 'food')).toBe(storage.food)
    expect(resolveNpcSettlementStorage(storage, 'wood')).toBe(storage.wood)
  })

  it('never fabricates a destination for a site with no real settlement storage (plan settlements-021)', () => {
    expect(resolveNpcSettlementStorage(null, 'food')).toBeNull()
    expect(resolveNpcSettlementStorage(null, 'wood')).toBeNull()
  })
})
