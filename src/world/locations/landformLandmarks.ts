import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import type { WorldLocationLandformSubtype } from './worldLocationTypes'
import { landformDescriptorsOf, rangeSpinesFor } from '../../terrain/chunkHeightmap'
import { rangeSummitPosition } from '../../terrain/rangeSpines'

/**
 * Macro-relief landmarks as catalog sources (plan world-041 L1, §3): the 060 point landforms (crag, crater, lake island)
 * and the range-spine summits. Pure, seed-derived and tiny (a handful per world), so the catalog lists them by scanning
 * this array — no coarse-grid pass, no persisted state.
 *
 * Ids are `landform:<subtype>:<key>`: `key` is the descriptor's cell key (`lf:crag:16_8` → `16_8`) or, for a spine
 * summit, `<spine cell key>:<summit index>` (`rs:6_-7` summit 1 → `6_-7:1`) — both come from seed-quantized
 * generator cells, never from a list ordinal of the whole world.
 *
 * @domain world-locations
 */

export type LandformLandmark = {
  id: string
  subtype: WorldLocationLandformSubtype
  x: number
  z: number
  /** Footprint radius (m): descriptor radius, or ~1.5 σ along the spine for a summit. */
  radius: number
}

const SUMMIT_FOOTPRINT_SIGMAS = 1.5

/** All landform landmarks of a world; empty for worlds without a finite continent. */
export function landformLandmarksOf(params: RawSampleParams): readonly LandformLandmark[] {
  const out: LandformLandmark[] = []
  for (const d of landformDescriptorsOf(params)) {
    // `lf:<kind>:<cellKey>` → `landform:<kind>:<cellKey>`.
    out.push({ id: `landform:${d.id.slice(3)}`, subtype: d.kind, x: d.centreX, z: d.centreZ, radius: d.radius })
  }
  const region = (params as { region?: RawSampleParams['region'] }).region
  if (region?.continentMask) {
    for (const spine of rangeSpinesFor(params.seed, region).spines) {
      const spineKey = spine.id.startsWith('rs:') ? spine.id.slice(3) : spine.id
      spine.summits.forEach((summit, k) => {
        const { x, z } = rangeSummitPosition(spine, summit)
        out.push({ id: `landform:spineSummit:${spineKey}:${k}`, subtype: 'spineSummit', x, z, radius: summit.sigma * SUMMIT_FOOTPRINT_SIGMAS })
      })
    }
  }
  return out
}

/** Parses `landform:<subtype>:<key>` into its subtype; `null` when malformed. */
export function landformSubtypeFromId(id: string): WorldLocationLandformSubtype | null {
  const parts = id.split(':')
  if (parts[0] !== 'landform' || parts.length < 3) return null
  const subtype = parts[1]
  return subtype === 'crag' || subtype === 'crater' || subtype === 'lakeIsland' || subtype === 'spineSummit' ? subtype : null
}

/** Whether a coarse `mountainPeak` candidate stands inside a spine-summit footprint (one summit = one entry, plan §3). */
export function insideSpineSummitFootprint(landmarks: readonly LandformLandmark[], x: number, z: number): boolean {
  for (const l of landmarks) {
    if (l.subtype === 'spineSummit' && Math.hypot(x - l.x, z - l.z) <= l.radius) return true
  }
  return false
}
