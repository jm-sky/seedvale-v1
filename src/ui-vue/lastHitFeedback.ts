import type { DamageType } from '../combat/damageTypes'
import type { HitLocation } from '../combat/hitLocation'
import type { HumanHitResult } from '../combat/incomingHumanHit'
import { DAMAGE_CHANNEL_LABELS } from '../items/armorProtectionDisplay'

/**
 * Compact "last hit on the player" line, built only from the committed {@link HumanHitResult}
 * (location, channel, defense outcome, armor prevented, HP lost). Never recomputes combat math.
 *
 * @domain ui-input
 */

const HIT_LOCATION_LABEL: Record<HitLocation, string> = {
  head: 'Głowa',
  body: 'Tułów',
  shoulders: 'Barki',
  forearms: 'Przedramiona',
  hands: 'Dłonie',
  legs: 'Nogi',
  feet: 'Stopy',
}

/** How long the line stays on the HUD after the hit, in real milliseconds. */
export const LAST_HIT_LINE_MS = 8000

function formatHp(value: number): string {
  return String(Math.round(value * 10) / 10)
}

function channelLabel(type: DamageType): string {
  return DAMAGE_CHANNEL_LABELS[type]
}

/**
 * `Nogi · kłucie · utracono 10 HP · pancerz powstrzymał 4`; a block is named first
 * (`Blok częściowy`/`Blok całkowity`), a full block has no location or HP loss.
 */
export function formatLastHitLine(hit: Readonly<HumanHitResult>): string {
  if (hit.outcome === 'full') return `Blok całkowity · ${channelLabel(hit.damageType)} · utracono 0 HP`
  const parts: string[] = []
  if (hit.outcome === 'partial') parts.push('Blok częściowy')
  if (hit.location) parts.push(HIT_LOCATION_LABEL[hit.location])
  parts.push(channelLabel(hit.damageType))
  parts.push(`utracono ${formatHp(hit.finalDamage)} HP`)
  if (hit.armorPrevented > 0) parts.push(`pancerz powstrzymał ${formatHp(hit.armorPrevented)}`)
  return parts.join(' · ')
}
