# Codebase domain audit 24 — Performance & workers

**Reviewed:** 2026-09-20  
**Area:** Performance & workers  
**Source of truth:** current `main` code  
**Master:** `tools-018-codebase-domain-and-flow-audit-master.md`

## Scope

This review traced recurring CPU work, update cadence, allocations/GC, worker boundaries, off-screen scaling and rebuild paths across the main runtime loop.

The review intentionally excludes hypothetical micro-optimizations. A finding is recorded only where current code shows a concrete recurring cost or scaling defect with plausible runtime impact.

## Entry points and state owners

Primary recurring path:

```text
requestAnimationFrame
→ appRenderLoop
→ gameLoop.tick
→ settlements / NPC / livestock
→ fauna
→ interaction candidate construction
→ terrain/chunk streaming
→ rendering-support CPU
→ minimap / CSS2D projection
→ render
```

Important owners inspected:

- `src/app/gameLoop.ts` — per-frame orchestration and interaction candidate rebuild.
- `src/settlement/SettlementsManager.ts` / `src/settlement/createSettlement.ts` — loaded-settlement simulation.
- `src/fauna/createFauna.ts` / `src/fauna/AnimalAgent.ts` — wild fauna pass and adaptive cadence.
- `src/app/interactables.ts` — per-frame interaction candidate construction.
- `src/terrain/chunkManager.ts` / `src/terrain/chunkWorkerPool.ts` — chunk streaming, finalization and worker jobs.
- `src/perf/agentCpuDiag.ts` — current NPC/fauna diagnostics.
- `src/world/createTransportOrders.ts` — active transport registry.
- `src/ai/socialBehaviour.ts` — settlement social pairing cadence.

## Flows traced

### Per-frame

- `appRenderLoop → gameLoop.tick`.
- NPC/settlement update, livestock update, fauna update.
- interaction candidates via `buildInteractables()`.
- `ChunkManager.update()`.
- minimap projection and CSS2D labels.
- post-processing/render submission.

### Per-agent

- NPC crowd/agent/social paths.
- wild fauna adaptive cadence and proximity queries.
- livestock update cadence.
- repeated village/fire/player sensing.

### Per-settlement

- social pairing.
- loaded-settlement updates.
- transport-demand consumers.
- interaction scanning of loaded settlement content.

### Per-chunk / worker

- chunk height/mesh/grass/world-knowledge jobs through the existing chunk worker pool.
- main-thread chunk finalization.
- known river/terrain streaming stall evidence.

### Periodic / low-frequency

- social retry cadence.
- spawner population bookkeeping.
- settlement streaming and maintenance.
- transport arrival/off-screen handling.

### Save / rebuild / off-screen

- transport registry carry-over through WorldBundle rebuild.
- fauna reduced-cadence/off-screen simulation.
- world-knowledge worker lifetime across rebuild.
- chunk worker pool lifetime and epoch/cache reset boundaries.

## Findings

### F24-1 — Dropped-item interaction grouping performs unbounded quadratic work every frame

**Severity:** medium  
**Expected ROI:** medium (potentially high in cluttered/long-running worlds)  
**Implementation risk:** low  
**Diagnostic evidence already exists:** no dedicated timing; code evidence is direct  
**Safe without new profiling:** yes for the algorithmic fix, provided behavior-equivalence tests are added  
**Benchmark before implementation:** not required; post-change stress benchmark is recommended

**Exact flow**

```text
requestAnimationFrame
→ gameLoop.tick
→ buildInteractables(...)
→ droppedItems.nodes()
→ groupDroppedItemCandidates(items)
→ pairwise grouping
→ group reconstruction
→ per-group droppedItems.nodes().find(...)
```

**Files / symbols**

- `src/app/gameLoop.ts` — calls `buildInteractables()` in the normal frame interaction path.
- `src/app/interactables.ts::buildInteractables`.
- `src/app/interactables.ts::groupDroppedItemCandidates`.
- dropped-item registry `nodes()` consumer in the same function.

