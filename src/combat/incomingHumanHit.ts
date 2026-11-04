import type { DefenseConfig } from '../items/itemCatalog'
import type { DamageType } from './damageTypes'
import type { DefenseOutcome } from './defenseResolver'
import type { HitLocation, HitProfile, HumanProtection } from './hitLocation'
import { resolveDefense } from './defenseResolver'
import { hitLocationRoll, sampleHitLocation } from './hitLocation'

/** Pure incoming physical-contact contract; actor owners retain HP and side effects.
 * @domain combat
 */
export type PhysicalHit = {
  amount: number
  damageType: DamageType
  source: 'melee' | 'projectile' | 'fauna' | 'trap' | 'fall'
  attackerId: string
  profile: HitProfile
  forcedLocation?: HitLocation
  blockable: boolean
}
export type HumanHitContext = {
  defenderId: string
  incomingOrdinal: number
  defense: DefenseConfig | null
  defenseSkill: number
  inArc: boolean
  protection: HumanProtection
}
export type HumanHitResult = {
  outcome: DefenseOutcome
  attempted: boolean
  location: HitLocation | null
  damageType: DamageType
  rawDamage: number
  postDefenseDamage: number
  armorPrevented: number
  finalDamage: number
}

/** Positive finite damage is the only input that may reserve an incoming ordinal. */
export function isAcceptedPhysicalContactAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0
}

/** Result for a rejected contact (invalid, dead, downed, zero): no defense, no location, no damage. */
export function inertHumanHitResult(hit: Pick<PhysicalHit, 'amount' | 'damageType'>): HumanHitResult {
  return {
    outcome: 'none',
    attempted: false,
    location: null,
    damageType: hit.damageType,
    rawDamage: Number.isFinite(hit.amount) ? hit.amount : 0,
    postDefenseDamage: 0,
    armorPrevented: 0,
    finalDamage: 0,
  }
}

/** Resolve defense, then one anatomical location and its composed local resistance.
 * The caller validates contact ({@link isAcceptedPhysicalContactAmount}) and reserves
 * the durable ordinal exactly once. Shared by player and NPC incoming wrappers.
 */
export function resolveIncomingHumanHit(hit: PhysicalHit, ctx: HumanHitContext): HumanHitResult {
  if (!Number.isFinite(hit.amount) || hit.amount < 0) throw new RangeError('Invalid physical damage')
  const defense = resolveDefense(hit.amount, hit.blockable ? ctx.defense : null,
    ctx.defenseSkill, ctx.defenderId, hit.attackerId, ctx.incomingOrdinal, ctx.inArc)
  const result: HumanHitResult = {
    outcome: defense.outcome,
    attempted: defense.attempted,
    location: null,
    damageType: hit.damageType,
    rawDamage: hit.amount,
    postDefenseDamage: defense.finalDamage,
    armorPrevented: 0,
    finalDamage: defense.finalDamage,
  }
  if (defense.finalDamage === 0) return result
  const location = hit.forcedLocation ?? sampleHitLocation(hit.profile,
    hitLocationRoll(ctx.defenderId, hit.attackerId, ctx.incomingOrdinal))
  result.location = location
  result.finalDamage *= 1 - ctx.protection[location][hit.damageType]
  result.armorPrevented = result.postDefenseDamage - result.finalDamage
  return result
}
