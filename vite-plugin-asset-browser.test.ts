import { describe, expect, it } from 'vitest'
import { COMPARE_V2_ROOT, COMPARE_V3_ROOT, resolveComparePath } from './vite-plugin-asset-browser'

describe('resolveComparePath', () => {
  it('resolves v3 Male_Peasant under the repo characters root', () => {
    const path = resolveComparePath('/compare/v3/Male_Peasant.glb')
    expect(path).toBeTruthy()
    expect(path!.startsWith(COMPARE_V3_ROOT)).toBe(true)
    expect(path!.endsWith('Male_Peasant.glb')).toBe(true)
  })

  it('resolves v2 eq Female pack', () => {
    const path = resolveComparePath('/compare/v2/eq/Female.glb')
    expect(path).toBeTruthy()
    expect(path!.startsWith(COMPARE_V2_ROOT)).toBe(true)
  })

  it('rejects path traversal and missing files', () => {
    expect(resolveComparePath('/compare/v3/../SeedVales/secret.glb')).toBeNull()
    expect(resolveComparePath('/compare/v3/nope-missing.glb')).toBeNull()
    expect(resolveComparePath('/models/characters/ubc/male_peasant.glb')).toBeNull()
  })
})
