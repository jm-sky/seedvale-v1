# Quest Revival — Session 2: NPC relationships and social conflicts

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Full V3 parcel/fraud story, lower-priority smith dispute, deferred mysteries, and the settlement cemetery's caring story.

## Recorded author direction by source record
### R34 — Lost Parcel (`zaginiona-przesylka`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Full V3 story; high importance**.  
**Player-facing current/donor story:** Currently Kasia's lost-parcel quest uses a rock-den visit and a sealed-return versus report-to-guard choice; there is no physical parcel recovery.  
**Discussion boundary:** Adopt the full V3 forged-relative/fraud, evidence, interception or recovery, commissioned gift and personal finale. Preserve meaningful agency; detailed branching and how to treat the old privacy choice remain to be designed.

### R41 — Rusty Debt (`G02`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Add; low priority**.  
**Player-facing current/donor story:** V2 G02 mediates an incorrectly made plowshare and payment dispute, with discount, repair-then-pay, return and pressure outcomes.  
**Discussion boundary:** Introduce later, using actual owner/buyer/item/payment effects. Consider a soft link to Q04 without making it mandatory.

### R42 — Night Torches (`G03`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** In V2 someone secretly snuffs evening torches; clues lead to a child's household and choices about disclosure.  
**Discussion boundary:** Not currently V1 authored content. Retain the concept and preserve independent V1 evening guard duty.

### R47 — Well and Rumor (`G08`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's well-rumor investigation finds evidence of a spoiled barrel and offers truth, secrecy or wrongful accusation.  
**Discussion boundary:** Retain for later investigation/knowledge work rather than claiming simulated evidence and exposure already exist.

### R51 — The Handle Remembers (`Q04`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** An inherited hammer can be reforged, replaced or preserved as a family keepsake in V2.  
**Discussion boundary:** Future story about the identity of one real object and smith services; do not implement now.

### R61 — Weeds on the Hill (`Q14`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Rewrite; cemetery at the settlement**.  
**Player-facing current/donor story:** V2's Q14 asks for five grave-tending actions; bad digging causes desecration. This story does not exist in V1.  
**Discussion boundary:** Redesign with believable caring work and relationships at the settlement cemetery; coordinate explicitly with V1 R37 and R12's separate grave-permission mechanics.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Map V3's complete R34 plot, cast, evidence, property, gift and meaningful outcomes into V1 while retaining gameplay choices; author wants full scope, not a reduced substitute.
- [ ] Decide whether R34's original privacy-versus-guard choice survives as a branch within the expanded story.
- [ ] Give R61 a genuine personal reason and persistent care actions; establish exact settlement cemetery ownership/location.
- [ ] Coordinate R61 with R37 and check whether R12 permission belongs to the same or a different site.
- [ ] Keep R41 an approved candidate but LOW priority; do not turn R42/R47/R51 deferrals into removals.
- [ ] Resolve the effects of any new consequences on NPC identity, payer resources and save compatibility before implementation planning.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
