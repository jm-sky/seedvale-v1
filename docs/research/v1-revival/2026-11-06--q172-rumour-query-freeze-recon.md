# Q172 — "Opowiedz mi coś o okolicy" main-thread stall: recon (2026-11-06, Opus)

Status: **static recon + one headless timing, not a runtime profile.** Input: a GPT static-recon finding (author paste, 2026-11-06). Priority: low — after the geography main path (author 2026-11-06).

## Symptom (author)

Asking an NPC about the area appeared to freeze the game. Not reproduced or profiled yet.

## Verified path (current `main`, `a44944b8`)

`NpcDialogueMenu.vue` `askAboutArea()` → `state.onAskAboutArea` → `inventoryWiring.ts:1192` `guardLocalKnowledge.askAboutArea()` → `createApp.ts:1008` `worldLocationCatalog.landmarksInRangeAsync(origin, 4 h, 12 h | 25 h)`.

- Band: `RUMOUR_BAND_MIN_HOURS = 4`. Max is `12` for adults and `RUMOUR_EXPERT_BAND_MAX_HOURS = 25` for guards and hunters (`guardLocalKnowledge.ts:12-14`). 1 h = 180 m, so 25 h = 4.5 km, which covers a large part of the ±6.1 km continent.
- The NPC path does **not** use `withLocationDiscoveryBusy` (`inventoryWiring.ts:107`). The map purchase does. All the player gets is a disabled dialogue option (`discoveringArea`), with no progress overlay, so a long cooperative wait also looks like a freeze.

`landmarksInRangeAsync` (`worldLocationCatalog.ts:976`) does three expensive things:

1. **Abandoned-cemetery probes.** These are cooperative: an 8 ms budget per batch and yields between batches. But the budget is checked only *between* probes. Each probe (`chunkManager.ts:1529` `probeAbandonedCemeteryAtChunk` → `paramsFor`) calls `settlementDefFor` for settlement cells near the chunk, plus `villageSegmentsNear` / `segmentsNear` (road network). A cold settlement def took 0.4–0.67 s per frame in the [Q25/Q26 recon](./2026-10-30--q25-npc-stream-frames-recon.md). With roughly 1.2 % of about 15 k chunks in the 4–25 h band, that is about 180 probes, and many of them can fall near settlements whose defs are not built yet. **One probe can block for hundreds of ms.** The `abandonedCemeteryCache` (IndexedDB) hides this on warm sessions, which would explain why the freeze is not always there. **This is the main suspect** (inferred, not measured).
2. **`scanLakesAndPeaks`** (`:919`) is fully synchronous, after the last `await`. It classifies the coarse annulus (48 m cells), flood-fills lakes (it may grow past the window, capped at 20 000 cells per component) and checks peaks. Each new cell also fires `onTileDirty`. Headless timing (node, seed 415424794, home origin, cold, `sampleRawTexelAt` only): 4–12 h → 6.8 k cells / 28 ms. **4–25 h → 29 k cells / 58 ms.** 12–50 h (`map_far`) → 108 k cells / 187 ms. Browser cost is probably a few times higher, and flood-fill and `onTileDirty` come on top. That makes it a **single 0.1–0.5 s hitch, not a multi-second freeze**. GPT's suspect is real, but on these numbers it is likely the smaller part.
3. `caveCandidates`, the settlement cemeteries and the mine are cheap (not timed).

The same code path also serves `map_far` (12–50 h, `inventoryWiring.ts:894`). That path has the busy overlay, but it shares both costs.

## Existing infrastructure

- `WorldKnowledgeResearch` (`src/world/locations/worldKnowledgeResearch.ts`) sends one bounded worker job through `chunkWorkerPool` (`requestChunkWorldKnowledge`). It deduplicates, cancels and invalidates, but it resolves only chunk `LandmarkKind`s (monoliths, ruins, …). It covers neither the coarse lake/peak scan nor the cemetery probes. Extending it is possible, because the worker already has `sampleRawTexelAt` inputs (`WorldKnowledgeTerrainSnapshot` carries `hydrologyId` and raw params). The catch is that the coarse tile cache and its persistence (`hydrateTile` / `onTileDirty`) live on the main thread and are the determinism seam described in plan world-013 §9.
- Tests: `worldLocationCatalog.test.ts` (sync/async equivalence, order-independence), `guardLocalKnowledge.test.ts` (uses a stub `landmarksInRange`), `locationDiscovery.test.ts`. There is no performance guard for this path.

## Recommended direction (to confirm by measurement first)

1. **Measure first (S):** in the browser on seed 415424794, with cold caches (fresh profile, or the caches cleared), ask a home guard. Record the long frames, `getScanDiagnostics()` (`classificationMs`, `lakeExtractionMs`, `peakExtractionMs`, `cemeteryMs`, `sampledCells`) and the slowest single probe. Repeat with warm caches. Settle which of costs 1 and 2 dominates.
2. **Smallest fix, likely enough:**
   - (a) Route the NPC ask through the existing `withLocationDiscoveryBusy` (the same overlay as the map). This is pure UX and needs no new system.
   - (b) Make `scanLakesAndPeaks` cooperative inside `landmarksInRangeAsync`: an async variant that yields between rows or batches, using the same `yieldToPaint` / `probeBudgetMs` options. The output must stay identical (the sync/async equivalence test already exists).
   - (c) For the cemetery probes, if they dominate: warm or resolve the needed settlement defs before probing (reusing the cold-def follow-up candidate from Q26), or split a probe so the budget check can run inside it. Do **not** build a parallel lookup.
3. **Only if (b)/(c) are not enough:** move the coarse scan into the existing worker job (`WorldKnowledgeResearch` / `chunkWorkerPool`) and send the classified tiles back so the main-thread cache stays the single owner. This is larger, so it needs Opus design for the cache-ownership and persistence seam.
4. Do not narrow the 25 h expert band or change landmark selection (that would be a gameplay/density change, so author → §3).

Verification: the async result must equal the sync result (existing test plus a test for the cooperative variant), and there must be no change in `pnpm worldgen:outcomes:census` / catalog output. For the browser check, the worst long frame during an ask should be under about 50 ms on a cold cache (WSL; record it, no FPS claims), and Windows confirmation goes to queue §4.
