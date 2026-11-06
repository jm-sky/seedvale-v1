import { describe, expect, it } from 'vitest'
import type { RawSampleParams } from './chunkHeightmap'
import {
  canonicalWaterHeight,
  computeRiverTile,
  DEFAULT_RIVER_THRESHOLDS,
  depthFromAccumulation,
  exposedBankFromFlow,
  footprintOverlapsRiver,
  nearestRiverBankDistance,
  nearestRiverBankPoint,
  nearestRiverHydrologyContext,
  nearestRiverShoreCandidate,
  overlappingRiverTiles,
  RIVER_TILE_SIZE,
  type RiverChain,
  riverChannelSegmentsNear,
  type RiverPoint,
  riverTileCoordOf,
  riverTileCoreRect,
  riverTileKey,
  widthFromAccumulation,
} from './riverNetwork'
import { withWindowHydrology } from './testWindowHydrology'
import { UNCONDITIONED_HYDROLOGY_ID } from './worldHydrologyStore'

/** Defaults aligned with `worldConfig` base terrain (plan 062/181). */
function rawParams(seed: number, overrides: Partial<RawSampleParams> = {}): RawSampleParams {
  return {
    seed,
    hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
    heightScale: 18,
    waterLevel: 0.45,
    noiseScale: 105,
    detailAmplitude: 0.65,
    hillsScale: 420,
    hillsAmplitude: 0.34,
    hillsFbm: { octaves: 3, persistence: 0.55, lacunarity: 2.0, exponentiation: 1.15 },
    fbm: { octaves: 4, persistence: 0.65, lacunarity: 2.0, exponentiation: 1.35 },
    biome: {
      noiseScale: 96,
      fbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
    },
    region: {
      continentScale: 2200,
      continentFbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
      mountainScale: 1800,
      mountainFbm: { octaves: 2, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.2 },
      mountainThreshold: 0.62,
      mountainThresholdWidth: 0.2,
      worleyCellSize: 400,
      ridgeSharpness: 1.4,
      mountainGain: 0.88,
      oceanThreshold: 0.32,
      coastThreshold: 0.45,
      oceanDetailWeight: 0.25,
      moistureRegionScale: 2000,
      moistureRegionFbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
      desertThreshold: 0.35,
      desertThresholdWidth: 0.12,
      swampThreshold: 0.72,
      swampThresholdWidth: 0.15,
      roadNetwork: {
        roadHalfWidth: 5,
        roadHeightStrength: 0.85,
        roadTintStrength: 0.8,
        pathHalfWidth: 1.5,
        pathHeightStrength: 0.2,
        pathTintStrength: 0.4,
        smoothingWindow: 10,
        maxNeighborRoads: 3,
        dockSearchRadius: 140,
        edgeWobbleAmplitude: 0.15,
        edgeWobbleScale: 0.06,
        potholeDepth: 0.12,
        potholeThreshold: 0.72,
        meanderAmplitude: 2,
        meanderScale: 0.04,
        surfaceDetailEnabled: true,
        rutDepth: 0.05,
        rutOffsetFraction: 0.42,
        rutWidthFraction: 0.16,
        microBumpStrength: 0.025,
        microBumpScale: 0.6,
      },
      village: {
        coreRadius: 9,
        houseRadius: 4.5,
        heightStrength: 0.8,
        tintStrength: 0.75,
        regionalHeightStrengthFlat: 0.3,
        regionalHeightStrengthMountain: 0.15,
      },
    },
    ...overrides,
  }
}

function chainsWithinCore(chains: RiverChain[], rect: ReturnType<typeof riverTileCoreRect>): boolean {
  return chains.every((chain) =>
    chain.points.every((p) => p.x >= rect.minX - 1e-6 && p.x <= rect.maxX + 1e-6 && p.z >= rect.minZ - 1e-6 && p.z <= rect.maxZ + 1e-6),
  )
}

