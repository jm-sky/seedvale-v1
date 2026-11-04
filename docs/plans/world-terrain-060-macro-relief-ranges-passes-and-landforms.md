# Plan: Macro relief — mountain ranges, passes and landform package P1

**Created:** 2026-11-04
**Status:** `planned` 📋 (R0 ready after tools-026 D2; R1–R4 gated on the S0 baseline and the author's G8 answer)
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** tools-026
**Domain:** `world-terrain`
**Subdomains:** `terrain` `worldgen`
**Tags:** `geography` `relief` `mountains` `landforms` `worldgen` `epoch`
**Model:** Opus (R1–R2 shape calibration), Sonnet (R0, R3–R4)

## Goal

Stage S2 of the geography program: turn isolated round mountain patches into a few **connected ranges / ridges / massifs with traversable passes** and allow **locally steep, dramatic summits** (G8), and add the first **natural landform package** (G6 P1: crags/isolated hills, spine summits, lakes with islands, craters/crater lakes). Relief comes **before** climate and hydrology so rivers are calibrated once, on the final relief (proposal Rev. 1 remark 1).

Authority: [G1, G6, G8](../research/v1-revival/2026-11-04--geography-exploration-author-decisions-g1-g9.md) — overall relief height is preserved **unless the S0 baseline shows peaks too low**; the summit shape/height profile is decided **after** measured profiles and previews, not by a blanket V3 transfer. Candidate mechanism: [proposal §4.0, §4D](../research/v1-revival/2026-11-04--geography-exploration-architecture-proposal.md#40-macro-relief-ranges-massifs-crests-added-in-rev-1) (not approved as an algorithm — verify and adapt).

## Verified starting point (2026-11-04)

- `chunkHeightmap.ts` builds the floor from continentalness + an isotropic mountain gate (`mountainScale`, `mountainThreshold`, `mountainThresholdWidth`) → Worley ridges (`worleyRidge`) → plan-191 massif gain / peak dominance / saddle deepening → `nCombined * heightScale`. `sampleRawFloorUncorrected(x, z, params)` is the unconditioned sampler used by hydrology, chunk workers and censuses (all realms compute it from `RawSampleParams`).
- `hydrologyId` hashes `WORLD_HYDROLOGY_VERSION`, the options and the terrain **params** — not the sampler code. A sampler change therefore needs a `WORLD_HYDROLOGY_VERSION` bump (golden hash test reminds) plus `CHUNK_TILE_CACHE_VERSION` (26) and every downstream namespace whose output moves (settlement defs 25, road routes 13, caves 7, abandoned cemeteries, locations-coarse — see Q109 below).
- `WORLDGEN_EPOCH = 1` is the open Revival batch (G1): no further epoch bump; old saves are already refused.
- V3 has seeded mountain-centre/barrier/pass descriptors in its heightfield (`../seedvale-v3/src/game/world/gen/heightfield.ts`) — donor idea only, verdict in tools-026 D5.

## Design (proposal-derived; R1 finalizes numbers after S0)

1. **Range spines.** A pure module `src/terrain/landformDescriptors.ts` derives, from seed + world config only, 1–3 range spines (domain-warped polylines, 🎯 2–5 km on the island) and each spine's **pass descriptors** (lowered saddles). The spine distance field becomes the main term of the mountain envelope; the existing noise gate stays as a weaker secondary term so isolated massifs and hill country remain. Ridge orientation follows the spine. Reuse the existing envelope → ridge → massif hierarchy; **no second terrain generator**.
2. **Summits.** Steeper crests and rocky summits on the spine core via a sharper ridge profile and the existing rock exposure; height/steepness profile per the author's G8 answer (§3 question from tools-026 D6).
3. **Landform descriptors (P1 kinds):** `crag` (isolated rocky hill), `spineSummit`, `lakeIsland` (basin with a knoll — hydrology decides the water), `crater` (rim + bowl; crater lake when hydrology fills it). Each record: stable id `lf:<kind>:<cellKey>` (from the winning candidate cell, never a list ordinal), centre, radius, params, `intendedOutcome`. Stored in a 512 m bucket index → O(1) lookup, ≤ 2 analytic profiles per sample.
4. **Selection:** candidates scored on the descriptor-free base relief (no recursion), Poisson-style separation, fixed home reserve; 🎯 about 3–5 major attractions per world, **no per-kind guarantee**; a shortfall relaxes thresholds in deterministic steps and is reported by the census — never stamped onto unsuitable relief (G6).
5. **Acyclicity:** descriptors read seed + base relief only — never hydrology, climate, settlements or roads. Settlements/roads later **avoid** landform footprints (world-terrain-063).

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| **R0** | Descriptor module + bucket index + debug overlay in the continent preview; sampler hook with **zero descriptors → bit-identical output** (golden hash unchanged) | S | tools-026 D2 landed |
| **R1** | Range spines + passes reshaping the envelope; previews on 7 seeds (`42`, `415424794` + 5); relief census vs S0 | O | S0 baseline reviewed by the author; G8 answer |
| **R2** | Summit steepness/height profile per G8; transects vs S0 and V3 | O | R1 |
| **R3** | Landform P1 kinds + selection + census row (`intendedOutcome` listed; hydrology assertions come in 061) | S | R1 |
| **R4** | Cache bumps, chunk-generation time and hydrology boot time before/after, downstream **re-census only** (settlements, roads, access, caves, cemeteries) — no tuning here; browser check: cross one pass and stand on one summit on `415424794` | S | R2, R3 |

## Done when

- Relief census: 1–3 coherent ranges per seed with connected crests, ≥ 1 pass per range, isolated massifs still present; summit profile matches the author's G8 choice.
- 7-seed previews committed; landform census lists 3–5 major attractions per seed or reports the shortfall.
- Chunk-generation time and hydrology boot not worse beyond stated noise (report numbers, WSL, no FPS claims).
- Downstream censuses re-run: 0 roadless settlements not worse than S0, access 0 unreachable, wet objects 0 (Q37 guards).
- Caches bumped per namespace; type-check, lint, tests; implementation notes + `docs/state/terrain-and-world-generation.md`.

## Stop if

- Pass/route slopes exceed what roads, NPC pathing or building pads accept (→ §3 with options).
- A landform needs post-hydrology carving to work.
- Sampler cost per chunk rises beyond the budget agreed in R0 notes.
- Ranges cut the island so that progression/home-growth guarantees fail.

## Coordination

- **Q109** (Sonnet, catalog lakes, in flight in a separate checkout) owns `worldLocationCatalog.ts`, `locationsCoarseCache.ts` (`LOCATIONS_COARSE_VERSION` 3 → 4) and `census-catalog-lakes.ts`. Do not edit them here; R4 bumps locations-coarse to the next free version **after Q109 is on `main`**.
- Q61–Q64 road work stays deferred until world-terrain-063 (author 2026-11-04).
- Later landform packages (volcanic district, castle/large ruins — G6 P2, G9 separation) are out of scope; they add descriptors here with a local re-census only.
