# Implementation Notes: Underground Locations & Portals

Recon baseline: `7437826b45f14a057f3ce57f371172cfaa65b249` (2026-10-31). Static source inspection only. These are current integration findings, not a second implementation plan. Revalidate during implementation.

## Cave registration is the first seam to inspect

`src/world/createCaves.ts::createCaves` owns `v2ByCaveId`, retained `CaveRuntime` records, definitions, presentation lifecycle, query hysteresis and disposal. `CreateCavesOptions` currently supplies a hydrated worldgen snapshot and a build-result sink; it is not a public arbitrary-location registration contract.

The internal `populateRuntimes` block is where cached and freshly generated topology/heightfield/anchors converge. Prefer extending that common construction seam with a validated closed-location input. Do not inject templates by forging an ordinary cached procedural cave: cached construction still performs physical-mouth side effects later.

Current hard couplings:

- `walkSurfaceAt = analyticSurfaceHeight - mouthCarveDepth(...entrance)`.
- Every ordinary definition replays `mouthCarveDiscs` through `chunkManager.modifyTerrain(...,'system')`.
- Each retained field feeds `caveTerrainCutout`; the resulting cutouts are registered under the cave owner key.
- The streaming grid is populated by entrance X/Z. `update(observerX,observerZ,dt)` uses XZ distance to bounds, a 3x3 grid neighborhood and `PRESENTATION_BUILDS_PER_UPDATE = 1`.
- `queryGround`, `occupancyHitAt`, `sampleGroundColumn`, `queryInterior` and horizontal resolution loop the retained runtimes. Global ground/occupancy calls supply the analytic surface sampler.
- `sampleGroundColumn` chooses the lowest floor where bounds overlap, whereas occupancy uses the first containing interval. Do not rely on iteration order to distinguish overlapping underground instances.
- `queryInterior` uses `heightfieldInteriorAt(..., topology.entrance,...)`; closed-space interior detection must not depend on walking past a physical mouth.
- `lastGroundHit` and the independent `player`/`camera` interior confirmation slots currently clear at disposal. A portal jump also needs deliberate continuity reset/revalidation.

`Caves.queryGroundIn`, `resolveHorizontalIn`, `resolveRouteBetweenPoints` and `resolveHabitat` are existing per-ID contracts. Keep player-neutral queries stateless and preserve O(1) ID lookup where already available.

`definitions()` is consumed by world locations, fauna and authored cave quests. Portal-only definitions must not silently become eligible for old mine/quest/adventure guarantees. Make access eligibility explicit at the owning boundary rather than patching individual quests after they bind the wrong cave.

## Baked fields and a closed envelope

`src/world/caves/caveHeightfieldRepresentation.ts::CaveHeightfieldRepresentation` contains grid bounds/origin, cell size, node counts, four Float32 arrays, min clearance, entrance, cave ID and seed. `floorY`/`ceilY` are spatial authority; `surfaceY` and `coreT` are cached derived fields still consumed by the current implementation.

`sampleHeightfieldAt`, `heightfieldNodeOpenSky`, `mouthOpeningAt` and the existing mesher use surface/ceiling semantics. Subtracting 100 from floor/ceiling without checking surface data and entrance semantics is not a valid template conversion.

`caveHeightfieldMesh.ts` welds the floor/ceiling surfaces at the rounded rim and clips ceiling at the open-sky contour. `caveHeightfieldPresentation.ts` adds mouth-specific mask/rocks and other presentation. Reuse the shared interior buffers/materials where possible; closed locations must not manufacture a visible mouth or underside catcher. Test the closed envelope and camera clearance.

A future rectangular-corridor generator may share fields/queries but need an adapted boundary mesher. Provenance is a narrow exporter/runtime-adapter boundary, not permission to assume the existing rounded rim produces square walls.

Translation-only placement must transform every related coordinate consistently: grid origin/bounds, height values, topology node and centerline positions, entrance/reference data, content/endpoint anchors and semantic pool/source positions if present. `coreT` is not a height and must not be offset. Instance IDs must be rebound consistently without using array order. Do not rotate/resample fields in MVP.

## Binary primitives are available, but the fixture importer is different

`src/persistence/worldgenFixtureCodec.ts`:

- `encodeWorldgenFixture` uses magic `SVWC`, a little-endian u32 JSON header length and an 8-aligned binary section.
- Typed arrays use metadata references and preserve their raw bytes; the decoder copies array slices.
- `gzipBytes`/`gunzipBytes` use browser compression streams.
- Codec records/header include worldgen-cache metadata and seed/profile. The existing decoder's structural checks do not validate a location's geometry, endpoint safety or memory budget.

`caveWorldgenCache.ts` defines `CaveManifestEntry` and `CaveDerivedPayload` (heightfield, anchors, pool) and validators; cache storage preserves typed arrays through structured clone. Cache validation is useful precedent, not sufficient validation for a portable curated template.

Reuse/extract only the byte primitives actually needed. Do not make a required location asset contingent on an IndexedDB cache hit, matching worldgen boot profile, or procedural fallback.

