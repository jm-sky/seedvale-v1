import { describe, expect, it } from 'vitest'
import { expectedProtection } from '../combat/hitLocation'
import { createArmorInstance } from './armorItemInstances'
import { createEquipmentState, rangedStaminaMultiplierFor, resolveArmorInstanceEffective, resolveProtectionSnapshot } from './equipment'
import { equipmentPositionKey } from './equipmentTypes'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { ITEM_CATALOG } from './itemCatalog'
import { ARMOR_KIND_LIST, ARMOR_QUALITIES, type ArmorKind, type ArmorQuality, isArmorItemInstance, isInstanceBackedKind } from './itemInstances'
import { ITEM_DEFS } from './items'
import { MERCHANT_PRICES, MERCHANT_STOCK } from './tradeCatalog'

/** Plan items-player-066 slice A — proposal §5.1 table, binding. */
type Row = {
  slot: string
  layer: 'under' | 'outer'
  resist: [number, number, number]
  mass: number
  price: number
  restrictions: [number, number, number, number]
}
const LIGHT: Row['restrictions'] = [1, 1, 1, 1]
const TABLE: Record<ArmorKind, Row> = {
  leather_armor: { slot: 'body', layer: 'outer', resist: [0.35, 0.22, 0.18], mass: 3.5, price: 65, restrictions: [1.08, 1.06, 0.97, 1.12] },
  chainmail: { slot: 'body', layer: 'outer', resist: [0.65, 0.45, 0.15], mass: 9, price: 150, restrictions: [1.2, 1.15, 0.94, 1.25] },
  leather_pauldron: { slot: 'shoulders', layer: 'outer', resist: [0.25, 0.15, 0.12], mass: 0.7, price: 25, restrictions: LIGHT },
  ranger_pauldron: { slot: 'shoulders', layer: 'outer', resist: [0.35, 0.22, 0.16], mass: 1, price: 40, restrictions: [1.02, 1.02, 1, 1.04] },
  knight_pauldron_spike: { slot: 'shoulders', layer: 'outer', resist: [0.6, 0.42, 0.25], mass: 1.8, price: 70, restrictions: [1.03, 1.02, 0.995, 1.04] },
  knight_pauldron_round: { slot: 'shoulders', layer: 'outer', resist: [0.65, 0.45, 0.3], mass: 2.1, price: 85, restrictions: [1.03, 1.02, 0.995, 1.04] },
  padded_cap: { slot: 'head', layer: 'under', resist: [0.15, 0.05, 0.2], mass: 0.3, price: 8, restrictions: LIGHT },
  padded_jacket: { slot: 'body', layer: 'under', resist: [0.2, 0.1, 0.25], mass: 3, price: 30, restrictions: [1.04, 1.03, 0.99, 1.05] },
  padded_hose: { slot: 'legs', layer: 'under', resist: [0.15, 0.05, 0.2], mass: 1.4, price: 18, restrictions: [1.01, 1.01, 0.99, 1.03] },
  iron_helm: { slot: 'head', layer: 'outer', resist: [0.65, 0.45, 0.25], mass: 2.2, price: 80, restrictions: [1.02, 1.01, 0.99, 1.03] },
  leather_bracers: { slot: 'forearms', layer: 'outer', resist: [0.35, 0.2, 0.1], mass: 0.5, price: 20, restrictions: LIGHT },
  steel_bracers: { slot: 'forearms', layer: 'outer', resist: [0.55, 0.38, 0.22], mass: 1, price: 45, restrictions: [1.03, 1.02, 0.995, 1.04] },
  leather_gloves: { slot: 'hands', layer: 'outer', resist: [0.2, 0.1, 0.1], mass: 0.3, price: 10, restrictions: LIGHT },
  leather_trousers: { slot: 'legs', layer: 'outer', resist: [0.25, 0.1, 0.1], mass: 1.8, price: 22, restrictions: [1.01, 1.01, 0.99, 1.03] },
  leather_boots: { slot: 'feet', layer: 'outer', resist: [0.2, 0.1, 0.1], mass: 1.2, price: 18, restrictions: LIGHT },
}

