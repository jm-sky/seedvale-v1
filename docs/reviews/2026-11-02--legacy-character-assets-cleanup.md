# Legacy Player/NPC character assets cleanup — 2026-11-02

Scope: retire obsolete Player/NPC character models in the V1 tree while keeping the production CharacterKit (`public/assets/characters/`), the Slim/Heavy body-preview prototypes and every regeneration source. No gameplay, persistence, determinism or simulation code changed.

## Commits

| SHA | Subject |
|---|---|
| `ea131a0d` | `chore(assets): remove retired legacy Player/NPC character models` |
| `a68fe191` | `chore(asset-browser): drop v2/v3 compare mounts and comparison plumbing` |
| (next commit) | `docs(assets): record legacy character cleanup` — this report and the doc updates |

Nothing was pushed. Three unrelated working-tree edits were left untouched and not committed (see Blockers).

## Removed (53 tracked files, 19,656,466 bytes ≈ 18.7 MiB)

`public/models/characters/` went from 22 MB to 2.5 MB.

| Path | Files | Why it was safe to remove |
|---|---:|---|
| `Adventurer.glb` | 1 | Player `adventurer` preset retired; no runtime path loads it any more |
| `Female_Worker.glb` | 1 | No references in `src/`, `scripts/` or tests |
| `ubc/female_{knight,peasant,ranger,wizard}.glb` | 4 | Runtime bodies are `/assets/characters/Female_*.glb` |
| `ubc/male_{knight,knight_cloth,knight_unhelmeted,noble,peasant,ranger,wizard}.glb` | 7 | Runtime bodies are `/assets/characters/Male_*.glb` |
| `ubc/npc/` (all) | 25 | Not referenced by `src/` since the CharacterKit cut-over (`docs/blender/README.md` already said so) |
| `ubc/hair/` (all) | 3 | Runtime hair is `/assets/characters/hair*.glb` |
| `ubc/npc_{knight,peasant,ranger,wizard,woodcutter}.webp` | 5 | No runtime or test reader |
| `ubc/hair_{1,2}.webp` | 2 | No runtime reader; runtime hair albedo comes from kit textures |
| `ubc/male_{knight,knight_cloth,peasant,ranger,wizard}_brown.webp` | 5 | Brown tints now come from `/assets/characters/tex/*`; only `male_noble_brown.webp` is still read (kept) |

Verification of each row: `git ls-files`-scoped repo-wide filename search (excluding `node_modules`, `.git`, research/history docs), plus the runtime path builders in `src/characters/characterFiles.ts`, `src/player/playerVisualPreset.ts`, `src/ai/npcAppearance.ts` and `src/player/playerEquipmentVisual.ts`.

## Retained legacy paths

| Path | Size | Runtime | Tools | Build/source | Decision | Reason |
|---|---:|---|---|---|---|---|
| `public/models/characters/Worker.glb` | 0.45 MB | no | render regression tests (`src/render/actorSkeletonSharing.assets.test.ts`, `src/render/actorCullBounds.assets.test.ts`) | none | REVIEW (kept) | Only fixture for "legacy NPC rig" tests; replacing it changes what those tests prove |
| `public/models/characters/ubc/ual_humanoid.glb` | 1.51 MB | no (companion clips come from `assets/characters/anims.glb`) | `scripts/assets/list-character-animations.ts` reports it; comments in `PlayerController.ts` name it as the old clip source | `scripts/assets/prepare-ubc-player-alpha.sh` generates it | REVIEW (kept) | Producer script still exists; removing the file leaves that legacy regeneration path producing an orphan |
| `public/models/characters/ubc/accessories/*.glb` | 0.50 MB | yes (pauldrons, `playerEquipmentVisual.ts`) | Asset Browser | `prepare-ubc-player-alpha.sh` | KEEP | Live equipment visuals |
| `public/models/characters/ubc/male_noble_brown.webp` | small | yes (leather pauldron tint) | tests | `prepare-ubc-player-alpha.sh` | KEEP | Live tint URL |
| `public/models/parked/character-pack/models/` | 34.8 MB | no | `scripts/assets/build-head-variants.mjs` (fallback head source) | in-repo Superhero FullBody glTF+bin+textures | KEEP | Regeneration source for head variants |
| `public/models/parked/character-pack/outfits/` | 81.5 MB | no | no script reads it | no in-repo equivalent verified | REVIEW (kept) | Largest unresolved candidate; see Blockers |
| `public/assets/characters/` (incl. `body-preview/`, `eq/`, `tex/`, `anims.glb`, `hair*.glb`) | 60 MB | yes | yes | `scripts/assets/build-characters.mjs` (raw mode reads `assets-src/characters/`) | KEEP | Production CharacterKit and Slim/Heavy previews |
| `docs/blender/sources/characters/` | 233 MB | no | no | Blender masters (`quaternius/outfits/Quaternius_Outfits_All_Male.blend`, `custom/*`) | KEEP | Irreplaceable authoring source |
| `assets-src/characters/` | 21 MB | no | no | input of `build-characters.mjs --raw` | KEEP | Regeneration input |
| `scripts/assets/*` | — | no | no | `compose_ubc_player.py`, `prepare-ubc-player-alpha.sh`, `prepare-custom-ubc-npc.py` | KEEP | Still document and regenerate the kept `ubc/accessories` and `male_noble_brown.webp`; `prepare-custom-ubc-npc.py` is legacy (see follow-ups) |

