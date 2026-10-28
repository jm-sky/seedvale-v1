# Quest Revival — Session 7: Chronicles and long-form progression

**Created:** 2026-10-28  
**Status:** Main narrative decisions finalized 2026-10-28; technical verification pending. **NOT an approved implementation plan.**  
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

- [x] Keep R12's archaeologist/caretaker cemetery separate from home settlement R37/R61; preserve `grave_access_granted` consumer, subject to technical verification.
- [x] Select R13 minimal polish, R14 clue polish, R15 minimal polish, R16 truthful promise-versus-material help.
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

## Round 2 approved author decisions — 2026-10-28

**Narrative decisions only.** Preserve source-confirmed V1 behavior unless explicitly modified below; no implementation, migration, reward rebalance or new Chronicles finale is authorized.

- **R12 Order in the Cemetery — KEEP:** This remains an independent caretaker/archaeologist-site cemetery chapter, **not** Kazimierz's R37+R61 home-settlement cemetery. Retain the four-branch delivery and its exact `grave_access_granted` permission used by the Chronicle grave-access consumer. No automatic cross-site permission or consolidation. Confirm binding and save/permission integration technically later.
- **R13 Deciphering the Chronicle — MINIMAL POLISH:** Keep the choice to pay **35 coins** or recover and physically transfer the unique reference glossary to the scholar. Improve dialogue clarity only; no new stages, payment changes or duplicated book/glossary.
- **R14 Encoded Chronicle — POLISH CLUES:** Preserve the two possible leads (grave or ruins), one persistent physical chronicle with **one actual seed-selected location**, legal grave access, and the already-owned-book reconciliation path. Clarify geography and misleading ambiguity without adding an extra copy or new investigation subsystem.
- **R15 Old Grudge — MINIMAL POLISH (author selected C):** Keep V1's existing choices, effects, character bindings and stage structure; change only misleading/inconsistent text. No physical axe, new evidence or investigation. The earlier suggestion to expand to three positions is **not approved** as a new branch.
- **R16 Preparing for Winter — ARRANGED HELP SUFFICES (author selected B):** Keep six-branch direct material delivery **or** arranging help through conversation with the neighbour. On the neighbour path the quest completes when the agreement is made; describe it as **assistance arranged**, not as wood already carried or consumed. No NPC wood transport or offscreen delivery mechanism authorized. Preserve existing `material_help` / `neighbor_help` outcomes and Chronicle dependencies.

### Open technical verification / exclusions

- Verify R12 `grave_access_granted` authorization, exact grave/site identity, per-seed casting and separation from R24's home-cemetery permit; maintain existing quest-ID/stage/save compatibility.
- Check physical chronicle/glossary identity, single seeded find, prior discovery, pay/transfer effects, and source-level chapter conditions against real saves; source definitions are not playthrough proof.
- Do not imply that later epic Chronicles chapters or a finale are implemented or included in this session.
- D4 Performance-First integration freeze remains binding. Other early chapter changes are limited to the approved textual polish.
