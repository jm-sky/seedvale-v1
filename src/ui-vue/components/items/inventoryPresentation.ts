/**
 * Pure D2(c) hybrid inventory presentation: instance vs group rows, selection
 * union, sort/filter helpers. Does not own Inventory or mutate gameplay.
 */
import type { InventoryGroupView, InventoryInstanceRow } from '../../../items/inventoryView'
import { itemDisplayName } from '../../../items/itemDisplay'
import { isArmorKind, isInstanceBackedKind } from '../../../items/itemInstances'
import {
  hasItemCategory,
  ITEM_DEFS,
  type ItemCategory,
  type ItemKind,
  itemSizeUnits,
  primaryItemCategory,
} from '../../../items/items'

export type InventorySelection =
  | { type: 'instance'; kind: ItemKind; instanceId: string }
  | { type: 'group'; kind: ItemKind }
  | null

export type InventorySortMode = 'category' | 'name' | 'qty' | 'weight'
export type InventoryCategoryFilter = 'all' | ItemCategory

export type InventoryPresentationRow =
  | {
      key: string
      type: 'instance'
      kind: ItemKind
      instanceId: string
      instance: InventoryInstanceRow
      group: InventoryGroupView
      displayName: string
      count: 1
      /** Total row mass (one unit). */
      weightKg: number
      sizeUnits: number
      category: ItemCategory
    }
  | {
      key: string
      type: 'group'
      kind: ItemKind
      group: InventoryGroupView
      displayName: string
      count: number
      weightKg: number
      sizeUnits: number
      category: ItemCategory
    }

export const INVENTORY_CATEGORY_ORDER: readonly ItemCategory[] = [
  'weapon',
  'armor',
  'tool',
  'story',
  'knowledge',
  'food',
  'utility',
  'resource',
  'other',
]

const plCollator = new Intl.Collator('pl', { sensitivity: 'base', numeric: true })

export function inventoryRowKey(selection: Exclude<InventorySelection, null>): string {
  return selection.type === 'instance'
    ? `instance:${selection.instanceId}`
    : `group:${selection.kind}`
}

export function selectionFromRow(row: InventoryPresentationRow): Exclude<InventorySelection, null> {
  if (row.type === 'instance') {
    return { type: 'instance', kind: row.kind, instanceId: row.instanceId }
  }
  return { type: 'group', kind: row.kind }
}

export function selectionMatchesRow(
  selection: InventorySelection,
  row: InventoryPresentationRow,
): boolean {
  if (!selection) return false
  if (selection.type === 'instance' && row.type === 'instance') {
    return selection.instanceId === row.instanceId && selection.kind === row.kind
  }
  if (selection.type === 'group' && row.type === 'group') {
    return selection.kind === row.kind
  }
  return false
}

function unitWeightKg(kind: ItemKind, instance?: InventoryInstanceRow): number {
  if (instance?.effectiveWeightKg != null) return instance.effectiveWeightKg
  return ITEM_DEFS[kind].weight
}

/**
 * Expand authoritative `InventoryGroupView[]` into hybrid presentation rows.
 * Instance-backed kinds → one row per real ID; all other positive counts → one
 * group row. Never expands quantity N into N rows.
 */
export function projectInventoryRows(
  groups: readonly InventoryGroupView[],
): InventoryPresentationRow[] {
  const rows: InventoryPresentationRow[] = []
  const seenInstanceIds = new Set<string>()
  const seenGroupKinds = new Set<ItemKind>()

  for (const group of groups) {
    if (group.count <= 0) continue
    const def = ITEM_DEFS[group.kind]
    const displayName = itemDisplayName(group.kind)
    const category = primaryItemCategory(def)

    if (isInstanceBackedKind(group.kind)) {
      for (const instance of group.instances) {
        if (seenInstanceIds.has(instance.id)) continue
        seenInstanceIds.add(instance.id)
        rows.push({
          key: `instance:${instance.id}`,
          type: 'instance',
          kind: group.kind,
          instanceId: instance.id,
          instance,
          group,
          displayName,
          count: 1,
          weightKg: unitWeightKg(group.kind, instance),
          sizeUnits: itemSizeUnits(group.kind),
          category,
        })
      }
      continue
    }

    if (seenGroupKinds.has(group.kind)) continue
    seenGroupKinds.add(group.kind)
    const unit = ITEM_DEFS[group.kind].weight
    rows.push({
      key: `group:${group.kind}`,
      type: 'group',
      kind: group.kind,
      group,
      displayName,
      count: group.count,
      weightKg: unit * group.count,
      sizeUnits: itemSizeUnits(group.kind) * group.count,
      category,
    })
  }

  return rows
}

