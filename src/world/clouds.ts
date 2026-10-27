/**
 * Procedural sky clouds attached to V1's THREE.Sky material (plan
 * world-terrain-054). Replaces the former sprite billboard pool; weather
 * coverage/tint still come from `cloudAppearanceFor`. Noise algorithm and
 * dual-plane sampling are adapted from V3 `skyDome.ts`; V1 owns Preetham
 * sky, fog, lights, and weather state.
 * @domain world-terrain
 */
import {
  Color,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  RGBAFormat,
  type ShaderMaterial,
  Vector2,
} from 'three'
import type { WeatherState, WeatherType } from './weather'

const BASE_COVERAGE = 0.15
const BASE_TINT = 0xffffff

type CloudVisualProfile = {
  coverage: number
  tint: number
  opacity: number
}

/** `weather.intensity` is always 0 for `clear` (`weather.ts`), so
 *  `BASE_COVERAGE`/`BASE_TINT` already is the "few or no clouds" resting
 *  state. `fog` stays at baseline — `groundFog.ts` carries fog weather's
 *  visual identity instead. */
const CLOUD_VISUAL_PROFILES: Record<WeatherType, CloudVisualProfile> = {
  clear:  { coverage: 0.15, tint: 0xffffff, opacity: 0.8 },
  cloudy: { coverage: 0.85, tint: 0xf1f3f5, opacity: 0.8 },
  rain:   { coverage: 0.95, tint: 0xb8c0c8, opacity: 0.8 },
  // Darker + slightly more opaque than rain so storm holds against bright Preetham sky.
  storm:  { coverage: 1.00, tint: 0x6a7380, opacity: 0.9 },
  snow:   { coverage: 0.75, tint: 0xf7f9fb, opacity: 0.8 },
  fog:    { coverage: 0.15, tint: 0xf5f6f7, opacity: 0.8 },
}

/** After the intensity lerp, `storm`/`rain` must not drop back toward the
 *  clear-sky baseline — a weak or debug-forced cycle still has to read as
 *  overcast (force storm uses intensity 0.7). Other types keep the lerp. */
const COVERAGE_FLOOR: Record<WeatherType, number> = {
  clear: 0,
  cloudy: 0,
  fog: 0,
  snow: 0,
  rain: 0.72,
  storm: 0.92,
}

export type CloudAppearance = {
  coverage: number
  tint: number
  opacity: number
}

/** Ambient "light" clouds are multiplied by across the day/night cycle —
 *  not a replacement tint (that would erase weather-tint differences) but an
 *  RGB multiplier on top of `CLOUD_VISUAL_PROFILES`. Day is a no-op; dusk
 *  warms/dims slightly; night is a dark cool blue-grey. */
const DAY_CLOUD_LIGHT = new Color(0xffffff)
const DUSK_CLOUD_LIGHT = new Color(0xffdcc0)
const NIGHT_CLOUD_LIGHT = new Color(0x5a6b8c)
const tmpLightColor = new Color()
const tmpBaseColor = new Color()
const tmpTargetColor = new Color()

/** Mirrors `dayNight.ts`'s `fogColorFromElev` 3-stop smooth blend (same
 *  -0.3/0/0.3 elevation breakpoints) so clouds and fog transition through
 *  dusk/dawn in lockstep. */
function cloudLightFromElev(elev: number): Color {
  if (elev <= -0.3) return tmpLightColor.copy(NIGHT_CLOUD_LIGHT)
  if (elev >= 0.3) return tmpLightColor.copy(DAY_CLOUD_LIGHT)
  if (elev <= 0) {
    return tmpLightColor.copy(NIGHT_CLOUD_LIGHT).lerp(DUSK_CLOUD_LIGHT, (elev + 0.3) / 0.3)
  }
  return tmpLightColor.copy(DUSK_CLOUD_LIGHT).lerp(DAY_CLOUD_LIGHT, elev / 0.3)
}

/** Pure — blends the baseline toward the active weather type's profile by
 *  `weather.intensity`, then applies the day/night ambient multiplier.
 *  `storm`/`rain` clamp coverage to a high floor so a weak cycle still reads
 *  as overcast.
 *  @domain world-terrain */
