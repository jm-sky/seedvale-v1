import type { HumanProtection } from '../combat/hitLocation'
import type { Inventory } from './Inventory'
import type { ArmorItemInstance, ItemInstance } from './itemInstances'
import { composeLocalResistance, type Resistance } from '../combat/damageTypes'
import {
  type EffectiveArmorPiece,
  isArmorItemInstance,
  resolveEffectiveArmorPiece,
} from './armorItemInstances'
import {
  ARMOR_LAYERS,
  type ArmorLayer,
  type EquipmentPositionKey,
  equipmentPositionKey,
  type EquipmentSlot,
} from './equipmentTypes'
import {
  isArmorCatalogKind,
  ITEM_CATALOG,
} from './itemCatalog'
import { ITEM_DEFS, type ItemKind } from './items'

/** Wearable-equipment slots (plan items-player-030). */
export type { EquipmentSlot } from './equipmentTypes'

export const EQUIPMENT_SLOTS: readonly EquipmentSlot[] = [
  'head',
  'body',
  'shoulders',
  'forearms',
  'hands',
  'legs',
  'feet',
]

/** Player-facing labels for equipment slots (inventory + Character Screen). */
export const EQUIPMENT_SLOT_LABEL: Record<EquipmentSlot, string> = {
  head: 'Głowa',
  body: 'Tułów',
  shoulders: 'Naramienniki',
  forearms: 'Przedramiona',
  hands: 'Dłonie',
  legs: 'Nogi',
  feet: 'Stopy',
}

/** Player-facing labels for armor layers (equipment panel, preview, item details). */
export const EQUIPMENT_LAYER_LABEL: Record<ArmorLayer, string> = {
  under: 'Spód',
  outer: 'Wierzch',
}

/** `Tułów · Wierzch` — one worn position, for panel rows, preview and details.
 * @domain ui-input
 */
export function equipmentPositionLabel(position: EquipmentPositionKey): string {
  const [slot, layer] = position.split(':') as [EquipmentSlot, ArmorLayer]
  return `${EQUIPMENT_SLOT_LABEL[slot]} · ${EQUIPMENT_LAYER_LABEL[layer]}`
}

/** Persisted equipment selection — instance IDs only, keyed by `slot:layer`;
 *  Inventory owns the items. */
export type SavePlayerEquipment = Partial<Record<EquipmentPositionKey, string>>

/** The 14 worn positions in canonical order: slot order, `under` then `outer`. */
export const EQUIPMENT_POSITIONS: readonly EquipmentPositionKey[] = EQUIPMENT_SLOTS.flatMap(
  (slot) => ARMOR_LAYERS.map((layer) => equipmentPositionKey(slot, layer)),
)

/** Derived gameplay restrictions of whatever is currently (validly) worn — the
 *  single shape every consumer (damage/melee/movement) reads. Neutral (`1`)
 *  means "no effect". Armor-only totals are clamped per proposal §5.2. */
export type EquipmentModifiers = {
  meleeStaminaMultiplier: number
  meleeRecoveryMultiplier: number
  movementSpeedMultiplier: number
  sprintStaminaMultiplier: number
}

export const NEUTRAL_EQUIPMENT_MODIFIERS: EquipmentModifiers = {
  meleeStaminaMultiplier: 1,
  meleeRecoveryMultiplier: 1,
  movementSpeedMultiplier: 1,
  sprintStaminaMultiplier: 1,
}

/** Result of {@link EquipmentState.equip}. */
export type EquipResult =
  | { ok: true, position: EquipmentPositionKey, replacedId: string | null }
  | { ok: false, reason: 'not-owned' | 'not-wearable' | 'invalid-position' }

/**
 * Actor-neutral wearable-equipment state (plans items-player-030, 065).
 * Owns only which owned instance is worn per `slot:layer` position;
 * Inventory remains sole owner.
 *
 * @domain items-player
 * @system equipment
 * @role Tracks which owned armor instance (if any) is worn in each of the 14 equipment positions.
 * @uses Inventory
 */
