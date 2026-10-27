# Native Windows Arc — harness fixes + diagnostic baseline

**Created:** 2026-10-27 (Claude Code, Sonnet 5.5) · base SHA `5b6f1e05` + harness changes in the commit that adds this file.
**Hardware path (verified in-page):** `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`, Windows 11, Intel driver 32.0.101.8860, Chrome 156 headed, fresh profile per run, 1600×900 DPR 1, `EXT_disjoint_timer_query_webgl2` present. Power/thermal **not captured**.
**Classification:** all captures here are `hardwareClass: diagnostic` — captured with an uncommitted (dirty) tree so `gitSha` is the parent; they are **not** READY baselines (1 rep for stream/water; settlement-heavy has 3 reps but with differing cameras, see below). Artifacts: `results/win/`.

## Results (30 s window, High, fixture `tools-001-v1`)

| Run | FPS avg | FPS p1 | frame p95 ms | draw calls | long frames | population gate | GPU ms avg / p95 (samples) | invalid isolation rows |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy rep1 (default cam) | 27.7 | 12 | 72.3 | 2371 | 9 | stable (6381 ms, npc 53→53) | 20.0 / 23.6 (743) | 0 |
| settlement-heavy rep2 (yaw 0) | 22.0 | 8 | 82.9 | 2331 | 39 | stable (5341 ms, 53→53) | 21.9 / 29.6 (606) | 0 |
| settlement-heavy rep3 (yaw π) | 28.1 | 12 | 67.9 | 1574 | 12 | stable (5116 ms, 53→53) | 18.6 / 23.2 (779) | 0 |
| stream | 55.2 | 18 | 26.2 | 893 | 7 | stable (5156 ms, npc 20→19) | 17.5 / 27.7 (1276) | 0 |
| water (control) | 76.6 | 23 | 15.4 | 323 | 2 | stable (5204 ms, 20→20) | 10.1 / 11.5 (1675) | 0 |

Native Windows is ~1.5× (settlement-heavy) to ~2× (stream, water) faster than the WSL2 diagnostics (18.2 / 28.6 / 54.0 FPS). settlement-heavy GPU time (≈19–22 ms, span = postprocess+labels = whole beauty pass) is a large share of a 36 ms frame → GPU-heavy, not proven GPU-bound. Rear view (yaw π) cuts draw calls 2371→1574, i.e. camera direction changes workload materially, so poses must be fixed per comparison. Rep2's 39 long frames vs 9/12 is unexplained (no trace).

## Findings per task

1. **GL_INVALID_OPERATION** — *occurs on native Windows D3D11* (Chrome console: 256 errors, then "too many errors" cap, all `glDrawElements[Instanced]: Mismatch between texture format and sampler type`, within ~0.3 s of `__seedvaleReady`). Cheap per-frame `getError()` hook (one call per rAF, sticky flag): **1 error frame total per run, 12–14 s *before* the measured window starts, 0 in window, 0 after** (5/5 runs: settlement-heavy ×2, stream, water ×2). Caveat: per-frame sticky flag shows frames-with-error, not counts; in-window absence is therefore established per frame, not per draw. The mirror-before-shadow explanation from the audit is consistent but not re-proven here. **No app fix made** (needs approval; options A/B in the audit). Draw counts in the window are not affected by it.
2. **Population gate** — implemented (`waitForStablePopulation`, `benchmark.ts`): observes NPC count every 250 ms, releases after 5 s unchanged, 90 s timeout → `context.populationGate.status = 'timeout'` (flagged UNSTABLE in the MD). Observation only. Result: on native Windows NPC count was already 53 and stable (gate released after ~5–6 s); the earlier 4/19→53 drift was this warm-up, now outside the window.
3. **Camera** — `run(id, sec, { camera: { yaw, pitch, distance } })` writes the shared `MouseLook` `LookState` (clamped via `clampPitch/clampDistance`) that `PlayerController.syncCamera` reads; no pointer lock. Recorded in `context.cameraControl`. Verified: rep3 yaw π changed draw calls 2371→1574. `?benchmark=` auto-run uses the default camera (no options).
4. **Isolation** — root cause of zeros/3593 ms: fixed 150/400 ms wall windows that held 0–1 frames when a probe's first frame was a long (shader-compile) frame. Now frame-based (8 settle frames, ≥30 sample frames, ≥400 ms, 15 s timeout); rows carry `frames`/`status`, invalid rows print `INVALID` and are excluded from diffs. 0 invalid rows in 5 runs. Also `GpuTimer.reset()` now discards in-flight queries (previously the previous probe's GPU samples leaked into the next probe's window); per-probe GPU numbers before this fix must not be trusted.
5. **GPU timer** — root cause of "unavailable": `renderStack.ts` created the timer only for `?benchmark=stream` or program census. Now enabled for any `?benchmark=`. On native Windows: supported, resolved, 0 disjoint, 0 skipped (≈600–1700 samples/run). Window GPU stats are captured right after the measured window (before the isolation probes reset the timer). Caveat: timer spans postprocess+labels only (the full beauty render), not simulation.
6. **Chrome trace** — **not done** (time/scope; no `trace:analyze` run). Unattributed spikes remain unexplained.

## Not claimed / open
No READY lane: dirty-tree captures, ≤3 reps with non-identical cameras, no cold run, forest/flowers not rerun, no thermal log, `rat_nest.glb` still 404→fallback. Next: rerun on the committed SHA with a fixed pose (≥3 reps, `hardwareClass: target-gpu` is justified for the path itself), then trace the long-frame reps; decide on the GL first-frame fix.
