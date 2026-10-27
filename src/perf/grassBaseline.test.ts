import { BufferGeometry, Group, InstancedMesh, MeshBasicMaterial, Scene } from 'three'
import { describe, expect, it } from 'vitest'
import { createGrassBaselineDiag } from './grassBaseline'

function grassMesh(name: string, full: number, submitted: number, filler: boolean): InstancedMesh {
  const geo = new BufferGeometry()
  const mesh = new InstancedMesh(geo, new MeshBasicMaterial(), full)
  mesh.count = submitted
  mesh.name = name
  mesh.userData.grassFullCount = full
  mesh.userData.grassFiller = filler
  mesh.instanceMatrix.array = new Float32Array(full * 16)
  return mesh
}

describe('grassBaseline', () => {
  it('snapshots resident vs submitted and lifecycle counters', () => {
    const diag = createGrassBaselineDiag()
    diag.recordRequest()
    diag.recordCompletion()
    diag.recordStreamIn()
    const scene = new Scene()
    const group = new Group()
    group.name = 'chunk-grass'
    group.add(grassMesh('chunk-grass-tri', 100, 40, false))
    group.add(grassMesh('chunk-grass-filler', 50, 10, true))
    scene.add(group)
    const snap = diag.snapshotScene(scene)
    expect(snap.chunksResident).toBe(1)
    expect(snap.instancesResidentFull).toBe(100)
    expect(snap.instancesResidentFiller).toBe(50)
    expect(snap.instancesSubmittedFull).toBe(40)
    expect(snap.instancesSubmittedFiller).toBe(10)
    expect(snap.lifecycle.requests).toBe(1)
    expect(snap.lifecycle.completions).toBe(1)
    expect(snap.allocationBytesEstimated).toBeGreaterThan(0)
    expect(snap.uploadBytesObserved).toBeNull()
  })

  it('marks flowers unavailable when none present', () => {
    const diag = createGrassBaselineDiag()
    const snap = diag.snapshotScene(new Scene())
    expect(snap.flowers.status).toBe('unavailable')
    expect(snap.flowers.instancesResident).toBeNull()
  })
})
