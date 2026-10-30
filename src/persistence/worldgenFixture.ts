import { cacheKey, type CacheRecord, deleteCacheRecords, getCacheRecord, listAllCacheRecords, putCacheRecords } from './worldgenCacheDb'
import {
  decodeWorldgenFixture,
  encodeWorldgenFixture,
  gunzipBytes,
  gzipBytes,
  WORLDGEN_FIXTURE_FORMAT,
} from './worldgenFixtureCodec'
import { WORLDGEN_FIXTURE_NAMESPACES } from './worldgenFixtureNamespaces'

/**
 * @domain persistence
 * @system worldgen-cache
 * @role Boot-time import (and dev export) of a versioned worldgen cache
 *  fixture (plan tools-020): the benchmark seed and the reference seed ship
 *  their small worldgen cache namespaces in `public/worldgen-fixtures/`, so a
 *  fresh browser profile does not regenerate caves, settlement definitions and
 *  road routes during the loading phase.
 * @integration Runs before `createWorldBundle()` so every namespace owner's
 *  hydrate sees the records. Fingerprints are never checked or rewritten here —
 *  owners already treat a mismatch as a miss, so a stale fixture costs loading
 *  time, never correctness. Any failure resolves quietly and the world boots cold.
 */

export type WorldgenFixtureProfile = 'benchmark' | 'default'

export type WorldgenFixtureIndexEntry = {
  id: string
  file: string
  seed: number
  profile: WorldgenFixtureProfile
  fixtureVersion: number
  /** sha256 (hex) of the compressed file — also the import marker identity. */
  hash: string
  bytes: number
  records: number
  namespaces: Record<string, { version: number, records: number }>
}

export type WorldgenFixtureIndex = { format: number, fixtures: WorldgenFixtureIndexEntry[] }

export type WorldgenFixtureStats = {
  id: string | null
  imported: boolean
  skipped: string | null
  records: number
}

const FIXTURE_DIR = `${import.meta.env?.BASE_URL ?? '/'}worldgen-fixtures/`
const MARKER_NAMESPACE = 'worldgen-fixture'
const MARKER_VERSION = 1

let lastStats: WorldgenFixtureStats = { id: null, imported: false, skipped: 'not-run', records: 0 }

/** Snapshot for `meta.worldgenFixture` in benchmark artifacts. */
export function getWorldgenFixtureStats(): WorldgenFixtureStats {
  return { ...lastStats }
}

/** `?worldgenFixture=0` disables the import (importer A/B, stale-fixture debugging). */
export function isWorldgenFixtureEnabled(search: string = typeof location === 'undefined' ? '' : location.search): boolean {
  const raw = new URLSearchParams(search).get('worldgenFixture')
  if (raw === null) return true
  const v = raw.trim().toLowerCase()
  return v !== '0' && v !== 'false' && v !== 'no' && v !== 'off'
}

function markerKey(seed: number, hash: string): string {
  return cacheKey(seed, MARKER_NAMESPACE, MARKER_VERSION, hash)
}

function finish(stats: WorldgenFixtureStats): WorldgenFixtureStats {
  lastStats = stats
  return stats
}

/** Keeps only records of a registry namespace at its current version and for
 *  `seed` — stale-version records would never be evicted by `enforceCacheCap()`. */
export function filterFixtureRecords(records: readonly CacheRecord[], seed: number): CacheRecord[] {
  return records.filter((r) => r.seed === seed && WORLDGEN_FIXTURE_NAMESPACES[r.namespace] === r.version)
}

async function fetchBytes(url: string): Promise<Uint8Array | null> {
  const res = await fetch(url)
  if (!res.ok) return null
  return new Uint8Array(await res.arrayBuffer())
}

/**
 * Imports the fixture for `(seed, profile)` into the worldgen cache store.
 * Never throws; the result is also kept for {@link getWorldgenFixtureStats}.
 */
