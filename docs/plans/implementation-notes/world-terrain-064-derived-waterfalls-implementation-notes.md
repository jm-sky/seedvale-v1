# Implementation notes — world-terrain-064 derived waterfalls

## W0 decision (Opus, 2026-11-06 — queue Q125; written before code)

Gates: tools-026 D5 donor verdict ([donor recon §1](../../research/v1-revival/2026-11-04--geography-donor-recon.md#1-waterfall-g6): V2 has no waterfall; the only donor is V1's own `waterfallFactor`), 061 H5 candidates ([data](../../research/v1-revival/2026-11-06-waterfall-candidates.json); re-run on `6e20d6df`, bit-identical), 060 R4 relief freeze + 061 H6 hydrology close-out landed.

### 1. Evidence: the drops are cascades, not plunge falls ✅

Profile of every H5 candidate (throwaway script over `computeWorldHydrology` + `sampleHeightAt` with the installed hydrology, both seeds; chain point spacing 1.3–2.9 m):

| | seed 42 | seed 415424794 |
| --- | --- | --- |
| candidates (drop ≥ 2 m, slope ≥ 0.25) | 40 | 49 |
| after merging runs on one chain with < 30 m gentle gap | 34 sites (5 merged) | 43 sites (6 merged) |
| drop p50 / p90 / max | 3.1 / 7.2 / 16.2 m (merged max 24.9 m) | 5.3 / 12.0 / 19.3 m (merged max 23.8 m) |
| reach length p50 / max | 10 / 40 m | 17 / 46 m |
| mean slope p50 / max | 0.30 / 0.41 | 0.30 / 0.52 |
| **steepest single chain segment** max | **0.56 (29°)** | **0.68 (34°)** |
| segments above today's foam onset (0.6) | 0 | 3 (in 2 sites) |
| steepest corrected-ground slope along the reach | 0.78 (38°) | 0.96 (44°) |
| merged sites with drop ≥ 10 m | 3 | 11 |
| lip-cell (16 m) id collisions | 0 | 0 |
| sites per 64 m chunk max | 2 | 2 |
| nearest 060 landform (crag/crater/…) | > 400 m for every site | > 400 m for every site |

Conclusions:

- ✅ There are **genuine drops** on perennial chains (up to ~25 m after merging), so the stop-if "relief yields no genuine drops" is not hit. Every chain in the packed hydrology is perennial (061 H1 threshold, dry drainage not yet a class — H2 waits for §3 Q121-a), so "perennial class" needs no extra filter today.
- ✅ **No drop is vertical.** The steepest chain segment is 34° and the ground under it ≤ 44°; nothing is a step. A vertical falling sheet would hang in the air next to a 30° slope or need a carved step — which this plan forbids ("never a post-hoc carved drop").
- ✅ Today these reaches render as plain tilted water: `waterfallFactor` (`riverGeometry.ts`) starts at slope 0.6, so 0 / 3 segments get whitewater. The census comment "mirrors the renderer's foam onset" (`census-hydrology-outcomes.ts` `STEEP_SLOPE`) is wrong — detector 0.25 vs renderer 0.6.
- ✅ The sites do not sit on 060 landforms (crags, craters); they are steep valley flanks of the relief, concentrated on 415424794's western flank (15 site pairs < 100 m apart).

### 2. Decisions

1. **Presentation = cascade (whitewater rapids down a steep reach)**, not a plunge waterfall. ✅ **Author Q125-a (a), 2026-11-06.** A real plunge fall needs a vertical step in the relief — that would be a new 060 landform (e.g. a scarp the river crosses), which reopens the accepted relief freeze, and is offered to the author as a later option, not done here.
2. **One detector, one owner.** New pure module `src/terrain/waterfallSites.ts` (terrain/hydrology owner, next to `worldHydrologyStore.ts`): `waterfallSitesOf(hydrologyId)` memoized per installed hydrology id (same pattern as the landform index), computed from the installed chains — the shipped (smoothed) chain elevation, single source with the ribbon (review 031 F9). `census-hydrology-outcomes.ts` switches to this function (no second copy of the rule).
   - Steep segment: slope ≥ `CASCADE_SLOPE_MIN` 0.25. Site: maximal run of steep segments; runs on the same chain separated by < 🟡 30 m of gentler flow merge into one site. Keep the site if drop ≥ `CASCADE_MIN_DROP_M` 🟡 2 m.
   - **Tier:** `landmark` if drop ≥ 🟡 10 m **and** it is the largest landmark-tier site within 🟡 300 m (others in that radius stay `minor`); else `minor`. Expected 3 / ≤ 11 landmark sites (the spacing rule cuts the western cluster on 415424794 — W1 reports the real count). No quota: a seed may have 0 (report it).
   - Record (dedicated types, not inline unions): `WaterfallSite = { id: WaterfallSiteId; tier: WaterfallTier; top: {x,z,water}; bottom: {x,z,water}; dropM; lengthM; widthM; chainIndex; offsetTopM; offsetBottomM }` with `type WaterfallTier = 'landmark' | 'minor'`. `chainIndex`/offsets are runtime-only (pack order), never persisted.
3. **Identity:** `waterfall:<qx>_<qz>` from the lip (top) point quantized to 🟡 16 m. Reason: the chain index is pack order (061 H5 note: stable only for one hydrology revision; the stable source-chain id is H2 work that waits for Q121-a), so an unrelated chain change elsewhere would renumber every id. The positional id survives that; it changes only if the fall itself moves (then it is a different fall, covered by epoch 1). W1 test asserts uniqueness on both seeds (today 0 collisions); on a collision keep the larger drop and report. This **replaces** world-041's `waterfall:<sourceChainId>:<offsetBucket>` (plan updated). Only landmark sites get catalog ids; minor sites keep the same id form internally (for reservations/tests) but are not catalog entries.
4. **Reserved footprints (review 031 F2, acyclic order):** every site (minor and landmark) reserves the top→bottom polyline buffered by 🟡 `max(12 m, widthM + 8 m)`; landmark sites add a 🟡 20 m pool disc at the bottom. Query `isInWaterfallReserve(hydrologyId, x, z)` + `waterfallReservesIn(rect)` from the same module. Consumers wire it **in their own slices**: world-terrain-063 V1 (Q127) excludes settlement footprints that intersect a reserve; the road crossing owner (`src/settlement/roadRiverCrossing.ts` via `roadNetwork.ts`) treats a reserve as non-crossable in the Q61–Q64 retry. **W1 itself changes no settlement or road output** — it reports today's intersections (settlement footprints, road polylines, bridges) per seed so 063/Q61 know the size of the change.
5. **Presentation contract (W2), budget per site:**
   - **Ribbon whitewater — 0 extra draws.** Re-map `waterfallFactor` so foam starts at the detector onset: 🟡 `0.25 → 0.55` instead of `0.6 → 1.6` (one rule for "steep" in renderer and detector). This also foams short steep segments below 2 m drop (real rapids); accepted as correct, look → §2. Keep the existing `aFall` attribute and `riverWaterMaterial.ts` branch; tune the flow-streak speed by `aFall` so cascades read as fast water. Add a pool-foam term at the bottom of each site via a second per-vertex attribute (distance along chain from the site bottom, fades over 🟡 12 m) — computed from global chain offsets, so both sides of a chunk clip agree.
   - **Spray / mist — landmark sites only:** camera-facing quads around the bottom pool, shader-animated by the existing time uniform (no per-frame CPU), procedural noise with the shared integer lattice hash (`gpHash`, `snowField.ts` `INTEGER_LATTICE_GLSL` — no `fract(sin())`, GPU-specific artifacts memory/Q149), fog on, no shadow casting, depth-write off. Budget: ≤ 1 draw per chunk that owns ≥ 1 landmark site (merged geometry of that chunk's sites), ≤ 48 quads (96 tris) per site, one shared material + no new texture. World worst case ≈ 11 sites, at most ~2 owning chunks resident in view → ≤ 2 draws.
   - **Sound — one shared loop, no per-site emitters:** like the lake frogs (`createAmbientAudio.ts`, `lakeProximityAt`): gain from the nearest site within 🟡 80 m (landmark full, minor scaled by drop), looked up on the existing ambient throttle through a bucket index in `waterfallSites.ts`. **Asset: none in `public/sounds/` (no river/rapids loop)** → ✅ the author supplies the rapids/cascade loop (2026-11-06); W2 visuals land without sound, the loop is wired when the file exists (`docs/assets/SOUNDS.md` then).
   - No new per-frame CPU work, no always-resident meshes; water queries (swim depth, `isWetFloor`, drinking) and ribbon Y (`canonicalWaterHeight`) unchanged — presentation is never a second authority.
6. **Lifecycle:** ribbon attributes are built with the existing per-chunk river ribbon (already chunk-owned and clipped). Spray mesh: owned by the chunk containing the site's **bottom** point (the pool where the spray is) — a deliberate change from the plan draft's "top reach" — created/disposed with that chunk's river build. The site list + bucket index are derived world data (memo per hydrology id, like the landform index), not geometry; dropped with the hydrology install.
7. **Catalog kind (agreed with world-041 L0):** kind `waterfall`, only `landmark` tier, id per decision 3, arrival rule as in world-041 (within 40 m of top or bottom), `LOCATION_KIND_EMOJI` / `MapLocationKind` entries; lands in the `locations-coarse` bump of world-041 L1 (queue Q130), so W3 is that L1 part, not a separate cache bump.
8. **Caches:** W1 none (derived, in-memory, no output change). W2 none persisted (ribbons are built at runtime, no river tile namespace). W3 = Q130's `locations-coarse` bump. `WORLDGEN_EPOCH` untouched (open epoch 1).

### 3. Slices after W0 (queue rows)

| Slice | Row | Model | Gate | Done when |
| --- | --- | --- | --- | --- |
| W1 detection + reserves + census | Q168 | S | — (ready) | `waterfallSites.ts` per §2.2–2.4 with unit tests (synthetic chains across tile boundaries: merge rule, tier spacing, id uniqueness/stability under unrelated chain reorder, reserve query); census script uses it and prints sites per tier + today's settlement/road/bridge intersections per seed; counts in these notes; type-check, lint, vitest |
| W2 presentation | Q169 | S | Q168 (Q125-a ✅ (a)) | §2.5–2.6 implemented; budget check (draws/tris per site in a resident scene); browser screenshots at 2 landmark sites on `415424794` (one thin, one large) + one minor → §2; no swim/wet regression at a site straddling a chunk border |
| W3 catalog | in Q130 (L1 waterfall kind) | S | Q168 | landmark sites in the catalog with arrival rule; covered by Q130's `locations-coarse` bump |

### 4. Stop if (W1–W2)

- A site needs terrain carving to look right, or the author picks plunge falls (→ 060 scarp landform, new plan, Opus).
- Spray needs per-frame CPU or exceeds the per-site budget.
- An id collision cannot be resolved by the "larger drop" rule (two distinct falls in one 16 m cell).
