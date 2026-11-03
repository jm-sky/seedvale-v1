import { type Group, type Mesh, type Object3D, Group as ThreeGroup } from 'three'
import type { Role } from '../ai/characters'
import type { HouseDefinition } from '../assets/houseDefinitionExampleConfig'
import type { FamilyDef, FamilyMember } from '../settlement/families'
import type { HouseBrowserLampDefault, HouseBrowserProfession } from './houseBrowserTypes'
import { householdYardPlanFor } from '../settlement/householdYard'
import { type DressingPlacement, professionDressingFor } from '../settlement/professionDressing'
import { buildProfessionDressingMeshes, loadProfessionDressingPack } from '../settlement/professionDressingMesh'

const PREVIEW_SEED = 1

/** Deterministic one-adult test family (same shape as `professionDressing.test.ts`). */
export function buildPreviewFamily(role: Role): FamilyDef {
  const members = [{
    name: 'Preview', lastName: 'Family', relation: 'parent', scale: 1, age: 30,
    character: { role },
  }] as unknown as FamilyMember[]
  return { id: 'family-0', members } as unknown as FamilyDef
}

/**
 * Placements exactly as the game computes them. The house sits at the origin,
 * yaw 0, so world == house-local. `lamp` overrides a *copy* of the definition
 * so lamp collision follows the panel; the shared definition is never mutated.
 */
export function previewPlacements(
  def: HouseDefinition,
  profession: Exclude<HouseBrowserProfession, 'none'>,
  lamp: HouseBrowserLampDefault | null,
): DressingPlacement[] {
  const view: HouseDefinition = lamp
    ? { ...def, lamp: { style: lamp.style, mount: { x: lamp.x, y: lamp.y, z: lamp.z } } }
    : { ...def, lamp: { style: 'floorCenter', mount: { x: 0, y: 1.85, z: 0 } } } // floor style = no wall obstacle
  const yard = householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1)
  return professionDressingFor(buildPreviewFamily(profession), 0, view, yard, PREVIEW_SEED)
}

export interface DressingPreview {
  attach(root: Object3D): void
  update(def: HouseDefinition | null, profession: HouseBrowserProfession, lamp: HouseBrowserLampDefault | null): void
  dispose(): void
}

/** Real dressing meshes in a group under the scene; geometries are per-call, pack materials are shared. */
export function createDressingPreview(parent: Object3D): DressingPreview {
  let group: Group | null = null
  let generation = 0

  function clear(): void {
    if (!group) return
    group.removeFromParent()
    group.traverse((o) => { (o as Mesh).geometry?.dispose() })
    group = null
  }

  return {
    attach() { generation++; clear() },
    update(def, profession, lamp) {
      const gen = ++generation
      clear()
      if (!def || profession === 'none') return
      const placements = previewPlacements(def, profession, lamp).map((placement) => ({ familyIndex: 0, placement }))
      void loadProfessionDressingPack().then((pack) => {
        if (gen !== generation || !pack) return
        const meshes = buildProfessionDressingMeshes(pack, placements, () => ({ x: 0, z: 0, yaw: 0 }), () => 0)
        group = new ThreeGroup()
        group.name = 'profession-dressing-preview'
        for (const mesh of meshes) group.add(mesh)
        parent.add(group)
      })
    },
    dispose() { generation++; clear() },
  }
}
