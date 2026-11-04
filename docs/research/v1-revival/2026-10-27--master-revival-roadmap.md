# V1 Revival — Master Roadmap (approved decisions and remaining proposals)

**NPC Voices & Dialogue author decisions (2026-10-31):** Six decisions are now approved: fixed per-NPC voice; selective personality variants (initial two-vs-four delegated to Opus); English NPC dialogue with generic quest voice cues and exact displayed details; staged profession/social diversity with more humor; maximum V3 donor voice reuse; moderate event-grounded living-world speech. **Authoritative detailed record:** [Astra NPC voice audit — §12 author decisions](./2026-10-31--npc-voices-dialogue-audit.md#12-author-decisions--approved-2026-10-31-supersedes-open-questions-in-11). These do not approve every recording or assign an immediate implementation slot; schedule through the session queue and normal plan gates.

**Created:** 2026-10-27  
**Created by:** Claude Opus 5.5 (coordinator)  
**Status:** **D1/D3/D4/D9 APPROVED (2026-10-27), D11 APPROVED (2026-10-29)**; all other decisions and detailed mechanisms remain proposals. D4 supersedes gated parallel lanes with **PERFORMANCE-FIRST**. Performance keep/revert choices require scenario-matched evidence; this is not approval of the entire roadmap.  
**Pins:** V1 `c460b224` · V3 `907e17cd` · V2 = V3 `legacy/SeedVales` (`9ba54815`)  
**Method:** five area audits (static source/doc analysis; **no tests, benchmarks or browser runs** in this session), coordinator cross-review and targeted source spot-checks.

Authority: [Strategic Brief — approved Revival decisions](./STRATEGIC-BRIEF.md#approved-revival-decisions-2026-10-27). Original source pins/method above describe the audit; reconciliation checked save v56 at `c0595d1`. No runtime changes, tests, benchmarks or formal plans were made for reconciliation.

**P0 progress update (2026-10-29): OPERATIONALLY COMPLETE — P1 ACTIVE.** Reusable deterministic fixtures, A/B series, native Windows Intel Arc measurements and automated CDP Chrome Trace capture/CPU profiling are available. The author reports a visual check with no issues noticed (2026-10-29; scope/scenes not documented; not a substitute for change-specific verification). The original 2026-10-27 WSL2 A0a/B0/C0 capture remains diagnostic/UNVERIFIED and is **not retrospectively certified**. This is a pragmatic authorization to proceed with P1 using scenario-matched native same-session evidence, **not** a claim that every original formal READY criterion passed. See the [dated baseline evidence update](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md#2026-10-29-evidence-update--p0-operational-closure). P1 remains open; keep/revert conclusions are local to each tested slice.

**Author decision (2026-10-29): P1 now includes D — Trees LOD as a fourth required performance area.** The P1 exit review must cover tree LOD with focused V1 recon, a bounded LOD1-first proposal, relevant native Arc/forest measurements, visual checks and a documented implement/close/defer verdict. This is an approved **scope and gate change**, not automatic approval to integrate LOD1, billboard impostors or a V3 tree renderer. Preserve tree density, height, placement, lifecycle, shadows and V1 simulation authority. Existing A/B/C priorities and evidence are retained; no blanket fresh benchmark series is required. [Tree LOD candidate dossier](./2026-10-28--tree-lod-v1-backlog-candidate.md).

## Geography & exploration — approved direction (2026-11-04; P2 epoch 1)

**Decision source:** [Author's G1–G9](./2026-11-04--geography-exploration-author-decisions-g1-g9.md); [architecture proposal](./2026-11-04--geography-exploration-architecture-proposal.md) remains an implementation candidate, not an approved algorithm. Geography joins the **still-open worldgen epoch 1** (G1); this supersedes earlier implied closure after settlement/road changes alone. Keep Q64 road close-out and fixture re-export **after** macro relief, climate-weighted hydrology and settlement recalibration.

**Approved scope:** coherent north/centre/south regions, **possible inland arid/desert areas** (not a decided extent); climate-driven biomes/runoff/local temperature/rain–snow phase; fewer perennial rivers and dry drainage lines without seasonal streams; connected ranges/massifs/passes and some steep summits; initial natural landforms and waterfalls, later volcanic districts/ruins; V2-style vague NPC rumours with an approximate landmark-containing map area (reuse V1 knowledge ownership). **Always keep large structures separate from large settlements (G9)**, rather than allowing co-location after a performance measurement.

**Gates:** S0 previews/profiles/census (including the author's too-long **left road from the home settlement**); inspect V2 waterfall and rumour-area code and V3 peaks/road passes; compare ~22/~25/~28 settlement variants using travel times and previews **for author selection**; decide G8 heights/shape after measurements. Geographic pipeline: relief/landforms → climate → hydrology → biomes/local weather → settlements → roads → fixtures. Keep deterministic generation, save/epoch/cache contracts, visual and performance checks.

### Geography program — staged plans (Opus, 2026-11-04)

Runtime work within these plans is inside approved Revival scope (G1–G9, epoch 1); each plan's author gates (G5 selection, G8 profile, look reviews) still stop the work until answered. Task rows: [queue Q111–Q130](./AUTONOMOUS-SESSION-QUEUE.md#1-queue).

| Stage | Plan | Content | Author gate before the next stage |
| --- | --- | --- | --- |
| **S0** | [tools-026](../../plans/tools-026-geography-baseline-diagnostics.md) | River/relief/route censuses incl. the left-road route, preview layers, preview-only threshold variants, V2/V3 donor recon, baseline packet | baseline + targets confirmed; **G8 height/shape** answer |
| **S1** | Q109 (Sonnet, in flight) | Catalog lakes = real inland water (prerequisite of S7 and of any later `locations-coarse` bump) | — |
| **S2** | [world-terrain-060](../../plans/world-terrain-060-macro-relief-ranges-passes-and-landforms.md) | Range spines + passes, summit profile, landform descriptors, P1 landforms (crags, spine summits, lakes with islands, craters) | 7-seed previews (look → §2) |
| **S3–S4** | [world-terrain-061](../../plans/world-terrain-061-macroclimate-and-climate-weighted-hydrology.md) | Static macroclimate → climate-weighted runoff, area thresholds, perennial vs dry drainage, map hierarchy | **regional look on climate previews** (C2) |
| **S5** | [world-terrain-062](../../plans/world-terrain-062-regional-biomes-and-local-precipitation-phase.md) | (T,P) biomes incl. possible inland arid areas, borders (absorbs Q70), local temperature + rain/snow phase | arid extent + browser spots |
| **S5′** | [world-terrain-064](../../plans/world-terrain-064-derived-waterfalls.md) | Derived waterfalls (after V2 donor verdict) | look (§2) |
| **S6** | [world-terrain-063](../../plans/world-terrain-063-geography-driven-settlement-variants.md) | Suitability + 22/25/28 × spacing × weighting matrix → **author picks 1 of 2–3** → implement | **G5 selection** |
| **S7** | [world-041](../../plans/world-041-landmark-catalog-and-rumour-leads.md) | Landmarks in the catalog, names on discovery, V2-style rumour leads (Astra text) | line script approval |
| **Close-out** | Q44 R5–R8 (Q61–Q64) + Q110 | Road retry on final geography, single fixture re-export, WSL A/B (boot, `stream`, `settlement-heavy`), Windows via §4, **epoch-batch close proposal** | epoch close (G1) |
| later | (no plan yet) | G6 P2: volcanic district, castle/large ruins with per-site budgets, **always separate from large settlements** (G9); Q92 river polish | separate planning |

```text
S0  tools-026 D1–D4 (S) ∥ D5 donors (O) ──► D6 baseline ──► author: G8 profile + targets
S2  060 R0 (after D2, no output change) ──► R1–R2 (after G8) ──► R3–R4
S3  061 C1 (after R0, previews only) ──► C2 (after R2; author look) ──► H1–H2 (after R4) ──► H3–H6
S5  062 W1–W2 (after C1) · 062 B1–B3 (after H6) · 064 waterfalls (after H6 + D5)
S6  063 V0 (after D3) · V1–V3 (after H6, B1 preferred) ──► author G5 ──► V4
    ──► Q61 → Q62 → Q63 → Q64 (single fixture re-export) → WSL A/B → Windows §4 → epoch-close proposal
S7  Q109 + D5 ──► world-041 L0 ──► L3 (parallel to S3–S6) · L1–L2 after 060 R3 (+064) ──► L4 Astra text ──► L5
```

Parallel lanes: S0 D1–D4 (Sonnet) ∥ D5 (Opus) ∥ Q109; 060 R0 and 061 C1 change no output and may start early; 063 V0 and world-041 L0/L3 do not wait for the final geography. Worldgen-output slices (060 R1–R4, 061 C2–H6, 062 B1, 063 V4) land **sequentially** so each re-census attributes its change; caches are bumped per namespace in the slice that changes them, the fixture is re-exported once in Q64. Q109 owns `worldLocationCatalog.ts` / `locationsCoarseCache.ts` until it lands.

## 0. Inputs (area reports)

| Area | Report | Relation to existing owner |
| --- | --- | --- |
| Equipment, armor & combat | [revival-audit — equipment/armor/combat](./2026-10-27--revival-audit--equipment-armor-combat.md) | Extends [equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md) and catalogue recon/notes |
| NPC / fauna rendering (A) | [revival-audit — NPC/fauna rendering](./2026-10-27--revival-audit--npc-fauna-rendering.md) | Delta + corrections to [transfer recon §10](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27) |
| Settlement rendering (B) | [revival-audit — settlement rendering (delta)](./2026-10-27--revival-audit--settlement-rendering.md) | Short delta to [§11](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27) |
| Grass / flowers (C) | [revival-audit — grass/flowers V3](./2026-10-27--revival-audit--grass-flowers-v3.md) | Delta + re-recommendation vs [§12](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#12-track-c-deep-recon--v1-grassflower-renderer-adaptation-2026-10-27) |
| Strategy & architecture | [revival-audit — strategy/architecture](./2026-10-27--revival-audit--strategy-architecture.md) | Builds on [Strategic Brief](./STRATEGIC-BRIEF.md), [R7](./2026-10-26--007--unified-candidate-matrix.md), [three-track roadmap](./2026-10-27--performance-three-track-roadmap.md) |

Benchmark evidence used: only diagnostic smoke [032](../../performance/results/2026-10-27--032--benchmark-settlement-heavy.md). **Caveats verified by cross-review:** captured at `e124e866`, *before* the runbook's minimum instrument SHA `94a74470`; one 15 s rep; the 83 ms/frame NPC CPU figure is dominated by a single unattributed 8.49 s frame (≈5.8 ms/frame without it). It is a ranking hint, never a target or a gain claim.

## 1. Cross-review: key verified facts

Spot-checked by the coordinator in current source:

- [code] Incoming combat damage exists only **fauna → player/NPC** (`gameLoop.ts:2982` is the sole `applyIncomingCombatDamage` caller). Armor = fixed per-piece share in `equipment.ts:composeEquipmentModifiers`; no body areas, layers or damage types. Player and NPCs share the rule, but NPCs practically own no armor.
- [code] The transferred V3 catalogue (`src/items/v3Equipment/*`) has **no production consumers** — inert data + adapter.
- [code] `CURRENT_SAVE_VERSION = 56`; saves carry no worldgen version/epoch.
- [code] NPC head/hair/skirt meshes are uncullable (`assembleCharacter.ts:73 frustumCulled = false`); bodies and fauna already use native skinned culling (corrects §10).
- [code] Foliage instanced sway is disabled by a `TEMP` isolation hack (`world/foliageWind.ts`); grass, foliage, water and clouds each own separate wind/time.
- [code] Trade Stage F is implemented (`93cf64ef`, `ui-input-044` = `verification needed`); docs still describing it as "next" are stale.
- [measured-diagnostic, 032] Isolation: hiding NPC+fauna −9.8 ms render (≈507 draws) vs hiding settlements −3.3 ms (≈887 draws); hiding grass ≈0 in that settlement scene. Census over-counts observed main-pass settlement (1520 vs 511) and grass (1.21M vs 0.32M tris) — **use the pass collector, not the census**.

## 2. Resolved contradictions and cross-area conflicts

| # | Conflict | Reconciled direction (remaining mechanisms are proposals) |
| --- | --- | --- |
| X1 | Equipment (E2) and worldgen/spacing both need a save bump; `items-player-044` assumed no bump but `isPlayerEquipmentField` rejects unknown slot keys. | **D1 approved direction:** prepare future `persistence-008`, current proposal v57, with separate save-format/worldgen versioning and understandable pre-Revival refusal; compatible new saves must load correctly. No formal plan or implementation now. Implementation follows P1; later schema changes bump normally, without forcing another worldgen epoch. |
| X2 | Track C porting V3 grass would add a 5th independent wind. | V1-side CA1/CA2 do not depend on shared wind. A future CB prototype must resolve wind ownership without importing unrelated atmosphere implementation into P1; broad wind/water work is deferred. |
| X3 | Mirror pass (≈339 calls) is claimed by water atmosphere, settlements (B1a) and actors (0 actor mirror draws already). | One **reflection policy decision** under existing `world-terrain-015`, still open (D8/D13), informed by B0. A bounded B optimization may proceed only after its required decision; broad water work waits until after P1. Settlement B1a is an implementation of that policy, not a separate one. |
| X4 | Armor visuals multiply actor draws/skeletons (each slot ≥1 draw + skeleton, uncullable on NPC rebind path). | Armor **appearance** waits for the Track A actor visual contract (shared skeleton, merge key, shared bounds). The brief still permits mechanics + UI before appearance, but performance-affecting mechanics integration also waits until after P1. |
| X5 | §10 lists native skinned culling as new / A0a as first Composer task. | Superseded: bodies/fauna already cull natively; A0a tooling shipped (P0). Next A candidate = A1′ inflated sphere incl. head/hair after certified capture and applicable approval. |
| X6 | `grass-finalization.md` ("no pooling by default") vs mandatory Track C. | Track C stays mandatory as a *goal*; mechanism = V1-side memory/upload trims first, pooling (CA6) and V3 backend (CB) only on C0 evidence. |
| X7 | `docs/state/combat.md` claims player→NPC/NPC→NPC damage go through the shared hook. | Doc is wrong vs code; fix in doc-hygiene packet. |
| X8 | Brief §3/§5, readiness review and dossier README describe UI at A–C / Trade "next". | Dated status note in the brief + README correction (done in this commit for README/brief pointer). |

## 3. Dependency graph

```mermaid
graph TD
  REF[Stable reference build and unrelated integrations paused] --> BASE[P0 operational reference and comparable A/B evidence]
  BASE --> A[Track A approved slices]
  BASE --> B[Track B approved slices]
  BASE --> C[C0 then CA1 then CA2 then evaluate]
  D9[D9 V1-first direction] --> C
  C -. evidence and separate scope decision .-> CB[Conditional V3 backend candidate]
  DEC[Open area decisions including D8/D10/D13] -. only affected mechanisms .-> A
  DEC -. only affected mechanisms .-> B
  A --> FINAL[Technical and visual verification plus final combined assessment]
  B --> FINAL
  C --> FINAL
  FINAL --> EXIT[P1 scope completed or explicitly closed - freeze ends]
  EXIT --> SAVE[Implement separate save and worldgen compatibility policy]
  D1[D1 future persistence-008 planning] --> SAVE
  SAVE --> EPOCH[One coordinated incompatible Revival worldgen epoch]
  D3[D3 batching strategy] --> EPOCH
  EPOCH --> SPACE[Spacing and routes if selected]
  EPOCH --> CEM[Procedural cemetery changes if selected]
  SPACE --> STORIES[Placement-dependent dog and elder content]
  EXIT --> ARM[Armor mechanics after open rules are resolved]
  ARM --> EUI[Truthful equipment UI then appearance]
  A --> LOOK[Actor appearance contract proposal]
  LOOK --> EUI
  EXIT --> ATM[Unrelated atmosphere and rendering]
  EXIT --> OTHER[Other Revival runtime integrations]
```

D3 batches **incompatible generation**, not every Revival change. D2 mappings are not selected or forced into the epoch. Compatible fixes need no epoch dependency, but must respect D4 workload isolation. Optional CB and other unapproved ideas are not mandatory freeze-exit dependencies. Detailed post-P1 ordering below remains proposed.

## 4. Strategy — Performance-First

**Closed 2026-10-30 (author):** P1 is closed and the integration freeze below is lifted — visual state accepted, no further closure benchmarks, the `settlement-heavy` FPS gap deferred; see [Strategic Brief](./STRATEGIC-BRIEF.md) and the [P1 exit packet](./2026-10-30--p1-exit-packet.md). The text below is kept as the record of the freeze rules.

**D4 APPROVED, 2026-10-27:** complete A (NPC/fauna rendering), B (settlement rendering/draw submissions), and C (grass/flowers optimization) before integrating unrelated changes that can materially affect performance. This replaces the earlier **gated-parallel-lanes recommendation**. Disjoint files/owners do not establish benchmark isolation; parallel implementation is not the preferred strategy or an objective.

### Integration freeze

Pause unrelated integrations into the **benchmarked V1 branch/codebase** during the A/B/C phase if they may materially change:

- CPU simulation workload; GPU cost; scene complexity or draw calls.
- NPC/fauna counts, model complexity, animation; settlement generation/population.
- Terrain/vegetation density; shaders, lighting, shadows or water reflections.
- World streaming/cache behavior; asset loading, memory allocation or startup.
- Benchmark scenario comparability.

Defer new NPC models/equipment visuals, worldgen/spacing, new weather/wind/cloud/water rendering, broad combat/equipment integration touching active simulation, and other such Revival runtime changes. Existing delivered work is retained; earlier research/plans are **deferred, not cancelled**.

Documentation, research/reconnaissance, architecture analysis, formal planning, unit tests, non-runtime development tooling, inactive data/assets and isolated UI demos may proceed **only when they do not affect bundling, loading, execution or benchmark behavior**. Demos must not start or modify the living world. Separate branches may prepare other work, but performance-affecting changes must wait to merge until exit.

**Original entry policy (2026-10-27):** stable reference build plus a certified baseline covering applicable A/B/C scenarios, with unrelated performance-affecting integrations paused. **2026-10-29 operational reconciliation:** P1 already proceeds on native Arc same-session comparisons; old diagnostic/UNVERIFIED captures do not become certified, and each optimization still requires adequate matched evidence. This is a pragmatic P0 closure, not retroactive satisfaction of every old READY item; see [readiness audit](../../performance/audits/2026-10-27--three-track-benchmark-diagnostics-readiness.md) and [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md).

**Exit:** the approved A/B/C/D scope is completed or explicitly closed; accepted changes have appropriate technical and visual verification; the final combined performance result is documented. Record closure/deferment of optional candidates explicitly. An open optional optimization, including V3 CB, must not keep the freeze alive indefinitely. Other Revival implementation then resumes with scope-appropriate verification.

**Necessary exceptions:** critical correctness, security or blocking fixes only. For each, record why it cannot wait, whether benchmark workload changes, the affected commit, and whether a targeted measurement is genuinely required. Do not automatically rerun the full suite. Benchmark comparability, not file ownership or SHA equality alone, controls reuse (§10).

## 5. Phases

Only the Performance-First order and D1/D3/D9/D11 direction are approved. Current P1 progress: [tracker snapshot](./2026-10-27--performance-three-track-roadmap.md#p1-status-snapshot-2026-10-29); work order: [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md). Detailed candidate slices and post-performance phases remain proposals subject to their owning plans/decisions.

| Phase | Content | Entry | Exit / completion evidence |
| --- | --- | --- | --- |
| **P0 — Stable reference and baseline** | **Operationally complete (2026-10-29)** for ongoing P1: fixtures, native Arc benchmark series, A/B workflow, trace capture and reports exist. Original WSL2 baseline remains diagnostic; consult dated evidence update. | Baseline preparation; readiness/runbook quality gates | Practical P1 measurement workflow established; formal legacy A0a/B0/C0 READY certification **not claimed**. For each P1 decision require matched, reliable evidence and record gaps. |
| **P1 — A/B/C/D(/E) performance implementation — CLOSED 2026-10-30** | A: proposed cull bounds A1′/A2′, attribution/cadence and spawn-churn slices; A5′ far detail remains gated by D10; A7 merge follows approved D11 (first body-only experiment negative). B: leading-family submission work; B1a reflection trims require D8/D13, not a broad water rewrite. C: **C0 → CA1 useful filler radius → CA2 generation/storage cap → evaluate**, then CB only if evidence warrants further architecture. D: **Trees LOD** — bounded recon and decision, LOD1-first with billboard only conditionally; record measured/visual keep-revert or explicit deferment. | P0 operationally complete; use adequate matched native Arc evidence per slice (do not assume old baseline certified); applicable approvals and unresolved decisions for affected slices | Appropriate technical/visual checks, documented keep/revert evidence and **final combined assessment**; approved scope completed or explicitly closed. End freeze; optional candidates do not prolong it. |
| **P2 — Save policy and coordinated worldgen epoch — CURRENT (from 2026-10-30)** | Future `persistence-008` policy (v57 proposal) before incompatible generator integration; coordinate spacing/routes and procedural cemeteries as applicable in one epoch. Only selected features enter it; D2 mappings stay open. Target only affected worldgen cache namespaces. | **P1 exit**, D1/D3 direction; future plan/scope approval, D2 only if a name change is included | Understandable incompatible-save refusal, compatible-new-save round-trip; one coordinated new-game boundary; coherent routes/transport/IDs and generation checks per future plan |
| **P3 — Atmosphere (deferred proposal)** | Shared wind design; **fog sprite anchoring/motion correction** (IMP-001, inspect V1 and V3 first); **streams/rivers**: channel shape and width, bank/bed coloration, riparian vegetation and irregular banks in plan and elevation; cautious, performance-bounded water appearance work (lakes/rivers retain distinct character); softer grass/billboard flowers and moon/stars as scoped. Delivered clouds retained. Changing shaders/geometry/flowers is not implicitly part of CA1/CA2. | **P1 exit** for performance-affecting runtime integration; targeted V1/V3 fog recon and water/terrain ownership and save/worldgen impact checks; applicable design approvals | Author scene review across movement, distances and weather; verify stream/river geometry, bank vegetation, transitions, gameplay depth/physics and representative performance; no inferred reflection/tree-wind approval |
| **P4 — Armor mechanics, equipment UI/content/appearance (deferred proposal)** | Future hit/slot/layer work → truthful UI → balance/acquisition → appearance under actor contract. No simultaneous runtime armor lane. | **P1 exit**; D5/D6 and other applicable rules/content decisions; save policy for persisted changes | Displayed effects = applied effects, player/NPC parity, compatible-save round-trip; guard kits D7 remain open |
| **P5 — Living-world content (deferred proposal)** | Voices stage 1, unowned rescue dog/treasure, elder/sword; later roaming groups retained. Asset loading/runtime integration waits; inert preparation may continue per §4. | **P1 exit**; topology for placement-dependent stories; D12 plan split remains open | Real actors/items/effects, durable state, no duplicated rewards |
| **P6 — Remaining UI/models (deferred proposal)** | Map/menu consultation and selective model replacement, including **NPC & player character visuals** per the [author's character art-direction record](./2026-10-27--npc-character-art-direction.md): named NPC appearance, V1 hand-edited Blender vs V3 kit, body/age variants, hair/beard, skirts/aprons and animation fit. Coordinate dynamic modular armor looks with P4 and the Track A actor visual contract; do not duplicate P4 mechanics here. Isolated UI demos may continue during P1 under §4. Conditional CB remains a candidate, not a mandatory later migration. | **P1 exit** for performance-affecting integration; owning scope/author choices; coordinate P4/Track A interfaces | Verification per owning plan |

### P4 technical design proposal (2026-11-04)

[Combat & Armor Redesign — proposal and Claude Opus handoff](./2026-11-04--combat-armor-redesign-proposal.md) specifies seven slots, two layers, anatomical cut/pierce/blunt protection, shared player/NPC resolution, ordinary armor acquisition, truthful UI, save migrations and stages S0–S8. Read it before formal P4 planning. It reconciles current V1 source with the older audit and identifies corrections needed in items-player-044; it does not overwrite existing plans, approve D5/D6/D7, activate A6 layers, or change A7's inventory-only shields. Author decisions remain with their existing records.

### P6 author scope/status clarification (2026-10-29)

- **P6-B — Minimap & World Map:** author is implementing separately **now**, as an explicit sequencing exception to the Revival roadmap. Track progress through the [map rendering recon](./2026-10-29--minimap-world-map-rendering-recon.md) and its actual implementation owners; do not restart its planning or make this side-work a duplicate P6 implementation dependency. This records the author-reported exception, not independent confirmation of completion.
- **P6-C — Character Models:** **partially delivered (author report)**. The author reports verification of the Blender `.blend` file and Python scripts, export of several models and female skirt work. Further model/outfit work remains; exact coverage and verification must come from the current model plans, notes and code/artifacts, not this high-level report.
- **P6-E — Animation Fit:** some work reportedly completed alongside skirts and the blacksmith apron; completeness is **unverified**. Remaining visual animation-fit evaluation/adjustment requires **author participation** and may be deferred. It must **not block P6 exit** if explicitly tracked as an author-dependent optional follow-up.
- **P6 exit interpretation:** finish or explicitly close selected remaining UI/model scope with owner-plan evidence, avoid redoing finished work, and list author-dependent Blender/animation polish separately. Independent P6 work must not be blocked by the map side-work or optional animation-fit work. Performance-First boundaries remain in force for unrelated runtime merges.

**Character-model handoff (author direction, 2026-10-27):** [NPC Character Art Direction](./2026-10-27--npc-character-art-direction.md) is the consolidated record of author decisions, verified static runtime/asset reconnaissance, and open visual-equipment questions. **Claude Opus owns detailed technical reconciliation, phase boundaries, planning and staged handoffs** when this work becomes eligible. The linked research is not an implementation plan and does not pre-approve a full outfit/armor-composition strategy, new performance workload, or post-P1 ordering. D4 Performance-First remains unchanged.

### P3 author clarification — fog and waterways (2026-10-29)

**Approved product scope / priorities, not a technical implementation plan:**

- **Fog defect:** [IMP-001](../../issues/INBOX.md#imp-001--fog-sprites-follow-player-movement) reports fog sprite/clumps apparently fleeing or drifting with player/camera movement. Compare actual V1 placement/anchoring and updates with V3 first; distinguish intentional camera-relative atmospheric effects from world-space fog and fix the observed defect without automatically transplanting V3's full atmosphere system.
- **Water priority:** water appearance matters, but is **not critical** and must not create a substantial performance regression. Do not imitate V3's reported flat, overly blue water. Prioritize convincing **stream/river channel width and shape**, irregular shoreline in **horizontal and vertical geometry**, bank and riverbed colors, and appropriate distribution of riparian vegetation. Preserve different lake/river appearance and interactions.
- **Cross-phase dependency:** if changes to channel/shore geometry alter deterministic world generation or persisted world topology, coordinate their compatibility/versioning with **P2's selected worldgen epoch** rather than silently introducing another incompatible epoch. This is a dependency check, **not authorization to expand P2's agreed scope**; otherwise keep implementation in P3.
- **Verification:** moving-camera/playback visual review of fog; representative stream/river/lake scenes, banks, crossings and swimming/depth consistency (see [IMP-003](../../issues/INBOX.md#imp-003--swimming-in-visually-shallow-streams)), plus performance checks before retaining expensive water/reflection/shader effects.

This clarifies P3 scope only. It does not override D4 Performance-First or approve a wholesale renderer/worldgen replacement.

### Cave polish — post-P1 candidate (author request, 2026-10-29)

Include a focused **V1 cave polish** work item in later Revival planning, especially **entrance geometry, terrain blending/masking, entrance-to-interior transitions and interior presentation**. Address the reported distant-view defect where cave geometry is culled/not rendered but an exposed bright/white hole remains in the terrain (LOD/visibility continuity). Compare actual V1 and V3 cave implementations before selecting improvements; preserve V1 cave gameplay and world-generation ownership. **Claude Opus owns detailed recon, scope, phase/dependency placement and implementation planning.** This is a roadmap candidate, not an approved implementation plan or exception to the P1 Performance-First freeze.

## 6. Shared acceptance rules

- **Performance keep rule (still a proposal):** improvement beyond max(2× rep spread, 5 %) in the relevant decision metric (observed family/pass calls/tris, render p50/p95, frame p95/p99), matched workload/device/configuration with both SHAs recorded, `reliability=observed`, and appropriate author visual review. This threshold and area-specific choices are not approved by D4. Memory/upload-only stages are not reported as FPS gains.
- **Simulation:** no camera-dependent simulation; preserve identity, ownership, offscreen continuity and save/load.
- **Grass:** preserve deterministic V1 world/terrain/simulation, coverage/richness, current fog/visibility, olive palette, intended softer blades and decorative billboard flowers. D9 does not approve density reduction or all appearance mechanisms.
- **Gameplay after P1:** displayed equipment effect = applied effect; player/NPC parity and compatible-new-save round-trips.
- **Verification vocabulary:** Implemented / Technically verified / Browser-manual verified remain distinct (CLAUDE.md). Focused regression tests normally support implementation; performance runs follow §10, not every stage.

## 7. First concrete steps (small, ordered)

These are roadmap handoffs, not actions authorized by this documentation reconciliation.

| # | Step | Owner | Gate |
| --- | --- | --- | --- |
| 1 | Pause unrelated workload-affecting merges; select stable reference; certify shared A0a/B0 and applicable C0, preserve SHA/device/config/workload/raw and human reports | three-track roadmap / Arc runbook | READY/STOP; reuse any already certified comparable evidence |
| 2 | Agree bounded A/B/C implementation scope and remaining area-specific gates using existing audits/plans; do not approve D8/D10/D13 by implication | owning plans / author | P0 operational evidence plus applicable decisions; capture targeted missing evidence where necessary |
| 3 | Deliver approved A slices and leading-family B work; for C deliver CA1 then CA2 after C0. Use focused tests/review and independent reversible commits | world-terrain-050 / npc-063 / settlements-019 / grass owner | meaningful keep/revert questions measured per §10; no stage-by-stage full-suite requirement |
| 4 | Evaluate CA1/CA2. Consider V3 tiled backend only if evidence warrants a further architecture decision | Track C | preserve coverage and world identity; no automatic CB commitment |
| 5 | Document final combined A/B/C/D result and technical/visual verification; close or defer optional scope explicitly and end freeze | performance owners / author review | §4 exit criteria |
| 6 | Resume other Revival runtime implementation under its decisions/plans: save policy before incompatible epoch; armor and atmosphere after P1 | owning plans | no formal `persistence-008` or armor plan created here; open decisions remain open |

Documentation/planning (including future persistence policy preparation), isolated demos and non-runtime tooling may continue meanwhile under §4. They are not a preferred parallel implementation lane.

## 8. Agent allocation

Allocation remains a proposal; additional agents/parallelism are optional.

- **Autonomous Opus/Sonnet sessions (author, 2026-10-29):** may implement directly on `main` within approved scope and D4; ordering, gates and author-run Arc A/B handoff in the [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md).
- **Cursor (Composer):** approved, file-bounded A/B/C slices with existing owners, focused tests and review. No runtime armor E1–E3, voices wiring, worldgen or atmosphere integration during P1 unless a necessary §4 exception applies.
- **GPT Astra:** technical review, baseline certification/comparability review, decision-ledger upkeep; no repeated broad research or automatic benchmarks after every slice.
- **Claude Opus:** cross-system planning/architecture and lifecycle review; persistence/worldgen policy, future armor/wind/appearance contracts may be prepared within §4. Their runtime integrations follow P1. No formal plan creation is part of this reconciliation.

## 9. Decision register

Authority: [dated author record](./STRATEGIC-BRIEF.md#approved-revival-decisions-2026-10-27). “Yes” in the original recommendation column was advice, never approval.

| ID | Decision / direction | Status |
| --- | --- | --- |
| D1 | Separate save format and worldgen compatibility; prepare future persistence-008, v57 current proposal (code v56); clear pre-Revival refusal and correct compatible new-save loading | **APPROVED** — planning/documentation, no immediate implementation |
| D2 | Proposed Anna→Ann, Piotr→Peter, Kasia→Kate, Marek→Mark mappings | **OPEN / UNAPPROVED** |
| D3 | One coordinated incompatible Revival worldgen epoch; not blanket feature approval | **APPROVED** |
| D4 | **PERFORMANCE-FIRST** and controlled integration freeze (§4), replacing gated parallel lanes | **APPROVED** |
| D5 | Per-hit body-area model, weights, protection rules | **OPEN / UNAPPROVED** |
| D6 | Body-only protection rebalance | **OPEN / UNAPPROVED** |
| D7 | Guard armor kits | **OPEN / UNAPPROVED** |
| D8 | Reflection policy: keep / lower cadence / omit detail / sky tint | **OPEN / UNAPPROVED**, informed by baseline |
| D9 | C0 → CA1 → CA2 → evaluate; V3 tiled backend conditional | **APPROVED** |
| D10 | Actor far-detail eye/eyebrow appearance | **OPEN / UNAPPROVED** |
| D11 | Outfit merge/material direction: MeshStandard / Lambert / no merge | **APPROVED (2026-10-29) — V1-first** `MeshStandardMaterial`, selective compatible merges only; first Peasant body-only experiment measured negative and not merged (see brief) |
| D12 | Rescue-dog plan 058 split | **OPEN / UNAPPROVED**; prior unowned-dog product decision retained |
| D13 | Small settlement details omitted from reflections | **OPEN / UNAPPROVED** |
| D14 | Tree wind | **OPEN / UNAPPROVED** |

Area-specific secondary decisions (blade implementation, herb variant, flower replacement/density, footprint mask, armor coverage/content and other audit §7 questions) remain open except the explicit D9 preservation/sequence direction. Audit-local D numbers are not this master register.

## 10. Benchmark policy and intake

- Establish **one certified reference baseline set** for the applicable A0a/B0/C0 scenarios. Preserve commit SHA, device/browser, configuration, scene/workload/populations/camera/phase, raw evidence and reports. Reuse it while relevant runtime behavior and workload remain comparable.
- A changed SHA does **not** itself invalidate a baseline. Record both revisions and relevant runtime/workload differences; do not claim gains across incomparable versions or configurations.
- Do not benchmark automatically after every commit or small stage. Prefer focused unit/regression checks. Measure when evidence is needed to decide whether a meaningful optimization should be kept.
- Where practical, assess several independently reversible changes in one measurement session. Keep commits reviewable; if combined results regress, use targeted diagnostics to isolate the cause.
- For necessary exceptions, apply §4's record and decide whether targeted measurement is needed; do not reflexively rerun the full suite.
- Perform and document a **final combined performance assessment before freeze exit**. After exit, new work gets verification appropriate to its own scope.
- This policy controls **when** to measure. Executed runs still satisfy the existing [readiness audit](../../performance/audits/2026-10-27--three-track-benchmark-diagnostics-readiness.md) and [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md) quality/READY/STOP requirements; no reduced rep counts, missing metadata or uncertified substitutions.

Link appropriate comparable native Arc A/B artifacts and metadata in the A/B/C audits' **Baseline results slots** (§6); label diagnostic results accurately and resolve only the affected candidate decisions. Diagnostic 032 and 033–051 remain diagnostic, not certified acceptance. Reorder A/B/C candidates only if evidence warrants; do not reopen strategic D1/D3/D4/D9 decisions.
