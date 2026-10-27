import { describe, expect, it } from 'vitest'
import type { InventoryGroupView } from '../../../items/inventoryView'
import { ITEM_CATALOG } from '../../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import {
  buildInventoryDetailStatRows,
  formatAmmoStat,
} from './buildInventoryDetailStatRows'
import { buildItemDetailPresentation } from './buildItemDetailPresentation'
import {
  catalogueStatStrength,
  INVENTORY_DETAIL_STAT_CEILINGS,
} from './catalogueStatStrength'

function emptyGroup(kind: InventoryGroupView['kind'], count = 1): InventoryGroupView {
  return {
    kind,
    count,
    condition: null,
    uniformConditionPercent: null,
    meterKind: null,
    instances: [],
    consumeUse: null,
  }
}

describe('formatAmmoStat', () => {
  it('shows primary ammo label and sum of all compatible kinds', () => {
    expect(formatAmmoStat(
      ['arrow', 'broadhead_arrow', 'war_arrow'],
      { arrow: 10000, broadhead_arrow: 0, war_arrow: 2 },
    )).toBe(`${ITEM_DEFS.arrow.label} · ×99+`)
    expect(formatAmmoStat(
      ['arrow', 'broadhead_arrow', 'war_arrow'],
      { arrow: 40, broadhead_arrow: 5, war_arrow: 2 },
    )).toBe(`${ITEM_DEFS.arrow.label} · ×47`)
  })
})

describe('buildInventoryDetailStatRows', () => {
  it('omits Ilość for instance-backed weapons and formats ammo like V3', () => {
    const rows = buildInventoryDetailStatRows({
      kind: 'long_bow',
      selectionType: 'instance',
      liveKindCount: 1,
      unitWeightKg: ITEM_DEFS.long_bow.weight,
      catalog: ITEM_CATALOG.long_bow,
      group: emptyGroup('long_bow'),
      instance: {
        id: 'bow-1',
        meterKind: 'condition',
        conditionPercent: 100,
        sharpnessPercent: null,
        sellPrice: 0,
      },
      counts: { arrow: 10000, broadhead_arrow: 0, war_arrow: 0 },
      bookSkillValue: null,
      merchantOpen: false,
      isArmor: false,
    })

    expect(rows.some((r) => r.label === 'Ilość')).toBe(false)
    expect(rows.some((r) => r.label === 'Skrót')).toBe(false)
    expect(rows.find((r) => r.label === 'Amunicja')?.value).toBe(`${ITEM_DEFS.arrow.label} · ×99+`)
    expect(rows.find((r) => r.label === 'Klasa')?.unavailable).toBe(true)
    expect(rows.find((r) => r.label === 'Materiał')?.unavailable).toBe(true)
    expect(rows.find((r) => r.label === 'Trwałość')?.unavailable).toBe(true)
    expect(rows.find((r) => r.label === 'Odnowienie')?.value).toBe('0.4 s')
    expect(rows.find((r) => r.label === 'Naciąg')?.value).toBe('0.65 s')
    expect(rows.find((r) => r.label === 'Pręd. pocisku')?.value).toBe('34 m/s')
    expect(rows.find((r) => r.label === 'Rozmiar')?.value).toBe(ITEM_DEFS.long_bow.size)
    expect(rows.find((r) => r.label === 'Celność')?.group).toBe('extra')
    expect(rows.find((r) => r.label === 'Celność')?.icon).toBe('accuracy')

    const presented = buildItemDetailPresentation({
      kind: 'long_bow',
      title: 'Łuk długi',
      meta: 'broń · sztuka',
      description: 'Opis',
      showDpsPlaceholder: true,
      stats: rows,
    })
    const labels = presented.stats.map((s) => s.label)
    expect(labels.indexOf('Obrażenia')).toBeLessThan(labels.indexOf('Odnowienie'))
    expect(labels.indexOf('Odnowienie')).toBeLessThan(labels.indexOf('DPS'))
    expect(labels.indexOf('DPS')).toBeLessThan(labels.indexOf('Wysiłek'))
    expect(presented.stats.find((s) => s.label === 'DPS')?.unavailable).toBe(true)
  })

  it('shows Ilość only for stackable group rows', () => {
    const rows = buildInventoryDetailStatRows({
      kind: 'arrow',
      selectionType: 'group',
      liveKindCount: 10000,
      unitWeightKg: ITEM_DEFS.arrow.weight,
      catalog: ITEM_CATALOG.arrow,
      group: emptyGroup('arrow', 10000),
      instance: null,
      counts: { arrow: 10000 },
      bookSkillValue: null,
      merchantOpen: false,
      isArmor: false,
    })
    expect(rows.find((r) => r.label === 'Ilość')?.value).toBe('×10000')
    expect(rows.find((r) => r.label === 'Ilość')?.group).toBe('value')
  })

  function combatRows(kind: ItemKind) {
    return buildInventoryDetailStatRows({
      kind,
      selectionType: 'instance',
      liveKindCount: 1,
      unitWeightKg: ITEM_DEFS[kind].weight,
      catalog: ITEM_CATALOG[kind],
      group: emptyGroup(kind),
      instance: {
        id: `${kind}-1`,
        meterKind: 'condition',
        conditionPercent: 100,
        sharpnessPercent: null,
        sellPrice: 0,
      },
      counts: {},
      bookSkillValue: null,
      merchantOpen: false,
      isArmor: false,
    })
  }

  it('scales Obrażenia StatUnderline to the strongest catalogue weapon', () => {
    const maxDamage = INVENTORY_DETAIL_STAT_CEILINGS.damage
    expect(maxDamage).toBe(ITEM_CATALOG.obsidian_sword.melee!.damage)

    const strongest = combatRows('obsidian_sword').find((r) => r.label === 'Obrażenia')
    expect(strongest?.strength).toBe(1)

    const midMelee = combatRows('axe').find((r) => r.label === 'Obrażenia')
    const axeDamage = ITEM_CATALOG.axe.melee!.damage
    expect(midMelee?.strength).toBe(catalogueStatStrength(axeDamage, maxDamage))
    expect(midMelee?.strength).toBeLessThan(1)

    const bow = combatRows('long_bow').find((r) => r.label === 'Obrażenia')
    const bowDamage = ITEM_CATALOG.long_bow.ranged!.damage
    expect(bow?.strength).toBe(catalogueStatStrength(bowDamage, maxDamage))
    expect(bow?.strength).toBe(bowDamage / maxDamage)
  })
})
