# Quest Revival — Runtime Evidence, Additional Families and Verification Boundaries

**Created:** 2026-10-27  
**Status:** Source reconnaissance; advisory, no implementation approval.  
**V1 pin:** `3e7e7dc07625bd51fc5b8a5560baed3d386efec8`.  
**Read alongside:** [synthesis](./2026-10-27--quest-revival-recon.md) and [61-record matrix](./2026-10-27--quest-revival-matrix.md).

## 1. Evidence levels and reproducible scope

**Observed in source** means the definition, caller or state owner was inspected. **Test-source evidence** means the assertions were read, not executed. **Documented design** describes an intended behaviour or historical acceptance and never proves current playability. **Inference** is explicitly qualified. **Runtime-verified in this recon: none.**

The main entry points were the Revival README, Strategic Brief, Master Roadmap and R5, then CLAUDE, CODE_INDEX, STATE and plans README. The donor reconciliation was traced through all 61 README/meta pairs, 28 decision files, reviews 024/094, quests--004, Q0/Q3 and linked original scenarios/definitions. Full G02/G04 scenarios were recovered from the staged sources rather than accepting the thin catalogue stubs. Current V1 definition modules were matched against all 11 copied V1 definition modules: **all identical** at the pin. Current runtime composition, lifecycle, relevant tests, repair/world/state consumers were inspected separately.

Live V3 `907e17cd2ad487547a25a1f928b2770348183d75` was checked for the portfolio delivery plan, ledger, source tree and missing Q01/Q08 comparison definitions. The live quests--004 matches the staged copy. V3 has implemented exploration leads/conversation work, but its current source tree and ledger do not establish a running 61-story quest portfolio. Comparison code under `docs/comparison/` is historical V2, not V3 production.

The method uses the GitHub connector; no executable checkout, application tests, browser gameplay, GPU benchmarks or world-seed placement campaign were run. Documentation integrity checks are reported in §8, separately from game acceptance.

## 2. One current V1 authority: composition, progress and presentation

| Boundary | Current-source observation | Preservation implication |
|---|---|---|
| Definitions/registration | [createApp](../../../src/app/createApp.ts) around 1377–1750 assembles `QUESTS`, contextual landmarks/maps/horse, generated opportunities, hunter/guard and cave/Chronicles builders before one `new QuestManager` around 2075. Not every builder succeeds in every world. | Do not create a V2 engine beside this or treat 39 source records as a guaranteed per-world offer count. |
| NPC identity | [materializeAuthoredQuestDefs / resolveAuthoredNpcId](../../../src/quests/materializeAuthoredQuests.ts) resolves names once to stable `NpcId`; missing/ambiguous names throw. Other builders bind explicit IDs from deterministic projections. | Renaming text is different from reassigning a person/household. V3 reserved actor keys and Saltmere roster are not V1 population authority. |
| Definition validation | [validateQuestDefinitions](../../../src/quests/quests.ts) validates prerequisite references, choices, stage slots, transitions and consequences. Stage transitions are forward only; `all/any` exist, but `await_quest_outcome` and talk-choice are single-objective. | Many narrative alternatives fit existing stages/actions; it is not evidence of a general arbitrary graph/condition DSL. |
| Lifecycle | [QuestManager](../../../src/quests/QuestManager.ts) owns not_offered/offered/active/ready_to_report/complete/failed/abandoned/invalidated and terminal outcome IDs. World events advance objectives; report is usually a separate deliberate speech act. | Keep achieved objective, report and actual reward distinct. Physical item/casket outcomes can deliberately close directly. |
| Offers | Same owner ranks urgency/continuation/relation/priority/stable ID. One normal new offer per giver, one urgent bypass; two ordinary active giver quests, explicit story exceptions. Acceptance rechecks state/capacity. | A crowded cast/content portfolio can hide offers without a quest being broken. Additional stories need pacing assessment, not removal of ranking. |
| Dialogue | `onInteract`, live action callbacks, reactions and topic cooldowns belong to QuestManager; [NpcDialogueMenu](../../../src/ui-vue/NpcDialogueMenu.vue) presents shortcuts/topics. | Preserve concurrent required talk/report visibility and revalidation. The author has **not** selected V3 conversation UI. |
| Journal/UI | `QuestManager.list/projectNotes` produces DTOs; [QuestLogScreen](../../../src/ui-vue/screens/QuestLogScreen.vue) uses current/offers/history and details, showing truthful promised rewards and result state. | New writing must not leak unchosen options, hidden rewards or facts an NPC never said. |
| World knowledge | [quest adapter](../../../src/quests/worldKnowledgeResolver.ts) uses world-owned research. Persisted slot ref is landmark identity; promises/worker handles are not saved. | Keep bounded lookup and unavailable-site outcomes. Removing fictional wait is not permission to reveal unbound geography magically. |

