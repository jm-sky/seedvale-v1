/** Shared equipment slot and layer vocabulary.
 * @domain items-player
 */
export type EquipmentSlot = 'head' | 'body' | 'shoulders' | 'forearms' | 'hands' | 'legs' | 'feet'
export type ArmorLayer = 'under' | 'outer'
export type EquipmentPositionKey = `${EquipmentSlot}:${ArmorLayer}`
