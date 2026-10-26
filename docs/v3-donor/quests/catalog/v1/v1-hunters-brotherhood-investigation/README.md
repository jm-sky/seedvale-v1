# Troubling Hunting Ground (Niepokojące łowisko)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/huntersBrotherhoodInvestigation.ts`); metadata in [meta.ts](meta.ts)

## Summary

After the player joins the brotherhood, the master is worried about one of the grove thickets where deer usually feed. He asks the player to go there and see for themselves. The quest is only materialized when the habitat pressure data shows a real problem at a deer thicket in the bound settlement. The player's report is a generated text describing what they observed.

## Stages / objectives

- Observe the chosen thicket (`interact_spawner`, `thicket`). The thicket is selected from habitat pressure at runtime.

## Outcomes & rewards

- `brotherhood_investigation_complete` (complete): relation +1 with the master; reputation competence +2 and trust +2; renown +2. The result text is generated from the observed habitat pressure.

## Related docs

- [Quests progression plan 049: hunters brotherhood hunting ground investigation](../../../../reference/quests/progression-plans/v1/quests-progression-049-hunters-brotherhood-hunting-ground-investigation.md).
- [Quests roadmap: hunters brotherhood (v1)](../../../roadmaps/v1/quests-hunters-brotherhood.md).

## Open questions

- ❓ The master's name is resolved at runtime.
- ❓ The habitat-pressure thresholds used for selecting the thicket are in `huntersBrotherhoodInvestigation.ts` and were not traced.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
