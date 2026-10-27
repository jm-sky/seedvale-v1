/** Read-only source audit. With no argument, use the checked-in, blob-pinned source fixtures. */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import type { V3EquipmentDefinition } from '../../src/items/v3Equipment/types'
import { V3_EQUIPMENT_DEFINITIONS } from '../../src/items/v3Equipment/catalogue'
import { V3_EQUIPMENT_PROVENANCE as provenance } from '../../src/items/v3Equipment/provenance'

const fixtureRoot = fileURLToPath(new URL('./fixtures/v3-equipment/', import.meta.url))
const manifest = JSON.parse(readFileSync(resolve(fixtureRoot, 'manifest.json'), 'utf8')) as {
  repository: string
  sourceRevision: string
  blobs: Record<string, string>
}

interface GitTreeProof {
  readonly commit: string
  /** Raw Git tree bytes, base64 encoded, keyed by their object SHA. */
  readonly trees: Readonly<Record<string, string>>
}

/** Content-addressed commit-to-blob proof. Revision strings alone cannot satisfy this check. */
export function verifyPinnedTreeProof(
  proof: GitTreeProof = JSON.parse(readFileSync(resolve(fixtureRoot, 'git-tree-proof.json'), 'utf8')),
): void {
  const objectHash = (kind: string, bytes: Buffer) => createHash('sha1').update(`${kind} ${bytes.length}\0`).update(bytes).digest('hex')
  assert.equal(objectHash('commit', Buffer.from(proof.commit)), provenance.sourceRevision, 'Pinned commit proof hash mismatch')
  const root = /^tree ([0-9a-f]{40})\n/.exec(proof.commit)?.[1]
  assert.ok(root, 'Pinned commit proof lacks a root tree')
  for (const [path, blob] of Object.entries(manifest.blobs)) {
    let sha: string = root
    const parts = path.split('/')
    for (const [index, name] of parts.entries()) {
      const encoded = proof.trees[sha]
      assert.ok(encoded, `Pinned membership cannot be verified: missing tree ${sha} for ${path}`)
      const bytes = Buffer.from(encoded, 'base64')
      assert.equal(objectHash('tree', bytes), sha, `Pinned tree proof hash mismatch: ${path}`)
      const entries: { mode: string, name: string, sha: string }[] = []
      for (let offset = 0; offset < bytes.length;) {
        const end = bytes.indexOf(0, offset)
        assert.ok(end > offset && end + 21 <= bytes.length, `Malformed Git tree proof: ${path}`)
        const header = bytes.subarray(offset, end).toString('utf8')
        const space = header.indexOf(' ')
        entries.push({ mode: header.slice(0, space), name: header.slice(space + 1), sha: bytes.subarray(end + 1, end + 21).toString('hex') })
        offset = end + 21
      }
      const matches = entries.filter(entry => entry.name === name)
      assert.equal(matches.length, 1, `Pinned membership path missing/ambiguous: ${path}`)
      const entry = matches[0]!
      assert.equal(entry.mode, index === parts.length - 1 ? '100644' : '40000', `Pinned membership mode mismatch: ${path}`)
      sha = entry.sha
    }
    assert.equal(sha, blob, `Pinned commit-to-blob membership mismatch: ${path}`)
  }
}

/** Prove fixture blob membership in the pinned commit without requiring/changing donor HEAD. */
export function verifyPinnedGitTree(donor: string): void {
  readPinnedSources()
  const git = (...args: string[]) => execFileSync('git', ['-C', resolve(donor), ...args], { encoding: 'utf8' }).trim()
  assert.match(git('remote', 'get-url', 'origin'), /github\.com[:/]jm-sky\/seedvale(?:\.git)?$/)
  assert.equal(git('rev-parse', `${provenance.sourceRevision}^{commit}`), provenance.sourceRevision)
  for (const [path, blob] of Object.entries(manifest.blobs)) {
    assert.equal(git('rev-parse', `${provenance.sourceRevision}:${path}`), blob, `Pinned Git-tree membership mismatch: ${path}`)
  }
  console.log(`PASS: all five fixture blobs belong to Git commit ${provenance.sourceRevision}; donor HEAD unchanged.`)
}

