import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { AnimationMixer, Group, LoopOnce, type Object3D, type SkinnedMesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { describe, expect, it } from 'vitest'
import { prepareProp } from '../assets/loadGltf'
import { ANIMAL_DEFS, type AnimalKind } from '../fauna/animalDefs'
import { installActorCullBounds } from './actorCullBounds'
import { shareActorSkeletons } from './actorSkeletonSharing'

// world-terrain-068 A1 (Q173): every shipped skinned fauna GLB, through the production
// template path (prepareProp -> clone -> wrapper), stays inside the shared actor
// culling sphere across all of its clips, incl. death. CPU skinning, no GPU.
const FAUNA_GLBS: readonly (readonly [AnimalKind, string])[] = [
  ['wolf', 'wolf'], ['fox', 'fox'], ['deer', 'deer'], ['stag', 'stag'], ['bear', 'bear'],
  ['boar', 'wild_boar'], ['rabbit', 'rabbit'], ['horse', 'horse'], ['donkey', 'donkey'],
  ['cow', 'cow'], ['sheep', 'sheep'], ['dog', 'dog_husky'], ['dog', 'dog_shiba'], ['rat', 'rat'],
]
/** Rigid (non-skinned) fauna: native per-mesh bounds already follow node transforms. */
const RIGID_GLBS: readonly (readonly [AnimalKind, string])[] = [
  ['chicken', 'chicken'], ['duck', 'duck'], ['rooster', 'rooster'],
]
/** Largest juvenile x variant composition in use is <= 1.25 x 1.15; test above it. */
const WRAPPER_SCALE = 1.5

async function loadOnDisk(name: string) {
  const bytes = await readFile(resolve(import.meta.dirname, '../../public/models/fauna', `${name}.glb`))
  const jsonLength = bytes.readUInt32LE(12)
  const json = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString())
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) delete primitive.material
  }
  delete json.materials
  delete json.textures
  delete json.images
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

/** Same shape as createFauna/livestock: prepared template clone wrapped in a placed Group. */
async function buildAnimal(kind: AnimalKind, name: string) {
  const gltf = await loadOnDisk(name)
  const template = gltf.scene
  prepareProp(template, ANIMAL_DEFS[kind].modelHeight)
  const model = clone(template)
  const wrapper = new Group()
  wrapper.add(model)
  wrapper.position.set(12.5, 3.25, -7)
  wrapper.rotation.set(0, 0.7, 0)
  wrapper.scale.setScalar(WRAPPER_SCALE)
  return { wrapper, model, animations: gltf.animations }
}

function skinnedMeshes(root: Object3D): SkinnedMesh[] {
  const out: SkinnedMesh[] = []
  root.traverse((o) => { if ((o as SkinnedMesh).isSkinnedMesh) out.push(o as SkinnedMesh) })
  return out
}

function verifyPose(wrapper: Object3D) {
  wrapper.updateMatrixWorld(true)
  const point = new Vector3()
  let vertices = 0
  for (const mesh of skinnedMeshes(wrapper)) {
    expect(mesh.frustumCulled).toBe(true)
    mesh.skeleton.update()
    const sphere = mesh.boundingSphere!.clone().applyMatrix4(mesh.matrixWorld)
    let furthest = 0
    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld)
      furthest = Math.max(furthest, point.distanceTo(sphere.center))
      vertices++
    }
    expect(furthest, mesh.name).toBeLessThanOrEqual(sphere.radius + 1e-5)
  }
  expect(vertices).toBeGreaterThan(0)
}

describe('actor culling on shipped skinned fauna', () => {
  it.each(FAUNA_GLBS.flatMap(([kind, name]) => [[kind, name, false], [kind, name, true]] as const))(
    'contains %s (%s) through every clip incl. death (skeleton sharing: %s)',
    async (kind, name, shared) => {
      const { wrapper, model, animations } = await buildAnimal(kind, name)
      // Production order: optional skeleton sharing, then bind-pose bounds install.
      if (shared) shareActorSkeletons(wrapper)
      const result = installActorCullBounds(wrapper)
      expect(result.fallback).toBe(0)
      expect(result.culled).toBeGreaterThan(0)
      expect(animations.length).toBeGreaterThan(0)
      const mixer = new AnimationMixer(model)
      for (const clip of animations) {
        const action = mixer.clipAction(clip).setLoop(LoopOnce, 1).play()
        action.clampWhenFinished = true
        for (let sample = 0; sample <= 16; sample++) {
          mixer.setTime(clip.duration * sample / 16)
          verifyPose(wrapper)
        }
        action.stop()
      }
      // Corpse-rehydrate frame: death clip clamped at its end.
      const death = animations.find((clip) => /death/i.test(clip.name))
      if (death) {
        mixer.clipAction(death).setLoop(LoopOnce, 1).play().clampWhenFinished = true
        mixer.setTime(death.duration)
        verifyPose(wrapper)
      }
      mixer.uncacheRoot(model)
      // The installed per-instance sphere survives SkeletonUtils cloning (per-spawn clones).
      verifyPose(clone(wrapper))
    },
    30_000,
  )

  it.each(RIGID_GLBS)('leaves rigid %s (%s) with no skinned meshes to bound', async (kind, name) => {
    const { wrapper } = await buildAnimal(kind, name)
    expect(installActorCullBounds(wrapper)).toEqual({ culled: 0, fallback: 0 })
  })

  it('fails open for a nonuniformly scaled animal wrapper', async () => {
    const { wrapper } = await buildAnimal('wolf', 'wolf')
    wrapper.scale.set(1, 2, 1)
    const result = installActorCullBounds(wrapper)
    expect(result.culled).toBe(0)
    expect(result.fallback).toBeGreaterThan(0)
    for (const mesh of skinnedMeshes(wrapper)) expect(mesh.frustumCulled).toBe(false)
  })
})
