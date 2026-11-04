import type { EquipmentSlot } from '../../../items/equipment'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import type { ArmorQuality } from '../../../items/itemInstances'

export type EquipmentSlotView = {
  slot: EquipmentSlot
  /** Worn position shown in this slot cell (outer first, then under); null when empty. */
  position: EquipmentPositionKey | null
  instanceId: string | null
  label: string | null
  quality: ArmorQuality | null
  qualityLabel: string | null
}
