# D11 — Peasant body merge, native Windows A/B preparation

**Status: PRE-BENCHMARK; KEEP / REVERT PENDING.** The author explicitly instructed
“dont start benchmark unitil I say so”. No settlement-heavy run, warm-up,
performance probe or FPS comparison was started. Structural savings are not an
FPS result. Production behaviour remains unchanged unless explicitly opted in.

## Source pins and reproduction

- Baseline: `91a1db314be88d6908b81de6447bd1513f95870a` (latest origin/main fetched at task start).
- Experiment revision: the commit containing this report on
  `experiment/d11-peasant-body-merge` (`git log -1 --format=%H` on that branch).
  This is an experimental commit, not a KEEP decision or integration into main.
- The experimental branch was created successfully after the author's retry
  instruction; `main` still points to the baseline SHA above.
- Reproducible experiment: [patch](./2026-10-29--win-peasant-body-merge-experiment.patch).
  SHA256: `d78b6482323ac8bdd6bc0c1af96cedd05e36ae5b72f7e03c0ccf7e7c20d5e063`.
  `git apply --reverse --check` passed against the experiment working tree.
  It contains runtime integration and real-asset tests. From the baseline, use
  `git apply --check <patch>` followed by `git apply <patch>` in a clean checkout.
  Do not apply it over the already modified experiment working tree.
- A: `?peasantBodyMerge=0`; B: `?peasantBodyMerge=1`. Missing flag means A.
  Both use the same build; no skeleton-sharing or CSS2D experiment is enabled.
- The author authorized committing the complete opt-in experiment, tests, report
  and diagnostics together on that experimental branch, without integrating
  runtime into `main`. The URL toggle remains default-off. KEEP / REVERT remains pending.

## Implementation and integration

| File | Change |
| --- | --- |
| `src/characters/assembleCharacter.ts` | Capture exact body `SkinnedMesh` references before attaching head, hair or garments. Player assembly receives metadata only. |
| `src/characters/mergePeasantBody.ts` | Validate plain Peasant ownership, render/material policies, rig and attribute compatibility; bake cloth into one binding; concatenate indices with no material groups. New geometry, material and palette are actor-owned. |
| `src/ai/NpcAgent.ts` | Opt-in call after existing outfit/dye/hair preparation and before wrapper normalization/conservative bounds. Dispose only the new merged palette at teardown. Legacy and non-Peasant paths are unchanged. |
| `src/perf/flags.ts` | Strict opt-in URL toggle. |
| `src/characters/mergePeasantBody.assets.test.ts` | Real GLB assembly, materials, rigs, morphs and clips; numeric deformation, attributes, bounds, picking, lifecycle and fallback tests. Image decoding alone is stubbed. |
| `scripts/perf/peasant-body-merge-check.{html,mjs}` | Isolated fixed-pose WebGL/pixel/submission diagnostic; never invokes the world or benchmark harness. |
| `scripts/perf/peasant-body-merge.vitest.config.mjs` | Sandbox-compatible test loader; no production configuration change. |

Selection uses assembly ownership, with material semantics determining cloth
boundaries. It does not guess mesh names. Male skin stays independent; head,
eyes, hair, beard, skirts, bodices, professions, player, fauna and legacy remain
outside the merge. Unsupported configurations preserve all original meshes.

For every bone, require `Ipart[j] = Icanonical[j] * T` with maximum absolute
component residual `5e-7` (shipped Float32 residuals are <= `1.4e-7`). Bake
`C = inverse(Bcanonical) * T * Bpart` into geometry positions; use its linear
part for normals, tangents and relative morph deltas, without normalization.
Identical part world transforms preserve Three's normal/tangent operators;
independently transformed parts fall back. Wrapper/child rotation and uniform
scale remain supported. All bone references/order must match inside this actor.