export type EquipmentState = {
  /** Raw stored instance id for a position — may be stale; prefer live-valid helpers. */
  getPosition: (position: EquipmentPositionKey) => string | null
  /** Equips a concrete owned armor instance; the position is inferred from the
   *  catalog (`armor.slot` + `armor.layer`). Replaces only that position's
   *  reference (the displaced item stays owned). Failures mutate nothing and
   *  do not bump the revision. */
  equip: (instanceId: string, inventory: Inventory) => EquipResult
  /** Clears one position. Bumps the selection revision only if it was occupied. */
  unequip: (position: EquipmentPositionKey) => void
  /** Drops references that are no longer live-valid for their position. */
  syncWithInventory: (inventory: Inventory) => void
  /** Live-valid references only, as position-keyed save data. */
  exportState: (inventory: Inventory) => SavePlayerEquipment
  /** Runtime-only counter bumped by every successful selection change
   *  (equip/unequip/sync that clears). Cache key part, never persisted. */
  readonly selectionRevision: number
}

export function isEquipmentSlot(value: unknown): value is EquipmentSlot {
  return typeof value === 'string' && (EQUIPMENT_SLOTS as readonly string[]).includes(value)
}

export function isEquipmentPositionKey(value: unknown): value is EquipmentPositionKey {
  return typeof value === 'string' && (EQUIPMENT_POSITIONS as readonly string[]).includes(value)
}

/** Catalog position of an armor kind, or null for non-armor. */
export function armorPositionOf(kind: ItemKind): EquipmentPositionKey | null {
  if (!isArmorCatalogKind(kind)) return null
  const armor = ITEM_CATALOG[kind].armor
  return armor ? equipmentPositionKey(armor.slot, armor.layer) : null
}

function liveValidArmorInstance(
  instanceId: string | null | undefined,
  inventory: Inventory,
  expectedPosition?: EquipmentPositionKey,
): ArmorItemInstance | null {
  if (!instanceId) return null
  const instance = inventory.getInstance(instanceId)
  if (!instance || !isArmorItemInstance(instance) || !isArmorCatalogKind(instance.kind)) return null
  if (expectedPosition != null && armorPositionOf(instance.kind) !== expectedPosition) return null
  return instance
}

/**
 * Restores from `initial` only when each saved instance id is still owned and
 * matches the position. Restore order is canonical (slot order, `under` then
 * `outer`); an instance already placed earlier is not placed again. Invalid
 * references resolve empty — items are kept, never recreated.
 *
 * @domain items-player
 */
export function createEquipmentState(inventory: Inventory, initial?: SavePlayerEquipment): EquipmentState {
  const positions = new Map<EquipmentPositionKey, string | null>(EQUIPMENT_POSITIONS.map((p) => [p, null]))
  let selectionRevision = 0

  if (initial) {
    const seen = new Set<string>()
    for (const position of EQUIPMENT_POSITIONS) {
      const raw = initial[position]
      if (typeof raw !== 'string' || raw.length === 0 || seen.has(raw)) continue
      const live = liveValidArmorInstance(raw, inventory, position)
      if (!live) continue
      seen.add(live.id)
      positions.set(position, live.id)
    }
  }

  return {
    get selectionRevision() {
      return selectionRevision
    },
    getPosition(position) {
      return positions.get(position) ?? null
    },
    equip(instanceId, inv) {
      const owned = inv.getInstance(instanceId)
      if (!owned) return { ok: false, reason: 'not-owned' }
      if (!isArmorItemInstance(owned) || !isArmorCatalogKind(owned.kind)) return { ok: false, reason: 'not-wearable' }
      const position = armorPositionOf(owned.kind)
      if (position == null) return { ok: false, reason: 'invalid-position' }
      const replacedId = positions.get(position) ?? null
      if (replacedId === owned.id) return { ok: true, position, replacedId: null }
      // One instance cannot occupy two positions.
      for (const p of EQUIPMENT_POSITIONS) {
        if (positions.get(p) === owned.id) positions.set(p, null)
      }
      positions.set(position, owned.id)
      selectionRevision++
      return { ok: true, position, replacedId }
    },
    unequip(position) {
      if (positions.get(position) == null) return
      positions.set(position, null)
      selectionRevision++
    },
    syncWithInventory(inv) {
      for (const position of EQUIPMENT_POSITIONS) {
        const id = positions.get(position) ?? null
        if (id != null && liveValidArmorInstance(id, inv, position) == null) {
          positions.set(position, null)
          selectionRevision++
        }
      }
    },
    exportState(inv) {
      const out: SavePlayerEquipment = {}
      for (const position of EQUIPMENT_POSITIONS) {
        const live = liveValidArmorInstance(positions.get(position), inv, position)
        if (live) out[position] = live.id
      }
      return out
    },
  }
}

