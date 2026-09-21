import { Scene } from 'three'
import { describe, expect, it } from 'vitest'
import type { WorldItemRef } from '../interaction/Interactable'
import type { ItemSpawners } from '../items/createItemSpawners'
import type { SaveItemInstance } from '../items/Inventory'
import type { ItemKind } from '../items/items'
import type { ItemSpawnPoint } from '../items/ItemSpawner'
import type { ChunkManager } from '../terrain/chunkManager'
import { surfaceInteractable } from '../interaction/Interactable'
import { createDroppedItems } from '../items/createDroppedItems'
import { createFoodBatch } from '../items/foodFreshness'
import { Inventory } from '../items/Inventory'
import { ITEM_DEFS } from '../items/items'
import { createWeaponInstance } from '../items/weaponMaintenance'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE } from '../world/spatialContext'
import {
  commitWorldPickup,
  DROPPED_ITEM_GROUP_RADIUS,
  filterInteractablesSameSpatialContext,
  GAZE_RANGE,
  grindstoneInteractPosition,
  groupDroppedItemCandidates,
  itemPromptLabel,
  resolveHaySpot,
  resolveWorldPickup,
  worldItemAllowsAltInteract,
} from './interactables'

const sampleHeight = (): number => 0

function fakeItemSpawners(points: ItemSpawnPoint[]): ItemSpawners {
  return {
    nodes: () => points,
    collect(id: string) {
      const p = points.find((point) => point.id === id)
      if (!p || p.collected) return null
      p.collected = true
      const instance = p.instanceId ? { id: p.instanceId, kind: p.kind } : undefined
      return { kind: p.kind, x: p.x, z: p.z, instance, authoredOneShot: p.authoredOneShot }
    },
  } as unknown as ItemSpawners
}

function fakeChunkManager(items: Map<string, { kind: ItemKind, x: number, z: number }>): ChunkManager {
  return {
    collectItem(id: string) {
      const item = items.get(id)
      if (!item) return null
      items.delete(id)
      return item
    },
  } as unknown as ChunkManager
}

const noSpawners = fakeItemSpawners([])
const noChunkItems = fakeChunkManager(new Map())

describe('resolveHaySpot', () => {
  const garden = { x: 0, z: 0 }
  // A representative real hay-bale offset (`buildSettlementProps`'s
  // `gardenPlotRadius + 1.4 + up to 1.2`) — well outside a 2.5-unit
  // `INTERACT_RANGE`, matching the actual bug: standing at the garden pad
  // center let `[E]` fire on a bale that was actually this far away.
  const haySpots = [{ x: 4.5, z: 0 }]

  it('does not offer hay when only the garden pad (not the actual bale) is in range', () => {
    // Player at the garden center — 4.5 units from the real bale, outside
    // the 2.5-unit interact range.
    expect(resolveHaySpot(haySpots, garden, { x: 0, z: 0 }, 2.5)).toBeNull()
  })

  it('offers hay once the player is actually near the physical bale', () => {
    expect(resolveHaySpot(haySpots, garden, { x: 4, z: 0 }, 2.5)).toEqual({ x: 4.5, z: 0 })
  })

  it('falls back to the garden pad for landmark fixtures with no haySpots recorded', () => {
    expect(resolveHaySpot(undefined, garden, { x: 0, z: 0 }, 2.5)).toEqual(garden)
    expect(resolveHaySpot([], garden, { x: 0, z: 0 }, 2.5)).toEqual(garden)
  })

  it('returns null when nothing is in range', () => {
    expect(resolveHaySpot(haySpots, garden, { x: 100, z: 100 }, 2.5)).toBeNull()
  })
})

