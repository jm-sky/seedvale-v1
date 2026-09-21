import type { Role } from '../ai/characters'
import type { Inventory, ItemAmount } from '../items/Inventory'
import type { ItemInstance } from '../items/itemInstances'
import type { ItemKind } from '../items/items'
import type { ArtisanSpecialization } from '../settlement/artisanProfile'
import type { StockAmount } from './stock'
import { isInstanceBackedKind } from '../items/itemInstances'
import { createAcquiredInstance } from '../items/trade'
import { executeProduction } from './productionExecutor'

/**
 * Shared production/processing operation (plan 071). 069 should add farming
 * as another `ProductionDef` rather than a second resource model.
 */
export type ProductionDef = {
  id: string
  /** When set, only this role's completed work should apply the recipe. */
  role?: Role
  inputs: readonly StockAmount[]
  outputs: readonly StockAmount[]
  /** Item-based inputs/outputs — for recipes whose materials/products are
   *  plain `Inventory` items rather than settlement `EconomicKind` stock.
   *  Mixed recipes run through `executeProduction` with an explicit item
   *  owner; optional so stock-only defs stay valid. */
  itemInputs?: readonly ItemAmount[]
  itemOutputs?: readonly ItemAmount[]
  /**
   * Optional artisan capability / difficulty (plan settlements-npcs-056).
   * Lives on the shared recipe so custom orders do not grow a second registry.
   */
  artisan?: {
    difficulty: number
    minSkill: number
    specialization: ArtisanSpecialization
    /** Exclusive specialists of other categories cannot craft this recipe. */
    exclusive?: boolean
  }
}

/** Wood source → woodcutter chop/deposit → wood stock. */
export const WOODCUTTING_PRODUCTION: ProductionDef = {
  id: 'woodcutter.harvest',
  role: 'woodcutter',
  inputs: [],
  outputs: [{ kind: 'wood', amount: 2 }],
}

/**
 * Placeholders so 069 / mining / fishing can fill inputs/outputs without a
 * new production scheduler. Empty recipes are successful no-ops.
 */
export const FARMING_PRODUCTION: ProductionDef = {
  id: 'farmer.work',
  role: 'farmer',
  inputs: [],
  outputs: [],
}

export const FISHING_PRODUCTION: ProductionDef = {
  id: 'fisher.work',
  role: 'fisher',
  inputs: [],
  outputs: [],
}

export const MINING_PRODUCTION: ProductionDef = {
  id: 'miner.work',
  role: 'miner',
  inputs: [],
  outputs: [],
}

/**
 * Hunter arrow production (settlements-npcs-003, completing plan 178's
 * `beginArrowCrafting`) — item-for-item recipes against `Household.items`,
 * not `EconomicStock`: `branch`/`beam`/`arrow` are `ItemKind`s, not
 * `EconomicKind`s (plan 187 split `branch`/`beam` out of the old wood
 * model). Two alternative recipes rather than one `BY_ROLE` entry because
 * the hunter must prefer branch over beam (§9) — see
 * `produceFirstAvailableItemRecipe`.
 */
export const ARROWS_FROM_BRANCH_PRODUCTION: ProductionDef = {
  id: 'hunter.arrows.branch',
  role: 'hunter',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'branch', amount: 1 }],
  itemOutputs: [{ kind: 'arrow', amount: 1 }],
}

export const ARROWS_FROM_BEAM_PRODUCTION: ProductionDef = {
  id: 'hunter.arrows.beam',
  role: 'hunter',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'beam', amount: 1 }],
  itemOutputs: [{ kind: 'arrow', amount: 8 }],
}

/** Priority order (branch before beam) — deterministic, no random pick. */
export const HUNTER_ARROW_PRODUCTIONS: readonly ProductionDef[] = [
  ARROWS_FROM_BRANCH_PRODUCTION,
  ARROWS_FROM_BEAM_PRODUCTION,
]

/**
 * Hunter bow production (plan settlements-npcs-040) — same item-for-item
 * `Household.items` path as arrows. `short_bow` is instance-backed (plan
 * items-player-060), so `produceFirstAvailableItemRecipe` mints a fresh
 * instance via `resolveItemOutputInstances()` before calling
 * `executeProduction`, rather than a plain `applyRecipe` count bump. Cap is
 * unsold household trade stock, not lifetime production.
 *
 * @domain settlements-npcs
 */