## App/player transition integration

`src/app/createApp.ts` composes cave ground/occupancy/horizontal callbacks around the current bundle. Save restore calls `setPosition(x,z,{groundQuerySeedY:savedY})` after yaw/pitch setup. Existing cave-save implementation notes describe their pre-fix state; current code is authoritative.

`PlayerController.setPosition` sets X/Z and an optional Y seed, then `snapToGround` and camera sync. `snapToGround` clears vertical velocity, jump request/phase and related motion state. It does not load a destination or validate an endpoint capsule transactionally.

`src/app/gameLoop.ts` drives terrain/cave relevance, map discovery/proximity, local interaction/combat and fauna/NPC composition. Keep a single transition owner in app/world composition, binding callbacks to the current WorldBundle generation. Do not put portal orchestration into the cave mesher or create an independent game loop.

Audit surface XZ consumers before enabling the home-settlement entrance: surface discovery, house-door proximity, lit-fire/human threat composition, positional sounds and ordinary colliders. The shared `WorldSpatialContext` and existing same-context interaction/combat filters are the integration vocabulary.

## Existing content owners and traps

`src/world/worldGeneratedContainers.ts`:

- `WorldGeneratedContainerSpec` supports explicit Y and `spatialContext`; Y without context throws.
- Saved records restore contents by spec ID; saved empty contents must win over initial loot.
- Runtime entries own Inventory and mesh. Current factory creates every supplied mesh eagerly, so splitting presentation from records may be needed for later many-location streaming.
- Save records omit derived context/Y because deterministic specs reconstruct them. Keep pinned specs available before hydration and avoid a second inventory authority.

`src/items/treasureGameplay.ts` already supplies deterministic loot profiles and sparse mutations; `src/world/treasureSites.ts` still defers generic locked/keyed cave treasure. Use ordinary fixed containers for the pilot rather than finishing unrelated key-placement rules.

`src/items/createDroppedItems.ts` still records X/Z and grounds through the surface sampler. Implement/revalidate `items-player-051` first, including projectile/overflow drops and save/rebuild. `OneTimeWorldItemPickup` in `createItemSpawners.ts` is another XZ-oriented path: do not assume a consumed-ID flag fixes placement/context. Reuse its one-shot identity through a minimal extension if loose authored pickups are included.

## Fauna continuity without teleportation

`src/fauna/persistentOccupants.ts` provides `persistentOccupantSlotKey`, `persistentAnimalId`, restore actions, declaration registration, capture and tombstones. `createFauna.ts` resolves a cave binding before spawning, skips removed/mismatched slots, hydrates before update and snapshots persistent animals via the existing registry.

`animalCaveHabitat.ts::AnimalCaveWorldContract` is the narrow world adapter; `AnimalHabitatBinding` points to a cave and optional home node. `AnimalCaveContext` contains home/entrance routes and optional pool sources. `AnimalAgent` uses these routes for normal cave/surface trips. A closed location cannot expose a fictional traversable entrance just to satisfy this type.

`dungeonResidents.ts` demonstrates purpose-hashed chamber assignments, but its bear/wolf population policy is unrelated to the pilot's eventual rats. Reuse stable slot mechanics, not that encounter balance.

No evidence from this recon establishes a general unloaded-location aggregate fauna simulator. Current cave-bound agents can remain full-rate under cadence rules. Keep the pilot bounded and measure it; do not claim that hiding presentation stops simulation cost. Any reduced unobserved behavior must be an explicit author decision.

`fauna-045` owns cross-context perception and physical-mouth awareness. Portal-only locations must never grant its entrance-awareness exception across the roof. Follow-up checks also cover human/torch/food stimuli and NPC reactions, not just player target acquisition.

## Persistence integration order

Central seams: `src/app/saveState.ts`, `src/persistence/saveData.ts`, `src/app/worldBundle.ts`, initial restore in `createApp.ts` and rebuild carry.

Prepare the correct pinned spatial definition before restoring the player, containers or bound residents. Failure to load an underground template must not reach ordinary surface grounding silently. During rebuild/disposal cancel in-flight destination work and preserve all authoritative mutations, including records whose presentation is absent.

Keep binary-format version, template revision, save schema and `WORLDGEN_EPOCH` separate. Baseline schema is v57 and epoch 0; re-read those constants at implementation time rather than reserving a future number here.

A feature flag is not a data rollback: disabling new portal access must retain required assets and restore support for saves already inside. Test before choosing any rollback path.

## Verification seams

Existing suites to extend selectively:

- `createCaves.test.ts`, `createCaves.contentAnchors.test.ts`, heightfield query/mesh/representation and presentation lifecycle tests;
- `worldBundle.caveTreasure.test.ts` and `worldBundle.caveCrate.test.ts`;
- persistent occupant and fauna cave/habitat tests;
- spatial context, interaction/combat, dropped-item and save migration suites.

Add focused portal transaction tests around injected loader/readiness/relocation callbacks; test stale async completion and cleanup, not browser animation implementation details. Reuse current reference seed `415424794`. Browser/performance verification remains author-owned.
