/** Explicit reviewed identity policy. No V1 gameplay values or activation authority. */
import type { ItemKind } from '../items'
import type { CompatibilityDecision, PropertyCompatibility, VerifiedV1Target } from './compatibilityTypes'
import { findV3EquipmentDefinition } from './catalogue'
import { propertyCompatibilityFor } from './propertyCompatibility'
import { V3_EQUIPMENT_PROVENANCE } from './provenance'

export type Classification = 'existing' | 'adapt' | 'new' | 'conflict' | 'deferred'
export type IdentityRelation = 'canonical' | 'historical-v1' | 'candidate'
type ProjectionPermission = 'existing-v1-reference' | 'blocked'
type Policy =
  | readonly ['new' | 'deferred' | 'conflict']
  | readonly ['existing', ItemKind, 'canonical', ProjectionPermission]
  | readonly ['adapt', ItemKind, 'historical-v1', ProjectionPermission]
  | readonly ['adapt', ItemKind, 'candidate', 'blocked']
  | readonly ['conflict', ItemKind, 'historical-v1', 'blocked']

// Reviewed Stage 4 W1 policy (A1–A5 + five A9 IDs), independent of supplied/expanded manifests. Intentional changes
// require mapping/identity review and regression updates; evidence prose cannot approve them.
const POLICY = {
  knife: ['existing', 'knife', 'canonical', 'existing-v1-reference'],
  dagger: ['existing', 'dagger', 'canonical', 'existing-v1-reference'],
  obsidian_knife: ['new'],
  obsidian_dagger: ['new'],
  damascus_dagger: ['adapt', 'damascus_knife', 'historical-v1', 'existing-v1-reference'],
  ashgrove_dagger: ['deferred'],
  kestrel_dagger: ['deferred'],
  short_sword: ['existing', 'short_sword', 'canonical', 'existing-v1-reference'],
  sword: ['new'],
  falchion: ['deferred'],
  long_sword: ['existing', 'long_sword', 'canonical', 'existing-v1-reference'],
  pinewatch_longsword: ['deferred'],
  damascus_sword: ['adapt', 'damascus_short_sword', 'historical-v1', 'existing-v1-reference'],
  damascus_longsword: ['adapt', 'damascus_long_sword', 'historical-v1', 'existing-v1-reference'],
  obsidian_sword: ['existing', 'obsidian_sword', 'canonical', 'existing-v1-reference'],
  millbrook_shortsword: ['deferred'],
  harrow_shortsword: ['deferred'],
  fenmoor_sword: ['new'],
  ironvale_sword: ['deferred'],
  stonebridge_longsword: ['deferred'],
  greywatch_longsword: ['deferred'],
  hatchet: ['existing', 'hatchet', 'canonical', 'existing-v1-reference'],
  axe: ['existing', 'axe', 'canonical', 'existing-v1-reference'],
  battle_axe: ['existing', 'battle_axe', 'canonical', 'existing-v1-reference'],
  spear: ['existing', 'spear', 'canonical', 'existing-v1-reference'],
  halberd: ['new'],
  club: ['new'],
  mace: ['new'],
  war_hammer: ['new'],
  staff: ['new'],
  sling: ['existing', 'sling', 'canonical', 'existing-v1-reference'],
  short_bow: ['existing', 'short_bow', 'canonical', 'existing-v1-reference'],
  hunting_bow: ['existing', 'hunting_bow', 'canonical', 'existing-v1-reference'],
  long_bow: ['existing', 'long_bow', 'canonical', 'existing-v1-reference'],
  composite_bow: ['deferred'],
  marlow_longbow: ['new'],
  yewmaster_longbow: ['deferred'],
  crossbow: ['existing', 'crossbow', 'canonical', 'existing-v1-reference'],
  buckler: ['deferred'],
  wooden_shield: ['deferred'],
  iron_rimmed_shield: ['deferred'],
  padded_cap: ['new'],
  leather_cap: ['new'],
  mail_coif: ['new'],
  iron_helm: ['new'],
  full_helm: ['new'],
  leather_pauldron: ['existing', 'leather_pauldron', 'canonical', 'existing-v1-reference'],
  ranger_pauldron: ['existing', 'ranger_pauldron', 'canonical', 'existing-v1-reference'],
  iron_pauldrons: ['new'],
  plate_pauldrons_spiked: ['adapt', 'knight_pauldron_spike', 'historical-v1', 'existing-v1-reference'],
  plate_pauldrons_round: ['adapt', 'knight_pauldron_round', 'historical-v1', 'existing-v1-reference'],
  padded_jacket: ['new'],
  leather_jerkin: ['adapt', 'leather_armor', 'historical-v1', 'existing-v1-reference'],
  studded_leather: ['new'],
  mail_shirt: ['adapt', 'chainmail', 'historical-v1', 'existing-v1-reference'],
  brigandine: ['new'],
  plate_cuirass: ['new'],
  stoneford_mail: ['deferred'],
  kingsbane_hauberk: ['deferred'],
  ravenmoor_cuirass: ['deferred'],
  marshal_cuirass: ['deferred'],
  saltmere_wardens_coat: ['deferred'],
  northpass_riders_helm: ['deferred'],
  leather_bracers: ['new'],
  iron_vambraces: ['new'],
  plate_vambraces: ['new'],
  leather_gloves: ['new'],
  studded_gloves: ['new'],
  plate_gauntlets: ['new'],
  padded_hose: ['new'],
  leather_trousers: ['new'],
  mail_chausses: ['new'],
  plate_greaves: ['new'],
  thornwatch_pauldrons: ['deferred'],
  blackpine_vambraces: ['deferred'],
  fallowmere_gauntlets: ['deferred'],
  ridgeguard_greaves: ['deferred'],
  leather_boots: ['new'],
  reinforced_boots: ['new'],
  plate_sabatons: ['new'],
  arrow: ['existing', 'arrow', 'canonical', 'existing-v1-reference'],
  arrow_bodkin: ['adapt', 'war_arrow', 'historical-v1', 'existing-v1-reference'],
  arrow_blunt: ['deferred'],
  bolt: ['existing', 'bolt', 'canonical', 'existing-v1-reference'],
  bolt_heavy: ['new'],
  bolt_blunt: ['new'],
  sling_stone: ['new'],
} as const satisfies Record<string, Policy>

