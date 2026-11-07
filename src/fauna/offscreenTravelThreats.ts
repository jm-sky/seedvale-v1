/**
 * @domain fauna
 * @system wild-fauna-records
 * @role Pure parts of the offscreen travel threat bubble (plan fauna-050 C3, Q035-a addition):
 *  step sampling that is independent of checkpoint partitioning, the encounter chance, and the one
 *  resolver `resolveOffscreenTravelEncounter` that turns a traveller party and dormant predators
 *  into HP deltas. `createFauna` owns the record query and write-back; the NPC owner applies the
 *  traveller deltas. No Three.js, no agents, no `Math.random`.
 *
 *  🟡 Numbers are first-version values (rounds, hit chances, scale) built from the existing
 *  `ANIMAL_DEFS.humanDanger`, `damageVsHuman` and NPC melee weapon damage. They are not a combat
 *  model: no armor, block, stamina, ranged weapons or strength profile yet.
 */

/** Fixed world-time step (1/48 day = 30 game minutes): `stepIndex = round(atDays / step)` is the key. */
export const THREAT_STEP_DAYS = 1 / 48
/** Dormant predators this close to the traveller's path at a step can engage. */
export const THREAT_BUBBLE_RADIUS = 18
/** Encounter chance per step = `min(THREAT_MAX_CHANCE, sum(humanDanger) * THREAT_CHANCE_SCALE)`. */
export const THREAT_CHANCE_SCALE = 0.5
export const THREAT_MAX_CHANCE = 0.9
/** At most this many predators engage in one encounter (nearest first, then id). */
export const THREAT_MAX_ENGAGED = 3
/** Rounds before the survivors disengage. */
export const ENCOUNTER_MAX_ROUNDS = 6
export const PARTY_HIT_CHANCE = 0.7
export const PREDATOR_HIT_CHANCE = 0.6
/** Damage of an unarmed traveller (no melee weapon in `personalInventory`). */
export const UNARMED_MELEE_DAMAGE = 3
/** Members of one party that attack per round are capped (a solo traveller is the common case). */
export const PARTY_MAX_ATTACKERS = 4

/**
 * Step indices `k` whose fire time `k * THREAT_STEP_DAYS` lies in `(fromDays, toDays]`, ascending.
 * A pure function of the interval, so any partition of `[from, to]` visits every step exactly once.
 */
export function threatStepIndices(fromDays: number, toDays: number): number[] {
  if (!(toDays > fromDays)) return []
  const out: number[] = []
  let k = Math.floor(fromDays / THREAT_STEP_DAYS)
  while (k * THREAT_STEP_DAYS <= fromDays) k++
  for (; k * THREAT_STEP_DAYS <= toDays; k++) out.push(k)
  return out
}

/** Chance that a step produces an encounter, from the engaged-candidate `humanDanger` values. */
export function threatEncounterChance(dangers: readonly number[]): number {
  let sum = 0
  for (const d of dangers) sum += d
  return Math.min(THREAT_MAX_CHANCE, sum * THREAT_CHANCE_SCALE)
}

export type EncounterParty = {
  hp: number
  /** Best carried melee weapon damage, or `UNARMED_MELEE_DAMAGE`. */
  meleeDamage: number
  /** Travellers that can attack (solo = 1); settlements-npcs-051 owns real party cooperation later. */
  partySize: number
}

export type EncounterPredator = { id: string, hp: number, biteDamage: number }

export type EncounterOutcome = {
  partyDamage: number
  partyDied: boolean
  predators: { id: string, damage: number, dead: boolean }[]
}

/**
 * Resolves one encounter in at most `ENCOUNTER_MAX_ROUNDS` rounds. Per round the party attacks the
 * first living predator (in the given order), then every living predator bites. The draw order is
 * fixed, so the outcome is a pure function of `(party, predators, rng sequence)`.
 */
export function resolveOffscreenTravelEncounter(
  party: EncounterParty,
  predators: readonly EncounterPredator[],
  rng: () => number,
): EncounterOutcome {
  const state = predators.map((p) => ({ id: p.id, hp: p.hp, bite: p.biteDamage, damage: 0, dead: false }))
  let hp = party.hp
  let partyDamage = 0
  const attackers = Math.max(1, Math.min(PARTY_MAX_ATTACKERS, Math.floor(party.partySize)))
  for (let round = 0; round < ENCOUNTER_MAX_ROUNDS && hp > 0; round++) {
    for (let m = 0; m < attackers; m++) {
      const target = state.find((p) => !p.dead)
      if (!target) break
      if (rng() < PARTY_HIT_CHANCE) {
        const dealt = Math.min(target.hp, party.meleeDamage)
        target.hp -= dealt
        target.damage += dealt
        if (target.hp <= 0) target.dead = true
      }
    }
    if (state.every((p) => p.dead)) break
    for (const p of state) {
      if (p.dead || hp <= 0) continue
      if (rng() < PREDATOR_HIT_CHANCE) {
        const dealt = Math.min(hp, p.bite)
        hp -= dealt
        partyDamage += dealt
      }
    }
  }
  return {
    partyDamage,
    partyDied: hp <= 0,
    predators: state.map((p) => ({ id: p.id, damage: p.damage, dead: p.dead })),
  }
}
