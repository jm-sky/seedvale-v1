# Cemetery Care Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted narrative design (author, 2026-10-14); exact cast, dialogue, balance and implementation deferred to M7.

## Decision — D-QUEST-29

**Disposition:** Merge and rewrite. V1 `zapomniany-cmentarz` (*Forgotten Cemetery*) is not preserved as a separate authored quest. Its useful function — discovering or being directed toward an overgrown cemetery — becomes part of the broader cemetery-care situation. V2 Q14 `Weeds on the Hill` is kept and rewritten as the primary authored cemetery-care story.

This decision does not merge unrelated cemetery treasure stories. The accepted grave-access and permission directions in `quest-feature-proposals.md` remain separate questlines with their own clues, ownership claims, permissions and outcomes.

## Persistent cemetery and quiet help

- The cemetery exists as ordinary world content and can become visibly neglected independently of quest activation.
- The player may discover the cemetery without a quest lead and may tidy graves before receiving the authored request. That work must remain authoritative and be recognized later rather than reset or duplicated.
- Kate Hornblower may mention the neglected cemetery or direct the player toward it as an optional information source. This does not create a second quest, completion, or reward.
- Preserve the quiet-help direction from AD-45: useful work done before formal acceptance can later be acknowledged by NPCs.
- Do not keep Q14's imported generic 240-hour lapse timer. If cemetery condition changes over time, that belongs to shared world state rather than a quest-only expiry.

## Quest motivation and cast

The quest giver has a personal reason to care for the cemetery: close family members are buried there, while age, health or physical limitations make maintaining the graves difficult. The request should feel like ordinary local life rather than an artificial emergency.

Imported V2 `Ruth` is **not** a guaranteed SeedVale NPC identity and must not become canonical solely because Q14 used that slot name.

At M7 content design:

1. Prefer a suitable existing NPC when the current canonical cast contains a credible older resident or close relative whose history fits the cemetery.
2. Preserve stable NPC identities and existing relationships; do not rename or silently repurpose Mark, Kate, Ann, Peter or another reserved person merely to reproduce V2's cast.
3. If no existing NPC fits naturally, add a new canonical NPC with the required family connection and local history.

The exact identity therefore remains open until the M7 cast is reconciled against the then-current settlement population.

## Grave care versus grave disturbance

Tidying and digging are distinct actions. Q14's imported rule that any grave digging while the quest is live automatically produces the `desecrated` ending is retired.

- Lawful access to a specific grave under an accepted family or settlement authorization must not automatically fail the cemetery-care quest.
- Other accepted cemetery questlines may require opening a specifically authorized grave; this is compatible with caring for the cemetery.
- Unauthorized disturbance remains possible, but consequences use the shared ownership, knowledge/exposure, relationship and settlement-reputation systems. There is no omniscient quest-only punishment.
- If the giver or community credibly learns that the player violated a grave, trust can be damaged and the care arrangement may end or change. Exact consequences belong to M7.
- Grave access, treasure ownership, family mementos and promised shares remain owned by their respective quest/world systems; this quest must not duplicate or confiscate their items or rewards.

## Outcomes and rewards

Keep Q14's small-scale tone. Successful care should primarily improve the giver's personal relationship with the player and modest local settlement standing. A small payment may come from real settlement treasury resources if appropriate; do not mint an automatic quest-only payout. Exact amounts and dialogue remain M7 balance work.

Ignoring the request does not need a generic failure timer. The cemetery may simply remain neglected or later be tended by NPCs if the owning simulation supports it.

## Sources

- [V1 Forgotten Cemetery](../quests/catalog/v1/v1-zapomniany-cmentarz/README.md)
- [V2 Q14 Weeds on the Hill](../quests/catalog/v2/q14-weeds-on-the-hill/README.md)
- [Quest feature proposals — cemetery grave access](../quests/quest-feature-proposals.md#5-cemetery-treasure-quests--grave-access-and-permissions)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md), R-22 / F-09
- [Audit 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), AD-41–AD-58
