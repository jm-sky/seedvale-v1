# Quest Revival — Session 3: Hunters, fauna, wolves and livestock

**Created:** 2026-10-28  
**Status:** Wolf-series, R20, G01/R36, R05, R07 and R08 author narrative decisions recorded 2026-10-28; technical verification and other Group 3 items remain pending. **NOT an approved implementation plan.**  
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
**Author direction:** **Defer · low priority** (author decision 2026-10-28).  
**Player-facing current/donor story:** V2 Q01 offers observation or hunting of a rare hare with an experienced hunter; V3 retired it for a simpler fox hunt.  
**Discussion boundary:** Preserve the rare-hare/mentor scenario as a low-priority future candidate; no implementation scope is approved. Do not interpret V3's historical retirement as a V1 retirement.

### R49 — The Hollow Below the Road (`Q02`, V2)

**Maturity:** **V2-only story** (not authored in V1).  
**Author direction:** **Defer**.  
**Player-facing current/donor story:** V2 Q02 presents a sow with piglets below a road and options to clear the den, reroute traffic or keep watch.  
**Discussion boundary:** Keep for later real navigation/guard/animal-family effects.

## Approved wolf-series decisions — 2026-10-28 (R06, G07/R46, R30, R31, R32)

**This section supersedes the earlier provisional discussion boundaries for these five source records.** It is author-approved narrative/scope direction, not an implementation plan or proof of runtime behavior.

### Story and structure
- **R06 `grozny-wilk` + V2 G07/R46** become **one authored Greybeard case**, not two named/dangerous wolves. Greybeard is the distinctive, old, solitary wolf with stable identity and a separate resting place. The dog's death and Jacob's family stake may inform dialogue, but the elaborate V2 clue investigation is **not mandatory**.
- **Anna or Jacob can independently offer the SAME case** with potentially different relation/reputation prerequisites. Accepting from either must preserve contextual dialogue with the other; they may both reward distinct contributions without duplicate main renown. Exact eligibility thresholds, item provenance and Jacob's personal reward are not yet decided.
- **Greybeard must die** to resolve the case. Sword, bow, traps and poison can be means of death where real mechanics exist. The V2 nonlethal drive-off ending is **removed**. Poison must not be promised as already implemented; avoid building a bespoke quest-only poison subsystem. Greybeard must not respawn or lose identity on stream/save/reload.
- **After Greybeard dies**, the larger settlement-threatening pack activates **on the following night**, as a saved, once-only story transition. This deliberately **replaces V1's unconditional day-2 activation gate** for this authored incident. Story flags are acceptable as triggers; actual pressure, wolves, trips, combat and habitat state belong to authoritative fauna simulation. **No real wolf migration/territory system required.**
- Greybeard has his **own resting place**; the larger pack occupies the **existing V1 `wolfDen`/`WOLF_DEN_ID`**, not a new third den. At activation, even an *earlier*-destroyed wolf den is **restored/reoccupied once at night**. After the new-pack incident starts, player destruction must remain permanent. Preserve actor/spawner identities, no double spawn on reload, and reconcile older saves.
- **R30 `wilcza-jama` is consolidated into R31 `wilki-pod-osada`**, not maintained as a separately paying quest. The combined settlement case requires killing/clearing the bound pack and **permanently destroying its habitat**. Keep clearing vs destruction as distinct *physical states*, but not separate quest payouts. Preserve authored and generated `world:wolf-den-pressure` claims over the same real incident without duplicate exclusive work or renown.
- The pack must **really approach and threaten the settlement**. Group 1's approved damaged-palisade collision gap allows wolves through; repair improves safety but does not automatically remove the pack. The existing V1 fauna pressure/trips should be reused and the `frenzyWolf` test behavior **still needs targeted verification** (not claimed checked here).
- **R32 `wilki-u-kupca` is Kasia's distinct dialogue/pre-agreed offer on the same physical R31 incident**, not a second pack or an extra den-destruction mission. The player **must accept Kasia's offer before den destruction**. Reward: transfer one actually existing, reserved merchant horse, plus Kasia relationship, **without another large renown award**. Preserve real ownership transfer, death/unavailability `horse_lost` branch, and save/load. No retroactive horse offer is authorized.
- **Rewards:** Anna's Greybeard reward retains the V1 Damascus sword plus public recognition (main renown once); Jacob may grant a distinct personal reward/relationship. R31 grants a single main reward for protecting the settlement; R30 grants **no separate payout**. The `obsidian_sword` is **removed from R30 reward** and retained only as a *candidate* for a later hidden treasure (not approved placement, cave or new quest).

