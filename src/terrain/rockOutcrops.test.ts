import { describe, expect, it } from 'vitest'
import { type ChunkTileParams } from './chunkHeightmap'
import { computeRockOutcrops, OUTCROP_MAX_HEIGHT_M, OUTCROP_MIN_HEIGHT_M } from './rockOutcrops'

// No `region` → no landform index (crag outcrops are covered by the landform census); this tests the summit-zone rule.
const params = { seed: 42, chunkSize: 64, waterLevel: 0.45 } as unknown as ChunkTileParams
const high = { heightAt: () => 60, ridgeAt: () => 0.9, roadTintAt: () => 0 }

describe('rock outcrops (summit zone)', () => {
  it('is deterministic per chunk and stays inside the chunk with 1–6 m heights', () => {
    const a = computeRockOutcrops({ cx: 3, cz: -2 }, params, high)
    expect(a).toEqual(computeRockOutcrops({ cx: 3, cz: -2 }, params, high))
    expect(a.length).toBeGreaterThan(0)
    for (const p of a) {
      expect(p.kind).toBe('rockOutcrop')
      expect(p.resourceId).toBeUndefined() // decorative, never mineable
      expect(p.id).toBeUndefined() // never a landmark
      expect(p.x).toBeGreaterThanOrEqual(3 * 64 - 32)
      expect(p.x).toBeLessThan(3 * 64 + 32)
      expect(p.scale).toBeGreaterThanOrEqual(OUTCROP_MIN_HEIGHT_M)
      expect(p.scale).toBeLessThanOrEqual(OUTCROP_MAX_HEIGHT_M)
    }
  })

  it('places nothing on lowland, soft ridges, roads or water', () => {
    const at = (over: Partial<typeof high>) => computeRockOutcrops({ cx: 3, cz: -2 }, params, { ...high, ...over })
    expect(at({ heightAt: () => 20 })).toHaveLength(0)
    expect(at({ ridgeAt: () => 0.2 })).toHaveLength(0)
    expect(at({ roadTintAt: () => 0.9 })).toHaveLength(0)
    expect(at({ heightAt: () => 0.5 })).toHaveLength(0)
  })
})