The merged cloth gets a **new** Skeleton palette. No separate skeleton-sharing
optimization is installed, and male skin retains its existing binding. Cached
geometry, inverse binds and materials are not modified. Superseded actor material
clones are disposed only if no remaining mesh in the actor references them.
The new geometry/material use the existing `disposeObject3D` ownership contract.

Female cloth mixes absent COLOR_0 and RGBA vertex colors. Missing/disabled color
attributes become neutral white; existing colors, including alpha, are retained.
Material comparison ignores identity/name/version/listener metadata and this
normalized vertex-color flag; all other enumerable state must match exactly,
including linear color/vector components and actual texture references (no
hex-color quantization or image serialization). Custom shaders/hooks,
transparent/alpha-hash/flat materials, independent part/morph animation tracks,
visibility/shadow differences and incompatible layouts/bindings fail open.

Three r185's `mergeGeometries` validates but does not propagate
`morphTargetsRelative`. The implementation explicitly restores it; real Fat=0.5/1
tests detected the deformation error when it was absent.

## Structural evidence

These are real-asset geometry counts and full-admission submission expectations,
**not measured settlement-heavy render submissions**. The separate isolated
WebGL capture below now confirms actual draws for these fully admitted bodies.

| Body | Meshes before → after | Logical materials before → after | Vertices unchanged | Triangles unchanged | Saved calls per fully admitted body/pass |
| --- | ---: | ---: | ---: | ---: | ---: |
| Male Peasant | 5 → 2 | 2 → 2 (cloth + skin) | 5,852 | 8,576 | 3 |
| Female Peasant | 4 → 1 | 1 → 1 (cloth; vertex-color variants normalized) | 5,206 | 5,915 | 3 |

Cloth is one single-material mesh with **zero geometry groups**, hence one draw
when admitted. Male cloth contains 5,001 vertices / 7,202 triangles; the remaining
851 vertices / 1,374 triangles belong to skin. UVs, skin indices/weights, colors,
morph dictionary/influences, texture references and triangle counts are checked.

| Measurement | Main saved submissions | Shadow saved submissions |
| --- | --- | --- |
| Full-admission structural expectation | 3 per Peasant body | 3 per Peasant body per admitted light/shadow view |
| Isolated fixed-pose WebGL diagnostic, all 64 poses | **3 per body** (male 5→2, female 4→1) | **3 per body** (male 5→2, female 4→1), one directional-light view |
| settlement-heavy, same-session A/B | NOT RUN | NOT RUN |

No observed Peasant-family counts, admitted body counts, stable NPC/fauna counts
or unchanged other-family workload are claimed yet. Existing
`passSubmissionCollector` family buckets are available for the later A/B. Match
admitted bodies as well as population; family census alone cannot certify that.

## Correctness verification

Completed final suite: **75 tests passed** in four files: body merge
suite (40), real-asset actor bounds (6), synthetic actor bounds (24), existing
pass submission collector (5). [Machine-readable result](./win/2026-10-29--peasant-body-merge-tests.json).

The body parity test samples every cloth vertex at 9 points in each of
`Idle_Loop`, `Walk_Loop`, `Sprint_Loop`, `Sword_Attack`, `Interact`,
`Sitting_Idle_Loop`, `Fixing_Kneeling`, and `Death01`, at Fat 0 / 0.5 / 1:
216 poses per sex. Death includes the clamped final frame. The actor has translated,
rotated and uniformly scaled wrapper and child transforms.

| Real asset | Maximum world position difference | Maximum normalized world normal difference |
| --- | ---: | ---: |
| Male Peasant | `1.5785987075347127e-7 m` | `7.655695821695246e-8` |
| Female Peasant | `7.804636598266546e-8 m` | `7.955842622284538e-8` |

Assertions use `3e-6` for position/normal/raycast parity, accounting for Float32
vertex rebaking and <=5e-7 inverse-bind factor residual at character scale. No
geometry simplification or permissive centimetre-scale allowance is used.
Every sampled vertex remains inside the installed conservative box and sphere.
Representative ray hit counts/world positions match. Tests cover separate NPC
dyes, cached geometry immutability, cloned bones, streamed reconstruction,
actor-owned disposal and an unaffected survivor, shadow flags, and atomic
fallback for altered matrices, bone order/references, detached binding, singular
or different transforms, materials, visibility, shadows, morph values, groups and
part animation.