export const SHORT_BOW_FROM_BRANCH_PRODUCTION: ProductionDef = {
  id: 'hunter.short_bow.branch',
  role: 'hunter',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'branch', amount: 2 }],
  itemOutputs: [{ kind: 'short_bow', amount: 1 }],
}

export const SHORT_BOW_FROM_BEAM_PRODUCTION: ProductionDef = {
  id: 'hunter.short_bow.beam',
  role: 'hunter',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'beam', amount: 1 }],
  itemOutputs: [{ kind: 'short_bow', amount: 1 }],
}

/** Priority order (branch before beam) — same pattern as hunter arrows. */
export const HUNTER_BOW_PRODUCTIONS: readonly ProductionDef[] = [
  SHORT_BOW_FROM_BRANCH_PRODUCTION,
  SHORT_BOW_FROM_BEAM_PRODUCTION,
]

/** Unsold household trade bows the Hunter will try to keep in stock. */
export const HUNTER_BOW_STOCK_CAP = 2

const HUNTER_TRADE_BOW_KINDS: readonly ItemKind[] = ['short_bow', 'hunting_bow']

/**
 * Live unsold Hunter trade-bow count in one inventory — stack `short_bow`
 * plus instance-backed `hunting_bow`. Personal loadout is a different
 * inventory and is never included.
 *
 * @domain settlements-npcs
 */
export function householdTradeBowCount(inventory: Inventory): number {
  let n = 0
  for (const kind of HUNTER_TRADE_BOW_KINDS) {
    n += isInstanceBackedKind(kind) ? inventory.countInstances(kind) : inventory.count(kind)
  }
  return n
}

/**
 * Textile Worker wool processing (settlements-npcs-006) — item-for-item
 * against owning `Household.items`, not settlement stock. Intentionally
 * skips yarn: `4 wool → 12 wool_material`. Not in `BY_ROLE` because
 * `commitRoleWork` is stock-only; completion goes through
 * `commitWoolMaterialProduction` / `executeProduction`.
 *
 * @domain settlements-npcs
 */
export const WOOL_MATERIAL_PRODUCTION: ProductionDef = {
  id: 'textile_worker.wool_material',
  role: 'textile_worker',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'wool', amount: 4 }],
  itemOutputs: [{ kind: 'wool_material', amount: 12 }],
}

/** `3 flax → 1 linen_material` (plan settlements-npcs-007). */
export const FLAX_LINEN_PRODUCTION: ProductionDef = {
  id: 'textile_worker.linen_material',
  role: 'textile_worker',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'flax', amount: 3 }],
  itemOutputs: [{ kind: 'linen_material', amount: 1 }],
}

/** `1 linen_material → 1 bandage` (plan settlements-npcs-007). */
export const LINEN_BANDAGE_PRODUCTION: ProductionDef = {
  id: 'textile_worker.bandage',
  role: 'textile_worker',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'linen_material', amount: 1 }],
  itemOutputs: [{ kind: 'bandage', amount: 1 }],
}

/** Wool first, then linen chain — same priority pattern as hunter arrows. */
export const TEXTILE_WORKER_PRODUCTIONS: readonly ProductionDef[] = [
  WOOL_MATERIAL_PRODUCTION,
  FLAX_LINEN_PRODUCTION,
  LINEN_BANDAGE_PRODUCTION,
]

/**
 * Blacksmith iron rod processing (plan settlements-npcs-016) — mixed
 * settlement stock inputs and household item output via `executeProduction`.
 * Not in `BY_ROLE`; completion goes through `commitBlacksmithProduction` /
 * `planBlacksmithWork`.
 *
 * @domain settlements-npcs
 */
export const BLACKSMITH_IRON_ROD_PRODUCTION: ProductionDef = {
  id: 'blacksmith.iron_rod',
  role: 'blacksmith',
  inputs: [{ kind: 'iron', amount: 2 }, { kind: 'coal', amount: 1 }],
  outputs: [],
  itemOutputs: [{ kind: 'iron_rod', amount: 1 }],
  artisan: { difficulty: 20, minSkill: 15, specialization: 'tools' },
}

