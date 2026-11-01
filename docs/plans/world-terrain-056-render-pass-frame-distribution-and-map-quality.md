# Plan: Render-pass frame distribution, visibility budgeting and map quality

**Created:** 2026-11-01
**Status:** `planned` 📋
**Type:** optimization
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `performance` `visual`

## Goal

Analyze and reduce synchronized frame-cost spikes from expensive and moderately expensive rendering work. In ordinary gameplay, shadow/reflection and other genuinely deferrable heavy passes should **usually not execute every frame**, while retaining visually convincing quality. Spread their actual render costs across different frames, reduce unnecessary work for off-camera content, and address visibly pixelated low-resolution render maps.

**Important qualification:** “never every frame” is the optimization target for *deferrable* passes, not an unconditional invariant. A required first render, camera teleport, visible invalidation, rapidly changing scene, or correctness/safety event may require consecutive updates. Never skip the main beauty pass, authoritative world simulation, collision, inputs, or a correctness-critical update just to satisfy cadence.

## Verified recon (2026-11-01; current main, static inspection only)

- `src/app/appRenderLoop.ts` drives one `GameLoop.tick()` via `requestAnimationFrame`; `src/app/gameLoop.ts` owns ordering: water mirrors, sun shadow update decision, post-processing/beauty and labels. No cross-pass per-frame allocation policy was identified in these owners.
- `src/render/shadowBudget.ts`: `shouldUpdateShadowMap` tracks stale frames (cap 10), shadow-frustum-centre motion threshold 0.05 m, nearby NPC/fauna. Default-enabled `?shadowActorCadence=1` refreshes every other frame **only when actor motion is the trigger and the centre is stationary**; moving/turning can still cause refresh every frame. `gameLoop.ts` sets `renderer.shadowMap.needsUpdate`, with `autoUpdate = false`. `world-terrain-055` already owns the frustum and actor cadence trims; do not redo them.
- `src/world/waterMirror.ts`: `WATER_MIRROR_SIZE = 128` texture; `MIRROR_MAX_HZ = 30`; `shouldRenderMirror` uses elapsed wall time and `renderedLastCall` to avoid back-to-back over-budget updates. This is independent of the shadow budget and can overlap with a shadow refresh. `gameLoop.ts` can render ocean and river mirrors; check their actual lifecycle/activation and whether both can render in one frame.
- `src/world/createLights.ts`: configurable sun shadow map nominally 512/1024, default 1024; current implementation clamps 2048 to 1024. Tight frustum (half extent 56 instead of 80) improves world-space texel density without larger texture. `src/config/worldConfig.ts` default shadow size 1024; stored quality clamps 2048. Thus **512 is a possible shadow-quality setting, not proof that the observed pixels come from it**.
- `src/render/createPostProcessing.ts`: composer/N8AO/bloom/SMAA/god rays; inspect per-pass costs and temporal dependencies before proposing cadence. Do not blindly freeze depth-dependent AO, anti-aliasing or camera-related effects.
- `src/fauna/animalUpdateCadence.ts` implements deterministic per-animal cadence phase from stable identity, avoiding collective periodic flushes; `AnimalAgent` retains behavior/presentation time accumulators. Reuse this principle where appropriate, **not** simulation timing or actor state ownership.
- `src/world/pointLightBudget.ts` provides per-frame bounded registered-light culling; it is not a scheduled heavy render pass. A budgeted every-frame operation may be cheaper than any time-slicing.
- Existing pass/benchmark instrumentation includes `getPassSubmissionCollector` and GPU timer in `gameLoop.ts`, WSL Q50/Q51 A/B results, `docs/performance/2026-10-27--arc-baseline-runbook.md`. Q51: shadow refresh ~half the frames at static camera, but no proof of low frame-to-frame variance under movement. No runtime profiling or visual inspection performed for this plan.

### Key unresolved evidence

An on-screen pixelation/aliasing artifact may originate from sun shadow 512/1024, the **128×128** water reflection target, AO/other render targets, resolution scaling, shadow bias or sampling. Identify the specific artifact and underlying map before increasing any resolution. Higher map resolution increases memory/fill and potentially GPU work; raising it universally conflicts with this plan's performance target.

## Stages (small, independently verifiable)

### A — Frame-cost and texture audit (no quality/cadence behavior changes)

1. Inventory actual **expensive and medium-cost** work per frame across render/scene update boundaries, including shadow, each reflection, AO, other post effects, scene-matrix/animation prep and periodic CPU jobs. Classify: GPU/CPU cost; current triggers, frequency, timing base (frame vs wall/simulation clock), visibility checks, forced updates, state dependencies, correctness-critical vs deferrable. Do not infer significance from update frequency alone.
2. Reuse existing instrumentation where possible; capture per-frame pass execution boolean, CPU wall time, GPU elapsed where reliable, draw calls, overlap/co-occurrence, adjacent-frame variance, p50/p95/p99 and hitches. Confirm actual GPU timer boundaries before attributing per-pass cost; instrument missing pass-level spans only if necessary, with bounded diagnostic overhead.
3. Compare static camera, walking, rotation, riverbank/ocean, dense settlement, low sun, visibility transitions and streaming. Identify whether shadow+mirror or other update phases repeatedly align and quantify cost.
4. Audit all render-target allocations, quality presets, sizes, sampling and image-space artifacts; distinguish shadow maps, reflection textures and screen-space buffers. Collect screenshots/side-by-side evidence for suspect 512 and 128 maps. Record evidence and selection in `docs/performance/results/`.

