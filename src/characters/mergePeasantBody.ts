import {
  AttachedBindMode, BufferAttribute, type BufferGeometry, Float32BufferAttribute,
  Matrix4, MeshStandardMaterial, type Object3D, Skeleton, SkinnedMesh, Vector3,
} from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { CharacterAppearance } from './characterTypes'

export type BodyMergeResult = {
  merged: boolean
  before: number
  after: number
  reason?: string
}

const EXPECTED = { Male: 5, Female: 4 } as const
// Float32 inverse-bind quantization: measured shipped residual <= 1.4e-7.
const FACTOR_EPSILON = 5e-7

function usable(matrix: Matrix4): boolean {
  return matrix.elements.every(Number.isFinite) && Number.isFinite(matrix.determinant())
    && Math.abs(matrix.determinant()) > 1e-12
}

function near(a: Matrix4, b: Matrix4): boolean {
  return a.elements.every((value, i) => Math.abs(value - b.elements[i]) <= FACTOR_EPSILON)
}

function equalState(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
  if (a.constructor !== b.constructor) return false
  if ('isTexture' in a || 'isTexture' in b) return false // Require actual texture identity.
  if ('equals' in a && typeof a.equals === 'function') return a.equals(b)
  if (!Array.isArray(a) && Object.getPrototypeOf(a) !== Object.prototype) return false
  const left = Object.keys(a), right = Object.keys(b)
  return left.length === right.length && left.every((key) => Object.hasOwn(b, key)
    && equalState((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
}

function materialsEquivalent(a: MeshStandardMaterial, b: MeshStandardMaterial): boolean {
  // Compare exact linear color/vector components and texture references. toJSON
  // quantizes colors to hex and may encode texture images; neither is suitable.
  const ignored = new Set(['_listeners', 'id', 'name', 'uuid', 'version', 'vertexColors'])
  const left = Object.keys(a).filter((key) => !ignored.has(key))
  const right = Object.keys(b).filter((key) => !ignored.has(key))
  return left.length === right.length && left.every((key) => Object.hasOwn(b, key)
    && equalState((a as unknown as Record<string, unknown>)[key], (b as unknown as Record<string, unknown>)[key]))
}

/** Transform directions linearly, without normalization: the skin shader later
 * applies the compensating bind operator. Normal matrices here would be wrong. */
function convert(attribute: BufferAttribute, matrix: Matrix4, direction: boolean): BufferAttribute {
  const values = new Float32Array(attribute.count * attribute.itemSize)
  const point = new Vector3()
  const e = matrix.elements
  for (let i = 0; i < attribute.count; i++) {
    point.fromBufferAttribute(attribute, i)
    if (direction) {
      const { x, y, z } = point
      point.set(e[0] * x + e[4] * y + e[8] * z,
        e[1] * x + e[5] * y + e[9] * z, e[2] * x + e[6] * y + e[10] * z)
    } else point.applyMatrix4(matrix)
    values.set([point.x, point.y, point.z], i * attribute.itemSize)
    if (attribute.itemSize === 4) values[i * 4 + 3] = attribute.getW(i)
  }
  return new BufferAttribute(values, attribute.itemSize)
}

/** NPC-only D11 experiment. All validation precedes mutation; unknown bodies
 * retain their original meshes. Call after appearance preparation, before bounds.
 *
 * Ipart = Icanonical * T, C = inverse(Bcanonical) * T * Bpart.
 * Baking C into base/morph position and direction attributes preserves the skin
 * operator for every pose. Equal mesh world transforms also preserve Three's
 * normalMatrix and tangent semantics. Independent part transforms fail open.
 * No skeleton sharing is installed: the merged cloth owns a new palette.
 */
export function mergePeasantBody(
  root: Object3D,
  kit: Pick<CharacterAppearance, 'sex' | 'outfit'>,
  body: readonly SkinnedMesh[],
  animations: readonly import('three').AnimationClip[] = [],
): BodyMergeResult {
  const fail = (reason: string): BodyMergeResult => ({ merged: false, before: body.length, after: body.length, reason })
  if (kit.outfit !== 'Peasant' || body.length !== EXPECTED[kit.sex]) return fail('unsupported body')
  if (new Set(body).size !== body.length) return fail('duplicate body ownership')
  root.updateMatrixWorld(true)
  const cloth = body.filter((mesh) => !Array.isArray(mesh.material) && mesh.material.name === 'MI_Peasant')
  if (cloth.length !== 4) return fail('unexpected material boundaries')
  const first = cloth[0]
  const material = first.material
  if (!(material instanceof MeshStandardMaterial) || material.transparent || material.alphaHash || material.flatShading) return fail('unsupported material')
  if (material.onBeforeCompile !== MeshStandardMaterial.prototype.onBeforeCompile
    || material.onBeforeRender !== MeshStandardMaterial.prototype.onBeforeRender
    || material.customProgramCacheKey !== MeshStandardMaterial.prototype.customProgramCacheKey) return fail('custom material shader')
  const bones = first.skeleton?.bones
  if (!bones?.length || !usable(first.bindMatrix)) return fail('missing binding')
  if (bones.length !== first.skeleton.boneInverses.length
    || !first.skeleton.boneInverses.every(usable)) return fail('missing inverse binds')
  const descendants = new Set<Object3D>()
  root.traverse((node) => descendants.add(node))
  if (body.some((mesh) => !descendants.has(mesh)) || bones.some((bone) => !descendants.has(bone))) return fail('foreign actor ownership')
  const names = new Set<string>()
  const uuids = new Set<string>()
  for (const mesh of cloth) {
    for (let node: Object3D | null = mesh; node && node !== root; node = node.parent) {
      names.add(node.name)
      uuids.add(node.uuid)
      if (!node.visible || node.layers.mask !== first.layers.mask) return fail('independent visibility')
    }
  }
  // Bone animation is expected; independent mesh/ancestor/morph tracks are not.
  if (animations.some((clip) => clip.tracks.some((track) => {
    const target = track.name.split('.')[0]
    return names.has(target) || uuids.has(target)
  }))) return fail('animated part transform or morph')
  const conversions: Matrix4[] = []
  for (const mesh of cloth) {
    const m = mesh.material
    const g = mesh.geometry
    if (!(m instanceof MeshStandardMaterial) || !materialsEquivalent(m, material)
      || m.onBeforeCompile !== material.onBeforeCompile || m.customProgramCacheKey !== material.customProgramCacheKey
      || m.onBeforeRender !== material.onBeforeRender) return fail('material state differs')
    if (!mesh.isSkinnedMesh || mesh.bindMode !== AttachedBindMode || !mesh.parent || mesh.children.length
      || !usable(mesh.matrixWorld) || !near(mesh.matrixWorld, first.matrixWorld)
      || !usable(mesh.bindMatrix) || mesh.castShadow !== first.castShadow || mesh.receiveShadow !== first.receiveShadow
      || mesh.visible !== first.visible || mesh.frustumCulled !== first.frustumCulled
      || mesh.renderOrder !== first.renderOrder || mesh.layers.mask !== first.layers.mask
      || mesh.customDepthMaterial || mesh.customDistanceMaterial
      || mesh.skeleton.boneTexture
      || mesh.onBeforeShadow !== first.onBeforeShadow || mesh.onAfterShadow !== first.onAfterShadow
      || mesh.onBeforeRender !== SkinnedMesh.prototype.onBeforeRender || mesh.onAfterRender !== SkinnedMesh.prototype.onAfterRender
      || mesh.onBeforeShadow !== SkinnedMesh.prototype.onBeforeShadow || mesh.onAfterShadow !== SkinnedMesh.prototype.onAfterShadow
      || mesh.raycast !== SkinnedMesh.prototype.raycast) return fail('mesh policy differs')
    if (mesh.skeleton.bones.length !== bones.length || mesh.skeleton.bones.some((bone, i) => bone !== bones[i])
      || mesh.skeleton.boneInverses.length !== bones.length
      || !mesh.skeleton.boneInverses.every(usable)) return fail('incompatible bones')
    if (!g.index || g.groups.length || g.drawRange.start !== 0 || g.drawRange.count !== Infinity
      || Object.keys(g.attributes).some((key) => !['color', 'normal', 'position', 'skinIndex', 'skinWeight', 'tangent', 'uv', 'uv1', 'uv2'].includes(key))
      || !['position', 'normal', 'uv', 'skinIndex', 'skinWeight'].every((key) => g.hasAttribute(key))
      || Object.keys(g.morphAttributes).some((key) => !['normal', 'position'].includes(key))
      || g.morphTargetsRelative !== first.geometry.morphTargetsRelative
      || JSON.stringify(Object.keys(g.morphAttributes).sort()) !== JSON.stringify(Object.keys(first.geometry.morphAttributes).sort())
      || Object.entries(g.morphAttributes).some(([name, targets]) => targets?.length !== first.geometry.morphAttributes[name as 'position']?.length)
      || JSON.stringify(mesh.morphTargetDictionary) !== JSON.stringify(first.morphTargetDictionary)
      || JSON.stringify(mesh.morphTargetInfluences) !== JSON.stringify(first.morphTargetInfluences)) return fail('unsupported geometry or morphs')
    const factor = first.skeleton.boneInverses[0].clone().invert().multiply(mesh.skeleton.boneInverses[0])
    if (!usable(factor) || mesh.skeleton.boneInverses.some((inverse, i) =>
      !near(first.skeleton.boneInverses[i].clone().multiply(factor), inverse))) return fail('incompatible inverse binds')
    conversions.push(first.bindMatrix.clone().invert().multiply(factor).multiply(mesh.bindMatrix))
  }

  const geometries: BufferGeometry[] = []
  let geometry: BufferGeometry | null
  try {
    for (const [i, mesh] of cloth.entries()) {
      const g = mesh.geometry.clone()
      geometries.push(g)
      for (const name of ['position', 'normal', 'tangent']) {
        const attribute = g.getAttribute(name)
        if (attribute) g.setAttribute(name, convert(attribute as BufferAttribute, conversions[i], name !== 'position'))
      }
      for (const name of ['position', 'normal'] as const) {
        const attributes = g.morphAttributes[name]
        if (attributes) g.morphAttributes[name] = attributes.map((attribute) =>
          convert(attribute as BufferAttribute, conversions[i], name !== 'position' || g.morphTargetsRelative))
      }
      // Shader multiplication by white preserves primitives without COLOR_0.
      const color = g.getAttribute('color')
      if (!color || !(mesh.material as MeshStandardMaterial).vertexColors) {
        const colorSize = cloth.find((part) => part.geometry.hasAttribute('color'))?.geometry.getAttribute('color').itemSize ?? 3
        const white = new Float32Array(g.getAttribute('position').count * colorSize).fill(1)
        g.setAttribute('color', new Float32BufferAttribute(white, colorSize))
      } else {
        const values = new Float32Array(color.count * color.itemSize)
        for (let v = 0; v < color.count; v++) {
          for (let c = 0; c < color.itemSize; c++) values[v * color.itemSize + c] = color.getComponent(v, c)
        }
        g.setAttribute('color', new Float32BufferAttribute(values, color.itemSize))
      }
    }
    geometry = mergeGeometries(geometries, false)
    if (!geometry) return fail('attribute layouts differ')
    // Three r185 validates this flag but does not copy it to the result.
    geometry.morphTargetsRelative = first.geometry.morphTargetsRelative
  } finally {
    for (const g of geometries) g.dispose()
  }
  geometry.userData = { sharedGpu: false, peasantBodyMerge: true }
  const mergedMaterial = material.clone()
  mergedMaterial.userData = { ...material.userData, sharedGpu: false }
  mergedMaterial.vertexColors = true
  const merged = new SkinnedMesh(geometry, mergedMaterial)
  merged.name = 'PeasantBodyCloth'
  merged.position.copy(first.position)
  merged.quaternion.copy(first.quaternion)
  merged.scale.copy(first.scale)
  merged.matrix.copy(first.matrix)
  merged.matrixAutoUpdate = first.matrixAutoUpdate
  merged.castShadow = first.castShadow
  merged.receiveShadow = first.receiveShadow
  merged.visible = first.visible
  merged.frustumCulled = first.frustumCulled
  merged.layers.mask = first.layers.mask
  merged.renderOrder = first.renderOrder
  merged.morphTargetDictionary = { ...first.morphTargetDictionary }
  merged.morphTargetInfluences = first.morphTargetInfluences?.slice()
  merged.userData.peasantBodyMerge = { sources: cloth.map((mesh) => ({ name: mesh.name, vertices: mesh.geometry.getAttribute('position').count })) }
  merged.bind(new Skeleton(bones, first.skeleton.boneInverses.map((inverse) => inverse.clone())), first.bindMatrix)
  first.parent!.add(merged)
  for (const mesh of cloth) mesh.removeFromParent()
  // Retired geometry/inverses are cache-owned. Release only actor material clones.
  const retainedMaterials = new Set<import('three').Material>()
  root.traverse((node) => {
    const mesh = node as SkinnedMesh
    if (mesh.isMesh) {
      for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) retainedMaterials.add(m)
    }
  })
  for (const m of new Set(cloth.map((mesh) => mesh.material))) {
    if (Array.isArray(m)) continue
    if (!m.userData.sharedGpu && !retainedMaterials.has(m)) m.dispose()
  }
  root.updateMatrixWorld(true)
  return { merged: true, before: body.length, after: body.length - 3 }
}

/** Only the new merge palette is owned here; unmerged NPC cleanup is unchanged. */
export function disposeMergedBodySkeleton(root: Object3D): void {
  root.traverse((node) => {
    const mesh = node as SkinnedMesh
    if (mesh.isSkinnedMesh && mesh.geometry.userData.peasantBodyMerge) mesh.skeleton.dispose()
  })
}
