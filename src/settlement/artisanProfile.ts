import type { Role } from '../ai/characters'
import type { SettlementTerrain } from '../shared/SettlementName'
import type { NaturalResource } from '../terrain/naturalResources'
import type { FamilyDef, VillageSize } from './families'
import type { NpcId } from './npcState'
import { createSeededRandom } from '../world/parseSeed'
import { settlementNpcId } from './npcIdentity'
import { isProfessionAdult } from './professionStaffing'

/**
 * Category-based artisan specialization (plan settlements-npcs-056).
 * Preference/bonus by default; exclusive gates are assigned separately
 * when a settlement has 2+ production artisans of the same profession.
 *
 * @domain settlements-npcs
 */
export type ArtisanSpecialization = 'swords' | 'armor' | 'tools' | 'axes'

export const ARTISAN_SPECIALIZATIONS: readonly ArtisanSpecialization[] = [
  'swords',
  'armor',
  'tools',
  'axes',
]

export const ARTISAN_SPECIALIZATION_BONUS = 12
export const ARTISAN_SKILL_MIN = 0
export const ARTISAN_SKILL_MAX = 100

/**
 * Persistent artisan capability on a production NPC (plan
 * settlements-npcs-056). `experience` is reserved for later skill-growth
 * work and is not spent here. Specialization is a separate axis from skill.
 *
 * @domain settlements-npcs
 */
export type ArtisanProfile = {
  baseSkill: number
  experience: number
  specializations: ArtisanSpecialization[]
  /** When true, non-baseline recipes outside `specializations` are gated. */
  exclusive: boolean
}

export type ArtisanOrderStatus =
  | 'accepted'
  | 'in_progress'
  | 'ready'
  | 'collected'
  | 'cancelled'

export type ArtisanOrderMaterial = {
  kind: string
  amount: number
  owner: 'stock' | 'item'
}

/**
 * Persistent player custom-order (plan settlements-npcs-056). The concrete
 * output instance does not exist until production completes. Lifecycle lives
 * on `NpcAuthoritativeState`, never in Vue.
 *
 * @domain settlements-npcs
 */
export type ArtisanOrder = {
  id: string
  artisanNpcId: NpcId
  customer: 'player'
  productionId: string
  status: ArtisanOrderStatus
  createdAt: number
  paidMaterialCost: number
  requiredMaterials: readonly ArtisanOrderMaterial[]
  outputInstanceId?: string
  outputKind?: string
  outputQuality?: 'poor' | 'common' | 'good' | 'masterwork'
}

const PROFILE_SALT = 0x41525453
const SPEC_SALT = 0x53504543

const SKILL_BANDS = [
  { id: 'novice', min: 20, max: 39 },
  { id: 'average', min: 40, max: 55 },
  { id: 'experienced', min: 56, max: 69 },
  { id: 'master', min: 70, max: 84 },
  { id: 'exceptional', min: 85, max: 94 },
  { id: 'extraordinary', min: 95, max: 100 },
] as const

type SkillBandId = (typeof SKILL_BANDS)[number]['id']

const SIZE_BAND_WEIGHTS: Record<VillageSize, Record<SkillBandId, number>> = {
  OUTPOST: { novice: 0.45, average: 0.40, experienced: 0.12, master: 0.025, exceptional: 0.004, extraordinary: 0.001 },
  SM: { novice: 0.28, average: 0.45, experienced: 0.20, master: 0.055, exceptional: 0.012, extraordinary: 0.003 },
  MD: { novice: 0.12, average: 0.38, experienced: 0.32, master: 0.14, exceptional: 0.03, extraordinary: 0.01 },
  LG: { novice: 0.06, average: 0.28, experienced: 0.34, master: 0.24, exceptional: 0.06, extraordinary: 0.02 },
  XL: { novice: 0.03, average: 0.20, experienced: 0.32, master: 0.30, exceptional: 0.11, extraordinary: 0.04 },
}

