import { Group, Mesh, Object3D, Scene } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { beginFrameSceneMatrices, endFrameSceneMatrices } from './frameSceneMatrices'

/** Same guard three's WebGLRenderer.render and CSS2DRenderer.render use. */
function fakeRender(scene: Object3D): void {
  if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld()
}

function buildScene(): { scene: Scene; leaf: Mesh } {
  const scene = new Scene()
  const group = new Group()
  group.position.set(10, 0, 0)
  const leaf = new Mesh()
  leaf.position.set(0, 2, 0)
  group.add(leaf)
  scene.add(group)
  return { scene, leaf }
}

function frame(scene: Object3D, renders: () => void): void {
  beginFrameSceneMatrices(scene)
  renders()
  endFrameSceneMatrices(scene)
}

describe('frame scene matrices', () => {
  it('traverses the scene once for three renders', () => {
    const { scene, leaf } = buildScene()
    const spy = vi.spyOn(leaf, 'updateMatrixWorld')
    frame(scene, () => {
      fakeRender(scene)
      fakeRender(scene)
      fakeRender(scene)
    })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('renders see this frame\'s transforms, not last frame\'s', () => {
    const { scene, leaf } = buildScene()
    frame(scene, () => fakeRender(scene))
    leaf.position.set(0, 5, 0)
    let seenY = Number.NaN
    frame(scene, () => {
      fakeRender(scene)
      seenY = leaf.matrixWorld.elements[13]!
    })
    expect(seenY).toBe(5)
    expect(leaf.matrixWorld.elements[12]).toBe(10)
  })

  it('restores per-render traversal after the frame', () => {
    const { scene, leaf } = buildScene()
    frame(scene, () => fakeRender(scene))
    expect(scene.matrixWorldAutoUpdate).toBe(true)
    const spy = vi.spyOn(leaf, 'updateMatrixWorld')
    fakeRender(scene)
    fakeRender(scene)
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('a frame that never reached end still updates on the next begin', () => {
    const { scene, leaf } = buildScene()
    beginFrameSceneMatrices(scene)
    leaf.position.set(0, 7, 0)
    beginFrameSceneMatrices(scene)
    expect(leaf.matrixWorld.elements[13]).toBe(7)
    endFrameSceneMatrices(scene)
  })
})
