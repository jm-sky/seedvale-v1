# Q22 E2 — river tile worker prefetch, WSL `stream` A/B (2026-10-30)

**Platform:** WSL2 (kernel 6.18.33.2, Chrome headed, `D3D12 (Intel Arc 140V)`). Not comparable with Windows numbers.
**Fixture:** `tools-001-v1`, seed 42, High, scenario `stream`, 30 s, fresh profile per rep, 30 s cooldown. Order A B B A, n = 2 per arm.
**A** = default (`riverPrefetch` off), **B** = `&riverPrefetch=1`.
**SHA:** A1/B1 served `2e6bb561` (B1 HEAD label drift only, no runtime diff); B2r/A2r served `251a830f` from a clean `git worktree` (no `dirtyRuntimePaths`; `src` identical to `2e6bb561`).
**Excluded:** the first B2/A2 reps (`dirtyRuntimePaths`: another session's uncommitted Q16 edits were served); their artifacts were deleted.

| Rep | Arm | mean FPS | p50 ms | p95 ms | p99 ms | max ms | hitches | ≥ 80 ms | RENDER p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | A | 32.7 | 21.3 | 65.6 | 193.8 | 1175 | 35 | 21 | 13.7 |
| A2r | A | 31.9 | 22.9 | 68.6 | 164.5 | 1221 | 26 | 21 | 14.9 |
| B1 | B | 31.4 | 22.8 | 60.2 | 197.7 | 1167 | 30 | 19 | 14.8 |
| B2r | B | 33.6 | 21.3 | 52.7 | 191.1 | 1139 | 22 | 17 | 14.0 |

Arm means — A: FPS 32.3, p50 22.1, p95 67.1, p99 179, max 1198, hitches 30.5. B: FPS 32.5, p50 22.1, p95 56.5, p99 194, max 1153, hitches 26.

## Reading

- **No regression** beyond same-arm spread (A1 vs A2r differ as much as A vs B on every metric; p99 is the only mean that is worse in B, within the A1/A2r range 164–194 vs B 191–198 — borderline).
- **No demonstrated gain.** Differences are inside n = 2 noise. The 1.1–1.2 s `max` frame is a one-off loading/first-use frame present in every rep, unrelated to river tiles.
- **No structural evidence:** the artifact does not expose `riverTileBuild` stage counts or `riverTileCache.stats` (`syncComputes` / `storeHits` / `prefetched`), so "sync computes went down" is not shown. The only river hitch label (`chunk river`, 1 × 16.6 ms) is in B1.

## Decision (CPU-slice rule, queue §0)

The rule needs no regression **and** a gain estimated from structural evidence. The second part is missing → **default stays OFF** (`?riverPrefetch=1`). Not a revert: the slice is bounded and falls back to the previous synchronous path.

Follow-up for a decisive run: export `riverTileCache.stats` (and the `riverTileBuild` stage count/max) in the benchmark artifact, then repeat `stream` with a longer/farther route so more tiles are crossed (this 30 s route at 14.4 m/s ≈ 430 m crosses ~1–2 new 256 m tiles per rep, too few to see a difference).
