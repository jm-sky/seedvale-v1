# Geography S0 baseline packet (tools-026 D6)

**Date:** 2026-11-04 · **Author:** Claude Opus 5.5 (queue Q116) · **Type:** measured baseline + target review for the author
**Code:** V1 `main` (censuses at `e9cd9a1c`…`f03dc42d`; no generator change between them) · seeds `42` and `415424794` · WSL/Node headless only
**Inputs:** D1 Q111 river network · D2 Q112 relief ([JSON](./census-data/2026-11-04--relief-census.json), transects `census-data/relief-transect-*.csv`) · D3 Q113 travel ([JSON](./census-data/2026-11-04--travel-census.json), `travel-routes-*.json`) · D4 Q114 [previews](./continent-previews/) · D5 Q115 [donor recon](./2026-11-04--geography-donor-recon.md) · D7 Q131 [cost baseline](./2026-11-04--q131-cost-baseline-boot.md) · author decisions [G1–G9 + Q114 feedback](./2026-11-04--geography-exploration-author-decisions-g1-g9.md)

Legend: ✅ measured (command in the source row) · 🟡 inference/estimate · ❓ open. All hours are **estimates** = distance ÷ speed (player 6 m/s = 180 m per game hour, NPC 3.6 m/s), not timed walks. Nothing here approves a target; the author column stays empty until §3 is answered.

## 1. Measured baseline

### 1.1 Rivers (D1 — `pnpm worldgen:rivers:census --network --stream-m2=960,1920,3840,7680`, re-run 2026-11-04)

Uniform runoff (every land cell = 1), production threshold = 960 m² (15 cells of 8 m).

| Seed | initiation area | stream km / land km² | heads | dry land > 300 m from any stream | trunk systems ≥ 8, top length | parallel "artifact?" pairs |
| --- | --- | --- | --- | --- | --- | --- |
| 42 | **960 (production)** | **12.21** | 2277 | **0.2 %** | 8+, 7.1 km | 0 |
| 42 | 1920 | 9.70 (−21 %) | 1622 | 0.2 % | 8+, 6.7 km | 0 |
| 42 | 3840 | 7.60 (−38 %) | 1167 | 0.4 % | 8+, 5.6 km | 0 |
| 42 | 7680 | 5.56 (−54 %) | 786 | 0.9 % | 8+, 4.6 km | 0 |
| 415424794 | **960 (production)** | **11.58** | 2301 | **0.2 %** | 8+, 8.3 km | 1 |
| 415424794 | 1920 | 9.17 (−21 %) | 1639 | 0.2 % | 8+, 7.0 km | 0 |
| 415424794 | 3840 | 7.13 (−38 %) | 1159 | 0.3 % | 8+, 6.1 km | 0 |
| 415424794 | 7680 | 5.19 (−55 %) | 779 | 0.6 % | 8+, 4.9 km | 0 |

Also ✅: land 34.8 / 36.4 km²; lakes 16 / 20 after Q96 (`lakeMinCells 600`); hydrology payload 6.63 / 6.79 MiB per copy; sample + compute ≈ 4.3 s per seed (Node). Images: `continent-<seed>-standard-relief-routes-e9cd9a1c-streams-{480,960,1920}.png`. **Author (Q114): prefers the 1920 m² look.**

### 1.2 Relief (D2 — `census-continent.ts --relief`, 16 m grid)

| Seed | height p50 / p90 / p99 / max (m) | slope < 5° / 5–10° / 10–20° / 20–30° / ≥ 30° (% land) | top peaks (height / prominence, m) | ridge-gated land (proxy) |
| --- | --- | --- | --- | --- |
| 42 | 5.6 / 9.4 / 15.3 / **33.1** | 59.0 / 36.7 / 4.3 / 0.07 / 0.01 | 33.1/32.6 · 29.6/26.5 · 27.4/25.9 · 25.4/19.9 | 11.3 % in **40** blobs; largest 0.45 km², 1.9 km extent |
| 415424794 | 5.5 / 9.6 / 17.0 / **38.3** | 57.9 / 37.3 / 4.6 / 0.15 / 0.03 | 38.3/37.9 · 33.5/28.6 · 33.2/28.8 · 33.2/29.1 | 14.3 % in **37** blobs; largest 0.94 km², 2.3 km extent |

