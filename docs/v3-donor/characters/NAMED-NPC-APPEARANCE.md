# Named NPC visual identity — author decisions

**Created:** 2026-10-31  
**Status:** In progress — author-approved appearance selections; documentation only  
**Scope:** V1 Revival, named recurring NPCs  
**Implementation:** Partial runtime presets landed 2026-11-02 (author request) — `NAMED_NPC_LOOKS` in `src/ai/npcAppearance.ts`; see "Runtime mapping" below

## Purpose

Keep the same recognizable physical appearance for important recurring NPCs across game sessions, save/load, streaming, dialogue/quests, and presentation changes. Character identity must not depend on a display name (legacy Polish names are being migrated); use stable `CharacterKey` or the eventual canonical authored actor binding. These selections complement the narrative profiles and reference images under `docs/v3-donor/characters/`, rather than replace them. Resolve conflicts with approved cast/identity decisions and current V1 source before implementing.

Current V1 uses deterministic `npcId`-seeded hair, beard and clothing variation in `src/ai/npcAppearance.ts`, assembled in `src/ai/NpcAgent.ts`. It does not currently apply these hand-picked presets. Documented choices below are **target appearance**, not a claim of runtime implementation. Other procedural NPCs retain their existing variation.

## Agreed appearance fields

Visual age, height, body build, face/head variant, hair color, hairstyle, facial hair, and outfit. No separate posture or distinctive features at this stage.

Body builds: if the eventual set contains **3 variants** (`standard`, `slim`, `fat`), Mark is `standard`; if **4** (`standard`, `superhero`, `slim`, `fat`), Mark is `superhero`. `superhero` denotes the muscular proportions of the current free Character Pack body. `standard` in the four-variant setup denotes a future more natural body. Body proportions are planned as Blender variants; initial fallback may scale the base model but proportional scaling does not truly change build. Keep height separate from build.

Facial hair roadmap: `none`, `moustache`, `beard_and_moustache`; optional `stubble` (unshaven) as a future fourth variant. Runtime supports `facialHair: none | moustache | beard` (since 2026-11-02); stubble remains future.

## Character appearance table

| Character (canonical / V1 legacy) | Stable V1 characterKey | Visual age | Height | Body build | Face | Hair color | Hairstyle | Facial hair | Outfit | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Mark Hornblower / Marek Hornblower** | `marek_hornblower` | mature, ~38 | tall | `standard` in 3-build system; **`superhero`** in 4-build system | `standard` | brown | short | **`none` now**, `stubble` when supported | guard | Author choices recorded |
| **Kate Hornblower / Kasia Hornblower** | `kasia_hornblower` | ~34 | medium | `standard` (average) | `standard` | **copper brown** (new color) | braid **or** pinned up; **not `Buns`** | `none` | trader | Author choices recorded; hairstyle alternative remains |
| **Peter Woodward / Piotr Leśniewski** | `piotr_lesniewski` | ~36 | standard/medium | **`superhero`** | `standard` | brown | short | **`moustache`** | woodcutter | Author choices recorded |
| **Ann Woodward / Anna Leśniewska** | `anna_lesniewska` (legacy; verify canonical binding) | 32 | medium | **`slim`** (target; not yet shipped) | **`Lean`** | **`brown`** | **`Long`** (not `Buns`) | `none` | practical farmer / work skirt and apron reference | Author-approved appearance; asset fidelity pending |
| **Molly Lambert** | pending stable binding (`M01` authored actor) | ~25–30 (proposed) | **short** | **`slim`** (target; not yet shipped) | **`Warm`** | **`blond`** | **`Long`** | `none` | practical shepherdess | Author-approved appearance based on supplied portrait; age estimate pending canon verification |
| **Jacob Bowman / Jakub** | `B01` (authored actor; runtime binding pending) | ~35–40 (visual estimate) | tall | **`standard`** | **`Base`** | **`brown`** | **`Long`** | **`beard_and_moustache`** (future variant) | **`Ranger_NoHood`** | Author-approved appearance; beard variant pending |

| **Rudolf (reeve; surname pending)** | pending stable V1 actor binding | ~50–55 (visual estimate) | medium | **`standard`** | **`Base`** | **`brown`** | **`Parted`** | **`beard_and_moustache`** (future variant) | prosperous village reeve; practical fur-trimmed vest, no armour | Author-approved appearance based on supplied portrait; exact outfit asset pending |

| **Casimir Eastwood / Kazimierz (V3 elder E01; proposed identity)** | `E01` (authored donor actor; V1 binding unresolved) | ~70–75 (visual estimate) | **tall** | **`slim`** (target; not yet shipped) | **`Lean`** | **`grey`** | **`Parted`** | **`stubble`** (future variant) | modest, worn earth-toned village clothes | Author-approved appearance; asset and identity binding pending |

**Interpretation notes:** Age estimates derive from the curated character canon, not current V1 generated age (reserved-family ages are presently generated). `standard` face means the author's intended ordinary face; map to the appropriate available head asset during implementation, not automatically to a code variant without visual review. Outfits are narrative/profession choices, not necessarily the precise currently assembled clothing. Mark's `stubble` is a deferred preference, not a current substitute for `none`. Peter's `superhero` selection is explicit even if a three-build taxonomy is eventually adopted: settle how that taxonomy represents his muscular appearance before implementation.

