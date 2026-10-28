# Quest Revival — Complete 61-record Reconciliation Matrix

**Created:** 2026-10-27  
**Status:** Advisory research; author discussion pending. No quest migration, retirement, implementation plan or gameplay change approved.  
**Direction:** Author-approved **V1 preservation-first**.  
**V1 source pin:** `3e7e7dc07625bd51fc5b8a5560baed3d386efec8`; live V3 check: `907e17cd2ad487547a25a1f928b2770348183d75`. Archive provenance: V3 `199f98e2`.  
**Companions:** [Executive assessment](./2026-10-27--quest-revival-recon.md), [runtime, extra families and verification evidence](./2026-10-27--quest-revival-runtime-evidence.md).

## Reading contract

Coverage is **39 V1 + 22 V2 = 61 source records**, not 61 currently playable V1 quests. All 39 V1 records have current definition/builder counterparts, conditionally assembled by `createApp`; this is **source-confirmed implementation, not end-to-end verification**. The 22 V2 records are absent as those authored stories in V1; shared mechanics or similar incidents do not change that. V2 code exists for 21 records (including two checked in live V3 comparison snapshots); Q10 is design only. All 61 V3 dispositions are **documentary curation**, not a live V3 quest implementation.

The first table is a navigation matrix. Each numbered record below supplies behaviour, historical rationale, motivation/confidence, desirable change, conflicts, actual V1 gaps, provisional recommendation, author question and original evidence. The shared runtime/persistence/reward contract applies to every V1 row and is detailed in the companion evidence report; it must not be inferred independently from each quest's registration.

**Motivation vocabulary:** quality = A (gameplay/narrative/coherence); economy = B (delivery cost/schedule); architecture = C (V3-specific supplier limits); mixed = D; unknown = E. These classifications are the reviewer's interpretation of **documented reasons**, not historical quotations or claims about private motives. Confidence concerns that interpretation, not playability. For batch D-QUEST-44 rows confidence is medium: explicit retention/scope-reset is known, an individual creative rationale often is not. No decision is classified as primarily economy-only without evidence.

`preserve` means retain the current capability and investigate defects independently; `adapt` for V2 means **new content**, never a repair of an existing V1 quest. `consolidate` is conditional on actual shared incident/site, with lost value explicitly noted. All recommendations remain provisional. Every proposed content change/new story needs author selection; keeping the present baseline needs no new migration vote.

## Portfolio index

