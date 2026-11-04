# Plan: Geography baseline diagnostics (G1–G9 stage S0)

**Created:** 2026-11-04
**Status:** `planned` 📋
**Type:** infrastructure
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `diagnostics` `worldgen`
**Tags:** `geography` `hydrology` `relief` `settlements` `roads` `census` `epoch`
**Model:** Sonnet (D1–D4, D7), Opus (D5–D6)

## Goal

Measure the current world before any geography generator change lands, so every later acceptance row of the geography program (G1–G9) compares against numbers and images instead of the proposal's 🎯 ranges. Diagnostic only: **no generator, cache, save or runtime-path change lands in this plan.**

Program context: [G1–G9 author decisions](../research/v1-revival/2026-11-04--geography-exploration-author-decisions-g1-g9.md) · [architecture proposal §6–§7](../research/v1-revival/2026-11-04--geography-exploration-architecture-proposal.md#6-suggested-staged-sequence-no-task-slices) (candidate mechanisms, not approved) · [roadmap — geography program](../research/v1-revival/2026-10-27--master-revival-roadmap.md#geography--exploration--approved-direction-2026-11-04-p2-epoch-1).

## Verified starting point (2026-11-04, `main` `4f507610`)

- Censuses exist as `pnpm worldgen:*:census` (`scripts/perf/census-*.ts`): `rivers`, `roads` (`--rings`, `--bridges`), `spacing` (`--roads=1`), `continent` (`--rings=21`), `caves`, `access`, `lakes` (catalog lakes; Q109 landed 2026-11-04, `LOCATIONS_COARSE_VERSION = 4`).
- `census-spacing.ts` counts components over **layout adjacency** and its road check counts settlements with no roads — zero isolated vertices and one proposed-graph component do **not** prove one component of successfully routed roads (review 031 F4).
- `scripts/tools/continent-preview-png.ts <seed> <out.png> [all|standard]` paints the whole continent with the canonical tile builder + hydrology (headless, 1536 px). `all` is the diagnostic all-streams mode; `standard` exists but nobody has judged it as the gameplay-map equivalent.
- Hydrology: every land cell contributes `1` to accumulation (`worldHydrology.ts` ~L784, uniform runoff); a stream starts at `streamAccumulation = DEFAULT_RIVER_THRESHOLDS.stream` cells on the 8 m grid (`RIVER_CELL_STEP`); `lakeMinCells 600`, `minChainCells 8`; `WORLD_HYDROLOGY_VERSION = 1` with a golden-hash test.
- Relief: one isotropic gate `mountainScale` / `mountainThreshold` (+ width) over Worley ridges and the plan-191 massif/peak hierarchy (`chunkHeightmap.ts` ~L540–640); final height `nCombined * heightScale`. Peak heights, prominence and slope distribution have never been measured.
- Settlements: `settlementLayout.ts` Poisson-disc selection, `SETTLEMENT_SPACING_M 1150`, `SETTLEMENT_TARGET_COUNT 22`, relaxing toward `SETTLEMENT_MIN_DISTANCE_M = 4 × TRAVEL_HOUR_M`; RNG graph; travel speeds player 6 m/s (180 m per game hour), NPC travel 3.6 m/s (059).
- Scale (current code, supersedes the older Brief's 8 × 8 km / XL "within ~1.5 km" wording — review 031 F10): continent half-extent 6144 m (`continentMask.ts`), hydrology grid 1537² over ±6144 m; size progression uses the graph-hop policy with `SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M = 4000` (`settlementProgression.ts`, 059). Baseline numbers are reported against these.
- Offscreen transport (`transportOffscreen.ts`) deliberately keeps straight-line estimates for legacy same-settlement/resource-site handoffs and excludes cross-settlement generic-travel legs from that clock — D3 hours are a **labelled estimate**, not a travel model to generalize (review 031 F9).
- Cost: installed hydrology payload 6.63 / 6.79 MiB per copy after Q96 (058 notes) — payload only, not peak process memory; hydrology strips are sampled in workers, computed on the main thread (`worldHydrologyRuntime.ts`). No current cold/warm boot or peak-memory baseline exists (review 031 F7).
- Donors: V2 = `jm-sky/seedvales-v2` pin `9ba54815` (GitHub only, not cloned locally; `src/game/sim/rumours.ts` cited by the proposal); V3 = local `../seedvale-v3` (`src/game/world/gen/heightfield.ts`, `barrier.test.ts`, `src/game/render/riverRibbon.ts`).

## Slices

### D1 — River network census (S)

Extend `worldgen:rivers:census` (same script, new sections behind flags so the old output stays comparable):

- stream length per land km², chain heads, trunk systems (chains reaching the sea/a lake with ≥ N tributaries; report the top systems with length and order), share of land > 300 m from a stream, hydrology payload per copy;
- accumulation-area histogram (cells → m²) so area thresholds can be chosen later;
- **parallel-pair detector**: segment pairs < 30 m apart running parallel > 150 m, classified by whether a ridge (height bump ≥ a stated margin) separates them → `artifact?` vs `valid` list with coordinates;
- **preview-only threshold override** `--stream-m2=<a,b,c>` that recomputes chains on the same conditioned grid with a different initiation area and prints the same metrics. It must not change `DEFAULT_WORLD_HYDROLOGY_OPTIONS` or any cache key.

### D2 — Relief statistics (S)

Extend `worldgen:continent:census` with `--relief` (or a sibling script if the continent census cannot host it cleanly): height histogram of land, top 20 peaks with prominence and isolation, slope classes (share of land per class, share along current road polylines), mountain-gate area and connected-component sizes/lengths of gated land (ridge connectivity), and 3 fixed transect profiles per seed exported as CSV (for the G8 comparison with V3 steep summits).

### D3 — Route-weighted travel census (S)

Extend `worldgen:roads:census` (or `worldgen:spacing:census --roads=1`, whichever already owns edge metrics) to the whole continent:

- per graph edge: straight distance, entrance-to-entrance polyline length, access legs, route ratio, game hours for player (6 m/s) and NPC travel (3.6 m/s) — **labelled "distance ÷ speed estimate"**, failed edges;
- **true route connectivity** (review 031 F4): components computed over **successfully routed, traversable** route edges only (failed crossings / failed routes are not edges); report **selected / defined / road-connected** settlement counts separately — the layout-adjacency component count stays as a separate, labelled column;
- per world: land area, share of land within 2/5/8 h of a settlement (straight-line hours; label it as such), **wilderness share** (land > 5 h), coverage per island quadrant;
- **author route:** on seed `415424794` identify the home edge whose road leaves to the **west/left on the north-up map** toward the second settlement the author walked; print its polyline length, ratio, hours and the detour causes along it (bay, river crossing, slope band), plus **sampled grades along the polyline** (both directions) and draw it in the D4 overlay. A timed in-game walk of this route is recorded separately (→ queue §2), never inferred from the estimate. If two candidates fit, list both — the author confirms which one.

### D4 — Preview layers and gameplay-mode images (S)

`continent-preview-png.ts` gains optional overlays: hillshade + slope class, mountain gate, settlements with graph edges and route polylines (D3), D1 threshold variants (2–3 images per seed, uniform runoff). Export `standard` **and** `all` for both seeds into `docs/research/v1-revival/continent-previews/` with seed + SHA in the filename. Update [world-inspection](../tools/world-inspection.md) with the new flags.

### D5 — Donor recon (O, read-only)

One research note `docs/research/v1-revival/2026-11-xx--geography-donor-recon.md` (≤ 200 lines) with a verdict per donor (adopt policy / adapt / skip) and file links at pinned SHAs. No code is copied.

1. **V2 waterfall** (G6): find the actual implementation/asset (geometry, shader, particles, sound), how it is placed (authored vs derived from hydrology), interaction (swim/climb/collide), cost (draws, triangles, per-frame work).
2. **V2 rumour → approximate area** (G7): gating (opinion), cap of open leads, distance band, area radius/offset, phrasing, how a lead is confirmed; map onto V1 `LocationKnowledge` (`estimated → discovered → confirmed`) and `WorldLocationArea`.
3. **V3 steep summits and carved road passes** (G8): mountain-centre/barrier/pass descriptors in `heightfield.ts`, how roads use passes, slope limits; what a V1/V3 hybrid would take over (shape idea) vs not (generator).

### D6 — Baseline packet for the author (O)

Research note `2026-11-xx--geography-s0-baseline.md`: both seeds' numbers from D1–D3 and D7, image links from D4, D5 verdicts, and the proposal's §7 acceptance table with each 🎯 replaced by "keep / adjust to X" and a reason. Keep three columns apart: **measured baseline**, **proposed target**, **author-approved value** (review 031). Proposed global targets are not hard guarantees until feasibility is measured; the parallel-pair detector is a triage aid and latitude-band temperature means are diagnostics, not proof (elevation can reverse a band mean). Add to queue §3 (Polish, short options):

- **G8 height/shape:** relief stays, or summits steeper/higher, with transect profiles and V3 comparison (author decides after measurement — G8);
- **targets:** confirm/adjust river density reduction, dry-interfluve share, journey band and wilderness share before world-terrain-061/063 calibrate against them.

### D7 — Cost and workload baseline (S, review 031 F7)

Measured once on the current world so later slices compare like with like (no optimization, no FPS claims):

- **Worldgen cost:** cold and warm boot (cold vs cold, warm vs warm), hydrology sampling / compute / install time, installed payload and **peak transient memory**, worker count and payload copies, chunk-generation time per chunk (p50/p95), map raster cost, settlement layout + road route computation time.
- **Simulation workload:** households, NPCs, active transport legs; one representative offscreen/time-skip workload (settlement-count variants in world-terrain-063 change it).
- **Protocol:** production build, recorded seed / commit / cache state (cold = cleared caches and no fixture), ≥ 3 repeated samples, declared tolerance per metric. WSL only; Windows numbers never mixed in. Results in the D6 note; this protocol is what "not slower beyond noise" means in 060–063.

## Done when

- D1–D3 and D7 run on seeds `42` and `415424794`, JSON output committed in the baseline note (or linked results file); D4 images committed; D5 note committed; D6 questions in queue §3.
- `pnpm run type-check`, `pnpm run lint:fix`; existing census output unchanged without the new flags (diff a run before/after).
- No change to `src/` runtime behaviour; any helper extracted from runtime code keeps identical output (unit test or identical census output).

## Stop if

- A metric needs a generator change to be computed (→ note it, compute what is possible).
- The author route cannot be identified from the graph (→ ask in §3 with a map image).

## Out of scope

Any threshold, relief, climate or settlement change; cache bumps; fixture export; FPS measurements (D7 measures worldgen/boot cost and workload, not frame rate).

## Review 031 (2026-11-04)

[Review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md): **ready with conditions** — runtime output unchanged; add measured cost baselines (F7 → D7), true route connectivity and labelled travel estimates (F4/F9 → D3), current-scale references (F10 → starting point). Amended 2026-11-04.
