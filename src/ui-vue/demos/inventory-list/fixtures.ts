import type { EquipmentSlot } from '../../../items/equipment'
import type { ArmorPreviewInstance } from '../../../items/equipmentPreview'
import type { EquipmentSlotView } from '../../components/items/equipmentPanelTypes'

export type DemoScenarioId = 'empty' | 'leather' | 'compare-chainmail' | 'held-primary'

export type DemoScenario = {
  id: DemoScenarioId
  label: string
  equippedSlots: Partial<Record<EquipmentSlot, string>>
  instances: ArmorPreviewInstance[]
  compareInstanceId: string | null
  heldToolLabel: string | null
  primaryMeleeLabel: string | null
  primaryRangedLabel: string | null
  ammoLines: string[]
  kindRows: { name: string; meta: string; compareId?: string }[]
}

const INSTANCES: ArmorPreviewInstance[] = [
  { id: 'leather-1', kind: 'leather_armor', quality: 'common', label: 'Skórzany pancerz' },
  { id: 'chain-1', kind: 'chainmail', quality: 'masterwork', label: 'Kolczuga' },
  { id: 'pauldron-1', kind: 'leather_pauldron', quality: 'good', label: 'Skórzane naramienniki' },
]

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'empty',
    label: 'Puste sloty',
    equippedSlots: {},
    instances: INSTANCES,
    compareInstanceId: null,
    heldToolLabel: null,
    primaryMeleeLabel: null,
    primaryRangedLabel: null,
    ammoLines: [],
    kindRows: [
      { name: '1 × Skórzany pancerz', meta: 'pancerz', compareId: 'leather-1' },
      { name: '1 × Kolczuga', meta: 'pancerz', compareId: 'chain-1' },
    ],
  },
  {
    id: 'leather',
    label: 'Założona skóra',
    equippedSlots: { body: 'leather-1' },
    instances: INSTANCES,
    compareInstanceId: null,
    heldToolLabel: 'Topór',
    primaryMeleeLabel: 'Topór',
    primaryRangedLabel: null,
    ammoLines: [],
    kindRows: [
      { name: '1 × Skórzany pancerz', meta: 'pancerz · założony', compareId: 'leather-1' },
      { name: '1 × Kolczuga', meta: 'pancerz', compareId: 'chain-1' },
      { name: '1 × Topór', meta: 'broń · w ręce' },
    ],
  },
  {
    id: 'compare-chainmail',
    label: 'Porównaj kolczugę',
    equippedSlots: { body: 'leather-1', arms: 'pauldron-1' },
    instances: INSTANCES,
    compareInstanceId: 'chain-1',
    heldToolLabel: null,
    primaryMeleeLabel: 'Miecz',
    primaryRangedLabel: 'Łuk',
    ammoLines: ['Strzała ×12', 'Bełt ×0'],
    kindRows: [
      { name: '1 × Skórzany pancerz', meta: 'pancerz', compareId: 'leather-1' },
      { name: '1 × Kolczuga', meta: 'pancerz · porównanie', compareId: 'chain-1' },
      { name: '1 × Skórzane naramienniki', meta: 'pancerz', compareId: 'pauldron-1' },
    ],
  },
  {
    id: 'held-primary',
    label: 'Held ≠ primary',
    equippedSlots: { body: 'chain-1' },
    instances: INSTANCES,
    compareInstanceId: null,
    heldToolLabel: 'Kilof',
    primaryMeleeLabel: 'Topór',
    primaryRangedLabel: 'Kusza',
    ammoLines: ['Bełt ×4'],
    kindRows: [
      { name: '1 × Kolczuga', meta: 'pancerz', compareId: 'chain-1' },
      { name: '1 × Kilof', meta: 'narzędzie · w ręce' },
      { name: '1 × Topór', meta: 'broń · podst. wręcz' },
    ],
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
      qualityLabel: row ? String(row.quality) : null,
    }
  })
}