| Ref | Source ID | Origin / story | Historical V3 disposition | Motivation / confidence | V1 status | Provisional call |
|---|---|---|---|---|---|---|
| [R01](#r01) | `drewno-dla-anny` | V1 — Wood for Anna | rewrite (D-QUEST-22) | mixed / high | Implemented in source; conditional availability | preserve / enhance |
| [R02](#r02) | `drewno-dla-piotra` | V1 — Wood for Piotr | rewrite (D-QUEST-22) | mixed / high | Implemented in source; conditional availability | preserve / enhance |
| [R03](#r03) | `drewno-na-naprawe` | V1 — Wood for Repairs | rewrite (D-QUEST-38) | mixed / high | Implemented in source; conditional availability | preserve |
| [R04](#r04) | `world:dungeon-bandit:<settlementId>:<caveId>:<giverNpcId>:<claimantNpcId>` | V1 — Bandits' Stash | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R05](#r05) | `dzik-przy-szlaku` | V1 — Boar by the Trail | rewrite (D-QUEST-21) | mixed / high | Implemented in source; conditional availability | adapt |
| [R06](#r06) | `grozny-wilk` | V1 — Dangerous Wolf | rewrite (D-QUEST-15) | mixed / high | Implemented in source; conditional availability | preserve / enhance |
| [R07](#r07) | `hunters-brotherhood-intro:<homeSettlementId>:<inviterNpcId>` | V1 — Circle of Hunters | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R08](#r08) | `hunters-brotherhood-investigation:<homeSettlementId>:<inviterNpcId>:<spawnerId>` | V1 — Troubling Hunting Ground | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R09](#r09) | `kamienie-dla-piotra` | V1 — Stones for Piotr | rewrite (D-QUEST-38) | mixed / high | Implemented in source; conditional availability | preserve / reconsider |
| [R10](#r10) | `lis-przy-osadzie` | V1 — Fox by the Settlement | keep (D-QUEST-23) | quality / high | Implemented in source; conditional availability | preserve |
| [R11](#r11) | `world:lost-hunter:<settlementId>:<caveId>` | V1 — Missing Hunter | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R12](#r12) | `story:lost-treasure-chronicles:cemetery-favour` | V1 — Order in the Cemetery | merge (D-QUEST-44, D-QUEST-29) | quality / high | Implemented in source; conditional availability | reconsider / conditional consolidate |
| [R13](#r13) | `story:lost-treasure-chronicles:chronicle-deciphering` | V1 — Deciphering the Chronicle | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R14](#r14) | `story:lost-treasure-chronicles:chronicle-search` | V1 — Encoded Chronicle | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R15](#r15) | `story:lost-treasure-chronicles:elder:dispute` | V1 — Old Grudge | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R16](#r16) | `story:lost-treasure-chronicles:elder:winter` | V1 — Preparing for Winter | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R17](#r17) | `world:lost-treasure-expedition:<settlementId>:<caveId>[:<sponsorNpcId>[:<stakeholderNpcId>]]` | V1 — Lost Treasure Expedition | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R18](#r18) | `mapa-do-skarbu` | V1 — Treasure Map | rewrite (D-QUEST-44, D-QUEST-43) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R19](#r19) | `world:old-bones:<settlementId>:<caveId>` | V1 — Old Bones | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R20](#r20) | `plaga-szcurow` | V1 — Rat Plague | merge (D-QUEST-10) | quality / high | Implemented in source; conditional availability | preserve |
| [R21](#r21) | `relay-anna-piotr` | V1 — Message for Piotr | rewrite (D-QUEST-37) | quality / high | Implemented in source; conditional availability | enhance / reconsider |
| [R22](#r22) | `samotna-wieza` | V1 — Lonely Tower | rewrite (D-QUEST-34) | mixed / high | Implemented in source; conditional availability | adapt |
| [R23](#r23) | `shells-dla-kasi` | V1 — Shells for Kasia | rewrite (D-QUEST-39) | quality / high | Implemented in source; conditional availability | enhance |
| [R24](#r24) | `skarb-jaskini-niedzwiedzia` | V1 — Old Treasure in the Cave | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R25](#r25) | `slad-przy-monolicie` | V1 — Trail by the Monolith | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | enhance / reconsider |
| [R26](#r26) | `sporne-drewno` | V1 — Disputed Wood | rewrite (D-QUEST-22) | mixed / high | Implemented in source; conditional availability | preserve / enhance |
| [R27](#r27) | `sprawdz-szlak` | V1 — Checking the Rock Cave | rewrite (D-QUEST-36) | quality / high | Implemented in source; conditional availability | enhance |
| [R28](#r28) | `stare-ruiny` | V1 — Old Ruins | retire (D-QUEST-35) | unknown / low | Implemented in source; conditional availability | reconsider |
| [R29](#r29) | `rpg:suspicious-transport:<settlementId>:<counterpartId>` | V1 — Suspicious Transport | rewrite (D-QUEST-44) | mixed / medium | Implemented in source; conditional availability | preserve / enhance |
| [R30](#r30) | `wilcza-jama` | V1 — Wolf Den | rewrite (D-QUEST-15) | mixed / high | Implemented in source; conditional availability | reconsider / enhance |
| [R31](#r31) | `wilki-pod-osada` | V1 — Wolves Under the Settlement | rewrite (D-QUEST-8, D-QUEST-14) | mixed / high | Implemented in source; conditional availability | reconsider |
| [R32](#r32) | `wilki-u-kupca` | V1 — Wolves at the Merchant | merge (D-QUEST-14) | quality / high | Implemented in source; conditional availability | conditional consolidate / preserve |
| [R33](#r33) | `woda-dla-marka` | V1 — Water for Marek | rewrite (D-QUEST-24) | quality / high | Implemented in source; conditional availability | enhance |
| [R34](#r34) | `zaginiona-przesylka` | V1 — Lost Parcel | rewrite (D-QUEST-20) | quality / high | Implemented in source; conditional availability | adapt / author reconsideration |
| [R35](#r35) | `zaginiony-ladunek` | V1 — Missing Cargo | rewrite (D-QUEST-26) | quality / high | Implemented in source; conditional availability | conditional adapt |
| [R36](#r36) | `zagubiona-owca` | V1 — Lost Sheep | retire (D-QUEST-9) | quality / high | Implemented in source; conditional availability | reconsider / conditional consolidate |
| [R37](#r37) | `zapomniany-cmentarz` | V1 — Forgotten Cemetery | merge (D-QUEST-29) | quality / high | Implemented in source; conditional availability | reconsider / conditional consolidate |
| [R38](#r38) | `ziola-dla-anny` | V1 — Herbs for Anna | retire (D-QUEST-32) | quality / medium | Implemented in source; conditional availability | reconsider / preserve |
| [R39](#r39) | `zwiadowca` | V1 — Scouting the Area | rewrite (D-QUEST-36) | quality / high | Implemented in source; conditional availability | enhance |
| [R40](#r40) | `G01` | V2 — Lost Lamb | rewrite (D-QUEST-42, D-QUEST-9) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R41](#r41) | `G02` | V2 — Rusty Debt | rewrite (D-QUEST-41) | quality / high | Absent authored story; new content | conditional adapt — new content |
| [R42](#r42) | `G03` | V2 — Night Torches | keep (D-QUEST-12, D-QUEST-13) | quality / high | Absent authored story; new content | conditional adapt — new content |
| [R43](#r43) | `G04` | V2 — Root by the Stream | rewrite (D-QUEST-32) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R44](#r44) | `G05` | V2 — Disputed Oak | rewrite (D-QUEST-27) | mixed / high | Absent authored story; new content | conditional adapt — major new content |
| [R45](#r45) | `G06` | V2 — The Trader's Letter | rewrite (D-QUEST-31) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R46](#r46) | `G07` | V2 — Trail of the Grey Wolf | keep (D-QUEST-8, D-QUEST-16) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R47](#r47) | `G08` | V2 — Well and Rumor | rewrite (D-QUEST-25) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R48](#r48) | `Q01` | V2 — A Hare Out of Place | retire (D-QUEST-23) | quality / high | Absent authored story; new content | reconsider — optional new content |
| [R49](#r49) | `Q02` | V2 — The Hollow Below the Road | rewrite (D-QUEST-21) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R50](#r50) | `Q03` | V2 — A Roof Before Rain | rewrite (D-QUEST-38) | mixed / high | Absent authored story; new content | conditional adapt / reconsider |
| [R51](#r51) | `Q04` | V2 — The Handle Remembers | rewrite (D-QUEST-30, D-QUEST-41) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R52](#r52) | `Q05` | V2 — The Map That Missed the River | rewrite (D-QUEST-43) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R53](#r53) | `Q06` | V2 — Room for One More | rewrite (D-QUEST-33) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R54](#r54) | `Q07` | V2 — Six Bowls, One Pan | rewrite (D-QUEST-28, D-QUEST-13) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R55](#r55) | `Q08` | V2 — The Long Way to Water | defer (D-QUEST-40) | architecture / high | Absent authored story; new content | defer — new content decision |
| [R56](#r56) | `Q09` | V2 — Goods on the Ground | rewrite (D-QUEST-31) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R57](#r57) | `Q10` | V2 — What the Mountain Owes | retire (D-QUEST-45) | mixed / high | Absent authored story; new content | conditional consolidate / reconsider |
| [R58](#r58) | `Q11` | V2 — The Bell in Blackwater | rewrite (D-QUEST-45) | mixed / high | Absent authored story; new content | conditional adapt — major new content |
| [R59](#r59) | `Q12` | V2 — The Iron Under the Pine | rewrite (D-QUEST-45) | quality / high | Absent authored story; new content | conditional adapt — new content |
| [R60](#r60) | `Q13` | V2 — The Ash House Vault | rewrite (D-QUEST-45) | mixed / high | Absent authored story; new content | conditional adapt — new content |
| [R61](#r61) | `Q14` | V2 — Weeds on the Hill | rewrite (D-QUEST-29, D-QUEST-44) | quality / high | Absent authored story; new content | conditional adapt / conditional consolidate |

## Common evidence and source corrections

- All **11 V1 definition modules** copied under `sources/comparison-defs/seedvale-v1/src/quests/` were compared byte-for-byte with the current V1 modules and are identical at this pin. This supports direct source comparison; it does **not** certify their old metadata or runtime behaviour. Current callers/tests were inspected separately.
- Catalogue status `verification needed` and `implemented: true` describe source projects. They are never V3 acceptance evidence.
- G02/G04 thin catalogue cards say full designs are missing. The staged `sources/v2-design/grok-quest-02-rusty-debt.md` and `grok-quest-04-root-by-the-stream.md` actually exist and were followed.
- Q05/Q11/Q12/Q13 metadata reads terminal endings in isolation and understates transfers in options/rules. Their copied definitions contain real pay/give effects. Physical routes, repaired roads, legal rights or a working waystation still cannot be inferred from those payments.
- Q01 and Q08 comparison definitions are not in the V1 donor copy. They were read from live V3's `docs/comparison/code/SeedVales-v2/` at the pinned donor revision; no extra archive copy is necessary.
- Review 094's statement that D-QUEST-16 is open is superseded at **policy level** by the staged arbitration contract, including the 2026-10-19 D-QUEST-46 clarification: independent NPC resolution is **selected per story**, default no. Exact APIs and implementation remain separate.
- Historical reward/prerequisite references below are retained for traceability. The current behaviour paragraph and source take precedence over imported metadata. V1 direct rewards generally grant through a callback; they are not proven withdrawals from NPC funds.

## R01

**Wood for Anna** — source `drewno-dla-anny` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-22; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna: deliver 5 branches to the communal fence supply after prioritize_anna or Piotr's delivery; already_repaired closes without payout. Material delivery releases the real repair reservation.

**What the historical decision says and why it may differ for V1.** D-QUEST-22 preserves two priorities and actual repairs; its M10+ timing is a V3 supplier constraint, not a V1 defect.

**Potential V3 improvement / value.** Keep both follow-ups and the practical communal-versus-household disagreement. Much of this direction already exists in V1.

**Conflicts, missing V1 capabilities and value at risk.** The proposed four-hour second-help bonus is absent from the current definition. Direct player repair currently earns no reward; the V3 smaller unsolicited reward would change balance.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The actual structure and repair reservation live in settlement state, separately from delivered/already_repaired quest outcomes. A failed material-sink preflight/commit must retain/roll back player materials. There is no authored generic delivery deadline.

**Source reward reference.** seed_carrot x3 (hidden); relation Anna +1; already_repaired: no reward These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** any of: quest_outcome sporne-drewno: prioritize_anna; any of: quest_outcome drewno-dla-piotra: delivered_to_piotr

**Author question.** Add the four-hour bonus and unsolicited-help reward, or preserve the current untimed sequence?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-dla-anny/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-dla-anny/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-timber-priority-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2352); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md); [quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md)

## R02

**Wood for Piotr** — source `drewno-dla-piotra` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-22; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr: 5 branches into household stock for loggingWagon, released reservation; gate is prioritize_piotr or Anna's completed delivery. Already-repaired is a distinct outcome.

**What the historical decision says and why it may differ for V1.** D-QUEST-22 explicitly keeps the logging cart separate; deferral reflects V3 construction maturity.

**Potential V3 improvement / value.** Retain the cart as a visible private need with wider economic relevance.

**Conflicts, missing V1 capabilities and value at risk.** Do not merge with the household fence or roof; new timed reward needs persistent timing and a funded payment policy.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The actual structure and repair reservation live in settlement state, separately from delivered/already_repaired quest outcomes. A failed material-sink preflight/commit must retain/roll back player materials. There is no authored generic delivery deadline.

**Source reward reference.** coin x8 (shown); relation Piotr +1; already_repaired: no reward These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** any of: quest_outcome sporne-drewno: prioritize_piotr; any of: quest_outcome drewno-dla-anny: delivered_to_anna

**Author question.** Should prompt second help earn extra recognition without making late help fail?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-dla-piotra/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-dla-piotra/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-timber-priority-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2402); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-005-authored-rpg-quests.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-005-authored-rpg-quests.md); [quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md)

## R03

**Wood for Repairs** — source `drewno-na-naprawe` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-38; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr's household fence takes 5 branches through authoredRepairDeliveries; completion is delivery, subsequent repair belongs to NPC work; early real repair can close already_repaired.

**What the historical decision says and why it may differ for V1.** D-QUEST-38 recasts a coherent household repair sequence, while M10+ delivery gating belongs to V3.

**Potential V3 improvement / value.** Narrative continuity with the foundation is useful; existing physical consequence should survive.

**Conflicts, missing V1 capabilities and value at risk.** A roof sequel must not turn this delivery into a fictional repair or conflate separate repair sinks.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The actual structure and repair reservation live in settlement state, separately from delivered/already_repaired quest outcomes. A failed material-sink preflight/commit must retain/roll back player materials. There is no authored generic delivery deadline.

**Source reward reference.** coin x8 (shown); relation Piotr +1; already_repaired: no reward These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep this small independent repair request when introducing a later roof story?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-na-naprawe/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-drewno-na-naprawe/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-roof-storm-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1940); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md); [quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md)

## R04

**Bandits' Stash** — source `world:dungeon-bandit:<settlementId>:<caveId>:<giverNpcId>:<claimantNpcId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Guard and claimant are deterministically bound to a dungeon; three stages: guard lead, stash plus both exact instances, then return property / submit evidence / keep. Side caches remain separate physical loot.

**What the historical decision says and why it may differ for V1.** D-QUEST-44 explicitly retains the premise but resets legacy scope/rewards for M7; no specific better replacement script is approved. Quality/economy weighting is inferred.

**Potential V3 improvement / value.** Polish evidence and claimant voices while retaining the already physical ledger and marked property.

**Conflicts, missing V1 capabilities and value at risk.** Real transfer preflights exist in createApp; generalized title, witnesses and delayed discovery of concealment do not follow from them. Direct keep penalties are currently immediate.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Binding requires eligible cave/anchor and deterministically selected actors; otherwise composition may omit the episode. Generic abandonment is disabled in these physical-item stories. Exact item custody, missing/dead recipients and capacity are important reachability limits; universal item-loss recovery was not established.

**Source reward reference.** return_marked_property: relation claimant +3, trust +4, integrity +5, benevolence +4, renown +2; give_evidence_to_guard: relation claimant +1, competence +5, integrity +4, renown +4; keep_marked_property: relation claimant -2, trust -2, integrity -4, renown +1; Deep stash contents (source DEEP_STASH_SUPPLY): coin x18, ruby small x1, bandage x2; Side caches (up to 2, SIDE_CACHE_SUPPLY): coin x6, bandage x1 each These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep explicit immediate honesty penalties, or make concealment consequences depend on who learns it?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-dungeon-bandit-treasure/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-dungeon-bandit-treasure/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/dungeonBanditTreasure.ts](../../../src/quests/dungeonBanditTreasure.ts) (definition/builder near line 205); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/dungeonBanditTreasure.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-026-dungeon-bandit-treasure.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-026-dungeon-bandit-treasure.md); [quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md)

## R05

**Boar by the Trail** — source `dzik-przy-szlaku` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-21; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **adapt** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Marek offers at renown >=10; talk to Piotr, then kill a bound boar. The resolver picks a live animal by kind, not a proven meadow resident.

**What the historical decision says and why it may differ for V1.** D-QUEST-21 gives a concrete meadow/herbalist motivation and assisted route, but expressly permits cheaper encounter staging instead of the entire legacy plan 070.

**Potential V3 improvement / value.** Specific threatened herb access is a meaningful improvement over claiming any boar's death clears a road; optional hunter assistance adds social choice.

**Conflicts, missing V1 capabilities and value at risk.** Plan 070 is planned, not the current implementation. Need one durable boar/meadow/herbalist binding and real helper participation; avoid migrating staged relocation over existing fauna behaviour.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. While the wild-animal objective is active, save/load or same-session rebuild invalidates it; a missing live candidate can leave the target unbound. No new named-animal persistence is implied. Death must match the actual bound target; species-only broad credit is not the intended contract.

**Source reward reference.** book_defense_intermediate x1 (hidden); relation Marek +2; reputation competence +6, courage +6, benevolence +2; renown +8 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** renown minimum 10

**Author question.** Approve the meadow premise and optional assisted hunt, and retain real V1 habitat behaviour instead of V3's cheap staging fallback?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-dzik-przy-szlaku/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-dzik-przy-szlaku/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/boar-quests-v1-q02-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2452); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md); [quests-progression-005-authored-rpg-quests.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-005-authored-rpg-quests.md)

## R06

**Dangerous Wolf** — source `grozny-wilk` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-15; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna trusted gate; kill_target_animal wolf with dangerous trait; report grants Damascus sword. Target identity is runtime-bound and invalidates on active wild-target reload.

**What the historical decision says and why it may differ for V1.** Wolf curation preserves a short distinct wolf story but reduces dependence on generic migration; separation is creative direction, staging is implementation economy.

**Potential V3 improvement / value.** A recognisable individual distinct from Greybeard improves causal clarity.

**Conflicts, missing V1 capabilities and value at risk.** Current target is selected from live wolves; it is not established as an authored unique wolf. G07 must not gate this existing route merely to reproduce V3 sequencing.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. While the wild-animal objective is active, save/load or same-session rebuild invalidates it; a missing live candidate can leave the target unbound. No new named-animal persistence is implied. Death must match the actual bound target; species-only broad credit is not the intended contract.

**Source reward reference.** damascus_long_sword x1 (shown); relation Anna +2; reputation competence +10, courage +12, benevolence +4; renown +15 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** relation Anna minimum trusted

**Author question.** Retain this independent short hunt and its sword while introducing Greybeard elsewhere?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-grozny-wilk/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-grozny-wilk/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/wolf-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2099); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-007-wolves-approach-settlement.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-007-wolves-approach-settlement.md); [quests-progression-004-quest-availability-and-prerequisites.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-004-quest-availability-and-prerequisites.md)

## R07

**Circle of Hunters** — source `hunters-brotherhood-intro:<homeSettlementId>:<inviterNpcId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Existing hunter III unlocks one story-exposure all-objectives stage meeting master, trophy hunter and ambitious hunter; report joins the circle.

**What the historical decision says and why it may differ for V1.** D-QUEST-44 retains membership but defers details; Review 094's missing hunter-III prerequisite is a V3 problem. Interpretation of rewrite motive: medium.

**Potential V3 improvement / value.** More distinctive introductions and continuity can enrich existing progression.

**Conflicts, missing V1 capabilities and value at risk.** Do not replace the working hunter ladder with a new eligibility flag. Cast is deterministic across two settlements; names/roles are not free to overwrite.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Cast and prerequisite/target must reconstruct deterministically; missing hunter/circle or unhealthy habitat can omit the episode. R08 persists the captured diagnosis rather than regenerating it at report. A later world change must not manufacture or silently replace a target.

**Source reward reference.** relation inviter +1; relation master +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome hunter-profession (hunter III): hunter_iii_complete

**Author question.** Keep the existing profession ladder as the membership route?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-hunters-brotherhood-introduction/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-hunters-brotherhood-introduction/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/huntersBrotherhoodIntroduction.ts](../../../src/quests/huntersBrotherhoodIntroduction.ts) (definition/builder near line 116); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/huntersBrotherhoodIntroduction.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-048-hunters-brotherhood-introduction-and-membership.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-048-hunters-brotherhood-introduction-and-membership.md); [quests-hunters-brotherhood.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-hunters-brotherhood.md)

## R08

**Troubling Hunting Ground** — source `hunters-brotherhood-investigation:<homeSettlementId>:<inviterNpcId>:<spawnerId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** After membership, materializes only for an unhealthy deer thicket among two bound settlements. Ranked pressure selects the site; interaction records a real habitat observation and reports its diagnosis.

**What the historical decision says and why it may differ for V1.** D-QUEST-44 retains real habitat diagnosis; V3 supplier gating explains deferral, not removal. No final new script is specified.

**Potential V3 improvement / value.** Present ecological evidence and conflicting hunter perspectives more clearly.

**Conflicts, missing V1 capabilities and value at risk.** This is not an unconditional quest in every seed; never manufacture a depleted habitat. Later strategic interventions and Great Trophy finale are not established by this record.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Cast and prerequisite/target must reconstruct deterministically; missing hunter/circle or unhealthy habitat can omit the episode. R08 persists the captured diagnosis rather than regenerating it at report. A later world change must not manufacture or silently replace a target.

**Source reward reference.** relation master +1; reputation competence +2, trust +2; renown +2 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome hunters-brotherhood-intro: hunters_brotherhood_joined

**Author question.** Keep the world-condition gate even when a healthy world offers no investigation?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-hunters-brotherhood-investigation/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-hunters-brotherhood-investigation/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/huntersBrotherhoodInvestigation.ts](../../../src/quests/huntersBrotherhoodInvestigation.ts) (definition/builder near line 272); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/huntersBrotherhoodInvestigation.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-049-hunters-brotherhood-hunting-ground-investigation.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-049-hunters-brotherhood-hunting-ground-investigation.md); [quests-hunters-brotherhood.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-hunters-brotherhood.md)

## R09

**Stones for Piotr** — source `kamienie-dla-piotra` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-38; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve / reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr receives 6 stones into household stock for residentialFoundation; stored condition controls already_repaired; delivery releases autonomous repair reservation.

**What the historical decision says and why it may differ for V1.** D-QUEST-38 adds a roof-storm story; V3's lack of repair/weather suppliers is separate from the merit of that sequel.

**Potential V3 improvement / value.** A later household story can remember the actual repaired foundation.

**Conflicts, missing V1 capabilities and value at risk.** V1 weather is a pure seed/calendar function, not the donor weatherMachine. Guaranteed storm 1–3 days after repair requires a new shared weather constraint; delivery is not repair completion.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The actual structure and repair reservation live in settlement state, separately from delivered/already_repaired quest outcomes. A failed material-sink preflight/commit must retain/roll back player materials. There is no authored generic delivery deadline.

**Source reward reference.** coin x9 (shown); relation Piotr +1; already_repaired: no reward These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Should a repaired foundation force a global storm, or should the roof story react to natural weather?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-kamienie-dla-piotra/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-kamienie-dla-piotra/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-roof-storm-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2003); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md); [quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md)

## R10

**Fox by the Settlement** — source `lis-przy-osadzie` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **keep** — D-QUEST-23; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve** |
| Author decision required | No for baseline retention; yes before changing target/rewards |

**Existing behaviour / original story.** Marek's one-stage bound fox hunt pays 20 coins and local social credit; exact target death advances it. Active wild-target reload remains a limit.

**What the historical decision says and why it may differ for V1.** D-QUEST-23 explicitly requests a simple single-fox kill quest and rejects apprentice/two-fox/trap elaboration. No schedule motive is documented.

**Potential V3 improvement / value.** Keep a short uncomplicated animal quest among longer stories; a normal pelt can remain optional.

**Conflicts, missing V1 capabilities and value at risk.** Do not treat a fox-pelt asset/item proposal as an existing mandatory objective. Binding selects a live fox by kind, not a durable authored poultry attacker.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. While the wild-animal objective is active, save/load or same-session rebuild invalidates it; a missing live candidate can leave the target unbound. No new named-animal persistence is implied. Death must match the actual bound target; species-only broad credit is not the intended contract.

**Source reward reference.** coin x20 (shown); reputation competence +3; reputation courage +3; renown +3 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** No content replacement needed; author review only if target specificity or reward balance changes.

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lis-przy-osadzie/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lis-przy-osadzie/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/fox-hunt-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2070); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R11

**Missing Hunter** — source `world:lost-hunter:<settlementId>:<caveId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Witness reveals natural cave; loot pack, report to family, return the exact hunting-bow instance or keep it. Return uses transfer_item_instance and recipient capacity checks.

**What the historical decision says and why it may differ for V1.** Batch 44 retains the missing hunter's fate and ownership dilemma; it does not document a concrete writing defect or approve reimplementation.

**Potential V3 improvement / value.** Improve the hunter's identity and family reaction around already meaningful evidence and property.

**Conflicts, missing V1 capabilities and value at risk.** Do not replace the unique bow with a generic reward. Provenance/legal permission beyond the branch is partial; cave/cast eligibility can omit the story.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Binding requires eligible cave/anchor and deterministically selected actors; otherwise composition may omit the episode. Generic abandonment is disabled in these physical-item stories. Exact item custody, missing/dead recipients and capacity are important reachability limits; universal item-loss recovery was not established.

**Source reward reference.** return_bow_to_family: coin x4 (hidden), relation giver +3, trust +5, benevolence +6, integrity +3, renown +4; report_fate_keep_bow: relation giver +1, trust +1, benevolence +2, renown +2 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Retain both return and keep routes, with consequences calibrated to actual knowledge?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-hunter-natural-cave/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-hunter-natural-cave/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostHunterNaturalCave.ts](../../../src/quests/lostHunterNaturalCave.ts) (definition/builder near line 133); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostHunterNaturalCave.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-023-lost-hunter-natural-cave.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-023-lost-hunter-natural-cave.md)

## R12

**Order in the Cemetery** — source `story:lost-treasure-chronicles:cemetery-favour` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **merge** — D-QUEST-44, D-QUEST-29; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider / conditional consolidate** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** After elder winter help, caretaker requests 4 branches; grave_access_granted is an exact story outcome consumed by isLostTreasureGraveAccessGranted. This is permission negotiation, not five physical tidy actions.

**What the historical decision says and why it may differ for V1.** D-QUEST-44/29 explicitly consolidate cemetery care but preserve lawful grave-access negotiation. The alleged same cemetery still needs V1 physical-ID evidence.

**Potential V3 improvement / value.** Separate permission for one grave from any general cemetery-care payment.

**Conflicts, missing V1 capabilities and value at risk.** Removing the ID without replacing createApp's permission consumer would break chronicle access. V1 forgotten-cemetery visit and this caretaker's cemetery are not proven the same site.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Chronicles chapter IDs/outcomes are prerequisite contracts. Unique book/glossary and grave authorization have separate consumers; missing bindings can omit chapters. A dialogue-only neighbour/axe outcome does not itself prove equivalent physical work/item transfer.

**Source reward reference.** grave_access_granted: relation caretaker +1, trust +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help

**Author question.** If Q14 is added, keep this separate permission beat or fold it into Q14 only at the same cemetery?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-lost-treasure-cemetery-favour/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-lost-treasure-cemetery-favour/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureChronicleSearch.ts](../../../src/quests/lostTreasureChronicleSearch.ts) (definition/builder near line 205); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureChronicleSearch.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md)

## R13

**Deciphering the Chronicle** — source `story:lost-treasure-chronicles:chronicle-deciphering` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Show the exact chronicle, choose pay 35 or recover the specialist's reference glossary, then physically return it. Stages use forward transitions and effects; resolution reveals the later search region.

**What the historical decision says and why it may differ for V1.** Batch 44 retains the fee-or-favour choice and defers scope. No evidence that the current multi-route implementation was defective.

**Potential V3 improvement / value.** Better specialist voice and interpretation of evidence are low-disruption opportunities.

**Conflicts, missing V1 capabilities and value at risk.** Do not turn the 35-coin cost into a reward or delete the favour route. Full Chronicles finale is not proved by deciphering completion.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Chronicles chapter IDs/outcomes are prerequisite contracts. Unique book/glossary and grave authorization have separate consumers; missing bindings can omit chapters. A dialogue-only neighbour/axe outcome does not itself prove equivalent physical work/item transfer.

**Source reward reference.** chronicle_deciphered_paid: relation specialist +1; pays 35 coins (fee, a cost not a reward); chronicle_deciphered_favour: relation specialist +2, benevolence +1 (requires recovering and returning the specialist glossary) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome story:lost-treasure-chronicles:chronicle-search: chronicle_acquired

**Author question.** Keep both routes and the existing specialist journey?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicle-deciphering/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicle-deciphering/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureChronicleDeciphering.ts](../../../src/quests/lostTreasureChronicleDeciphering.ts) (definition/builder near line 100); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureChronicleDeciphering.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-039-lost-treasure-chronicles-chronicle-deciphering-and-specialist.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-039-lost-treasure-chronicles-chronicle-deciphering-and-specialist.md); [quests-lost-something-chronicles.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-lost-something-chronicles.md)

## R14

**Encoded Chronicle** — source `story:lost-treasure-chronicles:chronicle-search` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Winter outcome gates the search. Meet archaeologist or already own chronicle; investigate grave or ruins; possess the one exact book. Seeded truth places the chronicle at one source, not both.

**What the historical decision says and why it may differ for V1.** Batch 44 retains alternative chronicle leads and requests lawful access, while delaying V3 implementation. This is not proof the original quest lacked alternatives.

**Potential V3 improvement / value.** Clearer clues and lawful-grave dialogue can improve presentation without replacing the engine.

**Conflicts, missing V1 capabilities and value at risk.** Preserve pre-owned-item fast path and both leads. Permission is separate; world research delay is real lookup presentation, not an NPC research simulation.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Chronicles chapter IDs/outcomes are prerequisite contracts. Unique book/glossary and grave authorization have separate consumers; missing bindings can omit chapters. A dialogue-only neighbour/axe outcome does not itself prove equivalent physical work/item transfer.

**Source reward reference.** chronicle_acquired: relation elder +1, relation archaeologist +1 (the encoded chronicle is a story item, not a coin reward) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help

**Author question.** Keep winter as a prerequisite, or allow another trust/independent-discovery entry as V3 suggests?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicle-search/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicle-search/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureChronicleSearch.ts](../../../src/quests/lostTreasureChronicleSearch.ts) (definition/builder near line 205); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureChronicleSearch.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md); [quests-lost-something-chronicles.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-lost-something-chronicles.md)

## R15

**Old Grudge** — source `story:lost-treasure-chronicles:elder:dispute` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** After winter, hear elder and counterpart, choose support elder or reconcile; relations/reputation react. The story's axe is dialogue subject, not proven an independently transferred item.

**What the historical decision says and why it may differ for V1.** Batch 44 retains the axe-grudge episode but leaves roles and mechanics open; no final rewrite text or defect finding is supplied.

**Potential V3 improvement / value.** Nuanced testimony and continuity with the elder's past can improve an existing social choice.

**Conflicts, missing V1 capabilities and value at risk.** Do not promise an actual restored axe or factual arbitration without an item/evidence supplier; recasting elder as E01 must preserve bound NPC identity.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Chronicles chapter IDs/outcomes are prerequisite contracts. Unique book/glossary and grave authorization have separate consumers; missing bindings can omit chapters. A dialogue-only neighbour/axe outcome does not itself prove equivalent physical work/item transfer.

**Source reward reference.** support_elder: relation elder +2, relation counterpart -1, trust +1, competence +1; reconcile: relation elder +1, relation counterpart +1, benevolence +2, integrity +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help

**Author question.** Should this remain a social disagreement, or require physical evidence/the actual axe?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicles-elder-dispute/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicles-elder-dispute/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureChroniclesElder.ts](../../../src/quests/lostTreasureChroniclesElder.ts) (definition/builder near line 60); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureChroniclesElder.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md); [quests-lost-something-chronicles.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-lost-something-chronicles.md)

## R16

**Preparing for Winter** — source `story:lost-treasure-chronicles:elder:winter` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** One any-objectives stage: 6 branches or speak to helper. Distinct material_help and neighbor_help outcomes unlock dispute/search/favour.

**What the historical decision says and why it may differ for V1.** Batch 44 preserves wood or neighbour-help alternatives and relaxes future arc gating; delivery scope reset is explicit, quality motive inferred.

**Potential V3 improvement / value.** Retain the quiet social opening and acknowledge earlier help.

**Conflicts, missing V1 capabilities and value at risk.** Speaking to the helper produces the quest outcome; that alone does not prove physical wood delivery or autonomous elder care. Former-adventurer characterization is separately selected, not a licence to mint a sword.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Chronicles chapter IDs/outcomes are prerequisite contracts. Unique book/glossary and grave authorization have separate consumers; missing bindings can omit chapters. A dialogue-only neighbour/axe outcome does not itself prove equivalent physical work/item transfer.

**Source reward reference.** material_help: relation elder +1, benevolence +2; neighbor_help: relation elder +2, relation helper +1, trust +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Must neighbour-help cause real wood/work, and should it stay an obligatory Chronicles opening?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicles-elder-winter/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-chronicles-elder-winter/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureChroniclesElder.ts](../../../src/quests/lostTreasureChroniclesElder.ts) (definition/builder near line 60); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureChroniclesElder.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md); [quests-lost-something-chronicles.md](../../../docs/v3-donor/quests/sources/v1-roadmaps/quests-lost-something-chronicles.md)

## R17

**Lost Treasure Expedition** — source `world:lost-treasure-expedition:<settlementId>:<caveId>[:<sponsorNpcId>[:<stakeholderNpcId>]]` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Local stakeholder leads to an external sponsor with settlement/direction; sponsor and stakeholder provide different facts; camp, journal, evidence and final treasure are distinct containers, then family/sponsor/keep journal choices.

**What the historical decision says and why it may differ for V1.** Batch 44 retains the expedition/journal/stakeholder choices; scope and rewards remain open. Imported original is already sophisticated.

**Potential V3 improvement / value.** Narrative polish can use the already improved external-sponsor flow rather than repeat obsolete redundant dialogue.

**Conflicts, missing V1 capabilities and value at risk.** Actual current module equals the donor comparison snapshot, but its catalogue summary understates external casting. Preserve legacy identity helper in quest ID, cave claims and exact journal transfer.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Binding requires eligible cave/anchor and deterministically selected actors; otherwise composition may omit the episode. Generic abandonment is disabled in these physical-item stories. Exact item custody, missing/dead recipients and capacity are important reachability limits; universal item-loss recovery was not established.

**Source reward reference.** journal_to_family: relation stakeholder +3, trust +4, benevolence +5, integrity +3, renown +2; journal_to_sponsor: coin x25 (shown), relation sponsor +3, relation stakeholder -1 (if present), competence +3, integrity +2, renown +3; keep_journal_and_treasure: relation sponsor -2, relation stakeholder -2 (if present), trust -2, integrity -3, renown +1; Camp container: coin x4, bandage x1; Journal pack container: coin x6; Evidence container: coin x8, bandage x1; Final treasure container: coin x50, ruby medium x1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep this separate expedition from the planned Chronicles finale, or connect them only after comparing exact sites and ownership?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-expedition/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-lost-treasure-expedition/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/lostTreasureExpedition.ts](../../../src/quests/lostTreasureExpedition.ts) (definition/builder near line 349); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/lostTreasureExpedition.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-027-lost-treasure-expedition.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-027-lost-treasure-expedition.md); [quests-progression-079-lost-treasure-expedition-external-sponsor-flow.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-079-lost-treasure-expedition-external-sponsor-flow.md)

## R18

**Treasure Map** — source `mapa-do-skarbu` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44, D-QUEST-43; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr acquainted gate; read physical dark-forest map, discover stable ruins, loot real chest, report. Composition binds map source and world-owned discovery/loot state.

**What the historical decision says and why it may differ for V1.** D-QUEST-43/44 explicitly keep this distinct from Q05; no approved replacement script exists.

**Potential V3 improvement / value.** Improve map prose and environmental clues without adding another reward copy of the chest.

**Conflicts, missing V1 capabilities and value at risk.** Reading must only reveal existing content; preserve prior discovery/looting. No evidence that Q05's dry bed is this site.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Map-read, discovered location and depleted container are world facts and can reconcile pre-completed objectives. Quest reporting must not respawn loot. Access/ownership requirements at the original map source are separate from possessing the map.

**Source reward reference.** relation Piotr +2; reputation competence +6, courage +8; renown +6; container contents of the ruins chest (❓ not listed in the builder) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** relation Piotr minimum acquainted

**Author question.** Keep the simple treasure expedition alongside Q05 with distinct maps and caches?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-mapa-do-skarbu/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-mapa-do-skarbu/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2733); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-009-dark-forest-ruins-treasure-map.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-009-dark-forest-ruins-treasure-map.md)

## R19

**Old Bones** — source `world:old-bones:<settlementId>:<caveId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Giver and claimant A, optionally claimant B; loot remains AND possess exact signet, then return A / give B / keep. createApp preflights live recipient and inventory space.

**What the historical decision says and why it may differ for V1.** Batch 44 retains competing signet claims; architecture/scope resets do not establish an inferior original.

**Potential V3 improvement / value.** Stronger claimant evidence and personal histories can improve an already branching property story.

**Conflicts, missing V1 capabilities and value at risk.** Immediate social deltas are not an evidence/exposure simulation. Do not equate Q13's wage claims with these remains or remove optional claimant route.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Binding requires eligible cave/anchor and deterministically selected actors; otherwise composition may omit the episode. Generic abandonment is disabled in these physical-item stories. Exact item custody, missing/dead recipients and capacity are important reachability limits; universal item-loss recovery was not established.

**Source reward reference.** return_to_first_claimant: relation claimant A +3, trust +4, benevolence +5, integrity +3, renown +3; give_to_second_claimant (only with a second claimant): relation claimant B +2, relation claimant A -2, trust +1, benevolence +2, integrity +1, renown +2; keep_signet: relation claimant A -1 (and B -1 if present), trust -1, integrity -2, renown +1; Remains contents (source REMAINS_SUPPLY): coin x4, bandage x1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Make entitlement evidence more explicit while retaining the two-claimant variant?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-old-bones-adventure-cave/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-old-bones-adventure-cave/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/oldBonesAdventureCave.ts](../../../src/quests/oldBonesAdventureCave.ts) (definition/builder near line 196); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/oldBonesAdventureCave.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-025-adventure-cave-old-bones.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-025-adventure-cave-old-bones.md); [quests-progression-035-story-item-inventory-and-cave-location-clarity.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-035-story-item-inventory-and-cave-location-clarity.md)

## R20

**Rat Plague** — source `plaga-szcurow` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **merge** — D-QUEST-10; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Marek's resolve_storage_rat_infestation requires existing registry record, repaired storage, destroyed nest and <=1 rat; reminders reflect remaining real work.

**What the historical decision says and why it may differ for V1.** Q-012/D-QUEST-10 merges world representations and guarantees home rat pressure; it explicitly requires real state, not a content-quality rejection.

**Potential V3 improvement / value.** Presentation could better explain causes and the three independent conditions.

**Conflicts, missing V1 capabilities and value at risk.** V1 already implements the core systemic shape proposed for V3. Replacing the quest with flags or deleting it because it says merge loses gameplay; poison/Rat Alpha are separate additions.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Completion is read from an existing real infestation snapshot; no registry is not success. Repeated source polling does not pay twice. Storage repair, nest and rat individual state are persisted by settlement/fauna authorities.

**Source reward reference.** relation Marek +2; reputation competence +4, benevolence +3; renown +5 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Preserve the existing system and evaluate any expanded encounter separately?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-plaga-szcurow/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-plaga-szcurow/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/quest-curation-and-q-012.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2496); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R21

**Message for Piotr** — source `relay-anna-piotr` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-37; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **enhance / reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna asks for dawn fishing message; talk to Piotr advances, then report to Anna for relation +1 each. No separation/reunion gate in this definition.

**What the historical decision says and why it may differ for V1.** D-QUEST-37 explicitly grounds urgency in actual spouse separation/reunion, not a fixed timer; no implementation-cost rationale is given.

**Potential V3 improvement / value.** Remove redundant return and make delivery fit real schedules; personal rewards fit the scale.

**Conflicts, missing V1 capabilities and value at risk.** Reunion-based automatic failure with -1 Anna can feel unfair if imminent. Need actual meeting knowledge and durable message occurrence; do not add a private proximity loop.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** relation Anna +1; relation Piotr +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Approve no-return delivery, and should an unexpectedly immediate reunion penalize an accepted errand?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-relay-anna-piotr/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-relay-anna-piotr/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/ann-peter-message-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1750); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R22

**Lonely Tower** — source `samotna-wieza` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-34; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **adapt** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr asks to inspect an existing tower; one interact_landmark and report currently concludes it is empty, relation +1.

**What the historical decision says and why it may differ for V1.** D-QUEST-34 adds ownership investigation and avoids bandit AI; creative expansion and explicit economy guardrails are both documented.

**Potential V3 improvement / value.** A compact stolen-valuables investigation could make the tower meaningful.

**Conflicts, missing V1 capabilities and value at risk.** This replaces an empty-place observation with a two-settlement legal/property story: real cache, claimant evidence, unclaimed-title grant and multiple transfers are new. Not a dialogue-only port.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The landmark builder offers this record only when bounded setup search resolves a site. Interaction and later report are separate; current source has no rescue/decay/claim mechanics merely because the prose describes that place.

**Source reward reference.** relation Piotr +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Replace the quiet empty tower with the larger cache investigation, or retain both as distinct site episodes?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-samotna-wieza/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-samotna-wieza/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/lonely-tower-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2693); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R23

**Shells for Kasia** — source `shells-dla-kasi` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-39; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Kasia receives 3 ordinary shell items at gather hand-in, relation +1. Gathering is inventory-based: prior stock works; there is no required sea waypoint.

**What the historical decision says and why it may differ for V1.** D-QUEST-39 specifies lasting visible decoration and exceptional-shell recognition; V3 milestone labels are delivery context, not reason to omit it in V1.

**Potential V3 improvement / value.** Persistent doorstep decoration turns a modest errand into a visible memory; accepting pearl shells broadens legitimate sourcing.

**Conflicts, missing V1 capabilities and value at risk.** Generic gather delivery consumes shells but has no default NPC inventory sink outside repair mapping. Need actual recipient handover/decoration and no duplicate reward; copper prices are not directly V1 coin units.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** relation Kasia +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Approve a lasting decoration and exceptional-shell branch, with values calibrated to V1?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-shells-dla-kasi/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-shells-dla-kasi/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/shells-for-kate-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1782); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R24

**Old Treasure in the Cave** — source `skarb-jaskini-niedzwiedzia` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Marek: recover grave map, talk for cave location, discover cave, carry exact sealed casket, open for all loot or return unopened for computed 30% of authored coins. Generic abandon is disabled to avoid stranding the instance.

**What the historical decision says and why it may differ for V1.** Batch 44 preserves physical casket choice; lawful access is quality/coherence, late V3 suppliers are implementation context.

**Potential V3 improvement / value.** Clarify grave permission and why the guard has a claim; retain action-driven choice and real bear/casket independence.

**Conflicts, missing V1 capabilities and value at risk.** Do not convert physical opening/return to a purely verbal ending. Q12's sword and bear are different assets. Named grave authority must not cover all graves.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Map/hidden find, special bear occupant and casket have separate world identities/state. Open and unopened return are mutually exclusive physical endings; generic abandonment is disabled. Preserve consumed/opened state across saves so loot/share cannot both be taken.

**Source reward reference.** treasure_kept: whole treasure kept (no quest reward listed); treasure_returned: coin (hidden, amount from treasureMapBearCaveReturnPayout), relation Marek +2, trust +4, integrity +3, renown +4 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep the action-driven split and establish the guard's lawful claim explicitly?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-skarb-jaskini-niedzwiedzia/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-skarb-jaskini-niedzwiedzia/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2918); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-008-treasure-map-bear-cave.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-008-treasure-map-bear-cave.md); [quests-progression-033-quest-offer-selection-prioritization-and-abandonment.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-033-quest-offer-selection-prioritization-and-abandonment.md)

## R25

**Trail by the Monolith** — source `slad-przy-monolicie` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **enhance / reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna requests a monolith route lookup with one game-hour reveal delay; receive knowledge, inspect bound monolith, report recent camp. If lookup fails, route_lost is a genuine failed outcome.

**What the historical decision says and why it may differ for V1.** Batch 44 says avoid artificial research timers but gives no finished alternative. That judgment must distinguish worker lookup from fictional NPC activity.

**Potential V3 improvement / value.** More meaningful evidence and a clearer missing-person follow-up may strengthen the currently short lead.

**Conflicts, missing V1 capabilities and value at risk.** Removing revealDelayDays alone does not create a guaranteed site or an NPC investigation. Keep bounded world-owned search and unavailable handling.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The landmark knowledge slot persists requested/resolved/unavailable state and stable ref; route_lost is a failed outcome when research cannot supply a route. Removing the delay must retain failed/unavailable handling.

**Source reward reference.** relation Anna +2 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Is the one-hour return visit useful pacing, or should a known route be given immediately?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-slad-przy-monolicie/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-slad-przy-monolicie/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2580); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-047-deferred-world-knowledge-and-location-research.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-047-deferred-world-knowledge-and-location-research.md)

## R26

**Disputed Wood** — source `sporne-drewno` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-22; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna introduces shared-pasture versus Piotr's cart; hear Piotr, choose priority. Both deliveries unlock sequentially using any prerequisites; neither spouse loses relation merely for coming second.

**What the historical decision says and why it may differ for V1.** D-QUEST-22 calls for both follow-ups, real repairs and a timed second bonus; most preservation-friendly structural choices already exist in V1.

**Potential V3 improvement / value.** Present a practical priority decision rather than a marital feud; keep both real sinks.

**Conflicts, missing V1 capabilities and value at risk.** Do not recreate an obsolete permanent lockout described in plan 005. Four-hour reward is a new change, not restoration; no timer may damage objects artificially.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** prioritize_anna: relation Anna +1, benevolence +3, trust +1, renown +2; prioritize_piotr: relation Piotr +1, competence +3, trust +1, renown +2 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep current sequential availability and decide the proposed timing bonus separately?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-sporne-drewno/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-sporne-drewno/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-timber-priority-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2290); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md); [quests-progression-005-authored-rpg-quests.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-005-authored-rpg-quests.md)

## R27

**Checking the Rock Cave** — source `sprawdz-szlak` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-36; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Kasia pays 12 coins for interacting with the specifically bound rockDen and reporting fresh tracks; it is a rock spawner, not a walk-in Cave V2.

**What the historical decision says and why it may differ for V1.** D-QUEST-36 gives Kate a distinct road/trade motive and allows shared evidence, honest omission or lies; no schedule motive documented.

**Potential V3 improvement / value.** More specific road-safety interpretation and explicit report choices are attractive.

**Conflicts, missing V1 capabilities and value at risk.** Need truthful observations and NPC knowledge if reports affect actual travel. Do not claim generic inspect text proves fauna presence, and do not merge with forestry merely because one visit helps both.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** coin x12 (shown) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Add report choices first, and reserve actual route/knowledge consequences for a separately justified scope?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-sprawdz-szlak/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-sprawdz-szlak/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/forest-and-road-scouting-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2040); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R28

**Old Ruins** — source `stare-ruiny` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **retire** — D-QUEST-35; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **unknown / low**; analyst classification, rationale below |
| Provisional recommendation | **reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr's conditional smallRuins interaction/report grants relation +1 and a quiet exploration lead.

**What the historical decision says and why it may differ for V1.** D-QUEST-35 explicitly retires the one-step empty-ruins quest but supplies no causal explanation beyond independent exploration surviving. Quality pruning is plausible, not established; schedule pressure is not documented.

**Potential V3 improvement / value.** May work better as ordinary conversation/knowledge, but that is a recommendation, not historical fact.

**Conflicts, missing V1 capabilities and value at risk.** Deleting it loses a low-pressure personal invitation, dialogue and relation opportunity; generic POI discovery is not automatically equivalent.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The landmark builder offers this record only when bounded setup search resolves a site. Interaction and later report are separate; current source has no rescue/decay/claim mechanics merely because the prose describes that place.

**Source reward reference.** relation Piotr +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep the quiet lead, demote it to ordinary dialogue, or retire it after evaluating early exploration density?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-stare-ruiny/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-stare-ruiny/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/old-ruins-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2551); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R29

**Suspicious Transport** — source `rpg:suspicious-transport:<settlementId>:<counterpartId>` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / medium**; analyst classification, rationale below |
| Provisional recommendation | **preserve / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** RPG-derived giver/counterpart bind one natural cave cache and unique Damascus-knife evidence; report_it / keep_quiet / keep_goods physically retain or transfer the item.

**What the historical decision says and why it may differ for V1.** Batch 44 retains the property dilemma and resets V3 scope; no specific original defect or replacement narrative is approved.

**Potential V3 improvement / value.** Sharper motives/evidence can improve the existing moral choice.

**Conflicts, missing V1 capabilities and value at risk.** The enriched cave version and generic RPG matrix are related materializations, not two automatic independent quests. Keep exclusive cache claims and stable ID; title alone does not equal tower stash.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Binding requires eligible cave/anchor and deterministically selected actors; otherwise composition may omit the episode. Generic abandonment is disabled in these physical-item stories. Exact item custody, missing/dead recipients and capacity are important reachability limits; universal item-loss recovery was not established.

**Source reward reference.** keep_quiet: coin x8 (hidden), relation giver +2, relation counterpart -1, trust +1, integrity -1, renown +1; report_it: relation counterpart +2, relation giver -1, integrity +4, courage +2, renown +2; keep_goods: relation giver -1, relation counterpart -1, trust -2, integrity -2, renown +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Retain the physical cache version and improve why each party claims it?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-suspicious-transport-cave-cache/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-suspicious-transport-cave-cache/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v1-remaining-quests-batch-curation.md). [src/quests/suspiciousTransportCaveCache.ts](../../../src/quests/suspiciousTransportCaveCache.ts) (definition/builder near line 96); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/suspiciousTransportCaveCache.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-024-suspicious-transport-natural-cave-cache.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-024-suspicious-transport-natural-cave-cache.md); [quests-progression-017-rpg-settlement-quest-matrices.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-017-rpg-settlement-quest-matrices.md)

## R30

**Wolf Den** — source `wilcza-jama` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-15; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider / enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** After Anna trusted + dangerous-wolf report, clear_wolf_den for WOLF_DEN_ID; report rewards obsidian sword. This checks den clearing, not permanent spawn destruction.

**What the historical decision says and why it may differ for V1.** Wolf curation keeps a distinct short den episode, but expressly questions redundant stages and avoids migration machinery.

**Potential V3 improvement / value.** Make clearing temporarily versus destroying permanently clear; keep the short thread distinct from Greybeard.

**Conflicts, missing V1 capabilities and value at risk.** Current same den is reused by settlement destruction and merchant reward. Splitting sites changes world binding; combining blindly removes the distinction between empty den and destroyed habitat.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The spawner owns clearing/permanent destruction; persisted destruction catches up on restore. Clearing and burning are different transitions. Shared WOLF_DEN_ID can advance other eligible quest perspectives, whose rewards are not deduplicated globally.

**Source reward reference.** obsidian_sword x1 (shown); relation Anna +3; reputation competence +15, courage +18, benevolence +6; renown +25 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** relation Anna minimum trusted; quest_outcome grozny-wilk: reported

**Author question.** Preserve two-step clearing/destruction depth and decide whether the short thread needs its own den?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-wilcza-jama/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-wilcza-jama/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/wolf-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2134); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-007-wolves-approach-settlement.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-007-wolves-approach-settlement.md); [quests-progression-004-quest-availability-and-prerequisites.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-004-quest-availability-and-prerequisites.md)

## R31

**Wolves Under the Settlement** — source `wilki-pod-osada` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-8, D-QUEST-14; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna's ungated permanent WOLF_DEN_ID destruction grants substantial local reputation/35 renown; same physical destruction can satisfy merchant and generated offers.

**What the historical decision says and why it may differ for V1.** Wolf curation links the larger pack to Greybeard by authored cause instead of expensive migration; it is not evidence V1's pressure simulation should be removed.

**Potential V3 improvement / value.** A causal larger-pack story could enrich existing real pressure.

**Conflicts, missing V1 capabilities and value at risk.** Making G07 a hard prerequisite delays an existing protection route and imports an unimplemented V2 story. Preserve fauna-owned pressure and destruction state.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The spawner owns clearing/permanent destruction; persisted destruction catches up on restore. Clearing and burning are different transitions. Shared WOLF_DEN_ID can advance other eligible quest perspectives, whose rewards are not deduplicated globally.

**Source reward reference.** relation Anna +2; reputation competence +20, courage +22, benevolence +8; renown +35 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Should the existing settlement threat stay independently resolvable, with Greybeard only a soft causal link?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-wilki-pod-osada/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-wilki-pod-osada/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/wolf-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2170); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-007-wolves-approach-settlement.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-007-wolves-approach-settlement.md)

## R32

**Wolves at the Merchant** — source `wilki-u-kupca` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **merge** — D-QUEST-14; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional consolidate / preserve** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Kasia offers ownership of one bound merchant horse for permanent den destruction; horse_lost fails if it dies. This is a concrete acquisition route.

**What the historical decision says and why it may differ for V1.** D-QUEST-14 merges the same den incident but explicitly preserves Kasia's horse perspective and leaves reward stacking open; no automatic reward removal is approved.

**Potential V3 improvement / value.** One incident can have Anna's public-safety and Kasia's property perspectives.

**Conflicts, missing V1 capabilities and value at risk.** Removing the record without preserving the horse transfer, reservation and death branch loses meaningful gameplay. Distinct justified entitlements can coexist even after consolidation.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The horse is a concrete ownership reward with availability/reservation checks; horse_lost is the failed outcome. Death/ownership availability can prevent the handover, and ordinary den credit must not recreate the animal.

**Source reward reference.** merchant horse (animal reward, id passed at composition) (shown); relation Kasia +2; reputation competence +8, courage +10; renown +8; horse_lost (failed): horse died, no reward These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** One multi-perspective story or compatible separate reports, while keeping the horse acquisition route?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-wilki-u-kupca/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-wilki-u-kupca/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/wolf-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2780); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R33

**Water for Marek** — source `woda-dla-marka` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-24; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Marek: interact_well then explicit report, 5 coins and relation +1. No filled vessel is required and guard-duty state is not checked.

**What the historical decision says and why it may differ for V1.** D-QUEST-24 corrects the mismatch between drawing water and physically bringing it to an occupied guard; no schedule pressure documented.

**Potential V3 improvement / value.** A believable small favour with actual water handover and relevant duty availability.

**Conflicts, missing V1 capabilities and value at risk.** Need narrow filled-vessel transfer semantics and duty lookup; don't lock NPC AI or discard/duplicate the vessel. Reward reduction is a new balance decision.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** coin x5 (shown); relation Marek +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Require real carried water and duty-only offering; keep any coin or reward only goodwill?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-woda-dla-marka/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-woda-dla-marka/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/water-quests-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1808); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R34

**Lost Parcel** — source `zaginiona-przesylka` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-20; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **adapt / author reconsideration** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Kasia's rockDen interaction creates no physical parcel; choose sealed return or guard disclosure with different rewards/relations/reactions.

**What the historical decision says and why it may differ for V1.** D-QUEST-20 explicitly protects Kate's honest characterization and replaces the correspondence dilemma with a fraud/gift story. This expands scope; no economy rationale for retirement is present.

**Potential V3 improvement / value.** Forged-relative evidence, early prevention versus later recovery, and personal shield gift offer much stronger character continuity.

**Conflicts, missing V1 capabilities and value at risk.** Full controlled handoff, criminal pursuit, advance recovery, smith commission, shield and pauldrons need real actors/stock/provenance. Existing privacy-versus-authority agency could be lost; Mark must not become omniscient.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** returned_sealed: coin x15 (hidden), relation Kasia +2, trust +5, integrity +6, renown +3; turned_over_to_guard: bandage x2 (hidden), relation Kasia -1, relation Marek +2, competence +4, courage +2, integrity +1, renown +2 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Replace the existing privacy dilemma with fraud/gift, or preserve that choice inside a revised honest-Kate story?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-zaginiona-przesylka/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-zaginiona-przesylka/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/lost-parcel-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2203); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-005-authored-rpg-quests.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-005-authored-rpg-quests.md); [quests-progression-050-socially-consequential-quest-dialogue.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-050-socially-consequential-quest-dialogue.md)

## R35

**Missing Cargo** — source `zaginiony-ladunek` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-26; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Marek's conditional shipwreck landmark visit/report says no crew are present, relation +1; there is no rescue/cargo simulation in this quest.

**What the historical decision says and why it may differ for V1.** D-QUEST-26 is an ambitious creative expansion: storm, rescue, mixed cargo and persistent survivors. Later Far/economy deferral is separate implementation staging.

**Potential V3 improvement / value.** A living-world rescue and salvage event is attractive, but far beyond new wording.

**Conflicts, missing V1 capabilities and value at risk.** Need durable injured crew, selective autonomous rescue/death, mixed-owner lots, knowledge and wreck changes. V1 health/travel/inventory foundations do not prove this incident exists.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The landmark builder offers this record only when bounded setup search resolves a site. Interaction and later report are separate; current source has no rescue/decay/claim mechanics merely because the prose describes that place.

**Source reward reference.** relation Marek +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Replace the abandoned-wreck survey with a time-sensitive rescue incident, and may NPCs resolve it before discovery?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-zaginiony-ladunek/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-zaginiony-ladunek/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/missing-cargo-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2662); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R36

**Lost Sheep** — source `zagubiona-owca` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **retire** — D-QUEST-9; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider / conditional consolidate** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna's authored find_animal sheep binds a real animal and on accept starts fauna-owned stray. Find then report pays 10 coins; death can fail.

**What the historical decision says and why it may differ for V1.** D-QUEST-9 calls it a generic lost-livestock mechanism, reserving G01 for theft; classification/scope coherence is explicit, low-quality writing is not.

**Potential V3 improvement / value.** Generated losses should arise from real events and allow different household owners.

**Conflicts, missing V1 capabilities and value at risk.** Generated per-animal quests do not fully replace this authored activation: they observe existing loss, and terminal per-animal IDs don't encode repeated loss occurrences. Dropping the authored record may reduce guaranteed early animal interaction.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The exact sheep is runtime-bound and livestock can rebind on restore. The authored accept hook starts a real stray; sheep_died fails with no reward. Rebinding still relies on the kind resolver, not an explicit saved incident target.

**Source reward reference.** coin x10 (shown); relation Anna +1; failed outcome: sheep died (no reward) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep Anna's starter stray or replace it only once event-driven frequency and repeat-loss identity are sufficient?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-zagubiona-owca/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-zagubiona-owca/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/lost-livestock-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1907); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R37

**Forgotten Cemetery** — source `zapomniany-cmentarz` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **merge** — D-QUEST-29; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider / conditional consolidate** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Kasia's conditional cemetery visit asks whether graves still stand; no actual tidying objective, relation +1.

**What the historical decision says and why it may differ for V1.** D-QUEST-29 consolidates cemetery care and optional Kate lead, preserving quiet help. It does not prove V1's two cemetery sites coincide.

**Potential V3 improvement / value.** Personal family motivation and real care from Q14 could add substance.

**Conflicts, missing V1 capabilities and value at risk.** Do not equate visiting home cemetery with caretaker permission at archaeologist settlement. If independent sites, a blanket merge reduces exploration and may misbind permission.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. The landmark builder offers this record only when bounded setup search resolves a site. Interaction and later report are separate; current source has no rescue/decay/claim mechanics merely because the prose describes that place.

**Source reward reference.** relation Kasia +1 These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Merge only when the actual cemetery and purpose coincide, otherwise retain the discovery lead?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-zapomniany-cmentarz/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-zapomniany-cmentarz/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/cemetery-care-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 2632); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R38

