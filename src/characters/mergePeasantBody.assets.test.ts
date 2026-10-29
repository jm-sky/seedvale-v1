import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  AnimationMixer, Bone, DetachedBindMode, Float32BufferAttribute, Group, LoopOnce, Matrix3,
  type Object3D, Raycaster, type SkinnedMesh, Texture, Vector3, Vector4,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { describe, expect, it, vi } from 'vitest'
import type { CharacterAppearance } from './characterTypes'
import { disposeObject3D, markSharedGpu } from '../assets/loadGltf'
import { applyClothingHue, cloneOutfitMaterials, fixOutfitMeshDarkness } from '../assets/ubcOutfitMaterials'
import { installActorCullBounds } from '../render/actorCullBounds'
import { assembleCharacter } from './assembleCharacter'
import { disposeMergedBodySkeleton, mergePeasantBody } from './mergePeasantBody'

vi.mock('../assets/loadGltf', async (original) => ({
  ...await original<typeof import('../assets/loadGltf')>(),
  loadGltf: async (url: string) => (await diskClone(url)).scene,
  loadGltfAnimated: (url: string) => diskClone(url),
}))

// Real geometry, materials, texture identities, rigs, morphs and clips. Replace
// image decoding only: no DOM or GPU is required for CPU deformation parity.
const cache = new Map<string, Promise<Awaited<ReturnType<GLTFLoader['parseAsync']>>>>()
async function diskClone(url: string) {
  if (!cache.has(url)) cache.set(url, (async () => {
    const bytes = await readFile(resolve(import.meta.dirname, '../../public', url.slice(1)))
    const textures = new Map<number, Texture>()
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    loader.register(() => ({
      name: 'TEST_IMAGE_DECODE',
      loadTexture: async (index: number) => {
        if (!textures.has(index)) textures.set(index, new Texture())
        return textures.get(index)!
      },
    }))
    const gltf = await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
    gltf.scene.traverse((node) => {
      const mesh = node as SkinnedMesh
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true }
    })
    markSharedGpu(gltf.scene)
    return gltf
  })())
  const source = await cache.get(url)!
  return { scene: clone(source.scene), animations: source.animations, source: source.scene }
}

const CLIPS = ['Idle_Loop', 'Walk_Loop', 'Sprint_Loop', 'Sword_Attack', 'Interact', 'Sitting_Idle_Loop', 'Fixing_Kneeling', 'Death01']
const SEXES = ['Male', 'Female'] as const
function appearance(sex: 'Male' | 'Female'): CharacterAppearance {
  return { sex, outfit: 'Peasant', head: 'Base', hair: 'Long', beard: sex === 'Male',
    garments: sex === 'Female' ? ['NobleBodice', 'WorkSkirt'] : [], clothTint: null }
}
function skinned(root: Object3D) {
  const meshes: SkinnedMesh[] = []
  root.traverse((node) => { if ((node as SkinnedMesh).isSkinnedMesh) meshes.push(node as SkinnedMesh) })
  return meshes
}
async function build(sex: 'Male' | 'Female') {
  const assembled = await assembleCharacter(appearance(sex))
  expect(assembled.warnings).toEqual([])
  cloneOutfitMaterials(assembled.scene)
  assembled.scene.traverse(fixOutfitMeshDarkness)
  applyClothingHue(assembled.scene, 0x9a7965)
  const wrapper = new Group()
  wrapper.position.set(12.5, 3.25, -7)
  wrapper.rotation.set(0.2, 0.7, -0.1)
  wrapper.scale.setScalar(0.6)
  assembled.scene.scale.setScalar(1.3)
  assembled.scene.rotation.set(0.1, -0.3, 0.2)
  wrapper.add(assembled.scene)
  wrapper.updateMatrixWorld(true)
  return { ...assembled, wrapper, body: [...assembled.bodySkinned!] }
}
function cloth(root: Object3D) {
  return skinned(root).filter((m) => !Array.isArray(m.material) && m.material.name === 'MI_Peasant')
}
function shaderDirection(mesh: SkinnedMesh, vertex: number, name: 'normal' | 'tangent') {
  const g = mesh.geometry
  const attribute = g.getAttribute(name)
  const n = new Vector3().fromBufferAttribute(attribute, vertex)
  const morphs = name === 'normal' ? g.morphAttributes.normal : undefined
  if (morphs) morphs.forEach((morph, i) => {
    const delta = new Vector3().fromBufferAttribute(morph, vertex)
    if (!g.morphTargetsRelative) delta.sub(new Vector3().fromBufferAttribute(attribute, vertex))
    n.addScaledVector(delta, mesh.morphTargetInfluences![i])
  })
  const v = new Vector4(n.x, n.y, n.z, 0)
  mesh.applyBoneTransform(vertex, v)
  n.set(v.x, v.y, v.z)
  if (name === 'normal') n.applyMatrix3(new Matrix3().getNormalMatrix(mesh.matrixWorld))
  else n.applyMatrix3(new Matrix3().setFromMatrix4(mesh.matrixWorld))
  return n.normalize()
}
// Full admitted opaque mesh submission count, independent of geometry groups.
// Actual WebGL pass counters and FPS are deliberately deferred to the A/B gate.
function submissions(meshes: SkinnedMesh[]) {
  return meshes.reduce((sum, mesh) => sum + (Array.isArray(mesh.material) ? mesh.geometry.groups.length : 1), 0)
}

