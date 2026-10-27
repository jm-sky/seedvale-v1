# V1 Revival — Three-Track Rendering Performance Roadmap

**Created:** 2026-10-27  
**Status:** author-selected priorities; reconnaissance and staged planning authorized, implementation stages require separate approval  
**Target:** `jm-sky/seedvale-v1`  
**Scope:** (A) NPC/fauna rendering, (B) settlements draw submissions, (C) grass/flowers presentation using V3 techniques

## Decision and boundaries

The author selected **all three optimization goals as mandatory workstreams**. Their concrete mechanisms remain subject to technical feasibility, visual quality, simulation preservation, and measured results; in particular, a wholesale V3 grass renderer is not an unconditional transplant. Target approximately 50–60 FPS (45–60 acceptable with justification) and smooth travel on the author's Intel Arc laptop without sacrificing V1's living-world behavior or atmosphere. Keep current visibility/fog unless explicitly reconsidered. Preserve deterministic placement, entity identity, ownership, economy, lifecycle, offscreen continuity, save/load, and visual richness.

This focused performance track may advance through research, plans and separately authorized small Cursor/Sol implementation slices without waiting for Claude Opus. It does not approve unrelated revival scope or replace the [Strategic Brief](./STRATEGIC-BRIEF.md), its broader coordination mandate, or the official [planning conventions](../../plans/PLANNING.md). The order below is a **provisional local recommendation**, not evidence of expected FPS gains.

## Ordered execution and checklist

### A. NPC and fauna rendering — first implementation lane

Research: [Track A deep recon, source owners, dependencies and proposed Composer slices (§10)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27). Source reconnaissance complete at V1 `a23ecfd9`; no runtime changes or new benchmark evidence.

- [x] Check current code, [agent render LOD draft](../../plans/world-terrain-050-agent-performance-render-census-and-lod.md), existing ownership and recent NPC/model changes; extend existing recon rather than duplicate it.
- [x] Source-backed analysis of whole-actor culling, main vs shadow pass, skinned bounds, animation mixer/cadence, model/equipment LOD, corpses and offscreen visuals.
- [x] Identify steps independent of the ongoing [npc-064 spatial-state seam](../../plans/npc-064-agent-performance-spatial-state-seam.md); no camera-based suppression of authoritative simulation.
- [x] Propose bounded Composer slices under existing `world-terrain-050` / `npc-063` ownership (§10.7); formal implementation scope/approval remains pending. No new plan ID or activation claim.
- [ ] Approve and deliver one implementation slice at a time, with unit/regression coverage and independent review.
- [ ] Record matched runtime/visual acceptance and completion status after implementation.

### B. Settlement rendering and draw submissions — parallel recon, second implementation lane

Research: [Track B deep recon, static/dynamic boundaries, donor comparison and proposed Composer slices (§11)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27). Source reconnaissance complete at V1 `d1c477f3`; no runtime changes or new benchmark evidence. Existing settlements-019 Stage 1 is implemented with browser verification outstanding; its later stages own static submission follow-ups.

- [x] Check existing settlement/instancing/storage plans and current rendering owners, then reconcile overlapping scope (§11.1–11.3).
- [x] Map static/dynamic, decor and storage owners plus existing main/shadow/mirror diagnostics and measurement gaps (§11.2–11.5); actor equipment stays with A.
- [ ] Capture fresh actual per-pass attribution with shared A0a/B0 instrumentation; historical census/isolation is not current measured attribution.
- [x] Determine selective material merging, instancing, distance culling and V2/V3 tiered stockpile asset opportunities; preserve real inventories, doors, interactions, building stages, lifecycle and streaming (§11.3–11.5).
- [x] Prepare ranked, independently reviewable Composer proposals with explicit ownership, static/dynamic, cleanup and rollback boundaries (§11.6); formal implementation approval remains pending.
- [ ] Approve and implement slices after A is stable or sooner if code ownership is genuinely disjoint.
- [ ] Record scene-level visual/runtime acceptance and update plans.

### C. Grass and flowers presentation — parallel deeper recon, third implementation lane

