import type { Resistance } from '../combat/damageTypes'
import type { HumanProtection } from '../combat/hitLocation'
import type {
  EquipmentSlot,
  EquipmentState,
  ProtectionSnapshot,
} from '../items/equipment'
import type { EquipmentPositionKey } from '../items/equipmentTypes'
import type { Inventory } from '../items/Inventory'
import type {
  AttributeModifierContribution,
  EffectivePhysicalAttributesResult,
  ModifierCategory,
} from '../shared/effectivePhysicalAttributes'
import { expectedProtection } from '../combat/hitLocation'
import { type ExpectedProtectionByProfile, expectedProtectionByProfile, ZERO_PROTECTION_VIEW, ZERO_RESISTANCE_VIEW } from '../items/armorProtectionDisplay'
import {
  EQUIPMENT_POSITIONS,
  equipmentPositionLabel,
  equippedInstanceId,
  rangedStaminaMultiplierFor,
} from '../items/equipment'
import { itemDisplayName } from '../items/itemDisplay'
import { ARMOR_QUALITY_LABELS, isArmorItemInstance } from '../items/itemInstances'
import {
  PHYSICAL_ATTRIBUTE_IDS,
  type PhysicalAttributeDelta,
  type PhysicalAttributeId,
  type PhysicalAttributes,
} from '../shared/PhysicalAttributes'
import {
  poisoningSeverityTier,
  type TemporaryConditionsState,
} from '../shared/temporaryConditions'
import { type PlayerSkills, SKILL_IDS, type SkillId } from './PlayerSkills'

/**
 * @domain items-player
 * @system player-ui
 * @role Character Screen presentation snapshot (plan ui-input-013). Vue
 *  renders these views; it does not own modifier formulas or effective SPEA.
 *  Not persisted — rebuilt from authoritative player/condition/skill state.
 */

export const ATTRIBUTE_DISPLAY_SCALE = 100

const MODIFIER_CATEGORY_ORDER: readonly ModifierCategory[] = [
  'illness',
  'injury',
  'fatigue',
  'effect',
]

const POISONING_LABEL = 'Zatrucie'
const POISONING_SEVERITY_LABEL = {
  mild: 'łagodne',
  moderate: 'umiarkowane',
  severe: 'ciężkie',
} as const

export type CharacterModifierBadge = {
  category: ModifierCategory
  delta: number
}

export type CharacterAttributeView = {
  id: PhysicalAttributeId
  base: number
  effective: number
  modifiers: readonly CharacterModifierBadge[]
}

export type CharacterSkillView = {
  id: SkillId
  value: number
  xp: number
}

export type CharacterConditionEffectView = {
  id: PhysicalAttributeId
  delta: number
}

export type CharacterConditionView = {
  sourceId: string
  category: ModifierCategory
  label: string
  severityLabel?: string
  effects: readonly CharacterConditionEffectView[]
}

/** One worn position (`slot:layer`) on the Character Screen. */
export type CharacterEquipmentSlotView = {
  position: EquipmentPositionKey
  slot: EquipmentSlot
  /** `Tułów · Wierzch`. */
  positionLabel: string
  itemLabel: string | null
  qualityLabel: string | null
}

export type CharacterEquipmentView = {
  /** Reference-profile expected protection per physical channel (UI-only, never a hit multiplier). */
  expectedProtection: Resistance
  /** Expected protection per switchable hit profile (UI-only). */
  expectedByProfile: ExpectedProtectionByProfile
  /** Local 7 x 3 resistance table the expected values derive from. */
  protection: HumanProtection
  attackStaminaDelta: number
  /** Ranged draw stamina follows half of the melee armor penalty (proposal 5.2). */
  rangedStaminaDelta: number
  meleeRecoveryDelta: number
  movementSpeedDelta: number
  sprintStaminaDelta: number
  slots: readonly CharacterEquipmentSlotView[]
}

export type CharacterPresentation = {
  attributes: readonly CharacterAttributeView[]
  skills: readonly CharacterSkillView[]
  conditions: readonly CharacterConditionView[]
  equipment: CharacterEquipmentView
}

