# A0a / B0 / C0 baseline run — summary (Arc 140V via WSL2)

**Created:** 2026-10-27 (session "SeedVale Benchmarks", Claude Code, Sonnet 5.5)
**Captured SHA:** `c460b224eadfa395e400da3413815327530adaf7` (`main`, clean tree; Vite dev server `PORT=5577`)
**Artifacts:** `2026-10-27--033` … `--050` (`.json` / `.raw.json` / `.md` / `.meta.json` each) + `2026-10-27--051--a0a-b0-c0-baseline-summary.json` (flat per-run table).
**Runbook:** [`../2026-10-27--arc-baseline-runbook.md`](../2026-10-27--arc-baseline-runbook.md)

## Verdict

| Lane | Status | Why (short) |
| --- | --- | --- |
| A0a (agents) | **UNVERIFIED** | Real pass submissions observed, 3 reps stable in FPS (CV 5 %), **but** NPC population ramps inside the 30 s window (4 → 53 on the auto-run, 19 → 53 on warm repeats), camera rotation **BLOCKED**, GPU timer unavailable, unexplained 0.7–1.5 s frame spikes. |
| B0 (settlements) | **UNVERIFIED** | Same capture as A0a (shared collector). Per-bucket `settlement:*` attribution is available and reconciles with `renderer.info` (see below), but the workload drifts and `settlements-019` Stage 1 browser gate remains open. |
| C0 (grass/flowers) | **UNVERIFIED (partial)** | Grass resident/submitted counts verified in `forest`; stream lifecycle/finalization observed (30 requests/completions, 15 in / 21 out). **Flowers = `unavailable`**, no cold run possible (no harness mode), `forest` also contains a settlement so it is not a clean grass lane. |
| Stream cold vs warm | **BLOCKED (cold)** | Harness has no cold mode; all 3 stream reps are labelled `warm` even on fresh navigation. |
| Water control | **READY as control only** | Very stable (CV 4 %, calls CV 0.4 %), 54 FPS; not an acceptance baseline for A/B/C. |

All 18 captures are saved with `hardwareClass: "diagnostic"` — **deliberately**, even though the GPU is the real Intel Arc 140V (`ANGLE (Microsoft Corporation, D3D12 (Intel(R) Arc(TM) 140V GPU (16GB)), OpenGL 4.6)`). Reasons: (1) path is WSL2 → Mesa D3D12 → ANGLE/GL, not the author's native Windows ANGLE/D3D11 used for diagnostic 032; (2) `GL_INVALID_OPERATION: glDrawElements: Mismatch between texture format and sampler type` is raised in **every** run (see Problems); (3) `EXT_disjoint_timer_query_webgl2` is exposed by the context but the harness reported GPU timer `unavailable` with zero samples. Flip to `target-gpu` only after a native-Arc re-run.

## Environment

- Hardware: Intel Arc 140V (shared 16 GB), WSL2 `5.15.167.4-microsoft-standard-WSL2`, `/dev/dxg`, Mesa 25.2.8 `GALLIUM_DRIVER=d3d12`, WSLg display; Intel WDDM driver `iigd_dch.inf` (exact version not captured). Power/thermal state **not captured**.
- Browser: Google Chrome 147.0.7727.137, **headed**, Playwright-core 1.54.2, `--use-gl=angle --use-angle=gl --ignore-gpu-blocklist`; fresh browser/profile per rep; one page at a time.
- Resolution: viewport and drawing buffer 1600 × 900, DPR 1, quality High (forced by harness), fixture `tools-001-v1` (seed 42, terrain 193, loadRadius 3, 07:00, **weather = rain**, spring).
- Procedure: **30 s idle cooldown before and after every run** (author request), auto-start via `?benchmark=<id>`, 30 s measured window, 3 reps per scenario. Not a `vite preview` production build (dev server per runbook).
- Selected heavy settlement: *Podgórze Górska* (mountain, XL, 8 families, 15 residents), anchor (−572.2, −1158.1); camera pos y = 17.3, pitch ≈ −20°.
- SHA verified: report `context.gitSha` = `c460b224…` in every run; `fixtureVersion` present; raw sidecar `mode=full`, 100 % of frames exported.
- Runbook SHAs `94a74470` / `e124e866` **do not exist** in this repository (history rewritten); the equivalent P0 commits are `b21a7eb0` (P0 diagnostics) and `5cedca33` (main/shadow residual fix), both ancestors of `c460b224`.

## Benchmark table — median [min–max] of 3 reps

