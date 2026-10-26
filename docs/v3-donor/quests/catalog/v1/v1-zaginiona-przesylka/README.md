# Lost Parcel (Zaginiona przesyłka)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/quests.ts`); metadata in [meta.ts](meta.ts)

## Current SeedVale curation

**Recorded at:** 2026-10-13  
**Recorded by:** ChatGPT Luna

[D-QUEST-20 — Lost Parcel family impersonation](../../../../decisions/lost-parcel-quest-curation.md) retains this quest for a full narrative rewrite: Kate's intended equipment gift for Mark, forged relatives, early detection or later recovery of her advance, and a genuine blacksmith-made gift finale; Mark passes the smith's extra equipment to the player as thanks. Kate stays honest and safe, without marital conflict. The imported summary, dialogue choices and rewards below are historical v1 reference, superseded for the current game's design. Implementation remains gated by M7.

## Summary

Kasia lost a parcel of private letters and bills at the rock cave near the settlement. The player finds it there and then decides who gets it: Kasia (returned sealed) or Marek, who hands it to the guard. Marek's branch lowers Kasia's relation.

## Stages / objectives

- Check the rock den (`interact_spawner`, `rockDen`), bound to the chosen cave; the parcel is at the entrance.
- Give the parcel to Kasia or to Marek (`talk_to_npc_choice`).

## Outcomes & rewards

- `returned_sealed` (complete, hidden reward): 15 coins, relation +2 with Kasia, reputation trust +5 and integrity +6, renown +3.
- `turned_over_to_guard` (complete, hidden reward): 2 bandages, relation -1 with Kasia and +2 with Marek, reputation competence +4, courage +2, integrity +1, renown +2.

## Related docs

- [Authored RPG quests (plan 005)](../../../../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md).
- [Socially consequential quest dialogue (plan 050)](../../../../reference/quests/progression-plans/v1/quests-progression-050-socially-consequential-quest-dialogue.md).

## Open questions

- ❓ The Marek branch's reactions (for example, the friendly-Kasia reaction that lowers her relation) depend on runtime relation values; their effect is not simulated here.