describe('riverNetwork tile math', () => {
  it('maps world points to a tile grid with no gaps/overlaps', () => {
    expect(riverTileCoordOf(0, 0)).toEqual({ tx: 0, tz: 0 })
    expect(riverTileCoordOf(RIVER_TILE_SIZE - 1, 0)).toEqual({ tx: 0, tz: 0 })
    expect(riverTileCoordOf(RIVER_TILE_SIZE, 0)).toEqual({ tx: 1, tz: 0 })
    expect(riverTileCoordOf(-1, 0)).toEqual({ tx: -1, tz: 0 })
  })

  it('produces a unique key per tile', () => {
    expect(riverTileKey({ tx: 1, tz: -2 })).not.toBe(riverTileKey({ tx: -2, tz: 1 }))
  })

  it('finds every tile overlapping a small chunk rect, at most 4', () => {
    const rect = { minX: -1, maxX: 63, minZ: -1, maxZ: 63 } // straddles all 4 quadrants around origin
    const tiles = overlappingRiverTiles(rect)
    expect(tiles.length).toBeGreaterThanOrEqual(1)
    expect(tiles.length).toBeLessThanOrEqual(4)
  })

  it('finds exactly one tile for a rect fully inside one tile core', () => {
    const tiles = overlappingRiverTiles({ minX: 10, maxX: 20, minZ: 10, maxZ: 20 })
    expect(tiles).toEqual([{ tx: 0, tz: 0 }])
  })
})

describe('widthFromAccumulation', () => {
  it('is zero below the stream threshold and grows with accumulation, bounded', () => {
    expect(widthFromAccumulation(0)).toBe(0)
    expect(widthFromAccumulation(DEFAULT_RIVER_THRESHOLDS.stream - 1)).toBe(0)
    const small = widthFromAccumulation(DEFAULT_RIVER_THRESHOLDS.stream + 5)
    const big = widthFromAccumulation(1000)
    expect(small).toBeGreaterThan(0)
    expect(big).toBeGreaterThan(small)
    expect(big).toBeLessThanOrEqual(14)
  })
})

describe('computeRiverTile', () => {
  // Window hydrology covers river tiles −2..1 on both axes (see `testWindowHydrology.ts`).
  const TILES = [{ tx: -2, tz: -2 }, { tx: -1, tz: -1 }, { tx: 0, tz: 0 }, { tx: 1, tz: -1 }, { tx: -2, tz: 1 }]

  it('returns no rivers for the unconditioned (raw floor, no water network) id', () => {
    expect(computeRiverTile({ tx: 0, tz: 0 }, rawParams(42))).toEqual([])
  })

  it('is deterministic and survives the structured-clone round trip', () => {
    const params = withWindowHydrology(rawParams(42))
    const a = computeRiverTile({ tx: 0, tz: 0 }, params)
    expect(computeRiverTile({ tx: 0, tz: 0 }, params)).toEqual(a)
    expect(structuredClone(a)).toEqual(a)
  })

  it('never places a chain point outside the tile core rectangle', () => {
    const params = withWindowHydrology(rawParams(7))
    for (const tile of TILES) {
      expect(chainsWithinCore(computeRiverTile(tile, params), riverTileCoreRect(tile))).toBe(true)
    }
  })

  it('produces some chains across several seeds', () => {
    let totalChains = 0
    for (const seed of [1, 42, 999]) {
      const params = withWindowHydrology(rawParams(seed))
      for (const tile of TILES) totalChains += computeRiverTile(tile, params).length
    }
    expect(totalChains).toBeGreaterThan(0)
  })
})

describe('depthFromAccumulation', () => {
  it('is zero below the stream threshold and grows with accumulation, bounded', () => {
    expect(depthFromAccumulation(0)).toBe(0)
    const small = depthFromAccumulation(DEFAULT_RIVER_THRESHOLDS.stream + 5)
    const big = depthFromAccumulation(1000)
    expect(small).toBeGreaterThan(0)
    expect(big).toBeGreaterThan(small)
    expect(big).toBeLessThanOrEqual(2.4 + 1e-9)
  })
})

