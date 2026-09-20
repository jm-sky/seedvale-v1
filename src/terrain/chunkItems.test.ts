import { describe, expect, it } from 'vitest'
import { type ChunkTileData, type ChunkTileParams, type RegionParams } from './chunkHeightmap'
import { computeChunkItems } from './chunkItems'

const REGION: RegionParams = {
  continentScale: 2200,
  continentFbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
  mountainScale: 1800,
  mountainFbm: { octaves: 2, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.2 },
  mountainThreshold: 0.62,
  mountainThresholdWidth: 0.14,
  worleyCellSize: 260,
  ridgeSharpness: 2.0,
  mountainGain: 0.8,
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
}

function filled(size: number, value: number): Float32Array {
  return new Float32Array(size * size).fill(value)
}

function dryLandTile(apronRes: number): ChunkTileData {
  return {
    heights: filled(apronRes, 8),
    floorHeights: filled(apronRes, 8),
    biomes: filled(apronRes, 0.5),
    bodyScale: filled(apronRes, 0),
    continentalness: filled(apronRes, 0.8),
    mountainRidge: filled(apronRes, 0),
    moistureRegion: filled(apronRes, 0.5),
    roadTint: filled(apronRes, 0),
  }
}

function params(overrides: Partial<ChunkTileParams> = {}): ChunkTileParams {
  return {
    seed: 42,
    heightScale: 18,
    waterLevel: 0,
    noiseScale: 120,
    detailAmplitude: 0.55,
    hillsScale: 420,
    hillsAmplitude: 0.28,
    hillsFbm: { octaves: 3, persistence: 0.55, lacunarity: 2.0, exponentiation: 1.15 },
    fbm: { octaves: 4, persistence: 0.65, lacunarity: 2.0, exponentiation: 1.35 },
    biome: {
      noiseScale: 96,
      fbm: { octaves: 3, persistence: 0.5, lacunarity: 2.0, exponentiation: 1.0 },
    },
    region: REGION,
    cx: 0,
    cz: 0,
    chunkSize: 64,
    resolution: 17,
    isHomeChunk: false,
    vegetationSpeciesCount: { tree: 9, bush: 5, cactus: 2, reed: 1, fern: 1, lily: 1, seaweed: 1 },
    roadSegments: [],
    clearings: [],
    regional: [],
    riverSegments: [],
    ...overrides,
  }
}

function uniformTile(apronRes: number, height: number, continentalness: number): ChunkTileData {
  const tile = dryLandTile(apronRes)
  tile.heights = filled(apronRes, height)
  tile.floorHeights = filled(apronRes, height)
  tile.continentalness = filled(apronRes, continentalness)
  return tile
}

describe('computeChunkItems — shell spawn band (plan world-terrain-047)', () => {
  const WATER_LEVEL = 0
  const COASTAL_CONTINENTALNESS = 0.4 // within [oceanThreshold, coastThreshold]
  const INLAND_CONTINENTALNESS = 0.8

  it('accepts a shell candidate close to the ocean shoreline', () => {
    let sawShell = false
    for (let i = 0; i < 60; i++) {
      const coord = { cx: i, cz: -i }
      const tile = uniformTile(19, WATER_LEVEL + 0.5, COASTAL_CONTINENTALNESS)
      const items = computeChunkItems(coord, tile, params({ cx: coord.cx, cz: coord.cz, seed: 100 + i, waterLevel: WATER_LEVEL }), [])
      if (items.some((item) => item.kind === 'shell')) sawShell = true
    }
    expect(sawShell).toBe(true)
  })

  it('rejects a candidate too far/high above the shoreline', () => {
    for (let i = 0; i < 60; i++) {
      const coord = { cx: i, cz: -i }
      const tile = uniformTile(19, WATER_LEVEL + 3, COASTAL_CONTINENTALNESS)
      const items = computeChunkItems(coord, tile, params({ cx: coord.cx, cz: coord.cz, seed: 100 + i, waterLevel: WATER_LEVEL }), [])
      expect(items.some((item) => item.kind === 'shell')).toBe(false)
    }
  })

  it('never satisfies the shell predicate on inland/lake-like continentalness', () => {
    for (let i = 0; i < 60; i++) {
      const coord = { cx: i, cz: -i }
      const tile = uniformTile(19, WATER_LEVEL + 0.5, INLAND_CONTINENTALNESS)
      const items = computeChunkItems(coord, tile, params({ cx: coord.cx, cz: coord.cz, seed: 100 + i, waterLevel: WATER_LEVEL }), [])
      expect(items.some((item) => item.kind === 'shell')).toBe(false)
    }
  })

  it('keeps deterministic stable ids for the same seed/chunk', () => {
    const coord = { cx: 2, cz: -6 }
    const tile = uniformTile(19, WATER_LEVEL + 0.5, COASTAL_CONTINENTALNESS)
    const p = params({ cx: coord.cx, cz: coord.cz, seed: 321, waterLevel: WATER_LEVEL })
    expect(computeChunkItems(coord, tile, p, [])).toEqual(computeChunkItems(coord, tile, p, []))
  })
})

