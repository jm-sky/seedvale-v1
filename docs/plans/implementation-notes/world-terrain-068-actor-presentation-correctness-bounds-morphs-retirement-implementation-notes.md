# world-terrain-068 — implementation notes

## A2 — garment named morph rebinding (2026-11-06, Sonnet, queue Q174)

- **Implemented:** `rebindAllSkinned` (`src/characters/assembleCharacter.ts`) now copies the source mesh's GLTF-assigned `morphTargetDictionary` and gives the rebound mesh its own `morphTargetInfluences` array (never shared across actors). `applyBodyBuild` call sites unchanged; NPC build selection unchanged.
- **Root cause confirmed:** the fresh `SkinnedMesh(geometry, material)` rebuilt its dictionary from geometry morph attributes (numeric names), so `applyBodyBuild` reported `no morph on <garment>` and garments never followed Heavy/Slim.
- **Technically verified:** `assembleCharacter.garmentMorphs.assets.test.ts` (production assembly over real GLBs, Female NobleBodice + WorkSkirt, Heavy and Slim): no warnings, named `Fat`/`Slim` dictionaries, chosen weight 1 / other 0, a second actor with the opposite build keeps independent weights. Test fails without the fix. Characters/player/actor-bounds suites, lint and type-check pass.
- **Not verified:** browser seam check (both sexes, skirts/bodices) — queued for the author (§2). Garment GLBs did carry matching morphs for these garments (no asset gap found); other garments/roles not exercised.

## A1 — animal animated bounds: approach decision + fixture spec (2026-11-07, Opus, queue Q173 O part)

**Decision: reuse `installActorCullBounds` unchanged for animals** — no quadruped/species envelope, no per-template pose sampling, no per-frame work.

**Evidence (✅ throw-away CPU probe, not committed; same on-disk GLB loader as `actorCullBounds.assets.test.ts`):** every shipped GLB in `public/models/fauna/` was loaded, fitted with `prepareProp(root, 1)`, wrapped in a `Group` scaled 1.3, given `installActorCullBounds(wrapper)`, then **every clip** in the file was played `LoopOnce` + `clampWhenFinished` and sampled at 17 times; metric = max over vertices of `|v − sphere.center| / sphere.radius` in world space.

| model | skinned meshes culled / fallback | clips | worst ratio (clip) |
| --- | --- | --- | --- |
| bear | 1 / 0 | 6 | 0.51 (Gallop) |
| cow | 7 / 0 | 25 | 0.72 (Gallop_Jump) |
| deer | 7 / 0 | 13 | 0.62 (Death) |
| dog_husky / dog_shiba | 5 / 0 · 6 / 0 | 24 · 24 | 0.63 · 0.64 (Death) |
| donkey | 7 / 0 | 26 | 0.60 (Death) |
| fox | 4 / 0 | 12 | 0.66 (Death) |
| horse | 8 / 0 | 26 | 0.59 (Death) |
| rabbit | 1 / 0 | 2 | 0.52 (Walk) |
| rat | 2 / 0 | 6 | 0.69 (Rat_Attack) |
| sheep | 2 / 0 | 2 | 0.60 (Jump) |
| stag | 5 / 0 | 13 | 0.62 (Death) |
| wild_boar | 5 / 0 | 6 | **0.74** (Attack) |
| wolf | 4 / 0 | 12 | 0.64 (Death) |
| chicken, duck, rooster | 0 skinned meshes (rigid; native per-mesh bounds already follow node transforms) | 0 | — |

So the existing actor envelope (bind union, radius = half diagonal + height) contains all clips incl. death with ≥ 26 % spare radius; the review 039 failure is only that animals never call it. The spare radius may add a few edge draws (record in the census, no FPS claim).

**Implementation spec for S (Q173):**

1. Call `installActorCullBounds(this.mesh)` in the `AnimalAgent` constructor for GLB visuals (the `visual` branch, after `shareActorSkeletons`, before `createAgentAnimationSet`/the first mixer update — bind pose), the same way `NpcAgent.ts` does. Later root scale changes (juvenile, variant, maturity, `markDangerous`) are root-relative and need no reinstall; a reinstall is needed only if the visual is rebuilt. Capsule and procedural fallbacks are untouched (non-skinned). Rats are `AnimalAgent('rat')` and livestock go through `AnimalAgent` too — confirm in code that no other construction path (e.g. a mount/rider visual, detached livestock rebuild) bypasses the constructor; if one does, install there.
2. Fixture: extend `src/render/actorCullBounds.assets.test.ts` with an `it.each` over the 14 skinned fauna GLBs (wild `FAUNA_URLS`, livestock URLs incl. both dogs, `RAT_URL`) through the **production template path** (`prepareProp(root, ANIMAL_DEFS[kind].modelHeight)`, SkeletonUtils clone, wrap, the largest juvenile × variant scale in use), every clip × 17 samples via the existing `verifyPose`, plus `settleAtEnd('death')` (corpse rehydrate) and a clone-survives check. Keep `expect(result.fallback).toBe(0)`.
3. Fail-open test: a nonuniformly scaled animal wrapper → `fallback > 0`, `frustumCulled === false` (the function already does this; assert it for the animal path).
4. F16-26 guardrail: in `actorSkeletonSharing.assets.test.ts`, assert that with skeleton sharing on, the bounds-installed meshes still pass `verifyPose` (a rig change that breaks sharing parity must fail a test, not silently clip).
5. Census before/after on `?seed=415424794` (fauna draw + shadow calls at the home village, same camera pose) — record in these notes; one revertable commit; draw delta to queue §4 only if non-trivial; edge-pop look → queue §2.

**Stop if** (plan): needs per-frame bounds — not the case on this evidence.
