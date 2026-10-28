import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'
import * as loadGltf from '../assets/loadGltf'
import { createSettlementEconomy } from '../economy/settlementEconomy'
import { FOOD_ITEM_KINDS } from '../items/foodItems'
import { Inventory } from '../items/Inventory'
import { SETTLEMENT_SHADOW_KIND_USERDATA } from '../perf/sceneCensus'
import { createHousehold, type Household } from './household'
import {
  allocateFoodRepresentatives,
  createFoodStorageVisual,
  createWoodPileVisual,
  findWoodPileStageNodes,
  flattenFoodRepresentatives,
  FOOD_STORAGE_LOCAL_SLOTS,
  FOOD_STORAGE_MAX_KINDS,
  FOOD_STORAGE_MAX_REPRESENTATIVES,
  foodRepresentativeCount,
  foodStorageAllocationSignature,
  WOOD_PILE_MAX_EXTRA,
  WOOD_PILE_STAGES,
  woodPileStage,
  type WoodPileStage,
  woodPileVisualState,
} from './storageVisuals'
import {
  bakeWoodPileTierTemplates,
  createInstancedWoodPileVisuals,
  WOOD_PILE_TIER_NODES,
  WOOD_PILE_TIER_SCALE,
  type WoodPileTierTemplates,
} from './woodPileTiers'

const sampleHeight = () => 0

function householdWithWood(id: string, wood: number): Household {
  const household = createHousehold(id, 's', `${id}:home`)
  household.items.remove('branch', household.items.count('branch'))
  household.items.remove('beam', household.items.count('beam'))
  household.depositWood('branch', wood)
  return household
}

function progressivePile(): THREE.Object3D {
  const root = new THREE.Object3D()
  for (const name of WOOD_PILE_STAGES) {
    const node = new THREE.Object3D()
    node.name = name
    root.add(node)
  }
  return root
}

function visibleStages(root: THREE.Object3D): WoodPileStage[] {
  return WOOD_PILE_STAGES.filter((name) => root.getObjectByName(name)?.visible)
}

function allMeshesInGroup(group: THREE.Group): THREE.Object3D[] {
  return [...group.children]
}

function visibleMeshesInGroup(group: THREE.Group): THREE.Object3D[] {
  return group.children.filter((c) => c.visible)
}

describe('foodRepresentativeCount', () => {
  it('maps documented quantity boundaries', () => {
    expect(foodRepresentativeCount(0)).toBe(0)
    expect(foodRepresentativeCount(-3)).toBe(0)
    expect(foodRepresentativeCount(1)).toBe(1)
    expect(foodRepresentativeCount(2)).toBe(2)
    expect(foodRepresentativeCount(3)).toBe(3)
    expect(foodRepresentativeCount(4)).toBe(3)
    expect(foodRepresentativeCount(5)).toBe(4)
    expect(foodRepresentativeCount(7)).toBe(4)
    expect(foodRepresentativeCount(8)).toBe(5)
    expect(foodRepresentativeCount(12)).toBe(5)
    expect(foodRepresentativeCount(13)).toBe(6)
    expect(foodRepresentativeCount(20)).toBe(6)
    expect(foodRepresentativeCount(21)).toBe(8)
    expect(foodRepresentativeCount(1000)).toBe(8)
  })
})

