# Named NPC visual identity — author decisions

**Created:** 2026-10-31  
**Status:** In progress — author-approved appearance selections; documentation only  
**Scope:** V1 Revival, named recurring NPCs  
**Implementation:** Not authorized by this record; future plan required

## Purpose

Keep the same recognizable physical appearance for important recurring NPCs across game sessions, save/load, streaming, dialogue/quests, and presentation changes. Character identity must not depend on a display name (legacy Polish names are being migrated); use stable `CharacterKey` or the eventual canonical authored actor binding. These selections complement the narrative profiles and reference images under `docs/v3-donor/characters/`, rather than replace them. Resolve conflicts with approved cast/identity decisions and current V1 source before implementing.

Current V1 uses deterministic `npcId`-seeded hair, beard and clothing variation in `src/ai/npcAppearance.ts`, assembled in `src/ai/NpcAgent.ts`. It does not currently apply these hand-picked presets. Documented choices below are **target appearance**, not a claim of runtime implementation. Other procedural NPCs retain their existing variation.

## Agreed appearance fields

Visual age, height, body build, face/head variant, hair color, hairstyle, facial hair, and outfit. No separate posture or distinctive features at this stage.

Body builds: if the eventual set contains **3 variants** (`standard`, `slim`, `fat`), Mark is `standard`; if **4** (`standard`, `superhero`, `slim`, `fat`), Mark is `superhero`. `superhero` denotes the muscular proportions of the current free Character Pack body. `standard` in the four-variant setup denotes a future more natural body. Body proportions are planned as Blender variants; initial fallback may scale the base model but proportional scaling does not truly change build. Keep height separate from build.

Facial hair roadmap: `none`, `moustache`, `beard_and_moustache`; optional `stubble` (unshaven) as a future fourth variant. Current runtime supports beard as boolean, so the requested facial-hair distinctions need an extension.

## Character appearance table

| Character (canonical / V1 legacy) | Stable V1 characterKey | Visual age | Height | Body build | Face | Hair color | Hairstyle | Facial hair | Outfit | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Mark Hornblower / Marek Hornblower** | `marek_hornblower` | mature, ~38 | tall | `standard` in 3-build system; **`superhero`** in 4-build system | `standard` | brown | short | **`none` now**, `stubble` when supported | guard | Author choices recorded |
| **Kate Hornblower / Kasia Hornblower** | `kasia_hornblower` | ~34 | medium | `standard` (average) | `standard` | **copper brown** (new color) | braid **or** pinned up; **not `Buns`** | `none` | trader | Author choices recorded; hairstyle alternative remains |
| **Peter Woodward / Piotr Leśniewski** | `piotr_lesniewski` | ~36 | standard/medium | **`superhero`** | `standard` | brown | short | **`moustache`** | woodcutter | Author choices recorded |
| **Ann Woodward / Anna Leśniewska** | `anna_lesniewska` (legacy; verify canonical binding) | 32 | medium | **`slim`** (target; not yet shipped) | **`Lean`** | **`brown`** | **`Long`** (not `Buns`) | `none` | practical farmer / work skirt and apron reference | Author-approved appearance; asset fidelity pending |

**Interpretation notes:** Age estimates derive from the curated character canon, not current V1 generated age (reserved-family ages are presently generated). `standard` face means the author's intended ordinary face; map to the appropriate available head asset during implementation, not automatically to a code variant without visual review. Outfits are narrative/profession choices, not necessarily the precise currently assembled clothing. Mark's `stubble` is a deferred preference, not a current substitute for `none`. Peter's `superhero` selection is explicit even if a three-build taxonomy is eventually adopted: settle how that taxonomy represents his muscular appearance before implementation.

### Ann visual fidelity

Ann's V3 draft reference (`references/ann-woodward-reference-draft.png`) depicts a lean, work-worn, approachable 32-year-old farmer with loosely pinned brown hair. The author selected the currently supported `Long` hairstyle instead of `Buns` (which reads as Princess Leia buns); `Lean` is the selected head variant and `brown` is the supported tint. Her desired `slim` body is a **future asset/body variant**, not an existing working option. The loose updo in the image is reference direction only, not a requirement to invent or ship another hairstyle. Her farmer outfit should remain practical; the exact apron is subject to existing garment availability. Do not claim the preset is applied in V1 runtime.

## Implementation follow-up (not yet a plan)

- Add stable character-keyed appearance overrides without rewriting the procedural NPC resolver or identity/save lifecycle.
- Support the missing moustache, beard-plus-moustache and optional stubble visual models; current boolean beard cannot express them.
- Add copper-brown hair and Kate's braid/updo distinct from `Buns`; verify available CharacterKit nodes before Blender work.
- Evaluate Blender `standard`/`superhero`/`slim`/`fat` bodies and lightweight initial fallback; check skeleton, rig, clothing fit, animation, LOD and rendering cost before adopting variants.
- Validate the selected appearance visually against curated V3 references and test that it survives streaming and save/load.
- Do not treat these notes as authorization to modify runtime assets or systems.

## Next NPC

To be selected in the next author discussion.