### Persistence and save compatibility

Current [saveData](../../../src/persistence/saveData.ts) declares `CURRENT_SAVE_VERSION = 56`; [saveState](../../../src/app/saveState.ts) serializes `exportProgress()` and `exportRelations()`. World containers, unique items, livestock, structures, ownership, location knowledge and social news have their own owners/sections. Quests do not store a second copy of these physical states.

Progress stores quest ID, state, **numeric stageIndex**, resolved outcome, counts/slot progress, suppression time, journal stamps, knowledge slots, dialogue cooldowns, observations and captured report branch where relevant. Journal stamps refer to **stage/action/reaction indexes**, and text is re-projected from the live definition. Therefore even a “text-only” rewrite can alter how old history reads; reordering/removing stages can reinterpret progress. Source equality does not make future content edits save-neutral.

**Generic wild-target limitation:** constructor restore and `invalidateStaleAnimalTargets` invalidate active `kill_target_animal/find_animal` stages for wild kinds, rather than retarget another individual. Livestock is re-resolved, which is safer but does not prove preservation of the same selected animal in every authored case. `createApp` currently resolves the first live animal of the requested kind, then loaded livestock, not a named incident by default. A special persistent occupant exists for the bear-cave story; do not mistake that for general notable-wild-animal persistence.

D1 separates save-schema evolution from generation compatibility; D3 groups incompatible generation changes into one planned epoch. A revised stage graph/incident ID may need content/save migration **without** any geography change. A new guaranteed landmark may need worldgen coordination. Dialogue corrections need neither a new geography epoch nor automatic deletion of all save infrastructure. Pre-Revival save compatibility is not required by the brief, but new-game saves must still round-trip and incompatible data must be handled explicitly.

## 3. Existing mechanics versus V3 proposals

The five categories below describe observed coverage of a desired outcome, not proof of full end-to-end functionality.

