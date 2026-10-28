# Quest Revival — Session 5: Treasures, caves and lost artifacts

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Polish or selectively rewrite physical V1 treasure choices, add an old-river map later, and place a memorable sword near a large settlement.

## Recorded author direction by source record
### R04 — Bandits' Stash (`world:dungeon-bandit:<settlementId>:<caveId>:<giverNpcId>:<claimantNpcId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** Existing bandit cave story finds a ledger and marked property and offers property return, evidence surrender or concealment.  
**Discussion boundary:** Deepen motives, claimant voices and evidence while keeping exact item instances and meaningful branches.

### R11 — Missing Hunter (`world:lost-hunter:<settlementId>:<caveId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** The missing hunter's cave contains a distinct bow that can be returned to family or kept.  
**Discussion boundary:** Make identity and family response more memorable without downgrading the exact item to a generic quest reward.

### R17 — Lost Treasure Expedition (`world:lost-treasure-expedition:<settlementId>:<caveId>[:<sponsorNpcId>[:<stakeholderNpcId>]]`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** A stakeholder and an outside sponsor lead to expedition camp, journal, evidence and treasure; the journal's disposition is a choice.  
**Discussion boundary:** Improve the people, evidence and property motivations; don't assume this already completes the Chronicles epic.

### R18 — Treasure Map (`mapa-do-skarbu`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** A physical dark-forest map leads to ruins and a real lootable chest.  
**Discussion boundary:** Improve clues and geographic storytelling while preserving the persistent cache state.

### R19 — Old Bones (`world:old-bones:<settlementId>:<caveId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** Old Bones offers an exact signet and one or sometimes two claimants, with return, alternative recipient or keep outcomes.  
**Discussion boundary:** Make each claimed right and supporting evidence comprehensible without requiring a new universal legal system.

### R24 — Old Treasure in the Cave (`skarb-jaskini-niedzwiedzia`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** A grave map leads to a bear cave and a sealed casket, which can be opened for treasure or returned unopened.  
**Discussion boundary:** Clarify grave permission, claimant rights and consequences; retain the actual action-based casket decision.

### R52 — The Map That Missed the River (`Q05`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Add; low priority**.  
**Player-facing current/donor story:** V2 Q05's outdated map points to a former river channel, stone circle and strongbox with various beneficiaries.  
**Discussion boundary:** New V1 story, not the existing dark-forest map; prioritize geography-based deduction when eventually selected.

### R58 — The Bell in Blackwater (`Q11`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's Blackwater bell involves marsh chapel salvage, possible crossing restoration, sale or investment.  
**Discussion boundary:** Valuable later if transport/crossing/income results have real world effects.

### R59 — The Iron Under the Pine (`Q12`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Add; candidate near LG/XL settlement**.  
**Player-facing current/donor story:** V2's captain Martin sword story places an exceptional weapon at Pinewatch with guard, sale and keep choices.  
**Discussion boundary:** Author favors addition near a large LG/XL settlement. Keep sword distinct from the former-adventurer elder's own sword.

### R60 — The Ash House Vault (`Q13`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer; high in deferred queue**.  
**Player-facing current/donor story:** V2's Ash House vault brings unpaid wages, inheritance and choices about rebuilding, settling debt or selling property.  
**Discussion boundary:** Worth revisiting early among deferred stories; needs real title/accounting/waystation effects for full version.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Decide per V1 quest (R04/R11/R17/R18/R19/R24) whether polish alone or substantial rewrite is worth its narrative and save-compatibility cost; don't force all to one size.
- [ ] Map exact item-instance claims and property branches, ensuring already found/looted treasure isn't duplicated.
- [ ] Choose any optional common evidence/knowledge helpers only after story-level requirements are settled.
- [ ] For R59, pick the target LG/XL settlement/region, unique sword and actual guard/keep/sale contract; separate from elder's sword.
- [ ] Keep R52 as a low-priority new addition distinct from R18, with terrain conditions verified before approval.
- [ ] Preserve R60 high in the deferred queue, R58 deferred, and later Chronicles continuity without forcing mergers.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
