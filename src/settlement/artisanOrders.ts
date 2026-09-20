import type { Inventory } from '../items/Inventory'
import { createArmorInstance, isArmorKind } from '../items/armorItemInstances'
import {
  isInstanceBackedKind,
  type ArmorQuality,
  type ItemInstance,
} from '../items/itemInstances'
import type { ItemKind } from '../items/items'
import { createAcquiredInstance } from '../items/trade'
import { transferInventoryCount, transferInventoryInstance } from '../items/inventoryTransfer'
import type { ProductionDef } from '../economy/production'
import { BLACKSMITH_ORDER_PRODUCTIONS, productionDefById } from '../economy/production'
import { executeProduction, preflightProductionInputs } from '../economy/productionExecutor'
import { isEconomicKind } from '../economy/kinds'
import type { SettlementEconomy } from '../economy/settlementEconomy'
import type { Household } from './household'
import {
  artisanCanCraft,
  artisanMaterialDepositValue,
  artisanOutputKind,
  missingArtisanMaterials,
  resolveArtisanCraft,
  resolveArtisanCraftedQuality,
} from './artisanCraft'
import {
  type ArtisanOrder,
  type ArtisanOrderMaterial,
  type ArtisanProfile,
  noteArtisanProductionCompleted,
} from './artisanProfile'
import type { NpcAuthoritativeState } from './npcState'

/**
 * Player custom-order catalog / accept / complete / pickup (plan
 * settlements-npcs-056). Orders are simulation-owned on the artisan's
 * `NpcAuthoritativeState`. Production still goes through the shared executor.
 *
 * @domain settlements-npcs
 */

export type ArtisanOrderCatalogEntry = {
  productionId: string
  outputKind: ItemKind
  deposit: number
  canOrder: boolean
  missing: readonly { kind: string, amount: number, owner: 'stock' | 'item' }[]
  prefers: boolean
  effectiveSkill: number
}

export type ArtisanOrderCatalog = {
  artisanNpcId: string
  profile: ArtisanProfile
  entries: readonly ArtisanOrderCatalogEntry[]
  orders: readonly ArtisanOrder[]
}

export function artisanOrderRecipes(): readonly ProductionDef[] {
  return BLACKSMITH_ORDER_PRODUCTIONS
}

export function reservedArtisanOutputIds(
  orders: readonly ArtisanOrder[] | null | undefined,
): ReadonlySet<string> {
  const ids = new Set<string>()
  if (!orders) return ids
  for (const order of orders) {
    if ((order.status === 'ready' || order.status === 'in_progress' || order.status === 'accepted') && order.outputInstanceId) {
      ids.add(order.outputInstanceId)
    }
  }
  return ids
}

export function listArtisanOrderCatalog(input: {
  state: Pick<NpcAuthoritativeState, 'id' | 'artisanProfile' | 'artisanOrders'>
  economy: SettlementEconomy | null | undefined
  household: Household | null | undefined
}): ArtisanOrderCatalog | null {
  const profile = input.state.artisanProfile
  if (!profile) return null
  const economyQuery = (kind: string) => (
    input.economy && isEconomicKind(kind) ? input.economy.query(kind) : 0
  )
  const entries: ArtisanOrderCatalogEntry[] = []
  for (const def of BLACKSMITH_ORDER_PRODUCTIONS) {
    const outputKind = artisanOutputKind(def)
    if (!outputKind) continue
    const craft = resolveArtisanCraft(profile, def)
    const missing = craft.canCraft
      ? missingArtisanMaterials(def, economyQuery, input.household?.items)
      : []
    entries.push({
      productionId: def.id,
      outputKind,
      deposit: artisanMaterialDepositValue(def),
      canOrder: craft.canCraft,
      missing,
      prefers: craft.prefersToCraft,
      effectiveSkill: craft.effectiveSkill,
    })
  }
  return {
    artisanNpcId: input.state.id,
    profile,
    entries,
    orders: input.state.artisanOrders,
  }
}

export type AcceptArtisanOrderResult =
  | { ok: true, order: ArtisanOrder }
  | {
      ok: false
      reason: 'unavailable' | 'insufficient-skill' | 'missing-materials' | 'cannot-afford' | 'invalid'
      missing?: readonly { kind: string, amount: number, owner: 'stock' | 'item' }[]
    }

function requiredMaterialsOf(def: ProductionDef): ArtisanOrderMaterial[] {
  return [
    ...def.inputs.map((row) => ({ kind: row.kind, amount: row.amount, owner: 'stock' as const })),
    ...(def.itemInputs ?? []).map((row) => ({ kind: row.kind, amount: row.amount, owner: 'item' as const })),
  ]
}

/**
 * Accept a player custom order. All-or-nothing: missing capability, materials
 * or coins leave every owner unchanged. Materials are verified here and
 * consumed later at shared production completion.
 *
 * @domain settlements-npcs
 */
