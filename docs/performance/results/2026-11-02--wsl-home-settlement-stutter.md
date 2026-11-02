# WSL `settlement` + `settlement-walk` — home-settlement stutter diagnosis (2026-11-02, Sonnet)

**Trigger:** author reports stutter in the home settlement on the reference seed `415424794`.
**Platform:** WSL2, headed Chrome, D3D12 Intel Arc 140V (`GALLIUM_DRIVER=d3d12`). Not comparable with Windows.
**SHA:** `a05ea60d`, clean tree, Vite dev. Fixture `tools-001-v1` (**seed 42**, not 415424794 — the harness ignores `seed=`). 3 reps × 30 s per scenario, fresh profile, 20 s cooldown.
Artifacts: `wsl/2026-11-02-home-settlement{,-walk}-rep{1..3}.*`; Chrome traces (one run each, 100/72 MB, not committed): `trace-results/raw/` (git-untracked size) + analyses `trace-results/trace-home-*.analysis.txt`.
**Diagnosis only — no A/B, no FPS claim, no code changed** (except the trace script, see end).

## Benchmark numbers (n = 3)

| Scenario | rep | FPS avg | frame p50 | p95 | p99 | max | >80 ms | RENDER ms | draws |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| settlement | 1 | 32.1 | 28.8 | 52.9 | 136 | 148 | 5 | 19.2 | 1589 |
| settlement | 2 | 34.2 | 28.9 | 39.2 | 59 | 143 | 2 | 18.4 | 1593 |
| settlement | 3 | 25.9 | 37.5 | 57.7 | 86 | 120 | 4 | 24.9 | 1582 |
| settlement-walk | 1 | 17.4 | 40.5 | 137.5 | 282 | **1169** | 15 | 40.7 | 1756 |
| settlement-walk | 2 | 21.4 | 38.8 | 77.9 | 209 | 404 | 11 | 31.1 | 1771 |
| settlement-walk | 3 | 19.2 | 37.3 | 85.4 | 256 | **1410** | 14 | 37.3 | 1756 |

Reference: 2026-10-31 `settlement` (SHA `f5bd539b`, n = 1): 34.2 FPS, p50 25.3 / p95 30.1 / p99 66 ms. Steady state is similar-to-slightly-worse (p50 29–38 ms; n = 1 vs n = 3 and run-to-run spread ~25–34 FPS, so no regression claim); **tails (p95/p99, >80 ms frames) are the problem.**

## Two distinct stutter classes

### 1. Walking: render stalls coinciding with shadow refresh (+ first-use program link)

- In `settlement-walk` **every** frame > 80 ms has `shadowRefreshed = 1` (15/15, 11/11, 13/14) and 6–11 of them also draw the mirror (raw sidecar v2). The worst frames are 200–460 ms and 1.2–1.4 s, **all in RENDER** (simulation 7–12 ms).
- Trace (walk): top blocking call is `GLES2Implementation::GetProgramiv` → `CommandBufferProxyImpl::WaitForGetOffset` = **931 ms in one `FireAnimationFrame` (1037 ms)**, i.e. a synchronous shader program link/status query on the main thread (first use of a program variant while walking), plus 3.06 s total of `WaitForGetOffset` in 470 calls over the window, and `RealSwapBuffers` 16.5 s self over 188 frames.
- This matches the already-known classes (Q17: first-use programs; world-terrain-056: synchronous shadow+mirror passes). Not a settlement-specific CPU hot spot.

### 2. Standing: FAUNA simulation spikes of 95–130 ms

