import { describe, expect, it } from 'vitest'
import { isRangedTool, isThrowableKind, ITEM_CATALOG, rangedConfigFromThrowable } from './itemCatalog'

describe('isThrowableKind / rangedConfigFromThrowable (plan items-player-059 §13/§17)', () => {
  it('stone declares a throwable config but is not a held ranged weapon', () => {
    expect(isThrowableKind('stone')).toBe(true)
    expect(isRangedTool('stone')).toBe(false)
    expect(ITEM_CATALOG.stone.ranged).toBeUndefined()
  })

  it('returns null for a kind with no throwable config', () => {
    expect(isThrowableKind('knife')).toBe(false)
    expect(rangedConfigFromThrowable('knife')).toBeNull()
  })

  it('builds a synthetic RangedConfig from the throwable, using the kind itself as ammo', () => {
    const config = rangedConfigFromThrowable('stone')
    const throwable = ITEM_CATALOG.stone.throwable!
    expect(config).not.toBeNull()
    expect(config?.damage).toBe(throwable.damage)
    expect(config?.range).toBe(throwable.range)
    expect(config?.projectileSpeed).toBe(throwable.projectileSpeed)
    expect(config?.accuracy).toBe(throwable.accuracy)
    expect(config?.ammoKinds).toEqual(['stone'])
  })

  it('the synthetic config never contributes archery skill bonus', () => {
    expect(rangedConfigFromThrowable('stone')?.skillAccuracyScale).toBe(0)
  })
})

describe('crossbow/sling handling (plan items-player-059)', () => {
  it('crossbow declares an explicit reload distinct from bow recovery', () => {
    const crossbow = ITEM_CATALOG.crossbow.ranged!
    expect(crossbow.reloadTime).toBeGreaterThan(0)
    expect(crossbow.minReloadDistance).toBeGreaterThan(0)
  })

  it('bows omit reloadTime so their existing timing is unaffected', () => {
    expect(ITEM_CATALOG.short_bow.ranged?.reloadTime).toBeUndefined()
    expect(ITEM_CATALOG.hunting_bow.ranged?.reloadTime).toBeUndefined()
    expect(ITEM_CATALOG.long_bow.ranged?.reloadTime).toBeUndefined()
  })

  it('sling uses the existing stone item as ammo, not a dedicated ammo kind', () => {
    expect(ITEM_CATALOG.sling.ranged?.ammoKinds).toEqual(['stone'])
    expect(ITEM_CATALOG.sling.ranged?.reloadTime).toBeUndefined()
  })
})
