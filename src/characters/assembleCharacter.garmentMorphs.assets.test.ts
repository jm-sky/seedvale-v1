import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { describe, expect, it, vi } from 'vitest'
import type { CharacterAppearance } from './characterTypes'
import { assembleCharacter } from './assembleCharacter'
import type { Object3D, SkinnedMesh } from 'three'

// Exercise production assembly/rebinding using real GLB geometry, rigs and clips.
// Only disk loading and materials are substituted: CPU skinning needs no DOM/GPU.
vi.mock('../assets/loadGltf', () => ({
  loadGltf: async (url: string) => (await loadOnDisk(url)).scene,
  loadGltfAnimated: (url: string) => loadOnDisk(url),
}))

async function loadOnDisk(url: string) {
  const bytes = await readFile(resolve(import.meta.dirname, '../../public', url.slice(1)))
  const jsonLength = bytes.readUInt32LE(12)
  const json = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString())
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) delete primitive.material
  }
  delete json.materials
  const text = JSON.stringify(json)
  const padded = Buffer.from(text.padEnd(Math.ceil(Buffer.byteLength(text) / 4) * 4, ' '))
  const binaryChunk = bytes.subarray(20 + jsonLength)
  const glb = Buffer.alloc(20 + padded.length + binaryChunk.length)
  bytes.copy(glb, 0, 0, 20)
  glb.writeUInt32LE(glb.length, 8)
  glb.writeUInt32LE(padded.length, 12)
  padded.copy(glb, 20)
  binaryChunk.copy(glb, 20 + padded.length)
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  return loader.parseAsync(glb.buffer as ArrayBuffer, '')
}


function garmentMeshes(root: Object3D): SkinnedMesh[] {
  const out: SkinnedMesh[] = []
  root.traverse((o) => {
    const m = o as SkinnedMesh
    if (m.isSkinnedMesh && /^(EQ_|Female_NobleBodice|NobleBodice|WorkSkirt)/i.test(m.name)) out.push(m)
  })
  return out
}

describe('garment morphs survive production rebinding', () => {
  it.each(['heavy', 'slim'] as const)('%s: named dictionaries + non-zero weights, independent per actor', async (build) => {
    const appearance = (b: 'heavy' | 'slim' | 'muscular'): CharacterAppearance => ({
      sex: 'Female', outfit: 'Peasant', head: 'Base', hair: 'Long', facialHair: 'none',
      garments: ['NobleBodice', 'WorkSkirt'], clothTint: null, build: b,
    })
    const a = await assembleCharacter(appearance(build))
    const b = await assembleCharacter(appearance(build === 'heavy' ? 'slim' : 'heavy'))
    expect(a.warnings).toEqual([])
    const garments = garmentMeshes(a.scene)
    expect(garments.length).toBeGreaterThan(0)
    const wanted = build === 'heavy' ? 'Fat' : 'Slim'
    const other = build === 'heavy' ? 'Slim' : 'Fat'
    for (const mesh of garments) {
      expect(Object.keys(mesh.morphTargetDictionary ?? {}), mesh.name).toContain(wanted)
      expect(mesh.morphTargetInfluences![mesh.morphTargetDictionary![wanted]!], mesh.name).toBe(1)
      expect(mesh.morphTargetInfluences![mesh.morphTargetDictionary![other]!], mesh.name).toBe(0)
    }
    for (const mesh of garmentMeshes(b.scene)) {
      expect(mesh.morphTargetInfluences![mesh.morphTargetDictionary![wanted]!], mesh.name).toBe(0)
    }
  })
})
