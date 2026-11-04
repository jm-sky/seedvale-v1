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

## Headless worldgen cost (Node, no browser)

**Tool:** `pnpm tsx scripts/perf/measure-worldgen-cost.ts --reps=3 --chunks=60` · raw: `data/q131/worldgen-cost-node.json` · Node/V8 on WSL2, single thread, no workers — **not comparable** to the browser table above or to Windows. Seeds run sequentially in one process, so per-rep RSS is cumulative (use only as an upper bound, ✅ ~450–640 MiB for the whole script; worker transient memory is not captured).

| Seed | hydrology sample (ms) | hydrology compute (ms) | install (ms) | payload / copy (MiB) | chunk tile p50 / p95 (ms) | layout (ms) | 22 defs (ms) | all road routes (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 3665 / 3897 / 3593 | 746 / 751 / 647 | < 1 | 6.6 | 6.8–7.3 / 7.9–11.8 | 621–671 | 1991–2096 | 33.5–36.1 s |
| 415424794 | 3633 / 3917 / 4368 | 631 / 672 / 650 | < 1 | 6.8 | 7.0–7.8 / 9.0–12.2 | 531–572 | 2059–2146 | 23.0–23.5 s |

- Floor rows (raw sample input) are 9 MiB per grid; payload matches the 058 notes (6.63 / 6.79 MiB).
- Chunk tiles are **bare** (no roads, clearings, rivers, vegetation counts only nominal) over 60 chunks spread across the continent: a lower bound for in-game worker cost, ✅ measured only as relative baseline.
- Road routes: 22 sites, 37 / 39 routes; the ~23–36 s is **Node cold compute of every settlement's routes** (the game computes lazily and caches) — a bound for a "route everything" tool, not boot cost.
- Tolerance 🟡: hydrology and chunk figures ±20 % (observed spread ≤ 20 %, chunk p95 ≤ 50 % with 60 samples); routes ±25 %.

## Not measured yet (🟡)

- **Peak transient worker memory** and map-raster cost need a browser/debug hook (no runtime change made here).
- **Simulation workload** (households, NPCs, transport legs, one time-skip run): needs the runtime simulation harness; not attempted headlessly.
