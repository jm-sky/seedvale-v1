# Boar by the Trail (Dzik przy szlaku)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Accepted SeedVale curation — D-QUEST-21

[D-QUEST-21](../../../../decisions/boar-quests-v1-q02-curation.md): rewrite this into a separate **medicinal-meadow boar** story, not the Q02 sow-with-young incident. The original stages below remain legacy reference. The affected resident is a distinct **herbalist**, not farmer Ann Woodward; the herbalist **lives in the starting settlement** (their name/household remain open). The boar is already on the herb clearing, so there is no tracking stage. The player can ask a hunter to fight alongside them against the same boar: assisted completion yields less reputation than solo completion but can improve the personal relationship with the hunter; hunter identity, attribution and amounts remain open. Plan 070 guides the location and motivation, not a mandatory generic simulation; den-based arrival/off-screen staging is allowed. A new non-lethal deterrence mechanic is not required. Endings/rewards remain open.

## Summary

A large boar is seen regularly on the trail, and people avoid that part of the forest. Marek asks the player to talk to Piotr first (he knows the area) and then deal with the boar. The quest needs renown of at least 10.

## Stages / objectives

- Talk to Piotr to learn where the boar was seen (`talk_to_npc`).
- Kill the boar (`kill_target_animal`, `boar`).

## Outcomes & rewards

- `boar_removed` (complete, hidden reward): a defense book (intermediate), relation +2 with Marek, reputation competence +6, courage +6, benevolence +2, and renown +8.

## Related docs

- [Boar at the medicinal meadow, systemic settlement problem (plan 070)](../../../../reference/quests/progression-plans/v1/quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md).
- [Authored RPG quests (plan 005)](../../../../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md).

## Curation note

- D-QUEST-21 adopts plan 070's medicinal-meadow story for this quest without adopting its entire proposed simulation system. The summary, stages and rewards above are imported V1 reference, not approved SeedVale gameplay.
