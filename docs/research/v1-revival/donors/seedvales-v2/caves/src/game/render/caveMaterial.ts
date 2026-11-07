/**
 * Cave rock material (world--003 9.6): one material for floor + shell (one draw per cave). Medium/high use
 * `MeshStandardMaterial` (roughness 0.92, wet patches go glossy so a torch highlight moves over them), low uses Lambert
 * with the same albedo logic. The albedo logic is injected with `onBeforeCompile`; per-vertex bakes (AO, skylight, mouth
 * blend) come in the `cave` attribute, nothing is computed per frame. No new runtime textures.
 * @domain render
 * @subdomain caves
 */
import * as THREE from 'three'
import type { QualityProfile } from './quality'

/** The surface rock colour of the terrain mesh (terrainChunks ROCK): the mouth blends to it so the bank has no colour jump. */
const TERRAIN_ROCK = 0x77736b

/** Smoothed 0..1 "player is in a cave" shared by every cave material: the sun is scaled by the baked skylight (9.7). */
export const caveSunUniform = { value: 0 }
/**
 * Daylight 0..1 shared by every cave material: seen from underground the entrance region keeps its terrain albedo only by
 * day, so the warm cave ambient and fill light do not light the cutting like a lamp at night (world--003 9.9).
 */
export const caveDayUniform = { value: 1 }

export interface CaveMaterialTextures {
  floor: THREE.Texture | null
  wall: THREE.Texture | null
}

/** Noise helpers (file scope). */
const FUNCS = /* glsl */ `
float caveHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float caveNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(caveHash(i), caveHash(i + vec2(1.0, 0.0)), f.x), mix(caveHash(i + vec2(0.0, 1.0)), caveHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
`

/** Shader chunk replacing `map_fragment`: floor/wall by normal, anti-tiling, macro variation, strata, wet mask, mouth blend. */
const ALBEDO = /* glsl */ `
#ifdef USE_MAP
{
  vec2 uv = vMapUv;
  float macro = caveNoise(vCavePos.xz * 0.11 + vCavePos.y * 0.07);
  // Anti-tiling: a second sample of the same map at x0.37 scale, rotated, blended by the macro mask.
  vec2 uv2 = mat2(0.8, -0.6, 0.6, 0.8) * uv * 0.37;
  float floorK = smoothstep(0.55, 0.8, abs(vCaveNrm.y));
  vec4 a1 = mix(texture2D(map, uv), texture2D(uFloorMap, uv), floorK);
  vec4 a2 = mix(texture2D(map, uv2), texture2D(uFloorMap, uv2), floorK);
  vec3 rock = mix(a1.rgb, a2.rgb, smoothstep(0.3, 0.7, macro));
  // Macro colour variation and faint strata (+-10 to 15 %).
  rock *= 0.9 + 0.2 * caveNoise(vCavePos.xz * 0.37 + vCavePos.y * 0.21);
  rock *= 1.0 + 0.08 * sin(vCavePos.y * 1.3 + macro * 3.0);
  // Static wet mask: strong in depressions and at wall feet (low baked AO), medium on walls, weak on the ceiling.
  float low = clamp((1.0 - vCave.x) * 2.2, 0.0, 1.0);
  float wallK = 1.0 - floorK;
  float wetBase = mix(0.35 + 0.65 * low, 0.25 + 0.5 * low, wallK);
  caveWet = smoothstep(0.45, 0.7, caveNoise(vCavePos.xz * 0.23 - vCavePos.y * 0.31 + 7.0)) * wetBase;
  rock *= 1.0 - 0.3 * caveWet;
  // The mouth continues the terrain's rock colour; over the collar of the entrance patch (vCave.w) it fades to the per-vertex
  // terrain colour (D-LOOK-1), reaching it exactly at the border where the terrain mesh takes over.
  vec3 mouthCol = mix(uRockCol, vCaveCol, vCave.w);
  // Walls and lintels in the open (high baked skylight) are the same rock as the bank around them, not the dark cave texture: seen
  // from outside, in the shade of the cutting, they otherwise read as black voids (review 027 #10).
  float openWall = (1.0 - floorK) * vCaveOpen;
  float mouthK = max(max(vCave.z * 0.8, vCave.w), openWall);
  float tone = 0.8 + 0.4 * dot(rock, vec3(0.333));
  rock = mix(rock, mouthCol * mix(tone, 1.0, vCave.w), mouthK);
  diffuseColor.rgb *= rock;
  // The entrance region (cutting, banks, lintel) lies in daylight: its albedo is the terrain's own, not darkened by the
  // material colour and vertex shade of the interior, so the patch has no hard outline against the terrain (9.9).
  caveOpenCol = mouthCol * mix(tone, 1.0, vCave.w);
  caveWet *= 1.0 - vCaveOpen;
}
#endif
`

