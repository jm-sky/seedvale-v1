# Missing Hunter (Zaginiony myśliwy)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostHunterNaturalCave.ts`); metadata in [meta.ts](meta.ts)

## Summary

A hunter from a settlement did not return from a hunt. A witness saw him heading toward a natural cave. The player finds the cave, recovers the hunter's pack, and returns to the family with the news. At the end the player decides whether to give back the hunter's bow or keep it. The quest is generated per settlement and cave, so the id is a template.

## Stages / objectives

- Talk to the witness (`talk_to_npc`); reveals the cave location.
- Loot the hunter's pack from the cave (`loot_world_container`).
- Return to the giver with the items (`talk_to_npc`).
- Decide: return the bow (`await_quest_outcome`, physical outcome requires the bow instance).

## Outcomes & rewards

- `return_bow_to_family` (complete, hidden reward): the bow transfers to the giver; coin x4; relation +3; reputation trust +5, benevolence +6, integrity +3; renown +4.
- `report_fate_keep_bow` (complete): the player keeps the bow; relation +1; reputation trust +1, benevolence +2; renown +2.
- Pack contents (source `PACK_SUPPLY`): dried meat x2, small waterskin x1, bandage x1.

## Related docs

- [Quests progression plan 023: lost hunter natural cave](../../../../reference/quests/progression-plans/v1/quests-progression-023-lost-hunter-natural-cave.md).

## Open questions

- ❓ Exact giver and witness names are chosen at runtime.
- ❓ The `abandonmentAllowed: false` flag comes from the builder's `abandonment` block.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
