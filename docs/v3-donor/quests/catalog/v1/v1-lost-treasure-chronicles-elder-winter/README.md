# Preparing for Winter (Przygotowania do zimy)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureChroniclesElder.ts`); metadata in [meta.ts](meta.ts)

## Summary

The settlement elder needs firewood for the cold season. The player can bring six branches, or persuade a neighbour to help. Either path resolves the quest, and it unlocks the chronicle-search and cemetery-favour quests.

## Stages / objectives

- Bring 6 `branch` items to the elder (`gather_item`, count 6), or talk to the helper NPC so they help the elder (`talk_to_npc`). Two alternative paths.

## Outcomes & rewards

- `material_help` (complete, via branches): relation +1 with the elder; reputation benevolence +2.
- `neighbor_help` (complete, via the helper): relation +2 with the elder and +1 with the helper; reputation trust +1.

## Related docs

- [Quests progression plan 037: lost treasure chronicles elder trust foundation](../../../../reference/quests/progression-plans/v1/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md).
- [Quests roadmap: lost-something chronicles (v1)](../../../roadmaps/v1/quests-lost-something-chronicles.md).

## Open questions

- ❓ Elder and helper names are resolved at runtime.
- ❓ The stage mode (any or all) of the two alternative paths was not traced.

## SeedVale curation (2026-10-14)

**SeedVale curation — D-QUEST-44 (accepted narrative):** Keep/rewrite the distinct story provisionally; imported stages, roles, mechanics, rewards and implementation scope are not approved and await M7/shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
