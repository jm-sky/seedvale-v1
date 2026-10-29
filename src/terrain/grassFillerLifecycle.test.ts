import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import type { GrassBucketData, GrassChunkData } from './grassPlacement'
import { grassFillerLodFraction } from './distanceLod'
import { createGrassSystem } from './grass'

function bucket(count: number): GrassBucketData {
  return {
    count,
    matrices: new Float32Array(count * 16),
    phases: new Float32Array(count),
    baseColors: new Float32Array(count * 3),
    tipColors: new Float32Array(count * 3),
    windFactors: new Float32Array(count),
    bounds: { centerX: 0, centerY: 0, centerZ: 0, radius: 10 },
  }
}

const mainData = (): GrassChunkData => ({ tri: bucket(40) })
const fillerData = (): GrassChunkData => ({ filler: bucket(100) })
const fillerMeshes = (g: THREE.Group) => g.children.filter((c) => c.name === 'chunk-grass-filler')

describe('filler range boundary (CA1 gate = grassFillerLodFraction support)', () => {
  it('filler fraction is positive exactly when dist < fillerRadius, for all lodScale', () => {
    for (const radius of [1, 1.6, 3.4, 6]) {
      for (const lodScale of [0.25, 0.6, 1]) {
        for (let dist = 0; dist <= 8; dist++) {
          expect(grassFillerLodFraction(dist, radius, lodScale) > 0).toBe(dist < radius)
        }
      }
    }
  })
})

describe('WorldGrassChunk filler attach/release (CA1)', () => {
  it('main-only chunk has no filler mesh until attached', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(mainData(), 0, 0)!
    expect(grass.hasFiller()).toBe(false)
    expect(fillerMeshes(grass.mesh)).toHaveLength(0)
    grass.attachFiller(fillerData())
    expect(grass.hasFiller()).toBe(true)
    expect(fillerMeshes(grass.mesh)).toHaveLength(1)
  })

  it('attaching twice never duplicates the filler mesh', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(mainData(), 0, 0)!
    grass.attachFiller(fillerData())
    grass.attachFiller(fillerData())
    expect(fillerMeshes(grass.mesh)).toHaveLength(1)
  })

  it('attached filler is controlled by the existing LOD fraction and starts hidden', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(mainData(), 0, 0)!
    grass.attachFiller(fillerData())
    const mesh = fillerMeshes(grass.mesh)[0] as THREE.InstancedMesh
    expect(mesh.count).toBe(0)
    grass.setLodFraction(1, 0.5)
    expect(mesh.count).toBe(50)
    grass.setLodFraction(1, 0)
    expect(mesh.count).toBe(0)
  })

  it('release removes and disposes the filler mesh only; main stays; re-attach restores it', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(mainData(), 0, 0)!
    grass.attachFiller(fillerData())
    const mesh = fillerMeshes(grass.mesh)[0] as THREE.InstancedMesh
    let disposed = false
    mesh.addEventListener('dispose', () => { disposed = true })
    grass.releaseFiller()
    expect(disposed).toBe(true)
    expect(grass.hasFiller()).toBe(false)
    expect(grass.hasMain()).toBe(true)
    expect(fillerMeshes(grass.mesh)).toHaveLength(0)
    expect(grass.mesh.children).toHaveLength(1)
    grass.attachFiller(fillerData())
    expect(fillerMeshes(grass.mesh)).toHaveLength(1)
  })

  it('filler-only chunk reports no main and disposes cleanly', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(fillerData(), 0, 0)!
    expect(grass.hasMain()).toBe(false)
    grass.releaseFiller()
    expect(grass.mesh.children).toHaveLength(0)
    grass.dispose()
  })
})

describe('WorldGrassChunk capped main regrowth (CA2)', () => {
  const triMesh = (g: THREE.Group) => g.children.find((c) => c.name === 'chunk-grass-tri') as THREE.InstancedMesh
  const capped = (): GrassChunkData => ({ tri: { ...bucket(8), potentialCount: 100 } })
  const uncapped = (): GrassChunkData => ({ tri: bucket(100) })

  it('draws the same counts as the uncapped chunk at or below the cap', () => {
    const a = createGrassSystem().buildGrassChunkMeshes(capped(), 0, 0)!
    const b = createGrassSystem().buildGrassChunkMeshes(uncapped(), 0, 0)!
    for (const fraction of [0, 0.01, 0.05, 0.08]) {
      a.setLodFraction(fraction)
      b.setLodFraction(fraction)
      expect(triMesh(a.mesh).count).toBe(triMesh(b.mesh).count)
      expect(a.needsMainRegrowth(fraction)).toBe(false)
    }
    expect(b.needsMainRegrowth(1)).toBe(false)
  })

  it('needs regrowth above the cap and draws only the stored prefix until it lands', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(capped(), 0, 0)!
    expect(grass.needsMainRegrowth(0.76)).toBe(true)
    grass.setLodFraction(0.76)
    expect(triMesh(grass.mesh).count).toBe(8)
  })

  it('replaceMain swaps main buckets, keeps filler, disposes the old mesh', () => {
    const grass = createGrassSystem().buildGrassChunkMeshes(capped(), 0, 0)!
    grass.attachFiller(fillerData())
    const old = triMesh(grass.mesh)
    let disposed = false
    old.addEventListener('dispose', () => { disposed = true })
    grass.replaceMain(uncapped())
    expect(disposed).toBe(true)
    expect(grass.hasFiller()).toBe(true)
    expect(grass.mesh.children.filter((c) => c.name === 'chunk-grass-tri')).toHaveLength(1)
    grass.setLodFraction(0.76)
    expect(triMesh(grass.mesh).count).toBe(76)
    expect(grass.needsMainRegrowth(1)).toBe(false)
  })
})