describe('canonicalWaterHeight (plan world-terrain-010)', () => {
  it('always sits below the point\'s own natural elevation, even for a barely-classified stream', () => {
    const barelyStream = point(0, 0, 10, DEFAULT_RIVER_THRESHOLDS.stream + 1) // just past the stream threshold
    expect(canonicalWaterHeight(barelyStream)).toBeLessThan(barelyStream.elevation)
    const bigRiver = point(0, 0, 10, 5000)
    expect(canonicalWaterHeight(bigRiver)).toBeLessThan(bigRiver.elevation)
  })

  it('is deterministic and grows the exposed-bank gap with flow strength', () => {
    const p = point(0, 0, 10, 300)
    expect(canonicalWaterHeight(p)).toBe(canonicalWaterHeight(p))
    const small = 10 - canonicalWaterHeight(point(0, 0, 10, 16))
    const big = 10 - canonicalWaterHeight(point(0, 0, 10, 5000))
    expect(big).toBeGreaterThan(small)
    expect(exposedBankFromFlow(0)).toBeCloseTo(0.15, 5)
    expect(exposedBankFromFlow(1)).toBeCloseTo(0.8, 5)
  })
})

function point(x: number, z: number, elevation: number, accumulation: number): RiverPoint {
  return { x, z, elevation, accumulation }
}

describe('riverChannelSegmentsNear (plan 189)', () => {
  it('produces no segments where accumulation never reaches the stream threshold', () => {
    const chain: RiverChain = { points: [point(0, 0, 10, 5), point(8, 0, 9.5, 5)] }
    expect(riverChannelSegmentsNear([chain], 4, 0, 64)).toHaveLength(0)
  })

  it('bed elevation strictly decreases downstream, always below the raw chain elevation', () => {
    const chain: RiverChain = {
      points: [point(0, 0, 100, 50), point(8, 0, 99, 120), point(16, 0, 98, 300)],
    }
    const segments = riverChannelSegmentsNear([chain], 8, 0, 64)
    expect(segments).toHaveLength(2)
    expect(segments[0]!.aBedH).toBeLessThan(chain.points[0]!.elevation)
    expect(segments[0]!.bBedH).toBeLessThan(segments[0]!.aBedH)
    // Consecutive segments share an endpoint — bed height is exactly continuous, no jump.
    expect(segments[1]!.aBedH).toBe(segments[0]!.bBedH)
    expect(segments[1]!.bBedH).toBeLessThan(segments[1]!.aBedH)
  })

  it('width and channel margin both grow with accumulation, never independently', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 20), point(8, 0, 99, 1000)] }
    const [seg] = riverChannelSegmentsNear([chain], 4, 0, 64)
    expect(seg!.bWaterHalfWidth).toBeGreaterThan(seg!.aWaterHalfWidth)
    expect(seg!.aChannelHalfWidth).toBeGreaterThan(seg!.aWaterHalfWidth)
    expect(seg!.bChannelHalfWidth).toBeGreaterThan(seg!.bWaterHalfWidth)
  })

  it('canonical cross-section invariants hold: bedY < waterY < bankTopY, waterWidth < channelWidth', () => {
    for (const [elevation, accumulation] of [[100, 20], [100, 300], [50, 2000]] as const) {
      const chain: RiverChain = { points: [point(0, 0, elevation, accumulation), point(8, 0, elevation - 1, accumulation)] }
      const [seg] = riverChannelSegmentsNear([chain], 4, 0, 64)
      if (!seg) continue // below the stream threshold — no channel at all
      expect(seg.aBedH).toBeLessThan(seg.aWaterH)
      expect(seg.aWaterH).toBeLessThan(chain.points[0]!.elevation)
      expect(seg.bBedH).toBeLessThan(seg.bWaterH)
      expect(seg.bWaterH).toBeLessThan(chain.points[1]!.elevation)
      expect(seg.aWaterHalfWidth).toBeLessThan(seg.aChannelHalfWidth)
      expect(seg.bWaterHalfWidth).toBeLessThan(seg.bChannelHalfWidth)
    }
  })

  it('is deterministic for the same chains and chunk position', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 50), point(8, 0, 99, 120)] }
    const a = riverChannelSegmentsNear([chain], 4, 0, 64)
    const b = riverChannelSegmentsNear([chain], 4, 0, 64)
    expect(a).toEqual(b)
  })

  it('includes a segment whose bank reaches into a chunk even when its points sit just outside it', () => {
    // Wide/deep enough that half-width + bank clearly overshoots a couple world units.
    const chain: RiverChain = { points: [point(-2, 0, 100, 2000), point(-1, 0, 99.9, 2000)] }
    const segments = riverChannelSegmentsNear([chain], 32, 0, 64) // rect [0, 64]
    expect(segments.length).toBeGreaterThan(0)
  })

  it('two chunks straddling the same segment see identical carving data (boundary continuity)', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const left = riverChannelSegmentsNear([chain], 0, 0, 64) // rect [-32, 32]
    const right = riverChannelSegmentsNear([chain], 64, 0, 64) // rect [32, 96]
    expect(left).toHaveLength(1)
    expect(right).toHaveLength(1)
    expect(left[0]).toEqual(right[0])
  })
})

