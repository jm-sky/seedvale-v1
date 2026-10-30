import type { CacheRecord } from './worldgenCacheDb'

/**
 * @domain persistence
 * @system worldgen-cache
 * @role Binary container for a worldgen cache boot fixture (plan tools-020):
 *  a JSON header plus one binary section, gzip-wrapped. Payload typed arrays
 *  are moved out of the JSON into the binary section (`{ $ta, offset, length }`
 *  references) because IndexedDB structured clone keeps them but JSON does not.
 * @integration Pure (no IndexedDB / fetch); `worldgenFixture.ts` owns import
 *  and export. Decoding never throws — corrupt input yields `null`.
 */

/** Container format version — bump only when the byte layout changes. */
export const WORLDGEN_FIXTURE_FORMAT = 1

const MAGIC = 'SVWC'

export type FixtureTypedArrayKind =
  | 'Float32Array' | 'Float64Array'
  | 'Int8Array' | 'Uint8Array' | 'Uint8ClampedArray'
  | 'Int16Array' | 'Uint16Array'
  | 'Int32Array' | 'Uint32Array'

const TYPED_ARRAYS: Record<FixtureTypedArrayKind, { new (buffer: ArrayBuffer): ArrayBufferView & { length: number }, BYTES_PER_ELEMENT: number }> = {
  Float32Array, Float64Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array,
}

export type WorldgenFixtureHeader = {
  format: number
  /** Fixture content version, bumped by the exporter on regeneration. */
  fixtureVersion: number
  seed: number
  profile: string
  gitSha: string
  createdAt: string
}

export type WorldgenFixtureContents = {
  header: WorldgenFixtureHeader
  records: CacheRecord[]
}

type TypedArrayRef = { $ta: FixtureTypedArrayKind, offset: number, length: number }
type NumberRef = { $num: 'NaN' | 'Infinity' | '-Infinity' }

function typedArrayKind(value: unknown): FixtureTypedArrayKind | null {
  if (!ArrayBuffer.isView(value) || value instanceof DataView) return null
  const name = (value as { constructor: { name: string } }).constructor.name
  return name in TYPED_ARRAYS ? name as FixtureTypedArrayKind : null
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** Replaces typed arrays / non-finite numbers by references; throws on any
 *  value the fixture cannot round-trip (the exporter must fail loudly rather
 *  than ship a lossy record). */
function encodeValue(value: unknown, chunks: Uint8Array[], cursor: { bytes: number }): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return value
    return { $num: Number.isNaN(value) ? 'NaN' : value > 0 ? 'Infinity' : '-Infinity' } satisfies NumberRef
  }
  const kind = typedArrayKind(value)
  if (kind) {
    const view = value as ArrayBufferView & { length: number }
    // Align each array to 8 bytes so decode may view the section directly.
    const pad = (8 - (cursor.bytes % 8)) % 8
    if (pad > 0) { chunks.push(new Uint8Array(pad)); cursor.bytes += pad }
    const offset = cursor.bytes
    chunks.push(new Uint8Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength)))
    cursor.bytes += view.byteLength
    return { $ta: kind, offset, length: view.length } satisfies TypedArrayRef
  }
  if (Array.isArray(value)) return value.map((v) => encodeValue(v, chunks, cursor))
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === '$ta' || k === '$num') throw new Error(`worldgen fixture: reserved key "${k}" in payload`)
      if (v === undefined) continue
      out[k] = encodeValue(v, chunks, cursor)
    }
    return out
  }
  throw new Error(`worldgen fixture: unsupported payload value (${typeof value})`)
}

function decodeValue(value: unknown, section: Uint8Array): unknown {
  if (Array.isArray(value)) return value.map((v) => decodeValue(v, section))
  if (value === null || typeof value !== 'object') return value
  const obj = value as Record<string, unknown>
  if (typeof obj.$ta === 'string') {
    const ctor = TYPED_ARRAYS[obj.$ta as FixtureTypedArrayKind]
    const { offset, length } = obj as unknown as TypedArrayRef
    if (!ctor || !Number.isInteger(offset) || !Number.isInteger(length) || offset < 0 || length < 0) throw new Error('bad typed array ref')
    const byteLength = length * ctor.BYTES_PER_ELEMENT
    if (offset + byteLength > section.byteLength) throw new Error('typed array ref out of range')
    // Copy: the section may be a view into a larger, unaligned buffer.
    return new ctor(section.slice(offset, offset + byteLength).buffer)
  }
  if (typeof obj.$num === 'string') {
    if (obj.$num === 'NaN') return Number.NaN
    if (obj.$num === 'Infinity') return Number.POSITIVE_INFINITY
    if (obj.$num === '-Infinity') return Number.NEGATIVE_INFINITY
    throw new Error('bad number ref')
  }
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) out[k] = decodeValue(v, section)
  return out
}

