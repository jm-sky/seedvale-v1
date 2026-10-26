# Deciphering the Chronicle (Odczytanie kroniki)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureChronicleDeciphering.ts`); metadata in [meta.ts](meta.ts)

## Summary

The player brings the encoded chronicle to a specialist who can read it. The specialist either charges 35 coins, or the player recovers the specialist's glossary (a reference chest at the edge of the specialist's settlement) and returns it. Either route resolves the chronicle; the result tells the player which area to search for the lost fortune.

## Stages / objectives

- Show the encoded chronicle to the archaeologist (`requireItemInstanceId` on the chronicle).
- Choose a route (`await_quest_outcome`): pay 35 coins, or recover the glossary.
- Recover the glossary from the chest at the edge of the specialist's settlement (`own_item_instance`).
- Return the glossary to the specialist (`await_quest_outcome`, physical outcome requires the reference item).

## Outcomes & rewards

- `chronicle_deciphered_paid` (complete): relation +1 with the specialist. 35 coins are taken as a fee.
- `chronicle_deciphered_favour` (complete): relation +2 with the specialist; reputation benevolence +1. The glossary is handed back.

## Related docs

- [Quests progression plan 039: lost treasure chronicles chronicle deciphering and specialist](../../../../reference/quests/progression-plans/v1/quests-progression-039-lost-treasure-chronicles-chronicle-deciphering-and-specialist.md).
- [Quests roadmap: lost-something chronicles (v1)](../../../roadmaps/v1/quests-lost-something-chronicles.md).

## Open questions

- ❓ Giver (archaeologist) and specialist names are resolved at runtime.
- ❓ The objective type of the first stage was not traced.

## SeedVale curation (2026-10-14)

**SeedVale curation — D-QUEST-44 (accepted narrative):** Keep/rewrite the distinct story provisionally; imported stages, roles, mechanics, rewards and implementation scope are not approved and await M7/shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
