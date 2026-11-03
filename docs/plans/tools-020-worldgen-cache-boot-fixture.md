# Plan: Worldgen cache boot fixture (benchmark seed + reference seed)

**Created:** 2026-10-30  
**Status:** `verification needed` 🔍
**Priority:** medium · **Effort:** M  
**Depends on:** none  
**Domain:** `tools`  
**Subdomains:** `persistence` `perf` `worldgen-cache`  
**Type:** `infrastructure`  
**Roadmap:** V1 Revival queue Q19

## Problem

Every benchmark rep starts Chrome with a fresh profile (`scripts/perf/run-benchmark-series.mjs`), and every manual check in a new profile/incognito window boots the world **cold**: the disposable worldgen cache (`src/persistence/worldgenCacheDb.ts`, plan world-015) is empty, so caves, settlement definitions and road routes are regenerated before the player can move. The author asked (2026-10-30) to ship cache records for the benchmark fixture seed (`42`) and the reference seed (`415424794`) in the repository and import them into the existing cache at boot.

**Author decision (2026-10-30, queue §3 → (a)):** the fixture serves the **loading phase only**. Inside a benchmark measurement window (especially `stream`), streaming must stay cold — no extra cache hits compared with a cold run.

## Current boot breakdown (WSL2, 2026-10-30)

Diagnostic, **WSL2 Chrome (OpenGL/Mesa D3D12), not a performance claim**. `?benchmark=settlement&bootMark=1` (seed 42, benchmark fixture config), Vite dev server, one Chrome profile reused across navigations; raw probe output kept out of the repo (scratch). `ready` = navigation → `window.__seedvaleReady`.

| Pass | Browser HTTP cache | Worldgen IDB cache | `ready` | `createWorldBundle` | `createCaves` | `buildSettlementsManager` |
| --- | --- | --- | --- | --- | --- | --- |
| cold | empty | empty | 88.4 s | 29.2 s | 2.24 s | 0.60 s |
| warm | warm | full | 70.3 s | 12.2 s | 0.10 s | 0.24 s |
| IDB cleared | warm | **empty** | 88.1 s | 29.6 s | 2.31 s | 0.58 s |
| warm again | warm | full | 74.9 s | 10.9 s | 0.08 s | 0.28 s |

- The **worldgen IDB cache alone** is worth ~17–19 s of `createWorldBundle` and ~13–17 s of `ready` on this machine; the browser HTTP cache contributes ≈ 0 (cold ≈ IDB-cleared).
- `waitForChunks` (3.5–4.8 s) does not move with the cache: chunk tiles are generated in workers in parallel, the per-chunk IDB hit does not shorten the critical path.
- Most of the saving is **not** under an existing boot mark (caves ≈ 2.3 s, settlements ≈ 0.35 s are). Per-namespace attribution below.
- Side finding (not part of this plan): with a warm worldgen cache the fauna/item GLB loads (`loadFaunaTemplates`, `preloadItemGlbModels`) span ~45 s, cold they finish in ~1 s while `buildSettlementProps`/`spawnLivestock` span ~45–51 s. The cold pattern also appears when only `chunk-tiles` is deleted. These are wall-clock spans of overlapping async work (the post-ready background phase is shifted between owners); recorded in LOOSE-ENDS for a later boot-time look.

Cache contents after one boot (seed 42, benchmark config):

| Namespace @ version | Records | Payload size (est.) |
| --- | --- | --- |
| `caves-v2@2` | 9 | 4.1 MB |
| `settlement-definitions@3` | 108 | 1.7 MB |
| `road-routes@1` | 115 | 0.9 MB |
| `chunk-tiles@5` | 65 (+ manifest) | 78 MB |
| `locations-coarse@1`, `abandoned-cemeteries@2` | 0 | — |

### Per-namespace attribution

Same setup, warm profile with **one namespace deleted** before the navigation (the deleted namespace is regenerated and re-persisted by that boot, so passes are independent). Single run each — WSL noise is roughly ±2 s on `createWorldBundle`.

| Pass | `createWorldBundle` | Δ vs warm | `ready` | Notes |
| --- | --- | --- | --- | --- |
| cold (fresh profile) | 33.5 s | +22.6 s | 99.6 s | |
| drop `chunk-tiles` | 9.3 s | ≈ 0 | 76.0 s | `waitForChunks` 4.5 s — no boot gain from 78 MB of tiles |
| drop `road-routes` | 17.3 s | **+6.4 s** | 77.0 s | A* recomputed for 115 routes (unmarked) |
| drop `settlement-definitions` | 26.8 s | **+15.9 s** | 87.3 s | dominant; mostly outside the `buildSettlementsManager` mark |
| drop `caves-v2` | 13.5 s | **+2.6 s** | 74.0 s | `cave.topology` + `cave.heightfield` |
| warm (all namespaces) | 10.9 s | — | 70.9 s | |

