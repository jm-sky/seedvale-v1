import type { EquipmentSlot } from '../../../items/equipment'
import type { LiquidContainerItemInstance } from '../../../items/itemInstances'
import type { ItemKind } from '../../../items/items'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
/**
 * D9 inventory-list demo fixtures — build real Inventory snapshots so demo and
 * live share `projectInventoryRows` + presentation leaves. No live store / save.
 */
import { createArmorInstance } from '../../../items/armorItemInstances'
import { Inventory } from '../../../items/Inventory'
import { buildInventoryGroups, inventoryCountsForUi, type InventoryGroupView } from '../../../items/inventoryView'
import { createTentInstance } from '../../../items/itemInstances'
import { createTrapInstance } from '../../../items/trapItemInstances'
import { createWeaponInstance } from '../../../items/weaponMaintenance'

export type DemoScenarioId =
  | 'full-bag'
  | 'empty'
  | 'large-stack'
  | 'mixed-liquids'
  | 'fifo-food'
  | 'held-primary'
  | 'invalidation'

export type DemoScenario = {
  id: DemoScenarioId
  label: string
  groups: InventoryGroupView[]
  counts: Partial<Record<ItemKind, number>>
  equippedSlots: Partial<Record<EquipmentSlot, string>>
  heldTool: ItemKind | null
  heldInstanceId: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  totalWeightKg: number
  maxWeightKg: number
  totalSize: number
  maxSize: number
  /** Optional note for demo controls. */
  note?: string
}

function liquid(
  id: string,
  kind: LiquidContainerItemInstance['kind'],
  amountLitres: number,
  content: LiquidContainerItemInstance['liquid'] = amountLitres > 0 ? 'water' : null,
): LiquidContainerItemInstance {
  return { id, kind, liquid: content, amountLitres }
}

function snapshotFromInventory(
  inventory: Inventory,
  extras: {
    equippedSlots?: Partial<Record<EquipmentSlot, string>>
    heldTool?: ItemKind | null
    heldInstanceId?: string | null
    primaryMelee?: PrimaryWeaponChoice | null
    primaryRanged?: PrimaryWeaponChoice | null
  } = {},
): Pick<DemoScenario, 'groups' | 'counts' | 'equippedSlots' | 'heldTool' | 'heldInstanceId' | 'primaryMelee' | 'primaryRanged' | 'totalWeightKg' | 'maxWeightKg' | 'totalSize' | 'maxSize'> {
  return {
    groups: buildInventoryGroups(inventory, 0),
    counts: inventoryCountsForUi(inventory),
    equippedSlots: extras.equippedSlots ?? {},
    heldTool: extras.heldTool ?? null,
    heldInstanceId: extras.heldInstanceId ?? null,
    primaryMelee: extras.primaryMelee ?? null,
    primaryRanged: extras.primaryRanged ?? null,
    totalWeightKg: inventory.totalWeight(),
    maxWeightKg: inventory.maxWeight,
    totalSize: inventory.totalSize(),
    maxSize: inventory.maxSize,
  }
}

function spaciousInventory(initial: Partial<Record<ItemKind, number>> = {}): Inventory {
  return new Inventory(initial, 1_000_000, undefined, undefined, 1_000_000)
}

