# Quest Revival — Session 1: Anna, Piotr and everyday settlement life

**Created:** 2026-10-28  
**Status:** Group 1 narrative decisions finalized; technical details open. **NOT an approved implementation plan.**  
**Repo:** `jm-sky/seedvale-v1`, `main`  
**Evidence:** [61-record matrix](../2026-10-27--quest-revival-matrix.md) · [runtime findings](../2026-10-27--quest-revival-runtime-evidence.md) · [portfolio analysis](../2026-10-28--quest-portfolio-prioritization.md)  
**Rule:** Latest author decisions override earlier *recommendations*, not underlying code evidence. Existing V1 definition ≠ verified end-to-end playability. V2 record ≠ an authored V1 quest. D4 Performance-First integration freeze remains binding.

Family continuity, physical repairs, a replacement flower-and-honey exchange, caregiving, and small believable errands.

## Recorded author direction by source record
### R01 — Wood for Anna (`drewno-dla-anny`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; series membership undecided**.  
**Player-facing current/donor story:** Anna needs five branches for the communal fence; delivery reserves real repair materials, while NPC work repairs the structure.  
**Discussion boundary:** Improve motivation and state-aware dialogue; determine which wood requests remain separate or become stages in the family series.

### R02 — Wood for Piotr (`drewno-dla-piotra`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction (superseded):** Earlier cart ownership request replaced by the 2026-10-28 final household-fence decision below.  
**Player-facing current/donor story:** Piotr needs five branches for his logging cart. The existing quest references a real `loggingWagon` repair target.  
**Discussion boundary:** Ensure the wagon is visibly present and truly owned by Piotr, with credible repair state and memory of earlier help; ownership and presentation need targeted verification.

### R03 — Wood for Repairs (`drewno-na-naprawe`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; potential wood-quest consolidation**.  
**Player-facing current/donor story:** The player delivers five branches for Piotr's household fence; later repair belongs to an NPC.  
**Discussion boundary:** Keep its real repair sink if retained, but author may consolidate/remove ONE wood quest after reviewing the series. No ID has been selected for removal.

### R09 — Stones for Piotr (`kamienie-dla-piotra`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; weather events permitted when useful**.  
**Player-facing current/donor story:** Piotr needs six stones for the household foundation; materials go into real repair stock.  
**Discussion boundary:** Keep dialogue consistent across the family series. Scripted weather is ALLOWED if later justified, but no storm has been approved for this quest.

### R21 — Message for Piotr (`relay-anna-piotr`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Replace original message premise with flowers → honey**.  
**Player-facing current/donor story:** The current V1 errand has Anna sending a fishing message to Piotr, even if they stand together; the player then returns to Anna.  
**Discussion boundary:** New story: busy Piotr asks the player to gather flowers and give them to his wife Anna. Anna then asks the player to take honey to Piotr. Guarantee a nearby usable hive with bees; define the actual flower/honey sourcing and transfers.

### R23 — Shells for Kasia (`shells-dla-kasi`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance species and dialogue; decoration deferred**.  
**Player-facing current/donor story:** Kasia accepts three ordinary shells, including shells already possessed; source currently accounts for ordinary inventory hand-in.  
**Discussion boundary:** Accept different shell varieties with differentiated responses and better dialogue. Persistent decoration is optional and explicitly not required in the initial scope.

### R26 — Disputed Wood (`sporne-drewno`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Polish; series membership undecided**.  
**Player-facing current/donor story:** The player hears Anna and Piotr's competing fence/cart priorities, chooses who is helped first and may later help the other.  
**Discussion boundary:** Respect real consequences and state-based dialogue; discuss whether it is a series entry rather than one independent quest.

### R33 — Water for Marek (`woda-dla-marka`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Enhance with real water handover**.  
**Player-facing current/donor story:** Marek currently accepts a well visit plus report as 'water delivered'; no filled vessel moves.  
**Discussion boundary:** Make the request believable for a guard on duty. Require filling, carrying and transferring actual water without losing or duplicating containers.