/** Live-valid equipped armor instances across all positions (no ghosts). */
export function equippedArmorInstances(
  equipment: EquipmentState,
  inventory: Inventory,
): readonly ArmorItemInstance[] {
  const out: ArmorItemInstance[] = []
  const seen = new Set<string>()
  for (const position of EQUIPMENT_POSITIONS) {
    const live = liveValidArmorInstance(equipment.getPosition(position), inventory, position)
    if (!live || seen.has(live.id)) continue
    seen.add(live.id)
    out.push(live)
  }
  return out
}

/** Live-valid `body:outer` piece kind, or null. Presentation has no under-layer
 *  model, so `body:under` is deliberately not a fallback. */
export function equippedBodyArmor(equipment: EquipmentState, inventory: Inventory): ArmorItemInstance['kind'] | null {
  return liveValidArmorInstance(equipment.getPosition('body:outer'), inventory, 'body:outer')?.kind ?? null
}

/** Live-valid equipped instance id for a position, or null. */
export function equippedInstanceId(
  equipment: EquipmentState,
  inventory: Inventory,
  position: EquipmentPositionKey,
): string | null {
  return liveValidArmorInstance(equipment.getPosition(position), inventory, position)?.id ?? null
}

/** Map of position → live-valid equipped instance id. */
export function equippedInstanceIds(
  equipment: EquipmentState,
  inventory: Inventory,
): Partial<Record<EquipmentPositionKey, string>> {
  return equipment.exportState(inventory)
}

/** Worn piece with identity, as held by a {@link ProtectionSnapshot}. */
export type WornArmorPiece = EffectiveArmorPiece & {
  instanceId: string
  position: EquipmentPositionKey
}

/**
 * Everything derived from what is validly worn: pieces, per-slot 7x3 local
 * resistance and clamped restrictions. Built by one pure function shared by
 * combat (S3), NPC derivation and preview/UI (048). Never authority.
 *
 * @domain items-player
 */
export type ProtectionSnapshot = {
  pieces: readonly WornArmorPiece[]
  protection: HumanProtection
  restrictions: EquipmentModifiers
}

const ZERO_RESISTANCE: Resistance = { cut: 0, pierce: 0, blunt: 0 }

const MELEE_STAMINA_CLAMP = [1, 1.8] as const
const MELEE_RECOVERY_CLAMP = [1, 1.5] as const
const MOVEMENT_CLAMP = [0.75, 1] as const
const SPRINT_STAMINA_CLAMP = [1, 2] as const

function clamp(value: number, [min, max]: readonly [number, number]): number {
  return Math.min(max, Math.max(min, value))
}

/** Ranged draw stamina follows half of the armor melee-stamina penalty (proposal §5.2). */
export function rangedStaminaMultiplierFor(meleeStaminaMultiplier: number): number {
  return 1 + 0.5 * (meleeStaminaMultiplier - 1)
}

