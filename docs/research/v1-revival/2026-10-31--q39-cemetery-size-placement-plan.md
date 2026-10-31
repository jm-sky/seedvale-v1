# Q39 — Cemetery size, layout and placement (V2 donor): recon and implementation plan

**Created:** 2026-10-31 by Claude Opus 5.5 (queue Q39, O→S)  
**Status:** plan. Implementation is queue **Q47** (Sonnet). Two optional, placement-neutral additions wait for the author (§6). The visual result needs author sign-off (queue §2), like every epoch-1 layout slice.  
**Authority:** [P2 author decisions — Q39](./2026-10-31--p2-author-decisions-q38-q39-q31-q42.md#q39--cemeteries) (reuse the V2 layout and grave/crypt assets, adapted to V1; keep V1 simulation, grave-slot/quest/treasure semantics and stable references; changes belong to epoch 1). [Strategic Brief §3 "Cemeteries"](./STRATEGIC-BRIEF.md) (graves with plaques, crypt count related to settlement size). [Q29 batch plan §2–§3](./2026-10-30--q29-revival-epoch-batch-plan.md) (batch rules). [Cemetery comparison](./2026-10-26--dog-elder-cemeteries-comparison.md) (preservation inputs). The epoch is already `WORLDGEN_EPOCH = 1` (Q33) and stays 1. Source facts were checked against V1 `main` at `bf10c7c` and against V3 `main` at `47733d6` (the V2 snapshot under `docs/comparison/code/SeedVales-v2/`). The code is authoritative.

## 1. Recon findings (✅ verified)

### 1.1 V1 today

| # | Finding | Evidence |
| --- | --- | --- |
| F1 | **One seam for grave positions.** `cemeteryGraveLayout(size, scale)` is a pure function of size and scale. It is consumed by the renderer and by all four slot users: Hidden Finds (`hiddenFinds.ts:151/242`, spot id `${landmarkId}:${index}`), treasure keys (`treasureSites.ts:382`), the Lost Treasure chronicle (`lostTreasureChronicleSearch.ts:184/212`) and the bear-cave map grave (`treasureMapBearCave.ts:110/228`). It is also used for road clearance (`chunkEnvironment.ts:266`). Every user picks `index % layout.length` or iterates the list, so a new list with the same signature and a stable order carries all four with it. | `settlement/decorProps.ts:849` |
| F2 | **Current layout:** a grid of 9/18/36 graves (SM/MD/LG, 1/2/3 blocks) in front of a Poly `cemetery.glb` centrepiece. `grave_a.glb` clones are placed with per-grave jitter from `variant` and per-grave terrain height/tilt. There are no crypts. | `decorProps.ts:837–948`, `propSpecs.ts:106–112` |
| F3 | **Rendering:** each grave is a cloned group inside the per-chunk `chunk-environment` group (`buildPlacementGroup`). There is no merging or instancing, so an LG cemetery is about 37+ draws for the main pass, plus shadow draws. `disposeObject3D` on unload disposes every geometry not flagged `userData.sharedGpu`. | `chunkManager.ts:2471–2492`, `1931`, `2801`; `assets/loadGltf.ts:217` |
| F4 | **Collision:** cemetery collider radius is **0** (`ENVIRONMENT_COLLISION_RADIUS.cemetery`). The registry supports `obb` colliders. | `chunkManager.ts:284`, `world/collision.ts:36` |
| F5 | **Assignment** (keep): dedicated per settlement, mutual-best SM pairs share one, stable ids `cemetery:a:<ids>:<h>` / `cemetery:w:<cx>:<cz>:<n>:<h>`. **Size** is a seeded roll from the served sizes (`rollCemeterySizeForAssignment`). An LG settlement gets an MD cemetery 58 % of the time, which is weakly related to settlement size. | `terrain/cemeteryAssignment.ts:196–220` |
| F6 | **Placement** checks only the **centre point** for water, road tint, slope and clearings (`rejectsClearings` uses centre + 2 m pad). Roads use a circular footprint bound. The whole plot must fit inside the **owner chunk** (64 m) with a fixed margin of 6/9/14 m, because rendering samples the owner tile's apron grid. `rotationY` is a random roll that does not depend on the candidate. | `cemeteryPlacement.ts:33, 141–198, 226–270` |
| F7 | **Vegetation and rocks are not cleared from cemeteries.** Only old-tree landmarks clear trees (`clearVegetationAroundOldTrees`, run in the worker after `computeChunkEnvironment`). | `chunkEnvironment.ts:347`, `chunkHeightmap.worker.ts:61–62` |
| F8 | **Persisted references:** Hidden Find spot ids, treasure/chronicle/bear-cave grave indices (all derived, rebuilt from seed + generator). NPC burials stay `grave:<npcId>` at the corpse position, so they are **not** cemetery slots and this slice does not touch them. Caches: `chunk-tiles`, `abandoned-cemeteries` (plus `locations-coarse` if it stores cemetery poses). The tools-020 boot fixtures must be re-exported. | `worldgenEpoch.ts` checklist, `worldgenFixtureNamespaces.ts`, `abandonedCemeteryCache.ts` |

### 1.2 V2 donor

| # | Finding | Evidence |
| --- | --- | --- |
| D1 | **Asset:** `public/assets/parked/graveyard.glb`, 289 KB, blob `a6ea99f8…` (identical in V2 and V3). It was built by V3 `scripts/assets/build-pack-pieces.mjs` from **Kay Lousberg "Halloween Bits" (CC0, via Poly Pizza)**. One material (`HalloweenBits`, 512² PNG atlas, metallic 0), meshopt + `KHR_mesh_quantization` (V1's `loadGltf` already sets `MeshoptDecoder`). Pieces sit under wrapper nodes with stable names at 1 unit = 1 m, origin on the ground. | V3 build script header; GLB JSON |
| D2 | **Pieces used:** `Grave` (1.0 × 0.5 m footprint, 1.06 m tall, 323 tris), `Gravestone` (271), `Grave_Marker_A` (56), `Grave_Marker_B` (136), `Grave_Damaged` (416), `Crypt` (4.2 × 5.6 m footprint, 5.6 m tall, 952 tris). The pack also has fences (stone/iron, broken variants, gate, pillars), an arch, a bench, path tiles, lanterns and candles. V2 does not use those, and this plan does not either (see §6). All pieces are **markers only**. There is no grave mound in the mesh. | GLB node bounds |
| D3 | **V2 layout** (`world/gen/cemeteries.ts`): a rectangular plot with the entrance at local +Z, crypts centred in the back row, and plain graves on a grid with a central aisle. Per class: SM 4 cols / 8–10 graves / 1 crypt, MD 5 / 14–16 / 2, LG 7 / 24–26 / 3. Spacing `GRAVE_DX 2.6`, `GRAVE_DZ 3.2`, `AISLE 1.6`, margin 2.5, tomb row 6.4, tomb slot 6.2. Jitter ±0.25/±0.3 m, yaw ±0.1 (graves) and ±0.05 (tombs). | V2 `layoutGraves` |
| D4 | **V2 defect, do not copy:** `hd` is computed as the **full** layout depth but used as a **half**-extent. The graves fill only the back half, the front half of the plot is empty, and the bounding radius is about 2× too deep (SM: R ≈ 22.7 m instead of ≈ 13.5 m). | V2 `layoutGraves` (`z0 = -hd + …`) |
| D5 | **V2 placement:** one cemetery per settlement on rings outward from the built area, with the plot rotated so the entrance faces the settlement (`rot = atan2(s.x − x, s.z − z)`). Rejects: structures, other cemeteries, roads (R + 3), water within R + 12, bad biomes, and a **height spread > 2.5 m** across a rotated 5×5 sample of the plot. Trees and rocks are kept off by the flat mask. V2's `rotate()` is the same convention as V1 `rotateOffsetY` (`x·c + z·s, −x·s + z·c`), so the yaw formula ports unchanged. | V2 `placeCemeteries`, V1 `propUtils.ts:85` |
| D6 | **V2 rendering:** all pieces of one cemetery are merged into one geometry per material (one atlas, so one draw), built near the player and released when they leave. The crypt sinks 0.3 m. Colliders are the rotated per-piece footprints. | V2 `render/cemeteries.ts`, `sim/landmarkSolids.ts` |

## 2. Design (decided by Opus within the approved direction)

### 2.1 Layout: `cemeteryGraveLayout` is replaced, its signature is kept

1. **V2 class table with fixed counts** (V2 base + 1, the midpoint of V2's range): **SM 4 cols × 9 graves + 1 crypt, MD 5 × 15 + 2, LG 7 × 25 + 3.** V2 spacing, aisle, margins, tomb row and slot are kept. Counts are fixed per size, not per cemetery id, so the function stays a pure `(size, scale)` and none of the six call sites change signature. Variety comes from the piece choice (§2.3), the yaw and the terrain.
2. **The plot is centred** (fixes D4). Compute the full depth `D = 2·margin + tombRow + rows·DZ` and width `W`, then set half-extents `hw = W/2`, `hd = D/2`. The crypt row is at the back (−Z) and the entrance is at +Z. The new pure `cemeteryPlotExtents(size, scale) → { hw, hd }` is the single footprint source. Results (scale 1): SM ≈ 8.5 × 10.5 (R ≈ 13.5 m), MD ≈ 9.8 × 10.5 (R ≈ 14.4 m), LG ≈ 12.4 × 12.1 (R ≈ 17.3 m).
3. **Slots = plain graves only, in a stable order:** row-major from the crypt row towards the entrance, left to right in local X. **Crypts are not dig slots.** A new pure `cemeteryCryptLayout(size, scale)` returns the crypt poses. Crypt interiors were not selected (brief).
4. **The slot point is the grave plot, not the marker.** The marker stands 0.9 m behind the slot (towards the crypts) and faces the entrance. That keeps the dig spot outside the marker collider (§2.4). The tolerance is 1.32 m (`HIDDEN_FIND_DIG_TOLERANCE`).
5. **Jitter moves into the layout** as a deterministic hash of `(size, index)`, with V2 amplitudes. Render, colliders and slots then use identical positions. `createCemetery` adds no jitter of its own any more.
6. **Scale** (0.9–1.2, rolled as today) multiplies spacing and pieces, as it does today.

### 2.2 Size mapping: strict, so crypt count follows settlement size

`rollCemeterySizeForAssignment` becomes a mapping: **OUTPOST/SM → SM (1 crypt), MD → MD (2), LG/XL → LG (3); a shared SM pair → MD** (two villages' dead). Abandoned cemeteries keep their 70 % SM / 30 % MD roll. `CEMETERY_MAX_FINDS` (2/4/7) stays below the new counts.

### 2.3 Pieces and rendering

1. **Asset:** copy V2 `graveyard.glb` unchanged to `public/models/nature/graveyard.glb`. Add a `GRAVEYARD_GLB` spec and node-name constants in `propSpecs.ts` (the one place that names the asset). Load it **without** the height normalisation that `memoTemplates` applies (the pieces are already in metres). Extract pieces by wrapper-node name and bake each mesh's transform relative to its wrapper.
2. **Piece choice** per slot from `hash(variant, index)` with V2 weights (`Grave` .35, `Gravestone` .25, `Grave_Marker_A` .15, `Grave_Marker_B` .15, `Grave_Damaged` .10). **Abandoned** cemeteries (`cemetery:w:` ids) use `Grave_Damaged` .45 and the others scaled down.
3. **One merged mesh per cemetery** (V2 D6): the slots' markers and crypts are baked with their world-relative matrices (rotated offset, sampled height, tilt ≤ 12° for markers; crypts are not tilted and sit at the **lowest** of their four corner heights, never floating, minus 0.1 m). They are merged into one `BufferGeometry` with the shared atlas material, giving **1 main + 1 shadow draw per cemetery** instead of about 10–37 + shadows. Positions and normals are de-quantized to `Float32` before the matrix is applied (quantized `Int16` attributes cannot take `applyMatrix4`). The merged geometry is per-instance, so `disposeObject3D` frees it on unload. The template material and texture must carry `userData.sharedGpu` so they survive. `three/examples/jsm/utils/BufferGeometryUtils.mergeGeometries` is allowed. No V1 merge utility exists to reuse.
4. **Retire** the Poly `cemetery.glb` centrepiece and `grave_a.glb` from the cemetery path. Keep the procedural fallback: if the GLB fails, markers become `createGraveStone` and crypts become a `4.2 × 3 × 5.6` box (V2 fallback). Delete the two GLB files only if nothing else references them, and update CREDITS/MODELS.
5. **Triangle budget:** LG ≈ 25 × ~280 + 3 × 952 ≈ 10 k tris per cemetery, all in one draw. Build cost is measured with the existing `PROPS` hitch monitor around the cemetery build (§4).

### 2.4 Colliders

Add per-piece **OBB colliders**, derived from the same layout, to the owner chunk's `rebuildColliders`. A marker gets its piece half-extents × scale (for example `Grave` 0.5 × 0.25). A crypt gets 2.1 × 2.8 × scale. The plot itself has no collider. Aisles (1.6 m) and grave gaps (≥ 1.6 m across, ≥ 2.6 m between rows) stay walkable for the player, NPCs and fauna. Graves stand in front of the markers, outside the OBBs, so digging still works.

### 2.5 Placement: footprint-aware, entrance towards the settlement

All changes are in `cemeteryPlacement.ts` / `chunkEnvironment.ts`, reusing the existing validator.

1. **Yaw from the candidate:** dedicated → entrance faces the settlement centre (V2 formula). Shared → faces the nearer of the two settlements. Abandoned → seeded random, as today. Roll yaw after the candidate is chosen.
2. **Footprint checks** using `cemeteryPlotExtents`:
   - roads: circle `R + halfWidth + 2` (existing function, new R);
   - clearings: circle `R + CEMETERY_CLEARING_PAD` against each clearing disk, replacing the centre-point check;
   - water and height: a rotated **3×3** sample of the plot, every sample above `waterLevel + 0.3`, plot **height spread ≤ 2.5 m** (V2), and the four crypt corners spread ≤ 0.8 m;
   - centre slope and road tint: unchanged.
3. **Owner chunk:** replace the fixed 6/9/14 m margin with `R(size, scale)`, and update `abandonedCemeteryMaxOffsetFromCenter` to match. Because an R up to ~17–21 m leaves only a 22–30 m interior square in a 64 m chunk, each ring candidate is first **projected into its owner chunk's valid interior** (clamped, deterministic) before validation, instead of being discarded.
4. **Fringe band:** dedicated centre distance ∈ `[villageR·0.55, villageR·1.05 + R]`. The footprint-vs-clearing check now prevents overlap with the village. Keep the 6 rings × 9 bearings candidate set. The census (§4) decides whether more rings are needed.
5. **Clear the plot** in the worker. Generalise `clearVegetationAroundOldTrees` into a landmark clearance pass that drops trees/bushes/ferns and non-landmark environment props (rocks, logs) whose position falls inside a cemetery's rotated plot rectangle (+1 m). It must stay pure and worker-safe. Items are left alone (they have persisted ids; the epoch covers them anyway, but they are not in scope).

### 2.6 Caches, epoch, save

- `WORLDGEN_EPOCH` stays **1** (batch). `CURRENT_SAVE_VERSION` is unchanged: no persisted shape changes.
- Bump `chunk-tiles` and `abandoned-cemeteries`, and `locations-coarse` if it stores cemetery pose or size. Check `worldgenFixtureNamespaces.ts`. Mark the tools-020 fixtures stale and list them for browser re-export, as Q33 did.

## 3. Implementation steps (Q47, Sonnet)

1. Asset + specs: copy `graveyard.glb`, add `GRAVEYARD_GLB`/piece constants, and add a loader that returns `{ pieces: Record<name, {geometry, material}>, material }` (de-quantized, wrapper-relative), with the procedural fallback. Update CREDITS (Kay Lousberg, CC0, Poly Pizza, "Halloween Bits") and MODELS M35.
2. Layout: `cemeteryPlotExtents`, new `cemeteryGraveLayout` (slots + marker pose + piece id), and `cemeteryCryptLayout` in `decorProps.ts`. Add unit tests for counts (9/15/25 and 1/2/3 crypts), the stable order, no marker/crypt OBB overlaps, every slot outside every OBB, every element inside the extents, and slot `i` unchanged between two calls.
3. Size mapping in `cemeteryAssignment.ts` and its tests.
4. Placement (§2.5.1–4) in `cemeteryPlacement.ts`/`chunkEnvironment.ts`, plus tests: yaw faces the settlement (the entrance point is closer than the centre), footprint vs clearing/road, spread rejection, interior projection keeps candidates deterministic.
5. Worker clearance pass (§2.5.5) and its test.
6. Renderer: `createCemetery` builds the merged mesh from the layout and pieces, and `chunkManager` passes the loaded pack. `contentTemplatesReady` waits for the pack instead of the old templates. Add OBB colliders in `rebuildColliders`. Wrap the build in a `PROPS` hitch record.
7. Census script `pnpm worldgen:cemeteries:census` (model: `census-house-yards.ts`). For seeds 42 and 415424794 within 5 rings, record: active assignments placed / split / none per size, abandoned count, plot–clearing/road overlaps (must be 0), trees/rocks left inside plots (must be 0), and mean centre distance to the served settlement. Run it **before** (current `main`) and after, and put both tables in §5.
8. Bump caches, run the targeted tests (`cemetery*`, `chunkEnvironment`, `hiddenFinds`, `treasureSites`, `lostTreasureChronicleSearch`, `treasureMapBearCave`, worldgen cache/fixture tests), `npx tsc --noEmit`, lint and `pnpm docs:sync`. Update STATE/CODE_INDEX if the owner set changes, add a queue §2 visual entry, and write §5 notes.

**Not in Q47:** fences/gate/arch and readable inscriptions (§6, author), burials into cemetery slots, crypt interiors, new quests, grass clearing, lanterns/candles, V2 dug-grave mounds (V1 dig visuals are unchanged).

## 4. Acceptance and stop conditions

**Done when:**
- every active assignment that resolved on current `main` still resolves (placed, or split → dedicated) on both seeds;
- `none` count ≤ before;
- 0 plot–clearing and 0 plot–road overlaps; 0 trees/rocks inside plots;
- counts per size match §2.1 and crypts per size are 1/2/3;
- the four slot consumers' tests pass with the same roles resolving (hidden finds, treasure key grave, chronicle grave, bear-cave map grave);
- cemetery main-pass draws = 1 per built cemetery (renderer counters or a unit test on the built group);
- cemetery build time is recorded (PROPS hitch) and stays under ~2 ms per LG on WSL;
- caches are bumped and the §2 visual entry is added.

**Stop if** (record in `Resume:` and hand to Opus/author):
- more than 5 % of the active assignments that placed before now fail (`none`, or dedicated fallback also fails) even with interior projection, which means placement needs a design fork (chunk-straddling plots with a world sampler, or smaller plots);
- a slot consumer can no longer resolve its role;
- the merged build costs more than ~4 ms per cemetery on WSL;
- the piece front axis does not match "faces +Z" and cannot be fixed by a constant yaw (needs visual judgement).

## 5. Implementation notes

_Filled by Q47._

## 6. Author questions (optional, placement-neutral, not blocking Q47)

Recorded in queue §3. Both fit inside the 2.5 m plot margin, so they move nothing and can land after epoch 1 closes.

1. **Cemetery fence.** The V2 pack contains a stone wall, an iron fence, broken variants, a gate, pillars and an arch. V2 did not use them. Options: (a) low stone wall with a gate at the entrance, broken variant for abandoned cemeteries (≈ +1.5–3 k tris, still the same single merged draw); (b) iron fence with a gate; (c) no fence. **Opus recommends (a).**
2. **Readable plaques.** V2 had a "Read the inscription" interaction (surname from the settlement's families + epitaph). In V1, digging deliberately has no grave Interactable. Options: (a) later, as a separate small task (Interactable on the marker, separate from digging); (b) now, inside Q47; (c) never, plaques stay visual only. **Opus recommends (a).**