**Herbs for Anna** — source `ziola-dla-anny` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **retire** — D-QUEST-32; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / medium**; analyst classification, rationale below |
| Provisional recommendation | **reconsider / preserve** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Anna needs 3 generic herb for household stock; gather consumes them and pays 8 coins. It does not identify Anna as a professional herbalist.

**What the historical decision says and why it may differ for V1.** D-QUEST-32 prefers Dora/Toby's authored illness and recasts generic medicinal restocking as future economy demand. Profession coherence is explicit; treating this as real duplication is inferred and weak.

**Potential V3 improvement / value.** G04 adds specific people and reasons, but routine household supplies can still fit a farmer.

**Conflicts, missing V1 capabilities and value at risk.** G04 is absent in V1 and requires distinct herbs/illness/cast. Future generated restocking is not a present substitute; removing this loses a simple gathering/trade introduction.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** coin x8 (shown) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Keep the household errand alongside G04, or replace it with demonstrated stock-driven requests later?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-ziola-dla-anny/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v1/v1-ziola-dla-anny/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/g04-herbalist-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1977); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

## R39

**Scouting the Area** — source `zwiadowca` (V1).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-36; applies to V3's target, not automatically V1 |
| Current V1 status | **Implemented in current source**, subject to binding/availability and verification limits |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **enhance** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Piotr: inspect rockDen, spot stag or explicitly report saw/didn't see, deliver 2 stones. Lie action applies integrity penalty; final report text still asserts a stag.

