# Treasure Map (Mapa do skarbu)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Piotr heard of an old treasure map hidden at a place near the settlement (a cave or the cemetery, depending on composition). The map leads to ruins deep in the dark forest, where a chest holds the treasure. The player reads the map, reaches the ruins, and loots the chest, then reports back to Piotr.

## Stages / objectives

- Find and read the treasure map (`read_item`, `treasure_map_dark_forest`).
- Reach the dark-forest ruins (`discover_location`).
- Loot the treasure chest in the ruins (`loot_world_container`).

## Outcomes & rewards

- `reported` (complete): relation +2 with Piotr, reputation competence +6 and courage +8, renown +6. The chest contents are generated at runtime.

## Related docs

- [Dark forest ruins treasure map (plan 009)](../../../../reference/quests/progression-plans/v1/quests-progression-009-dark-forest-ruins-treasure-map.md).

## Open questions

- ❓ The chest contents and the exact map hiding place are not defined in the builder; they come from the runtime composition.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
