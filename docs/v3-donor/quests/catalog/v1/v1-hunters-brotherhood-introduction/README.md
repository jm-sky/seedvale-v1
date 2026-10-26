# Circle of Hunters (Krąg myśliwych)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/huntersBrotherhoodIntroduction.ts`); metadata in [meta.ts](meta.ts)

## Summary

After the player completes the third hunter profession quest, the inviter introduces them to a small circle of hunters. The circle is a master of balance, a trophy hunter, and an ambitious young hunter (all names are resolved at runtime). The player talks to all three, then reports back to the inviter and becomes part of the brotherhood. The offer is a story-exposure quest.

## Stages / objectives

- Talk to the master, the trophy hunter, and the ambitious hunter (`talk_to_npc`, mode all).
- Report back to the inviter (quest report line; no separate objective in the source).

## Outcomes & rewards

- `hunters_brotherhood_joined` (complete): relation +1 with the inviter and +1 with the master. No item reward.

## Related docs

- [Quests progression plan 048: hunters brotherhood introduction and membership](../../../../reference/quests/progression-plans/v1/quests-progression-048-hunters-brotherhood-introduction-and-membership.md).
- [Quests roadmap: hunters brotherhood (v1)](../../../roadmaps/v1/quests-hunters-brotherhood.md).

## Open questions

- ❓ Names of the inviter, master, trophy hunter and ambitious hunter are resolved at runtime.
- ❓ The exact prerequisite id of the hunter III quest is built by `hunterProfessionQuestId` and not expanded here.

## SeedVale curation (2026-10-14)

**SeedVale curation — D-QUEST-44 (accepted narrative):** Keep/rewrite the distinct story provisionally; imported stages, roles, mechanics, rewards and implementation scope are not approved and await M7/shared-system review. [Batch decision](../../../../decisions/v1-remaining-quests-batch-curation.md).
