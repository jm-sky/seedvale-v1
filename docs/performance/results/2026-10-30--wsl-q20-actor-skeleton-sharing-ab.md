# Q20 — one skeleton per actor (A1), WSL2 A/B (settlement-heavy)

**Date:** 2026-10-30 · **By:** Claude Opus 5.5 · **Platform: WSL2** (Chrome, ANGLE → OpenGL → Mesa D3D12, Intel Arc 140V). **Do not compare with Windows numbers.**
**Verdict: WSL green light (CPU-side slice, queue §0 CPU-slice rule).** Skeleton updates dropped by ~82 % in the main pass and ~73 % in the shadow pass. Draw submissions are unchanged, and no guard metric regressed. Default switched **on** (`?actorSkeletons=0` disables it). The timing gains are larger than ~270 fewer palette updates per frame obviously explain, and WSL `settlement-heavy` is noisy, so **no FPS gain is claimed**. Native Windows confirmation: queue §4.

## Setup

- Build `5c21bad4` (code `a416ff2b`, gitSha verified in every run). A = default at that build (sharing off), B = `&actorSkeletons=1`. Fixture `tools-001-v1`, `settlement-heavy`, High, 30 s, fresh profile, 20 s cooldown, 57 NPCs in every run. Order A1 B1 B2 A2.
- Served tree had one unrelated uncommitted change: `src/world/caves/experimental/v3-grid/gen/caves.ts` (import order only, isolated module that is not wired in).
- Artifacts: `wsl/2026-10-30--wsl-q20-skel-{A1,B1,B2,A2}-settlement-heavy-rep1.*`.
- Change: [implementation notes](../../research/v1-revival/2026-10-30--q20-actor-skeleton-sharing--implementation-notes.md).

## Results

| Run | Arm | Main skinned calls / skeletons first used | Shadow skinned / skeletons | FPS | frame p50 / p95 / p99 / max ms | RENDER p50 ms | Long frames |
| --- | --- | --- | --- | ---: | --- | ---: | ---: |
| A1 | off | 304.2 / 267.4 | 46.2 / 46.2 | 21.8 | 42.9 / 62.6 / 106.9 / 179 | 33.0 | 11 |
| B1 | **on** | 300.6 / **49.0** | 44.6 / **12.2** | 26.1 | 37.8 / 44.0 / 68.7 / 102 | 29.3 | 4 |
| B2 | **on** | 303.2 / **50.5** | 45.3 / **12.2** | 24.7 | 39.5 / 54.4 / 80.6 / 142 | 30.3 | 4 |
| A2 | off | 304.2 / 267.5 | 44.7 / 44.7 | 23.9 | 39.8 / 56.1 / 90.8 / 149 | 31.1 | 10 |

Mirror pass: 2 / 2 in all runs.

## Interpretation

- **Structural saving (deterministic).** About 217 fewer `Skeleton.update()` calls and bone-texture uploads per frame in main, and about 33 fewer in shadow. Skinned call counts are unchanged, as designed. ~50 skeletons in main is consistent with the predicted 1 per female NPC, 2 per male NPC and 1 per animal for the drawn actors.
- **No regression.** Every B run is at or below every A run on frame p50, p95, p99, max, RENDER p50 and long-frame count.
- **FPS.** B averages 25.4 and A 22.9. Same-arm spread is 1.4 (B) and 2.1 (A), so the gap is beyond WSL same-session noise. This is still one WSL session with n = 2, so no gain is claimed; Windows decides.

## Limits

n = 2 per arm, one session, power/thermal not logged. Three other agent sessions were running in WSL (author approved the run). No browser/visual inspection: the visual check stays with the author (queue §2).
