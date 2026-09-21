# Implementation notes: world-terrain-044 — runtime ground query authority and missing-chunk fallbacks

**Plan:** `docs/plans/world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md`  
**Recon basis:** current `main`, 2026-09-20

## Implementation status (2026-09-21)

Implemented as designed below, with the following scoping decisions:

- **`ChunkManager`**: added `sampleRuntimeHeight`/`sampleRuntimeSurfaceGround` (`RuntimeGroundSampler`, `PlayerController.ts`) plus pure, unit-testable cores `sampleResidentHeight`/`sampleResidentSurfaceGround` (`chunkManager.ts`, exported for `chunkManager.test.ts` — no full-manager construction needed). Old `sampleHeight`/`sampleFloor`/`sampleSurfaceGround`/`sampleBridgeDeck` untouched.
- **`slopeConstraint.ts`**: added `sampleResidentSlope`/`stepWithSlopeAndCollisionResident`, the nullable-safe siblings of `sampleSlope`/`stepWithSlopeAndCollision`. `sampleSlope`/`stepWithSlopeAndCollision` themselves are unchanged (per plan, kept non-nullable for worldgen/other pure callers).
- **Player**: `PlayerController` gates the per-frame horizontal step on `sampleResidentSurfaceGround(candidateX, candidateZ) !== null || caveGround(...) !== null` — an unavailable resident sample holds the player at the current position for that frame (retried next frame) instead of stepping onto `sampleHeight`'s permissive analytical fallback. This is a narrower fix than swapping the finite-difference slope probe itself: `PlayerController`'s own slope/trace-recording code stays on the existing `sampleHeight`-based `applySlopeMovementConstraint`/`sampleSlope`, since the destination-availability gate already prevents ever standing in the raw-fallback zone. The full nullable-slope-probe fix (`stepWithSlopeAndCollisionResident`) is used by NPC/fauna below, which go through the shared primitive directly.
- **NPC/fauna**: `NpcAgentDeps.sampleResidentSurfaceGround` / `AnimalAgentDeps.sampleResidentSurfaceGround` are **optional**. When present, the one detailed per-tick movement call site in each (`NpcAgent`'s `steerTo`; `AnimalAgent`'s `steerToward` and `driveMounted`) uses `stepWithSlopeAndCollisionResident`; when absent (existing tests/isolated callers), behavior is byte-for-byte the old `stepWithSlopeAndCollision(sampleHeight)` path. Wired from real `ChunkManager` data at every production construction site: `createSettlement.ts` (NPCs) → `SettlementsManager.ts` (home + detached/reconstructed livestock via `spawnAnimalDeps`) → `livestock.ts::spawnLivestock`/`createGuaranteedSheep`/`spawnAnimalFromRecord` (all 5 `AnimalAgent` construction sites) → `createFauna.ts` (wild fauna) → `worldBundle.ts` passes `chunkManager.sampleRuntimeSurfaceGround` into both `createSettlementsManager`/`createFauna` calls.
- **Out of scope, left unwired** (same optional-fallback contract, zero behavior change): `settlement/rats.ts`'s `AnimalAgent` construction — rats aren't in the plan's "Relevant files"; `createSettlement.ts::createSettlementRats` still receives the old `surfaceSampleHeight` only.
- Every new/changed call site kept the pre-existing `sampleHeight`/`sampleSurfaceGround`/`sampleBridgeDeck` analytical convenience queries for placement/worldgen/coarse/time-skip/off-screen paths untouched, per plan "do not globally replace `sampleHeight`".
- Verification: `npx tsc --noEmit`, full `vitest run` (8128 tests), `eslint . --fix`, and `vite build` all pass. Browser/gameplay verification (chunk-boundary walk/road/ford/bridge/dig crossings, NPC/fauna traversal, streaming-frontier hold behavior, cave arbitration) is the user's, per plan.

## Decision

Do not replace the existing deterministic analytical samplers. Add an **explicit resident/runtime ground contract** alongside them and route detailed movement through that contract.

The important separation is:

```text
analytical terrain query
  deterministic, streaming-independent
  valid for worldgen / placement / coarse off-screen logic

resident runtime terrain query
  authoritative only when owning ChunkRecord is ready
  reads runtime clone after roads/rivers/fords + TerrainModification replay
  unavailable when canonical resident tile is unavailable

resident movement surface
  resident runtime terrain + retained RoadBridgeSpec deck projection
  unavailable when owning chunk is not ready
  cave arbitration remains caller-owned
```

A missing/generating chunk must not silently become raw analytical terrain for detailed movement.

## Verified terrain/chunk authority

### Generated/canonical terrain

`src/terrain/chunkHeightmap.ts`

Deterministic chunk generation consumes full `ChunkTileParams`. The generated tile can include shaping not present in `sampleHeightAt(...fallbackParams)`, notably roads, settlement clearings, river channels/fords and bridge masks.

