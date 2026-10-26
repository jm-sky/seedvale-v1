# Scouting the Area (Zwiad okolicy)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Current SeedVale curation

**D-QUEST-36 — KEEP / REWRITE:** [Forest and road scouting](../../../../decisions/forest-and-road-scouting-quest-curation.md). Peter's forestry reconnaissance uses real caves/den habitats and timber access, without arbitrary stone collection or mandatory stag sighting. One shared observation may serve Kate's separate road-safety quest; truthful or misleading reports have evidence-based consequences. The imported stages below are historical V1 reference, not current design. Implementation M7.

## Summary

Piotr wants to know whether the area beyond the settlement is calm. The player checks the cave behind the settlement, spots a stag, and brings back two stones from the mountains as proof. Piotr also accepts a dialogue claim that the stag was not seen, with a reputation penalty.

## Stages / objectives

- Check the rock den behind the settlement (`interact_spawner`, `rockDen`).
- Spot a stag within range 16 (`spot_animal`, `stag`). Two dialogue actions with Piotr cover "saw the stag" (reputation integrity -2) and "did not see it".
- Bring 2 `stone` items from the mountains (`gather_item`).

## Outcomes & rewards

- `reported` (complete): relation +1 with Piotr. Reputation integrity -2 is applied by the "saw the stag" dialogue action, not by the outcome.

## Related docs

- [Quest dialogue reachability and conflicts (plan 018)](../../../../reference/quests/progression-plans/v1/quests-progression-018-quest-playtest-reachability-and-dialogue-conflicts.md), cited in the source comments.

## Open questions

- ❓ Whether the lie branch has consequences beyond those listed in the source is not checked.
