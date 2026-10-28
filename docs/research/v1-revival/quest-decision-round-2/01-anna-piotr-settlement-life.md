# Quest Revival — Session 1: Anna, Piotr and everyday settlement life

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Family continuity, physical repairs, a replacement flower-and-honey exchange, caregiving, and small believable errands.

## Recorded author direction by source record
### R01 — Wood for Anna (`drewno-dla-anny`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; series membership undecided**.  
**Player-facing current/donor story:** Anna needs five branches for the communal fence; delivery reserves real repair materials, while NPC work repairs the structure.  
**Discussion boundary:** Improve motivation and state-aware dialogue; determine which wood requests remain separate or become stages in the family series.

### R02 — Wood for Piotr (`drewno-dla-piotra`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; Piotr owns a real cart**.  
**Player-facing current/donor story:** Piotr needs five branches for his logging cart. The existing quest references a real `loggingWagon` repair target.  
**Discussion boundary:** Ensure the wagon is visibly present and truly owned by Piotr, with credible repair state and memory of earlier help; ownership and presentation need targeted verification.

### R03 — Wood for Repairs (`drewno-na-naprawe`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; potential wood-quest consolidation**.  
**Player-facing current/donor story:** The player delivers five branches for Piotr's household fence; later repair belongs to an NPC.  
**Discussion boundary:** Keep its real repair sink if retained, but author may consolidate/remove ONE wood quest after reviewing the series. No ID has been selected for removal.

### R09 — Stones for Piotr (`kamienie-dla-piotra`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; weather events permitted when useful**.  
**Player-facing current/donor story:** Piotr needs six stones for the household foundation; materials go into real repair stock.  
**Discussion boundary:** Keep dialogue consistent across the family series. Scripted weather is ALLOWED if later justified, but no storm has been approved for this quest.

### R21 — Message for Piotr (`relay-anna-piotr`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Replace original message premise with flowers → honey**.  
**Player-facing current/donor story:** The current V1 errand has Anna sending a fishing message to Piotr, even if they stand together; the player then returns to Anna.  
**Discussion boundary:** New story: busy Piotr asks the player to gather flowers and give them to his wife Anna. Anna then asks the player to take honey to Piotr. Guarantee a nearby usable hive with bees; define the actual flower/honey sourcing and transfers.

### R23 — Shells for Kasia (`shells-dla-kasi`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance species and dialogue; decoration deferred**.  
**Player-facing current/donor story:** Kasia accepts three ordinary shells, including shells already possessed; source currently accounts for ordinary inventory hand-in.  
**Discussion boundary:** Accept different shell varieties with differentiated responses and better dialogue. Persistent decoration is optional and explicitly not required in the initial scope.

### R26 — Disputed Wood (`sporne-drewno`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; series membership undecided**.  
**Player-facing current/donor story:** The player hears Anna and Piotr's competing fence/cart priorities, chooses who is helped first and may later help the other.  
**Discussion boundary:** Respect real consequences and state-based dialogue; discuss whether it is a series entry rather than one independent quest.

### R33 — Water for Marek (`woda-dla-marka`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance with real water handover**.  
**Player-facing current/donor story:** Marek currently accepts a well visit plus report as 'water delivered'; no filled vessel moves.  
**Discussion boundary:** Make the request believable for a guard on duty. Require filling, carrying and transferring actual water without losing or duplicating containers.

### R38 — Herbs for Anna (`ziola-dla-anny`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Merge authored herb errand with G04**.  
**Player-facing current/donor story:** Anna currently requests three generic herbs for household stock, with an ordinary item hand-in.  
**Discussion boundary:** Replace/adapt the authored story into treatment of ANNA'S ill child; don't confuse her identity with V2's Dora. Preserve a meaningful gathering interaction.

### R43 — Root by the Stream (`G04`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Adapt G04 narrative into R38/Anna family**.  
**Player-facing current/donor story:** V2 G04 has Dora collecting yarrow, mint and chamomile for ill Toby, with urgency and source-dependent consequences; V1 lacks that authored story.  
**Discussion boundary:** Adapt the richer sickness, specific herbs, treatment and aftermath to Anna's child. Herb types should exist as general crafting materials, not quest-only tokens.

### R50 — A Roof Before Rain (`Q03`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's household roof choices include repair, lean-to shelter and temporary propping; V1 has foundation/fence repairs but not this authored roof quest.  
**Discussion boundary:** Keep for later; a scheduled storm is not forbidden. Design real roof outcomes only when this deferred story is re-opened.

### R54 — Six Bowls, One Pan (`Q07`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's family supper requires food and attendance choices while people have real duties; the authored story is absent from V1.  
**Discussion boundary:** Keep as a future settlement-life candidate, not a prerequisite for the earlier family repairs.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Map Anna/Piotr relationships and current family/repair story order; decide exactly which quests form stages and which remain separate.
- [ ] Choose whether to consolidate one wood quest, identify its source ID, and preserve its unique repair/resource sink and old-save outcomes.
- [ ] Verify `loggingWagon` ownership and visible object/repair lifecycle, not just the quest target key.
- [ ] Define R21's flower item(s), availability and actual handover from Piotr via player to Anna; choose where Anna's honey comes from.
- [ ] For R21, guarantee a reachable, usable local wild hive near their home, including bee visibility/representation, and avoid softlocks if the hive is empty, burned or previously harvested.
- [ ] Choose the child's identity, illness progression, genuine healing and herb/crafting catalog for the R38 + G04 merged story.
- [ ] Decide R33's physical water container/transfer and true guard-on-duty availability.
- [ ] Agree minimum shell variants and Kasia dialogue responses; leave persistent decoration optional.
- [ ] Check quest IDs, saves, persistence, NPC identity and contextual availability for the selected family-series structure.
- [ ] Keep R50 and R54 deferred; do not infer a ban on changing weather.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