## Code and reference changes

Runtime:
- `src/player/playerVisualPreset.ts` — `adventurer` preset, `PLAYER_MODEL_URL` import, `/models/characters/ubc/` companion rule removed. `resolvePlayerTint` no longer takes the unused `outfit` argument. `?player=adventurer` now warns and falls back to the equipment outfit, the same as any unknown id.
- `src/player/PlayerController.ts` — `PLAYER_MODEL_URL` export removed. `create()` takes `modelUrl` explicitly (no Adventurer default); the capsule fallback no longer names a model. Two stale doc comments about the Adventurer override were corrected.
- `src/assets/assetAnchorData.ts` — `character:player` anchors now use the UBC hand remap (the kit the reference actually renders). The Adventurer-only `CHARACTER_ANCHORS` table and the `character:ubc-peasant` key are removed. `ADVENTURER_HAND_SPACE` stays because Modular NPC sockets still use it.
- `src/assets/assetIndex.ts` — `Player (Adventurer)` entry removed; `character:player` now points to `/assets/characters/Male_Peasant.glb` and keeps its id (it is the held-item alignment reference). The duplicate `character:ubc-peasant` entry was dropped. Misleading `UBC` labels became `V1 Male/Female …` labels; ids are unchanged so existing anchor keys and saved references still resolve.
- `src/debug/caves/caveHeightfieldPlayer.ts` — the cave heightfield walker assembles the default Male Peasant kit via `assembleCharacter` instead of loading Adventurer. Built from `characters/` modules only, so it still does not import the gameplay graph.
- `src/debug/createModelTestScene.ts` — `?modelTest` loads `/assets/characters/<model>.glb` (default `Male_Peasant`) and `?anims=` defaults to `anims`.

Asset Browser (commit 2):
- `vite-plugin-asset-browser.ts` — `/compare/v2` and `/compare/v3` mounts, their static middleware and fs allow-list entries removed. The model manifest, HMR notifications and build-time manifest are unchanged. The mounts pointed at `../SeedVales` and `../../public/assets/characters` relative to this repo; neither target existed.
- `src/assets/assetIndex.ts` — compare body rows (`compare:v2-*`, `compare:v3-*`) removed.
- `src/tools/assetBrowser/viewer/compareCompanionAnimation.ts` (+ test) removed; `createAssetSlot.ts` uses the single `companionAnimationUrl` path.
- `AssetBrowser.vue` / `state.ts` — the "v2/v3 head" toggle is now "kit head". The `compareHead` state field and `mountCompareGarments.ts` keep their names: `attachCompareKit` still attaches `headUrl` for current NPC kit bodies (blacksmith, woodcutter, farmer).
- Default Asset Browser reference is `character:player`.

Tests updated: `playerVisualPreset.test.ts`, `assetIndex.test.ts`, `assetAnchorData.test.ts`, `alignmentReport.test.ts`, `state.default.test.ts`, `mountAccessoryPreview.test.ts`, `mountCompareGarments.test.ts`, `vite-plugin-asset-browser.test.ts` (rewritten to cover the manifest only).

