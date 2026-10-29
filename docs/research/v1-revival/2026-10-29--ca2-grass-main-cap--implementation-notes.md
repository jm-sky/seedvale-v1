# Track C — CA2 far-band main grass storage cap: implementation notes

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Commit:** `0cfb9ed3` · **Status:** implemented and technically verified. Browser/visual acceptance is **pending** (queue §2). WSL A/B: **green light**. Resident main fell 47–69 %, submitted was identical, no grass hitch ([report](../../performance/results/2026-10-29--wsl-ca2-grass-main-cap-ab.md)). Native Windows confirmation: queue §4.

## Problem (CA1 A/B evidence)

After CA1, the Windows `forest` run held **616k resident main instances but submitted 266k** ([CA1 A/B](../../performance/results/2026-10-28--win-ca1-filler-gating-ab.md)). `densityLodFraction` puts every chunk in the outer grass ring at its floor (`DENSITY_LOD_FLOOR = 0.08`). At the default grass radius 2, that is 16 of the 25 chunks. Each of them generated, transferred, uploaded and kept 100 % of its main blades, and drew 8 %.

## Mechanism

- **One count formula.** `grassLodCount(potential, f) = max(1, min(potential, round(potential·f)))` (`grassPlacement.ts`). Both the placement cap and `WorldGrassChunk.setLodFraction` use it, so a capped bucket holds exactly what the LOD draws.
- **Cap at request time.** `chunkManager.ts` `grassMainCapFor(dist)` returns the main fraction only when it sits at the floor; otherwise it returns `undefined` (no cap). `ensureGrass` passes it as `GrassComputeParams.mainCapFraction`.
- **Worker side.** `computeChunkGrass` runs placement unchanged: same RNG stream, eligibility and bounds. It then keeps the first `grassLodCount(count, cap)` instances of each main bucket and records `potentialCount`. Filler is never capped.
- **Draw side.** `setLodFraction` computes main counts from `potentialCount` and clamps them to what is stored.
- **Regrowth on approach.** `syncMainForRecord` runs on every grass sync, after the first main completion, and on `setLodScale`. If `needsMainRegrowth(mainFrac)`, it requests an uncapped `'main'` placement under the key `${chunk}#main`. That key is separate from the main and filler pool keys, so neither cancels it. On completion, `replaceMain` swaps the main buckets (filler untouched) and LOD, geometry tier and debug visibility are re-applied. Stale/unloaded completions are dropped by a monotonic request id (shared counter with the CA1 filler, renamed `grassSideRequestSeq`). `removeGrass` cancels in-flight requests.
- **Toggle.** `?grassMainCap=0` (`perf/flags.ts` `isGrassMainCapEnabled`, read once per world build) restores pre-CA2 storage for the A/B.

## Determinism and visual identity

- Stored blades are a byte-identical prefix of the uncapped result: matrices, phases, base/tip colours, wind factors and bounds (test). The regrown chunk is the full uncapped result, so its prefix is the blades already shown. No blade moves or changes colour; regrowth only adds instances.
- 🟡 **Only visible difference: timing.** Before CA2, a chunk stepping from the floor band to the next band (Chebyshev 2 → 1) switched from 8 % to ~76 % density in one `setLodFraction` call. Now it keeps 8 % until the worker result lands, a few frames later. That chunk is at least one chunk width (64 m) away when it changes band. The density pop itself already existed and is unchanged. Near-field bands (fraction above the floor) are never capped, so the player's own and adjacent chunks never wait.
- No persistent grass cache exists, so no cache namespace bump is needed. Saves are unaffected.

## Files / tests

`src/terrain/grassPlacement.ts` (`mainCapFraction`, `potentialCount`, `grassLodCount`), `src/terrain/grass.ts` (`needsMainRegrowth`, `replaceMain`, `potentialCount`, `userData.grassPotentialCount`), `src/terrain/chunkManager.ts` (`grassMainCapFor`, `grassRequestParams`, `syncMainForRecord`), `src/perf/flags.ts`.

Tests:
- `grassPlacement.test.ts` "main storage cap (CA2)": prefix identity across the golden chunks; filler is not capped; cap ≥ 1 or no cap leaves the result unchanged.
- `grassFillerLifecycle.test.ts` "capped main regrowth (CA2)": draw counts equal the uncapped chunk at or below the cap; regrowth is flagged above it; `replaceMain` keeps filler and disposes the old mesh.

`vitest src/terrain src/perf`: 749 passed. `vue-tsc` and ESLint are clean.

**Not covered automatically:** `ChunkManager`-level streaming (in-flight regrowth during unload, out-of-order completion). Same gap as CA1. It is covered by code review and the `stream` benchmark run only.

## Measurement

See [WSL A/B](../../performance/results/2026-10-29--wsl-ca2-grass-main-cap-ab.md). Metrics: resident vs submitted main instances, estimated grass allocation, GRASS hitches and frame tails. **Not an FPS claim.**

## Remaining risks

- One extra worker job per chunk that leaves the floor band. It shifts upload work from stream-in to approach rather than adding it, but the hitch profile needs the `stream` check.
- Late density fill-in on fast travel: author visual check (queue §2).
