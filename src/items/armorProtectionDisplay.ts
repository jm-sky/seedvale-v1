import type { DamageType, Resistance } from '../combat/damageTypes'
import type { HitProfile, HumanProtection } from '../combat/hitLocation'
import type { ArmorLayer, EquipmentSlot } from './equipmentTypes'
import { expectedProtection } from '../combat/hitLocation'
import { EQUIPMENT_LAYER_LABEL, EQUIPMENT_SLOT_LABEL, EQUIPMENT_SLOTS } from './equipment'

/**
 * Truthful interim armor numbers for UI (full layered presentation is ui-input-048): per-channel
 * values, never a single collapsed "damage reduction". Expected protection comes from
 * `expectedProtection()` over the reference hit profile; piece values are local resistance.
 *
 * @domain items-player
 */

export const DAMAGE_CHANNEL_LABELS = { cut: 'cięcie', pierce: 'kłucie', blunt: 'obuch' } as const

/** Rounded integer percent per channel. */
export function resistancePercents(resist: Resistance): { cut: number, pierce: number, blunt: number } {
  return {
    cut: Math.round(resist.cut * 100),
    pierce: Math.round(resist.pierce * 100),
    blunt: Math.round(resist.blunt * 100),
  }
}

export const DAMAGE_CHANNELS: readonly DamageType[] = ['cut', 'pierce', 'blunt']

/** UI profile switch values (the `fall` profile is never offered). */
export type ProtectionProfileKey = Exclude<HitProfile, 'fall'>
export const PROTECTION_PROFILE_KEYS: readonly ProtectionProfileKey[] = ['reference', 'low-bite', 'large-maul']
export const PROTECTION_PROFILE_LABEL: Record<ProtectionProfileKey, string> = {
  reference: 'Referencyjny',
  'low-bite': 'Gryzienie nisko',
  'large-maul': 'Potężny cios',
}
export type ExpectedProtectionByProfile = Record<ProtectionProfileKey, Resistance>

/** Expected protection for every switchable profile — one derivation from the 7x3 local table.
 * @domain ui-input
 */
export function expectedProtectionByProfile(protection: HumanProtection): ExpectedProtectionByProfile {
  return {
    reference: expectedProtection(protection, 'reference'),
    'low-bite': expectedProtection(protection, 'low-bite'),
    'large-maul': expectedProtection(protection, 'large-maul'),
  }
}

/** `tylko tułów · wierzch` — what a local resistance value covers.
 * @domain ui-input
 */
export function formatArmorCoverage(slot: EquipmentSlot, layer: ArmorLayer): string {
  return `tylko ${EQUIPMENT_SLOT_LABEL[slot].toLowerCase()} · ${EQUIPMENT_LAYER_LABEL[layer].toLowerCase()}`
}

/** `cięcie 35% · kłucie 45% · obuch 15%` — local piece resistance; pass the coverage to qualify it. */
export function formatResistanceLabel(resist: Resistance, coverage?: { slot: EquipmentSlot, layer: ArmorLayer }): string {
  const p = resistancePercents(resist)
  const text = `${DAMAGE_CHANNEL_LABELS.cut} ${p.cut}% · ${DAMAGE_CHANNEL_LABELS.pierce} ${p.pierce}% · ${DAMAGE_CHANNEL_LABELS.blunt} ${p.blunt}%`
  return coverage ? `${text} (${formatArmorCoverage(coverage.slot, coverage.layer)})` : text
}

/** One qualified local-resistance statement per channel: `35% — tylko tułów · wierzch`.
 * @domain ui-input
 */
export function formatChannelResistance(resist: Resistance, channel: DamageType, slot: EquipmentSlot, layer: ArmorLayer): string {
  return `${resistancePercents(resist)[channel]}% — ${formatArmorCoverage(slot, layer)}`
}

/** Strongest single channel in percent (catalogue strength meter only). */
export function strongestChannelPercent(resist: Resistance): number {
  return Math.round(Math.max(resist.cut, resist.pierce, resist.blunt) * 100)
}

export const ZERO_RESISTANCE_VIEW: Resistance = { cut: 0, pierce: 0, blunt: 0 }

/** All-zero 7 x 3 table (nothing worn). */
export const ZERO_PROTECTION_VIEW: HumanProtection = Object.fromEntries(
  EQUIPMENT_SLOTS.map((slot) => [slot, ZERO_RESISTANCE_VIEW]),
) as HumanProtection
