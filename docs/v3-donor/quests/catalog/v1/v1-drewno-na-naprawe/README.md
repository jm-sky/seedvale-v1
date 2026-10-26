# Wood for Repairs (Drewno na naprawę)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Piotr's fence is failing. The player gathers five branches for the repair and delivers them. If the player has already repaired the fence on their own, the quest resolves as `already_repaired` with no payout.

## Stages / objectives

- Gather 5 `branch` items (`gather_item`, count 5).

## Outcomes & rewards

- `delivered` (complete, reward shown): 8 coins and relation +1 with Piotr.
- `already_repaired` (complete): no reward; relation not changed.

## Related docs

- [Authored starter repairs and disputed wood (plan 073)](../../../../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md).
- [Authored starter repair initialization (plan 077)](../../../../reference/quests/progression-plans/v1/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md).

## Open questions

- None recorded.

## SeedVale curation

**Accepted — D-QUEST-38:** [Woodward repairs and Q03 storm](../../../../decisions/woodward-roof-storm-quest-curation.md) supersedes conflicting imported story assumptions for the merged game. The earlier description is source reference, not implemented current canon.
