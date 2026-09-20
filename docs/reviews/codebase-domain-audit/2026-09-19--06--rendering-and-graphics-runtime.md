# Codebase domain audit 06 — Rendering & graphics runtime

**Reviewed:** 2026-09-20  
**Area:** Rendering & graphics runtime  
**Source of truth:** current `main` code  
**Master:** `tools-018-codebase-domain-and-flow-audit-master.md`

## Scope

This review traced the production graphics path from renderer creation through scene submission, streaming/rebuild and teardown.

In scope:

- renderer / scene / camera composition;
- terrain, vegetation, settlement, NPC and fauna presentation ownership;
- materials, textures, geometries and render-target lifetime;
- shadows and planar water reflection;
- visibility and LOD;
- per-frame render-support work;
- resize / DPR / post-processing target lifecycle;
- stream-in / stream-out and WorldBundle rebuild;
- CSS2D only where it affects lifecycle or render cost.

The review intentionally excludes subjective visual quality and missing effects.

## Entry points and state owners

### App-lifetime presentation

`src/app/renderStack.ts::createRenderStack` constructs the presentation objects that survive a `WorldBundle` rebuild:

- `WebGLRenderer` from `src/render/createRenderer.ts`;
- one `CSS2DRenderer`;
- the shared `Scene`;
- the player camera;
- the `EffectComposer` chain from `src/render/createPostProcessing.ts`;
- world lights / sky;
- the scene-level point-light budget;
- debug/benchmark-only program/GPU diagnostics.

`createApp.ts` owns final teardown ordering. It stops the render loop, disposes world/runtime owners, then disposes post-processing/lights/renderer and removes both WebGL and CSS2D DOM elements.

### Rebuild-lifetime world presentation

`src/app/worldBundle.ts` owns world systems whose render projections are rebuilt with the world:

- `ChunkManager` — terrain, chunk water, grass, vegetation/environment batches and chunk items;
- `SettlementsManager` — settlement buildings/props/NPC presentation;
- fauna and world-item systems;
- `WorldOcean`, which owns the shared `WaterMirror`.

`disposeWorldBundle()` tears these systems down before the replacement bundle is installed.

### Shared asset lifetime

`src/assets/loadGltf.ts` owns one cached GLTF root per URL for the app lifetime.

Cached geometries/materials are marked `userData.sharedGpu = true`; clones share those GPU resources. `disposeObject3D()` therefore:

- does not dispose cache-owned shared geometry/material;
- disposes non-shared geometry/material;
- always calls `InstancedMesh.dispose()` for its instance buffer.

Call sites that clone mutable materials, such as tinting/outfit material overrides, explicitly clear the shared flag so the clone can be freed independently.

## Flows traced

### Renderer → frame submission

```text
createRenderStack()
→ createRenderer()
→ create Scene / camera / CSS2DRenderer
→ createPostProcessing()
→ create lights / sky
→ appRenderLoop requestAnimationFrame
→ gameLoop.tick()
→ shadow budget decision
→ ocean.renderMirror()
→ postProcessing.render()
→ labelRenderer.render(scene, camera)
```

The renderer uses capped DPR, ACES tone mapping and explicit `renderer.info` reset ownership. The composer owns its internal targets and each added pass is explicitly disposed.

### Resize / DPR

```text
window / visualViewport / orientation event
→ appRenderLoop.requestResize()
→ applyViewportSize()
→ camera projection update
→ renderer.setSize()
→ CSS2DRenderer.setSize()
→ postProcessing.setSize()
```

Live render-scale changes go through `src/app/graphicsSettings.ts`, which applies the same pixel ratio to the renderer and composer. Context restore forces a size re-application so composer targets are recreated consistently.

### Water reflection

```text
gameLoop.tick()
→ bundle.ocean.renderMirror(renderer, scene, camera)
→ WorldOcean
→ WaterMirror.render()
→ cadence gate
→ mirrored camera / oblique clip plane
→ shared 128² WebGLRenderTarget
→ renderer.render(scene, mirrorCamera)
→ restore renderer target / XR / shadow-auto-update
```

The mirror camera renders layer 0 only. Water, agents and selected reflection-expensive content are excluded by existing render-layer policy.

### Shadows

```text
gameLoop.tick()
→ shadow budget
→ renderer.shadowMap.needsUpdate only when wanted
→ beauty/post-processing scene render
```

Current code no longer unconditionally refreshes the shadow map every frame. Content-side shadow budgeting is already implemented by `world-terrain-038`.

### Stream / rebuild / dispose

```text
chunk/settlement/fauna attach
→ scene ownership by subsystem
→ stream-out / subsystem dispose
→ remove node from parent
→ dispose owned GPU resources
→ rebuildWorldBundle()
→ dispose old WorldBundle projections
→ build fresh projections
→ Object.assign(bundle, fresh)
```

The app-level renderer/scene/camera/composer survive the rebuild; world-owned projections do not.

## Findings

### F06-1 — Water mirror has cadence budgeting but no visibility/relevance gate

