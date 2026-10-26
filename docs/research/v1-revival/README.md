# Seedvale V1 Revival — Research Dossier

**Created at:** 2026-10-25  
**Created by:** ChatGPT GPT-6  
**Updated at:** 2026-10-26  
**Updated by:** Cursor (Composer)

## Current strategic entry point

Start revival planning with the [Strategic Brief for Claude Opus 5.5](./STRATEGIC-BRIEF.md). It records the author's agreed goals, scope, exclusions, conditional preferences and open issues from the 2026-10-26 strategy session. Opus owns detailed planning, coordination and implementation; its proposed phases and order require author discussion and approval before implementation.

R1–R7 remain research evidence, not an approved backlog. The brief resolves selected earlier author questions without changing historical research findings. Use its topic links for bounded reading rather than loading all reports by default.

Preparation: [Documentation and backlog audit — 2026-10-26](./2026-10-26--documentation-backlog-audit.md) — inventory, evidence-backed corrections, archive scope (including implemented work awaiting manual checks), and a bounded cleanup packet.

Asset migration hazard: [V3 character heads — SuperHero FullBody residual](./2026-10-26--v3-character-heads-superhero-residual.md) — when moving V3 Quaternius/CharacterKit GLBs into V1, use post-repair `*_Head*.glb` (or rebuild with `head-cut` arm-dominant drop); pre-repair heads poke SuperHero shoulder/arm skin through cloth.

UI migration: [research](./2026-10-26--ui-migration-research.md), [matrix](./2026-10-26--ui-migration-compatibility-matrix.md), [draft stages](./2026-10-26--ui-migration-draft-stages.md), Stages A–C visual PASS (`ui-input-039`…`041`). Next: [Stage D character kick-off](./NEXT-SESSION--stage-d-character.md) (D3/D5 consultation first). Demos: `item-details-demo.html`, `inventory-list-demo.html`, `quick-actions-demo.html`. No V3 dialogue port.

V3 donor intake: [docs/v3-donor/](../../v3-donor/) — staged copies of selected V3 voices (MP3 + text banks), character profiles/refs (including Casimir Eastwood), item illustrations + type/category icons, concept art, and the **51 keep/rewrite curated quests** with full linked v1/v2 source documents for re-curation. Staging only; not a runtime merge or implementation backlog. Character kit GLBs already live under `public/assets/characters/`. See also [v3-donor/quests/](../../v3-donor/quests/).

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

