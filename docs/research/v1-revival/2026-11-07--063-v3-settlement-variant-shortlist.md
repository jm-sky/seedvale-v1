# world-terrain-063 V3 — settlement variant shortlist (G5)

**Date:** 2026-11-07 · **Author:** Opus (queue Q127 V3) · **Status:** ✅ answered 2026-11-07 — **variant B** (author; see [063 notes §Author decisions](../../plans/implementation-notes/world-terrain-063-geography-driven-settlement-variants-implementation-notes.md#author-decisions-g5--q188-a--q186-a-2026-11-07-and-v4-pre-check-opus)); implementation = queue Q128 (V4)
**Inputs:** [V2 results](../../plans/implementation-notes/world-terrain-063-geography-driven-settlement-variants-implementation-notes.md#v2-results-sonnet-2026-11-07-q187) (27-cell matrix + uniform + spot seeds), plus a V3 re-census of the candidates on both reference seeds (headless, router `2a19cf4c` + Q186 filters, weight `none`, `census-travel --target --spacing --routes-out`). All numbers are headless estimates; nothing here is browser-verified.

## 1. Ranking rule (plan §V3)

(1) connectivity / guarantees → (2) shorter journeys (author route home → Lipowy Parów `4_-1` and neighbour median, target −25…−40 % 🟡) → (3) wilderness reported as land cover outside belts and road corridors (no distance gate) → (4) no empty quadrant → (5) NPC transport distances and workload.

**Eliminated before ranking:**
- **Suitability `moderate` / `strong`** — moves 1–5 % of the metrics, adds households, and on seed 42 `28@*/strong` splits the road graph. Weight stays `none` for every shortlisted variant.
- **`*@1150` with 25/28** — 2 routed components on seed 415424794.
- **28@950 / 28@1050** — same journey gain as 25@950 on both seeds (neighbour median 1221–1335 m, author route 1400 m) for +8–12 more households; only wilderness > 5 h is lower, which is no longer a gate.
- **≥ 40 sites** — land runs out at ≈ 43 / 40 sites at the 720 m floor; seed 415424794 then has 2 components.

## 2. Shortlist

Baseline = today's game (22 @ 1150). "Nbr median" = median over settlements of the shortest routed road to a neighbour. Pairs are `seed 42 / seed 415424794`.

| | **A — 22 @ 1050** | **B — 25 @ 950** | **C — 35 @ 850** | baseline 22 @ 1150 |
| --- | --- | --- | --- | --- |
| settlements | 22 | 25 (+14 %) | 35 (+59 %) | 22 |
| households · residents | 89 · 166 / 94 · 181 | 105 · 199 / 105 · 195 | 148 · 286 / 154 · 305 | 88 · 164 / 88 · 165 |
| size mix (415424794) | MD 11 · LG 5 · SM 5 · XL 1 | MD 15 · LG 4 · SM 5 · XL 1 | MD 18 · LG 9 · SM 7 · XL 1 | MD 11 · LG 4 · SM 5 · XL 1 · OUTPOST 1 |
| routed components | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 |
| unrouted layout edges | 2 / 2 | 2 / 1 | 6 / 3 | 2 / 1 |
| **author route** home → `4_-1` (415424794) | **1400 m**, ratio 1.13 | **1400 m**, ratio 1.13 | `4_-1` **no longer a site**; nearest east `3_-1` 1121 m, ratio 1.24 | 2209 m, ratio 1.78 |
| home's routed roads (415424794) | 1128 · 1159 · 1400 m | 1141 · 1168 · 1400 m | 1121 · 1148 m | 1130 · 1383 · 2209 m |
| **nbr median** | 1410 / 1398 (−3 % / 0 %) | 1335 / 1229 (−8 % / −12 %) | **933 / 979 (−36 % / −30 %)** | 1457 / 1398 |
| route p50 · p90 | 1608 · 2948 / 1506 · 2045 | 1437 · 2131 / 1577 · 2362 | 1219 · 1853 / 1354 · 2473 | 1601 · 2948 / 1578 · 2209 |
| long detours (ratio > 1.5) | 6 / 1 | 4 / 5 | 3 / 9 | 7 / 2 |
| land outside belts + 30 m road corridor: forest · wetland · rock-alpine % | 76.9 · 2.4 · 14.5 / 68.6 · 3.2 · 14.0 | 76.8 · 2.4 · 14.6 / 68.1 · 3.3 · 14.2 | 76.7 · 2.4 · 14.6 / 67.1 · 3.5 · 14.7 | 77.0 · 2.4 · 14.5 / 68.8 · 3.3 · 13.7 |
| land outside belts (km²) | 28.5 / 28.5 | 28.3 / 27.7 | 27.6 / 26.8 | 28.6 / 28.2 |
| wilderness > 5 h % (info only) | 11.2 / 14.9 | 8.3 / 8.8 | 2.6 / 3.1 | 11.1 / 13.2 |
| worst quadrant within 5 h % | 81.4 / 76.4 | 84.8 / 83.3 | 95.8 / 94.5 | 81.4 / 80.4 |
| spot seeds 1 · 7 · 1234 components | not run | 1 · 3 · 2 | 1 · 2 · 1 | 1 · 4 · 3 |
| previews (`continent-previews/063-variants/`) | `42-22-1050_none.png`, `415424794-22-1050_none.png` | `*-25-950_none.png` | `*-35-850_none.png` | `*-22-1150_none.png` |

**Reading the table**

- **A** is "fix the author's road, change nothing else": same count and almost the same workload; the home → Lipowy Parów road drops from 2209 m to 1400 m (−37 % against today, but +6 % against the remembered 1320 m). Journeys elsewhere do not get shorter.
- **B** is the moderate step: same 1400 m author route, neighbour median −8…−12 %, households +19 %. It does **not** reach the −25…−40 % band.
- **C** is the only row that reaches the band (neighbour median −30…−36 %, home → nearest east neighbour 1121 m), at **+68…75 % households** and with the reference world's Lipowy Parów (`4_-1`) replaced by a closer village `3_-1` (different id, different generated name; the save/identity side is covered by the planned epoch, D3). Seed 42 home has only one routed road (6 unrouted layout edges world-wide), and seed 415424794 has 9 long detours.
- Land-cover wilderness (forest / wetland / rock-alpine outside belts and road corridors) is **practically identical** across A–C (land outside belts 28.6 → 27.6 km² on seed 42): the belts are small compared with the continent, so density does not eat the wild land cover — it only shortens the straight-line distance to the nearest village.

## 3. Caveats the author should know before choosing

1. **Spot seeds fail priority 1 for every variant, including today's 22 @ 1150** (seed 7: 4 components, seed 1234: 3 — all `routeFailed` even with the Q127 wider-box retry). Reference seeds are fine. This is a router/land property independent of the choice, so it is a separate task (queue **Q188**), not a reason to pick one variant over another. Plan §Done when ("1 component … or an explained exception") still binds V4 on the reference seeds.
2. **The 1400 m author route on A/B is not a layout change near home:** home and `4_-1` sit at the same positions as today; the route takes a different home access point and stays north of the sea inlet (route bbox z −347…6 vs today's southern detour to z 436). The exact cause (access point / obstacle set changes with the neighbour set) is not isolated 🟡. V4 must confirm the route with a timed in-game walk (queue §2) before it counts as the G5 journey result.
3. **Guarantees:** progression XL / LG / MD present in every row (size mix above); hop-level placement not separately re-verified 🟡 (V4). No code-level authored quest host bound to a settlement id was found (`grep questHost` in `src/` → none) ❓ — if the author has quest content tied to Lipowy Parów, C breaks it.
4. **Workload is unmeasured at runtime.** C means ≈ +60–70 % NPCs, households and settlement draw work. Performance stays first-class: C needs a WSL A/B (`settlement-walk` + `stream`) before landing, and possibly a simulation/LOD budget — this is a density decision the author must take explicitly (CLAUDE.md: reduced density / simulation → ask).
5. **Q186-a** (mainland flood cost ≈ 340–370 ms per layout) applies to every row and is independent of this choice.

## 4. Recommendation

**B (25 @ 950, weight `none`)** as the G5 variant, with an explicit note that the −25…−40 % journey target is **not** met; or **A** if the author wants no workload change before the performance lanes close. **C** only with a runtime budget check first (WSL A/B), since it is the only option meeting the journey band.

Why not C straight away: the gain comes from +60 % settlements, not from geography; it removes the author's reference village; it adds long detours on 415424794; and the cost is unmeasured. Clustered variants (plan V2 (ii)) are not worth designing now: land cover outside belts barely changes between 22 and 35 sites, so clustering would not buy wilderness that uniform density loses.

## 5. Next steps after the answer

- **V4 (S):** set the chosen `target` / `startSpacing` as the game defaults; settlement-definition / road-route / caves / cemeteries / `locations-coarse` cache bumps; censuses on both seeds reproduce §2; timed walk home → Lipowy Parów (§2); for C additionally the WSL A/B before enabling.
- Then the deferred road close-out Q61–Q63 (re-run the shortlist if they change reachability — plan "router pin") and the single fixture export Q64 / G1.
