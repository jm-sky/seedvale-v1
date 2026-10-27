import * as THREE from 'three'
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CharacterAppearance } from '../characters/characterTypes'
import type { KeyState } from '../input/Keyboard'
import { loadGltf, loadGltfAnimated } from '../assets/loadGltf'
import { loadTexture } from '../assets/loadTexture'
import { assembleCharacter } from '../characters/assembleCharacter'
import { createHeldToolObject } from '../items/heldToolVisual'
import { PlayerController } from './PlayerController'

vi.mock('../assets/loadGltf', async (original) => ({
  ...await original<typeof import('../assets/loadGltf')>(),
  loadGltf: vi.fn(),
  loadGltfAnimated: vi.fn(),
}))
vi.mock('../characters/assembleCharacter', () => ({ assembleCharacter: vi.fn() }))
vi.mock('../assets/loadTexture', () => ({ loadTexture: vi.fn() }))
vi.mock('../items/heldToolVisual', async (original) => ({
  ...await original<typeof import('../items/heldToolVisual')>(),
  createHeldToolObject: vi.fn(),
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail })
  return { promise, resolve, reject }
}

function model() {
  const scene = new THREE.Group()
  const bone = new THREE.Bone()
  bone.name = 'hand_r'
  const material = new THREE.MeshStandardMaterial({ name: 'MI_Peasant' })
  material.userData.sharedGpu = true
  const geometry = new THREE.BoxGeometry(1, 2, 1)
  geometry.userData.sharedGpu = true
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(geometry.attributes.position!.count * 4), 4))
  const weights = new Float32Array(geometry.attributes.position!.count * 4)
  for (let i = 0; i < weights.length; i += 4) weights[i] = 1
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4))
  const mesh = new THREE.SkinnedMesh(geometry, material)
  mesh.bind(new THREE.Skeleton([bone]))
  scene.add(bone, mesh)
  return { scene, mesh, material, animations: [], warnings: [] }
}

const kit: CharacterAppearance = {
  sex: 'Male', outfit: 'Ranger', head: 'Base', hair: null,
  beard: false, clothTint: null, garments: [],
}
const base = { modelUrl: 'A.glb', animationUrl: 'anims.glb', tintUrl: null }
const players: PlayerController[] = []

async function player() {
  const initial = model()
  vi.mocked(loadGltfAnimated).mockResolvedValue(initial)
  const controller = await PlayerController.create(
    new THREE.PerspectiveCamera(), {} as KeyState,
    { yaw: 0, pitch: 0, distance: 4, zoomLocked: false },
    () => 0, () => 0, () => null, () => [], () => null, () => null,
    () => null, (x, z) => ({ x, z }), () => 'grass', base.modelUrl, base.animationUrl,
  )
  players.push(controller)
  return { controller, initial }
}

beforeEach(() => { vi.resetAllMocks() })
afterEach(() => { players.splice(0).forEach((p) => p.dispose()) })

