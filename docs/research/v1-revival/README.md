# Seedvale V1 Revival — Research Dossier

**Created at:** 2026-10-25 by ChatGPT GPT-6 · **Index slimmed:** 2026-10-30 (queue Q12)

> **Start here:** [Strategic Brief](./STRATEGIC-BRIEF.md) (approved decisions, D4 freeze, autonomy) → [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md) (ordered tasks, gates, author-owned checks) → [P1 tracker snapshot](./2026-10-27--performance-three-track-roadmap.md#p1-status-snapshot-2026-10-29). Everything below is a topic index of research evidence; where it conflicts with the brief, the brief wins. Closed hand-off stubs live in [archive/](./archive/) (`NEXT-SESSION--*`).

**Q47 cemetery placement decision (author, 2026-10-31):** [Q39 plan §7](./2026-10-31--q39-cemetery-size-placement-plan.md#7-author-decision--2026-10-31-q47-placement-sequence) — compact plot visual trial first; later reserve plot footprints before roads (Q38/Q44). Author visual review of the compact look: OK (2026-11-03); plot reservation landed in Q58; track the rest in [queue](./AUTONOMOUS-SESSION-QUEUE.md).

**Vegetation visual polish (author, 2026-11-02):** [world-terrain-057 — natural bush replacement and berry variant](../../plans/world-terrain-057-natural-bush-model-replacement.md) stages three queued GLBs, removes five artificial V1 bushes from active rendering, and prefers a Blender-authored berry variant. Planned, not yet implemented or visually verified.

**UI palette audit:** [Vue color coverage — 98-file register and agent handoff](./2026-11-02--ui-vue-color-coverage-audit.md) (preliminary; finish per-file color checks before any CSS-only changes).

## Current entry points

| Need | Read |
| --- | --- |
| Decisions (D1/D3/D4/D9/D11 approved; rest open) | [Strategic Brief](./STRATEGIC-BRIEF.md#approved-revival-decisions-2026-10-27), [Master Revival Roadmap](./2026-10-27--master-revival-roadmap.md) (phases, dependencies, first steps; proposals other than approved D-items are unapproved) |
| What to work on next | [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md) (done rows / answered questions: [archive](./AUTONOMOUS-SESSION-QUEUE--archive.md)) |
| Latest readiness / review snapshots (dated, not backlogs) | [Opus readiness review](./2026-10-26--opus-readiness-review.md), [Astra technical review — Cursor models, snow, UI A–C](../../reviews/2026-10-26--026--v1-revival-cursor-technical-review.md), [documentation & backlog audit](./2026-10-26--documentation-backlog-audit.md) |
| Strategy audits (delta) | [strategy/architecture](./2026-10-27--revival-audit--strategy-architecture.md), [equipment/armor/combat](./2026-10-27--revival-audit--equipment-armor-combat.md), [NPC/fauna rendering](./2026-10-27--revival-audit--npc-fauna-rendering.md), [settlement rendering](./2026-10-27--revival-audit--settlement-rendering.md), [grass/flowers V3](./2026-10-27--revival-audit--grass-flowers-v3.md) |

## Performance (P1, D4)

- Roadmap and A/B/C/D(/E) tracker: [three-track rendering roadmap](./2026-10-27--performance-three-track-roadmap.md); V2/V3 transfer candidates: [recon](./2026-10-26--v1-performance-transfer-v2-v3-recon.md).
- NPC/fauna (Track A): [NPC rendering recon](./2026-10-29--npc-rendering-optimization-recon.md), [negative-experiments review](./2026-10-29--performance-negative-experiments-review.md) (request: [opus review](./2026-10-29--performance-negative-experiments-opus-review.md)), [actor skeleton sharing (Q20)](./2026-10-30--q20-actor-skeleton-sharing--implementation-notes.md), [visibility / occlusion analysis](./2026-10-30--npc-fauna-visibility-v2-analysis.md) (V2 sensory contacts vs V1 culling; research only).
- Settlements (Track B): [next optimization shortlist](./2026-10-28--settlement-track-b-next-optimization.md), [house chest instancing (Q5)](./2026-10-29--q5-house-chest-instancing--implementation-notes.md), [lantern GLBs rebuilt in Blender](./2026-10-28--settlement-lantern-blender-optimization.md) (wall / standing, 3 primitives each).
- Grass/flowers (Track C): [CA1 filler gating](./2026-10-28--ca1-filler-gating--implementation-notes.md), [CA2 main-LOD cap](./2026-10-29--ca2-grass-main-cap--implementation-notes.md).
- Trees (Track D, closed "measured, not needed"): [tree LOD candidate](./2026-10-28--tree-lod-v1-backlog-candidate.md), [tree LOD recon](./2026-10-29--tree-lod-recon.md).
- Measurement results: `docs/performance/results/`; boot times: `docs/performance/boot-times.md`.

## UI

- Migration: [research](./2026-10-26--ui-migration-research.md), [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md), [draft stages](./2026-10-26--ui-migration-draft-stages.md), [UI/equipment V1 vs V3](./2026-10-26--ui-equipment-v1-v3-comparison.md).
- Stages: [A item details](./2026-10-26--stage-a-item-details-ui-proposal.md) · [B inventory/equipment](./2026-10-26--stage-b-inventory-list-equipment-ui-proposal.md) · [C quick actions](./2026-10-26--stage-c-quick-actions-ui-proposal.md) · [D character/skills](./2026-10-26--stage-d-character-skills-ui-proposal.md) · [E HUD](./2026-10-26--stage-e-hud-ui-proposal.md) · [F trade](./2026-10-27--stage-f-trade-ui-proposal.md). A–E have author visual PASS; Trade (`ui-input-044`) and the map raster await author verification (queue §2).
- Inventory hybrid (D2(c)/D5): [three-panel contract](./2026-10-27--inventory-hybrid-three-panel-contract.md), [Cursor prompt](./2026-10-27--inventory-hybrid-cursor-handoff.md), [implementation handoff](./2026-10-27--inventory-hybrid-implementation-handoff.md). Author decisions of 2026-10-27 supersede D2(a) and the old two-column / nested-modal contract.
- Minimap / world map: [rendering recon](./2026-10-29--minimap-world-map-rendering-recon.md) — both views share terrain/fog rendering; fixed minimap scale (or one extra zoom step), full-map zoom required; performance over brevity.

**Independent author threads (2026-10-31; not new Revival milestones):** [Named NPC appearance decisions](../../v3-donor/characters/NAMED-NPC-APPEARANCE.md) record author-selected visual identities for recurring characters, separately from the main model/wardrobe roadmap; these are design targets, not shipped runtime overrides. [Character body variants — Asset Browser preview](../../plans/tools-022-character-body-variants-asset-browser-preview.md) is an isolated author-facing prototype for comparing body builds, not approval to integrate those variants into NPC gameplay. [Underground locations / portals MVP](../../plans/world-040-underground-locations-and-portals.md) is an independently initiated, planned exploration of one home-settlement cave portal, not a change to the Revival epoch batch or P2 priority. Opus: consult these records when their respective areas are scheduled; do not promote them into the active queue or assume implementation approval merely because they are linked here.

## Equipment, characters, assets

- Equipment catalogue: [recon](./2026-10-27--equipment-catalogue-recon.md), [87-definition ID mapping](./2026-10-27--equipment-id-mapping.md), [property matrix](./2026-10-27--equipment-property-matrix.md); stage notes [1](./2026-10-27--equipment-catalogue-stage-1-implementation-notes.md), [2](./2026-10-27--equipment-catalogue-stage-2-implementation-notes.md), [3](./2026-10-27--equipment-catalogue-stage-3-implementation-notes.md).
- Equipment Stage 4 (planning handoff READY WITH CONDITIONS): [approved author decisions](./2026-10-28--equipment-stage-4-approved-author-decisions.md), [decision dossier (historical alternatives)](./2026-10-27--equipment-stage-4-decision-dossier.md), [integration matrix](./2026-10-27--equipment-stage-4-integration-matrix.md), [implementation proposal](./2026-10-27--equipment-stage-4-implementation-proposal.md).
- NPC characters: [art direction](./2026-10-27--npc-character-art-direction.md), [Blender verification & integration](./2026-10-28--npc-character-blender-verification.md), [female skirts investigation](./2026-10-28--female-skirts-investigation.md) (research only).
- Migration hazard: [V3 character heads — SuperHero residual](./2026-10-26--v3-character-heads-superhero-residual.md) — use post-repair `*_Head*.glb` when moving V3 heads into V1.
- V3 donor intake: [docs/v3-donor/](../../v3-donor/) (voices, profiles, item art, concept art, [51 curated quests](../../v3-donor/quests/)). Staging only; not a runtime merge.

## Quests, voices, vision

- Round 2 decisions (current entry point): [author direction + seven group-session checklists](./2026-10-28--quest-round-2-author-decisions.md).
- Portfolio (advisory): [61-quest prioritization](./2026-10-28--quest-portfolio-prioritization.md). Direction **A — V1 preservation-first**: [executive recon](./2026-10-27--quest-revival-recon.md), [61-record matrix](./2026-10-27--quest-revival-matrix.md), [runtime evidence](./2026-10-27--quest-revival-runtime-evidence.md).
- NPC voices / barks: [recon](./2026-10-30--npc-voices-barks-recon.md).
- Vision alignment V1/V3: [2026-10-29 note](./2026-10-29--vision-alignment-v1-v3.md).
- Completed comparisons (apply newer brief decisions): [dog/elder/cemeteries](./2026-10-26--dog-elder-cemeteries-comparison.md), [clouds/settlement spacing](./2026-10-26--clouds-settlement-spacing-comparison.md).

## Purpose

Evidence-led research for deciding how to revive Seedvale V1 as the game's foundation. The dossier inventories existing capabilities, their runtime ownership, preservation concerns, and unknowns before Astra makes architecture or product decisions. **V1 is the research target**; R1 establishes its baseline and R2 compares selected V2/V3 technical mechanisms under the separately authorized architecture and simulation scope; R3 compares world presentation, environmental rendering and visual assets; R4 compares gameplay systems, items, progression and gameplay UI; R5 compares quests, dialogue, knowledge, voices, maps, travel and player experience. R6 independently reviews and consolidates R1–R5 for Astra. R7 supplies the unified, evidence-backed candidate matrix across the initiative.

Research must distinguish source-observed behavior, existing test coverage, historical measurements, design intent, and unverified hypotheses. The current V1 code takes precedence over documentation. This dossier does not itself approve refactors, ports, or replacements.

## Reports

| ID | Report | Status | Scope |
| --- | --- | --- | --- |
| R1 | [V1 Baseline — 2026-10-25](./2026-10-25--001--v1-baseline.md) | Complete: static/source reconnaissance; runtime verification outstanding | Major systems, boundaries, evidence, risks, preservation candidates, and research questions |
| R2 | [Architecture & Simulation — 2026-10-25](./2026-10-25--002--architecture-and-simulation.md) | Complete: comparative source research; runtime verification outstanding | Architecture, scheduling, navigation/spatial systems, NPC/fauna/economy foundations, persistence, performance evidence and integration risks |
| R3 | [World, Graphics & Visual Assets — 2026-10-25](./2026-10-25--003--world-and-visuals.md) | Complete: comparative static/source research; visual verification outstanding | V1 visual preservation baseline; geography, water, vegetation, weather, rendering, assets, candidate inventory and verification backlog |
| R4 | [Gameplay Systems, Items & Progression — 2026-10-25](./2026-10-25--004--gameplay-systems.md) | Complete: comparative source research; end-to-end runtime verification outstanding | V1 gameplay preservation; item/inventory/equipment, crafting, attributes/skills, combat/survival/trade integration, reusable UI and verification backlog |
| R5 | [Content, Quests & Player Experience — 2026-10-25](./2026-10-25--005--content-and-player-experience.md) | Complete: comparative source research; gameplay, visual, listening and performance verification outstanding | V1 content preservation; quest inventory and V3 curation maturity, dialogue/knowledge/voices, maps/travel/UI, adaptation candidates and verification backlog |
| R6 | [Cross-Report Review & Consolidation — 2026-10-26](./2026-10-26--006--cross-report-review.md) | Complete: READY WITH QUALIFICATIONS for strategic discussion; 0 CRITICAL, 1 MAJOR, 1 MINOR finding | Cross-report reconciliation, targeted source checks, preservation/dependency synthesis, conditional evidence gaps and independent Astra handoff |

| R7 | [Unified Candidate Matrix — 2026-10-26](./2026-10-26--007--unified-candidate-matrix.md) | Complete: READY WITH QUALIFICATIONS for Astra strategy discussion; no implementation acceptance or migration decisions | 62 unique candidates, original-inventory mapping, maturity/activation/verification separation, preservation contracts, dependencies, conditional verification and author questions |

R2 follows the author's explicitly authorized Architecture & Simulation brief; R3 follows the World, Graphics & Visual Assets brief. R4 follows the Gameplay Systems, Items & Progression brief. R5 follows the Content, Quests & Player Experience brief. R1–R5 are research inputs; R6 records review corrections without rewriting them; R7 applies those corrections to the final candidate inventory. None makes migration decisions; source implementation, historical checks and independent gameplay acceptance remain distinct.

## Reading order and evidence

For the Astra handoff, read [R7](./2026-10-26--007--unified-candidate-matrix.md), especially §1, §3 and its independently readable §11, then [R6](./2026-10-26--006--cross-report-review.md), especially its independently readable §8. Apply its trade-status and verification-vocabulary clarifications when combining the reports. The differing V1 report pins contain the same application implementation; their intervening commits are documentation-only. No additional broad recon is needed before strategic discussion; decision-specific checks and author preferences remain open. R7 completes the candidate matrix without prescribing a work order. It records 62 candidates, 8 consolidated secondary opportunity mentions (0 entire original inventory rows discarded as duplicates), 6 unresolved research/decision families and 0 unresolved classification contradictions. All 52 R2–R5 inventory rows are traceable; no initiative-wide domain is missing. Selected runtime/visual/performance/Save/asset evidence remains decision-specific, as R7 §9–§10 explains.

For detailed evidence, start with [R1](./2026-10-25--001--v1-baseline.md) and [R2](./2026-10-25--002--architecture-and-simulation.md), then consult [Code Index](../../CODE_INDEX.md), [Current State](../../STATE.md), [Architecture](../../architecture/ARCHITECTURE.md), [Performance](../../performance/README.md), and [Vision](../../VISION.md). Existing [reviews](../../reviews/) and [domain-state documents](../../state/) should be reused instead of repeated.

The author and Astra establish strategic direction; the current agreed decisions and Opus's planning mandate are recorded in the [Strategic Brief](./STRATEGIC-BRIEF.md). No R1 observation constitutes a KEEP / PORT / REBUILD verdict.

## Additional author suggestions — pending research

The author raised two additional visual/world-quality opportunities on 2026-10-26. **These are not approved implementation scope or a mandate to replace V1 systems.** Assess them in focused V1/V3 comparisons before Opus proposes inclusion or sequencing:

- **Roads and terrain surfaces:** investigate replacing or supplementing flat terrain/road coloring with appropriate textures, following relevant V3 techniques where beneficial. Compare material blending, visual consistency with V1, terrain-generation ownership, and rendering cost before selecting an approach.
- **Cave entrances and interiors:** review whether V1 caves need improvement and compare their entrance geometry, transitions, interiors and supporting systems with V3. V3 reportedly adapted V1 caves; verify that lineage and identify actual reusable improvements rather than assuming V3 is universally better.

Route terrain/road findings through [R3](./2026-10-25--003--world-and-visuals.md) and relevant R7 world/visual candidates; route cave findings through relevant world and gameplay research. Keep any later decisions in the [Strategic Brief](./STRATEGIC-BRIEF.md) or Opus's approved plan, not in this candidate note.

## Author additions for Astra

Read the [Author Feature Checklist — 2026-10-26](./2026-10-26--author-feature-checklist.md) alongside R7 before strategy discussion. It records seven explicit author preferences identified during a quick coverage check: NPC voices including newer batches and Mark Hornblower, key NPC names, optional English/mixed languages without automatic conversion, wounded dog companion and treasure search, lightweight directional night sky, the former-adventurer elder with his legendary sword (not the headman), and two independent roaming hero groups with their quests. These supplement the research inventory; detailed scope and donor implementation remain to be established with Astra.


