# SeedVale V1 Revival — Quest Portfolio Reconciliation Recon

**Created:** 2026-10-27  
**Author:** Codex  
**Status:** Advisory research and decision preparation; **not an approved implementation plan**.  
**Author-approved direction:** **A — V1 preservation-first**. No individual migration, merge, retirement, rewrite, reward or architecture decision is approved by this report.  
**V1 evidence pin:** `3e7e7dc07625bd51fc5b8a5560baed3d386efec8` (`main`); **live V3:** `907e17cd2ad487547a25a1f928b2770348183d75`. Donor archive provenance: `199f98e2`.  
**Freeze:** approved D4 Performance-First remains binding; this change contains documentation only.

## 1. Verdict

**Use V3 as a narrative donor, not as a replacement portfolio or quest engine.** Current V1 already implements counterparts for **all 39 V1 source records**, including records V3 merged or retired. V2's **22 records** are new-story candidates for V1, not 22 repairs to existing content. Existing source definitions, conditional world placement and actual end-to-end playability are different facts.

The complete [61-record matrix](./2026-10-27--quest-revival-matrix.md) preserves the historical **3 keep / 48 rewrite / 4 merge / 5 retire / 1 defer** accounting, explains each decision's documented rationale and confidence, and supplies a provisional recommendation and precise author question. The [runtime evidence companion](./2026-10-27--quest-revival-runtime-evidence.md) identifies **14 additional inventory entries** covering generated families, progression continuations and selected stories outside the 61. These are not fourteen additional playable quests.

There is **no evidence-based case for replacing V1 QuestManager**. It already handles bounded branching, all/any objectives, explicit speech/reporting, current-state reconciliation, physical story items, stable NPC identity, contextual generation, journal/history, relations, reputation and persistence. V3's live portfolio is still documentary curation, with its quest engine/authored content deferred to M7. V3 exploration leads and conversation implementation are separate capabilities, not proof that the 61 curated quests run.

## 2. Why the old decisions must be reinterpreted

| Earlier decision or gate | Documented reason | Classification / confidence | What it means for V1 |
|---|---|---|---|
| D-QUEST-20 parcel → family fraud/gift | Protect Kate's honest characterization, concrete evidence, two meaningful branches and personal finale | Quality / high | Attractive creative replacement, but substantially larger than current privacy-versus-guard dilemma; author must choose which agency to preserve |
| D-QUEST-22 wood priority | Both repair requests survive, real separate targets, early help, second-help timing | Mixed / high | V1 already has four real repair sinks and both priority paths. Do not reimplement them because V3's repair supplier was late |
| D-QUEST-23 simple fox and Q01 retirement | Author explicitly requested one simple fox hunt and rejected apprenticeship/two-fox elaboration | Quality/product simplicity / high | Not evidence of time pressure or that white-hare mentorship is poor. Simple and rich quests can coexist; retaining Q01 independently is an author choice |
| D-QUEST-29 cemetery merge | One coherent care incident, personal motive, quiet help, lawful grave access separate from desecration | Quality / high | Consolidation only if actual cemetery/purpose matches. Existing grave-permission outcome is a dependency, not disposable filler |
| D-QUEST-32 herbs retirement/G04 | Farmer Ann differs from Dora; generic restocking delegated to future economy, reject special caregiving/hemlock machinery | Quality with explicit economy limits / high for text, medium for alleged duplication | Ann's current errand is household stock, not a claim she is a herbalist. G04 and future stock requests do not currently replace it in V1 |
| D-QUEST-35 Old Ruins retirement | Explicit standalone retirement; independent ruins discovery survives; no causal rationale supplied | Unknown / low on motive | Could be sensible pruning, but neither low quality nor schedule economy is established. Losing a quiet NPC exploration lead is a real tradeoff |
| D-QUEST-38 roof and storm | Three household repair episodes; guaranteed global storm 1–3 days after actual foundation repair | Mixed / high | V1 has repairs, but forced post-repair weather is still a new shared-world contract. It is not a low-cost dialogue enhancement |
| D-QUEST-40 Q08 defer | Final choices postponed until livestock/water/construction capabilities are designed | Architecture / high | Re-evaluate actual V1 suppliers; neither delete the story nor assume wells alone implement its benefit. Rota still undecided |
| D-QUEST-44 batch of 15 | Fourteen narratives retained, one care merge; legacy amounts/mechanics/cast not approved, scope deferred | Mixed / medium per record | A broad retention/scope reset, **not fifteen findings that current V1 is defective**. Specific new script/motivation is often absent |
| D-QUEST-45 Q10 and treasure direction | Avoid a second mine economy; retain generous treasures, no mandatory bespoke boats/seasonal water/inn | Mixed / high | Preserve real V1 mine foundations and optional narrative ideas. Integrated V1 mine quest is still planned |
| quests--004 and Q3 shortlist | Smaller first-playable M7 set, later M8/M9/M10+ suppliers, score by missing supplier groups | Economy + V3 architecture / high | **Do not carry the shortlist or supplier scores into V1 as content priorities.** Already working V1 capabilities do not need to wait for V3 milestones |
| D-QUEST-16 / later D-QUEST-46 | Shared incident/claim policy and distinct legitimate rewards; autonomous resolution selected per story | Architecture/coherence / high | Reuse existing authorities, extend actual gaps. Do not import an entire new incident framework or let every NPC consume adventures before the player sees them |

