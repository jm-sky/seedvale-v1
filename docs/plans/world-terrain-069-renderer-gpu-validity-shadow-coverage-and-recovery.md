# Plan: Renderer GPU validity — elevated shadow coverage, pass disposal, capability and context-restore contracts

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `rendering` `shadows` `gpu` `lifecycle` `v1-revival` `review-041`
**Roadmap:** -

## Goal

Correct the renderer validity defects of [review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md) (classes **A3** and the renderer part of **A2**, plus the bounded F16-10 guardrail) inside the existing render owners, without changing visual defaults beyond restoring intended shadows.

| Stage | Findings | Owner (verified 2026-11-06 at `917f1491`) | Queue |
| --- | --- | --- | --- |
| **R1** elevation-aware shadow follow | F16-01 (R1) | `src/world/createLights.ts` (`followTarget.set(x, 0, z)` ~L108), caller in `src/app/gameLoop.ts` | Q177 |
| **R2** N8AO disposal + DPR-only resize | F16-03 (R3), F16-10 (R10) | `src/render/createPostProcessing.ts` (`dispose` ~L271, `aoPass.dispose()` inherits N8AO 2.0.1 no-op), `src/app/appRenderLoop.ts` viewport handler | Q178 |
| **R3a** context-restore content invalidation | F16-04 (R4) | `src/app/appRenderLoop.ts` (`webglcontextrestored` ~L146), `src/app/gameLoop.ts` shadow/mirror readiness, `src/world/waterMirror.ts` | Q179 |
| **R3b** float capability / fallback contract | F16-02 (R2) | `src/world/createWater.ts` (`RedFormat`/`FloatType` DataTexture ~L30, filtered), floating targets in `createPostProcessing.ts` | Q180 — **decision needed** |

## Direction per stage

- **R1:** follow Y from the existing player/ground height the loop already knows (no new terrain query), keep texel snapping and the `world-terrain-055` S1 tight/legacy frustum modes (`?shadowFrustum`, default tight, Arc A/B pending §4 — do not change its fitting, only the vertical anchor). Do **not** start with cascades or larger maps.
- **R2:** release N8AO pass-owned render targets/materials explicitly in the post-processing adapter for the installed version (record `n8ao` resolved version in the code comment/test; no `node_modules` patch). DPR: listen for resolution change (`matchMedia('(resolution: …dppx)')`) and re-run the existing resize path only when the effective pixel ratio changes.
- **R3a:** on restore, mark shadow map and mirror content invalid so the first frames re-render them before sampling (reuse existing `shadowMapMissing` / mirror cadence gates — no new scheduler).
- **R3b:** O recon only until the author picks the policy (queue §3 Q180-a): one explicit capability selection at renderer creation (`EXT_color_buffer_float`, `OES_texture_float_linear`, framebuffer completeness), then either a clear unsupported message or a visually validated fallback.

## Non-goals

Mirror relevance (F16-05 → [world-terrain-056](./world-terrain-056-render-pass-frame-distribution-and-map-quality.md) S2 / queue Q54), reflection HDR format (F16-07 → open D8), point-light policy (F16-08), fog cards/SMAA order (F16-11) — see the review 041 program in the [master roadmap](../research/v1-revival/2026-10-27--master-revival-roadmap.md#rendering--performance-audit-041--program-2026-11-06).

## Verification

- **R1:** unit projection test: receivers/casters at 0, 60 and 80 m above lowland inside the shadow volume across several sun angles and both `shadowFrustum` modes; snapping unchanged. Browser on `?seed=415424794` lowland vs ridge/summit, screenshots (record URL/flags) → §2 author look (no new swimming/cut-off).
- **R2:** disposal spy test (N8AO targets disposed once on teardown; repeated mount/unmount); DPR-only change observed (renderer + composer size) in browser or via test of the resize decision.
- **R3a:** `WEBGL_lose_context` lose/restore while moving, paused, over water and after resize: first restored shadow/mirror frame valid, no GL errors (agent browser check, record how).
- **R3b:** capability log on reference hardware recorded; chosen path tested with forced-missing extension where possible.
- Common: type-check, targeted vitest, lint; JSDoc on changed render-owner functions.

## Stop if

- R1 needs a larger shadow frustum or map size (visual/perf trade-off) → §3.
- R3b: any fallback that changes water/post appearance → author (already §3 Q180-a).
- A fix moves work into a new frame-scheduler or blocking GPU readback.

## Implementation status

- **R1 (Q177, Sonnet 2026-11-07) — implemented, technically verified.** `WorldLights.follow(x, z, y = 0)` anchors the shadow frustum centre at the player's height, quantized to `SHADOW_FOLLOW_Y_STEP` = 8 m (jumps never move it); texel snapping and the `legacy`/`tight` frustum fitting are unchanged; `gameLoop.ts` passes `player.mesh.position.y` (no new terrain query). Tests in `createLights.test.ts`: receivers and 30 m casters inside the shadow volume at 0/60/80 m × four sun directions × both modes, a negative control (without `y` an 80 m-high caster falls outside), world-fixed texel grid at height. Not browser-checked (queue §2).
- **R2 (Q178, Sonnet 2026-11-07) — implemented, technically verified.** `src/render/n8aoDispose.ts` (`disposeN8aoPass`, field list for `n8ao@2.0.1`, no `node_modules` patch) is called from `createPostProcessing.dispose`; the test builds real `N8AOPass` instances and asserts each owned render target / noise texture / full-screen quad is disposed exactly once over repeated mounts (and that the field list still finds ≥ 8 resources — fails if an upgrade renames them). DPR: `rendererResize.nextPixelRatio` + a `matchMedia('(resolution: …dppx)')` listener in `appRenderLoop.ts` re-run the existing resize path (renderer + composer `setPixelRatio`, forced size apply) only when `min(devicePixelRatio, pixelRatioCap)` changes; cap is passed in as `pixelRatioCap()` from `createApp`. Not browser-checked: dragging the window between monitors / browser zoom (queue §2); GPU memory plateau after teardown not measured.
