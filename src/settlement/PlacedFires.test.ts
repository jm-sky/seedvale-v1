import { Scene } from 'three'
import { describe, expect, it } from 'vitest'
import {
  createPlacedFires,
  HABITAT_BURN_DESPAWN_DELAY,
  isPlayerPlacedFire,
  isRemovablePlacedFireKind,
  pileBodyScale,
} from './PlacedFires'

describe('habitat-destroy fire (plan 137)', () => {
  it('is not a player camp — no [E] palenisko prompt and not saved', () => {
    expect(isPlayerPlacedFire({ habitatBurn: false })).toBe(true)
    expect(isPlayerPlacedFire({ habitatBurn: true })).toBe(false)
  })

  it('despawns the ring shortly after burnout instead of leaving a 7-day pit', () => {
    expect(HABITAT_BURN_DESPAWN_DELAY).toBe(8)
    expect(HABITAT_BURN_DESPAWN_DELAY).toBeLessThan(60)
  })
})

describe('pileBodyScale (plan items-player-015)', () => {
  it('stays at the current-campfire baseline (1) while unlit or barely fuelled', () => {
    expect(pileBodyScale(0)).toBe(1)
    expect(pileBodyScale(1)).toBe(1)
  })

  it('grows smoothly (no jumps) as fuel ratio increases past the dead zone', () => {
    const samples = [1, 2, 3, 4, 5, 6, 7, 10, 100].map(pileBodyScale)
    for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1]!)
  })

  it('never exceeds the maximum bonfire scale of 3', () => {
    expect(pileBodyScale(6)).toBeCloseTo(3)
    expect(pileBodyScale(1000)).toBe(3)
  })
})

describe('placed fire removal and hasBurned (plan items-player-058)', () => {
  it('treats only simple and pit as removable kinds', () => {
    expect(isRemovablePlacedFireKind('simple')).toBe(true)
    expect(isRemovablePlacedFireKind('pit')).toBe(true)
    expect(isRemovablePlacedFireKind('pile')).toBe(false)
  })

  it('remove() deletes exactly that fire and is a no-op when repeated', () => {
    const fires = createPlacedFires(new Scene(), () => 0)
    const first = fires.place(1, 2, 'pit')
    const second = fires.place(4, 5, 'pile')
    expect(fires.remove(first.id)).toBe(true)
    expect(fires.find(first.id)).toBeUndefined()
    expect(fires.find(second.id)?.id).toBe(second.id)
    expect(fires.nodes().some((entry) => entry.id === first.id)).toBe(false)
    expect(fires.remove(first.id)).toBe(false)
    fires.dispose()
  })

  it('simple starts hasBurned and a cold pit stays false until lit', () => {
    const fires = createPlacedFires(new Scene(), () => 0, [
      { id: 'saved-pit', x: 0, z: 0, kind: 'pit', grate: false, hasBurned: false },
    ])
    const simple = fires.place(2, 2, 'simple')
    expect(simple.hasBurned).toBe(true)
    expect(fires.find('saved-pit')?.hasBurned).toBe(false)
    const pit = fires.find('saved-pit')!
    pit.fire.light()
    fires.update(0.016)
    expect(pit.hasBurned).toBe(true)
    expect(fires.nodes().find((entry) => entry.id === 'saved-pit')?.hasBurned).toBe(true)
    fires.dispose()
  })
})
