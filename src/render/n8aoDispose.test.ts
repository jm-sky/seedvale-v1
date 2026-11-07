// @vitest-environment jsdom
import { N8AOPass } from 'n8ao'
import { PerspectiveCamera, Scene } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { disposeN8aoPass, N8AO_DISPOSABLE_FIELDS } from './n8aoDispose'

/** Every resource-owning field the installed `n8ao` pass currently holds. */
function ownedResources(pass: N8AOPass): unknown[] {
  const owner = pass as unknown as Record<string, unknown>
  return N8AO_DISPOSABLE_FIELDS.map((f) => owner[f]).filter((r) => typeof (r as { dispose?: unknown } | undefined)?.dispose === 'function')
}

describe('disposeN8aoPass (n8ao 2.0.1 ships no dispose)', () => {
  it('finds the pass-owned render targets, noise texture and full-screen quads', () => {
    const pass = new N8AOPass(new Scene(), new PerspectiveCamera(), 64, 64)
    // If an upgrade renames these, the leak silently returns — fail here instead.
    expect(ownedResources(pass).length).toBeGreaterThanOrEqual(8)
    pass.dispose?.()
  })

  it('disposes each owned resource exactly once, and again on repeated mount/teardown', () => {
    for (let mount = 0; mount < 3; mount++) {
      const pass = new N8AOPass(new Scene(), new PerspectiveCamera(), 64, 64)
      const spies = ownedResources(pass).map((r) => vi.spyOn(r as { dispose: () => void }, 'dispose'))
      disposeN8aoPass(pass)
      for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1)
    }
  })

  it('is safe on a pass that has no resources', () => {
    expect(() => disposeN8aoPass({})).not.toThrow()
  })
})
