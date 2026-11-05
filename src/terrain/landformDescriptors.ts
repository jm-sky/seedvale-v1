/**
 * Landform descriptor framework (plan world-terrain-060, slice R0).
 *
 * Pure, seed-derived records for macro relief features (range spines, passes, crags, spine summits, lake islands, craters).
 * R0 ships only the framework: the types, the 512 m bucket index and the sampler hook. `landformDescriptorsFor` returns
 * **no descriptors** yet, so every sampled height stays bit-identical to the pre-R0 field. R1/R3 add the generators.
 *
 * Acyclicity: descriptors may read the seed and the descriptor-free base relief only — never hydrology, climate,
 * settlements or roads.
 *
 * Cost bounds (review 031 F7), enforced by `buildLandformIndex`:
 * - a descriptor footprint radius is at most `LANDFORM_MAX_RADIUS_M` (= one bucket), so a point query only has to
 *   visit its own bucket plus the 8 neighbours (3 × 3), and
 * - at most `LANDFORM_MAX_PER_BUCKET` descriptors may overlap one bucket, so the per-sample descriptor work is bounded
 *   by `9 × LANDFORM_MAX_PER_BUCKET` footprint tests.
 *
 * @domain world-terrain
 */

/** P1 landform kinds (plan 060 §Design 3). */
export type LandformKind = 'crag' | 'spineSummit' | 'lakeIsland' | 'crater'

export type LandformDescriptor = {
  /** Stable id `lf:<kind>:<cellKey>` from the winning candidate cell — never a list ordinal. */
  id: string
  kind: LandformKind
  centreX: number
  centreZ: number
  /** Footprint radius in metres, `0 < radius <= LANDFORM_MAX_RADIUS_M`. */
  radius: number
  /** Kind-specific shape parameters (metre-scale amplitudes, rim width, …). */
  params: Readonly<Record<string, number>>
  /** What the landform is meant to produce; the census lists it, hydrology decides actual water. */
  intendedOutcome: string
}

export const LANDFORM_BUCKET_SIZE_M = 512
/** Largest footprint radius; equals one bucket so a 3 × 3 bucket query always covers every footprint. */
export const LANDFORM_MAX_RADIUS_M = LANDFORM_BUCKET_SIZE_M
/** Upper bound of descriptors whose footprint overlaps one bucket. */
export const LANDFORM_MAX_PER_BUCKET = 4

export type LandformIndex = {
  readonly count: number
  /** Descriptors whose footprint may contain `(x, z)` (candidates — the caller tests the exact footprint). */
  near: (x: number, z: number) => readonly LandformDescriptor[]
}

const EMPTY: readonly LandformDescriptor[] = Object.freeze([])

/** The shared index of a world with no descriptors; `near` allocates nothing. */
export const EMPTY_LANDFORM_INDEX: LandformIndex = { count: 0, near: () => EMPTY }

const bucketKey = (bx: number, bz: number): string => `${bx},${bz}`

/**
 * Builds the bucket index. A descriptor is registered in every bucket its footprint's bounding box touches, so `near`
 * is a single map lookup. Throws on a footprint above the radius bound or a bucket above the overlap bound — both are
 * generator bugs, not runtime conditions.
 */
export function buildLandformIndex(descriptors: readonly LandformDescriptor[]): LandformIndex {
  if (descriptors.length === 0) return EMPTY_LANDFORM_INDEX
  const buckets = new Map<string, LandformDescriptor[]>()
  for (const d of descriptors) {
    if (!(d.radius > 0 && d.radius <= LANDFORM_MAX_RADIUS_M)) {
      throw new Error(`landform ${d.id}: radius ${d.radius} outside (0, ${LANDFORM_MAX_RADIUS_M}]`)
    }
    const bx0 = Math.floor((d.centreX - d.radius) / LANDFORM_BUCKET_SIZE_M)
    const bx1 = Math.floor((d.centreX + d.radius) / LANDFORM_BUCKET_SIZE_M)
    const bz0 = Math.floor((d.centreZ - d.radius) / LANDFORM_BUCKET_SIZE_M)
    const bz1 = Math.floor((d.centreZ + d.radius) / LANDFORM_BUCKET_SIZE_M)
    for (let bz = bz0; bz <= bz1; bz++) {
      for (let bx = bx0; bx <= bx1; bx++) {
        const key = bucketKey(bx, bz)
        const list = buckets.get(key) ?? []
        list.push(d)
        if (list.length > LANDFORM_MAX_PER_BUCKET) {
          throw new Error(`landform bucket ${key}: more than ${LANDFORM_MAX_PER_BUCKET} overlapping descriptors`)
        }
        buckets.set(key, list)
      }
    }
  }
  return {
    count: descriptors.length,
    near: (x, z) => buckets.get(bucketKey(Math.floor(x / LANDFORM_BUCKET_SIZE_M), Math.floor(z / LANDFORM_BUCKET_SIZE_M))) ?? EMPTY,
  }
}

/**
 * Derives the landform descriptors of a world from its seed. R0: always empty (framework only); R1/R3 fill it.
 * Pure and deterministic — same seed, same list, in a stable id order.
 */
export function landformDescriptorsFor(_seed: number): readonly LandformDescriptor[] {
  return EMPTY
}

const indexCache = new Map<number, LandformIndex>()

/** Per-seed index, built once and reused by every realm sample (same lifetime as the noise handles). */
export function landformIndexFor(seed: number): LandformIndex {
  let index = indexCache.get(seed)
  if (!index) {
    index = buildLandformIndex(landformDescriptorsFor(seed))
    indexCache.set(seed, index)
  }
  return index
}

/**
 * Metre-scale height contribution of the landforms at `(x, z)`, added on top of the base floor. R0: no kind shapes
 * relief yet, so this is exactly 0 and the sampler skips it entirely while the index is empty.
 */
export function landformHeightDeltaAt(index: LandformIndex, x: number, z: number): number {
  if (index.count === 0) return 0
  const delta = 0
  for (const d of index.near(x, z)) {
    const dx = x - d.centreX
    const dz = z - d.centreZ
    if (dx * dx + dz * dz > d.radius * d.radius) continue
    // Kind profiles arrive with R1 (spineSummit) / R3 (crag, lakeIsland, crater).
  }
  return delta
}
