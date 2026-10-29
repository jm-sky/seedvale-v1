# D11 — Peasant body merge, native Windows A/B preparation

**Status: BENCHMARKED — verdict REVERT (recommendation; branch preserved, not merged).** Six-run A/B completed at `cee85ed2`; see the in-world, A/B and decision sections below. The preparation text that follows is retained as written. Structural savings are not an
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

## In-world verification (settlement-heavy, native Windows, Arc 140V) — PARTIAL

Driven through headed Chrome + CDP (fresh profile, 1600×900, SHA `cee85ed2`, Vite restarted after
checkout). Only arm **B** (`peasantBodyMerge=1`) was driven interactively; no A in-world comparison
was made. Screenshots were reviewed by eye; they are not committed (large, mostly fog).

| # | Check | Result |
| ---: | --- | --- |
| 1 | Male/female Peasant appearance | **NOT VERIFIED.** The benchmark camera sits on the player at the village well; 53 NPCs are in the `mid`/`far` bands (near = 0–1). Rain/fog hid every NPC body in 2 auto-run + 6 controlled-camera captures (yaw 0–4.71, dist 3.5–10, pitch 0.15–0.5) and in a W/A/D walk capture. No body was inspected at readable size. |
| 2 | Continuous animation (move/turn/interact) | **NOT VERIFIED.** Only the player (not merged) was seen. |
| 3 | Camera rotation/movement | Controlled-camera runs and W/A/D movement: no rendering problem. No pointer-lock rotation (not achievable through CDP). |
| 4 | Frustum-edge culling | **NOT VERIFIED** (no merged body at a frustum edge observed). |
| 5 | Raycast / picking / NPC interaction | **NOT VERIFIED.** One `E` press with no NPC in range only. Automated raycast parity tests pass (see above). |
| 6 | Shadows during movement | **NOT VERIFIED** visually. Pass counters confirm Peasant shadow submissions drop as designed (below). |
| 7 | Streaming / unload / reload | **Partial.** The player walked out of the settlement into new chunks for ~40 s without errors; no NPC reconstruction was observed. |
| 8 | Material / tint / morph / garment artifacts | **NOT VERIFIED in-world.** The isolated 64-pose sheet remains the only visual evidence. |
| 9 | Console / WebGL errors | **PASS** for B: `glError = 0`; 0 console errors or exceptions; only `[PERF:*]` / `[LONG FRAME]` warnings and the AudioContext-gesture notice. ([log](./win/2026-10-29--d11-inworld-B-console.json), [walk log](./win/2026-10-29--d11-inworld-B-walk-console.json)) |

No correctness regression was found, but checks 1, 2, 4, 5, 6 (visual) and 8 were not observed. **The
isolated contact sheet is still the only appearance evidence; in-world visual acceptance is not claimed.**
The benchmark proceeded because no regression was found; it cannot yield KEEP on its own.

## Controlled A/B — settlement-heavy

Pinned build `cee85ed2fa8531600e58aa2d0c646c3cff2cb102` (all six `meta.gitSha` match), one Vite server,
`hardwareClass: target-gpu`, Intel Arc 140V via ANGLE D3D11, Chrome 156, High quality, 1586×806 @ DPR 1.25,
fixture `tools-001-v1`, identical seed/camera, rain, timeOfDay 0.2917. Fresh profile per run, 30 s cooldown,
30 s measured window, one run at a time, order **A B B A A B** (A = `peasantBodyMerge=0`, B = `=1`).
Pass-counter reliability `observed` and population gate `stable` in all six.

| Run | Arm | FPS | Frame mean | p50 | p95 | p99 | max | RENDER p50/p95 | Long frames | Main calls | Shadow calls | Peasant main/shadow | GPU timer avg/p95 |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| 1 | A | 28.6 | 35.0 | 34.8 | 41.6 | 91.3 | 108.4 | 27.4 / 32.8 | 11 | 1372 | 401 | 119 / 9 | 24.1 / 26.1 |
| 2 | B | 29.8 | 33.5 | 34.3 | 41.0 | 47.0 | 97.4 | 27.1 / 32.5 | 1 | 1334 | 403 | 80 / 6 | 29.2 / 33.0 |
| 3 | B | 27.5 | 36.3 | 35.5 | 45.5 | 91.3 | 108.3 | 27.5 / 33.0 | 26 | 1371 | 403 | 80 / 6 | 24.4 / 26.3 |
| 4 | A | 27.7 | 36.1 | 34.8 | 44.2 | 96.7 | 131.6 | 27.7 / 33.5 | 25 | 1372 | 407 | 119 / 10 | 28.4 / 38.5 |
| 5 | A | 28.2 | 35.4 | 34.2 | 41.8 | 89.1 | 496.6 | 27.0 / 32.4 | 14 | 1409 | 403 | 119 / 9 | 24.1 / 29.3 |
| 6 | B | 29.7 | 33.7 | 34.0 | 40.9 | 53.3 | 100.0 | 26.0 / 32.3 | 5 | 1371 | 399 | 80 / 6 | 30.4 / 35.4 |
| **Mean** | **A** | **28.17** | 35.50 | 34.60 | 42.53 | 92.37 | — | 27.37 / 32.90 | 16.7 | 1384.3 | 403.7 | **119.0 / 9.3** | 25.5 / 31.3 |
| **Mean** | **B** | **29.00** | 34.50 | 34.60 | 42.47 | 63.87 | — | 26.87 / 32.60 | 10.7 | 1358.7 | 401.7 | **80.0 / 6.0** | 28.0 / 31.6 |

