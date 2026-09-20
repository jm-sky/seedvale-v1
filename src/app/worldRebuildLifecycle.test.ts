import { describe, expect, it } from 'vitest'
import { createWorldRebuildLifecycle } from './worldRebuildLifecycle'

describe('createWorldRebuildLifecycle (plan world-033)', () => {
  it('starts running and valid, and a successful rebuild returns to running', () => {
    const lifecycle = createWorldRebuildLifecycle()
    expect(lifecycle.state()).toBe('running')
    expect(lifecycle.isValid()).toBe(true)

    expect(lifecycle.beginRebuild()).toBe(true)
    expect(lifecycle.state()).toBe('rebuilding')
    expect(lifecycle.isValid()).toBe(false)

    lifecycle.completePublished()
    expect(lifecycle.state()).toBe('running')
    expect(lifecycle.isValid()).toBe(true)
  })

  it('excludes a duplicate rebuild request while one is already in flight', () => {
    const lifecycle = createWorldRebuildLifecycle()
    expect(lifecycle.beginRebuild()).toBe(true)
    expect(lifecycle.beginRebuild()).toBe(false)
    expect(lifecycle.state()).toBe('rebuilding')
  })

  it('teardown during a rebuild wins: the rebuild noticing staleness never resumes running', () => {
    const lifecycle = createWorldRebuildLifecycle()
    lifecycle.beginRebuild()
    lifecycle.dispose()
    expect(lifecycle.state()).toBe('disposed')
    expect(lifecycle.isValid()).toBe(false)

    // The in-flight rebuild resumes after teardown, notices it was
    // superseded, and reports 'stale' — must never resurrect 'running'.
    lifecycle.completeStale()
    expect(lifecycle.state()).toBe('disposed')
    expect(lifecycle.isValid()).toBe(false)

    // Nor may a fresh rebuild attempt start against a torn-down app.
    expect(lifecycle.beginRebuild()).toBe(false)
  })

  it('a genuinely failed rebuild is sticky: normal ticking and further rebuilds stay blocked', () => {
    const lifecycle = createWorldRebuildLifecycle()
    lifecycle.beginRebuild()
    lifecycle.completeFailed()
    expect(lifecycle.state()).toBe('rebuild-failed')
    expect(lifecycle.isValid()).toBe(false)
    expect(lifecycle.beginRebuild()).toBe(false)
  })

  it('teardown after a failed rebuild still wins (disposed is never downgraded back to rebuild-failed)', () => {
    const lifecycle = createWorldRebuildLifecycle()
    lifecycle.beginRebuild()
    lifecycle.dispose()
    lifecycle.completeFailed()
    expect(lifecycle.state()).toBe('disposed')
  })
})