`src/terrain/chunkManager.ts`

`ensureLoaded()`:

1. creates a `ChunkRecord(state = 'generating')`;
2. retains river data;
3. builds `paramsFor()`, including road/ford/bridge projections;
4. loads/generates a canonical tile;
5. clones it with `cloneChunkTileForRuntime()`;
6. `attachChunkMesh()` replays all runtime `TerrainModification[]`;
7. only then sets `record.state = 'ready'`.

For a loaded ready chunk, the authoritative mutable terrain query source is therefore `record.tile`, not the raw analytical sampler.

### Current permissive fallback

`src/terrain/chunkManager.ts::readField()`

- ready record: `sampleApronGrid(rec.tile[field], ...)`;
- missing/generating record: falls through to `sampleHeightAt`, `sampleFloorAt`, etc. with `fallbackParams`.

This always-number API intentionally hides availability but changes semantics for `heights/floorHeights`.

`sampleBridgeDeckAt()` also depends on `record.bridgeSpecs`; missing record/specs returns `null`.

Current `sampleSurfaceGround` is:

```ts
sampleBridgeDeckAt(x, z) ?? readField('heights', x, z)
```

so missing residency can silently mean “no bridge + raw analytical terrain”.

## Ground-query entry points

### In `ChunkManager`

- `sampleHeight` — current hybrid runtime/analytical terrain-only query.
- `sampleFloor` — current hybrid runtime/analytical floor query.
- `sampleBaseHeight` — explicit seed-derived analytical base height, ignores runtime modifications.
- `sampleBridgeDeck` — bridge deck lookup from retained runtime `bridgeSpecs`; `null` also covers missing chunk.
- `sampleSurfaceGround` — bridge-aware movement surface but currently inherits the silent fallback.
- `sampleLocalWater` — separate mixed water-domain issue; leave for water follow-up except where types/wiring must remain compatible.

### Player

`src/app/createApp.ts`

- `PlayerController.create(..., bundle.chunkManager.sampleSurfaceGround, ...)`;
- after rebuild `player.setGround(bundle.chunkManager.sampleSurfaceGround, ...)`.

`src/player/PlayerController.ts`

- surface ground is composed with cave ground at caller level;
- slope/movement receives the injected surface sampler.

Player detailed movement should use the new explicit resident movement surface.

### NPCs

`src/settlement/createSettlement.ts`

- raw `sampleHeight` remains for placement;
- `surfaceSampleHeight = sampleBridgeDeck(x,z) ?? sampleHeight(x,z)` is composed for NPC/livestock movement.

`src/settlement/SettlementsManager.ts`

- same bridge-aware composition exists for detached/manager-created runtime animals/NPC-related movement;
- raw `sampleHeight` remains the routing/placement terrain query.

`src/ai/NpcAgent.ts`

- `sampleHeight: HeightSampler` is used broadly: construction/snap, live movement, follow targets, time-skip placement and other coarse/runtime paths;
- `stepWithSlopeAndCollision()` receives that sampler for finite-difference slope probes.

Do not globally make all NPC `sampleHeight` calls resident-only. Time-skip/coarse placement must remain streaming-independent.

### Fauna

`src/fauna/createFauna.ts`

- raw `sampleHeight` is intentionally used for deterministic spawn/habitat placement;
- `agentSampleHeight = sampleBridgeDeck ?? sampleHeight` is passed into `AnimalAgent`.

`src/fauna/AnimalAgent.ts`

- the sampler is used for live movement/snap and also broader lifecycle/debug paths.

Again, split detailed movement from analytical/off-screen semantics rather than replacing every height query.

## Bridge authority

Keep existing authority:

`src/settlement/roadNetwork.ts`
- canonical crossing identity -> `bridgeSpecOf()`;
- `bridgesNear()` dedupes by stable crossing/spec id and returns deterministic ordering.

`src/terrain/roadBridge.ts`
- `RoadBridgeSpec`;
- `bridgeDeckYAt()` / shared footprint math.

`src/terrain/chunkManager.ts::paramsFor()`
- retains bridge specs on each chunk whose footprint overlaps it;
- ready runtime queries should use those retained specs.

Do not derive bridge existence from presentation meshes and do not add a second bridge lookup/classification system.

## Target API contract

Add a narrow resident/runtime query to `ChunkManager`. Exact naming is implementation choice, but semantics should be explicit and nullable, for example:

```ts
type RuntimeGroundSampler = (x: number, z: number) => number | null

sampleRuntimeHeight(x, z): number | null
sampleRuntimeSurfaceGround(x, z): number | null
```

Rules:

