# Implementation notes: world-041 landmark catalog and rumour leads

Plan: [world-041](../world-041-landmark-catalog-and-rumour-leads.md)

## L3a — uncertain projection, consumer guards, arrival rules (2026-11-05, Sonnet)

Landed (no dialogue, no producer, no save change):

- `src/world/locations/rumourLead.ts`: `rumourLeadArea`, `genericLocationLabel`, `isRumourLeadEntry`, `isLocationDiscovered`, `countOpenRumourLeads`, `RUMOUR_LEAD_CAP = 4`.
- `mapData.project()` estimated branch (area centre + radius + generic label); `createMapData` now requires `getSeed`.
- Consumer guards: `guardLocalKnowledge.alreadyKnownInRange`, `listKnownSettlementOptions`, quest `hasDiscoveredLocation` (`createApp`), `suppressedCaveLocationIdsForMineBinding` (estimated mine).
- `src/world/locations/landmarkArrival.ts` (lake / mountainPeak / cemetery) wired into `LocationProximityDiscovery` via an optional `sampleTexel`; catalog `lakeExtentRadius` / `peakSummitHeight` (memoized, non-persisted).
- Tests: `uncertainKnowledge.test.ts` (containment, clipping, determinism, no-name/no-pin per consumer, save/load reconstruction, cap derivation, stale ids, arrival closes lead), `landmarkArrival.test.ts`, catalog extent/summit test.

Deviations / findings for L3b:

- **Radius tier is not reconstructable.** The contract makes guard/hunter leads smaller (60–120 m) than other NPCs', but a lead persists only `{id, state, source}`, so `project()` cannot know the tier. L3b needs one decision: a uniform radius, a deterministic per-target tier, or an optional persisted field (save bump). `rumourLeadArea` already accepts `radiusMin/radiusMax`.
- Corner/edge: a target hugging the world bound keeps containment and may graze the bound (<= 0.4 r at a corner).
- Peak summit height is approximated from a sample grid around the coarse-cell centre, not the true summit; revisit with L1 landforms.
- Not browser-verified (no gameplay observed); technically verified only.

## L4 / Q137 — English script approved by the author (2026-11-06)

