# Plan: Mineable rocks and coastal shell resources

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** M  
**Depends on:** none  
**Domain:** `world-terrain`  
**Type:** `feature`  
**Subdomains:** `terrain` `chunks` `rendering`  
**Tags:** `resources` `rocks` `shells` `mining` `shoreline` `persistence` `interaction`  
**Roadmap:** -
**Model:** Sonnet, Composer

## Goal

Turn existing coastal shells and decorative rocks into coherent resource interactions without creating parallel shovel, mining or cave-obstruction systems.

Target flow:

```text
terrain/worldgen
→ stable resource opportunity
→ ordinary held-tool capability
→ finite work
→ resource yield
→ persistent world mutation
→ presentation/collision follows authoritative state
```

This plan covers:

- shell worldgen concentrated tightly around the ocean shoreline;
- a shell find chance when digging beach/shallow-water sand with a shovel;
- mineable `largeRock` / `rockCluster` environment props;
- staged depletion of a large rock into a smaller stone pile;
- sparse persistent mining progress;
- a reusable finite-work contract suitable for the planned cave blockage in `quests-progression-041`.

It does **not** implement the Lost Treasure quest or cave blockage itself.

---

## Recon — current `main`

### Shells

`src/terrain/chunkItems.ts::computeChunkItems()` already generates deterministic finite `shell` pickups.

Current placement:

- shares the 3-candidate shell/stone pool;
- requires ocean/coast continentalness;
- rejects `height <= waterLevel + 0.5`;
- accepts shells as high as `waterLevel + 3`;
- applies `KEEP_CHANCE = 0.3`;
- persists collection through the existing stable item id + `collectedItemIds` contract.

This is already coastal, but the vertical band is broad and deliberately excludes the immediate shoreline. Tighten the existing generator instead of adding a second shell-spawn system.

Generated chunk tiles, including `items` and `environment`, participate in the persistent chunk-tile worldgen cache from `world-terrain-031`. A deterministic placement change must invalidate only that cache namespace/version.

### Shovel digging

`src/terrain/dig.ts` + `src/terrain/digAction.ts` + `src/app/actions/groundActions.ts` already implement:

```text
held soil_digging tool
→ classify aimed ground
→ busy work
→ terrain mutation
→ resource roll
→ inventory or dropped item
→ shared acquisition feedback
```

Current `getDigProfileAt()` rejects any point below `waterLevel + 0.1`, so even very shallow coastal water cannot be dug.

Current sand digging has a 15% stone chance. The resource-resolution path already knows how to add a count-backed item or drop it beside the dig if inventory is full.

Do not create a separate “search for shells” action. Extend successful shovel digging.

### Decorative rocks

`src/terrain/chunkEnvironment.ts` already deterministically generates:

- `largeRock`;
- `rockCluster`.

They are explicitly decorative today and have no stable resource identity because only proper landmarks receive IDs.

`src/terrain/chunkManager.ts` renders `largeRock` / `rockCluster` through the existing region-batched instancing path.

Both kinds currently participate in environment collision. Keep that behavior: large boulders and small clusters may both block movement, with their existing different collider radii.

### Mining/tool capability

The canonical tool gate already exists:

```ts
ItemCapability = 'rock_mining'
```

The pickaxe declares that capability in `src/items/itemCatalog.ts`.

Existing player code uses `hasItemCapability(heldTool.held(), 'rock_mining')` for held-tool mining/ground interactions. Decorative-rock interaction must reuse this exact capability instead of checking `kind === 'pickaxe'`.

Ore deposits already have finite mining/yield behavior through `mineableDeposit.ts`, `depositMining.ts`, `resourceDeposits.ts` and `GroundActions.startDepositMine()`. Reuse their action/yield conventions where applicable, but do not force decorative environment rocks into the ore-deposit ownership model.

### Cave blockage

`quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md` is still planned.

Its implementation notes correctly require:

- a stable world/cave obstruction identity;
- `rock_mining` as the ordinary tool capability;
- sparse persistent mutation;
- quest state observing world state rather than owning it;
- cave traversal integration through cave spatial authority, **not** an ordinary surface collider.

There is currently no landed generic obstruction/destructible-world registry.

This plan should therefore provide only the reusable finite-work/progress contract. A later 041 implementation should reuse that contract while retaining cave-owned placement, presentation and traversal blocking.

---

## 1. Shared coastal-shell classification

Create one small pure shoreline helper rather than duplicating coast rules between worldgen and digging.

Suggested ownership:

`src/terrain/coastalResources.ts`

The helper should consume already-existing terrain signals:

- height;
- `waterLevel`;
- continentalness;
- `RegionParams.oceanThreshold` / `coastThreshold`.

Expose narrowly-scoped predicates, conceptually:

```ts
isShellSpawnShore(...)
isShellDigShore(...)
```

Do not introduce a general biome/terrain classification layer.

### Spawn band

Change procedural shell placement from the current broad `+0.5 .. +3m` dry band to a visibly shoreline-focused band.

Initial balancing target:

- dry/edge placement only;
- roughly `waterLevel + 0.1 .. waterLevel + 1.25m`;
- still require the existing ocean/coast continentalness band;
- keep slope rejection;
- keep stable deterministic IDs and finite collection.

The exact upper bound should be a named balancing constant, not embedded in the generator.

Do not spawn ordinary pickup meshes underwater in this plan.

---

## 2. Shells from beach digging

Extend the existing shovel dig flow.

### Eligibility

A shell roll occurs only when:

- the held tool has `soil_digging`;
- the aimed point is coastal/ocean shoreline according to the shared helper;
- ground is sand / beach material;
- the point is dry shoreline **or shallow water**.

Initial shallow-water allowance:

- at most about `0.35m` below `waterLevel`.

This must not enable shovel digging across arbitrary ocean floor, lakes or rivers.

### Chance

Use one named constant:

```ts
SHELL_CHANCE_SHORE_DIG = 0.18
```

18% intentionally sits in the requested 15–20% range.

The shell roll is an **additional independent find** after a successful eligible dig. Preserve the existing stone chance and stone behavior so this feature does not silently nerf current shovel resource acquisition.

Result handling reuses the existing inventory/drop/acquisition-feedback path:

```text
successful dig
→ existing stone resolution
→ if coastal sand: 18% shell roll
→ add shell if capacity permits
→ otherwise drop shell beside dig
```

Refactor `digAction.ts` only as far as needed to share count-backed resource acquisition; do not create a shell-specific inventory path.

### Terrain mutation in shallow water

The existing `ChunkManager.modifyTerrain()` remains the mutation owner. Only the dig-validity rule changes.

Verify that an aimed shallow-water point reaches the ground-dig target path. If water targeting currently masks the ground target, fix the existing interaction candidate/aim seam rather than adding a second input action.

---

## 3. Reusable finite mineable-work contract

Introduce a small pure domain primitive for repeated capability-gated work.

Suggested ownership:

`src/world/mineableWork.ts`

It should describe **work/progress**, not rendering, collision, terrain or quests.

Conceptually:

```ts
type MineableWorkStage = {
  id: string
  actionsRequired: number
  yield: { kind: ItemKind; min: number; max: number }
}

type MineableWorkDefinition = {
  requiredCapability: ItemCapability
  stages: readonly MineableWorkStage[]
}

type MineableWorkState = {
  stageIndex: number
  actionsInStage: number
}
```

Provide pure operations that:

- resolve current stage;
- apply exactly one completed work action;
- return the resource yield;
- report stage transition / final depletion;
- are testable with injected RNG.

Do **not** add a global manager or generic “destructible world object” hierarchy.

Owners keep their own stable definitions and spatial behavior.

This contract is the intended reuse point for:

- surface decorative rocks in this plan;
- the planned cave obstruction in `quests-progression-041`;
- later finite physical resource props where appropriate.