**What the historical decision says and why it may differ for V1.** D-QUEST-36 removes arbitrary stag/stone proofs and gives forestry scouting a practical purpose; no schedule motive documented.

**Potential V3 improvement / value.** Remove irrelevant proof collection and make forestry versus road reports distinct; preserve noncombat exploration and choice.

**Conflicts, missing V1 capabilities and value at risk.** The stone objective checks ordinary stone, not mountain provenance. Honest bypass can still lead to misleading final prose: a concrete content inconsistency. Existing unconditional lie penalty differs from future evidence-based exposure.

**Lifecycle, persistence and verification limit.** Quest progress is restored by this stable definition ID; NPC matching uses bound NpcId. Text/history still projects from current definitions, so stage/action reordering is not save-neutral. Explicit interaction/hand-in/report drives completion; no additional expiry/failure mechanic is established by this definition. Ordinary decline/abandonment follows QuestManager policy where allowed; it does not undo the world.

**Source reward reference.** relation Piotr +1; integrity -2 (dialogue lie branch); relation Piotr -1 (lie branch, acquainted or lower) These are definition-level references; physical loot/ownership and payer funding must be distinguished from direct grants.

**Source prerequisite reference.** No explicit metadata prerequisite; actual contextual binding, world state and offer policy still govern.

