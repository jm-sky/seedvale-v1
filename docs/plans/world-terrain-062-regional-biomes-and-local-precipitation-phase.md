# Plan: Regional biomes and local temperature / rain–snow phase

**Created:** 2026-11-04
**Status:** `planned` 📋 (slice details finalized after world-terrain-061 C2)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** world-terrain-061
**Domain:** `world-terrain`
**Subdomains:** `terrain` `vegetation` `weather`
**Tags:** `geography` `climate` `biomes` `weather` `snow` `worldgen` `epoch`
**Model:** Opus (B1 mapping, W1 consumer contract), Sonnet (B2–B3, W2)

## Goal

Stage S5 of the geography program: biomes and vegetation follow the shared macroclimate (cold/boreal north, temperate centre, warmer/drier south; **inland arid/desert areas allowed, extent calibrated on previews, no quota** — G2), and weather gains only **local temperature and local rain-versus-snow phase** on top of the existing global seasonal weather (G3). Broader weather frequency and living-world effects are **not** in scope (G3).

Absorbs the remaining part of queue **Q70** (blended biome borders + domain warp) so the biome distribution changes once.

## Verified starting point (2026-11-04)

- `biomeWeightsAt(moistureRegion, altitude01, region)` → `{ desert, swamp, forest }` (smoothstep bands); `moistureRegion` is read in `chunkHeightmap`, `chunkEnvironment`, `chunkItems`, `chunkManager`, `chunkMeshData`, `chunkCrops`, `settlementTerrain`, tile cache. Map shore classification already uses `sandBandAt` (Q70 shore part, done).
- Weather: `computeClimate(seed, day)` global; `temperatureFor(season, type)`; consumers: `gameLoop`, `createApp`, `condition.ts`, `sleepingUtilities.ts`, `playerWell.ts`, `lightningEvents.ts` (explicitly non-positional), debug GUI, terrain snow (`snowField.ts` reads `computeSurfaceWeather().snowAmount`; shader uniforms in `buildChunkGeometry.ts`; world-terrain-053 thresholds and grass burial).
- D9: reduced vegetation density is **not approved**; any redistribution must keep density per biome and be measured in the densest region.

## Design

- **B1 biome mapping** — a small Whittaker-style table on `(T, P)` + altitude feeding the **existing** weights contract (desert/swamp/forest + forest type) with continuous blending and domain-warped borders (Q70). The arid class covers dry steppe/heath and, where T high + P low persists, true inland sand desert; its extent is a calibration result reviewed on previews (G2), never a quota. Beaches keep the sand band.
- **B2 regional palette** — north: boreal conifer/birch, heath, bog, lower treeline/snowline; centre: mixed forest, meadows, wetlands in basins; south: open grassland, scrub, oak/pine woodland, dry valleys (dry drainage lines from 061). Riparian bands along perennial channels are a display/ecology modifier only (never feed hydrology).
- **W1 local climate phase** — pure `localClimateAt(climate, macro) → { temperatureC, precipitationPhase }` in the weather owner. **Simulation consumers query at the entity/site position, never at the player** (condition, sleeping, well, NPC barks/remarks when they exist). Presentation at the camera (precipitation particles, sky) uses the camera position — allowed, because it is presentation. No change to weather type frequency or cycle (G3).
- **W2 terrain snow** — world-terrain-053 snow cover becomes position-dependent: an analytic latitude/altitude/temperature bias evaluated in the existing shader path (uniforms + world position), no new per-frame CPU work; grass burial follows the same rule.

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| B1 | (T,P) mapping + borders; map/terrain agreement; caches | O | 061 C2 look approved |
| B2 | Regional forest types, treeline/snowline, riparian modifier | S | B1 |
| B3 | Vegetation instance census per chunk in the densest region + WSL A/B `stream` / `settlement` (no density reduction) → §4 for Windows | S | B2 |
| W1 | `localClimateAt` + consumer migration (list each consumer and the position it uses) | O→S | 061 C1 (can run beside B1) |
| W2 | Position-dependent terrain/grass snow | S | W1 |

## Done when

- Dominant-biome patches larger than today and following the N–S tendency; arid extent shown to the author on previews (both seeds) and accepted (§3); map and terrain agree at borders (Q70 done-when).
- 3–4 browser spots on `415424794` (north forest, south dry land, a peak, a coast) recorded → §2 for the author's look.
- Snow appears in cold north/peaks while the south rains in the same weather cycle; no consumer reads weather at the player for simulation (grep + tests).
- Vegetation census: no density reduction per biome; WSL A/B no regression (or reason recorded); caches bumped (chunk tiles; vegetation IDs are covered by epoch 1).

## Stop if

- The arid region needs a size/visual compromise or reads as a stripe (→ author).
- A vegetation change reduces density anywhere (D9).
- A consumer needs weather *frequency* by region (G3 — later approval).

## Coordination

Q70 row and its §3 question close into B1 once the author confirms the fold-in. Q46 (weather remarks) stays deferred; when it resumes it uses `localClimateAt` at the NPC position.
