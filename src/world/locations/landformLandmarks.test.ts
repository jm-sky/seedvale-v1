import { describe, expect, it } from 'vitest'
import type { RawSampleParams } from '../../terrain/chunkHeightmap'
import type { ChunkManager } from '../../terrain/chunkManager'
import type { Caves } from '../createCaves'
import { defaultTerrainConfig } from '../../config/worldConfig'
import { landformLandmarksOf, landformSubtypeFromId } from './landformLandmarks'
import { FAR_RANGE_HOURS } from './locationConfig'
import { createWorldLocationCatalog } from './worldLocationCatalog'
import { worldLocationKindFromId } from './worldLocationTypes'

const SEED = 415424794

function continentParams(seed = SEED): RawSampleParams {
  return { ...defaultTerrainConfig(65), seed, hydrologyId: 'unconditioned' } as unknown as RawSampleParams
}

function catalogFor(params: RawSampleParams) {
  return createWorldLocationCatalog({
    getSeed: () => params.seed,
    getCaves: () => ({ definitions: () => [] }) as unknown as Caves,
    getChunkManager: () => ({ resolveCemeteryById: () => null, probeAbandonedCemeteryAtChunk: () => null, findLandmarkNear: () => null }) as unknown as ChunkManager,
    lookupSettlement: () => null,
    getSampleParams: () => params,
    getChunkSize: () => 64,
  })
}

describe('landformLandmarksOf', () => {
  it('lists the 060 point landforms and range-spine summits with stable `landform:` ids', () => {
    const list = landformLandmarksOf(continentParams())
    expect(list.length).toBeGreaterThan(0)
    for (const l of list) {
      expect(l.id.startsWith('landform:')).toBe(true)
      expect(landformSubtypeFromId(l.id)).toBe(l.subtype)
      expect(worldLocationKindFromId(l.id)).toBe('landform')
    }
    expect(new Set(list.map((l) => l.id)).size).toBe(list.length)
    expect(list.some((l) => l.subtype === 'spineSummit')).toBe(true)
    // Deterministic: a fresh call returns the same ids and positions.
    expect(landformLandmarksOf(continentParams())).toEqual(list)
  })

  it('maps descriptor ids `lf:<kind>:<cell>` to `landform:<kind>:<cell>` and summit ids to `<spine cell>:<index>`', () => {
    const ids = landformLandmarksOf(continentParams()).map((l) => l.id)
    expect(ids).toContain('landform:lakeIsland:9_9')
    expect(ids).toContain('landform:spineSummit:6_-7:0')
    expect(ids.filter((id) => id.startsWith('landform:crater:')).length).toBeLessThanOrEqual(1)
  })

  it('is empty for a world without a finite continent', () => {
    const bare = { ...continentParams(), region: { ...continentParams().region, continentMask: undefined } } as unknown as RawSampleParams
    expect(landformLandmarksOf(bare)).toEqual([])
  })
})

describe('catalog landform entries', () => {
  it('resolves ids by `getById` with kind, subtype and a deterministic name', () => {
    const params = continentParams()
    const catalog = catalogFor(params)
    for (const l of landformLandmarksOf(params)) {
      const loc = catalog.getById(l.id)
      expect(loc).toMatchObject({ id: l.id, kind: 'landform', subtype: l.subtype, x: l.x, z: l.z })
      expect(loc!.name.length).toBeGreaterThan(0)
      expect(catalog.getById(l.id)!.name).toBe(loc!.name)
    }
    expect(catalog.getById('landform:crag:nope')).toBeNull()
  })

  it('lists landforms in range and suppresses coarse peaks on a spine summit', () => {
    const params = continentParams()
    const catalog = catalogFor(params)
    const all = catalog.landmarksInRange(0, 0, 0, FAR_RANGE_HOURS)
    const ids = new Set(all.filter((l) => l.kind === 'landform').map((l) => l.id))
    for (const l of landformLandmarksOf(params)) expect(ids.has(l.id)).toBe(true)
    const summits = landformLandmarksOf(params).filter((l) => l.subtype === 'spineSummit')
    for (const p of all.filter((l) => l.kind === 'mountainPeak')) {
      for (const s of summits) expect(Math.hypot(p.x - s.x, p.z - s.z)).toBeGreaterThan(s.radius)
    }
  })

  it('answers a summit height for crag and spine-summit landforms only', () => {
    const params = continentParams()
    const catalog = catalogFor(params)
    for (const l of landformLandmarksOf(params)) {
      const h = catalog.peakSummitHeight(l.id)
      if (l.subtype === 'crag' || l.subtype === 'spineSummit') expect(h).toEqual(expect.any(Number))
      else expect(h).toBeNull()
    }
  })
})
