import type { Resistance } from '../combat/damageTypes'
import type { HumanProtection } from '../combat/hitLocation'
import type { EquipmentPositionKey } from './equipmentTypes'
import type { Inventory } from './Inventory'
import { equipmentSnapshotToCharacterView } from '../player/characterPresentation'
import {
  type EffectiveArmorPiece,
  resolveEffectiveArmorPiece,
} from './armorItemInstances'
import { type ExpectedProtectionByProfile, expectedProtectionByProfile, PROTECTION_PROFILE_KEYS, ZERO_PROTECTION_VIEW, ZERO_RESISTANCE_VIEW } from './armorProtectionDisplay'
import {
  armorPositionOf,
  buildProtectionSnapshot,
  createEquipmentState,
  EQUIPMENT_POSITIONS,
  EQUIPMENT_SLOTS,
  equipmentPositionLabel,
  equippedArmorInstances,
  type ProtectionSnapshot,
  resolveProtectionSnapshot,
  type SavePlayerEquipment,
  type WornArmorPiece,
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
  /** Reference-profile expected protection per channel (UI-only); the delta view holds signed differences. */
  expectedProtection: Resistance
  /** Expected protection per switchable hit profile (UI-only). */
  expectedByProfile: ExpectedProtectionByProfile
  /** Local 7 x 3 resistance table (per anatomical region, under+outer composed). */
  protection: HumanProtection
  attackStaminaDelta: number
  rangedStaminaDelta: number
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
  /** Exact position the candidate would occupy (`slot:layer`); drives panel highlight. */
  targetPosition: EquipmentPositionKey | null
  /** Item currently worn at exactly that position (displaced by the candidate). */
  replacesLabel: string | null
  alreadyEquipped: boolean
  /** Set when a candidate was requested but cannot be previewed (stale/unknown/not armor). */
  unavailableReason: string | null
}

const STALE_CANDIDATE_REASON = 'Przedmiot niedostępny — nie ma go już w ekwipunku'
const NOT_ARMOR_REASON = 'Ten przedmiot nie jest elementem pancerza'

function emptyPreview(current: LoadoutStatView, unavailableReason: string | null = null): EquipPreviewResult {
  return {
    current,
    proposed: null,
    delta: null,
    context: unavailableReason ?? '—',
    targetPosition: null,
    replacesLabel: null,
    alreadyEquipped: false,
    unavailableReason,
  }
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
    expectedProtection: ZERO_RESISTANCE_VIEW,
    expectedByProfile: expectedProtectionByProfile(ZERO_PROTECTION_VIEW),
    protection: ZERO_PROTECTION_VIEW,
    attackStaminaDelta: 0,
    rangedStaminaDelta: 0,
    meleeRecoveryDelta: 0,
    movementSpeedDelta: 0,
    sprintStaminaDelta: 0,
    gearWeightKg: 0,
  }
}

function snapshotToView(snapshot: ProtectionSnapshot, gearWeightKg: number): LoadoutStatView {
  return {
    ...equipmentSnapshotToCharacterView(snapshot),
    gearWeightKg,
  }
}

function subtractResistance(proposed: Resistance, current: Resistance): Resistance {
  return {
    cut: proposed.cut - current.cut,
    pierce: proposed.pierce - current.pierce,
    blunt: proposed.blunt - current.blunt,
  }
}

