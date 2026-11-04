import { describe, expect, it } from 'vitest'
import {
  createArmorInstance,
  resolveEffectiveArmorPiece,
} from './armorItemInstances'
import {
  buildProtectionSnapshot,
  createEquipmentState,
  EQUIPMENT_POSITIONS,
  EQUIPMENT_SLOTS,
  equippedBodyArmor,
  equippedInstanceId,
  NEUTRAL_EQUIPMENT_MODIFIERS,
  resolveEquipmentModifiers,
  resolveProtectionSnapshot,
  type WornArmorPiece,
} from './equipment'
import { Inventory } from './Inventory'
import { ITEM_CATALOG } from './itemCatalog'
import {
  ARMOR_KIND_LIST,
  ARMOR_QUALITY_LABELS,
  type ArmorKind,
  type ArmorQuality,
  isArmorQuality,
  normalizeArmorQuality,
} from './itemInstances'
import { ITEM_DEFS } from './items'

const PAULDRON_KINDS = [
  'leather_pauldron',
  'ranger_pauldron',
  'knight_pauldron_spike',
  'knight_pauldron_round',
] as const satisfies readonly ArmorKind[]

function inventoryWithArmor(
  ...pieces: { kind: ArmorKind, quality?: ArmorQuality }[]
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

describe('createEquipmentState', () => {
  it('equips an owned armor instance into its catalog slot', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
    expect(equipment.getPosition('body:outer')).toBe(ids[0])
  })

  it('rejects a non-armor instance', () => {
    const inventory = new Inventory({})
    const knife = { id: 'knife:1', kind: 'knife' as const, durability: 1, sharpness: 1 }
    inventory.addInstance(knife)
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip(knife.id, inventory)).toEqual({ ok: false, reason: 'not-wearable' })
    expect(equipment.getPosition('body:outer')).toBeNull()
  })

  it('rejects an armor instance not owned by inventory', () => {
    const inventory = new Inventory({})
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip('missing', inventory)).toEqual({ ok: false, reason: 'not-owned' })
    expect(equipment.getPosition('body:outer')).toBeNull()
  })

  it('equipping a second body item replaces the first', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' }, { kind: 'chainmail' })
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
    expect(equipment.equip(ids[1]!, inventory).ok).toBe(true)
    expect(equipment.getPosition('body:outer')).toBe(ids[1])
  })

  it('unequip clears only the requested slot', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    equipment.unequip('body:outer')
    expect(equipment.getPosition('body:outer')).toBeNull()
  })

  it('syncWithInventory clears a stale reference', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    inventory.removeInstance(ids[0]!)
    equipment.syncWithInventory(inventory)
    expect(equipment.getPosition('body:outer')).toBeNull()
  })

  it('restores a valid saved instance id', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'chainmail' })
    const equipment = createEquipmentState(inventory, { 'body:outer': ids[0] })
    expect(equipment.getPosition('body:outer')).toBe(ids[0])
  })

  it('restores empty when the saved instance is no longer owned', () => {
    const inventory = new Inventory({})
    const equipment = createEquipmentState(inventory, { 'body:outer': 'gone' })
    expect(equipment.getPosition('body:outer')).toBeNull()
  })

  it('same instance cannot occupy multiple slots after restore', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory, { 'body:outer': ids[0], 'head:outer': ids[0] })
    const live = EQUIPMENT_POSITIONS.filter((position) => equipment.getPosition(position) === ids[0])
    expect(live.length).toBe(1)
  })

  it('maps every pauldron kind onto the shoulders slot (plan items-player-039)', () => {
    for (const kind of PAULDRON_KINDS) {
      expect(ITEM_CATALOG[kind].armor?.slot).toBe('shoulders')
      const { inventory, ids } = inventoryWithArmor({ kind })
      const equipment = createEquipmentState(inventory)
      expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
      expect(equipment.getPosition('shoulders:outer')).toBe(ids[0])
      expect(equipment.getPosition('body:outer')).toBeNull()
    }
    expect(ARMOR_KIND_LIST).toEqual(expect.arrayContaining([...PAULDRON_KINDS]))
  })

  it('equipping a second shoulders item replaces the first and leaves body alone', () => {
    const { inventory, ids } = inventoryWithArmor(
      { kind: 'leather_armor' },
      { kind: 'leather_pauldron' },
      { kind: 'ranger_pauldron' },
    )
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
    expect(equipment.equip(ids[1]!, inventory).ok).toBe(true)
    expect(equipment.equip(ids[2]!, inventory).ok).toBe(true)
    expect(equipment.getPosition('body:outer')).toBe(ids[0])
    expect(equipment.getPosition('shoulders:outer')).toBe(ids[2])
    expect(equippedBodyArmor(equipment, inventory)).toBe('leather_armor')
    expect(equippedInstanceId(equipment, inventory, 'shoulders:outer')).toBe(ids[2])
  })

  it('restores a saved shoulders instance id', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'knight_pauldron_round' })
    const equipment = createEquipmentState(inventory, { 'shoulders:outer': ids[0] })
    expect(equipment.getPosition('shoulders:outer')).toBe(ids[0])
    expect(equippedInstanceId(equipment, inventory, 'shoulders:outer')).toBe(ids[0])
  })

  it('syncWithInventory clears a stale shoulders reference', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_pauldron' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    inventory.removeInstance(ids[0]!)
    equipment.syncWithInventory(inventory)
    expect(equipment.getPosition('shoulders:outer')).toBeNull()
    expect(equippedInstanceId(equipment, inventory, 'shoulders:outer')).toBeNull()
  })
})

