# world-terrain-068 — implementation notes

## A2 — garment named morph rebinding (2026-11-06, Sonnet, queue Q174)

- **Implemented:** `rebindAllSkinned` (`src/characters/assembleCharacter.ts`) now copies the source mesh's GLTF-assigned `morphTargetDictionary` and gives the rebound mesh its own `morphTargetInfluences` array (never shared across actors). `applyBodyBuild` call sites unchanged; NPC build selection unchanged.
- **Root cause confirmed:** the fresh `SkinnedMesh(geometry, material)` rebuilt its dictionary from geometry morph attributes (numeric names), so `applyBodyBuild` reported `no morph on <garment>` and garments never followed Heavy/Slim.
- **Technically verified:** `assembleCharacter.garmentMorphs.assets.test.ts` (production assembly over real GLBs, Female NobleBodice + WorkSkirt, Heavy and Slim): no warnings, named `Fat`/`Slim` dictionaries, chosen weight 1 / other 0, a second actor with the opposite build keeps independent weights. Test fails without the fix. Characters/player/actor-bounds suites, lint and type-check pass.
- **Not verified:** browser seam check (both sexes, skirts/bodices) — queued for the author (§2). Garment GLBs did carry matching morphs for these garments (no asset gap found); other garments/roles not exercised.
