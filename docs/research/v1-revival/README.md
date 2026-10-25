# Seedvale V1 Revival — Research Dossier

**Created at:** 2026-10-25  
**Created by:** ChatGPT GPT-6

## Purpose

Evidence-led research for deciding how to revive Seedvale V1 as the game's foundation. The dossier inventories existing capabilities, their runtime ownership, preservation concerns, and unknowns before Astra makes architecture or product decisions. **V1 is the research target**; V2 and V3 are context only until a separately authorized comparison.

Research must distinguish source-observed behavior, existing test coverage, historical measurements, design intent, and unverified hypotheses. The current V1 code takes precedence over documentation. This dossier does not itself approve refactors, ports, or replacements.

## Reports

| ID | Report | Status | Scope |
| --- | --- | --- | --- |
| R1 | [V1 Baseline — 2026-10-25](./2026-10-25--001--v1-baseline.md) | Complete: static/source reconnaissance; runtime verification outstanding | Major systems, boundaries, evidence, risks, preservation candidates, and research questions |
| R2 | *To be defined with Astra* | Not started | Candidate: player-observable experience, graphics/atmosphere, and preservation criteria |
| R3 | *To be defined with Astra* | Not started | Candidate: autonomy, economy, persistence, and off-screen world continuity |
| R4 | *To be defined with Astra* | Not started | Candidate: performance, runtime lifecycle, integration seams, and validation gaps |
| R5 | *To be defined with Astra* | Not started | Candidate: synthesis and selective cross-version evidence; not a decision or migration plan by default |

R2–R5 descriptions are **routing placeholders**, not approved scopes or research performed.

## Reading order and evidence

Start with [R1](./2026-10-25--001--v1-baseline.md), then consult [Code Index](../../CODE_INDEX.md), [Current State](../../STATE.md), [Architecture](../../architecture/ARCHITECTURE.md), [Performance](../../performance/README.md), and [Vision](../../VISION.md). Existing [reviews](../../reviews/) and [domain-state documents](../../state/) should be reused instead of repeated.

Astra owns later strategic choices. No R1 observation constitutes a KEEP / PORT / REBUILD verdict.
