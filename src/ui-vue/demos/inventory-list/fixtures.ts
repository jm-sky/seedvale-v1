import type { EquipmentSlot } from '../../../items/equipment'
import type { ArmorPreviewInstance } from '../../../items/equipmentPreview'
import { ARMOR_QUALITY_LABELS, type ArmorQuality } from '../../../items/itemInstances'
import type { ItemKind } from '../../../items/items'
import type { EquipmentSlotView } from '../../components/items/equipmentPanelTypes'

export type DemoScenarioId =
  | 'full-bag'
  | 'empty'
  | 'leather'
  | 'compare-chainmail'
  | 'held-primary'
  | 'multi-armor'

/** One owned armor instance exposed for Porównaj / slot preview. */
export type DemoArmorInstanceRow = {
  id: string
  qualityLabel: string
  note?: string
}

/**
 * Kind-list row (D2). Stacks use `count` only; identity armor uses `instances`.
 * Demo-local presentation — not a live InventoryGroupView.
 */
export type DemoKindRow = {
  id: string
  name: string
  category: string
  count: number
  /** Short badges: w ręce · podst. wręcz · założony · porównanie */
  badges?: string[]
  /** Wear / fill / sharpness readout when the kind has a real V1 meter. */
  condition?: string
  /** Single armor instance (shortcut when `instances` is length 1). */
  compareId?: string
  /** Several same-kind armor pieces (different quality / identity). */
  instances?: DemoArmorInstanceRow[]
}

export type DemoScenario = {
  id: DemoScenarioId
  label: string
  equippedSlots: Partial<Record<EquipmentSlot, string>>
  instances: ArmorPreviewInstance[]
  compareInstanceId: string | null
  heldTool: ItemKind | null
  heldToolLabel: string | null
  primaryMeleeLabel: string | null
  primaryRangedLabel: string | null
  ammoLines: string[]
  /** Carrying readout for list header (fixture only). */
  totalWeightKg: number
  maxWeightKg: number
  totalSize: number
  maxSize: number
  kindRows: DemoKindRow[]
}

function armor(
  id: string,
  kind: ItemKind,
  quality: ArmorQuality,
  label: string,
): ArmorPreviewInstance {
  return { id, kind, quality, label }
}

/** All armor pieces the demo can equip / compare (preview helper input). */
const ARMOR_POOL: ArmorPreviewInstance[] = [
  armor('leather-poor', 'leather_armor', 'poor', 'skórzana zbroja'),
  armor('leather-1', 'leather_armor', 'common', 'skórzana zbroja'),
  armor('leather-good', 'leather_armor', 'good', 'skórzana zbroja'),
  armor('chain-1', 'chainmail', 'masterwork', 'kolczuga'),
  armor('chain-common', 'chainmail', 'common', 'kolczuga'),
  armor('pauldron-1', 'leather_pauldron', 'good', 'skórzany naramiennik'),
  armor('pauldron-poor', 'leather_pauldron', 'poor', 'skórzany naramiennik'),
  armor('ranger-1', 'ranger_pauldron', 'good', 'naramienniki tropiciela'),
]

function q(quality: ArmorQuality): string {
  return ARMOR_QUALITY_LABELS[quality]
}

function armorRows(
  ...rows: { id: string; quality: ArmorQuality; note?: string }[]
): DemoArmorInstanceRow[] {
  return rows.map((row) => ({
    id: row.id,
    qualityLabel: q(row.quality),
    note: row.note,
  }))
}

