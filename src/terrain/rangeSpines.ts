/**
 * Mountain range spines and passes (plan world-terrain-060, slices R1–R2).
 *
 * A world gets 1–3 seeded **range spines**: gently curving polylines, 2–4.4 km long, laid on the descriptor-free base
 * relief (land weight + the existing noise mountain gate) and kept away from the home reserve. In the height sampler
 * the spine distance field becomes the main term of the mountain envelope (`gate`), adds a continuous main crest along
 * the spine (`crest`), and — R2 — a metre-scale summit term on the range core (`summitM`). Each spine carries **pass
 * descriptors**: windows along the spine where the envelope, crest and summit term are lowered to a saddle, each with a
 * traversable **corridor** (centreline across the range, width, intended max grade) that later road/settlement work
 * must treat as a crossing, not as a protected footprint (plan 060 §Design 6).
 *
 * Acyclicity: generation reads the seed and the base relief callbacks only — never hydrology, climate, settlements or
 * roads. Identity: spine ids come from the winning candidate's quantized centre cell, pass ids from the spine id and
 * the pass ordinal along the spine.
 *
 * Cost (review 031 F7): ≤ `RANGE_MAX_SPINES` spines × `RANGE_SEGMENTS` segments per sample, behind a per-spine bounding
 * box; the warp is the sampler's already-computed Worley warp (no extra noise evaluation).
 *
 * @domain world-terrain
 */

import { MathUtils } from 'three'
import { createSeededRandom } from '../world/parseSeed'
import { roundCrease } from './worleyNoise'

export type RangePassCorridor = {
  /** Centreline midpoint (on the spine) and unit direction across the range. */
  centreX: number
  centreZ: number
  dirX: number
  dirZ: number
  /** Half length of the crossing (spine half width + approach margin), metres. */
  halfLength: number
  /** Intended traversable width, metres. */
  width: number
  /** Intended max grade (rise / run) of the crossing in both directions; validated after hydrology/roads (R4). */
  maxGrade: number
}

export type RangePass = {
  /** `rp:<spineId>:<ordinal along the spine>`. */
  id: string
  /** Arc length (m) of the saddle along the spine. */
  t: number
  /** Arc-length half window (m) of full lowering; the lowering fades out over the same length again. */
  halfWindow: number
  /** 0..1 — share of the envelope/crest/summit removed at the saddle. */
  depth: number
  corridor: RangePassCorridor
}

export type RangeSummit = {
  /** Arc length (m) of the summit along the spine. */
  t: number
  /** Along-spine Gaussian sigma (m). */
  sigma: number
  /** Extra height (m) on the crest line at the summit, before end taper / pass lowering. */
  amplitude: number
}

