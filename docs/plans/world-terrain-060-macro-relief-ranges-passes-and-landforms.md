# Plan: Macro relief — mountain ranges, passes and landform package P1

**Created:** 2026-11-04
**Status:** `done` ✅ (2026-11-06) — R0 (Q117), R1–R2 (Q118; **author accepted the R2 mountain look 2026-11-05: "mountains look great" / "OK"**), R3–R4 relief freeze (Q119; author browser review accepted 2026-11-06: summits, crater, lake island, rock patches, pass `6_-7:0`). The R4 relief is the frozen input for 061/062/063 and world-041 L1. Residuals handed on, not open here: 🟡 seed 42 routed components 4 (R2: 3) and pass `415424794` `6_-7:0` 14.1 % per 100 m → road close-out Q61–Q64; ore under a rock plate seen once (cause unconfirmed — add a plate exclusion around deposits if it recurs); far-tile colour has no plates. [Implementation notes](./implementation-notes/world-terrain-060-macro-relief-ranges-passes-and-landforms-implementation-notes.md); amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04
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
- `WORLDGEN_EPOCH = 1` is the open Revival batch (G1): no further epoch bump. `loadStoredSave` refuses an epoch **mismatch** only — pre-epoch saves are refused, but a save made by an earlier epoch-1 generator is **accepted** by a later one, and cache invalidation does not migrate persisted NPCs, terrain edits, trees, buildings, quest locations or checkpoints. Intermediate epoch-1 saves are **disposable test saves** — see [roadmap — epoch-1 intermediate saves](../research/v1-revival/2026-10-27--master-revival-roadmap.md#geography-program--staged-plans-opus-2026-11-04) (review 031 F6).
- V3 has seeded mountain-centre/barrier/pass descriptors in its heightfield (`../seedvale-v3/src/game/world/gen/heightfield.ts`) — donor idea only, verdict in tools-026 D5.

## Design (proposal-derived; R1 finalizes numbers after S0)

1. **Range spines.** A pure module `src/terrain/landformDescriptors.ts` derives, from seed + world config only, 1–3 range spines (domain-warped polylines, 🎯 2–5 km on the island) and each spine's **pass descriptors** (lowered saddles). The spine distance field becomes the main term of the mountain envelope; the existing noise gate stays as a weaker secondary term so isolated massifs and hill country remain. Ridge orientation follows the spine. Reuse the existing envelope → ridge → massif hierarchy; **no second terrain generator**.
2. **Summits.** Steeper crests and rocky summits on the spine core via a sharper ridge profile and the existing rock exposure. ✅ **Author G8 / Q116-a (2026-11-04):** highest peaks **~60–80 m** (preference for the tallest summits, not every mountain; S0: 33/38 m). 🟡 Technical constraints ([Q116 reconciliation §1](../research/v1-revival/2026-11-04--q116-author-direction-reconciliation.md#1-q116-a--peaks-6080-m-g8)): keep `heightScale` 18 (tree line, meadows, grass, biome gating and treasure sites read **altitude fractions of `heightScale`**) and add the extra height as a **metre-scale spine/summit term** limited to range cores; tall ranges become bare above the ≈ 12 m tree line and reach `SNOW_ALT_M` 60–140 m — both are part of the R2 preview the author judges. Proposed profile: top peak per seed 60–80 m, most crests 35–55 m, isolated massifs keep 25–38 m.
3. **Landform descriptors (P1 kinds):** `crag` (isolated rocky hill), `spineSummit`, `lakeIsland` (basin with a knoll — hydrology decides the water), `crater` (rim + bowl; crater lake when hydrology fills it). Each record: stable id `lf:<kind>:<cellKey>` (from the winning candidate cell, never a list ordinal), centre, radius, params, `intendedOutcome`. Stored in a 512 m bucket index → O(1) lookup. The bucket size alone does not bound cost: R0 states the **descriptor overlap rule** (max footprint radius vs bucket, max descriptors per bucket) and the **range-segment bound** per sample, and measures sampler cost per chunk against the tools-026 D7 baseline (review 031 F7).
4. **Selection:** candidates scored on the descriptor-free base relief (no recursion), Poisson-style separation, fixed home reserve; 🎯 about 3–5 major attractions per world, **no per-kind guarantee**; a shortfall relaxes thresholds in deterministic steps and is reported by the census — never stamped onto unsuitable relief (G6).
5. **Acyclicity:** descriptors read seed + base relief only — never hydrology, climate, settlements or roads. Settlements/roads later **avoid** landform footprints (world-terrain-063).
6. **Pass corridors ≠ protected footprints (review 031 F9).** Each pass descriptor carries a **traversable corridor** (centreline, width, intended max grade) distinct from protected landmark footprints; blanket landmark avoidance in 063/roads must not exclude the intended crossing. A lowered saddle is not acceptance: the corridor is validated **after** hydrology correction, road shaping, building pads and streaming — route approaches, width and final grades in both directions against `slopeConstraint.ts` (uphill slows above 35°, uphill component removed at 55°, metre-scale probes) and the road router's terrain/ridge costs.

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| **R0** | Descriptor module + bucket index + debug overlay in the continent preview; sampler hook with **zero descriptors → bit-identical output** (golden hash unchanged) | S | tools-026 D2 landed |
| **R1** | Range spines + passes (incl. corridors) reshaping the envelope; previews on 7 seeds (`42`, `415424794` + 5); relief census vs S0; cache bumps for every namespace whose output moves | O | R0; ✅ S0 reviewed + G8 answered (Q116-a, 2026-11-04) |
| **R2** | Summit steepness/height profile per G8 (top peaks ~60–80 m); transects vs S0 and V3; tree-line/bare-rock share and snow-ramp reach reported; chunk bounds, shadow (camera far 200) and fog silhouettes checked on tall slopes; cache bumps; **author preview review before R3/R4** | O | R1 |
| **R3** | Landform P1 kinds + selection + census row (`intendedOutcome` listed; hydrology assertions come in 061); cache bumps | S | R1 |
| **R4** | **Relief freeze**: global hydrology recompute + global invariants, chunk-generation time and hydrology boot time vs D7 baseline, downstream **re-census only** (settlements, roads, access, caves, cemeteries, catalog lakes) — no tuning here; pass-corridor grade check both directions; browser check: cross one pass and stand on one summit on `415424794`. The relief revision at R4 is the **frozen input** for 061 C2/H1–H2 and world-041 L1 | S | R2, R3 |

Cache versions/fingerprints change in **each output-changing slice** (R1, R2, R3), not only at R4 (review 031 F2); worldgen-output slices still land one at a time.

## Done when

- Relief census: 1–3 coherent ranges per seed with connected crests, ≥ 1 pass per range whose corridor passes the grade/width check in both directions after hydrology/roads/pads, isolated massifs still present; summit profile matches the author's G8 choice (top peaks ~60–80 m, approved on R2 previews).
- 7-seed previews committed; landform census lists 3–5 major attractions per seed or reports the shortfall.
- Chunk-generation time, hydrology boot and peak transient memory not worse beyond the tolerance declared in the tools-026 D7 protocol (cold vs cold, warm vs warm; report numbers, WSL, no FPS claims).
- Downstream censuses re-run: 0 roadless settlements not worse than S0, access 0 unreachable, wet objects 0 (Q37 guards).
- Caches bumped per namespace; type-check, lint, tests; implementation notes + `docs/state/terrain-and-world-generation.md`.

## Stop if

- Pass/route slopes exceed what roads, NPC pathing or building pads accept (→ §3 with options).
- A landform needs post-hydrology carving to work.
- Sampler cost per chunk rises beyond the budget agreed in R0 notes.
- Ranges cut the island so that progression/home-growth guarantees fail.

## Coordination

- **Q109** landed 2026-11-04 (`LOCATIONS_COARSE_VERSION = 4`); the first output-changing slice here bumps locations-coarse to the next free version.
- Q61–Q64 road work stays deferred until world-terrain-063 (author 2026-11-04).
- Later landform packages (volcanic district, castle/large ruins — G6 P2, G9 separation) are out of scope. **No "local re-census only"** (review 031 F5): `computeWorldHydrology` floods, breaches pits, picks spill points and accumulates globally, so a local change at a divide or spill can reroute distant reaches. Every terrain-changing package recomputes global hydrology and re-runs the cheap global invariants plus changed catchment / site / route / catalog-identity checks; expensive visual inspection may stay local once the impact set is known. Before the epoch-1 close proposal, record whether P2 terrain joins epoch 1 or explicitly accepts a later compatibility boundary (author decision only if it conflicts).