### R38 — Herbs for Anna (`ziola-dla-anny`, V1)

**Maturity:** **V1 implemented in source** (offer conditional; runtime playthrough unverified).  
**Author direction:** **Merge authored herb errand with G04**.  
**Player-facing current/donor story:** Anna currently requests three generic herbs for household stock, with an ordinary item hand-in.  
**Discussion boundary:** Replace/adapt the authored story into treatment of ANNA'S ill child; don't confuse her identity with V2's Dora. Preserve a meaningful gathering interaction.

### R43 — Root by the Stream (`G04`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Adapt G04 narrative into R38/Anna family**.  
**Player-facing current/donor story:** V2 G04 has Dora collecting yarrow, mint and chamomile for ill Toby, with urgency and source-dependent consequences; V1 lacks that authored story.  
**Discussion boundary:** Adapt the richer sickness, specific herbs, treatment and aftermath to Anna's child. Herb types should exist as general crafting materials, not quest-only tokens.

### R50 — A Roof Before Rain (`Q03`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's household roof choices include repair, lean-to shelter and temporary propping; V1 has foundation/fence repairs but not this authored roof quest.  
**Discussion boundary:** Keep for later; a scheduled storm is not forbidden. Design real roof outcomes only when this deferred story is re-opened.

### R54 — Six Bowls, One Pan (`Q07`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2's family supper requires food and attendance choices while people have real duties; the authored story is absent from V1.  
**Discussion boundary:** Keep as a future settlement-life candidate, not a prerequisite for the earlier family repairs.

## Focused session checklist — discussion, NOT implementation tasks

- [ ] Map Anna/Piotr relationships and current family/repair story order; decide exactly which quests form stages and which remain separate.
- [ ] Choose whether to consolidate one wood quest, identify its source ID, and preserve its unique repair/resource sink and old-save outcomes.
- [ ] Verify `loggingWagon` ownership and visible object/repair lifecycle, not just the quest target key.
- [ ] Define R21's flower item(s), availability and actual handover from Piotr via player to Anna; choose where Anna's honey comes from.
- [ ] For R21, guarantee a reachable, usable local wild hive near their home, including bee visibility/representation, and avoid softlocks if the hive is empty, burned or previously harvested.
- [ ] Choose the child's identity, illness progression, genuine healing and herb/crafting catalog for the R38 + G04 merged story.
- [ ] Decide R33's physical water container/transfer and true guard-on-duty availability.
- [ ] Agree minimum shell variants and Kasia dialogue responses; leave persistent decoration optional.
- [ ] Check quest IDs, saves, persistence, NPC identity and contextual availability for the selected family-series structure.
- [ ] Keep R50 and R54 deferred; do not infer a ban on changing weather.

## Session exit conditions

- [ ] Record which choices were actually made, and which still need author input.
- [ ] State the selected gameplay effect and what exists today versus would need new implementation.
- [ ] List source IDs and save/persistence impacts for any proposed merge, rewrite or retirement.
- [ ] Reassess incremental development effort and ROI only for the selected variant.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Preserve final decisions below for future planning after D4 authorization. No coding-agent handoff is approved.

## Final Group 1 author decisions — 2026-10-28

**Status:** Narrative direction finalized for all twelve source records; implementation details below remain open. This is a decision dossier, NOT approval to implement; D4 Performance-First freeze remains binding.

### R26 / R01 / R02 / R03 / R09 — family repair storyline

