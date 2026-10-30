# Q17 E1 — streamed template program prewarm, Windows A/B (`stream`)

**Platform:** native Windows 11, Chrome headed, ANGLE D3D11 Intel Arc (fresh profile per run, 30 s cooldown). **SHA:** `fce67e81`. **Scenario:** `stream`, 1 rep per run, order A B B A, n = 2 per arm. A = default (off), B = `?prewarmTemplates=1`.
Raw artifacts: `docs/performance/results/win/q17e1-{A1,B1,B2,A2}-stream-rep1.*`. Not comparable with WSL numbers.

## Verdict: ambiguous — default stays OFF

The structural goal is met (template programs no longer link mid-travel) and render-side long frames disappear, but n = 2 cannot separate the guards from run-to-run noise (A1 vs A2 differ by 15 FPS) and B has *more* non-render ≥ 100 ms frames.

## Structural (`[Seedvale Program Compile Cost]`, first-use wall-clock of the render call)

| Run | Programs created | Big first-use (> 40 ms) | Sum of measured |
|---|---|---|---|
| A1 | 131 | `Pond_Pack_MAT` 188, **`MapleTree_Bark` 219, `Leaves` 212, `Green` 215** | 907 ms |
| B1 | 132 | `Pond_Pack_MAT` 186 | 273 ms |
| B2 | 132 | `MeshDepthMaterial` 41, 42 | 153 ms |
| A2 | 130 | **`MapleTree_Bark` 356, `Leaves` 230, `Green` 324** | 1041 ms |

`MapleTree_Bark`, `Leaves`, `Green` vanish from the window in both B runs. Total program count is unchanged (≈ 131): in B they are created in the loading window (frame 0 +78/+79 vs +74/+75). `Pond_Pack_MAT` (`branch.glb` item prop) is a remaining first-use in A1/B1 only (not a template family). `window.__seedvaleProgramPrewarm` was not captured by the series script, so `compileAsyncMs` B − A (load cost) is **not measured**; frame-0 growth of +4 programs is the only load-side signal.

## Decisive metrics (frame wall-clock)

| Run | max | frames ≥ 100 ms | of which render-dominated | p99 |
|---|---|---|---|---|
| A1 | 277.5 | 5 | 4 (203–231 ms render) | 61.1 |
| A2 | 429.5 | 4 | 3 (251–361 ms render) | 61.9 |
| B1 | 235.7 | 9 | 1 (frame 33, `WATER` 188 ms = `Pond_Pack_MAT`) | 86.0 |
| B2 | 187.6 | 6 | 0 | 84.9 |

Render-side spikes (shader link) are gone in B; the remaining ≥ 100 ms frames in B are simulate-side (see attribution) and more numerous than in A (15 vs 9 over two runs), which this data cannot attribute to the flag (simulate-side work is unrelated to program prewarm).

## Guards

| Run | mean FPS | p50 | p95 | RENDER p50 | frames |
|---|---|---|---|---|---|
| A1 | 58.1 | 15.2 | 30.0 | 10.3 | 1360 |
| A2 | 43.2 | 20.8 | 38.4 | 14.4 | 1143 |
| B1 | 43.4 | 20.6 | 37.5 | 14.1 | 1156 |
| B2 | 40.7 | 22.4 | 42.5 | 15.6 | 1077 |

A1 is a fast outlier; A2 ≈ B1. B2 is slightly slower (+1.2 ms render p50 vs A2). No regression can be claimed or excluded with n = 2; A-arm spread (A1↔A2) is larger than the A↔B difference.

## Post-hoc tail attribution (what remains)

- B1 worst frame 236 ms: `simulate` 223 ms — `NPC` 214 ms, stage `riverTileBuild` 133 ms → Q23 (characters) / Q22 (river tiles).
- Other B ≥ 100 ms frames have `render` 6–56 ms (simulate/stream side): river tile builds and NPC first assembly.
- Remaining render first-use: `MeshDepthMaterial` shadow-depth variants (13–42 ms), `Pond_Pack_MAT` (186 ms, A1/B1).

## Open decision (author)

Enable by default on structural evidence alone, or first repeat with n ≥ 3 per arm to resolve the guards? See queue §3.
