# WSL A/B — 058 P1 new global hydrology vs `?hydrology=legacy` (Q80) — boot failures fixed, A/B n=3 complete

**Platform:** WSL2 Chrome (Mesa D3D12), Vite dev, seed 42 fixtures `stream` + `settlement`, HEAD `a25e47aa`. Artifacts `wsl/q80-p1/`. **WSL only.** Arms: A = new global hydrology (default) · B = `&hydrology=legacy`.

| Arm | Boots OK | Notes |
|---|---|---|
| B legacy (B1, 2 reps × 2 scenarios) | 4 / 4 | stream 60.1 / 59.5 fps (p95 26.2 / 27.2); settlement 51.8 / 57.2 fps (p95 22.5 / 19.9) |
| A new, stale Vite (A1, A2) | 1 / 4 | only A1 settlement booted (45.4 fps, p95 28.8); other 3: `timeout waiting for benchmark`, page exception `Error: chunk worker error` (empty message) ~100 ms after workers spawn. Artifacts in `wsl/q80-p1/stale-vite-failed/` |
| A new, fresh Vite restart (A3, 2 reps × 2) | 2 / 4 | stream rep1 57.8 fps (p95 26.1); settlement rep2 **15.8 fps (p95 67.2)**; stream rep2 + settlement rep1 failed to boot (`A3-*.bootfail.json`) |

**Reading (🟡 not a root cause):** the new path boots in 3 of 8 runs vs legacy 4 of 4 (n is small). Failure = chunk worker `onerror` with no message, before the benchmark starts; no HTTP ≥ 400 / loadingFailed events. Not a stale-server artifact (reproduced after a fresh Vite restart). The one slow booted settlement rep suggests a second issue (or the same flakiness: workers restarting). Cause not identified; note the dev-server cold sampling (~11 s in H2 notes) and worker respawn path were not isolated.

**Decision:** no deletion of the legacy per-tile path, no fixture re-export, no baseline re-take. A bounded recon (Opus) must first find why the chunk worker errors at boot on the new path (capture `ErrorEvent` details in `chunkWorkerPool`, test with a production build to exclude dev-server module-load races).

## Root cause and fix (Opus recon, 2026-11-03, `a46044f6`)

Reproduced with a CDP script (fresh profile, Vite dev, `?benchmark=stream`): 2–5 of 6 boots failed; **production build + `vite preview`: 4/4 OK** (worker is one bundled file; strip sampling 0.9 s vs ~4 s in dev). Not caused by the CDP auto-attach (still failing without it).

- The new path creates the chunk worker pool **during page load** (hydrology strips at ~1.6 s) instead of after boot. Under Vite dev each module worker fetches its ~445-module graph while the page still loads ~1300 modules. In the failing worker ~50 module requests stay pending, no request fails or returns ≥ 400, and the worker dies with a bare `Event` (no `ErrorEvent` fields) at the moment the other workers finish loading; its remaining requests are then cancelled. 🟡 Exact Chrome/Vite trigger not identified; dev-only per the preview result.
- **Pool bug that turned it into a boot failure:** `onerror` pushed the dead worker back to `free` (later jobs never answered → `timeout waiting for benchmark`) and rejected the strip → `ensureWorldHydrology` rejected → boot died.
- **Fix** (`src/terrain/chunkWorkerPool.ts`): an `error` event retires the worker (terminate, handlers detached), spawns a replacement (receives installed hydrology first) and requeues the job at the front once; respawns bounded at 2 × size; a pool without live workers rejects queued work. Tests in `chunkWorkerPool.test.ts`. After the fix: 6/6 dev boots computed the hydrology (hash `6e4144d9`, identical every boot), typically with one `worker error — replacing worker` log.

## A/B after the fix (n = 3, WSL, served code = `a46044f6` working tree; Vite SHA label stale `a25e47aa`)

Artifacts `wsl/q80-p1/A4-*` (new) and `B2-*` (`&hydrology=legacy`), logs `A4.log` / `B2.log`. **Boots 12/12.**

| Scenario | A new fps (reps) | B legacy fps (reps) | A p95 ms | B p95 ms | draws A / B |
|---|---|---|---|---|---|
| stream | 56.3 · 58.0 · 59.2 (avg 57.8) | 61.8 · 58.2 · 55.9 (avg 58.6) | 29.8 · 31.8 · 27.4 | 25.9 · 26.0 · 36.6 | ~422 / ~383 |
| settlement | 54.2 · 48.0 · 53.8 (avg 52.0) | 56.8 · 54.8 · 55.0 (avg 55.5) | 22.7 · 23.4 · 21.3 | 19.9 · 20.7 · 20.5 | ~1161 / ~1117 |

**Reading:** stream — no regression (ranges overlap). Settlement — A ~3.5 fps lower, p95 ~+2 ms. The arms render **different worlds**: the new hydrology moves rivers/lakes and the settlement layout follows, so the settlement view has +10 water meshes (35 vs 25), +0.74 M water triangles (2.51 M vs 1.78 M) and +30 settlement draws (388 vs 358), fewer terrain/item draws. Recorded reason (plan P1 done-when): the settlement delta is a **workload/content change** of the approved hydrology direction, not a measured per-frame cost of the new path. Never claim FPS changes; Windows confirmation → queue §4.
