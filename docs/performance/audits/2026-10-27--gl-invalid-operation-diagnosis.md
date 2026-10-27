# GL_INVALID_OPERATION (texture/sampler mismatch) — diagnosis

**Created:** 2026-10-27 (Claude Code, Sonnet 5.5) · **Code SHA:** `6fb20d12` (no source changes in this slice)
**Status:** diagnosis **partly verified**; **no application fix implemented** (proposal only, needs author approval — it changes first-frame render behaviour).
**Context:** follow-up to [`../results/2026-10-27--051--a0a-b0-c0-baseline-summary.md`](../results/2026-10-27--051--a0a-b0-c0-baseline-summary.md) problem #3.

## Verdict

| Question | Answer | Evidence level |
| --- | --- | --- |
| Which pass raises the error? | The **water mirror pass** — `WaterMirror.render()` → `renderer.render(scene, mirrorCamera)` at `src/world/waterMirror.ts:146`, called by `createOcean.renderMirror` from `src/app/gameLoop.ts:3127`. All 13 unique error signatures captured had this call chain. | ✅ observed (per-draw `getError`) |
| Which sampler / material? | Not one material: **every lit three.js material** (MeshStandard/Physical: `Wood`, `Stone`, `Green`, `MapleTree_Bark`, `Flowers`, `Material.001`, terrain shader `uTerrainDirtAlbedo`, …) fails identically. The offending sampler is **`directionalShadowMap[0]` (`sampler2DShadow`)**. | ✅ observed |
| What is bound to it? | three's **default 1×1 RGBA placeholder texture** (texture id 1, created in `new WebGLState` → `initGLContext`), filtering NEAREST, `TEXTURE_COMPARE_MODE = NONE`. A `sampler2DShadow` needs a depth texture with compare mode → format/sampler mismatch → draw rejected. | ✅ observed |
| Why is the shadow map missing? | In `gameLoop.ts` the mirror pass (line 3127) runs **before** the shadow refresh (`shadowMap.needsUpdate`, line 3147) and `renderer.shadowMap.autoUpdate = false` (788, and forced off inside the mirror pass). On the first frame(s) the directional light has no `shadow.map` yet, so three binds the placeholder. | 🟡 inferred from code order; consistent with all captures |
| Does it occur inside the measured window? | **Unverified.** A probe 8 s after `window.__seedvaleReady` on `?benchmark=water` saw **0 errors**; probes from page start saw errors (capped to 13 signatures / 46 errors in 3 s after ready+start). The full-window run (settlement-heavy, timestamps per error) crashed WSL and was not completed. Working hypothesis: errors are **load/first-frames only**, so the earlier worry that "draw counts in the measured window include rejected draws" is **probably wrong** — but not proven. | ❓ open |
| App bug or driver bug? | Application-level: reproduced on Mesa D3D12→ANGLE/GL **and** SwiftShader (Vulkan). Native Windows ANGLE/D3D11 not tested (may be identical or silent). | ✅ for the two stacks tested |

## Method (reproducible; no repo code touched)

Playwright-core drives Chrome with an init script that patches `WebGL2RenderingContext.prototype`:

- `createTexture` / `texImage2D` / `texStorage2D` / `texParameteri` wrapped to record per-texture id, internal format, size, params and creation stack;
- `drawElements|drawElementsInstanced|drawArrays*` wrapped: drain `getError()`, call original, `getError()` again; on error capture `CURRENT_PROGRAM`, `SHADER_NAME` from the attached shader source, every active sampler uniform with its unit/texture id/format/`TEXTURE_COMPARE_MODE`, framebuffer-bound flag and the JS stack (first `src/` frame = caller).

Compact script (re-create under a scratch dir; **not** committed as code — it slows rendering heavily):

