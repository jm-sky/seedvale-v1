# Implementation Notes: Unified water shore query and river hotpath

**Reviewed:** 2026-09-21  
**Source:** current `main` codebase + `docs/STATE.md` + `docs/plans/PLANNING.md` + plan + water/fauna audit and related implementations

## Current-code findings

The plan targets a real split still present on `main`:

- `ChunkManager.riverShoreDistance()`, `riverShorePoint()` and `riverWaterContext()` each independently scan `chunks.values()` and the retained `riverChains`.
- `resolveWaterBodyShore()` in `src/app/interactables.ts` accepts a flat-water shore hit before attempting river detection, while `sampleLocalWater()` gives an overlapping river priority.
- `RiverWaterQualityResolver.resolve(x, z)` calls `riverWaterContext(x, z)` before its cache lookup, so the quality cache does not remove hydrology rediscovery.
- `animalForaging.isDrinkableNaturalShorePoint()` rejects candidates without `shoreProbeHits(..., waterLevel)` before `naturalWaterKindAt()` can identify an elevated river.

Do not undo the optimization from `fauna-033`: `ChunkRecord.riverGameplaySegments` is already retained once per loaded chunk and `sampleLocalWater()` consumes it without rebuilding segments per query.

## Recommended query seam

Add one read-only runtime river-shore result in the terrain layer and make `ChunkManager` expose a single query that returns, from one selected nearest river candidate:

- signed bank distance;
- nearest bank/interaction point;
- the matching `RiverHydrologyContext` (or the exact source data needed to construct it);
- a stable quality-cache key if useful.

The important invariant is that distance, point and hydrology come from the **same winning river candidate**. Do not implement this as three helpers sharing only a loop wrapper while each performs its own nearest selection.

Prefer deriving the result from loaded chunk-owned retained river data. `terrain/riverQuery.ts` is the analytical/worldgen seam and may compute missing river tiles synchronously; it should not enter the per-frame interaction path.

Keep legacy `riverShoreDistance/Point/WaterContext` only as thin wrappers if other call sites still need them; interaction/fauna should use the unified query directly.

## Chunk locality / hotpath

A naïve “current chunk only” lookup is unsafe for a shore query: the nearest bank can belong to a river chain retained by a neighboring loaded chunk. Use a bounded owner+neighbor lookup or another bounded spatial selection over retained runtime data.

Do not regress to rebuilding `riverChannelSegmentsNear()` per call. `fauna-033` established that gameplay segments are prepared at chunk load and retained on `ChunkRecord`.

If the unified result needs hydrology fields not present on `RiverChannelSegment`, preserve/link the source `RiverPoint`/chain context during the nearest selection rather than reconstructing `accumulation` from width/depth.

## Flat water + river precedence

Keep `waterBodyKind.ts` as the pure body-kind policy seam, but change orchestration so flat and river evidence are available before choosing the body. River overlap should match `sampleLocalWater()` semantics: an actual river channel/shore candidate wins over the flat plane where both describe the same local water interaction.

Do not treat “a flat shore probe exists” as an early return. Add river-mouth/overlap tests because this is where call-order differences are currently observable.

The shared result should live below `app/` and `fauna/` so both consumers can depend on it without importing interaction code into fauna.

## River quality integration

Extend `createRiverWaterQualityResolver` with a path accepting already-resolved `RiverHydrologyContext` / stable key. Keep the existing coordinate-based `resolve(x,z)` only if another caller needs it.

Cache semantics stay world-scoped and non-persistent. Settlement proximity logic remains unchanged. Missing required context must still return `unsafe`.

The player `waterEdge` should therefore be assembled as:

`unified shore result -> body kind -> river quality from supplied context -> WaterSource`

with no second river lookup.

## Fauna integration

`createNaturalWaterKindAt()` currently duplicates the flat probe + `resolveWaterBodyKind` composition and is instantiated in both `worldBundle.ts` and `SettlementsManager.ts`. Migrate this factory to consume the same terrain shore/body query contract rather than teaching `animalForaging.ts` another classifier.

In `isDrinkableNaturalShorePoint()`, preserve `isWalkable` / dry-or-shallow destination checks, but remove the unconditional flat `shoreProbeHits` prerequisite. Body discovery must happen first; ocean remains rejected and route feasibility remains movement-owned (consistent with `fauna-046`).

## Tests worth pinning

Focus on contracts rather than timing:

- one river query invocation supplies bank distance + point + hydrology for player interaction;
- elevated river is found when the global `waterLevel` shore probe misses;
- river/flat overlap and river mouth follow the same precedence as physical local water;
- supplied river context lets quality resolve/cache without invoking coordinate-based river discovery;
- missing context stays `unsafe`;
- fauna accepts a valid elevated-river shore while preserving walkability/shallow constraints;
- ocean/lake behavior remains unchanged.

A spy/counter around the unified river query is preferable to a timing assertion.

## Likely files

- `src/terrain/chunkManager.ts` — unified bounded runtime river query; legacy wrappers if retained.
- `src/terrain/riverNetwork.ts` — only if a pure “nearest river result” primitive is needed to guarantee one winning candidate.
- `src/terrain/waterBodyKind.ts` — shared pure selection/result types if appropriate.
- `src/app/interactables.ts` — consume one shore/body result.
- `src/world/riverWaterQualityResolver.ts` — resolve from supplied context/key.
- `src/fauna/animalNaturalWater.ts`, `src/fauna/animalForaging.ts` — consume shared discovery without flat-plane gating.
- `src/app/worldBundle.ts`, `src/settlement/SettlementsManager.ts` — dependency wiring only.

No persistence, river generation/carving, fishing rules, poisoning semantics, mirror/reflection, or settlement-quality-policy changes are needed.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