describe('allocateFoodRepresentatives', () => {
  it('returns empty allocation for empty inventory', () => {
    expect(allocateFoodRepresentatives(new Inventory())).toEqual([])
  })

  it('allocates one representative per unit for low totals', () => {
    expect(allocateFoodRepresentatives(new Inventory({ carrot: 1 }))).toEqual([{ kind: 'carrot', count: 1 }])
    expect(allocateFoodRepresentatives(new Inventory({ carrot: 1, fish: 1 }))).toEqual([
      { kind: 'carrot', count: 1 },
      { kind: 'fish', count: 1 },
    ])
  })

  it('preserves FOOD_ITEM_KINDS order in the result', () => {
    const items = new Inventory({ fish: 5, carrot: 5 })
    const kinds = allocateFoodRepresentatives(items).map((e) => e.kind)
    const catalogOrder = FOOD_ITEM_KINDS.filter((k) => k === 'carrot' || k === 'fish')
    expect(kinds).toEqual(catalogOrder)
  })

  it('gives diversity before duplicates when budget allows', () => {
    const many: Partial<Record<string, number>> = {}
    const firstFour = FOOD_ITEM_KINDS.slice(0, FOOD_STORAGE_MAX_KINDS)
    for (const kind of firstFour) many[kind] = 1
    many[firstFour[0]!] = 2 // total 5 → representative budget 4
    const allocation = allocateFoodRepresentatives(new Inventory(many as Record<string, number>))
    expect(allocation).toHaveLength(FOOD_STORAGE_MAX_KINDS)
    expect(allocation.filter((e) => e.count === 1).length).toBe(FOOD_STORAGE_MAX_KINDS)
  })

  it('distributes remaining budget in stable round-robin order', () => {
    const allocation = allocateFoodRepresentatives(new Inventory({ carrot: 10, fish: 10 }))
    expect(flattenFoodRepresentatives(allocation)).toHaveLength(6)
    expect(allocation).toEqual([
      { kind: 'carrot', count: 3 },
      { kind: 'fish', count: 3 },
    ])
  })

  it('never allocates more representatives than stored count per kind', () => {
    const items = new Inventory({ carrot: 2, fish: 50, potato: 50 })
    const allocation = allocateFoodRepresentatives(items)
    for (const { kind, count } of allocation) {
      expect(count).toBeLessThanOrEqual(items.count(kind))
    }
  })

  it('caps at four represented kinds and ignores fifth+ as visual kinds', () => {
    const many: Partial<Record<string, number>> = {}
    for (const kind of FOOD_ITEM_KINDS.slice(0, 6)) many[kind] = 3
    const allocation = allocateFoodRepresentatives(new Inventory(many as Record<string, number>))
    expect(allocation.length).toBeLessThanOrEqual(FOOD_STORAGE_MAX_KINDS)
    const represented = new Set(allocation.map((e) => e.kind))
    for (const kind of FOOD_ITEM_KINDS.slice(FOOD_STORAGE_MAX_KINDS, 6)) {
      expect(represented.has(kind)).toBe(false)
    }
  })

  it('counts fifth+ kinds toward total budget without own representation', () => {
    const many: Partial<Record<string, number>> = {}
    for (const kind of FOOD_ITEM_KINDS.slice(0, 5)) many[kind] = 1
    const allocation = allocateFoodRepresentatives(new Inventory(many as Record<string, number>))
    expect(flattenFoodRepresentatives(allocation)).toHaveLength(4)
    expect(allocation.map((e) => e.kind)).toEqual(FOOD_ITEM_KINDS.slice(0, 4))
  })

  it('global visible cap is at most eight representatives', () => {
    const items = new Inventory({ carrot: 100, fish: 100, potato: 100, cabbage: 100 })
    expect(flattenFoodRepresentatives(allocateFoodRepresentatives(items))).toHaveLength(
      FOOD_STORAGE_MAX_REPRESENTATIVES,
    )
  })

  it('is deterministic for the same contents', () => {
    const items = new Inventory({ carrot: 4, fish: 2 })
    expect(allocateFoodRepresentatives(items)).toEqual(allocateFoodRepresentatives(items))
  })

  it('never mutates inventory', () => {
    const items = new Inventory({ carrot: 4 })
    allocateFoodRepresentatives(items)
    expect(items.count('carrot')).toBe(4)
  })
})

describe('flattenFoodRepresentatives', () => {
  it('expands allocation in stable order', () => {
    expect(
      flattenFoodRepresentatives([
        { kind: 'carrot', count: 2 },
        { kind: 'fish', count: 1 },
      ]),
    ).toEqual(['carrot', 'carrot', 'fish'])
  })
})

describe('FOOD_STORAGE_LOCAL_SLOTS', () => {
  it('defines exactly eight stable local slots', () => {
    expect(FOOD_STORAGE_LOCAL_SLOTS).toHaveLength(FOOD_STORAGE_MAX_REPRESENTATIVES)
    expect(FOOD_STORAGE_LOCAL_SLOTS[0]).toEqual(FOOD_STORAGE_LOCAL_SLOTS[0])
  })
})