/** Fixtures are original constructor sources, never generated from the imported catalogue. */
export function readPinnedSources(donor?: string): Readonly<Record<string, string>> {
  assert.equal(manifest.repository, provenance.repository)
  assert.equal(manifest.sourceRevision, provenance.sourceRevision)
  assert.deepStrictEqual(Object.keys(manifest.blobs), [...Object.values(provenance.sourcePaths), 'src/game/data/character/types.ts'])
  verifyPinnedTreeProof()
  const sources: Record<string, string> = {}
  for (const [path, blob] of Object.entries(manifest.blobs)) {
    const bytes = readFileSync(resolve(fixtureRoot, `${path}.txt`))
    const actual = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
    assert.equal(actual, blob, `Pinned source blob drift: ${path}`)
    sources[path] = bytes.toString('utf8')
  }
  if (donor !== undefined) {
    const donorRoot = resolve(donor)
    const git = (...args: string[]) => execFileSync('git', ['-C', donorRoot, ...args], { encoding: 'utf8' }).trim()
    assert.equal(git('rev-parse', 'HEAD'), provenance.sourceRevision, 'Donor revision drift: review before changing provenance')
    assert.match(git('remote', 'get-url', 'origin'), /github\.com[:/]jm-sky\/seedvale(?:\.git)?$/)
    for (const [path, text] of Object.entries(sources)) {
      assert.equal(readFileSync(resolve(donorRoot, path), 'utf8'), text, `Working-tree source drift: ${path}`)
      assert.equal(git('rev-parse', `${provenance.sourceRevision}:${path}`), manifest.blobs[path], `Pinned Git blob drift: ${path}`)
      assert.equal(execFileSync('git', ['-C', donorRoot, 'show', `${provenance.reconRevision}:${path}`], { encoding: 'utf8' }), text, `Approved recon baseline drift: ${path}`)
    }
  }
  return sources
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
function verifyTypes(sources: Readonly<Record<string, string>>): void {
  const directory = mkdtempSync(resolve(tmpdir(), 'seedvale-equipment-contract-'))
  try {
    for (const [path, text] of Object.entries(sources)) {
      const destination = resolve(directory, path)
      mkdirSync(dirname(destination), { recursive: true })
      writeFileSync(destination, text)
    }
    const donorRoot = directory
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
}

// Only these two pure constructor files are evaluated in a bounded VM, with no require/import capability.
// Never evaluate catalog.ts: its barrel also initializes unrelated goods and derived lookups.
function readArray(sources: Readonly<Record<string, string>>, path: string, exportName: string): readonly V3EquipmentDefinition[] {
  const text = sources[path]!
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) assert.equal(statement.importClause?.isTypeOnly, true, `Runtime import in ${path}`)
  }
  const exports: Record<string, unknown> = {}
  const { outputText } = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  runInNewContext(outputText, { exports }, { filename: path, timeout: 1000 })
  const array = exports[exportName]
  assert.ok(Array.isArray(array), `Missing array ${exportName}`)
  // Rehome VM objects before strict comparison: preserve own keys/undefined and array order,
  // but not the VM's foreign Object/Array prototypes. No JSON round trip.
  const rehome = (value: unknown): unknown => {
    if (Array.isArray(value)) return Array.from(value, rehome)
    if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, rehome(child)]))
    return value
  }
  return rehome(array) as readonly V3EquipmentDefinition[]
}

/** Donor catalogue order with goods excluded: melee, ranged, shields, armor, ammo. */
export function resolvePinnedDefinitions(sources = readPinnedSources()): readonly V3EquipmentDefinition[] {
  return [
    ...readArray(sources, provenance.sourcePaths.weapons, 'MELEE_WEAPONS'),
    ...readArray(sources, provenance.sourcePaths.weapons, 'RANGED_WEAPONS'),
    ...readArray(sources, provenance.sourcePaths.weapons, 'SHIELDS'),
    ...readArray(sources, provenance.sourcePaths.armor, 'ARMOR'),
    ...readArray(sources, provenance.sourcePaths.weapons, 'AMMO'),
  ]
}

