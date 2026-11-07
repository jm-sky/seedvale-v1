# Plan: Natural landmark gameplay content and quest integration

**Created:** 2026-11-07
**Status:** `draft` 📝 — author-approved gameplay direction and candidate content; mechanics, stage scope, and implementation authorization remain open
**Type:** feature
**Priority:** medium · **Effort:** XL
**Depends on:** world-041
**Domain:** `world`
**Subdomains:** `places` `resources` `events` `simulation`
**Tags:** `gameplay` `landmarks` `exploration` `quests`
**Roadmap:** `locations.md`

## Goal

Make significant natural landmarks worth visiting as **physical places with gameplay meaning**, not merely map markers or visual terrain. Reuse V1's authoritative world, resource, fauna, treasure, discovery, and quest systems. This draft records the author's content candidates and the architectural questions to resolve **before** a small implementation slice can be approved.

This plan concerns **content attached to** existing landforms. Terrain generation, the basic location catalog, rumours and waterfall presentation remain owned by their existing plans.

## Author decisions (2026-11-07)

1. **Layered hybrid:** start with content independent of quests (e.g. ore), optionally add buried treasures or chests, and later authored quests or generic living-world simulation. A quest is not a prerequisite for a location to matter.
2. **Selective uniqueness:** only selected locations need truly unique content; the rest may use shared systems and varied combinations. No promise that every crater/summit/island contains every listed feature.
3. **Mixed permanence:** certain resources and threats may return; unique treasure and events may be one-shot. Exact depletion/renewal rules are **not decided**.
4. **Discovery plus clues:** content can be found by free exploration; NPC rumours, maps and quests can guide the player without requiring quest activation.
5. **G6/G7 remain authoritative:** reuse the landform catalog and estimated rumour search areas; do not leak exact names/coordinates in rumours.

## Author's content candidates — not yet a committed production package

| Place | Initial, independently useful content | Optional later content |
| --- | --- | --- |
| Crater / crater lake | Rich deposit of high-quality ore; dangerous animal | Mining quest; ownership and profit sharing |
| Rocky hill / crag | Abandoned ruins and a buried treasure | Possible quest around the find |
| Mountain summit | Achievement badge for reaching it; rare plant | Plant collection quest; optionally a treasure cave |
| Lake with island | Abandoned ruins and treasure; dangerous bear | Quest associated with the island |
| Waterfall / cascade | Boat wreck and treasure at the bottom; possibly a chest above | Later exploration quest |
| Ordinary lake | Undecided; no forced special feature | Open |
| Mountain pass | Undecided; a pass may remain geographic infrastructure | Open |

Treat every row as a **candidate design**, not a mandatory spawn rule, quantity, biome promise, or accepted quest script. In particular, wreck placement at an inland cascade is **not** covered by the current coastal shipwreck generator.

## Verified V1 starting point

- `src/terrain/chunkHeightmap.ts`, `src/world/locations/landformLandmarks.ts`: deterministic crag/crater/lake-island/range-summit descriptors and stable `landform:...` IDs.
- `src/world/locations/worldLocationCatalog.ts`, `locationKnowledge.ts`, `landmarkArrival.ts`, `locationProximityDiscovery.ts`: canonical locations, persisted discovery/rumour knowledge and kind-specific arrival. Current landform arrival iterates non-confirmed **known** entries; walking into a fully unknown landform does not universally discover it.
- `src/world/locations/guardLocalKnowledge.ts`, `rumourLead.ts`, `src/world/map/mapData.ts`: rumour production and approximate, name-safe player projection. Keep quest knowledge distinct from canonical geometry.
- `src/terrain/chunkEnvironment.ts`: separate chunk-owned classic landmarks (`smallRuins`, `shipwreck`, etc.) and mineable rocks with `resourceId`; these are **not automatically placed inside** new macro landforms.
- `src/quests/quests.ts`, `QuestManager.ts`: `discover_location`, `interact_landmark`, `interact_bound_landmark`, `gather_item`, `kill_target_animal`, `loot_world_container`, `recover_hidden_find`, multi-objective stages, outcomes, social consequences and save/restore. Existing `interact_landmark` is wired for physical procedural objects; a natural landform catalog entry is not automatically such an object.
- `src/quests/opportunities/worldQuestOpportunityTypes.ts`: real world-driven opportunity shapes exist, but no general natural-landmark event generator.
- `src/world/authoredWorldConsequences.ts`: persisted one-shot consequence registry exists; production definitions array is empty. Ownership of a mine or recurrent profit distribution is **not** an existing ready-made consequence.
- `src/badges/badges.ts`: existing badge authority; a summit badge requires an explicit, idempotent award rule rather than a separate achievement system.