Bundles: `docs/performance/results/win/d11-ab-run{1..6}-arm{0|1}-settlement-heavy-rep1.*`
(json / raw / md / meta). The GPU timer was available (querySpan `postprocess+labels`, not a per-draw metric) and is
bimodal (~24 vs ~29 ms) independent of arm (A 24.1/28.4/24.1; B 29.2/24.4/30.4); it is not interpreted.

### Workload equivalence

- Population identical in every run: 53 NPC, 30 fauna, 76 chunks, settlement 8 families / 15 residents; start = end.
- Peasant family: 28 agents in all runs; census meshes 258 (A) → 174 (B) = exactly −3 per body × 28.
- Peasant main triangles: **146,157 in all six runs** (geometry unchanged). Wizard, Farmer, Herbalist, blacksmith and
  Peasant_Boots main buckets are identical in every run; fauna buckets vary slightly (sheep 18–19 calls).
- Distance bands: 0–1 near, 2–4 mid, 49–51 far; 18–19 camera-relevant agents; no meaningful drift.
- **Actual Peasant submissions saved:** main 119 → 80 (**−39 per frame, −33 %**), shadow 9.3 → 6.0 (**≈ −3.3 per frame**)
  — 13 admitted bodies × 3 main calls, constant across all runs.
- **Total submissions:** main total fell by 26 on average (1384 → 1359), but non-Peasant calls varied from 1253 to 1291 between
  runs of the *same* arm, so the total is noisy; the Peasant bucket is the clean signal. Saving ≈ 39 of ~2,060 draw calls (~1.9 %).

### Interpretation

- FPS: A 28.6 / 27.7 / 28.2 (spread 0.9); B 29.8 / 27.5 / 29.7 (spread 2.3). The mean difference (+0.83 FPS, +3 %) is smaller
  than the B spread, and B run 3 is the lowest of all six runs.
- Frame p50 is identical (34.6 ms) and p95 identical (42.5 ms). RENDER p50 −0.5 ms and p95 −0.3 ms are inside the 26.0–27.7 ms
  span of single runs. A saving of that size is what 39 of ~2,060 draws would predict, so the effect may be real, but it is
  **not distinguishable from noise with three runs per arm**.
- Tail: p99 means (92 vs 64 ms) come from occasional hitch frames (A 89–97 ms in all runs; B 47, 91, 53); B run 3 matches A.
  Long-frame counts overlap (A 11–25, B 1–26). A run 5 single 497 ms frame is an A outlier. No tail claim is supported.
- Historical 31–33 FPS figures were not used; this session runs lower (rain, 07:00) and only same-session A/B is compared.

### Construction / streaming / memory

- Per-NPC merge construction time, allocation and GC were **not measured**, and the reports do not record JS heap.
- Observations only: no B run shows a startup or streaming hitch beyond A (B max frames 97/108/100 ms vs A 108/132/497 ms) and the
  ~40 s B-arm walk streamed chunks with no errors. This is absence of evidence, not a cost measurement.

## Decision: **REVERT** (recommendation; branch preserved, nothing merged)

- The intended submissions decreased as designed (−39 main, ≈ −3.3 shadow per frame, geometry unchanged).
- No FPS or frame-time improvement is distinguishable from same-session noise (+0.8 FPS vs 2.3 FPS arm spread; equal p50/p95;
  RENDER −0.5 ms inside the single-run span). This matches the REVERT rule "no meaningful performance improvement is
  distinguishable"; KEEP's repeatable-improvement-beyond-noise requirement is not met.
- In-world visual acceptance was not achieved (PARTIAL), so KEEP was unavailable regardless.
- The merge adds per-NPC geometry/material allocation (unmeasured) for a ~2 % draw-call saving.

What could change this: ≥6 interleaved runs per arm, a denser or closer-camera fixture with more admitted Peasants so the saving
exceeds the noise, and a real in-world visual pass for both sexes. These were out of scope (no new instrumentation, no other families).

## Caveats

- In-world checks 1, 2, 4, 5, 6 (visual) and 8 are unverified; only isolated-pose evidence exists, and only arm B was driven.
- B run 3 reports total draws equal to A, but its Peasant bucket (80 main) confirms the toggle was active; the total differs only
  through non-Peasant variation.
- One machine, one session, rain at 07:00; not generalizable to other GPUs.
- The pre-existing `PlayerController.appearance.test.ts` jsdom environment failure is unchanged.
- No source code changed in this task; `main` is untouched. The experiment stays on `experiment/d11-peasant-body-merge`.
