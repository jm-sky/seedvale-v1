import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { describe, expect, it } from 'vitest'
import type { DressingPlacement } from './professionDressing'
import { buildProfessionDressingMeshes, extractProfessionDressingPack, professionDressingColliders } from './professionDressingMesh'

// Parse the shipped (meshopt-compressed, textured) GLB from disk. Textures need DOM image decoding, which is
// irrelevant to the geometry under test, so they are stripped and the file is re-serialised uncompressed first.
async function pack() {
  await MeshoptDecoder.ready
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
  const doc = await io.read(resolve(import.meta.dirname, '../../public/models/settlement/profession-dressing.glb'))
  for (const t of doc.getRoot().listTextures()) t.dispose()
  for (const ext of doc.getRoot().listExtensionsUsed()) if (ext instanceof EXTMeshoptCompression) ext.dispose()
  const bytes = await new NodeIO().registerExtensions(ALL_EXTENSIONS).writeBinary(doc)
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  const gltf = await new GLTFLoader().parseAsync(buf, '')
  return extractProfessionDressingPack(gltf.scene)
}

const wall = (kit: 'antlers' | 'shield' | 'banner' | 'netOnWall', side: 'front' | 'left', i: number): DressingPlacement => ({
  id: `w${i}`, kind: 'wall', kit, role: 'hunter', side, x: i, y: 0, z: -2.5, normal: { x: 0, z: -1 },
})
const slot = (kit: 'hidesFrame' | 'dryingRack' | 'stumpWithAxe' | 'sacks' | 'handCart' | 'herbBed', i: number): DressingPlacement => ({
  id: `s${i}`, kind: 'slot', kit, role: 'hunter', x: i * 10, z: 0, yaw: 0.3,
})

describe('professionDressingMesh (Q48)', () => {
  it('extracts every kit node and merges all kits into few draws', async () => {
    const p = await pack()
    const all: DressingPlacement[] = [
      wall('antlers', 'front', 0), wall('shield', 'front', 2), wall('banner', 'left', 3), wall('netOnWall', 'front', 4),
      slot('hidesFrame', 1), slot('dryingRack', 2), slot('stumpWithAxe', 3), slot('sacks', 4), slot('handCart', 5), slot('herbBed', 6),
    ]
    const meshes = buildProfessionDressingMeshes(
      p, all.map((placement, i) => ({ familyIndex: i, placement })), () => ({ x: 0, z: 0, yaw: 0 }), () => 1,
    )
    expect(meshes.length).toBeGreaterThan(0)
    expect(meshes.length).toBeLessThanOrEqual(5) // plan budget: ≤ 6 main draws per settlement
    for (const m of meshes) {
      const pos = m.geometry.getAttribute('position')
      for (let i = 0; i < pos.count * 3; i++) expect(Number.isFinite((pos.array as Float32Array)[i])).toBe(true)
    }
  })

  it('places a front wall piece on the wall face, facing outward', async () => {
    const p = await pack()
    const [m] = buildProfessionDressingMeshes(
      p, [{ familyIndex: 0, placement: wall('shield', 'front', 0) }], () => ({ x: 100, z: 50, yaw: 0 }), () => 0,
    )
    const box = new THREE.Box3().setFromBufferAttribute(m!.geometry.getAttribute('position') as THREE.BufferAttribute)
    // front wall at house-local z = -2.5; the shield extends outward (towards -z) from there
    expect(box.max.z).toBeLessThanOrEqual(50 - 2.5 + 0.1 + 1e-3)
    expect(box.min.z).toBeLessThan(50 - 2.5)
    expect(box.min.y).toBeGreaterThan(1.2)
  })

  it('derives one OBB collider per slot piece only', () => {
    const cols = professionDressingColliders([wall('antlers', 'front', 0), slot('handCart', 1), slot('sacks', 2)])
    expect(cols).toHaveLength(2)
    expect(cols[0]).toMatchObject({ type: 'obb', halfWidth: 1.2, halfDepth: 0.5 })
  })

  it.each([0, 0.7, Math.PI / 2, -2.4])('wall piece stays on the wall face for house yaw %s', async (yaw) => {
    const p = await pack()
    const origin = { x: 40, z: -20, yaw }
    const [m] = buildProfessionDressingMeshes(
      p, [{ familyIndex: 0, placement: { ...wall('shield', 'front', 0), x: 1, z: -2.5 } }], () => origin, () => 0,
    )
    const box = new THREE.Box3().setFromBufferAttribute(m!.geometry.getAttribute('position') as THREE.BufferAttribute)
    // wall point & outward normal of the front face in world space
    const wallPoint = new THREE.Vector3(origin.x + Math.cos(yaw) * 1 + Math.sin(yaw) * -2.5, 0, origin.z - Math.sin(yaw) * 1 + Math.cos(yaw) * -2.5)
    const outward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
    const c = box.getCenter(new THREE.Vector3())
    const depth = c.clone().sub(wallPoint).setY(0).dot(outward)
    expect(depth).toBeGreaterThan(-0.15) // not buried in the wall
    expect(depth).toBeLessThan(0.25) // within the shield's own depth, not floating off the wall
  })
})