For 041, reuse should be limited to capability + finite-work progress. Cave blockage collision/traversal remains cave-owned.

---

## 4. Stable identity for mineable environment rocks

Add deterministic stable IDs to generated `largeRock` and `rockCluster` placements.

Identity must derive from stable worldgen inputs such as:

```text
seed/chunk + rock candidate ordinal
```

Do not use:

- Three.js UUID;
- instance index after batching;
- object identity;
- current camera/load state.

Avoid changing IDs of existing proper landmarks.

Prefer either:

- a dedicated optional `resourceId` / `environmentId` for mineable decoration; or
- making `EnvironmentPlacement.id` available to rocks with an explicit contract separating resource identity from `LandmarkKind`.

Do not start treating rocks as landmarks merely because they gain IDs.

---

## 5. Rock stages and yield

Initial balancing data should live in one definition table, not in interaction handlers.

### `largeRock`

Stage A — boulder:

- 4 completed pickaxe actions;
- each action yields 1–2 `stone`;
- large visual and large collider remain through actions 1–3.

After action 4:

- transition to a `rockCluster` / stone-pile visual at the same stable world position;
- replace the large collider with the ordinary smaller `rockCluster` collider.

Stage B — pile:

- 3 completed pickaxe actions;
- each action yields 1–2 `stone`;
- small collider remains while the pile still exists.

After action 3:

- resource is depleted;
- presentation disappears;
- collider disappears;
- it never regenerates in this plan.

### `rockCluster`

Initial target:

- 3 completed pickaxe actions;
- 1 `stone` per action;
- existing small collider remains while the cluster exists;
- after the final action both visual and collider disappear.

Keep the definitions easy to rebalance without changing lifecycle code.

---

## 6. Player interaction

Expose only nearby, non-depleted generated rocks through the existing interaction candidate system.

Requirements:

- rock mining interaction is available only while the **held** item has `rock_mining`;
- use the existing interaction targeting / prompt / cycling mechanism;
- use the existing `busy` physical-work channel;
- reuse mining action sound/feedback from deposit mining where suitable;
- grant actual yielded `stone` through the same inventory/drop helper used by other count-backed acquisition;
- do not mutate progress if the action is cancelled before completion.

Suggested interaction prompt:

- boulder: `Rozbij skałę`;
- pile/cluster: `Rozbij kamienie`.

No separate keyboard/mobile input path.

---

## 7. Rendering and batching

Untouched generated rocks must remain on the current region-batched/instanced path.

Do not convert every rock into an individual `Object3D`.

When a rock first diverges from its deterministic base state:

1. suppress/remove its base batched instance by stable rock ID;
2. create only that changed rock as an individual runtime override when a visible stage is still required;
3. on stage transition, replace the override visual with the next-stage visual;
4. on final depletion, keep the base instance suppressed and remove the override.

Reuse the existing tree lifecycle precedent where it fits: bulk/base state stays instanced; runtime-mutated exceptional state may be an individual object.

If `vegetationRegionBatcher` currently cannot remove a rock by stable key, add the smallest keyed removal/rebuild seam needed for the affected region. Do not rebuild all loaded vegetation for every pickaxe hit.

No visual rebuild is required for intermediate hits unless feedback is added cheaply; the meaningful visual transition is boulder → pile → gone.

---

## 8. Collision

Collision generation must read the same authoritative mineable state as presentation.

Rules:

- active `largeRock` boulder stage: existing large-rock collider;
- transitioned large-rock pile: ordinary smaller `rockCluster` collider;
- ordinary active `rockCluster`: existing cluster collider;
- depleted rock/cluster: no collider.

When state changes:

```text
largeRock action 4
→ boulder stage complete
→ visual switches to cluster
→ collider changes large → small

cluster final action
→ depleted
→ visual removed
→ collider removed
```

Use the existing chunk collider registry/rebuild seam. Do not add a second physics registry.

