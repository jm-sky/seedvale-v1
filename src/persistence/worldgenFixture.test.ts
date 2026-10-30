import { IDBFactory } from 'fake-indexeddb'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ROAD_ROUTE_CACHE_NAMESPACE, ROAD_ROUTE_CACHE_VERSION } from '../settlement/roadRouteWorldgenCache'
import {
  SETTLEMENT_DEFINITION_CACHE_NAMESPACE,
  SETTLEMENT_DEFINITION_CACHE_VERSION,
} from '../settlement/settlementWorldgenCache'
import { CAVES_V2_NAMESPACE, CAVES_V2_VERSION } from '../world/caves/caveWorldgenCache'
import { ABANDONED_CEMETERY_NAMESPACE, ABANDONED_CEMETERY_VERSION } from '../world/locations/abandonedCemeteryCache'
import { LOCATIONS_COARSE_NAMESPACE, LOCATIONS_COARSE_VERSION } from '../world/locations/locationsCoarseCache'
import { cacheKey, type CacheRecord, countCacheForSeed, deleteCacheForSeed, getCacheRecord, listCacheRecords } from './worldgenCacheDb'
import {
  exportWorldgenFixture,
  filterFixtureRecords,
  getWorldgenFixtureStats,
  importWorldgenFixture,
  isWorldgenFixtureEnabled,
  type WorldgenFixtureIndex,
} from './worldgenFixture'
import {
  decodeWorldgenFixture,
  encodeWorldgenFixture,
  gunzipBytes,
  gzipBytes,
  WORLDGEN_FIXTURE_FORMAT,
} from './worldgenFixtureCodec'
import { WORLDGEN_FIXTURE_NAMESPACES } from './worldgenFixtureNamespaces'

const header = { format: WORLDGEN_FIXTURE_FORMAT, fixtureVersion: 1, seed: 7, profile: 'benchmark', gitSha: 'abc', createdAt: '2026-10-30T00:00:00Z' }

function rec(seed: number, namespace: string, version: number, sub: string, payload: unknown, fingerprint = 'fp'): CacheRecord {
  return { key: cacheKey(seed, namespace, version, sub), seed, namespace, version, fingerprint, payload, lastAccessedAt: 0 }
}

