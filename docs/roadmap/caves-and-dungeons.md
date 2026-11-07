# Caves and Dungeons — Design Roadmap

**Created:** 2026-11-07  
**Status:** Author-discussed design direction; **not** an approved implementation plan  
**Target:** SeedVale V1 (`jm-sky/seedvale-v1`)

## Goal

Increase world variety, meaningful exploration and quest opportunities while retaining V1's deterministic, autonomous simulation, existing cave/quest mechanisms and persistence continuity. This roadmap records ideas and intended design, not implementation authorization, milestones or verified runtime behavior.

## Classification

Use clear environment and scale names rather than the misleading `adventure` archetype (any cave may support an adventure).

| Proposed kind | Existing source | Intent |
|---|---|---|
| `cave:small` | V1 `natural` | Natural cave, unchanged |
| `cave:medium` | V1 `adventure` | Branched natural cave, optional furnishings, one enlarged chamber |
| `cave:large` | V1 `dungeon` | Extensive natural cave with one enlarged, genuinely two-level chamber |
| `dungeon:small` | V2 geometry donor | Small, more regular/angular constructed underground complex |
| `dungeon:large` | V2 geometry donor | Larger castle-related underground complex |

These are **proposed public/design labels**, not a mandate to immediately rename runtime identifiers. Assess references in quests, deterministic generation, cache versions, saves and stable cave identities before any migration.

## V1 natural caves

### `cave:small`

Keep existing natural cave layout and behavior unchanged.

### `cave:medium`

- Keep V1's rounded, organic heightfield geometry and branched structure.
- Make torches/lanterns and environmental props optional rather than visually guaranteed. Distinguish decorative props, interactive containers and quest-reserved content: turning decorations off must not remove necessary quest objects.
- Enlarge one chamber by **50–100%** relative to the existing chamber; exact dimension measure (area vs width/height/volume) to be defined after geometry assessment.
- Continue to support exploration, loot and quests; not every cave needs a treasure encounter.

### `cave:large`

- Preserve the current large natural cave topology, branches and gameplay/quest opportunities; change its *design name* away from `dungeon`.
- Enlarge one chamber enough to support **two fully usable levels**. **Size remains open**, and may exceed +100% compared with its current size.
- Viewed from the entrance tunnel, **left** descends along a slope to the lower floor; **right** remains at tunnel height as a higher terrace/platform.
- A steep, **non-traversable** central incline separates the two levels. Both floor zones are genuine usable spaces for player, NPCs, props, anchors, encounters and quests.
- Aim to use the existing V1 heightfield representation (one floor elevation per X/Z), not fake decorative shelves. Verify collision, traversability, NPC navigation, ceiling clearance, entrance transition, content placement and heightfield grid/performance limits before implementing.

### Gold Mine — author-selected `cave:medium`

- **Decision (2026-11-07):** The abandoned Gold Mine uses a natural V1 `cave:medium` (current `adventure` topology), **not** the separately sourced SeedVales V2 constructed-dungeon geometry.
- Add **vertical wooden posts and horizontal support beams** as mine-specific environmental furnishings. These are not required in every `cave:medium`.
- Retain existing mine identity, gold deposits, quest/colony hooks and deterministic behavior. Reconcile current cave binding before implementation.
- Coordination: [Abandoned Gold Mine roadmap](./quests-abandoned-gold-mine-colony.md) and [quest integration plan 010](../plans/quests-progression-010-abandoned-gold-mine-colony.md). Geometry/presentation changes are to be scheduled before related mine-specific visual work, but do not block unrelated expedition/economy integration.

## V2-derived constructed dungeons

V1 organic heightfield caves remain the principal natural-cave solution. Preserve/adapt V2's more geometric, rectangular-profile corridor and chamber representation selectively for constructed dungeons, not as a wholesale replacement of V1 cave infrastructure.

The V2 cave implementation exists in `jm-sky/seedvales-v2`, notably:
- `src/game/world/caveShape.ts`
- `src/game/world/caveField.ts`
- `src/game/world/gen/caves.ts`
- `src/game/render/caves.ts`

V3 retained both render looks: `src/game/world/caves-v1/*`, `src/game/world/caveShape.ts`, `src/game/render/caveChunks.ts`. V3's design decision **D-M1-12** favors V1 appearance for natural caves and retaining V2 geometry as a dungeon option. This is a donor/reference precedent; V3's default test-scene look does **not** establish automatic per-archetype dungeon assignment.

