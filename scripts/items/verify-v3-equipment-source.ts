/** Read-only, opt-in source audit. Usage: node --import tsx scripts/items/verify-v3-equipment-source.ts /path/to/donor */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { V3_EQUIPMENT_PROVENANCE as provenance } from '../../src/items/v3Equipment/provenance'

const donor = process.argv[2]
if (!donor) throw new Error('Pass the donor checkout path; this check never fetches or modifies it.')
const donorRoot = resolve(donor)
const git = (...args: string[]) => execFileSync('git', ['-C', donorRoot, ...args], { encoding: 'utf8' }).trim()
assert.equal(git('rev-parse', 'HEAD'), provenance.sourceRevision, 'Donor revision drift: review before changing provenance')
assert.match(git('remote', 'get-url', 'origin'), /github\.com[:/]jm-sky\/seedvale(?:\.git)?$/)

for (const path of Object.values(provenance.sourcePaths)) {
  const current = readFileSync(resolve(donorRoot, path), 'utf8')
  assert.equal(current, execFileSync('git', ['-C', donorRoot, 'show', `${provenance.sourceRevision}:${path}`], { encoding: 'utf8' }), `Working-tree source drift: ${path}`)
  assert.equal(current, execFileSync('git', ['-C', donorRoot, 'show', `${provenance.reconRevision}:${path}`], { encoding: 'utf8' }), `Approved recon baseline drift: ${path}`)
}

// Check actual donor types/exports in an isolated compiler program, without emitting or starting either application.
const types = [
  'DamageType', 'SizeClass', 'ItemCategory', 'ItemMaterial', 'ItemTier', 'ItemAvailability', 'ItemOrigin',
  'LegacyIds', 'ItemBase', 'MeleeClass', 'RangedClass', 'WeaponClass', 'Grip', 'AmmoKind', 'WeaponCapability',
  'MeleeWeapon', 'RangedWeapon', 'WeaponItem', 'AmmoItem', 'ShieldClass', 'ShieldItem',
  'ArmorSlot', 'ArmorLayer', 'ArmorFamily', 'Resist', 'ArmorItem',
]
const modulePath = (path: string) => JSON.stringify(path.replaceAll('\\', '/'))
const localTypes = fileURLToPath(new URL('../../src/items/v3Equipment/types.ts', import.meta.url))
const directory = mkdtempSync(resolve(tmpdir(), 'seedvale-equipment-contract-'))
try {
  const checkPath = resolve(directory, 'donor-check.ts')
  writeFileSync(checkPath, `
import type * as Source from ${modulePath(resolve(donorRoot, provenance.sourcePaths.types))}
import type * as Port from ${modulePath(localTypes)}
import { MELEE_WEAPONS, RANGED_WEAPONS, AMMO, SHIELDS } from ${modulePath(resolve(donorRoot, provenance.sourcePaths.weapons))}
import { ARMOR } from ${modulePath(resolve(donorRoot, provenance.sourcePaths.armor))}
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
export type Checks = [
${types.map(name => `Assert<Equal<DeepReadonly<Source.${name}>, DeepReadonly<Port.${name}>>>`).join(',\n')},
Assert<Equal<DeepReadonly<Source.MeleeWeapon | Source.RangedWeapon | Source.ArmorItem | Source.ShieldItem | Source.AmmoItem>, DeepReadonly<Port.V3EquipmentDefinition>>>
]
export const arrays: readonly (readonly Port.V3EquipmentDefinition[])[] = [MELEE_WEAPONS, RANGED_WEAPONS, ARMOR, SHIELDS, AMMO]
`)
  const program = ts.createProgram([checkPath], {
    strict: true, noEmit: true, skipLibCheck: true, types: [], allowImportingTsExtensions: true,
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022,
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name, getCurrentDirectory: () => directory, getNewLine: () => '\n',
  }))
} finally {
  rmSync(directory, { recursive: true, force: true })
}

// Only these two pure constructor files are evaluated in a bounded VM, with no require/import capability.
// Never evaluate catalog.ts: its barrel also initializes unrelated goods and derived lookups.
function readArray(path: string, exportName: string): readonly unknown[] {
  const text = readFileSync(resolve(donorRoot, path), 'utf8')
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) assert.equal(statement.importClause?.isTypeOnly, true, `Runtime import in ${path}`)
  }
  const exports: Record<string, unknown> = {}
  const { outputText } = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  runInNewContext(outputText, { exports }, { filename: path, timeout: 1000 })
  const array = exports[exportName]
  assert.ok(Array.isArray(array), `Missing array ${exportName}`)
  return array as readonly unknown[]
}

const families = {
  melee: readArray(provenance.sourcePaths.weapons, 'MELEE_WEAPONS'),
  ranged: readArray(provenance.sourcePaths.weapons, 'RANGED_WEAPONS'),
  armor: readArray(provenance.sourcePaths.armor, 'ARMOR'),
  shields: readArray(provenance.sourcePaths.weapons, 'SHIELDS'),
  ammunition: readArray(provenance.sourcePaths.weapons, 'AMMO'),
}
for (const family of Object.keys(families) as (keyof typeof families)[]) {
  assert.equal(families[family].length, provenance.expectedCounts[family], `Count drift: ${family}`)
}
const definitions = Object.values(families).flat()
assert.equal(definitions.length, provenance.expectedCounts.total)
const keys = new Set(definitions.flatMap(definition => {
  assert.ok(definition !== null && typeof definition === 'object')
  return Object.keys(definition)
}))
assert.equal(keys.size, 41, 'Resolved source property drift')
console.log(`PASS: ${types.length} source type/domain equalities, five typed exports, 41 resolved keys; counts 30/8/39/3/7 = 87. Source ${provenance.sourceRevision}; no source drift from recon.`)
