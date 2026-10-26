# Checking the Rock Cave (Sprawdzenie skalnej groty)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Current SeedVale curation

**D-QUEST-36 — KEEP / REWRITE:** [Forest and road scouting](../../../../decisions/forest-and-road-scouting-quest-curation.md). Kate requests road-adjacent safety reconnaissance, distinct from Peter's forestry concerns. Shared cave/den evidence can count toward both quests when truly applicable; reports may be honest, incomplete or deliberately false with evidence-based social/world consequences. The imported stages below are historical V1 reference, not current design. Implementation M7.

## Summary

Kasia reports fresh animal tracks at a rock cave near the settlement. The player checks the cave (without disturbing anything) and reports what they found. The cave is bound at composition time, and the direction phrase replaces the `{cavePlace}` token.

## Stages / objectives

- Check the rock den (`interact_spawner`, `rockDen`), bound to the chosen cave.

## Outcomes & rewards

- `reported` (complete, reward shown): 12 coins. No relation change is defined.

## Related docs

- [Quest dialogue actions and authored dialogue pass (plan 014)](../../../../reference/quests/progression-plans/v1/quests-progression-014-quest-dialogue-actions-and-authored-dialogue-pass.md) (generic; cave token handling is not specific to this quest).

## Open questions

- ❓ Whether the cave binding can fail (no rock den found) and what the player sees in that case is not checked.