describe('computeChunkItems — coin pool (issue 035)', () => {
  const tile = dryLandTile(19)

  it('never places coins on the home chunk', () => {
    const items = computeChunkItems({ cx: 0, cz: 0 }, tile, params({ isHomeChunk: true }), [])
    expect(items.filter((item) => item.kind === 'coin')).toHaveLength(0)
  })

  it('uses a c-prefix id that cannot collide with shell/stone or flora ids', () => {
    const coins: string[] = []
    for (let i = 0; i < 80; i++) {
      const coord = { cx: i, cz: -i }
      const items = computeChunkItems(coord, tile, params({ cx: coord.cx, cz: coord.cz, seed: 7 + i }), [])
      for (const item of items) {
        if (item.kind !== 'coin') continue
        expect(item.id).toBe(`${coord.cx}:${coord.cz}:c0`)
        coins.push(item.id)
      }
    }
    expect(coins.length).toBeGreaterThan(0)
    expect(coins.every((id) => id.includes(':c'))).toBe(true)
  })

  it('is deterministic for the same seed and coord', () => {
    const coord = { cx: 3, cz: 5 }
    const p = params({ cx: 3, cz: 5, seed: 99 })
    expect(computeChunkItems(coord, tile, p, [])).toEqual(computeChunkItems(coord, tile, p, []))
  })
})

function denseTreeGrid(coord: { cx: number, cz: number }) {
  const trees: { kind: 'tree', x: number, z: number, speciesIndex: number, scale: number, rotationY: number }[] = []
  for (let gx = -32; gx <= 32; gx += 8) {
    for (let gz = -32; gz <= 32; gz += 8) {
      trees.push({ kind: 'tree', x: coord.cx * 64 + gx, z: coord.cz * 64 + gz, speciesIndex: 0, scale: 1, rotationY: 0 })
    }
  }
  return trees
}

describe('computeChunkItems — beam (loose wood, plan items-player-015 / world-terrain-049)', () => {
  const tile = dryLandTile(19)

  /** A dense grid covering the whole chunk (`FLORA_TREE_PROXIMITY` is only 7
   *  world units) so every forage candidate in `coord`'s chunk counts as
   *  "near a tree", regardless of where the seeded RNG happens to place it. */

  it('only ever appears near a tree, never on open ground', () => {
    let sawBeam = false
    for (let i = 0; i < 200; i++) {
      const coord = { cx: i, cz: -i }
      const items = computeChunkItems(coord, tile, params({ cx: coord.cx, cz: coord.cz, seed: 11 + i }), [])
      if (items.some((item) => item.kind === 'beam')) sawBeam = true
    }
    expect(sawBeam).toBe(false)
  })

  it('can appear near a tree with rare-wood id prefix wN', () => {
    let sawBeam = false
    for (let i = 0; i < 200; i++) {
      const coord = { cx: i, cz: -i }
      const items = computeChunkItems(
        coord,
        tile,
        params({ cx: coord.cx, cz: coord.cz, seed: 11 + i }),
        denseTreeGrid(coord),
      )
      for (const item of items) {
        if (item.kind !== 'beam') continue
        sawBeam = true
        expect(item.id).toMatch(new RegExp(`^${coord.cx}:${coord.cz}:w\\d+$`))
      }
    }
    expect(sawBeam).toBe(true)
  })
})

