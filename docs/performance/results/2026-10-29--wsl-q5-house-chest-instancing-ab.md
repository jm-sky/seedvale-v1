# Q5 — interior house chest instancing, WSL2 A/B (settlement-heavy)

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Platform: WSL2** (Chrome, ANGLE → OpenGL → Mesa D3D12, Intel Arc 140V). **Do not compare with Windows numbers.**
**Verdict: WSL green light (submission slice), per the CPU-slice rule (queue §0, author 2026-10-29).** Storage-container submissions fell from 58 / 20 / 28 to **18 / 6 / 8** (main / shadow / mirror) in both B runs. The rendered chest count stayed at 122 instances, and there was no tail regression. The chest instancing stays on by default (`?chestInstancing=0` disables it). The FPS difference is inside WSL noise and **is not attributed to this slice**. Native Windows confirmation: queue §4.

## Setup

- Build `b2691195` (gitSha verified in every run). A = `&chestInstancing=0`, B = default. Fixture `tools-001-v1`, `settlement-heavy`, High, 30 s, fresh profile, 20 s cooldown, 53 NPCs in every run. Order A1 B1 B2 A2.
- Artifacts: `wsl/2026-10-29--wsl-q5-chest-{A1,B1,B2,A2}-settlement-heavy-rep1.*`.
- Change: [implementation notes](../../research/v1-revival/2026-10-29--q5-house-chest-instancing--implementation-notes.md).

## Results

| Run | Arm | storageContainer calls main / shadow / mirror | Total main / shadow / mirror calls | FPS | frame p50 / p95 / p99 ms | RENDER p50 ms | Long frames (worst) |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
| A1 | off | 58 / 20 / 28 | 1 373 / 405 / 314 | 23.1 | 41.0 / 56.7 / 78.5 | 32.2 | 2 (143 ms) |
| B1 | **on** | **18 / 6 / 8** | 1 368 / 388 / 293 | 25.5 | 38.6 / 48.3 / 57.0 | 30.2 | 1 (141 ms) |
| B2 | **on** | **18 / 6 / 8** | 1 333 / 388 / 293 | 26.2 | 36.7 / 45.1 / 80.0 | 28.5 | 3 (341 ms) |
| A2 | off | 58 / 20 / 28 | 1 445 / 406 / 314 | 20.3 | 44.8 / 58.5 / 79.2 | 34.6 | 3 (1 191 ms) |

Census storageContainer (main, one traversal): 76 → 30 draws, **122 instances and 9.0k triangles in both arms**. Settlement scene nodes: 2 468 → 2 330.

## Interpretation

- **Structural saving (deterministic).** −40 main, −14 shadow and −20 mirror calls per frame. Shadow and mirror totals fall by exactly that much (405/406 → 388, 314 → 293). The main-pass total moves with camera and NPC framing (1 333–1 445 across runs), so its per-run delta is noise; the family row is the evidence.
- **No regression.** Every B run has frame p50/p95 and RENDER p50 at or below every A run. The worst frames (B2 341 ms, A2 1 191 ms) are unattributed (no labelled hitch) and occur in both arms. Settlement construction is not inside the measured window.
- **FPS.** B is 25.5/26.2 and A is 23.1/20.3. The gap is larger than ~120 fewer calls per frame can explain on its own. WSL settlement-heavy is noisy, so **no FPS gain is claimed**. Under the CPU-slice rule, the green light rests on no regression plus the structural saving.

## Limits

- n = 2 per arm. That is enough for the deterministic counts, not for frame-time claims.
- The collector attributes only the `storageContainer` family. It does not separate chests from other containers, but only the chest path changed between arms.
- No browser visual check (queue §2). The only expected difference is coarser culling granularity: one bound per settlement instead of one per house.

## Windows A/B instructions (queue §4)

One build, order A B B A, `settlement-heavy`:

```
SEEDVALE_QUERY='&chestInstancing=0' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-q5-chest-A 1 35 settlement-heavy
SEEDVALE_QUERY='' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-q5-chest-B 1 35 settlement-heavy
```

- **Decides:** storageContainer main/shadow/mirror calls (expected 58/20/28 → 18/6/8) with an unchanged instance count; RENDER p50.
- **Guards:** mean FPS, frame p95/p99, long frames.
- **Revert** (flip the default or revert `b2691195`) if Windows regresses or the visual check shows missing or misplaced chests.
