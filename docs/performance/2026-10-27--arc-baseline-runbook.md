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