describe('woodPileStage', () => {
  it('maps documented quantity boundaries onto authored variants', () => {
    expect(woodPileStage(0)).toBeNull()
    expect(woodPileStage(1)).toBe('Pile_01')
    expect(woodPileStage(2)).toBe('Pile_05')
    expect(woodPileStage(5)).toBe('Pile_05')
    expect(woodPileStage(6)).toBe('Pile_10')
    expect(woodPileStage(10)).toBe('Pile_10')
    expect(woodPileStage(11)).toBe('Pile_18')
    expect(woodPileStage(20)).toBe('Pile_18')
    expect(woodPileStage(21)).toBe('Pile_29')
    expect(woodPileStage(1000)).toBe('Pile_29')
  })

  it('is deterministic for the same quantity', () => {
    expect(woodPileStage(9)).toBe(woodPileStage(9))
  })
})

describe('woodPileVisualState', () => {
  it('produces no primary stage at zero', () => {
    expect(woodPileVisualState(0)).toEqual({ stage: null, extraPiles: 0 })
  })

  it('adds an additional pile once quantity passes 20, bounded', () => {
    expect(woodPileVisualState(20).extraPiles).toBe(0)
    expect(woodPileVisualState(21).extraPiles).toBe(1)
    expect(woodPileVisualState(40).extraPiles).toBe(1)
    expect(woodPileVisualState(41).extraPiles).toBe(2)
    expect(woodPileVisualState(61).extraPiles).toBe(WOOD_PILE_MAX_EXTRA)
    expect(woodPileVisualState(1000).extraPiles).toBe(WOOD_PILE_MAX_EXTRA)
  })

  it('keeps Pile_29 as the primary stage for high stock', () => {
    expect(woodPileVisualState(21).stage).toBe('Pile_29')
    expect(woodPileVisualState(1000).stage).toBe('Pile_29')
  })
})

describe('wood pile visual ownership (settlements-npcs-025 follow-up)', () => {
  it('settlement and household piles stay independent', () => {
    const settlementPile = progressivePile()
    const householdAPile = progressivePile()
    const householdBPile = progressivePile()
    const settlementVisual = createWoodPileVisual(settlementPile, [])
    const householdAVisual = createWoodPileVisual(householdAPile, [])
    const householdBVisual = createWoodPileVisual(householdBPile, [])

    const economy = createSettlementEconomy('s', { wood: 10 }, [])
    const householdA = householdWithWood('a', 2)
    const householdB = householdWithWood('b', 6)

    settlementVisual.sync(economy.query('wood'))
    householdAVisual.sync(householdA.woodCount())
    householdBVisual.sync(householdB.woodCount())

    expect(visibleStages(settlementPile)).toEqual(['Pile_10'])
    expect(visibleStages(householdAPile)).toEqual(['Pile_05'])
    expect(visibleStages(householdBPile)).toEqual(['Pile_10'])

    householdA.depositWood('branch', 9)
    householdAVisual.sync(householdA.woodCount())
    expect(visibleStages(householdAPile)).toEqual(['Pile_18'])
    expect(visibleStages(householdBPile)).toEqual(['Pile_10'])
    expect(visibleStages(settlementPile)).toEqual(['Pile_10'])

    economy.add('wood', 8)
    settlementVisual.sync(economy.query('wood'))
    expect(visibleStages(settlementPile)).toEqual(['Pile_18'])
    expect(visibleStages(householdBPile)).toEqual(['Pile_10'])
  })
})