```js
// gl-draw-diag-init.js — pass to context.addInitScript({ path })
(() => {
  const P = WebGL2RenderingContext.prototype, info = new WeakMap(); let nid = 0
  const bindOf = (gl, t) => gl.getParameter({ [gl.TEXTURE_2D]: gl.TEXTURE_BINDING_2D, [gl.TEXTURE_CUBE_MAP]: gl.TEXTURE_BINDING_CUBE_MAP, [gl.TEXTURE_2D_ARRAY]: gl.TEXTURE_BINDING_2D_ARRAY }[t])
  const oc = P.createTexture; P.createTexture = function () { const t = oc.call(this); info.set(t, { id: ++nid }); return t }
  for (const [n, f, d] of [['texStorage2D', 2, 3], ['texImage2D', 2, 3]]) { const o = P[n]; P[n] = function (...a) { try { const i = info.get(bindOf(this, a[0])); if (i) Object.assign(i, { fmt: '0x' + (a[f] ?? 0).toString(16), wh: `${a[d]}x${a[d + 1]}` }) } catch {} return o.apply(this, a) } }
  const D = (window.__glDiag = { seen: new Map(), total: 0, callers: {}, times: [] })
  const S = { 35678: 'sampler2D', 35682: 'sampler2DShadow', 35680: 'samplerCube' }
  for (const fn of ['drawElements', 'drawElementsInstanced', 'drawArrays', 'drawArraysInstanced']) {
    const o = P[fn]
    P[fn] = function (...a) {
      while (this.getError() !== 0) {}
      const r = o.apply(this, a); if (this.getError() === 0) return r
      const gl = this; D.total++; D.times.length < 20000 && D.times.push(Math.round(performance.now()))
      const st = new Error().stack.split('\n'); const caller = (st.find((x) => x.includes('/src/')) || 'none').trim(); D.callers[caller] = (D.callers[caller] || 0) + 1
      if (D.seen.size > 12) return r
      const prog = gl.getParameter(gl.CURRENT_PROGRAM); const name = (gl.getAttachedShaders(prog).map((s) => gl.getShaderSource(s)).join('\n').match(/#define SHADER_NAME (\S+)/) || [])[1] || 'unknown'
      const samplers = []; const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); const prev = gl.getParameter(gl.ACTIVE_TEXTURE)
      for (let i = 0; i < n; i++) { const u = gl.getActiveUniform(prog, i); if (!S[u.type]) continue; const v = gl.getUniform(prog, gl.getUniformLocation(prog, u.name))
        for (const un of (ArrayBuffer.isView(v) || Array.isArray(v) ? Array.from(v) : [v])) { gl.activeTexture(gl.TEXTURE0 + un); const t = bindOf(gl, S[u.type] === 'samplerCube' ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D); const x = t && info.get(t)
          samplers.push({ uniform: u.name, glsl: S[u.type], unit: un, texId: x?.id, fmt: x?.fmt, wh: x?.wh, cmp: t ? gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE) : null }) } }
      gl.activeTexture(prev); const key = name + samplers.map((s) => s.uniform + s.texId).join(',')
      if (!D.seen.has(key)) D.seen.set(key, { name, caller, samplers })
      return r } }
})()
```

Driver: headed Chrome, `?benchmark=water`, wait for `window.__seedvaleReady`, read `window.__glDiag`. Samples of the finding (sampler list of one failing draw, `shaderName=unknown`, terrain program):
`uTerrainDirtAlbedo` (tex 8, 1024², SRGB8_A8) · `dfgLUT` (tex 9, 16², RG16F) · **`directionalShadowMap[0]` `sampler2DShadow` → tex 1, 1×1 RGBA, cmp NONE, created in `WebGLState`** · `normalMap` (tex 10, RGBA8). Stack: `renderBufferDirect < renderObject < renderObjects < renderScene < WebGLRenderer.render < waterMirror.ts:146 < createOcean.ts:34`.

## Hazard for the next run

The first full-window diagnostic (per-draw `getError()` with headed Chrome, settlement-heavy, ~2 300 draws/frame) **crashed WSL** (scratch files lost). Do not repeat that on WSL. On Windows use the *cheap* variant: enable the patch only for the first ~120 frames after `ready`, or sample every Nth draw, and count errors per `performance.now()` window relative to the benchmark start/end.

## Proposed app fix (NOT implemented — behaviour change, needs approval)

Goal: no mirror draw before the directional light owns a shadow map.

- **A (smallest):** in `WaterMirror.render` (or its call at `gameLoop.ts:3127`), skip the pass while `directionalLight.shadow.map == null` (first frame only); mirror RT stays cleared one frame. Visual effect: at most the first frame has no reflection.
- **B:** force the first shadow update before the first mirror pass (reorder only when `shadow.map == null`).
- Do **not** globally disable shadows in the mirror pass, change `autoUpdate`, or touch materials — the placeholder is three's intended fallback and the error is confined to a single initial frame in all evidence.

Acceptance for a future fix: zero `INVALID_OPERATION` from page start through a 30 s benchmark on Windows Chrome and SwiftShader; mirror/shadow pass call counts in a 3-rep `water` unchanged within noise; no visual change after frame 2.

## Remaining questions

1. Count and timing of errors relative to benchmark start/end (are there any inside the 30 s window?).
2. Whether native Windows ANGLE/D3D11 reports the same error (the 032 diagnostic console was not archived).
3. Whether any *other* pass (shadow/main) also hits the placeholder — all 13 captured signatures were mirror-only, but the capture was capped at 13 signatures.
