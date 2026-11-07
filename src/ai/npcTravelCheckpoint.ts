import type { NpcAuthoritativeState } from '../settlement/npcState'
import type { Role } from './characters'
import { damageHealth } from '../shared/HealthState'
import { registerPhysicalInjuryFromDamage } from '../shared/injuryRecovery'
import { resolveNpcMeleeWeapon } from './npcCombat'
import { resolveNpcOffscreenTravelInterval } from './npcOffscreenSurvival'
import {
  blockNpcTravel,
  interpolateNpcTravelPosition,
  type NpcTravelPoint,
  type NpcTravelResolveResult,
  resolveOffscreenNpcTravel,
} from './npcTravel'

/** Damage of a traveller with no melee weapon in `personalInventory` (🟡 first-version value). */
export const UNARMED_TRAVELLER_DAMAGE = 3

/** What the threat owner (fauna, injected at the composition root) is asked about one interval. */
export type OffscreenTravelThreatQuery = {
  npcId: string
  role: Role | undefined
  /** Interval `(fromDays, toDays]` not yet settled by `threatResolvedAtDays`. */
  fromDays: number
  toDays: number
  /** Traveller position along the committed path at a world time (`interpolateNpcTravelPosition`). */
  positionAt: (atDays: number) => NpcTravelPoint
  party: { hp: number, meleeDamage: number, partySize: number }
}

export type OffscreenTravelThreatResult = {
  /** Total HP the party lost in the interval (chronological, party death ends it). */
  partyDamage: number
  /** World time the interval is settled up to: `toDays`, or the death time. */
  settledAtDays: number
  diedAtDays?: number
}

/**
 * Injected port (fauna-050 C3): the threat bubble for NPCs travelling off-screen. The composition root
 * wires it to fauna; there is no fauna import in `ai/`. The NPC owner (this module) applies the returned
 * party deltas to the authoritative state.
 */
export type OffscreenTravelThreats = {
  resolve: (query: OffscreenTravelThreatQuery) => OffscreenTravelThreatResult
}

/**
 * Bounded streaming/time-skip/restore checkpoint for generic NPC travel
 * (plan settlements-npcs-028). Survival first (exactly once per elapsed
 * interval), then spatial arrival. Not a per-frame loop.
 *
 * @domain npc
 */

function survivalFromDays(state: NpcAuthoritativeState, nowDays: number): number {
  const travel = state.travel
  if (!travel) return nowDays
  if (travel.survivalResolvedAtDays != null) return travel.survivalResolvedAtDays
  if (travel.execution) return travel.execution.departedAtDays
  return nowDays
}

function survivalToDays(state: NpcAuthoritativeState, nowDays: number): number {
  const travel = state.travel
  if (!travel?.execution) return nowDays
  return Math.min(nowDays, travel.execution.arrivesAtDays)
}

/**
 * Threat bubble step of the checkpoint (fauna-050 C3), after survival and before arrival. Idempotent
 * through `threatResolvedAtDays`; steps are keyed by world time inside the port, so any partition of
 * the same interval gives the same encounters. Returns true when the traveller died (travel blocked at
 * the death point, the existing `cannot-progress` semantics).
 */
function resolveTravelThreatBubble(
  state: NpcAuthoritativeState,
  nowDays: number,
  threats: OffscreenTravelThreats,
  role: Role | undefined,
): boolean {
  const travel = state.travel
  if (!travel?.execution || state.health.dead || travel.blocked) return false
  const fromDays = travel.threatResolvedAtDays ?? travel.execution.departedAtDays
  const toDays = survivalToDays(state, nowDays)
  if (!(toDays > fromDays)) return false
  const weapon = resolveNpcMeleeWeapon(state.personalInventory, role ?? 'guard')
  const snapshot = { ...travel, execution: { ...travel.execution } }
  const result = threats.resolve({
    npcId: state.id,
    role,
    fromDays,
    toDays,
    positionAt: (atDays) => interpolateNpcTravelPosition(snapshot, atDays),
    party: {
      hp: state.health.currentHp,
      meleeDamage: weapon?.melee.damage ?? UNARMED_TRAVELLER_DAMAGE,
      partySize: 1,
    },
  })
  travel.threatResolvedAtDays = result.settledAtDays
  if (result.partyDamage > 0) {
    const before = state.health.currentHp
    damageHealth(state.health, result.partyDamage)
    registerPhysicalInjuryFromDamage(state, before - state.health.currentHp, result.settledAtDays)
  }
  if (!state.health.dead) return false
  state.travel = blockNpcTravel(travel, interpolateNpcTravelPosition(snapshot, result.diedAtDays ?? result.settledAtDays))
  return true
}

/**
 * @domain npc
 */
export function resolveNpcTravelCheckpoint(
  state: NpcAuthoritativeState,
  nowDays: number,
  dayLengthSec: number,
  threats?: OffscreenTravelThreats | null,
  role?: Role,
): NpcTravelResolveResult {
  const travel = state.travel
  if (!travel) return { kind: 'none' }
  if (travel.arrival === 'reached') return { kind: 'arrived' }

  const fromDays = survivalFromDays(state, nowDays)
  const toDays = survivalToDays(state, nowDays)
  if (travel.execution != null && dayLengthSec > 0) {
    const survival = resolveNpcOffscreenTravelInterval(state, fromDays, toDays, dayLengthSec)
    if (state.travel) state.travel.survivalResolvedAtDays = survival.settledAtDays
    if (survival.kind === 'cannot-progress') {
      const current = state.travel
      if (current && current.arrival !== 'reached') {
        const at = current.execution
          ? interpolateNpcTravelPosition(current, survival.settledAtDays)
          : current.lastPosition
        state.travel = blockNpcTravel(current, at)
        if (state.travel) state.travel.survivalResolvedAtDays = survival.settledAtDays
      }
      return { kind: 'cannot-progress' }
    }
    if (threats) {
      const blocked = resolveTravelThreatBubble(state, nowDays, threats, role)
      if (blocked) return { kind: 'cannot-progress' }
    }
  }

  return resolveOffscreenNpcTravel(state, nowDays)
}