describe('createWoodPileVisual', () => {
  it('hides every authored variant and extra pile at zero quantity', () => {
    const main = progressivePile()
    const extras = [new THREE.Object3D(), new THREE.Object3D()]
    const visual = createWoodPileVisual(main, extras)
    visual.sync(0)
    expect(visibleStages(main)).toEqual([])
    expect(extras.every((e) => !e.visible)).toBe(true)
  })

  it('shows exactly one authored variant for a positive quantity', () => {
    const main = progressivePile()
    const visual = createWoodPileVisual(main, [])
    visual.sync(5)
    expect(visibleStages(main)).toEqual(['Pile_05'])
  })

  it('selects Pile_29 for 21+ without scaling the primary pile', () => {
    const main = progressivePile()
    const baseScale = main.scale.x
    const visual = createWoodPileVisual(main, [])
    visual.sync(21)
    expect(visibleStages(main)).toEqual(['Pile_29'])
    visual.sync(1000)
    expect(visibleStages(main)).toEqual(['Pile_29'])
    expect(main.scale.x).toBe(baseScale)
  })

  it('reveals extra piles only once quantity overflows the last authored stage, bounded', () => {
    const main = progressivePile()
    const extras = [new THREE.Object3D(), new THREE.Object3D()]
    const visual = createWoodPileVisual(main, extras)
    visual.sync(20)
    expect(extras.every((e) => !e.visible)).toBe(true)
    visual.sync(21)
    expect(extras[0]!.visible).toBe(true)
    expect(extras[1]!.visible).toBe(false)
    visual.sync(1000)
    expect(extras.filter((e) => e.visible)).toHaveLength(WOOD_PILE_MAX_EXTRA)
  })

  it('updates the visible variant when the underlying quantity changes', () => {
    const main = progressivePile()
    const visual = createWoodPileVisual(main, [])
    visual.sync(1)
    expect(visibleStages(main)).toEqual(['Pile_01'])
    visual.sync(15)
    expect(visibleStages(main)).toEqual(['Pile_18'])
  })

  it('does not replace object identities across repeated sync calls', () => {
    const main = progressivePile()
    const extras = [new THREE.Object3D()]
    const nodes = Object.fromEntries(
      WOOD_PILE_STAGES.map((name) => [name, main.getObjectByName(name)]),
    )
    const extra = extras[0]!
    const visual = createWoodPileVisual(main, extras)
    visual.sync(1)
    visual.sync(21)
    visual.sync(1)
    expect(main.children).toHaveLength(WOOD_PILE_STAGES.length)
    for (const name of WOOD_PILE_STAGES) {
      expect(main.getObjectByName(name)).toBe(nodes[name])
    }
    expect(extras[0]).toBe(extra)
  })

  it('falls back to showing the whole pile when authored node names are missing', () => {
    const main = new THREE.Object3D()
    const baseScale = main.scale.clone()
    const visual = createWoodPileVisual(main, [])
    expect(findWoodPileStageNodes(main)).toBeNull()
    visual.sync(0)
    expect(main.visible).toBe(false)
    visual.sync(5)
    expect(main.visible).toBe(true)
    expect(main.scale.equals(baseScale)).toBe(true)
  })

  it('disposal removes the extra-pile objects it created', () => {
    const main = progressivePile()
    const parent = new THREE.Group()
    const extra = new THREE.Object3D()
    parent.add(extra)
    const visual = createWoodPileVisual(main, [extra])
    visual.dispose()
    expect(extra.parent).toBeNull()
  })
})