describe('worldgenFixtureCodec', () => {
  it('round-trips plain payloads and every typed-array kind', () => {
    const payload = {
      f32: new Float32Array([1.5, -2.25, 0]),
      f64: new Float64Array([Math.PI]),
      u8: new Uint8Array([1, 2, 3]),
      i16: new Int16Array([-5, 7]),
      u32: new Uint32Array([4294967295]),
      nested: [{ h: new Float32Array(0), n: null, s: 'x', b: true }],
      weird: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    }
    const bytes = encodeWorldgenFixture({ header, records: [rec(7, 'ns', 1, 'a', payload), rec(7, 'ns', 1, 'b', null)] })
    const out = decodeWorldgenFixture(bytes)
    expect(out).not.toBeNull()
    expect(out!.header.seed).toBe(7)
    expect(out!.records).toHaveLength(2)
    const p = out!.records[0].payload as typeof payload
    expect(p.f32).toBeInstanceOf(Float32Array)
    expect(Array.from(p.f32)).toEqual([1.5, -2.25, 0])
    expect(Array.from(p.f64)).toEqual([Math.PI])
    expect(p.u8).toBeInstanceOf(Uint8Array)
    expect(Array.from(p.i16)).toEqual([-5, 7])
    expect(Array.from(p.u32)).toEqual([4294967295])
    expect(p.nested[0].h).toHaveLength(0)
    expect(p.nested[0]).toMatchObject({ n: null, s: 'x', b: true })
    expect(Number.isNaN(p.weird[0])).toBe(true)
    expect(p.weird.slice(1)).toEqual([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])
    expect(out!.records[1].payload).toBeNull()
  })

  it('handles an empty binary section and an empty record list', () => {
    const out = decodeWorldgenFixture(encodeWorldgenFixture({ header, records: [rec(7, 'ns', 1, 'a', { x: 1 })] }))
    expect(out!.records[0].payload).toEqual({ x: 1 })
    expect(decodeWorldgenFixture(encodeWorldgenFixture({ header, records: [] }))!.records).toEqual([])
  })

  it('rejects corrupted, truncated and foreign input with null', () => {
    const bytes = encodeWorldgenFixture({ header, records: [rec(7, 'ns', 1, 'a', { t: new Float32Array(8) })] })
    expect(decodeWorldgenFixture(bytes.subarray(0, 6))).toBeNull()
    expect(decodeWorldgenFixture(bytes.subarray(0, bytes.length - 8))).toBeNull() // typed array ref out of range
    expect(decodeWorldgenFixture(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))).toBeNull()
    const wrongFormat = encodeWorldgenFixture({ header: { ...header, format: 99 }, records: [] })
    expect(decodeWorldgenFixture(wrongFormat)).toBeNull()
  })

  it('refuses payloads it cannot round-trip', () => {
    expect(() => encodeWorldgenFixture({ header, records: [rec(7, 'ns', 1, 'a', new Map())] })).toThrow()
    expect(() => encodeWorldgenFixture({ header, records: [rec(7, 'ns', 1, 'a', { $ta: 'x' })] })).toThrow()
  })

  it('gzip round-trips and gunzip returns null for non-gzip', async () => {
    const raw = new Uint8Array(1000).map((_, i) => i % 7)
    const gz = await gzipBytes(raw)
    expect(gz.byteLength).toBeLessThan(raw.byteLength)
    expect(Array.from((await gunzipBytes(gz))!)).toEqual(Array.from(raw))
    expect(await gunzipBytes(new Uint8Array([1, 2, 3, 4]))).toBeNull()
  })
})

describe('worldgen fixture registry', () => {
  it('mirrors every owner constant', () => {
    expect(WORLDGEN_FIXTURE_NAMESPACES).toEqual({
      [CAVES_V2_NAMESPACE]: CAVES_V2_VERSION,
      [SETTLEMENT_DEFINITION_CACHE_NAMESPACE]: SETTLEMENT_DEFINITION_CACHE_VERSION,
      [ROAD_ROUTE_CACHE_NAMESPACE]: ROAD_ROUTE_CACHE_VERSION,
      [LOCATIONS_COARSE_NAMESPACE]: LOCATIONS_COARSE_VERSION,
      [ABANDONED_CEMETERY_NAMESPACE]: ABANDONED_CEMETERY_VERSION,
    })
    expect(WORLDGEN_FIXTURE_NAMESPACES).not.toHaveProperty('chunk-tiles')
  })
})