describe('nearestRiverBankDistance (plan ui-input-006)', () => {
  it('is null when no segments are nearby', () => {
    expect(nearestRiverBankDistance([], 0, 0)).toBeNull()
  })

  it('reads negative on the centerline, ~0 at the bank, positive on dry land beyond it', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const segments = riverChannelSegmentsNear([chain], 32, 0, 64)
    const halfWidth = widthFromAccumulation(300) / 2

    expect(nearestRiverBankDistance(segments, 32, 0)).toBeCloseTo(-halfWidth, 5)
    expect(nearestRiverBankDistance(segments, 32, halfWidth)).toBeCloseTo(0, 5)
    expect(nearestRiverBankDistance(segments, 32, halfWidth + 5)).toBeCloseTo(5, 5)
  })

  it('picks the nearest of several segments, same as `chunkHeightmap.ts`\'s carving pass would', () => {
    const near: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const far: RiverChain = { points: [point(0, 50, 100, 300), point(64, 50, 90, 300)] }
    const segments = [
      ...riverChannelSegmentsNear([near], 32, 0, 64),
      ...riverChannelSegmentsNear([far], 32, 50, 64),
    ]
    const halfWidth = widthFromAccumulation(300) / 2
    expect(nearestRiverBankDistance(segments, 32, 5)).toBeCloseTo(5 - halfWidth, 5)
  })
})

describe('nearestRiverBankPoint (plan ui-input-006 fishing-interaction fix)', () => {
  it('is null when no segments are nearby', () => {
    expect(nearestRiverBankPoint([], 0, 0)).toBeNull()
  })

  it('returns a real bank point on the query side, distinct from the query position', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const segments = riverChannelSegmentsNear([chain], 32, 5, 64)
    const halfWidth = widthFromAccumulation(300) / 2

    const bank = nearestRiverBankPoint(segments, 32, 5)
    expect(bank).not.toBeNull()
    // Centerline runs along z=0 here, so the bank point on the +z side sits
    // at (32, halfWidth) — on the same side as the query point, not at the
    // query position itself (unless already exactly on the bank).
    expect(bank!.x).toBeCloseTo(32, 5)
    expect(bank!.z).toBeCloseTo(halfWidth, 5)
    expect(bank).not.toEqual({ x: 32, z: 5 })
  })
})

describe('nearestRiverHydrologyContext (plan world-017)', () => {
  it('is null when no chains are nearby', () => {
    expect(nearestRiverHydrologyContext([], 0, 0)).toBeNull()
  })

  it('interpolates elevation/accumulation at the projected point, same selection as nearestRiverBankDistance', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const context = nearestRiverHydrologyContext([chain], 32, 5)
    expect(context).not.toBeNull()
    expect(context!.x).toBeCloseTo(32, 5)
    expect(context!.z).toBeCloseTo(0, 5)
    expect(context!.elevation).toBeCloseTo(95, 5) // midpoint between 100 and 90
    expect(context!.accumulation).toBeCloseTo(300, 5)

    const segments = riverChannelSegmentsNear([chain], 32, 5, 64)
    expect(context!.distanceToWaterEdge).toBeCloseTo(nearestRiverBankDistance(segments, 32, 5)!, 5)
  })

  it('picks the nearest of several chains, same as nearestRiverBankDistance would across the same segments', () => {
    const near: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const far: RiverChain = { points: [point(0, 50, 20, 300), point(64, 50, 10, 300)] }
    const context = nearestRiverHydrologyContext([near, far], 32, 5)
    expect(context).not.toBeNull()
    expect(context!.z).toBeCloseTo(0, 5) // the near chain, not far
  })

  it('the same physical river sample is reachable from both banks with the same result', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const halfWidth = widthFromAccumulation(300) / 2
    const left = nearestRiverHydrologyContext([chain], 32, -(halfWidth + 3))
    const right = nearestRiverHydrologyContext([chain], 32, halfWidth + 3)
    expect(left).not.toBeNull()
    expect(right).not.toBeNull()
    expect(left!.elevation).toBeCloseTo(right!.elevation, 5)
    expect(left!.accumulation).toBeCloseTo(right!.accumulation, 5)
    expect(left!.x).toBeCloseTo(right!.x, 5)
    expect(left!.z).toBeCloseTo(right!.z, 5)
  })
})

