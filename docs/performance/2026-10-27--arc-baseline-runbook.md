# Arc baseline runbook — A0a / B0 / C0 (post-P0)

**Status:** operational instructions for certified captures  
**Instrument SHA (minimum):** `94a74470fe94d365bbfbd9a8a42dce150c027f9b` (P0 + main/shadow residual fix)  
**Reference hardware:** author’s Intel Arc laptop, real browser WebGL (not SwiftShader / not headless-only)

**Scheduling / reuse:** [approved D4 policy](../research/v1-revival/2026-10-27--master-revival-roadmap.md#10-benchmark-policy-and-intake) controls when captures are needed. Establish one certified applicable A/B/C reference set and reuse while workload/configuration remain comparable; a changed SHA alone does not require recapture. No automatic full suite per commit or stage. The technical protocol and READY/STOP requirements below remain unchanged.

## Prerequisites

1. `git checkout` / pull so `git rev-parse HEAD` is the instrumented SHA (or later P0-only docs commits).
2. Restart Vite **after** that checkout so `__GIT_COMMIT_FULL__` matches (`PORT=5577 pnpm run dev`).
3. One Seedvale tab only. Close leftover game tabs.
4. Prefer a fresh browser profile / origin if `?benchmark=` worldgen stalls at ~10%.

## Capture protocol

Use `?benchmark=<id>` (deterministic `BENCHMARK_FIXTURE`, auto-start). Do **not** treat preload + 1 s warm-up as cold.

| Lane | URL / action | Notes |
| --- | --- | --- |
| A0a/B0 | `?benchmark=settlement-heavy` | Verify selected settlement + populations. Add controlled front/rear camera as **noncanonical** protocol until deterministic. ≥3 warmed reps. |
| A control | actor-facing pose on same settlement-heavy (or `settlement` if denser) | Record family counts. |
| C0 | `?benchmark=forest` only if grass cover verified; plus `?benchmark=stream` | Do not call forest a meadow. |
| Streaming | `?benchmark=stream` | Separate cold (fresh navigation, phase label) vs warm. |
| Water | `?benchmark=water` | Isolation already includes `no-reflections`. |

Default duration is 30 s. Keep quality High (harness forces it).

## Fire-and-forget (avoid CDP eval timeout)

```js
window.__benchRunning = true
window.__seedvaleRunBenchmark('settlement-heavy', 30).then((r) => {
  window.__benchResult = r
  window.__benchRunning = false
})
```

Poll `window.__benchRunning === false`, then read:

- `window.__seedvalePerfLastReport`
- `window.__seedvalePerfLastArtifacts` → write:
  - `docs/performance/results/YYYY-MM-DD--NNN--benchmark-<scenario>.json`
  - `.raw.json`, `.md`, `.meta.json`

Set `meta.hardwareClass` to `target-gpu` only on verified Arc/real-GPU runs. Fill `context.device.manual` (driver / power / thermal) by hand.

## Accept / STOP

- **READY** requires: SHA match, fixtureVersion present, passSubmissions.reliability=`observed` for A/B, grassBaseline resident counts for C, raw+JSON+MD pair, ≥3 warmed reps with variance note.
- GPU timer `unavailable` is OK if marked; do not invent GPU ms.
- Mark **UNVERIFIED** / **BLOCKED** rather than inventing missing fields.

## Known diagnostic capture

`2026-10-27--032--benchmark-settlement-heavy` — harness smoke on Arc ANGLE, 15 s, pass=`observed`, **not** acceptance baseline.

## Captures after P0

`2026-10-27--033` … `--051` — 3-rep series (settlement-heavy, forest, stream, water) on `c460b224`, Arc 140V via WSL2 Mesa D3D12 → ANGLE/GL, headed Chrome 147, 30 s cooldown before/after each run. Classified `diagnostic` (see `--051--a0a-b0-c0-baseline-summary.md`): NPC population not settled in window, rotation not achievable without pointer lock, `GL_INVALID_OPERATION` sampler mismatch in every run, GPU timer unavailable.

Note: the instrument SHAs above (`94a74470`, `e124e866`) are not in this repo history; the equivalent commits are `5cedca33` and `b21a7eb0`.

## Chrome trace of the benchmark window (native Windows, 2026-10-28)

DevTools' Performance panel closes when saving a ~30 s trace on this machine. Record through CDP instead and stream the trace straight to disk; the window is delimited by `performance.mark('seedvale:bench-window-start' / '-end')` (`src/perf/benchmark.ts`, same moments as `monitor.beginSession()` / `endSession()`).

```text
PORT=5590 pnpm run dev                                   # after checkout, so gitSha matches
node scripts/perf/trace-benchmark-window.mjs 5590 _temp settlement-heavy
python scripts/analyze_trace.py _temp/trace-<scenario>-<sha8>.json file   # → docs/performance/trace-results/*.md
python scripts/perf/cpu_profile_summary.py _temp/trace-<scenario>-<sha8>.json
```

What worked (settlement-heavy and forest, SHA `98ddfbd1`, 29.5 s window, 187–247 MB):

- Poll the page until the start mark exists, then `Tracing.start` (`transferMode: ReturnAsStream`, `streamFormat: json`), `performance.mark('seedvale:trace-start')`, poll for the end mark, `Tracing.end`, drain with `IO.read` in 1 MB chunks. Reading ~190 MB takes ~1–2 minutes after the window ends — **be patient, the file stays 0 B for a while**.
- Categories kept lean: `devtools.timeline`, `disabled-by-default-devtools.timeline(.frame)`, `blink.user_timing`, `v8.execute`, `gpu`, `toplevel`, `disabled-by-default-v8.cpu_profiler`. The first attempt added `v8`, `cc`, `blink`, `viz`, `latencyInfo`: after >7 min the stream was still empty and the run was killed — do not use those categories for a full 30 s window.
- Chrome flags needed or the page reports `visibilityState: hidden` and sticks at world-build 10 %: `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling`, plus `Page.bringToFront`. Kill only the spawned Chrome by PID (`taskkill /F /T /PID`), never by image name.
- **Never overlap runs.** The CDP debug port is fixed; a second driver silently attached to the first Chrome and produced a bogus 135 ms "forest" trace. Wait for `REPORT` (the isolation probes keep running ~1 min after the window), and do not run the Python analysis during a measured window (it saturates a core).
- The trace slows the page: FPS under trace (22.6 settlement-heavy, 36.5 forest) must not be used as benchmark numbers.

Known analyzer gap: `scripts/analyze_trace.py` reports "no `timeDeltas`" and ranks application functions by sample count, although the trace does contain `timeDeltas` on every `ProfileChunk`. Use `scripts/perf/cpu_profile_summary.py` for real self/inclusive milliseconds until the analyzer reads them. The start mark itself is not in the trace (it fires before `Tracing.start`); the window begins ~100 ms before `seedvale:trace-start`.
