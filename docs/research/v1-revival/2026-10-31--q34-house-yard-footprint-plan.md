# Q34 — House spacing + household-yard footprint: recon and implementation plan

**Created:** 2026-10-31 by Claude Opus 5.5 (queue Q34, O→S)  
**Status:** plan — implementation is queue **Q41** (Sonnet). Visual result needs author sign-off (queue §2) like every epoch-1 layout slice.  
**Authority:** [Q29 batch plan §3](./2026-10-30--q29-revival-epoch-batch-plan.md#3-ordered-slices) (Q34 row, batch rules §2), [profession-signature homes decision](./2026-10-30--q29-revival-epoch-batch-plan.md#profession-signature-homes--author-approved-outcome-2026-10-31) (spatial reservation must land in epoch 1). Epoch is already `WORLDGEN_EPOCH = 1` (Q33) — no further bump, only cache namespaces. Source facts verified against `main` at `a679609`; code is authoritative.

## 1. Recon findings (✅ verified)

| # | Finding | Evidence |
| --- | --- | --- |
| F1 | **The yard contract checks the wrong houses.** `householdYard.ts` derives `MAX_HOUSE_FOOTPRINT_RADIUS` from the legacy GLB `HOUSE_CATALOG` (max 2.2 m), so `householdYardRadius()` = 4.1 ≤ `HOUSE_PLOT_RADIUS` 4.5 and `householdYard.test.ts` / the `villagePlanner.test.ts` yard tests pass. Real houses are HouseBuilder definitions picked by `pickHouseDefinition(size, i, worldSeed)` (`props.ts:1328`): 4×4 r = 3.28, 6×4 r = 4.06, 6×6 r = 4.69, 8×6 r = 5.45 (`houseFootprintRadius`). Real yard reach (storage slot) is 5.2–7.35 m from the house centre. | `householdYard.ts:21`, `houseBuilder.ts:249`, `assets/houseDefinitionExample.ts:818` |
| F2 | **House plots under-reserve.** Census (`pnpm worldgen:yards:census`, rings ≤ 5): real footprint > plot radius for 1/58 (SM) … 157/188 (LG) houses on seed 415424794 and 14/140 (MD) … 56/143 (LG) on seed 42. Disc-level collisions are still rare (0–3 per size/seed) only because `houseSpacing × 0.55` edge gaps are generous — there is no reserved yard to build fences or profession dressing in. | table §1.1 |
| F3 | **Yard props have no shape.** `props.ts` `houseYardPlacements` puts barrel/trough/wood/storage on the settlement-core → house axis at `footprintRadius + 0.85/1.35/1.55/1.9` with **independent** ±0.45 rad jitter from the shared `coreRandom` stream, so props can overlap each other and their positions depend on prop-building order. | `props.ts:1586–1700` |
| F4 | **Simulation positions come from the render builder.** `landmarks.householdStorages` / `householdWoodStorages` (NPC delivery targets, `createSettlement.ts:1066`, `SettlementsManager.ts:1321`) are produced inside `buildSettlementProps` from the same random stream — authoritative targets derived in a presentation module. | `props.ts:1669–1695` |
| F5 | **Every house gets the "outskirts" yaw jitter.** `props.ts:1351` jitters yaw by up to ±0.45π when `dist > houseRing × 0.75`, but houses are placed at `preferredRing × (0.75…1.25)` with `preferredRing = houseRing` (`villagePlanner.ts:977`, `:735`), so the condition is true for all houses (census: 100 %). Plan 076's intent was outskirts only. With jitter the door is up to 81° off the plaza while yard props stay on the core axis — the yard is not "behind" the house. | census column "yaw jittered" |
| F6 | **House model choice is not in the plan.** The planner never sees which definition (footprint/door side) a house gets; props picks it with the world seed. Doors are on the definition's `front` side. | `props.ts:1328`, `houseDefinitionExample.ts:506` |
| F7 | Terrain clearing per house is a disc `max(houseRadius, plot.radius × 0.85)` at the house centre (`villageClearing.ts:91`); `ClearingLayout.houses` is index-aligned with families and zipped by index downstream. A yard behind the house is currently not flattened. | `villageClearing.ts:88` |
| F8 | Blacksmith workplace (`blacksmithYard.ts`) sits 100° off the outward yard axis at `footprint + 1.0`; household wells use `householdWellLocalBand(housePlotRadius)` (min = yard radius + infra). Both are defined relative to the stale contract. | `blacksmithYard.ts:23–33`, `villagePlanner.ts:88` |
| F9 | No V3 checkout is available in this container (profession dressing donor inspection is a later task, Q42). | `/home/user` |

### 1.1 Baseline census (before Q34)

Disc approximation of the real house footprint; "yard crate" = storage slot point + 0.5 m crate half-size.

| seed | size | settl. | houses | footprint > plot r | house walls overlap | house footprint ∩ other plot | yard crate ∩ other house | yard crate ∩ other plot | yard crate outside footprintRadius | yaw jittered | settl. with any |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | SM | 25 | 58 | 1 | 0 | 0 | 0 | 0 | 0 | 58 | 0 |
| 42 | MD | 33 | 140 | 14 | 0 | 0 | 0 | 0 | 4 | 140 | 0 |
| 42 | LG | 24 | 143 | 56 | 0 | 0 | 0 | 0 | 0 | 143 | 0 |
| 42 | XL | 6 | 50 | 23 | 0 | 0 | 0 | 0 | 0 | 50 | 0 |
| 415424794 | OUTPOST | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 415424794 | SM | 25 | 47 | 5 | 0 | 0 | 0 | 0 | 0 | 47 | 0 |
| 415424794 | MD | 32 | 134 | 56 | 0 | 0 | 0 | 0 | 0 | 134 | 0 |
| 415424794 | LG | 31 | 188 | 157 | 0 | 0 | 0 | 1 | 1 | 188 | 1 |
| 415424794 | XL | 10 | 83 | 73 | 0 | 3 | 0 | 0 | 4 | 83 | 1 |

## 2. Design (decided by Opus — routine technical choices within the approved epoch scope)

**Principle:** the planner owns the whole household compound — house definition, yaw, yard rectangle and yard slots — as pure deterministic plan data. Props and simulation consume it; neither re-derives positions.

1. **House definition in the plan.** `VillagePlot` (house role) gains `houseDefinitionId` chosen in `planVillageLayout` with the existing `pickHouseDefinition` logic (pool per size, home handling unchanged) seeded from `seedForCell` + family index. `props.ts` looks the definition up by id instead of calling `pickHouseDefinition` itself. (House models change per settlement — fine inside epoch 1.)
2. **House yaw in the plan.** `houseYaw` = outward + π, plus the plan-076 jitter **only for real outskirts** (`dist > houseRing`, i.e. beyond the preferred ring), same ±0.45π magnitude, seeded by plot id (not a shared stream). Props uses `plot.houseYaw`. This fixes F5 to the documented intent; the visual change (most houses now face the plaza) goes into the author's §2 check.
3. **Yard rectangle (`HouseholdYardPlan`)** attached to the house **back** wall (opposite the `front` door side), in house-local axes:
   - width = facade width + 2 × `YARD_SIDE_OVERHANG` (1.0 m) — the overhang leaves a side gap past each house corner for a gate (Q35) and a walk-around lane;
   - depth = `YARD_DEPTH[size]`: OUTPOST 4.0, SM 4.5, MD 5.0, LG 5.0, XL 5.5 m (S may tune ±0.5 m from the census, record values);
   - stored as `{ cx, cz, yaw, halfWidth, halfDepth }` on the house plot (`plot.yard`).
4. **Yard slots** (fixed, deterministic, in yard-local coordinates, stored in `plot.yard.slots`):
   - `barrel`, `trough`, `wood`, `storage` — a row along the back wall at depth 1.0 m, ≥ 1.3 m apart, mirrored left/right by a per-plot seeded bit (variety without overlap);
   - `profession` — one **unconditional** reserved rectangle 3.0 × 2.0 m at the far edge, for every house regardless of current profession (layout stays independent of household profession, which can change in simulation). It hosts profession dressing (hunter hide frame, fisher net rack, Q42) or a profession workplace; nothing is placed in it in Q34 unless the blacksmith move below is taken;
   - `gate` — a 1.6 m side-edge gap marker on the side nearer the house front path (consumed by Q35 fences).
5. **Spacing uses the compound, not one disc.** House plots carry two spacing discs: house disc (real `houseFootprintRadius`) and yard disc (`hypot(halfWidth, halfDepth)` at the yard centre). `minDistToPlots`, the scored spacing check, `clearanceFallback` and `localFallbackInvariantsHold` measure against all discs of existing plots (generic optional `VillagePlot.discs`; plots without it keep `radius`). Candidate evaluation computes the yaw + yard for the candidate position before scoring. `HOUSE_PLOT_RADIUS` is replaced by the per-house disc; `houseSpacing` becomes the required gap between compounds (re-tuned, see 7).
6. **No overlapping house fallback.** Houses are never dropped (family count is the stop condition). Extend the house fallback with more outward grow steps (bounded) on the compound check; the unconditional final fallback stays only as a defensive path and is **counted** — a census/test metric must be 0 on the sampled seeds. If calibration cannot reach 0 without growing settlements beyond the limits in 7 → stop (queue §3).
7. **Footprint growth.** Increase `houseRingMax` / `footprintRadius` per size only as much as the census needs (house compounds inside `footprintRadius`, 0 fallbacks, 0 compound overlaps). Expected order +15–35 %; **stop and ask** if any size needs > +40 % (settlement visual scale / road length change the author has not seen). Cemetery distances read `footprintRadius` (`cemeteryPlacement.ts:110–160`) → abandoned-cemeteries cache bump.
8. **Clearings.** `ClearingLayout` gains `yards: ClearingArea[]` (index-aligned with `houses`, not mixed into `houses`) so terrain flattening/vegetation clearing covers the yard; consumers of `houses` are unchanged.
9. **Simulation targets from the plan.** `landmarks.householdStorages` / `householdWoodStorages` are built from `plot.yard.slots` (planner/landmark derivation), and props instance barrel/trough/wood/storage at the same slots. Fixes F3/F4 and removes four `coreRandom` draws per house (downstream prop jitter shifts — fine in epoch 1).
10. **Neighbours of the compound.** Household wells: band measured from the compound (outside both discs, beside the house front half), not from `householdYardRadius()`. Blacksmith workplace: **recommended** to move into the `profession` slot (anvil + bench + access anchor fit 3.0 × 2.0; anchor faces the gate side) — keeps the side lanes free for Q35; if a test shows the NPC anchor unreachable before Q35 gates exist, keep the lateral placement but derive it from `houseYaw` and assert it does not intersect the yard rectangle.
11. **Contract module.** `householdYard.ts` becomes the owner of yard geometry (dimensions, slot layout, `householdYardPlanFor(def, houseX, houseZ, yaw, size, seed)`), pure and Three.js-free; the legacy `MAX_HOUSE_FOOTPRINT_RADIUS`/`householdYardRadius()` are removed with their callers updated (no parallel contract).

**Rejected alternative:** one enlarged disc per house (≈ 9 m for 8×6 + yard) — wastes the side/front space, pushes LG/XL houses into fallback rings and inflates settlements far more than the two-disc compound.

## 3. Implementation steps (Q41, Sonnet)

1. `householdYard.ts`: yard dimensions, slot layout, `householdYardPlanFor`; unit tests (every slot inside the rectangle, slots ≥ 1.3 m apart, profession slot fully inside, house footprint rectangle and yard rectangle share only the back edge, deterministic for same inputs).
2. `villagePlan.ts`: `VillagePlot.houseDefinitionId?`, `houseYaw?`, `yard?`, `discs?`; JSDoc. `villagePlanner.ts`: definition + yaw + yard per house candidate; compound spacing (step 2.5); fallback per 2.6; household-well band per 2.10.
3. `villageClearing.ts`: `yards` areas; `props.ts`: house definition by id, yaw from plan, yard props from slots, remove `houseYardPlacements` and the yaw jitter; landmarks from slots (2.9). Blacksmith per 2.10.
4. Extend `scripts/perf/census-house-yards.ts` with compound metrics (compound overlaps, final-fallback houses, compound outside `footprintRadius`, settlement extent p90) and calibrate `YARD_DEPTH` / `houseSpacing` / `houseRingMax` / `footprintRadius` on seeds 42 + 415424794 (+ 1, 2, 3 as noise check). Record before/after tables in the notes.
5. Tests: replace the vacuous contract tests (F1) with real-footprint ones; `villagePlanner.test.ts` yard tests use the compound (yard rectangle vs other houses' compounds, gardens, infra, market, sale plots) on all SIZES × SEEDS; family count unchanged; final-fallback count 0; determinism (same seed → same plan, cold vs warm settlement-definitions cache).
6. Caches (batch rule §2): bump `settlement-definitions` (5 → 6), `road-routes` (entrances/paths move), `chunk-tiles` (clearings), `abandoned-cemeteries` (footprintRadius) and `caves-v2` only if its generator reads `footprintRadius`/plan (check, record). `WORLDGEN_EPOCH` stays 1. tools-020 fixtures remain stale (already in §4 for browser re-export).
7. Verification: `npx tsc --noEmit`, targeted vitest (`src/settlement`, storage/NPC delivery tests, worldgen fixture/cache tests), `pnpm run lint:fix`. Then STATE/`docs/state` settlement section, Q29 plan row, this doc's §5 notes, queue Q41 status, queue §2 visual check entry.

**Not in Q34/Q41:** fences and gates (Q35), storehouse (Q36), other prop placement (Q37), profession dressing meshes (Q42), changing household counts, NPC routine changes beyond retargeting existing yard positions.

## 4. Acceptance and stop conditions

- **Done when:** no house/yard compound overlaps and 0 final-fallback houses on 30+ sampled settlements per seed (42, 415424794) and on the synthetic SIZES × SEEDS tests; family count unchanged; NPC storage/wood delivery tests green on the new targets; census before/after recorded; caches bumped; author visual check queued (§2): yard behind every house, door facing plaza, props inside the yard, outskirts jitter, settlement scale.
- **Stop if:** family count would drop; any size needs > +40 % `footprintRadius`; a NPC routine cannot reach yard slots (before Q35 there are no fences, so this should not happen); the blacksmith move breaks settlements-npcs-024 behaviour → keep lateral placement per 2.10.
- **Performance:** no new draws in Q34 (same prop counts, same instancing); larger clearings only. Record draws per settlement unchanged (structural), no FPS claim.

## 5. Implementation notes

_Filled by Q41._