/** Encodes to the uncompressed container: `SVWC` | u32 header length | JSON
 *  header (contains the records) | 8-aligned binary section. */
export function encodeWorldgenFixture(contents: WorldgenFixtureContents): Uint8Array {
  const chunks: Uint8Array[] = []
  const cursor = { bytes: 0 }
  const records = contents.records.map((r) => ({
    key: r.key,
    seed: r.seed,
    namespace: r.namespace,
    version: r.version,
    fingerprint: r.fingerprint,
    payload: encodeValue(r.payload, chunks, cursor),
  }))
  const json = new TextEncoder().encode(JSON.stringify({ ...contents.header, records }))
  // Header block padded to 8 so the binary section starts aligned.
  const headerBlock = 8 + json.byteLength
  const headerPad = (8 - (headerBlock % 8)) % 8
  const out = new Uint8Array(headerBlock + headerPad + cursor.bytes)
  const view = new DataView(out.buffer)
  out.set(new TextEncoder().encode(MAGIC), 0)
  view.setUint32(4, json.byteLength + headerPad, true)
  out.set(json, 8)
  out.fill(0x20, 8 + json.byteLength, headerBlock + headerPad) // JSON-ignorable spaces
  let at = headerBlock + headerPad
  for (const chunk of chunks) { out.set(chunk, at); at += chunk.byteLength }
  return out
}

/** Decodes the uncompressed container; `null` on any corruption or format
 *  mismatch. `lastAccessedAt` is stamped by the importer, not stored. */
export function decodeWorldgenFixture(bytes: Uint8Array): WorldgenFixtureContents | null {
  try {
    if (bytes.byteLength < 8 || new TextDecoder().decode(bytes.subarray(0, 4)) !== MAGIC) return null
    const jsonLength = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(4, true)
    if (8 + jsonLength > bytes.byteLength) return null
    const parsed = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + jsonLength))) as Record<string, unknown>
    if (parsed.format !== WORLDGEN_FIXTURE_FORMAT || !Array.isArray(parsed.records)) return null
    const section = bytes.subarray(8 + jsonLength)
    const records: CacheRecord[] = (parsed.records as Record<string, unknown>[]).map((r) => {
      if (typeof r.key !== 'string' || typeof r.seed !== 'number' || typeof r.namespace !== 'string'
        || typeof r.version !== 'number' || typeof r.fingerprint !== 'string') throw new Error('bad record')
      return {
        key: r.key,
        seed: r.seed,
        namespace: r.namespace,
        version: r.version,
        fingerprint: r.fingerprint,
        payload: decodeValue(r.payload, section),
        lastAccessedAt: 0,
      }
    })
    const header: WorldgenFixtureHeader = {
      format: parsed.format,
      fixtureVersion: Number(parsed.fixtureVersion),
      seed: Number(parsed.seed),
      profile: String(parsed.profile),
      gitSha: String(parsed.gitSha),
      createdAt: String(parsed.createdAt),
    }
    return { header, records }
  } catch {
    return null
  }
}

async function pipeThrough(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const writer = stream.writable.getWriter()
  void writer.write(bytes as BufferSource).then(() => writer.close()).catch(() => undefined)
  return new Uint8Array(await new Response(stream.readable).arrayBuffer())
}

export function gzipBytes(bytes: Uint8Array): Promise<Uint8Array> {
  return pipeThrough(bytes, new CompressionStream('gzip'))
}

/** `null` when the input is not valid gzip. */
export async function gunzipBytes(bytes: Uint8Array): Promise<Uint8Array | null> {
  try {
    return await pipeThrough(bytes, new DecompressionStream('gzip'))
  } catch {
    return null
  }
}
