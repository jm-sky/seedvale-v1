# Windows Arc — Chrome trace + benchmark analysis (settlement-heavy, forest)

**Created:** 2026-10-28 (Claude Code, Sonnet 5.5)
**Benchmark SHA:** `ccc4d3783a9d069d308a635a8e47179f6645cb17` ([series report](./2026-10-28--win-a1p-settlement-heavy-forest-series.md)) · **Trace SHA:** `98ddfbd11ee77319ecf5008064e4d59b0b887cbc` (= `ccc4d378` + user-timing marks in `benchmark.ts` only; no behavioural change)
**Setup:** native Windows 11, Intel Arc 140V (ANGLE D3D11), headed Chrome, fresh profile, one trace per scenario over exactly the 29.5 s measured window (marks `seedvale:bench-window-*`), CDP `Tracing` streamed to `_temp/` (not committed, 187/247 MB). Procedure: [runbook](../2026-10-27--arc-baseline-runbook.md#chrome-trace-of-the-benchmark-window-native-windows-2026-10-28).
**Artifacts:** `trace-results/trace-{settlement-heavy,forest}-98ddfbd1.md` (analyzer v16) and `….cpu-profile.txt` (self/inclusive ms from `ProfileChunk` samples via `scripts/perf/cpu_profile_summary.py`).

Tracing itself slows the page (FPS 22.6 / 36.5 vs 26.7 / 37.1 benchmarked). Use the traces for **proportions**, not absolute FPS. The `passSubmissionCollector` wrapper (`recordDraw` ≈ 0.9 %) and CPU profiler are part of the measured cost.

## What the traces show

| | settlement-heavy | forest |
| --- | --- | --- |
| frames in window / median / p95 / p99 / max | 650 / 42.2 / 76.5 / 107.6 / 125.9 ms | 1045 / 28.0 / 33.4 / 59.8 / 109.5 ms |
| frames > 100 ms | 8 | 1 |
| main thread inside `tick` (`gameLoop.ts`) | 94.7 % | 93.8 % |
| beauty pass `runBeauty` → EffectComposer/N8AO | 44.6 % (13.2 s) | 48.2 % (14.3 s) |
| water mirror (`waterMirror.ts` render) | 9.7 % | 11.6 % |
| `renderObject` (three) / `setProgram` | 23.8 % / 16.8 % | 29.6 % / 21.9 % |
| `updateMatrixWorld` (self) | 13.7 % | 10.0 % |
| `nearestRiverShoreCandidate` (self) | 3.35 s = 11.4 % | 3.17 s = 10.7 % |
| `SettlementsManager.update` | 3.2 s = 10.8 % | 1.65 s = 5.6 % |
| fauna `update` | 2.6 s (`AnimalAgent`) = 8.9 % | 2.1 s = 7.1 % |
| GPU-process task time total | 7.9 s | 10.2 s |

1. **Both scenarios are main-thread (CPU submission) bound, not GPU-bound.** The main thread is ~94 % busy in `tick` while the GPU process is busy ~27 % (settlement-heavy) / ~35 % (forest) of the window. Most of the frame is three.js submission (`renderObject`, `setProgram`, `updateMatrixWorld`) inside the N8AO/EffectComposer beauty pass plus the water mirror pass. This agrees with the draw-call counts (2184 / 1819) and contradicts the earlier "GPU-heavy" reading from GPU-timer averages (that timer covers the whole beauty pass, wall time including CPU submission).
2. **`updateMatrixWorld` costs 10–14 % self** (3.0–4.0 s) — scene-graph matrix updates on the whole tree every frame (plus 3.3 % `multiplyMatrices`). Static settlement/vegetation objects are the likely bulk; not verified which subtree. Candidate for `matrixAutoUpdate=false` on static objects (the existing "static-object matrix cleanup" entry in the performance README), measure before acting.
3. **New, clear hot spot: `nearestRiverShoreCandidate` ≈ 3.2–3.4 s (~11 %) in both scenarios**, via `chunkManager.riverShoreQuery` — mostly `resolveWaterBodyShore` ← `buildInteractables` (2.4–2.6 s, called from `gameLoop.ts`) and a second caller (~0.7–0.8 s, probably fauna). That is ≈3 ms/frame at forest's frame rate and is independent of what is on screen, so a cache/cadence in the existing `riverShoreQuery` is a low-risk, high-ROI candidate. Whether it is evaluated every frame without the player/animal moving was not verified in source (recorded in `docs/plans/LOOSE-ENDS.md`).
4. **Water mirror is 2.9–3.4 s (≈10–12 %)** of main-thread time in both scenarios, including settlement-heavy, where the older isolation probes suggested ~0 benefit from disabling it — the isolation numbers and this trace disagree and should not both be trusted without a re-probe.
5. **settlement-heavy long frames (8 > 100 ms, p99 108 ms)** are not attributed to one operation: the longest top-level tasks are 120–125 ms `FireAnimationFrame` tasks at ~18 s, ~21 s, i.e. whole-frame cost spikes, plus a 394 ms `V8.StackGuard`/interrupt callback at trace start (profiler start artefact, ignore). Settlement update (`createSettlement.update`) is ~3.2 s total, so ~7 ms/frame average — a candidate for the spikes, but the trace does not isolate a single call.

## Forest regression (≈ 37 vs ≈ 48 FPS since `721af157`): still unexplained

Scene content is **identical** to the `721af157` forest runs: 12.54 M triangles, same buckets (terrain 4.05 M, grass 7.46 M, water 1.78 M), draw calls 1823 vs 1852–1871 (settlement bucket 702 vs 722 calls after the wood_pile work). So this is neither geometry nor submission count. The GPU-timer average rose (22.5–24.3 ms vs 18.5–21.4 ms), main thread is saturated in three.js submission, and there is no `721af157` trace to diff. Remaining hypotheses (none tested): a CPU-side cost added in the commit range (e.g. `nearestRiverShoreCandidate` — cannot tell if it is new), machine state (power plan/thermal; settlement-heavy did not regress, which argues against a global slowdown), or a driver/Chrome change. Cheapest discriminating step: check out `721af157`, run forest ×3 now (same session/power state), then bisect.

## Limits

One trace per scenario (no repeat); traces are profiler-perturbed; JS sampled times are inclusive of Chrome's profiling overhead; analyzer v16 does not read `timeDeltas` (own script used, see runbook); the start-of-window mark is not inside the trace (≈100 ms offset); no GPU-side trace categories (Chrome `gpu` only) and no thermal/power log.