The three small namespaces (≈ 6.7 MB raw) carry the whole measured boot saving; `chunk-tiles` (≈ 78 MB raw, ~1.2 MB per chunk at resolution 193) carries none.

## Design

### What goes into the fixture

- **Included:** `settlement-definitions`, `road-routes`, `caves-v2` — every record of the current namespace version present at the capture point. Expected size ≈ 6.7 MB raw per seed before compression (to be confirmed by the exporter; budget **≤ 3 MB compressed per fixture**, otherwise stop and report).
- **Included if non-empty at capture:** `locations-coarse`, `abandoned-cemeteries` (empty after a seed-42 boot today; small by construction).
- **Excluded:** `chunk-tiles` — no measured boot gain and ~78 MB raw per seed; it also owns a byte-budget manifest the importer would have to keep consistent. Revisit only with new evidence.
- The exporter refuses unknown namespaces (new namespaces join deliberately, with an owner).

### Why this keeps the benchmark window unchanged (author decision (a))

The fixture is captured from a **cold boot at the fixture's own spawn, at `__seedvaleReady`**, after flushing pending cache writes — i.e. it is exactly the IndexedDB state a cold run has written by the end of its loading phase. A cold run hydrates nothing but has computed the same records in memory; a fixture run hydrates the same records. Everything that is generated later — benchmark scenario relocation/preload (`settlement-heavy`, `dense-forest`, …) and all `stream` in-window streaming — finds no fixture record and stays cold, exactly as today.

Scenario anchor preloads (before the window, so allowed by (a)) are deliberately **not** included in v1: it would need a per-scenario union and an explicit proof that no `stream` in-window key overlaps. Possible follow-up only if loading time of those scenarios matters.

### File format and location

- One file per `(seed, config profile)`: `public/worldgen-fixtures/<seed>-<profile>.svwc` (gzip). Profiles: `benchmark` (seed 42, `BENCHMARK_FIXTURE` terrain config), `default` (seed `415424794`, default `WorldConfig` without localStorage overlay).
- Content: a JSON header (`format`, fixture version, seed, profile, git SHA of the exporter run, created-at, record list) plus one binary section. Typed arrays inside payloads are replaced by `{ $ta: '<Float32Array|…>', offset, length }` references into the binary section (IndexedDB structured clone keeps typed arrays; JSON does not). Gzip via `CompressionStream`/`DecompressionStream` in the browser, `node:zlib` in tools.
- A small sidecar `public/worldgen-fixtures/index.json` lists available fixtures with namespace versions, record counts and sizes, so the importer fetches nothing for other seeds and the check script needs no decompression.
- Fixtures are regenerated, never edited. Regeneration replaces the file (git history grows by the compressed size each time — keep it rare; see size budget).

### Import path (owner: new `src/persistence/worldgenFixture.ts`, persistence domain)

1. `createApp` awaits `importWorldgenFixture(config.seed, profile)` **before** `createWorldBundle()` (and on the world-rebuild path before the rebuilt bundle), so every namespace owner's `activate()`/snapshot read sees the records.
2. No fixture for the seed/profile in `index.json` → return immediately (one small fetch, cached).
3. Marker record `<seed>/worldgen-fixture/1/<fixtureHash>` in the same store: present → skip (already imported in this profile). `deleteCacheForSeed()` (Seed Library "Clear cache") removes the marker with the rest, so the next boot re-imports — acceptable because fixture records are by construction what generation would produce.
4. Records whose `version` differs from the namespace's **current** version are dropped at import (a stale-version record would never be evicted: `enforceCacheCap()` filters by version). The current versions come from a registry that imports each owner's exported `*_VERSION` constant; a unit test asserts every namespace in the registry is the owner's constant.
5. **Fingerprints are not checked at import** — the importer does not know the runtime config inputs. Owners already treat a fingerprint mismatch as a miss (and a stale fixture is therefore a miss, never wrong data). The importer keeps each record's original `fingerprint`; it never recomputes or rewrites one.
6. Records are written with `putCacheRecords()` and `lastAccessedAt = Date.now()`. Chunk-tile records (if ever included) must also update the `chunk-tiles` byte manifest — excluded in v1, see scope.
7. Any failure (fetch, decompress, parse, IDB) → log once, continue cold. Runtime correctness never depends on the fixture.
8. Disable switch: `?worldgenFixture=0` (benchmark A/B of the importer itself, debugging a suspected stale fixture). Benchmark artifacts record `worldgenFixture: { id, imported, skipped, records }` in `meta` so reports state whether the loading phase used it.

