import type { ArmorLayer, EquipmentPositionKey, EquipmentSlot } from '../../../items/equipmentTypes'
import type { ArmorQuality } from '../../../items/itemInstances'

/** One armor position (`slot:layer`) as worn right now; `instanceId` is null when empty. */
export type EquipmentSlotView = {
  position: EquipmentPositionKey
  slot: EquipmentSlot
  layer: ArmorLayer
  instanceId: string | null
  label: string | null
  quality: ArmorQuality | null
  qualityLabel: string | null
}

export type EquipmentRowState = 'worn' | 'empty' | 'unavailable'

/** One row inside a panel cell: an armor layer, the held weapon, or the disabled shield. */
export type EquipmentCellRow = {
  /** Exact worn position; null for held / shield rows. */
  position: EquipmentPositionKey | null
  /** `Spód` / `Wierzch`; null for held / shield rows. */
  layerLabel: string | null
  state: EquipmentRowState
  itemLabel: string | null
  qualityLabel: string | null
  /** Placeholder shown when the row is not worn. */
  emptyText: string
  highlighted: boolean
  compared: boolean
}
