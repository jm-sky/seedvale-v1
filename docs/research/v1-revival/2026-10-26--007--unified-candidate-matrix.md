# Seedvale V1 Revival — R7: Unified Candidate Matrix

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Status:** Complete research consolidation — READY WITH QUALIFICATIONS for Astra and author strategy discussion.  
**Decision authority:** Astra and the author. No candidate is approved, rejected, scheduled or assigned a final KEEP / ADAPT / PORT / REBUILD / DEFER outcome.

## 1. Executive overview

This register contains **62 unique candidates**, derived from the 52 inventory rows in R2–R5, six additional decision-boundary splits and four concrete opportunities elsewhere in those reports. Eight repeated secondary opportunity mentions are represented by existing canonical entries (§2); no original inventory row was discarded as a whole duplicate. Detail-register headings define canonical IDs; tables and dependency references are views of those same records.

| Domain | Candidates |
| --- | --- |
| Architecture & simulation | 13 |
| World & geography | 6 |
| Graphics & visual assets | 13 |
| Gameplay & item correctness | 12 |
| Content, knowledge & audio | 9 |
| Player interface & travel | 9 |

Opportunities range from search storage, Save correctness, bounded preparation and diagnostics to local terrain/bank shaping, representation/animation/weather techniques, item presentation, manufacturing/combat alternatives, selected stories, audio and map affordances. Expected benefits are hypotheses unless a scoped historical observation is explicitly attributed. Candidate count is an accounting result, not an objective or a measure of value.

V1 remains the foundation: regional geography and spatial authority; rich vegetation/material/weather response; autonomous residents and selected offscreen commitments; real stock/production/logistics; ecology; item/food provenance; earned skills/equipment; one quest runtime, cast and consequences; maps/knowledge; migration-capable saves. Preservation permits targeted defect repair. It does not imply complete simulation replay, universal unloaded persistence, arbitrary transactional rollback or independent aesthetic acceptance.

Main uncertainty families are current V1 workload, world/save retention, continuity/determinism expectations, incomplete donor loops, selected asset/voice readiness and subjective product choices. Six open research families U01–U06 remain (§10); **zero unresolved cross-report classification contradictions** remain after applying R6. There is no missing initiative-wide domain. Decision-level gaps remain: matched V1 CPU/GPU evidence, approved reference scenes/journeys, full selected gameplay loops and selected asset provenance. Those are conditional evidence needs, not grounds for another broad recon.

Important shared boundaries are geography→crossings/sites/maps/Save; NPC detail handoff→real goods; item identity→craft/trade/quests/Save; weather/time→wind/snow/depth/LOD; and engagement/travel→movement/needs/world time. §6 distinguishes dependency types. No implementation sequence follows from the table order. The author's tentative architecture→water/weather→gameplay→content sequence is context only; Astra may start elsewhere.

## 2. Matrix legend and methodology

**Evidence basis.** Read CLAUDE, the dossier index and R1–R6, using R2–R5 inventories as principal inputs, R1 as preservation baseline and all R6 findings/risks/handoff as reconciliation authority. No broad code reconnaissance or new application test, build, benchmark, visual comparison or listening session was commissioned. Six two-line source reads only resolved exact file locators; they establish paths, not fresh behavioral verification. R7's independent execution is limited to document structure/reference/count validation.

V1 read head: `82850bd1c533f4c569185c33b040277216050d2b`. A fresh GitHub comparison from R1's `00a1e0332aa034104d9021e82b0bf5299c4216e1` to this head reports six commits and eight documentation-only paths: R1–R6 and two indexes. Thus the report pins still describe the same V1 application. V2 evidence remains pinned to `9ba54815493b886eb1bdce032f5209aeb2856c37`; V3 to `17a81bd1ea0cea1920525a92b52d754e155a3ead`. R7 does not silently promote later source changes to inspected evidence.

**Ownership and granularity.** A canonical entry describes one meaningful adaptation/decision boundary. Combined source means evidence from multiple versions, not an approved combined implementation. Catalog assets without a demonstrated distinct benefit are selection families, not promises to import every file. Existing capabilities are counterparts, never absent merely because their implementation differs.

| Dimension | Independent values / interpretation |
| --- | --- |
| Candidate type | TECHNIQUE: algorithm/optimization/pattern; FEATURE: player/simulation capability; CONTENT: authored narrative/media; UI: presentation/interaction; FOUNDATION: enabling correctness/infrastructure. |
| Source maturity | Implemented and active; Implemented but disabled or gated; Partially integrated; Standalone component/demo; Authored content only; Planned only; Unknown. Detail records state the exact slice. A code example can be active in V3 without supplying a complete V1 donor loop. |
| Live activation | Separate detail field: production caller/default, gate/override, demo-only or unknown. Never inferred from tests, filenames or ledger status. |
| Verification | SI = Source inspected by the cited reports; TP = Tests present for the cited slice, not a passing claim; HT = Historical test/benchmark evidence; HT-FAIL/inconclusive retains a negative/uncertain result; AA-historical = scoped historical Author visual/gameplay acceptance. Independently executed technical verification = none for game candidates in R7; Author acceptance of V1 adaptation = none. Not verified applies to all remaining integration/acceptance claims. |
| Effort | XS isolated data/presentation edit; S bounded helper/guard; M several adapters; L multiple runtime/domain owners; XL semantic/data-model or broad compatibility change; Unknown insufficient scope. One coarse estimate per stated scope, not hours, prices or an additive schedule. |
| Integration risk | LOW bounded authority-preserving surface; MEDIUM several established seams; HIGH world/item/clock/behavior/persistence or major visual exposure; Unknown insufficient evidence. A LOW risk UI still needs focused checking. |
| Evidence confidence | HIGH / MEDIUM / LOW for factual description and source classification. It does not mean benefit, readiness or successful integration. The detail field separately estimates integration confidence (HIGH/MEDIUM/LOW). |
| Open question tags | AP Author preference; TR Technical research; RV Runtime verification; IS Implementation-stage specification. These tags are not priorities. |

**Accounting and original IDs.** R2 C1–C8 and R3 C01–C16 retain their report-qualified IDs. R4 and R5 did not assign candidate IDs; “§5 row N” / “§6 row N” below are stable positional locators in the unchanged originals, not invented original IDs. All 52 inventory rows map below. Six extra rows arise from splitting R2 C3/C4/C8 and R3 C05/C09/C12. Four additional candidates are ARCH-11, ARCH-12, GAME-12 and UX-09 from explicit limitations/opportunities outside those inventory tables. R4 row 13's UI is UX-03; its much larger hypothetical progression replacement remains U02 because no agreed live model/benefit crosswalk justifies a separate migration entry.