- **R26 `sporne-drewno`:** Anna advocates repairing a **settlement-owned palisade segment**; Piotr advocates repairing the **fence beside his household**. Player hears both and chooses whose request is first; the other remains available. This is a practical priority dispute, not marital antagonism. Independent relationship gains for the chosen priority and subsequent help, with dialogue remembering actual completed events; no automatic negative relation for going second.
- **R01 `drewno-dla-anny`:** 5 real branches fund a real damaged settlement palisade segment. Repair is performed by NPC work and must visibly restore that segment. Damaged segment has a gap **without collider**; a wolf can pass through it. Repaired geometry/collision must follow the authoritative structure condition; no special quest-only wolf invasion, threat meter, timer, or additional AI system.
- **R02 `drewno-dla-piotra`:** repurpose to 5 branches for Piotr's **household fence**, with the real fence material sink and subsequent NPC repair. It no longer repairs the `loggingWagon`.
- **R03 `drewno-na-naprawe`:** consolidate/retire as a separate offered wood errand; its **household fence, repair condition, materials and NPC repair are preserved under R02**. Preserve/migrate old quest progress and terminal outcomes deliberately; never silently reinterpret stage indexes or duplicate repair reservations. The previous specific requirement that Piotr own a working logging cart is superseded: no cart ownership/use mechanic is required by this storyline; existing cart props need not be removed.
- **R09 `kamienie-dla-piotra`:** follows completion of the **household-fence repair storyline**, as a sequel, with 6 real stones for `residentialFoundation`; keep NPC repair and state-aware dialogue. Exact trigger (hand-in vs physically completed fence repair) is not yet selected; do not imply completion of material delivery equals completion of NPC repair.
- **Preservation:** Existing V1 source has `communalFence` targeting a pasture-fence segment or fallback, not confirmed as a palisade. New target must be grounded in an actual settlement palisade and its collider/condition lifecycle verified. Existing repair bridge maps R02 to `loggingWagon` and R03 to `householdFence`; rewiring is needed, not already implemented. Maintain durable entity identity and save compatibility.

### R21 — Flowers and Honey (`relay-anna-piotr` rewrite)

- Available after **first meaningful help to Anna or Piotr**, not after all repairs. Exact eligible outcome/event is a technical selection.
- Busy Piotr asks player for **5 actual gatherable wildflowers** to hand to Anna. Anna responds warmly and with humor; dialogue references earlier repairs when applicable. She then asks for **1 actual honey** delivered to Piotr. They both remember the reciprocal gift, with modest relationship recognition rather than a large material reward.
- Guarantee a reachable, working hive with **visible bees** near their household. Reuse V1 wild-hive production, harvest, and sting-risk systems. Do not add autonomous bee-agent simulation. Handle empty/previously harvested/destroyed hive without quest softlock; use real inventory transfer. `wildflower` item kind, exact gathering sources and hive fallback details remain design recommendations/technical choices, not approved identifiers.
- This is independent of the child's illness. Avoid incongruous gift dialogue during active serious family concern, but do not lock illness progression behind R21.

### R38 + G04 — sick child (`ziola-dla-anny` adapted with V2 G04)

- Anna and Piotr's child is a **full NPC**, aged approximately **10–18** (specific age, name, occupation remain open); active schedule and lightweight work continue during illness at reduced efficiency. No mandatory bedridden animation/mechanic.
- **Mild**, persistent sickness: no death, permanent injury or escalating catastrophe. Recovery restores normal activity/efficiency; family and child remember assistance.
- One illness quest may start **one in-game day after R21 completion**, with independent fallback **2–3 days after game start** (exact fallback day still open). Whichever condition occurs first offers the same incident once, using deterministic/persisted scheduling and no duplicate trigger. R21 is an accelerator, never a prerequisite.
- Specific medicinal plants: **yarrow, chamomile, mint**, as ordinary reusable gatherable/crafting items, not quest-only tokens. Player may either bring ingredients for **Anna to prepare treatment** or craft medicine and deliver it. Actual medicinal effect required.
- High `medicine` skill offers contextual dialogue/actions **before or after** the herb/medicine hand-in: suggest compresses, or at a higher threshold personally use medicine on the child to alleviate symptoms. Distinguish symptom relief from definitive treatment; proposed differentiation, thresholds and exact mechanical effects need technical validation. Reuse existing skill/interaction capabilities wherever possible.
- No new general disease simulation is authorized. The effect should belong to stable NPC state and persist without relying on loaded visuals.

