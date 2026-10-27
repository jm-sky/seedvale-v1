import type { ItemCatalogEntry } from '../itemCatalog'
import type { ItemDef, ItemKind } from '../items'
import type { CompatibilityEntry } from './compatibility'
import type { V3EquipmentDefinition } from './types'
import { V3_EQUIPMENT_DEFINITIONS } from './catalogue'
import { matchesReviewedPolicy, V1_VERIFICATION_REVISION, V3_EQUIPMENT_COMPATIBILITY } from './compatibility'
import { PROPERTY_CLASSES, propertyPaths } from './propertyCompatibility'
import { V3_EQUIPMENT_PROVENANCE } from './provenance'

export type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }
/** Narrow read-only authority supplied by the adapter, never imported by source data/policy. */
export interface V1Definitions {
  readonly definitions: Readonly<Partial<Record<ItemKind, DeepReadonly<ItemDef>>>>
  readonly catalog: Readonly<Partial<Record<ItemKind, DeepReadonly<ItemCatalogEntry>>>>
}

// Identity/family assertions only, no second copy of gameplay numbers.
const meleeFamilies = {
  dagger: ['knife', 'dagger', 'damascus_knife'],
  sword: ['short_sword', 'long_sword', 'damascus_short_sword', 'damascus_long_sword', 'obsidian_sword', 'masterwork_sword'],
  axe: ['hatchet', 'axe', 'battle_axe'], spear: ['spear'],
} as const

function compatibleFamily(source: V3EquipmentDefinition, id: ItemKind, v1: V1Definitions): boolean {
  const def = v1.definitions[id]
  const entry = v1.catalog[id]
  if (!def || !entry || entry.kind !== id || def.kind !== id) return false
  if (source.category === 'weapon') {
    if (!entry.holdable || !def.categories.some(c => c === 'weapon' || c === 'tool')) return false
    if (source.kind === 'melee') {
      const family = meleeFamilies[source.weaponClass as keyof typeof meleeFamilies] as readonly string[] | undefined
      return !!entry.melee && !entry.ranged && !!family?.includes(id)
    }
    const ammo = source.ammo === 'stone' ? 'stone' : source.ammo === 'bolt' ? 'bolt' : 'arrow'
    return !!entry.ranged?.ammoKinds.includes(ammo) && !entry.armor
  }
  if (source.category === 'armor') {
    // Compare existing profile roles only. No slot conversion is exported or applied.
    const slot = source.slot === 'torso' ? 'body' : source.slot === 'shoulders' ? 'arms' : source.slot
    return source.layer === 'outer' && source.slot !== 'forearms'
      && def.categories.includes('armor') && entry.armor?.slot === slot
  }
  if (source.category === 'ammo') {
    if (!def.categories.includes('resource')) return false
    const carrier = source.ammoKind === 'stone' ? 'sling' : source.ammoKind === 'bolt' ? 'crossbow' : 'short_bow'
    return !!v1.catalog[carrier]?.ranged?.ammoKinds.includes(id)
      && (source.ammoKind !== 'stone' || !!entry.throwable)
  }
  return false // No shield family in V1.
}

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)
const isString = (value: unknown): value is string => typeof value === 'string'
const optionalString = (value: unknown) => value === undefined || isString(value)
const stringArray = (value: unknown): value is string[] => Array.isArray(value) && Array.from(value).every(isString)

/** Narrow untrusted data before any nested access. No normalization or repair. */
function hasEntryShape(value: unknown, fail: (reason: string) => void): value is CompatibilityEntry {
  if (!isRecord(value)) { fail('entry must be an object'); return false }
  const invalid: string[] = []
  const require = (valid: boolean, field: string) => { if (!valid) invalid.push(field) }
  for (const field of ['donorId', 'classification', 'sourceRevision', 'runtimeProjection', 'activation']) require(isString(value[field]), field)
  require(optionalString(value.candidateTarget), 'candidateTarget')
  require(optionalString(value.identityRelation), 'identityRelation')
  require(isRecord(value.historicalAliases) && optionalString(value.historicalAliases.v1) && optionalString(value.historicalAliases.v2), 'historicalAliases')
  require(value.target === undefined || (isRecord(value.target) && isString(value.target.id)
    && isString(value.target.verifiedRevision) && isString(value.target.evidence)), 'target')
  require(isRecord(value.evidence) && isString(value.evidence.mappingDocument) && isString(value.evidence.sourceId)
    && optionalString(value.evidence.targetId) && stringArray(value.evidence.checks), 'evidence')
  require(Array.isArray(value.properties) && Array.from(value.properties).every(p => isRecord(p)
    && isString(p.property) && isString(p.compatibility) && isString(p.preservation) && isString(p.reason)), 'properties')
  require(Array.isArray(value.unresolvedDecisions) && Array.from(value.unresolvedDecisions).every(d => isRecord(d)
    && isString(d.id) && isString(d.question) && stringArray(d.affectedProperties)
    && d.affectedProperties.every(p => Object.hasOwn(PROPERTY_CLASSES, p))), 'unresolvedDecisions')
  require(stringArray(value.dependencies), 'dependencies')
  for (const field of invalid) fail(`invalid or missing ${field}`)
  return invalid.length === 0
}