describe('groupDroppedItemCandidates (plan items-player-022)', () => {
  const sampleHeight = (): number => 0

  it('collapses six nearby plain branches into one group of quantity 6', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    for (let i = 0; i < 6; i++) dropped.drop('branch', 0.05 * i, 0)
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups).toHaveLength(1)
    expect(groups[0]?.kind).toBe('branch')
    expect(groups[0]?.memberIds).toHaveLength(6)
    expect(groups[0]?.memberIds).toEqual(dropped.nodes().map((item) => item.id))
  })

  it('keeps branch and beam piles as separate groups', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    for (let i = 0; i < 3; i++) dropped.drop('branch', 0, 0)
    for (let i = 0; i < 3; i++) dropped.drop('beam', 0.1, 0)
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups.map((group) => [group.kind, group.memberIds.length])).toEqual([
      ['branch', 3],
      ['beam', 3],
    ])
  })

  it('does not group instance-backed or perishable drops into a count-only stack', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', 0, 0)
    dropped.drop('axe', 0, 0, { id: 'item:axe:1', kind: 'axe', durability: 0.4, sharpness: 0.5 })
    dropped.drop('deer_meat', 0, 0, undefined, undefined, {
      count: 1, acquiredAtDays: 1, accumulatedEffectiveAge: 0, lastCheckpointDays: 1, decayModifier: 1,
    })
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups.map((group) => group.memberIds.length)).toEqual([1, 1, 1])
    expect(groups.map((group) => group.kind)).toEqual(['branch', 'axe', 'deer_meat'])
  })

  it('keeps Fresh and Spoiled apples as separate pickup targets (plan items-player-025)', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('apple', 0, 0, undefined, undefined, {
      count: 1, acquiredAtDays: 1, accumulatedEffectiveAge: 0, lastCheckpointDays: 1, decayModifier: 1,
    })
    dropped.drop('apple', 0.2, 0, undefined, undefined, {
      count: 1, acquiredAtDays: 1, accumulatedEffectiveAge: 5, lastCheckpointDays: 1, decayModifier: 1,
    })
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups).toHaveLength(2)
    expect(groups.every((group) => group.kind === 'apple' && group.memberIds.length === 1)).toBe(true)
  })

  it('does not merge identical kinds beyond the cluster radius', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', 0, 0)
    dropped.drop('branch', DROPPED_ITEM_GROUP_RADIUS + 0.2, 0)
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups).toHaveLength(2)
  })

  it('keeps membership order stable across repeated grouping of the same nodes', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', 0, 0)
    dropped.drop('beam', 0, 0)
    dropped.drop('branch', 0.1, 0)
    const first = groupDroppedItemCandidates(dropped.nodes())
    const second = groupDroppedItemCandidates(dropped.nodes())
    expect(second).toEqual(first)
  })

  it('partial capacity pickup leaves the remaining dropped records', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    for (let i = 0; i < 6; i++) dropped.drop('branch', 0, 0)
    const inventory = new Inventory({}, ITEM_DEFS.branch.weight * 2)
    const [group] = groupDroppedItemCandidates(dropped.nodes())
    for (const id of group!.memberIds) {
      if (!inventory.canAdd('branch')) break
      const collected = dropped.collect(id)
      if (collected) inventory.add(collected.kind, 1)
    }
    expect(inventory.count('branch')).toBe(2)
    expect(dropped.nodes().map((item) => item.id)).toEqual(group!.memberIds.slice(2))
  })

  it('merges transitive same-kind chains within grouping radius (plan ui-input-027)', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', 0, 0)
    dropped.drop('branch', 1.4, 0)
    dropped.drop('branch', 2.8, 0)
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups).toHaveLength(1)
    expect(groups[0]?.memberIds).toHaveLength(3)
  })

  it('groups correctly across negative XZ bucket boundaries (plan ui-input-027)', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', -45.75, -45.75)
    dropped.drop('branch', -45.74, -45.75)
    const groups = groupDroppedItemCandidates(dropped.nodes())
    expect(groups).toHaveLength(1)
    expect(groups[0]?.memberIds).toHaveLength(2)
  })

  it('keeps member order by source insertion across spatial buckets (plan ui-input-027)', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('branch', 0, 0)
    dropped.drop('branch', 3, 0)
    dropped.drop('branch', 0.1, 0)
    const nodes = dropped.nodes()
    const groups = groupDroppedItemCandidates(nodes)
    expect(groups).toHaveLength(2)
    const pair = groups.find((group) => group.memberIds.length === 2)
    expect(pair?.memberIds).toEqual([nodes[0]!.id, nodes[2]!.id])
    expect(pair?.first.id).toBe(nodes[0]!.id)
  })

  it('carries the first member on each group for prompt metadata (plan ui-input-027)', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    for (let i = 0; i < 3; i++) dropped.drop('branch', 0.05 * i, 0)
    const [group] = groupDroppedItemCandidates(dropped.nodes())
    expect(group!.first.id).toBe(group!.memberIds[0])
  })
})