**Author question.** Replace stag/stone gating with actual forestry evidence, retaining honest incomplete reporting?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v1/v1-zwiadowca/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v1/v1-zwiadowca/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/forest-and-road-scouting-quest-curation.md). [src/quests/quests.ts](../../../src/quests/quests.ts) (definition/builder near line 1834); [composition, world lookups and physical transfers](../../../src/app/createApp.ts); [relevant test source](../../../src/quests/QuestManager.test.ts) (read, not executed).

**Fuller original material.** [quests-progression-018-quest-playtest-reachability-and-dialogue-conflicts.md](../../../docs/v3-donor/quests/sources/v1-progression-plans/quests-progression-018-quest-playtest-reachability-and-dialogue-conflicts.md)

## R40

**Lost Lamb** — source `G01` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-42, D-QUEST-9; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent as authored content in V1. V2 source defines Molly, Pip, hungry Piers, latch/prints/guard leads, evidence/payment/discreet recovery/guard routes; sold/lapsed outcomes exist in source, not V1.

**What the historical decision says and why it may differ for V1.** D-QUEST-42 preserves four theft-recovery routes, replaces arbitrary 48-hour disappearance with real travel/custody, and permits staging actual work restitution when shared systems are unavailable.

**Potential V3 improvement / value.** A theft with compassionate restitution is distinct from an ordinary stray, and offers several ways to resolve one incident.

