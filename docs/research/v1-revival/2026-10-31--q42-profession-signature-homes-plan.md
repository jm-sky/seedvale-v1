# Q42 — Profession-signature homes: dressing plan

**Date:** 2026-10-31 · **Author:** Claude Opus 5.5 (autonomous session, queue Q42) · **Status:** plan — implementation → queue **Q48** (S)  
**Authority:** [P2 author decisions §Q42](./2026-10-31--p2-author-decisions-q38-q39-q31-q42.md#q42--profession-signature-homes), [Q29 plan — profession-signature homes](./2026-10-30--q29-revival-epoch-batch-plan.md#profession-signature-homes--author-approved-outcome-2026-10-31), [Q34 plan §2.4/§5](./2026-10-31--q34-house-yard-footprint-plan.md) (3.0 × 2.0 m profession slot, landed in Q41).  
**Legend:** ✅ verified in code/assets while writing · 🟡 judgement call (reversible) · ❓ open (author).

## 1. Findings

### 1.1 V3 donor (read from `jm-sky/seedvale-v3` @ `47733d6`)

- ✅ **Mechanism:** V3 dressing is **hand-authored** per household slot in one canonical hamlet (`public/worlds/canon/overlay/areas/home.json`, settlement--001 H4b-1). There is **no procedural assignment** to copy — only assets, kit dimensions and the wall-mount geometry. V1 needs its own deterministic projection (§2).
- ✅ **Wall-mount math** (`src/game/world/structures/wallKits.ts`, pure, ~80 lines): `wallKitAt(def, side, along)` puts a kit with its back on the exterior wall face (`WALL_FACE_OFFSET_M = 0.31` beyond the footprint), `openingSpans` derives door/window spans from 2 m module centres (`-len/2 + 1 + 2·moduleIndex`), `wallKitFits` rejects kits overlapping an opening (x and y ranges). ✅ V3 `houseDefs.ts` states it was **ported from V1 `houseDefinitionExample.ts`** and V1 uses the same `wall_plaster_*` MegaKit pieces (`PLASTER_WALL_TOP_Y = 3.12`), so the constants transfer. V1 `HouseOpening` carries `side` + `moduleIndex` (✅ `houseDefinitionExampleConfig.ts:27`).
- ✅ **Assets** — `public/assets/props.glb` (V3, 1.34 MB, 32 root nodes, 6 materials / 6 textures). Profession-relevant root nodes, triangles and materials (measured from the GLB JSON):

| V3 node | Kit (V3 `kitTable.ts`: half W × half D × top, m) | Tris | Materials | Profession cue |
| --- | --- | --- | --- | --- |
| `Hamlet_Antlers` | `antlers` wall, 0.46 × 0.40, mount 2.9 → top 3.64 | 672 | vertex colour | hunter (over the door) |
| `Hamlet_HidesFrame` | `hides-frame` 1.0 × 0.4 × 2.0 | 318 | vertex colour | hunter (yard) |
| `Hamlet_Shield` | `shield-on-wall` 0.34 × 0.20, mount 1.26 | 491 | `MI_Trim_Furniture`, `MI_Trim_Metal`, `MI_Trim_Props_Vertex` | guard |
| `Hamlet_Banner` | `banner-on-wall` 0.34 × 0.15, mount 1.15 | 368 | vertex colour | guard |
| `Hamlet_NetOnWall` | `net-on-wall` 1.03 × 0.10, mount 0.85 | 496 | vertex colour | fisher (wall) |
| `Hamlet_DryingRack` | `drying-rack` 1.25 × 0.27 × 1.85 (fish on an A-frame) | 764 | vertex colour | fisher (yard) |
| `Hamlet_NetPoles` | `net-poles` 1.5 × 0.1 × 2.4 | 840 | vertex colour | fisher (alt. yard) |
| `Hamlet_Axe` (+ procedural stump) | `stump-with-axe` 0.5 × 0.45 × 1.2 | 412 + stump | `MI_Trim_Props_Vertex` | woodcutter |
| `Hamlet_Sack` | `sacks` 0.55 × 0.40 (3 sacks) | 428 ×3 | `MI_Banner`, `MI_Trim_Furniture` | farmer |
| `Hamlet_HerbBed` | `herb-bed` 1.0 × 0.5 × 0.6 | **2208** | vertex colour | herbalist (V3: hunter) |
| `Hamlet_Cart` | `hand-cart` 1.2 × 0.5 × 2.1 (market cart with awning) | 1392 | 3 trim materials | trader |

  Licences: Quaternius packs CC0; **`Hamlet_Antlers` = "Antlers" by Poly by Google, CC BY 3.0** — V3's own audit (`docs/assets/ASSET-QUALITY-INDEX.md` item 5) notes the credit is **missing** from V3 `CREDITS-CC-BY.txt`; V1 must add it (poly.pizza id `9oH6TjelO-W`). The hides/nets/drying-rack/herb-bed are V3-authored Blender bakes (`assets-src/{hides,nets,drying-rack}`), project-owned.
- ✅ V3 coverage stops at guard, hunter, fisher, woodcutter, farmer (+ smith anvil/workbench, trader stall at the green, elder lantern). **V1 roles with no V3 cue:** `miner`, `shepherd`, `textile_worker`; `herbalist` has only the herb bed (V3 gave it to the hunter).

### 1.2 V1 receiver

- ✅ Roles are **generation-time** data: `FamilyMember.character.role` (11 roles, `src/ai/characters.ts:13`), set by `professionStaffing.ts`; no runtime reassignment exists (`NpcAgent.role` is copied once). Dressing can therefore be a **pure projection of `def.families` + `plan.plots`**, exactly like the blacksmith workplace (`createSettlement.ts:751` `blacksmithFamilyIndices` → `props.ts:1788`).
- ✅ A per-household representative profession already exists: `representativeProfession(family)` in `professionFamilySurnames.ts:57` (adults only, `FAMILY_SURNAME_ROLE_RANK`). Reuse it (export it) instead of a second ranking.
- ✅ Every planned house has `plot.yard` (Q41) with `slots.profession` (centre) and `professionHalf` = 1.5 × 1.0 m, inside the yard rectangle behind the back wall, gate on a seeded side. **The blacksmith workplace already occupies that slot** (`blacksmithYardGeometry(yard)`).
- ✅ House shells are instanced per definition (settlement-wide group, Q5 Track B), so per-household dressing cannot live in `HouseDefinition.decorations` (that is per definition, e.g. chimneys). It needs its own settlement-owned batch.
- ✅ Yard props, fences and wood piles are settlement-owned instanced/merged groups built in `buildSettlementProps` (`props.ts`); V1 already extracts V3 assets with scripts (`extract-tree-lod.mjs`, `extract-wood-pile-tiers.mjs`) and has `@gltf-transform/*` + `meshoptimizer`.
- ✅ V1 item models usable as wall-hung tools (to check visually): `public/models/items/{pickaxe,shovel,scythe,sickle,pitchfork,fishing_rod,hunting_bow,spear,rope,wooden_bucket,axe}.glb`.

### 1.3 Epoch / footprint verdict

Every freestanding donor piece fits inside the reserved **3.0 × 2.0 m** profession slot (largest: cart 2.4 × 1.0, drying rack 2.5 × 0.54, net poles 3.0 × 0.2, herb bed 2.0 × 1.0, hides 2.0 × 0.8). Wall pieces sit on the house face (0.31 m + ≤ 0.4 m depth) and need no yard area. V3's haystack (Ø 2.8 m) does **not** fit and is excluded. **→ No additional spatial reservation is required in epoch 1; the Q29 "resolve footprint before the batch closes" condition is satisfied by the Q41 slot.** Dressing is derived at settlement build time (not cached in worldgen namespaces, not persisted), so it needs **no cache bump and no `WORLDGEN_EPOCH` change** and can land independently of the epoch batch.

## 2. Design

### 2.1 Assignment (pure, deterministic)

New pure module `src/settlement/professionDressing.ts` (three-free): `professionDressingFor(family, plot, houseDef, seed): DressingPlacement[]` returning kit kind, house-local or yard-local pose, and a stable id `dressing-<familyIndex>-<n>`.

1. **Primary profession** = `representativeProfession(family)` (exported from `professionFamilySurnames.ts`). `null` (no adult) → no dressing.
2. **Slot piece** (freestanding, in `slots.profession`): from the primary profession's table row. **If the family has a blacksmith, the slot stays the blacksmith workplace** (gameplay anchor wins), and the primary profession contributes wall pieces only.
3. **Wall pieces:** primary profession's wall kit(s) first; then **at most one** wall piece for the next-ranked *different* adult profession in the household (multi-profession households read as "hunter + farmer", capped at 3 wall pieces per house). 🟡
4. **Wall choice:** front wall first (door side, the "at a glance" side), then left/right; `along` candidates from module centres ± 0.5 m, first that passes `wallKitFits`; seeded per family (own stream `seed ^ SALT ^ familyIndex`, isolated from `coreRandom`, like the blacksmith yaw stream). No fit anywhere → piece omitted (counted in the census).
5. Dressing reflects the **household as generated**; it does not disappear if the professional dies (house identity, not live staffing). 🟡

### 2.2 Profession table (🟡 first proposal; author visual approval required)

| Role | Wall piece(s) | Slot piece | Source |
| --- | --- | --- | --- |
| hunter | antlers over the door (front, above the door frame) | hides frame | V3 |
| guard | shield + banner either side of the door | — (keeps slot free) | V3 |
| fisher | net on wall | drying rack with fish | V3 |
| woodcutter | — | stump with axe | V3 axe + V1 `tree_stump.glb` / V3 procedural stump |
| farmer | pitchfork/scythe leaning (V1 items) | sacks (3) | V3 sacks + V1 items |
| trader | — | market hand-cart | V3 |
| herbalist | — (❓ drying-herb bundle, no asset) | herb bed (simplify 2208 → ≤ 800 tris) | V3 |
| blacksmith | — | existing anvil + grind workbench (unchanged) | V1 |
| miner | pickaxe + shovel on wall (V1 items) | ❓ ore/stone pile (V3 `stockpiles.glb` `pile-stone-15`) | V1 / V3 |
| shepherd | ❓ no donor (crook / shears) | ❓ wool sacks / small hay bale | gap |
| textile_worker | ❓ no donor (skeins / cloth) | ❓ cloth-drying line (net-poles variant) | gap |

### 2.3 Assets

- New V1 pack `public/models/settlement/profession-dressing.glb`, produced by `scripts/assets/extract-profession-dressing.mjs` from V3 `props.glb` (+ `stockpiles.glb` if the miner pile is taken): copy only the nodes in §2.2, keep node names, `dedup` + `prune` + meshopt; record source blob SHA and per-node tris in `docs/assets/MODELS.md` and `CREDITS.md` (**add the CC BY 3.0 antler credit**).
- Material budget: vertex-colour nodes share one material; the textured trim nodes (shield, axe, sacks, cart) bring up to 3 trim textures. 🟡 Target **≤ 4 materials** in the pack; if a textured node is the only user of a material, prefer baking it to vertex colour in the extract script.
- Converted to V1 material conventions the same way other V3-donor props are (inspect `cemeteryPack.ts`, the most recent precedent) — no new material system.

### 2.4 Rendering

- One **settlement-owned merged mesh per material** (static geometry, placements never move): ≤ 4 main draws + shadow draws per settlement, independent of house count. Pattern: `cemeteryMesh.ts` (Q47) / yard-fence batch. Build inside `buildSettlementProps` next to the blacksmith workplace block, tagged with the existing settlement content kind for props (`tagSettlementShadowKind`).
- No per-house objects, no per-frame work. Wall pieces have **no collider**; slot pieces get one OBB collider each through the existing settlement collider path (yard props precedent).
- If V1 has a distance gate for small settlement props, reuse it for this group; otherwise record that the group is drawn with the settlement and measure (§3).

## 3. Implementation slice (queue Q48, S) and done-when

1. Export `representativeProfession`; add `professionDressing.ts` + tests: deterministic for equal input; no wall piece overlaps an opening (`wallKitFits` ported from V3 with V1 opening data); every slot piece's rotated footprint lies inside `professionHalf`; blacksmith households keep the slot; cap of 3 wall pieces; multi-profession case.
2. Asset extract script + pack + MODELS/CREDITS.
3. Render batch in `props.ts`; colliders for slot pieces.
4. **Census** `pnpm worldgen:dressing:census` (or a flag on the yards census): per seed 42 + 415424794 (rings ≤ 5) — households by primary profession, dressed / undressed, wall pieces omitted for lack of space, multi-profession households, pieces per settlement, added triangles per settlement size.
5. **Measurements:** draws added per settlement (expect ≤ 4 + shadow), triangles added for a representative XL, `PROPS` build-time delta in the hitch record. Performance A/B on `settlement-heavy` only if draws or tris exceed the budget; hand off via queue §4.
6. Queue §2 visual entry: hunter/guard/fisher/woodcutter houses in ≥ 2 orientations, door not blocked, antlers vs eave (V3 top 3.64 m is above the 3.12 m wall top — check on V1 eave-front houses), comparison shots vs V3 hamlet.

**Done when:** steps 1–5 with tests green, census in §5 below, no change to worldgen caches/epoch, §2 visual entry recorded (not marked passed).

**Stop if:** a slot piece blocks NPC access to the yard row or gate in a navigation test; added draws per settlement > 6; a profession needs footprint beyond 3 × 2 m; antler/eave clash needs a different model (visual compromise → author).

**Scope order:** donor-covered roles first (hunter, guard, fisher, woodcutter, farmer, trader, herbalist). Miner/shepherd/textile_worker wait for the author answer (§4).

## 4. Author questions (also queue §3)

1. ❓ **Professions without a V3 donor (shepherd, textile worker, miner pile, herbalist wall bundle):** (a) simple procedural/V1-item stand-ins in the same slice, visually approved later — recommended; (b) only donor-covered professions now, gaps in a later asset pass; (c) commission new models first (Blender/Cursor).
2. Defaults taken unless the author objects (🟡): primary profession = existing surname-ranking adult; one extra wall piece for a second profession; blacksmith keeps the slot; dressing stays after the professional dies.

**Author answer (2026-10-31, corrected):** dressing only for **selected professions**, as in V3, or with simple stand-ins (option (a)); a role without a good cue may stay undressed — §2.2 gaps are optional, not required. **No NPC character-model changes** (an earlier "Herbalist tint" note was a misunderstanding and was withdrawn). Defaults of question 2 stand.

## 5. Implementation notes

### Q48 step 1 (Sonnet, 2026-10-31) — pure assignment landed

- `src/settlement/professionDressing.ts` (+ test): `professionDressingFor(family, familyIndex, houseDef, yard, seed)` → wall pieces (house-local, V3 face offset 0.31 m, opening-aware `wallKitFits`, cap 3, front→left→right→back, own seed stream) and one slot piece (yard `profession` centre, yard yaw). Selected professions only: hunter, guard, fisher, woodcutter, farmer, trader, herbalist; miner/shepherd/textile_worker/blacksmith get no table row (blacksmith homes keep the slot). `representativeProfession` is now exported from `professionFamilySurnames.ts`.
- 🟡 Opening spans use fixed extents (±0.95 m, door top 2.4 m, window 0.9–2.3 m), not measured MegaKit geometry; revisit if the visual review shows clipping. Antler top (3.64 m) vs eave is still a visual check.
### Q48 steps 2–4 (Sonnet, 2026-10-31) — pack, render batch, census

- Pack: `scripts/assets/extract-profession-dressing.mjs <v3-root>` → `public/models/settlement/profession-dressing.glb` (10 nodes, 7 549 tris, 618 KB, 4 named materials + plain vertex colour). MODELS M101, CREDITS (antlers CC BY 3.0).
- Wall-kit specs corrected to the measured pack bounds (`bottomY/topY`, node-origin `mountY`, `outZ` as in V3 `kitModels.ts`): antlers 2.9–3.64 m, shield 1.27–1.93, banner 1.15–2.59, net 1.04–2.43. Kit local −z is outward; wall yaw = house yaw + {front 0, left π/2, right −π/2, back π}.
- Render: `professionDressingMesh.ts` bakes all placements into world-space geometry, one mesh per material (equivalent unnamed vertex-colour materials collapse into the first) → **≤ 5 draws per settlement** (limit 6), tagged `decor`. Stump is a stand-in cylinder (V3 stump is procedural too; axe leaned 0.25 rad) merged into the plain draw. Slot pieces register one OBB collider each (`professionDressingColliders`, halfU × halfV of the kit spec) through `registerSettlementColliders`; wall pieces have none. `buildSettlementProps` got a trailing optional `families` parameter.
- Census `pnpm worldgen:dressing:census` (rings ≤ 5; seeds 42 / 415424794): dressed houses 74–80 % (e.g. 415424794 LG 148/188, XL 66/83), max pieces per settlement 14 (XL), wall pieces 19–87 and slot pieces 38–122 per size class, 4–22 multi-profession houses per size class. Triangle upper bound for the worst XL ≈ 14 pieces × ≤ 2 208 tris ≈ 31 k (typical ≈ 8–10 k) — an estimate, not measured.
- 🟡 Not done: navigation test of yard-row/gate reachability with the slot colliders, `PROPS` build-time delta, herb-bed simplification (2 208 → ≤ 800 tris), §2 visual check (antler vs eave, stump stand-in, opening spans from fixed extents).
