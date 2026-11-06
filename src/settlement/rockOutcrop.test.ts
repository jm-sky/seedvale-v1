import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { createRockOutcrop } from './decorProps'

describe('createRockOutcrop', () => {
  const box = (h: number, v: number) => new THREE.Box3().setFromObject(createRockOutcrop(h, v))

  it('is deterministic for the same height + variant', () => {
    const a = (createRockOutcrop(3, 0.37).children[0] as THREE.Mesh).geometry.getAttribute('position').array
    const b = (createRockOutcrop(3, 0.37).children[0] as THREE.Mesh).geometry.getAttribute('position').array
    expect(Array.from(a)).toEqual(Array.from(b))
  })

  it('stands about its requested height above the ground and is partly buried', () => {
    for (const h of [1, 3, 6]) for (const v of [0.05, 0.4, 0.8]) {
      const bb = box(h, v)
      expect(bb.min.y).toBeLessThan(0) // sunk into the ground
      expect(bb.max.y).toBeGreaterThan(h * 0.5)
      expect(bb.max.y).toBeLessThan(h * 1.5)
    }
  })

  it('is one mesh with per-vertex colour variation (colour noise, not a flat slab)', () => {
    const g = createRockOutcrop(4, 0.6)
    expect(g.children).toHaveLength(1)
    const mesh = g.children[0] as THREE.Mesh
    const c = mesh.geometry.getAttribute('color').array as Float32Array
    let min = Infinity; let max = -Infinity
    for (let i = 0; i < c.length; i += 3) { min = Math.min(min, c[i]!); max = Math.max(max, c[i]!) }
    expect(max - min).toBeGreaterThan(0.04)
  })
})
