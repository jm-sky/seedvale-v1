// Usage: pnpm worldgen:fixture:check — compares public/worldgen-fixtures/index.json with the namespace
// registry (plan tools-020). Not part of `pnpm test`: a namespace version bump must not fail unrelated commits.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { WorldgenFixtureIndex } from '../../src/persistence/worldgenFixture'
import { WORLDGEN_FIXTURE_NAMESPACES } from '../../src/persistence/worldgenFixtureNamespaces'

const dir = join(process.cwd(), 'public', 'worldgen-fixtures')
const indexPath = join(dir, 'index.json')
if (!existsSync(indexPath)) {
  console.log('no worldgen fixtures (public/worldgen-fixtures/index.json missing)')
  process.exit(0)
}
const index = JSON.parse(readFileSync(indexPath, 'utf8')) as WorldgenFixtureIndex
let stale = 0
for (const f of index.fixtures) {
  const problems: string[] = []
  if (!existsSync(join(dir, f.file))) problems.push('file missing')
  else if (statSync(join(dir, f.file)).size !== f.bytes) problems.push('size differs from index')
  if (f.bytes > 6 * 1024 * 1024) problems.push(`over 6 MB budget (${f.bytes} B)`)
  for (const [ns, v] of Object.entries(f.namespaces)) {
    const current = WORLDGEN_FIXTURE_NAMESPACES[ns]
    if (current === undefined) problems.push(`${ns}: not in registry`)
    else if (current !== v.version) problems.push(`${ns}: fixture v${v.version}, current v${current} (records dropped at import)`)
  }
  for (const ns of Object.keys(WORLDGEN_FIXTURE_NAMESPACES)) {
    if (!(ns in f.namespaces)) console.log(`  note ${f.id}: no ${ns} records captured`)
  }
  if (problems.length > 0) stale++
  console.log(`${problems.length > 0 ? 'STALE' : 'ok   '} ${f.id} v${f.fixtureVersion} ${(f.bytes / 1024).toFixed(0)} KiB ${f.records} records${problems.length > 0 ? ` — ${problems.join('; ')}` : ''}`)
}
if (stale > 0) {
  console.log(`${stale} stale fixture(s): regenerate with scripts/perf/export-worldgen-fixture.mjs or note it in docs/plans/LOOSE-ENDS.md`)
  process.exitCode = 1
}