| Original inventory | Canonical mapping |
| --- | --- |
| R2 | C1→[ARCH-01](#arch-01); C2→[ARCH-02](#arch-02); C3→[ARCH-03](#arch-03)/[ARCH-13](#arch-13); C4→[ARCH-04](#arch-04)/[ARCH-05](#arch-05); C5→[ARCH-06](#arch-06); C6→[ARCH-07](#arch-07); C7→[ARCH-08](#arch-08); C8→[ARCH-09](#arch-09)/[ARCH-10](#arch-10) |
| R3 | C01→[WORLD-01](#world-01); C02→[WORLD-02](#world-02); C03→[WORLD-03](#world-03); C04→[WORLD-04](#world-04); C05→[WORLD-05](#world-05)/[WORLD-06](#world-06); C06→[VIS-01](#vis-01); C07→[VIS-02](#vis-02); C08→[VIS-03](#vis-03); C09→[VIS-04](#vis-04)/[VIS-05](#vis-05); C10→[VIS-06](#vis-06); C11→[VIS-07](#vis-07); C12→[VIS-08](#vis-08)/[VIS-09](#vis-09); C13→[VIS-10](#vis-10); C14→[VIS-11](#vis-11); C15→[VIS-12](#vis-12); C16→[VIS-13](#vis-13) |
| R4 §5 rows | 1→[GAME-01](#game-01); 2→[UX-01](#ux-01); 3→[UX-02](#ux-02); 4→[GAME-02](#game-02); 5→[GAME-03](#game-03); 6→[GAME-04](#game-04); 7→[GAME-05](#game-05); 8→[GAME-06](#game-06); 9→[GAME-07](#game-07); 10→[GAME-08](#game-08); 11→[GAME-09](#game-09); 12→[GAME-10](#game-10); 13→[UX-03](#ux-03) (+ U02); 14→[GAME-11](#game-11) |
| R5 §6 rows | 1→[CONTENT-01](#content-01); 2→[CONTENT-02](#content-02); 3→[CONTENT-03](#content-03); 4→[CONTENT-04](#content-04); 5→[CONTENT-05](#content-05); 6→[CONTENT-06](#content-06); 7→[CONTENT-07](#content-07); 8→[CONTENT-08](#content-08); 9→[UX-04](#ux-04); 10→[UX-05](#ux-05); 11→[CONTENT-09](#content-09); 12→[UX-06](#ux-06); 13→[UX-07](#ux-07); 14→[UX-08](#ux-08) |

**Duplicate consolidation ledger (8 secondary mentions; 0 whole inventory rows removed).** These count explicitly identified repeated opportunity statements below, not every prose mention or two distinct improvements sharing a boundary. Split records above are not counted as duplicates.

| Repeated opportunity | Sources reconciled | Single canonical home |
| --- | --- | --- |
| A* allocation/open-list optimization | R2 C1 and R2 §6.4 performance row | [ARCH-01](#arch-01) |
| Vegetation preparation slicing | R2 C8 and R3 §3 implemented-optimization discussion | [ARCH-09](#arch-09) |
| Cache working-set sizing | R2 C8 and R2 §6.4 cache row | [ARCH-10](#arch-10) |
| Cross-owner conservation checks | R2 C7 and R4 §7 material/NPC conservation checks | [ARCH-08](#arch-08) |
| Tree representation reuse | R3 C09 and R2 §4 tree/impostor prior-art paragraph | [VIS-04](#vis-04) |
| Item presentation through existing facade | R4 §5 row 2 and R6 §6 item-UI reconciliation | [UX-01](#ux-01) |
| Bounded decoded audio | R5 §6 row 8 and R5 §4 audio-budget opportunity | [CONTENT-08](#content-08) |
| Map-note/layout reuse | R5 §6 rows 9/10 and R6 §8 map-technique handoff | [UX-04](#ux-04) / [UX-05](#ux-05) (distinct note and picking boundaries) |

R6 F01 is incorporated in GAME-07: connected session-level V3 trade, no durable purse/merchant stock and a fresh-command validation concern. R6 F02 is incorporated in every detail record: source implementation, activation, tests/historical execution and author acceptance remain independent. R6's determinism, selective continuity, production preflight, crafting subloops, authored-versus-playable quests, visual acceptance, non-comparable measurements and duplicate asset qualifications apply throughout.

## 3. Master candidate matrix

Each ID links to its sole detail record. Tables are split by owner for scanning; they form one inventory. Dependencies here name required V1 boundaries; candidate-to-candidate relations and their strength are in §6. The confidence column concerns evidence only.

### Architecture & simulation

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [ARCH-01](#arch-01) | ARCH | Reusable A* heap and scratch | TECHNIQUE | combined | Bounded local A*, maps and linear open-list scan | Less search allocation and open-list work | Adapt storage behind findPath; retain cost-aware LOS/smoothing | M | MEDIUM | HIGH | NavigationQuery; movement adapters | [R2 C1](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-02](#arch-02) | ARCH | Navigation outcomes and admission quotas | FOUNDATION | V3 | Local route failure and recovery already exist | Avoid synchronized requests and false unreachable retries | Adapt readiness states, cancellation and fair quotas | L | HIGH | HIGH | Intent/revision; clocks; chunk readiness | [R2 C2](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-03](#arch-03) | ARCH | Dependency boundary guard | FOUNDATION | combined | Pure seams coexist with Three.js-aware agents | Prevent new coupling and improve testability | Guard established pure areas with explicit exceptions | S | LOW | HIGH | Existing import seams; optional ARCH-13 | [R2 C3 (guard)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-04](#arch-04) | ARCH | Serialized and revision-guarded Save writes | FOUNDATION | V3 | Validated v56 slots; separate read/write transactions | Stronger protection from stale/concurrent publication | Add queue/revision checks at V1 storage owner | L | HIGH | HIGH | saveDb; snapshot readiness; cross-tab policy | [R2 C4 (writes)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-05](#arch-05) | ARCH | Staged restore and failure cleanup | FOUNDATION | combined | Stable WorldBundle; stale/failed/published gate | Reduce late publication and partial-construction resource loss | Adapt staged validation/cleanup within existing rebuild owner | L | HIGH | HIGH | WorldBundle; async boot; domain reconstruction | [R2 C4 (restore); R1 §6.3; R2 E27](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-06](#arch-06) | ARCH | Scoped saved RNG and stable ordering | FOUNDATION | combined | Seeded geography; runtime randomness and frame clamp | Repeatable local diagnosis/continuation | Introduce cursor ownership at selected decision boundaries | L | HIGH | HIGH | Clock units; Save; draw order; stream/skip | [R2 C5](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-07](#arch-07) | ARCH | Derived shared spatial ID index | TECHNIQUE | combined | Reusable fauna buckets and local settlement queries | Potentially reduce cross-actor query fan-out | Adapt an index over existing owners only where measured | M | MEDIUM | HIGH | Move/remove/restore hooks; layers; candidate order | [R2 C6](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-08](#arch-08) | ARCH | Conservation and validity diagnostics | FOUNDATION | combined | Production/source ledger tests and perf tools exist | Expose cross-owner loss, duplication and invalid captures | Add optional scenario oracles around committed events | M | LOW | HIGH | Source/sink taxonomy; qualified identity; logical time | [R2 C7](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-09](#arch-09) | ARCH | Bounded cold preparation | TECHNIQUE | combined | Terrain workers, finalization quotas and stale guards | Reduce remaining streaming/search preparation spikes | Slice measured unsliced work in existing pipeline | L | HIGH | HIGH | Mutation epochs; identical query output; worker owners | [R2 C8 (preparation); R3 §3 performance](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-10](#arch-10) | ARCH | Measured cache working sets | TECHNIQUE | combined | Bounded mesh LRU and disposable worldgen caches | Avoid regeneration churn at a justified memory budget | Use access traces to size existing caches | M | MEDIUM | HIGH | Cache namespaces; retained bytes; teardown | [R2 C8 (cache)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |
| [ARCH-11](#arch-11) | ARCH | Interrupted work-carry continuity repair | FOUNDATION | V1 | Durable personal inventory/cargo; selected offscreen travel | Close documented temporary-work loss boundary | Reconcile affected claim/carry/handoff at current owners | L | HIGH | HIGH | NpcState; logistics; exclusive offscreen executor; Save | [R1 §6.1; R2 §3/§7; R4 §6](./2026-10-25--001--v1-baseline.md#3-system-inventory) |
| [ARCH-12](#arch-12) | ARCH | Qualified mounted-livestock reference | FOUNDATION | V1 | Travel uses qualified refs; mountedAnimalId is bare | Avoid ambiguous restored mount identity | Align the mounted reference with existing livestock identity | M | MEDIUM | HIGH | PersistentLivestockRef; Save migration; mount restore | [R1 §6.1; R2 E26](./2026-10-25--001--v1-baseline.md#3-system-inventory) |
| [ARCH-13](#arch-13) | ARCH | Scoped pose/state projection seam | FOUNDATION | combined | Registries exist; some live spatial truth uses mesh transforms | Permit headless checks and safer independent presentation | Extract only a chosen pose seam behind V1 adapters | L | HIGH | HIGH | Movement authority; proximity; WorldBundle; ARCH-03 optional | [R2 C3 (extraction); R2 §2.2/§7](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates) |

### World & geography

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [WORLD-01](#world-01) | WORLD | Local ridge softening and relief | TECHNIQUE | V3 | Regional mountain hierarchy and shared terrain queries | Potentially improve massif/valley readability | Adapt shaping within V1 generator | M | MEDIUM | HIGH | World identity policy; ground/water/road/cave queries | [R3 C01](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [WORLD-02](#world-02) | WORLD | Mountain passes and barrier composition | FEATURE | V3 | Distributed V1 massifs and settlement geography | More distinctive passes and exploration views | Evaluate bounded composition without copying finite-world arc | L | HIGH | MEDIUM | Author landscape/scale policy; placement and Save | [R3 C02](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [WORLD-03](#world-03) | WORLD | Distant terrain silhouettes | TECHNIQUE | V3 | Streamed V1 detailed horizon | Longer coherent views at bounded detail | Project V1 geometry through a distant representation | L | HIGH | MEDIUM | Near/far sampling; occlusion; GPU budget | [R3 C03](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [WORLD-04](#world-04) | WORLD | Asymmetric riverbank profiles | TECHNIQUE | V2 | Canonical D8 channels, width, bridge/ford queries | More natural inner beaches and outer cut banks | Adapt curvature classification to canonical V1 segments | L | HIGH | HIGH | Flow convention; canonical shore; crossings; Save | [R3 C04](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [WORLD-05](#world-05) | WORLD | Headwater channel taper | TECHNIQUE | V3 | V1 river channel width/depth contracts | Smoother stream-head transitions | Adapt taper only within V1 carve rules | M | HIGH | MEDIUM | Canonical water/bed; ford projection; Save | [R3 C05 (geometry)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [WORLD-06](#world-06) | WORLD | River query spatial buckets | TECHNIQUE | V3 | Recently unified V1 shore query already exists | Potentially reduce measured segment-query cost | Adapt indexing only if V1 profile warrants it | M | MEDIUM | MEDIUM | Canonical query parity; invalidation; access trace | [R3 C05 (index); R2 §6.4](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |

### Graphics & visual assets

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [VIS-01](#vis-01) | VIS | Flat-water reflection relevance | TECHNIQUE | V2 | One V1 mirror with cadence/content limits | Avoid some irrelevant mirror work | Adapt relevance predicate at current mirror owner | M | MEDIUM | HIGH | Flat-water classification; first-visible response | [R3 C06](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-02](#vis-02) | VIS | Directional flat-water waves | FEATURE | V3 | V1 analytic normals, mirror and day/night palette | Coherent gust/storm response on lake/ocean | Feed wind into existing flat-water shader | M | MEDIUM | HIGH | Wind adapter (VIS-03 optional); mirror/palette | [R3 C07](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-03](#vis-03) | VIS | Shared directional wind field | TECHNIQUE | V3 | Grass amplitude and separate foliage clocks | Coherent grass/reed/flower/water gust phase | Adapt phase and direction using V1 time/weather | M | MEDIUM | HIGH | Weather authority; shader hooks; bounds/units | [R3 C08](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-04](#vis-04) | VIS | Tree LOD and impostor representations | TECHNIQUE | combined | Species-rich region batches and density LOD | Retain placements with lower-cost distant representations | Build representations of selected V1 tree family | L | HIGH | HIGH | Atlas/UV/normals; species/stages; transitions | [R3 C09 (representation)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-05](#vis-05) | VIS | Tight-cut leaf-card assets | TECHNIQUE | combined | V1 tree art and existing mesh batches | Reduce transparent overdraw on eligible LOD leaves | Evaluate leaf silhouette cutting in existing asset pipeline | M | MEDIUM | HIGH | Chosen tree source/recipe; alpha/shadow policy | [R3 C09 (leaf cards); R3 §3 performance](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-06](#vis-06) | VIS | Instanced tree motion and depth parity | FEATURE | V3 | V1 instanced sway bypassed after mobile flicker | Visible coherent branch/leaf motion | Adapt weights/depth shader after source defects/gates understood | L | HIGH | HIGH | Wind input; model weights/bounds; LOD/depth | [R3 C10](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-07](#vis-07) | VIS | Snow patch thresholds and grass burial | FEATURE | V3 | V1 snow/wetness/melt and ground blend | Spatial accumulation appearance and grass frost/burial | Use V1 snow amount with adapted presentation field | M | MEDIUM | HIGH | Weather owner; wet/puddle order; near/far materials | [R3 C11](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-08](#vis-08) | VIS | Shadow texel stabilization and edge fade | TECHNIQUE | V3 | V1 1024 default and pull-based refresh budget | Potentially reduce visible shadow movement | Evaluate light-space snap/fade under V1 frustum | M | MEDIUM | HIGH | Existing shadowBudget; animated casters; camera/sun | [R3 C12 (appearance)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-09](#vis-09) | VIS | Shadow-pass diagnostics | FOUNDATION | V3 | V1 perf census and shadow scheduling exist | Attribute shadow cost before changing quality | Adapt asynchronous pass timing and refresh reasons | S | LOW | HIGH | Valid GPU timers; existing perf tools; ARCH-08 optional | [R3 C12 (measurement)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-10](#vis-10) | VIS | Selected NPC face/outfit/equipment assets | CONTENT | combined | V1 UBC characters, accessories and animation | Potentially improve chosen cast variety | Evaluate individual families under V1 rig/material policy | M | HIGH | MEDIUM | 65-joint/bind/clip compatibility; attachments; provenance | [R3 C13; R4 equipment presentation](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-11](#vis-11) | VIS | Distinct animal model candidates | CONTENT | combined | Shared fauna behavior and existing animal models | Potential improvement for a selected species | Compare exact asset/clip under V1 semantic resolver | M | MEDIUM | MEDIUM | Species identity; scale/clip/rig; provenance | [R3 C14](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-12](#vis-12) | VIS | Selected props and material-preserving baking | CONTENT | V3 | V1 medieval houses/props and related source packs | Potential variety or fewer submissions per family | Select well/roof/fence/yard assets; preserve UV/material maps | M | MEDIUM | MEDIUM | Footprints; source recipes/credits; collision | [R3 C15](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |
| [VIS-13](#vis-13) | VIS | Bounded environment-light pilot | TECHNIQUE | V3 | V1 Standard materials, grade and sun/hemi light | Potentially enrich existing material response | Evaluate quantized PMREM without changing V1 grade | M | MEDIUM | HIGH | Target disposal; interior/cave suppression; GPU budget | [R3 C16](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory) |

### Gameplay & item correctness

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [GAME-01](#game-01) | GAME | Typed item metadata and validation | FOUNDATION | V3 | Capability-rich V1 catalog and IDs | Consistent descriptions, provenance and exhaustive validation | Curate fields against V1 definitions; retain capabilities | M | MEDIUM | HIGH | Current ItemKinds; all consumers; availability | [R4 §5 row 1](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-02](#game-02) | GAME | Layered armor and typed resistance | FEATURE | combined | Six-slot V1 contract with real aggregate effects | Potentially deeper equipment choices | Evaluate slot/coverage/damage semantics explicitly | XL | HIGH | HIGH | NPC parity; combat; loot/supply; Save; VIS-10 optional | [R4 §5 row 4](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-03](#game-03) | GAME | General player recipe interface | FEATURE | combined | Cooking, construction, repair and artisans already work | Fill generic player recipe interaction gap | Adapt panel through V1 authoritative actions for selected recipes | L | HIGH | HIGH | Real input/output sources; station/busy owners | [R4 §5 row 5](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-04](#game-04) | GAME | Staged craft admission/completion | TECHNIQUE | V3 | V1 preflight recipes, BusyAction and production executor | Avoid partial debit/output on ordinary refusal | Apply staging principle within current owners | M | MEDIUM | HIGH | Inventory capacity; cancellation/retry; food inheritance | [R4 §5 row 6](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-05](#game-05) | GAME | Recipe requirements and quality outcomes | FEATURE | V2 | V1 cooking and artisan expertise/quality | Potential broader meaningful player manufacturing | Adapt selected tool/station/skill rules into V1 definitions | L | HIGH | HIGH | Sources/consumers; NPC expertise; player XP | [R4 §5 row 7](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-06](#game-06) | GAME | Weapon breakage and repair lifecycle | FEATURE | combined | V1 melee wear/edge/sharpening; no durability repair/breakage | Maintenance decisions and completed weapon lifecycle | Connect wear thresholds, repair service/materials and NPC rules | L | HIGH | HIGH | Instance identity; combat; smith stock; Save | [R4 §5 row 8](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-07](#game-07) | GAME | Conserved merchant purse and basket validation | FOUNDATION | combined | Finite stock; ordinary NPC barter conserves coins, catalog path differs | More coherent cash/stock ownership and fresh transactions | Extend owner-backed V1 trade; validate intent at commit | L | HIGH | HIGH | Physical coins; merchant/household owners; durable Save | [R4 §5 row 9; R6 F01](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-08](#game-08) | GAME | Deterministic ammunition selection | TECHNIQUE | V3 | V1 ranged ammo debit/release/recovery | Explicit choice/refusal across variants | Map query to V1 lifecycle and exact instance semantics | M | MEDIUM | HIGH | Ammo IDs; release timing; NPC shots | [R4 §5 row 10](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-09](#game-09) | GAME | Skill-based ranged aim assistance | TECHNIQUE | V2 | Spread, soft lock, yaw and swept projectiles | Potentially improve ranged accessibility | Adapt assistance to V1 skills/collision if desired | L | HIGH | HIGH | Target eligibility; archery scale; obstruction | [R4 §5 row 11](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-10](#game-10) | GAME | Timed guard/parry and directional dodge | FEATURE | V2 | V1 directional chance defense and lock | Potential additional combat agency | Evaluate actions with input/stamina/commitment and actor parity | XL | HIGH | HIGH | Defense skill; fauna damage; NPC AI; input | [R4 §5 row 12](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-11](#game-11) | GAME | Bounded food expiry representation | TECHNIQUE | V3 | Species/storage-rate/effective-age V1 batches | Possible bound on row growth if V1 problem is measured | Evaluate deadline idea only with preserved semantics | XL | HIGH | HIGH | Batch/storage provenance; processing; Save; GAME-12 | [R4 §5 row 14](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [GAME-12](#game-12) | GAME | Food transfer and actor safety consistency | FOUNDATION | V1 | Rich batch transfer/player safety; purchase and NPC helper gaps | Avoid food rejuvenation and inconsistent spoilage handling | Use existing batch/time helpers at affected owners | L | HIGH | HIGH | Trade/refund; NPC provisions; production; Save | [R4 §6 food/trading; R6 §4](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |

### Content, knowledge & audio

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [CONTENT-01](#content-01) | CONTENT | Night Torches story | CONTENT | V2 | V1 guard light duty and local cast/quests | Observation, family concern and humane alternatives | Translate selected beats into V1 QuestDef with real actors | L | HIGH | HIGH | QuestManager; family/guard/posts; time; UX-06 shared | [R5 §6 row 1 (G03)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-02](#content-02) | CONTENT | Well and Rumor story | CONTENT | V2 | V1 well, health, reputation and local problems | Evidence versus blame with social consequences | Bind story facts to real health/news/economic owners | L | HIGH | HIGH | Actual illness/evidence; QuestManager; reputation | [R5 §6 row 2 (G08)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-03](#content-03) | CONTENT | Old river-map investigation | CONTENT | V2 | V1 treasure maps, research and finite caches | Landscape reading and property choices | Bind clues/rewards to actual V1 sites and identities | L | HIGH | HIGH | Geography/site admission; unique loot; QuestManager | [R5 §6 row 3 (Q05)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-04](#content-04) | CONTENT | Bell/chapel investigation beats | CONTENT | V2 | V1 ruins, caves and finite treasure | Memorable recovery and nonviolent alternatives | Evaluate authored beats separately from missing physical services | XL | HIGH | HIGH | Real site/animal; heavy-item custody; consequences | [R5 §6 row 4 (Q11)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-05](#content-05) | CONTENT | Ordinary speech and role text | CONTENT | V3 | V1 templates, contextual dialogue and quest overrides | More local variety and character voice | Select guarded phrases using V1 cast/language/suppliers | M | MEDIUM | HIGH | Context truth; precedence; speaker identity | [R5 §6 row 5](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-06](#content-06) | CONTENT | Exact transcript/voice clip contract | FOUNDATION | V3 | Semantic V1 intents and spatial voice playback | Avoid unrelated recorded text and unstable casting | Validate exact text/profile around current playback owner | M | MEDIUM | HIGH | Line IDs; QC; fallback; async cancellation | [R5 §6 row 6](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-07](#content-07) | CONTENT | Selected additional recorded barks | CONTENT | V3 | 109 V1 direct voice MP3s with live bark playback | Potential missing role/timbre coverage | Compare selected new files/transcripts/provenance | M | MEDIUM | MEDIUM | Speaker/trigger truth; rights; bark limiter | [R5 §6 row 7](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-08](#content-08) | CONTENT | Decoded audio budgets and eviction | TECHNIQUE | combined | V1 shared successful-buffer cache across instances | Bound long-session decoded memory | Adapt active-source-safe LRU/idle/concurrency policy | M | MEDIUM | HIGH | Current audio context; loops; disposal; async fetch | [R5 §6 row 8](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [CONTENT-09](#content-09) | CONTENT | Approximate geographic leads | FEATURE | combined | V1 confidence, location research and distinct social news | Uncertain clues supporting discovery | Adapt offset/search-area logic into existing knowledge flow | M | MEDIUM | HIGH | Location knowledge; encounter resolution; Save | [R5 §6 row 11](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |

### Player interface & travel

| ID | Domain | Candidate | Type | Source | Existing V1 counterpart | Potential benefit | Adaptation concept | Effort | Risk | Evidence confidence | Dependencies | Original references |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [UX-01](#ux-01) | UX | Item cards, tags and condition meters | UI | V3 | V1 grouped inventory/details/actions already exist | Clearer quality/condition information | Derive V1 view data; preserve app command callbacks | M | LOW | HIGH | V1 facade; units/semantics; input ownership | [R4 §5 row 2](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [UX-02](#ux-02) | UX | Equipment what-if comparison | UI | V3 | V1 worn modifiers and ownership checks | Understand tradeoffs before equipping | Compute previews through V1 modifier resolver | M | MEDIUM | HIGH | Six-slot selection; held choices; actual combat math | [R4 §5 row 3](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [UX-03](#ux-03) | UX | Character descriptions and effective-stat layout | UI | V3 | V1 SPEA, eight XP skills and effective modifiers | Clearer actual earned capabilities and modifier provenance | Adapt descriptions/groups to V1 authority only | M | LOW | HIGH | V1 XP/effective stats; truthful producer/consumer labels | [R4 §5 row 13 (UI)](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory) |
| [UX-04](#ux-04) | UX | Personal map annotations | FEATURE | V3 | Known-location targets; no confirmed free-position editor | Remember camps, hazards and personal clues | Add bounded notes to V1 map and Save | M | MEDIUM | HIGH | Coordinates/catalog/knowledge; additive Save migration | [R5 §6 row 9](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [UX-05](#ux-05) | UX | Map overlap picking and label layout | UI | V3 | V1 picking/labels and selected targets | Select dense markers clearly | Feed pure layout/hit-test with V1 visible/estimated inputs | M | LOW | HIGH | Current map projection; zoom; touch/cancel | [R5 §6 row 10](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [UX-06](#ux-06) | UX | Bounded conversation engagement | FOUNDATION | V3 | V1 menu engagement, idle release and time patches | Reject stale choices and release holds reliably | Adapt leases/revalidation at V1 callbacks and clock boundary | L | HIGH | HIGH | NPC urgency; world revisions; movement/time; trade | [R5 §6 row 12](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [UX-07](#ux-07) | UX | Modal and input ownership contracts | FOUNDATION | V3 | V1 overlays/Escape and keyboard/touch paths | Avoid held-key leaks and movement while editing | Adapt release/focus/priority rules in current facade | M | MEDIUM | HIGH | Hotkeys; nested modal stack; blur/hide | [R5 §6 row 13](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [UX-08](#ux-08) | UX | Safe automatic physical travel | FEATURE | V2 | Physical walk/ride and targets; V1 autopilot planned | Reduce repetitive steering if desired | Adapt watchdog/cancellation through V1 movement and clocks | XL | HIGH | HIGH | Roads/ground collision; mounts; needs/danger; time policy | [R5 §6 row 14](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |
| [UX-09](#ux-09) | UX | Road and river map overlays | UI | combined | V1 terrain/fog/knowledge map; no separate polyline layers in inspected drawers | Read crossings, routes and landscape more clearly | Draw V1 authoritative geometry via current projection | M | MEDIUM | HIGH | World extents; simplification/cache; discovery policy | [R5 §5 map representation; R3 §3](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory) |

## 4. Candidate detail register

Records inherit §2's evidence boundary. SI/TP refer to prior source research and existing tests; no candidate has newly executed game verification or V1 author acceptance. Each record has a direct pinned source locator and a report-section link. For combined sources, the linked report evidence index supplies additional donor and V1 files.

### Architecture & simulation

<a id="arch-01"></a>

#### ARCH-01 — Reusable A* heap and scratch

- **Problem / opportunity:** Each V1 search allocates maps/keys/nodes and scans an open array.
- **V1 baseline / preservation:** Bounded local A*, maps and linear open-list scan. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/agents/nav/astar.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/astar.ts); [R2 C1](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Less search allocation and open-list work; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt storage behind findPath; retain cost-aware LOS/smoothing.
- **Dependencies / compatibility:** NavigationQuery; movement adapters.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Performance and route choice; no full raster prerequisite.
- **Maturity:** Implemented and active. **Activation:** V3 live finder uses scratch/heap. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** TR: Is V1 cost search storage or terrain sampling?

<a id="arch-02"></a>

#### ARCH-02 — Navigation outcomes and admission quotas

- **Problem / opportunity:** Concurrent cold requests can burst, while readiness and route failure need distinct retry semantics.
- **V1 baseline / preservation:** Local route failure and recovery already exist. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/agents/nav/pathQueue.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/pathQueue.ts); [R2 C2](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Avoid synchronized requests and false unreachable retries; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt readiness states, cancellation and fair quotas.
- **Dependencies / compatibility:** Intent/revision; clocks; chunk readiness.
- **Effort / risk:** **L / HIGH**, for the stated scope. Gameplay waits, starvation and collision; queue alone is no hard CPU bound.
- **Maturity:** Partially integrated. **Activation:** Queue is live; sliced finder is not universal in live searches. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** TR/RV: What is longest indivisible search/preparation call?

<a id="arch-03"></a>

#### ARCH-03 — Dependency boundary guard

- **Problem / opportunity:** Mixed presentation dependencies make accidental new coupling difficult to detect mechanically.
- **V1 baseline / preservation:** Pure seams coexist with Three.js-aware agents. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `scripts/check-layers.mjs`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/scripts/check-layers.mjs); [R2 C3 (guard)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Prevent new coupling and improve testability; benefit in adapted V1 remains unverified.
- **Integration concept:** Guard established pure areas with explicit exceptions.
- **Dependencies / compatibility:** Existing import seams; optional [ARCH-13](#arch-13).
- **Effort / risk:** **S / LOW**, for the stated scope. Development correctness; no claimed FPS gain or blanket extraction.
- **Maturity:** Implemented and active. **Activation:** V2/V3 enforce import boundaries. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** IS: Which current V1 seams and exceptions are protected?

<a id="arch-04"></a>

#### ARCH-04 — Serialized and revision-guarded Save writes

- **Problem / opportunity:** Separate existing-row reads and later writes warrant explicit stale-writer/concurrency protection.
- **V1 baseline / preservation:** Validated v56 slots; separate read/write transactions. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/session/idbSaveStorage.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/idbSaveStorage.ts); [R2 C4 (writes)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Stronger protection from stale/concurrent publication; benefit in adapted V1 remains unverified.
- **Integration concept:** Add queue/revision checks at V1 storage owner.
- **Dependencies / compatibility:** saveDb; snapshot readiness; cross-tab policy.
- **Effort / risk:** **L / HIGH**, for the stated scope. Persistence; keep v56 migrations and damaged-slot refusal.
- **Maturity:** Implemented and active. **Activation:** Atomic storage and Save service are connected. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** TR/RV: Are conflicting V1 callers reachable? AP: What cross-tab guarantee?

<a id="arch-05"></a>

#### ARCH-05 — Staged restore and failure cleanup

- **Problem / opportunity:** Final stale guards do not prove cleanup or recoverability after partial construction/background failure.
- **V1 baseline / preservation:** Stable WorldBundle; stale/failed/published gate. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/save/restoreSave.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/restoreSave.ts); [R2 C4 (restore); R1 §6.3; R2 E27](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Reduce late publication and partial-construction resource loss; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt staged validation/cleanup within existing rebuild owner.
- **Dependencies / compatibility:** WorldBundle; async boot; domain reconstruction.
- **Effort / risk:** **L / HIGH**, for the stated scope. Persistence and resource lifetime; staging is not arbitrary world rollback.
- **Maturity:** Implemented and active. **Activation:** V3 staged restore is connected; V1 exceptional cleanup remains an audited concern. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Which throwing/background paths leak or leave a blocked world?

<a id="arch-06"></a>

#### ARCH-06 — Scoped saved RNG and stable ordering

- **Problem / opportunity:** Runtime randomness prevents reliable repeated local behavior diagnosis; generation determinism does not solve this.
- **V1 baseline / preservation:** Seeded geography; runtime randomness and frame clamp. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/sim.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/sim.ts); [R2 C5](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Repeatable local diagnosis/continuation; benefit in adapted V1 remains unverified.
- **Integration concept:** Introduce cursor ownership at selected decision boundaries.
- **Dependencies / compatibility:** Clock units; Save; draw order; stream/skip.
- **Effort / risk:** **L / HIGH**, for the stated scope. Behavior and persistence; RNG alone cannot repair time partitioning.
- **Maturity:** Implemented and active. **Activation:** V2 saves RNG; V3 resident cursor exists; no universal replay donor. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Required determinism? RV: Split-step and reload tolerance?

<a id="arch-07"></a>

#### ARCH-07 — Derived shared spatial ID index

- **Problem / opportunity:** Cross-NPC/fauna queries may outgrow current local scans, but an incremental index must justify its maintenance cost.
- **V1 baseline / preservation:** Reusable fauna buckets and local settlement queries. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/agents/spatialGrid.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/spatialGrid.ts); [R2 C6](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Potentially reduce cross-actor query fan-out; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt an index over existing owners only where measured.
- **Dependencies / compatibility:** Move/remove/restore hooks; layers; candidate order.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Same-pass radius equivalence and livestock identity; not universally O(1).
- **Maturity:** Implemented and active. **Activation:** Registry-maintained V3 grid active; generic scheduler is distinct. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** TR/RV: Does incremental maintenance beat V1 pass rebuild?

<a id="arch-08"></a>

#### ARCH-08 — Conservation and validity diagnostics

- **Problem / opportunity:** Local tests do not establish cross-owner conservation through stream, Save and retry transitions.
- **V1 baseline / preservation:** Production/source ledger tests and perf tools exist. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/conservation.test.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/conservation.test.ts); [R2 C7](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Expose cross-owner loss, duplication and invalid captures; benefit in adapted V1 remains unverified.
- **Integration concept:** Add optional scenario oracles around committed events.
- **Dependencies / compatibility:** Source/sink taxonomy; qualified identity; logical time.
- **Effort / risk:** **M / LOW**, for the stated scope. Production preflight is not arbitrary late-failure rollback; no speedup claimed.
- **Maturity:** Implemented and active. **Activation:** V2 tests/optional ledger; V3 validity diagnostics are separate scoped examples. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** IS/RV: Which committed flows and instrumentation overhead?

<a id="arch-09"></a>

#### ARCH-09 — Bounded cold preparation

- **Problem / opportunity:** Existing worker/finalization budgets leave possible synchronous cold terrain/river/preparation tails.
- **V1 baseline / preservation:** Terrain workers, finalization quotas and stale guards. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/render/vegetation.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/vegetation.ts); [R2 C8 (preparation); R3 §3 performance](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Reduce remaining streaming/search preparation spikes; benefit in adapted V1 remains unverified.
- **Integration concept:** Slice measured unsliced work in existing pipeline.
- **Dependencies / compatibility:** Mutation epochs; identical query output; worker owners.
- **Effort / risk:** **L / HIGH**, for the stated scope. Performance and late appearance; neither a second worker pipeline nor tree replacement.
- **Maturity:** Implemented and active. **Activation:** V2 time-sliced vegetation; V3 staged navigation preparation. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Which V1 atomic unit causes a current tail?

<a id="arch-10"></a>

#### ARCH-10 — Measured cache working sets

- **Problem / opportunity:** A bounded cache may still churn when capacity and the real working set disagree.
- **V1 baseline / preservation:** Bounded mesh LRU and disposable worldgen caches. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/agents/nav/raster.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/raster.ts); [R2 C8 (cache)](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Avoid regeneration churn at a justified memory budget; benefit in adapted V1 remains unverified.
- **Integration concept:** Use access traces to size existing caches.
- **Dependencies / compatibility:** Cache namespaces; retained bytes; teardown.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Historical V3 replay gain is not a V1 game gain; do not copy 256 tiles blindly.
- **Maturity:** Implemented and active. **Activation:** V3 raster capacity correction active. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: V1 cold/warm churn and byte retention?

<a id="arch-11"></a>

#### ARCH-11 — Interrupted work-carry continuity repair

- **Problem / opportunity:** Some extracted temporary NPC work goods can be lost when their execution episode is interrupted.
- **V1 baseline / preservation:** Durable personal inventory/cargo; selected offscreen travel. Preserve the relevant contracts in §5.
- **Source evidence:** [V1 `src/settlement/npcState.ts`](https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/settlement/npcState.ts); [R1 §6.1; R2 §3/§7; R4 §6](./2026-10-25--001--v1-baseline.md#3-system-inventory).
- **Potential value:** Close documented temporary-work loss boundary; benefit in adapted V1 remains unverified.
- **Integration concept:** Reconcile affected claim/carry/handoff at current owners.
- **Dependencies / compatibility:** NpcState; logistics; exclusive offscreen executor; Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. Economy/persistence; does not promise universal unloaded simulation.
- **Maturity:** Partially integrated. **Activation:** Durable commitments active; temporary work execution not fully retained. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Which commitments must survive? RV: Exact loss/handoff scenario?

<a id="arch-12"></a>

#### ARCH-12 — Qualified mounted-livestock reference

- **Problem / opportunity:** A bare mounted animal ID can collide across settlements despite existing qualified livestock identity.
- **V1 baseline / preservation:** Travel uses qualified refs; mountedAnimalId is bare. Preserve the relevant contracts in §5.
- **Source evidence:** [V1 `src/persistence/saveData.ts`](https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/persistence/saveData.ts); [R1 §6.1; R2 E26](./2026-10-25--001--v1-baseline.md#3-system-inventory).
- **Potential value:** Avoid ambiguous restored mount identity; benefit in adapted V1 remains unverified.
- **Integration concept:** Align the mounted reference with existing livestock identity.
- **Dependencies / compatibility:** PersistentLivestockRef; Save migration; mount restore.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Persistence; do not reassign an ambiguous old mount silently.
- **Maturity:** Partially integrated. **Activation:** Qualified identity exists; mounted Save field remains unqualified. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Reproduce two settlements sharing a bare ID; IS: Legacy resolution policy?

<a id="arch-13"></a>

#### ARCH-13 — Scoped pose/state projection seam

- **Problem / opportunity:** Some authoritative live spatial state is read through Three.js transforms, complicating presentation-independent checks.
- **V1 baseline / preservation:** Registries exist; some live spatial truth uses mesh transforms. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/agents/registry.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/registry.ts); [R2 C3 (extraction); R2 §2.2/§7](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates).
- **Potential value:** Permit headless checks and safer independent presentation; benefit in adapted V1 remains unverified.
- **Integration concept:** Extract only a chosen pose seam behind V1 adapters.
- **Dependencies / compatibility:** Movement authority; proximity; WorldBundle; [ARCH-03](#arch-03) optional.
- **Effort / risk:** **L / HIGH**, for the stated scope. Simulation/render compatibility; cleaner structure is not a performance result.
- **Maturity:** Implemented and active. **Activation:** V3 registry pose pattern active; no complete V1 conversion supplied. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** TR: Smallest seam that preserves movement/query truth?

### World & geography

<a id="world-01"></a>

#### WORLD-01 — Local ridge softening and relief

- **Problem / opportunity:** An optional local shaping technique may improve silhouettes without changing the whole world generator.
- **V1 baseline / preservation:** Regional mountain hierarchy and shared terrain queries. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/world/gen/heightfield.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/gen/heightfield.ts); [R3 C01](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potentially improve massif/valley readability; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt shaping within V1 generator.
- **Dependencies / compatibility:** World identity policy; ground/water/road/cave queries.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. High visual/world exposure; source numeric calibration is not transferable.
- **Maturity:** Implemented and active. **Activation:** Hybrid shaping active at source pin. **Verification:** SI; TP; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Preferred V1 silhouettes? RV: Matched profiles and saved-reference drift?

<a id="world-02"></a>

#### WORLD-02 — Mountain passes and barrier composition

- **Problem / opportunity:** Pass/barrier composition offers a distinct landscape choice beyond pointwise ridge smoothing.
- **V1 baseline / preservation:** Distributed V1 massifs and settlement geography. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/config/terrain.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/config/terrain.ts); [R3 C02](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** More distinctive passes and exploration views; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate bounded composition without copying finite-world arc.
- **Dependencies / compatibility:** Author landscape/scale policy; placement and Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. World identity and exploration density; independent of ridge softening.
- **Maturity:** Implemented and active. **Activation:** V3 finite-continent barrier/pass composition active. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration LOW.
- **Open questions:** AP: Local range shaping or changed geography/distances?

<a id="world-03"></a>

#### WORLD-03 — Distant terrain silhouettes

- **Problem / opportunity:** The detailed streamed horizon need not be the only representation of distant existing V1 terrain.
- **V1 baseline / preservation:** Streamed V1 detailed horizon. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/farTerrain.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/farTerrain.ts); [R3 C03](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Longer coherent views at bounded detail; benefit in adapted V1 remains unverified.
- **Integration concept:** Project V1 geometry through a distant representation.
- **Dependencies / compatibility:** Near/far sampling; occlusion; GPU budget.
- **Effort / risk:** **L / HIGH**, for the stated scope. Skyline/performance; V1 loaded radius is not whole-world size.
- **Maturity:** Implemented and active. **Activation:** V3 far terrain active in different world bounds. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration MEDIUM.
- **Open questions:** RV: Seams, cave mouths and travel cost? AP: Desired horizon?

<a id="world-04"></a>

#### WORLD-04 — Asymmetric riverbank profiles

- **Problem / opportunity:** Canonical channels could express different inner/outer bank character rather than uniform profiles.
- **V1 baseline / preservation:** Canonical D8 channels, width, bridge/ford queries. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/world/gen/banks.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/gen/banks.ts); [R3 C04](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** More natural inner beaches and outer cut banks; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt curvature classification to canonical V1 segments.
- **Dependencies / compatibility:** Flow convention; canonical shore; crossings; Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. Ground/water and visible banks; does not replace drainage or lakes.
- **Maturity:** Implemented and active. **Activation:** V2 bank classification connected. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Meanders, joins and accepted bank cross-sections?

<a id="world-05"></a>

#### WORLD-05 — Headwater channel taper

- **Problem / opportunity:** Headwater width transitions can be evaluated independently of drainage topology.
- **V1 baseline / preservation:** V1 river channel width/depth contracts. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/world/rivers/riverCarve.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/rivers/riverCarve.ts); [R3 C05 (geometry)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Smoother stream-head transitions; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt taper only within V1 carve rules.
- **Dependencies / compatibility:** Canonical water/bed; ford projection; Save.
- **Effort / risk:** **M / HIGH**, for the stated scope. Visual/world geometry; V3 raising differs from V1 lower-only semantics.
- **Maturity:** Implemented and active. **Activation:** V3 taper connected; bank look remains contested. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration MEDIUM.
- **Open questions:** RV: Does taper help real V1 heads without bank raising?

<a id="world-06"></a>

#### WORLD-06 — River query spatial buckets

- **Problem / opportunity:** Segment-query indexing may help a demonstrated hot path; the recent V1 query unification already addresses some duplication.
- **V1 baseline / preservation:** Recently unified V1 shore query already exists. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/world/rivers/riverCarve.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/rivers/riverCarve.ts); [R3 C05 (index); R2 §6.4](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potentially reduce measured segment-query cost; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt indexing only if V1 profile warrants it.
- **Dependencies / compatibility:** Canonical query parity; invalidation; access trace.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Performance; separate from taper, full hydrology and old trace suspicion.
- **Maturity:** Implemented and active. **Activation:** V3 bucketed channel index active. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration LOW.
- **Open questions:** RV: Current V1 bottleneck and exact query equivalence?

### Graphics & visual assets

<a id="vis-01"></a>

#### VIS-01 — Flat-water reflection relevance

- **Problem / opportunity:** Mirror work may be unnecessary when no qualifying flat water can contribute meaningfully.
- **V1 baseline / preservation:** One V1 mirror with cadence/content limits. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/render/waterReflection.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/waterReflection.ts); [R3 C06](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Avoid some irrelevant mirror work; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt relevance predicate at current mirror owner.
- **Dependencies / compatibility:** Flat-water classification; first-visible response.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Reflection appearance/performance; nearness is not visibility.
- **Maturity:** Implemented and active. **Activation:** V2 high-quality qualifying-plane selection active. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: No-water A/B and first water exposure?

<a id="vis-02"></a>

#### VIS-02 — Directional flat-water waves

- **Problem / opportunity:** Existing analytic flat-water motion lacks the evaluated shared directional gust-wave treatment.
- **V1 baseline / preservation:** V1 analytic normals, mirror and day/night palette. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/waterWaves.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/waterWaves.ts); [R3 C07](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Coherent gust/storm response on lake/ocean; benefit in adapted V1 remains unverified.
- **Integration concept:** Feed wind into existing flat-water shader.
- **Dependencies / compatibility:** Wind adapter ([VIS-03](#vis-03) optional); mirror/palette.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. High water appearance exposure; lake approval is not river acceptance.
- **Maturity:** Implemented and active. **Activation:** Flat-water wind default-on unless overridden; rivers separate. **Verification:** SI; HT; AA-historical; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP/RV: Calm/night/glint look under V1 lighting?

<a id="vis-03"></a>

#### VIS-03 — Shared directional wind field

- **Problem / opportunity:** Separate wind/amplitude clocks do not establish a coherent directional field across vegetation and water.
- **V1 baseline / preservation:** Grass amplitude and separate foliage clocks. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/wind/wind.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/wind/wind.ts); [R3 C08](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Coherent grass/reed/flower/water gust phase; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt phase and direction using V1 time/weather.
- **Dependencies / compatibility:** Weather authority; shader hooks; bounds/units.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. GPU/visual cost; tree activation remains a separate candidate.
- **Maturity:** Implemented and active. **Activation:** Shared field feeds V3 grass and flat water. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Storm strength and long-session phase stability?

<a id="vis-04"></a>

#### VIS-04 — Tree LOD and impostor representations

- **Problem / opportunity:** Lower-cost distant representations may retain canopy placements better than additional density thinning.
- **V1 baseline / preservation:** Species-rich region batches and density LOD. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/treeImpostors.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/treeImpostors.ts); [R3 C09 (representation)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Retain placements with lower-cost distant representations; benefit in adapted V1 remains unverified.
- **Integration concept:** Build representations of selected V1 tree family.
- **Dependencies / compatibility:** Atlas/UV/normals; species/stages; transitions.
- **Effort / risk:** **L / HIGH**, for the stated scope. High forest fidelity/performance exposure; preparation stays ARCH-09.
- **Maturity:** Implemented and active. **Activation:** Source bands/impostors active; author sign-off incomplete. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Matched forest, travel pops, alpha overdraw and color?

<a id="vis-05"></a>

#### VIS-05 — Tight-cut leaf-card assets

- **Problem / opportunity:** Transparent leaf-card pixels can dominate cost even when triangle counts appear low.
- **V1 baseline / preservation:** V1 tree art and existing mesh batches. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `scripts/assets/build-trees.mjs`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/scripts/assets/build-trees.mjs); [R3 C09 (leaf cards); R3 §3 performance](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Reduce transparent overdraw on eligible LOD leaves; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate leaf silhouette cutting in existing asset pipeline.
- **Dependencies / compatibility:** Chosen tree source/recipe; alpha/shadow policy.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Visual/performance; separable from complete impostor/band replacement.
- **Maturity:** Implemented and active. **Activation:** V2 revised cards active with scoped historical measurements. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: V1 GPU A/B at equal canopy; AP: Leaf/crown silhouette?

<a id="vis-06"></a>

#### VIS-06 — Instanced tree motion and depth parity

- **Problem / opportunity:** Instanced foliage motion is bypassed in V1 and the source replacement has unresolved cost/acceptance.
- **V1 baseline / preservation:** V1 instanced sway bypassed after mobile flicker. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/treeWind.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/treeWind.ts); [R3 C10](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Visible coherent branch/leaf motion; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt weights/depth shader after source defects/gates understood.
- **Dependencies / compatibility:** Wind input; model weights/bounds; LOD/depth.
- **Effort / risk:** **L / HIGH**, for the stated scope. High forest cost/look; upstream trim has no valid accepted PASS.
- **Maturity:** Implemented but disabled or gated. **Activation:** treeWind false desktop/phone; override only. **Verification:** SI; TP; HT-FAIL/inconclusive; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** RV/AP: Native GPU gate, mobile flicker and attached shadows?

<a id="vis-07"></a>

#### VIS-07 — Snow patch thresholds and grass burial

- **Problem / opportunity:** Existing ground snow does not provide the selected spatial patch and grass burial presentation.
- **V1 baseline / preservation:** V1 snow/wetness/melt and ground blend. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/snowField.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/snowField.ts); [R3 C11](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Spatial accumulation appearance and grass frost/burial; benefit in adapted V1 remains unverified.
- **Integration concept:** Use V1 snow amount with adapted presentation field.
- **Dependencies / compatibility:** Weather owner; wet/puddle order; near/far materials.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. High winter look exposure; override approval is not complete seasonal acceptance.
- **Maturity:** Partially integrated. **Activation:** Ground/grass implemented; crown/bush coverage not delivered. **Verification:** SI; TP; HT; AA-historical; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Running snow→melt, sleep/load and five-second presentation steps?

<a id="vis-08"></a>

#### VIS-08 — Shadow texel stabilization and edge fade

- **Problem / opportunity:** Light-space snapping/fade is a separable stability technique, not a reason to replace V1 cadence.
- **V1 baseline / preservation:** V1 1024 default and pull-based refresh budget. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/atmosphere/sunShadow.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/atmosphere/sunShadow.ts); [R3 C12 (appearance)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potentially reduce visible shadow movement; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate light-space snap/fade under V1 frustum.
- **Dependencies / compatibility:** Existing shadowBudget; animated casters; camera/sun.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. High near-scene exposure; static source flicker unresolved.
- **Maturity:** Implemented and active. **Activation:** Snap/fade active; V3 refresh every frame, budget opt-in. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Stationary fence, moving camera/sun and caster stability?

<a id="vis-09"></a>

#### VIS-09 — Shadow-pass diagnostics

- **Problem / opportunity:** Shadow cost and refresh reasons need scoped attribution before a quality/performance decision.
- **V1 baseline / preservation:** V1 perf census and shadow scheduling exist. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/atmosphere/sunShadow.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/atmosphere/sunShadow.ts); [R3 C12 (measurement)](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Attribute shadow cost before changing quality; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt asynchronous pass timing and refresh reasons.
- **Dependencies / compatibility:** Valid GPU timers; existing perf tools; [ARCH-08](#arch-08) optional.
- **Effort / risk:** **S / LOW**, for the stated scope. Performance evidence; not a new default cadence or demonstrated saving.
- **Maturity:** Implemented and active. **Activation:** Timing/diagnostic source exists; timer availability device-dependent. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** RV: Supported/disjoint timing and instrumentation overhead?

<a id="vis-10"></a>

#### VIS-10 — Selected NPC face/outfit/equipment assets

- **Problem / opportunity:** Selected faces/outfits could add variety, but a newer family can introduce rig seams and cost.
- **V1 baseline / preservation:** V1 UBC characters, accessories and animation. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/actors/characterKit.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/actors/characterKit.ts); [R3 C13; R4 equipment presentation](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potentially improve chosen cast variety; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate individual families under V1 rig/material policy.
- **Dependencies / compatibility:** 65-joint/bind/clip compatibility; attachments; provenance.
- **Effort / risk:** **M / HIGH**, for the stated scope. High identity/cost exposure; whole cast replacement is XL, not this per-family estimate.
- **Maturity:** Partially integrated. **Activation:** Families wired; Peasant defect unresolved, skirts acceptance incomplete. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration LOW.
- **Open questions:** RV/AP: Posed source versus assembled shoulder/attachment look?

<a id="vis-11"></a>

#### VIS-11 — Distinct animal model candidates

- **Problem / opportunity:** A selected distinct species asset may improve coverage; a catalog name/file does not establish better animation.
- **V1 baseline / preservation:** Shared fauna behavior and existing animal models. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `scripts/assets/build-extra-animals.mjs`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/scripts/assets/build-extra-animals.mjs); [R3 C14](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potential improvement for a selected species; benefit in adapted V1 remains unverified.
- **Integration concept:** Compare exact asset/clip under V1 semantic resolver.
- **Dependencies / compatibility:** Species identity; scale/clip/rig; provenance.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Close-animal appearance; all 15 V2/V3 animal blobs match, no double acquisition.
- **Maturity:** Unknown. **Activation:** Catalog/build evidence only for selected asset; V3 fauna integration incomplete. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration LOW.
- **Open questions:** RV/AP: Is candidate distinct from V1 and better in motion?

<a id="vis-12"></a>

#### VIS-12 — Selected props and material-preserving baking

- **Problem / opportunity:** Individual prop/roof/well families may add fit or reduce submissions without replacing settlements.
- **V1 baseline / preservation:** V1 medieval houses/props and related source packs. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `scripts/assets/build-well.mjs`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/scripts/assets/build-well.mjs); [R3 C15](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potential variety or fewer submissions per family; benefit in adapted V1 remains unverified.
- **Integration concept:** Select well/roof/fence/yard assets; preserve UV/material maps.
- **Dependencies / compatibility:** Footprints; source recipes/credits; collision.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Settlement look/collision; several generic rebuild inputs are absent.
- **Maturity:** Partially integrated. **Activation:** Asset-specific activation/rebuild completeness varies. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration MEDIUM.
- **Open questions:** TR/RV/AP: Exact source pack, fit and draw cost in V1?

<a id="vis-13"></a>

#### VIS-13 — Bounded environment-light pilot

- **Problem / opportunity:** Existing Standard surfaces may benefit from bounded environment response if V1 atmosphere survives.
- **V1 baseline / preservation:** V1 Standard materials, grade and sun/hemi light. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/render/atmosphere/envLight.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/atmosphere/envLight.ts); [R3 C16](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory).
- **Potential value:** Potentially enrich existing material response; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate quantized PMREM without changing V1 grade.
- **Dependencies / compatibility:** Target disposal; interior/cave suppression; GPU budget.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Whole-scene look; cannot restore maps discarded offline and is not needed to add Standard to V1.
- **Maturity:** Implemented but disabled or gated. **Activation:** Environment pilot default-off; indoor suppression absent upstream. **Verification:** SI; HT; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** RV/AP: Night/interior/wet surfaces and rebuild cost?

### Gameplay & item correctness

<a id="game-01"></a>

#### GAME-01 — Typed item metadata and validation

- **Problem / opportunity:** Additional metadata and discriminated validation may improve consistency without changing item authority.
- **V1 baseline / preservation:** Capability-rich V1 catalog and IDs. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/data/items/catalog.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/data/items/catalog.ts); [R4 §5 row 1](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Consistent descriptions, provenance and exhaustive validation; benefit in adapted V1 remains unverified.
- **Integration concept:** Curate fields against V1 definitions; retain capabilities.
- **Dependencies / compatibility:** Current ItemKinds; all consumers; availability.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Item identity/availability; legacy aliases are not migrations.
- **Maturity:** Implemented and active. **Activation:** Typed catalog used by world and demo; availability metadata is not acquisition. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** TR/IS: Exact semantic crosswalk and all current-ID coverage?

<a id="game-02"></a>

#### GAME-02 — Layered armor and typed resistance

- **Problem / opportunity:** The current unlayered armor contract supports less independently authored slot/coverage variation.
- **V1 baseline / preservation:** Six-slot V1 contract with real aggregate effects. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/data/items/loadout.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/data/items/loadout.ts); [R4 §5 row 4](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Potentially deeper equipment choices; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate slot/coverage/damage semantics explicitly.
- **Dependencies / compatibility:** NPC parity; combat; loot/supply; Save; [VIS-10](#vis-10) optional.
- **Effort / risk:** **XL / HIGH**, for the stated scope. Combat/persistence/model exposure; not a UI upgrade.
- **Maturity:** Partially integrated. **Activation:** V2 live gear; V3 richer loadout/demo, no live combat/equip parity. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** AP: Worth changing mitigation/slots? RV: Earned gear and NPC equivalence?

<a id="game-03"></a>

#### GAME-03 — General player recipe interface

- **Problem / opportunity:** V1 lacks a general player recipe interface despite its working specialized crafting subloops.
- **V1 baseline / preservation:** Cooking, construction, repair and artisans already work. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/ui/items/CraftPanel.vue`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/ui/items/CraftPanel.vue); [R4 §5 row 5](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Fill generic player recipe interaction gap; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt panel through V1 authoritative actions for selected recipes.
- **Dependencies / compatibility:** Real input/output sources; station/busy owners.
- **Effort / risk:** **L / HIGH**, for the stated scope. Economy and player loop; panel alone does not supply complete manufacturing.
- **Maturity:** Implemented but disabled or gated. **Activation:** V2 recipe UI live; V3 SessionCraft/panel default-off. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Which outputs complement artisans? RV: Gather→craft→use/sell?

<a id="game-04"></a>

#### GAME-04 — Staged craft admission/completion

- **Problem / opportunity:** Selected completion paths may benefit from staged publication when inputs/capacity change during an action.
- **V1 baseline / preservation:** V1 preflight recipes, BusyAction and production executor. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/craft/craftSession.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/craft/craftSession.ts); [R4 §5 row 6](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Avoid partial debit/output on ordinary refusal; benefit in adapted V1 remains unverified.
- **Integration concept:** Apply staging principle within current owners.
- **Dependencies / compatibility:** Inventory capacity; cancellation/retry; food inheritance.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Persistence/food; kernel has no skill training/quality roll and is not generic rollback.
- **Maturity:** Implemented but disabled or gated. **Activation:** Kernel/session connected behind CRAFT_ENABLED=false. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Changed input, capacity and repeated completion?

<a id="game-05"></a>

#### GAME-05 — Recipe requirements and quality outcomes

- **Problem / opportunity:** A generic manufacturing extension needs meaningful requirements and quality rules beyond a recipe panel.
- **V1 baseline / preservation:** V1 cooking and artisan expertise/quality. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/craft.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/craft.ts); [R4 §5 row 7](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Potential broader meaningful player manufacturing; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt selected tool/station/skill rules into V1 definitions.
- **Dependencies / compatibility:** Sources/consumers; NPC expertise; player XP.
- **Effort / risk:** **L / HIGH**, for the stated scope. Economy/progression; do not copy arbitrary V2 training gains.
- **Maturity:** Implemented and active. **Activation:** V2 player recipes live; NPC production uses distinct paths. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Depth/learning policy? TR: Each output has real supply and use?

<a id="game-06"></a>

#### GAME-06 — Weapon breakage and repair lifecycle

- **Problem / opportunity:** V1 melee wear/sharpening does not complete a weapon breakage/durability-repair lifecycle.
- **V1 baseline / preservation:** V1 melee wear/edge/sharpening; no durability repair/breakage. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/repair.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/repair.ts); [R4 §5 row 8](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Maintenance decisions and completed weapon lifecycle; benefit in adapted V1 remains unverified.
- **Integration concept:** Connect wear thresholds, repair service/materials and NPC rules.
- **Dependencies / compatibility:** Instance identity; combat; smith stock; Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. Combat/economy/persistence; bows/traps/tents need distinct semantics.
- **Maturity:** Partially integrated. **Activation:** V2 break/repair live; V3 pure/services/demo, no combat-generated wear. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Desired breakage cost? RV: Hunt→wear→repair and interruption?

<a id="game-07"></a>

#### GAME-07 — Conserved merchant purse and basket validation

- **Problem / opportunity:** Catalog merchant cash/stock semantics differ from conserved ordinary NPC barter and donor commits are stale-state exposed.
- **V1 baseline / preservation:** Finite stock; ordinary NPC barter conserves coins, catalog path differs. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/session/sceneSession.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/sceneSession.ts); [R4 §5 row 9; R6 F01](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** More coherent cash/stock ownership and fresh transactions; benefit in adapted V1 remains unverified.
- **Integration concept:** Extend owner-backed V1 trade; validate intent at commit.
- **Dependencies / compatibility:** Physical coins; merchant/household owners; durable Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. High economy/persistence exposure; not standalone UI and not finished persistent economy.
- **Maturity:** Partially integrated. **Activation:** V3 connected session trade; purse/stock not durable; next accounts accepted. **Verification:** SI; TP; HT-FAIL; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Catalog merchant cash policy? RV: Stale basket, time, insufficient funds and reload?

<a id="game-08"></a>

#### GAME-08 — Deterministic ammunition selection

- **Problem / opportunity:** Variant/quality ammunition selection can be explicit without replacing the functioning ranged lifecycle.
- **V1 baseline / preservation:** V1 ranged ammo debit/release/recovery. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/data/items/ammo.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/data/items/ammo.ts); [R4 §5 row 10](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Explicit choice/refusal across variants; benefit in adapted V1 remains unverified.
- **Integration concept:** Map query to V1 lifecycle and exact instance semantics.
- **Dependencies / compatibility:** Ammo IDs; release timing; NPC shots.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Combat/item identity; selection math does not supply ranged execution.
- **Maturity:** Standalone component/demo. **Activation:** Pure query/tests exist; no V3 world combat connector. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Mixed stacks, cancellation and one-shot debit?

<a id="game-09"></a>

#### GAME-09 — Skill-based ranged aim assistance

- **Problem / opportunity:** Skill-based ballistic assistance is an optional accessibility/feel change beyond current spread and soft lock.
- **V1 baseline / preservation:** Spread, soft lock, yaw and swept projectiles. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/rangedAim.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/rangedAim.ts); [R4 §5 row 11](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Potentially improve ranged accessibility; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt assistance to V1 skills/collision if desired.
- **Dependencies / compatibility:** Target eligibility; archery scale; obstruction.
- **Effort / risk:** **L / HIGH**, for the stated scope. Combat feel; V2 dimensional/target rules differ.
- **Maturity:** Implemented and active. **Activation:** V2 aiming helper connected. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Amount/type of assistance? RV: Moving targets and obstacles?

<a id="game-10"></a>

#### GAME-10 — Timed guard/parry and directional dodge

- **Problem / opportunity:** Explicit timed guard/parry/dodge actions offer a different agency model from chance-based defense.
- **V1 baseline / preservation:** V1 directional chance defense and lock. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/guard.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/guard.ts); [R4 §5 row 12](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Potential additional combat agency; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate actions with input/stamina/commitment and actor parity.
- **Dependencies / compatibility:** Defense skill; fauna damage; NPC AI; input.
- **Effort / risk:** **XL / HIGH**, for the stated scope. High gameplay/progression exposure; V3 combat remains planned.
- **Maturity:** Partially integrated. **Activation:** V2 player guard/dodge live; not shared NPC parity. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** AP: Combat direction? RV: Player/NPC and fauna fairness?

<a id="game-11"></a>

#### GAME-11 — Bounded food expiry representation

- **Problem / opportunity:** Deadline consolidation could bound food rows only if V1 batch growth is consequential and richer semantics can survive.
- **V1 baseline / preservation:** Species/storage-rate/effective-age V1 batches. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/data/items/foodBatches.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/data/items/foodBatches.ts); [R4 §5 row 14](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Possible bound on row growth if V1 problem is measured; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate deadline idea only with preserved semantics.
- **Dependencies / compatibility:** Batch/storage provenance; processing; Save; [GAME-12](#game-12).
- **Effort / risk:** **XL / HIGH**, for the stated scope. High food/persistence exposure; unresolved correctness precludes assuming donor parity.
- **Maturity:** Partially integrated. **Activation:** Gated food loops; historical independent food/Save gate FAIL. **Verification:** SI; TP; HT-FAIL; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** TR/RV: Is V1 batch growth a problem; can storage/species survive?

<a id="game-12"></a>

#### GAME-12 — Food transfer and actor safety consistency

- **Problem / opportunity:** Plain-add food purchases and generic NPC first-food helpers do not uniformly preserve age or player safety rules.
- **V1 baseline / preservation:** Rich batch transfer/player safety; purchase and NPC helper gaps. Preserve the relevant contracts in §5.
- **Source evidence:** [V1 `src/items/trade.ts`](https://github.com/jm-sky/seedvale-v1/blob/996295cbc1410738e6a988faac90942bef4f9c4b/src/items/trade.ts); [R4 §6 food/trading; R6 §4](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Avoid food rejuvenation and inconsistent spoilage handling; benefit in adapted V1 remains unverified.
- **Integration concept:** Use existing batch/time helpers at affected owners.
- **Dependencies / compatibility:** Trade/refund; NPC provisions; production; Save.
- **Effort / risk:** **L / HIGH**, for the stated scope. Food/economy/persistence; source concern has not been freshly reproduced.
- **Maturity:** Partially integrated. **Activation:** Correct generic helpers active; known plain-add/first-food paths remain. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Buy/store/cook/eat across actors; AP: NPC risk policy?

### Content, knowledge & audio

<a id="content-01"></a>

#### CONTENT-01 — Night Torches story

- **Problem / opportunity:** The source provides a distinct family/observation misunderstanding beyond a routine light-duty task.
- **V1 baseline / preservation:** V1 guard light duty and local cast/quests. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/data/quests/g03.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/data/quests/g03.ts); [R5 §6 row 1 (G03)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Observation, family concern and humane alternatives; benefit in adapted V1 remains unverified.
- **Integration concept:** Translate selected beats into V1 QuestDef with real actors.
- **Dependencies / compatibility:** QuestManager; family/guard/posts; time; [UX-06](#ux-06) shared.
- **Effort / risk:** **L / HIGH**, for the stated scope. NPC autonomy/Save; no duplicate duty payout or indefinite holds.
- **Maturity:** Implemented and active. **Activation:** Source quest registered; site/offer reachability not freshly played. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Fit/tone/deadline? RV: All branches and autonomous resolution?

<a id="content-02"></a>

#### CONTENT-02 — Well and Rumor story

- **Problem / opportunity:** Evidence versus accusation can enrich local problems, but scripted illness must match actual world truth.
- **V1 baseline / preservation:** V1 well, health, reputation and local problems. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/data/quests/g08.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/data/quests/g08.ts); [R5 §6 row 2 (G08)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Evidence versus blame with social consequences; benefit in adapted V1 remains unverified.
- **Integration concept:** Bind story facts to real health/news/economic owners.
- **Dependencies / compatibility:** Actual illness/evidence; QuestManager; reputation.
- **Effort / risk:** **L / HIGH**, for the stated scope. World/economy; quest facts are not general contamination/gossip.
- **Maturity:** Implemented and active. **Activation:** Registered script includes on-offer sickness and refusal effects. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Scripted illness acceptable? RV: Pre-offer truth and lasting effects?

<a id="content-03"></a>

#### CONTENT-03 — Old river-map investigation

- **Problem / opportunity:** Landscape-reading investigation offers narrative value only when clues and rewards bind true V1 sites/property.
- **V1 baseline / preservation:** V1 treasure maps, research and finite caches. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/data/quests/q05.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/data/quests/q05.ts); [R5 §6 row 3 (Q05)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Landscape reading and property choices; benefit in adapted V1 remains unverified.
- **Integration concept:** Bind clues/rewards to actual V1 sites and identities.
- **Dependencies / compatibility:** Geography/site admission; unique loot; QuestManager.
- **Effort / risk:** **L / HIGH**, for the stated scope. World/item/Save; no duplicate cache or invented historical river.
- **Maturity:** Partially integrated. **Activation:** Registered branches; offset anchors/minted contents do not prove physical history. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Real dry bed/site and property/reward policy?

<a id="content-04"></a>

#### CONTENT-04 — Bell/chapel investigation beats

- **Problem / opportunity:** Memorable chapel recovery material mixes executable branches with unimplemented physical promises.
- **V1 baseline / preservation:** V1 ruins, caves and finite treasure. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/data/quests/q11.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/data/quests/q11.ts); [R5 §6 row 4 (Q11)](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Memorable recovery and nonviolent alternatives; benefit in adapted V1 remains unverified.
- **Integration concept:** Evaluate authored beats separately from missing physical services.
- **Dependencies / compatibility:** Real site/animal; heavy-item custody; consequences.
- **Effort / risk:** **XL / HIGH**, for the stated scope. World/fauna/item/Save; narrative ferry ending is no passenger service.
- **Maturity:** Partially integrated. **Activation:** Recovery/branches registered; seasonal water, boat and crossing effects stubbed. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** AP: Which beats justify dependencies? RV: Extraction/custody/outcome truth?

<a id="content-05"></a>

#### CONTENT-05 — Ordinary speech and role text

- **Problem / opportunity:** Ordinary role/activity text could broaden variety without replacing existing quest dialogue precedence.
- **V1 baseline / preservation:** V1 templates, contextual dialogue and quest overrides. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/data/dialogue/ordinaryConversations.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/data/dialogue/ordinaryConversations.ts); [R5 §6 row 5](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** More local variety and character voice; benefit in adapted V1 remains unverified.
- **Integration concept:** Select guarded phrases using V1 cast/language/suppliers.
- **Dependencies / compatibility:** Context truth; precedence; speaker identity.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Narrative; not a replacement social-memory or quest system.
- **Maturity:** Partially integrated. **Activation:** Runtime seed bank active; broader authored library not all live. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Humor/language/cast? RV: Kin/weather/work truth and repetition?

<a id="content-06"></a>

#### CONTENT-06 — Exact transcript/voice clip contract

- **Problem / opportunity:** Semantic barks cannot guarantee an exact transcript-to-recording match for selected authored lines.
- **V1 baseline / preservation:** Semantic V1 intents and spatial voice playback. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/audio/npcVoiceResolver.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/audio/npcVoiceResolver.ts); [R5 §6 row 6](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Avoid unrelated recorded text and unstable casting; benefit in adapted V1 remains unverified.
- **Integration concept:** Validate exact text/profile around current playback owner.
- **Dependencies / compatibility:** Line IDs; QC; fallback; async cancellation.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Audio identity/lifecycle; no broad coverage or accepted clips inferred.
- **Maturity:** Standalone component/demo. **Activation:** Three manifest entries unverified; no live session voice dispatch. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Selected transcript/profile QC and missing-clip silence?

<a id="content-07"></a>

#### CONTENT-07 — Selected additional recorded barks

- **Problem / opportunity:** Potential new role/timbre coverage must be distinguished from inherited blobs and duplicate scripts.
- **V1 baseline / preservation:** 109 V1 direct voice MP3s with live bark playback. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `docs/dialogue/NPC-VOICE-CATALOG.md`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/dialogue/NPC-VOICE-CATALOG.md); [R5 §6 row 7](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Potential missing role/timbre coverage; benefit in adapted V1 remains unverified.
- **Integration concept:** Compare selected new files/transcripts/provenance.
- **Dependencies / compatibility:** Speaker/trigger truth; rights; bark limiter.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Audio/content; file counts and B timbres are not distinct dialogue coverage.
- **Maturity:** Authored content only. **Activation:** 317 direct files include all 109 V1 blobs; live exact coverage absent. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts MEDIUM, successful V1 integration MEDIUM.
- **Open questions:** AP: Voice/language extent? RV/TR: Listen, transcript, rights and repetition?

<a id="content-08"></a>

#### CONTENT-08 — Decoded audio budgets and eviction

- **Problem / opportunity:** V1 successful decoded buffers can remain shared across instances without the inspected byte-budgeted eviction.
- **V1 baseline / preservation:** V1 shared successful-buffer cache across instances. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/audio/samplePlayer.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/audio/samplePlayer.ts); [R5 §6 row 8](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Bound long-session decoded memory; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt active-source-safe LRU/idle/concurrency policy.
- **Dependencies / compatibility:** Current audio context; loops; disposal; async fetch.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Audio/performance; compressed bytes are not PCM and source limits are not measured savings.
- **Maturity:** Implemented and active. **Activation:** V3 budgeted ambience/cues active; voice dispatch separate. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Decoded bytes/churn, recovery and late decode after rebuild?

<a id="content-09"></a>

#### CONTENT-09 — Approximate geographic leads

- **Problem / opportunity:** Approximate encounter-resolved clues may improve exploration beyond exact targets without another knowledge authority.
- **V1 baseline / preservation:** V1 confidence, location research and distinct social news. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/world/leads/searchArea.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/leads/searchArea.ts); [R5 §6 row 11](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Uncertain clues supporting discovery; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt offset/search-area logic into existing knowledge flow.
- **Dependencies / compatibility:** Location knowledge; encounter resolution; Save.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Knowledge/Save; never merge news, notes and quest progress into one store.
- **Maturity:** Implemented and active. **Activation:** V2 rumours live; V3 board lead/encounter active, NPC gossip planned. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Guidance uncertainty? RV: No true-coordinate leak or omniscient claim?

### Player interface & travel

<a id="ux-01"></a>

#### UX-01 — Item cards, tags and condition meters

- **Problem / opportunity:** Current details can present quality/condition hierarchy more clearly through reusable view components.
- **V1 baseline / preservation:** V1 grouped inventory/details/actions already exist. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/ui/items/ItemDetailCard.vue`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/ui/items/ItemDetailCard.vue); [R4 §5 row 2](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Clearer quality/condition information; benefit in adapted V1 remains unverified.
- **Integration concept:** Derive V1 view data; preserve app command callbacks.
- **Dependencies / compatibility:** V1 facade; units/semantics; input ownership.
- **Effort / risk:** **M / LOW**, for the stated scope. Presentation only; no replacement inventory authority or demo Drop semantics.
- **Maturity:** Partially integrated. **Activation:** Cards/screens implemented; rich sandbox exceeds live world actions. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** RV/AP: Representative items, focus and truthful units/actions?

<a id="ux-02"></a>

#### UX-02 — Equipment what-if comparison

- **Problem / opportunity:** Actual equipment tradeoffs may be easier to understand before committing an equip action.
- **V1 baseline / preservation:** V1 worn modifiers and ownership checks. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/ui/items/EquipmentPanel.vue`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/ui/items/EquipmentPanel.vue); [R4 §5 row 3](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Understand tradeoffs before equipping; benefit in adapted V1 remains unverified.
- **Integration concept:** Compute previews through V1 modifier resolver.
- **Dependencies / compatibility:** Six-slot selection; held choices; actual combat math.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Wrong mitigation/DPS is a gameplay promise; no requirement for GAME-02.
- **Maturity:** Standalone component/demo. **Activation:** Rich comparison in sandbox; no live world equip parity. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV: Preview equals actual post-equip effects; AP: Desired layout?

<a id="ux-03"></a>

#### UX-03 — Character descriptions and effective-stat layout

- **Problem / opportunity:** Descriptions/grouping can clarify earned effective capability without promising an unimplemented character model.
- **V1 baseline / preservation:** V1 SPEA, eight XP skills and effective modifiers. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/ui/character/CharacterScreen.vue`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/ui/character/CharacterScreen.vue); [R4 §5 row 13 (UI)](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory).
- **Potential value:** Clearer actual earned capabilities and modifier provenance; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt descriptions/groups to V1 authority only.
- **Dependencies / compatibility:** V1 XP/effective stats; truthful producer/consumer labels.
- **Effort / risk:** **M / LOW**, for the stated scope. UI estimate excludes SPECIA conversion/new skills; those remain unresolved possibility U02.
- **Maturity:** Standalone component/demo. **Activation:** Character demo/pure owner; expanded live learning incomplete. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** AP: Recognizable sheet? RV: Every shown effect has real consumer?

<a id="ux-04"></a>

#### UX-04 — Personal map annotations

- **Problem / opportunity:** General free-position personal annotation editing is not established in V1 beyond known-location targets.
- **V1 baseline / preservation:** Known-location targets; no confirmed free-position editor. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/sim/map/mapAnnotations.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/map/mapAnnotations.ts); [R5 §6 row 9](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Remember camps, hazards and personal clues; benefit in adapted V1 remains unverified.
- **Integration concept:** Add bounded notes to V1 map and Save.
- **Dependencies / compatibility:** Coordinates/catalog/knowledge; additive Save migration.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Knowledge/Save; no canonical-world ID/bounds transplant.
- **Maturity:** Implemented and active. **Activation:** MapHud/editor/list/Save connected; demo separate. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** RV/AP: Unknown-place notes, Unicode/bounds and guidance level?

<a id="ux-05"></a>

#### UX-05 — Map overlap picking and label layout

- **Problem / opportunity:** Dense marker overlap and labels can make existing known places difficult to pick clearly.
- **V1 baseline / preservation:** V1 picking/labels and selected targets. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/ui/map/mapHitTest.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/ui/map/mapHitTest.ts); [R5 §6 row 10](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Select dense markers clearly; benefit in adapted V1 remains unverified.
- **Integration concept:** Feed pure layout/hit-test with V1 visible/estimated inputs.
- **Dependencies / compatibility:** Current map projection; zoom; touch/cancel.
- **Effort / risk:** **M / LOW**, for the stated scope. Presentation/knowledge; independent of annotation adoption.
- **Maturity:** Implemented and active. **Activation:** Live overlap chooser and layout; mounted tests present. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** RV/AP: Dense pan/zoom, drag versus click and hidden-marker exclusion?

<a id="ux-06"></a>

#### UX-06 — Bounded conversation engagement

- **Problem / opportunity:** Engagement, stale callbacks and time-control patches need one bounded release/revalidation contract.
- **V1 baseline / preservation:** V1 menu engagement, idle release and time patches. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/session/sessionConversation.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/sessionConversation.ts); [R5 §6 row 12](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Reject stale choices and release holds reliably; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt leases/revalidation at V1 callbacks and clock boundary.
- **Dependencies / compatibility:** NPC urgency; world revisions; movement/time; trade.
- **Effort / risk:** **L / HIGH**, for the stated scope. NPC autonomy/clock/Save; no demonstrated combat-safe interruption.
- **Maturity:** Implemented and active. **Activation:** Live conversation; danger supplier currently constant false. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** AP: Slow time/hold policy? RV: Danger, needs, range, load and stale reply?

<a id="ux-07"></a>

#### UX-07 — Modal and input ownership contracts

- **Problem / opportunity:** Modal focus/held-key transitions can leak movement or commands across editing and gameplay.
- **V1 baseline / preservation:** V1 overlays/Escape and keyboard/touch paths. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/session/inputOwner.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/inputOwner.ts); [R5 §6 row 13](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Avoid held-key leaks and movement while editing; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt release/focus/priority rules in current facade.
- **Dependencies / compatibility:** Hotkeys; nested modal stack; blur/hide.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Input correctness; preserve V1 combat/action key semantics.
- **Maturity:** Implemented and active. **Activation:** Input/modal owner connected; device acceptance not reproduced. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration HIGH.
- **Open questions:** RV: Typing, repeats, nested Escape and pointer cancellation?

<a id="ux-08"></a>

#### UX-08 — Safe automatic physical travel

- **Problem / opportunity:** Automatic physical travel could reduce steering repetition but changes danger, arrival and world-time behavior.
- **V1 baseline / preservation:** Physical walk/ride and targets; V1 autopilot planned. Preserve the relevant contracts in §5.
- **Source evidence:** [V2 `src/game/sim/navigation.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/navigation.ts); [R5 §6 row 14](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Reduce repetitive steering if desired; benefit in adapted V1 remains unverified.
- **Integration concept:** Adapt watchdog/cancellation through V1 movement and clocks.
- **Dependencies / compatibility:** Roads/ground collision; mounts; needs/danger; time policy.
- **Effort / risk:** **XL / HIGH**, for the stated scope. Gameplay/world clock; not teleportation, passenger transport or local AI A*.
- **Maturity:** Implemented and active. **Activation:** V2 physical autopilot active with acceleration; V1 no executor. **Verification:** SI; TP; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration LOW.
- **Open questions:** AP: Autopilot/acceleration/arrival policy? RV: Same-tick stop and continuity?

<a id="ux-09"></a>

#### UX-09 — Road and river map overlays

- **Problem / opportunity:** Inspected V1 drawers lack separate road/river polyline layers despite authoritative geometry existing.
- **V1 baseline / preservation:** V1 terrain/fog/knowledge map; no separate polyline layers in inspected drawers. Preserve the relevant contracts in §5.
- **Source evidence:** [V3 `src/game/world/map/mapRaster.ts`](https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/map/mapRaster.ts); [R5 §5 map representation; R3 §3](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory).
- **Potential value:** Read crossings, routes and landscape more clearly; benefit in adapted V1 remains unverified.
- **Integration concept:** Draw V1 authoritative geometry via current projection.
- **Dependencies / compatibility:** World extents; simplification/cache; discovery policy.
- **Effort / risk:** **M / MEDIUM**, for the stated scope. Map/performance; does not require replacing geography/raster/knowledge authority.
- **Maturity:** Implemented and active. **Activation:** V2 road raster and V3 simplified river chains active. **Verification:** SI; independent game execution in R7: none; V1 adaptation author acceptance: pending. **Confidence:** facts HIGH, successful V1 integration MEDIUM.
- **Open questions:** RV/AP: Useful zoom, streamed extent cost and allowable geographic revelation?

## 5. V1 preservation contracts

These are decision constraints to retain or explicitly reconsider with evidence, not permanent bans on changing implementations. R1 §3–§6 and R6 §4–§5 supply the baseline; R2–R5 provide the detailed owner boundaries.

| Contract | Protect / explicitly reconsider | Candidate exposure |
| --- | --- | --- |
| P01 World identity and existing saves | Seed/world facts, stable settlement/NPC/site/item references, stored deltas and v56 migration history. Cache invalidation is not old-generator retention. | WORLD-01–WORLD-06; ARCH-04–ARCH-06/ARCH-12; GAME-01–GAME-07/GAME-11/GAME-12; UX-04; CONTENT-01–CONTENT-04 |
| P02 Atmosphere, vegetation and material response | V1 palette/grade, species/canopy/undergrowth, Standard/PBR maps, water/day-night/post effects and weather variation; capture author reference scenes. | WORLD-01–WORLD-05; VIS-01–VIS-08/VIS-10–VIS-13 |
| P03 Autonomous NPC behavior and offscreen commitments | Persistent personal state, needs, schedules, relationships, real provisions, selected travel/crop/transport catch-up, exclusive detailed/offscreen executor. Not universal persistence. | ARCH-02/ARCH-06–ARCH-09/ARCH-11/ARCH-13; GAME-03–GAME-07/GAME-10/GAME-12; CONTENT-01/CONTENT-02/CONTENT-05; UX-06/UX-08 |
| P04 Real production, logistics and ownership | Distinct bulk stock, household/personal inventories, transient work carry, durable cargo, artisan reservations and delivered-source ledger. Production ordinary preflight guarantee must not become an arbitrary rollback claim. | ARCH-04/ARCH-05/ARCH-08/ARCH-11; GAME-01/GAME-03–GAME-07/GAME-11/GAME-12; CONTENT-01–CONTENT-04 |
| P05 Fauna and habitats | Predator/prey and need/corpse behavior, critical cadence exemptions, habitat-bound occupancy/depletion/recovery, livestock/persistent-occupant identities; ordinary wild individuals reconstruct. | ARCH-01/ARCH-02/ARCH-06/ARCH-07/ARCH-09/ARCH-12/ARCH-13; VIS-11; GAME-02/GAME-06/GAME-08–GAME-10; CONTENT-04; UX-08 |
| P06 Inventory provenance and food | Stable identity-bearing gear/liquids/keys, food age/species/storage rates, capacity/size, physical coins and real transfers. Repair weak branches rather than preserving their defects. | ARCH-04/ARCH-05/ARCH-08/ARCH-11; GAME-01–GAME-08/GAME-11/GAME-12; UX-01/UX-02; CONTENT-03/CONTENT-04 |
| P07 Earned attributes, skills and equipment effects | XP→capability, books/prerequisites, effective versus base SPEA, actual mitigation/timing/ownership and NPC expertise. New labels must have producers/consumers. | GAME-02–GAME-06/GAME-08–GAME-10; UX-01–UX-03; U02 |
| P08 Quests, identities and consequences | One QuestManager, familiar cast, true site/actor admission, report-before-reward, exact-once outcomes, heard notes, independent social news/location knowledge. Wild-target restore invalidation is distinct from saved outcome metadata. | ARCH-04–ARCH-06/ARCH-11; GAME-01/GAME-07; CONTENT-01–CONTENT-07/CONTENT-09; UX-06 |
| P09 Maps, exploration knowledge and UI | Fog does not confirm settlement knowledge; stable target slots, estimated coordinates, familiar map/minimap and truthful actions/command ownership. | WORLD-01–WORLD-06; CONTENT-09; UX-01–UX-09 |
| P10 Stable rendering and runtime performance | Retain equivalent content/effects/populations/commitments when claiming an optimization; reuse workers/batching/caches/cadence; dispose stale async resources. | ARCH-01–ARCH-10/ARCH-13; WORLD-03/WORLD-06; VIS-01–VIS-13; CONTENT-06–CONTENT-08; UX-09 |

Ranges in this section denote groups of existing canonical records, not additional candidates. A preservation contract can require an explicit author choice and a targeted test rather than unchanged internals.

## 6. Cross-domain dependency matrix

**H = hard technical prerequisite; O = optional enhancement; S = shared integration boundary; V = verification dependency; A = author/product decision dependency.** H names an existing required mechanism unless a candidate ID is explicitly stated. S does not mean either candidate must be implemented first. V calls for evidence only when relying on the named claim. This is not a migration order.

| Candidate / relationship | Kind | Required relationship / consequence |
| --- | --- | --- |
| ARCH-01 / V1 findPath and locomotion | H | Preserve query costs, slope/corner/LOS/smoothing and final collision authority; neither ARCH-02 nor a V3 raster is required for scratch reuse. |
| ARCH-02 / existing intents, readiness and time | H | Cancellation, world revision, clock expiry and valid waiting routes must have one owner. ARCH-09 can help cold preparation (O), not prove an atomic time bound. |
| ARCH-03 / ARCH-13 | O | A guard may protect a chosen extraction; a guard over already-pure areas does not require broad extraction. |
| ARCH-04 / ARCH-05 | S | Capture/publication share current domain snapshot and WorldBundle boundaries; stronger write serialization and staged restore remain independently evaluable. |
| ARCH-06 / UX-06 / UX-08 / V1 time and Save | S, A | Normal/skip/travel/conversation deltas cannot advance commitments twice. Required determinism and travel/slow-time behavior are author decisions, not a hard requirement to replace clocks. |
| ARCH-07 / ARCH-13 / V1 actor movement | S, V | Same-frame pose, move/remove/restore and qualified livestock identity must agree. Index benefit requires matched workload evidence, not state extraction by default. |
| ARCH-08 / ARCH-11 / GAME-04 / GAME-07 / GAME-12 | O, S | Conservation oracles can verify each change through existing source/sink owners; no new universal transaction manager is a prerequisite. |
| ARCH-09 / ARCH-10 / VIS-04 / VIS-05 | S, O | Streaming/invalidation/assets share resource boundaries. Cache sizing, preparation slicing, leaf cutting and representation are distinct gains; none requires importing all others. |
| WORLD-01–WORLD-06 / V1 canonical ground-water-road-cave and persisted references | H, A, V | Shared queries and old-world retention policy constrain geometric changes. WORLD-06 indexing needs output parity but need not alter geometry. |
| WORLD-03 / existing detailed terrain sampling | H | Near/far geometry must agree and remain presentation-only; no dependency on mountain reshaping. |
| WORLD-01–WORLD-05 / CONTENT-03/CONTENT-04 / UX-09 | S | Actual sites, crossings and map coordinates share geography. Stories and overlays can use current V1 geography; no terrain change is mandatory. |
| VIS-02 / VIS-06 / directional wind input | H; VIS-03 O | Both need coherent wind units/phase, which may be supplied through a V1 adapter. A wholesale field port is not a hard prerequisite; flat-water waves do not deliver river motion. |
| VIS-06 / model deformation and shadow/depth pipeline | H, V | Weights, bounds, LOD and matching depth must agree. Source default-off/failed or inconclusive GPU evidence must be addressed for the selected target. |
| VIS-07 / existing weather and wet/puddle shader composition | H | Consume V1 snow/time rather than installing a competing weather machine. Crown/shrub snow remains a separate unproven scope. |
| VIS-08 / VIS-09 | O, V | Diagnostics may support stabilization comparison; timing does not require changing cadence or quality. V1's existing cadence remains the baseline. |
| VIS-10 / GAME-02 / UX-02 | S, O | Visual attachments, layered armor semantics and comparison UI meet at equipment, but none implies the other. Existing six-slot math can power previews. |
| GAME-01 / UX-01–UX-03 | O, S | Richer metadata can improve views; views can already adapt V1 definitions. Never replace inventory authority to share a component. |
| GAME-03 / GAME-04 / GAME-05 / V1 crafting owners | H to existing owners; O between candidates | Useful inputs/outputs and authoritative action/station/inventory contracts are required. Panel, completion staging and expanded requirements can be evaluated separately; no full V3 session transplant. |
| GAME-02/GAME-06/GAME-08–GAME-10 / V1 combat and XP | H, A, V | Existing attack/defense/ammo/gear effects and earned capability must be reconciled. Desired depth and assistance require author preference. |
| GAME-07/GAME-11/GAME-12 / inventory, food and durable ownership | H, V | Preserve identity/time/species/rates/coins and validate actual commit state. Reliance on V3 expiry requires closure of review245's relevant historical failures. ARCH-04 is an optional safety technique, not proof merchant state is durable. |
| CONTENT-01–CONTENT-04 / V1 quest, cast, sites and real effects | H, A, V | True admission and committed outcomes are required; desired scripting/holds/external resolution are author choices. New skills, ferry services and canonical V3 cast are not presumed dependencies. |
| CONTENT-05 / CONTENT-06 / CONTENT-07 | S, O | Text truth, exact clip QC and recordings share line/speaker identity. Text can ship without voice; recordings do not require broad voicing. |
| CONTENT-08 / current audio owner | H | Eviction must respect playing sources and context/disposal lifetime. No new voice backend is necessary. |
| CONTENT-09 / UX-04 / UX-05 / UX-09 | S | Leads, personal notes, picking and overlays use projection/knowledge but remain distinct stores/affordances. Shared marker rendering must not reveal hidden true coordinates. |
| UX-06 / UX-07 / GAME-07 | S | Modal, engagement, trade, stale-command and close/load behavior meet at V1 facade/input/time boundaries. V3 UI-calculated accounts must not substitute for authoritative commands. |
| Performance, visual and asset claims throughout | V | Selected V1 fixture/hardware and author-approved scenes, plus exact selected asset source/recipe/rights, are required for consequential claims; not a full benchmark/rights audit before discussing every row. |

## 7. Risk and effort overview

These are descriptive lenses; membership is neither priority nor approval. Effort is per bounded scope, never summed. Potential replacement scopes in §8/U02 are larger than the corresponding technique/UI estimate.

| Lens | Representative canonical candidates | Why / boundary |
| --- | --- | --- |
| Low-risk narrow scope | ARCH-03, ARCH-08, VIS-09, UX-01, UX-03, UX-05 | Guards, optional diagnostics and view adapters retain current owners. Validate exceptions, timer overhead, truthful units and focus; LOW does not remove acceptance needs. |
| Medium-complexity integration | ARCH-01/ARCH-07/ARCH-10/ARCH-12; VIS-01–VIS-03/VIS-05/VIS-07/VIS-08/VIS-12/VIS-13; GAME-01/GAME-04/GAME-08; CONTENT-05–CONTENT-09; UX-02/UX-04/UX-07/UX-09 | Several adapters, resource/data semantics or presentation seams; some individual visual/food exposure can still be HIGH despite an M estimate. |
| High-risk multiple owners / data-model scope | ARCH-02/ARCH-04–ARCH-06/ARCH-09/ARCH-11/ARCH-13; WORLD-02–WORLD-05; VIS-04/VIS-06/VIS-10; GAME-02/GAME-03/GAME-05–GAME-07/GAME-09–GAME-12; CONTENT-01–CONTENT-04; UX-06/UX-08 | Clocks, identities, real flows, generation or material/behavior changes. Whole inventory/NPC/terrain replacement is not priced as these smaller candidates. |
| Visual comparison | WORLD-01–WORLD-05; VIS-01–VIS-08/VIS-10–VIS-13; UX-01–UX-05/UX-09 | Paired V1 scenes/clips and author judgment; overrides or source-side approval have limited scope. |
| Gameplay-loop verification | ARCH-02/ARCH-11/ARCH-12; GAME-02–GAME-10/GAME-12; CONTENT-01–CONTENT-05/CONTENT-09; UX-06–UX-08 | Legitimate acquisition/action→effect→continuation, urgent interruption and real world consequences. |
| Save/persistence validation | ARCH-04–ARCH-06/ARCH-11/ARCH-12; WORLD-01–WORLD-05; GAME-01–GAME-07/GAME-11/GAME-12; CONTENT-01–CONTENT-04/CONTENT-09; UX-04/UX-06/UX-08 | Validate only affected payload/cut points and representative old saves; preserve exact references and no repeated payment/cargo/output. |
| Performance benchmarking | ARCH-01/ARCH-02/ARCH-07/ARCH-09/ARCH-10; WORLD-03/WORLD-06; VIS-01–VIS-09/VIS-13; CONTENT-08; UX-09 | Selected cost/overhead claim needs equivalent V1 workload, cold/warm/travel separation and valid native GPU evidence where relevant. Asset families also need measured budgets when selected. |

## 8. Explicit non-recommendations and traps

Warnings apply to assumptions, not permanent design prohibitions. They preserve the option to evaluate a larger change after its benefit and compatibility cost become explicit.

| Assumption to avoid | Evidence-backed risk | Safer evaluation boundary |
| --- | --- | --- |
| Replace V1 NPC execution with V3 Near/Mid/Far | R2/R6: generic scheduler differs from live host; Far cancels goals/drops elapsed, home meals/work lack V1 concrete debit/output. | ARCH-01–ARCH-03/ARCH-06–ARCH-08/ARCH-13 techniques with P03/P04; ARCH-11 targets actual continuity gaps. |
| Reuse item UI by replacing inventory authority | R4/R6: owner-local IDs, capacity, food, liquids, coins and physical Drop differ; sandbox repair/drop are not world commands. | UX-01–UX-03 view/command adapters; GAME-01 curated metadata. |
| Adopt V3 default material/render policy as an upgrade | R3/R6: Lambert conversion and offline discarded maps can flatten V1; Standard/environment/bloom pilots default-off. | VIS-01–VIS-13 separately, preserving full V1 light/material/post chain and accepted scenes. |
| Replace generator/hydrology for prettier mountains/banks | R2/R3: finite/canonical donor world conflicts with V1 regional identity; ground/crossings/sites/Save move. | WORLD-01/WORLD-04/WORLD-05 narrow shaping; WORLD-06 measured index only; explicit P01 policy. |
| “Version the cache” preserves old worlds | R2/R6: cache miss recomputes with changed generator; old geometry/IDs still drift. | Author retention decision and saved-reference fixtures before selecting a geometry-changing approach. |
| Treat imported/curated quest totals as playable content | R5/R6: 19 V1 fixed entries, 39 imported V1 records, 21 V2 runtime/22 design, 61 imported V3 and 51 keep/rewrite records are different corpora. | CONTENT-01–CONTENT-04 individually bound to V1 QuestManager/cast/effects; no automatic V3 retirement/merge. |
| Import a story that promises nonexistent actors/effects | Q05 anchors/minted contents and Q11 ferry/season/crossing stubs; G08 scripted sickness/knowledge. | True site/supplier admission, physical outcome trace and explicit selected story/product boundaries. |
| More files mean better models or more voiced dialogue | R3/R5/R6: 15 V2/V3 animal GLBs identical; V3 includes all 109 V1 voice blobs; Peasant source defect; manifests unverified. | VIS-10–VIS-12/CONTENT-06/CONTENT-07 exact asset, pose/transcript/provenance checks. |
| New architecture or unlike benchmark proves V1 speedup | R2/R3/R6: different hardware, content, clocks and effects; V3 cache replay improvement belongs to its corpus. | ARCH-08/VIS-09 targeted instrumentation plus equivalent V1 A/B; no FPS/memory/hour invention. |
| Existing deterministic terrain means full replay | R2/R6: runtime Math.random and clamped frame deltas; donor interval accumulators/continuation also differ. | ARCH-06 scoped target plus split-step/Save checks and author guarantee. |
| Production preflight means general rollback | R2/R6: synchronous ordinary refusal is tested; arbitrary late mutation failure is not undone. | GAME-04/ARCH-08 selected boundary staging/failure oracle before broadening guarantees. |
| Adopt deadlines/trade as a completed economy kernel | R4/R6: V3 session trade connected but accounts/purse not durable, accepts next accounts; review245 food/trade failures remain relevant. | GAME-07/GAME-11/GAME-12 preserve V1 owners and variable food semantics; fresh authoritative intent validation. |
| Tree wind, winter, wetness or pilots are “accepted” because code exists | R3/R6: tree wind off with failed/inconclusive GPU evidence; snow override feedback is not running-season acceptance; puddle distance/timing issues open. | VIS-03/VIS-06/VIS-07/VIS-13 separately, including depth/LOD/GPU and author look gates. V1 already has wetness/puddles/weather. |
| Map markers, cargo transport or Q11 ferry text imply player travel | R5: assistance, V2 automatic physical motion, NPC material transport and passenger/instant travel are different capabilities. | UX-08 separate safety/clock/product evaluation; retain existing targets and physical travel. |

## 9. Decision-specific verification backlog

Deduplicated checks become relevant only to the named choice. “Before selection” means before a consequential decision relying on that uncertain claim, not before all planning. Use existing report suites/audits/reproductions; do not demand full browser/GPU/gameplay verification for every row. Acceptance evidence records version, fixture, method and remaining limitation; technical PASS never substitutes for author preference.

| Check | Candidate IDs | Uncertainty / method | Required acceptance evidence | Timing | Author involvement |
| --- | --- | --- | --- | --- | --- |
| V01 Old-world and Save retention | ARCH-04–ARCH-06/ARCH-11/ARCH-12; WORLD-01–WORLD-05; GAME-01–GAME-07/GAME-11/GAME-12; CONTENT-01–CONTENT-04; UX-04 | Author policy then selected saved-reference/schema diff; replay representative old saves only at affected boundaries. | Declared retain/migrate/refuse policy; reference/ownership/geometry snapshots and relevant round trips without silent loss. | Policy before selection; fixtures before implementation; regressions during implementation | Yes, compatibility expectations |
| V02 Offscreen material continuity | ARCH-06–ARCH-08/ARCH-11/ARCH-13; GAME-03–GAME-07/GAME-12; CONTENT-01/CONTENT-02; UX-08 | Selected travel/claim/produce/deliver/meal across detail, skip and load; committed source/sink ledger. | One executor, exact cargo/provision counts, no duplicate delivery/free work; declared transient-state limits. | Before selecting behavior replacement; targeted regressions during implementation | Yes, continuity scope |
| V03 Replay and clock contract | ARCH-02/ARCH-06; VIS-03/VIS-07; UX-06/UX-08 | Trace units and run split-step/normal/skip/hidden-tab/Save continuation for selected path. | Elapsed counted once; stable ordering/cursor under stated tolerance; separate generation and simulation guarantees. | Guarantee before selection; scoped oracle before/during implementation | Yes, desired guarantee and pacing |
| V04 V1 performance attribution | ARCH-01/ARCH-02/ARCH-07/ARCH-09/ARCH-10; WORLD-03/WORLD-06; VIS-01–VIS-09/VIS-13; CONTENT-08; UX-09 | Profile selected current V1 fixture, equivalent content/effects; isolate cold, warm, travel and worst atomic call; native GPU for GPU claims. | Hardware/seed/profile/camera/weather/active populations; valid CPU/GPU percentiles/tails/bytes and matched outcome/coverage; no unlike-version ranking. | Before performance-based replacement selection; local A/B during implementation | Target hardware/workload choice; optional technical execution |
| V05 Navigation and spatial parity | ARCH-01/ARCH-02/ARCH-07/ARCH-13; WORLD-04–WORLD-06; UX-08 | Existing route/query corpus plus bridges/ford/cave/doors, costs, same-frame moves, stale/cancel and actual locomotion. | Correct outcomes/readiness, preserved preferences/collision, no starvation or movement on unavailable data; qualified IDs. | Before implementation contract; regressions during implementation | Only route/preference policy changes |
| V06 Save races and lifecycle faults | ARCH-04/ARCH-05/ARCH-12; CONTENT-08; UX-06 | Bounded interleaving/fault injection, pending async boot/dispose/load, two same-ID settlements for mount restore. | Current reachable exposure distinguished from audit hypothesis; no stale publication, damaged overwrite, leaked resource or wrong mount; preserved migrations. | Before selection if relying on disputed guarantee; otherwise before/during implementation | Recovery/legacy ambiguity policy |
| V07 Conservation and stale commands | ARCH-08/ARCH-11; GAME-03–GAME-07/GAME-12; CONTENT-01–CONTENT-04; UX-06 | Cancel/death/station loss/capacity/retry; validate basket at fresh revision/time; inject late failure only at selected transaction. | Exact-once committed outputs/cash/reward and preserved identity; no broader rollback claim than tested. | Before selecting donor transaction guarantee; during implementation | Merchant cash and failure behavior choices |
| V08 Food provenance and expiry failures | GAME-04/GAME-07/GAME-11/GAME-12 | Reuse review245 reproductions when depending on V3; V1 buy/store/process/NPC/player eat at aged/species checkpoints. | No rejuvenation/lost provenance; intended NPC safety, variable storage rates, bounded expired rows and commit-time freshness/Save continuity. | Before selecting deadline donor; scoped V1 repair tests before/during implementation | Food/NPC safety semantics |
| V09 Crafting usefulness | GAME-03–GAME-05 | One selected legitimate resource/tool/station→timed output→use/equip/sell route; no debug input as acquisition proof. | Reachable sources/consumers, truthful requirements, cancellation and food inheritance; preserve artisan roles. | Technical chain before selection of broad manufacturing; live check during implementation | Recipes/depth/artisan role |
| V10 Progression and combat truth | GAME-02/GAME-05/GAME-06/GAME-08–GAME-10; UX-02/UX-03 | Existing V1 capability→effect→reload crosswalk; selected equip/fight/ammo/wear/repair/guard scenarios, player/NPC asymmetries explicit. | Preview equals actual effects, one debit/XP credit, no lost Defense/Repair/gear, accepted combat feel; do not assert V3 demo is live. | Product boundary before selection; detailed contract before implementation; loops during implementation | Yes, combat/depth/earned-capability policy |
| V11 Visual preservation and world surfaces | WORLD-01–WORLD-05; VIS-01–VIS-08/VIS-10–VIS-13 | Select reference V1 scenes; paired captures/clips of terrain/banks/water/forest/day-night/wind/weather/snow and posed assets; sample authoritative ground/water. | Author accepted scene differences; placements/coverage/seams/maps/physics coherent; source overrides versus running-clock sequence distinguished. | Reference/product choice before selection; selected A/B before/during implementation | Yes; not every candidate needs all scenes |
| V12 Asset/recording provenance and reproducibility | VIS-04–VIS-06/VIS-10–VIS-12; CONTENT-06/CONTENT-07 | Exact selected blobs/source recipe/credits, rig/clip pose and recording transcript/casting/QC; compare duplicate bytes first. | Distinct useful asset; reproducible or explicitly available inputs; usable rights/attribution and accepted selected poses/clips. | Before selecting/importing exact asset family; technical fit during implementation | Style/cast/language/listening choice |
| V13 Story truth, autonomy and persistence | CONTENT-01–CONTENT-05; ARCH-11; UX-06 | Walk selected branches with real suppliers and normal NPC schedules, before offer, without player, and at save/report cut points. | Site/cast admission, physical versus flag/stub distinction, autonomous-resolution policy, exact-once rewards and durable metadata/no replacement wild target. | Dependency truth before selection; full selected branches during implementation | Yes, narrative tone/scripting/consequences |
| V14 Map knowledge and guidance | CONTENT-09; UX-04/UX-05/UX-09; WORLD-01–WORLD-06 | Projection/known-estimated-hidden markers at negative/far coordinates; overlap/drag/touch/Unicode; actual road/river/crossing route and Save. | No hidden true-coordinate leak, stable targets, notes/reset/reload, useful zoom and acceptable streamed cost. | Guidance policy before selection; cases before/during implementation | Yes, guidance and cartographic revelation |
| V15 Engagement, input and travel safety | UX-06–UX-08; GAME-07; CONTENT-01/CONTENT-02 | Urgency/danger/range, nested trade, typing/repeat/blur, manual stop/mount/arrival and same-tick cancellation; track world/NPC/needs clocks. | Released holds, no stale effects/held-key movement; real danger signal rather than constant false; stated travel/slow-time policy preserved. | Product choices before selection; focused contract before/during implementation | Yes, holds, acceleration and interruption policy |
| V16 Audio truth and resource lifetime | CONTENT-06–CONTENT-08 | Selected listen/QC and long-route decoded PCM/cache churn; active loops, close/load/rebuild and late decode. | Correct captions/profile/trigger, silence/text fallback on missing clips, no orphan context/voice, bounded retained PCM without playback cuts. | Coverage policy before selection; selected QC/budgets before/during implementation | Yes for voice/listening scope |

## 10. Questions for Astra and the author

Six open **research/decision families** are counted here; each can contain product questions and conditional technical checks. They are not six contradictions or six blockers for the dossier. V01–V16 are verification methods, not additional classification issues. R6 F01/F02 have been resolved in this artifact; subjective choices deliberately remain unresolved.

| Issue | Author preference (AP) | Technical research (TR) | Runtime verification (RV) | Implementation-stage specification (IS) |
| --- | --- | --- | --- | --- |
| U01 Workload and benefit | Which desktop/mobile hardware and rich occupied-world journeys define acceptable performance? Which image/detail tradeoffs are negotiable? | Is current cost search storage, cold geometry, skinning/submission, shadow/mirror/post, cache churn or decoded audio? | V04/V05/V16 selected matched fixture; no universal FPS gain inferred. | Per-owner quota, byte accounting and instrumentation policy after evidence. |
| U02 Crafting, progression and combat depth | Which player recipes complement artisans? Should breakage, layered armor, parry/dodge or aim assistance exist? Must earned V1 skills/equipment survive exactly? Is expanded SPECIA/skill vocabulary desirable at all? | Producer→value→effect→reload crosswalk; V3 character owner is inert/live learning incomplete. No agreed full model replacement is a canonical migration opportunity yet. | V09/V10 complete selected loops and actual effective-stat previews. | Recipe learning, training/caps, station access, armor/damage/repair rules only after product scope. |
| U03 World scale and Save compatibility | Preserve exact old worlds/IDs/saves? Preferred settlement distance, encounter density and journey length? Local mountain/bank changes or broader geography? | Generator retention versus explicit migration/refusal; actual saved references and source world-unit differences. | V01/V11/V14 selected world profiles, crossings, sites and maps. | Namespace fingerprints, generator/migration and source/target coordinate contracts; do not select a new world model here. |
| U04 Continuity, determinism and clocks | Which offscreen commitments and fauna individuals must continue? Same-seed world, local repeatability or stronger replay? Keep conversation slow-time? Permit physical autopilot, time acceleration, passenger or instant travel? | Identify affected durable/transient owners, clock units and NPC/cargo handoffs; passenger/instant travel have no demonstrated ready donor. | V02/V03/V06/V15 scenario-specific stream/skip/load/interruption checks. | Checkpoint, cursor, cancellation, ambiguity and recovery policies at selected boundaries. |
| U05 Gameplay/content completeness and correctness | Which narrative themes/tone/humor fit the familiar cast? May problems resolve without player, and how much scripting/holding is acceptable? Catalog merchant purse and NPC food risk policy? | Real quest suppliers/effects, food-transfer defects, fresh trade command/durability and preflight guarantees. Do not mistake curation/plans/demos for working loops. | V07–V10/V13 chosen transactions, story branches and persistence, reusing review245 where relevant. | Selected admission/reward/item/skill/money crosswalk, stale-command policy and exact-once semantics. |
| U06 Visual, voice and guidance acceptance | Which V1 forest/water/night/settlement/mountain scenes define identity? Which new faces/animals/props are preferable? Barks versus exchanges/story voice, Polish versus English/casting? How much map/rumour/autopilot guidance? | Selected asset identity/recipe/rights, actual source activation and incomplete winter/tree/voice coverage; no distinct beneficial replacement for all wetness/lakes/grass established. | V11/V12/V14/V16 paired scenes, actual weather progression, selected poses/listening and map use. | Selected shader/depth/LOD combinations, text/clip QC/fallback, note/input budgets and accessibility/device contracts. |

**Coverage dispositions for areas without another candidate.** Existing V1 clocks/scheduling, autonomous NPC/fauna, economy/transport, gathering/health/survival, lakes, rain/wetness/puddles, grass/flowers, quests/world problems, map/minimap and rendering are covered by preservation, dependencies and targeted opportunities above. R2–R6 do not establish that wholesale donor replacement of these systems supplies a net benefit. Thus no placeholder “port fauna,” “add weather,” “add inventory,” “replace QuestManager” or “replace map” entry is invented. Source hydrology/tarn/breach ideas, broader SPECIA/new skills, crown/shrub snow, general NPC gossip, full curated quest portfolio, pair/player voice coverage, passenger/instant travel and full replay remain unresolved possibilities within U02–U06 where evidence or author intent is insufficient. Their existence as ideas is not maturity or missing-V1 proof.

## 11. Astra executive handoff

**The complete R1–R7 dossier is READY WITH QUALIFICATIONS for collaborative strategy.** Start with the dossier README and this overview; use §3 to scan 62 canonical opportunities, §4 for the exact counterpart/source/maturity/questions, §5–§6 for preservation and compatibility, and §9–§10 for conditional evidence and author choices. Original inventory mapping and duplicate accounting are in §2. R6 remains the independent review; R7 applies its corrections without rewriting R1–R6.

V1 already does particularly valuable interconnected work: stable regional/spatial facts, rich environmental rendering, persistent community identities, selective offscreen travel/provisions, actual production/cargo/source attribution, ecology, provenance-bearing items/food, earned skills/equipment, one quest lifecycle with world consequences and distinct knowledge/map owners. This is source-backed implementation depth, not a current universal gameplay/visual PASS.

Technically promising families include reusable search storage, dependency guards, conservation diagnostics, measured preparation/cache practice, Save serialization/staging, narrow terrain/bank/wind/snow/LOD techniques, item view adapters, map affordances, bounded engagement and audio caching. V2 supplies fuller manufacturing/combat/story precedents. These are possibilities to evaluate, not a recommended first area or a claim all benefits will materialize in V1.

Incomplete/gated donors remain explicit: V3 tree wind is off with failed/inconclusive GPU evidence; environment/material pilots are default-off; full winter coverage is incomplete; gather/craft/eat/needs and related player hosts are gated; richer equipment/character/ammo UI/math does not provide world combat/progression; authored curated quests are not a playable portfolio; the exact voice manifest is inert/unverified. V3 trade **is connected in-session**, but purse/merchant stock are not durable and commit validation concerns remain. Its Far drop/abstract meals/work do not preserve V1 material continuity.

The largest risks are world/Save identity, concrete item/cargo/food ownership, earned capability conversion, clock/detail/engagement semantics, source model/material regressions and story claims unsupported by actual actors/sites/effects. R6's deterministic-geography versus replay, selective versus universal continuity, preflight versus rollback, crafting subloops versus general crafting, authored versus playable content, visual acceptance and non-comparable performance distinctions are carried throughout. Identical asset blobs are not separate improvements.

Ask the author for preservation scenes/journeys, distances/density, Save expectations, offscreen/determinism ambitions, crafting/combat/progression depth, narrative style/cast, voice/language extent and map/travel/slow-time policy. Request only the §9 checks relevant to a consequential claim: matched V1 workload, old-save/reference fixtures, actual ownership/clock transitions, selected complete loops, branch truth and selected visual/listening/provenance acceptance. Six issue families remain open, with no unresolved classification contradiction or initiative-wide coverage gap. Astra is free to choose any starting area and request deeper bounded evidence with the author; no final migration decision, work queue or roadmap is established here.

Evidence navigation: [R1 baseline](./2026-10-25--001--v1-baseline.md#3-system-inventory), [R2 candidates and evidence](./2026-10-25--002--architecture-and-simulation.md#4-potential-improvement-candidates), [R3 candidates and evidence](./2026-10-25--003--world-and-visuals.md#4-improvement-candidate-inventory), [R4 candidates and evidence](./2026-10-25--004--gameplay-systems.md#5-improvement-candidate-inventory), [R5 candidates and evidence](./2026-10-25--005--content-and-player-experience.md#6-improvement-candidate-inventory), [R6 corrections](./2026-10-26--006--cross-report-review.md#3-findings-and-corrections), [R6 risks](./2026-10-26--006--cross-report-review.md#5-cross-domain-risks-and-dependencies), [R6 handoff](./2026-10-26--006--cross-report-review.md#8-astra-handoff).
