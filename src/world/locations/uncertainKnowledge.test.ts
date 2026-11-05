import { describe, expect, it } from 'vitest'
import type { MapProjection } from '../map/mapProjection'
import type { WorldLocationCatalog } from './worldLocationCatalog'
import type { WorldLocation } from './worldLocationTypes'
import { findLocationAtCanvasPoint } from '../../ui-vue/lib/drawMap'
import { resolveMapLocationLabelPresentations } from '../../ui-vue/lib/mapLocationLabelLayout'
import { MAP_EXTENT_HALF } from '../map/mapConfig'
import { createMapData, setActiveMapData } from '../map/mapData'
import { createMapDiscovery } from '../map/mapDiscovery'
import { createGuardLocalKnowledge } from './guardLocalKnowledge'
import { listKnownSettlementOptions } from './knownSettlementReputation'
import { revealLandmarksOnArrival } from './landmarkArrival'
import { createLocationKnowledge } from './locationKnowledge'
import { createNavigationTargets } from './navigationTargets'
import {
  countOpenRumourLeads,
  genericLocationLabel,
  isLocationDiscovered,
  RUMOUR_LEAD_RADIUS_MAX,
  RUMOUR_LEAD_RADIUS_MIN,
  rumourLeadArea,
} from './rumourLead'
import { emptyLocationScanDiagnostics } from './worldLocationCatalog'

const SEED = 415424794
const LAKE: WorldLocation = { id: 'lake:10,20', kind: 'lake', x: 500, z: 1000, name: 'Jezioro Srebrne', discoveryWeight: 0.7 }
const CAVE: WorldLocation = { id: 'cave:a', kind: 'cave', x: -300, z: 250, name: 'Grota Wilcza', discoveryWeight: 0.6 }
const FOREIGN: WorldLocation = { id: 'settlement:1_0', kind: 'settlement', x: 900, z: 900, name: 'Brzeg', discoveryWeight: 0 }

function fakeCatalog(locations: readonly WorldLocation[], extras: Partial<WorldLocationCatalog> = {}): WorldLocationCatalog {
  return {
    getById: (id) => locations.find((l) => l.id === id) ?? null,
    nearestSettlements: () => [],
    landmarksWithin: () => [],
    landmarksInRange: () => [],
    landmarksInRangeAsync: async () => [],
    abandonedMine: () => null,
    abandonedMineBinding: () => null,
    stableLandmarksInRange: () => [],
    lakeExtentRadius: () => null,
    peakSummitHeight: () => null,
    invalidateScanCache: () => {},
    getScanDiagnostics: () => emptyLocationScanDiagnostics(),
    ...extras,
  }
}

function stubProjection(): MapProjection {
  return {
    project: () => ({ key: '0,0', cx: 0, cz: 0, terrain: 'lowland', biome: 'meadow', water: false }),
    cellsInViewport: () => [],
    setParams: () => {},
    invalidateCache: () => {},
  }
}

const WIDE = { minX: -MAP_EXTENT_HALF, maxX: MAP_EXTENT_HALF, minZ: -MAP_EXTENT_HALF, maxZ: MAP_EXTENT_HALF }

function estimatedSetup(locations: readonly WorldLocation[] = [LAKE, CAVE]) {
  const catalog = fakeCatalog(locations)
  const knowledge = createLocationKnowledge(locations.map((l) => ({ id: l.id, state: 'estimated' as const, source: 'npc' as const })))
  const mapData = createMapData({ projection: stubProjection(), discovery: createMapDiscovery(), catalog, knowledge, getSeed: () => SEED })
  return { catalog, knowledge, mapData }
}

