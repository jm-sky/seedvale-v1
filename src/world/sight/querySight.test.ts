import { describe, expect, it } from 'vitest'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE } from '../spatialContext'
import { createSightQueryOut, querySight, type SightObserver, type SightWorld } from './querySight'
import { createSightBlockerRegistry, type SightPanel } from './sightBlockers'

const SURFACE = WORLD_SPATIAL_CONTEXT_SURFACE

function makeWorld(over: Partial<SightWorld> = {}): SightWorld {
  return {
    blockers: createSightBlockerRegistry(),
    sampleHeight: () => 0,
    occupancyAt: () => null,
    canPerceiveAcrossEntrance: () => false,
    ...over,
  }
}

const eye = (x: number, y: number, z: number, context = SURFACE): SightObserver => ({ x, y, z, context })

function run(world: SightWorld, o: SightObserver, samples: number[], ctx = SURFACE, range = 50) {
  const out = createSightQueryOut()
  querySight(world, o, ctx, samples, samples.length / 3, range, out)
  return out
}

/** Wall across x=5, running along z, thickness 0.4, [0,3]. */
const wall = (extra: Partial<SightPanel> = {}): SightPanel => ({
  kind: 'panel', x: 5, z: 0, halfWidth: 4, halfDepth: 0.2, rotationY: Math.PI / 2, minY: 0, maxY: 3, ...extra,
})

describe('querySight blockers', () => {
  it('a wall panel blocks', () => {
    const w = makeWorld()
    w.blockers.setBlockers('h', [wall()])
    const out = run(w, eye(0, 1.6, 0), [10, 1, 0])
    expect(out.result).toBe('blocked')
    expect(out.reason).toBe('blocker')
  })

  it('no blockers → clear', () => {
    expect(run(makeWorld(), eye(0, 1.6, 0), [10, 1, 0]).result).toBe('clear')
  })

  it('a window aperture transmits and blocks just outside it', () => {
    // Panel local x axis for rotationY=π/2 is world (0, 1): offsetX maps to z.
    const w = makeWorld()
    w.blockers.setBlockers('h', [wall({ apertures: [{ offsetX: 0, halfWidth: 0.5, minY: 1, maxY: 2 }] })])
    expect(run(w, eye(0, 1.5, 0), [10, 1.5, 0]).result).toBe('clear')
    // Through the wall at z=+1 (outside the 0.5 half width).
    expect(run(w, eye(0, 1.5, 1), [10, 1.5, 1]).result).toBe('blocked')
    // Above the aperture.
    expect(run(w, eye(0, 2.5, 0), [10, 2.5, 0]).result).toBe('blocked')
  })

  it('open door (aperture only) transmits, closed door (leaf panel) blocks', () => {
    const door = { offsetX: 0, halfWidth: 0.65, minY: 0, maxY: 2.1 }
    const open = makeWorld()
    open.blockers.setBlockers('h', [wall({ apertures: [door] })])
    expect(run(open, eye(0, 1.2, 0), [10, 1.2, 0]).result).toBe('clear')
    const closed = makeWorld()
    const leaf: SightPanel = { kind: 'panel', x: 5, z: 0, halfWidth: 0.56, halfDepth: 0.06, rotationY: Math.PI / 2, minY: 0, maxY: 2.1 }
    closed.blockers.setBlockers('h', [wall({ apertures: [door] }), leaf])
    expect(run(closed, eye(0, 1.2, 0), [10, 1.2, 0]).result).toBe('blocked')
  })

  it('a low wall blocks a low target from the ground but not from an elevated observer', () => {
    const w = makeWorld()
    w.blockers.setBlockers('f', [wall({ maxY: 1 })])
    expect(run(w, eye(0, 0.5, 0), [10, 0.5, 0]).result).toBe('blocked')
    expect(run(w, eye(0, 6, 0), [10, 0.3, 0]).result).toBe('clear')
  })

  it('a roof slab blocks from above (hill observer looking into a house)', () => {
    const w = makeWorld()
    const roof: SightPanel = { kind: 'panel', x: 10, z: 0, halfWidth: 3, halfDepth: 3, rotationY: 0, minY: 3, maxY: 4.5 }
    w.blockers.setBlockers('h', [roof])
    // Observer 8 m up at x=0 → target at floor level x=10 inside: steep line crosses the slab band.
    expect(run(w, eye(0, 8, 0), [10, 1, 0]).result).toBe('blocked')
    // Same target from a ground observer through the open sides (below the slab): clear.
    expect(run(w, eye(0, 1.6, 0), [10, 1, 0]).result).toBe('clear')
  })

  it('first clear sample wins and sets its clearMask bit', () => {
    const w = makeWorld()
    w.blockers.setBlockers('f', [wall({ maxY: 1 })])
    // sample 0 low (blocked), sample 1 high above the wall (clear)
    const out = run(w, eye(0, 1.6, 0), [10, 0.3, 0, 10, 2.5, 0])
    expect(out.result).toBe('clear')
    expect(out.clearMask).toBe(2)
  })

  it('finds a long panel whose centre is outside the segment’s cells', () => {
    const w = makeWorld()
    w.blockers.setBlockers('h', [{ kind: 'panel', x: 0, z: 5, halfWidth: 40, halfDepth: 0.2, rotationY: 0, minY: 0, maxY: 3 }])
    expect(run(w, eye(30, 1.5, 0), [30, 1.5, 10]).result).toBe('blocked')
  })

  it('cylinder blocks', () => {
    const w = makeWorld()
    w.blockers.setBlockers('r', [{ kind: 'cylinder', x: 5, z: 0, radius: 1, minY: 0, maxY: 2 }])
    expect(run(w, eye(0, 1, 0), [10, 1, 0]).result).toBe('blocked')
  })
})