/** Independent reviewed expectation, read from the original mapping table (not the catalogue). */
export function readReviewedIds(mapping = readFileSync(new URL('../../docs/research/v1-revival/2026-10-27--equipment-id-mapping.md', import.meta.url), 'utf8')): readonly string[] {
  // Research Markdown follows the checkout's EOL convention; pinned source bytes do not.
  const section = mapping.split(/## All definitions\r?\n/)[1]
  assert.ok(section, 'Reviewed mapping is missing the All definitions section')
  const table = section.split(/\r?\n## /)[0]!
  const ids = Array.from(table.matchAll(/^\| `([^`]+)` \|/gm), match => match[1]!)
  assert.equal(ids.length, 87, 'Reviewed mapping must contain 87 rows')
  assert.equal(new Set(ids).size, 87, 'Reviewed mapping has duplicate IDs')
  return ids
}

function familyOf(definition: V3EquipmentDefinition): keyof Omit<typeof provenance.expectedCounts, 'total'> {
  switch (definition.category) {
    case 'ammo': return 'ammunition'
    case 'armor': return 'armor'
    case 'shield': return 'shields'
    case 'weapon': return definition.kind
  }
}

function verifyIdentity(definitions: readonly V3EquipmentDefinition[], reviewedIds: readonly string[], label: string): void {
  const ids = definitions.map(definition => definition.id)
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate canonical ID`)
  const missing = reviewedIds.filter(id => !ids.includes(id))
  const unexpected = ids.filter(id => !reviewedIds.includes(id))
  assert.deepStrictEqual(missing, [], `${label}: missing canonical IDs: ${missing.join(', ')}`)
  assert.deepStrictEqual(unexpected, [], `${label}: unexpected canonical IDs: ${unexpected.join(', ')}`)
  assert.equal(ids.length, provenance.expectedCounts.total, `${label}: total count drift`)
  assert.deepStrictEqual(ids, reviewedIds, `${label}: canonical ID ordering drift`)
  for (const [family, count] of Object.entries(provenance.expectedCounts)) {
    if (family !== 'total') assert.equal(definitions.filter(definition => familyOf(definition) === family).length, count, `${label}: family count drift: ${family}`)
  }
  const keys = new Set(definitions.flatMap(definition => Object.keys(definition)))
  assert.equal(keys.size, 41, `${label}: resolved property vocabulary drift`)
}

/** Explain failures with a canonical ID and field path, including absent vs own undefined keys. */
export function assertSourceEqual(actual: unknown, expected: unknown, path: string): void {
  if (expected !== null && typeof expected === 'object') {
    assert.ok(actual !== null && typeof actual === 'object', `${path}: expected object`)
    assert.equal(Array.isArray(actual), Array.isArray(expected), `${path}: array/object mismatch`)
    assert.deepStrictEqual(Reflect.ownKeys(actual), Reflect.ownKeys(expected), `${path}: own property keys/presence/order differ`)
    for (const key of Reflect.ownKeys(expected)) {
      assertSourceEqual(Reflect.get(actual, key), Reflect.get(expected, key), `${path}.${String(key)}`)
    }
  } else {
    assert.deepStrictEqual(actual, expected, `${path}: source value differs`)
  }
}

export function verifyDefinitions(
  actual: readonly V3EquipmentDefinition[],
  expected: readonly V3EquipmentDefinition[] = resolvePinnedDefinitions(),
): void {
  const reviewedIds = readReviewedIds()
  verifyIdentity(expected, reviewedIds, 'Pinned source')
  verifyIdentity(actual, reviewedIds, 'Imported catalogue')
  for (let index = 0; index < expected.length; index++) assertSourceEqual(actual[index], expected[index], expected[index]!.id)
}

export function verifySource(donor?: string): void {
  const sources = readPinnedSources(donor)
  verifyTypes(sources)
  verifyDefinitions(V3_EQUIPMENT_DEFINITIONS, resolvePinnedDefinitions(sources))
  console.log(`PASS: 87/87 unique canonical IDs in reviewed order; complete field-level equality, 41 keys including own undefined; counts 30/8/39/3/7. ${types.length} type/domain equalities and five typed exports. Source ${provenance.sourceRevision}; commit-to-blob proof verified; ${donor ? 'local donor and recon blobs verified' : 'checked-in pinned source blobs verified'}.`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === '--git-tree') {
    assert.ok(process.argv[3], '--git-tree requires an explicit donor repository path')
    verifySource()
    verifyPinnedGitTree(process.argv[3])
  } else verifySource(process.argv[2])
}
