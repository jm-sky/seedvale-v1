# WSL A/B — world-terrain-055 S2 half-rate shadow refresh (Q51)

**Platform:** WSL2 Chrome (ANGLE D3D12, Intel Arc 140V), `settlement` fixture `tools-001-v1`, seed 42, Vite dev, SHA `a7c2852c`. A B B A, n = 3 per arm. Artifacts `wsl/q51-s2/`. **WSL only.**
Fixture camera/player is static (identical `cameraPose` in every rep), so the gain applies.
**Arms:** A = per-frame refresh · B = `&shadowActorCadence=1`.

| Metric (mean of 6 reps) | A | B | Δ |
|---|---|---|---|
| shadow refresh frames / frames | 305 / 305 | 154 / 308 | half skipped |
| draw calls avg | 1847 | 1588 | −260 |
| frame p50 (ms) | 27.2 | 26.1 | −1.2 |
| render p50 (ms) | 20.9 | 19.0 | −1.9 |
| frame p95 (ms) | 33.4 | 32.4 | −1.0 (one B rep 44.5, one A rep 35.8) |
| frame p99 (ms) | 64.8 | 54.1 | −10.7 (noisy) |
| avg FPS | 34.9 | 38.9 | +4.0 (rep spread 31–37 vs 35–41) |
| long frames | 1.5 | 1.7 | same |

Reading: render p50 drops consistently with the skipped shadow passes; no regression in guards (one B rep with p95 44.5 is a single outlier, p99 is better on average). Gain is limited to a stationary player/camera. Cost: NPC/fauna shadows may lag up to one frame.

**Decision (author 2026-11-01):** no WSL regression → enabled by default; `?shadowActorCadence=0` reverts. Windows A/B and visual check remain (queue §4/§2).