function buildFullBag(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.addInstance(createArmorInstance('leather_armor', 'poor', 'leather-poor'))
  inventory.addInstance(createArmorInstance('leather_armor', 'common', 'leather-1'))
  inventory.addInstance(createArmorInstance('leather_armor', 'good', 'leather-good'))
  inventory.addInstance(createArmorInstance('chainmail', 'masterwork', 'chain-1'))
  inventory.addInstance(createArmorInstance('leather_pauldron', 'good', 'pauldron-1'))
  inventory.addInstance(createWeaponInstance('axe'))
  inventory.addInstance(createWeaponInstance('long_sword'))
  inventory.addInstance({ id: 'bow:1', kind: 'short_bow' })
  inventory.addInstance(createTrapInstance('trap_simple'))
  inventory.addInstance(createTrapInstance('trap_simple'))
  inventory.addInstance(createTentInstance(70))
  inventory.addInstance(liquid('liq-empty', 'waterskin_medium', 0))
  inventory.addInstance(liquid('liq-full', 'waterskin_medium', 4))
  inventory.addInstance(liquid('liq-milk', 'wooden_bucket', 5, 'milk'))
  inventory.addInstance({ id: 'key:demo', kind: 'key' })
  inventory.add('arrow', 10_000)
  inventory.add('coin', 347)
  inventory.add('roasted_meat', 5)
  inventory.add('bread', 3)
  inventory.add('chest', 1)
  inventory.add('rope', 2)
  const axeId = inventory.getInstances('axe')[0]!.id
  const swordId = inventory.getInstances('long_sword')[0]!.id

  return {
    id: 'full-bag',
    label: 'Pełny worek (hybryda)',
    note: 'Mixed-quality armor, large stack, liquids, FIFO food, held vs primary.',
    ...snapshotFromInventory(inventory, {
      equippedSlots: { body: 'leather-1', arms: 'pauldron-1' },
      heldTool: 'axe',
      heldInstanceId: axeId,
      primaryMelee: { kind: 'long_sword', instanceId: swordId },
      primaryRanged: { kind: 'short_bow', instanceId: 'bow:1' },
    }),
  }
}

function buildEmpty(): DemoScenario {
  return {
    id: 'empty',
    label: 'Puste',
    ...snapshotFromInventory(spaciousInventory()),
  }
}

function buildLargeStack(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.add('arrow', 10_000)
  inventory.add('coin', 5000)
  return {
    id: 'large-stack',
    label: 'Duży stos',
    note: 'One group row per kind — never 10k UI rows.',
    ...snapshotFromInventory(inventory),
  }
}

function buildMixedLiquids(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.addInstance(liquid('a', 'waterskin_small', 0))
  inventory.addInstance(liquid('b', 'waterskin_small', 2))
  inventory.addInstance(liquid('c', 'wooden_bucket', 3, 'milk'))
  return {
    id: 'mixed-liquids',
    label: 'Płyny',
    note: 'Empty / water / milk siblings stay separate instance rows.',
    ...snapshotFromInventory(inventory),
  }
}

function buildFifoFood(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.add('roasted_meat', 4)
  inventory.add('raw_meat', 2)
  return {
    id: 'fifo-food',
    label: 'FIFO jedzenie',
    note: 'One group per kind; freshness describes next FIFO portion.',
    ...snapshotFromInventory(inventory),
  }
}

function buildHeldPrimary(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.addInstance(createWeaponInstance('knife'))
  const bowId = 'bow:held'
  inventory.addInstance({ id: bowId, kind: 'short_bow' })
  inventory.add('arrow', 12)
  const knifeId = inventory.getInstances('knife')[0]!.id
  return {
    id: 'held-primary',
    label: 'Held vs primary',
    ...snapshotFromInventory(inventory, {
      heldTool: 'knife',
      heldInstanceId: knifeId,
      primaryMelee: { kind: 'knife', instanceId: knifeId },
      primaryRanged: { kind: 'short_bow', instanceId: bowId },
    }),
  }
}

function buildInvalidation(): DemoScenario {
  const inventory = spaciousInventory()
  inventory.addInstance(createArmorInstance('leather_armor', 'common', 'vanish-me'))
  inventory.add('arrow', 3)
  return {
    id: 'invalidation',
    label: 'Invalidacja',
    note: 'Simulate removal via demo action — selection must clear, not jump to sibling.',
    ...snapshotFromInventory(inventory, {
      equippedSlots: { body: 'vanish-me' },
    }),
  }
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  buildFullBag(),
  buildEmpty(),
  buildLargeStack(),
  buildMixedLiquids(),
  buildFifoFood(),
  buildHeldPrimary(),
  buildInvalidation(),
]

export function cloneScenario(id: DemoScenarioId): DemoScenario {
  const base = DEMO_SCENARIOS.find((s) => s.id === id) ?? DEMO_SCENARIOS[0]!
  return {
    ...base,
    groups: base.groups.map((g) => ({ ...g, instances: [...g.instances] })),
    counts: { ...base.counts },
    equippedSlots: { ...base.equippedSlots },
    primaryMelee: base.primaryMelee ? { ...base.primaryMelee } : null,
    primaryRanged: base.primaryRanged ? { ...base.primaryRanged } : null,
  }
}
