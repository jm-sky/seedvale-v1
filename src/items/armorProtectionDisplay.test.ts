import { describe, expect, it } from 'vitest'
import { expectedProtection } from '../combat/hitLocation'
import { equipmentSnapshotToCharacterView } from '../player/characterPresentation'
import { createArmorInstance } from './armorItemInstances'
import {
  expectedProtectionByProfile,
  formatArmorCoverage,
  formatChannelResistance,
  formatResistanceLabel,
  PROTECTION_PROFILE_KEYS,
  ZERO_PROTECTION_VIEW,
} from './armorProtectionDisplay'
import { createEquipmentState, equipmentPositionLabel, resolveProtectionSnapshot } from './equipment'
import { previewEquipLoadout } from './equipmentPreview'
import { Inventory } from './Inventory'

const FULL_MAIL_KIT = [
  'chainmail', 'ranger_pauldron', 'leather_bracers', 'leather_gloves', 'leather_trousers', 'leather_boots', 'iron_helm',
  'padded_cap', 'padded_jacket', 'padded_hose',
] as const

function wornKit() {
  const inventory = new Inventory({}, Infinity, undefined, undefined, Infinity)
  const equipment = createEquipmentState(inventory)
  for (const kind of FULL_MAIL_KIT) {
    const instance = createArmorInstance(kind, 'common')
    inventory.addInstance(instance)
    expect(equipment.equip(instance.id, inventory).ok).toBe(true)
  }
  return { inventory, equipment, snapshot: resolveProtectionSnapshot(equipment, inventory) }
}

describe('expected protection presentation (066 catalog fixtures)', () => {
  const { snapshot } = wornKit()
  const percent = (r: { cut: number, pierce: number, blunt: number }) => [r.cut, r.pierce, r.blunt].map((v) => v * 100)

  it('reference profile equals the 066 full-mail-kit numbers', () => {
    const view = equipmentSnapshotToCharacterView(snapshot)
    expect(percent(view.expectedByProfile.reference)).toEqual([
      expect.closeTo(50.18, 2), expect.closeTo(31.605, 2), expect.closeTo(26.9875, 2),
    ])
    expect(percent(view.expectedProtection)).toEqual(percent(view.expectedByProfile.reference))
  })

  it('low-bite profile equals the 066 numbers; every switchable profile uses the shared helper', () => {
    const byProfile = expectedProtectionByProfile(snapshot.protection)
    expect(percent(byProfile['low-bite'])).toEqual([
      expect.closeTo(42.3925, 2), expect.closeTo(24.415, 2), expect.closeTo(23.9425, 2),
    ])
    for (const key of PROTECTION_PROFILE_KEYS) expect(byProfile[key]).toEqual(expectedProtection(snapshot.protection, key))
  })

  it('a loadout preview from nothing reports the same numbers as the final worn kit', () => {
    const { inventory, equipment } = wornKit()
    const last = createArmorInstance('steel_bracers', 'common')
    inventory.addInstance(last)
    const preview = previewEquipLoadout(inventory, equipment.exportState(inventory), last.id)
    equipment.equip(last.id, inventory)
    const after = equipmentSnapshotToCharacterView(resolveProtectionSnapshot(equipment, inventory))
    expect(preview.proposed!.expectedByProfile).toEqual(after.expectedByProfile)
  })

  it('zero table is all-zero for the nothing-worn state', () => {
    expect(expectedProtectionByProfile(ZERO_PROTECTION_VIEW).reference).toEqual({ cut: 0, pierce: 0, blunt: 0 })
  })
})

describe('labels', () => {
  it('qualifies local resistance with its coverage and layer', () => {
    expect(formatArmorCoverage('body', 'outer')).toBe('tylko tułów · wierzch')
    expect(formatChannelResistance({ cut: 0.35, pierce: 0.2, blunt: 0.1 }, 'cut', 'body', 'outer')).toBe('35% — tylko tułów · wierzch')
    expect(formatResistanceLabel({ cut: 0.35, pierce: 0.45, blunt: 0.15 }, { slot: 'legs', layer: 'under' }))
      .toBe('cięcie 35% · kłucie 45% · obuch 15% (tylko nogi · spód)')
    expect(equipmentPositionLabel('shoulders:under')).toBe('Naramienniki · Spód')
  })
})
