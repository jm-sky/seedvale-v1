# Q17 — Track E travel stutter: recon + slice E1

**Date:** 2026-10-30 · **Author:** Claude Opus 5.5 (autonomous session) · **Queue:** Q17 · **Tracker:** [§E](./2026-10-27--performance-three-track-roadmap.md#e-travel-stutter--included-in-p1-author-decision-2026-10-30) · **Owners:** plan 149 (`src/render/programPrewarm.ts`), `src/terrain/chunkManager.ts`, `src/terrain/riverTileCache.ts`

Scope: frame-time spikes during travel (`stream`), not mean FPS. Evidence: the four Windows `win-ca2-*-stream-rep1` reports ([post-hoc attribution](../../performance/results/2026-10-30--win-q5-ca2-ab.md#ca2-stream--post-hoc-tail-attribution-existing-raw-data-no-new-runs)), read again for this recon. No new measurements in this session (see §4).

## 1. Streamed program families that miss the prewarm

In-window program creations (`[Seedvale Program Compile Cost]`, Windows, both arms):

| Family | Asset / object | Cost (upper bound, whole render call) | Runs |
| --- | --- | --- | --- |
| `MapleTree_Bark` | `maple_1.glb` (tree template) | 338 / 396 ms, mirror pass | A1, B2 (+A2) |
| `Leaves` + `foliage-wind-v3` | fern template, `chunk-vegetation-region-*|fern-*` | 245 / 282 ms | A1, B2 |
| `Green` + `foliage-wind-v3` | `tree_b.glb` (tree template) | 205 / 331 ms, mirror pass | A1, B2 |
| `MI_Eyes` (+ ~7 more character programs) | `Male_Peasant.glb`, skinned | 204 / 721 ms at window start | B1, B2 (A: before the window) |
| `MeshDepthMaterial` | shadow depth variants | 22–31 ms each, 4–5 per run | all |

**Why they miss.** Plan 149 Phase 1 A builds the staging set from the *live home scene* (`buildProgramPrewarmStaging(scene)`). A tree/fern species that does not grow in the home chunks is not in the scene at load, although its template is already loaded: `chunkManager.ts` starts every template cache in `preloadPropTemplates()` and `contentTemplatesReady()` holds content attach until all seven vegetation caches (plus rocks/logs when needed) are ready — so by the time `waitForChunks(home)` resolves, every template is in memory.

**Variant check.** The region batcher draws templates as `new InstancedMesh(templateGeometry, templateMaterial)` (`render/instancedProps.ts`) — shared material objects, no clone. In the same Windows report a later `MapleTree_Bark` program has program-layer mask `8388673` = `instancing | normalMapTangentSpace | vertexNormals` (Three r185 `getProgramCacheKeyBooleans` bit order), i.e. the instanced variant. Object-side program inputs in r185 are only instancing/instancing colour/morph, skinning, points and geometry attributes (`WebGLPrograms.getParameters`); `receiveShadow`/`castShadow`/layers do not enter the key. A one-instance `InstancedMesh` with the template's geometry and material is therefore the exact family.

**Characters.** NPC visuals are assembled after the prewarm (they are not in the home scene at `prewarmRenderPrograms` time); whether the first draw lands before or inside the benchmark window is a race (A runs: before, B runs: frame 6). In real play the same ~700 ms hit lands when the first NPC of an unseen body/outfit family appears. Not fixed here → E3.

**Shadow depth (`MeshDepthMaterial`).** `compileAsync` does not compile the shadow pass's depth/distance materials. 22–31 ms each is below the mirror events by an order of magnitude; left for later (E4 candidate, only if E1–E3 leave it as the dominant tail).

## 2. Synchronous `riverTileBuild`

`ensureLoaded()` → `retainRiverTilesFor()` → `riverTileCache.retain()` → `computeRiverTile()` runs on the main thread the first time any chunk needs a river tile: a 256 m core with a 384 m halo (1 024 m window, 8 m cells → 128 × 128 hydrology grid: depression repair, flow accumulation, stream classification, chain building). Windows cost 37–128 ms per tile. Chunks are 64 m and `loadRadius` 3, so a straight `stream` route (432 m) meets roughly 4–6 new tiles. Two aggravating details:

- the cache is exactly reference-counted (`riverTileCache.ts`): a tile is dropped the moment no loaded chunk overlaps it, so moving back and forth recomputes it;
- the chains are needed *before* the chunk tile request, because `paramsFor()` feeds `riverChannelSegmentsNear()` into terrain carving (plan 189), so the work cannot simply move after the worker tile.

`computeRiverTile(tile, sampleParams)` is pure and deterministic, takes the serialisable `RawSampleParams` the chunk worker already receives, and returns plain data (`RiverChain = { points: RiverPoint[] }`). The chunk worker pool already multiplexes several job kinds (tile, grass, mesh, world knowledge, map tile).

## 3. Slices

### E1 — prewarm instanced chunk-content template families (landed, opt-in)

Commit `0a56f8cc`. `ChunkManager.programPrewarmTemplates()` returns the loaded templates of the ten batched kinds (tree, bush, cactus, reed, fern, lily, seaweed, large rock, rock cluster, fallen log); `buildProgramPrewarmStaging(scene, instancedTemplates)` adds one `InstancedMesh(geometry, material, 1)` per non-skinned template mesh, deduplicated by `(material.uuid × object flags)` against the live scene. Same call site, same 1×1 render-target trick, same timeout, still loading-window only — nothing in `ChunkManager.update`, per chunk or per tick (plan 149 §6.2/6.3 constraints hold). `?prewarmTemplates=1` enables it; default off until the WSL A/B.

Expected effect: the three vegetation events above (≈ 200–400 ms each on Windows) disappear from the window; loading gets longer by the compile time of the new families (bounded by the number of distinct program keys among ~10 kinds of templates, not by template count). Risks: more programs resident (no per-frame cost); a template material that is also used *non-instanced* elsewhere is not covered (not seen in the evidence).

Tests: `src/render/programPrewarm.test.ts` (+3: instanced family per template mesh with shared geometry/material, no duplicate of a family already instanced in the scene, skinned template meshes skipped). `tsc` (no new errors; 3 pre-existing in `src/ui-vue/demos/hud/fixtures.ts`), eslint, `src/render` + `src/perf` + `src/terrain` vitest green.

#### A/B instructions

Same build, fixture `tools-001-v1`, High, `stream`, fresh profile, order A B B A, n ≥ 2 per arm, 20–35 s cooldown. A = default (off), B = `SEEDVALE_QUERY='&prewarmTemplates=1'`.

```text
node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/<wsl|win> q17e1-A 1 30 stream
SEEDVALE_QUERY='&prewarmTemplates=1' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/<wsl|win> q17e1-B 1 30 stream
```

- **Structural (platform-independent):** `[Seedvale Program Compile Cost]` / census — no `MapleTree_Bark`, `Leaves`, `Green` or other template-material program created inside the window in B; programs created in window A > B. `window.__seedvaleProgramPrewarm` (`stagingRoots`, `programCountAfter`, `compileAsyncMs`, `glError = 0`) recorded for both arms.
- **Decides:** frame max, frames ≥ 100 ms, hitch count, p99 (guards: mean FPS, p50/p95, RENDER p50 — no regression).
- **Loading cost:** `compileAsyncMs` B − A, and `?bootMark=1` `ready` time if measured.
- Green on WSL → flip the default on (`?prewarmTemplates=0` disables), list for Windows confirmation. Revert if Windows regresses.

### E2 — river tiles off the main thread (plan for an S session)

Recommended design (prefetch, not async retain):

1. Worker job `requestRiverTile(key, { tile, sampleParams })` in `chunkWorkerPool.ts` + handler in `chunkHeightmap.worker.ts` calling `computeRiverTile` (same pattern as `requestChunkMapTile`).
2. `riverTileCache` gains `prefetch(tile, params)`: in-flight dedupe; finished results go into a small bounded *unreferenced* store (e.g. ≤ 12 tiles, insertion-order eviction). `retain()` takes a ready result from that store (or a still-retained entry) and otherwise computes synchronously exactly as today — the fallback keeps `ensureLoaded()` synchronous and the chain contents identical.
3. `release()` moves a tile whose refcount reaches 0 into the same bounded store instead of dropping it, so back-and-forth travel does not recompute.
4. `chunkManager` `recheck`: prefetch the river tiles overlapping the ring `loadRadius + 2` around the player chunk (tiles are 4 chunks wide, so lead time is several seconds at travel speed); cancel nothing — results are small and bounded.
5. Tests: worker result deep-equals the sync `computeRiverTile` result (determinism, structured clone); `retain` after `prefetch` does not call compute; release → re-retain reuses; store bound respected; `disposeAll` clears in-flight and stored; rebuild/`WorldBundle` dispose leaves no late callbacks writing into a disposed cache.
6. Diagnostics: count `riverTileBuild` sync computes vs prefetched hits (perf monitor stage already exists).

Rejected: making `retain` async inside `ensureLoaded()` — changes chunk lifecycle ordering and leaves `riverChains` undefined on generating records consumed by water/shore queries; larger blast radius than a prefetch with an unchanged sync fallback.

Stop if: the worker cannot reproduce identical chains (any float difference changes carving → determinism/worldgen cache risk), or prefetch needs per-frame work beyond the existing throttled `recheck`.

### E3 — character program families (recon + slice for an S session)

Locate where NPC/fauna visuals are assembled and when relative to `prewarmRenderPrograms` (`src/characters/`, NPC visual owner per CODE_INDEX). Option A: after the home settlement's NPC/fauna visuals are attached, compile them in the same loading window (await their assembly promises, bounded by a timeout). Option B: a one-shot staging of one assembled representative per body file × outfit family from the character asset cache. Prefer A if the visuals are attached within a bounded time after `waitForChunks(home)`; B only if the set is small and the assembly is reusable. Stop if it needs per-NPC material changes or a time-sliced/ongoing prewarm (plan 149 §10.2 forbids an unbounded backlog).

## 4. Measurement status

No WSL A/B in this session: three other agent sessions were running in WSL, and the runbook ([§WSL stack and stability](../../performance/2026-10-27--arc-baseline-runbook.md)) asks to stop extra agent sessions before WSL benchmarks (a VM crash kills every WSL process). E1 stays opt-in; the A/B is listed in queue §4.

**Windows A/B (2026-10-30, SHA `fce67e81`, A B B A):** [report](../../performance/results/2026-10-30--win-q17e1-template-prewarm-ab.md). Structural goal met (`MapleTree_Bark`, `Leaves`, `Green` first-use gone, render-side ≥ 100 ms frames gone); mean FPS / p50 / p95 / ≥ 100 ms counts inconclusive at n = 2 → default stays OFF, author question in queue §3.
