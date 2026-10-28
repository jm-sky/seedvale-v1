# CA1 filler gating — A/B `d7ddb337` (A, before) vs `bc9a68d1` (B, after)

**Date:** 2026-10-28 · **By:** Claude Code (Sonnet 5.5) · **Classification:** diagnostic same-session A/B, **not** a certified C0 baseline.
**Scope:** memory/instance counts and frame-time sanity only. No visual verification, no new Chrome trace, no runtime or harness changes.

## Setup
- Native Windows 11, Intel Arc 140V (AC power, balanced plan), Chrome 156.0.8078.49 headed, High (harness-forced), fixture `tools-001-v1`, seed 42, same viewport 1586×806 in every run, forest 20 NPC / stream 19 NPC.
- A ran from a short worktree at `bc9a68d1^` (`d7ddb337`), B from the main checkout; each run verified `meta.gitSha` against that checkout's HEAD (driver `scripts/perf/run-benchmark-series.mjs`, unchanged).
- **Strictly sequential:** one Vite (only the variant under test) + one Chrome at any time; Chrome refused to start if another `chrome.exe` existed; fresh profile per run; 35 s cooldown between runs. One unmeasured warm-up per variant (discarded, not committed).
- Order counterbalanced **A B B A A B** (forest runs 1–6, stream pairs 1–6).
- Forest: 3 × 30 s per variant. Stream: per pair, a *cold* run (fresh profile) then a *warm* run (same profile, new browser process) → 3 cold + 3 warm per variant. The profile reuse for warm used a scratchpad copy of the driver (`SV_PROFILE` env); repo harness untouched.
- Artifacts: `results/win/2026-10-28--win-ca1-ab-{A,B}-{run1..6|pair1..6-cold|warm}-*.{json,raw.json,md,meta.json}`, `…-orchestrator.log`, `…-summary-rows.json` (extracted metrics).

## Results (means over 3 runs, [min–max])

### forest (30 s)
| | A (before) | B (after) |
| --- | --- | --- |
| FPS | 57.6 [55.1–59.0] | 55.5 [50.9–58.8] |
| frame p50 / p95 / p99 ms | 17.4 / 21.9 / 38.0 | 18.0 / 23.4 / 31.8 |
| max frame ms | 94.5 | 102.4 |
| long frames (>80 ms) | 1.3 | 2.0 |
| hitches | 0 | 0 |
| resident **filler** instances | 1,247,320 | **624,138** (−50 %) |
| submitted filler | 297,074 | 297,949 (+0.3 %) |
| resident / submitted full | 616,454 / 265,630 | 616,454 / 265,630 (identical) |
| est. grass allocation | 178.9 MB | **119.1 MB** (−33 %) |
| draw calls | 1754 | 1753 |

Per-run FPS: A 55.1, 58.6, 59.0; B 50.9, 58.8, 56.7. Resident/submitted counts were identical across the three runs of each variant (deterministic fixture); B's low run (50.9, the first B run after A) is inside the same-variant spread (A: ±2 FPS, B: ±4 FPS) — **no FPS difference can be claimed in either direction.**

### stream (30 s)
| | A cold | B cold | A warm | B warm |
| --- | --- | --- | --- | --- |
| FPS | 59.9 | 60.5 | 61.3 | 61.3 |
| p50 / p95 / p99 ms | 14.6 / 25.9 / 60.9 | 14.6 / 26.4 / 55.7 | 14.5 / 27.4 / 61.3 | 14.7 / 27.0 / 57.7 |
| max frame ms | 367 [266–519] | 348 [300–439] | 106 [92–129] | 102 [85–123] |
| hitches / long frames | 2.0 / 8.3 | 2.0 / 6.7 | 4.3 / 4.7 | 3.0 / 4.0 |
| resident filler | 1,396,718 | 188,351 | 1,176,606 | 137,739 |
| submitted filler | 27,178 | 32,214 | 37,465 | 37,327 |
| est. allocation | 197.2 MB | 82.3 MB | 166.1 MB | 75.1 MB |
| grass worker requests (diag) | 30–35 | 30–35 | 35 | 35 |
| streamIns / streamOuts | 15–15 / 21–25 | 15–19 / 21–25 | 15–18 / 25–26 | 17–19 / 26 |

Resident counts are an end-of-window snapshot and depend on which chunks happen to be resident (11–15), so the means above mix states. **Matched states** (identical resident full-grass instance count ⇒ same chunk set):

| Pair | A filler resident → B | A alloc → B | submitted filler A / B |
| --- | --- | --- | --- |
| 15 chunks, full 724,882 (A pair4/5 cold vs B pair6 cold) | 1,540,524 → 289,574 (−81 %) | 217.5 → 97.4 MB (−55 %) | 22,035 / 21,989 (−0.2 %) |
| full 599,200 (A pair5 warm vs B pair3 cold) | 1,274,812 → 137,739 (−89 %) | 179.9 → 70.7 MB (−61 %) | 37,465 / 37,327 (−0.4 %) |

Allocation deltas equal `Δ filler instances × 96 B` (the harness estimate), e.g. forest 623,182 × 96 B = 59.8 MB.

## Assessment
- **Confirmed by measurement:** CA1 removes 50 % (forest) to 80–89 % (stream, matched states) of resident filler instances and 33–61 % of the *estimated* grass instance allocation, with **no change in submitted filler** (≤0.4 %, from the new filler RNG stream's slightly different counts) and identical full-grass counts.
- **Not demonstrated:** any FPS, frame-percentile or hitch improvement. Differences (e.g. forest −2 FPS, stream p99 −5 ms cold) are within run-to-run spread with n=3. CA1 must be described as a memory/allocation reduction, **not** an FPS gain.
- **Streaming stability:** no sign of added hitches, long frames or max-frame spikes with B (cold hitches 2.0 vs 2.0, long frames 6.7 vs 8.3, max 348 vs 367 ms; warm hitches 3.0 vs 4.3); sample is small and noisy (warm A had one run with 10 hitches). Filler pop-in on approach is **not observable** in these metrics.
- **Worth it?** Yes for memory: it saves roughly 60–120 MB of estimated instance buffers per scene state in these scenarios at no measured frame cost. It does not justify claims about speed. Visual acceptance remains pending.

## Limits
- n=3 per cell (forest) and 3 cold/3 warm (stream); spread of ±2–4 FPS means <~4 FPS differences are unresolvable. Single machine/session, thermal and power state not logged beyond AC + balanced plan + 35 s cooldowns.
- **Memory is an estimate** (instance count × 96 B from `grassBaseline`); no JS-heap or process-memory metric exists in the report, and observed upload bytes are `unavailable`. Estimated *transfer* bytes ≈ the same arrays at generation time — not separately measured.
- **Grass generation / worker time not measured:** `grassFinalization` is `null` (diagnostic disabled by default; enabling it would change the runtime/harness setup). Cost of the removed filler pass in ms is therefore unknown.
- **Worker request counts are incomplete for B:** `grassBaseline.lifecycle.requests` counts main-grass requests only; CA1's filler-only requests are not instrumented, so B's real job count is *higher* than reported. Numbers (30–35 both) must not be read as "no extra requests".
- Stream resident/submitted values are single end-of-window snapshots; chunk sets vary by timing (hence the matched-state table). Forest is not a meadow (runbook), so the forest grass share may understate meadow-heavy scenes.
- Scratchpad driver copy used for the warm pairs (profile reuse) is not committed; GPU timer unavailable; no visual verification; no Chrome trace.
