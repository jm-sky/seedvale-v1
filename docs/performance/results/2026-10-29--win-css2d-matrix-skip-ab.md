# CSS2D matrix-update skip — A/B `fe5ff141` (A) vs `288184cf` (B), settlement-heavy

**Date:** 2026-10-29 · **By:** Claude Code (Sonnet 5.5) · **Classification:** diagnostic same-session A/B, not a certified baseline.
**Verdict: REVERT / not kept.** Hypothesis is mechanically correct, but no frame-time gain is measurable. `main` carries no runtime change; this report is the only deliverable.

## 1. Hypothesis check (three 0.185.1)
- `CSS2DRenderer.render()` (`examples/jsm/renderers/CSS2DRenderer.js:172`) calls `scene.updateMatrixWorld()` **iff `scene.matrixWorldAutoUpdate === true`**; `WebGLRenderer.render` (`WebGLRenderer.js:1635`) has the same guard. So `scene.matrixWorldAutoUpdate = false` globally would also stop the WebGL pass — it cannot be set permanently.
- The second traversal is not free: `Object3D.updateMatrixWorld` calls `updateMatrix()` on every `matrixAutoUpdate` object, which sets `matrixWorldNeedsUpdate`, so those objects re-run `multiplyMatrices` a second time per frame. Static `matrixAutoUpdate=false` objects only pay the walk.
- In `src/app/gameLoop.ts` the beauty pass (`postProcessing.render()`) is immediately followed by `labelRenderer.render(scene, camera)` inside the `RENDER` category; nothing moves in between; no `onBeforeRender`/`onAfterRender` exists in `src/`. Skipping is therefore semantically safe.

## 2. Experiment (B, branch `exp/css2d-matrix`, local only, never pushed)
Only `src/app/gameLoop.ts` changed, around the label render:
```ts
const sceneMatrixAutoUpdate = scene.matrixWorldAutoUpdate
scene.matrixWorldAutoUpdate = false
try { labelRenderer.render(scene, camera) } finally { scene.matrixWorldAutoUpdate = sceneMatrixAutoUpdate }
```
Camera left untouched (`camera.updateMatrixWorld` is trivial). Plus `src/app/css2dMatrixSkip.test.ts` (2 tests: no second traversal with the flag off; label transform identical to the default path and not one frame late). The branch is not kept on remote, so the diff above is the record.

## 3. Setup
Native Windows 11, Intel Arc 140V, Chrome headed, High, DPR 1.25, same viewport/fixture/camera, `settlement-heavy`, 30 s, 53 NPC (population gate `stable`), fresh profile per run, 35 s cooldown, strictly sequential (one Vite + one Chrome; no `chrome.exe` present beforehand). One unmeasured warm-up per variant (discarded). A ran from worktree `D:/svA` (`fe5ff141`), B from `D:/svB`; driver `scripts/perf/run-benchmark-series.mjs` verified `gitSha` per run. Order **A B B A A B**. Artifacts: `results/win/2026-10-29--win-css2d-ab-{A,B}-run{1..6}-settlement-heavy-rep1.*`.

## 4. Results
| Run | Var | FPS | p50 | p95 | p99 | max | RENDER p50 / p95 | draws | long frames |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A | 30.5 | 33.3 | 38.6 | 42.0 | 83.2 | 27.0 / 31.3 | 2123 | 1 |
| 2 | B | 31.6 | 31.4 | 37.4 | 75.6 | 84.7 | 24.5 / 29.5 | 2091 | 4 |
| 3 | B | 31.5 | 31.9 | 36.6 | 80.5 | 85.5 | 25.8 / 29.6 | 2169 | 11 |
| 4 | A | 32.6 | 31.8 | 36.3 | 39.9 | 78.1 | 25.8 / 29.1 | 2135 | 0 |
| 5 | A | 31.1 | 32.7 | 37.6 | 76.1 | 93.0 | 26.1 / 29.8 | 2129 | 7 |
| 6 | B | 30.5 | 32.6 | 40.1 | 81.7 | 88.3 | 25.7 / 29.3 | 2163 | 10 |

Means [min–max]: FPS A 31.4 [30.5–32.6] vs B 31.2 [30.5–31.6]; frame p50 32.6 vs 32.0 ms; p95 37.5 vs 38.0; p99 52.7 vs 79.3 (A run5 also hit 76); RENDER p50 26.3 [25.8–27.0] vs 25.3 [24.5–25.8]; update p50 6.2 vs 6.3; draws 2129 vs 2141 (same workload).

- FPS: −0.2 (B), well inside the ~2 FPS same-variant spread.
- RENDER p50 is ~1 ms lower in B and RENDER p95 ~0.6 ms lower, but the ranges overlap (A min 25.8 = B max 25.8) and it does not show up in frame p50/p95/FPS. Not beyond noise at n=3.
- B has more long frames and a worse p99 (4/11/10 vs 1/0/7); A run5 shows the same pattern, so I attribute it to session noise, but it certainly offers no support for B.
- GPU timing: unavailable (`gpuTiming` absent in the reports).

## 5. Verdict
**Revert.** Keep criteria not met: no frame-time improvement beyond noise, and no credible evidence of removed matrix work — the repo has no instrumentation isolating matrix-update CPU cost (`RENDER` includes the label pass but not separately), and I did not add any or record a Chrome trace. Fewer calls alone is not sufficient. A plausible explanation (not measured): most heavy scene content is `matrixAutoUpdate=false` (static settlement/terrain), so the second traversal is mostly a cheap walk on this scenario.

## 6. Verification status
- `vue-tsc --noEmit`: clean on B. ESLint on the touched files: clean.
- New test (2 cases) passes (run from the main checkout; see limitation).
- Not run: full `pnpm run test`; browser/visual verification (labels following NPCs, camera rotation, chunk streaming) — **not done**, benchmark runs do not check label placement.
- Environment limit: jsdom is broken in this install (`Cannot find module 'is-potential-custom-element-name'`), so every `@vitest-environment jsdom` test, including existing ones, fails to start. The new test uses a DOM stub for that reason.

## Limits
n=3 per variant, single session, power/thermal not logged, RENDER ~1 ms effect would need more runs or a matrix-specific probe to resolve. If revisited: add a narrow probe timing `scene.updateMatrixWorld()` inside the label pass before spending more benchmark time.
