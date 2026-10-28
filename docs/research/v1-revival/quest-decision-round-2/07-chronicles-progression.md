# Quest Revival — Session 7: Chronicles and long-form progression

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Preserve delivered early Chronicles, polish character writing and carefully coordinate grave-access permission with cemetery stories.

## Recorded author direction by source record
### R12 — Order in the Cemetery (`story:lost-treasure-chronicles:cemetery-favour`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Keep / conditional Merge**.  
**Player-facing current/donor story:** The caretaker's branch-delivery outcome grants exact permission consumed by a Chronicle grave-access check.  
**Discussion boundary:** Preserve permission and stage dependencies. Merge only after proving this is the same cemetery as settlement R37/R61 or explicitly choosing a cross-site rewrite.

### R13 — Deciphering the Chronicle (`story:lost-treasure-chronicles:chronicle-deciphering`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** The scholar can decipher the unique chronicle after a coin payment or recovery of a physical glossary.  
**Discussion boundary:** Improve motives and clues, keeping both routes and actual glossary transfer.

### R14 — Encoded Chronicle (`story:lost-treasure-chronicles:chronicle-search`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** The chronicle may be found through the grave or ruins lead, with state reconciliation if the player already has it.  
**Discussion boundary:** Clarify the seeded single-location truth and clue clarity while preserving actual book identity and legal grave access.

### R15 — Old Grudge (`story:lost-treasure-chronicles:elder:dispute`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** The elder's long-standing dispute lets the player support one party or seek reconciliation.  
**Discussion boundary:** Make testimonies, character motives and past events coherent; don't claim the mentioned axe is an implemented physical evidence item.

### R16 — Preparing for Winter (`story:lost-treasure-chronicles:elder:winter`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** The elder requests winter help, satisfied by material delivery or arranging a neighbor's assistance. Outcomes unlock other Chronicle threads.  
**Discussion boundary:** Acknowledge earlier help and distinguish spoken arrangement from proof of actual delivered materials.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Confirm R12's cemetery and exact `grave_access_granted` consumer; decide whether any merger with R37/R61 is geographically correct.
- [ ] Polish character motivation and choice clarity in R13–R16 without unintentionally reordering persistent quest stages or outcomes.
- [ ] Protect the physical chronicle, glossary and grave-permission gates and already-owned-book fast path.
- [ ] Distinguish current implemented early Chronicle chapters from later planned epic chapters.
- [ ] Do not expand this session into a new full Chronicles finale unless author explicitly selects that scope.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
