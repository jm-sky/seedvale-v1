import { describe, expect, it } from 'vitest'
import { TEST_HOUSE_01, TEST_HOUSE_02 } from '../../assets/houseDefinitionExample'
import { WORLD_SPATIAL_CONTEXT_SURFACE } from '../spatialContext'
import { buildHouseSightBlockersWorld } from './houseSightBlockers'
import { createSightQueryOut, querySight, type SightWorld } from './querySight'
import { createSightBlockerRegistry } from './sightBlockers'

const WALL_TOP = 3.123

function worldFor(blockers: ReturnType<typeof buildHouseSightBlockersWorld>): SightWorld {
  const reg = createSightBlockerRegistry()
  reg.setBlockers('house', blockers)
  return { blockers: reg, sampleHeight: () => 0, occupancyAt: () => null, canPerceiveAcrossEntrance: () => false }
}

function look(world: SightWorld, from: [number, number, number], to: [number, number, number]): string {
  const out = createSightQueryOut()
  querySight(world, { x: from[0], y: from[1], z: from[2], context: WORLD_SPATIAL_CONTEXT_SURFACE }, WORLD_SPATIAL_CONTEXT_SURFACE, to, 1, 60, out)
  return out.result
}

// TEST_HOUSE_02 (4×2): front wall at z = -1; door module 0 at x = -1, window module 1 at x = +1.
describe('buildHouseSightBlockersWorld', () => {
  it('one panel per wall module, a roof slab, and a leaf per closed door', () => {
    const open = buildHouseSightBlockersWorld(TEST_HOUSE_02, 0, 0, 0, 0, [false], WALL_TOP)
    const closed = buildHouseSightBlockersWorld(TEST_HOUSE_02, 0, 0, 0, 0, [true], WALL_TOP)
    expect(open.length).toBe(TEST_HOUSE_02.walls.length + 1)
    expect(closed.length).toBe(open.length + 1)
  })

  it('wall blocks, window transmits, open door transmits, closed door blocks (yaw 0)', () => {
    const open = worldFor(buildHouseSightBlockersWorld(TEST_HOUSE_02, 0, 0, 0, 0, [false], WALL_TOP))
    // Through the window module (x=+1) at eye height.
    expect(look(open, [1, 1.6, -6], [1, 1.6, 0])).toBe('clear')
    // Through plain wall... the left wall (x=-2) has no opening in TEST_HOUSE_02.
    expect(look(open, [-8, 1.6, 0], [0, 1.6, 0])).toBe('blocked')
    // Through the door gap.
    expect(look(open, [-1, 1.2, -6], [-1, 1.2, 0])).toBe('clear')
    // Beside the window (jamb), same wall.
    expect(look(open, [1.9, 1.6, -6], [1.9, 1.6, 0])).toBe('blocked')
    const closed = worldFor(buildHouseSightBlockersWorld(TEST_HOUSE_02, 0, 0, 0, 0, [true], WALL_TOP))
    expect(look(closed, [-1, 1.2, -6], [-1, 1.2, 0])).toBe('blocked')
  })

  it('is yaw-consistent: rotating house and observer together keeps results', () => {
    const yaw = 0.7
    const open = worldFor(buildHouseSightBlockersWorld(TEST_HOUSE_02, 20, 0, -5, yaw, [false], WALL_TOP))
    const c = Math.cos(yaw)
    const s = Math.sin(yaw)
    // house-local (lx, lz) → world, same mapping as transformHouseCollidersToWorld.
    const toWorld = (lx: number, y: number, lz: number): [number, number, number] => [20 + lx * c + lz * s, y, -5 - lx * s + lz * c]
    expect(look(open, toWorld(-1, 1.2, -6), toWorld(-1, 1.2, 0))).toBe('clear')
    expect(look(open, toWorld(1, 1.6, -6), toWorld(1, 1.6, 0))).toBe('clear')
    expect(look(open, toWorld(-8, 1.6, 0), toWorld(0, 1.6, 0))).toBe('blocked')
    const closed = worldFor(buildHouseSightBlockersWorld(TEST_HOUSE_02, 20, 0, -5, yaw, [true], WALL_TOP))
    expect(look(closed, toWorld(-1, 1.2, -6), toWorld(-1, 1.2, 0))).toBe('blocked')
  })

  it('roof slab blocks from a hill above; floor Y offsets everything', () => {
    const w = worldFor(buildHouseSightBlockersWorld(TEST_HOUSE_01, 0, 10, 0, 0, [false], WALL_TOP))
    expect(look(w, [-12, 20, 0], [0, 11, 0])).toBe('blocked')
    // Level observer at floor+1.2 through the door still clears (door at x=-1... front side z=-1).
    expect(look(w, [-1, 11.2, -6], [-1, 11.2, 0])).toBe('clear')
    expect(look(w, [-1, 1.2, -6], [-1, 1.2, 0])).toBe('clear') // far below the house: nothing there
  })

  it('scale multiplies sizes and heights', () => {
    const a = buildHouseSightBlockersWorld(TEST_HOUSE_01, 0, 0, 0, 0, [false], WALL_TOP, 2)
    const roof = a[a.length - 1]!
    expect(roof.maxY).toBeCloseTo((WALL_TOP + 1.5) * 2)
  })
})
