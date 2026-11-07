# Q172 — "Opowiedz mi coś o okolicy" main-thread stall: recon (2026-11-06, Opus)

Status: recon 2026-11-06 (static + headless timing + history); **browser measurement, wait restore and cooperative query landed 2026-11-07** (sections at the end); worker prewarm = Q189. Input: a GPT static-recon finding (author paste, 2026-11-06). Priority: low — after the geography main path (author 2026-11-06).

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

## Measurement (2026-11-07, Opus) — WSL2 Chrome, not a performance claim

`?fly&seed=415424794&worldgenFixture=0`, fresh Chrome profile (cold IndexedDB caches), Vite dev, band 4–25 h from the home spawn via `window.__seedvaleLandmarkQuery`; frame gaps from a rAF loop (the `longtask` observer misses work started from CDP `Runtime.evaluate`). Script: session scratchpad, not kept.

| | wall | worst frame | notes |
| --- | --- | --- | --- |
| cold, before | 4.6 s | **4008 ms** | one freeze |
| cold, cooperative | 4.8 s | **1102 ms** | 100–600 ms frames around it |
| warm (reload, same profile) | 52 ms | < 50 ms | all cache hits |
| same session, 2nd query | 5–25 ms | < 50 ms | |

Cold split: settlement-cemetery resolves **3.0 s** (12 settlements, max 1.1 s each — CPU profile: road A* `findRoute` ← `findRouteAvoidingVillages` ← `segmentsNear` ← `paramsFor`), settlement def lookups 0.65 s (max 0.14 s), 185 abandoned probes 0.9 s (max 0.27 s), coarse lake/peak scan ~60 ms. So the recon's ranking was wrong: the coarse scan is negligible, and the settlement cemeteries — not the abandoned probes — dominate. Both cemetery kinds pay `paramsFor` (roads), the same worldgen the player pays later when walking there; warm worlds are fine.

**Conclusion:** (ii) alone cannot reach < 50 ms — one cold item is up to 1.1 s of synchronous road routing. Landed (ii) as the first step (4 s freeze → ≤ 1.1 s frames, during the one-hour wait instead of on click), plus the restored wait (author Q172-a). The cold items go to the worker in Q189.

## Worker prewarm contract (Q189)

Goal: on a cold world, the rumour band query never runs `paramsFor` on the main thread. **Prewarm, do not fork the resolver:** the worker only fills the two main-thread caches the catalog already reads; the cooperative main-thread `landmarksInRangeAsync` then runs unchanged on cache hits (the measured 50 ms warm path), so output and order stay identical by construction.

1. **Job.** New `WorldKnowledgeQueryKind` `'band-cemeteries'` on the existing `worldKnowledge` worker job (`chunkHeightmap.worker.ts` → `worldKnowledgeScan.ts`, `requestChunkWorldKnowledge` in `chunkWorkerPool.ts`, wrapper in `WorldKnowledgeResearch`). Params: the existing `WorldKnowledgeTerrainSnapshot` + epoch, plus `settlementIds: string[]` (the ≤ 12 nearest, chosen on main) and `abandonedChunks: {cx, cz}[]` (post-roll misses from `collectAbandonedChunksToProbe` minus `abandonedCemeteryCache` hits). Result: `settlementCemeteries: {settlementId, found: {id, x, z, cemeterySize} | null}[]` and `abandoned: {cx, cz, result: CachedAbandonedCemeteryResult}[]`. Plain data only.
2. **Worker side.** Settlement cemetery = the body of `ChunkManager.resolveCemeteryForSettlement` with `chunkParamsForWorldKnowledgeScan(coord, terrain, roadCtx, {includeCorridors: true, includeCemetery: true})` in place of `paramsFor(coord, [])`, then `resolveCemeteryTopologyForSettlement` + `resolvePlacementForTopology` (check they are realm-pure; if they read ChunkManager state, pass it in the snapshot). Abandoned = `resolveAbandonedCemeteryAfterRoll(coord, seed, () => ({ params, terrain: createLocalTerrainSampler(coord, params) }))` with the same params builder. Bounded: one job per rumour request, cancellable through `WorldKnowledgeResearch` (dedupe by origin cell + band, invalidate on epoch).
3. **Main side.** New catalog method `prewarmBand(x, z, minHours, maxHours): Promise<void>` (owner: `worldLocationCatalog.ts`): picks the settlement ids (needs the settlement def lookups — see 5), posts the job, and on reply writes `cemeteryCache` (via `cemeteryLocationFromResolved`) and `abandonedCemeteryCache.remember(...)`. Never writes a result whose epoch changed. `guardLocalKnowledge.launch` awaits `prewarmBand` before `landmarksInRange`; a worker failure falls back to the cooperative main-thread path (today's behaviour), never to "nothing found".
4. **Parity guard (required).** Node test on seed 415424794 (and one more): for a sample of settlements and post-roll chunks, worker-side resolution equals `ChunkManager.resolveCemeteryForSettlement` / `probeAbandonedCemeteryAtChunk`; plus the existing sync/async catalog equivalence. Precedent: world-030 already resolves `cemetery` kinds in the worker from the same reconstruction.
5. **Known remainder.** Main-thread settlement def lookups stay (0.65 s total, max ~0.14 s per cold def, already yielding per cell). Moving them too means sending the candidate cells to the worker and returning only ids — but `cemeteryCache` is keyed by the main-thread `SettlementDef` the sync path builds, so keep it out of Q189 unless the measurement after Q189 still shows > 100 ms frames.
6. **Done when.** Same browser measurement as above: cold worst frame during the rumour wait ≲ 150 ms (def lookups) with no 1 s item; warm unchanged; parity + equivalence tests green; no worldgen cache version bump needed (no output change). Windows confirm → queue §4.