describe('rumourLeadArea', () => {
  it('is deterministic and always contains the canonical target (offset < r)', () => {
    for (let i = 0; i < 400; i++) {
      const target = { x: ((i * 7919) % 9000) - 4500, z: ((i * 104729) % 9000) - 4500 }
      const id = `lake:${i},${i * 3}`
      const a = rumourLeadArea(SEED + i, id, target)
      expect(rumourLeadArea(SEED + i, id, target)).toEqual(a)
      expect(a.radius).toBeGreaterThanOrEqual(RUMOUR_LEAD_RADIUS_MIN)
      expect(a.radius).toBeLessThanOrEqual(RUMOUR_LEAD_RADIUS_MAX)
      const offset = Math.hypot(a.x - target.x, a.z - target.z)
      expect(offset).toBeLessThan(a.radius)
      // Off-centre by construction: the centre is never the target.
      expect(offset).toBeGreaterThan(0.1 * a.radius)
    }
  })

  it('differs per world seed and per location', () => {
    const target = { x: 100, z: 100 }
    expect(rumourLeadArea(1, 'lake:1,1', target)).not.toEqual(rumourLeadArea(2, 'lake:1,1', target))
    expect(rumourLeadArea(1, 'lake:1,1', target)).not.toEqual(rumourLeadArea(1, 'lake:1,2', target))
  })

  it('keeps the circle inside the world bound and the target inside the circle near edges', () => {
    const edge = MAP_EXTENT_HALF
    const targets = [
      { x: edge - 20, z: 0 }, { x: -edge + 20, z: 0 }, { x: 0, z: edge - 20 }, { x: 0, z: -edge + 20 },
      { x: edge - 20, z: edge - 20 }, { x: -edge + 20, z: -edge + 20 },
    ]
    for (let i = 0; i < 200; i++) {
      for (const target of targets) {
        const a = rumourLeadArea(SEED, `lake:${i},0`, target)
        expect(Math.hypot(a.x - target.x, a.z - target.z)).toBeLessThan(a.radius)
        // A target hugging the edge/corner cannot be both contained and fully inside the world: containment wins,
        // the circle may graze the bound by at most 0.4 r (corner worst case 1 - 0.9/sqrt(2)).
        expect(Math.abs(a.x) + a.radius).toBeLessThanOrEqual(edge + 0.4 * a.radius + 1e-6)
        expect(Math.abs(a.z) + a.radius).toBeLessThanOrEqual(edge + 0.4 * a.radius + 1e-6)
      }
    }
  })

  it('fully clips inside the bound for targets farther than 0.1 r from the edge', () => {
    for (let i = 0; i < 200; i++) {
      const target = { x: MAP_EXTENT_HALF - 300, z: -MAP_EXTENT_HALF + 300 }
      const a = rumourLeadArea(SEED, `cave:${i}`, target)
      expect(Math.abs(a.x) + a.radius).toBeLessThanOrEqual(MAP_EXTENT_HALF + 1e-6)
      expect(Math.abs(a.z) + a.radius).toBeLessThanOrEqual(MAP_EXTENT_HALF + 1e-6)
      expect(Math.hypot(a.x - target.x, a.z - target.z)).toBeLessThan(a.radius)
    }
  })
})

describe('mapData.project() for estimated knowledge — map / minimap consumers', () => {
  it('knownLocations exposes no canonical x/z and no proper name', () => {
    const { mapData } = estimatedSetup()
    const known = mapData.knownLocations(WIDE)
    expect(known).toHaveLength(2)
    for (const loc of known) {
      const canonical = [LAKE, CAVE].find((l) => l.id === loc.id)!
      expect(loc.state).toBe('estimated')
      expect(loc.label).toBe(genericLocationLabel(canonical.kind))
      expect(loc.label).not.toBe(canonical.name)
      expect(`${loc.label}${loc.description ?? ''}`).not.toContain(canonical.name)
      expect(loc.x === canonical.x && loc.z === canonical.z).toBe(false)
      expect(loc.areaRadius).toBeGreaterThanOrEqual(RUMOUR_LEAD_RADIUS_MIN)
      // The area contains the target but its centre is not the target.
      expect(Math.hypot(loc.x - canonical.x, loc.z - canonical.z)).toBeLessThan(loc.areaRadius!)
    }
  })

  it('viewport filtering uses the projected centre, never the canonical position', () => {
    const { mapData } = estimatedSetup([LAKE])
    const [loc] = mapData.knownLocations(WIDE)
    const tight = { minX: loc!.x - 1, maxX: loc!.x + 1, minZ: loc!.z - 1, maxZ: loc!.z + 1 }
    expect(mapData.knownLocations(tight)).toHaveLength(1)
    const canonicalOnly = { minX: LAKE.x - 1, maxX: LAKE.x + 1, minZ: LAKE.z - 1, maxZ: LAKE.z + 1 }
    expect(mapData.knownLocations(canonicalOnly)).toHaveLength(0)
  })

  it('save/load exactly reconstructs the projection (nothing but id/state/source is stored)', () => {
    const { catalog, knowledge, mapData } = estimatedSetup()
    const before = mapData.knownLocations(WIDE)
    const saved = JSON.parse(JSON.stringify(knowledge.serialize())) as ReturnType<typeof knowledge.serialize>
    expect(saved.every((e) => Object.keys(e).sort().join() === 'id,source,state')).toBe(true)
    const restored = createMapData({
      projection: stubProjection(),
      discovery: createMapDiscovery(),
      catalog,
      knowledge: createLocationKnowledge(saved),
      getSeed: () => SEED,
    })
    expect(restored.knownLocations(WIDE)).toEqual(before)
  })

  it('upgrading to discovered switches to the canonical name and position', () => {
    const { knowledge, mapData } = estimatedSetup([LAKE])
    expect(knowledge.reveal(LAKE.id, 'discovered', 'exploration')).toBe(true)
    const loc = mapData.resolveKnown(LAKE.id)!
    expect(loc).toMatchObject({ x: LAKE.x, z: LAKE.z, label: LAKE.name, state: 'discovered' })
    expect(loc.areaRadius).toBeUndefined()
  })

  it('label layout shows only the generic label', () => {
    const { mapData } = estimatedSetup([LAKE])
    const presentations = resolveMapLocationLabelPresentations(
      mapData.knownLocations(WIDE),
      new Set(),
      null,
      () => ({ x: 0, y: 0 }),
      () => 40,
    )
    expect(presentations.map((p) => p.labelText)).toEqual(['Jezioro'])
  })

  it('an estimated mine does not hide a known bound cave marker', () => {
    const mine: WorldLocation = { id: 'abandonedMine:m', kind: 'abandonedMine', x: 0, z: 0, name: 'Kopalnia', discoveryWeight: 0 }
    const cave: WorldLocation = { id: 'cave:m', kind: 'cave', x: 0, z: 0, name: 'Grota', discoveryWeight: 0 }
    const catalog = fakeCatalog([mine, cave])
    const knowledge = createLocationKnowledge([
      { id: mine.id, state: 'estimated', source: 'npc' },
      { id: cave.id, state: 'confirmed', source: 'exploration' },
    ])
    const mapData = createMapData({ projection: stubProjection(), discovery: createMapDiscovery(), catalog, knowledge, getSeed: () => SEED })
    const presentations = resolveMapLocationLabelPresentations(
      mapData.knownLocations(WIDE),
      new Set(),
      { mineId: mine.id, caveLocationId: cave.id },
      () => ({ x: 0, y: 0 }),
      () => 40,
    )
    expect(presentations.map((p) => p.location.id).sort()).toEqual([mine.id, cave.id].sort())
  })
})