Sources: staged [Q-012](../../../docs/v3-donor/quests/decisions/quest-curation-and-q-012.md), [024](../../../docs/v3-donor/quests/authority/2026-10-09--024--quests-v1-v2-consistency-review.md), [094](../../../docs/v3-donor/quests/authority/2026-10-14--094--v1-v2-quest-curation-independent-final-review.md), [quests--004](../../../docs/v3-donor/quests/authority/quests--004--curated-portfolio-to-playable-quests.md), [Q3 supplier register](../../../docs/v3-donor/quests/canon/q3-preliminary-candidates.md), and individual linked decisions in every matrix record. Classification is interpretation of explicit text; private historical motives are not reconstructed without evidence.

**The strongest implementation-economy evidence concerns staging and narrowing delivery, not most retirements.** It would be incorrect to say “V3 retired five stories only to save time.” Q01 reflects an explicit simplicity preference; Q10 avoids a competing mine line; the precise Old Ruins reason remains unknown. Conversely, Q06 solo-first, optional G05 deferral, later Q03 storm, delayed mine-colony and omission of unsupported world effects are explicitly supplier/cost choices. They must not erase V1's existing mechanics.

## 3. Most attractive improvements

### High-confidence opportunities

- **Preserve real behaviour while improving the explanation.** The four repair requests already use real stock/structures, both wood priorities remain possible, and ordinary NPC work follows delivery. Much of V3's desired depth is already V1 functionality. Better motivation/copy is an enhancement, not a port of a new repair engine.
- **Truthful short errands.** On-duty guard water should actually involve bringing water; shell handover could leave a lasting doorstep memory. Both are strong narrative ideas, but physical vessel/decoration/funding are real additions. Current shell collection already accepts existing inventory at hand-in.
- **Scouting with a purpose.** Distinguish forestry access from road safety, share one true observation when appropriate, remove arbitrary mountain-stone/stag proof. Current `zwiadowca` final report can claim a stag even after the honest “didn't see” route: a concrete content inconsistency, not grounds for replacing the engine.
- **Protect existing physical investigations.** Missing Hunter's exact bow, Old Bones' signet, Bandits' marked property, Suspicious Transport's evidence and Lost Expedition's journal already support choices. Strengthen character voices/evidence instead of flattening these to generic quest flags.

### Conditional opportunities

**G03 Night Torches**, **G08 Well and Rumor**, **Q04 The Handle Remembers/G02 Rusty Debt**, **Q05's misleading old map**, and **Q07 Woodward supper** offer especially distinctive family/social/investigation material. Their value is portfolio variety and continuity, not ease of implementation. They are new V1 content and require casting and truthful world effects. Do not import V2 teleporting/holding NPCs, invisible proximity clues, timer-funded conclusions or abstract companion attacks.

**Parcel fraud, stolen tower cache and shipwreck rescue** could substantially improve thin V1 premises. The parcel replaces a meaningful existing privacy choice; the tower replaces a quiet empty-place discovery; the wreck adds injuries, rescue windows and mixed cargo ownership. These are consequential creative choices, not automatically superior versions.

**Q12** can supply a memorable exceptional weapon with history and alternate destinations. Keep its sword distinct from the selected former-adventurer elder's owned sword. Generosity is allowed; no automatic high-value loot nerf follows from Review 024's same-den reward concern.

### Major design tradeoffs

- **Authored protection versus independent resolution:** believable life should not silently remove every adventure. Which stories may resolve before acceptance, and how much opportunity remains, must be selected per story.
- **Emergent ecology versus authored causation:** V1 already has real wolf/habitat pressure. Greybeard's territory explanation can be narrative context without reducing existing behaviour to scripted migration flags.
- **Practical choice versus invented scope:** a physical bridge detour, maintained trough, working waystation or rescued crew has high potential value, but cannot be promised by a journal sentence. Existing work/transport/inventory foundations help; they do not implement every proposed consequence.
- **Pacing:** preserve simple errands and quiet exploration alongside hunts, property dilemmas and long treasure chains. More chapters, timers, claims and prerequisites are not automatically a better game.

## 4. Historical choices requiring reconsideration

