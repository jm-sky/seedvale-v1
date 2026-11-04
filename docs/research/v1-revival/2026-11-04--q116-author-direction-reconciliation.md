# Q116 author direction — reconciliation with code and plans 060 / 061 / 063

**Date:** 2026-11-04 · **Author:** Claude Opus 5.5 · **Type:** Opus follow-up required by the [Q116 author section](./2026-11-04--geography-exploration-author-decisions-g1-g9.md#q116-follow-up--author-direction-and-calibration-caveats-2026-11-04)  
**Scope:** targeted code recon + plan/acceptance updates. **No code changed; no runtime, visual or performance verification.** Proposals marked 🟡 are not approved.

## 1. Q116-a — peaks ~60–80 m (G8)

Verified in code ✅:

- `worldConfig.ts`: `heightScale: 18`, `waterLevel: 0.45`; today's 33/38 m maxima come from the plan-191 massif gain / peak dominance on top of `nCombined * heightScale` (S0 relief census).
- Many consumers classify ground by **altitude fraction of `heightScale` above water**, not metres: tree line `TREELINE_ALTITUDE 0.66` (`chunkVegetation.ts`, ≈ 12 m), meadow limit 0.7 × that, grass tree line 0.58 (`grassPlacement.ts`), biome altitude gating and snow tint `(altitude − 0.55)/0.3 × mountainRidge` (`biomeColors.ts`), treasure-site / dark-forest altitude (`treasureSites.ts`, `darkForestTreasureSite.ts`), tree lifecycle.
- Snow accumulation uses **absolute metres**: `SNOW_ALT_M = [60, 140]` (`snowField.ts`) — no ground reaches it today; 60–80 m peaks would be the first to get the altitude bias.
- Sun shadow camera `near 1 / far 200` (`createLights.ts`).

Consequences for 060 R1/R2 🟡:

1. **Do not raise `heightScale`.** It would rescale every altitude-fraction consumer (tree line, meadows, grass, biomes, treasure sites) across all lowland and change hydrology everywhere. Reach 60–80 m by an **additive spine/summit term in metres** inside the existing envelope → ridge → massif hierarchy (060 design §1–§2), limited to range cores and a few summits. Lowland and hill country keep today's altitude classes.
2. Above ≈ 12 m everything is already above the tree line, so tall ranges become **bare rock/alpine bands automatically** — larger treeless areas than today. That is a visible landscape change (more bare land, fewer forest cells on ranges) → part of the R2 preview the author judges, not a silent side effect.
3. Peaks at 60–80 m enter the `SNOW_ALT_M` ramp (snow cover bias) — consistent with world-terrain-062's position-dependent snow; R2 records it, 062 owns any tuning.
4. Steeper, higher spines strengthen drainage divides: expect longer trunks off the ranges and fewer valley-floor micro-streams — helps Q116-b, but hydrology must be recomputed at R4 (already planned).
5. Passes: a 60–80 m range needs corridors that stay within `slopeConstraint.ts` / router grade costs in both directions (060 §6). Higher peaks make the corridor check the binding gate, not the peak height.
6. Checks to add at R2: chunk bounds / culling with taller geometry, shadow coverage of tall near-player slopes (far 200), fog/far plane silhouettes. Diagnostic, measured at R4; no FPS claims.

Proposed R2 profile (🟡 for the author's preview review): highest peak per seed 60–80 m, most range crests 35–55 m, isolated massifs/hills keep today's 25–38 m; ≥ 20° slopes concentrated on crests and summits (report the share; no fixed target until previews).

## 2. Q116-b — ≈ 50 % less total watercourse length

- Metric = **total stream length per land km²** (D1 network census), measured after 061 H2 (relief frozen at 060 R4, climate runoff in). Target band 🟡 **−40…−60 %** vs S0 (12.2 / 11.6 km/km²), finalized on previews.
- The reduction must come **mostly from minor streams**: guard metrics = trunk systems ≥ 3 with hierarchy (S0 row, keep), main-river length not reduced by more than ~15 % 🟡 (new guard, proposed), 0 parallel-pair artifacts.
- Heads: reported, not gated (the old "−60 %" row depended on the superseded option set).
- Supersedes the Q114 1920 m² preview preference (−21 %) as the direction; the 960–7680 m² variants stay as calibration references.

## 3. Q116-c — the "left road from home" (verify before tuning)

From the D3 census (`census-data/2026-11-04--travel-census.json`, seed 415424794), home has **three routed edges** ✅:

| To | Leaves toward | Polyline | Ratio | River crossings |
| --- | --- | --- | --- | --- |
| `-4_-2` (MD) | west (14° from west) | 1429 m | 1.04 | 5 |
| `0_4` (MD) | south (map z+) | 1179 m | 1.02 | **12** |
| `4_-1` (MD) | east | 1320 m | 1.11 | 5 |

- The author recalls a **winding road with several bridges**. The census picked `-4_-2` by map direction only; `0_4` has by far the most crossings, and "left" may be relative to the camera/spawn view rather than north-up. 🟡 Census ratios measure the routed polyline; the visible road also carries Q61 shaping and bridge straightening (Q97), so "winding" may be visible-geometry only.
- Author's acceptance (~4 real minutes) ≈ 1440 m at 6 m/s — all three edges are within it **by estimate**. So there is **no measured travel defect yet**.
- Action: §3 question (which road) + an S browser task (Q132): walk/fly the chosen road on `?seed=415424794`, record bridges seen, visible winding, route polyline vs rendered road, timed real walk. Until then, 063 does not optimize journey length.

## 4. Q116-d — wilderness and relative-safety belts

### 4.1 What V1 does today (verified ✅)

- **Wild fauna is anchored to the home settlement only.** `createFauna()` ring-spawns its fixed `SPAWNS` list (wolves, foxes, deer, stags, rabbits, ducks, boar) at `SPAWN_RING_OFFSET` 4–27 m past the **home** footprint; habitat spawners (thicket/rock den/wolf den) at `SPAWNER_RING_OFFSET` 25–45 m; predator dens at `PREDATOR_DEN_RING_OFFSET` 70–130 m (Q100). Other settlements get no ring fauna.
- **Closed-settlement predator pressure** (`closedPredatorPressure.ts`, plan settlements-010): closed settlements near home get extra wolf-den capacity within `CLOSED_PREDATOR_PRESSURE_RADIUS` 100 m — the code already encodes "palisade = response to danger" (more predators around closed settlements), which matches the author's direction.
- **Character:** `settlementCharacter.ts` — home and OUTPOST are `default`; forest terrain 42 % closed, other terrain 8 %; closed settlements get palisades and a different guard floor (`settlementPalisade.ts`, `professionStaffing.ts`).
- **Avoidance, not a safe zone:** `VILLAGE_AVOID_MARGIN` 6 m past the footprint removes the village from wild wander targets and predator prey search; frenzied/rabid wolves can still enter (`canPursueIntoVillage`, `FRENZY_VILLAGE_ARRIVAL_RADIUS`). Roads are only avoided at spawn time.
- Dungeon caves carry their own residents (`dungeonResidents.ts`).

### 4.2 Gaps against the author's direction

1. Danger is concentrated **next to home** and nearly absent elsewhere: the home's surroundings are the most fauna-dense ring of the world, while the 21 other settlements and most of the continent have no wild fauna except dungeon residents (and closed-pressure dens near home). "Wilderness by habitat/threat" cannot be measured or felt beyond home until fauna exists there — this is the real gap, larger than any belt radius.
2. 🟡 **Probable stale legacy probe:** `collectNearbyClosedSettlements()` (`worldBundle.ts`) probes the 8 legacy grid cells around home (`SETTLEMENT_GRID_STEP` 300) with `probeSettlementSite` and **no layout-membership check**. Under the 059 sparse layout (min distance 720 m) none of those cells can be a real settlement, so any "closed" result is a phantom site that can still receive closed-pressure wolf dens 300–424 m from home. Needs a headless check, then a fix through the layout owner (`settlementPlanCache.settlementLayoutFor`) — queue Q133.
3. No per-settlement notion of worked land beyond the footprint (fields/pasture are inside it); predator den offsets are a fixed ring independent of size/character/forest.

### 4.3 Smallest compatible direction (🟡 proposal, needs the author)

- **Retire** the "≥ 20 % land > 5 h" gate; keep distance-to-settlement as a neutral diagnostic (done in the S0 table and 063).
- **Belt = a derived width, not a system:** one pure function `safetyBeltWidth(size, character, localForest/wetland, nearby predator capacity)` owned by the settlement plan, consumed by the **existing** placements: inner edge of predator-den rings (replacing the fixed 70–130 m for the home and any settlement that gets fauna), vegetation clearing / field extent where those owners already read the footprint. Closed + forest → narrower belt; larger towns → wider. No suppression rule, no safe zone: avoidance stays as today, wolves can still approach.
- **Wilderness metric** for 063/062 reports: land-cover/land-use shares (forest, wetland, rock/alpine, not inside any belt or road corridor) plus predator-habitat presence once fauna is distributed — reported, not gated, until the author sets a target.
- **Fauna beyond home** is a separate fauna program (streamed per-settlement or per-region habitats, unpersisted ordinary wild animals, spawner lifecycle already persisted per id), performance-relevant (more agents) and outside 060/061/063 → author decision (§3).

## 5. Plan / gate changes made with this note

- S0 acceptance table: author column filled from Q116; wilderness row retired to a diagnostic.
- 060: G8 profile (§1) recorded; R1 gate no longer waits for the author's G8 answer (Q118 now only waits on Q117).
- 061: H2 acceptance = −40…−60 % total length, minor-stream-led, main-river guard.
- 063: ranking (2) journeys = report only until Q132; (3) wilderness = land-cover diagnostic + belt report, no ≥ 20 % gate; author route = the road confirmed in Q132.
- Queue: Q132 (route verification, S browser), Q133 (phantom closed sites, S), §3 Q134 (belts / fauna beyond home) and the Q116-c road pick.