/** Creates the shared cave material for a quality profile (Standard on medium/high, Lambert on low). */
export function createCaveMaterial(profile: QualityProfile, tex: CaveMaterialTextures): THREE.MeshStandardMaterial | THREE.MeshLambertMaterial {
  const standard = profile !== 'low'
  const params = { vertexColors: true, side: THREE.DoubleSide, color: 0x9a948c, map: tex.wall }
  const mat = standard ? new THREE.MeshStandardMaterial({ ...params, roughness: 0.92, metalness: 0 }) : new THREE.MeshLambertMaterial(params)
  const rockCol = new THREE.Color(TERRAIN_ROCK)
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uFloorMap = { value: tex.floor ?? tex.wall }
    shader.uniforms.uRockCol = { value: rockCol }
    shader.uniforms.uCaveK = caveSunUniform
    shader.uniforms.uCaveDay = caveDayUniform
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 cave;\nattribute vec3 caveCol;\nattribute float caveOpen;\nvarying float vCaveOpen;\nvarying vec4 vCave;\nvarying vec3 vCaveCol;\nvarying vec3 vCavePos;\nvarying vec3 vCaveNrm;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCave = cave;\nvCaveOpen = caveOpen;\nvCaveCol = caveCol;\nvCavePos = position;\nvCaveNrm = normal;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vCaveOpen;\nvarying vec4 vCave;\nvarying vec3 vCaveCol;\nuniform float uCaveK;\nuniform float uCaveDay;\nvarying vec3 vCavePos;\nvarying vec3 vCaveNrm;\nuniform sampler2D uFloorMap;\nuniform vec3 uRockCol;\nfloat caveWet = 0.0;\nvec3 caveOpenCol = vec3(0.0);\n' + FUNCS)
      .replace('#include <map_fragment>', ALBEDO)
      .replace('#include <color_fragment>', '#include <color_fragment>\nif (caveOpenCol.r + caveOpenCol.g + caveOpenCol.b > 0.0) diffuseColor.rgb = mix(diffuseColor.rgb, caveOpenCol, vCaveOpen * mix(1.0, uCaveDay, uCaveK));')
      .replace('#include <lights_fragment_begin>', THREE.ShaderChunk.lights_fragment_begin.replace('getDirectionalLightInfo( directionalLight, directLight );', 'getDirectionalLightInfo( directionalLight, directLight );\n\t\tdirectLight.color *= mix(1.0, 0.6 * vCave.y, uCaveK) / max(0.05, 1.0 - 0.95 * uCaveK);'))
      .replace('#include <aomap_fragment>', '#include <aomap_fragment>\nfloat caveAo = mix(vCave.x, 1.0, vCaveOpen);\nreflectedLight.indirectDiffuse *= caveAo;\nreflectedLight.directDiffuse *= mix(0.65, 1.0, caveAo);')
    if (standard) shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.35, caveWet);')
  }
  mat.customProgramCacheKey = () => `cave5-${standard ? 'std' : 'lambert'}`
  return mat
}
