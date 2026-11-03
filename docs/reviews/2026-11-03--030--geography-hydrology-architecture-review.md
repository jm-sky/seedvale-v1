# Review 030 — geography + global hydrology architecture (after 058 H1–L2, Q96, Q80 legacy removal)

- **Date:** 2026-11-03 · **Reviewer:** Claude Code (Opus 5.5) · **Commit:** `bc1331e3` (main)
- **Scope:** matrix areas **01** (terrain sampling seam only) and **02** (global hydrology, land/water semantics) plus their consumer seams (settlement placement, map/catalog, worker pool, caches, docs). **Out of scope:** visual quality (Q92/Q98), road shape (Q61–Q64), census numbers (Q80 re-takes them), biome borders (Q70).
- **Method:** code reading at the seams (`chunkHeightmap.sampleRawTexel`, `worldHydrology*`, `chunkWorkerPool`, `waterSurface`, `terrainClassification`, `riverNetwork`, `riverQuery`, `settlementPlanCache`), grep of every land/water predicate and `waterLevel` comparison, git history of `worldHydrology.ts`, the 058 implementation notes and `docs/state/water.md`. No runtime/browser checks; nothing here is browser-verified.

## Verdict

**The core design is sound — keep it.** Hydrology is a pure, deterministic, worker-safe module; the only input it reads is the *uncorrected* floor (`sampleRawFloorUncorrected`), so there is no cycle; identity travels in `RawSampleParams.hydrologyId`, so every downstream fingerprint follows hydrology by construction; a missing install fails loudly; the legacy per-tile path is fully deleted (no flag remnant). River tiles are now a cheap clip of global chains, which removed a whole class of tile-boundary bugs.

The debt is at the **edges**: land/water semantics are spread over several predicates with a naming collision, the runtime never forgets an installed hydrology, nothing guards the algorithm version, one discovery consumer still sees lakes as land, and the state docs describe the deleted system. None blocks Q80/Q61; all are small, bounded Sonnet tasks except F2 (needs a recon + possibly an author decision).

## Findings

