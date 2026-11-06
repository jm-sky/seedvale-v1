// world-terrain-064 W1: derived cascade/waterfall sites on the installed global river chains.
// Pure and derived: nothing here changes terrain, hydrology, settlements or roads. Consumers (063 settlement footprints,
// the road crossing owner, the W2 presentation, the world-041 catalog) read sites and reserves through this module only.
import { widthFromAccumulation } from './riverNetwork'
import { isUnconditionedHydrologyId, worldHydrologyFor } from './worldHydrologyStore'

/** Slope (rise per metre) of a chain segment that counts as part of a steep reach (one rule for detector and renderer). */
export const CASCADE_SLOPE_MIN = 0.25
/** Steep runs on one chain separated by less gentle flow than this (metres along the chain) merge into one site. */
export const CASCADE_MERGE_GAP_M = 30
/** Minimum drop (metres, shipped chain elevation) for a site to exist. */
export const CASCADE_MIN_DROP_M = 2
/** Minimum drop for the `landmark` tier. */
export const LANDMARK_MIN_DROP_M = 10
/** Landmark spacing: within this radius only the largest landmark-eligible site stays `landmark`. */
export const LANDMARK_SPACING_M = 300
/** Lip position quantization for the positional id. */
export const WATERFALL_ID_CELL_M = 16
/** Reserve half-width around the top→bottom polyline: `max(RESERVE_MIN_M, widthM + RESERVE_WIDTH_PAD_M)`. */
export const RESERVE_MIN_M = 12
export const RESERVE_WIDTH_PAD_M = 8
/** Pool disc radius at the bottom of a landmark site. */
export const LANDMARK_POOL_RADIUS_M = 20

const INDEX_CELL_M = 64

export type WaterfallTier = 'landmark' | 'minor'
export type WaterfallSiteId = `waterfall:${number}_${number}`

export type WaterfallPoint = { x: number, z: number, water: number }

export type WaterfallSite = {
  /** Positional id from the lip quantized to {@link WATERFALL_ID_CELL_M}; stable under unrelated chain changes. */
  id: WaterfallSiteId
  tier: WaterfallTier
  top: WaterfallPoint
  bottom: WaterfallPoint
  dropM: number
  lengthM: number
  widthM: number
  /** Runtime-only (pack order of the installed chains) — never persisted, never an identity. */
  chainIndex: number
  offsetTopM: number
  offsetBottomM: number
}

type SiteIndex = {
  sites: readonly WaterfallSite[]
  cells: Map<number, WaterfallSite[]>
}

const indexByHydrology = new WeakMap<object, SiteIndex>()
const EMPTY_INDEX: SiteIndex = { sites: [], cells: new Map() }

export function waterfallReserveHalfWidth(site: Pick<WaterfallSite, 'widthM'>): number {
  return Math.max(RESERVE_MIN_M, site.widthM + RESERVE_WIDTH_PAD_M)
}

function waterfallIdOf(x: number, z: number): WaterfallSiteId {
  return `waterfall:${Math.floor(x / WATERFALL_ID_CELL_M)}_${Math.floor(z / WATERFALL_ID_CELL_M)}`
}

function reserveRadius(site: WaterfallSite): number {
  const r = waterfallReserveHalfWidth(site)
  return site.tier === 'landmark' ? Math.max(r, LANDMARK_POOL_RADIUS_M) : r
}

function cellKey(cx: number, cz: number): number {
  return (cx + 32768) * 65536 + (cz + 32768)
}

function distToSegmentSq(px: number, pz: number, ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax
  const dz = bz - az
  const len2 = dx * dx + dz * dz
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2)) : 0
  const ex = ax + dx * t - px
  const ez = az + dz * t - pz
  return ex * ex + ez * ez
}