describe('mapData.project() for estimated knowledge — navigation / popover consumers', () => {
  it('resolveKnown (navigation target + popover) points at the area centre, not the target', () => {
    const { catalog, knowledge, mapData } = estimatedSetup([LAKE])
    const targets = createNavigationTargets()
    // An estimated entry may be set as a target...
    expect(targets.set(LAKE.id)).toBe('ok')
    // ...and restore() validation (`has` + catalog) stays valid for it.
    targets.restore([LAKE.id], (id) => knowledge.has(id) && catalog.getById(id) != null)
    expect(targets.has(LAKE.id)).toBe(true)
    const resolved = mapData.resolveKnown(LAKE.id)!
    expect(resolved.x === LAKE.x && resolved.z === LAKE.z).toBe(false)
    expect(resolved.label).toBe('Jezioro')
    expect(resolved.areaRadius).toBeDefined()
  })

  it('resolveKnown is null for an unknown or stale id', () => {
    const { mapData } = estimatedSetup([LAKE])
    expect(mapData.resolveKnown('lake:99,99')).toBeNull()
    const stale = createMapData({
      projection: stubProjection(),
      discovery: createMapDiscovery(),
      catalog: fakeCatalog([]),
      knowledge: createLocationKnowledge([{ id: LAKE.id, state: 'estimated', source: 'npc' }]),
      getSeed: () => SEED,
    })
    expect(stale.resolveKnown(LAKE.id)).toBeNull()
    expect(stale.knownLocations(WIDE)).toEqual([])
  })

  it('map hit-testing (popover selection) only finds the projected centre', () => {
    const { mapData } = estimatedSetup([LAKE])
    setActiveMapData(mapData)
    try {
      const view = { viewX: 0, viewZ: 0, zoom: 1 }
      const projected = mapData.resolveKnown(LAKE.id)!
      const hit = findLocationAtCanvasPoint(view, 4000, 4000, 2000 + projected.x, 2000 + projected.z)
      expect(hit?.id).toBe(LAKE.id)
      expect(hit?.x === LAKE.x && hit?.z === LAKE.z).toBe(false)
      // Clicking exactly on the canonical pin finds nothing (it is not drawn there).
      expect(findLocationAtCanvasPoint(view, 4000, 4000, 2000 + LAKE.x, 2000 + LAKE.z, 5)).toBeNull()
    } finally {
      setActiveMapData(null)
    }
  })
})

