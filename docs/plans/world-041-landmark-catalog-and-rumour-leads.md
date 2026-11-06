# Plan: Landmarks in the location catalog and NPC rumour leads

**Created:** 2026-11-04
**Status:** `planned` 📋 (L0 contract settled by Opus 2026-11-04, queue Q129; amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04)
**Type:** feature
**Priority:** medium · **Effort:** L
**Depends on:** world-terrain-060
**Domain:** `world`
**Subdomains:** `locations` `discovery` `npc`
**Tags:** `geography` `exploration` `discovery` `knowledge` `rumours` `landmarks`
**Model:** Opus (L0, L3 contract), Sonnet (L1–L2, L4–L5), GPT Astra (NPC text)

## Goal

Stage S7 of the geography program (G7): vague NPC legends/rumours reveal a **coarse search area** on the map containing the landmark somewhere inside — **no precise pin, names learned on discovery, about 3–4 concurrent open leads**. Reuse V1 discovery/knowledge and quest ownership — **no parallel exploration system**. Selectively adapt the V2 rumour → approximate-area policy after the tools-026 D5 verdict.

Also: G6 landmarks (060 landforms, 064 waterfalls, catalog lakes from Q109) become discoverable catalog entries.

## Verified starting point (2026-11-04)

- `LocationKnowledge` (`src/world/locations/locationKnowledge.ts`): sparse entries `{ id, state: estimated | discovered | confirmed, source }`, forward-only `reveal`, serialized in saves.
- `WorldLocationArea` (`worldLocationTypes.ts`) — bounded search area; catalog kinds `settlement | cave | cemetery | lake | mountainPeak | ruins | abandonedMine | searchArea`.
- Existing knowledge producers: proximity discovery (`locationProximityDiscovery.ts`), guard local knowledge with deferred research (`guardLocalKnowledge.ts`, `worldKnowledgeResearch.ts`), NPC follow-up delivery (`npcPlayerFollowUpDelivery.ts`), merchant maps, quest search areas (`lostTreasureEstateSearchArea.ts`, `treasureMapBearCave.ts`, `darkForestTreasureSite.ts`).
- **Q109** landed 2026-11-04: catalog lakes = real inland water, `LOCATIONS_COARSE_VERSION = 4`.
- **Estimated knowledge leaks the target today (review 031 F3):** `mapData.ts` `project` copies canonical `location.x/z/name` into the map model for **every** knowledge state, and `resolveKnown` also feeds navigation and popovers. `LocationKnowledge` stores only id/state/source — no independent uncertain geometry. Naive reuse of `estimated` would show the exact pin and name.
- **Arrival is kind-specific:** `locationProximityDiscovery.update` discovers caves, settlement boundaries, two authored ruin bindings and the abandoned mine only. New lake/peak/waterfall/landform entries get no arrival rule automatically.
- NPC text ownership: GPT Astra writes all new NPC lines; author approves (queue standing decisions, 2026-11-02).

## L0 contract (Opus, 2026-11-04 — queue Q129)

Verified in code ✅ unless marked 🟡 (proposal inside the approved G7 scope; material deviations go to the author).

### §0 Uncertain-knowledge projection (review 031 F3)

- **One chokepoint exists ✅:** every player-facing consumer — full map (`drawMap.ts` markers + labels), minimap (`drawMinimap.ts`), navigation targets and the map popover (`WorldMapScreen.vue` → `mapData.resolveKnown`) — reads `MapKnownLocation` from `mapData.project()` (`src/world/map/mapData.ts`), which today copies canonical `x/z/name` for every state. The projection is therefore implemented **in `project()` only**; the catalog (`WorldLocationCatalog`) and `LocationKnowledge` stay canonical and unchanged.
- For `state === 'estimated'`, `project()` returns: `x/z` = **lead-area centre**, `areaRadius` = lead radius, `label` = a generic kind label (no proper name), same id/kind/state/source. `drawMap.ts` already draws `areaRadius` circles and an outlined marker for `estimated` ✅ — no renderer change beyond the generic label.
- **Lead area** = new pure `rumourLeadArea(seed, locationId, target)` beside the knowledge code: radius 🟡 120–260 m, centre offset 🟡 0.15–0.6 r at an angle from `hash(seed, 'lead', locationId)` (V2 `rumourCircle` formula, donor recon §2) — offset < r, so the target is always inside; if the circle crosses the world bound, the centre is shifted inward along the offset axis while keeping the target inside. Deterministic per world + target → **never persisted**, reconstructed after load.
- **Navigation:** an `estimated` entry may be set as a target; it points at the area centre (off-centre by construction, not the target). 🟡
- **Other knowledge consumers must treat `estimated` as "not known"** (no name, no exact use): `guardLocalKnowledge.alreadyKnownInRange` (today it would re-reveal any known entry as `discovered` with its name), `knownSettlementReputation.ts`, `navigationTargets.restore` (`has()` check stays valid). Debug API (`npcDebugApi.ts`) is exempt. L3 adds a test per consumer.
- **No quest coupling:** quest search areas (`lostTreasureEstateSearchArea.ts`, `treasureMapBearCave.ts`, `darkForestTreasureSite.ts`) are separate `searchArea`/`ruins` entries revealed `discovered` — unchanged, and never counted as rumour leads (cap counts `estimated` only).