describe('player async visual lifetime (review 026 F1)', () => {
  it('keeps A when a delayed B is followed by a request for installed A', async () => {
    const { controller, initial } = await player()
    const pending = deferred<Awaited<ReturnType<typeof assembleCharacter>>>()
    const stale = model()
    const skeletonDispose = vi.spyOn(stale.mesh.skeleton, 'dispose')
    const sharedDispose = vi.spyOn(stale.material, 'dispose')
    vi.mocked(assembleCharacter).mockReturnValueOnce(pending.promise)
    const loading = controller.applyAppearance({ ...base, kit, modelUrl: 'B.glb' })
    await controller.applyAppearance(base)
    pending.resolve(stale)
    await loading
    expect(controller.mesh.children).toContain(initial.scene)
    expect(controller.mesh.children).not.toContain(stale.scene)
    expect(skeletonDispose).toHaveBeenCalledOnce()
    expect(sharedDispose).not.toHaveBeenCalled()
  })

  it('only installs the newest of two out-of-order loads', async () => {
    const { controller } = await player()
    const first = deferred<Awaited<ReturnType<typeof assembleCharacter>>>()
    const second = deferred<Awaited<ReturnType<typeof assembleCharacter>>>()
    vi.mocked(assembleCharacter).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const a = controller.applyAppearance({ ...base, kit, modelUrl: 'B.glb' })
    const b = controller.applyAppearance({ ...base, kit: { ...kit, outfit: 'Knight' }, modelUrl: 'C.glb' })
    const newest = model()
    second.resolve(newest)
    await b
    first.resolve(model())
    await a
    expect(controller.mesh.children).toContain(newest.scene)
  })

  it('does not mutate a live model with a stale tint completion', async () => {
    const { controller, initial } = await player()
    const tint = deferred<THREE.Texture>()
    vi.mocked(loadTexture).mockReturnValueOnce(tint.promise)
    const loading = controller.applyAppearance({ ...base, tintUrl: 'brown.webp' })
    await controller.applyAppearance(base)
    tint.resolve(new THREE.Texture())
    await loading
    expect((initial.mesh.material as THREE.MeshStandardMaterial).map).toBeNull()
  })

  it('discards appearance and accessory completions after disposal and rejects new loads', async () => {
    const { controller, initial } = await player()
    const appearance = deferred<Awaited<ReturnType<typeof assembleCharacter>>>()
    const accessory = deferred<THREE.Group>()
    vi.mocked(assembleCharacter).mockReturnValueOnce(appearance.promise)
    vi.mocked(loadGltf).mockResolvedValue(model().scene).mockReturnValueOnce(accessory.promise)
    const loading = controller.applyAppearance({ ...base, kit, modelUrl: 'B.glb' })
    const mounting = controller.applyEquipmentVisuals('arms', { modelUrl: 'armor.glb' })
    controller.dispose()
    appearance.resolve(model())
    accessory.resolve(model().scene)
    await Promise.all([loading, mounting])
    expect(controller.mesh.children).toContain(initial.scene)
    expect(initial.scene.getObjectByName('ubcEquipmentVisual')).toBeUndefined()
    await controller.applyAppearance({ ...base, kit, modelUrl: 'C.glb' })
    await controller.applyEquipmentVisuals('arms', { modelUrl: 'other.glb' })
    controller.setHeldTool('shovel')
    expect(assembleCharacter).toHaveBeenCalledTimes(1)
    expect(loadGltf).toHaveBeenCalledTimes(1)
    expect(createHeldToolObject).not.toHaveBeenCalled()
  })

  it('discards an accessory already waiting for tint when disposed', async () => {
    const { controller } = await player()
    const accessory = model()
    const tint = deferred<THREE.Texture>()
    vi.mocked(loadGltf).mockResolvedValue(accessory.scene)
    vi.mocked(loadTexture).mockReturnValueOnce(tint.promise)
    const loading = controller.applyEquipmentVisuals('arms', { modelUrl: 'armor.glb', tint: 'brown' })
    await vi.waitFor(() => expect(loadTexture).toHaveBeenCalledOnce())
    const ownedDispose = vi.spyOn(accessory.mesh.material as THREE.Material, 'dispose')
    controller.dispose()
    tint.resolve(new THREE.Texture())
    await loading
    expect(accessory.mesh.parent?.parent).toBeNull()
    expect(ownedDispose).toHaveBeenCalledOnce()
  })

  it('discards a held-tool completion after disposal', async () => {
    const { controller } = await player()
    const tool = deferred<THREE.Object3D>()
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
    const dispose = vi.spyOn(mesh.material, 'dispose')
    vi.mocked(createHeldToolObject).mockReturnValueOnce(tool.promise)
    controller.setHeldTool('shovel')
    controller.dispose()
    tool.resolve(mesh)
    await tool.promise
    await Promise.resolve()
    expect(controller.getHeldToolObject()).toBeNull()
    expect(dispose).toHaveBeenCalledOnce()
  })


  it('does not install a stale legacy model when its extra animation load fails', async () => {
    const { controller, initial } = await player()
    const next = model()
    const animation = deferred<Awaited<ReturnType<typeof loadGltfAnimated>>>()
    vi.mocked(loadGltfAnimated).mockResolvedValueOnce(next).mockReturnValueOnce(animation.promise)
    const loading = controller.applyAppearance({ ...base, modelUrl: 'B.glb', animationUrl: 'other.glb' })
    await vi.waitFor(() => expect(loadGltfAnimated).toHaveBeenCalledTimes(4))
    await controller.applyAppearance(base)
    animation.reject(new Error('animation unavailable'))
    await loading
    expect(controller.mesh.children).toContain(initial.scene)
    expect(next.scene.parent).toBeNull()
  })

})
