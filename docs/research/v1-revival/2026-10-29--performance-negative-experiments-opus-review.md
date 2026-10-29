# Opus review request — unexplained FPS results from three rendering experiments

**Date:** 2026-10-29
**Status:** answered — [review 2026-10-29](./2026-10-29--performance-negative-experiments-review.md); **not** an authorization to implement, merge or rerun benchmarks
**Owner:** future Claude Opus review session
**Area:** V1 Revival performance-first D4 / NPC rendering Track A, shared rendering path
**Source:** author explicitly requested an additional independent investigation because an avoidable code, integration, instrumentation or benchmark mistake may explain missing FPS gains.

## Question

Three technically plausible changes reduced measurable rendering work, but their same-session A/B tests showed no **repeatable, significant end-to-end FPS gain**. Do not dismiss the changes as inherently ineffective until their setup, code and measurement path are independently checked. Conversely, do not assume a bug exists; the savings may simply be small relative to the total frame cost.

## Experiments and evidence

1. **CSS2D redundant scene matrix update:** [report](../../performance/results/2026-10-29--win-css2d-matrix-skip-ab.md), committed in `14aa9ae0`. Conditional second traversal skipped in an experimental branch; A 31.4 vs B 31.2 average FPS, with possible ~1 ms lower RENDER p50 but not a whole-frame gain. Runtime change reverted.
2. **Peasant body-only Skeleton sharing:** [report](../../performance/results/2026-10-29--win-peasant-skeleton-sharing-ab.md), committed in `aaf6933e`; [reproducible patch](../../performance/results/2026-10-29--win-peasant-skeleton-sharing-experiment.patch). Live body Skeletons 163→38 and measured eligible Skeleton.update calls/frame 61→14. A 28.7 vs B 29.4 FPS; p99 worse in B; runtime change reverted. Recheck actual eligible updates vs GPU palette uploads, and what the reduction can influence.
3. **D11 Peasant body mesh consolidation:** [A/B report](https://github.com/jm-sky/seedvale-v1/blob/6db369b33263e5707d562e659eaae9acc3ac856a/docs/performance/results/2026-10-29--win-peasant-body-merge-ab.md) on branch `experiment/d11-peasant-body-merge` at `6db369b3`, experiment implementation `cee85ed2`, base `91a1db31`. Actual Peasant main submissions 119→80 (−39), shadow ~9.3→6.0; A 28.17 vs B 29.00 FPS, frame p50 34.6 ms both and p95 ~42.5 ms both. Only 13 bodies were submitted in main; total draw savings ~1.9%. In-world visual acceptance was incomplete; isolated 64-pose visual/correctness comparison passed. **REVERT recommended, not merged to main.** D11 V1-first strategic direction remains APPROVED.

## Opus verification checklist

- **First verify current code, experimental diffs, toggles and instrumentation**: confirm A/B paths actually activate/deactivate only the intended mechanism, their frame scope, render pass scheduling and all renderer instances. Check `gitSha`, fixture, population, culling/admission, scene/camera and pass counters; differentiate calls, geometry, programs, skeleton updates, texture versions vs actual palette uploads.
- **Identify any simple correctness or methodology mistakes**: e.g. measurement includes hidden/irrelevant work, a toggle is applied too late, a changed resource is recreated each frame, profiling counters perturb comparisons, per-pass timing windows miss the optimized work, waits/GPU saturation hide CPU savings, warmup or cache differences, thermal/driver/session noise, unpaired scene submissions or non-comparable modes.
- **Check actual critical path**: wall-clock RENDER, full-frame p50/p95/p99, GPU elapsed query span, water/mirror timing, scene update vs render. Note that `RENDER` and GPU query spans do not necessarily capture all passes, and that actor hide isolation is not a measurement of any one optimization.
- **Independently assess whether the expected savings could realistically exceed noise** given 39/≈2060 saved draws, render work distribution and measured actor family counts. Consider how a representative closer/denser scene might change *relevance*, without silently changing the target fixture or claiming a win.
- **Review resource/lifecycle risks** of mesh consolidation and Skeleton sharing, especially clone/cache ownership, disposal, allocation, streaming hitches. Flag genuine defects separately from low-ROI hypotheses.
- **Choose a single smallest discriminatory verification or test** only if a specific plausible issue is identified. Otherwise explain clearly why results are consistent with insignificant contribution to the frame critical path.

## Deliverable (Polish summary, English repo documentation)

Concise independent review with (1) confirmed defects and severity, affected file/symbol, evidence and minimal fix, (2) measurement limitations vs falsified hypotheses, (3) whether any of CSS2D / Skeleton sharing / Peasant merge merits retest and under what *changed* conditions, and (4) recommended next evidence or target for meaningful FPS. Preserve all three negative results as provisional evidence. **No implementation, no blanket rebenchmarking, no merging a rejected experiment without author approval.**

Relevant strategy: [Strategic Brief](./STRATEGIC-BRIEF.md) D4 and D11; [NPC recon](./2026-10-29--npc-rendering-optimization-recon.md).
