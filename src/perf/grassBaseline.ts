import { InstancedMesh, type Object3D, type Scene } from 'three'

/**
 * V1 grass/flower baseline counters for C0 — resident vs submitted vs
 * generated, placement lifecycle, and coarse allocation provenance.
 * No V3 tile-pool / dirty-range internals.
 *
 * @domain world-terrain
 */

export type GrassBaselineLifecycle = {
  requests: number
  completions: number
  discardsUnloaded: number
  discardsOutOfRange: number
  cancels: number
  streamIns: number
  streamOuts: number
  invalidations: number
}

export type GrassBaselineSnapshot = {
  chunksResident: number
  instancesResidentFull: number
  instancesResidentFiller: number
  instancesSubmittedFull: number
  instancesSubmittedFiller: number
  /** InstancedMesh draw submissions currently visible (count > 0). */
  meshesSubmitted: number
  /** Estimated GPU buffer bytes from instance matrices + instanced attrs. */
  allocationBytesEstimated: number | null
  /** Actually observed upload bytes — unavailable on legacy V1 path. */
  uploadBytesObserved: number | null
  flowers: {
    /** Decorative flower clumps in vegetation (name-based). */
    instancesResident: number | null
    meshes: number | null
    status: 'observed' | 'unavailable'
  }
  lifecycle: GrassBaselineLifecycle
  finalization: {
    status: 'observed' | 'unobserved'
    chunksBuilt: number
    chunksEmpty: number
  }
  lod: {
    /** Best-effort: fraction of resident full instances currently submitted. */
    submittedFractionFull: number | null
    submittedFractionFiller: number | null
  }
}

type LifecycleTotals = GrassBaselineLifecycle

function emptyLifecycle(): LifecycleTotals {
  return {
    requests: 0,
    completions: 0,
    discardsUnloaded: 0,
    discardsOutOfRange: 0,
    cancels: 0,
    streamIns: 0,
    streamOuts: 0,
    invalidations: 0,
  }
}

export type GrassBaselineDiag = {
  reset: () => void
  recordRequest: () => void
  recordCompletion: () => void
  recordDiscard: (reason: 'unloaded' | 'outOfRange') => void
  recordCancel: () => void
  recordStreamIn: () => void
  recordStreamOut: () => void
  recordInvalidation: () => void
  lifecycle: () => GrassBaselineLifecycle
  /** Scene walk for resident/submitted grass + flower decorative counts. */
  snapshotScene: (scene: Scene) => GrassBaselineSnapshot
}

function isEffectivelyVisible(object: Object3D): boolean {
  let node: Object3D | null = object
  while (node) {
    if (!node.visible) return false
    node = node.parent
  }
  return true
}

function attributeByteLength(attr: { array?: ArrayLike<number> & { byteLength?: number } } | undefined): number {
  if (!attr?.array) return 0
  const arr = attr.array as { byteLength?: number; length: number }
  if (typeof arr.byteLength === 'number') return arr.byteLength
  return arr.length * 4
}