describe('equippedBodyArmor / equippedInstanceId (no-ghost-equipment invariant)', () => {
  it('is null with nothing equipped', () => {
    const inventory = new Inventory({})
    const equipment = createEquipmentState(inventory)
    expect(equippedBodyArmor(equipment, inventory)).toBeNull()
    expect(equippedInstanceId(equipment, inventory, 'body:outer')).toBeNull()
  })

  it('reflects a valid owned selection', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    expect(equippedBodyArmor(equipment, inventory)).toBe('leather_armor')
    expect(equippedInstanceId(equipment, inventory, 'body:outer')).toBe(ids[0])
  })

  it('resolves to null the instant the item leaves inventory, even without syncWithInventory', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    inventory.removeInstance(ids[0]!)
    expect(equipment.getPosition('body:outer')).toBe(ids[0])
    expect(equippedBodyArmor(equipment, inventory)).toBeNull()
    expect(equippedInstanceId(equipment, inventory, 'body:outer')).toBeNull()
  })
})

/** Sum of every channel at every location — a monotone "more protection" measure for tests only. */
function protectionTotal(equipment: ReturnType<typeof createEquipmentState>, inventory: Inventory): number {
  const { protection } = resolveProtectionSnapshot(equipment, inventory)
  return Object.values(protection).reduce((sum, r) => sum + r.cut + r.pierce + r.blunt, 0)
}