function blacksmithRecipe(
  id: string,
  output: ItemKind,
  iron: number,
  coal: number,
  artisan: NonNullable<ProductionDef['artisan']>,
): ProductionDef {
  return {
    id,
    role: 'blacksmith',
    inputs: [
      { kind: 'iron', amount: iron },
      { kind: 'coal', amount: coal },
    ],
    outputs: [],
    itemOutputs: [{ kind: output, amount: 1 }],
    artisan,
  }
}

/** Player-orderable Blacksmith recipes (plan settlements-npcs-056). */
export const BLACKSMITH_KNIFE_PRODUCTION = blacksmithRecipe(
  'blacksmith.knife', 'knife', 1, 1, { difficulty: 25, minSkill: 20, specialization: 'swords' },
)
export const BLACKSMITH_AXE_PRODUCTION = blacksmithRecipe(
  'blacksmith.axe', 'axe', 2, 1, { difficulty: 35, minSkill: 28, specialization: 'axes' },
)
export const BLACKSMITH_PICKAXE_PRODUCTION = blacksmithRecipe(
  'blacksmith.pickaxe', 'pickaxe', 2, 1, { difficulty: 40, minSkill: 32, specialization: 'tools' },
)
export const BLACKSMITH_SHORT_SWORD_PRODUCTION = blacksmithRecipe(
  'blacksmith.short_sword', 'short_sword', 2, 1, { difficulty: 45, minSkill: 38, specialization: 'swords' },
)
export const BLACKSMITH_LONG_SWORD_PRODUCTION = blacksmithRecipe(
  'blacksmith.long_sword', 'long_sword', 3, 1, { difficulty: 55, minSkill: 48, specialization: 'swords' },
)
export const BLACKSMITH_PAULDRON_PRODUCTION = blacksmithRecipe(
  'blacksmith.knight_pauldron_round',
  'knight_pauldron_round',
  3,
  1,
  { difficulty: 60, minSkill: 52, specialization: 'armor' },
)
export const BLACKSMITH_CHAINMAIL_PRODUCTION = blacksmithRecipe(
  'blacksmith.chainmail',
  'chainmail',
  4,
  2,
  { difficulty: 70, minSkill: 62, specialization: 'armor', exclusive: true },
)
export const BLACKSMITH_BATTLE_AXE_PRODUCTION = blacksmithRecipe(
  'blacksmith.battle_axe',
  'battle_axe',
  4,
  2,
  { difficulty: 75, minSkill: 68, specialization: 'axes', exclusive: true },
)
export const BLACKSMITH_DAMASCUS_KNIFE_PRODUCTION = blacksmithRecipe(
  'blacksmith.damascus_knife',
  'damascus_knife',
  3,
  2,
  { difficulty: 80, minSkill: 74, specialization: 'swords', exclusive: true },
)
export const BLACKSMITH_MASTERWORK_SWORD_PRODUCTION = blacksmithRecipe(
  'blacksmith.masterwork_sword',
  'masterwork_sword',
  5,
  2,
  { difficulty: 88, minSkill: 82, specialization: 'swords', exclusive: true },
)

/**
 * Orderable Blacksmith recipes, difficulty order (plan settlements-npcs-056).
 * Autonomous iron-rod processing stays on `BLACKSMITH_IRON_ROD_PRODUCTION`
 * and is included here so a player can also commission rods.
 *
 * @domain settlements-npcs
 */
export const BLACKSMITH_ORDER_PRODUCTIONS: readonly ProductionDef[] = [
  BLACKSMITH_IRON_ROD_PRODUCTION,
  BLACKSMITH_KNIFE_PRODUCTION,
  BLACKSMITH_AXE_PRODUCTION,
  BLACKSMITH_PICKAXE_PRODUCTION,
  BLACKSMITH_SHORT_SWORD_PRODUCTION,
  BLACKSMITH_LONG_SWORD_PRODUCTION,
  BLACKSMITH_PAULDRON_PRODUCTION,
  BLACKSMITH_CHAINMAIL_PRODUCTION,
  BLACKSMITH_BATTLE_AXE_PRODUCTION,
  BLACKSMITH_DAMASCUS_KNIFE_PRODUCTION,
  BLACKSMITH_MASTERWORK_SWORD_PRODUCTION,
]

