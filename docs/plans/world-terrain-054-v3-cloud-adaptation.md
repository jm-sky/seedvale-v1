# Plan: Adapt V3 Procedural Clouds to V1 Sky

**Created:** 2026-10-26  
**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Status:** `done` ✅  
**Type:** polish  
**Priority:** medium · **Effort:** M  
**Depends on:** none  
**Domain:** `world-terrain`  
**Subdomains:** `rendering`  
**Tags:** `clouds` `weather` `shader`  
**Model:** `Sonnet`, `Composer`

## Problem

The selected revival direction is to adapt the V3 cloud technique into V1; see the [existing clouds and settlement-spacing comparison](../research/v1-revival/2026-10-26--clouds-settlement-spacing-comparison.md) and [strategic decision](../research/v1-revival/STRATEGIC-BRIEF.md). This plan supersedes the *representation* of [V1 cloud plans 001 and 014](./archive/world-terrain-014-weather-driven-cloud-variety-and-ground-fog.md), not their weather/atmosphere ownership decisions.

At reviewed V1 HEAD `8fb0f7677ba31e267a1487932a4a24d83eb0d4bb`, `src/world/clouds.ts` displays up to 28 independently culled transparent `Sprite` billboards over a finite player-following X/Z area, with four asynchronously loaded PNGs. Weather changes the visible fraction immediately, but light/dense morphology only changes when sprites recycle. The finite field, billboarding and recycling limit continuity across heading, height, horizon and transitions. Each visible sprite is a separate scene submission (not an observed renderer count); material alpha overdraw remains. V1's built-in Three Sky cloud branch is deliberately set to zero after documented horizon artifacts and excessive sun brightness.

At donor V3 HEAD `199f98e215418999fc589891163afd321df7803f`, `SkyDome` samples deterministic tiled two-channel noise on a virtual upper-sky plane. It fades clouds towards the horizon, scrolls the field, eases weather cover and composites clouds within its sky fragment shader rather than adding billboards. The algorithm can address directional continuity and renderer-object count **without importing V3's distinct sky, fog, lights, tone mapping or weather state**. Visual parity and a performance gain remain unverified until browser/GPU checks.

## Goal and expected result

Deliver one cloud layer inside V1's existing `THREE.Sky` material, with V3-inspired noise, projection, drift and cover easing; retire the sprite renderer. V1 continues to own all climate, daylight, scene fog, lighting, precipitation, quality controls and rendering passes. Cloud coverage remains reactive to all V1 weather types and cloud tint follows V1's existing day/night logic.

This is a *technique port*, not an atmospheric redesign or exact pixel match of the old PNG silhouettes.

## Architecture — decided

