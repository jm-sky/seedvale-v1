import { describe, expect, it, vi } from 'vitest'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE, type WorldSpatialContext } from '../world/spatialContext'
import { isActorInfoSpatiallyVisible, type PlayerLabelSpatialView } from './observationSpatial'

const A = caveSpatialContext('cave-a')
const B = caveSpatialContext('cave-b')
const pos = { x: 0, y: 0, z: 0 }

function view(
  player: WorldSpatialContext,
  actor: WorldSpatialContext,
  mouth: (caveId: string) => boolean = () => false,
): PlayerLabelSpatialView & { cross: ReturnType<typeof vi.fn> } {
  const cross = vi.fn((caveId: string) => mouth(caveId))
  return {
    context: player,
    position: pos,
    resolveContextAt: () => actor,
    canPerceiveAcrossEntrance: cross,
    cross,
  }
}

describe('isActorInfoSpatiallyVisible (world-042 Stage 0)', () => {
  it('is visible without a view (unwired callers keep old behaviour)', () => {
    expect(isActorInfoSpatiallyVisible(undefined, pos)).toBe(true)
  })

  it('same context stays visible without consulting the mouth', () => {
    const surface = view(WORLD_SPATIAL_CONTEXT_SURFACE, WORLD_SPATIAL_CONTEXT_SURFACE)
    expect(isActorInfoSpatiallyVisible(surface, pos)).toBe(true)
    const cave = view(A, caveSpatialContext('cave-a'))
    expect(isActorInfoSpatiallyVisible(cave, pos)).toBe(true)
    expect(surface.cross).not.toHaveBeenCalled()
    expect(cave.cross).not.toHaveBeenCalled()
  })

  it('hides a cave actor from a surface player above the roof, both directions', () => {
    expect(isActorInfoSpatiallyVisible(view(WORLD_SPATIAL_CONTEXT_SURFACE, A), pos)).toBe(false)
    expect(isActorInfoSpatiallyVisible(view(A, WORLD_SPATIAL_CONTEXT_SURFACE), pos)).toBe(false)
  })

  it('shows through the matching cave mouth, keyed by the cave-side id', () => {
    const fromSurface = view(WORLD_SPATIAL_CONTEXT_SURFACE, A, (id) => id === 'cave-a')
    expect(isActorInfoSpatiallyVisible(fromSurface, pos)).toBe(true)
    expect(fromSurface.cross).toHaveBeenCalledWith('cave-a', pos, pos)
    const fromCave = view(A, WORLD_SPATIAL_CONTEXT_SURFACE, (id) => id === 'cave-a')
    expect(isActorInfoSpatiallyVisible(fromCave, pos)).toBe(true)
  })

  it('hides cave A vs cave B even if a mouth would pass', () => {
    const v = view(A, B, () => true)
    expect(isActorInfoSpatiallyVisible(v, pos)).toBe(false)
    expect(v.cross).not.toHaveBeenCalled()
  })
})