**Severity:** medium  
**Expected ROI:** high in frames/locations with no visible reflective water; aggregate ROI requires measurement  
**Implementation risk:** medium  
**Benchmark/diagnostic evidence already exists:** yes for mirror cost, not yet for the specific no-visible-water case  
**Safe to fix without additional profiling:** no — use the existing measurement gate in `world-terrain-015`

**Exact flow**

```text
gameLoop.tick()
→ bundle.ocean.renderMirror(renderer, scene, camera)
→ WaterMirror.render()
→ enabled/disposed check
→ cadence check
→ camera-above-water check
→ renderer.render(scene, mirrorCamera)
```

**Files / symbols**

- `src/app/gameLoop.ts` — unconditional call to `bundle.ocean.renderMirror(...)` in the render path;
- `src/world/createOcean.ts::WorldOcean.renderMirror`;
- `src/world/waterMirror.ts::createWaterMirror().render`;
- `docs/plans/world-terrain-015-water-reflection-content-budget.md`.

**Evidence**

`WaterMirror.render()` early-outs for:

- reflections disabled / disposed;
- cadence budget;
- camera below the water plane;
- a non-perspective camera.

It does **not** test whether any water capable of sampling the mirror is inside the current camera view. Therefore a globally enabled reflection can still trigger a full mirrored scene submission while the beauty camera is looking at terrain/settlement content with no reflective water on screen.

This is not a simulation/correctness issue: the reflection is presentation-only and does not alter world state.

The current heavy-settlement benchmark provides evidence that the mirror pass is materially capable of affecting frame cost: in `2026-09-18--028--benchmark-settlement-heavy.md`, the isolation probe reports roughly `45.0 ms` baseline render wall time versus `29.6 ms` with mirrors disabled. Worst long frames also contain `WATER` spans around 15–16 ms. These are wall-clock isolation figures, not isolated GPU timing, and they do not prove the cost of the *off-screen-water* case specifically.

**Correctness / performance impact**

When reflective water contributes nothing to the frame, the mirror can still perform an extra scene render, including traversal/submission of layer-0 scene content. The cost is avoidable in principle, but the correct cheap relevance predicate must be demonstrated before changing production behavior.

**Lifecycle owner**

- mirror RT/camera: `WorldOcean` / `WaterMirror`, rebuilt with `WorldBundle`;
- main camera/renderer/scene: app-lifetime `RenderStack`.

**Existing plan coverage**

Covered by `world-terrain-015-water-reflection-content-budget.md`. That plan is intentionally measurement-gated and already owns remaining reflection-content/runtime budget. Creating a second mirror optimization plan would duplicate ownership.

**Recommended action**

Extend the existing plan's bounded recon to explicitly measure a cheap **reflection relevance gate**:

- derive relevance from already-owned streamed water/chunk visibility data or a bounded water-surface proxy;
- do not traverse the entire scene to decide whether to avoid traversing/rendering the scene;
- preserve the current render layers, cadence budget and shared RT;
- only implement the gate if a representative no-visible-water case shows meaningful saved `WATER` / `RENDER` time without pop/flicker.

---

### F06-2 — CSS2D still traverses the full scene each rendered frame, but current evidence is insufficient for a production optimization

**Severity:** observation  
**Expected ROI:** unknown; potentially medium only in scene-heavy cases  
**Implementation risk:** medium  
**Benchmark/diagnostic evidence already exists:** historical code review only; no current dedicated timing  
**Safe to fix without additional profiling:** no

**Exact flow**

```text
gameLoop.tick()
→ postProcessing.render()
→ labelRenderer.render(scene, camera)
→ CSS2DRenderer scene traversal
→ CSS2D DOM projection
```

**Files / symbols**

- `src/app/gameLoop.ts` — `labelRenderer.render(scene, camera)`;
- `src/app/renderStack.ts` — one CSS2DRenderer attached for the app lifetime;
- `src/ui/agentStatusLabel.ts` — guarded DOM writes and explicit label disposal;
- historical review `docs/reviews/2026-08-12--005--performance-architecture-and-assets.md`.

**Evidence**

The production frame path still asks `CSS2DRenderer` to render the same large scene graph after the WebGL submission. The old performance review identified the scene traversal shape directly.

However, current code has improved the expensive part that is easiest to prove locally:

- agent label DOM fields are write-if-changed;
- distance/observation state is guarded;
- labels explicitly remove both the `CSS2DObject` and its element on dispose.

The current benchmark does not isolate CSS2D traversal from the rest of `RENDER`, so this audit cannot claim it is presently a significant bottleneck.

**Correctness / performance impact**

No correctness or stale-label defect was confirmed. The remaining concern is a scaling risk: scene-graph size can grow faster than label count, so CSS2D traversal may become disproportionate even when only a small number of labels exist.

**Lifecycle owner**

App-lifetime `CSS2DRenderer`; individual label owners remain the object/system that created the corresponding `CSS2DObject`.

**Existing plan coverage**

No active plan specifically owns CSS2D traversal cost.

**Recommended action**