| Proposed outcome / affected stories | V1 assessment | Actual owner / evidence | Actual remaining gap |
|---|---|---|---|
| Branches, parallel objectives, alternate item-return endings | **Already supports** bounded forms | QuestManager + quests contracts; Missing Hunter, Old Bones, Bandits, Chronicles | New narrative data and any unsupported domain effects; no engine replacement justified |
| Real repair material deliveries (R01/02/03/09/26) | **Already supports**, with completion semantics worth preserving | [four repair mappings](../../../src/quests/authoredRepairDeliveries.ts); createApp hooks; [structure IDs](../../../src/settlement/authoredRepairTargets.ts) | New 4-hour second reward, roof-specific choices and storm guarantee are separate |
| NPC repair after delivery | **Already supports in loaded work path** | [selectRepairCandidate / beginRepairStructure](../../../src/ai/NpcAgent.ts) around 6878; [shared registry repair/reservation release](../../../src/settlement/SettlementsManager.ts) around 1685 | No claim that every unloaded target repairs at equivalent fidelity; visible timing requires gameplay check |
| Systemic rats | **Already supports core outcome** | [exists + storage + nest + count](../../../src/quests/settlementRatInfestation.ts) and injected live settlement snapshot | Expanded poisoning/Rat Alpha not implied |
| Real wolf pressure and permanent destruction | **Supports differently, potentially better than authored displacement alone** | [wolfDenScenario](../../../src/fauna/wolfDenScenario.ts), [spawner state](../../../src/fauna/AnimalSpawner.ts), QuestManager polling | Separate short/settlement dens and correct attribution; do not reduce existing fauna pressure to story flags |
| Generated loss, external recovery and injured cow | **Partially supports** richer general incident policy | [source candidate IDs](../../../src/quests/opportunities/settlementQuestOpportunities.ts); [ordinary QuestDef materialization](../../../src/quests/opportunities/worldQuestMaterialization.ts); QuestManager source polling | IDs use animal, not distinct repeated occurrence; authored rebind can drift; shared claims are limited |
| Repeated same animal lost again / many compatible perspectives | **Not generally supplied by current per-animal terminal definition IDs** | `lostLivestockQuestId(settlementId, animalId)`; one terminal progress per ID | Occurrence identity and lifecycle need focused extension; do not assert a complete durable incident bus exists |
| Stable meaningful items and physical transfers | **Already supports**, partial legal model | [transferInventoryInstance/Count](../../../src/items/inventoryTransfer.ts); createApp physical outcome resolver; bow, signet, ledger, glossary/journal | Separate title/custody, mixed-owner lots and permission/exposure are not universally represented |
| Cave/site claims | **Already supports composition-time arbitration** | [natural anchor claims](../../../src/world/caves/caveAuthoredAnchorClaims.ts); [profile/anchor policy](../../../src/world/caves/caveAdventureContentPolicy.ts) | Deterministic in-memory rebuild policy is not a saved universal incident/entitlement registry |
| Already-found loot/knowledge | **Already supports selected reconciliation** | QuestManager `catchUpActiveWorldObjectives` and stage-entry reconciliation; exact item/location/container lookups | Each proposed story must use a real fact supplier; arbitrary past actions are not replayed globally |
| Rewards funded by giver | **Partially supports domain transfers, not universal quest rewards** | `applyOutcome` terminal guard + `grantItem` callback; domain inventory/economy transfers elsewhere | Current direct coin/gear grants are generally not debits from NPC funds; changing funding changes availability/balance |
| Relation and local reputation | **Already supports** two distinct layers | QuestManager relations; injected ReputationManager consequences; [recognition claims](../../../src/quests/guardRewards.ts) | Evidence-based delayed guilt/rumour exposure and deliberate accusation need story/shared knowledge contracts |
| NPC-independent resolution | **Partially supports**, and is selective | Source-state offers retract/accepted quests fail or report external recovery; autonomous repair exists | Do not simulate every unvisited authored adventure away. New D-QUEST-46 opt-in policy must be discussed for V1 story by story |
| Offscreen travel/economy | **Supports existing bounded mechanisms** | [offscreen travel continuity](../../../src/ai/npcTravel.ts); settlement transport arrivals; [source-aware economy](../../../src/economy/settlementEconomy.ts) | Not a guarantee of detailed distant rescues, fights, social discovery, repairs or new logistics |
| Real mine foundations | **Supports substantially more than V3's M7 baseline** | [stable mine](../../../src/world/caves/abandonedMineLandmark.ts); [finite gold/source IDs](../../../src/terrain/abandonedMineDeposits.ts); [expeditions](../../../src/world/createExpeditionAssignments.ts); [bootstrap](../../../src/settlement/foundedSettlementBootstrap.ts); [realizations/entitlements](../../../src/economy/sourceLedger.ts) | Integrated mine quest is still planned; full live colony materialization is not proved by foundation APIs |
| Guaranteed post-repair global storm | **Would require broad shared-world change** | [computeWeather(seed, elapsedDays, season)](../../../src/world/weather.ts) derives weather directly; no donor weatherMachine reservation API | Persisted scheduled constraint/coalescing/damage needs independent weather design; no private quest storm |
| Bridge detour, new crossing, working waystation, full wreck rescue | **Not established as the proposed outcomes** | Existing roads, structures, work, inventories are reusable foundations | Physical location-specific changes, material/custody/title and lifecycle must exist; completed journal is insufficient |
| Companions in Q06 / assisted boar | **Partial foundations** | Generic expedition and travel do not prove full player-following, consent/wages/combat agreements | Reuse current companion owners where delivered; do not add temporary quest follower/remote damage |

