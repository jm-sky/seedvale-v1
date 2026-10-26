# Implementation notes: world-terrain-043 — system terrain modification rebuild idempotency

**Plan:** `docs/plans/archive/world-terrain-043-system-terrain-modification-rebuild-idempotency.md`  
**Recon basis:** current `main`, 2026-09-20

## Decision

Fix this at the **same-world WorldBundle rebuild carry boundary**, not inside cave/fauna producers and not by inventing identities for additive terrain modifications.

The authoritative contract should be:

```text
app-owned TerrainModification[]
  player entries  -> historical mutable world state -> carry across rebuild + persist
  system entries  -> deterministic/runtime projection -> discard before rebuild
fresh WorldBundle
  -> fresh ChunkManager receives only carried player entries
  -> caves/fauna deterministically emit current system entries once
```

No second registry, no coordinate-based deduplication and no producer-specific “already applied” flags.

## Verified ownership and lifecycle

### Long-lived state

`src/app/createApp.ts`

- `let modifications: TerrainModification[]` is app/session-owned.
- It is hydrated by `terrainModificationsFromSave()`; all restored entries are tagged `source: 'player'`.
- It is exposed to save code through `getModifications: () => modifications`.
- A genuine New Game replaces it with `[]`.
- Ordinary `rebuildWorld()` currently passes the same array into `rebuildWorldBundle(..., modifications, ...)`.

This is the correct ownership boundary for rebuild carry semantics.

### Runtime mutation owner

`src/terrain/chunkManager.ts`

- `ChunkManagerConfig.modifications` is intentionally caller-owned.
- `createChunkManager()` aliases it as `const modifications = config.modifications`.
- `modifyTerrain()` appends `mode: 'dig'`.
- `scorchTerrain()` appends `mode: 'scorch'`.
- `applyExactHeights()` is the only existing identity-aware mutation path: `mode: 'prepare'` with a stable `id`, replaced in place.
- `attachChunkMesh()` replays the whole array once onto a fresh runtime clone of the canonical tile.
- Ordinary `buildAndAttachMesh()` does **not** replay the list again; it remeshes the already-mutated runtime tile.

Therefore the bug is specifically rebuild carry, not remesh replay.

### Persistence

`src/app/saveState.ts::buildSaveData()`

- serializes only `deps.getModifications().filter((m) => m.source === 'player')`;
- system modifications are intentionally not persisted.

Do not change the save schema or `CURRENT_SAVE_VERSION`.

## System producers verified

### Caves

`src/world/createCaves.ts`

After deterministic cave definitions are resolved:

- `mouthCarveDiscs(def.entrance)`
- each disc calls `chunkManager.modifyTerrain(..., 'system')`.

Separately, cave terrain holes use `registerTerrainCutouts(TERRAIN_CUTOUT_OWNER_KEY, ...)`. Cutouts are manager-lifetime derived state and already replace by owner key; they are **not** part of this defect.

### Fauna

`src/fauna/createFauna.ts`

System emissions:

- deterministic rock-den depression:
  `terrainCarving.modifyTerrain(..., CAVE_DEPRESSION_*, 'system')`;
- restored disabled/recovering spawn points:
  `scorchTerrain(..., 'system')`, falling back to `modifyTerrain(..., 'system')`.

Player action remains distinct:

- `destroySpawner()` writes the burn patch with `source: 'player'`.

Do not alter these producer semantics.

## Logical identity

Current code has no logical id for additive `dig` / `scorch` records. Their identity is effectively their occurrence in history; repeated entries intentionally stack.

Only `prepare` has a stable `id` and replace-in-place contract.

Therefore:

- do **not** add an id to cave/den/scorch system records;
- do **not** dedupe by rounded x/z/radius/depth;
- do **not** make `modifyTerrain()` globally idempotent.

Those approaches would change valid additive player semantics and create a parallel identity model.

## Exact rebuild path

`src/app/createApp.ts::rebuildWorld(resetCollectedItems = false)`

1. saves current world;
2. on New Game, resets `modifications = []`;
3. ordinary rebuild leaves `modifications` intact;
4. calls `rebuildWorldBundle(..., modifications, ...)`.

`src/app/worldBundle.ts::rebuildWorldBundle()`

1. snapshots other live WorldBundle state;
2. disposes old systems including `chunkManager`;
3. clears module-level road caches;
4. calls `buildWorldSystems({ ..., modifications, ... })`;
5. `buildWorldSystems()` creates a fresh `ChunkManager`;
6. caves/fauna are built again and append deterministic system entries.

