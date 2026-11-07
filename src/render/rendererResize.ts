/** Below this, EffectComposer / N8AO allocate 0-height targets and the
 *  projection aspect becomes Inf — both show up as a black 3D view. Mobile
 *  orientation / visualViewport events can report 0 briefly. */
export const MIN_RENDERER_SIZE = 16

/** True when the drawing buffer should be reallocated. Skip 0-size blips
 *  and no-op when the integer size has not changed (address-bar animation
 *  otherwise rebuilds every composer target every frame). */
export function shouldApplyRendererResize(
  width: number,
  height: number,
  lastWidth: number,
  lastHeight: number,
): boolean {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return false
  if (width < MIN_RENDERER_SIZE || height < MIN_RENDERER_SIZE) return false
  const w = Math.round(width)
  const h = Math.round(height)
  return w !== lastWidth || h !== lastHeight
}

/** Q178: the pixel ratio the renderer should use, or `null` when it already matches. Dragging the window
 *  to another monitor / browser zoom changes `devicePixelRatio` without changing the CSS size, so the
 *  size-only gate above never fires; this is the DPR-only decision. */
export function nextPixelRatio(current: number, devicePixelRatio: number, cap: number): number | null {
  if (!Number.isFinite(devicePixelRatio) || !Number.isFinite(cap) || devicePixelRatio <= 0 || cap <= 0) return null
  const next = Math.min(devicePixelRatio, cap)
  return Math.abs(next - current) > 1e-3 ? next : null
}
