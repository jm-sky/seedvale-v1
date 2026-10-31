/**
 * V2 cemetery piece pack loader (queue Q47 / Q39 plan §2.3) — extracts the grave/crypt pieces from
 * `graveyard.glb` as plain, de-quantized (Float32) vertex data so they can be baked into ONE merged mesh per
 * cemetery (`cemeteryMesh.ts`). The GLB is meshopt + `KHR_mesh_quantization` encoded: quantized attributes
 * cannot take `applyMatrix4`, hence the conversion. The shared atlas material comes from the loader cache
 * (`loadGltfAsset`, already `sharedGpu`), so `disposeObject3D` on a cemetery frees only its own geometry.
 * @domain world-terrain
 */
import * as THREE from 'three'
import type { CemeteryPieceId } from './cemeteryLayout'
import { loadGltfAsset } from '../assets/loadGltf'
import { GRAVEYARD_GLB } from './propSpecs'

export type CemeteryPieceData = {
  position: Float32Array
  normal: Float32Array
  uv: Float32Array | null
  index: Uint32Array
}

export type CemeteryPiecePack = {
  pieces: Record<CemeteryPieceId, CemeteryPieceData>
  material: THREE.Material
}

const PIECE_IDS: readonly CemeteryPieceId[] = [
  'Grave', 'Gravestone', 'Grave_Marker_A', 'Grave_Marker_B', 'Grave_Damaged', 'Crypt',
]

/** Reads a (possibly interleaved / normalized) attribute into a dense Float32Array, applying `m`
 *  (position: full matrix, normal: normal matrix) when given. */
function readAttribute(
  attr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  size: 2 | 3,
  out: Float32Array,
  offset: number,
  m?: THREE.Matrix4 | THREE.Matrix3,
  isNormal = false,
): void {
  const v = new THREE.Vector3()
  for (let i = 0; i < attr.count; i++) {
    const o = offset + i * size
    if (size === 2) {
      out[o] = attr.getX(i)
      out[o + 1] = attr.getY(i)
      continue
    }
    v.set(attr.getX(i), attr.getY(i), attr.getZ(i))
    if (m) {
      if (isNormal) v.applyNormalMatrix(m as THREE.Matrix3).normalize()
      else v.applyMatrix4(m as THREE.Matrix4)
    }
    out[o] = v.x
    out[o + 1] = v.y
    out[o + 2] = v.z
  }
}

/** Extracts one wrapper node's meshes into a single piece (mesh transform relative to the wrapper baked in). */
function extractPiece(wrapper: THREE.Object3D): { data: CemeteryPieceData, material: THREE.Material } | null {
  const meshes: THREE.Mesh[] = []
  wrapper.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh)
  })
  if (meshes.length === 0) return null
  wrapper.updateWorldMatrix(true, true)
  const inverse = wrapper.matrixWorld.clone().invert()
  let vertexCount = 0
  let indexCount = 0
  for (const m of meshes) {
    const g = m.geometry
    vertexCount += g.attributes.position!.count
    indexCount += g.index ? g.index.count : g.attributes.position!.count
  }
  const position = new Float32Array(vertexCount * 3)
  const normal = new Float32Array(vertexCount * 3)
  const hasUv = meshes.every((m) => !!m.geometry.attributes.uv)
  const uv = hasUv ? new Float32Array(vertexCount * 2) : null
  const index = new Uint32Array(indexCount)
  let vOff = 0
  let iOff = 0
  for (const m of meshes) {
    const g = m.geometry
    const toWrapper = new THREE.Matrix4().multiplyMatrices(inverse, m.matrixWorld)
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(toWrapper)
    const pos = g.attributes.position!
    readAttribute(pos, 3, position, vOff * 3, toWrapper)
    if (g.attributes.normal) readAttribute(g.attributes.normal, 3, normal, vOff * 3, normalMatrix, true)
    else for (let i = 0; i < pos.count; i++) normal[(vOff + i) * 3 + 1] = 1
    if (uv && g.attributes.uv) readAttribute(g.attributes.uv, 2, uv, vOff * 2)
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) index[iOff + i] = g.index.getX(i) + vOff
      iOff += g.index.count
    } else {
      for (let i = 0; i < pos.count; i++) index[iOff + i] = vOff + i
      iOff += pos.count
    }
    vOff += pos.count
  }
  const first = meshes[0]!.material
  const material = Array.isArray(first) ? first[0]! : first
  return { data: { position, normal, uv, index }, material }
}

let packPromise: Promise<CemeteryPiecePack | null> | null = null
let packValue: CemeteryPiecePack | null | undefined

/** Loads (once) and returns the piece pack, or `null` when the GLB failed / lacks a piece (callers fall back
 *  to the procedural markers). Resolves exactly once — `peekCemeteryPack` becomes defined afterwards. */
export function loadCemeteryPack(): Promise<CemeteryPiecePack | null> {
  packPromise ??= (async () => {
    try {
      const asset = await loadGltfAsset(GRAVEYARD_GLB.url)
      asset.root.updateMatrixWorld(true)
      const pieces = {} as Record<CemeteryPieceId, CemeteryPieceData>
      let material: THREE.Material | null = null
      for (const id of PIECE_IDS) {
        const wrapper = asset.root.getObjectByName(id)
        const extracted = wrapper ? extractPiece(wrapper) : null
        if (!extracted) throw new Error(`graveyard.glb: piece "${id}" missing`)
        pieces[id] = extracted.data
        material ??= extracted.material
      }
      packValue = { pieces, material: material! }
    } catch (err) {
      console.error('[cemeteryPack] load failed, using procedural cemetery fallback', err)
      packValue = null
    }
    return packValue
  })()
  return packPromise
}

/** Sync read for chunk finalization: `undefined` = still loading, `null` = failed (fallback), else the pack. */
export function peekCemeteryPack(): CemeteryPiecePack | null | undefined {
  return packValue
}
