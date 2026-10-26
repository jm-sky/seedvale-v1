import type { EquipmentSlot } from '../../../items/equipment'

export type EquipmentSlotView = {
  slot: EquipmentSlot
  instanceId: string | null
  label: string | null
  qualityLabel: string | null
}