describe('createFoodStorageVisual', () => {
  it('adds no children for an empty inventory', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory())
    expect(group.children.length).toBe(0)
  })

  it('does not cast shadows (presentation-only pile on crates)', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 2 }))
    for (const root of allMeshesInGroup(group)) {
      expect(root.userData[SETTLEMENT_SHADOW_KIND_USERDATA]).toBe('storageGoods')
      root.traverse((node) => {
        const mesh = node as THREE.Mesh
        if (mesh.isMesh) expect(mesh.castShadow).toBe(false)
      })
    }
  })

  it('lazily creates meshes for stored food and grows with quantity', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 2 }))
    expect(visibleMeshesInGroup(group)).toHaveLength(2)
    expect(allMeshesInGroup(group)).toHaveLength(2)
    visual.sync(new Inventory({ carrot: 2, fish: 1 }))
    expect(visibleMeshesInGroup(group)).toHaveLength(3)
    expect(allMeshesInGroup(group)).toHaveLength(3)
  })

  it('never mutates the inventory it reads', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    const items = new Inventory({ carrot: 3 })
    visual.sync(items)
    expect(items.count('carrot')).toBe(3)
  })

  it('household and settlement storage use the same mechanism', () => {
    const householdGroup = new THREE.Group()
    const settlementGroup = new THREE.Group()
    const householdVisual = createFoodStorageVisual(householdGroup, { x: 1, z: 1 }, sampleHeight)
    const settlementVisual = createFoodStorageVisual(settlementGroup, { x: 2, z: 2 }, sampleHeight)
    const items = new Inventory({ carrot: 2 })
    householdVisual.sync(items)
    settlementVisual.sync(items)
    expect(visibleMeshesInGroup(householdGroup).length).toBe(visibleMeshesInGroup(settlementGroup).length)
  })

  it('preserves object identity across repeated sync with same allocation', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    const items = new Inventory({ carrot: 3 })
    visual.sync(items)
    const refs = allMeshesInGroup(group)
    visual.sync(new Inventory({ carrot: 3 }))
    expect(allMeshesInGroup(group)).toEqual(refs)
  })

  it('hides excess representatives on decrease and reuses on increase', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 5 }))
    const refs = allMeshesInGroup(group)
    visual.sync(new Inventory({ carrot: 1 }))
    expect(visibleMeshesInGroup(group)).toHaveLength(1)
    expect(allMeshesInGroup(group)).toEqual(refs)
    visual.sync(new Inventory({ carrot: 4 }))
    expect(visibleMeshesInGroup(group)).toHaveLength(3)
    expect(allMeshesInGroup(group)).toEqual(refs)
  })

  it('does not dispose meshes on ordinary sync', () => {
    const disposeSpy = vi.spyOn(loadGltf, 'disposeObject3D')
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 3 }))
    visual.sync(new Inventory({ carrot: 1 }))
    visual.sync(new Inventory({ carrot: 8 }))
    expect(disposeSpy).not.toHaveBeenCalled()
    disposeSpy.mockRestore()
  })

  it('materializes at most eight representatives total', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 50, fish: 50 }))
    expect(allMeshesInGroup(group).length).toBeLessThanOrEqual(FOOD_STORAGE_MAX_REPRESENTATIVES)
    expect(visibleMeshesInGroup(group)).toHaveLength(FOOD_STORAGE_MAX_REPRESENTATIVES)
  })

  it('assigns deterministic world positions per slot index', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 5, z: -2 }, sampleHeight)
    const items = new Inventory({ carrot: 3 })
    visual.sync(items)
    const mesh = allMeshesInGroup(group)[0]!
    const positionA = mesh.position.clone()
    visual.sync(items)
    expect(mesh.position.equals(positionA)).toBe(true)
  })

  it('does not share mesh instances between controllers', () => {
    const a = new THREE.Group()
    const b = new THREE.Group()
    const visualA = createFoodStorageVisual(a, { x: 0, z: 0 }, sampleHeight)
    const visualB = createFoodStorageVisual(b, { x: 0, z: 0 }, sampleHeight)
    const items = new Inventory({ carrot: 2 })
    visualA.sync(items)
    visualB.sync(items)
    expect(allMeshesInGroup(a)[0]).not.toBe(allMeshesInGroup(b)[0])
  })

  it('disposal removes every created mesh including hidden pool members', () => {
    const group = new THREE.Group()
    const visual = createFoodStorageVisual(group, { x: 0, z: 0 }, sampleHeight)
    visual.sync(new Inventory({ carrot: 5 }))
    visual.sync(new Inventory({ carrot: 1 }))
    expect(allMeshesInGroup(group).length).toBeGreaterThan(1)
    visual.dispose()
    expect(group.children.length).toBe(0)
  })

  it('uses allocation signature for no-op sync', () => {
    const items = new Inventory({ carrot: 4, fish: 2 })
    const sig = foodStorageAllocationSignature(allocateFoodRepresentatives(items))
    expect(sig).toBe('carrot:2|fish:2')
  })
})

function tierRoot(opts: { skip?: WoodPileStage, sharedMaterial?: boolean } = {}): THREE.Group {
  const root = new THREE.Group()
  const material = new THREE.MeshStandardMaterial()
  for (const stage of WOOD_PILE_STAGES) {
    if (stage === opts.skip) continue
    const node = new THREE.Group()
    node.name = WOOD_PILE_TIER_NODES[stage]
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
      opts.sharedMaterial === false ? new THREE.MeshStandardMaterial() : material,
    )
    node.add(mesh)
    root.add(node)
  }
  return root
}