/** `1 bandage + 1 herb → 1 dressing` (plan settlements-npcs-007). */
export const DRESSING_PRODUCTION: ProductionDef = {
  id: 'herbalist.dressing',
  role: 'herbalist',
  inputs: [],
  outputs: [],
  itemInputs: [{ kind: 'bandage', amount: 1 }, { kind: 'herb', amount: 1 }],
  itemOutputs: [{ kind: 'dressing', amount: 1 }],
}

/**
 * Applies the first recipe in `defs` that the shared executor can commit
 * against `inventory`. Priority order is the array order (hunter: branch
 * before beam). Returns the applied def, or null when none can run.
 */
/** Mints fresh instances for any instance-backed `itemOutputs` entries in
 *  `def` (plan items-player-060) — bridges a count/instance-agnostic recipe
 *  declaration to `executeProduction`'s explicit `itemOutputInstances`
 *  contract, the same way `artisanOrders.ts`'s custom-order completion does
 *  for quality-bearing crafted output. `undefined` both when `def` has no
 *  instance-backed output (the common case — `executeProduction` then takes
 *  its plain `applyRecipe` count path) and when acquisition unexpectedly
 *  fails for a declared instance-backed kind, which `executeProduction`
 *  itself then rejects as `unavailable-destination` rather than silently
 *  falling back to a count. */
function resolveItemOutputInstances(def: ProductionDef): ItemInstance[] | undefined {
  const instanceOutputs = (def.itemOutputs ?? []).filter((output) => isInstanceBackedKind(output.kind))
  if (instanceOutputs.length === 0) return undefined
  const instances: ItemInstance[] = []
  for (const { kind, amount } of instanceOutputs) {
    for (let i = 0; i < amount; i++) {
      const instance = createAcquiredInstance(kind)
      if (!instance) return undefined
      instances.push(instance)
    }
  }
  return instances
}

export function produceFirstAvailableItemRecipe(
  inventory: Inventory,
  defs: readonly ProductionDef[],
  simTime = 0,
): ProductionDef | null {
  for (const def of defs) {
    const itemOutputInstances = resolveItemOutputInstances(def)
    if (executeProduction(def, { inventory, simTime, itemOutputInstances }).ok) return def
  }
  return null
}

const BY_ROLE: Partial<Record<Role, ProductionDef>> = {
  farmer: FARMING_PRODUCTION,
  fisher: FISHING_PRODUCTION,
  miner: MINING_PRODUCTION,
  woodcutter: WOODCUTTING_PRODUCTION,
}

export function productionForRole(role: Role): ProductionDef | null {
  return BY_ROLE[role] ?? null
}

const PRODUCTION_BY_ID: ReadonlyMap<string, ProductionDef> = new Map(
  [
    WOODCUTTING_PRODUCTION,
    FARMING_PRODUCTION,
    FISHING_PRODUCTION,
    MINING_PRODUCTION,
    ARROWS_FROM_BRANCH_PRODUCTION,
    ARROWS_FROM_BEAM_PRODUCTION,
    SHORT_BOW_FROM_BRANCH_PRODUCTION,
    SHORT_BOW_FROM_BEAM_PRODUCTION,
    WOOL_MATERIAL_PRODUCTION,
    FLAX_LINEN_PRODUCTION,
    LINEN_BANDAGE_PRODUCTION,
    BLACKSMITH_IRON_ROD_PRODUCTION,
    BLACKSMITH_KNIFE_PRODUCTION,
    BLACKSMITH_AXE_PRODUCTION,
    BLACKSMITH_PICKAXE_PRODUCTION,
    BLACKSMITH_SHORT_SWORD_PRODUCTION,
    BLACKSMITH_LONG_SWORD_PRODUCTION,
    BLACKSMITH_PAULDRON_PRODUCTION,
    BLACKSMITH_CHAINMAIL_PRODUCTION,
    BLACKSMITH_BATTLE_AXE_PRODUCTION,
    BLACKSMITH_DAMASCUS_KNIFE_PRODUCTION,
    BLACKSMITH_MASTERWORK_SWORD_PRODUCTION,
    DRESSING_PRODUCTION,
  ].map((def) => [def.id, def]),
)

/** Lookup used by production-shortage revalidation — unknown ids are dropped. */
export function productionDefById(id: string): ProductionDef | null {
  return PRODUCTION_BY_ID.get(id) ?? null
}