export type ArtisanGenerationContext = {
  role: Role
  npcId: NpcId
  settlementId: string
  seed: number
  size: VillageSize
  terrain?: SettlementTerrain
  dominantResource?: NaturalResource | null
  families?: readonly FamilyDef[]
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function clampSkill(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(ARTISAN_SKILL_MIN, Math.min(ARTISAN_SKILL_MAX, Math.round(value)))
}

function metalContext(terrain?: SettlementTerrain, dominant?: NaturalResource | null): boolean {
  const type = dominant?.type
  return terrain === 'mountain' || type === 'iron' || type === 'coal' || type === 'gold'
}

function pickWeighted<T extends string>(
  random: () => number,
  weights: Record<T, number>,
  order: readonly T[],
): T {
  let total = 0
  for (const key of order) total += weights[key]
  let roll = random() * (total > 0 ? total : 1)
  for (const key of order) {
    roll -= weights[key]
    if (roll < 0) return key
  }
  return order[order.length - 1]!
}

/**
 * Deterministic initial artisan `baseSkill` on the shared `0..100` scale.
 * Settlement size changes the band distribution; it does not hard-lock a
 * quality tier. Mutable downstream state (stock, wealth) is not an input.
 *
 * @domain settlements-npcs
 */
export function generateArtisanBaseSkill(input: {
  size: VillageSize
  profession: Role
  npcId: NpcId
  seed: number
  terrain?: SettlementTerrain
  dominantResource?: NaturalResource | null
}): number {
  void input.profession
  const mixed = (
    input.seed
    ^ PROFILE_SALT
    ^ hashString(input.npcId)
  ) >>> 0
  const random = createSeededRandom(mixed)
  const weights = { ...SIZE_BAND_WEIGHTS[input.size] }
  if (metalContext(input.terrain, input.dominantResource)) {
    weights.novice *= 0.7
    weights.average *= 0.9
    weights.experienced *= 1.1
    weights.master *= 1.15
    weights.exceptional *= 1.2
    weights.extraordinary *= 1.15
  }
  const bandId = pickWeighted(random, weights, SKILL_BANDS.map((band) => band.id))
  const band = SKILL_BANDS.find((entry) => entry.id === bandId) ?? SKILL_BANDS[1]
  const span = band.max - band.min
  return clampSkill(band.min + Math.floor(random() * (span + 1)))
}

function specCountForSkill(skill: number, random: () => number): number {
  if (skill >= 95) return random() < 0.45 ? 3 : 2
  if (skill >= 85) return random() < 0.55 ? 3 : 2
  if (skill >= 70) return random() < 0.55 ? 2 : 1
  if (skill >= 56) return random() < 0.45 ? 2 : 1
  if (skill >= 40) return random() < 0.55 ? 1 : 0
  return random() < 0.35 ? 1 : 0
}

export type SettlementBlacksmithRef = {
  npcId: NpcId
  familyIndex: number
}

/**
 * Adult Blacksmith roster in flattened settlement-member order.
 *
 * @domain settlements-npcs
 */
export function listSettlementBlacksmiths(
  settlementId: string,
  families: readonly FamilyDef[],
): readonly SettlementBlacksmithRef[] {
  const out: SettlementBlacksmithRef[] = []
  let memberIndex = 0
  for (let familyIndex = 0; familyIndex < families.length; familyIndex++) {
    for (const member of families[familyIndex]!.members) {
      if (isProfessionAdult(member) && member.character.role === 'blacksmith') {
        out.push({ npcId: settlementNpcId(settlementId, memberIndex), familyIndex })
      }
      memberIndex++
    }
  }
  return out
}

type AssignedSpecs = {
  specializations: ArtisanSpecialization[]
  exclusive: boolean
}

function rngFor(seed: number, npcId: string, salt: number): () => number {
  return createSeededRandom((seed ^ salt ^ hashString(npcId)) >>> 0)
}

function assignBlacksmithCoverage(
  members: readonly { npcId: NpcId, skill: number }[],
  seed: number,
): Map<NpcId, AssignedSpecs> {
  const assigned = new Map<NpcId, AssignedSpecs>()
  if (members.length === 0) return assigned

  const sorted = [...members].sort((a, b) => a.npcId.localeCompare(b.npcId))
  if (sorted.length === 1) {
    const smith = sorted[0]!
    const random = rngFor(seed, smith.npcId, SPEC_SALT)
    const count = specCountForSkill(smith.skill, random)
    const specs: ArtisanSpecialization[] = []
    const pool = [...ARTISAN_SPECIALIZATIONS]
    for (let i = 0; i < count && pool.length > 0; i++) {
      const index = Math.floor(random() * pool.length)
      specs.push(pool.splice(index, 1)[0]!)
    }
    assigned.set(smith.npcId, { specializations: specs, exclusive: false })
    return assigned
  }

  const covered = new Set<ArtisanSpecialization>()
  for (const smith of sorted) {
    const random = rngFor(seed, smith.npcId, SPEC_SALT)
    const desired = Math.max(1, specCountForSkill(smith.skill, random))
    const specs: ArtisanSpecialization[] = []
    for (const category of ARTISAN_SPECIALIZATIONS) {
      if (specs.length >= desired) break
      if (!covered.has(category)) {
        specs.push(category)
        covered.add(category)
      }
    }
    for (const category of ARTISAN_SPECIALIZATIONS) {
      if (specs.length >= desired) break
      if (!specs.includes(category)) {
        specs.push(category)
        covered.add(category)
      }
    }
    assigned.set(smith.npcId, {
      specializations: specs,
      exclusive: specs.length < ARTISAN_SPECIALIZATIONS.length,
    })
  }

  if (covered.size < ARTISAN_SPECIALIZATIONS.length) {
    const last = sorted[sorted.length - 1]!
    const current = assigned.get(last.npcId)!
    for (const category of ARTISAN_SPECIALIZATIONS) {
      if (!covered.has(category)) {
        current.specializations = [...current.specializations, category]
        covered.add(category)
      }
    }
    current.exclusive = current.specializations.length < ARTISAN_SPECIALIZATIONS.length
  }

  return assigned
}

/**
 * Resolve one production NPC's artisan profile from stable world facts.
 * Returns `null` for non-production roles (V1: Blacksmith only).
 *
 * @domain settlements-npcs
 */
export function resolveArtisanProfile(input: ArtisanGenerationContext): ArtisanProfile | null {
  if (input.role !== 'blacksmith') return null
  const skill = generateArtisanBaseSkill({
    size: input.size,
    profession: input.role,
    npcId: input.npcId,
    seed: input.seed,
    terrain: input.terrain,
    dominantResource: input.dominantResource,
  })
  const roster = input.families
    ? listSettlementBlacksmiths(input.settlementId, input.families)
    : [{ npcId: input.npcId, familyIndex: 0 }]
  const members = roster.map((entry) => ({
    npcId: entry.npcId,
    skill: entry.npcId === input.npcId
      ? skill
      : generateArtisanBaseSkill({
        size: input.size,
        profession: 'blacksmith',
        npcId: entry.npcId,
        seed: input.seed,
        terrain: input.terrain,
        dominantResource: input.dominantResource,
      }),
  }))
  if (!members.some((entry) => entry.npcId === input.npcId)) {
    members.push({ npcId: input.npcId, skill })
  }
  const coverage = assignBlacksmithCoverage(members, input.seed)
  const assigned = coverage.get(input.npcId) ?? { specializations: [], exclusive: false }
  return {
    baseSkill: skill,
    experience: 0,
    specializations: assigned.specializations,
    exclusive: assigned.exclusive && members.length >= 2,
  }
}

/**
 * Contextual crafting skill: base + matching specialization bonus, clamped.
 *
 * @domain settlements-npcs
 */
export function effectiveArtisanSkill(
  profile: Pick<ArtisanProfile, 'baseSkill' | 'specializations'>,
  specialization?: ArtisanSpecialization | null,
): number {
  const bonus = specialization && profile.specializations.includes(specialization)
    ? ARTISAN_SPECIALIZATION_BONUS
    : 0
  return clampSkill(profile.baseSkill + bonus)
}

export function cloneArtisanProfile(profile: ArtisanProfile | null | undefined): ArtisanProfile | null {
  if (!profile) return null
  return {
    baseSkill: profile.baseSkill,
    experience: profile.experience,
    specializations: [...profile.specializations],
    exclusive: profile.exclusive === true,
  }
}

export function cloneArtisanOrders(orders: readonly ArtisanOrder[] | null | undefined): ArtisanOrder[] {
  if (!orders) return []
  return orders.map((order) => ({
    ...order,
    requiredMaterials: order.requiredMaterials.map((row) => ({ ...row })),
  }))
}

/**
 * One-time artisan profile seed at genuine first NPC-state creation (plan
 * settlements-npcs-056). Restore/rebuild never rerolls.
 *
 * @domain settlements-npcs
 */
export function seedArtisanProfileIfNeeded(
  state: { artisanProfile: ArtisanProfile | null, artisanProfileInitialized: boolean },
  input: ArtisanGenerationContext,
): void {
  if (state.artisanProfileInitialized) return
  state.artisanProfile = resolveArtisanProfile(input)
  state.artisanProfileInitialized = true
}

/**
 * Production-completion seam for later skill growth (plan settlements-npcs-056).
 * V1 only records that real work happened; it does not raise `baseSkill`.
 *
 * @domain settlements-npcs
 */
export function noteArtisanProductionCompleted(
  profile: ArtisanProfile,
  recipeDifficulty: number,
): void {
  const weight = Math.max(1, Math.round(recipeDifficulty / 20))
  profile.experience += weight
}

export function isArtisanSpecialization(value: unknown): value is ArtisanSpecialization {
  return value === 'swords' || value === 'armor' || value === 'tools' || value === 'axes'
}

export function isArtisanOrderStatus(value: unknown): value is ArtisanOrderStatus {
  return (
    value === 'accepted'
    || value === 'in_progress'
    || value === 'ready'
    || value === 'collected'
    || value === 'cancelled'
  )
}
