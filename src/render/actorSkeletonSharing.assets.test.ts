import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  type AnimationClip,
  AnimationMixer,
  Group,
  LoopOnce,
  type Object3D,
  Raycaster,
  type Skeleton,
  type SkinnedMesh,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { describe, expect, it, vi } from 'vitest'
import { disposeObject3D } from '../assets/loadGltf'
import { assembleCharacter } from '../characters/assembleCharacter'
import {
  CHARACTER_OUTFITS,
  type CharacterAppearance,
  HAIR_STYLES,
  hasOutfitBody,
  HEAD_VARIANTS,
} from '../characters/characterTypes'
import { installActorCullBounds } from './actorCullBounds'
import { shareActorSkeletons } from './actorSkeletonSharing'

// Real GLB geometry, rigs and clips through production assembly; only disk
// loading is substituted and materials dropped (CPU skinning needs no GPU).
// Like production, parts are skinned clones of one cached parse per URL, so
// actors of the same appearance share loader geometry.
vi.mock('../assets/loadGltf', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../assets/loadGltf')>()),
  loadGltf: async (url: string) => clone((await loadCached(url)).scene),
  loadGltfAnimated: async (url: string) => {
    const gltf = await loadCached(url)
    return { scene: clone(gltf.scene), animations: gltf.animations }
  },
}))

const parsed = new Map<string, ReturnType<typeof loadOnDisk>>()
function loadCached(url: string) {
  if (!parsed.has(url)) parsed.set(url, loadOnDisk(url))
  return parsed.get(url)!
}