### §1 Owner of "an NPC tells the player about a place"

- ✅ `guardLocalKnowledge.askAboutArea` (generalized to any asking NPC by npc-050) + the single delivery seam `deliverNpcWorldKnowledgeFollowUp` (`npcPlayerFollowUpDelivery.ts`), called from dialogue `onAskAboutArea` (`inventoryWiring.ts`). The topic "Opowiedz mi coś o okolicy." is offered today only to the **home guard** and **adult hunters** (`NpcDialogueMenu.vue` `canAskAboutArea`); answers reveal `discovered` (exact pin + name).
- Rumours **extend this owner** with a second answer mode — no new service: a pure `pickRumourLead(...)` next to `locationDiscovery.ts` + `reveal(id, 'estimated', 'npc')`. ✅ **Author Q135 (b), 2026-11-04:** **every NPC gives only rumours** (`estimated`, no exact pin/name); some give nothing (e.g. children); **guards and hunters give better data and reach farther** — 🟡 smaller lead radius (e.g. 60–120 m) and a wider band. L3b therefore also moves today's exact guard/hunter reveals (`discovered`) to rumour leads and opens the topic to other adult NPCs; it must first check which quests rely on a guard reveal being `discovered` (landmark quests via `LANDMARK_QUEST_SEARCH_CHUNK_RADIUS`) and keep those quests working.

### §2 Persisted state — ~~no save-contract change~~ **one optional field since Q138 (save v61)**

> Q136-a (c), 2026-11-06: `leadTier` on the lead entry (save v61, optional, absent = common tier). Everything else below still holds.

- A lead is exactly one `LocationKnowledge` entry `{ id, state: 'estimated', source: 'npc' }` — already a valid persisted combination ✅ (`saveData.ts` `MAP_CONFIDENCE_VALUES` / `MAP_SOURCE_VALUES`); no producer writes it today, so it is unambiguous. **No `CURRENT_SAVE_VERSION` bump.**
- **Open-lead cap** (🟡 4, G7 "3–4") = count of `estimated`+`npc` entries whose id still resolves in the catalog — derived, not stored; a stale/unresolvable target drops out of the count automatically, so the cap can never stay full forever. Duplicate rumours for one target are idempotent (`reveal` returns `false`) and use no slot.
- **Per-NPC rate** without persistence: the pick is a deterministic function of `(seed, npcId, worldDayIndex, candidate pool)` that **ignores knowledge state when ordering**; if the top candidate is already known, the NPC has "nothing new today". Re-asking or reloading the same day cannot farm extra leads.
- **Gate:** V1 has no per-NPC opinion; use the NPC's settlement `trust` dimension (`ReputationManager.getReputationDimension`) with a 🟡 threshold — refuses politely below it.
- **Closing:** arrival reveals `discovered`/`confirmed` through the forward-only rank — the lead leaves the cap by itself. No expiry.

### §3 Landmark identity and kinds (for L1)

