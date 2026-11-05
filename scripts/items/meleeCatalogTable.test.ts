import { describe, expect, it } from 'vitest'
import { ITEM_CATALOG } from '../../src/items/itemCatalog'
import { buildMeleeRows, findFamilyInversions, MELEE_ANALYSIS_META, RETUNE_PROPOSALS, V1_ANCHORS } from './meleeCatalogTable'

/** Plan items-player-067 verification 1: full-catalog melee check (Q153). Pure read of the catalog. */
describe('melee catalog full check (items-player-067 §B)', () => {
  const rows = buildMeleeRows()

  it('covers all 34 melee entries and each has analysis metadata', () => {
    expect(rows).toHaveLength(34)
    for (const r of rows) expect(MELEE_ANALYSIS_META[r.kind], r.kind).toBeDefined()
  })

  it('keeps every value finite and inside sane bounds', () => {
    for (const r of rows) {
      const m = ITEM_CATALOG[r.kind].melee!
      expect(m.damage, r.kind).toBeGreaterThan(0)
      expect(m.range, r.kind).toBeGreaterThan(1)
      expect(m.range, r.kind).toBeLessThanOrEqual(3.3)
      expect(m.arcDot, r.kind).toBeGreaterThan(0)
      expect(m.arcDot, r.kind).toBeLessThan(1)
      expect(m.windUp, r.kind).toBeGreaterThan(0)
      expect(m.hitWindow, r.kind).toBeGreaterThan(0)
      expect(m.recovery, r.kind).toBeGreaterThan(0)
      expect(m.staminaCost, r.kind).toBeGreaterThan(0)
      expect(Number.isFinite(r.dps) && Number.isFinite(r.dmgPerStamina), r.kind).toBe(true)
    }
  })

  it('pins the five V1 envelope anchors (author Q-C3 (a))', () => {
    for (const [kind, expected] of Object.entries(V1_ANCHORS)) {
      const m = ITEM_CATALOG[kind as keyof typeof ITEM_CATALOG].melee!
      expect(`${m.damage}/${m.range}/${m.staminaCost}`, kind).toBe(expected)
    }
  })

  it('keeps a stable tier order of mean DPS (ordinary < masterwork < legendary)', () => {
    const mean = (t: string) => {
      const xs = rows.filter((r) => r.tier === t).map((r) => r.dps)
      return xs.reduce((a, b) => a + b, 0) / xs.length
    }
    expect(mean('ordinary')).toBeLessThan(mean('masterwork'))
    expect(mean('masterwork')).toBeLessThan(mean('legendary'))
  })

  it('only the documented improved-tier quest swords invert against higher tiers', () => {
    const lows = new Set(findFamilyInversions(rows).map((fl) => fl.other))
    expect([...lows].sort()).toEqual(['damascus_long_sword', 'obsidian_sword'])
  })

  it('retune proposals touch no anchor and do not change wolf hit counts', () => {
    const after = buildMeleeRows(RETUNE_PROPOSALS)
    for (const k of Object.keys(RETUNE_PROPOSALS)) expect(Object.keys(V1_ANCHORS)).not.toContain(k)
    for (const r of rows) expect(after.find((a) => a.kind === r.kind)!.hits.wolf, r.kind).toBe(r.hits.wolf)
  })
})
