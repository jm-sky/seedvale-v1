# Plan: Render-pass frame distribution, visibility budgeting and map quality

**Created:** 2026-11-01
**Status:** `ready` — Sonnet execution slices S0–S5 below (2026-11-02); Stages A–D remain the reference scope, narrowed by the review and author decisions
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

## Execution scope for Sonnet (2026-11-02) — supersedes Stages A–D where they conflict

Written by Opus after the [critical review](../reviews/2026-11-01--world-terrain-056-render-pass-frame-distribution-review.md) (decision: approve Stage A with changes; no scheduler, cadence or resolution change pre-approved) and these **author decisions (2026-11-02)**:

1. **Scope:** Stage A + **two separate candidates behind flags, default OFF**: (a) shadow cadence under player/camera motion, (b) mirror water-relevance gate. Each gets its own WSL A/B. The shadow-vs-mirror arbiter (review ROI #3) and any scheduler are **out of this session**.
2. **Focus scenarios: FPS < 45 → `settlement` / `settlement-heavy`**, static *and* moving. Forest/water/ordinary are secondary guards, not optimisation targets.
3. **Map quality: the observed pixelation is the water reflection** (128² mirror). Author: "worth raising to 1024, or give a choice in Settings". This plan implements the **Settings choice** (sizes 128 / 256 / 512 / 1024); the **default stays 128** until the A/B + screenshots in S5 let the author pick a default (queue §3). Shadow map resolution is **not** touched. **Author confirmed (2026-11-02, in-game observation): pixels are visible only in the water reflection; shadows look fine.**
4. Author's quality preset is unknown → S0 records the effective live RT sizes.

Model: **S** (Sonnet, high effort). Every slice is an independently revertable commit. No `src/` edits while a benchmark runs. Never claim FPS gains; Windows Arc confirmation goes to queue §4, visual checks to queue §2.

### Verified anchors in current code (Opus, 2026-11-02 — re-verify, code is authoritative)

- `src/app/gameLoop.ts` ≈ L3140–3230 (`tick`): order = `syncPointLightBudget` → `passCollector.beginFrame` → `beginFrameSceneMatrices` → **mirror** (`bundle.ocean.renderMirror`, skipped while `lights.sun.shadow.map` is missing) → `shouldUpdateShadowMap(...)` → `needsUpdate` (also forced by `shadowMapMissing`) → `noteShadowRefresh(shadowWanted)` → `recordShadowBudgetFrame(..., shadowWanted)` → god rays → `gpuTimer.beginFrame` → composer/beauty (shadow pass renders *inside* it) + CSS2D → `gpuTimer.endFrame` → `monitor.endFrame({...})`.
  - Bug-shaped hazard: `noteShadowRefresh`/`recordShadowBudgetFrame` receive `shadowWanted`, not `shadowWanted || shadowMapMissing` (the forced first refresh is recorded as skipped).
  - Shadow centre: `shadowCentreX/Z` (L≈840, updated ≈L2837) — forward-shifted under the default tight frustum, so camera yaw moves it.
- `src/render/shadowBudget.ts`: pure `shouldUpdateShadowMap(state, x, z, hasNearbyCaster, halfRateActorOnly)`; state = last centre + `framesSinceUpdate`; eps 0.05 m; cap 10 frames. **Owner of shadow cadence — extend here.**
- `src/world/waterMirror.ts`: `WATER_MIRROR_SIZE = 128` (single shared RT created in `createWaterMirror`, `LinearFilter`, no mipmaps); `shouldRenderMirror` pure; in `render()` the state `renderedLastCall = wanted` / `lastRenderSec = nowSec` is set **before** the camera-below-plane / non-perspective early returns (wanted ≠ drawn). Created once in `src/app/worldBundle.ts` ≈L1351. **Owner of mirror cadence, RT and relevance — extend here.**
- Settings path for render-target knobs: `QualityKnobs` + presets (`src/config/qualityProfiles.ts`), `WorldConfig.postProcessing` (`src/config/worldConfig.ts`, defaults ≈L377, normalisation `applyStoredPostProcessing` ≈L540 — pattern: `SHADOW_MAP_SIZES` set + fallback), live apply in `src/app/graphicsSettings.ts` (`lights.setShadowMapSize`, `ocean.setReflections`), UI in `src/ui-vue/screens/WorldConfigScreen.vue` (≈L281 shadow size select), also `src/ui/createDebugGui.ts`, `src/ui-vue/store.ts`. This is local config persistence, **not** the save file → no `CURRENT_SAVE_VERSION` bump.
- Perf tooling: `src/perf/rawSidecar.ts` (per-frame `RawFrameSample`, schema v1, ≤ 6000 frames), `src/perf/monitor.ts` (`endFrame` inputs incl. `mirrorDrawCalls`), `src/perf/passSubmissionCollector.ts` (`noteShadowRefresh`, counts only), `src/perf/gpuTimer.ts` (brackets beauty only), `src/perf/benchmark.ts` (scenarios; `settlement` is static; `stream` moves the player along +X via `setInterval` from wall clock), `scripts/perf/run-benchmark-series.mjs`, `scripts/perf/summarize-ab.mjs`, flags in `src/perf/flags.ts`.

### S0 — Pass-coincidence trace + moving settlement fixture (no behaviour change)

1. Extend the **raw sidecar** (bump its `schemaVersion` to 2, keep v1 readers working or update `summarize-ab.mjs`) with per-frame: `shadowRefreshed` (actually requested to three, incl. the missing-map force), `shadowReason` (`move` | `actor` | `stale` | `force` | `none`), `mirrorDrawn` (actual draw, not "wanted"), `mirrorDrawCalls`, `framesSinceShadow`, `msSinceShadow`, `shadowCentreDeltaM`. Reuse the monitor → sidecar path; no new collector. Overhead: a few numbers per frame into preallocated/existing arrays; no GPU query readback.
   - To report the reason, make the shadow decision return a reason (e.g. `decideShadowUpdate` returning `{ update, reason }`, with `shouldUpdateShadowMap` kept as a thin wrapper so tests and callers stay valid). Fix the `shadowWanted` vs forced bookkeeping (record what was actually requested). Make `WaterMirror.render` expose whether it **drew** (return boolean or `lastDrawn()`), and move the cadence-state update after the early-outs **only if** that does not change cadence semantics measurably — otherwise record "wanted" and "drawn" separately and leave cadence as is (note it in implementation notes).
2. Add a `settlement-walk` benchmark scenario (in `benchmark.ts` / `benchmarkScenarios.ts`): same anchor as `settlement`; deterministic wall-clock-derived route (walk loop through the plaza at walking speed + a slow yaw sweep and one fast ~90° turn per loop), implemented like the `stream` route (derive from elapsed time, not per-tick steps). Record route constants in the report `context`. Seed `415424794`.
3. Analysis script (extend `summarize-ab.mjs` or a small sibling in `scripts/perf/`): frame classes **neither / shadow-only / mirror-only / both** → share of frames, p50/p95/p99 frameMs and renderMs per class and for the whole run; shadow/mirror refresh interval histogram; max gap.
4. WSL run, current default, `settlement`, `settlement-walk` (n = 3), plus one `water` guard run → `docs/performance/results/2026-11-xx--wsl-056-s0-pass-coincidence.md`. Also record effective live RT sizes (shadow map, mirror RT, AO buffers, DPR) at each preset.

**Done when:** tests for the reason/drawn bookkeeping and the route function; checks green; report committed. **Stop condition (from review):** if `both` frames are rare (< ~10 %) and class tails show no shadow/mirror-driven tail, record that the arbiter is not needed (closes review ROI #3); S1/S2 still proceed on their own merit.

### S1 — Candidate A: shadow cadence under motion (`?shadowMotionCadence=1`, default OFF)

In `shadowBudget.ts` (pure, unit-tested), when the trigger is centre motion (reason `move`): require ≥ 1 skipped frame since the last refresh (alternate) **unless** an escape fires: centre displacement since the **last actual refresh** > `D_HARD` (start 1.5 m), camera yaw change since last refresh > `YAW_HARD` (start 12°, so add last-refresh yaw to state — passed in by the caller, no new owner), elapsed since last refresh > `MS_MAX` (start 66 ms) — milliseconds **and** the existing 10-frame cap — or forced (missing map, teleport = displacement escape, quality resize). Actor-only half-rate (Q51) unchanged. Constants exported and documented; no per-frame allocation.

- Tests: alternation while walking; fast turn / teleport / max-ms escapes at 20, 35, 60 FPS step sizes; stationary behaviour identical to today; flag off = identical decisions to today (table test).
- WSL A/B `settlement-walk`, A default / B `&shadowMotionCadence=1`, A B B A, n = 3 per arm; static `settlement` as a no-change guard. Report shadow refresh share, class p95/p99, render p50. Keep/revert per CLAUDE.md WSL rule; **default stays OFF** — default flip needs author visual acceptance (queue §2: walking, slow/fast yaw, low sun long shadows, NPC shadows; at ~35 FPS alternation ≈ 17 Hz shadow — author judges lag/swimming).

### S2 — Candidate B: mirror water-relevance gate (`?mirrorRelevance=1`, default OFF)

In `waterMirror.ts` (decision owner) + the minimum plumbing from its consumers: skip the mirror draw when **no reflective surface sampling the shared RT** intersects the main camera frustum. Consumers per review: ocean (`createOcean.ts`) and chunk water (`createWater.ts`, shares the texture); the river material (`createRiverWater.ts`) only if it samples the RT — verify. Broad phase only: frustum vs cached per-surface bounding boxes/spheres that already exist (mesh `geometry.boundingSphere`/chunk bounds); **no scene traversal**, no per-frame allocation. Fail-open: unknown bounds, first frames after a chunk load, teleport → draw. When the gate turns from skip to draw, draw immediately that frame (no stale RT shown: the RT is only sampled by surfaces that were invisible).

- Tests: pure relevance function (visible / invisible / boundary / empty / fail-open), cadence state not advanced as "drawn" on a relevance skip.
- WSL A/B `settlement` and `settlement-walk` (A default / B `&mirrorRelevance=1`, n = 3, A B B A) + `water` guard (gain must be ≈ 0 and no regression there). Report skipped-by-relevance share and mirror draw calls. Visual (queue §2): shoreline approach, fast turn towards water, teleport onto a beach — no one-frame stale/black reflection.
- **Not in scope:** changing *what* is reflected (D8/D13 open).

### S3 — Water reflection resolution setting (Settings choice; default unchanged)

1. `WorldConfig.postProcessing.waterReflectionSize` ∈ {128, 256, 512, 1024}, default **128**; normalise unknown values to 128 (mirror `SHADOW_MAP_SIZES` pattern). Add to `QualityKnobs`/presets only if the existing preset/Custom detection requires it — keep all presets at 128 for now (no silent visual change).
2. `WaterMirror.setSize(n)` → `renderTarget.setSize(n, n)` (live, no world rebuild; the RT object and texture uniform stay the same instance — verify the texture identity survives `setSize`, otherwise rebind). Apply in `graphicsSettings.ts` next to `setReflections`. Dispose path unchanged.
3. UI: select in `WorldConfigScreen.vue` next to "Water reflections" (disabled when reflections are off), label with the size; debug GUI entry if the shadow size has one. Polish UI copy follows existing i18n/labels pattern.
4. Optional quality-only check (not a behaviour change, same commit only if trivial): with larger RT, enabling mipmaps or keeping `LinearFilter` — **do not change** filtering/shader here; record observations for S5.

**Done when:** config persistence/normalisation tests (`persistConfig.test.ts`, `worldConfig` tests), live resize test with a stub/mock where the project already does so; type-check/lint/test/build green; browser check that the select changes the RT size (`?seed=415424794`).

### S4 — Reflection size cost (measurement only)

WSL, `settlement` and `water`, sizes 128 / 256 / 512 / 1024 (via config/query; add a `?mirrorSize=` override in `flags.ts` if needed for the runner), n = 3 each, with S2 gate both off and on if S2 was kept. Report FPS, frame/render p50/p95/p99, mirror refresh share. Expectation to verify, not assume: CPU submission unchanged, GPU fill ×4 per step (1024 = 64× the texels of 128).

### S5 — Visual evidence for the author (default decision)

Screenshots at the same spot (reference seed, lake/river shore near a settlement, still water + low angle + daylight + low sun) for 128 / 256 / 512 / 1024 → `docs/performance/results/` (or `docs/reviews/` if visual-only). Note the shader attenuation in `waterMaterial.ts` (reflection ≤ ~18 %, typically ~1–2 %): if 1024 barely differs from 256/512, say so. **Ask the author** (queue §3, Polish, options): default size per preset (e.g. Low 128 / Medium 256 / High 512 or 1024) given S4 numbers. Do not change defaults without the answer.

### Not in this session

Shadow-vs-mirror arbiter / any scheduler (only if S0 shows material overlap → new O task); AO/SMAA/bloom cadence; shadow-map resolution / 2048 clamp; reflection content changes (D8/D13); streaming / shader first-use hitches (other owners).

### Order and gates

S0 → S1 → S2 (S1 and S2 independent; never in one A/B arm) → S3 → S4 → S5. If the session runs short: S0 + S1 are the minimum useful handoff; S3 can be done without S1/S2. Update this plan's status, an `--implementation-notes.md`, `docs/STATE.md` (rendering/water settings), queue rows and `docs/performance/README.md` links as slices land.

## References

- [world-terrain-055 existing trims](./world-terrain-055-optional-shadow-frustum-and-refresh-trims.md)
- [Performance overview](../performance/README.md)
- [Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)
- [Revival performance tracker](../research/v1-revival/2026-10-27--performance-three-track-roadmap.md)
- [WSL Q51 result](../performance/results/2026-11-01--wsl-q51-shadow-actor-cadence-ab.md)
