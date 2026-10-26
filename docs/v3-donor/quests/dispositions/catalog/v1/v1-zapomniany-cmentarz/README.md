# Forgotten Cemetery (Zapomniany cmentarz)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

A small cemetery at the edge of the village has been overgrown for a long time. Kasia asks the player to check whether the graves are still standing. The graves are intact but heavily overgrown.

## Stages / objectives

- Visit the overgrown cemetery (`interact_landmark`, bound to the `cemetery` landmark found at world setup).

## Outcomes & rewards

- `reported` (complete): relation +1 with Kasia. No item reward.

## SeedVale curation

**D-QUEST-29:** this V1 quest is merged into the curated cemetery-care story and is **not** preserved as a separate authored quest. Its discovery/lead function may feed the rewritten V2 Q14 flow, with prior cemetery care recognized as quiet help. See [Cemetery Care Quest Curation](../../../../decisions/cemetery-care-quest-curation.md).

## Related docs

- [Quest outcomes, rewards and consequences (plan 002)](../../../../reference/quests/progression-plans/v1/quests-progression-002-quest-outcomes-rewards-and-consequences.md) (generic).
- [Small quest offer scope and prioritization (plan 074)](../../../../reference/quests/progression-plans/v1/quests-progression-074-small-quest-offer-scope-and-prioritization.md) (generic).

## Open questions

- ❓ The quest is only offered when a `cemetery` landmark is found during world setup.
