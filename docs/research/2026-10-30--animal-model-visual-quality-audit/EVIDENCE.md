# Evidence appendix — SeedVale V1 animal audit

Audit date: 2026-10-30. Repository commit: `cd3363c5b613d1240668add42f3755dea4320656`. All model paths are under `public/models/fauna/`. Production assets were read only.

## Original file identity

| File | Bytes | SHA-256 |
|---|---:|---|
| sheep.glb | 39,620 | `1c84319cbae081b21ac9c24557e909bb00ae3aa1e7e00e69f9557c0d441b0dff` |
| wolf.glb | 221,552 | `d91951f072efbcfec07fc5c14dd7121fcb4d96fd0debeb0e9d98b40401020fc3` |
| cow.glb | 1,028,584 | `aa0dfbd619bc14838b48f6db02a56c2ee96f055930d957fcc5ef63af567b21ce` |
| horse.glb | 342,928 | `dbe09f4e1a736a773477fbc5cb70875ebfc4ace4ca1302ead0a0cb97aba50851` |

## Complete clip inventory

Durations are measured from accessor time ranges; all channels target rotation/translation. No scale animation or morph-target channels were found. All samplers use LINEAR interpolation. Runtime clip selection is exact-name first, then case-insensitive `|name` suffix.

### Sheep

| Clip | Duration, seconds | Channels |
|---|---:|---:|
| `Armature|Idle` | 6.266667 | 13 |
| `Armature|Jump` | 1.133333 | 31 |

### Wolf

| Clip | Duration, seconds | Channels |
|---|---:|---:|
| `Attack` | 1.333333 | 53 |
| `Death` | 1.066667 | 53 |
| `Eating` | 2.533334 | 53 |
| `Gallop` | 0.566667 | 53 |
| `Gallop_Jump` | 0.933333 | 53 |
| `Idle` | 3.333333 | 53 |
| `Idle_2` | 3.333333 | 53 |
| `Idle_2_HeadLow` | 4.000000 | 53 |
| `Idle_HitReact1` | 0.666667 | 53 |
| `Idle_HitReact2` | 0.666667 | 53 |
| `Jump_ToIdle` | 1.333333 | 53 |
| `Walk` | 1.066667 | 53 |

### Cow

| Clip | Duration, seconds | Channels |
|---|---:|---:|
| `Attack_Headbutt` | 1.000000 | 26 |
| `Attack_Kick` | 1.000000 | 31 |
| `Death` | 1.000000 | 34 |
| `Eating` | 6.000000 | 23 |
| `Gallop` | 0.583333 | 37 |
| `Gallop_Jump` | 2.041667 | 39 |
| `Idle_HitReact_Left` | 0.666667 | 23 |
| `Idle_HitReact_Right` | 0.666667 | 24 |
| `Jump_toIdle` | 1.708333 | 39 |
| `Walk` | 1.166667 | 37 |
| `Idle_Headlow` | 3.333333 | 26 |
| `Idle_2` | 3.333333 | 25 |
| `Idle` | 3.333333 | 25 |
| `AnimalArmature|Attack_Headbutt` | 1.000000 | 26 |
| `AnimalArmature|Attack_Kick` | 1.000000 | 31 |
| `AnimalArmature|Death` | 1.000000 | 34 |
| `AnimalArmature|Eating` | 6.000000 | 23 |
| `AnimalArmature|Gallop` | 0.583333 | 37 |
| `AnimalArmature|Gallop_Jump` | 1.458333 | 39 |
| `AnimalArmature|Idle` | 3.333333 | 25 |
| `AnimalArmature|Idle_2` | 3.333333 | 25 |
| `AnimalArmature|Idle_Headlow` | 3.333333 | 26 |
| `AnimalArmature|Idle_HitReact_Left` | 0.666667 | 23 |
| `AnimalArmature|Jump_toIdle` | 1.708333 | 39 |
| `AnimalArmature|Walk` | 1.166667 | 37 |

### Horse

