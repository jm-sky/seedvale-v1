import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { beforeAll, describe, expect, it } from 'vitest'
import { buildAssetIndex } from '../assets/assetIndex'
import { disposeObject3D, markSharedGpu, prepareAuthoredScaleMax } from '../assets/loadGltf'
import { createHouseLight, lanternGlassCenter } from './houseLighting'
import {
  LANTERN_FLOOR_MAX,
  LANTERN_STANDING_URL,
  LANTERN_URL,
  LANTERN_WALL_MAX,
  LANTERN_WALL_URL,
} from './propSpecs'

// Real GLBs from disk; `loadGltf` itself needs fetch/DOM, so parse the same bytes
// with GLTFLoader and mark them shared-GPU like the production cache does.
async function loadOnDisk(url: string): Promise<THREE.Group> {
  const bytes = await readFile(resolve(import.meta.dirname, '../../public', url.slice(1)))
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  const gltf = await new GLTFLoader().parseAsync(buf, '')
  markSharedGpu(gltf.scene)
  return gltf.scene
}

function stats(root: THREE.Object3D) {
  let triangles = 0
  let primitives = 0
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (!m.isMesh) return
    primitives++
    triangles += (m.geometry.index?.count ?? m.geometry.getAttribute('position').count) / 3
  })
  return { triangles, primitives }
}

const sizeOf = (o: THREE.Object3D) => new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3())

/** Exact world-space bounds over mesh vertices, optionally only `*<suffix>` materials. */
function vertexBounds(root: THREE.Object3D, matSuffix?: string): THREE.Box3 {
  root.updateMatrixWorld(true)
  const box = new THREE.Box3()
  const v = new THREE.Vector3()
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (!m.isMesh) return
    if (matSuffix && !(m.material as THREE.Material).name.endsWith(matSuffix)) return
    const pos = m.geometry.getAttribute('position')
    for (let i = 0; i < pos.count; i++) box.expandByPoint(v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld))
  })
  return box
}

const pointLights = (root: THREE.Object3D) => {
  const out: THREE.PointLight[] = []
  root.traverse((o) => { if ((o as THREE.PointLight).isPointLight) out.push(o as THREE.PointLight) })
  return out
}
/** Interior fill is the 12 m light; the exterior one is 10 m (wall) / 20 m (standing). */
const exteriorOf = (root: THREE.Object3D) => pointLights(root).find((l) => l.distance !== 12)!

/** Mirrors `props.ts`: hut scaled by `hutScale`, each lamp child scaled by 1/hutScale. */
function mountOnHut(lamp: ReturnType<typeof createHouseLight>, hutScale: number, yaw: number, at: THREE.Vector3) {
  const hut = new THREE.Group()
  hut.position.copy(at)
  hut.rotation.y = yaw
  hut.scale.setScalar(hutScale)
  for (const child of lamp.object.children) child.scale.multiplyScalar(1 / hutScale)
  hut.add(lamp.object)
  hut.updateMatrixWorld(true)
  return hut
}

let wall: THREE.Group
let standing: THREE.Group
beforeAll(async () => {
  wall = prepareAuthoredScaleMax(await loadOnDisk(LANTERN_WALL_URL), LANTERN_WALL_MAX) as THREE.Group
  standing = prepareAuthoredScaleMax(await loadOnDisk(LANTERN_STANDING_URL), LANTERN_FLOOR_MAX) as THREE.Group
})

const WALL_K = LANTERN_WALL_MAX / 0.73

