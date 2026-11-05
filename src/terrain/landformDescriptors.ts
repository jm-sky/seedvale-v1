/**
 * Landform descriptor framework (plan world-terrain-060, slice R0).
 *
 * Pure, seed-derived records for macro relief features (range spines, passes, crags, spine summits, lake islands, craters).
 * R0: types, the 512 m bucket index and the sampler hook (zero descriptors → bit-identical). R3: `generateLandforms`
 * (crag, crater, lakeIsland) + their height profiles; range spines/summits live in `rangeSpines.ts` (R1–R2).
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

import { createSeededRandom } from '../world/parseSeed'

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
  /** Every descriptor (stable id order) — census / debug only, not for per-sample use. */
  readonly all: readonly LandformDescriptor[]
  /** Descriptors whose footprint may contain `(x, z)` (candidates — the caller tests the exact footprint). */
  near: (x: number, z: number) => readonly LandformDescriptor[]
}

const EMPTY: readonly LandformDescriptor[] = Object.freeze([])

/** The shared index of a world with no descriptors; `near` allocates nothing. */
export const EMPTY_LANDFORM_INDEX: LandformIndex = { count: 0, all: EMPTY, near: () => EMPTY }

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
    all: descriptors,
    near: (x, z) => buckets.get(bucketKey(Math.floor(x / LANDFORM_BUCKET_SIZE_M), Math.floor(z / LANDFORM_BUCKET_SIZE_M))) ?? EMPTY,
  }
}

const landformIndexByKey = new Map<string, LandformIndex>()

/** What the generator may read: the descriptor-free base relief only (acyclic — no hydrology, climate, settlements). */
export type LandformGenContext = {
  /** Descriptor-free floor height (m) at a world point, before hydrology. */
  floorH: (x: number, z: number) => number
  waterLevel: number
  /** Half extent of the placeable area (m). */
  halfExtent: number
}

const CANDIDATE_STEP_M = 180
const HOME_RESERVE_M = 1150
const MIN_SEPARATION_M = 700
const SALT = 0x4c464d31
/** Deterministic relaxation steps of the flatness / height tolerances when a kind finds no candidate. */
const RELAX_STEPS = [1, 1.6, 2.4] as const

type Candidate = { gx: number, gz: number, x: number, z: number, range: number, ground: number }

/** Smooth 0..1 step. */
const smooth = (a: number, b: number, v: number): number => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function probeRange(ctx: LandformGenContext, x: number, z: number, r: number): { range: number, ground: number, min: number, max: number } {
  const centre = ctx.floorH(x, z)
  let min = centre
  let max = centre
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    const h = ctx.floorH(x + Math.cos(a) * r, z + Math.sin(a) * r)
    if (h < min) min = h
    if (h > max) max = h
  }
  return { range: max - min, ground: centre, min, max }
}

/**
 * Derives the P1 landform descriptors of a world (plan 060 R3): about one lake island, one crater and 1–3 crags,
 * picked from jittered 180 m candidates on **flat lowland** of the descriptor-free base relief (never on ranges —
 * spine summits are R2's range term, not a point landform). Home reserve 1150 m, ≥ 700 m between landforms, no per-kind
 * guarantee: a kind with no candidate relaxes its tolerances in deterministic steps and is otherwise omitted
 * (the census reports the shortfall). Pure + deterministic for a given base relief.
 */
