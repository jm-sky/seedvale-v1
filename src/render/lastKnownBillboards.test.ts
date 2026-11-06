import { Object3D, type Sprite } from 'three'
import { describe, expect, it } from 'vitest'
import type { LastKnownContact } from '../simulation/playerSightContacts'
import { createLastKnownBillboards } from './lastKnownBillboards'

const mk = (id: string, variant: LastKnownContact['variant'], x: number): LastKnownContact => ({
  actorId: id, variant, x, y: 1, z: 2, yaw: 0, createdAtSec: 0, contextKey: 's',
})

describe('lastKnownBillboards (no canvas)', () => {
  it('creates, reuses and hides pooled sprites; dispose releases', () => {
    const parent = new Object3D()
    const b = createLastKnownBillboards(parent)
    b.sync([mk('a', 'human', 5), mk('b', 'smallAnimal', 6)])
    const sprites = parent.children as Sprite[]
    expect(sprites).toHaveLength(2)
    expect(sprites.every(s => s.visible)).toBe(true)
    expect(sprites[0]!.position.x).toBe(5)
    expect(sprites[0]!.scale.y).toBeCloseTo(1.8)
    b.sync([mk('c', 'largeAnimal', 9)])
    expect(parent.children).toHaveLength(2)
    expect(sprites[0]!.visible).toBe(true)
    expect(sprites[0]!.position.x).toBe(9)
    expect(sprites[0]!.scale.x).toBeCloseTo(1.7)
    expect(sprites[1]!.visible).toBe(false)
    let disposed = 0
    sprites[0]!.material.addEventListener('dispose', () => disposed++)
    b.dispose()
    expect(parent.children).toHaveLength(0)
    expect(disposed).toBe(1)
  })
})