/** Shared full bag — categories, stacks, multi-instance armor, meters. */
const FULL_BAG_ROWS: DemoKindRow[] = [
  {
    id: 'leather_armor',
    name: 'skórzana zbroja',
    category: 'pancerz',
    count: 3,
    badges: ['3 egzemplarze'],
    instances: armorRows(
      { id: 'leather-poor', quality: 'poor', note: 'zużyta' },
      { id: 'leather-1', quality: 'common' },
      { id: 'leather-good', quality: 'good', note: 'niedawno nabyta' },
    ),
  },
  {
    id: 'chainmail',
    name: 'kolczuga',
    category: 'pancerz',
    count: 2,
    instances: armorRows(
      { id: 'chain-common', quality: 'common' },
      { id: 'chain-1', quality: 'masterwork', note: 'łup z kuźni' },
    ),
  },
  {
    id: 'leather_pauldron',
    name: 'skórzany naramiennik',
    category: 'pancerz',
    count: 2,
    instances: armorRows(
      { id: 'pauldron-poor', quality: 'poor' },
      { id: 'pauldron-1', quality: 'good' },
    ),
  },
  {
    id: 'ranger_pauldron',
    name: 'naramienniki tropiciela',
    category: 'pancerz',
    count: 1,
    compareId: 'ranger-1',
    instances: armorRows({ id: 'ranger-1', quality: 'good' }),
  },
  {
    id: 'axe',
    name: 'siekiera',
    category: 'narzędzie · broń',
    count: 1,
    condition: 'trwałość 72% · ostrość 55%',
  },
  {
    id: 'long_sword',
    name: 'miecz',
    category: 'broń',
    count: 1,
    condition: 'trwałość 88% · ostrość 40%',
  },
  {
    id: 'short_sword',
    name: 'krótki miecz',
    category: 'broń',
    count: 1,
    condition: 'trwałość 61% · ostrość 70%',
  },
  {
    id: 'knife',
    name: 'nóż',
    category: 'narzędzie',
    count: 2,
    badges: ['stack'],
    condition: 'trwałość 90%',
  },
  {
    id: 'pickaxe',
    name: 'kilof',
    category: 'narzędzie',
    count: 1,
    condition: 'trwałość 45%',
  },
  {
    id: 'short_bow',
    name: 'krótki łuk',
    category: 'broń',
    count: 1,
    condition: 'trwałość 80%',
  },
  {
    id: 'crossbow',
    name: 'kusza',
    category: 'broń',
    count: 1,
    condition: 'trwałość 66%',
  },
  {
    id: 'arrow',
    name: 'strzała',
    category: 'zasób',
    count: 24,
    badges: ['stack'],
  },
  {
    id: 'bolt',
    name: 'bełt',
    category: 'zasób',
    count: 7,
    badges: ['stack'],
  },
  {
    id: 'bread',
    name: 'chleb',
    category: 'pożywienie',
    count: 5,
    badges: ['stack'],
    condition: 'świeżość: dobre',
  },
  {
    id: 'apple',
    name: 'jabłko',
    category: 'pożywienie',
    count: 12,
    badges: ['stack'],
    condition: 'świeżość: świeże',
  },
  {
    id: 'raw_meat',
    name: 'surowe mięso',
    category: 'pożywienie',
    count: 3,
    badges: ['stack'],
    condition: 'świeżość: psuje się',
  },
  {
    id: 'yarrow',
    name: 'krwawnik',
    category: 'pożywienie',
    count: 8,
    badges: ['stack · zioło'],
  },
  {
    id: 'waterskin_medium',
    name: 'średni bukłak',
    category: 'użyteczne',
    count: 1,
    condition: 'wypełnienie 2.4 / 4 L',
  },
  {
    id: 'tent',
    name: 'namiot',
    category: 'użyteczne',
    count: 1,
  },
  {
    id: 'chest',
    name: 'skrzynia',
    category: 'użyteczne',
    count: 1,
  },
  {
    id: 'trap_simple',
    name: 'prosta pułapka',
    category: 'użyteczne',
    count: 4,
    badges: ['stack'],
  },
  {
    id: 'rope',
    name: 'lina',
    category: 'użyteczne',
    count: 3,
    badges: ['stack'],
  },
  {
    id: 'stone',
    name: 'kamień',
    category: 'zasób',
    count: 18,
    badges: ['stack'],
  },
  {
    id: 'coin',
    name: 'moneta',
    category: 'zasób',
    count: 347,
    badges: ['stack · miedź'],
  },
]

const FULL_BAG_WEIGHT = { totalWeightKg: 41.6, maxWeightKg: 50, totalSize: 38.2, maxSize: 45 }