function slotViewFor(position: EquipmentPositionKey, itemLabel: string | null, qualityLabel: string | null): CharacterEquipmentSlotView {
  return {
    position,
    slot: position.split(':')[0] as EquipmentSlot,
    positionLabel: equipmentPositionLabel(position),
    itemLabel,
    qualityLabel,
  }
}

const EMPTY_EQUIPMENT_SLOTS: readonly CharacterEquipmentSlotView[] = EQUIPMENT_POSITIONS.map((position) => slotViewFor(position, null, null))

export const NEUTRAL_CHARACTER_EQUIPMENT_VIEW: CharacterEquipmentView = {
  expectedProtection: ZERO_RESISTANCE_VIEW,
  expectedByProfile: expectedProtectionByProfile(ZERO_PROTECTION_VIEW),
  protection: ZERO_PROTECTION_VIEW,
  attackStaminaDelta: 0,
  rangedStaminaDelta: 0,
  meleeRecoveryDelta: 0,
  movementSpeedDelta: 0,
  sprintStaminaDelta: 0,
  slots: EMPTY_EQUIPMENT_SLOTS,
}

/**
 * Maps the derived protection snapshot to Character Screen values: per-channel expected
 * protection (reference profile) plus restriction deltas.
 *
 * @domain items-player
 */
export function equipmentSnapshotToCharacterView(
  snapshot: ProtectionSnapshot,
): Omit<CharacterEquipmentView, 'slots'> {
  const modifiers = snapshot.restrictions
  return {
    expectedProtection: expectedProtection(snapshot.protection),
    expectedByProfile: expectedProtectionByProfile(snapshot.protection),
    protection: snapshot.protection,
    attackStaminaDelta: modifiers.meleeStaminaMultiplier - 1,
    rangedStaminaDelta: rangedStaminaMultiplierFor(modifiers.meleeStaminaMultiplier) - 1,
    meleeRecoveryDelta: modifiers.meleeRecoveryMultiplier - 1,
    movementSpeedDelta: modifiers.movementSpeedMultiplier - 1,
    sprintStaminaDelta: modifiers.sprintStaminaMultiplier - 1,
  }
}

export function buildCharacterEquipmentSlotViews(
  equipment: EquipmentState,
  inventory: Inventory,
): CharacterEquipmentSlotView[] {
  return EQUIPMENT_POSITIONS.map((position) => {
    const instanceId = equippedInstanceId(equipment, inventory, position)
    const instance = instanceId ? inventory.getInstance(instanceId) : null
    if (!instance || !isArmorItemInstance(instance)) return slotViewFor(position, null, null)
    return slotViewFor(position, itemDisplayName(instance.kind), ARMOR_QUALITY_LABELS[instance.quality])
  })
}

/**
 * Character Screen equipment snapshot from authoritative equipment state.
 *
 * @domain items-player
 */
export function buildCharacterEquipmentView(
  snapshot: ProtectionSnapshot,
  equipment: EquipmentState,
  inventory: Inventory,
): CharacterEquipmentView {
  return {
    ...equipmentSnapshotToCharacterView(snapshot),
    slots: buildCharacterEquipmentSlotViews(equipment, inventory),
  }
}

export function toDisplayAttribute(value: number): number {
  return Math.round(value * ATTRIBUTE_DISPLAY_SCALE)
}

export function toDisplaySkill(value: number): number {
  return Math.round(value * ATTRIBUTE_DISPLAY_SCALE)
}

/**
 * Collapses same-category contributions per attribute into one badge.
 * `delta` is display-scale (same units as `effective / base`).
 */
