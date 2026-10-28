# V1 Revival — Dog, Elder and Cemeteries Comparison

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol

> **Readiness reconciliation — 2026-10-26:** Ownership is resolved: separate genuinely unowned wounded dog → treatment → trust → explicit adoption → treasure-search companion. Treatment grants no ownership. Plan 058’s household-owner return/reveal branch and corresponding checks below are historical evidence, not required for this selected story. Other identity/persistence/real-treasure safeguards remain relevant. [Current authority](./STRATEGIC-BRIEF.md#voices-cast-and-selected-stories).

## Executive findings

- **Dog:** V1 has household dogs, Medicine, player ownership, Follow/Stay and livestock persistence. The selected wounded-dog story is **not connected** in the inspected composition/save paths: plan 058 and its preparatory notes describe an opening only. V2 supplies connected rescue/adoption and real treasure detection, but its **unowned** rescue dog conflicts with blindly adopting V1's household-owned encounter dog.
- **Elder:** V1 already has a specific Chronicles elder, Kazimierz, with connected winter/dispute quests and archaeological leads. His former-adventurer past and an owned legendary sword are **not established** by those implementations. V3 supplies a precise characterization/ownership specification and a distinct E01 cast entry, but explicitly defers unique-sword inventory binding.
- **Cemeteries:** V1 already has individual grave layouts and consequential burial/treasure state. V2 supplies modular grave markers, larger Crypt geometry, size-dependent crypt counts and readable inscriptions. Adapt those presentation mechanisms around V1 identity/placement; importing V2 grave loot, Q14 or burial behavior would expand scope.

These are source findings, not gameplay acceptance. No build, game test, browser walkthrough, binary-model inspection or new performance measurement was performed.

## Evidence, authority and pins

| Repository | Inspected ref / exact SHA |
| --- | --- |
| Target V1 | `jm-sky/seedvale-v1 main @ 454151315df6a95f55f3db4cabe41f8d4d6010c9` |
| V2 donor | `jm-sky/seedvales-v2 main @ 9ba54815493b886eb1bdce032f5209aeb2856c37` |
| V3 donor | `jm-sky/seedvale main @ 8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6` |

**Reused research:** [Strategic Brief](./STRATEGIC-BRIEF.md), [dossier route](./README.md), [backlog audit](./2026-10-26--documentation-backlog-audit.md), active plans and ranked conflicts, [Author Feature Checklist](./2026-10-26--author-feature-checklist.md) items 4/6, [R5](./2026-10-25--005--content-and-player-experience.md) content/persistence/catalogue qualifications, [R6](./2026-10-26--006--cross-report-review.md) evidence vocabulary and [R7](./2026-10-26--007--unified-candidate-matrix.md) preservation/conditional verification. Also reused [V3 world-generation comparison][v3-comparison], its imported dog/cemetery references and [port ledger][v3-ledger]. V3 curation decisions apply to V3, not automatically to V1.

**Method:** authenticated GitHub connector reads; local HTTPS cloning failed for missing Git credentials. Publication therefore uses a single-file connector commit on current main, preserving its existing tree; shell pull/rebase/push is unavailable. Followed V1 `CLAUDE.md`, targeted CODE_INDEX/STATE/plans routing and complete recursive trees (`truncated:false`); inspected only topic owners/callers needed to resolve gaps. V1 has no root `AGENTS.md`. Links below pin code and donor evidence to the SHAs above; local research links resolve in the V1 tree at its recorded pin. Older R5–R7 V3 pin `17a81bd1ea0cea1920525a92b52d754e155a3ead` is historical, not this report's current-source pin.

**Evidence classes:** “connected” means definitions have inspected runtime consumers; “planned/authored” is intent; “historical verification” is attributed to an earlier review, not rerun. “Absent” is bounded to named inspected paths, not an exhaustive claim about all repository history. The author's concurrent character/snow work is outside this report: no review, acceptance or implementation account is supplied here.

## 1. Wounded dog and treasure companion

| Concern | V1 evidence | Relevant donor and integration gap |
| --- | --- | --- |
| Admission and ownership | [Plan 058](../../plans/quests-progression-058-injured-dog-discovery-thread.md) and [preparatory notes](../../plans/implementation-notes/quests-progression-058-injured-dog-discovery-thread-implementation-notes.md) are **planned**, not implementation evidence. They bind an existing eligible household dog/owner, permit no encounter when none exists, and require no initial marker. [Livestock][v1-dog] supplies deterministic dogs, Husky/Shiba visuals and household ownership. No encounter binding/phase or owner-reveal consumer was found in inspected AnimalAgent, save schema or createApp. | [V2 newGame][v2-new] adds one separately seeded, unowned wounded dog beside a home-settlement house when a house exists. [Rescue][v2-rescue] uses medical-item treatment, then a meat/fish meal; [adoption][v2-adopt] sets player owner/name, clears household/rescue and enables following. This is a different admission/ownership contract, not V1's owner-return branch. |
| Injury, treatment and reveal | [Medicine targeting][v1-target] supports owned livestock; [completion][v1-medicine] reports exact animal ID and positive HP restoration through the existing 057 seam. [AnimalAgent][v1-animal] owns real injury and lazy natural recovery. The 058 stable untreated wound, injured-rest, treated-returning, returned/reveal phases and one-shot social hook remain missing from inspected paths. | V2 treatment is a separate skill roll; failed attempts cost no medical item, successful treatment consumes one and heals, then feeding consumes one meal. No former-owner reveal branch exists in that rescue flow. Reuse V1 Medicine rather than copying a second healing authority. V2's wounded appearance is not established as satisfactory. |
| Companion movement and persistence | [Owned control][v1-control] and AnimalAgent implement player-owned Follow/Stay (12 m start / 6 m stop), control snapshot/hydration and ownership transfer. [Livestock][v1-dog] supplies detached restoration and registry snapshots using **origin settlement + animal ID**; bare animal ID is not globally unique. These are reusable foundations, not a reachable dog recruitment story. | [V2 Follow/Stay][v2-follow], [AI][v2-ai] and [interaction dispatch][v2-interact] are connected. Needs/threats can interrupt following. [Save snapshot][v2-save] retains animal owner/name/rescue/follow/sense in GameState; simulation uses distance-based update cadence rather than V1 settlement detach/streaming. V2 cannot prove V1 continuity after recruitment. |
| Treasure and repeated effects | [Hidden Finds][v1-hidden], [systemic treasure sites][v1-treasure] and [dig actions][v1-dig] already own real locations, keys, resolved IDs and rewards. No dog-search binding to them was found in inspected fauna/composition paths. Locked systemic cave treasure is explicitly disabled pending its key/lock contract; ordinary cave containers are separate. | [V2 dogSense][v2-sense] queries [real treasureSpots][v2-treasure], ignores taken spots, checks the **dog's** cave layer, obeys Stay bounds and marks the exact spot after walking/digging. Automatic scans and a dispatched `Search!` command exist; the dog awards no loot. [Hole traces][v2-traces] persist and suppress repeated marking, but storage is bounded and can evict an old hole when full. Loot collection remains player-owned and once-per-spot through `px.lootTaken`. |

**Preservation/dependencies:** keep the existing owner and household economics until an explicit release/adoption decision. Treatment does not grant ownership. Bind narrative progress to canonical origin-qualified animal identity; the existing treatment event's bare ID must be resolved against the selected origin. Reuse livestock health, movement, detached lifecycle and save authority; do not introduce a second companion registry. Treasure sensing needs a V1 adapter over genuinely available, unresolved, reachable targets—not copied V2 coordinates, synthetic treasure or automatic key/chest access. Preserve item consumption, ordinary external death/threat semantics and repeated-dialogue/reward guards. Do not import V2's owned-animal collapse policy implicitly.

**Historical verification:** [V2 review 023][v2-review23] records focused tests and later 740/740 triage, including rescue consumption logging, own-layer sensing and forage cadence fixes visible in current donor code. [Review 024][v2-review24] observed rescue/adoption/following and an exact treasure-hole state; the hole decal/digging animation and cave-entry behavior were **not visually checked**. It found a healthy-looking wounded dog. These are historical donor checks, not V1 acceptance or a new full save/streaming test.

**Focused Opus inputs:** validate no eligible dog, wrong dog/origin, cancelled/zero-effect treatment, untreated time passage, owner reveal only after return, and explicit recruitment once. Selected state must round-trip before treatment, during return, after reveal/recruitment and during search; cross settlement unload/rebuild without duplicate dogs. Search must find an existing target, reject exhausted/wrong-layer targets and preserve one player reward after repeated commands/reload.

## 2. Former-adventurer elder and legendary sword

| Concern | V1 evidence | V2/V3 evidence and gap |
| --- | --- | --- |
| Specific identity versus generic elders/headman | [Authored resident][v1-elder] is `family-story-lost-treasure-elder`, Kazimierz Nowak (surname culture-adjusted), age 74, appended after generated families to preserve their IDs. Selection prefers a nearby **non-home** SM/MD settlement. He begins with farmer baseline; [generation/staffing][v1-generation] can reassign profession. Generic demographic elders and [social titles][v1-titles] are separate mechanisms. The inspected binding does not assign headman duties; V1's current [profession union][v1-roles] has no headman role. | [V3 population spec][v3-population] identifies **E01**, not Ruth/Joan or the reeve. [Current household data][v3-households] has E01 in `elder`, male 70, technical hunter profession with retired duty. [Q0 cast][v3-cast] proposes Edmund Vale as a **working** name. These are not aliases for Kazimierz or permission to move/rename him. |
| Dialogue and quest continuity | [Winter/dispute QuestDefs][v1-elder-quests] are composed in [createApp][v1-app]. [Chronicle search][v1-search] uses the same elder binding, relation/outcome-sensitive archaeological leads and real investigation branches. They establish local trust/help, not adventurer memories or sword ownership. [Archived 037](../../plans/archive/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md) records implementation and historical tests, with browser verification outstanding. [051](../../plans/npc-051-elder-daily-life-and-settlement-care.md)/[066](../../plans/quests-progression-066-elder-knowledge-and-teaching.md) are separate care/teaching proposals. | [V3 proposal §4][v3-proposal] supplies the former-adventurer characterization, gradual disclosure and existing relation/reputation reuse. [Ordinary conversation data][v3-dialogue] gives E01 road caution, quiet village/rest/advice topics and gives **L01 Ralph** the reeve claim. These connected conversation inputs do not disclose the adventurer history or transfer a sword. |
| Real sword, home and access | [V1 items][v1-items] includes ordinary/masterwork/Damascus/obsidian swords; [instances][v1-instances] provide weapon identity/state. Neither those definitions, the elder quests, [authored pickups][v1-pickups] nor inspected worldBundle composition establishes one legendary sword bound to this elder/home. No specific home placement, owner inventory instance or acquisition permission was established. Other sword rewards/guard gifts are unrelated. | V2 [item definitions][v2-items] include legendary sword types, but no elder ownership was established in inspected generation/rescue/item paths. V3 explicitly wants an existing persistent unique sword at E01's home and an optional voluntary trust-based gift. However [G3 inventory scope][v3-g3] explicitly defers `purses/inventories/unique sword binding`. A tier definition, prop, item icon or canon sentence is not that owned instance. |

**Reuse/preservation:** Kazimierz is the concrete V1 reuse candidate, not every old resident. Preserve his household/NpcId, winter/dispute outcomes, archaeological branches and relations if extending him. Reconcile daily profession/activity with retirement; a baseline farmer or V3 technical hunter label alone does not establish former-adventurer behavior. Reuse ordinary dialogue/quest conditions and existing item-instance/container/inventory mechanisms after checking their actual owner-transfer seam; the inspected horse-specific foreign-property helper is not a generic sword-access policy.

V3's optional gift is **donor intent only**, not an approved additional V1 reward. No named weapon is selected here. Exact item type/history, home representation and access remain design gaps; a decorative sword must not duplicate a real inventory instance, and loading/re-entering must not recreate it.

**Focused Opus inputs:** resolve one stable actor/household mapping; check every selected dialogue/lead against that actor rather than age/title. Demonstrate the sword already exists before any interaction, belongs to him, has one durable identity/location and remains conserved through load/rebuild and any subsequently approved transfer. No theft quest, combat encounter, automatic gift or Chronicles completion requirement is authorized by this report.

## 3. V2-style cemetery presentation

| Concern | Existing V1 | Exact V2 donor / V3 qualification |
| --- | --- | --- |
| Graves, plaques, crypts | [Templates][v1-specs]/[decorProps][v1-props]/[chunk consumer][v1-chunks] use `models/nature/cemetery.glb`, `grave_a.glb` and procedural fallbacks: a centerpiece plus 9/18/36 grid graves for SM/MD/LG, per-grave jitter and terrain placement. No modular Crypt or readable plaque interaction is established in these paths; [ground actions][v1-dig] explicitly use dig spots without a grave Interactable. | [V2 renderer][v2-render] extracts `Grave`, `Gravestone`, `Grave_Marker_A/B`, `Grave_Damaged` and **`Crypt`** from `public/assets/parked/graveyard.glb`; [Renderer][v2-renderer] loads/updates/disposes it. [Graves][v2-graves] provides a **Read the inscription** interaction with deterministic surname + epitaph. Readable text is produced by code, not proven engraved geometry/texture. Actual plaque detail requires visual inspection. |
| Counts and terrain/footprints | [Assignments][v1-assignment] preserve dedicated/shared-SM topology and stable cemetery IDs; cemetery size is a seeded mapping from served settlement sizes, including OUTPOST/XL, not a strict equal-size mapping. [Placement][v1-placement] checks terrain, water, roads, clearings and owner-chunk margins. Existing clearances derive from the smaller grave layout. | [V2 generator][v2-cemetery]: SM **1 crypt + 8–10** plain graves, MD **2 + 14–16**, LG **3 + 24–26**. Aisles/back-row tombs; crypt footprint **4.2 × 5.6 m**, plain marker **1.0 × 0.6 m**. Plot sampling rejects >2.5 m height spread, roads/buildings/water; bounded search may emit no cemetery. Crypt sinks 0.3 m; no interior is implemented by that rendering path. |
| Collision, identity and reconstruction | V1 [chunk collision][v1-chunks] deliberately assigns cemetery radius **0**; one whole-plot circle would obstruct grave rows. [Hidden Finds][v1-hidden] derives spot IDs `${landmarkId}:${index}` from the layout; keys/chronicles/permissions consume those identities. Separately [NpcGraves][v1-graves] persists `grave:<deceasedNpcId>`, position and burial day, carried by [WorldBundle][v1-bundle] and [SaveData][v1-save]. [NpcAgent burial][v1-npc] actually buries at **postDeath.x/z**, not at a generated cemetery slot; [settlement hooks][v1-settlement] wire corpse burial and family grave visits to the persistent collection. Generated old graves are not those deceased records. Moving burials into cemeteries would be an additional simulation change, not part of this visual selection. | V2 IDs `cem<settlementId>-gN/-tN` reconstruct from generation; [collision][v2-solids] uses each grave's same rotated footprint. Mutable disturbance uses `px.gravesDug`; this is not a dynamic burial/genealogy model. V2 merges pieces per material and streams render groups with build budgeting, rather than cloning the V1 group unchanged. |
| Gameplay boundary | Existing V1 burial, grave visits, hidden loot, specific-grave permission and exposure effects must survive a visual change; no new burial simulation is needed. | V2 also has grave loot/witness/tidy/Q14 behavior, which is **outside this selected improvement**. V3 [port ledger][v3-ledger] still qualifies cemeteries as marker/parked asset and grave/visit ownership as deferred. [V3 cemetery-care curation][v3-care] is authored design, not a visual donor or authority to retire V1 quests. |

**Preservation/verification inputs:** reuse V1 assignment ownership and deterministic reconstruction; enlarge footprint/road/owner-chunk checks and vegetation clearance for any crypt. Provide per-piece collision through the existing registry, with player/NPC/fauna passages and grave-front access checked. Keep render positions, dig/permission IDs and existing persisted burial positions coherent; reordering graves can rebind an existing quest/key even in a new game. V2 counts do not settle V1's shared-SM, OUTPOST or XL mapping.

[Historical V2 review 031][v2-review31] inspected cemetery scenes and recorded mound clipping/grass issues, untested steep/forest/other-seed placement and unbenchmarked rendering; its Q14 generic-dig failure was subsequently triaged to a grave-specific event. These are preservation warnings, not requests to import Q14. Check representative size classes, shared and abandoned sites, slopes/roads, stream-out/reconstruction, one existing authorized grave interaction and an existing NPC burial/visit. Verify plaque readability and crypt silhouette with the author; no full-game build or cemetery gameplay expansion is needed for this research.

## Consequential questions and planning boundary

1. **Dog ownership:** preserve 058's household-owner return/reveal opening and add an explicit owner-approved recruitment opportunity, or use a separate genuinely unowned rescue dog? This changes admission, ownership and story continuity; treatment alone cannot decide it.
2. **Elder mapping only if changed:** extending V1's existing non-home Kazimierz is the concrete reuse candidate. If Opus proposes replacing him with a home-settlement E01-style character, obtain author agreement on that identity/location change rather than silently duplicating or moving the Chronicles actor.

No other author answer is required to begin detailed planning. Opus can specify cemetery size mapping/layout and plaque presentation within the agreed outcome. Sword acquisition has not been selected: any proposed player access/gift rule needs explicit scope reconciliation, not an invented quest. This report supplies evidence/contracts and focused verification needs, **not implementation order, detailed design or readiness approval**.

## Pinned source references

[v1-dog]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/livestock.ts
[v1-animal]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/fauna/AnimalAgent.ts
[v1-control]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/fauna/ownedAnimalControl.ts
[v1-medicine]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/app/actions/medicalTreatmentActions.ts
[v1-target]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/player/medicalTreatment.ts
[v1-hidden]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/world/hiddenFinds.ts
[v1-treasure]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/world/treasureSites.ts
[v1-dig]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/app/actions/groundActions.ts
[v1-elder]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/lostTreasureChroniclesElderResident.ts
[v1-elder-quests]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/quests/lostTreasureChroniclesElder.ts
[v1-search]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/quests/lostTreasureChronicleSearch.ts
[v1-app]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/app/createApp.ts
[v1-generation]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/settlementGenerator.ts
[v1-titles]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/ai/npcSocialTitle.ts
[v1-items]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/items/items.ts
[v1-instances]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/items/itemInstances.ts
[v1-pickups]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/items/authoredWorldPickups.ts
[v1-props]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/decorProps.ts
[v1-specs]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/propSpecs.ts
[v1-chunks]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/terrain/chunkManager.ts
[v1-assignment]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/terrain/cemeteryAssignment.ts
[v1-placement]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/terrain/cemeteryPlacement.ts
[v1-graves]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/world/npcGraves.ts
[v1-bundle]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/app/worldBundle.ts
[v1-save]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/persistence/saveData.ts
[v2-rescue]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/ownedDog.ts
[v2-new]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/newGame.ts
[v2-adopt]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/ownedAnimal.ts
[v2-follow]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/fauna/ownedFollow.ts
[v2-sense]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/fauna/dogSense.ts
[v2-ai]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/fauna/ai.ts
[v2-interact]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/interact.ts
[v2-save]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/snapshot.ts
[v2-treasure]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/treasure.ts
[v2-traces]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/traces.ts
[v2-cemetery]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/gen/cemeteries.ts
[v2-render]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/cemeteries.ts
[v2-renderer]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/Renderer.ts
[v2-graves]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/graves.ts
[v2-solids]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/landmarkSolids.ts
[v2-items]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/data/items.ts
[v2-review23]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/docs/reviews/2026-10-04--023--wave-review-w3-transport-dog.md
[v2-review24]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/docs/reviews/2026-10-04--024--app-review-1.md
[v2-review31]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/docs/reviews/2026-10-06--031--stage6-slice-cemetery-tiers.md
[v3-proposal]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/quests/quest-feature-proposals.md
[v3-population]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/world/areas/home-population.md
[v3-cast]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/quests/canon/q0-cast-and-names.md
[v3-households]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/src/game/data/npc/households.ts
[v3-dialogue]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/src/game/data/dialogue/ordinaryConversations.ts
[v3-g3]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/src/game/sim/npc/g3Inventory.ts
[v3-ledger]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/state/PORT-LEDGER.md
[v3-comparison]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/comparison/world-generation.md
[v3-care]: https://github.com/jm-sky/seedvale-v3/blob/8e3c9ba886ef98cf5301503f66fb0dc9ee514eb6/docs/decisions/cemetery-care-quest-curation.md
[v1-npc]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/ai/NpcAgent.ts
[v1-settlement]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/settlement/createSettlement.ts
[v1-roles]: https://github.com/jm-sky/seedvale-v1/blob/454151315df6a95f55f3db4cabe41f8d4d6010c9/src/ai/characters.ts

