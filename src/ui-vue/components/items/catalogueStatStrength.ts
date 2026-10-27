import { ITEM_CATALOG } from '../../../items/itemCatalog'
import { ITEM_DEFS } from '../../../items/items'

/** Clamp a catalogue-relative strength to 0..1 (V3 `catalogueStatStrength`). */
export function catalogueStatStrength(value: number, ceiling: number): number {
  if (!(ceiling > 0) || !Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value / ceiling))
}

export type InventoryDetailStatCeilings = {
  /** Max melee+ranged damage — strongest weapon in the catalogue. */
  damage: number
  recovery: number
  staminaCost: number
  meleeRange: number
  rangedRange: number
  /** Max armor `damageReduction * 100` (Ochrona %). */
  armorProtectionPercent: number
  weightKg: number
}

function maxOf(values: number[]): number {
  return values.reduce((a, b) => (b > a ? b : a), 0)
}

function computeInventoryDetailStatCeilings(): InventoryDetailStatCeilings {
  const damages: number[] = []
  const recoveries: number[] = []
  const staminas: number[] = []
  const meleeRanges: number[] = []
  const rangedRanges: number[] = []
  const protections: number[] = []

  for (const entry of Object.values(ITEM_CATALOG)) {
    if (entry.melee) {
      damages.push(entry.melee.damage)
      recoveries.push(entry.melee.recovery)
      staminas.push(entry.melee.staminaCost)
      meleeRanges.push(entry.melee.range)
    }
    if (entry.ranged) {
      damages.push(entry.ranged.damage)
      recoveries.push(entry.ranged.recovery)
      staminas.push(entry.ranged.staminaCost)
      rangedRanges.push(entry.ranged.range)
    }
    if (entry.armor) {
      protections.push(entry.armor.damageReduction * 100)
    }
  }

  return {
    damage: maxOf(damages),
    recovery: maxOf(recoveries),
    staminaCost: maxOf(staminas),
    meleeRange: maxOf(meleeRanges),
    rangedRange: maxOf(rangedRanges),
    armorProtectionPercent: maxOf(protections),
    weightKg: maxOf(Object.values(ITEM_DEFS).map((d) => d.weight)),
  }
}

/** Module-init cache of catalogue maxima for StatUnderline bars. */
export const INVENTORY_DETAIL_STAT_CEILINGS: InventoryDetailStatCeilings =
  computeInventoryDetailStatCeilings()
