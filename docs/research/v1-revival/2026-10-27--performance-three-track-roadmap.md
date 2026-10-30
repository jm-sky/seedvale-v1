# V1 Revival — Rendering Performance Roadmap (A/B/C/D)

**Created:** 2026-10-27  
**Status:** D4 Performance-First and D9 V1-first grass **APPROVED (2026-10-27)**; specific implementation mechanisms/stages still require applicable approval  
**Target:** `jm-sky/seedvale-v1`  
**Scope:** (A) NPC/fauna rendering, (B) settlement draw submissions, (C) V1-first grass/flowers optimization, (D) Trees LOD; donor techniques conditional

## Decision and boundaries

The author selected **A/B/C as mandatory optimization workstreams and, on 2026-10-29, Trees LOD (D) as a mandatory P1 evaluation/closure area**. Their concrete mechanisms remain subject to technical feasibility, visual quality, simulation preservation, and measured results; in particular, a wholesale V3 grass renderer is not an unconditional transplant. Target approximately 50–60 FPS (45–60 acceptable with justification) and smooth travel on the author's Intel Arc laptop without sacrificing V1's living-world behavior or atmosphere. Keep current visibility/fog unless explicitly reconsidered. Preserve deterministic placement, entity identity, ownership, economy, lifecycle, offscreen continuity, save/load, and visual richness.

This focused performance track may advance through research, plans and separately authorized small Cursor/Sol implementation slices without waiting for Claude Opus. It does not approve unrelated revival scope or replace the [Strategic Brief](./STRATEGIC-BRIEF.md), its broader coordination mandate, or the official [planning conventions](../../plans/PLANNING.md). The approved D4 priority and D9 sequence below supersede the former parallel-lanes/migration-first recommendation. Other candidate mechanisms remain proposals, with no expected FPS gains claimed.

## P1 status snapshot (2026-10-29)

Consolidated by Claude Opus 5.5 from commits and native Arc reports; checklists below keep their history. P0 is operationally closed ([Master Roadmap](./2026-10-27--master-revival-roadmap.md) header) — the 2026-10-27 benchmark gate section below is historical. Work order: [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md).

