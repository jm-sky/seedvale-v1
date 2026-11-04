import type { EquipmentSlot } from '../../../items/equipmentTypes'
import { EQUIPMENT_SLOT_LABEL } from '../../../items/equipment'

export type EquipmentCellKey = EquipmentSlot | 'held' | 'shield'
export type EquipmentLayoutCell = { key: EquipmentCellKey, area: string, label: string }

/** DOM/tab order is anatomical on narrow screens; named areas place the desktop grid.
 * @domain ui-input
 */
export const EQUIPMENT_LAYOUT: readonly EquipmentLayoutCell[] = [
  { key: 'head', area: 'head', label: EQUIPMENT_SLOT_LABEL.head },
  { key: 'shoulders', area: 'shoulders', label: EQUIPMENT_SLOT_LABEL.shoulders },
  { key: 'body', area: 'torso', label: EQUIPMENT_SLOT_LABEL.body },
  { key: 'forearms', area: 'forearms', label: EQUIPMENT_SLOT_LABEL.forearms },
  { key: 'hands', area: 'hands', label: EQUIPMENT_SLOT_LABEL.hands },
  { key: 'legs', area: 'legs', label: EQUIPMENT_SLOT_LABEL.legs },
  { key: 'feet', area: 'feet', label: EQUIPMENT_SLOT_LABEL.feet },
  { key: 'held', area: 'weapon', label: 'W ręce' },
  { key: 'shield', area: 'shield', label: 'Tarcza' },
]
