import type { HumanProtection } from '../combat/hitLocation'
import type { ToolKind } from '../items/HeldTool'
import {
  defenseBlockRoll,
  type DefenseOutcome,
  isAttackFromDefensibleDirection,
} from '../combat/defenseResolver'
import {
  type HumanHitResult,
  isAcceptedPhysicalContactAmount,
  type PhysicalHit,
  resolveIncomingHumanHit,
} from '../combat/incomingHumanHit'
import { ITEM_CATALOG } from '../items/itemCatalog'
import { healHealth, type HealthState } from '../shared/HealthState'
import { clampPhysicalInjuryToMissingHp, type InjuryRecoveryState } from '../shared/injuryRecovery'
import { recordBloodHit } from '../world/bloodTraces'
import { PLAYER_HEIGHT, type PlayerController } from './PlayerController'
import {
  DEHYDRATION_HP_PER_SEC,
  hungerSevereDurationSec,
  type PlayerNeeds,
  STARVATION_HP_PER_SEC,
  thirstSevereDurationSec,
} from './PlayerNeeds'
import { awardSkillXp, SKILL_XP_AWARD } from './PlayerSkills'

export const DOWNED_DURATION_SEC = 5
export const DOWNED_RECOVERY_HP_MIN = 1
export const DOWNED_RECOVERY_HP_MAX = 5

export function rollDownedRecoveryHp(): number {
  const span = DOWNED_RECOVERY_HP_MAX - DOWNED_RECOVERY_HP_MIN + 1
  return DOWNED_RECOVERY_HP_MIN + Math.floor(Math.random() * span)
}

/** Restores a small HP buffer when a downed player stands back up (plan 150).
 *  Generic (non-wound) recovery — clamps injury to missing HP when an injury
 *  state is provided (plan items-player-045). */
export function applyDownedRecovery(
  health: HealthState,
  injuryRecovery?: InjuryRecoveryState,
): number {
  const amount = rollDownedRecoveryHp()
  healHealth(health, amount)
  if (injuryRecovery) clampPhysicalInjuryToMissingHp(injuryRecovery)
  return amount
}

export type PlayerDamageResult = {
  finalDamage: number
  defenseOutcome: DefenseOutcome
  enteredDowned: boolean
  /** Committed physical-hit resolution (location, armor prevented); `null` for rejected contacts and
   *  non-physical damage. Also exposed transiently via `PlayerController.getLastIncomingHit()`. */
  hit: HumanHitResult | null
}

/** Discriminated damage input: physical contact is defended, armored and located; non-physical
 *  (deprivation) bypasses defense, armor and location entirely — never inferred from omitted fields. */
export type PlayerDamageInput =
  | {
    kind: 'physical'
    hit: PhysicalHit
    /** Attacker position for directional defense; omit for environmental damage. */
    attackerX?: number
    attackerZ?: number
    /** Per-region typed protection from `resolveProtectionSnapshot(...).protection`. */
    protection: HumanProtection
    heldTool: ToolKind | null
    defenseSkillValue: number
    playerYaw: number
    onCombatHit?: () => void
  }
  | {
    kind: 'nonphysical'
    amount: number
    onCombatHit?: () => void
  }

export type ApplyPlayerDamageParams = {
  player: PlayerController
  damage: PlayerDamageInput
  /** World elapsed days for injury recovery accounting (plan items-player-045). */
  nowDays?: number
}

const REJECTED: PlayerDamageResult = { finalDamage: 0, defenseOutcome: 'none', enteredDowned: false, hit: null }

/** Single entry for player HP loss (plan 150 §8). Physical contact: active held-item defense, then one
 *  sampled anatomical location against typed armor via the shared `resolveIncomingHumanHit`, then HP;
 *  the durable incoming ordinal is reserved exactly once per accepted positive contact (including a full
 *  block), never for invalid/dead/downed/zero input. Actual HP loss registers as physical injury.
 *  Non-physical damage reduces HP directly with no defense, armor, location or ordinal. At 0 the player
 *  enters `downed` instead of `dead`.
 *  @domain items-player */
export function applyPlayerDamage(params: ApplyPlayerDamageParams): PlayerDamageResult {
  const { player, damage, nowDays = 0 } = params
  const rawAmount = damage.kind === 'physical' ? damage.hit.amount : damage.amount

  if (player.isDowned() || player.health.dead || !isAcceptedPhysicalContactAmount(rawAmount)) return REJECTED

  let finalDamage = rawAmount
  let defenseOutcome: DefenseOutcome = 'none'
  let hitResult: HumanHitResult | null = null
  if (damage.kind === 'physical') {
    const defenseConfig = damage.heldTool ? ITEM_CATALOG[damage.heldTool].defense ?? null : null
    const inArc = damage.attackerX != null && damage.attackerZ != null
      ? isAttackFromDefensibleDirection(
          player.mesh.position.x,
          player.mesh.position.z,
          damage.playerYaw,
          damage.attackerX,
          damage.attackerZ,
        )
      : false
    hitResult = resolveIncomingHumanHit(damage.hit, {
      defenderId: 'player',
      incomingOrdinal: player.nextIncomingPhysicalHitOrdinal(),
      defense: defenseConfig,
      defenseSkill: damage.defenseSkillValue,
      inArc,
      protection: damage.protection,
    })
    player.recordIncomingHit(hitResult)
    finalDamage = hitResult.finalDamage
    defenseOutcome = hitResult.outcome
    if (hitResult.attempted && hitResult.outcome !== 'none') {
      awardSkillXp(player.skills, 'defense', SKILL_XP_AWARD.defenseBlock)
    }
  }

  const hpBefore = player.health.currentHp
  if (finalDamage > 0) {
    player.health.currentHp = Math.max(0, player.health.currentHp - finalDamage)
    damage.onCombatHit?.()
    recordBloodHit(player.mesh.position.x, player.mesh.position.z, PLAYER_HEIGHT, finalDamage)
  }
  const actualHpLoss = hpBefore - player.health.currentHp
  if (damage.kind === 'physical' && actualHpLoss > 0) {
    player.registerPhysicalDamage(actualHpLoss, nowDays)
  }

  let enteredDowned = false
  if (player.health.currentHp <= 0 && !player.isDowned()) {
    player.enterDowned(DOWNED_DURATION_SEC)
    enteredDowned = true
  }

  return { finalDamage, defenseOutcome, enteredDowned, hit: hitResult }
}

/** Test helper — exposes the roll used by `resolveDefense` for assertions. */
export { defenseBlockRoll }

/** Sustained hunger/thirst depletion damage (plan 165 — gated on how long
 *  each pool has stayed continuously critical, not on hitting the pool
 *  straight away), routed through the player downed lifecycle. Does not
 *  register physical injury (plan items-player-045). */
export function tickPlayerStarvationDamage(
  player: PlayerController,
  needs: PlayerNeeds,
  dt: number,
  dayLengthSec: number,
  onCombatHit?: () => void,
  nowDays = 0,
): void {
  let perSec = 0
  if (needs.starvationDuration >= hungerSevereDurationSec(dayLengthSec)) perSec += STARVATION_HP_PER_SEC
  if (needs.dehydrationDuration >= thirstSevereDurationSec(dayLengthSec)) perSec += DEHYDRATION_HP_PER_SEC
  if (perSec <= 0 || dt <= 0) return
  applyPlayerDamage({
    player,
    damage: { kind: 'nonphysical', amount: perSec * dt, onCombatHit },
    nowDays,
  })
}