/** Whether a point lies in this site's reserve: the buffered top→bottom polyline, plus the pool disc for landmarks. */
function siteReservesPoint(site: WaterfallSite, x: number, z: number): boolean {
  const half = waterfallReserveHalfWidth(site)
  if (distToSegmentSq(x, z, site.top.x, site.top.z, site.bottom.x, site.bottom.z) <= half * half) return true
  if (site.tier !== 'landmark') return false
  const dx = x - site.bottom.x
  const dz = z - site.bottom.z
  return dx * dx + dz * dz <= LANDMARK_POOL_RADIUS_M * LANDMARK_POOL_RADIUS_M
}

type ChainPoint = { x: number, z: number, elevation: number, accumulation: number }
type Run = { start: number, end: number }

/**
 * Pure detector over chains given as point lists (exported for tests with synthetic chains). Steep runs merge across
 * short gentle gaps, sites below the minimum drop are dropped, tiers are assigned by drop and spacing, id collisions
 * keep the larger drop. Result is sorted by id for determinism.
 */
export function detectWaterfallSites(chains: readonly (readonly ChainPoint[])[]): WaterfallSite[] {
  const raw: WaterfallSite[] = []
  chains.forEach((pts, chainIndex) => {
    if (pts.length < 2) return
    const along: number[] = [0]
    for (let i = 1; i < pts.length; i++) along.push(along[i - 1]! + Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z))
    const runs: Run[] = []
    let run: Run | null = null
    for (let i = 1; i < pts.length; i++) {
      const dist = along[i]! - along[i - 1]! || 1
      const slope = (pts[i - 1]!.elevation - pts[i]!.elevation) / dist
      if (slope >= CASCADE_SLOPE_MIN) {
        if (run) run.end = i
        else {
          run = { start: i - 1, end: i }
          runs.push(run)
        }
      } else run = null
    }
    const merged: Run[] = []
    for (const r of runs) {
      const last = merged[merged.length - 1]
      if (last && along[r.start]! - along[last.end]! < CASCADE_MERGE_GAP_M) last.end = r.end
      else merged.push({ ...r })
    }
    for (const r of merged) {
      const a = pts[r.start]!
      const b = pts[r.end]!
      const dropM = a.elevation - b.elevation
      if (dropM < CASCADE_MIN_DROP_M) continue
      raw.push({
        id: waterfallIdOf(a.x, a.z),
        tier: 'minor',
        top: { x: a.x, z: a.z, water: a.elevation },
        bottom: { x: b.x, z: b.z, water: b.elevation },
        dropM,
        lengthM: along[r.end]! - along[r.start]!,
        widthM: widthFromAccumulation(Math.max(a.accumulation, b.accumulation)),
        chainIndex,
        offsetTopM: along[r.start]!,
        offsetBottomM: along[r.end]!,
      })
    }
  })

  // Id collisions (two lips in one 16 m cell): keep the larger drop (ties: lower chain index, then offset).
  const byId = new Map<string, WaterfallSite>()
  for (const s of raw) {
    const prev = byId.get(s.id)
    if (!prev || s.dropM > prev.dropM || (s.dropM === prev.dropM && (s.chainIndex < prev.chainIndex || (s.chainIndex === prev.chainIndex && s.offsetTopM < prev.offsetTopM)))) byId.set(s.id, s)
  }
  const sites = [...byId.values()]

  // Landmark tier: drop ≥ 10 m and the largest eligible site within the spacing radius (greedy by drop desc, id asc).
  const eligible = sites.filter((s) => s.dropM >= LANDMARK_MIN_DROP_M).sort((x, y) => y.dropM - x.dropM || (x.id < y.id ? -1 : 1))
  const accepted: WaterfallSite[] = []
  for (const s of eligible) {
    if (accepted.every((o) => Math.hypot(o.top.x - s.top.x, o.top.z - s.top.z) >= LANDMARK_SPACING_M)) {
      s.tier = 'landmark'
      accepted.push(s)
    }
  }
  return sites.sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0))
}