const NEW_KINDS = ['padded_cap', 'padded_jacket', 'padded_hose', 'iron_helm', 'leather_gloves', 'leather_trousers', 'leather_boots'] as const satisfies readonly ArmorKind[]

describe('066 A layered armor catalogue (proposal §5.1)', () => {
  it('registers exactly the fifteen first-batch kinds as instance-backed armor', () => {
    expect([...ARMOR_KIND_LIST].sort()).toEqual(Object.keys(TABLE).sort())
    for (const kind of ARMOR_KIND_LIST) {
      expect(isInstanceBackedKind(kind)).toBe(true)
      expect(ITEM_DEFS[kind].categories).toContain('armor')
      expect(MERCHANT_STOCK).toContain(kind)
    }
  })

  it.each(Object.entries(TABLE))('%s matches its authored row (layer, resist, restrictions, mass, price)', (kind, row) => {
    const armor = ITEM_CATALOG[kind as ArmorKind].armor!
    expect(armor.slot).toBe(row.slot)
    expect(armor.layer).toBe(row.layer)
    expect([armor.resist.cut, armor.resist.pierce, armor.resist.blunt]).toEqual(row.resist)
    expect([
      armor.staminaCostMultiplier ?? 1,
      armor.meleeRecoveryMultiplier ?? 1,
      armor.movementSpeedMultiplier ?? 1,
      armor.sprintStaminaMultiplier ?? 1,
    ]).toEqual(row.restrictions)
    expect(ITEM_DEFS[kind as ArmorKind].weight).toBe(row.mass)
    expect(MERCHANT_PRICES[kind as ArmorKind]).toBe(row.price)
    expect(ITEM_CATALOG[kind as ArmorKind].spawn).toBe('none')
    expect(armor).not.toHaveProperty('damageReduction')
  })

  it('creates a common-quality instance per new kind with a catalog position', () => {
    for (const kind of NEW_KINDS) {
      const instance = createArmorInstance(kind)
      expect(isArmorItemInstance(instance)).toBe(true)
      expect(instance.quality).toBe('common')
      const inventory = new Inventory({})
      expect(inventory.addInstance(instance)).toBe(true)
      const equipment = createEquipmentState(inventory)
      expect(equipment.equip(instance.id, inventory).ok).toBe(true)
      const row = TABLE[kind]
      expect(equipment.getPosition(equipmentPositionKey(row.slot as never, row.layer))).toBe(instance.id)
    }
  })

  it('higher quality never worsens protection or restriction costs (every kind)', () => {
    for (const kind of ARMOR_KIND_LIST) {
      let previous: ReturnType<typeof resolveArmorInstanceEffective> = null
      for (const quality of ARMOR_QUALITIES) {
        const effective = resolveArmorInstanceEffective(createArmorInstance(kind, quality))!
        if (previous) {
          for (const channel of ['cut', 'pierce', 'blunt'] as const) expect(effective.resist[channel]).toBeGreaterThanOrEqual(previous.resist[channel])
          expect(effective.staminaCostMultiplier).toBeLessThanOrEqual(previous.staminaCostMultiplier)
          expect(effective.meleeRecoveryMultiplier).toBeLessThanOrEqual(previous.meleeRecoveryMultiplier)
          expect(effective.movementSpeedMultiplier).toBeGreaterThanOrEqual(previous.movementSpeedMultiplier)
          expect(effective.sprintStaminaMultiplier).toBeLessThanOrEqual(previous.sprintStaminaMultiplier)
        }
        for (const channel of ['cut', 'pierce', 'blunt'] as const) expect(effective.resist[channel]).toBeLessThanOrEqual(0.85)
        previous = effective
      }
    }
  })
})

function wear(pieces: readonly { kind: ArmorKind, quality?: ArmorQuality }[]) {
  const inventory = new Inventory({}, Infinity, undefined, undefined, Infinity)
  const equipment = createEquipmentState(inventory)
  for (const piece of pieces) {
    const instance = createArmorInstance(piece.kind, piece.quality ?? 'common')
    expect(inventory.addInstance(instance)).toBe(true)
    expect(equipment.equip(instance.id, inventory).ok).toBe(true)
  }
  return resolveProtectionSnapshot(equipment, inventory)
}

