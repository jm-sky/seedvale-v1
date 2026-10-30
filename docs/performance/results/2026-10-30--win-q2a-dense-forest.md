# Q2a dense-forest — native Windows (Intel Arc, Chrome ANGLE D3D11)

SHA `11547b5c`, Vite dev, `dense-forest`, n = 3, 35 s cooldown. Raw: `results/win/2026-10-30--win-q2a-dense-forest-rep{1,2,3}.*`. Platform: **Windows only**; do not compare with the WSL census.

| rep | mean FPS | p95 ms | draws | baseline RENDER avg | hide-vegetation RENDER avg (Δ) | draws / tris (full → hide-veg) | GPU elapsed avg |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 74.2 | 16.5 | 755 | 6.9 | 7.3 (+0.4) | 751 → 590 / 16.58M → 11.25M | 27.5 |
| 2 | 79.0 | 16.3 | 755 | 6.9 | 6.8 (−0.2) | 751 → 590 / 16.58M → 11.25M | 26.6 |
| 3 | 79.1 | 15.4 | 755 | 6.8 | 6.9 (+0.2) | 757 → 600 / 16.75M → 11.32M | 28.6 |

## Reading

- Removing vegetation drops ~160 draws and ~5.3M triangles yet RENDER wall time moves by +0.4 / −0.2 / +0.2 ms (mean ≈ +0.1 ms, within noise). The decision threshold was ≥ ~2 ms.
- Trees are not a top bucket: the largest single hides are `hide-settlement` (−0.9 ms in rep 1) and `hide-terrain`/`no-reflections` (within ±0.6 ms).
- Caveat: the GPU timer (~27 ms) only exists for the baseline window; there is no per-probe GPU isolation, so a GPU-side tree cost is not separately measured. RENDER wall includes driver wait, and it did not change when 5.3M triangles were removed.

## Outcome

Per the decision path (WSL census §Decision path): **P1-D closed as "measured, not needed"**; `world-terrain-055` is not written. The tree LOD asset package stays inert. Revisit only if a later GPU-isolated probe shows trees ≥ ~2 ms.
