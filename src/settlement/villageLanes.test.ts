import { describe, expect, it } from 'vitest'
import type { VillageIdentity } from './villagePlan'
import { generateFamilies } from './families'
import { pointInYard } from './householdYard'
import { storehousePlotId } from './villagePlan'
import { planLocalPathsAndEntrances, planVillageLayout } from './villagePlanner'

const flat = (): number => 12
const SIZES: VillageIdentity['size'][] = ['SM', 'MD', 'LG', 'XL']
const SEEDS = Array.from({ length: 12 }, (_, i) => i * 7 + 1)

function identity(size: VillageIdentity['size'], seed: number): VillageIdentity {
  return {
    id: `lane_${size}_${seed}`,
    size,
    cell: { gx: 0, gz: 0 },
    isHome: false,
    terrain: 'forest',
    dominantResource: null,
    foodSourceType: 'garden',
    name: 'Testowo',
    nameCulture: 'polish',
    character: 'default',
  }
}

function layoutFor(size: VillageIdentity['size'], seed: number) {
  const id = identity(size, seed)
  const families = generateFamilies(seed, size, false, 'polish')
  const layout = planVillageLayout(id, { x: 0, z: 0, y: 12 }, families, seed, flat, 0)
  return { id, layout }
}

function dense(points: readonly { x: number, z: number }[]): { x: number, z: number }[] {
  const out: { x: number, z: number }[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 1.5))
    for (let k = 0; k < n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n })
  }
  out.push(points[points.length - 1]!)
  return out
}

describe('village lane network (Q57)', () => {
  it('keeps lanes out of non-plaza plots and yards (census rules), allowing a tiny unresolved tail', () => {
    let lanes = 0
    let plotHits = 0
    let yardHits = 0
    for (const size of SIZES) {
      for (const seed of SEEDS) {
        const { layout } = layoutFor(size, seed)
        for (const path of layout.paths) {
          if (path.id === 'path-pasture' || path.id === 'path-paddock') continue
          lanes++
          const pts = dense(path.points)
          const ends = [path.points[0]!, path.points[path.points.length - 1]!]
          const hitsPlot = layout.plots.some(
            (pl) =>
              !/market|campfire|notice|plot-infra-well$/.test(pl.id) &&
              ends.every((e) => Math.hypot(e.x - pl.x, e.z - pl.z) > pl.radius) &&
              pts.some((d) => Math.hypot(d.x - pl.x, d.z - pl.z) < pl.radius * 0.8),
          )
          if (hitsPlot) plotHits++
          if (layout.plots.some((pl) => pl.yard && pts.some((d) => pointInYard(pl.yard!, d.x, d.z)))) yardHits++
        }
      }
    }
    expect(lanes).toBeGreaterThan(500)
    expect(plotHits / lanes).toBeLessThan(0.005)
    expect(yardHits / lanes).toBeLessThan(0.005)
  })

  it('ends a lane at every selected house door and at the storehouse bay', () => {
    for (const size of SIZES) {
      for (const seed of SEEDS.slice(0, 5)) {
        const { layout } = layoutFor(size, seed)
        const houseLanes = layout.paths.filter((p) => p.id.startsWith('path-house-') && !p.id.includes('fallback'))
        
        for (const lane of houseLanes) {
          const end = lane.points[lane.points.length - 1]!
          const near = layout.plots.some(
            (pl) => pl.role === 'house' && Math.abs(Math.hypot(end.x - pl.x, end.z - pl.z) - pl.radius) < 0.5,
          )
          expect(near, `${size} ${seed} ${lane.id} ends at a door`).toBe(true)
        }
        const store = layout.plots.find((p) => p.storehouse)
        if (store) {
          // Either its own spur or a lane already passes it, or the bay sits on the plaza rim.
          const bay = store.storehouse!.baySlots[0]!
          const reached = layout.paths.some((p) =>
            dense(p.points).some((d) => Math.hypot(d.x - bay.x, d.z - bay.z) < 3))
          const onPlaza = Math.hypot(bay.x - layout.center.x, bay.z - layout.center.z) < layout.plaza.radius + 3
          expect(reached || onPlaza, `${size} ${seed} storehouse bay reached`).toBe(true)
        }
      }
    }
  })

  it('shares lanes: fewer lanes than a spoke per destination and deterministic', () => {
    const { id, layout } = layoutFor('LG', 7)
    const again = planLocalPathsAndEntrances({
      identity: id,
      center: layout.center,
      boundary: layout.boundary,
      pattern: layout.pattern,
      zones: layout.zones,
      plots: layout.plots,
      landmarks: layout.landmarks,
      seedForCell: 7,
      sampleHeight: flat,
      waterLevel: 0,
    })
    const core = layout.paths.filter((p) => p.id !== 'path-pasture' && p.id !== 'path-paddock')
    expect(again.paths).toEqual(core)
    expect(again.unresolvedLanes.length).toBeLessThanOrEqual(1)
  })
})

describe('lane clearance around buildings (Q93)', () => {
  it('never routes a lane centreline through a house or storehouse footprint', () => {
    let lanes = 0
    for (const size of SIZES) {
      for (const seed of SEEDS) {
        const { layout } = layoutFor(size, seed)
        const buildings = layout.plots.filter((p) => p.role === 'house' || p.id === storehousePlotId())
        for (const path of layout.paths) {
          lanes++
          const pts = dense(path.points)
          for (const b of buildings) {
            // A lane may end at its own building's door (on the footprint rim).
            if (path.id.endsWith(b.id.replace('plot-', ''))) continue
            const inside = pts.some((d) => Math.hypot(d.x - b.x, d.z - b.z) < b.radius * 0.9 - 0.05)
            expect(inside, `${size} ${seed} ${path.id} through ${b.id}`).toBe(false)
          }
        }
      }
    }
    expect(lanes).toBeGreaterThan(500)
  })
})