- Catalog ids must stay `<kind>:<sourceId>` with `kind ∈ WorldLocationKind` so `getById` resolves by id alone ✅ (`worldLocationTypes.ts`). Add kinds **`landform`** (`landform:<descriptorKind>:<cellKey>`, resolved O(1) through the 060 bucket index; subtype crag / spineSummit / crater / lakeIsland on the record) and **`waterfall`** (`waterfall:<qx>_<qz>` — lip point quantized to 16 m, landmark tier only; replaces the earlier `<sourceChainId>:<offsetBucket>` because the chain index is pack order — [064 W0 §2.3](./implementation-notes/world-terrain-064-derived-waterfalls-implementation-notes.md#2-decisions)). Saves store ids as strings and do not validate kinds ✅ → no save bump; `MapLocationKind` mapping and `LOCATION_KIND_EMOJI` gain entries.
- Coarse `mountainPeak:cx,cz` candidates inside a `landform` summit footprint are suppressed (one summit = one entry). Lakes stay `lake:cx,cz` (Q109); a crater lake / lake island yields a `landform` entry **and** its `lake` entry.
- `locations-coarse` bump at L1 (next free after 4); intermediate epoch-1 saves are disposable (roadmap).

### §4 Arrival rules (bounded)

- Existing ✅ (`locationProximityDiscovery.ts`): cave entrance radius, settlement boundary, two authored ruin bindings, abandoned mine.
- New (L3 for existing kinds, L1 for landforms/waterfalls): checked on the existing proximity cadence over **knowledge entries that are not `confirmed`** (estimated or discovered) of kinds lake / mountainPeak / cemetery / landform / waterfall — never a catalog scan. 🟡 Rules: **lake** — player on dry ground within the lake's extent radius + 40 m of its representative cell and an `isWetFloor` hit within 30 m (extent radius from the flood-fill cell count, added to the non-persisted catalog record); **peak / summit / crag** — within 60 m horizontally and within 10 m of the summit height; **cemetery** — within 30 m of its centre; **waterfall** — within 40 m of top or bottom point. Arrival reveals `confirmed`/`exploration`.

### §5 V2 policy fit

Per donor recon §2: cap 4, one lead per NPC per day (derived, §2), gate on trust, **band in travel hours** (`NEAR_RANGE_HOURS` 4 h < d ≤ 🟡 25 h, V2's 600–4500 m), pick by `discoveryWeight` within the band (existing pools), generic kind phrasing + compass word + rough hours (Astra writes all lines), candidates: caves, ruins, lakes, peaks, cemeteries now; landforms/waterfalls after L1. "Where is the next settlement?" stays the guard's exact answer path (existing).

## Slices (provisional)

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| L0 | ✅ done 2026-11-04 — contract above | O | — |
| L1 | ✅ dry + water landform kinds done 2026-11-06 (Q130, see notes; waterfall kind = 064 W3 still open) — Landmarks as catalog entries with stable ids + per-kind arrival rules; `locations-coarse` bump (next free after 4). Dry-relief kinds (crag, spine summit) on the **frozen 060 R4** relief; water-dependent kinds (crater lake, lake island) after the **061 H6** freeze; waterfalls after 064 W1 (review 031 F2) | S | L0; 060 R4 · 061 H6 · 064 W1 |
| L2 | Deterministic proper names (locally unique, like settlement names), shown only from `discovered` | S | L1 |
| L3a | ✅ done 2026-11-05 (see [implementation notes](./implementation-notes/world-041-landmark-catalog-and-rumour-leads-implementation-notes.md)) — Projection + guards (§0): `rumourLeadArea`, `project()` estimated branch with generic label, consumer filters, arrival rules for lake/peak/cemetery (§4), tests per consumer (no-name/no-pin, containment, clipping, cap derivation, stale ids); driven by tests/debug reveal only — no dialogue | S | L0 |
| L3b | ✅ done 2026-11-06 (Q138, see notes) — Rumour producer in `guardLocalKnowledge` (§1–§2, §5): pick, trust gate, cap, derived daily limit; dialogue wiring with Astra's lines; **save v61** `leadTier` (author Q136-a (c)) | S | L3a; author §3 Q135; L4 text |
| L4 | [Approved English script](../research/v1-revival/2026-11-06--q137-npc-rumour-line-script.md) by GPT Astra, 2026-11-06 — **author-approved**, Q137 complete (dialogue/topic and Q136-b labels). Route/hydrology enrichment awaits a verified data contract; integration remains Q138 | Astra → author → S | L0 (§5 phrasing slots; can start now) |
| L5 | Walk-through on `415424794`: ask → estimated area → walk → discovered; knowledge round-trips in save | S | L4 |

L3a/L3b do not need the final geography and may run in parallel with 061–063.

## Done when (provisional)

- Catalog census both seeds: landmarks present with stable ids; knowledge states round-trip in save.
- A rumour never yields a precise pin or a proper name before discovery; open leads capped; no landmark auto-revealed by generation.
- Tests (review 031 F3): every map/minimap/navigation/popover consumer sees only the allowed projection; target containment and boundary clipping; no-name / no-pin assertions; duplicate rumours for one target do not consume multiple slots; arrival closes the lead and monotonically reveals the same canonical id; unresolved/stale targets cannot leave the cap permanently full; save/load preserves or exactly reconstructs the projection; existing quest-owned search areas unchanged.
- Scripted rumour walk-through recorded → §2.

## Stop if

- A rumour needs a separate exploration framework, quest marker or knowledge store.
- New NPC text would be written by an agent other than Astra.
- Persisted lead state changes the save contract without an L0 decision.
