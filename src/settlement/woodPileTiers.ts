import * as THREE from 'three'
import type { SettlementContentKind } from '../perf/sceneCensus'
import { loadGltfAsset } from '../assets/loadGltf'
import { tagSettlementShadowKind, type TerrainSampler } from './propUtils'
import { WOOD_PILE_STAGES, type WoodPileStage, type WoodPileVisual, woodPileVisualState } from './storageVisuals'

/**
 * Instanced firewood-tier rendering for the quantity-driven wood piles
 * (plan settlements-npcs-025 follow-up, V2-donor stockpile optimisation).
 *
 * Presentation only: quantity → stage stays `woodPileStage` in
 * `storageVisuals.ts`; this module only maps each stage to a V2-derived tier
 * mesh and renders it. One immutable geometry per tier and one shared material
 * are baked once per app; every settlement owns a few lazily-created
 * `InstancedMesh`es (one per tier in use, per shadow kind) whose instance
 * matrices are rewritten only when a slot's tier changes.
 *
 * @domain settlements-npcs
 * @system storage-visuals
 * @role Renders wood-pile tiers as shared-geometry instanced meshes with change-driven slot updates.
 */

export const WOOD_PILE_TIERS_URL = '/models/settlement/wood_pile_tiers.glb'

/** Presentation-only mapping of the V1 quantity stages to V2 firewood tier nodes. */
export const WOOD_PILE_TIER_NODES: Readonly<Record<WoodPileStage, string>> = {
  Pile_01: 'pile_firewood_1',
  Pile_05: 'pile_firewood_5',
  Pile_10: 'pile_firewood_7',
  Pile_18: 'pile_firewood_14',
  Pile_29: 'pile_firewood_20',
}

/** V2 tiers are authored at 1 unit = 1 m (largest ≈ 1.25×1.0×1.4 m); the V1
 *  piles they replace were height-fitted to `WOOD_PILE_HEIGHT` (largest
 *  ≈ 1.9×1.35×2.4 m). Uniform scale keeps footprints inside the V1 envelope
 *  (collider radius `WOOD_PILE_COLLISION_RADIUS` unchanged). */
export const WOOD_PILE_TIER_SCALE = 1.4

export type WoodPileTierTemplates = {
  /** Origin on the ground at the slot centre, `WOOD_PILE_TIER_SCALE` already baked in. */
  geometries: Readonly<Record<WoodPileStage, THREE.BufferGeometry>>
  material: THREE.Material
}

/**
 * Bakes one immutable geometry per tier from a loaded tier GLB root. Pure
 * w.r.t. the root (clones geometry, never mutates the loader cache). Returns
 * null when any tier node is missing, is not exactly one mesh, or the tiers do
 * not share one material — callers then use the legacy progressive pile.
 */
export function bakeWoodPileTierTemplates(root: THREE.Object3D): WoodPileTierTemplates | null {
  root.updateMatrixWorld(true)
  const geometries = {} as Record<WoodPileStage, THREE.BufferGeometry>
  let material: THREE.Material | null = null
  const scale = new THREE.Matrix4().makeScale(WOOD_PILE_TIER_SCALE, WOOD_PILE_TIER_SCALE, WOOD_PILE_TIER_SCALE)
  for (const stage of WOOD_PILE_STAGES) {
    const node = root.getObjectByName(WOOD_PILE_TIER_NODES[stage])
    if (!node) return null
    const meshes: THREE.Mesh[] = []
    node.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh)
    })
    if (meshes.length !== 1) return null
    const mesh = meshes[0]!
    if (Array.isArray(mesh.material)) return null
    if (material && material !== mesh.material) return null
    material = mesh.material
    const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(scale)
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
    geometry.userData.sharedGpu = true
    geometries[stage] = geometry
  }
  if (!material) return null
  material.userData.sharedGpu = true
  return { geometries, material }
}

let templatesPromise: Promise<WoodPileTierTemplates | null> | null = null

/** Loads and bakes the tier templates once per app; null on any failure (logged once). */
export function loadWoodPileTierTemplates(): Promise<WoodPileTierTemplates | null> {
  templatesPromise ??= loadGltfAsset(WOOD_PILE_TIERS_URL)
    .then((asset) => {
      const templates = bakeWoodPileTierTemplates(asset.root)
      if (!templates) console.warn(`[settlement] ${WOOD_PILE_TIERS_URL} is missing firewood tier nodes, using fallback`)
      return templates
    })
    .catch((err) => {
      console.warn(`[settlement] failed to load ${WOOD_PILE_TIERS_URL}, using fallback`, err)
      return null
    })
  return templatesPromise
}

export type WoodPilePoint = { x: number, z: number }

