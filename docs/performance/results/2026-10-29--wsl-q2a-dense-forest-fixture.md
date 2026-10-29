# Q2a — `dense-forest` benchmark fixture, first WSL census

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Platform: WSL2** (Chrome, ANGLE → OpenGL → Mesa D3D12, Intel Arc 140V). **Do not compare with Windows numbers.**
**Verdict:** the new fixture measures a real forest. Trees there are a top-three triangle cost (3.7M main + 3.7M shadow, 240 main draws), after grass (17M) and terrain (4.9M). On WSL, hiding vegetation saves only 0.4 ms of RENDER CPU wall. The WSL GPU timer cannot attribute GPU time per bucket. **P1-D is neither closed nor planned yet.** The deciding run is the native Windows `dense-forest` census and isolation (queue §4).

## Fixture

- Scenario id `dense-forest` (`src/perf/denseForestScenario.ts`, `a6676a11`). This is tooling only, with no runtime workload change.
- **Anchor rule.** The search covers rings every 64 m out to 1 536 m from home, at 16 angles. Each candidate is scored by the **mean** `forestFactor` over a 5×5 window at 48 m spacing (±96 m). Wet candidates (height < water + 1 m) are skipped. Everything else is as in `forest`: High, warm, population gate.
- **Why the old `forest` fixture was not a forest.** It takes the single highest `forestFactor` *sample* within 384 m of home. On `tools-001-v1` that resolves to (-8.1, 20.5), which is the home settlement (194 vegetation instances, 687 settlement draws). Historical `forest` results stay valid as a "home, grass-heavy" scene. They are not a forest measurement.
- Artifacts: `wsl/2026-10-29--wsl-q2a-{dense-forest,forest}-rep1.*` (SHA `a6676a11`, n = 1 each).

## Census (main pass, one traversal)

| Bucket | `dense-forest` (-895, 356) | `forest` (-8, 20) |
| --- | --- | --- |
| Vegetation draws / tris / instances | **240 / 3.74M / 2 457** | 112 / 4.1k / 194 |
| Vegetation shadow draws / tris | **238 / 3.73M** | 101 / 3.7k |
| Grass draws / tris / instances | 84 / 17.05M / 1.33M | 72 / 7.47M / 564k |
| Terrain tris | 4.94M | 4.05M |
| Settlement draws (main) | 822 (a village is in view) | 687 |
| Main calls avg / triangles avg | 557 / 16.70M | — / 11.52M |
| FPS avg · frame p50 / p95 | 47.8 · 21.2 / 25.2 ms | 42.9 · 22.8 / 30.9 ms |

## Isolation probes, `dense-forest` (RENDER CPU wall, includes driver wait)

| Probe | RENDER avg | Δ vs baseline |
| --- | ---: | ---: |
| baseline | 12.2 ms | — |
| hide-vegetation | 11.7 ms | −0.4 ms |
| hide-vegetation + grass | 11.5 ms | −0.7 ms |
| hide-settlement | 10.4 ms | −1.8 ms |
| hide-npc-fauna | 10.2 ms | −1.9 ms |
| no-shadows | 11.7 ms | −0.5 ms |

The WSL GPU timer reports 34.5 ms GPU elapsed against a 12.2 ms CPU wall. That is the known WSL D3D12-translation effect, so it says nothing about per-bucket GPU cost.

## Reading

- Trees are now the census's third triangle bucket (3.74M, after grass 17.05M and terrain 4.94M), and each is drawn twice (main + shadow). That is the cost LOD1 targets. The recon's "≤ 1.3M tris everywhere" no longer holds for a real forest. Census triangles count submitted instances before GPU culling, so they are not directly comparable with `renderer.info`.
- On WSL, the CPU submission share of vegetation is small (−0.4 ms). Actors and the settlement in view still cost more CPU.
- The open question is GPU. 7.5M tree triangles plus 17M grass triangles may matter on Arc (Windows is triangle/GPU-sensitive in grass-heavy scenes) or may not. WSL cannot answer that.

## Decision path (recon §6)

1. **Windows run (queue §4):** `dense-forest`, n = 3, with isolation. If `hide-vegetation` removes ≥ ~2 ms RENDER or GPU time, or trees rank as a top bucket, write `world-terrain-055` (LOD1, isolated parity demo first, recon §5).
2. Otherwise close P1-D as "measured, not needed". The asset package stays inert.

```
node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-q2a 3 35 dense-forest
```

## Limits

- n = 1 per scenario. That is enough for structural counts, not for frame-time comparisons.
- The anchor has a village in view (822 settlement draws), so the scene is "forest with a village", not pure forest. That is still the realistic case. A stricter rule (excluding settlement cells) can come later if the Windows isolation is ambiguous.