describe('non-projection consumers treat estimated as "not known"', () => {
  it('isLocationDiscovered: false for estimated, true for discovered/confirmed, false for absent', () => {
    const knowledge = createLocationKnowledge([
      { id: 'a', state: 'estimated', source: 'npc' },
      { id: 'b', state: 'discovered', source: 'npc' },
      { id: 'c', state: 'confirmed', source: 'exploration' },
    ])
    expect(isLocationDiscovered(knowledge, 'a')).toBe(false)
    expect(isLocationDiscovered(knowledge, 'b')).toBe(true)
    expect(isLocationDiscovered(knowledge, 'c')).toBe(true)
    expect(isLocationDiscovered(knowledge, 'zz')).toBe(false)
  })

  it('guardLocalKnowledge.alreadyKnownInRange never re-reveals an estimated entry with its name', () => {
    const knowledge = createLocationKnowledge([{ id: CAVE.id, state: 'estimated', source: 'npc' }])
    let research = 0
    const guard = createGuardLocalKnowledge({
      research: {
        resolve: async () => null,
        resolveMany: async () => { research += 1; return [] },
        invalidate() {},
        dispose() {},
      },
      getElapsedDays: () => 0,
      getWorldSeed: () => 2,
      locationKnowledge: knowledge,
      getLocation: (id) => id === CAVE.id ? CAVE : null,
      listStableLocations: () => [CAVE],
      nearestSettlements: () => [],
      homeLocationId: () => 'settlement:home',
      armFollowUp: () => null,
    })
    const line = guard.askAboutArea('npc:1', CAVE.x, CAVE.z, { kind: 'guard' })
    expect(line).not.toContain(CAVE.name)
    // Not treated as already known: falls through to the research path.
    expect(research).toBe(1)
    expect(knowledge.get(CAVE.id)).toEqual({ id: CAVE.id, state: 'estimated', source: 'npc' })
  })

  it('listKnownSettlementOptions skips an estimated settlement', () => {
    const knowledge = createLocationKnowledge([{ id: FOREIGN.id, state: 'estimated', source: 'npc' }])
    expect(listKnownSettlementOptions(knowledge, fakeCatalog([FOREIGN]))).toEqual([])
    knowledge.reveal(FOREIGN.id, 'discovered', 'npc')
    expect(listKnownSettlementOptions(knowledge, fakeCatalog([FOREIGN]))).toEqual([{ settlementId: '1_0', settlementName: 'Brzeg' }])
  })
})

describe('countOpenRumourLeads (derived cap)', () => {
  const pool = ['a', 'b', 'c', 'd', 'e'].map((k): WorldLocation => ({ id: `cave:${k}`, kind: 'cave', x: 0, z: 0, name: k, discoveryWeight: 0 }))

  it('counts estimated+npc entries that still resolve; duplicates use one slot', () => {
    const knowledge = createLocationKnowledge()
    for (const loc of pool.slice(0, 3)) knowledge.reveal(loc.id, 'estimated', 'npc')
    expect(knowledge.reveal(pool[0]!.id, 'estimated', 'npc')).toBe(false)
    expect(countOpenRumourLeads(knowledge, fakeCatalog(pool))).toBe(3)
  })

  it('ignores quest-owned / discovered / confirmed entries and non-npc estimates', () => {
    const knowledge = createLocationKnowledge([
      { id: 'cave:a', state: 'discovered', source: 'npc' },
      { id: 'cave:b', state: 'confirmed', source: 'exploration' },
      { id: 'cave:c', state: 'estimated', source: 'map' },
      { id: 'cave:d', state: 'estimated', source: 'npc' },
    ])
    expect(countOpenRumourLeads(knowledge, fakeCatalog(pool))).toBe(1)
  })

  it('stale ids drop out so the cap cannot stay full forever', () => {
    const knowledge = createLocationKnowledge(pool.slice(0, 4).map((l) => ({ id: l.id, state: 'estimated' as const, source: 'npc' as const })))
    expect(countOpenRumourLeads(knowledge, fakeCatalog(pool))).toBe(4)
    expect(countOpenRumourLeads(knowledge, fakeCatalog(pool.slice(2)))).toBe(2)
    expect(countOpenRumourLeads(knowledge, fakeCatalog([]))).toBe(0)
  })

  it('arrival closes the lead and the same canonical id upgrades monotonically', () => {
    const knowledge = createLocationKnowledge([{ id: 'cemetery:x', state: 'estimated', source: 'npc' }])
    const cemetery: WorldLocation = { id: 'cemetery:x', kind: 'cemetery', x: 100, z: 100, name: 'Cmentarz Stary', discoveryWeight: 0 }
    const catalog = fakeCatalog([cemetery])
    expect(countOpenRumourLeads(knowledge, catalog)).toBe(1)
    const deps = { catalog, knowledge, sampleTexel: () => ({ h: 1, floorH: 1 }) }
    expect(revealLandmarksOnArrival(deps, 100, 200)).toEqual([])
    expect(revealLandmarksOnArrival(deps, 120, 110)).toEqual([{ id: 'cemetery:x', name: 'Cmentarz Stary' }])
    expect(knowledge.get('cemetery:x')).toEqual({ id: 'cemetery:x', state: 'confirmed', source: 'exploration' })
    expect(countOpenRumourLeads(knowledge, catalog)).toBe(0)
    expect(knowledge.reveal('cemetery:x', 'estimated', 'npc')).toBe(false)
  })
})
