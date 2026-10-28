# Quest Revival — Session 4: Exploration, scouting and settlement cemetery

**Created:** 2026-10-28  
**Status:** Main narrative decisions recorded 2026-10-28; R25 research-delay choice and technical questions pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Preserve quiet exploration, confirm the existing tower quest, improve truthful reporting and link cemetery visits to real care.

## Recorded author direction by source record
### R22 — Lonely Tower (`samotna-wieza`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Retain and develop; exact V3 scope TBD**.  
**Player-facing current/donor story:** V1 `samotna-wieza` exists in `src/quests/quests.ts`: Piotr reports possible light/movement and asks for a landmark visit; the conclusion is an empty tower.  
**Discussion boundary:** Author likes this quest and wants it kept. Consider V3's stolen valuables/cache and ownership plot; decide whether it replaces the quiet visit or becomes another story.

### R25 — Trail by the Monolith (`slad-przy-monolicie`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** Anna's monolith lead uses a research delay, a specific monolith visit and a report on traces of a recent camp.  
**Discussion boundary:** Make knowledge and discoveries coherent; decide if the delay helps pacing, without pretending an unseen investigation has happened.

### R27 — Checking the Rock Cave (`sprawdz-szlak`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance**.  
**Player-facing current/donor story:** Kasia asks the player to examine a rock-den landmark and report tracks near a route; this is not necessarily the V2 cave.  
**Discussion boundary:** Offer honest reporting alternatives, possibly with NPC knowledge effects, while reusing actual observations.

### R28 — Old Ruins (`stare-ruiny`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Keep**.  
**Player-facing current/donor story:** Piotr's Old Ruins is a quiet visit/report to an actual landmark in V1, despite historical V3 retirement.  
**Discussion boundary:** Preserve independent low-pressure exploration and the personal reason to visit.

### R37 — Forgotten Cemetery (`zapomniany-cmentarz`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Merge with rewritten R61; settlement cemetery**.  
**Player-facing current/donor story:** Kasia asks the player to visit a cemetery and report whether the graves still stand; currently no actual upkeep.  
**Discussion boundary:** Author states this is the cemetery by the settlement. Combine exploration with the R61 care story, but handle R12 grave permission by explicit location/consumer decision.

### R39 — Scouting the Area (`zwiadowca`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** Piotr's scout currently inspects a rock den, observes/reports on a stag and collects stones; final dialogue can falsely claim a stag was seen.  
**Discussion boundary:** Improve real scouting purpose, evidence, choices and report truth; distinguish forestry knowledge and road safety where useful.

## Focused session checklist — discussion, NOT implementation tasks

- [x] Decide R22's exact plot depth: replace quiet empty-tower episode with stolen-valuables investigation; honest settlement-to-settlement resolution only.
- [ ] Verify tower landmark and conditional offer against current world-generation; do not mistake source definition for guaranteed per-seed availability.
- [x] Choose R39's scouting purpose: nature/fauna/resources; keep R27 separate as road safety, with truthful observations and no fabricated stag or threat.
- [x] Define R37 + R61 as Kazimierz's home-settlement cemetery tidying. R12's archaeologist cemetery is independently bound and remains distinct.
- [x] Retain R28's low-pressure exploration. R25's non-fictional investigation direction is retained; whether to remove the research delay remains pending.
- [ ] Check stable landmarks, world knowledge and quest-stage persistence only for chosen changes.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.

## Round 2 approved decisions — 2026-10-28

These are author-approved **narrative decisions, not implemented behavior**. Where they change existing V1 behavior, code/save migration and binding need targeted verification.

### R22 — Lonely Tower: replace the empty-tower conclusion

- **Approved:** Replace the original empty visit under existing `samotna-wieza` with a stolen-lightweight-valuables cache investigation. Piotr reports suspicious light/movement; a persistent tower/container holds exact stolen item instances, recognisable through appropriate ownership clues. Earlier tower/cache discovery should not create duplicated items or reset progress.
- **Approved choice B:** **Honest resolution only in the authored quest**, not the optional concealment branch from the historical V3 D-QUEST-34: report to home-settlement Sołtys/appropriate authority, inquire about ownership in the neighbouring settlement, return identified goods by real transfers, and obtain formal permission to retain unclaimed goods after both enquiries. Owner-funded reward is conditional on real means. No extra bandit NPC/combat or scripted returning bandits.
- **Boundary:** Removing the authored dishonest ending does not make physical inventory magically unavailable; taking items without completing reporting leaves the case **unresolved**, not falsely completed. Respect legitimate item possession/ownership interactions; do not invent a universal punishment system.
- **Separate from R04** Bandits' Stash and its own distinct location/container/items/three outcomes. Existing R22 stage ordering changes require persistence/migration review.

### R27 / R39 — independent, truthful scouting

- **Approved A:** Keep **R27 `sprawdz-szlak`** as Kasia's safety reconnaissance of a real road and rock cave, including a valid **no danger found** conclusion. Report actual observed threats/state, not a quest-spawned danger.
- **Approved A:** Keep **R39 `zwiadowca`** as Piotr's nature/fauna/resources scouting, with real observation rather than generic road inspection. A missing stag/deer must not be falsely reported as seen, and must not arbitrarily prevent an honest report. Reuse existing observation/world mechanisms; event-to-quest integration unverified.
- Do not merge their IDs, stages or rewards solely because both use reconnaissance. NPC knowledge updates are a candidate requiring technical verification, not approved new NPC knowledge subsystem.

### R28 / R37+R61 and R25

- **Previously approved:** Keep R28 `stare-ruiny` as independent, peaceful/low-pressure exploration; no forced treasure/combat. Merge R37 `zapomniany-cmentarz` with R61 into Kazimierz's real home-cemetery grave-tidying story, protecting his late wife's grave and neighbours. R12 Chronicles uses a separate archaeologist-bound cemetery; do not conflate permissions.
- **R25 `slad-przy-monolicie`:** existing author direction is **Polish** and preserve an atmospheric discovery of real camp traces without pretending an NPC researched them when none did. **Not yet approved:** removal of current research delay vs replacement with real NPC research. Earlier assistant suggestion to remove it is only a proposal.

### Implementation/validation still open

- Tower placement and per-seed availability; two-settlement actor/claimant casting and evidence; actual persisted item custody, owner transfers, reward sourcing, quest-stage migration and pre-discovery; exact report availability in the absence of danger/deer.
- R37/R61 historical save identity and grave-care interactions, plus the separate R24 bear-cave map grave permission, need focused integration checks.
- **No gameplay changes or implementation authorization. D4 Performance-First still applies.**
