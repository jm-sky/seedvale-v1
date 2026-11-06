import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three'
import type { WaterfallSite } from '../terrain/waterfallSites'

/**
 * Landmark-cascade spray / mist (plan world-terrain-064 W2, decision 5): camera-facing quads around the plunge pool,
 * animated entirely in the vertex shader from the shared water time uniform — no per-frame CPU, no texture, no shadow
 * casting, no depth write. One merged mesh (= one draw) per chunk that owns ≥ 1 landmark site (the site's bottom point).
 */

/** Quads per landmark site (96 tris), W0 budget. */
export const SPRAY_QUADS_PER_SITE = 48

const VERTEX_SHADER = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>

  uniform float uTime;
  attribute vec2 aCorner;
  attribute vec4 aSeed; // x phase, y speed, z size, w rise height

  varying vec2 vCorner;
  varying float vAlpha;

  void main() {
    float t = fract(uTime * aSeed.y + aSeed.x);
    vec3 center = position + vec3(0.0, t * aSeed.w, 0.0);
    // Camera-facing billboard: offset along the view-space right/up axes.
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    float size = aSeed.z * (0.45 + 0.9 * t);
    vec3 offset = (right * aCorner.x + up * aCorner.y) * size;
    vec4 world = modelMatrix * vec4(center + offset, 1.0);
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    vCorner = aCorner;
    vAlpha = sin(3.14159265 * t) * (1.0 - t * 0.5);
    #include <fog_vertex>
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>

  uniform vec3 uTint;

  varying vec2 vCorner;
  varying float vAlpha;

  void main() {
    float r = length(vCorner);
    float soft = 1.0 - smoothstep(0.35, 1.0, r);
    gl_FragColor = vec4(uTint, soft * vAlpha * 0.4);
    #include <fog_fragment>
  }
`

/** Small deterministic PRNG (mulberry32) seeded from the site id — spray layout is stable per site, no `Math.random`. */
function seededRng(key: string): () => number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CORNERS: readonly [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]

/** Merged spray geometry for the given landmark sites, positions relative to the chunk origin; `null` when empty. */
export function buildWaterfallSprayGeometry(
  sites: readonly WaterfallSite[],
  chunkOriginX: number,
  chunkOriginZ: number,
): BufferGeometry | null {
  if (sites.length === 0) return null
  const quads = sites.length * SPRAY_QUADS_PER_SITE
  const positions = new Float32Array(quads * 4 * 3)
  const corners = new Float32Array(quads * 4 * 2)
  const seeds = new Float32Array(quads * 4 * 4)
  const indices = new Uint32Array(quads * 6)

  let q = 0
  for (const site of sites) {
    const rng = seededRng(site.id)
    // Scatter over the pool: wider falls spread further; heavier drops throw spray higher.
    const spread = Math.max(3, site.widthM * 0.8 + 2)
    const rise = Math.min(14, 3 + site.dropM * 0.5)
    for (let n = 0; n < SPRAY_QUADS_PER_SITE; n++, q++) {
      const angle = rng() * Math.PI * 2
      const radius = Math.sqrt(rng()) * spread
      const cx = site.bottom.x + Math.cos(angle) * radius - chunkOriginX
      const cz = site.bottom.z + Math.sin(angle) * radius - chunkOriginZ
      const cy = site.bottom.water + 0.3
      const phase = rng()
      const speed = 0.12 + rng() * 0.12
      const size = 1.6 + rng() * 2.2
      const height = rise * (0.6 + rng() * 0.4)
      for (let c = 0; c < 4; c++) {
        const v = q * 4 + c
        positions.set([cx, cy, cz], v * 3)
        corners.set(CORNERS[c]!, v * 2)
        seeds.set([phase, speed, size, height], v * 4)
      }
      const b = q * 4
      indices.set([b, b + 1, b + 2, b, b + 2, b + 3], q * 6)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aCorner', new BufferAttribute(corners, 2))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 4))
  geometry.setIndex(new BufferAttribute(indices, 1))
  // Quads rise up to `rise` + size above the pool and drift sideways by `spread`; a generous sphere keeps culling safe.
  geometry.computeBoundingSphere()
  if (geometry.boundingSphere) geometry.boundingSphere.radius += 30
  return geometry
}

export type WaterfallSpray = {
  mesh: Mesh
  /** Shares the river material's clock so spray and whitewater stay in phase. */
  setTime: (time: number) => void
  setDayNight: (dayFactor: number) => void
  dispose: () => void
}

/** Night-dark tint so spray does not glow at night (same reasoning as the river foam colour). */
const DAY_TINT = new Color(0.92, 0.96, 1)
const NIGHT_TINT = new Color(0.12, 0.15, 0.22)

/** One spray mesh for the landmark sites owned by a chunk (`null` when it owns none). */
export function createWaterfallSpray(
  sites: readonly WaterfallSite[],
  chunkOriginX: number,
  chunkOriginZ: number,
): WaterfallSpray | null {
  const geometry = buildWaterfallSprayGeometry(sites, chunkOriginX, chunkOriginZ)
  if (!geometry) return null
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    fog: true,
    uniforms: UniformsUtils.merge([UniformsLib.fog, { uTime: { value: 0 }, uTint: { value: DAY_TINT.clone() } }]),
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  })
  const mesh = new Mesh(geometry, material)
  mesh.name = 'chunk-waterfall-spray'
  mesh.renderOrder = 2
  mesh.castShadow = false
  mesh.receiveShadow = false
  return {
    mesh,
    setTime(time) {
      material.uniforms.uTime!.value = time
    },
    setDayNight(dayFactor) {
      ;(material.uniforms.uTint!.value as Color).copy(NIGHT_TINT).lerp(DAY_TINT, dayFactor)
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      mesh.removeFromParent()
    },
  }
}