### Earlier V3 curation vs selected V1+V3 hybrid
V3 had (1) a full personal Greybeard investigation with kill/drive/poison choices, (2) a **separate** short R06→R30 wolf-and-den thread, and (3) a larger settlement pack R31/R32 after Greybeard, with narrative territorial displacement. The approved hybrid **keeps** Greybeard-before-pack, the personal Jacob angle as optional dialogue, one shared settlement/merchant problem, and no required ecological migration. It **changes** R06 into Greybeard itself, removes the second wolf and mandatory investigation/drive ending, folds R30 into R31, replaces the day counter with a nocturnal story gate, reuses a physical V1 den (one-time renewal if previously destroyed), and removes the arbitrary obsidian reward.

### Open technical/story details — not additional approved decisions
- Whether a Greybeard killed **before accepting** R06 can later be reported/credited (assistant recommendation: yes; author has not voted).
- Exact Anna/Jacob offer gates and Jacob reward; how two conversations credit once while paying distinct earned entitlements.
- Poison/trap availability, fairness and species-wide mechanics (not an approved requirement to build for this story).
- Kasia's horse dies/unavailable before handover: preserve current failure/no resurrection, but any compensation is undecided.
- Exact handling of nocturnal activation across time skips/unload, previously burned den, existing inhabitants, old saves and resuming active quest IDs. Reconcile without adding a parallel fauna system.
- Whether R31 requires an explicit offer before the player preemptively clears/destroys the newly activated den; completion should reflect real world state, not invent another pack.
- Exact reward values and alternative source for the obsidian sword remain open; no implementation tickets authorized.

**Preliminary size:** overall wolf redesign **L**; principal technical risks are named-fauna persistence, one-time den renewal, quest-ID/save compatibility, and shared incident/horse reward arbitration. No runtime or performance claim is made.

## Approved R20 Rat Plague decisions — 2026-10-28

**Author-approved gameplay direction; NOT implementation approval.** This section supersedes R20's earlier provisional discussion boundary. Preserve V1's authoritative infestation mechanics rather than replacing them with quest-only flags. Historical V3 curation (2026-10-10) calls for one guaranteed home-settlement plague with systemic damage, nests/rat population, optional Rat Alpha and optional poison. The author has **expanded** that scope with a **mandatory** boss, physical warehouse interior, universal manual player-door interaction, poisoned-meat crafting and local social liability.

### Place, access and encounters
- Guarantee an infestation in the player's home settlement. Add a **real warehouse building with traversable interior** (author final choice, not a fenced-yard substitute), fitted with storage/crates and real structural repair requirements. Reuse V1 building/interior technology; source/runtime wiring must be inspected before assuming it is ready for this exact use.
- **All buildings** switch from automatic opening to **player-initiated door interaction**, not just this warehouse. This is a general game-system design decision and must respect NPC navigation, door/lock states, collision, streaming and saves; do not assume all NPCs must manually click doors.
- Warehouse access requires **permission from Marek (guard)**. Model access separately from door-open interaction; exact handling of trespass, locks and NPC access remains technical design.
- **1–2 nests inside warehouse plus 1–2 elsewhere in the settlement**, all tied to the same physical infestation incident, not independent quests. All must be destroyed. Distinct stable nest identities and persistence are required.
- **Rat Boss is a real, persistent animal from the beginning**, not spawned by a reveal trigger; it must **die** to finish R20. Sword/bow/poison or other actual damage sources may kill it. It should be normally visible on entering the small room (provided real LOS), not artificially concealed until a scripted discovery. Threat to its nest **provokes defensive attack** using existing habitat-defense behavior where reusable. No bespoke multi-phase boss or obligatory sneaking investigation.
- Actor occlusion/player perception behind walls is a **general V1 feature candidate** informed by V3's planned `MAP-02 Sensory Actor Visibility`, not a special R20 invisibility flag. Validate donor implementation status and current V1 systems before adaptation. Simulation owns detection; UI/render/targeting consume it, performance bounded (no per-frame all-actor LOS).
  