export type WoodPileTierPool = {
  /** Contains the lazily-created per-tier `InstancedMesh`es; tagged with the pool's shadow kind. */
  group: THREE.Group
  /** Sets (or hides, with `null`) the tier shown at slot `index`. No-op when unchanged. */
  setStage: (index: number, stage: WoodPileStage | null) => void
}

/**
 * Fixed-capacity slot pool: slot `i` sits at `points[i]` on the ground. Only
 * the old and new tier meshes of a changed slot are rewritten (≤ slot count
 * matrices), never the whole settlement. Meshes are disposed with the owning
 * settlement group (`disposeObject3D` frees each `InstancedMesh` buffer and
 * skips the `sharedGpu` geometry/material).
 */
export function createWoodPileTierPool(
  templates: WoodPileTierTemplates,
  points: readonly WoodPilePoint[],
  sampleHeight: TerrainSampler,
  shadowKind: SettlementContentKind,
  name: string,
): WoodPileTierPool {
  const group = new THREE.Group()
  group.name = name
  tagSettlementShadowKind(group, shadowKind)

  const matrices = points.map((p) => new THREE.Matrix4().makeTranslation(p.x, sampleHeight(p.x, p.z), p.z))
  const slotStages: (WoodPileStage | null)[] = points.map(() => null)
  const meshes = new Map<WoodPileStage, THREE.InstancedMesh>()

  const rebuild = (stage: WoodPileStage): void => {
    let mesh = meshes.get(stage)
    if (!mesh) {
      mesh = new THREE.InstancedMesh(templates.geometries[stage], templates.material, Math.max(1, points.length))
      mesh.name = `${name}:${stage}`
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      meshes.set(stage, mesh)
      group.add(mesh)
    }
    let n = 0
    for (let i = 0; i < slotStages.length; i++) {
      if (slotStages[i] === stage) mesh.setMatrixAt(n++, matrices[i]!)
    }
    mesh.count = n
    mesh.visible = n > 0
    mesh.instanceMatrix.needsUpdate = true
    // Cached sphere would cull/keep the wrong instances after a slot change.
    mesh.computeBoundingSphere()
  }

  return {
    group,
    setStage(index, stage) {
      const previous = slotStages[index]
      if (previous === undefined || previous === stage) return
      slotStages[index] = stage
      if (previous) rebuild(previous)
      if (stage) rebuild(stage)
    },
  }
}

export type InstancedWoodPileVisuals = {
  /** Primary + overflow piles of the settlement stockpile. */
  settlement: WoodPileVisual
  /** One per household yard, index-aligned with the input points. */
  households: WoodPileVisual[]
  /** Groups to add to the settlement group. */
  groups: THREE.Group[]
}

/**
 * Builds the quantity-driven wood piles as instanced pools. Each controller
 * keeps `WoodPileVisual`'s contract: `sync(quantity)` is change-driven and
 * never mutates economy state. Primary, overflow and household piles stay in
 * separate pools so shadow-census attribution per kind is preserved.
 */
export function createInstancedWoodPileVisuals(
  templates: WoodPileTierTemplates,
  placements: {
    primary: WoodPilePoint
    overflow: readonly WoodPilePoint[]
    households: readonly WoodPilePoint[]
  },
  sampleHeight: TerrainSampler,
): InstancedWoodPileVisuals {
  const primary = createWoodPileTierPool(
    templates, [placements.primary], sampleHeight, 'storageWoodSettlementPrimary', 'settlement-wood-primary',
  )
  const overflow = createWoodPileTierPool(
    templates, placements.overflow, sampleHeight, 'storageWoodSettlementOverflow', 'settlement-wood-overflow',
  )
  const household = createWoodPileTierPool(
    templates, placements.households, sampleHeight, 'storageWoodHousehold', 'settlement-wood-household',
  )

  let lastSettlementSignature = ''
  const settlement: WoodPileVisual = {
    sync(quantity) {
      const state = woodPileVisualState(quantity)
      const signature = `${state.stage}|${state.extraPiles}`
      if (signature === lastSettlementSignature) return
      lastSettlementSignature = signature
      primary.setStage(0, state.stage)
      // Overflow piles always show the largest tier (as the legacy full piles did).
      for (let i = 0; i < placements.overflow.length; i++) {
        overflow.setStage(i, i < state.extraPiles ? 'Pile_29' : null)
      }
    },
    dispose() { /* meshes are owned by the settlement group */ },
  }

  const households = placements.households.map((_, i): WoodPileVisual => {
    let last: WoodPileStage | null | undefined
    return {
      sync(quantity) {
        const stage = woodPileVisualState(quantity).stage
        if (stage === last) return
        last = stage
        household.setStage(i, stage)
      },
      dispose() { /* meshes are owned by the settlement group */ },
    }
  })

  return { settlement, households, groups: [primary.group, overflow.group, household.group] }
}
