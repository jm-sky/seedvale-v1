import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { AnimationMixer, Group, LoopOnce, type Object3D, type SkinnedMesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { describe, expect, it, vi } from 'vitest'
import type { CharacterAppearance } from '../characters/characterTypes'
import { assembleCharacter } from '../characters/assembleCharacter'
import { createAgentAnimationSet } from '../shared/agentAnimationSet'
import { installActorCullBounds } from './actorCullBounds'

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

function verifyPose(wrapper: Object3D) {
  wrapper.updateMatrixWorld(true)
  let vertices = 0
  wrapper.traverse((node) => {
    const mesh = node as SkinnedMesh
    if (!mesh.isSkinnedMesh) return
    expect(mesh.frustumCulled).toBe(true)
    mesh.skeleton.update()
    const sphere = mesh.boundingSphere!.clone().applyMatrix4(mesh.matrixWorld)
    const point = new Vector3()
    let furthest = 0
    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld)
      furthest = Math.max(furthest, point.distanceTo(sphere.center))
      vertices++
    }
    expect(furthest, mesh.name).toBeLessThanOrEqual(sphere.radius + 1e-5)
  })
  expect(vertices).toBeGreaterThan(0)
}

describe('actor culling on shipped animated characters', () => {
  it.each(['Male', 'Female'] as const)('contains the assembled %s kit through representative clips', async (sex) => {
    const appearance: CharacterAppearance = {
      sex, outfit: 'Peasant', head: 'Base', hair: 'Long', beard: sex === 'Male',
      garments: sex === 'Female' ? ['PeasantSkirt'] : [], clothTint: null,
    }
    const { scene, animations, warnings } = await assembleCharacter(appearance)
    expect(warnings).toEqual([])
    const wrapper = new Group()
    wrapper.add(scene)
    wrapper.scale.setScalar(0.6)
    const result = installActorCullBounds(wrapper)
    expect(result.fallback).toBe(0)
    expect(result.culled).toBeGreaterThan(2)
    const mixer = new AnimationMixer(scene)
    for (const name of ['Walk_Loop', 'Sprint_Loop', 'Sword_Attack', 'Sitting_Idle_Loop', 'Death01', 'Fixing_Kneeling', 'Interact']) {
      const clip = animations.find((candidate) => candidate.name === name)
      expect(clip, name).toBeDefined()
      const action = mixer.clipAction(clip!).setLoop(LoopOnce, 1).play()
      action.clampWhenFinished = true
      for (let sample = 0; sample <= 16; sample++) {
        mixer.setTime(clip!.duration * sample / 16)
        verifyPose(wrapper)
      }
      action.stop()
    }
    mixer.uncacheRoot(scene)
    const animation = createAgentAnimationSet<'idle' | 'layToIdle' | 'death'>(scene, animations)
    animation.resolve({ idle: ['Idle', 'Idle_Loop'], layToIdle: ['LayToIdle'], death: ['Death', 'Death01'] })
    // NpcAgent leaves the current animation running when LayToIdle is absent.
    expect(animation.has('layToIdle')).toBe(false)
    animation.playImmediate('idle')
    animation.update(0.5)
    verifyPose(wrapper)
    // Rehydrated corpses settle directly at the final death frame.
    animation.settleAtEnd('death')
    verifyPose(wrapper)
    animation.stopAll()
    // The installed per-instance sphere survives SkeletonUtils cloning.
    const copy = clone(wrapper)
    verifyPose(copy)
  }, 20_000)

  it('contains a legacy rig through its locomotion, attack, work and death clips', async () => {
    const { scene, animations } = await loadOnDisk('/models/characters/Worker.glb')
    const wrapper = new Group()
    wrapper.add(scene)
    expect(installActorCullBounds(wrapper).fallback).toBe(0)
    const mixer = new AnimationMixer(scene)
    for (const name of ['Walk', 'Run', 'Sword_Slash', 'Interact', 'Death']) {
      const clip = animations.find((candidate) => candidate.name === name)
      expect(clip, name).toBeDefined()
      const action = mixer.clipAction(clip!).setLoop(LoopOnce, 1).play()
      action.clampWhenFinished = true
      for (let sample = 0; sample <= 16; sample++) {
        mixer.setTime(clip!.duration * sample / 16)
        verifyPose(wrapper)
      }
      action.stop()
    }
    mixer.uncacheRoot(scene)
  }, 20_000)
})