### Four real repair sinks, not four interchangeable wood errands

`drewno-na-naprawe → householdFence`, `kamienie-dla-piotra → residentialFoundation`, `drewno-dla-anny → settlementEconomy/communalFence`, `drewno-dla-piotra → household/loggingWagon`. The createApp hand-in preflights the material sink, commits after removing player inventory, and releases the corresponding autonomous repair reservation. The communal branch converts material to economy wood units. Quest completion records delivery; it does not pretend the structure is instantly repaired.

`isAuthoredRepairTargetIntact` checks **stored** state: missing sparse state is not proof of completed repair. Already-repaired closure avoids a second delivery. The current early-repair branch has no payout, unlike V3's proposed smaller reward. NpcAgent selects bounded repair targets, walks/works through ordinary work actions and contributes to the world registry. These are reasons to retain the current integration.

### Reward idempotency is narrower than the donor incident policy

`applyOutcome` refuses further effects for terminal quest state, then applies effects, direct grants and social consequences once per quest. That prevents repeated report reward in one restored terminal history; it does **not** prevent two different quest IDs from legitimately or accidentally paying for the same den. Physical transfers have preflight/capacity checks and several shared hooks; do not claim a universal atomic transaction receipt across every quest/domain mutation.

The donor D-QUEST-16 policy allows separate legitimate one-time entitlements for one event. Therefore “one den event advanced two objectives” is not automatically a bug. The review question is whether **the same promised contribution** pays twice or different promises are funded and intentional. This distinction matters for Kasia's horse and Anna's public-safety recognition.

## 4. Additional V1 portfolio inventory — outside the 61 count

These **14 inventory entries cover extra families, continuation scope and selected story goals**, not fourteen fully implemented quests. R29's enriched suspicious-transport record remains in the 61 and is not counted again as a new quest.

