import { describe, expect, it } from 'vitest'
import { buildItemDetailPresentation } from './buildItemDetailPresentation'

describe('buildItemDetailPresentation', () => {
  it('labels trap condition as Stan (not fill)', () => {
    const p = buildItemDetailPresentation({
      kind: 'trap_simple',
      title: 'Pułapka',
      meta: 'narzędzie · ×1',
      description: 'Opis',
      meterKind: 'condition',
      conditionPercent: 72,
      stats: [],
    })
    expect(p.meters.some((m) => m.label === 'Stan' && m.ratio === 0.72 && !m.unavailable)).toBe(true)
    expect(p.meters.some((m) => m.label === 'Napełnienie')).toBe(false)
  })

  it('labels liquid fill as Napełnienie (not durability)', () => {
    const p = buildItemDetailPresentation({
      kind: 'waterskin_medium',
      title: 'Bukłak',
      meta: '×1',
      description: 'Opis',
      meterKind: 'fill',
      conditionPercent: 60,
      stats: [],
    })
    const fill = p.meters.find((m) => m.label === 'Napełnienie')
    expect(fill?.ratio).toBe(0.6)
    expect(fill?.unavailable).toBeFalsy()
  })

  it('shows weapon sharpness separately from Stan', () => {
    const p = buildItemDetailPresentation({
      kind: 'axe',
      title: 'Topór',
      meta: '×1',
      description: 'Opis',
      meterKind: 'durability',
      conditionPercent: 72,
      sharpnessPercent: 55,
      showDpsPlaceholder: true,
      stats: [{ label: 'Obrażenia', value: '12' }],
    })
    expect(p.meters.find((m) => m.label === 'Stan')?.ratio).toBe(0.72)
    expect(p.meters.find((m) => m.label === 'Ostrość')?.ratio).toBe(0.55)
    expect(p.stats.some((s) => s.label === 'DPS' && s.unavailable)).toBe(true)
  })

  it('never treats armor sort-only 100 as wear; reserves Zużycie placeholder', () => {
    const p = buildItemDetailPresentation({
      kind: 'leather_armor',
      title: 'Pancerz',
      meta: '×1',
      description: 'Opis',
      meterKind: 'condition',
      conditionPercent: 100,
      qualityLabel: 'zwykła',
      quality: 'common',
      worthCoins: 42,
      showArmorWearPlaceholder: true,
      showResistPlaceholders: true,
      stats: [{ label: 'Ochrona', value: '18%' }],
    })
    expect(p.meters.some((m) => m.label === 'Stan')).toBe(false)
    expect(p.meters.some((m) => m.label === 'Zużycie' && m.unavailable)).toBe(true)
    expect(p.meters.some((m) => m.label === 'Jakość')).toBe(false)
    expect(p.quality).toBe('common')
    expect(p.qualityLabel).toBe('zwykła')
    expect(p.worthCoins).toBe(42)
    expect(p.stats.filter((s) => s.unavailable).map((s) => s.label)).toEqual(
      expect.arrayContaining(['Cięcie', 'Pchnięcie', 'Obuch']),
    )
  })

  it('exposes V3-style worth header and stack count without fabricating meters', () => {
    const p = buildItemDetailPresentation({
      kind: 'apple',
      title: 'Jabłko',
      meta: '×3',
      description: 'Opis',
      worthCoins: 3,
      stackCount: 3,
      stats: [{ label: 'Wartość', value: '1c' }],
    })
    expect(p.worthCoins).toBe(3)
    expect(p.stackCount).toBe(3)
    expect(p.meters).toEqual([])
    expect(p.quality).toBeNull()
  })

  it('reserves gray unavailable Stan for display-only full condition (e.g. bow)', () => {
    const p = buildItemDetailPresentation({
      kind: 'hunting_bow',
      title: 'Łuk myśliwski',
      meta: 'broń · sztuka',
      description: 'Opis',
      worthCoins: 45,
      showConditionUnavailablePlaceholder: true,
      showDpsPlaceholder: true,
      stats: [{ label: 'Obrażenia', value: '8' }],
    })
    const stan = p.meters.find((m) => m.label === 'Stan')
    expect(stan?.unavailable).toBe(true)
    expect(stan?.ratio).toBeNull()
    expect(stan?.icon).toBe('durability')
    expect(p.meters.some((m) => m.ratio === 1)).toBe(false)
  })

  it('missing metrics stay labeled unavailable, never fabricated zero', () => {
    const p = buildItemDetailPresentation({
      kind: 'axe',
      title: 'Topór',
      meta: '×1',
      description: 'Opis',
      showDpsPlaceholder: true,
      stats: [{ label: 'Obrażenia', value: '0' }],
    })
    const dps = p.stats.find((s) => s.label === 'DPS')
    expect(dps?.unavailable).toBe(true)
    expect(dps?.value).toBe('—')
    expect(p.loreUnavailable).toBe(true)
    expect(p.meters.every((m) => m.unavailable || (m.ratio != null && m.ratio > 0) || m.title)).toBe(true)
  })
})
