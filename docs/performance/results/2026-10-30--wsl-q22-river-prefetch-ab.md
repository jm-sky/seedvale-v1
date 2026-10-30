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

## Decisive rerun attempt — n = 3, 90 s `stream` (Opus, 2026-10-30) — **incomplete**

Author request: repeat with n = 3 per arm and decide on good evidence. Added structural counters first: `report.riverTiles` = river tile cache delta over the measured window (`9d354b7c`), and `?benchDuration=` (`ec68219a`) for a 90 s route (~1.3 km, ~5 new 256 m tiles instead of 1–2). Planned order A B B A A B, SHA `ec68219a` (+ docs-only `557e2b9f`), no `dirtyRuntimePaths` in any kept rep. A1/B2 were served by an orphaned Vite from the earlier session (same working tree, current code — `riverTiles` present; SHA label stale only); B1/B3 by a fresh Vite.

| Rep | Arm | FPS | p50 ms | p95 ms | p99 ms | max ms | hitches | ≥ 80 ms | RENDER p50 | sync computes | sync ms total | sync ms max | store hits | prefetched |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | A | 32.1 | 15.6 | 33.5 | 164.4 | 7594 | 43 | 28 | 9.9 | 13 | 511.6 | 52.3 | 0 | 0 |
| B1 | B | 30.3 | 15.9 | 37.4 | 168.8 | 7611 | 63 | 26 | 9.6 | 0 | 0 | 0 | 13 | 26 |
| B2 | B | 31.3 | 15.7 | 33.2 | 180.3 | 7659 | 44 | 24 | 9.7 | 0 | 0 | 0 | 13 | 27 |
| B3 | B | 31.1 | 15.6 | 36.6 | 162.4 | 7632 | 40 | 25 | 9.6 | 0 | 0 | 0 | 13 | 26 |

**Structural evidence (now shown):** the prefetch removes every main-thread river tile compute on this route — A: 13 sync computes, 512 ms total, worst 52 ms per 90 s window; B: 0 sync computes, all 13 tiles served from the store (26–27 worker results accepted). Deterministic across all three B reps.

**Timing guards: not decidable.** A has n = 1 — A2/A3 (and A2/A3/B1/B3 in a first attempt) never started: the run timed out waiting for the benchmark. A console probe of one A rep shows the cause: `[chunkWorkerPool] worker error` → `chunk generation failed` 3 s after load, and the world never reaches `ready` (§ boot flake below). B's mean FPS 30.9 vs A 32.1, p95 35.7 vs 33.5, hitches 49 vs 43 are inside what a single A rep can tell; no regression or gain claim.

**Decision: default stays OFF** until A has n ≥ 3. With the structural part now proven, the CPU-slice rule needs only the "no regression" half: a clean A/B with n = 3 per arm that shows no p95/p99/hitch regression → flip the default on.

### Findings from this attempt

1. **Boot flake (blocks benchmarks):** intermittently a chunk worker fails at startup (`worker.onerror` without a message, `chunkWorkerPool.ts:154`), chunk generation fails, and the page stays in loading for 8+ min. It happened in 7 of 11 attempts (4/6 first batch, 2/4 rerun, 1/1 console probe) across both arms and both Vite instances; the worker module itself serves fine (HTTP 200) afterwards. Not yet known whether it predates `78797d19`…`ec68219a` (none of those touch the worker imports) or is a Vite-dev module-graph race on a fresh profile. → queue Q24.
2. **Multi-second NPC frames on the long route (Track E):** every 90 s rep, both arms, has three frames of ~7.6 s, ~5.4 s and ~4.5 s whose time is entirely in the `NPC` category (`simulateMs` ≈ frame, render ≈ 10 ms). The 30 s route never reached them (max ≈ 1.2 s, `WATER`). These dwarf the whole river-tile cost (≈ 0.5 s per window) and are the largest travel stutter seen so far. → queue Q25.
3. The ≥ 1 s `max` noted above for the 30 s route is a different event (`WATER`/`RENDER` first use).

Artifacts: `wsl/q22n3-{A1,B1,B2,B3}-stream-rep1.*`. Probe log (console capture of a failed A rep) is not kept in the repo.
