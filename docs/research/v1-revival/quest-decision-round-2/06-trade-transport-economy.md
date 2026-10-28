# Quest Revival — Session 6: Trade, transport and economy

**Created:** 2026-10-28  
**Status:** Author decisions recorded; focused design session pending. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Existing suspicious cargo polish, several valuable deferrals, a practical water-for-livestock candidate and selective reuse of mine ideas.

## Recorded author direction by source record
### R29 — Suspicious Transport (`rpg:suspicious-transport:<settlementId>:<counterpartId>`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Rewrite / Polish**.  
**Player-facing current/donor story:** An existing cave-cache transport quest revolves around a unique evidence knife and whether to report, conceal or keep suspicious goods.  
**Discussion boundary:** Deepen claimant motives and physical evidence, preserving cave claims and stable transfer behavior.

### R35 — Missing Cargo (`zaginiony-ladunek`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Defer; high in deferred queue**.  
**Player-facing current/donor story:** V1's wreck visit currently concludes no crew are present. The V3 story proposes live injured survivors, rescue choices, cargo claimants and autonomous outcomes.  
**Discussion boundary:** Keep this high-value large story near the front of deferred choices, but do not claim a rescue scenario exists now.

### R44 — Disputed Oak (`G05`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's contested oak balances timber with other households' use; V3 proposes bridge repair, alternative tree and irreversible felling.  
**Discussion boundary:** Defer until real physical bridge/harvest/ownership consequences are a selected direction.

### R45 — The Trader's Letter (`G06`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer; low priority**.  
**Player-facing current/donor story:** A merchant's letter offers a bargain whose costs may fall on poorer households.  
**Discussion boundary:** Later economic diplomacy; effects should reach actual household budgets, not only the player's prices.

### R53 — Room for One More (`Q06`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer; valuable**.  
**Player-facing current/donor story:** A traveller needs tools and choices about paid guide, friendly company or solo journey.  
**Discussion boundary:** Keep as future autonomous travel and consent story, not a scripted follower shortcut.

### R55 — The Long Way to Water (`Q08`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Add / Defer; author expects low effort**.  
**Player-facing current/donor story:** Sheep crowd a common well. Options are alternative water trough, a new well or an access rota.  
**Discussion boundary:** Do a bounded feasibility check of V1 wells, livestock routing and household use before asserting this is easy or expensive. Select an honest minimum playable version.

### R56 — Goods on the Ground (`Q09`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** Transported household tools and stock become the subject of several consignment, trust and payment arrangements.  
**Discussion boundary:** Wait for true goods transfer and settlement accounting where those effects are required.

### R57 — What the Mountain Owes (`Q10`, V2)

**Maturity:** **V2-only story** (not authored in V1); Q10 is design-only.  
**Author direction:** **Selective idea reuse only**.  
**Player-facing current/donor story:** V2 Q10 is design-only and proposes mine sale, production shares, safety and seasonal extraction; V1 already has mine foundations but colony story is planned.  
**Discussion boundary:** Do not import a parallel Q10 quest/economy. Consider only good narrative/system ideas for V1's existing planned mine series.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Determine realistic R55 minimum: visible trough, animal use and actual benefit; verify whether all three options are necessary before estimating effort.
- [ ] Preserve R35 high in the deferred queue and specify later the smallest believable rescue incident, including who can resolve it autonomously.
- [ ] For R29, choose polish vs deeper rewrite while keeping the existing exact evidence knife and item ownership.
- [ ] Preserve deferred priorities: R44 later, R45 low, R53 valuable, R56 later; no automatic implementation just because of documentation.
- [ ] Map Q10 ideas to the existing V1 mine roadmap without authorizing an independent mine quest.
- [ ] Avoid inventing a universal claims/logistics layer until selected stories justify a shared primitive.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Use this file as the opening context for the group's independent design session. No plan or coding-agent handoff is approved by these checkboxes.