The replacement manager therefore receives old system entries before new producers replay them.

## Target contract and preferred integration point

Add one small helper at the app/world rebuild seam, preferably in `src/app/worldBundle.ts` if it can stay pure and directly testable, e.g. semantics equivalent to:

```ts
carryTerrainModificationsAcrossRebuild(modifications)
  => modifications.filter((m) => m.source === 'player')
```

The important behavior is the ownership rule, not the exact helper name.

Preferred implementation shape:

- before constructing the replacement systems for an ordinary same-seed rebuild, create/carry a list containing only player-authored entries;
- ensure `createApp.ts` updates its long-lived `modifications` binding to that carried array, because save accessors and the next rebuild must point at the same array that the fresh `ChunkManager` mutates;
- pass exactly that array into `rebuildWorldBundle/buildWorldSystems`.

Do **not** merely filter into a temporary array inside `buildWorldSystems` while leaving `createApp.ts` pointing at the old mixed array. That would split ownership and future saves/rebuilds from the live manager.

A narrow alternative is for `rebuildWorldBundle` to return/expose the carried array, but that is more invasive than resolving it in `createApp.ts::rebuildWorld`. Prefer the smallest ownership-preserving change.

## Minimal change set

Expected files:

- `src/app/createApp.ts`
  - ordinary rebuild carry filtering;
  - retain New Game reset behavior;
  - ensure the app binding and fresh manager share one array.
- optionally `src/app/worldBundle.ts`
  - only if a pure exported/testable carry helper belongs here.
- tests near terrain/app rebuild semantics.
- no required changes in `createCaves.ts`, `createFauna.ts`, `saveState.ts` or `chunkManager.ts` unless comments/tests need alignment.

## Implementation order

1. Add a pure carry/filter helper or equivalent narrow logic.
2. Apply it in `createApp.ts::rebuildWorld()` only for same-world rebuild carry.
3. Confirm the fresh manager receives the resulting array by reference.
4. Leave deterministic system producers unchanged.
5. Add regression tests.
6. Keep save serialization test coverage for player-only persistence.

## Tests

Primary regression should be pure and not require Three.js rendering.

Add coverage proving:

1. input contains:
   - one player `dig`,
   - one player `prepare`,
   - one system `dig`,
   - one system `scorch`;
2. same-world carry contains only the two player entries;
3. the carried array can then receive a freshly reconstructed system effect once;
4. carrying again removes that system entry again;
5. repeated rebuild cycles therefore keep player history stable while system count/deformation does not accumulate.

Existing relevant test location:

- `src/terrain/chunkManager.test.ts` already covers `applyModificationToTile()` grid behavior; extend there only if the helper is terrain-owned.
- If the carry helper lives in app/world composition, add a focused adjacent test instead of forcing app lifecycle through `chunkManager.test.ts`.

Retain/extend save coverage for `source === 'player'` filtering if there is already a save-state test nearby.

## Performance implications

Positive/neutral:

- rebuild carries fewer records;
- chunk reload replay loops become shorter after any rebuild;
- no new per-frame/per-agent work;
- no hashing or coordinate scans in producers.

Do not touch the separate global `modificationsEpoch` cache invalidation issue; audit F04-03 explicitly left that for measured performance work.

## Determinism implications

This restores intended determinism:

- player history is stateful and carried;
- system effects are reconstructed solely from deterministic cave/fauna state;
- same seed + same authoritative persistent state yields the same system deformation after any number of rebuilds.

No RNG, worldgen fingerprint or save migration should change.

## Manual verification

User/browser verification after implementation:

1. locate a deterministic cave mouth or rock den;
2. trigger an ordinary same-seed world/graphics terrain rebuild several times;
3. verify the depression/recess does not deepen each time;
4. make a player dig/scorch/preparation;
5. rebuild and verify the player modification survives once;
6. for a disabled/recovering habitat spawner, rebuild repeatedly and verify the burn depression remains stable.

AI agent must not perform browser verification.

## Out of scope

- terrain-modification identity redesign;
- deduping arbitrary player digs/scorches;
- changing cave geometry or cutouts;
- fauna spawn/lifecycle redesign;
- save schema changes;
- mesh-cache epoch optimization;
- terrain/chunk subsystem refactor.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