describe('importWorldgenFixture', () => {
  const SEED = 7
  const roadsV = ROAD_ROUTE_CACHE_VERSION

  async function mountFixture(records: CacheRecord[], overrides: Partial<{ hash: string, seed: number, corrupt: boolean }> = {}): Promise<void> {
    const seed = overrides.seed ?? SEED
    const encoded = encodeWorldgenFixture({ header: { ...header, seed }, records })
    const gz = overrides.corrupt ? new Uint8Array([9, 9, 9]) : await gzipBytes(encoded)
    const index: WorldgenFixtureIndex = {
      format: WORLDGEN_FIXTURE_FORMAT,
      fixtures: [{
        id: `${seed}-benchmark`, file: `${seed}-benchmark.svwc`, seed, profile: 'benchmark', fixtureVersion: 1,
        hash: overrides.hash ?? 'h1', bytes: gz.byteLength, records: records.length, namespaces: {},
      }],
    }
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('index.json')) return new Response(JSON.stringify(index))
      if (url.endsWith('.svwc')) return new Response(gz as BufferSource)
      return new Response('', { status: 404 })
    }))
  }

  beforeEach(() => {
    vi.stubGlobal('indexedDB', new IDBFactory())
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('drops stale-version and unknown-namespace records, keeps current ones with their fingerprint', async () => {
    await mountFixture([
      rec(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV, 'r1', { route: 1 }, 'fpA'),
      rec(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV + 1, 'r-stale', { route: 2 }),
      rec(SEED, 'chunk-tiles', 5, 't', { tile: 1 }),
      rec(SEED + 1, ROAD_ROUTE_CACHE_NAMESPACE, roadsV, 'other-seed', null),
    ])
    const stats = await importWorldgenFixture(SEED, 'benchmark')
    expect(stats).toMatchObject({ id: '7-benchmark', imported: true, skipped: null, records: 1 })
    const rows = await listCacheRecords(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV)
    expect(rows).toHaveLength(1)
    expect(rows[0].fingerprint).toBe('fpA')
    expect(rows[0].lastAccessedAt).toBeGreaterThan(0)
    expect(await listCacheRecords(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV + 1)).toHaveLength(0)
    expect(await listCacheRecords(SEED, 'chunk-tiles', 5)).toHaveLength(0)
    expect(getWorldgenFixtureStats().imported).toBe(true)
  })

  it('skips on the marker and re-imports after deleteCacheForSeed', async () => {
    await mountFixture([rec(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV, 'r1', 1)])
    expect((await importWorldgenFixture(SEED, 'benchmark')).imported).toBe(true)
    expect(await getCacheRecord(SEED, 'worldgen-fixture', 1, 'h1')).not.toBeNull()
    expect(await importWorldgenFixture(SEED, 'benchmark')).toMatchObject({ imported: false, skipped: 'already-imported' })
    await deleteCacheForSeed(SEED)
    expect(await countCacheForSeed(SEED)).toBe(0)
    expect((await importWorldgenFixture(SEED, 'benchmark')).imported).toBe(true)
  })

  it('resolves without throwing on missing fixture, bad payload, fetch failure and the disable flag', async () => {
    await mountFixture([], { seed: 99 })
    expect(await importWorldgenFixture(SEED, 'benchmark')).toMatchObject({ imported: false, skipped: 'no-fixture' })
    await mountFixture([rec(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV, 'r1', 1)], { corrupt: true })
    expect(await importWorldgenFixture(SEED, 'benchmark')).toMatchObject({ imported: false, skipped: 'unreadable' })
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    expect(await importWorldgenFixture(SEED, 'benchmark')).toMatchObject({ imported: false, skipped: 'error' })
    expect(isWorldgenFixtureEnabled('?worldgenFixture=0')).toBe(false)
    expect(isWorldgenFixtureEnabled('?seed=1')).toBe(true)
    vi.stubGlobal('location', { search: '?worldgenFixture=0' })
    expect(await importWorldgenFixture(SEED, 'benchmark')).toMatchObject({ imported: false, skipped: 'disabled' })
  })

  it('exports only registry namespaces at current versions, excluding the marker', async () => {
    await mountFixture([rec(SEED, ROAD_ROUTE_CACHE_NAMESPACE, roadsV, 'r1', { a: new Float32Array([1]) })])
    await importWorldgenFixture(SEED, 'benchmark')
    const exp = await exportWorldgenFixture(SEED, 'benchmark', { fixtureVersion: 2, gitSha: 'sha' })
    expect(exp.records).toBe(1)
    expect(exp.namespaces).toEqual({ [ROAD_ROUTE_CACHE_NAMESPACE]: { version: roadsV, records: 1 } })
    const bytes = Uint8Array.from(atob(exp.gzipBase64), (c) => c.charCodeAt(0))
    const decoded = decodeWorldgenFixture((await gunzipBytes(bytes))!)
    expect(decoded!.header).toMatchObject({ seed: SEED, profile: 'benchmark', fixtureVersion: 2, gitSha: 'sha' })
    expect(filterFixtureRecords(decoded!.records, SEED)).toHaveLength(1)
  })
})
