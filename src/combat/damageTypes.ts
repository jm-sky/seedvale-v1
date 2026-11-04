/** Physical damage channels shared by catalog, combat and protection previews.
 * @domain combat
 */
export type DamageType = 'cut' | 'pierce' | 'blunt'
export type Resistance = Readonly<Record<DamageType, number>>

/** Quality scales each channel independently, with the existing per-piece cap. */
export function scaleArmorResistance(resist: Resistance, qualityScale: number): Resistance {
  const scale = (value: number): number => Math.max(0, Math.min(0.85, value * qualityScale))
  return { cut: scale(resist.cut), pierce: scale(resist.pierce), blunt: scale(resist.blunt) }
}

/** Compose only the two layers of one anatomical region. */
export function composeLocalResistance(under: Resistance, outer: Resistance): Resistance {
  const compose = (type: DamageType): number => 1 - (1 - under[type]) * (1 - outer[type])
  return { cut: compose('cut'), pierce: compose('pierce'), blunt: compose('blunt') }
}