function bakedTemplates(): WoodPileTierTemplates {
  const templates = bakeWoodPileTierTemplates(tierRoot())
  if (!templates) throw new Error('expected templates')
  return templates
}

function instancedMeshes(group: THREE.Object3D): THREE.InstancedMesh[] {
  const out: THREE.InstancedMesh[] = []
  group.traverse((o) => { if ((o as THREE.InstancedMesh).isInstancedMesh) out.push(o as THREE.InstancedMesh) })
  return out
}

/** Drawn instances per tier node name across a set of groups (visible meshes only). */
function drawnByGeometry(groups: THREE.Object3D[], templates: WoodPileTierTemplates): Map<WoodPileStage, number> {
  const out = new Map<WoodPileStage, number>()
  for (const g of groups) {
    for (const mesh of instancedMeshes(g)) {
      if (!mesh.visible || mesh.count === 0) continue
      const stage = WOOD_PILE_STAGES.find((st) => templates.geometries[st] === mesh.geometry)!
      out.set(stage, (out.get(stage) ?? 0) + mesh.count)
    }
  }
  return out
}

describe('wood pile tier templates', () => {
  it('maps every V1 stage to a distinct V2 firewood tier node', () => {
    expect(WOOD_PILE_STAGES.map((s) => WOOD_PILE_TIER_NODES[s])).toEqual([
      'pile_firewood_1', 'pile_firewood_5', 'pile_firewood_7', 'pile_firewood_14', 'pile_firewood_20',
    ])
  })

  it('bakes immutable shared-GPU geometry with the presentation scale, one shared material', () => {
    const templates = bakedTemplates()
    for (const stage of WOOD_PILE_STAGES) {
      const g = templates.geometries[stage]
      expect(g.userData.sharedGpu).toBe(true)
      g.computeBoundingBox()
      expect(g.boundingBox!.max.y).toBeCloseTo(WOOD_PILE_TIER_SCALE)
    }
    expect(templates.material.userData.sharedGpu).toBe(true)
  })

  it('returns null (legacy fallback) for a missing tier node or non-shared materials', () => {
    expect(bakeWoodPileTierTemplates(tierRoot({ skip: 'Pile_10' }))).toBeNull()
    expect(bakeWoodPileTierTemplates(tierRoot({ sharedMaterial: false }))).toBeNull()
    expect(bakeWoodPileTierTemplates(new THREE.Group())).toBeNull()
  })
})

