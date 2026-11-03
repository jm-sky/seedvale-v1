# Animal surface polish (P2) — technical report

Script: `scripts/animalSurfacePolish.mjs` (gltf-transform patch of the original GLBs; no Blender round trip, so the sheep/horse Blender armature-import failures are bypassed). Originals: `public/models/fauna/experimental/original/`; variants B (materials) and C (materials + normals): `public/models/fauna/experimental/<name>.{B,C}.glb`. **Variant C is now the production `public/models/fauna/{sheep,wolf,cow,horse}.glb`**; revert by copying from `experimental/original/`.

## Changes
- **Materials (B):** metalness 0 everywhere. Roughness — sheep 0.92 (face/legs 0.85); wolf 0.82 (nose 0.45, eyes 0.3); cow 0.78 (muzzle 0.55, hooves 0.6, horns 0.5, eyes 0.3); horse 0.62 (mane 0.7, muzzle 0.55, hooves 0.6, eyes 0.3). Base colors untouched.
- **Normals (C):** per vertex slot, angle-weighted average of faces sharing the exact position (across primitives/material boundaries) whose face normal is within 50° of the slot's original normal; eye/hoof/horn materials keep original normals. Positions, topology and vertex slots unchanged.

## Automated validation (script, original vs output re-read)
Identical: triangle count, vertex positions, JOINTS/WEIGHTS, indices, material names/slots, node names + matrices (≤1e-5, float re-serialisation noise), skin joint counts + inverse bind matrices, every animation channel input/output. No new textures/UVs/draws.

## Limits / needs author decision
- **Not verified:** Blender A/B/C renders, Asset Browser/WebGL look, FPS (no claim). Author-owned visual check pending (queue §2).
- **Deer/stag (added later):** same pipeline, invariants identical; size deer +27%, stag +30%. Stag antlers (unskinned primitive) are smoothed; its eyes (`Material.011`) stay hard.
- **File size:** gltf-transform's meshopt encoder is less efficient than gltfpack: sheep +18%, wolf +26%, horse +32% (cow −7%), above the audit's 10% target. Meshopt FILTER mode was rejected because it lossy-quantizes animation data. Fix later by re-running gltfpack on the patched GLBs, or accept (all < 450 KiB).
- Smoothing angle (50°) and roughness values are first-pass; tune after visual review.