The final run includes synthetic tangent handedness
and direction parity, complete cached-scene snapshots, repeat application,
unsupported outfits, missing/nonfinite bindings and custom shader fallback.
An additional fallback regression covers tint differences below hex-color precision.
Final runtime hardening also checks exact material state, actor ownership, morph-layout consistency,
custom hooks, pre-existing palette textures and retained material users.
The original standard run passed 63 tests before these additional tests and
hardening. Two attempts to run the final suite outside the sandbox could not
obtain automatic approval because the review model was at capacity. The final
75-test run succeeded **inside the sandbox**, using worker threads and
in-process TypeScript transpilation rather than an external esbuild process.
`preserveSymlinks` avoids Vite's Windows `net use` subprocess probe. Reproduce:

```text
node node_modules/vitest/vitest.mjs run --config scripts/perf/peasant-body-merge.vitest.config.mjs --configLoader native
```

This changes only test loading, not production code, GLB data, assertions or
numeric tolerances. No dependency installation or permission expansion was used.

Final `vue-tsc --noEmit`, targeted ESLint and `git diff --check` passed. The
existing `PlayerController.appearance.test.ts` could not start because local
`jsdom` lacks `is-potential-custom-element-name`; this is a dependency/environment
failure, not a passing test or an asserted player regression. No dependencies or
lockfile were changed.

## Visual / GPU verification

**PASS for the isolated 64-pose visual comparison; not an in-world gameplay
acceptance.** Native Windows Chrome reported Intel Arc 140V through ANGLE D3D11.
Both sexes were rendered with real textures, existing appearance preparation,
hair/garments, a receiving ground plane and one directional shadow map. The
comparison covers all eight listed clips, Fat 0/1, and front/rear views. Death
uses the settled final frame. Each render is 512×512; readback is explicitly sRGB
so the ordinary 2D preview canvases display the correct brightness.

The full [contact sheet](./win/2026-10-29--peasant-body-merge-contact-sheet.png)
was inspected in four sections at its original resolution. No meaningful
differences in silhouette, sampled animation deformation, material appearance or
cast/received body shadows were visible between A and B. Existing garment/body
intersections, where present at Fat=1, also appear in A. No new merge-specific
artifact was observed. This is sampled pose review, not continuous playback or a
camera/frustum sweep in the world.

[Raw WebGL/pixel evidence](./win/2026-10-29--peasant-body-webgl-correctness.json)
contains all 64 comparisons: no recorded JS errors and `glError=0`. Main and
shadow triangle counts match in every row; renderer.info total calls agree with
the separate main+shadow counts. Every pose saves three actual main calls and
three actual shadow calls. Non-body scene submissions are unchanged in each
arm: six for the male setup and seven for the female setup, including the one
ground-plane draw in each. Only body submissions change.

| Asset (32 poses each) | Body main A→B | Body shadow A→B | Maximum differing pixels / 262,144 | Maximum channel delta / 255 | Maximum whole-image mean absolute RGB channel delta |
| --- | ---: | ---: | ---: | ---: | ---: |
| Male | 5→2 | 5→2 | 23 | 20 | `0.0000864665` |
| Female | 4→1 | 4→1 | 14 | 42 | `0.000179291` |

These images are not bit-identical. The sparse pixel differences are consistent
with floating-point/rasterization boundaries given the measured <1.6e-7 m vertex
residuals; that cause is an inference, not a per-pixel classification. The table
reports the maxima rather than hiding them behind an acceptance threshold.
Visual inspection found no meaningful appearance change.

