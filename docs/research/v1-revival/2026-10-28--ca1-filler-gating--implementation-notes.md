# Track C — CA1 filler gating: implementation notes

**Date:** 2026-10-28 · **Status:** implemented + technically verified; **browser/visual acceptance PENDING**; C0 **not certified** (no comparable baseline was available, none was created); CA2 **not started**.

## Problem confirmed in current code
`computeChunkGrass` always ran the filler pass (`2 × candidatesPerChunk` candidates) and `ensureGrass` requested every chunk within `effectiveGrassRadius`. `grassFillerLodFraction(dist, fillerRadius, lodScale)` is `0` for `dist >= fillerRadius`, with `fillerRadius = 1 + grassFillerCoverage·(effectiveGrassRadius − 1)`. Default grass radius is 2 (`worldConfig.ts`), so filler coverage 0 / 0.35 / 0.6 (Low / Medium / High, `qualityProfiles.ts`) displays filler only for chunk distance 0 / ≤1 / ≤1; ring-2 chunks (16 of the 25 in the grass square) generated, transferred and held filler that was never submitted.

## Mechanism
- **Threshold source:** `grassFillerRadius()` / `grassFillerWanted(dist)` (`dist < fillerRadius`) in `chunkManager.ts` — the exact support of `grassFillerLodFraction`; `lodScale` is clamped ≥ 0.25 so it never zeroes the fraction.
- **Generation gating:** `GrassComputeParams.mode?: 'full' | 'main' | 'filler'` (`grassPlacement.ts`). `ensureGrass` requests `'full'` inside the filler range, otherwise `'main'` (no filler pass, no filler arrays, nothing to transfer).
- **Entering the range:** `syncFillerForRecord` (called from `syncGrassForRecord`, the main-request completion and `setGrassFillerCoverage`) issues a **filler-only** worker request keyed `${chunkKey}#filler` (separate pool key so it never cancels the main request) and attaches the bucket with `WorldGrassChunk.attachFiller`. A chunk whose main grass was empty (`grass === null`) becomes a filler-only `WorldGrassChunk`.
- **Leaving the range:** one-chunk hysteresis — filler is kept while `dist < fillerRadius + 1`, then `releaseFiller()` disposes its mesh/geometry/instance buffers (a filler-only chunk is disposed and returns to `null`). In-flight filler requests are cancelled; `removeGrass` also cancels them.
- **Stale protection:** each request has a monotonic `grassFillerRequestId` on the record; a completion whose id changed, whose chunk was unloaded, or which is now beyond the keep distance is discarded. `attachFiller` is a no-op if filler is already resident (no duplicate meshes).
- The existing `setLodFraction` filler logic is untouched and still decides what is drawn.

## Determinism / RNG
Main pass RNG is unchanged: main buckets are byte-identical in `main` and `full` modes and to the pre-CA1 goldens (snapshot diff touches only the `filler` entries). Filler previously continued the main RNG stream, so it could not be generated without running the main pass; it now has its own stream (`seed ^ hashChunk ^ FILLER_RNG_SALT`). **Consequence:** filler blade positions/colours differ from pre-CA1 builds for the same seed (same eligibility, density and distribution; counts changed within ~1 % in the three golden chunks). Filler is decorative, not saved, and there is no persistent grass cache, so no cache namespace needed a bump. Per chunk, filler is now identical regardless of load order, travel path, rebuild timing, or whether it was generated alone or with the main pass.

## Files / symbols
`src/terrain/grassPlacement.ts` (`GrassComputeMode`, `computeChunkGrass`), `src/terrain/grass.ts` (`addBucket`, `attachFiller`, `releaseFiller`, `hasFiller`, `hasMain`), `src/terrain/chunkManager.ts` (`grassFillerRadius/Wanted/Kept`, `syncFillerForRecord`, `ensureGrass`, `removeGrass`), tests `grassPlacement.test.ts` (+snapshot), new `grassFillerLifecycle.test.ts`.

## Verification
- Technical: targeted vitest (`grassPlacement`, `grassFillerLifecycle`, `chunkManager`, `distanceLod`, `src/perf`) pass; eslint on `src/terrain` clean; `tsc --noEmit` has no errors outside pre-existing `src/ui-vue` ones.
- Covered: distant (`main`) mode emits no filler; near (`full`) keeps it; filler-only equals filler-with-main and re-generation; order independence; boundary `dist < radius` ⇔ filler fraction > 0 for several radii/lodScale; attach/release/re-attach, no duplicate mesh, disposal.
- **Not covered by automated tests:** `ChunkManager`-level streaming (cancel / out-of-order completion / unload during pending) — `chunkManager.test.ts` has no manager harness; this logic is verified by code review only.
- **Measurements:** none taken. Expected effect by arithmetic only: no filler pass/arrays for ring-2 chunks at default radius. Do not compare with historic diagnostic 032. Manual handoff: in a grass-rich scene use the C0 runbook (`docs/performance/2026-10-27--arc-baseline-runbook.md`) and compare resident filler (`snapshotScene`), worker grass time and stream hitches before/after this commit.

## Remaining risks
Filler regeneration on approach adds one worker job per chunk entering the range (late-pop possibility at high speed — needs eyes-on check); filler positions changed once vs. pre-CA1 (visual A/B pending); `ChunkManager` lifecycle untested automatically.