- [Astra's rumour line script](../../research/v1-revival/2026-11-06--q137-npc-rumour-line-script.md) supplies the reviewable copy and Q138 handoff: stable line IDs, placeholder contracts, outcome coverage, proposed uncertain-location labels, and gated future landmark wording.
- Reviewed against the existing area-topic menu, `guardLocalKnowledge`, `npcPlayerFollowUpDelivery`, `dialogueTemplates`, compass/travel helpers and L3a projection. Current runtime still delivers exact names through the older `discovered` path; this document does not integrate the draft.
- **Author approval, 2026-11-06:** dialogue/topic wording, conditional future-kind copy and the bounded Q136-b English labels are approved; Q137 is complete. Q138 remains blocked only by Q136-a (persisting/reconstructing guard/hunter precision). This approval does not select a radius/storage policy, activate future kinds or authorize audio production.
- Documentation only: no runtime, mechanics, persistence, worldgen, audio or quest changes; no gameplay/browser verification claimed.

## L3b / Q138 — rumour producer + dialogue (2026-11-06, Sonnet)

Landed (technically verified; **not** browser-verified):

- **Save v61 (`CURRENT_SAVE_VERSION` 60 → 61):** `LocationKnowledgeEntry` / `SaveLocationKnowledge` gain optional `leadTier: 'expert'` (only valid on `estimated`). Migration v60→v61 only moves the version — an absent tier already means the common 120–260 m tier, which is what every old lead was. `reveal(id, state, source, leadTier?)` drops the tier on upgrade.
- **One lead-area function:** `rumourLeadAreaForEntry(seed, entry, target)` (`rumourLead.ts`) — `mapData.project()` and the spoken bearing/hours both use it (expert = 60–120 m), so speech never reveals more than the marker.
- **Producer:** `guardLocalKnowledge.askAboutArea(npcId, x, z, speaker, trust)` is now async and instant (no wait, no persisted state). Gates in order: trust (`RUMOUR_TRUST_MIN = -10`, 🟡 threshold) → empty pool → daily (top candidate by `hash(seed, npc, floor(day), id)` ignoring knowledge; already in `LocationKnowledge` = "nothing new today") → open-lead cap (`RUMOUR_LEAD_CAP`) → reveal `estimated`+`npc`. Bands (🟡, L0 §5): ordinary `(4 h, 12 h]`, guard/hunter `(4 h, 25 h]` via `landmarksInRangeAsync`; kinds limited to cave/ruins/lake/mountainPeak/cemetery (script copy exists only for those).
- **Text:** `src/ai/rumourLines.ts` carries the approved Q137 lines (success + trust/cap/none/daily); variant chosen by a deterministic hash among equal wordings. Dormant: `RUM.NEAR` (origin inside the area cannot occur with a 4 h band), reserved landform/waterfall lines, child lines, deferred-wait lines (no wait was introduced).
- **Topic:** `NpcDialogueMenu` offers it to every living adult (children: not offered). Speaker = `role` (`guard` / `hunter` / adult).
- **Legacy:** the research/delay path is removed. Old saves' `map.guardLocalKnowledge` is still validated but dropped on restore and never written (removal would need another migration — loose end); an old armed `deliver_world_knowledge` follow-up is drained by `deliverNpcWorldKnowledgeFollowUp` without revealing anything.
- **Quests:** no quest reads a guard reveal directly; `hasDiscoveredLocation` uses `isLocationDiscovered`, so a rumour (`estimated`) does not complete it — arrival reveal (`discovered`/`confirmed`) does, as before. Quest-owned search areas are separate entries, untouched.

Open / for the author (queue §2): UI strings of the topic and Polish `genericLocationLabel` stay Polish while NPC lines are English (approved script); trust threshold and bands are 🟡; the daily pool depends on the player's position (band edge) — a player walking between asks can see a different top candidate on one day; walk-through (L5) not done.

## Q172 — rumour wait restored + cooperative band query (2026-11-07, Opus)

Supersedes the "instant" and "Legacy" bullets of L3b above (author Q172-a (a): restore the 047 wait). Technically verified (type-check, lint, full `vitest`); the cooperative query was measured in WSL Chrome (below); the dialogue flow itself is **not** browser-verified.

- **Producer:** first ask → `RUM.WAIT.START.*` at once + background `pickCandidate` (same ranking `hash(seed, npc, floor(requestedAtDays), id)`); re-ask before `RUMOUR_RESEARCH_DELAY_DAYS` (= `WORLD_KNOWLEDGE_HOUR_DAYS`) → `RUM.WAIT.PENDING.*`; re-ask after → the answer, re-validated at delivery (stale/none → `NONE`, known → `DAILY`, cap → `CAP`). Trust refusal and a full cap answer at once (no wait, no query). A same-day re-ask after an answer is answered directly (session memo, warm pool) instead of a second wait.
- **Persistence:** the pending request uses the existing `SaveData.map.guardLocalKnowledge` per-NPC shape (`requested`; `resolved` with ≤ 1 `selectedIds`). Restore turns `resolved` back into `requested`, so pre-Q138 saves' old multi-id picks are recomputed with the current algorithm. Schema unchanged → no save bump.
- **Follow-up seam:** not used for new rumours — the 047 path armed and delivered in the same ask, so the record never outlived the call; adding `adult` to `NpcWorldKnowledgeFollowUpSource` would have been a save change for no player-visible gain. The legacy drain stays. A proactive "NPC comes back to you" delivery would be new scope (needs a tick that arms the follow-up).
- **Catalog:** `landmarksInRangeAsync` now yields (budgeted, `probeBudgetMs`, default 8 ms) after every settlement lookup, settlement-cemetery resolve, abandoned probe batch and coarse-scan row; settlement cemeteries and the coarse scan are generators shared with the sync path (`runWorkSync` / `runWorkCooperative`), so results and order are identical (test: zero-budget async = sync). The small-list "one sync stretch" threshold is gone. New diagnostics: `cemeteryProbeMaxMs`, `settlementCemeteryMs`, `settlementLookupMs`, `settlementLookupMaxMs`, `settlementCemeteryResolveMaxMs`. Dev hook `window.__seedvaleLandmarkQuery(minH, maxH)`.
- **Measurement** (WSL2 Chrome OpenGL/D3D12, `?fly&seed=415424794&worldgenFixture=0`, fresh profile, band 4–25 h at home, frame gaps from rAF): before — wall 4.6 s, **one 4008 ms frame**; after — wall 4.8 s, worst frame **1102 ms** (others 100–600 ms). Warm (same profile reload): 52 ms, no gap > 50 ms. Cold cost split: settlement-cemetery resolves 3.0 s (max 1.1 s each; CPU profile: `findRoute` A* via `segmentsNear` in `paramsFor`), settlement defs 0.65 s (max 0.14 s), 185 abandoned probes 0.9 s (max 0.27 s), coarse scan 60 ms. The < 50 ms criterion therefore needs the cold items off the main thread → queue Q189 (worker prewarm, contract in the [Q172 recon](../../research/v1-revival/2026-11-06--q172-rumour-query-freeze-recon.md#worker-prewarm-contract-q189)).

## L1 — landform catalog entries (2026-11-06, Sonnet, queue Q130)

Landed (technically verified: type-check, lint, full `vitest` 9540 green; **not** browser-verified; no rumour copy or UI beyond a generic marker):

- **New kind `landform`** (`WorldLocationKind`), `subtype` on the record: `crag | crater | lakeIsland | spineSummit`. Source `src/world/locations/landformLandmarks.ts` (pure, a handful per world): the 060 descriptors (`lf:<kind>:<cell>` → `landform:<kind>:<cell>`) and range-spine summits (`landform:spineSummit:<spine cell>:<summit index>`; summit index comes from the per-spine RNG, so another spine never renumbers it). Position of a summit = crest point at arc length `t` (`rangeSummitPosition`). Catalog: `getById`, `landmarksInRange`/`Async`/`stableLandmarksInRange` list them in the hours band; no persisted state, no save change.
- **One summit = one entry:** `extractPeaks` drops a coarse `mountainPeak` inside a spine-summit footprint (1.5 σ along the spine). Crater / lake-island water stays the existing `lake:cx,cz` entry (Q109); the landform entry is added beside it.
- **Arrival** (`landmarkArrival.ts`): crag / spine summit like a peak (60 m + 10 m height window around the sampled maximum, `peakSummitHeight` now also answers these ids); crater and lake island within 40 m of the centre (island: dry ground).
- **Names:** `landmarkName(..., 'landform', subtype)` — placeholder deterministic Polish pools per subtype; L2 owns final proper names/uniqueness. Map: generic marker (emoji 🪨, label "Formacja"), `estimated` label "Formacja terenu".
- **Rumours:** `isRumourKind` still limits the producer to cave/ruins/lake/peak/cemetery, so landforms are not told by NPCs yet (needs approved Astra copy — L4 reserved landform lines).
- **`locations-coarse` not bumped:** the tile payload and `classifyCoarseCell` are unchanged (the plan's bump presumed catalog output stored in the cache; landforms and the summit suppression are applied after the cache).
- Open: crater/island/crag arrival radii and the 1.5 σ summit footprint are 🟡; waterfall kind waits for 064 W3; L2 names, L5 walk-through.
