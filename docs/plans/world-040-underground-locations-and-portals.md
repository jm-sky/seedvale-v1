# Plan: Underground Locations & Portals

**Created:** 2026-10-31
**Status:** `planned` 📋
**Type:** feature
**Priority:** low · **Effort:** XL
**Depends on:** items-player-051, fauna-045, ~~world-027~~, ~~persistence-006~~, ~~persistence-008~~
**Domain:** `world`
**Subdomains:** `places` `simulation`
**Tags:** `caves` `portals` `persistence` `performance`
**Model:** Opus, Sonnet

## 1. Purpose and approval boundary

Introduce reusable underground locations reached through player-only portal interactions. Use the existing cave system first, with offline-prepared binary templates and deterministic, persistent content.

Author direction accepted on 2026-10-31:

- Overlapping floors are explicitly unnecessary. A 2.5D representation is sufficient.
- Start with the existing cave generator and runtime.
- Keep the design open to a later second generator for dungeon corridors with rectangular cross-sections. That generator is a potential extension, not MVP work.
- MVP ends with one underground cave accessible from one entrance in the home settlement, including a return route to that same surface entrance.

The author approved preparing this plan after reviewing the recon summary. This does not approve every proposed technical detail or authorize implementation in this documentation session. Architecture below is the recommended implementation direction; explicit open decisions remain author-owned.

Metadata `planned` records the requested backlog status. Dependencies and decision gates still apply. Do not interpret it as approval to implement deferred extensions.

## 2. MVP and future scope

### MVP

- One stable home-settlement entrance, using one agreed entrance presentation.
- One closed underground location, approximately 100 m below its surface reference.
- One offline-exported binary cave template generated with the current cave tools.
- Player interaction to enter; an interior return interaction leading to the same entrance.
- A small deterministic content fixture exercising existing fauna, container and item systems.
- Persistent consequences: emptied containers, collected items, animal state/death and corpse lifecycle.
- Save/load while underground, same-world rebuild, transition failure safety and cleanup.
- Isolation from surface interactions, collisions, perception, discovery and presentation as applicable.

“One entrance” means one surface access point plus its interior return endpoint. It does not require a second surface destination.

### Supported direction, outside MVP

- Several curated binary variants.
- Wells, hatches, crypts and hidden passages as alternative entrance presentations.
- Multiple portal endpoints per location; an exit may lead to another surface point.
- A second offline generator producing rectangular dungeon corridors.
- Additional deterministic events and authored quest consumers.

The endpoint data contract must not assume exactly two endpoints, but the MVP gameplay only exposes the home entrance and return. Do not implement global entrance distribution, a second surface exit, a generator-selection UI, quests or an event framework.

## 3. Verified recon

Static inspection baseline: `7437826b45f14a057f3ce57f371172cfaa65b249`. Revalidate source during implementation; no runtime, visual or FPS verification was performed by this recon.

