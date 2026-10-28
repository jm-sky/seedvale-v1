import { describe, expect, it } from 'vitest'
import { stripBaseDir } from './utils.js'

describe('stripBaseDir', () => {
  it('relativizes POSIX paths', () => {
    expect(stripBaseDir('/repo/src/economy/stock.ts', '/repo/src')).toBe('economy/stock.ts')
  })

  it('relativizes Windows backslash paths against a backslash base', () => {
    expect(stripBaseDir('D:\\Projekty\\seedvale-v1\\src\\economy\\stock.ts', 'D:\\Projekty\\seedvale-v1\\src'))
      .toBe('economy/stock.ts')
  })

  it('handles mixed separators and drive-letter case', () => {
    expect(stripBaseDir('D:/Projekty/seedvale-v1/src/economy/stock.ts', 'd:\\Projekty\\seedvale-v1\\src'))
      .toBe('economy/stock.ts')
  })

  it('does not strip a sibling directory sharing the prefix', () => {
    expect(stripBaseDir('/repo/src2/a.ts', '/repo/src')).toBe('/repo/src2/a.ts')
  })
})
