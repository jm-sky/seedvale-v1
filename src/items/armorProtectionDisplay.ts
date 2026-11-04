import type { Resistance } from '../combat/damageTypes'

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

/** `cięcie 35% · kłucie 45% · obuch 15%`. */
export function formatResistanceLabel(resist: Resistance): string {
  const p = resistancePercents(resist)
  return `${DAMAGE_CHANNEL_LABELS.cut} ${p.cut}% · ${DAMAGE_CHANNEL_LABELS.pierce} ${p.pierce}% · ${DAMAGE_CHANNEL_LABELS.blunt} ${p.blunt}%`
}

/** Strongest single channel in percent (catalogue strength meter only). */
export function strongestChannelPercent(resist: Resistance): number {
  return Math.round(Math.max(resist.cut, resist.pierce, resist.blunt) * 100)
}

export const ZERO_RESISTANCE_VIEW: Resistance = { cut: 0, pierce: 0, blunt: 0 }
