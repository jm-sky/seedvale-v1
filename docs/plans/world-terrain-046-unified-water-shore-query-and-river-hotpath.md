# Plan: Unified water shore query and river hotpath

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** high · **Effort:** M
**Model:** Composer · **Fallback:** Sonnet
**Depends on:** none
**Domain:** `world-terrain`
**Type:** `fix`
**Roadmap:** -

## Goal

Replace the parallel flat-water and river shoreline probes with one bounded water-body shore result that preserves body-kind precedence and can carry enough river context for interaction quality.

Use that same result for player shoreline interaction and fauna natural-water eligibility so river detection cannot be precluded by a global-water-plane probe.

## Confirmed defects

### River detection is gated out for fauna

`animalForaging.isDrinkableNaturalShorePoint()` requires `shoreProbeHits(...waterLevel)` before calling the river-aware `naturalWaterKindAt`. Elevated rivers therefore fail eligibility before river classification.

### Interaction precedence disagrees with physical water

`waterSample.sampleLocalWater()` gives river priority in overlap.

`interactables.resolveWaterBodyShore()` gives a flat lake/ocean shore probe priority and only checks river when that fails.

### Per-frame river interaction repeats loaded-chunk scans

`buildInteractables()` runs every frame. Near a river the current path can independently execute:

1. `riverShoreDistance()` — loaded-chunk scan;
2. `riverShorePoint()` — another loaded-chunk scan;
3. `riverWaterContext()` from the quality resolver — another loaded-chunk scan.

`RiverWaterQualityResolver` checks its cache only after rediscovering hydrology context, so the cache does not remove the river scan.

## Implementation

### 1. Introduce one read-only shore/query result

Extend/refactor the existing terrain water-query seam rather than adding another manager.

A result should be capable of expressing the selected nearby water body with the data current consumers need, for example:

- `kind: 'ocean' | 'lake' | 'river'`;
- shoreline/interaction point;
- distance;
- for river, retained hydrology/context or a stable context key sufficient for contextual quality.

The exact type is implementation-owned; keep it immutable/read-only.

### 2. Define one precedence rule

Make shoreline/body identity consistent with physical local-water semantics.

Where a river and flat-water domain overlap, do not let call order arbitrarily decide body identity. Reuse the existing physical-water precedence unless current hydrology data proves a more precise body-boundary rule is already authoritative.

Add overlap/river-mouth tests.

### 3. Reuse one river search

Resolve nearest relevant river data once per query and derive distance/point/context from that same selected segment/context.

Do not call separate "nearest river" scans to rediscover the same answer.

Prefer owning/neighbor chunk-local retained data or another bounded query. Do not introduce a repository-wide/global river scan in a frame hot path.

### 4. Feed contextual quality without rediscovery

Adapt `RiverWaterQualityResolver` so a caller that already has selected river context/key does not have to call `riverWaterContext()` again merely to find its cache key.

Keep:

- fail-closed `unsafe` when required hydrology context genuinely cannot be resolved;
- settlement-proximity classification;
- resolver cache lifecycle scoped to the WorldBundle;
- no persisted quality cache.

Do not resurrect `createWaterSource('river')` blanket-safe semantics in production.

### 5. Migrate consumers

Use the shared shore/body result in:

- `src/app/interactables.ts::resolveWaterBodyShore`;
- player `waterEdge` interaction construction;
- fauna natural-water kind/eligibility.

Fauna eligibility may still apply walkability/depth/traversal constraints after body discovery. It must not require an ocean/lake global-plane shore hit as a prerequisite for river discovery.

Do not change poisoning/unsafe-water gameplay.

## Relevant files / symbols

- `src/terrain/waterBodyKind.ts`
- `src/terrain/chunkManager.ts::riverShoreDistance`
- `ChunkManager.riverShorePoint`
- `ChunkManager.riverWaterContext`
- `src/app/interactables.ts::resolveWaterBodyShore`
- `src/world/riverWaterQualityResolver.ts`
- `src/fauna/animalNaturalWater.ts`
- `src/fauna/animalForaging.ts::isDrinkableNaturalShorePoint`
- focused terrain/world/fauna interaction tests.

## Tests

Add focused tests proving:

1. elevated river shore is discoverable without a flat `waterLevel` probe hit;
2. fauna natural-water eligibility can accept such a river subject to ordinary traversal constraints;
3. ocean and lake shores remain classified correctly;
4. river/flat-water overlap uses one deterministic precedence;
5. distance, shore point and river context come from the same selected river result;
6. missing river context fails quality closed to `unsafe`;
7. repeated quality lookup for the same selected context does not repeat nearest-river discovery;
8. no production river interaction falls back to static blanket-safe quality.

Add a focused performance assertion/diagnostic if the current test seams can count nearest-river scans; avoid timing-based unit tests.

## Performance guardrails

- no all-loaded-chunk scan repeated for distance + point + context in one frame;
- no per-agent global hydrology scan;
- no per-frame settlement generation beyond existing bounded/cached quality semantics;
- no new mutable water-body registry;
- reuse retained chunk river data and existing hydrology context.

## Guardrails

- do not merge physical-water depth and `WaterSource` quality into one mutable owner;
- do not create a second fauna water classifier;
- do not change player interaction targeting architecture;
- do not change fishing mechanics beyond consuming the corrected body result;
- do not modify reflection/mirror ownership;
- no unrelated terrain generation refactor.

## Verification

Automated tests own classification, precedence, quality-context reuse and river eligibility.

Browser verification is performed by the User: test shoreline prompts/drinking/fishing at ocean, lake, ordinary elevated river and river mouth, plus wild/livestock natural drinking near a river.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
