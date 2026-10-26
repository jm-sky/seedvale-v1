# Lonely Tower (Samotna wieża)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Summary

Piotr saw light or movement near a lonely tower at night and wants the player to check whether anyone is there. The tower is empty, its stairs are crumbling, and nobody has been there for a long time.

## Stages / objectives

- Examine the lonely tower (`interact_landmark`, bound to the `tower` landmark found at world setup).

## Outcomes & rewards

- `reported` (complete): relation +1 with Piotr. No item reward.

## Related docs

- [Quests roadmap (v1)](../../../roadmaps/v1/quests-roadmap.md) (general context only).

## Open questions

- ❓ The quest is only offered when a `tower` landmark is found during world setup.

## SeedVale curation (accepted)

[D-QUEST-34 — Lonely Tower curation](../../../../decisions/lonely-tower-quest-curation.md): keep/rewrite as a stolen lightweight valuables cache investigated across two settlements. The summary above describes the imported V1 version only; canonical narrative decision supersedes it. Implementation remains gated by M7 and shared domain systems.