The collider change/removal must occur in the same completed-work mutation as progress, so the player cannot see a depleted rock still blocking movement.

---

## 9. Persistence and lifecycle

Rock placement remains deterministic worldgen.

Persist **only sparse mutation state** for rocks whose base state changed.

Suggested shape:

```ts
type SaveMineableRockState = {
  id: string
  stageIndex: number
  actionsInStage: number
}
```

A fully untouched rock needs no save entry.

A fully depleted rock must remain represented by sparse mutation/tombstone state so deterministic worldgen does not respawn it.

Requirements:

- progress survives chunk unload/reload;
- progress survives same-session `WorldBundle` rebuild;
- progress survives save/load;
- depleted rocks do not return;
- New Game clears the sparse state;
- save migration defaults to no changed rocks.

Use one authoritative app/world-owned mutable state carried into each rebuilt `WorldBundle`, following the established lifecycle pattern for other persistent world mutations.

Do not write mutable progress into cached `ChunkTileResult`.

A save-schema change requires the normal `CURRENT_SAVE_VERSION` migration path.

---

## 10. Chunk/worldgen cache invalidation

This plan changes deterministic `chunkItems` shell placement and adds stable generated rock identity.

The persistent chunk-tile cache stores both `items` and `environment`.

Therefore bump the **chunk-tile worldgen cache namespace/version/fingerprint as required by its current implementation**, invalidating only that derived cache.

Do not globally clear unrelated worldgen caches.

Mutable mined-rock state stays downstream of the cache.

---

## 11. Cave obstruction reuse contract

Do not implement the 041 obstruction here.

Instead ensure the finite-work primitive is usable like:

```text
041 cave obstruction definition
→ requiredCapability = rock_mining
→ mineable-work progress
→ cave-owned cleared mutation
→ cave-owned presentation + traversal update
→ QuestManager observes cleared state
```

Important boundary:

- surface rocks own ordinary environment colliders;
- cave rubble must continue to own blocking through the cave spatial/traversal authority required by 041.

“Shared mechanism” means shared work/progress/capability semantics, **not** shared collision ownership.

When 041 is implemented, its implementation notes should be updated to point to the landed finite-work API instead of creating an independent atomic mining action.

---

## 12. Performance constraints

Do not add a global per-frame rock scan.

Preferred runtime behavior:

- deterministic base placements already arrive with chunk data;
- chunk loading registers only active colliders;
- interaction query inspects loaded nearby rock placements/state only;
- mining progress mutates one stable rock ID;
- renderer/collider refresh is localized to the affected rock/chunk/region;
- persistence is sparse.

Untouched rocks must retain the current batched rendering cost.

Avoid per-rock timers or update loops.

---

## 13. Relevant files / likely integration points

Verify current `main` during implementation.

Primary:

- `src/terrain/chunkItems.ts`
- `src/terrain/chunkItems.test.ts`
- `src/terrain/chunkEnvironment.ts`
- `src/terrain/chunkManager.ts`
- `src/terrain/vegetationRegionBatcher.ts`
- `src/terrain/dig.ts`
- `src/terrain/digAction.ts`
- `src/app/actions/groundActions.ts`
- `src/app/interactables.ts`
- `src/interaction/Interactable.ts`
- `src/items/itemCatalog.ts`
- `src/persistence/saveData.ts`
- `src/app/saveState.ts`
- `src/app/worldBundle.ts`
- `src/app/createApp.ts`

Reuse/reference:

- `src/terrain/mineableDeposit.ts`
- `src/terrain/depositMining.ts`
- `src/terrain/resourceDeposits.ts`
- `src/terrain/colliderRegistry.ts`
- `src/app/actions/acquisitionFeedback.ts`
- `docs/plans/quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md`
- its implementation notes
- `docs/plans/world-terrain-031-persistent-chunk-tile-worldgen-cache.md`

Add concise JSDoc with `@domain world-terrain` / `@domain world` for reusable finite-work/state APIs where useful for preflight navigation.