describe.each(SEXES)('%s real Peasant body merge', (sex) => {
  it('preserves all vertices, shader normals, UV/color/weights and triangles across actual clips and Fat', async () => {
    const actor = await build(sex)
    const original = cloth(actor.scene)
    const cached = (await cache.get(`/assets/characters/${sex}_Peasant.glb`)!)!.scene
    const cachedSnapshot = JSON.stringify(cached.toJSON())
    const sourceGeometry = original.map((m) => m.geometry)
    const sourceValues = sourceGeometry.map((g) => Array.from(g.getAttribute('position').array))
    const independent = skinned(actor.scene).filter((m) => !original.includes(m))
    const before = submissions(actor.body)
    const triangles = original.reduce((n, m) => n + m.geometry.index!.count / 3, 0)
    // Reference meshes stay attached to the same actor-local bones in a sibling
    // subtree, so each comparison samples exactly the same animated pose.
    const reference = new Group()
    actor.scene.add(reference)
    const refs = original.map((m) => {
      const copy = m.clone(false)
      reference.add(copy)
      return copy
    })
    const result = mergePeasantBody(actor.scene, appearance(sex), actor.body, actor.animations)
    expect(result).toMatchObject({ merged: true, before: sex === 'Male' ? 5 : 4, after: sex === 'Male' ? 2 : 1 })
    reference.removeFromParent()
    const merged = cloth(actor.scene)[0]
    actor.scene.add(reference)
    expect(merged.geometry.groups).toEqual([])
    expect(merged.geometry.index!.count / 3).toBe(triangles)
    expect(before - submissions([...independent.filter((m) => actor.body.includes(m)), merged])).toBe(3)
    expect(independent.every((m) => m.parent !== null)).toBe(true)
    expect(merged.castShadow).toBe(true)
    expect(merged.receiveShadow).toBe(true)
    expect(merged.material).not.toBe(original[0].material)
    expect(merged.skeleton).not.toBe(original[0].skeleton)
    const mergedMaterial = merged.material as import('three').MeshStandardMaterial
    expect(mergedMaterial.map).toBe((original[0].material as import('three').MeshStandardMaterial).map)
    expect(mergedMaterial.normalMap).toBe((original[0].material as import('three').MeshStandardMaterial).normalMap)
    let offset = 0
    for (const ref of refs) {
      for (const name of ['uv', 'skinIndex', 'skinWeight']) {
        const a = ref.geometry.getAttribute(name), b = merged.geometry.getAttribute(name)
        for (let v = 0; v < a.count; v++) for (let c = 0; c < a.itemSize; c++) {
          expect(b.getComponent(offset + v, c)).toBe(a.getComponent(v, c))
        }
      }
      const colors = ref.geometry.getAttribute('color')
      for (let v = 0; v < ref.geometry.getAttribute('position').count; v++) for (let c = 0; c < 3; c++) {
        expect(merged.geometry.getAttribute('color').getComponent(offset + v, c)).toBeCloseTo(colors ? colors.getComponent(v, c) : 1, 7)
      }
      offset += ref.geometry.getAttribute('position').count
    }
    reference.removeFromParent()
    expect(installActorCullBounds(actor.wrapper).fallback).toBe(0)
    actor.scene.add(reference)
    const mixer = new AnimationMixer(actor.scene)
    let worstNormal = 0, worstPosition = 0
    for (const fat of [0, 0.5, 1]) {
      merged.morphTargetInfluences![0] = fat
      refs.forEach((m) => { m.morphTargetInfluences![0] = fat })
      for (const name of CLIPS) {
        const clip = actor.animations.find((c) => c.name === name)!
        expect(clip, name).toBeDefined()
        const action = mixer.clipAction(clip).setLoop(LoopOnce, 1).play()
        action.clampWhenFinished = true
        for (let sample = 0; sample <= 8; sample++) {
          mixer.setTime(clip.duration * sample / 8)
          actor.wrapper.updateMatrixWorld(true)
          let offset = 0
          for (const ref of refs) {
            for (let v = 0; v < ref.geometry.getAttribute('position').count; v++) {
              const a = ref.getVertexPosition(v, new Vector3()).applyMatrix4(ref.matrixWorld)
              const b = merged.getVertexPosition(offset + v, new Vector3()).applyMatrix4(merged.matrixWorld)
              worstPosition = Math.max(worstPosition, a.distanceTo(b))
              worstNormal = Math.max(worstNormal, shaderDirection(ref, v, 'normal').distanceTo(shaderDirection(merged, offset + v, 'normal')))
              const local = b.clone().applyMatrix4(merged.matrixWorld.clone().invert())
              expect(merged.boundingSphere!.containsPoint(local)).toBe(true)
              expect(merged.boundingBox!.containsPoint(local)).toBe(true)
            }
            offset += ref.geometry.getAttribute('position').count
          }
        }
        action.stop()
      }
    }
    // Float32 baking plus <= 5e-7 inverse-factor residual, in ~2m characters.
    expect(worstPosition).toBeLessThan(3e-6)
    expect(worstNormal).toBeLessThan(3e-6)
    console.info(`${sex} merge max world position=${worstPosition}, normal=${worstNormal}, body submissions=${before}->${before - 3}`)
    sourceGeometry.forEach((g, i) => expect(Array.from(g.getAttribute('position').array)).toEqual(sourceValues[i]))
    expect(JSON.stringify(cached.toJSON())).toBe(cachedSnapshot)
    reference.removeFromParent()
    mixer.uncacheRoot(actor.scene)
  }, 60_000)

  it('preserves ray hits, conservative bounds, cloning and actor-owned resource disposal', async () => {
    const actor = await build(sex)
    const before = cloth(actor.scene)
    const sphereOriginal = installActorCullBounds(actor.wrapper)
    expect(sphereOriginal.fallback).toBe(0)
    const center = before[0].boundingSphere!.clone().applyMatrix4(before[0].matrixWorld).center
    const rays = Array.from({ length: 9 }, (_, i) => new Raycaster(
      center.clone().add(new Vector3((i - 4) * 0.09, 0, 3)), new Vector3(0, 0, -1)))
    const hits = rays.map((ray) => ray.intersectObjects(before, false))
    expect(hits.flat().length).toBeGreaterThan(0)
    expect(mergePeasantBody(actor.scene, appearance(sex), actor.body, actor.animations).merged).toBe(true)
    expect(installActorCullBounds(actor.wrapper).fallback).toBe(0)
    const merged = cloth(actor.scene)[0]
    actor.wrapper.updateMatrixWorld(true)
    rays.forEach((ray, i) => {
      const after = ray.intersectObject(merged)
      expect(after.length).toBe(hits[i].length)
      after.forEach((hit, j) => expect(hit.point.distanceTo(hits[i][j].point)).toBeLessThan(3e-6))
    })
    const copy = clone(actor.wrapper)
    copy.updateMatrixWorld(true)
    const copied = cloth(copy)[0]
    expect(copied.skeleton.bones[0]).not.toBe(merged.skeleton.bones[0])
    for (let v = 0; v < merged.geometry.getAttribute('position').count; v++) {
      expect(copied.getVertexPosition(v, new Vector3()).distanceTo(merged.getVertexPosition(v, new Vector3()))).toBeLessThan(1e-9)
    }
    // SkeletonUtils clones share geometry/material by design; runtime streaming
    // reconstructs from cached source instead of retaining an assembled clone.
    const survivor = await build(sex)
    expect(mergePeasantBody(survivor.scene, appearance(sex), survivor.body, survivor.animations).merged).toBe(true)
    const geometryDispose = vi.spyOn(merged.geometry, 'dispose')
    const materialDispose = vi.spyOn(merged.material as import('three').Material, 'dispose')
    const skeletonDispose = vi.spyOn(merged.skeleton, 'dispose')
    const survivorDispose = vi.spyOn(cloth(survivor.scene)[0].geometry, 'dispose')
    disposeMergedBodySkeleton(actor.wrapper)
    disposeObject3D(actor.wrapper)
    expect(geometryDispose).toHaveBeenCalledTimes(1)
    expect(materialDispose).toHaveBeenCalledTimes(1)
    expect(skeletonDispose).toHaveBeenCalledTimes(1)
    expect(survivorDispose).not.toHaveBeenCalled()
    const rebuilt = await build(sex)
    expect(rebuilt.body.length).toBe(sex === 'Male' ? 5 : 4)
    expect(mergePeasantBody(rebuilt.scene, appearance(sex), rebuilt.body, rebuilt.animations).merged).toBe(true)
    const material = cloth(survivor.scene)[0].material as import('three').MeshStandardMaterial
    const previous = material.color.clone()
    applyClothingHue(rebuilt.scene, 0x112233)
    expect(material.color.equals(previous)).toBe(true)
  })

  it('preserves authored tangent handedness and shader direction when tangent attributes are present', async () => {
    const actor = await build(sex)
    const original = cloth(actor.scene)
    for (const mesh of original) {
      mesh.geometry = mesh.geometry.clone()
      const values = new Float32Array(mesh.geometry.getAttribute('position').count * 4)
      for (let i = 0; i < values.length; i += 4) { values[i] = 1; values[i + 3] = i % 8 ? -1 : 1 }
      mesh.geometry.setAttribute('tangent', new Float32BufferAttribute(values, 4))
    }
    expect(mergePeasantBody(actor.scene, appearance(sex), actor.body, actor.animations).merged).toBe(true)
    const merged = cloth(actor.scene)[0]
    // Detached reference meshes still use this actor's animated bones.
    original.forEach((mesh) => actor.scene.add(mesh))
    actor.wrapper.updateMatrixWorld(true)
    let offset = 0
    for (const ref of original) {
      for (let v = 0; v < ref.geometry.getAttribute('position').count; v++) {
        expect(shaderDirection(ref, v, 'tangent').distanceTo(shaderDirection(merged, offset + v, 'tangent'))).toBeLessThan(3e-6)
        expect(merged.geometry.getAttribute('tangent').getW(offset + v)).toBe(ref.geometry.getAttribute('tangent').getW(v))
      }
      offset += ref.geometry.getAttribute('position').count
    }
  })

  it('rejects unsupported variants and repeated application without touching attachments', async () => {
    const actor = await build(sex)
    expect(mergePeasantBody(actor.scene, { sex, outfit: 'Peasant_Boots' }, actor.body).merged).toBe(false)
    expect(mergePeasantBody(actor.scene, appearance(sex), actor.body, actor.animations).merged).toBe(true)
    const snapshot = skinned(actor.scene).map((mesh) => mesh.uuid)
    expect(mergePeasantBody(actor.scene, appearance(sex), actor.body, actor.animations).merged).toBe(false)
    expect(skinned(actor.scene).map((mesh) => mesh.uuid)).toEqual(snapshot)
  })

  it.each(['binding', 'bone order', 'foreign bone', 'detached', 'singular', 'material', 'sub-hex tint', 'visibility', 'shadow', 'transform', 'morph', 'groups', 'animation', 'missing inverses', 'nonfinite', 'custom shader'])('fails open atomically for %s', async (kind) => {
    const actor = await build(sex)
    const meshes = cloth(actor.scene)
    const target = meshes[1]
    const clips = [...actor.animations]
    if (kind === 'binding') { target.skeleton.boneInverses = target.skeleton.boneInverses.map((m) => m.clone()); target.skeleton.boneInverses[3].elements[12] += 0.01 }
    if (kind === 'bone order') target.skeleton.bones = target.skeleton.bones.slice().reverse()
    if (kind === 'foreign bone') { target.skeleton.bones = target.skeleton.bones.slice(); target.skeleton.bones[0] = new Bone() }
    if (kind === 'detached') target.bindMode = DetachedBindMode
    if (kind === 'missing inverses') meshes[0].skeleton.boneInverses = []
    if (kind === 'nonfinite') target.position.x = NaN
    if (kind === 'custom shader') (target.material as import('three').MeshStandardMaterial).onBeforeCompile = () => {}
    if (kind === 'singular') target.scale.setScalar(0)
    if (kind === 'material') (target.material as import('three').MeshStandardMaterial).roughness = 0.33
    if (kind === 'sub-hex tint') (target.material as import('three').MeshStandardMaterial).color.r += 1e-6
    if (kind === 'visibility') target.visible = false
    if (kind === 'shadow') target.castShadow = false
    if (kind === 'transform') target.rotation.y = 0.2
    if (kind === 'morph') target.morphTargetInfluences![0] = 0.5
    if (kind === 'groups') { target.geometry = target.geometry.clone(); target.geometry.addGroup(0, 3, 0) }
    if (kind === 'animation') { const { AnimationClip, NumberKeyframeTrack } = await import('three'); clips.push(new AnimationClip('part', 1, [new NumberKeyframeTrack(`${target.name}.position[x]`, [0, 1], [0, 1])])) }
    const parents = meshes.map((m) => m.parent)
    const geometries = meshes.map((m) => m.geometry)
    const materials = meshes.map((m) => m.material)
    expect(mergePeasantBody(actor.scene, appearance(sex), actor.body, clips).merged).toBe(false)
    expect(meshes.map((m) => m.parent)).toEqual(parents)
    expect(meshes.map((m) => m.geometry)).toEqual(geometries)
    expect(meshes.map((m) => m.material)).toEqual(materials)
  })
})