describe('groupDroppedItemCandidates local query contract (plan ui-input-027)', () => {
  const sampleHeight = (): number => 0
  const queryRadius = GAZE_RANGE + DROPPED_ITEM_GROUP_RADIUS

  it('groups only the gaze halo slice, not the whole global registry', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    for (let i = 0; i < 120; i++) dropped.drop('stone', 500 + i * 0.01, 500)
    dropped.drop('branch', 0, 0)
    dropped.drop('branch', 0.1, 0)
    const local = dropped.queryNear(0, 0, queryRadius)
    expect(local).toHaveLength(2)
    expect(dropped.nodes().length).toBeGreaterThan(100)
    const groups = groupDroppedItemCandidates(local)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.memberIds).toHaveLength(2)
  })
})

describe('worldItemAllowsAltInteract', () => {
  it('rejects non-consumable world tools and materials (R is not pickup)', () => {
    expect(worldItemAllowsAltInteract('shovel')).toBe(false)
    expect(worldItemAllowsAltInteract('axe')).toBe(false)
    expect(worldItemAllowsAltInteract('branch')).toBe(false)
    expect(worldItemAllowsAltInteract('stone')).toBe(false)
  })

  it('allows single consumable items for the plan-153 pickup+consume alternate', () => {
    expect(worldItemAllowsAltInteract('mushroom')).toBe(true)
    expect(worldItemAllowsAltInteract('herb')).toBe(true)
    expect(worldItemAllowsAltInteract('apple')).toBe(true)
  })

  it('rejects grouped/stacked targets even when the kind is consumable', () => {
    expect(worldItemAllowsAltInteract('mushroom', 2)).toBe(false)
  })

  it('rejects spoiled perishable food (plan items-player-025)', () => {
    expect(worldItemAllowsAltInteract('apple', 1, 'spoiled')).toBe(false)
    expect(worldItemAllowsAltInteract('apple', 1, 'fresh')).toBe(true)
    expect(worldItemAllowsAltInteract('apple', 1, 'medium')).toBe(true)
  })
})

describe('filterInteractablesSameSpatialContext (plan world-027)', () => {
  const cave = caveSpatialContext('cave:loot')

  it('removes surface tree and retains same-cave chest for a cave player', () => {
    const tree = surfaceInteractable({
      kind: 'tree',
      position: { x: 1, z: 2 },
      promptLabel: '',
      id: 't1',
      stage: 'mature',
      sizeClass: 'medium',
    })
    const chest = surfaceInteractable({
      kind: 'container',
      position: { x: 1, z: 2 },
      promptLabel: '',
      id: 'chest-1',
    })
    chest.spatialContext = cave
    const filtered = filterInteractablesSameSpatialContext([tree, chest], cave)
    expect(filtered).toHaveLength(1)
    const [survivor] = filtered
    expect(survivor && 'id' in survivor ? survivor.id : undefined).toBe('chest-1')
  })

  it('keeps ordinary surface candidates for a surface player', () => {
    const tree = surfaceInteractable({
      kind: 'tree',
      position: { x: 0, z: 0 },
      promptLabel: '',
      id: 't2',
      stage: 'young',
      sizeClass: 'small',
    })
    expect(filterInteractablesSameSpatialContext([tree], WORLD_SPATIAL_CONTEXT_SURFACE)).toHaveLength(1)
  })
})

describe('itemPromptLabel (plan items-player-025)', () => {
  it('keeps the pickup+consume prompt for fresh consumable food', () => {
    expect(itemPromptLabel('apple', 1, 'fresh')).toBe('[E] Podnieś: jabłko · [R] Zjedz')
  })

  it('labels spoiled food and omits [R]', () => {
    expect(itemPromptLabel('apple', 1, 'spoiled')).toBe('Podnieś: jabłko (zepsute)')
    expect(itemPromptLabel('apple', 1, 'spoiled')).not.toMatch(/\[R\]/)
  })
})