describe('nearestRiverShoreCandidate (plan world-terrain-046)', () => {
  it('is null when no chains are nearby', () => {
    expect(nearestRiverShoreCandidate([], 0, 0)).toBeNull()
  })

  it('agrees with nearestRiverBankDistance/nearestRiverBankPoint/nearestRiverHydrologyContext computed separately on the same chain', () => {
    const chain: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const candidate = nearestRiverShoreCandidate([chain], 32, 5)
    expect(candidate).not.toBeNull()

    const segments = riverChannelSegmentsNear([chain], 32, 5, 64)
    const distance = nearestRiverBankDistance(segments, 32, 5)
    const bank = nearestRiverBankPoint(segments, 32, 5)
    const context = nearestRiverHydrologyContext([chain], 32, 5)

    expect(candidate!.distanceToWaterEdge).toBeCloseTo(distance!, 5)
    expect(candidate!.bankX).toBeCloseTo(bank!.x, 5)
    expect(candidate!.bankZ).toBeCloseTo(bank!.z, 5)
    expect(candidate!.x).toBeCloseTo(context!.x, 5)
    expect(candidate!.z).toBeCloseTo(context!.z, 5)
    expect(candidate!.elevation).toBeCloseTo(context!.elevation, 5)
    expect(candidate!.accumulation).toBeCloseTo(context!.accumulation, 5)
  })

  it('picks the nearest of several chains, the same single winning candidate for distance, bank point and hydrology', () => {
    const near: RiverChain = { points: [point(0, 0, 100, 300), point(64, 0, 90, 300)] }
    const far: RiverChain = { points: [point(0, 50, 20, 300), point(64, 50, 10, 300)] }
    const candidate = nearestRiverShoreCandidate([near, far], 32, 5)
    expect(candidate).not.toBeNull()
    // The near chain's elevation range is 90-100; the far chain's is 10-20 —
    // picking the far chain by mistake would show up here.
    expect(candidate!.elevation).toBeGreaterThan(50)
    expect(candidate!.z).toBeCloseTo(0, 5)
  })
})

describe('footprintOverlapsRiver', () => {
  const seg = {
    ax: -50,
    az: 0,
    aBedH: 0,
    aWaterH: 1,
    aWaterHalfWidth: 3,
    aChannelHalfWidth: 6,
    bx: 50,
    bz: 0,
    bBedH: 0,
    bWaterH: 1,
    bWaterHalfWidth: 3,
    bChannelHalfWidth: 6,
  }

  it('reports no overlap with no segments', () => {
    expect(footprintOverlapsRiver([], 0, 0, 10)).toBe(false)
  })

  it('matches isInsideRiverChannel at radius 0', () => {
    for (const z of [0, 2, 3.5, 5, 12]) {
      expect(footprintOverlapsRiver([seg], 0, z, 0)).toBe(
        nearestRiverBankDistance([seg], 0, z)! < 0,
      )
    }
  })

  it('catches a footprint whose centre is dry but whose disc reaches the water', () => {
    // Water edge is at |z| = 3; a radius-2 pad centred at z = 4 overlaps it.
    expect(footprintOverlapsRiver([seg], 0, 4, 2)).toBe(true)
    expect(footprintOverlapsRiver([seg], 0, 4, 0.5)).toBe(false)
  })

  it('leaves the exposed bank beyond the footprint eligible', () => {
    expect(footprintOverlapsRiver([seg], 0, 10, 2)).toBe(false)
  })
})
