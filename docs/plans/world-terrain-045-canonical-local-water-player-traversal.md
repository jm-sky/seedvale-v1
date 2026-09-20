# Plan: Canonical local water player traversal

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** high · **Effort:** M
**Depends on:** world-terrain-044
**Domain:** `world-terrain`
**Type:** `fix`
**Roadmap:** -

## Goal

Make detailed player traversal use the same authoritative local physical-water sample as fauna and make missing runtime river authority explicit instead of silently treating an absent chunk record as dry river state.

Do not redesign swimming, hydrology or terrain generation.

## Confirmed defects

### Player bypasses local river water

`PlayerController` decides world-water ownership from the scalar global `waterLevel` and `sampleFloor`. River water is represented separately by per-segment `waterH` / `bedH`.

As a result, an elevated river can be physically present for fauna/rendering while player swimming/wading still sees only the global plane.

### Missing owning chunk means "no river"

`ChunkManager.sampleLocalWater()` can read analytical fallback terrain/floor through `readField()`, but uses:

```ts
rec?.riverGameplaySegments ?? []
```

for river state.

That mixes two availability contracts in one answer. A missing/generating runtime chunk is silently interpreted as having no river.

## Implementation

### 1. Define resident local-water availability

Align with `world-terrain-044`'s runtime ground contract.

Expose a detailed/runtime local-water query whose result distinguishes:

- authoritative resident sample available;
- authoritative resident sample unavailable.

Do not return "dry" merely because retained runtime river data is missing.

Keep a separate deterministic/off-screen analytical capability only where a caller genuinely needs it; do not make detailed movement generate chunks or hydrology.

### 2. Migrate player detailed water ownership

Thread the canonical local-water query to `PlayerController`.

Player vertical/water logic should use the sample's:

- `present`;
- `waterSurfaceHeight`;
- `floorHeight`;
- `depth`;

rather than recomputing presence from `ground.height <= waterLevel`.

Preserve:

- cave/spatial-context exclusion from `worldWaterAppliesInCurrentSpace`;
- current shallow/deep swim thresholds unless a test proves they depend on the old global-plane assumption;
- normal ground/bridge authority from `world-terrain-044`;
- ford floor projection already embedded in river physical sampling.

Do not make render meshes authoritative.

### 3. Missing sample behavior

When the required runtime water/ground sample is unavailable during detailed movement, choose an explicit conservative movement result consistent with `world-terrain-044` (hold/block/retry rather than guessing dry/wet from partial state).

Avoid player teleport/rescue or implicit chunk generation as the normal answer.

### 4. Keep water identity/quality separate

This plan is physical traversal only.

Do not add drinkability, river quality or shoreline interaction to `PlayerController`. `WaterSource` remains the drinking/fill contract and `world-terrain-046` owns shoreline classification/query consolidation.

## Relevant files / symbols

- `src/player/PlayerController.ts`
- `src/player/worldWaterEligibility.ts`
- `src/terrain/chunkManager.ts::sampleLocalWater`
- `src/terrain/waterSample.ts::sampleLocalWater`
- `src/app/worldBundle.ts`
- `src/app/createApp.ts`
- `src/terrain/roadBridge.ts` / ford projections only as existing integration boundaries
- focused player/water/chunk tests.

## Tests

Add focused tests proving:

1. an elevated river above global `waterLevel` is still water for the player;
2. the same point produces compatible physical-water semantics for player and fauna;
3. lake/ocean global-plane swimming remains unchanged;
4. ford floor changes depth/floor but does not erase river presence;
5. bridge deck authority does not mutate underlying water presence;
6. a missing/generating owning runtime chunk does not silently become "dry river";
7. cave/spatial-context exclusion remains intact;
8. ready → unavailable → ready residency transition cannot fabricate a dry/wet discontinuity as an authoritative result.

Prefer pure/unit tests around query and eligibility functions; no browser/asset loading required.

## Performance guardrails

- O(1) / owning-chunk runtime lookup for detailed player sampling;
- no scan of all loaded chunks per player frame;
- no hydrology/world generation in the movement hot path;
- no second mutable water cache;
- reuse retained river gameplay segments and existing terrain/ford projections.

## Guardrails

- no `WaterManager` God Object;
- no drinkability/quality logic in player movement;
- no duplicate river classifier;
- no render-state-based water authority;
- no new player-only river representation;
- no unrelated swimming feel/animation changes.

## Verification

Automated tests own physical-water and missing-runtime-data invariants.

Browser verification is performed by the User: test ocean/lake, an elevated river, a ford, a bridge and a stream-in boundary; confirm player movement/swimming follows visible physical water without changing cave behavior.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