export function availableInventoryCategories(
  rows: readonly InventoryPresentationRow[],
): ItemCategory[] {
  return INVENTORY_CATEGORY_ORDER.filter((cat) =>
    rows.some((row) => hasItemCategory(ITEM_DEFS[row.kind], cat)),
  )
}

export function filterInventoryRows(
  rows: readonly InventoryPresentationRow[],
  filter: InventoryCategoryFilter,
): InventoryPresentationRow[] {
  if (filter === 'all') return [...rows]
  return rows.filter((row) => hasItemCategory(ITEM_DEFS[row.kind], filter))
}

function compareByTieBreakers(a: InventoryPresentationRow, b: InventoryPresentationRow): number {
  const name = plCollator.compare(a.displayName, b.displayName)
  if (name !== 0) return name
  const kind = a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0
  if (kind !== 0) return kind
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0
}

export function sortInventoryRows(
  rows: readonly InventoryPresentationRow[],
  mode: InventorySortMode,
): InventoryPresentationRow[] {
  const sorted = [...rows]
  if (mode === 'name') {
    sorted.sort((a, b) => compareByTieBreakers(a, b))
  } else if (mode === 'qty') {
    sorted.sort((a, b) => {
      const qty = b.count - a.count
      if (qty !== 0) return qty
      return compareByTieBreakers(a, b)
    })
  } else if (mode === 'weight') {
    sorted.sort((a, b) => {
      const w = b.weightKg - a.weightKg
      if (w !== 0) return w
      return compareByTieBreakers(a, b)
    })
  } else {
    sorted.sort((a, b) => {
      const ca = INVENTORY_CATEGORY_ORDER.indexOf(a.category)
      const cb = INVENTORY_CATEGORY_ORDER.indexOf(b.category)
      if (ca !== cb) return ca - cb
      return compareByTieBreakers(a, b)
    })
  }
  return sorted
}

export function findPresentationRow(
  rows: readonly InventoryPresentationRow[],
  selection: InventorySelection,
): InventoryPresentationRow | null {
  if (!selection) return null
  return rows.find((row) => selectionMatchesRow(selection, row)) ?? null
}

/** Derive compare candidate: owned selected armor instance only. */
export function deriveCompareInstanceId(
  selection: InventorySelection,
  rows: readonly InventoryPresentationRow[],
): string | null {
  if (!selection || selection.type !== 'instance') return null
  if (!isArmorKind(selection.kind)) return null
  const row = findPresentationRow(rows, selection)
  if (!row || row.type !== 'instance') return null
  return row.instanceId
}

/**
 * Reconcile selection against a fresh projection.
 * - Same ID still present → keep (caller refreshes state in place).
 * - Vanished / kind mismatch / zero-count group → clear (no sibling auto-select).
 */
export function reconcileInventorySelection(
  selection: InventorySelection,
  rows: readonly InventoryPresentationRow[],
): InventorySelection {
  if (!selection) return null
  const found = findPresentationRow(rows, selection)
  if (!found) return null
  if (selection.type === 'instance') {
    if (found.type !== 'instance' || found.kind !== selection.kind) return null
    return selection
  }
  if (found.type !== 'group' || found.count <= 0) return null
  return selection
}

export function selectedInstanceId(selection: InventorySelection): string | null {
  return selection?.type === 'instance' ? selection.instanceId : null
}

export function selectedGroupKind(selection: InventorySelection): ItemKind | null {
  if (!selection) return null
  return selection.kind
}

export function isSelectionVisible(
  selection: InventorySelection,
  visibleRows: readonly InventoryPresentationRow[],
): boolean {
  if (!selection) return true
  return findPresentationRow(visibleRows, selection) != null
}
