# Codebase domain audit 07 — World locations & caves

**Reviewed:** 2026-09-20  
**Area:** World locations & caves  
**Source of truth:** current `main` code  
**Master:** `tools-018-codebase-domain-and-flow-audit-master.md`  
**Result:** ⚠️ reviewed with unresolved high findings

## 1. Scope

Reviewed implemented world-location and cave flows for code correctness, architecture, lifecycle/persistence and performance.

In scope:

- deterministic location/cave identity and placement;
- logical location catalog vs runtime world projections;
- cave topology, entrance/interior identity and spatial authority;
- player/NPC/fauna spatial-context consumption;
- cave interaction, loot, treasure and quest bindings;
- cave presentation streaming, rebuild and save/load continuity;
- dropped items/corpses in cave space;
- unloaded landmark lookup cost.

Missing location/cave features and Vision/roadmap differences are intentionally not findings.

## 2. Entry points and state owners

### World locations

`src/world/locations/worldLocationCatalog.ts::createWorldLocationCatalog` is the logical catalog. Geometry is deterministic and reconstructed from stable ids; `LocationKnowledge` persists only player knowledge/navigation state.

Important identity sources include:

- `settlement:<id>`;
- `cave:<caveId>`;
- deterministic coarse lake/mountain ids;
- terrain-owned cemetery ids;
- authored ruins/search-area ids;
- `AbandonedMineLandmark.mineId`.

The catalog uses live dependency thunks such as `getCaves()` / `getChunkManager()`, so it does not retain a stale WorldBundle member through rebuild.

### Cave authority

`src/world/createCaves.ts::createCaves` owns the retained cave runtime for the WorldBundle.

For each accepted cave it retains:

- stable `caveId`;
- archetype/topology;
- compatibility `CaveDefinition`;
- production heightfield / column index;
- deterministic content anchors.

`Caves.queryGround*`, `resolveHorizontal*`, `occupancyAt` and `spatialContextAt` derive gameplay space from that retained representation. Streamed meshes are presentation only.

### Cave consumers

- Player grounding/collision consumes `Caves` before surface terrain.
- NPC movement receives a late-bound world-movement adapter and resolves current `WorldSpatialContext`.
- Fauna cave habitat bindings retain stable cave ids and resolve the current cave runtime through the injected cave contract.
- Interaction/combat use the shared `WorldSpatialContext` contract.
- World-generated cave containers store exact underground Y plus cave spatial context.
- Quest/treasure bindings use stable cave/content-anchor ids rather than Three.js objects.

## 3. Flows traced

### Location flow

```text
deterministic terrain/authored source
→ stable location id
→ WorldLocationCatalog projection
→ LocationKnowledge discovery/navigation state
→ map / quest / world-knowledge consumers
→ runtime lookup through live world dependencies
→ WorldBundle rebuild
→ deterministic location reconstruction
→ persisted knowledge re-resolves by stable id
```

Chunk landmarks remain terrain/environment-owned. The location catalog is a projection/query layer, not a second mutable landmark registry.

### Cave flow

```text
pickLargeCaveSites / guaranteed mine site
→ caveId + archetype
→ production topology rooted at entrance
→ retained CaveRuntime + heightfield
→ terrain mouth carve / entrance world position
→ spatialContextAt / queryGround / occupancy
→ player, NPC and fauna movement
→ deterministic content anchors
→ world-generated containers / quest bindings
→ streamed presentation materialize/unload
→ WorldBundle dispose/rebuild
→ deterministic/cache-backed retained reconstruction by caveId
```

There is no separate portal-space coordinate system. Cave topology, interior content and occupants use world XYZ coordinates; entrance and interior share the same cave identity.

### Treasure / loot continuity

```text
cave content anchor (stable id + caveId + x/y/z/yaw)
→ WorldGeneratedContainerSpec
→ exact underground placement + cave spatialContext
→ mutable Inventory
→ SaveWorldGeneratedContainer keyed by stable container id
→ rebuild/load: saved contents win over deterministic initial contents
```

This path does not rematerialize deterministic loot after it has been withdrawn.

### Fauna cave continuity

```text
stable habitat binding / caveId
→ Caves.resolveHabitat(caveId)
→ cave-local traversal / home↔entrance route
→ AnimalAgent runtime
→ persistent occupant state where the fauna policy requires it
→ rebuild: binding resolves against fresh Caves runtime
```

Habitat ownership and current spatial occupancy remain distinct concepts.

## 4. Findings

### F07-1 — high — ordinary dropped items lose cave spatial identity and reconstruct on the surface

**Affected flow:** cave interaction/combat/inventory → dropped world item → interaction → save/load/rebuild.

**Files / symbols:**

