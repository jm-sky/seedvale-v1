import { describe, expect, it } from 'vitest'
import type { LiquidContainerItemInstance } from '../../../items/itemInstances'
import { createArmorInstance } from '../../../items/armorItemInstances'
import { Inventory } from '../../../items/Inventory'
import { buildInventoryGroups } from '../../../items/inventoryView'
import { createTentInstance } from '../../../items/itemInstances'
import { createTrapInstance } from '../../../items/trapItemInstances'
import { createWeaponInstance } from '../../../items/weaponMaintenance'
import {
  deriveCompareInstanceId,
  filterInventoryRows,
  type InventoryPresentationRow,
  projectInventoryRows,
  reconcileInventorySelection,
  sortInventoryRows,
} from './inventoryPresentation'

function liquidInstance(
  id: string,
  kind: LiquidContainerItemInstance['kind'],
  amountLitres: number,
  liquid: LiquidContainerItemInstance['liquid'] = amountLitres > 0 ? 'water' : null,
): LiquidContainerItemInstance {
  return { id, kind, liquid, amountLitres }
}

function keysOf(rows: readonly InventoryPresentationRow[]): string[] {
  return rows.map((r) => r.key)
}

describe('projectInventoryRows (D2c)', () => {
  it('emits separate rows for mixed-quality same-kind armor and equal-quality distinct IDs', () => {
    const inventory = new Inventory({})
    inventory.addInstance(createArmorInstance('leather_armor', 'poor'))
    inventory.addInstance(createArmorInstance('leather_armor', 'good'))
    inventory.addInstance(createArmorInstance('leather_armor', 'common'))
    inventory.addInstance(createArmorInstance('leather_armor', 'common'))
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const armorRows = rows.filter((r) => r.kind === 'leather_armor')
    expect(armorRows).toHaveLength(4)
    expect(armorRows.every((r) => r.type === 'instance')).toBe(true)
    const ids = new Set(armorRows.map((r) => (r.type === 'instance' ? r.instanceId : '')))
    expect(ids.size).toBe(4)
  })

  it('keeps maintained weapons, ranged, traps, tents, liquids and keys as instance rows', () => {
    const inventory = new Inventory({})
    inventory.addInstance(createWeaponInstance('knife'))
    inventory.addInstance({ id: 'bow:1', kind: 'short_bow' })
    inventory.addInstance(createTrapInstance('trap_simple'))
    inventory.addInstance(createTentInstance(90))
    inventory.addInstance(liquidInstance('liq:a', 'waterskin_small', 2))
    inventory.addInstance(liquidInstance('liq:b', 'waterskin_small', 0))
    inventory.addInstance({ id: 'key:1', kind: 'key' })
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    expect(rows.filter((r) => r.type === 'instance').length).toBeGreaterThanOrEqual(7)
    expect(rows.some((r) => r.key === 'instance:bow:1')).toBe(true)
    expect(rows.some((r) => r.key === 'instance:key:1')).toBe(true)
    const liquids = rows.filter((r) => r.kind === 'waterskin_small')
    expect(liquids).toHaveLength(2)
  })

  it('collapses a large stack into one group row and never expands count-sized arrays', () => {
    const inventory = new Inventory({}, 1_000_000, undefined, undefined, 1_000_000)
    inventory.add('arrow', 10_000)
    inventory.add('coin', 500)
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const arrow = rows.find((r) => r.kind === 'arrow')
    expect(arrow?.type).toBe('group')
    expect(arrow?.count).toBe(10_000)
    expect(keysOf(rows.filter((r) => r.kind === 'arrow'))).toEqual(['group:arrow'])
  })

  it('uses one food group for multiple FIFO batches', () => {
    const inventory = new Inventory({})
    inventory.add('roasted_meat', 3)
    inventory.add('roasted_meat', 2)
    const groups = buildInventoryGroups(inventory, 0)
    const rows = projectInventoryRows(groups)
    const food = rows.filter((r) => r.kind === 'roasted_meat')
    expect(food).toHaveLength(1)
    expect(food[0]!.type).toBe('group')
    expect(food[0]!.count).toBe(5)
  })

  it('exposes exact liquid litres and does not merge empty with full siblings', () => {
    const inventory = new Inventory({})
    inventory.addInstance(liquidInstance('empty', 'wooden_bucket', 0))
    inventory.addInstance(liquidInstance('milk', 'wooden_bucket', 5, 'milk'))
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const buckets = rows.filter((r) => r.kind === 'wooden_bucket')
    expect(buckets).toHaveLength(2)
    const empty = buckets.find((r) => r.type === 'instance' && r.instanceId === 'empty')
    const milk = buckets.find((r) => r.type === 'instance' && r.instanceId === 'milk')
    expect(empty?.type === 'instance' && empty.instance.liquid).toBeNull()
    expect(milk?.type === 'instance' && milk.instance.liquid).toBe('milk')
    expect(milk?.type === 'instance' && milk.instance.amountLitres).toBe(5)
  })
})

describe('sort / filter / reconcile', () => {
  it('sorts by weight heaviest-first with deterministic ties', () => {
    const inventory = new Inventory({ arrow: 50, coin: 10, rope: 2 })
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const sorted = sortInventoryRows(rows, 'weight')
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1]!.weightKg).toBeGreaterThanOrEqual(sorted[i]!.weightKg)
    }
  })

  it('preserves selection when filtered out and clears vanished IDs without sibling select', () => {
    const inventory = new Inventory({})
    const a = createArmorInstance('leather_armor', 'common')
    const b = createArmorInstance('leather_armor', 'good')
    inventory.addInstance(a)
    inventory.addInstance(b)
    inventory.add('arrow', 10)
    const all = projectInventoryRows(buildInventoryGroups(inventory))
    const selection = { type: 'instance' as const, kind: 'leather_armor' as const, instanceId: a.id }
    const weaponsOnly = filterInventoryRows(all, 'weapon')
    expect(weaponsOnly.some((r) => r.type === 'instance' && r.instanceId === a.id)).toBe(false)
    expect(reconcileInventorySelection(selection, all)).toEqual(selection)
    expect(deriveCompareInstanceId(selection, all)).toBe(a.id)

    inventory.removeInstance(a.id)
    const after = projectInventoryRows(buildInventoryGroups(inventory))
    expect(reconcileInventorySelection(selection, after)).toBeNull()
    expect(after.some((r) => r.type === 'instance' && r.instanceId === b.id)).toBe(true)
  })

  it('clears zero-count group selection', () => {
    const inventory = new Inventory({ arrow: 2 })
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const selection = { type: 'group' as const, kind: 'arrow' as const }
    expect(reconcileInventorySelection(selection, rows)).toEqual(selection)
    inventory.remove('arrow', 2)
    const after = projectInventoryRows(buildInventoryGroups(inventory))
    expect(reconcileInventorySelection(selection, after)).toBeNull()
  })
})
