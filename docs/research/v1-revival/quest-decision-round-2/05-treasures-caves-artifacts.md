# Quest Revival — Session 5: Treasures, caves and lost artifacts

**Created:** 2026-10-28  
**Status:** Main narrative decisions recorded 2026-10-28; R59 destination contract and technical verification pending. **NOT an approved implementation plan.**  
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

- [x] Decide narrative depth for R04/R11/R17/R18/R19/R24 individually; see approved decisions below.
- [ ] Map exact item-instance claims and property branches, ensuring already found/looted treasure isn't duplicated.
- [ ] Choose any optional common evidence/knowledge helpers only after story-level requirements are settled.
- [ ] For R59, pick the target LG/XL settlement/region, unique sword and actual guard/keep/sale contract; separate from elder's sword.
- [x] Retain R52 as separate low-priority candidate, with terrain conditions unverified.
- [x] Preserve R60 high in the deferred queue, R58 deferred, and separate Chronicles continuity.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.

## Round 2 approved decisions — 2026-10-28

Author-approved narrative scope below **supersedes provisional portfolio suggestions**, not source-confirmed V1 functionality. It is not approval to implement or modify rewards.

### R04 — Bandits' Stash

- **Approved A:** Preserve all three distinct outcomes of existing V1: physically return marked property; submit genuine loot ledger/evidence to guard; or conceal the find. Improve character motivations, dialogue, credible evidence and claimant rights. Preserve the exact ledger and marked-item instances, other unrelated cave caches, and current conditional bindings.
- Dishonesty consequences should follow credible NPC awareness/discovery, not omniscient social penalties; existing immediate delta behavior therefore needs examination before implementation. Do **not** apply R22's compulsory honest authored resolution to R04, merge the caches, or add mandatory human combat.

### R11 — Missing Hunter

- **Approved A + fate A:** Expand the named hunter's story and family response. The hunter **died**; the player finds **persistent physical remains** and the hunter's **unique bow** in the cave, with credible confirming identification/effects, then reports the death to their family.
- Retain player choice to **return the exact bow** or keep it; different family/social consequences follow, no duplicated prize bow. Do not invent a live rescue NPC or revive the hunter after completion. A dead person's backstory and relatives must remain compatible with authoritative living NPC/world history. Identity, body persistence and family binding are not yet verified in V1.

### R17 — Lost Treasure Expedition

- **Approved:** Keep current V1 expedition camp, external sponsor, local stakeholder/family, separate journal/evidence/treasure containers, and three existing **journal** outcomes (family, sponsor, retain). **Narrative polish**, not a wholesale rewrite: make stakeholder/sponsor motives and competing property claims clear. Do not merge into Chronicles or duplicate treasure at hand-in.
- Exact journal custody and existing ID/binding/save semantics remain critical.

### R18 — Treasure Map

- **Approved:** Keep the real dark-forest map, discoverable ruins and persisted lootable chest. Improve geographical/environmental directions without new puzzle systems; only the real chest supplies its loot, with no quest reward clone/reset. Remains distinct from low-priority V2 Q05 / R52 old-river map.

### R19 — Old Bones

- **Approved B:** **Dialogue-only polish**. Make each claimant's assertion and motivation intelligible without new physical evidence gathering, legal arbitration or court mechanics. Preserve one exact signet and existing outcomes: claimant A, optional claimant B, or retain. No fabricated certainty about which is rightful; do not accidentally require a second claimant.

### R24 — Old Treasure in Bear Cave

- **Approved:** Preserve V1's physical grave-map -> bear-cave -> sealed-casket sequence and mutually exclusive **open/keep treasure** vs **return unopened** endings, with truthful item custody and no respawn/duplicate shares.
- Apply the previously approved **home cemetery exact-grave** authority: only Sołtys authorizes digging, Kazimierz's recommendation waives an **up-front fee**, **not** the settlement's promised share of actually retained treasure. Distinct from R12's separate archaeologist cemetery.
- **Open:** specific share/accounting, payer source, relation between opening/retaining and returning unopened (V1 currently computes a return payout), missing/changed item states; do not infer numerical rates from this approval.

### R59 — The Iron Under the Pine / V2 Q12

- **Approved:** New authored story in V1, suitable near an **LG/XL settlement**, centred on captain Martin's distinct exceptional physical sword and historical ownership. Preserve meaningful alternatives: deliver to guard, sell through a real trade, or retain legitimately. Reward can be valuable where accomplishment and economy justify it; no automatic nerf. Do not conflate the sword with the former-adventurer elder's sword or R06 Damascus sword.
- **Approved condition B for keeping:** After uncovering the sword's history, the **rightful owner/authorized custodian must give permission** to retain it. **No mandatory guard-service/patrol requirement** to earn retention. Merely finding it does not establish ownership.
- **Open:** actual LG/XL settlement/site generation; determine legally credible authority/custodian, item provenance and custody, exact guard deposit/sale/keep transfer contract, source of payments and stock, and gameplay reward balance. V2's numeric rewards are reference, not approved amounts.

### R52 / R58 / R60 priorities

- R52 / Q05: **Add later, low priority**, distinct map/river channel/cache; no implementation approval.
- R58 / Q11: **Defer**.
- R60 / Q13: **Defer, relatively high priority among deferred candidates**. No waystation construction/ownership system authorized.

### Cross-quest scope and risks

- All treasure/bow/journal/signet/casket/sword goods must obey physical instance ownership, real containers/transfers, no repeated rewards, deterministic identities, save/load consistency and conditional world/cast availability.
- Cave claims and spawn/loot state may be shared infrastructure but incidents remain separate. Reconcile original V1 quest ID/stage migrations for any changed narrative flow. Distinguish runtime evidence from intentions.
- **D4 Performance-First freeze remains active; no gameplay code, implementation plan, or reward values approved.**
