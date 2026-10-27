import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { ArmorQuality } from '../itemInstances'
import type { ItemKind } from '../items'
import type { EquipmentCompatibilityResult, EquipmentPropertyPath, VerifiedV1Target } from './compatibilityTypes'
import type { AmmoItem, ArmorItem, ItemBase, ItemTier, MeleeWeapon, RangedWeapon, Resist, ShieldItem, V3EquipmentDefinition } from './types'
import { V3_EQUIPMENT_PROVENANCE } from './provenance'

// Synthetic contract fixtures, deliberately not donor catalogue records.
const base = {
  id: 'contract-fixture', name: 'Contract fixture', description: 'Test data only.',
  material: 'steel', tier: 'common', weight: 1, size: 'MD', price: 1,
  durability: 200, availability: 'active', origin: 'new',
} as const

const melee: MeleeWeapon = {
  ...base, category: 'weapon', kind: 'melee', weaponClass: 'sword', grip: 'one-handed',
  damage: 10, damageType: 'cut', cooldown: 1, stamina: 5, capabilities: ['cut', 'chop'],
  reach: 1, sharpness: 0.8, legacyIds: { v1: 'historical-v1', v2: 'historical-v2' }, lore: 'Source lore.',
}
const ranged: RangedWeapon = {
  ...base, category: 'weapon', kind: 'ranged', weaponClass: 'bow', grip: 'two-handed',
  damage: 10, damageType: 'pierce', cooldown: 1, stamina: 5,
  range: 50, ammo: 'arrow', drawTime: 1.2, projectileSpeed: 60,
}
const armor: ArmorItem = {
  ...base, category: 'armor', slot: 'forearms', layer: 'under', family: 'padded',
  resist: { blunt: 0.2, cut: 0.3, pierce: 0.1 }, speedPenalty: -0.03,
}
const shield: ShieldItem = {
  ...base, category: 'shield', shieldClass: 'heater', arcDeg: 150, reduction: 0.8,
  efficiency: 0.7, parryWindowS: 0.25, canParry: true,
}
const ammo: AmmoItem = {
  ...base, category: 'ammo', ammoKind: 'bolt', damageBonus: 3, damageType: 'pierce',
}

