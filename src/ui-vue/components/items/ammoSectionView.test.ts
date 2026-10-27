import { describe, expect, it } from 'vitest'
import { ITEM_DEFS } from '../../../items/items'
import { buildAmmoSectionView } from './ammoSectionView'

describe('buildAmmoSectionView', () => {
  it('lists catalog order with counts and sums totals', () => {
    const view = buildAmmoSectionView(
      ['arrow', 'broadhead_arrow', 'war_arrow'],
      { arrow: 40, broadhead_arrow: 5, war_arrow: 2 },
    )
    expect(view.lines).toEqual([
      { kind: 'arrow', label: ITEM_DEFS.arrow.label, count: 40 },
      { kind: 'broadhead_arrow', label: ITEM_DEFS.broadhead_arrow.label, count: 5 },
      { kind: 'war_arrow', label: ITEM_DEFS.war_arrow.label, count: 2 },
    ])
    expect(view.total).toBe(47)
  })

  it('resolves the first owned kind in catalog order (gameLoop fire order)', () => {
    const view = buildAmmoSectionView(
      ['arrow', 'broadhead_arrow', 'war_arrow'],
      { arrow: 0, broadhead_arrow: 3, war_arrow: 10 },
    )
    expect(view.resolvedKind).toBe('broadhead_arrow')
    expect(view.resolvedLabel).toBe(ITEM_DEFS.broadhead_arrow.label)
    expect(view.resolvedCount).toBe(3)
    expect(view.total).toBe(13)
  })

  it('returns null resolution when no compatible ammo is carried', () => {
    const view = buildAmmoSectionView(
      ['bolt'],
      { arrow: 99 },
    )
    expect(view.lines).toEqual([
      { kind: 'bolt', label: ITEM_DEFS.bolt.label, count: 0 },
    ])
    expect(view.total).toBe(0)
    expect(view.resolvedKind).toBeNull()
    expect(view.resolvedLabel).toBeNull()
    expect(view.resolvedCount).toBe(0)
  })

  it('treats missing count keys as zero', () => {
    const view = buildAmmoSectionView(['stone'], {})
    expect(view.lines[0]?.count).toBe(0)
    expect(view.total).toBe(0)
    expect(view.resolvedKind).toBeNull()
    expect(view.resolvedCount).toBe(0)
  })
})
