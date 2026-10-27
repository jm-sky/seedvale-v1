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
- [ ] Check current code, [agent render LOD draft](../../plans/world-terrain-050-agent-performance-render-census-and-lod.md), existing ownership and recent NPC/model changes; extend existing recon rather than duplicate it.
- [ ] Source-backed analysis of whole-actor culling, main vs shadow pass, skinned bounds, animation mixer/cadence, model/equipment LOD, corpses and offscreen visuals.
- [ ] Identify steps independent of the ongoing [npc-064 spatial-state seam](../../plans/npc-064-agent-performance-spatial-state-seam.md); no camera-based suppression of authoritative simulation.
- [ ] Stage a narrowly scoped implementation plan using existing plan IDs/ownership and short, reversible commits.
- [ ] Approve and deliver one implementation slice at a time, with unit/regression coverage and independent review.
- [ ] Record matched runtime/visual acceptance and completion status after implementation.

### B. Settlement rendering and draw submissions — parallel recon, second implementation lane
- [ ] Check existing settlement/instancing/storage plans and current rendering owners, then reconcile overlapping scope.
- [ ] Attribute main/shadow/mirror draws for static vs dynamic structures, decorative props, equipment and storage visuals without introducing a second profiling framework.
- [ ] Determine selective material merging, instancing, distance culling and V2/V3 tiered stockpile asset opportunities; preserve real inventories, doors, interactions, building stages, lifecycle and streaming.
- [ ] Prepare independently reviewable plan stages with explicit static/dynamic and cleanup boundaries.
- [ ] Approve and implement slices after A is stable or sooner if code ownership is genuinely disjoint.
- [ ] Record scene-level visual/runtime acceptance and update plans.

### C. Grass and flowers presentation — parallel deeper recon, third implementation lane
- [ ] Reconcile current V1 grass/placement/LOD/weather and the [V2/V3 transfer recon, including §9 and 2026-10-27 visual direction](./2026-10-26--v1-performance-transfer-v2-v3-recon.md).
- [ ] Compare V1 and V3 tile ownership, placement, geometry, instanced pools, partial uploads, LOD, wind, snow, wetness and streaming; inspect real source, not just donor docs.
- [ ] Design V1-terrain-authoritative adapter and reversible renderer switch with only one renderer active.
- [ ] Respect the latest visual direction: V1 olive palette and grounded coverage, less angular blades, billboard flower clumps; fern/shrub/herb changes remain separate.
- [ ] Produce migration stages and clear keep/revert criteria; V3 grass technology is a candidate until visual/performance confirmation.
- [ ] Approve prototype, implement in bounded slices, then decide cutover and retirement of V1 fallback.
- [ ] Record visual/runtime acceptance and lifecycle integrity.

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
| A — actors | TBD | existing recon or new analysis | Not started |
| B — settlements | TBD | existing recon or new analysis | Not started |
| C — grass | TBD | existing recon or new analysis | Not started |
