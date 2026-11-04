# Geography donor recon — waterfalls, rumour leads, summits and passes (tools-026 D5)

**Date:** 2026-11-04 · **Author:** Claude Opus 5.5 (queue Q115) · **Type:** read-only research, no code copied
**Pins:** V1 `main` `905a3978` · V2 [`jm-sky/seedvales-v2@9ba54815`](https://github.com/jm-sky/seedvales-v2/tree/9ba54815) (= V2 `main` HEAD, 2026-10-08) · V3 [`jm-sky/seedvale-v3@47733d6b`](https://github.com/jm-sky/seedvale-v3/tree/47733d6b) (local `../seedvale-v3`, clean)
**Feeds:** [tools-026 §D5](../../plans/tools-026-geography-baseline-diagnostics.md#d5--donor-recon-o-read-only) → Q116 baseline packet, Q125 ([world-terrain-064](../../plans/world-terrain-064-derived-waterfalls.md)), Q118 ([world-terrain-060](../../plans/world-terrain-060-macro-relief-ranges-passes-and-landforms.md)), Q129 ([world-041](../../plans/world-041-landmark-catalog-and-rumour-leads.md))

Legend: ✅ verified in code at the pin · 🟡 inference · ❓ open.

## Summary

| Donor topic | Verdict | One-line reason |
| --- | --- | --- |
| **V2 waterfall** (G6) | **skip — does not exist** | ✅ No waterfall code, asset, shader or sound in V2 at the pin (`git grep -i waterfall` → only an unrelated word in `PROGRESS.md`). The real donor is **V1 itself** (plan 181 `waterfallFactor`), already ported to V3. |
| **V1/V3 waterfall factor** | **adopt (V1 is the owner)** | ✅ Per-vertex whitewater signal from rise-over-run on the existing river ribbon; zero extra draws. With V1 relief (max 33/38 m) it almost never fires — G6 needs genuine drops from relief/hydrology, not a new renderer. |
| **V2 rumour → approximate area** (G7) | **adapt policy, skip store** | ✅ Small, deterministic, matches G7 (a) exactly; V1 already has the knowledge states and an NPC place-telling owner, but **no per-lead off-centre area** and no `estimated` producer. |
| **V2 landmarks** (G6 catalog, bonus) | **adapt placement rules** | ✅ Rule table (count, min distance to settlements/roads, footprint slope, biomes, "within road/town" bias) — a cheap template for world-041 L1 dry kinds. |
| **V3 mountain range + barrier arc with a pass** (G8) | **adapt shape idea, skip generator** | ✅ One seeded massif + one concentric barrier arc with one pass notch, pointwise (window-independent). Good shape language for 060 range spines; heights are 6× V1 and the generator is not V1's. |
| **V3 "carved passes"** (G8) | **re-scope: they are river gorges, not road passes** | ✅ V3 has **no road network**. Its "passes" are hydrology mountain breaches (cut ≤ 50 m, ≤ 180 cells) that let rivers leave massifs. Road-over-pass behaviour must come from V1's own router (+ V2's slope cost as reference). |
| **V2 road slope cost** (G8, bonus) | **reference only** | ✅ A* cost `len · (1 + (9·slope)²)`, hard block at slope > 0.4, ×2.5 on mountain biome, 48 m moving-average grade. V1's router (Q44) already owns routing; use as a calibration reference for pass-corridor grades (060 R4). |

## 1. Waterfall (G6)

**V2:** ✅ nothing to take. Searched the whole tree at `9ba54815` (1601 paths; no `waterfall`/`cascade`/`whitewater`/`foam`/`rapids` identifiers in `src/`). V2 `main` has no commits after the pin. The "waterfall seen" in V3 [`docs/comparison/README.md`](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/docs/comparison/README.md) and decision D-CMP-9 ("rivers and waterfall from v2") 🟡 most likely describe V2's steep mountain river surfaces (V2 `banks.test.ts`: "mountain rivers fall steeply along the bank") read as falls — a look, not a feature. The proposal's "V2 waterfall" premise is therefore void.

**V1 (current owner):** ✅ [`src/world/riverGeometry.ts`](../../../src/world/riverGeometry.ts) L103–122 + [`riverWaterMaterial.ts`](../../../src/world/riverWaterMaterial.ts) L131+:

- `waterfallFactor(prev, p)` = clamp((drop / horizontal distance − 0.6) / (1.6 − 0.6)), per ribbon vertex (`aFall` attribute).
- Shader blends the same ribbon toward churning near-opaque foam (`mist` pattern, faster time scroll). No new geometry, object, particle, sound, collision or interaction.
- Cost: one float attribute per vertex + a few ALU ops in an existing material. Zero draws added.
- Placement: fully derived from the chain's cached `elevation` (hydrology), never authored.

**V3:** ✅ [`src/game/render/riverRibbon.ts`](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/render/riverRibbon.ts) L26–30, L128–135, L255 is an explicit port of the V1 function with identical thresholds. Nothing new to take back.

**Fit with G6 / world-terrain-064:**

- ✅ Thresholds 0.6–1.6 rise/run are 31°–58°. Q112 measured ≥ 20° slopes on ≈ 0.1–0.2 % of land and max land heights 33.1/38.3 m — so on current relief the factor is effectively dormant. 🟡 A waterfall needs a real step in the chain profile (060 landform/scarp descriptor) **before** this signal shows anything; matches 064 "no genuine drops / needs carving" stop-if.
- What V1 lacks for a "landmark" waterfall (064 W1–W3 scope, not donors): a vertical sheet geometry at the lip (the ribbon is a near-horizontal strip — a 5 m drop over one 8 m step renders as a steep ramp), splash/mist at the pool, sound emitter, catalog location (`waterfall` kind). No donor exists for any of these in V2 or V3.
- **Recommendation for 064 W0:** keep `waterfallFactor` as the rapids/whitewater signal; the derived-waterfall detector reads the same chain elevations (single source); a lip sheet + sound are new V1 work, sized per waterfall (a handful per world → negligible draws).

## 2. Rumour → approximate area (G7)

**V2:** ✅ [`src/game/sim/rumours.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815/src/game/sim/rumours.ts) (149 lines) + `rumours.test.ts`.

| Policy item | V2 value | Notes |
| --- | --- | --- |
| Gate | NPC `opinion ≥ −10` | same gate as old tales |
| Per-NPC rate | one rumour per NPC per game day (`px.rumourAsked[npcId] = day`) | |
| Open-lead cap | 4 unconfirmed | refusal line "You have enough leads already" |
| Distance band | 600–4500 m **straight line from the player** | < 600 m "you'd see it anyway" |
| Pick | **nearest** eligible candidate (deterministic, no weighting) | |
| Candidates | unknown settlements, unexplored landmarks, caves, predator dens, ore deposits, merchant towns (`s:`/`m:` of one settlement mutually exclusive) | |
| Area | circle r ∈ [120, 260] m, centre offset 0.15–0.6 r at a random angle; RNG = `hash(seed:rumour:id)` → stable per world + target | |
| Phrasing | generic kind text ("a cave in the rock", "an old place (stone circle)"), compass word + "about X km" | never the proper name |
| Confirmation | rumour dropped when its **true** spot becomes explored (fog-of-war cell) | pruned lazily on the next ask |
| Special path | "Where is the next settlement?" always answers (no cap, no daily limit) — the way out of the start valley | |
| Persistence | `px.rumours[]` = {id, kind, x, z, r, tx, tz, text, day} | true position stored in the save |

**V1 today:** ✅

- Knowledge store: [`locationKnowledge.ts`](../../../src/world/locations/locationKnowledge.ts) — `estimated → discovered → confirmed`, forward-only, sources `exploration | npc | book | map`; persisted (`saveData.ts` `MAP_CONFIDENCE_VALUES`). **No runtime producer of `estimated`** (only `discovered`/`confirmed` reveals; `drawMap.ts` already renders `estimated`).
- Area: `WorldLocationArea { shape: 'circle'; radius }` lives on the **location** (catalog), centred on the true `x/z` — used by `searchArea` quests (quests-progression-039). There is **no per-lead offset centre**.
- NPC place-telling owner: [`guardLocalKnowledge.ts`](../../../src/world/locations/guardLocalKnowledge.ts) (guard research delay, reveal min/max, landmark pool by `discoveryWeight`, bands `near/medium/far` in **travel hours** via `locationDiscovery.ts`) and the delivery seam `npcPlayerFollowUpDelivery.ts`; merchant map via `revealLocationKnowledge.ts`. These reveal `discovered`.

**Verdict — adapt the policy, not the store:**

1. Do not add a second rumour store (V2 `px.rumours`). A lead = `reveal(id, 'estimated', 'npc')` + a deterministic display circle derived from `hash(seed, 'lead', locationId)` (V2 `rumourCircle` formula) — 🟡 computed at draw time, so nothing positional needs persisting; only the entry exists. This is the "uncertain-knowledge projection" world-041 L0 must specify (review 031 F3).
2. Bands in travel hours (V1 `classifyRange`), not V2's straight metres — V1 already decided hours (Q113 gives route-weighted estimates).
3. Keep V2's cap (3–4 open `estimated` from `npc`), per-NPC daily limit and opinion gate; pick by V1 `discoveryWeight` within band rather than V2's pure nearest (V1 pools already exist).
4. Confirmation: V1 proximity discovery (`locationProximityDiscovery.ts`) already upgrades to `discovered/confirmed` — the forward-only rank makes it automatic. Count of "open leads" = `estimated` entries with source `npc`.
5. Keep "next settlement" as an always-available path (V2's escape valve); 🟡 overlaps V1 guard dialogue — L0 decides which owner gets it.
6. Text: V2 strings are reference only; all new lines are Astra's (Brief 2026-11-02).

❓ For L0: existing V1 guard reveals are `discovered` (exact) — should guard answers stay exact while casual NPCs give `estimated` leads? This is a G7 (a) detail, not a donor question.

## 3. V2 landmarks (G6 catalog, bonus finding)

✅ [`src/game/world/gen/landmarks.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815/src/game/world/gen/landmarks.ts): rule table per kind — `count`, footprint `radius`, `minSettlement` (250–600 m), `minRoad` (0–50 m), `maxSlope` on the footprint ring (m), allowed `biomes`, optional `withinRoadM` / `withinTownM` quest bias. Kinds: stone circle ×5, house ruin ×8, estate ruin ×3, shipwreck ×4 (beach), boat wrecks on banks. Deterministic per seed + `GEN_VERSION`.

**Verdict: adapt** the rule-table shape for world-041 L1 dry kinds (separation from settlements matches G9 "always separate"). Not geological landmarks (crag, caldera, summit) — those come from 060 descriptors. Counts are V2-world-specific.

## 4. Summits, ranges and passes (G8)

**V3 relief** ✅ [`heightfield.ts`](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/world/gen/heightfield.ts) (175 lines; ported from V2 `heightfield.ts`, which has the same main range without the barrier), preset `hybrid` in [`config/terrain.ts`](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/config/terrain.ts):

- **Main massif:** one seeded centre biased north (`mountainCentre`), anisotropic elliptical mask (x·1.1, z·1.8) + fbm edge noise; ridged noise `ridge^ridgeExp · ridgeAmp · mask + 25 · mask`. V2: `ridge^1.6 · 320`. V3 hybrid: `ridgeExp 0.9`, `ridgeAmp 470`, pointwise 96 m blur + smooth fold → measured peaks ≈ 217 m, foothill slope p99 1.48 (V2: 5.0).
- **Barrier arc** (D-M2-27, V3 only): arc concentric with the continent (radius 0.27 · 8192 m, span 1.2 rad) placed opposite the massif ± seeded offset; core half-width 0.03 + falloff 0.05; amplitude 0.55 × main; **one pass**: a notch `1 − 0.7 · smoothstep(0.08 rad)` at a seeded angle in the middle 60 % of the span. Test ([`barrier.test.ts`](https://github.com/jm-sky/seedvale-v3/blob/47733d6b/src/game/world/gen/barrier.test.ts)): arc ≥ 60 m above the lowland mean, pass height < 60 % of that rise, < 20 % overlap with the main range, sheltered valley ≥ 80 % land.
- All pointwise (each cell = f(world position, seed)) → chunk-safe, matches V1's per-chunk sampler model.
- Lowland relief (rolling/knolls/ridges by a "hilliness" region) is damped by `1 − mountainMask` — mountains and hills never stack.

**V3 "carved passes":** ✅ `config/world.ts` `LAKE.mountainBreachMaxCutM 50` / `mountainBreachMaxLenCells 180` + `hydrology.ts` L373 — a pit inside the mountain mask is first breached (graded path, flanks at `breachSideSlope 0.5` ≈ 27°), else becomes a tarn. Effect measured there: rivers crossing massifs 2 → 12 per 40 seeds, gorges up to 50 m deep. This is **hydrology carving for rivers**; V3 has no road network (no `roads.ts`; "road" only in config/structures).

**V2 roads over relief** ✅ [`roads.ts`](https://github.com/jm-sky/seedvales-v2/blob/9ba54815/src/game/world/gen/roads.ts): A* on the 8 m grid, step blocked above slope 0.4 (≈ 22°), cost `len · (1 + (9·slope)²)`, mountain biome ×2.5, water +220, then a 48 m moving-average target grade with terrain flattening along the road. Roads cross ranges only where the grid offers ≤ 22° steps — 🟡 passes emerge from the cost, they are not designed.

**Verdict for world-terrain-060 (Q118):**

| Idea | Verdict | Why |
| --- | --- | --- |
| Range as anisotropic mask around a seeded spine/centre, mountains damping hills | **adopt idea** | proven look, pointwise, matches proposal "range spines" |
| Barrier arc + explicit seeded pass notch, with a test asserting pass depth vs crest | **adopt idea + test shape** | gives the guaranteed ≥ 1 pass per range that 060 needs; the test is a ready acceptance template (crest rise, pass ratio, overlap) |
| V3 numbers (`ridgeAmp 470`, peaks ~217 m, 50 m gorges) | **skip** | V1 land max is 33/38 m (Q112); heights are G8's author decision after measurement, not a donor import |
| Ridge blur + smooth fold (`ridgeSoft`) | **adapt if** 060 shows needle peaks | it trades 5 extra noise evals per mountain cell for p99 slope 5.0 → 1.48 — measure sampler cost first (060 R0 notes cost) |
| Mountain breach for rivers | **defer to 061** | only relevant if 060 ranges trap rivers; V1 hydrology already has breach-then-lake — compare there |
| Road pass behaviour | **V1 router** | no donor; V2 slope cost is a calibration reference for 060 R4 "pass-corridor grades both directions" |

## 5. What this changes downstream

- **Q116 (D6):** state that the G6 waterfall donor is V1's own `waterfallFactor`; V2 has none. G8 comparison image: V3 `hybrid` relief (peaks ~217 m on 8192 m) vs V1 (33/38 m max) — the author picks height/shape knowing this ratio.
- **Q125 / world-terrain-064 W0:** drop "V2 waterfall" as a source; detector = chain elevation steps; new V1 work = lip sheet, pool mist, sound, catalog kind.
- **Q129 / world-041 L0:** start from §2 points 1–6; the missing pieces are the `estimated` producer and the per-lead display circle, not a new store.
- **Q118 / world-terrain-060:** take the barrier-pass test shape as R1 acceptance; heights from G8.
