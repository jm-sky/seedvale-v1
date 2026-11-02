/**
 * V2-derived cemetery layout (queue Q47 / Q39 plan §2.1) — pure functions of `(size, scale)`, no Three.js.
 *
 * Local frame: +Z is the entrance side, the crypt row sits at the back (−Z), graves are a grid with a
 * central aisle. The plot is centred on the placement point (V2 used the full depth as a half-extent; that
 * defect is not carried over). Everything here is deterministic so renderer, colliders, placement and the
 * four grave-slot consumers (Hidden Finds, treasure keys, chronicle, bear-cave map) see identical positions.
 *
 * `cemeteryGraveLayout` keeps its historical role: element `i` is dig slot `i` (`index % length` consumers),
 * order is stable (row-major from the crypt row to the entrance, left to right).
 * @domain world-terrain
 */

import type { VillageSize } from './families'

/** Cemetery footprint size (plan 173) — drives crypt/grave counts and plot extents. */
export type CemeterySize = 'SM' | 'MD' | 'LG'

/** Cemetery size from the served settlement scale (Q47 / Q39 plan §2.2) — strict, so crypt count follows
 *  settlement size: OUTPOST/SM → SM (1 crypt), MD → MD (2), LG/XL → LG (3); a shared pair (two small
 *  villages' dead) → MD. No RNG: size is a pure function of the served sizes. */
export function cemeterySizeForServedSizes(servedSizes: readonly VillageSize[]): CemeterySize {
  if (servedSizes.length >= 2) return 'MD'
  switch (servedSizes[0] ?? 'SM') {
    case 'LG':
    case 'XL':
      return 'LG'
    case 'MD':
      return 'MD'
    default:
      return 'SM'
  }
}

type CemeteryClassSpec = { columns: number, graves: number, crypts: number }

/** V2 class table with fixed counts (V2 base + 1, the midpoint of V2's range). */
const CLASS_SPECS: Record<CemeterySize, CemeteryClassSpec> = {
  SM: { columns: 4, graves: 9, crypts: 1 },
  MD: { columns: 5, graves: 15, crypts: 2 },
  LG: { columns: 7, graves: 25, crypts: 3 },
}

// Compact plots (Q47 visual trial, author 2026-10-31): ~40 % less area than the first V2-derived sizes so
// assignments still place; spacing/margins are the knobs to revise after the in-game review.
const GRAVE_DX = 2.0
const GRAVE_DZ = 2.4
const AISLE = 1.2
const MARGIN = 1.2
const TOMB_ROW = 6.6
/** Clear gap between neighbouring crypts in the back row. */
const TOMB_GAP = 0.6
/** Relative crypt scale per class (author: LG = 1 × 100 % + 2 × 80 %, the big one in the middle). */
const CRYPT_SCALES: Record<CemeterySize, readonly number[]> = { SM: [1], MD: [1, 1], LG: [0.8, 1, 0.8] }
/** Marker stands this far behind the dig slot (towards the crypts) so the slot is outside the marker OBB. */
const MARKER_BEHIND_SLOT = 0.9
const GRAVE_JITTER_X = 0.25
const GRAVE_JITTER_Z = 0.3
const GRAVE_JITTER_YAW = 0.1
const TOMB_JITTER_X = 0.25
const TOMB_JITTER_Z = 0.3
const TOMB_JITTER_YAW = 0.05

/** Piece ids = wrapper node names in `graveyard.glb` (`GRAVEYARD_PIECES` in `propSpecs.ts`). */
export type CemeteryPieceId = 'Grave' | 'Gravestone' | 'Grave_Marker_A' | 'Grave_Marker_B' | 'Grave_Damaged' | 'Crypt'
export type CemeteryMarkerPieceId = Exclude<CemeteryPieceId, 'Crypt'>

/** Conservative symmetric footprint half-extents (x, z) at scale 1 — measured from the GLB bounds. */
export const CEMETERY_PIECE_HALF_EXTENTS: Record<CemeteryPieceId, { hx: number, hz: number }> = {
  Grave: { hx: 0.5, hz: 0.25 },
  Gravestone: { hx: 0.35, hz: 0.1 },
  Grave_Marker_A: { hx: 0.3, hz: 0.12 },
  Grave_Marker_B: { hx: 0.29, hz: 0.26 },
  Grave_Damaged: { hx: 0.54, hz: 0.32 },
  Crypt: { hx: 2.1, hz: 2.8 },
}

