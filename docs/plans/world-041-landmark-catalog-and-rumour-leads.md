# Plan: Landmarks in the location catalog and NPC rumour leads

**Created:** 2026-11-04
**Status:** `draft` 📝 (L0 recon by Opus turns it into `planned`; amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04 — L1/L3 are **not** implementation-ready until the L0 contract below is settled)
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

## Open recon (L0, Opus — before any S slice)

0. **Uncertain-knowledge contract (review 031 F3, blocking L1/L3):** canonical locations and forward-only knowledge stay untouched — never replace a catalog coordinate with a rumour centre. The uncertain **player-facing projection** lives under the existing knowledge/map ownership: a deterministic off-centre area that contains the target (clipped to world bounds), generic label, **no precise navigation target and no popover/name leak** until discovery — for every consumer (map, minimap, navigation, popovers). Reusing a separate existing search-area entry is allowed only with an explicit target relation and completion semantics, and unrelated quest search areas never count toward the rumour cap. Define a bounded proximity/arrival check per supported natural kind (e.g. a lake is discovered from a reachable shore, not its underwater centre). Decide whether the projection is persisted or reconstructed exactly on load.
1. Which existing producer owns "an NPC tells the player about a place" (guard local knowledge vs follow-up delivery vs dialogue topics) — extend that owner.
2. Does a rumour lead need persisted state beyond a `LocationKnowledge` entry with `estimated` + a deterministic area (e.g. open-lead count, source NPC, expiry)? If yes: save field + `CURRENT_SAVE_VERSION` bump + migration per `docs/state/persistence.md` — a contract change, decided in L0.
3. Landmark identity: catalog ids derived from 060 descriptor ids (`lf:<kind>:<cellKey>`) — stable across chunk rebuild, save/load; which kinds map to existing catalog kinds (`mountainPeak`, `lake` + subtype) and whether `waterfall` needs a new kind.
4. Map presentation of an `estimated` area without a name (verify the current map draws estimated search areas).
5. V2 policy fit (from D5): opinion gate, distance band, area radius and off-centre offset, phrasing; regional reach (NPCs know their region better).

## Slices (provisional)

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| L0 | Recon above (incl. §0 contract) → finalize this plan | O | tools-026 D5 (Q109 done) |
| L1 | Landmarks as catalog entries with stable ids + per-kind arrival rules; `locations-coarse` bump (next free after 4). Dry-relief kinds (crag, spine summit) on the **frozen 060 R4** relief; water-dependent kinds (crater lake, lake island) after the **061 H6** freeze; waterfalls after 064 W1 (review 031 F2) | S | L0; 060 R4 · 061 H6 · 064 W1 |
| L2 | Deterministic proper names (locally unique, like settlement names), shown only from `discovered` | S | L1 |
| L3 | Rumour leads: opinion-gated NPC rumour → `estimated` + off-centre coarse area; ≤ 3–4 open leads; confirmation by proximity discovery; mechanism works for existing kinds (caves, ruins, lakes) before landmarks exist | O→S | L0 |
| L4 | Text: line script by GPT Astra (geographic phrasing generated from route/hydrology data as data only) → author approval → integration | Astra → author → S | L3 |
| L5 | Walk-through on `415424794`: ask → estimated area → walk → discovered; knowledge round-trips in save | S | L4 |

L3 does not need the final geography and may run in parallel with 061–063 once L0 (incl. the §0 contract) is done.

## Done when (provisional)

- Catalog census both seeds: landmarks present with stable ids; knowledge states round-trip in save.
- A rumour never yields a precise pin or a proper name before discovery; open leads capped; no landmark auto-revealed by generation.
- Tests (review 031 F3): every map/minimap/navigation/popover consumer sees only the allowed projection; target containment and boundary clipping; no-name / no-pin assertions; duplicate rumours for one target do not consume multiple slots; arrival closes the lead and monotonically reveals the same canonical id; unresolved/stale targets cannot leave the cap permanently full; save/load preserves or exactly reconstructs the projection; existing quest-owned search areas unchanged.
- Scripted rumour walk-through recorded → §2.

## Stop if

- A rumour needs a separate exploration framework, quest marker or knowledge store.
- New NPC text would be written by an agent other than Astra.
- Persisted lead state changes the save contract without an L0 decision.
