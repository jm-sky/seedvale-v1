# Missing Cargo — Quest Curation

**Created at:** 2026-10-13  
**Created by:** ChatGPT GPT-6

**Status:** Accepted author narrative decisions; dialogue, numeric balance and implementation details deferred to M7.

## D-QUEST-26 — Missing Cargo (accepted, 2026-10-13)

**Disposition:** Keep and rewrite V1 `zaginiony-ladunek` as a coastal shipwreck, rescue and cargo-recovery story. It is a distinct incident from V2 Q09 `Goods on the Ground` (local barter and trade); do not merge them.

### Cause, discovery and independent response

- A storm wrecked a cargo vessel off the coast. No sabotage or smuggling is involved in the accepted premise.
- Some crew members survive and need help. Injury, exhaustion and time matter: untreated people may worsen or die; the player can treat them or bring help, and NPCs may independently discover and rescue them. Do not freeze their conditions pending player quest progression. **Author clarification (2026-10-14, D-VISION-12 / Review 095):** mortality from untreated injuries, illness, exposure or predators belongs to **shared NPC health**, not a special shipwreck death timer or exception. Reaching 0 HP alone incapacitates, not automatically kills; ordinary human combat remains non-lethal without deliberate finishing. Preserve survivor rescue windows and outcomes through shared deterministic time, save/load and supported Near/Mid/Far simulation; defer unsupported Far autonomy until M8.
- Kate Hornblower, the settlement reeve (identity not assigned here) and guard Mark Hornblower each have independent reasons to notice the missing delivery and act, based on their knowledge and capabilities. There is no mandatory single quest giver or discovery order. The player may also discover the wreck without a lead.
- Rescue, cargo recovery and ownership accounting are separable activities; they may progress without player involvement.

### Cargo, ownership and economic consequences

- Cargo has **mixed ownership and destinations**: parts belong to an external merchant from another settlement; parts may already belong to Kate Hornblower, the settlement, or other individuals. Do not assign all cargo to one merchant by default.
- Kate expects goods for her trade and may have money committed; the reeve cares about communal supplies and settlement shortages; Mark is concerned with the missing crew, safety, and protection of property. These are narrative motivations, not a fixed exclusive responsibility split.
- Missing goods can cause real supply shortages or personal losses, as appropriate to their inventory ownership and the economy. Player and NPCs can recover, return and account for goods; external owners can arrange collection.
- Appropriation by the player is possible. It has **no omniscient automatic punishment**, but discovery should be plausible and likely: manifests, survivor testimony, recognizable goods, witness observations and attempts to resell can create evidence and suspicions. Suspicion alone is not proof; legal and social effects follow credible knowledge and evidence.

### Persistent wreck and survivors

- The wreck is a persistent coastal place which gradually deteriorates due to water and weather. Recovery/salvage changes its physical state; neither quest completion nor a fixed timer should simply erase it. Remnants may remain.
- Rescued crew members have different futures: some return home once recovered; others may settle, work and form relationships. They remain normal world NPCs governed by their needs and circumstances, not quest-only props.
- No mandatory player intervention, scripted universal survival, or fabricated outcome is required: outcomes reflect durable world state.

### M7 design questions (not yet decided)

- Exact crew identities and count, wounds, rescue opportunities, destinations, and timing.
- Manifest, transfer-of-title and cargo ownership per stack, losses, theft evidence, investigations and dispute outcomes.
- Autonomous response feasibility, salvage/deterioration rates, economy effects and persistence contract.
- Dialogues, quest initiation/journal, monetary and reputation rewards, and tuning.

This is narrative curation only, **not authorization to implement before M7**.

## Sources

- [V1 Missing Cargo](../quests/catalog/v1/v1-zaginiony-ladunek/README.md)
- [V2 Q09 Goods on the Ground](../quests/catalog/v2/q09-goods-on-the-ground/README.md)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md), R-19
- [Audit 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), AD-41–AD-58