| Area | Current source and behavior | Reuse and necessary adaptation |
|---|---|---|
| Cave representation | `src/world/caves/caveHeightfieldRepresentation.ts`: grid metadata and four `Float32Array` fields: `floorY`, `ceilY`, `surfaceY`, `coreT`. One floor/ceiling interval per X/Z. | Reuse spatial representation and queries. Offline export must produce a closed interior, not blindly translate an open-mouth cave. |
| Cave lifecycle | `src/world/createCaves.ts`: retained topology/heightfields exist independently of streamed presentation; lifetime is `WorldBundle`. Natural/adventure/dungeon recipes share the runtime. | Extend common construction/registration with portal-accessed definitions. Avoid a second cave manager. |
| Surface coupling | `createCaves` replays mouth terrain modifications, registers cutouts, derives definitions and habitat routes from an entrance. Presentation includes mouth masks/proxies/rocks. | Closed locations must skip physical-mouth operations and surface modifications. Audit query and habitat entrance assumptions. |
| Spatial identity | `src/world/spatialContext.ts`: `surface\|cave:<caveId>`; `Caves.spatialContextAt(XYZ)` uses strict occupancy, with open-sky mouth treated as surface. | Prefer one unique cave ID per underground instance and existing context equality. No new competing “inside dungeon” boolean. |
| Player relocation | `PlayerController.setPosition(x,z,{ groundQuerySeedY })` grounds from a Y seed and resets jump/fall state through `snapToGround`. App restore supplies saved player Y. | Reuse final movement commit; add orchestration for readiness, target validation, rollback and stale requests. A position setter alone is not a safe portal transaction. |
| Streaming | Cave presentation uses 55/80 m XZ relevance and a synchronous nearest-first build queue; retained fields remain queryable. Surface terrain/settlements also follow player XZ. | Closed interiors need explicit destination readiness/relevance so they neither render from above nor disappear during traversal. Keep surface simulation alive. |
| Fauna | `createFauna.ts`, `animalCaveHabitat.ts`, `dungeonResidents.ts`: ordinary `AnimalAgent`, cave bindings, stable persistent slots and hydrate-before-update. | Reuse residents and snapshot/tombstone registry. Closed locations have no walkable surface entrance; do not offer a fake route to surface needs. |
| Treasure | `worldGeneratedContainers.ts` accepts explicit Y and spatial context, restores contents by stable spec ID. `treasureGameplay.ts` provides deterministic loot and sparse lock/trap mutations. | Reuse fixed containers and inventories. Locked systemic cave treasure is still deferred in `treasureSites.ts`; MVP does not need to finish that system. |
| Loose items | `createDroppedItems.ts` is still XZ/surface-grounded. One-time pickups in `createItemSpawners.ts` also need explicit underground placement/context review. | `items-player-051` is a prerequisite; preserve one item owner and consumed-ID semantics, not a dungeon pickup registry. |
| Isolation gaps | `fauna-045` remains planned; current fauna/human inputs include XZ-only candidates. Legacy colliders can lack vertical extents. Map proximity/discovery consumes player XZ. | Reuse/finalize shared filters; test closed interiors under a populated settlement. Depth alone is not isolation. |
| Persistence/cache | `saveState.ts`, `saveData.ts`: central save pipeline (v57 at recon). `caveWorldgenCache.ts` stores topology/heightfield/anchors/pool as disposable derived data. | Mutable consequences stay in SaveData owners. An optional worldgen cache must never be the sole store of location mutations or curated templates. |
| Binary assets | `worldgenFixtureCodec.ts` already encodes JSON metadata and binary typed-array sections, gzip wrapped by callers. | Reuse appropriate byte/array primitives after checking coupling; the existing fixture importer is seed/profile/cache-record-specific, not a template loader. |

Relevant existing plans:

- [Player spatial context](./archive/world-027-player-spatial-context-and-cross-space-target-isolation.md).
- [Heightfield production migration](./archive/world-terrain-019-cave-heightfield-production-migration.md).
- [Dungeon archetype](./archive/world-terrain-024-dungeon-cave-archetype.md).
- [Persistent cave worldgen cache](./archive/world-terrain-030-persistent-cave-worldgen-cache.md).
- [Cave habitats](./archive/fauna-019-real-cave-habitats-and-animal-home-navigation.md) and [dungeon residents](./archive/fauna-027-dungeon-cave-residents-and-pool-foraging.md).
- [Player cave save continuity](./archive/persistence-006-player-cave-position-save-load-continuity.md).
- [Dropped-item continuity](./items-player-051-cave-aware-dropped-item-continuity.md).
- [Fauna perception boundary](./fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md).
- [Save format versus worldgen epoch](./persistence-008-save-format-vs-worldgen-epoch.md).
- [Lost Treasure Chronicles dungeon binding](./quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md): thematic overlap only. Do not retarget existing dungeon quest claims to the MVP location.

## 4. Template storage comparison

| Option | Advantages | Costs/limits | Recommendation |
|---|---|---|---|
| Baked heightfield + topology + anchors, binary typed arrays and metadata | Direct query/mesh consistency; predictable decoded size; no gameplay-time procedural construction | Closed-interior export and versioning required; dense rectangular grid; one floor interval per X/Z | MVP candidate |
| Topology/recipe + seed, build heightfield at load | Smaller source description; useful authoring recipe | Runtime generation cost; generated output can change with algorithms; not a fully baked template | Preserve as optional authoring input, not the only shipped representation |
| GLB presentation + separate traversal/collision data | Easier authored hard-edged rooms and props | Risk of visual/spatial mismatch; extra authoring/validation; GLB alone is not ground authority | Later alternative if the rectangular generator cannot meet the accepted visual requirement with common heightfield presentation |
| Existing worldgen boot fixture unchanged | Codec/cache machinery already exists | Tied to world seed, namespace/fingerprint and disposable cache import semantics | Do not treat it as the location content format |

