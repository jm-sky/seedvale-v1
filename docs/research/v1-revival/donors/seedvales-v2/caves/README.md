# Seedvales V2 — cave geometry donor snapshot (reference only)

**Created at:** 2026-11-07
**Status:** Reference-only donor snapshot. **Not runtime code.** Nothing in `src/`, `scripts/` or any build, test or lint path imports these files; they are not compiled, type-checked or tested here.

## Provenance

- Source repository: `jm-sky/seedvales-v2` (<https://github.com/jm-sky/seedvales-v2>), default branch `main`.
- Exact source commit: `9ba54815493b886eb1bdce032f5209aeb2856c37` (2026-10-08, "feat: implement ranged aim assist mechanics for player shots").
- Files are copied **byte-for-byte** (verified with `cmp` against that commit). Paths are preserved relative to the V2 repo root, so the tree here is `src/game/...`.

## Copied files

Requested core (cave geometry):

| Path | Lines | Role |
| --- | --- | --- |
| `src/game/world/caveShape.ts` | 371 | Cave grid construction, surface/spine/clearance functions, mouth patch height |
| `src/game/world/caveField.ts` | 134 | Cave field wrapper around the grid (`SurfaceFn`, spine points, cell types) |
| `src/game/world/gen/caves.ts` | 199 | Worldgen placement of caves (`GenCave` records) |
| `src/game/render/caves.ts` | 737 | Cave render mesh assembly (mouth patch, merged geometry, mouth rocks) |
| `src/game/world/caveRocks.ts` | 213 | Cave-mouth rock placement planning |
| `src/game/render/caveMaterial.ts` | 102 | Cave shader material and day/sun uniforms |

Directly imported dependencies (types, configuration, pure helpers):

| Path | Lines | Why included |
| --- | --- | --- |
| `src/game/world/types.ts` | 243 | `GenCave`, `CaveSize`, `Biome`, `CELL_M`, `GRID_N`, `SEA_LEVEL`, `WORLD_SIZE_M` used by the cave modules |
| `src/game/config/calibration.ts` | 658 | Defines `CAVE` (tunables). Only the `CAVE` block is referenced; the whole file is kept unchanged so the reference is not edited |
| `src/game/core/noise.ts` | 95 | `Noise2D` used by `caveShape.ts` |
| `src/game/core/rng.ts` | 75 | `hashString`, `Rng` used by `caveShape.ts` and `gen/caves.ts` |
| `src/game/core/math.ts` | 45 | `distToSegment` used by `gen/caves.ts` |
| `src/game/world/grid.ts` | 103 | `idx`, `nearestCell`, `sampleGrid` used by `gen/caves.ts` |

Total: **12 files** (about 2,400 lines).

## Key dependencies

- External: `three` (`render/caves.ts`, `render/caveMaterial.ts`), `three/examples/jsm/utils/BufferGeometryUtils.js` (`mergeGeometries`).
- Internal import graph: `caveRocks.ts` and `caveField.ts` depend on `caveShape.ts`; `render/caves.ts` depends on `caveRocks.ts`, `caveShape.ts` and `caveMaterial.ts`; `grid.ts` depends on `types.ts`; `noise.ts` depends on `rng.ts`.

## Intentionally omitted

These are imported by the requested files but were left out because they belong to other V2 systems (simulation, renderer infrastructure, assets, diagnostics). They are not needed to read the cave geometry:

- `src/game/render/quality.ts` (`QualityProfile` type, used by `render/caves.ts` and `render/caveMaterial.ts`)
- `src/game/sim/sim.ts` (`Sim` type, used by `render/caves.ts`; the sim wiring is not part of the geometry)
- `src/game/diag/perf.ts` (`perf` instrumentation, used by `render/caves.ts`)
- `src/game/render/assets.ts` and `src/game/render/assetNames.ts` (glTF loading and `NATURE_MODEL` names used by `render/caves.ts`)
- Any other V2 cave-related files (e.g. cave tests, debug scenes, sound/gameplay hooks, the `docs/` design notes in V2).

Because the import lines of the copied files still point to these omitted paths, the snapshot will **not** type-check or run as-is. That is intended.

## Relation to V1

V1 has its own, independent cave implementation under `src/world/` (`caveGenerator.ts`, `caveVolume.ts`, `createCaves.ts`, `caveMesh.ts`, etc.). This snapshot is not a copy of that code and is not wired into V1. V1 cave generation, rendering and gameplay were not modified by this snapshot.

## Usage rules

- Read-only reference for comparing or porting cave geometry ideas. Any reuse must go through a separate plan, adaptation to V1 ownership and lifecycle rules, and normal verification.
- Do not edit these files in place. Do not import them from runtime code.
- Re-verify against the upstream commit above before relying on any detail; upstream may have moved on.