**Evidence**

`groupDroppedItemCandidates()` currently:

1. allocates `parent = items.map(...)`;
2. performs a nested `for i / for j` pairwise comparison over the entire dropped-item array;
3. allocates a fresh `Set`, groups array and per-group `members` arrays;
4. for every emitted root, scans the entire array again to collect members;
5. maps members again to produce `memberIds`;
6. after returning to `buildInteractables()`, every group performs another `droppedItems.nodes().find(...)` to recover the first record.

This work is executed as part of the ordinary interaction candidate rebuild rather than only when dropped items change.

**Complexity / cadence**

- pairwise union stage: O(D²);
- group member reconstruction: O(D²) worst case;
- first-record lookup: O(G·D);
- multiple temporary arrays/objects/sets per frame.

`D` is dropped-item count and is not inherently bounded by nearby interaction range.

**Expected runtime impact**

At small D this is negligible. In a long-running world or a player-created clutter case the cost grows quadratically and creates GC pressure in a frame path that already contains simulation and rendering work. The defect is therefore scaling-related rather than a claim that current settlement-heavy numbers are already dominated by this code.

**Existing diagnostics**

No dedicated interaction-category timing was found. Existing performance diagnostics cover NPC/fauna/render/streaming better than this path.

**Existing plan coverage**

No current plan covers this interaction-specific dropped-item grouping cost.

**Recommended action**

Create focused plan `ui-input-027-interaction-candidate-dropped-item-scaling.md`.

Preferred direction:

- preserve `Interactable` as the per-frame adapter;
- narrow dropped-item work to a player-local candidate set before grouping;
- replace all-pairs grouping with a small spatial bucket/grid or equivalent bounded neighbor lookup;
- avoid repeated registry `nodes()` calls and repeated `find` scans;
- preserve source order/stable target identity semantics;
- do not introduce a global interaction manager or worker.

---

### F24-2 — Main-thread long-frame stall remains real, but current evidence does not prove a new optimization target

**Severity:** observation  
**Expected ROI:** potentially high if attribution identifies the owner  
**Implementation risk:** medium if optimized without attribution  
**Diagnostic evidence already exists:** yes  
**Safe without new profiling:** no  
**Benchmark before implementation:** yes — focused long-frame attribution

**Exact flow**

```text
requestAnimationFrame
→ gameLoop.tick
→ ChunkManager.update / terrain-streaming work
→ render
```

**Files / evidence**

- `docs/performance/audits/2026-09-14--main-thread-frame-spike-trace.md`.
- trace confirms ~577 ms scripted animation-frame work and ~583.5 ms longest frame.
- river/terrain functions (`flowFactor`, `riverChannelSegmentsNear`, `sampleApronGridWeighted`) are strong sampled leads, but the trace lacks per-sample `timeDeltas`.
- `docs/performance/results/2026-09-18--028--benchmark-settlement-heavy.md` still contains substantial long frames with a large unlabeled/OTHER share.

**Conclusion**

A main-thread stall is confirmed, but a specific new fix is not. Optimizing river/terrain purely from sampled frequency would violate the evidence threshold of this audit.

**Existing plan coverage**

The current performance audit already prescribes the correct next step: coarse long-frame stage attribution around streaming/river/chunk preparation. Existing terrain/render performance plans should not be expanded until that attribution identifies their owner.

**Recommended action**

Do not create a new implementation plan from this review. Run the focused attribution benchmark before selecting a production fix.

## Architecture observations

### Fauna proximity is no longer a current N×N finding

`fauna-042-fauna-proximity-and-population-scan-cost.md` is implemented on current `main`.

Current code has:

- fauna-owned runtime spatial hash;
- one proximity rebuild per wild-fauna pass;
- reusable occupancy bookkeeping;
- local candidate queries with live radius predicates.

Do not recreate a second fauna index or move fauna sensing to a worker.

