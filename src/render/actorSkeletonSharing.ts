import {
  AttachedBindMode,
  type Bone,
  BufferAttribute,
  BufferGeometry,
  type InterleavedBufferAttribute,
  Matrix4,
  type Object3D,
  type Skeleton,
  type SkinnedMesh,
} from 'three'

/** Outcome of {@link shareActorSkeletons}; diagnostic and test surface only. */
export type ActorSkeletonShareResult = {
  skinned: number
  skeletonsBefore: number
  skeletonsAfter: number
  /** Meshes rebound onto the actor's canonical skeleton. */
  rebound: number
  /** Rebound meshes that needed a `skinIndex` remap (different bone order). */
  remapped: number
  /** Meshes left on their own skeleton because sharing could not be proven exact. */
  kept: number
}

/** Max component error of `Icanonical[k]·T − Ipart[j]`; shipped assets are ≤ 2e-7. */
const FACTOR_TOLERANCE = 1e-5

/** Local bone indices with non-zero skin weight, per (cache-shared) geometry. */
const usedBonesByGeometry = new WeakMap<BufferGeometry, readonly number[] | null>()
/** Remapped geometries per source geometry and bone-index mapping (app lifetime). */
const remappedByGeometry = new WeakMap<BufferGeometry, Map<string, BufferGeometry>>()

function usable(matrix: Matrix4): boolean {
  const det = matrix.determinant()
  return matrix.elements.every(Number.isFinite) && Number.isFinite(det) && det !== 0
}

function plainAttribute(geometry: BufferGeometry, name: string): BufferAttribute | null {
  const attr = geometry.getAttribute(name) as BufferAttribute | undefined
  if (!attr || !(attr as { isBufferAttribute?: boolean }).isBufferAttribute || attr.itemSize !== 4) return null
  return attr
}

/** Skin attribute readable per component: plain or interleaved, 4 wide. */
function readableAttribute(geometry: BufferGeometry, name: string): BufferAttribute | InterleavedBufferAttribute | null {
  const attr = geometry.getAttribute(name) as BufferAttribute | InterleavedBufferAttribute | undefined
  if (!attr || attr.itemSize !== 4) return null
  return attr
}

/** `null` when skin attributes are missing (fail open). Interleaved
 *  attributes (e.g. after glTF re-export) are read component-wise. */
function usedBones(geometry: BufferGeometry): readonly number[] | null {
  if (usedBonesByGeometry.has(geometry)) return usedBonesByGeometry.get(geometry)!
  const index = readableAttribute(geometry, 'skinIndex')
  const weight = readableAttribute(geometry, 'skinWeight')
  let used: number[] | null = null
  if (index && weight && index.count === weight.count) {
    const set = new Set<number>()
    for (let i = 0; i < index.count; i++) {
      for (let c = 0; c < 4; c++) {
        if (weight.getComponent(i, c) > 0) set.add(index.getComponent(i, c))
      }
    }
    used = [...set].sort((x, y) => x - y)
  }
  usedBonesByGeometry.set(geometry, used)
  return used
}

/**
 * Shallow geometry copy that shares every attribute (and its GPU buffer) with
 * `source` except a new `skinIndex` addressing the canonical bone order.
 * Cached and flagged `sharedGpu`: like the loader geometry it derives from,
 * it lives for the app lifetime and `disposeObject3D` leaves it alone.
 */
function remappedGeometry(source: BufferGeometry, mapping: readonly number[]): BufferGeometry {
  const key = mapping.join(',')
  let byMapping = remappedByGeometry.get(source)
  const cached = byMapping?.get(key)
  if (cached) return cached

  const srcIndex = plainAttribute(source, 'skinIndex')!
  const ArrayType = srcIndex.array.constructor as new (length: number) => typeof srcIndex.array
  const array = new ArrayType(srcIndex.array.length)
  for (let i = 0; i < array.length; i++) array[i] = mapping[srcIndex.array[i]] ?? 0
  const skinIndex = new BufferAttribute(array, 4, srcIndex.normalized)

  const geometry = new BufferGeometry()
  geometry.name = source.name
  geometry.setIndex(source.index)
  for (const [name, attr] of Object.entries(source.attributes)) {
    geometry.setAttribute(name, name === 'skinIndex' ? skinIndex : attr)
  }
  geometry.morphAttributes = source.morphAttributes
  geometry.morphTargetsRelative = source.morphTargetsRelative
  for (const group of source.groups) geometry.addGroup(group.start, group.count, group.materialIndex)
  geometry.setDrawRange(source.drawRange.start, source.drawRange.count)
  geometry.boundingBox = source.boundingBox?.clone() ?? null
  geometry.boundingSphere = source.boundingSphere?.clone() ?? null
  geometry.userData = { ...source.userData, sharedGpu: true }

  if (!byMapping) {
    byMapping = new Map()
    remappedByGeometry.set(source, byMapping)
  }
  byMapping.set(key, geometry)
  return geometry
}

type Plan = { mesh: SkinnedMesh, bind: Matrix4, mapping: readonly number[] | null }