| Extra ref | Family / IDs or scope | Current evidence and maturity | Value and question for preservation |
|---|---|---|---|
| E01 | `world:wolf-den-pressure:<spawnerId>` | Implemented candidate/normal QuestDef from settlementQuestOpportunities/worldQuestMaterialization; live source gating and persistent reconstruction | Systemic settlement safety must survive any authored wolf rewrite; arbitrate actual den, not all nearby wolves |
| E02 | `world:lost-livestock:<settlementId>:<animalId>` | Implemented known-household-animal candidates, real lost/corpse source, live/dead/unavailable branches and reporting | Preserve actual loss/recovery, many animals/owners; recurrence ID is still a gap |
| E03 | `world:injured-cow:<settlementId>:<animalId>` | Implemented real injury source; Medicine treatment or slaughter then real beef hand-in; source/test bodies inspected | Not a duplicate of lost livestock or companion rescue; protect humane option and exact animal |
| E04 | RPG `old-place-secret`, `settlement-agreement`; generic suspicious-transport fallback | [matrix selection](../../../src/quests/opportunities/rpgQuestMatrices.ts) and [materialization](../../../src/quests/opportunities/rpgQuestMaterialization.ts) exist; deterministic neighbours, NPCs and occupied landmark policy | Retain regional exploration/social agreements; generic dialogue consequence is not a full logistics contract. R29 covers the richer physical transport cache |
| E05 | `hunter-profession:<settlementId>:<giverNpcId>:1..3` | [hunter ladder](../../../src/quests/opportunities/hunterProfessionQuests.ts): deer harvest/hides → stag harvest/antlers → actual habitat feeding; bow rewards, sequential outcomes | Real skill/profession progression leads to R07/08. Do not replace with G07 kill-only board progression |
| E06 | `guard-evening-duty:<settlementId>:<giverNpcId>` | [evening duty](../../../src/quests/opportunities/guardProfessionQuests.ts): deterministic evening offer, up to three real torches + campfire; [auto-light suppression](../../../src/app/guardQuestWiring.ts) while duty active | **Excluded from 61 but explicitly retired in donor Q-012.** Existing useful ordinary-life activity; G03 investigation and Q07 supper are different gameplay |
| E07 | Per-guard recognition: torch gift, renown/alpha sword routes | [resolveNextGuardReward](../../../src/quests/guardRewards.ts), [claim persistence](../../../src/quests/guardPersistence.ts); torch threshold 6 renown, sword threshold 12; sword/coin substitute routes have distinct claims | Not a QuestDef; high den renown can cascade into equipment/coin. Preserve genuine recognition while reviewing combined rewards |
| E08 | Abandoned Gold Mine → Mining Colony | [integration plan](../../../docs/plans/quests-progression-010-abandoned-gold-mine-colony.md) remains **planned**; mine/deposits/source share/assignment/travel/bootstrap foundations inspected in §3 | Not a finished quest. Preserve delivered systemic foundations; use Q10 ideas selectively, not a second gold economy |
| E09 | Lost Treasure Chronicles beyond deciphering | [roadmap](../../../docs/roadmap/quests-lost-something-chronicles.md) describes estate/alpha bear, map, collapsed dungeon, key trail/final ownership beyond R12–16 | Current early modules do not prove completed epic. Existing treasure stories may become chapters only by explicit site/item/story decision |
| E10 | Brotherhood competing strategies / exceptional-animal finale | Current introduction and investigation are R07/08; plans `quests-progression-053` and `054` cover later strategies/finale | Do not truncate the intended professional arc to two curated records or call later chapters implemented |
| E11 | Profession/world-consequence stories; Iron Trail | [profession roadmap](../../../docs/roadmap/quests-professions-and-world-consequences.md), [Iron Trail draft](../../../docs/roadmap/quests-iron-trail.md); `quests-progression-062` builder outpost is a draft, production consequence catalogue is empty | Strong construction/economy foundations, but no approval to expand this recon into a new backlog |
| E12 | Travelling merchant journeys / missing merchant / dangerous route | [journey roadmap](../../../docs/roadmap/quests-travelling-merchant-journeys.md); plans `067/068`; existing transport/travel foundations are not all proposed party/death/cargo scenes | Future incidents should observe actual persistent party/cargo and deaths rather than spawn disposable evidence on acceptance |
| E13 | Injured dog, treatment, trust/adoption and treasure | [058](../../../docs/plans/quests-progression-058-injured-dog-discovery-thread.md) is **planned household-dog opening**; newer [author direction](../../../docs/research/v1-revival/STRATEGIC-BRIEF.md) selects a **separate unowned rescue dog**, then trust and explicit adoption | The two scopes must not be silently conflated; no taking a household dog. Medicine/animal identity are reusable, complete chosen companion/search story not proved |
| E14 | Knight+squire and hunter father+son roaming groups | Strategic Brief explicitly retains both later goals; no current QuestDef for those selected stories identified in the inspected composition | Keep as later content goals outside the 61; their omission from curation is not cancellation or authority to implement |

## 5. Actual overlaps versus thematic resemblance

