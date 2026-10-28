# Quest Revival — Session 3: Hunters, fauna, wolves and livestock

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

A named Greybeard arc replacing generic wolf story beats, actual threatening wolves, a richer rat infestation and a stolen lamb.

## Recorded author direction by source record
### R05 — Boar by the Trail (`dzik-przy-szlaku`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance**.  
**Player-facing current/donor story:** Marek's quest currently kills a live boar selected by kind without proof that the same animal threatens the named meadow/trail.  
**Discussion boundary:** Improve spatial truth and stakes; optional hunter assistance must be actual participation rather than a story-only hit.

### R06 — Dangerous Wolf (`grozny-wilk`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite into Greybeard narrative**.  
**Player-facing current/donor story:** V1's dangerous-wolf hunt binds a generic live wolf and pays a Damascus sword; reload can invalidate active generic wild-target binding.  
**Discussion boundary:** Author wants a dedicated persistent Greybeard. Resolve whether R06 and new G07 form one adapted storyline, not two accidental wolves named the same.

### R07 — Circle of Hunters (`hunters-brotherhood-intro:<homeSettlementId>:<inviterNpcId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** V1 introduces the hunter circle after Hunter III, using real NPC roles and membership outcome.  
**Discussion boundary:** Improve characterization and dialogue without removing existing profession progression.

### R08 — Troubling Hunting Ground (`hunters-brotherhood-investigation:<homeSettlementId>:<inviterNpcId>:<spawnerId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish**.  
**Player-facing current/donor story:** An existing V1 quest occurs only at an actually unhealthy deer habitat and asks the player to report a diagnosis.  
**Discussion boundary:** Improve explanation of evidence and hunter viewpoints; don't fabricate ecology for story convenience.

### R10 — Fox by the Settlement (`lis-przy-osadzie`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Keep**.  
**Player-facing current/donor story:** The settlement fox hunt is a short real animal kill quest.  
**Discussion boundary:** Preserve deliberately simple hunting alongside larger narratives.

### R20 — Rat Plague (`plaga-szcurow`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish + Enhance; scope for discussion**.  
**Player-facing current/donor story:** Existing infestation completion combines repaired storage, destroyed nest and low live-rat count, not just a story flag.  
**Discussion boundary:** Author proposes a physical settlement storage building/interior, rat boss, optional poison and poisoning risk to livestock/dogs unless NPCs were warned. Boss/poison mechanics and their fairness need group design.

### R30 — Wolf Den (`wilcza-jama`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite as coherent wolf series**.  
**Player-facing current/donor story:** Current V1 story clears a den after the dangerous-wolf quest; clearing and permanent destruction are distinct, and the den is reused by other quests.  
**Discussion boundary:** Adapt V3's sequence with real den consequences and coherent Greybeard links; avoid flattening real clearing/destruction distinction.

### R31 — Wolves Under the Settlement (`wilki-pod-osada`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite; real approach/pressure**.  
**Player-facing current/donor story:** Anna's V1 threat can be resolved via permanent den destruction and grants substantial renown, including possible guard recognition.  
**Discussion boundary:** Follow V3 story direction while wolves actually approach the settlement, using existing `frenzyWolf` behavior as reference; decide story gates without breaking real fauna autonomy.

### R32 — Wolves at the Merchant (`wilki-u-kupca`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite within same series; preserve horse**.  
**Player-facing current/donor story:** Kasia promises ownership of one actual merchant horse for permanently destroying the den; horse death can prevent reward.  
**Discussion boundary:** Connect the merchant viewpoint to the main wolf series, preserving real reservation, transfer and failure branches, even if several quests share a physical incident.

### R36 — Lost Sheep (`zagubiona-owca`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Merge authored story into stolen-lamb narrative; retain systemic loss**.  
**Player-facing current/donor story:** Current authored Anna sheep quest deliberately causes a real stray on acceptance; separately V1 generates loss events from real fauna state.  
**Discussion boundary:** Replace/adapt authored narrative with theft-based story, but keep generic world-driven livestock loss available and its own recurrence/identity logic.

### R40 — Lost Lamb (`G01`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Add V2 theft story through R36 adaptation**.  
**Player-facing current/donor story:** V2 G01 follows missing lamb Pip, evidence of possible theft, hungry Piers and restitution/guard routes.  
**Discussion boundary:** Use the theft, investigation and moral alternatives, deciding whether Anna's animal or the donor's Molly/Pip owns this authored case.

### R46 — Trail of the Grey Wolf (`G07`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Integrate Greybeard story with R06/R30/R31/R32**.  
**Player-facing current/donor story:** V2 G07 identifies an alpha by tracks and missing toe, with kill/drive/poison outcomes and a personal loss narrative.  
**Discussion boundary:** Keep ONE coherent unique-wolf story contract and real behavior; V1 currently has no authored Greybeard.

### R48 — A Hare Out of Place (`Q01`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **No author decision yet**.  
**Player-facing current/donor story:** V2 Q01 offers observation or hunting of a rare hare with an experienced hunter; V3 retired it for a simpler fox hunt.  
**Discussion boundary:** Explicitly decide Keep as future candidate / Add / Defer / Retire for V1; do not silently inherit V3 retirement.

### R49 — The Hollow Below the Road (`Q02`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2 Q02 presents a sow with piglets below a road and options to clear the den, reroute traffic or keep watch.  
**Discussion boundary:** Keep for later real navigation/guard/animal-family effects.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Design one source-of-truth Greybeard identity and story order spanning R06/R30/R31/R32/G07; choose kill/drive/poison implications.
- [ ] Verify actual `frenzyWolf` test/simulation behavior and select when wolves approach the settlement without creating an artificial story-only spawn system.
- [ ] Preserve clear-den vs destroy-den states; define shared-incident reward arbitration and guard renown without duplicating claims.
- [ ] Preserve Kasia's specific horse as a physical reward with ownership reservation and death branch.
- [ ] Define rat-boss location in a real warehouse building and the minimum combat/AI scope; assess optional poison effects and warning fairness for livestock/dogs.
- [ ] Decide whether the stolen lamb belongs to Anna or Molly and how actual custody/restitution works; generated livestock loss remains intact.
- [ ] Decide R48 explicitly (currently unselected by author).
- [ ] Scope boar target identity and optional helper only if justified; preserve conditional ecology and hunter profession.
- [ ] Assess reload, streaming and persistence of identified fauna and active player quests.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
