# Saltmere population, households and quest dependencies — canonical specification

**Status:** `done` — canonical starting roster D-NPC-23; gameplay implementation and dependent sites pending  
**Created at:** 2026-10-14  
**Created by:** ChatGPT GPT-6  
**Scope:** settlement--002 S4/S5; authoritative starting data and deferred implementation boundaries; docs only  
**Verdict:** S5 PASS WITH FIXES after author approval; [review 092](../../reviews/2026-10-14--092--saltmere-population-quest-review.md)


**Author clarification (2026-10-19, recorded by ChatGPT Astra):** [D-VISION-40](../../decisions/DECISIONS.md#author-clarifications--2026-10-19): Saltmere/the home settlement has **no inn**. The inn and first paid inn-meal site belong in a **larger settlement**, with actual S5/N6 site/staff/pantry/payee bindings. This does not add a home resident or block the home NPC daily-life loop.

## 1. Status, evidence and authority

This specification is **accepted starting-population canon** under [D-NPC-23](../../decisions/DECISIONS.md), after the source-first [S5 review 092](../../reviews/2026-10-14--092--saltmere-population-quest-review.md) and the author's selection of option A on 2026-10-14. The original [D-NPC-20](../../decisions/DECISIONS.md) 20-person roster is preserved in the decision log as **historical, superseded population data**, not the current Saltmere census. Later explicit [D-QUEST-27](../../decisions/disputed-oak-g05-curation.md), [D-QUEST-33](../../decisions/q06-room-for-one-more-curation.md) and [D-QUEST-28](../../decisions/q07-woodward-supper-curation.md) put Miles, Lucy, Matthew and now **Joan** together outside Saltmere and the supper at Ann/Peter Woodward's home. No Hewer duplicate is created. **This is a content contract, not evidence of implemented NPCs, work sites, quests or navigation.**

Sources and trust order: accepted decisions and actual code/overlay > their logical consequences > [S1 cast audit](../../research/2026-10-14--013--saltmere-quest-cast-audit.md), [S2 households](../../research/2026-10-14--014--saltmere-household-reconciliation.md), [S3 spatial dependencies](../../research/2026-10-14--015--saltmere-population-spatial-requirements.md) > imported material. [Research 011](../../research/2026-10-13--011--saltmere-population-households.md) is the historical approved D-NPC-20 roster. Physical sources: [home.md](home.md), [current overlay](../../../public/worlds/canon/overlay/areas/home.json), [reserved.ts](../../../src/game/data/npc/reserved.ts), [lifeStage.ts](../../../src/game/data/npc/lifeStage.ts), [D-NPC-21 AI contract](../../plans/implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md), [world--003](../../plans/world--003--home-geography-coastline-and-quest-frontiers.md).

**Provenance labels:** **A** accepted authored narrative or verified current code/visual; **C** S5-adopted canonical roster binding (reversible only through a documented amendment); **D** derived; **P** proposed future detail; **U** unresolved. The **17 local identities and eight home allocations are C**, while non-reserved numerical ages (except the elder life-stage requirement), technical ProfessionIds, family property rights, exact workplace coordinates and uncurated quest casting remain P/U unless specifically accepted. A worksite, resident, cast role and asset are different objects. Report keys are **stable authored identifiers for the specification, not yet persisted NpcIds**.

**Canonical census:** previous **20** minus the four former local Hewers (**Miles, Lucy, Matthew, Joan**) plus **one new local elder E01** = **17 residents / eight occupied existing houses / one empty sale plot**. Composition: **14 non-elder adults, one elder, two children** (15 aged ≥18). The local elder is **E01, a former adventurer** (not Joan/Ruth), living in the existing `elder` home; only his exact name, full backstory, technical profession and numerical calibration remain pending M4/M7. The household/sleeping arithmetic remains **1+3+3+2+2+1+2+3=17**. Starting visitors and external family are excluded.

**Post-S1 curation update:** [D-QUEST-44](../../decisions/v1-remaining-quests-batch-curation.md) provisionally retains/reworks **14** V1 story records and merges **one** cemetery favour into Q14. This decision occurred after S1–S3 and supersedes their earlier *reference-only narrative disposition* for those records; **it accepts neither imported cast, geographic placement, quest mechanics, rewards nor guaranteed implementation**. [D-QUEST-43](../../decisions/q05-map-riverbed-resource-curation.md) also retains the dry-river clue while leaving any mineral/clay/gold resource optional. **Newer [D-QUEST-45](../../decisions/v2-q10-q13-and-exploration-rewards-curation.md):** Q10 is retired as a separate quest (V1 abandoned gold mine leads), Q11–Q13 are retained/reworked with scope/gear still unimplemented; none of their reference-only cast becomes a Saltmere resident. **Q12's special sword is not automatically E01's owned legendary sword.**

**Author-approved sleeping clarification (2026-10-14; S5 integration input):** **One bed per NPC is not required** in Saltmere. Co-residents may sleep in the same bed or use simple floor bedding; multiple sleepers per visible bed are acceptable. Sharing a sleeping place **does not imply kinship, romance or common property**. Avoid only implausible severe clipping, blocked doors/escape paths or sleep positions that prevent ordinary movement. Do not demand additional beds, new houses, enlarged interiors or relocation merely to match the resident count. The existing D-NPC-21 bed/pallet/shared-placement mechanism remains the implementation basis; its precise sharing preferences/priority can be harmonised during M4 without a second sleep system. This **accepted author rule** relaxes S2/S3's stricter capacity assumptions; it **does not itself approve the S4 roster**; the roster was subsequently adopted by D-NPC-23.

## 2. Complete canonical starting resident NPC registry

Identity keys from S2 are stable **report keys**; the actual [reserved NPC IDs](../../../src/game/data/npc/reserved.ts) are shown explicitly only for four pinned characters. Age/stage uses [lifeStage.ts](../../../src/game/data/npc/lifeStage.ts): ages 0–12 child, 25–35 adultPrime, 36–49 adult, 65–84 elderly. No children count as labour. **H.slot** means a canonical starting residence in an already constructed Saltmere plot, not an implemented household record. Daily journeys in §4 are ordinary routines, not quest-specific overrides.

| Key, name, age/life stage | Profession; other ordinary tasks | Residence and family / social relationships | Quests, source/authority |
|---|---|---|---|
| **E01** unnamed Saltmere elder; **70 elderly P** | **Former adventurer A**, now quiet and retired; light chores/social/rest, **not an active fisher/worker**. Exact `ProfessionId` U (M4) | **H.elder C**, one person, **no invented kin or Hewer title** | Local elder and hidden adventurer past **A** [feature direction](../../quests/quest-feature-proposals.md#4-village-elder--former-adventurer); optional *Lost Treasure Chronicles* leads D-QUEST-44, real unique legendary sword at home, possible voluntary trust-based gift **A**; exact name/sword ID/lore/gift thresholds U; **not Ruth or Joan** |
| **F01** unnamed fisher; **25 adultPrime P** | Fisher **P**, shore catch, net care, private stock | **H.fisher-a C**; unrelated co-resident of Dora and Toby **P** | One fisher sufficient **A requirement**; name and trade output **U** [011](../../research/2026-10-13--011--saltmere-population-households.md) |
| **H01** Dora Herbert; **40 adult P** | Herbalist **A role**, herb gathering/preparation/trade; mother/caregiver | **H.fisher-a C**, mother of Toby **A**, unrelated to F01 | **G04 A** D-QUEST-32; meadow boar **P** D-NPC-20/D-QUEST-21; G08 retained |
| **H02** Toby Herbert; **8 child P** | Dependent, play, care and sleep; **no profession/work/kit/wage** | **H.fisher-a C**, Dora's son **A** | **G04 A** illness episode, not permanent sickness |
| **L01** Ralph Fieldman (**name and office A**, author 2026-10-25: fixed, not generated); **48 adult P** | Farmer **P**; **reeve, head of Saltmere A** (office, not ProfessionId; `HouseholdManifest.head`) | **H.fisher-b C**, husband of L02 **A**, Stephen's unrelated host **P** | **G08 A cast**, cargo reeve **P** D-NPC-20, tower reeve **P** |
| **L02** Mrs Fieldman, given name **U**; **46 adult P** | Farm/garden/home food work **P**; illness interrupts routine | **H.fisher-b C**, Ralph's wife **A**, not Stephen's relative | **G08 A role** D-QUEST-25; personal name **U** |
| **T01** Stephen Chapman; **40 adult P** | Trader **A**, own goods, consignment and trips | **H.fisher-b C** unrelated boarder; **permanent H vs N location U** | **G06, Q09 A** D-QUEST-31; G08 retained; no second Stephen |
| **W01** Ann Woodward; **32 adultPrime A** | Farmer **A**, crop stores, meals, pasture fence | **H.farmer C**, wife of Peter **A**; reserved id **ann_woodward** | Q07 D-QUEST-28, Q03/repairs D-QUEST-38, timber D-QUEST-22, message D-QUEST-37 |
| **W02** Peter Woodward; **36 adult A** | Woodcutter **A**, timber/cart/hauling, house work | **H.farmer C**, husband of Ann **A**; reserved id **peter_woodward**; **not H.woodcutter** | Q07/Q03, tower D-QUEST-34, scouting D-QUEST-36, timber D-QUEST-22 |
| **G01** Mark Hornblower; **38 adult A** | Guard **A**, one **daytime** post duty; water/patrol/home | **H.guard C**, Kate's husband **A**; reserved id **mark_hornblower** | G03/Q07 D-QUEST-13, water D-QUEST-24, fox D-QUEST-23, parcel D-QUEST-20, cargo D-QUEST-26 |
| **G02** Kate Hornblower; **34 adultPrime A** | Trader **A**, own stock/road/coastal deliveries | **H.guard C**, Mark's wife **A**; reserved id **kate_hornblower** | Parcel/cargo, shells D-QUEST-39, scouting D-QUEST-36, Q07 |
| **S01** unnamed local smith; **45 adult P** | Blacksmith **P**, forge yard, real tool/material access | **H.smith C**, no proposed kin | Ordinary smith role **P**; honest parcel shield-smith assignment **U**; **not Bernard/Sophie** |
| **M01** Molly Lambert; **42 adult P** | Shepherd **A**, P1 flock/Pip/hay/animal care | **H.woodcutter C**, Tom's wife **A** | G01 D-QUEST-42 and distinct general livestock losses D-QUEST-9 |
| **M02** Tom Lambert; **44 adult P** | Farmer **P**, garden, **small-beer brewing A story activity** | **H.woodcutter C**, Molly's husband **A** | G08 D-QUEST-25: his **specific** beer barrel |
| **B01** Jacob Bowman; **41 adult P** | Hunter **P**, wildlife/wood and normal home return | **H.hunter C**, Martha's husband/Hazel's father **D reference family** | G03/G07 retained reference details; **not auto boar helper** |
| **B02** Martha Bowman; **38 adult P** | Farming/garden/child care, possible poultry **P** | **H.hunter C**, Jacob's wife/Hazel's mother **D reference family** | G03/G07 retained reference; **not auto fox claimant** |
| **B03** Hazel Bowman; **10 child P** | Dependent, play/rest; **no hazardous or guard work** | **H.hunter C**, Jacob/Martha's daughter **D reference family** | G03/G07 retained reference; small-house berth **U** |

**One identity invariant (D-NPC-23 canonical):** E01,F01,H01,H02,L01,L02,T01,W01,W02,G01,G02,S01,M01,M02,B01,B02,B03 each occurs once in the local roster, each with one canonical starting slot. Four existing reserved identities retain their exact names, sex, age, profession, quirks and personality data. **spouseOf** in NpcDef is a profession hint, *not* a bound kin edge. M4 must use the accepted household/kin and stable authored cast-key→NpcId seams from [D-NPC-21](../../plans/implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md); never add a second generator.

### External and uncast actors (excluded from 17)

| Single identity / role | Residence and relationships; decision authority |
|---|---|
| **miles_hewer**, **lucy_hewer**, **matthew_hewer** | One **external** Hewer household **D**, married parents and adult son; G05 D-QUEST-27 / Q06 D-QUEST-33 **A**. Matthew can travel voluntarily or for real pay; solo player delivery remains viable. External house/site/route **U**. No local aliases |
| **joan_hewer** | **External Hewer family residence A** (author option A, D-NPC-23), with Miles, Lucy and Matthew; retained unique person and prior kin, **not** the Saltmere elder, Q07 host or E01. Exact external dwelling/route U |
| **bernard_smith**, **sophie_smith** | One father/daughter pair with **external candidate** forge **P**; G02/Q04 A D-QUEST-41/30, Q06 Sophie supply. Neither is S01 |
| **piers** | Accepted travelling thief/possible later paid worker G01 D-QUEST-42, **visitor**, never an automatic starting resident |
| **cedric** | G05 pig-owner reference/role **U** (name/location not pinned); no automatic local family |
| **ruth_role** | Q14 cemetery giver role accepted, imported given name “Ruth” **not pinned**, no assumed alias to E01/Joan |
| **edith_fowler**, **bridget_ward**, **elspeth_shepherd**, **margaret_reeve**, **rosalind_marchant**, **percy_clark** | External/town/travelling **P/U**, Q02/Q05/Q08 and other imported references; no Saltmere occupancy inferred |
| **Additional uncast roles** | Boar combat hunter; honest parcel smith; tower neighbouring reeve/claimants; external cargo owner/crew, messenger/impersonators; Q14 custodian; chronicle specialist, hunters' circle, explorers and claimants **U**. Visitors may travel or immigrate after actual events, not join starting headcount |

Sources: [S1 unique-person registry](../../research/2026-10-14--013--saltmere-quest-cast-audit.md#4-unique-person-and-relationship-registry), [S2 external register](../../research/2026-10-14--014--saltmere-household-reconciliation.md#5-non-saltmere-cast-not-counted-as-residents), accepted [curation index](../../decisions/DECISIONS.md).

## 3. Households, facilities, sleeping and ownership

The actual [overlay](../../../public/worlds/canon/overlay/areas/home.json) has **eight houses and one house-less sale plot**. House IDs below are existing geometry, **not** dynamic occupancy. [houseDefs.ts](../../../src/game/world/structures/houseDefs.ts) has one bed furniture entry per defined house. **This is acceptable for multiple residents under the author's shared-sleeping rule**, not an obligation to model one berth per person. [D-NPC-21](../../plans/implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md#3-opus-answers-n2-opus-55-2026-10-14-recorded-as-d-npc-21) provides the existing bed/pallet/shared placement mechanism; only egregious visual clipping and movement/doorway obstructions need a physical check.

| Existing slot / house type | Canonical starting residents and relation | Sleepers and practical limits (not individual bed quotas) | Facilities, ownership and story |
|---|---|---|---|
| **elder / house-8x6-a** | E01, former adventurer living alone | **1 sleeper**, accessible resting position and doorway U | **One persistent, unique, personally owned legendary sword kept at home**, from the accepted [elder narrative](../../quests/quest-feature-proposals.md#4-village-elder--former-adventurer); sword/house title separate from legacy Hewer property, no assumed inherited title. Quiet daily life and optional chronicle stories, not automatic quest completion reward |
| **fisher-a / cottage-6x4-a** | F01 + Dora and Toby, unrelated housemates except mother/son | **3 sleepers**; shared bed/floor bedding acceptable; door access U | Existing nets/drying and well; **fish vs herbs/medicine distinct stock**; G04 |
| **fisher-b / cottage-6x4-b** | Ralph + wife, unrelated Stephen lodger | **3 sleepers**, sharing including non-kin lodger allowed without implied relationship; basic access/privacy U | Visual fishing kits not a mandatory fisher profession; private Fieldman food vs Stephen goods/purse, G08 |
| **farmer / cottage-4x4-a** | Ann + Peter married | **2 sleepers**, sharing permitted; avoid blocked passage | Trough/hay/grain visuals; external farm/P1 needs. **Woodward private fence, foundation, roof, Peter cart, communal pasture fence all separate repair/damage targets**; Q07 |
| **guard / cottage-6x4-a** | Mark + Kate married | **2 sleepers**, sharing permitted; no automatic guest/rental entitlement | Mark post vs Kate private stock, home well; Q07 guests, shells home decoration |
| **smith / cottage-6x4-b** | S01 alone | **1 sleeper**; home/forge customer thresholds U | Existing anvil/workbench; fuel/ore/heat/output not implemented. Neither Bernard nor Sophie here |
| **woodcutter / cottage-4x4-a** | Molly + Tom married | **2 sleepers**, shared sleeping permitted; normal door access | Old **Woodward family visual tag is stale**; not Peter's home. Wood piles do not confer timber ownership; G01/P1/G08 beer storage |
| **hunter / cottage-4x4-a** | Jacob + Martha + Hazel | **3 sleepers**, shared bed or floor bedding acceptable; only severe clipping/blocked exit remains a risk | Hides, herb-bed visuals; not Dora's medicinal meadow; hunter/garden ownership U, G03/G07 |
| **sale / no house** | **none** | **0** | Empty fenced plot for sale with well position; not crew/player/visitor lodging |

**Relaxed sleeping rule (author A):** stable sleeping associations may share one visual bed or ordinary floor bedding; one-to-one bed capacity is **not** an acceptance gate. Check only believable placement, usable doors/passages, child/elder safety and severe visible overlap. **Do not swap the Bowman household or enlarge houses merely for bed count.** A house swap is an exceptional fallback if there is a genuine, verified movement/visual obstruction, not a default requirement. Player rental and guest permission are separate social/access questions. Accepted [D-NPC-22](../../decisions/npc-relationships-and-social-effects-contract.md) explicitly removes **guest-bed accounting**: positive personal relations **or** local reputation may allow a paid home-stay offer, but none is automatic; resident sleeping placements and private-home permission remain real. Do not require a spare physical guest berth, and preserve the basic paid guard lodging exception.

**Required ownership separation:** co-residence does not merge identity, money, stock, marriage, trade permissions, title or quest rewards. **P default:** personal goods for fisher, herbalist, trader and smith, ordinary shared meals only by consent; shared wells/green usable by residents; explicit rights needed for fields, livestock, pasture, herb nodes, communal lumber, visitors, shops and rent. Stockpile tiers and barrels are visual until M5/M8 ownership systems exist. Tom's G08 barrel is not every barrel in town. [S2 §2](../../research/2026-10-14--014--saltmere-household-reconciliation.md), [S3 §5](../../research/2026-10-14--015--saltmere-population-spatial-requirements.md).

## 4. Ordinary occupations and daily-life responsibilities

Routines are **interruptible autonomous intents**, not quest-owned scripts or implemented production. Use the existing [npc--003 N2](../../plans/implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md) contract: one SettlementSpots adapter, needs over schedule bias, calendar-hour sleep/work blocks vs gameplay-second short acts, persist current agent position across load. **New Game/new roster entrants** alone may settle to an initial time-based location; never teleport NPCs on reload. Workspot presence under early M4 AI is not a fish/wood/herb/food minting mechanic.

| Residents / normal trip from canonical home | Work and return responsibility | Requirements |
|---|---|---|
| E01/Toby/Hazel → sleep area, well, green | E01 rests/socialises and does light chores; stories of past expeditions emerge gradually with actual relationships/knowledge; children play/eat, receive care, never staff work | Safe shared or floor sleeping, elder/child movement and ordinary home access; no one-bed-per-person rule |
| Ann/Ralph/Mrs Fieldman/Tom/Martha → garden/field **U**, S2 well, home | Agricultural work, food/water; Ann P1 public fence, Tom specific small-beer processing | Actual crop land, seasonality/stock and household rights M4/M5/M8 |
| Molly → **P1** pasture/pen/water → home | Sheep/Pip feed, gates, fodder, shelter and ordinary flock movement | Real livestock M6; ownership M8; generic loss separate from Pip |
| Dora → **M1** herb meadow → preparation/home with Toby | Collect real replenishable herbs, prepare/store and trade | Actual safe medicinal nodes M5, boar M6; stream **not proven** |
| Peter → **S5→W1** forest/yard/cart → Woodward home | Tree work, timber stack/haul, cart upkeep, home meals | Physical wood/road/carts, private/public claims, persistent damage M8/M10+ |
| Jacob → **W1**/viable hunting habitats → Bowman home | Hunt wild animals without guaranteeing a safe wolf forest | M6 fauna/ranges, return routes; not automatically meadow-boar helper |
| F01 → **S7→S8/S9** jetty/shore → home | Nets, catch/preservation and carried stock | Real fishing/boat/shore access M5/M8; no sailing AI implied |
| S01 → local anvil/workbench, customers → home | Tools, fuel/materials, genuine smith output/services | Real inventory/production and rights M5/M8 |
| Mark → **S4** gate/post, S1, water, home | One **day guard shift [06:00,18:00)** per [npc--002](../../plans/npc--002--guard-equipment-and-shifts.md); no extra/night guard | G03 night-torch/Q07 evening conflict **U**; no torch-operating AI in initial N2 |
| Kate/Stephen → S1/S3 buyers → F1/F2 roads → home | Independent trade, real goods/deliveries, arrival and rest | M4 travel, M8 goods/title, Stephen residence U |
| All residents/visitors → S1/S2/S3 | Community conversation, water, news, social/rest and real food | Green/benches/wells are visuals, not verified 17-person seating or functional market |

**Timing conflict:** Q07 requires Mark's evening watch while his one accepted roster shift is daytime; G03 needs a night scene. Preserve [D-QUEST-13](../../decisions/DECISIONS.md) next-dusk deferment where Q07 occupies Mark, and resolve schedules in M7 without inventing another guard, freezing Mark or treating torches as invisible NPC work.

## 5. Geography, sites, travel and current vs future assets

[S3](../../research/2026-10-14--015--saltmere-population-spatial-requirements.md#4-required-locations-and-infrastructure-inventory-31-records) audited **31 records: 9 settlement plots** (§3), **10 shared existing visual site/route groups**, **12 world--003 candidate/front groups**. **EV** = existing visual/geometry, not functional service; **EC** = existing remote landmark; **P** = reserved/planned, not authored; **U** = missing contract, navigation, access, resources or site placement. S1–S10 are audit labels, not newly created runtime ids.

| Existing shared group (10 EV) | What actually exists and what remains U |
|---|---|
| **S1 green** | Campfire, square, benches; no seating/gathering capacity, meals/market state |
| **S2 well** | Shared water bucket/well and plot wells; no actual water item, transfer or contamination action |
| **S3 board** | Noticeboard for M3 rumours, **not** inn or complete merchant market |
| **S4 north gate** | Gate/palisade/torch posts; agent passability and night guard/torch AI U |
| **S5 north track** | Local route from gate toward wood; not the whole external F1 road |
| **S6 south track** | Green-to-beach local ground track; cart clearance U |
| **S7 jetty path** | Local green-to-bay path, carrying/boat boarding U |
| **S8 jetty/boats** | Boat/jetty props; sailing, catch and boat ownership U |
| **S9 bay shore** | Coastal water/beach; shell resource and wreck placement U |
| **S10 forest camp** | Existing camp POI; neither NPC inn nor guaranteed crew shelter |

| world--003 site/front (12) | Intended use; what remains planned/unverified |
|---|---|
| **F1 north road P** | Visitors, wood hauling and parcel; beyond S5 route/slope/ETA U |
| **F2 east road P** | Travel to another settlement, via east wood/meadow/forest; no actual remote endpoint |
| **F3 sea P** | Wreck/rescue coast; no sailing promise |
| **E1 east reclaimed wood P** | Small wood/palisade band; canon/v2 C0–C5 and G3 still needed |
| **M1 herb meadow P** | Dora gathering and one boar; nodes, paths and water U |
| **W1 near-north wood P** | Timber and Greybeard; forest exists but chosen stands and haul paths U |
| **W2 east deep forest P** | Dangerous wolves/pack/den; placed habitat and road buffer U |
| **W3 coastal wood P** | Fox range; den/poultry border U |
| **P1 communal pasture P** | Molly/Pip and Ann fence; **location not selected** (north F1 or near M1), pens, gates, water, shelter/title U |
| **C1 Hollow Deep EC** | Known existing distant cave ~1.3 km NNE; ordinary daily path not inferred |
| **C2 wolf den/overhang P** | W2 den candidate; rock overhang suffices, no mandatory new cave |
| **C3 coastal cave/cove P** | Missing Cargo salvage/evidence site; not located |

**World geography constraints (A):** keep existing Saltmere and bay; east progression is **small wood and palisade pieces → meadow → forest**, road onward to a settlement ([world--003](../../plans/world--003--home-geography-coastline-and-quest-frontiers.md#3-frontiers-and-quest-sites-d-arch-42)). Current [home survey](home.md#survey-w2-tools-2026-10-10-overlay-off) finds **no nearby river or lake**, just wells. G04 “stream” does not establish one at M1; Q05's **old dry riverbend** requires its own verified location. No overlay raising to reclaim east: world--003 owns the offline snapshot transform. Survey boxes are not reachable workspot coordinates.

**Missing/unplaced (not extra accepted POIs):** genuine fields, vegetable gardens, poultry pen, sheep night enclosure/feed, herb patches/preparation and storage, timber/cart yard and damaged logging cart, forge fuel/heat and ore, real buyer/market and Tom beer barrel, cemetery, Lonely Tower, shared oak/acorn pig grounds/bridge and alternative structural tree, external Sophie forge/Hewer dwelling, Q02 sow hollow, Q05 dry riverbend/stone circle, coast wreck and guest/rescued-crew lodging. Sites and route permissions require world--003 G1/G2, M3/M4/M5/M6/M8; do not grant free owned stock because a decorative mesh exists. Travellers can depart/return or be delayed, injured or killed under the ordinary simulation. External home and event visits are not extra permanent Saltmere residents.

## 6. Quest-to-population dependency matrix

An **accepted narrative** below is not a current quest implementation. Cast/profession/residency marked P/U stays open; NPCs use common M4 AI, M5 goods/health, M6 fauna, M7 events/relations and M8 ownership/travel rather than quest-only mechanics. Quest classifications reconcile [S1 61-entry audit](../../research/2026-10-14--013--saltmere-quest-cast-audit.md) and later D-QUEST-43/44.

| Accepted or deferred story | Participating NPCs, relationship/role | Locations, incidents, outstanding shared-system dependencies |
|---|---|---|
| **G01 Lost Lamb** D-QUEST-9/42 | Molly shepherd, Pip **sheep**, Piers travelling thief, Mark optional on duty | P1 flock → road/Piers → return/possible real paid work. Pip is distinct from generated losses; M4/M6/M8 |
| **G02 Rusty Debt / Q04 Handle Remembers** D-QUEST-41/30 | Bernard and daughter Sophie **external smiths**, buyer U | External workshop, damaged hammer/plowshare, real goods/payments; two **independently startable** incidents, not S01 |
| **G03 Night Torches** D-QUEST-13 | Mark; Hazel/Martha/Jacob details reference-retained | S4 torch posts/dusk and actual duty; G03 may move to next dusk due to Q07; no Hazel guard staffing |
| **G04 Root by the Stream** D-QUEST-32 | Dora herbalist + Toby son, real child illness | Home→M1 ordinary herbs→medicine/return; stream/site/resource U |
| **G05 Disputed Oak** D-QUEST-27 | Miles **outside Saltmere**, Cedric pig-owner role U, external wood/bridge workers | External oak/acorns/pigs, collapsed bridge, alternate long tree/cart; autonomous decision and repair; felling irreversible once actual cutting starts; M6/M8/M10+ |
| **G06 Trader Letter / Q09 Goods on Ground** D-QUEST-31 | Stephen trader, grain buyers/haulers U; home location U | Actual goods, winter reserve, public meeting and inter-settlement routes M8; remain distinct independent quests |
| **G07 Greybeard / dangerous wolf and den / pack** D-QUEST-8/14/15/16 | Jacob/Bowman reference, Mark/Kate/Ann involved where curated, no compulsory new hunter | W1 **Greybeard** vs W2 **dangerous wolf/den** and pack; separate fauna incidents M6/M7, D-QUEST-16 policy accepted (2026-10-14); distinct concrete incidents and exact den/site bindings still M6/M7 |
| **G08 Well and Rumor** D-QUEST-25 | Ralph, wife, Stephen, Tom, Dora; Margaret external reference | S2 well and **Tom-specific barrel**/witness evidence; external accusations and social consequences, no generic proximity timer |
| **Q02 roadside sow** D-QUEST-21 | Edith/Bridget/carter casting P/U | External hollow/sow with young **not** medicinal-meadow single boar |
| **Q03 Woodward roof and earlier repairs** D-QUEST-38 | Ann and Peter same household; NPC repairers as shared roles | **Separate** household fence, foundation, roof; one **global** storm 1–3 game-calendar days after foundation repaired; not a private quest-weather duplicate; M10+ |
| **Q06 Room for One More** D-QUEST-33 | External Miles/Lucy/Matthew kin, Sophie smith; Matthew may consent/refuse finite companion job | External home→Sophie forge, prepaid axe head+wedge order, real transfer/travel; paid, voluntary or solo branches, M4/M7/M8 |
| **Q07 Six Bowls, One Pan** D-QUEST-28/13 | **Ann/Peter hosts**; Mark/Kate guests; no Hewer hosts/extra Woodward children | H.farmer, actual stores/fuel/cooking and shifts; one table/two sittings/doorway, autonomous meal even without player |
| **Q14 cemetery care + V1 cemetery favour** D-QUEST-29/44 | Cemetery-care giver **role accepted**; Ruth identity U, Kate possible lead and legal claimants | Cemetery/permission for grave access, **one merged** cleanup incident/reward; location U |
| **Q05 riverbed map** D-QUEST-43 | Rosalind (external narrative), Percy/Edith reference U | Dry historic bend/stone-circle clue; optional resource deposit **not required**; no automatic pottery, gold extraction or caravan route |
| **Q08 pasture water** D-QUEST-40 **deferred** | Elspeth/reeve reference only | Neighbouring pasture/shared well, optional trough/new well undecided, **not** mandate for Saltmere |
| **V1 water for Mark** D-QUEST-24 | Mark **actually on duty** | S4 post and real container physically filled/transferred at S2; touching well alone insufficient |
| **V1 Lost Parcel** D-QUEST-20 | Kate/Mark, messenger/impersonators, optional merchant, honest smith **identity U** | F1/F2 arrival, real shield and money/evidence/pauldrons; merchant absence must not block; S01 merely possible |
| **V1 Missing Cargo** D-QUEST-26 | Kate, Mark, reeve Ralph **P**, real crew/external owners | F3/S9/C3 wreck, rescue, mixed-owned cargo and possible *later* survivor immigration; no starting bed |
| **V1 fox near hamlet** D-QUEST-23 | Mark, poultry owner U **not automatically Martha** | W3 fox, real poultry threat; one fox; Q01 white hare/Luke retired |
| **V1 Woodward timber priority** D-QUEST-22 | Ann/Peter married, two independent motives | **Peter's damaged logging cart** vs **P1 communal fence**, distinct from private house fence and G05 oak; autonomous normal repairs, 4 calendar-hour second-reward window |
| **V1 Lonely Tower** D-QUEST-34 | Peter, Saltmere reeve Ralph **P**, neighbouring reeve/claimants U | Distinct tower, property evidence/cache, real external trip U |
| **V1 scouting forest/road** D-QUEST-36 | Peter forest work vs Kate trader/road travel | W1/W2/cave discovery vs F1/F2 risk; separate quests, natural knowledge reports |
| **V1 Ann→Peter message** D-QUEST-37 | Married spouses at different ordinary work sites | Ann house/field ↔ Peter W1; organic reunion closes offer, no manufactured schedule |
| **V1 shells for Kate** D-QUEST-39 | Kate's private favour, Hornblower household | S9 real shells, actual transfer/reward, saved decoration at house entrance, no duplicate reward |
| **V1 Rat Plague** D-QUEST-10 | Mark/affected home and owners U | One persistent actual food-store infestation, not duplicated generated incident |
| **D-QUEST-44 elders/chronicles**: elder winter favour, borrowed-axe dispute, chronicle search, deciphering | **E01 is the accepted Saltmere former-adventurer narrative anchor C**; other helper/claimants/specialist and **specific quest-giver bindings U** | Four retained V1 story records may share E01's truthful first-hand stories/knowledge; not one forced chain. The legendary sword is **already a real owned item** and may be gifted voluntarily for trust/respect, **not a quest payout**; locations/casting/reward logic remain M7/M8 U |
| **D-QUEST-44 hunters**: circle introduction, hunting ground | Hunter circle/members U; Jacob possible **P** only | Two story records, ordinary deer habitat and affiliation, no manufactured issue |
| **D-QUEST-44 mysteries**: suspicious transport, monolith, missing hunter, old bones | Carriers, victim/hunter, witnesses/claimants U | Four distinct records; actual cart/cave/monolith/remains/signet, evidence and rights U |
| **D-QUEST-44 treasure**: V1 dark-forest map, bandit stash, bear cave, lost expedition | Sponsors/claimants/informants U; no required Saltmere residency | Four distinct records; caves/ruins/abandoned stash/evidence only when real, **not** V2 Q05/Q11/Q12/Q13 by similarity |
| **V2 Q10–Q13 D-QUEST-45** | Q10 retired/compatible ideas feed V1 gold-mine story; Q11–Q13 retained narrative only, reference cast (Agnes/Silas/Baldwin and other NPCs) **not a Saltmere assignment** | No additional local resident or mandatory Saltmere worksite; Q12's special sword and E01's personally owned legendary sword remain **distinct unless evidence establishes otherwise**; no large quest-only mechanics without author approval |

**Merges/retirements:** Q01 hare/Luke retired; old V1 Herbs for Ann no separate quest (G04 ordinary replenishment); generated livestock losses ≠ Pip G01; cemetery favour merged into Q14; merchant wolves folded into pack follow-on without collapsing Greybeard and dangerous-wolf stories; old Hewer supper Q07 superseded. D-QUEST-44 acceptance is only *narrative retention/merge*; no implied 14 fully implementable M7 quests.

## 7. Conflicts and reconciliation ledger

| ID / severity | Conflict or limit | S4 treatment — **P unless accepted rule cited** |
|---|---|---|
| **C1 critical — resolved S5** | D-NPC-20 home Hewers/20 vs later D-QUEST-27/28/33 and Joan's unassigned address | **D-NPC-23 supersedes old local census**. Miles/Lucy/Matthew/Joan external as one family, Woodward supper remains in Saltmere; no copies |
| **C2 high — resolved S5** | Joan was sole D-NPC-20 elder; Saltmere still requires one elder | **E01 is the new accepted resident elder**, same former adventurer/story-sword character; Joan is external. No additional elder or Hewer alias |
| **C3 low (author policy clarified)** | 17 canonical residents / eight bed meshes; older S2/S3 assumed restrictive capacity | **A:** shared bed/floor sleeping permitted, no bed-per-NPC or couple-only quota; M4 checks only safe paths/doors and serious clipping. **Not a population/blocking capacity conflict** |
| **C4 high** | Mark one day shift vs G03 nighttime/Q07 evening | Retain day shift, decide duty-sensitive scenes via M7/D-QUEST-13; no invisible night guard |
| **C5 high** | P1, real fields, herbs, W1 haul, F2 road, cemetery/tower/bridge unplaced | world--003 G1/G2 and sim--001 nav, not guessed coordinates or quest-only movement |
| **C6 medium** | Old H4 Woodward family tag on woodcutter where Lamberts would live; Peter actually at farmer | Residence/profession/visual role distinct; overlay metadata repair only in later M4 integration |
| **C7 high** | Bernard/Sophie vs S01 gift smith; Q14 Ruth vs E01; boar helper identity U | No alias; explicit named/role casting at S5/M7 |
| **C8 medium** | Stephen H/N residential ambiguity and guest/ownership gaps | Default one H lodger who travels; external decision yields 16 locals and two fisher-b residents |
| **C9 medium** | Decorative wells, carts, anvil, torches and nets wrongly suggest implemented output | Mark EV visual vs U functional; no free goods/duplicate services |
| **C10 medium** | G04 stream wording vs no local river; Q05 dry bend elsewhere | Survey actual geography; no invented water/source/resource deposit |
| **C11 medium** | D-QUEST-44 newer than S1 reference classification; generated quest collisions | Retained 14 + one Q14 merged; no premature residents, places or payout mechanics |
| **C12 medium** | Temporary visitors/crew, property and player rental may overload houses or sale plot | No automatic bed/title; M4/M8 shelter/ownership policy required |

## 8. Implementation impact matrix — requirements vs recommendations

| Owner | **Requirements/input after S5 canon decision** | **Implementation suggestions / later verification only** |
|---|---|---|
| **M4** identities, households, occupations and daily AI | Unique authored cast-key→NpcId, home/kin/social-role data, real work pointers, stable sleep associations (sharing allowed), 4 reserved pins, child/elder eligibility, guard shifts, real movement/needs | Reuse **sim--001** agent registry/grid/save and **npc--003 D-NPC-21** SettlementSpots, schedule and shared/pallet sleeping. 17/8 is **adopted starting content**, not yet instantiated; test doors and serious clipping, not one bed per NPC; test 2nd settlement fixture and Save/New Game |
| **M6** husbandry, wildlife, hunting | Normal sheep/Pip, pigs/acorn use for G05, poultry/fox, M1 boar vs Q02 sow, separate wolf/Greybeard/pack habitats, ordinary hunting | Fauna shared range/den and persistent incidents; if pigs infeasible, **defer G05**, never quest-only pig mechanics |
| **M7** quests/events/locations | Stable actor roles/no aliases, real conditions/timing/travel, companion consent, single incident/save/knowledge authority, lawful cemetery, storm/repairs, post-S1 D-QUEST-44 curation still needed | Use existing world/quest/social/economy contracts, ordinary autonomous NPC schedules; no duplicated rewards/events, phantom night guard or permanent quest holds |
| **M8** economy, ownership and travel | Private versus household/common stock, land and pen rights, fish/field/herb/timber output ownership, trade/consignment/money/wages, far external Hewer/Smith continuity | Conserved goods/permission and bounded near/mid vs far travel; avoid decorative kit-backed free resources |
| **world--003** geography | Keep eight existing slots/bay and east **E1→M1→W2** order; survey P1, M1, W1–W3, F2, C2/C3, external quest links; never invent stream | G1/G2 survey before G3 authored ops; C0–C5 snapshot transform in its own plan; S4 changes no geometry |

Supporting prerequisites: M3 discovery/board rumours, M5 water/herbs/food/health, M10+ common construction/repair and deterministic single global weather authority. **This document alone does not make M4/M7 implementable.** [S3 §8](../../research/2026-10-14--015--saltmere-population-spatial-requirements.md).

## 9. Resolved author decisions and deferred implementation details

| Question / owner | Authority / remaining detail | Accepted decision or implementation default |
|---|---|---|
| **U1 author/S5 — resolved** | D-NPC-20 supersession and Hewer residence | **Accepted D-NPC-23:** one external Miles/Lucy/Matthew/Joan family, no local copies; keep historical roster in decisions |
| **U2 author/S5 — resolved** | Local elder identity; lore and item implementation deferred | **Accepted D-NPC-23:** E01 in existing elder house, quiet former adventurer with personally owned persistent legendary sword; not Joan, not Ruth; optional trust-gift not quest payout |
| **U3 M4 (technical only)** | Safe doors/passages, believable sleep presentation and player guest permission | **A:** beds may be shared by relatives or unrelated housemates; floor bedding allowed; no bed quota or automatic Bowman↔smith swap. Fix only genuine obstruction/clipping; guest rentals need explicit permission |
| **U4 M4** | F01, S01, E01, Mrs Fieldman names, stable ids; Ralph reeve/Dora boar | Canonical role/home keys, but exact names, technical `ProfessionId`, numeric NpcIds and boar binding remain M4/M7 details; no reserved-id aliases |
| **U5 M7** | Honest parcel smith, Q14 Ruth, combat hunter, Cedric, external reeve and D-QUEST-44 specialist | Reuse an existing person only after explicit evidence/decision; otherwise keep visitor/role U |
| **U6 M4/M7** | Stephen's ongoing residency and travel implementation | D-NPC-23 defaults to one Saltmere Fieldman boarder who travels; any change of actual home requires documented census update |
| **U7 M4/M8** | House/land/pasture/medicine/private stock access, rental, visitor and crew sleeping | Separate personal funds/title, consented common use, no use of empty sale plot as bed |
| **U8 M7** | Single daytime Mark vs dusk Q07/G03 | Retain actual shifts; re-time bounded scenes with D-QUEST-13 next dusk, no second guard |
| **U9 world--003** | P1/M1, safe forest, carts, site geography, G04 water | No stream claim; pick surveyed P1 and real accessible herb nodes first |
| **U10 M4/M5/M6/M8** | Working food/fishing/forge/husbandry/stock | Build shared work/resource/ownership systems later; visual placeholders only now |
| **U11 M7** | D-QUEST-44 actors, nerfs, event overlap and implementation feasibility | 14 provisional independent/rewrite + one merged Q14, no timeline/cast guarantee |
| **U12 M7/M8/M10+** | Off-screen travel, bridge work, storm/wreck and load/reward consistency | Shared persistent incident, agent, weather, repair and ownership authorities; defer blocked scenarios |

**Author resolution completed (D-NPC-23):** U1/U2. The remaining rows are **technical implementation or future quest-content gates**, not blockers to adoption of starting actor identities and homes. New names, detailed casting, site geography, sleeping-path safety, house title, sword item selection/ownership implementation and Mark's scene timing are **not** silently solved here.

## 10. Focused S4 verification and S5 acceptance checklist

**S4 document consistency check** (source/overlay based; **not** runtime testing):
- [x] Exactly **17 unique resident report keys**, each with one canonical starting home; occupied-house sum **1+3+3+2+2+1+2+3=17**.
- [x] Ages: **14 non-elder adults + 1 elderly + 2 children**; mandatory shepherd, herbalist distinct from Ann, reeve social office, fisher and local elder covered (**some bindings proposed**).
- [x] Four reserved people once each; no duplicate Woodward/Hornblower/Hewer, Bernard/Sophie/Ruth or artificial Luke.
- [x] Nine actual overlay slots, eight houses and vacant sale preserved. **Author allows multiple sleepers per bed and simple floor bedding**; no one-bed-per-NPC test.
- [x] S3 **9+10+12=31** site records included; existing visual vs planned/missing systems explicit; no invented geography.
- [x] D-QUEST-27/28/33 and newer D-QUEST-43/44/45 carried through; retired/merged stories not double-counted; D-NPC-20 retained historically and superseded by D-NPC-23 for the roster.
- [x] Open authority conflicts, timing, capacity and location gates are visible.

**S5 (canonical adoption PASS WITH FIXES) acceptance tasks:**
- [x] Fresh-context [review 092](../../reviews/2026-10-14--092--saltmere-population-quest-review.md) checked roster, kin/identities, eight households, decisions, code and quest-to-person/site bindings. No Opus subagent was available; that second-model gate is not claimed.
- [x] Author accepted option A: Joan resides with external Hewers; E01 former adventurer is the Saltmere elder. D-NPC-23 supersedes the D-NPC-20 starting roster without erasing its historical text.
- [x] Reconciled census, eight occupied home slots, story/sword ownership boundary, stable actor keys and owned/deferred features. Uncurated M7 roles remain unassigned.
- [x] Checked cross-document source references and identified unplaced sites and route/permission prerequisites in M4/M6/M7/M8/world--003; **runtime nav/site validation still belongs to those owners**.
- [x] Coordinated S5 canonical links from [docs/INDEX](../../INDEX.md), [home](home.md), NPC plan/roadmap and [D-NPC-23](../../decisions/DECISIONS.md).

**Explicitly not tested or edited:** actual agent generation/house sleeping/nav/interactions/save, livestock, trade, quests, beach/world geometry, overlay, PROGRESS, next-session prompt; no heavy tests, full pnpm check or GPU benches. These remain milestone gates.

**S4 result: PASS WITH OPEN ISSUES. S5 final: PASS WITH FIXES.** Canonical **starting population only**, D-NPC-23 adopted after author choice; implementation remains governed by M4/M6/M7/M8/world--003. [Review 092](../../reviews/2026-10-14--092--saltmere-population-quest-review.md).
