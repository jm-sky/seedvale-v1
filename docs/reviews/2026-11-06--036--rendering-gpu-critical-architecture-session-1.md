# SeedVale V1 Revival — Rendering & GPU Critical Architecture Review (Session 1)

**Reviewer:** OpenAI Codex (GPT), independent graphics/architecture review.

**Review date:** 2026-11-06.

**Reviewed source:** `jm-sky/seedvale-v1`, local `main`, `ac9717721e3eb68feadf45b5c476e5de18924735` (2026-11-06 13:47:52 +0100).

**Status:** evidence collection complete for bounded Session 1; GPU/runtime verification outstanding; system 16 remains **partial**, not accepted.

**Authorization:** review/documentation only. No application, test, configuration or implementation-plan changes; no dev server, browser run, benchmark or heavy tests.

## Scope and evidence standard

This session follows renderer construction, the main/mirror/shadow/postprocessing path, sizing, output color, rendering-specific teardown/recovery, water formats/materials, shader prewarm and light-count stabilization. Terrain/vegetation/atmosphere are sampled at their rendering contracts, not exhaustively audited.

Excluded: full chunk residency/upload lifecycle, actor/vegetation LOD, comprehensive batching/culling, NPC/fauna scheduling, workers/CPU simulation and non-rendering memory ownership. Findings touching these boundaries are handoffs, not clearance of those systems.

**Confirmed defect** means a contradiction demonstrated by source or a small CPU-only probe. It does not mean an observed screenshot or measured GPU failure. **Compatibility risk** is conditional on capabilities/driver. **Performance hypothesis** requires measurement. Severity reflects consequence within the stated trigger, not an invented prevalence. No Critical finding was established.

## Written review progress

- [x] Read project rules, Revival context/decisions, architecture/graphics guidance and system review register; follow current code over historical claims.
- [x] Trace renderer, composer, mirror, shadow scheduling, resize, configuration and teardown.
- [x] Inspect November 1–6 history and November 6 integer-hash correction, including its tests and author-verification record.
- [x] Cross-check installed Three.js 0.185.1 / N8AO 2.0.1 implementation details and run two small CPU-only probes (no WebGL context).
- [x] Record findings, alternatives, verification requirements and continuation handoff.
- [ ] Native Windows/Arc, WSL and capability-limited GPU verification — intentionally not run in this session.

## Current architecture

`createRenderStack()` constructs app-lifetime renderer, scene, camera, lights, sky, label renderer, composer, point-light budget and diagnostics. `WorldBundle` owns replaceable world projections; the ocean owns the one shared water mirror. `createApp()` owns final teardown. This split is fundamentally reasonable: geometry and water masks consume authoritative terrain/hydrology data; the mirror never defines water identity or simulation state.

Per frame (`gameLoop.ts:3226–3335`), the renderer counters reset, optional shared scene-matrix evaluation runs, shadow refresh is decided, and the ocean's mirror may render **before** the shadow refresh flag is armed. The main composer consumes the shadow refresh. Labels follow. This avoids a routine second shadow render from the mirror. The first mirror is gated on existence of the sun's shadow map. Shadow/mirror cadence is distributed between `shadowBudget`, `waterMirror` and the game loop; it is not a generic scheduler.

| Stage | Current behavior and cost boundary |
|---|---|
| Renderer | WebGL2 via r185; no backbuffer MSAA; high-performance preference; capped DPR; ACES exposure 0.88; PCF shadows; explicit frame counter reset. Preference is not a guarantee of the chosen adapter. |
| Mirror | One 256² default unsigned-byte color target + depth, selectable 128–1024; reflected perspective camera with oblique clip plane; layer 0 only; 30 Hz cap and additional frame/yield gates. No water, actors, fine detail or outer-ring layer. |
| Scene/ AO | Exactly one of `RenderPass` and `N8AOPass` enabled. N8AO renders beauty internally, then depth downsample, AO, denoise/accumulation/composition work. Half-res, depth-aware upsampling; preset quality Performance; transparency-aware path off by default. N8AO temporal `accumulate` defaults false. |
| AA and effects | SMAA (three fullscreen draws) → bloom (half input dimensions, internal mip blur chain) → conditional god rays (32 samples/pixel) → graded OutputPass. AO/bloom/SMAA have internal targets beyond the two composer buffers. |
| Output | Scene/post effects stay linear before ACES/output conversion; grade+dither is folded into the output pass after conversion. AO gamma correction is disabled. No general double-gamma defect demonstrated. |
| Lighting | Ambient + hemisphere + one shadowed directional sun; registered point lights padded toward 16, with protected near-camera overflow. This stabilizes variants but does not guarantee a strict count ceiling. |
| Water | Ocean and sea-level chunk planes sample the shared mirror. Per-level inland lakes deliberately do not; river ribbons use a separate flow shader and no mirror. Water is transparent, depth-tested, depth-write off. |
| Vegetation/atmosphere | Foliage BLEND materials hardened into alpha-test depth-writing cutouts. Weather is procedural GPU particles; local fog uses five large transparent cards; sky/cloud presentation remains separate from weather authority. |

Do not infer GPU cost from the size of the mirror alone: it still submits a world view. Do not infer one draw from one composer pass: N8AO, SMAA and bloom each issue several draws.

## Prioritized findings