| # | Sev | Finding | Evidence | Recommendation → queue |
| --- | --- | --- | --- | --- |
| F1 | P2 | **Two `isWetFloor` functions with different meaning.** `terrain/waterSurface.ts` `isWetFloor(clampedH, floorH, eps)` = "water covers the point" (L1 rule, lakes + sea); `terrain/terrainClassification.ts` `isWetFloor(floorH, waterLevel)` = "floor below sea level". `world/map/mapProjection.ts` imports both (`isWetFloor as isWetSurface`). Same name, opposite inputs — a wrong auto-import silently drops lakes or misreads the sea. | grep: 8 importers of the waterSurface one, 3 (`mapProjection`, `seedProfile`, `worldLocationCatalog`) of the sea one | Rename the sea predicate to `isFloorBelowSea` (no behaviour change, no cache bump). → **Q102** |
| F2 | P2 | **World-location catalog still classifies lakes as land.** `worldLocationCatalog.classifyCoarseCell` uses the sea-only predicate, so the ~16–20 real (above-sea) lakes per seed after Q96 are not `lake` locations — map shows a lake the catalog/knowledge/quests do not know. Deferred in L1 because it "alters persisted catalog tiles". | 058 notes §L1 "Deferred"; `worldLocationCatalog.ts` ~L655; catalog has session-accumulating persistence (plan world-015 §13) | Recon (O): what is persisted, whether a lake kind change needs a save migration or only a catalog/cache version bump, and which consumers (map labels, quests, knowledge) change. Possibly an author decision (new discoverable lakes). → **Q106** |
| F3 | P2 | **Installed hydrology is never released.** `clearWorldHydrology` has no production caller; the pool's `installedHydrology` map and each worker's store keep every id ever installed and the pool re-sends **all** of them to new/replaced workers. Each payload ≈ 6.5 MiB per copy (H2). A new game with another seed, or a live terrain-config change (GUI → new `hydrologyId`), adds ~6.5 MiB × (main + pool + every worker) per id. | `worldHydrologyStore.ts` install map; `chunkWorkerPool.ts` L362–366, L502–505; no `clearWorldHydrology` call outside tests | Single-world retention: installing a new id evicts the others in the main store, the pool map and the workers (new `dropHydrology` message or replace semantics). Unit tests for eviction + respawn. → **Q103** |
| F4 | P2 | **No guard that output changes bump `WORLD_HYDROLOGY_VERSION`.** The id hashes options + terrain inputs + version, but an algorithm change with the same knobs keeps the same id → IndexedDB / boot fixtures serve stale hydrology under a valid id. Version is still 1 after four commits (none changed output so far — checked H3's diff — but nothing would catch it). The existing test only checks run-to-run determinism. | `worldHydrology.test.ts` L53–54; `git log -- src/terrain/worldHydrology.ts` | Golden-hash test: `hashWorldHydrology` of a fixed synthetic grid pinned to a literal, with a failure message "output changed → bump WORLD_HYDROLOGY_VERSION and re-export fixtures". Add to the 058 notes Pitfalls. → **Q104** |
| F5 | P2 | **State docs describe the deleted system.** `docs/state/water.md` (last verified 2026-09-06): architecture diagram (one `waterLevel`, chunk-local BFS bodies), standing decision **W13** (per-tile 256 m river ownership, rivers never feed `sampleFloorAt`), the long per-tile/dry-sink/breach section and the code-entry list (`hydrology.ts`) are stale; only a banner marks it. `STATE.md` L36 ("hydrology worker offload not implemented"), `terrain-and-world-generation.md` (last verified 2026-09-11), and comments in `debug/locationQueries.ts` ("builds a small hydrology grid per call") and `riverNetwork.ts` also lag. There is also no single table of **which water query to use**. | files above | Rewrite `water.md` Architecture / W13 / Rivers to the global model (history → plan notes/archive), add the query contract table below, fix STATE.md and terrain doc lines, fix stale comments. → **Q105** |
| F6 | P3 | **Land/water query zoo without a written contract.** Correct today, but a consumer must pick from: `sampleLocalWater` (physical: sea + lake + river, river wins), `sampleLandHeight[At]` (placement view: sea + lake, **not rivers**), chunk arrays `isWetFloor(h, floorH)`, `isWaterOrShore` (sea-relative margin), river segments (`footprintOverlapsRiver`, `riverShoreDistance`, `isInsideRiverChannel`), and the sea-only predicate (map/catalog). Only pasture/paddock combine land view + rivers (`wetOrRiver`); other placement relies on the separate river checks being remembered. | grep consumers | **No new abstraction now** (reuse rule). Write the contract table (F5/Q105) and re-evaluate if a consumer bug appears (Q99 fauna drowning is a candidate to check against it). |
| F7 | P3 | **River surface vs corrected ground.** H3 observed ~14 % of chain points where corrected ground is > 0.6 m above the chain water surface (smoothing/meander off the 8 m cells; carving per chunk). Likely contributor to visible river artefacts (Q98 confluence seams, bed look). | 058 notes §H3 "Observation" | Feed into the deferred **Q92/Q98** recon (O); not a separate task. |
| F8 | P3 | **Payload size after Q96 not re-measured.** 6.5 MiB/copy was measured at `lakeMinCells` 80; Q96 cut lakes 264 → 20 but chains grew 1838 → 2301. Workers still need chains (map raster `buildMapTile` and `worldKnowledgeScan` call `computeRiverTile` inside the worker), so "keep chains out of workers" is **not** free. | `chunkHeightmap.worker.ts` imports; notes §H2 | Measure once (1 line in Q80's close-out or Q103's test); act only if the author wants a memory budget. |
| F9 | info | `chunkManager.ts` is 3 807 lines and owns most water/ground queries (`sampleLandHeight`, `sampleLocalWater`, `riverShoreDistance`, bridges, river tiles). Not a defect; do not refactor as part of hydrology work (no unrelated refactoring). Revisit only with an owner-boundary plan. | `wc -l` | none |

### Water/land query contract (proposed text for `water.md`, Q105)

| Question | Use | Covers |
| --- | --- | --- |
| Is there water here, how deep, what kind (movement, swimming, fauna, drinking)? | `sampleLocalWater` (via `ChunkManager` / `WorldBundle`) | sea + lake + river (river wins), fords, bridges |
| Can I place a static object / site / plot here (dry land)? | `sampleLandHeight[At]` **and** a river check (`footprintOverlapsRiver` / `riverShoreDistance`) | land view: sea + lake → `waterLevel`; rivers are **not** in the land view |
| Is this chunk texel wet (worker arrays)? | `isWetFloor(heights[i], floorHeights[i])` | sea + lake |
| Is this near the sea / coastal (beach, shells, ocean tint)? | `waterLevel` comparisons, `isWaterOrShore`, `sandBandAt`, `oceanMixAt` | sea only, by design |
| Is the floor below sea level (map/catalog classification)? | `isFloorBelowSea` (after Q102) | sea only — lakes need F2/Q106 |
| Walking / object Y | `sampleHeight` / `sampleSurfaceGround` | true surface (never the land view) |

## What not to change

- The hydrology ↔ terrain direction (hydrology reads only the uncorrected floor), the fail-loud registry and `hydrologyId` in params.
- River tiles as a view of global chains; the `riverTileCache` (streaming, ref-counted) vs `riverQuery` (placement, analytic) split is fine now that both are a cheap clip.
- The boot order (fixture import → `worldHydrology` stage → chunk manager) and the pool's replace-and-retry of dead workers (058 Pitfalls).

## Follow-up order

1. **Q80** close-out (already S, resume note) — census baselines, Q91 cave check, §4 entry. Measure F8 there.
2. **Q102 → Q103 → Q104** (S, small, no worldgen output change → no cache/epoch bump, no fixture re-export).
3. **Q105** docs (S, after Q102 so the table uses the new name).
4. **Q106** (O recon; may produce an author question) — can run in parallel with roads.
5. Roads **Q61–Q64** as already ordered; matrix row 02 can then move to "ready for review" for the joint 01/02/04/05/15 boundary review.
