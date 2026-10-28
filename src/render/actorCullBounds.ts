import { Box3, Matrix4, type Object3D, type SkinnedMesh, Sphere, Vector3 } from 'three'

/** Outcome of {@link installActorCullBounds}; diagnostic and test surface only. */
export type ActorCullBoundsResult = {
  /** Skinned meshes now using native frustum culling with the actor envelope. */
  culled: number
  /** Skinned meshes left (or forced) always-drawn because bounds could not be proven. */
  fallback: number
}

const MIN_SCALE = 1e-6

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
 * result is independent of the wrapper's world position, rotation and
 * `member.scale`, which Three applies via `matrixWorld` at render time.
 * Call once after final assembly, before animation starts (bind pose).
 *
 * Fail open: a skinned mesh whose bounds cannot be established keeps/gets
 * `frustumCulled = false`. Writes only `boundingSphere`/`frustumCulled`,
 * never `visible`. Non-skinned meshes are untouched.
 *
 * @domain world-terrain
 */
export function installActorCullBounds(root: Object3D): ActorCullBoundsResult {
  root.updateMatrixWorld(true)
  const refInverse = new Matrix4().copy(root.matrixWorld).invert()

  const skinned: SkinnedMesh[] = []
  root.traverse((o) => {
    if ((o as SkinnedMesh).isSkinnedMesh) skinned.push(o as SkinnedMesh)
  })

  const envelope = new Box3()
  const meshToRoot = new Map<SkinnedMesh, Matrix4>()
  const box = new Box3()
  for (const mesh of skinned) {
    try {
      mesh.skeleton.update()
      mesh.computeBoundingBox()
    } catch {
      continue
    }
    if (!mesh.boundingBox || !isFiniteBox(mesh.boundingBox)) continue
    const m = new Matrix4().multiplyMatrices(refInverse, mesh.matrixWorld)
    if (m.getMaxScaleOnAxis() < MIN_SCALE) continue
    box.copy(mesh.boundingBox).applyMatrix4(m)
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
    mesh.boundingSphere = new Sphere(local.clone(), radius / m.getMaxScaleOnAxis())
    mesh.frustumCulled = true
    result.culled++
  }
  return result
}
