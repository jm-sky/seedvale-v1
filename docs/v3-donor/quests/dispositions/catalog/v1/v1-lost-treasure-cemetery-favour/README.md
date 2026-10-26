# Order in the Cemetery (Porządek na cmentarzu)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureChronicleSearch.ts`); metadata in [meta.ts](meta.ts)

## Summary

The cemetery caretaker lets the player examine only one grave, the archaeologist's grave, if the player brings four branches to tidy the cemetery. The quest is offered after the winter quest's material or neighbour outcome.

## Stages / objectives

- Bring 4 `branch` items to the caretaker (`gather_item`, count 4).

## Outcomes & rewards

- `grave_access_granted` (complete): relation +1 with the caretaker; reputation trust +1. The outcome is the precondition that lets the grave search in `chronicle-search` proceed legally.

## Related docs

- [Quests progression plan 038: lost treasure chronicles archaeologist and chronicle search](../../../../reference/quests/progression-plans/v1/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md).

## Open questions

- ❓ Caretaker name is resolved at runtime.
- ❓ Whether the grave-search stage actually requires this outcome is not traced in this pass.

## SeedVale curation (2026-10-14)

**SeedVale curation — D-QUEST-44 (accepted narrative):** Merge this errand into V2 Q14 cemetery care (D-QUEST-29); no second quest or duplicate reward. Lawful grave-access permission may remain an independent story beat. Details and mechanics deferred. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