| ID | Severity | Classification | Finding | Confidence |
|---|---|---|---|---|
| R1 | High | Confirmed geometric defect | Shadow volume remains centered at world Y=0 despite traversable elevated terrain | High |
| R2 | High, conditional | Compatibility gap | Required float rendering/filtering capabilities have no working fallback | High in code; device impact unverified |
| R3 | Medium | Confirmed ownership defect | N8AO teardown calls an inherited no-op | High |
| R4 | Medium | Recovery risk | Context restoration retains logical validity of lost GPU shadow/mirror content | High in code; runtime symptom unverified |
| R5 | Medium | Performance hypothesis | Mirror still renders when no visible surface needs it | High in code; savings unknown |
| R6 | Medium | Confirmed measurement boundary | GPU query excludes mirror; cannot represent total rendering GPU cost | High |
| R7 | Medium | Color/visual risk | Mirror clips linear HDR to an 8-bit target before water composition | High in mechanism; visual significance unverified |
| R8 | Medium | Architecture/performance risk | Point-light pinning and prewarm leave important variant/cost boundaries | High in mechanisms; workload dependent |
| R9 | Medium | Confirmed settings gap | Preset identity does not include costly reflection resolution/transparency mode | High |
| R10 | Low | Confirmed resize gap | DPR changes are not synchronized by viewport resize | High |
| R11 | Low | Improvement/visual risk | Fog-card overdraw and intersections; SMAA placement needs visual comparison | Medium |

### R1 — Shadow volume ignores world elevation

**Files/symbols:** [`createLights.ts`](../../src/world/createLights.ts) `createLights`, `follow` (lines 60–147); [`gameLoop.ts`](../../src/app/gameLoop.ts) shadow-center/follow block (2895–2906); [`rangeSpines.ts`](../../src/terrain/rangeSpines.ts) `SUMMIT_SOFT_CEILING_M` (176–184).

**Evidence/root cause:** `follow(x,z)` explicitly sets `followTarget.set(x, 0, z)`. Sun/target move in XZ only. The default tight orthographic extent is ±56 m, shifted 24 m ahead horizontally; near/far are 1/200 and sun offset length is about 86 m. Range summits now target 60–80 m (`SUMMIT_SOFT_CEILING_M = 82`). Texel snapping stabilizes a volume around the wrong elevation; increasing map resolution cannot fix its coverage.

A CPU-only probe using installed Three.js `DirectionalLight.shadow.updateMatrices()` and the production minimum sun elevation `y=0.28` projected points directly above the shadow center. At heights 60/70/80 m, shadow NDC Y was **1.02857 / 1.2 / 1.37143**: outside [-1,1]. These are mathematical projection results, not GPU measurements. The 24 m horizontal offset can help or hurt depending on camera/sun orientation; it is not an elevation correction. Near-vertical sun also creates a near-plane constraint for high receivers/casters.

**Consequence:** mountain terrain/actors can lose sun-shadow coverage or show a cutoff while adjacent lower terrain remains shadowed. New relief makes a lowland-centric assumption materially unsafe.

**Minimal correction/alternative:** make the existing light follow target elevation-aware, retaining light-space snapping and bounded caster/receiver coverage. Do not start with cascades or a larger map. Revisit near/far against elevated receivers and tall/offscreen casters. This is a recommendation only.

**Verification:** projection tests across actual sun directions, elevations and forward offsets; then ordinary player traversal at lowland, summit and ridge, dawn/noon/dusk, 512/1024, stationary/moving cadence. Confirm external tree/building shadows and absence of swimming/popping. **Confidence: high** in deficient volume; frequency and visible severity need runtime verification.

### R2 — WebGL2 alone does not satisfy the actual texture/target contract

**Files/symbols:** [`createWater.ts`](../../src/world/createWater.ts) `createDataTexture` (31–40); [`createPostProcessing.ts`](../../src/render/createPostProcessing.ts) construction (79–131); [`appRenderLoop.ts`](../../src/app/appRenderLoop.ts) capability logging (67–79). Dependency evidence: Three `WebGLTextures.setTextureParameters` (666–680), EffectComposer target construction, N8AO `configureHalfResTargets` (273–299).

**Evidence/root cause:** chunk-water masks use `RedFormat + FloatType` (R32F), with linear min/mag filtering. There is no application check/fallback for `OES_texture_float_linear`; installed Three warns but still applies the requested filters. Composer/SMAA/bloom use half-float color targets; N8AO's half-res downsample also uses a float red attachment. Optional float color-renderability is merely logged with `camdebug`; construction and rendering do not negotiate it. Disabling AO does not remove the composer's/SMAA's floating-point requirements, and Low still uses them.