| Clip | Duration, seconds | Channels |
|---|---:|---:|
| `Attack_Headbutt` | 1.000000 | 28 |
| `Attack_Kick` | 1.000000 | 36 |
| `Death` | 1.000000 | 34 |
| `Eating` | 6.000000 | 27 |
| `Gallop_Jump` | 1.466667 | 45 |
| `Gallop` | 0.600000 | 43 |
| `Idle_HitReact_Left` | 0.666667 | 28 |
| `Idle_HitReact_Right` | 0.666667 | 29 |
| `Jump_toIdle` | 1.733333 | 45 |
| `Walk` | 1.166667 | 38 |
| `Idle_Headlow` | 3.333333 | 31 |
| `Idle_2` | 3.333333 | 27 |
| `Idle` | 3.333333 | 27 |
| `AnimalArmature|Attack_Headbutt` | 1.000000 | 28 |
| `AnimalArmature|Attack_Kick` | 1.000000 | 36 |
| `AnimalArmature|Death` | 1.000000 | 34 |
| `AnimalArmature|Eating` | 6.000000 | 27 |
| `AnimalArmature|Gallop` | 0.600000 | 43 |
| `AnimalArmature|Gallop_Jump` | 1.466667 | 45 |
| `AnimalArmature|Idle` | 3.333333 | 27 |
| `AnimalArmature|Idle_2` | 3.333333 | 27 |
| `AnimalArmature|Idle_Headlow` | 3.333333 | 31 |
| `AnimalArmature|Idle_HitReact_Left` | 0.666667 | 28 |
| `AnimalArmature|Idle_HitReact_Right` | 0.666667 | 29 |
| `AnimalArmature|Jump_toIdle` | 1.733333 | 45 |
| `AnimalArmature|Walk` | 1.166667 | 38 |

## Complete material inventory

Base colors below are glTF **linear RGB**, not CSS/sRGB triplets. Factors have alpha 1. All materials are opaque; wolf is double-sided and the other three are front-sided. No textures of any kind, UVs, tangents or vertex colors are present. No clearcoat/sheen/transmission material extensions are present.

| Animal / material | Base color factor RGB | Metalness | Roughness |
|---|---|---:|---:|
| sheep / `White` | 0.640000, 0.640000, 0.640000 | 0.400000 | 0.415087 |
| sheep / `Black` | 0.029926, 0.029926, 0.029926 | 0.400000 | 0.415087 |
| wolf / `Main` | 0.184249, 0.190175, 0.168465 | 0.000000 | 0.500000 |
| wolf / `Nose` | 0.027209, 0.027209, 0.027209 | 0.000000 | 0.500000 |
| wolf / `Main_Light` | 0.364384, 0.375746, 0.331513 | 0.000000 | 0.500000 |
| wolf / `Eyes_Black` | 0.009018, 0.009018, 0.009018 | 0.000000 | 0.500000 |
| cow / `Main` | 0.191638, 0.086914, 0.021723 | 0.400000 | 0.415087 |
| cow / `Main_Light` | 0.381588, 0.319247, 0.232992 | 0.400000 | 0.415087 |
| cow / `Muzzle` | 0.343377, 0.142639, 0.064915 | 0.400000 | 0.415087 |
| cow / `Hooves` | 0.138681, 0.079120, 0.024847 | 0.400000 | 0.415087 |
| cow / `Eye_Black` | 0.007214, 0.007214, 0.007214 | 0.400000 | 0.415087 |
| cow / `Eye_White` | 0.800000, 0.800000, 0.800000 | 0.400000 | 0.415087 |
| cow / `Horns` | 0.328748, 0.285149, 0.141177 | 0.400000 | 0.415087 |
| horse / `Main` | 0.156788, 0.071284, 0.025623 | 0.400000 | 0.415087 |
| horse / `Hair` | 0.031743, 0.031743, 0.031743 | 0.400000 | 0.415087 |
| horse / `Main_Dark` | 0.088549, 0.041881, 0.016524 | 0.400000 | 0.415087 |
| horse / `Muzzle` | 0.037568, 0.027516, 0.015406 | 0.400000 | 0.415087 |
| horse / `Hooves` | 0.117849, 0.105401, 0.087212 | 0.400000 | 0.415087 |
| horse / `Main_Light` | 0.261097, 0.116293, 0.040180 | 0.400000 | 0.415087 |
| horse / `Eye_Black` | 0.007214, 0.007214, 0.007214 | 0.400000 | 0.415087 |
| horse / `Eye_White` | 0.389514, 0.389514, 0.389514 | 0.400000 | 0.415087 |

