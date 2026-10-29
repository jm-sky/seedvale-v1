# Q14 B1a — single per-frame scene matrix update, native Windows A/B (settlement-heavy)

**Date:** 2026-10-29 · **By:** Claude Sonnet 5.5 · **Platform: native Windows** (Chrome 147, ANGLE D3D11, Intel Arc). Do not compare with the [WSL2 result](./2026-10-29--wsl-q14-frame-matrix-once-ab.md).
**Verdict: keep. Frame p50 and RENDER p50 both drop ~3 ms beyond the same-arm spread, with no guard regression.** The flag default is flipped to on (`?frameMatrixOnce=0` restores the old path).

## Setup

- One build, `8a2bea88` (`gitSha` verified in every run). A = no parameter with the flag opt-in at measurement time; B = `&frameMatrixOnce=1`. Order A B B A A B, after one discarded warm-up per arm.
- Fixture `tools-001-v1`, settlement-heavy, 30 s window, 53 NPC in every run, fresh Chrome profile per run, 30 s cooldown. Driver: `scripts/perf/run-benchmark-series.mjs`.
- Artifacts: `results/win/2026-10-29--win-q14-{A,B}-run{1..6}-*`.

## Results

| Run | Arm | FPS | frame p50 | p95 | p99 | RENDER p50 / p95 | `systems.RENDER` | `systems.WATER` | long frames |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 1 | A | 28.7 | 34.7 | 43.5 | 84.5 | 27.9 / 33.7 | 23.0 | 4.0 | 10 |
| 2 | B | 29.9 | 31.6 | 43.6 | 89.9 | 24.6 / 30.6 | 21.7 | 2.8 | 18 |
| 3 | B | 32.3 | 30.8 | 36.7 | 41.6 | 24.1 / 28.8 | 21.0 | 2.8 | 2 |
| 4 | A | 27.5 | 34.4 | 55.2 | 94.8 | 27.0 / 33.1 | 22.6 | 4.0 | 34 |
| 5 | A | 29.7 | 33.4 | 40.6 | 78.3 | 25.8 / 32.6 | 22.2 | 3.8 | 9 |
| 6 | B | 31.9 | 31.0 | 37.9 | 46.7 | 22.8 / 29.0 | 20.9 | 2.8 | 2 |
| **Mean** | **A** | 28.6 | 34.2 | 46.4 | 85.9 | 26.9 / 33.1 | 22.6 | 3.9 | 17.7 |
| **Mean** | **B** | 31.4 | 31.1 | 39.4 | 59.4 | 23.8 / 29.5 | 21.2 | 2.8 | 7.3 |

## Interpretation

- **Primary metrics improve beyond spread.** Frame p50: A 33.4–34.7 vs B 30.8–31.6 (no overlap, −3.1 ms mean). RENDER p50: A 25.8–27.9 vs B 22.8–24.6 (−3.1 ms mean; the ranges touch at 25.8 vs 24.6 only by run 5, still lower in every B run). `WATER` −1.1 ms, the mirror traversal.
- **Guards hold.** p95 and p99 are lower on average, long frames are lower on average, mean FPS is higher (+2.8). Run 2 (B) has 18 long frames and a p99 of 89.9 ms, in the range of A runs 1 and 4; it is not a regression signal at n = 3.
- **Mechanism confirmed in the traces.** CPU profile of the 29.4 s window (summaries below): `updateMatrixWorld` self time falls from 3958 ms (13.5 %) to 1623 ms (5.5 %), `multiplyMatrices` from 1064 to 846 ms. Traces slow the page; their FPS is not a benchmark number.
- Unlike WSL (GPU-bound), native Windows is main-thread bound here, so the CPU saving shows up in frame time as predicted.

## Traces

Raw Chrome traces (191 MB / 216 MB) are not committed, matching the repo convention; they were recorded with `scripts/perf/trace-benchmark-window.mjs` (now honours `SEEDVALE_QUERY` and `SEEDVALE_TRACE_TAG`).

- A: [`trace-results/trace-settlement-heavy-8a2bea88-q14-A.cpu-profile.txt`](../trace-results/trace-settlement-heavy-8a2bea88-q14-A.cpu-profile.txt)
- B: [`trace-results/trace-settlement-heavy-8a2bea88-q14-B.cpu-profile.txt`](../trace-results/trace-settlement-heavy-8a2bea88-q14-B.cpu-profile.txt)

## Limits

- n = 3 per arm, one session, power/thermal not logged.
- Not browser/visually verified: labels, mirror and shadows should be identical (same matrix values computed once), but this was not observed (queue §2).
