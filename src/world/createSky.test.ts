import {
  type DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  type ShaderMaterial,
} from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { WeatherState } from './weather'
import { createSky } from './createSky'

function weather(overrides: Partial<WeatherState>): WeatherState {
  return { type: 'clear', intensity: 0, temperature: 12, startedAt: 0, endsAt: 0.3, ...overrides }
}

const NOON = 1

function stubWindow(search: string): void {
  vi.stubGlobal('window', { location: { search } })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function cloudUniforms(sky: ReturnType<typeof createSky>): ShaderMaterial['uniforms'] {
  return (sky.mesh.material as ShaderMaterial).uniforms
}

function noiseTexture(sky: ReturnType<typeof createSky>): DataTexture {
  return cloudUniforms(sky).uSvCloudNoise!.value as DataTexture
}

describe('createSky cloud attachment (world-terrain-054)', () => {
  it('keeps built-in cloudCoverage at 0 and injects a unique cloud fragment path', () => {
    const sky = createSky({ inclination: 0.5, azimuth: 0.25, turbidity: 2, rayleigh: 1 })
    const material = sky.mesh.material as ShaderMaterial
    expect(material.uniforms.cloudCoverage!.value).toBe(0)

    const frag = material.fragmentShader
    expect(frag.split('void main() {').length - 1).toBe(1)
    expect(frag.split('gl_FragColor = vec4( texColor, 1.0 );').length - 1).toBe(1)
    expect(frag).toContain('uSvCloudNoise')
    expect(frag).toContain('svApplyClouds')
    expect(frag.indexOf('texColor = svApplyClouds')).toBeLessThan(
      frag.indexOf('gl_FragColor = vec4( texColor, 1.0 );'),
    )

    const tex = noiseTexture(sky)
    expect(tex.wrapS).toBe(RepeatWrapping)
    expect(tex.wrapT).toBe(RepeatWrapping)
    expect(tex.magFilter).toBe(LinearFilter)
    expect(tex.minFilter).toBe(LinearMipmapLinearFilter)
    expect(tex.colorSpace).toBe(NoColorSpace)
    sky.dispose()
  })

  it('snaps first cover, eases later cover, and drifts on clamped dt', () => {
    const sky = createSky({ inclination: 0.5, azimuth: 0.25, turbidity: 2, rayleigh: 1 })
    const u = cloudUniforms(sky)

    sky.updateClouds(0.05, weather({ type: 'storm', intensity: 1 }), NOON)
    expect(u.uSvCloudCover!.value).toBe(1)
    expect(u.uSvCloudOpacity!.value).toBe(0.9)
    expect(u.uSvCloudEnabled!.value).toBe(1)

    const offsetAfterFirst = (u.uSvCloudOffset!.value as { x: number, y: number }).x

    sky.updateClouds(0.5, weather({ type: 'clear', intensity: 0 }), NOON)
    expect(u.uSvCloudCover!.value).toBeLessThan(1)
    expect(u.uSvCloudCover!.value).toBeGreaterThan(0.5)

    // V1 clamps frame dt to 0.05; follow constant is ~7s → need many steps to settle.
    for (let i = 0; i < 1000; i++) {
      sky.updateClouds(0.05, weather({ type: 'clear', intensity: 0 }), NOON)
    }
    expect(u.uSvCloudCover!.value).toBeCloseTo(0.15, 2)
    expect((u.uSvCloudOffset!.value as { x: number }).x).toBeGreaterThan(offsetAfterFirst)
    sky.dispose()
  })

  it('zeros cloud opacity when weather debug systems are disabled', () => {
    stubWindow('?debugDisableSystems=weather')
    const sky = createSky({ inclination: 0.5, azimuth: 0.25, turbidity: 2, rayleigh: 1 })
    const u = cloudUniforms(sky)
    sky.updateClouds(0.05, weather({ type: 'rain', intensity: 1 }), NOON)
    expect(u.uSvCloudOpacity!.value).toBe(0)
    expect(u.uSvCloudEnabled!.value).toBe(0)
    expect(u.uSvCloudCover!.value).toBeGreaterThanOrEqual(0.72)
    sky.dispose()
  })

  it('disposes the noise texture before the Sky material', () => {
    const sky = createSky({ inclination: 0.5, azimuth: 0.25, turbidity: 2, rayleigh: 1 })
    const material = sky.mesh.material as ShaderMaterial
    const tex = noiseTexture(sky)
    const order: string[] = []
    vi.spyOn(tex, 'dispose').mockImplementation(() => {
      order.push('texture')
    })
    vi.spyOn(material, 'dispose').mockImplementation(() => {
      order.push('material')
    })
    sky.dispose()
    expect(order).toEqual(['texture', 'material'])
  })
})