The above is **static code recon**, not a runtime, visual, balance, or offscreen-verification claim. Recheck current `main` and related changes before implementation.

## Scope boundaries and design constraints

- **Identity / authority:** link content to a stable canonical landmark ID and existing entity/resource identities. Catalog records are derived; persist mutable authoritative state (mined, looted, animal dead, quest outcome) in its actual owning domain. Do not put authoritative gameplay state in Three.js objects, map markers or rebuilt chunks.
- **No parallel systems:** reuse resource generation/harvesting, fauna habitats, hidden finds/world containers, badges, QuestManager and world consequences. Add narrow dedicated hooks only for genuine gaps; quests should observe real interactions rather than simulate them with text alone.
- **Determinism and streaming:** content placement must be seed-stable and avoid invalid geometry, water, roads and inaccessible locations; streamed reloads must not regenerate one-shot treasure or duplicate animals/loot. Assess offscreen continuity before any NPC activity, resource use or recurring event is claimed.
- **Selective placement:** do not require every landmark or every seed to have all candidate attractions. Preserve coherent terrain, accessible interaction points, and relevant ecology. For the island bear, validate actual island size, traversability and habitat behaviour.
- **Discovery:** free exploration can find content without first obtaining a rumour or quest. Whether discovering a completely unknown *named* landmark requires an additional proximity rule is an explicit follow-up decision; do not silently bypass `LocationKnowledge`.
- **Quest lifecycle:** terminal quests are not generically replayable. Any repeatability must come from real recurrent world opportunities or an explicitly approved quest lifecycle extension; never reset completed authored quests ad hoc.
- **Waterfalls:** the waterfall catalog/physical presentation is owned by `world-terrain-064` and `world-041` W3 handoff. Its content can be considered only after a real, accessible cascade reach exists; do not force terrain carving to host a wreck.
- **Text ownership:** all new NPC lines belong to GPT Astra and require author approval under the Strategic Brief.
- **JSDoc:** annotate important new public/architectural functions and classes with relevant `@domain` tags for preflight discovery.

## Not in scope / not authorized by this draft

- Implementing a universal landmark-content generator or new event framework.
- An automatic mine-ownership economy, profit payouts, or NPC mining industry.
- A complete set of authored quests, dialogue, unique ruins/caves, or new wildlife species.
- Unspecified replenishment rates, rarity quotas, guaranteed treasure, or global offscreen simulation rules.
- Changing macro-relief, river geometry, location identity, or independently owned waterfall rendering.
- Implementation, roadmap queue insertion, or agent handoff until the author accepts a bounded slice.

## Questions to settle before moving to `planned`

1. Which **single landmark kind and minimal content layer** should be the first independently verifiable slice?
2. For ore: does high quality use existing item/resource quality semantics or require new ones? What is the allowed depletion/renewal behaviour?
3. For wild animals: persistent resident/habitat vs quest-bound unique target; does a replacement population return?
4. For hidden finds: one-off world-unique item/container vs shared seeded loot, and who persists depletion?
5. Are specific landmarks selected by deterministic suitability, rarity, authored binding, or another approved policy? No algorithm selected yet.
6. Should walking into an entirely unknown landform award discovery, or does existing knowledge-led arrival remain sufficient?
7. Which optional later content must affect offscreen simulation, and which may remain authored one-shot events?

## Verification contract for a future approved slice

- Seed-stable placement and identities across identical world generation, stream-out/in, reload and world rebuild.
- Content is physically reachable/interactable; no floating ruins, buried inaccessible chests, unreachable wrecks or resource/terrain overlap.
- Any harvest/loot/kills change actual authoritative state exactly once and survive save/load, without duplication.
- Discovery and rumours preserve no-exact-pin/no-name-before-discovery constraints and support finding content without a quest.
- Quest progress derives from real events and does not double-complete or regrant rewards.
- No uncontrolled always-resident meshes, heavy catalog scans, or unbounded offscreen ticks; profile representative landmark scenes if the selected slice affects performance.
- Focused tests plus representative browser/visual checks; no runtime claim from source inspection alone.

## Related work

- [world-041 — catalog and rumour leads](./world-041-landmark-catalog-and-rumour-leads.md)
- [world-terrain-060 — macro relief and landforms](./world-terrain-060-macro-relief-ranges-passes-and-landforms.md)
- [world-terrain-064 — derived waterfalls](./world-terrain-064-derived-waterfalls.md)
- [G1–G9 author geography decisions](../research/v1-revival/2026-11-04--geography-exploration-author-decisions-g1-g9.md)
- [Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)
