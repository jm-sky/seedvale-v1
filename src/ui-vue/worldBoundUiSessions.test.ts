import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  closeFlavorDialog,
  configureFlavorDialog,
  invalidateWorldBoundUiSessions,
  openActionConfirm,
  openFlavorDialog,
  openQuantityDialog,
  ui,
} from './store'

function openInventoryStub(): void {
  ui.inventory.open = true
  ui.inventory.onDrop = () => {}
  ui.inventory.onConsume = () => {}
  ui.inventory.onThrow = () => {}
  ui.inventory.onRead = () => {}
  ui.inventory.onPlaceTrap = () => {}
  ui.inventory.onSharpen = () => 'ok' as const
  ui.inventory.onPlaceContainer = () => {}
  ui.inventory.onPlaceTent = () => {}
  ui.inventory.onSetPrimaryMelee = () => {}
  ui.inventory.onSetPrimaryRanged = () => {}
  ui.inventory.onEquip = () => {}
  ui.inventory.onUnequip = () => {}
  ui.inventory.onEquipArmor = () => {}
  ui.inventory.onUnequipArmor = () => {}
  ui.inventory.onSellInstances = () => 'ok' as const
}

describe('invalidateWorldBoundUiSessions (plan ui-input-031)', () => {
  const onClose = vi.fn()
  const onConfirm = vi.fn()

  afterEach(() => {
    invalidateWorldBoundUiSessions()
    configureFlavorDialog({})
    onClose.mockClear()
    onConfirm.mockClear()
  })

  it('clears world-bound refs without running decline/confirm/close callbacks', () => {
    configureFlavorDialog({ onClose })
    openFlavorDialog('Title', 'Line', [{ label: 'Act', enabled: true, reasonLabel: '', run: onConfirm }])
    openActionConfirm('Sure?', 'Body', onConfirm)
    openQuantityDialog('Amount', 3, onConfirm)

    invalidateWorldBoundUiSessions()
    invalidateWorldBoundUiSessions()

    expect(ui.flavorDialog.open).toBe(false)
    expect(ui.flavorDialog.actions).toEqual([])
    expect(ui.actionConfirm.onConfirm).toBeNull()
    expect(ui.quantityDialog.onConfirm).toBeNull()
    expect(onClose).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('does not reopen flavor after invalidation when closeFlavorDialog would have side effects', () => {
    configureFlavorDialog({ onClose })
    openFlavorDialog('Title', 'Line')
    invalidateWorldBoundUiSessions()
    closeFlavorDialog()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes inventory and clears all inventory callbacks on world-bound invalidation', () => {
    openInventoryStub()
    openQuantityDialog('Amount', 3, onConfirm)
    invalidateWorldBoundUiSessions()
    expect(ui.inventory.open).toBe(false)
    expect(ui.inventory.onDrop).toBeNull()
    expect(ui.inventory.onConsume).toBeNull()
    expect(ui.inventory.onThrow).toBeNull()
    expect(ui.inventory.onRead).toBeNull()
    expect(ui.inventory.onPlaceTrap).toBeNull()
    expect(ui.inventory.onSharpen).toBeNull()
    expect(ui.inventory.onPlaceContainer).toBeNull()
    expect(ui.inventory.onPlaceTent).toBeNull()
    expect(ui.inventory.onSetPrimaryMelee).toBeNull()
    expect(ui.inventory.onSetPrimaryRanged).toBeNull()
    expect(ui.inventory.onEquip).toBeNull()
    expect(ui.inventory.onSellInstances).toBeNull()
    expect(ui.quantityDialog.onConfirm).toBeNull()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