export function generateLandforms(seed: number, ctx: LandformGenContext): readonly LandformDescriptor[] {
  const rand = createSeededRandom(seed ^ SALT)
  const kinds: Array<{ kind: LandformKind, count: number }> = [
    { kind: 'lakeIsland', count: 1 },
    { kind: 'crater', count: 1 },
    { kind: 'crag', count: 1 + Math.floor(rand() * 3) },
  ]
  const half = Math.floor(ctx.halfExtent / CANDIDATE_STEP_M) - 2
  const out: LandformDescriptor[] = []
  const chosen: Array<{ x: number, z: number }> = []
  const jitter = new Map<string, { x: number, z: number, j: number }>()
  const cell = (gx: number, gz: number) => {
    const key = `${gx}_${gz}`
    let v = jitter.get(key)
    if (!v) {
      const r = createSeededRandom((seed ^ SALT ^ Math.imul(gx, 73856093) ^ Math.imul(gz, 19349663)) >>> 0)
      v = { x: (gx + 0.3 + 0.4 * r()) * CANDIDATE_STEP_M, z: (gz + 0.3 + 0.4 * r()) * CANDIDATE_STEP_M, j: r() }
      jitter.set(key, v)
    }
    return v
  }
  for (const { kind, count } of kinds) {
    for (let n = 0; n < count; n++) {
      const radius = kind === 'crag' ? 110 + rand() * 60 : kind === 'crater' ? 70 + rand() * 60 : 200 + rand() * 70
      let picked: (Candidate & { score: number }) | null = null
      for (const relax of RELAX_STEPS) {
        const maxRange = (kind === 'lakeIsland' ? 2.5 : 4) * relax
        let best: (Candidate & { score: number }) | null = null
        for (let gz = -half; gz <= half; gz++) {
          for (let gx = -half; gx <= half; gx++) {
            const c = cell(gx, gz)
            if (Math.hypot(c.x, c.z) < HOME_RESERVE_M + radius) continue
            if (chosen.some((o) => Math.hypot(o.x - c.x, o.z - c.z) < MIN_SEPARATION_M)) continue
            const ground = ctx.floorH(c.x, c.z)
            // Flat lowland well above the sea and below the tree line — never on a range.
            // Basins keep their floor above the sea (hydrology decides whether they become a lake); crags may sit lower.
            if (ground < ctx.waterLevel + (kind === 'lakeIsland' ? 5.5 : 4) || ground > 11.5) continue
            const pr = probeRange(ctx, c.x, c.z, radius)
            if (pr.min < ctx.waterLevel + (kind === 'lakeIsland' ? 4 : 2.5) || pr.max > 14 || pr.range > maxRange) continue
            const score = -pr.range + c.j * 1.5
            if (!best || score > best.score) best = { gx, gz, x: c.x, z: c.z, range: pr.range, ground, score }
          }
        }
        if (best) { picked = best; break }
      }
      if (!picked) continue
      chosen.push({ x: picked.x, z: picked.z })
      // A crater is a dry tuff ring (raised rim, interior at ground level) with a gap on the downhill side so no pit
      // forms: any depression below the surroundings would be filled by hydrology (lake or filled pit), see 060 notes.
      let notch = 0
      if (kind === 'crater') {
        let low = Infinity
        for (let k = 0; k < 16; k++) {
          const a = (k / 16) * Math.PI * 2 - Math.PI
          const h = ctx.floorH(picked.x + Math.cos(a) * radius, picked.z + Math.sin(a) * radius)
          if (h < low) { low = h; notch = a }
        }
      }
      const params: Record<string, number> = kind === 'crag'
        ? { amplitude: 7 + rand() * 6 }
        : kind === 'crater'
          ? { rim: 3.5 + rand() * 1.5, notch }
          : { depth: 3.5 + rand() * 1, knoll: 4 + rand() * 2 }
      out.push({
        id: `lf:${kind}:${picked.gx}_${picked.gz}`,
        kind,
        centreX: picked.x,
        centreZ: picked.z,
        radius,
        params,
        intendedOutcome: kind === 'crag'
          ? 'isolated rocky hill'
          : kind === 'crater'
            ? 'dry crater: raised rim ring with a gap on the downhill side, interior at ground level'
            : 'basin with a central knoll; a lake with an island where hydrology fills the basin',
      })
    }
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}

/**
 * Per-world index (seed + base-relief identity `key`), built once and reused by every realm sample. `ctx` is only read on
 * the first call for a key. Worlds without a finite continent pass `null` and get the shared empty index.
 */
export function landformIndexFor(seed: number, key: string, ctx: LandformGenContext | null): LandformIndex {
  if (!ctx) return EMPTY_LANDFORM_INDEX
  const k = `${seed}|${key}`
  let index = landformIndexByKey.get(k)
  if (!index) {
    index = buildLandformIndex(generateLandforms(seed, ctx))
    landformIndexByKey.set(k, index)
  }
  return index
}

/**
 * Metre-scale height contribution of the landforms at `(x, z)`, added on top of the base floor (continuous, zero at the
 * footprint edge). `crag` = knoll; `crater` = dry rim ring with a downhill gap; `lakeIsland` = basin with a central knoll (hydrology decides
 * the water). Skipped entirely while the index is empty.
 */
export function landformHeightDeltaAt(index: LandformIndex, x: number, z: number): number {
  if (index.count === 0) return 0
  let delta = 0
  for (const d of index.near(x, z)) {
    const dx = x - d.centreX
    const dz = z - d.centreZ
    const d2 = dx * dx + dz * dz
    if (d2 >= d.radius * d.radius) continue
    const t = Math.sqrt(d2) / d.radius
    const fade = 1 - smooth(0.88, 1, t)
    if (d.kind === 'crag') {
      const w = 1 - t * t
      delta += (d.params.amplitude ?? 8) * w * w
    } else if (d.kind === 'crater') {
      const u = (t - 0.78) / 0.1
      let dTheta = Math.abs(Math.atan2(dz, dx) - (d.params.notch ?? 0))
      if (dTheta > Math.PI) dTheta = Math.PI * 2 - dTheta
      const ring = 1 - (1 - smooth(0.3, 0.55, dTheta)) // 0 in the gap, 1 on the rest of the rim
      delta += (d.params.rim ?? 4) * Math.exp(-u * u) * ring * fade
    } else if (d.kind === 'lakeIsland') {
      const basin = -(d.params.depth ?? 5) * (1 - smooth(0.4, 0.95, t))
      const u = t / 0.2
      delta += (basin + (d.params.knoll ?? 5) * Math.exp(-u * u)) * fade
    }
  }
  return delta
}