export async function importWorldgenFixture(seed: number, profile: WorldgenFixtureProfile): Promise<WorldgenFixtureStats> {
  if (!isWorldgenFixtureEnabled()) return finish({ id: null, imported: false, skipped: 'disabled', records: 0 })
  try {
    const indexRes = await fetch(`${FIXTURE_DIR}index.json`)
    if (!indexRes.ok) return finish({ id: null, imported: false, skipped: 'no-index', records: 0 })
    const index = await indexRes.json() as WorldgenFixtureIndex
    const entry = index.format === WORLDGEN_FIXTURE_FORMAT
      ? index.fixtures.find((f) => f.seed === seed && f.profile === profile)
      : undefined
    if (!entry) return finish({ id: null, imported: false, skipped: 'no-fixture', records: 0 })

    if (await getCacheRecord(seed, MARKER_NAMESPACE, MARKER_VERSION, entry.hash)) {
      return finish({ id: entry.id, imported: false, skipped: 'already-imported', records: 0 })
    }

    const compressed = await fetchBytes(`${FIXTURE_DIR}${entry.file}`)
    const bytes = compressed ? await gunzipBytes(compressed) : null
    const contents = bytes ? decodeWorldgenFixture(bytes) : null
    if (!contents || contents.header.seed !== seed) return finish({ id: entry.id, imported: false, skipped: 'unreadable', records: 0 })

    const now = Date.now()
    const records = filterFixtureRecords(contents.records, seed).map((r) => ({ ...r, lastAccessedAt: now }))
    const marker: CacheRecord = {
      key: markerKey(seed, entry.hash),
      seed,
      namespace: MARKER_NAMESPACE,
      version: MARKER_VERSION,
      fingerprint: '',
      payload: null,
      lastAccessedAt: now,
    }
    // Marker last in the same batch: a partial write cannot mark a half import.
    await putCacheRecords([...records, marker])
    return finish({ id: entry.id, imported: true, skipped: null, records: records.length })
  } catch (err) {
    console.warn('[worldgen-fixture] import failed, booting cold', err)
    return finish({ id: null, imported: false, skipped: 'error', records: 0 })
  }
}

function toBase64(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i += 0x8000) out += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(out)
}

export type WorldgenFixtureExport = {
  /** base64 of the gzip-compressed container. */
  gzipBase64: string
  records: number
  namespaces: Record<string, { version: number, records: number }>
  bytes: number
}

/**
 * Dev/exporter only (`scripts/perf/export-worldgen-fixture.mjs`): serializes the
 * fixture-eligible records currently in the cache for `seed`. The import marker
 * and any namespace outside the registry are excluded; unsupported payload
 * values make the encoder throw rather than ship a lossy record.
 */
export async function exportWorldgenFixture(
  seed: number,
  profile: WorldgenFixtureProfile,
  meta: { fixtureVersion: number, gitSha: string },
): Promise<WorldgenFixtureExport> {
  const records = filterFixtureRecords(await listAllCacheRecords(seed), seed)
  const namespaces: WorldgenFixtureExport['namespaces'] = {}
  for (const r of records) {
    const ns = namespaces[r.namespace] ?? { version: r.version, records: 0 }
    ns.records++
    namespaces[r.namespace] = ns
  }
  const encoded = encodeWorldgenFixture({
    header: {
      format: WORLDGEN_FIXTURE_FORMAT,
      fixtureVersion: meta.fixtureVersion,
      seed,
      profile,
      gitSha: meta.gitSha,
      createdAt: new Date().toISOString(),
    },
    records,
  })
  const gz = await gzipBytes(encoded)
  return { gzipBase64: toBase64(gz), records: records.length, namespaces, bytes: gz.byteLength }
}

/** Dev helper: forget the import marker so the next boot re-imports. */
export async function clearWorldgenFixtureMarker(seed: number, hash: string): Promise<void> {
  await deleteCacheRecords([markerKey(seed, hash)])
}
