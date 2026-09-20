# Implementation Notes: world-terrain-047 — Mineable rocks and coastal shell resources

Recon baseline: current `main` on 2026-09-20, after plan commit `109277df`.

These notes record implementation-specific decisions from current code. Follow current source if it drifts.

## 1. Keep shell work inside the existing chunk-item and dig pipelines

The two shell sources should remain:

```text
procedural shoreline pickup
  → chunkItems.ts
  → collectedItemIds

successful shovel dig
  → dig.ts / digAction.ts
  → Inventory or DroppedItems
```

Do not create a shell registry, shell spawner, or new interaction type.

### Procedural placement

`src/terrain/chunkItems.ts::computeChunkItems()` already owns deterministic finite shell placement. Keep the existing candidate stream and IDs (`${cx}:${cz}:${i}`) so changing the shore predicate does not renumber existing item identities inside the pool.

Add the shoreline predicate in a small pure terrain helper (the plan's `src/terrain/coastalResources.ts` is appropriate). It should operate only on terrain values already available to both call sites: height, water level, continentalness and `RegionParams` thresholds.

Do not derive shoreline from rendered water meshes, water-body objects, loaded chunks or camera state.

Because this changes worker-generated `ChunkTileResult.items`, bump `src/terrain/chunkTileWorldgenCache.ts::CHUNK_TILE_CACHE_VERSION` (currently 3). The cache is disposable derived data and must not be represented in `SaveData`.

### Shallow-water digging

Current `src/terrain/dig.ts::getDigProfileAt()` rejects below `waterLevel + 0.1`. The shallow coastal exception belongs in this classifier rather than in `groundActions.ts`, otherwise prompt eligibility and execution can disagree.

`DigEnv` currently contains height/ridge/water/seed only. `ChunkManager` already exposes `sampleContinentalness` and `region`; extend the narrow structural env only as needed for the shared shoreline predicate.

Keep the exception narrow:

- only ocean/coast continentalness;
- only sand;
- only configured shallow depth (about 0.35 m below water);
- lakes/rivers remain rejected.

Do not make `WATER_MARGIN` globally negative; that would silently allow ordinary inland underwater digging.

## 2. Preserve existing shovel capability semantics

There is a current code nuance not obvious from the plan:

- `buildInteractables()` computes held-tool eligibility for gaze targets;
- `GroundActions.startDigAt()` itself gates with `inventory.hasCapability('soil_digging')`, so Quick Actions may use a shovel from inventory.

Do not change this behavior as part of shell work.

The shell roll should happen only after a successful dig has already passed the existing action gate. It does not need another shovel-kind check.

## 3. Refactor dig acquisition once, then reuse it for shell and rock yield

`src/terrain/digAction.ts::applyDigAt()` currently has stone-specific inventory/drop code after `resolveDigStone()`:

```text
Inventory.canAdd
→ Inventory.add OR DroppedItems.drop
→ inventory pickup sound / HUD weight
→ showCountAcquisition
```

Extract the smallest helper needed to grant a count-backed item with the same overflow-to-ground behavior. Keep application feedback dependencies in `DigFeedback`/the action layer; do not push Toast/Hud/DroppedItems into the pure `mineableWork` module.

Then:

- existing stone resolution keeps exactly its current probability and noticed/unnoticed semantics;
- eligible coastal sand performs an independent `SHELL_CHANCE_SHORE_DIG = 0.18` roll after the stone outcome;
- rock mining uses the same grant/drop helper for yielded `stone`.

A single dig may therefore produce both a stone and a shell. That is intentional.

## 4. Put finite-work semantics in a pure world module

Create `src/world/mineableWork.ts` as a pure, presentation-agnostic reducer.

It may depend on item-domain types (`ItemKind`, `ItemCapability`) but must not import:

- Three.js;
- `ChunkManager`;
- terrain placement types;
- caves;
- quests;
- persistence;
- inventory/UI.

Recommended API shape is close to the plan, but make the reducer result explicit enough that owners do not re-derive transitions:

```ts
type MineableWorkResult = {
  state: MineableWorkState | null // null = depleted
  yield: { kind: ItemKind; amount: number }
  stageCompleted: boolean
  depleted: boolean
}
```

An injected RNG should resolve `min..max` yield deterministically in tests. Capability validation can either be a pure helper on the definition or remain at the owner/action boundary; do not import `HeldTool` into this module.

Add focused tests for exact action counts and transition/depletion outputs.

This is the only contract intended for later `quests-progression-041` reuse. Cave placement, blocking and presentation remain cave-owned.

## 5. Give mineable environment rocks identity without turning them into landmarks

`EnvironmentPlacement.id` is currently semantically associated with `LandmarkKind`; `ChunkManager.getNearbyLandmarks()` treats any placement with `id` as a landmark candidate and casts `p.kind as LandmarkKind`.

Therefore do **not** simply populate the existing `id` field on `largeRock` / `rockCluster` unless `getNearbyLandmarks()` is simultaneously hardened.

Preferred smallest change: add a separate optional stable field such as:

```ts
resourceId?: string
```

to `EnvironmentPlacement`, populated only for mineable generated rocks.

Derive it from chunk identity + the rock candidate ordinal already present during `computeChunkEnvironment()`. Keep landmark `id` generation untouched.

The identity must not include current visual stage. A large rock keeps the same `resourceId` after becoming a cluster.

## 6. Rock definitions and mutable state ownership

Keep balancing in one table owned by the mineable-rock domain, not in `groundActions.ts` or `chunkManager.ts`.

A small module such as `src/terrain/mineableRocks.ts` is appropriate for:

- mapping base `EnvironmentKind` to `MineableWorkDefinition`;
- deriving effective visible stage from base placement + saved work state;
- prompt label;
- effective collider kind/radius decision;
- predicates like depleted / changed-from-base.

Do not make `ChunkManager` the authoritative progress owner.

Use an app/world-owned sparse mutable map keyed by stable rock resource id, initialized from save and replaced/cleared only for a genuinely new world, matching `resourceDepletion` / `collectedItemIds` lifecycle in `createApp.ts`.

Suggested runtime representation:

```ts
Map<string, MineableWorkState | tombstone>
```

or an equivalent serializable record where final depletion is unambiguous. Do not drop the entry when depleted, because deterministic worldgen would respawn the rock.

Pass a read/mutate seam into the rebuilt `WorldBundle` / `ChunkManager`; do not duplicate the map inside Three.js objects.

## 7. Persistence: add one sparse field and use the normal migration pipeline

`src/persistence/saveData.ts` owns the save schema. `src/app/saveState.ts::buildSaveData()` is the single app-side assembly point.

Add one dedicated optional/sparse field for mineable-rock mutation state. Do not use:

- `collectedItemIds` — those mean finite chunk **item** pickups;
- `resourceDeposits` — those belong to ore `ResourceDeposits`;
- `terrainModifications` — those are terrain-height mutations;
- `SaveWorldFlags` — story compatibility flags.

Current architecture already documents `resourceDeposits` as an app-owned sparse map that survives WorldBundle rebuilds; copy that lifecycle pattern, not its ore-specific value semantics.

Because this is a persisted representation change, bump `CURRENT_SAVE_VERSION` and add the real migration/default path required by current `saveData.ts`. Older saves restore with an empty rock-state collection.

Update save validation/tests and the common `validSave` fixtures that require every non-optional field.

## 8. Region batching: current removal API is tree-only and must be minimally generalized

`src/terrain/vegetationRegionBatcher.ts` already batches `largeRock` and `rockCluster`, but its current keyed mutation seam is deliberately tree-specific:

```ts
removeByKey(chunkCoord, key)
→ hard-coded table kind 'tree-living'
```

Also, only tree placements currently rely on `PropPlacement.key`.

Do not add a second rock batcher.

Generalize the existing seam narrowly, e.g. conceptually:

```ts
removeByKey(chunkCoord, kind, key)
```

or add an equivalent kind-aware removal method while preserving the tree caller.

When building rock `PropPlacement` data in `ChunkManager.attachChunkContent()`, pass `resourceId` as the placement key.

Important lifecycle detail: `VegetationRegionBatcher` stores its own mutable copy of each chunk contribution. Removing a keyed placement prevents a sibling-chunk-triggered region rebuild from resurrecting it during that loaded-chunk lifetime.

On **chunk reload**, the contribution is reconstructed from `record.tile.environment`; therefore `ChunkManager` must consult authoritative mineable-rock state before submitting base placements to the batcher.

## 9. Runtime-mutated visible rocks should follow the tree-exception precedent

Untouched rocks stay in the region batcher.

For a rock whose state diverges from base:

- suppress its keyed base instance;
- if it still has a visible stage, create one individual runtime override from the existing `largeRock` / `rockCluster` templates/factories;
- keep that override chunk-owned and dispose it on unload;
- reconstruct the correct override from authoritative state on chunk reload.

There is no reason to change visual geometry on intermediate actions. Only:

```text
large boulder → cluster → gone
```

needs a presentation transition.

Do not rebuild every rock group after each mining action.

## 10. Collider rebuilding must resolve effective rock state

`src/terrain/chunkManager.ts::rebuildColliders(record)` currently iterates raw `record.tile.environment` and applies `ENVIRONMENT_COLLISION_RADIUS[p.kind] * p.scale`.

That raw loop will resurrect the base collider unless it is taught to resolve mineable state.

Keep the existing collider registry and make `rebuildColliders()` derive, per mineable placement:

- untouched/partial `largeRock` → current `largeRock` radius 0.9 × scale;
- transitioned large-rock pile → `rockCluster` radius 0.5 × appropriate effective scale;
- ordinary active `rockCluster` → existing cluster radius;
- depleted → no collider.

Call `rebuildColliders(record)` immediately after the completed mining action mutates authoritative state.

Small clusters remain collidable until their final action; only depletion removes that collider.

Do not create per-rock collider registrations outside this existing chunk collider rebuild path.

## 11. Add a loaded-chunk mineable-rock query rather than scanning render objects

Mirror `ChunkManager.getNearbyLandmarks()` / `getNearbyItems()` with a narrow data query, e.g. `getNearbyMineableRocks(pos, radius)`.

It should:

- read loaded `record.tile.environment`;
- filter `largeRock` / `rockCluster`;
- require stable `resourceId`;
- resolve effective current state from the authoritative map;
- exclude depleted rocks;
- return stable id, position, effective visual/prompt stage, and only the data interaction targeting needs.

Do not inspect Three.js instance matrices or object `userData` to discover mineable rocks.

`buildInteractables()` can then add one new payload kind, e.g. `mineableRock`, only when `hasItemCapability(heldTool, 'rock_mining')` is true.

The interact handler should re-resolve the rock by stable id at action start/completion rather than trusting a stale per-frame snapshot.

## 12. Mining action should reuse GroundActions busy/physical-work conventions

Add a rock work entry point beside `startDepositMine()` in `GroundActions`.

Reuse:

- `hasItemCapability(heldTool.held(), 'rock_mining')`;
- `isActionBlocked(ctx)`;
- `physicalDuration(...)`;
- `physicalEffortBusyOptions('moderate', ...)`;
- `playActionMine(...)`;
- existing count-backed acquisition helper from section 3.

The authoritative mineable state changes only in the busy completion callback. Escape/cancellation therefore leaves both progress and yield untouched automatically.

Do not route this through `startPickaxeDigAt()`: that path mutates terrain height and has different target ownership.

## 13. Interaction dispatch must remain generic input-wise

`src/interaction/Interactable.ts` is a per-frame adapter only; it owns no lifecycle. Add the rock payload there and dispatch it through the existing `[E]` action path in the same style as deposits/crops/other world objects.

No new keyboard or touch handler is required.

Target cycling/highlighting should work automatically once the candidate participates in the existing list.

## 14. WorldBundle rebuild / New Game boundary

The sparse mineable-rock state must live outside the disposable `WorldBundle`, like other persistent app-owned mutation stores.

Expected lifecycle:

```text
createApp restore
→ create mutable mineable-rock state
→ build WorldBundle with access to that state
→ mine rock mutates same state
→ rebuildWorldBundle reuses same state object
→ saveState serializes it

New Game
→ replace/clear state
→ build new WorldBundle
```

Do not store progress only on `ChunkRecord`, runtime override meshes, batcher contributions or collider entries; all are disposable projections.

## 15. Important tests and where they belong

Prefer pure tests before integration tests:

- `coastalResources.test.ts`: dry spawn band, shallow coastal dig, inland/deep rejection;
- `dig.test.ts` / `digAction.test.ts`: existing stone behavior plus independent shell outcome and overflow drop;
- `mineableWork.test.ts`: exact action counts, 1–2 inclusive yield, stage transition and depletion;
- `mineableRocks.test.ts`: base kind → effective stage/collider mapping and tombstone behavior;
- `vegetationRegionBatcher.test.ts`: kind-aware keyed removal does not resurrect after sibling contribution rebuild;
- `chunkManager.test.ts`: loaded query excludes depleted rocks; collider large→small→none; reload projection from state;
- `saveData.test.ts`: old-version migration/default + round-trip sparse states.

Also assert that `getNearbyLandmarks()` never returns mineable rocks. This guards the identity separation.

## 16. Implementation order

A low-rework order is:

1. pure `coastalResources` + shell worldgen predicate;
2. shallow coastal dig classification + generic count acquisition + shell roll;
3. pure `mineableWork` and `mineableRocks` definitions;
4. stable `resourceId` in `EnvironmentPlacement`;
5. app-owned sparse state + persistence/migration;
6. state-aware ChunkManager query/colliders;
7. generalize batcher keyed removal + runtime override projection;
8. `Interactable` + `buildInteractables` + GroundActions rock mining dispatch;
9. bump chunk-tile cache version and complete targeted tests/documentation.

The cache-version bump can land with the worldgen identity/placement changes; do not bump unrelated cache namespaces.

## 17. Main pitfalls

- **Landmark leakage:** populating `EnvironmentPlacement.id` for rocks without changing `getNearbyLandmarks()` would make rocks masquerade as `LandmarkKind`.
- **Batch resurrection:** removing only the current `InstancedMesh` entry is insufficient; the region batcher's stored chunk contribution must also forget the keyed base placement.
- **Chunk reload resurrection:** even a correct batcher removal is session-local; attach/reload must project persisted rock state before batching/colliders.
- **Double ownership:** mutable progress belongs to one app/world state store, not both ChunkManager and save data objects.
- **Wrong cave reuse:** do not make cave 041 depend on surface collider code. Reuse only `mineableWork`.
- **Dig regression:** do not broaden underwater shovel eligibility globally or replace the existing sand stone chance with the shell chance.
- **Per-hit renderer cost:** intermediate hits should not rebuild a whole region if visible stage did not change.

## 18. Documentation after implementation

Update current-state documentation only if the implementation changes its described contracts. In particular:

- terrain/world generation docs for mineable environment-rock lifecycle if needed;
- persistence architecture/state for the new sparse save field;
- items catalog only if tool semantics actually change (they should not);
- 041 implementation notes after this plan lands, replacing its proposed independent atomic obstruction work with the landed `mineableWork` API.

Do not run `pnpm docs:sync` manually; repository automation owns generated documentation.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