## Native Blender import probe

The probe used audit-only meshopt-decoded copies. It made no exports. Results are specific to Blender 4.3.2 and this import configuration; no assumption is made about other Blender versions.

| Animal | Native import result |
|---|---|
| Sheep | Failed: pose bone `root` missing |
| Wolf | Imported, 51 bones |
| Cow | Imported, 42 bones |
| Horse | Failed: pose bone `Back` missing |

The fallback screenshot pipeline loads original compressed GLBs through Three.js, samples CPU skinning, and constructs static Blender meshes with supplied normals and original PBR scalars. This is sufficient for diagnostic images but deliberately does not validate native Blender rig import/export or animation round trips.

## Production lifecycle probe

Skinned clones were passed through the actual `applyNaturalMaterialResponseForUrl` and `shareActorSkeletons` implementations. No material scalars changed. Skeleton objects reduced to one per animal:
- sheep: 2 → 1, 1 rebound, 0 joint-index remaps, 0 incompatible meshes.
- wolf: 4 → 1, 3 rebound, 0 joint-index remaps, 0 incompatible meshes.
- cow: 7 → 1, 6 rebound, 0 joint-index remaps, 0 incompatible meshes.
- horse: 8 → 1, 7 rebound, 0 joint-index remaps, 0 incompatible meshes.

## Reproduction and scripts

Scripts currently reference `/workspace/seedvale-v1` and `/workspace/animal-audit`; adjust those roots in a subsequent environment. Install the repository lockfile dependencies first. Native probes and rendering do not write production assets.

```bash
node /workspace/animal-audit/decode_glb.mjs
python /workspace/animal-audit/analyze_glb.py
node /workspace/animal-audit/sample_three.mjs
node --import /workspace/seedvale-v1/node_modules/tsx/dist/loader.mjs /workspace/animal-audit/inspect_runtime_lifecycle.mts
blender -b -t 1 --python /workspace/animal-audit/probe_native_import.py
blender -b -t 2 --python /workspace/animal-audit/render_audit.py
```

- `decode_glb.mjs`: meshopt decoding only, temporary output files. KHR quantization is retained.
- `analyze_glb.py`: accessor counts, materials, image inventory, skin/clip metadata, coincident vertices and per-triangle normal comparison. Quantized positions are promoted to floating point before vector operations.
- `sample_three.mjs`: original-loader inspection, actual CPU-skinned snapshots; uses the production Three version and decoder, with no WebGL renderer.
- `inspect_runtime_lifecycle.mts`: actual V1 material-response and actor-sharing probes on clones.
- `probe_native_import.py`: native import success/failure evidence.
- `render_audit.py`: unchanged-appearance snapshots, static proxies, fixed studio, no model export.

## Archived rendered images

The repository retains [three rest-pose angles per animal](baseline-contact-sheet.jpg) and [four sampled motion phases per animal](animation-contact-sheet.jpg) as two contact sheets. The audit session generated 35 individual PNG renders, distributed separately in its ZIP. Those PNGs are not duplicated here. Per-animal rendering metadata records their original names and settings; the scripts above can regenerate them from the pinned GLBs.

The sheep motion row uses Jump because its GLB has no Walk. Wolf, cow and horse use Walk. Idle and Gallop samples were also generated during the audit; these are pose samples, not a continuous-playback capture.

## Provenance and scope

Source attribution in repository `docs/assets/CREDITS.md`: Quaternius, CC0, with wolf from Ultimate Animated Animal Pack and sheep/cow/horse links through Poly Pizza. The audit did not download or replace source art. No model, production code or repository asset was modified. The audit itself made no commits or external messages; dependency installation and the dev server were its only repository-local runtime setup. The subsequent author-requested publication adds this research report and supporting evidence to `main`, without changing production files.
