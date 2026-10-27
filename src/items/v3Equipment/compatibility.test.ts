import { readFileSync } from 'node:fs'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { ItemKind } from '../items'
import type { CanonicalV3Id, CompatibilityEntry } from './compatibility'
import type { V1Definitions } from './validation'
import { Inventory } from '../Inventory'
import { ITEM_CATALOG } from '../itemCatalog'
import { ITEM_DEFS } from '../items'
import { projectV3Equipment } from './adapter'
import { findV3EquipmentDefinition, V3_EQUIPMENT_DEFINITIONS } from './catalogue'
import { V3_EQUIPMENT_COMPATIBILITY as manifest } from './compatibility'
import { validateEquipmentCompatibility } from './validation'

const v1: V1Definitions = { catalog: ITEM_CATALOG, definitions: ITEM_DEFS }
const entry = (id: CanonicalV3Id) => manifest.find(entry => entry.donorId === id)!
const replace = (id: CanonicalV3Id, changes: Partial<CompatibilityEntry>) => manifest.map(e => e.donorId === id ? { ...e, ...changes } : e)
const errors = (entries: readonly CompatibilityEntry[], data = v1) => validateEquipmentCompatibility(data, entries).join('\n')

describe('exhaustive compatibility manifest', () => {
  it('matches all 87 independently reviewed mapping rows, including candidate targets', () => {
    const mapping = readFileSync(new URL('../../../docs/research/v1-revival/2026-10-27--equipment-id-mapping.md', import.meta.url), 'utf8')
    const table = mapping.split(/## All definitions\r?\n/)[1]!.split(/\r?\n## /)[0]!
    const rows = table.split(/\r?\n/).filter(line => line.startsWith('| `')).map(line => {
      const cells = line.split('|').map(cell => cell.trim())
      return { id: cells[1]!.replaceAll('`', ''), target: cells[2]!.match(/^`([^`]+)`$/)?.[1], classification: cells[6]!.toLowerCase() }
    })
    expect(rows).toHaveLength(87)
    expect(manifest.map(e => ({ id: e.donorId, target: e.target?.id ?? e.candidateTarget, classification: e.classification }))).toEqual(rows)
  })

  it('rejects every unapproved classification transition for all 87 IDs', () => {
    for (const e of manifest) {
      for (const classification of ['existing', 'adapt', 'new', 'conflict', 'deferred'] as const) {
        if (classification === e.classification) continue
        const changed = replace(e.donorId, { classification })
        expect(errors(changed), `${e.donorId} → ${classification}`).toMatch(/reviewed .*policy mismatch/)
        expect(projectV3Equipment(e.donorId, v1, changed)).toMatchObject({ kind: 'conflict', activation: 'inactive' })
      }
    }
  })

  it('rejects internally consistent reclassification, including swaps preserving totals', () => {
    const changed = manifest.map(e => e.donorId === 'padded_cap' ? { ...e, classification: 'deferred' as const }
      : e.donorId === 'falchion' ? { ...e, classification: 'new' as const } : e)
    expect(errors(changed)).toMatch(/padded_cap: reviewed .*policy mismatch/)
    expect(errors(changed)).toMatch(/falchion: reviewed .*policy mismatch/)
    const removed = replace('knife', { classification: 'new', target: undefined, identityRelation: undefined,
      runtimeProjection: 'blocked', evidence: { ...entry('knife').evidence, targetId: undefined } })
    expect(errors(removed)).toMatch(/knife: reviewed .*policy mismatch/)
  })

  it('protects verified targets, candidate relationships and exact projection permissions', () => {
    const changed = replace('knife', { target: entry('dagger').target, identityRelation: 'historical-v1', evidence: { ...entry('knife').evidence, targetId: 'dagger' } })
    expect(errors(changed)).toMatch(/knife: reviewed .*policy mismatch/)
    expect(errors(replace('sling_stone', { candidateTarget: 'arrow' }))).toMatch(/sling_stone: reviewed .*policy mismatch/)
    expect(errors(replace('knife', { runtimeProjection: 'blocked' }))).toMatch(/knife: reviewed .*policy mismatch/)
    expect(errors(replace('padded_cap', { runtimeProjection: 'existing-v1-reference' }))).toMatch(/padded_cap: reviewed .*policy mismatch/)
  })

  it('proves 87/87 unique IDs, classifications and real current V1 target structure', () => {
    expect(manifest).toHaveLength(87)
    expect(new Set(manifest.map(e => e.donorId)).size).toBe(87)
    expect(manifest.map(e => e.donorId)).toEqual(V3_EQUIPMENT_DEFINITIONS.map(d => d.id))
    const totals = Object.fromEntries(['existing', 'adapt', 'new', 'conflict', 'deferred'].map(c => [c, manifest.filter(e => e.classification === c).length]))
    expect(totals).toEqual({ existing: 17, adapt: 9, new: 27, conflict: 4, deferred: 30 })
    expect(validateEquipmentCompatibility(v1)).toEqual([])
    expect(manifest.filter(e => e.target)).toHaveLength(25)
    expect(manifest.filter(e => e.candidateTarget)).toHaveLength(4)
    for (const e of manifest) {
      if (e.target) {
        expect(ITEM_CATALOG[e.target.id].kind).toBe(e.target.id)
        expect(ITEM_DEFS[e.target.id].kind).toBe(e.target.id)
      }
      expect(Object.isFrozen(e)).toBe(true)
      expect(e.activation).toBe('inactive')
    }
  })

  it('rejects missing, unexpected and duplicate canonical mappings', () => {
    expect(errors(manifest.slice(1))).toMatch(/knife: missing manifest/)
    expect(errors([...manifest, entry('knife')])).toMatch(/duplicate manifest/)
    expect(errors([...manifest, { ...entry('knife'), donorId: 'unexpected' as CanonicalV3Id }])).toMatch(/unknown canonical/)
    expect(validateEquipmentCompatibility(v1, manifest, [...V3_EQUIPMENT_DEFINITIONS, V3_EQUIPMENT_DEFINITIONS[0]!]).join()).toMatch(/duplicate source/)
  })

  it('rejects non-existent targets, regardless of a plausible evidence string', () => {
    const catalog = { ...ITEM_CATALOG }
    delete (catalog as Partial<typeof catalog>).knife
    expect(errors(manifest, { ...v1, catalog })).toMatch(/missing V1 target: knife/)
    expect(errors(replace('knife', { target: { ...entry('knife').target!, id: 'obsidian_knife' as ItemKind, evidence: 'verified!' } }))).toMatch(/missing V1 target/)
  })

  it('checks actual target category, gameplay family, ammo consumers and armor slot', () => {
    for (const data of [
      { ...v1, definitions: { ...ITEM_DEFS, knife: { ...ITEM_DEFS.knife, categories: ['food'] as const } } },
      { ...v1, catalog: { ...ITEM_CATALOG, knife: { ...ITEM_CATALOG.knife, melee: null } } },
      { ...v1, catalog: { ...ITEM_CATALOG, short_bow: { ...ITEM_CATALOG.short_bow, ranged: null } } },
      { ...v1, catalog: { ...ITEM_CATALOG, chainmail: { ...ITEM_CATALOG.chainmail, armor: { ...ITEM_CATALOG.chainmail.armor!, slot: 'hands' as const } } } },
    ]) expect(errors(manifest, data)).toMatch(/incompatible target category\/gameplay family/)
    expect(errors(replace('knife', { target: { ...entry('knife').target!, id: 'axe' } }))).toMatch(/incompatible target category\/gameplay family/)
  })

  it('detects many-to-one mappings, unproven aliases and forged traceability', () => {
    expect(errors(replace('damascus_dagger', { target: entry('knife').target }))).toMatch(/multiple donors target knife/)
    expect(errors(replace('knife', { identityRelation: 'historical-v1', historicalAliases: { v1: 'axe' } }))).toMatch(/historical alias drift/)
    expect(errors(replace('knife', { evidence: { ...entry('knife').evidence, sourceId: 'axe' } }))).toMatch(/untraceable evidence/)
    expect(errors(replace('knife', { sourceRevision: 'new-pin' }))).toMatch(/source revision drift/)
    expect(errors(replace('knife', { target: { ...entry('knife').target!, verifiedRevision: 'unreviewed' } }))).toMatch(/V1 verification revision drift/)
  })

  it('requires complete valid property accounting including undefined/nested keys', () => {
    const properties = entry('mail_shirt').properties
    expect(errors(replace('mail_shirt', { properties: properties.slice(1) }))).toMatch(/property coverage/)
    expect(errors(replace('mail_shirt', { properties: [...properties, properties[0]!] }))).toMatch(/property coverage/)
    expect(errors(replace('mail_shirt', { properties: properties.map(p => p.property === 'resist.cut' ? { ...p, compatibility: 'direct' } : p) }))).toMatch(/invalid property classification: resist.cut/)
    expect(entry('padded_cap').properties.some(p => p.property === 'legacyIds')).toBe(true)
  })

  it('prevents conflicts/candidates from gaining projection by metadata edits', () => {
    for (const id of ['arrow', 'marlow_longbow', 'fenmoor_sword', 'obsidian_knife', 'sling_stone'] as const) {
      expect(errors(replace(id, { runtimeProjection: 'existing-v1-reference' }))).toMatch(/cannot project|projection permission/)
      expect(errors(replace(id, { unresolvedDecisions: [] }))).toMatch(/missing unresolved/)
    }
    expect(errors(replace('arrow', { classification: 'existing', target: { ...entry('knife').target!, id: 'arrow' }, candidateTarget: undefined, identityRelation: 'canonical' }))).toMatch(/canonical collision/)
  })
})

describe('pure canonical adapter', () => {
  it.each([
    ['arrow_bodkin', 'war_arrow'], ['mail_shirt', 'chainmail'], ['leather_jerkin', 'leather_armor'],
    ['plate_pauldrons_spiked', 'knight_pauldron_spike'], ['plate_pauldrons_round', 'knight_pauldron_round'],
    ['leather_pauldron', 'leather_pauldron'], ['ranger_pauldron', 'ranger_pauldron'],
  ] as const)('references the complete original V1 profile for %s → %s', (id, target) => {
    const result = projectV3Equipment(id)
    expect(result.kind).toBe('existing-v1-profile')
    if (result.kind !== 'existing-v1-profile') throw new Error('Expected V1 reference')
    expect(result.profile.definition).toBe(ITEM_DEFS[target])
    expect(result.profile.gameplay).toBe(ITEM_CATALOG[target])
    expect(result.compatibility.classification).toBe(entry(id).classification)
    expectTypeOf(result.profile.gameplay).toExtend<Readonly<typeof ITEM_CATALOG[typeof target]>>()
  })

  it.each(['arrow', 'marlow_longbow', 'fenmoor_sword', 'obsidian_knife'])('fails closed for %s', id => {
    const result = projectV3Equipment(id)
    expect(result.kind).toBe('conflict')
    expect(result).not.toHaveProperty('profile')
  })

  it('distinguishes historical aliases, candidate adaptation and unsupported source data', () => {
    expect(entry('obsidian_knife').historicalAliases.v1).toBe('obsidian_knife')
    expect(entry('obsidian_knife').target).toBeUndefined()
    expect(entry('sling_stone')).toMatchObject({ classification: 'adapt', candidateTarget: 'stone', identityRelation: 'candidate', historicalAliases: { v2: 'sling_stone' } })
    expect(entry('sling_stone').historicalAliases.v1).toBeUndefined()
    expect(projectV3Equipment('sling_stone').kind).toBe('deferred')
    for (const id of ['padded_cap', 'leather_bracers', 'leather_boots', 'obsidian_dagger']) {
      const result = projectV3Equipment(id)
      expect(result.kind).toBe('new-candidate')
      expect(result).not.toHaveProperty('profile')
    }
    expect(projectV3Equipment('wooden_shield').kind).toBe('deferred')
    for (const id of ['broadhead_arrow', 'war_arrow', 'damascus_knife', 'chainmail', 'shovel', 'pitchfork', 'sickle', 'shears', 'pickaxe', 'steel_bracers', '', 'toString', '__proto__']) {
      expect(projectV3Equipment(id)).toEqual({ kind: 'unknown-id', id, activation: 'inactive' })
    }
  })

  it('returns safe conflicts for damaged policy/authorities, with no fallback', () => {
    expect(projectV3Equipment('knife', v1, manifest.slice(1)).kind).toBe('conflict')
    expect(projectV3Equipment('knife', { ...v1, catalog: {} }).kind).toBe('conflict')
    expect(projectV3Equipment('arrow', v1, replace('arrow', { runtimeProjection: 'existing-v1-reference' })).kind).toBe('conflict')
    // Even a conservative permission change requires a reviewed baseline update.
    const blocked = replace('mail_shirt', { runtimeProjection: 'blocked' })
    expect(errors(blocked)).toMatch(/reviewed .*policy mismatch/)
    expect(projectV3Equipment('mail_shirt', v1, blocked).kind).toBe('conflict')
  })

  it.each([
    ['target', { target: undefined }],
    ['target', { target: null }],
    ['target', { target: { ...entry('knife').target, id: 4 } }],
    ['target', { target: { ...entry('knife').target, evidence: [] } }],
    ['evidence', { evidence: undefined }],
    ['evidence', { evidence: null }],
    ['evidence', { evidence: { ...entry('knife').evidence, checks: undefined } }],
    ['evidence', { evidence: { ...entry('knife').evidence, checks: ['identity', 1] } }],
    ['evidence', { evidence: { ...entry('knife').evidence, targetId: {} } }],
    ['historicalAliases', { historicalAliases: undefined }],
    ['historicalAliases', { historicalAliases: null }],
    ['historicalAliases', { historicalAliases: [] }],
    ['historicalAliases', { historicalAliases: { v1: 2 } }],
    ['properties', { properties: undefined }],
    ['properties', { properties: {} }],
    ['properties', { properties: [null] }],
    ['properties', { properties: [{ ...entry('knife').properties[0], property: {} }] }],
    ['properties', { properties: [{ ...entry('knife').properties[0], reason: 1 }] }],
    ['unresolvedDecisions', { unresolvedDecisions: null }],
    ['unresolvedDecisions', { unresolvedDecisions: [null] }],
    ['unresolvedDecisions', { unresolvedDecisions: [{ id: 'test', question: 1, affectedProperties: [] }] }],
    ['unresolvedDecisions', { unresolvedDecisions: [{ id: 'test', question: 'test', affectedProperties: [null] }] }],
    ['dependencies', { dependencies: [false] }],
    ['classification', { classification: null }],
    ['candidateTarget', { candidateTarget: {} }],
  ])('fails closed without exceptions for malformed %s: %j', (field, changes) => {
    const malformed = manifest.map(e => e.donorId === 'knife' ? { ...e, ...changes } : e)
    expect(validateEquipmentCompatibility(v1, malformed).join('\n')).toMatch(new RegExp(`knife: .*${field}`))
    const result = projectV3Equipment('knife', v1, malformed)
    expect(result).toMatchObject({ kind: 'conflict', activation: 'inactive' })
    expect(result).not.toHaveProperty('profile')
    expect(result).toHaveProperty('errors')
  })

  it.each([null, {}, 'manifest', 12, [null], [undefined]])('handles invalid manifest containers/entries: %j', malformed => {
    expect(validateEquipmentCompatibility(v1, malformed).length).toBeGreaterThan(0)
    expect(projectV3Equipment('knife', v1, malformed)).toMatchObject({ kind: 'conflict', activation: 'inactive' })
    expect(projectV3Equipment('unknown', v1, malformed)).toEqual({ kind: 'unknown-id', id: 'unknown', activation: 'inactive' })
  })

  it('rejects duplicate entries without projecting and retains explicit undefined defaults', () => {
    const result = projectV3Equipment('knife', v1, [...manifest, entry('knife')])
    expect(result).toMatchObject({ kind: 'conflict', activation: 'inactive' })
    expect(result).not.toHaveProperty('profile')
    expect(projectV3Equipment('knife', v1, undefined).kind).toBe('existing-v1-profile')
  })

  it('identifies the array index of a null entry in an otherwise complete manifest', () => {
    const malformed = manifest.map((e, index) => index === 1 ? null : e)
    expect(validateEquipmentCompatibility(v1, malformed)).toContain('manifest[1]: entry must be an object')
    const result = projectV3Equipment('knife', v1, malformed)
    expect(result).toMatchObject({ kind: 'conflict', activation: 'inactive' })
    expect(result).not.toHaveProperty('profile')
  })

  it('globally blocks a valid knife lookup when unrelated mail_shirt is malformed, with diagnostics', () => {
    expect(projectV3Equipment('knife').kind).toBe('existing-v1-profile')
    const malformed = manifest.map(e => e.donorId === 'mail_shirt' ? { ...e, evidence: undefined } : e)
    const result = projectV3Equipment('knife', v1, malformed)
    expect(result).toMatchObject({ kind: 'conflict', activation: 'inactive' })
    if (!('errors' in result)) throw new Error('Expected global validation diagnostics')
    expect(result.errors).toContain('mail_shirt: invalid or missing evidence')
    expect(result).not.toHaveProperty('profile')
  })

  it('is deterministic and preserves source data, all V1 values and physical identities', () => {
    const sourceBefore = structuredClone(V3_EQUIPMENT_DEFINITIONS)
    const defsBefore = structuredClone(ITEM_DEFS)
    const catalogBefore = structuredClone(ITEM_CATALOG)
    const inventory = new Inventory({ arrow: 2, broadhead_arrow: 3, war_arrow: 4, stone: 5 })
    const inventoryBefore = inventory.toJSON()
    for (const source of V3_EQUIPMENT_DEFINITIONS) {
      const result = projectV3Equipment(source.id)
      expect(projectV3Equipment(source.id)).toEqual(result)
      expect(Object.isFrozen(result)).toBe(true)
      expect(result.activation).toBe('inactive')
      if ('source' in result) expect(result.source).toBe(findV3EquipmentDefinition(source.id))
      if (result.kind === 'existing-v1-profile') {
        const target = result.compatibility.target!.id
        expect(result.profile.definition).toBe(ITEM_DEFS[target])
        expect(result.profile.gameplay).toBe(ITEM_CATALOG[target])
      }
    }
    expect(V3_EQUIPMENT_DEFINITIONS).toStrictEqual(sourceBefore)
    expect(ITEM_DEFS).toStrictEqual(defsBefore)
    expect(ITEM_CATALOG).toStrictEqual(catalogBefore)
    expect(inventory.toJSON()).toEqual(inventoryBefore)
    expect([inventory.count('arrow'), inventory.count('broadhead_arrow'), inventory.count('war_arrow')]).toEqual([2, 3, 4])
    expect(ITEM_CATALOG).not.toHaveProperty('obsidian_knife')
    expect(ITEM_CATALOG).not.toHaveProperty('padded_cap')
  })
})