Docs: `docs/assets/character-animations.md` regenerated with `pnpm assets:list-character-animations`. `docs/assets/MODELS.md`, `docs/assets/CREDITS.md`, `docs/assets/ASSET-GAPS.md`, `docs/blender/README.md` and the two custom-profession READMEs updated for the removed paths.

## Verification

Run on the code as committed by `ea131a0d` and `a68fe191` (the documentation commit changes no code):

| Check | Result |
|---|---|
| `pnpm run type-check` (`vue-tsc --noEmit`) | PASS |
| `pnpm run build` | PASS |
| Full `pnpm run test` | 735 of 739 files pass; 6 tests fail (below) |
| Every Asset Browser index URL (`buildAssetIndex()`) resolves to a file under `public/` | PASS (temporary test, removed afterwards) |
| Production character URLs from the `CharacterKit` type unions resolve | 37 of 39 combinations resolve. `Female_Farmer.glb` and `Female_Woodcutter.glb` do not exist, were never in the tree, and are never requested (`npcAppearance.ts` coerces those roles to Peasant; `bodyPreviewEntries.ts` says so explicitly) |
| Slim/Heavy body-preview entries present and resolvable | PASS (covered by the URL-resolution check above) |
| Asset Browser does not list deleted character entries | PASS (`assetIndex.test.ts` guard, `vite-plugin-asset-browser.test.ts` manifest test) |
| `?player=adventurer` falls back cleanly | PASS (unit test; warns, no broken selection) |

Failing tests, with status:
- `PlayerController.appearance.test.ts` × 3 (accessory lifetime). Failing before any edit in this session (baseline run). Pre-existing.
- `actorSkeletonSharing.assets.test.ts` — `cow.glb` reports 7 skeletons instead of 1. Failing in the baseline run before edits. Pre-existing.
- `NpcAgent.spatialLifecycle.test.ts` — source-order probe on `src/settlement/SettlementsManager.ts`, which is byte-identical to `HEAD`. Pre-existing; not in the focused baseline subset.
- `scripts/assets/body-preview-lib.test.ts` — "reproduces the shipped Fat target". Not caused by this change: the test loads `scripts/assets/body-warp.mjs`, and that file was edited in the working tree at 08:34 during this session (`belly` 0.2 → 0.04 for Male). That edit is not mine and is not committed. See Blockers.

Not performed: browser/visual verification (`?modelTest`, `?reference=character:player` in the Asset Browser, cave walker, Slim/Heavy preview rendering). Only the automated checks above were run. No visual or runtime claim is made beyond them.

## Blockers and unresolved candidates

1. `public/models/parked/character-pack/outfits/` (81.5 MB, the largest candidate). No script or test reads it, and the production outfits come from `assets-src/characters/` and the Blender masters. I could not verify that the Blender master fully replaces these Quaternius exports (upstream pack not in this repo), so it stays. Decision needed: archive it out of `public/`, or confirm it is superseded.
2. `Worker.glb` (0.45 MB) — kept as the only "legacy NPC rig" fixture for two render regression tests. Replacing it means choosing a new rig with equivalent clips and redefining what those tests prove.
3. `ubc/ual_humanoid.glb` (1.51 MB) — kept because its producer script is still in `scripts/assets/` and it is named in a debug example. Removal needs the author to decide whether the legacy UBC regeneration path stays.
4. Uncommitted working-tree change to `scripts/assets/body-warp.mjs` (`belly` 0.2 → 0.04, Male) at 08:34 today. It was not in the session's starting status and is not from this work. It makes `body-preview-lib.test.ts` fail. Not committed, not reverted.

## Follow-ups (not done here)

- `scripts/assets/prepare-custom-ubc-npc.py` writes to paths that the runtime no longer loads. Archive it or mark it legacy (previously noted in `docs/research/v1-revival/2026-10-28--npc-character-blender-verification.md`).
- `PlayerController.ts` still has Adventurer-named clip comments (`Sword_Slash` / punch fallback, `Idle_Gun_Pointing`). The behaviour is generic clip-name handling and was left as is.
- `mountCompareGarments.ts` / `compareHead` keep "compare" names for the kit-head path; a rename would be cosmetic churn.
- `CharacterKit` types admit `Female_Farmer` and `Female_Woodcutter`, which do not exist on disk. Narrowing the type is a separate change.