Capture provenance: the JSON embeds baseline SHA `91a1db31` because Vite was
started before the experimental commit. It was captured from this experimental
working tree, with the runtime/test diff preserved by the patch SHA256 above,
not from an unmodified baseline checkout. It is correctness evidence, not a
certified FPS baseline. Restart Vite after the experiment commit before any
later A/B so the harness embeds the common experimental SHA.

Earlier approval failures and a debugger detachment delayed the check; a fresh
diagnostic tab recovered it. Both the JSON and contact sheet were exported
through the page and saved with the report. The diagnostic does **not** measure
FPS or simulate settlement-heavy. Run it at
`/scripts/perf/peasant-body-merge-check.html` on a Vite server. In-world camera-edge
culling, continuous motion and the existing player appearance regression suite
remain separate pre-acceptance checks.

## A/B protocol — awaiting the author's start signal

One build; native Windows Chrome on verified Intel Arc 140V; High and existing
viewport/DPR; identical settlement-heavy fixture/seed/camera/time/weather. One
Chrome/benchmark workload at a time, standard warm-up and cooldown. Minimum
30 seconds per repetition in order **A B B A A B**. Do not use historical FPS as
the control and do not overlap this diagnostic with measurements.

| Order | Arm | Seconds | Avg FPS | Frame p50/p95/p99 | RENDER p50/p95 | Main/shadow calls | Peasant family main/shadow | GPU timing | Long frames / workload |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A disabled | NOT RUN | — | — | — | — | — | — | — |
| 2 | B enabled | NOT RUN | — | — | — | — | — | — | — |
| 3 | B enabled | NOT RUN | — | — | — | — | — | — | — |
| 4 | A disabled | NOT RUN | — | — | — | — | — | — | — |
| 5 | A disabled | NOT RUN | — | — | — | — | — | — | — |
| 6 | B enabled | NOT RUN | — | — | — | — | — | — | — |
| Mean | A | — | — | — | — | — | — | — | — |
| Mean | B | — | — | — | — | — | — | — | — |

Record raw/JSON/Markdown/meta bundles, common experiment SHA, hardware/driver/
power context, fixtureVersion, observed pass-counter reliability, admitted body
counts, NPC/fauna counts, unchanged triangles/material appearance and other
families. Report GPU queries only when actually available. Compare repeatability
against same-session spread/drift and p95/p99/lifecycle behaviour.

## Decision and limitations

**KEEP / REVERT: PENDING.** Neither verdict is justified before the author starts
A/B and the remaining in-world/acceptance gates pass. The experiment is off by default.
Do not expand to other models to seek a positive result. KEEP requires repeatable
frame/FPS benefit beyond noise, observed submission reduction and no meaningful
visual/tail/lifecycle regression; otherwise REVERT and retain the patch/evidence.

The optimization allocates per-NPC merged geometry/material data; memory and
construction cost are not yet measured. SkeletonUtils cloning preserves normal
Three geometry/material sharing semantics: a retained clone must not outlive a
disposal of shared assembled resources. Production streaming rebuilds from the
loader cache and merges anew, as exercised in the tests. Independent runtime
visibility/morph policies for individual cloth parts require fallback, not a new
per-frame synchronization system. Isolated GPU appearance is verified above;
real-world culling/picking and continuous presentation were not manually tested.

## Remaining gates before A/B / acceptance

- The author must give a separate benchmark start signal. None has been given.
- Restart Vite after the experimental commit; pin the common A/B SHA and verify
  the target GPU, fixture, camera, populations and admitted body counts.
- Perform the in-world visual smoke (continuous animation, camera/frustum edges,
  picking and shadow transitions) before performance acceptance. Automated bounds,
  raycast and sampled animation tests already pass; the isolated scene is not a
  substitute for this gameplay observation.
- Restore the incomplete local jsdom dependency before running the existing
  `PlayerController.appearance.test.ts`; its environment failure is documented
  above and was not repaired as part of this focused experiment.

No runtime integration into main or default enablement is authorized by this
experimental commit. Benchmark A/B remains unrun and KEEP / REVERT stays PENDING.
