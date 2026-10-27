import { describe, expect, it, vi } from 'vitest'
import { createHeldTool } from '../items/HeldTool'
import { Inventory } from '../items/Inventory'
import { createPrimaryWeaponSelection } from '../items/primaryWeapons'
import { createWeaponInstance } from '../items/weaponMaintenance'

/**
 * Focused D2(c) guard: explicit stale/mismatched IDs must not extinguish torch
 * or fall through HeldTool sibling resolution.
 */
describe('equipTool explicit-ID guard', () => {
  it('rejects mismatched explicit ID before torch extinguish', () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    const a = createWeaponInstance('knife')
    const b = createWeaponInstance('knife')
    inventory.addInstance(a)
    inventory.addInstance(b)

    const heldTool = createHeldTool(inventory)
    const primaryWeapons = createPrimaryWeaponSelection()
    const extinguish = vi.fn()
    const playerTorch = {
      isLit: () => true,
      extinguish,
      setCarryMode: vi.fn(),
    }

    // Inline the same guard used by inventoryWiring.equipTool
    const equipTool = (kind: typeof a.kind, instanceId?: string): void => {
      if (instanceId != null) {
        const owned = inventory.getInstance(instanceId)
        if (!owned || owned.kind !== kind) return
      }
      if (playerTorch.isLit()) playerTorch.extinguish()
      if (!heldTool.equip(kind, instanceId)) return
      primaryWeapons.noteEquipped(kind, heldTool.heldInstanceId())
    }

    equipTool('knife', 'missing-id')
    expect(extinguish).not.toHaveBeenCalled()
    expect(heldTool.held()).toBeNull()

    equipTool('axe', a.id)
    expect(extinguish).not.toHaveBeenCalled()
    expect(heldTool.held()).toBeNull()

    equipTool('knife', a.id)
    expect(extinguish).toHaveBeenCalledOnce()
    expect(heldTool.held()).toBe('knife')
    expect(heldTool.heldInstanceId()).toBe(a.id)
  })

  it('preserves legacy no-ID equip (may resolve first instance)', () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    inventory.addInstance(createWeaponInstance('knife'))
    const heldTool = createHeldTool(inventory)
    const primaryWeapons = createPrimaryWeaponSelection()
    const equipTool = (kind: 'knife', instanceId?: string): void => {
      if (instanceId != null) {
        const owned = inventory.getInstance(instanceId)
        if (!owned || owned.kind !== kind) return
      }
      if (!heldTool.equip(kind, instanceId)) return
      primaryWeapons.noteEquipped(kind, heldTool.heldInstanceId())
    }
    expect(equipTool('knife')).toBeUndefined()
    expect(heldTool.held()).toBe('knife')
  })
})