Recommended asset contains:

- format/schema version, template ID and immutable content revision/hash;
- generator kind and generator revision for provenance, independent of instance identity;
- local-space heightfield, topology/connectivity and stable semantic anchors;
- endpoint anchors and safe arrival positions/orientation;
- bounded content-slot declarations and any required semantic water/food sources;
- declared bounds, clearance and decoded-size limits.

Retain all four heightfield arrays initially unless parity tests prove a derived field can be omitted. Geometry data alone is insufficient for current habitat routes, content placement and presentation semantics.

Binary validation must reject truncated/corrupt payloads, bad offsets or dimensions, unreasonable allocations, unknown required versions, invalid anchor references and unsafe endpoint positions. Validate numeric fields according to their semantics; existing codec support for non-finite numbers is not permission to accept non-finite walkable coordinates.

Compression is optional transport/storage detail. Record raw decoded bytes and compressed bytes separately. Put assets under a dedicated versioned repository path, proposed `public/underground-templates/`, with an index/manifest and reproducible exporter instructions. Final naming is a routine implementation choice.

A missing curated asset fails the transition safely. Do not silently regenerate a different layout or substitute another template.

## 5. Two generators, one location contract

Separate authoring/generation from runtime location identity and gameplay state:

```text
existing cave generator ──> offline export ──> versioned template
future corridor generator ────────────────> versioned template
                                              |
                                  common location runtime
```

The future generator is not implemented here. Preserve a small generator-kind/provenance field and a documented adapter boundary; do not build a plugin framework for one current producer.

For both producers, keep the common portal, stable slot IDs, persistence, spatial-context and lifecycle contracts. Do not branch inventory, combat or portal code on generator kind.

Rectangular cross-sections may require a different presentation adapter: the current rounded heightfield rim/mesher is not proven to produce crisp rectangular walls. The second generator must demonstrate visual/query/collision parity before choosing either a common baked heightfield output or an alternative spatial/presentation adapter. Do not promise unchanged meshing, add that adapter now, or require overlapping floors.

## 6. Proposed ownership and spatial architecture

Use `WorldBundle` as the lifetime/rebuild boundary. Prefer extending the existing `Caves` registration/runtime seams with a closed/portal access mode rather than adding `UndergroundManager`, another scene-world, another save database or a duplicate spatial registry.

Keep these separate:

1. **Template:** immutable reusable local-space asset and semantic slots.
2. **Location definition:** stable instance ID, template revision, placement and endpoint bindings.
3. **Mutable consequences:** records held by existing fauna, item, container and world-state owners.
4. **Presentation:** disposable meshes/materials/lights and readiness state.

A template may back multiple future instances; IDs must be namespaced by instance, not only template ID. Do not append a new revision to entity IDs and thereby refill a previously looted instance.

For MVP, use translation-only local-to-world placement with a validated underground volume. Approximate depth is a placement convention, not the isolation mechanism. Test non-overlap with existing cave volumes and ensure terrain clearance at the lowest surface over the footprint. Never carve a physical shaft or terrain mouth for a portal-only location.

Prefer XYZ-derived `cave:<instanceId>` using the shared resolver. Persist the XYZ needed for restore, not a redundant current-player context flag. A sparse instance/template-revision binding is different: it ensures the geometry referenced by saved mutations remains available.

Before committing placement, check the existing first-hit cave queries, Y-blind floor/ceiling consumers, mouth-specific interior detection and overlapping-volume behavior. If disjoint volumes and narrow closed-mode adaptations cannot preserve unambiguous queries, stop for author review rather than introducing a second space model silently.

## 7. Portals and transition lifecycle

Portal definitions are plain world data with stable endpoint IDs, source location/anchor, destination endpoint, arrival pose and player-only eligibility. Do not infer destination from “last entrance” alone: future exits must be able to target distinct surface positions.

MVP graph: home surface endpoint <-> interior endpoint. Test the data resolver with a third endpoint without shipping another surface exit.

Recommended transition:

1. Validate player state and source eligibility through normal interaction ownership.
2. Acquire a single transition token; reject duplicate/re-entrant activation.
3. Load/validate the pinned destination asset if needed; prepare spatial authority, arrival content and presentation. For surface return, wait for the destination terrain/collision data through existing chunk readiness mechanisms.
4. Validate a dry/standable arrival capsule, matching context and clear egress. Place the player outside the trigger activation area.
5. Commit through the existing player relocation seam with explicit Y seed, preserving the correct facing/camera contract and clearing stale target/action references and relevant query hysteresis.
6. Release transition-only readiness pins and input lock; dispose unneeded presentation through its owner.

Source location/pose remains authoritative until commit. Asset failure, cancellation, stale async completion or a WorldBundle rebuild must not strand the player, alter inventory, duplicate content or leave controls locked. Transition tokens are scoped to the WorldBundle generation.

Serialize no half-transition state: take save snapshots from a consistent committed source or destination. Preserve surface world time/simulation; a local input/readiness lock must not accidentally freeze the living world.

NPCs, livestock and wild fauna never receive portal travel actions or use the endpoint graph. No physical interior route reaches the surface. Mounted entry, leading animals and companion follow interactions require an explicit eligibility policy; conservative proposed MVP behavior is to require an unmounted player and leave all other actors in their current space.

## 8. Deterministic content and persistence

Declare content from stable instance ID + world seed + semantic slot ID with separate purpose salts. Do not use mesh UUIDs, load order, array indices or one advancing shared RNG stream. Template, loot, fauna and potential event rolls must not perturb each other.

Reuse:

- fixed `WorldGeneratedContainerSpec` with explicit XYZ/context and stable container IDs;
- existing `Inventory`, deterministic loot helpers and sparse lock/trap records when actually needed;
- ordinary `AnimalAgent` via `PersistentOccupantDecl`, habitat binding and existing persistent snapshot/tombstone registry;
- consumed one-time pickup IDs and the existing dropped-item owner once underground continuity is complete.

A container saved empty is still a saved container, not a reason to reroll loot. Animal death and eventual corpse removal must both survive re-entry/rebuild/save-load. Never let “not currently materialized” mean “dead” or “fresh”.

Keep residents on normal world-time/needs/corpse semantics. The exact population, sustenance setup and behavior while the location is not observed remain an author decision before the fauna slice; this plan does not approve freezing or resetting residents. Existing cave habitat logic can request a surface trip, so a closed-location habitat must offer valid local destinations or an agreed reusable movement policy. No special dungeon AI/FSM or silent starvation workaround.

Potential events are only an extension point: stable slot ID, deterministic initial conditions and sparse durable outcome if implemented later. No event dispatcher/quest framework in MVP.

Use central save assembly/validation/migration. Bump `CURRENT_SAVE_VERSION` with a real migration when adding persisted representation/semantics. Older compatible saves default to no prior underground mutations, while existing cave/player/item behavior remains valid.

Keep three version axes distinct: binary format, immutable template/content revision, and save schema. Apply `WORLDGEN_EPOCH` only per the existing checklist when existing persisted geography/identity becomes incompatible. An additive optional MVP location need not invalidate every old world automatically.

Do not replace a pinned template revision under an existing save. Retain supported assets, provide an explicit tested migration, or report incompatibility before entering/loading that location; no silent rebind, loot reset or surface fallback. Recovery behavior for an unavailable template while the saved player is underground is an explicit decision gate below.

## 9. Isolation and performance

Depth does not fix XZ-only consumers. Verify:

- interaction, melee/ranged acquisition and projectiles use existing context filters;
- fauna/NPC/human threat and attraction inputs reject cross-space candidates;
- legacy surface colliders without Y extents do not block underground movement;
- surface water cannot seize underground vertical motion;
- camera, interior fog, lights and audio use the correct space;
- map/discovery/quest proximity does not discover the home settlement's surroundings merely because the player walks below them;
- portal-only caves are not accidentally selected for existing authored cave quests, mine siting or physical entrance awareness.

Closed interiors have no physical-mouth awareness exception. Preserve ordinary walk-in cave entrance behavior from fauna-045.

MVP may keep its single small retained spatial field and bounded resident set resident; detailed updates must follow accepted shared semantics, not an unmeasured claim of offscreen savings. Load template data once per revision and instance mutable data independently. Avoid decoding, global cave scans per candidate, all-template builds or new recurring portal ticks.

Existing cave scans and XZ streaming are acceptable baselines only after measuring the one-location increment. Gate presentation by closed-location relevance and readiness; do not render it merely because the player stands above it. Do not disable settlement simulation to save rendering work.