/**
 * Pure builder: per-slot resistance composes only `under` with `outer` of the
 * same slot (no cross-slot protection); restrictions multiply across pieces
 * and then take the armor-only clamps of proposal §5.2. Later duplicates of a
 * position (callers pass canonical order) are ignored.
 *
 * @domain items-player
 */
export function buildProtectionSnapshot(pieces: readonly WornArmorPiece[]): ProtectionSnapshot {
  const bySlot = new Map<EquipmentSlot, { under: Resistance, outer: Resistance }>()
  const used = new Set<EquipmentPositionKey>()
  const kept: WornArmorPiece[] = []
  let meleeStamina = 1
  let meleeRecovery = 1
  let movement = 1
  let sprint = 1
  for (const piece of pieces) {
    if (used.has(piece.position)) continue
    used.add(piece.position)
    kept.push(piece)
    const entry = bySlot.get(piece.slot) ?? { under: ZERO_RESISTANCE, outer: ZERO_RESISTANCE }
    entry[piece.layer] = piece.resist
    bySlot.set(piece.slot, entry)
    meleeStamina *= piece.staminaCostMultiplier
    meleeRecovery *= piece.meleeRecoveryMultiplier
    movement *= piece.movementSpeedMultiplier
    sprint *= piece.sprintStaminaMultiplier
  }
  const protection = Object.fromEntries(
    EQUIPMENT_SLOTS.map((slot) => {
      const entry = bySlot.get(slot)
      return [slot, entry ? composeLocalResistance(entry.under, entry.outer) : ZERO_RESISTANCE]
    }),
  ) as HumanProtection
  return {
    pieces: kept,
    protection,
    restrictions: kept.length === 0
      ? NEUTRAL_EQUIPMENT_MODIFIERS
      : {
          meleeStaminaMultiplier: clamp(meleeStamina, MELEE_STAMINA_CLAMP),
          meleeRecoveryMultiplier: clamp(meleeRecovery, MELEE_RECOVERY_CLAMP),
          movementSpeedMultiplier: clamp(movement, MOVEMENT_CLAMP),
          sprintStaminaMultiplier: clamp(sprint, SPRINT_STAMINA_CLAMP),
        },
  }
}

/** Effective worn piece for one instance, with its catalog position. */
function wornPieceForInstance(instance: ArmorItemInstance): WornArmorPiece | null {
  const armor = ITEM_CATALOG[instance.kind].armor
  if (!armor) return null
  const piece = resolveEffectiveArmorPiece(armor, instance.quality, ITEM_DEFS[instance.kind].weight)
  return { ...piece, instanceId: instance.id, position: equipmentPositionKey(piece.slot, piece.layer) }
}

/**
 * Single derivation point for wearable-equipment protection and restrictions.
 *
 * @domain items-player
 */
export function resolveProtectionSnapshot(equipment: EquipmentState, inventory: Inventory): ProtectionSnapshot {
  const pieces: WornArmorPiece[] = []
  for (const instance of equippedArmorInstances(equipment, inventory)) {
    const piece = wornPieceForInstance(instance)
    if (piece) pieces.push(piece)
  }
  return buildProtectionSnapshot(pieces)
}

/**
 * Restriction view of {@link resolveProtectionSnapshot}.
 *
 * @domain items-player
 */
export function resolveEquipmentModifiers(equipment: EquipmentState, inventory: Inventory): EquipmentModifiers {
  return resolveProtectionSnapshot(equipment, inventory).restrictions
}

/** Effective display stats for one armor instance (UI + gameplay share this). */
export function resolveArmorInstanceEffective(instance: ItemInstance): EffectiveArmorPiece | null {
  if (!isArmorItemInstance(instance)) return null
  const worn = wornPieceForInstance(instance)
  if (!worn) return null
  const { instanceId: _id, position: _position, ...piece } = worn
  return piece
}