## Bear + boar (V3 migration, 2026-11-02)
Sources `public/models/fauna/v3/{Bear,Boar}.glb` (V3 rigs: 14/16 joints, clips Idle/Walk/Gallop/Attack/Eating/Death, same triangle counts 666 / 2308). Same script, new entries `bear`/`boar` (`SOURCES` points at the v3 files). Variant C is production `fauna/bear.glb` and `fauna/wild_boar.glb`; the previous V1 models are kept in `experimental/original/{bear,wild_boar}.glb` (rollback = copy back).
- **Smoothing angle per model:** bear 70°, boar 58° (`SMOOTH_DEG`). Boar grey (#55), eyes (#56) and pink (#57) primitives keep original normals.
- **Boar colour:** body base `[0.115,0.03,0.02]` → `[0.058,0.036,0.024]` (linear; less red, darker brown); mane/dark hair `[0.022,0.004,0.001]` → `[0.016,0.010,0.007]`. Roughness 0.85 body/mane, tusk-grey 0.5, snout 0.6, eyes 0.3 (V3 default was 0.55).
- **Fur variation:** baked `COLOR_0` (normalized uint8) from deterministic 2-octave value noise on position, multiplier ≈0.80–1.0 (bear ±18 %, boar body ±20 %, mane ±14 %). No new textures, draws or materials; bear keeps its 256² palette texture and white base factor, roughness 0.88 (was 1.0).
- **Validation (script):** triangle count, positions, indices, JOINTS/WEIGHTS, inverse bind matrices, all clip channels identical to the V3 source; file sizes bear 99.5→105.6 KiB, boar 132.1→148.3 KiB (old V1: 759 KiB / 307 KiB). Engine check: after `prepareProp` bear box identical to the old one (0.98×1.5×2.37), boar +8 % longer; forward = +Z for both.
- **Behavior change:** bear and boar now have a `Death` clip, so `collapse()` plays it and lingers on its last frame (previously `tipCorpse()` for bear; boar had no Death clip either). Boar `Gallop` is now used while sprinting (before: `Walk` fallback).
- **Not verified:** visual look in the browser (`?modelTest`), foot sliding of the new Walk/Gallop cycle against V1 movement speeds, FPS/draw calls (no change expected: same primitive/material count, one extra vertex attribute). `Eating` clip is exported but no V1 species consumes an eating role.

## Husky, Shiba, Donkey, Fox, Rat (2026-11-03)
Same script (new entries `husky`/`shiba`/`donkey`/`fox`/`rat`; the dog sources are `assets-src/fauna/original/dog_{husky,shiba}.glb`). Originals of all five are kept in `assets-src/fauna/original/` (rollback = copy back to `public/models/fauna/`). Variant C is production. The source GLBs had no textures and no `COLOR_0`; all had metalness 0.4 / roughness 0.415 (rat/husky/shiba/donkey) or 0.5/0 (fox). The script now skips `COLOR_0` generation on any primitive that already has it.

| Model | Smooth° | Material / colour changes (linear) | GLB before → after |
|-------|---------|------------------------------------|--------------------|
| husky | 55 | metalness 0; fur 0.82, nose/claws 0.5, eyes 0.3. Dark coat `0.05→0.10` grey; light slot `0.29 grey-green→0.72` white. Fur variation ±8 % | 927 536 → 863 148 B (−6.9 %) |
| shiba | 55 | fur 0.82, black 0.5, eyes 0.3. Main `[0.255,0.129,0.036]→[0.30,0.118,0.030]` rufous; light slot → cream `[0.62,0.52,0.38]`. Variation ±10 % | 851 196 → 793 576 B (−6.8 %) |
| donkey | 50 | fur 0.8, hair 0.75, muzzle 0.55, hooves 0.6, eyes 0.3. Body → warmer grey-brown `[0.175,0.155,0.135]`; pale slot `0.39→[0.46,0.42,0.36]`. Variation ±10 % | 341 904 → 454 464 B (+32.9 %) |
| fox | 55 | fur 0.8, black 0.45. Cream belly/chest/tail tip `[0.66,0.60,0.48]` (was grey-green); legs `0.10→0.05` dark. Orange body unchanged + ±10 % variation | 218 532 → 280 052 B (+28.1 %) |
| rat | 60 | fur 0.82, pink 0.7. Grey `[0.114,0.096,0.105]→[0.13,0.098,0.078]` (removes purple cast); pink slightly desaturated. No variation (tiny mesh) | 550 764 → 529 600 B (−3.8 %) |

- Normals: eyes/black detail/muzzle/hooves primitives keep original normals (`KEEP_HARD_BY_MODEL`).
- **Validation (script):** triangle count, positions, indices, JOINTS/WEIGHTS, node names + matrices, skin inverse bind matrices, every animation channel (24/24/26/12/6 clips), material names/slots identical to the originals. Primitive and material counts unchanged, no new textures.
- **Size:** donkey/fox (meshopt + quantized sources) grow ~30 % — the gltf-transform encoder is again less efficient than gltfpack (already the case for sheep/wolf/horse); lossless fix not available (`gltfpack` not installed, FILTER mode rejected). Dog/rat sources were uncompressed and shrink.
- **Visual check (partial):** side-by-side original vs C rendered in headless Chrome (SwiftShader software WebGL, standalone three.js page with hemisphere + directional light, 3/4 view, rest pose). All five look better than the originals: faceting gone, coat contrast readable. **Not done:** in-game `?modelTest`, animated poses, in-game lighting/FPS — author's visual review pending (queue §2). Donkey became somewhat warmer/browner than the original cool grey; a judgement call.
- **Test run:** `pnpm vitest run` 9012/9013 pass; the one failure is a 5 s timeout in `worldLocationCatalog.test.ts` (worldgen cache progress), unrelated to GLBs and load-dependent.
