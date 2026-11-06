import { describe, expect, it } from 'vitest'
import { fencePlacementColliders } from '../../settlement/settlementPalisade'
import { playerPalisadeSightBlocker, settlementPalisadeSightBlockers } from './palisadeSightBlockers'

const placement = { speciesIndex: 0, x: 5, z: 6, groundY: 12, rotationY: 0.4, scale: 1.1, lengthScale: 0.8 }

describe('palisade sight blockers', () => {
  it('settlement palisade mirrors its collider footprint, height 1.85*scale above groundY', () => {
    const [p] = settlementPalisadeSightBlockers([placement])
    const [c] = fencePlacementColliders([placement])
    expect(c!.type).toBe('obb')
    if (c!.type !== 'obb') return
    expect([p!.x, p!.z, p!.halfWidth, p!.halfDepth, p!.rotationY]).toEqual([c!.x, c!.z, c!.halfWidth, c!.halfDepth, c!.rotationY])
    expect(p!.minY).toBe(12)
    expect(p!.maxY).toBeCloseTo(12 + 1.85 * 1.1)
  })
  it('player palisade panel sits on the given ground height', () => {
    const p = playerPalisadeSightBlocker({ x: 1, z: 2, yaw: 0.5 }, 3)
    expect(p.minY).toBe(3)
    expect(p.maxY).toBeCloseTo(4.5)
    expect(p.rotationY).toBeCloseTo(-0.5)
  })
})
