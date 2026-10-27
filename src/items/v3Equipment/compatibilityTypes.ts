import type { ItemKind } from '../items'
import type { V3EquipmentDefinition } from './types'

type KeysOfUnion<T> = T extends unknown ? keyof T : never

/** Closed source property vocabulary, including named nested values. */
export type EquipmentPropertyPath = KeysOfUnion<V3EquipmentDefinition>
  | 'legacyIds.v1' | 'legacyIds.v2'
  | 'resist.blunt' | 'resist.cut' | 'resist.pierce'

export interface PropertyCompatibility {
  readonly property: EquipmentPropertyPath
  /** A..E from the property matrix; none of these classes grants activation. */
  readonly compatibility: 'direct' | 'adapted' | 'preserved' | 'future-mechanics' | 'conflict'
  /** Stage 1 has no records; later checks must establish actual preservation. */
  readonly preservation: 'source-required' | 'source-preserved'
  readonly reason: string
}

export interface CompatibilityDecision {
  readonly id: string
  readonly question: string
  readonly affectedProperties: readonly EquipmentPropertyPath[]
}

/** Historical legacyIds alone are insufficient evidence for a current target. */
export interface VerifiedV1Target {
  readonly id: ItemKind
  readonly verifiedRevision: string
  readonly evidence: string
}

interface CompatibilityBase {
  readonly donorId: V3EquipmentDefinition['id']
  /** Mandatory and always inactive. Runtime approval needs a separate later contract. */
  readonly activation: 'inactive'
  readonly unresolvedDecisions: readonly CompatibilityDecision[]
  readonly properties: readonly PropertyCompatibility[]
}

/**
 * Future Stage 3 policy/result shapes only: no mappings, resolution or projection.
 * An existing target can already be active in V1; the donor integration stays inactive.
 */
export type EquipmentCompatibilityResult =
  | (CompatibilityBase & {
    readonly classification: 'existing'
    readonly target: VerifiedV1Target
  })
  | (CompatibilityBase & {
    readonly classification: 'adapted'
    readonly target: VerifiedV1Target
  })
  | (CompatibilityBase & {
    readonly classification: 'new-candidate'
    readonly target?: never
  })
  | (CompatibilityBase & {
    readonly classification: 'conflict'
    readonly target?: VerifiedV1Target
    readonly unresolvedDecisions: readonly [CompatibilityDecision, ...CompatibilityDecision[]]
  })
  | (CompatibilityBase & {
    readonly classification: 'deferred'
    readonly target?: VerifiedV1Target
  })
