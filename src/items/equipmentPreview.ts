import type { Inventory } from './Inventory'
import { equipmentModifiersToCharacterView } from '../player/characterPresentation'
import {
  type EffectiveArmorPiece,
  resolveEffectiveArmorPiece,
} from './armorItemInstances'
import {
  composeEquipmentModifiers,
  createEquipmentState,
  EQUIPMENT_SLOT_LABEL,
  EQUIPMENT_SLOTS,
  type EquipmentModifiers,
  type EquipmentSlot,
  equippedArmorInstances,
  NEUTRAL_EQUIPMENT_MODIFIERS,
  resolveEquipmentModifiers,
  type SavePlayerEquipment,
} from './equipment'
import { isArmorCatalogKind, ITEM_CATALOG } from './itemCatalog'
import { itemDisplayName } from './itemDisplay'
import {
  type ArmorQuality,
  isArmorItemInstance,
  normalizeArmorQuality,
} from './itemInstances'
import { ITEM_DEFS, type ItemKind } from './items'

/** UI/loadout totals derived from the same resolver Character Screen uses. */
export type LoadoutStatView = {
  damageReduction: number
  attackStaminaDelta: number
  meleeRecoveryDelta: number
  movementSpeedDelta: number
  sprintStaminaDelta: number
  gearWeightKg: number
}

export type EquipPreviewResult = {
  current: LoadoutStatView
  proposed: LoadoutStatView | null
  delta: LoadoutStatView | null
  context: string
  targetSlot: EquipmentSlot | null
  replacesLabel: string | null
  alreadyEquipped: boolean
}

/** Snapshot row for UI-only preview (no Inventory mutation / no second Inventory). */
export type ArmorPreviewInstance = {
  id: string
  kind: ItemKind
  quality: ArmorQuality
  label: string
}

export function emptyLoadoutStats(): LoadoutStatView {
  return {
    damageReduction: 0,
    attackStaminaDelta: 0,
    meleeRecoveryDelta: 0,
    movementSpeedDelta: 0,
    sprintStaminaDelta: 0,
    gearWeightKg: 0,
  }
}

function modifiersToView(mods: EquipmentModifiers, gearWeightKg: number): LoadoutStatView {
  return {
    ...equipmentModifiersToCharacterView(mods),
    gearWeightKg,
  }
}

function deltaView(proposed: LoadoutStatView, current: LoadoutStatView): LoadoutStatView {
  return {
    damageReduction: proposed.damageReduction - current.damageReduction,
    attackStaminaDelta: proposed.attackStaminaDelta - current.attackStaminaDelta,
    meleeRecoveryDelta: proposed.meleeRecoveryDelta - current.meleeRecoveryDelta,
    movementSpeedDelta: proposed.movementSpeedDelta - current.movementSpeedDelta,
    sprintStaminaDelta: proposed.sprintStaminaDelta - current.sprintStaminaDelta,
    gearWeightKg: proposed.gearWeightKg - current.gearWeightKg,
  }
}

function gearWeightKg(equipment: ReturnType<typeof createEquipmentState>, inventory: Inventory): number {
  let total = 0
  for (const instance of equippedArmorInstances(equipment, inventory)) {
    const armor = ITEM_CATALOG[instance.kind].armor
    if (!armor) continue
    total += resolveEffectiveArmorPiece(armor, instance.quality, ITEM_DEFS[instance.kind].weight).weightKg
  }
  return total
}

function pieceForSnapshot(row: ArmorPreviewInstance): EffectiveArmorPiece | null {
  if (!isArmorCatalogKind(row.kind)) return null
  const armor = ITEM_CATALOG[row.kind].armor
  if (!armor) return null
  return resolveEffectiveArmorPiece(armor, normalizeArmorQuality(row.quality), ITEM_DEFS[row.kind].weight)
}

function loadoutFromSlots(
  slots: Partial<Record<EquipmentSlot, string>>,
  byId: ReadonlyMap<string, ArmorPreviewInstance>,
): { mods: EquipmentModifiers, weightKg: number, labels: Partial<Record<EquipmentSlot, string>> } {
  const pieces: EffectiveArmorPiece[] = []
  const labels: Partial<Record<EquipmentSlot, string>> = {}
  let weightKg = 0
  const seen = new Set<string>()
  for (const slot of EQUIPMENT_SLOTS) {
    const id = slots[slot]
    if (!id || seen.has(id)) continue
    const row = byId.get(id)
    if (!row) continue
    const piece = pieceForSnapshot(row)
    if (!piece || piece.slot !== slot) continue
    seen.add(id)
    pieces.push(piece)
    weightKg += piece.weightKg
    labels[slot] = row.label
  }
  return {
    mods: pieces.length === 0 ? NEUTRAL_EQUIPMENT_MODIFIERS : composeEquipmentModifiers(pieces),
    weightKg,
    labels,
  }
}

/**
 * Pure equipment comparison preview. Builds a temporary EquipmentState from
 * `currentSlots` — never mutates the caller's live equipment or inventory.
 *
 * @domain items-player
 */
