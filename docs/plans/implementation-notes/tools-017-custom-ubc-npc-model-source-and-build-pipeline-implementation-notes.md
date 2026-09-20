# Implementation notes: Custom UBC NPC model source and build pipeline

**Plan:** `tools-017-custom-ubc-npc-model-source-and-build-pipeline.md`

## Current code reality

The plan's core direction is correct, but the current player/NPC UBC composer is still development-source-bound:

- `scripts/assets/compose_ubc_player.py::main()` reads UBC base, hair/beard and Fantasy outfit sources from `_temp/Models/people/...`.
- `scripts/assets/prepare-ubc-player-alpha.sh` also reads UAL1/UAL2 from `_temp/`.
- Therefore do not implement tools-017 as a thin wrapper around the existing `compose_ubc_player.py`; that would violate the plan's fresh-checkout/no-`_temp` contract.
- Reuse its glTF primitives, but make custom-NPC inputs explicitly repo-local.

Current authored character sources on `main` include:

```text
docs/blender/sources/
├── Quaternius_Outfits_All_Male.blend
├── blacksmith.glb
├── steel_bracers.glb
└── woodcutter.glb
```

There are unrelated Blender sources in the same directory; do not migrate them as part of this plan.

## Source ownership decision

Create the character-specific subtree from the plan and move/adapt only the inputs owned by this pipeline.

Recommended initial shape:

```text
docs/blender/sources/characters/
├── README.md
├── quaternius/
│   ├── README.md
│   ├── outfits/
│   │   └── Quaternius_Outfits_All_Male.blend
│   └── ubc-base/
│       └── <minimal exported glTF/bin/textures actually required by compose>
└── custom/
    ├── blacksmith/
    │   └── outfit.glb
    └── woodcutter/
        └── outfit.glb
```

Do not copy the entire Universal Base Characters or Fantasy pack into the repository. Export/retain only the minimum legal CC0 subset required by the custom build: male body/head source, eyes/eyebrows, default hair/beard inputs and any files directly referenced by them.

`steel_bracers.glb` is not a custom profession outfit fixture. Keep it outside the custom NPC manifest unless a later plan explicitly makes it part of one profession model; it is an accessory/item source and should not silently become owned by tools-017.

## Fixtures

Use two real fixtures, in this order:

1. `blacksmith.glb` — primary end-to-end fixture because it contains the most manual authoring and is already the plan's intended proof case.
2. `woodcutter.glb` — secondary fixture proving the manifest/pipeline is data-driven rather than Blacksmith-specific.

Do not reconstruct either from clean Quaternius parts. Their authored geometry/material edits are source truth.

Initial implementation does not need Herbalist/Miner/etc. Those should become ordinary future manifest rows once their authored `outfit.glb` exists.

## Shared glTF code

The useful reusable implementation is in `scripts/assets/compose_ubc_player.py`:

- `GltfDoc`
- accessor/buffer copying
- `remap_joints()`
- material/image/texture copy helpers
- skinned-mesh composition
- head slice / eyes / eyebrows / hair / beard composition

Extract only the subset needed by both pipelines into `scripts/assets/ubc_gltf.py` if importing the existing module cleanly would otherwise couple custom builds to its `_temp` path policy.

Keep `compose_ubc_player.py` behavior unchanged for the existing player/NPC asset build unless the extraction is mechanical. Do not refactor its whole CLI or asset manifest during tools-017.

Important current limitation: `GltfDoc` expects external-buffer `.gltf` with a `.bin`, while authored fixtures are `.glb`. The custom build entry point therefore needs an explicit temporary GLB→glTF conversion step before using these helpers. Keep that conversion inside a temp workdir; do not create derived working files in `docs/blender/sources/`.

## Custom source validation

Validate before composition, not after optimization.

For every custom source:

- at least one mesh exists;
- exactly one compatible UBC character skin/armature is used;
- every skinned primitive has both `JOINTS_0` and `WEIGHTS_0`;
- joint names map to the canonical repo-local UBC base skeleton;
- report unmapped joints by name and mesh;
- reject accidental embedded animation clips;
- reject Blender helper/control-rig objects when they leak into the export.