/** Global integrity gate: reviewed policy plus executable V1 structure, never semantic approval. */
export function validateEquipmentCompatibility(
  v1: V1Definitions,
  entries: unknown = V3_EQUIPMENT_COMPATIBILITY,
  sources: readonly V3EquipmentDefinition[] = V3_EQUIPMENT_DEFINITIONS,
): readonly string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const targets = new Map<string, string>()
  const sourceIds = new Set(sources.map(source => source.id))
  if (sourceIds.size !== sources.length) errors.push('duplicate source canonical ID')
  if (!Array.isArray(entries)) return Object.freeze(['manifest: expected an array'])
  for (const [index, value] of entries.entries()) {
    const label = isRecord(value) && isString(value.donorId) ? value.donorId : `manifest[${index}]`
    if (!hasEntryShape(value, reason => errors.push(`${label}: ${reason}`))) continue
    const entry = value
    const id = entry.donorId
    const fail = (reason: string) => errors.push(`${id}: ${reason}`)
    if (ids.has(id)) fail('duplicate manifest ID')
    ids.add(id)
    const source = sources.find(source => source.id === id)
    if (!source) { fail('unknown canonical ID'); continue }
    if (!matchesReviewedPolicy(entry)) fail('reviewed classification/identity/projection policy mismatch')
    if (!['adapt', 'conflict', 'deferred', 'existing', 'new'].includes(entry.classification)) fail('invalid classification')
    if (entry.sourceRevision !== V3_EQUIPMENT_PROVENANCE.sourceRevision) fail('source revision drift')
    if (entry.activation !== 'inactive') fail('activation forbidden')
    if (!['blocked', 'existing-v1-reference'].includes(entry.runtimeProjection)) fail('invalid projection permission')
    if (entry.historicalAliases.v1 !== source.legacyIds?.v1 || entry.historicalAliases.v2 !== source.legacyIds?.v2) fail('historical alias drift')
    const expectedPaths = propertyPaths(source)
    if (entry.properties.length !== expectedPaths.length || new Set(entry.properties.map(p => p.property)).size !== expectedPaths.length) fail('incomplete/duplicate property coverage')
    for (const property of entry.properties) {
      if (!Object.hasOwn(PROPERTY_CLASSES, property.property) || !expectedPaths.includes(property.property) || property.compatibility !== PROPERTY_CLASSES[property.property]
        || property.preservation !== 'source-preserved') fail(`invalid property classification: ${property.property}`)
    }
    const targetId = entry.target?.id ?? entry.candidateTarget
    if (entry.target && entry.candidateTarget) fail('ambiguous target')
    if (entry.evidence.sourceId !== id || entry.evidence.targetId !== targetId
      || entry.evidence.mappingDocument !== '2026-10-27--equipment-id-mapping.md'
      || entry.evidence.checks.join(',') !== 'identity,category,gameplay-family') fail('untraceable evidence')
    if (targetId) {
      if (targets.has(targetId)) fail(`multiple donors target ${targetId}; no sharing policy approved (${targets.get(targetId)})`)
      targets.set(targetId, id)
      if (!v1.catalog[targetId] || !v1.definitions[targetId]) fail(`missing V1 target: ${targetId}`)
      else if (!compatibleFamily(source, targetId, v1)) fail('incompatible target category/gameplay family')
      if (entry.identityRelation === 'canonical') {
        if (targetId !== id || (source.legacyIds?.v1 !== undefined && source.legacyIds.v1 !== targetId)) fail('canonical collision')
      } else if (entry.identityRelation === 'historical-v1') {
        if (source.legacyIds?.v1 !== targetId) fail('unproven historical relationship')
      } else if (entry.identityRelation === 'candidate') {
        if (id !== 'sling_stone' || targetId !== 'stone' || entry.target) fail('unapproved candidate relationship')
      } else fail('missing identity evidence')
    } else if (entry.identityRelation) fail('identity relation without target')
    const canReference = (entry.classification === 'existing' || entry.classification === 'adapt') && entry.identityRelation !== 'candidate'
    if (canReference !== !!entry.target) fail('classification/verified target mismatch')
    if ((entry.classification === 'existing' && entry.identityRelation !== 'canonical')
      || (entry.classification === 'adapt' && !['candidate', 'historical-v1'].includes(entry.identityRelation ?? ''))) fail('classification/identity mismatch')
    if (entry.runtimeProjection === 'existing-v1-reference' && !canReference) fail('unsafe projection permission')
    if (entry.target && entry.target.verifiedRevision !== V1_VERIFICATION_REVISION) fail('V1 verification revision drift')
    if (entry.unresolvedDecisions.length === 0) fail('missing unresolved semantic decisions')
    // These reviewed ambiguities cannot be cleared merely by changing a target/permission field.
    if (['arrow', 'fenmoor_sword', 'marlow_longbow', 'obsidian_knife'].includes(id)
      && (entry.classification !== 'conflict' || entry.target || entry.runtimeProjection !== 'blocked')) fail('unresolved conflict cannot project')
    if (id === 'sling_stone' && (entry.classification !== 'adapt' || entry.target || entry.runtimeProjection !== 'blocked')) fail('candidate cannot project')
    if ((entry.classification === 'new' || entry.classification === 'deferred') && targetId) fail('unexpected target')
  }
  for (const id of sourceIds) if (!ids.has(id)) errors.push(`${id}: missing manifest entry`)
  return Object.freeze(errors)
}
