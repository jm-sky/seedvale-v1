/** Shared equipment vocabulary; the live slot union changes in 044-M.
 * @domain items-player
 */
export type EquipmentSlot = 'head' | 'body' | 'arms' | 'hands' | 'legs' | 'feet'
export type ArmorLayer = 'under' | 'outer'
export type EquipmentPositionKey = `${EquipmentSlot}:${ArmorLayer}`