| Track | Landed on `main` | Measured (native Arc) | Rejected / deferred | Next |
| --- | --- | --- | --- | --- |
| A — actors | A1′ conservative skinned cull bounds `e76f3f9c` → `8fc58ddf` → envelope boundingBox `36e99ef6` | settlement-heavy ≈32.6 FPS, forest ≈56 FPS at `36e99ef6` ([report](../../performance/results/2026-10-28--win-forest-bisect-and-fixes.md)); scene is main-thread/CPU-submission bound ([trace](../../performance/results/2026-10-28--win-a1p-trace-analysis.md)) | CSS2D matrix skip, body Skeleton sharing, D11 Peasant body merge — no repeatable FPS gain, reverted/not merged | [Q1 review](./2026-10-29--performance-negative-experiments-review.md) done: savings real but ≤1 ms each; Q6 A0 attribution and Q15 leak fix done; Q20 A1 one skeleton per actor `a416ff2b` **on** after WSL green light (main skeletons 267 → 49–50; [A/B](../../performance/results/2026-10-30--wsl-q20-actor-skeleton-sharing-ab.md)), Windows A/B pending ([notes](./2026-10-30--q20-actor-skeleton-sharing--implementation-notes.md)) |
| B — settlements | Wood piles as instanced V2 tiers `4347c274`; wall/standing lantern GLBs `405742dc` | Lantern draws −4–6 %, FPS effect below noise ([A/B](../../performance/results/2026-10-28--win-lantern1-ab-same-session.md)) | Reflection trims wait for D8/D13 | Q14 B1a single per-frame matrix update kept (Windows frame p50 −3.1 ms); B1b static freeze deferred ([census](../../performance/results/2026-10-29--wsl-q14-b1b-matrix-census.md): ceiling ~0.3–0.7 ms); Q5 interior chests instanced `b2691195` ([WSL A/B](../../performance/results/2026-10-29--wsl-q5-house-chest-instancing-ab.md): storageContainer calls 58/20/28 → 18/6/8, Windows pending) |
| C — grass | CA1 filler gating `bc9a68d1`; CA2 far-band main cap `0cfb9ed3` | CA1: resident filler −50…89 % ([A/B](../../performance/results/2026-10-28--win-ca1-filler-gating-ab.md)); CA2 (WSL): resident main −47…−69 %, submitted identical ([A/B](../../performance/results/2026-10-29--wsl-ca2-grass-main-cap-ab.md)); **no FPS claim** | CB (V3 backend) conditional | CA2 Windows confirm + visual; then evaluate C (Q7) |
| D — trees | Inert LOD assets `d867f38` only | Trees ≤1.3M tris / ≤214 draws in all fixtures; no dense-forest fixture ([recon](./2026-10-29--tree-lod-recon.md)) | Billboards conditional | **Closed 2026-10-30: measured, not needed** ([Windows](../../performance/results/2026-10-30--win-q2a-dense-forest.md)); Q3 LOD1 closed |
| Other | `riverShoreQuery` memo `29b42a09` (CPU) | part of `36e99ef6` series | — | — |
| E — travel stutter | E1 template prewarm `0a56f8cc` (opt-in; Windows A/B ambiguous, default OFF — [report](../../performance/results/2026-10-30--win-q17e1-template-prewarm-ab.md)) | Windows `stream` (CA2 runs, both arms): mirror-pass first use of streamed programs 200–720 ms, sync `riverTileBuild` 37–128 ms ([attribution](../../performance/results/2026-10-30--win-q5-ca2-ab.md#ca2-stream--post-hoc-tail-attribution-existing-raw-data-no-new-runs)) | — | Q17 recon + slice (added to P1 by the author 2026-10-30) |

Gap to target: `settlement-heavy` remains far below the 50–60 FPS goal. P1 exit requires the approved scope **completed or explicitly closed** with a combined result, not reaching the target; whether a remaining gap justifies extra P1 scope is an author decision to raise in Q7. **Exit packet:** [2026-10-30 P1 exit packet](./2026-10-30--p1-exit-packet.md) (verdicts, close/defer list, batched Windows session, checklist).

## Ordered execution and checklist

### A. NPC and fauna rendering — first implementation lane

Research: [Track A deep recon, source owners, dependencies and proposed Composer slices (§10)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27). Source reconnaissance complete at V1 `a23ecfd9`; no runtime changes or new benchmark evidence.

- [x] Check current code, [agent render LOD draft](../../plans/world-terrain-050-agent-performance-render-census-and-lod.md), existing ownership and recent NPC/model changes; extend existing recon rather than duplicate it.
- [x] Source-backed analysis of whole-actor culling, main vs shadow pass, skinned bounds, animation mixer/cadence, model/equipment LOD, corpses and offscreen visuals.
- [x] Identify steps independent of the ongoing [npc-064 spatial-state seam](../../plans/npc-064-agent-performance-spatial-state-seam.md); no camera-based suppression of authoritative simulation.
- [x] Propose bounded Composer slices under existing `world-terrain-050` / `npc-063` ownership (§10.7); formal implementation scope/approval remains pending. No new plan ID or activation claim.
- [ ] Approve and deliver one implementation slice at a time, with unit/regression coverage and independent review.
- [ ] Record matched runtime/visual acceptance and completion status after implementation.

### B. Settlement rendering and draw submissions — active performance priority

Research: [Track B deep recon, static/dynamic boundaries, donor comparison and proposed Composer slices (§11)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27). Source reconnaissance complete at V1 `d1c477f3`; no runtime changes or new benchmark evidence. Existing settlements-019 Stage 1 is implemented with browser verification outstanding; its later stages own static submission follow-ups.

- [x] Check existing settlement/instancing/storage plans and current rendering owners, then reconcile overlapping scope (§11.1–11.3).
- [x] Map static/dynamic, decor and storage owners plus existing main/shadow/mirror diagnostics and measurement gaps (§11.2–11.5); actor equipment stays with A.
- [ ] Capture fresh actual per-pass attribution with shared A0a/B0 instrumentation; historical census/isolation is not current measured attribution.
- [x] Determine selective material merging, instancing, distance culling and V2/V3 tiered stockpile asset opportunities; preserve real inventories, doors, interactions, building stages, lifecycle and streaming (§11.3–11.5).
- [x] Prepare ranked, independently reviewable Composer proposals with explicit ownership, static/dynamic, cleanup and rollback boundaries (§11.6); formal implementation approval remains pending.
- [ ] Approve and implement bounded B slices within the A/B/C phase; disjoint ownership alone does not establish workload isolation. Reflection changes still need D8/D13.
- [ ] Record scene-level visual/runtime acceptance and update plans.

### C. Grass and flowers — approved V1-first execution

Research: [Track C deep recon, V1 surface adapter, lifecycle/pools/uploads and proposed Composer slices (§12)](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#12-track-c-deep-recon--v1-grassflower-renderer-adaptation-2026-10-27). Source reconnaissance complete at V1 `317a5c71` / V3 `94c46473`; no runtime changes, new measurements or visual acceptance. Ground shader/cover clipmap remains a separate candidate.

- [x] Reconcile current V1 grass/placement/LOD/weather and the [V2/V3 transfer recon, including §9 and 2026-10-27 visual direction](./2026-10-26--v1-performance-transfer-v2-v3-recon.md).
- [x] Compare V1 and V3 tile ownership, placement, geometry, instanced pools, partial uploads, LOD, wind, snow, wetness and streaming; inspect real source, not just donor docs.
- [x] Research a V1-terrain-authoritative adapter/reversible switch for the conditional V3 candidate; this is not a selected migration or prerequisite for CA1/CA2.
- [x] Respect the latest visual direction: V1 olive palette and grounded coverage, less angular blades, billboard flower clumps; fern/shrub/herb changes remain separate.
- [x] Preserve researched migration stages and keep/revert criteria as conditional evidence; V3 grass technology remains a candidate.
- [ ] **C0:** obtain a credible, certified grass-rich and relevant streaming baseline; keep current diagnostic evidence labeled UNVERIFIED.
- [~] **CA1:** eliminate filler generation outside its actual useful radius, preserving deterministic placement and visible coverage. **Implemented + technically verified 2026-10-28; visual/browser acceptance and measured memory/worker effect PENDING; C0 still uncertified** — see [implementation notes](./2026-10-28--ca1-filler-gating--implementation-notes.md).
- [~] **CA2:** cap generation/storage of instances that cannot be submitted under current LOD constraints, preserving near-field density and regrowth on approach. **Implemented `0cfb9ed3` (2026-10-29); WSL A/B green light (resident main −47…−69 %, submitted identical); Windows confirmation + visual check PENDING** — [notes](./2026-10-29--ca2-grass-main-cap--implementation-notes.md), [A/B](../../performance/results/2026-10-29--wsl-ca2-grass-main-cap-ab.md).
- [ ] Evaluate CA1/CA2 using relevant memory/upload/frame metrics; no automatic benchmark after each small stage.
- [ ] Consider a V3 tiled prototype/cutover **only if post-CA evidence justifies further architecture work**; no migration prerequisite or mandatory freeze-exit dependency.
- [ ] Record visual/runtime acceptance and lifecycle integrity.

## Benchmark readiness gate — 2026-10-27

> **Historical (2026-10-29):** P0 was closed operationally on native Arc same-session evidence; unchecked items below are not P1 blockers. See the [dated evidence update](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md#2026-10-29-evidence-update--p0-operational-closure).

D4 changes when measurements are needed, not capture quality. Preserve the existing audit/runbook READY/STOP requirements, rep counts and metadata. Reuse an already certified comparable baseline rather than capturing again solely for a new commit SHA.

[Cross-track A0a/B0/C0 readiness audit and metric matrix](../../performance/audits/2026-10-27--three-track-benchmark-diagnostics-readiness.md) checks the current instrument → report → file chain against code at `afde7765`. **Status: NOT BASELINE READY**, documentation-only audit. Existing benchmark exports lack actual verified per-pass A/B submissions, complete full-session tails/raw sidecar, reproducible SHA/device/phase metadata, and C0 active/LOD/flower/upload provenance. GPU elapsed may legitimately be **unavailable**, never synthesized.

- [x] Reuse existing perf, scene census, program census, GPU timers, agent CPU and grass finalization diagnostics; audit report and September evidence without claiming fresh measurements.
- [x] Define P0/P1/P2, STOP criteria, scenario minimum and one shared A0a/B0 collector owner.
- [x] **P0:** diagnostics/export implemented (`e124e866` + residual fix `94a74470`); unit/typecheck/build verified; browser smoke showed `passSubmissions.reliability=observed` — no renderer/behavior optimizations.
- [ ] **A0a/B0:** capture real pass counters and matched settlement-heavy camera rotation on instrument SHA; no inference from census/isolations. *(diagnostic 032 only — UNVERIFIED)* *(2026-10-27 run on `c460b224`, Arc 140V via WSL2: 3 reps + 6 repeats captured, real pass counters `observed`; **still UNVERIFIED** — NPC population ramps 4/19→53 inside window, camera rotation BLOCKED (no pointer lock), GL_INVALID_OPERATION, GPU timer unavailable; [run 2026-10-27 summary](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md))*
- [ ] **C0:** capture grass-rich forest/meadow, stream/cold/warm, resident grass/flower/LOD and streaming/finalization; record V1 baseline before V3 candidate. *(UNVERIFIED)* *(2026-10-27: forest + stream ×3 captured; grass resident/submitted + stream lifecycle observed, flowers `unavailable`, no cold mode — **UNVERIFIED (partial)**; [run 2026-10-27 summary](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md))*
- [ ] **Gate:** save raw JSON, human Markdown, verified SHA/device/viewport/quality/seed/weather/camera/phase, GPU status, successful target-hardware repeatability; mark lanes UNVERIFIED if required evidence absent. See [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md). *(artifacts 033–051 saved, classified `diagnostic`; native-Arc re-run + harness settle gate needed — [run 2026-10-27 summary](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md))*
- [ ] Only then choose relevant P1 diagnosis and obtain separate author approval for an optimization slice.

Do not restart prior implementation work solely because this measurement audit is complete. Existing `settlements-019` conditional post-Stage-1 benchmark gate remains in force.

## Cross-track sequencing

1. Pause unrelated performance-affecting integrations; establish the stable reference and one certified baseline set for applicable A0a/B0/C0 scenarios.
2. Deliver approved bounded **A/B/C** optimization slices as the main implementation phase. Existing recon is reusable; parallel work is optional, not preferred or required.
3. Track C follows **C0 → CA1 → CA2 → evaluate → conditional V3 candidate**. Preserve V1 terrain/simulation authority, deterministic world identity, coverage/richness, current fog/visibility, olive palette, intended softer blades and decorative billboard flowers. Appearance may be planned alongside optimization; density reduction is not approved.
4. Reconcile shared owners (shadows, vegetation batching, chunk streaming/disposal); keep independently reversible commits and avoid double-counted gains. D8/D10/D11/D13 and area-specific choices remain unapproved.
5. Record appropriate technical/visual verification and the final combined assessment; explicitly complete/close approved scope and end the freeze. Optional ideas must not extend it indefinitely. Resume other Revival runtime work afterward.

## Performance-First integration and measurement policy

Authority: [approved D1/D3/D4/D9 record](./STRATEGIC-BRIEF.md#approved-revival-decisions-2026-10-27). Full boundaries, exceptions and entry/exit: [Master Roadmap §4](./2026-10-27--master-revival-roadmap.md#4-strategy--performance-first); benchmark handling: [§10](./2026-10-27--master-revival-roadmap.md#10-benchmark-policy-and-intake).

During A/B/C, defer unrelated merges affecting CPU simulation, GPU/scene/draw costs, population/models/animation, settlement/worldgen, terrain/vegetation, shaders/lighting/shadows/reflections, streaming/cache, loading/memory/startup or scenario comparability. This includes armor/runtime equipment, new character visuals and atmosphere implementations outside A/B/C. Preserve their plans/research as deferred, not cancelled.

Documentation, research, architecture/plans, unit tests, non-runtime tooling, inert data/assets and isolated UI demos may continue only without benchmark/bundling/loading/execution effects; demos cannot run/modify the living world. Other branch preparation is allowed; performance-affecting merges wait. Critical correctness/security/blocking exceptions require the reason, workload impact, commit and an explicit decision on targeted measurement, not an automatic full suite.

Freeze entry requires a stable reference and certified applicable A/B/C baseline; pause unrelated integrations during preparation too. Exit requires approved scope completed/explicitly closed, accepted changes technically/visually checked and final combined results documented.

Preserve the baseline SHA/device/configuration/workload/reports and reuse while comparable. A SHA change alone does not invalidate evidence; changed relevant behavior/workload may. Use focused regression tests, measure meaningful keep/revert questions, evaluate several reversible changes per session where practical and diagnose regressions selectively. No automatic runs after every commit/stage; no gains claimed across incomparable versions/configurations. Executed benchmarks still meet all existing runbook quality requirements.

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
- [NPC spatial seam plan, separate owner; runtime integration subject to D4](../../plans/npc-064-agent-performance-spatial-state-seam.md)

## Research results

| Track | Research owner | Result document | Status |
| --- | --- | --- | --- |
| A — actors | Codex | [Existing transfer recon §10](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27) | Source recon complete; A0a attribution proposed first; implementation/measurements/visual acceptance pending |
| B — settlements | Codex | [Existing transfer recon §11](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27) | Source recon complete; shared A0a/B0 attribution proposed first; implementation/measurements/visual acceptance pending |
| C — grass | Codex | [Existing transfer recon §12](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#12-track-c-deep-recon--v1-grassflower-renderer-adaptation-2026-10-27) | Source recon complete; D9 approved C0 → CA1 → CA2 → evaluate; V3 adapter/backend conditional; implementation, measured results and look acceptance pending |
| A — delta audit 2026-10-27 | Claude Opus 5.5 | [NPC/fauna audit](./2026-10-27--revival-audit--npc-fauna-rendering.md) | Corrects §10 (native skinned culling already on for bodies/fauna; head/hair uncullable); A1′ cull sphere proposed; baseline slot ready; PENDING BASELINE |
| B — delta audit 2026-10-27 | Claude Opus 5.5 | [Settlement delta](./2026-10-27--revival-audit--settlement-rendering.md) | §11 still current; observed per-pass families from 032 diagnostic; mirror policy tie-in; baseline slot ready; PENDING BASELINE |
| C — delta audit 2026-10-27 | Claude Opus 5.5 | [Grass/flowers audit](./2026-10-27--revival-audit--grass-flowers-v3.md) | Recommends V1-side memory/upload trims first, V3 backend gated on C0; baseline slot ready; PENDING BASELINE |

Cross-track integration, approved priority and remaining proposals: [Master Revival Roadmap](./2026-10-27--master-revival-roadmap.md). Note: diagnostic 032 was captured at `e124e866`, before the minimum instrument SHA `94a74470`; it is not comparable to certified baselines.

## E. Travel stutter — included in P1 (author decision 2026-10-30)

Added after the CA2 `stream` attribution showed that the worst travel frames on native Windows are not A/B/C/D work: the first draw of a newly streamed program (first paid in the water mirror pass; plan 149 Phase 1 A prewarms only programs present at load) and synchronous river tile builds in `chunkUpdate`. Scope: **frame-time spikes during travel**, not average FPS. Owners: plan 149 (Phase C / streamed program families) and `src/terrain/chunkManager.ts` (`retainRiverTilesFor`).

- [x] Recon: which streamed families miss the prewarm (asset census vs program census on `stream`), and why `riverTileBuild` runs synchronously on the main thread (cache, worker or budget options). → [Q17 recon](./2026-10-30--q17-travel-stutter-recon.md): E1 template families landed opt-in (`0a56f8cc`, A/B pending); E2 river-tile worker prefetch (Q22) and E3 character families (Q23) queued.
- [ ] Bounded slices with tests; WSL `stream` A/B (hitches, long frames, p99, max) as green light, native Windows confirmation.
- [ ] **NPC multi-second frames on travel (author, 2026-10-30: in P1-E):** 4.5–7.6 s `NPC`-category frames on a 90 s `stream` route, both arms of the Q22 rerun ([findings](../../performance/results/2026-10-30--wsl-q22-river-prefetch-ab.md#findings-from-this-attempt)) → queue Q25 (recon + bounded slice). **Recon done** ([Q25](./2026-10-30--q25-npc-stream-frames-recon.md)): synchronous settlement unique-name site probes in `recheck()`, not NPC simulation; slices E4a/E4b → queue Q26.
- [ ] P1 exit verdict like A–D. Not a mirror-quality change: whether actors/player appear in reflections, mirror resolution/refresh and reflection caching stay under D8/D13.

## D. Trees LOD — included in P1 (author decision 2026-10-29)

[Six-tree LOD1 + billboard impostor dossier](./2026-10-28--tree-lod-v1-backlog-candidate.md). The author **approved adding Trees LOD to P1**, not an unconditional implementation or the complete proposed LOD architecture.

- [x] Prepare inert six-tree LOD assets (`public/assets/tree-lod/v1/`, `d867f38`).
- [ ] Focused recon of current V1 rendering, tree lifecycle, existing LOD/instancing and forest costs; reconcile ownership and dependencies with A/B/C.
- [ ] Prepare bounded, reversible LOD1-first implementation scope and decide whether to authorize it; billboard impostors require a separate evidence-based decision.
- [ ] Evaluate with comparable forest/travel native Arc measurements and author visual checks, preserving existing LOD0, density, height, placement, shadows, identity, streaming and authoritative simulation.
- [ ] Document a **P1 exit verdict**: implemented and verified, or explicitly closed/deferred with reasons and evidence. Trees must not be silently skipped; optional billboard implementation must not prolong P1 indefinitely.

Existing A/B/C execution continues; no automatic full baseline recapture and no wholesale V3 transfer.