/**
 * Plans rebinding `mesh` onto `canonical`, or `null` when the result could
 * differ from the current skinning.
 *
 * In `AttachedBindMode` a vertex skins as
 * `Mworld⁻¹ · Σ w·BoneWorld[j]·Ipart[j] · Bind`. When every *weighted* bone
 * is a bone of `canonical` (same Bone object, index `k`) and the inverse
 * binds differ by one constant right factor (`Ipart[j] = Icanon[k]·T`),
 * binding to `canonical` with `Bind' = T·Bind` and `skinIndex j → k` is
 * exact. Unweighted indices contribute nothing and map to bone 0.
 */
function planRebind(mesh: SkinnedMesh, canonical: Skeleton, canonicalIndex: Map<Bone, number>): Plan | null {
  if (mesh.bindMode !== AttachedBindMode || !usable(mesh.bindMatrix)) return null
  const { bones, boneInverses } = mesh.skeleton
  if (boneInverses.length !== bones.length) return null
  const used = usedBones(mesh.geometry)
  if (!used || used.length === 0) return null

  const mapping = bones.map((b) => canonicalIndex.get(b) ?? -1)
  for (const j of used) {
    if (j >= bones.length || mapping[j] < 0) return null
    if (!usable(boneInverses[j]) || !usable(canonical.boneInverses[mapping[j]])) return null
  }

  const j0 = used[0]
  const factor = new Matrix4().copy(canonical.boneInverses[mapping[j0]]).invert().multiply(boneInverses[j0])
  if (!usable(factor)) return null
  const probe = new Matrix4()
  for (const j of used) {
    probe.multiplyMatrices(canonical.boneInverses[mapping[j]], factor)
    const a = probe.elements
    const b = boneInverses[j].elements
    for (let k = 0; k < 16; k++) {
      if (!(Math.abs(a[k] - b[k]) <= FACTOR_TOLERANCE)) return null
    }
  }

  const identity = used.every((j) => mapping[j] === j)
  if (!identity && !plainAttribute(mesh.geometry, 'skinIndex')) return null
  return {
    mesh,
    bind: new Matrix4().multiplyMatrices(factor, mesh.bindMatrix),
    mapping: identity ? null : mapping.map((k) => Math.max(k, 0)),
  }
}

/**
 * Binds every skinned part of one actor (body primitives, head, hair, beard,
 * garments; fauna body parts) to a single actor-local skeleton when that is
 * provably exact, so the renderer updates and uploads one bone palette per
 * actor instead of one per part (queue Q20, Track A — A1).
 *
 * Canonical skeleton: the first skinned mesh's skeleton among those with the
 * most bones (the body for assembled NPCs). Per mesh, fail open: a part whose
 * weighted bones are not canonical Bones, whose inverse binds are not related
 * by a constant factor (e.g. the male head), or whose skin attributes are
 * interleaved keeps its own skeleton. Bones, inverse-bind matrices and loader
 * geometry are never mutated (they are shared with the GLB cache); reordered
 * parts get a cached shared-GPU geometry with a remapped `skinIndex`.
 *
 * Call on a per-actor clone (`SkeletonUtils.clone` / `assembleCharacter`),
 * after assembly and before bounds/animation setup. Never on a cache root.
 * Idempotent. Callers skip it under `?actorSkeletons=0` (A/B arm).
 *
 * @domain render
 */
export function shareActorSkeletons(root: Object3D): ActorSkeletonShareResult {
  const skinned: SkinnedMesh[] = []
  root.traverse((o) => {
    const mesh = o as SkinnedMesh
    if (mesh.isSkinnedMesh && mesh.skeleton) skinned.push(mesh)
  })
  const distinct = () => new Set(skinned.map((m) => m.skeleton)).size
  const before = distinct()
  const result: ActorSkeletonShareResult = {
    skinned: skinned.length, skeletonsBefore: before, skeletonsAfter: before, rebound: 0, remapped: 0, kept: 0,
  }
  if (before < 2) return result

  let canonical = skinned[0].skeleton
  for (const mesh of skinned) {
    if (mesh.skeleton.bones.length > canonical.bones.length) canonical = mesh.skeleton
  }
  if (canonical.boneInverses.length !== canonical.bones.length) return result
  const canonicalIndex = new Map<Bone, number>()
  canonical.bones.forEach((b, i) => { if (b && !canonicalIndex.has(b)) canonicalIndex.set(b, i) })

  // Plan every rebinding before touching any mesh.
  const plans: Plan[] = []
  for (const mesh of skinned) {
    if (mesh.skeleton === canonical) continue
    const plan = planRebind(mesh, canonical, canonicalIndex)
    if (plan) plans.push(plan)
    else result.kept++
  }

  for (const { mesh, bind, mapping } of plans) {
    if (mapping) {
      mesh.geometry = remappedGeometry(mesh.geometry, mapping)
      result.remapped++
    }
    mesh.bind(canonical, bind)
    result.rebound++
  }
  result.skeletonsAfter = distinct()
  return result
}