Reading ✅: no coherent range exists (largest gated blob ≤ 2.3 km long, dozens of separate blobs); peaks are isolated hills of 25–38 m prominence; steep ground (≥ 20°) is 0.1–0.2 % of land, so "dramatic summits" are practically absent. Author (Q114): mountain look in the previews is OK. For scale, V3 `hybrid` peaks are ≈ 217 m on an 8.2 km world with foothill slope p99 1.48 (D5 §4).

### 1.3 Settlements, roads, travel (D3 — `pnpm worldgen:travel:census`)

| Seed | sites / layout edges / **routed** edges | routed components (sizes) | road polyline p50 / p90 (m) | player est. p50 / p90 (game h) | land within 2 h / 5 h of a site | wilderness > 5 h |
| --- | --- | --- | --- | --- | --- | --- |
| 42 | 22 / 27 / **18** | **4** (13·6·2·1) | 1666 / 2205 | 9.9 / 12.9 | 21.3 % / 89.1 % | **10.9 %** |
| 415424794 | 22 / 30 / **19** | **4** (10·10·1·1) | 1535 / 2130 | 8.9 / 12.3 | 22.5 % / 86.4 % | **13.6 %** |

Author route (415424794, "left road from home"): home → `-4_-2` (MD), polyline 1429 m, ratio 1.04, 5 river crossings, ≈ 8 game h ≈ **4 real minutes at 6 m/s**. ✅ The road is almost straight — "too long" is distance (or its time cost), not a detour.

### 1.4 Cost and workload (D7 — see the [Q131 note](./2026-11-04--q131-cost-baseline-boot.md) for protocol and tolerances)

Browser boot ready: cold 41–75 s, warm 22–31 s; hydrology compute 0.6–0.75 s (Node) plus 3.6–4.4 s sampling; chunk tile p50 ≈ 7 ms (bare); workload 22 settlements, 83 / 94 households, 153 / 181 NPCs (42 / 415424794). Not measured: worker peak memory, map raster, live transport legs (need a runtime hook).

## 2. Feasibility findings (what the numbers say about the proposed targets)

1. **Dry interfluves cannot come from the stream threshold.** Even 8× the production area (7680 m², −55 % density) leaves ≤ 0.9 % of land > 300 m from a stream. With uniform runoff the network fills every valley; streams are ~100–200 m apart. A 35 % dry share needs **regional** dryness (061 climate runoff + "dry drainage" valleys that are not water) — not a single threshold. 🟡 The proposal's 35 % is untested; it becomes measurable only after 061 C2.
2. **Author's 1920 m² preference ≈ −21 % density**, while the proposal's "⅓–½ of current" ≈ −50…−67 % (≈ 7680 m² or more under uniform runoff). These are far apart; the preference was judged on a uniform-runoff preview, the target assumes climate weighting. Needs one author answer (§3 Q116-b).
3. **Shorter journeys vs ≥ 20 % wilderness conflict at uniform spacing.** Today: p50 8.9–9.9 game h between neighbours and wilderness > 5 h already only 11–14 % (target ≥ 20 % is **not met now**). 🟡 Geometry: 22 sites on ≈ 31 km² of land = 1.4 km² each; a regular pattern with neighbours at 5–7 h (≈ 0.9–1.3 km) leaves almost no land > 5 h (900 m) from a site; 25–28 sites leave less. Both can hold only with **clustered** settlement (belts along rivers/coasts/passes + empty uplands/arid areas) — exactly what G5 "geography-driven" means — or with a different wilderness definition.
4. **Road connectivity is not one component today**: only 18/27 and 19/30 layout edges route; 4 routed components, including isolated sites. "0 roadless, 1 component" is a real gate for Q127/Q61–Q64, not a formality.
5. **Relief targets are well-posed**: "1–3 coherent ranges, ≥ 1 pass each" is measurable against the blob census (0 ranges today). Height is G8 (§3 Q116-a).

## 3. Acceptance table (proposal §7, rows with an S0 baseline)