export type CemeteryGraveSlot = {
  /** Dig slot (the grave plot) in the local frame — what every slot consumer reads. */
  x: number
  z: number
  /** Marker origin (0.9 m·scale behind the slot, towards the crypts). */
  markerX: number
  markerZ: number
  /** Marker yaw jitter (radians, local frame; the landmark yaw is added by the caller). */
  yaw: number
}

/** `scale` is relative to the landmark scale (1 = full crypt, 0.8 = compact LG side crypts). */
export type CemeteryCryptPose = { x: number, z: number, yaw: number, scale: number }

function mix32(a: number, b: number): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35)
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d)
  h ^= h >>> 12
  h = Math.imul(h, 0x297a2d39)
  h ^= h >>> 15
  return h >>> 0
}

/** Deterministic [0,1) hash of an integer seed + salt. */
export function hash01(seed: number, salt: number): number {
  return mix32(seed | 0, salt | 0) / 4294967296
}

const SIZE_SALT: Record<CemeterySize, number> = { SM: 101, MD: 202, LG: 303 }

function geometry(size: CemeterySize) {
  const spec = CLASS_SPECS[size]
  const rows = Math.ceil(spec.graves / spec.columns)
  const innerWidth = spec.columns * GRAVE_DX + AISLE
  const width = innerWidth + 2 * MARGIN
  const depth = 2 * MARGIN + TOMB_ROW + rows * GRAVE_DZ
  return { spec, rows, innerWidth, width, depth }
}

/** Half-extents of the plot rectangle (local frame, centred on the placement point) — the single
 *  footprint source for placement, clearance and census. */
export function cemeteryPlotExtents(size: CemeterySize, scale: number): { hw: number, hd: number } {
  const g = geometry(size)
  return { hw: (g.width / 2) * scale, hd: (g.depth / 2) * scale }
}

/** Circumscribed radius of the plot rectangle — rotation-invariant bound. */
export function cemeteryPlotRadius(size: CemeterySize, scale: number): number {
  const { hw, hd } = cemeteryPlotExtents(size, scale)
  return Math.hypot(hw, hd)
}

/** Number of crypts / plain graves for a size (V2 class table). */
export function cemeteryCounts(size: CemeterySize): { graves: number, crypts: number } {
  const { graves, crypts } = CLASS_SPECS[size]
  return { graves, crypts }
}

/** Grave dig slots + marker poses, stable order (see module doc). Pure function of `(size, scale)`. */
export function cemeteryGraveLayout(size: CemeterySize, scale: number): CemeteryGraveSlot[] {
  const g = geometry(size)
  const { columns, graves } = g.spec
  const leftCols = Math.ceil(columns / 2)
  const salt = SIZE_SALT[size]
  const colX = (c: number): number =>
    (-g.innerWidth / 2 + GRAVE_DX / 2 + c * GRAVE_DX + (c >= leftCols ? AISLE : 0)) * scale
  const firstRowZ = -g.depth / 2 + MARGIN + TOMB_ROW + GRAVE_DZ / 2
  const out: CemeteryGraveSlot[] = []
  for (let r = 0; r < g.rows; r++) {
    const inRow = Math.min(columns, graves - r * columns)
    const startCol = Math.floor((columns - inRow) / 2)
    for (let k = 0; k < inRow; k++) {
      const index = out.length
      const jx = (hash01(index, salt + 1) * 2 - 1) * GRAVE_JITTER_X
      const jz = (hash01(index, salt + 2) * 2 - 1) * GRAVE_JITTER_Z
      const yaw = (hash01(index, salt + 3) * 2 - 1) * GRAVE_JITTER_YAW
      const x = colX(startCol + k) + jx * scale
      const z = (firstRowZ + r * GRAVE_DZ) * scale + jz * scale
      out.push({
        x,
        z,
        markerX: x,
        markerZ: z - MARKER_BEHIND_SLOT * scale,
        yaw,
      })
    }
  }
  return out
}

