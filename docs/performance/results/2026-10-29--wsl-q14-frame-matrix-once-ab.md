# Q14 B1a — single per-frame scene matrix update, WSL2 A/B (settlement-heavy)

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Platform: WSL2** (Chrome, ANGLE → OpenGL 4.6 → Mesa D3D12 → Intel Arc 140V). **Do not compare these numbers with Windows results** ([runbook](../2026-10-27--arc-baseline-runbook.md#parallel-wsl2-baseline-author-2026-10-29)).
**Verdict: mixed — not a WSL green light.** The CPU work removal is clear, but throughput did not improve on this GPU-bound platform. The change has landed **opt-in** (`?frameMatrixOnce=1`, default off) and is waiting for the native Windows A/B (queue §4).

## Change

- `src/render/frameSceneMatrices.ts` provides `beginFrameSceneMatrices` / `endFrameSceneMatrices`, called from `src/app/gameLoop.ts`.
- The frame performs one explicit `scene.updateMatrixWorld()`, attributed to `RENDER`. Scene auto update is then disabled for the mirror, beauty and CSS2D label renders and restored afterwards.
- Before this change, each of those renders recomposed and re-multiplied every object: `updateMatrix()` always flags `matrixWorldNeedsUpdate`, and the `Scene` root forces the cascade (see [Q1 review §3](../../research/v1-revival/2026-10-29--performance-negative-experiments-review.md#3-actual-critical-path-settlement-heavy-current-evidence)).
- Contract: nothing between begin and end moves scene objects. Verified for that span: shadow budget, god-ray uniforms and pass counters only read state.
- Tests: `src/render/frameSceneMatrices.test.ts` (4). `vue-tsc` and ESLint are clean.

## Setup

- Build: one build, `591231d7` (`gitSha` verified in every run). A = `&frameMatrixOnce=0`, B = default, which was enabled at measurement time. Since then the flag is opt-in: for a new A/B, A = no parameter, B = `&frameMatrixOnce=1`.
- Fixture: `tools-001-v1`, settlement-heavy, 30 s window, 53 NPC, population gate `stable`.
- Run conditions: fresh profile per run, 30 s cooldown, one warm-up per arm discarded, order A B B A A B. Driver: `scripts/perf/run-benchmark-series.mjs` (now platform-aware).
- Artifacts: `results/wsl/2026-10-29--wsl-q14-*`.

## Results

| Run | Arm | FPS | frame p50 | p95 | p99 | RENDER p50 / p95 | `systems.RENDER` | `systems.WATER` | long frames | GPU timer avg |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| 1 | A | 23.5 | 40.6 | 68.5 | 127.7 | 32.4 / 38.9 | 27.2 | 5.1 | 17 | 44.2 |
| 2 | B | 21.6 | 38.1 | 74.4 | 82.9 | 29.4 / 40.6 | 31.5 | 3.4 | 5 | 49.6 |
| 3 | B | 24.8 | 40.1 | 49.8 | 56.0 | 30.8 / 42.3 | 28.9 | 3.5 | 0 | 41.4 |
| 4 | A | 24.9 | 41.0 | 48.5 | 83.8 | 33.5 / 38.2 | 26.8 | 5.1 | 6 | 40.6 |
| 5 | A | 24.1 | 42.5 | 50.0 | 55.2 | 33.7 / 40.2 | 28.2 | 5.0 | 1 | 40.6 |
| 6 | B | 21.4 | 38.8 | 53.5 | 88.7 | 30.2 / 45.5 | 35.0 | 3.5 | 4 | 61.7 |
| **Mean** | **A** | **24.2** | 41.4 | 55.7 | 88.9 | 33.2 / 39.1 | 27.4 | 5.1 | 8.0 | 41.8 |
| **Mean** | **B** | **22.6** | 39.0 | 59.2 | 75.9 | 30.1 / 42.8 | 31.8 | 3.5 | 3.0 | 50.9 |

The workload is matched: 53 NPC in every run, main calls 1370–1449 in both arms.

## Interpretation

- **CPU work removed, beyond noise.** RENDER p50 fell by 3.1 ms (ranges A 32.4–33.7 vs B 29.4–30.8, no overlap). `WATER` fell by 1.6 ms, which is the mirror's traversal. Frame p50 fell by 2.4 ms (no overlap). This is larger than the Q1 estimate.
- **No throughput gain.** Mean FPS fell by 1.6. The arm ranges overlap (A 23.5–24.9, B 21.4–24.8): B run 3 matches A, while runs 2 and 6 are slower. B has a lower median but a fatter upper tail (q75/q90 frame time up in runs 2 and 6). `systems.RENDER` average and RENDER p95 rose.
- **WSL is GPU-bound in this scene.** The GPU timer span is 40–62 ms, longer than the frame p50. When the CPU submits sooner, it waits for the GPU elsewhere, so frames are reshuffled, not saved. 🟡 The higher GPU timer in B is consistent with more queued work per span. It is not proof.
- **Consequence for the policy.** On this WSL configuration a CPU-only slice cannot show a throughput gain, so mean FPS cannot green-light it. Native Windows (ANGLE D3D11) was measured as main-thread bound (GPU timer ~20–30 ms vs ~33 ms frames). There the prediction is a real frame-time gain, but that is unproven. Raised with the author (queue §3).

## Limits

- n = 3 per arm, one session, power/thermal not logged.
- No browser visual check. Labels, mirror and shadows should look identical: matrices are the same values computed once. Not observed.

## Windows A/B instructions (queue §4)

Same fixture, run in the order A B B A A B on one build:

```
SEEDVALE_QUERY='' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-q14-A 1 30 settlement-heavy
SEEDVALE_QUERY='&frameMatrixOnce=1' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-q14-B 1 30 settlement-heavy
```

- **Primary metrics:** RENDER p50 and frame p50.
- **Guards:** mean FPS, p95/p99 and long frames.
- **Keep:** enable by default (flip the flag default) if frame p50 improves beyond the same-arm spread with no guard regression.
- **Otherwise:** leave the flag opt-in or remove it.