1. **Single draw boundary:** `createSky()` (`src/world/createSky.ts`) remains the single creator and owner of `WorldSky.mesh`/material. Integrate a cloud fragment block into the current `Sky.material.fragmentShader` **before** its existing `gl_FragColor = vec4( texColor, 1.0 );` assignment. Reuse the material's own `direction = normalize(vWorldPosition - cameraPosition)` and `texColor`; keep its native `<tonemapping_fragment>` and `<colorspace_fragment>`. Do not create another mesh, material, render pass or V3 `SkyDome`. The built-in `cloudCoverage` remains `0`.
2. **Cloud-specific ownership:** `src/world/clouds.ts` retains `cloudAppearanceFor` as V1's weather/elevation-to-colour/coverage contract. Replace the sprite pool with an attached cloud shader controller (shader fragment, uniforms, deterministic noise texture, easing/drift, texture disposal). `WorldSky` exposes one `updateClouds(dt, weather, elev)` method, delegates to that controller and owns final cleanup. `createSky.ts` owns material composition; `clouds.ts` owns cloud-specific GPU data but does **not** dispose the Sky material.
3. **Inputs:** use the same `ClimateState.weather` and `skyParamsFromTime(...).elev` as the current game loop, with `isSystemEnabled('weather')` as a zero-alpha debug gate. Preserve `cloudAppearanceFor`'s base `0.15` coverage, weather intensity blending, rain floor `0.72`, storm floor `0.92`, weather RGB tints, opacity `0.8`, and elevation-based dusk/night multiplier. `cloudy`, `rain`, `storm`, `snow` and `fog` remain distinct. No V3 `AtmosphereParams` or V3 weather presets are introduced.
4. **Coverage semantics:** apply V1's `0..1` visual coverage **directly as a cloud-noise threshold control** (`edge = 1.0 - coverage`), NOT V3's `0.32 + 0.68 * cloudCover` floor, which would make the V1 clear baseline unnecessarily dense. The mask uses V3's dual-noise mixing, softened edges and `smoothstep(0.0, 0.12, direction.y)` horizon fade. This is a deliberate remap of semantics, not a claim that coverage means identical pixel fractions in both representations.
5. **Colour/rendering:** feed `uCloudTint` via `THREE.Color.setHex(appearance.tint)` (linear GPU value from existing sRGB hex), and alpha via `appearance.opacity`. Mix the cloud RGB with the existing V1 linear `texColor` before V1 Sky's tone-mapping/output chunks. Never copy V3's `toneMapped: false`, `#include <colorspace_fragment>` a second time, fog=colour horizon coupling, sun disc, gradients or sun-intensity mapping. Current sky/fog/lightning routines and `renderer.toneMappingExposure` stay unchanged.
6. **Timing:** the existing V1 frame `dt` (capped at 0.05 s) drives V3's first-cover-immediate, later `min(1, dt/3)` easing and noise drift `(0.0026, 0.0012) * (1 + shownCover * 0.5) * dt`. This is *render time*, not world time or time-skip-scaled `worldDt`. No new clock or wind system.
7. **Resources/lifecycle:** generate one deterministic 256×256 `RGBA` `DataTexture` with repeat wrapping, linear magnification, mipmapped linear minification and `NoColorSpace` data interpretation; no PNG fetches or asynchronous continuations. Only the cloud controller disposes that texture, exactly once, on `WorldSky.dispose()`; `WorldSky` continues to dispose its owned Sky material/geometry. A `WorldBundle` rebuild does not recreate sky/cloud resources; app teardown does.
8. **Retirement:** delete `createClouds()` sprite creation, `CloudSystem` dependencies and separate scene add/update/dispose in `createApp.ts` and `gameLoop.ts` in the same implementation stage that activates the Sky shader. Keep old PNG assets on disk (unused, reversible). Do not re-enable Three's built-in cloud branch. No duplicate active layer or second atmospheric shader.
9. **Season:** V1's former slight seasonal *light/dense sprite-family* bias has no exact equivalent in a continuous noise field and is deliberately retired; seasonal weather distribution, precipitation, daylight and snow remain V1-owned. Do not invent a new seasonal cloud simulation. This silhouette trade-off is a named visual acceptance item.

The exact implementation seams, anchor checks, donor algorithms and ownership map are specified in [implementation notes](./implementation-notes/world-terrain-054-v3-cloud-adaptation-implementation-notes.md). The shader patch must refuse a missing/duplicated r185 source anchor rather than silently drawing two different cloud systems.

## Scope / non-goals

**Included:** one embedded cloud field, V1 mapping, easing/drift, shader and resource lifecycle, removal of old active sprites, targeted tests, browser visual checks and limited performance observations.

**Excluded:** V3 sky/fog/lighting/replacement atmosphere, weather simulation changes, fog or draw-distance retuning, new cloud shadows/volumetrics/physical clouds, wind system, moon/stars, new reflection/AO/bloom passes, quality-profile policy, changes to saves or persistence, terrain/worldgen and unrelated cleanup. Existing ground-fog cards, rain/snow particles, lightning, water mirror and terrain visual horizon are unchanged.

## Implementation stages

### Stage 1 — One V1 Sky with V3-derived clouds (implementation + automated verification)

- **Scope/files:** `src/world/clouds.ts`; `src/world/createSky.ts`; `src/app/gameLoop.ts`; `src/app/createApp.ts`; update `src/world/clouds.test.ts` and add `src/world/createSky.test.ts` (or a narrowly named cloud-shader test alongside it).
- **Prerequisites:** current V1 Three `0.185.1` lockfile/shader anchors still match. No dependency on unrelated planned graphics tasks.
- **Behavior:** V1 Sky remains the only sky mesh; covered weather states have animated noise clouds; clear/fog stay sparse; rain/storm floors hold; tint reacts to elevation immediately while coverage eases after initial presentation; weather-debug off hides clouds without hiding sky. No separate cloud sprites are created. App teardown frees the cloud texture once, while same-app world rebuild retains it.
- **Technical acceptance:** deterministic two-channel noise tests; V1 appearance profile tests retained; cover-first/ease/drift/dt-clamp tests; source-anchor uniqueness/material-uniform assertion; texture lifetime/dispose spy and single-active-cloud-path checks; focused `vitest`, typecheck, lint and build. Tests must not require a WebGL context. Shader GPU compilation remains explicitly **unverified** by unit tests.
- **Risks:** built-in Sky shader string changes, linear/sRGB mismatch, transparent/tonemapping double processing, accidental duplicated cloud branch, dispose ordering and new first-use program hitch.
- **Completion:** code produces one cloud-composited Sky program, old renderer references are absent, and targeted automation passes (or unrelated pre-existing failures are documented with targeted passing evidence). No claim of browser look PASS yet.