export function previewEquipLoadout(
  inventory: Inventory,
  currentSlots: SavePlayerEquipment,
  candidateInstanceId: string | null | undefined,
): EquipPreviewResult {
  const slotsSnapshot: SavePlayerEquipment = { ...currentSlots }
  const currentEq = createEquipmentState(inventory, slotsSnapshot)
  const current = modifiersToView(
    resolveEquipmentModifiers(currentEq, inventory),
    gearWeightKg(currentEq, inventory),
  )

  if (!candidateInstanceId) {
    return {
      current,
      proposed: null,
      delta: null,
      context: '—',
      targetSlot: null,
      replacesLabel: null,
      alreadyEquipped: false,
    }
  }

  const candidate = inventory.getInstance(candidateInstanceId)
  if (!candidate || !isArmorItemInstance(candidate) || !isArmorCatalogKind(candidate.kind)) {
    return {
      current,
      proposed: null,
      delta: null,
      context: '—',
      targetSlot: null,
      replacesLabel: null,
      alreadyEquipped: false,
    }
  }

  const targetSlot = ITEM_CATALOG[candidate.kind].armor!.slot
  const existingId = currentEq.getSlot(targetSlot)
  if (existingId === candidate.id) {
    return {
      current,
      proposed: null,
      delta: null,
      context: 'Już założone',
      targetSlot,
      replacesLabel: null,
      alreadyEquipped: true,
    }
  }

  const replaced = existingId ? inventory.getInstance(existingId) : null
  const replacesLabel = replaced && isArmorItemInstance(replaced)
    ? itemDisplayName(replaced.kind)
    : null

  const nextSlots: SavePlayerEquipment = { ...currentEq.exportState(inventory) }
  for (const slot of EQUIPMENT_SLOTS) {
    if (nextSlots[slot] === candidate.id) delete nextSlots[slot]
  }
  nextSlots[targetSlot] = candidate.id

  const previewEq = createEquipmentState(inventory, nextSlots)
  const proposed = modifiersToView(
    resolveEquipmentModifiers(previewEq, inventory),
    gearWeightKg(previewEq, inventory),
  )

  return {
    current,
    proposed,
    delta: deltaView(proposed, current),
    context: replacesLabel
      ? `Zastępuje: ${replacesLabel}`
      : `Założenie w pusty slot: ${EQUIPMENT_SLOT_LABEL[targetSlot]}`,
    targetSlot,
    replacesLabel,
    alreadyEquipped: false,
  }
}

/**
 * UI snapshot preview — same math as {@link previewEquipLoadout} without Inventory.
 * Callers must pass every equipped + candidate armor instance row.
 *
 * @domain items-player
 */
export function previewEquipLoadoutFromSnapshot(
  equippedSlots: Partial<Record<EquipmentSlot, string>>,
  instances: readonly ArmorPreviewInstance[],
  candidateInstanceId: string | null | undefined,
): EquipPreviewResult {
  const byId = new Map(instances.map((row) => [row.id, row]))
  const currentPack = loadoutFromSlots(equippedSlots, byId)
  const current = modifiersToView(currentPack.mods, currentPack.weightKg)

  if (!candidateInstanceId) {
    return {
      current,
      proposed: null,
      delta: null,
      context: '—',
      targetSlot: null,
      replacesLabel: null,
      alreadyEquipped: false,
    }
  }

  const candidate = byId.get(candidateInstanceId)
  if (!candidate || !isArmorCatalogKind(candidate.kind)) {
    return {
      current,
      proposed: null,
      delta: null,
      context: '—',
      targetSlot: null,
      replacesLabel: null,
      alreadyEquipped: false,
    }
  }

  const targetSlot = ITEM_CATALOG[candidate.kind].armor!.slot
  const existingId = equippedSlots[targetSlot] ?? null
  if (existingId === candidate.id) {
    return {
      current,
      proposed: null,
      delta: null,
      context: 'Już założone',
      targetSlot,
      replacesLabel: null,
      alreadyEquipped: true,
    }
  }

  const replacesLabel = existingId ? (byId.get(existingId)?.label ?? null) : null
  const nextSlots: Partial<Record<EquipmentSlot, string>> = { ...equippedSlots }
  for (const slot of EQUIPMENT_SLOTS) {
    if (nextSlots[slot] === candidate.id) delete nextSlots[slot]
  }
  nextSlots[targetSlot] = candidate.id

  const proposedPack = loadoutFromSlots(nextSlots, byId)
  const proposed = modifiersToView(proposedPack.mods, proposedPack.weightKg)

  return {
    current,
    proposed,
    delta: deltaView(proposed, current),
    context: replacesLabel
      ? `Zastępuje: ${replacesLabel}`
      : `Założenie w pusty slot: ${EQUIPMENT_SLOT_LABEL[targetSlot]}`,
    targetSlot,
    replacesLabel,
    alreadyEquipped: false,
  }
}