export function acceptArtisanOrder(input: {
  state: NpcAuthoritativeState
  economy: SettlementEconomy
  household: Household
  playerInventory: Inventory
  productionId: string
  simTime: number
}): AcceptArtisanOrderResult {
  const profile = input.state.artisanProfile
  const def = productionDefById(input.productionId)
  if (!profile || !def || def.role !== 'blacksmith') return { ok: false, reason: 'unavailable' }
  const craft = resolveArtisanCraft(profile, def)
  if (!craft.canCraft) {
    return { ok: false, reason: craft.reason === 'insufficient-skill' ? 'insufficient-skill' : 'unavailable' }
  }
  const missing = missingArtisanMaterials(
    def,
    (kind) => isEconomicKind(kind) ? input.economy.query(kind) : 0,
    input.household.items,
  )
  if (missing.length > 0) return { ok: false, reason: 'missing-materials', missing }
  const deposit = artisanMaterialDepositValue(def)
  if (deposit > 0) {
    const personal = input.state.personalInventory
    const householdItems = input.household.items
    if (!input.playerInventory.has('coin', deposit)) return { ok: false, reason: 'cannot-afford' }
    const toPersonal = personal.canAdd('coin', deposit)
    if (!toPersonal && !householdItems.canAdd('coin', deposit)) return { ok: false, reason: 'cannot-afford' }
    if (!input.playerInventory.remove('coin', deposit)) return { ok: false, reason: 'cannot-afford' }
    if (toPersonal) personal.add('coin', deposit)
    else householdItems.add('coin', deposit)
  }

  const seq = input.state.artisanOrders.length
  const order: ArtisanOrder = {
    id: `${input.state.id}:order:${seq}:${def.id}`,
    artisanNpcId: input.state.id,
    customer: 'player',
    productionId: def.id,
    status: 'accepted',
    createdAt: input.simTime,
    paidMaterialCost: deposit,
    requiredMaterials: requiredMaterialsOf(def),
    outputKind: artisanOutputKind(def) ?? undefined,
  }
  input.state.artisanOrders.push(order)
  return { ok: true, order }
}

function createCraftedOutput(
  kind: ItemKind,
  quality: ArmorQuality,
  instanceId: string,
): ItemInstance | null {
  if (isArmorKind(kind)) return createArmorInstance(kind, quality, instanceId)
  if (!isInstanceBackedKind(kind)) return null
  const acquired = createAcquiredInstance(kind)
  if (!acquired) return null
  return { ...acquired, id: instanceId }
}

export type CompleteArtisanOrderResult =
  | { ok: true, order: ArtisanOrder }
  | { ok: false, reason: 'not-found' | 'blocked' }

/**
 * Complete one accepted order through the shared production executor.
 *
 * @domain settlements-npcs
 */
export function completeArtisanOrder(input: {
  state: NpcAuthoritativeState
  economy: SettlementEconomy
  household: Household
  orderId: string
  simTime: number
}): CompleteArtisanOrderResult {
  const order = input.state.artisanOrders.find((entry) => entry.id === input.orderId)
  if (!order || (order.status !== 'accepted' && order.status !== 'in_progress')) {
    return { ok: false, reason: 'not-found' }
  }
  const def = productionDefById(order.productionId)
  const profile = input.state.artisanProfile
  if (!def || !profile || !artisanCanCraft(profile, def)) return { ok: false, reason: 'blocked' }

  const craft = resolveArtisanCraft(profile, def)
  const quality = resolveArtisanCraftedQuality({
    effectiveSkill: craft.effectiveSkill,
    difficulty: def.artisan?.difficulty ?? 40,
    eventId: order.id,
  })
  const outputKind = artisanOutputKind(def)
  const instanceId = `${order.id}:output`
  const instance = outputKind && isInstanceBackedKind(outputKind)
    ? createCraftedOutput(outputKind, quality, instanceId)
    : null

  const preflight = preflightProductionInputs(def, {
    economy: input.economy,
    inventory: input.household.items,
    itemOutputInstances: instance ? [instance] : undefined,
  })
  if (!preflight.ok) return { ok: false, reason: 'blocked' }

  order.status = 'in_progress'
  const result = executeProduction(def, {
    economy: input.economy,
    inventory: input.household.items,
    simTime: input.simTime,
    itemOutputInstances: instance ? [instance] : undefined,
  })
  if (!result.ok) {
    order.status = 'accepted'
    return { ok: false, reason: 'blocked' }
  }

  order.status = 'ready'
  order.outputQuality = quality
  if (instance) order.outputInstanceId = instance.id
  if (outputKind) order.outputKind = outputKind
  noteArtisanProductionCompleted(profile, def.artisan?.difficulty ?? 40)
  return { ok: true, order }
}

export type PickupArtisanOrderResult =
  | { ok: true, order: ArtisanOrder }
  | { ok: false, reason: 'not-ready' | 'missing-output' | 'full' }

/**
 * Transfer the exact produced output to the player once.
 *
 * @domain settlements-npcs
 */
export function pickupArtisanOrder(input: {
  state: NpcAuthoritativeState
  household: Household
  playerInventory: Inventory
  orderId: string
  simTime?: number
}): PickupArtisanOrderResult {
  const order = input.state.artisanOrders.find((entry) => entry.id === input.orderId)
  if (!order || order.status !== 'ready') return { ok: false, reason: 'not-ready' }

  if (order.outputInstanceId) {
    const moved = transferInventoryInstance(
      input.household.items,
      input.playerInventory,
      order.outputInstanceId,
    )
    if (!moved) {
      const stillThere = input.household.items.getInstance(order.outputInstanceId)
      return { ok: false, reason: stillThere ? 'full' : 'missing-output' }
    }
    order.status = 'collected'
    return { ok: true, order }
  }

  const kind = order.outputKind as ItemKind | undefined
  if (!kind) return { ok: false, reason: 'missing-output' }
  if (!transferInventoryCount(input.household.items, input.playerInventory, kind, 1, input.simTime ?? 0)) {
    return { ok: false, reason: input.household.items.has(kind, 1) ? 'full' : 'missing-output' }
  }
  order.status = 'collected'
  return { ok: true, order }
}

export function nextCompletableArtisanOrder(
  orders: readonly ArtisanOrder[] | null | undefined,
): ArtisanOrder | null {
  if (!orders) return null
  return orders.find((order) => order.status === 'accepted' || order.status === 'in_progress') ?? null
}
