# Disputed Wood (Sporne drewno)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Anna and Piotr both need the same stock of wood: Anna for a shared pasture fence, Piotr for a cart needed for logging. The player first talks to Piotr about his need, then decides who receives the wood first. The decision sets which NPC is favoured in the follow-up quests `drewno-dla-anny` and `drewno-dla-piotra`.

## Stages / objectives

- Talk to Piotr (`talk_to_npc`).
- Choose who gets the wood first (`talk_to_npc_choice`: Anna or Piotr).

## Outcomes & rewards

- `prioritize_anna` (complete): relation +1 with Anna, reputation benevolence +3 and trust +1, renown +2.
- `prioritize_piotr` (complete): relation +1 with Piotr, reputation competence +3 and trust +1, renown +2.

## SeedVale curation

**Accepted — D-QUEST-22:** [Woodward timber priority](../../../../decisions/woodward-timber-priority-curation.md) supersedes conflicting v1 availability and reward assumptions for the merged game. The imported summary/outcomes above describe v1 only.

## Related docs

- [Authored starter repairs and disputed wood (plan 073)](../../../../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md).
- [Authored RPG quests (plan 005)](../../../../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md).

## Open questions

- None recorded.