**Gate:** no broad scheduler and no resolution change without cost attribution and visual cause.

### B — Temporal distribution of costly deferrable passes

1. Trial a **minimal per-pass phase/priority coordinator** at the render-loop integration boundary only if A shows meaningful coincident work. Keep `shadowBudget` and `waterMirror` as decision owners; coordinator arbitrates optional, already-due refreshes, never becomes another render loop or a second source of scene authority.
2. Prefer deterministic phase staggering (stable pass keys and fixed relative offsets) to random timing; track last successful execution, missed/deferred deadlines, max-staleness bounds, invalidation and starvation prevention. Consider a simple shadow/reflection conflict rule first; don't install generic scheduling infrastructure without evidence.
3. Trial more aggressive, **time-based plus frame-aware** shadow cadence under player/camera movement and reflection cadence at low FPS, instead of letting a 30 Hz cap silently become every frame. Test conservative staleness ceilings, responsive invalidation, temporal jitter, rapid turning and player/actor motion. Consider separate static vs dynamic update needs only after establishing safe architecture; do not assume Three.js supports independent cached shadow layers without additional passes/material integration.
4. Prevent simultaneous expensive refreshes in ordinary frames when possible, but allow necessary same-frame updates for first render/teleport/high-priority visual invalidation. Do not sacrifice safety or deterministic sim.
5. Every candidate behind a reversible flag or isolated revertable commit; A/B each independently, then combined interaction. Reject any case that trades average FPS gain for worse p95/p99, stutter or noticeable reflection/shadow lag.

### C — Visibility and distance-aware budgets

1. Review current mirror view tests, shadow caster/camera layer filters, actor shadow distance and frustum fit. Use **render-camera visibility** and relevance to suppress genuinely invisible work, not player distance alone. Test reflections visible within water surfaces and reflected camera, and shadow casters outside view that project shadows into view.
2. Never make authoritative NPC/fauna/world simulation dependent on camera visibility. Maintain entity IDs, lifecycle and offscreen continuity. Separate presentation LOD from simulation.
3. Avoid scene-wide traversals, expensive visibility queries and per-frame allocations whose cost exceeds skipped work. Compare CPU culling overhead and GPU savings.

### D — Map resolution and filtering quality

1. For each visibly defective map, record actual effective resolution and a reproducible screenshot. Profile shadow 512 vs 1024 at existing tight frustum, and 1024 vs an **experimental** higher option only if artifacts persist; evaluate bias, filtering, normal bias, texel snapping and camera fit before raising size. Do not turn on 2048 globally by default.
2. Separately compare water mirror 128 vs candidate 256/other sizes, including movement, still water and low-angle views. Check `waterMaterial.ts` sampling and aliasing; do not equate mirror resolution with shadow quality.
3. Choose quality-adaptive settings/tiers only with demonstrated visual win and acceptable GPU cost; ensure settings persistence, live resizing/disposal, benchmark reproducibility and fallback for low-end devices. Keep effect-specific tests independent.

## Verification and exit criteria

- Document a per-system cadence/cost/visibility inventory; explicitly list any expensive operation that still must run every frame and **why**. “Never per frame” must not conceal unavoidable main-render or correctness work.
- Per-frame trace shows fewer coincident expensive passes and lower frame-time variance/p95/p99 (not only better average FPS) on representative movement + stationary fixtures; compare same-platform matched A/B. Report pass frequency, overlap, skipped/deferred count, staleness/max gap, calls/triangles, CPU/GPU timing and visual outcomes.
- Windows native Arc is final performance confirmation; WSL measurements remain WSL-only evidence. Follow `docs/performance/2026-10-27--arc-baseline-runbook.md` and Revival benchmark policy. Do not claim runtime/visual/perf validation from static recon.
- Inspect moving/rotating/teleporting camera, near/far casters, day/night + low sun, river/ocean, weather, streaming and pause/resume. No missing shadows, obvious pixelation, stale reflection, update starvation, flicker or broken state restore.
- Tests for coordinator arbitration, max-staleness, first render, forced invalidation, visibility boundaries, timing under 20–60+ FPS and determinism. Include performance instrumentation tests if modified. Typecheck, targeted tests, lint/build.
- Important changed/public functions/classes receive discoverable JSDoc, with `@domain world-terrain` where appropriate. Record keep/revert decisions per slice and implementation notes with verified ownership.

## Constraints / non-goals

- V1 implementation only; V2/V3 optional reference, no wholesale transfer.
- Preserve autonomous/deterministic simulation, save/load, actor and chunk lifecycle and presentation fidelity.
- No blanket “update every N frames” rule for all systems or arbitrary disablement of essential postprocessing/animations.
- No unconditional new global scheduler, full simulation refactor, default 2048 shadow setting or unconditional LOD content deletion.
- Respect existing world-terrain-055, legacy plan 145, current reflection policy and still-open Revival D8/D13 decisions (reflection content/detail is not silently approved by this plan). Changes in *which* NPCs/objects appear in reflections require separate author approval.
- A–D are a scoped investigation and candidate experiments; **not an authorization to ship visual compromises** without visual evidence and author acceptance.

## References

- [world-terrain-055 existing trims](./world-terrain-055-optional-shadow-frustum-and-refresh-trims.md)
- [Performance overview](../performance/README.md)
- [Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)
- [Revival performance tracker](../research/v1-revival/2026-10-27--performance-three-track-roadmap.md)
- [WSL Q51 result](../performance/results/2026-11-01--wsl-q51-shadow-actor-cadence-ab.md)
