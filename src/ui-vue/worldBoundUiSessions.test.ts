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
})