describe('optimized lantern GLBs', () => {
  it('ship 144 triangles in 3 primitives with the documented authored size', async () => {
    for (const [url, dims] of [
      [LANTERN_WALL_URL, [0.24, 0.73, 0.54]],
      [LANTERN_STANDING_URL, [0.25, 1.8, 0.85]],
    ] as const) {
      const raw = await loadOnDisk(url)
      expect(stats(raw)).toEqual({ triangles: 144, primitives: 3 })
      const s = sizeOf(raw)
      expect([s.x, s.y, s.z].map((v) => +v.toFixed(2))).toEqual([...dims])
    }
  })

  it('wall asset origin is the plate back, arm on +Z, lantern hanging below', async () => {
    const box = vertexBounds(await loadOnDisk(LANTERN_WALL_URL))
    expect(box.min.z).toBeCloseTo(0, 3)
    expect(box.max.z).toBeCloseTo(0.54, 2)
    expect(box.max.y).toBeCloseTo(0.25, 2)
    expect(box.min.y).toBeCloseTo(-0.48, 2)
  })

  it('standing asset origin is the centre of the post foot', async () => {
    const box = vertexBounds(await loadOnDisk(LANTERN_STANDING_URL))
    expect(box.min.y).toBeCloseTo(0, 3)
    expect(box.max.y).toBeCloseTo(1.8, 2)
  })

  it('scaleMax fits the longest axis without moving the origin', () => {
    const s = sizeOf(wall)
    expect(Math.max(s.x, s.y, s.z)).toBeCloseTo(LANTERN_WALL_MAX, 4)
    expect(vertexBounds(wall).min.z).toBeCloseTo(0, 4)
    expect(wall.position.lengthSq()).toBe(0)
  })
})

describe('wall lantern placement', () => {
  it.each([
    ['unrotated, scale 1', 0, 1],
    ['rotated catalog-sized house, scale 0.1', 2.1, 0.1],
    ['rotated house, scale 0.37', -1.3, 0.37],
  ])('plate is flush with the wall and the arm points outward (%s)', (_name, houseYaw, hutScale) => {
    // Wall face looks along hut-local +X; mount sits on it.
    const mount = new THREE.Vector3(1.4, 1.2, 0.3)
    const lamp = createHouseLight(mount.y, mount.x, mount.z, 'wall', wall, Math.PI / 2)
    const hut = mountOnHut(lamp, hutScale, houseYaw, new THREE.Vector3(5, 0, -3))
    const worldMount = hut.localToWorld(mount.clone())
    const outward = new THREE.Vector3(1, 0, 0).transformDirection(hut.matrixWorld)

    let minDepth = Infinity
    let maxDepth = -Infinity
    const v = new THREE.Vector3()
    lamp.object.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const pos = m.geometry.getAttribute('position')
      for (let i = 0; i < pos.count; i++) {
        const d = v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).sub(worldMount).dot(outward)
        minDepth = Math.min(minDepth, d)
        maxDepth = Math.max(maxDepth, d)
      }
    })
    expect(Math.abs(minDepth)).toBeLessThan(1e-5) // plate back on the surface, nothing buried
    expect(maxDepth).toBeCloseTo(0.54 * WALL_K, 3) // arm reaches out, house scale compensated

    const box = vertexBounds(lamp.object)
    expect(box.max.y - worldMount.y).toBeCloseTo(0.25 * WALL_K, 3) // support above mount
    expect(worldMount.y - box.min.y).toBeCloseTo(0.48 * WALL_K, 3) // lantern hangs below, no post
  })

  it('derives the outward yaw from the mount when none is given', () => {
    const lamp = createHouseLight(1, 0, 2, 'wall', wall)
    const box = vertexBounds(lamp.object)
    expect(box.min.z).toBeCloseTo(2, 4)
    expect(box.max.z).toBeCloseTo(2 + 0.54 * WALL_K, 3)
  })
})

describe('standing lantern placement', () => {
  it('post foot sits on the mount height, upright and centred', () => {
    const lamp = createHouseLight(0.55, 0, 0, 'floorCenter', standing)
    mountOnHut(lamp, 1, 0, new THREE.Vector3(0, 10, 0))
    const box = vertexBounds(lamp.object)
    expect(box.min.y).toBeCloseTo(10.55, 4)
    expect(box.max.y - box.min.y).toBeCloseTo(LANTERN_FLOOR_MAX, 4)
    expect(box.min.x).toBeCloseTo(-box.max.x, 4)
  })

  it('keeps legacy world size under house-scale compensation', () => {
    const lamp = createHouseLight(0.55, 0, 0, 'floorCenter', standing)
    mountOnHut(lamp, 0.1, 0.7, new THREE.Vector3(0, 0, 0))
    expect(vertexBounds(lamp.object).getSize(new THREE.Vector3()).y).toBeCloseTo(LANTERN_FLOOR_MAX, 4)
  })
})