### Poisoned meat, risk, and responsibility
- Author requires **player crafting of poisoned meat**, placed as an **actual physical bait item** that animals can consume according to diets. Poison takes effect through real animal state and may kill Rat Boss. A generic fauna/items/crafting capability, not a button that executes a quest kill or an R20-only exception. Current `docs/STATE.md` lists full player-side crafting as not implemented; recipe and systems availability require recon.
- **Any animal able and willing to eat this bait may be harmed**, including domestic dogs and appropriate livestock only if their food preferences permit it. No species-based quest immunity.
- **Only bait placement *inside a settlement*** triggers the special warning obligation. Player must warn **Marek (guard) AND at least one settlement resident**, **before placing the first poisoned bait in that settlement incident**. Making/carrying bait is not placement. Outside settlements there is **no warning-based reputation penalty**; physical poison can still harm animals.
- Missing either warning causes **one base reputation penalty for the incident**, not one penalty per bait; actual attributable harm can trigger **additional, separately balanced consequences**. Warnings can cause real risk-reducing NPC/animal behavior, **never magic poison immunity**. Values, attribution and resident warning behavior remain for technical/social balance. This is optional advance warning, not a hard block on placing poison. Be precise about settlement boundary/identity; no arbitrary radius around Marek.

### Completion and population lifecycle
- Completion requires **all**: Rat Boss dead; **all incident nests destroyed**; warehouse really repaired; **at most one living ordinary rat physically present in the settlement** (same V1 count threshold, but local scoped). Rat Boss cannot be counted as the permissible survivor.
- Rats in forests/other settlements **do not block**. Rats present in the settlement but outside current rendering/streaming **do count**; avoid disappearance-based false completions. Author explicitly rejects chasing far-away rats or a counter that counts unloaded animals as absent.
- Prevent generic rat **respawn/replenishment from immediately defeating progress**: once nests are destroyed, their incident replenishment stops; after resolution provide a **temporary local protection/cooldown** before ordinary ecology can produce new rat pressure. The author requires a practical pause but has **not fixed its duration**. Never re-spawn Rat Boss or reconstitute completed R20 automatically; later independent infestation must have separate incident identity. Do not globally disable rat ecology.
- V1 already uses `resolve_storage_rat_infestation` + `settlementRatInfestationSnapshot` with `exists`, `storageDamaged`, `nestDestroyed`, `aliveRatCount <= 1`. The new criteria need migration to an authoritative multi-nest, named-boss, spatially filtered count and spawn lifecycle. Absence of registry does not count as completion. Preserve stable quest ID `plaga-szcurow` and reconcile old saves/accepted quests.

### Not yet decided / implementation verification
- Exact warehouse model/placement, door interaction and permission UX, NPC/animal traversal, and system ownership.
- Stable nest/boss identities, habitat defense AI reuse, settlement spatial boundary and offscreen counting, migration of old one-nest state, and whether a future independent infestation may recur.
- Crafting recipe ingredients, poison potency/onset, diet/eating mechanics, poison item ownership and placement, warning propagation and attribution of harm; no existing general poisoned-meat crafting has been verified.
- Protection/cooldown duration, specific reputation amounts and other balancing numbers. No invented values.
- Testability/performance of world perception, physical occupancy and saved quest state; V3 `MAP-02` is `planned`, not proof of working V1 functionality.

**Preliminary effort:** **XL** inclusive of general manual doors, actor perception, warehouse, multi-nest ecology, boss and player-crafted poisoned bait. Not a verified estimate or authorization to code. D4 Performance-First integration freeze continues.

## Focused session checklist — discussion, NOT implementation tasks

- [x] Decide Greybeard identity/story order and lethal-only outcome; R06+G07 one case, R30 merged into R31 (details above).
- [ ] Verify actual `frenzyWolf` test/simulation behavior and select when wolves approach the settlement without creating an artificial story-only spawn system.
- [x] Select physical clear + permanent destroy within one R31 case, no R30 payout, one main renown per distinct accomplishment; technical arbitration remains to implement.
- [x] Preserve Kasia's pre-destruction horse contract, ownership reservation and existing death branch; exact runtime verification pending.
- [x] Approve R20 warehouse interior, mandatory Rat Boss, multi-nest/local-count completion, poisoned-meat risk and warning/reputation contract (above); technical verification and balancing remain open.
- [x] Decide G01/R36: dedicated home shepherd owns persistent Pip; Piers stole it before play; four recovery routes, reconciliation, residence and real camp cleanup; generic livestock loss remains intact.
- [x] Record R48 decision: **Defer · low priority**; no implementation work authorized.
- [x] Decide R05 meadow boar, herbalist/Anna fallback, optional unpaid real hunter combat and reward attribution; preserve ecology and hunter profession.
- [ ] Assess reload, streaming and persistence of identified fauna and active player quests.

## Session exit conditions