Do **not** create a plan from this audit. First add a bounded timing/isolation measurement only if render profiling shows unexplained CPU-side render time after the already-planned mirror/postprocess/agent/settlement work. A separate labels-only scene/registry should not be introduced speculatively because it would add transform and lifecycle synchronization responsibilities.

## Architecture observations

### GPU ownership/disposal is coherent in the inspected production paths

No confirmed leak or double-dispose defect was found in the traced ownership boundaries.

Verified current patterns include:

- `createPostProcessing().dispose()` disposes each pass and the composer;
- `WorldOcean.dispose()` disposes the shared `WaterMirror` render target, ocean geometry and material;
- chunk/world subsystem disposal removes scene nodes and frees owned procedural resources;
- `disposeObject3D()` preserves GLTF-cache-owned shared GPU resources while freeing local resources and instance buffers;
- app teardown removes the CSS2D and WebGL DOM elements and disposes renderer-level owners.

The historical Three.js lifecycle audit's core ownership conclusions still match current code.

### Shared GLTF clone semantics are deliberate

`SkeletonUtils.clone()` clones hierarchy/skeleton state while cached geometry/material remain shared. Mutable per-instance materials are explicitly cloned and marked non-shared before mutation. No case was confirmed where one agent/prop disposes a shared material still used by another live clone.

### Agent animation presentation is disposed through its owner

NPC and animal disposal stops their animation controller and their outer runtime owner removes/disposes the mesh. Label controllers also detach their DOM projection. No stale animation/label update was found after normal despawn/unload in the inspected flows.

### Visibility does not own simulation authority

The reviewed render layers, shadow toggles, vegetation LOD and label visibility are presentation mechanisms. No inspected path used camera/frustum/render visibility as authoritative NPC/fauna/world simulation state.

This separation should remain explicit when implementing `world-terrain-041`: presentation LOD must not become simulation cadence.

### Existing LOD/render-budget plans already own the major measured costs

Do not duplicate these mechanisms:

- `world-terrain-038` — completed shadow caster/content budget;
- `world-terrain-039` — N8AO / post-process cost budget;
- `world-terrain-040` — vegetation render budget; Stage 1 implemented, verification pending;
- `world-terrain-041` — agent presentation render LOD;
- `settlements-019` — settlement render submissions, including wells and gardens/crops Stage 1;
- `world-terrain-015` — remaining water reflection budget.

The `2026-09-18--028` settlement-heavy benchmark still supports these owners: settlement, NPC/fauna, shadows, post-processing and mirrors all have meaningful isolation deltas. The benchmark's CPU/GPU separation was unavailable, so its wall-clock deltas must not be over-interpreted as pure GPU timings.

### Resize / DPR / render-target lifecycle is synchronized

Renderer and composer pixel ratio are updated together by `graphicsSettings.ts`. Viewport resize updates camera, WebGL renderer, CSS2D renderer and composer together. Context restore forces a resize/reallocation path. No stale composer-target size defect was found.

### Debug diagnostics are gated

Program census, GPU timing and render-state diagnostics are URL/benchmark/debug gated. The reviewed production path does not perform the diagnostic material census/full-scene debug traversal unless explicitly enabled.

## Cross-domain dependencies / follow-ups

- Area 05 (Water system) should treat reflection as presentation-only and reuse F06-1 / `world-terrain-015` rather than creating another mirror predicate system.
- Area 24 already identified rendering as the dominant sustained measured budget and correctly delegates to the focused rendering plans above.
- Area 01 / `world-033` owns transactional WorldBundle rebuild safety. Rendering-specific resource ownership should remain compatible with that rebuild contract.
- Settlement rendering work should stay inside `settlements-019`; do not add a second settlement LOD/instancing manager from this audit.
- Agent visual LOD should remain separate from NPC/fauna simulation cadence.

## Existing plans that already cover findings / risks

- `world-terrain-015-water-reflection-content-budget.md` — F06-1.
- `world-terrain-038-shadow-caster-content-budget-v2.md` — implemented shadow content budget.
- `world-terrain-039-n8ao-post-process-cost-budget.md`.
- `world-terrain-040-vegetation-render-budget-v2.md`.
- `world-terrain-041-agent-presentation-render-lod.md`.
- `settlements-019-settlement-render-submission-budget.md`.
- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` — shared rebuild transaction boundary; not a graphics-specific optimization.

## New plans required

None.

F06-1 is already owned by `world-terrain-015`. F06-2 is not sufficiently measured to justify an implementation plan.

## Verification limits

- Static source review plus existing benchmark/research artifacts only.
- No browser verification was run.
- No new performance benchmark was run.
- `pnpm docs:sync` was not run.
- Existing benchmark isolation values are treated as directional evidence; GPU timing was not available in the referenced heavy-settlement run.

## Master status update

Area 06 is **reviewed**. No unresolved high/critical finding was confirmed.

Existing follow-up owners: `world-terrain-015`, `world-terrain-039`, `world-terrain-040`, `world-terrain-041`, `settlements-019`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