### R23 — Shells for Kasia

- Keep a real inventory hand-in of **any three shells**, including mixed varieties. Target **three varieties**, with Kasia's reactions differing by kind/rarity, not three mandatory distinct shells. Exact item identifiers, spawning rates and rewards are technical design choices. **House decoration deferred.**

### R33 — Water for Marek

- Marek requests actual water while plausibly **on guard duty**. Player collects water at a real source, carries it in a filled container, and genuinely hands it over; no fictional well-visit-only completion or duplicated/lost containers.
- **Container method deliberately flexible:** default preference is the player's existing `waterskin` if easiest with current item model. A unique **Mark's waterskin** provided by Marek is acceptable if technically simpler, but NOT required. Decide from existing item/custody/transfer mechanics; do not add a parallel container subsystem solely for this quest.

### R50 / R54 — deferred

- **R50 A Roof Before Rain** and **R54 Six Bowls, One Pan** remain deferred V2 story candidates. Weather manipulation is permissible in principle but no scripted storm or roof/supper implementation is approved.

### Effort and priority — provisional relative estimates

| Cluster | Effort | Priority | Key incremental work |
|---|---|---|---|
| R26/R01/R02/R03 | L | high within Group 1 | Physical palisade damage/collider, ownership/repair sink remapping, branching and save migration |
| R09 | S–M | medium | Sequel availability tied to real fence work and context |
| R21 | M | medium | Gatherable flowers, two transfers, local hive/bees, fallback and dialogue |
| R38 + G04 | L | medium | Stable child NPC, illness/efficiency, herbs/crafting, medicine options and scheduling |
| R23 | M | low–medium | Multiple shell items, acquisition and dialogue |
| R33 | S–M (potentially M) | medium | Existing water container viability, real transfer and guard availability |
| R50 / R54 | deferred | deferred | No active scope |

These are **incremental estimates, not verified engineering sizing**; source/runtime research and save migration can alter them. No work is authorized during D4 freeze.

### Remaining open implementation-facing questions (no need to re-ask settled narrative decisions)

- Verify which actual palisade segment, damage/collider rebuild and NPC repair ownership can supply R01 without breaking streaming or offscreen simulation; do not confuse pasture fence with palisade.
- Decide R09's precise trigger on delivered materials versus physically repaired household fence, with world-state fallback; maintain R26/R01/R02 outcome IDs or explicit migration for saves, including retired R03.
- Define robust offer pacing, existing-world damage seeding, and deterministic target IDs; check concurrent repairs and pre-repaired outcomes.
- Select real flower item/source, hive positioning and empty/burned-hive contingency, and actual transfers.
- Specify child's stable NPC identity, age/name/duties, illness scheduling persistence, medicine thresholds/crafting recipe and whether existing skill actions support treatment without a new general subsystem.
- Identify current shell and waterskin/container APIs, then choose minimal truthful adaptations for R23/R33; preserve water ownership and Marek's guard schedule.
- Confirm dialogue/relation consequences, rewards and world effects in new saves and existing in-progress saves; do not claim runtime verification from static inspection.

### Session decisions checklist (design closure, NOT coding tasks)

- [x] Choose R26 priority structure and real physical consequences.
- [x] Consolidate R03 into R02 while retaining the household fence.
- [x] Keep R09 as sequel after the fence storyline.
- [x] Choose R21 timing and flower/honey exchange with context-sensitive humor.
- [x] Choose full child NPC, mild illness, independent timed fallback, both medicine paths and skill options.
- [x] Select R23 three interchangeable shell varieties; defer decoration.
- [x] Require R33 physical water transfer, with flexible container ownership.
- [x] Keep R50/R54 deferred and D4 freeze.
- [ ] Validate implementation-specific targets, lifecycle, item APIs, migration and tests when planning is authorized.
