# Q10 — Cave polish recon + IMP-004 distant bright holes

**Date:** 2026-10-30 · **Author:** Claude Opus 5.5 (queue Q10) · **Status:** recon done; IMP-004 fix landed as a D4 exception (author visual check pending); cave-polish stages are a **proposal**, not approved scope.

Sources: V1 code at the commit of this note (authoritative); the V3 summary is from a read-only sub-agent sweep of `../seedvale-v3/src/game` (file refs as reported, not re-verified line by line — marked 🟡).

## 1. IMP-004 — root cause

| Fact | Where |
| --- | --- |
| Every cave mouth registers a **permanent** terrain cutout (a real hole in the chunk mesh) for the lifetime of the `ChunkManager`. | `createCaves.ts:610–620`, `caveTerrainCutout.ts`, `terrain/terrainCutout.ts` |
| Full cave presentation (welded heightfield, underside mask, rock framing) streams in at 55 m and out at 80 m. | `cavePresentationLifecycle.ts:10–11` |
| Beyond that, a **distant mouth proxy** (world-terrain-026) covers the hole for every cave in the 3 × 3 × 500 m grid neighbourhood (covers the whole terrain load radius). | `createCaves.ts:704–745`, `createCaveMouthProxy` |
| The proxy was a flat under-entrance plane + a fan whose rim sits **0.12 m inside** the opening contour and ≥ 0.2 m (often ~3 m on sloped mouths) **below** the walk surface. | `buildCaveMouthProxyBuffers` (`caveHeightfieldMesh.ts`) |

So between the terrain cut edge and the proxy rim there was an open band around the whole aperture. A distant (low-elevation) sight line that drops into the opening passes above the fan and leaves the hole **under** the terrain sheet on the far side. Terrain is single-sided (back faces culled), so the ray reaches the sky/fog background → a bright hole. Near the cave (≤ 55–80 m) full presentation's walls and ceiling catch the same rays, which is why the defect appears only at range.

Confirmed geometrically, not in a browser: a new ray test (below) leaks on every fixture with the old proxy, including at 12° elevation, and on the `basic` fixture the fan rim sits ~3 m under the surface of the uphill part of the opening.

## 2. IMP-004 — fix (landed, D4 exception)

`buildCaveMouthProxyBuffers` adds a **skirt**: per rim sample one lip vertex 0.5 m outside the contour, 6 cm under the walk surface, a foot vertex straight below it at fan-rim depth, a wall (lip → foot) and a ledge (foot → fan rim). Any sight line through the opening now meets proxy rock within ~0.5 m of the cut edge, under the terrain. Same approach as V3's "hole catcher" under every cut cell 🟡.

- **D4 exception — reason:** correctness/visual defect reported by the author in playtest (INBOX IMP-004); fix is local to proxy geometry.
- **Workload impact:** no new draw call, material, program, pass or per-frame work. Per visible proxy +64 vertices / +128 triangles (32 rim samples × 2 quads), built once when the proxy is first shown. Within noise; no measurement needed.
- **Unchanged:** terrain cutout, full presentation, streaming distances, gameplay queries, fog behaviour (the proxy material keeps `fog: true`).
- **Test:** `caveHeightfieldMesh.test.ts` › "cave mouth proxy closes the aperture at distance (IMP-004)" casts sight lines at 1.5/3/6/12° from 12 yaws into every opening sample of every heightfield fixture and requires a proxy hit before the ray is > 0.8 m outside the opening under the terrain. Fails on the old proxy, passes with the skirt. Existing proxy test (all vertices under the walk surface) still passes.
- **Not verified:** real terrain is a ~1 m grid interpolation of `walkSurfaceAt`, so on strongly convex ground a lip vertex could graze the sheet. **Author visual check** (queue §2): `?seed=415424794`, look at a cave mouth from 100–250 m, several angles and times of day — no bright hole, no dark specks poking through the grass around the mouth; approach to < 55 m — no visible pop when full presentation replaces the proxy.

## 3. V1 cave state (for the polish plan)

| Area | V1 today |
| --- | --- |
| Entrance geometry | Welded heightfield floor/ceiling mesh; ceiling clipped on the same `mouthOpeningAt` contour as the terrain cut; contour-driven rock framing (`createMouthRocks`, dense 12-sample frame + outer anchors). |
| Terrain blending | Real terrain cutout on the exact contour; terrain edge pinned to `walkSurfaceAt`; fog-exempt dark **underside mask** beam (+ deep mouth patches, under-entrance plane) hides the seam near; proxy far. |
| Transition | Cave presentation is exempt from scene fog; `inCaveInterior` suppresses scene fog/lightning (`gameLoop.ts:300–328`); torch range/intensity boosted in caves (`torchLightPresets.ts`). No ambient/exposure transition. |
| Interior | One shared `MeshStandardMaterial` with triplanar detail normals, procedural rock normal, wetness/seepage (`caveHeightfieldMaterial.ts`); interior rocks; adventure lanterns via point-light budget; underground pools. |
| Streaming | Presentation 55/80 m hysteresis, queued builds; proxy beyond. |

## 4. V3 comparison (🟡 sub-agent summary)

| Area | V3 | Value for V1 |
| --- | --- | --- |
| Entrance | Grid-cave look: wall columns, **lintel brow** leaning out ≤ 0.6 m with noise, 3-band wall bulge (`render/caveMesh.ts:151–331`). Heightfield look is a V1 port; V1 rock framing and proxy were *not* ported. | Brow/overhang is the one entrance idea V1 lacks. |
| Terrain blend | Hole + underside mask (same V1 constants) + hole catcher under every cut cell; V1's deep mouth patches dropped there because they "poked through as dark wedges"; grass uses the same cut predicate; tree placement avoids caves. | Catcher idea used for IMP-004. Check whether V1 has the dark-wedge artefact and whether V1 grass/trees respect the cutout (❓ not verified here). |
| Transition | Camera-following warm point light inside the field (pops on/off, no fade); weather/grass/fog suppressed inside. | V1 already suppresses weather/fog; a soft entry light/exposure ramp is a candidate. |
| Interior | Same material family (V1 port); wetness cut to 1 octave for cost (17.5 → 4.6 ms interior on WSL GPU). | Check V1's wetness octave count before any interior work — possible GPU cost item. |
| Distance | No streaming; ≤ 3 caves built up front; terrain near caves forced to one LOD. | Not applicable — V1 streaming + proxy is ahead. |

## 5. Staged post-P1 proposal (needs author approval; D4: after P1 exit)

| Stage | Content | Model | Gate |
| --- | --- | --- | --- |
| C0 | Author visual check of IMP-004 and a short cave screenshot set (mouth near/mid/far, interior, entering at day/night) to name concrete defects. | author | — |
| C1 | Verify/fix V1 vegetation in the hole (grass/flowers/trees on the cutout) and the dark-wedge artefact of deep mouth patches. | S | Correctness → may be D4 exception if workload-neutral. |
| C2 | Entrance brow/overhang on the heightfield mouth (V3 lintel idea, no grid-cave port). | O→S | Visual change → author review; no new draw call. |
| C3 | Entry transition: soft interior light/exposure ramp replacing the abrupt fog switch. | S | Needs author look choice; per-frame cost must be one uniform/light update. |
| C4 | Interior material cost check (wetness octaves/warp vs V3's 1-octave cut), only if a GPU trace shows cave interiors as a cost. | S | Performance evidence (WSL + Windows). |

Questions for the author are recorded in queue §3 only when a stage is picked up; nothing here is blocked now.