export function aggregateAttributeModifierBadges(
  contributions: readonly AttributeModifierContribution[],
  attributeId: PhysicalAttributeId,
): CharacterModifierBadge[] {
  const sums = new Map<ModifierCategory, number>()
  for (const contribution of contributions) {
    const change = contribution.delta[attributeId]
    if (change === undefined || change === 0) continue
    sums.set(contribution.category, (sums.get(contribution.category) ?? 0) + change)
  }
  const badges: CharacterModifierBadge[] = []
  for (const category of MODIFIER_CATEGORY_ORDER) {
    const sum = sums.get(category)
    if (sum === undefined) continue
    const delta = Math.round(sum * ATTRIBUTE_DISPLAY_SCALE)
    if (delta === 0) continue
    badges.push({ category, delta })
  }
  return badges
}

export function buildCharacterAttributeViews(
  base: PhysicalAttributes,
  result: EffectivePhysicalAttributesResult,
): CharacterAttributeView[] {
  return PHYSICAL_ATTRIBUTE_IDS.map((id) => ({
    id,
    base: toDisplayAttribute(base[id]),
    effective: toDisplayAttribute(result.effective[id]),
    modifiers: aggregateAttributeModifierBadges(result.contributions, id),
  }))
}

export function buildCharacterSkillViews(skills: PlayerSkills): CharacterSkillView[] {
  return SKILL_IDS.map((id) => ({
    id,
    value: toDisplaySkill(skills[id].value),
    xp: skills[id].xp,
  }))
}

export function buildCharacterConditionViews(
  contributions: readonly AttributeModifierContribution[],
  conditions: TemporaryConditionsState,
): CharacterConditionView[] {
  const bySource = new Map<string, { category: ModifierCategory, deltas: PhysicalAttributeDelta }>()
  for (const contribution of contributions) {
    const existing = bySource.get(contribution.sourceId)
    if (!existing) {
      bySource.set(contribution.sourceId, {
        category: contribution.category,
        deltas: { ...contribution.delta },
      })
      continue
    }
    for (const id of PHYSICAL_ATTRIBUTE_IDS) {
      const change = contribution.delta[id]
      if (change === undefined || change === 0) continue
      existing.deltas[id] = (existing.deltas[id] ?? 0) + change
    }
  }

  const views: CharacterConditionView[] = []
  for (const [sourceId, grouped] of bySource) {
    const effects: CharacterConditionEffectView[] = []
    for (const id of PHYSICAL_ATTRIBUTE_IDS) {
      const change = grouped.deltas[id]
      if (change === undefined || change === 0) continue
      const delta = Math.round(change * ATTRIBUTE_DISPLAY_SCALE)
      if (delta === 0) continue
      effects.push({ id, delta })
    }
    if (effects.length === 0) continue
    views.push({
      sourceId,
      category: grouped.category,
      ...describeConditionSource(sourceId, conditions),
      effects,
    })
  }
  return views
}

function describeConditionSource(
  sourceId: string,
  conditions: TemporaryConditionsState,
): { label: string, severityLabel?: string } {
  if (sourceId === 'poisoning') {
    const severity = conditions.conditions.poisoning?.severity ?? 0
    const tier = poisoningSeverityTier(severity)
    return {
      label: POISONING_LABEL,
      severityLabel: tier ? POISONING_SEVERITY_LABEL[tier] : undefined,
    }
  }
  if (sourceId === 'physical-injury') {
    return { label: 'Uraz' }
  }
  return { label: sourceId }
}

/**
 * Presentation-only snapshot for Character Screen. Does not mutate
 * conditions; callers must already have resolved them via the effective
 * SPEA pass that produced `result`.
 */
export function buildCharacterPresentation(input: {
  base: PhysicalAttributes
  result: EffectivePhysicalAttributesResult
  skills: PlayerSkills
  conditions: TemporaryConditionsState
  equipmentSnapshot: ProtectionSnapshot
  equipment: EquipmentState
  inventory: Inventory
}): CharacterPresentation {
  return {
    attributes: buildCharacterAttributeViews(input.base, input.result),
    skills: buildCharacterSkillViews(input.skills),
    conditions: buildCharacterConditionViews(input.result.contributions, input.conditions),
    equipment: buildCharacterEquipmentView(
      input.equipmentSnapshot,
      input.equipment,
      input.inventory,
    ),
  }
}