describe('instanced wood pile visuals', () => {
  const placements = {
    primary: { x: 10, z: 20 },
    overflow: [{ x: 7, z: 21 }, { x: 8, z: 22 }],
    households: [{ x: 0, z: 0 }, { x: 5, z: 0 }, { x: 10, z: 0 }],
  }

  it('shows exactly the V1 tier at each quantity threshold', () => {
    const templates = bakedTemplates()
    const cases: [number, WoodPileStage | null][] = [
      [0, null], [1, 'Pile_01'], [2, 'Pile_05'], [5, 'Pile_05'], [6, 'Pile_10'],
      [10, 'Pile_10'], [11, 'Pile_18'], [20, 'Pile_18'], [21, 'Pile_29'],
    ]
    for (const [quantity, stage] of cases) {
      const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
      visuals.households[0]!.sync(quantity)
      const drawn = drawnByGeometry(visuals.groups, templates)
      expect([...drawn.entries()], `household quantity ${quantity}`).toEqual(stage ? [[stage, 1]] : [])
    }
  })

  it('keeps settlement and household stock independent', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
    visuals.settlement.sync(3)
    visuals.households[1]!.sync(12)
    expect(drawnByGeometry(visuals.groups, templates)).toEqual(new Map([['Pile_05', 1], ['Pile_18', 1]]))
    visuals.households[1]!.sync(0)
    expect(drawnByGeometry(visuals.groups, templates)).toEqual(new Map([['Pile_05', 1]]))
    visuals.settlement.sync(0)
    expect(drawnByGeometry(visuals.groups, templates).size).toBe(0)
  })

  it('bounds overflow to two extra largest piles at the planned offsets', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
    const overflowGroup = visuals.groups.find((g) => g.name === 'settlement-wood-overflow')!
    const overflowPositions = (): THREE.Vector3[] => instancedMeshes(overflowGroup).flatMap((m) =>
      m.visible ? Array.from({ length: m.count }, (_, i) => {
        const mat = new THREE.Matrix4()
        m.getMatrixAt(i, mat)
        return new THREE.Vector3().setFromMatrixPosition(mat)
      }) : [])

    visuals.settlement.sync(20)
    expect(overflowPositions()).toHaveLength(0)
    visuals.settlement.sync(21)
    expect(overflowPositions().map((v) => [v.x, v.z])).toEqual([[7, 21]])
    visuals.settlement.sync(41)
    expect(overflowPositions().map((v) => [v.x, v.z])).toEqual([[7, 21], [8, 22]])
    visuals.settlement.sync(10_000)
    expect(overflowPositions()).toHaveLength(2)
    visuals.settlement.sync(5)
    expect(overflowPositions()).toHaveLength(0)
  })

  it('keeps household identity and grounds instances at their anchors', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, (x, z) => x + z)
    visuals.households[2]!.sync(30)
    const mesh = instancedMeshes(visuals.groups.find((g) => g.name === 'settlement-wood-household')!)[0]!
    const mat = new THREE.Matrix4()
    mesh.getMatrixAt(0, mat)
    const pos = new THREE.Vector3().setFromMatrixPosition(mat)
    expect([pos.x, pos.y, pos.z]).toEqual([10, 10, 0])
  })

  it('reuses meshes and shared GPU resources across repeated tier changes', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
    const quantities = [1, 6, 25, 0, 3, 12, 0, 1, 25, 6]
    for (let round = 0; round < 5; round++) {
      for (const q of quantities) {
        for (const h of visuals.households) h.sync(q)
        visuals.settlement.sync(q)
      }
    }
    const all = visuals.groups.flatMap(instancedMeshes)
    expect(all.length).toBeLessThanOrEqual(visuals.groups.length * WOOD_PILE_STAGES.length)
    for (const m of all) {
      expect(m.material).toBe(templates.material)
      expect(Object.values(templates.geometries)).toContain(m.geometry)
    }
    // Last quantity (6) → every household in the same tier → one draw.
    expect(drawnByGeometry(visuals.groups, templates).get('Pile_10')).toBe(placements.households.length + 1)
  })

  it('tags each pool with its own shadow kind and leaves shared GPU resources on dispose', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
    expect(visuals.groups.map((g) => g.userData[SETTLEMENT_SHADOW_KIND_USERDATA])).toEqual([
      'storageWoodSettlementPrimary', 'storageWoodSettlementOverflow', 'storageWoodHousehold',
    ])
    visuals.settlement.sync(50)
    for (const h of visuals.households) h.sync(50)
    const geometryDispose = vi.fn()
    const materialDispose = vi.fn()
    for (const g of Object.values(templates.geometries)) g.addEventListener('dispose', geometryDispose)
    templates.material.addEventListener('dispose', materialDispose)
    const meshes = visuals.groups.flatMap(instancedMeshes)
    const instanceDispose = vi.fn()
    for (const m of meshes) m.addEventListener('dispose', instanceDispose)
    const root = new THREE.Group()
    for (const g of visuals.groups) root.add(g)
    loadGltf.disposeObject3D(root)
    expect(instanceDispose).toHaveBeenCalledTimes(meshes.length)
    expect(geometryDispose).not.toHaveBeenCalled()
    expect(materialDispose).not.toHaveBeenCalled()
  })

  it('does not rewrite instance buffers when the tier is unchanged', () => {
    const templates = bakedTemplates()
    const visuals = createInstancedWoodPileVisuals(templates, placements, sampleHeight)
    visuals.households[0]!.sync(7)
    const mesh = instancedMeshes(visuals.groups[2]!)[0]!
    const version = mesh.instanceMatrix.version
    visuals.households[0]!.sync(9) // still Pile_10
    expect(mesh.instanceMatrix.version).toBe(version)
  })
})
