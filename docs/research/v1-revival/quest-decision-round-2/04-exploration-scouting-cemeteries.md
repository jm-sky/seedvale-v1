# Quest Revival — Session 4: Exploration, scouting and settlement cemetery

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
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

- [ ] Decide R22's exact plot depth: original quiet tower, expanded V3 stolen valuables, or separate tower episodes.
- [ ] Verify tower landmark and conditional offer against current world-generation; do not mistake source definition for guaranteed per-seed availability.
- [ ] Choose R39's scouting purpose and remove the concrete false-stag report; align evidence-based reports with R27 without automatic quest consolidation.
- [ ] Define R37 + R61 as the settlement cemetery story; confirm whether R12's caretaker/cemetery is a different site.
- [ ] Retain R28 and R25's low-pressure exploration value.
- [ ] Check stable landmarks, world knowledge and quest-stage persistence only for chosen changes.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
