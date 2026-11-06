# Plan: Frame attribution and benchmark provenance (review 041 S0)

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** infrastructure
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `diagnostics`
**Tags:** `performance` `profiling` `benchmark` `v1-revival` `review-041`
**Roadmap:** -

## Goal

Make performance evidence attributable before any review-041 optimization is chosen ([review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md) stage **S0**): correct GPU-span labelling (F16-06), complete effective-settings provenance (F16-09) and join cross-task work to frames (F16-31). Diagnostics only — no change to simulation or default frame work.

| Stage | Findings | Owner (verified 2026-11-06) | Queue |
| --- | --- | --- | --- |
| **T1** GPU span + settings provenance | F16-06, F16-09 | `src/app/gameLoop.ts` (mirror render ~L3301 runs **before** `gpuTimer.beginFrame()` ~L3334), `src/perf/gpuTimer.ts`, `src/config/qualityProfiles.ts`, `src/perf/benchmark.ts`, `src/perf/rawSidecar.ts` | Q182 |
| **T2** cross-task publication timeline | F16-31 | `src/perf/monitor.ts`, `src/perf/agentCpuDiag.ts`, benchmark scenarios; seams: `chunkWorkerPool.ts` (queue/start/response), `chunkManager.ts` (ready/attach), settlement actor ready/attach in `createSettlement.ts` | Q183 |

## Direction

- **T1:** label the existing GPU query as "beauty (+ shadow inside composer)" everywhere it is reported; add a separate, non-overlapping mirror scope using the same disjoint-timer mechanism (no blocking readback, results polled as today). Export the full effective settings with every benchmark/raw sidecar: preset id **plus** DPR, pixel size, AO, water mirror resolution and transparency mode, light/shadow/LOD flags, foliage/far-ring flags, `n8ao`/`three` resolved versions, git SHA + dirty flag, seed and worldgen epoch.
- **T2:** timestamped events for worker job queued/started/responded/cancelled, chunk/grass ready/attached, settlement actor requested/ready/attached/accepted/discarded, joined to frame index in the raw sidecar; optional `PerformanceObserver('longtask')`. Behind the existing perf flags; zero cost when off. Coordinate with [npc-063](./npc-063-agent-performance-update-cost-attribution.md) (NPC cost categories) — T2 does not re-split NPC update cost.
- Extend existing tools (`run-benchmark-series.mjs`, `summarize-ab.mjs`, `analyze-pass-coincidence.mjs`); no second perf framework.

## Verification

- T1: unit test of the settings export; browser run shows mirror and beauty GPU scopes separately and the report labels; schema version bump of the raw sidecar if its shape changes (document in the perf docs that own it).
- T2: a short `stream` run on `?seed=415424794` produces joined events; counts consistent with existing grass/finalization diagnostics; flag off = no extra allocations per frame (inspect).
- Type-check, targeted vitest, lint.

## Stop if

- Instrumentation materially changes frame work with flags off.
- A metric needs a GPU readback that stalls the pipeline.
