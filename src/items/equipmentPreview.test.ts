import { describe, expect, it } from 'vitest'
import type { ArmorQuality } from './itemInstances'
import { expectedProtection } from '../combat/hitLocation'
import { equipmentSnapshotToCharacterView } from '../player/characterPresentation'
import { createArmorInstance } from './armorItemInstances'
import { createEquipmentState, rangedStaminaMultiplierFor, resolveProtectionSnapshot } from './equipment'
import {
  type ArmorPreviewInstance,
  previewEquipLoadout,
  previewEquipLoadoutFromSnapshot,
} from './equipmentPreview'
import { Inventory } from './Inventory'
import { itemDisplayName } from './itemDisplay'
import { createWeaponInstance } from './weaponMaintenance'

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
    expect(preview.targetPosition).toBe('shoulders:outer')
    expect(preview.replacesLabel).toBeNull()
    expect(preview.proposed!.expectedProtection.cut).toBeGreaterThan(0)
    expect(preview.context).toContain('pusta')
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
    const after = resolveProtectionSnapshot(equipment, inventory)
    const afterView = equipmentSnapshotToCharacterView(after)
    for (const channel of ['cut', 'pierce', 'blunt'] as const) {
      expect(preview.proposed!.expectedProtection[channel]).toBeCloseTo(afterView.expectedProtection[channel], 8)
    }
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
    expect(preview.unavailableReason).toContain('niedostępny')
    expect(preview.context).toBe(preview.unavailableReason)
    expect(preview.targetPosition).toBeNull()
    void ids
  })

  it('marks a non-armor candidate unavailable with a reason', () => {
    const { inventory } = inventoryWithArmor({ kind: 'leather_armor' })
    const axe = createWeaponInstance('axe')
    inventory.addInstance(axe)
    expect(previewEquipLoadout(inventory, {}, axe.id).unavailableReason).toContain('nie jest elementem pancerza')
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
    expect(fromSnap.proposed!.expectedProtection.pierce).toBeCloseTo(fromInv.proposed!.expectedProtection.pierce, 8)
    expect(fromSnap.delta!.gearWeightKg).toBeCloseTo(fromInv.delta!.gearWeightKg, 8)
    void inventory
    void ids
  })
})

describe('layered preview (ui-input-048)', () => {
  const KIT = ['padded_jacket', 'chainmail', 'leather_trousers'] as const

  function layeredInventory() {
    const inventory = new Inventory({}, Infinity, undefined, undefined, Infinity)
    const ids = KIT.map((kind) => {
      const inst = createArmorInstance(kind, 'common')
      expect(inventory.addInstance(inst)).toBe(true)
      return inst.id
    })
    return { inventory, ids }
  }

  it('replaces only the exact position and keeps the other layer of the slot', () => {
    const { inventory, ids } = layeredInventory()
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    const slots = equipment.exportState(inventory)

    const preview = previewEquipLoadout(inventory, slots, ids[1]!)
    expect(preview.targetPosition).toBe('body:outer')
    expect(preview.replacesLabel).toBeNull()
    expect(preview.context).toBe('Założenie: Tułów · Wierzch (pusta pozycja)')
    // mail over padding: the composed local torso value, not the mail alone
    expect(preview.proposed!.protection.body.cut).toBeCloseTo(0.72, 3)
    expect(preview.proposed!.protection.body.cut).toBeGreaterThan(0.65)
  })

  it('names the displaced item for an occupied position', () => {
    const { inventory, ids } = layeredInventory()
    const second = createArmorInstance('leather_armor', 'common')
    inventory.addInstance(second)
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[1]!, inventory)
    const preview = previewEquipLoadout(inventory, equipment.exportState(inventory), second.id)
    expect(preview.replacesLabel).toBe(itemDisplayName('chainmail'))
    expect(preview.context).toBe(`Zastępuje (Tułów · Wierzch): ${itemDisplayName('chainmail')}`)
  })

  it('preview equals the stats after really equipping (inventory and snapshot variants)', () => {
    const { inventory, ids } = layeredInventory()
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    equipment.equip(ids[2]!, inventory)
    const slots = equipment.exportState(inventory)

    const preview = previewEquipLoadout(inventory, slots, ids[1]!)
    const fromSnapshot = previewEquipLoadoutFromSnapshot(slots, snapshotFromInventory(inventory, ids), ids[1]!)
    expect(fromSnapshot.proposed).toEqual(preview.proposed)
    expect(fromSnapshot.delta).toEqual(preview.delta)

    expect(equipment.equip(ids[1]!, inventory).ok).toBe(true)
    const snapshot = resolveProtectionSnapshot(equipment, inventory)
    expect(preview.proposed!.protection).toEqual(snapshot.protection)
    expect(preview.proposed!.expectedProtection).toEqual(expectedProtection(snapshot.protection))
    expect(preview.proposed!.expectedByProfile['low-bite']).toEqual(expectedProtection(snapshot.protection, 'low-bite'))
    expect(preview.proposed!.attackStaminaDelta).toBeCloseTo(snapshot.restrictions.meleeStaminaMultiplier - 1, 9)
    expect(preview.proposed!.rangedStaminaDelta).toBeCloseTo(rangedStaminaMultiplierFor(snapshot.restrictions.meleeStaminaMultiplier) - 1, 9)
    expect(preview.proposed!.movementSpeedDelta).toBeCloseTo(snapshot.restrictions.movementSpeedMultiplier - 1, 9)
    expect(preview.proposed!.gearWeightKg).toBeCloseTo(snapshot.pieces.reduce((sum, p) => sum + p.weightKg, 0), 9)
    // delta is exactly proposed - current per region and channel
    expect(preview.delta!.protection.body.cut).toBeCloseTo(preview.proposed!.protection.body.cut - preview.current.protection.body.cut, 9)
  })
})