describe('resolveEquipmentModifiers', () => {
  it('is all-neutral with nothing equipped', () => {
    const inventory = new Inventory({})
    const equipment = createEquipmentState(inventory)
    expect(resolveEquipmentModifiers(equipment, inventory)).toEqual(NEUTRAL_EQUIPMENT_MODIFIERS)
  })

  it('maps catalog armor values for a valid owned selection', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'chainmail' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    const modifiers = resolveEquipmentModifiers(equipment, inventory)
    expect(protectionTotal(equipment, inventory)).toBeGreaterThan(0)
    expect(modifiers.meleeStaminaMultiplier).toBeGreaterThan(1)
    expect(modifiers.meleeRecoveryMultiplier).toBeGreaterThan(1)
    expect(modifiers.movementSpeedMultiplier).toBeLessThan(1)
    expect(modifiers.sprintStaminaMultiplier).toBeGreaterThan(1)
  })

  it('never leaves a ghost bonus after the item stops being owned', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'chainmail' })
    const equipment = createEquipmentState(inventory)
    equipment.equip(ids[0]!, inventory)
    inventory.removeInstance(ids[0]!)
    expect(resolveEquipmentModifiers(equipment, inventory)).toEqual(NEUTRAL_EQUIPMENT_MODIFIERS)
  })

  it('chainmail trades more protection for more cost than leather', () => {
    const leather = inventoryWithArmor({ kind: 'leather_armor' })
    const leatherEquipment = createEquipmentState(leather.inventory)
    leatherEquipment.equip(leather.ids[0]!, leather.inventory)
    const leatherMods = resolveEquipmentModifiers(leatherEquipment, leather.inventory)

    const chainmail = inventoryWithArmor({ kind: 'chainmail' })
    const chainmailEquipment = createEquipmentState(chainmail.inventory)
    chainmailEquipment.equip(chainmail.ids[0]!, chainmail.inventory)
    const chainmailMods = resolveEquipmentModifiers(chainmailEquipment, chainmail.inventory)

    expect(protectionTotal(chainmailEquipment, chainmail.inventory)).toBeGreaterThan(protectionTotal(leatherEquipment, leather.inventory))
    expect(chainmailMods.movementSpeedMultiplier).toBeLessThan(leatherMods.movementSpeedMultiplier)
    expect(chainmailMods.meleeStaminaMultiplier).toBeGreaterThan(leatherMods.meleeStaminaMultiplier)
  })

  it('accepts poor as a quality and keeps legacy fallback at common', () => {
    expect(isArmorQuality('poor')).toBe(true)
    expect(ARMOR_QUALITY_LABELS.poor).toBe('Kiepska')
    expect(normalizeArmorQuality(undefined)).toBe('common')
    expect(normalizeArmorQuality('legendary')).toBe('common')
    expect(createArmorInstance('leather_armor').quality).toBe('common')
  })

  it('higher quality improves protection and reduces penalties vs common', () => {
    const common = inventoryWithArmor({ kind: 'chainmail', quality: 'common' })
    const masterwork = inventoryWithArmor({ kind: 'chainmail', quality: 'masterwork' })
    const commonEq = createEquipmentState(common.inventory)
    const mwEq = createEquipmentState(masterwork.inventory)
    commonEq.equip(common.ids[0]!, common.inventory)
    mwEq.equip(masterwork.ids[0]!, masterwork.inventory)
    const c = resolveEquipmentModifiers(commonEq, common.inventory)
    const m = resolveEquipmentModifiers(mwEq, masterwork.inventory)
    expect(protectionTotal(mwEq, masterwork.inventory)).toBeGreaterThan(protectionTotal(commonEq, common.inventory))
    expect(m.meleeStaminaMultiplier).toBeLessThan(c.meleeStaminaMultiplier)
    expect(m.movementSpeedMultiplier).toBeGreaterThan(c.movementSpeedMultiplier)
    expect(masterwork.inventory.totalWeight()).toBeLessThan(common.inventory.totalWeight())
  })

  it('poor quality is worse than common for protection, weight and restrictions', () => {
    const qualities: ArmorQuality[] = ['poor', 'common', 'good', 'masterwork']
    const pieces = qualities.map((quality) => {
      const equipped = inventoryWithArmor({ kind: 'chainmail', quality })
      const state = createEquipmentState(equipped.inventory)
      state.equip(equipped.ids[0]!, equipped.inventory)
      return {
        quality,
        protection: protectionTotal(state, equipped.inventory),
        weight: equipped.inventory.totalWeight(),
        piece: resolveEffectiveArmorPiece(
          ITEM_CATALOG.chainmail.armor!,
          quality,
          ITEM_DEFS.chainmail.weight,
        ),
      }
    })
    for (let i = 0; i < pieces.length - 1; i++) {
      const lower = pieces[i]!
      const higher = pieces[i + 1]!
      expect(lower.protection).toBeLessThan(higher.protection)
      expect(lower.weight).toBeGreaterThan(higher.weight)
      expect(lower.piece.staminaCostMultiplier).toBeGreaterThan(higher.piece.staminaCostMultiplier)
      expect(lower.piece.movementSpeedMultiplier).toBeLessThan(higher.piece.movementSpeedMultiplier)
    }
  })

  it('quality penalty transform moves >1 and <1 multipliers symmetrically around 1', () => {
    const base = ITEM_CATALOG.chainmail.armor!
    const common = resolveEffectiveArmorPiece(base, 'common', ITEM_DEFS.chainmail.weight)
    const poor = resolveEffectiveArmorPiece(base, 'poor', ITEM_DEFS.chainmail.weight)
    const good = resolveEffectiveArmorPiece(base, 'good', ITEM_DEFS.chainmail.weight)
    expect(common.staminaCostMultiplier).toBe(base.staminaCostMultiplier)
    expect(common.movementSpeedMultiplier).toBe(base.movementSpeedMultiplier)
    expect(poor.staminaCostMultiplier).toBeGreaterThan(common.staminaCostMultiplier)
    expect(good.staminaCostMultiplier).toBeLessThan(common.staminaCostMultiplier)
    expect(poor.movementSpeedMultiplier).toBeLessThan(common.movementSpeedMultiplier)
    expect(good.movementSpeedMultiplier).toBeGreaterThan(common.movementSpeedMultiplier)
  })

  it('restriction clamps are armor-only and typed resist composes per slot only', () => {
    const base = ITEM_CATALOG.chainmail.armor!
    const piece = resolveEffectiveArmorPiece(base, 'common', ITEM_DEFS.chainmail.weight)
    const pieces: WornArmorPiece[] = EQUIPMENT_POSITIONS.map((position) => ({
      ...piece,
      slot: position.split(':')[0] as WornArmorPiece['slot'],
      layer: position.split(':')[1] as WornArmorPiece['layer'],
      position,
      instanceId: position,
    }))
    const snap = buildProtectionSnapshot(pieces)
    expect(snap.restrictions.meleeStaminaMultiplier).toBe(1.8)
    expect(snap.restrictions.meleeRecoveryMultiplier).toBe(1.5)
    expect(snap.restrictions.movementSpeedMultiplier).toBe(0.75)
    expect(snap.restrictions.sprintStaminaMultiplier).toBe(2)
    expect(snap.protection.head.cut).toBeCloseTo(1 - (1 - 0.65) ** 2)
    // Duplicate position is ignored; empty is neutral.
    expect(buildProtectionSnapshot([pieces[1]!, pieces[1]!]).pieces).toHaveLength(1)
    expect(buildProtectionSnapshot([]).restrictions).toBe(NEUTRAL_EQUIPMENT_MODIFIERS)
  })

  it('under and outer coexist via position keys; equip is atomic on failure', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'leather_armor' }, { kind: 'chainmail' })
    const equipment = createEquipmentState(inventory)
    expect(equipment.equip(ids[0]!, inventory)).toEqual({ ok: true, position: 'body:outer', replacedId: null })
    const rev = equipment.selectionRevision
    expect(equipment.equip('nope', inventory).ok).toBe(false)
    expect(equipment.selectionRevision).toBe(rev)
    expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
    expect(equipment.selectionRevision).toBe(rev)
    expect(equipment.equip(ids[1]!, inventory)).toMatchObject({ ok: true, replacedId: ids[0] })
    expect(equipment.selectionRevision).toBe(rev + 1)
    expect(inventory.getInstance(ids[0]!)).not.toBeNull()
  })

  it('every catalog armor kind has a layer and 3-channel resist within [0,1)', () => {
    for (const kind of ARMOR_KIND_LIST) {
      const armor = ITEM_CATALOG[kind].armor
      if (!armor) continue
      expect(['under', 'outer']).toContain(armor.layer)
      for (const v of Object.values(armor.resist)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThan(1)
      }
    }
  })

  it('applies ordinary quality tuning to pauldron stats without special cases', () => {
    const common = inventoryWithArmor({ kind: 'knight_pauldron_round', quality: 'common' })
    const masterwork = inventoryWithArmor({ kind: 'knight_pauldron_round', quality: 'masterwork' })
    const commonEq = createEquipmentState(common.inventory)
    const mwEq = createEquipmentState(masterwork.inventory)
    commonEq.equip(common.ids[0]!, common.inventory)
    mwEq.equip(masterwork.ids[0]!, masterwork.inventory)
    const c = resolveEquipmentModifiers(commonEq, common.inventory)
    const m = resolveEquipmentModifiers(mwEq, masterwork.inventory)
    expect(protectionTotal(mwEq, masterwork.inventory)).toBeGreaterThan(protectionTotal(commonEq, common.inventory))
    expect(m.meleeStaminaMultiplier).toBeLessThan(c.meleeStaminaMultiplier)
    expect(masterwork.inventory.totalWeight()).toBeLessThan(common.inventory.totalWeight())
  })
})


