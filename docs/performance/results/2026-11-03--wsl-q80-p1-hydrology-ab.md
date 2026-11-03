# WSL A/B — 058 P1 new global hydrology vs `?hydrology=legacy` (Q80) — INCOMPLETE, boot failures

**Platform:** WSL2 Chrome (Mesa D3D12), Vite dev, seed 42 fixtures `stream` + `settlement`, HEAD `a25e47aa`. Artifacts `wsl/q80-p1/`. **WSL only.** Arms: A = new global hydrology (default) · B = `&hydrology=legacy`.

| Arm | Boots OK | Notes |
|---|---|---|
| B legacy (B1, 2 reps × 2 scenarios) | 4 / 4 | stream 60.1 / 59.5 fps (p95 26.2 / 27.2); settlement 51.8 / 57.2 fps (p95 22.5 / 19.9) |
| A new, stale Vite (A1, A2) | 1 / 4 | only A1 settlement booted (45.4 fps, p95 28.8); other 3: `timeout waiting for benchmark`, page exception `Error: chunk worker error` (empty message) ~100 ms after workers spawn. Artifacts in `wsl/q80-p1/stale-vite-failed/` |
| A new, fresh Vite restart (A3, 2 reps × 2) | 2 / 4 | stream rep1 57.8 fps (p95 26.1); settlement rep2 **15.8 fps (p95 67.2)**; stream rep2 + settlement rep1 failed to boot (`A3-*.bootfail.json`) |

**Reading (🟡 not a root cause):** the new path boots in 3 of 8 runs vs legacy 4 of 4 (n is small). Failure = chunk worker `onerror` with no message, before the benchmark starts; no HTTP ≥ 400 / loadingFailed events. Not a stale-server artifact (reproduced after a fresh Vite restart). The one slow booted settlement rep suggests a second issue (or the same flakiness: workers restarting). Cause not identified; note the dev-server cold sampling (~11 s in H2 notes) and worker respawn path were not isolated.

**Decision:** no deletion of the legacy per-tile path, no fixture re-export, no baseline re-take. A bounded recon (Opus) must first find why the chunk worker errors at boot on the new path (capture `ErrorEvent` details in `chunkWorkerPool`, test with a production build to exclude dev-server module-load races).