describe('querySight terrain', () => {
  const ridge = (x: number, z: number): number => 4 * Math.exp(-((x - 10) ** 2) / 4) + 0 * z

  it('a ridge blocks; a target on the crest clears', () => {
    const w = makeWorld({ sampleHeight: ridge })
    expect(run(w, eye(0, 1.6, 0), [20, 1, 0]).result).toBe('blocked')
    expect(run(w, eye(0, 1.6, 0), [20, 1, 0]).reason).toBe('terrain')
    // Target on crest at x=10, height 4.
    expect(run(w, eye(0, 1.6, 0), [10, 4.5, 0]).result).toBe('clear')
  })
})

describe('querySight caves', () => {
  const A = caveSpatialContext('A')
  const B = caveSpatialContext('B')

  it('same cave: rock between blocks, void is clear', () => {
    const rock = makeWorld({ occupancyAt: (x) => (x > 4 && x < 6 ? null : {}) })
    expect(run(rock, eye(0, 1, 0, A), [10, 1, 0], A).result).toBe('blocked')
    expect(run(rock, eye(0, 1, 0, A), [10, 1, 0], A).reason).toBe('cave')
    const void_ = makeWorld({ occupancyAt: () => ({}) })
    expect(run(void_, eye(0, 1, 0, A), [10, 1, 0], A).result).toBe('clear')
  })

  it('surface vs cave without corridor → blocked (context); through corridor → clear', () => {
    const none = makeWorld()
    const out = run(none, eye(0, 1, 0), [10, 1, 0], A)
    expect(out.result).toBe('blocked')
    expect(out.reason).toBe('context')
    const corridor = makeWorld({ canPerceiveAcrossEntrance: (id) => id === 'A' })
    expect(run(corridor, eye(0, 1, 0), [10, 1, 0], A).result).toBe('clear')
    expect(run(corridor, eye(0, 1, 0, A), [10, 1, 0], SURFACE).result).toBe('clear')
  })

  it('cave A vs cave B → blocked', () => {
    const w = makeWorld({ canPerceiveAcrossEntrance: () => true })
    const out = run(w, eye(0, 1, 0, A), [10, 1, 0], B)
    expect(out.result).toBe('blocked')
    expect(out.reason).toBe('context')
  })
})

describe('querySight unknown', () => {
  it('range → unknown', () => {
    const out = run(makeWorld(), eye(0, 1, 0), [100, 1, 0], SURFACE, 50)
    expect(out.result).toBe('unknown')
    expect(out.reason).toBe('range')
  })

  it('isAreaReady false → unknown', () => {
    const out = run(makeWorld({ isAreaReady: () => false }), eye(0, 1, 0), [10, 1, 0])
    expect(out.result).toBe('unknown')
    expect(out.reason).toBe('unloaded')
  })

  it('no samples → unknown', () => {
    const out = createSightQueryOut()
    querySight(makeWorld(), eye(0, 1, 0), SURFACE, [], 0, 50, out)
    expect(out.result).toBe('unknown')
  })
})