describe('V3 equipment source contract', () => {
  it('narrows all five variants with the original category/kind discriminants', () => {
    for (const definition of [melee, ranged, armor, shield, ammo] as readonly V3EquipmentDefinition[]) {
      switch (definition.category) {
        case 'ammo': expectTypeOf(definition).toEqualTypeOf<AmmoItem>(); break
        case 'armor': expectTypeOf(definition).toEqualTypeOf<ArmorItem>(); break
        case 'shield': expectTypeOf(definition).toEqualTypeOf<ShieldItem>(); break
        case 'weapon':
          if (definition.kind === 'melee') expectTypeOf(definition).toEqualTypeOf<MeleeWeapon>()
          else expectTypeOf(definition).toEqualTypeOf<RangedWeapon>()
          break
        default: expectTypeOf(definition).toEqualTypeOf<never>()
      }
    }
  })

  it('represents all 41 documented source keys and named nested values', () => {
    const keys = new Set([melee, ranged, armor, shield, ammo].flatMap(definition => Object.keys(definition)))
    expect(keys.size).toBe(41)
    expect(armor.resist).toEqual({ blunt: 0.2, cut: 0.3, pierce: 0.1 })
    expect(armor.speedPenalty).toBe(-0.03)
    expectTypeOf<keyof Resist>().toEqualTypeOf<'blunt' | 'cut' | 'pierce'>()
    expectTypeOf<Resist>().not.toExtend<readonly number[]>()
  })

  it('keeps original optional fields optional, and resolved defaults required', () => {
    type OptionalKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? K : never }[keyof T]
    expectTypeOf<OptionalKeys<ItemBase>>().toEqualTypeOf<'legacyIds' | 'lore'>()
    expectTypeOf<OptionalKeys<MeleeWeapon>>().toEqualTypeOf<'capabilities' | 'legacyIds' | 'lore'>()
    expectTypeOf<OptionalKeys<RangedWeapon>>().toEqualTypeOf<'capabilities' | 'legacyIds' | 'lore'>()
    expectTypeOf<OptionalKeys<ArmorItem>>().toEqualTypeOf<'legacyIds' | 'lore'>()
    expectTypeOf<OptionalKeys<ShieldItem>>().toEqualTypeOf<'legacyIds' | 'lore'>()
    expectTypeOf<OptionalKeys<AmmoItem>>().toEqualTypeOf<'legacyIds' | 'lore'>()
    expectTypeOf<NonNullable<ItemBase['legacyIds']>>().toEqualTypeOf<{
      readonly v1?: string
      readonly v2?: string
    }>()
    expect(ranged.capabilities).toBeUndefined()
    expect(armor.lore).toBeUndefined()
  })

  it('separates definition tier and source IDs from V1 instance quality and identity', () => {
    expectTypeOf<ItemTier>().toEqualTypeOf<'common' | 'legendary' | 'masterwork'>()
    expectTypeOf<ItemTier>().not.toEqualTypeOf<ArmorQuality>()
    expectTypeOf<Extract<keyof V3EquipmentDefinition, 'quality' | 'itemId' | 'count' | 'edge'>>().toEqualTypeOf<never>()
    expectTypeOf<V3EquipmentDefinition['id']>().toEqualTypeOf<string>()
    expectTypeOf<VerifiedV1Target['id']>().toEqualTypeOf<ItemKind>()
  })

  it('requires explicit inactive compatibility results and decision-bearing conflicts', () => {
    expectTypeOf<EquipmentCompatibilityResult['classification']>().toEqualTypeOf<
      'existing' | 'adapted' | 'new-candidate' | 'conflict' | 'deferred'
    >()
    expectTypeOf<EquipmentCompatibilityResult['activation']>().toEqualTypeOf<'inactive'>()
    expectTypeOf<Extract<EquipmentCompatibilityResult, { activation?: 'active' }>>().toEqualTypeOf<never>()
    expectTypeOf<Extract<EquipmentCompatibilityResult, { classification: 'existing' | 'adapted' }>['target']>()
      .toEqualTypeOf<VerifiedV1Target>()
    expectTypeOf<Extract<EquipmentCompatibilityResult, { classification: 'conflict' }>['unresolvedDecisions']>()
      .not.toExtend<readonly []>()
    expectTypeOf<'resist.fire' extends EquipmentPropertyPath ? true : false>().toEqualTypeOf<false>()
  })

  it('rejects mutation, missing source fields, and implicit activation at compile time', () => {
    // Never invoked: these negative assertions are checked by TypeScript, not Vitest transpilation.
    const invalidContracts = () => {
      // @ts-expect-error source records are immutable
      melee.damage = 42
      // @ts-expect-error nested metadata is immutable too
      melee.legacyIds!.v1 = 'replacement'
      // @ts-expect-error capability arrays are immutable
      melee.capabilities!.push('cut')
      // @ts-expect-error named resistances are immutable
      armor.resist.cut = 0.5
      // @ts-expect-error all three named resistance values are required
      const incomplete: Resist = { cut: 0.1, pierce: 0.2 }
      const { durability: _durability, ...withoutDurability } = armor
      // @ts-expect-error constructor defaults are required on resolved definitions
      const missingDefault: ArmorItem = withoutDurability
      const { activation: _activation, ...withoutActivation } = inactive
      // @ts-expect-error no default activation state
      const missingActivation: EquipmentCompatibilityResult = withoutActivation
      // @ts-expect-error donor availability cannot authorize activation
      const activated: EquipmentCompatibilityResult = { ...inactive, activation: melee.availability }
      // @ts-expect-error a new candidate cannot claim a verified V1 target
      const candidate: EquipmentCompatibilityResult = { ...inactive, classification: 'new-candidate', target: { id: 'knife', verifiedRevision: 'revision', evidence: 'test' } }
      // @ts-expect-error conflicts must have at least one unresolved decision
      const conflict: EquipmentCompatibilityResult = { ...inactive, classification: 'conflict', unresolvedDecisions: [] }
      return [incomplete, missingDefault, missingActivation, activated, candidate, conflict]
    }
    const inactive: EquipmentCompatibilityResult = {
      donorId: 'contract-fixture', classification: 'deferred', activation: 'inactive',
      unresolvedDecisions: [], properties: [],
    }
    expectTypeOf(invalidContracts).toBeFunction()
    expect(inactive.activation).toBe('inactive')
  })

  it('keeps production imports type-only and all runtime dependencies inside this module', () => {
    const directory = fileURLToPath(new URL('.', import.meta.url))
    const files = readdirSync(directory).filter(name => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    expect(files.sort()).toEqual(['compatibilityTypes.ts', 'provenance.ts', 'types.ts'])
    for (const file of files) {
      const source = ts.createSourceFile(file, readFileSync(`${directory}/${file}`, 'utf8'), ts.ScriptTarget.Latest, true)
      const check = (node: ts.Node): void => {
        if (ts.isImportDeclaration(node)) expect(node.importClause?.isTypeOnly).toBe(true)
        if (ts.isExportDeclaration(node)) expect(node.moduleSpecifier).toBeUndefined()
        if (ts.isCallExpression(node)) {
          // Object.freeze is the only initialization; no dynamic imports/require/calls into gameplay.
          expect(node.expression.getText(source)).toBe('Object.freeze')
        }
        ts.forEachChild(node, check)
      }
      check(source)
      const emitted = ts.transpileModule(source.text, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: true },
      }).outputText
      expect(emitted).not.toMatch(/\b(?:import|require)\s*[("'{*]/)
    }
  })

  it('retains the approved count baseline in frozen provenance metadata', () => {
    const metadata = V3_EQUIPMENT_PROVENANCE
    expect(metadata.expectedCounts).toEqual({ melee: 30, ranged: 8, armor: 39, shields: 3, ammunition: 7, total: 87 })
    expect(Object.isFrozen(metadata)).toBe(true)
    for (const nested of [metadata.units, metadata.sourcePaths, metadata.expectedCounts]) {
      expect(Object.isFrozen(nested)).toBe(true)
    }
  })
})