Research: [Track C deep recon, V1 surface adapter, lifecycle/pools/uploads and proposed Composer slices (§12)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#12-track-c-deep-recon--v1-grassflower-renderer-adaptation-2026-10-27). Source reconnaissance complete at V1 `317a5c71` / V3 `94c46473`; no runtime changes, new measurements or visual acceptance. Ground shader/cover clipmap remains a separate candidate.

- [x] Reconcile current V1 grass/placement/LOD/weather and the [V2/V3 transfer recon, including §9 and 2026-10-27 visual direction](./2026-10-26--v1-performance-transfer-v2-v3-recon.md).
- [x] Compare V1 and V3 tile ownership, placement, geometry, instanced pools, partial uploads, LOD, wind, snow, wetness and streaming; inspect real source, not just donor docs.
- [x] Design V1-terrain-authoritative adapter and reversible renderer switch with only one renderer active.
- [x] Respect the latest visual direction: V1 olive palette and grounded coverage, less angular blades, billboard flower clumps; fern/shrub/herb changes remain separate.
- [x] Produce migration stages and clear keep/revert criteria; V3 grass technology is a candidate until visual/performance confirmation.
- [ ] Approve prototype, implement in bounded slices, then decide cutover and retirement of V1 fallback.
- [ ] Record visual/runtime acceptance and lifecycle integrity.

## Benchmark readiness gate — 2026-10-27

[Cross-track A0a/B0/C0 readiness audit and metric matrix](../../performance/audits/2026-10-27--three-track-benchmark-diagnostics-readiness.md) checks the current instrument → report → file chain against code at `afde7765`. **Status: NOT BASELINE READY**, documentation-only audit. Existing benchmark exports lack actual verified per-pass A/B submissions, complete full-session tails/raw sidecar, reproducible SHA/device/phase metadata, and C0 active/LOD/flower/upload provenance. GPU elapsed may legitimately be **unavailable**, never synthesized.

- [x] Reuse existing perf, scene census, program census, GPU timers, agent CPU and grass finalization diagnostics; audit report and September evidence without claiming fresh measurements.
- [x] Define P0/P1/P2, STOP criteria, scenario minimum and one shared A0a/B0 collector owner.
- [x] **P0:** diagnostics/export implemented (`e124e866` + residual fix `94a74470`); unit/typecheck/build verified; browser smoke showed `passSubmissions.reliability=observed` — no renderer/behavior optimizations.
- [ ] **A0a/B0:** capture real pass counters and matched settlement-heavy camera rotation on instrument SHA; no inference from census/isolations. *(diagnostic 032 only — UNVERIFIED)*
- [ ] **C0:** capture grass-rich forest/meadow, stream/cold/warm, resident grass/flower/LOD and streaming/finalization; record V1 baseline before V3 candidate. *(UNVERIFIED)*
- [ ] **Gate:** save raw JSON, human Markdown, verified SHA/device/viewport/quality/seed/weather/camera/phase, GPU status, successful target-hardware repeatability; mark lanes UNVERIFIED if required evidence absent. See [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md).
- [ ] Only then choose relevant P1 diagnosis and obtain separate author approval for an optimization slice.

Do not restart prior implementation work solely because this measurement audit is complete. Existing `settlements-019` conditional post-Stage-1 benchmark gate remains in force.

## Cross-track sequencing

1. Run **A/B/C targeted reconnaissance in parallel**, reusing existing documents and adding only the missing evidence.
2. Start **A small implementation slices first**, unless recon changes the payoff/risk ranking.
3. Prepare **B** while A progresses; implement B in independently owned pieces.
4. Prepare **C** design and migration stages in parallel, but do not authorize a wholesale cutover ahead of proven compatibility and acceptable visuals.
5. Reconcile overlapping owners (NPC shadow casters / settlement shadow costs; grass / vegetation batching; chunk streaming / disposal). Do not double count isolation results or combine separate render optimizations in one unreviewable commit.

## Handoff requirements for each research agent

- Read `CLAUDE.md`, the Strategic Brief, existing V1 performance docs, relevant plans/reviews/recon and current V1 source; check whether an adequate current analysis already exists. **Extend the existing owner document if appropriate**, otherwise add a narrowly named analysis under `docs/research/v1-revival/`.
- Compare V2/V3 only as donors; pin repository HEADs/commit SHA and cite concrete paths/symbols. Distinguish source-observed, historical measurements, estimates and unknowns.
- Specify actual ownership, proposed intervention points, prerequisites, conflicts with the other two tracks, behavior/visual invariants, and short Cursor-suitable stages. No speculative FPS numbers.
- Research deliverables are **not executable implementation plans**. If proposing a formal plan, first inspect `docs/plans/README.md`, `PLANNING.md` and existing domain plans/IDs; comply with metadata and avoid duplicate plans.
- Save findings in the V1 repository, link them from this tracker, update the checklist status, and provide a brief Polish handoff with commit link. Do not change runtime code as part of reconnaissance.
- Repository writing/committing is authorized for documentation within this task. Do not assume automatic permission to push or change main in later implementation tasks; obey the active agent's explicit branch/push instructions.

## Existing evidence / links

- [Performance owner and historical isolation evidence](../../performance/README.md)
- [2026-10-26 V2/V3 targeted performance transfer recon](./2026-10-26--v1-performance-transfer-v2-v3-recon.md)
- [R2 architecture/simulation comparison](./2026-10-25--002--architecture-and-simulation.md)
- [R3 visuals comparison](./2026-10-25--003--world-and-visuals.md)
- [R7 unified candidates](./2026-10-26--007--unified-candidate-matrix.md)
- [NPC spatial seam plan, independent workstream](../../plans/npc-064-agent-performance-spatial-state-seam.md)

## Research results

| Track | Research owner | Result document | Status |
| --- | --- | --- | --- |
| A — actors | Codex | [Existing transfer recon §10](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27) | Source recon complete; A0a attribution proposed first; implementation/measurements/visual acceptance pending |
| B — settlements | Codex | [Existing transfer recon §11](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27) | Source recon complete; shared A0a/B0 attribution proposed first; implementation/measurements/visual acceptance pending |
| C — grass | Codex | [Existing transfer recon §12](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#12-track-c-deep-recon--v1-grassflower-renderer-adaptation-2026-10-27) | Source recon complete; C0 baseline/C1 adapter contract proposed first; implementation, measured keep/revert decision and look acceptance pending |
