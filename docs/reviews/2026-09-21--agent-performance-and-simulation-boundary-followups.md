# Agent Performance and Simulation Boundary — Audit Follow-ups

**Date:** 2026-09-21  
**Scope:** NPC + fauna performance, simulation independence, presentation/rendering boundary, world-query ownership  
**Status:** follow-up notes after audit; not an implementation plan

## Purpose

This review preserves findings from the 2026-09-21 NPC/fauna cross-sectional audit that were not promoted directly into implementation plans.

The highest-ROI or correctness-critical findings were split into dedicated draft plans. The remaining items below are intentionally kept as review/watchlist material until new measurements or code changes justify a plan.

## Findings promoted to draft plans

- `world-terrain-050-agent-performance-render-census-and-lod.md`
  - agent rendering census and extension of presentation-only LOD/culling.
- `npc-063-agent-performance-update-cost-attribution.md`
  - bounded attribution of NPC runtime CPU cost before changing cadence.
- `settlements-npcs-057-agent-performance-offscreen-pack-animal-continuity.md`
  - merchant pack animal detailed/off-screen lifecycle continuity.
- `npc-064-agent-performance-spatial-state-seam.md`
  - first small seam separating runtime spatial authority from Three.js presentation transforms.
- `fauna-048-agent-performance-village-query-scaling.md`
  - remaining fauna × village/settlement scaling shape.

## Other findings / watchlist

### 1. Camera and render visibility are not currently simulation gates

Current architecture does not appear to gate NPC/fauna simulation on camera visibility, frustum state or `mesh.visible`.

The existing agent presentation LOD is presentation-only. This is an important invariant to preserve in all future rendering work.

No separate plan is needed unless a future implementation introduces camera-driven simulation behavior.

### 2. Player distance still affects simulation fidelity

Camera independence does not mean complete observer independence.

Player position currently influences:

- settlement streaming / detailed resident materialization,
- parts of fauna update cadence,
- presentation frequency and some social/player-facing reactions.

This is acceptable only while detailed ↔ off-screen transitions preserve authoritative world continuity.

The main concrete defect found in this area was merchant pack-animal continuity and is covered by `settlements-npcs-057`.

Future changes to settlement streaming should continue to treat player distance as a **fidelity selector**, not as world-existence authority.

### 3. NPC and AnimalAgent remain structurally broad runtime controllers

Both agent classes combine substantial simulation behavior with Three.js presentation/runtime concerns.

This is not automatically a correctness bug, and a broad refactor would have poor ROI today.

The most important concrete structural coupling is live position through `Object3D.position`, covered by `npc-064`.

Do not create a generic "split all agents into simulation/controller/view" plan unless measured or correctness-driven pressure demonstrates a smaller seam is insufficient.

### 4. Fauna cadence is already meaningfully importance-aware

The existing fauna cadence distinguishes immediate/active/routine work and preserves important situations such as threat, combat, fleeing, traversal and player-coupled states.

Do not create another generic fauna distance-throttling plan without evidence. The current policy already provides the main mechanism and should be extended rather than replaced if future profiling identifies a specific hot path.

### 5. Existing fauna proximity indexing should remain the shared mechanism

`fauna-042` already introduced a derived runtime coarse spatial lookup for common proximity work.

Current measurements indicate that this mechanism itself is cheap enough that another general fauna spatial index would likely duplicate ownership and increase complexity.

Future fauna query optimizations should reuse it where semantically appropriate or reuse an existing world/settlement spatial authority for non-fauna data.

### 6. Ground and water query ownership is in a better state

Recent work moved NPC/fauna toward injected canonical resident/runtime ground and local-water queries.

This is the preferred direction:

```text
world spatial authority
    -> shared query contract
    -> NPC/fauna behavior-specific interpretation
```

Do not reintroduce agent-local terrain or water approximations when a canonical world query already exists.

No follow-up plan is currently justified unless a concrete divergence is found.

### 7. Collider candidate volume is worth watching, not optimizing yet

Settlement-heavy diagnostics showed a high candidate count in some livestock collider queries even though measured wall-clock cost remained small.

This is currently a **scaling signal**, not a proven bottleneck.

Promote to a plan only if:

- collider query wall time becomes material in a representative benchmark,
- population density rises substantially,
- or candidate volume causes GC/memory/cache effects not visible in current timers.

Avoid speculative spatial-index work solely from candidate counts.

### 8. Livestock "duplicate updates/frame" diagnostics require identity validation

A benchmark diagnostic reported duplicate livestock updates per frame.

Because livestock identity has recently moved toward settlement-qualified/canonical references, a diagnostic keyed only by bare `animalId` could report collisions between different settlements as duplicates.

Before treating this as a runtime double-update bug:

1. inspect the diagnostic key,
2. verify it uses canonical persistent livestock identity,
3. only then investigate actual duplicate tick ownership.

Do not create a correctness plan from the current number alone.

### 9. Presentation/animation CPU may be hidden inside the broader NPC category

The settlement-heavy benchmark reports significant NPC category wall time, but that number is not yet cleanly equivalent to cognition/decision CPU.

Animation mixers, labels, presentation work, livestock and manager-level work may contribute.

This is intentionally covered first by `npc-063`. Avoid creating separate mixer/cadence plans until attribution proves a distinct hotspot.

### 10. Shadow cost is meaningful but is not clearly an agent-only problem

The settlement-heavy isolation benchmark showed a noticeable no-shadows improvement.

However, current evidence does not establish whether the best next shadow optimization belongs to agents, settlements, vegetation or the global shadow budget.

Keep this in the broader performance direction rather than attaching it prematurely to the agent-performance series.

If a render census shows skinned agents are a major shadow-pass cost, fold that evidence into `world-terrain-050` rather than creating a parallel shadow plan immediately.

## Architectural invariants to preserve

Future work in the `agent-performance` series should preserve:

- simulation/world state independent from camera visibility,
- render LOD as presentation policy, not simulation authority,
- player distance may select fidelity but must not erase world continuity,
- one canonical spatial/world-query authority for each kind of state,
- detailed/off-screen transitions must preserve identity and persistent consequences,
- importance/threat/combat states override aggressive throttling,
- reuse existing proximity, cadence, streaming and presentation mechanisms before introducing parallel systems,
- measurement before broad cadence or spatial-index changes.

## When to create additional plans

Create another plan from this review only when at least one of these is true:

- a benchmark shows a material, repeatable cost,
- a concrete lifecycle/correctness defect is reproduced,
- an existing `agent-performance` plan exposes a required dependency,
- scaling tests show the current shape is no longer bounded enough.

Otherwise keep the item here as audit context rather than expanding the implementation queue.