The 2026-09-18 settlement-heavy benchmark predates this implementation, so its old `nearest candidates checked` numbers are useful historical evidence only, not the current source of truth.

### NPC crowd/social complexity is not currently a high performance finding

The settlement-heavy benchmark reports:

- NPC crowd pass: ~0.0 ms/frame;
- social: ~0.0 ms/frame.

`npc-060` is already implemented and removes unnecessary frame-rate social candidate materialization on idle frames. Static complexity alone is therefore not enough to justify another NPC spatial-index plan.

### Transport registry growth is already fixed

`settlements-npcs-053` is implemented. Current transport ownership is active-registry oriented rather than retaining terminal session history. Do not rediscover the old unbounded-history problem.

### Rendering remains the largest measured sustained budget, but it is already split into focused plans

Existing ownership is adequate:

- `world-terrain-039` — N8AO / post-process budget;
- `world-terrain-040` — vegetation render budget;
- `world-terrain-041` — agent presentation render LOD;
- `settlements-019` — settlement render submissions;
- `world-terrain-038` — completed shadow caster/content budget.

The 2026-09-18 settlement-heavy benchmark reports roughly 45.8 ms RENDER versus 7.3 ms NPC and 3.7 ms FAUNA. This supports keeping render work in those existing plans rather than creating another generic performance plan.

### Worker usage is appropriately narrow

Production worker ownership remains concentrated in `src/terrain/chunkWorkerPool.ts`, including chunk tile/mesh/grass and world-knowledge work.

`world-030` already corrected the important anti-pattern where expensive deterministic request preparation happened synchronously before `postMessage`.

No reviewed NPC/fauna/interaction recurring loop justified worker transfer: their state is mutable, local and small enough that cadence/indexing/batching is the safer lever. For F24-1, worker communication would be strictly worse than avoiding the unnecessary global quadratic scan.

## Cross-domain dependencies / follow-ups

- Area 20 (Interaction & input routing) should reuse the F24-1 plan rather than independently redesign interaction target ownership.
- Area 06 (Rendering & graphics runtime) should consume the existing render-budget plans and benchmark evidence.
- Area 04/06 follow-up diagnostics should own the unresolved main-thread terrain/render attribution rather than this audit inventing a root cause.
- Future high-population fauna benchmarks should use the post-`fauna-042` diagnostics (`proximity rebuild`, `proximity queries`, `spawner bookkeeping`) before proposing further indexing.

## Existing plans that already cover findings / risks

- `fauna-042-fauna-proximity-and-population-scan-cost.md` — implemented; broad wild-fauna proximity scan issue no longer current.
- `npc-060-social-pairing-cadence-and-allocation.md` — implemented; social frame-rate scanning/allocation reduced.
- `settlements-npcs-053-active-transport-order-registry-lifecycle.md` — implemented; terminal transport history no longer grows active registry.
- `world-030-world-knowledge-research-main-thread-freeze.md` — implemented; heavy deterministic world-knowledge reconstruction moved behind the existing worker boundary.
- `world-terrain-039-n8ao-post-process-cost-budget.md`.
- `world-terrain-040-vegetation-render-budget-v2.md`.
- `world-terrain-041-agent-presentation-render-lod.md`.
- `settlements-019-settlement-render-submission-budget.md`.

## New plans required

1. `ui-input-027-interaction-candidate-dropped-item-scaling.md` — F24-1.

No new plan is created for the main-thread terrain/river stall because the owner is not yet proven.

## Verification limits

- Static source review plus existing benchmark/trace artifacts only.
- No browser verification was run.
- No new performance benchmark was run by the audit agent.
- Historical benchmark values are not treated as proof for code paths that were subsequently changed (notably `fauna-042`).

## Master status update

Area 24 is **reviewed**. No unresolved high/critical finding is proven by current evidence.

Follow-up plan: `ui-input-027-interaction-candidate-dropped-item-scaling.md`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
