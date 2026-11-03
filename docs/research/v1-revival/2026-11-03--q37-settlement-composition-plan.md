# Q37 — Settlement composition + object placement plan

**Created:** 2026-11-03 by Claude Opus 5.5 (queue Q37, O→S) · **Status:** recon done, plan ready; S slices in the [queue](./AUTONOMOUS-SESSION-QUEUE.md) (Q93–Q95). **Author visual sign-off is mandatory** before Q37 counts as done ([author direction](./2026-10-30--q29-revival-epoch-batch-plan.md#q37--author-direction-2026-10-31)).  
**Entry docs:** [Q29 plan §Q37](./2026-10-30--q29-revival-epoch-batch-plan.md#q37--author-direction-2026-10-31), [Q34 yard plan](./2026-10-31--q34-house-yard-footprint-plan.md), [Q36 storehouse plan](./2026-10-31--q36-settlement-storehouse-plan.md), [Q44 roads plan](./2026-11-02--q44-roads-paths-rebuild-plan.md).

## 1. Scope

Settlement composition, character and placement correctness in the planner (`villagePlanner.ts`, `villageLanes.ts`) — not in props. Keep NPC interactions and access working, keep identities deterministic, bump the touched worldgen caches (epoch 1, D3). Collision tests alone are not acceptance.

## 2. Evidence (2026-11-03)

Tool: `pnpm worldgen:access:census` (`scripts/perf/census-settlement-access.ts`, production hydrology). It builds the static collider set `createSettlement.registerSettlementColliders` registers, from plan data only (house/storehouse shells with doors closed, wells, wood stockpile, campfire, pasture/paddock/yard fences). It does **not** include entrance palisade wings or profession dressing, and it does not include props placed only in `props.ts` (torches, lanterns, market crates, wood-pile extras, wagons). Whole island = rings ≤ 12: seed 42 has 22 settlements, seed 415424794 has 20. The finite continent (059 W3) holds fewer than the "30 per seed" in the queue row, so every settlement is sampled.

| Finding | Result | Status |
| --- | --- | --- |
| F0 wet yard pads (clearance fallback without the dry-yard rule) | 2 → 0 | fixed `ae87e59f` |
| F0b storehouse: one per settlement, 0 fallbacks/overlaps, 0 bay slots in other plots | both seeds | verified `ef0168d6` |
| **F1 house wall OBBs rotated with the wrong sign** (`transformHouseCollidersToWorld` used `+yaw`, the collider convention is `−yaw`). On every house and storehouse whose yaw is not a multiple of 90°, the wall colliders were mirrored off the real walls (a back-wall line was covered by 4/29 probes at yaw 0.6). Bodies could walk through walls and hit invisible ones. Player-built houses and palisades had the same bug. | rings ≤ 8: unreachable bay slots 5 → 0, yard storage slots 4 → 0, goals without body clearance 28 → 0 | fixed `668ef734`, `c405f839` (runtime collision only, no cache/save impact) |
| Access: plaza → every yard gate, yard storage slot and storehouse bay slot (body clearance 0.35 m, 0.5 m grid A*) | 0 unreachable on both seeds; route/straight p90 1.20–1.33, max 1.83 | technically verified |
| Object plots (non-house plots) overlapping each other or house compounds | 0 / 586 | technically verified |
| **F2 path/road centreline ≤ 0.3 m from a foreign house/storehouse wall** (the lane walks through the building) | seed 42: 6 · seed 415424794: 4. Ribbon (± half width) touching a wall: 28 / 29 | fixed (Q93, 2026-11-03): centreline-in-building 0 / 0, ribbon ∩ wall 4 / 1 |
| **F3 object discs partly on wet floor** (rim samples at 0.8 r) | seed 42: 1 (SM `0_10` field) · seed 415424794: 5, all in LG `-4_3` (storehouse, L garden, campfire, field, cemetery) | open → Q94 |
| F4 entrance roads over the core of fields / gardens / livestock / storehouse / market discs | 17 (most are fields and gardens) | author question (§5) |

F2 cases (seed · size · cell · path → building): 42 SM `-2_-8` entrance-1 → house-0; 42 MD `2_-6` pasture path → house-1; 42 LG `10_-1` entrance-2 (road) → storehouse; **42 SM `0_0` (home)** entrance-1 → house-1 and storehouse; 42 LG `-7_7` entrance-0 (road) → house-2; 415424794 LG `-4_3` entrance-1/2 (roads) → houses 1/2 and the shore path → house-2; 415424794 LG `-2_9` sale-plot path → house-3.

Likely causes, to confirm in Q93: (a) in `villageLanes.obstaclesFromPlots` a house is a disc of `0.9 × plot.radius` with **no lane half width added** (the yard rectangle has `laneHalfWidth + 0.8 m`), so a centreline may cut a house corner; (b) the "unresolved" entrance fallback (`routeAround(from, center, cemetery-only obstacles) ?? [from, center]`) ignores every house; (c) `obstaclesExcludingPoint` drops the whole plot when a gate lies inside its disc.

## 3. Slices (S rows in the queue)

| Row | Slice | Done when | Caches |
| --- | --- | --- | --- |
| **Q93** | Lane/road clearance around buildings (F2): house + storehouse obstacles use the wall footprint (OBB or circumscribed disc) plus lane half width plus a margin. The unresolved fallback must also respect buildings; if no route exists, emit nothing and count it, never a straight line through a house. | census: centreline-in-building 0 on both seeds; ribbon ∩ wall ≤ 10 % of today (28 / 29); unresolved entrances not up; access table still 0 unreachable; `villageLanes` tests + a regression test on one F2 case | settlement-definitions, road-routes, chunk-tiles (paving), abandoned-cemeteries if it reads plans |
| **Q94** | Dry object discs (F3): extend the planner's dry rule for object plots (storehouse, garden, field, campfire/plaza, cemetery) from the centre to the disc rim, like the 058 L1 yard rule. If no dry candidate exists, prefer dropping optional objects; a mandatory object (storehouse, campfire) needs a stop + question. | census wet objects 0 on both seeds, no mandatory object dropped, LG `-4_3` re-checked | same as Q93 (one bump if both land together) |
| **Q95** | Runtime-prop composition census: extract the `props.ts` positions for torches, lanterns, market crates, wood-pile extras and wagons into a pure helper (or a plan-level mirror) and test them against walls, yards, paths and water. | census row for runtime props on both seeds; fixes land in the planner/helper | none if positions do not change; otherwise as Q93 |

Q93 and Q94 change the settlement plan (layout moves), so they belong to epoch 1 (D3): one coordinated cache bump, no second `WORLDGEN_EPOCH` bump. Each lands as its own revertable commit with census before/after rows.

## 4. Visual inspection cases (§2, author)

All are browser checks: `?seed=<seed>`, then teleport to the centre (world x, z).

1. **Home 415424794** MD (60, −5): yard gates/fences, storehouse bay, plaza furniture (well, campfire, market, notice board), lanes reach the yards.
2. **415424794 LG `-4_3`** (−1248, 895): lake-side layout. Houses 5/7 now reach 64 m (`ae87e59f` side effect); storehouse/garden/field/cemetery edges at the water (F3); roads through houses 1/2 (F2).
3. **Home 42** SM (8, 23): entrance-1 path through house-1 and the storehouse (F2).
4. **42 LG `10_-1`** (3003, −302): road through the storehouse; fields/livestock crossed by roads (F4).
5. **42 LG `-7_7`** (−2130, 2116): road through house-2.
6. **415424794 XL `10_6`** (3026, 1787): largest layout; a path over the notice board and a road over a field (F4).
7. **415424794 MD `-12_-2`** (−3572, −624): dock path over the plaza campfire (waterfront composition).
8. F1 sanity in any settlement: walk around a house that is not axis-aligned. Walls block along their whole length, there are no invisible walls 1–2 m away, and doors stay passable when open.

Per case: overlaps, props in or over water, NPC/player access, overall composition. Record per-settlement draw calls (`?perf`, Q37 author direction).

## 5. Author questions (queue §3)

- **F4 roads over fields/gardens:** an entrance road across a field or garden disc can read as a field track (acceptable) or as a road over the crops (not acceptable). Options: (a) keep roads off every object disc except the plaza; (b) allow fields/livestock, keep gardens/storehouse/market clear [recommended]; (c) leave as is.
- **Roadside guard point** (proposal for evaluation, not approved). Recon is not done yet: guard schedules, the palisade/entrance relation and sightlines. Proposal: evaluate after Q93, when the entrance routes are final, and tie the point to an existing guard patrol waypoint rather than a decorative marker.

## 6. Keep/revert

F1 is a correctness fix (kept). Q93/Q94 are individual commits with census rows before and after. If the author rejects a slice visually, revert that commit and re-bump the caches.
