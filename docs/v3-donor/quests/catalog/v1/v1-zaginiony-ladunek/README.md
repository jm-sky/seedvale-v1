# Missing Cargo (Zaginiony ładunek)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

**SeedVale curation:** [D-QUEST-26 — Missing Cargo](../../../../decisions/missing-cargo-quest-curation.md). Keep/rewrite: natural storm shipwreck, survivors needing rescue, independent NPC responses, mixed-ownership cargo, evidence-driven theft consequences and a persistent deteriorating wreck. The material below is imported V1 reference only.

## Summary

A shipment was expected from the coast, but rumours of a wreck came instead. Marek asks the player to find the ship and check what is left of the cargo. The wreck lies at the shore; its hold is partly flooded and no crew is present.

## Stages / objectives

- Find and examine the shipwreck (`interact_landmark`, bound to the `shipwreck` landmark found at world setup).

## Outcomes & rewards

- `reported` (complete): relation +1 with Marek. No item reward.

## Related docs

- [Quests roadmap (v1)](../../../roadmaps/v1/quests-roadmap.md) (general context only).

## Open questions

- ❓ The quest is only offered when a `shipwreck` landmark is found during world setup.
