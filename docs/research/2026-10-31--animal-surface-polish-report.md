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