- [x] Record selected wolf-series decisions separately from remaining author choices (Group 3 not yet finished).
- [x] Describe selected wolf gameplay and reuse/new scope; implementation and runtime validation pending.
- [x] Record R06/G07, R30/R31, R32 identity/save compatibility impacts (engineering migration details pending).
- [x] Record preliminary wolf-series L effort, no detailed estimate until implementation recon.
- [ ] Keep deferred stories deferred and D4 runtime integration frozen unless separately authorized.

**Next step:** Group 3 narrative decisions for G01/R36, R05, R07, R08, wolves and R20 are captured below; unresolved technical/reward details remain planning inputs, not approved implementation. No plan or coding-agent handoff is approved by these checkboxes.


## Approved G01/R36 Lost Lamb decisions — 2026-10-28

**Author-approved narrative/scope direction, not implementation approval.** Replace the authored V1 `zagubiona-owca` story with the V2 G01 theft of Pip, while retaining independent systemic livestock-loss episodes. One incident must not generate duplicate exclusive claims or rewards. Pip is one real, persistent young sheep from the **home settlement shepherd's household** (male/female shepherd and name undecided; Molly is only a donor placeholder). If staffing does not guarantee a shepherd, resolve that during world generation rather than creating quest-only livestock. Do not silently change Anna's profession.

- **Pre-existing event:** The theft occurred before the player arrives. World initialization places Piers and Pip physically at an already generated roadside camp; the shepherd is missing that particular animal. Do not simulate the theft trip or teleport the sheep upon quest acceptance. Preserve Pip's stable identity and legitimate ownership distinct from Piers's current custody. No quest-only animal clone.
- **Piers:** a hungry traveller with his own real needs, food, water and finite stock. Initially confined to a viable roadside campsite rather than requiring an unverified general world-travel survival system. His survival and any future departure depend on real needs/resources, not a quest timer or immortality. Pip's needs and survival also remain real. Death remains consequential; no respawn solely to complete G01.
- **Camp:** use a **branch lean-to/shelter (szałas), NOT a tent**, a stone-ring campfire with longer fuel burn, physical wood/branches, food and water, sleeping place and space for Pip. Piers actually adds finite fuel and consumes supplies through NPC behavior. Existing fauna fire-avoid behavior is helpful, not absolute safety; stone-ring burn-time and all resource actions require source verification.
- **Recovery:** preserve four meaningful routes: (1) confrontation with evidence, (2) payment with real money transfer, (3) discreet retrieval with meaningful detection, (4) requesting guard Marek's intervention with evidence. Pip must physically follow/be led back to its owner, no quest-flag teleport. A recovery route does not mechanically dictate Piers's ultimate fate. Accidental/external death and loss require truthful outcomes, not false recovery credit.
- **Reconciliation:** available after different peaceful routes, including after payment, **only if Piers admits theft and agrees to restitution**. After reconciliation the shepherd **always accepts** him to the household; no additional random reputation gate. Acceptance should be made physically feasible (real bed or provisional sleeping place, real household food/water). Piers is a **resident/worker, not automatically a family relative**, and retains his own `npcId`, inventory, needs, relationships and history. Temporary real work at the household may lead to permanent residence and, later, his own house/household when settlement systems permit. Independence is not a quest completion requirement. Piers may otherwise remain independent and eventually leave if world travel is viable.
- **Camp dismantling:** after moving in, Piers **actually collects personal belongings, moves useful items, and dismantles the lean-to as NPC work**. Recovered branches may remain on the ground as actual resources; the stone fire ring can remain and die out naturally. Do not erase the camp instantly by quest flag. Preserve intermediate dismantling state through save/load and offscreen rebuilding; don't require rendering every twig.
- **Rewards:** modest local reputation/relationships and realistically sourced money/wool where applicable, not invented infinite stocks; precise values and dialogue pending. Use one main payout per real incident and track different legitimate contributions.

**V1 gaps/verification:** `Household`, NPC authoritative state, profession work, fauna, animal leading and player-employer work contracts exist, but **NPC-employer contracts, outsider residency in an existing household, later independent household creation, general campsite construction/dismantling, stone-ring burn and Piers's sustained supply behavior are not verified as ready**. Avoid parallel quest-only systems. Preserve NPC/animal identity, quest progress, ownership and incidents through save/load. Initial version must not rely on general dangerous cross-world NPC travel.

## Approved R05 Medicinal Meadow Boar decisions — 2026-10-28

**Rewrite the authored narrative, preserve V1 ID `dzik-przy-szlaku` subject to save compatibility.** Marek remains quest giver; no longer assert a blocked road. A **single concrete, persistent, ordinary boar** threatens a **real herb meadow/clearing** and its real herb-gathering activity. The boar already inhabits the place, is not created on offer, and is not a custom boss. Other boars cannot complete the case. No mandatory tracking phase.

