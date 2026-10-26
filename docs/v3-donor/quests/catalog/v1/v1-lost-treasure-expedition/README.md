# Lost Treasure Expedition (Zaginiona wyprawa po skarb)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureExpedition.ts`); metadata in [meta.ts](meta.ts)

## Summary

A merchant sponsored an expedition after a legendary treasure, and it never returned. The player follows the trail into a dungeon: an abandoned camp at the entrance, a journal pack, an evidence container with personal belongings, and finally the treasure. The journal then decides the ending: give it to the family, to the sponsor (who pays), or keep both journal and treasure. Sponsor and stakeholder NPCs are chosen at runtime.

## Stages / objectives

- Talk to the sponsor about the expedition; reveals the cave (`talk_to_npc`).
- Talk to a stakeholder who knew the expedition members, if one is present (`talk_to_npc`).
- Loot the abandoned camp at the cave entrance (`loot_world_container`).
- Loot the commander's pack with the journal (`loot_world_container`).
- Loot the evidence container with the members' belongings (`loot_world_container`).
- Loot the final treasure (`loot_world_container`).
- Decide what to do with the journal (`await_quest_outcome`, three dialogue actions).

## Outcomes & rewards

- `journal_to_family` (complete): relation +3 with the stakeholder; reputation trust +4, benevolence +5, integrity +3; renown +2.
- `journal_to_sponsor` (complete, shown reward): 25 coins; relation +3 with the sponsor and -1 with the stakeholder (if present); reputation competence +3, integrity +2; renown +3.
- `keep_journal_and_treasure` (complete): relation -2 with the sponsor (and the stakeholder, if present); reputation trust -2, integrity -3; renown +1.

## Related docs

- [Quests progression plan 027: lost treasure expedition](../../../../reference/quests/progression-plans/v1/quests-progression-027-lost-treasure-expedition.md).
- [Lost treasure expedition external sponsor flow (plan 079)](../../../../reference/quests/progression-plans/v1/quests-progression-079-lost-treasure-expedition-external-sponsor-flow.md).

## Open questions

- ❓ Whether the stakeholder stage is always present, and the exact stage count without one, were not traced.
- ❓ Final treasure container contents beyond the listed supply constants are not in the source.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
