# NPC Character Models — Blender MCP Verification & Integration (2026-10-28)

**Created at:** 2026-10-28
**Created by:** Claude Opus 5.5 (Claude Code, Blender MCP on Blender 5.2.0 LTS)
**Base:** V1 `main` @ `8fc58ddf` (after fast-forward)
**Scope:** Peasant / Woodcutter / Blacksmith from the author's V1 Blender master; Blacksmith apron; runtime integration. Other character topics: investigation only.
**Input:** [NPC Character Art Direction](./2026-10-27--npc-character-art-direction.md). Author answers given in-session on 2026-10-28 are recorded in §9.

Evidence labels: **verified** (executed/measured here), **observed** (seen in Blender or browser output, not measured), **inferred** (reasoned from code/data), **unverified** (not checked).

## 1. Executive summary

**Accomplished**
- The author's hand-edited collections exist intact in `Quaternius_Outfits_All_Male.blend`: Peasant (hat, cloth leg wraps), Woodcutter (boots, suspenders), Blacksmith (boots, extra belt, Ranger bracers, dark tunic panel). **verified**
- None of them was used by the game. Runtime Woodcutter was the stock Peasant with a tint; runtime Blacksmith was V3's procedural model (stock Peasant + a 202-tri charcoal apron). **verified**
- Pipeline defects fixed (§3); the authored outfits now export reproducibly from the master to CharacterKit bodies. **verified**
- Blacksmith received a classic leather work apron in the master (author-chosen direction: classic, careful with calves; colour: dark brown leather blackened by forge soot). **verified** in Blender; look acceptance by the author pending.
- Integrated: adult male **farmer → Farmer** (author's Peasant with hat), adult male **woodcutter → Woodcutter**, **Blacksmith** body replaced by the authored one with the apron. Women, children, the player and other roles keep their current looks. **verified** by tests; browser: see §8.4.

**Blocked / outstanding**
- Sitting / crouch / kneel poses: apron halves float a few centimetres above or dip into the thighs (§5). Known limitation, not fixed.
- Legacy UBC pipeline (`prepare-custom-ubc-npc.py`) feeds an output path the runtime no longer loads and does not run on Windows; documented, not repaired.
- The shipped bodies of other outfits carry a V3 `Fat` morph that V1 never uses; the new bodies don't (§7).

## 2. Source inventory

### 2.1 Master scene (`docs/blender/sources/characters/quaternius/outfits/Quaternius_Outfits_All_Male.blend`) — verified via Blender MCP

Backup before modification: `_temp/blend-backup/Quaternius_Outfits_All_Male.2026-10-28.pre-apron.blend` (sha256 `97c864aa…`, identical to git `8fc58ddf`; `_temp/` is not committed — git history is the durable backup). `.blend1` was not rotated (saved with `save_version = 0`). Textures resolve from `outfits/Textures/`. One `Armature` (Rigify-generated, 382 bones, 65 UBC deform bones, deform bones constraint-driven).

| Collection | Objects (tris, materials) | Author edits observed |
| --- | --- | --- |
| Peasant | Arms 5338, Body 3856, Legs 1112 (MI_Peasant); Feet 2620 (MI_Wizard + `Peasant_Legs_skin` flat); `Male_Peasant_Head_Hat` 382 (`Peasant_Hat`, `Peastant_Hat_Belt` flats) **bone-parented to control bone `head`, no vertex groups** | Hat; wizard shoes + brown cloth leg wraps instead of boots |
| Woodcutter | Arms/Body/Feet/Legs (Body has `Woodcutter_stripes` flat on the front) — Feet 2588 = stock Peasant boots | Brown suspender stripes (front only), boots |
| Blacksmith | Arms 5338, `Arms_Bracer` 1818 (Ranger, mirror), Body 3856 (`MI_Blacksmith` + `Blacksmith_Apron` panel faces), `Body_Belt` 804 (`MI_Blacksmith_Belt`), Feet 2588, Legs 1112 | `MI_Blacksmith` = Peasant atlas through Hue/Sat/Value ×0.5; belt = Ranger atlas ×0.15; dark front panel (174 faces) |
| New: `Male_Blacksmith_Apron` | 604 tris, `Blacksmith_Apron_Leather` | Added 2026-10-28 (§5) |

Knight, Ranger, Steel bracers, Noble, Wizard and `WGTS_rig` collections were not modified.

### 2.2 Scripts and outputs

| Path | Role | Status |
| --- | --- | --- |
| `scripts/assets/blender-character-variants.py` | Blender → `assets-src/characters/*.raw.glb` (live kit path) | Repaired + authored mode (§3) |
| `scripts/assets/build-characters.mjs --raw` | raw → `public/assets/characters/<Sex>_<Outfit>.glb` | Could not run in V1 (missing deps) → fixed |
| `scripts/assets/blender-blacksmith-apron.py` | Authors the apron in the master | New |
| `scripts/assets/prepare-custom-ubc-npc.py` | `custom/<profession>/outfit.glb` → `public/models/characters/ubc/npc/male_*.glb` | Legacy: output not referenced by `src/` (**verified** by search); not run on Windows (§3) |
| `docs/blender/sources/characters/custom/{peasant,woodcutter,blacksmith}/outfit.glb` | Older exports of the same collections (382-joint skin, 1 stray clip, pre-apron) | Unchanged; superseded for runtime |

### 2.3 Runtime chain — verified (code + tests)

`resolveNpcAppearance` (`src/ai/npcAppearance.ts`) → `CharacterAppearance.outfit` → `bodyUrl()` `/assets/characters/<Sex>_<Outfit>.glb` → `assembleCharacter` (`src/characters/assembleCharacter.ts`: body skeleton, rebinding head/hair/eq by bone name) → `NpcAgent` (material clone/hue, culling). The `ubc/npc/*` files are not on this chain.

## 3. Script verification and repairs

| # | Finding | Evidence | Repair |
| --- | --- | --- | --- |
| P1 | `build-characters.mjs` imports `@gltf-transform/*`, `meshoptimizer`, `sharp`, none declared in V1 `package.json` → `ERR_MODULE_NOT_FOUND` | **verified** | Added as devDependencies with V3's ranges (`b81bbd80`) |
| P2 | `blender-character-variants.py` default root `D:\Projekty\private\SeedVales` (does not exist) | **verified** | Root from `SV_ROOT` or `__file__`, else a clear error |
| P3 | Procedural male build loads `Male_Peasant_Feet` by name; in the master it is now the author's leg-wrap mesh (MI_Wizard) → a rerun would silently put leg wraps + Wizard texture on Herbalist/Blacksmith | **verified** (object data) / consequence **inferred** | Male build reads the stock copy `Male_Woodcutter_Feet`; fails fast if any non-stock material reaches procedural parts. Rerun to scratch reproduces shipped `Male_Herbalist`/`Male_Peasant_Boots` raw structure (15030 / 12106 tris, same materials) **verified** |
| P4 | No path exported the author's collections at all; the procedural script overwrote `Male_Blacksmith.raw.glb` with V3's generic model | **verified** | New authored mode (`SV_BUILD=authored`); male Blacksmith no longer generated procedurally |
| P5 | Authored materials use Hue/Sat/Value multiplies; a naive "image or flat" export turns `MI_Blacksmith` into the node default (teal) | **verified** (first export attempt) | Pure value multiplies (hue 0.5, sat 1, fac 1) are baked into the 512 px copy in linear space; other HSV setups raise |
| P6 | Bone-parented hat has no skin weights → dropped as a separate unskinned node by kit assembly | **verified** (`custom/peasant/outfit.glb` hat node unskinned) | Baked into world space, weighted 1.0 to deform bone `Head` |
| P7 | `--out` for verification runs on another drive crashed the export log (`relpath` across drives) | **verified** | Log path fallback |
| P8 | `prepare-custom-ubc-npc.py blacksmith woodcutter` → `FileNotFoundError` spawning `npx` (Windows needs a shell / `npx.cmd`); `package.json` alias uses `python3` | **verified** (run on this host); unit tests `test_prepare_custom_ubc_npc.py` 7 passed | Not repaired: orphaned output path. Recommend archiving (§10) |

Commands (Blender 5.2 via MCP, empty scene):
```python
os.environ['SV_ROOT'] = r'D:\Projekty\private\seedvale-v1'; os.environ['SV_BUILD'] = 'authored'
exec(open(r'<repo>\scripts\assets\blender-character-variants.py').read())
```
```bash
node scripts/assets/build-characters.mjs --raw Male_Farmer Male_Woodcutter Male_Blacksmith
```
Reproducibility: a second export to `SV_OUT` was **byte-identical** for all three raws; a second kit build was byte-identical for all three bodies. **verified**

Export behaviour: each authored collection is joined into **one skinned mesh** (65 UBC joints, deform bones only, no clips); materials that share an image collapse; all flat colours of an outfit share one palette texture (16 px cells, nearest filtering). The glTF exporter warns ">4 joint influences, top 4 kept" — same as the existing procedural exports.

## 4. Character verification matrix

| | Peasant → **Farmer** | **Woodcutter** | **Blacksmith** |
| --- | --- | --- | --- |
| Authored edits present in master | Hat, leg wraps **verified** | Boots, suspenders **verified** | Boots, extra belt, bracers, dark panel **verified**; apron added |
| Edits survive export | Hat (rigid on `Head`), leg wraps, wizard shoes **verified** (raw/kit structure; Blender render of built GLB) | Suspender stripes (palette) **verified** | Belt, bracers, darkened tunic (×0.5), apron **verified** |
| Skeleton / weights | 65 UBC joints; assembles with head/hair/beard, 0 unbound-bone warnings **verified** (Vitest) | same **verified** | same **verified** |
| Kit body | 8756 tris, 4 materials, 1 skinned mesh | 7254 tris, 3 materials, 1 skinned mesh | 10910 tris, 6 materials, 1 skinned mesh |
| Previous runtime body | `Male_Peasant_Boots` 8156 tris, 5 primitives, 4 skinned meshes | `Male_Peasant` + tint 8576 tris, 5 primitives, 4 skinned meshes, per-NPC material clones | V3 procedural 8778 tris, 6 primitives, 5 skinned meshes |
| Animation (Blender, built GLB + `anims.glb`) | Rest: hat clears Parted hair and beard **observed**; animated head/hair not checkable in Blender (separate armatures) | not individually inspected in Blender | Walk/Jog/Sprint/Sword/Interact etc. measured (§5) |
| Cull bounds through Walk/Sprint/Sword/Sit/Death/Kneel/Interact | **verified** (Vitest, real GLBs, CPU skinning) | **verified** | **verified** |
| Runtime mapping | adult male `farmer` | adult male `woodcutter` | adult male `blacksmith` (unchanged mapping, new body) |
| Farmer reuse | Author's Peasant used as Farmer only (author decision 2026-10-28); stock Peasant stays for player, children, miner, shepherd, textile worker | — | — |

Why the runtime used Peasant for Woodcutter: the CharacterKit cut-over (`45415131`) only carried kit outfits built from the pack/procedural scripts; the authored custom GLBs lived on the older UBC path, which the cut-over left unreferenced. **inferred** from history + code.

## 5. Apron improvement

**Before:** the author's "apron" was a near-black material (`Blacksmith_Apron`) on 174 front faces of the tunic — a dark panel from collar to hem, no separate geometry. The live game showed V3's generic 8×14 grid apron on a stock Peasant instead.

**After (master, `Male_Blacksmith_Apron`, 604 tris, script `blender-blacksmith-apron.py`):**
- Bib from the waist to the upper chest (z 1.45 m), narrower at the top, 1.6 cm above the tunic; neck strap loop.
- Through the belt band it lies 0.8 cm on the tunic, so the author's **extra belt stays visible on top** (apron "tucked under the belt").
- Skirt from the belt to ~4 cm below the knee (z 0.50), hanging as a flat sheet in front of the thighs with curled edges; centre slit up to z 0.86.
- Weights: bib/strap copy the tunic (nearest-face); skirt = pelvis at the waist → own thigh (85 % by the tunic hem), **no calf weights**, so knee bends cannot drag the hem into the shins.
- Material `Blacksmith_Apron_Leather` linear (0.032, 0.017, 0.009) — soot-darkened brown leather (flat colour; no texture).
- The author's dark tunic panel is preserved underneath (visible above the bib as a dark collar).

**Animation check (Blender, built kit GLB + V1 `anims.glb`, 17 samples per clip; apron vertices inside the remaining body surface):**

| Clip | Worst frame | Max depth | Note |
| --- | --- | --- | --- |
| Idle / Interact / PickUp | 11–12 / 220 | 0.8–1.1 cm | Floor of ~10 = belt-band vertices intentionally under the belts |
| Walk_Loop | 16 | 1.3 cm | first iteration: 3.9 cm (upper skirt too pelvis-bound) → fixed by faster thigh ramp + higher slit |
| Jog / Sprint | 19 / 20 | 2.4 / 1.6 cm | was 4.6 cm (sprint) |
| Sword_Attack / Death01 | 20 / 25 | 1.5 / 2.1 cm | |
| Crouch_Fwd / Sitting_Idle / Fixing_Kneeling / Push | 32 / 21 / 29 / 25 | 3.1 / 3.4 / 4.0 / 4.5 cm | deep hip flexion: thigh-bound halves rotate onto the lap and float ~3–8 cm above the thighs or dip into them |

Observed: walk mid-stride front/side views clean, slit opens naturally, no shin poke-through. Sitting reads as a stiff tray on the lap. **Limitation:** fixing seated poses needs corrective shape keys or a hip-pivot helper; not done. Look acceptance (silhouette, colour) is the author's call.

## 6. Runtime integration — changed files

| Commit | Files |
| --- | --- |
| `b81bbd80` fix(assets) | `package.json`, `pnpm-lock.yaml`, `scripts/assets/blender-character-variants.py`, `scripts/assets/build-characters.mjs` |
| `44fab4a5` assets(characters) | master `.blend`, `scripts/assets/blender-blacksmith-apron.py`, `assets-src/characters/Male_{Farmer,Woodcutter,Blacksmith}.raw.glb`, `public/assets/characters/Male_{Farmer,Woodcutter,Blacksmith}.glb` |
| `2a97f11c` feat(npc) | `src/characters/characterTypes.ts` (`Farmer`, `Woodcutter`, `MALE_ONLY_OUTFITS`), `src/ai/npcAppearance.ts`, `src/assets/assetIndex.ts`, tests |

Mapping (adult unless noted):

| Role / case | Before | After |
| --- | --- | --- |
| male farmer | Peasant_Boots | **Farmer** |
| female farmer | Peasant_Boots + skirt | unchanged |
| male woodcutter | Peasant + tint `0xc4a574` | **Woodcutter**, no tint |
| female woodcutter | Peasant + tint + skirt | unchanged |
| male blacksmith | Blacksmith (V3 procedural) | Blacksmith (authored + apron) |
| children, player, miner, shepherd, textile, fisher, others | — | unchanged |

Appearance remains derived from `npcId`/gender/role/age; the RNG draw sequence is unchanged, so hair/head/beard selections are identical to before. **verified** (code inspection; tests). Not saved state.

## 7. Performance impact

No benchmark was run (no certified A0a/B0 baseline exists — Track A is PENDING BASELINE). Static per-body comparison of the kit body GLB only (head/hair/eq unchanged):

| Body | Tris | Draw calls (primitives) | Skinned meshes | Materials | Unique textures |
| --- | --- | --- | --- | --- | --- |
| Farmer vs Peasant_Boots | 8756 vs 8156 (+600) | 4 vs 5 | 1 vs 4 | 4 vs 2 | 4 vs 2 |
| Woodcutter vs tinted Peasant | 7254 vs 8576 (−1322) | 3 vs 5 | 1 vs 4 | 3 shared vs 2 cloned per NPC | 2 vs 2 |
| Blacksmith vs procedural | 10910 vs 8778 (+2132) | 6 vs 6 | 1 vs 5 | 6 vs 3 | 6 vs 2 |

- **Skinned meshes / skeletons:** three.js creates one `Skeleton` per skinned mesh node, so one joined body cuts per-NPC skeleton updates and bone uploads for the body from 4–5 to 1. **inferred** (loader behaviour), not measured.
- **Material instances:** `SV_*` materials are not in `UBC_OUTFIT_MATERIAL_NAMES`, so they are shared across NPCs (like the existing raw-built Peasant_Boots/Blacksmith); woodcutters stop cloning materials per NPC. Side effect: woodcutters lose the subtle per-NPC clothing hue (as farmers/blacksmiths already did). **verified** (code).
- **Morph targets:** previous bodies (incl. old Blacksmith) carry a baked V3 `Fat` morph that V1 never drives (no `morphTargetInfluences` use in `src/`); the new bodies have none, which removes morph attributes from their vertex shaders. **verified** (GLB) / shader effect **inferred**.
- **Textures / memory:** Blacksmith adds 4 textures (Ranger atlas, darkened Peasant and Ranger copies, palette) — ~5 MB GPU with mips once per session; body file 1.63 MB (was 0.73 MB). Farmer +2 textures (Wizard atlas, palette).
- **Frustum culling:** untouched; A1′ per-instance cull spheres contain all three bodies through representative clips (**verified**, Vitest).
- Risks: +2.1k tris per blacksmith NPC (few per settlement) and +600 per male farmer. Changes are isolated to three body files and one mapping table, so they can be reverted or measured independently. The `npcFamily` census key now reports `Farmer` instead of `Peasant_Boots` for farmers.

## 8. Validation evidence

### 8.1 Blender (MCP, Blender 5.2.0 LTS; addon protocol 13 < 15 expected, functional)
- Master inventory, materials, textures, armature, deform bones, hat parenting: **verified**.
- Rest-pose renders of all three authored outfits; apron iterations (3) with front/side/back views: **observed**.
- Built kit Blacksmith + `anims.glb` (decoded) animated in Blender; penetration metric for 12 clips (§5): **verified**.
- Built Farmer + Male head + hair (Parted, Beard) at rest: hat clears hair/beard **observed**. Animated head/hair could not be checked in Blender (separately imported armatures diverge); hat and head both follow `Head` — **inferred** stable.

### 8.2 GLB structure — verified
One skin × 65 UBC joints, no animations, `EXT_meshopt_compression`, one mesh node per body; raw and kit builds byte-reproducible.

### 8.3 Automated checks — verified
- `vitest run src/ai/npcAppearance.test.ts src/characters src/render/actorCullBounds src/assets` → 16 files, 132 tests passed (incl. cull bounds for Male Farmer/Woodcutter/Blacksmith through 7 clips, 0 assembly warnings).
- `eslint` on changed files: clean. `vue-tsc --noEmit`: clean.
- Full suite after 14:30 (heavy-run window): `vitest run` → **712 files, 8593 tests passed**.

### 8.4 Browser (Three.js) — observed, limited
Vite dev server + headless Chrome
(`--headless=new`, SwiftShader WebGL, `--virtual-time-budget=30000 --screenshot`) on the existing model-test page
`asset-browser.html?target=character:ubc-male-{blacksmith,woodcutter,farmer}` (head attached via the new entries).
- All three bodies load, assemble with a head and render in the real Three.js viewer. **observed**
- Farmer: hat sits on the head in idle, quad views incl. top. **observed**
- Blacksmith: apron visible in front of the legs to the knee (idle side view) and in front of the thigh in `Crouch_Idle_Loop`; no obvious poke-through at screenshot resolution. **observed**
- Woodcutter: renders; quad "front" tile actually shows the back, so the front-only suspenders were not legible. **observed / incomplete**
- Failed attempt: `clip=Walk_Loop` deep link fell back to rest pose and rendered nothing within the time budget; `pose=idle` resolves to the viewer's first idle-like clip (`Crouch_Idle_Loop`).
- Headless SwiftShader lighting is dim; console output was not captured. **Not a visual PASS**: colour, silhouette and in-settlement appearance (`index.html`, live NPCs) were **not** checked — author look review required.

## 9. Open questions for the author

Answered in-session (2026-10-28): integrate when cheap, suggest fixes for heavy hand edits; classic blacksmith apron with calf clearance; dark brown, soot-blackened leather; Farmer outfit for adult male farmers only; edit the master after a backup; commit and push.

Still open:
1. **Apron look** — accept the silhouette/colour? Accept the seated-pose limitation, or invest in corrective shapes?
2. **Dark tunic panel** above the bib — keep (reads as a dark collar) or revert those faces to the tunic material?
3. **Woodcutter suspenders** exist only on the front; add the back straps?
4. **Blacksmith cost** — 6 materials/textures because the author's darkened tunic/belt are separate tinted textures. Acceptable, or bake them into one atlas (saves 2 draw calls and 2 textures)?
5. Female/young versions of Farmer and Woodcutter (no female master in the repo).

## 10. Recommendations and next steps (not approved)

1. Author look review in the asset browser (`assets.html?target=character:ubc-male-blacksmith`) and in a settlement.
2. Atlas the Blacksmith (P5 tints + palette into one 512/1024 atlas): 6 → 3 draw calls. Same for Farmer's Wizard shoes.
3. Archive the UBC custom-NPC path (`prepare-custom-ubc-npc.py`, `ubc/npc/*`, `custom/*/outfit.glb`) or mark it legacy in its READMEs — it no longer feeds the game.
4. If body-build variants are approved: port V3's body-morph step to V1 and decide whether runtime should drive it at all; otherwise strip the unused `Fat` morphs from the other bodies (cheaper shaders).
5. Seated apron fix: corrective shape key on hip flexion (driver-free in glTF needs a morph + runtime driver) or a pelvis-forward helper bone.

## 11. Other character topics — investigation only

| Topic | Exists | Works | Broken / risk | Decision needed |
| --- | --- | --- | --- | --- |
| Female WorkSkirt / LongSkirt | No; only `EQ_PeasantSkirt` in `eq/Female.glb` (**verified**) | PeasantSkirt attaches for skirted female outfits | Knee clipping reported; not measured here (**unverified**). The §5 measurement method (built GLB + `anims.glb`, vertices inside body per clip) applies directly | Garment designs, clearance target |
| Female proportions (bust/waist) | V3 dress script has `BUST_FLATTEN = 0.0` (documented clipping at 0.65) | — | No female master in V1 → body edits need the V3 source | Source of truth for female body |
| Herbalist hood vs vest | Male/Female_Herbalist = Peasant + Ranger hood in flat olive (V3 procedural) **verified** | Live | Hood contradicts author direction | Vest design; male could be authored in the master like the Blacksmith |
| Miner (dark Peasant) | Miner → stock Peasant **verified** | Live | — | A darkened Peasant is cheap via the same HSV-value pattern the author used for `MI_Blacksmith` (now supported by the exporter) |
| Kate Hornblower | Reserved character "Kasia Hornblower", female trader → Female_Wizard + PeasantSkirt, random hair colour **verified** (code) | — | No named-NPC appearance override exists | Override precedence (card → outfit/hair) |
| Player beard/moustache | Player default `beard: false` **verified**; `HAIR_Beard` includes a moustache **observed** (Blender render) | — | — | Just enable beard for the player? |
| Body builds / children | `Fat` morph baked into most kit bodies, never driven in V1 **verified**; children use stock Peasant at adult proportions | — | New authored bodies have no morph | Whether builds/child proportions go live |
| Modular armor | `eq/{Male,Female}.glb` contain Chainmail, PlateCuirass, LeatherJerkin, PaddedJacket, Pauldrons, Bracers, LeatherTrousers/Boots, Gloves, IronHelm, LeatherCap, StuddedLeather **verified**; only PeasantSkirt is attached at runtime | — | Joined authored bodies cannot hide one body part (e.g. tunic under mail) by node; region hiding would need per-region material slots or keeping parts separate (exporter switch) | Layering vs occlusion contract |
| Profession aprons | Blacksmith apron now real geometry in the master | Blacksmith only | Reuse for other professions/spouses would need a detachable eq garment (e.g. `EQ_Apron`) | Eligibility rules (Art Direction §2) |
