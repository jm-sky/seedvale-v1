# Quest Revival — Session 2: NPC relationships and social conflicts

**Created:** 2026-10-28  
**Status:** Group 2 narrative decisions finalized (2026-10-28); technical design and implementation pending. **NOT an approved implementation plan.**  
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
**Author direction:** **Defer (latest author decision); low priority if revisited**.  
**Player-facing current/donor story:** V2 G02 mediates an incorrectly made plowshare and payment dispute, with discount, repair-then-pay, return and pressure outcomes.  
**Discussion boundary:** No current design or implementation work. Retain V2's four dispute outcomes for later reconsideration; any future tie to Q04 is optional.

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

## Final author decisions — 2026-10-28

### R34 — Full V3 fraud/gift rewrite (approved narrative)
- Preserve the V3 plot rather than the old sealed-return vs guard moral dilemma: messenger loses correspondence about Kate/Kasia's surprise decorated shield for Mark/Marek; criminals impersonate distant relatives to solicit an advance. Kate is honest, remains safe and in the settlement, and the marriage is not made adversarial. Do not expand family genealogy, criminal identity or clue mechanics beyond the story's needs.
- Early discovery: showing the letter to Mark reveals a concrete discrepancy; alternatively a travelling merchant's plausible observation can reveal the fraud before payment. The merchant must not be a mandatory blocker; preserve an alternative lead.
- If Kate pays, the player can recover **all, some or none** of her actual advance based on dialogue/actions. No bespoke pursuit, capture, arrest or general investigation mechanic. Resolution with the wrongdoer can use dialogue and existing systems.
- Shared finale: Kate commissions a **real decorated shield** for Mark. If she lost money, the player **may voluntarily contribute** real coins and/or persuade the smith to discount the commission after hearing of the fraud; both may combine. The discount must change the actual charge. Show the physical gift, without building a new general-purpose crafting/commission framework merely for this quest.
- Mark receives the shield; the smith's extra **pauldrons** go to Mark, who gives them to the player as thanks **regardless of player contribution**. Use real item/currency provenance and transfers; do not mint or duplicate the stolen advance. Exact amounts, item stats, smith/messenger identity and dialogues remain implementation design/balancing details.
- Existing quest ID: `zaginiona-przesylka`; the old outcomes `returned_sealed` / `turned_over_to_guard` and numeric stage indices require explicit save/content-migration review. V1 currently has only rock-den discovery and a two-NPC hand-in, not these expanded consequences.
- **Effort:** preliminary **M–L** (could rise if shared economic/item infrastructure is missing); not runtime verified.

### R37 + R61 — Home cemetery and Kazimierz (approved narrative)
- Merge V1 `zapomniany-cmentarz` (R37) with rewritten V2 Q14 (R61) as **one simple cemetery-care story** at the **home settlement**. Kazimierz, an elderly resident, asks the player to tidy his late wife's grave and a few neighbouring graves. No fence repair, path clearing, generic five-grave quota requirement or new renovation system.
- Physical tidying visibly improves specific graves, persists through save/load and ideally is recognized if done before the request; modest relationship/gratitude is the main reward. Do not silently mark the whole cemetery clean via a journal-only flag.
- Kazimierz is the local caretaker and may **recommend** the player to the village reeve (**Sołtys**), but **does not issue grave-excavation permission**.
- **Home-settlement treasure connection:** V1 `skarb-jaskini-niedzwiedzia` / bear-cave treasure map is bound to a specific grave in the home cemetery (`resolveCemeteryForSettlement(homeSettlementId)`, `mapGraveSpotId`). Sołtys grants lawful permission to excavate **that grave only**. With Kazimierz's recommendation: **no up-front fee**, but the **settlement still receives a promised share of treasure actually acquired**. Without it, reputation governs eligibility/terms; a fee and settlement share may apply, and sufficiently poor standing can result in refusal. Charges go to the settlement treasury, not the reeve. Do not duplicate treasure or tax loot never retained.
- The bear-cave story remains a separate quest, not folded into cemetery cleaning. Existing code currently allows map recovery without this new authorization; permissions, promise settlement and possible unauthorised excavation consequences require technical design.
- **R12 stays unchanged.** Chronicles' cemetery/grave is bound to the archaeologist's settlement (potentially MD/LG) with its own selected caretaker and `grave_access_granted` outcome; do not relocate it to the home cemetery or replace that authority with Kazimierz.
- **Effort:** R37+R61 preliminary **S–M** for care itself; map-grave authorization/share accounting is a separate dependency and effort to scope. Check Kazimierz's stable NPC identity and actual grave binding in current code before implementation.

### Remaining Group 2 records
- **R41/G02:** **Defer** (supersedes previous Add/low priority); four V2 dispute outcomes remain reference only.
- **R42/G03, R47/G08, R51/Q04:** **Defer**, not retire; preserve donor descriptions, do not implement or expand systems for them now.

## Finalized decision checklist — planning follow-up, NOT coding authorization
- [x] R34 full V3 story and two detection routes agreed; optional merchant, recovery branches, voluntary funding/discount and common real-item finale.
- [x] No bespoke arrest, pursuit, investigation or negotiation machinery for R34.
- [x] R37+R61 merge and Kazimierz's late-wife grave-care story agreed; no fence/path work.
- [x] Home bear-cave map grave distinguished from Chronicles R12; keep R12 and its foreign-settlement caretaker unchanged.
- [x] Sołtys grants exact-grave authorization; Kazimierz's recommendation waives initial fee, **not** settlement treasure share.
- [x] R41/R42/R47/R51 deferred, preserving V2 candidates.
- [ ] Technical verification: Kazimierz's stable NPC binding, home grave/landmark IDs, persistent physical tidying, pre-quest work reconciliation.
- [ ] Technical verification: permission effects, save migration/quest IDs, real money and item transfers, settlement treasure-share settlement and handling of treasure returned sealed to Mark.
- [ ] Technical verification: R34 branch timing, messenger fallback, item quality, payer balances and new-save round-trips; respect D4 Performance-First.
- [ ] Prepare an implementation plan only upon separate approval.

**Decision state:** Group 2 narrative direction closed. Documentation only; no source code, historic evidence files, milestones or implementation tasks changed.
