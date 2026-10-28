# settlements-npcs-025 — implementation notes

## Wood stockpile: V2 firewood tiers + instanced pools (2026-10-28)

Owner plan: [settlements-npcs-025](settlements-npcs-025-resource-storage-visualization.md). Perf context: Track B / B3 in `docs/research/v1-revival/2026-10-26--v1-performance-transfer-v2-v3-recon.md`.

### Verification status

| Claim | Status |
|---|---|
| Asset extraction, geometry equals donor | ✅ technically verified (bbox/tri counts re-read from the written GLB) |
| Stage → tier mapping, overflow, zero stock, tier churn, dispose ownership, fallback bake | ✅ unit tests (`storageVisuals.test.ts`) |
| Visual acceptability (shape, colour, shading, shadows, water reflection) | ❓ not browser-verified |
| Draw-call / frame-time change | ❓ **not measured** (no benchmark was run; author's PC was in use) |
| Streaming out/in and save/load in a live world | 🟡 by construction only (see Lifecycle), not run |

### What changed

- `public/models/settlement/wood_pile_tiers.glb` (109 KB) — firewood-only extract of the V2 `stockpiles.glb` tiers `pile_firewood_{1,5,7,14,20}`. Reproduce with `node scripts/assets/extract-wood-pile-tiers.mjs <seedvale-2 checkout>`. V2 asset contract: own Blender models, no credits.
- `src/settlement/woodPileTiers.ts` — bakes one immutable geometry per tier (scale `WOOD_PILE_TIER_SCALE = 1.4` baked in) + one shared material, once per app; per-settlement `InstancedMesh` pools.
- `src/settlement/props.ts` — uses the pools when the tier GLB loads; otherwise the previous progressive/`wood_pile.glb` path is unchanged (fallback).
- Quantity thresholds and `woodPileOverflowCount` are untouched. Stage → V2 tier is presentation only: `Pile_01→1`, `Pile_05→5`, `Pile_10→7`, `Pile_18→14`, `Pile_29→20`.

### Asset characteristics (before → after)

| | V1 `wood_pile_progressive.glb` | `wood_pile_tiers.glb` |
|---|---|---|
| File | 678 KB | 109 KB (+ `wood_pile.glb` 62 KB still used by static piles/fallback) |
| Tris, largest tier | 5 632 (all 5 variants 12 549 loaded per pile) | 3 120 (all 5 tiers 7 332, shared once) |
| Materials | 2 (`mat20`, `mat18`) per pile → 2 primitives per visible pile | 1 (`stockpiles_vc`, vertex colours) |
| Attributes | POSITION, NORMAL | POSITION, NORMAL, COLOR_0 |
| Largest tier in-game size | ≈ 1.9 × 1.35 × 2.4 m (height-fitted ×2.05) | 1.75 × 1.41 × 2.0 m (V2 1.25 × 1.01 × 1.44 ×1.4) |
| Per-pile mesh/geometry clones | 1 full clone (5 variants) per household + primary | none; geometry shared |

Footprints stay inside the V1 envelope (collider `WOOD_PILE_COLLISION_RADIUS` 1.2 unchanged). Mid tiers are slightly shallower in Z than V1 (e.g. `Pile_10` V1 ≈ 1.7×0.72×1.85 vs V2 1.67×0.69×1.27); the author should judge this.

### Stage C classification

| Pile | Kind | Treatment |
|---|---|---|
| Primary settlement stockpile | quantity-driven | tier pool `storageWoodSettlementPrimary` |
| Overflow (max 2) | quantity-driven | tier pool `storageWoodSettlementOverflow`, always largest tier, same offsets |
| Household yard piles | quantity-driven | tier pool `storageWoodHousehold`, slot index == household yard index |
| Secondary stockpile (LG/XL) | **static** `wood_pile.glb`, no economy link | unchanged |
| Woodshed-complete pile | **static** procedural `createStockpile()` | unchanged |

### Instancing design

Per settlement and per shadow kind, one `InstancedMesh` per tier in use (created lazily, capacity = slot count). A slot tier change rewrites only the old and new tier meshes (≤ slot count matrices), recomputes their bounding sphere, hides meshes with count 0. Unchanged tier → no buffer write. Pools are kept per shadow kind so `sceneCensus` attribution is unchanged. Not instanced across settlements: keeps unload/reload local to one settlement group.

Expected submissions (static reasoning, ❓ not measured): before, each visible pile = 2 draws (2 materials) in the main pass, and again per shadow cascade/mirror pass. After, primary ≤ 1, overflow ≤ 1, households ≤ distinct tiers in use (≤ 5) — e.g. 8 households with 8 piles in 3 tiers: 16 → 3. Triangles per visible pile are lower (≤ 3 120 vs ≤ 5 632).

### Lifecycle / ownership

- State owner: `Household` / `SettlementEconomy` (read-only; `sync()` never writes). No change to NPC delivery or quantities.
- Runtime owner: the settlement `group`; pool groups are children, disposed by `disposeSettlementGroup` → `disposeObject3D` (frees each `InstancedMesh` buffer, skips `sharedGpu` geometry/material — covered by test).
- Templates live for the app lifetime (module memo + loader cache), like other cached GLBs.
- Stream-in rebuilds pools from the same anchors and the first `sync()` restores tiers from persisted stock (no visual state is persisted). Save version unchanged.
- No worldgen cache namespace affected (presentation only).

### Open items

1. Browser check of look (flat vs smooth shading, vertex colours vs old materials, shadow, mirror, night). Candidate tweak if too different: `WOOD_PILE_TIER_SCALE`, or a per-instance yaw jitter (not added: placement kept deterministic and unrotated like before).
2. Matched before/after benchmark on the author's machine — see runbook below.
3. Further instancing (cross-settlement, or secondary/woodshed piles) is **not** justified yet: both are static singletons per settlement; decide after step 2.

### Author benchmark runbook

Use `docs/performance/2026-10-27--arc-baseline-runbook.md` (`?benchmark=settlement-heavy`, ≥3 warmed reps) on commit `<this commit>^` (before) and `<this commit>` (after), same seed, camera, viewport, weather, graphics settings. Settlement-heavy was not matched across reps in the latest recapture (`3e7e7dc0`), so treat any delta as **diagnostic** unless NPC/household populations and stock tiers match. Compare main/shadow/mirror draw calls, triangles, frame p50/p95/p99, and the woodpile rows of the settlement shadow census.
