/** Instanced ash marks for player-fire residue (plan items-player-058).
 *  Pattern follows `bloodOverlay.ts`: one fixed-capacity InstancedMesh, no
 *  mesh/material per mark, ground height from the sampler at sync time. */

import * as THREE from 'three'
import type { HeightSampler } from '../player/PlayerController'

const OVERLAY_CAPACITY = 128
const Y_EPSILON = 0.018
const ATLAS_PX = 128

export type FireResidueOverlayPlacement = {
  x: number
  z: number
  rotation: number
  scale: number
}

export type FireResidueOverlaySystem = {
  group: THREE.Group
  sync: (placements: readonly FireResidueOverlayPlacement[]) => void
  dispose: () => void
}

function makeRandom(seed: number): () => number {
  let state = seed >>> 0 || 1
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

function buildAshTexture(): THREE.DataTexture {
  const size = ATLAS_PX
  const data = new Uint8Array(size * size * 4)
  const random = makeRandom(0x51a5e)
  const cx = size / 2
  const cy = size / 2
  const blobs = Array.from({ length: 7 }, () => {
    const angle = random() * Math.PI * 2
    const dist = random() * size * 0.22
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: size * (0.14 + random() * 0.2),
      shade: 28 + Math.floor(random() * 22),
    }
  })
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let alpha = 0
      let shade = 32
      for (const blob of blobs) {
        const dx = x - blob.x
        const dy = y - blob.y
        const t = Math.sqrt(dx * dx + dy * dy) / blob.r
        if (t >= 1) continue
        const a = (1 - t) * (1 - t)
        if (a > alpha) {
          alpha = a
          shade = blob.shade
        }
      }
      const i = (y * size + x) * 4
      data[i] = shade
      data[i + 1] = Math.max(0, shade - 4)
      data[i + 2] = Math.max(0, shade - 8)
      data[i + 3] = Math.round(alpha * 220)
    }
  }
  const texture = new THREE.DataTexture(data, size, size)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

/**
 * Batched ground overlay for short-lived campfire ash. Presentation only —
 * residue identity and expiry live in `world/fireResidues.ts`.
 */
export function createFireResidueOverlaySystem(
  sampleHeight: HeightSampler,
): FireResidueOverlaySystem {
  const group = new THREE.Group()
  group.name = 'FireResidueOverlay'
  const geometry = new THREE.CircleGeometry(1, 12)
  geometry.rotateX(-Math.PI / 2)
  const texture = buildAshTexture()
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  })
  const mesh = new THREE.InstancedMesh(geometry, material, OVERLAY_CAPACITY)
  mesh.frustumCulled = false
  mesh.count = 0
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  group.add(mesh)

  const scratch = new THREE.Object3D()

  const sync = (placements: readonly FireResidueOverlayPlacement[]): void => {
    const count = Math.min(placements.length, OVERLAY_CAPACITY)
    for (let i = 0; i < count; i++) {
      const p = placements[i]!
      scratch.position.set(p.x, sampleHeight(p.x, p.z) + Y_EPSILON, p.z)
      scratch.rotation.set(0, p.rotation, 0)
      scratch.scale.set(p.scale, 1, p.scale)
      scratch.updateMatrix()
      mesh.setMatrixAt(i, scratch.matrix)
    }
    mesh.count = count
    mesh.instanceMatrix.needsUpdate = true
    if (count > 0) mesh.computeBoundingSphere()
  }

  return {
    group,
    sync,
    dispose() {
      group.removeFromParent()
      mesh.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    },
  }
}
