# Plan: Landmarks in the location catalog and NPC rumour leads

**Created:** 2026-11-04
**Status:** `draft` 📝 (L0 recon by Opus turns it into `planned`)
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
- **Q109** (Sonnet, in flight) changes `worldLocationCatalog.ts` (catalog lakes = real inland water, `locations-coarse` v4). This plan starts code changes in the catalog only after Q109 is on `main`.
- NPC text ownership: GPT Astra writes all new NPC lines; author approves (queue standing decisions, 2026-11-02).

## Open recon (L0, Opus — before any S slice)

1. Which existing producer owns "an NPC tells the player about a place" (guard local knowledge vs follow-up delivery vs dialogue topics) — extend that owner.
2. Does a rumour lead need persisted state beyond a `LocationKnowledge` entry with `estimated` + a deterministic area (e.g. open-lead count, source NPC, expiry)? If yes: save field + `CURRENT_SAVE_VERSION` bump + migration per `docs/state/persistence.md` — a contract change, decided in L0.
3. Landmark identity: catalog ids derived from 060 descriptor ids (`lf:<kind>:<cellKey>`) — stable across chunk rebuild, save/load; which kinds map to existing catalog kinds (`mountainPeak`, `lake` + subtype) and whether `waterfall` needs a new kind.
4. Map presentation of an `estimated` area without a name (verify the current map draws estimated search areas).
5. V2 policy fit (from D5): opinion gate, distance band, area radius and off-centre offset, phrasing; regional reach (NPCs know their region better).

## Slices (provisional)

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| L0 | Recon above → finalize this plan | O | Q109 done; tools-026 D5 |
| L1 | Landmarks (060 P1 kinds, 064 waterfalls when present) as catalog entries with stable ids; `locations-coarse` bump after Q109 | S | L0; 060 R3 |
| L2 | Deterministic proper names (locally unique, like settlement names), shown only from `discovered` | S | L1 |
| L3 | Rumour leads: opinion-gated NPC rumour → `estimated` + off-centre coarse area; ≤ 3–4 open leads; confirmation by proximity discovery; mechanism works for existing kinds (caves, ruins, lakes) before landmarks exist | O→S | L0 |
| L4 | Text: line script by GPT Astra (geographic phrasing generated from route/hydrology data as data only) → author approval → integration | Astra → author → S | L3 |
| L5 | Walk-through on `415424794`: ask → estimated area → walk → discovered; knowledge round-trips in save | S | L4 |

L3 does not need the final geography and may run in parallel with 061–063 once L0 is done.

## Done when (provisional)

- Catalog census both seeds: landmarks present with stable ids; knowledge states round-trip in save.
- A rumour never yields a precise pin or a proper name before discovery; open leads capped; no landmark auto-revealed by generation.
- Scripted rumour walk-through recorded → §2.

## Stop if

- A rumour needs a separate exploration framework, quest marker or knowledge store.
- New NPC text would be written by an agent other than Astra.
- Persisted lead state changes the save contract without an L0 decision.