export function cloudAppearanceFor(weather: WeatherState, elev: number): CloudAppearance {
  const profile = CLOUD_VISUAL_PROFILES[weather.type]
  const t = weather.intensity
  const blended = BASE_COVERAGE + (profile.coverage - BASE_COVERAGE) * t
  const coverage = Math.max(COVERAGE_FLOOR[weather.type], blended)
  tmpBaseColor.setHex(BASE_TINT)
  tmpTargetColor.setHex(profile.tint)
  tmpBaseColor.lerp(tmpTargetColor, t)
  tmpBaseColor.multiply(cloudLightFromElev(elev))
  return {
    coverage,
    tint: tmpBaseColor.getHex(),
    opacity: profile.opacity,
  }
}

/** Tiling value noise (R: large blobs, G: detail). Seeded LCG + lattice from
 *  V3 `skyDome.cloudNoiseData`; pure and deterministic for tests.
 *  @domain world-terrain */
export function cloudNoiseData(n = 256): Uint8Array {
  const d = new Uint8Array(n * n * 4)
  let seed = 0x2545f491
  const rnd = (): number => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const lattice = (cells: number): ((x: number, y: number) => number) => {
    const g = Float32Array.from({ length: cells * cells }, rnd)
    return (x, y) => {
      const fx = (x / n) * cells
      const fy = (y / n) * cells
      const i = Math.floor(fx)
      const j = Math.floor(fy)
      const sx = (fx - i) * (fx - i) * (3 - 2 * (fx - i))
      const sy = (fy - j) * (fy - j) * (3 - 2 * (fy - j))
      const at = (a: number, b: number): number => g[((b % cells) * cells + (a % cells)) % (cells * cells)]!
      const a = at(i, j) + (at(i + 1, j) - at(i, j)) * sx
      const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * sx
      return a + (b - a) * sy
    }
  }
  const o1 = lattice(4)
  const o2 = lattice(8)
  const o3 = lattice(16)
  const o4 = lattice(32)
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const k = (y * n + x) * 4
      d[k] = Math.round((o1(x, y) * 0.55 + o2(x, y) * 0.3 + o3(x, y) * 0.15) * 255)
      d[k + 1] = Math.round((o3(x, y) * 0.5 + o4(x, y) * 0.5) * 255)
      d[k + 2] = 0
      d[k + 3] = 255
    }
  }
  return d
}

const MAIN_ANCHOR = 'void main() {'
const OUTPUT_ANCHOR = 'gl_FragColor = vec4( texColor, 1.0 );'

const CLOUD_UNIFORM_DECL = /* glsl */ `
uniform sampler2D uSvCloudNoise;
uniform float uSvCloudCover;
uniform vec3 uSvCloudTint;
uniform float uSvCloudOpacity;
uniform vec2 uSvCloudOffset;
uniform float uSvCloudEnabled;

vec3 svApplyClouds( vec3 texColor, vec3 direction ) {
	if ( direction.y <= 0.0 || uSvCloudEnabled < 0.5 ) return texColor;
	vec2 uv = direction.xz / ( direction.y + 0.08 );
	// Shear/rotate the detail sample so lattice noise does not read as axis-aligned squares.
	vec2 uvR = vec2( uv.x * 0.866 - uv.y * 0.5, uv.x * 0.5 + uv.y * 0.866 );
	float r = texture2D( uSvCloudNoise, uv * 0.10 + uSvCloudOffset ).r;
	float g = texture2D( uSvCloudNoise, uvR * 0.34 + uSvCloudOffset * 1.7 ).g;
	float g2 = texture2D( uSvCloudNoise, uv * 0.55 + uSvCloudOffset * 2.3 ).g;
	float n = 0.62 * r + 0.25 * g + 0.13 * g2;
	float edge = 1.0 - clamp( uSvCloudCover, 0.0, 1.0 );
	// Wide softstep: softer silhouettes and slower visual dissolve as cover eases.
	float mask = smoothstep( edge - 0.16, edge + 0.32, n ) * smoothstep( 0.0, 0.16, direction.y );
	mask = pow( mask, 0.85 );
	return mix( texColor, uSvCloudTint, mask * clamp( uSvCloudOpacity, 0.0, 1.0 ) );
}
`

const CLOUD_APPLY = 'texColor = svApplyClouds( texColor, direction );\n\t\t\t'

/** Cover ease time constant (seconds). Longer than V3's 3s so storm→clear does not melt away. */
const CLOUD_FOLLOW_S = 7
const CLOUD_DRIFT = { x: 0.0020, z: 0.0009 }