function withBadges(rows: DemoKindRow[], patch: Record<string, string[]>): DemoKindRow[] {
  return rows.map((row) => {
    const extra = patch[row.id]
    if (!extra) return row
    return { ...row, badges: [...(row.badges ?? []), ...extra] }
  })
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'full-bag',
    label: 'Pełny worek (UX)',
    equippedSlots: { body: 'leather-1', arms: 'pauldron-1' },
    instances: ARMOR_POOL,
    compareInstanceId: null,
    heldTool: 'axe',
    heldToolLabel: 'siekiera',
    primaryMeleeLabel: 'miecz',
    primaryRangedLabel: 'krótki łuk',
    ammoLines: ['strzała ×24', 'bełt ×7'],
    ...FULL_BAG_WEIGHT,
    kindRows: withBadges(FULL_BAG_ROWS, {
      leather_armor: ['1 założona (zwykła)'],
      leather_pauldron: ['1 założony (dobra)'],
      axe: ['w ręce'],
      long_sword: ['podst. wręcz'],
      short_bow: ['podst. dystans'],
    }),
  },
  {
    id: 'empty',
    label: 'Puste sloty',
    equippedSlots: {},
    instances: ARMOR_POOL,
    compareInstanceId: null,
    heldTool: null,
    heldToolLabel: null,
    primaryMeleeLabel: null,
    primaryRangedLabel: null,
    ammoLines: [],
    totalWeightKg: 28.4,
    maxWeightKg: 50,
    totalSize: 26.1,
    maxSize: 45,
    kindRows: FULL_BAG_ROWS.filter((row) =>
      ['leather_armor', 'chainmail', 'axe', 'bread', 'apple', 'arrow', 'coin', 'waterskin_medium'].includes(row.id),
    ),
  },
  {
    id: 'leather',
    label: 'Założona skóra',
    equippedSlots: { body: 'leather-1' },
    instances: ARMOR_POOL,
    compareInstanceId: null,
    heldTool: 'axe',
    heldToolLabel: 'siekiera',
    primaryMeleeLabel: 'siekiera',
    primaryRangedLabel: null,
    ammoLines: [],
    totalWeightKg: 18.2,
    maxWeightKg: 50,
    totalSize: 14.5,
    maxSize: 45,
    kindRows: withBadges(
      FULL_BAG_ROWS.filter((row) =>
        ['leather_armor', 'chainmail', 'axe', 'knife', 'bread', 'stone'].includes(row.id),
      ),
      {
        leather_armor: ['1 założona (zwykła)'],
        axe: ['w ręce', 'podst. wręcz'],
      },
    ),
  },
  {
    id: 'compare-chainmail',
    label: 'Porównaj kolczugę',
    equippedSlots: { body: 'leather-1', arms: 'pauldron-1' },
    instances: ARMOR_POOL,
    compareInstanceId: 'chain-1',
    heldTool: null,
    heldToolLabel: null,
    primaryMeleeLabel: 'miecz',
    primaryRangedLabel: 'krótki łuk',
    ammoLines: ['strzała ×24', 'bełt ×0'],
    ...FULL_BAG_WEIGHT,
    kindRows: withBadges(FULL_BAG_ROWS, {
      leather_armor: ['1 założona (zwykła)'],
      chainmail: ['porównanie → mistrzowska'],
      leather_pauldron: ['1 założony (dobra)'],
      long_sword: ['podst. wręcz'],
      short_bow: ['podst. dystans'],
    }),
  },
  {
    id: 'held-primary',
    label: 'Held ≠ primary',
    equippedSlots: { body: 'chain-1' },
    instances: ARMOR_POOL,
    compareInstanceId: null,
    heldTool: 'pickaxe',
    heldToolLabel: 'kilof',
    primaryMeleeLabel: 'siekiera',
    primaryRangedLabel: 'kusza',
    ammoLines: ['bełt ×7'],
    totalWeightKg: 33.1,
    maxWeightKg: 50,
    totalSize: 29.8,
    maxSize: 45,
    kindRows: withBadges(
      FULL_BAG_ROWS.filter((row) =>
        [
          'chainmail',
          'leather_armor',
          'pickaxe',
          'axe',
          'crossbow',
          'bolt',
          'rope',
          'coin',
        ].includes(row.id),
      ),
      {
        chainmail: ['1 założona (mistrzowska)'],
        pickaxe: ['w ręce'],
        axe: ['podst. wręcz'],
        crossbow: ['podst. dystans'],
      },
    ),
  },
  {
    id: 'multi-armor',
    label: 'Multi-instance armor',
    equippedSlots: { body: 'leather-good', arms: 'ranger-1' },
    instances: ARMOR_POOL,
    compareInstanceId: 'leather-poor',
    heldTool: null,
    heldToolLabel: null,
    primaryMeleeLabel: 'krótki miecz',
    primaryRangedLabel: null,
    ammoLines: [],
    totalWeightKg: 22.7,
    maxWeightKg: 50,
    totalSize: 19.4,
    maxSize: 45,
    kindRows: withBadges(
      FULL_BAG_ROWS.filter((row) =>
        [
          'leather_armor',
          'chainmail',
          'leather_pauldron',
          'ranger_pauldron',
          'short_sword',
          'apple',
          'yarrow',
          'trap_simple',
        ].includes(row.id),
      ),
      {
        leather_armor: ['1 założona (dobra)', 'porównanie → kiepska'],
        ranger_pauldron: ['założone'],
        short_sword: ['podst. wręcz'],
      },
    ),
  },
]

export function slotViewsFor(
  equippedSlots: Partial<Record<EquipmentSlot, string>>,
  instances: ArmorPreviewInstance[],
): EquipmentSlotView[] {
  const byId = new Map(instances.map((row) => [row.id, row]))
  const slots: EquipmentSlot[] = ['head', 'body', 'arms', 'hands', 'legs', 'feet']
  return slots.map((slot) => {
    const id = equippedSlots[slot] ?? null
    const row = id ? byId.get(id) : undefined
    return {
      slot,
      instanceId: id,
      label: row?.label ?? null,
      qualityLabel: row ? ARMOR_QUALITY_LABELS[row.quality] : null,
    }
  })
}