/** Crypt poses: centred in the back row, packed left to right with `TOMB_GAP` between footprints. */
export function cemeteryCryptLayout(size: CemeterySize, scale: number): CemeteryCryptPose[] {
  const g = geometry(size)
  const scales = CRYPT_SCALES[size]
  const widths = scales.map(cs => 2 * CEMETERY_PIECE_HALF_EXTENTS.Crypt.hx * cs)
  const total = widths.reduce((a, b) => a + b, 0) + TOMB_GAP * (widths.length - 1)
  const salt = SIZE_SALT[size] + 50
  const z0 = (-g.depth / 2 + MARGIN + TOMB_ROW / 2) * scale
  const out: CemeteryCryptPose[] = []
  let cursor = -total / 2
  for (let i = 0; i < scales.length; i++) {
    const w = widths[i]!
    out.push({
      x: (cursor + w / 2 + (hash01(i, salt + 1) * 2 - 1) * TOMB_JITTER_X) * scale,
      z: z0 + (hash01(i, salt + 2) * 2 - 1) * TOMB_JITTER_Z * scale,
      yaw: (hash01(i, salt + 3) * 2 - 1) * TOMB_JITTER_YAW,
      scale: scales[i]!,
    })
    cursor += w + TOMB_GAP
  }
  return out
}

const ACTIVE_WEIGHTS: ReadonlyArray<readonly [CemeteryMarkerPieceId, number]> = [
  ['Grave', 0.35],
  ['Gravestone', 0.25],
  ['Grave_Marker_A', 0.15],
  ['Grave_Marker_B', 0.15],
  ['Grave_Damaged', 0.1],
]
const ABANDONED_WEIGHTS: ReadonlyArray<readonly [CemeteryMarkerPieceId, number]> = [
  ['Grave_Damaged', 0.45],
  ['Grave', 0.2],
  ['Gravestone', 0.15],
  ['Grave_Marker_A', 0.1],
  ['Grave_Marker_B', 0.1],
]

/** Piece for slot `index`: deterministic from the landmark `variant` (0..1) and the slot index. */
export function pickCemeteryMarkerPiece(variant: number, index: number, abandoned: boolean): CemeteryMarkerPieceId {
  const roll = hash01(Math.floor(variant * 0xffffff), index * 7 + 11)
  let acc = 0
  const weights = abandoned ? ABANDONED_WEIGHTS : ACTIVE_WEIGHTS
  for (const [id, w] of weights) {
    acc += w
    if (roll < acc) return id
  }
  return weights[0]![0]
}

/** True for abandoned (wilderness) cemetery landmark ids — they use the damaged-heavy piece mix. */
export function isAbandonedCemeteryLandmarkId(id: string | undefined): boolean {
  return !!id && id.startsWith('cemetery:w:')
}

/** World-space rotate-then-translate of a local `(x, z)` offset — same convention as `rotateOffsetY` in
 *  `propUtils.ts` (kept inline so this module stays free of Three.js). */
export function cemeteryLocalToWorld(
  landmark: { x: number, z: number, rotationY: number },
  lx: number,
  lz: number,
): { x: number, z: number } {
  const cos = Math.cos(landmark.rotationY)
  const sin = Math.sin(landmark.rotationY)
  return { x: landmark.x + lx * cos + lz * sin, z: landmark.z - lx * sin + lz * cos }
}

export type CemeteryObb = { x: number, z: number, halfWidth: number, halfDepth: number, rotationY: number }

/**
 * Per-piece OBB colliders (Q39 plan §2.4): one per marker and per crypt, derived from the same layout and
 * piece choice the renderer uses. The plot itself has no collider (aisles stay walkable); dig slots lie
 * outside every marker OBB. `rotationY` follows `ObbCollider`'s convention (opposite handedness to three's
 * yaw), hence the negation.
 */