function assertUniqueAnchor(source: string, anchor: string, label: string): number {
  let count = 0
  let idx = -1
  let from = 0
  while (true) {
    const i = source.indexOf(anchor, from)
    if (i < 0) break
    count++
    idx = i
    from = i + anchor.length
  }
  if (count !== 1) {
    throw new Error(
      `Sky cloud inject: expected unique ${label} (${JSON.stringify(anchor)}), found ${count}`,
    )
  }
  return idx
}

function injectCloudShader(fragmentShader: string): string {
  assertUniqueAnchor(fragmentShader, MAIN_ANCHOR, 'fragment void main()')
  assertUniqueAnchor(fragmentShader, OUTPUT_ANCHOR, 'gl_FragColor texColor assignment')
  const withDecls = fragmentShader.replace(MAIN_ANCHOR, `${CLOUD_UNIFORM_DECL}\n${MAIN_ANCHOR}`)
  return withDecls.replace(OUTPUT_ANCHOR, `${CLOUD_APPLY}${OUTPUT_ANCHOR}`)
}

export type SkyCloudController = {
  update: (dt: number, weather: WeatherState, elev: number, enabled: boolean) => void
  dispose: () => void
  /** Presentation cover after the last update (tests). */
  readonly shownCover: number
  /** Drift offset after the last update (tests). */
  readonly offset: Vector2
  /** Owned noise texture (tests / dispose spy). */
  readonly noiseTexture: DataTexture
}

/**
 * Attach V3-derived procedural clouds to an existing Sky `ShaderMaterial`.
 * Owns the noise texture and uniforms; does not dispose the Sky material.
 * @domain world-terrain
 */
export function attachCloudsToSky(material: ShaderMaterial): SkyCloudController {
  if (material.type !== 'ShaderMaterial' && !(material as { isShaderMaterial?: boolean }).isShaderMaterial) {
    throw new Error('Sky cloud inject: material is not a ShaderMaterial')
  }

  const noiseTexture = new DataTexture(cloudNoiseData(256), 256, 256, RGBAFormat)
  noiseTexture.wrapS = RepeatWrapping
  noiseTexture.wrapT = RepeatWrapping
  noiseTexture.magFilter = LinearFilter
  noiseTexture.minFilter = LinearMipmapLinearFilter
  noiseTexture.generateMipmaps = true
  noiseTexture.colorSpace = NoColorSpace
  noiseTexture.needsUpdate = true

  material.fragmentShader = injectCloudShader(material.fragmentShader)
  material.uniforms.uSvCloudNoise = { value: noiseTexture }
  material.uniforms.uSvCloudCover = { value: 0 }
  material.uniforms.uSvCloudTint = { value: new Color(1, 1, 1) }
  material.uniforms.uSvCloudOpacity = { value: 0 }
  material.uniforms.uSvCloudOffset = { value: new Vector2() }
  material.uniforms.uSvCloudEnabled = { value: 1 }
  material.needsUpdate = true

  let shownCover = 0
  let coverSeen = false
  let disposed = false
  const tint = new Color()
  const offset = material.uniforms.uSvCloudOffset!.value as Vector2

  const controller: SkyCloudController = {
    get shownCover() {
      return shownCover
    },
    get offset() {
      return offset
    },
    get noiseTexture() {
      return noiseTexture
    },
    update(dt, weather, elev, enabled) {
      if (disposed) return
      const appearance = cloudAppearanceFor(weather, elev)
      const clampedDt = Math.min(Math.max(dt, 0), 0.05)
      const target = Math.min(1, Math.max(0, appearance.coverage))
      if (!coverSeen) {
        coverSeen = true
        shownCover = target
      } else {
        shownCover += (target - shownCover) * Math.min(1, clampedDt / CLOUD_FOLLOW_S)
      }
      tint.setHex(appearance.tint)
      material.uniforms.uSvCloudCover!.value = shownCover
      ;(material.uniforms.uSvCloudTint!.value as Color).copy(tint)
      const opacity = enabled ? Math.min(1, Math.max(0, appearance.opacity)) : 0
      material.uniforms.uSvCloudOpacity!.value = opacity
      material.uniforms.uSvCloudEnabled!.value = enabled ? 1 : 0
      const drift = 1 + shownCover * 0.5
      offset.x += CLOUD_DRIFT.x * drift * clampedDt
      offset.y += CLOUD_DRIFT.z * drift * clampedDt
    },
    dispose() {
      if (disposed) return
      disposed = true
      noiseTexture.dispose()
    },
  }

  return controller
}