export function createGrassBaselineDiag(): GrassBaselineDiag {
  let life = emptyLifecycle()

  return {
    reset() {
      life = emptyLifecycle()
    },
    recordRequest() {
      life.requests += 1
    },
    recordCompletion() {
      life.completions += 1
    },
    recordDiscard(reason) {
      if (reason === 'unloaded') life.discardsUnloaded += 1
      else life.discardsOutOfRange += 1
    },
    recordCancel() {
      life.cancels += 1
    },
    recordStreamIn() {
      life.streamIns += 1
    },
    recordStreamOut() {
      life.streamOuts += 1
    },
    recordInvalidation() {
      life.invalidations += 1
    },
    lifecycle: () => ({ ...life }),
    snapshotScene(scene) {
      let chunksResident = 0
      let instancesResidentFull = 0
      let instancesResidentFiller = 0
      let instancesSubmittedFull = 0
      let instancesSubmittedFiller = 0
      let meshesSubmitted = 0
      let allocationBytesEstimated = 0
      let flowerInstances = 0
      let flowerMeshes = 0
      const seenGrassGroups = new Set<string>()

      scene.traverse((object) => {
        const name = object.name
        if (name === 'chunk-grass') {
          const key = object.uuid
          if (!seenGrassGroups.has(key)) {
            seenGrassGroups.add(key)
            chunksResident += 1
          }
        }

        if (object instanceof InstancedMesh && name.startsWith('chunk-grass-')) {
          const filler = name.endsWith('-filler')
            || object.userData.grassFiller === true
          const full = typeof object.userData.grassFullCount === 'number'
            ? object.userData.grassFullCount as number
            : object.count
          if (filler) {
            instancesResidentFiller += full
            if (isEffectivelyVisible(object) && object.count > 0) {
              instancesSubmittedFiller += object.count
              meshesSubmitted += 1
            }
          } else {
            instancesResidentFull += full
            if (isEffectivelyVisible(object) && object.count > 0) {
              instancesSubmittedFull += object.count
              meshesSubmitted += 1
            }
          }
          allocationBytesEstimated += attributeByteLength(object.instanceMatrix)
          const geo = object.geometry
          if (geo) {
            for (const key of Object.keys(geo.attributes)) {
              if (key.startsWith('a')) {
                allocationBytesEstimated += attributeByteLength(geo.getAttribute(key) as { array?: ArrayLike<number> & { byteLength?: number } })
              }
            }
          }
        }

        // Decorative flowers live under vegetation placements (plan 044).
        if (
          (name.includes('flower_clump') || name.includes('bush_flowers') || name.startsWith('flower'))
          && object instanceof InstancedMesh
        ) {
          flowerMeshes += 1
          flowerInstances += Math.max(0, object.count)
        } else if (
          (name.includes('flower_clump') || name.includes('bush_flowers'))
          && 'isMesh' in object
          && (object as { isMesh?: boolean }).isMesh
        ) {
          flowerMeshes += 1
          flowerInstances += 1
        }
      })

      // Finalization detail lives in grassFinalizationDiag; here we only
      // mark whether any placement lifecycle was observed this window.
      const finalizationObserved = life.completions > 0 || life.requests > 0

      return {
        chunksResident,
        instancesResidentFull,
        instancesResidentFiller,
        instancesSubmittedFull,
        instancesSubmittedFiller,
        meshesSubmitted,
        allocationBytesEstimated: allocationBytesEstimated > 0 ? allocationBytesEstimated : null,
        uploadBytesObserved: null,
        flowers: flowerMeshes > 0 || flowerInstances > 0
          ? { instancesResident: flowerInstances, meshes: flowerMeshes, status: 'observed' }
          : { instancesResident: null, meshes: null, status: 'unavailable' },
        lifecycle: { ...life },
        finalization: {
          status: finalizationObserved ? 'observed' : 'unobserved',
          chunksBuilt: life.completions,
          chunksEmpty: 0,
        },
        lod: {
          submittedFractionFull: instancesResidentFull > 0
            ? instancesSubmittedFull / instancesResidentFull
            : null,
          submittedFractionFiller: instancesResidentFiller > 0
            ? instancesSubmittedFiller / instancesResidentFiller
            : null,
        },
      }
    },
  }
}

let active: GrassBaselineDiag | null = null

export function setActiveGrassBaselineDiag(diag: GrassBaselineDiag | null): void {
  active = diag
}

export function getGrassBaselineDiag(): GrassBaselineDiag {
  if (!active) {
    // Lazy no-op-ish singleton so chunkManager hooks never throw before app init.
    active = createGrassBaselineDiag()
  }
  return active
}

export function formatGrassBaselineReport(snap: GrassBaselineSnapshot): string {
  const lines = [
    '[Seedvale Grass Baseline]',
    '',
    `Chunks resident: ${snap.chunksResident}`,
    `Resident instances: full=${snap.instancesResidentFull} filler=${snap.instancesResidentFiller}`,
    `Submitted instances: full=${snap.instancesSubmittedFull} filler=${snap.instancesSubmittedFiller}`,
    `Meshes submitted: ${snap.meshesSubmitted}`,
    `LOD submitted fraction: full=${snap.lod.submittedFractionFull ?? 'unavailable'} filler=${snap.lod.submittedFractionFiller ?? 'unavailable'}`,
    `Flowers: ${snap.flowers.status}`
      + (snap.flowers.status === 'observed'
        ? ` instances=${snap.flowers.instancesResident} meshes=${snap.flowers.meshes}`
        : ''),
    `Allocation bytes (estimated): ${snap.allocationBytesEstimated ?? 'unavailable'}`,
    `Upload bytes (observed): ${snap.uploadBytesObserved ?? 'unavailable'}`,
    `Lifecycle: req=${snap.lifecycle.requests} complete=${snap.lifecycle.completions} `
      + `discard(unload=${snap.lifecycle.discardsUnloaded},oor=${snap.lifecycle.discardsOutOfRange}) `
      + `cancel=${snap.lifecycle.cancels} streamIn=${snap.lifecycle.streamIns} streamOut=${snap.lifecycle.streamOuts} `
      + `invalidate=${snap.lifecycle.invalidations}`,
    `Finalization: ${snap.finalization.status} completions=${snap.finalization.chunksBuilt}`,
  ]
  return lines.join('\n')
}
