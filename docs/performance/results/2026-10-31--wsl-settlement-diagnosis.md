# WSL `settlement` benchmark — diagnosis (2026-10-31, Sonnet)

**Platform:** WSL2 (kernel 6.18.33.2, headed Chrome, D3D12 Intel Arc 140V). Not comparable with Windows numbers.
**SHA:** `f5bd539b`, clean tree. Fixture `tools-001-v1` (seed 42, High, loadRadius 3, 07:00 spring, rain). 1 rep, 30 s, fresh profile. **n = 1 → diagnosis only, not an A/B, no FPS claim.**
Artifacts: `wsl/2026-10-31--wsl-settlement-settlement-rep1.*`.

## Headline numbers

| Metric | Value |
| --- | --- |
| mean FPS | 34.2 (p1 15) |
| frame p50 / p95 / p99 / max | 25.3 / 30.1 / 66 / 1098 ms |
| update p50 | 5.0 ms |
| render p50 | 19.0 ms (RENDER system 20.7 ms) |
| draw calls | 1832 avg (main 976, shadow 537, mirror 320), 10.8 M tris |
| NPC / FAUNA / WATER CPU | 2.5 / 1.4 / 2.9 ms |

The frame is **render-submission bound** (~75 % of frame time); simulation (NPC+FAUNA+WATER ≈ 6.8 ms) is secondary.

## Where the render time goes (isolation probes, render ms; full = 16.7)

| Probe | render ms | Δ | draws |
| --- | --- | --- | --- |
| hide-settlement | 10.4 | **−6.3** | 1829 → 947 |
| hide-npc-fauna | 10.4 | **−6.3** | → 1503 |
| no-shadows | 10.7 | **−6.0** | → 1311 |
| no-reflections | 14.9 | −1.8 | → 1492 |
| no-postprocessing | 14.6 | −2.1 | – |
| hide-grass | 17.1 | +0.4 (7.2 M tris, GPU-hidden on WSL) | – |
| hide-vegetation / environment / water / terrain | 15.1–17.0 | ≤ −1.6 | – |

Findings:

1. **Settlement props are the largest single family** (678 draws of ~1830; −6.3 ms). Inside it, houseStatic is already batched (66 main / 33 shadow calls). **`decor` is the biggest remaining item: 78 main, 44 mirror, 183 shadow calls (186 k / 105 k / 361 k tris).** `decor` = the settlement trees (`src/settlement/props.ts` `tagSettlementShadowKind(tree, 'decor')`, plus rat nest, foundation pile, treasure-marker bushes). Each tree is an individually cloned multi-mesh `Group`, not batched like world vegetation (region batcher).
2. **Shadow pass submits 537 calls** (vs 976 in main) because the shadow camera sees props outside the player frustum; `decor` (183) and skinned actors (123 skinned calls, 34 skeletons) dominate. Shadow render cost is ≈ 6 ms.
3. **Actors:** NPC+fauna ≈ 6.3 ms render. Main pass: 199.7 actor calls, 124.8 actor material switches, 61.7 program switches, 187.7 skinned calls. Skeleton sharing (Q20) is already on (28.7 skeletons first used). Remaining cost is per-part material/program switching, not skeleton count.
4. **Grass:** 7.2 M tris (≈ 67 % of triangles) but hide-grass is +0.4 ms on WSL → hidden by GPU/driver here; Windows evidence decides. Untouched.
5. **Frame max 1098 ms, 2 long frames, unattributed** (no labelled hitch): cold first-use frame of a fresh profile, same class as earlier WSL reps (Q22 report). Not settlement-specific.
6. **Simulation is cheap:** NPC 2.5 ms (agent updates 1.3, livestock 0.9), collider queries 0.1 ms despite 8.5–12.7 k colliders/frame. No CPU hot spot worth a change. WATER 2.9 ms (mirror) is the next-largest CPU item.

## Fix decision

**No simple, safe fix landed.** The one concrete candidate — batching/instancing the settlement trees (`decor`: ~78 main / 183 shadow / 44 mirror calls) — means either reusing the world vegetation region batcher (needs ownership of `landmarks.trees`: `treeId`, growth stage, felling) or merging per-species templates (risks stage/size-jitter appearance). That is a lifecycle change plus a possible visual compromise, not a one-liner; project rules forbid a parallel batching mechanism and require asking on visual compromises. No code was changed.

### Proposed next slice (not started)

- **Track B candidate: settlement trees through the existing vegetation batcher / instanced templates.** Structural target: `settlement:decor` calls 78/44/183 → ≈ template count per pass. Needs: owner analysis of `landmarks.trees`, then WSL `settlement` A/B n = 3 per arm (structural: decor calls per pass; guards: frame p50/p95/p99, long frames), then Windows A/B.
- Optional: shadow-pass distance cull for small props (visual compromise → author decision).

## Caveats

- Single rep; probe deltas below ~1 ms are noise. Only the ≥ 6 ms probes (settlement, npc-fauna, shadows) are clearly above it.
- Cold-profile first frame inflates `max` / p99.