### Ann visual fidelity

Ann's V3 draft reference (`references/ann-woodward-reference-draft.png`) depicts a lean, work-worn, approachable 32-year-old farmer with loosely pinned brown hair. The author selected the currently supported `Long` hairstyle instead of `Buns` (which reads as Princess Leia buns); `Lean` is the selected head variant and `brown` is the supported tint. Her desired `slim` body is a **future asset/body variant**, not an existing working option. The loose updo in the image is reference direction only, not a requirement to invent or ship another hairstyle. Her farmer outfit should remain practical; the exact apron is subject to existing garment availability. Do not claim the preset is applied in V1 runtime.

### Molly visual direction

Author supplied a portrait of Molly with a lamb: youthful, gentle expression, light blond hair loosely braided with flyaways, modest cream linen and brown work clothing. Selected V1-compatible approximation: `Warm` head, `blond` tint, `Long` hair; **short** height, target `slim` build. The portrait's braid is not represented exactly by `Long`; no additional hair asset was approved. Portrait was provided in conversation and is **not** claimed to be committed to repository references. Age ~25–30 is a proposal, not verified canonical age. No runtime override is implemented.

### Jacob visual direction

Author supplied a V3 Jakub hunter reference showing a friendly, outdoorsy, free-spirited hunter with long tousled brown hair and beard with moustache. Selected `Base` head (explicitly **not** `Warm`), `Long` hair, `brown` tint, tall stature, `standard` build and `Ranger_NoHood` outfit. The desired `beard_and_moustache` requires the planned facial-hair extension; current beard boolean does not guarantee exact match. Visual age ~35–40 is an estimate. Reference was supplied in conversation, not added as an asset to the repository. No runtime changes.

### Rudolf visual direction

Author-approved supplied portrait: experienced village reeve, 50–55 visual years, medium height and standard build; **`Base`** head, **`brown`** hair with **`Parted`** style, **`beard_and_moustache`**. Clothing implies somewhat prosperous but practical village leadership, e.g. dark patterned vest with fur edging, not aristocratic or armoured. Beard is visibly greying in the portrait despite the selected `brown` hair tint; separate beard tint is not approved or implemented, so check asset fidelity later. Exact outfit is not selected from available kit assets. Surname and stable actor binding remain unresolved; don't conflate with donor Ralph Fieldman. No runtime changes.

### Casimir visual direction

Author supplied a garden portrait of an elderly, lean, tall and weathered man with unruly grey hair and short grey stubble. Approved closest existing hairstyle is `Parted`, even though reference hair looks longer and tousled; chosen `Lean` head, `grey` tint, tall height and future `slim` build. His clothing is modest, practical and worn, without an adventurer costume. `stubble` requires a new facial-hair variant. Keep V3 elder `E01` distinct from existing V1 Kazimierz Nowak (74); Casimir Eastwood remains a proposed donor identity, not an authorized runtime rename or merge. Supplied portrait is not committed as a repository asset. No runtime changes.

## Runtime mapping (2026-11-02)

Body-build set is **3 variants**: `muscular` (original Character Pack body, author "base") / `slim` / `heavy`. Per the 3-build rule above, `standard` → `muscular`; Peter's `superhero` → `muscular` too (same body today).

| characterKey | build | head | hair | colour | facial hair | stand-ins (🟡 author visual review) |
| --- | --- | --- | --- | --- | --- | --- |
| `marek_hornblower` | muscular | Base | Buzzed | brown | no | "short" → `Buzzed`; stubble later |
| `kasia_hornblower` | muscular | Base | Long | copper (new tint `0x8c4a2a`) | no | braid/updo → `Long` |
| `piotr_lesniewski` | muscular | Base | Buzzed | brown | moustache | chevron moustache (`HAIR_Moustache`, 2026-11-02); no beard |
| `anna_lesniewska` | slim | Lean | Long | brown | no | — |
| `molly_lambert` | slim | Warm | Long | blond | no | short height not modelled |
| `jakub` | muscular | Base | Long | brown | yes | beard_and_moustache → full beard; outfit via hunter role (`Ranger_NoHood`) |
| `rudolf` | muscular | Base | Parted | brown | yes | beard_and_moustache → full beard; outfit via role |

Not applied: Casimir/E01 (kept distinct from V1 `kazimierz`), height, outfits beyond the existing role mapping.

## Implementation follow-up (not yet a plan)

- Add stable character-keyed appearance overrides without rewriting the procedural NPC resolver or identity/save lifecycle.
- Moustache done (2026-11-02, `facialHair: 'none' | 'moustache' | 'beard'`); still missing: optional stubble model and a separate beard-plus-moustache look (the `Beard` node already includes its own moustache area).
- Add copper-brown hair and Kate's braid/updo distinct from `Buns`; verify available CharacterKit nodes before Blender work.
- Evaluate Blender `standard`/`superhero`/`slim`/`fat` bodies and lightweight initial fallback; check skeleton, rig, clothing fit, animation, LOD and rendering cost before adopting variants.
- Validate the selected appearance visually against curated V3 references and test that it survives streaming and save/load.
- Do not treat these notes as authorization to modify runtime assets or systems.

## Next NPC

To be selected in the next author discussion.