- In static `settlement` the worst frames (rep1: 148/144/136/133 ms; rep2: 143/126; rep3: 120/83) are **`FAUNA` = 94–127 ms, simulate-side**, while NPC 2.5–3.5 ms and RENDER normal. 2–4 such frames per 30 s run, in every rep, not explained by a labelled hitch (`attribution.unattributedMs` = frameMax). Previous diagnosis had FAUNA at 1.4 ms avg and no such spikes (n = 1 may have missed them).
- A few more are render-side (rep3: RENDER 62–79 ms with WATER 20–29 ms ≈ mirror pass).
- Cause not identified from the trace (the embedded CPU profile has no `timeDeltas`, so no sampled per-function ms). Suspect (🟡, unverified): periodic fauna work such as the river-shore query path — `nearestRiverShoreCandidate` (`src/terrain/riverNetwork.ts`) is the top *application* function by sample count in both traces, called via `chunkManager.riverShoreQuery` (memoised by exact position, scans every loaded chunk's river chains on a miss; used by fauna and the player probe). Needs a targeted FAUNA sub-timer, not a guess.

## Trace caveats

Tracing with `disabled-by-default-v8.cpu_profiler` + devtools.timeline inflates frames (median 80–147 ms in-trace vs 29–40 ms untraced) → use the trace for *attribution* (what blocks), never for timings. `V8.InvokeApiInterruptCallbacks` 437 ms (settlement trace, in `FireAnimationFrame`) is a V8 interrupt (likely trace/profiler/GC-related) and is not interpreted. One trace per scenario (n = 1).

## Next steps (for Opus review)

1. **FAUNA spike**: add a sub-timer (per-section) inside the `FAUNA` category or a one-off `--cpu-prof` run in a standing settlement; check whether the spike is `riverShoreQuery` cache misses (memo `RIVER_SHORE_MEMO_CAP`) or a periodic fauna decision tick. Check against world-gen/seed `415424794` (fixture uses seed 42; the author's home settlement may have more rivers/fauna).
2. **Walk**: world-terrain-056 S0 data now exists for the walk — shadow refresh coincides with every long frame; Q53 (`shadowMotionCadence`, default ON) is already in this SHA, so these numbers are *with* it. Identify which program variants link during the walk (`GetProgramiv` 931 ms) → Q17 follow-up / prewarm of the specific family.
3. Re-run on the author's actual seed (manual `?seed=415424794&perf=1`, or a fixture with that seed) — the benchmark cannot confirm the author's exact scene.
4. Windows A/B is the authority for any fix (§4 of queue).

## Tooling change

`scripts/perf/trace-benchmark-window.mjs` now works on WSL (Chrome path, `GALLIUM_DRIVER=d3d12`, `--password-store=basic` — without it Chrome blocks on the GNOME keyring prompt — and non-`taskkill` shutdown).

## Opus review (2026-11-02)

Recent changes vs the 2026-10-31 `settlement` run (same scene counters, seed 42):

| Change | Evidence | Reading |
|---|---|---|
| Water reflection RT 128 → 256 | mirror draw calls 320 → 319 (unchanged); 256² is ~65k px | 🟡 not a cause; the mirror's cost is its draw-call pass, not RT size — reverting to 128 would not help |
| Natural bush models (world-terrain-057) | vegetation tris 264k → 268k, draws unchanged (per-model tris 3–5× higher, instanced) | ✅ not a cause in this scene; LOD optional |
| Bear/boar V3 models | fauna tris 96k → 97k, draws unchanged; bear lighter than before | ✅ not a steady-state cause; 🟡 may add first-use program links (not covered by home-scene prewarm) |
| NPC body builds (`npcBuilds`) | NPC draws 223 → 225 | ✅ not a steady-state cause; 🟡 morph targets add program variants (first-use links) |

FAUNA spikes predate these changes (2026-10-31 already had a 71 ms FAUNA frame). Suspect (🟡, unmeasured — navigation stats are not in the benchmark JSON): wild-animal `findPath` searches that fail at `maxNodes` (1500) with a costly per-cell `isWalkable` (water sample + collider query + slope), re-probing each cell up to ~3× per expansion, with a linear open-list scan, and a second full search on the `preferDry` retry.

## Follow-up landed 2026-11-02 (Opus)

Author decision: land as optimisations, benchmark later (queue §4). No FPS claim.

1. **A\* (`src/navigation/navigation.ts`)** — per-search walkability memo by grid cell, binary heap ordered by (f, insertion seq), numeric keys. Routes and `visitedNodes` are identical to the old search (`navigation.equivalence.test.ts`, 400 random obstacle fields vs the verbatim old implementation in `navigationReference.testing.ts`). Synthetic failing 1500-node search (Vitest/Node, not in-game): 27.1 → 6.5 ms, `isWalkable` calls 11 787 → 1 617. Applies to NPCs too.
2. **`mirrorShadowStagger`** (default ON, `?mirrorShadowStagger=0`) — the shadow decision is taken before the mirror pass; a due mirror pass yields one frame when the shadow map refreshes (never twice in a row: mirror delayed ≤ 1 frame, never starved).
3. **`prewarmTemplates` default ON** (`?prewarmTemplates=0`) — streamed vegetation template programs compile in the loading window instead of mid-walk. Not covered: character/fauna program families (Q23, still deferred) — candidate for the 931 ms `GetProgramiv` stall if it was a fauna/NPC variant.
