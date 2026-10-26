# Trail by the Monolith (Ślad przy monolicie)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

A settlement member went to the hills and did not return. He was last seen at an old monolith. Anna needs time to rebuild the route from old notes. When the route is ready, the player visits the bound monolith and finds a recent camp. If Anna cannot rebuild the route, the quest fails.

## Stages / objectives

- Return to Anna after she has checked the old notes (`receive_world_knowledge`, `target`, Anna). The knowledge is deferred by about one hour.
- Investigate the bound landmark (`interact_bound_landmark`, `target`, a monolith).

## Outcomes & rewards

- `reported` (complete): relation +2 with Anna. No item reward.
- `route_lost` (failed): Anna cannot rebuild the route; the trail ends.

## Related docs

- [Deferred world knowledge and location research (plan 047)](../../../../reference/quests/progression-plans/v1/quests-progression-047-deferred-world-knowledge-and-location-research.md).
- [Quest outcomes, rewards and consequences (plan 002)](../../../../reference/quests/progression-plans/v1/quests-progression-002-quest-outcomes-rewards-and-consequences.md) (generic).

## Open questions

- ❓ The monolith landmark is resolved by world knowledge at runtime; whether a monolith always exists near the settlement was not checked.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