- `src/items/createDroppedItems.ts::DroppedItem`
- `src/items/createDroppedItems.ts::createDroppedItems`
- `src/items/createDroppedItems.ts::drop`
- `src/app/inventoryWiring.ts` drop call sites
- `src/app/gameLoop.ts` projectile miss/expiry and other drop call sites
- `src/settlement/npcPostDeath.ts::dropNpcCorpseLoot`
- `src/app/interactables.ts::spatialContextForPayload`
- `src/app/saveState.ts` dropped-item snapshot path
- `docs/plans/world-027-player-spatial-context-and-cross-space-target-isolation.md` and its implementation notes

**Evidence:**

`DroppedItem` persists only `id/kind/x/z` plus item payload metadata. It has no Y or `WorldSpatialContext`.

`spawnMesh()` always calls:

```ts
placeOnGround(mesh, item.x, item.z, sampleHeight, yOffset)
```

and falling resolves against the same surface `sampleHeight`.

On restore every persisted drop is therefore materialized from X/Z onto surface terrain.

Interaction classification reinforces the mismatch: `spatialContextForPayload()` has explicit cave-aware branches for animals/NPCs and authored world containers, but ordinary item payloads fall through to `WORLD_SPATIAL_CONTEXT_SURFACE`.

The completed `world-027` work already documented this as an out-of-scope known bug, including projectile misses, but no focused implementation plan currently owns it.

**Why wrong / fragile:**

A real item dropped by the player, combat projectile, overflow path or NPC corpse-loot handoff while physically inside a cave can be moved to the hillside/surface projection immediately or after restore. Once interaction filtering compares player cave context against the item's forced surface context, the item can also become unreachable from the cave.

This is a state-continuity defect: the item's logical world position does not survive the existing cave/surface spatial-domain boundary.

**Affected consumers:**

- player inventory drop/pickup;
- projectile recovery;
- quest/item overflow drops;
- NPC corpse-loot handoff;
- fauna dropped-food attraction/consumption where such a drop becomes a source;
- save/load and same-world rebuild of dropped items;
- interaction spatial-context filtering.

**Owner domain:** `items-player`, consuming the shared world spatial/ground contract.

**Existing plan coverage:** none. `world-027` explicitly excluded the fix and recorded it as follow-up work. `ui-input-027` only owns dropped-item candidate scaling.

**Recommended action:** create `items-player-051-cave-aware-dropped-item-continuity.md`. Extend the existing DroppedItems record/lifecycle rather than creating cave-specific item storage. Persist enough vertical/spatial identity to reconstruct the same domain, route placement through an injected canonical ground resolver, and make interaction/fauna consumers use the stored context.

---

### F07-2 — medium — unloaded shipwreck/tower lookup still performs full chunk generation on an eager radius-10 location path

**Affected flow:** app/quest composition → landmark lookup → unloaded world location resolution.

**Files / symbols:**

- `src/app/createApp.ts::LANDMARK_QUEST_SEARCH_CHUNK_RADIUS`
- `src/quests/quests.ts::buildLandmarkQuests`
- `src/terrain/chunkManager.ts::findLandmarkNear`
- `src/terrain/unloadedLandmarkLookup.ts::resolveUnloadedLandmark`
- `src/terrain/chunkEnvironment.ts::computeChunkEnvironment`
- `docs/plans/world-028-classic-landmark-unloaded-lookup-main-thread-freeze.md`

**Evidence:**

`buildLandmarkQuests` still resolves `shipwreck` and `tower` around home with radius 10.

The lookup walks expanding chunk rings; a miss can visit 441 chunks.

The implemented `world-028` optimization extracted lightweight deterministic resolvers for cemetery, authored ruins, monolith, stoneCircle and smallRuins. Its current implementation status explicitly leaves `shipwreck` / `tower` on the remaining `(unloaded, full)` fallback:

```text
computeChunkTile()
→ computeChunkEnvironment()
→ search landmark
```

on the main thread.

`world-028` explicitly lists these two kinds as an out-of-scope follow-up, so extending that completed implementation would blur ownership/history.

**Why wrong / fragile:**

The caller asks for one deterministic landmark candidate, but a cold miss can repeatedly materialize full chunk-generation data that the lookup does not need. This is the same structural freeze class already proven for the classic landmark kinds; only these placement rules need different terrain inputs.

The exact wall-clock impact for these two kinds was not benchmarked in this review, so severity is medium rather than high.

**Affected consumers:**

- startup/authored landmark quest materialization;
- any synchronous `findLandmarkNear('shipwreck'|'tower', ...)` caller using unloaded chunks.

**Owner domain:** `world` / places, with terrain placement helpers.

**Existing plan coverage:** `world-028` documents the remaining path but intentionally excludes it from scope and is already at verification-needed. No active focused plan owns these kinds.

**Recommended action:** create `world-036-lightweight-unloaded-shipwreck-and-tower-lookup.md`. Reuse the `world-028` resolver/sampler pattern, preserve exact streamed-generation parity, and avoid a registry/cache whose only purpose is hiding the first expensive lookup.