describe('grindstoneInteractPosition', () => {
  it('uses the workbench, not the NPC access anchor', () => {
    const workplace = {
      position: { x: 10, z: 4 },
      workbenchPosition: { x: 11.2, z: 4.4 },
    }
    expect(grindstoneInteractPosition(workplace)).toEqual({ x: 11.2, z: 4.4 })
    expect(grindstoneInteractPosition(workplace)).not.toEqual({
      x: workplace.position.x,
      z: workplace.position.z,
    })
  })
})

describe('resolveWorldPickup + commitWorldPickup (plan items-player-053)', () => {
  it('dropped exact instance retains its id and metadata after a successful transfer', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('axe', 0, 0, { id: 'item:axe:1', kind: 'axe', durability: 0.4, sharpness: 0.6 })
    const ref: WorldItemRef = { id: dropped.nodes()[0]!.id, kind: 'axe', source: 'dropped' }
    const inventory = new Inventory()
    const resolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)
    expect(resolution).not.toBeNull()
    const result = commitWorldPickup(resolution!, inventory, 0)
    expect(result).toMatchObject({ ok: true, itemKind: 'axe' })
    expect(inventory.getInstance('item:axe:1')).toMatchObject({ id: 'item:axe:1', durability: 0.4, sharpness: 0.6 })
    expect(dropped.nodes()).toHaveLength(0)
  })

  it('leaves the dropped source present when the destination already owns the same instance id', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('axe', 0, 0, { id: 'item:axe:dup', kind: 'axe', durability: 1, sharpness: 1 })
    const ref: WorldItemRef = { id: dropped.nodes()[0]!.id, kind: 'axe', source: 'dropped' }
    const inventory = new Inventory()
    inventory.addInstance({ ...createWeaponInstance('axe'), id: 'item:axe:dup' })
    const resolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result.ok).toBe(false)
    expect(dropped.nodes()).toHaveLength(1)
    expect(inventory.countInstances('axe')).toBe(1)
  })

  it('leaves the dropped source present when the destination lacks instance capacity', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('axe', 0, 0, { id: 'item:axe:cap', kind: 'axe', durability: 1, sharpness: 1 })
    const ref: WorldItemRef = { id: dropped.nodes()[0]!.id, kind: 'axe', source: 'dropped' }
    const inventory = new Inventory({}, 0.001)
    const resolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result.ok).toBe(false)
    expect(dropped.nodes()).toHaveLength(1)
    expect(inventory.getInstance('item:axe:cap')).toBeNull()
  })

  it('fails closed on a malformed exact saved instance instead of minting a fresh replacement', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    dropped.drop('axe', 0, 0, { id: '', kind: 'axe' } as SaveItemInstance)
    const ref: WorldItemRef = { id: dropped.nodes()[0]!.id, kind: 'axe', source: 'dropped' }
    const inventory = new Inventory()
    const resolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result.ok).toBe(false)
    expect(inventory.countInstances('axe')).toBe(0)
    expect(dropped.nodes()).toHaveLength(1)
  })

  it('preserves a perishable dropped batch on a failed pickup and moves it intact on success', () => {
    const dropped = createDroppedItems(new Scene(), sampleHeight)
    const batch = createFoodBatch(1, 0, 1)
    dropped.drop('deer_meat', 0, 0, undefined, undefined, batch)
    const ref: WorldItemRef = { id: dropped.nodes()[0]!.id, kind: 'deer_meat', source: 'dropped' }

    const tooSmall = new Inventory({}, 0.001)
    const failedResolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)!
    expect(commitWorldPickup(failedResolution, tooSmall, 0).ok).toBe(false)
    expect(dropped.nodes()).toHaveLength(1)
    expect(dropped.nodes()[0]?.foodBatch).toEqual(batch)

    const inventory = new Inventory()
    const okResolution = resolveWorldPickup(ref, noChunkItems, noSpawners, dropped)!
    const result = commitWorldPickup(okResolution, inventory, 5)
    expect(result.ok).toBe(true)
    expect(inventory.count('deer_meat')).toBe(1)
    expect(dropped.nodes()).toHaveLength(0)
  })

  it('marks an authored spawner one-shot consumed only after a successful transfer', () => {
    const point: ItemSpawnPoint = {
      id: 'spawner:authored:1',
      x: 0,
      z: 0,
      kind: 'key',
      respawnTime: Infinity,
      timeSinceCollected: 0,
      collected: false,
      instanceId: 'item:key:1',
      authoredOneShot: true,
    }
    const spawners = fakeItemSpawners([point])
    const ref: WorldItemRef = { id: point.id, kind: point.kind, source: 'spawner' }
    const inventory = new Inventory()
    const resolution = resolveWorldPickup(ref, noChunkItems, spawners, createDroppedItems(new Scene(), sampleHeight))!
    expect(resolution.authoredOneShot).toBe(true)
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result).toMatchObject({ ok: true, authoredOneShot: true })
    expect(inventory.getInstance('item:key:1')).not.toBeNull()
    expect(point.collected).toBe(true)
  })

  it('does not retire an authored spawner one-shot when the destination commit fails', () => {
    const point: ItemSpawnPoint = {
      id: 'spawner:authored:2',
      x: 0,
      z: 0,
      kind: 'key',
      respawnTime: Infinity,
      timeSinceCollected: 0,
      collected: false,
      instanceId: 'item:key:2',
      authoredOneShot: true,
    }
    const spawners = fakeItemSpawners([point])
    const ref: WorldItemRef = { id: point.id, kind: point.kind, source: 'spawner' }
    const inventory = new Inventory()
    inventory.addInstance({ id: 'item:key:2', kind: 'key' })
    const resolution = resolveWorldPickup(ref, noChunkItems, spawners, createDroppedItems(new Scene(), sampleHeight))!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result.ok).toBe(false)
    expect(point.collected).toBe(false)
  })

  it('retires a chunk world item exactly once', () => {
    const items = new Map<string, { kind: ItemKind, x: number, z: number }>([
      ['world:item:1', { kind: 'stone', x: 0, z: 0 }],
    ])
    const chunkManager = fakeChunkManager(items)
    const ref: WorldItemRef = { id: 'world:item:1', kind: 'stone', source: 'world' }
    const inventory = new Inventory()
    const resolution = resolveWorldPickup(ref, chunkManager, noSpawners, createDroppedItems(new Scene(), sampleHeight))!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result).toMatchObject({ ok: true, itemKind: 'stone' })
    expect(inventory.count('stone')).toBe(1)
    expect(items.has('world:item:1')).toBe(false)
    // `ChunkManager` has no separate non-mutating peek, so a stale second
    // attempt only surfaces as a failed retire during commit, not as a null
    // resolve — the commit must still report failure and never duplicate.
    const secondInventory = new Inventory()
    const secondResolution = resolveWorldPickup(ref, chunkManager, noSpawners, createDroppedItems(new Scene(), sampleHeight))!
    expect(commitWorldPickup(secondResolution, secondInventory, 0).ok).toBe(false)
    expect(secondInventory.count('stone')).toBe(0)
  })

  it('retires a renewable spawner pickup exactly once', () => {
    const point: ItemSpawnPoint = {
      id: 'spawner:1',
      x: 0,
      z: 0,
      kind: 'branch',
      respawnTime: 60,
      timeSinceCollected: 0,
      collected: false,
    }
    const spawners = fakeItemSpawners([point])
    const ref: WorldItemRef = { id: point.id, kind: point.kind, source: 'spawner' }
    const inventory = new Inventory()
    const resolution = resolveWorldPickup(ref, noChunkItems, spawners, createDroppedItems(new Scene(), sampleHeight))!
    const result = commitWorldPickup(resolution, inventory, 0)
    expect(result).toMatchObject({ ok: true, itemKind: 'branch' })
    expect(inventory.count('branch')).toBe(1)
    expect(point.collected).toBe(true)
    expect(resolveWorldPickup(ref, noChunkItems, spawners, createDroppedItems(new Scene(), sampleHeight))).toBeNull()
  })
})