- return `null` if the owning `ChunkRecord` is absent, generating, or has no runtime tile;
- `sampleRuntimeHeight` samples only `record.tile.heights`;
- `sampleRuntimeSurfaceGround` first resolves deck Y from that record's retained `bridgeSpecs`, otherwise samples the same runtime tile;
- do not call `sampleHeightAt()` from these methods.

Keep analytical capability explicit:

- `sampleBaseHeight` already exists and is the seed-derived base-height primitive;
- raw worldgen/placement code can continue to use current analytical/full-generation helpers as appropriate;
- do not make bridge decks terrain for placement.

If retaining existing `sampleHeight` hybrid semantics is required for compatibility, document it clearly as a convenience query and do not use it as detailed-movement authority after this plan. Avoid a broad rename/refactor.

## Detailed-movement unavailable policy

For detailed player/NPC/fauna movement, unavailable runtime ground should mean **movement cannot advance into that sample yet**, not “pretend base terrain is canonical”.

Reuse the shared movement primitive rather than adding separate policies.

Preferred minimal extension in `src/terrain/slopeConstraint.ts`:

- introduce a nullable runtime sampler type for the detailed movement wrapper;
- slope probing returns unavailable when any required finite-difference sample is unavailable;
- `stepWithSlopeAndCollision()` returns the current position / `moved: false` when the runtime ground needed for the step is unavailable.

Do not force `sampleSlope()` itself to become nullable for worldgen/other pure callers unless needed. A small resident-aware wrapper around the existing slope math is preferable if it avoids widening unrelated APIs.

At the candidate-step stage, the movement caller must also reject a destination whose resident runtime ground is unavailable. Otherwise the current finite-difference point may be resident while the target crosses into a missing chunk.

This produces a stable boundary behavior: detailed movers wait/stop at the loaded canonical surface boundary instead of seeing a fabricated cliff or stepping onto raw fallback.

## Player integration

`src/app/createApp.ts`

Pass the resident movement surface to `PlayerController.create()` / `player.setGround()`.

`src/player/PlayerController.ts`

Minimal expected changes:

- distinguish the resident movement-ground sampler from analytical/floor helpers;
- if ground at the intended/current detailed movement point is unavailable, do not advance into it;
- preserve cave arbitration: cave hit remains higher priority; resident outdoor surface is the fallback only when cave ground misses.

Do not make cave queries part of `ChunkManager`.

## NPC integration

Do not replace `NpcAgentDeps.sampleHeight` globally.

Add a separate optional/required detailed movement sampler to `NpcAgentDeps`, sourced from the ChunkManager resident surface through settlement construction.

Use it only for:

- per-tick surface movement;
- finite-difference slope constraint;
- live surface Y snap where the NPC is being simulated in detail.

Keep existing analytical/hybrid `sampleHeight` for:

- construction/reification where chunk residency is not guaranteed;
- time-skip;
- coarse travel checkpoints;
- target metadata/placement where the result must be available off-screen.

If the detailed sampler is unavailable during active surface movement, hold position and let the next tick retry. Do not materialize a chunk from the NPC hot path.

## Fauna integration

Apply the same split to `AnimalAgent`:

- retain analytical/hybrid `sampleHeight` for spawn/habitat/coarse lifecycle needs;
- pass a separate resident movement surface for detailed per-tick movement and slope checks;
- missing resident ground blocks that detailed step;
- cave-bound fauna keeps its existing cave query authority and surface fallback ordering.

`src/fauna/createFauna.ts` and settlement livestock wiring should consume the same ChunkManager resident movement query. Do not duplicate the bridge composition in three domains once a shared resident surface query exists.

## Shared-contract reuse

This plan should reduce existing parallel bridge-aware lambdas:

- `createSettlement.ts::surfaceSampleHeight`;
- `SettlementsManager.ts::surfaceSampleHeight`;
- `createFauna.ts::agentSampleHeight`.

They currently all encode `sampleBridgeDeck ?? sampleHeight`. Once `ChunkManager.sampleRuntimeSurfaceGround` exists, detailed movement should receive that one shared contract instead.

Keep their raw `sampleHeight` plumbing for placement/worldgen/coarse simulation.

This is the main shared contract with plan 043: both fixes preserve `ChunkManager` as the terrain runtime authority and avoid parallel state. 043 cleans what mutation history reaches a fresh manager; 044 makes reads from that manager explicit.

## Chunk-boundary behavior

Ready/ready seams are already structurally correct:

- runtime tiles use the same apron grid phase;
- `applyModificationToTile()` computes identical world-space deltas on overlapping apron texels;
- bridge specs are retained in every overlapped chunk.

Tests should protect this, not add seam reconciliation state.

Ready/missing must become explicit unavailable for resident movement.

## Minimal change set

Likely files:

- `src/terrain/chunkManager.ts`
  - add resident terrain/surface query methods;
  - no fallback inside them;
  - comments/types that distinguish analytical vs resident semantics.