Before shipping, record actual grid nodes, raw bytes (four Float32 fields alone = `16 * nx * nz` bytes), meshes/draw calls, resident count, transition decode/build duration, surface and interior frame times, and memory after repeated enter/exit. Select numeric asset/work budgets from measured MVP output before enabling the pilot. Do not invent FPS results or pre-emptively require LOD/workers.

## 10. Small reversible implementation slices

Each slice is independently reviewable and must leave existing walk-in caves unchanged. Implementation is future work.

| Slice | Work | Tests and acceptance | Reversibility |
|---|---|---|---|
| A — Offline template | Export one closed template using existing cave generation; versioned manifest/decoder; no gameplay entrance | Exact Float32 round-trip, topology/anchor identity, representative ground/occupancy/containment parity, corruption/size/version rejection; reproducible export with documented producer inputs | Remove exporter/unused asset; no save/world behavior changes |
| B — Empty closed location | Reuse cave runtime with closed access mode; validated placement; no terrain mouth, quest claims or fauna | Surface and interior at same XZ resolve correctly; no terrain deltas/cutouts; closed bounds contain player/camera; unrelated caves retain output; repeated prepare/dispose has no leaks | Keep pilot inaccessible; isolated runtime changes can be reverted |
| C — Player portal pair | Home endpoint + interior return, readiness transaction and failure cleanup; empty pilot first | Duplicate activation, asset failure, invalid arrival, cancellation/rebuild, stale completion and input-unlock tests; return waits for resident surface data; NPC/fauna cannot use endpoints; third-endpoint resolver test | Disable entrance discovery/activation while retaining loaded-save support |
| D — Content and save continuity | After dependencies, add agreed bounded fauna/loot/items; integrate sparse version bindings and normal saves | Empty chest/collected pickup/dead resident remain changed after exit, rebuild and load; underground dropped item stays underground; full and removed occupant snapshots survive unmaterialized periods; old-save migration and inside-location restore pass | Do not delete new save fields/assets on feature disable; preserve data and supported revision |
| E — MVP validation and stop | Author verifies one home entrance, traversable cave and same-point return; measure costs | Isolation matrix, repeated-entry memory test, surface/cave regressions and reference-seed measurements; all author-owned visual/gameplay checks recorded separately | No broader entrance rollout, second generator or additional surface exits |

Run targeted tests first, then typecheck/build appropriate to integration. Automated tests must exercise behavior/failure paths rather than mirror implementation. Manual gameplay/visual/performance checks belong to the author, including reference seed `415424794` and representative additional seeds. Compare performance on the same backend; never mix WSL and native Windows numbers.

## 11. Open decisions and author gates

These remain open without blocking documentation:

1. **Entrance presentation/placement:** well, hatch or another surface prop; select exact collision-safe home placement before slice C. Do not commandeer all existing drinking wells.
2. **Pilot content:** exact template size, species/count (rats are a candidate), loot, water/food and unobserved behavior before slice D. No newly approved ecology reduction is implied.
3. **Player eligibility:** mounted/leading/companion restrictions and arrival feedback before slice C. Proposed unmounted-only MVP requires author acceptance.
4. **Missing pinned revision:** refuse the affected load with an actionable message versus author-approved recovery to a known surface endpoint. Never silently choose or erase state.
5. **Future rectangular generator:** choose its output/presentation adapter only when a concrete prototype establishes compatibility and visual quality; no second generator work in this plan.

Routine details resolved by source/contract tests do not require repeated approval. If an open design affects the next slice, ask the author briefly before implementing that slice.

## 12. Completion and documentation

MVP is complete when one home-settlement entrance provides safe player-only travel to one closed cave and back; deterministic content retains its consequences through supported lifecycle operations; isolation and compatibility checks pass; and author-owned gameplay/performance verification is recorded.

Update relevant state and asset docs only when implementation actually changes those systems. Add useful JSDoc/`@domain world` or `@domain world-terrain` to public architectural seams for preflight discovery.

This plan does not implement production code or assets. After implementation, synchronize generated plan indexes through the repository generators, not hand-edited derived tables.

See [implementation notes](./implementation-notes/world-040-underground-locations-and-portals-implementation-notes.md) for verified ownership seams and integration hazards.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
