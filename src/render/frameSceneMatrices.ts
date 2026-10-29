import type { Object3D } from 'three'

/**
 * Let all of one frame's scene renders share a single world-matrix update.
 *
 * Every `WebGLRenderer.render` / `CSS2DRenderer.render` calls
 * `scene.updateMatrixWorld()` while `scene.matrixWorldAutoUpdate` is true, and
 * three's `updateMatrix()` always sets `matrixWorldNeedsUpdate`, so each call
 * recomposes and re-multiplies every object in the scene. A frame renders the
 * scene up to three times (water mirror, beauty pass, labels) with nothing
 * moving in between, so the repeats are pure duplicate work.
 *
 * `begin` updates once and disables the scene-level auto update; `end`
 * restores it. Cameras outside the scene still update themselves
 * (`camera.parent === null` path). Self-healing: if a render throws before
 * `end`, the next `begin` still performs the explicit update.
 *
 * Contract: nothing between `begin` and `end` may move scene objects.
 * Queue Q14 / Q1 review 2026-10-29 §3.
 */
export function beginFrameSceneMatrices(scene: Object3D): void {
  scene.updateMatrixWorld()
  scene.matrixWorldAutoUpdate = false
}

/** Restore per-render scene matrix updates after {@link beginFrameSceneMatrices}. */
export function endFrameSceneMatrices(scene: Object3D): void {
  scene.matrixWorldAutoUpdate = true
}