### Stage 2 — Browser/GPU acceptance and bounded cloud-only tuning

- **Scope/files:** validation of the Stage 1 scene. If needed, tune only cloud mask edge, noise scales, horizon fade, cloud alpha/brightness in `src/world/clouds.ts` and focused tests; no modifications to fog, Sky daylight parameters, render pipeline or draw distance.
- **Prerequisite:** Stage 1 technical completion and shader compilation on an actual browser/GPU.
- **Visual matrix:** force `clear`, `cloudy`, `rain`, `storm`, `snow` and `fog` at low/high relevant intensities; change weather while watching transitions (no instant full-deck pop); inspect noon, midnight, sunrise and sunset (day/night tint not glowing white); look upward, toward all horizons and rotate/move camera and use an elevated viewpoint (no rectangular projection artifacts, frozen screen-space pattern, seams or horizon edge); verify far terrain/fog blend, rain/snow/lightning, water reflections, bloom/god rays and debug weather off/on. Compare *against V1 atmospheric intent*, not as an A/B cloud-selection experiment. Explicit author review of the new cloud silhouette and seasonal-family loss is required for final visual approval.
- **Technical/performance:** no duplicate cloud mesh/sprites in the scene; inspect browser console for shader compile/runtime errors; verify boot, one same-app `rebuildWorld`, teardown and context loss/restore. Use the existing per-frame `renderer.info` / `?programCensus=1` / `?perf=1` / GPU isolation tools on a consistent scene and display profile if available. Report draw-call and frame/GPU times with workload/revision, not an invented FPS gain. Mirror may render the Sky again as part of its *existing* pass; this is not a new pass.
- **Risks:** solar disc/cloud interaction and bloom, apparent density vs PNGs, horizon fade against fog, repetitive noise, quality/DPR pixel cost and GPU-only shader failures.
- **Completion:** browser/GPU observations recorded separately from automation, regressions absent or explicitly documented; author accepts the look for status `done`. If browser/author checks cannot be run, report `verification needed`, never a visual PASS.

## Acceptance and verification gates

| Gate | Evidence / expected invariant | Owner |
| --- | --- | --- |
| Weather | All six `WeatherType` cases retain V1 profile mapping; rain/storm minimum coverage; snow lighter tint than rain; fog sparse | Unit + browser |
| Timing | Initial cover correct; later cover eases; stable drift on 0.05s V1 dt; freeze/unfreeze and skip do not alter authoritative weather | Unit + browser |
| Atmosphere | V1 Preetham sky, weather turbidity/rayleigh, lights, scene fog cap, ACES/output pass and sun direction unchanged | Code review + browser |
| GPU/render | One Sky cloud layer; no new scene draw, shadow, mirror or composer pass; compile succeeds in real browser | Source inspection + GPU |
| Ownership | One noise texture per app; sky and texture dispose exactly once; no PNG late-load continuation; rebuild keeps existing resources | Unit + browser |
| Persistence | No changes to `src/world/weather.ts`, simulation clock or save schemas; no new persisted fields | Diff + existing tests |
| Performance | Collect comparable CPU/GPU/draw figures where practical; accept no unmeasured speedup claim; investigate material regression | Browser measurements |
| Visual | Author checks silhouette/season trade-off, dusk/night/cloud colour, camera/horizon continuity and weather transitions | Author |

Targeted implementation commands from the repository root (follow failures to their actual source, especially any pre-existing typecheck failures):

```sh
pnpm exec vitest run src/world/clouds.test.ts src/world/createSky.test.ts src/world/weatherVisuals.test.ts src/world/dayNight.test.ts src/world/waterMirror.test.ts
pnpm exec eslint src/world/clouds.ts src/world/createSky.ts src/app/gameLoop.ts src/app/createApp.ts src/world/clouds.test.ts src/world/createSky.test.ts
pnpm type-check
pnpm build
```

Browser checks are **not** implied by these commands. Do not add a broad soak-test campaign.

## Implementation and review handoff

- Run `pnpm claude:preflight world-terrain-054`; inspect the pinned source seams in implementation notes and current HEAD before editing.
- Add concise JSDoc with `@domain world-terrain` to any new public/architectural cloud attachment or Sky update API to aid preflight.
- Keep implementation stages coherent and preserve concurrent edits; any shader-anchor/library mismatch is a stop condition described in the notes.
- No unresolved major architecture decisions are delegated to Cursor. Only bounded visual tuning and author taste remain after technical delivery. **Cursor readiness: READY** (planning status `planned`).
