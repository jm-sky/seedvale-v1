# Review 031 — Geography Revival G1–G9: critical pre-implementation architecture review

- **Date:** 2026-11-04
- **Reviewer:** ChatGPT — independent architectural assessment; bounded reconnaissance was used, final assessment owned by the primary reviewer.
- **Status:** `done` — review complete; corrective work and implementation verification remain outstanding.
- **Evidence baseline:** [`b81cb3db4b08a142dee6729fabc042446574522c`](https://github.com/jm-sky/seedvale-v1/commit/b81cb3db4b08a142dee6729fabc042446574522c).
- **Scope:** the seven plans below, their proposed integration, and current V1 seams in matrix areas 01/02/04/05/13/15/23/27. This is not full system certification.
- **Method:** GitHub source/test/document inspection. No code implementation, plan rewriting, test execution, census, benchmark, browser or visual verification. Published measurements are historical evidence, not reproduced results. V2/V3 donor suitability remains an explicit S0 recon gate; no donor implementation is endorsed here.

## Executive verdict

**REWORK REQUIRED before generator-changing implementation.** Proceed with bounded S0 diagnostics and donor reconnaissance. The product direction G1–G9 is coherent and remains authoritative. Keep V1's current global hydrology, terrain sampler, settlement/road owners and location knowledge. A generator replacement, erosion simulation or new exploration framework is not justified.

The weakness is not the overall relief → climate → hydrology direction. It is the missing executable contract at several boundaries: dry drainage still passes through water-only adapters; climate and catalog gates can run before their inputs are final; and estimated knowledge currently exposes exact canonical positions and names. These are preventable integration failures, not reasons to abandon the program.

Three P1 findings block their affected implementation slices. Six P2 findings require bounded corrections or explicit evidence before the corresponding acceptance gate. One P3 finding concerns conflicting documentation. **No P0 defect established.** Findings distinguish confirmed current behavior/plan conflicts from likely future regressions; none claims that unimplemented code already fails.

### Reviewed plans and disposition

- [tools-026](../plans/tools-026-geography-baseline-diagnostics.md): **READY WITH CONDITIONS** for diagnostics. Keep runtime output unchanged; add measured cost baselines, true route connectivity and explicitly labelled travel estimates (F4/F7/F9).
- [world-terrain-060](../plans/world-terrain-060-macro-relief-ranges-passes-and-landforms.md): **REWORK REQUIRED** at final-input, pass acceptance and later-landform contracts (F2/F5/F9). The inert R0 seam is reasonable.
- [world-terrain-061](../plans/world-terrain-061-macroclimate-and-climate-weighted-hydrology.md): **REWORK REQUIRED**, principally F1/F2; retain global drainage and one final calibration.
- [world-terrain-062](../plans/world-terrain-062-regional-biomes-and-local-precipitation-phase.md): **READY WITH CONDITIONS** for contract work; runtime acceptance waits for final fields and an explicit local surface-weather policy (F2/F8).
- [world-terrain-063](../plans/world-terrain-063-geography-driven-settlement-variants.md): **REWORK REQUIRED** before author-facing variant selection; freeze inputs and router, separate selection topology from realizable roads, isolate variants (F2/F4/F7).
- [world-terrain-064](../plans/world-terrain-064-derived-waterfalls.md): **READY WITH CONDITIONS as a draft**, not executable W1–W3 approval. Resolve eligibility timing, identity and physical/presentation alignment first (F2/F9).
- [world-041](../plans/world-041-landmark-catalog-and-rumour-leads.md): **REWORK REQUIRED before L1/L3 implementation**; its explicitly planned L0 recon may proceed. Existing knowledge is the correct owner, but reuse is not almost free (F3).

## Findings

### F1 — P1 · Dry drainage needs an end-to-end semantic contract, not only a chain flag

**Confirmed current behavior; likely integration regression if the proposed flag is added alone.**

061 H2 stores dry/perennial classification on the existing chain payload. Today [riverNetwork.ts](../../src/terrain/riverNetwork.ts), `RiverChain`, holds points; `riverChannelSegmentsNear` derives positive water width, water height and submerged bed from accumulation. `riverWaterSampleAt` treats those segments as physical water. [worldHydrologyStore.ts](../../src/terrain/worldHydrologyStore.ts), `unpackChains`, and [riverChainClip.ts](../../src/terrain/riverChainClip.ts), `clipChainToRect`, produce point-only chains. Clipping also splits a source chain into multiple pieces.

A flag confined to packed data will be lost. Passing dry chains through current adapters makes them wet obstacles/resources/ribbons; removing them everywhere loses the required dry valley geometry. Also, runoff-weighted accumulation is an effective contributing area, not literal catchment area. Existing width/depth mappings cannot silently keep interpreting new units as old cell counts.

**Minimal correction:** specify one drainage dataset with preserved source identity and class through packing, installation, unpacking and clipping. Derive a terrain-only dry profile separately from the perennial water view; these are projections, not two authoritative networks. Central wet/river-query adapters must exclude dry reaches for water, fishing/drinking/swimming, crossings, placement clearances and map blue. Define raw catchment area versus runoff-weighted area and convert all thresholds/width mappings consistently. Declare how dry-to-wet transitions and lake-outlet overrides remain continuous.

**Acceptance:** synthetic dry/perennial/lake-outlet chains across tile boundaries; class and source IDs survive clone/cache/clip; dry reaches carve but return no river water or crossing; perennial reaches preserve 058 continuity. Verify the same physical result in worker, analytic query and resident terrain paths. Do not rely on a blue-line screenshot.

### F2 — P1 · Several stage gates do not actually freeze the inputs being approved

**Confirmed plan conflicts; likely stale acceptance and recalibration.**

060 R3 adds landforms after R1; 061 C2 is gated only on R2, while H1–H2 correctly wait for R4. Thus C2 may approve climate before crater/basin relief is complete. 062 B1 permits starting after C2, whereas the roadmap places biome integration after H6. world-041 L1 starts after R3 even though lake outcomes are only checked in 061 H5. 064 W1 excludes settlements/roads, but the roadmap puts waterfalls before 063 settles those sites and before road close-out.

063 V3 chooses variants by actual journeys, yet Q61–Q64 may subsequently alter routing. A later route change can invalidate the chosen variant without changing settlement constants.

**Minimal correction:** distinguish inert preview work from integration gates:
1. Freeze final 060 R2 **and R3/R4** relief before C2 approval and H1/H2 calibration.
2. Freeze H6 before accepting river-dependent biome/riparian output and water-dependent catalog entries. Pure lookup/presentation tests can still proceed earlier.
3. Derive waterfall candidates at H5; finalize site eligibility against accepted settlement/road footprints later, or reserve explicit candidate footprints before settlement selection. Pick one ownership direction.
4. Evaluate settlement variants with one pinned, sufficiently correct router. Keep final Q64 export after selection; if subsequent Q61–Q63 work changes reachability or journey rankings, rerun the shortlist before treating G5 acceptance as final.

These are dependency corrections within existing plans, not additional feature plans. Cache versions/fingerprints must change in **each output-changing slice**, as the roadmap says, not only in 060 R4 or 061 H6.

### F3 — P1 · Estimated knowledge currently reveals the true target; generic landmark arrival is missing

**Confirmed current behavior, compatible with today's features but incompatible with naive G7 reuse.**

[mapData.ts](../../src/world/map/mapData.ts), `project`, copies canonical `location.x/z/name` into the map model for **every** knowledge state. `resolveKnown` serves navigation/popovers as well as map rendering. [locationKnowledge.ts](../../src/world/locations/locationKnowledge.ts) stores id/state/source, not independent uncertain geometry.

[locationProximityDiscovery.ts](../../src/world/locations/locationProximityDiscovery.ts), `update`, explicitly discovers caves, settlement boundaries, two authored ruin bindings and the abandoned mine. Adding lake/peak/waterfall entries does not automatically give them an arrival/discovery rule.

world-041 L0 acknowledges these questions; that is a valid recon gate, not proof that L1/L3 are implementation-ready. Replacing the catalog's actual coordinates with a rumour centre would damage canonical discovery/quest targeting.

**Minimal correction:** preserve canonical locations and forward-only knowledge. Put the uncertain **player-facing projection** under the existing knowledge/map ownership: deterministic off-centre area containing the target, generic label, no precise navigation target or popover leak until discovery. Reuse a separate existing search-area entry only with an explicit target relation and completion semantics; do not accidentally count unrelated quest estimates toward the rumour cap. Define bounded proximity checks for each supported natural kind, including whether a lake is discovered from a reachable shore rather than its underwater centre.

**Acceptance:** all map/minimap/navigation/popover consumers see only the allowed projection; target containment, boundary clipping and no-name/no-pin assertions; duplicate rumours do not consume multiple slots; arrival closes the lead and monotonically reveals the same canonical ID; unresolved/stale targets do not leave a permanently full cap; save/load preserves the projection or reconstructs it exactly. Preserve existing quest-owned search areas. No new NPC copy is authored in this review.

### F4 — P2 · Settlement inputs, caches and connectivity need a more accurate contract

**Confirmed current behavior and documentation mismatch; likely wrong variant results without isolation.**

063 describes layout as explicitly without hydrology. [settlementLayout.ts](../../src/settlement/settlementLayout.ts) indeed takes no river query, but receives an arbitrary `sampleHeight`. [worldKnowledgeScan.ts](../../src/terrain/worldKnowledgeScan.ts), `worldKnowledgeRoadContext`, supplies `sampleLandHeightAt`, which already reads global hydrology correction and lake levels through [chunkHeightmap.ts](../../src/terrain/chunkHeightmap.ts). The accurate distinction is **no explicit river suitability in initial selection**, not total hydrology independence.

[settlementPlanCache.ts](../../src/settlement/settlementPlanCache.ts) has a single memoized layout, cell-keyed defs, progression and quest-host caches; river query registration is world-scoped. Hydrated/computed first values win. [roadNetwork.ts](../../src/settlement/roadNetwork.ts) similarly caches routes. A matrix runner changing only constants/weights in one realm can inadvertently reuse a previous variant. Installed climate alone does not solve this.

[scripts/perf/census-spacing.ts](../../scripts/perf/census-spacing.ts) counts components over layout adjacency; its road check counts settlements with no roads. Zero isolated vertices and one proposed graph component do **not** prove one component of successfully routed roads.

**Minimal correction:** V1 notes should inventory main/worker/tool construction and require identical installed geography before layout use; never fall back silently to an analytic proxy in only some realms. If a proxy is chosen, label it as a ranking heuristic and validate real water access separately. Isolate each variant in a fresh context/process or reset all affected caches and include override identity in cache keys. Compute final connectivity over successful, traversable route edges and report selected, defined, and connected counts separately. Final site probes and promoted sizes, not nominal cell centres, must satisfy footprints and spacing.

**Acceptance:** A→B→A variant execution gives identical A; main/worker/cold/hydrated definitions match; failed crossings cannot pass connectivity; progression and authored quest hosts remain available. This extends existing owners rather than adding a settlement-density service.

### F5 — P2 · “Local re-census only” after later landforms is unsound

**Confirmed algorithmic mismatch; impact magnitude remains unmeasured.**

060 Coordination and the architecture proposal allow later terrain packages with only local re-census; the proposal additionally suggests a ~5% global metric allowance. [worldHydrology.ts](../../src/terrain/worldHydrology.ts), `computeWorldHydrology`, globally floods, labels/breaches pits, selects lake spill points, computes D8 flow and accumulates downstream. A local change at a divide/spill can reroute distant reaches. Area-based initiation thresholds do not make drainage topology local. Small global length changes can still destroy one important settlement crossing or catalog lake.

**Minimal correction:** every terrain-changing later package recomputes global hydrology and reruns inexpensive global invariants plus changed catchment/site/route/catalog identity checks. Local expensive visual inspection is reasonable after the impact set is known. Keep P2 terrain out of the current seven-plan scope; before epoch closure decide whether it must join epoch 1 or explicitly accept a later compatibility boundary. Do not force it into this batch just to satisfy this review.

### F6 — P2 · Epoch 1 is a batch policy, not protection between intermediate builds

**Confirmed compatibility limitation; no claim of observed save corruption.**

060 says old saves are already refused. [worldgenEpoch.ts](../../src/persistence/worldgenEpoch.ts) is 1, and [saveData.ts](../../src/persistence/saveData.ts), `loadStoredSave`, rejects an epoch **mismatch**. A save made by an earlier epoch-1 generator has the same epoch as a later one and is accepted. Cache invalidation does not migrate persisted NPCs, terrain edits, trees, buildings, quest locations or travel checkpoints. Stable cell-based IDs also do not imply an unchanged position or role.

**Minimal correction:** record that intermediate epoch-1 saves are disposable test saves, with fresh-world QA for generator-changing slices and same-build save round-trip/rebuild checks. Rollback must pair a code revision with compatible test saves and regenerated caches; commit reversibility alone is insufficient. If continued compatibility of intermediate saves is required, seek explicit author approval for a generation-revision refusal policy; do not silently add another epoch or a broad migration framework.

**Acceptance:** pre-epoch saves refused; current-build saves round-trip; stale fixtures/cache entries cannot win; A→B world rebuild drops old geography; same-build stream/unload/reload preserves IDs, knowledge, cargo and ownership. Existing save tests demonstrate epoch refusal, not compatibility across different generators sharing epoch 1.

### F7 — P2 · Performance criteria omit the expensive paths and variant simulation workload

**Confirmed measurement gaps; performance regression is a risk, not a measured fact.**

The current grid is 1537² over ±6144 m, not the historical 8 km frame. [worldHydrologyRuntime.ts](../../src/terrain/worldHydrologyRuntime.ts) samples strips in workers, then computes hydrology on the main thread. [058 notes](../plans/implementation-notes/world-terrain-058-finite-continent-and-global-hydrology-implementation-notes.md) report 6.63/6.79 MiB per installed payload after Q96. Those are payload numbers, not peak process memory or current benchmark results.

061's analytic climate includes a raw-height query. `sampleRawFloorUncorrected` currently evaluates the full uncorrected texel path, including noise fields. Repeating it for runoff after building the floor, or separately for every biome/weather consumer, is not “one multiply” in total. A ≤0.6 MB coast grid is only one component. 060's 512 m bucket size alone does not prove ≤2 profile evaluations or bounded range-segment work. Retaining dry chains also means fewer **wet** chains need not reduce total payload.

063's count variants alter simulation workload: 28 versus 22 sites is about 27% more selected settlements, before size/household distribution. A fixed camera benchmark does not establish offscreen scalability.

**Minimal correction:** S0 records cold/warm boot, sampling/compute/install time, payload and peak transient memory, worker count and copies, chunk-generation timing, map raster cost and settlement/route computation. Reuse already sampled floor values for the hydrology runoff pass; keep a bounded shared climate query and explicit descriptor overlap/segment bounds. Use cheap variant rejection before expensive full routes, then fully measure shortlisted candidates. Record households/NPCs/active transport and representative offscreen/skip workload without reducing simulation.

**Acceptance:** reproducible production-build configuration, seed/commit/cache state, repeated samples and declared tolerances; compare cold to cold and warm to warm. Separate matched technical workloads from changed-world gameplay workloads. Measure final combined result and densest vegetation region. “Not slower beyond noise” needs a defined protocol; raw payload size and average FPS alone are insufficient. No SharedArrayBuffer, GPU climate service or broad worker rewrite is warranted absent measurements.

### F8 — P2 · Local precipitation phase and local snow cover are not the same function

**Confirmed owner separation; likely visual/simulation disagreement if only a shader bias is added.**

062 W1 appropriately requires entity/site positions for simulation. However, [weather.ts](../../src/world/weather.ts), `computeSurfaceWeather`, reconstructs visual wetness/snow using a bounded weather-history replay; [snowField.ts](../../src/terrain/snowField.ts) maps that global snow amount onto terrain and grass with matching TS/GLSL functions. W2 proposes latitude/altitude/temperature bias, while 061 climate can also contain maritime, regional noise and orographic variation.

A current-temperature bias over global snow history does not by itself specify what happens when the same global rain becomes local snow, or after warm/cold transitions, time skip and reload. Latitude-only rendering can disagree with local climate in rain shadows or at the coast. This is a missing contract, not an argument for persistent regional weather simulation.

**Minimal correction:** W1/W2 define the reference temperature, lapse application exactly once, phase threshold and deterministic local visual snow policy over the existing weather timeline. Either share sufficiently equivalent static climate inputs with terrain/grass or document and obtain acceptance for an approximation. Preserve global event frequency and no player-position simulation coupling. Limit migration of condition/well/sleep consumers to approved temperature/phase consequences; new precipitation-frequency or broader ecology changes remain outside G3.

**Acceptance:** same seed/day/site gives the same phase and surface after reload/skip; north snow and south rain in one global event; mountain/coast/rain-shadow boundaries; grass and terrain agreement; offscreen consumers use their own sites. Existing TS/GLSL snow twins are a useful seam to extend.

### F9 — P2 · Passes, waterfalls and shorter journeys need physical acceptance, not only descriptors

**Confirmed existing movement constraints; likely quality failures remain unverified.**

060 requires ≥1 pass per range and one browser crossing. [slopeConstraint.ts](../../src/terrain/slopeConstraint.ts) slows uphill movement above 35° and removes its uphill component at 55°, using metre-scale probes; resident sampling also waits at unavailable terrain. [roadNetwork.ts](../../src/settlement/roadNetwork.ts) routes using terrain/ridge and crossing costs. A lowered saddle or connected proposed graph does not establish a usable corridor after hydrology, road shaping, pads and streaming.

064's “real drop” must be evaluated against the water/bed profile actually shipped, not just raw relief. 058 notes already distinguish smoothed chain elevations from corrected ground. A falling sheet is presentation; it cannot become a second authority for swim depth or navigation.

**Minimal correction:** distinguish protected landmark footprints from **traversable pass corridors**; blanket avoidance must not exclude the intended crossing. Validate route approaches, width and final grades in both directions. For falls, define top/bottom reach, source-chain identity independent of clipped tile ordinal, water-query behavior and owner-chunk lifecycle; keep correction/carving in the terrain/hydrology owner.

D3/V3 distance÷speed is a useful labelled estimate, not actual travel time. Keep it for the matrix, add sampled grade/detour checks and timed walkthroughs for shortlisted routes, including the author's confirmed left-road route. Do not generalize a single offscreen travel formula: [transportOffscreen.ts](../../src/world/transportOffscreen.ts) explicitly retains straight-line estimates for legacy same-settlement/resource-site handoffs and excludes cross-settlement generic-travel legs from that clock.

**Acceptance:** representative player/NPC/fauna traversals across passes and falls; wet/dry/navigation agreement at unloaded boundaries; no forced fall quota; settled route connectivity and quest-host reachability. Assess landmark silhouette from reachable paths within existing fog distance. A map feature's count or name is not proof the player will encounter it organically.

### F10 — P3 · Starting-point claims should use current code and superseding decisions

**Confirmed documentation drift.**

063 repeats XL within ~1.5 km from the older Brief, but [settlementProgression.ts](../../src/settlement/settlementProgression.ts) uses graph-hop policy and `SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M = 4000`; its tests exercise that policy. [continentMask.ts](../../src/terrain/continentMask.ts) uses half-extent 6144 m. The older Brief still describes an 8×8 km world. These are not grounds to silently change either gameplay rule.

030 follow-ups must also be read as history: current runtime and [worldHydrologyRuntime.test.ts](../../src/terrain/worldHydrologyRuntime.test.ts) already implement/test single-world retention. Do not reopen its old leak finding as an unfixed blocker. Q109 remains an integration prerequisite at this baseline.

**Minimal correction:** cite current 059 progression/scale decisions and record any unresolved product discrepancy before calibrating guarantees. Correct narrow plan starting points and reconcile queue/roadmap gates when plans are revised. Do not rewrite unrelated historical documents as part of this review.

## Recommended architecture and alternatives

Keep a small acyclic extension of existing owners:

1. Seed/config → range/pass descriptors and descriptor-free base relief → bounded natural landform overlays → immutable unconditioned floor.
2. That floor + seeded climate parameters → static climate/coast data. Global hydrology consumes floor and runoff; it never requests settlement/road data or river-derived biome moisture.
3. Hydrology yields conditioned relief, lakes and one classified drainage dataset. Terrain-only dry profiles and perennial wet queries are separate projections of it.
4. Environment classification reads climate and final water. Settlement candidate ranking reads geography; actual site/progression validation then produces defs; roads read those defs and canonical physical water.
5. Catalog entries bind existing natural facts to stable canonical IDs; player knowledge projects uncertainty without rewriting those facts. Weather reads static climate and global time; it never regenerates geography.

**Prefer the smallest viable implementation.** Begin with a few bounded spines, existing relief detail and sparse overlays. Start climate with latitude, lapse, existing regional noise and coast distance; add orographic complexity only when previews show a demonstrated need. Compute climate before installing the combined hydrology payload: “same lifetime” must not mean “query a payload not yet installed.” Keep raw-floor evaluation independent of the climate/biome projection. Current raw sampling does not already have a biome-weight recursion; this is a guard against introducing one.

Two bounded alternatives are credible:
- **Analytic settlement ranking proxy:** cheapest and realm-simple, but not evidence of real freshwater access or road reachability. Use only with final physical validation.
- **Explicit shared climate/hydrology-backed ranking:** better match to G5, at the cost of boot/install discipline and query cost. Prefer this where the existing hydrology install already makes the data available; do not create a second layout service.

Neither requires a central “geography manager”, full tectonics, seasonal rivers, per-frame climate simulation or V3 generator transplant. Donor policy/shape ideas must pass tools-026 D5 first.

## Verification and acceptance packet

Existing tests are useful but narrower than the proposed change. Inspected examples include hydrology cache/strip/retention tests, road crossing and route hydration tests, settlement progression lookup-order tests, epoch refusal tests and location proximity tests. They were **read, not run**.

Add or extend tests at the existing owners, rather than creating a broad duplicate suite:
- Dry/perennial class and unit propagation through generation → packing → cache/worker → tile clipping → water/carving/query.
- Empty-descriptor exact equivalence; finite support and boundary continuity; candidate and request-order independence; changed config changes identity; cold/warm/worker parity.
- Climate without installed hydrology; no corrected-floor/climate recursion; coherent local phase/snow over skip and reload.
- Isolated variant A/B/A, successful-road component census, final-site footprints, progression and quest-host availability.
- Rumour containment and privacy, canonical-ID deduplication, open-cap semantics, arrival transitions and serialization.
- Same-build save/rebuild and stream continuity; stale cache/fixture rejection; source and destination cargo/ownership retained during representative travel.

Use two reference seeds plus the planned small spot-seed panel. Do not turn proposed global targets into universal hard guarantees without measured feasibility. Latitude-band temperature monotonicity is diagnostic, not sufficient realism: differing elevation distributions can reverse a band mean while the underlying latitude effect is correct. Report both elevation-adjusted tendency and actual biome/relief appearance. Likewise a parallel-channel detector is a triage aid, not proof of an artifact.

The final packet needs gameplay-mode maps, in-world reachable viewpoints and representative traversals. Keep proposed river density, dry-interfluve, journey and wilderness targets separate from measured baselines and author-approved values.

## Corrections in priority order

1. Resolve F1's drainage units/class/query contract and F3's uncertain knowledge/discovery contract before their implementation.
2. Correct the dependency gates in F2; identify one immutable input revision for each author preview/shortlist and each cache-changing slice.
3. Specify F4's settlement realm/cache contract and actual-road graph census; isolate V0 variants.
4. Replace local-only later-landform validation with F5's global recompute/invariant policy; document F6's intermediate-save and rollback boundary.
5. Add F7's bounded cost measurements, F8's local surface-weather contract and F9's physical traversal checks to the existing slices.
6. Reconcile F10's scale/progression references. No separate implementation task for each observation is requested.

## Decisions reserved for the author

**Already required by G1–G9:** G8 relief/shape after S0; climate/arid appearance and numeric targets; G5 shortlist; new NPC scripts; eventual epoch-batch closure. G9 separation remains unconditional.

**Only if a conflict materializes:**
- Whether intermediate epoch-1 test saves must survive generator changes. Default recommendation: disposable test saves during the open batch, not a new compatibility subsystem.
- Whether later terrain-shaping P2 content must land before epoch closure or may require a later compatibility boundary.
- A meaningful visual approximation in local snow/climate, missing traversal/settlement guarantee, or workload regression requiring a product compromise.
- Any unresolved contradiction between older product wording and superseding 059 scale/progression decisions, after locating that decision provenance.

Dry-chain adapter design, cache isolation, final-input gates and global invariants are routine technical corrections, not decisions to send back unnecessarily.

## Final implementation assessment

**Do not execute the seven plans as an automatically approved chain.** Start tools-026 diagnostics/recon and the explicit contract work; keep generator-changing and rumour-delivery slices gated by the findings above. After focused corrections, review the amended contracts and evidence; there is no architectural reason to replace V1 or reopen G1–G9.

This report and its index links change documentation only. No plans were approved or rewritten, no product decisions changed, and no runtime, visual or performance result was manufactured.