describe('044-M independent shoulders and forearms', () => {
  it('composes both pieces, replaces only the same slot and never changes inventory', () => {
    const { inventory, ids } = inventoryWithArmor({ kind: 'ranger_pauldron' }, { kind: 'leather_bracers' }, { kind: 'steel_bracers', quality: 'good' })
    const equipment = createEquipmentState(inventory)
    const before = ids.map(id => inventory.getInstance(id))
    expect(EQUIPMENT_SLOTS).toEqual(['head', 'body', 'shoulders', 'forearms', 'hands', 'legs', 'feet'])
    expect(equipment.equip(ids[0]!, inventory).ok).toBe(true)
    expect(equipment.equip(ids[1]!, inventory).ok).toBe(true)
    expect(resolveProtectionSnapshot(equipment, inventory).protection.forearms.cut).toBeCloseTo(.35)
    expect(equipment.equip(ids[2]!, inventory)).toEqual({ ok: true, position: 'forearms:outer', replacedId: ids[1] })
    expect(equipment.getPosition('shoulders:outer')).toBe(ids[0])
    expect(equipment.getPosition('forearms:outer')).toBe(ids[2])
    expect(resolveProtectionSnapshot(equipment, inventory).protection.forearms.pierce).toBeCloseTo(.38 * 1.1)
    const restored = createEquipmentState(inventory, equipment.exportState(inventory))
    expect(restored.exportState(inventory)).toEqual({ 'shoulders:outer': ids[0], 'forearms:outer': ids[2] })
    equipment.unequip('shoulders:outer')
    expect(equipment.getPosition('forearms:outer')).toBe(ids[2])
    expect(ids.map(id => inventory.getInstance(id))).toEqual(before)
  })
})
