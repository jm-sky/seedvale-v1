# Revival Audit — Settlement Rendering (Track B delta)

**Created:** 2026-10-27  
**Created by:** Claude Opus 5.5 (coordinator; short delta in place of a full subagent audit)  
**Status:** research — not approved scope; **PENDING BASELINE** (B0)  
**V1 pin:** `c460b224` · **Owner analysis:** [transfer recon §11](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27) (pinned `d1c477f3`)

This is a **delta**, not a repeat of §11. A full subagent audit was stopped to limit usage; §11 is two days old and remains the owning analysis. No tests, benchmarks or browser runs were executed for this document.

## 1. Verified state and delta vs §11

- [code] `git log d1c477f3..c460b224` shows **no settlement/render runtime changes**; the only render-adjacent changes are P0 diagnostics under `src/perf/` (`passSubmissionCollector.ts`, `deviceMeta.ts`, `artifacts.ts`, `benchmark.ts`, `grassBaseline.ts`). §11.2–§11.5 ownership (`props.ts`, `createHouseStaticBatch`, `instancedProps.ts`, `storageVisuals.ts`, `createSettlement.ts`) therefore still stands.
- [doc] `settlements-019` Stage 1 (wells + crop beds) implemented, **browser verification outstanding**; Stage 2/3 own further static submission work. `world-terrain-038` closed further speculative shadow exceptions; `world-terrain-015` owns reflection budget.
- [measured-diagnostic] New since §11: diagnostic smoke [032](../../performance/results/2026-10-27--032--benchmark-settlement-heavy.md) provides the first **observed per-pass** submissions (single 15 s warm run, Arc ANGLE, 948×486, rain; captured at `e124e866`, before the runbook minimum instrument SHA `94a74470`; **not** a baseline):

| Pass | Total calls avg | Settlement-tagged calls | NPC+fauna | Items |
| --- | ---: | ---: | ---: | ---: |
| Main | 1596 | 511 | 455 | 202 |
| Shadow + mirror (combined in this summary) | 760 | 381 | 42 | 14 |

  Largest observed **main-pass** settlement families: `fireHouseExteriorLamp` 90, `storageGoods` 74, `houseStatic` 66 (161k tris), `storageContainer` 58, `workplace` 37, `houseInteractive` 30, `fireCampfire` 28. Mirror pass carries `fireHouseExteriorLamp` 45, `storageGoods` 36, `houseStatic` 33, `storageContainer` 28 and a `landmarkGarden` subset at 82k tris for only 5 calls.
- [measured-diagnostic] Isolation probes in the same run: full render 27.6 ms; `hide-settlement` 24.3 ms (−3.3 ms, −887 draws); `no-shadows` 23.6 ms; `hide-npc-fauna` 17.8 ms (−9.8 ms). Single sample, CPU wall-clock that may include GPU wait — **ranking hint only**.
- [doc→measured contrast] The one-pass census (`settlement draws=1520`) overstates observed main-pass settlement submissions (511) roughly 3×. Decisions must use the pass collector, not the census (consistent with the readiness audit).

## 2. Reusable solutions (unchanged from §11, re-ranked by the 032 hint)

| Mechanism | Verdict | Note |
| --- | --- | --- |
| Existing `instancedProps` / `createHouseStaticBatch` / per-settlement shadow buckets | KEEP V1 | Already batches repeated statics. |
| Immutable template merge for one multi-primitive GLB family (B1) | EXTEND V1 | First candidate family should come from B0; 032 hints at lamps/storage goods/containers rather than house shells. |
| V2/V3 tiered stockpile visuals | ADAPT V3 only as asset reference | Not a renderer transplant; V1 `woodPileVisualState`/overflow semantics stay authoritative (§11.4). |
| V3 static structure renderer | REJECT | Would duplicate ownership of doors, stages, storage and interaction. |

## 3. New problems / risks found in this delta

1. **Exterior lamps are a visible submission family** (90 main + 45 mirror in 032). They are controller-owned (light state, day/night), so they are a *dynamic-boundary* case: a batch can only hold the immutable lamp body; flame/emissive/light state stays per-instance (instance attribute or a separate controller node). Not covered as a ranked target in §11.6.
2. **`storageGoods` / `storageContainer`** (132 main+mirror) are live-inventory projections (`settlements-npcs-025`); this is the §11 B4 case and must keep registry stock authoritative.
3. **Mirror pass includes small settlement detail** (lamps, goods, containers). Whether such objects need to be reflected is a `world-terrain-015` decision — a cheap mirror layer mask could remove submissions without touching settlement ownership. Coordinate with water atmosphere work (mirror changes alter water look).
4. **`items` = 202 main-pass calls** is not settlement-owned; it is likely dropped/held item meshes. Ownership must be confirmed before Track A or B claims it (open question, see §7).

## 4. Recommended architecture

Keep the §11 contract: settlements own templates/batches; dynamic state (doors, construction stages, stock levels, fire/light state, interaction targets) stays on controller nodes or per-instance attributes; no whole-settlement megabatch, no copied V3 radii. Add one rule from the 032 hint: **mirror/shadow eligibility is a per-family policy table** (owned by existing `world-terrain-015` / `-038` owners), not ad-hoc per-object flags.

## 5. Conditional stages (all PENDING BASELINE)

| # | Stage | Owner | Gate / rollback |
| --- | --- | --- | --- |
| B0 | Matched settlement-heavy capture (≥3 warmed reps) with per-pass families — **being run independently**; reuse, do not re-instrument. | settlements-019 Stage 2 (shared with A0a) | READY per Arc runbook; otherwise UNVERIFIED. |
| B0.5 | Author browser check of settlements-019 Stage 1 (wells/crops) — closes an old gate cheaply. | settlements-019 | Author PASS/FAIL. |
| B1a | Mirror-eligibility trim for small settlement detail families (lamps, goods, containers) | world-terrain-015 | Keep only if water look unchanged in author review; revert = restore layer mask. |
| B1b | One immutable template merge or instancing for the leading **static** family from B0 | settlements-019 Stage 3 | Observed main+shadow calls drop for that family; no interaction/teardown regression. |
| B2 | Exterior-lamp body instancing with per-instance light/emissive state | settlements-019 Stage 3 + existing lamp controller owner | Day/night/rain toggles identical; revert = per-object meshes. |
| B3/B4 | Live storage representative (wood tiers / goods) per §11.6 | settlements-npcs-025 | As §11.6. |

## 6. Acceptance criteria

Observed per-pass calls/triangles per family from the pass collector (not the census), render p50/p95 and frame p95/p99 at matched workload, build/dispose hitches on stream-in/out, zero interaction/door/stage/stock regressions, author visual check at low sun and at water edges.

### Baseline results slot (fill from B0; do not edit analysis above)

| Run (SHA, date) | Reps | Main settlement calls | Shadow settlement calls | Mirror settlement calls | Top 3 families | render p50/p95 | frame p95/p99 | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 032 diagnostic (`e124e866`) | 1 | 511 | (combined 381 with mirror) | — | lamps, goods, houseStatic | 36.1 / 49 | 104.6 / 262 | DIAGNOSTIC ONLY |
| B0 | | | | | | | | PENDING |

## 7. Decisions for the author

1. May small settlement details (lamps, goods, containers) be **omitted from water reflections** if not noticeable? (Recommended: yes, behind author visual check.)
2. Confirm settlements-019 Stage 1 browser check can be done now, independently of B0.
