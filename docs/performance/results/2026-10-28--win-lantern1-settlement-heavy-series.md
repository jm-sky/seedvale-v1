# Windows Arc — settlement-heavy 3×30 s after wall/standing lantern GLBs

**Created:** 2026-10-28 (Claude Code, Sonnet 5.5)
**Code SHA:** `f6f6efa2dd552d85b206b8da7df37da6e814f8a4` (`main`, clean tree; `context.gitSha` = this SHA in all 3 runs; Vite started on `PORT=5590` after checkout). Contains lantern integration `405742dc`.
**Hardware path:** native Windows 11, Intel Arc 140V (`ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (16GB) … Direct3D11)`), Chrome 156.0.0.0 headed, CDP-driven, fresh profile per rep, 35 s cooldown, High, `?benchmark=settlement-heavy`, fixture `tools-001-v1`, 30 s window, `hardwareClass: target-gpu`. Driver `scripts/perf/run-benchmark-series.mjs` (unchanged). Power/thermal not captured.
**Artifacts:** `results/win/2026-10-28--win-lantern1-settlement-heavy-rep{1,2,3}.{json,raw.json,md,meta.json}`. Reference: `results/win/2026-10-28--win-fix1-settlement-heavy-rep{1,2,3}.*` (`36e99ef6`, [report](./2026-10-28--win-forest-bisect-and-fixes.md)).

## Workload identity

Identical across all 6 runs: settlement `Podgórze Górska` (`-2_-4`, XL, 8 families, 15 residents), 53 NPC, 30 fauna, 76 chunks, same camera pose, spring / rain / timeOfDay 0.2917, population gate `stable`, pass submissions `observed`, GPU timer available with 0 disjoint events, no GL errors reported. **One difference:** CSS viewport 1536×826 (new) vs 1586×806 (reference); drawing buffer ≈ 1.98–2.0 M px in both, so GPU fill load is nearly equal, but it is a harness/window difference and is flagged.

## Results (3 new runs vs `36e99ef6`)

| | new rep1 / rep2 / rep3 | new mean / CV | `36e99ef6` mean / CV |
| --- | --- | --- | --- |
| FPS | 27.9 / 28.1 / 26.8 | **27.6** / 2.5 % | 32.6 / 2.2 % (32.0 / 32.5 / 33.4) |
| frame p50 ms | 34.1 / 33.0 / 35.8 | 34.3 | 30.9 |
| frame p95 ms | 57.4 / 61.5 / 52.5 | 57.1 / 7.9 % | 36.0 / 2.6 % |
| frame p99 ms | 75.9 / 79.9 / 85.3 | 80.4 | 64.6 (75.8 / 71.1 / 46.8) |
| frame max ms | 119.3 / 98.0 / 124.1 | — | 84.0 / 80.6 / 76.7 |
| long frames | 5 / 9 / 13 | — | 2 / 1 / 0 |
| GPU timer avg ms (p95) | 22.0 (30.8) / 23.4 (30.4) / 29.4 (41.8) | 24.9 / 15.8 % | 19.7 / 0.7 % |
| RENDER wall ms | 23.7 / 22.8 / 24.5 | 23.7 | 19.9 |
| draw calls avg (main+shadow+mirror) | 2138 / 2094 / 2131 | 2121 | 2220 |
| triangles avg | 7.745 M / 7.739 M / 7.740 M | 7.74 M | 7.76 M |
| main / shadow / mirror submissions | 1415 / 409 / 314; 1376 / 405 / 314; 1413 / 405 / 314 | | 1509 / 405 / 344 (rep1) |
| NPC / fauna | 53 / 30 | | 53 / 30 |

GPU timer: `available=true`, `disjoint=0`, 1 unresolved sample per run in both series.

## 1. Lantern submissions (verified)

Exterior lamps (`settlement:fireHouseExteriorLamp`), per-frame average, identical in all 3 new runs and all 3 reference runs:

| Pass | `36e99ef6` | `f6f6efa2` | Δ |
| --- | --- | --- | --- |
| main | 90 | **30** | −60 (−67 %) |
| shadow | 0 | 0 | — (lamps are not shadow casters) |
| mirror | 45 | **15** | −30 (−67 %) |