describe('computeChunkItems — medicinal herbs (plan items-player-043 / world-terrain-049)', () => {
  const moistTile = (): ReturnType<typeof dryLandTile> => {
    const tile = dryLandTile(19)
    tile.moistureRegion = new Float32Array(19 * 19).fill(0.75)
    return tile
  }

  it('keeps stable medicinal ids across repeated generation (hN prefix)', () => {
    const coord = { cx: 4, cz: -2 }
    const p = params({ cx: 4, cz: -2, seed: 404 })
    const a = computeChunkItems(coord, moistTile(), p, denseTreeGrid(coord))
    const b = computeChunkItems(coord, moistTile(), p, denseTreeGrid(coord))
    expect(a).toEqual(b)
    for (const item of a.filter((entry) => entry.kind === 'mint' || entry.kind === 'yarrow' || entry.kind === 'herb')) {
      expect(item.id).toMatch(new RegExp(`^${coord.cx}:${coord.cz}:h\\d+$`))
    }
  })

  it('makes mint materially more common than rare herb under moist forest conditions', () => {
    let mint = 0
    let herb = 0
    let yarrow = 0
    for (let i = 0; i < 120; i++) {
      const coord = { cx: i, cz: i + 3 }
      for (const item of computeChunkItems(
        coord,
        moistTile(),
        params({ cx: coord.cx, cz: coord.cz, seed: 500 + i }),
        denseTreeGrid(coord),
      )) {
        if (item.kind === 'mint') mint += 1
        if (item.kind === 'herb') herb += 1
        if (item.kind === 'yarrow') yarrow += 1
      }
    }
    expect(mint).toBeGreaterThan(herb)
    expect(mint + yarrow + herb).toBeGreaterThan(0)
  })

  it('places medicinal finds without consuming forest-floor fN slots', () => {
    let sawMedicinal = false
    let sawForestFloor = false
    for (let i = 0; i < 80; i++) {
      const coord = { cx: i, cz: i + 7 }
      const items = computeChunkItems(
        coord,
        moistTile(),
        params({ cx: coord.cx, cz: coord.cz, seed: 700 + i }),
        denseTreeGrid(coord),
      )
      for (const item of items) {
        if (item.kind === 'mint' || item.kind === 'yarrow' || item.kind === 'herb' || item.kind === 'poisonous_herb') {
          sawMedicinal = true
          expect(item.id).toMatch(/:h\d+$/)
        }
        if (
          item.kind === 'mushroom' ||
          item.kind === 'branch' ||
          item.kind === 'cone' ||
          item.kind === 'berries' ||
          item.kind === 'nuts'
        ) {
          sawForestFloor = true
          expect(item.id).toMatch(/:f\d+$/)
        }
      }
    }
    expect(sawMedicinal).toBe(true)
    expect(sawForestFloor).toBe(true)
  })
})

describe('computeChunkItems — open flora pool (plan world-terrain-049)', () => {
  it('assigns flower and flax the oN id prefix', () => {
    let sawOpen = false
    for (let i = 0; i < 120; i++) {
      const coord = { cx: i, cz: -i - 1 }
      const items = computeChunkItems(
        coord,
        dryLandTile(19),
        params({ cx: coord.cx, cz: coord.cz, seed: 900 + i }),
        [],
      )
      for (const item of items) {
        if (item.kind !== 'flower' && item.kind !== 'flax') continue
        sawOpen = true
        expect(item.id).toMatch(new RegExp(`^${coord.cx}:${coord.cz}:o\\d+$`))
      }
    }
    expect(sawOpen).toBe(true)
  })
})