Do not silently map an unknown joint to joint 0. The existing generic `remap_joints()` fallback is acceptable for trusted player source composition, but custom-source validation must prove all referenced joints are known before calling it.

## Body / outfit contract

Treat the Base Human/UBC body and the profession outfit as separate inputs.

A custom `outfit.glb` should preserve the manually authored profession clothing/props and compatible skinning. The build then composes the shared UBC body/head pieces and appearance parts.

This is important for future variants where sleeves or footwear are removed: exposed arms/feet must come from the shared base body rather than requiring every profession source to contain a duplicate full body.

Do not make runtime per-slot clothing part of this plan. The output remains one composed runtime character GLB per manifest variant.

## Manifest

Prefer a small Python data structure colocated with the build script unless there is a concrete consumer for standalone JSON.

Minimum fields should cover actual differences, for example:

```python
CUSTOM_NPCS = {
    "blacksmith": {
        "source": "docs/blender/sources/characters/custom/blacksmith/outfit.glb",
        "output": "public/models/characters/ubc/npc/male_blacksmith.glb",
        "sex": "male",
        "hair": "simple",
        "beard": True,
    },
    "woodcutter": {
        "source": "docs/blender/sources/characters/custom/woodcutter/outfit.glb",
        "output": "public/models/characters/ubc/npc/male_woodcutter.glb",
        "sex": "male",
        "hair": "simple",
        "beard": False,
    },
}
```

Do not encode profession gameplay rules here. This manifest describes asset builds only.

## Optimization

Reuse the proven profile from `scripts/assets/prepare-ubc-player-alpha.sh`:

```text
gltf-transform copy
→ resize
→ webp
→ prune
→ gltfpack -cc -kn
```

Do not use `gltf-transform optimize`/flatten on the skinned hierarchy.

Do not add automatic Decimate. The current authored GLBs are multi-megabyte mostly because of source payload/textures; first normalize textures and compression.

Keep texture policy centralized. Default 512 is consistent with the current UBC build; any 1024 exception should be a manifest/config field with a reason.

## Runtime boundary

`src/ai/npcAppearance.ts::resolveNpcAppearance()` is already authoritative for profession appearance and currently maps all professions to UBC families.

Do not change that resolver in tools-017. This plan should only prove that custom assets can be deterministically rebuilt and placed under `public/models/characters/ubc/npc/`.

A later small integration change can replace the Peasant fallback URL for specific roles such as `blacksmith` or `woodcutter` after the generated asset is manually accepted.

Do not add persistence fields: appearance remains derived.

## Suggested implementation order

1. Create the repo-local character source layout and provenance README.
2. Move/adapt Blacksmith and Woodcutter authored GLBs without modifying their geometry.
3. Add the minimal legal UBC base/head/hair/beard subset needed by the custom composer.
4. Extract only required shared glTF helpers from `compose_ubc_player.py`.
5. Add `prepare-custom-ubc-npc.py` with GLB→temporary glTF conversion and fail-fast validation.
6. Build Blacksmith through the full pipeline.
7. Add Woodcutter as the second manifest row and verify no profession-specific code was required.
8. Apply the existing optimization profile and inspect outputs.
9. Update `docs/blender/README.md` with the short Quaternius UBC custom workflow and `docs/assets/CREDITS.md` with repo-local source provenance.

## Verification

Automated/agent verification should cover:

- build succeeds with `_temp/` absent;
- Blacksmith and Woodcutter both build from the same entry point;
- source and final output retain skin, `JOINTS_0`, `WEIGHTS_0` and required bone names;
- no source animations survive;
- no unknown joint is silently remapped;
- final assets are materially smaller than authored source GLBs;
- existing `compose_ubc_player.py` / UBC player build behavior is not broken by shared-helper extraction.

Manual browser/Asset Browser verification remains for the User: deformation, clipping, head/hair/beard placement, custom Blacksmith apron/bracers, Woodcutter suspenders, materials and gameplay-distance texture quality.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