## 5. Architecture observations

### The historical "cave without exit" failure class is not confirmed in current code

Static inspection found no current one-way enter/exit state.

Production cave topology is rooted from an entrance and cave traversal derives routes over the connected topology graph. The heightfield contract/tests include an open mouth at the entrance, and `Caves.spatialContextAt` deliberately returns surface at open sky/mouth positions.

Player traversal is physical through the same mouth rather than a teleport into a detached coordinate space. NPC/fauna cave traversal also owns explicit interior↔entrance routing.

No finding was created without a current failing path. Browser verification remains the user's responsibility.

### Stable cave identity and runtime presentation are separated correctly

A cave's stable identity is `caveId`; streamed mesh instances are disposable projections. Retained topology/heightfield survives presentation unload and is recreated deterministically on WorldBundle rebuild.

No consumer reviewed persists a Three.js cave object or streamed presentation handle as authoritative identity.

### Abandoned mine and cave ids are intentionally distinct semantic identities

An abandoned mine can bind to a production cave and therefore expose both `mineId` and backing `caveId` at the same entrance.

That is not duplicate cave materialization: both resolve to one physical cave runtime. The current map can display both semantic locations at the same anchor; existing planned `ui-input-026` owns presentation suppression while explicitly preserving both identities.

### Cave spatial authority is shared

Player, NPC, fauna interaction/combat ultimately use the production cave heightfield/`WorldSpatialContext` contracts rather than separate cave-volume authorities.

`CaveVolume` remains a compatibility/location-definition projection and should not regain gameplay occupancy ownership.

### Global cave spatial lookup is linear but currently bounded

`Caves.occupancyAt()`, `spatialContextAt()` and the generic `queryGround()` walk retained cave runtimes. Known-cave queries use `v2ByCaveId` O(1) lookup.

The production world currently defaults to roughly 10 world-scale cave sites, so the global scan is small. It is used in recurring player/NPC/interaction paths, but this review found no evidence that the current bound is a material performance problem. No speculative acceleration plan was created.

If cave population grows materially, a derived coarse bounds index would be the correct optimization; the heightfield must remain authoritative.

### World-generated cave treasure continuity is coherent

Cave containers keep stable spec ids, exact underground Y and cave `WorldSpatialContext`. Mutable contents restore by id, and saved contents override deterministic initial content. No duplicate treasure materialization path was found.

### Location catalog rebuild references are live

`WorldLocationCatalog` receives getter functions for rebuild-owned systems rather than capturing `Caves`/`ChunkManager` instances. Cave lookup by id therefore resolves against the current WorldBundle projection after rebuild.

## 6. Cross-domain dependencies / follow-ups

- Area 18 (items/world items) should treat F07-1 as already owned by `items-player-051`, not rediscover a second cave-drop solution.
- `world-027` remains the shared spatial-context foundation; `items-player-051` should consume it.
- `ui-input-026` owns mine/cave map-label overlap only; it must not merge authoritative identities.
- `world-028` is the pattern/predecessor for F07-2 and should remain unchanged except documentation links if useful.
- Area 08 navigation should preserve the existing cave route/entrance semantics rather than adding a parallel portal path.
- Fauna cave habitat bindings should continue to resolve stable cave ids through the world-owned cave contract.

## 7. Existing plans that already cover findings

No active plan fully covers either confirmed finding.

Related plans:

- completed `world-027-player-spatial-context-and-cross-space-target-isolation.md` — foundation and explicit record of F07-1 as out-of-scope follow-up;
- `ui-input-027-interaction-candidate-dropped-item-scaling.md` — candidate cost only, not cave identity;
- `world-028-classic-landmark-unloaded-lookup-main-thread-freeze.md` — implemented lightweight lookup pattern, explicitly excludes F07-2's shipwreck/tower kinds;
- `ui-input-026-world-and-map-label-visibility-and-collision-fixes.md` — planned presentation handling for mine/cave shared anchors, not an authoritative-location fix.

## 8. New plans required

Created:

1. `docs/plans/items-player-051-cave-aware-dropped-item-continuity.md`
   - F07-1.

2. `docs/plans/world-036-lightweight-unloaded-shipwreck-and-tower-lookup.md`
   - F07-2.

No cave-spatial-index plan was created because the current cave count is small and no material regression was established.

## 9. Verification limits

This was a static code/architecture review of current `main`.

Not performed:

- browser/gameplay verification;
- production-code changes;
- automated test execution;
- performance benchmark execution;
- `pnpm docs:sync`.

The "cave without exit" class was checked against current topology/spatial/lifecycle code and tests, but was not browser-reproduced.

## 10. Master status update

Area 07 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

Follow-up owners:

- new `items-player-051`;
- new `world-036`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
