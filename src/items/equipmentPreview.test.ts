import { describe, expect, it } from 'vitest'
import type { ArmorQuality } from './itemInstances'
import { equipmentModifiersToCharacterView } from '../player/characterPresentation'
import { createArmorInstance } from './armorItemInstances'
import { createEquipmentState, resolveEquipmentModifiers } from './equipment'
import {
  type ArmorPreviewInstance,
  previewEquipLoadout,
  previewEquipLoadoutFromSnapshot,
} from './equipmentPreview'
import { Inventory } from './Inventory'
import { itemDisplayName } from './itemDisplay'

function inventoryWithArmor(
  ...pieces: { kind: 'leather_armor' | 'chainmail' | 'leather_pauldron', quality?: ArmorQuality }[]
): { inventory: Inventory, ids: string[] } {
  const inventory = new Inventory({})
  const ids: string[] = []
  for (const piece of pieces) {
    const inst = createArmorInstance(piece.kind, piece.quality ?? 'common')
    expect(inventory.addInstance(inst)).toBe(true)
    ids.push(inst.id)
  }
  return { inventory, ids }
}

function snapshotFromInventory(inventory: Inventory, ids: string[]): ArmorPreviewInstance[] {
  return ids.map((id) => {
    const inst = inventory.getInstance(id)!
    return {
      id,
      kind: inst.kind,
      quality: 'quality' in inst ? (inst as { quality: ArmorQuality }).quality : 'common',
      label: itemDisplayName(inst.kind),
    }
  })
}

describe('previewEquipLoadout', () => {
  it('does not mutate inventory or source equipment slots when previewing', () => {
    const { inventory, ids } = inventoryWithArmor(
      { kind: 'leather_armor', quality: 'common' },
      { kind: 'chainmail', quality: 'good' },
    )
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    const slotsBefore = equipment.exportState(inventory)
    const weightBefore = inventory.totalWeight()
    const idsBefore = ids.map((id) => inventory.getInstance(id)?.id ?? null)

    const preview = previewEquipLoadout(inventory, slotsBefore, ids[1]!)
    expect(preview.proposed).not.toBeNull()
    expect(preview.delta).not.toBeNull()
    expect(equipment.exportState(inventory)).toEqual(slotsBefore)
    expect(inventory.totalWeight()).toBe(weightBefore)
    expect(ids.map((id) => inventory.getInstance(id)?.id ?? null)).toEqual(idsBefore)
  })

  it('previews empty slot equip', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_pauldron' })
    const preview = previewEquipLoadout(inventory, {}, ids[0]!)
    expect(preview.alreadyEquipped).toBe(false)
    expect(preview.targetSlot).toBe('arms')
    expect(preview.replacesLabel).toBeNull()
    expect(preview.proposed!.damageReduction).toBeGreaterThan(0)
    expect(preview.context).toContain('pusty')
  })

  it('previews replacing same slot and agrees with real equip', () => {
    const { inventory, ids } = inventoryWithArmor(
      { kind: 'leather_armor', quality: 'common' },
      { kind: 'chainmail', quality: 'masterwork' },
    )
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    const slots = equipment.exportState(inventory)

    const preview = previewEquipLoadout(inventory, slots, ids[1]!)
    expect(preview.replacesLabel).toBe(itemDisplayName('leather_armor'))
    expect(preview.proposed).not.toBeNull()

    equipment.equip(ids[1]!, inventory)
    const after = resolveEquipmentModifiers(equipment, inventory)
    const afterView = equipmentModifiersToCharacterView(after)
    expect(preview.proposed!.damageReduction).toBeCloseTo(afterView.damageReduction, 8)
    expect(preview.proposed!.attackStaminaDelta).toBeCloseTo(afterView.attackStaminaDelta, 8)
    expect(preview.proposed!.movementSpeedDelta).toBeCloseTo(afterView.movementSpeedDelta, 8)
  })

  it('marks already worn without proposed delta', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    const preview = previewEquipLoadout(inventory, equipment.exportState(inventory), ids[0]!)
    expect(preview.alreadyEquipped).toBe(true)
    expect(preview.proposed).toBeNull()
    expect(preview.context).toBe('Już założone')
  })

  it('clears preview for missing/stale id', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const preview = previewEquipLoadout(inventory, {}, 'missing-id')
    expect(preview.proposed).toBeNull()
    expect(preview.context).toBe('—')
    void ids
  })

  it('snapshot helper matches inventory helper for quality difference', () => {
    const { inventory, ids } = inventoryWithArmor(
      { kind: 'leather_armor', quality: 'poor' },
      { kind: 'leather_armor', quality: 'masterwork' },
    )
    // Two body pieces: equip poor, preview masterwork (second id after first equip semantics — both body).
    // Use distinct kinds for slot clarity.
    const a = inventoryWithArmor(
      { kind: 'leather_armor', quality: 'poor' },
      { kind: 'chainmail', quality: 'masterwork' },
    )
    const equipment = createEquipmentState(a.inventory)
    equipment.equip(a.ids[0]!, a.inventory)
    const slots = equipment.exportState(a.inventory)
    const fromInv = previewEquipLoadout(a.inventory, slots, a.ids[1]!)
    const fromSnap = previewEquipLoadoutFromSnapshot(
      slots,
      snapshotFromInventory(a.inventory, a.ids),
      a.ids[1]!,
    )
    expect(fromSnap.proposed!.damageReduction).toBeCloseTo(fromInv.proposed!.damageReduction, 8)
    expect(fromSnap.delta!.gearWeightKg).toBeCloseTo(fromInv.delta!.gearWeightKg, 8)
    void inventory
    void ids
  })
})