**V2 donor snapshot already copied into V1 (reference only):** [donor README](../research/v1-revival/donors/seedvales-v2/caves/README.md) · [snapshot directory](../research/v1-revival/donors/seedvales-v2/caves/) · [source snapshot commit](https://github.com/jm-sky/seedvale-v1/commit/2a91795d927d722d7182aebf73350ba89c4d9eca). It contains 12 byte-identical files from V2 commit `9ba54815493b886eb1bdce032f5209aeb2856c37`, including geometry, field, generator, renderer, materials, rocks and dependencies; **not connected to V1 runtime**.

### `dungeon:small` — cemetery on an isolated hill

- Place a cemetery and entrance to a small dungeon at the existing isolated rocky-hill landform (`crag`).
- Inside: many dangerous rats, treasures, potentially a quest item.
- Cemetery layout, entrance integration, encounter balancing, quest ownership and generation frequency are not yet specified.
- Relevant existing V1 landmark kind: **`crag`** (isolated rocky hill). Source: [`landformDescriptors.ts`](../../src/terrain/landformDescriptors.ts) (landform kind, generation and footprint) and [`landformLandmarks.ts`](../../src/world/locations/landformLandmarks.ts) (world-location landmark catalog). Presence of a landform is **not** evidence that cemetery+dungeon placement exists.

### `dungeon:large` — ruined castle underground

- Larger built dungeon associated with castle ruins; exploration, treasure and quests are primary content.
- **Exact location remains undecided**. Candidate: a mountain pass or suitable basin/space between mountains.
- V1 has deterministic **`RangePass`** descriptors from [`rangeSpines.ts`](../../src/terrain/rangeSpines.ts) (60 m intended pass corridor), with related terrain design in [world-terrain-060](../plans/world-terrain-060-macro-relief-ranges-passes-and-landforms.md). A pass **does not guarantee** a buildable castle-ruin footprint or an enclosed basin.
- Investigate actual terrain footprint, access, roads, settlement/structure separation and entrance placement before choosing the location.

## Quest and content principles

- **Geometry/size**, **environmental furnishings/loot**, and **quests/encounters** are separate concerns. Any cave type can support quests.
- Reuse existing stable cave IDs, topology nodes, content anchors, quest reservations, generated containers and deterministic profiles; avoid parallel runtime mechanisms.
- Maintain the integrity of authored quest items and reserved anchors when generic clutter or containers are absent.
- Keep offscreen-world continuity, navigation and performance in view. Do not infer playability from static code inspection.

## Evidence and existing code

- V1 cave recipes: `src/world/caves/caveArchetype.ts`, `dungeonTopology.ts`, `caveHeightfieldRepresentation.ts`, `caveContentAnchors.ts`, `caveAdventureContentPolicy.ts`.
- V1 quest example: `src/quests/dungeonBanditTreasure.ts`, `src/quests/oldBonesAdventureCave.ts`.
- V1 macro-relief and landmark implementation: `docs/plans/world-terrain-060-macro-relief-ranges-passes-and-landforms.md`, `src/terrain/landformDescriptors.ts`, `src/terrain/rangeSpines.ts`.
- V3 retained reference/decision: [V3 cave design verdict](https://github.com/jm-sky/seedvale-v3/blob/main/docs/vision/domains/world.md) (D-M1-12), [V3 cave renderer](https://github.com/jm-sky/seedvale-v3/blob/main/src/game/render/caveChunks.ts).

## Open questions / not approved

- Exact enlargement metrics for medium caves; size and shape of large two-level chamber.
- Whether medium-cave props are governed by content profiles, separate furnishing flags or another existing mechanism (requires targeted recon).
- Collision/navigation feasibility and content distribution on the two large-cave levels.
- Dungeon generation count, placement constraints, entrance design and whether each seed guarantees either dungeon.
- Rat population/behavior, rewards and any specific quest-item story in the cemetery dungeon.
- Castle ruin design and its placement: pass vs basin vs another viable mountainous location.
- Technical approach to compatibility of the renamed archetypes and V2 donor adaptation.

**Next step only after author approval:** targeted technical recon and a separate implementation plan following `docs/plans/PLANNING.md` and current Revival program constraints. No runtime changes are authorized by this document.
