export interface EquipmentFamilyCounts {
  readonly melee: number
  readonly ranged: number
  readonly armor: number
  readonly shields: number
  readonly ammunition: number
  readonly total: number
}

/** Audit metadata only. The version belongs to this preservation schema, not saves. */
export interface V3EquipmentProvenance {
  readonly repository: 'jm-sky/seedvale'
  readonly sourceRevision: string
  readonly reconRevision: string
  readonly sourcePaths: {
    readonly types: string
    readonly weapons: string
    readonly armor: string
    readonly catalog: string
  }
  readonly schemaVersion: 1
  readonly catalogueVersion: 'v3-equipment-87'
  readonly expectedCounts: EquipmentFamilyCounts
  readonly units: {
    readonly weight: 'kg'
    readonly reach: 'm'
    readonly range: 'm (effective)'
    readonly cooldown: 'gameplay s'
    readonly drawTime: 'gameplay s (full draw)'
    readonly projectileSpeed: 'm/s'
    readonly parryWindowS: 'gameplay s'
    readonly arcDeg: 'degrees (covered frontal arc)'
    readonly price: 'copper (100 copper = 1 silver; 100 silver = 1 gold)'
    readonly durability: 'absolute item HP at average quality'
    readonly damage: 'damage points per hit at average quality'
    readonly damageBonus: 'damage points added to weapon damage'
    readonly stamina: 'points per swing/shot'
    readonly sharpness: 'fraction 0..1 (base edge)'
    readonly resist: 'fraction 0..0.95 per named damage type'
    readonly speedPenalty: 'fraction of walking speed lost (negative allowed)'
    readonly reduction: 'fraction of damage removed on block'
    readonly efficiency: 'share of blocked damage not wearing shield'
    readonly size: 'source SizeClass (no physical length conversion)'
  }
}

/**
 * Verified local donor HEAD on 2026-10-27, not a freshly fetched remote.
 * All four source paths are unchanged since reconRevision. No records imported.
 */
export const V3_EQUIPMENT_PROVENANCE: V3EquipmentProvenance = Object.freeze({
  repository: 'jm-sky/seedvale',
  sourceRevision: '907e17cd2ad487547a25a1f928b2770348183d75',
  reconRevision: '94c464739d46afb982949fd6ed96b0d74d265b10',
  sourcePaths: Object.freeze({
    types: 'src/game/data/items/types.ts',
    weapons: 'src/game/data/items/weapons.ts',
    armor: 'src/game/data/items/armor.ts',
    catalog: 'src/game/data/items/catalog.ts',
  }),
  schemaVersion: 1,
  catalogueVersion: 'v3-equipment-87',
  expectedCounts: Object.freeze({ melee: 30, ranged: 8, armor: 39, shields: 3, ammunition: 7, total: 87 }),
  units: Object.freeze({
    weight: 'kg',
    reach: 'm',
    range: 'm (effective)',
    cooldown: 'gameplay s',
    drawTime: 'gameplay s (full draw)',
    projectileSpeed: 'm/s',
    parryWindowS: 'gameplay s',
    arcDeg: 'degrees (covered frontal arc)',
    price: 'copper (100 copper = 1 silver; 100 silver = 1 gold)',
    durability: 'absolute item HP at average quality',
    damage: 'damage points per hit at average quality',
    damageBonus: 'damage points added to weapon damage',
    stamina: 'points per swing/shot',
    sharpness: 'fraction 0..1 (base edge)',
    resist: 'fraction 0..0.95 per named damage type',
    speedPenalty: 'fraction of walking speed lost (negative allowed)',
    reduction: 'fraction of damage removed on block',
    efficiency: 'share of blocked damage not wearing shield',
    size: 'source SizeClass (no physical length conversion)',
  }),
})