const FULL_MAIL_KIT = [
  'chainmail', 'ranger_pauldron', 'leather_bracers', 'leather_gloves', 'leather_trousers', 'leather_boots', 'iron_helm',
  'padded_cap', 'padded_jacket', 'padded_hose',
].map((kind) => ({ kind: kind as ArmorKind }))

describe('066 A reference full-mail-kit (proposal §5.2), computed from the catalog', () => {
  const snapshot = wear(FULL_MAIL_KIT)

  it('composes restrictions from the authored profiles', () => {
    const r = snapshot.restrictions
    expect(r.meleeStaminaMultiplier).toBeCloseTo(1.3245, 3)
    expect(r.meleeRecoveryMultiplier).toBeCloseTo(1.2448, 3)
    expect(r.movementSpeedMultiplier).toBeCloseTo(0.903, 3)
    expect(r.sprintStaminaMultiplier).toBeCloseTo(1.4916, 3)
    expect(rangedStaminaMultiplierFor(r.meleeStaminaMultiplier)).toBeCloseTo(1.1623, 3)
  })

  it('yields the reference and low-bite expected protection', () => {
    const reference = expectedProtection(snapshot.protection, 'reference')
    expect([reference.cut, reference.pierce, reference.blunt].map((v) => v * 100)).toEqual([
      expect.closeTo(50.18, 2), expect.closeTo(31.605, 2), expect.closeTo(26.9875, 2),
    ])
    const lowBite = expectedProtection(snapshot.protection, 'low-bite')
    expect([lowBite.cut, lowBite.pierce, lowBite.blunt].map((v) => v * 100)).toEqual([
      expect.closeTo(42.3925, 2), expect.closeTo(24.415, 2), expect.closeTo(23.9425, 2),
    ])
  })

  it('mail over padding gives the local torso values', () => {
    const body = snapshot.protection.body
    expect([body.cut, body.pierce, body.blunt].map((v) => v * 100)).toEqual([
      expect.closeTo(72, 2), expect.closeTo(50.5, 2), expect.closeTo(36.25, 2),
    ])
  })

  it('padding alone gives substantial blunt protection but cannot reach immunity', () => {
    const padding = wear(['padded_cap', 'padded_jacket', 'padded_hose'].map((kind) => ({ kind: kind as ArmorKind })))
    expect(padding.protection.body.blunt).toBeGreaterThanOrEqual(0.25)
    expect(expectedProtection(padding.protection, 'reference').blunt).toBeGreaterThan(0.1)
    for (const slot of ['head', 'body', 'legs'] as const) {
      for (const channel of ['cut', 'pierce', 'blunt'] as const) expect(snapshot.protection[slot][channel]).toBeLessThan(1)
    }
  })

  it('leather-only restrictions stay below the mail kit', () => {
    const leather = wear(['leather_armor', 'leather_bracers', 'leather_gloves', 'leather_trousers', 'leather_boots'].map((kind) => ({ kind: kind as ArmorKind })))
    expect(leather.restrictions.meleeStaminaMultiplier).toBeLessThan(snapshot.restrictions.meleeStaminaMultiplier)
    expect(leather.restrictions.movementSpeedMultiplier).toBeGreaterThan(snapshot.restrictions.movementSpeedMultiplier)
  })
})

describe('066 A save/content round-trip per new kind', () => {
  it.each(NEW_KINDS)('%s keeps ID and quality through the shared contents snapshot', (kind) => {
    for (const quality of ARMOR_QUALITIES) {
      const source = new Inventory({})
      const instance = createArmorInstance(kind, quality)
      source.addInstance(instance)
      const restored = inventoryFromContents(JSON.parse(JSON.stringify(snapshotInventoryContents(source))))
      expect(restored.getInstance(instance.id)).toEqual(instance)
      expect(restored.countInstances(kind)).toBe(1)
    }
  })
})