1. **Guard evening duty is outside the 61 but V3 explicitly retired it.** V1's real lighting task, evening offer and auto-light suppression differ from G03's investigation and Q07's meal. Deleting it just because the stories share torches loses an existing activity. No V1 retirement is approved.
2. **Merchant wolves merge must preserve horse acquisition.** A shared den does not invalidate two justified promises; keep the bound horse, reservation/ownership transfer and death branch if the author wants that route.
3. **Cemetery consolidation is not yet proved physically correct.** V1's home-area forgotten-cemetery visit and archaeologist-side caretaker favour are not established as the same cemetery. The latter grants the exact outcome used for lawful chronicle access. Q14 does not exist in V1 yet.
4. **Anna's herbs and starter sheep have no demonstrated complete replacements.** Generated livestock observes actual events, unlike the authored sheep's accept-triggered stray; terminal per-animal IDs do not encode repeated losses. Future generic restocking is not a present V1 capability.
5. **Do not turn settlement wolves into an obligatory Greybeard sequel without deciding the loss of independent availability.** Current V1 threat can be resolved without a V2 personal-hunt prerequisite.
6. **Old Ruins and white hare deserve different discussions.** The former is a current quiet V1 lead with uncertain retirement motive; the latter is absent V2 mentorship/observation content rejected by a documented simplicity preference.
7. **Mine and long Chronicles need accurate maturity.** Rich domain foundations and early chapters exist; completed colony quest or full Chronicles finale is not established. Preservation-first protects delivered depth, not fictional completion of roadmaps.

These are **potential losses if old decisions were copied mechanically**, not evidence that this documentation session or V3's curation already removed V1 gameplay.

## 5. Most consequential author decisions before planning

| Discussion ID | Decision | Evidence-ready options / tradeoff |
|---|---|---|
| A1 | How far to replace familiar V1 premises? | Improve current parcel/tower/wreck in place, adapt the larger V3 stories, or preserve an old quiet episode at a distinct site. Matrix R22/34/35 names the lost value |
| A2 | What is one wolf story and what is a separate entitlement? | Keep separate reports on one incident with intentional rewards; consolidate perspectives; or give the short thread a separate den. Preserve clearing versus permanent destruction and decide horse route |
| A3 | Cemetery care, exploration and authorization | Merge only same-site care; retain separate discovery/permission where meaningful. Never substitute general tidying for permission to open one grave |
| A4 | Which existing short activities should actually leave? | Explicitly decide herbs, authored sheep, Old Ruins and evening duty; none is retired in V1 by default |
| A5 | Which stories may NPCs resolve without the player? | Per-story yes/no plus actual event window; respect accepted starter repair reservations and avoid a global “world consumes every quest” rule |
| A6 | Adopt real-world urgency? | Reunion-based message miss, four-hour second wood bonus and medical/rescue urgency have different fairness costs. Do not import arbitrary source expiry timers |
| A7 | Forced roof storm versus natural weather | A guaranteed storm needs a shared weather change; reacting to an ordinary storm preserves the current pure calendar contract |
| A8 | Which new narrative cluster adds the most value? | G03/G08 investigations, smith family/dispute, supper, geographical treasure, or larger living-world rescue/resource stories. Choose variety/coherence and preservation risk, not supplier score alone |
| A9 | New story consequences and rewards | Decide funded gifts/actual stock, evidence-based exposure and meaningful exceptional treasure without applying a blanket economic rewrite to existing rewards |
| A10 | Cast and long-arc continuity | Map familiar four identities carefully; place new V2 households credibly; decide whether selected existing treasure episodes become Chronicles chapters or stay independent |
| A11 | Companion and traveller exceptions | Q06 paid/free/solo as final story; actual assisted boar combat; accept or reject V3 quest-linked travel-survival bonus rather than silently adding special immunity |
| A12 | Guaranteed portfolio availability in procedural worlds | Keep world-condition-dependent optional stories, or select specific guaranteed anchors. New worldgen guarantees need explicit coordination; existing optional omissions do not automatically mean a broken quest |

The matrix contains narrower questions for all 61 records. These discussion IDs group decisions; they are **not approved tasks, priorities or a delivery schedule**.

## 6. Technical uncertainties that affect those choices

The most important source-confirmed limitations are active generic wild-target invalidation on reload; repeated animal-loss occurrence identity; cross-quest den reward/claim arbitration; stage/journal index sensitivity during rewrites; direct grants versus actual payer stock; and new geographic/structure/health outcomes unsupported by a story alone.

V1 does have deterministic cave-anchor claims, exact item transfers, source-aware mine/economy primitives, and real repair work. These should be reused selectively. It does not have a demonstrated universal legal-title/lot/evidence/incident receipt system implementing every V3 ambition. A focused extension may be justified; a wholesale architecture transplant is not.

The [runtime companion](./2026-10-27--quest-revival-runtime-evidence.md) supplies owners, symbols, additional families, concrete findings and targeted verification scenarios. No benchmark conclusions, gameplay acceptance, guaranteed per-seed offer counts or complete offscreen equivalence are claimed.

## 7. Roadmap compatibility and publication scope

Research/index Markdown only. No quest definitions, runtime systems, dialogue execution, assets, simulation behaviour, benchmark workload or historical curation documents are changed. D4's performance integration freeze remains intact; no parallel implementation track or approved backlog is created.

Future approved content may depend on D1 save evolution or D3 worldgen coordination **only where the actual representation or generation changes**. Text/cast/equipment/social changes do not all belong to a worldgen epoch. A new source SHA by itself does not require rerunning performance baselines for this documentation change.

Publication checks: reconcile 61 unique IDs/counts and all original evidence links, inspect changed-path scope, reread latest `main`, and publish documentation via a non-force update with expected-head protection. Runtime acceptance remains outstanding and bounded by whichever content the author later selects.