export type CanonicalV3Id = keyof typeof POLICY
export const V1_VERIFICATION_REVISION = 'dd1ff563' as const

export interface CompatibilityEntry {
  readonly donorId: CanonicalV3Id
  readonly classification: Classification
  readonly sourceRevision: string
  readonly historicalAliases: Readonly<{ v1?: string, v2?: string }>
  /** Candidate/conflicted relationships are never verified targets. */
  readonly candidateTarget?: ItemKind
  readonly target?: VerifiedV1Target
  readonly identityRelation?: IdentityRelation
  readonly evidence: Readonly<{
    mappingDocument: '2026-10-27--equipment-id-mapping.md'
    sourceId: string
    targetId?: ItemKind
    checks: readonly ['identity', 'category', 'gameplay-family']
  }>
  readonly properties: readonly PropertyCompatibility[]
  readonly runtimeProjection: 'existing-v1-reference' | 'blocked'
  readonly activation: 'inactive'
  readonly unresolvedDecisions: readonly CompatibilityDecision[]
  readonly dependencies: readonly string[]
}

/** Compare policy authority, not self-declared evidence or matching canonical names. */
export function matchesReviewedPolicy(entry: CompatibilityEntry): boolean {
  if (!Object.hasOwn(POLICY, entry.donorId)) return false
  const [classification, targetId, identityRelation, projection] = POLICY[entry.donorId] as Policy
  const verified = (classification === 'existing' || classification === 'adapt') && identityRelation !== 'candidate'
  return entry.classification === classification
    && entry.target?.id === (verified ? targetId : undefined)
    && entry.candidateTarget === (verified ? undefined : targetId)
    && entry.identityRelation === identityRelation
    && entry.runtimeProjection === (projection ?? 'blocked')
}

const dependencies = Object.freeze(['Inventory/identity', 'combat/projectiles', 'NPC/loadout', 'economy/acquisition', 'persistence', 'UI/appearance'])
const questions: Partial<Record<CanonicalV3Id, string>> = {
  arrow: 'A1 approves canonical arrow with bonus zero; donor bonus and broadhead alias stay inert.',
  marlow_longbow: 'A2 selects a distinct kind; author and verify its own ranged profile before acquisition.',
  fenmoor_sword: 'A3 selects a distinct kind; retain masterwork_sword and verify the authored profile before acquisition.',
  obsidian_knife: 'A4 selects an additive knife profile; no historical replacement or save rename.',
  sling_stone: 'A5 selects distinct sling-only ammo; verify admission and preserve native stone uses.',
}

/** Frozen, exhaustive policy records; source facts remain in the independent catalogue. */
export const V3_EQUIPMENT_COMPATIBILITY: readonly CompatibilityEntry[] = Object.freeze(
  (Object.entries(POLICY) as [CanonicalV3Id, Policy][]).map(([donorId, policy]): CompatibilityEntry => {
    const [classification, targetId, identityRelation, projection] = policy
    const source = findV3EquipmentDefinition(donorId)!
    const verifiedTarget = (classification === 'existing' || classification === 'adapt') && identityRelation !== 'candidate'
    const question = questions[donorId] ?? (verifiedTarget
      ? 'Donor gameplay equivalence is unapproved; retain the complete V1 profile.'
      : 'Select integration scope and author a complete V1 profile/acquisition policy before activation.')
    const unresolvedDecisions: readonly CompatibilityDecision[] = Object.freeze([
      Object.freeze({ id: donorId, question, affectedProperties: Object.freeze([]) }),
      ...(source.category === 'armor' ? [Object.freeze({ id: 'items-player-044', question: 'Approve slots/layers and shared player/NPC typed protection; no forearms-to-arms merge.', affectedProperties: Object.freeze(['slot', 'layer', 'resist'] as const) })] : []),
    ])
    return Object.freeze({
      donorId, classification, sourceRevision: V3_EQUIPMENT_PROVENANCE.sourceRevision,
      historicalAliases: Object.freeze({ ...source.legacyIds }),
      ...(verifiedTarget && targetId ? { target: Object.freeze({ id: targetId, verifiedRevision: V1_VERIFICATION_REVISION, evidence: 'Executable identity/category/family checks; original V1 profile only.' }) } : {}),
      ...(!verifiedTarget && targetId ? { candidateTarget: targetId } : {}),
      identityRelation,
      evidence: Object.freeze({ mappingDocument: '2026-10-27--equipment-id-mapping.md', sourceId: donorId, targetId, checks: Object.freeze(['identity', 'category', 'gameplay-family'] as const) }),
      properties: propertyCompatibilityFor(source),
      runtimeProjection: projection ?? 'blocked',
      activation: 'inactive', unresolvedDecisions, dependencies,
    })
  }),
)