| Area · metric | Measured baseline (42 / 415424794) | Proposed target → keep / adjust (reason) | Author-approved |
| --- | --- | --- | --- |
| Rivers · density | 12.2 / 11.6 km/km² | **adjust:** "⅓–½ of current" → author picks band in Q116-b; measure after 061 H2 with climate runoff | ✅ Q116-b: ≈ −50 % total length, mostly minor streams; band −40…−60 % 🟡 + main-river guard ([Q116 reconciliation](./2026-11-04--q116-author-direction-reconciliation.md) §2) |
| Rivers · heads | 2277 / 2301 | **keep** "−60 % or more" only if Q116-b picks (b)/(c); with (a) ≈ −30 % | superseded: heads reported, not gated ([Q116 reconciliation](./2026-11-04--q116-author-direction-reconciliation.md) §2) |
| Rivers · dry interfluves | 0.2 % / 0.2 % | **adjust:** 35 % → "15–35 %, regional (arid/upland), measured after 061 C2"; not reachable by threshold (§2.1) | — |
| Rivers · trunk systems | 8+ / 8+, top 7.1 / 8.3 km | **keep** ≥ 3 with hierarchy (already met; must survive the cut) | — |
| Rivers · parallel artifacts | 0 / 1 | **keep** 0 artifact-class pairs | — |
| Relief · ranges | 0 coherent (40 / 37 blobs, ≤ 2.3 km) | **keep** 1–3 ranges, ≥ 1 pass each; add "largest gated component ≥ 3 km extent" as the census proxy | — |
| Relief · peaks/steepness | max 33 / 38 m; ≥ 20° = 0.1–0.2 % land | **open (G8):** Q116-a | ✅ Q116-a: highest peaks ~60–80 m (preference, not every mountain); shape on 060 R2 previews; keep `heightScale` ([Q116 reconciliation](./2026-11-04--q116-author-direction-reconciliation.md) §1) |
| Settlements · roads | 4 routed components | **keep** 0 roadless, 1 **routed** component (hard gate) | — |
| Settlements · journeys | p50 9.9 / 8.9 game h | **keep as indicative** 5–7 h median, ❓ pending Q116-c (what "too long" means) | ✅ ~4 real minutes accepted; ❓ route identity unverified (Q132) → report only, no journey target yet |
| Settlements · wilderness | > 5 h: 10.9 / 13.6 % | **adjust:** ≥ 20 % is below today's value; either redefine (Q116-d) or accept clustering as the way to reach it | ✅ Q116-d: **retired** as a gate — distance-to-settlement stays a diagnostic; wilderness = land cover/use + threats, belts per settlement ([Q116 reconciliation](./2026-11-04--q116-author-direction-reconciliation.md) §4) |
| Performance · boot | cold 41–75 s, warm 22–31 s; hydrology ≈ 4.3 s Node | **keep** "not slower beyond Q131 tolerances" (±20 % hydrology/chunk) | — |
| Landmarks / climate / biomes / discovery | no S0 baseline (features do not exist yet) | keep as proposed; donors per D5 (V2 has no waterfall) | — |

## 4. Questions for the author (also in queue §3, Polish)

- **Q116-a G8 wysokość/kształt gór:** dziś najwyższe szczyty 33/38 m, stoki ≥ 20° to 0,1–0,2 % lądu; V3 miał ~217 m. Ocena podglądów: „OK”. (a) zachować wysokości, tylko połączyć w pasma z przełęczami + kilka lokalnie stromych szczytów (≤ ~50 m) [rek.]; (b) wyraźnie wyższe pasma (~60–100 m) — więcej dramatyzmu, większy wpływ na drogi/rzeki/koszt; (c) decyzja po podglądach 060 R1 na 7 seedach.
- **Q116-b gęstość cieków:** 1920 m² (Twoja preferencja) = −21 % długości strumieni; cel z propozycji −50…−67 %. (a) cel −50 % (≈ 2× mniej), ostatecznie po klimacie 061 [rek.]; (b) cel ≈ −21 % jak na podglądzie 1920; (c) cel −67 % (najrzadziej).
- **Q116-c „za długa droga” w lewo od domu (1429 m, prawie prosta):** chodzi o (a) czas w realu (~4 min marszu bez niczego po drodze); (b) czas gry (≈ 8 h gry na 1,4 km zjada dzień); (c) jedno i drugie. Od tego zależy, czy naprawia to geografia (gęstość osad) czy skala czasu / treść po drodze.
- **Q116-d dzicz vs krótkie podróże:** dziś tylko 11–14 % lądu jest > 5 h od osady, a krótsze podróże ten udział jeszcze zmniejszą. (a) osady skupione w pasach (doliny, wybrzeże, przełęcze), puste wyżyny/suche obszary jako dzicz — cel ≥ 20 % zostaje [rek.]; (b) dzicz = > 2,5 h od osady **i** drogi, cel do ustalenia po 063; (c) dzicz mniej ważna niż krótkie podróże.