**Conflicts, missing V1 capabilities and value at risk.** Need stable stolen-lamb custody, real payer/item transfers, traveller availability and evidence. V1 animal ownership/travel are foundations, not finished Pip restitution. Quest-linked survival bonuses are a separate product exception.

**Source reward reference.** evidence: pay 15 and give 2 wool from Molly; rep helpfulness+10; paid: pay 25 and give 2 wool from Molly; rep helpfulness+5; taken_back: pay 15 and give 2 wool from Molly; rep helpfulness+8 courage+3; guard: pay 15 and give 2 wool from Molly; rep helpfulness+8; sold: none (Pip is lost) These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 1 to 5; not near the pen (r=40)

**Author question.** Introduce the theft story, and separately accept or reject V3's quest-only traveller survival advantage?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g01-lost-lamb/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g01-lost-lamb/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/g01-lost-lamb-and-quest-traveller-protection-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g01.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-01-lost-lamb.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-01-lost-lamb.md)

## R41

**Rusty Debt** — source `G02` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-41; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 full scenario and definition expose reduced-price / repair then pay / return / pressure outcomes; real treasury/purse pay effects exist, alongside onOffer plowshare grant and timed mending stub.

**What the historical decision says and why it may differ for V1.** D-QUEST-41 makes both buyer and smith legitimately partly right, connects a temporary damaged tool to Q04, and keeps independent startability. No retirement for schedule is documented.

**Potential V3 improvement / value.** Commercial negotiation adds a profession story rather than another collection errand.

**Conflicts, missing V1 capabilities and value at risk.** Need actual flawed plowshare and a buyer with credible budget; choose household versus communal payer from final casting. V1 does not automatically have this inspected item/service or all four world consequences.

**Source reward reference.** Original V2 definition: Bernard pays player 8 / 12 / 5 / 12 coins for settled30 / mended / returned / pressured; household/treasury-to-smith payment is separate. Mended also uses repairHeld (equipped item durability service), with explicit local opinions/reputation. These values are historical, not V1 balance.

**Source prerequisite reference.** visited V; treasury at 35 or more (which treasury: not stated)

**Author question.** Keep all four negotiations and a soft Q04 link, with who actually owns and pays for the share?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g02-rusty-debt/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g02-rusty-debt/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/g02-rusty-debt-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g02.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-02-rusty-debt.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-02-rusty-debt.md)

## R42

**Night Torches** — source `G03` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **keep** — D-QUEST-12, D-QUEST-13; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 G03 has actual post-snuffing rule, watch/mother leads and together/show/tell routes, but source notes admit Hazel snaps/holds and several ending behaviours are only prose.

**What the historical decision says and why it may differ for V1.** D-QUEST-12/13 keeps Hazel's fear story distinct from routine torch duty and resolves the Mark/Q07 collision by next dusk. A claim that V1 duty must be deleted is a separate choice.

**Potential V3 improvement / value.** A sympathetic mystery uses existing torch infrastructure and can link softly to Greybeard's family.

**Conflicts, missing V1 capabilities and value at risk.** Need child/parents cast, believable snuffing actions, dusk scheduling and durable follow-through. Do not import quest AI holds, teleporting child or automatic timer payout as proof of a real scene.

**Source reward reference.** together: pay 15 from home treasury; rep helpfulness+10 honesty+5; show: pay 15 from home treasury; rep helpfulness+8; tell: pay 15 from home treasury; rep honesty+5; markSolved: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 3 to 10; posts 1 or more

**Author question.** Add Hazel's mystery while preserving the independent V1 evening duty, or intentionally replace that activity?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g03-night-torches/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g03-night-torches/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/quest-curation-and-q-012.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g03.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-03-night-torches.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-03-night-torches.md)

## R43

**Root by the Stream** — source `G04` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-32; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 G04 requests yarrow x2, mint x2, chamomile x1; any-source delivery/advance and early/late rewards. Full design exists despite thin catalogue claiming otherwise; actual source stubs sickness/presentation and lapses.

**What the historical decision says and why it may differ for V1.** D-QUEST-32 retains a child's illness but rejects special caregiver AI, random quest-only hemlock swaps and fixed death clock. Both quality and explicit scope limits are documented.

**Potential V3 improvement / value.** Specific family stakes, honest sourcing alternatives and a short Toby follow-up are worthwhile.

**Conflicts, missing V1 capabilities and value at risk.** Need actual child illness/treatment effect, herb identity/availability and household stocks. Do not replace existing V1 medical systems with V2 quest timer; no automatic equivalence to Anna's generic herb stock.

**Source reward reference.** ontime: pay 20 from Dora if the advance flag is 10, otherwise 30; rep helpfulness+10; late: pay 5 from Dora if the advance flag is 10, otherwise 15; rep helpfulness+5; failed: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 3 or later; Dora alive

**Author question.** Add Dora/Toby without deleting Anna's household errand, and how much urgency should actual health create?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g04-root-by-the-stream/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g04-root-by-the-stream/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/g04-herbalist-quest-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g04.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-04-root-by-the-stream.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-04-root-by-the-stream.md)

## R44

**Disputed Oak** — source `G05` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-27; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — major new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 design has timber/acorns, ambiguous boundary and shared/for-H/for-V resolutions; V3 bridge/alternate-tree/point-of-no-return direction supersedes it.

**What the historical decision says and why it may differ for V1.** D-QUEST-27 replaces a boundary dispute/roof timber with shared oak versus collapsed bridge, accepts alternate tree and autonomous rebuilding, but explicitly defers if pigs are costly and rejects a special feed-loss simulation.

**Potential V3 improvement / value.** A genuine common-resource tradeoff with costly alternatives and observable preparation is strong living-world content.

**Conflicts, missing V1 capabilities and value at risk.** Existing felling/roads/bridge geometry do not establish repairable collapsed bridge, suitable beam transport, pig husbandry or warning propagation. Autonomy may consume the story before the player arrives.

**Source reward reference.** shared: pay 12 from H and 12 from V; rep helpfulness+8 (H, V); for_h: pay 15 from H; rep honesty+5 (H) and honesty-5 (V); for_v: pay 15 from V; rep honesty+5 (V); felled_at_night: rep honesty-20 (H, V); dropped: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V

**Author question.** Accept bridge rather than roof stakes, irreversible start-of-felling, and selective autonomous resolution before acceptance?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g05-disputed-oak/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g05-disputed-oak/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/disputed-oak-g05-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g05.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-05-disputed-oak.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-05-disputed-oak.md)

## R45

**The Trader's Letter** — source `G06` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-31; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 Stephen-to-Jack letter has support/cap/refuse/public choices, real priceMod/pay effects and partial-purse transfers; public meeting and poor-household protection are incomplete.

**What the historical decision says and why it may differ for V1.** D-QUEST-31 preserves four grain-policy choices and a coherent self-interested trader, but rejects full market optimization as a prerequisite.

**Potential V3 improvement / value.** Local economic ethics and a consistent merchant character broaden the portfolio.

**Conflicts, missing V1 capabilities and value at risk.** Need real bounded price consequences consistent with V1 household economy, owned letter, payer and exposure. A bare global player price multiplier is not the promised effect on poorer households.

**Source reward reference.** agreed: pay 10 from Stephen; letter consumed; capped: pay 12 from Stephen; rep helpfulness+5 (H, V); letter consumed; refused: pay 10 from Stephen; letter consumed; public: pay 10 from Stephen and 10 from V treasury; rep honesty+10 renown+5 (H, V); letter consumed; late: none (letter consumed) These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V; Stephen opinion 10 or more, or quest q09 done (started)

