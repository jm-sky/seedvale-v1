import type { ItemCatalogEntry } from '../itemCatalog'
import type { ItemDef } from '../items'
import type { CompatibilityEntry } from './compatibility'
import type { V3EquipmentDefinition } from './types'
import type { DeepReadonly, V1Definitions } from './validation'
import { ITEM_CATALOG } from '../itemCatalog'
import { ITEM_DEFS } from '../items'
import { findV3EquipmentDefinition } from './catalogue'
import { V3_EQUIPMENT_COMPATIBILITY } from './compatibility'
import { validateEquipmentCompatibility } from './validation'

interface ResultBase {
  readonly activation: 'inactive'
  readonly source: V3EquipmentDefinition
  readonly compatibility: CompatibilityEntry
}
export type EquipmentProjection =
  | (ResultBase & { readonly kind: 'existing-v1-profile', readonly profile: Readonly<{ definition: DeepReadonly<ItemDef>, gameplay: DeepReadonly<ItemCatalogEntry> }> })
  | (ResultBase & { readonly kind: 'new-candidate' | 'deferred' | 'conflict' })
  | { readonly kind: 'unknown-id', readonly id: string, readonly activation: 'inactive' }
  | { readonly kind: 'conflict', readonly id: string, readonly activation: 'inactive', readonly errors: readonly string[] }

/** Canonical lookup only. Whole-manifest integrity failure blocks every known ID.
 * References unchanged V1 authorities; never registers or converts an item.
 */
export function projectV3Equipment(
  id: string,
  v1: V1Definitions = { definitions: ITEM_DEFS, catalog: ITEM_CATALOG },
  manifest: unknown = V3_EQUIPMENT_COMPATIBILITY,
): EquipmentProjection {
  const source = findV3EquipmentDefinition(id)
  if (!source) return Object.freeze({ kind: 'unknown-id', id, activation: 'inactive' })
  const errors = validateEquipmentCompatibility(v1, manifest)
  if (errors.length) return Object.freeze({ kind: 'conflict', id, activation: 'inactive', errors })
  // The global validator established shape, coverage and policy before this trusted read.
  const compatibility = (manifest as readonly CompatibilityEntry[]).find(entry => entry.donorId === id)!
  const base = { activation: 'inactive' as const, source, compatibility }
  if (compatibility.runtimeProjection === 'existing-v1-reference' && compatibility.target) {
    const target = compatibility.target.id
    // Freeze only the owned wrapper. Never freeze or modify the existing V1 authorities.
    return Object.freeze({ ...base, kind: 'existing-v1-profile', profile: Object.freeze({ definition: v1.definitions[target]!, gameplay: v1.catalog[target]! }) })
  }
  const kind = compatibility.classification === 'new' ? 'new-candidate'
    : compatibility.classification === 'conflict' ? 'conflict' : 'deferred'
  return Object.freeze({ ...base, kind })
}
