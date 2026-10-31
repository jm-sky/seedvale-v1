# Animal surface polish — native Windows A/B (agent-run, diagnostic)

Platform: **native Windows Chrome (headed, ANGLE D3D11)**, run by the agent, not the author's certified Arc session. SHA `977966ac`, seed `415424794`, scenarios `current` and `settlement`, 3 reps × 30 s, fresh profile, 20 s cooldown (`scripts/perf/run-benchmark-series.mjs`; summary `scripts/perf/summarize-ab.mjs`). Arm **A** = original GLBs, arm **C** = polished GLBs (production now). Raw artifacts: `raw/2026-10-31-win-animal-surface-polish/`. Median over reps:

| arm | scenario | n | FPS avg | frame p50 | p95 | p99 | RENDER p50 | update p50 | draws avg | hitches |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | current | 3 | 46.1 | 21.0 | 26.7 | 39.1 | 16.4 | 4.3 | 1716.0 | 0.0 |
| A | settlement | 3 | 44.4 | 21.8 | 27.4 | 60.8 | 17.2 | 4.4 | 1809.0 | 0.0 |
| C | current | 3 | 51.3 | 18.7 | 24.1 | 46.2 | 14.8 | 3.8 | 1711.0 | 0.0 |
| C | settlement | 3 | 45.0 | 22.0 | 26.2 | 37.5 | 17.2 | 4.4 | 1808.0 | 0.0 |

## Reading
- **Draw calls identical** (1716 vs 1711, 1809 vs 1808) — consistent with unchanged geometry/materials.
- `settlement`: no meaningful difference (FPS 44.4 vs 45.0, RENDER p50 17.2 vs 17.2).
- `current`: C looks faster (FPS 46.1 → 51.3) but arm C ran *first* and A second in one session, p99 is worse in C, and the change cannot plausibly alter GPU/CPU cost; treat as **session/ordering noise, not a gain**. No FPS improvement is claimed.
- Conclusion: **no regression observed**; inconclusive about any difference. An ABBA-ordered repeat on the author's Arc session would be needed for certified evidence (queue §4).
