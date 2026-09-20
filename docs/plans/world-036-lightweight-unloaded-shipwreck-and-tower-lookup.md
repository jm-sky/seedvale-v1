# Plan: Lightweight unloaded shipwreck and tower lookup

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** M  
**Depends on:** ~~world-028~~  
**Domain:** `world`  
**Type:** `performance`  
**Roadmap:** -

## Problem

`world-028` removed full unloaded chunk generation from classic-landmark lookup, but intentionally left `shipwreck` and `tower` on the generic full fallback.

Current `buildLandmarkQuests` still resolves both kinds synchronously around home at `LANDMARK_QUEST_SEARCH_CHUNK_RADIUS = 10`. A miss can inspect 441 chunks, and each unloaded candidate can still run:

```text
computeChunkTile()
→ computeChunkEnvironment()
→ search requested landmark
```

The caller needs only one deterministic landmark placement.

## Goal

Give `shipwreck` and `tower` the same lightweight unloaded-lookup property already achieved for cemetery/classic landmarks while preserving exact streamed-generation placement and identity.

Do not add a global landmark registry or a cache that merely hides the first expensive lookup.

## Existing mechanisms to reuse

Use `world-028` as the implementation pattern:

- `src/terrain/unloadedLandmarkLookup.ts`;
- shared deterministic placement resolver consumed by both streamed generation and unloaded lookup;
- `createLocalTerrainSampler` or the smallest extension of its read-only terrain view;
- `ringChunkOffsets()` search ordering;
- parity tests comparing lightweight placement with `computeChunkEnvironment()`.

Do not reopen the already-extracted monolith/stoneCircle/smallRuins work.

## Implementation

### 1. Recon exact placement inputs

Before extracting code, enumerate exactly which current `computeChunkEnvironment()` inputs each kind reads.

Expected differences from classic landmarks include shoreline/continentalness and footprint-related gates. Use current code, not assumptions from `world-028`.

### 2. Extract shared deterministic resolvers

Create the smallest pure/shared placement resolver(s) needed so streamed `computeChunkEnvironment()` and unloaded lookup consume the same logic.

Preserve exactly:

- RNG salts and call order;
- occurrence chance;
- terrain/water/road/slope/shore gates;
- footprint validity;
- position, id, scale, rotation and variant;
- chunk search ordering.

Do not implement a second approximate placement algorithm.

### 3. Extend only the necessary lightweight terrain view

If shipwreck/tower need fields not currently exposed by `createLocalTerrainSampler`, expose only those fields already derivable from the same canonical chunk texel/world sampling primitives.

Do not allocate a full `ChunkTileData` or vegetation/environment record.

### 4. Route unloaded lookup

Update `resolveUnloadedLandmark()` so `shipwreck` and `tower` use the lightweight resolver.

The production performance diagnostic for these kinds should no longer report `(unloaded, full)`.

Loaded chunks continue to read their already-generated environment.

### 5. Tests

Contract tests should cover:

1. hit and miss parity for both kinds across representative seeds/chunks;
2. exact id/x/z/scale/rotation/variant parity;
3. terrain/shore/footprint rejection parity;
4. lightweight sampler result equals the full generation inputs;
5. query-order independence;
6. unloaded lookup does not call `computeChunkTile()` for these kinds;
7. loaded lookup remains unchanged;
8. `ringChunkOffsets()` order/radius semantics unchanged.

## Verification

Automated/static verification only during implementation:

- targeted Vitest tests;
- typecheck/lint/build required by the repository.

Performance benchmark/browser verification belongs to the User. This plan does not claim a wall-clock improvement until measured.

## Guardrails

- No reduced search radius as a performance shortcut.
- No rarity/chance changes.
- No quest disabling/lazy-quest redesign.
- No new global landmark registry.
- No cache-only workaround.
- No unrelated chunk-generation refactor.
- Do not run browser verification.
- Add JSDoc with an appropriate `@domain world` or `@domain world-terrain` tag to new public placement helpers as ownership requires.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