| Connection | Evidence classification | Consequence for decisions |
|---|---|---|
| V1 wilcza-jama / wilki-pod-osada / wilki-u-kupca / generated pressure | **Real shared-den exposure.** Three authored definitions use WOLF_DEN_ID; generated source uses home spawner. Clearing and permanent destruction remain different transitions. | Reconcile binding, contributions and rewards; do not flatten both transitions or delete horse acquisition automatically |
| Four starter repair requests | **Distinct real sinks** in authoredRepairDeliveries | Reusing branches/household is not duplicate repair work |
| Anna/Piotr scouting and Kasia's road check | **Shared observations possible**, different practical questions | One visit may satisfy two truthful reports; do not manufacture duplicate sites |
| Forgotten cemetery / Chronicles favour / Q14 | **Thematic overlap; site equality not established for current V1.** Favour binds archaeologist cemetery; forgotten cemetery is resolved from home-area search. Q14 is absent. | No blanket merge until exact cemetery/grave/purpose is chosen. Preserve named-grave authorization |
| V1 map / Q05 dry river / Q11 marsh / Q12 sword / Q13 estate | **Different source premises**, no proven singular asset collision | Keep distinct or deliberately connect after world survey; genre is not incident identity |
| V1 bear casket / Q12 bear / E01 owned sword | **Different objects and ownership** | A species or “legendary sword” phrase does not justify merging the stories/items |
| Missing Hunter / Old Bones / Bandits / Lost Expedition | **Different people/evidence/claims**, existing exclusive cave-anchor reservations | Preserve separate item IDs and branch value; no new generic container can serve all |
| Generic lost sheep / G01 Pip / injured cow / unowned rescue dog | **Different incident classes**, except an exact animal+occurrence collision | Don't suppress all animal stories; repeated occurrence identity still needs work |
| Q04 hammer / G02 share; G03 Hazel / G07 family dog; Q09 / G06 trader | **Complementary soft links** | Optional references improve continuity; avoid hard prerequisite chains absent author choice |

## 6. Concrete findings and preservation risks

**F1 — high preservation risk, source-confirmed: active generic wild-target quests invalidate on save/rebuild.** R06/R10/R05 and a future Greybeard need durable individual target evidence if required to survive saves. Minimal future direction: extend the existing fauna/persistence/binding seam for notable animals; do not silently retarget, resurrect, or replace QuestManager. Tests explicitly assert current invalidation, so this is a known limitation rather than an unnoticed crash claim.

**F2 — high portfolio/balance risk, source-confirmed: one den is exposed through several reward paths.** Reward caps/renown interact with guard recognition. Review 024's combined 95-renown figure describes possible per-quest totals, not a newly reproduced play result; 15+25+35+8+12 are separate entitlements with prerequisites and runtime conditions. Verify actual simultaneous offers/order before selecting merge/balance. Do not automatically nerf valuable swords.

**F3 — high preservation risk, conditional: applying donor cemetery merges blindly can break lawful access.** `isLostTreasureGraveAccessGranted` consumes a particular favour outcome and createApp uses it for grave permission. Removing that QuestDef/ID without an equivalent named authorization breaks the dependent flow; Q14 is not present to replace it. Distinct cemetery IDs may make consolidation undesirable.

**F4 — medium correctness/content issue, source-confirmed: the final scouting report can misstate the chosen stag route.** `zwiadowca` lets an honest “did not see” action advance but final `reportPlayerLine` still asserts a stag. Stone hand-in checks ordinary stone quantity, not mountain provenance. Improve truthful prose/objective evidence after approval; no new provenance system is justified solely by this wording.

**F5 — medium integration risk, source-confirmed boundary: generic hand-ins and direct rewards are not conserved transfers.** Repair deliveries have specific material sinks; many other gathering items are consumed and direct rewards are granted. Shell decoration, G02/G06/Q09 and wreck title require explicit existing recipient/account integration. Applying V3's resource rules wholesale would change currently accessible V1 rewards; discuss compensation/funding before adopting.

**F6 — medium save/content risk, source-confirmed: stable quest ID alone does not preserve meaning.** Numeric stage and journal action/reaction indexes change interpretation if a “rewrite” reorders content. New save correctness and actual domain identities matter even when old saves need not remain compatible.

