import type { EnvironmentPlacement } from './chunkEnvironment'
import type { ChunkCoord } from './chunkGrid'
import { createSeededRandom } from '../world/parseSeed'
import { type ChunkTileParams, landformIndexOf } from './chunkHeightmap'

/**
 * Angular rock outcrops (plan world-terrain-060 R3 correction 5, author 2026-11-06): large, irregular, grey faceted rocks
 * that stand 1–6 m above the ground on crag tops and in range-summit zones. Purely decorative `rockOutcrop` placements
 * (no `resourceId`, not mineable, never landmarks) — relief is untouched, so no height cache is affected; only the chunk
 * tile's environment list changes.
 *
 * Determinism: crag outcrops are seeded by the **descriptor id** (not the chunk) and each chunk emits only the ones that
 * fall inside it, so a crag straddling a chunk border is identical however the chunks load. Summit-zone outcrops use a
 * per-chunk RNG like the other environment scatter.
 *
 * @domain world-terrain
 */

/** Outcrops per crag: a rocky crown, not a field. */
const CRAG_OUTCROPS_MIN = 5
const CRAG_OUTCROPS_SPAN = 5
/** Crag outcrops sit on the bare top (rock weight is 1 for t < 0.15 and fades by 0.5 — see `landformRockAt`). */
const CRAG_OUTCROP_MAX_T = 0.45
/** Outcrop height range in metres (author: 1–6 m). */
export const OUTCROP_MIN_HEIGHT_M = 1
export const OUTCROP_MAX_HEIGHT_M = 6
/** Summit zone = high, rocky ground (summits are soft-capped at 66–82 m; the lowland tree line is far below). */
const SUMMIT_ZONE_MIN_H = 46
const SUMMIT_ZONE_MIN_RIDGE = 0.6
const SUMMIT_CANDIDATES_PER_CHUNK = 5
const SUMMIT_CHANCE = 0.55
/** For `scripts/perf/census-outcrops.ts`. */
export const SUMMIT_ZONE_MIN_H_FOR_CENSUS = SUMMIT_ZONE_MIN_H
export const SUMMIT_ZONE_MIN_RIDGE_FOR_CENSUS = SUMMIT_ZONE_MIN_RIDGE
/** Expected summit-zone outcrops per m² of qualifying ground (candidates × chance ÷ chunk area of 64 × 64 m). */
export const SUMMIT_EXPECTED_PER_M2 = (SUMMIT_CANDIDATES_PER_CHUNK * SUMMIT_CHANCE) / (64 * 64)
const ROAD_TINT_REJECT = 0.25
const SALT_CRAG = 0x6f1c3a5
const SALT_SUMMIT = 0x2b9d7e1

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

type Grids = {
  /** Terrain height (m) at a world point. */
  heightAt: (x: number, z: number) => number
  ridgeAt: (x: number, z: number) => number
  roadTintAt: (x: number, z: number) => number
}

/** Outcrop placements of one chunk. `half` = chunkSize / 2. */
export function computeRockOutcrops(coord: ChunkCoord, params: ChunkTileParams, g: Grids): EnvironmentPlacement[] {
  const { chunkSize, waterLevel } = params
  const half = chunkSize / 2
  const x0 = coord.cx * chunkSize - half
  const z0 = coord.cz * chunkSize - half
  const inChunk = (x: number, z: number) => x >= x0 && x < x0 + chunkSize && z >= z0 && z < z0 + chunkSize
  const out: EnvironmentPlacement[] = []
  const dry = (x: number, z: number) => g.heightAt(x, z) > waterLevel + 0.3 && g.roadTintAt(x, z) <= ROAD_TINT_REJECT

  // Crag tops (landform descriptors; far from the chunk → skipped by the cheap bounds test).
  for (const d of landformIndexOf(params).all) {
    if (d.kind !== 'crag') continue
    const reach = d.radius * CRAG_OUTCROP_MAX_T
    if (d.centreX + reach < x0 || d.centreX - reach > x0 + chunkSize || d.centreZ + reach < z0 || d.centreZ - reach > z0 + chunkSize) continue
    const rand = createSeededRandom((params.seed ^ SALT_CRAG ^ hashString(d.id)) >>> 0)
    const n = CRAG_OUTCROPS_MIN + Math.floor(rand() * CRAG_OUTCROPS_SPAN)
    for (let i = 0; i < n; i++) {
      // Always consume the same draws so a rejected outcrop never shifts the others.
      const a = rand() * Math.PI * 2
      const r = Math.sqrt(rand()) * reach
      const height = OUTCROP_MIN_HEIGHT_M + rand() * (OUTCROP_MAX_HEIGHT_M - OUTCROP_MIN_HEIGHT_M)
      const rotationY = rand() * Math.PI * 2
      const variant = rand()
      const x = d.centreX + Math.cos(a) * r
      const z = d.centreZ + Math.sin(a) * r
      if (!inChunk(x, z) || !dry(x, z)) continue
      out.push({ x, z, kind: 'rockOutcrop', scale: height, rotationY, variant })
    }
  }

  // Summit zones: high rocky ground.
  const random = createSeededRandom((params.seed ^ SALT_SUMMIT ^ Math.imul(coord.cx, 73856093) ^ Math.imul(coord.cz, 19349663)) >>> 0)
  for (let i = 0; i < SUMMIT_CANDIDATES_PER_CHUNK; i++) {
    const x = x0 + random() * chunkSize
    const z = z0 + random() * chunkSize
    const accept = random()
    const height = OUTCROP_MIN_HEIGHT_M + random() * (OUTCROP_MAX_HEIGHT_M - OUTCROP_MIN_HEIGHT_M)
    const rotationY = random() * Math.PI * 2
    const variant = random()
    if (accept > SUMMIT_CHANCE) continue
    if (g.heightAt(x, z) < SUMMIT_ZONE_MIN_H || g.ridgeAt(x, z) < SUMMIT_ZONE_MIN_RIDGE || !dry(x, z)) continue
    out.push({ x, z, kind: 'rockOutcrop', scale: height, rotationY, variant })
  }
  return out
}
