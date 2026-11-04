# Q131 — cost + workload baseline (tools-026 D7): boot half

**Date:** 2026-11-04 · **Platform:** WSL2 Chrome (OpenGL/Mesa D3D12, Intel Arc 140V) only — never mix with Windows · **SHA:** see `sha` in each JSON · **Build:** production (`vite build` + `vite preview`)
**Tool:** `node scripts/perf/measure-cost-baseline.mjs <port> <out.json> <seed> <cold|warm> <reps>` — click "Rozpocznij" → `window.__seedvaleReady`, `?bootMark=1` console marks, main-thread JS heap sampled every 500 ms, worker count. Raw JSON: `data/q131/`.
**Cache state:** cold = fresh Chrome profile + `?worldgenFixture=0`; warm = same profile reloaded, prime run discarded, no fixture flag change. n = 3 per cell.

| Seed | State | Ready (s) | worldHydrology (ms) | buildSettlementsManager (ms) | createCaves (ms) | createWorldBundle (ms) | heap peak MiB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 415424794 | cold | 41.0 / 41.2 / 50.8 | 3324 / 2106 / 3994 | 2278 / 1798 / 3086 | 1078 / 1027 / 1478 | 19385 / 16841 / 26677 | 111–138 |
| 415424794 | warm | 21.6 / 21.8 / 30.8 | 212 / 217 / 224 | 73 / 85 / 79 | 12 / 21 / 18 | 3492 / 4262 / 4504 | 88–110 |
| 42 | cold | 74.7 / 54.0 / 68.5 | 3859 / 2213 / 2977 | 10029 / 5355 / 5203 | 3234 / 2629 / 3053 | 53789 / 35375 / 44871 | 87–98 |
| 42 | warm | 27.3 / 28.6 / 22.2 | 207 / 288 / 287 | 63 / 91 / 108 | 283 / 367 / 318 | 4146 / 6854 / 4719 | 92–102 |

Workers: 6 in every run.

## Tolerances (proposed, 🟡 from observed spread)

Cold/warm ready time and `createWorldBundle`: **±25 %** (spread up to 40 % on seed 42 cold, so ≥ 5 reps are advisable for a keep/revert call). Per-phase marks: ±30 %. Compare cold with cold and warm with warm, same seed, same platform.

## Not measured yet (🟡 follow-up, Resume in queue)

- Hydrology sample / compute / install split and payload size; **peak transient (worker) memory** — heap here is main-thread only.
- Chunk-generation p50/p95, map raster cost, road route time.
- Simulation workload: households, NPCs, active transport legs, one time-skip run.
