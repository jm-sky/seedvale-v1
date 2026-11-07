import { describe, expect, it } from 'vitest'
import { MIN_RENDERER_SIZE, nextPixelRatio, shouldApplyRendererResize } from './rendererResize'

describe('shouldApplyRendererResize', () => {
  it('rejects zero and sub-minimum sizes (orientation / keyboard blips)', () => {
    expect(shouldApplyRendererResize(0, 800, -1, -1)).toBe(false)
    expect(shouldApplyRendererResize(400, 0, -1, -1)).toBe(false)
    expect(shouldApplyRendererResize(8, 8, -1, -1)).toBe(false)
    expect(shouldApplyRendererResize(MIN_RENDERER_SIZE - 1, 400, -1, -1)).toBe(false)
  })

  it('rejects non-finite sizes', () => {
    expect(shouldApplyRendererResize(Number.NaN, 400, -1, -1)).toBe(false)
    expect(shouldApplyRendererResize(400, Number.POSITIVE_INFINITY, -1, -1)).toBe(false)
  })

  it('applies the first valid size', () => {
    expect(shouldApplyRendererResize(390, 844, -1, -1)).toBe(true)
  })

  it('skips a resize that does not change the integer drawing-buffer size', () => {
    expect(shouldApplyRendererResize(390, 844, 390, 844)).toBe(false)
    expect(shouldApplyRendererResize(390.4, 844.2, 390, 844)).toBe(false)
  })

  it('applies when the integer size actually changed', () => {
    expect(shouldApplyRendererResize(844, 390, 390, 844)).toBe(true)
  })
})

describe('nextPixelRatio (Q178 DPR-only change)', () => {
  it('returns null while the effective ratio is unchanged, including under the cap', () => {
    expect(nextPixelRatio(2, 2, 2)).toBeNull()
    expect(nextPixelRatio(2, 3, 2)).toBeNull() // capped: a 3x monitor still renders at 2
    expect(nextPixelRatio(1.5, 1.5, 2)).toBeNull()
  })

  it('returns the new capped ratio when the monitor / zoom changes', () => {
    expect(nextPixelRatio(1, 2, 2)).toBe(2)
    expect(nextPixelRatio(2, 1.25, 2)).toBe(1.25)
    expect(nextPixelRatio(2, 3, 1.5)).toBe(1.5)
  })

  it('ignores invalid inputs', () => {
    expect(nextPixelRatio(1, 0, 2)).toBeNull()
    expect(nextPixelRatio(1, Number.NaN, 2)).toBeNull()
    expect(nextPixelRatio(1, 2, 0)).toBeNull()
  })
})
