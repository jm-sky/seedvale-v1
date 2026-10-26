# Old Bones (Stare kości)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/oldBonesAdventureCave.ts`); metadata in [meta.ts](meta.ts)

## Summary

A giver from the settlement points to an old cave with human remains. A relative (claimant) of a person who vanished there links the bones to a family signet ring. The player finds the remains, identifies the signet, talks to the claimant, and then decides who receives the ring. If a second claimant exists, the player can hear them too. The quest is generated per settlement and cave.

## Stages / objectives

- Talk to the giver about the old traces; reveals the cave (`talk_to_npc`).
- Talk to the first claimant about the family history (`talk_to_npc`). A dialogue variant applies when the player already owns the signet.
- Loot the remains container and own the signet (`loot_world_container` + `own_item_instance`, mode all).
- Talk to the second claimant (only when a second claimant exists).
- Decide who receives the signet (`await_quest_outcome`).

## Outcomes & rewards

- `return_to_first_claimant` (complete): relation +3 with claimant A; reputation trust +4, benevolence +5, integrity +3; renown +3.
- `give_to_second_claimant` (complete, only with a second claimant): relation +2 with claimant B and -2 with claimant A; trust +1, benevolence +2, integrity +1; renown +2.
- `keep_signet` (complete): relation -1 with claimant A (and B, if present); trust -1, integrity -2; renown +1.
- Remains contents: coin x4 and a bandage.

## Related docs

- [Quests progression plan 025: adventure cave old bones](../../../../reference/quests/progression-plans/v1/quests-progression-025-adventure-cave-old-bones.md).
- [Story item inventory and cave location clarity (plan 035)](../../../../reference/quests/progression-plans/v1/quests-progression-035-story-item-inventory-and-cave-location-clarity.md).

## Open questions

- ❓ Giver and claimant names are chosen at runtime (fallbacks: "Mieszkaniec", "Spadkobierca", "Krewniak").
- ❓ The number of stages changes with the second claimant; the exact stage count is given as 4 for the one-claimant case only.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
