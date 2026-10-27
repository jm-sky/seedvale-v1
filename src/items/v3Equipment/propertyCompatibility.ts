import type { EquipmentPropertyPath, PropertyCompatibility } from './compatibilityTypes'
import type { V3EquipmentDefinition } from './types'

type PropertyClass = PropertyCompatibility['compatibility']
/** Matrix classes describe source semantics, never permission to replace V1 values. */
export const PROPERTY_CLASSES = Object.freeze({
  id: 'adapted', name: 'preserved', description: 'preserved', category: 'adapted',
  material: 'preserved', tier: 'preserved', weight: 'conflict', size: 'adapted',
  price: 'conflict', durability: 'conflict', availability: 'preserved', origin: 'preserved',
  legacyIds: 'preserved', 'legacyIds.v1': 'preserved', 'legacyIds.v2': 'preserved', lore: 'preserved',
  kind: 'adapted', weaponClass: 'adapted', grip: 'future-mechanics',
  damage: 'conflict', damageType: 'future-mechanics', cooldown: 'conflict', stamina: 'conflict',
  capabilities: 'adapted', reach: 'conflict', sharpness: 'conflict', range: 'conflict',
  ammo: 'adapted', drawTime: 'conflict', projectileSpeed: 'conflict',
  ammoKind: 'adapted', damageBonus: 'conflict', shieldClass: 'future-mechanics',
  arcDeg: 'conflict', reduction: 'conflict', efficiency: 'future-mechanics',
  parryWindowS: 'future-mechanics', canParry: 'future-mechanics', slot: 'conflict',
  layer: 'future-mechanics', family: 'preserved', resist: 'conflict',
  'resist.blunt': 'conflict', 'resist.cut': 'conflict', 'resist.pierce': 'conflict', speedPenalty: 'conflict',
} satisfies Record<EquipmentPropertyPath, PropertyClass>)

/** Own keys (including own undefined) and named nested fields are accounted for exactly once. */
export function propertyPaths(source: V3EquipmentDefinition): readonly EquipmentPropertyPath[] {
  return [
    ...Object.keys(source),
    ...Object.keys(source.legacyIds ?? {}).map(key => `legacyIds.${key}`),
    ...(source.category === 'armor' ? Object.keys(source.resist).map(key => `resist.${key}`) : []),
  ] as EquipmentPropertyPath[]
}

export function propertyCompatibilityFor(source: V3EquipmentDefinition): readonly PropertyCompatibility[] {
  return Object.freeze(propertyPaths(source).map(property => Object.freeze({
    property, compatibility: PROPERTY_CLASSES[property], preservation: 'source-preserved' as const,
    reason: 'See 2026-10-27--equipment-property-matrix.md; source value remains inert and unchanged.',
  })))
}
