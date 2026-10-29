import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { buildInstancedProps } from '../render/instancedProps'
import { createPlacedContainerProp } from '../world/containerProp'
import { houseChestPlacement } from './props'

/** The pre-Q5 path: a chest group as a child of the house, with the house
 *  scale cancelled (`props.ts` `invHouseScaleFurniture`). */
function childChestMatrices(hut: THREE.Object3D, furniture: { position: THREE.Vector3Like; rotationY: number }): THREE.Matrix4[] {
  const chest = createPlacedContainerProp()
  chest.position.set(furniture.position.x, furniture.position.y, furniture.position.z)
  chest.rotation.y = furniture.rotationY
  chest.scale.multiplyScalar(1 / Math.abs(hut.scale.x))
  hut.add(chest)
  hut.updateMatrixWorld(true)
  const out: THREE.Matrix4[] = []
  chest.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) out.push(node.matrixWorld.clone())
  })
  hut.remove(chest)
  return out
}

function expectMatrixClose(actual: THREE.Matrix4, expected: THREE.Matrix4): void {
  for (let i = 0; i < 16; i++) expect(actual.elements[i]).toBeCloseTo(expected.elements[i]!, 3) // instanceMatrix is float32
}

describe('houseChestPlacement (Q5 chest instancing)', () => {
  const cases = [
    { yaw: 0, scale: 1, pos: [0, 0, 0] },
    { yaw: 0.7, scale: 1, pos: [12, 3.5, -40] },
    { yaw: -2.3, scale: 1.4, pos: [-310.2, 17.1, 88.6] },
  ] as const

  for (const c of cases) {
    it(`matches the child-chest world transform (yaw ${c.yaw}, scale ${c.scale})`, () => {
      const hut = new THREE.Group()
      hut.position.set(c.pos[0], c.pos[1], c.pos[2])
      hut.rotation.y = c.yaw
      hut.scale.setScalar(c.scale)
      const furniture = { position: { x: 1.2, y: 0.05, z: -0.8 }, rotationY: Math.PI / 2 }

      const expected = childChestMatrices(hut, furniture)
      const instanced = buildInstancedProps([createPlacedContainerProp()], [houseChestPlacement(hut, furniture)], 'settlement-house-chests')!
      const meshes = instanced.group.children as THREE.InstancedMesh[]

      expect(meshes).toHaveLength(expected.length)
      const m = new THREE.Matrix4()
      meshes.forEach((mesh, i) => {
        mesh.getMatrixAt(0, m)
        expectMatrixClose(m, expected[i]!)
      })
    })
  }

  it('keeps the per-part shadow policy and shares one bucket per part across houses', () => {
    const template = createPlacedContainerProp()
    const huts = [0, 1, 2].map((i) => {
      const hut = new THREE.Group()
      hut.position.set(i * 10, 0, 0)
      hut.rotation.y = i
      return hut
    })
    const placements = huts.map((hut) => houseChestPlacement(hut, { position: { x: 0, y: 0, z: 0 }, rotationY: 0 }))
    const instanced = buildInstancedProps([template], placements, 'settlement-house-chests')!
    const meshes = instanced.group.children as THREE.InstancedMesh[]

    // body, lid, 2 straps, clasp — five draws for the whole settlement.
    expect(meshes.map((mesh) => mesh.count)).toEqual([3, 3, 3, 3, 3])
    expect(meshes.map((mesh) => [mesh.castShadow, mesh.receiveShadow])).toEqual([
      [true, true],
      [true, false],
      [false, false],
      [false, false],
      [false, false],
    ])
  })
})
