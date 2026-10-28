# Windows Arc — A/B `36e99ef6` vs `f6f6efa2` in one session (settlement-heavy, 1×30 s per run)

**Created:** 2026-10-28 (Claude Code, Sonnet 5.5)
**Purpose:** check whether the FPS drop seen in [the lantern series](./2026-10-28--win-lantern1-settlement-heavy-series.md) (27.6 vs 32.6 FPS) is a code regression or a session/machine shift.
**Setup:** same machine and session, order A1 (`36e99ef6`) → B1 → A2 → B2, 35 s cooldown, fresh Chrome 156 profile per run, High, fixture `tools-001-v1`, **same viewport 1586×806 in all four runs**, 53 NPC, population gate `stable`. "new" = `b52dea86` = `f6f6efa2` + a docs-only commit (no `src/` change). Old SHA ran from a short worktree (`SEEDVALE_REPO`), Vite on a separate port. Artifacts: `results/win/2026-10-28--win-ab-{old,new}-{A1,A2,B1,B2}-settlement-heavy-rep1.*`.

| Run | SHA | FPS | p50 ms | p95 ms | RENDER ms | GPU ms | draw calls | long frames |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | `36e99ef6` | 30.9 | 32.6 | 41.2 | 21.5 | 20.8 | 2252 | 2 |
| B1 | `f6f6efa2` | 32.0 | 32.0 | 36.4 | 21.0 | 21.5 | 2129 | 1 |
| A2 | `36e99ef6` | 33.6 | 30.8 | 35.1 | 19.9 | 21.6 | 2259 | 0 |
| B2 | `f6f6efa2` | 33.1 | 30.9 | 35.4 | 19.9 | 20.1 | 2166 | 1 |

Means: old 32.3 FPS, new 32.6 FPS (difference inside the ±2–3 FPS run-to-run spread). Draw calls −4 % to −6 % with the new lamps, as before.

## Conclusion

- **No regression from the commits `36e99ef6..f6f6efa2` (lantern GLBs, WorkSkirt, palisade collider)** is observable in this session. The earlier 27.6 FPS / p95 57 ms series is therefore a session/machine state effect (that series also had a different viewport, 1536×826, and rising GPU timer / long-frame counts across reps), not a code regression. Cause of that state (power/thermal/driver) is unknown and was not logged.
- Lantern-specific FPS gain: **not measurable here**; the draw-call reduction (−4 to −6 %) is real but its FPS effect is below noise. No isolated lantern A/B was run.
- No code change made; nothing to fix.

## Limits

One run per variant per position (2 per SHA); spread between same-SHA runs is ~2.7 FPS, so differences under ~3 FPS cannot be resolved. Power plan/thermal not logged. Settlement-heavy only. The earlier low-FPS series stays in the repo as a record of a degraded session and should not be used as a baseline.
