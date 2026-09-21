import { describe, expect, it } from 'vitest'
import {
  caveSpatialContext,
  WORLD_SPATIAL_CONTEXT_SURFACE,
} from '../world/spatialContext'
import { worldSoundSpatialContextsCompatible } from './worldAudioSpatial'

describe('worldSoundSpatialContextsCompatible (world-037)', () => {
  it('allows surface to surface', () => {
    expect(worldSoundSpatialContextsCompatible(
      WORLD_SPATIAL_CONTEXT_SURFACE,
      WORLD_SPATIAL_CONTEXT_SURFACE,
    )).toBe(true)
  })

  it('allows the same cave id', () => {
    const cave = caveSpatialContext('a')
    expect(worldSoundSpatialContextsCompatible(cave, cave)).toBe(true)
  })

  it('rejects different cave ids', () => {
    expect(worldSoundSpatialContextsCompatible(
      caveSpatialContext('a'),
      caveSpatialContext('b'),
    )).toBe(false)
  })

  it('rejects surface versus cave both ways', () => {
    const cave = caveSpatialContext('a')
    expect(worldSoundSpatialContextsCompatible(WORLD_SPATIAL_CONTEXT_SURFACE, cave)).toBe(false)
    expect(worldSoundSpatialContextsCompatible(cave, WORLD_SPATIAL_CONTEXT_SURFACE)).toBe(false)
  })

  it('falls back to compatible when either context is unknown', () => {
    expect(worldSoundSpatialContextsCompatible(null, WORLD_SPATIAL_CONTEXT_SURFACE)).toBe(true)
    expect(worldSoundSpatialContextsCompatible(caveSpatialContext('a'), null)).toBe(true)
    expect(worldSoundSpatialContextsCompatible(null, null)).toBe(true)
  })
})
