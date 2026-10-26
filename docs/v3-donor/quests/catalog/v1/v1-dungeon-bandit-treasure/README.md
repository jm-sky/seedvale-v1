# Bandits' Stash (Skrytka bandytów)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/dungeonBanditTreasure.ts`); metadata in [meta.ts](meta.ts)

## Summary

A guard from the settlement knows an old bandit hideout in a dungeon. A deep stash there holds a ledger (register of robberies) and a marked valuable that belongs to a claimant. The player takes both, then decides whether to return the valuable to its owner, hand the evidence to the guard, or keep the valuable.

## Stages / objectives

- Talk to the guard about the hideout; reveals the dungeon (`talk_to_npc`).
- Loot the deep stash and own the ledger and the marked valuable (`loot_world_container` + `own_item_instance`, mode all).
- Decide what to do with the valuable and ledger (`await_quest_outcome`, three dialogue actions).

## Outcomes & rewards

- `return_marked_property` (complete): valuable returned to the claimant; relation +3; reputation trust +4, integrity +5, benevolence +4; renown +2. Common bandit loot stays with the player.
- `give_evidence_to_guard` (complete): ledger and valuable go to the guard; relation +1 with the claimant; reputation competence +5, integrity +4; renown +4.
- `keep_marked_property` (complete): the valuable stays with the player; relation -2 with the claimant; reputation trust -2, integrity -4; renown +1.

## Related docs

- [Quests progression plan 026: dungeon bandit treasure](../../../../reference/quests/progression-plans/v1/quests-progression-026-dungeon-bandit-treasure.md).
- [Lost treasure chronicles dungeon binding (plan 041)](../../../../reference/quests/progression-plans/v1/quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md) (related dungeon work).

## Open questions

- ❓ Giver and claimant names are chosen at runtime (fallbacks: "Strażnik", "Kupiec").
- ❓ The `abandonmentAllowed: false` flag comes from the builder's `abandonment` block.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