**Author question.** Should the bargain change actual household grain affordability, or remain a smaller social negotiation?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g06-traders-letter/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g06-traders-letter/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q09-g06-trade-quests-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g06.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-06-traders-letter.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-06-traders-letter.md)

## R46

**Trail of the Grey Wolf** — source `G07` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **keep** — D-QUEST-8, D-QUEST-16; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent as Greybeard story in V1. V2 defines a unique alpha, missing-toe clues, kill/drive/poison, and a one-time abstract Jacob damage assist; source records stubs and timers.

**What the historical decision says and why it may differ for V1.** Wolf curation preserves Jacob's personal wolf and uses narrative territory displacement instead of generic migration. Simplified causation is explicit economy, not a reason to simplify V1 ecology.

**Potential V3 improvement / value.** Named evidence and family loss make this different from the short dangerous-wolf job.

**Conflicts, missing V1 capabilities and value at risk.** Need persistent notable wolf identity and coherent nonlethal/poison outcomes. V1 generic kill binding invalidates on reload; do not import V2 spawn-on-offer or abstract remote damage.

**Source reward reference.** kill: pay 30 from H treasury; rep courage+10; drive: pay 20 from H treasury; rep courage+5 helpfulness+5; poison: pay 20 from H treasury; gaveUp: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 2 or later; posts 1 or more

**Author question.** Keep kill/drive/poison options, and should settlement-pack escalation be optional narrative rather than a compulsory chain?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g07-trail-of-greybeard/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g07-trail-of-greybeard/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/wolf-quest-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g07.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-07-trail-of-greybeard.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-07-trail-of-greybeard.md)

## R47

**Well and Rumor** — source `G08` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-25; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 source has Ralph, sick wife/Stephen, Dora, Tom's spoiled barrel, truth/quiet/accusation plus automatic traced; accusation is blocked after enough clues and apology exists, contrary to V3 target.

**What the historical decision says and why it may differ for V1.** D-QUEST-25/40 replaces invisible dwell clues with explicit interaction, permits deliberate false accusation and rejects an extra restitution ending to bound complexity. The reason for that last limit is stated complexity, not proof more agency is bad.

**Potential V3 improvement / value.** One of the clearest narrative candidates: misleading rumour, inspectable evidence, public truth versus private resolution versus chosen injustice.

**Conflicts, missing V1 capabilities and value at risk.** Need actual spoiled barrel/health facts and knowledge of who accused whom. Existing relations/news are partial foundations; serious delayed exposure is not an automatic generic effect. Imported apology and V3 no-apology conflict.

**Source reward reference.** truth: pay 25 from H treasury; rep honesty+10; quiet: pay 20 from H treasury; give 1 small_beer from Tom's store; rep helpfulness+10; accusation: rep honesty-15 (H, V); V price multiplier 1.2 for 30 days; traced: none (heal effect only) These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 4 or later; Tom alive

**Author question.** Keep the three V3 endings with deliberate false blame and no apology, or preserve a later restitution opportunity?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/g08-well-and-rumor/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/g08-well-and-rumor/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/water-quests-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/g08.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [grok-quest-08-well-and-rumor.md](../../../docs/v3-donor/quests/sources/v2-design/grok-quest-08-well-and-rumor.md)

## R48

**A Hare Out of Place** — source `Q01` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **retire** — D-QUEST-23; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **reconsider — optional new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 design/source notes describe Luke, rare hare, pelt/ordinary game/watch outcomes; observation-with-companion was partial. No copied q01.ts is present in this archive.

**What the historical decision says and why it may differ for V1.** D-QUEST-23 explicitly chooses a simple fox quest and rejects the apprentice/white-hare subplot. This is author-selected simplicity; no schedule-pressure explanation is evidenced.

**Potential V3 improvement / value.** Could supply nonlethal animal observation and mentorship, which fox hunting does not replace.

**Conflicts, missing V1 capabilities and value at risk.** Not the same incident or animal as fox. Introducing it needs notable hare/companion follow-through; retiring it from V3 lost portfolio variety, not an already implemented V1 quest.

**Source reward reference.** pelt: pay 20 from Stephen to player; pay 15 from player to Luke; rep helpfulness+5 courage+2; ordinary: pay 6 from Stephen to player; rep helpfulness+3; watch: give 10 arrow and 2 dried_meat from Jacob's store; rep helpfulness+3 renown+2; faded: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 2 or later; no threat within r=400

**Author question.** Still prefer no apprenticeship story, or retain it as an independent future candidate without expanding the fox quest?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v2/q01-a-hare-out-of-place/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v2/q01-a-hare-out-of-place/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/fox-hunt-quest-curation.md). [original V2 definition in live V3 comparison archive](https://github.com/jm-sky/seedvale-v3/blob/907e17cd2ad487547a25a1f928b2770348183d75/docs/comparison/code/SeedVales-v2/src/game/data/quests/q01.ts) (read at donor pin; not V3 runtime).

**Fuller original material.** [q01-a-hare-out-of-place.md](../../../docs/v3-donor/quests/sources/v2-design/q01-a-hare-out-of-place.md)

## R49

**The Hollow Below the Road** — source `Q02` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-21; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 proposes clear den / physical road detour / watch shifts until departure; source has quest scaffolding, but text alone cannot establish a built road or real seasonal animal departure.

**What the historical decision says and why it may differ for V1.** D-QUEST-21 keeps a separate sow-with-young incident and allows staged den arrival to avoid generic migration. Exact endings remain candidates, not fully approved canon.

**Potential V3 improvement / value.** The dilemma gives nonlethal options and weighs public travel against animal care.

**Conflicts, missing V1 capabilities and value at risk.** Need exact sow/piglet identity, real road danger, and whichever detour/escort supplier is selected. V1's meadow boar definition does not cover these alternate outcomes.

**Source reward reference.** clear: pay 40 from V treasury; rep courage+5 helpfulness+5 (V); reroute: pay 22 from V treasury; give 2 bread from Bridget's store; rep helpfulness+6 (V); watch: rep helpfulness+4 (V); settled: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V

**Author question.** Which endings must change the physical road/guard work, and which can be omitted only after explicit discussion?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q02-the-hollow-below-the-road/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q02-the-hollow-below-the-road/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/boar-quests-v1-q02-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q02.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q02-the-hollow-below-the-road.md](../../../docs/v3-donor/quests/sources/v2-design/q02-the-hollow-below-the-road.md)

## R50

**A Roof Before Rain** — source `Q03` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-38; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt / reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent as roof quest in V1. V2 repair / lean-to / temporary prop design has some physical repair/shed transfer, but prop durability and reopening are stubs. V1 already has independent foundation/fence deliveries.

**What the historical decision says and why it may differ for V1.** D-QUEST-38 recasts the Hewer roof as Woodward continuity and retains three plans; M10+ staging is explicitly architectural. Guaranteed weather adds ambition, not cost savings.

**Potential V3 improvement / value.** A follow-up can make the familiar household feel continuous and show different solutions.

**Conflicts, missing V1 capabilities and value at risk.** Pure V1 computeWeather cannot accept donor weatherMachine reservations verbatim. Need real roof damage, actual choice effects and autonomy; dry room and prop are not generic foundation repair.

**Source reward reference.** repair: rep helpfulness+4 and give 6 branch from the common store (only if the player contributed); 2 logs from the common store consumed; repair and lean_to: Lucy's thanks, 2 bread and 1 milk, or 10 c from Miles (player choice); lean_to: rep helpfulness+3; repair_npc, prop, family: no reward These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** Miles's house durability below 60

**Author question.** Keep three real outcomes, and is a forced global storm worth changing the weather contract?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q03-a-roof-before-rain/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q03-a-roof-before-rain/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/woodward-roof-storm-quest-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q03.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q03-a-roof-before-rain.md](../../../docs/v3-donor/quests/sources/v2-design/q03-a-roof-before-rain.md)

## R51

**The Handle Remembers** — source `Q04` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-30, D-QUEST-41; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 full story has test/crack discovery, reforge/new/keepsake; definition uses timed work and generic repairHeld/new hammer grants; several professional/epilogue effects remain unimplemented.

**What the historical decision says and why it may differ for V1.** D-QUEST-30 makes a damaged tool rather than chronic age impairment the cause, keeps three emotional choices, and expressly allows simplifying costly branches instead of new smithing physics.

**Potential V3 improvement / value.** An intimate family story is a good counterweight to hunts and treasure, with optional G02 continuity.

**Conflicts, missing V1 capabilities and value at risk.** Need a single owned old hammer, inspectable defect, real replacement/keepsake disposition and service reward. Normal V1 smith production is not this custom commissioned order.

**Source reward reference.** forged: if a new hammer was ordered, grant 1 hammer and pay 8 from Sophie; otherwise the old hammer is repaired; rep helpfulness+6 (V); keepsake: give 1 bread from Sophie's store; stalled: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V

**Author question.** Preserve all three resolutions with bounded item/service effects and no global work-quality modifier?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q04-the-handle-remembers/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q04-the-handle-remembers/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q04-handle-remembers-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q04.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q04-the-handle-remembers.md](../../../docs/v3-donor/quests/sources/v2-design/q04-the-handle-remembers.md)

## R52

**The Map That Missed the River** — source `Q05` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-43; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 old-map/dry-channel/stone-circle strongbox, family/ford/gem routes. Copied code contains payShare (190 coins), emerald handover and Silas transfers; meta's journal-only implication is incomplete.

**What the historical decision says and why it may differ for V1.** D-QUEST-43 preserves family treasure and geographical deduction but explicitly declines obligatory seasonal route, outpost or optional resource industry.

**Potential V3 improvement / value.** Geography as a clue and separately chosen treasure disposition are strong exploration ideas.

**Conflicts, missing V1 capabilities and value at risk.** Need plausible actual old channel/circle, stable strongbox and family rights. Sharing knowledge need not modify road graph. Do not generate optional deposit at activation or conflate with V1 dark forest.

**Source reward reference.** Original V2 code: family/ford call payShare (Silas emerald purchase transfer 180 to Rosalind, then 190 to player, subject to actual engine payment semantics); keep_gem transfers one emerald instead. Relevant effects occur in dialogue/rules, not only terminal endings. Proposed road/discount effects are separate.

**Source prerequisite reference.** visited T; anchor "circle" exists

**Author question.** Make geographic deduction central while leaving resource deposit and new route entirely optional?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q05-the-map-that-missed-the-river/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q05-the-map-that-missed-the-river/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q05-map-riverbed-resource-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q05.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q05-the-map-that-missed-the-river.md](../../../docs/v3-donor/quests/sources/v2-design/q05-the-map-that-missed-the-river.md)

## R53

**Room for One More** — source `Q06` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-33; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 pre-paid axe head/wedges order, Matthew's autonomy and travel dialogue; full three-route design, paid route is player expense rather than a player reward.

**What the historical decision says and why it may differ for V1.** D-QUEST-33 retains paid/voluntary/solo routes and explicitly defers accompanied branches when shared companions are unready; it forbids turning solo-only staging into final canon.

**Potential V3 improvement / value.** A low-stakes journey can develop a companion's independence instead of using them as quest property.

**Conflicts, missing V1 capabilities and value at risk.** Generic V1 expedition/travel is not automatically a consenting player follower with wages, equipment and departure rules. Need real authorization/order stock and durable companion agreement.

**Source reward reference.** paid: player pays 20 to Matthew (hired for four days); rep helpfulness+3; free: rep helpfulness+3; solo: pay 5 from Miles to player; dropped: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V; day 3 or later

**Author question.** Are all three routes the final target, with solo-only allowed only as a clearly incomplete stage?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q06-room-for-one-more/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q06-room-for-one-more/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q06-room-for-one-more-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q06.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q06-room-for-one-more.md](../../../docs/v3-donor/quests/sources/v2-design/q06-room-for-one-more.md)

## R54

**Six Bowls, One Pan** — source `Q07` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-28, D-QUEST-13; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 Hewer supper has together/shifts/doorstep and roast-meat consumption, but guard round uses bounded AI holds and some family beats are dialogue only.

**What the historical decision says and why it may differ for V1.** D-QUEST-28 makes an ordinary Woodward meal independent of roof emergencies, preserves alternative arrangements and real food; it rejects artificial holds/coin payouts. Delivery staging is a distinct cost constraint.

**Potential V3 improvement / value.** One of the best social additions: familiar NPCs, optional help, a memory and an actual meal without manufactured danger.

**Conflicts, missing V1 capabilities and value at risk.** Need shared stock/freshness/cooking capacity, invite/attendance and interruptible duties. Current V1 evening-light duty is a useful activity, not automatically obsolete. No extra Hewer relatives should become Woodwards.