### Export tool

`scripts/perf/export-worldgen-fixture.mjs <vitePort> <profile>` — same CDP pattern as `run-benchmark-series.mjs`: fresh Chrome profile, `?worldgenFixture=0` + the profile URL (`?benchmark=…&benchmarkAutorun=0` equivalent, or `?seed=415424794`), wait for `__seedvaleReady`, call a dev-only `window.__seedvaleFlushWorldgenCache()` (each owner's debounced `flush()`), then `window.__seedvaleExportWorldgenFixture(seed)` returns the encoded bytes; the script writes the file and updates `index.json`. Requires a headed Chrome with a real GPU (WSL2 OK — export does not measure anything). The benchmark must not auto-run during export; verify how `?benchmark=` triggers the run and add a no-autorun switch if none exists.

### Staleness

- `pnpm worldgen:fixture:check` (no browser): compares `index.json` namespace versions with the registry; prints which fixtures are stale. Not part of `pnpm test` (a namespace version bump must not fail unrelated commits); the namespace-owner bump rule in CLAUDE.md gains one line: "if `public/worldgen-fixtures/index.json` lists the namespace, regenerate the fixtures or note it in LOOSE-ENDS".
- A namespace version bump with a forgotten regeneration only costs loading time (records dropped at import), never correctness.

## Tests

- Encode/decode round-trip incl. typed arrays (each kind used by cave payloads), empty binary section, corrupted/truncated input → `null`.
- Import: version filter drops stale-version records; marker skip; `deleteCacheForSeed` removes the marker; failure paths resolve without throwing (fake IDB as in existing `worldgenCacheDb` tests).
- Registry test: registry version === each owner's exported constant.
- Owner hit test for one namespace (settlement definitions): an imported record with matching fingerprint hydrates; a mismatching fingerprint stays a miss.

## Verification

- Technical: `npx tsc --noEmit`, targeted vitest, `pnpm run lint:fix`.
- Boot evidence (WSL, diagnostic): fresh profile, `?bootMark=1`, fixture on vs `?worldgenFixture=0`, both seeds; expect `createCaves`/`buildSettlementsManager` and `createWorldBundle` to approach the warm row above. Report in `docs/performance/boot-times.md` (replace the 2026-08 table).
- Benchmark neutrality: one `stream` WSL rep with fixture vs `?worldgenFixture=0` — no claim of equality from n=1, only a check that cache hit counters inside the window (`getChunkTileCacheStats`, settlement/road hydrate counts) are identical. Not an A/B for keep/revert.
- Author: none required (no visual change). Listed in queue §4 only as a note that benchmark loading uses the fixture.

## Out of scope

- Caching more data (new namespaces) — only where an owner exists; nothing new in v1.
- Shipping the fixture in production builds for players (it lives in `public/`, so it is in the build; acceptable size-wise, but the player-facing value is only for these two seeds).
- The GLB/background boot spans noted above (LOOSE-ENDS).

## Implementation notes (Q21, 2026-10-30)

- Code: `src/persistence/worldgenFixture{,Codec,Namespaces}.ts`, import hook before `createWorldBundle` in `createApp.ts` (boot only — the in-session world-rebuild path does not re-import), `?worldgenFixture=0`, `?benchmarkAutorun=0`.
- Deviation: no per-owner `flush()` hook. The exporter waits for `__seedvaleReady`, settles 20 s for the debounced writes and re-exports until the record count is stable. Benchmark `meta.worldgenFixture` is read by `run-benchmark-series.mjs` from `window.__seedvaleWorldgenFixtureStats()`.
- `default` profile is exported via `?fly&seed=415424794` (default `WorldConfig`, no start screen). `locations-coarse` / `abandoned-cemeteries` had 0 records at capture.
- The seed-42 fixture was 2990 KiB under the old 3 MB budget; with the 058 hydrology namespace and current namespace versions it is ~5.8 MB gzip. Budget raised to 6 MB (author, 2026-11-03, Q80).
- Not done: owner hit test (settlement fingerprint match/mismatch — importer never rewrites fingerprints) and the `stream` in-window counter comparison (fixture vs `?worldgenFixture=0`).
