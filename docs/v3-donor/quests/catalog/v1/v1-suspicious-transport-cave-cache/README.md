# Suspicious Transport (Podejrzany transport)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/suspiciousTransportCaveCache.ts`); metadata in [meta.ts](meta.ts)

## Summary

A giver from the settlement asks the player to bring a package left outside the settlement, in a natural cave. A second NPC (the counterpart) wants to see it. The player decides who receives the package, or keeps the distinctive item (a damascus knife used as evidence). Each choice changes relations and reputation differently.

## Stages / objectives

- Talk to the giver to learn the cache location (`talk_to_npc`); reveals the cave.
- Loot the cache in the cave (`loot_world_container`).
- Decide what to do with the package (`await_quest_outcome`, four dialogue actions: keep quiet with the giver, report it to the counterpart, or keep the goods, toward either NPC).

## Outcomes & rewards

- `keep_quiet` (complete, hidden reward): 8 coins; relation +2 with the giver and -1 with the counterpart; trust +1, integrity -1; renown +1.
- `report_it` (complete): relation +2 with the counterpart and -1 with the giver; integrity +4, courage +2; renown +2.
- `keep_goods` (complete): relation -1 with both NPCs; trust -2, integrity -2; renown +1.
- Cache contents (source `CACHE_GOODS`): iron rod x2 and bandage x1.

## Related docs

- [Quests progression plan 024: suspicious transport natural cave cache](../../../../reference/quests/progression-plans/v1/quests-progression-024-suspicious-transport-natural-cave-cache.md).
- [Rpg settlement quest matrices (plan 017)](../../../../reference/quests/progression-plans/v1/quests-progression-017-rpg-settlement-quest-matrices.md).

## Open questions

- ❓ Giver and counterpart NPC names are chosen at runtime.
- ❓ The quest id uses the generic `rpg:` prefix from the RPG matrix generator; whether it is offered through that generator or only through the cache binding is not traced here.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
