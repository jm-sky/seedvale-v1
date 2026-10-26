# Lost Sheep (Zagubiona owca)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Anna has lost a sheep and asks the player to find it. The sheep is a `find_animal` target. If the sheep dies before the player finds it, the quest ends as failed.

## Stages / objectives

- Find the lost sheep (`find_animal`, `sheep`).

## Outcomes & rewards

- `found_and_reported` (complete, reward shown): 10 coins and relation +1 with Anna.
- `sheep_died` (failed): no reward; result text says the sheep was probably killed.

## Related docs

- [Lost livestock report lifecycle (plan 075)](../../../../reference/quests/progression-plans/v1/quests-progression-075-lost-livestock-report-lifecycle-and-truthful-quest-journal.md).
- [External resolution and real problem offering (plan 030)](../../../../reference/quests/progression-plans/v1/quests-progression-030-external-resolution-and-real-problem-offering.md), cited in the source comment.

## Open questions

- ❓ Whether the v1 authored sheep and the generated lost-livestock opportunity are kept apart at runtime was not verified beyond the source comment.
