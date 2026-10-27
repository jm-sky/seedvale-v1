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

---

## Update — GL fix applied + full rerun (`results/win/*win-fixed-*`)

**Fix (approved: skip mirror until shadow map exists), `src/app/gameLoop.ts`:**
1. Mirror pass skipped while `sun.castShadow && !sun.shadow.map`.
2. That alone was **not sufficient**: settlement-heavy still raised 544 errors on first frames, now from the *main* composer pass (per-draw diag: sole caller `createPostProcessing.render`). Cause: the shadow-refresh budget (`shouldUpdateShadowMap`) can skip the very first refresh, so `shadow.map` doesn't exist and the main pass binds the 1×1 placeholder. Added a one-off forced `shadowMap.needsUpdate` while the map is missing (audit option B, small extension beyond the approved mirror-skip — flagged for review).
3. Verification: per-draw `getError` from page start to ready+3 s on settlement-heavy: 0 errors (before: 544). Per-frame `getError` in all 10 benchmark runs below: **0 error frames** (before fix: 1 per run, pre-window). Chrome console no longer hits the 256-error cap.

**Results (30 s, High, native Arc D3D11; gate `stable` in every run; 0 invalid isolation rows; GPU timer resolved, 0 disjoint):**

| Run | FPS | p1 | frame p95 ms | draw calls | long frames | pop | GPU ms avg / p95 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy rep1 (default cam = yaw 0) | 29.8 | 23 | 38.0 | 2396 | 1 | 53→53 | 20.2 / 24.8 |
| settlement-heavy rep2 yaw 0 | 26.1 | 12 | 44.3 | 2370 | 8 | 53→53 | 20.7 / 23.4 |
| settlement-heavy rep3 yaw 0 | 25.3 | 11 | 80.9 | 2379 | 41 | 53→53 | 20.1 / 23.0 |
| settlement-heavy rep4 yaw π (control) | 27.1 | 12 | 72.4 | 1574 | 9 | 53→53 | 21.2 / 24.4 |
| stream rep1 / rep2 | 53.8 / 46.1 | 18 / 16 | 25.6 / 50.1 | 893 / 902 | 5 / 4 | 20→19 | 16.1 / 17.1 |
| water rep1 / rep2 | 75.8 / 114.4 | 23 / 25 | 16.8 / 9.5 | 323 / 265 | 1 / 0 | 20→20 / 4→4 | 10.3 / 9.7 |
| forest rep1 / rep2 | 47.5 / 44.6 | 24 / 19 | 24.9 / 29.1 | 1855 / 1829 | 1 / 0 | 20→20 | 19.9 / 21.9 |

Variance notes: settlement-heavy same-pose FPS 25.3–29.8 (CV ≈ 8 %), draw calls stable (±1 %) but long-frame count varies 1/8/41 and degrades over reps (FPS 29.8→26.1→25.3) — possible thermal/accumulation, thermal not recorded, unresolved. water rep2 ran a different scene (NPC 4 vs 20, 265 vs 323 calls): warm repeats after the first run restore the player position and re-seek, so rep2 is **not** comparable to rep1 — treat water/stream/forest reps as single reps. GPU avg is ~20 ms vs ~35–40 ms frame in settlement-heavy (GPU-heavy; not proven bound). Mirror/shadow pass counts unchanged within noise vs the pre-fix native water run (323 calls).

**Status:** all `hardwareClass: diagnostic` (artifacts carry the parent SHA, tree was dirty at capture) → still not READY per runbook. Forest not verified as grass-dominant. Still not done: Chrome trace, cold stream, thermal log, flowers/upload bytes.

---

## READY recapture — clean tree, SHA `721af157d6b3aee7ad071647716cd4b4403e936b`

Dev server restarted after checkout (`context.gitSha` = full SHA in all 12 runs); `fixtureVersion` present; native Arc 140V ANGLE D3D11, Chrome 156, driver 32.0.101.8860; **fresh profile + 30 s cooldown per rep, 3 independent launches per scenario**; 0 GL error frames; GPU timer resolved; population gate `stable`; 0 invalid isolation rows; passSubmissions `observed`; raw+JSON+MD+meta saved (`results/win/*win-ready-*`). Power/thermal not captured.

| Scenario | FPS (3 reps) | CV FPS | frame p95 ms | CV p95 | draw calls | CV calls | long frames | GPU avg ms | NPC |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy | 23.7 / 26.4 / 28.3 | 7.2 % | 75 / 42 / 42.2 | 29 % | 2441 / 2403 / 2368 | 1.2 % | 21 / 1 / 11 | 23.0 / 21.9 / 20.3 | **69 / 69 / 53** |
| forest | 50.9 / 47.3 / 45.4 | 4.8 % | 23.0 / 25.2 / 26.3 | 5.5 % | 1852 / 1871 / 1860 | 0.4 % | 2 / 1 / 2 | 18.5 / 19.6 / 21.4 | 20 |
| stream | 54.9 / 54.2 / 55.7 | 1.1 % | 26.5 / 26.3 / 23.7 | 5.0 % | 904 / 915 / 898 | 0.8 % | 3 / 9 / 12 | 16.6 / 16.6 / 15.8 | 20→19 |
| water (control) | 75.9 / 76.1 / 79.5 | 2.1 % | 15.6 / 15.3 / 15.2 | 1.1 % | 323 / 324 / 322 | 0.3 % | 0 / 0 / 1 | 10.2 / 10.1 / 10.4 | 20 |

**Verdicts (runbook accept/STOP):**
- **Water control — READY.**
- **C0 `forest` + `stream` — READY (with stated limits):** grass resident counts verified (forest 616 454 full + 1 247 320 filler, identical in 3 reps; stream 683 k / 683 k / 599 k — route-timing dependent, treat as variable), variance low. Limits: `forest` contains a settlement, not a clean meadow; **flowers `unavailable`**; stream phase is `warm` only — no cold mode exists in the harness (cold stays BLOCKED); upload bytes not measured.
- **A0a / B0 `settlement-heavy` — NOT READY (UNVERIFIED):** SHA, passSubmissions `observed` and gate are fine, but the *settled* population differs between launches (NPC 69, 69, 53 — each stable inside its own window), frame p95 CV 29 % and long-frame count 21/1/11. The workload is not matched across reps, so no stable baseline. Cause of the cross-launch population difference is not investigated (likely simulation timing vs worldgen/load order; the gate only guarantees stability within a run). Captured as `diagnostic`. Next step: gate on a target NPC count / settlement resident count or investigate the 69-vs-53 divergence before certifying A/B.
- Still not done: Chrome trace for long frames, thermal log.
