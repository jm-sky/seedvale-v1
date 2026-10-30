import type { BigFivePersonality } from './dialogue'
import { createSeededRandom } from '../world/parseSeed'
import { personalityForIndex } from './dialogue'

export type NpcGender = 'male' | 'female'

/** Function within the settlement. Baseline `characterForSeed` rolls a
 *  random role; generation-time `professionStaffing.ts` then assigns
 *  procedural adult roles from settlement identity. `trader` stays out of
 *  the random pool so the adult-capacity gate cannot be skipped. `shepherd`
 *  and `textile_worker` are the same kind of optional specialist — staffing
 *  assigns them, baseline `characterForSeed` never does. */
export type Role = 'woodcutter' | 'farmer' | 'guard' | 'trader' | 'miner' | 'fisher' | 'hunter' | 'blacksmith' | 'shepherd' | 'textile_worker' | 'herbalist'

/** Closed pool of lightweight, deterministic modifiers — execution effects
 *  live in `NpcAgent` (wait times, stamina, PAUSE_PARAMS); schedule overlays
 *  (`night_owl` / `fast_worker` / `sociable`) live in `effectiveScheduleFor`;
 *  `curious` boosts player-reaction chance (`ai/reactionChance.ts`, plan 117). */
export type Trait = 'curious' | 'energetic' | 'fast_worker' | 'night_owl' | 'sociable'

/** Stable authored identity key for named characters (reserved home roster,
 *  authored story residents). Survives renames and runtime reconstruction —
 *  presentation lookups (e.g. dialogue portraits) key on this, never on the
 *  display name. Procedural residents have none. */
export type CharacterKey =
  | 'anna_lesniewska'
  | 'piotr_lesniewski'
  | 'kasia_hornblower'
  | 'marek_hornblower'
  | 'kazimierz'
  | 'rudolf'
  | 'patric_smith'
  | 'jakub'
  | 'molly_lambert'
  | 'archibald'

/** Settlement office held by an authored character. `reeve` = Sołtys — a
 *  data marker only for now; office powers (e.g. grave-excavation
 *  permission) are not implemented. */
export type NpcOffice = 'reeve'

export type CharacterDef = {
  name: string
  /** Family surname (shared by all members of the same family, gender-agreed
   *  per member) — see `settlement/families.ts`/`ai/nameCultures.ts`.
   *  Optional: reserved characters still match authored quest names by
   *  first `name` at materialization time (`giverName` → stable `NpcId`). */
  lastName?: string
  /** Set only for authored characters — see `CharacterKey`. */
  characterKey?: CharacterKey
  /** See `NpcOffice`. */
  office?: NpcOffice
  gender: NpcGender
  role: Role
  personality: BigFivePersonality
  traits: readonly Trait[]
}

/** Random baseline never rolls `trader`, `shepherd`, `textile_worker` or
 *  `herbalist` — reserved Kasia plus generation-time staffing are the only
 *  assignment paths for those roles. */
const RANDOM_ROLES: readonly Role[] = ['woodcutter', 'farmer', 'guard', 'miner', 'fisher', 'hunter', 'blacksmith']
const TRAITS: readonly Trait[] = ['curious', 'energetic', 'fast_worker', 'night_owl', 'sociable']

type ReservedSeed = Omit<CharacterDef, 'personality'>

/** The 4 NPCs `quests/quests.ts` hardcodes by name as giver/target — must
 *  always exist in the home settlement with this exact gender/role/traits
 *  (village-generation's reserved-family floor guarantees that, see
 *  `settlement/families.ts`). Randomizing these would silently break the
 *  only quests the game has. */
const RESERVED_SEEDS: readonly ReservedSeed[] = [
  { name: 'Anna', lastName: 'Leśniewska', characterKey: 'anna_lesniewska', gender: 'female', role: 'farmer', traits: ['fast_worker'] },
  { name: 'Piotr', lastName: 'Leśniewski', characterKey: 'piotr_lesniewski', gender: 'male', role: 'woodcutter', traits: ['energetic'] },
  { name: 'Kasia', lastName: 'Hornblower', characterKey: 'kasia_hornblower', gender: 'female', role: 'trader', traits: ['night_owl'] },
  { name: 'Marek', lastName: 'Hornblower', characterKey: 'marek_hornblower', gender: 'male', role: 'guard', traits: ['sociable'] },
]

/** Given names of authored non-reserved characters, keyed by `CharacterKey`.
 *  Excluded from procedural name generation (with the reserved roster) so an
 *  authored name stays unique and quest name binding never turns ambiguous. */
export const AUTHORED_GIVEN_NAMES = {
  kazimierz: 'Kazimierz',
  rudolf: 'Rudolf',
  patric_smith: 'Patric',
  jakub: 'Jakub',
  molly_lambert: 'Molly',
  archibald: 'Archibald',
} as const satisfies Partial<Record<CharacterKey, string>>

export const RESERVED_CHARACTERS: readonly CharacterDef[] = RESERVED_SEEDS.map((seed, i) => ({
  ...seed,
  personality: personalityForIndex(i),
}))

/** Deterministic role/traits/personality for a procedurally generated family
 *  member — replaces the old `characterForIndex(treeIndex % 8)` fixed-roster
 *  lookup. `name` isn't produced here: callers already have one (from
 *  `nameCultures.ts`'s `generateNpcName` or a reserved character) before
 *  they get here — see `settlement/families.ts`. */
export function characterForSeed(seed: number, gender: NpcGender): Omit<CharacterDef, 'name'> {
  const random = createSeededRandom(seed ^ 0x63a4e1)
  const role = RANDOM_ROLES[Math.floor(random() * RANDOM_ROLES.length)]!
  const traitCount = random() < 0.5 ? 1 : 2
  const pool = [...TRAITS]
  const traits: Trait[] = []
  for (let i = 0; i < traitCount && pool.length > 0; i++) {
    traits.push(pool.splice(Math.floor(random() * pool.length), 1)[0]!)
  }
  return {
    gender,
    role,
    traits,
    // `personalityForIndex` indexes a small fixed array by `% length` —
    // needs an unsigned value, unlike the xor/imul-composed seeds callers
    // pass in here, which are signed 32-bit and can be negative.
    personality: personalityForIndex(seed >>> 0),
  }
}
