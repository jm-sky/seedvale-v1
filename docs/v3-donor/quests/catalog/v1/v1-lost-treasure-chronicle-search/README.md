# Encoded Chronicle (Zakodowana kronika)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/lostTreasureChronicleSearch.ts`); metadata in [meta.ts](meta.ts)

## Summary

The elder of the settlement wants the encoded chronicle of an old expedition, which is needed to read a lost treasure record. An archaeologist in another settlement knows two leads: a grave on the cemetery and the ruins of the expedition camp. The player talks to the archaeologist, searches the grave or the ruins (either order), and takes the physical chronicle. The quest is offered after the winter quest's material or neighbour outcome.

## Stages / objectives

- Talk to the archaeologist, or hand over an already-owned chronicle (`talk_to_npc` / `own_item_instance`). The archaeologist reveals the cemetery and requests the ruins route.
- Search the grave or the ruins, in any order (`recover_hidden_find`, `loot_world_container`).
- Acquire the encoded chronicle item (`own_item_instance`).

## Outcomes & rewards

- `chronicle_acquired` (complete): relation +1 with the elder and +1 with the archaeologist. The chronicle item itself is the progress token for the deciphering quest.

## Related docs

- [Quests progression plan 038: lost treasure chronicles archaeologist and chronicle search](../../../../reference/quests/progression-plans/v1/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md).
- [Quests roadmap: lost-something chronicles (v1)](../../../roadmaps/v1/quests-lost-something-chronicles.md).

## Open questions

- ❓ Names of the elder, archaeologist and settlements are resolved at runtime.
- ❓ The `story:` prefix and the exact lead choice (basic or strong) depend on world composition; the strong-lead branch was not traced in detail.

## SeedVale curation (2026-10-14)

**Accepted narrative — D-QUEST-44:** Keep/rewrite this distinct story provisionally; legacy stages, rewards, mechanics and scope remain open for M7 and shared-system review. Lawful grave access follows D-QUEST-29. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
