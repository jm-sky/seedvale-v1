# Wolves at the Merchant (Wilki u kupca)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Wolves frighten the merchant's horse on the trail. Kasia promises the merchant's horse as a reward if the player finds the wolf den and destroys it for good. The horse must still be alive when the player returns to Kasia.

## Stages / objectives

- Destroy the wolf den spawn point (`destroy_spawn_point`, `WOLF_DEN_ID`).

## Outcomes & rewards

- `reported` (complete, reward shown): the merchant's horse (animal id passed at composition), relation +2 with Kasia, reputation competence +8 and courage +10, renown +8.
- `horse_lost` (failed): the horse died before it could be collected; no reward.

## Related docs

- [Horse acquisition: merchant purchase and quest reward (plan 012)](../../../../reference/quests/progression-plans/v1/quests-progression-012-horse-acquisition-merchant-purchase-and-quest-reward.md).

## Open questions

- ❓ The horse is bound at composition (`horseRewardAnimalId`); the animal id is not in the source.
