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