export function cemeteryObbColliders(landmark: {
  id?: string
  x: number
  z: number
  rotationY: number
  scale: number
  variant: number
  cemeterySize?: CemeterySize
}): CemeteryObb[] {
  const size = landmark.cemeterySize ?? 'SM'
  const abandoned = isAbandonedCemeteryLandmarkId(landmark.id)
  const out: CemeteryObb[] = []
  const slots = cemeteryGraveLayout(size, landmark.scale)
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!
    const piece = pickCemeteryMarkerPiece(landmark.variant, i, abandoned)
    const half = CEMETERY_PIECE_HALF_EXTENTS[piece]
    const w = cemeteryLocalToWorld(landmark, slot.markerX, slot.markerZ)
    out.push({
      x: w.x,
      z: w.z,
      halfWidth: half.hx * landmark.scale,
      halfDepth: half.hz * landmark.scale,
      rotationY: -(landmark.rotationY + slot.yaw),
    })
  }
  const crypt = CEMETERY_PIECE_HALF_EXTENTS.Crypt
  for (const c of cemeteryCryptLayout(size, landmark.scale)) {
    const w = cemeteryLocalToWorld(landmark, c.x, c.z)
    out.push({
      x: w.x,
      z: w.z,
      halfWidth: crypt.hx * c.scale * landmark.scale,
      halfDepth: crypt.hz * c.scale * landmark.scale,
      rotationY: -(landmark.rotationY + c.yaw),
    })
  }
  return out
}

/** Distance from world point `(px, pz)` to the plot rectangle (0 when inside) — exact, rotation-aware. */
export function cemeteryPlotDistanceToPoint(
  plot: { x: number, z: number, rotationY: number, size: CemeterySize, scale: number },
  px: number,
  pz: number,
): number {
  const { hw, hd } = cemeteryPlotExtents(plot.size, plot.scale)
  const cos = Math.cos(plot.rotationY)
  const sin = Math.sin(plot.rotationY)
  const dx = px - plot.x
  const dz = pz - plot.z
  // Inverse of `cemeteryLocalToWorld`.
  const lx = dx * cos - dz * sin
  const lz = dx * sin + dz * cos
  return Math.hypot(Math.max(Math.abs(lx) - hw, 0), Math.max(Math.abs(lz) - hd, 0))
}

/** Distance from the plot rectangle to the world segment `(ax,az)-(bx,bz)` (0 when they intersect). Exact:
 *  the segment is moved into the plot's frame, where the rectangle is axis-aligned. */
export function cemeteryPlotDistanceToSegment(
  plot: { x: number, z: number, rotationY: number, size: CemeterySize, scale: number },
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const { hw, hd } = cemeteryPlotExtents(plot.size, plot.scale)
  const cos = Math.cos(plot.rotationY)
  const sin = Math.sin(plot.rotationY)
  const toLocal = (x: number, z: number) => ({ x: (x - plot.x) * cos - (z - plot.z) * sin, z: (x - plot.x) * sin + (z - plot.z) * cos })
  const a = toLocal(ax, az)
  const b = toLocal(bx, bz)
  // Slab clip: does the segment intersect the rectangle?
  let t0 = 0
  let t1 = 1
  for (const [o, d, h] of [[a.x, b.x - a.x, hw], [a.z, b.z - a.z, hd]] as const) {
    if (Math.abs(d) < 1e-9) {
      if (Math.abs(o) > h) { t0 = 2; break }
    } else {
      let u0 = (-h - o) / d
      let u1 = (h - o) / d
      if (u0 > u1) [u0, u1] = [u1, u0]
      t0 = Math.max(t0, u0)
      t1 = Math.min(t1, u1)
      if (t0 > t1) break
    }
  }
  if (t0 <= t1) return 0
  const pointToRect = (p: { x: number, z: number }) => Math.hypot(Math.max(Math.abs(p.x) - hw, 0), Math.max(Math.abs(p.z) - hd, 0))
  const pointToSeg = (px: number, pz: number) => {
    const dx = b.x - a.x
    const dz = b.z - a.z
    const len2 = dx * dx + dz * dz
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (pz - a.z) * dz) / len2))
    return Math.hypot(px - (a.x + t * dx), pz - (a.z + t * dz))
  }
  let best = Math.min(pointToRect(a), pointToRect(b))
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) best = Math.min(best, pointToSeg(sx * hw, sz * hd))
  return best
}
