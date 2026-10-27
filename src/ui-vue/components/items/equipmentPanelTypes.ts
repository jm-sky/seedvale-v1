import type { EquipmentSlot } from '../../../items/equipment'
import type { ArmorQuality } from '../../../items/itemInstances'

export type EquipmentSlotView = {
  slot: EquipmentSlot
  instanceId: string | null
  label: string | null
  quality: ArmorQuality | null
  qualityLabel: string | null
}
