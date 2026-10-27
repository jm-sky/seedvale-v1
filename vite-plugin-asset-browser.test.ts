import { existsSync, type Stats, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { COMPARE_V2_ROOT, COMPARE_V3_ROOT, resolveComparePath } from './vite-plugin-asset-browser'

vi.mock('node:fs', async (original) => ({
  ...await original<typeof import('node:fs')>(),
  existsSync: vi.fn(),
  statSync: vi.fn(),
}))

beforeEach(() => {
  // These mounts point to optional donor checkouts outside this repository.
  const files = new Set([
    resolve(COMPARE_V2_ROOT, 'eq/Female.glb'),
    resolve(COMPARE_V3_ROOT, 'Male_Peasant.glb'),
  ])
  vi.mocked(existsSync).mockImplementation((path) => files.has(String(path)))
  vi.mocked(statSync).mockReturnValue({ isFile: () => true } as Stats)
})

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

  it('rejects a directory even when the path exists', () => {
    vi.mocked(statSync).mockReturnValueOnce({ isFile: () => false } as Stats)
    expect(resolveComparePath('/compare/v3/Male_Peasant.glb')).toBeNull()
  })
})