- `src/terrain/slopeConstraint.ts`
  - resident/unavailable-safe movement wrapper or narrow nullable extension.
- `src/player/PlayerController.ts`
  - detailed movement uses resident surface.
- `src/app/createApp.ts`
  - wire resident surface into player; keep rebuild rewiring.
- `src/settlement/createSettlement.ts`
  - pass resident movement sampler to NPC/livestock, retain raw terrain sampler for placement.
- `src/settlement/SettlementsManager.ts`
  - same for detached/runtime-created agents.
- `src/ai/NpcAgent.ts`
  - separate detailed movement ground from coarse analytical height use.
- `src/fauna/createFauna.ts`, `src/fauna/AnimalAgent.ts`
  - same split for wild fauna.
- focused tests.

Do not refactor chunk generation, road routing, cave systems or water semantics.

## Implementation order

1. Add resident query methods to `ChunkManager` with unit tests for ready/missing behavior.
2. Add shared unavailable-safe detailed movement handling in `slopeConstraint.ts`.
3. Wire PlayerController to resident surface.
4. Split NPC detailed movement from existing analytical/coarse `sampleHeight`.
5. Split AnimalAgent detailed movement the same way.
6. Replace detailed-movement-only bridge composition lambdas with the shared resident surface query.
7. Add seam/bridge/modification regression tests.
8. Leave water follow-up scoped out.

## Tests

### ChunkManager query semantics

Add focused tests proving:

1. ready runtime tile query returns runtime tile data, not analytical fallback;
2. missing/generating resident query returns `null`;
3. road-shaped ready tile differs from analytical base where expected but resident query returns the shaped value;
4. river/ford-shaped ready tile returns canonical shaped value;
5. runtime `dig/scorch/prepare` is visible through resident query;
6. unload/reload reconstructs the same resident value from canonical tile + modification replay.

Where constructing a full manager is too expensive, extract a small pure helper for “read ready record or unavailable”; do not duplicate height generation in tests.

### Movement/slope

`src/terrain/slopeConstraint.test.ts` (create if absent) or existing adjacent tests:

- unavailable finite-difference probe -> movement blocked/held;
- unavailable target sample -> no step across boundary;
- all samples available -> existing slope behavior unchanged.

### Seams

- ready/ready neighboring apron samples match at/around boundary;
- modification overlapping a boundary matches on both runtime tiles;
- ready/missing does not fabricate a cliff because detailed movement receives unavailable rather than a raw number.

### Bridges

- resident surface returns deck Y on either side of a chunk boundary when both owning chunks are ready;
- missing owning chunk returns unavailable, not terrain-under-bridge;
- placement/raw terrain query still ignores deck Y.

### Consumers

Focused construction/wiring tests should assert:

- player uses resident surface after initial build and rebuild;
- NPC/Animal detailed step uses resident ground;
- time-skip/coarse/off-screen placement still has a streaming-independent height path.

## Performance implications

Required guardrails:

- resident query is O(1): `worldToChunk` + one map lookup + apron sampling / retained bridge list;
- no `bridgesNear()`, road routing, river reconstruction or chunk generation per sample;
- no world-global scans;
- no new worker requests from movement;
- no allocations in per-frame query path beyond what current sampling already requires;
- remote/aggregated simulation keeps analytical/coarse queries and does not require presentation chunk residency.

Blocking a detailed step at a missing boundary is cheaper and more deterministic than reconstructing a chunk in the hot path.

## Determinism implications

- ready runtime ground remains the authoritative mutable projection;
- off-screen analytical queries remain seed/config deterministic and camera-independent;
- detailed simulation no longer changes terrain semantics based on whether a fallback happened to be invoked;
- no player/camera data should enter analytical sampling or worldgen;
- bridge identity remains stable `RoadBridgeSpec.id`;
- no worldgen cache fingerprint change is needed unless implementation unexpectedly changes canonical tile generation (it should not).

## Manual verification

User/browser verification after implementation:

1. walk/run at chunk boundaries on ordinary terrain;
2. cross a road-shaped boundary;
3. cross a ford and a bridge spanning a boundary;
4. dig/prepare terrain close to a boundary and cross it;
5. observe NPC/fauna traversing the same areas;
6. move quickly enough to approach a streaming frontier and verify detailed movers wait rather than jump/snap to raw terrain;
7. verify caves still arbitrate floor/ceiling independently.

AI agent must not perform browser verification.

## Out of scope

- water-domain missing-chunk redesign (`sampleLocalWater`, river shore semantics);
- changing canonical chunk generation;
- new Terrain/Ground manager;
- chunk generation from per-agent movement queries;
- navigation/pathfinding redesign;
- cave spatial authority changes;
- settlement/worldgen placement policy changes;
- broad renaming of all `sampleHeight` call sites.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
