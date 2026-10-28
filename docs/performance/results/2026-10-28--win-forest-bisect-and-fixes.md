# Forest regression bisect + two CPU fixes (native Windows Arc)

**Created:** 2026-10-28 (Claude Code, Sonnet 5.5)
**Hardware path:** same as the earlier series — native Windows 11, Intel Arc 140V (ANGLE D3D11), headed Chrome, fresh profile per run, High, fixture `tools-001-v1`, 30 s window, `hardwareClass: target-gpu`.
**Fixed SHA benchmarked:** `36e99ef6c31000b683619916b4d19a210408760e` (`context.gitSha` in all 6 runs). Artifacts: `results/win/2026-10-28--win-fix1-{forest,settlement-heavy}-rep{1,2,3}.*`.

## 1. Bisect (forest, 1 run per commit, `721af157..ccc4d378`)

Only 9 commits in the range touch `src/` or `public/`. Runs were strictly sequential (no concurrent benchmarks), ≥30 s apart, in a bisect worktree sharing `node_modules`. Single runs: noise is about ±2 FPS (see 721af157 → 2c896069 → e76f3f9c), so only the large step is conclusive.

| Commit | What | FPS | p95 ms | draw calls |
| --- | --- | --- | --- | --- |
| `721af157` | baseline (earlier READY series) | **47.3** | 26.2 | 1892 |
| `4347c274` | wood_pile instanced tiers | 45.2 | 27.3 | 1856 |
| `2c896069` | settlement lifecycle/rollback | 42.9 | 28.3 | 1868 |
| `e76f3f9c` | NPC skinned native culling (A1′) | 45.4 | 27.5 | 1831 |
| `8fc58ddf` | culling review fixes F1–F3 | **37.7** | 34.0 | 1832 |
| `8fc58ddf` + `actorCullBounds.ts` from `e76f3f9c` | A/B | **46.5** | 26.1 | 1811 |
| `8fc58ddf` without `mesh.boundingBox = previousBox` | A/B | **46.7** | 27.0 | 1838 |
| `ccc4d378` (earlier series, 3 reps) | HEAD | 37.1 | 35.4 | 1819 |

**Root cause of the forest regression:** commit `8fc58ddf` restores `mesh.boundingBox` to its previous value (`null`) after computing the actor envelope. The A/B pair isolates exactly that line (≈ −9 FPS). Draw calls, triangles and per-pass submissions are identical between good and bad runs, which is why the earlier geometry/draw-call comparison could not explain it.

Mechanism (hypothesis, not proven): native `SkinnedMesh.raycast` skips its per-vertex skinned intersection only when `boundingBox !== null`, so with `null` every ray that touches the envelope sphere would skin and test each triangle. The HEAD trace profile shows no `raycast`/`getVertexPosition` samples, so the *why* is unconfirmed; the *where* is proven by the A/B runs.

The ~−2 FPS steps at `4347c274` and `2c896069` are within single-run noise and are not attributed.

## 2. Fixes (kept, per instruction, even where small)

1. `36e99ef6` `perf(npc)`: `installActorCullBounds` now writes a **conservative envelope cube** (the same animation envelope as the bounding sphere) to `boundingBox` instead of leaving `null`. Not a tight bind-pose box, so animated poses are not rejected — this keeps the intent of the review finding. Contract change: the test "preserves raycast boxes" now asserts a non-empty envelope box. **Needs your browser check that NPC picking/interaction at animated poses still works.**
2. `29b42a09` `perf(terrain)`: `ChunkManager.riverShoreQuery` memoises per exact `(x, z)` (128-entry LRU), cleared whenever chunk river chains are retained or a chunk is removed. The result is identical to a fresh scan (pure function of loaded chains), so it stays deterministic. Targets `nearestRiverShoreCandidate` (≈ 11 % CPU in both traces) from the player's per-frame shoreline probe.

Not done: water mirror (already capped at 30 Hz and every other frame under load; going further changes visuals) — left for a later, measured change.

## 3. Results on `36e99ef6` (3 reps each, 30 s cooldown, population gate `stable`, `target-gpu`)

| Scenario | FPS (3 reps) | mean / CV | p95 ms | mean / CV | draw calls | RENDER ms | NPC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| forest | 58.8 / 57.6 / 51.7 | **56.0** / 5.5 % | 20.6 / 21.2 / 24.5 | 22.1 / 7.8 % | 1818 / 1808 / 1815 | 10.7 / 11.0 / 12.5 | 20 |
| settlement-heavy | 32.0 / 32.5 / 33.4 | **32.6** / 1.8 % | 36.4 / 36.6 / 34.9 | 36.0 / 2.1 % | 2258 / 2180 / 2222 | 20.2 / 19.8 / 19.8 | 53 |

| Before → after | forest | settlement-heavy |
| --- | --- | --- |
| `ccc4d378` (3 reps) | 37.1 FPS, p95 35.4 | 26.7 FPS, p95 55.9 |
| `721af157` (earlier READY, 3 reps) | 45.4–50.9 | 23.7–28.3 |
| `36e99ef6` | **56.0**, p95 22.1 | **32.6**, p95 36.0 |

- forest: +51 % vs `ccc4d378`, above the old baseline range; settlement-heavy: +22 % FPS and p95 −36 %. NPC counts are identical across reps (20 / 53).
- The two fixes were **not benchmarked separately**. The forest A/B isolates fix 1 on `8fc58ddf`; fix 2's own contribution is unmeasured (settlement-heavy's gain is consistent with the river-shore memo but not proven).
- forest rep3 (51.7 FPS, p1 24, max 131 ms) is a visible outlier; CV 5.5 % is higher than the earlier 1.4 %. Power/thermal not logged.

## Limits

Bisect = one run per commit. No new trace was recorded after the fixes. Stream and water were not run in this session. Visual/gameplay correctness is **not** browser-verified. Not a certified baseline.
