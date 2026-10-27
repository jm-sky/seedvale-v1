import type { ItemKind } from '../../../items/items'
import { itemDisplayName } from '../../../items/itemDisplay'

export type AmmoSectionLine = {
  kind: ItemKind
  label: string
  count: number
}

export type AmmoSectionView = {
  lines: AmmoSectionLine[]
  total: number
  /** First catalog ammo kind with count > 0 — same order as gameLoop fire resolution. */
  resolvedKind: ItemKind | null
  resolvedLabel: string | null
  resolvedCount: number
}

/** Read-only ammo summary for a ranged weapon's catalog `ammoKinds` + live counts. */
export function buildAmmoSectionView(
  ammoKinds: readonly ItemKind[],
  counts: Partial<Record<string, number>>,
): AmmoSectionView {
  const lines: AmmoSectionLine[] = ammoKinds.map((kind) => ({
    kind,
    label: itemDisplayName(kind),
    count: counts[kind] ?? 0,
  }))
  const total = lines.reduce((sum, line) => sum + line.count, 0)
  const resolved = lines.find((line) => line.count > 0) ?? null
  return {
    lines,
    total,
    resolvedKind: resolved?.kind ?? null,
    resolvedLabel: resolved?.label ?? null,
    resolvedCount: resolved?.count ?? 0,
  }
}
