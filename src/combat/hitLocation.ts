import type { Resistance } from './damageTypes'

/** Anatomical regions are independent of the legacy equipment slot rename (044-M).
 * @domain combat
 */
export const HIT_LOCATIONS = ['head', 'body', 'shoulders', 'forearms', 'hands', 'legs', 'feet'] as const
export type HitLocation = typeof HIT_LOCATIONS[number]
export type HitProfile = 'reference' | 'low-bite' | 'large-maul' | 'fall'
export type HumanProtection = Readonly<Record<HitLocation, Resistance>>

export const HIT_LOCATION_PROFILES: Readonly<Record<HitProfile, Readonly<Record<HitLocation, number>>>> = {
  reference: { head: 12, body: 35, shoulders: 10, forearms: 8, hands: 5, legs: 20, feet: 10 },
  'low-bite': { head: 2, body: 25, shoulders: 8, forearms: 10, hands: 5, legs: 35, feet: 15 },
  'large-maul': { head: 8, body: 40, shoulders: 10, forearms: 12, hands: 5, legs: 20, feet: 5 },
  fall: { head: 10, body: 30, shoulders: 0, forearms: 0, hands: 0, legs: 60, feet: 0 },
}

/** FNV-1a over framed fields isolates location rolls from directional defense. */
export function hitLocationRoll(defenderId: string, attackerId: string, ordinal: number): number {
  const framed = JSON.stringify(['armor-location-v1', defenderId, attackerId, ordinal])
  let hash = 2166136261
  for (let i = 0; i < framed.length; i++) {
    hash ^= framed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}

/** Select the first cumulative percentage strictly greater than a [0,1) roll. */
export function sampleHitLocation(profile: HitProfile, roll: number): HitLocation {
  if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new RangeError('Hit location roll must be in [0, 1)')
  let cumulative = 0
  for (const location of HIT_LOCATIONS) {
    cumulative += HIT_LOCATION_PROFILES[profile][location]
    if (roll < cumulative / 100) return location
  }
  throw new RangeError('Invalid hit location profile')
}

/** UI-only weighted protection; never used as an actual incoming-hit multiplier. */
export function expectedProtection(protection: HumanProtection, profile: HitProfile = 'reference'): Resistance {
  const result = { cut: 0, pierce: 0, blunt: 0 }
  for (const location of HIT_LOCATIONS) {
    const weight = HIT_LOCATION_PROFILES[profile][location] / 100
    result.cut += weight * protection[location].cut
    result.pierce += weight * protection[location].pierce
    result.blunt += weight * protection[location].blunt
  }
  return result
}
