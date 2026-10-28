import { Box3, Matrix4, type Object3D, type SkinnedMesh, Sphere, Vector3 } from 'three'

/** Outcome of {@link installActorCullBounds}; diagnostic and test surface only. */
export type ActorCullBoundsResult = {
  /** Skinned meshes now using native frustum culling with the actor envelope. */
  culled: number
  /** Skinned meshes left (or forced) always-drawn because bounds could not be proven. */
  fallback: number
}

const MIN_SCALE = 1e-6
const TRANSFORM_EPSILON = 1e-6

/** Native Three sphere transforms require a similarity (no nonuniform scale/shear). */
function isSupportedTransform(matrix: Matrix4): boolean {
  const e = matrix.elements
  if (!e.every(Number.isFinite)) return false
  const determinant = matrix.determinant()
  if (!Number.isFinite(determinant) || determinant === 0) return false
  if (e[3] !== 0 || e[7] !== 0 || e[11] !== 0 || e[15] !== 1) return false
  const axes = [
    new Vector3(e[0], e[1], e[2]),
    new Vector3(e[4], e[5], e[6]),
    new Vector3(e[8], e[9], e[10]),
  ]
  const scales = axes.map((axis) => axis.length())
  const min = Math.min(...scales)
  const max = Math.max(...scales)
  if (min < MIN_SCALE || max - min > max * TRANSFORM_EPSILON) return false
  for (const axis of axes) axis.normalize()
  return Math.abs(axes[0].dot(axes[1])) <= TRANSFORM_EPSILON
    && Math.abs(axes[0].dot(axes[2])) <= TRANSFORM_EPSILON
    && Math.abs(axes[1].dot(axes[2])) <= TRANSFORM_EPSILON
}

function isFiniteBox(box: Box3): boolean {
  return !box.isEmpty()
    && Number.isFinite(box.min.x + box.min.y + box.min.z + box.max.x + box.max.y + box.max.z)
}

/**
 * Installs one conservative, shared culling sphere on every `SkinnedMesh` under
 * an actor (plan world-terrain-050, A1′) and enables native `frustumCulled`.
 *
 * Why one actor-wide sphere: a head/hair/garment mesh rebound onto the body
 * skeleton is tiny at bind pose but follows bones through the whole clip set
 * (sleep, death, attack reach), so a per-mesh bind-pose sphere would clip.
 * The sphere is centred on the union of all skinned bind-pose boxes and its
 * radius is `halfDiagonal + height`, i.e. the pose may reach one body height
 * beyond the bind envelope. Main and shadow passes keep using native frustum
 * tests against this sphere, so off-camera casters inside the light frustum
 * still cast.
 *
 * Space: bounds are measured relative to `root` (the actor wrapper), so the
 * result supports translation, rotation, uniform scale and reflection. Both
 * root-to-world and mesh-to-root must be similarities; nonuniform scale,
 * shear, singular and nonfinite transforms fail open. Later wrapper/ancestor
 * changes must preserve this contract; mesh-to-root transforms must stay fixed.
 * Three applies the wrapper's `member.scale` via `matrixWorld` at render time.
 * Call once after final assembly, before animation starts (bind pose).
 * Reinstall after geometry/rig/assembly changes. The animation padding is a
 * heuristic: clips, morphs and bone scales must stay inside this envelope.
 *
 * Fail open: a skinned mesh whose bounds cannot be established keeps/gets
 * `frustumCulled = false`. Writes only `boundingSphere`/`frustumCulled`,
 * never `visible`. Non-skinned meshes are untouched.
 *
 * @domain world-terrain
 */
export function installActorCullBounds(root: Object3D): ActorCullBoundsResult {
  root.updateMatrixWorld(true)

  const skinned: SkinnedMesh[] = []
  root.traverse((o) => {
    if ((o as SkinnedMesh).isSkinnedMesh) skinned.push(o as SkinnedMesh)
  })

  if (!isSupportedTransform(root.matrixWorld)) {
    for (const mesh of skinned) mesh.frustumCulled = false
    return { culled: 0, fallback: skinned.length }
  }
  const refInverse = new Matrix4().copy(root.matrixWorld).invert()
  if (!refInverse.elements.every(Number.isFinite)) {
    for (const mesh of skinned) mesh.frustumCulled = false
    return { culled: 0, fallback: skinned.length }
  }

  const envelope = new Box3()
  const meshToRoot = new Map<SkinnedMesh, Matrix4>()
  const box = new Box3()
  for (const mesh of skinned) {
    const m = new Matrix4().multiplyMatrices(refInverse, mesh.matrixWorld)
    if (!isSupportedTransform(m) || !isSupportedTransform(mesh.matrixWorld)) continue
    // Do not leave a static pose box behind for animated raycast broad-phase.
    const previousBox = mesh.boundingBox
    try {
      mesh.boundingBox = box.makeEmpty()
      mesh.skeleton.update()
      mesh.computeBoundingBox()
    } catch {
      continue
    } finally {
      mesh.boundingBox = previousBox
    }
    if (!isFiniteBox(box)) continue
    box.applyMatrix4(m)
    if (!isFiniteBox(box)) continue
    envelope.union(box)
    meshToRoot.set(mesh, m)
  }

  const result: ActorCullBoundsResult = { culled: 0, fallback: 0 }
  const size = envelope.getSize(new Vector3())
  const radius = isFiniteBox(envelope) ? size.length() / 2 + size.y : 0
  if (!(radius > 0) || !Number.isFinite(radius)) {
    for (const mesh of skinned) {
      mesh.frustumCulled = false
      result.fallback++
    }
    return result
  }

  const center = envelope.getCenter(new Vector3())
  const local = new Vector3()
  const inverse = new Matrix4()
  for (const mesh of skinned) {
    const m = meshToRoot.get(mesh)
    if (!m) {
      mesh.frustumCulled = false
      result.fallback++
      continue
    }
    inverse.copy(m).invert()
    local.copy(center).applyMatrix4(inverse)
    // Cover roundoff admitted by the similarity check, including native
    // Sphere.applyMatrix4's column-length approximation of world scale.
    const localRadius = radius / m.getMaxScaleOnAxis() * (1 + 8 * TRANSFORM_EPSILON)
    if (!inverse.elements.every(Number.isFinite)
      || !Number.isFinite(local.x + local.y + local.z)
      || !(localRadius > 0) || !Number.isFinite(localRadius)) {
      mesh.frustumCulled = false
      result.fallback++
      continue
    }
    mesh.boundingSphere = new Sphere(local.clone(), localRadius)
    mesh.frustumCulled = true
    result.culled++
  }
  return result
}
