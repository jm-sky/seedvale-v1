import { describe, expect, it } from 'vitest'
import { writeActorSightSamples } from './actorSightSamples'

describe('writeActorSightSamples', () => {
  it('biped: centre first, 5-7 samples, shoulders lateral', () => {
    const out = new Float32Array(24)
    const n = writeActorSightSamples(out, 1, 2, 3, 0, 1.8, 0.2, 0.1, 'biped')
    expect(n).toBeGreaterThanOrEqual(5)
    expect(n).toBeLessThanOrEqual(7)
    expect(out[0]).toBeCloseTo(1)
    expect(out[1]).toBeCloseTo(2 + 1.8 * 0.65)
    expect(out[2]).toBeCloseTo(3)
    // yaw 0: forward +z, left = +x
    expect(out[9]).toBeCloseTo(1.2)
    expect(out[12]).toBeCloseTo(0.8)
  })
  it('quadruped: head forward along yaw', () => {
    const out = new Float32Array(24)
    const n = writeActorSightSamples(out, 0, 0, 0, Math.PI / 2, 1, 0.3, 0.8, 'quadruped')
    expect(n).toBe(6)
    expect(out[3]).toBeCloseTo(0.8)
    expect(out[4]).toBeCloseTo(0.8)
    expect(out[5]).toBeCloseTo(0, 5)
    expect(out[6]).toBeCloseTo(-0.8)
  })
})