**F7 — medium availability risk: all definitions are built at boot, not continuously registered.** World-driven visibility can change later, but a new opportunity requiring a definition not assembled at boot does not appear magically. Brotherhood investigation may be absent when no unhealthy thicket was found. Extending emergence is not evidence the current engine should be replaced.

**F8 — high architecture risk if selected: Q03 guaranteed weather is not the same contract in V1 and V3.** V1's direct calendar weather evaluation supports time skip without replay; a new post-repair reservation would alter that invariant. Keep roof story discussion separate from approval of a global weather mechanism.

**F9 — scope caution: a narrative ending can outstrip its implemented world effect.** V2 Q11 has real money effects yet no demonstrated physical rebuilt causeway from its flag; Q13 payments exist without proving a waystation; Q08 fills/72-hour rota don't prove sheep route improvement. Neither “all fake” nor “all implemented” is supported.

## 7. Focused verification still needed after decisions

These are decision-specific evidence needs, **not an approved implementation backlog or mandatory benchmark suite**.

| Scenario / uncertainty | Existing test-source evidence inspected | What remains unverified |
|---|---|---|
| Both wood-priority orders; player repairs before offer; rollback on bad sink | QuestManager.test.ts gather bridge / follow-ups; authoredRepairDeliveries.test.ts | Visible four-target state, live NPC work timing, unload/reload behaviour |
| Wild individual before/after save; repeated same sheep loss | QuestManager.test.ts target binding/invalidation; generated source/materialization tests | Intended durable notable-animal behaviour and recurrence policy |
| One den cleared then burned; several givers; horse dies/claimed | QuestManager.test.ts fan-out, destroy, horse reservation; guardRewards.test.ts | Actual combined offer/credit/reward flow on representative world |
| Chronicle already owned; wrong lead first; permission before/after Q14-like care | chronicleSearch/Deciphering tests; world-stage reconciliation in QuestManager.test.ts | Future consolidated permission contract, spatial cemetery equality and full chain walk |
| Exact bow/signet/ledger/journal return; recipient capacity/death | Quest module tests and createApp resolver source | Whole action/UI/save round trips and source-funded reward decisions |
| Healthy/depleted thicket, early feed, hunter III membership | hunterProfessionQuests and brotherhood tests | World-seed availability and later strategy/finale content |
| Intentional false blame / delayed knowledge / quiet help | Existing reaction/cooldown and social seams; proposed story sources | No V1 G08 to test yet; actual evidence/exposure design must precede claims |
| Mine prepared site, assignment travel, founded colony | Domain source/test modules exist | Integrated quest and live colony completion are not established by this recon |
| G03/Q07 duties and meeting interruption | Existing V1 light lookup/duty tests; V2 source stubs examined | New cast, real social event/dusk coordination without AI holds |
| Guaranteed storm across time skip/reload | V1 weather source/test family exists | New scheduling contract is absent; current deterministic weather is not deficient for lacking it |

## 8. Documentation verification and limitations

Performed for the new reports: 61 unique source IDs; 39/22 origin accounting; 3/48/4/5/1 disposition accounting; assessment and governing decision for every record; current V1 source counterpart for all 39; complete source-evidence routing including 21 V2 definitions versus Q10 design; repo-relative new-report links and referenced repository paths checked against the pinned tree; mutation limited to research Markdown/index; latest-main/concurrency check before non-force publication.

Not performed: `pnpm docs:check`, unit/type/lint/build runs, runtime/visual/audio checks, performance measurements, all-world site guarantees, full NPC/Far determinism verification, market balance or comparative “fun” testing. A next discussion can make quest-by-quest choices from the matrix; selected runtime acceptance will still require bounded scenarios rather than another broad portfolio recon.

Uncertain historical motives stay uncertain (notably Old Ruins retirement and individual batch-44 creative reasons). Declared narrative policy is not proof of the author's private optimization motive. Archive link layouts are historical and some copied relative links are stale; new reports link the **actual staged paths** and do not modify the archive.
