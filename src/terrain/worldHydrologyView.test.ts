import { afterEach, describe, expect, it } from 'vitest'
import type { RawSampleParams } from './chunkHeightmap'
import type { WorldHydrology } from './worldHydrology'
import { clipChainToRect } from './riverChainClip'
import { computeRiverTile, RIVER_TILE_SIZE, riverTileCoreRect } from './riverNetwork'
import { clearWorldHydrology, hydrologyCorrectionAt, installWorldHydrology, SPARSE_BLOCK_SIZE, UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

const B = SPARSE_BLOCK_SIZE

/** 2×2-block grid (128² cells, 8 m) with one block of correction and one chain crossing tile (0,0)→(1,0). */
function fakeHydrology(): WorldHydrology {
  const data = new Float32Array(B * B)
  data[3 * B + 5] = -2 // cell (5, 3)
  data[3 * B + 6] = 1 // cell (6, 3)
  return {
    version: 1,
    cellStep: 8,
    size: 2 * B,
    originX: 0,
    originZ: 0,
    correction: { blocksPerRow: 2, blockIds: Uint32Array.from([0]), data },
    basin: { blocksPerRow: 2, blockIds: new Uint32Array(0), data: new Uint16Array(0) },
    lakes: [],
    chains: {
      points: Float32Array.from([100, 100, 5, 10, 400, 100, 3, 20]),
      offsets: Uint32Array.from([0, 2]),
      flags: Uint8Array.from([0]),
    },
    stats: {} as WorldHydrology['stats'],
  }
}

afterEach(() => clearWorldHydrology())

describe('hydrology correction', () => {
  it('equals the stored value at cell centres and interpolates between them', () => {
    installWorldHydrology('fake', fakeHydrology())
    expect(hydrologyCorrectionAt('fake', 5 * 8, 3 * 8)).toBeCloseTo(-2)
    expect(hydrologyCorrectionAt('fake', 6 * 8, 3 * 8)).toBeCloseTo(1)
    // Catmull-Rom between -2 and 1 with zero neighbours (bilinear would give -0.5).
    expect(hydrologyCorrectionAt('fake', 5.5 * 8, 3 * 8)).toBeCloseTo(-0.5625)
    expect(hydrologyCorrectionAt('fake', 100, 500)).toBe(0)
    expect(hydrologyCorrectionAt('fake', -50, -50)).toBe(0)
  })

  it('has no slope break on cell lines (C¹, plan world-terrain-065)', () => {
    installWorldHydrology('fake', fakeHydrology())
    const z = 3 * 8 + 2.3
    for (const lineX of [5 * 8, 6 * 8]) {
      const e = 1e-3
      const left = (hydrologyCorrectionAt('fake', lineX, z) - hydrologyCorrectionAt('fake', lineX - e, z)) / e
      const right = (hydrologyCorrectionAt('fake', lineX + e, z) - hydrologyCorrectionAt('fake', lineX, z)) / e
      expect(Math.abs(right - left)).toBeLessThan(1e-2)
    }
  })

  it('is zero for unconditioned ids and throws for a missing id', () => {
    expect(hydrologyCorrectionAt(UNCONDITIONED_HYDROLOGY_ID, 1, 1)).toBe(0)
    expect(hydrologyCorrectionAt('unconditioned', 1, 1)).toBe(0)
    expect(() => hydrologyCorrectionAt('missing', 1, 1)).toThrow(/not installed/)
  })
})

describe('river tile view of global chains', () => {
  it('clips a chain at the tile core rect with interpolated boundary points', () => {
    const rect = { minX: 0, maxX: 256, minZ: 0, maxZ: 256 }
    const [piece] = clipChainToRect({ points: [{ x: 100, z: 100, elevation: 5, accumulation: 10 }, { x: 400, z: 100, elevation: 3, accumulation: 20 }] }, rect)
    expect(piece!.points).toHaveLength(2)
    const end = piece!.points[1]!
    expect(end.x).toBeCloseTo(256)
    expect(end.elevation).toBeCloseTo(5 - (156 / 300) * 2)
    expect(end.accumulation).toBeCloseTo(10 + (156 / 300) * 10)
  })

  it('returns adjacent tile pieces that join at the shared edge, and nothing for empty tiles', () => {
    installWorldHydrology('fake', fakeHydrology())
    const params = { hydrologyId: 'fake' } as RawSampleParams
    const a = computeRiverTile({ tx: 0, tz: 0 }, params)
    const b = computeRiverTile({ tx: 1, tz: 0 }, params)
    expect(a).toHaveLength(1)
    expect(b).toHaveLength(1)
    const aEnd = a[0]!.points.at(-1)!
    const bStart = b[0]!.points[0]!
    expect(aEnd.x).toBeCloseTo(RIVER_TILE_SIZE)
    expect(bStart.x).toBeCloseTo(aEnd.x)
    expect(bStart.elevation).toBeCloseTo(aEnd.elevation)
    expect(computeRiverTile({ tx: 0, tz: 3 }, params)).toEqual([])
    expect(riverTileCoreRect({ tx: 0, tz: 0 }).maxX).toBe(RIVER_TILE_SIZE)
  })
})
