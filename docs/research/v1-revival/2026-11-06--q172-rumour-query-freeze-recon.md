# Q172 — "Opowiedz mi coś o okolicy" main-thread stall: recon (2026-11-06, Opus)

Status: **static recon + one headless timing + history check, not a runtime profile.** Input: a GPT static-recon finding (author paste, 2026-11-06). Priority: low — after the geography main path (author 2026-11-06).

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

## History — this is a Q138 regression of a solved problem (added after author remark, 2026-11-06)

The author pointed out that the pre-Revival game already had this freeze and solved it. Verified:

- [quests-progression-047](../../plans/archive/quests-progression-047-deferred-world-knowledge-and-location-research.md) (`2e985953`) made the guard ask **deferred**. The guard says "Muszę przejrzeć meldunki… Wróć za godzinę". The lookup goes off the main thread through `WorldKnowledgeResearch.resolveMany` (a worker job: cemetery/ruins kinds, chunk radius 10) and is merged with `listStableLocations` (`stableLandmarksInRange`: caves, settlement cemeteries, authored ruins, mine). That path has **no coarse lake/peak scan and no abandoned-cemetery probes**. After the authored delay of one game hour, [npc-050](../../plans/archive/npc-050-npc-initiated-player-follow-ups-and-proactive-dialogue.md) delivers the result through the NPC's `playerFollowUp`. Its acceptance criterion was explicitly "ask guard on a cold world — no visible freeze" (047 §verification).
- **Q138 / world-041 L3b (`e1b93d97`, Sonnet, 2026-11-06)** removed that path: "now async and instant (no wait, no persisted state)". It replaced the path with `landmarksInRangeAsync` over `(4 h, 25 h]` on the main thread, which brings back both expensive steps (cemetery probes and `scanLakesAndPeaks`) over a band much wider than the old ~10-chunk radius. The Q137 script §6 had written conditional `RUM.WAIT.*` lines for keeping the delay. L3b left them dormant ("no wait was introduced"). Neither the world-041 plan nor the L3b notes record an author decision to drop the wait.
- So the freeze is most likely **a regression introduced today**, not a new problem. The fix should restore the 047 pattern, not invent a new one.

## Existing infrastructure

- `WorldKnowledgeResearch` (`src/world/locations/worldKnowledgeResearch.ts`) sends one bounded worker job through `chunkWorkerPool` (`requestChunkWorldKnowledge`). It deduplicates, cancels and invalidates, but it resolves only chunk `LandmarkKind`s (monoliths, ruins, …). It covers neither the coarse lake/peak scan nor the cemetery probes. Extending it is possible, because the worker already has `sampleRawTexelAt` inputs (`WorldKnowledgeTerrainSnapshot` carries `hydrologyId` and raw params). The catch is that the coarse tile cache and its persistence (`hydrateTile` / `onTileDirty`) live on the main thread and are the determinism seam described in plan world-013 §9.
- Tests: `worldLocationCatalog.test.ts` (sync/async equivalence, order-independence), `guardLocalKnowledge.test.ts` (uses a stub `landmarksInRange`), `locationDiscovery.test.ts`. There is no performance guard for this path.

## Recommended direction (revised after the history check)

**Restore the 047/npc-050 shape for rumours.** The NPC's "let me think" reply comes back at once (Q137 `RUM.WAIT.START.*`). The candidate pool is computed off the critical path. The lead is delivered later through the existing follow-up seam (`RUM.WAIT.READY.*`, re-resolved at delivery per Q137 §6). The world-041 pool needs kinds the 047 worker job never covered (lakes, peaks, abandoned cemeteries over a 25 h band), so the S row also has to choose how the pool gets computed:

- (i) Extend the existing worker job (`worldKnowledgeScan` / `chunkWorkerPool`) to the coarse lake/peak scan and the abandoned-cemetery resolution. The main-thread coarse tile cache stays the single owner, and the worker hands back classified tiles. This is the most correct option, but the cache/persistence seam needs an Opus design.
- (ii) Keep `landmarksInRangeAsync` on the main thread, made cooperative (`scanLakesAndPeaks` split into yielding batches, probes bounded) and started in the background during the wait. This is simpler, but each probe still has a cold settlement-def stall (see cost 1 above). Measure it first.

Before either, measure as in step 1 below. Do **not** narrow the 25 h expert band or change selection without the author (§3).

1. **Measure (S):** in the browser on seed 415424794 with cold caches, ask a home guard. Record the long frames, `getScanDiagnostics()` and the slowest single probe; repeat warm.
2. The wait-vs-instant choice was a gameplay decision for the author (§3 Q172-a); decided below.

## Author decision Q172-a (2026-11-06)

**(a) Restore the wait.** The rumour ask answers at once with the approved Q137 §6 `RUM.WAIT.START.*` line. The pool is computed in the background, and the lead is delivered later through the npc-050 follow-up seam (`RUM.WAIT.READY.*`, re-resolved at delivery). Still open for the S/O row: how the pool is computed, (i) extended worker or (ii) cooperative main-thread, chosen after the step 1 measurement.

Verification: the async result must equal the sync result (existing test plus a test for the cooperative variant), and there must be no change in `pnpm worldgen:outcomes:census` / catalog output. For the browser check, the worst long frame during an ask should be under about 50 ms on a cold cache (WSL; record it, no FPS claims), and Windows confirmation goes to queue §4.
