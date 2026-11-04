import type { EquipmentPositionKey, EquipmentSlot } from '../../../items/equipmentTypes'
import type { EquipmentCellRow, EquipmentSlotView } from './equipmentPanelTypes'
import { EQUIPMENT_LAYER_LABEL, EQUIPMENT_SLOT_LABEL } from '../../../items/equipment'
import { ARMOR_LAYERS, equipmentPositionKey } from '../../../items/equipmentTypes'

export type EquipmentCellKey = EquipmentSlot | 'held' | 'shield'
export type EquipmentLayoutCell = {
  key: EquipmentCellKey
  area: string
  label: string
  /** Armor positions in DOM/tab order: `under` then `outer`; empty for held / shield. */
  positions: readonly EquipmentPositionKey[]
}

function armorCell(key: EquipmentSlot, area: string): EquipmentLayoutCell {
  return {
    key,
    area,
    label: EQUIPMENT_SLOT_LABEL[key],
    positions: ARMOR_LAYERS.map((layer) => equipmentPositionKey(key, layer)),
  }
}

/** DOM/tab order is anatomical on narrow screens (under, then outer per cell); named areas place the desktop grid.
 * @domain ui-input
 */
export const EQUIPMENT_LAYOUT: readonly EquipmentLayoutCell[] = [
  armorCell('head', 'head'),
  armorCell('shoulders', 'shoulders'),
  armorCell('body', 'torso'),
  armorCell('forearms', 'forearms'),
  armorCell('hands', 'hands'),
  armorCell('legs', 'legs'),
  armorCell('feet', 'feet'),
  { key: 'held', area: 'weapon', label: 'W ręce', positions: [] },
  { key: 'shield', area: 'shield', label: 'Tarcza', positions: [] },
]

export const EMPTY_ROW_TEXT = '—'
export const NO_COMPATIBLE_ROW_TEXT = 'Brak pasujących przedmiotów'

export type EquipmentRowContext = {
  slots: readonly EquipmentSlotView[]
  /** Positions for which the inventory holds a not-yet-worn compatible armor piece. */
  positionsWithCandidates: ReadonlySet<EquipmentPositionKey>
  highlightPosition: EquipmentPositionKey | null
  compareInstanceId: string | null
}

/** Under/Outer rows of one armor cell, in tab order. Empty rows say whether anything could fill them.
 * @domain ui-input
 */
export function buildArmorCellRows(cell: EquipmentLayoutCell, ctx: EquipmentRowContext): EquipmentCellRow[] {
  const byPosition = new Map(ctx.slots.map((row) => [row.position, row]))
  return cell.positions.map((position) => {
    const view = byPosition.get(position)
    const worn = !!view?.instanceId && !!view.label
    const layer = position.split(':')[1] as keyof typeof EQUIPMENT_LAYER_LABEL
    return {
      position,
      layerLabel: EQUIPMENT_LAYER_LABEL[layer],
      state: worn ? 'worn' : 'empty',
      itemLabel: worn ? view!.label : null,
      qualityLabel: worn ? view!.qualityLabel : null,
      emptyText: ctx.positionsWithCandidates.has(position) ? EMPTY_ROW_TEXT : NO_COMPATIBLE_ROW_TEXT,
      highlighted: ctx.highlightPosition === position,
      compared: worn && !!ctx.compareInstanceId && ctx.compareInstanceId === view!.instanceId,
    }
  })
}
