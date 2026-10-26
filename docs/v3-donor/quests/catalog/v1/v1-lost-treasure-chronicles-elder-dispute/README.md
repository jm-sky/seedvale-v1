# Old Grudge (Stara uraza)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureChroniclesElder.ts`); metadata in [meta.ts](meta.ts)

## Summary

The elder and a neighbour have argued for years over a borrowed axe that was never returned. After the winter quest, the elder asks the player to hear both sides. The player then either sides with the elder or reconciles the two, which changes relations with both.

## Stages / objectives

- Hear the elder's version (`talk_to_npc`).
- Hear the counterpart's version (`talk_to_npc`).
- Decide: support the elder, or push for reconciliation (`talk_to_npc_choice`).

## Outcomes & rewards

- `support_elder` (complete): relation +2 with the elder and -1 with the counterpart; reputation trust +1, competence +1.
- `reconcile` (complete): relation +1 with both; reputation benevolence +2, integrity +1.

## Related docs

- [Quests progression plan 037: lost treasure chronicles elder trust foundation](../../../../reference/quests/progression-plans/v1/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md).
- [Quests roadmap: lost-something chronicles (v1)](../../../roadmaps/v1/quests-lost-something-chronicles.md).

## Open questions

- ❓ Elder and counterpart names are resolved at runtime.
- ❓ Reaction branches that depend on relation levels (for example, the elder reacting differently to trusted players) are not expanded here.

## SeedVale curation (2026-10-14)

**SeedVale curation — D-QUEST-44 (accepted narrative):** Keep/rewrite the distinct story provisionally; imported stages, roles, mechanics, rewards and implementation scope are not approved and await M7/shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