90 = 10 lamps × 9 primitives → 30 = 10 lamps × 3. **The nine → three primitive reduction is reproduced exactly in the main and mirror passes.** Exterior-lamp triangles also fell (rep1 avg: main 6240 → 1440, mirror 3120 → 720; `passSubmissions.*.byBucket` in the JSON). Interior lamps unchanged (main 10, shadow 8, mirror 5).

## 2. Total settlement draw calls

| | `36e99ef6` | `f6f6efa2` | Δ |
| --- | --- | --- | --- |
| settlement, main pass | 524 | 458 | −66 (lamps −60; remainder not attributed, see §4) |
| settlement, shadow pass | 137 | 137 | 0 |
| settlement, mirror pass | 234 | 204 | −30 (all lamps) |
| `scene.settlement.drawCalls` (scene census, all passes' static view) | 1459 | 1291 | −168 |
| `scene.settlement.triangles` | 1.370 M | 1.357 M | −1 % |
| total draw calls avg | 2220 | 2121 | −99 (−4.5 %) |

## 3. FPS / frame time

**FPS is lower, not higher: 32.6 → 27.6 (−15 %), p95 36 → 57 ms.** RENDER wall time rose 19.9 → 23.7 ms and the GPU timer rose 19.7 → 24.9 ms (rep3 29.4 ms), while submissions fell 4.5 %. This is the opposite direction to the draw-call change, so the lantern reduction cannot be what changed FPS here, and it is too small to be visible against the effect that did.

## 4. Not attributable to lanterns

- **16 commits** separate the series; `src/`/`public/` changes are: NPC `WorkSkirt` dyes + `Female.glb` (`7fc1c204`), inert tree LOD package (`d867f387`, assets only, not referenced per its message), lantern GLBs + wiring (`536bffa3`, `405742dc`), palisade/fence OBB collider fix (`f6f6efa2`). The colliders and NPC skirt could change CPU/draw work; none was measured in isolation.
- The remaining −6 main-pass settlement calls (66 − 60) and −138 in the scene census beyond lamps are not explained by lantern counts alone (the census covers more than the 10 exterior lamps, e.g. wall vs standing lamp meshes and interior/tracked lamp meshes). Not investigated.
- Window/viewport differs (1536×826 vs 1586×806).
- Within-series drift: GPU timer average 22.0 → 23.4 → 29.4 ms and long-frame count 5 → 9 → 13 across reps, with FPS roughly flat. Looks like machine/thermal/power or driver state; **not logged, not proven**. The FPS CV (2.5 %) is low but the p95/GPU-timer spread says the later reps were in a noisier state.
- Whether the FPS drop is a real regression of `f6f6efa2` or a machine-state shift between sessions is **undetermined**. No isolated A/B was run, so no lantern-specific FPS effect (gain or loss) is claimed.

## Reliability verdict

Workload identity is sound (same settlement, 53 NPC, camera, weather, fixture, gate `stable`, pass submissions `observed`), and the **draw-submission numbers are fully reproducible** (lamps identical in 3/3 runs). **FPS/frame-time comparison with `36e99ef6` is only indicative:** different session, 16 intervening commits, viewport size differs, GPU-timer/long-frame drift inside the series, no thermal/power log. The −15 % FPS result is a flag, not a conclusion.

## Next step (not done, per scope)

If the drop matters: one A/B run each of `36e99ef6` and `f6f6efa2` back-to-back in the same session (bisect worktree per the runbook), then of `405742dc^` vs `405742dc`. The existing trace (`2026-10-28--win-a1p-trace-analysis.md`, `ccc4d378`/`98ddfbd1`) was reused for context only: the main thread is ~94 % busy in submission, which is consistent with draw reduction mattering little relative to other CPU costs (`updateMatrixWorld`, `nearestRiverShoreCandidate`, water mirror) — and does not explain the new FPS drop. No new trace recorded.

## Limits

3 runs only; settlement-heavy only (forest/stream/water not run); not browser/visually verified (lantern look/placement unchecked); not a certified baseline; Python trace analysis not run.