| Scenario | FPS avg | frame p50 / p95 / p99 (ms) | frame max (ms) | update p95 (ms) | render p50 / p95 (ms) | draw calls | triangles | main / shadow / mirror calls | long frames (≥80 ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy | 18.2 [17.5–19.8] | 47.2 / 54.9 [54.1–56.2] / 134 [134–152] | 1283 [670–1479] | 16.6 [15.8–18.3] | 34.2 / 40.4 | 2326 [2280–2368] | 7.82 M | 1572 / 424 / 345 | 4 [4–6] |
| forest (C0 candidate) | 29.2 [28.9–29.6] | 36.1 / 47.6 [46.2–47.7] / 71 [53–78] | 83 [80–125] | 9.6 | 27.8 / 37.1 | 1879 [1879–1898] | 12.56 M | 1100 / 431 / 349 | 1 [1–3] |
| stream (route) | 28.6 [28.4–31.7] | 25.3 / 76.6 [61.8–77.9] / 186 [146–216] | 1055 [1049–1116] | 23.0 | 16.5 / 31.6 | 840 [813–879] | 10.94 M | 561 / 210 / 142 | 20 [17–21] |
| water (control) | 54.0 [49.7–55.1] | 18.5 / 22.2 [21.9–27.0] / 26.6 | 94 [86–111] | 8.7 | 11.7 / 14.8 | 326 [323–326] | 5.04 M | 218 / 188 / 70 | 1 [1–2] |

FPS min/p1 are in the per-run JSON (settlement-heavy p1 = 7 FPS, stream p1 = 5–7, forest 13–19, water 18–38). Frame times are CPU wall-clock of the frame loop; **GPU ms: unavailable** (never inferred). `render` p-values include driver/GPU wait.

Variability between reps (coefficient of variation): FPS — settlement-heavy 5.2 %, forest 1.0 %, stream 5.1 %, water 4.4 %; frame p95 — 1.6 / 1.5 / 10.1 / 9.9 %; draw calls — 1.5 / 0.5 / 3.2 / 0.4 %. settlement-heavy FPS **drifts monotonically down** (19.8 → 18.2 → 17.5) while main-pass calls rise (1522 → 1572 → 1604) — thermal or accumulation effect, **not** resolved (thermal not recorded). Extra 6 warm repeats on the same page (artifacts 045–050): FPS 18.9–20.8, p95 54.8–96.7 ms; the "rotation" ones are not rotated (below).

## Pass attribution (actual `renderer.info` submissions, settlement-heavy rep 1)

Main 1522 + shadow 424 + mirror 345 = 2291 calls vs `rendering.drawCallsAvg` 2280 (reconciles within 0.5 %). Triangles main 4.65 M / shadow 2.18 M / mirror 0.99 M. Shadow refreshed on 251/258 frames (97 %) — effectively every frame.

- main top buckets (calls): `items` 191, `npcFamily:Peasant` 160, `other` 119, `environment` 95, `settlement:fireHouseExteriorLamp` 79, `vegetation` 78.
- shadow: `environment` 88, `vegetation` 79 (554 kt!), `settlement:houseStatic` 33, `settlement:storageContainer` 20.
- mirror: `environment` 44, `settlement:fireHouseExteriorLamp` 44, `settlement:storageGoods` 39, `settlement:houseStatic` 32 — **mirror cost is ~15 % of calls even though this scene is not water-centric**.
- Census estimate for the scene: settlement 1515 / npc 520 / fauna 399 / items 555 draw-call *estimates* (not actual submissions; census ≠ passes).
- forest: `settlement:decor` is the top bucket in main (161 c / 311 kt) and shadow (196 c) — the forest anchor sits next to a settlement.
- stream: `vegetation` dominates main (58 c, 898 kt) and shadow (62 c, 917 kt).

## C0 grass baseline (resident vs submitted, rep 1)

| Scenario | chunks | resident full + filler | submitted full + filler | meshes | alloc est. | lifecycle / finalization in window |
| --- | --- | --- | --- | --- | --- | --- |
| forest | — | 616 454 + 1 247 320 | 265 630 + 297 074 | — | — | 2 requests/completions, 2 stream-ins; finalization `observed` (2 chunks) |
| stream | — | 724 882 + 1 540 524 (rep 3: 539 276 + 1 145 900) | 76 794 + 22 035 | — | — | **30** requests/completions, 15 stream-ins, 21 stream-outs, 0 cancels/invalidations; finalization `observed` (30 chunks) |
| settlement-heavy | 23 | 482 171 + 1 025 429 | 75 310 + 42 954 (15.6 % / 4.2 %) | 75 | 138 MB | all zero, finalization `unobserved` |
| water | — | 506 458 + 1 057 227 | 123 730 + 89 957 | — | — | all zero, finalization `unobserved` |

`uploadBytesObserved = null` and `flowers.status = "unavailable"` in all runs: GPU upload bytes/ranges and flower attribution are **not measured** (P1). Forest is grass-rich (≈ 4.8× the submitted instances of settlement-heavy) but **must not be called a meadow**. Resident grass in `stream` differs between reps (724 k vs 539 k) — route-dependent timing; treat stream grass counts as variable.

## Problems found

1. **NPC population not settled in the measured window (A0a/B0 blocker).** Harness settle is 1 s after preload. `settlement-heavy`: `populationStart.npcCount` 4 (auto-run) / 19 (warm repeat) → `populationEnd` 53 every time; main-pass calls and frame cost therefore grow during the window. Workload is not matched between window start and end (runbook: "materially unstable workloads" = STOP for acceptance). Needs a settle/population-stable gate in the harness (not changed here — out of the "minimal harness fix" bar without author sign-off).
2. **Camera rotation BLOCKED.** `MouseLook` requires pointer lock; in this WSLg + automation setup `requestPointerLock` was never granted (`pointerLockElement=null`, also `WrongDocumentError` on direct request). Artifacts 046/048/050 (`rotation-not-applied`) are therefore plain static repeats and **must not be cited as rotation evidence**. Do the front/rear/rotation capture manually or add a harness camera hook.
3. **`GL_INVALID_OPERATION: glDrawElements: Mismatch between texture format and sampler type (signed/unsigned/float/shadow)`** in 12/12 series runs (Chrome silences after 256). Also reproduced on SwiftShader (headless, `water`), so it is an **application/shader-level issue, not a Mesa-D3D12 artefact**; some draws are rejected, so draw-call/triangle counts may include non-rendered draws and cost may be understated. Source material not yet identified.
4. **Unattributed frame spikes**: `attribution.unattributedMs` = frame max in settlement-heavy (670–1479 ms) and stream (≈1050 ms, only 17.7 ms labelled hitch); frame p99 134 ms in settlement-heavy. Cause unknown (GC / driver / shader first-use / WSL are all candidates; no trace captured).
5. **Isolation probe values are unreliable**: e.g. forest `no-postprocessing` = 3593 ms, several `0.0` renders, settlement-heavy `no-shadows` = 0.0. Do not use `isolation.*` as exposed-cost evidence from these runs.
6. **GPU timer unavailable** (`querySpan=unavailable`, 0 samples) although the extension is exposed — cause unverified.
7. `[settlement] failed to load /models/settlement/rat_nest.glb` (served HTML instead of GLB → fallback geometry) in 12/12 runs — missing asset on this checkout; settlement scene uses a fallback for that prop.
8. **Worldgen did not hang at ~10 %** in any of ~20 launches (world reached 100 % in roughly 90–130 s on a fresh profile); the earlier stall was not reproduced with a fresh profile per run.
9. Runbook SHA mismatch (see Environment). Pre-existing: `pnpm run test` re-resolved dependencies (vue 3.5.44, vite 7.3.7, vitest 4.1.12, jsdom 30.1.3) with no lockfile diff in `git status`.

## Verification (pre-benchmark gate)

`pnpm run test` — 705 files / 8490 tests passed (55 s); `pnpm run type-check` exit 0; `pnpm run lint` exit 0; `pnpm run build` exit 0 (existing chunk-size warning only).

## Bottlenecks (evidence-backed, not ROI)

- `RENDER` (CPU wall incl. GPU/driver wait) dominates every scenario: 30.8 of ~48 ms in settlement-heavy, 22.5 ms forest, 18.2 ms stream, 9.4 ms water. Not confirmed as CPU-bound (no GPU timer).
- Triangle load is high everywhere (7.8–12.6 M tris/frame); in settlement-heavy shadow + mirror passes are ≈ 34 % of calls and ≈ 41 % of triangles — pass duplication is a major lever candidate, shadow refreshes ~every frame.
- A (agents): skinned NPC draws (`npcFamily:*`) + `items` are the largest main-pass buckets; B (settlements): `settlement:*` is the largest census share and appears in all three passes; C (grass): significant only in `forest`/`stream` and sub-dominant elsewhere.
- stream: p95 ≈ 77 ms with ~20 long frames/30 s — streaming/first-use hitches dominate, not steady-state rendering.

## Recommended next order

1. Author decision: accept/reject the diagnostic classification, or re-run the same runbook on the native Windows Arc browser (gives real timer chance + the author's actual path) — one rep set is enough to decide.
2. Harness-only fix (needs author OK): wait for population stability before the measured window (NPC count stable for N s) so A0a/B0 can reach READY; add a camera-pose hook so rotation does not depend on pointer lock.
3. Identify the `GL_INVALID_OPERATION` source (shader/texture) — correctness issue that could invalidate counts; separate from perf work.
4. Capture a trace of one `settlement-heavy` and one `stream` run to attribute the unattributed spikes.
5. Only then pick one P1 slice. Provisional roadmap order stays A → B → C; current data support **shadow/mirror pass cost and skinned NPC/item draws (A/B)** before grass (C). No optimisation was started.

## Not done / not claimed

No cold-start run, no GPU ms, no flower/upload-byte data, no rotation, no matched A "actor-facing" second pose (same unrotated camera only), no production (`vite preview`) build run, no power/thermal log. No optimisation, mechanics, determinism or graphics changes were made.
