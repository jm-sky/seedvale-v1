/**
 * Explicit GPU-resource release for an `N8AOPass` (Q178, audit 041 F16-03).
 *
 * `n8ao@2.0.1` ships no `dispose()` — the pass inherits `Pass`'s no-op — yet its constructor and
 * `configure*` calls allocate render targets, depth textures, a blue-noise texture and full-screen
 * triangle materials/geometries. `EffectComposer.dispose()` only frees the composer's own targets, so
 * without this every mount/teardown leaks the pass's resources. Field names are those of the installed
 * version (re-check them when upgrading `n8ao`; the unit test builds a real pass and fails if a
 * resource-owning field is renamed away).
 *
 * @domain rendering
 */

type Disposable = { dispose: () => void }

/** Fields holding a render target, texture, material or `FullScreenTriangle` (`dispose()` frees its
 *  material + geometry) as of `n8ao@2.0.1`. Fields absent in the current configuration are skipped. */
export const N8AO_DISPOSABLE_FIELDS = [
  'beautyRenderTarget',
  'writeTargetInternal',
  'readTargetInternal',
  'accumulationRenderTarget',
  'depthDownsampleTarget',
  'transparencyRenderTargetDWFalse',
  'transparencyRenderTargetDWTrue',
  'bluenoise',
  'accumulationQuad',
  'depthDownsampleQuad',
  'depthCopyPass',
  'effectShaderQuad',
  'poissonBlurQuad',
  'effectCompositerQuad',
  'standardDenoiseMaterial',
  'neuralDenoiseMaterial',
] as const

function isDisposable(value: unknown): value is Disposable {
  return typeof (value as Disposable | null | undefined)?.dispose === 'function'
}

/** Disposes every resource the pass owns exactly once (the denoise material is also held by
 *  `poissonBlurQuad`, so quads are listed before bare materials). */
export function disposeN8aoPass(pass: object): void {
  const seen = new Set<unknown>()
  const owner = pass as Record<string, unknown>
  for (const field of N8AO_DISPOSABLE_FIELDS) {
    const resource = owner[field]
    if (!isDisposable(resource) || seen.has(resource)) continue
    seen.add(resource)
    // A `FullScreenTriangle` disposes its material too — don't free a shared one (denoise) a second time.
    const material = (resource as { material?: unknown }).material
    if (material) seen.add(material)
    resource.dispose()
  }
}