function buildIndex(sites: readonly WaterfallSite[]): SiteIndex {
  const cells = new Map<number, WaterfallSite[]>()
  for (const s of sites) {
    const r = reserveRadius(s)
    const minX = Math.floor((Math.min(s.top.x, s.bottom.x) - r) / INDEX_CELL_M)
    const maxX = Math.floor((Math.max(s.top.x, s.bottom.x) + r) / INDEX_CELL_M)
    const minZ = Math.floor((Math.min(s.top.z, s.bottom.z) - r) / INDEX_CELL_M)
    const maxZ = Math.floor((Math.max(s.top.z, s.bottom.z) + r) / INDEX_CELL_M)
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cz = minZ; cz <= maxZ; cz++) {
        const k = cellKey(cx, cz)
        const list = cells.get(k)
        if (list) list.push(s)
        else cells.set(k, [s])
      }
    }
  }
  return { sites, cells }
}

function indexFor(hydrologyId: string): SiteIndex {
  if (isUnconditionedHydrologyId(hydrologyId)) return EMPTY_INDEX
  const data = worldHydrologyFor(hydrologyId)
  let index = indexByHydrology.get(data)
  if (!index) {
    const { offsets, points } = data.chains
    const chains: ChainPoint[][] = []
    for (let i = 0; i + 1 < offsets.length; i++) {
      const pts: ChainPoint[] = []
      for (let p = offsets[i]!; p < offsets[i + 1]!; p++) {
        pts.push({ x: points[p * 4]!, z: points[p * 4 + 1]!, elevation: points[p * 4 + 2]!, accumulation: points[p * 4 + 3]! })
      }
      chains.push(pts)
    }
    index = buildIndex(detectWaterfallSites(chains))
    indexByHydrology.set(data, index)
  }
  return index
}

/**
 * All cascade/waterfall sites of an installed hydrology, sorted by id. Memoized per hydrology data (dropped with the
 * install). Empty for unconditioned ids; throws when `hydrologyId` is not installed.
 */
export function waterfallSitesOf(hydrologyId: string): readonly WaterfallSite[] {
  return indexFor(hydrologyId).sites
}

/** Whether `(x, z)` lies inside any site's reserved footprint (minor and landmark). */
export function isInWaterfallReserve(hydrologyId: string, x: number, z: number): boolean {
  const list = indexFor(hydrologyId).cells.get(cellKey(Math.floor(x / INDEX_CELL_M), Math.floor(z / INDEX_CELL_M)))
  return !!list && list.some((s) => siteReservesPoint(s, x, z))
}

/** Sites whose reserve (polyline buffer or pool disc) may intersect the axis-aligned rectangle. */
export function waterfallReservesIn(hydrologyId: string, rect: { minX: number, maxX: number, minZ: number, maxZ: number }): WaterfallSite[] {
  const index = indexFor(hydrologyId)
  const out = new Set<WaterfallSite>()
  for (let cx = Math.floor(rect.minX / INDEX_CELL_M); cx <= Math.floor(rect.maxX / INDEX_CELL_M); cx++) {
    for (let cz = Math.floor(rect.minZ / INDEX_CELL_M); cz <= Math.floor(rect.maxZ / INDEX_CELL_M); cz++) {
      for (const s of index.cells.get(cellKey(cx, cz)) ?? []) {
        const r = reserveRadius(s)
        if (Math.max(s.top.x, s.bottom.x) + r < rect.minX || Math.min(s.top.x, s.bottom.x) - r > rect.maxX) continue
        if (Math.max(s.top.z, s.bottom.z) + r < rect.minZ || Math.min(s.top.z, s.bottom.z) - r > rect.maxZ) continue
        out.add(s)
      }
    }
  }
  return [...out].sort((x, y) => (x.id < y.id ? -1 : 1))
}

/** Whether a point lies in the reserve of a specific site (for census intersection reporting). */
export function siteReservesPointAt(site: WaterfallSite, x: number, z: number): boolean {
  return siteReservesPoint(site, x, z)
}