function deltaView(proposed: LoadoutStatView, current: LoadoutStatView): LoadoutStatView {
  return {
    expectedProtection: subtractResistance(proposed.expectedProtection, current.expectedProtection),
    expectedByProfile: Object.fromEntries(
      PROTECTION_PROFILE_KEYS.map((key) => [key, subtractResistance(proposed.expectedByProfile[key], current.expectedByProfile[key])]),
    ) as ExpectedProtectionByProfile,
    protection: Object.fromEntries(
      EQUIPMENT_SLOTS.map((slot) => [slot, subtractResistance(proposed.protection[slot], current.protection[slot])]),
    ) as HumanProtection,
    attackStaminaDelta: proposed.attackStaminaDelta - current.attackStaminaDelta,
    rangedStaminaDelta: proposed.rangedStaminaDelta - current.rangedStaminaDelta,
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
  slots: Partial<Record<EquipmentPositionKey, string>>,
  byId: ReadonlyMap<string, ArmorPreviewInstance>,
): { snapshot: ProtectionSnapshot, weightKg: number, labels: Partial<Record<EquipmentPositionKey, string>> } {
  const pieces: WornArmorPiece[] = []
  const labels: Partial<Record<EquipmentPositionKey, string>> = {}
  let weightKg = 0
  const seen = new Set<string>()
  for (const position of EQUIPMENT_POSITIONS) {
    const id = slots[position]
    if (!id || seen.has(id)) continue
    const row = byId.get(id)
    if (!row) continue
    const piece = pieceForSnapshot(row)
    if (!piece || armorPositionOf(row.kind) !== position) continue
    seen.add(id)
    pieces.push({ ...piece, instanceId: id, position })
    weightKg += piece.weightKg
    labels[position] = row.label
  }
  return {
    snapshot: buildProtectionSnapshot(pieces),
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
  const current = snapshotToView(
    resolveProtectionSnapshot(currentEq, inventory),
    gearWeightKg(currentEq, inventory),
  )

  if (!candidateInstanceId) return emptyPreview(current)

  const candidate = inventory.getInstance(candidateInstanceId)
  if (!candidate) return emptyPreview(current, STALE_CANDIDATE_REASON)
  if (!isArmorItemInstance(candidate) || !isArmorCatalogKind(candidate.kind)) return emptyPreview(current, NOT_ARMOR_REASON)

  const targetPosition = armorPositionOf(candidate.kind)!
  const existingId = currentEq.getPosition(targetPosition)
  if (existingId === candidate.id) {
    return { ...emptyPreview(current), context: 'Już założone', targetPosition, alreadyEquipped: true }
  }

  const replaced = existingId ? inventory.getInstance(existingId) : null
  const replacesLabel = replaced && isArmorItemInstance(replaced)
    ? itemDisplayName(replaced.kind)
    : null

  const nextSlots: SavePlayerEquipment = { ...currentEq.exportState(inventory) }
  for (const position of EQUIPMENT_POSITIONS) {
    if (nextSlots[position] === candidate.id) delete nextSlots[position]
  }
  nextSlots[targetPosition] = candidate.id

  const previewEq = createEquipmentState(inventory, nextSlots)
  const proposed = snapshotToView(
    resolveProtectionSnapshot(previewEq, inventory),
    gearWeightKg(previewEq, inventory),
  )

  return {
    current,
    proposed,
    delta: deltaView(proposed, current),
    context: previewContext(targetPosition, replacesLabel),
    targetPosition,
    replacesLabel,
    alreadyEquipped: false,
    unavailableReason: null,
  }
}

/** `Zastępuje (Tułów · Wierzch): X` / `Założenie: Tułów · Wierzch (pusta pozycja)`. */
function previewContext(position: EquipmentPositionKey, replacesLabel: string | null): string {
  const where = equipmentPositionLabel(position)
  return replacesLabel ? `Zastępuje (${where}): ${replacesLabel}` : `Założenie: ${where} (pusta pozycja)`
}

/**
 * UI snapshot preview — same math as {@link previewEquipLoadout} without Inventory.
 * Callers must pass every equipped + candidate armor instance row.
 *
 * @domain items-player
 */
export function previewEquipLoadoutFromSnapshot(
  equippedSlots: Partial<Record<EquipmentPositionKey, string>>,
  instances: readonly ArmorPreviewInstance[],
  candidateInstanceId: string | null | undefined,
): EquipPreviewResult {
  const byId = new Map(instances.map((row) => [row.id, row]))
  const currentPack = loadoutFromSlots(equippedSlots, byId)
  const current = snapshotToView(currentPack.snapshot, currentPack.weightKg)

  if (!candidateInstanceId) return emptyPreview(current)

  const candidate = byId.get(candidateInstanceId)
  if (!candidate) return emptyPreview(current, STALE_CANDIDATE_REASON)
  if (!isArmorCatalogKind(candidate.kind)) return emptyPreview(current, NOT_ARMOR_REASON)

  const targetPosition = armorPositionOf(candidate.kind)!
  const existingId = equippedSlots[targetPosition] ?? null
  if (existingId === candidate.id) {
    return { ...emptyPreview(current), context: 'Już założone', targetPosition, alreadyEquipped: true }
  }

  const replacesLabel = existingId ? (byId.get(existingId)?.label ?? null) : null
  const nextSlots: Partial<Record<EquipmentPositionKey, string>> = { ...equippedSlots }
  for (const position of EQUIPMENT_POSITIONS) {
    if (nextSlots[position] === candidate.id) delete nextSlots[position]
  }
  nextSlots[targetPosition] = candidate.id

  const proposedPack = loadoutFromSlots(nextSlots, byId)
  const proposed = snapshotToView(proposedPack.snapshot, proposedPack.weightKg)

  return {
    current,
    proposed,
    delta: deltaView(proposed, current),
    context: previewContext(targetPosition, replacesLabel),
    targetPosition,
    replacesLabel,
    alreadyEquipped: false,
    unavailableReason: null,
  }
}