The relevant primary specifications distinguish [float filtering](https://registry.khronos.org/webgl/extensions/OES_texture_float_linear/) and [float color attachment support](https://registry.khronos.org/webgl/extensions/EXT_color_buffer_float/). N8AO's R32F use means half-float support alone is not sufficient for its entire path.

**Consequence:** on otherwise WebGL2-capable devices, incomplete sampling/attachments can break water masks or the full 3D output. This is **not evidence that the reference Arc lacks these extensions**, nor an explanation of its November 6 rectangles.

**Minimal correction/alternative:** define one capability contract during renderer construction and select a supported target/effect path before allocation. For mask filtering, evaluate explicit interpolation with nearest sampling or a precision-validated alternate format. For unavailable float targets, either offer a validated reduced post path or report unsupported capability clearly. Never silently quantize world-height data without shoreline/height-range checks.

**Verification:** capability inventory and framebuffer completeness for the exact attachment combinations; controlled missing-extension cases, Low/High, water shore/lake masks and resize. Test rendering rather than checking extension names alone. **Confidence: high** in missing fallback; affected hardware prevalence unknown.

### R3 — N8AO disposal does not dispose its resources

**Files/symbols:** `createPostProcessing.ts:271–282` `dispose`; `createApp.ts:4038–4042`; installed `n8ao/src/N8AOPass.js`, package `dist/N8AO.js`, Three `Pass.dispose`.

**Evidence/root cause:** the owner correctly calls every pass's `dispose()`, but N8AO 2.0.1's `N8AOPass` has no implementation and inherits Three's empty method. A CPU-only check of the **package export** confirmed `Object.hasOwn(N8AOPass.prototype,'dispose') === false` and `N8AOPass.prototype.dispose === Pass.prototype.dispose`. It owns beauty/depth, internal read/write, accumulation, half-res and optional transparency targets, fullscreen resources and noise texture. Composer disposal only handles composer targets/copy pass; renderer disposal is not recursive disposal of every scene/pass-owned allocation.

**Consequence:** deterministic release at app teardown is missing. Repeated app creation can retain GPU resources until context/object collection. This is not a measured permanent leak or a claim that every world rebuild leaks a composer: the render stack survives world rebuilds.

**Minimal correction/alternative:** establish a version-specific disposal adapter or a verified upstream implementation in the existing postprocessing owner; account for shared geometries/textures to avoid double-disposal. Do not patch `node_modules` as a production solution.

**Verification:** disposal spies against actual package resources and repeated app mount/teardown on GPU, including AO disabled/enabled and transparency mode; inspect allocation/deletion and steady-state memory after collection. **Confidence: high** in no-op; retained bytes/lifetime need measurement.

### R4 — Context recovery does not invalidate rendered-content caches

**Files/symbols:** `appRenderLoop.ts:123–143` context handlers; `gameLoop.ts:3258–3275` shadow existence gate; `waterMirror.ts:218–253` cadence/state; Three `WebGLRenderer.onContextRestore` (1111–1128).

**Evidence/root cause:** restore forces viewport/composer sizing. Three reinitializes GL internals and preserves `shadowMap.autoUpdate`/`needsUpdate`; it does not turn the app's existing `sun.shadow.map` JS reference into proof of valid GPU content. The game loop's missing-map check tests that reference, so it can admit the mirror before a fresh shadow draw. Shadow budget state and mirror timestamps/enabled sampling remain unchanged. Calling `RenderTarget.setSize` at unchanged dimensions is not itself guaranteed to dispose/reallocate; Three lazily recreates GPU resources, but lost contents must be regenerated. N8AO `setSize` does call `firstFrame`, a useful existing safeguard.

**Consequence:** transient invalid/empty shadow or mirror samples and potentially first-frame sampler problems after restoration. The existing bounded shadow cadence limits ordinary staleness, but does not establish a valid first restored frame. The RAF keeps invoking simulation/render dispatch while context is lost; a future fix must preserve the intended simulation clock policy rather than casually freezing world authority.

**Minimal correction/alternative:** explicitly invalidate shadow and mirror *content* on restored context, force main shadow initialization before mirror sampling, and reset relevant diagnostics/cadence. Reuse current owners rather than reconstructing the authoritative world.

**Verification:** `WEBGL_lose_context` while stationary, moving, in water, paused and following resize; log first actual shadow/mirror execution and GL errors. Check GPU query handling after restore. **Confidence: high** in the validity gap; no runtime failure asserted.

### R5 — Mirror has cadence control but no consumer-visibility control

**Files/symbols:** `gameLoop.ts:3264–3277`, [`createOcean.ts`](../../src/world/createOcean.ts) `renderMirror`, `waterMirror.ts` `render`; `createWater.ts` `addPlane`.

**Evidence/root cause:** when enabled and above the sea plane, the mirror is called regardless of visible sea-level water. Its gates check time, yielding, camera type and height, not whether any visible consumer samples the RT. Inland lakes deliberately omit it, rivers do not bind it, yet inland views can still pay the scene pass. Layer exclusions and a small target reduce work but do not remove traversal/submission/vertex cost.

**Consequence:** plausible substantial wasted rendering in dry/inland scenes; frame-time cost cannot be quantified statically. Existing `applyMirrorYield` only shifts work and may still overlap under forced/slow-frame conditions; it does not guarantee one expensive pass per frame.

**Minimal correction/alternative:** conservative relevance from existing visible sea-surface/chunk bounds before mirror submission, with ocean ring/fog and rapid camera changes considered. Do not create a second world visibility database or change reflected content approval decisions D8/D13.

**Verification:** mirror on/off and proposed visibility gating at identical dry, inland lake, sea-edge and ocean poses; counts, actual execution/age, whole GPU span, p95/p99; reject popping during turn/teleport. **Confidence: high** in unconditional submission path, unknown performance benefit. This remains an opportunity, not approval to alter visuals.

### R6 — Existing GPU timer does not include water-mirror work

**Files/symbols:** `gameLoop.ts:3264–3307`, [`gpuTimer.ts`](../../src/perf/gpuTimer.ts) `beginFrame`, `endFrame`, `provenance`.

**Evidence/root cause:** mirror renders before `gpuTimer.beginFrame()`. The query covers postprocessing/shadow/main commands; total CPU `renderMs` starts before mirror, while the categorized `RENDER` timer is narrower. Counts cover the whole frame because `info.autoReset=false` and the game loop resets once. GPU timer extension absence has a sensible explicit no-op path and pending query cap; these are strengths.

**Consequence:** mirror A/B or scheduling can change total GPU cost without the current query directly measuring that pass. Do not label this query as total GPU frame time or subtract it from broad CPU wall time to infer bottlenecks. It can still show indirect contention effects.

**Minimal correction/alternative:** accurately label present spans; for future measurement use a whole-render query or non-overlapping per-pass queries with explicit boundaries and availability/disjoint provenance. Preserve asynchronous polling; no blocking readback.

**Verification:** exported probe/report consumers and raw frame correspondence; check mirror/no-mirror scope and distinguish CPU submission, GPU elapsed and presentation frame time. **Confidence: high**; reporting consumers not comprehensively audited here.

### R7 — Mirror is linear LDR inside a linear HDR pipeline

**Files/symbols:** `waterMirror.ts:193–198` RT construction; `waterMaterial.ts:204–211` sample/blend; renderer ACES configuration; Three render-target output path and default `UnsignedByteType`.

**Evidence/root cause:** the default mirror target is unsigned-byte normalized RGBA, while scene materials rendered to an ordinary target are not ACES-tonemapped. Linear values above one are clipped before the water shader blends them into the HDR main scene. Final ACES cannot restore those highlights. The texture is correctly treated as linear data; this is a dynamic-range mismatch, not evidence of double sRGB conversion.

**Consequence:** bright sky/fire/sun reflections may differ from the main view, lose highlight energy and show low-resolution linear quantization. The shader strongly attenuates reflection, so the practical effect may be small; no visible defect observed here.

**Minimal correction/alternative:** document this as a deliberate LDR approximation or compare a supported half-float mirror. The latter doubles nominal color storage and can increase bandwidth; do not approve it solely for formal HDR consistency. Preserve the single mirror.

**Verification:** same-pose bright sky, sun/fire and night water, native Arc and WSL, with color-range and GPU checks. **Confidence: high** in clipping mechanism; medium in user-visible consequence.

### R8 — Stable light counts and prewarm are useful but bounded

**Files/symbols:** [`pointLightBudget.ts`](../../src/world/pointLightBudget.ts) `sync`/protected overflow; [`programPrewarm.ts`](../../src/render/programPrewarm.ts) `objectProgramFlags`, `cloneForStaging`, `prewarmRenderPrograms`; Three `WebGLPrograms.getParameters`.

**Evidence/root cause:** the 16-light pad trades shader-family churn for a stable forward-light loop. Protected near-camera overflow can exceed the budget, so the count is not universally stable. Prewarm correctly compiles against an offscreen RT and preserves shared materials/geometry, but its representative key only models selected flags. An instanced clone is rebuilt with one matrix and does not copy `instanceColor`; Three keys `instancingColor` separately. This is a conditional coverage gap for any live colored-instanced family passed to staging, not proof that all current vegetation misses prewarm. Compile is not a draw/upload warmup, and does not itself execute shadow/postprocess first-use paths. Timeout bounds waiting on a promise, not synchronous work before that promise yields when parallel compile support is absent.

**Consequence:** residual traversal hitches and extra forward-light ALU remain possible; a successful prewarm result is not a guarantee of hitch-free gameplay. Existing historical reviews already establish why simply removing the pad is unsafe.

**Minimal correction/alternative:** preserve the current mechanism; compare actual production program keys to staged keys before broadening representatives, and record overflow provenance. Any alternative fixed-slot/bucketed light design needs matched cost/visual evidence. Do not hide near lights to satisfy a number.

**Verification:** inspect first-use census after startup on representative routes, colored instancing, point-light overflow and missing `KHR_parallel_shader_compile`; distinguish compile/link vs upload and first draw. **Confidence: high** in code limitations; actual missing families/cost unmeasured. Detailed stream/upload audit is a handoff.

### R9 — “High” is not a reproducible complete rendering configuration

**Files/symbols:** [`qualityProfiles.ts`](../../src/config/qualityProfiles.ts) `QualityKnobs`, `applyQualityPreset`, `knobsFromConfig`; [`graphicsSettings.ts`](../../src/app/graphicsSettings.ts) `applyLiveGraphics`, `syncQualityLabel`; `worldConfig.ts` reflection/transparency fields.

**Evidence/root cause:** `waterReflectionSize` and `aoTransparencyAware` are applied live but absent from preset-owned/matched knobs. High with a retained 1024² mirror can still be labeled High, while another High uses 256² (16× mirror texels, not 16× total cost). Transparency-aware AO can add scene renders independently of the preset label. `adaptiveEnabled` is stored but no adaptive controller is implemented; `applyFrameBudget` is intentionally a no-op after the old oscillation defect.

**Consequence:** surprising quality switching and incomparable “same preset” benchmarks; no bounded GPU budget follows from the name.

**Minimal correction/alternative:** either include these knobs in preset ownership/matching, or explicitly present/export them as independent overrides. Keep simulation/worldgen density outside presentation presets. Do not revive oscillating per-frame AO toggles.

**Verification:** settings/persistence round trips, High→custom override→Low→High behavior and benchmark metadata completeness. **Confidence: high**.

### R10 — Viewport resize does not re-evaluate DPR

**Files/symbols:** `appRenderLoop.ts` `applyViewportSize` (81–102); `graphicsSettings.ts:72–74,95–97`.

**Evidence/root cause:** resize compares width/height and calls `setSize`; `window.devicePixelRatio` is re-read only in renderer construction or quality handlers. Moving between monitors or browser scaling can leave the former ratio even if a resize fires. Renderer and composer remain mutually consistent, but may violate the current intended DPR cap/device ratio.

**Consequence:** stale resolution/sharpness or excess cost; this is not evidence of black frames.

**Minimal correction/alternative:** include effective DPR in the existing resize-state comparison and synchronize renderer/composer through one owner. Avoid redundant target reallocations.

**Verification:** equal CSS dimensions with changed DPR, monitor moves/zoom, hidden-small viewport and live quality changes. **Confidence: high**.

### R11 — Bounded atmospheric and post-order opportunities

**Files/symbols:** [`groundFog.ts`](../../src/world/groundFog.ts) card material/recycling; [`godRaysShader.ts`](../../src/render/godRaysShader.ts); `createPostProcessing.ts` pass order; `foliageWind.ts` alpha/wind patches.

**Evidence/mechanism:** five 18–32 m fog cards are transparent `MeshBasicMaterial`, DoubleSide, depth-write off, without soft depth intersections. Unlike water's `ShaderMaterial` (r185 defaults `forceSinglePass=true`), these basic-material cards default to two-sided two-pass rendering. Do **not** incorrectly count all DoubleSide water as two draws. Card/terrain intersections and recycling can be visible; this is distinct from the fixed integer-hash rectangles. God rays already skip at zero intensity, but when active do 32 samples/pixel and infer occlusion from brightness, not geometric depth. SMAA is before bloom/rays/output; it cannot clean edges introduced later, and nonlinear output changes the final contrast. No correctness mandate to reorder it was established.

**Consequence:** atmosphere can add overdraw or visible seams, and post cost scales strongly with drawing-buffer size. Vegetation cutouts correctly write depth, but alpha-test overdraw and wind/depth mismatch remain measurement/visual concerns; detailed vegetation coverage is excluded.

**Minimal alternative:** evaluate a single-pass fog-card setting and edge treatment before volumetric infrastructure; compare AA ordering only with fixed image/cost evidence. A fog depth fade introduces a depth dependency and needs careful water/transparency handling.

**Verification:** foggy slope/coast, slow/fast travel, particle overlap, dawn sun behind terrain and high-contrast foliage. **Confidence: medium** in significance; no new visual result claimed.

## November 1–6 changes and the Windows/Intel Arc correction

The local origin default-branch reference resolves to `main`; the remote URL is `git@github.com:jm-sky/seedvale-v1.git`. Review evidence is the explicit local snapshot above, not an assertion about later remote commits.

| Change | Relevance to this review |
|---|---|
| Nov 1 `caab7ae2`, `1b6959b9` | Tight shadow budget/frustum and sun-direction work; verified against current light/follow/cadence code. |
| Nov 2 `4d19403e`, `78a1b1a5`, `0fc77504`, `a33d9c1a` | Moving-shadow alternation; reflection size setting then 256 default; mirror yields to shadow refresh and template prewarm enabled. These mechanisms already exist, so their benefits must not be proposed/counted again. |
| Nov 3 `4dcee34c` | Per-level lake presentation without planar mirror. A major reason not to assume all inland water justifies the ocean mirror. |
| Nov 5 `7f40e4fb`, `09c033db` | Range relief and C¹ heightfield correction; new elevation makes R1 more consequential. Heightfield crease correction is distinct from fragment noise. |
| Nov 5 `f3f01284`, `f4e4fd28`, `ec57df37`, `29fc832d` | Far-terrain/canopy work. Current `farTerrainRadiusFromUrl()` remains opt-in; 600 m is the enabled default radius, not evidence that every ordinary view renders the ring. Full ring/canopy audit deferred. |
| Nov 6 `5d205128cd8d72a2a111cd34afc23cdc2fc6af24` | Integer lattice hash replaces float hashes in terrain, river and cave shaders; full source diff inspected. |
| Nov 6 `fed4014b`, `6b965904`, `d7bf11fa`, `7e216de4`, `bd3f280c` | Terrain-integrated rock plates and evolving hydrology. History/context inspected; these are workload/geometry changes, not controlled evidence of rendering performance. Full terrain/worldgen audit excluded. |

### Assessment of `5d205128`

**Evidence:** [`world-terrain-065 implementation notes`](../plans/implementation-notes/world-terrain-065-terrain-color-and-shading-artifact-correction-implementation-notes.md#root-cause-2--float-lattice-hash-on-angle-d3d11-opus-2026-11-06-fix-landed-author-verified) record that the rectangles persisted with post effects disabled, did not reproduce in the same way on WSL/Mesa, and disappeared after the change on the author's Windows Chrome / ANGLE D3D11 / Intel Arc. This is **inherited author verification**, not a test performed by this reviewer. That section also retains an older “Not verified on Windows” sentence; the explicit later author result at its start is the more current observation. Do not carry that stale sentence forward as the final status.

The patch exports include-guarded `INTEGER_LATTICE_GLSL` from `snowField.ts`, uses highp 32-bit integer mixing, converts the top 24 bits to float, and reuses the corner hashes in the existing smooth interpolation. `terrainValueNoise`, river `valueNoise`, cave value/gradient noise are covered. The exact integer-to-float numerator lies within the 24-bit exact-integer range. This removes the vulnerable floating-point hash chain at lattice corners rather than masking the image with blur or disabling effects. It preserves CPU worldgen/simulation authority and does not require a save/terrain-cache epoch change.

**Verdict:** a credible root-class correction for these procedural shader hashes, supported by the reported Arc symptom resolution. It is more than a pose-specific workaround. However, the claimed D3D11 algebraic reassociation/fast-math mechanism remains a hypothesis: no minimal same-corner D3D11 numeric probe or translated-shader evidence was provided. Do not claim a proven Intel hardware defect or a universal rendering fix.

**Limits:** tests in `buildChunkGeometryMaterial.test.ts`, `riverWaterMaterial.test.ts` and `caveHeightfieldMaterial.test.ts` assert shader source contracts; they do not compile/link or compare rendered pixels. The change does not solve actual heightfield creases, fog-card intersections, float texture capabilities, context restore, shadow clipping or every floating-point operation in the renderer. World-position precision, negative coordinate conversion, large world-edge positions, snow thresholds and wet-material appearance still merit cross-backend images/numeric probes. Changing the hash necessarily changes the presentation pattern. Ocean/lake waves use analytic sin/cos, not the replaced value-noise hash; replacing those indiscriminately would be unjustified. Screen-space god-ray jitter is also not the same neighboring-cell interpolation contract.

A useful remaining verification is a tiny shader fixture evaluating the same lattice corner through both adjacent-cell expressions on D3D11 and Mesa, alongside production terrain/river/cave captures. Retain the successful correction unless new evidence contradicts it; do not reopen already-excluded postprocessing explanations for those specific rectangles without a new reproduction.

## GPU cost and memory model (analytical, not benchmarks)

Let `P = drawingBufferWidth × drawingBufferHeight`, after DPR. Composer two RGBA16F targets + SMAA two RGBA16F targets + N8AO one full-size RGBA16F beauty target account for **40P bytes of color payload** when these paths have been exercised. At 1920×1080, that subset is approximately **79.1 MiB**; with the same CSS viewport at DPR 2 it is approximately **316.4 MiB**. These are nominal format calculations, not measured residency. They exclude depth attachments, AO intermediates, bloom, textures/geometry, driver padding and the default framebuffer. Disabled passes are constructed and resized, but GPU allocation may be lazy; do not count every constructed target as necessarily resident on Low.

One full-size RGBA16F read plus write is nominally `16P` bytes: about 31.6 MiB at 1080p, before cache/compression/extra samples. A chain of fullscreen operations therefore merits direct GPU measurement even if object draw calls are low. No bandwidth saturation is established by this arithmetic.

Bloom input dimensions are halved by the wrapper, so its base area is one quarter of composer area (the source comment saying “halves the pixel count” is imprecise). It then downsamples internally through mip levels. God rays add 32 texture samples/pixel only when armed; keeping them disabled at zero intensity is already a meaningful architectural saving.

Mirror color payload is 0.25 MiB at 256² and 4 MiB at 1024², plus depth. Resolution increases do not multiply object submission counts. Shadow-map nominal spatial density is 112/1024 ≈ 0.109 m per texel in the tight light-space extent (double at 512); this is not world-ground resolution at every sun angle. Coverage/cadence and resolution are separate issues.

Each chunk lake level currently adds a full chunk plane/material and a float height-mask texture; floor/body-scale textures and geometry are shared within that chunk. With default 65×65 input, one plane is 8192 triangles before clipping/discard. That is not an instruction to lower terrain resolution or lake richness: measure levels/chunk, visible-water coverage and vertex/fragment submissions before changing topology. Detail of residency/upload limits belongs to Session 2.

Terrain uses a shared Standard material with multiple procedural-noise evaluations, detail normal/diffuse sampling and wet/snow branches; it avoids per-chunk material variants but is not a cheap unlit surface. Foliage cutouts trade transparent sorting for depth-writing alpha tests; fill/texture cost still depends on coverage and overlapping leaves. No dominance ranking among terrain, vegetation, AO, lights and mirror is justified without a current capture.

## Architectural alternatives and trade-offs

| Alternative | Benefit | Cost / regression risk | Review position |
|---|---|---|---|
| Correct existing shadow center/coverage | Restores elevated-world correctness without another pass | Needs receiver/caster bounds and stable vertical movement | First correction candidate; no resolution escalation first |
| One capability decision + existing-owner validity/reset hooks | Makes fallback and context recovery explicit | Small integration surface but broad startup/restore test matrix | Prefer over reconstructing world/simulation on GL loss |
| Conservative shared-mirror relevance | Removes work without removing visible reflections | False negatives cause popping; ocean ring and abrupt turns matter | Measure via existing reflection owner; R5 continues September F06-1, not a new infrastructure proposal |
| Fixed light slots/buckets instead of variable light count | Could retain compile stability with a different shading cost | Shader integration, overflow policy and visual fidelity; current pad has historical justification | Only after current per-light/program evidence; no automatic switch |
| Half-float mirror | Preserves HDR energy before final output | More bandwidth/storage and capability requirements; potentially negligible visible benefit | Author-reviewed comparison, retain one mirror |
| Explicit preset overrides and complete metadata | Reproducible quality/cost comparisons | UI semantics/persisted settings must remain understandable | Small ownership correction; no density/simulation changes |
| Cascaded shadows, separate static/dynamic shadow caches | Potential wider/high-detail coverage | More draws/maps, invalidation rules, wind/actor consistency and seams | Not justified as first answer to R1 or current evidence |
| Per-lake planar mirrors / SSR | Reflect elevated water geometry or screen content | Extra scene renders or depth/history/edge-disocclusion costs; changes approved lake choice | Do not adopt without a new visual decision and evidence |
| Deferred/clustered renderer or WebGPU migration | Potentially better many-light scaling/new GPU features | Large material/post/compatibility rewrite, transparency and portability regressions | No compelling evidence here to abandon vanilla Three/WebGL2 |

The current simulation/presentation boundary should be preserved. The best architectural work is to make **existing render owners' capability, content validity, cost and configuration contracts explicit**. There is no demonstrated need for a global render-job scheduler, a second visibility database or reduced living-world complexity.

## Verification and benchmark requirements for a separately authorized session

No measurements below were performed here. Target remains stable **50–60 FPS**, with **45–60 acceptable under documented project constraints**; average frame rate, traversal stalls, correctness and memory stability are independent acceptance axes. P1 closure is not proof that today's build achieves that target.

1. **Record an exact baseline:** source SHA, clean/dirty tree, lockfile/library versions, seed 415424794, full config (not only preset), CSS/drawing-buffer size/DPR, browser/driver/GPU identity, ANGLE backend, supported extensions, route/camera, sun/weather, populations/resident content and warm/cold state. Match native Windows/Arc runs to native runs; keep WSL/Mesa results separate.
2. **Correctness first:** R1 elevation/frustum matrix; integer-hash production poses plus negative/world-edge coordinates; water/vegetation/fog transparency ordering; AO on/off; shadow and mirror live resize; context loss/recovery; capability failure paths. Shader compile/link diagnostics remain enabled. Capture screenshots and GL errors with exact settings.
3. **Cost decomposition:** main/shadow/mirror actual execution, call/triangle counts and program first-use; whole rendering GPU elapsed plus separately identified spans if possible; CPU submission and simulation categories separately. Include native timer-unavailable provenance; do not infer a missing GPU measurement from CPU wall time.
4. **Representative controlled scenes:** stationary and moving settlement, dense forest, dry inland, elevated lake, sea coast/ocean, summit at low sun, rain/fog and dawn/dusk. Start with matched mirror/AO/shadow isolates and resolution sensitivity, one change at a time; at least three paired repetitions when comparing performance. Avoid giant unbounded parameter sweeps.
5. **Frame stability:** p50/p95/p99/max and long-frame attribution; shadow/mirror overlap, actual age distributions, compiler/link waits vs uploads. “Scheduled refresh” is not proof that GL rendered a valid target. Preserve raw traces for exceptional frames.
6. **Ownership/stability:** repeated app teardown/recreation for R3, world rebuild separately, effect toggles, target resize and restore. Inspect allocations/deletions and memory settling; JS heap and `renderer.info.memory` counts are not GPU-byte measurements.

Existing tests were inspected, not rerun: mirror cadence/yield/size; shadow budget cadence; light snapping/direction; program staging and target restore; viewport integer/min-size handling; water lake grouping/masks; preset matching; integer-hash shader string contracts. They provide useful pure-code guards but do not cover actual driver rendering. No new tests were added for this documentation task.

## Cross-system risks, open questions and author decisions

- **Terrain/geography:** elevated receivers need matching shadow coverage. Far terrain remains an opt-in visual branch; its sky/fog/canopy/depth interactions need a bounded follow-up rather than assuming the historical 500 m camera discussion still applies everywhere.
- **World lifecycle:** renderer/point-light pad survive `WorldBundle`; ocean/mirror does not. Recovery must not replace simulation identity or accidentally retain a disposed world's mirror bindings. Full rebuild/stream publication auditing is deferred.
- **Simulation:** continuing `onTick` during context loss is current behavior. Decide presentation suspension and player feedback independently of authoritative simulation progression; this review does not authorize freezing the living world.
- **Lighting:** do current settlement/fire populations ever exceed the protected near-camera budget? What real program keys remain un-prewarmed? Current evidence does not settle these.
- **Compatibility:** exact reference Arc device/driver and current extension inventory must accompany new claims. Historical Arc 140V reports are not a substitute for current device metadata.
- **Ownership:** does app recreation retain old contexts/references long enough to expose N8AO's missing explicit disposal? Correctness of the disposal contract is established; practical accumulation is open.
- **Appearance:** does the current LDR mirror approximation visibly hurt the approved look? Is fog card intersection/recycling acceptable? These require author images/judgment.

**Recommendations requiring author approval before runtime work:** selection of a capability fallback/unsupported-device policy; any changed water/reflection content or inland-lake reflections (D8/D13 and lake decision); HDR mirror, shadow quality/cadence or fog/AA visual changes; new graphics preset semantics; any new lighting backend. R1/R3 are correction candidates, but this task authorizes **none of their implementations**. No implementation plan is created or amended here. Do not change density, world simulation depth, visual direction or renderer backend to chase an unmeasured FPS estimate.

## Evidence index and limits

Project context read: `CLAUDE.md`; Revival `README.md` and Strategic Brief decisions/preservation boundaries; review index/matrix; architecture `README.md`, runtime/lifecycle/simulation sections of `ARCHITECTURE.md`, `GRAPHICS.md` standing decisions/history, `performance-and-workers.md`; targeted `CODE_INDEX.md`/`STATE.md` routing. Historical material is context, not proof of current code.

Primary paths inspected (focused functions/sections; not every file exhaustively):

- App: `renderStack.ts`, `createApp.ts` render construction/teardown, `appRenderLoop.ts`, `graphicsSettings.ts`, `gameLoop.ts` light/follow and frame render sequence.
- Rendering: `createRenderer.ts`, `createPostProcessing.ts`, `gradedOutputPass.ts`, `programPrewarm.ts`, `shadowBudget.ts`, `godRaysShader.ts`; `perf/gpuTimer.ts`, relevant `perf/flags.ts` settings.
- Water/light/atmosphere: `createLights.ts`, `pointLightBudget.ts`, `waterMirror.ts`, `createOcean.ts`, `createWater.ts`, `createRiverWater.ts`, `waterMaterial.ts`, `riverWaterMaterial.ts`, `foliageWind.ts`, `groundFog.ts`, `weatherParticles.ts`, `createSky.ts` entry point.
- Terrain/config/assets: shader injection in `buildChunkGeometry.ts`, `snowField.ts`, `caves/caveHeightfieldMaterial.ts`; `rangeSpines.ts` elevation contract; `farTerrainFlag.ts`; `qualityProfiles.ts`, relevant `worldConfig.ts`; texture color-space declarations in `loadTexture.ts`/`sharedSurfaceDiffuseTextures.ts`.
- Dependencies: installed Three renderer, WebGLPrograms, WebGLTextures, WebGLShadowMap, RenderTarget/Texture/Material/ShaderMaterial, EffectComposer/Pass/SMAAPass; N8AO source and exported distribution/prototype. Local package versions are Three 0.185.1 and N8AO 2.0.1. No upstream latest-version behavior is assumed.
- Tests: the bounded suites listed in the verification section, plus November 6 test diff; no full test-run claim.

Relevant prior evidence consulted:

- [September rendering domain audit](codebase-domain-audit/2026-09-19--06--rendering-and-graphics-runtime.md), notably F06-1. R5 is a current-code revalidation of an existing finding. Its disposal/restore descriptions are not sufficient to discharge R3/R4.
- [November 1 pass-distribution review](2026-11-01--world-terrain-056-render-pass-frame-distribution-review.md). Its forecast tables are hypotheses, not new measurements here; parts of the proposed cadence work subsequently landed.
- [Research 019](../research/2026-08-17--019--rendering-optimizations.md), [review 017](2026-08-15--017--rendering-regression-audit.md) and [review 024 light-budget experiment](2026-08-18--024--plan-149-pointlight-budget-curve.md). Their historical costs/settings are not today's baseline.
- [Terrain artifact plan](../plans/world-terrain-065-terrain-color-and-shading-artifact-correction.md) and its implementation notes, plus source/test diff for `5d205128`.

Two lightweight Node probes only: exported N8AO disposal prototype identity; shadow-camera NDC projections using production constants. Both executed successfully without DOM, WebGL context or world generation. The latter is an analytical fixture, not a sampled reference-world summit. Repository documentation link/diff checks are recorded in the delivery commit; no browser, heavy tests or benchmarks were run.

## Compact continuation handoff

**Exact report:** `docs/reviews/2026-11-06--036--rendering-gpu-critical-architecture-session-1.md`.

**Exact reviewed source commit:** `ac9717721e3eb68feadf45b5c476e5de18924735`.

**Documentation commit lookup:** `git log -1 --format=%H -- docs/reviews/2026-11-06--036--rendering-gpu-critical-architecture-session-1.md` (the containing commit cannot embed its own hash; delivery response supplies it).

**Reviewed:** renderer/composer/pass order, shadow/mirror scheduling, water target/material contract, basic color path, resize/presets, rendering-specific disposal/restore, light pad/prewarm, November 6 Arc fix. **Highest priority:** R1 elevation-blind shadows; R2 missing float capability fallback; R3 N8AO no-op disposal; R4 restored-target validity; R5 invisible mirror work; R6 timer excludes mirror. No Critical finding; no GPU benchmark performed.

**Key entry points:** `createLights.follow`, `gameLoop` lines 2895 and 3226 onward; `appRenderLoop.onWebglContextRestored`; `createPostProcessing.dispose`; `createWater.createDataTexture`; `waterMirror.render`; `programPrewarm.objectProgramFlags/cloneForStaging`; `qualityProfiles.knobsFromConfig`. Keep author-confirmed Arc rectangle fix separate from the unproven compiler mechanism and other visual issues.

**Unreviewed:** full chunk upload/residency/rebuild path; full instancing/culling and actor/vegetation LOD/skeletons; far-terrain/canopy integration; complete material variant/cost census; worker/CPU simulation and non-rendering lifetime. No acceptance implied for these areas.

**Open investigations:** native elevated-shadow reproduction; capability-limited render path; repeated app teardown allocation retention; first valid frame after GL restore; actual mirror relevance/cost; program first-use and colored-instance coverage; complete benchmark metadata and GPU span interpretation.

**Suggested Session 2:** bounded streaming-to-GPU submission review: chunk finalization/upload and material/program first use, then terrain/vegetation batching/culling ownership, with explicit handoffs for actor LOD. Begin with these retained findings and changed-path diff since the reviewed SHA. A separate authorized GPU-validation session can verify R1–R7; do not silently start it or mix it with CPU simulation scheduling. System 16 stays **partial**. This session ends here.
