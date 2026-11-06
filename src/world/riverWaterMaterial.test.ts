import { describe, expect, it } from 'vitest'
import { createRiverWaterMaterial } from './riverWaterMaterial'

describe('createRiverWaterMaterial', () => {
  it('uses the integer lattice hash for flow noise (no float fract/sin hash — ANGLE D3D11 lattice steps, Q149)', () => {
    const { fragmentShader } = createRiverWaterMaterial()
    expect(fragmentShader).toContain('gpHash(i + ivec2(1, 1))')
    expect(fragmentShader).not.toMatch(/fract\(\s*sin|fract\(\s*p\s*\*\s*vec2|Hash21/)
  })
})