async function loadOnDisk(url: string) {
  const bytes = await readFile(resolve(import.meta.dirname, '../../public', url.slice(1)))
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

const POSITION_TOLERANCE = 2e-5
const NPC_CLIPS = ['Idle_Loop', 'Walk_Loop', 'Sprint_Loop', 'Sword_Attack', 'Interact', 'Sitting_Idle_Loop', 'Fixing_Kneeling', 'Death01']

function skinned(root: Object3D): SkinnedMesh[] {
  const out: SkinnedMesh[] = []
  root.traverse((o) => { if ((o as SkinnedMesh).isSkinnedMesh) out.push(o as SkinnedMesh) })
  return out
}

const skeletons = (root: Object3D) => new Set(skinned(root).map((m) => m.skeleton))

/** NPC-like wrapper: translation, rotation, uniform scale outside, a non-unit child scale inside. */
function wrap(scene: Object3D): Group {
  const wrapper = new Group()
  scene.scale.multiplyScalar(1.3)
  wrapper.add(scene)
  wrapper.position.set(12.5, 3.25, -7)
  wrapper.rotation.set(0, 0.7, 0)
  wrapper.scale.setScalar(0.6)
  wrapper.updateMatrixWorld(true)
  return wrapper
}

function maxPositionError(a: Object3D, b: Object3D): number {
  a.updateMatrixWorld(true)
  b.updateMatrixWorld(true)
  const ma = skinned(a)
  const mb = skinned(b)
  expect(ma.length).toBe(mb.length)
  for (const s of new Set([...ma, ...mb].map((m) => m.skeleton))) s.update()
  const pa = new Vector3()
  const pb = new Vector3()
  let max = 0
  for (let i = 0; i < ma.length; i++) {
    expect(ma[i].name).toBe(mb[i].name)
    const count = ma[i].geometry.attributes.position.count
    for (let v = 0; v < count; v++) {
      ma[i].getVertexPosition(v, pa).applyMatrix4(ma[i].matrixWorld)
      mb[i].getVertexPosition(v, pb).applyMatrix4(mb[i].matrixWorld)
      max = Math.max(max, pa.distanceTo(pb))
    }
  }
  return max
}

/** Plays every clip on both actors in lockstep and compares CPU-skinned vertices. */
function expectSkinningParity(
  plain: { wrapper: Group, scene: Object3D },
  shared: { wrapper: Group, scene: Object3D },
  clips: readonly AnimationClip[],
  samples = 6,
): void {
  const mixers = [new AnimationMixer(plain.scene), new AnimationMixer(shared.scene)]
  for (const clip of clips) {
    const actions = mixers.map((m) => m.clipAction(clip).setLoop(LoopOnce, 1).play())
    for (const action of actions) action.clampWhenFinished = true
    for (let sample = 0; sample <= samples; sample++) {
      for (const m of mixers) m.setTime(clip.duration * sample / samples)
      expect(maxPositionError(plain.wrapper, shared.wrapper), `${clip.name} @${sample}`).toBeLessThanOrEqual(POSITION_TOLERANCE)
    }
    for (const action of actions) action.stop()
  }
  mixers[0].uncacheRoot(plain.scene)
  mixers[1].uncacheRoot(shared.scene)
}

function appearance(sex: 'Male' | 'Female', overrides: Partial<CharacterAppearance> = {}): CharacterAppearance {
  return {
    sex, outfit: 'Peasant', head: 'Base', hair: sex === 'Male' ? 'Parted' : 'Long', facialHair: sex === 'Male' ? 'beard' : 'none',
    garments: sex === 'Female' ? ['NobleBodice', 'WorkSkirt'] : [], clothTint: null, ...overrides,
  }
}

async function buildNpc(a: CharacterAppearance, share: boolean) {
  const assembled = await assembleCharacter(a)
  expect(assembled.warnings).toEqual([])
  const wrapper = wrap(assembled.scene)
  const result = share ? shareActorSkeletons(wrapper) : null
  return { wrapper, scene: assembled.scene, animations: assembled.animations, result }
}

const clipsByName = (animations: readonly AnimationClip[], names: readonly string[]) =>
  names.map((name) => {
    const clip = animations.find((c) => c.name === name)
    expect(clip, name).toBeDefined()
    return clip!
  })

const OUTFIT_CASES = (['Male', 'Female'] as const).flatMap((sex) =>
  CHARACTER_OUTFITS.filter((o) => hasOutfitBody(sex, o)).map((outfit) => [sex, outfit] as const))

describe('shareActorSkeletons on assembled NPC kits', () => {
  it.each(OUTFIT_CASES)('%s %s: one body palette, exact skinning through the clip set', async (sex, outfit) => {
    const a = appearance(sex, { outfit })
    const plain = await buildNpc(a, false)
    const shared = await buildNpc(a, true)
    const r = shared.result!
    expect(r.skeletonsBefore).toBe(skeletons(plain.wrapper).size)
    // Every part shares the body skeleton except the male head, whose inverse
    // binds are not a constant factor of the body's (kept on its own palette).
    expect(r.skeletonsAfter).toBe(sex === 'Male' ? 2 : 1)
    expect(r.kept).toBe(sex === 'Male' ? 1 : 0)
    expect(skeletons(shared.wrapper).size).toBe(r.skeletonsAfter)
    expectSkinningParity(plain, shared, clipsByName(plain.animations, NPC_CLIPS), 4)
  }, 60_000)

  it.each(HEAD_VARIANTS.flatMap((head) => HAIR_STYLES.flatMap((hair) =>
    (['Male', 'Female'] as const).map((sex) => [sex, head, hair] as const))))(
    '%s head %s hair %s: exact skinning', async (sex, head, hair) => {
      const a = appearance(sex, { head, hair })
      const plain = await buildNpc(a, false)
      const shared = await buildNpc(a, true)
      expect(shared.result!.skeletonsAfter).toBe(sex === 'Male' ? 2 : 1)
      expectSkinningParity(plain, shared, clipsByName(plain.animations, ['Walk_Loop', 'Sword_Attack', 'Death01']), 3)
    }, 60_000)

  it('keeps bounds, culling, picking and the settled death pose identical', async () => {
    for (const sex of ['Male', 'Female'] as const) {
      const plain = await buildNpc(appearance(sex), false)
      const shared = await buildNpc(appearance(sex), true)
      const cullPlain = installActorCullBounds(plain.wrapper)
      const cullShared = installActorCullBounds(shared.wrapper)
      expect(cullShared).toEqual(cullPlain)
      expect(cullShared.fallback).toBe(0)
      const mp = skinned(plain.wrapper)
      const ms = skinned(shared.wrapper)
      for (let i = 0; i < mp.length; i++) {
        expect(ms[i].frustumCulled).toBe(mp[i].frustumCulled)
        expect(ms[i].boundingSphere!.center.distanceTo(mp[i].boundingSphere!.center)).toBeLessThan(1e-3)
        expect(Math.abs(ms[i].boundingSphere!.radius - mp[i].boundingSphere!.radius)).toBeLessThan(1e-3)
      }
      const [death] = clipsByName(plain.animations, ['Death01'])
      for (const pose of ['bind', 'death'] as const) {
        if (pose === 'death') {
          for (const actor of [plain, shared]) {
            const mixer = new AnimationMixer(actor.scene)
            const action = mixer.clipAction(death).setLoop(LoopOnce, 1).play()
            action.clampWhenFinished = true
            mixer.setTime(death.duration)
          }
        }
        expect(maxPositionError(plain.wrapper, shared.wrapper)).toBeLessThanOrEqual(POSITION_TOLERANCE)
        const center = new Vector3(12.5, 3.25 + (pose === 'bind' ? 0.6 : 0.15), -7)
        for (const origin of [new Vector3(12.5, 3.9, -2), new Vector3(16, 4.5, -7), new Vector3(12.5, 6, -7.01)]) {
          const ray = new Raycaster(origin, center.clone().sub(origin).normalize())
          const hp = ray.intersectObject(plain.wrapper, true)
          const hs = ray.intersectObject(shared.wrapper, true)
          expect(hs.map((h) => [h.object.name, h.faceIndex])).toEqual(hp.map((h) => [h.object.name, h.faceIndex]))
          for (let i = 0; i < hp.length; i++) expect(Math.abs(hs[i].distance - hp[i].distance)).toBeLessThan(1e-4)
        }
      }
    }
  }, 60_000)

  it('never mutates loader-shared bones, inverse binds or geometry; actors stay independent', async () => {
    const a = appearance('Female')
    const first = await buildNpc(a, false)
    const before = skinned(first.wrapper).map((m) => ({
      geometry: m.geometry,
      skinIndex: Array.from(m.geometry.attributes.skinIndex.array),
      inverseRefs: m.skeleton.boneInverses,
      inverses: m.skeleton.boneInverses.map((x) => x.clone()),
    }))
    const result = shareActorSkeletons(first.wrapper)
    expect(result.remapped).toBeGreaterThan(0)
    for (const b of before) {
      expect(Array.from(b.geometry.attributes.skinIndex.array)).toEqual(b.skinIndex)
      b.inverseRefs.forEach((m, j) => expect(m.equals(b.inverses[j])).toBe(true))
    }
    for (const [i, mesh] of skinned(first.wrapper).entries()) {
      if (mesh.geometry !== before[i].geometry) {
        // Remapped copy shares every attribute but skinIndex, and is never disposed per actor.
        expect(mesh.geometry.userData.sharedGpu).toBe(true)
        expect(mesh.geometry.attributes.position).toBe(before[i].geometry.attributes.position)
        expect(mesh.geometry.index).toBe(before[i].geometry.index)
      }
    }
    const second = await buildNpc(a, true)
    const s1 = skinned(first.wrapper)
    const s2 = skinned(second.wrapper)
    // Same appearance → same cached remapped geometry; never the same Skeleton or Bone.
    expect(s2.map((m) => m.geometry)).toEqual(s1.map((m) => m.geometry))
    expect(s1[0].skeleton).not.toBe(s2[0].skeleton)
    expect(s1[0].skeleton.bones.some((b) => s2[0].skeleton.bones.includes(b))).toBe(false)
    // Idempotent.
    expect(shareActorSkeletons(first.wrapper)).toMatchObject({ rebound: 0, skeletonsBefore: 1, skeletonsAfter: 1 })
  }, 60_000)

  it('disposes each palette once and leaves shared geometry alone', async () => {
    const { wrapper } = await buildNpc(appearance('Female'), true)
    const s = [...skeletons(wrapper)] as Skeleton[]
    expect(s).toHaveLength(1)
    s[0].computeBoneTexture()
    const texture = s[0].boneTexture!
    const textureDisposed = vi.fn()
    texture.addEventListener('dispose', textureDisposed)
    const geometryDisposed = vi.fn()
    const remapped = skinned(wrapper).filter((m) => m.geometry.userData.sharedGpu)
    expect(remapped.length).toBeGreaterThan(0)
    for (const m of remapped) m.geometry.addEventListener('dispose', geometryDisposed)
    disposeObject3D(wrapper)
    expect(textureDisposed).toHaveBeenCalledTimes(1)
    expect(s[0].boneTexture).toBeNull()
    expect(geometryDisposed).not.toHaveBeenCalled()
  }, 60_000)

  it('survives SkeletonUtils cloning with exact skinning', async () => {
    const plain = await buildNpc(appearance('Female'), false)
    const shared = await buildNpc(appearance('Female'), true)
    const copy = clone(shared.wrapper) as Group
    expectSkinningParity(plain, { wrapper: copy, scene: copy.children[0] }, clipsByName(plain.animations, ['Walk_Loop']), 3)
  }, 60_000)
})

describe('shareActorSkeletons on fauna and legacy rigs', () => {
  it('collapses every shipped multi-part animal to one palette with exact skinning', async () => {
    const dir = resolve(import.meta.dirname, '../../public/models/fauna')
    let multiPart = 0
    for (const file of (await readdir(dir)).filter((f) => f.endsWith('.glb'))) {
      const gltf = await loadOnDisk(`/models/fauna/${file}`)
      const plainScene = clone(gltf.scene)
      const sharedScene = clone(gltf.scene)
      const plain = { wrapper: wrap(plainScene), scene: plainScene }
      const shared = { wrapper: wrap(sharedScene), scene: sharedScene }
      const r = shareActorSkeletons(shared.wrapper)
      if (r.skinned === 0) continue
      if (r.skeletonsBefore > 1) multiPart++
      expect(r.skeletonsAfter, file).toBe(1)
      expect(r.kept, file).toBe(0)
      expectSkinningParity(plain, shared, gltf.animations.slice(0, 4), 3)
    }
    expect(multiPart).toBeGreaterThan(5)
  }, 120_000)

  it('leaves a legacy NPC rig exact', async () => {
    const gltf = await loadOnDisk('/models/characters/Worker.glb')
    const plainScene = clone(gltf.scene)
    const sharedScene = clone(gltf.scene)
    const shared = { wrapper: wrap(sharedScene), scene: sharedScene }
    shareActorSkeletons(shared.wrapper)
    expect(skeletons(shared.wrapper).size).toBe(1)
    expectSkinningParity({ wrapper: wrap(plainScene), scene: plainScene }, shared, gltf.animations.slice(0, 5), 3)
  }, 60_000)
})
