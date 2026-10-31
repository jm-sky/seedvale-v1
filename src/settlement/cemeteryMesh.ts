/**
 * One merged mesh per cemetery (queue Q47 / Q39 plan §2.3, V2 `render/cemeteries.ts` idea): every marker and
 * crypt is baked with its world-relative matrix into a single `BufferGeometry` sharing the pack's atlas
 * material → 1 main + 1 shadow draw per cemetery. The geometry is per-instance (freed by `disposeObject3D` on
 * chunk unload); the material is the loader-cache shared one (`sharedGpu`).
 * @domain world-terrain
 */
import * as THREE from 'three'
import type { CemeteryPieceId } from './cemeteryLayout'
import type { CemeteryPiecePack } from './cemeteryPack'
import { applyTerrainTilt } from './propUtils'

export type CemeteryPieceInstance = {
  piece: CemeteryPieceId
  /** Position relative to the cemetery group origin. */
  x: number
  y: number
  z: number
  yaw: number
  scale: number
  /** Terrain normal for the tilt (null = no tilt). */
  normal: THREE.Vector3 | null
  maxTiltRad: number
}

const _obj = new THREE.Object3D()
const _normalMatrix = new THREE.Matrix3()
const _v = new THREE.Vector3()

/** Bakes `instances` into one Mesh (`name: 'cemetery-merged'`). Deterministic; allocation = one set of typed arrays. */
export function buildMergedCemeteryMesh(pack: CemeteryPiecePack, instances: readonly CemeteryPieceInstance[]): THREE.Mesh {
  let vertexCount = 0
  let indexCount = 0
  for (const inst of instances) {
    const piece = pack.pieces[inst.piece]
    vertexCount += piece.position.length / 3
    indexCount += piece.index.length
  }
  const position = new Float32Array(vertexCount * 3)
  const normal = new Float32Array(vertexCount * 3)
  const uv = new Float32Array(vertexCount * 2)
  const index = vertexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount)
  let vOff = 0
  let iOff = 0
  for (const inst of instances) {
    const piece = pack.pieces[inst.piece]
    _obj.position.set(inst.x, inst.y, inst.z)
    _obj.quaternion.identity()
    _obj.rotation.set(0, inst.yaw, 0)
    _obj.scale.setScalar(inst.scale)
    if (inst.normal && inst.maxTiltRad > 0) applyTerrainTilt(_obj, inst.normal, inst.maxTiltRad)
    _obj.updateMatrix()
    _normalMatrix.getNormalMatrix(_obj.matrix)
    const n = piece.position.length / 3
    for (let i = 0; i < n; i++) {
      const o = (vOff + i) * 3
      _v.set(piece.position[i * 3]!, piece.position[i * 3 + 1]!, piece.position[i * 3 + 2]!).applyMatrix4(_obj.matrix)
      position[o] = _v.x
      position[o + 1] = _v.y
      position[o + 2] = _v.z
      _v.set(piece.normal[i * 3]!, piece.normal[i * 3 + 1]!, piece.normal[i * 3 + 2]!).applyNormalMatrix(_normalMatrix).normalize()
      normal[o] = _v.x
      normal[o + 1] = _v.y
      normal[o + 2] = _v.z
      if (piece.uv) {
        uv[(vOff + i) * 2] = piece.uv[i * 2]!
        uv[(vOff + i) * 2 + 1] = piece.uv[i * 2 + 1]!
      }
    }
    for (let i = 0; i < piece.index.length; i++) index[iOff + i] = piece.index[i]! + vOff
    vOff += n
    iOff += piece.index.length
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.setIndex(new THREE.BufferAttribute(index, 1))
  geometry.computeBoundingSphere()
  const mesh = new THREE.Mesh(geometry, pack.material)
  mesh.name = 'cemetery-merged'
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}
