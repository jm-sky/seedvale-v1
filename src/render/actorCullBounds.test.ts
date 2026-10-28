import {
  Bone,
  BoxGeometry,
  Float32BufferAttribute,
  Frustum,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Skeleton,
  SkinnedMesh,
  Sphere,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { describe, expect, it } from 'vitest'
import { installActorCullBounds } from './actorCullBounds'

/** Humanoid-ish rig: hips at y=0.9, spine, head bone at y=1.6. */
function makeRig() {
  const hips = new Bone()
  hips.name = 'hips'
  hips.position.y = 0.9
  const head = new Bone()
  head.name = 'head'
  head.position.y = 0.7
  hips.add(head)
  return { hips, head, bones: [hips, head] }
}

function skinnedBox(
  boneIndex: number,
  size: [number, number, number],
  at: [number, number, number],
): SkinnedMesh {
  const geo = new BoxGeometry(...size).translate(...at)
  const n = geo.attributes.position.count
  const idx: number[] = []
  const w: number[] = []
  for (let i = 0; i < n; i++) {
    idx.push(boneIndex, 0, 0, 0)
    w.push(1, 0, 0, 0)
  }
  geo.setAttribute('skinIndex', new Uint16BufferAttribute(idx, 4))
  geo.setAttribute('skinWeight', new Float32BufferAttribute(w, 4))
  const mesh = new SkinnedMesh(geo, new MeshBasicMaterial())
  return mesh
}

function makeActor() {
  const rig = makeRig()
  const wrapper = new Group()
  const root = new Group()
  wrapper.add(root)
  root.add(rig.hips)
  const body = skinnedBox(0, [0.6, 1.2, 0.3], [0, 0.6, 0])
  const headMesh = skinnedBox(1, [0.2, 0.25, 0.2], [0, 1.6, 0])
  for (const m of [body, headMesh]) {
    root.add(m)
    m.bind(new Skeleton(rig.bones), new Matrix4())
  }
  // Rebound meshes are uncullable today.
  body.frustumCulled = false
  headMesh.frustumCulled = false
  return { wrapper, root, body, headMesh, ...rig }
}

function worldSphere(mesh: SkinnedMesh): Sphere {
  return mesh.boundingSphere!.clone().applyMatrix4(mesh.matrixWorld)
}

describe('installActorCullBounds', () => {
  it('enables culling on every skinned mesh and shares one world envelope', () => {
    const a = makeActor()
    const res = installActorCullBounds(a.wrapper)
    expect(res).toEqual({ culled: 2, fallback: 0 })
    expect(a.body.frustumCulled).toBe(true)
    expect(a.headMesh.frustumCulled).toBe(true)
    const s1 = worldSphere(a.body)
    const s2 = worldSphere(a.headMesh)
    expect(s1.center.distanceTo(s2.center)).toBeLessThan(1e-4)
    expect(s1.radius).toBeCloseTo(s2.radius, 4)
  })

  it('inflates the tiny head sphere beyond its own bind pose to cover the lying pose', () => {
    const a = makeActor()
    installActorCullBounds(a.wrapper)
    // Death/sleep: hips stay, head bone swings down to the ground ~1.6 m out.
    a.head.position.set(1.5, 0, 0)
    a.wrapper.updateMatrixWorld(true)
    a.headMesh.skeleton.update()
    const p = new Vector3()
    a.headMesh.getVertexPosition(0, p)
    a.headMesh.applyBoneTransform(0, p)
    p.applyMatrix4(a.headMesh.matrixWorld)
    expect(worldSphere(a.headMesh).containsPoint(p)).toBe(true)
  })

  it('covers a 90° root tip (rigid parent rotation) and wrapper scale/position', () => {
    const a = makeActor()
    installActorCullBounds(a.wrapper)
    a.wrapper.scale.setScalar(0.6)
    a.wrapper.position.set(40, 2, -10)
    a.wrapper.rotation.z = Math.PI / 2
    a.wrapper.updateMatrixWorld(true)
    a.body.skeleton.update()
    const p = new Vector3()
    for (let i = 0; i < a.body.geometry.attributes.position.count; i++) {
      a.body.getVertexPosition(i, p)
      a.body.applyBoneTransform(i, p)
      p.applyMatrix4(a.body.matrixWorld)
      expect(worldSphere(a.body).containsPoint(p)).toBe(true)
    }
    expect(worldSphere(a.body).radius).toBeGreaterThan(1.2 * 0.6)
  })

  it('is independent of wrapper position at install time', () => {
    const a = makeActor()
    a.wrapper.position.set(500, 0, 500)
    a.wrapper.scale.setScalar(0.8)
    installActorCullBounds(a.wrapper)
    a.wrapper.position.set(0, 0, 0)
    a.wrapper.updateMatrixWorld(true)
    const b = makeActor()
    b.wrapper.scale.setScalar(0.8)
    installActorCullBounds(b.wrapper)
    b.wrapper.updateMatrixWorld(true)
    expect(worldSphere(a.body).center.distanceTo(worldSphere(b.body).center)).toBeLessThan(1e-4)
    expect(worldSphere(a.body).radius).toBeCloseTo(worldSphere(b.body).radius, 4)
  })

  it('culls an off-camera actor and keeps an on-screen one', () => {
    const cam = new PerspectiveCamera(60, 1, 0.1, 100)
    cam.position.set(0, 1.5, 0)
    cam.lookAt(0, 1.5, -10)
    cam.updateMatrixWorld(true)
    cam.updateProjectionMatrix()
    const frustum = new Frustum().setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse),
    )
    const ahead = makeActor()
    ahead.wrapper.position.set(0, 0, -10)
    installActorCullBounds(ahead.wrapper)
    ahead.wrapper.updateMatrixWorld(true)
    const behind = makeActor()
    behind.wrapper.position.set(0, 0, 20)
    installActorCullBounds(behind.wrapper)
    behind.wrapper.updateMatrixWorld(true)
    expect(frustum.intersectsObject(ahead.headMesh)).toBe(true)
    expect(frustum.intersectsObject(behind.headMesh)).toBe(false)
    expect(frustum.intersectsObject(behind.body)).toBe(false)
  })

  it('does not write visible, touch plain meshes, or affect sibling actors', () => {
    const a = makeActor()
    const b = makeActor()
    const plain = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    a.root.add(plain)
    a.body.visible = false
    a.headMesh.visible = true
    installActorCullBounds(a.wrapper)
    expect(a.body.visible).toBe(false)
    expect(a.headMesh.visible).toBe(true)
    expect(plain.frustumCulled).toBe(true)
    expect(plain.visible).toBe(true)
    expect(b.body.frustumCulled).toBe(false)
    expect(b.body.boundingSphere).toBeNull()
  })

  it('shares geometry between clones without cross-contamination', () => {
    const a = makeActor()
    const b = makeActor()
    const shared = a.body.geometry
    b.body.geometry = shared
    a.wrapper.scale.setScalar(2)
    installActorCullBounds(a.wrapper)
    expect(b.body.boundingSphere).toBeNull()
    expect(shared.boundingSphere).toBeNull()
  })

  it('falls back to always-drawn when bounds are unknown', () => {
    const wrapper = new Group()
    const empty = new SkinnedMesh(new BoxGeometry(1, 1, 1).deleteAttribute('position'), new MeshBasicMaterial())
    wrapper.add(empty)
    expect(installActorCullBounds(wrapper)).toEqual({ culled: 0, fallback: 1 })
    expect(empty.frustumCulled).toBe(false)
    expect(installActorCullBounds(new Group())).toEqual({ culled: 0, fallback: 0 })
  })

  it('fails open for a degenerate (zero-scale) mesh while culling its siblings', () => {
    const a = makeActor()
    a.headMesh.scale.setScalar(0)
    installActorCullBounds(a.wrapper)
    expect(a.headMesh.frustumCulled).toBe(false)
    expect(a.body.frustumCulled).toBe(true)
  })
})