export type RangeSpine = {
  /** `rs:<cellKey>` from the winning candidate's quantized centre. */
  id: string
  xs: readonly number[]
  zs: readonly number[]
  /** Cumulative arc length at each point; `cum[last]` is the spine length. */
  cum: readonly number[]
  length: number
  /** Envelope half width (m): the range's mountain gate reaches 0 here. */
  halfWidth: number
  /** Crest/summit core half width (m). */
  coreHalfWidth: number
  /** Metre-scale crest lift along the whole core (R2), before summits. */
  crestLiftM: number
  passes: readonly RangePass[]
  summits: readonly RangeSummit[]
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export type RangeSpineSet = { readonly spines: readonly RangeSpine[] }

/** Per-sample spine fields; all zero (passFactor 1) away from every spine. */
export type RangeSpineSample = {
  /** 0..1 mountain envelope of the spines (end-tapered, pass-lowered). */
  gate: number
  /** 0..1 continuous main crest along the spine core (end-tapered, pass-lowered). */
  crest: number
  /** Metre-scale crest lift + summits (R2), end-tapered and pass-lowered. */
  summitM: number
  /** 1 outside pass windows, `1 - depth` at a saddle — applied to the whole mountain gate. */
  passFactor: number
}

/** Base relief the generator may read (acyclic: no spine term, no hydrology). */
export type RangeBaseRelief = {
  /** 0..1 land weight (0 = sea, 1 = inland). */
  land: (x: number, z: number) => number
  /** 0..1 existing noise mountain gate (before land weighting). */
  mountain: (x: number, z: number) => number
}

export const RANGE_MAX_SPINES = 3
export const RANGE_SEGMENTS = 8
const CANDIDATES = 64
const MIN_LENGTH_M = 2200
const MAX_LENGTH_M = 4400
const HALF_WIDTH_M = 420
const CORE_HALF_WIDTH_M = 210
/** Envelope stays at full strength inside this share of the half width. */
const ENVELOPE_INNER = 0.45
/** Arc length over which the range fades out at both ends. */
const END_TAPER_M = 650
/** Spines keep at least this distance (centreline) from the world origin / home settlement. */
export const RANGE_HOME_RESERVE_M = 1150
const MIN_SPINE_SEPARATION_M = 1500
const CANDIDATE_RADIUS_M = 2600
const CENTRE_LAND_MIN = 0.8
/** Length of the raw candidate path before trimming to its longest inland run. */
const PATH_LENGTH_M = 6000
const MAX_TURN_RAD = 0.22
const CELL_KEY_M = 256
const PASS_HALF_WINDOW_M = 110
const PASS_DEPTH = 0.8
const PASS_APPROACH_M = 180
const PASS_WIDTH_M = 60
const PASS_MAX_GRADE = 0.12

/** R2 summit profile (🟡 calibrated on previews; author judges the R2 previews). */
const CREST_LIFT_M = 9
const TOP_SUMMIT_AMPLITUDE_M = 34
const SECONDARY_SUMMIT_AMPLITUDE_M: readonly [number, number] = [10, 20]
const SUMMIT_SIGMA_M: readonly [number, number] = [170, 260]
/** Exponent of the across-spine core profile `(1 - u)^p`; > 1 gives steep upper flanks. */
const CORE_PROFILE_EXPONENT = 1.5
/**
 * Crest rounding width (m, plan world-terrain-065). The core profile runs on `roundCrease(d, CREST_ROUND_M)` instead of
 * `d`, so the crest is C¹ (no lit/shaded facet edge along the ridge line); the crest/summit height at `d = 0` and the
 * profile beyond this width are unchanged.
 */
const CREST_ROUND_M = 50
/**
 * Softness (m) of the arc-length blend over polyline segments (plan world-terrain-065). The nearest-segment `t` jumps
 * on the bisector of every concave polyline vertex (summits and passes are functions of `t`); a softmin-weighted
 * average of the per-segment arc lengths is continuous there.
 */
const POLYLINE_BLEND_M = 60

/** Softness of `unionWithSpine` (0..1 field units); overshoot above the hard max is at most a quarter of it. */
const SPINE_UNION_SOFTNESS = 0.1

/**
 * C¹ union of a spine field with the matching noise field (plan world-terrain-065): a hard `max` creases wherever the
 * two cross, which shows as a lit/shaded facet edge. Polynomial smooth max whose softness fades to 0 as both inputs
 * approach 0, so lowland (both ≈ 0) stays exactly `max(a, b)` and no mountain term leaks into it. Overshoot ≤ 0.025.
 *
 * @domain world-terrain
 */
export function unionWithSpine(a: number, b: number): number {
  const m = a > b ? a : b
  const sum = a + b
  if (sum <= 0) return m
  const k = SPINE_UNION_SOFTNESS * MathUtils.smoothstep(sum, 0, 2 * SPINE_UNION_SOFTNESS)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return m + h * h * k * 0.25
}

/** Rounded distance used by the core profile (see `CREST_ROUND_M`). */
function roundedCrestDistance(d: number): number {
  return roundCrease(d, CREST_ROUND_M)
}

/**
 * Soft ceiling for range summits (G8: top peaks ~60–80 m). Heights above the knee are compressed smoothly towards the
 * ceiling, so a spine summit standing on unusually high base relief does not overshoot. Below the knee (all lowland,
 * hills and noise massifs, ≤ ~41 m) the height is untouched.
 */
export const SUMMIT_SOFT_KNEE_M = 66
export const SUMMIT_SOFT_CEILING_M = 82

/** Applies the summit soft ceiling; identity at or below the knee. */
export function softCapSummitHeight(h: number): number {
  if (h <= SUMMIT_SOFT_KNEE_M) return h
  const span = SUMMIT_SOFT_CEILING_M - SUMMIT_SOFT_KNEE_M
  return SUMMIT_SOFT_KNEE_M + span * Math.tanh((h - SUMMIT_SOFT_KNEE_M) / span)
}

export const EMPTY_RANGE_SPINES: RangeSpineSet = Object.freeze({ spines: Object.freeze([]) as readonly RangeSpine[] })

const NO_SPINE: RangeSpineSample = Object.freeze({ gate: 0, crest: 0, summitM: 0, passFactor: 1 })

type Candidate = { spine: Omit<RangeSpine, 'passes' | 'summits' | 'crestLiftM'>, score: number, order: number }

function buildPolyline(cx: number, cz: number, theta: number, length: number, turns: readonly number[]) {
  const seg = length / RANGE_SEGMENTS
  const half = RANGE_SEGMENTS / 2
  const xs: number[] = new Array(RANGE_SEGMENTS + 1)
  const zs: number[] = new Array(RANGE_SEGMENTS + 1)
  xs[half] = cx
  zs[half] = cz
  // Walk out from the centre in both directions; turns accumulate so the spine curves gently.
  let a = theta
  for (let i = half; i < RANGE_SEGMENTS; i++) {
    a += turns[i]!
    xs[i + 1] = xs[i]! + Math.cos(a) * seg
    zs[i + 1] = zs[i]! + Math.sin(a) * seg
  }
  a = theta
  for (let i = half; i > 0; i--) {
    a -= turns[i - 1]!
    xs[i - 1] = xs[i]! - Math.cos(a) * seg
    zs[i - 1] = zs[i]! - Math.sin(a) * seg
  }
  const cum: number[] = [0]
  for (let i = 1; i <= RANGE_SEGMENTS; i++) cum.push(cum[i - 1]! + Math.hypot(xs[i]! - xs[i - 1]!, zs[i]! - zs[i - 1]!))
  return { xs, zs, cum }
}

/** Distance from `(px, pz)` to the polyline + arc length of the closest point. */
function closestOnPolyline(xs: readonly number[], zs: readonly number[], cum: readonly number[], px: number, pz: number) {
  let best = Infinity
  let bestT = 0
  for (let i = 0; i < xs.length - 1; i++) {
    const ax = xs[i]!
    const az = zs[i]!
    const dx = xs[i + 1]! - ax
    const dz = zs[i + 1]! - az
    const len2 = dx * dx + dz * dz
    let u = len2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / len2 : 0
    u = u < 0 ? 0 : u > 1 ? 1 : u
    const qx = ax + dx * u - px
    const qz = az + dz * u - pz
    const d2 = qx * qx + qz * qz
    if (d2 < best) {
      best = d2
      bestT = cum[i]! + (cum[i + 1]! - cum[i]!) * u
    }
  }
  return { d: Math.sqrt(best), t: bestT }
}

/** Point and unit tangent at arc length `t`. */
function pointAt(s: Pick<RangeSpine, 'xs' | 'zs' | 'cum'>, t: number) {
  let i = 0
  while (i < s.cum.length - 2 && s.cum[i + 1]! < t) i++
  const segLen = s.cum[i + 1]! - s.cum[i]!
  const u = segLen > 0 ? (t - s.cum[i]!) / segLen : 0
  const dx = s.xs[i + 1]! - s.xs[i]!
  const dz = s.zs[i + 1]! - s.zs[i]!
  const l = Math.hypot(dx, dz) || 1
  return { x: s.xs[i]! + dx * u, z: s.zs[i]! + dz * u, tx: dx / l, tz: dz / l }
}

/** World position of a spine summit (its crest point at arc length `summit.t`) — for the location catalog (world-041 L1). */
export function rangeSummitPosition(spine: RangeSpine, summit: RangeSummit): { x: number, z: number } {
  const p = pointAt(spine, summit.t)
  return { x: p.x, z: p.z }
}

const SAMPLE_STEP_M = 100

/**
 * Trims a long candidate path to its longest contiguous run that sits inland and outside the home reserve, then
 * resamples that run into `RANGE_SEGMENTS` segments. Returns null when the run is shorter than `MIN_LENGTH_M`.
 */
function trimCandidate(
  path: Pick<RangeSpine, 'xs' | 'zs' | 'cum'>,
  maxLength: number,
  base: RangeBaseRelief,
): { xs: number[], zs: number[], cum: number[], score: number } | null {
  const total = path.cum[path.cum.length - 1]!
  const steps = Math.floor(total / SAMPLE_STEP_M)
  const ok: boolean[] = []
  const mtn: number[] = []
  for (let k = 0; k <= steps; k++) {
    const p = pointAt(path, k * SAMPLE_STEP_M)
    const inland = base.land(p.x, p.z) >= CENTRE_LAND_MIN && Math.hypot(p.x, p.z) >= RANGE_HOME_RESERVE_M
    ok.push(inland)
    mtn.push(inland ? base.mountain(p.x, p.z) : 0)
  }
  let bestA = 0
  let bestB = -1
  for (let a = 0; a <= steps; ) {
    if (!ok[a]) {
      a++
      continue
    }
    let b = a
    while (b + 1 <= steps && ok[b + 1]) b++
    if (b - a > bestB - bestA) {
      bestA = a
      bestB = b
    }
    a = b + 1
  }
  // Cap the run at `maxLength`, centred on the run's midpoint.
  const maxSteps = Math.floor(maxLength / SAMPLE_STEP_M)
  if (bestB - bestA > maxSteps) {
    const mid = Math.floor((bestA + bestB) / 2)
    bestA = mid - Math.floor(maxSteps / 2)
    bestB = bestA + maxSteps
  }
  const length = (bestB - bestA) * SAMPLE_STEP_M
  if (bestB < 0 || length < MIN_LENGTH_M) return null
  const xs: number[] = []
  const zs: number[] = []
  for (let i = 0; i <= RANGE_SEGMENTS; i++) {
    const p = pointAt(path, (bestA + ((bestB - bestA) * i) / RANGE_SEGMENTS) * SAMPLE_STEP_M)
    xs.push(p.x)
    zs.push(p.z)
  }
  const cum: number[] = [0]
  for (let i = 1; i <= RANGE_SEGMENTS; i++) cum.push(cum[i - 1]! + Math.hypot(xs[i]! - xs[i - 1]!, zs[i]! - zs[i - 1]!))
  let mountain = 0
  for (let k = bestA; k <= bestB; k++) mountain += mtn[k]!
  // Prefer long spines that run through existing noise massifs, so old mountains join the new ranges.
  return { xs, zs, cum, score: length / MAX_LENGTH_M + (mountain / (bestB - bestA + 1)) * 1.5 }
}

function polylineDistance(a: Pick<RangeSpine, 'xs' | 'zs' | 'cum'>, b: Pick<RangeSpine, 'xs' | 'zs' | 'cum'>): number {
  let min = Infinity
  const len = a.cum[a.cum.length - 1]!
  for (let k = 0; k <= 40; k++) {
    const p = pointAt(a, (len * k) / 40)
    min = Math.min(min, closestOnPolyline(b.xs, b.zs, b.cum, p.x, p.z).d)
  }
  return min
}

/**
 * Derives the range spines of a world. Pure and deterministic: same seed + same base relief → same spines, in a stable
 * order (by id). A world may get fewer than the target when the land offers no valid candidate (census reports it).
 */
export function generateRangeSpines(seed: number, base: RangeBaseRelief): RangeSpineSet {
  const rng = createSeededRandom((seed ^ 0x5bd1e995) >>> 0)
  const target = 1 + Math.floor(rng() * RANGE_MAX_SPINES) // 1..3
  const candidates: Candidate[] = []
  for (let k = 0; k < CANDIDATES; k++) {
    const r = Math.sqrt(rng()) * CANDIDATE_RADIUS_M
    const phi = rng() * Math.PI * 2
    const theta = rng() * Math.PI
    const length = MIN_LENGTH_M + rng() * (MAX_LENGTH_M - MIN_LENGTH_M)
    const turns = Array.from({ length: RANGE_SEGMENTS }, () => (rng() * 2 - 1) * MAX_TURN_RAD)
    const cx = Math.cos(phi) * r
    const cz = Math.sin(phi) * r
    // Lay a long path, then keep its longest inland run (bays and the home reserve cut it).
    const trimmed = trimCandidate(buildPolyline(cx, cz, theta, PATH_LENGTH_M, turns), length, base)
    if (trimmed === null) continue
    const { xs, zs, cum, score } = trimmed
    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity
    for (let i = 0; i < xs.length; i++) {
      minX = Math.min(minX, xs[i]!)
      maxX = Math.max(maxX, xs[i]!)
      minZ = Math.min(minZ, zs[i]!)
      maxZ = Math.max(maxZ, zs[i]!)
    }
    const id = `rs:${Math.floor(xs[RANGE_SEGMENTS / 2]! / CELL_KEY_M)}_${Math.floor(zs[RANGE_SEGMENTS / 2]! / CELL_KEY_M)}`
    candidates.push({
      spine: { id, xs, zs, cum, length: cum[cum.length - 1]!, halfWidth: HALF_WIDTH_M, coreHalfWidth: CORE_HALF_WIDTH_M, minX: minX - HALF_WIDTH_M, maxX: maxX + HALF_WIDTH_M, minZ: minZ - HALF_WIDTH_M, maxZ: maxZ + HALF_WIDTH_M },
      score,
      order: k,
    })
  }
  candidates.sort((a, b) => b.score - a.score || a.order - b.order)
  const chosen: Candidate['spine'][] = []
  for (const c of candidates) {
    if (chosen.length >= target) break
    if (chosen.some((s) => s.id === c.spine.id || polylineDistance(c.spine, s) < MIN_SPINE_SEPARATION_M)) continue
    chosen.push(c.spine)
  }
  chosen.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

  // Passes and summits use a per-spine RNG so adding/removing another spine never moves them.
  const spines: RangeSpine[] = chosen.map((s, rank) => {
    const r = createSeededRandom((seed ^ hashId(s.id)) >>> 0)
    const passCount = s.length > 3200 ? 2 : 1
    const passes: RangePass[] = []
    for (let p = 0; p < passCount; p++) {
      const lo = (p + 0.3) / passCount
      const hi = (p + 0.7) / passCount
      const t = s.length * (lo + r() * (hi - lo))
      const pt = pointAt(s, t)
      passes.push({
        id: `rp:${s.id}:${p}`,
        t,
        halfWindow: PASS_HALF_WINDOW_M,
        depth: PASS_DEPTH,
        corridor: { centreX: pt.x, centreZ: pt.z, dirX: -pt.tz, dirZ: pt.tx, halfLength: HALF_WIDTH_M + PASS_APPROACH_M, width: PASS_WIDTH_M, maxGrade: PASS_MAX_GRADE },
      })
    }
    // Summits sit between passes and taper zones; the world's first-ranked spine (longest/strongest) carries the top peak.
    const summits: RangeSummit[] = []
    const slots = summitSlots(s.length, passes)
    const summitCount = Math.min(slots.length, 1 + Math.floor(r() * 2) + (s.length > 3200 ? 1 : 0))
    for (let k = 0; k < summitCount; k++) {
      const [a, b] = slots[k]!
      const amp = k === 0 && rank === topRank(chosen)
        ? TOP_SUMMIT_AMPLITUDE_M
        : MathUtils.lerp(SECONDARY_SUMMIT_AMPLITUDE_M[0], SECONDARY_SUMMIT_AMPLITUDE_M[1], r())
      summits.push({ t: MathUtils.lerp(a, b, 0.25 + r() * 0.5), sigma: MathUtils.lerp(SUMMIT_SIGMA_M[0], SUMMIT_SIGMA_M[1], r()), amplitude: amp })
    }
    return { ...s, crestLiftM: CREST_LIFT_M, passes, summits }
  })
  return { spines }
}

/** Index of the longest chosen spine (ties → first by id): it carries the world's top summit. */
function topRank(chosen: readonly { length: number }[]): number {
  let best = 0
  for (let i = 1; i < chosen.length; i++) if (chosen[i]!.length > chosen[best]!.length) best = i
  return best
}

/** Arc-length intervals free of end tapers and pass windows, longest first. */
function summitSlots(length: number, passes: readonly RangePass[]): [number, number][] {
  const cuts = [END_TAPER_M * 0.6, ...passes.flatMap((p) => [p.t - p.halfWindow * 3, p.t + p.halfWindow * 3]), length - END_TAPER_M * 0.6]
  const slots: [number, number][] = []
  for (let i = 0; i + 1 < cuts.length; i += 2) if (cuts[i + 1]! - cuts[i]! > 200) slots.push([cuts[i]!, cuts[i + 1]!])
  return slots.sort((a, b) => b[1] - b[0] - (a[1] - a[0]))
}

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Distance + arc length to the polyline for terrain sampling (plan world-terrain-065). `d` is the exact distance (the
 * envelope); `dCrest` is the nearest segment's *rounded* distance (`roundedCrestDistance`), so the crest line itself is
 * C¹ — what remains is a weak crease on the bisector of a concave vertex, proportional to its turn (≤ `MAX_TURN_RAD`).
 * `t` is a softmin-weighted average of the per-segment arc lengths, so summits and passes (functions of `t`) no longer
 * jump on that bisector. Generation keeps the exact `closestOnPolyline`.
 */
function blendedOnPolyline(xs: readonly number[], zs: readonly number[], cum: readonly number[], px: number, pz: number) {
  const n = xs.length - 1
  const segD = n <= BLEND_SCRATCH_D.length ? BLEND_SCRATCH_D : new Float64Array(n)
  const segR = n <= BLEND_SCRATCH_R.length ? BLEND_SCRATCH_R : new Float64Array(n)
  const segT = n <= BLEND_SCRATCH_T.length ? BLEND_SCRATCH_T : new Float64Array(n)
  let rMin = Infinity
  for (let i = 0; i < n; i++) {
    const ax = xs[i]!
    const az = zs[i]!
    const dx = xs[i + 1]! - ax
    const dz = zs[i + 1]! - az
    const len2 = dx * dx + dz * dz
    let u = len2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / len2 : 0
    u = u < 0 ? 0 : u > 1 ? 1 : u
    const qx = ax + dx * u - px
    const qz = az + dz * u - pz
    const d = Math.sqrt(qx * qx + qz * qz)
    const r = roundedCrestDistance(d)
    segD[i] = d
    segR[i] = r
    segT[i] = cum[i]! + (cum[i + 1]! - cum[i]!) * u
    if (r < rMin) rMin = r
  }
  let dMin = Infinity
  let wSum = 0
  let tSum = 0
  for (let i = 0; i < n; i++) {
    if (segD[i]! < dMin) dMin = segD[i]!
    // Only `t` is blended: averaging *distances* would lift the crest line near every vertex (the neighbour segment's
    // clamped distance there is the along-line distance to the vertex). Weights come from the rounded (smooth)
    // distances, `rMin` only normalises (it cancels in the ratios); segments beyond 12 blend widths weigh < 6e−6 and
    // are skipped (the step this leaves in `t` is negligible).
    const e = (segR[i]! - rMin) / POLYLINE_BLEND_M
    if (e > 12) continue
    const w = Math.exp(-e)
    wSum += w
    tSum += w * segT[i]!
  }
  return { d: dMin, dCrest: rMin, t: tSum / wSum }
}

/** Per-segment scratch for `blendedOnPolyline` (single-threaded per worker; spines have `RANGE_SEGMENTS` segments). */
const BLEND_SCRATCH_D = new Float64Array(RANGE_SEGMENTS)
const BLEND_SCRATCH_T = new Float64Array(RANGE_SEGMENTS)
const BLEND_SCRATCH_R = new Float64Array(RANGE_SEGMENTS)

/**
 * Spine fields at a (warped) world point. Allocates only when the point is inside a spine's bounding box.
 */
export function sampleRangeSpines(set: RangeSpineSet, x: number, z: number): RangeSpineSample {
  const spines = set.spines
  if (spines.length === 0) return NO_SPINE
  let gate = 0
  let crest = 0
  let summitM = 0
  let passFactor = 1
  let hit = false
  for (let i = 0; i < spines.length; i++) {
    const s = spines[i]!
    if (x < s.minX || x > s.maxX || z < s.minZ || z > s.maxZ) continue
    const { d, dCrest, t } = blendedOnPolyline(s.xs, s.zs, s.cum, x, z)
    if (d >= s.halfWidth) continue
    hit = true
    const taper = MathUtils.smoothstep(t, 0, END_TAPER_M) * MathUtils.smoothstep(s.length - t, 0, END_TAPER_M)
    let pf = 1
    for (const p of s.passes) {
      const w = 1 - MathUtils.smoothstep(Math.abs(t - p.t), p.halfWindow, p.halfWindow * 2)
      pf = Math.min(pf, 1 - p.depth * w)
    }
    const envelope = 1 - MathUtils.smoothstep(d / s.halfWidth, ENVELOPE_INNER, 1)
    const g = envelope * taper
    const coreEdge = roundedCrestDistance(s.coreHalfWidth)
    const coreU = dCrest < coreEdge ? 1 - dCrest / coreEdge : 0
    const core = coreU > 0 ? coreU ** CORE_PROFILE_EXPONENT : 0
    let lift = 0
    if (core > 0) {
      lift = s.crestLiftM
      for (const sm of s.summits) {
        const u = (t - sm.t) / sm.sigma
        lift += sm.amplitude * Math.exp(-0.5 * u * u)
      }
      lift *= core * taper * pf
    }
    gate = Math.max(gate, g)
    crest = Math.max(crest, core * taper * pf)
    summitM = Math.max(summitM, lift)
    // The pass factor scales the whole mountain gate (noise included), so it must reach 1 at the envelope edge;
    // a raw `pf` would step back to 1 there (plan world-terrain-065).
    passFactor = Math.min(passFactor, 1 - (1 - pf) * envelope)
  }
  if (!hit) return NO_SPINE
  return { gate, crest, summitM, passFactor }
}
