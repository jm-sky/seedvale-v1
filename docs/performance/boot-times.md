# Boot times

## 2026-10-30 — worldgen cache boot fixture (plan `tools-020`, Q21)

Diagnostic, **WSL2 Chrome (OpenGL/Mesa D3D12), not a performance claim**; one fresh Chrome profile per row, n=1 (noise ≈ ±2 s), Vite dev server. `ready` = navigation → `window.__seedvaleReady`.

| URL | `?worldgenFixture=0` | fixture imported | Δ |
| --- | --- | --- | --- |
| `?benchmark=settlement-heavy&benchmarkAutorun=0` (seed 42) | 84.3 s | 63.3 s (232 records) | −21.0 s |
| `?fly&seed=415424794` (reference seed) | 44.9 s | 24.2 s (231 records) | −20.7 s |

Fixtures: `public/worldgen-fixtures/` (2990 KiB / 2381 KiB gzip). Regenerate with `scripts/perf/export-worldgen-fixture.mjs <port> <benchmark|default>`, check with `pnpm worldgen:fixture:check`.

Older table (2026-08, pre-fixture) below.

**Date:** 2026-08-26 21:51  
**Url:** `http://localhost:5577/?bootMark=1`  

> Used performance utility from `src/shared/bootMark.ts`    
> eg. in `src/app/createApp.ts`
>
> ```typescript
> bootMark('createRenderStack')
> const { ... } = createRenderStack(container, config)
> bootMarkEnd('createRenderStack')
> ```

- `createApp`
  - `createRenderStack` - 19 ms
  - `createWorldBundle` - 6474 ms
  - `rebuildWorld -> buildWorldSystems`
    - `buildChunkManager` - 131 ms
    - `waitForChunks` - 1725 ms
    - `buildSettlementsManager` - 1510 ms
    - `buildFauna` - 1026 ms