describe('lantern lighting', () => {
  it.each([
    ['wall', new THREE.Vector3(1.4, 1.2, 0.3), () => wall],
    ['floorCenter', new THREE.Vector3(0, 0.55, 0), () => standing],
  ] as const)('%s: a single exterior PointLight sits inside the glass', (style, mount, tpl) => {
    const lamp = createHouseLight(mount.y, mount.x, mount.z, style, tpl(), Math.PI / 2)
    expect(pointLights(lamp.object)).toHaveLength(2) // exterior + interior fill, unchanged budget
    mountOnHut(lamp, 0.2, 0.9, new THREE.Vector3(3, 0, 4))
    const glass = vertexBounds(lamp.object, '_Light').expandByScalar(1e-4)
    expect(glass.containsPoint(exteriorOf(lamp.object).getWorldPosition(new THREE.Vector3()))).toBe(true)
  })

  it('glass centre is below the wall support and out from the plate', () => {
    const c = lanternGlassCenter(wall)
    expect(c.y).toBeLessThan(-0.1)
    expect(c.z).toBeGreaterThan(0.2)
  })

  it('keeps the day/night intensity and visibility contract', () => {
    const w = createHouseLight(1, 1, 0, 'wall', wall, 0)
    const s = createHouseLight(0.5, 0, 0, 'floorCenter', standing)
    w.setNightIntensity(1)
    s.setNightIntensity(1)
    expect(exteriorOf(w.object).intensity).toBe(2.5)
    expect(exteriorOf(s.object).intensity).toBe(5)
    w.setNightIntensity(0)
    for (const l of pointLights(w.object)) {
      expect(l.intensity).toBe(0)
      expect(l.visible).toBe(false)
    }
  })

  it('procedural fallback builds one exterior light and the box lamp', () => {
    const lamp = createHouseLight(1, 0, 2, 'wall', null)
    let meshes = 0
    lamp.object.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes++ })
    expect(pointLights(lamp.object)).toHaveLength(2)
    expect(meshes).toBe(3)
  })

  it('works with either variant missing independently', () => {
    expect(vertexBounds(createHouseLight(1, 1, 0, 'wall', wall).object).isEmpty()).toBe(false)
    expect(vertexBounds(createHouseLight(0.5, 0, 0, 'floorCenter', standing).object).isEmpty()).toBe(false)
    expect(() => createHouseLight(1, 1, 0, 'wall', null)).not.toThrow()
    expect(() => createHouseLight(0.5, 0, 0, 'floorCenter', null)).not.toThrow()
  })
})

describe('lifecycle and registry', () => {
  it('disposing one house lamp keeps shared template GPU resources alive', () => {
    const a = createHouseLight(1, 1, 0, 'wall', wall)
    const b = createHouseLight(1, 1, 0, 'wall', wall)
    let disposed = 0
    wall.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.geometry.addEventListener('dispose', () => disposed++)
      ;(m.material as THREE.Material).addEventListener('dispose', () => disposed++)
    })
    disposeObject3D(a.object)
    expect(disposed).toBe(0)
    expect(vertexBounds(b.object).isEmpty()).toBe(false)
  })

  it('maps Asset Browser entries to the new GLBs with origin-preserving fit', () => {
    const index = buildAssetIndex()
    const w = index.find((e) => e.id === 'settlement:lantern_wall')
    const s = index.find((e) => e.id === 'settlement:lantern')
    expect(w?.url).toBe(LANTERN_WALL_URL)
    expect(s?.url).toBe(LANTERN_STANDING_URL)
    expect(w?.prepare).toEqual({ mode: 'scaleMax', value: LANTERN_WALL_MAX })
    expect(s?.prepare).toEqual({ mode: 'scaleMax', value: LANTERN_FLOOR_MAX })
  })

  it('keeps the three lantern URLs distinct', () => {
    expect(new Set([LANTERN_STANDING_URL, LANTERN_URL, LANTERN_WALL_URL]).size).toBe(3)
  })
})
