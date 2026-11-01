# WSL A/B — world-terrain-055 S1 tight shadow frustum (Q50)

**Platform:** WSL2 Chrome (ANGLE D3D12, Intel Arc 140V), `settlement` fixture `tools-001-v1`, seed 42, Vite dev, SHA `caab7ae2`. Order A B B A, n = 3 per arm (12 reps), 20 s cooldown. Artifacts: `wsl/q50-s1/`. **WSL only — not comparable to Windows numbers.**
**Arms:** A = legacy (default, ±80 centred on player) · B = `&shadowFrustum=tight` (±56, centre 24 m ahead along camera forward).

| Metric (mean of 6 reps) | A legacy | B tight | Δ |
|---|---|---|---|
| shadow-pass calls/frame | 542 | 479 | **−63 (−11.6 %)** |
| shadow-pass triangles/frame | 2.10 M | 1.48 M | **−29 %** |
| main-pass calls | 980 | 982 | 0 |
| frame p50 (ms) | 27.1 | 26.6 | −0.6 (within noise) |
| frame p95 (ms) | 35.9 | 31.6 | −4.3 (noisy: A2 reps 33–46) |
| frame p99 (ms) | 75 | 51 | noisy |
| render p50 (ms) | 20.6 | 20.6 | 0 |
| avg FPS | 33.9 | 36.6 | +2.7 (rep spread 31–39 in both arms) |
| GPU timer avg (ms) | 52.2 | 55.5 | +3.3 (spread; opposite direction to the rest) |

`shadowRefreshFrames` = frames in both arms (0 skipped).

## Reading
- **Structural effect confirmed:** fewer shadow submissions (−63 calls, −29 % triangles). The per-slot `settlementShadowCasters`/`shadowCasters` snapshot counts (decor 199, vegetation 100) are scene-wide, not frustum-culled, so they do not show it — use `passSubmissions.shadow`.
- **Timing effect not demonstrated:** render p50 is identical; FPS/p95 differences are inside the rep-to-rep spread (A vs A2 alone differ by ~1 FPS and 10 ms p95). The GPU timer even reads higher in B. Treat as "no regression, small/unproven gain". **No FPS gain claimed.**
- Not measured here: visual coverage (edge shadows, fast camera turns, low sun, water-mirror) — author check required.

## Status
Flag stays **default off** (legacy). Next: native Windows Arc A/B (queue §4) and author visual check (queue §2). S2 (Q51) is a separate A/B.
