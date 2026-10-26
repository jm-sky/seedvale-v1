# G05 Disputed Oak — Curation Decisions

**Created at:** 2026-10-14  
**Created by:** ChatGPT GPT-6

**Status:** Accepted author decisions (D-QUEST-27); further narrative choices remain open. No game implementation authorized before M7.

## Accepted narrative direction

- **Keep and rewrite** v2 G05 `Disputed Oak` as a distinct story. It is not merged with v1 `sporne-drewno` (D-QUEST-22).
- The old oak has been **shared in practice** by neighbouring communities for generations, rather than being a straightforward exclusive-property dispute. Its acorns support Cedric's pigs.
- A **bridge has collapsed**, severely disrupting travel and trade. Miles Hewer needs a particularly long, strong oak structural beam to rebuild it. The disputed old oak is unusually suited to this task; ordinary nearby trees do not easily replace it. Exact engineering and available alternative solutions remain to be curated.
- Miles Hewer **does not live in the player's home settlement**; Peter Woodward remains the home-settlement woodcutter. Miles is a separate person, with his settlement to be assigned in canonical geography.
- **Alternative solution (author accepted, 2026-10-14):** the player can search for another tree with timber suitable for the bridge. Finding it and arranging felling and transport require additional effort; saving the disputed oak remains possible. The actual tree location, logistics and resource costs are not yet fixed.
- **Bridge rebuilding (author accepted, 2026-10-14):** NPCs rebuild the bridge autonomously once the required materials and conditions are met. The player may optionally contribute real construction labour to speed up the work; personal participation is not required for completion. Reuse the ordinary autonomous work and contribution/reward rules rather than a quest-only construction shortcut. Exact progress rates and reward balance remain open.
- **Autonomous escalation if ignored (author accepted, 2026-10-14):** NPCs pursue the bridge problem even if the player never accepts or follows G05. They can deliberate and eventually choose a solution on their own, potentially felling the disputed oak. The player may intervene while the outcome is still preventable; inaction does not freeze the world or guarantee that the oak survives. The decision cadence, warning opportunities and conditions for felling are open; do not silently assume an arbitrary quest timer.
- **Warning and communication (author accepted, 2026-10-14):** news of the intended felling can spread organically through NPC conversations, rumours and visible woodcutter preparations, potentially reaching the player before direct contact. Independently, Miles tries to notify the player personally. Neither channel teleports knowledge or guarantees arrival in time; the player may still encounter the consequences after the fact. Specific propagation and meeting scheduling belong to the shared NPC knowledge/social simulation, not bespoke quest omniscience.
- **Point of no return (author accepted, 2026-10-14):** once the woodcutters actually begin cutting the disputed oak, the felling cannot be stopped. The player must prevent the start of cutting; reaching the site after cutting begins is too late even if the tree has not yet fallen. Advance warnings and preparations must therefore be distinguishable from actual cutting. Do not allow later dialogue or an alternative timber discovery to undo the started felling.
- **Add domestic pigs to SeedVale's planned livestock/fauna scope.** G05 keeps Cedric's pig husbandry, acorn feeding and the recurring resource cost of felling the oak. This is a product/content decision, not a claim that pigs are currently implemented.
- **Pig-feeding scope clarification (author, 2026-10-14):** losing the oak does not require any special quest-specific pig-feed, income-loss or herd-reduction mechanics. Pigs simply feed on whatever other food the ordinary livestock system supports. Opus should plan this as part of implementing pigs, not as a G05 feature. Do not predesign a separate economic cascade for this quest.
- **Scheduling caveat:** if implementing pigs and their necessary livestock interactions proves materially expensive, **defer G05 implementation** until the required fauna support exists. Do not create a quest-only pig simulation or hold up the main M7 quest milestone for it. Record and estimate the dependency when planning M6/M7.

## Still open

- Specifics of the alternative-tree search, felling and transport; how the collapsed bridge affects real traversal and local trade; final choices, NPC dialogue and reward calibration.
- The final neighbouring-settlement geography and the identity of any other affected parties.
- Exact pig husbandry and alternative ordinary feeds to be planned by Opus as part of pig implementation, not invented inside the quest.

## References

- [V2 G05](../quests/catalog/v2/g05-disputed-oak/README.md)
- [V1 wood priority curation — D-QUEST-22](woodward-timber-priority-curation.md)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md)
- [Review 059, AD-41…AD-58](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md)
