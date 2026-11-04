/** Shared equipment slot and layer vocabulary.
 * @domain items-player
 */
export type EquipmentSlot = 'head' | 'body' | 'shoulders' | 'forearms' | 'hands' | 'legs' | 'feet'
export type ArmorLayer = 'under' | 'outer'
export type EquipmentPositionKey = `${EquipmentSlot}:${ArmorLayer}`

export const ARMOR_LAYERS: readonly ArmorLayer[] = ['under', 'outer']

export function equipmentPositionKey(slot: EquipmentSlot, layer: ArmorLayer): EquipmentPositionKey {
  return `${slot}:${layer}`
}
