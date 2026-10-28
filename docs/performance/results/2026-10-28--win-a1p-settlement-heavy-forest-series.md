# Windows Arc — settlement-heavy + forest, 3×30 s (post determinism / wood_pile / NPC A1′ / outfits)

**Created:** 2026-10-28 (Claude Code, Sonnet 5.5)
**Code SHA:** `ccc4d3783a9d069d308a635a8e47179f6645cb17` (`main`, clean tree; `context.gitSha` = this SHA in all 6 runs; Vite restarted on `PORT=5590` after checkout)
**Hardware path:** native Windows 11, Intel Arc 140V (ANGLE D3D11), headed Chrome (CDP-driven, 1600×900), **fresh profile + 30 s cooldown per rep**, `?benchmark=<id>` auto-run on `BENCHMARK_FIXTURE`, 30 s, High. `hardwareClass: target-gpu` (device string contains Arc). Power/thermal not captured.
**Artifacts:** `results/win/2026-10-28--win-a1p-{settlement-heavy,forest}-rep{1,2,3}.{json,raw.json,md,meta.json}`

## Scope

Intended: settlement-heavy, forest, stream, water ×3. **Stopped by user request after forest**; **stream and water were not run** (no data, not claimed). Work under test since the last series (`721af157`): determinism fixes for benchmarks, wood_pile optimisation in settlements, NPC A1′ model optimisation, NPC outfit variants.

## Results

| Scenario | FPS (3 reps) | mean / CV | frame p95 ms | mean / CV | draw calls | mean / CV | RENDER ms | GPU ms | NPC |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy | 27.0 / 26.5 / 26.6 | 26.7 / 0.8 % | 50.0 / 68.8 / 48.8 | 55.9 / 16.4 % | 2184 / 2226 / 2183 | 2198 / 0.9 % | 21.0 / 20.9 / 21.8 | 22.6 / 22.3 / 23.5 | 53 / 53 / 53 |
| forest | 36.4 / 37.4 / 37.6 | 37.1 / 1.4 % | 32.4 / 35.6 / 38.3 | 35.4 / 6.8 % | 1823 / 1813 / 1821 | 1819 / 0.2 % | 16.8 / 15.7 / 15.3 | 24.3 / 23.3 / 22.5 | 20 / 20 / 20 |

Population gate `stable` in all 6 runs.

## Comparison with the earlier READY recapture (`721af157`, same machine path)

| Scenario | then FPS | now FPS | then draw calls | now draw calls | then NPC | now NPC |
| --- | --- | --- | --- | --- | --- | --- |
| settlement-heavy | 23.7 / 26.4 / 28.3 (7.2 % CV) | 26.7 (0.8 % CV) | 2441 / 2403 / 2368 | 2198 | 69 / 69 / 53 | **53 / 53 / 53** |
| forest | 50.9 / 47.3 / 45.4 | **37.1** | 1852 / 1871 / 1860 | 1819 | 20 | 20 |

- **settlement-heavy:** FPS variance dropped (CV 7.2 % → 0.8 %) and the NPC population is now identical across launches (53×3), so the workload mismatch that blocked A0a/B0 (69/69/53) did not recur. Draw calls −10 %. FPS is within the earlier range, not clearly better. p95 still varies (49–69 ms; long frames not traced).
- **forest: FPS is ~20 % lower (≈37 vs ≈48) while draw calls are ~2 % lower.** The three reps agree, so this looks reproducible, not noise. Cause **not investigated**. Triangles are 12.54 M per frame here; I did not have the earlier forest triangle count to hand, so a geometry increase (e.g. new NPC/outfit or settlement content inside the forest fixture) is a hypothesis only. A bisect between `721af157` and `ccc4d378` on forest is the obvious next step.

## Limits / not claimed

- Not a certified baseline: stream/water not run, no Chrome trace, no thermal log, forest not verified as grass-dominant (it contains a settlement), upload bytes not measured.
- Cross-series comparison spans many commits and was not run back-to-back, so gains/regressions are attributable to the commit range, not to a single change.
- Settlement-heavy NPC count being 53 ×3 supports, but does not prove, that the earlier 69-vs-53 divergence was fixed by the determinism work (3 launches only).
- Driver was an ad-hoc CDP script (not in the repo); it needed `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding` and `Page.bringToFront`, otherwise the page reported `visibilityState: hidden` and sat at world-build 10 %.