---

## 14. Non-goals

Do not implement:

- ore generation changes;
- new pickaxe/tool durability;
- NPC autonomous decorative-rock mining;
- settlement mining profession changes;
- arbitrary destructible props;
- voxel/destructible terrain;
- underwater shell pickup meshes;
- lake/river shell digging;
- cave obstruction/quest 041 itself;
- rock respawn/regrowth.

---

## 15. Automated verification

Cover at least:

### Shell worldgen

- shell candidate accepted close to ocean shoreline;
- candidate too far/high from shoreline rejected;
- inland/lake-like terrain does not satisfy ocean shell predicate;
- deterministic IDs remain stable for the same seed/chunk;
- changed worldgen cache version prevents stale placement reuse.

### Digging

- ordinary soil behavior unchanged;
- ordinary sand still keeps current stone chance;
- eligible coastal sand adds an independent 18% shell roll;
- shallow coastal water within configured depth can be dug;
- deeper water is rejected;
- inland shallow water does not gain shell chance;
- inventory-full shell result drops beside the dig;
- cancelled work produces no shell and no terrain/resource mutation.

### Mineable work

- large rock requires exactly 4 boulder actions before stage transition;
- every large-rock action yields 1–2 stones;
- transition preserves stable rock identity;
- pile then requires exactly 3 more actions;
- cluster action yield/count follows its definition;
- invalid capability cannot advance work;
- pure reducer reports stage transition/final depletion correctly.

### Rendering/collision state

- untouched rocks remain base/batched;
- partially mined large rock still renders as large boulder;
- action 4 switches visual to cluster and collider large → small;
- active ordinary cluster keeps its collider;
- final cluster depletion removes both visual and collider;
- chunk reload reconstructs the correct stage without restoring the base instance.

### Persistence

- partial large-rock progress survives save/load;
- transitioned pile survives save/load;
- partial cluster progress survives save/load;
- depleted rock remains absent;
- same-session WorldBundle rebuild preserves progress;
- New Game clears mutation state.

### 041 compatibility

- finite-work API is presentation/collision agnostic;
- it can describe `rock_mining` work without importing terrain/chunk code.

Manual browser verification remains the User's responsibility.

---

## 16. Manual verification

User verifies in browser:

1. Walk a coastline: shell pickups visibly concentrate very close to the waterline.
2. Dig beach sand with shovel repeatedly: shells appear roughly at the expected 15–20% rate over a reasonable sample.
3. Stand in very shallow coastal water and dig: action works; moving deeper stops it.
4. With no pickaxe: decorative rock has no mining action.
5. With pickaxe:
   - large rock gives stones on each hit;
   - after the fourth completed hit it becomes a smaller rock pile and remains collidable with a smaller obstruction;
   - the pile takes three more hits;
   - after final hit it disappears and can be walked through.
6. Ordinary small rock cluster takes three hits, remains collidable until the final hit, then disappears/unblocks passage.
7. Save/reload during each stage and confirm state is unchanged.
8. Leave/re-enter the chunk and confirm no visual/collider reset.

---

## 17. Completion criteria

The plan is complete when:

1. shell procedural spawn is visibly shoreline-focused;
2. shovel digging on eligible coastal sand/shallow water has an 18% shell chance;
3. existing non-coastal dig behavior remains intact;
4. generated large/small rocks have stable resource identity;
5. both use the canonical held `rock_mining` capability;
6. a large rock yields 1–2 stones for 4 actions, transitions to a smaller collidable pile, then yields for 3 more actions;
7. an ordinary rock cluster has 3 mining actions and remains collidable until depletion;
8. collider state always follows the active rock stage;
9. depleted rocks remain depleted across streaming, rebuild and save/load;
10. untouched rocks remain on the existing batched rendering path;
11. a small presentation-agnostic finite-work primitive exists for later reuse by cave obstruction 041;
12. deterministic worldgen cache invalidation is scoped correctly.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