- **Affected NPC:** a living professional `herbalist` of the home settlement, if present; otherwise **Anna** as farmer fallback without changing her profession. If a herbalist dies *before the incident binds*, Anna can fill the role. Once the quest binds an NPC, avoid changing it on reload. Anna needs a bounded real occasional household herb-gathering opportunity rather than a fake permanent herbalist role.
- **Hunter assistance:** the player can ask **any available home-settlement hunter** (not a fabricated named companion); participation is **unpaid**, a shared local interest. Hunter follows by existing NPC accompany behavior and engages the **same bound boar** through generic NPC combat and actual weapon/ammunition, not scripted proximity credit. Hunter may be wounded, flee or die. If helper deals final blow, completed shared hunt still counts. If invited but never actually fought, do not credit assisted combat automatically.
- **Attribution:** full solo reputation for actual solo player success, lower combat reputation for real joint effort, possible conditional personal relationship gain with assisting hunter. No duplicate primary reward. External animal death or death before offer resolves the factual problem without claiming the player killed it or magically respawning the boar.
- **Ecology:** boar removal solves this incident, **not** all safety on the meadow; existing destination-threat assessment evaluates other predators. Real herbalist work can resume if safe. Retain realistic dialogue, adjust V1 defense-book/renown/relation rewards later. Current `renown >= 10` offer prerequisite is *not automatically approved* by the author.

**V1 integration risks:** identity/persistent habitat, actual hunter-target combat and attribution, accompany commitments, Anna's non-professional herb routine, materialization/save/reload; no new `QuestHunterCombat` subsystem. The full legacy plan 070 is a design reference, not an automatically approved technical dependency.

## Approved R07 Circle of Hunters decisions — 2026-10-28

- Keep **Hunter I–III progression**; `hunter_iii_complete` then conversations with master, trophy hunter and ambitious member suffice for joining, with **no second test or reputation gate**. Preserve the terminal membership outcome `hunters_brotherhood_joined` and the same inviter and master in R08.
- The home settlement has a hunter (author-established world constraint) who invites the player. The four-person circle is drawn from home and a nearby settlement: inviter, master, trophy hunter, ambitious member.
- **Generate/qualify credible roster at world generation**, rather than assigning master/trophy/ambition to arbitrary adults when the quest triggers. Members may have profession `hunter` **or other real jobs with genuine hunting experience**; do not relabel their actual professions. Master is an experienced member in the neighboring settlement. This does NOT mean current V1 source already guarantees four suitable candidates.
- Extend the existing deterministic `resolveHuntersBrotherhoodBinding` selection and preserve IDs, membership and personal backgrounds across save/rebuild. A minimal, reusable hunting-experience record is a candidate, **not yet a specified or approved data schema**. Do not require four newly spawned NPCs or a parallel guild advancement ladder.
- The circle is a continuing social relationship, not a second profession. R08 is its follow-up, but may not be immediately available if no unhealthy habitat actually exists.

## Approved R08 Troubling Hunting Ground decisions — 2026-10-28

- Keep the existing post-R07, **conditionally materialized real deer-habitat investigation**. The same bound master asks the player to investigate; do not manufacture unhealthy ecology, an artificial crisis, or a mandatory repair stage.
- **Scope: reconnaissance and diagnosis only.** Player examines the real site via existing `interact_spawner` and **uses the already-existing in-game distant animal observation** to look at a deer where available. No new tracking, forensic clues, investigation skill or required long-term monitoring. **If no live deer exists, absence must not block reporting**; the habitat diagnosis is the required fallback.
- Persist actual habitat observation at examination time and report it truthfully even if the live state has since changed. Distinguish observed population loss, mortality, predator pressure and food shortage from proven causes. Resolution does **not** flip a `meadowSafe` or habitat-fixed flag and does not artificially rebalance ecology.
- The current source `huntersBrotherhoodInvestigation.ts` already chooses unhealthy deer thickets and records `QuestHabitatPressureObservation`. The **existing animal-observation feature is confirmed by author**, but the exact event/animalId hook into `QuestManager` requires targeted code verification. Avoid assuming an automatic quest credit path already exists. No required ecological intervention in R08; later stories can address solutions separately.
- Keep rewards modest and sourced as appropriate; exact deltas, observation UX, empty habitat, change-during-investigation and save/load scenarios await technical design.

**All four discussions above are closed at the narrative level, not implementation-ready specifications.** Do not write gameplay code or queue implementation during the D4 freeze without separate approval.