**Source reward reference.** Original V2 source/scenario: meal consumes four roast-meat items and adjusts guests' social/opinion/reputation; the torch-rack topic is a separate once-per-day store transfer after together. Imported metadata's 'no reward effects'/'journal only' is incomplete. No automatic V1 coin reward is proposed.

**Source prerequisite reference.** quest q03 done (started), or Lucy opinion 10 or more

**Author question.** Add the social meal while keeping routine evening duty and allowing guests to miss or adapt it?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q07-six-bowls-one-pan/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q07-six-bowls-one-pan/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q07-woodward-supper-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q07.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q07-six-bowls-one-pan.md](../../../docs/v3-donor/quests/sources/v2-design/q07-six-bowls-one-pan.md)

## R55

**The Long Way to Water** — source `Q08` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **defer** — D-QUEST-40; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **architecture / high**; analyst classification, rationale below |
| Provisional recommendation | **defer — new content decision** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 sheep obstruct common well, trough/well/rota choices. Source notes admit missing livestock route change and maintenance enforcement; payout is not proof of benefit.

**What the historical decision says and why it may differ for V1.** D-QUEST-40 explicitly defers final narrative selection pending shared livestock/water/construction design; it does not reject the rota or decide the finished quest.

**Potential V3 improvement / value.** Water access with ongoing responsibility is potentially valuable if it changes daily life.

**Conflicts, missing V1 capabilities and value at risk.** V1 wells/building and livestock are foundations; no verified sheep-to-well routing, filled-trough authority or lasting rota. Do not mark it ready merely because V1 can build a well.

**Source reward reference.** trough: give 3 wool from Elspeth's store; pay 15 from V treasury; rep helpfulness+6 (V); well: pay 40 from V treasury; rep helpfulness+10 (V); rota: pay 10 from V treasury; rep helpfulness+3 (V); dropped: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** visited V

**Author question.** Which options improve actual livestock water access, and who must maintain them?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v2/q08-the-long-way-to-water/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v2/q08-the-long-way-to-water/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/water-quests-curation.md). [original V2 definition in live V3 comparison archive](https://github.com/jm-sky/seedvale-v3/blob/907e17cd2ad487547a25a1f928b2770348183d75/docs/comparison/code/SeedVales-v2/src/game/data/quests/q08.ts) (read at donor pin; not V3 runtime).

**Fuller original material.** [q08-the-long-way-to-water.md](../../../docs/v3-donor/quests/sources/v2-design/q08-the-long-way-to-water.md)

## R56

**Goods on the Ground** — source `Q09` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-31; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 needs/stock conversations and three deals; source grants tools/planks at offer and later ingots, while some speed/loan/discount effects are stubs.

**What the historical decision says and why it may differ for V1.** D-QUEST-31 preserves barter/consignment/order but avoids a whole market optimizer. V3 economy gating is not evidence the story should replace V1 transport.

**Potential V3 improvement / value.** Physical weight, real household surpluses and trust make trade meaningful beyond prices.

**Conflicts, missing V1 capabilities and value at risk.** Reuse V1 inventory/transport/accounting where applicable. New saw/shears/sickle/order definitions, funded consignment and actual journey fulfilment are not supplied by the story; avoid logged grants as substitute production.

**Source reward reference.** barter: pay 10 from Stephen; rep helpfulness+10; consign: Stephen pays Molly 12 and Miles 18, then 10 to player; Molly and Miles pay player 5 each; rep helpfulness+12; order: grant 2 iron_ingot to Stephen's purse; rep helpfulness+5; stalled: none These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** day 3 or later

**Author question.** Should all three deals entail physical delivery, and how should loss/delay affect consignment?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q09-goods-on-the-ground/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q09-goods-on-the-ground/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/q09-g06-trade-quests-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q09.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [q09-goods-on-the-ground.md](../../../docs/v3-donor/quests/sources/v2-design/q09-goods-on-the-ground.md)

## R57

**What the Mountain Owes** — source `Q10` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **retire** — D-QUEST-45; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional consolidate / reconsider** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** No Q10 quest in V1 or V2 runtime snapshot; design only. Agnes/Silas/Baldwin propose sale, production share or seasonal town extraction, ventilation and a real adit.

**What the historical decision says and why it may differ for V1.** D-QUEST-45 prioritizes the V1 mine line to avoid a second mine economy/claims. Earlier V2 D-PLAN-11 was a delivery deferral; that is a different decision from V3 retirement.

**Potential V3 improvement / value.** Selective safety, stakeholder negotiation and seasonal-care ideas may improve the V1 mine line.

**Conflicts, missing V1 capabilities and value at risk.** V1 mine, finite deposits, source entitlements and expedition/bootstrap primitives exist, but quests-progression-010 remains planned and colony streaming is not proved complete. Do not claim a finished V1 mine quest or copy the 10%/600-coin proposal.

**Source reward reference.** No source reward extracted in metadata; use the definition/full scenario. These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** needs QUEST-03 engine, cave/adit WORLD-05, outpost SET-04, miner NPC-06 (all deferred)

**Author question.** Keep V1 mine authority while considering Agnes/safety/seasonal extraction as optional ideas rather than a second mine?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/dispositions/catalog/v2/q10-what-the-mountain-owes/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/dispositions/catalog/v2/q10-what-the-mountain-owes/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v2-q10-q13-and-exploration-rewards-curation.md). Design only; the source index does not register Q10.

**Fuller original material.** [q10-what-the-mountain-owes.md](../../../docs/v3-donor/quests/sources/v2-design/q10-what-the-mountain-owes.md)

## R58

**The Bell in Blackwater** — source `Q11` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-45; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — major new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 marsh chapel, heavy bell/chest, moose and crossing/sale/investor options; code actually pays 130 sale, 40 investor and bounded weekly 8-coin transfers, although ending metadata alone suggests prose.

**What the historical decision says and why it may differ for V1.** D-QUEST-45 retains community property and use choices at lower priority; seasonal water/causeway/boats are deliberately not approved mandatory mechanisms. Exact reason for lower priority is unstated.

**Potential V3 improvement / value.** Memorable physical salvage and a community-versus-private use choice.

**Conflicts, missing V1 capabilities and value at risk.** Bridge/causeway rebuilt flag is not an actual traversal improvement. Need weight/carry/salvage, true common title and revenue source before recurring dividends; pure elapsed-time payout is insufficient.

**Source reward reference.** Original V2 definition: sale transfers bell/bars to Silas, pays 470 to V treasury then 130 to player; investor pays 80 from player to Eve and 40 from treasury to player; crossing pays 60 after the built rule; done-phase tolls pay 8 every seven days, max eight. These are implemented transfer declarations, not proof of physical road construction or earned service revenue.

**Source prerequisite reference.** visited V; anchor "chapel" exists

**Author question.** Which world effect must be real: recovered bell, rebuilt crossing, or income-producing service?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q11-bell-in-blackwater/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q11-bell-in-blackwater/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v2-q10-q13-and-exploration-rewards-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q11.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [codex-quest-11-bell-in-blackwater.md](../../../docs/v3-donor/quests/sources/v2-design/codex-quest-11-bell-in-blackwater.md)

## R59

**The Iron Under the Pine** — source `Q12` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-45; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 Duncan's captain Martin, Pinewatch locker/bear, guard/sale/carry; code has real sword grant/transfer, 40-coin armoury choice and 125 sale transfer, contrary to a terminal-effects-only reading.

**What the historical decision says and why it may differ for V1.** D-QUEST-45 keeps exceptional sword, history and alternate destinations and explicitly welcomes generous rewards; it does not authorize every patrol/variant requirement.

**Potential V3 improvement / value.** A fine weapon with a remembered person and genuine destination choice is attractive.

**Conflicts, missing V1 capabilities and value at risk.** Need distinct Pinewatch sword/site/bear, permission and implemented task if retention requires patrol. E01's at-home sword is owned property and must remain a different item/story.

**Source reward reference.** Original V2 definition: guard gives actual sword to Willa, then choice of chainmail/crossbow from warehouse plus 40 coins; sale transfers sword to Silas, 500 to treasury and 125 to player; carry retains the already granted sword after the patrol condition. Armoury stock is granted by a rule. Actual transfer effects exist outside terminal endings.

**Source prerequisite reference.** visited T; anchor "tower" exists

**Author question.** Keep the exceptional sword and all destinations, with what meaningful effort makes keeping it legitimate?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q12-iron-under-the-pine/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q12-iron-under-the-pine/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v2-q10-q13-and-exploration-rewards-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q12.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [codex-quest-12-iron-under-the-pine.md](../../../docs/v3-donor/quests/sources/v2-design/codex-quest-12-iron-under-the-pine.md)

## R60

**The Ash House Vault** — source `Q13` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-45; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **mixed / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt — new content** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent in V1. V2 Irene/Samuel estate, wage packet, claimant descendants and rebuild/debts/sale; code has actual 180 minted historical coins, share/20-coin wage/400 sale/50 player payments, while waystation is not established as built.

**What the historical decision says and why it may differ for V1.** D-QUEST-45 retains inheritance/unpaid wages and multiple outcomes, but declines mandatory waystation rebuilding without shared capability.

**Potential V3 improvement / value.** Historical labour claims make a fortune more than generic loot and support several morally credible endings.

**Conflicts, missing V1 capabilities and value at risk.** Need real estate/container rights and evidence, payer conservation after initial treasure creation, and any actual bed/road-stop. V1 consequence registry is empty foundation, not this building.

**Source reward reference.** Original V2 definition: vault creates 180 historical coins plus physical items; handover transfers them to Irene; player share is ruby / cuirass / 100 coins; Samuel receives 20, another claimant may receive 20; sale pays 400 Silas→Irene and 50 Irene→player. No demonstrated constructed waystation follows just from the journal.

**Source prerequisite reference.** visited T; anchor "ash" exists

**Author question.** Keep inheritance and wage choices without promising a functioning waystation until a real supplier exists?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q13-ash-house-vault/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q13-ash-house-vault/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/v2-q10-q13-and-exploration-rewards-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q13.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** [codex-quest-13-ash-house-vault.md](../../../docs/v3-donor/quests/sources/v2-design/codex-quest-13-ash-house-vault.md)

## R61

**Weeds on the Hill** — source `Q14` (V2).

| Field | Finding |
|---|---|
| Historical disposition | **rewrite** — D-QUEST-29, D-QUEST-44; applies to V3's target, not automatically V1 |
| Current V1 status | **Absent as an authored V1 story**; introduction would be new content |
| V3 maturity | Curated narrative/design only; no implemented portfolio quest runtime found at donor pin |
| Motivation / confidence | **quality / high**; analyst classification, rationale below |
| Provisional recommendation | **conditional adapt / conditional consolidate** |
| Author decision required | Yes before selecting the proposed content or consolidation |

**Existing behaviour / original story.** Absent as Q14 in V1. V2 definition (no full scenario) counts five tidy actions then report; any cemetery dig causes desecrated, 240-hour unaccepted lapse. V1 already has separate grave permission/search content.

**What the historical decision says and why it may differ for V1.** D-QUEST-29/44 add personal family motivation, recognize pre-offer care and separate lawful digging from desecration; consolidation aims at coherence, not blanket deletion of cemetery content.

**Potential V3 improvement / value.** Quiet help and believable elderly giver improve a simple caring activity.

**Conflicts, missing V1 capabilities and value at risk.** Need persistent grave-care state/actions and credible caretaker identity; visit or branch delivery is not tidying. Must bind specific cemetery and permissions; don't fail on authorized grave opening or duplicate care payout.

**Source reward reference.** tended: pay 20 from H treasury; rep helpfulness+6; desecrated: no reward (Ruth will not forgive) These are historical source references, not an approved V1 reward contract; options/rules may contain additional transfers.

**Source prerequisite reference.** cemetery anchor exists; day 3 or later

**Author question.** At which cemetery should care occur, and should existing visit/permission stories remain separate where sites or purposes differ?

**Evidence.** [source metadata](../../../docs/v3-donor/quests/catalog/v2/q14-weeds-on-the-hill/meta.ts); [catalogue/disposition card](../../../docs/v3-donor/quests/catalog/v2/q14-weeds-on-the-hill/README.md); [governing curation](../../../docs/v3-donor/quests/decisions/cemetery-care-quest-curation.md). [original V2 definition snapshot](../../../docs/v3-donor/quests/sources/comparison-defs/SeedVales-v2/src/game/data/quests/q14.ts) (code reference; not V1/V3 runtime).

**Fuller original material.** No dedicated full source scenario identified; definition, curation and catalogue are the primary evidence.

