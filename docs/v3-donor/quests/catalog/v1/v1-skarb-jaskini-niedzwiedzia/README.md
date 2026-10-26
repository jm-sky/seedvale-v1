# Old Treasure in the Cave (Stary skarb w jaskini)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Marek knows of an old treasure map hidden in a grave at the cemetery. The map leads to a bear cave with a sealed casket. The player finds the map, talks to Marek, reaches the cave, takes the casket, and then either opens it and keeps the treasure, or returns it unopened to Marek for a share of the payment.

## Stages / objectives

- Recover the hidden map from a grave on the cemetery (`recover_hidden_find`).
- Talk to Marek about the map; this reveals the cave location (`talk_to_npc`).
- Reach the bear cave (`discover_location`).
- Take the sealed casket (`acquire_portable_container`).
- Open the casket or return it to Marek (`await_quest_outcome`, with a dialogue action that requires the unopened casket).

## Outcomes & rewards

- `treasure_kept` (complete): the player opens the casket and keeps everything. No reward is listed in the builder.
- `treasure_returned` (complete, hidden reward): coin payout (amount from `treasureMapBearCaveReturnPayout`), relation +2 with Marek, reputation trust +4 and integrity +3, renown +4. The casket is discarded.

## Related docs

- [Treasure map bear cave (plan 008)](../../../../reference/quests/progression-plans/v1/quests-progression-008-treasure-map-bear-cave.md).
- [Quest offer selection, prioritization and abandonment (plan 033)](../../../../reference/quests/progression-plans/v1/quests-progression-033-quest-offer-selection-prioritization-and-abandonment.md).

## Open questions

- ❓ The coin payout amount is computed at composition and is not stated in the source.
- ❓ The quest has `abandonment: { allowed: false }`; the reason is not documented in the builder.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
